#!/usr/bin/env node
// Shows the existing cross-scope edges for mechanism nodes with low connectivity
const fs = require('fs');
const mechEdges = JSON.parse(fs.readFileSync('data/mechanisms/edges.json'));
const mechNodes = JSON.parse(fs.readFileSync('data/mechanisms/nodes.json'));
const mechNodeIds = new Set(mechNodes.map(n => n.id));

const scopes = ['global/media','global/health','global/psychology','global/politics','global/history'];
const scopeNodeFiles = scopes.map(s => JSON.parse(fs.readFileSync('data/'+s+'/nodes.json')));
const scopeNodeIds = new Set(scopeNodeFiles.flat().map(n => n.id));

const targets = process.argv.slice(2).length > 0 ? process.argv.slice(2) :
  ['purdue_pharma_oxycontin','opioid_epidemic','advaita_vedanta','religious_trauma',
   'egyptian_monotheism','greek_mythology','availability_heuristic'];

for (const t of targets) {
  const edges = mechEdges.filter(e => (e.source === t || e.target === t) &&
    (scopeNodeIds.has(e.source) || scopeNodeIds.has(e.target)));
  console.log(t + ' ('+edges.length+' cross-scope edges):');
  edges.forEach(e => console.log('  '+e.source+' --['+e.type+']-> '+e.target));
}
