#!/usr/bin/env node
// add_mech_zero_edges.js
// Adds cross-scope edges for 6 mechanism nodes that had zero scope connections,
// plus strengthens 4 underconnected mechanism nodes (1 edge → 3-4 edges).
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const exIds = new Set(me.map(e => e.id));

const batch = [
  // ── jewish_moneylending ────────────────────────────────────────────────────
  { id: 'jewish_moneylending__the_holocaust',
    source: 'jewish_moneylending', target: 'the_holocaust', type: 'ENABLED',
    label: 'Centuries of \"Jewish banker\" stereotype was core economic propaganda enabling the Holocaust',
    note: 'The image of the Jewish moneylender — forced on Jews by Christian usury prohibitions — became the central economic antisemitic trope that Nazi propaganda exploited: Der Stürmer cartoons, the \"Jewish financier\" controlling global capital, Mein Kampf\'s economic antisemitism. The stereotype that medieval usury prohibitions created was still killing people in 1942.',
    confidence: 'high' },
  { id: 'jewish_moneylending__martin_luther_antisemitism',
    source: 'jewish_moneylending', target: 'martin_luther_antisemitism', type: 'ENABLED',
    label: 'Luther\'s 1543 antisemitic tracts explicitly attacked Jewish usury and moneylending',
    note: 'Luther\'s \"On the Jews and Their Lies\" (1543) specifically attacked Jewish moneylending as exploitation of Christians — drawing directly on the medieval jewish_moneylending trope. Luther knew his antisemitism: he had originally hoped Jews would convert to his reformed Christianity; when they did not, he turned to the economic and ritual stereotypes available in the medieval tradition. His recommendations (burning synagogues, seizing property) were later cited by Nazi apologists.',
    confidence: 'high' },
  { id: 'jewish_moneylending__jewish_expulsion_spain_1492',
    source: 'jewish_moneylending', target: 'jewish_expulsion_spain_1492', type: 'ENABLED',
    label: 'Economic antisemitism — including moneylender tropes — provided justification for the Spanish expulsion',
    note: 'The Alhambra Decree expelling Jews from Spain (1492) drew on a composite antisemitism including religious (deicide, Talmudic teaching against Christians), racial, and economic (moneylender, tax farmer) charges. The economic dimension — Jews as financial parasites on Christian Spain — was inseparable from the religious. Economic antisemitism and religious antisemitism were the same ideological product in different packaging.',
    confidence: 'high' },

  // ── protocols_of_elders_of_zion ────────────────────────────────────────────
  { id: 'protocols__the_holocaust',
    source: 'protocols_of_elders_of_zion', target: 'the_holocaust', type: 'ENABLED',
    label: 'Hitler cited the Protocols in Mein Kampf; they became foundational Nazi propaganda',
    note: 'Hitler cited the Protocols of the Elders of Zion in Mein Kampf as evidence of Jewish world conspiracy. Despite exposure as a forgery (Philip Graves, The Times, 1921), the Protocols remained central Nazi antisemitic propaganda, distributed in millions of copies, taught in schools, and used to justify genocide as defensive self-preservation against a conspiratorial enemy. The forgery\'s persistence despite debunking demonstrates the irrelevance of evidence to motivated reasoning.',
    confidence: 'high' },
  { id: 'protocols__kristallnacht',
    source: 'protocols_of_elders_of_zion', target: 'kristallnacht', type: 'ENABLED',
    label: 'Conspiracy propaganda framing Jews as existential threat made the Kristallnacht pogrom psychologically possible',
    note: 'The Protocols-fed worldview — Jews as secret plotters, financiers controlling governments, ritual murderers — created the psychological framework in which Kristallnacht (November 9–10, 1938) was framed as defensive retaliation rather than unprovoked aggression. Goebbels\'s justification used the Herschel Grynszpan assassination as proof of Jewish conspiratorial aggression. The prepared audience, already believing conspiracy propaganda, accepted this framing.',
    confidence: 'high' },
  { id: 'protocols__infowars_alternative_media',
    source: 'protocols_of_elders_of_zion', target: 'infowars_alternative_media', type: 'SHARES_MECHANISM_WITH',
    label: 'Both deploy fabricated \"secret elite control\" conspiracy narratives that survive factual debunking',
    note: 'Infowars and the Protocols share the same conspiracy architecture: a hidden elite secretly controlling governments, media, and finance; surface events as planned provocations; and a small group of truth-tellers revealing what the conspirators suppress. The specific villains differ (Lizard People/Globalists/Soros vs. Elders of Zion), but the structural template is identical. Both survive factual debunking because the conspiratorial framework reinterprets refutation as further evidence of suppression.',
    confidence: 'high' },

  // ── usury_prohibition ──────────────────────────────────────────────────────
  { id: 'usury_prohibition__protestant_reformation',
    source: 'usury_prohibition', target: 'protestant_reformation', type: 'ENABLED',
    label: 'Calvin\'s revision of usury prohibition was the Protestant theological basis for capitalist finance',
    note: 'The Protestant Reformation broke the medieval Catholic consensus on usury: Calvin\'s \"De Usuris\" (1545) argued that moderate interest was not sinful — distinguishing productive lending from exploitative usury. This theological revision enabled the Protestant commercial capitalism of 16th-17th century Holland and England. Max Weber\'s Protestant Ethic thesis identifies this shift as structurally causal for capitalist development. The Catholic Church\'s prohibition and the Protestant revision produced two different trajectories for European economic development.',
    confidence: 'high' },
  { id: 'usury_prohibition__council_of_trent',
    source: 'usury_prohibition', target: 'council_of_trent', type: 'ENABLED',
    label: 'Trent reaffirmed usury prohibition, deepening the economic split between Protestant and Catholic Europe',
    note: 'The Council of Trent (1545–63) reaffirmed traditional Catholic teaching on usury — maintaining the prohibition that Protestant reformers had just begun revising. This divergence between Tridentine Catholicism (prohibition) and Calvinist Protestantism (moderated permission) produced different economic environments: Protestant commercial banking (Amsterdam, London) vs. Catholic economic constraints. The usury question was not merely theological — it determined whether commercial capitalism could develop within a religious framework.',
    confidence: 'high' },
  { id: 'usury_prohibition__thomas_aquinas',
    source: 'usury_prohibition', target: 'thomas_aquinas', type: 'ENABLED',
    label: 'Aquinas systematized the usury prohibition in Summa Theologica, making it binding scholastic doctrine',
    note: 'Thomas Aquinas\'s Summa Theologica (1265–74) systematized the usury prohibition using Aristotle\'s argument that money is sterile — it cannot naturally reproduce. Charging for the use of money was thus charging for nothing, which was theft. Aquinas\'s scholastic systematization converted the usury prohibition from a loose ecclesiastical rule into binding theological doctrine, undergirding centuries of Christian economic antisemitism (Jews in moneylending) and shaping European economic history until Calvin\'s revision.',
    confidence: 'high' },

  // ── catholic_clergy_abuse ──────────────────────────────────────────────────
  { id: 'catholic_clergy_abuse__cult_dynamics',
    source: 'catholic_clergy_abuse', target: 'cult_dynamics', type: 'SHARES_MECHANISM_WITH',
    label: 'Clerical abuse cover-ups share the authoritarian-deference structure that protects cult leadership',
    note: 'Catholic clergy abuse cover-ups and cult abuse cover-ups share the same structural mechanism: (1) absolute authority of leadership (priest as alter Christus / cult leader as divine proxy), (2) institutional loyalty over victim protection, (3) shaming/excommunicating accusers, (4) isolation of victims from outside support, and (5) institutional suppression of reports to civil authorities. The priest role — sacred, celibate, authoritative — creates the same power asymmetry that cult leaders exploit.',
    confidence: 'high' },
  { id: 'catholic_clergy_abuse__evangelical_christianity',
    source: 'catholic_clergy_abuse', target: 'evangelical_christianity', type: 'SHARES_MECHANISM_WITH',
    label: 'Evangelical abuse cover-ups follow the same institutional protection pattern as Catholic clergy abuse',
    note: 'The institutional mechanisms protecting abusive clergy are not specific to Catholicism: independent evangelical churches (Willow Creek, Harvest Bible Chapel, Southern Baptist Convention — 700 abuse cases 2000–2019) have shown identical cover-up dynamics. The shared mechanism: male pastoral authority, accountability-free leadership, congregant deference, and institutional reputation protection over victim welfare. The Catholic crisis made the pattern visible; evangelical crises confirmed it was structural, not denominational.',
    confidence: 'high' },
  { id: 'catholic_clergy_abuse__second_vatican_council',
    source: 'catholic_clergy_abuse', target: 'second_vatican_council', type: 'SHARES_MECHANISM_WITH',
    label: 'Vatican II\'s internal reform culture coexisted with systematic abuse cover-up — revealing limits of institutional reform',
    note: 'The Second Vatican Council (1962–65) represented genuine institutional reform — liturgical renewal, ecumenism, lay involvement. That the same institutional Church simultaneously covered up systematic clergy abuse (many cases dating to the 1950s–80s) demonstrates a key limit of top-down institutional reform: it can change theology and liturgy without transforming the power culture that protects clergy from accountability. Vatican II is the test case for whether doctrinal reform changes institutional behavior.',
    confidence: 'medium' },

  // ── blood_libel_myth ───────────────────────────────────────────────────────
  { id: 'blood_libel_myth__the_holocaust',
    source: 'blood_libel_myth', target: 'the_holocaust', type: 'ENABLED',
    label: 'Blood libel mythology provided medieval precedent that persisted into Nazi-era propaganda',
    note: 'Blood libel accusations — Jews murder Christian children for ritual use — originated in 12th-century England (William of Norwich, 1144) and persisted continuously into the Nazi era: Der Stürmer ran blood libel cartoons in the 1930s; Streicher was convicted at Nuremberg partly for this propaganda. The medieval blood libel and the Nazi racial antisemitism are the same tradition in different historical packaging. The Holocaust was not an invention from nothing — it was the endpoint of an 800-year escalation.',
    confidence: 'high' },
  { id: 'blood_libel_myth__first_crusade',
    source: 'blood_libel_myth', target: 'first_crusade', type: 'ENABLED',
    label: 'Crusading fervor combined with ritual murder accusations produced the Rhine Valley massacres of 1096',
    note: 'The First Crusade (1096) produced the first large-scale European pogroms: crusaders massacring Jewish communities in Mainz, Speyer, Worms, and Cologne before reaching the Holy Land. The massacres were fueled by religious fervor, economic grievance (Jewish debt cancellation through murder), and blood libel-adjacent accusations of Jewish ritual hostility to Christians. The First Crusade is thus a turning point in European antisemitism: from legally tolerated minority to existential threat requiring elimination.',
    confidence: 'high' },
  { id: 'blood_libel_myth__jewish_expulsion_spain_1492',
    source: 'blood_libel_myth', target: 'jewish_expulsion_spain_1492', type: 'ENABLED',
    label: 'Spanish Inquisition ritual murder accusations provided justification for expulsion',
    note: 'The Spanish Inquisition used ritual murder accusations — blood libel mythology — as part of the evidentiary basis for charges against Jewish conversos suspected of secretly maintaining Jewish practices. The 1490 \"La Guardia case\" (fabricated ritual murder accusation) was specifically timed before the 1492 Alhambra Decree to create the emotional climate for expulsion. Blood libel mythology thus directly enabled the expulsion through manufactured evidence.',
    confidence: 'high' },

  // ── dunning_kruger_effect ──────────────────────────────────────────────────
  { id: 'dunning_kruger_effect__anti_vaccination_movement',
    source: 'dunning_kruger_effect', target: 'anti_vaccination_movement', type: 'ENABLED',
    label: 'Anti-vaxxers systematically overestimate their ability to evaluate immunological research',
    note: 'Dunning-Kruger dynamics are empirically documented in vaccine hesitancy: studies show that vaccine-hesitant respondents consistently overestimate their knowledge of vaccine science while demonstrating below-average understanding of immunology, statistics, and clinical trial methodology. The pattern is compounded by the availability of simplified online content that creates an illusion of comprehensive understanding. Dunning-Kruger is not just correlated with anti-vaccination belief — it mechanistically explains the confidence gap.',
    confidence: 'high' },
  { id: 'dunning_kruger_effect__incel_community',
    source: 'dunning_kruger_effect', target: 'incel_community', type: 'ENABLED',
    label: 'Incel pseudoscience (\"looksmaxxing\", \"sexual market value\") reflects systematic overconfidence in social analysis',
    note: 'The incel community has developed an elaborate pseudoscientific framework — lookism, \"sexual market value\" calculations, canthal tilt theory, \"hypergamy\" — that its members treat as sophisticated social science. The Dunning-Kruger dynamic: men with limited experience of actual social dynamics develop false certainty about sexual selection mechanisms, reject contradicting empirical evidence, and view evolutionary psychology popularizations as comprehensive theories. The elaborate vocabulary creates the illusion of expertise.',
    confidence: 'high' },
  { id: 'dunning_kruger_effect__self_help_industry',
    source: 'dunning_kruger_effect', target: 'self_help_industry', type: 'ENABLED',
    label: 'The self-help industry exploits Dunning-Kruger: audiences overestimate their self-knowledge; gurus exploit the gap',
    note: 'The self-help industry depends on two Dunning-Kruger dynamics simultaneously: (1) audiences overestimate how much they understand their own psychology and what they need to change, making simplistic frameworks appealing; (2) self-help authors and coaches systematically overestimate the validity of their pop-psychological frameworks. The industry is a Dunning-Kruger perpetual motion machine: confident gurus selling frameworks to confident consumers, neither of whom has the expertise to evaluate the methodology.',
    confidence: 'high' },
  { id: 'dunning_kruger_effect__pua_community',
    source: 'dunning_kruger_effect', target: 'pua_community', type: 'ENABLED',
    label: 'PUA \"game theory\" systematizes male overconfidence about social and sexual dynamics into pseudoscience',
    note: 'The pickup artist community epitomizes Dunning-Kruger in social dynamics: men with limited experience of actual sexual and social relationships develop elaborate theories about \"game,\" \"frame control,\" and \"attraction switches\" — which they treat as empirical social science. The PUA framework creates the illusion of expertise through jargon complexity and selective anecdote while remaining empirically untestable. The confidence produced by the framework often worsens social outcomes by substituting technique for authentic interaction.',
    confidence: 'high' },

  // ── Strengthen underconnected nodes: climate_change_denial ────────────────
  { id: 'climate_change_denial__fox_news',
    source: 'climate_change_denial', target: 'fox_news', type: 'ENABLED',
    label: 'Fox News was the mass media amplification infrastructure for fossil-fuel-funded climate denial',
    note: 'Fox News is the media infrastructure through which fossil-fuel-funded climate denial reached a mass audience. Fox hosts (Tucker Carlson, Sean Hannity) consistently presented climate science as uncertain, climatologists as politically motivated, and climate policy as economic suicide — translating the denial messaging of think tanks (Heritage, Cato) funded by Koch Industries and ExxonMobil into prime-time content consumed by 3-4 million nightly viewers. The Fox-denial relationship is symbiotic: Fox needed ideological content, denial industry needed a media partner.',
    confidence: 'high' },
  { id: 'climate_change_denial__right_wing_populism',
    source: 'climate_change_denial', target: 'right_wing_populism', type: 'ENABLED',
    label: 'Climate denial became a core right-wing populist identity marker, not just an oil industry product',
    note: 'Climate denial is no longer merely an oil-industry lobbying product — it has become a marker of right-wing populist identity, signaling distrust of technocratic elites, globalist institutions (Paris Agreement), and scientific consensus. Trump\'s Paris withdrawal, Bolsonaro\'s Amazon deforestation, Morrison\'s Australian coal defense: climate denial maps onto the global right-wing populist coalition. The mechanism: anti-elite identity politics absorbed corporate-funded denial and transformed it into tribal signaling.',
    confidence: 'high' },

  // ── Strengthen underconnected nodes: political_radicalization ─────────────
  { id: 'political_radicalization__online_radicalization',
    source: 'political_radicalization', target: 'online_radicalization', type: 'ENABLED',
    label: 'Online echo chambers transformed gradual political radicalization into accelerated pipeline radicalization',
    note: 'Pre-internet political radicalization was slow: required physical community, face-to-face indoctrination, geographic density of extremists. Online radicalization created \"pipeline radicalization\" — the YouTube-to-4chan-to-Telegram sequence where a 19-year-old goes from Jordan Peterson to Proud Boys in months. The mechanism: recommendation algorithms serve progressively more extreme content; anonymous communities reinforce commitment; and geographic isolation is eliminated. Online radicalization is political radicalization operating at accelerated speed.',
    confidence: 'high' },
  { id: 'political_radicalization__january_6_attack',
    source: 'political_radicalization', target: 'january_6_attack', type: 'CAUSED',
    label: 'January 6 was the endpoint of the Stop the Steal radicalization pipeline',
    note: 'January 6 was not spontaneous: it was the product of a months-long radicalization pipeline — Stop the Steal rallies, Telegram channels, QAnon content, Proud Boys organizing, and Trump\'s \"fight like hell\" rhetoric — that moved participants from electoral skepticism to believing violent action was necessary and justified. The Senate investigation documented the radicalization timeline: the specific Telegram recruitment messages, rally speakers\' escalation of rhetoric, and participant testimony describing their pathway from Trump supporter to Capitol rioter.',
    confidence: 'high' },

  // ── Strengthen underconnected nodes: social_media_polarization ────────────
  { id: 'attention_economy__social_media_polarization',
    source: 'attention_economy', target: 'social_media_polarization', type: 'PRODUCED',
    label: 'Attention economy incentive structure algorithmically rewards outrage, producing polarization',
    note: 'Social media platforms\' engagement-maximizing algorithms optimize for attention capture — and outrage, fear, and tribal conflict are the most attention-capturing content types. Facebook\'s internal research (2018, leaked 2021) showed that engagement bait and politically outrageous content spread 2-3x farther than neutral content. The platforms\' business model (ad revenue proportional to engagement) created a structural incentive to amplify content that polarizes. Polarization was not a side effect; it was the product of the attention economy design.',
    confidence: 'high' },
  { id: 'social_media_polarization__online_radicalization',
    source: 'social_media_polarization', target: 'online_radicalization', type: 'PRODUCED',
    label: 'Social media polarization creates the hostile out-group framing that radicalization requires',
    note: 'Radicalization requires a dehumanized out-group. Social media polarization provides it: consistent framing of political opponents as existential threats, enemies of democracy, pedophiles, groomers, or communists creates the psychological preconditions for believing violent action against them is justified. The polarization-to-radicalization pathway: extreme out-group hostility → belief that democratic solutions are impossible → belief that extra-legal action is necessary → willingness to commit political violence.',
    confidence: 'high' },

  // ── Strengthen underconnected nodes: confirmation_bias ───────────────────
  { id: 'confirmation_bias__red_pill_community',
    source: 'confirmation_bias', target: 'red_pill_community', type: 'ENABLED',
    label: 'Red pill ideology is a confirmation bias machine: evidence against the worldview is reinterpreted as evidence for it',
    note: 'Red pill ideology is epistemologically self-sealing through confirmation bias: women who reject red-pill men confirm \"female selectivity\"; women who accept them are \"low quality\" confirmation; anything a woman does confirms the preexisting model. This unfalsifiability is a classic confirmation bias structure — the ideology was designed so every observation confirms it. The internet community reinforces this by sharing only confirming anecdotes and dismissing disconfirming ones as staged or exceptional.',
    confidence: 'high' },
  { id: 'confirmation_bias__self_help_industry',
    source: 'confirmation_bias', target: 'self_help_industry', type: 'ENABLED',
    label: 'Self-help consumers\' confirmation bias makes them resistant to evidence that their chosen framework doesn\'t work',
    note: 'Self-help consumers systematically exhibit confirmation bias toward their chosen framework: they remember the times the advice worked, forget the times it didn\'t, and attribute failures to insufficient commitment rather than framework failure. The self-help industry is optimized to exploit this: testimonials (only successes; failures don\'t write testimonials), money-back guarantees that create sunk-cost commitment, and the success-mindset ideology that makes acknowledging failure feel like personal failure rather than system failure.',
    confidence: 'high' },
];

let added = 0;
for (const e of batch) {
  if (!exIds.has(e.id)) {
    me.push(e);
    exIds.add(e.id);
    added++;
  }
}
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
console.log('mechanisms/edges: +' + added + ' → ' + me.length);

// Integrity check
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
me.forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
console.log('Total edges:', me.length, '| Orphans:', orphans);
