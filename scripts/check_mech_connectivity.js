#!/usr/bin/env node
const fs = require('fs');
const mechEdges = JSON.parse(fs.readFileSync('data/mechanisms/edges.json'));
const mechNodes = JSON.parse(fs.readFileSync('data/mechanisms/nodes.json'));
const mechNodeIds = new Set(mechNodes.map(n => n.id));

// Count cross-scope connections per mechanism node
const counts = {};
for (const n of mechNodes) counts[n.id] = 0;
for (const e of mechEdges) {
  const srcIsMech = mechNodeIds.has(e.source);
  const tgtIsMech = mechNodeIds.has(e.target);
  if (srcIsMech && !tgtIsMech) counts[e.source] = (counts[e.source] || 0) + 1;
  if (tgtIsMech && !srcIsMech) counts[e.target] = (counts[e.target] || 0) + 1;
}

const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1]);
console.log('Least connected mechanism nodes (cross-scope edges):');
sorted.slice(0, 25).forEach(([id, c]) => console.log(c, id));
console.log('\nTotal mechanism nodes:', mechNodes.length);
console.log('Nodes with 0 cross-scope edges:', sorted.filter(([,c]) => c === 0).length);
console.log('Nodes with 1 cross-scope edge:', sorted.filter(([,c]) => c === 1).length);
console.log('Nodes with 2 cross-scope edges:', sorted.filter(([,c]) => c === 2).length);
