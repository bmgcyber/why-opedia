#!/usr/bin/env node
// Batch 16: Fascism/Authoritarianism, Populism, Social Movements, More Psychology/Health
// New nodes: fascism, populism, authoritarianism, welfare_state, universal_basic_income,
//   climate_activism, environmental_justice, systemic_racism, white_supremacy,
//   intergenerational_trauma, narcissistic_personality, cult_dynamics,
//   indigenous_trauma, healthcare_privatization, gun_violence_policy

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
    id: 'fascism',
    label: 'Fascism',
    node_type: 'ideology',
    category: 'ideology',
    decade: '1920s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Fascism',
    summary: 'Far-right authoritarian ultranationalism combining dictatorial power, forcible suppression of opposition, and strong regimentation of society and the economy. Emerged in Italy and Germany and drives contemporary far-right movements.',
    tags: ['fascism','authoritarianism','nationalism','Mussolini','Hitler','far_right','totalitarianism','violence','ultranationalism']
  },
  {
    id: 'populism',
    label: 'Populism',
    node_type: 'ideology',
    category: 'ideology',
    decade: '1890s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Populism',
    summary: 'Political approach that frames politics as a struggle between corrupt elites and the virtuous common people. Used by both left and right; right-wing populism often scapegoats minorities while left-wing targets economic elites.',
    tags: ['populism','anti_elite','nationalism','Trump','Chavez','class','people_vs_elite','scapegoating','democracy']
  },
  {
    id: 'scapegoating',
    label: 'Scapegoating',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1930s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Scapegoating',
    summary: 'Psychological and political process of blaming a group for problems caused by others or by systemic forces. Core mechanism of fascism, genocide, and authoritarian politics — redirecting class frustration onto ethnic/religious minorities.',
    tags: ['scapegoating','blame','prejudice','minority','fascism','psychology','frustration_aggression','genocide','antisemitism']
  },
  {
    id: 'cult_dynamics',
    label: 'Cult Dynamics & Thought Control',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1970s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Cult',
    summary: 'Psychological control patterns including isolation, love bombing, thought-terminating clichés, and exit costs — used by religious cults, MLM schemes, authoritarian parties, and extremist movements to maintain total loyalty.',
    tags: ['cult','thought_control','isolation','love_bombing','BITE_model','Lifton','coercive_control','indoctrination','high_demand_group']
  },
  {
    id: 'systemic_racism',
    label: 'Systemic Racism',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1960s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Institutional_racism',
    summary: 'The cumulative and compounding effects of racist policies, practices, and norms embedded in institutions — producing racial disparities in wealth, housing, education, health, and criminal justice even without individual racial intent.',
    tags: ['systemic_racism','institutional_racism','racial_disparities','housing','criminal_justice','wealth_gap','policy','discrimination']
  }
];

