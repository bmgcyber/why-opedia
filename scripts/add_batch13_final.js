#!/usr/bin/env node
// add_batch13_final.js — mass incarceration, apartheid detail, Palestinian conflict,
//   Simone de Beauvoir/second wave feminism, Stonewall, prison industrial complex,
//   pharmaceutical industry, welfare state European model, Cold War culture
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const pn = JSON.parse(fs.readFileSync(D('data/global/politics/nodes.json')));
const hn = JSON.parse(fs.readFileSync(D('data/global/history/nodes.json')));
const mn = JSON.parse(fs.readFileSync(D('data/mechanisms/nodes.json')));
const psn = JSON.parse(fs.readFileSync(D('data/global/psychology/nodes.json')));
const hln = JSON.parse(fs.readFileSync(D('data/global/health/nodes.json')));

const pe = JSON.parse(fs.readFileSync(D('data/global/politics/edges.json')));
const he = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const pse = JSON.parse(fs.readFileSync(D('data/global/psychology/edges.json')));
const hle = JSON.parse(fs.readFileSync(D('data/global/health/edges.json')));

const pnIds = new Set(pn.map(n=>n.id));
const hnIds = new Set(hn.map(n=>n.id));
const mnIds = new Set(mn.map(n=>n.id));
const psnIds = new Set(psn.map(n=>n.id));
const hlnIds = new Set(hln.map(n=>n.id));
const peIds = new Set(pe.map(e=>e.id));
const heIds = new Set(he.map(e=>e.id));
const meIds = new Set(me.map(e=>e.id));
const pseIds = new Set(pse.map(e=>e.id));
const hleIds = new Set(hle.map(e=>e.id));

// ── New Politics nodes ────────────────────────────────────────────────────
const newPolitNodes = [
  {
    id: 'mass_incarceration',
    label: 'Mass Incarceration',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1970s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Incarceration_in_the_United_States',
    summary: 'US has world\'s highest incarceration rate; 2.3 million incarcerated (2020), disproportionately Black and Latino; produced by War on Drugs, mandatory minimums, three-strikes laws; Michelle Alexander\'s "The New Jim Crow" frames it as racial control system.',
    tags: ['prison', 'mass incarceration', 'war on drugs', 'mandatory minimum', 'racial justice', 'prison industrial complex', 'michelle alexander']
  },
  {
    id: 'stonewall',
    label: 'Stonewall Riots',
    node_type: 'event',
    category: 'event',
    decade: '1960s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Stonewall_riots',
    summary: 'June 1969 uprising by LGBTQ patrons against police raid at the Stonewall Inn, Greenwich Village; catalyzed the modern LGBTQ rights movement; produced Gay Liberation Front, Gay Activists Alliance; marked by transgender women and drag queens of color leading the resistance.',
    tags: ['stonewall', 'lgbtq', '1969', 'police', 'gay liberation', 'marsha p johnson', 'transgender', 'resistance']
  },
  {
    id: 'second_wave_feminism',
    label: 'Second Wave Feminism',
    node_type: 'movement',
    category: 'movement',
    decade: '1960s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Second-wave_feminism',
    summary: 'Feminist movement (1960s-1980s) broadening from suffrage to reproductive rights, workplace equality, domestic violence, and the personal-is-political; Betty Friedan, Gloria Steinem, Simone de Beauvoir; produced Roe v. Wade, Title IX, workplace harassment law.',
    tags: ['feminism', 'womens liberation', 'reproductive rights', 'title ix', 'ERA', 'Betty Friedan', 'Gloria Steinem', 'consciousness raising']
  },
  {
    id: 'israel_palestine',
    label: 'Israel-Palestine Conflict',
    node_type: 'conflict',
    category: 'conflict',
    decade: '1940s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Israeli%E2%80%93Palestinian_conflict',
    summary: 'Ongoing conflict between Israeli state and Palestinian people over land, sovereignty, and rights; rooted in 1948 establishment of Israel and displacement of 700,000 Palestinians (Nakba); characterized by occupation, settlements, blockade, and periodic wars.',
    tags: ['israel', 'palestine', 'occupation', 'settlements', 'nakba', 'Gaza', 'West Bank', 'two-state', 'apartheid']
  },
];

