#!/usr/bin/env node
// Port batch edge scripts (add_batch_a_edges, add_batch_b, add_batch_c) into
// the scoped edge files. Determines target file by the scope of the source node.
const fs = require('fs');
const path = require('path');

const SCOPES = ['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'];

// Build node→scope map
const nodeScope = {};
for (const s of SCOPES) {
  const nodes = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/'+s+'/nodes.json')));
  nodes.forEach(n => { nodeScope[n.id] = s; });
}
try {
  const gn = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/global/nodes.json')));
  gn.forEach(n => { nodeScope[n.id] = 'global'; });
} catch(e) {}

// Load existing edge IDs per scope
const scopeEdges = {};
const scopeEdgeIds = {};
for (const s of SCOPES) {
  scopeEdges[s] = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/'+s+'/edges.json')));
  scopeEdgeIds[s] = new Set(scopeEdges[s].map(e => e.id));
}

// Collect new edges from all three batch scripts
function extractEdges(code) {
  // Eval in a restricted context to get newEdges array
  const m = code.match(/const newEdges\s*=\s*(\[[\s\S]*?\]);/);
  if (!m) { console.error('Could not extract newEdges'); return []; }
  return eval(m[1]);
}

const batchFiles = ['add_batch_a_edges','add_batch_b','add_batch_c'];
const allNewEdges = [];
for (const f of batchFiles) {
  const code = fs.readFileSync(path.join(__dirname, f+'.js'), 'utf8');
  const edges = extractEdges(code);
  allNewEdges.push(...edges);
}

console.log('Total batch edges to port:', allNewEdges.length);

// Also extract any new nodes from add_batch_b and add_batch_c (they have node arrays too)
function extractNodes(code) {
  const m = code.match(/const newNodes\s*=\s*(\[[\s\S]*?\]);/);
  if (!m) return [];
  return eval(m[1]);
}

const scopeNodes = {};
for (const s of SCOPES) {
  scopeNodes[s] = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/'+s+'/nodes.json')));
}
const scopeNodeIds = {};
for (const s of SCOPES) {
  scopeNodeIds[s] = new Set(scopeNodes[s].map(n => n.id));
}

let nodesAdded = 0;
for (const f of ['add_batch_b','add_batch_c']) {
  const code = fs.readFileSync(path.join(__dirname, f+'.js'), 'utf8');
  const nodes = extractNodes(code);
  for (const n of nodes) {
    if (!n.id) continue;
    // Determine scope
    let scope = n.scope;
    if (!scope) {
      // Guess from tags/category
      if (n.tags && (n.tags.includes('nazism') || n.tags.includes('holocaust') ||
          n.tags.includes('wwii') || n.tags.includes('history'))) scope = 'global/history';
      else if (n.tags && (n.tags.includes('politics') || n.tags.includes('policy'))) scope = 'global/politics';
      else scope = 'global/history';
    }
    if (!scopeNodeIds[scope]) { console.warn('Unknown scope for node '+n.id+': '+scope); continue; }
    if (scopeNodeIds[scope].has(n.id)) { continue; } // already exists
    n.scope = scope;
    n.cross_scope = false;
    scopeNodes[scope].push(n);
    scopeNodeIds[scope].add(n.id);
    nodeScope[n.id] = scope;
    nodesAdded++;
    console.log('  +node ['+scope+']:', n.id);
  }
}

// Now assign edges to scopes and add
let edgesAdded = 0, edgesSkipped = 0;
const scopeAssignment = {};
for (const e of allNewEdges) {
  if (!e.id || !e.source || !e.target) continue;

  const srcScope = nodeScope[e.source];
  const tgtScope = nodeScope[e.target];

  if (!srcScope) { console.warn('  MISSING source node:', e.source, 'for edge', e.id); continue; }
  if (!tgtScope) { console.warn('  MISSING target node:', e.target, 'for edge', e.id); continue; }

  // Cross-scope edges go to mechanisms; same-scope edges go to that scope
  let destScope;
  if (srcScope === 'mechanisms' || tgtScope === 'mechanisms') {
    destScope = 'mechanisms';
  } else if (srcScope === tgtScope) {
    destScope = srcScope;
  } else {
    // Cross-scope non-mechanism: put in the source scope
    destScope = srcScope;
  }

  if (!scopeEdgeIds[destScope]) { console.warn('Unknown scope for edge:', destScope); continue; }
  if (scopeEdgeIds[destScope].has(e.id)) { edgesSkipped++; continue; }

  scopeEdges[destScope].push(e);
  scopeEdgeIds[destScope].add(e.id);
  edgesAdded++;
  if (!scopeAssignment[destScope]) scopeAssignment[destScope] = 0;
  scopeAssignment[destScope]++;
}

console.log('\nResults:');
console.log('  Nodes added:', nodesAdded);
console.log('  Edges added:', edgesAdded, '(skipped duplicates:', edgesSkipped+')');
console.log('  By scope:', JSON.stringify(scopeAssignment, null, 2));

// Write updated files
for (const s of SCOPES) {
  if (scopeAssignment[s] || nodesAdded > 0) {
    fs.writeFileSync(path.join(__dirname,'../data/'+s+'/edges.json'),
      JSON.stringify(scopeEdges[s], null, 2));
  }
  if (nodesAdded > 0) {
    fs.writeFileSync(path.join(__dirname,'../data/'+s+'/nodes.json'),
      JSON.stringify(scopeNodes[s], null, 2));
  }
}

// Edge integrity check
console.log('\nEdge integrity check:');
let orphans = 0;
for (const s of SCOPES) {
  const allScopeIds = new Set(Object.keys(nodeScope));
  for (const e of scopeEdges[s]) {
    if (!allScopeIds.has(e.source)) { console.log('  ORPHAN src:', e.source, 'in', s); orphans++; }
    if (!allScopeIds.has(e.target)) { console.log('  ORPHAN tgt:', e.target, 'in', s); orphans++; }
  }
}
console.log('  Orphans:', orphans);
