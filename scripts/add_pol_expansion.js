#!/usr/bin/env node
// add_pol_expansion.js — adds important missing politics nodes and connections
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

function addNodes(f, nn) {
  const ex=JSON.parse(fs.readFileSync(f)); const ids=new Set(ex.map(n=>n.id)); let a=0;
  for(const n of nn) if(!ids.has(n.id)){ex.push(n);ids.add(n.id);a++;}
  if(a) fs.writeFileSync(f, JSON.stringify(ex, null, 2));
  console.log(f.split('/').slice(-2).join('/'), 'nodes: +'+a, '→', ex.length);
}

function addEdges(f, ee) {
  const ex=JSON.parse(fs.readFileSync(f)); const ids=new Set(ex.map(e=>e.id)); let a=0;
  for(const e of ee) if(!ids.has(e.id)){ex.push(e);ids.add(e.id);a++;}
  if(a) fs.writeFileSync(f, JSON.stringify(ex, null, 2));
  console.log(f.split('/').slice(-2).join('/'), 'edges: +'+a, '→', ex.length);
}

// ── Politics: new nodes ────────────────────────────────────────────────────────
addNodes(D('data/global/politics/nodes.json'), [
  {
    id: 'neoliberalism', label: 'Neoliberalism', node_type: 'reference', category: 'ideology',
    decade: '1970s', scope: 'global/politics', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Neoliberalism',
    summary: 'Neoliberalism — the ideological program of market liberalization, deregulation, privatization, and reduced state expenditure — emerged from Chicago School economics (Friedman, Hayek) and was implemented by Thatcher (UK, 1979), Reagan (US, 1981), and the Washington Consensus (IMF/World Bank structural adjustment). The program restructured global capitalism: rising inequality, financialization, labor precarity, corporate consolidation, and the hollowing of social democracy. Whether "neoliberalism" names a coherent project or a retrospective critique remains contested.',
    tags: ['economics', 'chicago-school', 'thatcher', 'reagan', 'privatization', 'inequality', 'imf']
  },
  {
    id: 'black_lives_matter', label: 'Black Lives Matter Movement', node_type: 'reference', category: 'movement',
    decade: '2010s', scope: 'global/politics', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Black_Lives_Matter',
    summary: 'Black Lives Matter (founded 2013 by Alicia Garza, Patrisse Cullors, Opal Tometi after Trayvon Martin\'s killing) became the largest civil rights movement in American history following the 2020 murder of George Floyd. The movement contested police violence, mass incarceration, and systemic racism, generating the largest single-day protest in US history. BLM also became the central target of conservative counter-mobilization ("All Lives Matter," "Blue Lives Matter"), demonstrating how social movements generate counter-movements.',
    tags: ['racial-justice', 'police-violence', 'protest', 'george-floyd', 'civil-rights', 'systemic-racism']
  },
  {
    id: 'brexit', label: 'Brexit', node_type: 'reference', category: 'event',
    decade: '2010s', scope: 'global/politics', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Brexit',
    summary: 'Brexit — the United Kingdom\'s 2016 referendum vote to leave the European Union (52% Leave, 48% Remain) and subsequent 2020 departure — represents the first major reversal of post-war European integration. The Leave campaign operationalized the Overton window technique of outrageous claims ("£350m/week to NHS"), social media micro-targeting (Cambridge Analytica), immigration anxiety, and "take back control" sovereignty narrative. Brexit\'s economic consequences (reduced trade, labor shortages, Scotland/Northern Ireland tensions) have been significantly negative by most measures.',
    tags: ['eu', 'uk', 'sovereignty', 'populism', 'immigration', 'referendum', 'cambridge-analytica']
  },
  {
    id: 'military_industrial_complex', label: 'Military-Industrial Complex', node_type: 'reference', category: 'institution',
    decade: '1950s', scope: 'global/politics', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Military%E2%80%93industrial_complex',
    summary: 'Dwight Eisenhower\'s 1961 farewell address coined "military-industrial complex" to warn against the permanent war economy\'s threat to democratic governance: the structural alignment of military, defense industry, and congressional interests that creates institutional pressure for continuous military spending regardless of strategic necessity. The complex has grown from Cold War concerns to the post-9/11 security state, encompassing defense contractors (Lockheed, Raytheon, Boeing), the intelligence community, think tanks, and the revolving door between Pentagon and industry.',
    tags: ['war', 'defense-industry', 'eisenhower', 'pentagon', 'lobbying', 'surveillance', 'imperialism']
  },
  {
    id: 'right_wing_populism', label: 'Right-Wing Populism (Global)', node_type: 'reference', category: 'movement',
    decade: '2010s', scope: 'global/politics', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Right-wing_populism',
    summary: 'The 2010s-2020s global wave of right-wing populism — Trump (US), Bolsonaro (Brazil), Orbán (Hungary), Modi (India), Erdoğan (Turkey), Duterte (Philippines), Le Pen (France), Meloni (Italy), Milei (Argentina) — shares structural features: anti-elite rhetoric combined with oligarchic governance, ethnic/religious nationalism, media capture, democratic backsliding, and scapegoating of minority outgroups. The wave represents the most significant threat to liberal democratic order since the 1930s fascist wave, with which it shares mechanisms despite differing in degree.',
    tags: ['populism', 'nationalism', 'trump', 'bolsonaro', 'modi', 'democratic-backsliding', 'authoritarianism']
  },
]);

