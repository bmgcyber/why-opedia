#!/usr/bin/env node
// add_batch8_nodes.js — LGBTQ rights movement, apartheid, Nuremberg trials context,
//   Nelson Mandela, Martin Luther King, Malcolm X, nuclear weapons, Cold War proxy wars,
//   more mechanism edges cross-scope for new nodes
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const pn = JSON.parse(fs.readFileSync(D('data/global/politics/nodes.json')));
const hn = JSON.parse(fs.readFileSync(D('data/global/history/nodes.json')));
const mn = JSON.parse(fs.readFileSync(D('data/mechanisms/nodes.json')));
const psn = JSON.parse(fs.readFileSync(D('data/global/psychology/nodes.json')));

const pe = JSON.parse(fs.readFileSync(D('data/global/politics/edges.json')));
const he = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const pse = JSON.parse(fs.readFileSync(D('data/global/psychology/edges.json')));

const pnIds = new Set(pn.map(n=>n.id));
const hnIds = new Set(hn.map(n=>n.id));
const mnIds = new Set(mn.map(n=>n.id));
const psnIds = new Set(psn.map(n=>n.id));
const peIds = new Set(pe.map(e=>e.id));
const heIds = new Set(he.map(e=>e.id));
const meIds = new Set(me.map(e=>e.id));
const pseIds = new Set(pse.map(e=>e.id));

// ── New Politics nodes ────────────────────────────────────────────────────
const newPolitNodes = [
  {
    id: 'lgbtq_rights_movement',
    label: 'LGBTQ Rights Movement',
    node_type: 'movement',
    category: 'movement',
    decade: '1960s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/LGBT_rights_movement',
    summary: 'Civil rights movement for the legal and social equality of lesbian, gay, bisexual, transgender, and queer people; from Stonewall (1969) to marriage equality (2015) in the US; ongoing globally with severe persecution in many countries.',
    tags: ['lgbtq', 'gay rights', 'stonewall', 'marriage equality', 'trans rights', 'civil rights', 'aids crisis', 'discrimination']
  },
  {
    id: 'nuclear_weapons',
    label: 'Nuclear Weapons',
    node_type: 'technology',
    category: 'technology',
    decade: '1940s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Nuclear_weapon',
    summary: 'Weapons of mass destruction using nuclear fission or fusion; first deployed by the US against Hiroshima and Nagasaki (1945); shaped Cold War deterrence doctrine, arms race, and persistent existential risk.',
    tags: ['nuclear', 'atomic bomb', 'manhattan project', 'hiroshima', 'cold war', 'MAD', 'arms race', 'proliferation']
  },
  {
    id: 'cold_war_proxy_wars',
    label: 'Cold War Proxy Wars',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1950s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/List_of_proxy_wars',
    summary: 'Military conflicts fought between smaller nations or factions backed by the US and Soviet Union, using Third World countries as battlegrounds for superpower competition without direct confrontation; Korea, Vietnam, Angola, Afghanistan, Central America.',
    tags: ['proxy war', 'cold war', 'korea', 'vietnam', 'angola', 'afghanistan', 'nicaragua', 'superpower competition']
  },
];