// ── New History nodes ─────────────────────────────────────────────────────
const newHistNodes = [
  {
    id: 'cold_war_culture',
    label: 'Cold War Culture',
    node_type: 'era',
    category: 'era',
    decade: '1950s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Cold_War_(1947%E2%80%931953)',
    summary: 'Cultural dimensions of the Cold War: conformist suburban ideology, nuclear anxiety, science fiction, jazz as US propaganda, abstract expressionism funded by CIA as cultural weapon; the ideology of "the American Way of Life" as counter to communism.',
    tags: ['cold war', 'culture', 'conformism', 'suburbia', 'nuclear anxiety', 'propaganda', 'jazz', 'abstract expressionism', 'CIA']
  },
  {
    id: 'cambodian_genocide',
    label: 'Cambodian Genocide',
    node_type: 'event',
    category: 'event',
    decade: '1970s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Cambodian_genocide',
    summary: 'Khmer Rouge genocide (1975-1979) killed 1.5-2 million Cambodians (25% of population); radical agrarian utopia through forced labor and purge of educated class; enabled by US bombing of Cambodia that destabilized the country and helped Khmer Rouge rise.',
    tags: ['cambodia', 'khmer rouge', 'pol pot', 'genocide', 'year zero', 'agrarian', 'killing fields', 'vietnam war', 'US bombing']
  },
  {
    id: 'decolonization_africa',
    label: 'African Decolonization',
    node_type: 'era',
    category: 'era',
    decade: '1950s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Decolonisation_of_Africa',
    summary: 'Wave of African independence from European colonial rule (1950s-1970s); 54 countries becoming independent; Kwame Nkrumah, Patrice Lumumba, Julius Nyerere as defining leaders; struggled with colonial borders, neocolonialism, and Cold War proxy wars.',
    tags: ['africa', 'independence', 'colonial', 'nkrumah', 'lumumba', 'pan-africanism', 'OAU', 'borders', 'neocolonialism']
  },
];

// ── New Mechanism nodes ───────────────────────────────────────────────────
const newMechNodes = [
  {
    id: 'prison_industrial_complex',
    label: 'Prison Industrial Complex',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1990s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Prison%E2%80%93industrial_complex',
    summary: 'Self-reinforcing system of economic and political interests benefiting from mass incarceration: private prison companies, guard unions, rural economies dependent on prison jobs, prosecutors with conviction incentives; maintains high incarceration independent of crime rates.',
    tags: ['prison', 'industrial complex', 'private prison', 'mass incarceration', 'political economy', 'lobby', 'ALEC', 'racial justice']
  },
  {
    id: 'pharmaceutical_industry',
    label: 'Pharmaceutical Industry',
    node_type: 'institution',
    category: 'institution',
    decade: '1950s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Pharmaceutical_industry',
    summary: 'Industry producing drugs for profit; conflict between commercial incentives and public health goals; responsible for both life-saving innovations and the opioid crisis, insulin price gouging, and strategic disease manufacturing for lifestyle drugs.',
    tags: ['pharma', 'drug pricing', 'clinical trials', 'FDA', 'opioid', 'profit motive', 'disease mongering', 'patent']
  },
];

// ── New Psychology nodes ──────────────────────────────────────────────────
const newPsychNodes = [
  {
    id: 'feminist_theory',
    label: 'Feminist Theory',
    node_type: 'ideology',
    category: 'ideology',
    decade: '1960s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Feminist_theory',
    summary: 'Theoretical framework analyzing gender oppression and its intersections with race, class, and sexuality; from liberal feminism (equal rights) to radical feminism (patriarchy as root oppression) to intersectional feminism (interlocking oppressions).',
    tags: ['feminism', 'patriarchy', 'intersectionality', 'gender', 'de Beauvoir', 'hooks', 'Crenshaw', 'oppression', 'liberation']
  },
];

// ── New Health nodes ──────────────────────────────────────────────────────
const newHealthNodes = [
  {
    id: 'chronic_illness_policy',
    label: 'Chronic Illness & Disability Policy',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1990s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Chronic_condition',
    summary: 'Political and policy dimensions of chronic illness: insurance discrimination, disability benefit systems, ADA accommodation, the medicalization of normal variation, and the political economy of treating vs. preventing chronic disease.',
    tags: ['chronic illness', 'disability', 'insurance', 'ADA', 'medicalization', 'prevention', 'long-term care', 'social determinants']
  },
];

