#!/usr/bin/env node
// add_scope_expansion_2.js
// Adds important missing nodes to psychology, health, and media scopes
// then connects them with mechanism edges
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

function addNodes(filePath, newNodes) {
  const existing = JSON.parse(fs.readFileSync(filePath));
  const ids = new Set(existing.map(n => n.id));
  let added = 0;
  for (const n of newNodes) {
    if (!ids.has(n.id)) { existing.push(n); ids.add(n.id); added++; }
  }
  if (added) fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  console.log(filePath.split('/').slice(-2).join('/'), 'nodes: added', added, '→ total', existing.length);
  return added;
}

function addEdges(filePath, newEdges) {
  const existing = JSON.parse(fs.readFileSync(filePath));
  const ids = new Set(existing.map(e => e.id));
  let added = 0;
  for (const e of newEdges) {
    if (!ids.has(e.id)) { existing.push(e); ids.add(e.id); added++; }
  }
  if (added) fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  console.log(filePath.split('/').slice(-2).join('/'), 'edges: added', added, '→ total', existing.length);
  return added;
}

// ── HEALTH: new nodes ──────────────────────────────────────────────────────────
addNodes(D('data/global/health/nodes.json'), [
  {
    id: 'covid19_pandemic', label: 'COVID-19 Pandemic', node_type: 'reference', category: 'event',
    decade: '2020s', scope: 'global/health', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/COVID-19_pandemic',
    summary: 'The COVID-19 pandemic (2019–present) killed over 7 million people officially (excess death estimates range 15–20 million) and fundamentally restructured global health, politics, and economics. The pandemic exposed failures in pandemic preparedness, supply chain resilience, and public health communication; accelerated mRNA vaccine technology; and became a vehicle for unprecedented political polarization of health messaging, anti-vaccine movements, and misinformation ecosystems.',
    tags: ['pandemic', 'covid', 'public-health', 'vaccine', 'misinformation', 'mRNA', 'political-polarization']
  },
  {
    id: 'sugar_industry_cover_up', label: 'Sugar Industry Research Suppression', node_type: 'reference', category: 'event',
    decade: '1960s', scope: 'global/health', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Sugar_industry_research_suppression',
    summary: 'UCSF research (2016) revealed that the Sugar Research Foundation (Sugar Association) paid Harvard scientists in the 1960s to shift blame for heart disease from sugar to saturated fat — a strategy directly modeled on tobacco industry research suppression. The resulting dietary guidelines (low-fat, high-carbohydrate) shaped American diet policy for 50 years and may have contributed to the obesity and diabetes epidemic. The mechanism: industry-funded research that systematically exonerates the industry.',
    tags: ['nutrition', 'industry-capture', 'scientific-fraud', 'tobacco', 'dietary-guidelines', 'heart-disease']
  },
  {
    id: 'anti_psychiatry_movement', label: 'Anti-Psychiatry Movement', node_type: 'reference', category: 'movement',
    decade: '1960s', scope: 'global/health', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Anti-psychiatry',
    summary: 'The anti-psychiatry movement (R.D. Laing, Thomas Szasz, Michel Foucault) challenged the medical model of mental illness as a social construction used to control deviance. Laing argued schizophrenia was a rational response to irrational family systems; Szasz argued "mental illness" was a myth used to medicalize moral and social deviance; Foucault\'s "Madness and Civilization" historicized psychiatric power. The movement influenced deinstitutionalization and the survivor/consumer movement, while also enabling harmful neglect of severely ill people.',
    tags: ['psychiatry', 'mental-health', 'foucault', 'szasz', 'deinstitutionalization', 'power', 'social-control']
  },
  {
    id: 'pharmaceutical_trials_manipulation', label: 'Pharmaceutical Clinical Trial Manipulation', node_type: 'reference', category: 'phenomenon',
    decade: '1990s', scope: 'global/health', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Publication_bias',
    summary: 'Systematic manipulation of pharmaceutical clinical trials — publication bias (burying negative results), outcome switching, ghost-writing, seeding trials, key opinion leader programs, and selective data release — has distorted medical evidence for decades. Ben Goldacre\'s "Bad Pharma" documented how up to half of clinical trials go unpublished, and published trials systematically overstate benefits and understate harms. The FDA relies on industry-submitted trial data, creating a structural conflict of interest at the heart of drug approval.',
    tags: ['pharma', 'clinical-trials', 'publication-bias', 'scientific-fraud', 'fda', 'evidence-based-medicine']
  },
]);