// ── New History nodes ─────────────────────────────────────────────────────
const newHistNodes = [
  {
    id: 'nelson_mandela',
    label: 'Nelson Mandela',
    node_type: 'person',
    category: 'person',
    decade: '1960s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Nelson_Mandela',
    summary: 'South African anti-apartheid leader, imprisoned 27 years (1964-1990), first democratically elected President of South Africa (1994); symbol of resistance to racial oppression and political reconciliation.',
    tags: ['south africa', 'apartheid', 'ANC', 'robben island', 'reconciliation', 'truth commission', 'liberation', 'icon']
  },
  {
    id: 'martin_luther_king',
    label: 'Martin Luther King Jr.',
    node_type: 'person',
    category: 'person',
    decade: '1950s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Martin_Luther_King_Jr.',
    summary: 'American civil rights leader, Baptist minister, Nobel Peace Prize 1964; led Montgomery Bus Boycott, March on Washington, Selma marches; advocated nonviolent resistance; assassinated 1968; his legacy is contested between radical and sanitized versions.',
    tags: ['civil rights', 'nonviolence', 'MLK', 'I have a dream', 'march on washington', 'selma', 'vietnam', 'assassination']
  },
  {
    id: 'malcolm_x',
    label: 'Malcolm X',
    node_type: 'person',
    category: 'person',
    decade: '1950s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Malcolm_X',
    summary: 'Black Muslim minister and civil rights leader who advocated Black nationalism and self-defense against white supremacy; evolved from Nation of Islam separatism toward pan-African internationalism; assassinated 1965.',
    tags: ['black nationalism', 'nation of islam', 'self defense', 'civil rights', 'malcolm', 'pan-africanism', 'assassination', 'OAAU']
  },
  {
    id: 'hiroshima_nagasaki',
    label: 'Hiroshima & Nagasaki Bombings',
    node_type: 'event',
    category: 'event',
    decade: '1940s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Atomic_bombings_of_Hiroshima_and_Nagasaki',
    summary: 'First and only combat use of nuclear weapons; US dropped atomic bombs on Hiroshima (August 6) and Nagasaki (August 9) 1945, killing 130,000-226,000 people; ended WWII in the Pacific; began the nuclear age.',
    tags: ['atomic bomb', 'world war ii', 'japan', 'nuclear', 'truman', 'manhattan project', 'civilian deaths', 'deterrence']
  },
  {
    id: 'vietnam_war_protests',
    label: 'Vietnam War Protests',
    node_type: 'movement',
    category: 'movement',
    decade: '1960s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Opposition_to_United_States_involvement_in_the_Vietnam_War',
    summary: 'Mass antiwar movement against US involvement in Vietnam (1965-1975); included campus protests, draft resistance, Kent State massacre, veteran organizing; transformed public opinion and demonstrated that democratic societies could constrain militarism through protest.',
    tags: ['antiwar', 'vietnam', 'draft resistance', 'kent state', 'protest', '1960s', 'counterculture', 'draft']
  },
];

// ── New Mechanism nodes ───────────────────────────────────────────────────
const newMechNodes = [
  {
    id: 'nonviolent_resistance',
    label: 'Nonviolent Resistance',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1900s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Nonviolent_resistance',
    summary: 'Political strategy using noncooperation, civil disobedience, and moral persuasion rather than violence to achieve political change; theorized by Gandhi, practiced by MLK; statistical evidence shows it is more effective than violent revolution.',
    tags: ['gandhi', 'civil disobedience', 'satyagraha', 'MLK', 'boycott', 'sit-in', 'noncooperation', 'protest']
  },
  {
    id: 'legal_mobilization',
    label: 'Legal Mobilization',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1930s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Cause_lawyering',
    summary: 'Strategic use of litigation and legal systems to achieve social movement goals; NAACP Legal Defense Fund\'s Brown v. Board strategy; ACLU model; effective when courts are more accessible than legislatures.',
    tags: ['litigation', 'NAACP', 'ACLU', 'civil rights', 'test case', 'strategic litigation', 'Brown v Board', 'cause lawyering']
  },
];

