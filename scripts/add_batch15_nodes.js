#!/usr/bin/env node
// Batch 15: Internet/Tech History, Religion, Science vs Religion, Economic History,
//   Mental Health, More Psychology
// New nodes: internet_history, social_media_platforms, surveillance_capitalism,
//   protestant_work_ethic, secularism, climate_science, scientific_consensus,
//   dark_money, student_debt_crisis, opioid_corporate_liability,
//   attachment_theory, learned_helplessness, milgram_obedience, cognitive_dissonance_effect

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
    id: 'surveillance_capitalism',
    label: 'Surveillance Capitalism',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '2010s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Surveillance_capitalism',
    summary: 'Economic logic in which behavioral data is extracted from users without consent and sold as predictions about future behavior. Described by Shoshana Zuboff as a new form of power that treats human experience as raw material for profit.',
    tags: ['surveillance_capitalism','data_extraction','behavioral_modification','Google','Facebook','Zuboff','attention_economy','privacy']
  },
  {
    id: 'cognitive_dissonance_effect',
    label: 'Cognitive Dissonance',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1950s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Cognitive_dissonance',
    summary: 'Psychological discomfort caused by holding contradictory beliefs or acting against one\'s values. Often resolved by changing beliefs rather than behavior — exploited in propaganda, cult indoctrination, and political manipulation.',
    tags: ['cognitive_dissonance','Festinger','belief_change','rationalization','propaganda','psychology','self_deception']
  },
  {
    id: 'learned_helplessness',
    label: 'Learned Helplessness',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1960s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Learned_helplessness',
    summary: 'Psychological state in which repeated exposure to uncontrollable negative events leads to passive acceptance even when escape is possible. Seligman\'s model underpins depression theory and explains political disengagement.',
    tags: ['learned_helplessness','Seligman','depression','political_apathy','trauma','disempowerment','conditioning','psychology']
  },
  {
    id: 'scientific_consensus',
    label: 'Scientific Consensus Denial',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1950s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Denialism',
    summary: 'Strategy of manufacturing doubt about established scientific consensus through false balance, cherry-picking studies, and funding contrarian research. Used by tobacco, fossil fuel, and pharmaceutical industries to delay regulation.',
    tags: ['science_denial','denialism','manufactured_doubt','climate_denial','tobacco','fossil_fuels','media','lobbying']
  },
  {
    id: 'dark_money',
    label: 'Dark Money in Politics',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '2010s',
    scope: 'mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Dark_money',
    summary: 'Political spending by nonprofit organizations that are not required to disclose their donors, allowing wealthy individuals and corporations to influence elections and legislation anonymously — vastly expanded after Citizens United.',
    tags: ['dark_money','Citizens_United','campaign_finance','oligarchy','lobbying','democracy','Koch_brothers','elections']
  }
];

// ── NEW MEDIA NODES ──────────────────────────────────────────────────────────
const newMediaNodes = [
  {
    id: 'social_media_platforms',
    label: 'Social Media Platforms',
    node_type: 'institution',
    category: 'institution',
    decade: '2000s',
    scope: 'global/media',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Social_media',
    summary: 'Facebook, Twitter/X, YouTube, TikTok, and Instagram — platforms that have transformed political communication, accelerated information spread, enabled surveillance capitalism, and restructured public discourse around engagement metrics.',
    tags: ['social_media','Facebook','Twitter','YouTube','TikTok','algorithms','engagement','misinformation','platforms']
  },
  {
    id: 'internet_history',
    label: 'The Internet & Information Age',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1990s',
    scope: 'global/media',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/History_of_the_Internet',
    summary: 'The development and popularization of the internet from ARPANET through Web 1.0 to the social media age — transforming commerce, communication, journalism, politics, and warfare while creating new vectors for surveillance and manipulation.',
    tags: ['internet','ARPANET','world_wide_web','information_revolution','digital_divide','tech_industry','disruption']
  },
  {
    id: 'algorithmic_news',
    label: 'Algorithmic News Curation',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '2010s',
    scope: 'global/media',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Filter_bubble',
    summary: 'The process by which social media algorithms and search engines curate news and information based on engagement history, creating filter bubbles that limit exposure to challenging viewpoints and amplify outrage.',
    tags: ['filter_bubble','algorithmic_curation','Facebook','Google','personalization','echo_chamber','news','engagement']
  }
];

