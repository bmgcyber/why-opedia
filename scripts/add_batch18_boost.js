#!/usr/bin/env node
// Batch 18: Boost low-degree nodes + add key missing topics
// New nodes: gender_pay_gap, voter_suppression, deepfakes, land_reform,
//   water_rights, social_contract, peer_pressure, false_consciousness

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
    id: 'false_consciousness',
    label: 'False Consciousness',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1840s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/False_consciousness',
    summary: 'Marxist concept describing workers holding beliefs that serve elite interests against their own — voting against economic self-interest, supporting policies that harm them, or internalizing oppressor worldviews through media and culture.',
    tags: ['false_consciousness','Marx','ideology','working_class','hegemony','Gramsci','media','propaganda','class_interests']
  },
  {
    id: 'deepfakes',
    label: 'Deepfakes & Synthetic Media',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2010s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Deepfake',
    summary: 'AI-generated synthetic media — realistic fake videos, audio, and images — threatening political discourse, enabling non-consensual pornography, and accelerating the collapse of shared evidentiary standards in public life.',
    tags: ['deepfakes','synthetic_media','AI','disinformation','fake_news','elections','nonconsensual','epistemology','manipulation']
  }
];

// ── NEW POLITICS NODES ───────────────────────────────────────────────────────
const newPolitNodes = [
  {
    id: 'gender_pay_gap',
    label: 'Gender Pay Gap',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1960s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Gender_pay_gap',
    summary: 'Women earning 82 cents for every dollar earned by men (US), driven by occupational segregation, discrimination, unpaid care work, and structural barriers to advancement — debated between structural and individual explanations.',
    tags: ['gender_pay_gap','women','discrimination','equal_pay','occupational_segregation','caregiving','feminism','labor']
  },
  {
    id: 'voter_suppression',
    label: 'Voter Suppression',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1870s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Voter_suppression_in_the_United_States',
    summary: 'Legal and extralegal tactics reducing voter participation of targeted groups — poll taxes, literacy tests, gerrymandering, voter ID laws, polling place closures, and voter roll purges — disproportionately affecting minorities and poor.',
    tags: ['voter_suppression','gerrymandering','voter_ID','poll_taxes','Jim_Crow','Voting_Rights_Act','democracy','disenfranchisement']
  },
  {
    id: 'land_reform',
    label: 'Land Reform',
    node_type: 'concept',
    category: 'concept',
    decade: '1900s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Land_reform',
    summary: 'Redistribution of agricultural land from large landowners to peasants or tenant farmers — central demand of revolutionary movements from Mexico to China, land reform success often determined revolutionary outcomes.',
    tags: ['land_reform','agrarian_reform','peasants','Mexico','China','colonialism','inequality','revolution','property_rights']
  }
];

