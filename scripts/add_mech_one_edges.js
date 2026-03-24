#!/usr/bin/env node
// add_mech_one_edges.js — adds cross-scope edges for mechanism nodes with only 1 connection
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const exIds = new Set(me.map(e => e.id));

const batch = [
  // ── purdue_pharma_oxycontin ───────────────────────────────────────────────
  { id: 'purdue_pharma_oxycontin__big_pharma_lobbying',
    source: 'big_pharma_lobbying', target: 'purdue_pharma_oxycontin', type: 'ENABLED',
    label: 'Pharmaceutical lobbying created the regulatory capture that allowed Purdue\'s OxyContin deception to persist',
    note: 'The Purdue/OxyContin fraud required specific regulatory capture: the FDA\'s 1995 approval of OxyContin with the \"less addictive\" label was enabled by PDUFA\'s industry-pays-FDA-fees model, which created pressure to approve drugs on industry-submitted data. Congressional lobbying by pharma delayed regulatory action for 20+ years after addiction signals were clear. Purdue hired FDA reviewers (revolving door). Big pharma lobbying created the specific institutional vulnerabilities the OxyContin scheme required.',
    confidence: 'high' },
  { id: 'purdue_pharma_oxycontin__war_on_drugs',
    source: 'purdue_pharma_oxycontin', target: 'war_on_drugs', type: 'SHARES_MECHANISM_WITH',
    label: 'Both criminalized the poor addicted while shielding wealthy manufacturers — identical class-based enforcement',
    note: 'The OxyContin scandal and the War on Drugs reveal identical class-based enforcement: Black and Brown crack cocaine users received mandatory minimums while Purdue executives received deferred prosecution agreements (2007 plea) and consulting contracts; OxyContin addicts (initially white, rural) eventually faced the same mass incarceration as crack users. The Sackler family paid $4.5 billion (from a $10+ billion fortune) and faced no criminal conviction. War on Drugs enforcement targeted street users; Purdue\'s marketing targeted prescribers. Same drug policy, different class enforcement.',
    confidence: 'high' },

  // ── opioid_epidemic ───────────────────────────────────────────────────────
  { id: 'opioid_epidemic__war_on_drugs',
    source: 'opioid_epidemic', target: 'war_on_drugs', type: 'SHARES_MECHANISM_WITH',
    label: 'Opioid epidemic and War on Drugs are simultaneous government policies producing and criminalizing the same addiction',
    note: 'The opioid epidemic and the War on Drugs operated simultaneously and contradictorily: government (FDA, DEA, state prescribing guidelines) enabled pharmaceutical companies to flood rural communities with OxyContin while simultaneously criminally prosecuting addiction with the same enforcement infrastructure used against crack cocaine. The contradiction reveals that drug policy was never about health: it was about which drugs and which populations were criminalized vs. medicated. The opioid crisis forced a partial policy shift when the affected population was predominantly white.',
    confidence: 'high' },
  { id: 'opioid_epidemic__military_industrial_complex',
    source: 'opioid_epidemic', target: 'military_industrial_complex', type: 'ENABLED',
    label: 'Combat trauma and injury created massive veteran opioid demand; VA and military medical systems were primary distribution channels',
    note: 'The Iraq and Afghanistan wars (2001-2021) generated massive combat injury and PTSD requiring pain management, making veterans a primary opioid-prescribed population. VA hospitals and military medicine were major OxyContin and opioid distribution channels: veterans received opioids at 2x the rate of civilian patients. The military-industrial complex\'s wars created the combat trauma population that pharmaceutical companies targeted. Veterans\' prescription rates and subsequent addiction/suicide statistics are the opioid epidemic\'s most visible human cost in the post-9/11 era.',
    confidence: 'high' },

  // ── advaita_vedanta ───────────────────────────────────────────────────────
  { id: 'advaita_vedanta__self_help_industry',
    source: 'advaita_vedanta', target: 'self_help_industry', type: 'ENABLED',
    label: 'Advaita Vedanta\'s non-dual awareness teaching was the philosophical source appropriated by Western mindfulness/wellness industry',
    note: 'The Western wellness and mindfulness industry (MBSR, yoga, non-dual awareness coaching) is substantially appropriated Advaita Vedanta, stripped of its religious context: the teaching that individual consciousness (Atman) is identical with universal consciousness (Brahman) — and that suffering arises from misidentification with separate selfhood — is the philosophical basis of non-dual meditation practices now sold as secular wellness. Eckhart Tolle\'s \"Power of Now,\" Sam Harris\'s meditation app, and most yoga philosophy are popularized Advaita. The self-help industry monetized what Shankara systematized.',
    confidence: 'high' },
  { id: 'advaita_vedanta__chan_zen_buddhism',
    source: 'advaita_vedanta', target: 'chan_zen_buddhism', type: 'SHARES_MECHANISM_WITH',
    label: 'Both traditions center on direct non-conceptual awareness of the absolute, challenging scholastic commentary traditions',
    note: 'Advaita Vedanta (non-dual Hindu philosophy, systematized by Shankara c. 700 CE) and Chan/Zen Buddhism share a structural family resemblance: both assert that ultimate reality is non-dual consciousness; both reject the mediating role of scriptures and conceptual analysis in favor of direct experience; both produced paradox-using teaching methods (Advaita: neti neti [not this, not this]; Zen: koans) designed to short-circuit conceptual understanding. The similarities produced extensive Hindu-Buddhist dialogue and mutual influence, particularly in Madhyamaka-Vedanta exchanges.',
    confidence: 'high' },
  { id: 'advaita_vedanta__positive_psychology',
    source: 'advaita_vedanta', target: 'positive_psychology', type: 'ENABLED',
    label: 'Positive psychology\'s acceptance and self-transcendence concepts derive substantially from Vedantic philosophy',
    note: 'Positive psychology\'s key constructs — acceptance (vs. resistance), self-compassion, transcending ego-identification, flow states, and the concept that suffering arises from attachment to outcomes — are Vedantic concepts translated into secular psychological language. Maslow\'s peak experiences and self-transcendence were explicitly influenced by Vedanta (he corresponded with Swami Vivekananda\'s successors). MBSR founder Jon Kabat-Zinn studied Zen, but the acceptance framework draws on Vedantic non-dual awareness. Positive psychology is partially applied Vedanta.',
    confidence: 'medium' },

  // ── religious_trauma ──────────────────────────────────────────────────────
  { id: 'religious_trauma__cult_dynamics',
    source: 'religious_trauma', target: 'cult_dynamics', type: 'SHARES_MECHANISM_WITH',
    label: 'Both produce identical trauma symptoms: identity dissolution, authority submission, and difficulty trusting independent judgment',
    note: 'Religious trauma syndrome (coined by Marlene Winell, 2011) and cult exit trauma share identical symptom profiles: PTSD-like responses, inability to make independent decisions (having surrendered decision-making to religious authority), distrust of one\'s own perceptions, and profound identity loss when the religious framework collapses. The mechanism is identical because high-control religion and cults are the same phenomenon on a spectrum: both use thought control, authority submission, and identity replacement. The clinical treatment protocols for cult exit and religious trauma overlap substantially.',
    confidence: 'high' },
  { id: 'religious_trauma__evangelical_christianity',
    source: 'religious_trauma', target: 'evangelical_christianity', type: 'ENABLED',
    label: 'Evangelical Christianity\'s high-control doctrines produce measurable religious trauma at scale in the US',
    note: 'Religious trauma syndrome is documented primarily in evangelical Christian contexts in the US: purity culture (sexual shame, body guilt), hell threat, biblical inerrancy enforcement, and prayer over medicine practices produce measurable psychological harm studied by trauma-informed clinicians. The \"ex-vangelical\" and \"deconstruction\" movements represent millions of Americans processing religious trauma from evangelical upbringings. Evangelical Christianity\'s cultural reach means that religious trauma is not a marginal phenomenon but a documented public health concern affecting tens of millions.',
    confidence: 'high' },

  // ── egyptian_monotheism ───────────────────────────────────────────────────
  { id: 'egyptian_monotheism__rise_of_christianity',
    source: 'egyptian_monotheism', target: 'rise_of_christianity', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent monotheistic revolutions that displaced polytheistic cultures through elite state imposition',
    note: 'Akhenaten\'s Atenism (c. 1353–1336 BCE) and early Christianity share the structural pattern of monotheistic revolution: displacement of established polytheistic traditions, centering religious life on a single deity, and state coercion as the primary enforcement mechanism. Both also experienced backlash after the founding figure\'s death (Akhenaten\'s temples were destroyed, his name erased; Christianity was periodically persecuted). Some scholars (Freud\'s Moses and Monotheism; James Henry Breasted) argue Atenism directly influenced Mosaic monotheism and thus the Abrahamic tradition.',
    confidence: 'medium' },
  { id: 'egyptian_monotheism__mosaic_covenant',
    source: 'egyptian_monotheism', target: 'mosaic_covenant', type: 'SHARES_MECHANISM_WITH',
    label: 'Scholarly debate on whether Akhenaten\'s monotheism influenced Mosaic monotheism through Egyptian-Israelite contact',
    note: 'The relationship between Akhenaten\'s Aten monotheism and Mosaic monotheism is one of the most debated questions in ancient religion. Freud\'s \"Moses and Monotheism\" (1939) argued Moses was an Egyptian Atenist priest. Modern Egyptologists (Jan Assmann) argue for \"cultural memory\" transmission. The structural similarities — single deity, rejection of images, ethical monotheism — suggest either direct influence or parallel development under similar conditions. The question is not resolved, but the parallelism demonstrates that monotheism was possible in Egyptian as well as Israelite contexts.',
    confidence: 'medium' },

  // ── greek_mythology ───────────────────────────────────────────────────────
  { id: 'greek_mythology__hellenistic_philosophy',
    source: 'greek_mythology', target: 'hellenistic_philosophy', type: 'ENABLED',
    label: 'Greek mythology provided the narrative framework that Hellenistic philosophy both drew on and systematically rationalized',
    note: 'Hellenistic philosophy (Stoicism, Epicureanism, Neo-Platonism) engaged continuously with Greek mythology: the Stoics allegorized the myths as accounts of natural processes (Zeus = fire/logos, Poseidon = water); Epicureans used myths to demonstrate that the gods were not involved in human affairs; Neo-Platonists (Porphyry, Iamblichus) used myths as philosophical allegories for metaphysical processes. Greek mythology was not abandoned by philosophers but reinterpreted — serving as the cultural raw material that philosophical systems worked with and against.',
    confidence: 'high' },
  { id: 'greek_mythology__pre_socratic_philosophy',
    source: 'greek_mythology', target: 'pre_socratic_philosophy', type: 'ENABLED',
    label: 'Pre-Socratics explicitly rejected mythological explanation in favor of natural causes — a direct reaction to mythology',
    note: 'The pre-Socratic project (Thales, Anaximander, Heraclitus, c. 600-450 BCE) was explicitly anti-mythological: replacing the Olympian gods\' capricious interventions with natural principles (water, apeiron, fire, atoms). Xenophanes attacked anthropomorphic gods directly; Anaxagoras was prosecuted for arguing the sun was a hot stone rather than Helios\'s chariot. The pre-Socratics are what philosophy looks like when it first separates from mythology — and that separation required mythology to already be the dominant explanatory framework.',
    confidence: 'high' },

  // ── availability_heuristic ────────────────────────────────────────────────
  { id: 'availability_heuristic__anti_vaccination_movement',
    source: 'availability_heuristic', target: 'anti_vaccination_movement', type: 'ENABLED',
    label: 'Anecdotal vaccine injury stories trigger availability heuristic, making parents overestimate rare adverse events',
    note: 'The availability heuristic is the primary cognitive mechanism behind vaccine hesitancy: a parent reads a vivid anecdote about a child allegedly harmed by a vaccine and this emotionally salient story makes vaccine injury feel common, while the 1-in-million actual adverse event rate is abstract and hard to imagine. Cognitive scientists document that vaccine-hesitant parents consistently overestimate vaccine adverse event rates by 10-100x — the availability heuristic operating on anecdotes vs. epidemiological statistics that lack emotional salience. The anecdote systematically beats the data because of how human cognition works.',
    confidence: 'high' },
  { id: 'availability_heuristic__war_on_drugs',
    source: 'availability_heuristic', target: 'war_on_drugs', type: 'ENABLED',
    label: 'Crack cocaine moral panic was driven by availability heuristic: vivid crime reporting made drug crime feel epidemic',
    note: 'The 1980s crack cocaine moral panic — which produced mandatory minimum sentencing laws and the War on Drugs — was availability heuristic dynamics: sensational media coverage of crack-related violence made drug crime feel pervasive, leading Congress to pass dramatically punitive legislation (100:1 crack vs. powder cocaine sentencing disparity) based on perceived epidemic rather than actual crime statistics. The crack epidemic was real but dramatically overstated in policy response. The availability heuristic converted vivid media coverage into catastrophically disproportionate criminal policy.',
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
