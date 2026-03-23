#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const nodesPath = path.join(__dirname, '../data/nodes.json');
const edgesPath = path.join(__dirname, '../data/edges.json');
const nodes = JSON.parse(fs.readFileSync(nodesPath));
const edges = JSON.parse(fs.readFileSync(edgesPath));

// ── Nubians / Kingdom of Kush Nodes ──────────────────────────────────────────
const newNodes = [
  {
    id: 'kingdom_of_kush',
    label: 'Kingdom of Kush',
    node_type: 'reference',
    category: 'institution',
    wikipedia: 'https://en.wikipedia.org/wiki/Kingdom_of_Kush',
    summary: 'A major ancient kingdom centered in what is now northern Sudan, existing from approximately 2500 BCE to 350 CE. Kush was Egypt\'s neighbor and rival to the south, alternately trading with, warring against, and dominating Egypt. During the 25th Dynasty (c. 744–656 BCE), Nubian kings conquered and ruled Egypt — making Kush one of the few African kingdoms to rule Egypt. Kush developed its own writing system (Meroitic), produced iron, traded in gold and ivory, and built hundreds of pyramids. The Kingdom of Kush demonstrates the sophisticated political and cultural achievement of sub-Saharan African civilization independent of Egyptian influence, as well as in dynamic exchange with it.',
    decade: '2500s BCE–350s CE',
    tags: ['nubia', 'sudan', 'africa', 'kingdom', 'ancient', 'egypt', 'sub-saharan']
  },
  {
    id: 'nubian_pharaohs',
    label: 'Nubian Pharaohs (25th Dynasty)',
    node_type: 'reference',
    category: 'event',
    wikipedia: 'https://en.wikipedia.org/wiki/Twenty-fifth_Dynasty_of_Egypt',
    summary: 'The period from approximately 744 to 656 BCE when Kushite kings from Nubia conquered and ruled Egypt as pharaohs of the 25th Dynasty. The Nubian pharaohs — Piankhy, Shabaka, Shebitku, Taharqa, and Tantamani — presented themselves as restorers of Egyptian tradition, reviving ancient religious practices, rebuilding temples, and adopting hieroglyphic titulary. Taharqa (the "Tirhakah" of the Bible) led Egypt\'s resistance to Assyrian invasion. The Nubian pharaohs were eventually expelled by Assyrian forces but continued to rule in Kush. Their reign demonstrates that "Egypt" was not an exclusively northeastern African identity — sub-Saharan African rulers legitimately claimed and exercised pharaonic authority.',
    decade: '750s BCE–650s BCE',
    tags: ['nubia', 'egypt', 'pharaoh', 'africa', '25th-dynasty', 'kush', 'ancient']
  },
  {
    id: 'meroe',
    label: 'Kingdom of Meroe',
    node_type: 'reference',
    category: 'institution',
    wikipedia: 'https://en.wikipedia.org/wiki/Meroe',
    summary: 'The successor state to the Kingdom of Kush, centered at the city of Meroe (modern Sudan) from approximately 300 BCE to 350 CE. Meroe developed a distinct civilization after the Kushite capital shifted south from Napata: it had its own writing system (Meroitic, still only partially deciphered), significant iron production, a distinctive pyramid-building tradition, and trade networks reaching across sub-Saharan Africa and the Roman world. The Meroitic kingdom was ruled by queens (Kandakes) who played prominent political roles — including Amanirenas, who fought Roman forces to a negotiated peace under Augustus. Meroe represents African urban civilization that developed independently of direct Egyptian rule.',
    decade: '300s BCE–350s CE',
    tags: ['nubia', 'sudan', 'africa', 'kingdom', 'meroe', 'meroitic', 'ancient']
  },
  {
    id: 'kerma',
    label: 'Kingdom of Kerma',
    node_type: 'reference',
    category: 'institution',
    wikipedia: 'https://en.wikipedia.org/wiki/Kerma_culture',
    summary: 'One of the earliest urban civilizations in sub-Saharan Africa, centered at Kerma (modern Sudan) from approximately 2500 to 1500 BCE. Kerma was Egypt\'s primary southern rival during much of the Middle Kingdom and Second Intermediate Period. The Kerma culture developed large mud-brick buildings (deffufas), elaborate burial practices (including human sacrifice in royal burials), and significant trade in gold, ivory, cattle, and slaves. At the height of its power, Kerma allied with the Hyksos (rulers of northern Egypt) against Egyptian pharaohs. Kerma was eventually conquered and absorbed by Egyptian New Kingdom expansion around 1500 BCE, becoming the foundation for the later Kingdom of Kush.',
    decade: '2500s BCE–1500s BCE',
    tags: ['nubia', 'sudan', 'africa', 'kingdom', 'ancient', 'pre-kush', 'urban']
  },
  {
    id: 'nubian_trade',
    label: 'Nubian Trade Networks',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Ancient_Nubia',
    summary: 'The extensive trade networks maintained by Nubian kingdoms connecting sub-Saharan Africa with Egypt and the Mediterranean world. Nubia (the "land of gold") was Egypt\'s primary source of gold, ivory, ebony, ostrich feathers, and enslaved people throughout antiquity. In return, Nubia received Egyptian manufactured goods, prestige items, and cultural influence. Nubian trade routes extended south into the African interior and north to the Mediterranean. The control of these trade routes was a central motivation for Egyptian military campaigns into Nubia and for Nubian expansion into Egypt. Nubian commerce helped integrate African interior economies into the ancient Mediterranean world\'s trade system.',
    decade: '2500s BCE–350s CE',
    tags: ['nubia', 'trade', 'africa', 'gold', 'ivory', 'ancient', 'commerce']
  }
];