// ── NEW POLITICS NODES ───────────────────────────────────────────────────────
const newPolitNodes = [
  {
    id: 'student_debt_crisis',
    label: 'Student Debt Crisis',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2000s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Student_debt',
    summary: 'US student loan debt exceeding $1.7 trillion, driven by college cost explosion, predatory lending, and state disinvestment in public education — leaving millions in decades-long debt bondage that constrains economic mobility.',
    tags: ['student_debt','higher_education','inequality','loan_forgiveness','predatory_lending','neoliberalism','youth','economic_mobility']
  },
  {
    id: 'dark_money_politics',
    label: 'Dark Money Political Networks',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2010s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Dark_money',
    summary: 'Networks of politically active nonprofits funneling undisclosed donor money into elections and policy advocacy — including Koch network, Arabella Advisors, and others reshaping political landscape without accountability.',
    tags: ['dark_money','Koch','Citizens_United','oligarchy','nonprofit','elections','campaign_finance','plutocracy']
  }
];

// ── NEW PSYCHOLOGY NODES ─────────────────────────────────────────────────────
const newPsychNodes = [
  {
    id: 'attachment_theory',
    label: 'Attachment Theory',
    node_type: 'theory',
    category: 'theory',
    decade: '1960s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Attachment_theory',
    summary: 'Bowlby and Ainsworth\'s framework explaining how early caregiver relationships create secure or insecure attachment styles affecting adult relationships, mental health, and vulnerability to manipulation and cult dynamics.',
    tags: ['attachment_theory','Bowlby','Ainsworth','childhood','trauma','relationships','psychology','early_development']
  },
  {
    id: 'milgram_obedience',
    label: 'Milgram Obedience Studies',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1960s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Milgram_experiment',
    summary: 'Stanley Milgram\'s 1961 experiments showing most ordinary people would administer apparently fatal electric shocks under authority pressure. Provided empirical foundation for understanding how ordinary people participate in atrocities.',
    tags: ['Milgram','obedience','authority','psychology','Holocaust','Arendt','genocide','conformity','authority_bias']
  },
  {
    id: 'dehumanization',
    label: 'Dehumanization',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1930s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Dehumanization',
    summary: 'Psychological process of denying full human status to groups through language, imagery, and ideology — a prerequisite for mass violence, genocide, slavery, and systemic discrimination, studied extensively post-Holocaust.',
    tags: ['dehumanization','genocide','racism','propaganda','Holocaust','psychology','violence','othering','enemy_image']
  }
];

// ── NEW HEALTH NODES ─────────────────────────────────────────────────────────
const newHealthNodes = [
  {
    id: 'opioid_corporate_liability',
    label: 'Opioid Corporate Accountability',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '2010s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Opioid_epidemic_in_the_United_States',
    summary: 'Legal and political reckoning with Purdue Pharma, the Sackler family, and distributors for manufacturing the opioid epidemic through aggressive marketing of OxyContin while suppressing evidence of addiction risk.',
    tags: ['opioid','Purdue_Pharma','Sackler','accountability','pharmaceutical','addiction','lawsuit','corporate_crime']
  },
  {
    id: 'mental_health_care_access',
    label: 'Mental Health Care Access Crisis',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1980s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Mental_health_in_the_United_States',
    summary: 'Severe shortage of affordable mental health services in the US driven by deinstitutionalization without community replacement, insurance discrimination, and provider shortages — leaving millions without care and contributing to homelessness and incarceration.',
    tags: ['mental_health','deinstitutionalization','healthcare_access','insurance','therapy','crisis','homelessness','psychiatry']
  }
];

