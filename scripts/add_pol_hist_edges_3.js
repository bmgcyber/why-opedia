#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const edges = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const existing = new Set(edges.map(e=>e.id));

const batch = [
  // ── Key persons ───────────────────────────────────────────────────────────
  { id: 'democratic_backsliding__richard_nixon',
    source: 'democratic_backsliding', target: 'richard_nixon', type: 'ENABLED',
    label: "Nixon's Watergate is the paradigm case of democratic backsliding through executive abuse",
    note: "Nixon's Watergate — using the CIA, FBI, and IRS to target political enemies, and the cover-up — is the US paradigm case of democratic backsliding through executive abuse. The institutional response (impeachment process, resignation, special prosecutor precedent) temporarily repaired the norm violation but established precedents that subsequent presidents tested.",
    confidence: 'high' },
  { id: 'manufactured_consent__john_kennedy',
    source: 'manufactured_consent', target: 'john_kennedy', type: 'ENABLES',
    label: "Kennedy pioneered the televised presidential image as consent manufacture",
    note: "Kennedy's 1960 televised debate victory over Nixon — Nixon visibly sweating, Kennedy telegenic — marked the ascendancy of image over substance in presidential politics. The manufactured presidential persona became the template for all subsequent political communication. JFK's administration also deployed manufactured consent through strategic media management (Cuban Missile Crisis messaging).",
    confidence: 'high' },
  { id: 'moral_disengagement__hirohito',
    source: 'moral_disengagement', target: 'hirohito', type: 'ENABLED',
    label: "Hirohito's institutional role enabled moral disengagement from imperial atrocities",
    note: "Hirohito's precise degree of responsibility for Japanese war crimes remains debated, but his institutional position — divine emperor who could have stopped the war earlier and did not — exemplifies moral disengagement through role diffusion. The emperor-as-god structure distributed moral responsibility so thoroughly that no single actor felt accountable for the Rape of Nanjing or Unit 731.",
    confidence: 'medium' },
  { id: 'cultural_hegemony__alexander_the_great',
    source: 'cultural_hegemony', target: 'alexander_the_great', type: 'ENABLED',
    label: "Alexander's conquests produced Hellenistic cultural hegemony across three continents",
    note: "Alexander's empire was primarily a cultural hegemony project: the deliberate imposition of Greek language, art, philosophy, and civic institutions across Egypt, Persia, and Central Asia. The polis (Greek city-state) as the model of civilized governance spread through military force and cultural prestige. Hellenistic cultural hegemony outlasted the empire by centuries.",
    confidence: 'high' },
  { id: 'cultural_hegemony__roman_empire',
    source: 'cultural_hegemony', target: 'roman_empire', type: 'ENABLED',
    label: "Rome transformed military conquest into cultural hegemony through Romanization",
    note: "Rome's longevity rested on cultural hegemony: provincials desired Roman citizenship, adopted Latin, built Roman infrastructure, and internalized Roman law as the standard of civilization. The transition from military conquest to cultural assimilation — 'Latin on the tongue and Rome in the heart' — is the template for all subsequent imperial cultural hegemony strategies.",
    confidence: 'high' },
  { id: 'in_group_out_group_dynamics__roman_empire',
    source: 'in_group_out_group_dynamics', target: 'roman_empire', type: 'ENABLES',
    label: "Rome's citizenship extension gradually collapsed provincial in-group/out-group boundaries",
    note: "Rome's gradual extension of citizenship — from the city to allies to all free men in the empire (212 CE Caracalla edict) — was a systematic collapse of in-group/out-group boundaries through legal assimilation. The mechanism worked: provincials who gained citizenship became Romans psychologically, defending the empire against external out-groups.",
    confidence: 'high' },
  // ── Confucius and Laozi ───────────────────────────────────────────────────
  { id: 'confucian_social_order__confucius',
    source: 'confucian_social_order', target: 'confucius', type: 'ENABLED',
    label: "Confucius established the social order philosophy bearing his name",
    note: "Confucius (551-479 BCE) systematized the ritual practices (li), filial piety (xiao), and hierarchical social relationships (five relationships) that define Confucian social order. His compilation of the Odes and History and his teaching method (the Analects) established the educational tradition that shaped Chinese civilization for two millennia.",
    confidence: 'high' },
  { id: 'wu_wei__laozi',
    source: 'wu_wei', target: 'laozi', type: 'ENABLED',
    label: "Laozi founded the philosophy of wu wei (non-action) as governance principle",
    note: "Laozi's Tao Te Ching (c. 6th century BCE) articulates wu wei — non-forceful action aligned with the natural way (Tao) — as both personal ethics and governance principle. The sage ruler who leads through non-interference is the political application of wu wei. The Taoist critique of Confucian activist governance runs through Chinese political philosophy.",
    confidence: 'high' },
  // ── Ancient Middle East ───────────────────────────────────────────────────
  { id: 'collective_trauma__second_temple_period',
    source: 'collective_trauma', target: 'second_temple_period', type: 'ENABLED',
    label: "The Second Temple period was defined by the collective trauma of Babylonian exile",
    note: "The Second Temple period (538 BCE - 70 CE) was shaped by the collective trauma of the Babylonian exile: the loss of the Temple, monarchy, and land produced the religious innovations (Torah codification, synagogue, monotheism hardening) that constitute Second Temple Judaism. Collective trauma as creative religious transformation.",
    confidence: 'high' },
  { id: 'jewish_diaspora__second_temple_period',
    source: 'jewish_diaspora', target: 'second_temple_period', type: 'PRODUCED',
    label: "Second Temple period established the diaspora communities preceding the final dispersion",
    note: "The Second Temple period produced the first large-scale diaspora communities (Alexandria, Babylonia, Rome) that preceded and outlasted the Temple's destruction. The Jewish diaspora community infrastructure — synagogues, Torah interpretation, communal organization — was established during the Second Temple period and enabled survival after 70 CE.",
    confidence: 'high' },
  // ── Islamic world ─────────────────────────────────────────────────────────
  { id: 'cultural_hegemony__arab_conquests',
    source: 'cultural_hegemony', target: 'arab_conquests', type: 'ENABLED',
    label: "Arab conquests spread Islamic cultural hegemony more durably than military control",
    note: "The 7th-century Arab conquests established a cultural hegemony that far outlasted the initial military expansion: Arabic became the lingua franca of religion, science, and commerce across the Middle East and North Africa; Islam became the dominant religious identity; and Islamic law structured social relations for centuries after individual dynasties fell.",
    confidence: 'high' },
  { id: 'oil_geopolitics__suez_crisis_1956',
    source: 'oil_geopolitics', target: 'suez_crisis_1956', type: 'ENABLED',
    label: "The Suez Crisis established oil infrastructure control as the central Middle East geopolitical issue",
    note: "The Suez Crisis (1956) made explicit that control of oil infrastructure — the canal through which Middle Eastern oil transited — was the central issue in Western relations with Arab states. Eisenhower's forcing of Anglo-French withdrawal confirmed US dominance of Middle East oil geopolitics and replaced British imperial power with American hegemony.",
    confidence: 'high' },
  { id: 'in_group_out_group_dynamics__arab_israeli_war_1948',
    source: 'in_group_out_group_dynamics', target: 'arab_israeli_war_1948', type: 'CAUSED',
    label: "The 1948 war created the Palestinian refugee in-group/out-group trauma at the conflict's core",
    note: "The 1948 war created the Nakba (Palestinian catastrophe) — 700,000 Palestinian refugees — and established the foundational in-group/out-group binary: Israeli state/Palestinian statelessness, Israeli sovereignty/Palestinian dispossession. Both communities' current identities are structured around this originating in-group/out-group configuration.",
    confidence: 'high' },
  { id: 'collective_trauma__arab_israeli_war_1948',
    source: 'collective_trauma', target: 'arab_israeli_war_1948', type: 'CAUSED',
    label: "The 1948 war created foundational collective traumas on both sides",
    note: "The 1948 war created two simultaneous collective traumas: Israeli memory of existential threat from Arab armies (reinforcing Holocaust trauma) and Palestinian Nakba (catastrophe) memory of dispossession and refugee camps. Both collective traumas are continuously transmitted, politically activated, and form the psychological infrastructure of the ongoing conflict.",
    confidence: 'high' },
  { id: 'in_group_out_group_dynamics__great_schism_1054',
    source: 'in_group_out_group_dynamics', target: 'great_schism_1054', type: 'CAUSED',
    label: "The Great Schism created the Eastern/Western Christian in-group/out-group division",
    note: "The 1054 Great Schism (mutual excommunications of Rome and Constantinople) formalized the Eastern/Western Christian in-group/out-group division. The doctrinal differences (filioque, papal authority) were entangled with cultural and political differences. The split produced: the Crusader sack of Constantinople (1204) — Christian armies destroying the Christian East.",
    confidence: 'high' },
  // ── Ottoman Empire ────────────────────────────────────────────────────────
  { id: 'structural_violence__ottoman_empire',
    source: 'structural_violence', target: 'ottoman_empire', type: 'ENABLES',
    label: "The Ottoman millet system produced structural violence through confessional hierarchy",
    note: "The Ottoman millet system — semi-autonomous religious communities with different rights and tax obligations — produced structural violence through differential treatment embedded in legal structures. Non-Muslim communities had protected but subordinated status; Christians and Jews paid the jizya (poll tax) and faced occupational restrictions. The system was relatively tolerant by contemporary standards and structurally unequal simultaneously.",
    confidence: 'high' },
  // ── Syrian Civil War ──────────────────────────────────────────────────────
  { id: 'structural_violence__syrian_civil_war',
    source: 'structural_violence', target: 'syrian_civil_war', type: 'ENABLED',
    label: "The Syrian Civil War erupted from structural violence accumulated under Ba'athist rule",
    note: "The Syrian Civil War (2011-present) erupted from structural violence accumulated under the Assad dynasty: resource extraction from rural areas to benefit the regime's Alawite-dominated security state, drought-induced displacement without government response, and systematic torture and disappearance as governance tools. The 2011 protests were met with structural violence that transformed them into armed conflict.",
    confidence: 'high' },
  { id: 'oil_geopolitics__gulf_war_1990',
    source: 'oil_geopolitics', target: 'gulf_war_1990', type: 'CAUSED',
    label: "The Gulf War was explicitly a war about oil infrastructure and regional geopolitics",
    note: "The Gulf War (1990-91) was oil geopolitics made explicit: Iraq's invasion of Kuwait threatened Saudi oil fields and the regional order guaranteeing Western energy access. Bush's 'draw a line in the sand' and the 34-nation coalition were mobilized around the oil infrastructure logic that structures all US Middle East policy. Cheney's 'defend Saudi Arabia' briefing used explicitly oil-geopolitical language.",
    confidence: 'high' },
  // ── Pericles and Athens ───────────────────────────────────────────────────
  { id: 'in_group_out_group_dynamics__pericles',
    source: 'in_group_out_group_dynamics', target: 'pericles', type: 'ENABLED',
    label: "Pericles tightened citizenship laws, defining the Athenian in-group more exclusively",
    note: "In 451 BCE, Pericles passed a citizenship law requiring both parents to be Athenian citizens — tightening the in-group boundary at the peak of Athenian power. The law was both a response to demographic anxiety (too many foreigners claiming citizenship rights) and a mechanism for excluding the children of Athenian men and foreign women from political participation.",
    confidence: 'high' },
  // ── JFK assassination / Cold War ─────────────────────────────────────────
  { id: 'democratic_backsliding__john_kennedy',
    source: 'democratic_backsliding', target: 'john_kennedy', type: 'ENABLED',
    label: "Kennedy's authorization of the Bay of Pigs and assassination plotting exemplifies executive overreach",
    note: "Kennedy authorized the CIA's Bay of Pigs invasion (violating Cuban sovereignty), assassination plots against Castro (revealed by Church Committee), and covert operations throughout Latin America — democratic backsliding through executive-branch covert action that circumvents constitutional oversight. The Bay of Pigs failure was partly a result of the CIA's manufactured intelligence (institutional credibility laundering).",
    confidence: 'high' },
];

let added = 0;
for (const e of batch) {
  if (!existing.has(e.id)) { edges.push(e); existing.add(e.id); added++; }
}
require('fs').writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(edges, null, 2));
console.log('Added:', added, '| Total:', edges.length);

// Integrity
const allIds = new Set();
const scopes = ['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'];
for (const s of scopes) JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id));
let orphans = 0;
for (const e of edges) {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
}
console.log('Orphans:', orphans);
