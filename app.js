'use strict';

// ── app.js — Why-opedia 3D
// Thin entry point: wires up GraphRenderer, ScopeManager, FilterManager, Search,
// and hosts the info panel, path finder, quiz, analytics, and URL state.

// ── Aliases ───────────────────────────────────────────────────────────────────
const GR  = GraphRenderer;
const SM  = ScopeManager;
const FM  = FilterManager;

// ── App state ─────────────────────────────────────────────────────────────────
let nodeMap        = {};      // id → node data (full object)
let allNodes       = [];
let allEdges       = [];
let selectedNodeId = null;
let neighborhoodDepth = 1;

// Path finder
let pathHighlightedIds = new Set();

// Quiz
let quizScore = 0, quizTotal = 0;

// Mobile detection (used to skip WASD setup on touch devices)
const isMobile = navigator.maxTouchPoints > 0 || /Mobi/i.test(navigator.userAgent);

// Scope navigation history
const scopeHistory = [];

// ── Boot ──────────────────────────────────────────────────────────────────────
document.getElementById('stats').textContent = 'Loading…';

async function boot() {
  try {
    // Initialize scope manager (loads scopes.json + mechanism data)
    await SM.init();

    // Init 3D renderer
    const container = document.getElementById('graph-container');
    GR.initRenderer(container);

    // Wire up renderer events
    GR.onNodeClick(handleNodeClick);
    GR.onNodeDblClick(handleNodeDblClick);
    GR.onNodeHover(handleNodeHover);
    GR.onLinkClick(handleLinkClick);
    GR.onBgClick(handleBgClick);

    // Wire scope changes to graph data updates.
    // enterScope/enterGlobalView fires this callback before returning, so
    // we must NOT call loadScopeIntoGraph a second time at the call site.
    SM.onScopeChange(async ({ nodes, edges, scopePath }) => {
      scopeHistory.push(scopePath || 'global');
      updateBackBtn();
      await loadScopeIntoGraph(nodes, edges);
    });

    // Load initial global view (all nodes).
    // The onScopeChange callback above handles the loadScopeIntoGraph call.
    await SM.enterGlobalView();

    // Init sidebar (search, filters, path finder, actions)
    Search.initSidebarSearch();
    initSidebar();
    initToolbar();
    initModals();
    initWASD();

    // URL state
    loadURLState();

  } catch (err) {
    console.error('Boot failed:', err);
    document.getElementById('stats').textContent = 'Error loading — serve from a local server, not file://';
  }
}

// ── Scope → graph pipeline ────────────────────────────────────────────────────
async function loadScopeIntoGraph(nodes, edges) {
  // Clear stale node selection from previous scope before loading new data.
  // Without this, FM.applyFilters sees an old selectedNodeId that doesn't exist
  // in the new scope's edge map, causing the entire graph to dim.
  selectedNodeId = null;
  GR.clearSelection();
  FM.clearNeighborhoodRoot();
  closePanel();
  showTooltip(null);
  const nbSection = document.getElementById('sb-neighborhood');
  if (nbSection) nbSection.hidden = true;

  allNodes = nodes;
  allEdges = edges;
  nodeMap  = {};
  for (const n of nodes) nodeMap[n.id] = n;

  // Load data into renderer
  GR.loadGraphData(nodes, edges);

  // Build search index
  Search.buildIndex(nodes);

  // Rebuild filters (edge map + sidebar UI).
  // buildFilters also calls applyFilters() at the end to apply correct
  // link/node visibility with the new scope's data.
  FM.buildFilters(nodes, edges);

  // Update stats, scope section, and URL hash
  updateStats(nodes.length, edges.length);
  updateScopeSection(nodes);
  updateURLState();
}

// ── Scope section sidebar ─────────────────────────────────────────────────────
function updateScopeSection(nodes) {
  const portals = nodes.filter(n => n.category === 'portal');
  const section = document.getElementById('sb-scope-section');
  const list    = document.getElementById('sb-scope-list');
  if (!section || !list) return;

  if (!portals.length) { section.hidden = true; return; }

  list.innerHTML = portals.map(p => `
    <div class="sb-scope-item" data-scope="${escHtml(p.target_scope)}">
      <span class="sb-scope-label">${escHtml(p.label)}</span>
      <span class="sb-check-count">${escHtml(p.summary || '')}</span>
    </div>
  `).join('');

  list.querySelectorAll('.sb-scope-item').forEach(item => {
    item.addEventListener('click', () => SM.enterScope(item.dataset.scope));
  });

  section.hidden = false;
}

// ── Node click handling ────────────────────────────────────────────────────────
function handleNodeClick(node) {
  if (!node) return;

  // Portal → navigate into scope (onScopeChange callback handles the graph update)
  if (node.category === 'portal') {
    SM.enterScope(node.target_scope);
    return;
  }

  selectedNodeId = node.id;
  GR.selectNode(node.id);
  showNodePanel(node);
  activateNeighborhood(node.id);
  updateURLState();
}

function handleNodeDblClick(node) {
  if (!node) return;
  if (node.category === 'portal') {
    SM.enterScope(node.target_scope);
    return;
  }
  // Cross-scope mechanism → mechanism explorer
  if (['mechanism', 'ideology', 'phenomenon'].includes(node.category)) {
    openMechanismExplorer(node);
  }
}

