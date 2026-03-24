#!/usr/bin/env node
const fs = require('fs');
const edges = JSON.parse(fs.readFileSync('data/global/psychology/edges.json'));
const nodes = JSON.parse(fs.readFileSync('data/global/psychology/nodes.json'));
const nodeIds = new Set(nodes.map(n => n.id));
const counts = {};
nodes.forEach(n => counts[n.id] = 0);
edges.forEach(e => {
  if (counts[e.source] !== undefined) counts[e.source]++;
  if (counts[e.target] !== undefined) counts[e.target]++;
});
Object.entries(counts).sort((a, b) => a[1] - b[1]).forEach(([id, c]) => console.log(c, id));
