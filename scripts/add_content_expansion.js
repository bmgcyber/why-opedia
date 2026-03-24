'use strict';
// Content expansion: adds new mechanism nodes + fills sparse scopes.
// Run from why-opedia/ directory: node scripts/add_content_expansion.js

const fs = require('fs');
const path = require('path');

function load(p) { return JSON.parse(fs.readFileSync(path.join('data', p), 'utf8')); }
function save(p, d) { fs.writeFileSync(path.join('data', p), JSON.stringify(d, null, 2) + '\n', 'utf8'); }

// ── Guard: skip nodes/edges already present ──────────────────────────────────
function addNodes(existing, incoming) {
  const ids = new Set(existing.map(n => n.id));
  let added = 0;
  for (const n of incoming) {
    if (!ids.has(n.id)) { existing.push(n); ids.add(n.id); added++; }
  }
  return added;
}
function addEdges(existing, incoming) {
  const ids = new Set(existing.map(e => e.id));
  let added = 0;
  for (const e of incoming) {
    if (!ids.has(e.id)) { existing.push(e); ids.add(e.id); added++; }
  }
  return added;
}

// ════════════════════════════════════════════════════════════════════════════
// 1. NEW MECHANISM NODES  (cross-scope)
// ════════════════════════════════════════════════════════════════════════════
const newMechNodes = [
  {
    id: 'cognitive_dissonance',
    label: 'Cognitive Dissonance',
    node_type: 'reference',
    category: 'mechanism',
    wikipedia: 'https://en.wikipedia.org/wiki/Cognitive_dissonance',
    summary: 'The mental discomfort of holding contradictory beliefs simultaneously. Rather than updating beliefs, people typically rationalise, minimise, or ignore the contradiction. Exploited by cults, propaganda, and political movements to lock in loyalty despite contradictory evidence.',
    decade: '1950s',
    tags: ['psychology','belief','rationalisation','propaganda','identity'],
    scope: 'global/mechanisms',
    cross_scope: true,
  },
  {
    id: 'groupthink',
    label: 'Groupthink',
    node_type: 'reference',
    category: 'mechanism',
    wikipedia: 'https://en.wikipedia.org/wiki/Groupthink',
    summary: 'The tendency of cohesive groups to prioritise consensus and harmony over critical evaluation. Dissenting information is suppressed, alternatives are not examined, and the group becomes overconfident in its decisions. Identified by Irving Janis through analysis of US foreign policy disasters.',
    decade: '1970s',
    tags: ['psychology','decision-making','conformity','institutions','failure'],
    scope: 'global/mechanisms',
    cross_scope: true,
  },
  {
    id: 'dunning_kruger_effect',
    label: 'Dunning-Kruger Effect',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Dunning%E2%80%93Kruger_effect',
    summary: 'People with limited knowledge in a domain overestimate their competence, while genuine experts underestimate theirs relative to others. Named for Kruger & Dunning\'s 1999 study. Frequently invoked in political and online discourse, often misapplied as simple mockery of perceived ignorance.',
    decade: '1990s',
    tags: ['psychology','metacognition','expertise','politics','online'],
    scope: 'global/mechanisms',
    cross_scope: true,
  },
  {
    id: 'moral_panic',
    label: 'Moral Panic',
    node_type: 'reference',
    category: 'mechanism',
    wikipedia: 'https://en.wikipedia.org/wiki/Moral_panic',
    summary: 'Sociologist Stanley Cohen\'s concept: a disproportionate, media-amplified public reaction to a perceived threat to social values, typically targeting a "folk devil" group. The panic creates new laws, enforcement, and institutions that outlast the original threat. Examples span drug scares, video games, Satanic ritual panic, and online predators.',
    decade: '1970s',
    tags: ['sociology','media','law','scapegoating','institutions'],
    scope: 'global/mechanisms',
    cross_scope: true,
  },
  {
    id: 'cultural_hegemony',
    label: 'Cultural Hegemony',
    node_type: 'ideology',
    category: 'ideology',
    wikipedia: 'https://en.wikipedia.org/wiki/Cultural_hegemony',
    summary: 'Antonio Gramsci\'s theory: dominant classes maintain power not just through coercion but through cultural consent — normalising their worldview via media, education, religion, and popular culture so that subordinate groups internalise the ruling ideology as common sense.',
    decade: '1930s',
    tags: ['marxism','power','culture','media','ideology','gramsci'],
    scope: 'global/mechanisms',
    cross_scope: true,
  },
  {
    id: 'confirmation_bias',
    label: 'Confirmation Bias',
    node_type: 'reference',
    category: 'mechanism',
    wikipedia: 'https://en.wikipedia.org/wiki/Confirmation_bias',
    summary: 'The tendency to search for, interpret, favour, and recall information that confirms or supports one\'s prior beliefs. Actively filters out disconfirming evidence. Amplified by algorithmic filter bubbles which optimise for engagement by showing users content that matches their existing views.',
    decade: '1960s',
    tags: ['psychology','cognition','media','politics','algorithms'],
    scope: 'global/mechanisms',
    cross_scope: true,
  },
  {
    id: 'availability_heuristic',
    label: 'Availability Heuristic',
    node_type: 'reference',
    category: 'mechanism',
    wikipedia: 'https://en.wikipedia.org/wiki/Availability_heuristic',
    summary: 'Tversky and Kahneman\'s finding that people estimate the likelihood of events by how easily examples come to mind. Vivid, recent, or emotionally salient events are judged as more probable. Exploited by media (if it bleeds it leads) and politicians emphasising dramatic anecdotes over base rates.',
    decade: '1970s',
    tags: ['psychology','cognition','media','risk-perception','kahneman'],
    scope: 'global/mechanisms',
    cross_scope: true,
  },
  {
    id: 'overton_window',
    label: 'Overton Window',
    node_type: 'reference',
    category: 'mechanism',
    wikipedia: 'https://en.wikipedia.org/wiki/Overton_window',
    summary: 'The range of policies considered acceptable by the mainstream public at a given time. Developed by Joseph Overton at the Mackinac Center. Radical positions at the fringe gradually shift the window by making previously extreme positions seem moderate. Deliberately deployed by think tanks, political operatives, and media figures.',
    decade: '1990s',
    tags: ['politics','media','policy','radicalization','think-tanks'],
    scope: 'global/mechanisms',
    cross_scope: true,
  },
  {
    id: 'filter_bubble',
    label: 'Filter Bubble',
    node_type: 'phenomenon',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Filter_bubble',
    summary: 'Eli Pariser\'s term for algorithmic personalisation that isolates users in information ecosystems matching their prior beliefs. Differs from echo chambers (social) in being automated. Platforms optimising for engagement inadvertently (or deliberately) amplify outrage and polarisation, reinforcing confirmation bias at scale.',
    decade: '2010s',
    tags: ['algorithms','media','polarization','social-media','technology'],
    scope: 'global/mechanisms',
    cross_scope: true,
  },
];

