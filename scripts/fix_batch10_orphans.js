#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const pn = JSON.parse(fs.readFileSync(D('data/global/politics/nodes.json')));
const pnIds = new Set(pn.map(n=>n.id));

if (!pnIds.has('police_brutality')) {
  pn.push({
    id: 'police_brutality',
    label: 'Police Brutality & Accountability',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1960s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Police_brutality_in_the_United_States',
    summary: 'Excessive use of force by law enforcement, disproportionately affecting Black, Indigenous, and Latino communities; documented by citizen video since Rodney King (1991); central issue of the Black Lives Matter movement; connected to qualified immunity doctrine.',
    tags: ['police', 'accountability', 'use of force', 'BLM', 'qualified immunity', 'racial disparities', 'reform', 'abolition']
  });
  console.log('Added police_brutality');
}

if (!pnIds.has('surveillance_state')) {
  pn.push({
    id: 'surveillance_state',
    label: 'Mass Surveillance State',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2000s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Mass_surveillance',
    summary: 'Government programs of bulk data collection and mass surveillance of citizens without individualized suspicion; NSA PRISM program (revealed by Snowden 2013) collected data on millions; China\'s social credit system; facial recognition.',
    tags: ['surveillance', 'NSA', 'PRISM', 'Snowden', 'facial recognition', 'social credit', 'privacy', 'civil liberties']
  });
  console.log('Added surveillance_state');
}

fs.writeFileSync(D('data/global/politics/nodes.json'), JSON.stringify(pn, null, 2));
console.log('Politics nodes total:', pn.length);

// Verify
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s => {
  JSON.parse(fs.readFileSync(D('data/'+s+'/edges.json'))).forEach(e => {
    if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
    if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
  });
});
console.log('Total orphans:', orphans);
