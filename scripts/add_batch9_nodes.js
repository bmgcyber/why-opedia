#!/usr/bin/env node
// add_batch9_nodes.js — climate change policy, gerrymandering, Citizens United,
//   Armenian genocide, Gandhi, Cuban missile crisis, Enlightenment,
//   PTSD, healthcare systems, austerity, wealth inequality
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const pn = JSON.parse(fs.readFileSync(D('data/global/politics/nodes.json')));
const hn = JSON.parse(fs.readFileSync(D('data/global/history/nodes.json')));
const mn = JSON.parse(fs.readFileSync(D('data/mechanisms/nodes.json')));
const hln = JSON.parse(fs.readFileSync(D('data/global/health/nodes.json')));

const pe = JSON.parse(fs.readFileSync(D('data/global/politics/edges.json')));
const he = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const hle = JSON.parse(fs.readFileSync(D('data/global/health/edges.json')));

const pnIds = new Set(pn.map(n=>n.id));
const hnIds = new Set(hn.map(n=>n.id));
const mnIds = new Set(mn.map(n=>n.id));
const hlnIds = new Set(hln.map(n=>n.id));
const peIds = new Set(pe.map(e=>e.id));
const heIds = new Set(he.map(e=>e.id));
const meIds = new Set(me.map(e=>e.id));
const hleIds = new Set(hle.map(e=>e.id));

// ── New Politics nodes ────────────────────────────────────────────────────
const newPolitNodes = [
  {
    id: 'climate_change_policy',
    label: 'Climate Change & Policy',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1980s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Climate_change_policy',
    summary: 'Human-caused warming of Earth\'s climate through greenhouse gas emissions; the central policy challenge of the 21st century, requiring transformation of energy, agriculture, and transportation systems; deeply contested politically despite scientific consensus.',
    tags: ['climate', 'global warming', 'carbon emissions', 'paris agreement', 'fossil fuels', 'IPCC', 'green new deal', 'energy transition']
  },
  {
    id: 'gerrymandering',
    label: 'Gerrymandering',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1810s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Gerrymandering',
    summary: 'Manipulation of electoral district boundaries to give one party a systematic electoral advantage; modern partisan gerrymandering uses algorithmic precision to lock in supermajorities in state legislatures regardless of vote share.',
    tags: ['elections', 'redistricting', 'voter suppression', 'democracy', 'partisan', 'racial gerrymandering', 'REDMAP', 'mapping']
  },
  {
    id: 'citizens_united',
    label: 'Citizens United & Dark Money',
    node_type: 'event',
    category: 'event',
    decade: '2010s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Citizens_United_v._FEC',
    summary: 'Supreme Court 2010 decision eliminating limits on corporate political spending; combined with subsequent rulings produced unlimited anonymous "dark money" political spending; radically transformed US campaign finance.',
    tags: ['campaign finance', 'dark money', 'supreme court', 'corporations', 'first amendment', 'PAC', 'Koch brothers', 'oligarchy']
  },
  {
    id: 'immigration_crisis',
    label: 'Immigration & Refugee Crisis',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2010s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Immigration',
    summary: 'Mass displacement driven by climate change, economic inequality, conflict, and political persecution; cynically exploited by right-wing populists as a cultural threat narrative; central to European and American political polarization.',
    tags: ['immigration', 'refugees', 'asylum', 'border', 'xenophobia', 'displacement', 'climate refugees', 'right-wing populism']
  },
];

