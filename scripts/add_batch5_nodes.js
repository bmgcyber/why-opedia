#!/usr/bin/env node
// add_batch5_nodes.js — Trail of Tears, CIA, EU, Reaganomics, supply-side, Che Guevara,
//   Theodore Roosevelt, colonialism, conversion therapy, ACEs, epigenetics, neoconservatism
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
    id: 'central_intelligence_agency',
    label: 'CIA',
    node_type: 'institution',
    category: 'institution',
    decade: '1940s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Central_Intelligence_Agency',
    summary: 'US intelligence agency created in 1947, responsible for covert operations, foreign assassinations, regime change operations, and mass surveillance programs globally.',
    tags: ['intelligence', 'covert operations', 'cold war', 'regime change', 'surveillance', 'us foreign policy']
  },
  {
    id: 'neoconservatism',
    label: 'Neoconservatism',
    node_type: 'ideology',
    category: 'ideology',
    decade: '1970s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Neoconservatism',
    summary: 'Political movement advocating American global dominance through military intervention, democracy promotion, and rejection of realism in foreign policy; dominated US policy under George W. Bush.',
    tags: ['neocon', 'foreign policy', 'military intervention', 'iraq war', 'PNAC', 'hawkish', 'democracy promotion']
  },
  {
    id: 'european_union',
    label: 'European Union',
    node_type: 'institution',
    category: 'institution',
    decade: '1990s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/European_Union',
    summary: 'Political and economic union of European states formed in 1993, representing the most ambitious supranational project in history — shared currency, open borders, common law.',
    tags: ['europe', 'supranational', 'integration', 'eurozone', 'sovereignty', 'brexit', 'trade']
  },
];

// ── New History nodes ─────────────────────────────────────────────────────
const newHistNodes = [
  {
    id: 'trail_of_tears',
    label: 'Trail of Tears',
    node_type: 'event',
    category: 'event',
    decade: '1830s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Trail_of_Tears',
    summary: 'Forced relocation of five Native American nations from southeastern United States to Indian Territory (Oklahoma) under the Indian Removal Act of 1830, resulting in thousands of deaths.',
    tags: ['native american', 'forced relocation', 'genocide', 'andrew jackson', 'indian removal', 'cherokee', 'ethnic cleansing']
  },
  {
    id: 'che_guevara',
    label: 'Che Guevara',
    node_type: 'person',
    category: 'person',
    decade: '1950s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Che_Guevara',
    summary: 'Argentine revolutionary and Marxist guerrilla leader who played a key role in the Cuban Revolution and attempted to spread revolution across Latin America and Africa; executed in Bolivia 1967.',
    tags: ['revolutionary', 'marxist', 'cuba', 'guerrilla warfare', 'latin america', 'cold war', 'icon']
  },
  {
    id: 'theodore_roosevelt',
    label: 'Theodore Roosevelt',
    node_type: 'person',
    category: 'person',
    decade: '1900s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Theodore_Roosevelt',
    summary: 'US President 1901-1909; trust-busting Progressive reformer, conservationist, architect of American imperial expansion in the Caribbean and Pacific, Nobel Peace Prize 1906.',
    tags: ['progressive era', 'trust busting', 'conservation', 'imperialism', 'panama canal', 'big stick', 'monopoly']
  },
  {
    id: 'colonial_era',
    label: 'Colonial Era',
    node_type: 'era',
    category: 'era',
    decade: '1500s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Colonialism',
    summary: 'Period of European territorial expansion and direct control of non-European territories from the 15th through mid-20th century, reshaping global economics, politics, and culture through extraction and domination.',
    tags: ['colonialism', 'empire', 'extraction', 'subjugation', 'africa', 'asia', 'americas', 'european expansion']
  },
];

// ── New Mechanism nodes ───────────────────────────────────────────────────
const newMechNodes = [
  {
    id: 'supply_side_economics',
    label: 'Supply-Side Economics',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1970s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Supply-side_economics',
    summary: 'Economic theory holding that cutting taxes on high earners and corporations produces growth that benefits all through "trickle-down" effects; the intellectual foundation of Reaganomics.',
    tags: ['reaganomics', 'trickle down', 'tax cuts', 'deregulation', 'neoliberalism', 'laffer curve', 'inequality']
  },
  {
    id: 'resource_extraction',
    label: 'Resource Extraction',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1500s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Extractivism',
    summary: 'Economic model based on large-scale removal of natural resources for export, typically benefiting external powers while leaving environmental damage and economic dependency in source regions.',
    tags: ['extractivism', 'colonialism', 'resource curse', 'oil', 'mining', 'environmental degradation', 'dependency']
  },
];