// ── Mechanism edges (new cross-scope connections) ────────────────────────────
const newMechEdges = [
  { id: 'cognitive_dissonance__identity_capture', source: 'cognitive_dissonance', target: 'identity_capture', type: 'ENABLED', label: 'dissonance resolution reinforces captured identity', confidence: 'high' },
  { id: 'cognitive_dissonance__broken_epistemology', source: 'cognitive_dissonance', target: 'broken_epistemology', type: 'CAUSED', label: 'rationalising contradictions degrades epistemic standards', confidence: 'high' },
  { id: 'groupthink__broken_epistemology', source: 'groupthink', target: 'broken_epistemology', type: 'CAUSED', label: 'suppressed dissent produces poor collective epistemics', confidence: 'high' },
  { id: 'confirmation_bias__filter_bubble', source: 'confirmation_bias', target: 'filter_bubble', type: 'SELF_REINFORCES', label: 'bias amplified by algorithmic curation of matching content', confidence: 'high' },
  { id: 'filter_bubble__broken_epistemology', source: 'filter_bubble', target: 'broken_epistemology', type: 'CAUSED', label: 'isolated information environments fragment shared reality', confidence: 'high' },
  { id: 'overton_window__conspiracy_theory_grifters', source: 'overton_window', target: 'conspiracy_theory_grifters', type: 'ENABLED', label: 'window shift gives fringe figures mainstream adjacency', confidence: 'high' },
  { id: 'moral_panic__scapegoating', source: 'moral_panic', target: 'scapegoating', type: 'SHARES_MECHANISM_WITH', label: 'both focus collective anxiety onto a designated threat group', confidence: 'high' },
  { id: 'cultural_hegemony__identity_capture', source: 'cultural_hegemony', target: 'identity_capture', type: 'ENABLED', label: 'hegemonic culture shapes the identities available to individuals', confidence: 'high' },
  { id: 'dunning_kruger_effect__broken_epistemology', source: 'dunning_kruger_effect', target: 'broken_epistemology', type: 'SHARES_MECHANISM_WITH', label: 'both involve miscalibrated assessments of knowledge quality', confidence: 'medium' },
  { id: 'availability_heuristic__moral_panic', source: 'availability_heuristic', target: 'moral_panic', type: 'ENABLED', label: 'vivid media coverage makes threat feel imminent and widespread', confidence: 'high' },
];