// ── New History nodes ─────────────────────────────────────────────────────
const newHistNodes = [
  {
    id: 'armenian_genocide',
    label: 'Armenian Genocide',
    node_type: 'event',
    category: 'event',
    decade: '1910s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Armenian_genocide',
    summary: 'Ottoman Empire systematic deportation and massacre of Armenian population (1915-1923), killing 600,000-1.5 million; recognized as genocide by most scholars and many governments; Turkey\'s denial continues to shape international relations.',
    tags: ['genocide', 'ottoman empire', 'turkey', 'armenians', 'denial', 'wwi', 'ethnic cleansing', 'recognition']
  },
  {
    id: 'gandhi',
    label: 'Mahatma Gandhi',
    node_type: 'person',
    category: 'person',
    decade: '1920s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Mahatma_Gandhi',
    summary: 'Leader of Indian independence movement using nonviolent civil disobedience; developed satyagraha (truth-force) as political strategy; led Salt March (1930) and Quit India Movement (1942); assassinated 1948; inspired MLK and global nonviolent movements.',
    tags: ['india', 'independence', 'nonviolence', 'satyagraha', 'salt march', 'british empire', 'civil disobedience', 'assassination']
  },
  {
    id: 'cuban_missile_crisis',
    label: 'Cuban Missile Crisis',
    node_type: 'event',
    category: 'event',
    decade: '1960s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Cuban_Missile_Crisis',
    summary: '13-day confrontation (October 1962) between US and USSR over Soviet nuclear missiles in Cuba; closest the Cold War came to nuclear war; resolved through back-channel negotiations; produced nuclear hotline and Test Ban Treaty.',
    tags: ['cold war', 'nuclear', 'kennedy', 'khrushchev', 'cuba', 'deterrence', 'MAD', 'brinkmanship', '1962']
  },
  {
    id: 'enlightenment',
    label: 'The Enlightenment',
    node_type: 'era',
    category: 'era',
    decade: '1680s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Age_of_Enlightenment',
    summary: 'European intellectual movement (17th-18th c.) emphasizing reason, science, individual rights, and secular governance; produced the philosophical foundations for democracy, human rights, and the scientific method; foundational to American and French Revolutions.',
    tags: ['reason', 'Locke', 'Voltaire', 'Rousseau', 'Hume', 'Kant', 'revolution', 'human rights', 'secularism', 'democracy']
  },
  {
    id: 'greek_democracy',
    label: 'Athenian Democracy',
    node_type: 'institution',
    category: 'institution',
    decade: '-500s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Athenian_democracy',
    summary: 'World\'s first documented democratic system (508-322 BCE); direct democracy with Assembly open to adult male citizens; excluded women, enslaved people, foreigners; produced Socrates, Plato, Aristotle; fell to Macedon.',
    tags: ['democracy', 'athens', 'pericles', 'direct democracy', 'ancient greece', 'agora', 'citizenship', 'exclusion']
  },
];

// ── New Mechanism nodes ───────────────────────────────────────────────────
const newMechNodes = [
  {
    id: 'austerity',
    label: 'Austerity Economics',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1980s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Austerity',
    summary: 'Economic policy of reducing government spending and raising taxes during recessions to reduce public debt; empirically associated with prolonged recessions and increased inequality; standard IMF/World Bank prescription for developing countries.',
    tags: ['austerity', 'deficit', 'public spending', 'IMF', 'Greece', 'neoliberalism', 'recession', 'inequality']
  },
  {
    id: 'wealth_inequality',
    label: 'Wealth Inequality',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1980s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Wealth_inequality',
    summary: 'Extreme concentration of wealth at the top; the top 1% hold more wealth than the bottom 50% globally; accelerated since 1980 through neoliberal policy, offshore tax avoidance, and capital gains dominance over labor income.',
    tags: ['inequality', 'Gini coefficient', 'Piketty', 'top 1%', 'wealth concentration', 'tax', 'capital', 'plutocracy']
  },
];

// ── New Health nodes ──────────────────────────────────────────────────────
const newHealthNodes = [
  {
    id: 'ptsd',
    label: 'PTSD & Trauma Disorders',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1980s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Post-traumatic_stress_disorder',
    summary: 'Post-traumatic stress disorder diagnosed after DSM-III (1980); recognition of trauma\'s lasting neurological and psychological effects; originally called "shell shock" (WWI) or "combat fatigue" (WWII); now recognized across military, sexual assault, and civilian trauma populations.',
    tags: ['PTSD', 'trauma', 'veterans', 'shell shock', 'therapy', 'neuroscience', 'sexual assault', 'mental health']
  },
  {
    id: 'single_payer_healthcare',
    label: 'Healthcare Systems & Access',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1940s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Universal_health_care',
    summary: 'Healthcare financing and delivery models ranging from single-payer universal systems to privatized insurance markets; the US is the only wealthy democracy without universal coverage; outcomes and cost comparisons consistently favor universal systems.',
    tags: ['universal healthcare', 'single-payer', 'insurance', 'NHS', 'medicare for all', 'healthcare access', 'inequality', 'ACA']
  },
];

