#!/usr/bin/env node
// Adds missing nodes referenced by add_mech_enrichment.js
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

function addNodes(filePath, newNodes) {
  const existing = JSON.parse(fs.readFileSync(filePath));
  const ids = new Set(existing.map(n => n.id));
  let added = 0;
  for (const n of newNodes) {
    if (!ids.has(n.id)) { existing.push(n); ids.add(n.id); added++; }
  }
  if (added) fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  console.log(path.basename(path.dirname(filePath)), 'nodes: added', added);
  return added;
}

// History nodes
addNodes(D('data/global/history/nodes.json'), [
  {
    id: 'sept_11_attacks', label: 'September 11 Attacks', node_type: 'reference', category: 'event',
    decade: '2000s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/September_11_attacks',
    summary: 'The September 11, 2001 terrorist attacks — four coordinated suicide attacks by Al-Qaeda against the United States — killed 2,977 people and triggered two decades of American foreign policy reorientation. The attacks produced the AUMF, the Department of Homeland Security, the Patriot Act, mass surveillance programs, and the invasions of Afghanistan and Iraq. 9/11 restructured American political culture around existential threat, reshaping civil liberties, immigration policy, and foreign policy coalitions for a generation.',
    tags: ['terrorism', 'al-qaeda', 'us-foreign-policy', 'surveillance', 'war-on-terror', 'trauma']
  },
  {
    id: 'civil_rights_movement', label: 'American Civil Rights Movement', node_type: 'reference', category: 'movement',
    decade: '1950s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Civil_rights_movement',
    summary: 'The American Civil Rights Movement (1954–1968) dismantled Jim Crow segregation through nonviolent direct action, legal challenges, and federal legislation. Key victories: Brown v. Board (1954), Civil Rights Act (1964), Voting Rights Act (1965). The movement developed the tactical and theological toolkit of nonviolent resistance (drawn from Gandhi), established the SNCC/SCLC organizational infrastructure, and demonstrated that the Overton window on racial equality could be shifted through strategic confrontation.',
    tags: ['civil-rights', 'racial-justice', 'nonviolence', 'segregation', 'mlk', 'sncc', 'voting-rights']
  },
  {
    id: 'manifest_destiny', label: 'Manifest Destiny', node_type: 'reference', category: 'ideology',
    decade: '1840s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Manifest_destiny',
    summary: 'Manifest Destiny was the 19th-century American ideology that the United States was divinely ordained to expand across the North American continent. Coined by John L. O\'Sullivan in 1845, the concept justified the Mexican-American War, the Indian Removal Act, and the dispossession of Native peoples as providential progress. It combined Protestant Christian nationalism, racial hierarchies, and republican self-governance into a single expansionist theology.',
    tags: ['expansionism', 'colonialism', 'christianity', 'nationalism', 'native-american', 'us-history']
  },
  {
    id: 'qin_dynasty', label: 'Qin Dynasty', node_type: 'reference', category: 'institution',
    decade: '220s BCE', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Qin_dynasty',
    summary: 'The Qin Dynasty (221–206 BCE), under Qin Shi Huang, achieved the first unification of China through military conquest and Legalist administrative reforms: standardized writing, weights, measures, and law; a centralized bureaucracy replacing feudal lords; the Great Wall\'s initial construction; and the burning of Confucian books. Its Legalist state-building model was both enormously effective (unification) and catastrophically unstable (collapse within 15 years), establishing the Han synthesis of Confucian ideology and Legalist technique that defined Chinese governance.',
    tags: ['china', 'legalism', 'unification', 'qin-shi-huang', 'bureaucracy', 'great-wall']
  },
]);

// Politics nodes
addNodes(D('data/global/politics/nodes.json'), [
  {
    id: 'january_6_capitol', label: 'January 6 Capitol Attack', node_type: 'reference', category: 'event',
    decade: '2020s', scope: 'global/politics', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/2021_United_States_Capitol_attack',
    summary: 'The January 6, 2021 attack on the United States Capitol — in which a mob of Trump supporters breached the building to prevent the certification of the 2020 presidential election — was the first violent disruption of peaceful power transfer in American history. The attack drew on Stop the Steal misinformation, Christian nationalist mobilization, militia networks, and the Stop the Steal rally at the Ellipse. The House Select Committee found Trump directly responsible for inciting the attack.',
    tags: ['trump', 'insurrection', 'democracy', 'christian-nationalism', 'election-denial', 'qanon']
  },
]);

// Media nodes
addNodes(D('data/global/media/nodes.json'), [
  {
    id: 'televangelism', label: 'Televangelism', node_type: 'reference', category: 'movement',
    decade: '1970s', scope: 'global/media', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Televangelism',
    summary: 'Televangelism — religious broadcasting via television — industrialized evangelical Christianity as a media product. Oral Roberts, Pat Robertson, Jim Bakker, Jimmy Swaggart, and later Joel Osteen built media empires combining prosperity gospel theology, faith healing theater, and direct donation solicitation. The format pioneered many techniques later adopted by political media: personal charismatic authority, emotional manipulation, donor cultivation, and manufactured testimony.',
    tags: ['religion', 'media', 'prosperity-gospel', 'evangelicalism', 'television', 'fundraising']
  },
]);

// Re-run integrity check
const allIds = new Set();
const scopes = ['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'];
for (const s of scopes) JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id));
const mechEdges = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
let orphans = 0;
for (const e of mechEdges) {
  if (allIds.has(e.source) === false) { console.log('ORPHAN src:', e.source); orphans++; }
  if (allIds.has(e.target) === false) { console.log('ORPHAN tgt:', e.target); orphans++; }
}
console.log('Total nodes:', allIds.size, '| Orphans:', orphans);