// ── HEALTH: local edges ────────────────────────────────────────────────────────
addEdges(D('data/global/health/edges.json'), [
  { id: 'anti_vaccination_movement__covid19_pandemic',
    source: 'anti_vaccination_movement', target: 'covid19_pandemic', type: 'ENABLED',
    label: 'Pre-existing anti-vaccination infrastructure enabled COVID vaccine hesitancy',
    note: 'The anti-vaccination movement\'s two-decade infrastructure (Wakefield fraud, Natural News, CHD/RFK Jr.) was immediately available as an organizational and informational resource for COVID vaccine hesitancy. COVID did not create vaccine hesitancy; it revealed how effectively the anti-vax movement had seeded institutional distrust in medical authorities.',
    confidence: 'high' },
  { id: 'tobacco_master_settlement__sugar_industry_cover_up',
    source: 'tobacco_master_settlement', target: 'sugar_industry_cover_up', type: 'SHARES_MECHANISM_WITH',
    label: 'Tobacco and sugar industries used identical research suppression playbooks',
    note: 'The sugar industry consciously modeled its research suppression strategy on the tobacco industry\'s 1950s-60s playbook: fund favorable research, suppress unfavorable findings, create scientific uncertainty, and delay regulation by manufacturing doubt. The mechanism is identical because the sugar industry literally consulted the same PR and lobbying infrastructure.',
    confidence: 'high' },
  { id: 'deinstitutionalization__anti_psychiatry_movement',
    source: 'deinstitutionalization', target: 'anti_psychiatry_movement', type: 'ENABLED',
    label: 'Anti-psychiatry provided the intellectual justification for deinstitutionalization\'s policy implementation',
    note: 'Deinstitutionalization (1960s–80s) was accelerated by the anti-psychiatry critique: if mental illness was a social construction and asylums were coercive control mechanisms, then closing them was liberation. The intellectual cover provided by Laing and Szasz allowed cost-cutting governors (Reagan in California) to frame institutional closure as humane progress. The result: inadequate community support and mass homelessness of severely ill people.',
    confidence: 'high' },
  { id: 'big_pharma_lobbying__pharmaceutical_trials_manipulation',
    source: 'big_pharma_lobbying', target: 'pharmaceutical_trials_manipulation', type: 'ENABLED',
    label: 'Pharmaceutical lobbying created the regulatory environment that enabled trial manipulation',
    note: 'Big pharma lobbying produced the Prescription Drug User Fee Act (PDUFA, 1992) — pharmaceutical companies pay FDA review fees — creating a structural conflict of interest. Industry funding of FDA operations, combined with expedited review timelines, created pressure to approve drugs on manipulated trial evidence. The regulatory capture mechanism: industry funds the regulator, which then relies on industry-submitted data.',
    confidence: 'high' },
]);