function handleNodeHover(node) {
  showTooltip(node);
}

function handleLinkClick(link) {
  if (!link) return;
  showEdgePanel(link);
}

function handleBgClick() {
  clearSelection();
  closePanel();
  updateURLState();
}

// ── Selection management ──────────────────────────────────────────────────────
function clearSelection() {
  selectedNodeId = null;
  GR.clearSelection();
  FM.clearNeighborhoodRoot();
  const nbSection = document.getElementById('sb-neighborhood');
  if (nbSection) nbSection.hidden = true;
}

function goBack() {
  if (scopeHistory.length < 2) return;
  scopeHistory.pop();                          // discard current scope
  const prev = scopeHistory.pop();             // pop previous (onScopeChange re-pushes it)
  if (!prev || prev === 'global') SM.enterGlobalView();
  else SM.enterScope(prev);
}

function updateBackBtn() {
  const btn = document.getElementById('back-btn');
  if (btn) btn.hidden = scopeHistory.length < 2;
}

function activateNeighborhood(nodeId) {
  selectedNodeId = nodeId;
  FM.setNeighborhoodRoot(nodeId, neighborhoodDepth);
  const section = document.getElementById('sb-neighborhood');
  if (section) section.hidden = false;
  const title = document.getElementById('sb-nb-title');
  if (title) title.textContent = nodeMap[nodeId] ? nodeMap[nodeId].label : nodeId;
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function showTooltip(node) {
  const tooltip = document.getElementById('graph-tooltip');
  if (!tooltip) return;

  if (!node) {
    tooltip.hidden = true;
    return;
  }

  tooltip.hidden = false;
  const color = GR.CATEGORY_COLOR[node.category] || '#8c8fa8';
  tooltip.innerHTML = `
    <span class="tt-dot" style="background:${escHtml(color)}"></span>
    <span class="tt-label">${escHtml(node.label)}</span>
    <span class="tt-cat">${escHtml(node.category)}</span>
  `;

  // Position tooltip near cursor
  const container = document.getElementById('graph-container');
  const rect = container.getBoundingClientRect();
  tooltip.style.left = (rect.right - 300) + 'px';
  tooltip.style.top  = (rect.top + 80) + 'px';
}

// ── Info panel — Node ─────────────────────────────────────────────────────────
function showNodePanel(node) {
  const data  = nodeMap[node.id] || node;
  const isRef = data.node_type === 'reference';
  const color = GR.CATEGORY_COLOR[data.category] || '#8c8fa8';
  const tags  = (data.tags || []).map(t => `<span class="panel-tag">${escHtml(t)}</span>`).join('');

  const wikiLink = isRef && data.wikipedia
    ? `<a class="panel-link" href="${data.wikipedia}" target="_blank" rel="noopener">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        Wikipedia article
       </a>` : '';

  const mechanismNote = data.cross_scope
    ? `<div class="mechanism-note">
        Cross-scope pattern node — appears as a ghost in related scopes.
       </div>` : '';

  const aliasesHtml = (data.aliases && data.aliases.length)
    ? `<div class="panel-aliases">Also known as: ${data.aliases.map(a => escHtml(a)).join(', ')}</div>` : '';

  const contemporaryHtml = data.contemporary_relevance
    ? `<div class="contemporary-relevance">
        <div class="contemporary-relevance-label">Why it matters today</div>
        <div class="contemporary-relevance-text">${escHtml(data.contemporary_relevance)}</div>
       </div>` : '';

  const ghostNote = data.ghost
    ? `<button class="panel-scope-btn" data-scope="${escHtml(data.scope || 'global/mechanisms')}">
        → Go to source scope
       </button>` : '';

  const regionRow = data.region
    ? `<div class="panel-meta-row">
        <span class="panel-meta-key">Region</span>
        <span class="panel-meta-val">${escHtml(data.region)}</span>
       </div>` : '';

  const scopeRow = data.scope
    ? `<div class="panel-meta-row">
        <span class="panel-meta-key">Scope</span>
        <span class="panel-meta-val">${escHtml(data.scope)}</span>
       </div>` : '';

  document.getElementById('panel-inner').innerHTML = `
    <span class="panel-type-badge ${data.node_type || 'reference'}">${data.node_type || 'node'}</span>
    <div id="panel-title">${escHtml(data.label)}</div>
    ${aliasesHtml}
    <div id="panel-summary">${escHtml(data.summary || '')}</div>
    ${mechanismNote}
    ${contemporaryHtml}
    ${ghostNote}
    ${wikiLink}
    <div class="panel-meta">
      <div class="panel-meta-row">
        <span class="panel-meta-key">Category</span>
        <span class="panel-meta-val" style="color:${color}">${escHtml(data.category)}</span>
      </div>
      <div class="panel-meta-row">
        <span class="panel-meta-key">Period</span>
        <span class="panel-meta-val">${escHtml(data.decade || '')}</span>
      </div>
      ${regionRow}
      ${scopeRow}
    </div>
    ${tags ? `<div class="panel-tags">${tags}</div>` : ''}
    ${buildConnectionsList(data.id)}
    ${buildSuggestedConnections(data)}
  `;

  openPanel();
}

// ── Info panel — Edge ─────────────────────────────────────────────────────────
function showEdgePanel(link) {
  const data     = link;
  const srcId    = typeof data.source === 'object' ? data.source.id : data.source;
  const tgtId    = typeof data.target === 'object' ? data.target.id : data.target;
  const srcNode  = nodeMap[srcId];
  const tgtNode  = nodeMap[tgtId];
  const srcLabel = srcNode ? srcNode.label : srcId;
  const tgtLabel = tgtNode ? tgtNode.label : tgtId;
  const edgeColor = GR.EDGE_COLOR[data.type] || GR.EDGE_DEFAULT_COLOR;

  const sourcesHtml = (data.sources && data.sources.length)
    ? `<div class="panel-section-label" style="margin-top:12px">Sources</div>
       <div class="sources-list">${data.sources.map((s, i) => {
         const isUrl = /^https?:\/\//.test(s);
         return `<div class="source-item">${i+1}. ${isUrl
           ? `<a class="source-link" href="${escHtml(s)}" target="_blank" rel="noopener">${escHtml(s)}</a>`
           : escHtml(s)}</div>`;
       }).join('')}</div>` : '';

  document.getElementById('panel-inner').innerHTML = `
    <span class="panel-type-badge edge">edge</span>
    <div class="edge-type-label" style="color:${edgeColor}">${escHtml(data.type || '')}</div>
    <div class="edge-nodes">
      <span class="conn-item-inline" data-node-id="${escHtml(srcId)}"><strong>${escHtml(srcLabel)}</strong></span>
      <span style="color:#4a4f6a"> → </span>
      <span class="conn-item-inline" data-node-id="${escHtml(tgtId)}"><strong>${escHtml(tgtLabel)}</strong></span>
    </div>
    <div id="panel-summary">${escHtml(data.label || '')}</div>
    ${data.note ? `<div style="margin-top:12px" class="panel-section-label">Note</div><div class="panel-note">${escHtml(data.note)}</div>` : ''}
    <div class="panel-meta">
      <div class="panel-meta-row">
        <span class="panel-meta-key">Confidence</span>
        <span class="panel-meta-val"><span class="confidence-badge ${data.confidence}">${escHtml(data.confidence || '')}</span></span>
      </div>
    </div>
    ${sourcesHtml}
  `;
  openPanel();
}

// ── Connections list ──────────────────────────────────────────────────────────
function buildConnectionsList(nodeId) {
  const edges = allEdges.filter(e => {
    const s = typeof e.source === 'object' ? e.source.id : e.source;
    const t = typeof e.target === 'object' ? e.target.id : e.target;
    return s === nodeId || t === nodeId;
  });
  if (!edges.length) return '';

  const items = edges
    .sort((a, b) => (a.type || '').localeCompare(b.type || ''))
    .map(edge => {
      const s = typeof edge.source === 'object' ? edge.source.id : edge.source;
      const t = typeof edge.target === 'object' ? edge.target.id : edge.target;
      const isSource = s === nodeId;
      const otherId  = isSource ? t : s;
      const otherNode = nodeMap[otherId];
      const otherLabel = otherNode ? otherNode.label : otherId;
      const color  = GR.EDGE_COLOR[edge.type] || GR.EDGE_DEFAULT_COLOR;
      const arrow  = isSource ? '→' : '←';
      return `<div class="conn-item" data-node-id="${escHtml(otherId)}">
        <span class="conn-type" style="color:${color}">${escHtml(edge.type || '')}</span>
        <span class="conn-arrow">${arrow}</span>
        <span class="conn-label">${escHtml(otherLabel)}</span>
      </div>`;
    }).join('');

  return `
    <div class="panel-section-label" style="margin-top:16px">Connections (${edges.length})</div>
    <div class="conn-list">${items}</div>
  `;
}

// ── Suggested connections ─────────────────────────────────────────────────────
function buildSuggestedConnections(data) {
  if (!data.tags || !data.tags.length) return '';
  const connectedIds = new Set(
    allEdges
      .filter(e => {
        const s = typeof e.source === 'object' ? e.source.id : e.source;
        const t = typeof e.target === 'object' ? e.target.id : e.target;
        return s === data.id || t === data.id;
      })
      .map(e => {
        const s = typeof e.source === 'object' ? e.source.id : e.source;
        const t = typeof e.target === 'object' ? e.target.id : e.target;
        return s === data.id ? t : s;
      })
  );
  connectedIds.add(data.id);

  const suggestions = [];
  for (const node of allNodes) {
    if (connectedIds.has(node.id) || node.category === 'portal') continue;
    if (!node.tags || !node.tags.length) continue;
    const sharedTags = data.tags.filter(t => node.tags.includes(t));
    if (!sharedTags.length) continue;
    suggestions.push({ id: node.id, label: node.label, category: node.category, sharedTags, score: sharedTags.length });
  }
  if (!suggestions.length) return '';
  suggestions.sort((a, b) => b.score - a.score);
  const top = suggestions.slice(0, 5);
  const items = top.map(s => {
    const color = GR.CATEGORY_COLOR[s.category] || '#8c8fa8';
    return `<div class="suggested-item" data-node-id="${escHtml(s.id)}">
      <span class="suggested-dot" style="background:${color}"></span>
      <span class="suggested-label">${escHtml(s.label)}</span>
      <span class="suggested-reason">${s.sharedTags.slice(0,2).map(t => escHtml(t)).join(', ')}</span>
    </div>`;
  }).join('');
  return `
    <div class="panel-section-label" style="margin-top:16px">Possible Connections</div>
    <div class="suggested-list">${items}</div>
  `;
}

// ── Panel delegated clicks ────────────────────────────────────────────────────
document.getElementById('panel-inner').addEventListener('click', e => {
  // Scope navigation from ghost nodes
  const scopeBtn = e.target.closest('.panel-scope-btn');
  if (scopeBtn) {
    SM.enterScope(scopeBtn.dataset.scope);
    return;
  }
  const item = e.target.closest('[data-node-id]');
  if (!item) return;
  const nodeId = item.dataset.nodeId;
  const node   = nodeMap[nodeId];
  if (!node) return;
  handleNodeClick(node);
});

// ── Panel open/close ──────────────────────────────────────────────────────────
function openPanel()  { document.getElementById('info-panel').classList.add('open'); }
function closePanel() { document.getElementById('info-panel').classList.remove('open'); }

document.getElementById('panel-close').addEventListener('click', () => {
  closePanel();
  clearSelection();
});

// ── Neighborhood controls ─────────────────────────────────────────────────────
function initNeighborhoodControls() {
  document.querySelectorAll('.sb-depth-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sb-depth-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      neighborhoodDepth = parseInt(btn.dataset.depth, 10);
      FM.setNeighborhoodDepth(neighborhoodDepth);
    });
  });

  const clearBtn = document.getElementById('sb-nb-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    clearSelection();
    closePanel();
    showTooltip(null);
  });

  const exportBtn = document.getElementById('sb-export-subgraph');
  if (exportBtn) exportBtn.addEventListener('click', exportSubgraphJSON);
}

