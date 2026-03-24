#!/usr/bin/env node
// Fix nodes that exist in both mechanisms and scope-specific files.
// Strategy: keep in mechanisms only; move scope-specific edges to mechanisms/edges.json.
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const SCOPE_DUPS = {
  'global/history':  ['papal_authority','catholic_clergy_abuse','blood_libel_myth','pogroms','prosperity_gospel','religious_trauma'],
  'global/politics': ['christian_nationalism','church_state_entanglement'],
  'global/media':    ['qanon'],
};

// Load mechanism edges + existing IDs
const mechEdges   = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const mechEdgeIds = new Set(mechEdges.map(e => e.id));

let nodesRemoved = 0, edgesMoved = 0, edgesSkipped = 0;

for (const [scope, dupIds] of Object.entries(SCOPE_DUPS)) {
  const dupSet = new Set(dupIds);

  // ── Remove duplicate nodes from scope file ──
  const nodes = JSON.parse(fs.readFileSync(D('data/'+scope+'/nodes.json')));
  const before = nodes.length;
  const filtered = nodes.filter(n => !dupSet.has(n.id));
  nodesRemoved += before - filtered.length;
  fs.writeFileSync(D('data/'+scope+'/nodes.json'), JSON.stringify(filtered, null, 2));

  // ── Move affected edges from scope file to mechanisms ──
  const scopeEdges = JSON.parse(fs.readFileSync(D('data/'+scope+'/edges.json')));
  const keep = [];
  for (const e of scopeEdges) {
    if (dupSet.has(e.source) || dupSet.has(e.target)) {
      if (!mechEdgeIds.has(e.id)) {
        mechEdges.push(e);
        mechEdgeIds.add(e.id);
        edgesMoved++;
        console.log('  Moved:', e.id);
      } else {
        edgesSkipped++;
        console.log('  Skipped (dup):', e.id);
      }
    } else {
      keep.push(e);
    }
  }
  fs.writeFileSync(D('data/'+scope+'/edges.json'), JSON.stringify(keep, null, 2));
}

fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(mechEdges, null, 2));

console.log('\nSummary:');
console.log('  Nodes removed from scope files:', nodesRemoved);
console.log('  Edges moved to mechanisms:', edgesMoved);
console.log('  Edges skipped (already in mechanisms):', edgesSkipped);
console.log('  Mechanism edges total:', mechEdges.length);

// Full integrity check
const allNodeIds = new Set();
const scopes = ['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'];
for (const s of scopes) {
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allNodeIds.add(n.id));
}
let orphans = 0;
for (const s of scopes) {
  for (const e of JSON.parse(fs.readFileSync(D('data/'+s+'/edges.json')))) {
    if (!allNodeIds.has(e.source)) { console.log('ORPHAN src:', e.source, s, e.id); orphans++; }
    if (!allNodeIds.has(e.target)) { console.log('ORPHAN tgt:', e.target, s, e.id); orphans++; }
  }
}
console.log('  Orphans after fix:', orphans);
