#!/usr/bin/env node
// add_batch6_nodes.js — more coverage: labor movement, robber barons, FDR, Reconstruction,
//   Jim Crow, red scare, climate change denial, epigenetics, psychology nodes
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
    id: 'labor_movement',
    label: 'Labor Movement',
    node_type: 'movement',
    category: 'movement',
    decade: '1870s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Labour_movement',
    summary: 'Collective organization of workers to improve wages, hours, and conditions through unions, strikes, and political action; responsible for the 8-hour day, weekends, child labor laws, and workplace safety.',
    tags: ['unions', 'workers rights', 'strikes', 'collective bargaining', 'socialism', 'class struggle', 'AFL-CIO']
  },
  {
    id: 'reconstruction_era',
    label: 'Reconstruction Era',
    node_type: 'era',
    category: 'era',
    decade: '1860s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Reconstruction_era',
    summary: 'Period 1865-1877 of attempted integration of formerly enslaved people into American political and economic life; ended by the Compromise of 1877 and subsequent violent removal of Black political power in the South.',
    tags: ['reconstruction', 'civil war aftermath', 'black suffrage', 'freedmen', 'jim crow', 'compromise 1877', 'political rights']
  },
  {
    id: 'jim_crow',
    label: 'Jim Crow Laws',
    node_type: 'policy',
    category: 'policy',
    decade: '1870s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Jim_Crow_laws',
    summary: 'System of racial apartheid laws in the US South (1877-1965) enforcing racial segregation in schools, transportation, public accommodations, and political life; enforced through legal discrimination and racial terror.',
    tags: ['segregation', 'racial apartheid', 'south', 'disenfranchisement', 'lynching', 'separate but equal', 'civil rights']
  },
  {
    id: 'franklin_d_roosevelt',
    label: 'Franklin D. Roosevelt',
    node_type: 'person',
    category: 'person',
    decade: '1930s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Franklin_D._Roosevelt',
    summary: 'US President 1933-1945; created the New Deal to address the Great Depression, led the US through WWII, established the modern welfare state; also interned Japanese Americans and made strategic compromises on civil rights.',
    tags: ['new deal', 'great depression', 'world war ii', 'welfare state', 'keynesianism', 'japanese internment', 'four terms']
  },
];

// ── New History nodes ─────────────────────────────────────────────────────
const newHistNodes = [
  {
    id: 'red_scare',
    label: 'Red Scare',
    node_type: 'era',
    category: 'era',
    decade: '1940s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Second_Red_Scare',
    summary: 'Period of intense anti-communist suspicion in the US (1947-1957) driven by McCarthy hearings, HUAC investigations, Hollywood blacklists, and loyalty oaths; produced lasting chilling effects on American left politics.',
    tags: ['mccarthyism', 'communism', 'huac', 'blacklist', 'cold war', 'loyalty oaths', 'witch hunt']
  },
  {
    id: 'robber_barons',
    label: 'Robber Barons',
    node_type: 'era',
    category: 'era',
    decade: '1870s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Robber_baron_(industrialist)',
    summary: 'Late 19th-century US industrialists (Rockefeller, Carnegie, Morgan, Vanderbilt) who built monopolistic fortunes through ruthless business practices, labor exploitation, and political corruption; spurred the Progressive Era regulatory response.',
    tags: ['gilded age', 'monopoly', 'rockefeller', 'carnegie', 'morgan', 'trust', 'inequality', 'industrialization']
  },
  {
    id: 'great_migration',
    label: 'Great Migration',
    node_type: 'event',
    category: 'event',
    decade: '1910s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Great_Migration_(African_American)',
    summary: 'Mass movement of 6 million African Americans from the rural South to Northern and Western cities (1910-1970), driven by Jim Crow terror and economic opportunity; transformed American cities, politics, and culture.',
    tags: ['african american', 'migration', 'jim crow', 'great migration', 'harlem', 'chicago', 'urban', 'north']
  },
  {
    id: 'tulsa_race_massacre',
    label: 'Tulsa Race Massacre',
    node_type: 'event',
    category: 'event',
    decade: '1920s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Tulsa_race_massacre',
    summary: 'Destruction of Greenwood ("Black Wall Street") in Tulsa, Oklahoma in 1921 by white mobs and deputized rioters; 300 killed, 10,000 left homeless, 35 blocks burned; covered up for decades as American history.',
    tags: ['race massacre', 'black wall street', 'greenwood', 'oklahoma', 'racial violence', 'suppressed history', '1921']
  },
];

