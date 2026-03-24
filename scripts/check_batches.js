#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Load all nodes across all scopes
const scopes = ['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'];
const allIds = new Set();
for (const s of scopes) {
  const nodes = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/'+s+'/nodes.json')));
  nodes.forEach(n => allIds.add(n.id));
}
try {
  const gn = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/global/nodes.json')));
  gn.forEach(n => allIds.add(n.id));
} catch(e) {}

console.log('Total node IDs in new structure:', allIds.size);

['add_batch_a_edges','add_batch_b','add_batch_c'].forEach(scriptName => {
  const code = fs.readFileSync(path.join(__dirname, scriptName+'.js'),'utf8');
  const edgeMatches = [...code.matchAll(/source: '([^']+)',\s*\n\s*target: '([^']+)'/g)];
  console.log('\n'+scriptName+'.js ('+edgeMatches.length+' edges):');
  let valid = 0, invalid = 0;
  for (const m of edgeMatches) {
    const src = m[1], tgt = m[2];
    const srcOk = allIds.has(src), tgtOk = allIds.has(tgt);
    if (!srcOk || !tgtOk) {
      console.log('  MISSING:', src+(srcOk?'':' [?]'), '->', tgt+(tgtOk?'':' [?]'));
      invalid++;
    } else valid++;
  }
  console.log('  Valid: '+valid+', Invalid: '+invalid);
});
