#!/usr/bin/env node
// add_major_nodes.js — adds high-connectivity nodes missing from the dataset
// These are structural pivots that connect to many existing nodes.
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

function addNodes(f, nn) {
  const ex = JSON.parse(fs.readFileSync(f));
  const ids = new Set(ex.map(n => n.id));
  let a = 0;
  for (const n of nn) if (!ids.has(n.id)) { ex.push(n); ids.add(n.id); a++; }
  if (a) fs.writeFileSync(f, JSON.stringify(ex, null, 2));
  console.log(f.split('/').slice(-2).join('/'), 'nodes: +' + a, '→', ex.length);
}

function addEdges(f, ee) {
  const ex = JSON.parse(fs.readFileSync(f));
  const ids = new Set(ex.map(e => e.id));
  let a = 0;
  for (const e of ee) if (!ids.has(e.id)) { ex.push(e); ids.add(e.id); a++; }
  if (a) fs.writeFileSync(f, JSON.stringify(ex, null, 2));
  console.log(f.split('/').slice(-2).join('/'), 'edges: +' + a, '→', ex.length);
}

// ── New history nodes ───────────────────────────────────────────────────────
addNodes(D('data/global/history/nodes.json'), [
  {
    id: 'french_revolution', label: 'French Revolution', node_type: 'reference', category: 'event',
    decade: '1780s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/French_Revolution',
    summary: 'The French Revolution (1789–1799) overthrew the Bourbon monarchy, dismantled feudalism and the aristocracy, established the secular republic, and produced the Declaration of the Rights of Man. It exported Enlightenment principles at bayonet-point across Europe through the Revolutionary and Napoleonic Wars. Its ideological legacy — liberty, equality, fraternity — shaped all subsequent democratic, nationalist, and socialist movements. It also inaugurated the Terror and Napoleon\'s empire, raising the question of whether Enlightenment ideals produce or undermine the tyranny they claim to oppose.',
    tags: ['enlightenment', 'democracy', 'revolution', 'jacobins', 'terror', 'napoleon', 'rights', 'secularism']
  },
  {
    id: 'scientific_revolution', label: 'Scientific Revolution', node_type: 'reference', category: 'movement',
    decade: '1540s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Scientific_Revolution',
    summary: 'The Scientific Revolution (c. 1543–1687) — from Copernicus\'s heliocentric model through Galileo\'s experimental method to Newton\'s Principia — replaced Aristotelian natural philosophy and Catholic cosmology with a mechanistic, mathematical account of nature. It produced the methods (hypothesis, experiment, peer criticism) and institutions (Royal Society, 1660) that define modern science, and decisively challenged the Church\'s authority to define truth about the natural world. The Revolution\'s mechanistic worldview eventually destabilized not just cosmology but biology, economics, and social philosophy.',
    tags: ['copernicus', 'galileo', 'newton', 'enlightenment', 'church-conflict', 'methodology', 'materialism']
  },
  {
    id: 'industrial_revolution', label: 'Industrial Revolution', node_type: 'reference', category: 'movement',
    decade: '1760s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Industrial_Revolution',
    summary: 'The Industrial Revolution (c. 1760–1840, Britain first; spreading globally through 1900) transformed agrarian economies into industrial ones through steam power, textile mechanization, iron/steel production, and railway networks. It produced: urban working classes, capitalism as a dominant economic system, Karl Marx\'s analysis of industrial wage labor, catastrophic child labor and factory conditions, and the environmental destruction of industrialization. The Revolution\'s geographical unevenness (Britain first, then Europe/US, then the Global South) structured global inequality for the next two centuries.',
    tags: ['capitalism', 'labor', 'urbanization', 'steam-power', 'colonialism', 'marx', 'environment']
  },
  {
    id: 'american_revolution', label: 'American Revolution', node_type: 'reference', category: 'event',
    decade: '1770s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/American_Revolution',
    summary: 'The American Revolution (1775–1783) established the United States as the first modern republic built on Enlightenment principles: popular sovereignty, individual rights, separation of powers, and religious freedom. The Declaration of Independence and Constitution operationalized Locke, Montesquieu, and Rousseau\'s theories. The Revolution\'s contradiction — proclaiming universal equality while maintaining slavery — determined American political conflict for the next 200 years. It inspired the French Revolution and global democratic movements, but its constitutional settlement ultimately protected slaveholder interests through the Senate, Electoral College, and Three-Fifths Compromise.',
    tags: ['enlightenment', 'democracy', 'locke', 'constitution', 'slavery-contradiction', 'republic', 'independence']
  },
  {
    id: 'napoleon_bonaparte', label: 'Napoleon Bonaparte', node_type: 'reference', category: 'person',
    decade: '1790s', scope: 'global/history', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/Napoleon_Bonaparte',
    summary: 'Napoleon Bonaparte (1769–1821) conquered most of continental Europe, codified Enlightenment legal principles in the Napoleonic Code (secular law, property rights, equality before law), and through conquest spread French revolutionary principles across Europe while simultaneously demonstrating that enlightened despotism was still despotism. His defeat (Waterloo, 1815) produced the Congress of Vienna\'s conservative restoration but could not put the genie of national self-determination back in the bottle. Modern European nationalism — both the liberal and ethnic variants — is a direct response to Napoleonic conquest.',
    tags: ['france', 'enlightenment', 'empire', 'nationalism', 'law', 'congress-of-vienna', 'europe']
  },
]);

