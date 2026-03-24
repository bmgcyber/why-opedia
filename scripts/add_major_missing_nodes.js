#!/usr/bin/env node
// add_major_missing_nodes.js — add Great Depression, Haitian Revolution, Silk Road,
// McCarthyism, Cuban Revolution, Ho Chi Minh, New Deal, George W Bush, Roe v Wade,
// Great Firewall of China
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

// ── Load all data files ───────────────────────────────────────────────────
const histNodes = JSON.parse(fs.readFileSync(D('data/global/history/nodes.json')));
const histEdges = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const politNodes = JSON.parse(fs.readFileSync(D('data/global/politics/nodes.json')));
const politEdges = JSON.parse(fs.readFileSync(D('data/global/politics/edges.json')));
const mediaNodes = JSON.parse(fs.readFileSync(D('data/global/media/nodes.json')));
const mediaEdges = JSON.parse(fs.readFileSync(D('data/global/media/edges.json')));
const mechEdges = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));

const histIds = new Set(histNodes.map(n=>n.id));
const politIds = new Set(politNodes.map(n=>n.id));
const mediaIds = new Set(mediaNodes.map(n=>n.id));
const mechEdgeIds = new Set(mechEdges.map(e=>e.id));
const histEdgeIds = new Set(histEdges.map(e=>e.id));
const politEdgeIds = new Set(politEdges.map(e=>e.id));
const mediaEdgeIds = new Set(mediaEdges.map(e=>e.id));

// ── New history nodes ─────────────────────────────────────────────────────
const newHistNodes = [
  { id: 'great_depression',
    label: 'Great Depression',
    node_type: 'reference', category: 'event', decade: '1920s',
    scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Great_Depression',
    summary: 'The Great Depression (1929–1939) was the worst economic catastrophe in modern history: US GDP fell 30%, unemployment reached 25%, and bank failures wiped out savings. It was global — spreading through trade contraction and the gold standard — and politically transformative: it brought FDR and the New Deal in the US, Hitler and the NSDAP in Germany, and militarist governments in Japan. The Depression demonstrated that unregulated capitalism could produce systemic collapse, legitimizing state economic intervention for a generation. Its policy lessons — Keynesian stimulus, banking regulation, social safety nets — shaped postwar economic institutions.',
    tags: ['economics','capitalism','unemployment','fascism','keynesian','fdr','weimar','1930s'] },

  { id: 'haitian_revolution',
    label: 'Haitian Revolution',
    node_type: 'reference', category: 'event', decade: '1790s',
    scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Haitian_Revolution',
    summary: 'The Haitian Revolution (1791–1804) was the only successful slave revolt in history, producing the first Black republic in the Western hemisphere and permanently abolishing slavery in Haiti. Led by Toussaint L\'Ouverture and Jean-Jacques Dessalines, it defeated Napoleon\'s army — the best military force in Europe — and forced France\'s 1803 Louisiana Purchase (Napoleon needed cash after Haiti\'s loss). The revolution terrified slaveholding societies across the Americas, producing intense information suppression. Its success demonstrated that enslaved people would fight and die for freedom, challenging the ideological foundation of Atlantic slavery.',
    tags: ['slavery','revolution','haiti','atlantic','toussaint','napoleon','abolition','race'] },

  { id: 'silk_road',
    label: 'Silk Road',
    node_type: 'reference', category: 'era', decade: '-100s',
    scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Silk_Road',
    summary: 'The Silk Road (c. 130 BCE–1450 CE) was a network of trade routes connecting China to Central Asia, Persia, Arabia, and the Mediterranean. It transmitted silk, spices, paper, gunpowder, and Buddhism, Islam, and the Black Death westward, while carrying glass, gold, and Christianity eastward. The Mongol Empire\'s pax mongolica (1200s) enabled its peak period. The Ottoman Empire\'s control of eastern trade routes after the fall of Constantinople (1453) drove European maritime exploration seeking Silk Road alternatives — producing the Age of Discovery. The Silk Road is the original globalization network.',
    tags: ['trade','globalization','china','mongols','islam','buddhism','plague','columbus','exploration'] },

  { id: 'mccarthyism',
    label: 'McCarthyism',
    node_type: 'reference', category: 'event', decade: '1950s',
    scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/McCarthyism',
    summary: 'McCarthyism (1950–1956) was the campaign of accusations, blacklists, and government investigations targeting alleged Communist influence in American institutions — led by Senator Joseph McCarthy and fueled by HUAC (House Un-American Activities Committee). It destroyed careers through guilt by association, forced loyalty oaths, and congressional hearings that violated due process. The Hollywood blacklist silenced hundreds of writers, directors, and actors. McCarthyism is the American archetype of manufactured internal enemy panic — demonstrating how national security threat rhetoric suppresses dissent, and how institutional cowardice enables persecution until someone (Edward R. Murrow) publicly names it.',
    tags: ['communism','cold-war','blacklist','censorship','huac','loyalty-oaths','dissent','korea'] },

  { id: 'cuban_revolution',
    label: 'Cuban Revolution',
    node_type: 'reference', category: 'event', decade: '1950s',
    scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Cuban_Revolution',
    summary: 'The Cuban Revolution (1953–1959) brought Fidel Castro and the 26th of July Movement to power, overthrowing the US-backed Batista dictatorship and establishing a communist state 90 miles from Florida. It triggered the Bay of Pigs invasion (1961), the Cuban Missile Crisis (1962), and 60+ years of US embargo. Cuba exported its revolutionary model across Latin America, Africa, and Asia through Che Guevara\'s campaigns and internationalist military aid. The revolution made Cuba a Cold War flashpoint, demonstrating that small nations could successfully challenge American hegemony in its own backyard and producing one of the Cold War\'s most durable confrontations.',
    tags: ['cuba','castro','cold-war','communism','revolution','embargo','missile-crisis','latin-america'] },

  { id: 'ho_chi_minh',
    label: 'Ho Chi Minh',
    node_type: 'reference', category: 'person', decade: '1940s',
    scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Ho_Chi_Minh',
    summary: 'Ho Chi Minh (1890–1969) founded the Viet Minh independence movement, led Vietnam\'s defeat of France at Dien Bien Phu (1954), and unified North Vietnam as a communist state that eventually defeated the United States in the Vietnam War. A nationalist-communist hybrid, Ho was simultaneously a devoted Marxist-Leninist and an ardent Vietnamese patriot who cited the American Declaration of Independence at Vietnam\'s 1945 independence declaration. His persistence through 30 years of war — against Japan, France, and the United States — makes him one of the 20th century\'s most successful anticolonial leaders and a symbol of small-nation resistance to great-power domination.',
    tags: ['vietnam','communism','decolonization','anticolonialism','dien-bien-phu','cold-war','guerrilla'] },
];

