#!/usr/bin/env node
// add_major_nodes_mech_edges.js — mechanism cross-scope edges for new major nodes
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const exIds = new Set(me.map(e => e.id));

const batch = [
  // ── french_revolution ─────────────────────────────────────────────────────
  { id: 'manufactured_consent__french_revolution',
    source: 'manufactured_consent', target: 'french_revolution', type: 'ENABLED',
    label: 'Revolutionary propaganda newspapers manufactured consent for the Terror\'s mass executions',
    note: 'The French Revolution developed sophisticated propaganda techniques: Marat\'s \"L\'Ami du peuple\" (Friend of the People), Hébert\'s \"Père Duchesne,\" and the Committee of Public Safety\'s festival culture manufactured popular consent for the Terror\'s executions through dehumanization of enemies (aristocrats as vermin, counterrevolutionaries as traitors). Bernays and Lippmann later cited the Revolutionary press as foundational examples of political propaganda. The Revolution invented the political newspaper as instrument of mass mobilization.',
    confidence: 'high' },
  { id: 'dehumanization__french_revolution',
    source: 'dehumanization', target: 'french_revolution', type: 'ENABLED',
    label: 'The Terror\'s mass executions required systematic dehumanization of aristocrats and counterrevolutionaries',
    note: 'The Reign of Terror (September 1793 – July 1794, 17,000+ official executions, 40,000+ deaths) required the same dehumanization mechanism as all mass political violence: the revolutionary enemy had to be rendered subhuman before killing them was acceptable. Robespierre\'s framing (counterrevolutionaries as enemies of humanity itself, not just the republic) applied the dehumanization template to class enemies rather than racial or religious ones. The French Revolution\'s innovation was dehumanization in universalist rather than particularist (racial, ethnic) terms.',
    confidence: 'high' },

  // ── scientific_revolution ─────────────────────────────────────────────────
  { id: 'socratic_method__scientific_revolution',
    source: 'socratic_method', target: 'scientific_revolution', type: 'ENABLED',
    label: 'The Socratic method\'s rigorous questioning of authority was the intellectual ancestor of scientific skepticism',
    note: 'The Scientific Revolution\'s core epistemic move — question received authority, test against evidence — was prefigured by the Socratic method\'s insistence on subjecting all claims to rigorous questioning regardless of their source. Galileo\'s challenge to Aristotelian authority was methodologically Socratic: what does the evidence actually show, rather than what does authority say? The humanist recovery of Greek philosophical method (including Socratic dialogue) in the Renaissance was part of the intellectual preparation for the Scientific Revolution.',
    confidence: 'medium' },

  // ── industrial_revolution ─────────────────────────────────────────────────
  { id: 'structural_violence__industrial_revolution',
    source: 'structural_violence', target: 'industrial_revolution', type: 'ENABLED',
    label: 'Industrial capitalism institutionalized structural violence through legal frameworks protecting wage exploitation',
    note: 'The Industrial Revolution created structural violence: child labor laws (or their absence), 14-hour factory days, no occupational safety requirements, and legal prohibition of workers\' organizations (Combination Acts, 1799-1800) were not individual acts of cruelty but legal-economic structures that systematically harmed workers. Johan Galtung\'s original concept of structural violence was developed partly to describe this: harm caused not by individual aggressors but by social structures that allow exploitation. Industrial capitalism is the template case for structural violence as a concept.',
    confidence: 'high' },
  { id: 'cultural_hegemony__industrial_revolution',
    source: 'cultural_hegemony', target: 'industrial_revolution', type: 'ENABLED',
    label: 'Industrial capitalism\'s cultural hegemony naturalized market relations and wage labor as universal human conditions',
    note: 'Gramsci\'s concept of cultural hegemony was developed specifically to explain why industrial workers did not spontaneously revolt: industrial capitalism had achieved hegemony by naturalizing market relations (treating them as universal human conditions rather than historical constructs), making wage labor seem the natural state of free persons, and incorporating working-class aspirations into the capitalist consumption framework. The Industrial Revolution created the hegemonic cultural framework that made capitalism seem inevitable rather than contingent.',
    confidence: 'high' },

  // ── american_revolution ───────────────────────────────────────────────────
  { id: 'social_contract_theory__american_revolution',
    source: 'social_contract_theory', target: 'american_revolution', type: 'PRODUCED',
    label: 'The American founding documents are applied social contract theory — Locke operationalized in constitutional law',
    note: 'The American Revolution\'s theoretical foundation is explicitly social contract theory: Jefferson\'s Declaration of Independence is a Lockean social contract argument (natural rights → government by consent → right of revolution when government violates rights). Madison\'s Federalist Papers drew on Montesquieu\'s separation of powers and Rousseau\'s general will. The US Constitution is the most successful operationalization of 17th-18th century social contract theory in practice — turning philosophical theory into constitutional law that governed a continent for 250 years.',
    confidence: 'high' },

  // ── napoleon_bonaparte ────────────────────────────────────────────────────
  { id: 'overton_window__napoleon_bonaparte',
    source: 'overton_window', target: 'napoleon_bonaparte', type: 'ENABLED',
    label: 'Napoleon moved the Overton window for European governance from divine right to popular sovereignty permanently',
    note: 'Napoleon\'s conquests moved the Overton window of European political possibility permanently: before Napoleon, the legitimate forms of governance were hereditary monarchy and aristocracy. After Napoleon\'s demonstration that a man of talent from nowhere could conquer Europe and codify Enlightenment law, the question of governance was permanently open. Even the conservative Congress of Vienna couldn\'t restore absolute monarchism as unquestioned norm. Napoleon is the Overton window shift that made democracy thinkable throughout 19th-century Europe.',
    confidence: 'high' },

  // ── world_wide_web ────────────────────────────────────────────────────────
  { id: 'info_ecosystem_collapse__world_wide_web',
    source: 'info_ecosystem_collapse', target: 'world_wide_web', type: 'ENABLED',
    label: 'The web\'s elimination of publishing gatekeepers is the structural cause of information ecosystem collapse',
    note: 'The information ecosystem collapse — the breakdown of shared factual reality, proliferation of misinformation, collapse of epistemic authority — is structurally caused by the web\'s gatekeeping elimination. When anyone can publish and algorithms decide distribution, the curated information ecosystems that journalism and publishing maintained (however imperfectly) are replaced by engagement-optimized feeds. The web didn\'t intend to collapse the information ecosystem; it was a structural consequence of eliminating editorial gatekeeping.',
    confidence: 'high' },
  { id: 'filter_bubble__world_wide_web',
    source: 'filter_bubble', target: 'world_wide_web', type: 'ENABLED',
    label: 'Web personalization infrastructure produces filter bubbles as a structural feature, not a bug',
    note: 'Filter bubbles (Eli Pariser, 2011) are produced by web personalization infrastructure: search engine personalization, social media algorithmic feeds, recommendation systems — all optimize for what each user will click, creating increasingly narrow information environments. The web\'s architecture didn\'t require personalization, but the attention economy\'s business model made it inevitable: showing users content they already like maximizes engagement and therefore advertising revenue. Filter bubbles are the attention economy\'s structural information consequence.',
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
