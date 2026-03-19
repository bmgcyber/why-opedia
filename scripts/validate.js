#!/usr/bin/env node
// Why-opedia — Data Validator
// Run: node scripts/validate.js
// Exits 0 on pass, 1 on any failure.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NODES_PATH = path.join(ROOT, 'data', 'nodes.json');
const EDGES_PATH = path.join(ROOT, 'data', 'edges.json');

const ALLOWED_EDGE_TYPES = new Set([
  'CAUSED', 'ENABLED', 'EXPLOITED', 'NORMALIZED', 'REACTIVATED',
  'PROVIDED_COVER_FOR', 'PRODUCED', 'DISCREDITED', 'SHARES_MECHANISM_WITH',
  'SELF_REINFORCES', 'COLONIZED', 'FRAGMENTED_INTO', 'FORCED_INTO'
]);

const ALLOWED_CATEGORIES = new Set([
  'event', 'movement', 'ideology', 'institution', 'mechanism',
  'person', 'policy', 'phenomenon', 'product', 'community'
]);

const ALLOWED_NODE_TYPES = new Set(['reference', 'mechanism']);
const ALLOWED_CONFIDENCE = new Set(['high', 'medium', 'speculative']);

let passed = 0;
let failed = 0;

function pass(msg) {
  console.log(`  ✓ ${msg}`);
  passed++;
}

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  failed++;
}

function check(label, fn) {
  console.log(`\n[${label}]`);
  fn();
}

// Load files
let nodes, edges;
try {
  nodes = JSON.parse(fs.readFileSync(NODES_PATH, 'utf8'));
  console.log(`Loaded nodes.json  — ${nodes.length} nodes`);
} catch (e) {
  console.error(`FATAL: Could not parse nodes.json: ${e.message}`);
  process.exit(1);
}

try {
  edges = JSON.parse(fs.readFileSync(EDGES_PATH, 'utf8'));
  console.log(`Loaded edges.json  — ${edges.length} edges`);
} catch (e) {
  console.error(`FATAL: Could not parse edges.json: ${e.message}`);
  process.exit(1);
}

const nodeIds = new Set();
const edgeIds = new Set();

// ── Check 1: Node IDs are unique ──────────────────────────────────────────────
check('Node ID uniqueness', () => {
  const seen = new Map();
  let dupes = [];
  for (const n of nodes) {
    if (seen.has(n.id)) dupes.push(n.id);
    seen.set(n.id, true);
    nodeIds.add(n.id);
  }
  if (dupes.length === 0) pass(`All ${nodes.length} node IDs are unique`);
  else fail(`Duplicate node IDs: ${dupes.join(', ')}`);
});

// ── Check 2: Edge IDs are unique ──────────────────────────────────────────────
check('Edge ID uniqueness', () => {
  const seen = new Map();
  let dupes = [];
  for (const e of edges) {
    if (seen.has(e.id)) dupes.push(e.id);
    seen.set(e.id, true);
    edgeIds.add(e.id);
  }
  if (dupes.length === 0) pass(`All ${edges.length} edge IDs are unique`);
  else fail(`Duplicate edge IDs: ${dupes.join(', ')}`);
});

// ── Check 3: Edge sources exist in nodes ─────────────────────────────────────
check('Edge source references', () => {
  const missing = edges.filter(e => !nodeIds.has(e.source)).map(e => `${e.id} → source "${e.source}"`);
  if (missing.length === 0) pass(`All edge sources reference valid node IDs`);
  else { missing.forEach(m => fail(m)); }
});

// ── Check 4: Edge targets exist in nodes ─────────────────────────────────────
check('Edge target references', () => {
  const missing = edges.filter(e => !nodeIds.has(e.target)).map(e => `${e.id} → target "${e.target}"`);
  if (missing.length === 0) pass(`All edge targets reference valid node IDs`);
  else { missing.forEach(m => fail(m)); }
});

// ── Check 5: Edge types are in allowed taxonomy ───────────────────────────────
check('Edge type taxonomy', () => {
  const bad = edges.filter(e => !ALLOWED_EDGE_TYPES.has(e.type)).map(e => `${e.id} → type "${e.type}"`);
  if (bad.length === 0) pass(`All edge types are valid`);
  else { bad.forEach(b => fail(b)); }
});

// ── Check 6: Node categories are in allowed taxonomy ─────────────────────────
check('Node category taxonomy', () => {
  const bad = nodes.filter(n => !ALLOWED_CATEGORIES.has(n.category)).map(n => `${n.id} → category "${n.category}"`);
  if (bad.length === 0) pass(`All node categories are valid`);
  else { bad.forEach(b => fail(b)); }
});

// ── Check 7: Node types are reference | mechanism ─────────────────────────────
check('Node type field', () => {
  const bad = nodes.filter(n => !ALLOWED_NODE_TYPES.has(n.node_type)).map(n => `${n.id} → node_type "${n.node_type}"`);
  if (bad.length === 0) pass(`All nodes have valid node_type`);
  else { bad.forEach(b => fail(b)); }
});

// ── Check 8: reference nodes have valid wikipedia URL ────────────────────────
check('Reference node wikipedia field', () => {
  const refNodes = nodes.filter(n => n.node_type === 'reference');
  const missing = refNodes.filter(n => !n.wikipedia || !n.wikipedia.startsWith('https://en.wikipedia.org/wiki/'));
  if (missing.length === 0) pass(`All ${refNodes.length} reference nodes have valid wikipedia URLs`);
  else { missing.forEach(n => fail(`${n.id} → wikipedia "${n.wikipedia || '(missing)'}"`)); }
});

// ── Check 9: mechanism nodes have no wikipedia field ─────────────────────────
check('Mechanism node wikipedia exclusion', () => {
  const mechNodes = nodes.filter(n => n.node_type === 'mechanism');
  const bad = mechNodes.filter(n => n.wikipedia);
  if (bad.length === 0) pass(`No mechanism nodes have a wikipedia field`);
  else { bad.forEach(n => fail(`${n.id} → has unexpected wikipedia field`)); }
});

// ── Check 10: confidence field is valid ───────────────────────────────────────
check('Edge confidence field', () => {
  const bad = edges.filter(e => !ALLOWED_CONFIDENCE.has(e.confidence)).map(e => `${e.id} → confidence "${e.confidence}"`);
  if (bad.length === 0) pass(`All edge confidence values are valid`);
  else { bad.forEach(b => fail(b)); }
});

// ── Check 11: required fields present ────────────────────────────────────────
check('Required node fields', () => {
  const required = ['id', 'label', 'node_type', 'category', 'summary', 'decade', 'tags'];
  let anyFail = false;
  for (const n of nodes) {
    const missing = required.filter(f => n[f] === undefined || n[f] === null || n[f] === '');
    if (missing.length > 0) { fail(`${n.id} → missing fields: ${missing.join(', ')}`); anyFail = true; }
  }
  if (!anyFail) pass(`All nodes have required fields`);
});

check('Required edge fields', () => {
  const required = ['id', 'source', 'target', 'type', 'label', 'confidence'];
  let anyFail = false;
  for (const e of edges) {
    const missing = required.filter(f => e[f] === undefined || e[f] === null || e[f] === '');
    if (missing.length > 0) { fail(`${e.id} → missing fields: ${missing.join(', ')}`); anyFail = true; }
  }
  if (!anyFail) pass(`All edges have required fields`);
});

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(50));
console.log(`Result: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('VALIDATION FAILED');
  process.exit(1);
} else {
  console.log('VALIDATION PASSED');
  process.exit(0);
}
