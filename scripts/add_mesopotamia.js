#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const nodesPath = path.join(__dirname, '../data/nodes.json');
const edgesPath = path.join(__dirname, '../data/edges.json');
const nodes = JSON.parse(fs.readFileSync(nodesPath));
const edges = JSON.parse(fs.readFileSync(edgesPath));

// ── Mesopotamia Nodes ─────────────────────────────────────────────────────────
const newNodes = [
  {
    id: 'ancient_sumer',
    label: 'Ancient Sumer',
    node_type: 'reference',
    category: 'institution',
    wikipedia: 'https://en.wikipedia.org/wiki/Sumer',
    summary: 'The earliest known civilization in southern Mesopotamia (modern Iraq), emerging around 3500 BCE. Sumer developed the first cities (Uruk, Ur, Lagash), the first writing system (cuneiform), codified law, and complex religious mythology. Sumerian city-states were organized around temple complexes, with priests managing agricultural surplus. Their innovations in irrigation, administration, and trade established the templates for later Babylonian, Assyrian, and Persian civilizations. The Sumerian language, though unrelated to Semitic languages, was preserved as a literary and religious tongue long after it ceased to be spoken.',
    decade: '3500s BCE–2000s BCE',
    tags: ['mesopotamia', 'civilization', 'iraq', 'ancient', 'city-state', 'origins']
  },
  {
    id: 'cuneiform',
    label: 'Cuneiform Writing',
    node_type: 'reference',
    category: 'product',
    wikipedia: 'https://en.wikipedia.org/wiki/Cuneiform',
    summary: 'The earliest known writing system, developed in Sumer around 3200 BCE. Cuneiform was pressed into clay tablets with a wedge-shaped stylus and initially used for administrative record-keeping — tracking grain, livestock, and labor. It evolved from pictographs into an abstract syllabic script capable of recording literature, law, and religious texts. Over 3,000 years, cuneiform was adapted to write Sumerian, Akkadian, Babylonian, Assyrian, Elamite, Hittite, and Ugaritic, among others. The Epic of Gilgamesh, the Code of Hammurabi, and the world\'s earliest love poetry were all recorded in cuneiform. Deciphered in the 19th century CE, cuneiform tablets revealed the depth of Mesopotamian civilization.',
    decade: '3200s BCE',
    tags: ['writing', 'mesopotamia', 'communication', 'literacy', 'clay-tablets', 'invention']
  },
  {
    id: 'code_of_hammurabi',
    label: 'Code of Hammurabi',
    node_type: 'reference',
    category: 'policy',
    wikipedia: 'https://en.wikipedia.org/wiki/Code_of_Hammurabi',
    summary: 'One of the earliest and most complete legal codes, promulgated by Babylonian king Hammurabi around 1754 BCE. Inscribed on a diorite stele, the Code contains 282 laws covering commerce, property, family, and criminal justice. It is notable for its principle of proportional punishment (an early form of lex talionis — "an eye for an eye"), its differentiated treatment by social class (punishments varied for nobles, commoners, and slaves), and its framing as divinely sanctioned law. The Code influenced subsequent legal systems across the ancient Near East and established the template of written, public, codified law as the foundation of political legitimacy.',
    decade: '1750s BCE',
    tags: ['law', 'babylon', 'mesopotamia', 'justice', 'hammurabi', 'legal-code', 'ancient']
  },
  {
    id: 'assyrian_empire',
    label: 'Assyrian Empire',
    node_type: 'reference',
    category: 'institution',
    wikipedia: 'https://en.wikipedia.org/wiki/Assyria',
    summary: 'A major Semitic-speaking civilization centered in northern Mesopotamia, whose empire reached its peak in the Neo-Assyrian period (911–609 BCE). The Assyrians were renowned for military innovation (siege warfare, iron weapons, cavalry), administrative organization, and a policy of mass deportation of conquered peoples — including the deportation of the northern kingdom of Israel (722 BCE). The Assyrian empire controlled a vast territory from Egypt to Iran, building imperial capitals at Nineveh, Nimrud, and Assur. Their library at Nineveh preserved thousands of cuneiform texts, including the Epic of Gilgamesh. The empire collapsed rapidly after 612 BCE, conquered by a Babylonian-Median coalition.',
    decade: '2400s BCE–600s BCE',
    tags: ['mesopotamia', 'empire', 'iraq', 'military', 'deportation', 'ancient', 'assyria']
  },
  {
    id: 'neo_babylonian_empire',
    label: 'Neo-Babylonian Empire',
    node_type: 'reference',
    category: 'institution',
    wikipedia: 'https://en.wikipedia.org/wiki/Neo-Babylonian_Empire',
    summary: 'The final period of Babylonian dominance in Mesopotamia (626–539 BCE), following the fall of Assyria. Under Nebuchadnezzar II (reigned 605–562 BCE), the Neo-Babylonian Empire destroyed Jerusalem and the First Temple (586 BCE), deporting the Judean elite to Babylon — the Babylonian Captivity that profoundly shaped Jewish theology and scripture. Babylon became the greatest city of the ancient world, featuring the Hanging Gardens, the Ishtar Gate, and extensive astronomical observations. The empire fell to Cyrus the Great of Persia in 539 BCE, who allowed the Jews to return to Judea.',
    decade: '620s BCE–540s BCE',
    tags: ['babylon', 'mesopotamia', 'empire', 'nebuchadnezzar', 'jewish-history', 'ancient', 'persia']
  },
  {
    id: 'gilgamesh',
    label: 'Epic of Gilgamesh',
    node_type: 'reference',
    category: 'product',
    wikipedia: 'https://en.wikipedia.org/wiki/Epic_of_Gilgamesh',
    summary: 'The oldest surviving epic poem, composed in ancient Sumer and later expanded in Akkadian around 2100–1200 BCE. The Epic follows Gilgamesh, king of Uruk, through adventures with his companion Enkidu, the loss of Enkidu to death, and Gilgamesh\'s failed quest for immortality. The story contains a flood narrative remarkably similar to the later biblical account of Noah — providing textual evidence of a shared ancient Near Eastern mythological tradition. The Epic grapples with themes of friendship, mortality, hubris, and the meaning of a well-lived life. Rediscovered and translated in the 19th century CE, it reshaped understanding of the origins of biblical literature.',
    decade: '2100s BCE',
    tags: ['literature', 'mythology', 'mesopotamia', 'epic', 'flood', 'immortality', 'ancient']
  },
  {
    id: 'mesopotamian_agriculture',
    label: 'Mesopotamian Agriculture',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Agriculture_in_Mesopotamia',
    summary: 'The development of organized farming and irrigation in the Fertile Crescent (modern Iraq/Syria/Turkey) beginning around 9000 BCE, representing one of the earliest transitions from hunter-gatherer to agricultural society. Mesopotamian farmers developed irrigation canals to manage the unpredictable flooding of the Tigris and Euphrates rivers, enabling surplus production of barley, wheat, and flax. Agricultural surplus generated the economic foundation for cities, social stratification, full-time specialization, and eventually writing (for record-keeping). The Neolithic agricultural revolution in Mesopotamia is considered one of the most consequential transitions in human history.',
    decade: '9000s BCE',
    tags: ['agriculture', 'mesopotamia', 'neolithic', 'irrigation', 'civilization', 'origins', 'farming']
  }
];

