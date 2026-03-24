#!/usr/bin/env node
// add_missing_structural_nodes.js — adds major missing structural nodes
// Focus: WWII, Renaissance, Mongol Empire, Korean War, Roman Republic
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

function addNodes(f, nn) {
  const ex = JSON.parse(fs.readFileSync(f));
  const ids = new Set(ex.map(n => n.id));
  let a = 0;
  for (const n of nn) if (!ids.has(n.id)) { ex.push(n); ids.add(n.id); a++; }
  if (a) fs.writeFileSync(f, JSON.stringify(ex, null, 2));
  console.log(f.split('/').slice(-2).join('/'), 'nodes: +' + a, '→', ex.length);
}

function addEdges(f, ee) {
  const ex = JSON.parse(fs.readFileSync(f));
  const ids = new Set(ex.map(e => e.id));
  let a = 0;
  for (const e of ee) if (!ids.has(e.id)) { ex.push(e); ids.add(e.id); a++; }
  if (a) fs.writeFileSync(f, JSON.stringify(ex, null, 2));
  console.log(f.split('/').slice(-2).join('/'), 'edges: +' + a, '→', ex.length);
}

// ── New history nodes ───────────────────────────────────────────────────────
addNodes(D('data/global/history/nodes.json'), [
  {
    id: 'world_war_ii', label: 'World War II', node_type: 'reference', category: 'event',
    decade: '1930s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/World_War_II',
    summary: 'World War II (1939–1945) killed 70–85 million people — the deadliest conflict in human history — and fundamentally restructured global order: the Holocaust, two atomic bombs on Japan, the defeat of fascism, and the emergence of the United States and Soviet Union as superpowers. Its consequences defined the 20th century: the United Nations, the Cold War, decolonization, the State of Israel, NATO, the Marshall Plan, and the Nuremberg principles. WWII is the pivot event from which most subsequent global history flows.',
    tags: ['holocaust', 'nazi', 'hiroshima', 'nuremburg', 'cold-war', 'decolonization', 'un', 'fascism-defeat']
  },
  {
    id: 'renaissance', label: 'Renaissance', node_type: 'reference', category: 'movement',
    decade: '1400s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Renaissance',
    summary: 'The Renaissance (c. 1350–1600, beginning in Italian city-states) was the cultural and intellectual movement that bridged medieval and modern Europe: recovery of classical Greek and Roman texts, development of humanism (human dignity and capacity as the center of intellectual concern), and transformation of art (perspective, naturalism), science (empiricism), and political thought (Machiavelli). It produced the intellectual preconditions for both the Protestant Reformation and Scientific Revolution. The Renaissance\'s printing press dependency (Gutenberg, 1440) made its ideas irreversible.',
    tags: ['humanism', 'italy', 'art', 'classical-revival', 'printing-press', 'machiavelli', 'da-vinci']
  },
  {
    id: 'mongol_empire', label: 'Mongol Empire', node_type: 'reference', category: 'event',
    decade: '1200s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Mongol_Empire',
    summary: 'The Mongol Empire (1206–1368) under Genghis Khan and successors was the largest contiguous land empire in history, stretching from Korea to Eastern Europe. It destroyed the Abbasid Caliphate (Baghdad, 1258), facilitated the Black Death\'s westward spread along trade routes, and simultaneously enabled unprecedented Eurasian trade (Pax Mongolica). Its destruction of Islamic scholarship centers and Chinese administrative systems represents one of history\'s greatest cultural losses, while the trade networks it maintained accelerated the exchange of technology, disease, and ideas across Eurasia.',
    tags: ['genghis-khan', 'conquests', 'trade', 'black-death', 'abbasid-destruction', 'eurasian-exchange']
  },
  {
    id: 'korean_war', label: 'Korean War', node_type: 'reference', category: 'event',
    decade: '1950s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Korean_War',
    summary: 'The Korean War (1950–53) was the first major hot conflict of the Cold War, killing approximately 3 million people (mostly Korean civilians) and ending in an armistice that left the peninsula divided at the 38th parallel — a division that persists. The war established key Cold War precedents: US military intervention against communist expansion (Truman Doctrine applied), UN collective security action (first use), Chinese military intervention in a regional conflict, and the limitation of nuclear weapons use despite US capability. The "Forgotten War" in Western memory is Korea\'s defining national trauma.',
    tags: ['cold-war', 'truman', 'china', 'un', 'division', 'containment', 'forgotten-war', 'nuclear-deterrence']
  },
  {
    id: 'roman_republic', label: 'Roman Republic', node_type: 'reference', category: 'event',
    decade: '-500s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Roman_Republic',
    summary: 'The Roman Republic (509–27 BCE) developed the constitutional structures — Senate, consuls, tribunes, written law (Twelve Tables), and checks and balances — that directly influenced Western constitutional tradition. Its collapse (through the combination of economic inequality, military professionalization, social war, and charismatic generals — Marius, Sulla, Caesar, Octavian) is the foundational case study in how republics die. The American Founders studied the Roman Republic obsessively; Madison\'s Federalist Papers cite its decline as the primary cautionary precedent.',
    tags: ['senate', 'constitution', 'checks-and-balances', 'julius-caesar', 'democracy-decay', 'law', 'republic']
  },
]);

