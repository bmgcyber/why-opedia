#!/usr/bin/env node
// add_batch7_nodes.js — media nodes (Fox News, tabloid media, RT, Wikileaks),
//   health nodes (opioid crisis, mental health stigma, loneliness epidemic),
//   history nodes (rwandan genocide, spanish flu, printing press, reformation),
//   mechanisms (astroturfing, elite capture, regulatory capture)
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const medn = JSON.parse(fs.readFileSync(D('data/global/media/nodes.json')));
const hln = JSON.parse(fs.readFileSync(D('data/global/health/nodes.json')));
const hn = JSON.parse(fs.readFileSync(D('data/global/history/nodes.json')));
const mn = JSON.parse(fs.readFileSync(D('data/mechanisms/nodes.json')));
const pn = JSON.parse(fs.readFileSync(D('data/global/politics/nodes.json')));

const mede = JSON.parse(fs.readFileSync(D('data/global/media/edges.json')));
const hle = JSON.parse(fs.readFileSync(D('data/global/health/edges.json')));
const he = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const pe = JSON.parse(fs.readFileSync(D('data/global/politics/edges.json')));

const mednIds = new Set(medn.map(n=>n.id));
const hlnIds = new Set(hln.map(n=>n.id));
const hnIds = new Set(hn.map(n=>n.id));
const mnIds = new Set(mn.map(n=>n.id));
const pnIds = new Set(pn.map(n=>n.id));
const medeIds = new Set(mede.map(e=>e.id));
const hleIds = new Set(hle.map(e=>e.id));
const heIds = new Set(he.map(e=>e.id));
const meIds = new Set(me.map(e=>e.id));
const peIds = new Set(pe.map(e=>e.id));

// ── New Media nodes ───────────────────────────────────────────────────────
const newMediaNodes = [
  {
    id: 'fox_news',
    label: 'Fox News',
    node_type: 'institution',
    category: 'institution',
    decade: '1990s',
    scope: 'global/media',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Fox_News',
    summary: 'Right-wing American cable news network founded by Rupert Murdoch and Roger Ailes in 1996; became the dominant force in conservative media and a major driver of political polarization through partisan propaganda.',
    tags: ['cable news', 'rupert murdoch', 'roger ailes', 'conservative', 'propaganda', 'polarization', 'disinformation']
  },
  {
    id: 'russian_disinformation',
    label: 'Russian Disinformation Operations',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2010s',
    scope: 'global/media',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Russian_interference_in_the_2016_United_States_elections',
    summary: 'Russian state-directed campaigns using social media, fake news sites, and hacked email releases to influence Western elections and amplify social division; documented in the Mueller Report and Senate Intelligence Committee investigations.',
    tags: ['russia', 'disinformation', 'election interference', 'IRA', 'troll farm', 'social media', 'mueller', '2016']
  },
  {
    id: 'citizen_journalism',
    label: 'Citizen Journalism',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2000s',
    scope: 'global/media',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Citizen_journalism',
    summary: 'Non-professional reporting enabled by digital cameras and social media; democratizes news gathering but also produces unvetted information, reduced professional standards, and vulnerability to manipulation.',
    tags: ['social media', 'crowdsourcing', 'news', 'twitter', 'smartphone', 'accountability', 'unvetted', 'democratization']
  },
  {
    id: 'media_consolidation',
    label: 'Media Consolidation',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1990s',
    scope: 'global/media',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Concentration_of_media_ownership',
    summary: 'Progressive concentration of media ownership in fewer corporate hands; six companies control 90% of US media by 2012 vs 50 companies in 1983; reduces editorial independence and narrows range of perspectives in public discourse.',
    tags: ['media ownership', 'consolidation', 'corporate media', 'Murdoch', 'Comcast', 'Disney', 'monopoly', 'diversity']
  },
];

// ── New Health nodes ──────────────────────────────────────────────────────
const newHealthNodes = [
  {
    id: 'opioid_crisis',
    label: 'Opioid Crisis',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1990s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Opioid_epidemic_in_the_United_States',
    summary: 'Epidemic of opioid addiction and overdose deaths caused by pharmaceutical industry aggressive marketing of OxyContin and other prescription opioids; 500,000+ deaths since 1999; Purdue Pharma and Sackler family criminally liable.',
    tags: ['opioids', 'addiction', 'overdose', 'purdue pharma', 'sackler', 'pharmaceutical', 'fentanyl', 'rural america']
  },
  {
    id: 'mental_health_stigma',
    label: 'Mental Health Stigma',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1900s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Social_stigma_of_mental_illness',
    summary: 'Social stigma attached to mental illness that prevents treatment-seeking, produces discrimination, and reinforces suffering; intersects with race, gender, and class in determining who gets diagnosed and treated.',
    tags: ['mental health', 'stigma', 'discrimination', 'treatment', 'psychiatry', 'depression', 'schizophrenia', 'shame']
  },
  {
    id: 'loneliness_epidemic',
    label: 'Loneliness Epidemic',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2010s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Loneliness',
    summary: 'Public health crisis of widespread social isolation documented across Western democracies; the US Surgeon General declared loneliness an epidemic in 2023; associated with mortality risk equivalent to smoking 15 cigarettes per day.',
    tags: ['loneliness', 'isolation', 'social connection', 'mental health', 'social media', 'community', 'public health']
  },
];