// ════════════════════════════════════════════════════════════════════════════
// 2. MEDIA SCOPE
// ════════════════════════════════════════════════════════════════════════════
const newMediaNodes = [
  {
    id: 'edward_bernays',
    label: 'Edward Bernays',
    node_type: 'reference',
    category: 'person',
    wikipedia: 'https://en.wikipedia.org/wiki/Edward_Bernays',
    summary: 'Nephew of Freud and founder of modern public relations. Pioneered the use of psychological techniques to manufacture public consent for corporate and government clients. His 1928 book Propaganda argued that invisible governance by an elite class through mass persuasion was both inevitable and desirable. His campaigns included promoting cigarettes to women ("Torches of Freedom") and helping United Fruit Company orchestrate the CIA coup in Guatemala (1954).',
    decade: '1920s',
    tags: ['propaganda','public-relations','media','manipulation','psychology'],
    scope: 'global/media',
    cross_scope: false,
  },
  {
    id: 'walter_lippmann',
    label: 'Walter Lippmann',
    node_type: 'reference',
    category: 'person',
    wikipedia: 'https://en.wikipedia.org/wiki/Walter_Lippmann',
    summary: 'Influential American journalist and intellectual who coined "stereotype" and argued in Public Opinion (1922) that democracy required a "specialised class" to interpret complex reality for the masses. His ideas legitimised elite management of public information and directly influenced Bernays. A key theorist of the gap between "the world outside and the pictures in our heads."',
    decade: '1920s',
    tags: ['media','journalism','democracy','elite','propaganda','lippmann'],
    scope: 'global/media',
    cross_scope: false,
  },
  {
    id: 'yellow_journalism',
    label: 'Yellow Journalism',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Yellow_journalism',
    summary: 'Sensationalist journalism pioneered by Hearst and Pulitzer newspapers in the 1890s that prioritised circulation-driving scandal, patriotism, and emotionalism over factual reporting. Widely blamed for inflaming public opinion toward the Spanish-American War (1898). Established the template of profit-driven outrage journalism that recurs in tabloid, cable, and social media eras.',
    decade: '1890s',
    tags: ['journalism','sensationalism','media','war','propaganda'],
    scope: 'global/media',
    cross_scope: false,
  },
  {
    id: 'printing_press',
    label: 'Gutenberg Printing Press',
    node_type: 'reference',
    category: 'product',
    wikipedia: 'https://en.wikipedia.org/wiki/Printing_press',
    summary: 'Johannes Gutenberg\'s movable-type press (~1440) democratised text production, collapsing the Church\'s monopoly on literacy and information. Enabled mass distribution of the Bible, Martin Luther\'s pamphlets (Reformation), Enlightenment philosophy, and eventually nationalist newspapers. Every subsequent information revolution—from the telegram to the internet—follows the same pattern: decentralised production disrupts existing gatekeepers, producing both liberation and disorder.',
    decade: '1440s',
    tags: ['technology','media','religion','information','history','reformation'],
    scope: 'global/media',
    cross_scope: false,
  },
  {
    id: 'war_of_worlds_broadcast',
    label: 'War of the Worlds Broadcast (1938)',
    node_type: 'reference',
    category: 'event',
    wikipedia: 'https://en.wikipedia.org/wiki/The_War_of_the_Worlds_(radio_drama)',
    summary: 'Orson Welles\'s CBS Radio dramatisation (Oct 30, 1938) in news-bulletin format. Contemporary accounts of mass panic were heavily exaggerated by newspapers eager to discredit radio competition. Nonetheless, the episode became a founding myth of mass media power — the idea that realistic broadcast fiction could be mistaken for fact and cause social panic. Became evidence in media effects research and propaganda theory.',
    decade: '1930s',
    tags: ['radio','media','panic','psychology','myth','propaganda'],
    scope: 'global/media',
    cross_scope: false,
  },
  {
    id: 'rupert_murdoch',
    label: 'Rupert Murdoch',
    node_type: 'reference',
    category: 'person',
    wikipedia: 'https://en.wikipedia.org/wiki/Rupert_Murdoch',
    summary: 'Media mogul who built News Corp into a global empire including Fox News, The Sun, and The Wall Street Journal. Pioneered the model of ideologically aligned news as a political force multiplier. UK phone-hacking scandal exposed routine journalistic criminality. Fox News under his direction fundamentally reshaped US conservative media consumption and Republican Party politics.',
    decade: '1970s',
    tags: ['media','politics','conservative','fox-news','polarization'],
    scope: 'global/media',
    cross_scope: false,
  },
  {
    id: 'fox_news',
    label: 'Fox News',
    node_type: 'reference',
    category: 'institution',
    wikipedia: 'https://en.wikipedia.org/wiki/Fox_News',
    summary: 'US cable news channel launched 1996 by Murdoch with Roger Ailes as CEO. Positioned as a conservative alternative to perceived mainstream media bias. Became the dominant US news source for Republicans, shaping GOP primary politics, amplifying conspiratorial content, and — as revealed in Dominion Voting Systems litigation — internally questioning the claims its anchors publicly championed. Internal texts showed executives afraid that accurate reporting would lose audience.',
    decade: '1990s',
    tags: ['media','conservative','politics','polarization','propaganda','usa'],
    scope: 'global/media',
    cross_scope: false,
  },
  {
    id: 'cambridge_analytica',
    label: 'Cambridge Analytica',
    node_type: 'reference',
    category: 'institution',
    wikipedia: 'https://en.wikipedia.org/wiki/Cambridge_Analytica',
    summary: 'Political data firm that harvested personal data from ~87 million Facebook profiles without consent via a third-party app loophole. Used psychographic profiling (OCEAN model) to micro-target political advertising. Employed in the 2016 Trump campaign and UK Brexit referendum campaign. Disbanded after whistleblower Christopher Wylie\'s exposé. Demonstrated how platform data architecture could be weaponised for political manipulation.',
    decade: '2010s',
    tags: ['data','manipulation','politics','social-media','facebook','privacy','elections'],
    scope: 'global/media',
    cross_scope: false,
  },
  {
    id: 'qanon',
    label: 'QAnon',
    node_type: 'reference',
    category: 'movement',
    wikipedia: 'https://en.wikipedia.org/wiki/QAnon',
    summary: 'Anonymous internet conspiracy theory (started 2017 on 4chan) claiming a secret Satanic paedophile cabal of Democratic politicians and celebrities was being fought by Donald Trump. Spread via algorithmic recommendation on YouTube and Facebook, integrated existing anti-Semitic "blood libel" tropes, and radicalised adherents into real-world violence. Illustrates how social media platforms can transform fringe anonymous content into a mass movement within years.',
    decade: '2010s',
    tags: ['conspiracy','extremism','social-media','disinformation','radicalization','antisemitism','usa'],
    scope: 'global/media',
    cross_scope: false,
  },
  {
    id: 'deepfakes',
    label: 'Deepfakes & Synthetic Media',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Deepfake',
    summary: 'AI-generated synthetic audio-visual media that realistically depicts real people saying or doing things they never did. Non-consensual sexual deepfakes (~96% of deepfake content as of 2019) disproportionately target women. Political deepfakes threaten to make video evidence epistemically worthless. The societal danger may be less from fake footage being believed than from real footage being disbelieved ("liar\'s dividend").',
    decade: '2010s',
    tags: ['ai','technology','disinformation','manipulation','trust','media'],
    scope: 'global/media',
    cross_scope: false,
  },
  {
    id: 'rt_russia_today',
    label: 'RT (Russia Today)',
    node_type: 'reference',
    category: 'institution',
    wikipedia: 'https://en.wikipedia.org/wiki/RT_(TV_network)',
    summary: 'Russian state-funded international television network launched 2005. Denied being state propaganda while consistently amplifying Kremlin-aligned narratives: anti-NATO, anti-EU, pro-Brexit, pro-far-right parties, and anti-vaccine content. Used Western free-press infrastructure against itself — achieving YouTube and cable distribution before bans following the 2022 Ukraine invasion. Exemplifies "firehose of falsehood" doctrine: not persuade but confuse.',
    decade: '2000s',
    tags: ['russia','propaganda','disinformation','state-media','information-warfare'],
    scope: 'global/media',
    cross_scope: false,
  },
];

