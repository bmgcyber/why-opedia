(function () {
'use strict';

// ── graph-renderer-2d.js
// Cytoscape.js 2D renderer implementing the same window.GR API as graph-renderer.js.
// Depends on: cytoscape (global), cytoscape-fcose (global, auto-registers on load)

// ── Color maps (identical to graph-renderer.js) ─────────────────────────────
const CATEGORY_COLOR = {
  event:       '#5b8dee',
  movement:    '#48bb78',
  ideology:    '#e05252',
  institution: '#e09752',
  mechanism:   '#a96ce6',
  person:      '#f6c90e',
  policy:      '#4ec9c9',
  phenomenon:  '#e07b52',
  product:     '#8c8fa8',
  community:   '#e06b9a',
  portal:      '#ffffff',
};

const EDGE_COLOR = {
  CAUSED:               '#e05252',
  ENABLED:              '#e09752',
  ACCELERATED:          '#f6c90e',
  UNDERMINED:           '#7c6b9e',
  SHARES_MECHANISM_WITH:'#5b8dee',
  SELF_REINFORCES:      '#a96ce6',
  EXPLOITED:            '#e07b52',
  NORMALIZED:           '#48bb78',
  PROVIDED_COVER_FOR:   '#4ec9c9',
  PRODUCED:             '#8dd4a8',
  DISCREDITED:          '#8c8fa8',
  COLONIZED:            '#e06b9a',
  FRAGMENTED_INTO:      '#c9a84c',
  FORCED_INTO:          '#b05252',
};
const EDGE_DEFAULT_COLOR = '#4a4f6a';

// ── Edge-type neighbor opacity weights (mirrored from graph-renderer.js) ────
const TYPE_OPACITY = {
  CAUSED:                0.90,
  ENABLED:               0.90,
  EXPLOITED:             0.75,
  NORMALIZED:            0.75,
  COLONIZED:             0.75,
  FORCED_INTO:           0.75,
  FRAGMENTED_INTO:       0.70,
  PRODUCED:              0.70,
  DISCREDITED:           0.65,
  SELF_REINFORCES:       0.55,
  SHARES_MECHANISM_WITH: 0.08,
};
const DEFAULT_NEIGHBOR_OPACITY = 0.55;
const DIM_OPACITY = 0.05;

// ── Module state ─────────────────────────────────────────────────────────────
let _cy          = null;
let _container   = null;
let _data        = { nodes: [], links: [] };
let _selectedId  = null;
let _hoveredId   = null;
let _semanticZoomEnabled = false;
let _lastTapTime = 0;
let _lastTapNodeId = null;

const _callbacks = {
  nodeClick:    null,
  nodeDblClick: null,
  nodeHover:    null,
  linkClick:    null,
  bgClick:      null,
};

// ── Style sheet ──────────────────────────────────────────────────────────────
function _buildStylesheet() {
  return [
    {
      selector: 'node',
      style: {
        'background-color': ele => CATEGORY_COLOR[ele.data('category')] || '#8c8fa8',
        'width':  ele => _nodeSize(ele),
        'height': ele => _nodeSize(ele),
        'label': 'data(label)',
        'font-size': '10px',
        'font-family': '-apple-system, system-ui, sans-serif',
        'color': '#c8cce0',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 4,
        'text-background-color': '#0d1117',
        'text-background-opacity': 0.75,
        'text-background-padding': '2px',
        'text-background-shape': 'roundrectangle',
        'opacity': 0.92,
        'z-index': 10,
      },
    },
    {
      // Portal nodes: white sphere with blue border
      selector: 'node[category = "portal"]',
      style: {
        'border-width': 3,
        'border-color': '#aaaaff',
        'background-color': '#ffffff',
        'font-size': '12px',
        'font-weight': 'bold',
        'z-index': 20,
      },
    },
    {
      // Mechanism/ideology/phenomenon: diamond shape
      selector: 'node[category = "mechanism"], node[category = "ideology"], node[category = "phenomenon"]',
      style: {
        'shape': 'diamond',
        'z-index': 15,
      },
    },
    {
      // Cross-scope mechanism nodes: stronger border
      selector: 'node[cross_scope = "true"]',
      style: {
        'border-width': 2,
        'border-color': ele => CATEGORY_COLOR[ele.data('category')] || '#a96ce6',
        'border-opacity': 0.7,
      },
    },
    {
      selector: 'edge',
      style: {
        'line-color': ele => EDGE_COLOR[ele.data('type')] || EDGE_DEFAULT_COLOR,
        'target-arrow-color': ele => EDGE_COLOR[ele.data('type')] || EDGE_DEFAULT_COLOR,
        'target-arrow-shape': 'triangle',
        'arrow-scale': 0.8,
        'curve-style': 'bezier',
        'width': ele => ele.data('confidence') === 'speculative' ? 1 : 1.5,
        'opacity': 0.35,
      },
    },
    {
      // Flash highlight for search result
      selector: 'node.flash',
      style: {
        'border-width': 5,
        'border-color': '#ffffff',
        'border-opacity': 1.0,
      },
    },
  ];
}

function _nodeSize(ele) {
  const degree = ele.data('__degree') || 0;
  const base   = ele.data('category') === 'portal' ? 16 : 8;
  return base + Math.log(degree + 1) * 5;
}

// ── Init ──────────────────────────────────────────────────────────────────────
function initRenderer(containerEl) {
  _container = containerEl;

  if (_cy) {
    _cy.destroy();
    _cy = null;
  }

  _cy = cytoscape({
    container: containerEl,
    style: _buildStylesheet(),
    layout: { name: 'preset' },
    minZoom: 0.01,
    maxZoom: 8,
    wheelSensitivity: 0.3,
    selectionType: 'single',
    boxSelectionEnabled: false,
    autoungrabify: false,
  });

  _wireEvents();
}

// ── Event wiring ──────────────────────────────────────────────────────────────
function _wireEvents() {
  if (!_cy) return;

  // Node tap — detect double-tap manually via timestamp delta
  _cy.on('tap', 'node', e => {
    const now    = Date.now();
    const nodeId = e.target.id();
    const isDbl  = (now - _lastTapTime < 300) && (_lastTapNodeId === nodeId);
    _lastTapTime   = now;
    _lastTapNodeId = nodeId;

    if (isDbl) {
      if (_callbacks.nodeDblClick) _callbacks.nodeDblClick(e.target.data('_node'));
    } else {
      if (_callbacks.nodeClick)    _callbacks.nodeClick(e.target.data('_node'), e.originalEvent || e);
    }
  });

  // Hover
  _cy.on('mouseover', 'node', e => {
    if (_container) _container.style.cursor = 'pointer';
    _hoveredId = e.target.id();
    if (!_selectedId) refreshOpacity();
    if (_callbacks.nodeHover) _callbacks.nodeHover(e.target.data('_node'));
  });

  _cy.on('mouseout', 'node', () => {
    if (_container) _container.style.cursor = 'default';
    _hoveredId = null;
    if (!_selectedId) refreshOpacity();
    if (_callbacks.nodeHover) _callbacks.nodeHover(null);
  });

  // Edge tap
  _cy.on('tap', 'edge', e => {
    if (_callbacks.linkClick) _callbacks.linkClick(e.target.data('_link'));
  });

  // Background tap (target is the core / background)
  _cy.on('tap', e => {
    if (e.target === _cy) {
      if (_callbacks.bgClick) _callbacks.bgClick();
    }
  });

  // Semantic zoom: update label visibility on zoom change
  _cy.on('zoom', _onZoomLabelUpdate);
}

// ── Callback setters ──────────────────────────────────────────────────────────
function onNodeClick(fn)    { _callbacks.nodeClick    = fn; }
function onNodeDblClick(fn) { _callbacks.nodeDblClick = fn; }
function onNodeHover(fn)    { _callbacks.nodeHover    = fn; }
function onLinkClick(fn)    { _callbacks.linkClick    = fn; }
function onBgClick(fn)      { _callbacks.bgClick      = fn; }

// ── Data loading ──────────────────────────────────────────────────────────────
function loadGraphData(nodes, edges) {
  if (!_cy) return { nodes: [], links: [] };

  // Normalize source/target (3d-force-graph mutates them to objects after first load)
  const normalize = v => (typeof v === 'object' && v !== null) ? v.id : v;

  // Compute degrees
  const degMap = {};
  for (const e of edges) {
    const s = normalize(e.source);
    const t = normalize(e.target);
    degMap[s] = (degMap[s] || 0) + 1;
    degMap[t] = (degMap[t] || 0) + 1;
  }
  for (const n of nodes) n.__degree = degMap[n.id] || 0;

  // Filter orphaned edges
  const validIds = new Set(nodes.map(n => n.id));
  const links = edges.filter(e => {
    const s = normalize(e.source);
    const t = normalize(e.target);
    return validIds.has(s) && validIds.has(t);
  });

  _data = { nodes, links };
  _selectedId = null;
  _hoveredId  = null;

  // Build cytoscape element descriptors
  const cyNodes = nodes.map(n => ({
    data: {
      id:         n.id,
      label:      n.label || n.id,
      category:   n.category || 'event',
      cross_scope: n.cross_scope ? 'true' : 'false',
      __degree:   n.__degree,
      _node:      n,
    },
  }));

  const cyEdges = links.map((e, i) => {
    const s = normalize(e.source);
    const t = normalize(e.target);
    return {
      data: {
        id:         e.id || ('e' + i),
        source:     s,
        target:     t,
        type:       e.type   || '',
        confidence: e.confidence || '',
        _link:      e,
      },
    };
  });

  // Batch update — remove old, add new
  _cy.startBatch();
  _cy.elements().remove();
  _cy.add([...cyNodes, ...cyEdges]);
  _cy.style(_buildStylesheet());
  _cy.endBatch();

  // Defer layout until container has real pixel dimensions.
  // setTimeout(50) is more reliable than rAF for freshly-shown elements.
  const nodeCount = nodes.length;
  setTimeout(() => {
    if (!_cy) return;
    const isLarge  = nodeCount > 500;
    const isMedium = nodeCount > 150 && !isLarge;

    const runLayout = (opts, label) => {
      console.log('[2D layout] running:', label, '| nodes:', nodeCount, '| container:', _cy.width(), 'x', _cy.height());
      const l = _cy.layout(opts);
      l.on('layoutstop', () => { if (_cy) _cy.fit(undefined, 60); });
      l.run();
    };

    // Large graphs (global view, 400+ nodes): grid sorted by degree.
    // Force-directed layouts can't beat edge-spring forces at this scale.
    // Grid is instantly readable; user drills into a scope for force-layout.
    if (isLarge) {
      runLayout({
        name:    'grid',
        animate: true,
        animationDuration: 400,
        avoidOverlap: true,
        avoidOverlapPadding: 14,
        nodeDimensionsIncludeLabels: true,
        condense: false,
        padding: 60,
        sort: (a, b) => (b.data('__degree') || 0) - (a.data('__degree') || 0),
      }, 'grid');
      return;
    }

    // Medium / small graphs (scoped views): fcose gives a nice force-layout.
    const fcoseOpts = {
      name:             'fcose',
      animate:          true,
      animationDuration: isMedium ? 700 : 500,
      randomize:        true,
      quality:          isMedium ? 'default' : 'proof',
      idealEdgeLength:  isMedium ? 180 : 280,
      nodeRepulsion:    isMedium ? 12000000 : 6000000,
      edgeElasticity:   0.02,   // weak springs so repulsion actually wins
      gravity:          0.05,
      gravityRange:     2.0,
      numIter:          isMedium ? 3000 : 5000,
      tile:             true,
      tilingPaddingVertical:   40,
      tilingPaddingHorizontal: 40,
    };

    try {
      runLayout(fcoseOpts, 'fcose');
    } catch (e1) {
      console.warn('[2D layout] fcose failed:', e1.message);
      runLayout({
        name: 'grid',
        animate: true,
        animationDuration: 400,
        avoidOverlap: true,
        avoidOverlapPadding: 14,
        nodeDimensionsIncludeLabels: true,
        condense: false,
        padding: 60,
        sort: (a, b) => (b.data('__degree') || 0) - (a.data('__degree') || 0),
      }, 'grid-fallback');
    }
  }, 50);

  return _data;
}

function getCurrentData()   { return _data; }
function getGraphInstance() { return _cy; }

// ── Opacity helpers ───────────────────────────────────────────────────────────
function _applyNodeOpacity(opacityFn) {
  if (!_cy) return;
  const fn = typeof opacityFn === 'function' ? opacityFn : () => opacityFn;
  _cy.nodes().forEach(ele => {
    if (!ele.visible()) return;
    ele.style('opacity', fn(ele.data('_node') || { id: ele.id() }));
  });
}

function _applyLinkOpacity(opacityFn) {
  if (!_cy) return;
  const fn = typeof opacityFn === 'function' ? opacityFn : () => opacityFn;
  _cy.edges().forEach(ele => {
    if (!ele.visible()) return;
    ele.style('opacity', fn(ele.data('_link') || {}));
  });
}

// ── Selection / highlight ─────────────────────────────────────────────────────
function refreshOpacity() {
  if (!_cy) return;

  const focusId = _selectedId || _hoveredId;
  if (!focusId) {
    _applyNodeOpacity(0.92);
    _applyLinkOpacity(0.35);
    return;
  }

  // Build neighbor opacity map
  const neighborOpacities = new Map([[focusId, 1.0]]);
  for (const link of _data.links) {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    if (s !== focusId && t !== focusId) continue;
    const nbId  = s === focusId ? t : s;
    const edgeOp = TYPE_OPACITY[link.type] !== undefined
      ? TYPE_OPACITY[link.type]
      : DEFAULT_NEIGHBOR_OPACITY;
    const current = neighborOpacities.get(nbId) || 0;
    if (edgeOp > current) neighborOpacities.set(nbId, edgeOp);
  }

  _applyNodeOpacity(node => neighborOpacities.get(node.id) ?? DIM_OPACITY);

  // Show only edges touching the focused node
  _cy.edges().forEach(ele => {
    if (!ele.visible()) return;
    const s = ele.data('source');
    const t = ele.data('target');
    ele.style('opacity', (s === focusId || t === focusId) ? 0.7 : 0);
  });
}

function highlightNode(nodeId) {
  _hoveredId = nodeId;
  refreshOpacity();
}

function selectNode(nodeId) {
  _selectedId = nodeId;
  refreshOpacity();
}

function clearSelection() {
  _selectedId = null;
  _hoveredId  = null;
  refreshOpacity();
}

function resetVisibility() {
  if (!_cy) return;
  _cy.nodes().show();
  _cy.edges().show();
  _cy.nodes().forEach(ele => ele.removeStyle('opacity'));
  _cy.edges().forEach(ele => ele.removeStyle('opacity'));
}

// ── Filter visibility ─────────────────────────────────────────────────────────
function setNodeVisibility(predicate) {
  if (!_cy) return;
  const fn = typeof predicate === 'function' ? predicate : () => !!predicate;
  _cy.nodes().forEach(ele => {
    const node = ele.data('_node');
    if (!node) return;
    if (fn(node)) ele.show(); else ele.hide();
  });
}

function setLinkVisibility(predicate) {
  if (!_cy) return;
  const fn = typeof predicate === 'function' ? predicate : () => !!predicate;
  _cy.edges().forEach(ele => {
    const link = ele.data('_link');
    if (!link) return;
    if (fn(link)) ele.show(); else ele.hide();
  });
}

// ── Path highlight ────────────────────────────────────────────────────────────
function highlightPath(nodeIds, edgePairs) {
  if (!_cy) return;
  const nodeSet = new Set(nodeIds);
  _cy.nodes().forEach(ele => {
    ele.style('opacity', nodeSet.has(ele.id()) ? 0.95 : 0.06);
  });
  _cy.edges().forEach(ele => {
    const s = ele.data('source');
    const t = ele.data('target');
    const onPath = edgePairs.some(([a, b]) => a === s && b === t);
    ele.style('opacity', onPath ? 0.9 : 0);
  });
}

function clearPathHighlight() {
  if (!_cy) return;
  _applyNodeOpacity(0.92);
  _applyLinkOpacity(0.35);
}

// ── Neighborhood dimming ──────────────────────────────────────────────────────
function dimToNeighborhood(rootId, depth, nodeMap, edgeMap) {
  if (!_cy) return;
  const allNeighbors = getNeighborIds(rootId, depth, nodeMap, edgeMap);

  const neighborOpacities = new Map([[rootId, 1.0]]);
  for (const link of _data.links) {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    if (s !== rootId && t !== rootId) continue;
    const nbId = s === rootId ? t : s;
    if (!allNeighbors.has(nbId)) continue;
    const edgeOp = TYPE_OPACITY[link.type] !== undefined
      ? TYPE_OPACITY[link.type]
      : DEFAULT_NEIGHBOR_OPACITY;
    const current = neighborOpacities.get(nbId) || 0;
    if (edgeOp > current) neighborOpacities.set(nbId, edgeOp);
  }
  for (const id of allNeighbors) {
    if (!neighborOpacities.has(id)) neighborOpacities.set(id, 0.60);
  }

  _applyNodeOpacity(n => neighborOpacities.get(n.id) ?? DIM_OPACITY);
  _cy.edges().forEach(ele => {
    if (!ele.visible()) return;
    const s = ele.data('source');
    const t = ele.data('target');
    ele.style('opacity', (allNeighbors.has(s) && allNeighbors.has(t)) ? 0.7 : 0);
  });
}

function getNeighborIds(rootId, depth, nodeMap, edgeMap) {
  const result   = new Set([rootId]);
  let frontier   = new Set([rootId]);
  for (let d = 0; d < depth; d++) {
    const next = new Set();
    for (const id of frontier) {
      for (const nbId of (edgeMap[id] || [])) {
        if (!result.has(nbId)) { result.add(nbId); next.add(nbId); }
      }
    }
    frontier = next;
  }
  return result;
}

// ── Semantic zoom (label LOD) ─────────────────────────────────────────────────
function setSemanticZoom(enabled) {
  _semanticZoomEnabled = enabled;
  // Zoom handler is always attached (in _wireEvents); just apply immediately
  if (enabled) _onZoomLabelUpdate();
}

function applySemanticZoom() {
  if (_semanticZoomEnabled) _onZoomLabelUpdate();
}

function _onZoomLabelUpdate() {
  if (!_cy) return;
  const zoom = _cy.zoom();
  _cy.nodes().forEach(ele => {
    const degree = ele.data('__degree') || 0;
    // Progressive label hiding at low zoom levels
    const show = degree >= 15 || zoom >= 0.25 ||
                (degree >= 5  && zoom >= 0.12) ||
                (degree >= 2  && zoom >= 0.20) ||
                ele.data('category') === 'portal';
    ele.style('label', show ? ele.data('label') : '');
  });
}

// ── Camera / view ─────────────────────────────────────────────────────────────
function fitCamera() {
  if (!_cy) return;
  _cy.fit(undefined, 40);
}

function focusOnNode(node, zoom) {
  if (!_cy) return;
  const ele = _cy.getElementById(node.id);
  if (!ele || ele.length === 0) return;
  const zoomLevel = zoom ? Math.min(zoom / 50, 4) : 2.5;
  _cy.animate(
    { center: { eles: ele }, zoom: zoomLevel },
    { duration: 400, easing: 'ease-in-out-cubic' }
  );
}

// WASD pan: forward maps to pan-up, right maps to pan-right (2D pan)
function moveCamera(forwardDelta, rightDelta) {
  if (!_cy) return;
  _cy.panBy({ x: -rightDelta * 0.5, y: -forwardDelta * 0.5 });
}

// ── Effects ───────────────────────────────────────────────────────────────────
function flashNode(nodeId) {
  if (!_cy) return;
  const ele = _cy.getElementById(nodeId);
  if (!ele || ele.length === 0) return;
  ele.addClass('flash');
  setTimeout(() => ele.removeClass('flash'), 800);
}

function exportPNG() {
  if (!_cy) return;
  // output:'base64uri' is the default and always synchronous
  const dataUrl = _cy.png({ scale: 2, bg: '#0d1117', full: false });
  if (!dataUrl) return;
  const a   = document.createElement('a');
  a.href     = dataUrl;
  a.download = 'why-opedia-graph-2d.png';
  a.click();
}

// ── Public API ────────────────────────────────────────────────────────────────
window.GraphRenderer2D = {
  CATEGORY_COLOR,
  EDGE_COLOR,
  EDGE_DEFAULT_COLOR,

  initRenderer,
  loadGraphData,
  getCurrentData,
  getGraphInstance,

  onNodeClick,
  onNodeDblClick,
  onNodeHover,
  onLinkClick,
  onBgClick,

  highlightNode,
  selectNode,
  clearSelection,
  refreshOpacity,
  highlightPath,
  clearPathHighlight,
  dimToNeighborhood,
  getNeighborIds,

  setNodeVisibility,
  setLinkVisibility,
  resetVisibility,
  setSemanticZoom,
  applySemanticZoom,

  fitCamera,
  focusOnNode,
  moveCamera,
  flashNode,
  exportPNG,
};

})();