// ── New History nodes ─────────────────────────────────────────────────────
const newHistNodes = [
  {
    id: 'rwandan_genocide',
    label: 'Rwandan Genocide',
    node_type: 'event',
    category: 'event',
    decade: '1990s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Rwandan_genocide',
    summary: 'Genocide of 500,000-800,000 Tutsi and moderate Hutu in 100 days in 1994; organized by Hutu Power government using state apparatus and radio propaganda; international community\'s failure to intervene remains defining failure of humanitarian intervention.',
    tags: ['genocide', 'rwanda', 'hutu', 'tutsi', 'radio mille collines', 'un failure', 'africa', 'ethnic violence']
  },
  {
    id: 'spanish_flu',
    label: 'Spanish Flu Pandemic',
    node_type: 'event',
    category: 'event',
    decade: '1910s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Spanish_flu',
    summary: 'Influenza pandemic of 1918-1920 killing 50-100 million people worldwide; suppressed in wartime media coverage; shaped public health institutions and pandemic preparedness in ways that deteriorated by the 21st century.',
    tags: ['pandemic', '1918', 'influenza', 'public health', 'wwi', 'wartime censorship', 'mortality', 'global']
  },
  {
    id: 'printing_press',
    label: 'Printing Press',
    node_type: 'technology',
    category: 'technology',
    decade: '1450s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Printing_press',
    summary: 'Gutenberg\'s movable type press (c. 1440) enabled mass reproduction of texts, making books affordable; directly enabled the Protestant Reformation by allowing Bible distribution, and the Scientific Revolution by enabling scientific communication.',
    tags: ['gutenberg', 'printing', 'information revolution', 'reformation', 'scientific revolution', 'mass media', 'literacy']
  },
  {
    id: 'protestant_reformation_history',
    label: 'Protestant Reformation',
    node_type: 'event',
    category: 'event',
    decade: '1510s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Reformation',
    summary: 'Martin Luther\'s 1517 challenge to Catholic Church authority, producing the split of Western Christianity into Catholic and Protestant branches; drove religious wars, created the secular state concept, and catalyzed the Scientific Revolution.',
    tags: ['martin luther', 'protestantism', 'catholicism', 'church reform', 'religious war', 'secularism', 'bible', '95 theses']
  },
];

// ── New Mechanism nodes ───────────────────────────────────────────────────
const newMechNodes = [
  {
    id: 'regulatory_capture',
    label: 'Regulatory Capture',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1970s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Regulatory_capture',
    summary: 'Process by which regulatory agencies come to serve the industries they are supposed to regulate; occurs through revolving door hiring, industry funding of research, and systematic influence over agency culture and personnel.',
    tags: ['regulatory capture', 'revolving door', 'corruption', 'industry influence', 'FDA', 'SEC', 'EPA', 'lobbying']
  },
  {
    id: 'astroturfing',
    label: 'Astroturfing',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1980s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Astroturfing',
    summary: 'Creation of fake grassroots movements by corporate or political interests to manufacture appearance of popular support; named by Lloyd Bentsen for fake citizen groups actually funded by industry.',
    tags: ['astroturfing', 'fake grassroots', 'corporate lobbying', 'manufactured consent', 'climate denial', 'tobacco', 'PR']
  },
  {
    id: 'propaganda',
    label: 'Propaganda',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1910s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Propaganda',
    summary: 'Systematic use of biased or misleading information to promote a political cause or point of view; distinguished from education by its deliberate manipulation rather than information transfer; central to modern state and corporate power.',
    tags: ['propaganda', 'persuasion', 'disinformation', 'war', 'state power', 'media', 'manipulation', 'bernays']
  },
];

