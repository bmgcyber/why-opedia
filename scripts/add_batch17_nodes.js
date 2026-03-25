#!/usr/bin/env node
// Batch 17: Philosophy of Power, Economic Systems, Tech Ethics, Religion & Secularism
// New nodes: neoliberalism_ideology, libertarianism, theocracy, secular_humanism,
//   artificial_intelligence, bioethics, nuclear_proliferation, great_society,
//   new_deal, mccarthyism, cultural_revolution, arab_spring,
//   groupthink, confirmation_bias_effect, tribalism

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
    id: 'neoliberalism_ideology',
    label: 'Neoliberalism',
    node_type: 'ideology',
    category: 'ideology',
    decade: '1970s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Neoliberalism',
    summary: 'Dominant economic ideology since the 1980s prioritizing free markets, deregulation, privatization, and reduced government spending. Associated with Thatcher, Reagan, and Chicago School economists. Drove global inequality rise and welfare state erosion.',
    tags: ['neoliberalism','Thatcher','Reagan','free_market','privatization','deregulation','Chicago_School','Friedman','inequality']
  },
  {
    id: 'groupthink',
    label: 'Groupthink',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1970s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Groupthink',
    summary: 'Psychological phenomenon where desire for harmony in a cohesive group overrides realistic appraisal of alternatives, leading to poor decisions. Janis documented it in Bay of Pigs, Pearl Harbor, and other policy disasters.',
    tags: ['groupthink','Janis','decision_making','conformity','Bay_of_Pigs','corporate','groupdynamics','psychology','bias']
  },
  {
    id: 'confirmation_bias_effect',
    label: 'Confirmation Bias',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1960s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Confirmation_bias',
    summary: 'Tendency to search for, interpret, and recall information in ways confirming existing beliefs — foundation of echo chambers, science denial, and political polarization. Amplified by social media algorithmic curation.',
    tags: ['confirmation_bias','cognitive_bias','echo_chamber','polarization','media','psychology','belief','motivated_reasoning']
  },
  {
    id: 'tribalism',
    label: 'Tribalism & In-Group Psychology',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1970s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Tribalism',
    summary: 'Evolutionary social psychology favoring the in-group and viewing the out-group with suspicion — exploited by political strategists, media, and demagogues to generate loyalty through manufactured conflict.',
    tags: ['tribalism','in_group','out_group','identity','partisanship','evolution','social_psychology','conflict','us_vs_them']
  },
  {
    id: 'artificial_intelligence',
    label: 'Artificial Intelligence',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2010s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
    summary: 'Machine intelligence systems capable of performing tasks requiring human cognition — transforming labor markets, warfare, surveillance, healthcare, and media while raising profound questions about bias, accountability, and existential risk.',
    tags: ['AI','machine_learning','automation','GPT','bias','surveillance','labor','existential_risk','ethics','regulation']
  }
];

// ── NEW POLITICS NODES ───────────────────────────────────────────────────────
const newPolitNodes = [
  {
    id: 'libertarianism',
    label: 'Libertarianism',
    node_type: 'ideology',
    category: 'ideology',
    decade: '1970s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Libertarianism',
    summary: 'Political philosophy prioritizing individual liberty, minimal government, and free markets. Ranges from classical liberalism to anarcho-capitalism. Influential in tech industry and shapes opposition to regulation, taxes, and social programs.',
    tags: ['libertarianism','individual_freedom','minimal_government','Ayn_Rand','Hayek','tech_industry','Ron_Paul','free_market']
  },
  {
    id: 'theocracy',
    label: 'Theocracy & Religious Nationalism',
    node_type: 'ideology',
    category: 'ideology',
    decade: '1970s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Theocracy',
    summary: 'Governance system where religious law or authority structures political power. Ranges from Iran\'s Islamic Republic to Christian nationalist movements seeking to align US law with evangelical interpretations — threatening secular governance.',
    tags: ['theocracy','religious_nationalism','Christian_nationalism','Iran','Taliban','church_state','secularism','evangelicalism']
  },
  {
    id: 'great_society',
    label: 'Great Society Programs',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1960s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Great_Society',
    summary: "LBJ's domestic legislation agenda 1964-68 creating Medicare, Medicaid, Voting Rights Act, and civil rights protections — the last major expansion of the American welfare state before the Reagan counter-revolution.",
    tags: ['Great_Society','LBJ','Medicare','Medicaid','civil_rights','Voting_Rights_Act','welfare_state','poverty']
  },
  {
    id: 'new_deal',
    label: 'New Deal',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1930s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/New_Deal',
    summary: "FDR's 1933-39 response to Great Depression: banking reform, Social Security, labor rights, rural electrification, and mass employment programs. Created the modern administrative state and remains high watermark of American government intervention.",
    tags: ['New_Deal','FDR','Depression','Social_Security','labor','banking','TVA','Keynesian','welfare_state']
  },
  {
    id: 'bioethics',
    label: 'Bioethics & Medical Ethics',
    node_type: 'concept',
    category: 'concept',
    decade: '1970s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Bioethics',
    summary: 'Field examining ethical implications of biological and medical research — covering abortion, end-of-life care, genetic engineering, AI diagnostics, clinical trial ethics, and equitable access to medical technology.',
    tags: ['bioethics','medical_ethics','abortion','genetics','CRISPR','Tuskegee','informed_consent','healthcare','research_ethics']
  }
];

