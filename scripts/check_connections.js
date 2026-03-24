#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const mechIds = new Set(JSON.parse(fs.readFileSync(path.join(__dirname,'../data/mechanisms/nodes.json'))).map(n=>n.id));
const mechEdges = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/mechanisms/edges.json')));

const scopes = ['global/media','global/health','global/psychology'];
for (const scope of scopes) {
  const nodes = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/'+scope+'/nodes.json')));
  const nodeIds = new Set(nodes.map(n=>n.id));
  const connected = new Set();
  for (const e of mechEdges) {
    if (nodeIds.has(e.source)) connected.add(e.source);
    if (nodeIds.has(e.target)) connected.add(e.target);
  }
  const unconnected = nodes.filter(n => n.category !== 'portal' && !connected.has(n.id));
  console.log('\n'+scope+' — nodes NOT connected to mechanisms ('+unconnected.length+'):');
  unconnected.forEach(n => console.log('  '+n.id+' | '+n.category+' | '+n.label));
}

// Also show which mechanisms have the fewest cross-scope connections
const crossEdges = mechEdges.filter(e => {
  return mechIds.has(e.source) && !mechIds.has(e.target) ||
         !mechIds.has(e.source) && mechIds.has(e.target);
});
const mechCounts = {};
for (const e of crossEdges) {
  const mechId = mechIds.has(e.source) ? e.source : e.target;
  mechCounts[mechId] = (mechCounts[mechId] || 0) + 1;
}
const mechNodes = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/mechanisms/nodes.json')));
const lowConnMech = mechNodes.filter(n => (mechCounts[n.id]||0) < 2);
console.log('\nMechanism nodes with <2 cross-scope edges ('+lowConnMech.length+'):');
lowConnMech.slice(0,20).forEach(n => console.log('  '+n.id+' ('+( mechCounts[n.id]||0)+') | '+n.label));
