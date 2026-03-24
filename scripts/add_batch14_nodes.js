#!/usr/bin/env node
// Batch 14: Economics, Philosophy, Technology, Science, Additional History/Psychology
// New nodes: capitalism, keynesian_economics, marxism, colonialism_legacy, indigenous_rights,
//   automation_economy, platform_economy, privacy_rights, algorithmic_bias, cancel_culture,
//   postmodernism, social_media_radicalization, school_to_prison_pipeline, redlining,
//   black_panthers, suffrage_movement, cold_war_nuclear_fear, anti_vaccine_movement

const fs = require('fs');
const BASE = '/home/gorg/why/why-opedia/data';

function read(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function write(p, d) { fs.writeFileSync(p, JSON.stringify(d, null, 2)); }

// Load all scope files
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
    id: 'capitalism',
    label: 'Capitalism',
    node_type: 'ideology',
    category: 'ideology',
    decade: '1700s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Capitalism',
    summary: 'Economic system based on private ownership of the means of production, wage labor, and profit-driven markets. Has produced immense wealth while generating inequality, exploitation, and environmental degradation.',
    tags: ['capitalism','markets','private_property','profit','wage_labor','inequality','neoliberalism','economics']
  },
  {
    id: 'marxism',
    label: 'Marxism',
    node_type: 'ideology',
    category: 'ideology',
    decade: '1840s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Marxism',
    summary: 'Political and economic theory developed by Karl Marx and Friedrich Engels analyzing capitalism through class struggle, historical materialism, and the critique of exploitation. Foundation for socialist and communist movements.',
    tags: ['marxism','marx','class_struggle','historical_materialism','communism','socialism','capitalism_critique','labor']
  },
  {
    id: 'algorithmic_bias',
    label: 'Algorithmic Bias',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '2010s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Algorithmic_bias',
    summary: 'Systematic errors in AI/algorithmic outputs that create unfair outcomes for certain groups, often encoding and amplifying existing social biases from training data or flawed design choices.',
    tags: ['algorithmic_bias','AI','machine_learning','discrimination','fairness','data_bias','surveillance','automation']
  },
  {
    id: 'platform_economy',
    label: 'Platform Economy',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2010s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Platform_economy',
    summary: 'Economic model where digital platforms mediate transactions between users, workers, and consumers — concentrating power among a few corporations while reclassifying workers as independent contractors to avoid labor protections.',
    tags: ['platform_economy','gig_economy','uber','amazon','labor_rights','monopoly','technology','inequality']
  },
  {
    id: 'automation_economy',
    label: 'Automation & Job Displacement',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2010s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Technological_unemployment',
    summary: 'The replacement of human labor by machines and AI, accelerating income inequality, occupational disruption, and demands for universal basic income and retraining programs.',
    tags: ['automation','technological_unemployment','robots','AI','inequality','UBI','labor','future_of_work']
  }
];

// ── NEW POLITICS NODES ───────────────────────────────────────────────────────
const newPolitNodes = [
  {
    id: 'indigenous_rights',
    label: 'Indigenous Rights Movement',
    node_type: 'movement',
    category: 'movement',
    decade: '1970s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Indigenous_rights',
    summary: 'Global movement for the political, land, cultural, and self-determination rights of Indigenous peoples, challenging centuries of colonization, forced assimilation, and erasure.',
    tags: ['indigenous_rights','decolonization','sovereignty','AIM','land_rights','UNDRIP','First_Nations','native_american']
  },
  {
    id: 'privacy_rights',
    label: 'Digital Privacy Rights',
    node_type: 'concept',
    category: 'concept',
    decade: '2000s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Privacy_law',
    summary: 'The legal and political struggle to protect individual privacy against corporate data collection, government surveillance, and the erosion of informational autonomy in the digital age.',
    tags: ['privacy','GDPR','data_protection','surveillance','civil_liberties','internet_rights','tech_regulation','NSA']
  },
  {
    id: 'cancel_culture',
    label: 'Cancel Culture Debate',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2010s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Cancel_culture',
    summary: 'Social phenomenon where individuals or organizations face public boycotts or ostracism following accusations of offensive behavior. Contested as accountability vs. mob censorship depending on political perspective.',
    tags: ['cancel_culture','social_media','accountability','free_speech','boycott','woke','culture_war','platform']
  },
  {
    id: 'school_to_prison_pipeline',
    label: 'School-to-Prison Pipeline',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1990s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/School-to-prison_pipeline',
    summary: 'Pattern of policies and practices that push students — disproportionately Black and Latino — from schools into the criminal justice system through zero-tolerance discipline and police presence in schools.',
    tags: ['school_to_prison_pipeline','zero_tolerance','mass_incarceration','racial_disparity','juvenile_justice','education','police']
  },
  {
    id: 'redlining',
    label: 'Redlining & Segregation Policy',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1930s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Redlining',
    summary: 'Government and banking practice that denied mortgages and financial services to Black Americans by marking minority neighborhoods as high-risk, systematically preventing wealth accumulation and creating lasting racial economic inequality.',
    tags: ['redlining','housing_discrimination','segregation','racism','wealth_gap','HOLC','FHA','urban_disinvestment']
  },
  {
    id: 'anti_vaccine_movement',
    label: 'Anti-Vaccine Movement',
    node_type: 'movement',
    category: 'movement',
    decade: '1990s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Anti-vaccination_movement',
    summary: 'Social movement opposing vaccines, fueled by discredited research, distrust of pharmaceutical industry, and conspiracy theories — causing measles resurgences and undermining public health infrastructure globally.',
    tags: ['anti_vaccine','vaccines','misinformation','public_health','conspiracy','autism','wakefield','measles','hesitancy']
  }
];

