#!/usr/bin/env node
// Batch 19: Final boost + important missing topics
// Boost: gun_violence_policy, theocracy, neurodiversity, cambodian_genocide, nuclear_proliferation
// New nodes: misinformation_economy, propaganda_techniques, class_consciousness,
//   food_sovereignty, medical_racism, indigenous_boarding_schools,
//   yellow_journalism, deepstate_conspiracy, anti_intellectualism

const fs = require('fs');
const BASE = '/home/gorg/why/why-opedia/data';

function read(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function write(p, d) { fs.writeFileSync(p, JSON.stringify(d, null, 2)); }

const mn = read(BASE+'/mechanisms/nodes.json');
const me = read(BASE+'/mechanisms/edges.json');
const medn = read(BASE+'/global/media/nodes.json');
const mede = read(BASE+'/global/media/edges.json');
const pn = read(BASE+'/global/politics/nodes.json');
const pe = read(BASE+'/global/politics/edges.json');
const psn = read(BASE+'/global/psychology/nodes.json');
const pse = read(BASE+'/global/psychology/edges.json');
const hn = read(BASE+'/global/health/nodes.json');
const he = read(BASE+'/global/health/edges.json');
const hitn = read(BASE+'/global/history/nodes.json');
const hite = read(BASE+'/global/history/edges.json');

const mnIds = new Set(mn.map(n=>n.id));
const meIds = new Set(me.map(e=>e.id));
const mednIds = new Set(medn.map(n=>n.id));
const medeIds = new Set(mede.map(e=>e.id));
const pIds = new Set(pn.map(n=>n.id));
const peIds = new Set(pe.map(e=>e.id));
const psnIds = new Set(psn.map(n=>n.id));
const pseIds = new Set(pse.map(e=>e.id));
const hIds = new Set(hn.map(n=>n.id));
const heIds = new Set(he.map(e=>e.id));
const hitnIds = new Set(hitn.map(n=>n.id));
const hiteIds = new Set(hite.map(e=>e.id));

// ── NEW MECHANISM NODES ──────────────────────────────────────────────────────
const newMechNodes = [
  {
    id: 'misinformation_economy',
    label: 'Misinformation Economy',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '2010s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Fake_news_website',
    summary: 'The financial ecosystem sustaining misinformation: advertising revenue from outrage clicks, donation drives, supplement sales, and merchandise fueling fake news sites, alternative health gurus, and conspiracy influencers.',
    tags: ['misinformation','fake_news','attention_economy','advertising','monetization','conspiracy','influencers','platforms']
  },
  {
    id: 'anti_intellectualism',
    label: 'Anti-Intellectualism',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1950s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Anti-intellectualism',
    summary: 'Hostility toward expertise, education, and intellectual inquiry — documented by Richard Hofstadter in American political culture. Exploited by demagogues to discredit inconvenient scientific findings and undermine democratic deliberation.',
    tags: ['anti_intellectualism','Hofstadter','expertise','populism','education','science','elitism','expertise_rejection']
  },
  {
    id: 'class_consciousness',
    label: 'Class Consciousness',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1840s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Class_consciousness',
    summary: 'The awareness of one\'s own social class position and its relationship to other classes — the Marxist prerequisite for political action. Its absence (false consciousness) enables working-class support for elite interests.',
    tags: ['class_consciousness','Marx','class_struggle','workers','labor','false_consciousness','solidarity','organizing']
  }
];

// ── NEW MEDIA NODES ──────────────────────────────────────────────────────────
const newMediaNodes = [
  {
    id: 'yellow_journalism',
    label: 'Yellow Journalism',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1890s',
    scope: 'global/media',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Yellow_journalism',
    summary: 'Sensationalist newspaper reporting of the 1890s by Hearst and Pulitzer that exaggerated and invented stories — helping spark the Spanish-American War and establishing the template for outrage-driven media business models.',
    tags: ['yellow_journalism','Hearst','Pulitzer','sensationalism','Spanish_American_War','media','tabloid','propaganda']
  },
  {
    id: 'deepstate_media_narrative',
    label: 'Deep State Conspiracy Narrative',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2010s',
    scope: 'global/media',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Deep_state_in_the_United_States',
    summary: 'Conspiracy theory positing a hidden permanent government controlling elected officials — amplified by right-wing media to delegitimize intelligence agencies, law enforcement, and media as coordinated enemies of the people.',
    tags: ['deep_state','conspiracy','QAnon','Trump','FBI','media_distrust','disinformation','right_wing_media','shadow_government']
  }
];

// ── NEW POLITICS NODES ───────────────────────────────────────────────────────
const newPolitNodes = [
  {
    id: 'food_sovereignty',
    label: 'Food Sovereignty',
    node_type: 'movement',
    category: 'movement',
    decade: '1990s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Food_sovereignty',
    summary: 'Movement asserting the right of peoples to define their own food systems rather than being subject to international market forces — challenging corporate agriculture, GMO patents, and trade agreements destroying small farming.',
    tags: ['food_sovereignty','Via_Campesina','GMO','corporate_agriculture','trade','small_farmers','indigenous','food_systems']
  }
];

// ── NEW HEALTH NODES ─────────────────────────────────────────────────────────
const newHealthNodes = [
  {
    id: 'medical_racism',
    label: 'Medical Racism & Health Disparities',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1900s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Race_and_health_in_the_United_States',
    summary: 'Racial disparities in healthcare access, quality, and outcomes rooted in systemic racism, implicit bias, and historical abuses like Tuskegee — producing higher rates of chronic illness, maternal mortality, and COVID-19 deaths in Black communities.',
    tags: ['medical_racism','health_disparities','Tuskegee','bias','maternal_mortality','COVID','Black_health','systemic_racism']
  }
];

// ── NEW HISTORY NODES ────────────────────────────────────────────────────────
const newHistNodes = [
  {
    id: 'indigenous_boarding_schools',
    label: 'Indigenous Boarding Schools',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1870s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/American_Indian_boarding_schools',
    summary: '"Kill the Indian, save the man": US and Canadian government schools forcibly removing Indigenous children from families to eliminate Native languages, culture, and identity — producing documented abuse, death, and intergenerational trauma still unfolding.',
    tags: ['boarding_schools','Indigenous','forced_assimilation','cultural_genocide','residential_schools','trauma','Canada','Native_American']
  }
];

// ── MECHANISM EDGES ──────────────────────────────────────────────────────────
const newMechEdges = [
  // misinformation economy
  { id:'misinformation_economy__propaganda', source:'misinformation_economy', target:'propaganda', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Misinformation economy provides financial infrastructure for propaganda production', confidence:'confirmed' },
  { id:'misinformation_economy__anti_vaccine_movement', source:'misinformation_economy', target:'anti_vaccine_movement', type:'ENABLED', label:'Enabled', note:'Anti-vaccine content is highly profitable in misinformation economy', confidence:'confirmed' },
  { id:'misinformation_economy__conspiracy_theories', source:'misinformation_economy', target:'conspiracy_theories', type:'ENABLED', label:'Enabled', note:'Conspiracy content generates highest engagement and revenue in misinformation ecosystem', confidence:'confirmed' },
  { id:'misinformation_economy__broken_epistemology', source:'misinformation_economy', target:'broken_epistemology', type:'CAUSED', label:'Caused', note:'Profit motive for outrage content systematically degrades epistemic commons', confidence:'confirmed' },
  { id:'misinformation_economy__surveillance_capitalism', source:'misinformation_economy', target:'surveillance_capitalism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both exploit behavioral data for profit with harmful externalities to society', confidence:'confirmed' },

  // anti-intellectualism
  { id:'anti_intellectualism__conspiracy_theories', source:'anti_intellectualism', target:'conspiracy_theories', type:'ENABLED', label:'Enabled', note:'Anti-intellectualism creates receptivity to conspiracy theories that reject expert consensus', confidence:'confirmed' },
  { id:'anti_intellectualism__scientific_consensus', source:'anti_intellectualism', target:'scientific_consensus', type:'ENABLED', label:'Enabled', note:'Anti-intellectualism is prerequisite for manufactured doubt about scientific consensus to work', confidence:'confirmed' },
  { id:'anti_intellectualism__populism', source:'anti_intellectualism', target:'populism', type:'ENABLED', label:'Enabled', note:'Populism exploits anti-intellectualist resentment of educated elites', confidence:'confirmed' },
  { id:'anti_intellectualism__false_consciousness', source:'anti_intellectualism', target:'false_consciousness', type:'ENABLED', label:'Enabled', note:'Anti-intellectualism prevents class analysis needed to identify false consciousness', confidence:'speculative' },

  // class consciousness
  { id:'class_consciousness__marxism', source:'class_consciousness', target:'marxism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Class consciousness is the central mechanism of Marxist political theory', confidence:'confirmed' },
  { id:'class_consciousness__labor_movement', source:'class_consciousness', target:'labor_movement', type:'ENABLED', label:'Enabled', note:'Labor organizing requires class consciousness to motivate collective action', confidence:'confirmed' },
  { id:'class_consciousness__false_consciousness', source:'class_consciousness', target:'false_consciousness', type:'DISCREDITED', label:'Discredited', note:'Class consciousness is the antidote to false consciousness', confidence:'confirmed' }
];

// ── MEDIA EDGES ──────────────────────────────────────────────────────────────
const newMediaEdges = [
  // yellow journalism
  { id:'yellow_journalism__propaganda', source:'yellow_journalism', target:'propaganda', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Yellow journalism pioneered emotional manipulation techniques later systematized as propaganda', confidence:'confirmed' },
  { id:'yellow_journalism__misinformation_economy', source:'yellow_journalism', target:'misinformation_economy', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Yellow journalism established the profit-from-outrage model that misinformation economy inherits', confidence:'confirmed' },
  { id:'yellow_journalism__broken_epistemology', source:'yellow_journalism', target:'broken_epistemology', type:'ENABLED', label:'Enabled', note:'Hearst papers manufactured stories that became historical facts — early epistemic warfare', confidence:'confirmed' },

  // deep state narrative
  { id:'deepstate_media_narrative__conspiracy_theories', source:'deepstate_media_narrative', target:'conspiracy_theories', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Deep state narrative is a specific conspiracy theory targeting government institutions', confidence:'confirmed' },
  { id:'deepstate_media_narrative__russian_disinformation', source:'deepstate_media_narrative', target:'russian_disinformation', type:'ENABLED', label:'Enabled', note:'Deep state narratives have been amplified by Russian disinformation operations', confidence:'confirmed' },
  { id:'deepstate_media_narrative__broken_epistemology', source:'deepstate_media_narrative', target:'broken_epistemology', type:'CAUSED', label:'Caused', note:'Deep state framing delegitimizes all evidence from official sources', confidence:'confirmed' },
  { id:'deepstate_media_narrative__misinformation_economy', source:'deepstate_media_narrative', target:'misinformation_economy', type:'ENABLED', label:'Enabled', note:'Deep state content drives massive engagement and fundraising in right-wing media', confidence:'confirmed' }
];

// ── POLITICS EDGES (boost low-degree + new) ──────────────────────────────────
const newPolitEdges = [
  // gun violence policy boost
  { id:'gun_violence_policy__white_supremacy_movement', source:'gun_violence_policy', target:'white_supremacy_movement', type:'ENABLED', label:'Enabled', note:'White supremacist mass shooters exploit lax gun laws enabled by NRA lobbying', confidence:'confirmed' },
  { id:'gun_violence_policy__school_to_prison_pipeline', source:'gun_violence_policy', target:'school_to_prison_pipeline', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both disproportionately harm Black and low-income communities through policy failure', confidence:'speculative' },

  // theocracy boost
  { id:'theocracy__anti_vaccine_movement', source:'theocracy', target:'anti_vaccine_movement', type:'ENABLED', label:'Enabled', note:'Religious communities disproportionately drove vaccine hesitancy through faith-based exemptions', confidence:'confirmed' },
  { id:'theocracy__climate_change_denial', source:'theocracy', target:'climate_change_denial', type:'ENABLED', label:'Enabled', note:'Evangelical eschatology reduces motivation to address climate change', confidence:'speculative' },

  // food sovereignty
  { id:'food_sovereignty__environmental_degradation', source:'food_sovereignty', target:'environmental_degradation', type:'DISCREDITED', label:'Discredited', note:'Food sovereignty movements challenge corporate agriculture causing environmental degradation', confidence:'confirmed' },
  { id:'food_sovereignty__indigenous_rights', source:'food_sovereignty', target:'indigenous_rights', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Indigenous food sovereignty is a central demand of indigenous rights movements', confidence:'confirmed' },
  { id:'food_sovereignty__colonialism_legacy', source:'food_sovereignty', target:'colonialism_legacy', type:'DISCREDITED', label:'Discredited', note:'Food sovereignty challenges the colonial model of extracting cash crops from former colonies', confidence:'confirmed' }
];

// ── HEALTH EDGES ─────────────────────────────────────────────────────────────
const newHealthEdges = [
  // medical racism
  { id:'medical_racism__systemic_racism', source:'medical_racism', target:'systemic_racism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Medical racism is systemic racism manifesting in healthcare delivery', confidence:'confirmed' },
  { id:'medical_racism__adverse_childhood_experiences', source:'medical_racism', target:'adverse_childhood_experiences', type:'ENABLED', label:'Enabled', note:'Racialized medical neglect is a form of adverse childhood experience', confidence:'confirmed' },
  { id:'medical_racism__environmental_justice', source:'medical_racism', target:'environmental_justice', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Environmental health disparities and medical racism compound in communities of color', confidence:'confirmed' },
  { id:'medical_racism__healthcare_privatization', source:'medical_racism', target:'healthcare_privatization', type:'ENABLED', label:'Enabled', note:'Profit-driven healthcare exacerbates racial disparities through insurance discrimination', confidence:'confirmed' },

  // neurodiversity boost
  { id:'neurodiversity__conversion_therapy', source:'neurodiversity', target:'conversion_therapy', type:'DISCREDITED', label:'Discredited', note:'Neurodiversity movement challenges attempts to cure or normalize autism and ADHD', confidence:'confirmed' },
  { id:'neurodiversity__mental_health_stigma', source:'neurodiversity', target:'mental_health_stigma', type:'DISCREDITED', label:'Discredited', note:'Neurodiversity reframes neurological differences as variation rather than pathology', confidence:'confirmed' },
  { id:'neurodiversity__disability_rights', source:'neurodiversity', target:'disability_rights', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Neurodiversity is an expression of disability rights philosophy applied to neurological conditions', confidence:'confirmed' }
];

// ── HISTORY EDGES ────────────────────────────────────────────────────────────
const newHistEdges = [
  // indigenous boarding schools
  { id:'indigenous_boarding_schools__indigenous_rights', source:'indigenous_boarding_schools', target:'indigenous_rights', type:'PRODUCED', label:'Produced', note:'Boarding school trauma and survivors drove indigenous rights movements', confidence:'confirmed' },
  { id:'indigenous_boarding_schools__intergenerational_trauma', source:'indigenous_boarding_schools', target:'intergenerational_trauma', type:'CAUSED', label:'Caused', note:'Forced separation and abuse in boarding schools created documented intergenerational trauma', confidence:'confirmed' },
  { id:'indigenous_boarding_schools__systemic_racism', source:'indigenous_boarding_schools', target:'systemic_racism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Boarding schools were a form of institutionalized systemic racism targeting Indigenous children', confidence:'confirmed' },
  { id:'indigenous_boarding_schools__dehumanization', source:'indigenous_boarding_schools', target:'dehumanization', type:'ENABLED', label:'Enabled', note:'Dehumanization of Indigenous peoples justified the cultural genocide of boarding schools', confidence:'confirmed' },

  // cambodian genocide boost
  { id:'cambodian_genocide__khmer_rouge_genocide', source:'cambodian_genocide', target:'khmer_rouge_genocide', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Cambodian genocide and Khmer Rouge are the same event at different analytical levels', confidence:'confirmed' },
  { id:'cambodian_genocide__vietnam_war', source:'cambodian_genocide', target:'vietnam_war', type:'ENABLED', label:'Enabled', note:'US bombing of Cambodia destabilized country enabling Khmer Rouge rise', confidence:'confirmed' },
  { id:'cambodian_genocide__dehumanization', source:'cambodian_genocide', target:'dehumanization', type:'ENABLED', label:'Enabled', note:'Khmer Rouge dehumanized class enemies as new people requiring elimination', confidence:'confirmed' },

  // nuclear proliferation boost
  { id:'nuclear_proliferation__cuba_missile_crisis', source:'nuclear_proliferation', target:'cuban_missile_crisis', type:'ENABLED', label:'Enabled', note:'Nuclear proliferation and arms race produced Cuban Missile Crisis as near-catastrophe', confidence:'confirmed' },
  { id:'nuclear_proliferation__arms_race', source:'nuclear_proliferation', target:'cold_war_nuclear_fear', type:'ENABLED', label:'Enabled', note:'Proliferation drove nuclear fear in cold war culture and civil society', confidence:'confirmed' }
];

// ── APPLY CHANGES ────────────────────────────────────────────────────────────
let added = 0, edgesAdded = 0;
for (const n of newMechNodes) { if (!mnIds.has(n.id)) { mn.push(n); mnIds.add(n.id); added++; } }
for (const e of newMechEdges) { if (!meIds.has(e.id)) { me.push(e); meIds.add(e.id); edgesAdded++; } }
console.log('Mechanisms: +'+added+' nodes, +'+edgesAdded+' edges → '+mn.length+' nodes, '+me.length+' edges');

added = 0; edgesAdded = 0;
for (const n of newMediaNodes) { if (!mednIds.has(n.id)) { medn.push(n); mednIds.add(n.id); added++; } }
for (const e of newMediaEdges) { if (!medeIds.has(e.id)) { mede.push(e); medeIds.add(e.id); edgesAdded++; } }
console.log('Media: +'+added+' nodes, +'+edgesAdded+' edges → '+medn.length+' nodes, '+mede.length+' edges');

added = 0; edgesAdded = 0;
for (const n of newPolitNodes) { if (!pIds.has(n.id)) { pn.push(n); pIds.add(n.id); added++; } }
for (const e of newPolitEdges) { if (!peIds.has(e.id)) { pe.push(e); peIds.add(e.id); edgesAdded++; } }
console.log('Politics: +'+added+' nodes, +'+edgesAdded+' edges → '+pn.length+' nodes, '+pe.length+' edges');

added = 0; edgesAdded = 0;
for (const n of newHealthNodes) { if (!hIds.has(n.id)) { hn.push(n); hIds.add(n.id); added++; } }
for (const e of newHealthEdges) { if (!heIds.has(e.id)) { he.push(e); heIds.add(e.id); edgesAdded++; } }
console.log('Health: +'+added+' nodes, +'+edgesAdded+' edges → '+hn.length+' nodes, '+he.length+' edges');

added = 0; edgesAdded = 0;
for (const n of newHistNodes) { if (!hitnIds.has(n.id)) { hitn.push(n); hitnIds.add(n.id); added++; } }
for (const e of newHistEdges) { if (!hiteIds.has(e.id)) { hite.push(e); hiteIds.add(e.id); edgesAdded++; } }
console.log('History: +'+added+' nodes, +'+edgesAdded+' edges → '+hitn.length+' nodes, '+hite.length+' edges');

// Write all
write(BASE+'/mechanisms/nodes.json', mn);
write(BASE+'/mechanisms/edges.json', me);
write(BASE+'/global/media/nodes.json', medn);
write(BASE+'/global/media/edges.json', mede);
write(BASE+'/global/politics/nodes.json', pn);
write(BASE+'/global/politics/edges.json', pe);
write(BASE+'/global/health/nodes.json', hn);
write(BASE+'/global/health/edges.json', he);
write(BASE+'/global/history/nodes.json', hitn);
write(BASE+'/global/history/edges.json', hite);

// ── ORPHAN CHECK ─────────────────────────────────────────────────────────────
const allNodes = new Set();
for (const n of [...mn, ...medn, ...pn, ...psn, ...hn, ...hitn]) allNodes.add(n.id);

let orphans = 0;
for (const edgeList of [me, mede, pe, pse, he, hite]) {
  for (const e of edgeList) {
    if (!allNodes.has(e.source)) { console.error('ORPHAN source: '+e.source+' in edge '+e.id); orphans++; }
    if (!allNodes.has(e.target)) { console.error('ORPHAN target: '+e.target+' in edge '+e.id); orphans++; }
  }
}
console.log('Total orphans: '+orphans);
const totalNodes = mn.length + medn.length + pn.length + psn.length + hn.length + hitn.length;
const totalEdges = me.length + mede.length + pe.length + pse.length + he.length + hite.length;
console.log('Grand total: '+totalNodes+' nodes, '+totalEdges+' edges');