// ── Politics edges ────────────────────────────────────────────────────────
const newPolitEdges = [
  // Climate change policy
  { id: 'climate_change_policy__climate_change_denial',
    source: 'climate_change_policy', target: 'climate_change_denial', type: 'ENABLED',
    label: 'Climate denial campaigns were specifically designed to prevent climate policy action, not to disprove climate science',
    note: 'Climate denial was instrumentally designed to prevent climate policy rather than to engage scientifically with climate evidence: internal fossil fuel industry documents (ExxonMobil 1977-1982 research) show companies understood climate science accurately; the subsequent denial campaign was explicitly about protecting business models from carbon pricing and regulation, not about scientific inquiry. The Global Climate Coalition\'s explicit goal (documented in internal memos) was to prevent international climate agreements (Kyoto 1997) and domestic carbon pricing. Climate denial succeeded in delaying US climate policy for 30+ years — every decade of delay adds significantly to eventual mitigation costs and locked-in warming.',
    confidence: 'high' },
  { id: 'climate_change_policy__right_wing_populism',
    source: 'climate_change_policy', target: 'right_wing_populism', type: 'ENABLED',
    label: 'Climate change became a right-wing populist culture war issue, transforming scientific consensus into partisan political identity',
    note: 'Climate change became a right-wing populist identity issue through deliberate political construction: fossil fuel industry funding of denial organizations converted business interest into cultural politics; the "job-killing regulations" frame made climate policy an economic class issue (working class jobs vs. elite environmental concerns); Donald Trump\'s Paris Agreement withdrawal was a right-wing populist culture war act rather than economic calculation. The transformation of climate science from apolitical fact to tribal identity marker demonstrates how political entrepreneurs can make any factual question partisan. In the US, belief in climate change now predicts partisan affiliation better than vice versa.',
    confidence: 'high' },
  { id: 'climate_change_policy__decolonization_movement',
    source: 'climate_change_policy', target: 'decolonization_movement', type: 'SHARES_MECHANISM_WITH',
    label: 'Climate justice and decolonization share the structure: wealthy Global North nations caused the problem but Global South nations bear the worst effects',
    note: 'Climate change and colonial inequality are structurally linked: industrialized Western countries produced most historical carbon emissions; developing countries (former colonies) and island nations will experience the most severe impacts (sea level rise, drought, heat stress); the same colonial extraction that produced Western wealth also produced the fossil fuel economy that causes climate change. Climate justice movements argue that this creates a moral obligation: wealthy nations should finance adaptation in vulnerable countries and accelerate their own decarbonization more rapidly. The Paris Agreement\'s climate finance provisions are an imperfect acknowledgment of this colonial climate debt.',
    confidence: 'high' },

  // Gerrymandering
  { id: 'gerrymandering__voter_suppression_modern',
    source: 'gerrymandering', target: 'voter_suppression_modern', type: 'SHARES_MECHANISM_WITH',
    label: 'Gerrymandering and voter suppression are the dual tools of electoral manipulation: gerrymandering shapes who wins, voter suppression shapes who votes',
    note: 'Gerrymandering and voter suppression are complementary tools of electoral manipulation: gerrymandering manipulates district boundaries to make most votes count for nothing (a 30% party can win 60% of seats); voter suppression reduces the number of opposition voters. After the Shelby County v. Holder decision (2013), states that had previously required DOJ preclearance of electoral changes immediately began implementing both gerrymandering and voter suppression measures. The Republican REDMAP strategy (2010) explicitly targeted state legislative elections to control redistricting post-2010 census — gerrymandering as the foundation of a political minority maintaining legislative power.',
    confidence: 'high' },
  { id: 'gerrymandering__political_polarization',
    source: 'gerrymandering', target: 'political_polarization', type: 'CAUSED',
    label: 'Partisan gerrymandering produces safe seats that are only contested in primaries, incentivizing candidates toward extremes',
    note: 'Gerrymandering contributes to political polarization through safe seat dynamics: heavily gerrymandered districts produce one-party seats where the only competitive election is the primary; primary electorates are more ideologically extreme than general electorates; candidates in safe seats face challenges from the extreme flank, not the center; this creates structural incentives for representatives to move away from the median voter toward their base. The House Freedom Caucus emerged from safe Republican seats where the only threat was a primary challenger — gerrymandering had eliminated the general election incentive for moderate positioning.',
    confidence: 'high' },

  // Citizens United
  { id: 'citizens_united__political_polarization',
    source: 'citizens_united', target: 'political_polarization', type: 'ENABLED',
    label: 'Unlimited dark money enabled extremist donors to fund primary challenges against moderates, accelerating polarization',
    note: 'Citizens United enabled polarization through primary challenge dynamics: unlimited anonymous spending allowed ideological extremists (Koch network on the right, George Soros on the left) to fund primary challenges against moderates; Republicans who voted for compromise legislation became vulnerable to Tea Party or MAGA primary challenges funded by dark money; the threat of well-funded primary challenges creates incentives for incumbents to pre-emptively move toward their base. The Koch network explicitly used this strategy — funding primary challenges against Republicans who voted for any form of carbon pricing or moderate immigration reform.',
    confidence: 'high' },
  { id: 'citizens_united__wealth_inequality',
    source: 'citizens_united', target: 'wealth_inequality', type: 'ENABLED',
    label: 'Citizens United converted wealth inequality into political inequality — the wealthy can spend unlimited amounts to shape policy that benefits them',
    note: 'Citizens United operationalized the political implications of wealth inequality: extreme wealth concentration creates extreme political spending capacity; unlimited political spending allows wealthy donors to shape electoral outcomes and policy; the resulting policy favors wealthy donors (tax cuts, reduced regulation, weakened labor protections) that increase wealth concentration. The feedback loop is self-reinforcing: wealth inequality enables political spending; political spending enables policy that increases wealth inequality. Martin Gilens\'s research (2014) showed that US policy outcomes correlate with the preferences of the wealthy and business interests, and near-zero with the preferences of ordinary citizens.',
    confidence: 'high' },

  // Immigration
  { id: 'immigration_crisis__right_wing_populism',
    source: 'immigration_crisis', target: 'right_wing_populism', type: 'ENABLED',
    label: 'Immigration is the central mobilizing issue of right-wing populism in both Europe and the US, providing the ethnic threat narrative',
    note: 'Immigration is the primary mobilizing issue for right-wing populism in developed democracies: Trump\'s 2015 campaign launch centered on Mexican immigration; Brexit was primarily about immigration from Eastern Europe and concern about Muslim immigration from the Middle East; Marine Le Pen\'s National Rally made immigration its central issue; Viktor Orban built his authoritarian state around anti-immigration politics. The right-wing populist immigration frame converts economic anxiety, cultural change anxiety, and racial anxiety into a single target — the immigrant — enabling a coalition that would otherwise have conflicting interests. The Great Replacement conspiracy theory is the ideological distillation of this frame.',
    confidence: 'high' },
];