// ── Politics edges ────────────────────────────────────────────────────────
const newPolitEdges = [
  // mass_incarceration
  { id: 'mass_incarceration__war_on_drugs',
    source: 'mass_incarceration', target: 'war_on_drugs', type: 'PRODUCED',
    label: 'The War on Drugs directly produced mass incarceration through mandatory minimums, three-strikes laws, and aggressive prosecution',
    note: 'Mass incarceration is substantially a product of War on Drugs policy: US incarceration rates were similar to Western Europe until the mid-1970s; the sharp divergence began with Nixon\'s drug war and accelerated under Reagan (mandatory minimums 1986, three-strikes 1994 crime bill); drug offenses now constitute 45% of federal prison population; the crack/powder cocaine sentencing disparity (100:1) produced disproportionate Black incarceration. Michelle Alexander\'s analysis: mass incarceration functions as a racial caste system — felony conviction permanently strips voting rights, access to public housing, student loans, and employment, creating a permanent underclass from communities targeted by drug enforcement.',
    confidence: 'high' },
  { id: 'mass_incarceration__prison_industrial_complex',
    source: 'mass_incarceration', target: 'prison_industrial_complex', type: 'PRODUCED',
    label: 'Mass incarceration created the prison industrial complex — an economic system that profits from incarceration and lobbies to maintain high prison populations',
    note: 'Mass incarceration produced the prison industrial complex through scale: when incarceration reached 2 million, it became a significant economic sector; private prison companies (CCA, GEO Group) emerged to profit from incarceration; prison guard unions lobbied against sentencing reform; rural communities built economic development strategies around prison jobs; ALEC (American Legislative Exchange Council) coordinated private prison companies and state legislators to write mandatory minimum and three-strikes legislation. The prison industrial complex is self-perpetuating: the political and economic interests created by mass incarceration lobby to maintain the policies that produce it.',
    confidence: 'high' },
  { id: 'mass_incarceration__jim_crow',
    source: 'mass_incarceration', target: 'jim_crow', type: 'SHARES_MECHANISM_WITH',
    label: 'Michelle Alexander\'s "The New Jim Crow" thesis: mass incarceration reproduces racial hierarchy through the criminal justice system rather than explicit legal segregation',
    note: 'Alexander\'s argument: Jim Crow was struck down by civil rights legislation but replaced by mass incarceration as the mechanism of racial social control; both systems: (1) target Black communities through racially discriminatory enforcement (drug arrest rates are racially disparate despite similar usage rates); (2) use legal systems rather than extralegal violence; (3) create secondary civil disabilities (felony disenfranchisement, public benefits exclusion) that maintain racial hierarchy after formal legal equality; (4) are structured by official colorblindness that renders racial intent invisible. The comparison is analytically contested but the structural parallels — legal system producing racial hierarchy through nominally race-neutral mechanisms — have been widely documented.',
    confidence: 'high' },

  // stonewall
  { id: 'stonewall__lgbtq_rights_movement',
    source: 'stonewall', target: 'lgbtq_rights_movement', type: 'PRODUCED',
    label: 'Stonewall catalyzed the modern LGBTQ rights movement by transforming defensive resistance into organized political mobilization',
    note: 'Stonewall was the organizational origin of the LGBTQ rights movement: the pre-Stonewall homophile movement (Mattachine Society, Daughters of Bilitis) pursued respectability politics and legal gradualism; Stonewall produced a new generation of confrontational organizers (Gay Liberation Front, Gay Activists Alliance); the anniversary of Stonewall became Pride (first march 1970); the Stonewall generation built the political infrastructure (congressional lobbying, legal organizations, media presence) that produced the movement\'s subsequent victories. Stonewall demonstrated that queer people would resist police violence — this assertion of dignity was the emotional and political foundation of everything that followed.',
    confidence: 'high' },
  { id: 'stonewall__aids_crisis',
    source: 'stonewall', target: 'aids_crisis', type: 'ENABLED',
    label: 'The Stonewall generation\'s political infrastructure was mobilized against AIDS, transforming ACT UP into the most effective medical advocacy movement in history',
    note: 'The Stonewall generation\'s organizational infrastructure was essential to the AIDS crisis response: ACT UP (AIDS Coalition to Unleash Power, 1987) deployed Stonewall-derived tactics (direct action, civil disobedience, media confrontation) against FDA drug approval delays; activists became expert enough in FDA procedures to demand and win accelerated approval processes; the treatment advocacy infrastructure activists built (treatment protocols, clinical trial access, drug pricing negotiations) permanently transformed patient advocacy. Without Stonewall-era organizing infrastructure and the political experience of the 1970s LGBT movement, the AIDS crisis response would have been much slower. The crisis was partly resisted because the community had built political capacity through post-Stonewall organizing.',
    confidence: 'high' },

  // second wave feminism
  { id: 'second_wave_feminism__roe_v_wade',
    source: 'second_wave_feminism', target: 'roe_v_wade', type: 'PRODUCED',
    label: 'Second wave feminism\'s reproductive rights activism produced the legal and political conditions for Roe v. Wade',
    note: 'Second wave feminism produced Roe v. Wade through sustained activism: NOW (founded 1966) made abortion rights a central demand; women\'s liberation consciousness-raising groups connected abortion access to women\'s liberation broadly; state-level abortion rights campaigns (New York repealed abortion ban 1970) created legal precedents; feminist lawyers (Ruth Bader Ginsburg was not the Roe attorney but was part of the broader feminist legal movement) framed reproductive rights as constitutional liberty; the case was decided in 1973 at the movement\'s height. The reversal in Dobbs (2022) came only after decades of anti-abortion movement building specifically targeting the judiciary.',
    confidence: 'high' },
  { id: 'second_wave_feminism__culture_wars',
    source: 'second_wave_feminism', target: 'culture_wars', type: 'ENABLED',
    label: 'Second wave feminism\'s challenges to traditional gender roles produced the conservative backlash that became the culture wars',
    note: 'Second wave feminism\'s challenges produced organized conservative backlash that became the culture wars: Phyllis Schlafly mobilized against the Equal Rights Amendment (1972-1982) using the argument that feminism threatened traditional family values; the ERA\'s defeat (failed ratification 1982) marked the first major culture war victory; the Moral Majority\'s founding (1979) was explicitly a response to feminist and gay rights advances; "family values" politics was culturally constructed against the feminist challenge to traditional gender roles; anti-abortion politics was embedded in the broader anti-feminist backlash. The culture wars are substantially feminism\'s cultural challenge producing and sustaining organized conservative political opposition.',
    confidence: 'high' },

  // israel-palestine
  { id: 'zionism__israel_palestine',
    source: 'zionism', target: 'israel_palestine', type: 'PRODUCED',
    label: 'Zionism\'s practical implementation through Israeli state-building produced the Israel-Palestine conflict through land displacement',
    note: 'The Israel-Palestine conflict was produced by Zionism\'s intersection with existing Palestinian Arab population: Zionist immigration to Ottoman/British Mandate Palestine (1880s-1948) created demographic and political conflict with Arab residents; the 1948 Israeli War of Independence and Nakba (Palestinian catastrophe — 700,000 displaced) established the conflict\'s structural parameters; subsequent wars (1967 Six-Day War establishing occupation of West Bank and Gaza) deepened it. The conflict is the product of two legitimate historical claims — Jewish national self-determination and Palestinian indigenous rights — in an arena where British imperial promises (Balfour Declaration, Hussein-McMahon correspondence) created incompatible commitments.',
    confidence: 'high' },
  { id: 'israel_palestine__apartheid_south_africa',
    source: 'israel_palestine', target: 'apartheid_south_africa', type: 'SHARES_MECHANISM_WITH',
    label: 'Human rights organizations including Amnesty International and B\'Tselem have characterized Israel\'s occupation as apartheid',
    note: 'The apartheid characterization of Israeli occupation is analytically contested but increasingly mainstream in human rights discourse: Amnesty International (2022), Human Rights Watch (2021), and B\'Tselem (Israeli human rights org) have formally characterized Israeli control over Palestinians as apartheid based on: fragmented territorial control (areas A, B, C in West Bank); differential legal systems (Israeli civil law for settlers, military law for Palestinians in same territory); movement restrictions (checkpoints, separation barrier); settlement expansion on Palestinian land. South African apartheid veterans have explicitly made the comparison. The debate over the term is itself politically significant — it reflects the tension between Israel\'s international support and the documented conditions of occupation.',
    confidence: 'high' },
];

