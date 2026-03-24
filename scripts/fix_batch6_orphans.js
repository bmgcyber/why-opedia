#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

// Fix wrong node IDs in edges files
let me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
let pse = JSON.parse(fs.readFileSync(D('data/global/psychology/edges.json')));

// Fix in_group_out_group -> in_group_out_group_dynamics
me = me.map(e => {
  if (e.source === 'in_group_out_group') e.source = 'in_group_out_group_dynamics';
  if (e.target === 'in_group_out_group') e.target = 'in_group_out_group_dynamics';
  return e;
});

// Fix incel_culture -> incel_community
pse = pse.map(e => {
  if (e.source === 'incel_culture') e.source = 'incel_community';
  if (e.target === 'incel_culture') e.target = 'incel_community';
  return e;
});

fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
fs.writeFileSync(D('data/global/psychology/edges.json'), JSON.stringify(pse, null, 2));
console.log('Fixed incel_culture->incel_community and in_group_out_group->in_group_out_group_dynamics');

// Add missing nodes
const hn = JSON.parse(fs.readFileSync(D('data/global/history/nodes.json')));
const pn = JSON.parse(fs.readFileSync(D('data/global/politics/nodes.json')));
const psn = JSON.parse(fs.readFileSync(D('data/global/psychology/nodes.json')));
const hnIds = new Set(hn.map(n=>n.id));
const pnIds = new Set(pn.map(n=>n.id));
const psnIds = new Set(psn.map(n=>n.id));

if (!hnIds.has('progressive_era')) {
  hn.push({
    id: 'progressive_era',
    label: 'Progressive Era',
    node_type: 'era',
    category: 'era',
    decade: '1890s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Progressive_Era',
    summary: 'US reform period (1890s-1920s) responding to Gilded Age inequality, monopoly power, and political corruption; produced antitrust law, food safety regulation, women\'s suffrage, direct election of senators, and early conservation.',
    tags: ['progressivism', 'reform', 'trust busting', 'suffrage', 'muckraking', 'roosevelt', 'wilson', 'regulation']
  });
  console.log('Added progressive_era, total history:', hn.length);
}

if (!pnIds.has('reparations_debate')) {
  pn.push({
    id: 'reparations_debate',
    label: 'Reparations Debate',
    node_type: 'debate',
    category: 'debate',
    decade: '1990s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Reparations_for_slavery_in_the_United_States',
    summary: 'Ongoing debate over whether the US should provide reparations for slavery and subsequent racial oppression; Ta-Nehisi Coates renewed national discussion in 2014.',
    tags: ['reparations', 'slavery', 'racial justice', 'coates', 'HR 40', 'economic justice', 'history']
  });
  console.log('Added reparations_debate, total politics:', pn.length);
}

if (!psnIds.has('satanic_panic')) {
  psn.push({
    id: 'satanic_panic',
    label: 'Satanic Panic',
    node_type: 'event',
    category: 'event',
    decade: '1980s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Satanic_panic',
    summary: '1980s-90s wave of false accusations of Satanic ritual abuse driven by moral panic, leading interview techniques, and false memories; produced wrongful convictions including the McMartin preschool case.',
    tags: ['moral panic', 'false memory', 'mcmartin', 'ritual abuse', 'hysteria', 'media', 'wrongful conviction']
  });
  console.log('Added satanic_panic');
}

if (!psnIds.has('antisemitism')) {
  psn.push({
    id: 'antisemitism',
    label: 'Antisemitism',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '100s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Antisemitism',
    summary: 'Prejudice against, hatred of, or discrimination against Jews; the oldest continuous form of bigotry in Western history, recurring across ideological contexts from medieval Christendom to modern far-right movements.',
    tags: ['antisemitism', 'judaism', 'racism', 'hatred', 'holocaust', 'conspiracy', 'scapegoating', 'pogrom']
  });
  console.log('Added antisemitism');
}

fs.writeFileSync(D('data/global/history/nodes.json'), JSON.stringify(hn, null, 2));
fs.writeFileSync(D('data/global/politics/nodes.json'), JSON.stringify(pn, null, 2));
fs.writeFileSync(D('data/global/psychology/nodes.json'), JSON.stringify(psn, null, 2));
console.log('History nodes:', hn.length, 'Politics nodes:', pn.length, 'Psych nodes:', psn.length);

// Verify integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
['global/politics','global/history','mechanisms','global/health','global/psychology','global/media'].forEach(s => {
  JSON.parse(fs.readFileSync(D('data/'+s+'/edges.json'))).forEach(e => {
    if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source, 'edge:', e.id); orphans++; }
    if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target, 'edge:', e.id); orphans++; }
  });
});
console.log('Total orphans:', orphans);