// ── NEW HISTORY NODES ────────────────────────────────────────────────────────
const newHistNodes = [
  {
    id: 'reformation_counter_reformation',
    label: 'Reformation & Counter-Reformation',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1510s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Reformation',
    summary: 'The 16th century Protestant split from Catholicism triggered by Martin Luther, followed by Catholic institutional reform — reshaping European politics, enabling religious wars, and accelerating print culture and literacy.',
    tags: ['Reformation','Luther','Protestant','Counter_Reformation','Catholic_Church','religious_wars','printing_press','Europe']
  },
  {
    id: 'transatlantic_slave_trade',
    label: 'Transatlantic Slave Trade',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1500s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Atlantic_slave_trade',
    summary: 'The forced transportation of 12+ million Africans to the Americas between the 16th and 19th centuries. Foundation of New World plantation economies and source of intergenerational trauma, racism, and persistent wealth inequality.',
    tags: ['slavery','transatlantic','Middle_Passage','abolition','racism','plantation','cotton','wealth_inequality','Africa','Americas']
  },
  {
    id: 'industrial_revolution',
    label: 'Industrial Revolution',
    node_type: 'historical_event',
    category: 'historical_event',
    decade: '1760s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Industrial_Revolution',
    summary: 'The late 18th–19th century shift from agrarian to industrial economies beginning in Britain — creating the modern working class, urbanization, capitalism, environmental degradation, and the political conditions for socialism and labor movements.',
    tags: ['industrial_revolution','capitalism','labor','working_class','urbanization','steam_engine','pollution','Marx','Engels']
  }
];