// ── History edges ─────────────────────────────────────────────────────────
const newHistEdges = [
  // Armenian Genocide
  { id: 'armenian_genocide__the_holocaust',
    source: 'armenian_genocide', target: 'the_holocaust', type: 'SHARES_MECHANISM_WITH',
    label: 'Holocaust architects were aware of the Armenian Genocide; Hitler reportedly invoked it as precedent',
    note: 'The Armenian Genocide and the Holocaust share structural mechanisms and the Nazis were aware of the precedent: both involved state-organized deportation and killing of ethnic minorities using bureaucratic apparatus; both required ideological dehumanization preceding physical elimination; both used railway systems for mass transportation to killing sites; the frequently cited (though historically disputed) Hitler quote "Who remembers the Armenians?" reflects the Nazi awareness that unpunished genocide creates precedent. The Armenian Genocide\'s incomplete international recognition and Turkey\'s ongoing denial demonstrate the political factors that determine whether genocide is acknowledged — factors that also shaped early Holocaust response.',
    confidence: 'high' },
  { id: 'ottoman_empire__armenian_genocide',
    source: 'ottoman_empire', target: 'armenian_genocide', type: 'PRODUCED',
    label: 'The declining Ottoman Empire produced the Armenian Genocide as a response to military defeat and nationalist ideology',
    note: 'The Ottoman Empire\'s decline produced the Armenian Genocide through a combination of military catastrophe and nationalist ideology: the Committee of Union and Progress (Young Turks) blamed Armenian communities for military defeats and Russian collaboration; the empire\'s collapse in WWI created the perceived need to create an ethnically homogeneous Turkish state through population removal; the Hamidian massacres (1894-96) and Adana massacre (1909) were precursors indicating the pattern. The genocide was the violent response to the Ottoman Empire\'s existential crisis — the logic that national survival required ethnic homogeneity that genocides typically invoke.',
    confidence: 'high' },

  // Gandhi
  { id: 'gandhi__nonviolent_resistance',
    source: 'gandhi', target: 'nonviolent_resistance', type: 'PRODUCED',
    label: 'Gandhi developed satyagraha (truth-force) as the theoretical and practical foundation of modern nonviolent resistance',
    note: 'Gandhi did not merely practice nonviolent resistance — he developed it as a coherent political philosophy: satyagraha (truth-force) held that nonviolent action could transform opponents by appealing to their conscience; the Salt March (1930) demonstrated nonviolent civil disobedience at mass scale against British rule; Gandhi\'s articulation of the oppressor\'s dependence on the oppressed\'s cooperation (the system only works if you participate in it) was the theoretical insight that enabled mass nonviolent resistance. The British inability to respond to satyagraha effectively without appearing tyrannical demonstrated the strategy\'s insight about the colonial dynamic — the colonizer needed the colonized\'s cooperation more than the reverse.',
    confidence: 'high' },
  { id: 'gandhi__partition_of_india',
    source: 'gandhi', target: 'partition_of_india', type: 'ENABLED',
    label: 'Gandhi opposed Partition to his death; his assassination by a Hindu nationalist was a direct result of his opposition to anti-Muslim violence',
    note: 'Gandhi\'s relationship to Partition is complex: he had supported Muslim-Hindu unity throughout the independence movement; he strongly opposed Partition but ultimately accepted the Congress-Muslim League agreement rather than allow further delay of independence; during Partition violence, he fasted against Hindu attacks on Muslims in both Bengal and Delhi; his assassination by Nathuram Godse (January 1948) was explicitly because of his perceived pro-Muslim positions during Partition violence. Gandhi was killed for opposing the communal violence that Partition unleashed — his death demonstrated that the nonviolent unity he had sought to build had failed to prevent ethnic hatred.',
    confidence: 'high' },

  // Cuban Missile Crisis
  { id: 'cold_war__cuban_missile_crisis',
    source: 'cold_war', target: 'cuban_missile_crisis', type: 'PRODUCED',
    label: 'The Cuban Missile Crisis was the Cold War\'s most dangerous moment, produced by the logic of nuclear deterrence and revolutionary politics',
    note: 'The Cuban Missile Crisis emerged from the intersection of Cold War dynamics: the Cuban Revolution (1959) converted Cuba into a Soviet ally 90 miles from Florida; the Bay of Pigs failure (1961) demonstrated US willingness to use force; Khrushchev\'s nuclear deployment to Cuba was partly defensive (protecting Cuba from invasion), partly offensive (offsetting US nuclear advantage). Kennedy\'s quarantine response, the back-channel negotiations (including US pledge not to invade Cuba and secret removal of Jupiter missiles from Turkey), and Khrushchev\'s withdrawal demonstrated that nuclear brinkmanship could be managed without war — but barely. The crisis produced the Moscow-Washington hotline and accelerated test ban negotiations.',
    confidence: 'high' },
  { id: 'cuban_missile_crisis__cuban_revolution',
    source: 'cuban_missile_crisis', target: 'cuban_revolution', type: 'ENABLED',
    label: 'The Missile Crisis paradoxically secured the Cuban Revolution by producing the US non-invasion pledge',
    note: 'The Cuban Missile Crisis\'s resolution secured the Cuban Revolution: the deal that ended the crisis included a US pledge not to invade Cuba; this guarantee removed the primary military threat that had driven Soviet missile deployment; Cuba\'s revolution survived not because Soviet missiles deterred invasion but because the Missile Crisis produced a diplomatic settlement that removed the invasion option. Castro\'s revolution subsequently survived 60+ years of US embargo and regime change operations — a survival that required the Missile Crisis settlement as its foundation. The Crisis thus simultaneously brought the world closest to nuclear war while removing the condition (US invasion threat) most likely to lead to conventional war in Cuba.',
    confidence: 'high' },

  // Enlightenment
  { id: 'enlightenment__american_revolution',
    source: 'enlightenment', target: 'american_revolution', type: 'PRODUCED',
    label: 'The American Revolution was the first practical implementation of Enlightenment political philosophy',
    note: 'The American Revolution translated Enlightenment theory directly into political practice: Locke\'s social contract theory appeared in the Declaration of Independence ("life, liberty, and the pursuit of happiness" is Locke\'s "life, liberty, and property"); Montesquieu\'s separation of powers structured the Constitution; Rousseau\'s general will informed democratic theory; Franklin, Jefferson, and Madison were all deeply engaged with Enlightenment thought. The American founding was simultaneously a political revolution and an intellectual experiment — the first large-scale test of whether Enlightenment political principles could be implemented as a functioning government. The contradiction between the Declaration\'s "all men are created equal" and slavery was the Enlightenment\'s defining hypocrisy made structural.',
    confidence: 'high' },
  { id: 'enlightenment__french_revolution',
    source: 'enlightenment', target: 'french_revolution', type: 'PRODUCED',
    label: 'The French Revolution was the radical implementation of Enlightenment principles against a more entrenched aristocratic order',
    note: 'The French Revolution applied Enlightenment principles more radically than the American: "Liberté, Egalité, Fraternité" distilled Enlightenment ideals; the Declaration of the Rights of Man and of the Citizen (1789) applied natural rights theory to citizenship; Voltaire and Rousseau\'s critiques of church and monarchy provided the philosophical framework for dechristianization and regicide. But the Revolution also demonstrated Enlightenment\'s dangers: the Terror showed how reason detached from tradition and institutional constraint could produce systematic mass murder; Burke\'s "Reflections on the Revolution in France" made the conservative case that Enlightenment rationalism was dangerously utopian. The French Revolution produced both democracy and totalitarianism as its legacy.',
    confidence: 'high' },

  // Greek Democracy
  { id: 'greek_democracy__roman_republic',
    source: 'greek_democracy', target: 'roman_republic', type: 'ENABLED',
    label: 'Athenian democratic theory and institutions were the intellectual and institutional ancestors of the Roman Republic',
    note: 'Athenian democracy influenced the Roman Republic directly and indirectly: Roman political thinkers (Cicero, Polybius) explicitly analyzed Greek political systems; the Roman constitution mixed democratic elements (popular assemblies) with aristocratic (Senate) and monarchical (consuls) in the "mixed constitution" theory Polybius identified as Rome\'s strength; Roman legal concepts drew on Greek philosophical foundations. The transmission path was: Athens → Hellenistic world → Rome → Renaissance Florentine political thought → American founders. When American founders designed a republic rather than a democracy, they were consciously drawing on the Roman critique of Athenian direct democracy as vulnerable to demagogy.',
    confidence: 'high' },
  { id: 'greek_democracy__hellenistic_philosophy',
    source: 'greek_democracy', target: 'hellenistic_philosophy', type: 'PRODUCED',
    label: 'Athenian democratic culture created the conditions for philosophical inquiry that produced Socrates, Plato, and Aristotle',
    note: 'Athenian democracy produced the philosophical tradition through specific institutional conditions: the Athenian agora was a space for public debate and intellectual exchange; democratic culture valued rhetoric and argumentation; Athenian citizens had sufficient leisure (supported by slave labor and empire) to engage in philosophical inquiry; the Assembly\'s tradition of public debate made persuasion a valuable skill, driving demand for philosophical education. Socrates\'s death by democratic vote (399 BCE) also demonstrates democracy\'s limits and the tension between democratic majority and intellectual freedom. The trial of Socrates became the foundation for liberal arguments about free speech and the rights of philosophical inquiry against majoritarian censorship.',
    confidence: 'high' },
];

