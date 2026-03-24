#!/usr/bin/env node
// add_pol_hist_edges_4.js
// - Fix jesuit_order duplicate (remove from politics, keep in history)
// - Add cross-scope mechanism edges for remaining unconnected politics + history nodes
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

// ── 1. Fix jesuit_order duplicate ─────────────────────────────────────────────
const polNodes = JSON.parse(fs.readFileSync(D('data/global/politics/nodes.json')));
const polEdges = JSON.parse(fs.readFileSync(D('data/global/history/edges.json'))); // history owns it

// Remove jesuit_order from politics/nodes.json
const polNodesBefore = polNodes.length;
const polNodesFixed = polNodes.filter(n => n.id !== 'jesuit_order');
fs.writeFileSync(D('data/global/politics/nodes.json'), JSON.stringify(polNodesFixed, null, 2));
console.log(`politics/nodes.json: removed ${polNodesBefore - polNodesFixed.length} duplicate (jesuit_order)`);

// Remove duplicate jesuit_order__council_of_trent edge from politics/edges.json
const polEdgesRaw = JSON.parse(fs.readFileSync(D('data/global/politics/edges.json')));
const polEdgesFixed = polEdgesRaw.filter(e => e.id !== 'jesuit_order__council_of_trent');
fs.writeFileSync(D('data/global/politics/edges.json'), JSON.stringify(polEdgesFixed, null, 2));
console.log(`politics/edges.json: removed ${polEdgesRaw.length - polEdgesFixed.length} duplicate edge`);

// ── 2. Add cross-scope mechanism edges ────────────────────────────────────────
const mechEdges = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const existing = new Set(mechEdges.map(e => e.id));

