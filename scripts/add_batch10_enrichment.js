#!/usr/bin/env node
// add_batch10_enrichment.js — boost low-degree nodes + add Pinochet/Chile, Brexit,
//   Universal Declaration of Human Rights, 2008 financial crisis, George Orwell,
//   Bay of Pigs, more cross-scope edges
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const pn = JSON.parse(fs.readFileSync(D('data/global/politics/nodes.json')));
const hn = JSON.parse(fs.readFileSync(D('data/global/history/nodes.json')));
const mn = JSON.parse(fs.readFileSync(D('data/mechanisms/nodes.json')));
const psn = JSON.parse(fs.readFileSync(D('data/global/psychology/nodes.json')));
const medn = JSON.parse(fs.readFileSync(D('data/global/media/nodes.json')));
const hln = JSON.parse(fs.readFileSync(D('data/global/health/nodes.json')));

const pe = JSON.parse(fs.readFileSync(D('data/global/politics/edges.json')));
const he = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const pse = JSON.parse(fs.readFileSync(D('data/global/psychology/edges.json')));
const mede = JSON.parse(fs.readFileSync(D('data/global/media/edges.json')));
const hle = JSON.parse(fs.readFileSync(D('data/global/health/edges.json')));

const pnIds = new Set(pn.map(n=>n.id));
const hnIds = new Set(hn.map(n=>n.id));
const mnIds = new Set(mn.map(n=>n.id));
const psnIds = new Set(psn.map(n=>n.id));
const mednIds = new Set(medn.map(n=>n.id));
const hlnIds = new Set(hln.map(n=>n.id));
const peIds = new Set(pe.map(e=>e.id));
const heIds = new Set(he.map(e=>e.id));
const meIds = new Set(me.map(e=>e.id));
const pseIds = new Set(pse.map(e=>e.id));
const medeIds = new Set(mede.map(e=>e.id));
const hleIds = new Set(hle.map(e=>e.id));

// ── New Politics nodes ────────────────────────────────────────────────────
const newPolitNodes = [
  {
    id: 'brexit',
    label: 'Brexit',
    node_type: 'event',
    category: 'event',
    decade: '2010s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Brexit',
    summary: 'UK withdrawal from the European Union (2016 referendum, completed 2020); driven by immigration anxiety, sovereignty sentiment, and Leave campaign disinformation; produced economic damage, Irish border crisis, and template for right-wing populist anti-EU politics.',
    tags: ['eu', 'uk', 'referendum', 'right-wing populism', 'sovereignty', 'immigration', 'Boris Johnson', 'Nigel Farage']
  },
  {
    id: 'human_rights_declaration',
    label: 'Universal Declaration of Human Rights',
    node_type: 'institution',
    category: 'institution',
    decade: '1940s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Universal_Declaration_of_Human_Rights',
    summary: 'UN document (1948) establishing universal human rights as international norm; drafted in response to Holocaust; foundation of international human rights law though not legally binding; Eleanor Roosevelt chaired drafting committee.',
    tags: ['human rights', 'UN', 'eleanor roosevelt', '1948', 'post-WWII', 'international law', 'genocide prevention']
  },
  {
    id: 'financial_crisis_2008',
    label: '2008 Financial Crisis',
    node_type: 'event',
    category: 'event',
    decade: '2000s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Financial_crisis_of_2007%E2%80%932008',
    summary: 'Global financial collapse triggered by US subprime mortgage market failure; produced the Great Recession (2008-2012); $13 trillion in household wealth destroyed in the US; banks bailed out, homeowners foreclosed; produced Occupy, Tea Party, and eventual populist backlash.',
    tags: ['financial crisis', 'recession', 'subprime', 'mortgage', 'derivatives', 'bank bailout', 'foreclosure', 'inequality']
  },
];