const newMediaEdges = [
  { id: 'walter_lippmann__edward_bernays', source: 'walter_lippmann', target: 'edward_bernays', type: 'ENABLED', label: 'Lippmann\'s theory legitimised Bernays\'s practice', note: 'Bernays cited Lippmann as a key intellectual influence; both operated from the same premise that the public required guided management.', confidence: 'high' },
  { id: 'edward_bernays__joseph_goebbels', source: 'edward_bernays', target: 'joseph_goebbels', type: 'ENABLED', label: 'Bernays\'s techniques were adapted by Nazi propaganda', note: 'Goebbels reportedly read Bernays\'s Propaganda and kept it on his desk; the irony that Bernays was Jewish was not lost on him.', confidence: 'high' },
  { id: 'printing_press__yellow_journalism', source: 'printing_press', target: 'yellow_journalism', type: 'ENABLED', label: 'mass print infrastructure made newspaper wars possible', confidence: 'medium' },
  { id: 'rupert_murdoch__fox_news', source: 'rupert_murdoch', target: 'fox_news', type: 'PRODUCED', label: 'founded and controlled editorial direction', confidence: 'high' },
  { id: 'fox_news__qanon', source: 'fox_news', target: 'qanon', type: 'ENABLED', label: 'amplified conspiratorial content that fed QAnon ecosystem', confidence: 'high' },
  { id: 'cambridge_analytica__qanon', source: 'cambridge_analytica', target: 'qanon', type: 'SHARES_MECHANISM_WITH', label: 'both exploit psychographic profiling and social media algorithms', confidence: 'medium' },
  { id: 'war_of_worlds_broadcast__moral_panic', source: 'war_of_worlds_broadcast', target: 'moral_panic', type: 'PRODUCED', label: 'became canonical example of media-induced mass panic', confidence: 'medium' },
  { id: 'deepfakes__broken_epistemology', source: 'deepfakes', target: 'broken_epistemology', type: 'CAUSED', label: 'synthetic media erodes trust in audiovisual evidence', confidence: 'high' },
  { id: 'rt_russia_today__broken_epistemology', source: 'rt_russia_today', target: 'broken_epistemology', type: 'CAUSED', label: 'firehose-of-falsehood strategy targets epistemic infrastructure', confidence: 'high' },
  { id: 'filter_bubble__qanon', source: 'filter_bubble', target: 'qanon', type: 'ENABLED', label: 'algorithmic recommendation accelerated QAnon radicalisation', confidence: 'high' },
  { id: 'yellow_journalism__moral_panic', source: 'yellow_journalism', target: 'moral_panic', type: 'SHARES_MECHANISM_WITH', label: 'both amplify threat narratives for audience-building', confidence: 'high' },
  { id: 'edward_bernays__corporate_regulatory_capture', source: 'edward_bernays', target: 'corporate_regulatory_capture', type: 'ENABLED', label: 'PR industry provided corporate capture its persuasion infrastructure', confidence: 'high' },
];

