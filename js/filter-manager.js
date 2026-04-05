'use strict';

// ── filter-manager.js
// Filter pipeline for the 3D graph. Adapts filter logic for 3d-force-graph APIs.
// Depends on: GraphRenderer (window.GraphRenderer)

(function () {
  // ── Filter state ───────────────────────────────────────────────────────────
  const EDGE_TYPE_MAIN  = ['CAUSED', 'ENABLED', 'SHARES_MECHANISM_WITH', 'SELF_REINFORCES'];
  const EDGE_TYPE_OTHER = ['COLONIZED', 'DISCREDITED', 'EXPLOITED', 'FORCED_INTO',
                           'FRAGMENTED_INTO', 'NORMALIZED', 'PRODUCED', 'PROVIDED_COVER_FOR'];
  const EDGE_FILTER_GROUPS = [...EDGE_TYPE_MAIN, ...EDGE_TYPE_OTHER, 'speculative'];

  let enabledNodeCategories = new Set();
  let enabledEdgeFilters    = new Set(EDGE_FILTER_GROUPS);
  let minConnectivity       = 0;
  let allCategories         = new Set();

  // Region filter
  let enabledRegions = new Set();
  let allRegions     = new Set();

  // Tags filter (chip-based, OR logic)
  const activeTags = new Set();

  // Decade / year range filter (null = no constraint on that bound)
  let decadeMinYear = null;
  let decadeMaxYear = null;
  let dataMinYear   = null;
  let dataMaxYear   = null;

  // Neighborhood state (set by app.js)
  let selectedNodeId   = null;
  let neighborhoodDepth = 1;
  let edgeMap = {};   // nodeId → [connectedNodeIds]

  // One-time init flags (listeners must not be added more than once)
  let _controlsInited = false;

  // ── Decade helpers ─────────────────────────────────────────────────────────
  function parseDecadeYear(decade) {
    if (!decade) return 2000;
    decade = String(decade);
    const bce = /bce/i.test(decade);
    const m = decade.match(/(\d+)/);
    if (m) { const y = parseInt(m[1], 10); return bce ? -y : y; }
    if (/ancient|classical/i.test(decade)) return 400;
    if (/medieval/i.test(decade)) return 1200;
    return 2000;
  }

  function updateDecadeDisplay() {
    const display = document.getElementById('sb-decade-display');
    if (!display) return;
    if (decadeMinYear === null && decadeMaxYear === null) {
      display.textContent = 'All time';
      return;
    }
    const minY = decadeMinYear !== null ? decadeMinYear : dataMinYear;
    const maxY = decadeMaxYear !== null ? decadeMaxYear : dataMaxYear;
    const fmt  = y => y < 0 ? `${Math.abs(y)} BCE` : String(y);
    display.textContent = `${fmt(minY)} – ${fmt(maxY)}`;
  }

  function buildDecadeFilter(nodes) {
    const years = nodes
      .filter(n => n.category !== 'portal' && !n.cross_scope && n.decade)
      .map(n => parseDecadeYear(n.decade));

    const section = document.getElementById('sb-decade-section');
    if (!years.length) {
      if (section) section.hidden = true;
      return;
    }

    dataMinYear   = Math.min(...years);
    dataMaxYear   = Math.max(...years);
    decadeMinYear = null;
    decadeMaxYear = null;

    const minSlider = document.getElementById('sb-decade-min');
    const maxSlider = document.getElementById('sb-decade-max');
    if (minSlider) { minSlider.min = dataMinYear; minSlider.max = dataMaxYear; minSlider.value = dataMinYear; }
    if (maxSlider) { maxSlider.min = dataMinYear; maxSlider.max = dataMaxYear; maxSlider.value = dataMaxYear; }
    updateDecadeDisplay();
    if (section) section.hidden = false;
  }

  function initDecadeSliders() {
    const minSlider = document.getElementById('sb-decade-min');
    const maxSlider = document.getElementById('sb-decade-max');
    if (!minSlider || !maxSlider) return;

    minSlider.addEventListener('input', () => {
      if (parseInt(minSlider.value, 10) > parseInt(maxSlider.value, 10)) {
        minSlider.value = maxSlider.value;
      }
      const val = parseInt(minSlider.value, 10);
      decadeMinYear = (val === dataMinYear) ? null : val;
      updateDecadeDisplay();
      applyFilters();
    });

    maxSlider.addEventListener('input', () => {
      if (parseInt(maxSlider.value, 10) < parseInt(minSlider.value, 10)) {
        maxSlider.value = minSlider.value;
      }
      const val = parseInt(maxSlider.value, 10);
      decadeMaxYear = (val === dataMaxYear) ? null : val;
      updateDecadeDisplay();
      applyFilters();
    });
  }

  // ── Build sidebar filter UI ────────────────────────────────────────────────
  function buildFilters(nodes, edges) {
    // Build edge adjacency map for neighborhood dimming
    rebuildEdgeMap(edges);

    buildNodeTypeFilters(nodes);
    buildEdgeTypeFilters();
    buildRegionFilter(nodes);
    buildTagFilter(nodes);
    buildDecadeFilter(nodes);
    updateConnectivitySliderMax(nodes);   // update max only (no listener re-add)

    // Attach slider + reset listeners exactly once
    if (!_controlsInited) {
      initConnectivitySlider();
      initDecadeSliders();
      initResetButton();
      _controlsInited = true;
    }

    // Apply current filter state to the newly-loaded data so the link visibility
    // closure captures this scope's node IDs immediately (not stale from before load).
    applyFilters();
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
      'COLONIZED':            'COLONIZED',
      'DISCREDITED':          'DISCREDITED',
      'EXPLOITED':            'EXPLOITED',
      'FORCED_INTO':          'FORCED INTO',
      'FRAGMENTED_INTO':      'FRAGMENTED INTO',
      'NORMALIZED':           'NORMALIZED',
      'PRODUCED':             'PRODUCED',
      'PROVIDED_COVER_FOR':   'PROVIDED COVER FOR',
      'speculative':          'Speculative edges',
    };

    const container = document.getElementById('sb-edge-types');
    if (!container) return;
    container.innerHTML = '';

    function makeRow(type, indented) {
      const isSpec   = type === 'speculative';
      const color    = GraphRenderer.EDGE_COLOR[type] || GraphRenderer.EDGE_DEFAULT_COLOR;
      const dotClass = isSpec ? 'sb-dot dashed-line' : 'sb-dot line';
      const dotStyle = isSpec ? '' : `style="background:${color}"`;
      const row = document.createElement('label');
      row.className = 'sb-check-row' + (indented ? ' sb-check-indented' : '');
      row.innerHTML = `
        <input type="checkbox" class="sb-checkbox" data-edge-filter="${escHtml(type)}" checked>
        <span class="${dotClass}" ${dotStyle}></span>
        <span class="sb-check-label">${escHtml(labels[type])}</span>
      `;
      row.querySelector('input').addEventListener('change', e => {
        if (e.target.checked) enabledEdgeFilters.add(type);
        else enabledEdgeFilters.delete(type);
        applyFilters();
      });
      return row;
    }

    // Main types
    EDGE_TYPE_MAIN.forEach(t => container.appendChild(makeRow(t, false)));

    // Collapsible "Other types" sub-group
    const groupHeader = document.createElement('div');
    groupHeader.className = 'sb-group-toggle';
    groupHeader.innerHTML = `<span class="sb-group-arrow">▶</span><span>Other types</span>`;
    container.appendChild(groupHeader);

    const groupItems = document.createElement('div');
    groupItems.className = 'sb-group-items';
    groupItems.hidden = true;
    EDGE_TYPE_OTHER.forEach(t => groupItems.appendChild(makeRow(t, true)));
    container.appendChild(groupItems);

    groupHeader.addEventListener('click', () => {
      const collapsed = groupItems.hidden;
      groupItems.hidden = !collapsed;
      groupHeader.querySelector('.sb-group-arrow').textContent = collapsed ? '▼' : '▶';
    });

    // Speculative at the bottom
    container.appendChild(makeRow('speculative', false));
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

  function buildTagFilter(nodes) {
    const section = document.getElementById('sb-tags-section');
    const container = document.getElementById('sb-tags-list');
    if (!container) return;

    // Count tag frequencies across all non-portal nodes
    const tagCounts = {};
    for (const n of nodes) {
      if (n.category === 'portal') continue;
      for (const t of (n.tags || [])) {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      }
    }

    const tags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 20);

    activeTags.clear();
    container.innerHTML = '';

    if (!tags.length) {
      if (section) section.hidden = true;
      return;
    }

    if (section) section.hidden = false;

    tags.forEach(tag => {
      const chip = document.createElement('button');
      chip.className = 'sb-tag-chip';
      chip.dataset.tag = tag;
      chip.textContent = `${escHtml(tag)} (${tagCounts[tag]})`;
      chip.addEventListener('click', () => {
        if (activeTags.has(tag)) {
          activeTags.delete(tag);
          chip.classList.remove('active');
        } else {
          activeTags.add(tag);
          chip.classList.add('active');
        }
        applyFilters();
      });
      container.appendChild(chip);
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

  // ── Is any explicit filter active? ───────────────────────────────────────
  // Used to decide whether semantic zoom should control visibility.
  function isAnyFilterActive() {
    if (!allCategories.size) return false;
    return selectedNodeId !== null ||
      minConnectivity > 0 ||
      enabledNodeCategories.size < allCategories.size ||
      enabledEdgeFilters.size < EDGE_FILTER_GROUPS.length ||
      (allRegions.size > 0 && enabledRegions.size < allRegions.size) ||
      decadeMinYear !== null || decadeMaxYear !== null ||
      activeTags.size > 0;
  }

  // ── Apply combined filters ────────────────────────────────────────────────
  function applyFilters() {
    const GR = GraphRenderer;
    if (!GR || !GR.getGraphInstance()) return;

    const data = GR.getCurrentData();
    // Skip if no data is loaded yet — avoids setting a stale link-visibility
    // closure that would capture an empty visibleNodeIds Set.
    if (!data || data.nodes.length === 0) return;

    // Compute visible node set (under explicit filters)
    const visibleNodeIds = new Set();
    for (const n of data.nodes) {
      if (n.category === 'portal') { visibleNodeIds.add(n.id); continue; }
      if (!enabledNodeCategories.has(n.category)) continue;
      if (allRegions.size > 0 && enabledRegions.size < allRegions.size) {
        if (n.region && !enabledRegions.has(n.region)) continue;
      }
      if (minConnectivity > 0 && (n.__degree || 0) < minConnectivity) continue;
      // Decade range filter — cross-scope mechanism nodes are exempt
      if ((decadeMinYear !== null || decadeMaxYear !== null) && !n.cross_scope) {
        const year = parseDecadeYear(n.decade || '');
        const minY = decadeMinYear !== null ? decadeMinYear : -Infinity;
        const maxY = decadeMaxYear !== null ? decadeMaxYear :  Infinity;
        if (year < minY || year > maxY) continue;
      }
      // Tags filter (OR logic — node must have at least one active tag)
      if (activeTags.size > 0 && !(n.tags || []).some(t => activeTags.has(t))) continue;
      visibleNodeIds.add(n.id);
    }

    const anyActive = isAnyFilterActive();

    // Semantic zoom: hand off visibility control to camera-distance LOD
    // when no explicit filter is active. The setSemanticZoom call also
    // immediately applies the current camera distance.
    GR.setSemanticZoom(!anyActive);

    if (selectedNodeId) {
      // Neighborhood mode: restrict node visibility to the neighborhood, then let
      // GR.refreshOpacity() own link visibility so it exactly matches hover behaviour.
      const neighbors = GR.getNeighborIds(selectedNodeId, neighborhoodDepth, {}, edgeMap);
      GR.dimToNeighborhood(selectedNodeId, neighborhoodDepth, {}, edgeMap);
      GR.setNodeVisibility(n => {
        if (n.category === 'portal') return true;
        return visibleNodeIds.has(n.id) && neighbors.has(n.id);
      });
      // refreshOpacity re-applies the correct link visibility (only edges from the
      // selected node) and node opacity, overriding dimToNeighborhood's broader set.
      GR.refreshOpacity();
    } else if (anyActive) {
      // Explicit filter mode: show only nodes passing the filter
      GR.setNodeVisibility(n => visibleNodeIds.has(n.id));
      GR.setLinkVisibility(link => {
        if (!edgePassesFilter(link)) return false;
        const s = typeof link.source === 'object' ? link.source.id : link.source;
        const t = typeof link.target === 'object' ? link.target.id : link.target;
        return visibleNodeIds.has(s) && visibleNodeIds.has(t);
      });
    } else {
      // No filters active: show all nodes and edges
      GR.setNodeVisibility(true);
      GR.setLinkVisibility(link => {
        if (!edgePassesFilter(link)) return false;
        const s = typeof link.source === 'object' ? link.source.id : link.source;
        const t = typeof link.target === 'object' ? link.target.id : link.target;
        return visibleNodeIds.has(s) && visibleNodeIds.has(t);
      });
    }

    updateNodeTypeCounts(data.nodes, visibleNodeIds);
    updateStats(visibleNodeIds.size, data.nodes.length);
  }

  function edgePassesFilter(link) {
    const type       = link.type;
    const confidence = link.confidence;
    if (!enabledEdgeFilters.has('speculative') && confidence === 'speculative') return false;
    if (!enabledEdgeFilters.has(type)) return false;
    return true;
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
    activeTags.clear();
    document.querySelectorAll('.sb-tag-chip').forEach(chip => chip.classList.remove('active'));

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

    decadeMinYear = null;
    decadeMaxYear = null;
    const minSlider = document.getElementById('sb-decade-min');
    const maxSlider = document.getElementById('sb-decade-max');
    if (minSlider && dataMinYear !== null) minSlider.value = dataMinYear;
    if (maxSlider && dataMaxYear !== null) maxSlider.value = dataMaxYear;
    updateDecadeDisplay();

    const nbSection = document.getElementById('sb-neighborhood');
    if (nbSection) nbSection.hidden = true;

    GraphRenderer.resetVisibility();
    applyFilters();
  }

  // ── URL state helpers ─────────────────────────────────────────────────────
  function getFilterState() {
    return {
      cats:   [...enabledNodeCategories].join(','),
      edges:  [...enabledEdgeFilters].join(','),
      conn:   minConnectivity,
      dep:    neighborhoodDepth,
      decMin: decadeMinYear,
      decMax: decadeMaxYear,
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
    if (state.decMin !== null && state.decMin !== undefined) {
      const val = parseInt(state.decMin, 10);
      if (!isNaN(val)) {
        decadeMinYear = val;
        const minSlider = document.getElementById('sb-decade-min');
        if (minSlider) minSlider.value = val;
      }
    }
    if (state.decMax !== null && state.decMax !== undefined) {
      const val = parseInt(state.decMax, 10);
      if (!isNaN(val)) {
        decadeMaxYear = val;
        const maxSlider = document.getElementById('sb-decade-max');
        if (maxSlider) maxSlider.value = val;
      }
    }
    updateDecadeDisplay();
    applyFilters();
  }

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Set decade range programmatically (used by Timeline "Open in Graph") ────
  function setDecadeRange(minYear, maxYear) {
    decadeMinYear = minYear;
    decadeMaxYear = maxYear;
    const minSlider = document.getElementById('sb-decade-min');
    const maxSlider = document.getElementById('sb-decade-max');
    if (minSlider) minSlider.value = minYear;
    if (maxSlider) maxSlider.value = maxYear;
    updateDecadeDisplay();
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
    setDecadeRange,
    getFilterState,
    applyFilterState,
    get selectedNodeId() { return selectedNodeId; },
    get neighborhoodDepth() { return neighborhoodDepth; },
    EDGE_FILTER_GROUPS,
  };
})();