// ── New History nodes ─────────────────────────────────────────────────────
const newHistNodes = [
  {
    id: 'chile_coup_1973',
    label: 'Chile 1973 Coup (Pinochet)',
    node_type: 'event',
    category: 'event',
    decade: '1970s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/1973_Chilean_coup_d%27%C3%A9tat',
    summary: 'CIA-backed military coup against democratically elected socialist President Salvador Allende; General Pinochet\'s 17-year military dictatorship killed 3,000+, tortured 40,000+; implemented neoliberal "Chicago Boys" economic policies; became Cold War proxy war archetype.',
    tags: ['chile', 'pinochet', 'allende', 'coup', 'CIA', 'neoliberalism', 'dirty war', 'chicago boys', 'cold war']
  },
  {
    id: 'bay_of_pigs',
    label: 'Bay of Pigs Invasion',
    node_type: 'event',
    category: 'event',
    decade: '1960s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Bay_of_Pigs_Invasion',
    summary: 'CIA-trained Cuban exile invasion of Cuba (April 1961), authorized by Kennedy; catastrophically failed; strengthened Castro\'s government and drove Cuba into Soviet alliance; contributed to Soviet perception of Kennedy weakness that enabled Cuban Missile Crisis.',
    tags: ['Cuba', 'CIA', 'Kennedy', 'cold war', 'covert operation', 'exile', 'failure', '1961']
  },
  {
    id: 'george_orwell',
    label: 'George Orwell',
    node_type: 'person',
    category: 'person',
    decade: '1940s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/George_Orwell',
    summary: 'British author whose "1984" (totalitarian surveillance state) and "Animal Farm" (revolution betrayed by authoritarianism) became defining texts for understanding propaganda, surveillance, and authoritarian language; coined "doublethink," "newspeak," "memory hole."',
    tags: ['1984', 'animal farm', 'surveillance', 'totalitarianism', 'doublethink', 'newspeak', 'propaganda', 'literature']
  },
];