// ── NEW PSYCHOLOGY NODES ─────────────────────────────────────────────────────
const newPsychNodes = [
  {
    id: 'postmodernism',
    label: 'Postmodernism',
    node_type: 'ideology',
    category: 'ideology',
    decade: '1960s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Postmodernism',
    summary: 'Intellectual and cultural movement rejecting grand narratives, objective truth, and universal values. Influential in academia, art, and politics — critiqued for relativism and weaponized in anti-science discourse.',
    tags: ['postmodernism','deconstruction','relativism','foucault','derrida','truth','narrative','academia','philosophy']
  },
  {
    id: 'social_media_radicalization',
    label: 'Social Media Radicalization',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2010s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Online_radicalization',
    summary: 'Process by which individuals are drawn toward extreme ideologies through algorithmic recommendation systems, online communities, and targeted propaganda — accelerating political polarization and real-world violence.',
    tags: ['radicalization','social_media','algorithms','extremism','youtube','online_communities','polarization','terrorism']
  }
];

// ── NEW HISTORY NODES ────────────────────────────────────────────────────────
const newHistNodes = [
  {
    id: 'suffrage_movement',
    label: "Women's Suffrage Movement",
    node_type: 'movement',
    category: 'movement',
    decade: '1840s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: "https://en.wikipedia.org/wiki/Women%27s_suffrage",
    summary: "The struggle for women's right to vote, spanning 70+ years from the Seneca Falls Convention (1848) to the 19th Amendment (1920) in the US and parallel movements worldwide. Foundation of modern feminist politics.",
    tags: ['suffrage','womens_rights','voting','feminism','seneca_falls','19th_amendment','emmeline_pankhurst','civil_rights']
  },
  {
    id: 'black_panthers',
    label: 'Black Panther Party',
    node_type: 'organization',
    category: 'organization',
    decade: '1960s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Black_Panther_Party',
    summary: 'Marxist revolutionary organization founded 1966 in Oakland by Huey Newton and Bobby Seale. Organized armed community patrols, free breakfast programs, and community health clinics — suppressed by FBI COINTELPRO.',
    tags: ['black_panthers','black_power','COINTELPRO','Huey_Newton','Oakland','community_organizing','revolutionary','FBI']
  },
  {
    id: 'cold_war_nuclear_fear',
    label: 'Cold War Nuclear Fear',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1950s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Nuclear_fear',
    summary: 'Collective psychological and cultural anxiety about nuclear annihilation during the Cold War, shaping civil defense programs, pop culture, protest movements, and arms control negotiations from 1945 through the 1980s.',
    tags: ['cold_war','nuclear_fear','MAD','duck_and_cover','fallout_shelter','arms_race','protest','civil_defense']
  },
  {
    id: 'colonialism_legacy',
    label: 'Colonial Legacy & Ongoing Effects',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1950s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Legacy_of_colonialism',
    summary: 'The enduring political, economic, psychological, and cultural consequences of European colonialism: from arbitrary borders and extractive institutions to ongoing wealth inequality between former colonizers and colonized nations.',
    tags: ['colonialism','post_colonialism','imperialism','wealth_gap','borders','Africa','Asia','global_south','neo_colonialism']
  }
];

