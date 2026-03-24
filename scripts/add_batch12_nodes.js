#!/usr/bin/env node
// add_batch12_nodes.js — social safety net, disability rights, addiction science,
//   ancient philosophy nodes, Mongol Empire expansion, Scientific Revolution as history,
//   disability rights, ADHD/neurodiversity, tobacco industry, pharmaceutical industry
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const pn = JSON.parse(fs.readFileSync(D('data/global/politics/nodes.json')));
const hn = JSON.parse(fs.readFileSync(D('data/global/history/nodes.json')));
const mn = JSON.parse(fs.readFileSync(D('data/mechanisms/nodes.json')));
const psn = JSON.parse(fs.readFileSync(D('data/global/psychology/nodes.json')));
const hln = JSON.parse(fs.readFileSync(D('data/global/health/nodes.json')));
const medn = JSON.parse(fs.readFileSync(D('data/global/media/nodes.json')));

const pe = JSON.parse(fs.readFileSync(D('data/global/politics/edges.json')));
const he = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const pse = JSON.parse(fs.readFileSync(D('data/global/psychology/edges.json')));
const hle = JSON.parse(fs.readFileSync(D('data/global/health/edges.json')));
const mede = JSON.parse(fs.readFileSync(D('data/global/media/edges.json')));

const pnIds = new Set(pn.map(n=>n.id));
const hnIds = new Set(hn.map(n=>n.id));
const mnIds = new Set(mn.map(n=>n.id));
const psnIds = new Set(psn.map(n=>n.id));
const hlnIds = new Set(hln.map(n=>n.id));
const mednIds = new Set(medn.map(n=>n.id));
const peIds = new Set(pe.map(e=>e.id));
const heIds = new Set(he.map(e=>e.id));
const meIds = new Set(me.map(e=>e.id));
const pseIds = new Set(pse.map(e=>e.id));
const hleIds = new Set(hle.map(e=>e.id));
const medeIds = new Set(mede.map(e=>e.id));

// ── New Politics nodes ────────────────────────────────────────────────────
const newPolitNodes = [
  {
    id: 'disability_rights',
    label: 'Disability Rights Movement',
    node_type: 'movement',
    category: 'movement',
    decade: '1970s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Disability_rights_movement',
    summary: 'Civil rights movement asserting full political, social, and economic participation for disabled people; produced the Americans with Disabilities Act (1990); "nothing about us without us" as organizing principle; challenges medical model with social model of disability.',
    tags: ['disability', 'ADA', 'accessibility', 'social model', 'independent living', 'crip culture', 'accommodation', 'rights']
  },
  {
    id: 'social_safety_net',
    label: 'Social Safety Net',
    node_type: 'institution',
    category: 'institution',
    decade: '1930s',
    scope: 'global/politics',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Social_safety_net',
    summary: 'System of government programs providing income support, healthcare, and services to vulnerable populations (elderly, disabled, unemployed, children); includes Social Security, Medicare, Medicaid, unemployment insurance, food stamps; central battleground of neoliberal vs. Keynesian politics.',
    tags: ['welfare state', 'social security', 'medicare', 'medicaid', 'unemployment', 'food stamps', 'poverty', 'safety net']
  },
];

// ── New History nodes ─────────────────────────────────────────────────────
const newHistNodes = [
  {
    id: 'scientific_revolution',
    label: 'Scientific Revolution',
    node_type: 'era',
    category: 'era',
    decade: '1540s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Scientific_Revolution',
    summary: 'Period (16th-17th c.) when systematic empirical method replaced medieval Aristotelian cosmology; Copernicus, Galileo, Newton, Bacon, Descartes; produced modern scientific method and launched the technological transformation of human civilization.',
    tags: ['science', 'copernicus', 'galileo', 'newton', 'empiricism', 'method', 'astronomy', 'physics', 'paradigm shift']
  },
  {
    id: 'mongol_empire',
    label: 'Mongol Empire',
    node_type: 'era',
    category: 'era',
    decade: '1200s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Mongol_Empire',
    summary: 'Largest contiguous land empire in history (13th-14th c.); Genghis Khan\'s conquests killed tens of millions; connected Eurasia enabling the Silk Road\'s commercial and cultural exchange; transmitted the Black Death westward; destroyed the Abbasid Caliphate.',
    tags: ['mongolia', 'genghis khan', 'empire', 'conquest', 'silk road', 'black death', 'kublai khan', 'eurasian']
  },
  {
    id: 'ottoman_empire',
    label: 'Ottoman Empire',
    node_type: 'era',
    category: 'era',
    decade: '1300s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Ottoman_Empire',
    summary: 'Turkish empire lasting 600 years (1299-1922); at peak controlled three continents; the Sick Man of Europe whose collapse produced WWI and the modern Middle East\'s borders; successor state Turkey emerged from Ataturk\'s secularist nationalist revolution.',
    tags: ['turkey', 'ottoman', 'empire', 'caliphate', 'wwi', 'collapse', 'middle east', 'ataturk', 'balkan wars']
  },
  {
    id: 'french_revolution_history',
    label: 'French Revolution',
    node_type: 'event',
    category: 'event',
    decade: '1780s',
    scope: 'global/history',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/French_Revolution',
    summary: 'Radical political and social transformation of France (1789-1799); abolished monarchy and feudalism; produced Declaration of Rights of Man; degenerated into the Terror (1793-94) with 40,000+ executions; ended with Napoleon\'s coup; model for subsequent revolutions.',
    tags: ['france', 'revolution', 'liberty equality fraternity', 'robespierre', 'terror', 'napoleon', 'monarchy', 'enlightenment']
  },
];

