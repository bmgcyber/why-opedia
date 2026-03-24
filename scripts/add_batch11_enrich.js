#!/usr/bin/env node
// add_batch11_enrich.js — boost all low-degree nodes to 3+ connections
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const pe = JSON.parse(fs.readFileSync(D('data/global/politics/edges.json')));
const he = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const pse = JSON.parse(fs.readFileSync(D('data/global/psychology/edges.json')));

const peIds = new Set(pe.map(e=>e.id));
const heIds = new Set(he.map(e=>e.id));
const meIds = new Set(me.map(e=>e.id));
const pseIds = new Set(pse.map(e=>e.id));

// ── Politics edges ────────────────────────────────────────────────────────
const newPolitEdges = [
  // police_brutality
  { id: 'police_brutality__black_lives_matter',
    source: 'police_brutality', target: 'black_lives_matter', type: 'PRODUCED',
    label: 'Police killings of unarmed Black Americans produced Black Lives Matter as the defining protest movement of the 2010s',
    note: 'Black Lives Matter emerged directly from documented police killings: the Trayvon Martin killing (2012, by neighborhood watch, not police) and George Zimmerman acquittal prompted Alicia Garza\'s Facebook post and the hashtag; Michael Brown (2014, Ferguson), Eric Garner (2014, New York), Tamir Rice (2014, Cleveland), Sandra Bland (2015, Texas), Walter Scott (2015), Philando Castile (2016), Breonna Taylor (2020), and George Floyd (2020) sustained and expanded the movement. Each killing that produced no accountability — no charges, or acquittals — demonstrated that police violence against Black Americans operated outside normal legal accountability. BLM was the organized response to documented, systematic impunity.',
    confidence: 'high' },
  { id: 'police_brutality__war_on_drugs',
    source: 'police_brutality', target: 'war_on_drugs', type: 'ENABLED',
    label: 'War on Drugs enforcement concentrated police violence in communities of color through the logic of saturation policing of drug markets',
    note: 'War on Drugs enforcement was the primary driver of police-community violence in the late 20th century: aggressive drug enforcement (stop-and-frisk, no-knock raids, consent searches) concentrated in Black and Latino neighborhoods; militarization of police through 1033 program transferred military equipment to local departments framing drug enforcement as warfare; qualified immunity doctrine (developed largely through drug enforcement cases) immunized officers from civil liability for excessive force; the New York Police Department\'s 700,000 annual stop-and-frisks (2011, 88% Black or Latino) demonstrated drug enforcement\'s racial targeting. The War on Drugs created the policing paradigm that produced the specific pattern of racialized police violence BLM documented.',
    confidence: 'high' },
  { id: 'jim_crow__police_brutality',
    source: 'jim_crow', target: 'police_brutality', type: 'ENABLED',
    label: 'Jim Crow-era police forces were explicitly designed to enforce racial hierarchy; this institutional character persisted through northern Great Migration',
    note: 'Contemporary police brutality is historically connected to Jim Crow policing: southern police forces were created partly to enforce slave codes and catch runaways; after emancipation, they enforced Black Codes and Jim Crow segregation through selective enforcement and racial terror; the KKK and police forces had overlapping membership through the early 20th century. Northern cities imported racialized policing practices as Black Americans migrated north (Great Migration). The institutional culture of policing as racial control was not abolished by civil rights legislation — it adapted. Bryan Stevenson and the Equal Justice Initiative trace contemporary police culture\'s racial violence directly to slave patrol and Jim Crow enforcement traditions.',
    confidence: 'high' },

  // surveillance_state
  { id: 'surveillance_state__patriot_act_surveillance',
    source: 'patriot_act_surveillance', target: 'surveillance_state', type: 'PRODUCED',
    label: 'The PATRIOT Act\'s surveillance expansion produced the mass surveillance infrastructure Snowden revealed in 2013',
    note: 'The surveillance state that Snowden revealed was substantially built on PATRIOT Act authorities: Section 215 (bulk telephone metadata collection) enabled NSA collection of every American\'s call records; Section 702 (PRISM) enabled collection of internet communications from major tech companies; the combination produced mass surveillance infrastructure that had been undisclosed to the public and most of Congress. The FISA court that was supposed to supervise this surveillance operated in secret, approving 99%+ of government requests. The surveillance state was not a dramatic discontinuity from PATRIOT Act surveillance — it was the logical development of surveillance authorities established after 9/11.',
    confidence: 'high' },
  { id: 'surveillance_state__great_firewall_china',
    source: 'surveillance_state', target: 'great_firewall_china', type: 'SHARES_MECHANISM_WITH',
    label: 'China\'s surveillance state is the most comprehensive version of a tendency present in all modern states: using digital infrastructure for population monitoring',
    note: 'China\'s surveillance state and Western surveillance states share the fundamental mechanism (digital infrastructure enables mass monitoring) while differing in scope and purpose: China\'s social credit system, Xinjiang facial recognition and predictive policing, and comprehensive internet monitoring represent the most extensive state surveillance apparatus in history; Western NSA/GCHQ surveillance programs revealed by Snowden were significant but targeted at foreign intelligence and specific domestic threats rather than universal social monitoring. The key difference is political purpose: China\'s surveillance explicitly aims to suppress political dissent and enforce social conformity; Western mass surveillance was officially directed at terrorism. Both demonstrate that digital infrastructure makes comprehensive surveillance technically possible.',
    confidence: 'high' },
  { id: 'surveillance_state__social_media_algorithms',
    source: 'surveillance_state', target: 'social_media_algorithms', type: 'SHARES_MECHANISM_WITH',
    label: 'State mass surveillance and corporate social media surveillance share infrastructure and data while serving different masters',
    note: 'State surveillance and corporate social media surveillance are deeply intertwined: the NSA PRISM program collected user data from Facebook, Google, Apple, Microsoft, and Yahoo through legal compulsion; social media companies\' behavioral data is more comprehensive than state surveillance of the same individuals; authoritarian states (China, Russia, Saudi Arabia) compel social media companies to provide surveillance access; commercial surveillance of users (location, social graph, behavioral data) is the same data states want. The distinction between government surveillance and corporate surveillance has been eroded by state data demands, corporate cooperation, and the purchase of commercial data by intelligence agencies to avoid warrant requirements.',
    confidence: 'high' },

  // nato
  { id: 'nato__cold_war',
    source: 'cold_war', target: 'nato', type: 'PRODUCED',
    label: 'NATO was created as the institutional expression of Western Cold War collective security against Soviet expansion',
    note: 'NATO (1949) was a direct Cold War creation: Soviet pressure on Western Europe (Berlin blockade 1948-49, Czech coup 1948) convinced Western European states and the US that formal collective security was necessary; the North Atlantic Treaty\'s Article 5 (mutual defense commitment) was designed to extend US nuclear deterrence to Western Europe; NATO\'s integrated military command (SACEUR) institutionalized US military presence in Europe permanently. NATO transformed the Cold War from a US-Soviet bilateral confrontation to a multilateral alliance that gave Western Europe protection while limiting their independent military policy. NATO\'s survival after the Cold War (continuing expansion eastward) demonstrates how institutions persist beyond their original purpose.',
    confidence: 'high' },
  { id: 'nato__european_union',
    source: 'nato', target: 'european_union', type: 'ENABLED',
    label: 'NATO provided the security framework that allowed European integration to proceed without independent German rearmament threatening neighbors',
    note: 'NATO and EU integration were complementary Cold War projects: NATO handled European collective security, allowing EU predecessors (ECSC, EEC) to focus on economic integration rather than military coordination; West Germany\'s rearmament was acceptable to France and others because it was integrated into NATO command rather than independent; the US security guarantee removed the threat perception (especially of Germany) that had historically driven European nations to military competition. Without NATO\'s security umbrella, European integration would have required independent security arrangements that would have reproduced Franco-German security competition. NATO was the security precondition that made the European peace project politically possible.',
    confidence: 'high' },
  { id: 'nato__cold_war_proxy_wars',
    source: 'nato', target: 'cold_war_proxy_wars', type: 'ENABLED',
    label: 'NATO\'s protection of Western Europe channeled Cold War competition into proxy wars in the developing world',
    note: 'NATO\'s collective security guarantee shifted Cold War military competition to proxy wars: by making direct Soviet attack on Western Europe strategically prohibitive, NATO pushed superpower competition into areas outside the alliance guarantee — Asia, Africa, Latin America, the Middle East. The Korean War (1950-53) and Vietnam War (1955-75) were outside NATO\'s scope; the CIA operations in Central America, Africa, and the Middle East were proxy competition that NATO\'s conventional deterrence in Europe made necessary. NATO thus both limited the Cold War (prevented European war) and displaced it (made proxy wars elsewhere more intense).',
    confidence: 'high' },

  // nuclear_weapons
  { id: 'nuclear_weapons__cuban_missile_crisis',
    source: 'nuclear_weapons', target: 'cuban_missile_crisis', type: 'PRODUCED',
    label: 'The Cuban Missile Crisis was the direct product of nuclear weapons strategic logic: Soviet missiles in Cuba would undermine US strategic advantage',
    note: 'The Cuban Missile Crisis was a nuclear weapons problem: Khrushchev placed missiles in Cuba to offset US strategic nuclear advantage (the US had approximately 5,000 warheads vs Soviet 1,500 in 1962) and to demonstrate Soviet ability to project nuclear force to the Western Hemisphere; Kennedy\'s response was nuclear deterrence logic — the missiles were unacceptable because they fundamentally altered the strategic balance; the resolution required nuclear weapons mechanics (missile withdrawal, pledge not to attack Cuba, secret Jupiter missile withdrawal from Turkey). Every element of the crisis was shaped by nuclear weapons\' specific strategic properties — second-strike capability, counterforce vs. countervalue targeting, escalation ladders.',
    confidence: 'high' },
  { id: 'nuclear_weapons__cold_war_proxy_wars',
    source: 'nuclear_weapons', target: 'cold_war_proxy_wars', type: 'ENABLED',
    label: 'Nuclear deterrence prevented direct superpower war but enabled proxy wars by creating a strategic floor that prevented escalation',
    note: 'Nuclear weapons created the strategic conditions for proxy wars: MAD (mutually assured destruction) made direct superpower war existentially risky; this created a "nuclear umbrella" under which conventional conflicts could be fought without triggering nuclear exchange; both superpowers learned they could support opposite sides in regional conflicts without that requiring direct confrontation; the Korean War established the precedent that nuclear powers could fight limited conventional wars without escalating. Nuclear weapons thus both prevented the most catastrophic possible war and enabled the dozens of conventional conflicts that killed millions in Korea, Vietnam, Angola, Afghanistan, and Central America.',
    confidence: 'high' },

  // gerrymandering
  { id: 'reconstruction_era__gerrymandering',
    source: 'reconstruction_era', target: 'gerrymandering', type: 'ENABLED',
    label: 'Post-Reconstruction racial gerrymandering was among the first tools used to strip Black Americans of political power after the 1877 Compromise',
    note: 'Gerrymandering\'s racial history begins with Reconstruction\'s defeat: after 1877, Southern states used district manipulation alongside literacy tests and poll taxes to dismantle Black political representation; the Gerrymander as a racial tool predates the modern algorithmic variety. The Voting Rights Act (1965) required DOJ preclearance for electoral changes in states with discrimination history specifically because of this history. When Shelby County v. Holder (2013) eliminated preclearance, states immediately began racial gerrymandering — demonstrating that the historical pattern remained present as soon as the constraint was removed. Contemporary racial gerrymandering and its post-Reconstruction precedents are legally connected through the Voting Rights Act\'s history.',
    confidence: 'high' },
  { id: 'gerrymandering__citizens_united',
    source: 'gerrymandering', target: 'citizens_united', type: 'SHARES_MECHANISM_WITH',
    label: 'Gerrymandering and Citizens United are complementary mechanisms for minority rule: gerrymandering makes most votes irrelevant; Citizens United makes most money politically decisive',
    note: 'Gerrymandering and Citizens United operate together in the post-2010 Republican electoral strategy: REDMAP (2010) used gerrymandering to lock in Republican state legislative majorities regardless of vote share; those majorities then implemented voter suppression laws; Citizens United enabled unlimited dark money to fund primary challenges against any Republican who compromised. The combination produces minority rule: Republicans can win legislative majorities with minority vote share (gerrymandering), and dark money punishes any deviation from radical positions (Citizens United). Together they have produced a political system where the preferences of the Republican donor class (not the median voter) determine Republican policy.',
    confidence: 'high' },

  // cold_war_proxy_wars
  { id: 'cold_war_proxy_wars__decolonization_movement',
    source: 'cold_war_proxy_wars', target: 'decolonization_movement', type: 'SHARES_MECHANISM_WITH',
    label: 'Cold War proxy wars and decolonization movements were inextricably entangled — independence movements became battlegrounds for superpower competition',
    note: 'Cold War proxy wars and decolonization became intertwined systems: newly independent states needed superpower support for economic development and security; the US and USSR competed to draw independent states into their orbits; liberation movements sought Soviet support when the US backed colonial powers; US support for anti-communist regimes meant supporting colonial and post-colonial authoritarian governments against popular movements. Vietnam was simultaneously a Cold War proxy war and a decolonization movement; Angola, Mozambique, Guinea-Bissau were simultaneously anti-Portuguese decolonization and Cold War confrontations. The Cold War structured decolonization\'s political economy in ways that complicated its outcomes.',
    confidence: 'high' },
  { id: 'cold_war_proxy_wars__iran_contra',
    source: 'cold_war_proxy_wars', target: 'iran_contra', type: 'PRODUCED',
    label: 'Iran-Contra was the proxy war system attempting to continue after Congress withdrew authorization through the Boland Amendment',
    note: 'Iran-Contra was produced by the Cold War proxy war logic hitting a constitutional obstacle: the Boland Amendment (1982) prohibited US aid to Contra fighters in Nicaragua; the Reagan administration\'s commitment to proxy war against the Sandinista government (Cold War logic) led to the illegal workaround — selling arms to Iran and diverting proceeds to Contras. The entire operation was a proxy war operation that circumvented democratic constraints. Iran-Contra demonstrates that the Cold War proxy war logic was institutionally embedded in the executive branch to the point where officials viewed constitutional oversight as an obstacle to circumvent rather than a constraint to respect.',
    confidence: 'high' },

  // immigration
  { id: 'climate_change_policy__immigration_crisis',
    source: 'climate_change_policy', target: 'immigration_crisis', type: 'PRODUCED',
    label: 'Climate change is a primary driver of contemporary mass displacement — the future of the immigration crisis is a climate refugee crisis',
    note: 'Climate change is producing the immigration crisis through multiple pathways: sea level rise makes coastal areas uninhabitable (Bangladesh, Pacific islands, Miami); desertification and drought destroy agricultural livelihoods (Sahel, Syria, Central America\'s Dry Corridor); extreme heat makes regions in tropics and subtropics lethally hot without air conditioning; World Bank estimates 216 million internal climate migrants by 2050. The Syrian conflict (2011-present) was partly triggered by drought (2006-2011) that failed crops and drove 1.5 million farmers to cities, producing social instability. Immigration policy debates that treat climate migration as an immigration problem rather than a climate problem will systematically fail to address its root causes.',
    confidence: 'high' },
  { id: 'decolonization_movement__immigration_crisis',
    source: 'decolonization_movement', target: 'immigration_crisis', type: 'ENABLED',
    label: 'Post-colonial economic structures and conflict are primary drivers of migration from former colonies to former imperial centers',
    note: 'Contemporary immigration patterns are substantially post-colonial: the colonial relationship created economic development asymmetries that drive migration (former colonies systematically underdeveloped as complement to imperial economy); former colonies experience political instability partly as legacy of colonial borders and divide-and-rule politics; colonial-era labor migration created communities in imperial centers whose families continue to migrate through chain migration. The UK\'s immigration crisis is primarily from former British Empire territories; France\'s from former French colonies; Spain\'s from former Spanish colonies. Post-colonial migration follows colonial pathways — language connections, diaspora networks, and economic development differentials all trace to the colonial relationship.',
    confidence: 'high' },

  // human_rights_declaration
  { id: 'human_rights_declaration__apartheid_south_africa',
    source: 'human_rights_declaration', target: 'apartheid_south_africa', type: 'ENABLED',
    label: 'The UDHR provided the international legal framework that made apartheid a violation of international norms rather than merely internal South African policy',
    note: 'The UDHR enabled apartheid\'s international delegitimization: apartheid was established (1948) the same year as the UDHR; from the beginning, India challenged apartheid in the UN as a UDHR violation; the Universal Periodic Review process created systematic international scrutiny; UN sanctions (1977 mandatory arms embargo) required the UDHR normative framework to justify interference in domestic policy. Without the UDHR\'s establishment of universal human rights as international norms, apartheid would have been legally classified as internal South African policy immune to international pressure. The UDHR created the international normative framework that allowed decades of pressure culminating in the 1994 transition.',
    confidence: 'high' },
  { id: 'human_rights_declaration__torture',
    source: 'human_rights_declaration', target: 'abu_ghraib', type: 'SHARES_MECHANISM_WITH',
    label: 'Abu Ghraib demonstrated that UDHR-based torture prohibitions fail when states claim emergency national security exceptions',
    note: 'The UDHR (Article 5) and subsequent Convention Against Torture establish absolute prohibition on torture. Abu Ghraib demonstrated the prohibition\'s limits: the Bush administration\'s "torture memos" (Yoo/Bybee) created legal frameworks claiming that techniques not meeting a narrow torture definition were permissible; the UDHR\'s absolute prohibition was circumvented through definitional manipulation rather than direct challenge. This is the pattern of human rights law failure under emergency conditions: states rarely argue against human rights norms directly but instead manipulate definitions, claim emergency exceptions, or create extralegal spaces (Guantanamo) where normal legal frameworks do not apply. Abu Ghraib demonstrated the weakness of rights frameworks that depend on good faith definition.',
    confidence: 'high' },
];