// ── PSYCHOLOGY: new nodes ──────────────────────────────────────────────────────
addNodes(D('data/global/psychology/nodes.json'), [
  {
    id: 'narcissistic_abuse', label: 'Narcissistic Abuse / Dark Triad', node_type: 'reference', category: 'phenomenon',
    decade: '2010s', scope: 'global/psychology', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Dark_triad',
    summary: 'The "dark triad" (narcissism, Machiavellianism, psychopathy) and "narcissistic abuse" as popular psychological frameworks became culturally dominant in the 2010s through social media, online communities, and self-help literature. The frameworks offer a vocabulary for interpersonal harm but also enabled pathologizing of ordinary relationship conflict, political opponents, and public figures. The dark triad research is legitimate; the popular "narcissistic abuse survivor" community represents its overapplication to non-clinical contexts.',
    tags: ['narcissism', 'dark-triad', 'psychopathy', 'abuse', 'self-help', 'pop-psychology', 'relationships']
  },
  {
    id: 'recovered_memory_therapy', label: 'Recovered Memory Therapy & Satanic Panic', node_type: 'reference', category: 'event',
    decade: '1980s', scope: 'global/psychology', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Recovered_memory_therapy',
    summary: 'The recovered memory therapy movement (1980s–90s) and its extreme form, Satanic Panic (ritual abuse allegations at daycare centers), demonstrated how therapeutic techniques could create false memories of abuse at scale. Therapists using hypnosis, guided imagery, and "body memories" produced hundreds of false accusations; the McMartin Preschool case, Paul Ingram case, and similar prosecutions destroyed lives based on iatrogenic (therapist-induced) memories. The scandal produced major advances in memory science (Elizabeth Loftus) and standards for forensic interviewing.',
    tags: ['false-memory', 'satanic-panic', 'therapy', 'trauma', 'memory', 'psychology', 'iatrogenic']
  },
  {
    id: 'attachment_theory', label: 'Attachment Theory', node_type: 'reference', category: 'movement',
    decade: '1960s', scope: 'global/psychology', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Attachment_theory',
    summary: 'Attachment theory (John Bowlby, Mary Ainsworth) established that early caregiver relationships form internal working models that shape all subsequent relationships. The Strange Situation procedure identified secure, anxious-ambivalent, avoidant, and disorganized attachment styles, now widely applied to adult relationships. Attachment theory bridges developmental psychology, clinical therapy, and evolutionary biology, and has been extended to explain cult dynamics, trauma bonding, political leadership followership, and online community formation.',
    tags: ['bowlby', 'ainsworth', 'attachment', 'development', 'relationships', 'trauma', 'psychology']
  },
  {
    id: 'online_radicalization', label: 'Online Radicalization Pathways', node_type: 'reference', category: 'phenomenon',
    decade: '2010s', scope: 'global/psychology', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Online_radicalization',
    summary: 'Online radicalization pathways — the algorithmic and social mechanisms by which people move from mainstream content to extremist ideology via recommendation engines, community escalation, and identity capture — have produced domestic terrorism, incel violence, white nationalist movements, and QAnon. The "rabbit hole" metaphor describes how recommendation algorithms optimize for engagement by escalating emotional intensity, leading users through progressively more extreme content. The radicalization pipeline is now a well-documented technical and psychological phenomenon.',
    tags: ['radicalization', 'algorithms', 'extremism', 'youtube', 'qanon', 'incels', 'white-nationalism']
  },
]);

// ── PSYCHOLOGY: local edges ────────────────────────────────────────────────────
addEdges(D('data/global/psychology/edges.json'), [
  { id: 'cult_dynamics__narcissistic_abuse',
    source: 'cult_dynamics', target: 'narcissistic_abuse', type: 'SHARES_MECHANISM_WITH',
    label: 'Cult dynamics and narcissistic abuse operate through identical coercive control mechanisms',
    note: 'Cult dynamics (BITE model: Behavior, Information, Thought, Emotional control) and narcissistic abuse operate through the same coercive control mechanisms: isolation from outside relationships, reality distortion, intermittent reinforcement, identity replacement, and exit cost maximization. The clinical literature on cult exit trauma and narcissistic abuse recovery is substantially overlapping, and survivor communities increasingly use the same vocabulary.',
    confidence: 'high' },
  { id: 'trauma_bonding__attachment_theory',
    source: 'trauma_bonding', target: 'attachment_theory', type: 'SHARES_MECHANISM_WITH',
    label: 'Trauma bonding exploits attachment system vulnerabilities established in early development',
    note: 'Trauma bonding — the counterintuitive emotional attachment to an abuser — operates through the attachment system: abusers exploit the same neural mechanisms that form parent-child bonds by alternating intense threat (activating the attachment system) with intermittent care (providing the "haven"). Anxious-ambivalent attachment style (Ainsworth) predisposes to trauma bonding by heightening hypervigilance to abandonment signals.',
    confidence: 'high' },
  { id: 'red_pill_community__online_radicalization',
    source: 'red_pill_community', target: 'online_radicalization', type: 'ENABLED',
    label: 'The Red Pill community was the gateway for online radicalization into the broader manosphere',
    note: 'The Red Pill community (r/TheRedPill, male self-improvement framing) functioned as an entry ramp into the radicalization pipeline: moderate "self-improvement" rhetoric adjacent to misogyny → pickup artistry → incel ideology → men\'s rights activism → white nationalism. YouTube "heterodox" content (Jordan Peterson) fed into the same pipeline. The radicalization mechanism: each community normalized the next community\'s premises.',
    confidence: 'high' },
  { id: 'recovered_memory_therapy__milgram_obedience_experiments',
    source: 'recovered_memory_therapy', target: 'milgram_obedience_experiments', type: 'SHARES_MECHANISM_WITH',
    label: 'Both demonstrate how authority figures can override subjects\' own perception of reality',
    note: 'Milgram\'s obedience experiments and recovered memory therapy share the mechanism of authority-induced reality override: Milgram showed that subjects would administer (apparent) electric shocks despite their own moral instincts when an authority figure directed them; recovered memory therapists showed that clients would "remember" events that never occurred when therapeutic authority suggested they must have. Both demonstrate the power of authority to override direct experience.',
    confidence: 'medium' },
]);