// ── New Mechanism nodes ───────────────────────────────────────────────────
const newMechNodes = [
  {
    id: 'addiction_science',
    label: 'Addiction as Disease',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1980s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Addiction',
    summary: 'Scientific understanding of addiction as a chronic brain disorder with genetic, environmental, and neurobiological components; challenged moral failure model; basis for harm reduction approaches; reveals how criminalization of addiction is scientifically indefensible.',
    tags: ['addiction', 'neuroscience', 'harm reduction', 'dopamine', 'disease model', 'opioids', 'recovery', 'stigma']
  },
  {
    id: 'social_contract_theory',
    label: 'Social Contract Theory',
    node_type: 'mechanism',
    category: 'mechanism',
    decade: '1640s',
    scope: 'global/mechanisms',
    cross_scope: true,
    wikipedia: 'https://en.wikipedia.org/wiki/Social_contract',
    summary: 'Political philosophy holding that legitimate government derives from citizens\' implicit or explicit consent; Hobbes (strong sovereign), Locke (limited government with rights), Rousseau (general will); foundational to democratic theory and US Declaration of Independence.',
    tags: ['social contract', 'Locke', 'Hobbes', 'Rousseau', 'consent', 'government legitimacy', 'democracy', 'natural rights']
  },
];

// ── New Health nodes ──────────────────────────────────────────────────────
const newHealthNodes = [
  {
    id: 'neurodiversity',
    label: 'Neurodiversity Movement',
    node_type: 'movement',
    category: 'movement',
    decade: '1990s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Neurodiversity',
    summary: 'Movement framing neurological differences (autism, ADHD, dyslexia) as natural human variation rather than disorders; challenges deficit model; advocates for accommodation rather than cure; connects to disability rights and anti-psychiatry movements.',
    tags: ['autism', 'ADHD', 'neurodiversity', 'disability', 'accommodation', 'stigma', 'diagnosis', 'difference vs disorder']
  },
  {
    id: 'tobacco_industry',
    label: 'Tobacco Industry & Public Health',
    node_type: 'institution',
    category: 'institution',
    decade: '1950s',
    scope: 'global/health',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Tobacco_industry',
    summary: 'Tobacco companies knew smoking caused cancer by the 1950s and systematically suppressed the science; developed the disinformation playbook used by climate denial and pharmaceutical industries; Master Settlement Agreement (1998) revealed strategy through document disclosure.',
    tags: ['tobacco', 'cancer', 'disinformation', 'merchants of doubt', 'nicotine', 'lobbying', 'master settlement', 'public health']
  },
];

// ── New Psychology nodes ──────────────────────────────────────────────────
const newPsychNodes = [
  {
    id: 'toxic_masculinity',
    label: 'Toxic Masculinity',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '1980s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Toxic_masculinity',
    summary: 'Cultural norms of masculinity that harm both men and others: emotional suppression, dominance assertion, violence normalization, homophobia; linked to mental health crises in men, domestic violence, and mass shooting patterns.',
    tags: ['masculinity', 'gender', 'men', 'emotional suppression', 'violence', 'homophobia', 'mental health', 'culture']
  },
  {
    id: 'echo_chamber',
    label: 'Echo Chambers & Filter Bubbles',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2000s',
    scope: 'global/psychology',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Echo_chamber_(media)',
    summary: 'Information environments where people encounter only views confirming their own beliefs; enabled by algorithmic personalization and self-selection; contributes to political polarization and makes viewpoint challenges psychologically alien.',
    tags: ['echo chamber', 'filter bubble', 'confirmation bias', 'algorithms', 'social media', 'polarization', 'Eli Pariser', 'epistemic']
  },
];

// ── New Media nodes ───────────────────────────────────────────────────────
const newMediaNodes = [
  {
    id: 'internet_and_democracy',
    label: 'Internet & Democracy',
    node_type: 'phenomenon',
    category: 'phenomenon',
    decade: '2000s',
    scope: 'global/media',
    cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Internet_and_democracy',
    summary: 'The internet\'s impact on democratic politics: initially celebrated as democratizing information access; subsequently revealed as enabling surveillance, disinformation, and algorithmic radicalization; net effect on democracy is contested and varies by regime type.',
    tags: ['internet', 'democracy', 'social media', 'surveillance', 'disinformation', 'arab spring', 'china', 'censorship']
  },
];

