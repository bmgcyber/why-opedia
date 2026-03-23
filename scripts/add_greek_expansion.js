#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const nodesPath = path.join(__dirname, '../data/nodes.json');
const edgesPath = path.join(__dirname, '../data/edges.json');
const nodes = JSON.parse(fs.readFileSync(nodesPath));
const edges = JSON.parse(fs.readFileSync(edgesPath));

// Note: alexander_the_great already exists — skip it, use it only in edges.
// ── Greek Expansion Nodes ─────────────────────────────────────────────────────
const newNodes = [
  {
    id: 'athenian_democracy',
    label: 'Athenian Democracy',
    node_type: 'reference',
    category: 'institution',
    wikipedia: 'https://en.wikipedia.org/wiki/Athenian_democracy',
    summary: 'The world\'s first known democratic system, developed in Athens beginning with Cleisthenes\' reforms (508 BCE) and reaching its height under Pericles (461–429 BCE). Athenian democracy was a direct democracy: eligible citizens (adult male Athenians, excluding women, slaves, and foreigners) voted directly on legislation, judicial cases, and war decisions in the Assembly (Ekklesia). Key institutions included the Council of 500 (Boule) selected by lot, courts staffed by citizen jurors, and the principle of isegoria (equal right to speak). Athens was also a slave society — approximately one-third of the population were enslaved — revealing the paradox that the birthplace of democracy depended on unfree labor. Athenian democracy was terminated by Macedonian conquest (322 BCE) and has been both idealized and critiqued as a model for modern democratic theory.',
    decade: '500s BCE–320s BCE',
    tags: ['greece', 'democracy', 'politics', 'athens', 'ancient', 'pericles', 'institution']
  },
  {
    id: 'peloponnesian_war',
    label: 'Peloponnesian War',
    node_type: 'reference',
    category: 'event',
    wikipedia: 'https://en.wikipedia.org/wiki/Peloponnesian_War',
    summary: 'The catastrophic conflict between Athens and Sparta (431–404 BCE) that ended the Golden Age of Greece and destroyed Athenian power. Thucydides\' account of the war is one of history\'s foundational works of political science, analyzing the causes of war in terms of Athenian imperial growth making Sparta afraid — a dynamic now called the "Thucydides Trap." The war produced the Athenian plague (killing Pericles), the disastrous Sicilian Expedition, political upheaval in Athens, and ultimately Athenian defeat and surrender to Sparta. The war left Greece economically exhausted and politically fragmented, creating conditions for the eventual Macedonian conquest under Philip II and Alexander the Great.',
    decade: '430s BCE–400s BCE',
    tags: ['greece', 'war', 'athens', 'sparta', 'ancient', 'thucydides', 'conflict']
  },
  {
    id: 'pericles',
    label: 'Pericles',
    node_type: 'reference',
    category: 'person',
    wikipedia: 'https://en.wikipedia.org/wiki/Pericles',
    summary: 'Athenian statesman (c. 495–429 BCE) who dominated Athenian politics during its golden age and gave his name to the Periclean Age. Pericles extended democratic participation, oversaw the construction of the Parthenon and Acropolis monuments, and built the Athenian Empire (Delian League) into an instrument of Athenian power. His funeral oration (recorded by Thucydides) is among the most celebrated defenses of democratic governance in antiquity. Pericles also pursued an aggressive imperial policy — treating Athenian allies as subjects — that contributed to Spartan fears and the outbreak of the Peloponnesian War. He died of the Athenian plague in 429 BCE, his reputation simultaneously that of democracy\'s greatest champion and contributor to the war that destroyed it.',
    decade: '460s BCE–430s BCE',
    tags: ['greece', 'athens', 'democracy', 'statesman', 'ancient', 'politics', 'pericles']
  },
  {
    id: 'greek_mythology',
    label: 'Greek Mythology',
    node_type: 'reference',
    category: 'ideology',
    wikipedia: 'https://en.wikipedia.org/wiki/Greek_mythology',
    summary: 'The body of myths, stories, and religious beliefs of ancient Greece, centered on the Olympian gods (Zeus, Hera, Athena, Apollo, Aphrodite, etc.), heroes (Heracles, Achilles, Odysseus), and cosmogonic narratives. Greek mythology was not a single unified system but a diverse collection of regional traditions that Greek literature, particularly Homer\'s epics and Hesiod\'s Theogony, helped standardize. It served simultaneously as religious belief, cultural identity, artistic inspiration, and philosophical springboard — pre-Socratic philosophers critiqued anthropomorphic mythology even as it saturated Greek culture. Greek mythology had enormous influence on Roman religion (which absorbed and renamed the Greek pantheon), Renaissance art and literature, Enlightenment thought, and modern Western culture.',
    decade: '800s BCE–Ongoing',
    tags: ['greece', 'mythology', 'religion', 'gods', 'ancient', 'homer', 'culture']
  },
  {
    id: 'olympic_games_ancient',
    label: 'Ancient Olympic Games',
    node_type: 'reference',
    category: 'event',
    wikipedia: 'https://en.wikipedia.org/wiki/Ancient_Olympic_Games',
    summary: 'The quadrennial pan-Hellenic athletic festival held at Olympia in honor of Zeus, traditionally dated from 776 BCE to 393 CE (when abolished by the Christian emperor Theodosius). The Olympics were one of four pan-Hellenic games (along with Pythian, Isthmian, and Nemean games) that provided a common cultural framework across hundreds of independent Greek city-states. A sacred truce allowed safe travel during the games. The Olympics promoted Greek cultural unity, established common athletic ideals (the naked athletic body as beautiful), and created a shared calendar (Olympiads) used for historical dating. The modern Olympic Games (1896) were explicitly modeled on the ancient tradition, creating a modern institution self-consciously linking Western civilization to Greek origins.',
    decade: '770s BCE–390s CE',
    tags: ['greece', 'sport', 'religion', 'pan-hellenic', 'culture', 'ancient', 'athletics']
  },
  {
    id: 'homeric_epics',
    label: 'Homeric Epics (Iliad & Odyssey)',
    node_type: 'reference',
    category: 'product',
    wikipedia: 'https://en.wikipedia.org/wiki/Homeric_epics',
    summary: 'The Iliad and Odyssey, attributed to Homer (8th century BCE), are the foundational texts of Western literature and the primary source for Greek mythology. The Iliad narrates episodes from the Trojan War (the wrath of Achilles, the death of Hector); the Odyssey follows Odysseus\'s ten-year return from Troy. The epics were composed in an oral tradition before being written down, and they were central to Greek education — Greeks learned to read using Homer, memorized long passages, and treated the epics as an encyclopedia of heroic values and divine behavior. The Homeric epics shaped Greek mythology, philosophy (Plato quotes and critiques Homer), Roman literature (Virgil\'s Aeneid), and Western literary imagination from the Renaissance to the present.',
    decade: '800s BCE',
    tags: ['greece', 'literature', 'epic', 'homer', 'mythology', 'iliad', 'odyssey']
  }
];