// ── New politics nodes ────────────────────────────────────────────────────
const newPolitNodes = [
  { id: 'new_deal',
    label: 'New Deal',
    node_type: 'reference', category: 'policy', decade: '1930s',
    scope: 'global/politics', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/New_Deal',
    summary: 'The New Deal (1933–1939) was Franklin Roosevelt\'s response to the Great Depression: a package of banking regulation (Glass-Steagall), public works (WPA, CCC), labor rights (Wagner Act), agricultural support (AAA), and the Social Security Act (1935). It restructured the relationship between government and economy, establishing the administrative state as a legitimate economic actor. The New Deal\'s legacy — Keynesian fiscal policy, financial regulation, social insurance — defined American liberalism until Reagan\'s neoliberal counter-revolution. It remains the contested template for government responses to economic crisis.',
    tags: ['fdr','keynesian','social-security','welfare-state','regulation','labor','banking','depression'] },

  { id: 'george_w_bush',
    label: 'George W. Bush',
    node_type: 'reference', category: 'person', decade: '2000s',
    scope: 'global/politics', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/George_W._Bush',
    summary: 'George W. Bush (president 2001–2009) launched the War on Terror after 9/11, invading Afghanistan (2001) and Iraq (2003) based on false WMD intelligence. The Iraq War destabilized the Middle East, enabled ISIS, and killed hundreds of thousands. His administration authorized torture ("enhanced interrogation"), mass surveillance (PATRIOT Act), and Guantanamo indefinite detention. The 2003 Iraq invasion was accomplished through a manufactured WMD propaganda campaign — a case study in manufactured consent for war. Bush also cut taxes for the wealthy (Bush tax cuts) and presided over the 2008 financial crisis following deregulation.',
    tags: ['iraq-war','war-on-terror','9/11','wmd','torture','guantanamo','patriot-act','surveillance','neoconservatism'] },

  { id: 'roe_v_wade',
    label: 'Roe v. Wade',
    node_type: 'reference', category: 'event', decade: '1970s',
    scope: 'global/politics', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Roe_v._Wade',
    summary: 'Roe v. Wade (1973) was the Supreme Court decision establishing a constitutional right to abortion, triggering 50 years of culture war over reproductive rights. Its 2022 overturning in Dobbs v. Jackson — achieved through Trump\'s appointment of three Supreme Court justices — is the most significant reversal of a constitutional right in American history. Roe became the central organizing issue of evangelical Christian political mobilization, the culture wars, and the Republican Party\'s judicial strategy (Federalist Society, court packing). The fight over Roe demonstrates how judicial capture is a long-term democratic backsliding strategy.',
    tags: ['abortion','supreme-court','evangelical','culture-wars','reproductive-rights','dobbs','trump','judicial-capture'] },
];

// ── New media nodes ───────────────────────────────────────────────────────
const newMediaNodes = [
  { id: 'great_firewall_china',
    label: 'Great Firewall of China',
    node_type: 'reference', category: 'platform', decade: '1990s',
    scope: 'global/media', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Great_Firewall',
    summary: 'The Great Firewall (Golden Shield Project, 1998–present) is China\'s internet censorship and surveillance infrastructure — blocking Google, Facebook, Twitter, YouTube, Wikipedia, and The New York Times while monitoring all domestic internet activity. It has produced a parallel Chinese internet (WeChat, Weibo, Baidu) that operates under CCP content rules. The Great Firewall is the world\'s most sophisticated information control system, demonstrating that the internet — contrary to 1990s techno-optimism — can be fragmented along national lines. Its model is being exported: Russia, Iran, North Korea, and others have adopted elements of China\'s sovereign internet approach.',
    tags: ['censorship','china','internet','surveillance','weibo','wechat','sovereignty','authoritarian','information-control'] },
];

// ── Add new nodes (skip if already exist) ────────────────────────────────
let hn=0, pn=0, mn=0;
newHistNodes.forEach(n => { if (!histIds.has(n.id)) { histNodes.push(n); histIds.add(n.id); hn++; } });
newPolitNodes.forEach(n => { if (!politIds.has(n.id)) { politNodes.push(n); politIds.add(n.id); pn++; } });
newMediaNodes.forEach(n => { if (!mediaIds.has(n.id)) { mediaNodes.push(n); mediaIds.add(n.id); mn++; } });

