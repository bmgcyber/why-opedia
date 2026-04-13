'use strict';

// ── scope-manager.js
// Manages scope loading, caching, ghost node injection, and portal generation.
// Exposes: window.ScopeManager

(function () {
  // ── State ──────────────────────────────────────────────────────────────────
  let scopeTree  = null;      // parsed scopes.json
  let currentScopePath = 'global';

  // Caches: path → { nodes, edges }
  const nodeCache = {};
  const edgeCache = {};

  // Cross-scope mechanism data (loaded at startup)
  let mechNodes = [];
  let mechEdges = [];

  // Callback when scope changes
  let onScopeChangeCb = null;

  // ── Init ───────────────────────────────────────────────────────────────────
  async function init() {
    const [scopesRes, mechNodesRes, mechEdgesRes] = await Promise.all([
      fetch('data/scopes.json').then(r => r.json()),
      fetch('data/mechanisms/nodes.json').then(r => r.json()),
      fetch('data/mechanisms/edges.json').then(r => r.json()),
    ]);

    scopeTree = scopesRes;
    mechNodes = mechNodesRes;
    mechEdges = mechEdgesRes;

    // Cache mechanism data
    nodeCache['global/mechanisms'] = mechNodes;
    edgeCache['global/mechanisms'] = mechEdges;

    return scopeTree;
  }

  // ── Load scope data ────────────────────────────────────────────────────────
  async function loadScope(scopePath) {
    if (nodeCache[scopePath]) {
      return { nodes: nodeCache[scopePath], edges: edgeCache[scopePath] || [] };
    }
    const [nodesRes, edgesRes] = await Promise.all([
      fetch(`data/${scopePath}/nodes.json`).then(r => r.json()),
      fetch(`data/${scopePath}/edges.json`).then(r => r.json()),
    ]);
    nodeCache[scopePath] = nodesRes;
    edgeCache[scopePath] = edgesRes;
    return { nodes: nodesRes, edges: edgesRes };
  }

  // ── Enter scope ────────────────────────────────────────────────────────────
  async function enterScope(scopePath) {
    // 'global' is the full merged world view — delegate to enterGlobalView
    if (scopePath === 'global') return enterGlobalView();

    const { nodes: scopeNodes, edges: scopeEdges } = await loadScope(scopePath);

    // Build set of node IDs in this scope
    const scopeNodeIds = new Set(scopeNodes.map(n => n.id));

    // Ghost node injection: find mechanism nodes connected to this scope's nodes
    const ghostNodes = [];
    const ghostNodeIds = new Set();
    for (const edge of mechEdges) {
      const srcIsMech = scopeNodeIds.has(edge.source) ? false : mechNodes.some(m => m.id === edge.source);
      const tgtIsMech = scopeNodeIds.has(edge.target) ? false : mechNodes.some(m => m.id === edge.target);
      const srcInScope = scopeNodeIds.has(edge.source);
      const tgtInScope = scopeNodeIds.has(edge.target);

      if (srcIsMech && tgtInScope && !ghostNodeIds.has(edge.source)) {
        const mechNode = mechNodes.find(m => m.id === edge.source);
        if (mechNode) {
          ghostNodes.push({ ...mechNode, ghost: true });
          ghostNodeIds.add(edge.source);
        }
      }
      if (tgtIsMech && srcInScope && !ghostNodeIds.has(edge.target)) {
        const mechNode = mechNodes.find(m => m.id === edge.target);
        if (mechNode) {
          ghostNodes.push({ ...mechNode, ghost: true });
          ghostNodeIds.add(edge.target);
        }
      }
    }

    // Generate portal nodes for child scopes
    const childPortals = await generatePortalsForScope(scopePath);

    // Build combined graph data
    const allNodes = [...scopeNodes, ...ghostNodes, ...childPortals];
    // Only include scope edges where both endpoints are visible in this scope view
    const visibleNodeIds = new Set([...scopeNodes, ...ghostNodes].map(n => n.id));
    const allEdges = scopeEdges.filter(e =>
      visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    );

    // Add mechanism edges that connect to scope nodes
    for (const edge of mechEdges) {
      const srcInScope = scopeNodeIds.has(edge.source) || ghostNodeIds.has(edge.source);
      const tgtInScope = scopeNodeIds.has(edge.target) || ghostNodeIds.has(edge.target);
      if (srcInScope && tgtInScope) {
        allEdges.push(edge);
      }
    }

    currentScopePath = scopePath;
    updateBreadcrumb(scopePath);

    if (onScopeChangeCb) {
      onScopeChangeCb({ nodes: allNodes, edges: allEdges, scopePath });
    }

    return { nodes: allNodes, edges: allEdges };
  }

  // ── Global ("World") view ──────────────────────────────────────────────────
  // Loads ALL nodes across all scopes for the top-level world view.
  async function enterGlobalView() {
    // Load all scopes in parallel
    const subScopes = ['media', 'politics', 'psychology', 'health', 'history', 'economics', 'art', 'technology', 'religion'];
    const results = await Promise.all([
      loadScope('global'),
      Promise.resolve({ nodes: mechNodes, edges: mechEdges }),  // already loaded
      ...subScopes.map(s => loadScope(`global/${s}`)),
    ]);

    const allNodes = [];

    for (const { nodes } of results) {
      for (const n of nodes) {
        // Skip portal nodes from global/ — we'll add fresh ones
        if (n.category !== 'portal') allNodes.push(n);
      }
    }

    // Global view shows only cross-scope (mechanism) edges — intra-scope edges are
    // only meaningful inside their scope and contribute to the "hairball" at global scale.
    // This cuts ~1,600 edges from the force simulation without losing causal information.
    const allEdges = [...mechEdges];

    // Add portal nodes for each sub-scope with node counts
    const portals = await generatePortalsForScope('global');
    allNodes.push(...portals);

    currentScopePath = 'global';
    updateBreadcrumb('global');

    if (onScopeChangeCb) {
      onScopeChangeCb({ nodes: allNodes, edges: allEdges, scopePath: 'global' });
    }

    return { nodes: allNodes, edges: allEdges };
  }

  // ── Generate portal nodes for child scopes ─────────────────────────────────
  async function generatePortalsForScope(scopePath) {
    const scope = getScopeNode(scopePath);
    if (!scope || !scope.children || Object.keys(scope.children).length === 0) return [];

    const portals = [];
    for (const [key, child] of Object.entries(scope.children)) {
      const childPath = `${scopePath}/${key}`;
      try {
        const { nodes } = await loadScope(childPath);
        if (nodes.length === 0) continue;
        portals.push({
          id:           `portal-${key}`,
          label:        child.label,
          category:     'portal',
          node_type:    'portal',
          scope:        scopePath,
          target_scope: childPath,
          summary:      `${nodes.length} nodes on ${child.label.toLowerCase()}.`,
          cross_scope:  false,
        });
      } catch (e) {
        console.warn(`Could not load scope ${childPath}:`, e);
      }
    }
    return portals;
  }

  // ── Mechanism explorer: cross-scope view ───────────────────────────────────
  async function getMechanismCrossScope(mechanismId) {
    const mechNode = mechNodes.find(n => n.id === mechanismId);
    if (!mechNode) return null;

    // Load all scopes and find connected nodes
    const subScopes = ['global/media', 'global/politics', 'global/psychology', 'global/health', 'global/history', 'global/economics', 'global/art', 'global/technology', 'global/religion'];
    const results = await Promise.all(subScopes.map(s => loadScope(s)));

    const connectedNodes = [];
    const connectedEdges = [];

    // Check mechanism edges
    for (const edge of mechEdges) {
      const isSource = edge.source === mechanismId;
      const isTarget = edge.target === mechanismId;
      if (!isSource && !isTarget) continue;

      const otherId = isSource ? edge.target : edge.source;
      // Find the node in any scope
      for (const { nodes } of results) {
        const found = nodes.find(n => n.id === otherId);
        if (found) {
          connectedNodes.push(found);
          connectedEdges.push(edge);
          break;
        }
      }
    }

    return { mechNode, connectedNodes, connectedEdges };
  }

  // ── Scope tree navigation ──────────────────────────────────────────────────
  function getScopeNode(path) {
    if (!scopeTree) return null;
    const parts = path.split('/').filter(Boolean);
    let node = scopeTree;
    for (const part of parts) {
      if (node[part]) node = node[part];
      else if (node.children && node.children[part]) node = node.children[part];
      else return null;
    }
    return node;
  }

  function getScopeLabel(path) {
    if (path === 'global') return 'World';
    const node = getScopeNode(path);
    return node ? node.label : path;
  }

  function getCurrentScopePath() { return currentScopePath; }
  function getMechNodes()        { return mechNodes; }
  function getMechEdges()        { return mechEdges; }

  // ── Breadcrumb ─────────────────────────────────────────────────────────────
  function updateBreadcrumb(scopePath) {
    const el = document.getElementById('breadcrumb');
    if (!el) return;

    const parts = scopePath.split('/').filter(Boolean);
    const crumbs = [];

    let builtPath = '';
    for (let i = 0; i < parts.length; i++) {
      builtPath = builtPath ? `${builtPath}/${parts[i]}` : parts[i];
      const label = getScopeLabel(builtPath);
      const isLast = i === parts.length - 1;
      const path = builtPath;
      crumbs.push({ label, path, isLast });
    }

    if (crumbs.length <= 1) {
      el.hidden = true;
      return;
    }

    el.hidden = false;
    el.innerHTML = crumbs.map((c, i) => {
      if (c.isLast) return `<span class="bc-current">${escHtml(c.label)}</span>`;
      return `<span class="bc-link" data-scope="${escHtml(c.path)}">${escHtml(c.label)}</span>`;
    }).join(' <span class="bc-sep">›</span> ');

    el.querySelectorAll('.bc-link').forEach(link => {
      link.addEventListener('click', () => enterScope(link.dataset.scope));
    });
  }

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Callbacks ──────────────────────────────────────────────────────────────
  function onScopeChange(fn) { onScopeChangeCb = fn; }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.ScopeManager = {
    init,
    enterScope,
    enterGlobalView,
    generatePortalsForScope,
    getMechanismCrossScope,
    getScopeLabel,
    getCurrentScopePath,
    getMechNodes,
    getMechEdges,
    onScopeChange,
    loadScope,
  };
})();