// ── Politics edges ────────────────────────────────────────────────────────
const newPolitEdges = [
  // Brexit
  { id: 'brexit__european_union',
    source: 'brexit', target: 'european_union', type: 'ENABLED',
    label: 'Brexit challenged the EU project and triggered existential debates about European integration',
    note: 'Brexit was the most serious challenge to European integration since the EU\'s formation: a founding member state leaving demonstrated that EU membership was reversible; the referendum result drove EU reform debates about democratic deficit; subsequent near-Brexit votes in France (Le Pen) and Italy (Salvini) demonstrated Brexit\'s potential as right-wing populist model. Brexit also demonstrated the EU\'s negotiating leverage: the UK\'s economic damage from leaving was substantially larger than had been claimed during the campaign, partly because the EU proved more cohesive than Brexiteers expected. Brexit\'s economic damage (UK the only G7 economy smaller than pre-Brexit projected trajectory by 2023) became an argument for EU membership in other countries.',
    confidence: 'high' },
  { id: 'brexit__immigration_crisis',
    source: 'brexit', target: 'immigration_crisis', type: 'ENABLED',
    label: 'Immigration anxiety — particularly Eastern European EU freedom of movement and anti-Muslim sentiment — was the primary emotional driver of Brexit',
    note: 'Brexit was primarily an immigration vote: the "Take Back Control" slogan was explicitly about controlling immigration (EU freedom of movement had brought 3 million EU citizens to the UK); UKIP\'s "Breaking Point" poster showing refugees queued at a border deliberately conflated EU freedom of movement (primarily white Eastern Europeans) with refugee crisis (primarily Middle Eastern and African refugees); Farage acknowledged the poster was disgraceful even by his standards but it captured the emotional truth of the Leave campaign\'s demographic. The economic case for Brexit was always weak; the immigration case was strong among those who felt demographic change threatened their communities.',
    confidence: 'high' },
  { id: 'brexit__right_wing_populism',
    source: 'brexit', target: 'right_wing_populism', type: 'ENABLED',
    label: 'Brexit was both an expression of and accelerant for European right-wing populism',
    note: 'Brexit and European right-wing populism are mutually reinforcing: the Leave campaign used right-wing populist framing (people vs. elite/EU bureaucracy); the referendum result validated the populist political strategy across Europe; Marine Le Pen, Matteo Salvini, and Viktor Orban explicitly cited Brexit as inspiration; Trump called Brexit "your independence day." The Brexit result demonstrated that a right-wing populist political coalition (working-class economic anxiety + elderly cultural anxiety + business euroscepticism) could produce majority referendum outcomes. Brexit accelerated European right-wing populism by proving the formula worked.',
    confidence: 'high' },

  // UDHR
  { id: 'nuremberg_trials__human_rights_declaration',
    source: 'nuremberg_trials', target: 'human_rights_declaration', type: 'PRODUCED',
    label: 'Nuremberg established the principle that individual human rights transcend state sovereignty; the UDHR institutionalized this principle',
    note: 'The Nuremberg trials and UDHR are the twin institutional responses to the Holocaust: Nuremberg established that states cannot violate individual rights by claiming sovereign authority (crimes against humanity transcend state jurisdiction); the UDHR (1948) codified universal rights that all humans possess regardless of citizenship. Both were drafted simultaneously by overlapping teams; both drew on the specific horror of the Holocaust as the motivating case; both were products of the immediate post-war political moment when establishing international human rights norms was possible. Together they represent the post-WWII attempt to prevent future Holocausts through international law — with partial success.',
    confidence: 'high' },
  { id: 'human_rights_declaration__decolonization_movement',
    source: 'human_rights_declaration', target: 'decolonization_movement', type: 'ENABLED',
    label: 'The UDHR\'s universal rights principle was weaponized by colonized peoples against European powers who had drafted it with colonialism exempted',
    note: 'The UDHR was drafted with a fundamental hypocrisy: the European powers who championed universal rights maintained colonial empires that systematically violated those rights; the drafting excluded colonies from the rights framework. But colonized peoples used the UDHR\'s own language to demand independence: Ho Chi Minh quoted the Declaration of Independence and UDHR in Vietnamese independence declarations; African decolonization leaders invoked self-determination as a universal right; the UN framework the UDHR established created the institutional space for decolonization debates. The UDHR\'s gap between principle and colonial practice became an intellectual weapon that undermined colonialism\'s legitimacy.',
    confidence: 'high' },

  // 2008 financial crisis
  { id: 'financial_crisis_2008__neoliberalism',
    source: 'financial_crisis_2008', target: 'neoliberalism', type: 'ENABLED',
    label: 'The 2008 crisis was produced by three decades of neoliberal financial deregulation and the resulting shadow banking system',
    note: 'The 2008 financial crisis was a neoliberal policy failure: financial deregulation (Gramm-Leach-Bliley 1999 repealing Glass-Steagall; Commodity Futures Modernization Act 2000 exempting derivatives from regulation) enabled the shadow banking system; the "efficient market hypothesis" (prices always reflect true value, so bubbles are impossible) prevented regulators from seeing the housing bubble; regulatory capture of the SEC and federal bank regulators prevented enforcement of existing rules; the "too big to fail" problem was the direct result of allowing megabank consolidation. The crisis demonstrated that unregulated financial markets are inherently unstable — the Keynesian insight that neoliberalism had abandoned.',
    confidence: 'high' },
  { id: 'financial_crisis_2008__austerity',
    source: 'financial_crisis_2008', target: 'austerity', type: 'PRODUCED',
    label: 'The 2008 crisis and bank bailouts produced the debt conditions that austerity policy then imposed, punishing public services for private sector failure',
    note: 'The 2008 financial crisis produced austerity through a specific political mechanism: bank bailouts (TARP in the US, bank recapitalizations in Europe) converted private financial sector debt into public debt; governments then faced pressure to reduce the deficits created by bailouts and automatic stabilizers; neoliberal orthodoxy (austerity as the response to deficit) drove policy in Europe (EU/IMF/ECB troika) and the US (2010 Tea Party, 2011 deficit ceiling crisis); the result was that the financial sector that caused the crisis was protected while public services were cut. Austerity was the wrong policy response (as Keynesian economists argued throughout) — it prolonged recessions rather than enabling recovery.',
    confidence: 'high' },
  { id: 'financial_crisis_2008__right_wing_populism',
    source: 'financial_crisis_2008', target: 'right_wing_populism', type: 'PRODUCED',
    label: 'The 2008 financial crisis and bank bailouts while homeowners were foreclosed was the economic shock that produced Tea Party, MAGA, and Brexiteers',
    note: 'The 2008 financial crisis produced the populist backlash of the 2010s: the optics of $700 billion bank bailouts (TARP) while 10 million families were foreclosed produced legitimate rage at elite impunity; both Tea Party (right-wing populist, anti-government) and Occupy Wall Street (left-wing populist, anti-corporate) were immediate 2008-2010 responses; the Tea Party ultimately won the institutional battle (2010 midterms, 2016 Trump); MAGA\'s "drain the swamp" rhetoric is directly descended from 2008 bank bailout rage. The crisis delegitimized economic elites (banks, regulators, economists) — the same delegitimization that enables right-wing populism.',
    confidence: 'high' },
];