// ── New history edges ─────────────────────────────────────────────────────
const newHistEdges = [
  // great_depression
  { id: 'world_war_i__great_depression',
    source: 'world_war_i', target: 'great_depression', type: 'ENABLED',
    label: 'WWI\'s war debts, reparations, and economic disruption created the financial fragility that made the Great Depression global',
    note: 'WWI created the economic conditions for the Depression: Allied war debts to the US (Britain and France owed $10B+); Germany\'s Versailles reparations ($33B) — which required Germany to borrow from American banks; the collapse of the gold standard\'s pre-war stability; and European agricultural and industrial disruption. When Wall Street crashed (1929), American banks called in German loans, German banks collapsed, the Weimar Republic\'s economy imploded, European banks failed in sequence. The Depression was global rather than merely American because of WWI\'s interlocking debt structure. German economic collapse directly enabled Hitler\'s rise.',
    confidence: 'high' },
  { id: 'great_depression__world_war_ii',
    source: 'great_depression', target: 'world_war_ii', type: 'ENABLED',
    label: 'The Great Depression enabled WWII by producing the economic desperation that brought Hitler, Mussolini, and Japanese militarists to power',
    note: 'The Great Depression was a necessary condition for WWII: Nazi electoral success tracked Germany\'s unemployment rate (27% in 1932); Mussolini had already seized power (1922) but Depression eliminated liberal opposition; Japanese military adventurism in Manchuria (1931) was partly driven by the economic crisis. Economic desperation produced political radicalization that liberal democratic institutions could not contain. The Depression demonstrated that capitalist economic crisis without adequate state response produces authoritarian political response — the lesson that shaped postwar Keynesian consensus and the welfare state construction.',
    confidence: 'high' },
  { id: 'treaty_of_versailles__great_depression',
    source: 'treaty_of_versailles', target: 'great_depression', type: 'ENABLED',
    label: 'Versailles reparations created the interlocking debt structure — Germany borrowing from American banks to pay reparations — that collapsed when Wall Street crashed',
    note: 'The Versailles Treaty\'s reparations created a circular financial structure: Germany borrowed from American banks (Dawes Plan, 1924) to pay French and British reparations, which France and Britain used to repay American WWI loans. When Wall Street crashed (1929), American banks called in German loans, German banks failed, the reparations flow stopped, and European banks collapsed in sequence. The reparations-debt circuit made the Depression global rather than American. Keynes had warned in "The Economic Consequences of the Peace" (1919) that the Versailles reparations structure was economically irrational and politically dangerous — he was right on both counts.',
    confidence: 'high' },

  // haitian_revolution
  { id: 'atlantic_slave_trade__haitian_revolution',
    source: 'atlantic_slave_trade', target: 'haitian_revolution', type: 'PRODUCED',
    label: 'The brutality of Saint-Domingue\'s plantation slavery system — the most intense in the hemisphere — produced the revolutionary conditions and leadership that ended it',
    note: 'Saint-Domingue (Haiti) was the most profitable colony in the world (producing 40% of Europe\'s sugar and 50% of its coffee) and had the most brutal plantation system in the hemisphere — with mortality rates so high that enslaved populations had to be continuously replenished through the slave trade. This brutality produced: massive enslaved population (500,000 vs. 40,000 whites and 30,000 free people of color); enslaved Africans with direct military experience (many were soldiers in Africa); and Toussaint L\'Ouverture\'s military genius, which had been forged in this extreme environment. The Haitian Revolution was the Atlantic slave trade\'s extreme consequences encountering Enlightenment ideals.',
    confidence: 'high' },
  { id: 'french_revolution__haitian_revolution',
    source: 'french_revolution', target: 'haitian_revolution', type: 'ENABLED',
    label: 'The French Revolution\'s Declaration of Rights of Man directly inspired Haitian revolutionary leaders who applied its universalist claims to enslaved people',
    note: 'The Haitian Revolution was a direct response to the French Revolution\'s universalist claims: Toussaint L\'Ouverture and Jean-Jacques Dessalines invoked the Declaration of the Rights of Man against France\'s failure to apply it to Saint-Domingue\'s enslaved population. The French Revolution first abolished slavery in 1794 (under pressure from Haitian forces); Napoleon Bonaparte reinstated it in 1802 and sent 40,000 troops to reconquer Haiti — a decision that cost France 50,000 soldiers to disease and Haitian resistance. The Haitian Revolution exposed the fundamental contradiction of Enlightenment universalism: "Liberty, Equality, Fraternity" applied only to free white men unless seized by force.',
    confidence: 'high' },
  { id: 'haitian_revolution__decolonization_movement',
    source: 'haitian_revolution', target: 'decolonization_movement', type: 'ENABLED',
    label: 'The Haitian Revolution was the template and inspiration for 20th century anticolonial movements — proof that colonial domination could be militarily defeated',
    note: 'The Haitian Revolution (1804) proved that an enslaved/colonized population could militarily defeat the most powerful European military force — demonstrating the possibility of successful anticolonial struggle that 20th century decolonization movements drew on. C.L.R. James\'s "The Black Jacobins" (1938) — the definitive account — was explicitly written as inspiration for African and Caribbean independence movements. Haitian revolutionary tradition influenced: Marcus Garvey\'s Pan-Africanism, Frantz Fanon\'s anticolonial theory, Caribbean independence movements, and African national liberation movements. The Revolution was systematically suppressed from historical memory precisely because of its demonstration that slavery could be ended by the enslaved.',
    confidence: 'high' },
  { id: 'haitian_revolution__american_civil_war',
    source: 'haitian_revolution', target: 'american_civil_war', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent enslaved people\'s violent rejection of chattel slavery — Haiti succeeded in 1804, the US required 60 years more before abolition',
    note: 'The Haitian Revolution and the American Civil War share the mechanism: enslaved people\'s organized rejection of chattel slavery through armed struggle. The Haitian Revolution\'s success terrified American slaveholders — John C. Calhoun and other Southern politicians attributed slave resistance and abolitionist sentiment to "Haitian contagion," and suppressed information about Haiti. The comparison haunted American slavery debates: if Haiti demonstrated enslaved people\'s capacity for self-liberation and governance, the entire ideological justification for American slavery (enslaved people\'s unfitness for freedom) was exposed as false. The Civil War was Haiti\'s deferred consequence in American history.',
    confidence: 'high' },

  // silk_road
  { id: 'silk_road__black_death',
    source: 'silk_road', target: 'black_death', type: 'ENABLED',
    label: 'The Silk Road\'s trade networks transmitted the Black Death from its Central Asian origin to Europe through Crimean ports',
    note: 'The Black Death\'s transmission route followed the Silk Road: the plague (Yersinia pestis) originated in Central Asia/China, traveled along Mongol trade routes westward, reached Crimean port Caffa (1346) — where besieging Mongol forces reportedly catapulted infected corpses into the city — then spread via Genoese trading ships to Constantinople, Sicily, and Europe. The Silk Road\'s efficiency at moving goods and people made it equally efficient at moving disease. The Black Death demonstrates how trade networks are simultaneously wealth and pathogen transmission networks — a lesson repeated with COVID-19\'s emergence along 21st century supply chains.',
    confidence: 'high' },
  { id: 'mongol_empire__silk_road',
    source: 'mongol_empire', target: 'silk_road', type: 'ENABLED',
    label: 'The Mongol Empire\'s pax mongolica created the safest and most active period of Silk Road trade, enabling East-West cultural transmission',
    note: 'The Mongol Empire\'s Pax Mongolica (c. 1260-1350) was the Silk Road\'s peak period: the Mongols unified the route from China to the Black Sea under a single military protection umbrella, dramatically reducing banditry and political disruption. Marco Polo\'s journey (1271-95) was only possible because of Mongol security. The Pax Mongolica transmitted: paper currency (from China to Islamic world), gunpowder, printing technology, silk, and the Black Death. The Mongol Empire was paradoxically both the Silk Road\'s greatest enabler and — through the Black Death\'s transmission along its routes — its most devastating disruptor.',
    confidence: 'high' },
  { id: 'silk_road__renaissance',
    source: 'silk_road', target: 'renaissance', type: 'ENABLED',
    label: 'Silk Road goods and classical manuscripts recovered through Islamic contact via trade routes fed Italian Renaissance learning and luxury culture',
    note: 'The Silk Road contributed to Renaissance preconditions: Italian city-states (Venice, Genoa, Florence) grew wealthy as Mediterranean termini for Silk Road trade, funding the merchant patronage class that sponsored Renaissance art and learning. Arabic manuscripts — including Aristotle, Euclid, and Avicenna — reached Europe through Silk Road commercial and cultural networks. Luxury goods (silk, spices, dyes) that defined Renaissance elite culture arrived via these routes. The Ottoman Empire\'s capture of Silk Road chokepoints (Constantinople 1453) drove Portuguese and Spanish maritime exploration — Columbus\'s 1492 voyage was explicitly seeking a western Silk Road alternative.',
    confidence: 'high' },
  { id: 'rise_of_islam__silk_road',
    source: 'rise_of_islam', target: 'silk_road', type: 'ENABLED',
    label: 'Islamic traders dominated Silk Road commerce from the 8th-15th centuries, transmitting Islamic culture, mathematics, and institutions along trade routes',
    note: 'From the 8th century CE onward, Islamic merchants dominated Silk Road trade: Arab and Persian traders controlled the western Silk Road routes; Muslim Sogdian merchants operated through Central Asia; the Islamic world served as the transmission belt between Chinese and Mediterranean civilizations. Along Silk Road routes, Islamic civilization transmitted: Arabic numerals (India to Europe), algebra (al-Khwarizmi), astronomical tables, and the paper-making technology from China. Cities like Samarkand, Bukhara, and Baghdad were Silk Road commercial and intellectual hubs. The Silk Road\'s peak period of cultural transmission was also Islamic civilization\'s intellectual golden age.',
    confidence: 'high' },

  // mccarthyism
  { id: 'korean_war__mccarthyism',
    source: 'korean_war', target: 'mccarthyism', type: 'ENABLED',
    label: 'The Korean War created the communist threat panic that McCarthy and HUAC exploited to attack domestic dissent',
    note: 'The Korean War (1950-53) created the political climate McCarthyism exploited: North Korea\'s invasion, Mao\'s China entering the war, and Soviet nuclear testing (1949) created a "who lost Asia?" panic that made communist threat accusations politically devastating. McCarthy\'s Senate career began with his Wheeling speech (February 1950, four months before Korea) but accelerated dramatically after North Korea\'s invasion demonstrated communist expansionism. The Korean War\'s domestic political consequence was the suppression of dissent — any questioning of US Cold War policy became vulnerable to communist sympathy accusations. McCarthyism was Korean War domestic political terror.',
    confidence: 'high' },
  { id: 'mccarthyism__cointelpro',
    source: 'mccarthyism', target: 'cointelpro', type: 'ENABLED',
    label: 'McCarthy\'s anti-communist campaign built the institutional infrastructure and cultural precedent for COINTELPRO\'s domestic surveillance of civil rights and anti-war movements',
    note: 'McCarthyism and COINTELPRO are two phases of the same FBI-led domestic political repression apparatus: McCarthy relied heavily on FBI director J. Edgar Hoover\'s files for his accusations, and Hoover used McCarthy to legitimize anti-communist surveillance. COINTELPRO (1956-1971) was the formal successor to McCarthyism — using the same surveillance and disruption tools but targeting civil rights (Martin Luther King), antiwar movements, and Black Panthers rather than Communists. Hoover\'s FBI ran both operations; both used secret surveillance, informants, and career destruction as tools of political suppression. COINTELPRO was McCarthyism with better legal cover and broader targets.',
    confidence: 'high' },
  { id: 'mccarthyism__vietnam_war',
    source: 'mccarthyism', target: 'vietnam_war', type: 'ENABLED',
    label: 'McCarthyism\'s political terror of "who lost China?" made Democratic presidents unable to consider withdrawal from Vietnam',
    note: 'McCarthyism directly produced the Vietnam War\'s political trap: the fear that any Democratic president who "lost" Southeast Asia to communism would face McCarthy-style accusations of Communist sympathy paralyzed Vietnam decision-making for 20 years. LBJ explicitly told advisers that withdrawing from Vietnam would produce "I was the president who lost Vietnam" — with the political consequences McCarthy had demonstrated were politically devastating. The men who escalated Vietnam (McNamara, Rusk, LBJ) were all veterans of the McCarthy period who understood that losing an Asian country to communism was politically unsurvivable. McCarthyism created the political trap that made Vietnam inevitable.',
    confidence: 'high' },

  // cuban_revolution
  { id: 'cuban_revolution__cuban_missile_crisis',
    source: 'cuban_revolution', target: 'cuban_missile_crisis', type: 'PRODUCED',
    label: 'The Cuban Revolution brought Soviet missiles to Cuba — the Bay of Pigs failure and Soviet-Cuban alliance produced the Missile Crisis',
    note: 'The Missile Crisis followed directly from the Cuban Revolution: Castro\'s 1959 revolution and subsequent nationalization of American companies drove Cuba into Soviet alliance; the CIA\'s Bay of Pigs invasion (April 1961) — a catastrophic failure — convinced Khrushchev that Cuba was vulnerable and pushed Castro deeper into Soviet embrace; Soviet missiles were placed in Cuba (1962) as a deterrent against another American invasion. The Missile Crisis is the Cuban Revolution\'s Cold War consequence — the US-Soviet confrontation that the Revolution made possible by establishing a communist state in America\'s sphere of influence.',
    confidence: 'high' },
  { id: 'latin_american_dirty_wars__cuban_revolution',
    source: 'cuban_revolution', target: 'latin_american_dirty_wars', type: 'ENABLED',
    label: 'Castro\'s Cuba provided ideological inspiration, military training, and material support for Latin American guerrilla movements that triggered military dirty wars',
    note: 'The Cuban Revolution directly enabled the Latin American dirty wars: Cuba trained and supported guerrilla movements across Latin America (Che Guevara\'s Bolivian campaign; Sandinistas; Colombian M-19; Argentine ERP and Montoneros), providing ideological legitimacy for armed leftist insurgency. US-backed military governments justified their dirty wars — Argentina\'s Proceso (30,000 disappeared), Chile\'s Pinochet coup, Guatemalan genocide — as anti-communist responses to Cuban-sponsored subversion. Cuba was simultaneously an inspiration for revolutionary movements and the justification for US-sponsored state terror against those movements and anyone associated with them.',
    confidence: 'high' },

  // ho_chi_minh
  { id: 'ho_chi_minh__vietnam_war',
    source: 'ho_chi_minh', target: 'vietnam_war', type: 'PRODUCED',
    label: 'Ho Chi Minh\'s leadership of the Vietnamese independence movement — first against France, then against the US — produced the Vietnam War',
    note: 'Ho Chi Minh produced the Vietnam War by refusing to accept any outcome short of Vietnamese reunification under communist leadership: defeating France at Dien Bien Phu (1954) established the Democratic Republic of Vietnam in the North; the Geneva Accords\' promised 1956 reunification elections (cancelled by US/South Vietnam because Ho would have won) created the political impasse that became war. Ho\'s genius was framing the war as national liberation rather than communist ideology — making it impossible for the US to distinguish between Vietnamese nationalism and communist subversion, because they were the same movement. Ho died in 1969 before reunification but had designed the strategy that achieved it.',
    confidence: 'high' },
  { id: 'decolonization_movement__ho_chi_minh',
    source: 'decolonization_movement', target: 'ho_chi_minh', type: 'ENABLED',
    label: 'Ho Chi Minh synthesized Vietnamese nationalism with Marxist-Leninist anti-imperialism into the most successful anticolonial military strategy of the 20th century',
    note: 'Ho Chi Minh was the most effective practitioner of decolonization as military strategy: trained in Moscow (1923), he applied Leninist vanguard party organization to Vietnamese nationalist movement-building; studied guerrilla warfare theory and translated it into Vietnamese conditions; built a coalition (Viet Minh) that transcended communist ideology by prioritizing national liberation. His success — defeating France (1954) and the United States (1975) with a poor, agrarian nation — became the template for Third World liberation movements during the Cold War. Ho demonstrated that asymmetric warfare, sustained popular support, and patience could defeat vastly superior military forces.',
    confidence: 'high' },
];