// ── New Mechanism nodes ───────────────────────────────────────────────────
const newMechNodes = [
  {
    id: 'climate_change_denial',
    label: 'Climate Change Denial',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1990s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Climate_change_denial',
    summary: 'Organized campaign by fossil fuel interests and ideological allies to cast doubt on climate science, delay action, and protect carbon-intensive industries; modeled on tobacco industry denial tactics.',
    tags: ['climate', 'fossil fuels', 'denial', 'disinformation', 'manufactured doubt', 'Koch brothers', 'ExxonMobil', 'delay']
  },
  {
    id: 'moral_panic',
    label: 'Moral Panic',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1970s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Moral_panic',
    summary: 'Sociological phenomenon where media and public react to a perceived threat to social values with disproportionate fear and punitive demands; often targets minority groups and serves to reinforce social hierarchies.',
    tags: ['sociology', 'media panic', 'scapegoating', 'satanic panic', 'drug war', 'folk devils', 'deviancy amplification']
  },
  {
    id: 'epigenetics',
    label: 'Epigenetics & Intergenerational Trauma',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1990s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Epigenetics',
    summary: 'Biological mechanism by which environmental experiences (including trauma, stress, and poverty) alter gene expression without changing DNA sequence; evidence for intergenerational transmission of trauma effects.',
    tags: ['epigenetics', 'intergenerational trauma', 'gene expression', 'trauma', 'biology', 'Holocaust survivors', 'methyl groups']
  },
];

// ── New Psychology nodes ──────────────────────────────────────────────────
const newPsychNodes = [
  {
    id: 'radicalization',
    label: 'Online Radicalization',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2010s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Radicalization',
    summary: 'Process by which individuals adopt increasingly extreme political, social, or religious views, often facilitated by online communities that provide validation, identity, and escalating content.',
    tags: ['extremism', 'pipeline', 'online communities', 'identity', 'echo chamber', 'white nationalism', 'incel', 'ISIS']
  },
  {
    id: 'mgtow',
    label: 'MGTOW / Manosphere',
    node_type: 'movement',
    category: 'movement',
    decade: '2010s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Men_going_their_own_way',
    summary: 'Men Going Their Own Way and associated manosphere communities promoting male separatism, anti-feminism, and grievance identity; shares pipeline dynamics with incel and far-right communities.',
    tags: ['mgtow', 'manosphere', 'anti-feminism', 'red pill', 'incel adjacent', 'masculinity', 'grievance identity']
  },
  {
    id: 'conspiracy_theories',
    label: 'Conspiracy Theory Psychology',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1990s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Conspiracy_theory',
    summary: 'Psychological and social dynamics underlying belief in conspiracy theories: need for cognitive closure, pattern recognition overactivation, distrust of institutions, social belonging in belief communities.',
    tags: ['conspiracy', 'psychology', 'epistemology', 'distrust', 'pattern recognition', 'qanon', 'cognitive bias']
  },
];

