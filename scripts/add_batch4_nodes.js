#!/usr/bin/env node
// add_batch4_nodes.js — United Nations, NATO, Lyndon Johnson (politics);
// League of Nations, Woodrow Wilson (history);
// dog_whistle_politics, gaslighting (mechanisms)
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const mechNodes = JSON.parse(fs.readFileSync(D('data/mechanisms/nodes.json')));
const mechEdges = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const histNodes = JSON.parse(fs.readFileSync(D('data/global/history/nodes.json')));
const histEdges = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const politNodes = JSON.parse(fs.readFileSync(D('data/global/politics/nodes.json')));
const politEdges = JSON.parse(fs.readFileSync(D('data/global/politics/edges.json')));

const mechNodeIds = new Set(mechNodes.map(n=>n.id));
const mechEdgeIds = new Set(mechEdges.map(e=>e.id));
const histIds = new Set(histNodes.map(n=>n.id));
const histEdgeIds = new Set(histEdges.map(e=>e.id));
const politIds = new Set(politNodes.map(n=>n.id));
const politEdgeIds = new Set(politEdges.map(e=>e.id));

// ── New politics nodes ────────────────────────────────────────────────────
const newPolitNodes = [
  { id: 'united_nations',
    label: 'United Nations',
    node_type: 'reference', category: 'policy', decade: '1940s',
    scope: 'global/politics', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/United_Nations',
    summary: 'The United Nations (founded 1945) is the primary international institution for collective security, human rights, and global governance. Built on the failures of the League of Nations, it established the Security Council (with great power veto), the Universal Declaration of Human Rights (1948), the Genocide Convention, and specialized agencies (WHO, UNICEF, UNESCO). The UN\'s fundamental tension — state sovereignty vs. human rights, Security Council veto vs. collective action — has made it more effective at humanitarian work than conflict prevention. It legitimized decolonization, established international human rights law, and created the diplomatic infrastructure of the rules-based international order.',
    tags: ['international','sovereignty','human-rights','security-council','peacekeeping','cold-war','decolonization'] },

  { id: 'nato',
    label: 'NATO',
    node_type: 'reference', category: 'policy', decade: '1940s',
    scope: 'global/politics', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/NATO',
    summary: 'The North Atlantic Treaty Organization (1949) is the US-led military alliance that contained Soviet power in Europe during the Cold War and remains the world\'s most powerful military alliance. Article 5\'s collective defense clause made an attack on any member an attack on all — deterring Soviet conventional military aggression in Europe. NATO\'s expansion after the Cold War (from 16 to 32 members) to include former Soviet satellites was central to Russia\'s justification for the 2022 Ukraine invasion. NATO demonstrates how Cold War institutions outlast their original context and generate new conflicts through their persistence.',
    tags: ['cold-war','military','collective-defense','europe','russia','ukraine','expansion','deterrence'] },

  { id: 'lyndon_johnson',
    label: 'Lyndon B. Johnson',
    node_type: 'reference', category: 'person', decade: '1960s',
    scope: 'global/politics', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Lyndon_B._Johnson',
    summary: 'Lyndon Baines Johnson (president 1963–1969) passed the most significant civil rights legislation since Reconstruction — the Civil Rights Act (1964) and Voting Rights Act (1965) — and built the Great Society welfare state (Medicare, Medicaid, Head Start). He also escalated Vietnam War involvement from 16,000 advisers (1963) to 550,000 troops (1968), using the false Gulf of Tonkin incident as justification. LBJ\'s presidency represents the Democratic Party\'s liberal apex and its simultaneous Vietnam catastrophe: the president who achieved the most progressive domestic agenda also ended the New Deal coalition by alienating the white South with civil rights and the middle class with Vietnam.',
    tags: ['civil-rights','vietnam','great-society','medicare','medicaid','voting-rights','gulf-of-tonkin'] },
];

