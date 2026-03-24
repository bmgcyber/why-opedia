#!/usr/bin/env node
'use strict';

/**
 * migrate_scopes.js
 * Classifies all 331 nodes into thematic scopes and writes the new data/ structure.
 *
 * Output directory structure:
 *   data/scopes.json
 *   data/mechanisms/nodes.json + edges.json
 *   data/global/nodes.json + edges.json
 *   data/global/{media,politics,psychology,health,history}/nodes.json + edges.json
 */

const fs   = require('fs');
const path = require('path');

const ROOT     = path.resolve(__dirname, '..');
const DATA_IN  = path.join(ROOT, 'data');
const DATA_OUT = path.join(ROOT, 'data');   // write in-place alongside originals

// ── Load source data ──────────────────────────────────────────────────────────
const allNodes = JSON.parse(fs.readFileSync(path.join(DATA_IN, 'nodes.json'), 'utf8'));
const allEdges = JSON.parse(fs.readFileSync(path.join(DATA_IN, 'edges.json'), 'utf8'));

// ── Classification rules ──────────────────────────────────────────────────────
const CROSS_SCOPE_CATS = new Set(['mechanism', 'ideology', 'phenomenon']);

const SCOPE_TAG_WEIGHTS = {
  'global/media': {
    tags: ['media', 'propaganda', 'disinformation', 'journalism', 'social-media',
           'social_media', 'facebook', 'algorithm', 'algorithms', 'information',
           'press', 'broadcast', 'televangelism'],
    summary: ['media', 'propaganda', 'disinformation', 'journalism', 'broadcast',
              'news outlet', 'social media', 'information warfare'],
    weight: 3,
  },
  'global/politics': {
    tags: ['politics', 'government', 'democracy', 'authoritarianism', 'fascism',
           'communism', 'socialism', 'coup', 'election', 'policy', 'civil_rights',
           'civil-rights', 'geopolitics', 'foreign-policy', 'nationalism',
           'imperialism', 'anti-colonialism', 'anti-communism', 'revolution',
           'maga', 'trump', 'obama', 'reagan', 'accountability', 'scandal',
           'partisan', 'war_on_terror', 'january-6', 'dark-money', 'campaign-finance',
           'populism', 'anti-government', 'republican', 'voting', 'supreme-court',
           'presidency', 'realpolitik', 'diplomacy', 'containment', 'cold-war',
           'cold_war', 'military', 'coups', 'covert-ops', 'iran-contra',
           'statecraft', 'political-theory', 'decolonization', 'independence',
           'occupation', 'sovereignty', 'vanguard', 'pan-arabism', 'pan-africanism'],
    summary: ['political', 'government', 'election', 'democracy', 'congress',
              'senate', 'white house', 'military', 'coup', 'dictatorship',
              'authoritarian', 'coalition', 'legislative', 'foreign policy'],
    weight: 3,
  },
  'global/psychology': {
    tags: ['identity', 'psychology', 'trauma', 'addiction', 'psychiatry',
           'psychoanalysis', 'cult', 'abuse', 'social', 'cognition',
           'manipulation', 'unconscious', 'obedience', 'fandom'],
    summary: ['psychological', 'trauma', 'identity', 'mental health', 'addiction',
              'cognitive bias', 'cult', 'behavioral', 'psychoanalysis'],
    weight: 3,
  },
  'global/health': {
    tags: ['health', 'medical', 'pandemic', 'opioids', 'tobacco', 'eugenics',
           'biology', 'addiction', 'pseudoscience', 'documented_atrocity'],
    summary: ['medical', 'health', 'disease', 'pandemic', 'clinical',
              'tobacco', 'drug', 'opioid', 'vaccine', 'epidemic',
              'pharmaceutical', 'syphilis'],
    weight: 3,
  },
  'global/history': {
    tags: ['history', 'ancient', 'medieval', 'wwi', 'wwii', 'genocide',
           'holocaust', 'slavery', 'civilization', 'empire', 'war', 'conquest',
           'babylon', 'egypt', 'greece', 'rome', 'ottoman', 'byzantine',
           'persia', 'mesopotamia', 'documented_atrocity', 'turning_point',
           'assassination', 'mass-death', 'atrocity', 'nuclear', 'vietnam',
           'watergate', 'cold_war', 'cold-war',
           'expulsion', 'pogrom', 'crusades', 'inquisition', 'reformation',
           'renaissance', 'enlightenment', 'archaeology'],
    summary: ['historical', 'medieval', 'century', 'empire',
              'civilization', 'atrocity', 'massacre'],
    weight: 2,   // slightly lower: 'history' tag is a catch-all
  },
};