const batch = [
  // ── Politics: remaining 7 unconnected (jesuit_order now in history) ────────
  { id: 'papal_authority__papal_swiss_guard',
    source: 'papal_authority', target: 'papal_swiss_guard', type: 'ENABLED',
    label: 'The Swiss Guard embodies the Papacy\'s need for loyal, non-Italian armed protection',
    note: 'Founded 1506 by Julius II, the Swiss Guard institutionalized the papal authority paradox: the bishop of Rome requires a standing mercenary army to assert temporal power. The guard\'s persistence reflects the ongoing entanglement of spiritual and military authority at the papal throne.',
    confidence: 'high' },

  { id: 'in_group_out_group_dynamics__winged_hussars',
    source: 'in_group_out_group_dynamics', target: 'winged_hussars', type: 'ENABLED',
    label: 'Polish Winged Hussars embodied the noble warrior in-group as civilization\'s shield',
    note: 'The Winged Hussars (16th–18th c.) were a product of Polish noble (szlachta) in-group identity: the winged armor was theatrical self-presentation as Christian Europe\'s defender against Ottoman and Cossack out-groups. The Battle of Vienna (1683) relief is the paradigm case of in-group/out-group dynamics driving military mobilization.',
    confidence: 'high' },

  { id: 'cultural_hegemony__abbasid_caliphate',
    source: 'cultural_hegemony', target: 'abbasid_caliphate', type: 'ENABLED',
    label: 'The Abbasid Caliphate established Arabic-Islamic cultural hegemony as the global knowledge center',
    note: 'The Abbasid Golden Age (750–1258 CE) produced a cultural hegemony that extended far beyond military reach: Baghdad\'s House of Wisdom translated Greek, Persian, and Indian texts, making Arabic the language of mathematics, astronomy, and medicine. The intellectual prestige of Islamic civilization constituted cultural hegemony over much of the known world.',
    confidence: 'high' },

  { id: 'in_group_out_group_dynamics__fatimid_caliphate',
    source: 'in_group_out_group_dynamics', target: 'fatimid_caliphate', type: 'ENABLED',
    label: 'The Fatimid Caliphate institutionalized Shia/Sunni in-group/out-group in state form',
    note: 'The Fatimid Caliphate (909–1171) was the primary institutionalization of Shia political authority, ruling from North Africa and controlling Egypt. Their existence as a rival caliphate to the Abbasid Sunni order crystallized the Shia/Sunni in-group/out-group divide into competing imperial projects — a structure that persists in Saudi-Iranian rivalry.',
    confidence: 'high' },

  { id: 'structural_violence__assyrian_empire',
    source: 'structural_violence', target: 'assyrian_empire', type: 'ENABLED',
    label: 'The Assyrian Empire pioneered systematic population deportation as structural violence',
    note: 'The Neo-Assyrian Empire (911–609 BCE) institutionalized mass deportation — displacing conquered populations to break ethnic cohesion and prevent rebellion. Estimates suggest 4–5 million people were forcibly relocated. This was structural violence built into imperial administration: conquest followed by systematic destruction of the conquered people\'s social fabric.',
    confidence: 'high' },

  { id: 'structural_violence__egyptian_pharaoh',
    source: 'structural_violence', target: 'egyptian_pharaoh', type: 'ENABLED',
    label: 'The pharaonic system embedded structural violence in divine-king theology',
    note: 'The Egyptian pharaonic institution embedded structural violence in theology: the pharaoh as living god (Horus incarnate) justified a taxation and corvée labor system that extracted surplus from peasant farmers to build monumental architecture. The divine legitimation of extraction — the pyramid as religious object requiring forced labor — is the ancient world\'s clearest example of structural violence sacralized.',
    confidence: 'high' },

  { id: 'nubian_trade__kerma',
    source: 'nubian_trade', target: 'kerma', type: 'ENABLED',
    label: 'The Kingdom of Kerma was the first state built on Nubian trade network control',
    note: 'The Kingdom of Kerma (c. 2500–1500 BCE) was the earliest sub-Saharan African state, built on control of the Nile trade corridor between sub-Saharan Africa and Egypt: gold, ivory, ebony, and enslaved people. Kerma\'s existence as a peer-competitor to Middle Kingdom Egypt demonstrates that the Nubian trade network was sufficiently valuable to support independent state formation.',
    confidence: 'high' },

  { id: 'church_state_entanglement__jesuit_order',
    source: 'church_state_entanglement', target: 'jesuit_order', type: 'ENABLED',
    label: 'The Jesuits\' suppression and restoration epitomize church-state entanglement',
    note: 'The Jesuits were suppressed (1773) when European monarchs pressured Pope Clement XIV — state power overriding church internal governance. Their restoration (1814) followed Napoleon\'s defeat. The cycle of Jesuit suppression/restoration is the clearest case of church-state entanglement dynamics: secular rulers manipulating papal authority for political ends, and papal authority reasserting itself when secular power recedes.',
    confidence: 'high' },

  // ── History: remaining 35 unconnected nodes ───────────────────────────────
  { id: 'structural_violence__sack_of_rome_1527',
    source: 'structural_violence', target: 'sack_of_rome_1527', type: 'CAUSED',
    label: 'The Sack of Rome demonstrated that structural violence could destroy the papal cultural center',
    note: 'The Sack of Rome (1527) by Charles V\'s mutinous army devastated the Renaissance papacy and ended the High Renaissance. It exposed the structural vulnerability of the papacy as a temporal power dependent on mercenary armies. The sack was structural violence from below: unpaid soldiers turned against the system employing them, destroying the cultural hegemony center of Catholic Europe.',
    confidence: 'high' },

  { id: 'manufactured_consent__d_day_normandy',
    source: 'manufactured_consent', target: 'd_day_normandy', type: 'ENABLED',
    label: 'D-Day was the most extensively managed public information event of WWII',
    note: 'The Normandy landings required the most sophisticated Allied information management of the war: Operation Bodyguard (the deception campaign keeping Germany believing Pas-de-Calais was the target), strict press censorship, and staged photo releases to shape domestic opinion. Eisenhower\'s post-battle communiqué was carefully crafted to maximize morale effect. D-Day as manufactured consent: the military event simultaneously required and produced public narrative control.',
    confidence: 'high' },

  { id: 'in_group_out_group_dynamics__battle_of_marathon',
    source: 'in_group_out_group_dynamics', target: 'battle_of_marathon', type: 'CAUSED',
    label: 'Marathon crystallized the Greek/barbarian civilizational in-group/out-group divide',
    note: 'The Battle of Marathon (490 BCE) produced the Greek/barbarian (barbaros — those who speak gibberish) civilizational dichotomy in its lasting form. The Athenian hoplite victory against the Persian force — outnumbered, fighting for freedom against despotism in Greek propaganda — became the foundational in-group/out-group narrative: democratic citizen-soldier vs. servile despot\'s army.',
    confidence: 'high' },

  { id: 'collective_trauma__battle_of_thermopylae',
    source: 'collective_trauma', target: 'battle_of_thermopylae', type: 'PRODUCED',
    label: 'Thermopylae became the paradigm case of heroic collective sacrifice transmitted as trauma',
    note: 'The Battle of Thermopylae (480 BCE) produced a Spartan and pan-Greek collective trauma narrative: 300 Spartans (plus 700 Thespians and others, omitted from the legend) sacrificed against Persian invasion. The trauma transmission — "go tell the Spartans" — became the template for heroic last-stand collective memory across Western culture, from Marathon to Little Bighorn to the Alamo.',
    confidence: 'high' },

  { id: 'structural_violence__battle_of_agincourt',
    source: 'structural_violence', target: 'battle_of_agincourt', type: 'ENABLED',
    label: 'Agincourt\'s massacre of prisoners exemplifies structural violence in medieval warfare',
    note: 'At Agincourt (1415), Henry V ordered the massacre of French prisoners — an act that violated the chivalric code and constituted structural violence through the deliberate targeting of non-combatants (surrendered prisoners). The legal and moral controversy persists. Agincourt also demonstrated how structural violence is embedded in feudal military institutions: peasant longbowmen systematically killing noble prisoners who might otherwise be ransomed.',
    confidence: 'high' },

  { id: 'hegelian_dialectic__battle_of_waterloo',
    source: 'hegelian_dialectic', target: 'battle_of_waterloo', type: 'ENABLED',
    label: 'Waterloo exemplifies the Hegelian dialectic: Napoleon as thesis, coalition as antithesis, Vienna order as synthesis',
    note: 'Waterloo (1815) was the decisive moment in the Hegelian dialectic of the French Revolutionary era: Napoleon\'s imperial thesis (spreading Revolutionary principles by force) met the coalition antithesis, producing the synthesis of the Congress of Vienna — a conservative European order that incorporated some Revolutionary ideas (nationalism, constitutionalism) while suppressing others (democracy, republicanism).',
    confidence: 'medium' },

  { id: 'cultural_hegemony__persian_achaemenid_empire',
    source: 'cultural_hegemony', target: 'persian_achaemenid_empire', type: 'ENABLED',
    label: 'The Achaemenid Persian Empire established the first multi-ethnic administrative cultural hegemony',
    note: 'The Achaemenid Persian Empire (550–330 BCE) pioneered multi-ethnic administrative hegemony: Cyrus\'s cylinder, the Royal Road, Aramaic as administrative lingua franca, and tolerance of local religious practices (Cyrus restored the Jews to Jerusalem). This was cultural hegemony through administrative inclusion — the empire\'s stability rested on incorporating rather than destroying subject cultures.',
    confidence: 'high' },

  { id: 'collective_trauma__maccabean_revolt',
    source: 'collective_trauma', target: 'maccabean_revolt', type: 'PRODUCED',
    label: 'The Maccabean Revolt produced the collective trauma of Hellenistic cultural erasure',
    note: 'The Maccabean Revolt (167–160 BCE) was a response to Antiochus IV\'s forced Hellenization — the systematic cultural erasure of Jewish practice (circumcision, Torah, Sabbath banned; Temple converted to Zeus worship). The collective trauma of this attempted religious genocide produced the Hanukkah narrative and the Maccabean martyrology that became templates for Jewish resistance identity.',
    confidence: 'high' },

  { id: 'historical_revisionism__byzantine_empire',
    source: 'historical_revisionism', target: 'byzantine_empire', type: 'ENABLED',
    label: 'The Byzantine Empire\'s self-presentation as Rome\'s legitimate continuation is paradigmatic historical revisionism',
    note: 'The Byzantines called themselves Romans (Romaioi) until 1453 — a 1,000-year exercise in historical revisionism that maintained the fiction of continuous Roman legitimacy while ruling a Greek-speaking, Christian empire utterly different from Rome. The term "Byzantine Empire" is itself a modern historians\' construction; the Byzantines would have found it incomprehensible. This revisionism structured both their self-image and their claims to political authority.',
    confidence: 'high' },

  { id: 'in_group_out_group_dynamics__sassanid_persian_empire',
    source: 'in_group_out_group_dynamics', target: 'sassanid_persian_empire', type: 'ENABLED',
    label: 'The Sassanid Empire institutionalized Zoroastrian in-group identity against Roman Christianity',
    note: 'The Sassanid Persian Empire (224–651 CE) hardened Zoroastrianism as state religion partly to differentiate the Persian in-group from Roman/Byzantine Christian identity. The Byzantine-Sassanid wars (over 400 years of periodic conflict) were structured by this religious in-group/out-group binary. The mutual exhaustion from these wars enabled the rapid Islamic conquest of both empires.',
    confidence: 'high' },

  { id: 'structural_violence__byzantine_sassanid_wars',
    source: 'structural_violence', target: 'byzantine_sassanid_wars', type: 'CAUSED',
    label: 'Four centuries of Byzantine-Sassanid warfare institutionalized structural violence across the Near East',
    note: 'The Byzantine-Sassanid wars (502–628 CE) produced structural violence across the Levant, Mesopotamia, and Egypt: systematic depopulation of frontier zones, destruction of irrigation systems (Mesopotamia\'s agricultural base never fully recovered), and mass deportation of craftsmen and populations. The wars\' structural violence so depleted both empires that Arab Muslim armies of 7th-century conquests faced minimal resistance.',
    confidence: 'high' },

  { id: 'cultural_hegemony__seljuk_empire',
    source: 'cultural_hegemony', target: 'seljuk_empire', type: 'ENABLED',
    label: 'The Seljuk Turks adopted Abbasid cultural hegemony while displacing its political center',
    note: 'The Seljuk Empire (1037–1194) represents cultural hegemony adoption by conquerors: the Turkic Seljuks converted to Sunni Islam, adopted Persian administrative culture and language (Persian became the court language of Islamic civilization), and positioned themselves as protectors of the Abbasid caliphate they politically dominated. This pattern — conquerors adopting the cultural hegemony of the conquered — recurs throughout Islamic history.',
    confidence: 'high' },

  { id: 'collective_trauma__battle_of_manzikert',
    source: 'collective_trauma', target: 'battle_of_manzikert', type: 'PRODUCED',
    label: 'Manzikert produced the Byzantine collective trauma of catastrophic military defeat',
    note: 'The Battle of Manzikert (1071) — Byzantine Emperor Romanos IV captured by Seljuk Sultan Alp Arslan — produced the Byzantine collective trauma of Anatolian loss. The defeat opened Anatolia to Turkish settlement, ultimately transforming the heartland of Byzantine civilization into Turkey. The trauma of Manzikert is cited in Byzantine sources as a catastrophic turning point, initiating the appeal to Western Crusaders that eventually produced the Fourth Crusade\'s sack of Constantinople.',
    confidence: 'high' },

  { id: 'in_group_out_group_dynamics__destruction_of_holy_sepulchre',
    source: 'in_group_out_group_dynamics', target: 'destruction_of_holy_sepulchre', type: 'CAUSED',
    label: 'Al-Hakim\'s destruction of the Holy Sepulchre intensified Christian/Muslim in-group hostility',
    note: 'Caliph Al-Hakim bi-Amr Allah\'s 1009 destruction of the Church of the Holy Sepulchre — the holiest Christian site — was weaponized in European Christian propaganda as proof of Muslim in-group hostility. Pope Urban II cited it at Clermont (1095) as part of the justification for the First Crusade. The destruction exemplifies how single acts can become in-group/out-group narrative anchors that mobilize violence across generations.',
    confidence: 'high' },

  { id: 'manufactured_consent__council_of_clermont_1095',
    source: 'manufactured_consent', target: 'council_of_clermont_1095', type: 'ENABLED',
    label: 'Urban II\'s Clermont speech was history\'s first mass manufactured consent for holy war',
    note: 'Pope Urban II\'s 1095 Clermont speech (no verbatim record survives; we have five different versions) launched the First Crusade through manufactured consent: fabricated or exaggerated accounts of Muslim atrocities against pilgrims, the appeal to Christian in-group duty, the promise of plenary indulgence, and "Deus vult" as manufactured popular enthusiasm. The speech is the template for manufacturing popular consent for aggressive war through religious/ideological framing.',
    confidence: 'high' },

  { id: 'structural_violence__crusader_states',
    source: 'structural_violence', target: 'crusader_states', type: 'ENABLED',
    label: 'The Crusader States institutionalized structural violence through conquest-based settlement hierarchy',
    note: 'The Crusader States (1098–1291) institutionalized structural violence through a conquest hierarchy: Frankish lords held land worked by indigenous Christian, Muslim, and Jewish populations with different legal statuses. The dhimmi system was replaced by a Frankish feudal system with even less protection for the conquered. Latin settlers at the top, indigenous Christians in the middle, Muslims and Jews at the bottom — structural violence embedded in settlement architecture.',
    confidence: 'high' },

  { id: 'in_group_out_group_dynamics__saladin_reconquest',
    source: 'in_group_out_group_dynamics', target: 'saladin_reconquest', type: 'ENABLED',
    label: 'Saladin used the in-group unity of Islamic jihad to reconquer Jerusalem',
    note: 'Saladin\'s reconquest of Jerusalem (1187) required manufacturing Muslim in-group unity across the fractured Islamic world: he used the ideological tool of jihad against Christian crusaders to unite Sunni and previously hostile Muslim factions. The reconquest demonstrates in-group/out-group dynamics as political technology: defining the Christian crusader out-group created the Muslim in-group cohesion required for military success.',
    confidence: 'high' },

  { id: 'cultural_hegemony__ottoman_conquest_arab_lands',
    source: 'cultural_hegemony', target: 'ottoman_conquest_arab_lands', type: 'ENABLED',
    label: 'Ottoman conquest of Arab lands replaced Mamluk cultural hegemony with Turkish-Islamic synthesis',
    note: 'The Ottoman conquest of Syria, Egypt, and the Hejaz (1516–17) transferred cultural hegemony from the Arab-Persian Mamluk synthesis to a Turkish-Islamic imperial order. Selim I\'s assumption of the caliphal mantle (custodian of Mecca and Medina) was a claim to Islamic cultural hegemony. The Ottoman administration — Turkish military elite, Arab religious establishment, Greek commercial intermediaries — was a cultural hegemony management system.',
    confidence: 'high' },

  { id: 'socratic_method__pre_socratic_philosophy',
    source: 'socratic_method', target: 'pre_socratic_philosophy', type: 'ENABLED',
    label: 'Pre-Socratic natural philosophy created the epistemological tradition Socrates radicalized',
    note: 'Pre-Socratic philosophy (Thales, Anaximander, Heraclitus, Parmenides — c. 600–450 BCE) established the practice of seeking natural rather than supernatural explanations for phenomena. Socrates inherited this critical-rational tradition but turned it from natural philosophy to ethics and epistemology. The Socratic method\'s demand for rigorous definition is the intensification of the pre-Socratic commitment to rational inquiry over mythological authority.',
    confidence: 'high' },

  { id: 'utilitarianism__epicureanism',
    source: 'utilitarianism', target: 'epicureanism', type: 'SHARES MECHANISM',
    label: 'Epicureanism is the ancient precursor to utilitarian pleasure/pain calculus',
    note: 'Epicurus\'s philosophy (341–270 BCE) — that the good life is the maximization of pleasure (ataraxia — tranquility) and minimization of pain — is the ancient structural precursor to Bentham\'s utilitarian calculus. Both are hedonistic consequentialist frameworks. The key difference: Epicurus\'s "pleasure" was the absence of pain (aponia/ataraxia), not the maximization of positive pleasure — a proto-negative-utilitarian position.',
    confidence: 'high' },

  { id: 'platonic_idealism__hellenistic_philosophy',
    source: 'platonic_idealism', target: 'hellenistic_philosophy', type: 'ENABLED',
    label: 'Hellenistic philosophy developed by synthesizing and reacting to Platonic idealism',
    note: 'Hellenistic philosophy (Stoicism, Epicureanism, Skepticism, Neoplatonism) developed in dialogue with and reaction to Platonic idealism. The Stoics accepted the Platonic rational order but materialized it (logos as physical force); the Skeptics attacked Platonic certainty; Neoplatonism radicalized Platonic idealism into mystical monism. Hellenistic philosophy is the ecosystem that emerges when Plato\'s Academy meets Alexander\'s cosmopolitan world.',
    confidence: 'high' },

  { id: 'dependent_origination__chan_zen_buddhism',
    source: 'dependent_origination', target: 'chan_zen_buddhism', type: 'ENABLED',
    label: 'Chan/Zen Buddhism radicalized dependent origination into immediate experiential practice',
    note: 'Chan/Zen Buddhism (c. 6th century CE China, entering Japan as Zen in 12th century) radicalized the Buddhist doctrine of dependent origination — that nothing exists independently — into a meditation practice: koans (paradoxical questions) are designed to break the meditator\'s habitual assumption of a fixed, independent self. The sudden enlightenment (satori) is the direct experiential realization of dependent origination.',
    confidence: 'high' },

  { id: 'cultural_hegemony__buddhist_spread_east_asia',
    source: 'cultural_hegemony', target: 'buddhist_spread_east_asia', type: 'ENABLED',
    label: 'Buddhism\'s spread across East Asia was the largest pre-modern cultural hegemony transmission',
    note: 'Buddhism\'s transmission from India through Central Asia to China (1st century CE), Korea (4th century), Japan (6th century), and Tibet (7th century) was the largest pre-modern voluntary cultural hegemony adoption. Recipient cultures adopted not just religious practice but Sanskrit vocabulary, Indian art forms, monastic institutions, and cosmological frameworks. The spread demonstrates cultural hegemony operating through prestige and institutional adoption rather than military conquest.',
    confidence: 'high' },

  { id: 'church_state_entanglement__nicene_creed',
    source: 'church_state_entanglement', target: 'nicene_creed', type: 'PRODUCED',
    label: 'The Council of Nicaea exemplifies church-state entanglement: Constantine dictated theological consensus',
    note: 'The Council of Nicaea (325 CE) and the resulting Nicene Creed were produced by Constantine\'s intervention in a theological dispute for political reasons: Arianism (Christ as subordinate to God) vs. Trinitarianism. Constantine presided over the council (a layman dictating to bishops), coerced consensus, and exiled dissenters — state power determining theological truth. The Nicene Creed is church-state entanglement institutionalized as doctrine.',
    confidence: 'high' },

  { id: 'structural_violence__monasticism',
    source: 'structural_violence', target: 'monasticism', type: 'ENABLED',
    label: 'Medieval monasticism produced structural violence through enclosure and labor extraction',
    note: 'Christian monasticism (Desert Fathers → Benedictine Rule → Cistercians) institutionalized structural violence through enclosure: monasteries required vows of poverty, chastity, and obedience that removed individuals from civil society and placed them under abbatial authority with no legal recourse. Women\'s monasticism was particularly coercive — families placed daughters in convents to manage property and status. The monastery as total institution.',
    confidence: 'medium' },

  { id: 'cultural_hegemony__christian_sacred_art',
    source: 'cultural_hegemony', target: 'christian_sacred_art', type: 'ENABLED',
    label: 'Christian sacred art was the primary medium of cultural hegemony in pre-literate Europe',
    note: 'Christian sacred art (icons, frescoes, illuminated manuscripts, cathedral programs) was the dominant cultural hegemony medium in pre-literate medieval Europe: the theological narrative embedded in the Chartres cathedral windows or the Sistine Chapel was accessible to illiterates and literates alike. The Church\'s monopoly on artistic patronage meant cultural hegemony transmission was inseparable from aesthetic experience.',
    confidence: 'high' },

  { id: 'cultural_hegemony__gothic_architecture',
    source: 'cultural_hegemony', target: 'gothic_architecture', type: 'ENABLED',
    label: 'Gothic architecture was cultural hegemony made stone: the Church civilizing program in built form',
    note: 'Gothic architecture (12th–16th century) was a systematic cultural hegemony project: the Gothic cathedral (Chartres, Notre-Dame, Cologne) expressed Church intellectual and spiritual authority through engineering innovation (flying buttresses, pointed arches enabling height and light). The cathedral as the tallest building in every medieval city was a built assertion of ecclesiastical cultural hegemony over secular power — until bell towers and then skyscrapers ended the competition.',
    confidence: 'high' },

  { id: 'papal_authority__council_of_trent',
    source: 'papal_authority', target: 'council_of_trent', type: 'ENABLED',
    label: 'The Council of Trent reasserted and centralized papal authority against Protestant reform',
    note: 'The Council of Trent (1545–1563) was the Counter-Reformation\'s reassertion of papal authority: it rejected Protestant sola scriptura by reaffirming Tradition alongside Scripture, rejected vernacular Bibles, and centralized doctrinal authority in Rome. Trent also centralized priest formation through seminaries — the papal authority machine now controlling not just doctrine but the training pipeline.',
    confidence: 'high' },

  { id: 'religious_trauma__gnostic_christianity',
    source: 'religious_trauma', target: 'gnostic_christianity', type: 'ENABLED',
    label: 'Gnostic Christianity emerged from the religious trauma of material world suffering',
    note: 'Gnostic Christianity (2nd–4th century CE) emerged partly as a response to the religious trauma of Roman persecution and the theodicy problem: if the creator God is good, why is the material world full of suffering? Gnostic dualism resolved this by making the material world the creation of an evil or ignorant demiurge, not the true God. The movement demonstrates how collective trauma (persecution, suffering) produces theological innovation.',
    confidence: 'medium' },

  { id: 'collective_trauma__neo_babylonian_empire',
    source: 'collective_trauma', target: 'neo_babylonian_empire', type: 'CAUSED',
    label: 'Neo-Babylonian destruction of Jerusalem produced the foundational Jewish collective trauma',
    note: 'Nebuchadnezzar II\'s destruction of Jerusalem (586 BCE) and Babylonian exile (597–539 BCE) produced the foundational Jewish collective trauma: the loss of Temple, monarchy, and land. This trauma was creative: the Babylonian exile produced the Torah\'s final redaction, the prophetic literature (Isaiah, Ezekiel, Jeremiah), and the theological innovations (theodicy, eschatology, monotheism hardening) that define post-exilic Judaism.',
    confidence: 'high' },

  { id: 'manufactured_consent__cleopatra',
    source: 'manufactured_consent', target: 'cleopatra', type: 'ENABLED',
    label: 'Cleopatra was history\'s first ruler to systematically manufacture divine-royal consent',
    note: 'Cleopatra VII (69–30 BCE) was a sophisticated manufactured consent operator: she presented herself as Isis incarnate to Egyptians, as Hellenistic queen to Greeks, and as political equal to Caesar and Antony in Roman contexts. Her famous entrance to Antony on the Cydnus (dressed as Venus/Aphrodite) was calculated theatrical manufactured consent — political theater as governance tool. The Roman propaganda against her (Octavian\'s campaign depicting her as Eastern seductress) demonstrates manufactured consent in counter-narrative form.',
    confidence: 'high' },

  { id: 'in_group_out_group_dynamics__nubian_pharaohs',
    source: 'in_group_out_group_dynamics', target: 'nubian_pharaohs', type: 'ENABLED',
    label: 'The Nubian 25th Dynasty inversion of Egyptian ethnic hierarchy reveals in-group/out-group constructed nature',
    note: 'The Nubian 25th Dynasty (747–656 BCE) — Kushite pharaohs ruling Egypt — is an in-group/out-group inversion: the traditional out-group (Nubian/Kushite, historically depicted as subjugated in Egyptian art) became the ruling in-group, adopting and in some cases more strictly enforcing Egyptian religious and artistic conventions than native Egyptians. The Nubians\' enthusiastic Egyptianization demonstrates that in-group identity is performed and constructed, not essential.',
    confidence: 'high' },

  { id: 'structural_violence__peloponnesian_war',
    source: 'structural_violence', target: 'peloponnesian_war', type: 'CAUSED',
    label: 'The Peloponnesian War produced structural violence through the Athenian empire\'s tributary system',
    note: 'The Peloponnesian War (431–404 BCE) emerged from the structural violence embedded in the Delian League: Athens converted an alliance of free city-states into a tributary empire, moving the treasury from Delos to Athens and using allies\' tribute to build the Parthenon. The war was the out-group (Sparta, Corinth, Thebes) response to Athenian structural violence. The Melian Dialogue — "the strong do what they can, the weak suffer what they must" — is structural violence stated as law.',
    confidence: 'high' },

  { id: 'in_group_out_group_dynamics__olympic_games_ancient',
    source: 'in_group_out_group_dynamics', target: 'olympic_games_ancient', type: 'ENABLED',
    label: 'The Ancient Olympics defined the Greek in-group through athletic competition and excluded out-groups',
    note: 'The Ancient Olympic Games (776 BCE – 393 CE) were both athletic competition and Greek in-group definition ritual: only free Greek men could compete (excluding women, enslaved persons, and barbarians). The games created a pan-Greek in-group across political divisions — the Olympic truce suspended wars. Non-Greeks wanting status adopted Greek games (Nero competing, Herod of Judea funding). Athletic achievement as in-group admission currency.',
    confidence: 'high' },
];

let added = 0;
for (const e of batch) {
  if (!existing.has(e.id)) { mechEdges.push(e); existing.add(e.id); added++; }
}
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(mechEdges, null, 2));
console.log('Added:', added, '| Total mech edges:', mechEdges.length);

// ── 3. Integrity check ────────────────────────────────────────────────────────
const allIds = new Set();
const scopes = ['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'];
for (const s of scopes) JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id));
let orphans = 0;
for (const e of mechEdges) {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
}
console.log('Orphans:', orphans);