// ── Mechanism edges ───────────────────────────────────────────────────────
const newMechEdges = [
  // Austerity
  { id: 'austerity__neoliberalism',
    source: 'austerity', target: 'neoliberalism', type: 'ENABLED',
    label: 'Austerity is the macroeconomic policy instrument through which neoliberalism is imposed on indebted governments',
    note: 'Austerity and neoliberalism are operationally linked: IMF and World Bank structural adjustment programs imposed austerity conditions on developing country debtors (1980s-2000s) as the price of debt restructuring — privatization, fiscal austerity, trade liberalization, deregulation; these were the practical implementation of neoliberal doctrine through debt leverage. European austerity (Greece, Ireland, Spain, Portugal after 2010) demonstrated the same dynamic in developed countries: ECB/IMF/EC "troika" demanded spending cuts and privatization as conditions for bailout. Austerity converts the political agenda of neoliberalism into economic coercion — you can refuse the ideology but not the debt conditions.',
    confidence: 'high' },
  { id: 'austerity__right_wing_populism',
    source: 'austerity', target: 'right_wing_populism', type: 'PRODUCED',
    label: 'Post-2008 austerity policies produced the economic conditions that drove right-wing populist backlash across Europe and the US',
    note: 'Post-2008 financial crisis austerity directly enabled right-wing populism: UK austerity (2010-2019) cut public services, produced stagnant wages, and concentrated economic pain in regions that subsequently voted heavily for Brexit; European peripheral austerity (Greece especially) produced political systems hostile to EU technocratic governance; US austerity (2011 sequestration, state-level cuts) contributed to the economic stagnation in Midwestern manufacturing regions that drove Trump\'s 2016 victory. Thomas Piketty\'s analysis identifies austerity\'s regressive distributional effects as the economic foundation of populist backlash — the winners and losers of post-2008 austerity map almost exactly onto the winners and losers of anti-establishment populism.',
    confidence: 'high' },

  // Wealth inequality
  { id: 'wealth_inequality__neoliberalism',
    source: 'wealth_inequality', target: 'neoliberalism', type: 'PRODUCED',
    label: 'Neoliberal policy produced the extreme wealth inequality of the early 21st century through tax cuts, deregulation, and labor market deregulation',
    note: 'Extreme wealth inequality is substantially the product of neoliberal policy choices: top marginal tax rate cuts (US 91% to 37%) transferred income from government to wealthy; capital gains preference over ordinary income shifted taxation from labor to capital; union decline reduced the institutional mechanism that had distributed productivity gains to workers; privatization transferred public assets to private ownership; financial deregulation enabled rent extraction through financial engineering. Thomas Piketty\'s "Capital in the 21st Century" (2014) documented the return to 19th-century inequality levels and attributed it to policy choices rather than natural market forces. The Gini coefficient tracks almost exactly with neoliberal policy intensity across countries.',
    confidence: 'high' },
  { id: 'wealth_inequality__right_wing_populism',
    source: 'wealth_inequality', target: 'right_wing_populism', type: 'PRODUCED',
    label: 'Economic anxiety produced by wealth inequality is the material foundation of right-wing populist backlash, redirected from class politics to identity politics',
    note: 'Right-wing populism\'s electoral base is substantially workers and the lower middle class experiencing economic precarity — the same people losing from extreme wealth inequality. The puzzle is why this economic anxiety produces right-wing populism (targeting immigrants, minorities, elites) rather than left-wing class politics (targeting capital and wealthy). The redirection mechanism: right-wing populist entrepreneurs offer cultural, racial, and national identity as substitute for economic security; "they are taking your jobs" (immigrants) replaces "capital is taking your wages" (ownership class); racial and ethnic hierarchy provides psychological compensation for economic loss. The economic material and the political form are connected but not identical.',
    confidence: 'high' },

  // Cross-scope for new history nodes
  { id: 'dehumanization__armenian_genocide',
    source: 'dehumanization', target: 'armenian_genocide', type: 'ENABLED',
    label: 'Ottoman dehumanization of Armenians as internal enemies and collaborators enabled mass participation in organized killing',
    note: 'The Armenian Genocide followed the dehumanization pattern: Armenian communities were framed as a fifth column supporting Russian enemies; Young Turk propaganda depicted Armenians as collectively treasonous; the collective guilt narrative made individual Armenians responsible for others\' alleged collaboration. The Ottoman government used state media and religious authorities to promote anti-Armenian sentiment before the deportations began. The Armenian Genocide is documented in the historical record through German diplomatic dispatches (Germany was the Ottoman ally), survivor testimonies, and American ambassador Henry Morgenthau Sr.\'s reports. The dehumanization framework helps explain how the genocide could be organized quickly across the empire — prior preparation of the ideological environment.',
    confidence: 'high' },
  { id: 'supply_side_economics__wealth_inequality',
    source: 'supply_side_economics', target: 'wealth_inequality', type: 'PRODUCED',
    label: 'Supply-side tax policy systematically redistributed income upward, producing the extreme wealth inequality documented after 1980',
    note: 'Supply-side economics\' actual (as opposed to claimed) effect was upward redistribution: the Reagan tax cuts (1981) cut the top marginal rate from 70% to 50% (and eventually 28%); subsequent supply-side tax cuts (Bush 2001, 2003; Trump 2017) further concentrated the benefits at the top; the claimed growth effects ("trickle down") did not materialize in the data; what did materialize was extreme wealth concentration. The Congressional Budget Office consistently projects supply-side tax cuts as increasing deficits and inequality. Supply-side economics functions as the ideological justification for fiscal policies that primarily benefit wealthy political donors — it is manufactured consent at the macroeconomic level.',
    confidence: 'high' },
  { id: 'manufactured_consent__enlightenment',
    source: 'manufactured_consent', target: 'enlightenment', type: 'ENABLED',
    label: 'Enlightenment faith in reason created the vulnerability that manufactured consent exploits: rational publics can be managed through management of the information they receive',
    note: 'The Enlightenment\'s confidence in rational public opinion as the basis for democratic governance created a specific vulnerability: if rational people form opinions based on information, then controlling information controls rational opinion. This is the insight Bernays applied in "Propaganda" (1928) and Lippmann in "Public Opinion" (1922) — modern democracy\'s complexity makes citizens necessarily dependent on media intermediaries for political information; those intermediaries can shape rational opinion by shaping what information is available. Manufactured consent is not anti-Enlightenment (it uses rational persuasion rather than force) but the perversion of Enlightenment democratic theory: the "marketplace of ideas" becomes a managed market.',
    confidence: 'high' },
];