// ── New politics edges ────────────────────────────────────────────────────
const newPolitEdges = [
  // new_deal
  { id: 'franklin_roosevelt__new_deal',
    source: 'franklin_roosevelt', target: 'new_deal', type: 'PRODUCED',
    label: 'FDR\'s New Deal was the most ambitious peacetime expansion of federal government power in American history',
    note: 'Franklin Roosevelt\'s New Deal (1933-39) created the modern American administrative state: Social Security (1935), unemployment insurance, FDIC bank deposit insurance, SEC stock market regulation, Wagner Act labor protections, rural electrification, and the WPA\'s millions of public works jobs. Roosevelt navigated between business interests and labor demands, using the Depression crisis to justify state intervention that had previously been constitutionally contested. The New Deal\'s coalition — urban workers, African Americans (partially), Southern whites, intellectuals — defined Democratic Party politics for 30 years. Its opponents (Reagan, Tea Party movement) defined themselves against it equally long.',
    confidence: 'high' },
  { id: 'new_deal__neoliberalism',
    source: 'new_deal', target: 'neoliberalism', type: 'ENABLED',
    label: 'The New Deal\'s successful state capitalism became the target that neoliberalism defined itself against and ultimately dismantled',
    note: 'Neoliberalism (Hayek, Friedman, Reagan, Thatcher) defined itself against the New Deal\'s Keynesian welfare state model: deregulation reversed Glass-Steagall banking regulation (1999); supply-side tax cuts reversed New Deal progressive taxation; privatization reversed New Deal public investment; weakened unions reversed Wagner Act labor protections. The Mont Pelerin Society (1947) was founded specifically to develop an intellectual counter to New Deal-style social democracy. Reagan\'s "Government is not the solution; government is the problem" was the anti-New Deal formulation. Neoliberalism\'s success was measured in rolling back New Deal institutions one by one from 1980 to 2008.',
    confidence: 'high' },
  { id: 'new_deal__military_industrial_complex',
    source: 'new_deal', target: 'military_industrial_complex', type: 'ENABLED',
    label: 'The New Deal\'s administrative state and industrial mobilization infrastructure became the foundation for WWII and Cold War military-industrial complex',
    note: 'The New Deal\'s state-building directly enabled the military-industrial complex: New Deal agencies built the administrative capacity (planning, procurement, economic management) that WWII mobilization required; New Deal public works created industrial infrastructure (dams, electricity, highways) that military production used; the New Deal legitimized government-industry coordination that the military-industrial complex institutionalized. Eisenhower warned against the military-industrial complex in 1961 — the very year the New Deal\'s institutional legacy was being incorporated into permanent Cold War military spending. The New Deal didn\'t create the military-industrial complex but built the government capacity that enabled it.',
    confidence: 'medium' },

  // george_w_bush
  { id: 'george_w_bush__iraq_war_wmd',
    source: 'george_w_bush', target: 'iraq_war_wmd', type: 'PRODUCED',
    label: 'Bush administration\'s manufactured WMD case — presented to the UN by Powell, repeated in presidential speeches — justified the 2003 Iraq invasion',
    note: 'The Bush administration\'s case for the Iraq War was built on manufactured evidence: the aluminum tubes claim (attributed to uranium enrichment despite DOE dissent); the Niger yellowcake uranium forgery; the al-Qaeda-Saddam connection claim (without evidence); Curveball\'s fabricated mobile bioweapons lab testimony. The Iraq Survey Group found no WMD after the invasion. The Chilcot Inquiry (UK) concluded the war\'s legal basis was "far from satisfactory." Bush\'s presidency is the definitive case study of how manufactured consent for war operates at the highest levels of government — and how the media ecosystem (NYT\'s Judith Miller) can become complicit in amplifying false intelligence.',
    confidence: 'high' },
  { id: 'september_11_attacks__george_w_bush',
    source: 'september_11_attacks', target: 'george_w_bush', type: 'ENABLED',
    label: '9/11 gave Bush the political space to launch the War on Terror, invade two countries, and construct a surveillance state',
    note: '9/11 transformed Bush\'s presidency: his pre-9/11 approval rating was 51%; post-9/11 it reached 90% — enabling the Authorization for Use of Military Force (AUMF), the PATRIOT Act, the Afghanistan invasion, and ultimately the Iraq War on the theory that Saddam had WMD and terrorist connections. The 9/11 political space lasted long enough to justify all the major War on Terror policies before the WMD fabrication was exposed. Bush\'s presidency demonstrates how catastrophic events create political permission for actions that would otherwise be impossible — and why manufactured consent requires manufacturing a crisis or exploiting a real one.',
    confidence: 'high' },

  // roe_v_wade
  { id: 'roe_v_wade__evangelical_christianity',
    source: 'roe_v_wade', target: 'evangelical_christianity', type: 'ENABLED',
    label: 'Roe v. Wade transformed evangelical Christianity from largely apolitical to the Republican Party\'s most powerful constituency',
    note: 'Roe v. Wade (1973) was the central event in evangelical political mobilization: before Roe, most evangelical Christians were not politically organized around abortion (many supported abortion rights); Roe\'s constitutional protection of abortion triggered a systematic evangelical political response — Moral Majority (1979), Christian Coalition, Focus on the Family — that made abortion the unifying issue of evangelical politics for 50 years. The Federalist Society\'s judicial strategy (begun 1982) was largely designed to find justices who would overturn Roe. The 2022 Dobbs decision completing this strategy demonstrates how patient, systematic judicial capture works as a democratic backsliding tool.',
    confidence: 'high' },
  { id: 'trump_maga__roe_v_wade',
    source: 'trump_maga', target: 'roe_v_wade', type: 'DISCREDITED',
    label: 'Trump\'s three Supreme Court appointments — Gorsuch, Kavanaugh, Barrett — created the 5-4 majority that overturned Roe v. Wade in Dobbs (2022)',
    note: 'Trump\'s most durable institutional legacy was the Dobbs decision: his three Supreme Court appointments (Gorsuch 2017, Kavanaugh 2018, Barrett 2020) created the conservative supermajority that overturned Roe v. Wade in Dobbs v. Jackson Women\'s Health Organization (June 2022). This fulfilled the promise that motivated evangelical voters to support Trump despite his non-evangelical lifestyle. The Dobbs decision demonstrates how election outcomes have generational judicial consequences — Trump\'s presidency lasting 4 years produced Supreme Court justices with 30-year terms. The Federalist Society\'s 40-year judicial project achieved its central goal through Trump\'s court appointments.',
    confidence: 'high' },
  { id: 'roe_v_wade__culture_wars',
    source: 'roe_v_wade', target: 'culture_wars', type: 'ENABLED',
    label: 'Roe v. Wade was the organizing center of American culture wars — the issue that made abortion the defining partisan litmus test',
    note: 'Roe v. Wade organized American culture wars more than any other single ruling: for 50 years (1973-2022), abortion was the issue that sorted voters, politicians, judicial appointments, and party platforms. The Roe fight demonstrates how a single Supreme Court decision can restructure partisan alignment: before Roe, abortion was not consistently partisan; after Roe, it became the defining difference between the parties. The culture wars\' specific intensity — the moral absolute quality of the debate — reflects Roe\'s framing as a constitutional rights question that made compromise structurally difficult.',
    confidence: 'high' },
];