// ── Politics: local edges ──────────────────────────────────────────────────────
addEdges(D('data/global/politics/edges.json'), [
  { id: 'ronald_reagan__neoliberalism',
    source: 'ronald_reagan', target: 'neoliberalism', type: 'ENABLED',
    label: 'Reagan implemented neoliberalism as US domestic policy through Reaganomics',
    note: 'Reagan\'s "Reaganomics" (tax cuts, deregulation, anti-union policy starting with PATCO, social spending cuts) was the US implementation of neoliberal ideology. Combined with Thatcher\'s UK implementation, Reagan established neoliberalism as the dominant policy framework for the following four decades. Supply-side economics was the political vehicle for neoliberal wealth redistribution upward.',
    confidence: 'high' },
  { id: 'neoliberalism__citizens_united',
    source: 'neoliberalism', target: 'citizens_united', type: 'ENABLED',
    label: 'Neoliberal corporate personhood doctrine culminated in Citizens United',
    note: 'Citizens United v. FEC (2010) is the constitutional expression of neoliberal ideology: corporations as persons with First Amendment rights, money as speech, and therefore unlimited corporate political spending as protected expression. The legal framework (developed through a series of cases from Buckley v. Valeo 1976 onward) reflects the neoliberal project of treating corporations as the primary units of civil society.',
    confidence: 'high' },
  { id: 'civil_rights_movement__black_lives_matter',
    source: 'civil_rights_movement', target: 'black_lives_matter', type: 'ENABLED',
    label: 'BLM built on Civil Rights Movement infrastructure while responding to its incomplete project',
    note: 'BLM explicitly positions itself as continuing the Civil Rights Movement\'s unfinished project: the movement adopted nonviolent direct action tactics, drew on SNCC organizing models, and invoked MLK\'s "fierce urgency of now" while also critiquing the respectability politics and integrationist focus that limited earlier movements. The incomplete project: legal equality achieved in 1960s has not produced material equality or ended police violence.',
    confidence: 'high' },
  { id: 'cambridge_analytica__brexit',
    source: 'cambridge_analytica', target: 'brexit', type: 'ENABLED',
    label: 'Cambridge Analytica provided micro-targeted voter influence operation for the Leave campaign',
    note: 'The Leave.EU campaign used Cambridge Analytica-adjacent services for psychographic micro-targeting, while Vote Leave used AggregateIQ (connected to SCL/Cambridge Analytica). The ICO investigation found illegal data use by both Leave campaigns. Brexit was the first major election where social media micro-targeting and psychographic profiling were central to the campaign strategy.',
    confidence: 'high' },
  { id: 'cold_war__military_industrial_complex',
    source: 'cold_war', target: 'military_industrial_complex', type: 'ENABLED',
    label: 'The Cold War created the permanent war economy Eisenhower warned against',
    note: 'The Cold War institutionalized what Eisenhower warned against: a permanent state of military mobilization requiring continuous defense spending, creating constituencies (industry, labor, military, congressional districts) whose economic interests required maintaining threat levels regardless of strategic reality. The complex Eisenhower identified in 1961 never demobilized after the Cold War ended; it transformed into the post-9/11 security state.',
    confidence: 'high' },
  { id: 'right_wing_populism__trump_maga',
    source: 'right_wing_populism', target: 'trump_maga', type: 'ENABLED',
    label: 'Trump/MAGA is the US expression of the global right-wing populist wave',
    note: 'Trump/MAGA shares ideological and tactical features with the global populist wave: anti-elite rhetoric masking oligarchic policy, ethnic nationalism, media capture attempts, democratic norm erosion, and scapegoating of minorities (immigrants, Muslims, BLM protesters). The global wave preceded Trump (Hungary\'s Orbán, India\'s Modi) and continued after him (Bolsonaro, Milei), situating MAGA as a national expression of a structural global phenomenon.',
    confidence: 'high' },
  { id: 'right_wing_populism__brexit',
    source: 'right_wing_populism', target: 'brexit', type: 'PRODUCED',
    label: 'Brexit was the UK expression of the right-wing populist wave',
    note: 'Brexit deployed the same playbook as global right-wing populism: nationalist sovereignty framing ("Take Back Control"), elite-bashing (Brussels technocrats), immigration fear, and media capture (Murdoch papers). Nigel Farage\'s UKIP/Brexit Party mobilized the same demographic (older, working-class, non-metropolitan, educational resentment) that Trump mobilized in the US. The results — promised economic benefits did not materialize — also match the global populist pattern.',
    confidence: 'high' },
]);

