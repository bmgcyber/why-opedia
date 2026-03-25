#!/usr/bin/env node
const fs = require('fs');
const BASE = '/home/gorg/why/why-opedia/data';

function read(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function write(p, d) { fs.writeFileSync(p, JSON.stringify(d, null, 2)); }

// Fix mechanisms/edges.json - remove authoritarianism references
const mePath = BASE+'/mechanisms/edges.json';
let me = read(mePath);
const badMech = me.filter(e => e.source === 'authoritarianism' || e.target === 'authoritarianism');
console.log('Removing mechanism edges:', badMech.map(e=>e.id));
me = me.filter(e => e.source !== 'authoritarianism' && e.target !== 'authoritarianism');
write(mePath, me);

// Fix politics/edges.json
const pePath = BASE+'/global/politics/edges.json';
let pe = read(pePath);

// Fix keynesian_economics -> keynesianism
pe = pe.map(e => {
  if (e.source === 'keynesian_economics') {
    return Object.assign({}, e, { source: 'keynesianism', id: e.id.replace('keynesian_economics', 'keynesianism') });
  }
  return e;
});

// Remove authoritarianism references
const badPol = pe.filter(e => e.source === 'authoritarianism' || e.target === 'authoritarianism');
console.log('Removing politics edges:', badPol.map(e=>e.id));
pe = pe.filter(e => e.source !== 'authoritarianism' && e.target !== 'authoritarianism');
write(pePath, pe);

console.log('Fixed. Edges now - mechanisms:', me.length, 'politics:', pe.length);

// Full orphan check
const mn = read(BASE+'/mechanisms/nodes.json');
const medn = read(BASE+'/global/media/nodes.json');
const pn = read(BASE+'/global/politics/nodes.json');
const psn = read(BASE+'/global/psychology/nodes.json');
const hn = read(BASE+'/global/health/nodes.json');
const hitn = read(BASE+'/global/history/nodes.json');
const mede = read(BASE+'/global/media/edges.json');
const pse = read(BASE+'/global/psychology/edges.json');
const he = read(BASE+'/global/health/edges.json');
const hite = read(BASE+'/global/history/edges.json');

const allNodes = new Set();
for (const n of [...mn, ...medn, ...pn, ...psn, ...hn, ...hitn]) allNodes.add(n.id);

let orphans = 0;
for (const edgeList of [me, mede, pe, pse, he, hite]) {
  for (const e of edgeList) {
    if (!allNodes.has(e.source)) { console.error('ORPHAN source: '+e.source+' in '+e.id); orphans++; }
    if (!allNodes.has(e.target)) { console.error('ORPHAN target: '+e.target+' in '+e.id); orphans++; }
  }
}
console.log('Total orphans:', orphans);