// ── History edges ─────────────────────────────────────────────────────────
const newHistEdges = [
  // Chile coup
  { id: 'central_intelligence_agency__chile_coup_1973',
    source: 'central_intelligence_agency', target: 'chile_coup_1973', type: 'ENABLED',
    label: 'The CIA organized and executed the 1973 Chilean coup against Allende through years of economic destabilization and military promotion',
    note: 'The CIA\'s role in the 1973 Chilean coup was systematic and documented (Church Committee, declassified State Department documents): Project FUBELT (approved by Nixon/Kissinger) authorized CIA operations to prevent Allende\'s inauguration (1970) and then destabilize his government (1971-73); the CIA funded opposition media (El Mercurio), supported strike organizers, promoted anti-Allende sentiment in the military; the 1973 coup was carried out by Pinochet with CIA support. Chile 1973 became the definitive case study in US Cold War covert regime change against a democratic socialist government. The "economic disruption" that preceded the coup (making the economy "scream" per Kissinger) was deliberately organized to create the conditions for military intervention.',
    confidence: 'high' },
  { id: 'chile_coup_1973__neoliberalism',
    source: 'chile_coup_1973', target: 'neoliberalism', type: 'PRODUCED',
    label: 'Pinochet\'s Chile was the first real-world experiment in neoliberal economic policy, implemented through military dictatorship',
    note: 'The Pinochet regime\'s economic policy was a planned neoliberal experiment: Milton Friedman and the "Chicago Boys" (Chilean economists trained at University of Chicago) implemented comprehensive neoliberal reforms — privatization, deregulation, free trade, pension privatization — in Chile before they were adopted elsewhere. Chile under Pinochet became the neoliberal template: the economic reforms that Reagan and Thatcher later implemented in democracies were first tested under military dictatorship. The experiment\'s requirement for authoritarian enforcement is revealing — implementing neoliberal reforms comprehensively required eliminating the democratic opposition that would otherwise have prevented them. Pinochet\'s Chile demonstrated that neoliberalism, in its full form, was not compatible with democracy.',
    confidence: 'high' },

  // Bay of Pigs
  { id: 'central_intelligence_agency__bay_of_pigs',
    source: 'central_intelligence_agency', target: 'bay_of_pigs', type: 'PRODUCED',
    label: 'The CIA trained, organized, and led the Bay of Pigs invasion, then failed to provide the air support that might have made it succeed',
    note: 'The Bay of Pigs was a CIA operation from inception: Eisenhower authorized CIA training of Cuban exiles (1960); Kennedy inherited and approved the plan reluctantly; the CIA\'s operational plan assumed either air superiority (which Kennedy refused to provide to maintain deniability) or a popular uprising against Castro (which did not occur). The failure combined CIA operational incompetence (tactical planning failures), Kennedy\'s political caution (withdrawing air support), and the plan\'s fundamental misreading of Cuban politics (overestimating anti-Castro sentiment). The Bay of Pigs failure was significant for multiple reasons: it strengthened Castro; it damaged Kennedy\'s credibility with Khrushchev; it convinced Kennedy to rely less on CIA advice, contributing to his management of the subsequent Missile Crisis.',
    confidence: 'high' },
  { id: 'bay_of_pigs__cuban_missile_crisis',
    source: 'bay_of_pigs', target: 'cuban_missile_crisis', type: 'PRODUCED',
    label: 'Bay of Pigs failure drove Cuba into Soviet military alliance, directly enabling the Soviet missile deployment that caused the Missile Crisis',
    note: 'The causal chain from Bay of Pigs to Cuban Missile Crisis is direct: the US invasion attempt confirmed Cuba\'s need for Soviet military protection; Soviet missile deployment to Cuba was explicitly justified as deterring a second US invasion; Khrushchev\'s perception of Kennedy\'s weakness (demonstrated by Bay of Pigs failure and subsequent Vienna summit) made him willing to risk the deployment. Without the Bay of Pigs, Cuba might not have sought Soviet missiles; without Cuba having sought Soviet missiles, the Missile Crisis might not have occurred. The Missile Crisis was partly produced by CIA operational failure.',
    confidence: 'high' },

  // George Orwell
  { id: 'george_orwell__propaganda',
    source: 'george_orwell', target: 'propaganda', type: 'ENABLED',
    label: 'Orwell\'s "1984" and "Animal Farm" provided the conceptual vocabulary for understanding propaganda and totalitarian language',
    note: '"1984" (1949) and "Animal Farm" (1945) gave political culture concepts that have become essential for propaganda analysis: "newspeak" (language designed to prevent thought rather than enable it); "doublethink" (holding contradictory beliefs simultaneously); "memory hole" (systematic destruction of historical records); "two minutes hate" (ritualized emotional manipulation); "Oceania has always been at war with Eurasia" (constant historical revision). These concepts function as diagnostic tools — when political discourse exhibits these patterns, Orwell\'s framework enables recognition. Orwell himself was a Spanish Civil War veteran who had experienced both fascist and Stalinist propaganda; his concepts were inductively derived from observation.',
    confidence: 'high' },
  { id: 'george_orwell__surveillance_state',
    source: 'george_orwell', target: 'surveillance_state', type: 'ENABLED',
    label: '"1984"\'s "Big Brother is watching you" made surveillance the defining metaphor of the authoritarian state',
    note: '"1984"\'s telescreens, Thought Police, and pervasive surveillance became the reference framework for every subsequent discussion of state surveillance: Snowden\'s NSA revelations (2013) were immediately discussed in "1984" terms; China\'s social credit system and CCTV network are analyzed as "Orwellian"; Cambridge Analytica\'s data harvesting prompted "Big Brother" comparisons. The power of the "1984" framework is its specificity — Orwell anticipated that surveillance would be not merely physical but psychological, not merely punitive but preventive, not merely recording behavior but shaping it through the expectation of being watched (the panopticon effect). Foucault\'s "Discipline and Punish" extends "1984"\'s insight philosophically.',
    confidence: 'high' },

  // Orwell-specific edges to existing nodes
  { id: 'george_orwell__manufactured_consent',
    source: 'george_orwell', target: 'manufactured_consent', type: 'SHARES_MECHANISM_WITH',
    label: 'Orwell\'s "1984" propaganda analysis and Chomsky/Herman\'s manufactured consent theory are complementary critiques: totalitarian vs. liberal media manipulation',
    note: 'Orwell and Chomsky/Herman analyze different but related information manipulation systems: Orwell analyzed totalitarian propaganda (explicit state control, active censorship, enforced conformity); manufactured consent analyzes liberal democratic propaganda (structural filters, incentive alignment, subtle distortion without visible censorship). Orwell\'s insight was that explicit propaganda was inefficient and ultimately fragile — it required constant enforcement. Chomsky\'s insight was that liberal media systems achieve similar results without visible censorship, through ownership concentration, advertiser influence, and source dependence. Orwell\'s "1984" and manufactured consent theory are complementary critiques: one explains authoritarian systems, the other explains systems that allow criticism while systematically limiting its reach.',
    confidence: 'high' },
];