// ── Politics edges ────────────────────────────────────────────────────────
const newPolitEdges = [
  // disability rights
  { id: 'disability_rights__civil_rights_movement',
    source: 'disability_rights', target: 'civil_rights_movement', type: 'SHARES_MECHANISM_WITH',
    label: 'Disability rights movement explicitly modeled on Civil Rights Movement, with "nothing about us without us" replacing "we shall overcome"',
    note: 'The disability rights movement explicitly modeled its legal and political strategy on the Civil Rights Movement: Ed Roberts (wheelchair user who fought UC Berkeley\'s admissions exclusion in 1962) and Judy Heumann (denied teaching license due to wheelchair in 1970) developed an independent living philosophy that paralleled Black Power\'s self-determination; the Section 504 sit-in (1977, 26 days occupying San Francisco HEW office — the longest such occupation in US history) deployed direct action borrowed from civil rights; ADAPT (disability direct action group) chained themselves to inaccessible buses; the ADA (1990) was the legislative equivalent of the Civil Rights Act. The strategy transfer was explicit and conscious.',
    confidence: 'high' },
  { id: 'disability_rights__conversion_therapy',
    source: 'disability_rights', target: 'conversion_therapy', type: 'SHARES_MECHANISM_WITH',
    label: 'Both disability rights and LGBTQ rights challenge the medical establishment\'s authority to define "normal" human variation requiring correction',
    note: 'Disability rights and LGBTQ rights share the challenge to medical authority: the medical model of disability (disability is individual deficit requiring treatment/cure) is challenged by the social model (disability is the product of social barriers, not individual difference); similarly, homosexuality was removed from DSM in 1973 under pressure from gay rights advocates arguing that same-sex attraction was normal human variation. Both movements challenge medicine\'s power to define human normality and prescribe correction of deviation. The neurodiversity movement extends this challenge to autism and ADHD. All three represent the same fundamental critique: medical authority should not determine the boundaries of acceptable human variation.',
    confidence: 'high' },

  // social safety net
  { id: 'social_safety_net__new_deal',
    source: 'social_safety_net', target: 'new_deal', type: 'PRODUCED',
    label: 'The New Deal created the foundational institutions of the American social safety net',
    note: 'The New Deal created the US social safety net\'s core institutions: Social Security (1935, retirement and disability insurance); Federal Deposit Insurance Corporation (banking protection); unemployment insurance; WPA and CCC (work programs); SEC (securities regulation). These programs created the first comprehensive US social safety net — before the New Deal, the elderly poor often died in poorhouses; workers who lost jobs had no income replacement. The New Deal\'s safety net was built on the principle that individuals could not be expected to self-insure against systemic economic risks (recession, old age, disability) that required collective insurance mechanisms.',
    confidence: 'high' },
  { id: 'social_safety_net__neoliberalism',
    source: 'social_safety_net', target: 'neoliberalism', type: 'DISCREDITED',
    label: 'Neoliberalism systematically eroded the social safety net through welfare reform, privatization, and austerity',
    note: 'Neoliberalism targeted the social safety net as its primary institutional obstacle: Reagan attempted to cut Social Security in 1981 (retreated under political pressure), succeeded in cutting Medicaid and SNAP; Clinton\'s welfare reform (PRWORA, 1996) replaced AFDC entitlement with TANF block grants, adding work requirements and time limits; Bush attempted Social Security privatization in 2005; state-level Medicaid work requirements, SNAP time limits, and Section 8 waiting lists represent ongoing erosion. The ideological framing: safety net programs create "dependency" that reduces work incentives — the moral failure model of poverty applied to social policy. Empirical research consistently fails to find the work disincentive effects neoliberal theory predicts.',
    confidence: 'high' },
  { id: 'social_safety_net__welfare_state',
    source: 'social_safety_net', target: 'welfare_state', type: 'ENABLED',
    label: 'The social safety net is the American implementation of the welfare state, less comprehensive than European equivalents',
    note: 'The US social safety net is a partial welfare state: compared to European welfare states (universal healthcare, childcare, housing, generous unemployment, family leave), the US safety net is limited — no universal healthcare (ACA provides partial coverage), minimal childcare support, time-limited unemployment, no federal paid family leave, weak housing assistance. The US welfare state was limited from inception by Southern Democrats who insisted on excluding agricultural and domestic workers (primarily Black) from Social Security and labor protections. The comparative poverty rates — US has the highest poverty among wealthy democracies — reflect this thinner safety net. The safety net vs. welfare state distinction captures the gap between what the US has and what other wealthy democracies have built.',
    confidence: 'high' },
];