// ── New history nodes ─────────────────────────────────────────────────────
const newHistNodes = [
  { id: 'woodrow_wilson',
    label: 'Woodrow Wilson',
    node_type: 'reference', category: 'person', decade: '1910s',
    scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Woodrow_Wilson',
    summary: 'Woodrow Wilson (president 1913–1921) shaped the 20th century international order through WWI leadership and the Fourteen Points\' "self-determination" principle, which inspired decolonization movements while being applied exclusively to European peoples. Wilson established the League of Nations framework — then failed to get US Senate ratification, making the US absent from its creation. Wilson also re-segregated the federal government, screened Birth of a Nation at the White House, and reversed Black civil service gains. He represents the progressive era\'s contradictions: internationalist in foreign policy, white supremacist in domestic racial politics.',
    tags: ['wwi','league-of-nations','self-determination','segregation','fourteen-points','versailles','racism'] },

  { id: 'league_of_nations',
    label: 'League of Nations',
    node_type: 'reference', category: 'event', decade: '1910s',
    scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/League_of_Nations',
    summary: 'The League of Nations (1920–1946) was Wilson\'s post-WWI collective security institution — the first attempt at global governance — that failed to prevent WWII. The US Senate\'s rejection left the League without its most powerful intended member; it also excluded Germany and Soviet Russia. The League failed its crucial tests: Japan\'s Manchuria invasion (1931), Italy\'s Ethiopia invasion (1935-36), and German remilitarization (1936) all went unchallenged. Its failure produced the insight that international institutions require binding enforcement mechanisms and great power participation to function — the lesson that shaped the UN\'s stronger (if still limited) design.',
    tags: ['international','wwii-cause','collective-security','wilson','versailles','appeasement','sovereignty'] },
];

// ── New mechanism nodes ───────────────────────────────────────────────────
const newMechNodes = [
  { id: 'dog_whistle_politics',
    label: 'Dog Whistle Politics',
    node_type: 'reference', category: 'mechanism',
    scope: 'global/mechanisms', cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Dog_whistle_(politics)',
    summary: 'Dog whistle politics uses coded language that conveys a specific meaning to a target audience while appearing innocuous to others — allowing politicians to mobilize prejudice while maintaining plausible deniability. Nixon\'s "law and order" (Black crime); Reagan\'s "welfare queen" (Black dependency); "states\' rights" (segregation); "illegal aliens" (Latino criminality); "inner city problems" (Black poverty) all function as racial dog whistles heard by the intended audience while sounding policy-neutral to others. The mechanism allows racial grievance mobilization without explicit racism — enabling political racism while denying it.',
    tags: ['racism','coded-language','politics','nixon','reagan','southern-strategy','deniability','wedge-issues'] },

  { id: 'gaslighting',
    label: 'Gaslighting',
    node_type: 'reference', category: 'mechanism',
    scope: 'global/mechanisms', cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Gaslighting',
    summary: 'Gaslighting is a form of psychological manipulation in which a person or group causes another to question their own perceptions, memories, or sanity. The term originates from the 1944 film Gaslight, in which a husband manipulates his wife into doubting her senses. Applied to political and social contexts, gaslighting includes: denying documented events ("there were very fine people on both sides"); insisting victims are overreacting ("you\'re being too sensitive"); contradicting clear evidence ("alternative facts"); and institutional denial of systemic harm. Gaslighting is the psychological mechanism of manufactured doubt applied to personal and collective experience.',
    tags: ['manipulation','psychology','abuse','narcissism','denial','alternative-facts','trauma','power'] },
];

