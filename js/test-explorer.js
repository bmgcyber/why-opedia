'use strict';

// ── test-explorer.js ─────────────────────────────────────────────────────────
// Standalone prototype: nested ego-graph explorer.
// Macro = 3D constellation of the 9 scopes. Micro = ego-graph that grows/shrinks
// around a seed node. Loads all data into memory but only ever renders a small
// ego-subgraph, so every view stays readable.
//
// Self-contained. Does not touch the live app (index.html / app.js / renderers).

(function () {
  // ── Config ─────────────────────────────────────────────────────────────────
  const NEIGHBOR_CAP = 15;   // neighbors revealed when a node is expanded
  const OVERVIEW_CAP = 18;   // top hubs shown when you first enter a scope
  const SIDEBAR_CAP  = 140;  // rows rendered in the scope sidebar list

  const SCOPE_KEYS = [
    'history', 'politics', 'economics', 'psychology',
    'media', 'health', 'art', 'technology', 'religion',
  ];

  const SCOPE_COLORS = {
    history:    '#e0a050',
    politics:   '#e05252',
    economics:  '#4fb286',
    psychology: '#a96ce6',
    media:      '#5b8dee',
    health:     '#e07ab0',
    art:        '#f6c90e',
    technology: '#46c6c6',
    religion:   '#b59b6a',
  };

  const CATEGORY_COLORS = {
    mechanism:   '#5b8dee',
    event:       '#e0a050',
    person:      '#e0d050',
    movement:    '#e07ab0',
    institution: '#4fb286',
    era:         '#9a8c98',
    ideology:    '#e05252',
    phenomenon:  '#a96ce6',
    reference:   '#7c9bb0',
    artifact:    '#f6c90e',
    portal:      '#46c6c6',
  };

  const CROSS_SCOPE_TINT = '#6b7280'; // desaturated gray for neighbors in another scope

  const EDGE_COLORS = {
    CAUSED:                '#e05252',
    ENABLED:               '#e09752',
    ACCELERATED:           '#f6c90e',
    UNDERMINED:            '#7c6b9e',
    SHARES_MECHANISM_WITH: '#5b8dee',
    SELF_REINFORCES:       '#a96ce6',
  };
  const EDGE_COLOR_DEFAULT = '#4a4f6a';

  // ── In-memory index ──────────────────────────────────────────────────────────
  const nodeById   = new Map();              // id → node (tagged with .scope)
  const adjacency  = new Map();              // id → [{ edge, otherId }]
  const degree     = new Map();              // id → number
  let   scopeMeta  = {};                     // scopeKey → { label, count }
  let   fuse       = null;

  // ── App state ────────────────────────────────────────────────────────────────
  let mode         = 'constellation';        // 'constellation' | 'ego'
  let currentScope = null;
  let expanded     = new Set();
  let pinned       = new Set();              // individual nodes force-shown past the cap
  let selectedId   = null;
  let moreById     = new Map();              // id → hidden-neighbor count (ego view)
  let renderedNow  = new Set();              // ids currently drawn in the graph

  let Graph        = null;

  // ── DOM refs ─────────────────────────────────────────────────────────────────
  let elBack, elCrumb, elSearch, elResults, elHint, elPanel;
  let elSidebar, elScopeTitle, elScopeCount, elScopeFilter, elScopeList, elOverviewBtn;

  // ── Data loading ─────────────────────────────────────────────────────────────
  async function loadAll() {
    const scopeFetches = SCOPE_KEYS.map(s => Promise.all([
      fetch(`data/global/${s}/nodes.json`).then(r => r.json()),
      fetch(`data/global/${s}/edges.json`).then(r => r.json()),
    ]));

    const [mechNodes, mechEdges, scopeResults] = await Promise.all([
      fetch('data/mechanisms/nodes.json').then(r => r.json()),
      fetch('data/mechanisms/edges.json').then(r => r.json()),
      Promise.all(scopeFetches),
    ]);

    // Index per-scope nodes + edges
    SCOPE_KEYS.forEach((scopeKey, i) => {
      const [nodes, edges] = scopeResults[i];
      for (const n of nodes) {
        n.scope = `global/${scopeKey}`;
        n._scopeKey = scopeKey;
        nodeById.set(n.id, n);
      }
      scopeMeta[scopeKey] = { label: null, count: nodes.length };
      indexEdges(edges);
    });

    // Index mechanism (cross-scope) nodes + edges
    for (const n of mechNodes) {
      n.scope = 'mechanisms';
      n._scopeKey = 'mechanisms';
      nodeById.set(n.id, n);
    }
    indexEdges(mechEdges);

    // Degree from adjacency
    for (const [id, list] of adjacency) degree.set(id, list.length);

    // Scope labels from scopes.json
    const scopes = await fetch('data/scopes.json').then(r => r.json());
    const children = scopes.global.children || {};
    for (const k of SCOPE_KEYS) {
      if (scopeMeta[k]) scopeMeta[k].label = (children[k] && children[k].label) || k;
    }

    // Fuse index over all real nodes (skip mechanism-less orphans is unnecessary)
    const all = [...nodeById.values()];
    fuse = new Fuse(all, {
      keys: ['label', 'summary', 'tags'],
      threshold: 0.4,
      ignoreLocation: true,
    });
  }

  function indexEdges(edges) {
    for (const e of edges) {
      if (!e.source || !e.target) continue;
      pushAdj(e.source, e, e.target);
      pushAdj(e.target, e, e.source);
    }
  }

  function pushAdj(id, edge, otherId) {
    let list = adjacency.get(id);
    if (!list) { list = []; adjacency.set(id, list); }
    list.push({ edge, otherId });
  }

  // ── Neighbor helpers ─────────────────────────────────────────────────────────
  function neighborsOf(id) {
    const list = adjacency.get(id) || [];
    const seen = new Set();
    const out = [];
    for (const { otherId } of list) {
      if (otherId === id || seen.has(otherId)) continue;
      if (!nodeById.has(otherId)) continue;
      seen.add(otherId);
      out.push(otherId);
    }
    return out;
  }

  function topNeighbors(id, cap) {
    const all = neighborsOf(id);
    all.sort((a, b) => (degree.get(b) || 0) - (degree.get(a) || 0));
    return { shown: all.slice(0, cap), total: all.length };
  }

  function deg(id) { return degree.get(id) || 0; }

  function nodesInScope(scopeKey) {
    const out = [];
    for (const n of nodeById.values()) {
      if (n._scopeKey === scopeKey) out.push(n);
    }
    out.sort((a, b) => deg(b.id) - deg(a.id));
    return out;
  }

  // ── Ego-graph rendering ──────────────────────────────────────────────────────
  function buildEgoData() {
    moreById = new Map();

    // Overview mode: nothing expanded yet → show the scope's top hubs.
    if (expanded.size === 0) {
      const hubs = nodesInScope(currentScope).slice(0, OVERVIEW_CAP);
      const ids = new Set(hubs.map(n => n.id));
      const links = [];
      const seenEdge = new Set();
      for (const id of ids) {
        const list = adjacency.get(id) || [];
        for (const { edge, otherId } of list) {
          if (!ids.has(otherId)) continue;
          const eid = edge.id || `${edge.source}__${edge.target}`;
          if (seenEdge.has(eid)) continue;
          seenEdge.add(eid);
          links.push({ id: eid, source: edge.source, target: edge.target, type: edge.type });
        }
      }
      return { nodes: hubs, links };
    }

    const renderedIds = new Set([...expanded, ...pinned]);

    for (const id of expanded) {
      const { shown, total } = topNeighbors(id, NEIGHBOR_CAP);
      if (total > NEIGHBOR_CAP) moreById.set(id, total - NEIGHBOR_CAP);
      for (const nb of shown) renderedIds.add(nb);
    }

    const nodes = [];
    for (const id of renderedIds) {
      const n = nodeById.get(id);
      if (n) nodes.push(n);
    }

    // Edges where BOTH endpoints are rendered (dedupe by edge id)
    const links = [];
    const seenEdge = new Set();
    for (const id of renderedIds) {
      const list = adjacency.get(id) || [];
      for (const { edge, otherId } of list) {
        if (!renderedIds.has(otherId)) continue;
        const eid = edge.id || `${edge.source}__${edge.target}`;
        if (seenEdge.has(eid)) continue;
        seenEdge.add(eid);
        links.push({ id: eid, source: edge.source, target: edge.target, type: edge.type });
      }
    }

    return { nodes, links };
  }

  function renderEgo() {
    const data = buildEgoData();
    renderedNow = new Set(data.nodes.map(n => n.id));
    Graph.graphData(data);
    setTimeout(() => Graph.zoomToFit(600, 80), 240);
    updateChrome();
    renderScopeList();
  }

  // ── Constellation rendering ──────────────────────────────────────────────────
  function renderConstellation() {
    mode = 'constellation';
    currentScope = null;
    selectedId = null;
    expanded = new Set();
    pinned = new Set();
    moreById = new Map();
    if (elSidebar) elSidebar.hidden = true;

    const nodes = SCOPE_KEYS.map(k => ({
      id: `scope:${k}`,
      _scopeNode: true,
      _scopeKey: k,
      label: scopeMeta[k].label,
      count: scopeMeta[k].count,
    }));

    Graph.graphData({ nodes, links: [] });
    setTimeout(() => Graph.zoomToFit(600, 120), 240);
    updateChrome();
    hidePanel();
  }

  // ── Scope entry / seeding ────────────────────────────────────────────────────
  // Entering a scope lands on an OVERVIEW (top hubs), not a single seed, so the
  // user sees the scope's major threads and can pick where to dive in.
  function enterScope(scopeKey) {
    if (!nodesInScope(scopeKey).length) { renderConstellation(); return; }
    currentScope = scopeKey;
    mode = 'ego';
    expanded = new Set();   // empty → buildEgoData renders the overview
    pinned = new Set();
    selectedId = null;
    if (elSidebar) elSidebar.hidden = false;
    if (elScopeFilter) elScopeFilter.value = '';
    renderEgo();
    hidePanel();
  }

  function reseed(id) {
    const n = nodeById.get(id);
    if (!n) return;
    mode = 'ego';
    if (n._scopeKey && n._scopeKey !== 'mechanisms') currentScope = n._scopeKey;
    else if (!currentScope) currentScope = 'mechanisms';
    expanded = new Set([id]);
    pinned = new Set();
    selectedId = id;
    if (elSidebar) elSidebar.hidden = false;
    renderEgo();
    showPanel(id);
  }

  // ── Node click ───────────────────────────────────────────────────────────────
  function onNodeClick(node) {
    if (mode === 'constellation') {
      enterScope(node._scopeKey);
      return;
    }
    const id = node.id;

    // In overview, a click dives into that node's neighborhood.
    if (expanded.size === 0) { reseed(id); return; }

    selectedId = id;
    const isSeedOnly = expanded.size === 1 && expanded.has(id);
    if (expanded.has(id)) {
      if (!isSeedOnly) expanded.delete(id); // collapse (but never collapse the lone seed)
    } else {
      expanded.add(id); // expand leaf
    }
    renderEgo();
    showPanel(id);
  }

  // ── Detail panel ─────────────────────────────────────────────────────────────
  function showPanel(id) {
    const n = nodeById.get(id);
    if (!n) return;
    selectedId = id;

    const isCross = n._scopeKey && n._scopeKey !== currentScope && n._scopeKey !== 'mechanisms';
    const scopeLabel = n._scopeKey === 'mechanisms'
      ? 'Cross-scope mechanism'
      : (scopeMeta[n._scopeKey] ? scopeMeta[n._scopeKey].label : n._scopeKey);
    const isExpanded = expanded.has(id);
    const more = moreById.get(id) || 0;

    let html = '';
    html += `<button class="tx-panel-close" id="tx-panel-close">✕</button>`;
    html += `<div class="tx-panel-cat">${esc(n.category || n.node_type || '')}</div>`;
    html += `<div class="tx-panel-title">${esc(n.label || n.id)}</div>`;
    html += `<div class="tx-panel-meta">${esc(scopeLabel)} · ${deg(id)} connections`;
    if (more > 0) html += ` · ${more} more hidden`;
    html += `</div>`;
    if (n.summary) html += `<div class="tx-panel-summary">${esc(n.summary)}</div>`;

    html += `<div class="tx-panel-btns">`;
    if (isExpanded && !(expanded.size === 1 && expanded.has(id))) {
      html += `<button class="tx-btn" data-act="collapse">Collapse</button>`;
    } else if (!isExpanded) {
      html += `<button class="tx-btn tx-btn-primary" data-act="expand">Expand</button>`;
    }
    html += `<button class="tx-btn" data-act="focus">Focus here</button>`;
    if (isCross) {
      html += `<button class="tx-btn" data-act="enter">Enter ${esc(scopeMeta[n._scopeKey].label)}</button>`;
    }
    html += `</div>`;

    // ── Full connections list — every neighbor, nothing hidden ──────────────────
    const conns = connectionsOf(id);
    if (conns.length) {
      html += `<div class="tx-conn-head">All connections (${conns.length})</div>`;
      if (conns.length > 10) {
        html += `<input class="tx-conn-filter" id="tx-conn-filter" type="text" placeholder="Filter connections…" autocomplete="off" />`;
      }
      html += `<div class="tx-conn-list" id="tx-conn-list">`;
      for (const c of conns) {
        const nb = nodeById.get(c.oid);
        const lbl = nb.label || nb.id;
        const here = renderedNow.has(c.oid);
        const arrow = c.dir === 'out' ? '→' : '←';
        const typeTxt = (c.edge.type || '').replace(/_/g, ' ').toLowerCase() + (c.count > 1 ? ` ×${c.count}` : '');
        html += `<div class="tx-conn${here ? ' tx-conn-here' : ''}" data-id="${esc(c.oid)}" data-label="${esc(lbl.toLowerCase())}" title="${esc(c.edge.label || c.edge.note || lbl)}">
          <span class="tx-conn-dir tx-${c.dir}">${arrow}</span>
          <span class="tx-conn-type">${esc(typeTxt)}</span>
          <span class="tx-conn-label">${esc(lbl)}</span>
          <span class="tx-conn-deg">${deg(c.oid)}</span>
        </div>`;
      }
      html += `</div>`;
    }

    elPanel.innerHTML = html;
    elPanel.hidden = false;

    elPanel.querySelector('#tx-panel-close').onclick = hidePanel;
    elPanel.querySelectorAll('.tx-btn').forEach(btn => {
      btn.onclick = () => {
        const act = btn.dataset.act;
        if (act === 'expand')   { expanded.add(id); renderEgo(); showPanel(id); }
        if (act === 'collapse') { expanded.delete(id); renderEgo(); showPanel(id); }
        if (act === 'focus')    { reseed(id); }
        if (act === 'enter')    { enterScope(n._scopeKey); }
      };
    });

    // Clicking a connection pins it into the graph and dives onto it.
    elPanel.querySelectorAll('.tx-conn').forEach(row => {
      row.onclick = () => {
        const oid = row.dataset.id;
        if (!expanded.has(id)) pinned.add(id); // keep the source visible too
        pinned.add(oid);
        selectedId = oid;
        renderEgo();
        showPanel(oid);
      };
    });

    const cf = elPanel.querySelector('#tx-conn-filter');
    if (cf) {
      cf.oninput = () => {
        const q = cf.value.trim().toLowerCase();
        elPanel.querySelectorAll('.tx-conn').forEach(row => {
          row.style.display = !q || row.dataset.label.includes(q) ? '' : 'none';
        });
      };
    }
  }

  // Deduped neighbor list for a node, sorted by neighbor connectivity.
  function connectionsOf(id) {
    const byOther = new Map();
    for (const { edge, otherId } of (adjacency.get(id) || [])) {
      if (otherId === id || !nodeById.has(otherId)) continue;
      const dir = edge.source === id ? 'out' : 'in';
      const ex = byOther.get(otherId);
      if (!ex) byOther.set(otherId, { oid: otherId, edge, dir, count: 1 });
      else ex.count++;
    }
    const out = [...byOther.values()];
    out.sort((a, b) => deg(b.oid) - deg(a.oid));
    return out;
  }

  function hidePanel() { elPanel.hidden = true; selectedId = null; }

  // ── Chrome (top bar) ─────────────────────────────────────────────────────────
  function updateChrome() {
    if (mode === 'constellation') {
      elBack.hidden = true;
      elCrumb.textContent = 'World';
      elHint.textContent = 'Click a scope to dive in.';
      return;
    }
    elBack.hidden = false;
    const scopeLabel = currentScope === 'mechanisms'
      ? 'Cross-scope mechanisms'
      : (scopeMeta[currentScope] ? scopeMeta[currentScope].label : currentScope);
    const isOverview = expanded.size === 0;
    const sel = selectedId && nodeById.get(selectedId);
    let crumb = `World › ${scopeLabel}`;
    if (isOverview) crumb += ' › overview';
    else if (sel) crumb += ` › ${sel.label || sel.id}`;
    elCrumb.textContent = crumb;
    elHint.textContent = isOverview
      ? 'Scope overview — click a node (graph or list) to dive into its connections.'
      : 'Click a node to expand · click an open node to collapse · “Focus here” to recenter.';
  }

  // ── Scope sidebar (full node list for the current scope) ─────────────────────
  function renderScopeList() {
    if (!elSidebar || mode === 'constellation') return;

    const scopeLabel = currentScope === 'mechanisms'
      ? 'Cross-scope mechanisms'
      : (scopeMeta[currentScope] ? scopeMeta[currentScope].label : currentScope);
    elScopeTitle.textContent = scopeLabel;

    const all = nodesInScope(currentScope);
    elScopeCount.textContent = `${all.length} nodes`;

    const q = (elScopeFilter.value || '').trim().toLowerCase();
    let list = all;
    if (q) list = all.filter(n => (n.label || n.id).toLowerCase().includes(q));
    const shown = list.slice(0, SIDEBAR_CAP);

    let html = shown.map(n => {
      const active = n.id === selectedId;
      const open = expanded.has(n.id);
      return `<div class="tx-li${active ? ' tx-li-active' : ''}" data-id="${esc(n.id)}">
        <span class="tx-li-dot${open ? ' on' : ''}"></span>
        <span class="tx-li-label">${esc(n.label || n.id)}</span>
        <span class="tx-li-deg">${deg(n.id)}</span>
      </div>`;
    }).join('');

    if (list.length > SIDEBAR_CAP) {
      html += `<div class="tx-li-more">+${list.length - SIDEBAR_CAP} more — refine the filter…</div>`;
    }
    if (!shown.length) {
      html = `<div class="tx-li-more">No matches.</div>`;
    }
    elScopeList.innerHTML = html;

    elScopeList.querySelectorAll('.tx-li').forEach(row => {
      row.onclick = () => reseed(row.dataset.id);
    });
  }

  // ── Search ───────────────────────────────────────────────────────────────────
  function onSearchInput() {
    const q = elSearch.value.trim();
    if (!q) { elResults.hidden = true; elResults.innerHTML = ''; return; }
    const hits = fuse.search(q, { limit: 8 });
    if (!hits.length) { elResults.hidden = true; return; }
    elResults.innerHTML = hits.map(h => {
      const n = h.item;
      const sk = n._scopeKey === 'mechanisms' ? 'mechanism' : (scopeMeta[n._scopeKey] && scopeMeta[n._scopeKey].label) || '';
      return `<div class="tx-result" data-id="${esc(n.id)}">
        <span class="tx-result-label">${esc(n.label || n.id)}</span>
        <span class="tx-result-scope">${esc(sk)}</span>
      </div>`;
    }).join('');
    elResults.hidden = false;
    elResults.querySelectorAll('.tx-result').forEach(r => {
      r.onclick = () => {
        elResults.hidden = true;
        elSearch.value = '';
        reseed(r.dataset.id);
      };
    });
  }

  // ── 3D label sprites ─────────────────────────────────────────────────────────
  const spriteCache = new Map();
  function makeTextSprite(text, color) {
    const key = `${text}|${color}`;
    if (spriteCache.has(key)) return spriteCache.get(key).clone();

    const pad = 8, font = 26;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `600 ${font}px -apple-system, Segoe UI, sans-serif`;
    const w = ctx.measureText(text).width;
    canvas.width  = Math.ceil(w + pad * 2);
    canvas.height = font + pad * 2;

    ctx.font = `600 ${font}px -apple-system, Segoe UI, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(15,17,26,0.72)';
    roundRect(ctx, 0, 0, canvas.width, canvas.height, 7);
    ctx.fill();
    ctx.fillStyle = color || '#fff';
    ctx.fillText(text, pad, canvas.height / 2 + 1);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: tex, depthWrite: false, transparent: true });
    const sprite = new THREE.Sprite(mat);
    const scale = 0.12;
    sprite.scale.set(canvas.width * scale, canvas.height * scale, 1);
    spriteCache.set(key, sprite);
    return sprite.clone();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ── Node visual accessors ────────────────────────────────────────────────────
  function nodeColor(node) {
    if (node._scopeNode) return SCOPE_COLORS[node._scopeKey] || '#888';
    if (mode === 'ego' && node._scopeKey !== currentScope && node._scopeKey !== 'mechanisms') {
      return CROSS_SCOPE_TINT;
    }
    return CATEGORY_COLORS[node.category] || CATEGORY_COLORS[node.node_type] || '#9aa';
  }

  function nodeVal(node) {
    if (node._scopeNode) return 24 + (node.count || 0) / 20;
    const base = expanded.has(node.id) ? 6 : 2;
    return base + Math.min(deg(node.id) / 6, 10);
  }

  function nodeThreeObject(node) {
    const color = nodeColor(node);
    let text;
    if (node._scopeNode) {
      text = `${node.label}  (${node.count})`;
    } else {
      const more = moreById.get(node.id) || 0;
      text = (node.label || node.id) + (more > 0 ? `  +${more}` : '');
    }
    const sprite = makeTextSprite(text, expanded.has(node.id) ? '#fff' : color);
    // offset label above node
    const r = node._scopeNode ? 10 : 5;
    sprite.position.set(0, r, 0);
    return sprite;
  }

  function nodeLabel(node) {
    if (node._scopeNode) return `<b>${esc(node.label)}</b><br>${node.count} nodes`;
    const sk = node._scopeKey === 'mechanisms' ? 'mechanism' : (scopeMeta[node._scopeKey] && scopeMeta[node._scopeKey].label) || '';
    let s = `<b>${esc(node.label || node.id)}</b><br><i>${esc(node.category || '')}</i> · ${esc(sk)}`;
    if (node.summary) s += `<br><span style="opacity:.8">${esc(node.summary.slice(0, 140))}${node.summary.length > 140 ? '…' : ''}</span>`;
    return s;
  }

  function linkColor(link) { return EDGE_COLORS[link.type] || EDGE_COLOR_DEFAULT; }
  function linkLabel(link) { return link.type ? link.type.replace(/_/g, ' ') : ''; }

  // ── Init ─────────────────────────────────────────────────────────────────────
  async function init() {
    elBack       = document.getElementById('tx-back');
    elCrumb      = document.getElementById('tx-crumb');
    elSearch     = document.getElementById('tx-search');
    elResults    = document.getElementById('tx-results');
    elHint       = document.getElementById('tx-hint');
    elPanel      = document.getElementById('tx-panel');
    elSidebar    = document.getElementById('tx-sidebar');
    elScopeTitle = document.getElementById('tx-scope-title');
    elScopeCount = document.getElementById('tx-scope-count');
    elScopeFilter= document.getElementById('tx-scope-filter');
    elScopeList  = document.getElementById('tx-scope-list');
    elOverviewBtn= document.getElementById('tx-overview-btn');

    elBack.onclick      = renderConstellation;
    elSearch.oninput    = onSearchInput;
    elScopeFilter.oninput = renderScopeList;
    elOverviewBtn.onclick = () => { if (currentScope) enterScope(currentScope); };
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { elResults.hidden = true; hidePanel(); }
    });

    const loadingEl = document.getElementById('tx-loading');
    await loadAll();
    if (loadingEl) loadingEl.remove();

    Graph = ForceGraph3D()(document.getElementById('tx-graph'))
      .backgroundColor('#0b0d14')
      .nodeRelSize(2)
      .nodeColor(nodeColor)
      .nodeVal(nodeVal)
      .nodeLabel(nodeLabel)
      .nodeThreeObjectExtend(true)
      .nodeThreeObject(nodeThreeObject)
      .linkColor(linkColor)
      .linkLabel(linkLabel)
      .linkWidth(0.6)
      .linkOpacity(0.5)
      .linkDirectionalArrowLength(2.5)
      .linkDirectionalArrowRelPos(0.92)
      .onNodeClick(onNodeClick)
      .onBackgroundClick(hidePanel);

    Graph.renderer().setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // A touch more repulsion so small ego-graphs breathe
    const charge = Graph.d3Force('charge');
    if (charge) charge.strength(-160);

    window.addEventListener('resize', () => {
      Graph.width(window.innerWidth).height(window.innerHeight);
    });
    Graph.width(window.innerWidth).height(window.innerHeight);

    renderConstellation();
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