// ── History edges ─────────────────────────────────────────────────────────
const newHistEdges = [
  // Scientific Revolution
  { id: 'scientific_revolution__enlightenment',
    source: 'scientific_revolution', target: 'enlightenment', type: 'PRODUCED',
    label: 'The Scientific Revolution\'s demonstration that reason and evidence could explain nature drove Enlightenment confidence in reason as the basis for human affairs',
    note: 'The Scientific Revolution produced the Enlightenment\'s intellectual confidence: Newton\'s "Principia Mathematica" (1687) demonstrated that mathematical reason could explain planetary motion and terrestrial gravity with the same laws — the universe operates by discoverable rational principles; this demonstration that reason could unlock nature\'s secrets implied reason could also unlock social, political, and moral truth; Locke applied Newtonian empiricism to political philosophy; Voltaire celebrated Newton as demonstrating reason\'s power; the Philosophes sought to apply scientific method to human affairs. Without the Scientific Revolution\'s demonstration of reason\'s power, the Enlightenment\'s confidence in reason as the basis for social organization would lack empirical foundation.',
    confidence: 'high' },
  { id: 'printing_press__scientific_revolution_edge',
    source: 'printing_press', target: 'scientific_revolution', type: 'ENABLED',
    label: 'The printing press enabled scientific communication at scale',
    note: 'This edge connects the printing press to the scientific revolution enabling knowledge accumulation.',
    confidence: 'high' },

  // Mongol Empire
  { id: 'mongol_empire__silk_road',
    source: 'mongol_empire', target: 'silk_road', type: 'ENABLED',
    label: 'Pax Mongolica created the political stability that enabled Silk Road trade to reach its peak in the 13th-14th centuries',
    note: 'The Mongol Empire created "Pax Mongolica" — a period of relative safety for travel across Eurasia that enabled Silk Road trade to reach its greatest extent. By controlling the entire overland route from China to Eastern Europe, the Mongols could enforce the security that long-distance trade requires. Marco Polo\'s journey (1271-1295) was possible because Mongol control made the route passable. The Mongol postal relay system (yam) enabled communication across the empire. However, Mongol conquest also disrupted Silk Road cities (Samarkand, Baghdad, Nishapur devastated) and the Black Death\'s westward spread followed Mongol trade routes.',
    confidence: 'high' },
  { id: 'mongol_empire__black_death',
    source: 'mongol_empire', target: 'black_death', type: 'PRODUCED',
    label: 'Mongol military movements transmitted the bubonic plague from Central Asia westward, producing the Black Death pandemic',
    note: 'The Black Death\'s westward transmission followed Mongol trade and military routes: the plague originated in Central Asian rodent populations; Mongol military campaigns in the 1340s in Central Asia spread it westward; the 1346 Mongol siege of Caffa (Crimea) — where the Mongols catapulted plague-infected corpses over the walls — is the first documented biological warfare incident; Genoese merchants fleeing Caffa carried the plague to Constantinople and then to Western Europe; the resulting Black Death (1347-1351) killed 30-60% of European population. The causal chain from Mongol expansion to European Black Death is direct: empire created the trade routes and military movements that enabled unprecedented long-distance pathogen transmission.',
    confidence: 'high' },

  // Ottoman Empire
  { id: 'ottoman_empire__armenian_genocide',
    source: 'ottoman_empire', target: 'armenian_genocide', type: 'PRODUCED',
    label: 'The declining Ottoman Empire\'s nationalism and WWI military crisis produced the conditions for the Armenian Genocide',
    note: 'This edge connects the Ottoman Empire node to the Armenian Genocide that the original ottoman_empire node was written to reference. The Committee of Union and Progress (Young Turks) governing the late Ottoman Empire blamed Armenian communities for military defeats; the empire\'s collapse created perceived urgency for ethnic homogenization.',
    confidence: 'high' },
  { id: 'ottoman_empire__rise_of_islam',
    source: 'ottoman_empire', target: 'rise_of_islam', type: 'ENABLED',
    label: 'The Ottoman Empire was the most powerful Muslim state for 600 years, the caliphate that defined Sunni Islamic political authority',
    note: 'The Ottoman Empire institutionalized Islamic political authority through the caliphate: Ottoman sultans held the Sunni caliphate title from 1517 (conquest of Egypt) until its abolition in 1924 (Ataturk); the empire administered the holy cities of Mecca and Medina, giving it religious authority over global Sunni Islam; Ottoman religious institutions (ulema, Diyanet) shaped Islamic law and practice across three continents; the empire\'s collapse produced the "caliphate problem" that political Islamist movements (including ISIS) have sought to resolve. The Ottoman caliphate was the political institutionalization of the Islamic tradition that began with the Rashidun caliphs.',
    confidence: 'high' },

  // French Revolution
  { id: 'french_revolution__congress_of_vienna',
    source: 'french_revolution', target: 'congress_of_vienna', type: 'PRODUCED',
    label: 'The Congress of Vienna was explicitly designed to prevent another French Revolution by restoring conservative order',
    note: 'The Congress of Vienna (1814-15) was produced by reaction to the French Revolution and Napoleonic Wars: Metternich\'s conservative order was explicitly designed to prevent revolutionary nationalism from destabilizing European monarchies; the legitimacy principle (restore pre-revolutionary dynasties) directly opposed revolutionary self-determination; the Concert of Europe\'s intervention principle allowed great powers to suppress internal revolutions (Spain 1823, Naples 1821). The Congress system was the conservative political response to the French Revolution\'s challenge to dynastic legitimacy — the first counter-revolutionary international system.',
    confidence: 'high' },
  { id: 'french_revolution__napoleon',
    source: 'french_revolution', target: 'napoleon', type: 'PRODUCED',
    label: 'The French Revolution\'s radicalism and destabilization produced Napoleon as the stabilizing figure who institutionalized revolutionary achievements under imperial authority',
    note: 'Napoleon was produced by the French Revolution in multiple senses: without the Revolution\'s meritocratic military culture (any soldier could become marshal; noble birth not required), Napoleon (Corsican minor noble) could not have risen to general by 24; the Revolution\'s destabilization and Thermidorian reaction created the political vacuum that Napoleon filled; the Consulate\'s coup (1799) ended revolutionary government but preserved its legal achievements (Napoleonic Code, abolition of feudalism). Napoleon institutionalized the Revolution\'s transformations — equality before the law, religious tolerance, meritocracy — while ending its democracy. He simultaneously completed and destroyed the Revolution.',
    confidence: 'high' },
];