// ── Politics edges ────────────────────────────────────────────────────────
const newPolitEdges = [
  // Labor movement
  { id: 'labor_movement__new_deal',
    source: 'labor_movement', target: 'new_deal', type: 'ENABLED',
    label: 'Labor movement pressure and electoral power made the New Deal\'s pro-labor legislation politically possible',
    note: 'The labor movement was essential to the New Deal\'s political economy: the 1930s mass strike wave (sit-down strikes, auto workers, steelworkers) demonstrated labor\'s power; the AFL and CIO provided FDR\'s electoral coalition; labor leaders shaped the National Labor Relations Act (Wagner Act, 1935) and Social Security. The New Deal gave labor legal recognition and collective bargaining rights (NLRA); labor gave the New Deal the political base to overcome business opposition. The New Deal-labor alliance was the foundation of Democratic Party politics for the next 40 years.',
    confidence: 'high' },
  { id: 'labor_movement__neoliberalism',
    source: 'labor_movement', target: 'neoliberalism', type: 'DISCREDITED',
    label: 'Neoliberalism systematically dismantled the institutional power of the labor movement through Reagan-Thatcher era policy',
    note: 'Neoliberalism targeted labor movement institutional power as central to its project: Reagan\'s PATCO strike-breaking (1981) signaled government would not enforce labor rights; Thatcher broke the miners\' union (1984-85); deregulation and trade liberalization moved manufacturing to low-wage countries; anti-union legislation reduced organizing rights. Union membership in the US fell from 35% (1955) to 10% (2020). This was not market accident — it was deliberate policy. The decline of union power correlates precisely with the rise in income inequality, demonstrating that unions were the primary institutional mechanism for distributing productivity gains to workers.',
    confidence: 'high' },
  { id: 'labor_movement__civil_rights_movement',
    source: 'labor_movement', target: 'civil_rights_movement', type: 'SHARES_MECHANISM_WITH',
    label: 'The labor and civil rights movements shared organizing tactics, leadership, and goals while also experiencing deep racial tension within unions',
    note: 'The labor and civil rights movements had complex, intertwined histories: A. Philip Randolph organized the Brotherhood of Sleeping Car Porters (first major Black union) and used labor power to desegregate defense industries (threatened 1941 march on Washington that produced FDR\'s Executive Order 8802); the 1963 March on Washington was officially a March for Jobs and Freedom organized by labor leaders; King was in Memphis supporting striking sanitation workers when assassinated (1968). But AFL unions also enforced racial exclusion for decades. The movements shared class analysis and organizing tactics while navigating the union movement\'s structural racism.',
    confidence: 'high' },

  // Reconstruction / Jim Crow
  { id: 'reconstruction_era__jim_crow',
    source: 'reconstruction_era', target: 'jim_crow', type: 'ENABLED',
    label: 'The failure of Reconstruction directly produced Jim Crow as the Southern white elite reasserted political and economic control',
    note: 'Jim Crow was the direct consequence of Reconstruction\'s defeat: the Compromise of 1877 ended federal enforcement of Reconstruction amendments; Southern states immediately began dismantling Black political power through violence, fraud, and eventually literacy tests and poll taxes; the Supreme Court\'s Plessy v. Ferguson (1896) provided the legal architecture; lynching enforced the new racial order through terror. Jim Crow was not a natural cultural development — it was a deliberate political project to restore the racial hierarchy that slavery had institutionalized, adapting to the post-slavery legal context.',
    confidence: 'high' },
  { id: 'american_civil_war__reconstruction_era',
    source: 'american_civil_war', target: 'reconstruction_era', type: 'PRODUCED',
    label: 'The Civil War\'s military victory over slavery produced the Reconstruction effort to integrate formerly enslaved people into the republic',
    note: 'Reconstruction was the political consequence of Union victory: the 13th, 14th, and 15th amendments abolished slavery, established birthright citizenship, and guaranteed voting rights; the Freedmen\'s Bureau attempted economic integration; Black Americans held office throughout the South for the first time. Reconstruction demonstrated what was possible — and its violent defeat demonstrated the limits of legal change without sustained enforcement. Historians now recognize Reconstruction\'s achievements as remarkable given the scale of the task; its failure was not inevitable but the result of political decisions to withdraw federal troops and enforcement.',
    confidence: 'high' },
  { id: 'jim_crow__civil_rights_movement',
    source: 'jim_crow', target: 'civil_rights_movement', type: 'PRODUCED',
    label: 'Jim Crow\'s systematic racial violence and legal oppression was the direct target and motivation of the Civil Rights Movement',
    note: 'The Civil Rights Movement was specifically a movement against Jim Crow: the Montgomery Bus Boycott (1955) targeted bus segregation; sit-ins targeted lunch counter segregation; Freedom Riders targeted interstate transportation segregation; the Voting Rights Act targeted literacy tests and poll taxes. Jim Crow\'s specific legal architecture — separate but equal facilities, systematic disenfranchisement, racial terror enforcement — shaped the movement\'s tactics (nonviolent direct action to expose Jim Crow\'s violence) and its legislative victories (Civil Rights Act 1964, Voting Rights Act 1965). Jim Crow created the conditions requiring the Civil Rights Movement.',
    confidence: 'high' },
  { id: 'jim_crow__voter_suppression_modern',
    source: 'jim_crow', target: 'voter_suppression_modern', type: 'ENABLED',
    label: 'Modern voter suppression revives Jim Crow disenfranchisement tactics through neutral-seeming procedural restrictions that disparately impact Black voters',
    note: 'Modern voter suppression laws revive Jim Crow tactics in legally race-neutral packaging: voter ID laws (Black Americans disproportionately lack required ID), purging voter rolls (purges disproportionately target Black and Latino voters), closing polling places in minority areas, limiting early voting and Sunday voting (Black churches\' "souls to the polls"). The Shelby County v. Holder (2013) Supreme Court decision gutted the Voting Rights Act\'s preclearance requirement — within hours of the decision, states began passing voter suppression legislation. The structural continuity from Jim Crow poll taxes and literacy tests to modern voter ID laws is recognized by civil rights scholars.',
    confidence: 'high' },

  // FDR
  { id: 'franklin_d_roosevelt__new_deal',
    source: 'franklin_d_roosevelt', target: 'new_deal', type: 'PRODUCED',
    label: 'FDR designed and implemented the New Deal as a pragmatic response to the Great Depression\'s political and economic crisis',
    note: 'FDR created the New Deal through three phases of legislation (1933-1938): First New Deal (banking reform, FDIC, farm policy, CCC); Second New Deal (Wagner Act, Social Security, WPA); Third New Deal (Fair Labor Standards Act). FDR\'s approach was pragmatic rather than ideological — he tried things, kept what worked, abandoned what did not. His Brain Trust (economists, academics, lawyers) produced a flood of legislation in the First Hundred Days. FDR\'s political genius was framing New Deal programs as saving capitalism from itself, rather than replacing it — defusing revolutionary pressure while providing economic relief.',
    confidence: 'high' },
  { id: 'franklin_d_roosevelt__world_war_ii',
    source: 'franklin_d_roosevelt', target: 'world_war_ii', type: 'ENABLED',
    label: 'FDR\'s management of US war mobilization was decisive in Allied victory through Lend-Lease, industrial conversion, and alliance-building',
    note: 'FDR\'s WWII leadership shaped the Allied victory: Lend-Lease provided Britain and USSR with materials before US entry; the "Arsenal of Democracy" industrial mobilization converted US manufacturing to war production at unprecedented speed; FDR maintained the Grand Alliance between the US, Britain, and USSR despite deep mutual suspicion; Bretton Woods (1944) and the UN (1945) created the postwar international order FDR envisioned. FDR\'s compromises with Stalin at Yalta (dividing Eastern Europe) and his failure to act on Holocaust information remain historical controversies that complicate his legacy as wartime leader.',
    confidence: 'high' },
  { id: 'great_depression__franklin_d_roosevelt',
    source: 'great_depression', target: 'franklin_d_roosevelt', type: 'PRODUCED',
    label: 'The Great Depression\'s severity made FDR\'s election politically possible and his radical New Deal programs politically necessary',
    note: 'FDR\'s election (1932) and the New Deal were direct political products of the Great Depression: Hoover\'s failure to respond effectively had produced 25% unemployment, mass bank failures, and Hoovervilles; the Depression made the electorate receptive to radical intervention; fear of communist revolution or fascist response (as in Germany) made business elites willing to accept New Deal reforms as the price of stability. The Depression created the political space for institutional transformation that would have been impossible in normal economic conditions. FDR\'s "nothing to fear but fear itself" was also implicitly about the fear of political revolution.',
    confidence: 'high' },
];