// ── NEW PSYCHOLOGY NODES ─────────────────────────────────────────────────────
const newPsychNodes = [
  {
    id: 'authoritarian_personality',
    label: 'Authoritarian Personality',
    node_type: 'theory',
    category: 'theory',
    decade: '1950s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/The_Authoritarian_Personality',
    summary: "Adorno and colleagues' 1950 study identifying psychological profile predisposed to authoritarian obedience: rigid thinking, in-group conformity, submission to authority, and aggression toward out-groups — linked to fascist susceptibility.",
    tags: ['authoritarian_personality','Adorno','fascism','obedience','prejudice','F_scale','psychology','conformity','ethnocentrism']
  },
  {
    id: 'identity_politics',
    label: 'Identity Politics',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1970s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Identity_politics',
    summary: 'Political mobilization based on shared identity — racial, gender, sexual, religious, or class — contested from both right (as divisive) and left (as essential for marginalized group representation). Central to culture war debates.',
    tags: ['identity_politics','race','gender','LGBTQ','class','representation','culture_war','Combahee_River_Collective','intersectionality']
  }
];

// ── NEW HISTORY NODES ────────────────────────────────────────────────────────
const newHistNodes = [
  {
    id: 'mccarthyism',
    label: 'McCarthyism & Red Scare II',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1950s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/McCarthyism',
    summary: "Senator Joseph McCarthy's 1950-54 campaign alleging communist infiltration of US government — destroying careers through unsubstantiated accusations, chilling free speech, and demonstrating how moral panic can override due process.",
    tags: ['McCarthyism','Red_Scare','HUAC','communism','blacklist','civil_liberties','free_speech','Hollywood','paranoia']
  },
  {
    id: 'cultural_revolution_china',
    label: "China's Cultural Revolution",
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1960s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Cultural_Revolution',
    summary: "Mao Zedong's 1966-76 campaign to purge capitalist and traditional elements from Chinese society — killing hundreds of thousands, destroying cultural heritage, sending intellectuals to labor camps, and creating lasting trauma.",
    tags: ['Cultural_Revolution','Mao','China','Red_Guards','communism','purge','intellectuals','totalitarianism','trauma']
  },
  {
    id: 'arab_spring',
    label: 'Arab Spring',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '2010s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Arab_Spring',
    summary: 'Wave of pro-democracy protests and uprisings across Arab world 2010-2012, sparked in Tunisia and spreading to Egypt, Libya, Syria, Bahrain, and Yemen — some succeeding briefly, most crushed or descending into civil war.',
    tags: ['Arab_Spring','democracy','Tunisia','Egypt','Syria','social_media','revolution','authoritarianism','Libya','protest']
  },
  {
    id: 'nuclear_proliferation',
    label: 'Nuclear Proliferation',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1950s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Nuclear_proliferation',
    summary: 'Spread of nuclear weapons beyond original five nuclear states — India, Pakistan, North Korea acquiring weapons; Iran and others pursuing capability — creating ongoing existential risks despite Non-Proliferation Treaty framework.',
    tags: ['nuclear_proliferation','NPT','Pakistan','India','North_Korea','Iran','nuclear_weapons','WMD','existential_risk']
  }
];