// ── Mechanism edges — boosting low-degree nodes ───────────────────────────
const newMechEdges = [
  // Progressive era edges
  { id: 'progressive_era__labor_movement',
    source: 'progressive_era', target: 'labor_movement', type: 'ENABLED',
    label: 'Progressive Era reforms created the legal framework (antitrust, labor inspection, child labor laws) that labor movement demanded',
    note: 'The Progressive Era produced the regulatory infrastructure that protected labor: the Clayton Antitrust Act (1914) explicitly exempted unions from antitrust law; state-level labor laws (minimum wage, maximum hours, child labor bans) began in Progressive Era; the Triangle Shirtwaist Fire (1911) produced state labor inspection systems; Workers Compensation laws began in this period. Progressive Era reform and labor movement demands were symbiotic — reform politicians needed labor electoral support; labor needed legal protections that only government could provide. The Progressive Era\'s labor reforms were the precursor to the New Deal\'s more comprehensive labor protections.',
    confidence: 'high' },
  { id: 'progressive_era__civil_rights_movement',
    source: 'progressive_era', target: 'civil_rights_movement', type: 'SHARES_MECHANISM_WITH',
    label: 'Progressive Era reform and the Civil Rights Movement share the strategy of using federal power to protect rights against private and state violations',
    note: 'The Progressive Era and Civil Rights Movement share the central strategy: using federal regulatory and legal power to protect individuals from concentrated private power (monopolies; racial violence). Both challenged the "states rights" argument that federal non-interference was the constitutional default; both used muckraking journalism and media attention to build public support for federal action; both produced landmark legislation through sustained political pressure. But the Progressive Era\'s relationship to racial justice was deeply contradictory: segregationist progressives (Wilson) used reform rhetoric while actively expanding Jim Crow. The Civil Rights Movement corrected the Progressive Era\'s racial exclusions.',
    confidence: 'high' },

  // Reparations debate
  { id: 'reparations_debate__civil_rights_movement',
    source: 'reparations_debate', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'The Civil Rights Movement\'s unfinished economic justice agenda is the political foundation of reparations arguments',
    note: 'Reparations arguments connect directly to the Civil Rights Movement\'s economic justice agenda: King\'s "Beyond Vietnam" speech (1967) explicitly connected racial justice and economic redistribution; the Poor People\'s Campaign (1968) demanded economic reparations for slavery\'s ongoing effects; King\'s radical economic vision was obscured by the sanitized "I Have a Dream" version. Ta-Nehisi Coates\'s 2014 Atlantic article "The Case for Reparations" reconnected reparations to this tradition, documenting specific documented wealth transfers (redlining, contract buying, ongoing racial wealth gap) rather than abstract slavery guilt. The reparations debate is the continuation of the economic justice dimension of civil rights.',
    confidence: 'high' },
  { id: 'reparations_debate__wealth_inequality',
    source: 'reparations_debate', target: 'wealth_inequality', type: 'ENABLED',
    label: 'Racial wealth gap — the documented result of slavery, Jim Crow, and ongoing discrimination — makes reparations an economic justice issue, not merely a historical one',
    note: 'The racial wealth gap is the economic argument for reparations: median Black household wealth is approximately 10% of median white household wealth ($25,000 vs $250,000); this gap is not explained by income differences, education differences, or behavioral factors — it is primarily the result of documented historical policy: slavery (no wealth accumulation); Reconstruction failure (no land redistribution while white settlers received Homestead Act land); Jim Crow (exclusion from GI Bill, FHA mortgages, Social Security); redlining; Tulsa and other race massacres destroying Black wealth. Reparations as economic justice connects these documented wealth transfers to the current wealth gap.',
    confidence: 'high' },

  // Epigenetics edges
  { id: 'epigenetics__ptsd',
    source: 'epigenetics', target: 'ptsd', type: 'ENABLED',
    label: 'Epigenetic research on PTSD reveals how trauma exposure produces heritable gene expression changes in stress response systems',
    note: 'Epigenetic PTSD research demonstrates a biological transmission mechanism: Rachel Yehuda\'s studies of Holocaust survivor children show altered cortisol profiles consistent with epigenetic inheritance of maternal HPA axis changes; Vietnam veteran children show elevated PTSD rates; studies of communities experiencing sustained collective trauma show epigenetic stress markers in subsequent generations. These findings suggest that PTSD is not purely psychological — it has biological components that can be transmitted to offspring. This has clinical implications (children of trauma survivors need proactive screening) and philosophical implications (trauma is not fully "in the past" for individuals whose parents survived it).',
    confidence: 'high' },
  { id: 'epigenetics__adverse_childhood_experiences',
    source: 'adverse_childhood_experiences', target: 'epigenetics', type: 'ENABLED',
    label: 'ACE research and epigenetics converge: childhood adversity produces lasting gene expression changes that explain ACE health outcomes',
    note: 'ACE research provided the epidemiology; epigenetics provided the biological mechanism. The ACE study documented that childhood trauma predicts adult health outcomes with dose-response precision; epigenetic research explains how: early stress exposure produces methylation changes in cortisol receptor genes, glucocorticoid receptor genes, and FKBP5 (stress response regulator) that alter stress physiology in lasting ways. The biological pathway is: ACE exposure -> HPA axis dysregulation -> cortisol response alteration -> epigenetic marks on stress genes -> altered inflammatory response -> adult health outcomes. This integration of ACE epidemiology with epigenetic mechanism creates a complete causal account from childhood experience to adult disease.',
    confidence: 'high' },

  // Propaganda edges
  { id: 'propaganda__russian_disinformation',
    source: 'propaganda', target: 'russian_disinformation', type: 'ENABLED',
    label: 'Russian disinformation operations are the 21st-century adaptation of 20th-century state propaganda to social media environments',
    note: 'Russian disinformation is state propaganda adapted for social media: the Soviet "active measures" tradition (dezinformatsiya) pioneered many techniques now used digitally — fabricated documents, planted stories, front organizations; the Internet Research Agency applied these techniques to social media; the goal shifted from promoting specific beliefs (Soviet propaganda) to producing epistemic confusion (postmodern disinformation). The continuity is institutional: Russian intelligence services (KGB -> FSB/GRU) have maintained active measures capabilities continuously since the 1950s, adapting their techniques to each new media environment. Russian disinformation demonstrates that state propaganda does not require controlling media institutions — it can exploit open media environments.',
    confidence: 'high' },
  { id: 'propaganda__astroturfing',
    source: 'propaganda', target: 'astroturfing', type: 'PRODUCED',
    label: 'Astroturfing is the grassroots implementation of propaganda — simulated citizen consensus to support messages corporate or state propaganda has already planted',
    note: 'Astroturfing extends the propaganda toolkit to the grassroots: traditional propaganda operates through top-down institutional channels (owned media, state broadcasts); astroturfing creates the appearance of bottom-up citizen validation for propaganda messages. The combination is more powerful than either alone: when Fox News (top-down) reports that "concerned citizens" (astroturf bottom-up) are opposing climate policy, the propaganda effect is reinforced by apparent democratic legitimacy. Corporate astroturfing was developed by tobacco industry PR firms and exported to other industries; political astroturfing (fake grassroots political movements, Astroturf PACs) followed the same logic. The internet made astroturfing cheaper and harder to detect.',
    confidence: 'high' },

  // Citizen journalism
  { id: 'citizen_journalism__police_brutality',
    source: 'citizen_journalism', target: 'police_brutality', type: 'ENABLED',
    label: 'Citizen journalism (smartphone video) made police brutality visible in ways that transformed public opinion and produced the BLM movement',
    note: 'Citizen journalism fundamentally changed police accountability: Rodney King (1991, video camera) produced the first viral police violence video and the LA riots; the transition to smartphone cameras (2010s) made police violence documentation ubiquitous; Eric Garner (I can\'t breathe, 2014), Michael Brown (2014), Walter Scott (2015, shot in back while fleeing), Philando Castile (2016, livestreamed while dying), George Floyd (2020) — all were documented by citizen journalists. Without these recordings, the police accounts would have been accepted unchallenged. Darnella Frazier\'s Floyd video directly produced the conviction of Derek Chauvin — the first US police murder conviction that would not have occurred without citizen documentation.',
    confidence: 'high' },
  { id: 'citizen_journalism__broken_epistemology',
    source: 'citizen_journalism', target: 'broken_epistemology', type: 'ENABLED',
    label: 'Citizen journalism\'s unvetted viral spread contributes to broken epistemology alongside its genuine accountability function',
    note: 'Citizen journalism has a dual epistemological effect: it enables genuine accountability journalism (police brutality documentation) while the same distribution infrastructure spreads viral misinformation without the vetting professional journalism provides. The Plandemic documentary, COVID-19 conspiracy videos, and election fraud claims all spread through citizen journalism distribution channels. The epistemological damage comes from the inability of audiences to distinguish verified from unverified citizen journalism; the same trust that makes police violence videos credible also makes conspiracy videos credible. This dual nature means citizen journalism simultaneously improves and degrades the information environment, with the balance depending on whether users have the media literacy to distinguish them.',
    confidence: 'high' },

  // Astroturfing connections
  { id: 'astroturfing__tobacco_master_settlement',
    source: 'astroturfing', target: 'tobacco_master_settlement', type: 'ENABLED',
    label: 'Tobacco industry astroturfing — funding "independent" groups opposing tobacco restrictions — was the template copied by other industries',
    note: 'Tobacco industry astroturfing was the ur-example: the industry funded apparently independent scientific-looking organizations (Tobacco Institute, Council for Tobacco Research) to provide "balanced" voices opposing health research; it created smokers rights groups (National Smokers Alliance) as fake citizen movements; it infiltrated civic organizations to spread tobacco-friendly positions. These techniques were developed in the 1950s-1980s and explicitly exported to other industries after the tobacco playbook became public through litigation. The tobacco master settlement (1998) produced internal document disclosure that documented the astroturfing strategy — these documents became the foundation for understanding industry manipulation tactics in climate, pharmaceutical, and other sectors.',
    confidence: 'high' },

  // Mental health stigma
  { id: 'mental_health_stigma__war_on_drugs',
    source: 'mental_health_stigma', target: 'war_on_drugs', type: 'ENABLED',
    label: 'Mental health stigma framing addiction as moral failure (rather than health condition) enabled the criminalization logic of the War on Drugs',
    note: 'The War on Drugs was enabled by mental health stigma around addiction: the disease model of addiction (addiction is a brain disorder requiring medical treatment) was well-established in research by the 1970s when Nixon launched the War on Drugs; the moral failure model (addiction is weakness/criminality requiring punishment) was chosen politically because it enabled criminalization. Reagan\'s "Just Say No" campaign embedded the moral failure model in popular culture; mandatory minimum sentences for drug possession followed the moral failure logic. Mental health stigma did not merely fail to prevent the War on Drugs — it was the ideological foundation that made it politically possible to imprison people for a medical condition.',
    confidence: 'high' },

  // Loneliness epidemic
  { id: 'loneliness_epidemic__right_wing_populism',
    source: 'loneliness_epidemic', target: 'right_wing_populism', type: 'ENABLED',
    label: 'The loneliness epidemic creates the social isolation that makes people vulnerable to the community belonging that right-wing populist movements provide',
    note: 'Loneliness and right-wing populism are connected through community dynamics: right-wing populist movements provide community, identity, and belonging that the loneliness epidemic has depleted; MAGA rallies, far-right online communities, and anti-immigration groups all function as social belonging structures for isolated individuals; the research on radicalization shows that community belonging (not primarily ideology) is the initial draw. Loneliness creates demand for community; right-wing populism provides supply in the form of identity movements that offer clear in-group membership, shared narrative, and community events. This explains the paradox that many right-wing populist movement members are not personally economically harmed by immigrants — they are socially isolated and seeking community.',
    confidence: 'high' },

  // Single payer healthcare
  { id: 'single_payer_healthcare__wealth_inequality',
    source: 'single_payer_healthcare', target: 'wealth_inequality', type: 'ENABLED',
    label: 'Private healthcare systems systematically transfer wealth upward through medical debt, insurance profits, and administrative complexity',
    note: 'Healthcare system design and wealth inequality are directly connected: medical debt is the primary cause of personal bankruptcy in the US (no other wealthy country has this problem); health insurance administrative overhead (10-12% of US healthcare spending) represents wealth transfer to insurance shareholders with no health value; out-of-pocket costs disproportionately burden lower-income people; healthcare sector consolidation produces market power that extracts rents from patients and employers. Universal healthcare systems reduce these wealth transfer mechanisms: no medical debt, minimal administrative overhead, no insurance shareholder extraction. The US healthcare system\'s wealth-upward transfer dynamics are a microcosm of the broader neoliberal economy.',
    confidence: 'high' },

  // Russian disinformation
  { id: 'russian_disinformation__trump_maga',
    source: 'russian_disinformation', target: 'trump_maga', type: 'ENABLED',
    label: 'Russian disinformation operations specifically targeted American political divisions, amplifying MAGA-aligned content and Trump support',
    note: 'The Mueller Report and Senate Intelligence Committee investigations documented Russian disinformation operations targeting the 2016 election: the IRA focused heavily on amplifying Trump-supporting content and divisive racial/immigration content; Russian hackers (GRU) stole and strategically released DNC and Podesta emails through WikiLeaks to damage Clinton; Russian social media operations promoted content specifically aligned with MAGA themes (immigration fear, urban crime, anti-Clinton). The operations were not primarily creating content — they were identifying and amplifying existing American divisions. Russian disinformation did not create MAGA but systematically amplified it, making Russian and domestic MAGA political interests temporarily aligned.',
    confidence: 'high' },

  // Media consolidation
  { id: 'media_consolidation__local_news_collapse',
    source: 'media_consolidation', target: 'broken_epistemology', type: 'PRODUCED',
    label: 'Media consolidation produced the local news collapse that removed shared community information environments and enabled broken epistemology',
    note: 'Media consolidation produced local news collapse: consolidators (Tribune, Alden Global Capital) bought local newspapers and systematically cut staff, reducing local coverage below viability; hedge fund ownership stripped newspapers of assets; digital advertising migration eliminated revenue. By 2023, 2,500 US newspapers had closed since 2005 — producing "news deserts" where communities have no shared local information source. Local news had been the shared factual baseline across partisan lines — local sports, local government, local crime. Its collapse removed the shared information environment that enabled community deliberation. Without local news, national partisan media filled the gap, producing the broken epistemology local news had partially prevented.',
    confidence: 'high' },
];