// ── New media edges ───────────────────────────────────────────────────────
const newMediaEdges = [
  { id: 'tiananmen_square_massacre__great_firewall_china',
    source: 'tiananmen_square_massacre', target: 'great_firewall_china', type: 'PRODUCED',
    label: 'The Tiananmen Square massacre\'s information suppression — and subsequent awareness of the internet\'s threat — drove Great Firewall development',
    note: 'The CCP\'s response to Tiananmen (1989) shaped the Great Firewall\'s political logic: the massacre\'s global TV coverage — CNN\'s live broadcast, the Tank Man photograph — demonstrated that information technology posed an existential threat to authoritarian control. As the internet developed in the 1990s, the CCP developed the Golden Shield Project (Great Firewall) specifically to prevent Tiananmen-type events from being documented and transmitted globally. The Tiananmen precedent — where information technology nearly toppled the CCP — drove the most comprehensive internet censorship infrastructure in history.',
    confidence: 'high' },
  { id: 'great_firewall_china__social_media_platforms',
    source: 'great_firewall_china', target: 'social_media_platforms', type: 'DISCREDITED',
    label: 'The Great Firewall blocks all Western social media platforms, creating a bifurcated global internet',
    note: 'The Great Firewall has created the global internet\'s permanent bifurcation: Google, Facebook, Instagram, Twitter/X, YouTube, Wikipedia, WhatsApp, and The New York Times are all blocked in China. In their place: Baidu (Google), WeChat (Facebook+WhatsApp), Weibo (Twitter), Bilibili (YouTube), Baidu Baike (Wikipedia) — all operating under CCP content rules. This creates a 1.4 billion-person internet ecosystem entirely separate from the global web, with the CCP controlling the information environment of the world\'s second-largest economy. The Great Firewall demonstrates that internet fragmentation along national sovereignty lines was always possible despite 1990s techno-optimist predictions.',
    confidence: 'high' },
  { id: 'great_firewall_china__fox_news',
    source: 'great_firewall_china', target: 'fox_news', type: 'SHARES_MECHANISM_WITH',
    label: 'Both create curated information ecosystems that systematically exclude challenging information and reinforce predetermined political narratives',
    note: 'The Great Firewall and Fox News ecosystem share a functional mechanism: both create curated information environments where citizens have difficulty accessing contradictory information. The Great Firewall uses state technical censorship; Fox News uses selective coverage, framing, and audience self-selection. Both produce audiences who believe their media accurately represents reality while being systematically misinformed on key factual questions (Fox viewers\' beliefs about Iraq WMD, COVID, election fraud; Chinese citizens\' beliefs about Tiananmen, Xinjiang, Taiwan). The mechanism — curated information ecosystem producing self-reinforcing beliefs — operates at different scales and through different means but produces similar epistemic outcomes.',
    confidence: 'medium' },
  { id: 'great_firewall_china__cambridge_analytica',
    source: 'great_firewall_china', target: 'cambridge_analytica', type: 'SHARES_MECHANISM_WITH',
    label: 'Both use data surveillance and information control for political manipulation — state vs. corporate versions of the same epistemic control project',
    note: 'The Great Firewall and Cambridge Analytica represent two models of information-environment manipulation: China uses state infrastructure to monitor and control information systematically; Cambridge Analytica used harvested data to micro-target individuals with psychologically tailored political messaging. Both aim at the same goal: shaping populations\' beliefs and political behavior through control of information environment. The difference is scale (1.4B vs. 87M Facebook users) and method (censorship vs. targeting), but the underlying project — using information technology to produce desired political outcomes in populations — is identical.',
    confidence: 'medium' },
];