// ── New Health nodes ──────────────────────────────────────────────────────
const newHealthNodes = [
  {
    id: 'adverse_childhood_experiences',
    label: 'Adverse Childhood Experiences (ACEs)',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1990s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Adverse_childhood_experiences',
    summary: 'Traumatic events in childhood (abuse, neglect, household dysfunction) that correlate strongly with adult physical and mental health outcomes; landmark 1998 CDC-Kaiser study established dose-response relationship.',
    tags: ['trauma', 'childhood', 'health outcomes', 'mental health', 'abuse', 'neglect', 'epidemiology', 'ACE score']
  },
  {
    id: 'conversion_therapy',
    label: 'Conversion Therapy',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1960s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Conversion_therapy',
    summary: 'Pseudoscientific practices attempting to change sexual orientation or gender identity; discredited by all major medical and psychiatric organizations, causes lasting psychological harm especially in minors.',
    tags: ['lgbtq', 'pseudoscience', 'harm', 'religion', 'psychology', 'ban', 'human rights', 'torture']
  },
];

// ── Politics edges ────────────────────────────────────────────────────────
const newPolitEdges = [
  // CIA
  { id: 'cold_war__central_intelligence_agency',
    source: 'cold_war', target: 'central_intelligence_agency', type: 'PRODUCED',
    label: 'The Cold War created the CIA as America\'s primary covert operations and intelligence institution',
    note: 'The CIA was created by the National Security Act of 1947 as a direct institutional response to the Cold War. It replaced the wartime OSS and was given broader peacetime authority for intelligence collection, covert action, and clandestine operations. The Cold War structure — permanent ideological confrontation without direct military engagement — required a permanent covert apparatus for third-country proxy operations. The CIA\'s creation institutionalized peacetime covert action as a normal tool of US foreign policy.',
    confidence: 'high' },
  { id: 'central_intelligence_agency__latin_american_dirty_wars',
    source: 'central_intelligence_agency', target: 'latin_american_dirty_wars', type: 'ENABLED',
    label: 'The CIA trained, funded, and organized the military juntas that ran Latin America\'s dirty wars',
    note: 'CIA involvement in Latin American dirty wars was systematic and documented: Operation Condor (coordinated repression across Argentina, Chile, Uruguay, Paraguay, Bolivia, Brazil) was CIA-facilitated; the CIA trained Latin American security forces at the School of the Americas including torture techniques; CIA operations overthrew democratic governments (Guatemala 1954, Chile 1973) and installed or supported the military dictatorships that subsequently conducted mass killings. The CIA\'s counterinsurgency doctrine — framing any left-wing movement as Soviet-directed — provided the ideological justification for state terrorism across the region.',
    confidence: 'high' },
  { id: 'central_intelligence_agency__iran_contra',
    source: 'central_intelligence_agency', target: 'iran_contra', type: 'ENABLED',
    label: 'The CIA\'s covert operations infrastructure was the institutional base for Iran-Contra\'s arms networks',
    note: 'Iran-Contra used the CIA\'s existing infrastructure of covert arms suppliers, foreign bank accounts, and operational networks — though the operation was technically run through the NSC to circumvent CIA oversight requirements after the Boland Amendment. CIA Director William Casey was a key architect; CIA operatives were directly involved in the weapons shipments and Contra supply networks. The operation represented the CIA\'s covert operations culture operating outside even its own institutional constraints.',
    confidence: 'high' },
  { id: 'central_intelligence_agency__us_iran_1953_coup',
    source: 'central_intelligence_agency', target: 'us_iran_1953_coup', type: 'ENABLED',
    label: 'Operation AJAX (CIA) and Operation Boot (MI6) organized and executed the 1953 Iranian coup',
    note: 'The 1953 Iranian coup (Operation AJAX/TPAJAX) was the CIA\'s first major regime change operation. CIA officer Kermit Roosevelt Jr. coordinated the operation that overthrew elected Prime Minister Mohammad Mosaddegh after he nationalized Iran\'s oil (British Petroleum\'s predecessor). The CIA paid Iranian military officers, organized street mobs, and ran a disinformation campaign attributing the coup to communists. The 1953 coup is the ur-example of CIA covert regime change — it established the operational template used in Guatemala (1954), Chile (1973), and dozens of other operations.',
    confidence: 'high' },
  { id: 'central_intelligence_agency__mk_ultra',
    source: 'central_intelligence_agency', target: 'mk_ultra', type: 'PRODUCED',
    label: 'MK-Ultra was a CIA mind control research program conducted without congressional oversight',
    note: 'MK-Ultra (1953-1973) was a CIA program of experiments on mind control using LSD, hypnosis, torture, and other techniques on unwitting subjects including US citizens. The program was authorized by CIA Director Allen Dulles and conducted through 150 research projects at universities, hospitals, and prisons using front organizations. Most MK-Ultra files were destroyed in 1973 before Senate investigation; the Church Committee documented what survived. MK-Ultra represents the CIA operating outside legal and ethical constraints — the same institutional pattern as its regime change operations.',
    confidence: 'high' },

  // Neoconservatism
  { id: 'neoconservatism__iraq_war_wmd',
    source: 'neoconservatism', target: 'iraq_war_wmd', type: 'ENABLED',
    label: 'Neoconservative ideology was the intellectual driver of the Iraq War decision',
    note: 'The Iraq War was a neoconservative project: PNAC (Project for the New American Century) had called for Saddam\'s removal since 1998; key neoconservatives (Wolfowitz, Perle, Feith, Cheney) dominated Bush administration foreign policy after 9/11; neoconservative doctrine of "democratic domino theory" — that removing Saddam would spark democratic transformation across the Middle East — was the strategic rationale beyond WMDs. The WMD case was the public justification; the neoconservative goal was regional transformation. The Iraq War\'s failure delegitimized neoconservatism but its institutional base (think tanks, academic networks) survived.',
    confidence: 'high' },
  { id: 'cold_war__neoconservatism',
    source: 'cold_war', target: 'neoconservatism', type: 'PRODUCED',
    label: 'Neoconservatism emerged from Cold War liberal anti-communism transformed into aggressive democracy promotion',
    note: 'Neoconservatism originated with former leftists (Norman Podhoretz, Irving Kristol) who moved right in response to 1960s counterculture and New Left. Their Cold War anti-communism was more muscular than conservative realism — they opposed detente, supported human rights as a weapon against the Soviet Union, and believed the US should use its power to spread democracy. After the Cold War removed the Soviet threat, neoconservatives redirected this framework toward "rogue states" and the Middle East. The intellectual continuity: Cold War anti-communism → democracy promotion as foreign policy → regime change as strategy.',
    confidence: 'high' },
  { id: 'neoconservatism__george_w_bush',
    source: 'neoconservatism', target: 'george_w_bush', type: 'ENABLED',
    label: 'Neoconservative advisors in the Bush administration shaped the post-9/11 response toward Iraq',
    note: 'George W. Bush came into office with limited foreign policy experience; neoconservative officials (Cheney as VP, Wolfowitz as Deputy Defense, Feith as Under Secretary of Defense) shaped the post-9/11 response. The decision to invade Iraq was primarily neoconservative: Wolfowitz began pushing for Iraq action on September 12, 2001; the CIA\'s WMD intelligence was interpreted through a neoconservative lens that assumed the worst. Bush adopted neoconservative "freedom agenda" rhetoric that was intellectually alien to his 2000 campaign\'s "humble foreign policy."',
    confidence: 'high' },

  // European Union
  { id: 'peace_of_westphalia__european_union',
    source: 'peace_of_westphalia', target: 'european_union', type: 'ENABLED',
    label: 'The EU represents the partial transcendence of the Westphalian nation-state sovereignty model it was built to overcome',
    note: 'The Peace of Westphalia (1648) established the sovereign nation-state as the fundamental unit of international order. The European Union (1993) represents the most ambitious attempt to transcend that order — member states pooled sovereignty over currency, trade, borders, and significant areas of law. The EU was explicitly created to make European war impossible by creating shared institutions and economic interdependence. It is simultaneously the inheritor of the Westphalian state system (composed of sovereign states) and its most radical challenge (they voluntarily cede sovereignty to supranational institutions).',
    confidence: 'high' },
  { id: 'cold_war__european_union',
    source: 'cold_war', target: 'european_union', type: 'ENABLED',
    label: 'The Cold War provided the security context that made European integration politically feasible',
    note: 'European integration was enabled by Cold War conditions: the Soviet threat provided the security motivation for Western European cooperation; US support (Marshall Plan, NATO) created the economic and security foundations for integration; the division of Europe at the Iron Curtain made Western European states prioritize unity over competition. Without the Cold War\'s security umbrella, French-German reconciliation and pooled sovereignty would have been politically impossible. The EU\'s expansion after 1989 demonstrated this: without Soviet threat, integration became contested rather than consensus.',
    confidence: 'high' },
];