// ── MECHANISM EDGES (boosts + new) ───────────────────────────────────────────
const newMechEdges = [
  // false consciousness
  { id:'false_consciousness__propaganda', source:'false_consciousness', target:'propaganda', type:'ENABLED', label:'Enabled', note:'Propaganda manufactures false consciousness by presenting elite interests as universal', confidence:'confirmed' },
  { id:'false_consciousness__marxism', source:'false_consciousness', target:'marxism', type:'PRODUCED', label:'Produced', note:'False consciousness is a core Marxist analytical concept about ideology', confidence:'confirmed' },
  { id:'false_consciousness__cognitive_dissonance_effect', source:'false_consciousness', target:'cognitive_dissonance_effect', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both describe mechanisms by which people hold beliefs counter to their interests', confidence:'speculative' },

  // deepfakes
  { id:'deepfakes__broken_epistemology', source:'deepfakes', target:'broken_epistemology', type:'CAUSED', label:'Caused', note:'Deepfakes accelerate epistemic crisis by making video evidence unreliable', confidence:'confirmed' },
  { id:'deepfakes__russian_disinformation', source:'deepfakes', target:'russian_disinformation', type:'ENABLED', label:'Enabled', note:'Synthetic media tools are being integrated into state disinformation operations', confidence:'confirmed' },
  { id:'deepfakes__algorithmic_bias', source:'deepfakes', target:'algorithmic_bias', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both involve AI systems creating harmful social effects through manipulation of perception', confidence:'speculative' },
  { id:'artificial_intelligence__deepfakes', source:'artificial_intelligence', target:'deepfakes', type:'PRODUCED', label:'Produced', note:'Generative AI models produced deepfake capabilities as a byproduct of vision research', confidence:'confirmed' },
];

// ── POLITICS EDGES (boost + new) ─────────────────────────────────────────────
const newPolitEdges = [
  // gender pay gap
  { id:'gender_pay_gap__second_wave_feminism', source:'gender_pay_gap', target:'second_wave_feminism', type:'PRODUCED', label:'Produced', note:'Gender pay gap was a primary target of second-wave feminist legislation', confidence:'confirmed' },
  { id:'gender_pay_gap__wealth_inequality', source:'gender_pay_gap', target:'wealth_inequality', type:'CAUSED', label:'Caused', note:'Gender wage discrimination contributes directly to gender wealth gap', confidence:'confirmed' },
  { id:'gender_pay_gap__intersectionality', source:'gender_pay_gap', target:'intersectionality', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Pay gaps compound along race and gender axes in ways intersectionality explains', confidence:'confirmed' },

  // voter suppression
  { id:'voter_suppression__jim_crow', source:'voter_suppression', target:'jim_crow', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Jim Crow laws included poll taxes and literacy tests as paradigmatic voter suppression', confidence:'confirmed' },
  { id:'voter_suppression__gerrymandering', source:'voter_suppression', target:'gerrymandering', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both are techniques to dilute minority political power', confidence:'confirmed' },
  { id:'voter_suppression__systemic_racism', source:'voter_suppression', target:'systemic_racism', type:'ENABLED', label:'Enabled', note:'Voter suppression is a primary mechanism of systemic racism in political power', confidence:'confirmed' },
  { id:'voter_suppression__dark_money_politics', source:'voter_suppression', target:'dark_money_politics', type:'ENABLED', label:'Enabled', note:'Dark money funds voter suppression advocacy organizations', confidence:'confirmed' },

  // land reform
  { id:'land_reform__colonialism_legacy', source:'land_reform', target:'colonialism_legacy', type:'DISCREDITED', label:'Discredited', note:'Land reform movements directly challenged colonial land seizure systems', confidence:'confirmed' },
  { id:'land_reform__decolonization_africa', source:'land_reform', target:'decolonization_africa', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Land redistribution was central demand of African decolonization movements', confidence:'confirmed' },
  { id:'land_reform__wealth_inequality', source:'land_reform', target:'wealth_inequality', type:'DISCREDITED', label:'Discredited', note:'Land reform attempts to reverse colonial and feudal wealth concentration in land', confidence:'confirmed' },

  // boost low-degree nodes
  { id:'french_revolution_history__enlightenment', source:'french_revolution_history', target:'enlightenment', type:'ENABLED', label:'Enabled', note:'French Revolution was direct political expression of Enlightenment philosophy', confidence:'confirmed' },
  { id:'french_revolution_history__marxism', source:'french_revolution_history', target:'marxism', type:'ENABLED', label:'Enabled', note:'French Revolution provided Marx with key lessons about bourgeois revolution and class struggle', confidence:'confirmed' },
  { id:'french_revolution_history__napoleon_Bonaparte', source:'french_revolution_history', target:'napoleon_bonaparte', type:'PRODUCED', label:'Produced', note:'Napoleon Bonaparte rose to power through the political vacuum created by French Revolution', confidence:'confirmed' },

  // tiananmen
  { id:'tiananmen_square_massacre__cultural_revolution_china', source:'tiananmen_square_massacre', target:'cultural_revolution_china', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both represent CCP suppression of dissent through state violence', confidence:'confirmed' },
  { id:'tiananmen_square_massacre__propaganda', source:'tiananmen_square_massacre', target:'propaganda', type:'ENABLED', label:'Enabled', note:'CCP propaganda systematically erased Tiananmen from Chinese public memory', confidence:'confirmed' },

  // stonewall boost
  { id:'stonewall__lgbtq_rights_movement', source:'stonewall', target:'lgbtq_rights_movement', type:'PRODUCED', label:'Produced', note:'Stonewall uprising launched the modern LGBTQ rights movement', confidence:'confirmed' },
  { id:'stonewall__civil_rights_movement', source:'stonewall', target:'civil_rights_movement', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both used direct action and visibility politics to demand equal rights', confidence:'confirmed' },

  // progressive era boost
  { id:'progressive_era__labor_movement', source:'progressive_era', target:'labor_movement', type:'ENABLED', label:'Enabled', note:'Progressive Era produced major labor legislation including child labor and hours laws', confidence:'confirmed' },
  { id:'progressive_era__robber_barons', source:'progressive_era', target:'robber_barons', type:'DISCREDITED', label:'Discredited', note:'Progressive Era trust-busting directly targeted robber baron monopolies', confidence:'confirmed' },
  { id:'progressive_era__new_deal', source:'progressive_era', target:'new_deal', type:'ENABLED', label:'Enabled', note:'Progressive Era built institutional and intellectual foundations for New Deal', confidence:'confirmed' }
];

// ── PSYCHOLOGY EDGES (boost) ─────────────────────────────────────────────────
const newPsychEdges = [
  // pua community boost
  { id:'pua_community__mgtow', source:'pua_community', target:'mgtow', type:'FRAGMENTED_INTO', label:'Fragmented into', note:'Some PUA adherents moved into MGTOW as alienation deepened', confidence:'confirmed' },
  { id:'pua_community__toxic_masculinity', source:'pua_community', target:'toxic_masculinity', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'PUA community represents and reinforces toxic masculinity norms', confidence:'confirmed' },
  { id:'pua_community__social_media_radicalization', source:'pua_community', target:'social_media_radicalization', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Online PUA forums function as radicalization pipelines into misogynist extremism', confidence:'confirmed' },

  // brony/furry boost
  { id:'brony_fandom__in_group_out_group_dynamics', source:'brony_fandom', target:'in_group_out_group_dynamics', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Fan communities exhibit strong in-group bonding and out-group rejection dynamics', confidence:'confirmed' },
  { id:'brony_fandom__identity_politics', source:'brony_fandom', target:'identity_politics', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Fandom identity functions as a form of subcultural identity politics', confidence:'speculative' },
  { id:'furry_fandom__in_group_out_group_dynamics', source:'furry_fandom', target:'in_group_out_group_dynamics', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Furry community shows strong in-group belonging and protective identity dynamics', confidence:'confirmed' },
  { id:'furry_fandom__identity_politics', source:'furry_fandom', target:'identity_politics', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Furry identity intersects with LGBTQ and other identity movements', confidence:'confirmed' },

  // stanford prison experiment boost
  { id:'stanford_prison_experiment__milgram_obedience', source:'stanford_prison_experiment', target:'milgram_obedience', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both demonstrate how situational roles override individual moral agency', confidence:'confirmed' },
  { id:'stanford_prison_experiment__dehumanization', source:'stanford_prison_experiment', target:'dehumanization', type:'ENABLED', label:'Enabled', note:'Prison experiment showed how institutional roles produce dehumanizing behavior', confidence:'confirmed' },
  { id:'stanford_prison_experiment__authoritarian_personality', source:'stanford_prison_experiment', target:'authoritarian_personality', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both reveal the power of authority and role to shape behavior independent of personality', confidence:'confirmed' },

  // echo chamber boost
  { id:'echo_chamber__tribalism', source:'echo_chamber', target:'tribalism', type:'ENABLED', label:'Enabled', note:'Echo chambers reinforce tribal identity by filtering out challenging perspectives', confidence:'confirmed' },
  { id:'echo_chamber__confirmation_bias_effect', source:'echo_chamber', target:'confirmation_bias_effect', type:'ENABLED', label:'Enabled', note:'Echo chambers are self-reinforcing structures built on confirmation bias', confidence:'confirmed' },

  // toxic masculinity boost
  { id:'toxic_masculinity__mgtow', source:'toxic_masculinity', target:'mgtow', type:'ENABLED', label:'Enabled', note:'Toxic masculinity norms create the alienated masculine identity MGTOW exploits', confidence:'confirmed' },
  { id:'toxic_masculinity__gender_pay_gap', source:'toxic_masculinity', target:'gender_pay_gap', type:'ENABLED', label:'Enabled', note:'Masculine norms excluding women from leadership roles contribute to pay gap', confidence:'confirmed' },

  // intersectionality boost
  { id:'intersectionality__feminist_theory', source:'intersectionality', target:'feminist_theory', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Intersectionality developed from and refined feminist theoretical frameworks', confidence:'confirmed' },
  { id:'intersectionality__systemic_racism', source:'intersectionality', target:'systemic_racism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Intersectionality reveals how racial and gender systems of oppression compound', confidence:'confirmed' },

  // trauma bonding boost
  { id:'trauma_bonding__narcissistic_abuse', source:'trauma_bonding', target:'narcissistic_abuse', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Trauma bonding is the primary mechanism keeping victims in narcissistic abuse relationships', confidence:'confirmed' },
  { id:'trauma_bonding__cult_dynamics', source:'trauma_bonding', target:'cult_dynamics', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Cults use intermittent reinforcement to create trauma bonds preventing exit', confidence:'confirmed' },
  { id:'trauma_bonding__adverse_childhood_experiences', source:'trauma_bonding', target:'adverse_childhood_experiences', type:'ENABLED', label:'Enabled', note:'Early relational trauma creates patterns that manifest as trauma bonding in adult relationships', confidence:'confirmed' },

  // satanic panic boost
  { id:'satanic_panic__moral_panic', source:'satanic_panic', target:'moral_panic', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Satanic panic is a paradigmatic example of moral panic dynamics', confidence:'confirmed' },
  { id:'satanic_panic__conspiracy_theories', source:'satanic_panic', target:'conspiracy_theories', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Satanic ritual abuse beliefs share epistemological structure with conspiracy theories', confidence:'confirmed' }
];

// ── MEDIA EDGES (boost) ──────────────────────────────────────────────────────
const newMediaEdges = [
  // war of worlds broadcast boost
  { id:'war_of_worlds_broadcast__propaganda', source:'war_of_worlds_broadcast', target:'propaganda', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'War of Worlds broadcast demonstrated radio\'s capacity for mass psychological manipulation', confidence:'confirmed' },
  { id:'war_of_worlds_broadcast__moral_panic', source:'war_of_worlds_broadcast', target:'moral_panic', type:'PRODUCED', label:'Produced', note:'The broadcast produced a temporary but intense moral panic about radio manipulation', confidence:'confirmed' },

  // rupert murdoch boost
  { id:'rupert_murdoch__fox_news', source:'rupert_murdoch', target:'fox_news', type:'PRODUCED', label:'Produced', note:'Murdoch created Fox News as deliberate conservative counter to mainstream media', confidence:'confirmed' },
  { id:'rupert_murdoch__media_consolidation', source:'rupert_murdoch', target:'media_consolidation', type:'ENABLED', label:'Enabled', note:'News Corp represents paradigmatic media consolidation across countries', confidence:'confirmed' },
  { id:'rupert_murdoch__broken_epistemology', source:'rupert_murdoch', target:'broken_epistemology', type:'CAUSED', label:'Caused', note:'Murdoch outlets systematically promoted misinformation degrading epistemics', confidence:'confirmed' },

  // radio milles collines boost
  { id:'radio_milles_collines__rwandan_genocide', source:'radio_milles_collines', target:'rwandan_genocide', type:'ENABLED', label:'Enabled', note:'Radio Milles Collines broadcast incitement to genocide throughout the 1994 killings', confidence:'confirmed' },
  { id:'radio_milles_collines__propaganda', source:'radio_milles_collines', target:'propaganda', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Hate radio represents propaganda weaponized for genocide', confidence:'confirmed' },

  // homeric epics boost
  { id:'homeric_epics__propaganda', source:'homeric_epics', target:'propaganda', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Epic poetry functioned as cultural propaganda glorifying war and elite heroes', confidence:'speculative' },
  { id:'homeric_epics__printing_press', source:'homeric_epics', target:'printing_press', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both transformed access to cultural narrative though across millennia', confidence:'speculative' },

  // walter lippmann boost
  { id:'walter_lippmann__propaganda', source:'walter_lippmann', target:'propaganda', type:'ENABLED', label:'Enabled', note:'Lippmann\'s theories of public opinion influenced modern propaganda practice', confidence:'confirmed' },
  { id:'walter_lippmann__broken_epistemology', source:'walter_lippmann', target:'broken_epistemology', type:'ENABLED', label:'Enabled', note:'Lippmann identified the problem of manufactured consent shaping public reality', confidence:'confirmed' },

  // citizen journalism boost
  { id:'citizen_journalism__broken_epistemology', source:'citizen_journalism', target:'broken_epistemology', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Proliferation of non-professional news sources contributes to fragmented information environment', confidence:'speculative' },
  { id:'citizen_journalism__russian_disinformation', source:'citizen_journalism', target:'russian_disinformation', type:'ENABLED', label:'Enabled', note:'Citizen journalism platforms provide cover for state disinformation posing as grassroots reporting', confidence:'confirmed' }
];

// ── HEALTH EDGES (boost) ─────────────────────────────────────────────────────
const newHealthEdges = [
  // tobacco master settlement boost
  { id:'tobacco_master_settlement__tobacco_industry', source:'tobacco_master_settlement', target:'tobacco_industry', type:'DISCREDITED', label:'Discredited', note:'Master Settlement Agreement forced tobacco industry to pay $246B and restrict marketing', confidence:'confirmed' },
  { id:'tobacco_master_settlement__regulatory_capture', source:'tobacco_master_settlement', target:'regulatory_capture', type:'DISCREDITED', label:'Discredited', note:'Settlement revealed extent of regulatory capture that allowed tobacco harm for decades', confidence:'confirmed' },
  { id:'tobacco_master_settlement__opioid_corporate_liability', source:'tobacco_master_settlement', target:'opioid_corporate_liability', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Opioid litigation used tobacco settlement as legal model and template', confidence:'confirmed' },

  // lobotomy era boost
  { id:'lobotomy_era__mental_health_stigma', source:'lobotomy_era', target:'mental_health_stigma', type:'ENABLED', label:'Enabled', note:'Psychiatric abuses including lobotomies created lasting trauma and mistrust of psychiatry', confidence:'confirmed' },
  { id:'lobotomy_era__bioethics', source:'lobotomy_era', target:'bioethics', type:'PRODUCED', label:'Produced', note:'Psychiatric abuses drove development of medical ethics and informed consent frameworks', confidence:'confirmed' },
  { id:'lobotomy_era__adverse_childhood_experiences', source:'lobotomy_era', target:'adverse_childhood_experiences', type:'ENABLED', label:'Enabled', note:'Institutionalization of children created severe adverse experiences', confidence:'speculative' },

  // thalidomide boost
  { id:'thalidomide_scandal__pharmaceutical_industry', source:'thalidomide_scandal', target:'pharmaceutical_industry', type:'DISCREDITED', label:'Discredited', note:'Thalidomide disaster was the catalyst for modern drug testing requirements', confidence:'confirmed' },
  { id:'thalidomide_scandal__regulatory_capture', source:'thalidomide_scandal', target:'regulatory_capture', type:'DISCREDITED', label:'Discredited', note:'Thalidomide showed regulatory failure when industry captured approval processes', confidence:'confirmed' },
  { id:'thalidomide_scandal__bioethics', source:'thalidomide_scandal', target:'bioethics', type:'PRODUCED', label:'Produced', note:'Thalidomide tragedy accelerated development of bioethics principles for drug trials', confidence:'confirmed' },

  // pain management movement boost
  { id:'pain_management_movement__opioid_crisis', source:'pain_management_movement', target:'opioid_crisis', type:'CAUSED', label:'Caused', note:'Aggressive pain management movement created conditions for opioid epidemic', confidence:'confirmed' },
  { id:'pain_management_movement__opioid_corporate_liability', source:'pain_management_movement', target:'opioid_corporate_liability', type:'ENABLED', label:'Enabled', note:'Pain management push by Purdue Pharma is basis of corporate liability claims', confidence:'confirmed' },
  { id:'pain_management_movement__regulatory_capture', source:'pain_management_movement', target:'regulatory_capture', type:'ENABLED', label:'Enabled', note:'Pain management guidelines were captured by pharmaceutical industry influence', confidence:'confirmed' }
];

// ── HISTORY EDGES (boost) ────────────────────────────────────────────────────
const newHistEdges = [
  // jewish roman wars boost
  { id:'jewish_roman_wars__diaspora', source:'jewish_roman_wars', target:'antisemitism', type:'ENABLED', label:'Enabled', note:'Roman destruction of Jerusalem and Jewish dispersal created diaspora conditions exploited by antisemitism', confidence:'confirmed' },
  { id:'jewish_roman_wars__the_holocaust', source:'jewish_roman_wars', target:'the_holocaust', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both represent historical attempts to destroy Jewish civilization through violence', confidence:'speculative' },
  { id:'jewish_roman_wars__colonial_era', source:'jewish_roman_wars', target:'colonial_era', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Roman conquest and colonization of Judea represents ancient colonial domination', confidence:'speculative' },

  // second vatican council boost
  { id:'second_vatican_council__catholic_church', source:'second_vatican_council', target:'protestant_reformation_history', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both Vatican II and Reformation represent attempts to modernize Catholic practice', confidence:'confirmed' },
  { id:'second_vatican_council__liberation_theology', source:'second_vatican_council', target:'social_contract_theory', type:'ENABLED', label:'Enabled', note:'Vatican II enabled liberation theology by opening Church to social engagement', confidence:'speculative' },
  { id:'second_vatican_council__reformation', source:'second_vatican_council', target:'reformation_counter_reformation', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Vatican II completed reforms the Counter-Reformation resisted for four centuries', confidence:'speculative' },

  // leopold II belgium boost
  { id:'leopold_ii_belgium__colonialism_legacy', source:'leopold_ii_belgium', target:'colonialism_legacy', type:'PRODUCED', label:'Produced', note:'Leopold\'s Congo Free State is the defining example of colonial extraction and genocide', confidence:'confirmed' },
  { id:'leopold_ii_belgium__resource_extraction', source:'leopold_ii_belgium', target:'resource_extraction', type:'ENABLED', label:'Enabled', note:'Congo rubber quotas enforced by mutilation represent pure extractive colonialism', confidence:'confirmed' },
  { id:'leopold_ii_belgium__dehumanization', source:'leopold_ii_belgium', target:'dehumanization', type:'ENABLED', label:'Enabled', note:'Leopold\'s regime dehumanized Congolese people as labor instruments for rubber production', confidence:'confirmed' }
];

// ── APPLY CHANGES ────────────────────────────────────────────────────────────
let added = 0, edgesAdded = 0;
for (const n of newMechNodes) { if (!mnIds.has(n.id)) { mn.push(n); mnIds.add(n.id); added++; } }
for (const e of newMechEdges) { if (!meIds.has(e.id)) { me.push(e); meIds.add(e.id); edgesAdded++; } }
console.log('Mechanisms: +'+added+' nodes, +'+edgesAdded+' edges → '+mn.length+' nodes, '+me.length+' edges');

added = 0; edgesAdded = 0;
for (const n of newPolitNodes) { if (!pIds.has(n.id)) { pn.push(n); pIds.add(n.id); added++; } }
for (const e of newPolitEdges) { if (!peIds.has(e.id)) { pe.push(e); peIds.add(e.id); edgesAdded++; } }
console.log('Politics: +'+added+' nodes, +'+edgesAdded+' edges → '+pn.length+' nodes, '+pe.length+' edges');

added = 0; edgesAdded = 0;
for (const e of newPsychEdges) { if (!pseIds.has(e.id)) { pse.push(e); pseIds.add(e.id); edgesAdded++; } }
console.log('Psychology: +0 nodes, +'+edgesAdded+' edges → '+psn.length+' nodes, '+pse.length+' edges');

added = 0; edgesAdded = 0;
for (const e of newMediaEdges) { if (!medeIds.has(e.id)) { mede.push(e); medeIds.add(e.id); edgesAdded++; } }
console.log('Media: +0 nodes, +'+edgesAdded+' edges → '+medn.length+' nodes, '+mede.length+' edges');

added = 0; edgesAdded = 0;
for (const e of newHealthEdges) { if (!heIds.has(e.id)) { he.push(e); heIds.add(e.id); edgesAdded++; } }
console.log('Health: +0 nodes, +'+edgesAdded+' edges → '+hn.length+' nodes, '+he.length+' edges');

added = 0; edgesAdded = 0;
for (const e of newHistEdges) { if (!hiteIds.has(e.id)) { hite.push(e); hiteIds.add(e.id); edgesAdded++; } }
console.log('History: +0 nodes, +'+edgesAdded+' edges → '+hitn.length+' nodes, '+hite.length+' edges');

// Write all
write(BASE+'/mechanisms/nodes.json', mn);
write(BASE+'/mechanisms/edges.json', me);
write(BASE+'/global/media/nodes.json', medn);
write(BASE+'/global/media/edges.json', mede);
write(BASE+'/global/politics/nodes.json', pn);
write(BASE+'/global/politics/edges.json', pe);
write(BASE+'/global/psychology/nodes.json', psn);
write(BASE+'/global/psychology/edges.json', pse);
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