// ── Mechanism edges for new nodes ─────────────────────────────────────────
const newMechEdges = [
  // great_depression
  { id: 'collective_trauma__great_depression',
    source: 'collective_trauma', target: 'great_depression', type: 'ENABLED',
    label: 'The Great Depression produced collective trauma that shaped an entire generation\'s economic behavior and political assumptions for 50 years',
    note: 'The Depression generation (those who came of age 1929-1939) carried collective economic trauma that shaped behavior for life: obsessive saving, distrust of banks, hoarding behavior, garden plots, and voting patterns that reliably supported the New Deal coalition for 50 years. Tom Brokaw\'s "Greatest Generation" concept is partly a description of Depression-formed character — frugality, stoicism, community obligation — produced by collective economic trauma. The Depression\'s collective trauma explains why the postwar Keynesian consensus held for 30 years: a generation of voters and politicians who had survived the Depression would not risk repeating it.',
    confidence: 'high' },
  { id: 'democratic_backsliding__great_depression',
    source: 'democratic_backsliding', target: 'great_depression', type: 'ENABLED',
    label: 'The Depression enabled democratic backsliding across Europe by creating economic desperation that authoritarian movements exploited',
    note: 'The Great Depression\'s political consequence was democratic backsliding across Europe: Germany (Hitler, 1933), Italy (Mussolini already in power but Depression ended liberal opposition), Austria (Dollfuss, 1933), Spain (Franco civil war 1936), Hungary, Romania, and others all moved toward authoritarianism as Depression-era economic desperation discredited liberal democratic parties that had failed to address it. FDR prevented American democratic backsliding by expanding government intervention — the New Deal — at the cost of elite economic interests. The Depression demonstrated that capitalism without adequate state management produces economic crises that destroy the democracies capitalism claims to require.',
    confidence: 'high' },

  // haitian_revolution
  { id: 'dehumanization__haitian_revolution',
    source: 'dehumanization', target: 'haitian_revolution', type: 'ENABLED',
    label: 'Atlantic slavery\'s systematic dehumanization of enslaved people paradoxically produced the Haitian Revolution\'s ferocity — people fighting to reclaim their humanity',
    note: 'The Haitian Revolution\'s violence — including the 1804 massacre of most remaining white Haitians — cannot be understood without the dehumanization that Atlantic slavery required: a system that treated human beings as livestock for 200 years produced a revolutionary response that matched its brutality. Frederick Douglass argued that American slaveholders were the real creators of slave rebellion\'s violence by making violence the only language they understood. The Haitian Revolution demonstrates the dialectic of dehumanization: the attempt to dehumanize human beings produces a struggle to reclaim humanity that the dehumanizers experience as incomprehensible violence.',
    confidence: 'high' },
  { id: 'collective_trauma__haitian_revolution',
    source: 'haitian_revolution', target: 'collective_trauma', type: 'PRODUCED',
    label: 'Haiti\'s collective trauma from slavery and its aftermath — isolation, debt, foreign intervention — produced the persistent underdevelopment that continues today',
    note: 'Haiti\'s post-revolutionary collective trauma is one of history\'s most sustained: the 1825 French indemnity (Haiti paid France $21B in today\'s value for French slaveholders\' "lost property" — meaning the enslaved people themselves — which wasn\'t fully paid until 1947); the US occupation (1915-1934); the Duvalier dictatorship (1957-1986); and the 2010 earthquake. Haiti\'s poverty is not an outcome of Haitian culture but of compounded external interventions beginning the moment slavery ended. The trauma of being the only nation in history to pay reparations to slaveholders — and of being isolated and destabilized for demonstrating that enslaved people could govern themselves — is Haiti\'s defining collective experience.',
    confidence: 'high' },

  // silk_road
  { id: 'cultural_hegemony__silk_road',
    source: 'cultural_hegemony', target: 'silk_road', type: 'ENABLED',
    label: 'The Silk Road was the primary mechanism of cultural hegemony transmission between civilizations for 1600 years',
    note: 'The Silk Road was not merely a trade route but a cultural hegemony transmission mechanism: dominant civilizational concepts (Chinese bureaucratic techniques, Islamic mathematics and astronomy, Indian zero and decimal system, Greek philosophy via Islamic transmission) spread along trade routes because commercial contact brought cultural contact. The Islamic world\'s dominance of Silk Road trade 8th-15th centuries made Arabic the Silk Road\'s intellectual lingua franca — transmitting Islamic scientific and philosophical achievements to both East and West. Cultural hegemony along trade routes is not incidental but structural: commercial dominance enables cultural dominance.',
    confidence: 'high' },

  // mccarthyism
  { id: 'manufactured_consent__mccarthyism',
    source: 'manufactured_consent', target: 'mccarthyism', type: 'ENABLED',
    label: 'McCarthyism required mass media cooperation to manufacture consent for Communist threat panic that justified political persecution',
    note: 'McCarthyism was a manufactured consent operation: the media (newspapers, radio, early television) amplified McCarthy\'s accusations without investigating their basis; mainstream newspapers printed his charges as front-page news before evidence was assessed; the "he said/she said" journalistic norm gave Communist accusations equal standing with denials. Edward R. Murrow\'s See It Now (March 1954) was remarkable because it broke from manufactured consent — actually analyzing McCarthy\'s claims against evidence — and demonstrated that McCarthy\'s accusations couldn\'t withstand factual scrutiny. McCarthyism collapsed when media stopped manufacturing consent for it.',
    confidence: 'high' },
  { id: 'in_group_out_group_dynamics__mccarthyism',
    source: 'in_group_out_group_dynamics', target: 'mccarthyism', type: 'ENABLED',
    label: 'McCarthyism operated through extreme in-group/out-group dynamics: "true Americans" vs. Communist infiltrators',
    note: 'McCarthyism\'s psychological mechanism was in-group/out-group dynamics applied to Cold War anxiety: "loyal Americans" vs. Communist infiltrators and their "fellow travelers." The genius of McCarthyite accusation was that it targeted people\'s group identities — being accused of Communist sympathy meant expulsion from the American in-group, with career-ending consequences. The social pressure to publicly distance from accused individuals (lest association imply sympathy) created the cascade of denunciations that destroyed careers. Arthur Miller\'s "The Crucible" (1953) drew the parallel explicitly: McCarthyism and Salem witch trials operated through identical in-group/out-group accusation dynamics.',
    confidence: 'high' },

  // cuban_revolution
  { id: 'legitimate_grievance_capture__cuban_revolution',
    source: 'legitimate_grievance_capture', target: 'cuban_revolution', type: 'ENABLED',
    label: 'Castro\'s July 26th Movement captured genuine Cuban grievances — US corporate domination, Batista corruption — for communist ideological ends',
    note: 'The Cuban Revolution succeeded by capturing genuine popular grievances: US corporations owned 40% of Cuba\'s sugar production and 50% of its utilities; the Batista government was nakedly corrupt and brutal; income inequality was extreme. Castro\'s July 26th Movement — initially presenting itself as nationalist rather than communist — channeled these legitimate grievances into a revolution that then imposed a communist state. US policy (the embargo, Bay of Pigs) then validated Cuba\'s anti-imperialist narrative, allowing Castro to maintain popular legitimacy despite the revolution\'s subsequent authoritarianism. Legitimate grievance capture enabled and sustained the Cuban Revolution.',
    confidence: 'high' },

  // new_deal
  { id: 'social_contract_theory__new_deal',
    source: 'social_contract_theory', target: 'new_deal', type: 'ENABLED',
    label: 'The New Deal was applied social contract theory: government\'s obligation to ensure minimum welfare in exchange for democratic legitimacy',
    note: 'The New Deal operationalized social contract theory in American politics: FDR\'s argument — and subsequent articulation in the Four Freedoms — was that political legitimacy required government to ensure "freedom from want." This was Lockean social contract extended to economic security: citizens exchange political participation for government protection of more than just physical security and property; they are owed protection from economic catastrophe. The New Deal\'s durability reflected this social contract logic — voters who had survived the Depression understood that government protection from economic disaster was what government was for. Neoliberalism\'s project was redefining the social contract to exclude economic security.',
    confidence: 'high' },

  // george_w_bush
  { id: 'manufactured_consent__george_w_bush',
    source: 'manufactured_consent', target: 'george_w_bush', type: 'ENABLED',
    label: 'The Bush administration\'s WMD case was the most consequential manufactured consent operation in American history',
    note: 'The Bush administration\'s case for the Iraq War was manufactured consent at the highest level: Cheney\'s repeated TV appearances asserting WMD certainty; the White House Iraq Group\'s deliberate media strategy to "sell" the war; the NYT\'s Judith Miller publishing unchecked WMD claims as front page news; Colin Powell\'s UN presentation using fabricated intelligence. The Downing Street Memo (leaked 2005) revealed British intelligence knew intelligence was "being fixed around the policy." 4,500 American soldiers and 150,000+ Iraqis died as a direct consequence of this manufactured consent operation. It remains the textbook case for how democratic publics can be misled into war.',
    confidence: 'high' },

  // roe_v_wade
  { id: 'democratic_backsliding__roe_v_wade',
    source: 'democratic_backsliding', target: 'roe_v_wade', type: 'ENABLED',
    label: 'Dobbs v. Jackson represents democratic backsliding through judicial capture — using court appointments to override majority public opinion on abortion rights',
    note: 'The overturning of Roe v. Wade via Dobbs (2022) is democratic backsliding through judicial means: polls consistently showed 60-70% of Americans supported abortion rights; Dobbs overrode this majority preference using a Supreme Court whose majority was appointed by presidents who lost the popular vote (Bush in 2000, Trump in 2016) and confirmed by senators representing a minority of Americans. The Federalist Society\'s 40-year judicial project — systematically selecting and grooming anti-Roe justices — is textbook democratic backsliding: using legitimate institutional processes to achieve outcomes opposed by democratic majorities. Dobbs demonstrates that judicial capture is the most durable form of democratic backsliding.',
    confidence: 'high' },

  // great_firewall
  { id: 'manufactured_consent__great_firewall_china',
    source: 'manufactured_consent', target: 'great_firewall_china', type: 'ENABLED',
    label: 'The Great Firewall is the world\'s most sophisticated infrastructure for manufacturing consent at population scale',
    note: 'The Great Firewall operationalizes manufactured consent at unprecedented scale: Chinese citizens have access to a curated information environment designed to produce specific political beliefs — that the CCP governs competently, that foreign criticism reflects anti-China bias, that Tiananmen never happened. Unlike Western media manufactured consent (which operates through selective emphasis and framing), the Great Firewall operates through technical censorship, AI monitoring of "sensitive" search terms, and real-time content removal. The 50 Cent Army (paid commenters who promote CCP positions) adds active consent manufacturing to passive censorship. Together they produce a population largely supportive of its own information suppression.',
    confidence: 'high' },
  { id: 'broken_epistemology__great_firewall_china',
    source: 'great_firewall_china', target: 'broken_epistemology', type: 'PRODUCED',
    label: 'The Great Firewall produces a systematically broken epistemology for 1.4 billion people — a national-scale epistemic bubble',
    note: 'The Great Firewall produces broken epistemology at population scale: Chinese citizens who cannot access Wikipedia, Google, or foreign news sources have systematically different (and systematically false) beliefs about: the Tiananmen Square death toll, the Xinjiang internment camps, Taiwan\'s international status, and COVID-19\'s origins. This is not individual epistemological failure but state-engineered mass epistemological manipulation. The COVID-19 pandemic demonstrated this: Chinese citizens had access to government claims about the virus while foreign researchers had access to evidence the government suppressed. The Great Firewall doesn\'t just create ignorance — it engineers specific false beliefs at national scale.',
    confidence: 'high' },
];