// ── History edges ─────────────────────────────────────────────────────────
const newHistEdges = [
  // Cold War culture
  { id: 'cold_war__cold_war_culture',
    source: 'cold_war', target: 'cold_war_culture', type: 'PRODUCED',
    label: 'The Cold War produced a specific cultural formation: suburban conformism, nuclear anxiety, and deliberate US cultural propaganda',
    note: 'The Cold War shaped American culture systematically: suburbanization was partly Cold War dispersal strategy (urban concentration vulnerable to nuclear attack); the "American Way of Life" (home ownership, consumer goods, family stability) was explicitly promoted as the antithesis of Soviet communism; the CIA funded cultural production (Congress for Cultural Freedom, abstract expressionism) as democracy demonstration; nuclear anxiety pervaded 1950s-60s culture (fallout shelters, duck-and-cover drills, nuclear themed films); McCarthyism\'s cultural impact extended beyond politics to film, television, and literature (Hollywood blacklist). The Cold War produced the cultural conformism of the 1950s that the 1960s counterculture was reacting against.',
    confidence: 'high' },
  { id: 'cold_war_culture__manufactured_consent',
    source: 'cold_war_culture', target: 'manufactured_consent', type: 'ENABLED',
    label: 'Cold War cultural formation required and produced manufactured consent — the active construction of "American Way of Life" ideology against communist alternative',
    note: 'Cold War manufactured consent was systematic: the Advertising Council and corporate PR created the "People\'s Capitalism" campaign (1955) to demonstrate American prosperity to domestic and international audiences; Voice of America and Radio Free Europe were manufactured consent operations aimed at communist bloc populations; Hollywood\'s HUAC cooperation and the blacklist produced cinema aligned with Cold War ideology; the corporate-liberal consensus (excluding socialist options from political debate) was manufactured consent structurally — not through censorship but through defining the acceptable range of political discourse. Chomsky and Herman\'s manufactured consent framework was developed partly through analysis of Cold War media operations.',
    confidence: 'high' },

  // cambodian genocide
  { id: 'vietnam_war__cambodian_genocide',
    source: 'vietnam_war', target: 'cambodian_genocide', type: 'PRODUCED',
    label: 'US bombing of Cambodia destabilized the country and helped bring the Khmer Rouge to power',
    note: 'The causal chain from Vietnam War to Cambodian Genocide is documented: Nixon and Kissinger authorized secret bombing of Cambodia (Operation Menu, 1969-1973, 2.7 million tons of bombs) to destroy Vietnamese supply lines; the bombing destabilized Cambodia\'s neutral government (Sihanouk), drove rural population toward the Khmer Rouge, and killed tens of thousands of civilians; the subsequent US-backed coup (Lon Nol) further destabilized the country; the Khmer Rouge emerged from this chaos. When the Khmer Rouge took power (1975), their radical ideology was shaped partly by the trauma of US bombing and partly by radical Maoist ideology their French-educated leaders had developed. The US was not simply innocent bystander to the Cambodian Genocide.',
    confidence: 'high' },
  { id: 'cambodian_genocide__dehumanization',
    source: 'cambodian_genocide', target: 'dehumanization', type: 'ENABLED',
    label: 'Khmer Rouge Year Zero ideology and dehumanization of the educated class enabled mass killing of own population',
    note: 'The Cambodian Genocide used distinctive dehumanization: Khmer Rouge "Year Zero" ideology erased the past and declared the educated, urban, and professional classes as "new people" (second-class citizens or enemies) vs. "old people" (peasant base); wearing glasses was evidence of education (death sentence); speaking French was grounds for execution; "base people" vs. "new people" created a hierarchy where the urban population were systematically dehumanized as corrupted by capitalism and foreign influence. The genocide killed 25% of Cambodia\'s population — one of history\'s most intensive mass killings — enabled by the ideological framework that made educated people alien parasites to be eliminated.',
    confidence: 'high' },

  // African decolonization
  { id: 'decolonization_movement__decolonization_africa',
    source: 'decolonization_movement', target: 'decolonization_africa', type: 'PRODUCED',
    label: 'African decolonization was the largest single wave of the global decolonization movement',
    note: 'African decolonization (1951-1994) was the global decolonization movement\'s largest event by number of states: 54 African countries achieved independence from European colonial rule; "The Africa of the 1960s" saw 17 countries become independent in a single year (1960, "the year of Africa"); the OAU (Organization of African Unity, 1963) was the pan-African institutional expression; Kwame Nkrumah\'s Ghana (1957, first sub-Saharan independence) was the vanguard. African decolonization was simultaneously more complete (formal political independence) and more limited (neocolonial economic structures, Cold War penetration, colonial borders producing ethnic conflict) than independence leaders had hoped. The gap between formal independence and substantive sovereignty defined post-colonial African political history.',
    confidence: 'high' },
  { id: 'berlin_conference_1884__decolonization_africa',
    source: 'berlin_conference_1884', target: 'decolonization_africa', type: 'ENABLED',
    label: 'The Berlin Conference\'s arbitrary colonial borders became the basis for post-independence African states, producing ongoing ethnic and territorial conflicts',
    note: 'The Berlin Conference created the borders that haunt African decolonization: the Scramble for Africa (1884-1914) divided the continent among European powers with straight lines drawn on maps by people who had never visited most of the territory; these lines divided ethnic groups between different colonies, creating minorities in each (Yoruba across Nigeria/Benin/Togo; Somali across Somalia/Ethiopia/Kenya/Djibouti; Tuareg across Mali/Niger/Algeria/Libya); the OAU\'s 1964 decision to preserve colonial borders to prevent unlimited territorial revision means African states continue to govern within colonial administrative boundaries that reflect no historical, ethnic, or geographic logic. The Berlin Conference\'s arbitrary cartography is a root cause of African state fragility.',
    confidence: 'high' },
];