// ── Toolbar ───────────────────────────────────────────────────────────────────
function initToolbar() {
  let sidebarCollapsed = false;

  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    sidebarCollapsed = !sidebarCollapsed;
    document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);
    const btn = document.getElementById('sidebar-toggle');
    btn.setAttribute('aria-expanded', String(!sidebarCollapsed));
  });

  document.getElementById('fit-btn').addEventListener('click', () => GR.fitCamera());

  document.getElementById('fullscreen-btn').addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen();
  });

  document.getElementById('back-btn').addEventListener('click', goBack);

  document.getElementById('help-btn').addEventListener('click', () => {
    document.getElementById('help-modal').hidden = false;
  });

  document.addEventListener('keydown', e => {
    const tag = e.target.tagName;
    const inInput = tag === 'INPUT' || tag === 'TEXTAREA';

    if (e.key === 'Escape') {
      document.getElementById('analytics-modal').hidden     = true;
      document.getElementById('quiz-modal').hidden          = true;
      document.getElementById('mech-explorer-modal').hidden = true;
      document.getElementById('help-modal').hidden          = true;
      closePanel();
      clearSelection();
      showTooltip(null);
    }

    if (!inInput && e.key === '?') {
      e.preventDefault();
      document.getElementById('help-modal').hidden = false;
    }

    if (e.altKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      goBack();
    }
  });
}