// ── MECHANISM EDGES ──────────────────────────────────────────────────────────
const newMechEdges = [
  // neoliberalism
  { id:'neoliberalism_ideology__capitalism', source:'neoliberalism_ideology', target:'capitalism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Neoliberalism is the dominant political expression of contemporary capitalism', confidence:'confirmed' },
  { id:'neoliberalism_ideology__austerity', source:'neoliberalism_ideology', target:'austerity', type:'PRODUCED', label:'Produced', note:'Austerity policies are the primary fiscal instrument of neoliberal governance', confidence:'confirmed' },
  { id:'neoliberalism_ideology__supply_side_economics', source:'neoliberalism_ideology', target:'supply_side_economics', type:'ENABLED', label:'Enabled', note:'Supply-side economics is the theoretical foundation of neoliberal tax and spending policy', confidence:'confirmed' },
  { id:'neoliberalism_ideology__welfare_state', source:'neoliberalism_ideology', target:'welfare_state', type:'DISCREDITED', label:'Discredited', note:'Neoliberalism frames welfare state as inefficient and morally corrosive', confidence:'confirmed' },
  { id:'neoliberalism_ideology__privatization', source:'neoliberalism_ideology', target:'healthcare_privatization', type:'PRODUCED', label:'Produced', note:'Healthcare privatization is a neoliberal policy applied to public health systems', confidence:'confirmed' },
  { id:'neoliberalism_ideology__regulatory_capture', source:'neoliberalism_ideology', target:'regulatory_capture', type:'ENABLED', label:'Enabled', note:'Deregulation ideology creates conditions for regulatory capture by industry', confidence:'confirmed' },

  // groupthink
  { id:'groupthink__bay_of_pigs', source:'groupthink', target:'bay_of_pigs', type:'ENABLED', label:'Enabled', note:'Bay of Pigs is Janis\'s primary case study of catastrophic groupthink', confidence:'confirmed' },
  { id:'groupthink__propaganda', source:'groupthink', target:'propaganda', type:'ENABLED', label:'Enabled', note:'Groupthink in media organizations facilitates uncritical amplification of official propaganda', confidence:'confirmed' },
  { id:'groupthink__echo_chamber', source:'groupthink', target:'echo_chamber', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Echo chambers are groupthink operating at population scale', confidence:'confirmed' },

  // confirmation bias
  { id:'confirmation_bias_effect__echo_chamber', source:'confirmation_bias_effect', target:'echo_chamber', type:'ENABLED', label:'Enabled', note:'Confirmation bias drives individuals to seek out echo chambers confirming their views', confidence:'confirmed' },
  { id:'confirmation_bias_effect__conspiracy_theories', source:'confirmation_bias_effect', target:'conspiracy_theories', type:'ENABLED', label:'Enabled', note:'Conspiracy thinking exploits confirmation bias to resist disconfirming evidence', confidence:'confirmed' },
  { id:'confirmation_bias_effect__broken_epistemology', source:'confirmation_bias_effect', target:'broken_epistemology', type:'CAUSED', label:'Caused', note:'Confirmation bias at scale contributes to collapse of shared epistemic standards', confidence:'confirmed' },

  // tribalism
  { id:'tribalism__in_group_out_group_dynamics', source:'tribalism', target:'in_group_out_group_dynamics', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Tribalism is the political expression of in-group/out-group psychological dynamics', confidence:'confirmed' },
  { id:'tribalism__scapegoating', source:'tribalism', target:'scapegoating', type:'ENABLED', label:'Enabled', note:'Tribal psychology facilitates scapegoating of out-groups for in-group problems', confidence:'confirmed' },
  { id:'tribalism__populism', source:'tribalism', target:'populism', type:'ENABLED', label:'Enabled', note:'Populism mobilizes tribal instincts against designated elite enemies', confidence:'confirmed' },

  // AI
  { id:'artificial_intelligence__algorithmic_bias', source:'artificial_intelligence', target:'algorithmic_bias', type:'PRODUCED', label:'Produced', note:'AI systems are the primary source of contemporary algorithmic bias concerns', confidence:'confirmed' },
  { id:'artificial_intelligence__automation_economy', source:'artificial_intelligence', target:'automation_economy', type:'ENABLED', label:'Enabled', note:'AI-driven automation is accelerating job displacement across sectors', confidence:'confirmed' },
  { id:'artificial_intelligence__surveillance_capitalism', source:'artificial_intelligence', target:'surveillance_capitalism', type:'ENABLED', label:'Enabled', note:'AI makes surveillance capitalism more powerful through predictive behavioral modeling', confidence:'confirmed' }
];

// ── POLITICS EDGES ───────────────────────────────────────────────────────────
const newPolitEdges = [
  // libertarianism
  { id:'libertarianism__capitalism', source:'libertarianism', target:'capitalism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Libertarianism provides philosophical foundation for market capitalism', confidence:'confirmed' },
  { id:'libertarianism__neoliberalism_ideology', source:'libertarianism', target:'neoliberalism_ideology', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Libertarian thought is intellectual ancestor of neoliberal policy', confidence:'confirmed' },
  { id:'libertarianism__welfare_state', source:'libertarianism', target:'welfare_state', type:'DISCREDITED', label:'Discredited', note:'Libertarians oppose welfare state as coercive redistribution', confidence:'confirmed' },

  // theocracy
  { id:'theocracy__secularism', source:'theocracy', target:'secularism', type:'DISCREDITED', label:'Discredited', note:'Theocratic movements explicitly oppose separation of church and state', confidence:'confirmed' },
  { id:'theocracy__fascism', source:'theocracy', target:'fascism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both use total ideology to justify suppression of dissent and minority rights', confidence:'speculative' },
  { id:'moral_panic__theocracy', source:'moral_panic', target:'theocracy', type:'ENABLED', label:'Enabled', note:'Moral panics about sexual and cultural norms fuel religious nationalist politics', confidence:'confirmed' },

  // great society
  { id:'great_society__welfare_state', source:'great_society', target:'welfare_state', type:'PRODUCED', label:'Produced', note:'Great Society programs were the last major US welfare state expansion', confidence:'confirmed' },
  { id:'great_society__civil_rights_movement', source:'great_society', target:'civil_rights_movement', type:'ENABLED', label:'Enabled', note:'Great Society legislation enacted Civil Rights Act and Voting Rights Act', confidence:'confirmed' },
  { id:'great_society__vietnam_war', source:'great_society', target:'vietnam_war', type:'DISCREDITED', label:'Discredited', note:'Vietnam War costs destroyed political capital needed for Great Society programs', confidence:'confirmed' },

  // new deal
  { id:'new_deal__welfare_state', source:'new_deal', target:'welfare_state', type:'PRODUCED', label:'Produced', note:'New Deal created Social Security and foundational welfare state infrastructure', confidence:'confirmed' },
  { id:'new_deal__labor_movement', source:'new_deal', target:'labor_movement', type:'ENABLED', label:'Enabled', note:'Wagner Act was New Deal cornerstone enabling union organizing', confidence:'confirmed' },
  { id:'new_deal__keynesianism', source:'new_deal', target:'keynesianism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'New Deal embodied Keynesian demand management before Keynes fully theorized it', confidence:'confirmed' },
  { id:'great_depression__new_deal', source:'financial_crisis_2008', target:'new_deal', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'2008 crisis reignited debates about New Deal-style fiscal intervention', confidence:'speculative' },

  // bioethics
  { id:'bioethics__pharmaceutical_industry', source:'bioethics', target:'pharmaceutical_industry', type:'DISCREDITED', label:'Discredited', note:'Bioethics challenges clinical trial manipulation and profit-driven research agendas', confidence:'confirmed' },
  { id:'bioethics__healthcare_privatization', source:'bioethics', target:'healthcare_privatization', type:'DISCREDITED', label:'Discredited', note:'Medical ethics principles conflict with profit-driven healthcare denial', confidence:'confirmed' }
];

// ── PSYCHOLOGY EDGES ─────────────────────────────────────────────────────────
const newPsychEdges = [
  // authoritarian personality
  { id:'authoritarian_personality__fascism', source:'authoritarian_personality', target:'fascism', type:'ENABLED', label:'Enabled', note:'Authoritarian personality profile explains mass support for fascist movements', confidence:'confirmed' },
  { id:'authoritarian_personality__cult_dynamics', source:'authoritarian_personality', target:'cult_dynamics', type:'ENABLED', label:'Enabled', note:'Authoritarian personality creates susceptibility to cult-like submission to leaders', confidence:'confirmed' },
  { id:'authoritarian_personality__milgram_obedience', source:'authoritarian_personality', target:'milgram_obedience', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both explain how personality and situation combine to produce obedience to harmful authority', confidence:'confirmed' },

  // identity politics
  { id:'identity_politics__intersectionality', source:'identity_politics', target:'intersectionality', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Intersectionality provides theoretical framework for multiple-identity political analysis', confidence:'confirmed' },
  { id:'identity_politics__tribalism', source:'identity_politics', target:'tribalism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both operate through group identity dynamics though with different normative claims', confidence:'speculative' },
  { id:'identity_politics__cancel_culture', source:'identity_politics', target:'cancel_culture', type:'ENABLED', label:'Enabled', note:'Identity-based politics creates frameworks for accountability that manifest as cancel culture', confidence:'speculative' }
];

// ── HISTORY EDGES ────────────────────────────────────────────────────────────
const newHistEdges = [
  // mccarthyism
  { id:'mccarthyism__red_scare', source:'mccarthyism', target:'red_scare', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'McCarthyism is the second Red Scare, building on WWI Red Scare dynamics', confidence:'confirmed' },
  { id:'mccarthyism__moral_panic', source:'mccarthyism', target:'moral_panic', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'McCarthyism exhibited classic moral panic dynamics around communist infiltration', confidence:'confirmed' },
  { id:'mccarthyism__civil_rights_movement', source:'mccarthyism', target:'civil_rights_movement', type:'DISCREDITED', label:'Discredited', note:'Red-baiting was used to undermine civil rights leaders by labeling them communist', confidence:'confirmed' },

  // cultural revolution china
  { id:'cultural_revolution_china__mao', source:'cultural_revolution_china', target:'maoist_communism', type:'PRODUCED', label:'Produced', note:'Cultural Revolution was Mao\'s attempt to maintain ideological purity and personal power', confidence:'confirmed' },
  { id:'cultural_revolution_china__propaganda', source:'cultural_revolution_china', target:'propaganda', type:'ENABLED', label:'Enabled', note:'Cultural Revolution deployed mass propaganda through Little Red Book and wall posters', confidence:'confirmed' },
  { id:'cultural_revolution_china__dehumanization', source:'cultural_revolution_china', target:'dehumanization', type:'ENABLED', label:'Enabled', note:'Intellectuals and enemies were dehumanized through public struggle sessions', confidence:'confirmed' },

  // arab spring
  { id:'arab_spring__social_media_platforms', source:'arab_spring', target:'social_media_platforms', type:'ENABLED', label:'Enabled', note:'Social media played key role in coordinating Arab Spring protests', confidence:'confirmed' },
  { id:'arab_spring__internet_and_democracy', source:'arab_spring', target:'internet_and_democracy', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Arab Spring was seen as proof of internet democratization thesis before its limits showed', confidence:'confirmed' },
  { id:'arab_spring__civil_war_proxy', source:'arab_spring', target:'cold_war_proxy_wars', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Syrian civil war that emerged from Arab Spring became a proxy war for global powers', confidence:'confirmed' },

  // nuclear proliferation
  { id:'nuclear_proliferation__nuclear_weapons', source:'nuclear_proliferation', target:'nuclear_weapons', type:'PRODUCED', label:'Produced', note:'Nuclear weapons technology proliferation is the defining challenge of the nuclear age', confidence:'confirmed' },
  { id:'nuclear_proliferation__cold_war_nuclear_fear', source:'nuclear_proliferation', target:'cold_war_nuclear_fear', type:'ENABLED', label:'Enabled', note:'Proliferation beyond two superpowers intensified nuclear anxiety in Cold War era', confidence:'confirmed' }
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
for (const n of newPsychNodes) { if (!psnIds.has(n.id)) { psn.push(n); psnIds.add(n.id); added++; } }
for (const e of newPsychEdges) { if (!pseIds.has(e.id)) { pse.push(e); pseIds.add(e.id); edgesAdded++; } }
console.log('Psychology: +'+added+' nodes, +'+edgesAdded+' edges → '+psn.length+' nodes, '+pse.length+' edges');

added = 0; edgesAdded = 0;
for (const n of newHistNodes) { if (!hitnIds.has(n.id)) { hitn.push(n); hitnIds.add(n.id); added++; } }
for (const e of newHistEdges) { if (!hiteIds.has(e.id)) { hite.push(e); hiteIds.add(e.id); edgesAdded++; } }
console.log('History: +'+added+' nodes, +'+edgesAdded+' edges → '+hitn.length+' nodes, '+hite.length+' edges');

// Write all
write(BASE+'/mechanisms/nodes.json', mn);
write(BASE+'/mechanisms/edges.json', me);
write(BASE+'/global/politics/nodes.json', pn);
write(BASE+'/global/politics/edges.json', pe);
write(BASE+'/global/psychology/nodes.json', psn);
write(BASE+'/global/psychology/edges.json', pse);
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