// ── History edges ─────────────────────────────────────────────────────────
const newHistEdges = [
  // Red Scare
  { id: 'mccarthyism__red_scare',
    source: 'mccarthyism', target: 'red_scare', type: 'PRODUCED',
    label: 'McCarthyism was the personification of the Red Scare but the Red Scare preceded and outlasted McCarthy himself',
    note: 'McCarthyism and the Red Scare are related but distinct: the Red Scare (Second, 1947-1957) was a broad social and political phenomenon including HUAC, Hollywood blacklists, loyalty oaths, and anti-communist legislation; McCarthy (1950-1954) was a senator who weaponized the existing anti-communist atmosphere for political power. McCarthy gave the Red Scare its most visible and reckless expression but did not create it — he was destroyed (Army-McCarthy hearings, 1954) while the broader Red Scare structures remained. The Red Scare lasted longer and had deeper institutional effects than McCarthy\'s brief prominence.',
    confidence: 'high' },
  { id: 'cold_war__red_scare',
    source: 'cold_war', target: 'red_scare', type: 'PRODUCED',
    label: 'The Cold War\'s ideological competition produced the Red Scare\'s domestic anti-communist purge',
    note: 'The Red Scare was the domestic face of Cold War ideology: the Soviet Union\'s acquisition of nuclear weapons (1949), the Chinese Communist Revolution (1949), and the Korean War (1950) created genuine public fear of communist expansion; HUAC, the FBI, and politicians exploited these fears; actual Soviet espionage (Rosenbergs, Alger Hiss) provided real cases that could be used to justify the broader witch hunt. The Cold War required an internal enemy to mirror the external one — the Red Scare constructed domestic communists as that enemy. The Red Scare\'s effects lasted beyond the Cold War: it destroyed the American left\'s institutional base.',
    confidence: 'high' },
  { id: 'red_scare__cointelpro',
    source: 'red_scare', target: 'cointelpro', type: 'ENABLED',
    label: 'Red Scare institutions (FBI counter-subversion programs) directly evolved into COINTELPRO',
    note: 'COINTELPRO (1956-1971) emerged from Red Scare institutional infrastructure: FBI Director Hoover had built the counter-communist apparatus during the Red Scare; COINTELPRO applied the same techniques (infiltration, disruption, illegal surveillance) to civil rights organizations, the New Left, and Black liberation movements after the formal Red Scare ended. The transition was seamless — for Hoover, communists and civil rights leaders were the same threat. COINTELPRO demonstrated that Red Scare methods outlived their ostensible target: the infrastructure of political repression, once built, was applied to whatever movements threatened the existing order.',
    confidence: 'high' },

  // Robber Barons
  { id: 'robber_barons__labor_movement',
    source: 'robber_barons', target: 'labor_movement', type: 'PRODUCED',
    label: 'Robber baron labor exploitation and violent strike-breaking created the conditions that produced the modern labor movement',
    note: 'The Robber Baron era directly created the organized labor movement: Rockefeller\'s Standard Oil, Carnegie\'s steel mills, and Morgan\'s railroads paid poverty wages, demanded 70-hour weeks, employed child labor, and used Pinkertons and state militias to violently break strikes (Homestead Strike 1892, Pullman Strike 1894). These conditions made organized labor\'s formation an act of economic survival. The AFL (1886) and later the CIO (1935) emerged from workers whose only alternative to collective action was continued exploitation. The violence of the robber baron response to organizing (strike-breaking, blacklisting, murder) demonstrated that labor rights required legal protection, eventually producing the Wagner Act.',
    confidence: 'high' },
  { id: 'robber_barons__progressive_era',
    source: 'robber_barons', target: 'progressive_era', type: 'PRODUCED',
    label: 'Robber baron monopoly power and political corruption produced the Progressive Era\'s regulatory and anti-monopoly response',
    note: 'The Progressive Era (1890s-1920s) was directly produced by Robber Baron excess: Standard Oil\'s monopolistic control of oil refining; J.P. Morgan\'s financial power (he personally stabilized the US banking system in 1907, revealing that one private individual had more economic power than the federal government); railroad price manipulation; corporate political corruption (railroads owned entire state legislatures). Muckraking journalists (Ida Tarbell on Standard Oil, Upton Sinclair on meatpacking) documented these abuses; Progressive politicians (Roosevelt, La Follette, Wilson) built reform coalitions. The regulatory state was built in direct response to Robber Baron power.',
    confidence: 'high' },

  // Great Migration
  { id: 'jim_crow__great_migration',
    source: 'jim_crow', target: 'great_migration', type: 'CAUSED',
    label: 'Jim Crow terror, lynching, and economic exclusion drove African Americans to leave the South in the Great Migration',
    note: 'The Great Migration (1910-1970) was caused by Jim Crow: racial violence (lynching, which peaked in the 1890s and 1900s), sharecropping economic peonage, systematic educational exclusion, and legal disenfranchisement made the South untenable for Black Americans seeking economic opportunity or physical safety. Northern industrial jobs (especially during WWI labor shortages) provided the economic pull; Jim Crow violence and exploitation provided the political push. The Great Migration transformed American cities, politics, and culture — the Harlem Renaissance, Chicago blues, Northern Black political power — but also produced Northern residential segregation and racial conflict as whites resisted Black urban migration.',
    confidence: 'high' },
  { id: 'great_migration__civil_rights_movement',
    source: 'great_migration', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'The Great Migration created the Northern Black political base and economic resources that made the Civil Rights Movement organizationally viable',
    note: 'The Great Migration made the Civil Rights Movement possible: Northern Black communities had voting rights, economic resources, and political connections denied in the South; Northern Black newspapers (Chicago Defender) covered Southern racial violence that Southern papers suppressed; the NAACP built organizational infrastructure in Northern cities; Northern Black voters became crucial in key electoral states, giving the movement political leverage with national Democratic politicians. The Civil Rights Movement\'s Southern campaigns were organizationally and financially supported by Northern Black communities whose political power derived from the Great Migration.',
    confidence: 'high' },

  // Tulsa Race Massacre
  { id: 'jim_crow__tulsa_race_massacre',
    source: 'jim_crow', target: 'tulsa_race_massacre', type: 'PRODUCED',
    label: 'The Tulsa Massacre was Jim Crow racial violence at its most concentrated — the destruction of Black economic success that violated racial hierarchy',
    note: 'The Tulsa Race Massacre (1921) was an extreme expression of Jim Crow racial violence: Greenwood\'s "Black Wall Street" represented Black economic success and independence that violated the racial hierarchy Jim Crow was designed to enforce. The immediate trigger was a disputed incident involving a Black man and white elevator operator; the actual motivation was white rage at Black prosperity and self-sufficiency. The massacre was organized and carried out with police participation; airplanes were used to surveil and possibly fire on Black neighborhoods. The 80-year suppression of the massacre in Oklahoma history demonstrates the relationship between racial violence and historical erasure that is itself a Jim Crow legacy.',
    confidence: 'high' },
  { id: 'tulsa_race_massacre__reparations_debate',
    source: 'tulsa_race_massacre', target: 'reparations_debate', type: 'ENABLED',
    label: 'Tulsa became a focal point of reparations debate because it involves identifiable victims, documented property destruction, and living descendants',
    note: 'The Tulsa Race Massacre is the leading concrete case in reparations debates because it combines features that make the abstract concrete: documented property destruction with calculable value; identified perpetrators and victims; living survivors and their children; government participation making state liability clear; and documented suppression of victims\' prior attempts at compensation. The 2021 centennial renewed national attention during the BLM moment. Greenwood survivors testified to Congress. Oklahoma courts have considered reparations lawsuits. Tulsa demonstrates both the case for reparations and the institutional resistance to them.',
    confidence: 'high' },
];