// ── New media node ──────────────────────────────────────────────────────────
addNodes(D('data/global/media/nodes.json'), [
  {
    id: 'world_wide_web', label: 'World Wide Web / Internet', node_type: 'reference', category: 'technology',
    decade: '1990s', scope: 'global/media', cross_scope: false,
    wikipedia: 'https://en.wikipedia.org/wiki/World_Wide_Web',
    summary: 'Tim Berners-Lee\'s World Wide Web (1991) — and the internet infrastructure underneath it — is the printing press of the digital age: the most radical transformation of information production and distribution since Gutenberg. It eliminated gatekeepers (publishers, broadcasters, governments) from information distribution, enabling everyone to publish and everything to be published. This democratization produced Wikipedia and citizen journalism alongside climate denial and deepfakes. The web\'s architectural properties (hyperlinks, search, viral sharing) produced attention economy dynamics, filter bubbles, and the collapse of the distinction between journalism, entertainment, and propaganda.',
    tags: ['internet', 'berners-lee', 'digital-revolution', 'information', 'gatekeepers', 'democratization', 'algorithmic']
  },
]);

// ── History edges for new nodes ─────────────────────────────────────────────
addEdges(D('data/global/history/edges.json'), [
  // french_revolution
  { id: 'enlightenment_philosophy__french_revolution',
    source: 'enlightenment_philosophy', target: 'french_revolution', type: 'PRODUCED',
    label: 'The French Revolution was the political implementation of Enlightenment principles at revolutionary scale',
    note: 'The French Revolution was philosophically produced by the Enlightenment: Rousseau\'s general will (popular sovereignty), Voltaire\'s anti-clericalism, Montesquieu\'s separation of powers, and Locke\'s natural rights were all operationalized in the Declaration of the Rights of Man (1789) and subsequent constitutional experiments. The Revolution\'s leaders (Robespierre, Mirabeau) were Enlightenment readers; the Revolution\'s ideology was Enlightenment ideology in political action. Whether the Terror demonstrated the dangers of Enlightenment rationalism applied to politics remains the central debate.',
    confidence: 'high' },
  { id: 'voltaire__french_revolution',
    source: 'voltaire', target: 'french_revolution', type: 'ENABLED',
    label: 'Voltaire\'s anti-clerical critique prepared the ideological ground for the Revolution\'s assault on the Church',
    note: 'Voltaire\'s sustained critique of Catholic institutional power — \"Écrasez l\'infâme\" (crush the infamous one, meaning the Church) — was the cultural preparation for the Revolution\'s anti-clerical phase: the Civil Constitution of the Clergy (1790), confiscation of Church property, and suppression of religious orders. The Revolution\'s leaders saw themselves as executing Voltaire\'s program. Robespierre replaced Christianity with the Cult of the Supreme Being using explicitly Voltairean deist reasoning. Voltaire\'s popularization of Enlightenment anti-clericalism became the Revolution\'s operational ideology.',
    confidence: 'high' },
  { id: 'french_revolution__napoleon_bonaparte',
    source: 'french_revolution', target: 'napoleon_bonaparte', type: 'PRODUCED',
    label: 'Napoleon emerged from the Revolution and institutionalized its achievements through conquest',
    note: 'Napoleon rose through the Revolutionary Wars and used his military success to seize power (18 Brumaire, 1799). He simultaneously preserved the Revolution\'s core achievements (Napoleonic Code, abolition of feudalism, religious toleration) and reversed its political form (from republic to empire). Napoleon is the Revolution\'s institutionalizer: he took its legal and administrative innovations and spread them across Europe through conquest, but demonstrated that revolutionary principles are compatible with authoritarian rule if the ruler carries the reforms.',
    confidence: 'high' },
  { id: 'french_revolution__protestant_reformation',
    source: 'french_revolution', target: 'protestant_reformation', type: 'SHARES_MECHANISM_WITH',
    label: 'Both dismantled ancient institutional authority structures through popular mobilization; both spawned terror and reaction',
    note: 'The French Revolution and Protestant Reformation share structural parallels as world-historical ruptures: both attacked the same Catholic institutional authority (Reformation: theological; Revolution: political/economic), both mobilized popular movements against established hierarchy, both produced internal violence and persecution (Reformation Wars; Terror), both spawned reaction (Counter-Reformation; Holy Alliance), and both ultimately succeeded in transforming European civilization in ways their opponents could not fully reverse. The Reformation produced the preconditions for the Enlightenment that produced the Revolution.',
    confidence: 'high' },
  { id: 'french_revolution__american_revolution',
    source: 'french_revolution', target: 'american_revolution', type: 'SHARES_MECHANISM_WITH',
    label: 'French and American revolutions were parallel Enlightenment experiments with starkly different outcomes',
    note: 'The American and French Revolutions were parallel applications of the same Enlightenment theory, with divergent results that political scientists still study. Both proclaimed popular sovereignty and individual rights; both drew on Locke, Rousseau, and Montesquieu. The American Revolution produced a durable constitutional republic; the French Revolution produced the Terror, Napoleon, Restoration, 1830, 1848, 1870-71 — repeated cycles of revolution and reaction. The divergence is explained by: pre-existing English constitutional traditions (US); absence of feudal institutional frameworks (US); and the total nature of French social transformation versus American preservation of existing property relations (slavery).',
    confidence: 'high' },

  // scientific_revolution
  { id: 'scholasticism__scientific_revolution',
    source: 'scholasticism', target: 'scientific_revolution', type: 'ENABLED',
    label: 'Scholasticism\'s recovery of Aristotelian natural philosophy created the framework the Scientific Revolution had to overcome',
    note: 'The Scientific Revolution began inside scholastic institutions (universities) working within scholastic frameworks: Copernicus was a cathedral canon; Galileo taught at Padua; Newton at Cambridge. The Revolution was not against learning but against specific scholastic claims — Aristotelian geocentrism, physics, and biology — that had been integrated into Catholic theology. Scholasticism paradoxically enabled the Scientific Revolution by creating the institutional infrastructure (universities), methodological tools (logic, commentary, debate), and specific targets that the Revolution\'s empiricism and mathematics had to defeat.',
    confidence: 'high' },
  { id: 'scientific_revolution__enlightenment_philosophy',
    source: 'scientific_revolution', target: 'enlightenment_philosophy', type: 'PRODUCED',
    label: 'The Scientific Revolution\'s method (reason + evidence) became the Enlightenment\'s philosophical foundation',
    note: 'The Enlightenment is inconceivable without the Scientific Revolution: Newton\'s success in explaining planetary motion through mathematical laws suggested that rational inquiry could explain all natural phenomena, including human society. Locke\'s epistemology was explicitly modeled on Newtonian method. Voltaire popularized Newton for French audiences. The Enlightenment\'s core claim — that reason can replace revelation as the foundation of knowledge — was validated by the Scientific Revolution\'s empirical achievements. The Revolution produced the template; the Enlightenment applied it to politics, ethics, and society.',
    confidence: 'high' },
  { id: 'scientific_revolution__charles_darwin',
    source: 'scientific_revolution', target: 'charles_darwin', type: 'ENABLED',
    label: 'The Scientific Revolution\'s methodology and institutional framework enabled Darwin\'s evolutionary synthesis',
    note: 'Darwin\'s evolutionary theory is the direct application of Scientific Revolution methodology (empirical observation, hypothesis, natural law) to biology. The institutional framework the Revolution created (scientific societies, journals, expedition funding) enabled Darwin\'s Beagle voyage and the comparative biology that produced natural selection. Darwin\'s specific intellectual debts: Lyell\'s geological uniformitarianism (extending Scientific Revolution method to deep time) and Malthus\'s population mathematics. Natural selection is the Scientific Revolution completed — biology finally acquiring the mathematical-empirical character that astronomy achieved with Newton.',
    confidence: 'high' },
  { id: 'scientific_revolution__thomas_aquinas',
    source: 'scientific_revolution', target: 'thomas_aquinas', type: 'DISCREDITED',
    label: 'The Scientific Revolution systematically dismantled Aristotelian natural philosophy that Aquinas had Christianized',
    note: 'Aquinas\'s Christianization of Aristotle (Summa Theologica) integrated Aristotelian cosmology (geocentrism, crystal spheres, four elements, teleology) into Catholic doctrine. The Scientific Revolution targeted precisely these Aristotelian elements: Copernicus\'s heliocentrism (1543), Galileo\'s mechanics and telescope observations, and Newton\'s universal gravitation dismantled geocentrism, the physics of natural place, and teleological explanation. The Church\'s resistance (Galileo trial, Index of Forbidden Books) was resistance to the scientific critique of Aquinas — the two were inseparable in Catholic theology.',
    confidence: 'high' },

  // industrial_revolution
  { id: 'industrial_revolution__karl_marx',
    source: 'industrial_revolution', target: 'karl_marx', type: 'PRODUCED',
    label: 'Industrial capitalism\'s condition of the working class produced Marx\'s critique and revolutionary program',
    note: 'Marx\'s Capital (1867) is incomprehensible without the Industrial Revolution: the factory system, wage labor, commodity production, capital accumulation, and the working class as a political subject are all Industrial Revolution creations that Marx analyzed. Friedrich Engels\'s \"Condition of the Working Class in England\" (1845) — based on direct observation of Manchester\'s industrial labor conditions — was the empirical foundation for Marxist theory. Without the Industrial Revolution\'s brutal working conditions, child labor, and class formation, there is no Marx, no socialism, no communist movement.',
    confidence: 'high' },
  { id: 'industrial_revolution__leaded_gasoline_cover_up',
    source: 'industrial_revolution', target: 'leaded_gasoline_cover_up', type: 'ENABLED',
    label: 'Industrial capitalism\'s externalization of costs produced the corporate environmental cover-up pattern',
    note: 'The Industrial Revolution established the pattern that leaded gasoline cover-ups and all subsequent corporate environmental cover-ups follow: industrial processes externalize their costs (pollution, health damage) onto the public while privatizing profits. The legal and economic frameworks for treating environmental externalities as acceptable — which enabled the lead industry to suppress evidence of neurological harm for 60 years — were built by industrial capitalism\'s foundational premise that producers are not responsible for downstream harms. The Industrial Revolution created the industrial liability evasion playbook.',
    confidence: 'high' },
  { id: 'industrial_revolution__protestant_reformation',
    source: 'industrial_revolution', target: 'protestant_reformation', type: 'ENABLED',
    label: 'Weber\'s Protestant Ethic argument: Calvinist work ethic and asceticism enabled industrial capitalist accumulation',
    note: 'Max Weber\'s \"Protestant Ethic and the Spirit of Capitalism\" (1905) argues that the Industrial Revolution\'s geographic concentration in Protestant countries (Britain, Germany, Netherlands, New England) reflects a Calvinist cultural substrate: the calling (Beruf), predestination\'s anxiety about salvation resolved through worldly success, and ascetic reinvestment of profits rather than consumption — created the capital accumulation and rational economic conduct that industrialization required. The connection between Calvinist theological doctrine (enabled by Reformation) and Industrial Revolution productivity is not coincidental but structural.',
    confidence: 'medium' },

  // american_revolution
  { id: 'enlightenment_philosophy__american_revolution',
    source: 'enlightenment_philosophy', target: 'american_revolution', type: 'PRODUCED',
    label: 'The American Revolution operationalized Locke\'s natural rights theory and Montesquieu\'s separation of powers',
    note: 'The Declaration of Independence is applied Enlightenment philosophy: Jefferson\'s self-evident truths (life, liberty, pursuit of happiness) are Lockean natural rights; Madison\'s constitutional architecture is Montesquieu\'s separation of powers. The Founders were self-conscious Enlightenment intellectuals applying European theory to create a new state. The American Revolution is uniquely the revolution that succeeded in institutionalizing Enlightenment ideals, creating the model that French and subsequent revolutionaries attempted — and generally failed — to replicate.',
    confidence: 'high' },
  { id: 'american_revolution__french_revolution',
    source: 'american_revolution', target: 'french_revolution', type: 'ENABLED',
    label: 'American Revolution success proved Enlightenment political theory could work in practice, inspiring France',
    note: 'The American Revolution\'s success was the proof of concept that inspired French revolutionaries: Enlightenment natural rights theory wasn\'t just philosophy — it could produce a functioning republic. Lafayette, who fought in the American Revolution, was a leader of the early French Revolution. The Declaration of the Rights of Man (1789) is explicitly modeled on the American Declaration. French officers who fought in America (Lafayette, Rochambeau) brought back both ideals and the practical experience of revolutionary governance. The American example made the French Revolution thinkable.',
    confidence: 'high' },

  // napoleon_bonaparte
  { id: 'napoleon_bonaparte__karl_marx',
    source: 'napoleon_bonaparte', target: 'karl_marx', type: 'ENABLED',
    label: 'Napoleon\'s dissolution of feudal structures across Europe created the capitalist conditions Marx analyzed',
    note: 'Napoleon\'s conquests dissolved feudal legal structures across continental Europe (abolition of serfdom, legal equality, property rights reform) — creating the capitalist class relations that Marx then analyzed as producing exploitation. In Hegel\'s famous account (the "World Spirit on horseback"), Napoleon represented the Enlightenment\'s historical force completing the French Revolution\'s bourgeois program across Europe. Marx agreed: Napoleon\'s historical role was to clear the feudal ground for capitalist development. The capitalism that produced the proletariat Marx analyzed was made possible by Napoleon\'s legal revolution.',
    confidence: 'medium' },
  { id: 'napoleon_bonaparte__congress_of_vienna',
    source: 'napoleon_bonaparte', target: 'congress_of_vienna', type: 'PRODUCED',
    label: 'Napoleon\'s conquest of Europe produced the Congress of Vienna\'s conservative counter-revolutionary architecture',
    note: 'The Congress of Vienna (1814-15) was entirely organized around preventing the recurrence of Napoleonic Europe: Metternich\'s Concert of Europe system established collective great-power management of the revolutionary threat, legitimism (the right of monarchies to their thrones) as counter-revolutionary ideology, and the balance of power as the mechanism to prevent any single power\'s hegemony. Every major European diplomatic development 1815-1914 was a product of or reaction against the Vienna system Napoleon\'s defeat made necessary.',
    confidence: 'high' },
]);