// ── Mechanism edges for new politics nodes ─────────────────────────────────────
const me=JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const exIds=new Set(me.map(e=>e.id));

const mechBatch = [
  { id: 'resource_curse__military_industrial_complex',
    source: 'resource_curse', target: 'military_industrial_complex', type: 'SHARES_MECHANISM_WITH',
    label: 'Military-industrial complex and resource curse share the captured-state mechanism',
    note: 'The resource curse (oil wealth distorting political economy) and the military-industrial complex share the same mechanism: concentrated industry captures the state apparatus that should regulate it, orienting government policy toward resource/defense extraction rather than public welfare. Both involve what economists call "rent-seeking" — using political power to extract wealth rather than create it. The petro-state and the national security state are variants of the same captured-state pattern.',
    confidence: 'medium' },

  { id: 'democratic_backsliding__right_wing_populism',
    source: 'democratic_backsliding', target: 'right_wing_populism', type: 'ENABLED',
    label: 'Right-wing populism is the contemporary mechanism of democratic backsliding',
    note: 'Levitsky and Ziblatt\'s "How Democracies Die" (2018) documented how contemporary democratic backsliding differs from 20th-century coups: it occurs through elected leaders who gradually subvert democratic institutions while maintaining electoral legitimacy. Right-wing populism is the political vehicle: anti-elite rhetoric, polarization, and norm erosion create the political space for executive aggrandizement, judicial capture, and media monopolization.',
    confidence: 'high' },

  { id: 'overton_window__neoliberalism',
    source: 'overton_window', target: 'neoliberalism', type: 'ENABLED',
    label: 'Neoliberalism\'s Mont Pelerin Society systematically moved the Overton window over 40 years',
    note: 'The neoliberal Overton window shift is the most documented long-term ideological project in modern political history: the Mont Pelerin Society (Hayek, Friedman, 1947) was explicitly designed to make government intervention "unthinkable" and market solutions "obvious." Through think tanks (Heritage Foundation, Cato, IEA), university chairs, and media relationships, neoliberalism moved from fringe economics to unquestioned policy orthodoxy between 1947 and 1980.',
    confidence: 'high' },

  { id: 'structural_violence__neoliberalism',
    source: 'structural_violence', target: 'neoliberalism', type: 'PRODUCED',
    label: 'Neoliberal structural adjustment programs institutionalized structural violence in Global South economies',
    note: 'IMF/World Bank structural adjustment programs — neoliberalism applied to indebted Global South countries — produced structural violence through conditionality: privatization of water, healthcare, and education; elimination of food subsidies; currency devaluation; and public sector wage cuts. These programs, imposed as conditions for debt restructuring, produced poverty, malnutrition, and preventable death at scale. Klein\'s "The Shock Doctrine" documents the pattern.',
    confidence: 'high' },

  { id: 'in_group_out_group_dynamics__black_lives_matter',
    source: 'in_group_out_group_dynamics', target: 'black_lives_matter', type: 'CAUSED',
    label: 'BLM/All Lives Matter conflict exemplifies asymmetric in-group/out-group grievance contestation',
    note: 'The BLM/"All Lives Matter" conflict is a textbook in-group/out-group dynamics case: "Black Lives Matter" is a specific claim about disproportionate state violence against one group; "All Lives Matter" reframes it as an inclusive statement that erases the specific grievance. The counter-slogan ("Blue Lives Matter," "All Lives Matter") refuses to acknowledge out-group-specific harm by insisting on in-group universalism — a classic in-group defensive move.',
    confidence: 'high' },

  { id: 'manufactured_consent__brexit',
    source: 'manufactured_consent', target: 'brexit', type: 'ENABLED',
    label: 'Brexit\'s Leave campaign was manufactured consent operationalized through social media micro-targeting',
    note: 'The Brexit Leave campaign represents manufactured consent at scale: the "£350m/week to the NHS" lie was deployed knowing it was false (Boris Johnson knew before the campaign); immigration threat was amplified through emotional imagery; and Cambridge Analytica-adjacent operations micro-targeted psychographic profiles. The manufactured consent operated not through mass media but through personalized algorithmic delivery — an update to Bernays\'s mass persuasion for the digital era.',
    confidence: 'high' },
];

let added=0;
for(const e of mechBatch) if(!exIds.has(e.id)){me.push(e);exIds.add(e.id);added++;}
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
console.log('mechanisms/edges: +'+added, '→', me.length);

// Integrity
const allIds=new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s=>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n=>allIds.add(n.id)));
let orphans=0;
me.forEach(e=>{
  if(allIds.has(e.source)===false){console.log('ORPHAN src:',e.source);orphans++;}
  if(allIds.has(e.target)===false){console.log('ORPHAN tgt:',e.target);orphans++;}
});
console.log('Total nodes:',allIds.size,'| Orphans:',orphans);
