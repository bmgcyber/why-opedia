#!/usr/bin/env node
// add_hist_enrichment2.js — add edges for all low-connectivity history nodes
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const he = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const exIds = new Set(he.map(e => e.id));

const batch = [
  // ── julius_caesar ──────────────────────────────────────────────────────────
  { id: 'cleopatra__julius_caesar',
    source: 'cleopatra', target: 'julius_caesar', type: 'ENABLED',
    label: 'Cleopatra enlisted Caesar\'s military power to reclaim the Egyptian throne from her brother',
    note: 'In 48 BCE, Cleopatra smuggled herself to Caesar in Alexandria and enlisted his support against her co-ruler brother Ptolemy XIII. Caesar\'s military intervention restored Cleopatra to the throne, beginning a political-romantic alliance that produced a son (Caesarion) and shaped Roman-Egyptian relations for a decade. Cleopatra\'s alliance with Caesar — and later Antony — was a deliberate geopolitical strategy using personal diplomacy to preserve Egyptian sovereignty against Roman annexation.',
    confidence: 'high' },
  { id: 'julius_caesar__roman_empire',
    source: 'julius_caesar', target: 'roman_empire', type: 'PRODUCED',
    label: 'Caesar\'s dictatorship was the transitional mechanism that converted the Roman Republic into what became the Empire',
    note: 'Julius Caesar\'s decade-long accumulation of power — military command, dictatorship, divine honors — created the template Octavian used to found the Principate. Caesar\'s crossing of the Rubicon (49 BCE), declaration as dictator perpetuo (44 BCE), and assassination demonstrated that the Republic\'s constitutional machinery could no longer contain military commanders with popular support and loyal armies. Augustus Caesar\'s genius was perfecting what Julius Caesar demonstrated: that Rome could be ruled autocratically while maintaining Republican forms.',
    confidence: 'high' },

  // ── congress_of_vienna ────────────────────────────────────────────────────
  { id: 'french_revolution__congress_of_vienna',
    source: 'french_revolution', target: 'congress_of_vienna', type: 'PRODUCED',
    label: 'The Congress of Vienna was a direct conservative response to 25 years of French Revolutionary and Napoleonic upheaval',
    note: 'The Congress of Vienna (1814-15) was convened specifically to reverse and contain the consequences of the French Revolution: the delegitimization of hereditary monarchy, the spread of liberal constitutional ideas, and the disruption of Europe\'s dynastic balance of power. Metternich\'s system explicitly aimed to restore the pre-1789 order while acknowledging it could no longer be fully restored. The Vienna Settlement\'s fragility — it began unraveling within 15 years (1830 revolutions) — reflects how successfully the French Revolution had permanently shifted European political consciousness.',
    confidence: 'high' },
  { id: 'congress_of_vienna__world_war_i',
    source: 'congress_of_vienna', target: 'world_war_i', type: 'ENABLED',
    label: 'The Concert of Europe system the Vienna Congress built held for 99 years, then failed catastrophically in 1914',
    note: 'The Congress of Vienna\'s Concert of Europe — great-power coordination through regular congresses to manage European order — functioned remarkably well from 1815 to 1914, preventing a general European war for nearly a century. WWI was partly the failure of this system: the alliance structures Bismarck\'s system had managed became self-activating tripwires; Austria-Hungary\'s ultimatum to Serbia triggered automatic alliance mobilization the Concert system could not contain. WWI is what happens when the Vienna system breaks down without a replacement coordination mechanism.',
    confidence: 'high' },

  // ── hirohito ──────────────────────────────────────────────────────────────
  { id: 'hirohito__world_war_ii',
    source: 'hirohito', target: 'world_war_ii', type: 'ENABLED',
    label: 'Hirohito\'s sanctioning of Japanese military expansion and his silence during atrocities enabled WWII\'s Pacific theater',
    note: 'Hirohito\'s role in WWII remains contested: he sanctioned the invasions of China (1937), Southeast Asia (1941), and Pearl Harbor (1941), and was informed of — while not explicitly ordering — atrocities including the Nanjing Massacre. His decision NOT to stop the war until August 1945 (after two atomic bombs and Soviet declaration of war) prolonged WWII by potentially years. MacArthur\'s decision to retain Hirohito as a stabilizing force during occupation, while shielding him from war crimes prosecution, shaped how Japan processed its WWII guilt for generations.',
    confidence: 'high' },
  { id: 'world_war_ii__hirohito',
    source: 'world_war_ii', target: 'hirohito', type: 'PRODUCED',
    label: 'WWII\'s defeat transformed Hirohito from a divine sovereign to a constitutional figurehead, fundamentally restructuring Japanese identity',
    note: 'Japan\'s defeat in WWII transformed the Emperor\'s role from Shinto divine sovereign to constitutional figurehead — the most radical transformation of a head of state in 20th century history without regime change. Hirohito\'s August 15, 1945 radio broadcast (the first time Japanese citizens had heard his voice) announced surrender in language so archaic many couldn\'t understand it. MacArthur\'s retention of Hirohito — combined with the Occupation\'s new constitution renouncing war — created the peculiar postwar Japanese political settlement: democratic institutions atop a preserved imperial symbol.',
    confidence: 'high' },

  // ── arab_spring ───────────────────────────────────────────────────────────
  { id: 'arab_spring__isis_rise',
    source: 'arab_spring', target: 'isis_rise', type: 'ENABLED',
    label: 'The Arab Spring\'s collapse — especially Syria\'s civil war — created the power vacuum ISIS exploited',
    note: 'The Arab Spring\'s failure in Syria created the specific conditions ISIS required: Assad\'s brutal suppression of the 2011 uprising fragmented Syrian state authority; the subsequent civil war between Assad, FSA, Kurdish forces, and jihadist groups created ungoverned space across northeastern Syria and western Iraq. ISIS emerged from Al-Qaeda in Iraq (itself a product of the 2003 Iraq War), exploiting Syrian state collapse and Sunni grievances in post-Surge Iraq. Without the Arab Spring\'s failure, ISIS\'s territorial state-building would have been impossible.',
    confidence: 'high' },
  { id: 'gamal_nasser__arab_spring',
    source: 'gamal_nasser', target: 'arab_spring', type: 'SHARES_MECHANISM_WITH',
    label: 'Both Nasserism and the Arab Spring mobilized pan-Arab popular movements against authoritarian order with charismatic mass appeal',
    note: 'Gamal Nasser\'s Egypt (1956-1970) and the Arab Spring (2011) share the structural pattern of mass Arab political mobilization against authoritarian order: both drew on pan-Arab identity, both used mass media (Nasser used radio; Arab Spring used social media) to mobilize populations across national borders, and both ultimately failed to deliver the political transformation they promised. Nasser\'s Arab nationalism produced defeat in 1967; the Arab Spring produced authoritarianism (Egypt), failed states (Libya, Yemen, Syria), or minor reforms (Tunisia). Mass Arab mobilization has a consistent failure mode.',
    confidence: 'medium' },

  // ── korean_war ────────────────────────────────────────────────────────────
  { id: 'world_war_ii__korean_war',
    source: 'world_war_ii', target: 'korean_war', type: 'ENABLED',
    label: 'WWII\'s defeat of Japan and subsequent US-Soviet division of Korea at the 38th parallel directly created the conditions for the Korean War',
    note: 'The Korean War\'s origin is a direct WWII consequence: Japan\'s 1910-1945 occupation of Korea ended with its 1945 defeat, leaving a power vacuum the US and Soviet Union divided along the 38th parallel. The division created two client states — Syngman Rhee\'s US-backed South Korea and Kim Il-sung\'s Soviet-backed North Korea — both claiming legitimacy over the whole peninsula. When North Korea invaded in June 1950, it was completing the logic of Korea\'s artificial post-WWII division. Without WWII\'s peculiar endgame, there is no Korean War.',
    confidence: 'high' },
  { id: 'korean_war__chinese_cultural_revolution',
    source: 'korean_war', target: 'chinese_cultural_revolution', type: 'ENABLED',
    label: 'Korea reinforced Mao\'s siege mentality and anti-revisionist paranoia that drove the Cultural Revolution\'s radicalism',
    note: 'The Korean War (1950-53) shaped Mao\'s worldview in ways that contributed to the Cultural Revolution: China\'s entry into Korea (October 1950) to fight the US demonstrated that China faced constant imperialist threat; the conflict reinforced Mao\'s belief that "enemies" existed within as well as outside. Korean War anti-revisionist ideology — purging those who would compromise with imperialism — became Cultural Revolution logic. Mao\'s insistence that the Cultural Revolution was necessary to prevent China from following the Soviet "revisionist" path drew on the Korean War\'s anti-accommodation lessons.',
    confidence: 'medium' },

  // ── battle_of_gettysburg ──────────────────────────────────────────────────
  { id: 'battle_of_gettysburg__manifest_destiny',
    source: 'battle_of_gettysburg', target: 'manifest_destiny', type: 'ENABLED',
    label: 'Union victory at Gettysburg preserved the continental nation that pursued Manifest Destiny\'s westward expansion',
    note: 'Gettysburg\'s significance for Manifest Destiny is structural: Confederate victory at Gettysburg would likely have led to European recognition, Confederate independence, and the fragmentation of continental American expansion. The Union\'s preservation — secured at Gettysburg as the turning point — maintained the political entity that pursued westward expansion, the transcontinental railroad (1869), and systematic dispossession of Native nations. Gettysburg didn\'t just save the Union; it preserved the continental American state that drove Manifest Destiny to completion.',
    confidence: 'medium' },

  // ── watergate ─────────────────────────────────────────────────────────────
  { id: 'vietnam_war__watergate',
    source: 'vietnam_war', target: 'watergate', type: 'ENABLED',
    label: 'The Pentagon Papers theft and antiwar protest drove Nixon\'s paranoid security apparatus that produced Watergate',
    note: 'Watergate is causally connected to Vietnam: the Pentagon Papers\' leak (June 1971) drove Nixon to create the White House Plumbers to stop leaks — and the Plumbers\' first operation was the psychiatric records break-in targeting Daniel Ellsberg. The Plumbers were then redirected to the Watergate burglary. Vietnam protest culture created Nixon\'s enemies list; the antiwar movement\'s success in delegitimizing the war radicalized Nixon\'s defensive measures. Watergate is Vietnam\'s domestic political consequence — what a president who believes he\'s fighting for national survival does to political opponents.',
    confidence: 'high' },
  { id: 'watergate__mk_ultra',
    source: 'watergate', target: 'mk_ultra', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent executive branch secret programs using illegal means against citizens, revealed through congressional investigation',
    note: 'Watergate and MK-Ultra are products of the same executive branch culture of covert domestic operations: both used government resources for illegal operations against citizens; both were exposed through Senate investigations (Church Committee, 1975, revealed both Watergate\'s intelligence abuses and MK-Ultra simultaneously); both produced legislative reforms (FISA, ban on human experimentation, Intelligence Oversight Act). The Church Committee in 1975 was the direct response to the intelligence community abuses Watergate exposed — revealing that Watergate was the visible tip of a much deeper covert operations culture.',
    confidence: 'high' },

  // ── milgram_obedience_experiments ─────────────────────────────────────────
  { id: 'milgram_obedience_experiments__abu_ghraib',
    source: 'milgram_obedience_experiments', target: 'abu_ghraib', type: 'SHARES_MECHANISM_WITH',
    label: 'Abu Ghraib guards\' behavior reproduced Milgram\'s findings exactly: ordinary people follow authority orders to inflict suffering',
    note: 'The Abu Ghraib torture photographs (2004) generated immediate academic invocation of Milgram\'s experiments: the guards\' behavior — ordinary reservists inflicting humiliating torture on prisoners under superior officer authority — reproduced Milgram\'s laboratory findings in a real-world context. Philip Zimbardo, who ran the Stanford Prison Experiment, provided expert testimony at Abu Ghraib trials arguing that situational factors (not individual sadism) produced the guards\' behavior. Milgram\'s 1961 experiments, run to understand Nazi obedience, directly explained American military torture 43 years later.',
    confidence: 'high' },
  { id: 'milgram_obedience_experiments__nuremberg_trials',
    source: 'milgram_obedience_experiments', target: 'nuremberg_trials', type: 'SHARES_MECHANISM_WITH',
    label: 'Milgram designed his experiments to scientifically test the "just following orders" defense the Nuremberg defendants used',
    note: 'Milgram explicitly designed his obedience experiments to test the Nuremberg defense: Nazi defendants\' claim that they were "just following orders" was used at Nuremberg to argue diminished culpability. Milgram wanted to know whether ordinary Americans could be induced to follow orders to harm others — and found they could, at shocking rates. Milgram\'s findings problematize the Nuremberg precedent: if 65% of ordinary people will administer apparently lethal shocks under authority pressure, the "following orders" defense describes widespread human psychology, not Nazi exceptionalism. This created uncomfortable ethical and legal implications.',
    confidence: 'high' },

  // ── yom_kippur_war_1973 ───────────────────────────────────────────────────
  { id: 'yom_kippur_war_1973__oslo_accords',
    source: 'yom_kippur_war_1973', target: 'oslo_accords', type: 'ENABLED',
    label: 'Sadat\'s crossing of the Suez Canal in 1973 began the Egyptian-Israeli diplomatic trajectory that eventually produced Oslo',
    note: 'The Yom Kippur War (1973) directly enabled the Oslo peace process: Egypt\'s successful crossing of the Suez Canal restored Arab military credibility after the humiliation of 1967, allowing Sadat to negotiate peace from strength rather than defeat. The October War\'s outcome led directly to Sadat\'s 1977 Jerusalem visit, Camp David (1978), and Egyptian-Israeli peace (1979). This Egyptian-Israeli peace normalized diplomatic engagement between Israel and Arab states, creating the framework that eventually produced the Oslo Accords (1993) between Israel and the PLO.',
    confidence: 'high' },
  { id: 'yom_kippur_war_1973__iranian_revolution_1979',
    source: 'yom_kippur_war_1973', target: 'iranian_revolution_1979', type: 'ENABLED',
    label: 'The 1973 oil embargo enabled by the Yom Kippur War multiplied petrodollar wealth that funded Islamic revolutionary movements',
    note: 'The 1973 Arab oil embargo (OPEC\'s response to US support for Israel in the Yom Kippur War) quadrupled oil prices and transferred enormous wealth to Gulf states including Saudi Arabia and Iran. This petrodollar windfall funded the export of Wahhabi Islam from Saudi Arabia and strengthened the Shah\'s economy while creating inflationary pressures that fueled Iranian revolutionary discontent. The wealth transfer also enabled Shah Mohammed Reza Pahlavi\'s military buildup and social modernization program that alienated traditional sectors — helping produce the 1979 revolution\'s coalition of Islamists, leftists, and merchants.',
    confidence: 'medium' },

  // ── cuneiform, code_of_hammurabi, egyptian_hieroglyphics clusters ─────────
  { id: 'cuneiform__code_of_hammurabi',
    source: 'cuneiform', target: 'code_of_hammurabi', type: 'ENABLED',
    label: 'Cuneiform writing was the medium through which Hammurabi\'s law code was recorded, distributed, and enforced across the empire',
    note: 'The Code of Hammurabi was inscribed in cuneiform on a 7.5-foot black diorite stele (c. 1754 BCE) — the same writing system Mesopotamia had used for 1300 years for commercial records, royal decrees, and literary texts. Cuneiform\'s standardization across Mesopotamia made the law code legible across the Babylonian empire. The choice to carve it in stone and erect it publicly was itself a political act — making law visible and permanent through durable inscription technology. Without cuneiform\'s administrative infrastructure, a written legal code of this scope would be impossible.',
    confidence: 'high' },
  { id: 'cuneiform__egyptian_hieroglyphics',
    source: 'cuneiform', target: 'egyptian_hieroglyphics', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent the independent invention of writing systems to serve state administrative and religious functions',
    note: 'Cuneiform (Sumerian, c. 3200 BCE) and Egyptian hieroglyphics (c. 3200 BCE) are the world\'s two near-simultaneous independent writing system inventions, both emerging at the same period in civilizations separated by 1500 kilometers. Both served state functions (administration, taxation records), elite religious functions (temple records, mortuary texts), and royal propaganda. The Rosetta Stone\'s parallel Greek-Demotic-Hieroglyphic text demonstrates how writing systems served imperial communication. Whether the Egyptian system was independently invented or influenced by Mesopotamian contact remains debated among archaeologists.',
    confidence: 'high' },
  { id: 'code_of_hammurabi__roman_republic',
    source: 'code_of_hammurabi', target: 'roman_republic', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent foundational written law as the basis of political legitimacy — the deep tradition that law constrains rulers',
    note: 'The Code of Hammurabi (c. 1754 BCE) and the Roman Republic\'s Twelve Tables (451 BCE) are separated by 1,300 years but share the political logic: written, publicly accessible law as the basis of political legitimacy rather than royal caprice. Hammurabi\'s stele — erected publicly so citizens could read the law — and Rome\'s Twelve Tables (posted in the Forum) both asserted that the ruler governed through law, not above it. This tradition of written constitutional law, through Roman law\'s influence on European legal systems, is the ancestor of modern constitutional government.',
    confidence: 'medium' },
  { id: 'egyptian_hieroglyphics__cuneiform',
    source: 'egyptian_hieroglyphics', target: 'cuneiform', type: 'SHARES_MECHANISM_WITH',
    label: 'Egyptian hieroglyphics and cuneiform emerged simultaneously as the world\'s first writing systems for state administration',
    note: 'Egyptian hieroglyphics (c. 3200 BCE) and Mesopotamian cuneiform (c. 3200 BCE) are the two earliest writing systems, both emerging within the same century in civilizations that had contact through trade. Both were logographic-phonetic hybrid systems; both began as administrative records (grain quantities, tax receipts) before developing literary and religious functions. The development of alphabetic writing (Phoenician, c. 1050 BCE) was a simplification of these complex systems, eventually producing Greek, Latin, Arabic, and Hebrew alphabets — making both hieroglyphics and cuneiform the ancestors of most modern writing.',
    confidence: 'high' },
  { id: 'book_of_the_dead__rise_of_christianity',
    source: 'book_of_the_dead', target: 'rise_of_christianity', type: 'SHARES_MECHANISM_WITH',
    label: 'Both offer afterlife navigation guides with moral judgment, resurrection, and weighing of souls — structurally parallel afterlife theologies',
    note: 'The Egyptian Book of the Dead (c. 1550-50 BCE) and early Christian eschatology share structural features that some scholars argue represent cultural transmission through Hellenistic Egypt: both feature post-death judgment (the Egyptian weighing of the heart against Ma\'at\'s feather; Christian Last Judgment); both offer ritual preparation for death (funerary spells; last rites); both promise blessed afterlife contingent on earthly conduct. Alexandria, where Egyptian and Hellenic culture merged, is where early Christian theology developed. Some concepts in early Christian afterlife theology may reflect Egyptian religious influence through this Hellenistic transmission route.',
    confidence: 'medium' },
  { id: 'akhenaten__book_of_the_dead',
    source: 'akhenaten', target: 'book_of_the_dead', type: 'DISCREDITED',
    label: 'Akhenaten\'s monotheistic revolution suppressed the traditional funerary religion including the Book of the Dead',
    note: 'Akhenaten\'s (r. 1353–1336 BCE) religious revolution explicitly attacked traditional Egyptian polytheism including the funerary religion the Book of the Dead represented: Osiris, Anubis, and the judgment hall of Ma\'at were suppressed; temples were closed; funerary texts were restricted. Akhenaten\'s Aten monotheism replaced the elaborate afterlife bureaucracy with direct worship of the sun disk. After his death, traditional religion was restored with exceptional fervor — the Aten temples were demolished, his cartouches erased, and the full funerary tradition including the Book of the Dead was reinstated.',
    confidence: 'high' },

  // ── davidic_monarchy ──────────────────────────────────────────────────────
  { id: 'davidic_monarchy__second_temple_period',
    source: 'davidic_monarchy', target: 'second_temple_period', type: 'PRODUCED',
    label: 'The Davidic monarchy\'s fall and Babylonian Captivity directly produced the Second Temple period\'s transformed Judaism',
    note: 'The Davidic monarchy\'s destruction (586 BCE, Babylonian conquest) and the subsequent exile produced the Second Temple period: the return from Babylon (538 BCE under Cyrus the Great) and the Second Temple\'s construction (516 BCE) created a fundamentally transformed Judaism. The Babylonian exile had produced the Torah\'s final editing, synagogue worship, and prophetic literature — the institutional and textual foundation that Second Temple Judaism built on. The Davidic monarchy\'s failure was paradoxically the catalyst for Judaism\'s scripturalization and survival without a temple or king.',
    confidence: 'high' },

  // ── jainism ───────────────────────────────────────────────────────────────
  { id: 'vedic_tradition__jainism',
    source: 'vedic_tradition', target: 'jainism', type: 'ENABLED',
    label: 'Jainism arose as a heterodox reform tradition challenging Vedic ritual sacrifice and Brahmanical hierarchy',
    note: 'Jainism (founded or reformulated by Mahavira, c. 599-527 BCE) emerged from the same northeastern Indian religious culture as Buddhism, explicitly rejecting Vedic ritual sacrifice (the killing of animals) and the Brahmanical caste system\'s religious authority. Jainism\'s radical ahimsa (non-violence) principle was a direct critique of Vedic yajna (ritual sacrifice). The Shramana movement — of which Jainism and Buddhism were the major examples — was a 6th century BCE reform movement that challenged Vedic orthodoxy and produced enduring alternative spiritual traditions.',
    confidence: 'high' },
  { id: 'jainism__buddhist_philosophy',
    source: 'jainism', target: 'buddhist_philosophy', type: 'SHARES_MECHANISM_WITH',
    label: 'Jainism and Buddhism are contemporary Shramana traditions from the same region with overlapping doctrines and mutual influence',
    note: 'Jainism (Mahavira, d. 527 BCE) and Buddhism (Gautama Buddha, d. 483 BCE) are almost exactly contemporary, both from the same northeastern Indian Gangetic plain region, both reacting against Vedic Brahmanical authority. Their doctrinal similarities — emphasis on karma, rebirth, liberation through ethical conduct, rejection of permanent self — led to centuries of debate and mutual influence. The key doctrinal difference: Jainism\'s absolute ahimsa and its belief in permanent soul (jiva) vs. Buddhism\'s conditional ahimsa and no-self (anatta). Early Buddhist texts engage extensively with Jain positions, suggesting intense philosophical competition.',
    confidence: 'high' },

  // ── mohism ────────────────────────────────────────────────────────────────
  { id: 'laozi__mohism',
    source: 'laozi', target: 'mohism', type: 'SHARES_MECHANISM_WITH',
    label: 'Laozi\'s Taoism and Mohism were both Hundred Schools of Thought responses to the Zhou dynasty\'s political collapse',
    note: 'Taoism (Laozi, c. 6th-4th century BCE) and Mohism (Mozi, 470-391 BCE) were both responses to the Spring and Autumn period\'s political chaos — the Hundred Schools of Thought era when China\'s Zhou dynasty fragmented and intellectuals competed to prescribe political solutions. Taoism prescribed withdrawal from political engagement; Mohism prescribed universal love (jian ai) and utilitarian state service as the solution. Both rejected Confucian ritual propriety (li) as insufficient — Taoism because ritual was artificial constraint on natural virtue; Mohism because it privileged kin loyalty over universal welfare.',
    confidence: 'high' },
  { id: 'mohism__stoicism',
    source: 'mohism', target: 'stoicism', type: 'SHARES_MECHANISM_WITH',
    label: 'Both Mohism and Stoicism developed universal ethics transcending kin and polis loyalty, roughly contemporaneously, in different civilizations',
    note: 'Mohism (China, 5th-3rd century BCE) and Stoicism (Greece, 3rd century BCE) developed strikingly similar universal ethical frameworks in different civilizations: both rejected the idea that moral obligation was limited to family or political community; both argued for extending moral concern to all human beings; both were utilitarian in orientation (maximizing benefit, minimizing harm); both produced sophisticated logic and epistemology. This parallel development of universalist ethics in the Axial Age has led some philosophers to identify a global transition in ethical thinking around 500-300 BCE — the "Axial Age" in Karl Jaspers\' terminology.',
    confidence: 'medium' },

  // ── qin_dynasty ───────────────────────────────────────────────────────────
  { id: 'qin_dynasty__roman_empire',
    source: 'qin_dynasty', target: 'roman_empire', type: 'SHARES_MECHANISM_WITH',
    label: 'Both achieved unprecedented territorial unification through military conquest, administrative standardization, and bureaucratic control',
    note: 'The Qin dynasty (221-206 BCE) and Roman Empire (27 BCE-476 CE) are the two great ancient unifications — China and the Mediterranean — achieved through similar mechanisms: professional military conquest, standardized administration (weights and measures, currency, law), road networks, bureaucratic governance, and suppression of regional autonomy. Both used writing as an administrative tool; both built walls (Great Wall, Hadrian\'s Wall); both used forced population movement and colonization. The parallel was noted by Gibbon and has fascinated comparative historians — two civilizational unifications roughly contemporary, using convergent state-building technologies.',
    confidence: 'high' },

  // ── cleopatra ─────────────────────────────────────────────────────────────
  { id: 'alexander_the_great__cleopatra',
    source: 'alexander_the_great', target: 'cleopatra', type: 'PRODUCED',
    label: 'Cleopatra was the last ruler of the Ptolemaic dynasty founded by Alexander\'s general Ptolemy I after Alexander\'s death',
    note: 'Cleopatra VII (69-30 BCE) was the last Ptolemaic ruler — a dynasty founded by Ptolemy I Soter, one of Alexander the Great\'s generals, who claimed Egypt after Alexander\'s death (323 BCE) and established a Greek royal house in Alexandria. The Ptolemaic dynasty ruled Egypt for 275 years (305-30 BCE) before Cleopatra\'s defeat and suicide ended it. Cleopatra was herself Macedonian Greek in lineage — she was notable for being the first Ptolemaic ruler to learn Egyptian. Alexander\'s conquests thus produced the specific political context that created Cleopatra\'s position three centuries later.',
    confidence: 'high' },

  // ── buck_v_bell ───────────────────────────────────────────────────────────
  { id: 'buck_v_bell__the_holocaust',
    source: 'buck_v_bell', target: 'the_holocaust', type: 'SHARES_MECHANISM_WITH',
    label: 'American eugenics including Buck v Bell directly inspired Nazi racial hygiene laws, and Nuremberg defendants cited Oliver Wendell Holmes',
    note: 'The connection between Buck v Bell (1927) and the Holocaust is documented: the Nazi Law for the Prevention of Hereditary Diseased Offspring (1933) was explicitly modeled on Harry Laughlin\'s Model Eugenical Sterilization Law, the American eugenic framework that Buck v Bell upheld. At the Nuremberg doctors\' trial, defendants cited Oliver Wendell Holmes\'s "three generations of imbeciles are enough" as justification. The Holocaust\'s racial science was built on American eugenic foundations — eugenics was a mainstream American progressive cause before Nazi association made it disreputable.',
    confidence: 'high' },
  { id: 'buck_v_bell__nuremberg_trials',
    source: 'buck_v_bell', target: 'nuremberg_trials', type: 'SHARES_MECHANISM_WITH',
    label: 'Nuremberg defendants cited Buck v Bell to justify forced sterilization, creating ironic jurisprudential mirror',
    note: 'The Nuremberg doctors\' trial (1946-47) created an ironic jurisprudential moment: Nazi defendants invoked Buck v Bell (1927) and American eugenic sterilization programs as precedent for their racial hygiene programs. This created the uncomfortable reality that the Nuremberg Tribunal was prosecuting conduct that had been legally endorsed by the US Supreme Court. The Nuremberg Code\'s prohibition on non-consensual medical experimentation was partly a response to this — establishing international standards that American law had not required.',
    confidence: 'high' },

  // ── council_of_clermont_1095 ──────────────────────────────────────────────
  { id: 'byzantine_empire__council_of_clermont_1095',
    source: 'byzantine_empire', target: 'council_of_clermont_1095', type: 'ENABLED',
    label: 'Byzantine Emperor Alexios I\'s plea for Western military aid against the Seljuks triggered Pope Urban II\'s Clermont sermon',
    note: 'The Council of Clermont (November 1095) and Pope Urban II\'s call for crusade were directly triggered by a Byzantine request: Emperor Alexios I Komnenos sent ambassadors to Urban II asking for Western mercenary soldiers to help push back Seljuk Turk advances that had taken most of Asia Minor (Battle of Manzikert, 1071). Urban\'s response exceeded what Alexios requested — instead of mercenaries, he mobilized a mass religious crusade. The First Crusade\'s arrival in Constantinople caused as many problems as it solved for Byzantium, as the crusaders proved difficult for Byzantine commanders to direct.',
    confidence: 'high' },

  // ── isis_rise ─────────────────────────────────────────────────────────────
  { id: 'iraq_war_wmd__isis_rise',
    source: 'iraq_war_wmd', target: 'isis_rise', type: 'ENABLED',
    label: 'The Iraq War\'s de-Baathification and Sunni exclusion directly created the social base ISIS recruited from',
    note: 'ISIS\'s rise is a direct consequence of the 2003 Iraq War\'s political architecture: Paul Bremer\'s de-Baathification decree (CPA Order 1) fired 400,000 Baathist soldiers and officials — creating a pool of military-trained, unemployed, alienated Sunni men with weapons. The dissolution of the Iraqi army placed these men outside the political system. Al-Qaeda in Iraq (ISIS\'s predecessor) recruited heavily from this population. When the Surge temporarily suppressed AQI, the US paid "Awakening" Sunni tribal leaders — only for Maliki\'s Shia-sectarian government to subsequently alienate them, driving them back to ISIS. The Iraq War created ISIS\'s constituency.',
    confidence: 'high' },

  // ── patriot_act_surveillance ──────────────────────────────────────────────
  { id: 'september_11_attacks__patriot_act_surveillance',
    source: 'september_11_attacks', target: 'patriot_act_surveillance', type: 'PRODUCED',
    label: 'The PATRIOT Act (October 2001) was passed 45 days after 9/11 in a climate of panic, vastly expanding domestic surveillance',
    note: 'The USA PATRIOT Act (October 26, 2001, signed 45 days after 9/11) passed with almost no congressional debate or public deliberation. The Act dramatically expanded FBI wiretapping authority, enabled "sneak and peek" searches without prior notice, allowed mass surveillance of library records, and expanded foreign intelligence collection inside the US. Subsequent revelations (Snowden, 2013) showed the Act enabled a mass domestic surveillance infrastructure far beyond counterterrorism — including bulk collection of American phone metadata. The 9/11 panic context produced legislation whose full scope was not publicly known until a decade later.',
    confidence: 'high' },

  // ── us_iran_1953_coup ─────────────────────────────────────────────────────
  { id: 'mk_ultra__us_iran_1953_coup',
    source: 'mk_ultra', target: 'us_iran_1953_coup', type: 'SHARES_MECHANISM_WITH',
    label: 'Both were covert CIA operations in 1953 reflecting the agency\'s early Cold War willingness to use illegal means for regime control',
    note: 'MK-Ultra (CIA mind control program begun 1953) and Operation Ajax (CIA-backed Iranian coup, August 1953) are products of the same early Cold War CIA institutional culture: the conviction that the US was in an existential conflict justifying any means necessary. Both were ordered by Allen Dulles; both were illegal; both caused decades of blowback (MK-Ultra\'s victims; Iran\'s anti-American revolution 1979); both were kept secret for decades. The CIA of 1953 operated with minimal congressional oversight or legal constraint — a culture Watergate-era Church Committee reforms attempted to end.',
    confidence: 'high' },

  // ── jesuit_order ─────────────────────────────────────────────────────────
  { id: 'protestant_reformation__jesuit_order',
    source: 'protestant_reformation', target: 'jesuit_order', type: 'PRODUCED',
    label: 'The Society of Jesus was founded explicitly as a Catholic Counter-Reformation strike force against Protestant expansion',
    note: 'Ignatius of Loyola founded the Society of Jesus (Jesuits, 1540) as a direct response to the Protestant Reformation\'s advance: the Jesuits were organized as a quasi-military order with strict obedience to the Pope, deployed as missionaries to reconvert Protestant territories and spread Catholicism in the Americas and Asia. Unlike mendicant orders (Franciscans, Dominicans), the Jesuits emphasized education — founding universities across Europe to compete intellectually with Protestant scholarship. The Jesuits\' intellectual rigor and global missionary network made them the Counter-Reformation\'s most effective instrument and the most controversial Catholic order.',
    confidence: 'high' },
  { id: 'jesuit_order__liberation_theology',
    source: 'jesuit_order', target: 'liberation_theology', type: 'ENABLED',
    label: 'Jesuit social teaching and the Second Vatican Council\'s influence produced Latin American Liberation Theology',
    note: 'Liberation Theology emerged primarily from Latin American Jesuits and other religious orders following Vatican II (1962-65) and the Medellín Bishops\' Conference (1968), which declared a "preferential option for the poor." Jesuits like Jon Sobrino (El Salvador) and the murdered Oscar Romero\'s circle were central to Liberation Theology\'s development. The Jesuits\' educational and social mission in Latin America\'s poorest communities — combined with the region\'s military dictatorships\' repression — produced a theology that identified sin with structural poverty. The Reagan administration viewed Liberation Theology as Marxist infiltration.',
    confidence: 'high' },

  // ── winged_hussars ────────────────────────────────────────────────────────
  { id: 'winged_hussars__ottoman_empire',
    source: 'winged_hussars', target: 'ottoman_empire', type: 'DISCREDITED',
    label: 'The winged hussars\' charge at Vienna (1683) broke the Ottoman advance into Europe and began the Ottoman Empire\'s long decline',
    note: 'The Battle of Vienna (September 11-12, 1683) was decided by the largest cavalry charge in history — 18,000 winged hussars leading 70,000 allied cavalry down Kahlenberg hill into the flank of Kara Mustafa\'s besieging army. The charge broke the 60-day siege and routed the Ottoman force. Vienna was the Ottoman\'s deepest penetration into Europe; after 1683, they never again advanced westward. The battle began a century of Ottoman retreat (Treaty of Karlowitz, 1699; Treaty of Passarowitz, 1718) — the start of the Eastern Question that eventually produced WWI.',
    confidence: 'high' },

  // ── papal_swiss_guard ─────────────────────────────────────────────────────
  { id: 'papal_swiss_guard__jesuit_order',
    source: 'papal_swiss_guard', target: 'jesuit_order', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent Counter-Reformation papal institutional responses to the Protestant threat — military and intellectual arms respectively',
    note: 'The Papal Swiss Guard (formally established 1506, reorganized after the Sack of Rome 1527) and the Jesuit Order (founded 1540) represent two dimensions of papal response to the Protestant Reformation: the Swiss Guard provided physical papal protection after the traumatic Sack of Rome demonstrated vulnerability; the Jesuits provided intellectual and missionary counter-force. Both were directly shaped by the Reformation crisis: the Guard\'s survival of the Sack became its foundational narrative; the Jesuits were explicitly Counter-Reformation. Both survive to the present as Catholic institutional responses to 16th-century crisis.',
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