// ── Add nodes and edges ───────────────────────────────────────────────────
newHistNodes.forEach(n => { if (!histIds.has(n.id)) { histNodes.push(n); histIds.add(n.id); hn++; } });
newPolitNodes.forEach(n => { if (!politIds.has(n.id)) { politNodes.push(n); politIds.add(n.id); pn++; } });
newMediaNodes.forEach(n => { if (!mediaIds.has(n.id)) { mediaNodes.push(n); mediaIds.add(n.id); mn++; } });

let he=0, pe=0, me_c=0, mec=0;
newHistEdges.forEach(e => { if (!histEdgeIds.has(e.id)) { histEdges.push(e); histEdgeIds.add(e.id); he++; } });
newPolitEdges.forEach(e => { if (!politEdgeIds.has(e.id)) { politEdges.push(e); politEdgeIds.add(e.id); pe++; } });
newMediaEdges.forEach(e => { if (!mediaEdgeIds.has(e.id)) { mediaEdges.push(e); mediaEdgeIds.add(e.id); me_c++; } });
newMechEdges.forEach(e => { if (!mechEdgeIds.has(e.id)) { mechEdges.push(e); mechEdgeIds.add(e.id); mec++; } });

// ── Write all files ───────────────────────────────────────────────────────
fs.writeFileSync(D('data/global/history/nodes.json'), JSON.stringify(histNodes, null, 2));
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(histEdges, null, 2));
fs.writeFileSync(D('data/global/politics/nodes.json'), JSON.stringify(politNodes, null, 2));
fs.writeFileSync(D('data/global/politics/edges.json'), JSON.stringify(politEdges, null, 2));
fs.writeFileSync(D('data/global/media/nodes.json'), JSON.stringify(mediaNodes, null, 2));
fs.writeFileSync(D('data/global/media/edges.json'), JSON.stringify(mediaEdges, null, 2));
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(mechEdges, null, 2));

console.log('Nodes added: history+'+hn+', politics+'+pn+', media+'+mn);
console.log('Edges added: history+'+he+', politics+'+pe+', media+'+me_c+', mechanisms+'+mec);

// ── Integrity check ───────────────────────────────────────────────────────
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));

let orphans = 0;
[...histEdges, ...politEdges, ...mediaEdges, ...mechEdges].forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source, '(in edge '+e.id+')'); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target, '(in edge '+e.id+')'); orphans++; }
});
console.log('Total orphans:', orphans);