// ── NEW POLITICS NODES ───────────────────────────────────────────────────────
const newPolitNodes = [
  {
    id: 'welfare_state',
    label: 'Welfare State',
    node_type: 'concept',
    category: 'concept',
    decade: '1940s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Welfare_state',
    summary: 'Model of government providing universal social protections including healthcare, unemployment insurance, pensions, and housing — developed in post-WWII Europe and Scandinavia, under sustained neoliberal attack since the 1980s.',
    tags: ['welfare_state','social_democracy','universal_healthcare','Beveridge','Scandinavia','redistribution','public_goods','neoliberalism']
  },
  {
    id: 'universal_basic_income',
    label: 'Universal Basic Income',
    node_type: 'concept',
    category: 'concept',
    decade: '2010s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Universal_basic_income',
    summary: 'Policy proposal for unconditional regular cash payments to all citizens. Advocated as response to automation displacement, poverty elimination, and simplification of welfare bureaucracy. Piloted in Finland, Kenya, Stockton CA.',
    tags: ['UBI','universal_basic_income','automation','poverty','welfare','cash_transfer','freedom','pilot_programs']
  },
  {
    id: 'climate_activism',
    label: 'Climate Activism',
    node_type: 'movement',
    category: 'movement',
    decade: '2010s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Climate_movement',
    summary: 'Global movement demanding urgent government action on climate change, from Fridays for Future and Greta Thunberg to Extinction Rebellion and Standing Rock — spanning protest, litigation, and civil disobedience.',
    tags: ['climate_activism','Greta_Thunberg','Fridays_for_Future','Extinction_Rebellion','Green_New_Deal','fossil_fuels','youth','protest']
  },
  {
    id: 'environmental_justice',
    label: 'Environmental Justice',
    node_type: 'movement',
    category: 'movement',
    decade: '1980s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Environmental_justice',
    summary: 'Movement addressing disproportionate exposure of low-income and minority communities to environmental hazards including pollution, toxic waste, and climate impacts — connecting environmental and civil rights struggles.',
    tags: ['environmental_justice','pollution','communities_of_color','sacrifice_zones','standing_rock','Flint','EPA','civil_rights']
  },
  {
    id: 'gun_violence_policy',
    label: 'Gun Violence & Policy',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1990s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Gun_violence_in_the_United_States',
    summary: 'The intersection of gun rights politics, Second Amendment interpretation, mass shootings, and failed legislative efforts for universal background checks or assault weapons bans — shaped by NRA lobbying and rural/urban cultural divisions.',
    tags: ['gun_violence','Second_Amendment','NRA','mass_shootings','gun_control','lobbying','school_shootings','mental_health']
  },
  {
    id: 'white_supremacy_movement',
    label: 'White Supremacy & Far-Right Extremism',
    node_type: 'movement',
    category: 'movement',
    decade: '1860s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/White_supremacy',
    summary: 'Ideology and movement asserting white racial superiority, from Ku Klux Klan and neo-Nazis to modern alt-right and accelerationist networks — responsible for domestic terrorism and mainstreaming of racist policy discourse.',
    tags: ['white_supremacy','KKK','neo_nazi','alt_right','accelerationism','domestic_terrorism','great_replacement','racism','far_right']
  }
];

// ── NEW PSYCHOLOGY NODES ─────────────────────────────────────────────────────
const newPsychNodes = [
  {
    id: 'intergenerational_trauma',
    label: 'Intergenerational Trauma',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1960s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Transgenerational_trauma',
    summary: 'The transmission of trauma and its psychological effects across generations through epigenetic changes, family dynamics, and cultural patterns. Documented in Holocaust survivors, Indigenous communities, and descendants of enslaved people.',
    tags: ['intergenerational_trauma','epigenetics','Holocaust','indigenous','slavery','PTSD','family_systems','transgenerational']
  },
  {
    id: 'narcissistic_abuse',
    label: 'Narcissistic Personality & Abuse Dynamics',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1980s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Narcissistic_personality_disorder',
    summary: 'Patterns of exploitation, manipulation, and emotional abuse associated with narcissistic personality — DARVO (Deny, Attack, Reverse Victim and Offender), gaslighting, and love bombing — found in intimate relationships and authoritarian leadership.',
    tags: ['narcissism','NPD','DARVO','gaslighting','love_bombing','coercive_control','abuse','manipulation','psychological_abuse']
  }
];

// ── NEW HEALTH NODES ─────────────────────────────────────────────────────────
const newHealthNodes = [
  {
    id: 'healthcare_privatization',
    label: 'Healthcare Privatization',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1980s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Privatization_of_health_care',
    summary: 'Transfer of healthcare services from public to private ownership, driven by neoliberal ideology — leading to profit-driven denials of care, hospital consolidation, rising costs, and deteriorating outcomes for low-income populations.',
    tags: ['healthcare_privatization','insurance','for_profit','hospital_consolidation','neoliberalism','medical_debt','coverage','costs']
  },
  {
    id: 'obesity_epidemic',
    label: 'Obesity Epidemic',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1980s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Obesity_epidemic',
    summary: 'The dramatic rise in obesity rates since the 1980s driven by food industry reformulation, sedentary work, food deserts, marketing to children, and income inequality — intersecting with individual responsibility narratives that obscure structural causes.',
    tags: ['obesity','food_industry','ultra_processed_food','food_deserts','inequality','public_health','sugar','corporate_responsibility']
  }
];

