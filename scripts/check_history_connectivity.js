#!/usr/bin/env node
const fs = require('fs');
const edges = JSON.parse(fs.readFileSync('data/global/history/edges.json'));
const nodes = JSON.parse(fs.readFileSync('data/global/history/nodes.json'));
const counts = {};
nodes.forEach(n => counts[n.id] = 0);
edges.forEach(e => {
  if (counts[e.source] !== undefined) counts[e.source]++;
  if (counts[e.target] !== undefined) counts[e.target]++;
});
const zero = Object.entries(counts).filter(([,c]) => c === 0).map(([id]) => id);
const one = Object.entries(counts).filter(([,c]) => c === 1).map(([id]) => id);
console.log('Zero-edge nodes ('+zero.length+'):');
zero.forEach(id => console.log(' ', id));
console.log('\nOne-edge nodes ('+one.length+'):');
one.forEach(id => console.log(' ', id));
console.log('\nTotal nodes:', nodes.length, '| Total edges:', edges.length);