// ── Politics edges ────────────────────────────────────────────────────────
const newPolitEdges = [
  // united_nations
  { id: 'cold_war__united_nations',
    source: 'cold_war', target: 'united_nations', type: 'ENABLED',
    label: 'Cold War superpower competition paralyzed the UN Security Council, shaping the UN around what the US-Soviet veto permitted',
    note: 'The UN was designed for great power cooperation that the Cold War immediately precluded: US and Soviet Security Council vetoes paralyzed collective security throughout the Cold War, with each superpower blocking actions against its clients. The Korean War was only possible because the Soviet Union was temporarily boycotting the Security Council when North Korea invaded (1950). NATO and the Warsaw Pact were the real Cold War security systems; the UN served primarily through humanitarian agencies and peacekeeping in proxy conflicts where superpowers preferred a neutral face. Cold War competition shaped what the UN could accomplish.',
    confidence: 'high' },
  { id: 'united_nations__neoliberalism',
    source: 'united_nations', target: 'neoliberalism', type: 'ENABLED',
    label: 'UN-affiliated institutions — IMF, World Bank — became vehicles for imposing neoliberal structural adjustment on developing countries',
    note: 'The UN\'s Bretton Woods financial institutions (IMF, World Bank) became neoliberalism\'s primary enforcement mechanism in the developing world: IMF structural adjustment programs (1980s-2000s) required developing countries to privatize state enterprises, cut social spending, liberalize trade, and deregulate financial sectors as conditions for emergency loans. These conditionality requirements systematically imposed neoliberal policies on countries that had no democratic mandate for them. The "Washington Consensus" — neoliberal policy as the universal development recipe — was enforced through World Bank and IMF conditionality on countries with no alternative in debt crisis.',
    confidence: 'high' },
  { id: 'united_nations__zionism',
    source: 'united_nations', target: 'zionism', type: 'ENABLED',
    label: 'UN General Assembly Resolution 181 (1947) partitioned Palestine, directly producing the Israeli state and the Palestinian refugee crisis',
    note: 'The UN\'s Partition Plan (Resolution 181, 1947) was the founding act of both the Israeli state and the Palestinian refugee crisis: dividing Mandatory Palestine into Jewish and Arab states, it was accepted by the Jewish Agency and rejected by Arab states. Israel\'s Declaration of Independence (1948) cited Resolution 181; the subsequent Arab-Israeli War (1948-49) produced the Nakba — 700,000+ Palestinian refugees. The UN bears institutional responsibility for both: it created the state structure that Zionism had sought while failing to protect Palestinian rights. The UN\'s 1947 partition decision is the origin point of one of the world\'s most persistent conflicts.',
    confidence: 'high' },

  // nato
  { id: 'cold_war__nato',
    source: 'cold_war', target: 'nato', type: 'PRODUCED',
    label: 'NATO was the institutional embodiment of Cold War Western containment — collective military deterrence against Soviet conventional superiority',
    note: 'NATO (1949) was produced by the Cold War\'s military logic: the Soviet Union had the largest conventional army in Europe; the Western democracies had demobilized; and Soviet expansion into Eastern Europe (1945-48) demonstrated its willingness to use military dominance. NATO\'s Article 5 collective defense was designed to deter Soviet invasion by making it an attack on the US — triggering nuclear response. The Korean War (1950) transformed NATO from a paper alliance into an actual military organization: Eisenhower became the first Supreme Allied Commander, and US troops were permanently stationed in Europe.',
    confidence: 'high' },
  { id: 'nato__fall_of_soviet_union',
    source: 'nato', target: 'fall_of_soviet_union', type: 'ENABLED',
    label: 'NATO\'s military containment and economic pressure contributed to the military overextension that contributed to Soviet collapse',
    note: 'NATO\'s contribution to Soviet collapse is debated but real: the Reagan military buildup (SDI, Pershing II missiles in Europe) increased Soviet military spending beyond what its economy could sustain; NATO\'s conventional deterrence prevented Soviet conventional military adventurism while forcing nuclear parity spending; and NATO\'s institutional success — demonstrating that democratic alliances could maintain coherence across decades — contrasted with Warsaw Pact coercive unity. Whether NATO "won" the Cold War or the Soviet system\'s internal contradictions were decisive is disputed, but NATO\'s containment prevented the kind of territorial expansion that might have relieved Soviet economic pressure.',
    confidence: 'medium' },

  // lyndon_johnson
  { id: 'lyndon_johnson__vietnam_war',
    source: 'lyndon_johnson', target: 'vietnam_war', type: 'ENABLED',
    label: 'LBJ escalated Vietnam from 16,000 advisers to 550,000 troops using the false Gulf of Tonkin incident as pretext',
    note: 'Lyndon Johnson transformed Vietnam from a limited advisory commitment into a full-scale war: the Gulf of Tonkin Resolution (August 1964), based on a fabricated second attack on US ships, gave Johnson congressional authority for unlimited escalation. By 1968, 550,000 American troops were in Vietnam; 58,000 would ultimately die; US bombing of Vietnam exceeded all WWII bombing combined. Johnson privately doubted Vietnam was winnable but feared being the president who "lost" Vietnam to communism — McCarthyism\'s shadow. The Tet Offensive (1968) destroyed Johnson\'s credibility; he withdrew from the 1968 presidential race. Vietnam was LBJ\'s personal tragedy and the Great Society\'s political death.',
    confidence: 'high' },
  { id: 'civil_rights_movement__lyndon_johnson',
    source: 'civil_rights_movement', target: 'lyndon_johnson', type: 'ENABLED',
    label: 'MLK\'s movement created the political pressure that forced LBJ\'s hand on the Civil Rights Act and Voting Rights Act',
    note: 'The Civil Rights Movement enabled LBJ\'s legislative achievements by creating unmistakable political urgency: the Birmingham campaign\'s images of police dogs and fire hoses, broadcast nationally, created the political space Johnson needed to push the Civil Rights Act through a resistant Congress. King and Johnson had a complex relationship — King needed Johnson\'s political mastery; Johnson needed King\'s movement\'s moral authority. Selma\'s Bloody Sunday (March 1965) and the subsequent "How Long, Not Long" speech gave Johnson the political moment to sign the Voting Rights Act (August 1965). The Civil Rights Act was as much the Movement\'s achievement as Johnson\'s.',
    confidence: 'high' },
  { id: 'lyndon_johnson__right_wing_populism',
    source: 'lyndon_johnson', target: 'right_wing_populism', type: 'ENABLED',
    label: 'LBJ\'s Civil Rights Acts drove white Southern Democrats to the Republican Party, creating the right-wing populist coalition',
    note: 'LBJ\'s signing of the Civil Rights Act reportedly led him to say "We have lost the South for a generation" — it turned out to be longer. The Democratic Party\'s association with Black civil rights triggered the partisan realignment that produced modern right-wing populism: the Solid Democratic South began voting Republican in presidential elections (Goldwater, 1964) and eventually state and local elections (1990s-2000s). Nixon\'s Southern Strategy explicitly exploited this realignment. Reagan\'s welfare queen and "states\' rights" rhetoric continued it. The white working-class populist base of today\'s Republican Party was substantially produced by the political fallout from LBJ\'s civil rights achievements.',
    confidence: 'high' },
];