// ── History edges ─────────────────────────────────────────────────────────
const newHistEdges = [
  // Trail of Tears
  { id: 'trail_of_tears__american_civil_war',
    source: 'trail_of_tears', target: 'american_civil_war', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent federal government violence to resolve contested territorial claims, displacing human communities for economic expansion',
    note: 'The Trail of Tears (1830s) and the Civil War (1861-65) both involved federal government use of military force to resolve conflicts over who controls American territory and labor. The Indian Removal Act was driven by Southern states wanting Native American land for cotton; the Civil War was driven by Southern states wanting to keep enslaved labor. Both required the federal government to choose between economic interests of white settlers/planters and the rights of non-white populations. The Trail of Tears set the precedent that economic and territorial interests outweigh treaty obligations — a precedent the Civil War partially overturned.',
    confidence: 'medium' },
  { id: 'trail_of_tears__atlantic_slave_trade',
    source: 'trail_of_tears', target: 'atlantic_slave_trade', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent the foundational mechanisms of American racial capitalism: dispossessing indigenous peoples for the land, enslaving Africans for the labor',
    note: 'The Trail of Tears and Atlantic Slave Trade represent the twin foundations of American economic development: Native American dispossession provided the land; African slavery provided the labor. The cotton economy of the antebellum South required both: the Trail of Tears opened Georgia, Alabama, and Mississippi to cotton cultivation; enslaved African labor worked that land. Cherokee removal was explicitly motivated by the desire for Native American land to expand the cotton plantation economy. The connection is structural: American capitalism was built on stolen land worked by stolen labor.',
    confidence: 'high' },
  { id: 'colonial_era__trail_of_tears',
    source: 'colonial_era', target: 'trail_of_tears', type: 'PRODUCED',
    label: 'The Trail of Tears was a continuation of the colonial project of indigenous dispossession under a new national government',
    note: 'The Trail of Tears was colonial dispossession continued by the independent US government. European colonialism had established the pattern: indigenous peoples had no property rights against European settlers; treaties were tools to formalize already-decided territorial transfers. The Indian Removal Act (1830) applied this colonial logic within the US legal framework. Andrew Jackson, who had spent his career fighting Native Americans, institutionalized removal as policy. The Trail of Tears demonstrates that American independence from Britain did not change the fundamental colonial relationship between the new state and indigenous peoples.',
    confidence: 'high' },

  // Che Guevara
  { id: 'cuban_revolution__che_guevara',
    source: 'cuban_revolution', target: 'che_guevara', type: 'PRODUCED',
    label: 'The Cuban Revolution was the formative experience that transformed Che Guevara from doctor to revolutionary icon',
    note: 'The Cuban Revolution (1959) was the crucible of Che Guevara\'s revolutionary theory and practice. Guevara joined Fidel Castro\'s 26th of July Movement in Mexico (1955) and fought in the Sierra Maestra; his battlefield experiences produced "Guerrilla Warfare" (1961), the theoretical manual for revolution through rural insurgency. After Cuba, Guevara became the face of Third World revolution — his subsequent failures in Congo (1965) and Bolivia (1967, where he was captured and executed) demonstrated both the limits and the symbolic power of revolutionary romanticism. Guevara\'s death made him a more powerful revolutionary icon than his life had.',
    confidence: 'high' },
  { id: 'che_guevara__latin_american_dirty_wars',
    source: 'che_guevara', target: 'latin_american_dirty_wars', type: 'ENABLED',
    label: 'Che\'s guerrilla theory inspired the left-wing insurgencies that Latin American military dictatorships used to justify state terrorism',
    note: 'Che Guevara\'s "foco theory" (guerrilla vanguard can create revolutionary conditions through action) inspired the armed left-wing movements that Latin American military dictatorships used to justify dirty war operations. The Tupamaros (Uruguay), Montoneros (Argentina), MIR (Chile), Shining Path (Peru) — all drew on Guevara\'s theory. The dirty wars were partly a response to this actual armed left (not just imagined communist threat). The US-backed military response — Operation Condor, systematic torture and disappearance — was disproportionate and targeted civilians, but Guevara\'s exported guerrilla theory did catalyze the cycle.',
    confidence: 'high' },
  { id: 'che_guevara__ho_chi_minh',
    source: 'che_guevara', target: 'ho_chi_minh', type: 'SHARES_MECHANISM_WITH',
    label: 'Guevara and Ho Chi Minh were the defining revolutionary figures of the 1960s Third World liberation wave',
    note: 'Che Guevara and Ho Chi Minh were the two most globally influential Third World revolutionary figures of the 1960s: both rejected Cold War superpower alignment to pursue independent revolutionary paths; both influenced movements worldwide; both became cultural icons. Their differences illuminate contrasting approaches: Ho built a mass nationalist movement embedded in Vietnamese peasant society over decades; Guevara pursued rapid guerrilla action as a universal revolutionary catalyst. Ho\'s approach succeeded (Vietnam 1975); Guevara\'s failed (Bolivia 1967). The contrast shaped the left\'s debate about revolution: patient mass organizing vs. vanguard guerrilla action.',
    confidence: 'high' },

  // Theodore Roosevelt
  { id: 'theodore_roosevelt__imperialism',
    source: 'theodore_roosevelt', target: 'imperialism', type: 'ENABLED',
    label: 'Theodore Roosevelt was the political architect of American imperial expansion at the turn of the 20th century',
    note: 'Theodore Roosevelt was the most important figure in constructing American empire: as Assistant Secretary of the Navy he positioned the US for the Spanish-American War (1898); as President he claimed the right to intervene in Latin American affairs via the Roosevelt Corollary to the Monroe Doctrine (1904) — the US would intervene to "stabilize" Latin American countries to prevent European interference; he built the Panama Canal by fomenting Panamanian secession from Colombia. Roosevelt articulated the ideology of American empire — "civilizing" mission, Anglo-Saxon superiority, social Darwinism — that provided moral justification for economic and military domination.',
    confidence: 'high' },
  { id: 'theodore_roosevelt__new_deal',
    source: 'theodore_roosevelt', target: 'new_deal', type: 'ENABLED',
    label: 'Roosevelt\'s Progressive Era antitrust and regulatory precedents created the institutional foundations the New Deal built on',
    note: 'Theodore Roosevelt\'s Progressive Era reforms established the precedent that the federal government could regulate corporations and break up monopolies in the public interest — a radical claim in 1900. His trust-busting (Standard Oil, Northern Securities), food safety regulation (Pure Food and Drug Act), and conservation programs established federal regulatory authority over private economic activity. FDR\'s New Deal (1933-39) built directly on these precedents, expanding regulatory authority to banking, securities, labor relations, and agricultural markets. Without TR\'s establishment of the regulatory principle, FDR\'s extension of it would have been legally and politically more difficult.',
    confidence: 'high' },
  { id: 'theodore_roosevelt__civil_rights_movement',
    source: 'theodore_roosevelt', target: 'civil_rights_movement', type: 'SHARES_MECHANISM_WITH',
    label: 'Roosevelt invited Booker T. Washington to the White House — the first Black presidential guest — then spent years distancing himself from racial equality',
    note: 'Theodore Roosevelt\'s racial record illustrates the contradictions of Progressive Era liberalism: he invited Booker T. Washington to the White House (1901), the first African American presidential guest, which provoked violent Southern backlash; he promoted Black officers during Spanish-American War service; then he dishonorably discharged 167 Black soldiers in the Brownsville affair (1906) based on flimsy evidence and racial assumption. Roosevelt held typical Progressive Era racist views (Anglo-Saxon hierarchy, "race suicide" fears) alongside genuine if limited racial reform impulses. His record became a touchstone for arguments about the limits of white liberal racial politics.',
    confidence: 'medium' },

  // Colonial Era
  { id: 'age_of_exploration__colonial_era',
    source: 'age_of_exploration', target: 'colonial_era', type: 'PRODUCED',
    label: 'The Age of Exploration established the territorial claims and extractive relationships that the Colonial Era institutionalized',
    note: 'The Age of Exploration (15th-17th c.) produced the Colonial Era through the institutionalization of European territorial control: initial voyages of exploration became permanent settlements; trading posts became colonies with European administrators; indigenous peoples became subject populations under colonial law. The transition from exploration to colonization was driven by economic logic: the discovery of extractable resources (gold, silver, spices, fertile land) required permanent European presence to control extraction. The Colonial Era represents the bureaucratization and systematization of the extractive relationships that exploration had discovered.',
    confidence: 'high' },
  { id: 'colonial_era__atlantic_slave_trade',
    source: 'colonial_era', target: 'atlantic_slave_trade', type: 'PRODUCED',
    label: 'The Colonial Era\'s plantation economy created the demand for enslaved labor that drove the Atlantic slave trade',
    note: 'The Atlantic Slave Trade was a colonial institution: European colonies in the Americas discovered that plantation agriculture (sugar, tobacco, cotton) was enormously profitable but required massive labor in disease environments that killed European indentured servants rapidly. Indigenous peoples had been decimated by disease. The "solution" was the forced importation of African enslaved people. The slave trade\'s scale (12.5 million Africans transported) was determined by colonial plantation economics. Without European colonial plantation agriculture, there was no economic engine for slave trade at this scale. Colonialism created the demand; the slave trade supplied it.',
    confidence: 'high' },
  { id: 'colonial_era__decolonization_movement',
    source: 'colonial_era', target: 'decolonization_movement', type: 'PRODUCED',
    label: 'Decolonization was the direct response to colonial rule — the colonized applying the colonizers\' own Enlightenment values to demand independence',
    note: 'Decolonization movements directly inverted colonial ideological claims: European colonialism justified itself through Enlightenment principles (civilization, progress, rights) while denying those rights to colonized peoples. Decolonization movements used the colonizers\' own arguments — self-determination, human rights, democratic governance — to demand independence. The Haitian Revolution (1791) was the first; the post-WWII wave (1945-1975) decolonized most of Africa and Asia. WWII accelerated decolonization by weakening European colonial powers militarily and morally (it was difficult to fight Nazi racial hierarchy while maintaining colonial racial hierarchy).',
    confidence: 'high' },
  { id: 'colonial_era__resource_curse',
    source: 'colonial_era', target: 'resource_curse', type: 'PRODUCED',
    label: 'Colonial resource extraction created the economic structures and governance patterns that produce the resource curse in post-colonial states',
    note: 'The resource curse in post-colonial states is substantially a legacy of colonial economic design: colonial economies were structured for extraction (primary commodity export) rather than diversification; colonial infrastructure (railways, ports) connected resource areas to export points, not internal markets; colonial governance concentrated power in extractive institutions; European companies maintained extraction relationships through independence via neocolonial arrangements. The post-independence states that inherited these structures — dependent on single commodity exports, with governance designed for extraction rather than development — were structurally predisposed to resource curse dynamics.',
    confidence: 'high' },
];