// ── Media edges ───────────────────────────────────────────────────────────
const newMediaEdges = [
  // Fox News
  { id: 'fox_news__political_polarization',
    source: 'fox_news', target: 'political_polarization', type: 'CAUSED',
    label: 'Fox News is the primary institutional driver of American political polarization through partisan epistemological separation',
    note: 'Academic research (Pew Research, Martin and Yurukoglu 2017 NBER paper) documents Fox News\'s causal role in political polarization: towns that received Fox News in cable rollout showed measurable increases in Republican vote share; Fox viewers hold factually distinct beliefs about climate change, vaccine safety, and election integrity from non-Fox viewers; Fox News pioneered the partisan news model where viewers receive a separate information environment rather than shared facts. The polarization Fox produces is not merely partisan but epistemological — Fox viewers and non-viewers inhabit incompatible factual realities, making democratic deliberation impossible.',
    confidence: 'high' },
  { id: 'fox_news__trump_maga',
    source: 'fox_news', target: 'trump_maga', type: 'ENABLED',
    label: 'Fox News and MAGA were mutually constitutive — Fox created the audience and epistemic environment MAGA exploited; MAGA gave Fox its primary political purpose',
    note: 'Fox News and MAGA had a symbiotic relationship: Fox had spent two decades priming its audience with Obama birth certificate coverage, Benghazi hearings, Clinton email obsession, and border crime panic — creating the exact audience Trump exploited in 2015-16; Trump understood Fox\'s audience viscerally and gave them the authoritarian strongman Fox programming implied they needed; Fox News coverage of Trump was systematically more favorable than any other mainstream outlet throughout his presidency and during January 6. Rupert Murdoch\'s post-January 6 distancing from Trump was commercial calculation, not principled — Fox continued amplifying election denial even while internal communications (revealed in Dominion lawsuit) showed executives knew it was false.',
    confidence: 'high' },
  { id: 'manufactured_consent__fox_news',
    source: 'manufactured_consent', target: 'fox_news', type: 'ENABLED',
    label: 'Fox News institutionalized the manufactured consent model in a partisan direction, but Chomsky/Herman\'s propaganda model applies to its operations',
    note: 'Herman and Chomsky\'s manufactured consent model was developed analyzing liberal mainstream media, but applies even more directly to Fox News: ownership filter (Murdoch\'s political agenda); advertising filter (corporate advertisers aligned with Republican politics); sourcing filter (Republican politicians and conservative think tanks as primary sources); flak filter (Media Research Center and others attack reporters who criticize Fox or Republicans); ideology filter (anti-communism replaced with anti-liberalism as the primary organizing ideology). Fox added a sixth filter: partisan audience capture, where the audience\'s political identity is directly monetized, creating incentives to radicalize rather than inform.',
    confidence: 'high' },

  // Russian disinformation
  { id: 'russian_disinformation__social_media_algorithms',
    source: 'russian_disinformation', target: 'social_media_algorithms', type: 'EXPLOITED',
    label: 'Russian disinformation operations specifically exploited social media algorithmic amplification to reach audiences far beyond organic reach',
    note: 'The Internet Research Agency (IRA) and Russian disinformation operations were specifically designed to exploit social media algorithms: content designed to maximize engagement (outrage, fear, identity threat) was algorithmically amplified beyond its organic reach; Russian accounts posed as American political activists on all sides to amplify division; the IRA created Facebook groups with millions of organic followers who never knew they were interacting with Russian state operations. The Mueller Report documented the scale: IRA social media content reached 126 million Americans on Facebook alone. Russian operations demonstrated that social media algorithms were a national security vulnerability because they amplified divisive content regardless of source.',
    confidence: 'high' },
  { id: 'russian_disinformation__broken_epistemology',
    source: 'russian_disinformation', target: 'broken_epistemology', type: 'ENABLED',
    label: 'Russian disinformation strategy was explicitly designed to produce epistemological confusion rather than promote specific beliefs',
    note: 'Russian disinformation strategy (documented in the Gerasimov Doctrine and Surkov\'s "managed democracy" framework) aims not to persuade but to confuse: the goal is to make audiences uncertain about what is true, distrust all information sources, and become paralyzed by competing narratives. The strategy is effective precisely because it exploits healthy epistemic habits — skepticism of propaganda — to undermine the possibility of shared factual knowledge. When everything is potentially disinformation, democratic deliberation becomes impossible. Russian operations promoted contradictory conspiracies simultaneously because the confusion itself serves the strategic goal, not any particular false belief.',
    confidence: 'high' },

  // Media consolidation
  { id: 'media_consolidation__manufactured_consent',
    source: 'media_consolidation', target: 'manufactured_consent', type: 'ENABLED',
    label: 'Media consolidation reduces the range of perspectives in public discourse, enabling manufactured consent through corporate ownership alignment',
    note: 'Media consolidation enables manufactured consent by reducing editorial independence: when six companies control 90% of US media, their shared corporate interests (tax policy, regulatory policy, labor law) create structural alignment across nominally independent outlets; local news consolidation (Sinclair Broadcast Group buying local TV stations and mandating politically-aligned "must-run" segments) demonstrates the direct mechanism; conglomerate ownership (Disney-ABC, Comcast-NBC) creates conflicts of interest between journalism and corporate parent interests. The consolidation trend reduces the diversity of ownership that is the structural precondition for media pluralism.',
    confidence: 'high' },
  { id: 'media_consolidation__political_polarization',
    source: 'media_consolidation', target: 'political_polarization', type: 'ENABLED',
    label: 'Media consolidation has produced a partisan media landscape where audiences can select entirely into partisan information environments',
    note: 'Media consolidation paradoxically increased polarization despite reducing the number of media organizations: the consolidation era coincided with partisan specialization, where consolidated media companies found profitable niches in partisan audiences rather than broad general audiences; cable TV economics incentivized partisan identity content; local newspaper collapse (accelerated by consolidated chains cutting costs) removed the shared information environment of local communities. The result is a consolidated media landscape where fewer owners produce more partisan content — consolidation and polarization have been simultaneous rather than offsetting trends.',
    confidence: 'high' },

  // Citizen journalism
  { id: 'citizen_journalism__social_media_algorithms',
    source: 'citizen_journalism', target: 'social_media_algorithms', type: 'ENABLED',
    label: 'Social media algorithms turned citizen journalism into a double-edged force — real accountability journalism alongside unvetted viral misinformation',
    note: 'Social media platforms amplify citizen journalism through the same engagement optimization that amplifies misinformation: the George Floyd murder was documented by 17-year-old Darnella Frazier\'s iPhone video (without which prosecution might have failed); police brutality documentation across the BLM era was primarily citizen journalism; but the same dynamics amplify viral misinformation — Plandemic, COVID denialism, election fraud claims — that also originates with non-professional content creators. The distinction between citizen accountability journalism and viral misinformation uses the same distribution infrastructure; platforms cannot amplify one without amplifying the other.',
    confidence: 'high' },
];

