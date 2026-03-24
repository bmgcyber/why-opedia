#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const mechIds = new Set(JSON.parse(fs.readFileSync(D('data/mechanisms/nodes.json'))).map(n=>n.id));
const mechEdges = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));

const scopes = ['global/politics','global/history'];
for (const s of scopes) {
  const nodes = JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json')));
  const nodeIds = new Set(nodes.map(n=>n.id));
  const connected = new Set();
  for (const e of mechEdges) {
    if (nodeIds.has(e.source) && !mechIds.has(e.source)) connected.add(e.source);
    if (nodeIds.has(e.target) && !mechIds.has(e.target)) connected.add(e.target);
  }
  const pct = Math.round(connected.size/nodes.length*100);
  console.log('\n'+s+': '+nodes.length+' nodes, '+connected.size+' connected to mechanisms ('+pct+'%)');
  const unconnected = nodes.filter(n => !connected.has(n.id) && n.category !== 'portal');
  console.log('Unconnected ('+unconnected.length+'):');
  unconnected.forEach(n => console.log('  '+n.id+' | '+n.category+' | '+n.label.substring(0,50)));
}