// ── Write files ───────────────────────────────────────────────────────────
let pnAdded=0, hnAdded=0;
let peAdded=0, heAdded=0, meAdded=0;

newPolitNodes.forEach(n => { if (!pnIds.has(n.id)) { pn.push(n); pnIds.add(n.id); pnAdded++; } });
newHistNodes.forEach(n => { if (!hnIds.has(n.id)) { hn.push(n); hnIds.add(n.id); hnAdded++; } });

newPolitEdges.forEach(e => { if (!peIds.has(e.id)) { pe.push(e); peIds.add(e.id); peAdded++; } });
newHistEdges.forEach(e => { if (!heIds.has(e.id)) { he.push(e); heIds.add(e.id); heAdded++; } });
newMechEdges.forEach(e => { if (!meIds.has(e.id)) { me.push(e); meIds.add(e.id); meAdded++; } });

fs.writeFileSync(D('data/global/politics/nodes.json'), JSON.stringify(pn, null, 2));
fs.writeFileSync(D('data/global/history/nodes.json'), JSON.stringify(hn, null, 2));
fs.writeFileSync(D('data/global/politics/edges.json'), JSON.stringify(pe, null, 2));
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(he, null, 2));
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));

console.log('Politics nodes: +'+pnAdded+' -> '+pn.length);
console.log('History nodes: +'+hnAdded+' -> '+hn.length);
console.log('Politics edges: +'+peAdded+' -> '+pe.length);
console.log('History edges: +'+heAdded+' -> '+he.length);
console.log('Mechanism edges: +'+meAdded+' -> '+me.length);

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