// ── Health edges ──────────────────────────────────────────────────────────
const newHealthEdges = [
  // Opioid crisis
  { id: 'opioid_crisis__war_on_drugs',
    source: 'opioid_crisis', target: 'war_on_drugs', type: 'SHARES_MECHANISM_WITH',
    label: 'The opioid crisis and War on Drugs represent contrasting government responses to addiction shaped by race: one criminalized, one medicalized',
    note: 'The opioid crisis and War on Drugs represent the same phenomenon — mass addiction — treated through opposite policy lenses determined by racial demographics: the crack epidemic (primarily affecting Black communities in the 1980s) produced the War on Drugs with mandatory minimum sentences and mass incarceration; the opioid epidemic (initially primarily affecting white rural communities) produced treatment programs, harm reduction, and pharmaceutical company prosecution. This differential response documents how racial identity shapes policy framing: addiction is a crime requiring punishment when Black; a disease requiring treatment when white. The belated recognition of fentanyl\'s expansion into all communities began eroding this treatment gap.',
    confidence: 'high' },
  { id: 'opioid_crisis__regulatory_capture',
    source: 'opioid_crisis', target: 'regulatory_capture', type: 'ENABLED',
    label: 'The FDA\'s failure to respond to opioid crisis evidence was a textbook case of regulatory capture by pharmaceutical industry',
    note: 'The opioid crisis was enabled by pharmaceutical regulatory capture: the FDA approved OxyContin (1995) based on inadequate addiction studies; the FDA ignored evidence of widespread addiction and diversion for a decade; the Joint Commission adopted pain as the "fifth vital sign" (promoted by Purdue Pharma) mandating opioid prescription; DEA quota systems that set production caps were systematically overwhelmed by industry lobbying. Congressional testimony and DOJ investigation revealed that FDA officials received industry consulting fees; the revolving door between FDA and pharmaceutical companies created institutional capture. The regulatory failure was not accidental — it was the predictable result of regulatory capture dynamics.',
    confidence: 'high' },

  // Mental health stigma
  { id: 'mental_health_stigma__adverse_childhood_experiences',
    source: 'mental_health_stigma', target: 'adverse_childhood_experiences', type: 'ENABLED',
    label: 'Mental health stigma prevents trauma disclosure and treatment, allowing ACE effects to compound across development',
    note: 'Mental health stigma directly enables ACE harm through treatment prevention: stigma around mental health treatment prevents trauma survivors from seeking help; institutional cultures in schools, military, and workplaces punish mental health disclosure; race and gender shape stigma (Black men facing particular pressure against help-seeking; women\'s trauma more often diagnosed as personality disorder than PTSD); religious communities may frame trauma response as spiritual failure rather than medical need. ACE research demonstrates that early intervention can alter trajectory — mental health stigma blocking that intervention allows trauma effects to compound into the adult health outcomes ACE studies document.',
    confidence: 'high' },
  { id: 'loneliness_epidemic__social_media_addiction',
    source: 'loneliness_epidemic', target: 'social_media_addiction', type: 'SHARES_MECHANISM_WITH',
    label: 'The loneliness epidemic and social media addiction are structurally linked: social media replaces but cannot substitute for the embodied social connection it simulates',
    note: 'The loneliness epidemic and social media addiction share a paradoxical relationship: social media use increased sharply during the same period loneliness increased, suggesting social media exacerbates rather than solves loneliness; research (Sherry Turkle, "Alone Together") documents that social media use produces feelings of social connection that are not metabolically equivalent to in-person social contact; heavy social media use correlates with increased loneliness, especially in adolescents; social media\'s comparison dynamics (comparing your inside to others\' outsides) produce social alienation even among users with large followings. The loneliness epidemic is not caused solely by social media but social media use is not the solution its business model implies.',
    confidence: 'high' },
  { id: 'loneliness_epidemic__mental_health_stigma',
    source: 'loneliness_epidemic', target: 'mental_health_stigma', type: 'ENABLED',
    label: 'Mental health stigma prevents people from disclosing loneliness and seeking social connection, reinforcing the epidemic',
    note: 'Mental health stigma compounds the loneliness epidemic: loneliness itself carries social stigma (admitting loneliness signals social failure); the stigma prevents people from disclosing the condition, which would be the first step toward addressing it; mental health treatment stigma prevents therapeutic interventions for the depression and anxiety that both cause and result from loneliness; workplace cultures that reward isolation (long hours, geographic mobility) attach success status to behaviors that produce loneliness. The loneliness epidemic is partly self-concealing because of the stigma attached to admitting it.',
    confidence: 'high' },
];