// ── Health edges ──────────────────────────────────────────────────────────
const newHealthEdges = [
  // PTSD
  { id: 'ptsd__collective_trauma',
    source: 'ptsd', target: 'collective_trauma', type: 'SHARES_MECHANISM_WITH',
    label: 'PTSD and collective trauma share neurobiological mechanisms; what distinguishes them is scale and whether the trauma is shared',
    note: 'PTSD and collective trauma share the fundamental neurobiological mechanism (HPA axis dysregulation, altered memory consolidation, hypervigilance) while differing in scale: PTSD is the clinical individual diagnosis; collective trauma is the community-level equivalent when entire populations share traumatic experience. Veterans with PTSD and communities with collective trauma show similar neurobiological signatures. The clinical PTSD literature (developed primarily from veteran and sexual assault survivor research) has been extended to collective trauma contexts (Judith Herman\'s "Trauma and Recovery"; Bessel van der Kolk\'s "The Body Keeps the Score"). Collective trauma research uses PTSD\'s neurobiological framework to understand community-level health impacts of mass traumatic events.',
    confidence: 'high' },
  { id: 'ptsd__adverse_childhood_experiences',
    source: 'ptsd', target: 'adverse_childhood_experiences', type: 'SHARES_MECHANISM_WITH',
    label: 'Childhood trauma (ACEs) produces PTSD-like symptomatology but through developmental disruption rather than single-event response',
    note: 'PTSD and ACE effects share mechanisms while differing in trauma structure: PTSD (classically) is triggered by discrete traumatic events; ACE effects result from chronic, developmental-period exposure to stress and adversity. Both produce HPA axis dysregulation, altered cortisol response, hypervigilance, and dissociation. Complex PTSD (C-PTSD) bridges this distinction — it captures the psychological effects of chronic, repeated trauma (childhood abuse, domestic violence, captivity) that produce more pervasive personality and relational disturbances than single-event PTSD. The trauma-informed care framework explicitly recognizes ACEs as producing PTSD-spectrum effects, connecting the two research traditions.',
    confidence: 'high' },

  // Healthcare
  { id: 'single_payer_healthcare__neoliberalism',
    source: 'single_payer_healthcare', target: 'neoliberalism', type: 'DISCREDITED',
    label: 'Comparative healthcare system analysis consistently shows that single-payer universal systems produce better outcomes at lower cost than neoliberal insurance markets',
    note: 'Healthcare system comparison is the clearest empirical refutation of neoliberal claims: every wealthy democracy with universal single-payer or regulated multi-payer system achieves better health outcomes (life expectancy, infant mortality, preventable death) at lower cost per capita than the US privatized insurance system; the US spends 17% of GDP on healthcare vs 10-12% in comparable countries while achieving worse outcomes; administrative overhead (10-12% of US healthcare spending) is the direct cost of the insurance market that single-payer eliminates. The healthcare comparison is ideologically inconvenient for neoliberalism because the government-run systems clearly outperform the market alternative on both efficiency and equity.',
    confidence: 'high' },
  { id: 'opioid_crisis__single_payer_healthcare',
    source: 'opioid_crisis', target: 'single_payer_healthcare', type: 'ENABLED',
    label: 'The opioid crisis was exacerbated by the US healthcare system\'s fragmented mental health and addiction treatment coverage',
    note: 'The opioid crisis was shaped by healthcare system failures: mental health parity laws were inconsistently enforced, leaving addiction treatment under-covered; the insurance market\'s preference for cheaper interventions (prescriptions) over more expensive ones (addiction treatment, therapy) incentivized opioid prescribing; fragmented coverage (job-linked insurance) meant people losing jobs during addiction lost healthcare when they needed it most; rural healthcare deserts (products of market failure) had no treatment alternatives to opioid prescriptions. Countries with universal healthcare systems and integrated addiction treatment had significantly lower pharmaceutical opioid death rates even with similar prescribing patterns — access to treatment is the key variable.',
    confidence: 'high' },
];