// ── Mechanism edges ───────────────────────────────────────────────────────
const newMechEdges = [
  // prison industrial complex
  { id: 'prison_industrial_complex__mass_incarceration',
    source: 'prison_industrial_complex', target: 'mass_incarceration', type: 'ENABLED',
    label: 'Prison industrial complex lobbying maintains mass incarceration policies that serve political and economic interests over public safety',
    note: 'The prison industrial complex perpetuates mass incarceration through institutional lobbying: CCA (now CoreCivic) and GEO Group directly lobbied for immigration detention expansion (profiting from ICE contracts); ALEC wrote and promoted mandatory minimum and three-strikes legislation with private prison companies at the table; California Correctional Peace Officers Association (guard union) has been the largest single contributor to California ballot initiatives opposing prison reform; rural prison economy opposition to prison closure. The result is that incarceration rates are maintained at economically and politically convenient levels rather than crime-justified levels — mass incarceration is sustained by institutional interests that profit from it.',
    confidence: 'high' },
  { id: 'prison_industrial_complex__war_on_drugs',
    source: 'prison_industrial_complex', target: 'war_on_drugs', type: 'ENABLED',
    label: 'Prison industrial complex interests lobbied specifically to maintain drug criminalization policies that maximize incarceration',
    note: 'Prison industrial complex lobbying is specifically targeted at drug policy: private prison companies lobbied against marijuana legalization (would reduce incarceration); ALEC wrote and promoted mandatory minimum drug sentencing laws; three-strikes laws (requiring third-conviction life imprisonment) were often for drug offenses; immigration detention expansion was partly driven by the same private prison industry that benefits from drug incarceration. Drug policy reform threatens the prison industrial complex\'s economic model — every person not incarcerated for drug offenses is revenue loss for private prisons, guard union employment, and the rural economies that depend on prison jobs.',
    confidence: 'high' },

  // pharmaceutical industry
  { id: 'pharmaceutical_industry__opioid_crisis',
    source: 'pharmaceutical_industry', target: 'opioid_crisis', type: 'PRODUCED',
    label: 'The opioid crisis was a pharmaceutical industry crime: Purdue Pharma knowingly marketed an addictive drug with false safety claims',
    note: 'The opioid crisis is primarily a pharmaceutical industry failure: Purdue Pharma knew by 1999 that OxyContin produced addiction and diversion at high rates; the company suppressed research, lied to doctors and regulators, and paid salespeople based on prescription volumes with no accountability for addiction outcomes; the Sackler family extracted $10-13 billion from Purdue while the crisis killed 500,000+ Americans; Purdue pleaded guilty to federal criminal charges (2020); the Sackler family paid $6 billion in settlement but retained most wealth. The pharmaceutical industry\'s broader business model (disease marketing, off-label promotion, clinical trial manipulation, patent evergreening) creates systematic incentives to maximize sales over patient welfare.',
    confidence: 'high' },
  { id: 'pharmaceutical_industry__regulatory_capture',
    source: 'pharmaceutical_industry', target: 'regulatory_capture', type: 'ENABLED',
    label: 'The pharmaceutical industry has systematically captured the FDA through revolving door, clinical trial funding, and user fee model',
    note: 'Pharmaceutical regulatory capture is systemic: the Prescription Drug User Fee Act (1992) created a system where pharmaceutical companies pay FDA user fees to fund drug review — creating financial dependency; FDA reviewers routinely move to industry positions (revolving door); clinical trials are predominantly funded by pharmaceutical companies rather than independent researchers; medical journal peer review is compromised by industry funding; key opinion leaders (KOLs) are paid as industry speakers while being cited as independent experts. The 2020 opioid crisis congressional investigation documented specific instances of industry influence on FDA drug scheduling and approval decisions. The FDA is the paradigm case of regulatory capture in a life-or-death regulatory context.',
    confidence: 'high' },
];