// ── History edges ─────────────────────────────────────────────────────────
const newHistEdges = [
  // woodrow_wilson
  { id: 'woodrow_wilson__treaty_of_versailles',
    source: 'woodrow_wilson', target: 'treaty_of_versailles', type: 'PRODUCED',
    label: 'Wilson\'s Fourteen Points shaped Versailles in theory but the Allied powers ignored his self-determination principle for non-European peoples',
    note: 'The Treaty of Versailles was simultaneously Wilson\'s greatest achievement (the League of Nations) and failure: Wilson\'s Fourteen Points proposed a non-punitive peace, but Clemenceau\'s France and Lloyd George\'s Britain demanded German punishment — reparations, war guilt clause, territorial losses. Wilson traded these concessions for the League of Nations, believing international law would correct the peace\'s flaws. The US Senate\'s subsequent rejection of the League (Henry Cabot Lodge\'s reservations) destroyed Wilson\'s synthesis. His health collapsed during the ratification fight (stroke, 1919); his wife Edith effectively ran the White House during his incapacitation.',
    confidence: 'high' },
  { id: 'woodrow_wilson__decolonization_movement',
    source: 'woodrow_wilson', target: 'decolonization_movement', type: 'ENABLED',
    label: 'Wilson\'s self-determination principle — intended for European nations — was applied by colonized peoples as justification for independence',
    note: 'Wilson\'s Fourteen Points\' "self-determination" principle was intended for European nationalities (Czechs, Poles, South Slavs) but colonized peoples immediately applied it universally: Ho Chi Minh submitted a petition to the Versailles Conference demanding Vietnamese self-determination; African and Asian delegations at Versailles expected Wilson\'s principle to apply to them; the Korean independence movement (March First Movement, 1919) invoked it explicitly. When Wilson\'s self-determination was applied only to white Europeans while colonized peoples were redistributed between imperial powers, the betrayal radicalized anticolonial movements — including Ho Chi Minh, who moved from Wilsonian petitioner to Leninist revolutionary.',
    confidence: 'high' },
  { id: 'world_war_i__woodrow_wilson',
    source: 'world_war_i', target: 'woodrow_wilson', type: 'PRODUCED',
    label: 'WWI gave Wilson the opportunity to reshape international order on liberal principles — and his failure to do so shaped the 20th century',
    note: 'WWI produced Wilson\'s historical role: his "too proud to fight" neutrality through 1917, then "war to end all wars" idealism, positioned him as the moral arbiter of postwar peace. Wilson\'s moment at Versailles (January-June 1919) — when a US President participated directly in European peace negotiations for the first time — was the high-water mark of American liberal internationalism. His failure (League rejected, health collapsed, Versailles punitive despite Fourteen Points) demonstrates how idealistic foreign policy frameworks encounter the realities of European power politics. Wilson\'s Versailles experience shaped both American isolationism (1920s-30s) and the UN\'s more realistic institutional design.',
    confidence: 'high' },

  // league_of_nations
  { id: 'woodrow_wilson__league_of_nations',
    source: 'woodrow_wilson', target: 'league_of_nations', type: 'PRODUCED',
    label: 'Wilson\'s Fourteen Points created the League of Nations concept — and his failure to achieve US Senate ratification ensured it couldn\'t function',
    note: 'Wilson both created and destroyed the League of Nations: his Fourteen Points (January 1918) established collective security as the postwar framework; his personal negotiation at Versailles inserted the League Covenant into the treaty; and his inability to compromise with Senate Republican reservations — a product of partisan stubbornness and declining health — ensured US non-participation. The League without the US (the world\'s largest economy and potential military) had insufficient economic or military power to enforce collective security decisions. Wilson\'s vision of a liberal international order was correct; his political failure in achieving US participation was the 20th century\'s most consequential missed opportunity.',
    confidence: 'high' },
  { id: 'league_of_nations__united_nations',
    source: 'league_of_nations', target: 'united_nations', type: 'PRODUCED',
    label: 'The UN was deliberately designed to correct League of Nations failures: universal membership, binding enforcement, Security Council with veto',
    note: 'The United Nations was explicitly designed as the League of Nations\' successor, learning from its failures: where the League required unanimous Council decisions, the UN Security Council operated by majority with great power veto — making decisions possible (if vetoed by nuclear powers); where the US was absent from the League, Roosevelt ensured US leadership in founding the UN; where the League had no military enforcement mechanism, the UN Charter created the theoretical basis for collective military action. The UN\'s design reflects the specific lessons of how the League failed — though the Cold War immediately created new failure modes the UN designers hadn\'t anticipated.',
    confidence: 'high' },
  { id: 'league_of_nations__world_war_ii',
    source: 'league_of_nations', target: 'world_war_ii', type: 'ENABLED',
    label: 'The League\'s failure to stop Japanese and Italian aggression (1931-36) taught Hitler that collective security was a paper tiger',
    note: 'The League of Nations\' failures in the 1930s enabled WWII by demonstrating that aggression faced no effective response: Japan invaded Manchuria (1931), the League condemned it but imposed no sanctions — Japan left the League and kept Manchuria; Italy invaded Ethiopia (1935-36), the League imposed limited sanctions that didn\'t include oil — Mussolini completed the conquest. These failures taught Hitler that collective security was rhetoric without enforcement: German remilitarization (1936), annexation of Austria (1938), and seizure of Czechoslovakia (1938-39) each faced only League protests. The League\'s failure of nerve made WWII aggression rational.',
    confidence: 'high' },
];

