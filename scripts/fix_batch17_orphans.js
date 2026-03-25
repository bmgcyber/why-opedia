#!/usr/bin/env node
const fs = require('fs');
const BASE = '/home/gorg/why/why-opedia/data';

function read(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function write(p, d) { fs.writeFileSync(p, JSON.stringify(d, null, 2)); }

// Fix politics/edges.json - remove theocracy__secularism (secularism doesn't exist)
const pePath = BASE+'/global/politics/edges.json';
let pe = read(pePath);
pe = pe.filter(e => e.id !== 'theocracy__secularism');
write(pePath, pe);
console.log('Removed theocracy__secularism edge. Politics edges now:', pe.length);

// Fix history/edges.json - change maoist_communism to communism or red_scare
const hitePath = BASE+'/global/history/edges.json';
let hite = read(hitePath);
hite = hite.map(e => {
  if (e.target === 'maoist_communism') {
    return Object.assign({}, e, { target: 'red_scare', id: e.id.replace('maoist_communism', 'red_scare') });
  }
  return e;
});
write(hitePath, hite);
console.log('Fixed maoist_communism -> red_scare. History edges now:', hite.length);

// Full orphan check
const mn = read(BASE+'/mechanisms/nodes.json');
const medn = read(BASE+'/global/media/nodes.json');
const pn = read(BASE+'/global/politics/nodes.json');
const psn = read(BASE+'/global/psychology/nodes.json');
const hn = read(BASE+'/global/health/nodes.json');
const hitn = read(BASE+'/global/history/nodes.json');
const me = read(BASE+'/mechanisms/edges.json');
const mede = read(BASE+'/global/media/edges.json');
const pse = read(BASE+'/global/psychology/edges.json');
const he = read(BASE+'/global/health/edges.json');

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
const totalNodes = mn.length + medn.length + pn.length + psn.length + hn.length + hitn.length;
const totalEdges = me.length + mede.length + pe.length + pse.length + he.length + hite.length;
console.log('Grand total:', totalNodes, 'nodes,', totalEdges, 'edges');
