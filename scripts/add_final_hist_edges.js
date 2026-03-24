#!/usr/bin/env node
// add_final_hist_edges.js — fix last 2 low-connectivity history nodes
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const he = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const exIds = new Set(he.map(e => e.id));

const batch = [
  // ── sassanid_persian_empire ───────────────────────────────────────────────
  { id: 'persian_achaemenid_empire__sassanid_persian_empire',
    source: 'persian_achaemenid_empire', target: 'sassanid_persian_empire', type: 'PRODUCED',
    label: 'The Sassanid dynasty explicitly claimed Achaemenid legitimacy, consciously reviving the first Persian empire\'s cultural and political heritage',
    note: 'The Sassanid dynasty (224-651 CE) founded by Ardashir I explicitly claimed descent from and continuity with the Achaemenid Persian empire (550-330 BCE), which Alexander the Great had destroyed. The Sassanids revived Zoroastrianism as state religion, restored Persian administrative traditions, and used the term "Iran" (from "Aryan") to assert ethnic Persian identity. This makes the Achaemenid empire the cultural progenitor of Sassanid civilization — a claim that shaped how Sassanid rulers legitimized their authority and how they understood Persian civilization\'s mission.',
    confidence: 'high' },
  { id: 'sassanid_persian_empire__rise_of_islam',
    source: 'sassanid_persian_empire', target: 'rise_of_islam', type: 'ENABLED',
    label: 'The Sassanid empire\'s exhaustion from Byzantine wars left it unable to resist Islamic conquest, enabling Islam\'s rapid spread across Persia',
    note: 'The Arab Islamic conquests (636-651 CE) destroyed the Sassanid empire with stunning speed because decades of devastating war against Byzantium (603-628 CE) had financially exhausted both empires. The Battle of al-Qadisiyyah (636 CE) and Battle of Nihavand (642 CE) completed Sassanid collapse. Persia\'s incorporation into the Islamic world was transformative for both: Persians contributed bureaucratic sophistication, art, architecture, and intellectual culture to the Abbasid Caliphate, creating the Islamic Golden Age\'s synthesis. The Sassanid collapse enabled not just Islamic conquest but a profound Persian-Islamic cultural fusion.',
    confidence: 'high' },
  { id: 'sassanid_persian_empire__byzantine_empire',
    source: 'sassanid_persian_empire', target: 'byzantine_empire', type: 'SHARES_MECHANISM_WITH',
    label: 'Byzantium and Sassanid Persia were mirror-image empires that exhausted each other through a century of war, enabling Islamic conquest of both',
    note: 'The Byzantine-Sassanid wars (527-628 CE) are a historical irony: two highly sophisticated civilizations fought each other to mutual exhaustion over a century, enabling a third party (Arabian Islamic forces) to conquer both simultaneously. The final war (603-628 CE) saw both empires\' territories occupied; Byzantium ultimately won under Heraclius but was financially destroyed. The Sassanids collapsed entirely. The lesson: peer-competitor exhaustion wars create power vacuums that third parties exploit — a pattern that recurs throughout history.',
    confidence: 'high' },

  // ── olympic_games_ancient ─────────────────────────────────────────────────
  { id: 'olympic_games_ancient__alexander_the_great',
    source: 'olympic_games_ancient', target: 'alexander_the_great', type: 'ENABLED',
    label: 'The Panhellenic identity the Olympics institutionalized gave Alexander the cultural framework for his conquests\' legitimacy',
    note: 'The ancient Olympics (776 BCE-393 CE) institutionalized Panhellenic identity — the idea that all Greek city-states shared a cultural community transcending political rivalry. This Panhellenic framework gave Alexander the Great the ideological basis for his "Greek" conquest of Persia: the war of revenge for the Persian Wars, the unity of Hellenic civilization against Asian "barbarism." Without the Panhellenic cultural identity the Olympics (and Panhellenic games at Delphi, Nemea, Corinth) sustained, Alexander\'s unification of Greece before Persian conquest would lack the cultural logic it deployed.',
    confidence: 'medium' },
  { id: 'olympic_games_ancient__battle_of_marathon',
    source: 'olympic_games_ancient', target: 'battle_of_marathon', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent the construction of Panhellenic identity against Persian "barbarism" — two dimensions of the same Greek self-definition',
    note: 'The ancient Olympics and the Battle of Marathon (490 BCE) both functioned as Panhellenic identity-construction mechanisms against a common "other." The Olympics created a shared Greek cultural space (sacred truce, pan-Greek participation); the Persian Wars created a shared Greek political identity through shared military threat. Herodotus records that an Olympic athlete running at Marathon was the first to carry news of victory to Athens. The Games\' schedule — held regardless of Greek interstate wars — demonstrated a cultural solidarity that the Persian Wars then tested militarily.',
    confidence: 'medium' },
  { id: 'pericles__olympic_games_ancient',
    source: 'pericles', target: 'olympic_games_ancient', type: 'ENABLED',
    label: 'Athenian imperial wealth under Pericles funded magnificent participation in the Panhellenic games, projecting cultural hegemony',
    note: 'Athens under Pericles (461-429 BCE) used the Panhellenic games — Olympic, Pythian, Isthmian, Nemean — as arenas of cultural and political projection: wealthy Athenians competed in chariot races and other aristocratic events as demonstrations of Athenian power. Alcibiades (Pericles\' ward) famously entered seven chariot teams at the 416 BCE Olympics. The games were sites of political propaganda as much as athletic competition — victories were publicized through odes (Pindar) and architectural dedications. Periclean Athens understood the games as a soft power arena for Athenian imperial ambition.',
    confidence: 'medium' },
];

let added = 0;
for (const e of batch) {
  if (!exIds.has(e.id)) { he.push(e); exIds.add(e.id); added++; }
}
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(he, null, 2));
console.log('history/edges: +' + added + ' → ' + he.length);

// Integrity check
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
he.forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
console.log('Total history edges:', he.length, '| Orphans:', orphans);
