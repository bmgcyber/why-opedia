#!/usr/bin/env node
// add_new_mechanisms_nodes.js — add fascism, imperialism mechanism nodes + meiji_restoration,
// age_of_exploration history nodes with full edge sets
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const mechNodes = JSON.parse(fs.readFileSync(D('data/mechanisms/nodes.json')));
const mechEdges = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const histNodes = JSON.parse(fs.readFileSync(D('data/global/history/nodes.json')));
const histEdges = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const politEdges = JSON.parse(fs.readFileSync(D('data/global/politics/edges.json')));

const mechNodeIds = new Set(mechNodes.map(n=>n.id));
const mechEdgeIds = new Set(mechEdges.map(e=>e.id));
const histIds = new Set(histNodes.map(n=>n.id));
const histEdgeIds = new Set(histEdges.map(e=>e.id));
const politEdgeIds = new Set(politEdges.map(e=>e.id));

// ── New mechanism nodes ───────────────────────────────────────────────────
const newMechNodes = [
  { id: 'fascism',
    label: 'Fascism',
    node_type: 'reference', category: 'ideology',
    scope: 'global/mechanisms', cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Fascism',
    summary: 'Fascism is a far-right authoritarian ultranationalism characterized by dictatorial power, forcible suppression of opposition, and strong regimentation of society and the economy. It emerged in early 20th century Europe (Mussolini\'s Italy, Nazi Germany, Franco\'s Spain), using manufactured crisis, scapegoating of minorities, and mythologized national identity to achieve totalitarian control. Fascism requires: a charismatic leader who embodies the national will; a defined enemy (internal and external); manufactured emergency justifying suspension of rights; and party-state fusion eliminating independent institutions. Its recurrence across cultures suggests it exploits universal psychological vulnerabilities rather than being historically unique.',
    tags: ['totalitarianism','nationalism','authoritarianism','mussolini','hitler','democracy-failure','ideology'] },

  { id: 'imperialism',
    label: 'Imperialism',
    node_type: 'reference', category: 'ideology',
    scope: 'global/mechanisms', cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Imperialism',
    summary: 'Imperialism is the policy of extending a state\'s power through territorial acquisition, political domination, or economic control of other nations. European imperialism (1500-1960) produced colonial systems that reshaped every continent through resource extraction, forced labor, population displacement, and cultural suppression. Imperialism\'s mechanisms — military conquest, economic dependency, cultural hegemony, and institutional extraction — persist in postcolonial forms (neocolonialism, economic imperialism through IMF conditionality, military basing). Its legacy — underdevelopment, ethnic conflict created by colonial borders, institutional weakness — continues to shape the global South.',
    tags: ['colonialism','empire','extraction','exploitation','race','postcolonialism','dependency'] },
];

// ── New history nodes ─────────────────────────────────────────────────────
const newHistNodes = [
  { id: 'meiji_restoration',
    label: 'Meiji Restoration',
    node_type: 'reference', category: 'event', decade: '1860s',
    scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Meiji_Restoration',
    summary: 'The Meiji Restoration (1868-1912) was Japan\'s transformation from feudal shogunate to modern nation-state — the only non-Western country to successfully industrialize in the 19th century. Within 40 years, Japan built railways, a modern army and navy, universities, a constitution, and heavy industry. It also developed imperial ambitions: defeating China (1895) and Russia (1905), annexing Korea (1910), and eventually joining WWI\'s winners. The Meiji transformation\'s fusion of Western technology with Japanese nationalist ideology — "Western learning, Japanese spirit" — produced the imperial militarism that led to WWII\'s Pacific theater.',
    tags: ['japan','modernization','industrialization','imperialism','korea','china','militarism','wwii'] },

  { id: 'age_of_exploration',
    label: 'Age of Exploration',
    node_type: 'reference', category: 'era', decade: '1490s',
    scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Age_of_Discovery',
    summary: 'The Age of Exploration (c. 1420-1620) was the period of European maritime expansion across the Atlantic, Pacific, and Indian Oceans — producing the first truly global economy and the Columbian Exchange. Portuguese and Spanish navigators established sea routes to Africa, Asia, and the Americas; subsequent Dutch, English, and French expansion created competing colonial empires. The Age of Exploration\'s consequences: the decimation of Indigenous American populations through disease and violence; the transatlantic slave trade; plantation economies; and the foundation of global capitalism. It is the hinge event that made Western European nations the dominant global powers for the next 500 years.',
    tags: ['columbus','colonialism','slave-trade','indigenous','portugal','spain','capitalism','globalization'] },
];