// ── Mechanism edges ───────────────────────────────────────────────────────
const newMechEdges = [
  // dog_whistle_politics cross-scope
  { id: 'dog_whistle_politics__war_on_drugs',
    source: 'dog_whistle_politics', target: 'war_on_drugs', type: 'ENABLED',
    label: 'Nixon and Reagan\'s War on Drugs language was explicitly designed as racial dog whistle — associating Black people with crime',
    note: 'Nixon aide John Ehrlichman confessed (2016, posthumously published): "The Nixon campaign in 1968...had two enemies: the antiwar left and Black people...We knew we couldn\'t make it illegal to be either against the war or Black, but by getting the public to associate the hippies with marijuana and Blacks with heroin, and then criminalizing both heavily, we could disrupt those communities." Reagan\'s "welfare queen" and "crack epidemic" crime rhetoric repeated this pattern. The War on Drugs was substantially a dog whistle political project — using drug enforcement language to implement racially targeted policing without overtly racist legal language.',
    confidence: 'high' },
  { id: 'dog_whistle_politics__trump_maga',
    source: 'dog_whistle_politics', target: 'trump_maga', type: 'ENABLED',
    label: 'MAGA rhetoric evolved from coded racial dog whistles to increasingly explicit racist language as Trump tested how explicit was permissible',
    note: 'Trump\'s racial politics represent a progression from dog whistle to bullhorn: early coded language ("inner cities," "rapists coming over the border") gradually gave way to more explicit statements as each escalation proved politically survivable. Trump tested the dog whistle logic — that racism could only be politically deployed through code — by moving toward increasingly explicit racial language and finding his coalition held or strengthened. MAGA demonstrates that political dog whistles are calibrated instruments: when the audience has been prepared and the opposition is normalized as the enemy, the code can become more explicit without electoral cost.',
    confidence: 'high' },
  { id: 'dog_whistle_politics__voter_suppression_modern',
    source: 'dog_whistle_politics', target: 'voter_suppression_modern', type: 'ENABLED',
    label: '"Election integrity" and "voter fraud" are dog whistle framings for race-targeted voter suppression',
    note: '"Voter fraud" rhetoric functions as a dog whistle for racial voter suppression: claims of widespread voter fraud are concentrated in jurisdictions with large minority populations (urban counties in swing states); the "election integrity" measures enacted in response (strict voter ID, reduced polling locations, limited drop boxes) disproportionately burden minority voters who vote Democratic. The fraud claims have been tested in 60+ courts and failed; the suppression effects are documented by the Brennan Center. "Voter fraud" serves as the dog whistle justification for measures that would face explicit legal challenge if framed as "we need to reduce Black voter turnout."',
    confidence: 'high' },

  // gaslighting cross-scope
  { id: 'gaslighting__narcissistic_abuse',
    source: 'gaslighting', target: 'narcissistic_abuse', type: 'ENABLED',
    label: 'Gaslighting is the primary psychological weapon of narcissistic abusers — making victims doubt their perception of abuse',
    note: 'Gaslighting is the defining feature of narcissistic abuse: abusers deny, minimize, and distort documented abusive behavior ("that never happened"; "you\'re too sensitive"; "you\'re crazy") until victims doubt their own perceptions and become dependent on the abuser\'s version of reality. This psychological disorientation serves the abuser\'s control: victims who can\'t trust their own memory or perception can\'t assess whether the relationship is abusive. Narcissistic abuse literature identifies gaslighting as the mechanism that converts isolated incidents of abuse into a sustained control dynamic — making the victim complicit in interpreting abuse as love.',
    confidence: 'high' },
  { id: 'gaslighting__trump_maga',
    source: 'gaslighting', target: 'trump_maga', type: 'ENABLED',
    label: 'Trump\'s "alternative facts," election fraud denial, and documented event denial represent gaslighting as political strategy',
    note: 'Trump\'s political communication systematically uses gaslighting: denying documented video evidence ("I never said that"); insisting that clear electoral defeats were victories ("we won"); claiming that widely-witnessed events didn\'t occur (COVID downplaying, Charlottesville "very fine people" denial). Kellyanne Conway\'s "alternative facts" formulation named the strategy. Gaslighting works politically because the constant contradiction of documented reality creates cognitive overload in audiences — exhausting the capacity to fact-check every claim. Trump\'s political strength is partly his willingness to contradict reality so consistently that opponents seem obsessive for tracking it.',
    confidence: 'high' },
  { id: 'gaslighting__manufactured_consent',
    source: 'gaslighting', target: 'manufactured_consent', type: 'SHARES_MECHANISM_WITH',
    label: 'Both gaslighting and manufactured consent operate by controlling what people believe they have perceived and experienced',
    note: 'Gaslighting (individual psychological manipulation) and manufactured consent (mass media manipulation) share the mechanism of controlling perceived reality: gaslighting makes individuals doubt what they experienced; manufactured consent makes populations doubt what they observe. Both work by substituting authoritative narrative for individual perception; both require sustained repetition to overcome the target\'s actual experience; and both produce a psychological state where the target\'s own perception becomes unreliable to them. The political weaponization of gaslighting — "alternative facts" — is manufactured consent at the individual psychological level, using a relationship dynamic to achieve what propaganda achieves at population scale.',
    confidence: 'high' },
  { id: 'gaslighting__historical_revisionism',
    source: 'gaslighting', target: 'historical_revisionism', type: 'SHARES_MECHANISM_WITH',
    label: 'Historical revisionism is collective gaslighting — making societies doubt their documented collective experiences',
    note: 'Historical revisionism operates at the collective level using the same mechanism as individual gaslighting: replacing documented experience with a preferred narrative that serves the reviser\'s interests. The Lost Cause mythology denied the Confederacy was about slavery (contradicted by Confederate declarations explicitly stating it); Holocaust denial denies the best-documented genocide; Japanese textbook revisionism minimized the Nanjing Massacre and "comfort women" system. These are collective gaslighting — making societies doubt what their collective historical record documents. The mechanism works the same way: enough authoritative repetition erodes confidence in documented experience, especially when direct witnesses die.',
    confidence: 'high' },
];