// ── Mechanism edges ───────────────────────────────────────────────────────
const newMechEdges = [
  // Climate change denial
  { id: 'climate_change_denial__environmental_degradation',
    source: 'climate_change_denial', target: 'environmental_degradation', type: 'ENABLED',
    label: 'Climate denial campaigns delayed policy action that has allowed environmental degradation to accelerate',
    note: 'Climate change denial has directly enabled environmental degradation by blocking policy response: ExxonMobil\'s internal research from the 1970s accurately predicted climate change; their decision to fund denial rather than transition enabled three additional decades of fossil fuel expansion; the deliberate manufacturing of scientific doubt (the "merchants of doubt" strategy modeled on tobacco) prevented policy action during the 1990s and 2000s when mitigation would have been cheaper and more effective. The denial campaign\'s success in preventing carbon pricing or fossil fuel phase-out represents the most consequential example of organized corporate disinformation in history by magnitude of harm.',
    confidence: 'high' },
  { id: 'climate_change_denial__manufactured_consent',
    source: 'climate_change_denial', target: 'manufactured_consent', type: 'ENABLED',
    label: 'Climate denial used manufactured consent techniques — false balance, bought experts, astroturf groups — to create apparent public controversy about settled science',
    note: 'Climate change denial systematically applied manufactured consent techniques: the Global Climate Coalition (fossil fuel industry) paid for scientific-seeming reports contradicting climate consensus; "Junk Science" blogs created appearance of grassroots skepticism; think tanks (Heartland Institute, Cato Institute) received fossil fuel funding to produce policy papers; media "balance" standards gave equal time to bought skeptics and actual climate scientists. The playbook was explicitly borrowed from tobacco: create doubt, not convince of alternative, to prevent policy action. Naomi Oreskes\'s "Merchants of Doubt" documented the same scientists doing tobacco denial and climate denial.',
    confidence: 'high' },
  { id: 'conspiracy_theory_grifters__climate_change_denial',
    source: 'conspiracy_theory_grifters', target: 'climate_change_denial', type: 'SHARES_MECHANISM_WITH',
    label: 'Climate denial and conspiracy grifting share the business model of selling alternative epistemology to institutions threatened by accurate information',
    note: 'Climate denial and conspiracy grifting share structural features: both profit from anti-institutional epistemology; both sell "hidden truth" that official science suppresses; both create community around shared rejection of expertise; both provide economic return to grifters (fossil fuel companies, media personalities, book sellers) while imposing costs on their audiences. The overlap between climate denial and broader conspiracy culture (COVID denial, QAnon) demonstrates how alternative epistemology communities share members and reinforce each other. Climate denial pioneered the institutional infrastructure that COVID denial later used.',
    confidence: 'high' },

  // Moral panic
  { id: 'moral_panic__war_on_drugs',
    source: 'moral_panic', target: 'war_on_drugs', type: 'ENABLED',
    label: 'The War on Drugs was launched and sustained by repeated moral panics about drug use that were systematically exaggerated for political effect',
    note: 'The War on Drugs required moral panics to maintain political support: the crack cocaine panic (1986) produced the 100:1 sentencing disparity that sentenced crack (associated with Black users) to prison terms 100 times longer than powder cocaine (associated with white users) for equivalent amounts; the "crack baby" panic (proved exaggerated) justified draconian sentencing; methamphetamine panics in the 2000s; opioid crisis framing as street crime rather than pharmaceutical industry failure. Each wave of moral panic enabled more punitive legislation. John Ehrlichman (Nixon\'s domestic policy advisor) admitted the War on Drugs was designed to criminalize Black people and antiwar protesters.',
    confidence: 'high' },
  { id: 'moral_panic__satanic_panic',
    source: 'moral_panic', target: 'satanic_panic', type: 'PRODUCED',
    label: 'The Satanic Panic was the classic case study of moral panic dynamics: media amplification producing false mass confession, hysteria, and wrongful convictions',
    note: 'The Satanic Panic (1980s-early 1990s) is the paradigm case of moral panic: McMartin preschool case and dozens of other "ritual abuse" cases were produced entirely by leading interview techniques on children, therapist-induced false memories, and media amplification; hundreds of innocent people were imprisoned; "repressed memory" therapy created false memories of abuse in adults; the Diagnostic and Statistical Manual recognized recovered memory syndrome problems. The Satanic Panic case study demonstrates how moral panic mechanisms — initial accusation, media amplification, authority confirmation, community conformity pressure, investigation bias toward confirmation — produce massive injustice despite lack of evidence.',
    confidence: 'high' },
  { id: 'in_group_out_group__moral_panic',
    source: 'in_group_out_group', target: 'moral_panic', type: 'ENABLED',
    label: 'Moral panics require an out-group ("folk devil") to focus community anxiety; in-group/out-group dynamics determine who becomes the target',
    note: 'Moral panics require a "folk devil" — a stigmatized group onto which community anxiety is projected. Which group becomes the folk devil is determined by existing in-group/out-group structures: racial minorities (crack epidemic), youth subcultures (heavy metal, video games), religious minorities (Satanists), sexual minorities (gay men as AIDS threat, LGBTQ as threat to children). The moral panic literature (Stanley Cohen\'s "Folk Devils and Moral Panics") demonstrates that the chosen folk devil reveals the society\'s existing anxieties and social hierarchies more accurately than it reveals actual threats. The mechanism: in-group anxiety → out-group designation → panic → repression → reinforced hierarchy.',
    confidence: 'high' },

  // Epigenetics
  { id: 'epigenetics__collective_trauma',
    source: 'epigenetics', target: 'collective_trauma', type: 'ENABLED',
    label: 'Epigenetic research provides biological mechanisms for the intergenerational transmission of collective trauma effects',
    note: 'Epigenetic research offers biological explanation for collective trauma transmission: studies of Holocaust survivors\' children show altered cortisol stress response profiles consistent with epigenetic inheritance; research on descendants of famine survivors shows metabolic changes; studies of communities experiencing sustained racial violence show stress biomarkers in subsequent generations. The Rachel Yehuda lab\'s Holocaust epigenetics research is the most cited. These findings suggest collective trauma has biological as well as psychological and social transmission pathways — challenging strict gene/environment separations and providing scientific basis for claims about historical trauma\'s ongoing effects.',
    confidence: 'high' },
  { id: 'epigenetics__adverse_childhood_experiences',
    source: 'epigenetics', target: 'adverse_childhood_experiences', type: 'ENABLED',
    label: 'ACE research and epigenetics converge on the same insight: early environmental experience has lasting biological effects through gene expression changes',
    note: 'ACE research and epigenetics converge: ACE studies document that early childhood trauma (abuse, neglect, household dysfunction) produces lasting health impacts; epigenetic research explains the biological mechanism — early stress produces methylation changes in stress-response genes that alter HPA axis function, cortisol response, and inflammatory pathways. Together they demonstrate that childhood trauma is not simply psychological but has measurable biological effects that persist through gene expression changes. This convergence has therapeutic implications: epigenetic changes are potentially reversible, suggesting that trauma-focused interventions might produce biological as well as psychological healing.',
    confidence: 'high' },
];