// ── MEDIA: new nodes ───────────────────────────────────────────────────────────
addNodes(D('data/global/media/nodes.json'), [
  {
    id: 'attention_economy', label: 'The Attention Economy', node_type: 'reference', category: 'phenomenon',
    decade: '2000s', scope: 'global/media', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Attention_economy',
    summary: 'The attention economy (Herbert Simon, Michael Goldhaber) treats human attention as the scarce resource that advertising-based media monetizes. Digital platforms — Facebook, YouTube, Twitter/X, TikTok — optimize for maximum attention capture through algorithmic recommendation, infinite scroll, notification design, and variable reward schedules (slot-machine mechanics). The result: content that generates strong emotional response (outrage, fear, desire) outcompetes informative or nuanced content, systematically degrading the information ecosystem.',
    tags: ['attention', 'social-media', 'algorithms', 'advertising', 'outrage', 'engagement', 'platforms']
  },
  {
    id: 'social_media_platforms', label: 'Social Media Platforms (Facebook, Twitter, TikTok)', node_type: 'reference', category: 'product',
    decade: '2000s', scope: 'global/media', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Social_media',
    summary: 'Social media platforms — Facebook (2004), Twitter (2006), YouTube (2005), Instagram (2010), TikTok (2016) — became the dominant infrastructure for public discourse, news distribution, political organizing, and identity formation. Their advertising business models align engagement maximization with emotional intensification, creating the structural conditions for misinformation spread, filter bubbles, outrage optimization, and political polarization. Facebook alone reaches 3 billion users, making it a primary communication infrastructure for much of humanity.',
    tags: ['facebook', 'twitter', 'tiktok', 'instagram', 'youtube', 'platforms', 'social-media', 'algorithms']
  },
  {
    id: 'infowars_alternative_media', label: 'InfoWars & Alternative Media Ecosystem', node_type: 'reference', category: 'institution',
    decade: '2000s', scope: 'global/media', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/InfoWars',
    summary: 'Alex Jones\'s InfoWars and the broader alternative media ecosystem (Breitbart, The Daily Wire, Zero Hedge, Gateway Pundit) built audience trust by positioning themselves as truth-tellers against mainstream media suppression, then monetized that trust through supplement sales, merchandise, and political fundraising. Jones\'s Sandy Hook defamation judgments (nearly $1.5 billion) demonstrated the real-world harm of conspiracy media. The ecosystem represents manufactured alternative epistemic authority: trust in authorities by attacking all other authorities.',
    tags: ['infowars', 'alex-jones', 'conspiracy', 'alternative-media', 'disinformation', 'breitbart', 'epistemic']
  },
  {
    id: 'local_news_collapse', label: 'Local News Collapse & News Deserts', node_type: 'reference', category: 'phenomenon',
    decade: '2000s', scope: 'global/media', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/News_desert',
    summary: 'Over 2,500 local newspapers closed between 2004 and 2023, creating "news deserts" where communities have no local journalism coverage. The collapse was driven by digital advertising migration to Google and Facebook, Craigslist\'s destruction of classifieds revenue, and private equity acquisition-and-strip strategies. The consequences: rising political polarization (national partisan media fills the vacuum), municipal corruption going unreported, lower civic engagement, and "information voids" filled by social media rumor.',
    tags: ['journalism', 'local-news', 'media-collapse', 'private-equity', 'democracy', 'civic-engagement', 'news-deserts']
  },
]);