// ── Politics edges ────────────────────────────────────────────────────────
const newPolitEdges = [
  // LGBTQ rights
  { id: 'lgbtq_rights_movement__culture_wars',
    source: 'lgbtq_rights_movement', target: 'culture_wars', type: 'ENABLED',
    label: 'LGBTQ rights became the primary battleground of the culture wars, with each legal advance producing organized religious-conservative backlash',
    note: 'LGBTQ rights and culture wars are structurally linked: each LGBTQ rights advance (civil union laws, marriage equality, trans rights) produced organized religious-conservative political response (DOMA, state marriage amendments, anti-trans bathroom bills, sports bans). The culture war framing allowed LGBTQ rights opponents to present minority rights as cultural aggression against majority values — framing discrimination as self-defense. The Supreme Court marriage equality decision (Obergefell 2015) was followed immediately by "religious liberty" legislation claiming the right to discriminate; the trans rights backlash (2020-present) represents the current frontline of LGBTQ culture war politics.',
    confidence: 'high' },
  { id: 'lgbtq_rights_movement__conversion_therapy',
    source: 'lgbtq_rights_movement', target: 'conversion_therapy', type: 'DISCREDITED',
    label: 'The LGBTQ rights movement\'s advocacy successfully got conversion therapy banned in numerous states and countries',
    note: 'LGBTQ rights advocacy was the primary force behind conversion therapy bans: every major US state ban on conversion therapy (20+ states by 2023) was driven by LGBTQ advocacy organizations; the American Psychological Association\'s 2009 report on conversion therapy was influenced by movement pressure to conduct systematic review; Exodus International\'s 2013 closure and apology (largest conversion therapy network) came after sustained LGBTQ advocacy and media campaigns. The movement used legal mobilization (state bans), media (documentary films), and survivor testimony to document harm and build political support for restrictions.',
    confidence: 'high' },
  { id: 'lgbtq_rights_movement__evangelical_christianity',
    source: 'lgbtq_rights_movement', target: 'evangelical_christianity', type: 'ENABLED',
    label: 'LGBTQ rights advancement catalyzed evangelical political mobilization as its primary organizing concern since the 1990s',
    note: 'The LGBTQ rights movement has been the primary driver of evangelical political mobilization since Jerry Falwell Sr. made gay rights a central Moral Majority issue in 1979. Each LGBTQ rights advance produced evangelical political response: Don\'t Ask Don\'t Tell debates (1993), DOMA (1996), state marriage amendments (2003-2012), marriage equality opposition (2015), trans rights opposition (2015-present). Evangelical institutions (Focus on the Family, Family Research Council, Alliance Defending Freedom) organized specifically around anti-LGBTQ politics; LGBTQ rights became the definitional issue of evangelical political identity more than any other single issue.',
    confidence: 'high' },

  // Nuclear weapons
  { id: 'nuclear_weapons__cold_war',
    source: 'nuclear_weapons', target: 'cold_war', type: 'ENABLED',
    label: 'Nuclear weapons created the Cold War\'s defining strategic logic: mutually assured destruction (MAD) as the foundation of deterrence',
    note: 'Nuclear weapons were the foundational technology of the Cold War: the US atomic monopoly (1945-1949) shaped initial Cold War posture; the Soviet bomb (1949) and hydrogen bomb (1952-53) created MAD as the strategic framework; the nuclear arms race became the primary Cold War competition, driving the space race, intelligence operations, and alliance structures; ICBM development made the arms race existential — both sides could destroy civilization. The Cold War\'s defining feature — no direct superpower military conflict despite intense rivalry — was entirely due to nuclear deterrence. Without nuclear weapons, US-Soviet confrontation would likely have produced conventional war.',
    confidence: 'high' },
  { id: 'hiroshima_nagasaki__nuclear_weapons',
    source: 'hiroshima_nagasaki', target: 'nuclear_weapons', type: 'PRODUCED',
    label: 'Hiroshima and Nagasaki were the formative events of nuclear weapons as a political and moral category',
    note: 'Hiroshima and Nagasaki transformed nuclear weapons from physics experiment to lived catastrophe: the bomb\'s actual effects on human bodies and cities created the emotional and moral framework for all subsequent nuclear policy; the survivor testimonies (hibakusha) became the primary anti-nuclear movement resource; Hiroshima became the reference point for nuclear deterrence debate (deterrence requires the credible willingness to do this deliberately to cities); the bombings\' contested morality (necessary to end war vs. mass civilian killing) shaped American self-image and foreign policy debates for decades. The events and the technology are inseparable in political and moral analysis.',
    confidence: 'high' },

  // Proxy wars
  { id: 'cold_war__cold_war_proxy_wars',
    source: 'cold_war', target: 'cold_war_proxy_wars', type: 'PRODUCED',
    label: 'Cold War superpower competition produced proxy wars as the primary military expression of ideological conflict short of nuclear exchange',
    note: 'Cold War proxy wars were the operational expression of the Cold War\'s strategic constraints: nuclear deterrence prevented direct US-Soviet war; ideology required both powers to support compatible regimes; Third World independence movements created arenas where superpower competition could occur conventionally. The proxy war pattern was consistent: liberation movement with Soviet/Chinese support vs. US-backed government or counter-insurgency; local conflicts became theaters of superpower proxy competition regardless of their domestic origins. Proxy wars killed millions (Korea 4 million, Vietnam 3 million, Angola 500,000, Afghanistan 2 million) while the superpowers maintained the fiction of non-involvement.',
    confidence: 'high' },
  { id: 'cold_war_proxy_wars__latin_american_dirty_wars',
    source: 'cold_war_proxy_wars', target: 'latin_american_dirty_wars', type: 'PRODUCED',
    label: 'Latin America\'s dirty wars were the Cold War proxy war system applied to the Western Hemisphere',
    note: 'Latin American dirty wars were Cold War proxy wars: US-backed military regimes conducted state terrorism against left-wing movements framed as Soviet proxies; Operation Condor was coordinated CIA-backed cross-border political repression; the dirty war in Argentina (1976-83) killed 30,000; Chile (1973-1989), Uruguay, Paraguay, Brazil operated similar systems under US training and political support. The proxy war framing was essential — it provided US political cover for supporting mass murder as Cold War necessity. When the Soviet threat evaporated (1989), US support for these regimes quickly became politically problematic, leading to transitions that were partly enabled by the end of the Cold War framing.',
    confidence: 'high' },
];