// ════════════════════════════════════════════════════════════════════════════
// 3. HEALTH SCOPE
// ════════════════════════════════════════════════════════════════════════════
const newHealthNodes = [
  {
    id: 'opioid_crisis',
    label: 'Opioid Epidemic',
    node_type: 'reference',
    category: 'event',
    wikipedia: 'https://en.wikipedia.org/wiki/Opioid_epidemic_in_the_United_States',
    summary: 'Three waves of overdose deaths beginning in the 1990s: prescription opioids, then heroin, then fentanyl. Over 500,000 deaths in the US 1999–2019. Driven by pharmaceutical companies\' aggressive marketing of opioids as non-addictive, regulatory failures, and the "pain management" ideology that incentivised heavy prescription. The crisis disproportionately struck deindustrialised communities with collapsed social infrastructure.',
    decade: '1990s',
    tags: ['opioids','public-health','pharmaceutical','addiction','usa','regulation'],
    scope: 'global/health',
    cross_scope: false,
  },
  {
    id: 'purdue_pharma',
    label: 'Purdue Pharma & the Sackler Family',
    node_type: 'reference',
    category: 'institution',
    wikipedia: 'https://en.wikipedia.org/wiki/Purdue_Pharma',
    summary: 'Pharmaceutical company that marketed OxyContin from 1996 with deliberate misrepresentations about its addiction potential. Internal documents showed executives knew of diversion and addiction. The Sackler family extracted billions before bankruptcy while the company was fined. Epitomises the capture of medical regulation, academic research, and prescribing culture by pharmaceutical commercial interests.',
    decade: '1990s',
    tags: ['pharmaceutical','opioids','corruption','lobbying','addiction','corporate'],
    scope: 'global/health',
    cross_scope: false,
  },
  {
    id: 'aids_crisis',
    label: 'AIDS Crisis (1980s–90s)',
    node_type: 'reference',
    category: 'event',
    wikipedia: 'https://en.wikipedia.org/wiki/HIV/AIDS_in_the_United_States',
    summary: 'The Reagan administration\'s deliberate inaction during the early AIDS epidemic — when the virus was wrongly coded as a "gay disease" — allowed preventable mass death. ACT UP\'s militant activism forced FDA approval acceleration, transforming drug-approval timelines permanently. The crisis exposed how social stigma is encoded in public health responses, with moral judgements determining whose deaths receive institutional urgency.',
    decade: '1980s',
    tags: ['aids','lgbtq','public-health','stigma','activism','government','usa'],
    scope: 'global/health',
    cross_scope: false,
  },
  {
    id: 'anti_vaccination_movement',
    label: 'Anti-Vaccination Movement',
    node_type: 'reference',
    category: 'movement',
    wikipedia: 'https://en.wikipedia.org/wiki/Anti-vaccine_activism',
    summary: 'Movement opposing vaccination, with modern form catalysed by Andrew Wakefield\'s fraudulent 1998 Lancet paper linking MMR vaccine to autism (retracted 2010, Wakefield struck off). Despite debunking, anti-vax beliefs spread through social media networks, celebrity amplification, and distrust of pharmaceutical companies. Re-emergence of measles in high-coverage populations demonstrated real public health consequences.',
    decade: '1990s',
    tags: ['vaccines','conspiracy','public-health','misinformation','social-media','autism'],
    scope: 'global/health',
    cross_scope: false,
  },
  {
    id: 'deinstitutionalization',
    label: 'Psychiatric Deinstitutionalization',
    node_type: 'reference',
    category: 'event',
    wikipedia: 'https://en.wikipedia.org/wiki/Deinstitutionalization',
    summary: 'The large-scale closure of psychiatric hospitals from the 1960s–80s, driven by a combination of civil rights concerns about institutional abuse, the new availability of antipsychotic drugs, fiscal conservatism, and critiques of psychiatry by figures like Thomas Szasz and R.D. Laing. Community mental health infrastructure was never built to replace institutions. Resulted in mass homelessness and incarceration of people with severe mental illness — the "transinstitutionalisation" thesis.',
    decade: '1960s',
    tags: ['mental-health','policy','homelessness','psychiatry','deinstitutionalization'],
    scope: 'global/health',
    cross_scope: false,
  },
  {
    id: 'leaded_gasoline_cover_up',
    label: 'Leaded Gasoline & Corporate Science Denial',
    node_type: 'reference',
    category: 'event',
    wikipedia: 'https://en.wikipedia.org/wiki/Tetraethyllead',
    summary: 'Tetraethyl lead was added to gasoline from 1923 despite immediate worker deaths and the available lead-free alternative. The lead industry funded fraudulent science, intimidated researchers, and captured the Bureau of Mines for decades. Robert Kehoe\'s Kehoe Principle — that something must be proven harmful before regulation — inverted the precautionary principle. This model (fund science to create doubt) was later adopted by tobacco, fossil fuels, and other industries. Lead\'s cognitive effects may have contributed to the crime wave and drop of the 20th century.',
    decade: '1920s',
    tags: ['lead','corporate-fraud','public-health','science-denial','regulation'],
    scope: 'global/health',
    cross_scope: false,
  },
  {
    id: 'lobotomy_era',
    label: 'Lobotomy Era (Psychosurgery)',
    node_type: 'reference',
    category: 'event',
    wikipedia: 'https://en.wikipedia.org/wiki/Lobotomy',
    summary: 'Walter Freeman\'s transorbital lobotomy (1946) was performed on ~50,000 Americans and spread globally as psychiatric treatment. Freeman received the Nobel Prize (1949) before evidence of harm was systematically documented. The procedure was promoted as a cure for mental illness but primarily served to pacify difficult patients in overcrowded institutions. Exemplifies how medicine can adopt interventions without adequate evidence, powered by institutional convenience and Nobel-Prize-level authority.',
    decade: '1940s',
    tags: ['psychiatry','medicine','history','abuse','institutions'],
    scope: 'global/health',
    cross_scope: false,
  },
  {
    id: 'big_pharma_lobbying',
    label: 'Pharmaceutical Industry Lobbying',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Pharmaceutical_lobby',
    summary: 'The pharmaceutical industry is consistently the largest lobbying spender in US politics, outspending defence and oil. Lobbying extends to shaping FDA personnel and processes, funding medical education (CME), sponsoring clinical trials with publication bias toward positive results, and revolving-door employment of regulators. The result is a healthcare system optimised for drug sales rather than health outcomes.',
    decade: '1980s',
    tags: ['lobbying','pharmaceutical','regulation','corruption','healthcare'],
    scope: 'global/health',
    cross_scope: false,
  },
  {
    id: 'thalidomide_scandal',
    label: 'Thalidomide Scandal (1957–62)',
    node_type: 'reference',
    category: 'event',
    wikipedia: 'https://en.wikipedia.org/wiki/Thalidomide',
    summary: 'Thalidomide, marketed in 46 countries as a sedative and morning sickness treatment, caused ~10,000 birth defects (phocomelia). FDA officer Frances Kelsey blocked US approval based on inadequate safety data, saving thousands. The scandal directly caused the 1962 Kefauver-Harris Amendment requiring proof of efficacy and adequate safety trials before drug approval — fundamentally transforming pharmaceutical regulation.',
    decade: '1950s',
    tags: ['pharmaceutical','regulation','medicine','birth-defects','fda'],
    scope: 'global/health',
    cross_scope: false,
  },
];