// ── History edges ─────────────────────────────────────────────────────────
const newHistEdges = [
  // Rwandan genocide
  { id: 'rwandan_genocide__hutu_power',
    source: 'rwandan_genocide', target: 'hutu_power', type: 'PRODUCED',
    label: 'The Rwandan genocide was organized and executed by Hutu Power extremists using state media as their primary mobilization tool',
    note: 'Hutu Power was the direct organizational cause of the Rwandan genocide: Radio Milles Collines broadcast daily instructions, named specific Tutsis to kill, and used dehumanizing language ("cockroaches") that lowered killing inhibitions; the Interahamwe militias were Hutu Power\'s paramilitary arm; the genocide was organizationally sophisticated — it killed 500,000-800,000 people in 100 days using primarily machetes and local coordination. The genocide demonstrates the relationship between media dehumanization and mass violence: Radio Milles Collines was as essential to the genocide as the machetes. Rwanda became the defining case for "responsibility to protect" doctrine in international law.',
    confidence: 'high' },
  { id: 'berlin_conference_1884__rwandan_genocide',
    source: 'berlin_conference_1884', target: 'rwandan_genocide', type: 'ENABLED',
    label: 'Belgian colonial ethnic categorization of Hutu and Tutsi as distinct racial groups created the ethnic division that Hutu Power later weaponized',
    note: 'The Rwandan genocide was partly a product of Belgian colonial racial categorization: pre-colonial Rwanda had Hutu/Tutsi distinctions based primarily on cattle ownership (economic class, fluid and permeable); Belgian colonizers in the 1930s introduced identity cards with fixed racial classifications and made Tutsi the colonial intermediary class (given education, administrative roles) while marginalizing Hutu; the Tutsi/Hutu distinction was transformed from fluid social category to fixed racial identity through Belgian colonial administrative practice. When Hutu nationalists led the 1959 revolution and independence, the Belgian-hardened ethnic resentment became the basis for systematic discrimination and eventually genocide.',
    confidence: 'high' },

  // Spanish flu
  { id: 'spanish_flu__covid19_pandemic',
    source: 'spanish_flu', target: 'covid19_pandemic', type: 'SHARES_MECHANISM_WITH',
    label: 'The Spanish flu and COVID-19 share pandemic dynamics but COVID occurred in an information environment the 1918 pandemic could not have imagined',
    note: 'The Spanish flu (1918-1920) and COVID-19 share fundamental pandemic dynamics: respiratory transmission, high mortality in vulnerable populations, non-pharmaceutical interventions (masking, distancing) as primary early mitigation, and catastrophic failure of political leadership in some jurisdictions. Key differences: Spanish flu occurred under wartime censorship that suppressed initial coverage; COVID occurred in a 24-hour social media information environment where denial, conspiracy, and political weaponization of public health spread at pandemic speed alongside the virus. The comparison illuminates how the information environment shapes pandemic response: wartime censorship produced ignorance; social media produced epistemic chaos.',
    confidence: 'high' },
  { id: 'spanish_flu__world_war_i',
    source: 'spanish_flu', target: 'world_war_i', type: 'SHARES_MECHANISM_WITH',
    label: 'WWI troop movements spread the Spanish flu globally; wartime censorship prevented warning other nations about the pandemic',
    note: 'The Spanish flu and WWI were deeply intertwined: troop movements (US soldiers sailing to Europe, soldiers in crowded trenches) spread the virus globally; wartime censorship in all belligerent nations suppressed news of the illness to avoid damaging morale — Spain (neutral) reported freely, giving it the misleading name "Spanish flu"; the 1918 German Spring Offensive failed partly because flu had decimated German forces; the Armistice (November 1918) celebrations produced massive super-spreader events during the second wave. The flu killed more people than WWI did — approximately 50-100 million vs 20 million — but gets far less historical attention because it lacked the political drama of the war.',
    confidence: 'high' },

  // Printing press
  { id: 'printing_press__protestant_reformation_history',
    source: 'printing_press', target: 'protestant_reformation_history', type: 'ENABLED',
    label: 'The printing press made the Reformation possible by enabling mass distribution of Luther\'s theses and vernacular Bibles outside Church control',
    note: 'The printing press was the enabling technology of the Protestant Reformation: Luther\'s 95 Theses (1517) were printed and distributed across Germany within weeks — previously, reformers like Jan Hus (burned 1415) could not spread their ideas fast enough to survive Church suppression; vernacular Bible printing (Luther\'s German Bible, 1534) gave literate Germans direct access to scripture, undermining the priest\'s interpretive monopoly; Protestant pamphlet culture created a public sphere of religious debate outside Church control. The Reformation could not have survived without printing; Church opponents of earlier centuries were isolated by the slow spread of manuscript culture.',
    confidence: 'high' },
  { id: 'printing_press__scientific_revolution',
    source: 'printing_press', target: 'scientific_revolution', type: 'ENABLED',
    label: 'The printing press enabled scientific communication at scale, allowing scientists across Europe to build on each other\'s work',
    note: 'The Scientific Revolution required the printing press as its communication infrastructure: Copernicus\'s "De Revolutionibus" (1543) could be distributed across Europe simultaneously; scientists could cite, debate, and build on each other\'s work rather than each working in isolation; standardized printed texts meant scientists in different countries were working from the same data; Galileo, Kepler, and Newton could develop a cumulative scientific tradition because printing made scientific knowledge cumulative. Without printing, the Scientific Revolution\'s knowledge accumulation speed would have been impossible — manuscript culture was too slow and error-prone for the systematic empirical tradition science requires.',
    confidence: 'high' },

  // Protestant Reformation
  { id: 'protestant_reformation_history__protestant_reformation',
    source: 'protestant_reformation_history', target: 'protestant_reformation', type: 'PRODUCED',
    label: 'The historical Protestant Reformation produced the Protestant Reformation as an ongoing religious tradition',
    note: 'The Protestant Reformation as historical event (1517 onward) and Protestant Reformation as ongoing religious movement represent the event and its institutional legacy. Luther\'s challenge to Rome produced Lutheranism, Calvinism, Anglicanism, and dozens of subsequent Protestant denominations; the principle of "sola scriptura" (scripture alone as authority) embedded the logic of fragmentation that has produced 40,000+ Protestant denominations. The historical Reformation also produced the concept of religious freedom (initially as protection for Protestant minorities in Catholic territories, then universalized) and the secular state (the only solution to religious civil war). Connecting the historical event to the living movement.',
    confidence: 'high' },
  { id: 'protestant_reformation_history__peace_of_westphalia',
    source: 'protestant_reformation_history', target: 'peace_of_westphalia', type: 'PRODUCED',
    label: 'The Thirty Years War of religion that the Reformation catalyzed produced the Peace of Westphalia as its resolution',
    note: 'The Peace of Westphalia (1648) was the political resolution to the wars of religion the Protestant Reformation had caused: the Thirty Years War (1618-1648) killed a third of the German population in religiously-motivated mass violence; Westphalia\'s solution was to separate religious authority from political sovereignty — rulers could determine their territory\'s religion (cuius regio, eius religio) but could not force religious conversion outside their borders. This solution (state sovereignty as the answer to religious war) was the origin of the modern international order. The Reformation caused a century of religious war; Westphalia created the state system to prevent it happening again.',
    confidence: 'high' },
];

