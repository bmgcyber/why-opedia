#!/usr/bin/env node
// dedup_cross_scope_edges.js
// Finds and removes duplicate edges: if an edge exists in BOTH
// mechanisms/edges.json AND a scope-specific edges.json,
// keep it only in mechanisms/edges.json.
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const mechEdges = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const mechEdgeIds = new Set(mechEdges.map(e => e.id));
const mechNodeIds = new Set(JSON.parse(fs.readFileSync(D('data/mechanisms/nodes.json'))).map(n => n.id));

const scopes = ['global/media','global/health','global/psychology','global/politics','global/history'];
let totalRemoved = 0;

for (const s of scopes) {
  const f = D('data/'+s+'/edges.json');
  const edges = JSON.parse(fs.readFileSync(f));
  const before = edges.length;

  const cleaned = edges.filter(e => {
    // Keep if NOT already in mechanisms/edges.json
    if (!mechEdgeIds.has(e.id)) return true;

    // Duplicate: this edge ID exists in both files
    // Verify at least one endpoint is a mechanism node (otherwise both copies are wrong)
    const srcIsMech = mechNodeIds.has(e.source);
    const tgtIsMech = mechNodeIds.has(e.target);
    if (srcIsMech || tgtIsMech) {
      // Remove from scope file — it belongs in mechanisms
      return false;
    }
    // Both endpoints are scope nodes with same ID in mechanisms — unusual, keep in scope file
    return true;
  });

  if (cleaned.length < before) {
    fs.writeFileSync(f, JSON.stringify(cleaned, null, 2));
    totalRemoved += (before - cleaned.length);
    console.log(s, 'removed', before - cleaned.length, 'duplicate edges →', cleaned.length);
  } else {
    console.log(s, 'no duplicates found');
  }
}

console.log('Total removed:', totalRemoved);

// Final integrity check
const allIds = new Set();
for (const s of ['mechanisms',...scopes]) JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n=>allIds.add(n.id));
let orphans = 0;
const allEdgeFiles = ['mechanisms',...scopes].map(s => JSON.parse(fs.readFileSync(D('data/'+s+'/edges.json')))).flat();
allEdgeFiles.forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
// Check for duplicate edge IDs across all files
const allEdgeIds = {};
allEdgeFiles.forEach(e => {
  if (allEdgeIds[e.id]) console.log('DUP edge ID:', e.id);
  allEdgeIds[e.id] = true;
});
console.log('Total edges:', allEdgeFiles.length, '| Orphans:', orphans);