// ── Mechanism edges ───────────────────────────────────────────────────────
const newMechEdges = [
  // addiction_science
  { id: 'addiction_science__war_on_drugs',
    source: 'addiction_science', target: 'war_on_drugs', type: 'DISCREDITED',
    label: 'Addiction neuroscience directly contradicts the War on Drugs\' moral failure model that justifies criminalization',
    note: 'Addiction science (brain disease model of addiction, NIDA 1995+) has systematically discredited the War on Drugs\' ideological foundation: if addiction is a chronic brain disorder with genetic predisposition and neurobiological mechanism (dopamine reward pathway dysregulation), then criminalizing addicts is equivalent to criminalizing diabetics for their disease; incarceration demonstrably fails as treatment (98% of incarcerated drug users re-use upon release); harm reduction (needle exchange, methadone, naloxone, supervised consumption) prevents death and enables recovery more effectively than criminalization. The scientific evidence against criminalization has been available since the 1970s; the War on Drugs was explicitly designed for political purposes (targeting Black communities and antiwar protesters) rather than in response to scientific evidence.',
    confidence: 'high' },
  { id: 'addiction_science__opioid_crisis',
    source: 'addiction_science', target: 'opioid_crisis', type: 'ENABLED',
    label: 'Pharmaceutical opioid marketing exploited addiction science — specifically, false claims that OxyContin was not addictive because of its time-release formula',
    note: 'Purdue Pharma exploited and distorted addiction science: the company\'s marketing claimed OxyContin\'s time-release formula prevented addiction (a false claim internally acknowledged by 2000); the single article in a medical journal claiming opioids rarely caused addiction in pain patients (cited 11,000 times) was used to promote widespread prescribing; Purdue paid doctors to speak at "pain seminars" presenting opioid prescribing as scientifically validated; the company lobbied to change pain management guidelines. Addiction science was weaponized by the pharmaceutical industry — the same scientific understanding that should have prevented opioid expansion was used selectively to manufacture the appearance of scientific support for aggressive prescribing.',
    confidence: 'high' },

  // social_contract_theory
  { id: 'social_contract_theory__american_revolution',
    source: 'social_contract_theory', target: 'american_revolution', type: 'PRODUCED',
    label: 'Locke\'s social contract theory was the direct intellectual foundation of the Declaration of Independence\'s argument for revolution',
    note: 'Social contract theory directly produced American revolutionary ideology: Locke\'s "Two Treatises of Government" (1689) argued that government derives legitimacy from consent of the governed; that government violating natural rights forfeits its legitimacy; and that citizens have the right to dissolve and replace illegitimate government. Jefferson\'s Declaration of Independence translated this framework directly: "governments are instituted among men, deriving their just powers from the consent of the governed... whenever any form of government becomes destructive of these ends, it is the right of the people to alter or to abolish it." The Declaration is Lockean social contract theory applied to the specific case of British colonial governance.',
    confidence: 'high' },
  { id: 'social_contract_theory__democratic_backsliding',
    source: 'social_contract_theory', target: 'democratic_backsliding', type: 'ENABLED',
    label: 'Democratic backsliding violates social contract theory\'s premises while using social contract language to justify minority rule',
    note: 'Democratic backsliding is social contract theory\'s pathology: authoritarians use the language of social contract (we represent the people\'s true will; the election that chose our opponents was illegitimate) while dismantling the institutional mechanisms (independent courts, free press, opposition parties) that make social contract real. Trump\'s "I am the only one who can fix it" (2016) and election denial (2020) are social contract inversions: claiming to represent popular will while rejecting the electoral mechanism that determines it. This reveals the social contract\'s vulnerability — it requires not only formal institutions but shared belief in those institutions\' legitimacy. When one faction rejects institutional legitimacy, the social contract theory that justifies democratic government cannot compel compliance.',
    confidence: 'high' },
];