// ── Mechanism edges ───────────────────────────────────────────────────────
const newMechEdges = [
  // Regulatory capture
  { id: 'regulatory_capture__neoliberalism',
    source: 'regulatory_capture', target: 'neoliberalism', type: 'ENABLED',
    label: 'Neoliberal ideology promotes regulatory capture by framing business-friendly regulators as efficiency and anti-regulatory ideology as market freedom',
    note: 'Neoliberalism and regulatory capture are structurally connected: neoliberal ideology framing all regulation as government interference creates political support for dismantling regulatory capacity and appointing industry-friendly regulators; the revolving door (regulator to industry to regulator) is structurally incentivized by industry\'s superior compensation and neoliberalism\'s validation of private sector over public sector careers; Koch network funding of economics departments (against regulation) and think tanks (Cato, Heritage) that train regulators creates a pipeline of ideologically pre-captured officials. Regulatory capture is not incidental to neoliberalism — it is the operational mechanism through which neoliberal ideology is converted into reduced regulatory effectiveness.',
    confidence: 'high' },
  { id: 'regulatory_capture__opioid_crisis',
    source: 'regulatory_capture', target: 'opioid_crisis', type: 'ENABLED',
    label: 'Regulatory capture of the FDA and DEA by the pharmaceutical industry was the proximate cause of the opioid crisis',
    note: 'The opioid crisis is the regulatory capture case study: the FDA\'s approval of OxyContin (1995) despite inadequate addiction data; the FDA\'s decade-long failure to respond to addiction evidence Purdue Pharma knew about; DEA production quotas set far above demonstrated medical need; Congressional lobbying (Controlled Substances Act amendments 2016) that deliberately weakened DEA enforcement; the Sackler family\'s systematic cultivation of FDA officials and pain management advocacy groups. Congressional investigations documented specific instances of industry influence on regulatory decisions. The opioid crisis demonstrates that regulatory capture causes mass death — 500,000+ Americans died from pharmaceutical opioids since 1999.',
    confidence: 'high' },

  // Astroturfing
  { id: 'astroturfing__climate_change_denial',
    source: 'astroturfing', target: 'climate_change_denial', type: 'ENABLED',
    label: 'Climate denial was organized through astroturf groups that presented industry-funded denial as independent scientific and citizen skepticism',
    note: 'Astroturfing was central to climate denial\'s effectiveness: the Global Climate Coalition (fossil fuel companies) funded "independent" research centers and spokespeople who appeared as independent scientists; Citizens for a Sound Economy (Koch-funded) organized against carbon policy as if citizen-driven; the Heartland Institute (tobacco and fossil fuel funded) sponsored conferences presenting fringe scientists as a legitimate skeptical community; American Legislative Exchange Council (ALEC) drafted state-level anti-climate legislation as if from legislators. The astroturf design was essential to creating the appearance of a genuine scientific controversy — the strategy required hiding industry funding to maintain the false impression of independent skepticism.',
    confidence: 'high' },
  { id: 'astroturfing__manufactured_consent',
    source: 'astroturfing', target: 'manufactured_consent', type: 'ENABLED',
    label: 'Astroturfing is the operational implementation of manufactured consent through fake grassroots to create false impression of popular support for elite interests',
    note: 'Astroturfing is manufactured consent\'s grassroots implementation mechanism: manufactured consent operates through institutional channels (media ownership, advertising, sourcing); astroturfing extends this to simulated citizen movements, creating the appearance that elite-funded positions are popular demands. The combination of manufactured consent (top-down through media institutions) and astroturfing (bottom-up through fake citizen groups) creates a complete manufactured democratic legitimacy: policies promoted by owned media (top-down) appear to have citizen support (bottom-up) through astroturf organizations. Tobacco, fossil fuels, pharmaceutical companies, and political campaigns all use the combined strategy.',
    confidence: 'high' },

  // Propaganda
  { id: 'propaganda__manufactured_consent',
    source: 'propaganda', target: 'manufactured_consent', type: 'ENABLED',
    label: 'Propaganda is the historical precursor and continuing practice that manufactured consent theory systematically analyzes',
    note: 'Propaganda and manufactured consent are related concepts at different scales: propaganda (Bernays, Lippmann, wartime government communications) refers to deliberate information manipulation campaigns; manufactured consent (Chomsky/Herman) identifies the structural conditions in liberal democracies that produce systematic propaganda effects without requiring explicit conspiracy. Both describe manipulation of public opinion through controlled information environments; manufactured consent explains why propaganda is so effective in "free" societies — media structural filters produce propaganda effects without requiring government censorship. Edward Bernays (who coined "public relations" as a replacement for "propaganda" after WWI gave it a bad name) is the intellectual connection: his nephew Sigmund Freud\'s psychology applied to mass persuasion.',
    confidence: 'high' },
  { id: 'propaganda__fascism',
    source: 'propaganda', target: 'fascism', type: 'ENABLED',
    label: 'Fascism was the first political movement to systematically theorize and deploy modern propaganda as its primary political tool',
    note: 'Fascism and propaganda are structurally inseparable: Mussolini and Goebbels both theorized propaganda as the essential technology of fascist rule; Nazi Germany\'s Ministry of Public Enlightenment and Propaganda was the first government ministry dedicated entirely to information control; Leni Riefenstahl\'s Triumph of the Will was the first systematic use of cinema as state propaganda; the Nuremberg rallies were designed as propaganda spectacles. Hitler\'s "Mein Kampf" contains an extensive analysis of propaganda as political technique. Fascism\'s novelty as a political form was partly its explicit theorization of propaganda as statecraft — previous authoritarian regimes relied on censorship and force; fascism added systematic positive propaganda.',
    confidence: 'high' },
];