// ── Mechanism edges ───────────────────────────────────────────────────────
const newMechEdges = [
  // Supply-side economics
  { id: 'supply_side_economics__neoliberalism',
    source: 'supply_side_economics', target: 'neoliberalism', type: 'ENABLED',
    label: 'Supply-side economics provided the economic theory that Reaganomics implemented as the practical expression of neoliberal doctrine',
    note: 'Supply-side economics is the macroeconomic theory within the broader neoliberal ideological framework. Neoliberalism (free markets, privatization, deregulation) needed supply-side theory to justify its fiscal policy: the argument that tax cuts pay for themselves through increased growth (Laffer Curve) provided the economic rationale for reducing the state without appearing fiscally irresponsible. Reagan\'s 1981 tax cuts (Economic Recovery Tax Act) implemented supply-side theory at scale — the experiment produced a brief recovery followed by the largest peacetime deficit expansion in US history to that point. Supply-side economics\' persistence despite repeated empirical disconfirmation demonstrates its ideological rather than empirical function.',
    confidence: 'high' },
  { id: 'supply_side_economics__new_deal',
    source: 'supply_side_economics', target: 'new_deal', type: 'DISCREDITED',
    label: 'Supply-side economics was intellectually designed as a rejection of New Deal demand-side Keynesian economics',
    note: 'Supply-side economics was explicitly constructed as the counter-theory to New Deal Keynesianism. Where Keynes argued demand (consumer spending, government investment) drives economic growth, supply-siders argued supply (business investment, capital formation) does. The intellectual project — Jude Wanniski, Arthur Laffer, Robert Mundell — was to provide an economic theory that justified reducing the New Deal state rather than expanding it. Reagan\'s implementation represented supply-side theory displacing Keynesian consensus in government economic policy — a shift that had been building since stagflation (1970s) made Keynesian demand management appear inadequate.',
    confidence: 'high' },
  { id: 'supply_side_economics__political_polarization',
    source: 'supply_side_economics', target: 'political_polarization', type: 'ENABLED',
    label: 'The supply-side vs. demand-side debate became a proxy for broader ideological conflict over the size and role of government',
    note: 'The economic policy debate between supply-side and Keynesian economics became a primary axis of American political polarization after Reagan. Republicans unified around supply-side tax cuts as both economic theory and political strategy (starving the beast); Democrats defended Keynesian demand management and New Deal institutions. This economic division mapped onto cultural and social divisions (small government vs. activist state) to produce the partisan alignment that characterizes post-1980 American politics. The inability to reach bipartisan consensus on even basic fiscal policy — reflected in repeated government shutdown crises — is partly a legacy of supply-side\'s hardening into Republican dogma.',
    confidence: 'high' },

  // Resource extraction
  { id: 'resource_extraction__resource_curse',
    source: 'resource_extraction', target: 'resource_curse', type: 'PRODUCED',
    label: 'Resource extraction economies create the specific institutional conditions that produce the resource curse',
    note: 'The resource curse (paradox of plenty — resource-rich countries often have worse development outcomes) is produced by resource extraction\'s institutional effects: revenue from resource extraction flows to the state without taxing citizens, reducing accountability pressure; resource booms attract labor and capital away from manufacturing and agriculture (Dutch disease); resource wealth creates incentives for elite capture and corruption; commodity price volatility makes fiscal planning impossible. These mechanisms operate regardless of colonial legacy — Norway avoided the resource curse through specific institutional design (sovereign wealth fund, transparent management) that most resource-extracting countries have lacked.',
    confidence: 'high' },
  { id: 'imperialism__resource_extraction',
    source: 'imperialism', target: 'resource_extraction', type: 'ENABLED',
    label: 'Imperialism created the legal, political, and military structures that enabled extraction of colonial resources at scale',
    note: 'Imperialism and resource extraction are structurally linked: imperial conquest provided political control; colonial law denied indigenous property rights; colonial military force suppressed resistance to extraction; colonial legal systems treated natural resources as belonging to the colonial power rather than indigenous peoples. The scale of extraction required political control — no market mechanism alone could have organized the transfer of value from colonies to metropoles that occurred under imperialism. After formal decolonization, neocolonial relationships (trade agreements, investment treaties, military bases) continued enabling resource extraction through economic rather than political control.',
    confidence: 'high' },
  { id: 'resource_extraction__environmental_degradation',
    source: 'resource_extraction', target: 'environmental_degradation', type: 'CAUSED',
    label: 'Large-scale resource extraction is the primary driver of environmental degradation in extractive economies',
    note: 'Resource extraction causes environmental degradation through multiple pathways: mining contaminates water and soil with heavy metals and acid drainage; oil extraction produces spills, flaring, and subsidence; deforestation for agriculture and logging destroys biodiversity and carbon sinks; industrial fishing depletes marine ecosystems. The environmental costs are typically externalized — paid by local communities and future generations rather than extraction companies. In colonial and post-colonial contexts, the most severe extraction-driven environmental degradation typically occurs in regions with the least political power to resist it.',
    confidence: 'high' },

  // CIA cross-scope mechanism edges
  { id: 'manufactured_consent__central_intelligence_agency',
    source: 'manufactured_consent', target: 'central_intelligence_agency', type: 'ENABLED',
    label: 'The CIA ran propaganda and media manipulation programs as standard tools of covert operations',
    note: 'The CIA institutionalized manufactured consent as a covert tool: Operation Mockingbird (documented by the Church Committee) paid journalists and placed assets in major American and international news organizations; Radio Free Europe and Radio Liberty were CIA fronts; the Congress for Cultural Freedom (backed by CIA) funded intellectual magazines and cultural events to promote liberal anti-communism. The CIA\'s media operations operated on the understanding that controlling the information environment is as important as military operations — manufactured consent as a form of bloodless regime change at home and abroad.',
    confidence: 'high' },
];

