#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const nodesPath = path.join(__dirname, '../data/nodes.json');
const edgesPath = path.join(__dirname, '../data/edges.json');
const nodes = JSON.parse(fs.readFileSync(nodesPath));
const edges = JSON.parse(fs.readFileSync(edgesPath));

// ── Ancient Egypt Nodes ───────────────────────────────────────────────────────
const newNodes = [
  {
    id: 'ancient_egypt',
    label: 'Ancient Egypt',
    node_type: 'reference',
    category: 'institution',
    wikipedia: 'https://en.wikipedia.org/wiki/Ancient_Egypt',
    summary: 'One of the world\'s oldest and most enduring civilizations, centered on the Nile River and lasting from approximately 3100 BCE (unification under the first pharaoh) to 30 BCE (conquest by Rome). Ancient Egypt developed a distinctive state religion, monumental architecture (pyramids, temples), a hieroglyphic writing system, and a bureaucratic government under the divine pharaoh. Egypt\'s agricultural wealth from Nile flooding supported a population of several million, enabling massive public works. Egypt influenced the ancient Mediterranean world through trade, military power, and cultural exchange, absorbing and influencing Nubia, the Levant, and eventually Greece and Rome.',
    decade: '3100s BCE–30s BCE',
    tags: ['egypt', 'civilization', 'africa', 'ancient', 'nile', 'pharaoh', 'empire']
  },
  {
    id: 'egyptian_pharaoh',
    label: 'Egyptian Pharaoh',
    node_type: 'reference',
    category: 'institution',
    wikipedia: 'https://en.wikipedia.org/wiki/Pharaoh',
    summary: 'The divine ruler of ancient Egypt, conceived as the earthly manifestation of the god Horus and the dead embodiment of Osiris. The pharaoh was simultaneously the political head of state, chief priest, supreme judge, and military commander — all divine authority converging in a single person. This theocratic institution persisted from the unification of Upper and Lower Egypt (~3100 BCE) through the Roman conquest (30 BCE), spanning 31 dynasties. The pharaoh\'s divine status legitimized absolute power: to defy the pharaoh was to defy the cosmic order (Ma\'at). The institution of divine kingship influenced neighboring cultures and provided a model that echoed through later Mediterranean and Near Eastern political theology.',
    decade: '3100s BCE–30s BCE',
    tags: ['egypt', 'monarchy', 'divine-kingship', 'politics', 'religion', 'power', 'africa']
  },
  {
    id: 'pyramid_construction',
    label: 'Pyramid Construction',
    node_type: 'reference',
    category: 'event',
    wikipedia: 'https://en.wikipedia.org/wiki/Egyptian_pyramids',
    summary: 'The construction of monumental royal tombs in ancient Egypt, reaching its peak in the Old Kingdom (2686–2181 BCE) with the Giza pyramid complex — including the Great Pyramid of Khufu, one of the Seven Wonders of the Ancient World. The pyramids served as royal tombs and cosmic symbols, aligning with celestial bodies and encoding religious beliefs about the afterlife and the pharaoh\'s divine journey. Construction required massive organized labor — a combination of skilled artisans, administrative workers, and seasonal laborers (not exclusively slaves, as archaeology now shows). The pyramids are the largest surviving monuments of the ancient world and a testament to Egyptian administrative, engineering, and logistical capacity.',
    decade: '2600s BCE–1500s BCE',
    tags: ['egypt', 'architecture', 'monument', 'religion', 'labor', 'ancient', 'giza']
  },
  {
    id: 'egyptian_hieroglyphics',
    label: 'Egyptian Hieroglyphics',
    node_type: 'reference',
    category: 'product',
    wikipedia: 'https://en.wikipedia.org/wiki/Egyptian_hieroglyphs',
    summary: 'The formal writing system of ancient Egypt, consisting of logographic and alphabetic elements, used from approximately 3200 BCE until the 4th century CE. Hieroglyphics (Greek: "sacred carvings") were used in monumental contexts — temple walls, tombs, royal decrees — and represented both sounds and concepts. A cursive form (hieratic) was used for everyday writing on papyrus; an even more simplified form (demotic) emerged later. The decipherment of hieroglyphics by Jean-François Champollion (1822), using the Rosetta Stone, unlocked 3,000 years of Egyptian history. Hieroglyphics influenced Phoenician script, which became the ancestor of the Greek and Latin alphabets.',
    decade: '3100s BCE',
    tags: ['egypt', 'writing', 'language', 'communication', 'ancient', 'rosetta-stone', 'alphabet']
  },
  {
    id: 'egyptian_mythology',
    label: 'Egyptian Mythology',
    node_type: 'reference',
    category: 'ideology',
    wikipedia: 'https://en.wikipedia.org/wiki/Ancient_Egyptian_religion',
    summary: 'The complex religious and mythological system of ancient Egypt, centered on a polytheistic pantheon of gods (Ra, Osiris, Isis, Horus, Anubis, Thoth, and many others) who governed natural phenomena, the afterlife, and social order. Egyptian mythology provided the ideological foundation for pharaonic authority, temple ritual, funerary practice, and understanding of death and resurrection. The myths of Osiris (death and resurrection), Ra (the solar journey), and Ma\'at (cosmic truth and justice) structured Egyptian society. Egyptian religious ideas influenced Greek mythology (Isis became prominent across the Mediterranean), early Christianity (the resurrection motif), and modern esoteric traditions.',
    decade: '3000s BCE–Ongoing',
    tags: ['egypt', 'religion', 'mythology', 'gods', 'afterlife', 'ancient', 'osiris']
  },
  {
    id: 'egyptian_slavery',
    label: 'Egyptian Slavery',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Slavery_in_ancient_Egypt',
    summary: 'The institution of forced labor in ancient Egypt, which included war captives, debt bondage, and hereditary servitude, though its scale and nature differed from later chattel slavery systems. While Egyptian slavery existed, it was less systematically racialized than later Atlantic slavery. Enslaved people came from various ethnic backgrounds (Nubians, Syrians, Libyans, Canaanites) depending on the period and which peoples Egypt conquered. Some enslaved people could own property, marry, and were legally protected against extreme abuse. The pyramids were not primarily built by slaves — the workforce included skilled laborers, administrators, and seasonal workers — but monumental temples and agricultural estates did rely on enslaved and coerced labor.',
    decade: '3000s BCE–30s BCE',
    tags: ['egypt', 'slavery', 'labor', 'coercion', 'ancient', 'africa', 'social-structure']
  },
  {
    id: 'cleopatra',
    label: 'Cleopatra VII',
    node_type: 'reference',
    category: 'person',
    wikipedia: 'https://en.wikipedia.org/wiki/Cleopatra',
    summary: 'The last active ruler of Ptolemaic Egypt (reigned 51–30 BCE), Cleopatra VII Philopator was a skilled political strategist, polyglot (the first Ptolemaic ruler to learn Egyptian), and the last pharaoh of an independent Egypt. Her alliances with Julius Caesar and then Mark Antony were attempts to use Roman power to preserve Egyptian independence against Roman annexation. After the defeat of Antony and Cleopatra by Octavian (the future Augustus) at the Battle of Actium (31 BCE), Cleopatra died by suicide (30 BCE), ending the Ptolemaic dynasty and making Egypt a Roman province. Cleopatra\'s legacy has been shaped by Roman propaganda that portrayed her as a dangerous Eastern seductress — a framing that has distorted historical understanding.',
    decade: '60s BCE–30s BCE',
    tags: ['egypt', 'rome', 'ruler', 'woman', 'ptolemy', 'ancient', 'politics']
  },
  {
    id: 'akhenaten',
    label: 'Akhenaten',
    node_type: 'reference',
    category: 'person',
    wikipedia: 'https://en.wikipedia.org/wiki/Akhenaten',
    summary: 'Egyptian pharaoh who ruled from approximately 1353 to 1336 BCE and instituted a radical religious revolution, replacing Egypt\'s polytheistic pantheon with exclusive worship of the Aten (the solar disc). Akhenaten built a new capital city (Akhetaten, modern Amarna), suppressed the powerful priesthood of Amun, and depicted the Aten in an unprecedented abstract way — as light itself rather than an anthropomorphic god. His "Amarna Period" was erased from Egyptian memory after his death: his successors (including Tutankhamun) restored traditional polytheism, dismantled Akhetaten, and attempted to erase Akhenaten\'s name from records. Akhenaten is considered history\'s first monotheist, though the relationship between his Aten worship and later Abrahamic monotheism is debated.',
    decade: '1360s BCE–1340s BCE',
    tags: ['egypt', 'pharaoh', 'religion', 'monotheism', 'amarna', 'ancient', 'revolution']
  },
  {
    id: 'egyptian_monotheism',
    label: "Akhenaten's Monotheism",
    node_type: 'reference',
    category: 'ideology',
    wikipedia: 'https://en.wikipedia.org/wiki/Atenism',
    summary: 'The theological revolution initiated by Pharaoh Akhenaten (c. 1353–1336 BCE), replacing Egypt\'s polytheistic pantheon with exclusive worship of the Aten — the visible disk of the sun. Atenism is considered the earliest documented monotheism or monolatry. Akhenaten closed traditional temples, suppressed other gods\' cults (especially Amun), and declared the Aten the sole creator god accessible only through the pharaoh. The revolution was reversed after Akhenaten\'s death — successors restored polytheism and erased his legacy. Some scholars (Sigmund Freud in "Moses and Monotheism", Jan Assmann) have argued that Atenism influenced later Israelite monotheism, though the direct connection remains debated.',
    decade: '1350s BCE',
    tags: ['egypt', 'religion', 'monotheism', 'theology', 'aten', 'ancient', 'akhenaten']
  },
  {
    id: 'book_of_the_dead',
    label: 'Book of the Dead',
    node_type: 'reference',
    category: 'product',
    wikipedia: 'https://en.wikipedia.org/wiki/Book_of_the_Dead',
    summary: 'An ancient Egyptian funerary text used from approximately 1550 BCE to 50 BCE, consisting of magic spells and instructions intended to assist the deceased\'s journey through the afterlife (Duat) and judgment before Osiris. The Book of the Dead (more accurately "Book of Coming Forth by Day") was written on papyrus scrolls placed in tombs alongside the deceased. It contains the famous "Negative Confession" — a declaration of innocence before 42 divine judges — and the "Weighing of the Heart" ceremony, where the deceased\'s heart is weighed against the feather of Ma\'at. The ethical content (denying murder, theft, falsehood) represents one of the earliest written moral codes. It influenced later conceptions of divine judgment and afterlife in Mediterranean religions.',
    decade: '1550s BCE',
    tags: ['egypt', 'religion', 'afterlife', 'mythology', 'funerary', 'ancient', 'judgment']
  }
];

