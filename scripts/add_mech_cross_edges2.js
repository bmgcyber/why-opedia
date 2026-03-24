#!/usr/bin/env node
// add_mech_cross_edges2.js — add cross-scope edges for mechanism nodes with <=2 connections
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const exIds = new Set(me.map(e => e.id));

const batch = [
  // ── healthy_at_every_size ─────────────────────────────────────────────────
  { id: 'healthy_at_every_size__chronic_illness_online_communities',
    source: 'healthy_at_every_size', target: 'chronic_illness_online_communities', type: 'ENABLED',
    label: 'HAES philosophy gave chronic illness communities frameworks to resist medical authority\'s weight-centric explanations',
    note: 'Health at Every Size (HAES) philosophy became foundational in chronic illness online communities — particularly among fat/disabled patients experiencing medical dismissal of symptoms attributed to weight. HAES provided a framework to resist physicians\' insistence that weight loss would resolve chronic illness (fibromyalgia, ME/CFS, lipedema patients frequently report this). Chronic illness communities online became significant vectors for HAES philosophy distribution, as patients who had experienced weight-based medical dismissal actively sought and shared HAES-aligned clinicians.',
    confidence: 'high' },
  { id: 'healthy_at_every_size__anti_psychiatry_movement',
    source: 'healthy_at_every_size', target: 'anti_psychiatry_movement', type: 'SHARES_MECHANISM_WITH',
    label: 'Both challenge medical authority\'s right to define healthy bodies and minds, rejecting pathologization of natural variation',
    note: 'Health at Every Size (HAES) and the anti-psychiatry movement share a structural critique: both challenge medicine\'s authority to pathologize bodies/minds that differ from a statistical norm. Anti-psychiatry questioned whether mental illness diagnosis was a social control mechanism; HAES questions whether BMI-based obesity diagnosis is similarly about controlling deviant bodies rather than improving health. Both movements emerged partly from patient activism against medical dismissal; both attracted both genuine reformers and bad-faith actors using the critique to oppose evidence-based treatment.',
    confidence: 'medium' },

  // ── medical_weight_bias ───────────────────────────────────────────────────
  { id: 'medical_weight_bias__covid19_pandemic',
    source: 'medical_weight_bias', target: 'covid19_pandemic', type: 'ENABLED',
    label: 'Medical weight bias affected COVID triage, ventilator allocation, and vaccine hesitancy in communities with negative healthcare experiences',
    note: 'COVID-19 revealed medical weight bias in multiple ways: early clinical observations that obesity correlated with worse COVID outcomes were sometimes applied prejudicially in triage (premature DNR assumptions for fat patients); vaccination hesitancy was higher in communities with histories of medical abuse including weight-based dismissal; and the pandemic\'s disproportionate impact on communities of color intersected with documented weight bias against Black patients in emergency settings. Medical weight bias\' effect on vaccine uptake and care-seeking in vulnerable populations contributed to pandemic disparities.',
    confidence: 'medium' },
  { id: 'medical_weight_bias__chronic_illness_online_communities',
    source: 'medical_weight_bias', target: 'chronic_illness_online_communities', type: 'ENABLED',
    label: 'Medical weight bias drove patients with undiagnosed chronic illness to online communities as alternatives to dismissive physicians',
    note: 'Medical weight bias — physicians attributing all symptoms to excess weight without investigation — is a documented driver of delayed chronic illness diagnosis. Studies show fat patients wait 4-10 years longer for chronic illness diagnoses (fibromyalgia, hypothyroidism, lipedema, POTS) because symptoms are attributed to weight. These patients, dismissed by conventional medicine, formed online communities sharing diagnostic experiences, treatment alternatives, and advocacy strategies. The chronic illness online community\'s anti-medical-authority dimension is substantially driven by weight bias experiences.',
    confidence: 'high' },

  // ── conspiracy_theory_grifters ────────────────────────────────────────────
  { id: 'conspiracy_theory_grifters__anti_vaccination_movement',
    source: 'conspiracy_theory_grifters', target: 'anti_vaccination_movement', type: 'ENABLED',
    label: 'Wellness grifters monetized anti-vax conspiracy through supplement sales, courses, and media networks built on vaccine fear',
    note: 'Anti-vaccination discourse is a primary revenue engine for conspiracy grifters: Alex Jones (Infowars supplements), Joseph Mercola ($100M+ supplement business built on anti-vax content), RFK Jr.\'s Children\'s Health Defense (fundraising on vaccine fear), and an entire Instagram wellness-influencer economy selling "natural immunity" products. COVID-19 vaccine hesitancy created a trillion-dollar alternative health market. The conspiracy grifter economy requires audience fear and distrust of mainstream medicine — anti-vaccination content creates and maintains this audience while alternative health products monetize it.',
    confidence: 'high' },
  { id: 'conspiracy_theory_grifters__trump_maga',
    source: 'conspiracy_theory_grifters', target: 'trump_maga', type: 'ENABLED',
    label: 'MAGA movement created and was sustained by a conspiracy-monetization ecosystem that funded the movement',
    note: 'The Trump/MAGA movement created a symbiotic relationship with conspiracy grifters: InfoWars, Turning Point USA, Gateway Pundit, Project Veritas, and dozens of smaller operations built audiences through MAGA-adjacent content and monetized through fundraising, merchandise, and media subscriptions. Trump\'s election fraud claims in 2020-24 were the most lucrative conspiracy grift in American history — generating $250M+ in small-dollar donations within weeks of the 2020 election, much of which was redirected to Trump-adjacent organizations. The MAGA movement is inseparable from its conspiracy-grift funding ecosystem.',
    confidence: 'high' },
  { id: 'conspiracy_theory_grifters__september_11_attacks',
    source: 'conspiracy_theory_grifters', target: 'september_11_attacks', type: 'ENABLED',
    label: '9/11 Truth was the conspiracy grift template — monetizing institutional distrust with books, DVDs, and speaking tours',
    note: '9/11 Truth movement (2002-2010) was the template for the modern conspiracy grift economy: Alex Jones, Dylan Avery (Loose Change), David Ray Griffin, and hundreds of smaller operators monetized 9/11 skepticism through DVDs, books, speaking tours, and early online advertising. 9/11 Truth demonstrated that institutional distrust created a paying audience, that compelling narrative was more important than evidence, and that debunking actually increased engagement. These lessons were applied to birtheirism, Sandy Hook denial, QAnon, and COVID conspiracies. The 9/11 grift economy was the training ground for the conspiracy industry that dominated the 2010s-2020s.',
    confidence: 'high' },

  // ── pfas_microplastics ────────────────────────────────────────────────────
  { id: 'pfas_microplastics__covid19_pandemic',
    source: 'pfas_microplastics', target: 'covid19_pandemic', type: 'SHARES_MECHANISM_WITH',
    label: 'Both involved corporations and governments concealing chemical/biological hazards while public health officials minimized risks',
    note: 'PFAS/microplastics industrial concealment and COVID-19 pandemic management share a structural pattern of institutional health information suppression: in both cases, industries/governments had early evidence of serious health risks that was not communicated to the public; regulatory capture delayed protective action; and "uncertainty" framing was used to defer health-protective policy. COVID\'s early WHO/CDC messaging minimizing airborne transmission parallels PFAS manufacturers\' decades of internal knowledge concealment. Both episodes reveal how regulatory capture and institutional inertia suppress public health information.',
    confidence: 'medium' },
  { id: 'pfas_microplastics__military_industrial_complex',
    source: 'pfas_microplastics', target: 'military_industrial_complex', type: 'ENABLED',
    label: 'PFAS contamination originates primarily from military firefighting foam use; DoD is America\'s largest single PFAS polluter',
    note: 'The US Department of Defense is the single largest source of PFAS contamination in the US — AFFF (aqueous film-forming foam) containing PFAS was used at hundreds of military installations for aircraft fire training from the 1970s-2000s. The EPA has identified 700+ military sites with PFAS groundwater contamination. The Pentagon delayed public disclosure of contamination for decades, used national security exemptions to avoid EPA cleanup requirements, and lobbied against PFAS regulation. The military-industrial complex\'s PFAS liability (estimated $400B+) is the largest environmental liability in American history.',
    confidence: 'high' },

  // ── moon_landing_conspiracy ───────────────────────────────────────────────
  { id: 'moon_landing_conspiracy__anti_vaccination_movement',
    source: 'moon_landing_conspiracy', target: 'anti_vaccination_movement', type: 'SHARES_MECHANISM_WITH',
    label: 'Both conspiracy theories share identical cognitive architecture: institutional distrust, anomaly hunting, and motivated reasoning',
    note: 'Moon landing denial and anti-vaccination conspiracy theory share an identical epistemic structure: both begin with motivated distrust of institutional authority (NASA, CDC); both use "anomaly hunting" (inconsistencies in evidence are proof of conspiracy rather than complexity); both interpret debunking as confirmation (why would they try so hard to disprove it?); and both are resistant to evidence because they\'re primarily identity commitments rather than falsifiable claims. People who believe one conspiracy theory are statistically more likely to believe others — the moon hoax and anti-vax overlap significantly in belief clustering.',
    confidence: 'high' },
  { id: 'moon_landing_conspiracy__trump_maga',
    source: 'moon_landing_conspiracy', target: 'trump_maga', type: 'ENABLED',
    label: 'The political coalition that produced MAGA normalized conspiracy thinking that made moon landing denial mainstream-adjacent',
    note: 'Moon landing conspiracy belief has risen as MAGA political identity has normalized institutional distrust: polls show moon hoax belief is correlated with Trump support, distrust of mainstream media, and QAnon belief. The MAGA movement\'s core claim — that deep state institutions (FBI, CIA, CDC, elections officials) systematically lie to the public — is structurally identical to moon hoax theory. A political movement that normalized election fraud conspiracy, COVID lab leak conspiracy, and vaccine conspiracy created the epistemic environment in which moon landing conspiracy became socially acceptable.',
    confidence: 'medium' },

  // ── hutu_power ────────────────────────────────────────────────────────────
  { id: 'berlin_conference_1884__hutu_power',
    source: 'berlin_conference_1884', target: 'hutu_power', type: 'ENABLED',
    label: 'Belgian colonial racial categorization of Hutu/Tutsi — originating in colonial anthropology — created the ethnic framework Hutu Power exploited',
    note: 'Hutu Power\'s genocidal ideology was built on colonial racial categories: Belgian colonizers (inheriting German colonial practice) hardened previously fluid Hutu/Tutsi social categories into fixed racial identities, issued identity cards (introduced 1933) marking ethnicity, and used Tutsi as a colonial administrative class (applying "Hamitic hypothesis" racial theory). The Berlin Conference (1884) established the colonial framework that produced Belgian Rwanda; Belgian colonial administration created the specific ethnic categorization system that Hutu Power weaponized 60 years later. The Rwandan genocide cannot be understood without Belgian colonial racial engineering.',
    confidence: 'high' },
  { id: 'hutu_power__apartheid_south_africa',
    source: 'hutu_power', target: 'apartheid_south_africa', type: 'SHARES_MECHANISM_WITH',
    label: 'Both used colonial-era racial categorization systems to institutionalize ethnic hierarchy and state violence',
    note: 'Hutu Power (Rwanda) and apartheid South Africa share the foundational mechanism of colonial racial categorization weaponized for state control: both used inherited European colonial racial taxonomies (Hamitic hypothesis for Rwanda; "scientific" race classification for apartheid); both institutionalized racial identity through identity documents; both required systematic dehumanization of a racial group to enable state violence. The parallel demonstrates how European colonial racial categories created the institutional infrastructure for 20th century genocides and apartheid systems that colonial powers claimed to be transcending.',
    confidence: 'high' },

  // ── social_media_algorithms ───────────────────────────────────────────────
  { id: 'social_media_algorithms__trump_maga',
    source: 'social_media_algorithms', target: 'trump_maga', type: 'ENABLED',
    label: 'Facebook/YouTube algorithms systematically amplified Trump/MAGA content because outrage drives engagement metrics',
    note: 'Internal Facebook research (leaked 2021) confirmed that its algorithm amplified divisive political content — including Trump/MAGA content — because outrage, fear, and tribal identity content generated higher engagement metrics (shares, comments, reactions). A 2020 internal study found that 64% of radicalization into extremist Facebook groups was algorithm-driven. YouTube\'s recommendation algorithm was documented pushing users from mainstream political content toward increasingly extreme right-wing content. The MAGA movement\'s reach was substantially powered by algorithmic amplification that the platforms resisted fixing because engagement metrics were their business model.',
    confidence: 'high' },
  { id: 'social_media_algorithms__anti_vaccination_movement',
    source: 'social_media_algorithms', target: 'anti_vaccination_movement', type: 'ENABLED',
    label: 'YouTube and Facebook algorithms consistently recommended anti-vaccine content because it generated high engagement',
    note: 'Research demonstrates algorithmic amplification of anti-vaccination content: YouTube\'s recommendation algorithm regularly directed users searching for vaccine information toward anti-vaccine videos (documented in 2019 studies); Facebook\'s algorithm gave anti-vaccine groups disproportionate reach because their emotionally charged content generated engagement. The WHO\'s "infodemic" declaration (2020) was driven by documented algorithmic amplification of COVID vaccine misinformation. Platform attempts to demote anti-vax content — taken only after intense public pressure in 2021 — demonstrated that the algorithmic structure had been actively amplifying vaccine misinformation for years.',
    confidence: 'high' },
  { id: 'social_media_algorithms__isis_rise',
    source: 'social_media_algorithms', target: 'isis_rise', type: 'ENABLED',
    label: 'ISIS used social media platforms\' algorithmic amplification for unprecedented jihadist recruitment and propaganda distribution',
    note: 'ISIS (2013-2019) was the first terrorist organization to systematically exploit social media algorithms for recruitment: high-quality production videos on YouTube and later Twitter were algorithmically amplified because they generated engagement through novelty and shock. Twitter\'s retweet algorithm spread ISIS propaganda; YouTube\'s recommendation algorithm directed radicalized users toward more extreme content. ISIS recruited thousands of Western foreign fighters through social media pathways. Platform responses (content removal, account banning) consistently lagged ISIS\'s adaptation; counter-extremism researchers documented how algorithmic recommendation drove radicalization pathways.',
    confidence: 'high' },

  // ── weimar_republic ───────────────────────────────────────────────────────
  { id: 'weimar_republic__the_holocaust',
    source: 'weimar_republic', target: 'the_holocaust', type: 'ENABLED',
    label: 'The Weimar Republic\'s collapse was the necessary condition for the Holocaust — democratic failure was Holocaust\'s prerequisite',
    note: 'The Holocaust required the Weimar Republic\'s specific failure mode: not violent coup but constitutional manipulation. Hitler\'s January 1933 legal appointment as Chancellor, followed by the Reichstag Fire Decree and Enabling Act (March 1933), dismantled democratic constraints within weeks. The Weimar constitution\'s emergency powers provisions (Article 48) and the electoral system\'s vulnerability to plurality winners enabled legal totalitarianism. Without Weimar\'s constitutional vulnerabilities — proportional representation producing fragmented coalitions, presidential emergency powers, judicial deference to executive authority — the Holocaust\'s administrative state could not have been constructed.',
    confidence: 'high' },
  { id: 'weimar_republic__stalinist_purges',
    source: 'weimar_republic', target: 'stalinist_purges', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent democratic/post-revolutionary states destroyed by charismatic authoritarian takeover using legal means and terror',
    note: 'Weimar Germany (1919-1933) and the Soviet system (1917-1938) exhibit parallel authoritarian consolidation patterns: both emerged from political crises (WWI defeat; revolution); both initially had competitive political institutions that were systematically dismantled; both used legal mechanisms alongside terror; both produced totalitarian states of unprecedented scale and violence. The parallel demonstrates that totalitarianism was not historically inevitable but required specific institutional vulnerabilities, economic crises, and charismatic leaders willing to use legal and illegal means simultaneously.',
    confidence: 'medium' },

  // ── historical_revisionism ────────────────────────────────────────────────
  { id: 'historical_revisionism__the_holocaust',
    source: 'historical_revisionism', target: 'the_holocaust', type: 'ENABLED',
    label: 'Holocaust denial is the archetype of historical revisionism — distorting the best-documented genocide to serve political purposes',
    note: 'Holocaust denial is the paradigm case of historical revisionism for political purposes: the denial of the best-documented genocide in history, using the trappings of historical methodology (citing documents, questioning specific claims) to reach predetermined conclusions driven by antisemitism. The Irving v. Lipstadt trial (2000) was the definitive exposure of historical revisionism\'s methods: David Irving\'s "historical scholarship" was revealed in court as systematic distortion of evidence. Holocaust denial demonstrates how revisionism works — not by fabricating evidence but by selective emphasis, misleading framing, and exploiting genuine historical uncertainty.',
    confidence: 'high' },
  { id: 'historical_revisionism__stalinist_purges',
    source: 'historical_revisionism', target: 'stalinist_purges', type: 'ENABLED',
    label: 'Soviet historical revisionism — erasing purge victims, airbrushing photographs — was the 20th century\'s most systematic state falsification of history',
    note: 'Soviet historical revisionism of the Stalinist purges is the most documented case of state-directed history falsification: purge victims were erased from photographs, encyclopedias, and official histories; show trial confessions were presented as authentic historical record; the scale of the Gulag was concealed for decades. Soviet historians who discovered archive evidence of falsification were themselves arrested. The Soviet Union\'s collapse produced the glasnost historical revelation — demonstrating that official Soviet history was systematically falsified. Post-Soviet Russia\'s rehabilitation of Stalin represents a second wave of historical revisionism about the same events.',
    confidence: 'high' },
  { id: 'historical_revisionism__civil_rights_movement',
    source: 'historical_revisionism', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'Civil rights revisionism — sanitizing the movement\'s radicalism, erasure of white opposition — is the dominant American historical mythology',
    note: 'The civil rights movement has been subjected to systematic historical revisionism: Martin Luther King Jr.\'s FBI surveillance, LBJ opposition until political calculation changed, white moderate opposition (King\'s "Letter from Birmingham Jail" was addressed to white moderates, not racists), and the movement\'s radical economic agenda (poor people\'s campaign, opposition to Vietnam) are consistently erased in "safe" commemorations. Polls showing 2/3 of white Americans viewed MLK unfavorably in 1966 are absent from school curricula. Civil rights revisionism has made a radical movement safe for celebration while stripping it of political content.',
    confidence: 'high' },

  // ── kantian_ethics ────────────────────────────────────────────────────────
  { id: 'kantian_ethics__nuremberg_trials',
    source: 'kantian_ethics', target: 'nuremberg_trials', type: 'ENABLED',
    label: 'The Nuremberg principles of universal human dignity and crimes against humanity are applied Kantian categorical imperative logic',
    note: 'The Nuremberg Tribunal (1945-46) implicitly applied Kantian moral philosophy: the concept of "crimes against humanity" — acts prohibited regardless of state law or orders — is the categorical imperative applied to international law. The maxim "follow only rules you could universalize" makes genocide universally impermissible because no rational agent could universalize a permission to genocide. The Nuremberg judges rejected the "following orders" defense using reasoning that parallels Kant\'s argument that moral law must be universal and cannot be overridden by positive law. Post-Nuremberg international humanitarian law is substantially Kantian ethics institutionalized.',
    confidence: 'high' },
  { id: 'kantian_ethics__american_revolution',
    source: 'kantian_ethics', target: 'american_revolution', type: 'SHARES_MECHANISM_WITH',
    label: 'Both derive human rights from rational autonomy rather than tradition, divine right, or utility — the Enlightenment rights revolution',
    note: 'Kantian ethics and the American Revolutionary rights framework share the same Enlightenment philosophical foundation: rights derived from rational autonomy rather than tradition, religion, or utility. Jefferson\'s "self-evident truths" and "inalienable rights" reflect Locke and Rousseau, but the underlying philosophical structure — rational agents have inherent dignity that no political authority can alienate — is the proto-Kantian move that Kant systematized. The American Declaration\'s rights claims are historically contemporaneous with Kant (Declaration: 1776, Groundwork: 1785) — both products of the same Enlightenment intellectual moment.',
    confidence: 'high' },
  { id: 'kantian_ethics__civil_rights_movement',
    source: 'kantian_ethics', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'MLK\'s "Letter from Birmingham Jail" makes explicitly Kantian arguments for the universality of just law',
    note: 'Martin Luther King Jr.\'s "Letter from Birmingham Jail" (1963) is an applied Kantian ethics text: King distinguishes just from unjust laws using criteria that are explicitly Kantian — an unjust law is one that a majority imposes on a minority while exempting itself (failing the universalizability test); an unjust law "degrades human personality" (violating rational autonomy). King was familiar with Kant through his Boston University doctoral work in personalism. The Civil Rights Movement\'s philosophical framework — natural law, universal human dignity, the moral impermissibility of segregation — is substantially grounded in the Kantian tradition.',
    confidence: 'high' },

  // ── bhagavad_gita ─────────────────────────────────────────────────────────
  { id: 'bhagavad_gita__civil_rights_movement',
    source: 'bhagavad_gita', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'Gandhi\'s Bhagavad Gita-based satyagraha philosophy directly shaped MLK\'s nonviolent civil disobedience strategy',
    note: 'The Bhagavad Gita\'s influence on the American Civil Rights Movement is documented through Gandhi: Gandhi\'s interpretation of the Gita (karma yoga as selfless service, duty without attachment to outcomes) became his philosophical basis for satyagraha (nonviolent resistance). MLK explicitly acknowledged Gandhi\'s influence on his civil disobedience theology — "Letter from Birmingham Jail" cites Gandhi as one of his two primary influences (alongside St. Augustine). MLK\'s Montgomery bus boycott organizing drew directly on Gandhi\'s South African and Indian campaigns. The Bhagavad Gita\'s concept of righteous action without personal attachment underwrites both Gandhian and King\'s nonviolent movement philosophy.',
    confidence: 'high' },
  { id: 'bhagavad_gita__chan_zen_buddhism',
    source: 'bhagavad_gita', target: 'chan_zen_buddhism', type: 'SHARES_MECHANISM_WITH',
    label: 'Both teach action without ego-attachment as the path to liberation — structurally parallel despite different traditions',
    note: 'The Bhagavad Gita\'s karma yoga (action without attachment to fruits/results) and Chan/Zen Buddhism\'s doctrine of non-attachment and present-moment action share a structural philosophical parallel: both teach that ego-driven action produces suffering, while action performed without grasping at outcomes produces liberation. The Gita\'s "Do your duty without attachment to results" parallels Zen\'s "Before enlightenment, chop wood, carry water; after enlightenment, chop wood, carry water." This parallel has led to extensive Hindu-Buddhist philosophical comparison, particularly in Vivekananda\'s neo-Vedanta synthesis that influenced Western appropriations of both traditions.',
    confidence: 'medium' },

  // ── confucian_social_order ────────────────────────────────────────────────
  { id: 'confucian_social_order__chinese_cultural_revolution',
    source: 'confucian_social_order', target: 'chinese_cultural_revolution', type: 'DISCREDITED',
    label: 'Mao\'s Cultural Revolution explicitly targeted Confucian social order as the "Four Olds" — bourgeois tradition obstructing revolution',
    note: 'The Cultural Revolution (1966-76) was explicitly anti-Confucian: Mao\'s "Criticize Lin Biao, Criticize Confucius" campaign (1973-74) directly attacked Confucian social hierarchy as the ideological foundation of class oppression. The Four Olds campaign (old customs, old culture, old habits, old ideas) targeted Confucian texts, ancestor worship, and the family hierarchy system. Confucian temples were vandalized, scholars persecuted, and classical texts burned. The Cultural Revolution represented the most radical attempt to destroy Confucian civilization in Chinese history — and its failure contributed to the post-Mao rehabilitation of Confucianism as compatible with Chinese Communist nationalism.',
    confidence: 'high' },
  { id: 'confucian_social_order__hirohito',
    source: 'confucian_social_order', target: 'hirohito', type: 'ENABLED',
    label: 'Imperial Japan\'s state ideology fused Shinto emperor-worship with Confucian filial hierarchy to produce absolute loyalty to the Emperor',
    note: 'Meiji-era Japan developed a state ideology synthesizing Shinto emperor divinity with Confucian social hierarchy: the Emperor occupied the apex of the father-son (lord-subject) relationship that structured Confucian social order. Imperial Rescript on Education (1890) explicitly combined Confucian filial piety with loyalty to the Emperor as divine father. This ideological synthesis made resistance to military orders an act of filial impiety and cosmic disorder. Hirohito\'s role in WWII Japan cannot be understood without this Confucian-Shinto synthesis — soldiers were dying for their divine father-emperor, not merely a political leader.',
    confidence: 'high' },

  // ── prosperity_gospel ─────────────────────────────────────────────────────
  { id: 'prosperity_gospel__self_help_industry',
    source: 'prosperity_gospel', target: 'self_help_industry', type: 'SHARES_MECHANISM_WITH',
    label: 'Both sell the idea that individual mental/spiritual practices produce material success, individualizing structural problems',
    note: 'Prosperity gospel theology ("God wants you rich; name it and claim it; your faith determines your income") and the self-help industry share the same ideological function: attributing material outcomes to individual spiritual/psychological practice rather than structural conditions. Both tell the poor that their poverty is a failure of faith/mindset; both sell products (tithing, books, seminars, courses) that promise wealth through transformation of self. The prosperity gospel is the evangelical version of The Secret; The Secret is the secular version of prosperity gospel. Both mystify structural economic inequality by attributing it to individual spiritual deficiency.',
    confidence: 'high' },
  { id: 'prosperity_gospel__trump_maga',
    source: 'prosperity_gospel', target: 'trump_maga', type: 'ENABLED',
    label: 'Trump\'s wealth-as-divine-favor theology perfectly matched prosperity gospel culture; evangelical prosperity gospel leaders were his strongest backers',
    note: 'Trump\'s natural evangelical constituency was the prosperity gospel movement: prosperity gospel theology\'s equation of wealth with divine blessing made a billionaire businessman a natural candidate for divine favor. Trump\'s strongest evangelical supporters — Paula White (his spiritual advisor), Kenneth Copeland, Joel Osteen\'s network — were prosperity gospel leaders. Trump\'s personal theology (God rewards success; poverty signals weak faith; critics are enemies of divine blessing) is prosperity gospel theology without the scripture. The MAGA movement\'s Christian nationalism merged prosperity gospel\'s wealth-theology with white nationalist civilizational rhetoric.',
    confidence: 'high' },

  // ── egyptian_mythology ────────────────────────────────────────────────────
  { id: 'egyptian_mythology__hellenistic_philosophy',
    source: 'egyptian_mythology', target: 'hellenistic_philosophy', type: 'ENABLED',
    label: 'Egyptian mystery religion (Isis cult, Hermeticism) was absorbed into Hellenistic philosophy and became foundational to Neo-Platonism',
    note: 'Egyptian mythology\'s influence on Hellenistic philosophy operated through multiple channels: the Isis-Osiris mystery cult became one of the most widespread religions in the Hellenistic world (2nd century BCE-3rd century CE), absorbed into Greco-Roman syncretism; Hermeticism (Hermetic Corpus) fused Egyptian magical-religious tradition with Platonic and Pythagorean philosophy; Alexandrian Neo-Platonism (Plotinus, Porphyry) was produced in the intellectual environment where Egyptian and Greek philosophical traditions met. The Corpus Hermeticum — foundational to Renaissance Neoplatonism — was a product of this Egyptian-Hellenistic synthesis.',
    confidence: 'high' },
  { id: 'egyptian_mythology__rise_of_christianity',
    source: 'egyptian_mythology', target: 'rise_of_christianity', type: 'ENABLED',
    label: 'Early Christianity absorbed Egyptian religious elements through Alexandrian theology: resurrection, afterlife judgment, and Isis-Mary syncretism',
    note: 'Egyptian religious influence on early Christianity operated through Alexandria, where Egyptian, Greek, and Jewish religious traditions met: the Isis-Osiris resurrection mythology (death, burial, resurrection of Osiris) offered structural parallels that may have influenced early Christian theology developed in Alexandria; Mary Mother of Jesus iconography (enthroned mother nursing divine child) derived directly from Isis nursing Horus imagery; early Christian monks\' desert spiritual practices drew on Egyptian ascetic traditions. The Coptic Christian tradition — which originated in Alexandria — preserves the most direct Egyptian-Christian continuity.',
    confidence: 'medium' },

  // ── egyptian_monotheism ───────────────────────────────────────────────────
  { id: 'egyptian_monotheism__second_temple_period',
    source: 'egyptian_monotheism', target: 'second_temple_period', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent monotheistic consolidation in the Levantine region that shaped Abrahamic religious development',
    note: 'Akhenaten\'s Aten monotheism (c. 1353-1336 BCE) and Second Temple period Judaism (516 BCE-70 CE) represent successive stages in Levantine monotheistic development. Some scholars (Jan Assmann\'s "Moses the Egyptian") argue for cultural memory transmission: the Egyptian monotheistic tradition was suppressed but survived in modified form, influencing the development of Israelite monotheism. Whether through direct influence or parallel development, both represent the same religious innovation — absolute monotheism in a polytheistic world — in adjacent cultures. The Second Temple period\'s consolidation of strict monotheism may have been partly shaped by Egyptian religious traditions transmitted through Alexandrian Jewish communities.',
    confidence: 'medium' },
  { id: 'egyptian_monotheism__rise_of_islam',
    source: 'egyptian_monotheism', target: 'rise_of_islam', type: 'SHARES_MECHANISM_WITH',
    label: 'All three Abrahamic monotheisms that emerged from the Middle East region trace elements of their absolute monotheism to the same ancient development',
    note: 'Islam\'s strict tawhid (absolute divine unity) participates in the long history of Near Eastern monotheistic development that Atenism represents an early instance of. The Abrahamic theological core — one God, transcendent and commanding, requiring exclusive devotion — was a radical departure from ancient Near Eastern polytheism that Akhenaten represents as a historical experiment. Islam\'s absolute rejection of shirk (associating partners with God) is the most rigorous monotheistic formulation in the Abrahamic tradition. Whether or not there is direct transmission, Atenism, Second Temple Judaism, Christianity, and Islam all represent stages in the same monotheistic impulse that transformed the ancient Near East.',
    confidence: 'medium' },

  // ── culture_wars ──────────────────────────────────────────────────────────
  { id: 'culture_wars__evangelical_christianity',
    source: 'culture_wars', target: 'evangelical_christianity', type: 'ENABLED',
    label: 'Evangelical Christianity provided the institutional base and moral vocabulary for American culture wars since the 1970s',
    note: 'American culture wars (Pat Buchanan coined the term at the 1992 Republican convention) were organized primarily through evangelical Christian institutions: Moral Majority (Jerry Falwell, 1979), Focus on the Family (James Dobson), Christian Coalition (Pat Robertson), and affiliated media networks framed political issues — abortion, school prayer, gay rights — as spiritual warfare. The Southern Baptist Convention\'s conservative takeover (1979-90) mobilized millions of church members into political activism. Evangelical Christianity provided the culture wars with institutional infrastructure, media channels, voter mobilization capacity, and a comprehensive moral worldview that secular conservatism lacked.',
    confidence: 'high' },
  { id: 'culture_wars__civil_rights_movement',
    source: 'culture_wars', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'American culture wars are substantially the white conservative backlash to civil rights movement victories institutionalized in law and culture',
    note: 'The American culture wars trace causally to the civil rights movement\'s success: the Civil Rights Act (1964), Voting Rights Act (1965), and subsequent expansion of rights to women, LGBTQ+, and other groups triggered the white conservative reaction that Patrick Buchanan would call "culture wars." Nixon\'s Southern Strategy explicitly targeted white voters displaced by Democratic support for civil rights; Reagan\'s opposition to the Voting Rights Act renewal and welfare queen rhetoric operated the same backlash. The culture wars\' specific issues — affirmative action, busing, school prayer — were all responses to civil rights gains.',
    confidence: 'high' },
  { id: 'culture_wars__tiananmen_square_massacre',
    source: 'culture_wars', target: 'tiananmen_square_massacre', type: 'SHARES_MECHANISM_WITH',
    label: 'Both involve state and social actors mobilizing against perceived cultural revolution — conservative backlash to perceived value change',
    note: 'American culture wars and China\'s post-Tiananmen conservative consolidation share a structural pattern: established authorities perceiving a fundamental challenge to social values mobilizing institutional resources to suppress cultural change. Post-1989 China\'s campaign against "bourgeois liberalization" and "spiritual pollution" was Chinese Communist Party culture war — using state power to enforce traditional (CCP-defined) values against Western-influenced liberalization. American culture wars use electoral and institutional channels; Chinese culture wars use state censorship and ideological control. Both are responses to perceived value change threatening established power.',
    confidence: 'medium' },

  // ── political_polarization ────────────────────────────────────────────────
  { id: 'political_polarization__trump_maga',
    source: 'political_polarization', target: 'trump_maga', type: 'ENABLED',
    label: 'Extreme political polarization was both the condition that enabled Trump\'s rise and was intensified by his presidency',
    note: 'The relationship between political polarization and MAGA is bidirectional: decades of increasing political polarization (documented by Pew Research 1994-2024) created the conditions for an anti-establishment candidate; Trump\'s presidency then accelerated polarization dramatically. Polarization enabled MAGA by making partisan identity the primary social identity — allowing Trump to maintain Republican support regardless of norm violations (the "5th Avenue" dynamic). MAGA deepened polarization by making policy positions secondary to tribal loyalty, expanding polarization from political elites to mass public opinion. America\'s exceptional polarization compared to other democracies is substantially the Trump/MAGA political project.',
    confidence: 'high' },
  { id: 'political_polarization__vietnam_war',
    source: 'political_polarization', target: 'vietnam_war', type: 'ENABLED',
    label: 'Vietnam was the original culture war — the split between "Silent Majority" hawks and antiwar counterculture permanently realigned American politics',
    note: 'Vietnam created the political polarization template that subsequent American culture wars followed: Nixon\'s "Silent Majority" speech (1969) explicitly framed politics as war between traditional/patriotic America and radical antiwar counterculture. The 1968 Democratic convention riots, the Kent State killings, and the antiwar movement\'s association with countercultural behavior drove working-class white Democrats toward Nixon. This realignment — educated liberals toward Democrats, white working-class voters toward Republicans — is the foundation of today\'s political polarization. The Vietnam-era political trauma created the partisan sorting that 50 years of polarization research documents.',
    confidence: 'high' },
  { id: 'political_polarization__civil_rights_movement',
    source: 'political_polarization', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'The Democratic Party\'s support for civil rights produced the party realignment that created today\'s political polarization geography',
    note: 'The Civil Rights Act (1964) and Voting Rights Act (1965) triggered the party realignment that produced today\'s polarization: LBJ\'s signing of the Civil Rights Act caused the solid Democratic South to shift to the Republican Party over the following 30 years. Nixon\'s Southern Strategy explicitly exploited white Southern resentment of civil rights gains. The result: the Democratic Party became a coalition of racial minorities and educated whites; the Republican Party became predominantly white and less educated. This demographic-ideological sorting — produced by civil rights political realignment — is the structural basis of American political polarization.',
    confidence: 'high' },
];

let added = 0;
for (const e of batch) {
  if (!exIds.has(e.id)) { me.push(e); exIds.add(e.id); added++; }
}
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
console.log('mechanisms/edges: +' + added + ' → ' + me.length);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
me.forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
console.log('Total mech edges:', me.length, '| Orphans:', orphans);