// ── Media edges for world_wide_web ─────────────────────────────────────────
addEdges(D('data/global/media/edges.json'), [
  { id: 'world_wide_web__social_media_platforms',
    source: 'world_wide_web', target: 'social_media_platforms', type: 'PRODUCED',
    label: 'Social media platforms are the web\'s most consequential applications, transforming its democratic promise into engagement optimization',
    note: 'The World Wide Web\'s architectural promise — anyone can publish, anyone can read — was fulfilled and perverted simultaneously by social media platforms. Facebook, Twitter, YouTube, and TikTok democratized publication but centralized distribution, replacing editorial gatekeeping with algorithmic gatekeeping optimized for engagement rather than accuracy. The web\'s open protocol layer (TCP/IP, HTTP) was captured by application-layer monopolies. Social media is what happened to the web when advertising became its business model.',
    confidence: 'high' },
  { id: 'world_wide_web__attention_economy',
    source: 'world_wide_web', target: 'attention_economy', type: 'PRODUCED',
    label: 'The web\'s infinite supply of content required attention as the scarce resource, producing the attention economy',
    note: 'Before the web, scarcity in information was content: there was limited space in newspapers, airtime on TV, shelf space in bookstores. The web eliminated content scarcity and created attention scarcity: with infinite content available, human attention became the scarce resource that media companies compete for. This inversion — from content-scarce to attention-scarce — is the structural shift that produced the attention economy, with all its downstream effects (outrage optimization, engagement maximization, filter bubbles).',
    confidence: 'high' },
  { id: 'world_wide_web__local_news_collapse',
    source: 'world_wide_web', target: 'local_news_collapse', type: 'PRODUCED',
    label: 'Web classified ads (Craigslist) and digital advertising destroyed local newspaper revenue models',
    note: 'The web directly caused the local news collapse through revenue destruction: Craigslist (1995) eliminated classified advertising, the largest revenue source for local newspapers; Google AdSense captured display advertising by providing better targeting; Facebook news feeds replaced local newspapers as community information hubs. Between 1990 and 2020, daily newspaper circulation fell 57%; newsroom employment fell 57%; 2,100 US papers closed. The web didn\'t mean to kill local news — it just offered superior alternatives to every service local newspapers provided.',
    confidence: 'high' },
  { id: 'printing_press__world_wide_web',
    source: 'printing_press', target: 'world_wide_web', type: 'SHARES_MECHANISM_WITH',
    label: 'Both eliminated gatekeepers from information distribution, producing simultaneous democratization and disinformation explosion',
    note: 'The printing press (Gutenberg, c. 1440) and World Wide Web (Berners-Lee, 1991) are the two great gatekeeping-elimination events in information history. Both followed the same pattern: initial promise of democratic information access → rapid adoption → incumbent institutions challenged → new forms of disinformation (printing press: Protestant pamphlet wars, witch trial manuals; web: social media disinformation, QAnon). Both required decades for society to develop norms and institutions adequate to the new information environment.',
    confidence: 'high' },
  { id: 'world_wide_web__deepfakes',
    source: 'world_wide_web', target: 'deepfakes', type: 'ENABLED',
    label: 'Web infrastructure provides the distribution and computational resources that make deepfakes a disinformation threat',
    note: 'Deepfakes require two web-dependent conditions: (1) cloud computing and open-source AI frameworks (GitHub, Hugging Face) that make generation accessible; (2) web distribution infrastructure (social media, messaging apps) that ensures rapid spread before debunking. A deepfake without the web is a private curiosity; with the web it becomes a potential election weapon. The web didn\'t create deepfake technology but it created the conditions under which deepfakes matter — the combination of generation accessibility and distribution velocity.',
    confidence: 'high' },
  { id: 'world_wide_web__cambridge_analytica',
    source: 'world_wide_web', target: 'cambridge_analytica', type: 'ENABLED',
    label: 'Web behavioral data trails made psychographic profiling at scale possible for the first time',
    note: 'Cambridge Analytica\'s operation was only possible because the web generates behavioral data traces at scale: Facebook\'s data (likes, follows, sharing patterns) captured the psychological profiles of 87 million users, enabling psychographic micro-targeting that traditional polling could never achieve. Without web infrastructure\'s passive data collection, there is no Cambridge Analytica — the firm\'s product (psychological profiles for political targeting) required the web\'s capacity to passively document human behavior at the scale of billions of interactions.',
    confidence: 'high' },
]);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
['global/media','global/history'].forEach(s => {
  JSON.parse(fs.readFileSync(D('data/'+s+'/edges.json'))).forEach(e => {
    if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source, 'in', s); orphans++; }
    if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target, 'in', s); orphans++; }
  });
});
console.log('Orphans:', orphans);