// ── Psychology edges ──────────────────────────────────────────────────────
const newPsychEdges = [
  // toxic_masculinity
  { id: 'toxic_masculinity__incel_community',
    source: 'toxic_masculinity', target: 'incel_community', type: 'PRODUCED',
    label: 'Incel culture represents toxic masculinity reaching its logical extreme — male identity defined entirely by sexual access to women',
    note: 'Incel culture is toxic masculinity at its ideological extreme: the foundational incel premise — that male worth is determined by sexual access to women, and that men who cannot achieve this access are fundamentally worthless — is the most extreme expression of masculinity defined through dominance and women as objects. Toxic masculinity norms (men should not show vulnerability, men should have sexual conquest, emotional needs should be suppressed) produce the specific pathology: inability to express loneliness except as rage, inability to process rejection except as entitlement violation, inability to value relationships not structured around dominance. Incel violence (Elliot Rodger, Alek Minassian) is toxic masculinity\'s terminus point.',
    confidence: 'high' },
  { id: 'toxic_masculinity__mental_health_stigma',
    source: 'toxic_masculinity', target: 'mental_health_stigma', type: 'ENABLED',
    label: 'Toxic masculinity norms (real men are tough, don\'t need help) are primary drivers of men\'s mental health treatment avoidance',
    note: 'Toxic masculinity produces mental health treatment avoidance: research consistently shows men are less likely to seek mental health treatment than women; the primary barrier is not access but stigma from masculinity norms — seeking therapy is framed as weakness, emotional acknowledgment as femininity; men die by suicide at 3-4x the rate of women (higher rates, lower attempt rates) largely because men use more lethal means and delay help-seeking; men\'s mental health crisis (loneliness epidemic, suicide rates, substance abuse) is substantially exacerbated by the masculine norm that men should handle problems alone. Toxic masculinity\'s most direct harm may be to men themselves through systematic prevention of help-seeking and emotional expression.',
    confidence: 'high' },

  // echo chamber
  { id: 'echo_chamber__political_polarization',
    source: 'echo_chamber', target: 'political_polarization', type: 'CAUSED',
    label: 'Echo chambers produce affective polarization — not just political disagreement but mutual contempt between partisan groups who perceive each other as alien',
    note: 'Echo chambers produce affective polarization (hostility toward the other party, not just policy disagreement): Eli Pariser\'s "Filter Bubble" (2011) documented how algorithmic personalization created ideologically homogeneous information environments; research shows that partisan media consumption correlates with negative out-group affect more than policy positions; Pew Research documents that partisan hostility is at historic highs — Republicans and Democrats increasingly view each other as threats to the country, not political opponents. Echo chambers make this possible by ensuring people encounter the most extreme and threatening versions of the opposing side (antagonist content generates engagement) without normal context that would humanize political opponents.',
    confidence: 'high' },
  { id: 'echo_chamber__social_media_algorithms',
    source: 'echo_chamber', target: 'social_media_algorithms', type: 'PRODUCED',
    label: 'Social media algorithms produce echo chambers through engagement optimization — content that confirms existing beliefs generates more interaction',
    note: 'Social media algorithms produce echo chambers through their optimization logic: content that generates strong reactions (agreement, outrage, disgust) from users produces more engagement metrics (likes, shares, comments); algorithms trained on engagement therefore preferentially serve content that reinforces existing beliefs and triggers strong emotional responses; over time, this produces homogeneous information environments where challenging views are filtered out. Facebook\'s own internal research (revealed in 2021 "Facebook Papers") showed the platform\'s algorithm amplified divisive content and that algorithm changes to reduce divisiveness also reduced engagement. The echo chamber is not accidental — it is the predictable product of engagement-optimized recommendation systems.',
    confidence: 'high' },
];