// ── Add nodes ─────────────────────────────────────────────────────────────
let mn=0, hn=0;
newMechNodes.forEach(n => { if (!mechNodeIds.has(n.id)) { mechNodes.push(n); mechNodeIds.add(n.id); mn++; } });
newHistNodes.forEach(n => { if (!histIds.has(n.id)) { histNodes.push(n); histIds.add(n.id); hn++; } });

// ── Mechanism cross-scope edges ───────────────────────────────────────────
const newMechEdges = [
  // fascism
  { id: 'fascism__the_holocaust',
    source: 'fascism', target: 'the_holocaust', type: 'PRODUCED',
    label: 'The Holocaust was the logical culmination of fascist ideology applied without external constraint',
    note: 'Nazi fascism\'s internal logic produced the Holocaust: the ideological framework of racial hierarchy, national purity, and elimination of internal enemies, combined with totalitarian state power and wartime conditions, produced industrialized genocide. Fascism requires a defined enemy to mobilize identity; Nazi fascism identified Jews as the existential enemy; wartime removed the external constraint of international attention. Scholars debate whether the Holocaust was fascism\'s inevitable outcome or a contingent radicalization, but it is uncontested that Nazi ideology required the dehumanization and eliminationist politics of which the Holocaust was the final expression.',
    confidence: 'high' },
  { id: 'fascism__world_war_ii',
    source: 'fascism', target: 'world_war_ii', type: 'PRODUCED',
    label: 'WWII was produced by fascist movements in Germany, Italy, and Japan taking control of modern industrial states',
    note: 'WWII was produced by three fascist/authoritarian nationalist movements controlling powerful industrial states: Nazi Germany\'s Lebensraum ideology required territorial conquest; Italian fascism required Mediterranean empire for national honor; Japanese militarism required East Asian dominance. All three combined industrial military power with authoritarian mobilization of populations willing to sacrifice for national greatness. WWII demonstrates that fascism is not merely ideological — it is operationally committed to aggressive expansion, because the movement\'s domestic legitimacy requires external enemies and military victory.',
    confidence: 'high' },
  { id: 'fascism__benito_mussolini',
    source: 'fascism', target: 'benito_mussolini', type: 'PRODUCED',
    label: 'Mussolini\'s Italy was fascism\'s founding instance — the original model that Hitler, Franco, and subsequent movements copied',
    note: 'Benito Mussolini coined "fascism" and created its original organizational form in Italy (1922-1943): the black-shirted paramilitaries, the cult of violence, the elimination of parliamentary democracy while maintaining the monarchy, the corporate state\'s controlled economy, and the manufactured crisis (communist threat) that justified totalitarian power. Hitler explicitly acknowledged Mussolini as a model; Franco\'s Spain borrowed Falangist elements; Argentina\'s Perón adapted Italian fascism to Latin American conditions. Mussolini\'s Italy was fascism\'s laboratory — demonstrating that democratic institutions could be dismantled from within through legal means combined with paramilitary intimidation.',
    confidence: 'high' },
  { id: 'fascism__adolf_hitler',
    source: 'fascism', target: 'adolf_hitler', type: 'PRODUCED',
    label: 'Hitler synthesized fascist organizational method with German nationalist mythology and radical antisemitism into Nazi totalitarianism',
    note: 'Adolf Hitler adapted Italian fascism to German conditions with two modifications: biological racism elevated to state ideology (Mussolini was initially not antisemitic; Hitler made Jewish elimination central from the beginning); and propaganda techniques systematically theorized (Goebbels\' mass media manipulation). Hitler\'s synthesis produced the most efficient fascist state: total party-state fusion, systematic elimination of all independent institutions, racial hierarchy enforced by state violence, and military aggression as the movement\'s permanent condition. Fascism\'s full potential — for both organizational mobilization and mass murder — was realized under Hitler.',
    confidence: 'high' },
  { id: 'fascism__trump_maga',
    source: 'fascism', target: 'trump_maga', type: 'SHARES_MECHANISM_WITH',
    label: 'Scholars debate whether MAGA constitutes fascism proper or fascism-adjacent authoritarian populism — a crucial definitional question',
    note: 'The scholarly debate over whether Trump/MAGA constitutes fascism (Madeleine Albright, Robert Paxton, Jason Stanley argue yes; others argue it lacks fascism\'s paramilitary violence and ideological coherence) turns on definitional questions about fascism\'s essential features. What\'s uncontested: MAGA shares fascism\'s key mechanisms — charismatic leader claiming to embody popular will; defined internal enemies (immigrants, "radical left," "deep state"); attacks on independent institutions (judiciary, media, election officials); and cultivation of paramilitary-adjacent groups (Proud Boys, Oath Keepers). Whether these constitute fascism or "pre-fascism" (Albright\'s term) is a definitional question with urgent political stakes.',
    confidence: 'medium' },
  { id: 'fascism__nuremberg_laws_1935',
    source: 'fascism', target: 'nuremberg_laws_1935', type: 'PRODUCED',
    label: 'The Nuremberg racial laws translated fascist ideology into legal racial hierarchy — the jurisprudential foundation of the Holocaust',
    note: 'The 1935 Nuremberg Laws (Reich Citizenship Law; Law for Protection of German Blood and German Honor) were fascist ideology translated into positive law: Jews were stripped of citizenship, intermarriage was criminalized, and racial hierarchy was constitutionalized. This legal architecture was the Holocaust\'s administrative prerequisite — it identified, categorized, and progressively excluded Jews from civil society before physical elimination began. The Nuremberg Laws also drew explicitly on American Jim Crow laws and miscegenation statutes as models (though the drafters ultimately found American racial laws less comprehensive than what they wanted to implement). Fascist racial ideology required legal codification to become operationally genocidal.',
    confidence: 'high' },
  { id: 'democratic_backsliding__fascism',
    source: 'democratic_backsliding', target: 'fascism', type: 'PRODUCED',
    label: 'Fascism emerged from democratic systems — Mussolini was legally appointed, Hitler was elected — demonstrating that democratic backsliding produces fascism',
    note: 'Both Mussolini and Hitler came to power through the democratic systems they destroyed: Mussolini was legally appointed Prime Minister (1922) after the March on Rome demonstrated his willingness to use paramilitary force; Hitler was legally appointed Chancellor (1933) through coalition politics. Both then used emergency powers and enabling legislation to eliminate democratic constraints. Fascism is democratic backsliding\'s extreme endpoint: the process of constitutional manipulation, institutional capture, and elimination of independent checks that Levitsky and Ziblatt describe in "How Democracies Die" reaches its terminus in fascism — when democratic forms become empty while totalitarian content is imposed.',
    confidence: 'high' },

  // imperialism
  { id: 'imperialism__atlantic_slave_trade',
    source: 'imperialism', target: 'atlantic_slave_trade', type: 'PRODUCED',
    label: 'The Atlantic slave trade was imperialism\'s labor solution — colonialism\'s plantation economy required enslaved Africans as the only viable workforce',
    note: 'The transatlantic slave trade was a product of imperial economic logic: European colonialism\'s plantation agriculture (sugar, tobacco, cotton) required large quantities of labor that couldn\'t be obtained from Europe (too expensive) or from surviving Indigenous Americans (decimated by disease). African enslaved people were the solution: profitable to acquire through trade with African rulers, legally owned as property, and unable to easily escape in unfamiliar territory. The slave trade\'s scale (12 million+ people transported, 15-20% dying in the Middle Passage) reflects the industrial logic of imperial plantation agriculture. Slavery was not an anomaly of imperial capitalism but its labor system.',
    confidence: 'high' },
  { id: 'imperialism__berlin_conference_1884',
    source: 'imperialism', target: 'berlin_conference_1884', type: 'PRODUCED',
    label: 'The Berlin Conference formalized European imperialism\'s African partition — turning imperial competition into coordinated colonial division',
    note: 'The Berlin Conference (1884-85) was imperialism institutionalized as international law: 14 European powers divided Africa into colonial territories without any African participation, using rivers and longitude lines as borders that ignored ethnic, linguistic, and political realities. The Conference established the principle of "effective occupation" — physical control justifies sovereignty — that legitimized military conquest. It formalized the Scramble for Africa (1880s-1900s) that brought 90% of Africa under European control within 30 years. The Berlin Conference\'s artificial borders created the ethnic conflicts that fueled post-independence African civil wars throughout the 20th century.',
    confidence: 'high' },
  { id: 'imperialism__decolonization_movement',
    source: 'imperialism', target: 'decolonization_movement', type: 'PRODUCED',
    label: 'Decolonization was the direct reaction against imperialism — the decades-long struggle to dismantle colonial systems built over centuries',
    note: 'The decolonization movement (1940s-1970s) was imperialism\'s direct consequence: 80+ new nations emerging from colonial rule in the 30 years following WWII. WWI\'s "self-determination" rhetoric (Wilson\'s 14 Points) had created expectations imperialism couldn\'t satisfy; WWII\'s exposure of European military vulnerability (Japan defeating France and Britain in Asia) demonstrated that colonial powers weren\'t invincible; postwar UN human rights frameworks provided legitimizing language for independence. Decolonization didn\'t end imperialism\'s consequences — neo-colonial economic structures, colonial-era borders, institutional underdevelopment — but formally ended direct political control.',
    confidence: 'high' },
  { id: 'imperialism__apartheid_south_africa',
    source: 'imperialism', target: 'apartheid_south_africa', type: 'PRODUCED',
    label: 'Apartheid South Africa was the explicit institutionalization of imperial racial hierarchy — colonial race theories formalized into constitutional law',
    note: 'Apartheid (1948-1994) was imperialism\'s racial hierarchy codified into law: the racial categories (White, Coloured, Indian, Black), pass laws, Bantustan policy, and separate amenities directly implemented colonial racial ideology from British imperialism (the term "apartheid" is Afrikaans, but the policy extended British colonial racial governance). South Africa demonstrates that imperialism doesn\'t require formal colonial status — its racial and economic structures can be internalized and institutionalized by a self-governing white settler population long after formal imperial control ends.',
    confidence: 'high' },
  { id: 'imperialism__haitian_revolution',
    source: 'imperialism', target: 'haitian_revolution', type: 'ENABLED',
    label: 'The Haitian Revolution was imperialism\'s most successful human resistance — enslaved people defeating the most powerful imperial army',
    note: 'The Haitian Revolution (1791-1804) was the most successful act of imperial resistance in history: enslaved people of a French Caribbean colony defeated Napoleon\'s army — the most powerful military force in Europe — and established an independent Black republic. This directly challenged imperialism\'s racial hierarchy (the ideological claim that African-descended people couldn\'t govern themselves or fight effectively against Europeans) and its labor system (slavery as the economic foundation of colonial plantation agriculture). Imperialism\'s response was immediate: France, the United States, and Britain economically isolated Haiti for decades to prevent the revolution\'s example from spreading.',
    confidence: 'high' },
  { id: 'imperialism__resource_curse',
    source: 'imperialism', target: 'resource_curse', type: 'PRODUCED',
    label: 'Imperialism created the economic structures — monoculture extraction, institutional weakness — that produce the resource curse in postcolonial states',
    note: 'The resource curse (natural resource wealth correlating with poor development outcomes) is substantially a product of imperialism: colonial economies were structured around single-commodity extraction (rubber, cotton, copper, oil) for metropolitan markets, with infrastructure built to move resources out rather than develop internal economies. Institutional frameworks were designed for colonial extraction rather than indigenous governance. When independence came, postcolonial states inherited: monoculture economies vulnerable to commodity price swings; institutions designed for extraction rather than development; and social elites whose interests aligned with continued extraction rather than diversification. The resource curse is colonialism\'s economic afterlife.',
    confidence: 'high' },
];