// Category-based priors  (additive to tag scores)
const CATEGORY_PRIOR = {
  person:      { 'global/history': 6 },    // persons default to history
  event:       { 'global/history': 3 },    // events default to history
  institution: { 'global/politics': 4 },   // institutions default to politics
  policy:      { 'global/politics': 5 },   // policies default to politics
  community:   { 'global/psychology': 5 }, // communities default to psychology
  product:     { 'global/media': 5 },      // products default to media
  movement:    { 'global/history': 1 },    // slight lean for ambiguous movements
};

// Known health-policy overrides (policy nodes with medical topics)
const HEALTH_POLICY_IDS = new Set([
  'tobacco_master_settlement', 'opioid_settlement', 'healthy_at_every_size',
]);

function classifyNode(node) {
  const cat = node.category;

  // Hard rule: cross-scope categories
  if (CROSS_SCOPE_CATS.has(cat)) return 'global/mechanisms';

  const tags    = new Set((node.tags || []).map(t => t.toLowerCase()));
  const summary = (node.summary || '').toLowerCase();

  const scores = {
    'global/media': 0,
    'global/politics': 0,
    'global/psychology': 0,
    'global/health': 0,
    'global/history': 0,
  };

  // Category priors
  const prior = CATEGORY_PRIOR[cat] || {};
  for (const [scope, pts] of Object.entries(prior)) {
    scores[scope] += pts;
  }

  // Tag scoring
  for (const [scope, cfg] of Object.entries(SCOPE_TAG_WEIGHTS)) {
    for (const tag of cfg.tags) {
      if (tags.has(tag)) scores[scope] += cfg.weight;
    }
    for (const kw of cfg.summary) {
      if (summary.includes(kw)) scores[scope] += 1;
    }
  }

  // Special cases: health-tagged policies override default politics
  if (HEALTH_POLICY_IDS.has(node.id)) scores['global/health'] += 10;

  // Find best scope
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (ranked[0][1] === 0) return 'global';  // no signal → unclassified

  // Tie-break: if top two are within 1 point, use category prior as tie-breaker
  // For now, just take the top scorer
  return ranked[0][0];
}

// ── Classify all nodes ────────────────────────────────────────────────────────
const nodeScope = {};    // nodeId → scopePath
const scopeBuckets = {}; // scopePath → Node[]

for (const node of allNodes) {
  const scope = classifyNode(node);
  nodeScope[node.id] = scope;
  if (!scopeBuckets[scope]) scopeBuckets[scope] = [];
  // Add scope fields to node data
  const enriched = {
    ...node,
    scope,
    cross_scope: CROSS_SCOPE_CATS.has(node.category),
  };
  scopeBuckets[scope].push(enriched);
}

// ── Classify edges ────────────────────────────────────────────────────────────
// Each edge is assigned to every scope that has at least one endpoint in it.
// Edges involving mechanism nodes also always go into mechanisms/edges.json.

const edgeBuckets = {}; // scopePath → Edge[] (deduped by id)
const edgeSeen = {};    // scopePath → Set<edgeId>

function addEdge(scope, edge) {
  if (!edgeBuckets[scope]) { edgeBuckets[scope] = []; edgeSeen[scope] = new Set(); }
  if (!edgeSeen[scope].has(edge.id)) {
    edgeBuckets[scope].push(edge);
    edgeSeen[scope].add(edge.id);
  }
}

for (const edge of allEdges) {
  const srcScope = nodeScope[edge.source];
  const tgtScope = nodeScope[edge.target];

  if (!srcScope || !tgtScope) {
    console.warn(`⚠ Edge ${edge.id}: missing node scope (src=${edge.source} → ${srcScope}, tgt=${edge.target} → ${tgtScope})`);
    continue;
  }

  // If either endpoint is a mechanism, add to mechanisms/edges
  if (srcScope === 'global/mechanisms' || tgtScope === 'global/mechanisms') {
    addEdge('global/mechanisms', edge);
  }

  // Add edge to source scope (even if it's mechanisms scope)
  addEdge(srcScope, edge);

  // Add edge to target scope (if different from source scope)
  if (tgtScope !== srcScope) {
    addEdge(tgtScope, edge);
  }
}