// ── Greek Expansion Edges ─────────────────────────────────────────────────────
const newEdges = [
  {
    id: 'athenian_democracy__socrates',
    source: 'athenian_democracy',
    target: 'socrates',
    type: 'ENABLED',
    label: 'Athenian democratic culture created the intellectual freedom that enabled Socratic philosophy',
    note: 'Democracy\'s culture of open debate and citizen equality created the conditions for Socratic dialectic — public questioning of received wisdom. Socrates operated in the agora, engaging citizens across social classes. Democratic Athens also eventually executed Socrates, revealing the paradox of democracy\'s relationship to free thought.',
    confidence: 'high'
  },
  {
    id: 'athenian_democracy__peloponnesian_war',
    source: 'athenian_democracy',
    target: 'peloponnesian_war',
    type: 'CAUSED',
    label: 'Athenian democratic imperial expansion made Sparta feel threatened and precipitated the war',
    note: 'Thucydides identifies the growth of Athenian power and the fear it caused in Sparta as the underlying cause of the Peloponnesian War. Democratic Athens\' aggressive imperial expansion (the Delian League) provoked the Spartan-led response.',
    confidence: 'high'
  },
  {
    id: 'pericles__athenian_democracy',
    source: 'pericles',
    target: 'athenian_democracy',
    type: 'ENABLED',
    label: 'Pericles extended democratic participation and built the institutions of Athenian democracy\'s golden age',
    note: 'Pericles introduced payment for jury service (enabling poorer citizens to participate), expanded the Assembly, and oversaw the democratic reforms that made Athens\' golden age possible. His funeral oration remains the canonical defense of democratic governance.',
    confidence: 'high'
  },
  {
    id: 'battle_of_marathon__athenian_democracy',
    source: 'battle_of_marathon',
    target: 'athenian_democracy',
    type: 'ENABLED',
    label: 'The Athenian victory at Marathon preserved the democratic city-state from Persian conquest',
    note: 'Had Athens lost at Marathon (490 BCE), Persian conquest would have ended the nascent democratic experiment. The victory validated Athenian military capacity and democratic morale, providing the confidence for Pericles\' golden age two generations later.',
    confidence: 'high'
  },
  {
    id: 'alexander_the_great__hellenistic_philosophy',
    source: 'alexander_the_great',
    target: 'hellenistic_philosophy',
    type: 'PRODUCED',
    label: 'Alexander\'s conquests spread Greek ideas across the Near East and created the Hellenistic synthesis',
    note: 'Alexander\'s conquests created a vast Greek-influenced cultural zone from Greece to India. Greek philosophy, science, and culture merged with Egyptian, Persian, and Babylonian traditions — producing Hellenistic philosophy\'s distinctive cosmopolitan and syncretic character.',
    confidence: 'high'
  },
  {
    id: 'alexander_the_great__persian_achaemenid_empire',
    source: 'alexander_the_great',
    target: 'persian_achaemenid_empire',
    type: 'COLONIZED',
    label: 'Alexander\'s conquest destroyed the Persian Achaemenid Empire and colonized its territories',
    note: 'Alexander\'s campaigns (334–323 BCE) dismantled the Persian Achaemenid Empire — the world\'s largest empire — replacing it with Greek-ruled successor kingdoms (Seleucid, Ptolemaic, etc.) that imposed Greek culture on non-Greek populations.',
    confidence: 'high'
  },
  {
    id: 'peloponnesian_war__athenian_democracy',
    source: 'peloponnesian_war',
    target: 'athenian_democracy',
    type: 'DISCREDITED',
    label: 'Athens\' catastrophic defeat in the Peloponnesian War discredited Athenian democratic leadership',
    note: 'The Peloponnesian War ended with Athens\' surrender, the installation of the oligarchic Thirty Tyrants, and the execution of democratic leaders. The disaster discredited democratic decision-making — the Assembly had voted for the Sicilian Expedition, the war\'s turning point disaster. Plato\'s anti-democratic philosophy was shaped by witnessing this defeat.',
    confidence: 'high'
  },
  {
    id: 'greek_mythology__platonic_idealism',
    source: 'greek_mythology',
    target: 'platonic_idealism',
    type: 'ENABLED',
    label: 'Greek mythology\'s tradition of transcendent divine forms provided the cultural substrate for Platonic idealism',
    note: 'Plato\'s theory of Forms drew on and transformed the mythological tradition of divine transcendent realities. His allegory of the Cave echoes the mythological structure of a higher divine world vs. the shadow world of appearances. Plato simultaneously critiqued and incorporated mythological thinking.',
    confidence: 'medium'
  },
  {
    id: 'homeric_epics__greek_mythology',
    source: 'homeric_epics',
    target: 'greek_mythology',
    type: 'ENABLED',
    label: 'The Homeric epics standardized and transmitted Greek mythology across the Hellenic world',
    note: 'Before Homer, Greek mythology was regional and diverse. The Iliad and Odyssey provided a shared canonical account of the gods and heroes that became the common cultural currency of all Greek-speaking peoples. Homer was the "Bible of the Greeks."',
    confidence: 'high'
  },
  {
    id: 'egyptian_mythology__greek_mythology',
    source: 'egyptian_mythology',
    target: 'greek_mythology',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Egyptian and Greek mythology share structural mechanisms of divine pantheon, death and resurrection, and cosmic order',
    note: 'Egyptian mythology influenced Greek mythology through millennia of contact: Osiris and Dionysus share resurrection mythology; Isis became a major Greco-Roman goddess; Egyptian religious ideas shaped Orphic and mystery traditions that influenced Greek thought. The shared mechanisms of polytheistic pantheon, divine justice, and afterlife judgment reflect both direct influence and convergent development.',
    confidence: 'medium'
  },
  {
    id: 'olympic_games_ancient__athenian_democracy',
    source: 'olympic_games_ancient',
    target: 'athenian_democracy',
    type: 'ENABLED',
    label: 'Pan-Hellenic games created a shared Greek identity that enabled Athenian democratic leadership',
    note: 'The Olympic games and other pan-Hellenic festivals created a cultural framework within which Athenian democratic ideology could spread as a Greek ideal. Athens\' role as a cultural center (philosophy, theater, art) was inseparable from the pan-Hellenic prestige the games helped establish.',
    confidence: 'medium'
  },
  {
    id: 'pericles__peloponnesian_war',
    source: 'pericles',
    target: 'peloponnesian_war',
    type: 'CAUSED',
    label: 'Pericles\' aggressive imperial strategy contributed to Spartan fear that triggered the war',
    note: 'Pericles\' expansive Athenian imperial policy — using the Delian League treasury for Athenian public works, extending Athenian power — directly provoked Spartan-led opposition. Thucydides records Spartan leaders identifying Pericles\' strategy as the proximate cause of the war.',
    confidence: 'high'
  }
];

// Check for duplicates
const existingNodeIds = new Set(nodes.map(n => n.id));
const dupNodes = newNodes.filter(n => existingNodeIds.has(n.id));
if (dupNodes.length > 0) {
  console.error('DUPLICATE NODE IDs:', dupNodes.map(n => n.id).join(', '));
  process.exit(1);
}
const existingEdgeIds = new Set(edges.map(e => e.id));
const dupEdges = newEdges.filter(e => existingEdgeIds.has(e.id));
if (dupEdges.length > 0) {
  console.error('DUPLICATE EDGE IDs:', dupEdges.map(e => e.id).join(', '));
  process.exit(1);
}

nodes.push(...newNodes);
edges.push(...newEdges);

fs.writeFileSync(nodesPath, JSON.stringify(nodes, null, 2));
fs.writeFileSync(edgesPath, JSON.stringify(edges, null, 2));
console.log('nodes.json:', nodes.length, '(+' + newNodes.length + ')');
console.log('edges.json:', edges.length, '(+' + newEdges.length + ')');