const newHealthEdges = [
  { id: 'pain_management_movement__opioid_crisis', source: 'pain_management_movement', target: 'opioid_crisis', type: 'CAUSED', label: '"pain as fifth vital sign" normalised opioid overprescription', confidence: 'high' },
  { id: 'purdue_pharma__opioid_crisis', source: 'purdue_pharma', target: 'opioid_crisis', type: 'CAUSED', label: 'OxyContin mismarketing directly drove prescription opioid wave', confidence: 'high' },
  { id: 'purdue_pharma__pain_management_movement', source: 'purdue_pharma', target: 'pain_management_movement', type: 'ENABLED', label: 'funded and shaped the pain management ideology', confidence: 'high' },
  { id: 'american_eugenics_movement__tuskegee_syphilis_study', source: 'american_eugenics_movement', target: 'tuskegee_syphilis_study', type: 'ENABLED', label: 'eugenicist ideology made Black subjects available for non-consensual experimentation', confidence: 'high' },
  { id: 'tuskegee_syphilis_study__anti_vaccination_movement', source: 'tuskegee_syphilis_study', target: 'anti_vaccination_movement', type: 'ENABLED', label: 'documented federal medical abuse fuelled lasting Black distrust of public health', confidence: 'high' },
  { id: 'big_pharma_lobbying__purdue_pharma', source: 'big_pharma_lobbying', target: 'purdue_pharma', type: 'ENABLED', label: 'industry-captured regulation allowed OxyContin mismarketing', confidence: 'high' },
  { id: 'big_pharma_lobbying__opioid_crisis', source: 'big_pharma_lobbying', target: 'opioid_crisis', type: 'ENABLED', label: 'blocked regulation and funded advocacy for expanded prescribing', confidence: 'high' },
  { id: 'deinstitutionalization__opioid_crisis', source: 'deinstitutionalization', target: 'opioid_crisis', type: 'ENABLED', label: 'destroyed community mental health infrastructure that could have caught addiction', confidence: 'medium' },
  { id: 'lobotomy_era__deinstitutionalization', source: 'lobotomy_era', target: 'deinstitutionalization', type: 'CAUSED', label: 'institutional psychiatric abuse drove civil rights backlash and closure movement', confidence: 'high' },
  { id: 'leaded_gasoline_cover_up__corporate_regulatory_capture', source: 'leaded_gasoline_cover_up', target: 'corporate_regulatory_capture', type: 'PRODUCED', label: 'invented the doubt-manufacturing playbook for regulatory capture', confidence: 'high' },
  { id: 'thalidomide_scandal__american_eugenics_movement', source: 'thalidomide_scandal', target: 'american_eugenics_movement', type: 'SHARES_MECHANISM_WITH', label: 'both involve non-consensual use of vulnerable populations as experimental subjects', confidence: 'medium' },
  { id: 'aids_crisis__american_eugenics_movement', source: 'aids_crisis', target: 'american_eugenics_movement', type: 'SHARES_MECHANISM_WITH', label: 'government inaction in both cases reflects devaluation of marginalised lives', confidence: 'medium' },
];

