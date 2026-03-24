#!/usr/bin/env node
// add_structural_nodes_mech_edges.js — mechanism edges for WWII, Renaissance, Mongol, Korean War, Roman Republic
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const exIds = new Set(me.map(e => e.id));

const batch = [
  // ── world_war_ii ──────────────────────────────────────────────────────────
  { id: 'dehumanization__world_war_ii',
    source: 'dehumanization', target: 'world_war_ii', type: 'ENABLED',
    label: 'WWII\'s mass atrocities required systematic dehumanization of civilian populations on multiple fronts',
    note: 'WWII required dehumanization at scale: Jews as subhumans (Untermenschen) in Nazi ideology; Japanese as apes and vermin in American propaganda (enabling civilian bombing acceptance); Soviet enemies as Bolshevik-Jewish conspirators; Chinese civilians as acceptable collateral in Japanese military planning. The Pacific War\'s conduct on both sides — prisoner treatment, civilian targeting, Nanjing massacre — required populations on both sides to dehumanize the other. WWII\'s unprecedented civilian death toll was not a failure of dehumanization but its success.',
    confidence: 'high' },
  { id: 'democratic_backsliding__world_war_ii',
    source: 'democratic_backsliding', target: 'world_war_ii', type: 'ENABLED',
    label: 'WWII was produced by the democratic backsliding of the 1930s — Hitler, Mussolini, and Japanese militarism were democratic collapse',
    note: 'WWII was the consequence of the 1930s democratic backsliding wave: Hitler came to power through legal constitutional manipulation of the Weimar Republic (January 1933, legal appointment as Chancellor, then enabling acts); Mussolini had already dismantled Italian democracy (1922-25); Japanese parliamentary democracy was hollowed out by military control. The war\'s origin is also the democratic backsliding story: authoritarian leaders who used democratic forms to destroy democracy, then used the resulting unaccountable power to wage aggressive war.',
    confidence: 'high' },
  { id: 'collective_trauma__world_war_ii',
    source: 'collective_trauma', target: 'world_war_ii', type: 'ENABLED',
    label: 'WWII produced collective trauma at civilizational scale that shaped postwar culture, policy, and psychology for generations',
    note: 'WWII produced collective trauma transmitted across generations: Holocaust survivor transmission to children and grandchildren; Japanese generational hibakusha (atomic bomb survivor) trauma; British "Blitz spirit" and subsequent post-war psychological adjustment; Soviet Great Patriotic War trauma producing a culture of memory and sacrifice that persisted into the Putin era. The postwar international institutional project (UN, Marshall Plan, Nuremberg) is itself a collective trauma response — building institutions to prevent repetition of the traumatic event.',
    confidence: 'high' },

  // ── renaissance ───────────────────────────────────────────────────────────
  { id: 'cultural_hegemony__renaissance',
    source: 'cultural_hegemony', target: 'renaissance', type: 'ENABLED',
    label: 'The Renaissance established Italian and then European classical culture as universal hegemony, displacing Islamic and Byzantine cultural authority',
    note: 'The Renaissance\'s cultural hegemony project was explicit: humanism asserted classical Greek and Latin culture as universal standards of excellence, displacing the Islamic intellectual tradition (which had preserved and advanced classical learning) and Byzantine culture (which had maintained it). The Renaissance\'s claim that Italy was the heir of Rome, and that Europe was the heir of Greece, was a cultural hegemony argument that made European culture the norm against which all others were measured — with consequences for colonialism and orientalism.',
    confidence: 'medium' },

  // ── mongol_empire ─────────────────────────────────────────────────────────
  { id: 'dehumanization__mongol_empire',
    source: 'dehumanization', target: 'mongol_empire', type: 'ENABLED',
    label: 'Mongol conquests required dehumanization of sedentary civilizations as weak and corrupt compared to nomadic virtue',
    note: 'Mongol imperial ideology required dehumanization of sedentary populations: in Mongol cosmology, the sedentary farmers and city-dwellers had forfeited the natural virtue of nomadic life and could be subjected or eliminated without moral consequence. The wholesale destruction of cities (Urgench, Baghdad, Kiev) — where entire populations were massacred — required an ideological framework that removed civilian populations from moral consideration. Mongol dehumanization was class-based (sedentary vs. nomadic) rather than racial, but its functional result was indistinguishable.',
    confidence: 'medium' },

  // ── roman_republic ────────────────────────────────────────────────────────
  { id: 'democratic_backsliding__roman_republic',
    source: 'democratic_backsliding', target: 'roman_republic', type: 'ENABLED',
    label: 'Rome\'s Republic-to-Empire transition is the foundational historical case of democratic backsliding',
    note: 'The Roman Republic\'s fall is the paradigm case that political scientists use to analyze democratic backsliding: no single violent coup but a series of constitutional violations, each normalized by the next; military personal loyalty to commanders (Marius\'s reforms, 107 BCE) replacing civic loyalty; economic inequality (land concentration post-Punic Wars) destroying the small-farmer citizen soldier base; and ultimately Octavian\'s complete constitutional capture while preserving Republican institutions as empty shells. Levitsky and Ziblatt\'s \"How Democracies Die\" opens with Rome.',
    confidence: 'high' },
  { id: 'preference_falsification__roman_republic',
    source: 'preference_falsification', target: 'roman_republic', type: 'ENABLED',
    label: 'The Senate\'s inability to express true preferences under Julius Caesar demonstrates preference falsification under autocratic threat',
    note: 'The Roman Senate\'s behavior under Caesar\'s dictatorship is a historical case of preference falsification: senators who privately opposed Caesar\'s constitutional violations voted for honors (dictator perpetuo) and submitted publicly, because the cost of expressing genuine preferences was death. The 23 senators who participated in the Ides of March assassination were the false-preference expression tipping point — when enough senators believed others shared their preferences, they could act collectively. Timur Kuran\'s preference falsification theory maps precisely onto the late Roman Republic.',
    confidence: 'medium' },

  // ── julius_caesar ─────────────────────────────────────────────────────────
  { id: 'manufactured_consent__julius_caesar',
    source: 'manufactured_consent', target: 'julius_caesar', type: 'ENABLED',
    label: 'Caesar\'s popularist media (De Bello Gallico) was manufactured consent for his military campaigns and political authority',
    note: 'Julius Caesar\'s "Gallic Wars" (De Bello Gallico) was the ancient world\'s most sophisticated political media: annual dispatches from the front, written in clear Latin for a literate Roman audience, framing conquest as Roman civilization\'s defense against barbarian threat. Caesar distributed copies throughout Rome to maintain political support during his decade-long absence commanding the army. De Bello Gallico is manufacturing consent in antiquity — using media to build public support for military action that served the commander\'s political ambitions.',
    confidence: 'high' },

  // ── korean_war ────────────────────────────────────────────────────────────
  { id: 'democratic_backsliding__korean_war',
    source: 'democratic_backsliding', target: 'korean_war', type: 'ENABLED',
    label: 'The Korean War established the US national security state framework that subsequent democratic backsliding exploited',
    note: 'The Korean War produced the permanent national security state infrastructure — NSC-68, CIA expansion, HUAC acceleration, and the security clearance system — that subsequent democratic backsliding exploited: McCarthyism\'s use of security threat rhetoric to suppress dissent, the Pentagon Papers\' surveillance of domestic anti-war activists, and post-9/11 PATRIOT Act expansion all drew on national security frameworks the Korean War institutionalized. The Korean War\'s permanent war economy Eisenhower would warn against began with Korea.',
    confidence: 'medium' },
];

let added = 0;
for (const e of batch) {
  if (!exIds.has(e.id)) { me.push(e); exIds.add(e.id); added++; }
}
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
console.log('mechanisms/edges: +' + added + ' → ' + me.length);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
me.forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
console.log('Total mech edges:', me.length, '| Orphans:', orphans);