// ── Generate portal nodes ─────────────────────────────────────────────────────
const SCOPE_META = {
  'global/media':      { label: 'Media & Information',   id: 'portal-media' },
  'global/politics':   { label: 'Politics & Power',      id: 'portal-politics' },
  'global/psychology': { label: 'Psychology & Identity', id: 'portal-psychology' },
  'global/health':     { label: 'Health & Medicine',     id: 'portal-health' },
  'global/history':    { label: 'History & Events',      id: 'portal-history' },
};

const portalNodes = [];
for (const [scopePath, meta] of Object.entries(SCOPE_META)) {
  const count = (scopeBuckets[scopePath] || []).length;
  if (count === 0) continue;
  portalNodes.push({
    id: meta.id,
    label: meta.label,
    category: 'portal',
    node_type: 'portal',
    scope: 'global',
    target_scope: scopePath,
    summary: `${count} nodes on ${meta.label.toLowerCase()}.`,
    cross_scope: false,
  });
}

// ── Write scopes.json ─────────────────────────────────────────────────────────
const scopesJson = {
  global: {
    label: 'World',
    children: {
      media:      { label: 'Media & Information',   children: {} },
      politics:   { label: 'Politics & Power',      children: {} },
      psychology: { label: 'Psychology & Identity', children: {} },
      health:     { label: 'Health & Medicine',     children: {} },
      history:    { label: 'History & Events',      children: {} },
    },
  },
};

// ── Ensure directories exist ──────────────────────────────────────────────────
const DIRS = [
  'mechanisms',
  'global',
  'global/media',
  'global/politics',
  'global/psychology',
  'global/health',
  'global/history',
];

for (const dir of DIRS) {
  fs.mkdirSync(path.join(DATA_OUT, dir), { recursive: true });
}

// ── Write output files ────────────────────────────────────────────────────────
function write(relPath, data) {
  const full = path.join(DATA_OUT, relPath);
  fs.writeFileSync(full, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

write('scopes.json', scopesJson);

// mechanisms
write('mechanisms/nodes.json', scopeBuckets['global/mechanisms'] || []);
write('mechanisms/edges.json', edgeBuckets['global/mechanisms'] || []);

// global (unclassified)
write('global/nodes.json', [...(scopeBuckets['global'] || []), ...portalNodes]);
write('global/edges.json', edgeBuckets['global'] || []);

// child scopes
for (const sub of ['media', 'politics', 'psychology', 'health', 'history']) {
  const scopePath = `global/${sub}`;
  write(`${scopePath}/nodes.json`, scopeBuckets[scopePath] || []);
  write(`${scopePath}/edges.json`, edgeBuckets[scopePath] || []);
}

// ── Validation ────────────────────────────────────────────────────────────────
const allClassified = new Set(Object.keys(nodeScope));
const originalIds   = new Set(allNodes.map(n => n.id));

// Check no node IDs lost
const lost = [...originalIds].filter(id => !allClassified.has(id));
if (lost.length) console.warn('⚠ Lost node IDs:', lost);

// Check all edge endpoints resolve
let orphanEdges = 0;
for (const edge of allEdges) {
  if (!originalIds.has(edge.source) || !originalIds.has(edge.target)) {
    console.warn(`⚠ Orphan edge ${edge.id}: ${edge.source} → ${edge.target}`);
    orphanEdges++;
  }
}

// ── Classification report ─────────────────────────────────────────────────────
const scopeCounts = {};
for (const [id, scope] of Object.entries(nodeScope)) {
  scopeCounts[scope] = (scopeCounts[scope] || 0) + 1;
}

console.log('\n=== Classification Report ===');
for (const [scope, count] of Object.entries(scopeCounts).sort()) {
  console.log(`  ${scope}: ${count} nodes`);
}

console.log('\n=== Portal Nodes Generated ===');
for (const p of portalNodes) {
  console.log(`  ${p.id}: "${p.label}" (${(scopeBuckets[p.target_scope]||[]).length} nodes)`);
}

// Per-scope sample
console.log('\n=== Scope Samples (first 5 per scope) ===');
for (const [scope, nodes] of Object.entries(scopeBuckets).sort()) {
  console.log(`\n${scope}:`);
  nodes.slice(0, 5).forEach(n => console.log(`  [${n.category}] ${n.label}`));
  if (nodes.length > 5) console.log(`  ... and ${nodes.length - 5} more`);
}

const totalClassified = allNodes.length;
const totalEdgesPreserved = allEdges.length;
const orphanedEdges = orphanEdges;

console.log(`\n✓ ${totalClassified} nodes classified, ${totalEdgesPreserved} edges preserved, ${portalNodes.length} portal nodes generated, ${orphanedEdges} orphaned edges.`);