// ── History edges ─────────────────────────────────────────────────────────
const newHistEdges = [
  // satanic_panic
  { id: 'satanic_panic__recovered_memory_therapy',
    source: 'satanic_panic', target: 'recovered_memory_therapy', type: 'PRODUCED',
    label: 'The Satanic Panic was produced by recovered memory therapy techniques that created false memories of abuse in children and adults',
    note: 'The Satanic Panic and recovered memory therapy are causally linked: therapists using hypnosis and guided imagery to uncover "repressed" memories of childhood abuse produced the Satanic ritual abuse cases; the McMartin preschool case investigators used deeply leading interview techniques with young children that reliably produced false accounts; the "survivor" therapy movement (popularized by "The Courage to Heal") generated adult "recovered memories" of childhood abuse including Satanic ritual elements. The Satanic Panic demonstrated that suggestive therapeutic techniques can produce confident false memories indistinguishable from real memories — a finding with implications beyond the Satanic Panic for all recovered memory testimony.',
    confidence: 'high' },
  { id: 'satanic_panic__evangelical_christianity',
    source: 'satanic_panic', target: 'evangelical_christianity', type: 'ENABLED',
    label: 'Evangelical Christianity\'s literal belief in Satan provided the theological framework that made Satanic ritual abuse accusations credible to certain audiences',
    note: 'Evangelical theology made Satanic Panic accusations credible: the belief that Satan is literally active in the world, seeking souls through occult practices, made the idea of organized Satanic ritual abuse theologically plausible to evangelical audiences; "Satanic panic" literature circulated in evangelical churches (Lauren Stratford\'s "Satan\'s Underground," later revealed as fabricated); evangelical media amplified the narratives; Focus on the Family\'s James Dobson promoted Satanic ritual abuse claims. The panic\'s persistence in evangelical communities beyond its mainstream collapse demonstrates how theological frameworks shape the believability of specific empirical claims.',
    confidence: 'high' },

  // east_india_company
  { id: 'east_india_company__colonial_era',
    source: 'east_india_company', target: 'colonial_era', type: 'ENABLED',
    label: 'The East India Company invented the corporate colonialism model that transformed the colonial era from state-led conquest to profit-driven corporate governance',
    note: 'The East India Company (EIC) invented a new form of colonialism: private corporation with state-backed monopoly conducting conquest, administration, and extraction simultaneously. The EIC raised its own army, levied taxes, administered justice, and fought wars — all for shareholder profit. The EIC\'s 1757 Battle of Plassey (defeating the Nawab of Bengal) began corporate conquest of India; EIC administration caused the Bengal Famine (1770, killing 10 million) through revenue extraction during drought. The EIC model demonstrated that colonial extraction could be privatized — the state provides legal and military backing; the corporation provides the administrative and extraction apparatus. This corporate colonialism model persists in contemporary multinational corporation relationships with resource-rich developing countries.',
    confidence: 'high' },
  { id: 'east_india_company__resource_extraction',
    source: 'east_india_company', target: 'resource_extraction', type: 'ENABLED',
    label: 'The East India Company pioneered resource extraction as corporate strategy, draining India\'s wealth to British shareholders',
    note: 'The EIC institutionalized systematic resource extraction: India\'s share of world GDP fell from 25% (1700) to 4% (1950) under British colonial extraction; the EIC and subsequent British Raj extracted textile manufacturing (deindustrializing India\'s formerly world-leading textile industry to make room for British textiles), agricultural revenue (causing famines), and raw materials. Utsa Patnaik\'s research estimates total extraction of $45 trillion from India during the colonial period. The EIC demonstrated how extraction functions: suppress local manufacturing, convert to raw material export, drain surplus through taxation and trade terms. This is the template for colonial extraction that resource curse theorists identify as the historical origin of post-colonial dependency.',
    confidence: 'high' },

  // english_civil_war
  { id: 'english_civil_war__enlightenment',
    source: 'english_civil_war', target: 'enlightenment', type: 'ENABLED',
    label: 'The English Civil War produced the political concepts (constitutional limits on monarchy, parliamentary sovereignty) that the Enlightenment systematized',
    note: 'The English Civil War (1642-1651) was the political laboratory from which Enlightenment political theory emerged: Locke\'s social contract theory was developed in direct response to the Civil War\'s questions (what justifies royal authority? when is resistance legitimate?); the Levellers\' Agreement of the People (1647) articulated natural rights and democratic government concepts before Locke; Hobbes\' "Leviathan" (1651) was the conservative response to Civil War disorder; the Glorious Revolution (1688-89) and subsequent Bill of Rights produced the constitutional monarchy that Locke theorized. The English experience of civil war, regicide, restoration, and Glorious Revolution provided the empirical cases that Enlightenment political theory explained.',
    confidence: 'high' },
  { id: 'english_civil_war__american_revolution',
    source: 'english_civil_war', target: 'american_revolution', type: 'ENABLED',
    label: 'The English Civil War precedents — constitutional limits on monarchy, natural rights, parliamentary sovereignty — were directly invoked by American revolutionaries',
    note: 'American revolutionaries drew explicitly on English Civil War precedents: the argument that Parliament could not tax Americans without representation directly echoed English Civil War arguments about taxation without parliamentary consent; "Radical Whig" political thought (Commonwealth men) transmitted Civil War constitutional principles to American colonists; Thomas Jefferson\'s "A Summary View of the Rights of British America" (1774) argued from English constitutional tradition including Civil War precedents; the Levellers\' natural rights arguments appeared in modified form in the Declaration of Independence. The American Revolution was the English constitutional tradition applied to a colonial context.',
    confidence: 'high' },

  // robber_barons
  { id: 'robber_barons__supply_side_economics',
    source: 'robber_barons', target: 'supply_side_economics', type: 'SHARES_MECHANISM_WITH',
    label: 'Robber Baron-era "Social Darwinism" and supply-side economics share the argument that concentrated wealth creates general prosperity through investment',
    note: 'Robber Baron-era Social Darwinism and supply-side economics are historically connected as elite wealth justifications: Social Darwinism (Herbert Spencer, Andrew Carnegie\'s "Gospel of Wealth") argued that concentrated wealth was the natural product of superior individuals whose investment created general prosperity — "a rising tide lifts all boats" in 1880s language; supply-side economics ("trickle down") makes the same argument with modern economic vocabulary. Carnegie explicitly argued against higher taxation of the wealthy on the grounds that rich people allocate capital more efficiently than governments. Supply-side economics is Social Darwinism with macroeconomic vocabulary substituting for biological metaphor — same argument, updated framing.',
    confidence: 'high' },
  { id: 'robber_barons__wealth_inequality',
    source: 'robber_barons', target: 'wealth_inequality', type: 'SHARES_MECHANISM_WITH',
    label: 'Robber Baron-era Gilded Age inequality and contemporary inequality are separate historical peaks produced by similar policy conditions',
    note: 'Robber Baron-era inequality and contemporary wealth inequality are historically parallel: 1890s Gilded Age inequality (Carnegie, Rockefeller, Morgan wealth vs. working-class poverty) prompted Progressive Era and eventually New Deal redistribution through taxation, regulation, and labor rights; post-1980 neoliberal policies undid these redistributive mechanisms and reproduced similar inequality levels. Piketty\'s "Capital in the 21st Century" documents the U-shaped curve: high inequality (Gilded Age) → reduction through World Wars and New Deal policies (1914-1970) → return to high inequality (1980-present) through neoliberal policies. The Robber Baron comparison is analytically useful: contemporary billionaires have accumulated wealth at Gilded Age scale, suggesting similar political economy conditions.',
    confidence: 'high' },

  // great_migration
  { id: 'great_migration__harlem_renaissance',
    source: 'great_migration', target: 'harlem_renaissance', type: 'PRODUCED',
    label: 'The Great Migration created Harlem as the capital of Black America, producing the Harlem Renaissance cultural explosion',
    note: 'The Great Migration was the demographic foundation of the Harlem Renaissance: Black Southerners migrating to New York concentrated in Harlem, which became the largest Black urban community in the world by the 1920s; this concentration created the audience, patronage, and peer community that enabled the Harlem Renaissance\'s cultural production; Langston Hughes, Zora Neale Hurston, Claude McKay, Louis Armstrong, Duke Ellington — all were either migrants or the immediate products of migration communities. The Renaissance demonstrated that Black cultural genius was not dependent on Southern conditions — it had been suppressed by those conditions and flourished when given the urban resources, freedom, and audience that Northern migration provided.',
    confidence: 'high' },
  { id: 'great_migration__political_polarization',
    source: 'great_migration', target: 'political_polarization', type: 'ENABLED',
    label: 'The Great Migration transformed both Northern cities and Southern politics, reshaping the partisan alignment that produced contemporary polarization',
    note: 'The Great Migration reshaping of American politics took decades but was fundamental: Black migration to Northern cities created the urban-suburban racial divide that structured post-WWII politics; white flight from integrated neighborhoods (beginning 1940s-50s) produced suburban Republican constituencies; the Great Migration\'s political empowerment of Northern Black voters was a key factor in FDR\'s coalition and eventually produced the Civil Rights legislation that broke the New Deal coalition; Southern white voters moved to the Republican Party in response to civil rights (Goldwater 1964, Nixon\'s Southern Strategy), producing the partisan geographic sorting that defines contemporary polarization. The Great Migration set in motion demographic and political changes whose effects still shape American politics.',
    confidence: 'high' },

  // spanish_flu
  { id: 'spanish_flu__collective_trauma',
    source: 'spanish_flu', target: 'collective_trauma', type: 'PRODUCED',
    label: 'The Spanish flu killed 50-100 million people yet was suppressed from public consciousness for decades — a case study in collective trauma erasure',
    note: 'The Spanish flu is a case study in collective trauma suppression: wartime censorship prevented accurate reporting during the pandemic; the scale of death (50-100 million, more than WWI) was too overwhelming for normal grief processing; families were too depleted to publicly memorialize dead; post-war "normalcy" desire suppressed acknowledgment of pandemic suffering. The result was extraordinary amnesia: the Spanish flu was largely absent from public consciousness for decades, appearing only marginally in family stories and without the memorialization WWI received. Historians Laura Spinney ("Pale Rider") and John Barry ("The Great Influenza") documented this suppression. The COVID-19 pandemic\'s comparison to 1918 revealed that many Americans had never heard of the earlier pandemic.',
    confidence: 'high' },

  // martin_luther_king
  { id: 'martin_luther_king__nonviolent_resistance',
    source: 'martin_luther_king', target: 'nonviolent_resistance', type: 'ENABLED',
    label: 'King adapted Gandhi\'s satyagraha to the American context, developing a theology and practice of nonviolent resistance specific to Jim Crow',
    note: 'King\'s nonviolent resistance was a deliberate adaptation of Gandhian strategy to American conditions: King visited India in 1959 and met Gandhi\'s followers; his "Letter from Birmingham Jail" explains why nonviolence was a strategic choice adapted to the specific conditions of Jim Crow (the oppressor\'s violence would be televised; American democratic ideology would feel contradiction between "Land of the Free" and fire hoses); King\'s synthesis of Gandhi and the African American church tradition — agape love as the basis for nonviolent resistance — was distinctively American. King acknowledged that Gandhi was his inspiration while insisting his approach was adapted to American context rather than simply imported.',
    confidence: 'high' },
  { id: 'martin_luther_king__lgbtq_rights_movement',
    source: 'martin_luther_king', target: 'lgbtq_rights_movement', type: 'SHARES_MECHANISM_WITH',
    label: 'The Civil Rights Movement\'s legal and strategic toolkit was directly adopted by the LGBTQ rights movement',
    note: 'The LGBTQ rights movement explicitly modeled itself on Civil Rights Movement strategy: the movement\'s legal strategy (ACLU, Lambda Legal litigation from test cases up to Supreme Court) followed the NAACP LDF playbook; the "coming out" strategy paralleled the sit-in strategy of making discrimination visible and personal; the argument that sexual orientation is not a choice paralleled civil rights arguments that race-based discrimination targets immutable characteristics; Bayard Rustin (gay Black civil rights leader who organized the March on Washington) embodied the movements\' connection while his gayness was suppressed by movement leaders. King himself was reluctant to publicly support gay rights; his legacy has been claimed by both civil rights and LGBTQ movements.',
    confidence: 'high' },

  // hiroshima
  { id: 'hiroshima_nagasaki__cold_war',
    source: 'hiroshima_nagasaki', target: 'cold_war', type: 'ENABLED',
    label: 'Hiroshima and Nagasaki began the nuclear age whose strategic logic shaped every Cold War confrontation',
    note: 'Hiroshima and Nagasaki inaugurated the nuclear age that structured the entire Cold War: the bombings demonstrated that nuclear weapons were usable and decisive; the Soviet response (accelerated nuclear program, producing a bomb in 1949) immediately made nuclear deterrence the central Cold War strategic logic; every subsequent Cold War crisis — Berlin Blockade, Korean War, Suez, Berlin Wall, Cuba — was managed with awareness of the nuclear threshold; every US-Soviet relationship was fundamentally a nuclear relationship. The Cold War\'s defining characteristic — intense rivalry without direct superpower war — was a direct consequence of the nuclear deterrence logic that Hiroshima and Nagasaki had established.',
    confidence: 'high' },

  // gandhi
  { id: 'gandhi__civil_rights_movement',
    source: 'gandhi', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'Gandhi\'s satyagraha was the intellectual and strategic inspiration for the American Civil Rights Movement\'s nonviolent direct action',
    note: 'Gandhi directly influenced the American Civil Rights Movement through multiple pathways: CORE (Congress of Racial Equality, founded 1942) explicitly adopted Gandhian nonviolence from its founding; Bayard Rustin traveled to India in 1948 to study Gandhian methods; King\'s 1959 India visit and his study of Gandhi\'s writings shaped his strategic thinking; the Montgomery Bus Boycott (1955-56) adapted the Indian Gandhian boycott method to American conditions. Gandhi\'s insight — that nonviolent resistance to unjust laws forces authorities to reveal their violence publicly, delegitimizing them in democratic societies with free press — was the strategic foundation of civil rights protest. The sit-in at Greensboro (1960) was Gandhian civil disobedience applied to American lunch counters.',
    confidence: 'high' },

  // greek_democracy
  { id: 'greek_democracy__enlightenment',
    source: 'greek_democracy', target: 'enlightenment', type: 'ENABLED',
    label: 'Enlightenment political theorists used ancient Greek democracy as their primary historical reference case for self-governance',
    note: 'The Enlightenment\'s democratic theory was substantially constructed around Greek democracy: Rousseau\'s "general will" drew on Athenian direct democracy\'s model of citizen participation; Montesquieu analyzed Greek city-state constitutions in "The Spirit of the Laws"; the American founders\' debate about republic vs. democracy was explicitly framed in Greek terms (Athenian direct democracy as unstable; Spartan republic as stable but too oligarchic; Roman republic as the better model); the Federalist Papers\' authors were deeply versed in Greek political theory. The Enlightenment did not invent democracy — it theorized and updated the ancient Greek concept using Greek case studies as empirical evidence.',
    confidence: 'high' },

  // bay_of_pigs
  { id: 'bay_of_pigs__cold_war_proxy_wars',
    source: 'bay_of_pigs', target: 'cold_war_proxy_wars', type: 'ENABLED',
    label: 'Bay of Pigs exemplified the Cold War proxy war logic: using Cuban exile forces to remove a hostile government without direct US military involvement',
    note: 'Bay of Pigs was proxy war logic applied to Cuba: the CIA trained approximately 1,400 Cuban exiles (Brigade 2506) as a proxy force to overthrow Castro without direct US military involvement; the proxy force would maintain plausible deniability for the US while achieving the Cold War objective of eliminating the Cuban communist government. The operation failed because the proxy force was inadequate without direct US air support (which Kennedy denied to maintain deniability); the Cuban population did not rise up to support the invasion (overestimated anti-Castro sentiment); and Castro\'s intelligence had advance warning. Bay of Pigs demonstrated both the appeal of the proxy war approach (avoiding direct US involvement) and its limits (proxy forces are a poor substitute for adequate military capability).',
    confidence: 'high' },

  // chile
  { id: 'chile_coup_1973__latin_american_dirty_wars',
    source: 'chile_coup_1973', target: 'latin_american_dirty_wars', type: 'PRODUCED',
    label: 'Pinochet\'s Chile was both a Latin American dirty war and a template for subsequent dirty wars across the region through Operation Condor',
    note: 'Chile\'s dirty war was simultaneously an event and a regional organizing force: DINA (Pinochet\'s secret police) killed and tortured thousands domestically; Chile was a founding member of Operation Condor (1975) — the CIA-facilitated coordination system where Argentina, Brazil, Chile, Uruguay, Paraguay, and Bolivia shared intelligence and conducted cross-border operations against each other\'s dissidents; Condor operations assassinated dissidents in third countries (Orlando Letelier killed in Washington DC, 1976). Chile provided both the template (systematic detention-torture-disappearance) and the coordination infrastructure that characterized Latin American dirty wars. The Pinochet model was explicitly studied and emulated by subsequent dirty war regimes.',
    confidence: 'high' },
];

// ── Write files ───────────────────────────────────────────────────────────
let peAdded=0, heAdded=0;

newPolitEdges.forEach(e => { if (!peIds.has(e.id)) { pe.push(e); peIds.add(e.id); peAdded++; } });
newHistEdges.forEach(e => { if (!heIds.has(e.id)) { he.push(e); heIds.add(e.id); heAdded++; } });

fs.writeFileSync(D('data/global/politics/edges.json'), JSON.stringify(pe, null, 2));
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(he, null, 2));

console.log('Politics edges: +'+peAdded+' -> '+pe.length);
console.log('History edges: +'+heAdded+' -> '+he.length);

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