// ── Psychology edges ──────────────────────────────────────────────────────
const newPsychEdges = [
  // Radicalization
  { id: 'radicalization__social_media_algorithms',
    source: 'radicalization', target: 'social_media_algorithms', type: 'ENABLED',
    label: 'Social media algorithms accelerate radicalization by systematically serving increasingly extreme content to engaged users',
    note: 'Social media algorithms drive radicalization through engagement optimization: content that produces strong emotional reactions (outrage, fear, disgust) generates more engagement signals; algorithms serving similar but more extreme content to engaged users creates the radicalization pipeline; recommendation systems on YouTube, Facebook, and Twitter have been documented leading users from mainstream political content to increasingly extreme right-wing, white nationalist, and conspiratorial content within multiple sessions. The "YouTube pipeline" to right-wing radicalization was documented by Ribeiro et al. (2019); similar dynamics operate on other platforms. Algorithmic radicalization requires no human recruiter — the platform architecture does the work.',
    confidence: 'high' },
  { id: 'radicalization__conspiracy_theories',
    source: 'radicalization', target: 'conspiracy_theories', type: 'ENABLED',
    label: 'Conspiracy theory belief is both a driver and product of radicalization — it provides the alternative epistemic framework that makes extreme views coherent',
    note: 'Conspiracy theories and radicalization are structurally linked: conspiracy theories provide the alternative epistemic framework that makes extreme ideological positions coherent — if mainstream institutions are corrupt and lying, then extreme responses seem proportionate; conspiracy theory communities provide the social belonging and identity that radicalization requires; shared conspiracy belief creates the in-group boundary that distinguishes radicals from normies. QAnon demonstrated the full dynamic: a specific conspiracy theory that embedded users in a community, provided escalating revelations, and produced real-world violence (January 6) from participants who were primarily radicalized online.',
    confidence: 'high' },
  { id: 'radicalization__incel_culture',
    source: 'radicalization', target: 'incel_culture', type: 'ENABLED',
    label: 'Incel communities are radicalization environments where misogynist grievance escalates to celebration of mass violence',
    note: 'Incel communities demonstrate radicalization dynamics: entry via relatable social failure and loneliness; community validation of individual grievance as systemic ("hypergamy," "Chad/Stacy"); escalating rhetoric from frustration to hatred to celebration of violence against women; "black pill" ideology (nothing can improve their situation) as nihilistic endpoint; multiple mass shootings attributed to incel ideology (Elliot Rodger 2014, Alek Minassian 2018). The radicalization pipeline from "I\'m lonely and can\'t get dates" to "women deserve to die" involves community norm escalation, identity investment in the ideology, and exposure to increasing celebration of violence.',
    confidence: 'high' },

  // MGTOW
  { id: 'mgtow__incel_culture',
    source: 'mgtow', target: 'incel_culture', type: 'SHARES_MECHANISM_WITH',
    label: 'MGTOW and incel culture share the manosphere pipeline of male grievance, anti-feminism, and escalating radicalization',
    note: 'MGTOW and incel communities share structural features while differing in ideology: both center male grievance about gender relations; both promote anti-feminist frameworks; both exist in overlapping online communities (Reddit, forums, YouTube); both share "red pill" language and concepts. The difference: incels believe they cannot get sex/relationships because of women\'s hypergamy; MGTOW choose to separate from women as a response to the same perceived female hypergamy. Both exist on the manosphere radicalization spectrum that can extend to misogynist violence. MGTOW was sometimes a radicalization step before or after incel identification.',
    confidence: 'high' },
  { id: 'mgtow__right_wing_populism',
    source: 'mgtow', target: 'right_wing_populism', type: 'ENABLED',
    label: 'Manosphere politics feed right-wing populism through shared antifeminism, anti-immigration, and anti-establishment grievance',
    note: 'MGTOW and manosphere communities are political recruitment grounds for right-wing populism: shared anti-feminism and traditionalist gender ideology connects to broader right-wing politics; manosphere influencers (Jordan Peterson, Joe Rogan) introduced young men to right-wing political ideas through masculinity content; Trump\'s campaign explicitly targeted the male grievance demographic; Andrew Tate exemplifies the pipeline from manosphere influencer to explicitly political right-wing messaging. The radicalization pipeline: men seek content about dating/masculinity → anti-feminist framing → broader right-wing politics → white nationalism in some cases.',
    confidence: 'high' },

  // Conspiracy theories
  { id: 'conspiracy_theories__broken_epistemology',
    source: 'conspiracy_theories', target: 'broken_epistemology', type: 'ENABLED',
    label: 'Widespread conspiracy theory belief produces broken epistemology at the societal level — shared reality becomes impossible to maintain',
    note: 'Conspiracy theories produce broken epistemology through multiple pathways: they establish unfalsifiability as a feature (any disconfirming evidence is evidence of the conspiracy\'s power); they create parallel information ecosystems with incompatible factual claims; they erode trust in the institutions (media, science, government) that produce shared factual frameworks. When significant portions of the population believe in mutually incompatible realities (election fraud, COVID being fake, vaccine microchips), democratic deliberation and collective problem-solving become impossible. The COVID pandemic demonstrated the life-or-death stakes of broken epistemology — conspiracy beliefs about vaccines and treatments produced hundreds of thousands of preventable deaths.',
    confidence: 'high' },
  { id: 'conspiracy_theories__antisemitism',
    source: 'conspiracy_theories', target: 'antisemitism', type: 'ENABLED',
    label: 'Antisemitic conspiracy theories are the oldest and most persistent conspiracy framework; modern conspiracism regularly reverts to antisemitic tropes',
    note: 'Antisemitism and conspiracy theory are structurally linked: the Protocols of the Elders of Zion (1903) was the first modern conspiracy text, and its narrative (secret Jewish elite controlling governments and finance) has been recycled through every subsequent conspiracy framework: the Illuminati narrative is often antisemitic; QAnon\'s "cabal of Satan-worshipping pedophiles" revived medieval blood libel antisemitism; George Soros conspiracy theories deploy antisemitic "puppetmaster" tropes; "the Great Replacement" conspiracy theory about elite manipulation of immigration is often explicitly antisemitic. Conspiracy theories tend toward antisemitism because their narrative logic (secret powerful elite controlling society) maps onto existing antisemitic tropes.',
    confidence: 'high' },
];