// ── Write files ───────────────────────────────────────────────────────────
let pnAdded=0, hnAdded=0, mnAdded=0, hlnAdded=0;
let peAdded=0, heAdded=0, meAdded=0, hleAdded=0;

newPolitNodes.forEach(n => { if (!pnIds.has(n.id)) { pn.push(n); pnIds.add(n.id); pnAdded++; } });
newHistNodes.forEach(n => { if (!hnIds.has(n.id)) { hn.push(n); hnIds.add(n.id); hnAdded++; } });
newMechNodes.forEach(n => { if (!mnIds.has(n.id)) { mn.push(n); mnIds.add(n.id); mnAdded++; } });
newHealthNodes.forEach(n => { if (!hlnIds.has(n.id)) { hln.push(n); hlnIds.add(n.id); hlnAdded++; } });

newPolitEdges.forEach(e => { if (!peIds.has(e.id)) { pe.push(e); peIds.add(e.id); peAdded++; } });
newHistEdges.forEach(e => { if (!heIds.has(e.id)) { he.push(e); heIds.add(e.id); heAdded++; } });
newMechEdges.forEach(e => { if (!meIds.has(e.id)) { me.push(e); meIds.add(e.id); meAdded++; } });
newHealthEdges.forEach(e => { if (!hleIds.has(e.id)) { hle.push(e); hleIds.add(e.id); hleAdded++; } });