// ── Psychology edges ──────────────────────────────────────────────────────
const newPsychEdges = [
  // feminist theory
  { id: 'feminist_theory__intersectionality',
    source: 'feminist_theory', target: 'intersectionality', type: 'PRODUCED',
    label: 'Intersectionality theory was developed within feminist theory by Kimberle Crenshaw to explain how race and gender interact in producing oppression',
    note: 'Intersectionality emerged from feminist theory\'s encounter with its own racial blind spots: Kimberle Crenshaw\'s 1989 paper "Demarginalizing the Intersection of Race and Sex" documented that Black women were excluded from both race discrimination doctrine (which centered Black men) and sex discrimination doctrine (which centered white women); her 1991 "Mapping the Margins" extended this to domestic violence. Intersectionality was a corrective to white feminist theory\'s assumed universality of women\'s experience. Bell hooks, Patricia Hill Collins, and other Black feminist theorists had been making similar arguments since the 1970s (Combahee River Collective Statement, 1977). Intersectionality moved from feminist legal theory to mainstream use (and subsequent right-wing weaponization).',
    confidence: 'high' },
  { id: 'feminist_theory__second_wave_feminism',
    source: 'feminist_theory', target: 'second_wave_feminism', type: 'ENABLED',
    label: 'Second wave feminism generated the theoretical frameworks (patriarchy, personal-is-political, consciousness raising) that feminist theory systematized',
    note: 'Second wave feminism and feminist theory are mutually constitutive: the movement generated concepts (consciousness-raising groups produced the "personal is political" insight; radical feminism produced patriarchy analysis; socialist feminism produced the sex/gender distinction) that feminist theorists systematized; academic feminist theory (women\'s studies departments, founded 1970s) developed the movement\'s insights into formal theory; theory then influenced movement (intersectionality critique changed movement practice). Simone de Beauvoir\'s "The Second Sex" (1949) was the second wave\'s foundational theoretical text; Betty Friedan\'s "Feminine Mystique" (1963) was its popular mobilizer. Theory and movement developed through ongoing exchange.',
    confidence: 'high' },
];