// ── Health edges ──────────────────────────────────────────────────────────
const newHealthEdges = [
  // neurodiversity
  { id: 'neurodiversity__anti_psychiatry_movement',
    source: 'neurodiversity', target: 'anti_psychiatry_movement', type: 'SHARES_MECHANISM_WITH',
    label: 'Neurodiversity and anti-psychiatry both challenge psychiatric authority to define and treat neurological difference, though from different directions',
    note: 'Neurodiversity and anti-psychiatry share the challenge to psychiatric diagnostic authority but with key differences: anti-psychiatry (Szasz, Laing, Foucault) critiques all psychiatric diagnosis as social control; neurodiversity accepts autism and ADHD diagnoses as descriptive while rejecting the pathology framing; anti-psychiatry often opposes medication; neurodiversity advocates may support medication chosen by the neurodivergent person. Both challenge the assumption that neurological difference from statistical norms requires clinical intervention. The neurodiversity movement is more pragmatic — seeking accommodation and respect within existing institutions rather than abolishing psychiatric authority entirely.',
    confidence: 'high' },
  { id: 'neurodiversity__disability_rights',
    source: 'neurodiversity', target: 'disability_rights', type: 'ENABLED',
    label: 'Neurodiversity is the application of disability rights\' social model to neurological conditions',
    note: 'Neurodiversity is disability rights philosophy applied to neurological variation: the social model of disability holds that people are disabled not by their bodies/minds but by social barriers that fail to accommodate variation; neurodiversity applies this to autism (not a disorder requiring cure, but a way of being requiring accommodation), ADHD (not a deficit but a different attentional profile requiring different work environments), and dyslexia (not a reading disorder but a different cognitive style requiring different teaching methods). The ADA already covers many neurodivergent conditions; the neurodiversity movement pushes further to reframe accommodation as normal rather than exceptional. The connection is explicit — many neurodiversity advocates developed their framework directly from disability rights philosophy.',
    confidence: 'high' },

  // tobacco industry
  { id: 'tobacco_industry__climate_change_denial',
    source: 'tobacco_industry', target: 'climate_change_denial', type: 'PRODUCED',
    label: 'Tobacco industry PR firms and strategies were directly transferred to climate denial campaigns',
    note: 'The climate denial playbook was explicitly borrowed from tobacco: the "Tobacco Institute" model (industry-funded research organization presenting industry position as independent science) was reproduced in the Global Climate Coalition; Hill & Knowlton (tobacco PR) and the same PR professionals who managed tobacco denial consulted on climate denial campaigns; the specific strategy — "manufacture doubt about scientific consensus rather than prove alternative" — was developed by tobacco and licensed to other industries; Naomi Oreskes documented that the same scientists who did tobacco denial (Frederick Seitz, Fred Singer) subsequently did climate denial through the same organization (George C. Marshall Institute). The tobacco industry invented the playbook; fossil fuels copied it.',
    confidence: 'high' },
  { id: 'tobacco_industry__regulatory_capture',
    source: 'tobacco_industry', target: 'regulatory_capture', type: 'ENABLED',
    label: 'Tobacco industry regulatory capture of the FDA delayed classification of nicotine as a drug and tobacco products as drug delivery devices for decades',
    note: 'Tobacco regulatory capture is the historical precursor to pharmaceutical regulatory capture: the FDA repeatedly attempted to regulate tobacco as a nicotine delivery device (nicotine is pharmacologically active); Congress passed the Family Smoking Prevention and Tobacco Control Act only in 2009 — after decades of failed FDA attempts blocked by tobacco industry lobbying; tobacco companies spent $13 million lobbying in 2009 to shape the bill\'s provisions; the resulting law was criticized by public health advocates as too weak. The tobacco industry\'s regulatory capture success (for six decades after cancer causation was established in 1950) became the template for pharmaceutical industry regulatory capture strategies.',
    confidence: 'high' },
];

// ── Media edges ───────────────────────────────────────────────────────────
const newMediaEdges = [
  // internet and democracy
  { id: 'internet_and_democracy__social_media_algorithms',
    source: 'internet_and_democracy', target: 'social_media_algorithms', type: 'ENABLED',
    label: 'The internet\'s democratic promise was subverted by social media algorithms that optimize for engagement over civic participation',
    note: 'The internet\'s initial democratic promise (global information access, decentralized voice, horizontal communication) was fundamentally altered by social media platforms\' emergence: the early internet\'s open architecture was replaced by a few dominant platforms (Facebook, Twitter, YouTube) that algorithmically manage information flow for engagement optimization; the democratizing technology became a radicalization and polarization machine; authoritarian states (China, Russia, Turkey, Hungary) learned to use the same infrastructure for censorship and disinformation. The gap between the internet\'s democratic potential and its actual political effects reflects the choice to build engagement-optimized platforms rather than information-quality-optimized platforms.',
    confidence: 'high' },
  { id: 'internet_and_democracy__broken_epistemology',
    source: 'internet_and_democracy', target: 'broken_epistemology', type: 'PRODUCED',
    label: 'The internet disrupted the institutional intermediaries (professional journalism, expert credentialing) that had maintained shared epistemic standards',
    note: 'The internet produced broken epistemology by eliminating the friction that had previously limited information spread: pre-internet, publishing required institutional backing (newspaper, publishing house, broadcaster) that provided epistemic gatekeeping — not perfect but limiting the most obviously false content; the internet eliminated these gatekeepers, enabling anyone to publish anything at global scale with no quality control; search engines and social media algorithms then amplified content without regard to accuracy; the result is an information environment where conspiracy theories, disinformation, and accurate information are distributed through the same channels without reliable quality signals. The broken epistemology is the internet\'s fundamental political legacy.',
    confidence: 'high' },
  { id: 'internet_and_democracy__great_firewall_china',
    source: 'internet_and_democracy', target: 'great_firewall_china', type: 'ENABLED',
    label: 'China\'s Great Firewall demonstrated that the internet is not inherently democratic — it can be controlled to produce a state-managed information environment',
    note: 'China\'s Great Firewall refuted the techno-optimist assumption that the internet was inherently democratizing: the "Barlow Declaration of Independence of Cyberspace" (1996) asserted that states could not control the internet; China proved otherwise; the Great Firewall demonstrated that a technically sophisticated state could fragment the global internet into a national intranet, censor political content with reasonable completeness, and use internet infrastructure for surveillance. Other authoritarian states (Russia, Iran, Turkey) have studied and partially adopted the Chinese model. China\'s success has made the "internet as democracy technology" claim untenable — it is a democracy technology when states allow it to be and an authoritarian technology when they choose otherwise.',
    confidence: 'high' },
];