// ── Nubian Edges ──────────────────────────────────────────────────────────────
const newEdges = [
  {
    id: 'kingdom_of_kush__nubian_pharaohs',
    source: 'kingdom_of_kush',
    target: 'nubian_pharaohs',
    type: 'PRODUCED',
    label: 'The Kingdom of Kush produced the Nubian pharaohs who conquered and ruled Egypt',
    note: 'The 25th Dynasty Nubian pharaohs emerged from the Kushite state centered at Napata. Kush\'s political and military capacity — built over centuries — enabled the conquest of Egypt.',
    confidence: 'high'
  },
  {
    id: 'kingdom_of_kush__meroe',
    source: 'kingdom_of_kush',
    target: 'meroe',
    type: 'FRAGMENTED_INTO',
    label: 'The Kingdom of Kush fragmented into the successor state of Meroe after Assyrian pressure',
    note: 'After Assyrian forces expelled the Nubian pharaohs from Egypt and pushed into Kush, the Kushite state gradually shifted its capital south from Napata to Meroe, developing into a distinct Meroitic civilization.',
    confidence: 'high'
  },
  {
    id: 'kerma__kingdom_of_kush',
    source: 'kerma',
    target: 'kingdom_of_kush',
    type: 'CAUSED',
    label: 'Kerma culture was the direct cultural and political precursor of the Kingdom of Kush',
    note: 'The Kingdom of Kush developed on the cultural foundation of Kerma — same geographic area, similar burial traditions, and continuity of population. Egyptian conquest of Kerma around 1500 BCE created the conditions for the later Kushite state at Napata.',
    confidence: 'high'
  },
  {
    id: 'nubian_pharaohs__ancient_egypt',
    source: 'nubian_pharaohs',
    target: 'ancient_egypt',
    type: 'ENABLED',
    label: 'Nubian pharaohs\' rule of Egypt demonstrates that Egyptian civilization was shaped by sub-Saharan African rulers',
    note: 'The 25th Dynasty Nubian pharaohs did not merely conquer Egypt — they presented themselves as restorers of authentic Egyptian tradition, reviving ancient religious practices and building programs. Their rule demonstrates the African character of Egyptian civilization.',
    confidence: 'high'
  },
  {
    id: 'ancient_egypt__kingdom_of_kush',
    source: 'ancient_egypt',
    target: 'kingdom_of_kush',
    type: 'COLONIZED',
    label: 'Egypt colonized and periodically dominated Nubia over three millennia',
    note: 'Egyptian imperial expansion southward — especially during the New Kingdom — subjected Nubia to Egyptian colonial administration, cultural impositions, and extraction of gold and enslaved people. The Egyptian term "wretched Kush" appears in imperial propaganda. Periods of Egyptian domination alternated with Nubian independence and eventual Nubian domination of Egypt.',
    confidence: 'high'
  },
  {
    id: 'nubian_trade__ancient_egypt',
    source: 'nubian_trade',
    target: 'ancient_egypt',
    type: 'ENABLED',
    label: 'Nubian trade networks in gold and ivory enabled Egyptian economic and imperial power',
    note: 'Egyptian access to Nubian gold was central to Egyptian wealth, diplomacy, and military capacity. Egypt funded alliances, paid armies, and built temples with Nubian gold. The desire to control Nubian trade was a primary driver of Egyptian military campaigns southward.',
    confidence: 'high'
  },
  {
    id: 'meroe__nubian_trade',
    source: 'meroe',
    target: 'nubian_trade',
    type: 'PRODUCED',
    label: 'Meroe\'s iron production and position between the African interior and the Roman world produced extensive trade',
    note: 'Meroe became a major iron-producing center, trading manufactured goods across sub-Saharan Africa. Its position on the Nile gave it access to both Mediterranean Roman trade and African interior trade routes.',
    confidence: 'high'
  },
  {
    id: 'kingdom_of_kush__nubian_trade',
    source: 'kingdom_of_kush',
    target: 'nubian_trade',
    type: 'ENABLED',
    label: 'The Kingdom of Kush maintained and extended Nubian trade networks across sub-Saharan Africa',
    note: 'Kush\'s political stability and military capacity enabled the trade networks that connected the African interior to Mediterranean markets. The kingdom\'s wealth derived substantially from controlling these trade routes.',
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
