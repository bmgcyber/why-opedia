#!/usr/bin/env node
// add_mech_enrichment.js
// Adds cross-scope edges to enrich lightly connected mechanism nodes
// and improves connectivity for psychology/history philosophy nodes
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const mechEdges = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const existing = new Set(mechEdges.map(e => e.id));

const batch = [
  // ── healthy_at_every_size / medical_weight_bias (1 connection each) ────────
  { id: 'medical_weight_bias__aids_crisis',
    source: 'medical_weight_bias', target: 'aids_crisis', type: 'ENABLED',
    label: 'Medical weight bias delayed AIDS diagnoses in heavier patients',
    note: 'Medical weight bias in the AIDS crisis led clinicians to attribute weight loss and symptoms to lifestyle choices (diet, overeating) rather than consider HIV, particularly in non-gay-identified men. The bias compounded the structural invisibility of certain patient groups in the epidemic.',
    confidence: 'medium' },

  { id: 'healthy_at_every_size__positive_psychology',
    source: 'healthy_at_every_size', target: 'positive_psychology', type: 'SHARES_MECHANISM_WITH',
    label: 'HAES and positive psychology both contest deficit-focused models of human bodies and minds',
    note: 'Both Health At Every Size (HAES) and positive psychology movements challenge pathology-focused paradigms: HAES contests the BMI-deficit model of health, while positive psychology contests the DSM-deficit model of mental health. Both emphasize functional wellbeing over biomarker normalization and share the mechanism of reframing "health" from absence of pathology to presence of flourishing.',
    confidence: 'medium' },

  // ── pfas_microplastics (1 connection) ─────────────────────────────────────
  { id: 'pfas_microplastics__big_pharma_lobbying',
    source: 'pfas_microplastics', target: 'big_pharma_lobbying', type: 'SHARES_MECHANISM_WITH',
    label: 'PFAS and pharmaceutical industry share the mechanism of regulatory capture through manufactured doubt',
    note: 'The PFAS industry\'s decades-long suppression of contamination evidence mirrors the pharmaceutical industry\'s regulatory capture techniques: funding contradictory science, rotating-door relationships with regulators (EPA in PFAS\'s case, FDA in pharma\'s), and strategic delay of hazard classification. 3M and DuPont\'s PFAS suppression followed the same playbook as tobacco, opioids, and pharmaceutical trials.',
    confidence: 'high' },

  { id: 'pfas_microplastics__leaded_gasoline_cover_up',
    source: 'pfas_microplastics', target: 'leaded_gasoline_cover_up', type: 'SHARES_MECHANISM_WITH',
    label: 'PFAS contamination repeats the leaded gasoline pattern of industry-funded safety claims',
    note: 'Both PFAS (from the 1940s) and tetraethyl lead (from the 1920s) followed the same arc: industry-funded research declaring safety, internal documents showing known hazards, regulatory delays measured in decades, and contamination of populations before public acknowledgment. The mechanism — private profit externalizing public health costs through manufactured scientific doubt — is identical.',
    confidence: 'high' },

  // ── dunning_kruger_effect (1 connection) ──────────────────────────────────
  { id: 'dunning_kruger_effect__qanon',
    source: 'dunning_kruger_effect', target: 'qanon', type: 'ENABLED',
    label: 'QAnon exploited the Dunning-Kruger dynamic: amateur "researchers" felt more competent than professionals',
    note: 'QAnon\'s "research" culture — chan-board users doing amateur open-source intelligence investigations into elite pedophile networks — exemplifies Dunning-Kruger in political conspiracy belief: participants with minimal intelligence experience rated themselves as superior to professional investigators who reached different conclusions. The epistemic loop reinforced overconfidence while suppressing genuine uncertainty.',
    confidence: 'high' },

  { id: 'dunning_kruger_effect__climate_change_denial',
    source: 'dunning_kruger_effect', target: 'climate_change_denial', type: 'ENABLED',
    label: 'Climate denial amplified by Dunning-Kruger: amateur certainty vs. scientific humility',
    note: 'Climate change denial is structurally dependent on Dunning-Kruger dynamics: amateur commentators (politicians, influencers, blog authors) express certainty ("climate has always changed") that trained climate scientists with genuine expertise cannot have. The asymmetry — amateurs\' confident simplifications vs. scientists\' probabilistic uncertainty — gives denial rhetorical advantage in public discourse.',
    confidence: 'high' },

  // ── availability_heuristic (1 connection) ─────────────────────────────────
  { id: 'availability_heuristic__mccarthy_red_scare',
    source: 'availability_heuristic', target: 'mccarthy_red_scare', type: 'ENABLED',
    label: 'McCarthyism operated through the availability heuristic: communist threats felt omnipresent',
    note: 'McCarthyism functioned through systematic availability heuristic manipulation: congressional hearings, HUAC investigations, and media coverage made communist infiltration feel omnipresent. The actual number of Soviet spies, while real, was dwarfed by the perceived threat density. Highly available, emotionally salient examples (Alger Hiss, Rosenbergs) made communists feel everywhere, justifying mass suppression.',
    confidence: 'high' },

  { id: 'availability_heuristic__sept_11_attacks',
    source: 'availability_heuristic', target: 'sept_11_attacks', type: 'ENABLED',
    label: '9/11\'s vivid imagery made terrorism risk availability-heuristic-distorted for decades',
    note: '9/11\'s vivid, repeatedly broadcast imagery made terrorism one of the most availability-heuristic-inflated risks in American history: post-9/11 Americans were more afraid of terrorism (which killed ~3,000/year at peak) than car accidents (43,000/year), medical errors (250,000/year), or domestic violence. The availability heuristic distortion justified the Iraq War, the Patriot Act, and mass surveillance by making the threat feel constant.',
    confidence: 'high' },

  // ── overton_window (2 connections) ────────────────────────────────────────
  { id: 'overton_window__civil_rights_movement',
    source: 'overton_window', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'The Civil Rights Movement systematically moved the Overton window on racial equality',
    note: 'The Civil Rights Movement is the paradigm case of deliberate Overton window expansion: SNCC\'s sit-ins and freedom rides made integration seem more radical than King\'s legislative demands, making King\'s position "moderate." The strategic positioning — movement radicals pull the window, mainstream advocates harvest gains — is the civil rights model for all subsequent social movements.',
    confidence: 'high' },

  { id: 'overton_window__weimar_republic',
    source: 'overton_window', target: 'weimar_republic', type: 'ENABLED',
    label: 'Weimar\'s collapse was partly an Overton window catastrophe: Nazi positions normalized progressively',
    note: 'The Weimar Republic\'s 1919–1933 trajectory shows Overton window collapse in real time: positions acceptable in mainstream politics shifted from social democracy to liberal conservatism to authoritarian nationalism to fascism within 14 years. Each crisis (hyperinflation, Depression) shifted what was "thinkable" rightward. Hitler\'s appointment as chancellor was the endpoint of an Overton window moved by street violence, institutional compromise, and manufactured crises.',
    confidence: 'high' },

  { id: 'overton_window__culture_wars',
    source: 'overton_window', target: 'culture_wars', type: 'ENABLED',
    label: 'Culture wars are fought primarily by moving the Overton window on contested social norms',
    note: 'Culture wars are definitionally Overton window battles: both sides attempt to make certain positions (LGBTQ+ rights, abortion restriction, immigration limits, affirmative action) either "normal" or "unthinkable." Conservative media ecosystems (Fox News, talk radio, social media) and progressive institutional capture (universities, professional associations) are mechanisms for moving the window in opposing directions.',
    confidence: 'high' },

  // ── christian_nationalism (2 connections) ─────────────────────────────────
  { id: 'christian_nationalism__january_6_capitol',
    source: 'christian_nationalism', target: 'january_6_capitol', type: 'ENABLED',
    label: 'Christian nationalist theology was visibly present at the January 6 attack',
    note: 'The January 6 Capitol attack featured visible Christian nationalist iconography: wooden crosses, "Jesus Saves" signs, "God, Guns, Trump" flags, and prayers in the Senate chamber. Christian nationalist leaders had been arguing for months that the 2020 election was a spiritual war against godless communism. January 6 represents Christian nationalism as political violence.',
    confidence: 'high' },

  { id: 'christian_nationalism__manifest_destiny',
    source: 'christian_nationalism', target: 'manifest_destiny', type: 'ENABLED',
    label: 'Manifest Destiny is the 19th-century form of Christian nationalist territorial theology',
    note: 'Manifest Destiny was Christian nationalism applied to continental expansion: the belief that American Protestant settlers were divinely chosen to occupy the continent expressed the same theological logic as contemporary Christian nationalism. God\'s covenant with America (Protestant, Anglo-Saxon, democratic) justified dispossession of native peoples and war with Mexico as fulfillment of divine purpose.',
    confidence: 'high' },

  // ── prosperity_gospel (2 connections) ─────────────────────────────────────
  { id: 'prosperity_gospel__mass_incarceration',
    source: 'prosperity_gospel', target: 'mass_incarceration', type: 'ENABLED',
    label: 'Prosperity gospel theology enabled moral disengagement from mass incarceration\'s poverty roots',
    note: 'Prosperity gospel theology — that financial success reflects divine favor and poverty reflects sin or spiritual failure — provided moral cover for mass incarceration: if poverty is a moral failing, criminalizing poverty-adjacent behaviors (drug use, loitering, failure to pay fines) is just divine justice applied by the state. The theology made incarceration\'s class targeting invisible as moral management.',
    confidence: 'medium' },

  { id: 'prosperity_gospel__televangelism',
    source: 'prosperity_gospel', target: 'televangelism', type: 'PRODUCED',
    label: 'Televangelism is prosperity gospel\'s media delivery mechanism',
    note: 'Televangelism (Oral Roberts, Jim Bakker, Jimmy Swaggart, Kenneth Copeland, Joel Osteen) is prosperity gospel\'s industrialization: television enabled the seed-faith theology\'s donation-as-investment model to reach millions. The format — televised healing, miraculous testimonies, donation requests with promised returns — is prosperity gospel operationalized as a media product. Televangelism scandals (Bakker, Swaggart) revealed the theology\'s financial logic.',
    confidence: 'high' },

  // ── mosaic_covenant (2 connections) ───────────────────────────────────────
  { id: 'mosaic_covenant__second_temple_period',
    source: 'mosaic_covenant', target: 'second_temple_period', type: 'ENABLED',
    label: 'The Second Temple period was defined by reinterpretation and codification of the Mosaic covenant',
    note: 'The Second Temple period\'s religious innovations — Pharisaic oral Torah, synagogue prayer, scribal culture — were all mechanisms for adapting the Mosaic covenant to diaspora conditions without a Temple. The covenant\'s terms (land, Temple, king) were all absent; Torah interpretation became the covenant\'s survival mechanism. Post-exilic Judaism is Mosaic covenant theology adapted to statelessness.',
    confidence: 'high' },

  { id: 'mosaic_covenant__nicene_creed',
    source: 'mosaic_covenant', target: 'nicene_creed', type: 'ENABLED',
    label: 'The Nicene Creed replaced the Mosaic covenant\'s conditional contract with unconditional trinitarian dogma',
    note: 'The theological transition from Mosaic covenant (conditional: obey the law, receive blessing) to Nicene Christianity (unconditional: believe in the Trinity, receive salvation) reflects the fundamental transformation of Jewish covenant theology into Christian doctrinal orthodoxy. The Nicene Creed\'s formulations directly addressed the Mosaic-era Jewish-Christian split over covenant versus grace.',
    confidence: 'medium' },

  // ── usury_prohibition (2 connections) ─────────────────────────────────────
  { id: 'usury_prohibition__jewish_moneylending',
    source: 'usury_prohibition', target: 'jewish_moneylending', type: 'CAUSED',
    label: 'Christian usury prohibition created the Jewish moneylending niche by exclusion',
    note: 'The canonical relationship: Christian usury prohibition (based on Deuteronomy\'s in-group/out-group lending distinction, amplified by medieval canonists) made moneylending a sin for Christians, creating a structural vacuum. Jews, excluded from guilds and land ownership, filled this vacuum. The prohibition did not prevent usury — it displaced it to a minority population, enabling both the financial function and the antisemitic resentment of Jewish moneylenders.',
    confidence: 'high' },

  // ── dependent_origination (2 connections) ─────────────────────────────────
  { id: 'dependent_origination__buddhist_spread_east_asia',
    source: 'dependent_origination', target: 'buddhist_spread_east_asia', type: 'ENABLED',
    label: 'Dependent origination\'s cultural adaptability enabled Buddhism\'s spread across East Asia',
    note: 'Dependent origination — the doctrine that all phenomena arise in dependence on conditions — made Buddhism unusually adaptable to local cultures during its East Asian spread: rather than asserting a fixed divine order, dependent origination implied that religious practice itself arises conditionally and can take culturally appropriate forms. This doctrinal flexibility (expressed as "skillful means") enabled Chinese Chan, Japanese Zen, Tibetan Vajrayana, and Korean Son as distinct but related adaptations.',
    confidence: 'high' },

  // ── wu_wei (2 connections) ─────────────────────────────────────────────────
  { id: 'wu_wei__chan_zen_buddhism',
    source: 'wu_wei', target: 'chan_zen_buddhism', type: 'SHARES_MECHANISM_WITH',
    label: 'Wu wei and Zen share the mechanism of non-striving and spontaneous natural action',
    note: 'Taoist wu wei and Chan/Zen Buddhism share the core mechanism of non-forceful, spontaneous action aligned with natural reality: Zen\'s "no-mind" (mushin) and Taoist "non-action" both point to the same experiential state of effortless engagement. The Zen tradition explicitly incorporated Taoist concepts during the Tang dynasty\'s Chan-Taoist synthesis, producing the distinctively East Asian Buddhism that emphasizes naturalness over Indian scholasticism.',
    confidence: 'high' },

  // ── legalism_chinese (2 connections) ──────────────────────────────────────
  { id: 'legalism_chinese__qin_dynasty',
    source: 'legalism_chinese', target: 'qin_dynasty', type: 'ENABLED',
    label: 'Legalism was the official state philosophy that enabled the Qin unification of China',
    note: 'Qin Shi Huang\'s unification of China (221 BCE) was premised on Legalist philosophy: Shang Yang\'s state-building reforms (standardized law, merit-based bureaucracy, harsh punishments, centralized control, suppression of Confucian moralism) made Qin the most militarily effective state. Legalism\'s short-term effectiveness and long-term instability (Qin collapse 207 BCE) defined the Chinese political debate between rule of law and rule of virtue for two millennia.',
    confidence: 'high' },

  { id: 'legalism_chinese__confucian_social_order',
    source: 'legalism_chinese', target: 'confucian_social_order', type: 'SHARES_MECHANISM_WITH',
    label: 'Chinese Legalism and Confucian order debated the same question: law or virtue as the basis of governance',
    note: 'The Confucian-Legalist debate (Han Fei Tzu vs. Confucius and Mencius) is Chinese political philosophy\'s foundational tension: can human nature be governed through external incentives and punishments (Legalism) or through internalized moral cultivation (Confucianism)? The tension was "resolved" by the Han synthesis: Confucian ideology externally, Legalist administrative technique internally — a synthesis that structured Chinese governance for two millennia.',
    confidence: 'high' },

  // ── advaita_vedanta (2 connections) ───────────────────────────────────────
  { id: 'advaita_vedanta__platonic_idealism',
    source: 'advaita_vedanta', target: 'platonic_idealism', type: 'SHARES_MECHANISM_WITH',
    label: 'Advaita Vedanta and Platonic idealism share the mechanism of appearance-reality distinction',
    note: 'Advaita Vedanta (Shankara, 8th century CE) and Platonic idealism share the foundational claim that ordinary perception is delusion: for Plato, the material world is shadows of ideal Forms; for Shankara, the apparent multiplicity of individual selves (jivas) and world (maya/illusion) conceals the non-dual reality of Brahman. Both traditions arrived independently at the appearance/reality distinction as the central problem of knowledge.',
    confidence: 'high' },

  // ── jewish_moneylending (2 connections) ───────────────────────────────────
  { id: 'jewish_moneylending__pogroms',
    source: 'jewish_moneylending', target: 'pogroms', type: 'ENABLED',
    label: 'Jewish moneylending association provided the economic resentment fueling pogroms',
    note: 'The structural association of Jews with moneylending — created by Christian usury prohibition — made Jewish communities economically visible targets during financial distress. Pogroms frequently followed debt crises, harvest failures, or economic shocks: debtors who owed Jewish creditors could cancel debts through violence. The moneylending niche was thus both the product of exclusion and a mechanism for periodic mob violence against Jewish communities.',
    confidence: 'high' },

  // ── egyptian_monotheism / mesopotamian_agriculture ────────────────────────
  { id: 'egyptian_monotheism__mosaic_covenant',
    source: 'egyptian_monotheism', target: 'mosaic_covenant', type: 'ENABLED',
    label: 'Akhenaten\'s monotheism may have influenced the development of Mosaic monotheism',
    note: 'The scholarly debate over Akhenaten\'s Aten monotheism (c. 1353–1336 BCE) and its possible influence on Mosaic monotheism is inconclusive but historically significant: Sigmund Freud\'s "Moses and Monotheism" argued Moses was an Atenist priest. More cautiously: the Amarna period established that monotheism was historically conceivable in the Egyptian-Canaanite cultural sphere, making the emergence of Israelite monotheism less isolated.',
    confidence: 'medium' },

  { id: 'mesopotamian_agriculture__neo_babylonian_empire',
    source: 'mesopotamian_agriculture', target: 'neo_babylonian_empire', type: 'ENABLED',
    label: 'Mesopotamian agricultural surplus was the economic foundation of Neo-Babylonian imperial power',
    note: 'The Neo-Babylonian Empire (625–539 BCE) — Nebuchadnezzar\'s Babylon — rested on the agricultural surplus of the Tigris-Euphrates floodplain, the world\'s most productive preindustrial agriculture. Babylonian temple estates, irrigation bureaucracy, and grain storage created the surplus that funded the army that destroyed Jerusalem and the architectural program that produced the Hanging Gardens. Mesopotamian agriculture = imperial power.',
    confidence: 'high' },

  { id: 'mesopotamian_agriculture__assyrian_empire',
    source: 'mesopotamian_agriculture', target: 'assyrian_empire', type: 'ENABLED',
    label: 'Assyrian imperial expansion was driven by extraction of Mesopotamian agricultural regions',
    note: 'The Neo-Assyrian Empire\'s military expansion followed an agricultural logic: conquest of Mesopotamian river valleys, Levantine grain regions, and Egyptian delta provided the tribute (grain, timber, metal, labor) to sustain the world\'s first professional standing army. Assyrian administrative innovations (tribute assessment, deportation for agricultural labor) show how Mesopotamian agriculture structured imperial expansion.',
    confidence: 'high' },
];

let added = 0;
for (const e of batch) {
  if (!existing.has(e.id)) { mechEdges.push(e); existing.add(e.id); added++; }
}
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(mechEdges, null, 2));
console.log('Added:', added, '| Total mech edges:', mechEdges.length);

// Integrity check
const allIds = new Set();
const scopes = ['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'];
for (const s of scopes) JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id));
let orphans = 0;
for (const e of mechEdges) {
  if (allIds.has(e.source) === false) { console.log('ORPHAN src:', e.source); orphans++; }
  if (allIds.has(e.target) === false) { console.log('ORPHAN tgt:', e.target); orphans++; }
}
console.log('Orphans:', orphans);