// ── Write files ───────────────────────────────────────────────────────────
let pnAdded=0, hnAdded=0, mnAdded=0, psnAdded=0;
let peAdded=0, heAdded=0, meAdded=0, pseAdded=0;

newPolitNodes.forEach(n => { if (!pnIds.has(n.id)) { pn.push(n); pnIds.add(n.id); pnAdded++; } });
newHistNodes.forEach(n => { if (!hnIds.has(n.id)) { hn.push(n); hnIds.add(n.id); hnAdded++; } });
newMechNodes.forEach(n => { if (!mnIds.has(n.id)) { mn.push(n); mnIds.add(n.id); mnAdded++; } });
newPsychNodes.forEach(n => { if (!psnIds.has(n.id)) { psn.push(n); psnIds.add(n.id); psnAdded++; } });

newPolitEdges.forEach(e => { if (!peIds.has(e.id)) { pe.push(e); peIds.add(e.id); peAdded++; } });
newHistEdges.forEach(e => { if (!heIds.has(e.id)) { he.push(e); heIds.add(e.id); heAdded++; } });
newMechEdges.forEach(e => { if (!meIds.has(e.id)) { me.push(e); meIds.add(e.id); meAdded++; } });
newPsychEdges.forEach(e => { if (!pseIds.has(e.id)) { pse.push(e); pseIds.add(e.id); pseAdded++; } });