// ════════════════════════════════════════════════════════════════════════════
// 4. PSYCHOLOGY SCOPE
// ════════════════════════════════════════════════════════════════════════════
const newPsychNodes = [
  {
    id: 'jordan_peterson',
    label: 'Jordan Peterson',
    node_type: 'reference',
    category: 'person',
    wikipedia: 'https://en.wikipedia.org/wiki/Jordan_Peterson',
    summary: 'Canadian clinical psychologist who became a global media figure following his 2016 refusal to use Bill C-16 pronouns. His YouTube lectures on Jungian archetypes, biblical symbolism, and personal responsibility attracted millions. His work is contested: supporters see practical self-improvement philosophy; critics see a palatable gateway to far-right gender and racial hierarchies. His personal struggles with benzodiazepine dependency complicated his self-help authority.',
    decade: '2010s',
    tags: ['psychology','masculinity','politics','self-help','culture-war','online'],
    scope: 'global/psychology',
    cross_scope: false,
  },
  {
    id: 'red_pill_community',
    label: 'Red Pill / Manosphere',
    node_type: 'reference',
    category: 'movement',
    wikipedia: 'https://en.wikipedia.org/wiki/Manosphere',
    summary: 'Loosely connected online communities (Reddit r/TheRedPill, 4chan) that claim to expose "uncomfortable truths" about gender, sexual dynamics, and social hierarchy hidden by feminism and mainstream culture. Ranges from self-improvement advice (lifting, stoicism) to misogynistic theory of female nature and "hypergamy." Gateway to more extreme movements including incels and far-right radicalisation. Named from The Matrix: the red pill as truth vs. comfortable blue-pill illusion.',
    decade: '2010s',
    tags: ['masculinity','online','radicalization','misogyny','gender','community'],
    scope: 'global/psychology',
    cross_scope: false,
  },
  {
    id: 'mgtow',
    label: 'MGTOW (Men Going Their Own Way)',
    node_type: 'reference',
    category: 'movement',
    wikipedia: 'https://en.wikipedia.org/wiki/Men_Going_Their_Own_Way',
    summary: 'Online movement advocating male withdrawal from romantic relationships with women, framed as escaping feminist oppression. Ranges from self-sufficiency philosophy (MGTOW "monk mode") to deep misogyny. Grew on YouTube and Reddit, partially overlaps with incel and red pill communities. Represents a response to perceived loss of traditional male social roles in changed economic and cultural conditions.',
    decade: '2010s',
    tags: ['masculinity','online','misogyny','gender','community','mgtow'],
    scope: 'global/psychology',
    cross_scope: false,
  },
  {
    id: 'pua_community',
    label: 'Pick-Up Artist (PUA) Community',
    node_type: 'reference',
    category: 'movement',
    wikipedia: 'https://en.wikipedia.org/wiki/Pickup_artist',
    summary: 'Subculture of men who use scripted techniques to achieve sexual success. Systematised by Neil Strauss\'s The Game (2005) and community figures like Mystery. Conceptualises seduction as a manipulative skill set using negging, false scarcity, and social proof. Preceded the broader manosphere and contributed its framework of women as targets of competitive male strategy. Critics argue it normalises coercion; defenders frame it as honest self-improvement.',
    decade: '2000s',
    tags: ['masculinity','gender','manipulation','community','online','misogyny'],
    scope: 'global/psychology',
    cross_scope: false,
  },
  {
    id: 'self_help_industry',
    label: 'Self-Help Industry',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Self-help',
    summary: 'A $11+ billion US industry of books, seminars, podcasts, and coaching promising personal transformation. Structural features: advice that is unfalsifiable (any failure is the reader\'s fault), perpetual consumption (each book promises what the last didn\'t deliver), and pathologising normal life struggles as individual deficiencies. The industry monetises precarity by reframing systemic problems (job insecurity, social isolation) as personal failures requiring personal solutions.',
    decade: '1980s',
    tags: ['self-help','capitalism','psychology','culture','individualism'],
    scope: 'global/psychology',
    cross_scope: false,
  },
  {
    id: 'social_media_addiction',
    label: 'Social Media Addiction & Design',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Social_media_use_and_mental_health',
    summary: 'Social media platforms are deliberately engineered for compulsive use: variable ratio reinforcement (the same mechanism as slot machines) via unpredictable likes and notifications, infinite scroll eliminating natural stopping points, and social comparison metrics (follower counts, likes) that exploit status anxiety. Internal research at Facebook (leaked by Frances Haugen, 2021) showed awareness of harm to teen girls\' body image. The business model requires attention maximisation regardless of psychological cost.',
    decade: '2010s',
    tags: ['social-media','technology','addiction','mental-health','design','platforms'],
    scope: 'global/psychology',
    cross_scope: false,
  },
  {
    id: 'positive_psychology',
    label: 'Positive Psychology Movement',
    node_type: 'reference',
    category: 'movement',
    wikipedia: 'https://en.wikipedia.org/wiki/Positive_psychology',
    summary: 'Academic movement (Martin Seligman, Mihaly Csikszentmihalyi, from ~2000) studying wellbeing, flourishing, and strengths rather than pathology. Influenced corporate wellness programmes, positive thinking culture, and "happiness science." Critics argue it overclaims research findings, is deployed by corporations to manage workers rather than address working conditions, and its pop-psychology form blames depression on insufficient positivity.',
    decade: '2000s',
    tags: ['psychology','self-help','wellbeing','culture','corporations'],
    scope: 'global/psychology',
    cross_scope: false,
  },
  {
    id: 'cult_dynamics',
    label: 'Cult Dynamics & Thought Reform',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Cult',
    summary: 'Robert Lifton\'s criteria for thought reform environments: milieu control, mystical manipulation, demand for purity, confession, sacred science, loading the language, doctrine over person, dispensing of existence. These patterns appear in religious cults, MLM organisations, political movements, and certain corporate cultures. Steven Hassan\'s BITE model (Behaviour, Information, Thought, Emotional control) provides a framework for identifying coercive control in any organisation.',
    decade: '1960s',
    tags: ['cults','coercion','psychology','control','identity','groups'],
    scope: 'global/psychology',
    cross_scope: false,
  },
  {
    id: 'trauma_bonding',
    label: 'Trauma Bonding & Stockholm Syndrome',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Trauma_bonding',
    summary: 'The psychological attachment that forms between a victim and abuser, reinforced by cycles of abuse and intermittent reward. Patrick Carnes identified this in domestic abuse; "Stockholm syndrome" (1973 bank siege) named the phenomenon in hostage situations. The same mechanism operates in high-control groups, coercive romantic relationships, and certain institutional environments. Intermittent reinforcement is more powerful than consistent reward in creating compulsive attachment.',
    decade: '1970s',
    tags: ['psychology','abuse','coercion','attachment','relationships'],
    scope: 'global/psychology',
    cross_scope: false,
  },
];

