'use strict';

// ── filter-manager.js
// Filter pipeline for the 3D graph. Adapts filter logic for 3d-force-graph APIs.
// Depends on: GraphRenderer (window.GraphRenderer)

(function () {
  // ── Filter state ───────────────────────────────────────────────────────────
  const EDGE_FILTER_GROUPS = ['CAUSED', 'ENABLED', 'SHARES_MECHANISM_WITH', 'SELF_REINFORCES', 'other', 'speculative'];
  const EDGE_FILTER_MAIN   = new Set(['CAUSED', 'ENABLED', 'SHARES_MECHANISM_WITH', 'SELF_REINFORCES']);

  let enabledNodeCategories = new Set();
  let enabledEdgeFilters    = new Set(EDGE_FILTER_GROUPS);
  let minConnectivity       = 0;
  let allCategories         = new Set();

  // Region filter
  let enabledRegions = new Set();
  let allRegions     = new Set();

  // Neighborhood state (set by app.js)
  let selectedNodeId   = null;
  let neighborhoodDepth = 1;
  let edgeMap = {};   // nodeId → [connectedNodeIds]

  // One-time init flags (listeners must not be added more than once)
  let _controlsInited = false;

  // ── Build sidebar filter UI ────────────────────────────────────────────────
  function buildFilters(nodes, edges) {
    // Build edge adjacency map for neighborhood dimming
    rebuildEdgeMap(edges);

    buildNodeTypeFilters(nodes);
    buildEdgeTypeFilters();
    buildRegionFilter(nodes);
    updateConnectivitySliderMax(nodes);   // update max only (no listener re-add)

    // Attach slider + reset listeners exactly once
    if (!_controlsInited) {
      initConnectivitySlider();
      initResetButton();
      _controlsInited = true;
    }
  }

  function rebuildEdgeMap(edges) {
    edgeMap = {};
    for (const e of edges) {
      const s = typeof e.source === 'object' ? e.source.id : e.source;
      const t = typeof e.target === 'object' ? e.target.id : e.target;
      if (!edgeMap[s]) edgeMap[s] = [];
      if (!edgeMap[t]) edgeMap[t] = [];
      edgeMap[s].push(t);
      edgeMap[t].push(s);
    }
  }

  function buildNodeTypeFilters(nodes) {
    const cats = [...new Set(nodes.map(n => n.category).filter(c => c !== 'portal'))].sort();
    enabledNodeCategories = new Set(cats);
    allCategories = new Set(cats);

    const container = document.getElementById('sb-node-types');
    if (!container) return;
    container.innerHTML = '';

    cats.forEach(cat => {
      const color = GraphRenderer.CATEGORY_COLOR[cat] || '#8c8fa8';
      const total = nodes.filter(n => n.category === cat).length;
      const label = cat.charAt(0).toUpperCase() + cat.slice(1);
      const row = document.createElement('label');
      row.className = 'sb-check-row';
      row.innerHTML = `
        <input type="checkbox" class="sb-checkbox" data-category="${escHtml(cat)}" checked>
        <span class="sb-dot" style="background:${color}"></span>
        <span class="sb-check-label">${escHtml(label)}</span>
        <span class="sb-check-count" id="sb-cat-count-${escHtml(cat)}">${total}/${total}</span>
      `;
      row.querySelector('input').addEventListener('change', e => {
        if (e.target.checked) enabledNodeCategories.add(cat);
        else enabledNodeCategories.delete(cat);
        applyFilters();
      });
      container.appendChild(row);
    });
  }

  function buildEdgeTypeFilters() {
    const labels = {
      'CAUSED':               'CAUSED',
      'ENABLED':              'ENABLED',
      'SHARES_MECHANISM_WITH':'SHARES MECHANISM WITH',
      'SELF_REINFORCES':      'SELF REINFORCES',
      'other':                'Other types',
      'speculative':          'Speculative edges',
    };
    const container = document.getElementById('sb-edge-types');
    if (!container) return;
    container.innerHTML = '';

    EDGE_FILTER_GROUPS.forEach(group => {
      const isSpec  = group === 'speculative';
      const color   = GraphRenderer.EDGE_COLOR[group] || GraphRenderer.EDGE_DEFAULT_COLOR;
      const dotClass = isSpec ? 'sb-dot dashed-line' : 'sb-dot line';
      const dotStyle = isSpec ? '' : `style="background:${color}"`;
      const row = document.createElement('label');
      row.className = 'sb-check-row';
      row.innerHTML = `
        <input type="checkbox" class="sb-checkbox" data-edge-filter="${escHtml(group)}" checked>
        <span class="${dotClass}" ${dotStyle}></span>
        <span class="sb-check-label">${escHtml(labels[group])}</span>
      `;
      row.querySelector('input').addEventListener('change', e => {
        if (e.target.checked) enabledEdgeFilters.add(group);
        else enabledEdgeFilters.delete(group);
        applyFilters();
      });
      container.appendChild(row);
    });
  }

  function buildRegionFilter(nodes) {
    const regions = [...new Set(nodes.map(n => n.region).filter(Boolean))].sort();
    if (!regions.length) return;

    allRegions = new Set(regions);
    enabledRegions = new Set(regions);

    const section = document.getElementById('sb-region-section');
    if (section) section.hidden = false;

    const container = document.getElementById('sb-regions');
    if (!container) return;
    container.innerHTML = '';

    regions.forEach(region => {
      const total = nodes.filter(n => n.region === region).length;
      const row = document.createElement('label');
      row.className = 'sb-check-row';
      row.innerHTML = `
        <input type="checkbox" class="sb-checkbox" data-region="${escHtml(region)}" checked>
        <span class="sb-check-label">${escHtml(region)}</span>
        <span class="sb-check-count">${total}</span>
      `;
      row.querySelector('input').addEventListener('change', e => {
        if (e.target.checked) enabledRegions.add(region);
        else enabledRegions.delete(region);
        applyFilters();
      });
      container.appendChild(row);
    });
  }

  // Update only the slider's max value (called on every scope change)
  function updateConnectivitySliderMax(nodes) {
    const slider = document.getElementById('sb-conn-slider');
    if (!slider) return;
    const maxDeg = nodes.reduce((m, n) => Math.max(m, n.__degree || 0), 0);
    slider.max = Math.max(1, Math.min(maxDeg, 60));
  }

  // Attach the input listener once
  function initConnectivitySlider() {
    const slider  = document.getElementById('sb-conn-slider');
    const display = document.getElementById('sb-conn-display');
    if (!slider) return;
    slider.addEventListener('input', () => {
      minConnectivity = parseInt(slider.value, 10);
      if (display) display.textContent = `≥ ${minConnectivity}`;
      applyFilters();
    });
  }

  function initResetButton() {
    const btn = document.getElementById('sb-reset');
    if (btn) btn.addEventListener('click', resetAll);
  }

  // ── Apply combined filters ────────────────────────────────────────────────
  function applyFilters() {
    const GR = GraphRenderer;
    if (!GR || !GR.getGraphInstance()) return;

    const data = GR.getCurrentData();

    // Compute visible node set
    const visibleNodeIds = new Set();
    for (const n of data.nodes) {
      if (n.category === 'portal') { visibleNodeIds.add(n.id); continue; }
      if (!enabledNodeCategories.has(n.category)) continue;
      if (allRegions.size > 0 && enabledRegions.size < allRegions.size) {
        if (n.region && !enabledRegions.has(n.region)) continue;
      }
      if (minConnectivity > 0 && (n.__degree || 0) < minConnectivity) continue;
      visibleNodeIds.add(n.id);
    }

    // Neighborhood dimming overrides visibility
    if (selectedNodeId) {
      const neighbors = GR.getNeighborIds(selectedNodeId, neighborhoodDepth, {}, edgeMap);
      GR.dimToNeighborhood(selectedNodeId, neighborhoodDepth, {}, edgeMap);

      // Also restrict visibility to neighborhood ∩ visible
      GR.setNodeVisibility(n => {
        if (n.category === 'portal') return true;
        return visibleNodeIds.has(n.id) && neighbors.has(n.id);
      });
    } else {
      GR.setNodeVisibility(n => visibleNodeIds.has(n.id));
      // Note: do NOT call GR.resetVisibility() here — it calls nodeVisibility(true)
      // which would override the setNodeVisibility filter we just applied above.
    }

    // Edge visibility
    GR.setLinkVisibility(link => {
      if (!edgePassesFilter(link)) return false;
      const s = typeof link.source === 'object' ? link.source.id : link.source;
      const t = typeof link.target === 'object' ? link.target.id : link.target;
      return visibleNodeIds.has(s) && visibleNodeIds.has(t);
    });

    updateNodeTypeCounts(data.nodes, visibleNodeIds);
    updateStats(visibleNodeIds.size, data.nodes.length);
  }

  function edgePassesFilter(link) {
    const type       = link.type;
    const confidence = link.confidence;
    if (!enabledEdgeFilters.has('speculative') && confidence === 'speculative') return false;
    if (EDGE_FILTER_MAIN.has(type)) return enabledEdgeFilters.has(type);
    return enabledEdgeFilters.has('other');
  }

  // ── Node count display ─────────────────────────────────────────────────────
  function updateNodeTypeCounts(nodes, visibleNodeIds) {
    const totals  = {};
    const visible = {};
    for (const n of nodes) {
      if (n.category === 'portal') continue;
      totals[n.category]  = (totals[n.category]  || 0) + 1;
      if (visibleNodeIds.has(n.id)) visible[n.category] = (visible[n.category] || 0) + 1;
    }
    for (const cat of Object.keys(totals)) {
      const el = document.getElementById(`sb-cat-count-${cat}`);
      if (el) el.textContent = `${visible[cat] || 0}/${totals[cat]}`;
    }
  }

  function updateStats(visCount, totalCount) {
    const el = document.getElementById('stats');
    if (!el) return;
    const data = GraphRenderer.getCurrentData();
    const totalEdges = (data.links || []).length;
    if (visCount !== totalCount) {
      el.innerHTML = `<div>${visCount}/${totalCount} nodes · ${totalEdges} edges</div>`;
    } else {
      el.innerHTML = `<div>${totalCount} nodes · ${totalEdges} edges</div>`;
    }
  }

  // ── Neighborhood API ───────────────────────────────────────────────────────
  function setNeighborhoodRoot(nodeId, depth) {
    selectedNodeId    = nodeId;
    neighborhoodDepth = depth || 1;
    applyFilters();
  }

  function clearNeighborhoodRoot() {
    selectedNodeId = null;
    applyFilters();
  }

  function setNeighborhoodDepth(depth) {
    neighborhoodDepth = depth;
    if (selectedNodeId) applyFilters();
  }

  // ── Reset all ──────────────────────────────────────────────────────────────
  function resetAll() {
    enabledNodeCategories = new Set(allCategories);
    enabledEdgeFilters    = new Set(EDGE_FILTER_GROUPS);
    enabledRegions        = new Set(allRegions);
    minConnectivity       = 0;
    selectedNodeId        = null;
    neighborhoodDepth     = 1;

    document.querySelectorAll('[data-category]').forEach(cb => { cb.checked = true; });
    document.querySelectorAll('[data-edge-filter]').forEach(cb => { cb.checked = true; });
    document.querySelectorAll('[data-region]').forEach(cb => { cb.checked = true; });
    document.querySelectorAll('.sb-depth-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.depth === '1');
    });

    const slider  = document.getElementById('sb-conn-slider');
    const display = document.getElementById('sb-conn-display');
    if (slider)  slider.value = 0;
    if (display) display.textContent = '≥ 0';

    const nbSection = document.getElementById('sb-neighborhood');
    if (nbSection) nbSection.hidden = true;

    GraphRenderer.resetVisibility();
    applyFilters();
  }

  // ── URL state helpers ─────────────────────────────────────────────────────
  function getFilterState() {
    return {
      cats: [...enabledNodeCategories].join(','),
      edges: [...enabledEdgeFilters].join(','),
      conn: minConnectivity,
      dep: neighborhoodDepth,
    };
  }

  function applyFilterState(state) {
    if (state.cats) {
      enabledNodeCategories = new Set(state.cats.split(',').filter(Boolean));
      document.querySelectorAll('[data-category]').forEach(cb => {
        cb.checked = enabledNodeCategories.has(cb.dataset.category);
      });
    }
    if (state.edges) {
      enabledEdgeFilters = new Set(state.edges.split(',').filter(Boolean));
      document.querySelectorAll('[data-edge-filter]').forEach(cb => {
        cb.checked = enabledEdgeFilters.has(cb.dataset.edgeFilter);
      });
    }
    if (state.conn !== undefined) {
      minConnectivity = parseInt(state.conn, 10) || 0;
      const slider = document.getElementById('sb-conn-slider');
      const display = document.getElementById('sb-conn-display');
      if (slider) slider.value = minConnectivity;
      if (display) display.textContent = `≥ ${minConnectivity}`;
    }
    if (state.dep !== undefined) {
      neighborhoodDepth = parseInt(state.dep, 10) || 1;
      document.querySelectorAll('.sb-depth-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.depth === String(neighborhoodDepth));
      });
    }
    applyFilters();
  }

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.FilterManager = {
    buildFilters,
    rebuildEdgeMap,
    applyFilters,
    resetAll,
    setNeighborhoodRoot,
    clearNeighborhoodRoot,
    setNeighborhoodDepth,
    getFilterState,
    applyFilterState,
    get selectedNodeId() { return selectedNodeId; },
    get neighborhoodDepth() { return neighborhoodDepth; },
    EDGE_FILTER_GROUPS,
    EDGE_FILTER_MAIN,
  };
})();