// ── Politics edges ────────────────────────────────────────────────────────
const newPolitEdges = [
  { id: 'regulatory_capture__neoliberalism_politics',
    source: 'neoliberalism', target: 'regulatory_capture', type: 'PRODUCED',
    label: 'Neoliberal politics systematically produced regulatory capture by appointing industry insiders and defunding enforcement agencies',
    note: 'Neoliberal governments (Reagan, Thatcher, and successors) systematically produced regulatory capture: Reagan appointed Anne Gorsuch (Burford) to head EPA with mandate to weaken it; appointed James Watt (former industry attorney) as Interior Secretary; defunded regulatory agencies while appointing opponents of their mission. The political strategy was explicit — use personnel and budget cuts to weaken regulation while avoiding the political cost of abolishing popular regulatory protections. This "slow capture" through hostile appointment and budget starvation became the template for subsequent Republican administrations. The result was regulatory agencies staffed by people ideologically committed to not regulating.',
    confidence: 'high' },
];

// ── Write files ───────────────────────────────────────────────────────────
let mednAdded=0, hlnAdded=0, hnAdded=0, mnAdded=0;
let medeAdded=0, hleAdded=0, heAdded=0, meAdded=0, peAdded=0;

newMediaNodes.forEach(n => { if (!mednIds.has(n.id)) { medn.push(n); mednIds.add(n.id); mednAdded++; } });
newHealthNodes.forEach(n => { if (!hlnIds.has(n.id)) { hln.push(n); hlnIds.add(n.id); hlnAdded++; } });
newHistNodes.forEach(n => { if (!hnIds.has(n.id)) { hn.push(n); hnIds.add(n.id); hnAdded++; } });
newMechNodes.forEach(n => { if (!mnIds.has(n.id)) { mn.push(n); mnIds.add(n.id); mnAdded++; } });