// ── History edges for new nodes ───────────────────────────────────────────
const newHistEdges = [
  // meiji_restoration
  { id: 'meiji_restoration__hirohito',
    source: 'meiji_restoration', target: 'hirohito', type: 'PRODUCED',
    label: 'The Meiji imperial system — emperor as divine sovereign, nation united around imperial will — made Hirohito\'s WWII role possible',
    note: 'Hirohito was born (1901) into the imperial institution the Meiji Restoration had created: an emperor elevated from feudal figurehead to divine sovereign, the symbolic center of Japanese nationalist identity, and formal commander in chief of the armed forces. The Meiji constitution (1889) gave the emperor formal authority over military affairs that subsequent militarization exploited. Hirohito was a product of the Meiji system — educated within its imperial framework, trained to see himself as both divine and national. His WWII role — enabling Japanese military aggression while maintaining formal constitutional legitimacy — required exactly the ambiguous emperor-sovereignty the Meiji Restoration had constructed.',
    confidence: 'high' },
  { id: 'meiji_restoration__world_war_ii',
    source: 'meiji_restoration', target: 'world_war_ii', type: 'ENABLED',
    label: 'Meiji Japan\'s fusion of Western military technology with ultranationalist Shinto ideology produced the Japanese militarism that drove WWII\'s Pacific theater',
    note: 'The Meiji Restoration\'s contradictions produced Japanese militarism: the "Western learning, Japanese spirit" (wakon yosai) synthesis adopted Western industrial technology while rejecting Western democratic values; created a professional military modeled on Germany and Britain while maintaining the Emperor\'s divine sovereignty; industrialized rapidly while suppressing labor organization and political opposition. By the 1930s, the Meiji system\'s contradictions resolved into ultranationalist militarism — a military-industrial-imperial complex that convinced itself that Japan\'s survival required Pacific dominance. The Pacific War was the Meiji transformation\'s full expression.',
    confidence: 'high' },
  { id: 'meiji_restoration__korean_war',
    source: 'meiji_restoration', target: 'korean_war', type: 'ENABLED',
    label: 'Meiji Japan\'s 1910 annexation of Korea and subsequent 35-year colonial occupation directly produced the divided Korea that became the Korean War',
    note: 'Korea\'s Cold War division and the Korean War (1950-53) trace directly to Meiji Japan\'s imperialism: Japan annexed Korea in 1910 as part of its Meiji-era imperial expansion, administering it as a colony until 1945. Japan\'s WWII defeat left Korea divided at the 38th parallel between US and Soviet occupation zones — each side installing client governments. The Korean War\'s origin is the post-WWII management of Japan\'s colonial legacy. Moreover, Korea served as Japan\'s supply base during the Korean War, enabling Japan\'s economic recovery and beginning its postwar growth miracle. The Korean War is, in part, Meiji imperialism\'s deferred consequence.',
    confidence: 'high' },
  { id: 'decolonization_movement__meiji_restoration',
    source: 'meiji_restoration', target: 'decolonization_movement', type: 'ENABLED',
    label: 'Japan\'s successful non-Western modernization demonstrated that European racial claims about development capacity were false — inspiring Asian and African independence movements',
    note: 'Japan\'s Meiji success — defeating China (1895) and Russia (1905) and joining the Great Powers — was psychologically transformative for colonized peoples: it demonstrated that European claims about inherent racial superiority in industrial and military capacity were false. India\'s Bal Gangadhar Tilak celebrated Japan\'s 1905 victory over Russia; African nationalists cited Japan as proof that non-European peoples could achieve modernity. Later, Japan\'s WWII defeat of British, Dutch, and French colonial forces in Asia — even though Japanese colonialism was brutal — permanently shattered the European military mystique that had sustained colonial authority.',
    confidence: 'high' },

  // age_of_exploration
  { id: 'silk_road__age_of_exploration',
    source: 'silk_road', target: 'age_of_exploration', type: 'ENABLED',
    label: 'Ottoman control of Silk Road routes after 1453 drove European maritime exploration seeking alternative trade routes to Asia',
    note: 'The Age of Exploration was directly motivated by the Silk Road\'s disruption: the Ottoman Empire\'s capture of Constantinople (1453) and control of Levantine trade routes increased the cost and difficulty of European access to Asian goods. Portuguese maritime exploration (Vasco da Gama around Africa, 1498) and Columbus\'s Atlantic crossing (1492) were both attempting to find alternative routes to the Silk Road\'s Asian terminus. The discovery of the Americas was an accident of the search for a western route to China. The Age of Exploration is, in this sense, a consequence of Silk Road geopolitics — European maritime empires rose from the attempt to bypass Ottoman trade control.',
    confidence: 'high' },
  { id: 'age_of_exploration__atlantic_slave_trade',
    source: 'age_of_exploration', target: 'atlantic_slave_trade', type: 'PRODUCED',
    label: 'European exploration of Africa and the Americas created the triangle trade that produced the transatlantic slave trade',
    note: 'The Atlantic slave trade was produced by the Age of Exploration\'s economic logic: Portuguese explorers established African coastal trading posts (1440s) initially for gold; as American plantation agriculture developed (1500s-1600s), enslaved Africans became the labor solution for mines and plantations. The triangle trade — European manufactured goods to Africa, enslaved people to the Americas, colonial commodities back to Europe — was the Age of Exploration\'s economic architecture. Without European maritime capability and colonial plantation agriculture (both products of exploration), the transatlantic slave trade\'s scale — 12 million people over 350 years — would have been impossible.',
    confidence: 'high' },
  { id: 'age_of_exploration__industrial_revolution',
    source: 'age_of_exploration', target: 'industrial_revolution', type: 'ENABLED',
    label: 'Colonial resource extraction from Age of Exploration territories provided the capital and raw materials that funded Britain\'s Industrial Revolution',
    note: 'The Industrial Revolution\'s British origins are inseparable from the Age of Exploration\'s colonial legacy: West Indian sugar profits funded banking institutions (Lloyds, Barclays) that financed industrialization; colonial cotton (from slave plantations in US South and India) supplied the textile factories that industrialization\'s first wave centered on; colonial markets absorbed manufactured output; and colonial commodity profits created the capital accumulation that industrial investment required. Eric Williams\' "Capitalism and Slavery" (1944) argued the slave trade financed British industrialization — a thesis still debated but influential. The Industrial Revolution is the Age of Exploration\'s economic successor.',
    confidence: 'high' },
  { id: 'age_of_exploration__haitian_revolution',
    source: 'age_of_exploration', target: 'haitian_revolution', type: 'PRODUCED',
    label: 'The Haitian Revolution was a direct consequence of the plantation slave economy the Age of Exploration created in Saint-Domingue',
    note: 'The Age of Exploration\'s most radical consequence was the Haitian Revolution: European maritime expansion created Caribbean plantation colonies; plantation agriculture required enslaved labor; Saint-Domingue became the world\'s most profitable plantation colony with the most brutal slave system; and that system produced the revolutionary conditions — 500,000 enslaved people with revolutionary consciousness and military experience — that culminated in the only successful slave revolution in history. The Age of Exploration created the colonial system that the Haitian Revolution destroyed. Columbus\'s 1492 voyage and Haiti\'s 1804 independence are cause and consequence across 312 years.',
    confidence: 'high' },
  { id: 'age_of_exploration__renaissance',
    source: 'age_of_exploration', target: 'renaissance', type: 'SHARES_MECHANISM_WITH',
    label: 'The Age of Exploration and Renaissance were parallel expressions of 15th century European expansion — geographic and intellectual discovery simultaneously',
    note: 'The Age of Exploration and the Italian Renaissance were simultaneous expressions of the same European expansion impulse: geographic exploration displaced the world\'s known limits; humanist scholarship displaced the known intellectual limits. Portuguese maritime exploration (1420s-1500s) and Italian Renaissance humanism (1400s-1520s) shared institutional context — Medici and other merchant banking families funded both; the same patronage networks that funded Botticelli also funded cartographers. The Florentine Amerigo Vespucci\'s accounts (from which "America" derives) circulated in the same humanist scholarly networks that produced Renaissance philosophy. Geographic and intellectual exploration were not separate projects.',
    confidence: 'medium' },
];