// ── Health edges ──────────────────────────────────────────────────────────
const newHealthEdges = [
  // chronic illness policy
  { id: 'chronic_illness_policy__adverse_childhood_experiences',
    source: 'chronic_illness_policy', target: 'adverse_childhood_experiences', type: 'ENABLED',
    label: 'ACE research demonstrates that chronic illness is substantially produced by social conditions, requiring policy responses upstream of medical treatment',
    note: 'Chronic illness policy is transformed by ACE research: if high-ACE individuals have dramatically elevated chronic disease risk regardless of individual health behaviors, then chronic disease prevention requires addressing the social conditions that produce ACEs (poverty, domestic violence, substance abuse, incarceration) rather than only targeting individual-level behavior change. This "upstream" logic challenges the healthcare system\'s downstream focus (treating disease after it occurs); public health approaches using ACE screening and trauma-informed care are more cost-effective than managing chronic conditions in adulthood. ACE-informed chronic illness policy integrates social determinants of health into disease prevention in ways that challenge the medical model\'s individualism.',
    confidence: 'high' },
  { id: 'chronic_illness_policy__single_payer_healthcare',
    source: 'chronic_illness_policy', target: 'single_payer_healthcare', type: 'ENABLED',
    label: 'Chronic illness management demonstrably benefits from coordinated universal coverage rather than fragmented private insurance',
    note: 'Chronic illness is the primary healthcare utilization driver: 86% of US healthcare spending is for chronic disease; managing chronic conditions (diabetes, heart disease, COPD, mental illness) requires consistent long-term care that private insurance fragmentation actively prevents (insurance switching means no continuity of care; cost-sharing delays care until conditions worsen; prior authorization creates delays in needed treatment). Universal single-payer systems produce better chronic disease outcomes: diabetes management in Canada vs. US shows equivalent clinical guidelines producing better outcomes in Canada because coverage continuity enables consistent management. Chronic illness management is the practical argument for universal coverage.',
    confidence: 'high' },
];

