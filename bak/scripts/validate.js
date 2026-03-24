#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ALLOWED_EDGE_TYPES = new Set([
  'CAUSED', 'ENABLED', 'EXPLOITED', 'NORMALIZED', 'REACTIVATED',
  'PROVIDED_COVER_FOR', 'PRODUCED', 'DISCREDITED', 'SHARES_MECHANISM_WITH',
  'SELF_REINFORCES', 'COLONIZED', 'FRAGMENTED_INTO', 'FORCED_INTO'
]);

const ALLOWED_CATEGORIES = new Set([
  'event', 'movement', 'ideology', 'institution', 'mechanism',
  'person', 'policy', 'phenomenon', 'product', 'community'
]);

const root = path.join(__dirname, '..');
let nodes, edges;

let passed = 0;
let failed = 0;

function pass(msg) {
  console.log(`  PASS  ${msg}`);
  passed++;
}

function fail(msg) {
  console.error(`  FAIL  ${msg}`);
  failed++;
}

function check(label, fn) {
  try {
    fn();
  } catch (e) {
    fail(`${label} — ${e.message}`);
  }
}

// Load files
try {
  nodes = JSON.parse(fs.readFileSync(path.join(root, 'data/nodes.json'), 'utf8'));
  pass(`data/nodes.json loads and parses (${nodes.length} nodes)`);
} catch (e) {
  fail(`data/nodes.json failed to load: ${e.message}`);
  process.exit(1);
}

try {
  edges = JSON.parse(fs.readFileSync(path.join(root, 'data/edges.json'), 'utf8'));
  pass(`data/edges.json loads and parses (${edges.length} edges)`);
} catch (e) {
  fail(`data/edges.json failed to load: ${e.message}`);
  process.exit(1);
}

// Node checks
check('Node IDs are unique', () => {
  const ids = nodes.map(n => n.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length > 0) throw new Error(`Duplicate node IDs: ${dupes.join(', ')}`);
  pass(`Node IDs are unique (${ids.length} nodes)`);
});

check('All nodes have valid node_type', () => {
  const bad = nodes.filter(n => n.node_type !== 'reference' && n.node_type !== 'mechanism');
  if (bad.length > 0) throw new Error(`Invalid node_type on: ${bad.map(n => n.id).join(', ')}`);
  pass(`All nodes have valid node_type (reference or mechanism)`);
});

check('All nodes have valid category', () => {
  const bad = nodes.filter(n => !ALLOWED_CATEGORIES.has(n.category));
  if (bad.length > 0) throw new Error(`Invalid category on: ${bad.map(n => `${n.id}(${n.category})`).join(', ')}`);
  pass(`All nodes have valid category`);
});

check('reference nodes have wikipedia URL in correct format', () => {
  const bad = nodes.filter(n =>
    n.node_type === 'reference' &&
    (!n.wikipedia || !n.wikipedia.startsWith('https://en.wikipedia.org/wiki/'))
  );
  if (bad.length > 0) throw new Error(`Bad or missing wikipedia on reference nodes: ${bad.map(n => n.id).join(', ')}`);
  pass(`All reference nodes have valid wikipedia URL format`);
});

check('mechanism nodes have no wikipedia field', () => {
  const bad = nodes.filter(n => n.node_type === 'mechanism' && n.wikipedia !== undefined);
  if (bad.length > 0) throw new Error(`mechanism nodes must not have wikipedia: ${bad.map(n => n.id).join(', ')}`);
  pass(`No mechanism nodes have a wikipedia field`);
});

// Edge checks
const nodeIds = new Set(nodes.map(n => n.id));

check('Edge IDs are unique', () => {
  const ids = edges.map(e => e.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length > 0) throw new Error(`Duplicate edge IDs: ${dupes.join(', ')}`);
  pass(`Edge IDs are unique (${ids.length} edges)`);
});

check('All edge sources exist in nodes', () => {
  const bad = edges.filter(e => !nodeIds.has(e.source));
  if (bad.length > 0) throw new Error(`Unknown source node IDs: ${bad.map(e => `${e.id}(${e.source})`).join(', ')}`);
  pass(`All edge sources exist in nodes`);
});

check('All edge targets exist in nodes', () => {
  const bad = edges.filter(e => !nodeIds.has(e.target));
  if (bad.length > 0) throw new Error(`Unknown target node IDs: ${bad.map(e => `${e.id}(${e.target})`).join(', ')}`);
  pass(`All edge targets exist in nodes`);
});

check('All edge types are in allowed taxonomy', () => {
  const bad = edges.filter(e => !ALLOWED_EDGE_TYPES.has(e.type));
  if (bad.length > 0) throw new Error(`Invalid edge types: ${bad.map(e => `${e.id}(${e.type})`).join(', ')}`);
  pass(`All edge types are in allowed taxonomy`);
});

check('All edges have valid confidence', () => {
  const bad = edges.filter(e => !['high', 'medium', 'speculative'].includes(e.confidence));
  if (bad.length > 0) throw new Error(`Invalid confidence values: ${bad.map(e => `${e.id}(${e.confidence})`).join(', ')}`);
  pass(`All edges have valid confidence (high/medium/speculative)`);
});

// Summary
console.log('');
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