// ── History edges ─────────────────────────────────────────────────────────
const newHistEdges = [
  // Nelson Mandela
  { id: 'apartheid_south_africa__nelson_mandela',
    source: 'apartheid_south_africa', target: 'nelson_mandela', type: 'PRODUCED',
    label: 'Apartheid\'s oppression produced Mandela as the liberation movement\'s defining leader through his imprisonment and moral authority',
    note: 'Apartheid produced Mandela through a dynamic common in liberation politics: the oppressor\'s response to Mandela (arresting and imprisoning him for 27 years on Robben Island) made him a global symbol rather than eliminating his influence. Mandela\'s 1964 "I am prepared to die" speech at the Rivonia Trial transformed him from ANC militant to moral philosopher of liberation. The apartheid regime\'s decision to imprison rather than execute created the martyr who could not be killed, whose prison years became his most powerful political act. Mandela\'s release (1990) and the subsequent Truth and Reconciliation Commission model made South Africa a template for transitional justice.',
    confidence: 'high' },
  { id: 'nelson_mandela__decolonization_movement',
    source: 'nelson_mandela', target: 'decolonization_movement', type: 'ENABLED',
    label: 'Mandela and the ANC\'s victory was the last major victory of the global decolonization movement',
    note: 'South Africa\'s transition (1990-1994) was the final chapter of the 20th century decolonization wave: the ANC was a pan-Africanist liberation movement in the tradition of Nkrumah, Nyerere, and Cabral; international anti-apartheid solidarity connected the South African struggle to the broader decolonization narrative; Mandela\'s African National Congress was explicitly in the tradition of anticolonial African nationalism. South Africa\'s transition in 1994 — the last formally segregated state in Africa becoming democratic — closed the formal decolonization era, though neocolonial economic structures remained.',
    confidence: 'high' },

  // MLK
  { id: 'civil_rights_movement__martin_luther_king',
    source: 'civil_rights_movement', target: 'martin_luther_king', type: 'PRODUCED',
    label: 'The Civil Rights Movement produced King as its preeminent spokesperson, while King\'s charismatic leadership shaped the movement\'s tactics and moral frame',
    note: 'MLK and the Civil Rights Movement had a mutually constitutive relationship: King did not create the movement (the NAACP, local activists, and Black church organizing preceded him) but his rhetorical genius, theological grounding, and strategic vision gave it its defining moral frame; Montgomery Bus Boycott (1955-56) elevated him nationally; his "Letter from Birmingham Jail" (1963) is the movement\'s most sophisticated theoretical statement; the March on Washington speech defined the movement for white liberal America. King was simultaneously the product of the movement\'s structures and the figure who most shaped how America understood those structures.',
    confidence: 'high' },
  { id: 'martin_luther_king__vietnam_war',
    source: 'martin_luther_king', target: 'vietnam_war', type: 'ENABLED',
    label: 'King\'s 1967 "Beyond Vietnam" speech connected the civil rights and antiwar movements, at enormous political cost',
    note: 'King\'s April 1967 "Beyond Vietnam" speech was a strategic and moral turning point: it explicitly connected racism, militarism, and economic exploitation as the "triple evils"; it marked his break with Johnson administration (which had supported civil rights legislation but was waging Vietnam); it cost him white liberal support and FBI director Hoover intensified COINTELPRO surveillance against him; SCLC fundraising dropped significantly. King\'s analysis — that the Vietnam War was diverting resources from the Poor People\'s Campaign and reflecting the same dehumanization that justified Jim Crow — was prescient but politically costly. His assassination in Memphis (April 1968) while supporting a sanitation strike connected the movements he\'d sought to unite.',
    confidence: 'high' },

  // Malcolm X
  { id: 'civil_rights_movement__malcolm_x',
    source: 'civil_rights_movement', target: 'malcolm_x', type: 'PRODUCED',
    label: 'Malcolm X emerged from the same conditions as the Civil Rights Movement but offered a distinct analysis: Black nationalism vs. integrationist civil rights',
    note: 'Malcolm X and the Civil Rights Movement represented divergent responses to the same oppressive conditions: where King sought integration through nonviolent appeal to white conscience, Malcolm X argued that Black Americans needed to build independent institutions and defend themselves against white violence; his "by any means necessary" rhetoric was a direct challenge to King\'s nonviolence; the two were the visible poles of a debate that actually had more common ground than the rhetoric suggested (each moved toward the other\'s positions by the time of their assassinations). The contrast between them was used by white moderates to delegitimize King ("at least King isn\'t Malcolm") while simultaneously characterizing King as too radical.',
    confidence: 'high' },
  { id: 'malcolm_x__black_lives_matter',
    source: 'malcolm_x', target: 'black_lives_matter', type: 'ENABLED',
    label: 'Malcolm X\'s analysis of systemic racism, police violence, and the limits of respectability politics directly influenced BLM\'s framework',
    note: 'Black Lives Matter\'s intellectual framework draws more from Malcolm X than from King\'s integrationist tradition: BLM\'s founding principles (by Alicia Garza, Patrisse Cullors, Opal Tometi) emphasized systemic analysis, intersectionality, and rejection of respectability politics — much closer to Malcolm\'s approach than to King\'s moral suasion; the Movement for Black Lives\' policy platform (2016) included reparations, police abolition, and economic restructuring that echo Malcolm\'s structural analysis; BLM\'s tone — assertive, defiant, centering Black experience rather than appealing to white conscience — reflects the Malcolm tradition more than the King tradition that white political culture prefers.',
    confidence: 'high' },

  // Hiroshima
  { id: 'world_war_ii__hiroshima_nagasaki',
    source: 'world_war_ii', target: 'hiroshima_nagasaki', type: 'PRODUCED',
    label: 'WWII\'s Pacific theater produced the strategic logic and technological capability that led to Hiroshima and Nagasaki',
    note: 'Hiroshima and Nagasaki were produced by WWII\'s specific context: the Manhattan Project was initiated by fear of German atomic development; the Pacific War\'s ferocity (Iwo Jima, Okinawa island campaigns with massive casualties) made US military planners estimate a Japan invasion would cost 250,000-1 million American casualties; Japan\'s military culture of resistance to surrender created the strategic context; the available bombs and delivery capability created the option. The decision remains historically contested: traditional view (ended the war, saved lives) vs. revisionist view (Japan was already considering surrender; primary motivation was Soviet deterrence). The debate reveals how strategic necessity and moral principle intertwined in the atomic decision.',
    confidence: 'high' },

  // Vietnam protests
  { id: 'vietnam_war__vietnam_war_protests',
    source: 'vietnam_war', target: 'vietnam_war_protests', type: 'PRODUCED',
    label: 'The Vietnam War produced the most sustained and ultimately effective antiwar movement in American history',
    note: 'Vietnam War protests were the war\'s direct product: draft vulnerability (young men could be conscripted) created personal stakes that produced campus activism; draft card burning, sit-ins at induction centers, and the March on the Pentagon (1967) built the movement; the Tet Offensive (1968) demonstrated the war\'s failure against government claims of progress; Kent State (4 students killed by National Guard, 1970) galvanized the campus movement; Vietnam Veterans Against the War brought moral authority from those who had served. The movement demonstrates that democratic societies have mechanisms to constrain militarism when costs become visible — but those mechanisms work slowly and incompletely.',
    confidence: 'high' },
  { id: 'vietnam_war_protests__iraq_war_wmd',
    source: 'vietnam_war_protests', target: 'iraq_war_wmd', type: 'SHARES_MECHANISM_WITH',
    label: 'The February 2003 Iraq War protests were the largest antiwar demonstrations in history, yet failed to prevent the war — a contrast with Vietnam\'s eventual success',
    note: 'The Iraq War protests (February 15, 2003 — 15 million people in 600 cities worldwide, the largest coordinated protest in history) and Vietnam protests share mechanism while demonstrating a key difference: both were massive democratic expressions against military action; the Iraq protest was preemptive (before the war began) while Vietnam protests were reactive (after casualties mounted); the Iraq protest failed to prevent the war despite unprecedented scale, partly because the Bush administration had committed before public opinion could respond, partly because the Iraq War initially appeared to be a quick victory. The contrast suggests that preemptive protests face higher political barriers than reactive ones.',
    confidence: 'high' },
];