// ── Write all files ───────────────────────────────────────────────────────
let pnAdded=0, hnAdded=0, mnAdded=0, psnAdded=0, hlnAdded=0, mednAdded=0;
let peAdded=0, heAdded=0, meAdded=0, pseAdded=0, hleAdded=0, medeAdded=0;

newPolitNodes.forEach(n => { if (!pnIds.has(n.id)) { pn.push(n); pnIds.add(n.id); pnAdded++; } });
newHistNodes.forEach(n => { if (!hnIds.has(n.id)) { hn.push(n); hnIds.add(n.id); hnAdded++; } });
newMechNodes.forEach(n => { if (!mnIds.has(n.id)) { mn.push(n); mnIds.add(n.id); mnAdded++; } });
newPsychNodes.forEach(n => { if (!psnIds.has(n.id)) { psn.push(n); psnIds.add(n.id); psnAdded++; } });
newHealthNodes.forEach(n => { if (!hlnIds.has(n.id)) { hln.push(n); hlnIds.add(n.id); hlnAdded++; } });
newMediaNodes.forEach(n => { if (!mednIds.has(n.id)) { medn.push(n); mednIds.add(n.id); mednAdded++; } });

newPolitEdges.forEach(e => { if (!peIds.has(e.id)) { pe.push(e); peIds.add(e.id); peAdded++; } });
newHistEdges.forEach(e => { if (!heIds.has(e.id)) { he.push(e); heIds.add(e.id); heAdded++; } });
newMechEdges.forEach(e => { if (!meIds.has(e.id)) { me.push(e); meIds.add(e.id); meAdded++; } });
newPsychEdges.forEach(e => { if (!pseIds.has(e.id)) { pse.push(e); pseIds.add(e.id); pseAdded++; } });
newHealthEdges.forEach(e => { if (!hleIds.has(e.id)) { hle.push(e); hleIds.add(e.id); hleAdded++; } });
newMediaEdges.forEach(e => { if (!medeIds.has(e.id)) { mede.push(e); medeIds.add(e.id); medeAdded++; } });

fs.writeFileSync(D('data/global/politics/nodes.json'), JSON.stringify(pn, null, 2));
fs.writeFileSync(D('data/global/history/nodes.json'), JSON.stringify(hn, null, 2));
fs.writeFileSync(D('data/mechanisms/nodes.json'), JSON.stringify(mn, null, 2));
fs.writeFileSync(D('data/global/psychology/nodes.json'), JSON.stringify(psn, null, 2));
fs.writeFileSync(D('data/global/health/nodes.json'), JSON.stringify(hln, null, 2));
fs.writeFileSync(D('data/global/media/nodes.json'), JSON.stringify(medn, null, 2));
fs.writeFileSync(D('data/global/politics/edges.json'), JSON.stringify(pe, null, 2));
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(he, null, 2));
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
fs.writeFileSync(D('data/global/psychology/edges.json'), JSON.stringify(pse, null, 2));
fs.writeFileSync(D('data/global/health/edges.json'), JSON.stringify(hle, null, 2));
fs.writeFileSync(D('data/global/media/edges.json'), JSON.stringify(mede, null, 2));

console.log('Politics: +'+pnAdded+' nodes, +'+peAdded+' edges -> '+pn.length+' nodes, '+pe.length+' edges');
console.log('History: +'+hnAdded+' nodes, +'+heAdded+' edges -> '+hn.length+' nodes, '+he.length+' edges');
console.log('Mechanisms: +'+mnAdded+' nodes, +'+meAdded+' edges -> '+mn.length+' nodes, '+me.length+' edges');
console.log('Psychology: +'+psnAdded+' nodes, +'+pseAdded+' edges -> '+psn.length+' nodes, '+pse.length+' edges');
console.log('Health: +'+hlnAdded+' nodes, +'+hleAdded+' edges -> '+hln.length+' nodes, '+hle.length+' edges');
console.log('Media: +'+mednAdded+' nodes, +'+medeAdded+' edges -> '+medn.length+' nodes, '+mede.length+' edges');

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s => {
  JSON.parse(fs.readFileSync(D('data/'+s+'/edges.json'))).forEach(e => {
    if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source, 'edge:', e.id); orphans++; }
    if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target, 'edge:', e.id); orphans++; }
  });
});
console.log('Total orphans:', orphans);