newMediaEdges.forEach(e => { if (!medeIds.has(e.id)) { mede.push(e); medeIds.add(e.id); medeAdded++; } });
newHealthEdges.forEach(e => { if (!hleIds.has(e.id)) { hle.push(e); hleIds.add(e.id); hleAdded++; } });
newHistEdges.forEach(e => { if (!heIds.has(e.id)) { he.push(e); heIds.add(e.id); heAdded++; } });
newMechEdges.forEach(e => { if (!meIds.has(e.id)) { me.push(e); meIds.add(e.id); meAdded++; } });
newPolitEdges.forEach(e => { if (!peIds.has(e.id)) { pe.push(e); peIds.add(e.id); peAdded++; } });

fs.writeFileSync(D('data/global/media/nodes.json'), JSON.stringify(medn, null, 2));
fs.writeFileSync(D('data/global/health/nodes.json'), JSON.stringify(hln, null, 2));
fs.writeFileSync(D('data/global/history/nodes.json'), JSON.stringify(hn, null, 2));
fs.writeFileSync(D('data/mechanisms/nodes.json'), JSON.stringify(mn, null, 2));
fs.writeFileSync(D('data/global/politics/nodes.json'), JSON.stringify(pn, null, 2));
fs.writeFileSync(D('data/global/media/edges.json'), JSON.stringify(mede, null, 2));
fs.writeFileSync(D('data/global/health/edges.json'), JSON.stringify(hle, null, 2));
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(he, null, 2));
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
fs.writeFileSync(D('data/global/politics/edges.json'), JSON.stringify(pe, null, 2));

console.log('Media nodes: +'+mednAdded+' -> '+medn.length);
console.log('Health nodes: +'+hlnAdded+' -> '+hln.length);
console.log('History nodes: +'+hnAdded+' -> '+hn.length);
console.log('Mechanism nodes: +'+mnAdded+' -> '+mn.length);
console.log('Media edges: +'+medeAdded+' -> '+mede.length);
console.log('Health edges: +'+hleAdded+' -> '+hle.length);
console.log('History edges: +'+heAdded+' -> '+he.length);
console.log('Mechanism edges: +'+meAdded+' -> '+me.length);
console.log('Politics edges: +'+peAdded+' -> '+pe.length);

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