// ── Mechanism edges ───────────────────────────────────────────────────────
const newMechEdges = [
  // Nonviolent resistance
  { id: 'nonviolent_resistance__civil_rights_movement',
    source: 'nonviolent_resistance', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'Nonviolent resistance was the Civil Rights Movement\'s strategic choice, theorized by Gandhi and adapted by King to the American context',
    note: 'King\'s adaptation of Gandhi\'s nonviolent resistance to American civil rights was a strategic calculation, not only a moral one: nonviolent tactics exposed the brutality of Jim Crow enforcement for national and international media — Bull Connor\'s firehoses and police dogs against peaceful marchers in Birmingham (1963) produced more legislative action than any argument had; nonviolence denied opponents the pretext of self-defense; it maintained moral high ground in Cold War context (US fighting Soviet tyranny while practicing racial apartheid was a global embarrassment). Gandhi\'s satyagraha (truth-force) was adapted to American Baptist church tradition and the specific tactical conditions of the Jim Crow South.',
    confidence: 'high' },
  { id: 'nonviolent_resistance__apartheid_south_africa',
    source: 'nonviolent_resistance', target: 'apartheid_south_africa', type: 'DISCREDITED',
    label: 'The ANC adopted nonviolent resistance until Sharpeville (1960), then turned to armed struggle when the state proved impervious to peaceful protest',
    note: 'The ANC\'s turn from nonviolent to armed resistance (Umkhonto we Sizwe, 1961) after the Sharpeville massacre (1960, 69 protesters killed) demonstrates nonviolent resistance\'s limits against sufficiently violent states. The ANC had spent 48 years using peaceful organizing, petitions, and legal challenges; the state responded by banning the ANC, massacring protesters, and arresting leadership. The Sharpeville decision to shoot peaceful protesters removed the moral space that nonviolent resistance requires — it needs the opponent to have political costs for violent response, which requires audience sympathy (international community, domestic white moderates). South Africa\'s apartheid regime was, for decades, willing to pay those costs.',
    confidence: 'high' },

  // Legal mobilization
  { id: 'legal_mobilization__civil_rights_movement',
    source: 'legal_mobilization', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'NAACP Legal Defense Fund\'s strategic litigation — culminating in Brown v. Board — was as important to the Civil Rights Movement as street protest',
    note: 'The NAACP LDF\'s legal mobilization strategy was 20 years in the making before Brown v. Board (1954): Thurgood Marshall and the LDF systematically built a litigation record attacking "separate but equal" from higher education down to primary schools; they developed a social science evidence strategy (Kenneth Clark\'s doll studies showing segregation\'s psychological harm) that treated law as contestable social fact rather than fixed doctrine; the Brown decision\'s "with all deliberate speed" implementation clause revealed the limits of litigation without political enforcement. Legal mobilization requires courts that are more accessible than legislatures — a condition that has historically varied, making litigation strategy temporally dependent on the composition of the judiciary.',
    confidence: 'high' },
  { id: 'legal_mobilization__lgbtq_rights_movement',
    source: 'legal_mobilization', target: 'lgbtq_rights_movement', type: 'ENABLED',
    label: 'Legal mobilization through ACLU and Lambda Legal was the primary LGBTQ rights strategy, producing Lawrence (2003) and Obergefell (2015)',
    note: 'Legal mobilization was the defining LGBTQ rights strategy: Lambda Legal and ACLU built litigation records through careful case selection; Bowers v. Hardwick (1986) was a defeat that defined the next generation\'s strategy; Romer v. Evans (1996), Lawrence v. Texas (2003), United States v. Windsor (2013), and Obergefell v. Hodges (2015) were a deliberate litigation sequence; Evan Wolfson\'s marriage equality strategy explicitly modeled the NAACP LDF approach. The LGBTQ rights legal mobilization demonstrates how civil rights movements can build constitutional rights through strategic litigation in 30-year timeframes, fundamentally reshaping constitutional doctrine through carefully selected test cases.',
    confidence: 'high' },

  // Cross-scope mechanism edges for new nodes
  { id: 'dehumanization__rwandan_genocide',
    source: 'dehumanization', target: 'rwandan_genocide', type: 'ENABLED',
    label: 'Dehumanization through radio propaganda ("cockroaches") was the proximate psychological mechanism that enabled genocidal killing',
    note: 'Radio Milles Collines\'s systematic dehumanization of Tutsis as "inyenzi" (cockroaches) was the proximate psychological enabler of mass participation in the genocide: research on mass atrocity demonstrates that ordinary people require dehumanization narratives to overcome inhibitions against killing; the cockroach framing specifically invoked the extermination logic (you kill cockroaches, not people); the radio instructions combined dehumanization with specific targeting (naming individuals to kill) and urgency framing ("Tutsis are about to kill you"). The Rwandan genocide became the definitional case study in genocide studies for how radio dehumanization enables mass participation in killing among ordinary civilians without direct state coercion.',
    confidence: 'high' },
  { id: 'collective_trauma__vietnam_war_protests',
    source: 'collective_trauma', target: 'vietnam_war_protests', type: 'ENABLED',
    label: 'The collective trauma of Vietnam War casualties and the Kent State massacre radicalized the antiwar movement',
    note: 'The Vietnam War protest movement was driven by collective trauma: the draft lottery creating shared mortality risk for young men; the return of veterans with visible physical and psychological wounds; the Kent State massacre (National Guard killing student protesters) demonstrating that the state would use deadly force against its own citizens; My Lai massacre revelation (1969) demonstrating that US forces were committing atrocities. These traumatic events radicalized moderate antiwar sentiment into mass mobilization. The collective trauma mechanism: each atrocity expanded the movement\'s base while deepening existing members\' commitment, creating a self-reinforcing radicalization dynamic driven by accumulating horror.',
    confidence: 'high' },
  { id: 'in_group_out_group_dynamics__cold_war',
    source: 'in_group_out_group_dynamics', target: 'cold_war', type: 'ENABLED',
    label: 'Cold War ideology required rigid in-group/out-group thinking that made any leftist political position automatically "communist" and therefore treasonous',
    note: 'Cold War in-group/out-group dynamics operated through binary ideological categorization: "free world" vs. communist world; any political position (labor rights, civil rights, antiwar activism) could be delegitimized by labeling it communist-aligned; this made the in-group/out-group boundary ideologically policed rather than just national — an American advocating socialized medicine was potentially "Soviet-aligned." Red Scare and COINTELPRO were institutional implementations of this logic. The Cold War produced the specific pathology of treating domestic political opponents as enemy agents, which is the core of authoritarian political culture — making loyal opposition impossible.',
    confidence: 'high' },
];