// ── Sidebar init ───────────────────────────────────────────────────────────────
function initSidebar() {
  initPathFinder();
  initPathFinderCollapse();
  initNeighborhoodControls();
  Search.onResultSelect(node => {
    handleNodeClick(node);
    GR.focusOnNode(node, 120);
    GR.flashNode(node.id);
  });
}

// ── Actions (Analytics, Quiz, Export PNG) ─────────────────────────────────────
function initModals() {
  document.getElementById('export-png-btn').addEventListener('click', GR.exportPNG);
  document.getElementById('analytics-btn').addEventListener('click', openAnalyticsDashboard);
  document.getElementById('analytics-close').addEventListener('click', () => {
    document.getElementById('analytics-modal').hidden = true;
  });
  document.getElementById('quiz-btn').addEventListener('click', openQuiz);
  document.getElementById('quiz-close').addEventListener('click', () => {
    document.getElementById('quiz-modal').hidden = true;
  });
  document.getElementById('mech-explorer-close').addEventListener('click', () => {
    document.getElementById('mech-explorer-modal').hidden = true;
  });
  document.getElementById('help-close').addEventListener('click', () => {
    document.getElementById('help-modal').hidden = true;
  });
  document.getElementById('explore-btn').addEventListener('click', () => {
    const candidates = allNodes
      .filter(n => n.category !== 'portal' && !n.cross_scope && (n.__degree || 0) > 2)
      .sort((a, b) => (b.__degree || 0) - (a.__degree || 0));
    const topN = candidates.slice(0, Math.max(20, Math.floor(candidates.length * 0.3)));
    const pick = topN[Math.floor(Math.random() * topN.length)];
    if (pick) handleNodeClick(pick);
  });
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function updateStats(nodeCount, edgeCount, totalNodes, totalEdges) {
  const el = document.getElementById('stats');
  if (!el) return;
  if (totalNodes !== undefined && nodeCount !== totalNodes) {
    el.innerHTML = `<div>${nodeCount}/${totalNodes} nodes · ${edgeCount}/${totalEdges} edges</div>`;
  } else {
    el.innerHTML = `<div>${nodeCount} nodes · ${edgeCount} edges</div>`;
  }
}

// ── Export Subgraph JSON ───────────────────────────────────────────────────────
function exportSubgraphJSON() {
  if (!selectedNodeId) return;
  // Build edge map from current data
  const edgeMapLocal = {};
  for (const e of allEdges) {
    const s = typeof e.source === 'object' ? e.source.id : e.source;
    const t = typeof e.target === 'object' ? e.target.id : e.target;
    if (!edgeMapLocal[s]) edgeMapLocal[s] = [];
    if (!edgeMapLocal[t]) edgeMapLocal[t] = [];
    edgeMapLocal[s].push(t);
    edgeMapLocal[t].push(s);
  }
  const nbIds  = GR.getNeighborIds(selectedNodeId, neighborhoodDepth, {}, edgeMapLocal);
  const expNodes = allNodes.filter(n => nbIds.has(n.id));
  const expEdges = allEdges.filter(e => {
    const s = typeof e.source === 'object' ? e.source.id : e.source;
    const t = typeof e.target === 'object' ? e.target.id : e.target;
    return nbIds.has(s) && nbIds.has(t);
  });
  const json = JSON.stringify({ nodes: expNodes, edges: expEdges }, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `why-opedia-neighborhood-${selectedNodeId}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ── Path Finder (Feature A) ───────────────────────────────────────────────────
function initPathFinder() {
  document.getElementById('pf-find-btn').addEventListener('click', runPathFinder);
  document.getElementById('pf-clear-btn').addEventListener('click', clearPathFinder);
  ['pf-from', 'pf-to'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') runPathFinder();
    });
  });
}

function initPathFinderCollapse() {
  const btn  = document.getElementById('pf-collapse');
  const body = document.getElementById('pf-body');
  if (!btn || !body) return;
  body.style.display = 'none';
  btn.textContent = '▾';
  btn.addEventListener('click', () => {
    const collapsed = body.style.display === 'none';
    body.style.display = collapsed ? '' : 'none';
    btn.textContent = collapsed ? '▴' : '▾';
  });
}

function runPathFinder() {
  const fromVal = document.getElementById('pf-from').value.trim();
  const toVal   = document.getElementById('pf-to').value.trim();
  const result  = document.getElementById('pf-result');

  if (!fromVal || !toVal) {
    result.innerHTML = '<span style="color:var(--text-muted)">Enter both node names.</span>';
    return;
  }

  const fromNode = resolveNodeByName(fromVal);
  const toNode   = resolveNodeByName(toVal);

  if (!fromNode) { result.innerHTML = `<span class="pf-no-path">Not found: "${escHtml(fromVal)}"</span>`; return; }
  if (!toNode)   { result.innerHTML = `<span class="pf-no-path">Not found: "${escHtml(toVal)}"</span>`; return; }

  const path = findPath(fromNode.id, toNode.id);
  clearPathHighlight();

  if (!path) {
    result.innerHTML = `<span class="pf-no-path">No directed path found.</span>`;
    return;
  }

  // Highlight on graph
  pathHighlightedIds = new Set(path);
  const edgePairs = [];
  for (let i = 0; i < path.length - 1; i++) edgePairs.push([path[i], path[i+1]]);
  GR.highlightPath(path, edgePairs);

  // Build chain display
  const steps = path.map((id, i) => {
    const nd    = nodeMap[id];
    const label = nd ? nd.label : id;
    const color = nd ? (GR.CATEGORY_COLOR[nd.category] || '#8c8fa8') : '#8c8fa8';
    let edgeLabel = '';
    if (i < path.length - 1) {
      const nextId = path[i+1];
      const edge = allEdges.find(e => {
        const s = typeof e.source === 'object' ? e.source.id : e.source;
        const t = typeof e.target === 'object' ? e.target.id : e.target;
        return s === id && t === nextId;
      });
      if (edge) edgeLabel = edge.type || '';
    }
    return `
      <div class="pf-path-step" data-node-id="${escHtml(id)}">
        <span style="color:${color}; font-size:10px;">●</span>
        <span class="pf-path-node">${escHtml(label)}</span>
        ${nd && nd.decade ? `<span class="pf-path-decade">${escHtml(nd.decade)}</span>` : ''}
      </div>
      ${edgeLabel ? `<div style="padding:0 6px 2px 18px"><span class="pf-path-arrow">${escHtml(edgeLabel)}</span></div>` : ''}
    `;
  }).join('');

  result.innerHTML = `
    <div style="margin-bottom:6px;font-size:11px;color:var(--text-muted)">Path (${path.length} nodes):</div>
    <div class="pf-path-chain">${steps}</div>
  `;

  result.querySelectorAll('.pf-path-step').forEach(step => {
    step.addEventListener('click', () => {
      const node = nodeMap[step.dataset.nodeId];
      if (node) { handleNodeClick(node); GR.focusOnNode(node); }
    });
  });
}

function resolveNodeByName(name) {
  const q = name.toLowerCase();
  let best = null, bestScore = 0;
  for (const node of allNodes) {
    if (node.category === 'portal') continue;
    const label = (node.label || '').toLowerCase();
    if (label === q && bestScore < 3)          { best = node; bestScore = 3; }
    else if (label.startsWith(q) && bestScore < 2) { best = node; bestScore = 2; }
    else if (label.includes(q) && bestScore < 1)   { best = node; bestScore = 1; }
  }
  return best;
}

function findPath(fromId, toId) {
  // Build adjacency from edges (directed: source→target)
  const adj = {};
  for (const edge of allEdges) {
    const s = typeof edge.source === 'object' ? edge.source.id : edge.source;
    const t = typeof edge.target === 'object' ? edge.target.id : edge.target;
    if (!adj[s]) adj[s] = [];
    adj[s].push(t);
  }

  if (fromId === toId) return [fromId];
  const queue   = [[fromId]];
  const visited = new Set([fromId]);
  while (queue.length) {
    const path = queue.shift();
    if (path.length > 18) continue;
    const current   = path[path.length - 1];
    const neighbors = adj[current] || [];
    for (const nId of neighbors) {
      if (visited.has(nId)) continue;
      const newPath = [...path, nId];
      if (nId === toId) return newPath;
      visited.add(nId);
      queue.push(newPath);
    }
  }
  return null;
}

function clearPathFinder() {
  document.getElementById('pf-from').value = '';
  document.getElementById('pf-to').value   = '';
  document.getElementById('pf-result').innerHTML = '';
  clearPathHighlight();
}

function clearPathHighlight() {
  pathHighlightedIds.clear();
  GR.clearPathHighlight();
}

// ── Analytics Dashboard ───────────────────────────────────────────────────────
function openAnalyticsDashboard() {
  const nodes = allNodes.filter(n => n.category !== 'portal');
  const edges = allEdges;

  const byDegree = [...nodes].sort((a, b) => (b.__degree || 0) - (a.__degree || 0)).slice(0, 10);
  const edgeTypeCounts = {};
  for (const e of edges) edgeTypeCounts[e.type] = (edgeTypeCounts[e.type] || 0) + 1;

  const decadeCounts = {};
  for (const n of nodes) {
    const year = parseDecadeYear(n.decade || '');
    const dec  = `${Math.floor(year / 10) * 10}s`;
    decadeCounts[dec] = (decadeCounts[dec] || 0) + 1;
  }

  const maxDeg = byDegree[0] ? (byDegree[0].__degree || 1) : 1;

  function barRow(label, value, max, color) {
    const pct = Math.round((value / max) * 100);
    return `<div class="analytics-bar-row">
      <div class="analytics-bar-label" style="color:${color || 'var(--text)'}" title="${escHtml(label)}">${escHtml(label)}</div>
      <div class="analytics-bar-wrap"><div class="analytics-bar" style="width:${pct}%;background:${color || 'var(--accent)'}"></div></div>
      <div class="analytics-bar-val">${value}</div>
    </div>`;
  }

  const topNodesHtml = byDegree.map(n =>
    barRow(n.label, n.__degree || 0, maxDeg, GR.CATEGORY_COLOR[n.category])
  ).join('');

  const maxEdgeCount = Math.max(...Object.values(edgeTypeCounts), 1);
  const edgeTypeHtml = Object.entries(edgeTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => barRow(type, count, maxEdgeCount, GR.EDGE_COLOR[type] || GR.EDGE_DEFAULT_COLOR))
    .join('');

  const maxDecade = Math.max(...Object.values(decadeCounts), 1);
  const decadeHtml = Object.keys(decadeCounts).sort()
    .map(dec => barRow(dec, decadeCounts[dec], maxDecade, null))
    .join('');

  const scopeCounts = {};
  for (const n of nodes) {
    if (n.scope) scopeCounts[n.scope] = (scopeCounts[n.scope] || 0) + 1;
  }

  document.getElementById('analytics-body').innerHTML = `
    <div class="analytics-overview">
      <div class="analytics-stat"><div class="analytics-stat-val">${nodes.length}</div><div class="analytics-stat-label">Nodes</div></div>
      <div class="analytics-stat"><div class="analytics-stat-val">${edges.length}</div><div class="analytics-stat-label">Edges</div></div>
      <div class="analytics-stat"><div class="analytics-stat-val">${nodes.filter(n=>n.cross_scope).length}</div><div class="analytics-stat-label">Cross-scope</div></div>
      <div class="analytics-stat"><div class="analytics-stat-val">${Object.keys(scopeCounts).length}</div><div class="analytics-stat-label">Scopes</div></div>
    </div>
    <div class="analytics-section">
      <div class="analytics-section-title">Top 10 Most Connected Nodes</div>
      ${topNodesHtml}
    </div>
    <div class="analytics-section">
      <div class="analytics-section-title">Edge Type Distribution</div>
      ${edgeTypeHtml}
    </div>
    <div class="analytics-section">
      <div class="analytics-section-title">Temporal Coverage by Decade</div>
      ${decadeHtml}
    </div>
  `;
  document.getElementById('analytics-modal').hidden = false;
}

function parseDecadeYear(decade) {
  if (!decade) return 2000;
  const bce = /bce/i.test(decade);
  const m = decade.match(/(\d+)/);
  if (m) { const y = parseInt(m[1], 10); return bce ? -y : y; }
  if (/ancient|classical/i.test(decade)) return 400;
  if (/medieval/i.test(decade)) return 1200;
  return 2000;
}

// ── Cross-Scope Mechanism Explorer ────────────────────────────────────────────
async function openMechanismExplorer(mechNode) {
  const modal = document.getElementById('mech-explorer-modal');
  const title = document.getElementById('mech-explorer-title');
  const body  = document.getElementById('mech-explorer-body');

  title.textContent = `${mechNode.label} — Cross-Scope Connections`;
  body.innerHTML = '<p style="color:var(--text-muted)">Loading…</p>';
  modal.hidden = false;

  const data = await SM.getMechanismCrossScope(mechNode.id);
  if (!data || !data.connectedNodes.length) {
    body.innerHTML = '<p style="color:var(--text-muted)">No cross-scope connections found.</p>';
    return;
  }

  const { connectedNodes, connectedEdges } = data;
  const items = connectedNodes.map(n => {
    const color = GR.CATEGORY_COLOR[n.category] || '#8c8fa8';
    const edge  = connectedEdges.find(e => {
      const s = typeof e.source === 'object' ? e.source.id : e.source;
      const t = typeof e.target === 'object' ? e.target.id : e.target;
      return (s === mechNode.id && t === n.id) || (t === mechNode.id && s === n.id);
    });
    const edgeLabel = edge ? edge.type : '';
    const scopeTag  = n.scope ? `<span class="sb-ac-scope">[${n.scope.split('/').pop()}]</span>` : '';
    return `<div class="mech-conn-item" data-node-id="${escHtml(n.id)}" data-scope="${escHtml(n.scope || '')}">
      <span class="suggested-dot" style="background:${color}"></span>
      <span>${escHtml(n.label)} ${scopeTag}</span>
      <span class="conn-type" style="color:${GR.EDGE_COLOR[edgeLabel]||GR.EDGE_DEFAULT_COLOR}">${escHtml(edgeLabel)}</span>
    </div>`;
  }).join('');

  const currentScopePath = SM.getCurrentScopePath();
  body.innerHTML = `
    <p style="color:var(--text-muted);margin-bottom:16px;font-size:13px">
      Found in ${connectedNodes.length} scope${connectedNodes.length !== 1 ? 's' : ''}:
    </p>
    <div class="mech-conn-list">${items}</div>
    <button class="pf-btn primary" id="mech-explorer-return" style="margin-top:16px;width:100%">
      ← Return to ${SM.getScopeLabel(currentScopePath)}
    </button>
  `;

  body.querySelectorAll('.mech-conn-item').forEach(item => {
    item.addEventListener('click', () => {
      modal.hidden = true;
      const node = nodeMap[item.dataset.nodeId] || allNodes.find(n => n.id === item.dataset.nodeId);
      if (node) handleNodeClick(node);
    });
  });

  document.getElementById('mech-explorer-return').addEventListener('click', () => {
    modal.hidden = true;
  });
}

// ── Quiz Mode ─────────────────────────────────────────────────────────────────
function openQuiz() {
  quizScore = 0; quizTotal = 0;
  renderQuizQuestion();
  document.getElementById('quiz-modal').hidden = false;
}

function renderQuizQuestion() {
  const edges = allEdges.filter(e => e.confidence !== 'speculative');
  if (edges.length < 4) {
    document.getElementById('quiz-body').innerHTML = '<p style="color:var(--text-muted)">Not enough edges for quiz.</p>';
    return;
  }

  const edge    = edges[Math.floor(Math.random() * edges.length)];
  const srcId   = typeof edge.source === 'object' ? edge.source.id : edge.source;
  const tgtId   = typeof edge.target === 'object' ? edge.target.id : edge.target;
  const srcNode = nodeMap[srcId];
  const tgtNode = nodeMap[tgtId];
  if (!srcNode || !tgtNode) { renderQuizQuestion(); return; }

  const correctLabel = tgtNode.label;
  const wrongNodes   = allNodes.filter(n => n.id !== tgtId && n.id !== srcId && n.category !== 'portal');
  const wrongs       = wrongNodes.sort(() => Math.random() - 0.5).slice(0, 3).map(n => n.label);
  const options      = [correctLabel, ...wrongs].sort(() => Math.random() - 0.5);

  const edgeColor = GR.EDGE_COLOR[edge.type] || GR.EDGE_DEFAULT_COLOR;
  document.getElementById('quiz-body').innerHTML = `
    <div class="quiz-score">Score: ${quizScore} / ${quizTotal}</div>
    <span class="quiz-edge-type" style="color:${edgeColor}">${escHtml(edge.type || '')}</span>
    <div class="quiz-question">
      What does <strong>${escHtml(srcNode.label)}</strong> ${(edge.type||'').toLowerCase().replace(/_/g,' ')}?
    </div>
    <div class="quiz-options">
      ${options.map(opt => `<button class="quiz-option" data-answer="${escHtml(opt)}" data-correct="${escHtml(correctLabel)}">${escHtml(opt)}</button>`).join('')}
    </div>
    <div class="quiz-feedback"></div>
  `;
  document.querySelectorAll('.quiz-option').forEach(btn => btn.addEventListener('click', handleQuizAnswer));
}

function handleQuizAnswer(e) {
  const btn = e.currentTarget;
  const isCorrect = btn.dataset.answer === btn.dataset.correct;
  quizTotal++;
  if (isCorrect) quizScore++;
  document.querySelectorAll('.quiz-option').forEach(b => {
    b.disabled = true;
    if (b.dataset.answer === btn.dataset.correct) b.classList.add('correct');
    else if (b === btn && !isCorrect) b.classList.add('wrong');
  });
  const feedback = document.querySelector('.quiz-feedback');
  feedback.textContent = isCorrect ? '✓ Correct!' : `✗ Answer: ${btn.dataset.correct}`;
  feedback.className   = 'quiz-feedback ' + (isCorrect ? 'correct' : 'wrong');
  const scoreEl = document.querySelector('.quiz-score');
  if (scoreEl) scoreEl.textContent = `Score: ${quizScore} / ${quizTotal}`;
  const optionsDiv = document.querySelector('.quiz-options');
  if (optionsDiv) {
    const nextBtn = document.createElement('button');
    nextBtn.className   = 'quiz-next-btn';
    nextBtn.textContent = quizTotal >= 10 ? 'See Results' : 'Next Question →';
    nextBtn.addEventListener('click', () => {
      if (quizTotal >= 10) showQuizResults();
      else renderQuizQuestion();
    });
    optionsDiv.replaceWith(nextBtn);
  }
}

function showQuizResults() {
  const pct   = Math.round((quizScore / quizTotal) * 100);
  const grade = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good work!' : 'Keep exploring!';
  document.getElementById('quiz-body').innerHTML = `
    <div class="quiz-end">
      <div class="quiz-end-score">${quizScore}/${quizTotal}</div>
      <div class="quiz-end-label">${pct}% — ${grade}</div>
      <button class="quiz-next-btn" id="quiz-restart">Play Again</button>
    </div>
  `;
  document.getElementById('quiz-restart').addEventListener('click', openQuiz);
}

// ── URL State ─────────────────────────────────────────────────────────────────
function updateURLState() {
  const params = new URLSearchParams();
  const scope = SM.getCurrentScopePath();
  if (scope && scope !== 'global') params.set('scope', scope);
  if (selectedNodeId) params.set('n', selectedNodeId);
  const fs = FM.getFilterState();
  if (fs.conn > 0)        params.set('conn', fs.conn);
  if (fs.dep !== 1)       params.set('dep', fs.dep);
  if (fs.decMin !== null) params.set('decMin', fs.decMin);
  if (fs.decMax !== null) params.set('decMax', fs.decMax);
  const hash = params.toString();
  try {
    history.replaceState(null, '', hash ? '#' + hash : location.pathname + location.search);
  } catch(e) {}
}

function loadURLState() {
  if (!location.hash || location.hash.length <= 1) return;
  try {
    const params = new URLSearchParams(location.hash.slice(1));

    const scope = params.get('scope');
    if (scope && scope !== 'global') {
      SM.enterScope(scope);
    }

    FM.applyFilterState({
      cats:   params.get('cats'),
      edges:  params.get('edges'),
      conn:   params.get('conn'),
      dep:    params.get('dep'),
      decMin: params.get('decMin'),
      decMax: params.get('decMax'),
    });

    const nodeId = params.get('n');
    if (nodeId && nodeMap[nodeId]) {
      setTimeout(() => {
        const node = nodeMap[nodeId];
        handleNodeClick(node);
        GR.focusOnNode(node);
      }, 800);
    }
  } catch (err) {
    console.warn('loadURLState error:', err);
  }
}

// ── WASD Camera Controls ──────────────────────────────────────────────────────
// W/S = fly forward/backward  A/D = strafe left/right  Space = snap to selected
function initWASD() {
  if (isMobile) return;   // touch devices don't need keyboard fly controls

  const SPEED = 10;   // units per 16.67ms (60fps baseline)
  const keys  = {};

  document.addEventListener('keydown', e => {
    // Never hijack keypresses when the user is typing in an input/textarea
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'a' || k === 's' || k === 'd' || k === 'q' || k === 'e') {
      keys[k] = true;
      e.preventDefault();  // prevent page scroll
    }

    if (e.key === ' ') {
      e.preventDefault();
      // Snap camera back to the currently selected node
      if (selectedNodeId && nodeMap[selectedNodeId]) {
        GR.focusOnNode(nodeMap[selectedNodeId]);
      }
    }
  });

  document.addEventListener('keyup', e => {
    keys[e.key.toLowerCase()] = false;
  });

  // Time-based RAF loop: normalise movement to 60fps so speed is consistent
  // regardless of whether many or few nodes are visible (framerate can vary 2×).
  let lastT = performance.now();
  (function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min((now - lastT) / 16.667, 4); // cap at 4× to avoid jumps
    lastT = now;
    const fwd = (keys['w'] ? 1 : 0) - (keys['s'] ? 1 : 0);
    const rgt = (keys['d'] ? 1 : 0) - (keys['a'] ? 1 : 0);
    const up  = (keys['e'] ? 1 : 0) - (keys['q'] ? 1 : 0);
    if (fwd !== 0 || rgt !== 0 || up !== 0) {
      GR.moveCamera(fwd * SPEED * dt, rgt * SPEED * dt, up * SPEED * dt);
    }
  })(performance.now());
}

// ── Utility ───────────────────────────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

// ── Boot ──────────────────────────────────────────────────────────────────────
boot();
