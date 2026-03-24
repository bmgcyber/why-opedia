#!/usr/bin/env node
// Add cross-scope mechanism edges and fix scapegoating duplicate
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

// ── 1. Fix scapegoating_mechanism → scapegoating ─────────────────────────────
{
  const nodes = JSON.parse(fs.readFileSync(D('data/mechanisms/nodes.json')));
  // Remove scapegoating_mechanism, keep scapegoating
  const filtered = nodes.filter(n => n.id !== 'scapegoating_mechanism');
  fs.writeFileSync(D('data/mechanisms/nodes.json'), JSON.stringify(filtered, null, 2));
  console.log('Removed scapegoating_mechanism duplicate');

  // Update edges: rename scapegoating_mechanism → scapegoating
  const edges = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
  let renamed = 0;
  for (const e of edges) {
    if (e.source === 'scapegoating_mechanism') { e.source = 'scapegoating'; renamed++; }
    if (e.target === 'scapegoating_mechanism') { e.target = 'scapegoating'; renamed++; }
    // Also fix edge IDs containing the old name
    if (e.id && e.id.includes('scapegoating_mechanism')) {
      e.id = e.id.replace(/scapegoating_mechanism/g, 'scapegoating');
    }
  }
  fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(edges, null, 2));
  console.log('Updated '+renamed+' edge endpoint references to scapegoating');
}

// ── 2. New cross-scope edges ──────────────────────────────────────────────────
const edges = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const existingIds = new Set(edges.map(e => e.id));