// ── NEW MECHANISM EDGES ──────────────────────────────────────────────────────
const newMechEdges = [
  // capitalism connections
  { id:'capitalism__supply_side_economics', source:'capitalism', target:'supply_side_economics', type:'PRODUCED', label:'Produced', note:'Supply-side economics is a policy expression of capitalist ideology', confidence:'confirmed' },
  { id:'capitalism__wealth_inequality', source:'capitalism', target:'wealth_inequality', type:'CAUSED', label:'Caused', note:'Market capitalism generates and concentrates wealth inequality without redistribution', confidence:'confirmed' },
  { id:'capitalism__regulatory_capture', source:'capitalism', target:'regulatory_capture', type:'ENABLED', label:'Enabled', note:'Profit motive creates incentives for corporations to capture regulators', confidence:'confirmed' },
  { id:'capitalism__austerity', source:'capitalism', target:'austerity', type:'PRODUCED', label:'Produced', note:'Austerity is a tool to protect capital from redistribution pressures', confidence:'confirmed' },
  { id:'capitalism__platform_economy', source:'capitalism', target:'platform_economy', type:'PRODUCED', label:'Produced', note:'Platform economy is late-stage capitalism applied to digital infrastructure', confidence:'confirmed' },
  { id:'capitalism__automation_economy', source:'capitalism', target:'automation_economy', type:'ENABLED', label:'Enabled', note:'Profit-driven automation accelerates labor displacement', confidence:'confirmed' },

  // marxism connections
  { id:'marxism__capitalism', source:'marxism', target:'capitalism', type:'DISCREDITED', label:'Discredited', note:'Marxism provides systematic critique of capitalism as exploitative', confidence:'confirmed' },
  { id:'marxism__class_consciousness', source:'marxism', target:'social_contract_theory', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both analyze the power relationship between classes and the state', confidence:'speculative' },
  { id:'marxism__labor_movement', source:'marxism', target:'labor_movement', type:'ENABLED', label:'Enabled', note:'Marxist theory provided intellectual framework for labor organizing', confidence:'confirmed' },

  // algorithmic bias
  { id:'algorithmic_bias__surveillance_state', source:'algorithmic_bias', target:'surveillance_state', type:'ENABLED', label:'Enabled', note:'Biased algorithms amplify surveillance harms against minority communities', confidence:'confirmed' },
  { id:'algorithmic_bias__social_media_radicalization', source:'algorithmic_bias', target:'social_media_radicalization', type:'ENABLED', label:'Enabled', note:'Engagement-optimizing algorithms funnel users toward extreme content', confidence:'confirmed' },
  { id:'algorithmic_bias__echo_chamber', source:'algorithmic_bias', target:'echo_chamber', type:'ENABLED', label:'Enabled', note:'Recommendation systems reinforce existing beliefs and segregate audiences', confidence:'confirmed' },

  // platform economy
  { id:'platform_economy__wealth_inequality', source:'platform_economy', target:'wealth_inequality', type:'CAUSED', label:'Caused', note:'Platform monopolies capture value while gig workers lack protections', confidence:'confirmed' },
  { id:'platform_economy__automation_economy', source:'platform_economy', target:'automation_economy', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both erode traditional employment and labor protections', confidence:'confirmed' },

  // automation
  { id:'automation_economy__wealth_inequality', source:'automation_economy', target:'wealth_inequality', type:'CAUSED', label:'Caused', note:'Automation concentrates gains among capital owners while displacing workers', confidence:'confirmed' },
  { id:'automation_economy__social_safety_net', source:'automation_economy', target:'social_safety_net', type:'ENABLED', label:'Enabled', note:'Automation disruption drives demand for expanded safety nets and UBI', confidence:'confirmed' }
];

// ── NEW POLITICS EDGES ───────────────────────────────────────────────────────
const newPolitEdges = [
  // indigenous rights
  { id:'indigenous_rights__decolonization_africa', source:'indigenous_rights', target:'decolonization_africa', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both challenge European colonial systems and demand sovereignty', confidence:'confirmed' },
  { id:'indigenous_rights__israel_palestine', source:'indigenous_rights', target:'israel_palestine', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Indigenous rights frameworks are applied in settler-colonial analyses of the conflict', confidence:'speculative' },
  { id:'indigenous_rights__trail_of_tears', source:'indigenous_rights', target:'trail_of_tears', type:'PRODUCED', label:'Produced', note:'Trail of Tears created political consciousness driving rights movements', confidence:'confirmed' },
  { id:'colonialism_legacy__indigenous_rights', source:'colonialism_legacy', target:'indigenous_rights', type:'PRODUCED', label:'Produced', note:'Colonial dispossession gave rise to Indigenous rights movements', confidence:'confirmed' },

  // privacy rights
  { id:'privacy_rights__surveillance_state', source:'privacy_rights', target:'surveillance_state', type:'DISCREDITED', label:'Discredited', note:'Privacy advocates challenge mass surveillance as unconstitutional', confidence:'confirmed' },
  { id:'surveillance_state__privacy_rights', source:'surveillance_state', target:'privacy_rights', type:'DISCREDITED', label:'Discredited', note:'Surveillance programs reframe privacy as a threat to security', confidence:'confirmed' },
  { id:'privacy_rights__police_brutality', source:'privacy_rights', target:'police_brutality', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both address state power over citizens without accountability', confidence:'speculative' },

  // cancel culture
  { id:'cancel_culture__postmodernism', source:'cancel_culture', target:'postmodernism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Cancel culture debates mirror postmodern disputes over truth and power', confidence:'speculative' },
  { id:'cancel_culture__social_media_radicalization', source:'cancel_culture', target:'social_media_radicalization', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both emerge from social media dynamics of public shaming and group reinforcement', confidence:'confirmed' },
  { id:'moral_panic__cancel_culture', source:'moral_panic', target:'cancel_culture', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Cancel culture episodes often exhibit classic moral panic dynamics', confidence:'confirmed' },

  // school to prison pipeline
  { id:'school_to_prison_pipeline__mass_incarceration', source:'school_to_prison_pipeline', target:'mass_incarceration', type:'ENABLED', label:'Enabled', note:'Zero-tolerance school policies feed directly into carceral system', confidence:'confirmed' },
  { id:'school_to_prison_pipeline__prison_industrial_complex', source:'school_to_prison_pipeline', target:'prison_industrial_complex', type:'ENABLED', label:'Enabled', note:'School discipline systems supply labor to private prison industry', confidence:'confirmed' },
  { id:'school_to_prison_pipeline__jim_crow', source:'school_to_prison_pipeline', target:'jim_crow', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both use institutional mechanisms to enforce racial hierarchy', confidence:'confirmed' },

  // redlining
  { id:'redlining__wealth_inequality', source:'redlining', target:'wealth_inequality', type:'CAUSED', label:'Caused', note:'Decades of denied mortgages prevented Black wealth accumulation across generations', confidence:'confirmed' },
  { id:'redlining__police_brutality', source:'redlining', target:'police_brutality', type:'ENABLED', label:'Enabled', note:'Segregated neighborhoods created conditions for over-policing and brutality', confidence:'confirmed' },
  { id:'redlining__reparations_debate', source:'redlining', target:'reparations_debate', type:'PRODUCED', label:'Produced', note:'Redlining is a primary exhibit in reparations arguments for wealth remediation', confidence:'confirmed' },
  { id:'jim_crow__redlining', source:'jim_crow', target:'redlining', type:'ENABLED', label:'Enabled', note:'Jim Crow racial ideology extended into housing policy through federal programs', confidence:'confirmed' },

  // anti-vaccine
  { id:'anti_vaccine_movement__conspiracy_theories', source:'anti_vaccine_movement', target:'conspiracy_theories', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Anti-vaccine beliefs are a major vector for health-related conspiracy theories', confidence:'confirmed' },
  { id:'anti_vaccine_movement__tobacco_industry', source:'anti_vaccine_movement', target:'tobacco_industry', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both use manufactured doubt and industry-funded science denial tactics', confidence:'confirmed' },
  { id:'anti_vaccine_movement__propaganda', source:'anti_vaccine_movement', target:'propaganda', type:'ENABLED', label:'Enabled', note:'Anti-vaccine campaigns use propaganda techniques to manufacture doubt and spread fear', confidence:'confirmed' }
];

// ── NEW PSYCHOLOGY EDGES ─────────────────────────────────────────────────────
const newPsychEdges = [
  // postmodernism
  { id:'postmodernism__conspiracy_theories', source:'postmodernism', target:'conspiracy_theories', type:'ENABLED', label:'Enabled', note:'Relativism about truth contributes to distrust of official narratives and expertise', confidence:'speculative' },
  { id:'postmodernism__cancel_culture', source:'postmodernism', target:'cancel_culture', type:'ENABLED', label:'Enabled', note:'Postmodern focus on power dynamics underlies many cancel culture rationales', confidence:'speculative' },
  { id:'postmodernism__feminist_theory', source:'postmodernism', target:'feminist_theory', type:'ENABLED', label:'Enabled', note:'Postmodern philosophy deeply influenced intersectional and third-wave feminism', confidence:'confirmed' },
  { id:'postmodernism__radicalization', source:'postmodernism', target:'radicalization', type:'ENABLED', label:'Enabled', note:'Rejection of shared truths facilitates radicalization into alternative epistemologies', confidence:'speculative' },

  // social media radicalization
  { id:'social_media_radicalization__radicalization', source:'social_media_radicalization', target:'radicalization', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Online radicalization accelerates and scales traditional radicalization processes', confidence:'confirmed' },
  { id:'social_media_radicalization__mgtow', source:'social_media_radicalization', target:'mgtow', type:'ENABLED', label:'Enabled', note:'YouTube and Reddit pipelines drive men into manosphere communities', confidence:'confirmed' },
  { id:'social_media_radicalization__conspiracy_theories', source:'social_media_radicalization', target:'conspiracy_theories', type:'ENABLED', label:'Enabled', note:'Engagement algorithms amplify conspiracy content for emotional engagement', confidence:'confirmed' }
];

// ── NEW HISTORY EDGES ────────────────────────────────────────────────────────
const newHistEdges = [
  // suffrage movement
  { id:'suffrage_movement__second_wave_feminism', source:'suffrage_movement', target:'second_wave_feminism', type:'ENABLED', label:'Enabled', note:'Suffrage established foundation for later feminist waves', confidence:'confirmed' },
  { id:'suffrage_movement__civil_rights_movement', source:'suffrage_movement', target:'civil_rights_movement', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both used civil disobedience, legal mobilization, and coalition-building', confidence:'confirmed' },
  { id:'suffrage_movement__nonviolent_resistance', source:'suffrage_movement', target:'nonviolent_resistance', type:'PRODUCED', label:'Produced', note:'Suffragist tactics pioneered many nonviolent resistance strategies', confidence:'confirmed' },

  // black panthers
  { id:'black_panthers__cointelpro', source:'black_panthers', target:'cointelpro', type:'FORCED_INTO', label:'Forced into', note:'Black Panther Party was primary COINTELPRO target for infiltration and suppression', confidence:'confirmed' },
  { id:'black_panthers__civil_rights_movement', source:'black_panthers', target:'civil_rights_movement', type:'FRAGMENTED_INTO', label:'Fragmented into', note:'Black Power movement emerged partly from disillusionment with nonviolent civil rights strategy', confidence:'confirmed' },
  { id:'black_panthers__mass_incarceration', source:'black_panthers', target:'mass_incarceration', type:'FORCED_INTO', label:'Forced into', note:'COINTELPRO targeting of Panthers contributed to criminalization of Black organizing', confidence:'confirmed' },
  { id:'marxism__black_panthers', source:'marxism', target:'black_panthers', type:'ENABLED', label:'Enabled', note:'Black Panther Party explicitly drew on Marxist-Leninist ideology', confidence:'confirmed' },

  // cold war nuclear fear
  { id:'cold_war_nuclear_fear__nuclear_weapons', source:'cold_war_nuclear_fear', target:'nuclear_weapons', type:'PRODUCED', label:'Produced', note:'Nuclear weapons created the existential fear that defined Cold War culture', confidence:'confirmed' },
  { id:'cold_war_nuclear_fear__cuban_missile_crisis', source:'cold_war_nuclear_fear', target:'cuban_missile_crisis', type:'PRODUCED', label:'Produced', note:'Cuban Missile Crisis was the peak expression of nuclear terror', confidence:'confirmed' },
  { id:'cold_war_nuclear_fear__cold_war_culture', source:'cold_war_nuclear_fear', target:'cold_war_culture', type:'ENABLED', label:'Enabled', note:'Nuclear anxiety shaped Cold War film, art, literature, and civil society', confidence:'confirmed' },
  { id:'cold_war_nuclear_fear__lgbtq_rights_movement', source:'cold_war_nuclear_fear', target:'lgbtq_rights_movement', type:'PROVIDED_COVER_FOR', label:'Provided cover for', note:'Cold War moral panic about communism linked to persecution of gay people as security risks', confidence:'confirmed' },

  // colonialism legacy
  { id:'colonialism_legacy__decolonization_africa', source:'colonialism_legacy', target:'decolonization_africa', type:'PRODUCED', label:'Produced', note:'Colonial exploitation created the conditions that drove African decolonization', confidence:'confirmed' },
  { id:'colonialism_legacy__wealth_inequality', source:'colonialism_legacy', target:'wealth_inequality', type:'CAUSED', label:'Caused', note:'Colonial extraction created persistent global wealth inequality between nations', confidence:'confirmed' },
  { id:'colonialism_legacy__resource_extraction', source:'colonialism_legacy', target:'resource_extraction', type:'PRODUCED', label:'Produced', note:'Colonialism institutionalized resource extraction from periphery to core', confidence:'confirmed' },
  { id:'colonial_era__colonialism_legacy', source:'colonial_era', target:'colonialism_legacy', type:'PRODUCED', label:'Produced', note:'The colonial era directly produced the ongoing structural legacies', confidence:'confirmed' }
];

// ── APPLY CHANGES ────────────────────────────────────────────────────────────
let mAdded = 0, eAdded = 0;
for (const n of newMechNodes) { if (!mnIds.has(n.id)) { mn.push(n); mnIds.add(n.id); mAdded++; } }
for (const e of newMechEdges) { if (!meIds.has(e.id)) { me.push(e); meIds.add(e.id); eAdded++; } }
console.log('Mechanisms: +'+mAdded+' nodes, +'+eAdded+' edges → '+mn.length+' nodes, '+me.length+' edges');

let pAdded = 0, peAdded = 0;
for (const n of newPolitNodes) { if (!pIds.has(n.id)) { pn.push(n); pIds.add(n.id); pAdded++; } }
for (const e of newPolitEdges) { if (!peIds.has(e.id)) { pe.push(e); peIds.add(e.id); peAdded++; } }
console.log('Politics: +'+pAdded+' nodes, +'+peAdded+' edges → '+pn.length+' nodes, '+pe.length+' edges');

let psAdded = 0, pseAdded = 0;
for (const n of newPsychNodes) { if (!psnIds.has(n.id)) { psn.push(n); psnIds.add(n.id); psAdded++; } }
for (const e of newPsychEdges) { if (!pseIds.has(e.id)) { pse.push(e); pseIds.add(e.id); pseAdded++; } }
console.log('Psychology: +'+psAdded+' nodes, +'+pseAdded+' edges → '+psn.length+' nodes, '+pse.length+' edges');

let histAdded = 0, hiteAdded = 0;
for (const n of newHistNodes) { if (!hitnIds.has(n.id)) { hitn.push(n); hitnIds.add(n.id); histAdded++; } }
for (const e of newHistEdges) { if (!hiteIds.has(e.id)) { hite.push(e); hiteIds.add(e.id); hiteAdded++; } }
console.log('History: +'+histAdded+' nodes, +'+hiteAdded+' edges → '+hitn.length+' nodes, '+hite.length+' edges');

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
const allNodes = new Map();
for (const n of mn) allNodes.set(n.id, 'mechanisms');
for (const n of medn) allNodes.set(n.id, 'media');
for (const n of pn) allNodes.set(n.id, 'politics');
for (const n of psn) allNodes.set(n.id, 'psychology');
for (const n of hn) allNodes.set(n.id, 'health');
for (const n of hitn) allNodes.set(n.id, 'history');

let orphans = 0;
for (const edgeList of [me, mede, pe, pse, he, hite]) {
  for (const e of edgeList) {
    if (!allNodes.has(e.source)) { console.error('ORPHAN source: '+e.source+' in edge '+e.id); orphans++; }
    if (!allNodes.has(e.target)) { console.error('ORPHAN target: '+e.target+' in edge '+e.id); orphans++; }
  }
}
console.log('Total orphans: '+orphans);