fs.writeFileSync(D('data/global/politics/nodes.json'), JSON.stringify(pn, null, 2));
fs.writeFileSync(D('data/global/history/nodes.json'), JSON.stringify(hn, null, 2));
fs.writeFileSync(D('data/mechanisms/nodes.json'), JSON.stringify(mn, null, 2));
fs.writeFileSync(D('data/global/psychology/nodes.json'), JSON.stringify(psn, null, 2));
fs.writeFileSync(D('data/global/politics/edges.json'), JSON.stringify(pe, null, 2));
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(he, null, 2));
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
fs.writeFileSync(D('data/global/psychology/edges.json'), JSON.stringify(pse, null, 2));

console.log('Politics nodes: +'+pnAdded+' -> '+pn.length);
console.log('History nodes: +'+hnAdded+' -> '+hn.length);
console.log('Mechanism nodes: +'+mnAdded+' -> '+mn.length);
console.log('Psychology nodes: +'+psnAdded+' -> '+psn.length);
console.log('Politics edges: +'+peAdded+' -> '+pe.length);
console.log('History edges: +'+heAdded+' -> '+he.length);
console.log('Mechanism edges: +'+meAdded+' -> '+me.length);
console.log('Psychology edges: +'+pseAdded+' -> '+pse.length);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
[...pe,...he,...me,...pse].forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source, '(edge:', e.id+')'); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target, '(edge:', e.id+')'); orphans++; }
});
console.log('Total orphans:', orphans);