// ── Write all files ───────────────────────────────────────────────────────
let pnAdded=0, hnAdded=0, mnAdded=0, psnAdded=0, hlnAdded=0;
let peAdded=0, heAdded=0, meAdded=0, pseAdded=0, hleAdded=0;

newPolitNodes.forEach(n => { if (!pnIds.has(n.id)) { pn.push(n); pnIds.add(n.id); pnAdded++; } });
newHistNodes.forEach(n => { if (!hnIds.has(n.id)) { hn.push(n); hnIds.add(n.id); hnAdded++; } });
newMechNodes.forEach(n => { if (!mnIds.has(n.id)) { mn.push(n); mnIds.add(n.id); mnAdded++; } });
newPsychNodes.forEach(n => { if (!psnIds.has(n.id)) { psn.push(n); psnIds.add(n.id); psnAdded++; } });
newHealthNodes.forEach(n => { if (!hlnIds.has(n.id)) { hln.push(n); hlnIds.add(n.id); hlnAdded++; } });

newPolitEdges.forEach(e => { if (!peIds.has(e.id)) { pe.push(e); peIds.add(e.id); peAdded++; } });
newHistEdges.forEach(e => { if (!heIds.has(e.id)) { he.push(e); heIds.add(e.id); heAdded++; } });
newMechEdges.forEach(e => { if (!meIds.has(e.id)) { me.push(e); meIds.add(e.id); meAdded++; } });
newPsychEdges.forEach(e => { if (!pseIds.has(e.id)) { pse.push(e); pseIds.add(e.id); pseAdded++; } });
newHealthEdges.forEach(e => { if (!hleIds.has(e.id)) { hle.push(e); hleIds.add(e.id); hleAdded++; } });

fs.writeFileSync(D('data/global/politics/nodes.json'), JSON.stringify(pn, null, 2));
fs.writeFileSync(D('data/global/history/nodes.json'), JSON.stringify(hn, null, 2));
fs.writeFileSync(D('data/mechanisms/nodes.json'), JSON.stringify(mn, null, 2));
fs.writeFileSync(D('data/global/psychology/nodes.json'), JSON.stringify(psn, null, 2));
fs.writeFileSync(D('data/global/health/nodes.json'), JSON.stringify(hln, null, 2));
fs.writeFileSync(D('data/global/politics/edges.json'), JSON.stringify(pe, null, 2));
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(he, null, 2));
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
fs.writeFileSync(D('data/global/psychology/edges.json'), JSON.stringify(pse, null, 2));
fs.writeFileSync(D('data/global/health/edges.json'), JSON.stringify(hle, null, 2));

console.log('Politics: +'+pnAdded+' nodes, +'+peAdded+' edges -> '+pn.length+' nodes, '+pe.length+' edges');
console.log('History: +'+hnAdded+' nodes, +'+heAdded+' edges -> '+hn.length+' nodes, '+he.length+' edges');
console.log('Mechanisms: +'+mnAdded+' nodes, +'+meAdded+' edges -> '+mn.length+' nodes, '+me.length+' edges');
console.log('Psychology: +'+psnAdded+' nodes, +'+pseAdded+' edges -> '+psn.length+' nodes, '+pse.length+' edges');
console.log('Health: +'+hlnAdded+' nodes, +'+hleAdded+' edges -> '+hln.length+' nodes, '+hle.length+' edges');

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