fs.writeFileSync(D('data/global/politics/nodes.json'), JSON.stringify(pn, null, 2));
fs.writeFileSync(D('data/global/history/nodes.json'), JSON.stringify(hn, null, 2));
fs.writeFileSync(D('data/mechanisms/nodes.json'), JSON.stringify(mn, null, 2));
fs.writeFileSync(D('data/global/health/nodes.json'), JSON.stringify(hln, null, 2));
fs.writeFileSync(D('data/global/politics/edges.json'), JSON.stringify(pe, null, 2));
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(he, null, 2));
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
fs.writeFileSync(D('data/global/health/edges.json'), JSON.stringify(hle, null, 2));

console.log('Politics nodes: +'+pnAdded+' -> '+pn.length);
console.log('History nodes: +'+hnAdded+' -> '+hn.length);
console.log('Mechanism nodes: +'+mnAdded+' -> '+mn.length);
console.log('Health nodes: +'+hlnAdded+' -> '+hln.length);
console.log('Politics edges: +'+peAdded+' -> '+pe.length);
console.log('History edges: +'+heAdded+' -> '+he.length);
console.log('Mechanism edges: +'+meAdded+' -> '+me.length);
console.log('Health edges: +'+hleAdded+' -> '+hle.length);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s => {
  JSON.parse(fs.readFileSync(D('data/'+s+'/edges.json'))).forEach(e => {
    if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source, 'edge:', e.id); orphans++; }
    if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target, 'edge:', e.id); orphans++; }
  });
});
console.log('Total orphans:', orphans);