// ── Health edges ──────────────────────────────────────────────────────────
const newHealthEdges = [
  // ACEs
  { id: 'adverse_childhood_experiences__collective_trauma',
    source: 'adverse_childhood_experiences', target: 'collective_trauma', type: 'SHARES_MECHANISM_WITH',
    label: 'ACEs and collective trauma both demonstrate how early traumatic experience reshapes neurological and psychological development',
    note: 'ACEs and collective trauma share the fundamental mechanism: early traumatic experience (before coping systems are developed) produces lasting neurological, psychological, and physical changes. ACE research (CDC-Kaiser 1998) established dose-response: higher ACE scores predict higher rates of heart disease, cancer, mental illness, addiction, and early death. Collective trauma research shows similar intergenerational transmission: communities with high collective trauma (war, displacement, persistent discrimination) show elevated ACE rates in subsequent generations. The shared mechanism is trauma\'s neurobiological effect — HPA axis dysregulation, cortisol response changes — regardless of whether trauma is individual or collective.',
    confidence: 'high' },
  { id: 'adverse_childhood_experiences__narcissistic_abuse',
    source: 'adverse_childhood_experiences', target: 'narcissistic_abuse', type: 'ENABLED',
    label: 'High ACE scores are strongly associated with vulnerability to narcissistic abuse in adult relationships',
    note: 'ACEs create psychological vulnerabilities that increase risk of becoming targets of narcissistic abuse in adulthood: disrupted attachment (ACE-related) reduces the secure base that enables recognition and escape from abusive relationships; trauma bonding mechanisms (intermittent reinforcement creating strong attachment to abusers) are easier to establish in people with early attachment disruption; people with high ACEs often have underdeveloped boundaries and over-responsibility for others\' emotions that narcissistic abusers exploit. ACE research provides the developmental pathway explaining why early trauma increases adult relationship victimization risk.',
    confidence: 'high' },

  // Conversion therapy
  { id: 'conversion_therapy__evangelical_christianity',
    source: 'conversion_therapy', target: 'evangelical_christianity', type: 'ENABLED',
    label: 'Evangelical Christianity provided the theological motivation and institutional infrastructure for conversion therapy practices',
    note: 'Conversion therapy was primarily organized and promoted by evangelical Christian organizations: Exodus International (largest conversion therapy network, shut down in 2013 with apology); Focus on the Family; American Family Association; various "ex-gay" ministries. The theological motivation is the belief that homosexuality is sinful and therefore changeable through prayer and behavioral modification. The institutional infrastructure is the evangelical church network. When Exodus International shut down with a public apology, its president acknowledged that conversion therapy caused lasting harm without producing the orientation change it promised — a remarkable institutional admission of harm.',
    confidence: 'high' },
  { id: 'conversion_therapy__anti_psychiatry_movement',
    source: 'conversion_therapy', target: 'anti_psychiatry_movement', type: 'SHARES_MECHANISM_WITH',
    label: 'Both conversion therapy and anti-psychiatry reject psychiatric establishment authority, though for opposite ideological reasons',
    note: 'Conversion therapy and the anti-psychiatry movement both challenge psychiatric establishment authority, representing different failures of the therapeutic relation. Anti-psychiatry (Szasz, Laing, Foucault) critiques psychiatry as social control dressed as medicine — pathologizing normal variation and deviance. Conversion therapy inverts this: it treats non-pathological variation (homosexuality, which APA removed from DSM in 1973) as pathology requiring treatment. Both challenge psychiatric authority but in opposite directions: anti-psychiatry expands what counts as normal; conversion therapy contracts it. Both demonstrate that psychiatric diagnosis is politically contested rather than purely scientific.',
    confidence: 'medium' },
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
[...pe,...he,...me,...hle].forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source, '(edge:', e.id+')'); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target, '(edge:', e.id+')'); orphans++; }
});
console.log('Total orphans:', orphans);