// ── Psychology edges ──────────────────────────────────────────────────────
const newPsychEdges = [
  { id: 'antisemitism__the_holocaust',
    source: 'antisemitism', target: 'the_holocaust', type: 'PRODUCED',
    label: 'Nazi antisemitism transformed centuries of religious and cultural antisemitism into an industrial racial genocide',
    note: 'The Holocaust was the endpoint of a specific German antisemitism trajectory that combined traditional European religious antisemitism with modern racial science and state administrative capacity. Hannah Arendt\'s analysis in "The Origins of Totalitarianism" traces the convergence of colonial racism (practiced on non-Europeans) with European antisemitism (practiced domestically) as the ideological foundation; the Nazi racial state then applied industrial bureaucratic methods to genocide. The Holocaust\'s "banality of evil" — ordinary bureaucrats implementing mass murder through paperwork — demonstrated that genocide does not require individual sadism but only institutional normalization of dehumanization.',
    confidence: 'high' },
  { id: 'antisemitism__conspiracy_theories',
    source: 'antisemitism', target: 'conspiracy_theories', type: 'ENABLED',
    label: 'Antisemitic conspiracy frameworks are the template from which modern conspiracy theory logic derives',
    note: 'Modern conspiracy theory logic inherits its structure from antisemitic conspiracy frameworks: the Protocols of the Elders of Zion established the narrative architecture of secret elite manipulating events behind the scenes; this architecture — hidden powerful group, coordinated deception, ordinary people as victims of their manipulation — is the template for all subsequent conspiracy theories regardless of whether they explicitly name Jews. QAnon\'s Rothschild/Soros elements demonstrate the persistence of the antisemitic template. The relationship is not merely historical: conspiracy theories regress toward antisemitism when they require a sufficiently powerful and unified hidden force, because antisemitic mythology provides the ready-made explanation.',
    confidence: 'high' },
  { id: 'radicalization__online_radicalization',
    source: 'radicalization', target: 'online_radicalization', type: 'PRODUCED',
    label: 'Online radicalization is the digital-era instantiation of general radicalization dynamics with accelerated feedback loops',
    note: 'Online radicalization and general radicalization share mechanisms but the internet dramatically accelerates them: geographic isolation is eliminated (a lonely teenager in rural Idaho can access neo-Nazi communities instantly); feedback loops are tightened (content that validates extreme views is algorithmically surfaced faster); anonymity reduces social inhibitions; extremist communities that could never sustain critical mass in physical space can reach global scale online; escalation dynamics operate 24/7 without the natural interruption of offline life. Online radicalization\'s speed and scale difference from historical radicalization is sufficient to treat it as a qualitatively distinct phenomenon.',
    confidence: 'high' },
];