// ── MEDIA: local edges ─────────────────────────────────────────────────────────
addEdges(D('data/global/media/edges.json'), [
  { id: 'social_media_platforms__attention_economy',
    source: 'social_media_platforms', target: 'attention_economy', type: 'ENABLED',
    label: 'Social media platforms operationalized the attention economy at unprecedented scale',
    note: 'Social media platforms transformed the attention economy from an academic concept into industrial infrastructure: Facebook\'s News Feed, YouTube\'s recommendation algorithm, and TikTok\'s FYP are engineered attention capture systems optimized by billions of daily interactions. The platforms don\'t just compete for attention — they systematically reshape what captures attention by training users\' reward systems.',
    confidence: 'high' },
  { id: 'fox_news__infowars_alternative_media',
    source: 'fox_news', target: 'infowars_alternative_media', type: 'ENABLED',
    label: 'Fox News normalized the alternative media logic that infotainment can substitute for journalism',
    note: 'Fox News\'s success demonstrated that partisan infotainment could outperform journalism economically, providing the proof of concept that alternative media built on: if Fox could reach 3 million nightly viewers by telling conservatives what they wanted to hear, then more extreme versions could build smaller but more loyal audiences. Breitbart, InfoWars, and The Daily Wire are Fox News\'s logical successors in the outrage-monetization continuum.',
    confidence: 'high' },
  { id: 'local_news_collapse__social_media_platforms',
    source: 'local_news_collapse', target: 'social_media_platforms', type: 'CAUSED',
    label: 'Social media platforms captured the local advertising revenue that funded local journalism',
    note: 'Facebook and Google systematically captured the local advertising revenue that had funded local journalism: Facebook took social connection (replacing classified ads and local news as community glue), Google took search advertising (replacing Yellow Pages and local business ads), Craigslist took classifieds. Local newspapers, stripped of revenue, shrank or closed, leaving the local information space to be filled by social media rumor and national partisan media.',
    confidence: 'high' },
  { id: 'cambridge_analytica__social_media_platforms',
    source: 'cambridge_analytica', target: 'social_media_platforms', type: 'EXPLOITED',
    label: 'Cambridge Analytica exploited Facebook\'s data architecture for political micro-targeting',
    note: 'Cambridge Analytica harvested 87 million Facebook profiles through a quiz app that exploited the platform\'s lax API permissions, then used the psychographic data for targeted political advertising (Brexit, Trump 2016, and 60+ other campaigns). The scandal revealed that social media platforms\' core data architecture — broad third-party access to user data for advertising — was structurally vulnerable to political exploitation.',
    confidence: 'high' },
]);

// ── MECHANISM edges for all new nodes ──────────────────────────────────────────
const mechEdges = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const existing = new Set(mechEdges.map(e => e.id));