// ── Add all nodes and edges ───────────────────────────────────────────────
let pn=0, hn=0, mn=0, peAdded=0, heAdded=0, meAdded=0;

newPolitNodes.forEach(n => { if (!politIds.has(n.id)) { politNodes.push(n); politIds.add(n.id); pn++; } });
newHistNodes.forEach(n => { if (!histIds.has(n.id)) { histNodes.push(n); histIds.add(n.id); hn++; } });
newMechNodes.forEach(n => { if (!mechNodeIds.has(n.id)) { mechNodes.push(n); mechNodeIds.add(n.id); mn++; } });
newPolitEdges.forEach(e => { if (!politEdgeIds.has(e.id)) { politEdges.push(e); politEdgeIds.add(e.id); peAdded++; } });
newHistEdges.forEach(e => { if (!histEdgeIds.has(e.id)) { histEdges.push(e); histEdgeIds.add(e.id); heAdded++; } });
newMechEdges.forEach(e => { if (!mechEdgeIds.has(e.id)) { mechEdges.push(e); mechEdgeIds.add(e.id); meAdded++; } });

fs.writeFileSync(D('data/global/politics/nodes.json'), JSON.stringify(politNodes, null, 2));
fs.writeFileSync(D('data/global/politics/edges.json'), JSON.stringify(politEdges, null, 2));
fs.writeFileSync(D('data/global/history/nodes.json'), JSON.stringify(histNodes, null, 2));
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(histEdges, null, 2));
fs.writeFileSync(D('data/mechanisms/nodes.json'), JSON.stringify(mechNodes, null, 2));
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(mechEdges, null, 2));

console.log('Politics nodes: +'+pn+' → '+politNodes.length);
console.log('History nodes: +'+hn+' → '+histNodes.length);
console.log('Mechanism nodes: +'+mn+' → '+mechNodes.length);
console.log('Politics edges: +'+peAdded+' → '+politEdges.length);
console.log('History edges: +'+heAdded+' → '+histEdges.length);
console.log('Mechanism edges: +'+meAdded+' → '+mechEdges.length);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
[...politEdges,...histEdges,...mechEdges].forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
console.log('Total orphans:', orphans);