// ── Write files ───────────────────────────────────────────────────────────
let pnAdded=0, hnAdded=0, mnAdded=0;
let peAdded=0, heAdded=0, meAdded=0, pseAdded=0;

newPolitNodes.forEach(n => { if (!pnIds.has(n.id)) { pn.push(n); pnIds.add(n.id); pnAdded++; } });
newHistNodes.forEach(n => { if (!hnIds.has(n.id)) { hn.push(n); hnIds.add(n.id); hnAdded++; } });
newMechNodes.forEach(n => { if (!mnIds.has(n.id)) { mn.push(n); mnIds.add(n.id); mnAdded++; } });

newPolitEdges.forEach(e => { if (!peIds.has(e.id)) { pe.push(e); peIds.add(e.id); peAdded++; } });
newHistEdges.forEach(e => { if (!heIds.has(e.id)) { he.push(e); heIds.add(e.id); heAdded++; } });
newMechEdges.forEach(e => { if (!meIds.has(e.id)) { me.push(e); meIds.add(e.id); meAdded++; } });
newPsychEdges.forEach(e => { if (!pseIds.has(e.id)) { pse.push(e); pseIds.add(e.id); pseAdded++; } });

fs.writeFileSync(D('data/global/politics/nodes.json'), JSON.stringify(pn, null, 2));
fs.writeFileSync(D('data/global/history/nodes.json'), JSON.stringify(hn, null, 2));
fs.writeFileSync(D('data/mechanisms/nodes.json'), JSON.stringify(mn, null, 2));
fs.writeFileSync(D('data/global/politics/edges.json'), JSON.stringify(pe, null, 2));
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(he, null, 2));
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
fs.writeFileSync(D('data/global/psychology/edges.json'), JSON.stringify(pse, null, 2));

console.log('Politics nodes: +'+pnAdded+' -> '+pn.length);
console.log('History nodes: +'+hnAdded+' -> '+hn.length);
console.log('Mechanism nodes: +'+mnAdded+' -> '+mn.length);
console.log('Politics edges: +'+peAdded+' -> '+pe.length);
console.log('History edges: +'+heAdded+' -> '+he.length);
console.log('Mechanism edges: +'+meAdded+' -> '+me.length);
console.log('Psychology edges: +'+pseAdded+' -> '+pse.length);

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