// ── Ancient Egypt Edges ───────────────────────────────────────────────────────
const newEdges = [
  {
    id: 'ancient_egypt__pyramid_construction',
    source: 'ancient_egypt',
    target: 'pyramid_construction',
    type: 'PRODUCED',
    label: 'Egyptian state capacity and pharaonic religion produced monumental pyramid construction',
    note: 'The pyramids were produced by the unique convergence of Egyptian factors: pharaonic divine authority, administrative organization, agricultural surplus, and religious belief in royal afterlife.',
    confidence: 'high'
  },
  {
    id: 'ancient_egypt__egyptian_hieroglyphics',
    source: 'ancient_egypt',
    target: 'egyptian_hieroglyphics',
    type: 'PRODUCED',
    label: 'Egyptian state administration produced a unique hieroglyphic writing system',
    note: 'Hieroglyphics emerged from Egyptian administrative and religious needs, developing independently from Mesopotamian cuneiform into a distinct system used across 3,000 years of Egyptian history.',
    confidence: 'high'
  },
  {
    id: 'ancient_egypt__egyptian_slavery',
    source: 'ancient_egypt',
    target: 'egyptian_slavery',
    type: 'ENABLED',
    label: 'Egyptian imperial expansion enabled the institution of slavery through war captives and tribute',
    note: 'Egyptian military campaigns against Nubia, the Levant, and Libya produced war captives who became enslaved. Egypt\'s agricultural and monumental economy relied on forms of coerced labor.',
    confidence: 'high'
  },
  {
    id: 'ancient_egypt__egyptian_mythology',
    source: 'ancient_egypt',
    target: 'egyptian_mythology',
    type: 'PRODUCED',
    label: 'Egyptian civilization produced one of antiquity\'s richest mythological systems',
    note: 'Egyptian mythology was embedded in every aspect of Egyptian life — from the agricultural calendar to royal succession to funerary practice. The state\'s investment in temples, priesthoods, and ritual maintained this mythological system for three millennia.',
    confidence: 'high'
  },
  {
    id: 'akhenaten__egyptian_monotheism',
    source: 'akhenaten',
    target: 'egyptian_monotheism',
    type: 'CAUSED',
    label: 'Akhenaten\'s personal theological revolution caused the suppression of Egyptian polytheism',
    note: 'Akhenaten\'s monotheistic revolution was radical and top-down — driven by the pharaoh\'s own apparent religious conviction. He closed temples, erased divine names from monuments, and built an entirely new capital.',
    confidence: 'high'
  },
  {
    id: 'cleopatra__roman_empire',
    source: 'cleopatra',
    target: 'roman_empire',
    type: 'ENABLED',
    label: 'Cleopatra\'s alliances with Caesar and Antony shaped the political formation of the Roman Empire',
    note: 'Cleopatra\'s relationship with Julius Caesar stabilized his position in Egypt and provided resources that fueled Roman civil wars. Her alliance with Mark Antony challenged Octavian\'s supremacy. The defeat of Antony and Cleopatra made Egypt a Roman province and enabled Octavian to become Augustus — the first emperor. Egypt\'s grain wealth financed the Roman Empire.',
    confidence: 'high'
  },
  {
    id: 'egyptian_slavery__atlantic_slave_trade',
    source: 'egyptian_slavery',
    target: 'atlantic_slave_trade',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Both ancient Egyptian slavery and Atlantic slavery share mechanisms of conquest-based forced labor',
    note: 'Both institutions relied on military conquest to produce enslaved populations, used enslaved labor for monumental and agricultural production, and operated within systems that naturalized the enslavement of ethnic others. However, ancient Egyptian slavery was less systematically racialized and less chattel-based than Atlantic slavery.',
    confidence: 'speculative'
  },
  {
    id: 'ancient_egypt__babylonian_captivity',
    source: 'ancient_egypt',
    target: 'babylonian_captivity',
    type: 'ENABLED',
    label: 'Egypt\'s regional dominance shaped the geopolitical context that led to Judean exile',
    note: 'Egypt\'s weakening power in the Levant opened space for Assyrian and Babylonian imperial expansion. Judah\'s failed pro-Egyptian alliances against Babylon (including King Jehoiakim\'s revolt) contributed to Nebuchadnezzar\'s decision to destroy Jerusalem and deport the Judean elite.',
    confidence: 'medium'
  },
  {
    id: 'ancient_egypt__book_of_the_dead',
    source: 'ancient_egypt',
    target: 'book_of_the_dead',
    type: 'PRODUCED',
    label: 'Egyptian funerary culture produced the Book of the Dead as its canonical guide to the afterlife',
    note: 'The Book of the Dead emerged from centuries of Egyptian funerary text development, from the Pyramid Texts and Coffin Texts, reaching its final canonical form in the New Kingdom.',
    confidence: 'high'
  },
  {
    id: 'ancient_egypt__egyptian_pharaoh',
    source: 'ancient_egypt',
    target: 'egyptian_pharaoh',
    type: 'ENABLED',
    label: 'Egypt\'s unified state structure enabled the institution of divine pharaonic rule',
    note: 'The pharaonic institution emerged from the unification of Upper and Lower Egypt and was sustained by Egypt\'s administrative, religious, and military infrastructure.',
    confidence: 'high'
  },
  {
    id: 'egyptian_pharaoh__pyramid_construction',
    source: 'egyptian_pharaoh',
    target: 'pyramid_construction',
    type: 'PRODUCED',
    label: 'Pharaonic ideology of divine kingship and afterlife belief produced monumental tomb construction',
    note: 'Pyramids served as the pharaoh\'s vehicle for divine transformation after death. The pharaoh\'s divine status made pyramid construction a religious duty for the state.',
    confidence: 'high'
  },
  {
    id: 'egyptian_slavery__pyramid_construction',
    source: 'egyptian_slavery',
    target: 'pyramid_construction',
    type: 'ENABLED',
    label: 'Coerced and organized labor enabled the scale of pyramid construction',
    note: 'While pyramid builders were not exclusively enslaved (evidence shows skilled workers received pay and rations), large-scale coerced labor — including enslaved war captives — was part of the workforce that enabled monumental construction.',
    confidence: 'medium'
  },
  {
    id: 'egyptian_hieroglyphics__book_of_the_dead',
    source: 'egyptian_hieroglyphics',
    target: 'book_of_the_dead',
    type: 'ENABLED',
    label: 'Hieroglyphic writing enabled the recording and transmission of funerary texts',
    note: 'The Book of the Dead existed only because of hieroglyphic writing. The spells and instructions required written form to be placed in tombs; the hieroglyphic tradition preserved and transmitted this text over 1,500 years.',
    confidence: 'high'
  },
  {
    id: 'egyptian_pharaoh__akhenaten',
    source: 'egyptian_pharaoh',
    target: 'akhenaten',
    type: 'PRODUCED',
    label: 'The pharaonic institution concentrated sufficient authority to attempt radical religious reform',
    note: 'Only the pharaoh\'s divine authority made Akhenaten\'s revolution possible — and only the pharaoh\'s death made its reversal possible. The institution of absolute divine kingship created both the conditions for radical reform and for its total reversal.',
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