const newEdges = [
  // ── Media ─────────────────────────────────────────────────────────────────
  {
    id: 'manufactured_consent__edward_bernays',
    source: 'manufactured_consent', target: 'edward_bernays',
    type: 'ENABLED',
    label: 'Bernays operationalized manufactured consent',
    note: 'Bernays\' PR techniques — staging pseudo-events, using third-party authorities, exploiting unconscious desire — were the first systematic industrial application of Lippmann\'s manufactured consent concept. He turned the theory into a profession.',
    confidence: 'high'
  },
  {
    id: 'manufactured_consent__walter_lippmann',
    source: 'manufactured_consent', target: 'walter_lippmann',
    type: 'ENABLED',
    label: 'Lippmann\'s theory became the intellectual basis for manufactured consent',
    note: 'Lippmann\'s Public Opinion (1922) argued that mass democracy required expert management of public perception — the "pictures in our heads" that mediate reality. This framework directly enabled the PR industry and Bernays\' application of consent manufacture.',
    confidence: 'high'
  },
  {
    id: 'outrage_optimization__yellow_journalism',
    source: 'outrage_optimization', target: 'yellow_journalism',
    type: 'ENABLED',
    label: 'Yellow journalism pioneered outrage as circulation strategy',
    note: 'Hearst and Pulitzer newspapers established that emotional outrage, scandal, and patriotic fury drove circulation. This proto-algorithm — maximize emotional arousal for commercial gain — is structurally identical to social media engagement optimization a century later.',
    confidence: 'high'
  },
  {
    id: 'moral_panic__yellow_journalism',
    source: 'moral_panic', target: 'yellow_journalism',
    type: 'ENABLED',
    label: 'Yellow journalism manufactured moral panics as news events',
    note: 'Sensationalist coverage of crime, immigration, and foreign threats created artificial moral panics that inflamed public opinion and drove political action (e.g., the Spanish-American War). The media as moral panic machine has structural predecessors in 1890s yellow journalism.',
    confidence: 'high'
  },
  {
    id: 'cultural_hegemony__printing_press',
    source: 'cultural_hegemony', target: 'printing_press',
    type: 'ENABLED',
    label: 'Printing press enabled both hegemonic control and counter-hegemonic disruption',
    note: 'The printing press first strengthened state and church hegemony by enabling standardized texts, then undermined it by enabling unauthorized dissemination of Reformation pamphlets, Enlightenment philosophy, and nationalist newspapers. Each new media technology creates new hegemonic configurations.',
    confidence: 'high'
  },
  {
    id: 'moral_panic__war_of_worlds_broadcast',
    source: 'moral_panic', target: 'war_of_worlds_broadcast',
    type: 'ENABLED',
    label: 'The broadcast became a foundational moral panic about media power',
    note: 'The War of the Worlds broadcast — and especially the newspaper-amplified panic about mass panic — exemplifies the moral panic structure: a triggering event, moral entrepreneurs (newspaper editors), exaggerated danger framing, and lasting folk memory that shapes media regulation debates.',
    confidence: 'high'
  },
  {
    id: 'outrage_optimization__rupert_murdoch',
    source: 'outrage_optimization', target: 'rupert_murdoch',
    type: 'ENABLED',
    label: 'Murdoch industrialized outrage as a news business model',
    note: 'Murdoch\'s tabloid strategy — emotional outrage, celebrity scandal, political enemies — systematically deployed outrage optimization. Fox News applied this to political media, discovering that partisan fear and anger are more profitable than neutral information.',
    confidence: 'high'
  },
  {
    id: 'political_polarization__rupert_murdoch',
    source: 'political_polarization', target: 'rupert_murdoch',
    type: 'ENABLED',
    label: 'Murdoch\'s media empire accelerated political polarization',
    note: 'Fox News under Murdoch reshaped Republican political identity, making it harder for the party to accept electoral results that contradicted its narrative (Dominion litigation). The model of news as partisan identity reinforcement spread globally.',
    confidence: 'high'
  },
  {
    id: 'filter_bubble__cambridge_analytica',
    source: 'filter_bubble', target: 'cambridge_analytica',
    type: 'ENABLED',
    label: 'Cambridge Analytica weaponized filter bubbles for political targeting',
    note: 'Cambridge Analytica exploited the filter bubble structure of social media — users\' existing values and anxieties — to micro-target political messaging. Filter bubbles made psychographic targeting possible: the user had already self-sorted into persuadable segments.',
    confidence: 'high'
  },
  {
    id: 'social_media_algorithms__cambridge_analytica',
    source: 'social_media_algorithms', target: 'cambridge_analytica',
    type: 'ENABLED',
    label: 'Social media platform algorithms provided the data substrate for CA',
    note: 'Cambridge Analytica was possible because Facebook\'s algorithms and data architecture made personality-predicting data available through third-party apps. Without the algorithmic data collection infrastructure, the psychographic targeting model was impossible.',
    confidence: 'high'
  },
  {
    id: 'broken_epistemology__deepfakes',
    source: 'broken_epistemology', target: 'deepfakes',
    type: 'ENABLED',
    label: 'Deepfakes accelerate epistemic breakdown by invalidating video evidence',
    note: 'Deepfakes don\'t just produce false content — they undermine all video evidence by making it plausibly deniable. The liar\'s dividend: real footage can be dismissed as synthetic. This accelerates the broken epistemology condition where no shared evidence base exists.',
    confidence: 'high'
  },
  {
    id: 'info_ecosystem_collapse__deepfakes',
    source: 'info_ecosystem_collapse', target: 'deepfakes',
    type: 'ENABLED',
    label: 'Deepfakes contribute to information ecosystem collapse',
    note: 'Synthetic media that cannot be reliably distinguished from authentic footage degrades the shared epistemic commons. Information ecosystems require some baseline of verifiable evidence; deepfakes erode this baseline, accelerating the condition of total epistemic fragmentation.',
    confidence: 'high'
  },
  {
    id: 'manufactured_consent__rt_russia_today',
    source: 'manufactured_consent', target: 'rt_russia_today',
    type: 'ENABLED',
    label: 'RT operationalized firehose-of-falsehood consent manufacture',
    note: 'RT does not try to persuade audiences to a single position (the classic Bernays model) but rather to generate confusion and cynicism — a postmodern manufactured consent in which the goal is not belief but doubt. The result is equally effective: populations unable to form coherent political resistance.',
    confidence: 'high'
  },
  {
    id: 'info_ecosystem_collapse__rt_russia_today',
    source: 'info_ecosystem_collapse', target: 'rt_russia_today',
    type: 'ENABLED',
    label: 'RT\'s firehose doctrine accelerates information ecosystem collapse',
    note: 'The firehose of falsehood doctrine — flood the zone with contradictory claims rather than advance a single narrative — is a deliberate strategy to collapse the shared information ecosystem. It works not by convincing but by exhausting the audience\'s ability to distinguish truth from noise.',
    confidence: 'high'
  },
  {
    id: 'cultural_hegemony__cuneiform',
    source: 'cultural_hegemony', target: 'cuneiform',
    type: 'ENABLED',
    label: 'Cuneiform enabled early administrative and ideological hegemony',
    note: 'Cuneiform writing first served administrative control (tracking grain, labor, debt) before expanding to religious and literary texts. Writing systems are instruments of hegemony: they standardize the language of power, record debts and obligations, and canonize the myths of the dominant group.',
    confidence: 'high'
  },
  {
    id: 'cultural_hegemony__egyptian_hieroglyphics',
    source: 'cultural_hegemony', target: 'egyptian_hieroglyphics',
    type: 'ENABLED',
    label: 'Hieroglyphics encoded and perpetuated pharaonic hegemony',
    note: 'Egyptian hieroglyphics were controlled writing — literacy restricted to scribal and priestly classes, content dominated by royal decree and divine order. The monumental scale (temple walls, obelisks) was itself a hegemonic technology: the state inscribed its authority permanently into the landscape.',
    confidence: 'high'
  },

  // ── Health ────────────────────────────────────────────────────────────────
  {
    id: 'opioid_epidemic__opioid_crisis',
    source: 'opioid_epidemic', target: 'opioid_crisis',
    type: 'CAUSED',
    label: 'The opioid epidemic mechanism produced the US opioid crisis',
    note: 'The opioid epidemic phenomenon (pharmaceutical industry manipulation of prescribing culture, regulatory capture, and the pain management ideology) directly caused the opioid crisis event: 500,000+ deaths in the US, three successive overdose waves, and the devastation of deindustrialized communities.',
    confidence: 'high'
  },
  {
    id: 'corporate_regulatory_capture__purdue_pharma',
    source: 'corporate_regulatory_capture', target: 'purdue_pharma',
    type: 'ENABLED',
    label: 'Regulatory capture allowed Purdue\'s fraudulent marketing to persist',
    note: 'Purdue Pharma\'s operation depended on captured regulatory processes: FDA approval of misleading OxyContin labeling, purchased academic credibility through funded research, and a revolving door between the DEA and the pharmaceutical industry that slowed enforcement.',
    confidence: 'high'
  },
  {
    id: 'institutional_credibility_laundering__purdue_pharma',
    source: 'institutional_credibility_laundering', target: 'purdue_pharma',
    type: 'ENABLED',
    label: 'Purdue laundered commercial claims through academic and medical credibility',
    note: 'Purdue\'s central strategy was institutional credibility laundering: funding pain management research, sponsoring medical education, and cultivating Key Opinion Leaders to repeat commercial claims in peer-reviewed contexts. False claims about addiction rates became "science" through credibility laundering.',
    confidence: 'high'
  },
  {
    id: 'manufactured_scientific_doubt__purdue_pharma',
    source: 'manufactured_scientific_doubt', target: 'purdue_pharma',
    type: 'ENABLED',
    label: 'Purdue manufactured scientific doubt about OxyContin\'s addiction potential',
    note: 'Purdue replicated the tobacco playbook: funding studies designed to produce ambiguous results, selectively publishing positive data, and using the appearance of scientific controversy to delay regulatory action. The "1% addiction rate" claim was manufactured doubt.',
    confidence: 'high'
  },
  {
    id: 'structural_violence__aids_crisis',
    source: 'structural_violence', target: 'aids_crisis',
    type: 'ENABLED',
    label: 'Structural violence through stigma and state neglect shaped the AIDS crisis',
    note: 'The AIDS crisis was shaped by structural violence: the Reagan administration\'s deliberate inaction, the stigmatization of gay men as deserving of disease, and the channeling of public health resources away from affected communities. Structural violence does not require individual intent — it is embedded in institutional response patterns.',
    confidence: 'high'
  },
  {
    id: 'in_group_out_group_dynamics__aids_crisis',
    source: 'in_group_out_group_dynamics', target: 'aids_crisis',
    type: 'ENABLED',
    label: 'In-group/out-group stigma delayed government response to AIDS',
    note: 'AIDS was coded as an out-group disease (gay men, IV drug users, Haitians) which enabled the in-group (straight Americans, government officials) to define it as not their problem. This in-group/out-group framing is directly traceable to preventable deaths from delayed research and public health action.',
    confidence: 'high'
  },
  {
    id: 'structural_violence__deinstitutionalization',
    source: 'structural_violence', target: 'deinstitutionalization',
    type: 'ENABLED',
    label: 'Deinstitutionalization produced structural violence through funding failures',
    note: 'Psychiatric deinstitutionalization transferred structural violence from institutions to streets and prisons. The community mental health infrastructure that was promised was never funded. The structural violence was invisible precisely because it was distributed across homelessness, incarceration, and individual families — not concentrated in identifiable institutions.',
    confidence: 'high'
  },
  {
    id: 'mass_incarceration__deinstitutionalization',
    source: 'mass_incarceration', target: 'deinstitutionalization',
    type: 'ENABLED',
    label: 'Deinstitutionalization contributed to mass incarceration of the mentally ill',
    note: 'The closure of psychiatric hospitals without replacement community infrastructure led directly to the "transinstitutionalization" of mentally ill persons into the prison system. Jails and prisons became the largest mental health providers in the US — the ultimate failure mode of deinstitutionalization.',
    confidence: 'high'
  },
  {
    id: 'corporate_regulatory_capture__leaded_gasoline',
    source: 'corporate_regulatory_capture', target: 'leaded_gasoline_cover_up',
    type: 'ENABLED',
    label: 'Lead industry capture of the Bureau of Mines enabled decades of harm',
    note: 'The Ethyl Corporation and Standard Oil captured the Bureau of Mines and funded Robert Kehoe\'s research operation to produce scientific cover for leaded gasoline. The Kehoe Principle — require proof of harm before regulation — inverted the precautionary principle and was itself the product of regulatory capture.',
    confidence: 'high'
  },
  {
    id: 'manufactured_scientific_doubt__leaded_gasoline',
    source: 'manufactured_scientific_doubt', target: 'leaded_gasoline_cover_up',
    type: 'ENABLED',
    label: 'The lead industry invented the corporate science doubt playbook',
    note: 'The lead industry\'s strategy — fund industry-friendly researchers, intimidate independent scientists, and manufacture the appearance of scientific controversy — was the first large-scale application of manufactured scientific doubt. It directly preceded and inspired the tobacco industry\'s identical playbook.',
    confidence: 'high'
  },
  {
    id: 'institutional_credibility_laundering__lobotomy',
    source: 'institutional_credibility_laundering', target: 'lobotomy_era',
    type: 'ENABLED',
    label: 'Nobel Prize credibility laundering enabled lobotomy adoption',
    note: 'Walter Freeman\'s lobotomy was performed on 50,000 Americans partly because the Nobel Prize in Physiology (1949, to Egas Moniz, the procedure\'s inventor) conferred institutional legitimacy that overrode clinical skepticism. The Nobel became credibility laundering for an evidence-free intervention.',
    confidence: 'high'
  },
  {
    id: 'moral_disengagement__lobotomy',
    source: 'moral_disengagement', target: 'lobotomy_era',
    type: 'ENABLED',
    label: 'Moral disengagement allowed practitioners to ignore harm evidence',
    note: 'Freeman\'s popularization of the lobotomy required practitioners to morally disengage from observable patient harm — personality destruction, incontinence, childlike affect — by reframing the goal as institutional manageability rather than patient flourishing. The procedure served institutional convenience, and the ethical rationalizations followed.',
    confidence: 'high'
  },
  {
    id: 'corporate_regulatory_capture__big_pharma_lobbying',
    source: 'corporate_regulatory_capture', target: 'big_pharma_lobbying',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Pharmaceutical lobbying is the mechanism of regulatory capture',
    note: 'Pharmaceutical industry lobbying is not separate from regulatory capture — it is the primary mechanism by which regulatory capture is achieved. Revolving-door employment, CME funding, and lobbying expenditure are the instruments that transform regulatory agencies into industry partners.',
    confidence: 'high'
  },
  {
    id: 'manufactured_scientific_doubt__big_pharma_lobbying',
    source: 'manufactured_scientific_doubt', target: 'big_pharma_lobbying',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Pharma lobbying funds manufactured scientific doubt',
    note: 'A portion of pharmaceutical lobbying spending funds the manufacture of scientific doubt: suppression of negative trial results, funding of counter-studies, and Ghost-writing of "independent" journal articles. The lobbying and the science are integrated.',
    confidence: 'high'
  },
  {
    id: 'corporate_regulatory_capture__thalidomide',
    source: 'corporate_regulatory_capture', target: 'thalidomide_scandal',
    type: 'ENABLED',
    label: 'Inadequate pre-1962 regulation enabled thalidomide harm',
    note: 'Thalidomide was possible because pre-1962 drug regulation did not require proof of safety in the form the FDA later mandated. The scandal revealed that voluntary industry testing without mandatory evidence standards was regulatory capture in structural form.',
    confidence: 'high'
  },
  {
    id: 'institutional_credibility_laundering__thalidomide',
    source: 'institutional_credibility_laundering', target: 'thalidomide_scandal',
    type: 'ENABLED',
    label: 'European medical authority laundered thalidomide\'s safety claims',
    note: 'Thalidomide\'s rapid adoption across 46 countries was enabled by credibility laundering through European medical authorities who endorsed it without adequate safety evidence. Frances Kelsey resisted this laundering at the FDA — her resistance saving thousands of American births.',
    confidence: 'high'
  },

  // ── Psychology ────────────────────────────────────────────────────────────
  {
    id: 'culture_wars__jordan_peterson',
    source: 'culture_wars', target: 'jordan_peterson',
    type: 'ENABLED',
    label: 'Peterson became a central figure in the culture wars',
    note: 'Peterson\'s 2016 platform was constructed within the culture wars framework — his refusal of pronoun guidelines became a symbolic skirmish in the broader conflict over campus speech, gender ideology, and traditional hierarchies. His audience was primarily men who felt the culture wars threatened their status.',
    confidence: 'high'
  },
  {
    id: 'radicalization_pipeline__jordan_peterson',
    source: 'radicalization_pipeline', target: 'jordan_peterson',
    type: 'ENABLED',
    label: 'Peterson functioned as an early-stage radicalization pipeline node',
    note: 'For some users, Peterson\'s content was a stepping stone: from self-improvement content to hierarchical thinking to more explicitly far-right content. YouTube\'s recommendation algorithm often placed his videos upstream of more extreme content. This is not Peterson\'s intent but is a documented pipeline dynamic.',
    confidence: 'medium'
  },
  {
    id: 'identity_capture__mgtow',
    source: 'identity_capture', target: 'mgtow',
    type: 'ENABLED',
    label: 'MGTOW structures male identity around rejection of women',
    note: 'MGTOW performs identity capture by making male identity entirely contingent on the rejection of relationships with women. The movement creates a closed identity loop: all masculine failures are caused by women/feminism, masculine virtue consists entirely of withdrawal, and any return to relationships would constitute identity betrayal.',
    confidence: 'high'
  },
  {
    id: 'radicalization_pipeline__mgtow',
    source: 'radicalization_pipeline', target: 'mgtow',
    type: 'ENABLES',
    label: 'MGTOW participates in the manosphere radicalization pipeline',
    note: 'MGTOW occupies a mid-stage position in the manosphere radicalization pipeline: more ideologically coherent than the red pill entry point, sharing infrastructure with incel communities, and providing a retreat position for men who want to withdraw from dating without embracing incel violence ideology.',
    confidence: 'high'
  },
  {
    id: 'cultural_hegemony__self_help_industry',
    source: 'cultural_hegemony', target: 'self_help_industry',
    type: 'ENABLED',
    label: 'The self-help industry reproduces hegemonic individualism',
    note: 'The self-help industry is a hegemonic cultural institution: it systematically converts systemic problems (job insecurity, social isolation, structural inequality) into individual deficiencies requiring individual solutions. This translation serves dominant interests by defining remedies as personal rather than political.',
    confidence: 'high'
  },
  {
    id: 'preference_falsification__self_help_industry',
    source: 'preference_falsification', target: 'self_help_industry',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Self-help norms suppress honest reporting of systemic causes',
    note: 'In self-help culture, attributing personal failure to systemic causes is stigmatized as victimhood or lack of agency. This preference falsification — publicly endorsing individual responsibility while privately knowing systemic factors apply — prevents collective political action.',
    confidence: 'high'
  },
  {
    id: 'social_media_algorithms__social_media_addiction',
    source: 'social_media_algorithms', target: 'social_media_addiction',
    type: 'CAUSED',
    label: 'Variable-ratio reinforcement algorithms cause social media addiction',
    note: 'Social media addiction is not a side effect but the designed outcome of algorithmic platforms. Variable ratio reinforcement schedules (the same mechanism as slot machines), infinite scroll eliminating stopping cues, and social comparison metrics are engineering choices that produce compulsive use.',
    confidence: 'high'
  },
  {
    id: 'outrage_optimization__social_media_addiction',
    source: 'outrage_optimization', target: 'social_media_addiction',
    type: 'ENABLES',
    label: 'Outrage optimization creates addictive engagement loops',
    note: 'Outrage-optimizing algorithms increase addictive platform use: anger is the emotion with the highest engagement persistence, keeping users on platform longer than positive content. The addiction and the outrage optimization are integrated — addicted users generate more outrage signal for the algorithm to amplify.',
    confidence: 'high'
  },
  {
    id: 'groupthink__cult_dynamics',
    source: 'groupthink', target: 'cult_dynamics',
    type: 'ENABLES',
    label: 'Groupthink is the psychological mechanism behind cult thought control',
    note: 'Cult thought reform environments deliberately engineer groupthink: information control ensures only supportive data reaches members, leadership infallibility prevents critical evaluation, and social homogeneity removes dissenting voices. Cults are groupthink engineered to maximum intensity.',
    confidence: 'high'
  },
  {
    id: 'identity_capture__cult_dynamics',
    source: 'identity_capture', target: 'cult_dynamics',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Identity capture is the goal of cult recruitment',
    note: 'Cult recruitment systematically performs identity capture: creating a new identity (the "true self" in the group), defining the outside world as dangerous or spiritually corrupt, and making group membership the constitutive condition of identity. Exit feels like self-annihilation, which is the mechanism\'s function.',
    confidence: 'high'
  },
  {
    id: 'cognitive_dissonance__trauma_bonding',
    source: 'cognitive_dissonance', target: 'trauma_bonding',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Cognitive dissonance explains why trauma bonding persists against self-interest',
    note: 'Trauma bonding produces maximal cognitive dissonance: the abuser is both the source of harm and the source of intermittent comfort. Victims resolve this dissonance not by leaving but by reinterpreting the abuse (minimizing, explaining, justifying) to preserve the attachment. This is the cognitive dissonance resolution mechanism in its most damaging expression.',
    confidence: 'high'
  },
  {
    id: 'in_group_out_group_dynamics__trauma_bonding',
    source: 'in_group_out_group_dynamics', target: 'trauma_bonding',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Abusive systems weaponize in-group belonging to prevent exit',
    note: 'Trauma bonding in high-control groups deploys in-group/out-group dynamics: the group is the in-group of love and safety; the outside world is the dangerous out-group. This structures exit as abandonment of the in-group — psychologically equivalent to exile — which activates the same social survival circuits as physical threat.',
    confidence: 'high'
  },
];

// Add only non-duplicate edges
let added = 0, skipped = 0;
for (const e of newEdges) {
  if (existingIds.has(e.id)) { skipped++; continue; }
  edges.push(e);
  existingIds.add(e.id);
  added++;
}

fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(edges, null, 2));
console.log('Added '+added+' new cross-scope edges, skipped '+skipped+' duplicates');

// Integrity check
const allNodes = new Set();
const scopes = ['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'];
for (const s of scopes) {
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allNodes.add(n.id));
}
let orphans = 0;
for (const e of JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')))) {
  if (!allNodes.has(e.source)) { console.log('ORPHAN src:', e.source, 'in edge', e.id); orphans++; }
  if (!allNodes.has(e.target)) { console.log('ORPHAN tgt:', e.target, 'in edge', e.id); orphans++; }
}
console.log('Edge integrity: OK ('+orphans+' orphans)');
console.log('Mechanisms edges total:', JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json'))).length);