const newPsychEdges = [
  { id: 'incel_community__red_pill_community', source: 'incel_community', target: 'red_pill_community', type: 'FRAGMENTED_INTO', label: 'incels emerged from and radicalised beyond red pill framework', confidence: 'high' },
  { id: 'red_pill_community__mgtow', source: 'red_pill_community', target: 'mgtow', type: 'PRODUCED', label: 'red pill ideology produced withdrawal variant', confidence: 'high' },
  { id: 'pua_community__red_pill_community', source: 'pua_community', target: 'red_pill_community', type: 'PRODUCED', label: 'PUA community evolved into the broader red pill worldview', confidence: 'high' },
  { id: 'red_pill_community__incel_community', source: 'red_pill_community', target: 'incel_community', type: 'ENABLED', label: 'red pill framework provided ideology for incel grievance', confidence: 'high' },
  { id: 'social_media_addiction__red_pill_community', source: 'social_media_addiction', target: 'red_pill_community', type: 'ENABLED', label: 'engagement-maximising algorithms recommended radicalising content', confidence: 'high' },
  { id: 'social_media_addiction__qanon', source: 'social_media_addiction', target: 'qanon', type: 'ENABLED', label: 'compulsive platform use and recommendation loops spread QAnon', confidence: 'high' },
  { id: 'self_help_industry__positive_psychology', source: 'self_help_industry', target: 'positive_psychology', type: 'EXPLOITED', label: 'pop-self-help colonised academic positive psychology findings', confidence: 'high' },
  { id: 'jordan_peterson__red_pill_community', source: 'jordan_peterson', target: 'red_pill_community', type: 'ENABLED', label: 'provided academic-adjacent legitimacy for red pill ideas about hierarchy', confidence: 'high' },
  { id: 'sigmund_freud__jordan_peterson', source: 'sigmund_freud', target: 'jordan_peterson', type: 'ENABLED', label: 'Jungian/Freudian archetypes form core of Peterson\'s intellectual framework', confidence: 'high' },
  { id: 'milgram_obedience_experiments__groupthink', source: 'milgram_obedience_experiments', target: 'groupthink', type: 'SHARES_MECHANISM_WITH', label: 'both demonstrate how institutional authority overrides individual moral judgment', confidence: 'high' },
  { id: 'cult_dynamics__identity_capture', source: 'cult_dynamics', target: 'identity_capture', type: 'SHARES_MECHANISM_WITH', label: 'cult dynamics represent the extreme of identity capture mechanisms', confidence: 'high' },
  { id: 'trauma_bonding__cult_dynamics', source: 'trauma_bonding', target: 'cult_dynamics', type: 'ENABLED', label: 'abuse-reward cycles in cults create persistent loyalty despite harm', confidence: 'high' },
  { id: 'cognitive_dissonance__cult_dynamics', source: 'cognitive_dissonance', target: 'cult_dynamics', type: 'ENABLED', label: 'heavy investment and sunk costs make members rationalise rather than exit', confidence: 'high' },
  { id: 'positive_psychology__self_help_industry', source: 'positive_psychology', target: 'self_help_industry', type: 'ENABLED', label: 'scientific veneer gave self-help marketers credible language', confidence: 'high' },
];

// ════════════════════════════════════════════════════════════════════════════
// APPLY ALL CHANGES
// ════════════════════════════════════════════════════════════════════════════
let totalNodes = 0, totalEdges = 0;

// Mechanisms
{
  const nodes = load('mechanisms/nodes.json');
  const edges = load('mechanisms/edges.json');
  totalNodes += addNodes(nodes, newMechNodes);
  totalEdges += addEdges(edges, newMechEdges);
  save('mechanisms/nodes.json', nodes);
  save('mechanisms/edges.json', edges);
  console.log(`mechanisms: ${nodes.length} nodes, ${edges.length} edges`);
}

// Media
{
  const nodes = load('global/media/nodes.json');
  const edges = load('global/media/edges.json');
  totalNodes += addNodes(nodes, newMediaNodes);
  totalEdges += addEdges(edges, newMediaEdges);
  save('global/media/nodes.json', nodes);
  save('global/media/edges.json', edges);
  console.log(`media: ${nodes.length} nodes, ${edges.length} edges`);
}

// Health
{
  const nodes = load('global/health/nodes.json');
  const edges = load('global/health/edges.json');
  totalNodes += addNodes(nodes, newHealthNodes);
  totalEdges += addEdges(edges, newHealthEdges);
  save('global/health/nodes.json', nodes);
  save('global/health/edges.json', edges);
  console.log(`health: ${nodes.length} nodes, ${edges.length} edges`);
}

// Psychology
{
  const nodes = load('global/psychology/nodes.json');
  const edges = load('global/psychology/edges.json');
  totalNodes += addNodes(nodes, newPsychNodes);
  totalEdges += addEdges(edges, newPsychEdges);
  save('global/psychology/nodes.json', nodes);
  save('global/psychology/edges.json', edges);
  console.log(`psychology: ${nodes.length} nodes, ${edges.length} edges`);
}

console.log(`\nAdded: ${totalNodes} nodes, ${totalEdges} edges`);

// Cross-check: any edge targets that don't exist in any scope
{
  const allIds = new Set();
  const scopes = ['mechanisms','global/media','global/health','global/psychology','global/politics','global/history','global'];
  for (const s of scopes) {
    try { load(s + '/nodes.json').forEach(n => allIds.add(n.id)); } catch(e) {}
  }
  const allEdgeFiles = ['mechanisms','global/media','global/health','global/psychology','global/politics','global/history','global'];
  let orphans = 0;
  for (const s of allEdgeFiles) {
    try {
      const edges = load(s + '/edges.json');
      for (const e of edges) {
        if (!allIds.has(e.source)) { console.warn('Orphan source:', e.source, 'in', s); orphans++; }
        if (!allIds.has(e.target)) { console.warn('Orphan target:', e.target, 'in', s); orphans++; }
      }
    } catch(ex) {}
  }
  if (!orphans) console.log('Edge integrity: OK (0 orphans)');
  else console.error('Edge integrity: ' + orphans + ' orphans found');
}