// ── History scope edges for new nodes ──────────────────────────────────────
addEdges(D('data/global/history/edges.json'), [
  // world_war_ii
  { id: 'world_war_i__world_war_ii',
    source: 'world_war_i', target: 'world_war_ii', type: 'CAUSED',
    label: 'WWI\'s Versailles settlement directly produced the conditions — German humiliation, economic collapse, resentment — that WWII required',
    note: 'The Treaty of Versailles (1919) is the conventional explanation for WWII: Article 231 (War Guilt clause), reparations, territorial losses (Rhineland, Danzig), and Germany\'s exclusion from the League of Nations produced the economic and psychological conditions Hitler exploited. The Weimar Republic was built on a poisoned foundation. This causal chain (WWI → Versailles → Weimar instability → Hitler → WWII) is the historical consensus, though historians debate whether different Versailles terms would have prevented WWII or simply delayed it.',
    confidence: 'high' },
  { id: 'world_war_ii__the_holocaust',
    source: 'world_war_ii', target: 'the_holocaust', type: 'ENABLED',
    label: 'WWII provided the cover of war required for industrialized genocide',
    note: 'The Holocaust was not a consequence of WWII but required it: the war provided cover for genocide operations, enabled the geographical reach into Eastern Europe where most of Europe\'s Jews lived, normalized mass killing, and subordinated civilian protection to wartime exigency. The Final Solution was approved in January 1942 (Wannsee Conference), after Germany had invaded the Soviet Union and occupied Poland. Peace would have constrained genocide options; war made the Holocaust logistically possible.',
    confidence: 'high' },
  { id: 'world_war_ii__atomic_bombing_hiroshima',
    source: 'world_war_ii', target: 'atomic_bombing_hiroshima', type: 'PRODUCED',
    label: 'WWII produced both the Manhattan Project and the strategic-bombing doctrine that justified using atomic weapons against civilians',
    note: 'The atomic bombing was a product of WWII on two levels: instrumentally (the Manhattan Project was a direct war mobilization, funded by the same economic infrastructure that built Sherman tanks) and doctrinally (the strategic bombing of civilians — Dresden, Tokyo, then Hiroshima — was normalized by 1944-45 as an acceptable WWII tactic). The atomic bomb was not a departure from WWII doctrine but its culmination — a more efficient delivery of the same result that 1,000 B-29s had achieved over Tokyo in March 1945.',
    confidence: 'high' },
  { id: 'world_war_ii__nuremberg_trials',
    source: 'world_war_ii', target: 'nuremberg_trials', type: 'PRODUCED',
    label: 'Nuremberg created the legal framework for prosecuting war crimes and crimes against humanity',
    note: 'The Nuremberg trials (1945-46) were made possible and necessary by WWII\'s scale and documentation: the captured Nazi records, the liberated concentration camps, and the Allies\' military victory created both the evidentiary basis and political authority for trial. Nuremberg produced lasting legal innovations: individual criminal liability for state acts, crimes against humanity as an international category, and the principle that following orders does not absolve criminal responsibility. These principles became the basis for subsequent international criminal law.',
    confidence: 'high' },
  { id: 'world_war_ii__founding_of_israel',
    source: 'world_war_ii', target: 'founding_of_israel', type: 'ENABLED',
    label: 'The Holocaust created the political and moral case that overwhelmed British objections to Jewish statehood',
    note: 'The Holocaust\'s destruction of European Jewry transformed the Zionist project from a political aspiration to an urgent moral necessity in international opinion. The displaced persons crisis (250,000+ Jewish survivors in DP camps, 1945-48), the documentation of Nazi genocide, and the political pressure from the United States converted the British Mandate question into a UN partition issue. Without the Holocaust\'s catastrophic demonstration of the consequences of Jewish statelessness, the 1947 UN partition plan would not have achieved the international support it did.',
    confidence: 'high' },
  { id: 'world_war_ii__decolonization_movement',
    source: 'world_war_ii', target: 'decolonization_movement', type: 'ENABLED',
    label: 'WWII fatally undermined European colonial authority by demonstrating European powers\' vulnerability and hypocrisy',
    note: 'WWII accelerated decolonization through two mechanisms: (1) The Japanese defeat of European colonial powers in Asia (British in Singapore, Dutch in Indonesia, French in Indochina) demonstrated that European military dominance was not inherent, creating nationalist confidence and organizational networks; (2) The Atlantic Charter\'s (1941) anti-colonialism rhetoric (self-determination for all peoples) made European colonial authority ideologically incoherent when applied to non-European peoples. The war that proclaimed universal freedom while using colonial troops to fight it created inescapable contradictions.',
    confidence: 'high' },
  { id: 'benito_mussolini__world_war_ii',
    source: 'benito_mussolini', target: 'world_war_ii', type: 'ENABLED',
    label: 'Mussolini\'s alliance with Hitler and Italian military intervention made WWII a multi-front global conflict',
    note: 'Mussolini\'s decision to ally with Hitler (Pact of Steel, 1939) and enter WWII (June 1940) significantly shaped the war\'s geography: the North Africa campaign, the Balkans campaign (which delayed Barbarossa by six weeks, possibly saving Moscow), and the Italian campaign 1943-45. More consequentially, the Italy-Germany-Japan Axis was the political precondition for global war: Mussolini\'s fascism was the template Hitler adapted, and the Axis made WWII structurally different from a German-Allied bilateral conflict.',
    confidence: 'high' },
  { id: 'joseph_stalin__world_war_ii',
    source: 'joseph_stalin', target: 'world_war_ii', type: 'ENABLED',
    label: 'Stalin\'s military leadership and Soviet sacrifice were decisive in defeating Nazi Germany',
    note: 'The Soviet Union bore the greatest burden of WWII: 27 million Soviet deaths, 70% of all German combat casualties on the Eastern Front, and the destruction of the German army at Stalingrad (1942-43) and Kursk (1943). Stalin\'s military leadership — despite the catastrophic 1941 unpreparedness produced by the purges (which eliminated most of the Red Army\'s officer corps) — ultimately achieved the war\'s decisive land victory. The Eastern Front is where WWII was won; the Western Front was the second act.',
    confidence: 'high' },
  { id: 'world_war_ii__cold_war',
    source: 'world_war_ii', target: 'cold_war', type: 'PRODUCED',
    label: 'WWII\'s destruction of European power and US-Soviet wartime alliance collapse produced the bipolar Cold War world',
    note: 'The Cold War was a direct product of WWII: the war destroyed the European great powers (Britain, France, Germany), leaving only the US and USSR as superpowers; the wartime alliance\'s ideological incompatibility (liberal capitalism vs. communist party-state) required resolution; and the nuclear weapons WWII produced made direct superpower conflict existentially catastrophic, producing the Cold War\'s proxy conflict structure. Without WWII\'s specific outcome — US and Soviet forces meeting in Germany — there is no Cold War in its specific form.',
    confidence: 'high' },

  // renaissance
  { id: 'scholasticism__renaissance',
    source: 'scholasticism', target: 'renaissance', type: 'ENABLED',
    label: 'Scholasticism\'s translation and preservation of classical texts created the textual basis Renaissance humanism built on',
    note: 'The Renaissance humanists\' recovery of classical texts depended on scholastic work: it was scholastic translators (William of Moerbeke, Thomas Aquinas) who recovered Aristotle\'s full corpus, and monastic libraries that preserved Latin classics. The Renaissance critique of scholasticism was parasitic on scholasticism\'s own philological preservation work. The chain: Arab scholars preserved Greek texts → Crusaders and traders brought texts to Italy → scholastics translated them → Renaissance humanists used them against scholasticism.',
    confidence: 'high' },
  { id: 'renaissance__scientific_revolution',
    source: 'renaissance', target: 'scientific_revolution', type: 'ENABLED',
    label: 'Renaissance humanism\'s empirical observation, classical recovery, and critique of authority created the Scientific Revolution\'s conditions',
    note: 'The Scientific Revolution grew directly from Renaissance conditions: (1) the recovery of Archimedes, Plato\'s Timaeus, and Hellenistic mathematical astronomy gave scientists alternative frameworks to Aristotle; (2) Renaissance art\'s empirical observation of nature (Leonardo\'s anatomy, Alberti\'s perspective) developed systematic observation as a valued practice; (3) the printing press (Renaissance technology) enabled rapid dissemination of scientific findings. Copernicus, Vesalius, and Galileo are all Renaissance-trained scholars.',
    confidence: 'high' },
  { id: 'renaissance__protestant_reformation',
    source: 'renaissance', target: 'protestant_reformation', type: 'ENABLED',
    label: 'Renaissance biblical humanism (Erasmus) and printing press created the Reformation\'s textual and institutional conditions',
    note: 'Erasmus\'s Greek New Testament (1516) — using Renaissance philological methods to produce a more accurate biblical text — demonstrated that the Vulgate (Jerome\'s Latin translation) contained errors that corrupted Church doctrine. This discovery (the New Testament\'s scholarly destabilization) directly enabled Luther\'s sola scriptura: if the Church\'s doctrinal authority rested on a flawed translation, individual readers with the correct text could challenge it. Renaissance humanism provided the philological method; Gutenberg\'s press provided the distribution.',
    confidence: 'high' },
  { id: 'printing_press__renaissance',
    source: 'printing_press', target: 'renaissance', type: 'ENABLED',
    label: 'Gutenberg\'s press spread Renaissance classical texts and humanist ideas rapidly across Europe',
    note: 'The printing press (Gutenberg, c. 1440) transformed the Renaissance from an Italian elite movement into a pan-European cultural revolution: classical texts that had been manuscript rarities became printable commodities; humanist works (Petrarch, Boccaccio, Erasmus) spread across linguistic boundaries; and the Bible became a text that literate individuals could own. The press\'s speed relative to manuscript copying allowed Renaissance ideas to circulate faster than institutional resistance could contain them. Gutenberg and the Renaissance are inseparable.',
    confidence: 'high' },

  // mongol_empire
  { id: 'mongol_empire__black_death',
    source: 'mongol_empire', target: 'black_death', type: 'ENABLED',
    label: 'The Mongol trade network (Pax Mongolica) facilitated the Black Death\'s rapid spread from Central Asia to Europe',
    note: 'The Black Death (Yersinia pestis) originated in Central Asia and spread along the Silk Road trade routes the Mongol Empire had stabilized and opened. The Mongols\' conquest of China exposed them to plague-endemic rodent populations; the Pax Mongolica trade networks then carried infected traders and fleas rapidly westward. The 1346 siege of Caffa (Crimea) — where Mongols catapulted infected corpses over city walls — is the traditional transmission point to European sailors. Without Mongol trade network connectivity, the Black Death would have spread more slowly.',
    confidence: 'high' },
  { id: 'mongol_empire__ottoman_empire',
    source: 'mongol_empire', target: 'ottoman_empire', type: 'ENABLED',
    label: 'Mongol destruction of competing Turkic and Arab powers created the power vacuum Ottoman expansion filled',
    note: 'The Ottomans rose to power in the context created by Mongol destruction: the Mongols eliminated the Abbasid Caliphate (Baghdad, 1258), destroyed the Seljuk Sultanate (Anatolia), and disrupted the Egyptian Mamluk and Byzantine buffer systems. The small Anatolian Turkic principality that became the Ottoman Empire filled the power vacuum the Mongol whirlwind left. Timur\'s (Tamerlane\'s) 1402 defeat of Bayezid I temporarily interrupted Ottoman expansion, demonstrating the persistence of Mongol successor power.',
    confidence: 'high' },
  { id: 'first_crusade__mongol_empire',
    source: 'first_crusade', target: 'mongol_empire', type: 'SHARES_MECHANISM_WITH',
    label: 'Both generated Eurasian-scale military movements that restructured political and religious geography',
    note: 'The Crusades and the Mongol conquests are the two defining large-scale military movements that restructured medieval Eurasia: the Crusades (1095-1291) attempted to recover the Holy Land for Christianity and produced the Crusader States, while the Mongols (1206-1368) conquered from Korea to Poland, destroying or transforming every political system they touched. Both movements were enabled by specific military innovations (Crusader heavy cavalry; Mongol composite bow and mobility), and both permanently altered the religious and political landscape of the Middle East and Central Asia.',
    confidence: 'medium' },

  // korean_war
  { id: 'atomic_bombing_hiroshima__korean_war',
    source: 'atomic_bombing_hiroshima', target: 'korean_war', type: 'ENABLED',
    label: 'The atomic bomb\'s existence created the nuclear deterrence constraint that made the Korean War a "limited war"',
    note: 'The Korean War was the first major conflict fought in the shadow of nuclear weapons: MacArthur\'s request to use atomic bombs against Chinese forces was denied by Truman, establishing the crucial precedent that nuclear weapons were politically unusable in limited wars. The war\'s limited character — neither side sought total victory — was fundamentally shaped by both sides\' awareness that escalation could lead to nuclear exchange. Korea invented the concept of "limited war" as a constraint on superpower conflict, which became the defining Cold War strategic concept.',
    confidence: 'high' },
  { id: 'korean_war__vietnam_war',
    source: 'korean_war', target: 'vietnam_war', type: 'ENABLED',
    label: 'Korean War established the US containment doctrine and military intervention template that produced Vietnam',
    note: 'The Korean War established the strategic logic that produced Vietnam: (1) Containment doctrine required military resistance to communist expansion anywhere in Asia; (2) the 38th parallel armistice demonstrated that limited war could prevent communist victory; (3) the Domino Theory (if Korea falls, all Southeast Asia falls) applied the same logic to Indochina. The Korean intervention\'s success (preventing North Korean conquest) made the Vietnam intervention seem replicable. Korea was the template; Vietnam was the failed replication.',
    confidence: 'high' },

  // roman_republic
  { id: 'roman_empire__roman_republic',
    source: 'roman_republic', target: 'roman_empire', type: 'PRODUCED',
    label: 'The Roman Republic\'s collapse through civil war and dictatorship produced the Roman Empire',
    note: 'The Roman Empire was the Roman Republic\'s death: Julius Caesar\'s dictatorship (44 BCE), the subsequent civil wars (Caesar → Antony/Octavian → Octavian), and Octavian\'s constitutional settlement as Augustus (27 BCE) transformed the Republic\'s competitive senatorial oligarchy into a monarchical system that preserved Republican forms while concentrating power in the Princeps. The Republic died not by coup but by constitutional manipulation — Augustus maintained the Senate, consuls, and tribal assemblies while controlling military and finance. The American Founders studied this transformation obsessively as the cautionary case.',
    confidence: 'high' },
  { id: 'roman_republic__athenian_democracy',
    source: 'roman_republic', target: 'athenian_democracy', type: 'SHARES_MECHANISM_WITH',
    label: 'Both are ancient democratic experiments that produced the institutional templates Western constitutional tradition built on',
    note: 'Roman Republic and Athenian democracy are the foundational democratic experiments that the modern constitutional tradition inherited: Athens contributed direct democracy, popular assembly, ostracism, and the concept of citizenship; Rome contributed representative institutions (Senate), written law (Twelve Tables), mixed constitution (Polybius), separation of powers between consuls/Senate/assemblies, and the veto. The Founders\' constitutional design is explicitly a hybrid of Roman republican and Greek democratic elements, filtered through Montesquieu\'s analysis of both.',
    confidence: 'high' },
  { id: 'julius_caesar__roman_republic',
    source: 'julius_caesar', target: 'roman_republic', type: 'PRODUCED',
    label: 'Caesar\'s assassination was the failed attempt to preserve the Republic that accelerated its final collapse',
    note: 'Julius Caesar\'s murder (Ides of March, 44 BCE) was the conspirators\' attempt to restore the Republic by eliminating the dictator. It failed: it produced the civil wars (Second Triumvirate vs. Liberators) that destroyed whatever Republic remained. The conspiracy\'s failure is the foundational lesson of republican constitutionalism — you cannot save a republic by assassination; the structural conditions (economic inequality, military professionalization, provincial loyalties) that produced the dictator must be addressed. The Republic was dead before Caesar; his assassination just made the corpse\'s condition undeniable.',
    confidence: 'high' },
]);