const mechBatch = [
  // COVID-19
  { id: 'manufactured_scientific_doubt__covid19_pandemic',
    source: 'manufactured_scientific_doubt', target: 'covid19_pandemic', type: 'ENABLED',
    label: 'Decades of manufactured scientific doubt left the public epistemically unprepared for COVID',
    note: 'The COVID pandemic arrived in a public epistemological environment already destabilized by manufactured scientific doubt: tobacco-industry-modeled climate denial had normalized the idea that "both sides" of any scientific question deserved equal weight. When COVID vaccine science became a political battleground, the doubt-manufacturing machinery (amplified by social media) was already in place. COVID misinformation weaponized the same epistemic infrastructure.',
    confidence: 'high' },
  { id: 'institutional_credibility_laundering__covid19_pandemic',
    source: 'institutional_credibility_laundering', target: 'covid19_pandemic', type: 'ENABLED',
    label: 'COVID credibility laundering: doctors, lawyers, and researchers lent authority to misinformation',
    note: 'COVID misinformation was amplified by institutional credibility laundering: physicians (Dr. Simone Gold, America\'s Frontline Doctors), researchers (Stanford\'s Great Barrington Declaration), and lawyers provided the veneer of expert authority to policy positions that contradicted mainstream public health consensus. The pattern — genuine credentials lending authority to fringe claims — is the classic laundering mechanism.',
    confidence: 'high' },

  // Sugar industry
  { id: 'tobacco_industry_research_suppression__sugar_industry_cover_up',
    source: 'tobacco_industry_research_suppression', target: 'sugar_industry_cover_up', type: 'ENABLED',
    label: 'Sugar industry directly adopted tobacco\'s research suppression playbook',
    note: 'UCSF documents showed the Sugar Research Foundation contracted with Hill & Knowlton — the same PR firm that ran tobacco\'s "doubt" campaign — and directly adopted tobacco\'s strategy: fund favorable researchers, attack unfavorable studies, and flood the scientific literature with industry-sponsored results. This is not analogical resemblance; the sugar industry consciously copied and adapted the tobacco model.',
    confidence: 'high' },

  // Anti-psychiatry
  { id: 'structural_violence__anti_psychiatry_movement',
    source: 'structural_violence', target: 'anti_psychiatry_movement', type: 'ENABLED',
    label: 'Anti-psychiatry correctly identified structural violence in psychiatric institutionalization',
    note: 'The anti-psychiatry movement\'s enduring contribution was documenting the structural violence embedded in psychiatric institutions: involuntary commitment laws, forced treatment, racial disparities in diagnosis (Black patients overdiagnosed with schizophrenia), and the use of psychiatric categories to pathologize political and sexual deviance (homosexuality in DSM until 1973). The critique was accurate about structure even where it was wrong about biology.',
    confidence: 'high' },

  // Pharmaceutical trials
  { id: 'manufactured_scientific_doubt__pharmaceutical_trials_manipulation',
    source: 'manufactured_scientific_doubt', target: 'pharmaceutical_trials_manipulation', type: 'SHARES_MECHANISM_WITH',
    label: 'Pharmaceutical trial manipulation is the medical industry\'s form of manufactured scientific doubt',
    note: 'Tobacco\'s manufactured scientific doubt (funding contradictory research to create uncertainty) and pharmaceutical trial manipulation (selective publication, outcome switching, burying negative results) are the same mechanism applied to different industries. Both exploit the appearance of scientific rigor to conceal corporate knowledge of harm. Ben Goldacre\'s "Bad Pharma" (2012) documents this as systematic industry practice, not individual fraud.',
    confidence: 'high' },

  // Narcissistic abuse
  { id: 'moral_disengagement__narcissistic_abuse',
    source: 'moral_disengagement', target: 'narcissistic_abuse', type: 'ENABLED',
    label: 'Dark triad personalities operationalize moral disengagement to enable systematic harm',
    note: 'Dark triad personalities (particularly those scoring high on psychopathy) exhibit structural moral disengagement: reduced emotional response to others\' suffering, cognitive mechanisms that minimize harm ("they deserved it"), and dehumanization of targets. The dark triad is not a separate phenomenon from moral disengagement but rather its personality-trait expression — people for whom the moral disengagement mechanisms are default operating mode rather than crisis-induced adaptations.',
    confidence: 'medium' },

  // Recovered memory
  { id: 'moral_panic__recovered_memory_therapy',
    source: 'moral_panic', target: 'recovered_memory_therapy', type: 'CAUSED',
    label: 'Satanic Panic was a textbook moral panic amplified by therapeutic false memory production',
    note: 'The Satanic Panic (1980s–90s) — the wave of allegations that daycare centers were conducting Satanic ritual abuse — is a textbook moral panic: disproportionate societal response to an (essentially non-existent) threat, amplified by media, therapeutic authority, and institutional momentum. Recovered memory therapy\'s iatrogenic false memories provided the "evidence" that sustained the panic long after skepticism should have prevailed.',
    confidence: 'high' },

  // Attachment theory
  { id: 'collective_trauma__attachment_theory',
    source: 'collective_trauma', target: 'attachment_theory', type: 'ENABLED',
    label: 'Collective trauma transmission operates through the same attachment mechanisms as individual trauma',
    note: 'Attachment theory explains collective trauma transmission: parents with unresolved trauma (Holocaust, slavery, displacement) transmit disorganized attachment to children through hypervigilant parenting, emotional unavailability, or reenactment of trauma dynamics. The "chosen trauma" (Volkan) that defines collective identity is maintained through attachment relationships — each generation receives the trauma as part of its identity formation.',
    confidence: 'high' },

  // Online radicalization
  { id: 'radicalization_pipeline__online_radicalization',
    source: 'radicalization_pipeline', target: 'online_radicalization', type: 'ENABLED',
    label: 'Online environments created an automated, scalable radicalization pipeline',
    note: 'Online radicalization is the radicalization pipeline automated and scaled: YouTube\'s recommendation algorithm, Reddit\'s community structure, and Discord server hierarchies perform the functions of traditional radicalization recruiters (isolation, identity replacement, escalating commitment) without human intervention. The pipeline now processes millions of users simultaneously — a qualitative change in radicalization capacity from pre-digital extremism.',
    confidence: 'high' },

  // Attention economy
  { id: 'outrage_optimization__attention_economy',
    source: 'outrage_optimization', target: 'attention_economy', type: 'ENABLED',
    label: 'The attention economy structurally selects for outrage because it maximizes engagement',
    note: 'Attention economy platforms discovered empirically (through engagement optimization) what neuroscience confirms: moral outrage generates stronger, more sustained attention than calm or positive content. The mechanism: outrage activates threat response (amygdala) and social enforcement instincts simultaneously, producing viral sharing and extended engagement. Attention economy selection pressure thus structurally favors outrage-generating content over accurate or nuanced content.',
    confidence: 'high' },

  { id: 'filter_bubble__attention_economy',
    source: 'filter_bubble', target: 'attention_economy', type: 'SHARES_MECHANISM_WITH',
    label: 'Filter bubbles and the attention economy co-produce each other through personalization',
    note: 'Filter bubbles and attention economy optimization are mutually reinforcing: personalization algorithms create filter bubbles by showing users more of what they engage with; the attention economy rewards this personalization because familiar in-group content generates more reliable engagement than challenging cross-group content. The result: users in echo chambers spend more time on platform, generating more ad revenue, reinforcing the algorithmic selection.',
    confidence: 'high' },

  // Social media platforms
  { id: 'social_media_polarization__social_media_platforms',
    source: 'social_media_polarization', target: 'social_media_platforms', type: 'PRODUCED',
    label: 'Social media platforms\' architecture structurally produces political polarization',
    note: 'Research (Bail et al. 2018, Allcott et al. 2020, Facebook\'s own internal research) shows that social media platforms produce political polarization through: algorithmic amplification of outrage content, like/share mechanics that reward tribal signaling, harassment norms that drive moderates out of public discourse, and identity capture that makes political opinions part of self-concept. Facebook\'s own researchers found the platform was "tearing society apart."',
    confidence: 'high' },

  // InfoWars
  { id: 'conspiracy_theory_grifters__infowars_alternative_media',
    source: 'conspiracy_theory_grifters', target: 'infowars_alternative_media', type: 'ENABLED',
    label: 'InfoWars is the paradigm case of conspiracy theory grifterism at industrial scale',
    note: 'Alex Jones/InfoWars is the paradigm case of conspiracy grifterism: Jones built audience trust through government distrust narratives, then monetized that trust through supplement sales (Survival Shield X-2, Super Male Vitality), emergency food kits, and merchandise — generating over $80 million annually. The conspiracy content was simultaneously sincere belief and calculated audience cultivation for product sales. Jones\'s Sandy Hook defamation judgments exposed the personal cost to victims.',
    confidence: 'high' },

  // Local news collapse
  { id: 'info_ecosystem_collapse__local_news_collapse',
    source: 'info_ecosystem_collapse', target: 'local_news_collapse', type: 'CAUSED',
    label: 'Local news collapse is the structural driver of the broader information ecosystem collapse',
    note: 'The information ecosystem collapse begins with local news: local journalism provided the factual substrate (verified events, public records, source relationships) on which regional and national journalism built. When local papers close, the fact-production infrastructure disappears, creating "information voids" that social media and partisan media fill with unverified content. The national polarization crisis is downstream of the local news funding crisis.',
    confidence: 'high' },
];

let added = 0;
for (const e of mechBatch) {
  if (!existing.has(e.id)) { mechEdges.push(e); existing.add(e.id); added++; }
}
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(mechEdges, null, 2));
console.log('mechanisms/edges.json: added', added, '→ total', mechEdges.length);

// ── Integrity check ────────────────────────────────────────────────────────────
const allIds = new Set();
const scopes = ['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'];
for (const s of scopes) JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id));
let orphans = 0;
for (const e of mechEdges) {
  if (allIds.has(e.source) === false) { console.log('ORPHAN src:', e.source); orphans++; }
  if (allIds.has(e.target) === false) { console.log('ORPHAN tgt:', e.target); orphans++; }
}
console.log('Total nodes:', allIds.size, '| Orphans:', orphans);
