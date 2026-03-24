#!/usr/bin/env node
// add_politics_enrichment.js — fixes zero-edge politics nodes and enriches one-edge nodes
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

function addEdges(f, ee) {
  const ex = JSON.parse(fs.readFileSync(f));
  const ids = new Set(ex.map(e => e.id));
  let a = 0;
  for (const e of ee) if (!ids.has(e.id)) { ex.push(e); ids.add(e.id); a++; }
  if (a) fs.writeFileSync(f, JSON.stringify(ex, null, 2));
  console.log(f.split('/').slice(-2).join('/'), 'edges: +' + a, '→', ex.length);
}

addEdges(D('data/global/politics/edges.json'), [
  // ── fossil_fuel_industry: was completely isolated ─────────────────────────
  { id: 'fossil_fuel_industry__citizens_united',
    source: 'fossil_fuel_industry', target: 'citizens_united', type: 'EXPLOITED',
    label: 'Citizens United enabled unlimited fossil fuel industry political spending without disclosure',
    note: 'Citizens United (2010) removed limits on independent political expenditures, immediately exploited by fossil fuel interests: Koch Industries, ExxonMobil, and the American Petroleum Institute dramatically increased PAC spending post-2010. The Koch network alone spent $400 million in 2012 elections. Fossil fuel political spending accelerated climate legislation blockage: the 2009 cap-and-trade bill passed the House but died in the Senate after a fossil-fuel-funded campaign against it. Citizens United was the legal infrastructure that made fossil fuel industry political dominance permanent.',
    confidence: 'high' },
  { id: 'fossil_fuel_industry__military_industrial_complex',
    source: 'fossil_fuel_industry', target: 'military_industrial_complex', type: 'SHARES_MECHANISM_WITH',
    label: 'Both are industries whose revenues depend on continued government investment, creating structural lobbying imperatives',
    note: 'Fossil fuel industry and the military-industrial complex share the same political economy: both depend on government policy (fuel subsidies, military contracts) for profitability, both have captured the regulatory agencies that oversee them, and both have created revolving-door relationships between industry and government that ensure favorable policy. Both also have geographic concentration in specific congressional districts, creating legislators whose career depends on industry survival. The structural similarity explains why both resist reform despite public opposition.',
    confidence: 'high' },
  { id: 'cold_war__fossil_fuel_industry',
    source: 'cold_war', target: 'fossil_fuel_industry', type: 'ENABLED',
    label: 'Cold War geopolitics made Middle East oil dependence central to US foreign policy and fossil fuel industry power',
    note: 'The Cold War created the strategic framework in which Middle East oil became vital to US national security: oil-exporting allies (Saudi Arabia, Kuwait, Iran before 1979) needed protection from Soviet influence; oil supply chain security became military doctrine. This produced the US-Saudi relationship (Quincy Agreement, 1945), the Carter Doctrine (1980, military protection of Persian Gulf oil), and the permanent US military presence that the fossil fuel industry\'s strategic importance justified. The Cold War transformed fossil fuel from commerce to geopolitics.',
    confidence: 'high' },

  // ── tiananmen_square_massacre: was completely isolated ────────────────────
  { id: 'mao_zedong__tiananmen_square_massacre',
    source: 'mao_zedong', target: 'tiananmen_square_massacre', type: 'ENABLED',
    label: 'Mao\'s CCP established the authoritarian precedent and institutional culture the 1989 massacre enforced',
    note: 'The CCP\'s willingness to massacre its own citizens at Tiananmen was not a sudden decision: it reflected institutional culture established under Mao — the use of mass violence (Cultural Revolution, Anti-Rightist Campaign, Great Leap Forward famine) as a tool of political control, the primacy of CCP survival over individual lives, and the framework of class enemies requiring violent suppression. Deng Xiaoping and Li Peng framed the protesters as counterrevolutionaries in explicitly Maoist terms. The massacre was Maoism applied to a new generation of students.',
    confidence: 'high' },
  { id: 'tiananmen_square_massacre__arab_spring',
    source: 'tiananmen_square_massacre', target: 'arab_spring', type: 'SHARES_MECHANISM_WITH',
    label: 'Both are mass pro-democracy uprisings against authoritarian states; contrasting outcomes illustrate state capacity constraints',
    note: 'Tiananmen (1989) and Arab Spring (2010-12) are structurally identical: mass pro-democracy protests organized by young, educated urbanites against entrenched authoritarian regimes, initially successful in occupying public space, ultimately decided by whether the regime would order military crackdown. China cracked down decisively; Tunisia\'s Ben Ali fled; Egypt\'s military removed Mubarak; Syria\'s Assad launched civil war. The contrast illuminates the decisive variable: regime willingness and capacity to use maximum violence. Tiananmen\'s lesson is cited by Arab authoritarian regimes explicitly.',
    confidence: 'high' },

  // ── evangelical_christianity: was completely isolated ─────────────────────
  { id: 'evangelical_christianity__trump_maga',
    source: 'evangelical_christianity', target: 'trump_maga', type: 'ENABLED',
    label: 'White evangelical Christians are Trump\'s largest and most loyal electoral constituency',
    note: 'White evangelicals voted 81% for Trump in 2016 and 76% in 2020 — the largest and most reliable bloc of the MAGA coalition. The alliance is transactional: Trump delivered Supreme Court justices (Gorsuch, Kavanaugh, Barrett) and a strongly anti-abortion policy agenda; evangelicals provided the grassroots mobilization infrastructure. The evangelical-MAGA alliance represents a renegotiation of the 1970s Moral Majority deal: evangelicals traded doctrinal character standards for political power, accepting a thrice-married adulterer as their champion because he delivered their policy priorities.',
    confidence: 'high' },
  { id: 'evangelical_christianity__tea_party_movement',
    source: 'evangelical_christianity', target: 'tea_party_movement', type: 'ENABLED',
    label: 'Evangelical Christians were the Tea Party\'s demographic core and organizational infrastructure',
    note: 'The Tea Party (2009–16) was demographically concentrated in white evangelical Christian communities: surveys showed Tea Party members were disproportionately evangelical Protestant, attending church regularly and holding socially conservative positions. Evangelical networks — megachurches, faith-based radio, homeschool associations — were primary Tea Party organizing infrastructure. The Tea Party\'s anti-Obama rhetoric explicitly fused economic populism with Christian nationalism claims about Obama\'s foreign religion and birth certificate, mobilizing evangelical cultural anxiety as effectively as libertarian fiscal policy.',
    confidence: 'high' },
  { id: 'evangelical_christianity__right_wing_populism',
    source: 'evangelical_christianity', target: 'right_wing_populism', type: 'ENABLED',
    label: 'Evangelical Christianity provided the cultural identity politics and organizational infrastructure for right-wing populism',
    note: 'Right-wing populism in the US is inseparable from evangelical Christianity: the \"forgotten Americans\" framing is primarily about white evangelical cultural displacement (abortion access, gay marriage, school prayer removal). The sense of cultural grievance — Christians being persecuted for their beliefs in their own country — is the emotional fuel of populist politics that economic anxiety alone doesn\'t explain. Internationally, the connection holds: Brazil\'s Bolsonaro drew evangelical support, and the evangelical growth in sub-Saharan Africa and Latin America is generating similar right-wing populist politics.',
    confidence: 'high' },

  // ── One-edge node enrichment ──────────────────────────────────────────────
  { id: 'thomas_hobbes__niccolo_machiavelli',
    source: 'thomas_hobbes', target: 'niccolo_machiavelli', type: 'SHARES_MECHANISM_WITH',
    label: 'Both founded political realism by separating politics from theology and grounding it in human nature',
    note: 'Machiavelli (\"The Prince\", 1513) and Hobbes (\"Leviathan\", 1651) are the two foundational texts of secular political realism: both analyze politics in terms of power rather than virtue, both separate the question of what rulers do from what morality requires, and both ground political analysis in a view of human nature (self-interested, competitive, requiring constraint). Hobbes explicitly built on Machiavelli\'s separation of political science from theology, developing a systematic philosophical basis for what Machiavelli had described empirically. Together they define the political realist tradition that runs through to Morgenthau and Kissinger.',
    confidence: 'high' },
  { id: 'niccolo_machiavelli__thomas_hobbes',
    source: 'niccolo_machiavelli', target: 'thomas_hobbes', type: 'ENABLED',
    label: 'Hobbes read and explicitly built on Machiavelli\'s analysis of political power divorced from theology',
    note: 'Thomas Hobbes cited and engaged Machiavelli extensively: the Leviathan\'s analytical separation of politics from religion, its analysis of sovereignty as requiring monopoly on legitimate violence, and its account of the state of nature (war of all against all) are developments of Machiavellian themes. Hobbes gave Machiavelli\'s empirical observations a systematic philosophical foundation — moving from Machiavelli\'s historical examples to a deductive theory of the state from first principles. The succession: Machiavelli → Hobbes → social contract theory → Enlightenment political philosophy.',
    confidence: 'high' },
  { id: 'benito_mussolini__mao_zedong',
    source: 'benito_mussolini', target: 'mao_zedong', type: 'SHARES_MECHANISM_WITH',
    label: 'Both built 20th-century mass movements by fusing anti-establishment populism with nationalist ideology and paramilitary violence',
    note: 'Mussolini\'s fascism and Mao\'s Communism are structurally similar revolutionary methods despite opposing ideologies: both mobilized mass popular movements through charismatic leadership, both used paramilitary violence (Blackshirts; Red Guards) against opponents, both cultivated a cult of personality, both eliminated independent civil society, and both transformed agricultural economies into mobilized mass states. The Chinese Communist Party explicitly studied Mussolini\'s organizational techniques (via Comintern analysis) as an example of successful mass mobilization even while opposing fascism ideologically.',
    confidence: 'medium' },
  { id: 'frantz_fanon__karl_marx',
    source: 'frantz_fanon', target: 'karl_marx', type: 'ENABLED',
    label: 'Fanon applied Marxist class analysis to colonial racial hierarchy, arguing race replaced class as the primary colonial contradiction',
    note: 'Fanon\'s \"Wretched of the Earth\" (1961) is explicitly Marxist — surplus value, class consciousness, revolutionary violence — applied to the colonial context, where Fanon argued that race, not class, was the primary division of the colonial world: \"The colonized world is a Manichean world.\" The dividing line is not between bourgeois and proletarian but between settler and native. This racial reframing of Marxism was simultaneously an application and a critique: colonialism couldn\'t be explained by class analysis alone, but class analysis provided the structural vocabulary for colonialism.',
    confidence: 'high' },
  { id: 'nelson_mandela__frantz_fanon',
    source: 'nelson_mandela', target: 'frantz_fanon', type: 'ENABLED',
    label: 'Fanon\'s \"Wretched of the Earth\" was required reading for ANC\'s armed struggle phase leadership',
    note: 'Nelson Mandela read Fanon\'s \"Wretched of the Earth\" while organizing Umkhonto we Sizwe (ANC\'s armed wing, founded 1961). Fanon\'s argument that colonized people must use violence to overcome the psychological as well as physical chains of colonialism — that nonviolence maintained the colonizer\'s framework — justified the ANC\'s shift from nonviolent resistance to armed struggle after the Sharpeville massacre (1960). ANC leaders in exile carried Fanon as political philosophy alongside Marx and Lenin. The Mandela who emerged from Robben Island had spent years studying both.',
    confidence: 'high' },
  { id: 'tea_party_movement__citizens_united',
    source: 'tea_party_movement', target: 'citizens_united', type: 'ENABLED',
    label: 'Citizens United enabled the dark-money infrastructure that sustained Tea Party organizing at scale',
    note: 'The Tea Party\'s nationwide organizing (2009–2012) was bankrolled by dark-money infrastructure that Citizens United (January 2010) and its predecessors enabled: Koch-funded Americans for Prosperity, FreedomWorks, and Club for Growth provided the organizational scaffolding, funding, and strategic direction that made grassroots Tea Party meetings possible at scale. The relationship was symbiotic: Koch-funded organizations used the genuine grassroots energy but channeled it toward billionaire-friendly policy priorities (tax cuts, deregulation) rather than populist redistribution.',
    confidence: 'high' },
  { id: 'arab_spring__fall_of_soviet_union',
    source: 'arab_spring', target: 'fall_of_soviet_union', type: 'SHARES_MECHANISM_WITH',
    label: 'Both are rapid cascade collapses of authoritarian systems that appeared stable until they suddenly weren\'t',
    note: 'The Arab Spring (2010-12) and Soviet collapse (1989-91) share the same cascade dynamic: regimes that appeared stable suddenly lost legitimacy among their populations, with collapse spreading rapidly across geographic and political barriers. Both feature: cascading contagion (each collapse inspiring adjacent ones), elite defection as the critical variable (military refusing to shoot protesters), and rapid reversal of apparent stability. Social scientists call this the \"preference falsification\" problem: populations that appeared to support regimes were covertly opposed, revealing their preferences simultaneously when a signal occurred.',
    confidence: 'high' },
  { id: 'meroe__egyptian_pharaoh',
    source: 'meroe', target: 'egyptian_pharaoh', type: 'ENABLED',
    label: 'Meroitic civilization preserved and transmitted Egyptian pharaonic traditions after Upper Egypt\'s decline',
    note: 'The Meroitic period (c. 300 BCE – 350 CE) represents the continuation and transformation of Egyptian pharaonic culture in Nubia after Egypt itself had been conquered by Persians, Greeks, and Romans. Meroitic rulers built pyramids, used Egyptian-style temple architecture, adopted pharaonic coronation rituals, and maintained Egyptian religious iconography — while also developing distinct Meroitic traditions (Meroitic script, lion temples). Meroe was the preservation zone for pharaonic culture at a time when Egypt proper was Hellenized and then Romanized.',
    confidence: 'high' },
]);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
JSON.parse(fs.readFileSync(D('data/global/politics/edges.json'))).forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
console.log('Orphans:', orphans);