// Check julius_caesar exists
const hNodes = JSON.parse(fs.readFileSync(D('data/global/history/nodes.json')));
const hasJulius = hNodes.some(n => n.id === 'julius_caesar');
if (!hasJulius) {
  console.log('NOTE: julius_caesar node not found — adding it');
  hNodes.push({
    id: 'julius_caesar', label: 'Julius Caesar', node_type: 'reference', category: 'person',
    decade: '-40s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Julius_Caesar',
    summary: 'Gaius Julius Caesar (100–44 BCE) conquered Gaul, crossed the Rubicon to trigger civil war, became dictator perpetuo, and was assassinated on the Ides of March. His actions destroyed the Roman Republic and — through the subsequent civil wars — produced the Roman Empire under his adopted son Augustus. Caesar is the paradigm case for how republics die: not through frontal assault on democratic institutions but through charismatic populist leadership exploiting institutional crisis, military personal loyalty, and constitutional manipulation.',
    tags: ['republic-collapse', 'rome', 'assassination', 'populism', 'civil-war', 'dictator', 'gallic-wars']
  });
  fs.writeFileSync(D('data/global/history/nodes.json'), JSON.stringify(hNodes, null, 2));
  console.log('Added julius_caesar, total:', hNodes.length);
}

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
JSON.parse(fs.readFileSync(D('data/global/history/edges.json'))).forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
console.log('Orphans:', orphans);