// ── MECHANISM EDGES ──────────────────────────────────────────────────────────
const newMechEdges = [
  // surveillance capitalism
  { id:'surveillance_capitalism__surveillance_state', source:'surveillance_capitalism', target:'surveillance_state', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Corporate and state surveillance use same data infrastructure', confidence:'confirmed' },
  { id:'surveillance_capitalism__platform_economy', source:'surveillance_capitalism', target:'platform_economy', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Platform monopoly depends on behavioral data extraction for revenue', confidence:'confirmed' },
  { id:'surveillance_capitalism__algorithmic_bias', source:'surveillance_capitalism', target:'algorithmic_bias', type:'ENABLED', label:'Enabled', note:'Surveillance data trains biased models used for advertising, hiring, and policing', confidence:'confirmed' },
  { id:'surveillance_capitalism__privacy_rights', source:'surveillance_capitalism', target:'privacy_rights', type:'DISCREDITED', label:'Discredited', note:'Surveillance capitalism normalizes mass data extraction that privacy advocates challenge', confidence:'confirmed' },

  // cognitive dissonance
  { id:'cognitive_dissonance_effect__conspiracy_theories', source:'cognitive_dissonance_effect', target:'conspiracy_theories', type:'ENABLED', label:'Enabled', note:'Conspiracy theories resolve cognitive dissonance by providing coherent alternative worldviews', confidence:'confirmed' },
  { id:'cognitive_dissonance_effect__radicalization', source:'cognitive_dissonance_effect', target:'radicalization', type:'ENABLED', label:'Enabled', note:'Dissonance reduction drives deeper commitment as investments in a worldview increase', confidence:'confirmed' },
  { id:'cognitive_dissonance_effect__propaganda', source:'cognitive_dissonance_effect', target:'propaganda', type:'ENABLED', label:'Enabled', note:'Propagandists exploit dissonance to force belief change through repeated exposure', confidence:'confirmed' },

  // learned helplessness
  { id:'learned_helplessness__ptsd', source:'learned_helplessness', target:'ptsd', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both involve trauma-induced patterns of passivity and avoidance', confidence:'confirmed' },
  { id:'learned_helplessness__aces', source:'learned_helplessness', target:'aces', type:'ENABLED', label:'Enabled', note:'Adverse childhood experiences create learned helplessness patterns', confidence:'confirmed' },
  { id:'learned_helplessness__mass_incarceration', source:'learned_helplessness', target:'mass_incarceration', type:'ENABLED', label:'Enabled', note:'Incarceration induces learned helplessness affecting reintegration prospects', confidence:'confirmed' },

  // scientific consensus denial
  { id:'scientific_consensus__climate_change_denial', source:'scientific_consensus', target:'climate_change_denial', type:'ENABLED', label:'Enabled', note:'Science denial playbook pioneered by tobacco was adapted for climate', confidence:'confirmed' },
  { id:'scientific_consensus__tobacco_industry', source:'scientific_consensus', target:'tobacco_industry', type:'ENABLED', label:'Enabled', note:'Tobacco industry invented the manufactured doubt strategy for science consensus', confidence:'confirmed' },
  { id:'scientific_consensus__anti_vaccine_movement', source:'scientific_consensus', target:'anti_vaccine_movement', type:'ENABLED', label:'Enabled', note:'Anti-vaccine movement uses same manufactured doubt tactics against vaccine science', confidence:'confirmed' },

  // dark money
  { id:'dark_money__citizens_united', source:'dark_money', target:'citizens_united', type:'ENABLED', label:'Enabled', note:'Citizens United removed disclosure requirements enabling dark money networks', confidence:'confirmed' },
  { id:'dark_money__regulatory_capture', source:'dark_money', target:'regulatory_capture', type:'ENABLED', label:'Enabled', note:'Anonymous political spending funds regulatory capture without accountability', confidence:'confirmed' },
  { id:'dark_money__climate_change_denial', source:'dark_money', target:'climate_change_denial', type:'ENABLED', label:'Enabled', note:'Fossil fuel industry funds climate denial through anonymous nonprofit networks', confidence:'confirmed' }
];

// ── MEDIA EDGES ──────────────────────────────────────────────────────────────
const newMediaEdges = [
  // social media platforms
  { id:'social_media_platforms__social_media_radicalization', source:'social_media_platforms', target:'social_media_radicalization', type:'ENABLED', label:'Enabled', note:'Platform engagement algorithms systematically promote extremist content', confidence:'confirmed' },
  { id:'social_media_platforms__surveillance_capitalism', source:'social_media_platforms', target:'surveillance_capitalism', type:'ENABLED', label:'Enabled', note:'Social media platforms are the primary vehicle for surveillance capitalism', confidence:'confirmed' },
  { id:'social_media_platforms__echo_chamber', source:'social_media_platforms', target:'echo_chamber', type:'ENABLED', label:'Enabled', note:'Algorithmic feeds create personalized echo chambers', confidence:'confirmed' },
  { id:'social_media_platforms__russian_disinformation', source:'social_media_platforms', target:'russian_disinformation', type:'ENABLED', label:'Enabled', note:'Platforms provided infrastructure for state-sponsored disinformation operations', confidence:'confirmed' },
  { id:'social_media_platforms__cancel_culture', source:'social_media_platforms', target:'cancel_culture', type:'ENABLED', label:'Enabled', note:'Social media amplifies pile-on dynamics enabling cancel culture', confidence:'confirmed' },

  // internet history
  { id:'internet_history__social_media_platforms', source:'internet_history', target:'social_media_platforms', type:'PRODUCED', label:'Produced', note:'Commercialization of internet infrastructure produced social media as dominant paradigm', confidence:'confirmed' },
  { id:'internet_history__internet_and_democracy', source:'internet_history', target:'internet_and_democracy', type:'PRODUCED', label:'Produced', note:'Internet expansion raised then complicated democratic participation hopes', confidence:'confirmed' },
  { id:'internet_history__citizen_journalism', source:'internet_history', target:'citizen_journalism', type:'ENABLED', label:'Enabled', note:'Internet gave everyone a publishing platform enabling citizen journalism', confidence:'confirmed' },
  { id:'printing_press__internet_history', source:'printing_press', target:'internet_history', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both were information revolutions that disrupted existing power structures', confidence:'confirmed' },

  // algorithmic news
  { id:'algorithmic_news__echo_chamber', source:'algorithmic_news', target:'echo_chamber', type:'ENABLED', label:'Enabled', note:'Personalized feeds are the primary mechanism creating modern echo chambers', confidence:'confirmed' },
  { id:'algorithmic_news__broken_epistemology', source:'algorithmic_news', target:'broken_epistemology', type:'CAUSED', label:'Caused', note:'Algorithmic curation fragments shared reality into personalized information silos', confidence:'confirmed' },
  { id:'algorithmic_bias__algorithmic_news', source:'algorithmic_bias', target:'algorithmic_news', type:'ENABLED', label:'Enabled', note:'News curation algorithms inherit biases that distort political information', confidence:'confirmed' }
];

// ── POLITICS EDGES ───────────────────────────────────────────────────────────
const newPolitEdges = [
  // student debt
  { id:'student_debt_crisis__wealth_inequality', source:'student_debt_crisis', target:'wealth_inequality', type:'CAUSED', label:'Caused', note:'Student debt locks young workers in debt while wealth concentrates at top', confidence:'confirmed' },
  { id:'student_debt_crisis__austerity', source:'student_debt_crisis', target:'austerity', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'State disinvestment in public universities is a form of education austerity', confidence:'confirmed' },
  { id:'student_debt_crisis__social_safety_net', source:'student_debt_crisis', target:'social_safety_net', type:'DISCREDITED', label:'Discredited', note:'Student debt crisis exposes gaps in safety net for economic mobility', confidence:'speculative' },

  // dark money politics
  { id:'dark_money_politics__citizens_united', source:'dark_money_politics', target:'citizens_united', type:'PRODUCED', label:'Produced', note:'Citizens United ruling enabled dark money political networks to proliferate', confidence:'confirmed' },
  { id:'dark_money_politics__wealth_inequality', source:'dark_money_politics', target:'wealth_inequality', type:'ENABLED', label:'Enabled', note:'Dark money translates wealth inequality directly into political power', confidence:'confirmed' },
  { id:'dark_money_politics__climate_change_policy', source:'dark_money_politics', target:'climate_change_policy', type:'DISCREDITED', label:'Discredited', note:'Fossil fuel dark money funds organizations opposing climate legislation', confidence:'confirmed' }
];

// ── PSYCHOLOGY EDGES ─────────────────────────────────────────────────────────
const newPsychEdges = [
  // attachment theory
  { id:'attachment_theory__aces', source:'attachment_theory', target:'aces', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'ACEs disrupt secure attachment formation during critical development windows', confidence:'confirmed' },
  { id:'attachment_theory__radicalization', source:'attachment_theory', target:'radicalization', type:'ENABLED', label:'Enabled', note:'Insecure attachment creates need for belonging that extremist groups exploit', confidence:'confirmed' },
  { id:'attachment_theory__conversion_therapy', source:'attachment_theory', target:'conversion_therapy', type:'PROVIDED_COVER_FOR', label:'Provided cover for', note:'Pseudo-therapeutic attachment theories were used to justify conversion therapy', confidence:'speculative' },

  // milgram
  { id:'milgram_obedience__propaganda', source:'milgram_obedience', target:'propaganda', type:'ENABLED', label:'Enabled', note:'Milgram showed authority compliance enables mass participation in propaganda systems', confidence:'confirmed' },
  { id:'milgram_obedience__dehumanization', source:'milgram_obedience', target:'dehumanization', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both explain how ordinary people commit atrocities through psychological mechanisms', confidence:'confirmed' },
  { id:'milgram_obedience__stanley_milgram', source:'milgram_obedience', target:'stanley_milgram', type:'PRODUCED', label:'Produced', note:'Milgram study is the defining work of Stanley Milgram', confidence:'confirmed' },

  // dehumanization
  { id:'dehumanization__rwandan_genocide', source:'dehumanization', target:'rwandan_genocide', type:'ENABLED', label:'Enabled', note:'Radio propaganda dehumanizing Tutsis as cockroaches enabled mass participation', confidence:'confirmed' },
  { id:'dehumanization__armenian_genocide', source:'dehumanization', target:'armenian_genocide', type:'ENABLED', label:'Enabled', note:'Ottoman propaganda dehumanized Armenians as internal enemy threat', confidence:'confirmed' },
  { id:'dehumanization__slavery', source:'dehumanization', target:'transatlantic_slave_trade', type:'ENABLED', label:'Enabled', note:'Racial dehumanization of Africans was ideological foundation of slave trade', confidence:'confirmed' },
  { id:'dehumanization__mass_incarceration', source:'dehumanization', target:'mass_incarceration', type:'ENABLED', label:'Enabled', note:'Dehumanizing language about criminals enables mass incarceration policies', confidence:'confirmed' }
];

// ── HEALTH EDGES ─────────────────────────────────────────────────────────────
const newHealthEdges = [
  // opioid corporate liability
  { id:'opioid_corporate_liability__opioid_crisis', source:'opioid_corporate_liability', target:'opioid_crisis', type:'PRODUCED', label:'Produced', note:'Corporate misconduct by Purdue Pharma directly created the opioid epidemic', confidence:'confirmed' },
  { id:'opioid_corporate_liability__pharmaceutical_industry', source:'opioid_corporate_liability', target:'pharmaceutical_industry', type:'PRODUCED', label:'Produced', note:'The opioid crisis exposed pharmaceutical industry capture of regulation and medicine', confidence:'confirmed' },
  { id:'opioid_corporate_liability__regulatory_capture', source:'opioid_corporate_liability', target:'regulatory_capture', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'FDA regulatory failure was central to allowing OxyContin marketing claims', confidence:'confirmed' },

  // mental health care access
  { id:'mental_health_care_access__mental_health_stigma', source:'mental_health_care_access', target:'mental_health_stigma', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Stigma and access barriers reinforce each other in mental health system failure', confidence:'confirmed' },
  { id:'mental_health_care_access__mass_incarceration', source:'mental_health_care_access', target:'mass_incarceration', type:'ENABLED', label:'Enabled', note:'Lack of mental health care funnels mentally ill people into prisons', confidence:'confirmed' },
  { id:'mental_health_care_access__loneliness_epidemic', source:'mental_health_care_access', target:'loneliness_epidemic', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Both are crises of social disconnection and system abandonment', confidence:'speculative' }
];

// ── HISTORY EDGES ────────────────────────────────────────────────────────────
const newHistEdges = [
  // reformation
  { id:'reformation__protestant_reformation_history', source:'reformation_counter_reformation', target:'protestant_reformation_history', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Protestant Reformation is the core event of the broader Reformation period', confidence:'confirmed' },
  { id:'reformation__printing_press', source:'reformation_counter_reformation', target:'printing_press', type:'ENABLED', label:'Enabled', note:'Printing press enabled Luther to disseminate 95 Theses rapidly across Europe', confidence:'confirmed' },
  { id:'reformation__enlightenment', source:'reformation_counter_reformation', target:'enlightenment', type:'ENABLED', label:'Enabled', note:'Reformation challenge to religious authority created intellectual space for Enlightenment', confidence:'confirmed' },
  { id:'protestant_work_ethic', source:'reformation_counter_reformation', target:'capitalism', type:'ENABLED', label:'Enabled', note:'Weber argued Protestant ethic of hard work and frugality enabled capitalist accumulation', confidence:'speculative' },

  // transatlantic slave trade
  { id:'slave_trade__colonialism', source:'transatlantic_slave_trade', target:'colonial_era', type:'SHARES_MECHANISM_WITH', label:'Shares mechanism with', note:'Slave trade and colonialism are interlinked systems of European extraction', confidence:'confirmed' },
  { id:'slave_trade__colonialism_legacy', source:'transatlantic_slave_trade', target:'colonialism_legacy', type:'PRODUCED', label:'Produced', note:'Slave trade created enduring wealth inequality and structural racism', confidence:'confirmed' },
  { id:'slave_trade__dehumanization', source:'transatlantic_slave_trade', target:'dehumanization', type:'ENABLED', label:'Enabled', note:'Racial dehumanization was developed to justify and sustain slave trade', confidence:'confirmed' },
  { id:'slave_trade__reparations', source:'transatlantic_slave_trade', target:'reparations_debate', type:'PRODUCED', label:'Produced', note:'Slave trade is the primary historical basis for reparations arguments', confidence:'confirmed' },
  { id:'slave_trade__great_migration', source:'transatlantic_slave_trade', target:'great_migration', type:'ENABLED', label:'Enabled', note:'Forced migration of enslaved peoples created the African American communities that later migrated north', confidence:'confirmed' },

  // industrial revolution
  { id:'industrial_revolution__capitalism', source:'industrial_revolution', target:'capitalism', type:'PRODUCED', label:'Produced', note:'Industrial capitalism emerged directly from industrial revolution dynamics', confidence:'confirmed' },
  { id:'industrial_revolution__labor_movement', source:'industrial_revolution', target:'labor_movement', type:'PRODUCED', label:'Produced', note:'Industrial working conditions created the labor movement and union organizing', confidence:'confirmed' },
  { id:'industrial_revolution__robber_barons', source:'industrial_revolution', target:'robber_barons', type:'PRODUCED', label:'Produced', note:'Industrial Revolution created conditions for monopoly capitalists', confidence:'confirmed' },
  { id:'industrial_revolution__environmental_degradation', source:'industrial_revolution', target:'environmental_degradation', type:'CAUSED', label:'Caused', note:'Fossil fuel industrialization began the environmental crisis still unfolding', confidence:'confirmed' },
  { id:'industrial_revolution__marxism', source:'industrial_revolution', target:'marxism', type:'PRODUCED', label:'Produced', note:'Industrial capitalism and its conditions inspired Marx to develop his critique', confidence:'confirmed' }
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