// ── Mesopotamia Edges ─────────────────────────────────────────────────────────
const newEdges = [
  {
    id: 'ancient_sumer__cuneiform',
    source: 'ancient_sumer',
    target: 'cuneiform',
    type: 'PRODUCED',
    label: 'Sumerian administrative needs produced the world\'s first writing system',
    note: 'Cuneiform originated as a Sumerian accounting tool — tracking agricultural surplus, temple goods, and labor allocation. The pressure of managing complex urban economies drove the innovation from pictographic tokens to abstract script.',
    confidence: 'high'
  },
  {
    id: 'ancient_sumer__gilgamesh',
    source: 'ancient_sumer',
    target: 'gilgamesh',
    type: 'PRODUCED',
    label: 'Sumerian oral tradition produced the Epic of Gilgamesh',
    note: 'The earliest Gilgamesh stories originated in Sumerian oral tradition and short written poems before being compiled into the Akkadian epic. Gilgamesh himself may have been a historical king of Uruk.',
    confidence: 'high'
  },
  {
    id: 'ancient_sumer__code_of_hammurabi',
    source: 'ancient_sumer',
    target: 'code_of_hammurabi',
    type: 'ENABLED',
    label: 'Sumerian legal tradition and cuneiform writing enabled codified law',
    note: 'Hammurabi\'s Code built on earlier Sumerian law codes (Ur-Nammu, Lipit-Ishtar) and used the cuneiform script developed by Sumerians. The Babylonian empire inherited Sumerian administrative and legal traditions.',
    confidence: 'high'
  },
  {
    id: 'cuneiform__code_of_hammurabi',
    source: 'cuneiform',
    target: 'code_of_hammurabi',
    type: 'ENABLED',
    label: 'Written script enabled public, inscribed, permanent legal codes',
    note: 'The Code of Hammurabi\'s public display and permanence depended entirely on cuneiform writing. Without script, law remains oral, local, and subject to selective memory. Cuneiform made law visible, reproducible, and authoritative.',
    confidence: 'high'
  },
  {
    id: 'assyrian_empire__babylonian_captivity',
    source: 'assyrian_empire',
    target: 'babylonian_captivity',
    type: 'CAUSED',
    label: 'Assyrian deportation of northern Israel was the first phase of Israelite exile',
    note: 'The Assyrian Empire under Tiglath-Pileser III and Sargon II conquered and deported the population of the northern Kingdom of Israel (722 BCE) — the "Ten Lost Tribes." This was a precursor to the Babylonian deportation of Judah, and part of the same Assyrian policy of mass population displacement to prevent revolts.',
    confidence: 'high'
  },
  {
    id: 'neo_babylonian_empire__babylonian_captivity',
    source: 'neo_babylonian_empire',
    target: 'babylonian_captivity',
    type: 'CAUSED',
    label: 'Nebuchadnezzar\'s destruction of Jerusalem and deportation of Judeans was the Babylonian Captivity',
    note: 'Nebuchadnezzar II destroyed the First Temple and deported the Judean elite to Babylon in 586 BCE. This exile — the Babylonian Captivity — was a defining trauma for Jewish identity, producing Psalms like "By the rivers of Babylon" and reshaping Jewish theology around diaspora and covenant.',
    confidence: 'high'
  },
  {
    id: 'mesopotamian_agriculture__ancient_sumer',
    source: 'mesopotamian_agriculture',
    target: 'ancient_sumer',
    type: 'ENABLED',
    label: 'Agricultural surplus in Mesopotamia enabled the emergence of Sumerian city-states',
    note: 'Sumerian cities could not have existed without reliable agricultural surplus. Irrigation agriculture in the Tigris-Euphrates delta produced enough food to support non-farming specialists — priests, scribes, merchants, soldiers — creating the social complexity of urban civilization.',
    confidence: 'high'
  },
  {
    id: 'ancient_sumer__assyrian_empire',
    source: 'ancient_sumer',
    target: 'assyrian_empire',
    type: 'ENABLED',
    label: 'Sumerian civilization provided the cultural and administrative template for later Assyrian empire',
    note: 'The Assyrians inherited Sumerian cuneiform, religious traditions, astronomical knowledge, and administrative practices. Sumerian cultural dominance outlasted Sumerian political power — the empire-builders of the ancient Near East built on Sumerian foundations.',
    confidence: 'medium'
  },
  {
    id: 'ancient_sumer__neo_babylonian_empire',
    source: 'ancient_sumer',
    target: 'neo_babylonian_empire',
    type: 'ENABLED',
    label: 'Sumer\'s urban and legal traditions provided the cultural substrate of Neo-Babylonian civilization',
    note: 'Neo-Babylonian culture drew heavily on the Sumerian heritage: cuneiform script, religious mythology, astronomical tradition, and legal frameworks. The Babylonians consciously revived ancient Sumerian cultural forms as markers of legitimacy.',
    confidence: 'medium'
  },
  {
    id: 'assyrian_empire__neo_babylonian_empire',
    source: 'assyrian_empire',
    target: 'neo_babylonian_empire',
    type: 'ENABLED',
    label: 'The collapse of Assyria created the geopolitical vacuum filled by Neo-Babylonian dominance',
    note: 'The Neo-Babylonian Empire arose through a coalition that destroyed Assyria. Babylon inherited Assyrian administrative infrastructure, diplomatic networks, and tributary relationships — the Neo-Babylonian empire was in part the successor state of the Assyrian empire.',
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