// ── NEW HISTORY NODES ────────────────────────────────────────────────────────
const newHistNodes = [
  {
    id: 'world_war_two',
    label: 'World War II',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1940s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/World_War_II',
    summary: 'Global war 1939-1945 involving most of the world\'s nations. Killed 70-85 million people including Holocaust, Hiroshima, and Nanjing. Led to UN founding, decolonization wave, Cold War, and fundamental reshaping of global order.',
    tags: ['WWII','Hitler','Holocaust','Hiroshima','UN','D-Day','Pacific','Europe','genocide','nuclear','Cold_War']
  },
  {
    id: 'vietnam_war',
    label: 'Vietnam War',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1960s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Vietnam_War',
    summary: 'US military involvement in Vietnam 1955-1975 during Cold War containment strategy — killing 3 million Vietnamese and 58,000 Americans while generating massive domestic antiwar movement and reshaping American political culture.',
    tags: ['Vietnam','Cold_War','antiwar','containment','My_Lai','Pentagon_Papers','draft','protest','soldiers','casualties']
  }
];

// ── MECHANISM EDGES ──────────────────────────────────────────────────────────
const newMechEdges = [
  // fascism
  { id:'fascism__scapegoating', source:'fascism', target:'scapegoating', type:'ENABLED', label:'Enabled', note:'Scapegoating ethnic minorities is core to fascist political strategy', confidence:'confirmed' },
  { id:'fascism__propaganda', source:'fascism', target:'propaganda', type:'ENABLED', label:'Enabled', note:'Fascist states pioneered mass propaganda systems for psychological control', confidence:'confirmed' },
  { id:'fascism__authoritarianism', source:'fascism', target:'authoritarianism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Fascism is a specific form of authoritarian rule with nationalist ideology', confidence:'confirmed' },
  { id:'fascism__dehumanization', source:'fascism', target:'dehumanization', type:'ENABLED', label:'Enabled', note:'Fascism requires dehumanization of target groups to mobilize violence', confidence:'confirmed' },
  { id:'fascism__cult_dynamics', source:'fascism', target:'cult_dynamics', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Fascist movements use cult-like loyalty mechanisms around the leader', confidence:'confirmed' },

  // populism
  { id:'populism__fascism', source:'populism', target:'fascism', type:'ENABLED', label:'Enabled', note:'Right-wing populism can become fascist when combined with ethnic nationalism and violence', confidence:'confirmed' },
  { id:'populism__scapegoating', source:'populism', target:'scapegoating', type:'ENABLED', label:'Enabled', note:'Populist politics often scapegoat immigrants or minorities for elite failures', confidence:'confirmed' },
  { id:'populism__authoritarianism', source:'populism', target:'authoritarianism', type:'ENABLED', label:'Enabled', note:'Populist leaders claim popular mandate to undermine democratic institutions', confidence:'confirmed' },

  // scapegoating
  { id:'scapegoating__antisemitism', source:'scapegoating', target:'antisemitism', type:'ENABLED', label:'Enabled', note:'Antisemitism is historically the most persistent form of political scapegoating', confidence:'confirmed' },
  { id:'scapegoating__moral_panic', source:'scapegoating', target:'moral_panic', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Moral panics are episodic scapegoating of specific groups or behaviors', confidence:'confirmed' },
  { id:'scapegoating__authoritarianism', source:'scapegoating', target:'authoritarianism', type:'ENABLED', label:'Enabled', note:'Authoritarian leaders use scapegoating to deflect from systemic failures', confidence:'confirmed' },

  // cult dynamics
  { id:'cult_dynamics__radicalization', source:'cult_dynamics', target:'radicalization', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Online radicalization pipelines use same isolation and identity replacement as cult recruitment', confidence:'confirmed' },
  { id:'cult_dynamics__gaslighting', source:'cult_dynamics', target:'gaslighting', type:'ENABLED', label:'Enabled', note:'Cult thought control involves sustained gaslighting about external reality', confidence:'confirmed' },
  { id:'cult_dynamics__narcissistic_abuse', source:'cult_dynamics', target:'narcissistic_abuse', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Cult leaders typically display narcissistic patterns and subject followers to narcissistic abuse', confidence:'confirmed' },

  // systemic racism
  { id:'systemic_racism__redlining', source:'systemic_racism', target:'redlining', type:'ENABLED', label:'Enabled', note:'Redlining is a paradigmatic example of institutionalized systemic racism', confidence:'confirmed' },
  { id:'systemic_racism__school_to_prison_pipeline', source:'systemic_racism', target:'school_to_prison_pipeline', type:'ENABLED', label:'Enabled', note:'Racialized school discipline is a direct product of systemic racism in education', confidence:'confirmed' },
  { id:'systemic_racism__mass_incarceration', source:'systemic_racism', target:'mass_incarceration', type:'ENABLED', label:'Enabled', note:'War on drugs and mass incarceration are products of systemic racial bias in criminal justice', confidence:'confirmed' },
  { id:'systemic_racism__wealth_inequality', source:'systemic_racism', target:'wealth_inequality', type:'CAUSED', label:'Caused', note:'Centuries of racialized exclusion from wealth-building produced persistent racial wealth gap', confidence:'confirmed' }
];

// ── POLITICS EDGES ───────────────────────────────────────────────────────────
const newPolitEdges = [
  // welfare state
  { id:'welfare_state__austerity', source:'welfare_state', target:'austerity', type:'DISCREDITED', label:'Discredited', note:'Austerity policy targets welfare state programs for dismantlement', confidence:'confirmed' },
  { id:'welfare_state__social_safety_net', source:'welfare_state', target:'social_safety_net', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Welfare state is the broader concept of which safety net is a component', confidence:'confirmed' },
  { id:'welfare_state__supply_side_economics', source:'welfare_state', target:'supply_side_economics', type:'DISCREDITED', label:'Discredited', note:'Supply-side economics frames welfare state as economic burden to be reduced', confidence:'confirmed' },
  { id:'keynesian_economics__welfare_state', source:'keynesian_economics', target:'welfare_state', type:'ENABLED', label:'Enabled', note:'Keynesian demand management theory underpinned welfare state expansion', confidence:'confirmed' },

  // UBI
  { id:'universal_basic_income__automation_economy', source:'universal_basic_income', target:'automation_economy', type:'ENABLED', label:'Enabled', note:'Automation displacement is primary argument driving UBI advocacy', confidence:'confirmed' },
  { id:'universal_basic_income__welfare_state', source:'universal_basic_income', target:'welfare_state', type:'FRAGMENTED_INTO', label:'Fragmented into', note:'UBI proposals often involve replacing existing welfare programs', confidence:'speculative' },
  { id:'universal_basic_income__social_safety_net', source:'universal_basic_income', target:'social_safety_net', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'UBI is proposed as evolution or replacement of traditional safety net', confidence:'confirmed' },

  // climate activism
  { id:'climate_activism__climate_change_policy', source:'climate_activism', target:'climate_change_policy', type:'ENABLED', label:'Enabled', note:'Climate activism drives political pressure for climate legislation', confidence:'confirmed' },
  { id:'climate_activism__environmental_justice', source:'climate_activism', target:'environmental_justice', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Climate justice wing explicitly connects climate to racial and economic justice', confidence:'confirmed' },
  { id:'climate_change_denial__climate_activism', source:'climate_change_denial', target:'climate_activism', type:'DISCREDITED', label:'Discredited', note:'Denial industry funds counter-messaging against climate activists', confidence:'confirmed' },

  // environmental justice
  { id:'environmental_justice__environmental_degradation', source:'environmental_justice', target:'environmental_degradation', type:'DISCREDITED', label:'Discredited', note:'Environmental justice movement challenges sacrifice zone logic', confidence:'confirmed' },
  { id:'environmental_justice__systemic_racism', source:'environmental_justice', target:'systemic_racism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Environmental burdens disproportionately fall on communities of color through systemic racism', confidence:'confirmed' },

  // gun violence
  { id:'gun_violence_policy__regulatory_capture', source:'gun_violence_policy', target:'regulatory_capture', type:'ENABLED', label:'Enabled', note:'NRA lobbying represents regulatory capture of firearms policy', confidence:'confirmed' },
  { id:'gun_violence_policy__mental_health_stigma', source:'gun_violence_policy', target:'mental_health_stigma', type:'ENABLED', label:'Enabled', note:'Mental illness scapegoating deflects from gun availability in mass shooting debates', confidence:'confirmed' },

  // white supremacy
  { id:'white_supremacy_movement__fascism', source:'white_supremacy_movement', target:'fascism', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'White supremacy movements draw directly on fascist ideology and aesthetics', confidence:'confirmed' },
  { id:'white_supremacy_movement__scapegoating', source:'white_supremacy_movement', target:'scapegoating', type:'ENABLED', label:'Enabled', note:'White supremacy requires scapegoating of non-white groups for social problems', confidence:'confirmed' },
  { id:'white_supremacy_movement__systemic_racism', source:'white_supremacy_movement', target:'systemic_racism', type:'ENABLED', label:'Enabled', note:'White supremacist ideology historically justified and created systemic racist policies', confidence:'confirmed' },
  { id:'white_supremacy_movement__social_media_radicalization', source:'white_supremacy_movement', target:'social_media_radicalization', type:'ENABLED', label:'Enabled', note:'White supremacist recruitment has shifted heavily to online radicalization pipelines', confidence:'confirmed' }
];

// ── PSYCHOLOGY EDGES ─────────────────────────────────────────────────────────
const newPsychEdges = [
  // intergenerational trauma
  { id:'intergenerational_trauma__epigenetics', source:'intergenerational_trauma', target:'epigenetics', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Epigenetic changes are proposed biological mechanism for intergenerational trauma transmission', confidence:'speculative' },
  { id:'intergenerational_trauma__adverse_childhood_experiences', source:'intergenerational_trauma', target:'adverse_childhood_experiences', type:'ENABLED', label:'Enabled', note:'Intergenerational trauma increases likelihood of adverse childhood experiences in next generation', confidence:'confirmed' },
  { id:'intergenerational_trauma__ptsd', source:'intergenerational_trauma', target:'ptsd', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Intergenerational trauma involves PTSD-like symptom transmission across generations', confidence:'confirmed' },
  { id:'transatlantic_slave_trade__intergenerational_trauma', source:'transatlantic_slave_trade', target:'intergenerational_trauma', type:'CAUSED', label:'Caused', note:'Slavery and its aftermath created documented intergenerational trauma in African American communities', confidence:'confirmed' },

  // narcissistic abuse
  { id:'narcissistic_abuse__gaslighting', source:'narcissistic_abuse', target:'gaslighting', type:'ENABLED', label:'Enabled', note:'Gaslighting is a primary tool of narcissistic abuse', confidence:'confirmed' },
  { id:'narcissistic_abuse__cult_dynamics', source:'narcissistic_abuse', target:'cult_dynamics', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Cult leaders use narcissistic abuse patterns to control followers', confidence:'confirmed' },
  { id:'narcissistic_abuse__adverse_childhood_experiences', source:'narcissistic_abuse', target:'adverse_childhood_experiences', type:'ENABLED', label:'Enabled', note:'Narcissistic parenting is a major category of adverse childhood experience', confidence:'confirmed' }
];

// ── HEALTH EDGES ─────────────────────────────────────────────────────────────
const newHealthEdges = [
  // healthcare privatization
  { id:'healthcare_privatization__single_payer_healthcare', source:'healthcare_privatization', target:'single_payer_healthcare', type:'DISCREDITED', label:'Discredited', note:'Healthcare privatization creates the problems that single-payer advocates seek to solve', confidence:'confirmed' },
  { id:'healthcare_privatization__austerity', source:'healthcare_privatization', target:'austerity', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Privatization of healthcare is a form of social austerity', confidence:'confirmed' },
  { id:'healthcare_privatization__chronic_illness_policy', source:'healthcare_privatization', target:'chronic_illness_policy', type:'DISCREDITED', label:'Discredited', note:'Profit-driven insurance creates barriers to chronic illness management', confidence:'confirmed' },

  // obesity
  { id:'obesity_epidemic__tobacco_industry', source:'obesity_epidemic', target:'tobacco_industry', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Food industry used same manufactured doubt and marketing tactics as tobacco industry', confidence:'confirmed' },
  { id:'obesity_epidemic__addiction_science', source:'obesity_epidemic', target:'addiction_science', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Ultra-processed food companies deliberately engineer addictive properties', confidence:'confirmed' },
  { id:'obesity_epidemic__environmental_justice', source:'obesity_epidemic', target:'environmental_justice', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Food deserts in low-income communities are an environmental justice issue', confidence:'confirmed' }
];

// ── HISTORY EDGES ────────────────────────────────────────────────────────────
const newHistEdges = [
  // WWII
  { id:'world_war_two__hiroshima_nagasaki', source:'world_war_two', target:'hiroshima_nagasaki', type:'PRODUCED', label:'Produced', note:'Hiroshima and Nagasaki bombings occurred in final weeks of WWII', confidence:'confirmed' },
  { id:'world_war_two__the_holocaust', source:'world_war_two', target:'the_holocaust', type:'PRODUCED', label:'Produced', note:'Holocaust was carried out under cover and conditions of WWII', confidence:'confirmed' },
  { id:'world_war_two__human_rights_declaration', source:'world_war_two', target:'human_rights_declaration', type:'PRODUCED', label:'Produced', note:'UDHR was direct response to WWII atrocities', confidence:'confirmed' },
  { id:'world_war_two__fascism', source:'world_war_two', target:'fascism', type:'DISCREDITED', label:'Discredited', note:'Allied victory discredited fascism as governing ideology globally', confidence:'confirmed' },
  { id:'fascism__world_war_two', source:'fascism', target:'world_war_two', type:'CAUSED', label:'Caused', note:'Fascist expansion in Germany and Italy caused WWII', confidence:'confirmed' },
  { id:'world_war_two__decolonization_africa', source:'world_war_two', target:'decolonization_africa', type:'ENABLED', label:'Enabled', note:'WWII exhausted European powers enabling post-war decolonization', confidence:'confirmed' },
  { id:'world_war_two__cold_war_nuclear_fear', source:'world_war_two', target:'cold_war_nuclear_fear', type:'PRODUCED', label:'Produced', note:'WWII ended with atomic bombings, defining Cold War nuclear terror', confidence:'confirmed' },

  // Vietnam
  { id:'vietnam_war__vietnam_war_protests', source:'vietnam_war', target:'vietnam_war_protests', type:'PRODUCED', label:'Produced', note:'Vietnam War generated massive domestic antiwar protest movement', confidence:'confirmed' },
  { id:'vietnam_war__cold_war_proxy_wars', source:'vietnam_war', target:'cold_war_proxy_wars', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Vietnam was the largest example of Cold War proxy conflict', confidence:'confirmed' },
  { id:'vietnam_war__ptsd', source:'vietnam_war', target:'ptsd', type:'PRODUCED', label:'Produced', note:'Vietnam veterans drove recognition and naming of PTSD as clinical syndrome', confidence:'confirmed' },
  { id:'vietnam_war__media_consolidation', source:'vietnam_war', target:'media_consolidation', type:'ENABLED', label:'Enabled', note:'Pentagon Papers and media coverage led to increased government media management', confidence:'confirmed' }
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
write(BASE+'/global/politics/nodes.json', pn);
write(BASE+'/global/politics/edges.json', pe);
write(BASE+'/global/psychology/nodes.json', psn);
write(BASE+'/global/psychology/edges.json', pse);
write(BASE+'/global/health/nodes.json', hn);
write(BASE+'/global/health/edges.json', he);
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
const totalNodes = mn.length + medn.length + pn.length + psn.length + hn.length + hitn.length;
const totalEdges = me.length + mede.length + pe.length + pse.length + he.length + hite.length;
console.log('Grand total: '+totalNodes+' nodes, '+totalEdges+' edges');