// ── Write files ───────────────────────────────────────────────────────────
let mAdded=0, hAdded=0, heAdded=0;
newMechNodes.forEach(n => { if (!mechNodeIds.has(n.id)) { mechNodes.push(n); mechNodeIds.add(n.id); mn++; mAdded++; } });
newHistNodes.forEach(n => { if (!histIds.has(n.id)) { histNodes.push(n); histIds.add(n.id); hn++; hAdded++; } });
newMechEdges.forEach(e => { if (!mechEdgeIds.has(e.id)) { mechEdges.push(e); mechEdgeIds.add(e.id); } });
newHistEdges.forEach(e => { if (!histEdgeIds.has(e.id)) { histEdges.push(e); histEdgeIds.add(e.id); heAdded++; } });

fs.writeFileSync(D('data/mechanisms/nodes.json'), JSON.stringify(mechNodes, null, 2));
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(mechEdges, null, 2));
fs.writeFileSync(D('data/global/history/nodes.json'), JSON.stringify(histNodes, null, 2));
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(histEdges, null, 2));

console.log('Mechanism nodes: +'+mAdded+' → '+mechNodes.length);
console.log('Mechanism edges: +'+newMechEdges.length+' → '+mechEdges.length);
console.log('History nodes: +'+hAdded+' → '+histNodes.length);
console.log('History edges: +'+heAdded+' → '+histEdges.length);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
[...mechEdges,...histEdges].forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
console.log('Total orphans:', orphans);
