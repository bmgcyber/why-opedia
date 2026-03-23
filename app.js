// Why-opedia — app.js
'use strict';

// ── Category → color map ──────────────────────────────────────────────────────
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
};

// ── Edge type → color map ─────────────────────────────────────────────────────
const EDGE_COLOR = {
  CAUSED:               '#e05252',
  ENABLED:              '#e09752',
  SHARES_MECHANISM_WITH:'#5b8dee',
  SELF_REINFORCES:      '#a96ce6',
  EXPLOITED:            '#e07b52',
  NORMALIZED:           '#48bb78',
  REACTIVATED:          '#f6c90e',
  PROVIDED_COVER_FOR:   '#4ec9c9',
  PRODUCED:             '#8dd4a8',
  DISCREDITED:          '#8c8fa8',
  COLONIZED:            '#e06b9a',
  FRAGMENTED_INTO:      '#c9a84c',
  FORCED_INTO:          '#b05252',
};
const EDGE_DEFAULT_COLOR = '#4a4f6a';

// Edge filter groups — the 4 main types + "other" + "speculative" (confidence)
const EDGE_FILTER_GROUPS = [
  'CAUSED', 'ENABLED', 'SHARES_MECHANISM_WITH', 'SELF_REINFORCES', 'other', 'speculative',
];
const EDGE_FILTER_MAIN = new Set(['CAUSED', 'ENABLED', 'SHARES_MECHANISM_WITH', 'SELF_REINFORCES']);

// ── State ─────────────────────────────────────────────────────────────────────
let cy = null;
let allNodes = [];
let allEdges = [];
let nodeMap = {};

// Sidebar / filter state
let sidebarCollapsed = false;
let selectedNodeId = null;
let neighborhoodDepth = 1;
let enabledNodeCategories = new Set();
let enabledEdgeFilters = new Set(EDGE_FILTER_GROUPS);
let minConnectivity = 0;
let allCategories = new Set(); // all categories in the dataset (set at sidebar build time)

// Semantic zoom state
let semanticZoomTiers = null;   // { tier1: Set<id>, tier2: Set<id>, tier3: Set<id> }
let lastSemanticZoomLevel = 0;  // 0=uninit, 1=tier1 only, 2=tier1+2, 3=all

// ── Boot ──────────────────────────────────────────────────────────────────────
document.getElementById('stats').textContent = 'Loading…';

Promise.all([
  fetch('data/nodes.json').then(r => r.json()),
  fetch('data/edges.json').then(r => r.json()),
]).then(([nodes, edges]) => {
  allNodes = nodes;
  allEdges = edges;
  nodes.forEach(n => { nodeMap[n.id] = n; });

  initCytoscape(nodes, edges);
  buildSidebar(nodes);
  updateStats(nodes.length, edges.length);
}).catch(err => {
  console.error('Failed to load data:', err);
  document.getElementById('stats').textContent = 'Error loading data — run from a server, not file://';
});

// ── Cytoscape init ────────────────────────────────────────────────────────────
function initCytoscape(nodes, edges) {
  const elements = [
    ...nodes.map(n => ({
      data: {
        id: n.id,
        label: n.label,
        category: n.category,
        node_type: n.node_type,
        wikipedia: n.wikipedia || null,
        summary: n.summary,
        decade: n.decade,
        tags: n.tags,
      }
    })),
    ...edges.map(e => ({
      data: {
        id: e.id,
        source: e.source,
        target: e.target,
        type: e.type,
        label: e.label,
        note: e.note || '',
        confidence: e.confidence,
      }
    })),
  ];

  cy = cytoscape({
    container: document.getElementById('cy'),
    elements,
    layout: {
      name: 'fcose',
      quality: 'proof',
      animate: true,
      animationDuration: 1000,
      randomize: true,
      fit: true,
      padding: 80,
      packComponents: true,
      nodeRepulsion: 14000,
      idealEdgeLength: 280,
      edgeElasticity: 0.35,
      nestingFactor: 0.1,
      gravity: 0.18,
      gravityRange: 3.8,
      numIter: 3000,
      tile: true,
      tilingPaddingVertical: 20,
      tilingPaddingHorizontal: 20,
    },
    style: buildStylesheet(),
    wheelSensitivity: 0.3,
  });

  // Compute tiers + set slider max after layout finishes
  cy.one('layoutstop', () => {
    computeSemanticZoomTiers();

    const maxDeg = cy.nodes().reduce((m, n) => Math.max(m, n.connectedEdges().length), 0);
    const slider = document.getElementById('sb-conn-slider');
    if (slider) slider.max = Math.max(1, Math.min(maxDeg, 60));

    // Land in Tier 1 (hub overview) on initial load
    if (cy.zoom() > 0.55) {
      cy.zoom({ level: 0.48, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
    }

    lastSemanticZoomLevel = -1; // force first apply
    applySemanticZoomVisibility();
    const visNodes = cy.nodes().not('.hidden').length;
    const visEdges = cy.edges().not('.hidden').length;
    updateStats(visNodes, visEdges, allNodes.length, allEdges.length);
  });

  // Semantic zoom: re-evaluate only when crossing a tier boundary
  cy.on('zoom', () => {
    if (!semanticZoomTiers || isSemanticZoomSuppressed()) return;
    const zoom = cy.zoom();
    const newLevel = zoom < 0.6 ? 1 : zoom < 1.0 ? 2 : 3;
    if (newLevel !== lastSemanticZoomLevel) {
      applySemanticZoomVisibility();
      const visNodes = cy.nodes().not('.hidden').length;
      const visEdges = cy.edges().not('.hidden').length;
      updateStats(visNodes, visEdges, allNodes.length, allEdges.length);
    }
  });

  // ── Interaction ─────────────────────────────────────────────────────────────
  cy.on('tap', 'node', e => {
    const node = e.target;
    setFocus(node);
    cy.animate({ center: { eles: node } }, { duration: 250 });
    showNodePanel(node.data());
    activateNeighborhood(node.id());
  });

  cy.on('tap', 'edge', e => {
    setFocus(e.target);
    showEdgePanel(e.target.data());
  });

  cy.on('tap', e => {
    if (e.target === cy) {
      setFocus(null);
      closePanel();
      clearNeighborhood();
    }
  });

  cy.on('mouseover', 'node', e => {
    const node = e.target;
    const connected = node.connectedEdges();
    const neighbors = connected.connectedNodes();
    cy.elements()
      .not(node).not(connected).not(neighbors)
      .not('.focused')
      .addClass('dimmed');
    node.addClass('highlighted');
    connected.addClass('highlighted');
    neighbors.addClass('highlighted');
  });

  cy.on('mouseout', 'node', () => {
    cy.elements().removeClass('highlighted');
    restoreNeighborhoodDimming();
  });

  cy.on('mouseover', 'edge', e => {
    const edge = e.target;
    const connected = edge.connectedNodes();
    cy.elements()
      .not(edge).not(connected)
      .not('.focused')
      .addClass('dimmed');
    edge.addClass('highlighted');
    connected.addClass('highlighted');
  });

  cy.on('mouseout', 'edge', () => {
    cy.elements().removeClass('highlighted');
    restoreNeighborhoodDimming();
  });
}

// ── Neighborhood dimming ──────────────────────────────────────────────────────
// Re-applies neighborhood dimming after hover clears it
function restoreNeighborhoodDimming() {
  if (!cy) return;
  cy.elements().removeClass('dimmed');
  if (!selectedNodeId) return;
  cy.batch(() => {
    const nbNodes = getNeighborhoodNodes(selectedNodeId, neighborhoodDepth);
    cy.nodes().not(nbNodes).not('.hidden').addClass('dimmed');
    cy.edges().forEach(edge => {
      if (edge.hasClass('hidden')) return;
      const src = cy.getElementById(edge.data('source'));
      const tgt = cy.getElementById(edge.data('target'));
      if (src.hasClass('dimmed') || tgt.hasClass('dimmed')) {
        edge.addClass('dimmed');
      }
    });
  });
}

function activateNeighborhood(nodeId) {
  selectedNodeId = nodeId;
  const node = cy.getElementById(nodeId);
  if (!node.length) return;

  const section = document.getElementById('sb-neighborhood');
  section.hidden = false;
  document.getElementById('sb-nb-title').textContent = node.data('label');

  applyFilters();
}

function clearNeighborhood() {
  selectedNodeId = null;
  const section = document.getElementById('sb-neighborhood');
  if (section) section.hidden = true;
  if (cy) cy.elements().removeClass('dimmed');
  applyFilters();
}

function getNeighborhoodNodes(rootId, depth) {
  const root = cy.getElementById(rootId);
  if (!root.length) return cy.collection();
  let current = root.closedNeighborhood().nodes();
  for (let d = 1; d < depth; d++) {
    current = current.union(current.closedNeighborhood().nodes());
  }
  return current;
}

// ── Focus management (persists across hover) ──────────────────────────────────
function setFocus(element) {
  cy.elements().removeClass('focused');
  if (!element) return;
  element.addClass('focused');
  if (element.isNode()) {
    element.connectedEdges().addClass('focused');
    element.connectedEdges().connectedNodes().addClass('focused');
  } else {
    element.connectedNodes().addClass('focused');
  }
}

// ── Cytoscape stylesheet ──────────────────────────────────────────────────────
function buildStylesheet() {
  return [
    {
      selector: 'node',
      style: {
        'background-color': ele => CATEGORY_COLOR[ele.data('category')] || '#8c8fa8',
        'border-width': ele => ele.data('node_type') === 'mechanism' ? 2.5 : 0,
        'border-style': ele => ele.data('node_type') === 'mechanism' ? 'dashed' : 'solid',
        'border-color': ele => CATEGORY_COLOR[ele.data('category')] || '#8c8fa8',
        'background-opacity': ele => ele.data('node_type') === 'mechanism' ? 0.25 : 0.9,
        'shape': ele => ele.data('node_type') === 'mechanism' ? 'diamond' : 'ellipse',
        'width': 42,
        'height': 42,
        'label': 'data(label)',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'font-size': 10,
        'color': '#c8cce0',
        'text-margin-y': 5,
        'text-max-width': 80,
        'text-wrap': 'wrap',
        'text-background-color': '#0f1117',
        'text-background-opacity': 0.6,
        'text-background-padding': '2px',
        'text-background-shape': 'round-rectangle',
        'transition-property': 'opacity, background-opacity',
        'transition-duration': '0.15s',
      }
    },
    {
      selector: 'edge',
      style: {
        'line-color': ele => EDGE_COLOR[ele.data('type')] || EDGE_DEFAULT_COLOR,
        'target-arrow-color': ele => EDGE_COLOR[ele.data('type')] || EDGE_DEFAULT_COLOR,
        'target-arrow-shape': 'triangle',
        'arrow-scale': 0.8,
        'line-style': ele => ele.data('confidence') === 'speculative' ? 'dashed' : 'solid',
        'line-dash-pattern': [6, 4],
        'width': 1.5,
        'curve-style': 'bezier',
        'loop-direction': '-45deg',
        'loop-sweep': '-90deg',
        'transition-property': 'opacity',
        'transition-duration': '0.15s',
      }
    },
    // Show edge labels when hovered or focused
    {
      selector: 'edge.highlighted, edge.focused',
      style: {
        'label': 'data(label)',
        'font-size': 9,
        'color': '#7a7f9a',
        'text-rotation': 'autorotate',
        'text-background-color': '#0f1117',
        'text-background-opacity': 0.75,
        'text-background-padding': '2px',
        'text-background-shape': 'round-rectangle',
        'text-max-width': ele => {
          if (ele.source().id() === ele.target().id()) return '60px';
          const src = ele.source().position();
          const tgt = ele.target().position();
          const dx = tgt.x - src.x;
          const dy = tgt.y - src.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          return Math.max(20, len - 50) + 'px';
        },
        'text-wrap': 'ellipsis',
        'width': 2.5,
      }
    },
    // Ring on focused node
    {
      selector: 'node.focused',
      style: {
        'border-width': 2.5,
        'border-style': 'solid',
        'border-color': '#ffffff',
        'background-opacity': ele => ele.data('node_type') === 'mechanism' ? 0.35 : 1,
      }
    },
    {
      selector: '.dimmed',
      style: { 'opacity': 0.08 }
    },
    // Semantic zoom — tier 2/3 nodes at current zoom level
    {
      selector: '.sz-dim',
      style: { 'opacity': 0.06 }
    },
    {
      selector: '.highlighted',
      style: { 'opacity': 1 }
    },
    {
      selector: '.hidden',
      style: { 'display': 'none' }
    },
  ];
}

// ── Info panel — Node ─────────────────────────────────────────────────────────
function showNodePanel(data) {
  const isRef = data.node_type === 'reference';
  const color = CATEGORY_COLOR[data.category] || '#8c8fa8';
  const tags = (data.tags || []).map(t => `<span class="panel-tag">${escHtml(t)}</span>`).join('');

  const wikiLink = isRef && data.wikipedia
    ? `<a class="panel-link" href="${data.wikipedia}" target="_blank" rel="noopener">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        Wikipedia article
       </a>`
    : '';

  const mechanismNote = !isRef
    ? `<div class="mechanism-note">
        This is a pattern node. It describes a recurring mechanism that connects the nodes linked to it. Follow the edges to see where it appears.
       </div>`
    : '';

  document.getElementById('panel-inner').innerHTML = `
    <span class="panel-type-badge ${data.node_type}">${data.node_type}</span>
    <div id="panel-title">${escHtml(data.label)}</div>
    <div id="panel-summary">${escHtml(data.summary)}</div>
    ${mechanismNote}
    ${wikiLink}
    <div class="panel-meta">
      <div class="panel-meta-row">
        <span class="panel-meta-key">Category</span>
        <span class="panel-meta-val" style="color:${color}">${data.category}</span>
      </div>
      <div class="panel-meta-row">
        <span class="panel-meta-key">Period</span>
        <span class="panel-meta-val">${escHtml(data.decade)}</span>
      </div>
    </div>
    ${tags ? `<div class="panel-tags">${tags}</div>` : ''}
    ${buildConnectionsList(data.id)}
  `;

  openPanel();
}

// ── Info panel — Edge ─────────────────────────────────────────────────────────
function showEdgePanel(data) {
  const srcNode = nodeMap[data.source];
  const tgtNode = nodeMap[data.target];
  const srcLabel = srcNode ? srcNode.label : data.source;
  const tgtLabel = tgtNode ? tgtNode.label : data.target;
  const edgeColor = EDGE_COLOR[data.type] || EDGE_DEFAULT_COLOR;

  document.getElementById('panel-inner').innerHTML = `
    <span class="panel-type-badge edge">edge</span>
    <div class="edge-type-label" style="color:${edgeColor}">${escHtml(data.type)}</div>
    <div class="edge-nodes">
      <span class="conn-item-inline" data-node-id="${escHtml(data.source)}"><strong>${escHtml(srcLabel)}</strong></span>
      <span style="color:#4a4f6a"> → </span>
      <span class="conn-item-inline" data-node-id="${escHtml(data.target)}"><strong>${escHtml(tgtLabel)}</strong></span>
    </div>
    <div id="panel-summary">${escHtml(data.label)}</div>
    ${data.note ? `<div style="margin-top:12px" class="panel-section-label">Note</div><div class="panel-note">${escHtml(data.note)}</div>` : ''}
    <div class="panel-meta">
      <div class="panel-meta-row">
        <span class="panel-meta-key">Confidence</span>
        <span class="panel-meta-val"><span class="confidence-badge ${data.confidence}">${data.confidence}</span></span>
      </div>
    </div>
  `;

  openPanel();
}

// ── Connections list (for node panel) ────────────────────────────────────────
function buildConnectionsList(nodeId) {
  if (!cy) return '';
  const nodeEl = cy.getElementById(nodeId);
  const edges = nodeEl.connectedEdges();
  if (!edges.length) return '';

  const items = edges.toArray()
    .sort((a, b) => a.data('type').localeCompare(b.data('type')))
    .map(edge => {
      const eData = edge.data();
      const isSource = eData.source === nodeId;
      const otherId = isSource ? eData.target : eData.source;
      const otherNode = nodeMap[otherId];
      const otherLabel = otherNode ? otherNode.label : otherId;
      const color = EDGE_COLOR[eData.type] || EDGE_DEFAULT_COLOR;
      const arrow = isSource ? '→' : '←';

      return `<div class="conn-item" data-node-id="${escHtml(otherId)}">
        <span class="conn-type" style="color:${color}">${escHtml(eData.type)}</span>
        <span class="conn-arrow">${arrow}</span>
        <span class="conn-label">${escHtml(otherLabel)}</span>
      </div>`;
    }).join('');

  return `
    <div class="panel-section-label" style="margin-top:16px">Connections (${edges.length})</div>
    <div class="conn-list">${items}</div>
  `;
}

// ── Panel navigation (delegated, set up once) ─────────────────────────────────
document.getElementById('panel-inner').addEventListener('click', e => {
  const item = e.target.closest('[data-node-id]');
  if (!item || !cy) return;
  const nodeId = item.dataset.nodeId;
  const nodeEl = cy.getElementById(nodeId);
  if (!nodeEl.length) return;
  setFocus(nodeEl);
  cy.animate({ center: { eles: nodeEl } }, { duration: 250 });
  showNodePanel(nodeEl.data());
  activateNeighborhood(nodeId);
});

function openPanel() {
  document.getElementById('info-panel').classList.add('open');
}

function closePanel() {
  document.getElementById('info-panel').classList.remove('open');
  if (cy) setFocus(null);
}

document.getElementById('panel-close').addEventListener('click', closePanel);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closePanel();
    clearNeighborhood();
  }
});

// ── Fit / reset view ──────────────────────────────────────────────────────────
document.getElementById('fit-btn').addEventListener('click', () => {
  if (cy) cy.animate({ fit: { padding: 60 } }, { duration: 300 });
});

// ── Sidebar toggle ────────────────────────────────────────────────────────────
document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);

function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);
  const btn = document.getElementById('sidebar-toggle');
  btn.setAttribute('aria-expanded', String(!sidebarCollapsed));
  btn.title = sidebarCollapsed ? 'Open filters panel' : 'Close filters panel';
  // Resize cy after CSS transition completes (0.25s)
  if (cy) setTimeout(() => cy.resize(), 270);
}

// ── Build sidebar (called after data loads) ───────────────────────────────────
function buildSidebar(nodes) {
  buildNodeTypeFilters(nodes);
  buildEdgeTypeFilters();
  initConnectivitySlider();
  initSidebarSearch();
  initNeighborhoodControls();

  document.getElementById('sb-reset').addEventListener('click', resetAll);
}

// ── Node Type Filters ─────────────────────────────────────────────────────────
function buildNodeTypeFilters(nodes) {
  const categories = [...new Set(nodes.map(n => n.category))].sort();
  enabledNodeCategories = new Set(categories);
  allCategories = new Set(categories); // snapshot for suppression check

  const container = document.getElementById('sb-node-types');
  categories.forEach(cat => {
    const label = cat.charAt(0).toUpperCase() + cat.slice(1);
    const color = CATEGORY_COLOR[cat] || '#8c8fa8';
    const total = nodes.filter(n => n.category === cat).length;

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

// ── Edge Type Filters ─────────────────────────────────────────────────────────
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
  EDGE_FILTER_GROUPS.forEach(group => {
    const isSpeculative = group === 'speculative';
    const isOther = group === 'other';
    const color = EDGE_COLOR[group] || EDGE_DEFAULT_COLOR;

    const row = document.createElement('label');
    row.className = 'sb-check-row';

    const dotClass = isSpeculative ? 'sb-dot dashed-line' : 'sb-dot line';
    const dotStyle = isSpeculative ? '' : `style="background:${color}"`;

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

// ── Connectivity Slider ───────────────────────────────────────────────────────
function initConnectivitySlider() {
  const slider = document.getElementById('sb-conn-slider');
  const display = document.getElementById('sb-conn-display');
  slider.addEventListener('input', () => {
    minConnectivity = parseInt(slider.value, 10);
    display.textContent = `≥ ${minConnectivity}`;
    applyFilters();
  });
}

// ── Neighborhood Controls ─────────────────────────────────────────────────────
function initNeighborhoodControls() {
  document.querySelectorAll('.sb-depth-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sb-depth-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      neighborhoodDepth = parseInt(btn.dataset.depth, 10);
      if (selectedNodeId) applyFilters();
    });
  });

  document.getElementById('sb-nb-clear').addEventListener('click', () => {
    setFocus(null);
    closePanel();
    clearNeighborhood();
  });
}

// ── Sidebar Search with Autocomplete ─────────────────────────────────────────
function initSidebarSearch() {
  // Create autocomplete dropdown — fixed positioned, appended to body
  const dropdown = document.createElement('div');
  dropdown.id = 'sb-autocomplete';
  document.body.appendChild(dropdown);

  const input = document.getElementById('sb-search');
  let currentResults = [];
  let kbHighlighted = -1;

  function positionDropdown() {
    const rect = input.getBoundingClientRect();
    dropdown.style.top  = (rect.bottom + 4) + 'px';
    dropdown.style.left = rect.left + 'px';
    dropdown.style.width = rect.width + 'px';
  }

  function showDropdown(results) {
    currentResults = results;
    kbHighlighted = -1;
    if (!results.length) { dropdown.style.display = 'none'; return; }

    dropdown.innerHTML = '';
    results.forEach((node, i) => {
      const cat   = node.data('category');
      const color = CATEGORY_COLOR[cat] || '#8c8fa8';
      const item  = document.createElement('div');
      item.className = 'sb-ac-item';
      item.dataset.index = i;
      item.innerHTML = `
        <span class="sb-ac-dot" style="background:${color}"></span>
        <span class="sb-ac-label">${escHtml(node.data('label'))}</span>
        <span class="sb-ac-cat">${escHtml(cat)}</span>
      `;
      // mousedown to fire before blur
      item.addEventListener('mousedown', ev => {
        ev.preventDefault();
        selectSearchResult(node);
        input.value = '';
        dropdown.style.display = 'none';
      });
      dropdown.appendChild(item);
    });

    positionDropdown();
    dropdown.style.display = 'block';
  }

  function updateKbHighlight() {
    dropdown.querySelectorAll('.sb-ac-item').forEach((el, i) => {
      el.classList.toggle('kb-active', i === kbHighlighted);
    });
  }

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (!q || !cy) { dropdown.style.display = 'none'; return; }
    showDropdown(searchNodes(q, 5));
  });

  input.addEventListener('keydown', e => {
    if (!currentResults.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      kbHighlighted = Math.min(kbHighlighted + 1, currentResults.length - 1);
      updateKbHighlight();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      kbHighlighted = Math.max(kbHighlighted - 1, -1);
      updateKbHighlight();
    } else if (e.key === 'Enter') {
      if (kbHighlighted >= 0) {
        selectSearchResult(currentResults[kbHighlighted]);
        input.value = '';
        dropdown.style.display = 'none';
      }
    } else if (e.key === 'Escape') {
      dropdown.style.display = 'none';
      input.blur();
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(() => { dropdown.style.display = 'none'; }, 160);
  });

  // Reposition if window resizes or sidebar toggles
  window.addEventListener('resize', () => {
    if (dropdown.style.display !== 'none') positionDropdown();
  });
}

function searchNodes(query, limit) {
  if (!cy) return [];
  const q = query.toLowerCase();
  const scored = [];
  cy.nodes().forEach(node => {
    const label = node.data('label').toLowerCase();
    let score = 0;
    if (label.startsWith(q))                                  score = 3;
    else if (label.includes(q))                               score = 2;
    else if (label.split(/\s+/).some(w => w.startsWith(q)))   score = 1.5;
    if (score > 0) scored.push({ node, score });
  });
  scored.sort((a, b) => b.score - a.score || a.node.data('label').localeCompare(b.node.data('label')));
  return scored.slice(0, limit).map(r => r.node);
}

function selectSearchResult(node) {
  setFocus(node);
  const zoom = Math.max(cy.zoom(), 1.5);
  cy.animate({ center: { eles: node }, zoom }, { duration: 400 });
  showNodePanel(node.data());
  activateNeighborhood(node.id());
}

// ── Reset All ─────────────────────────────────────────────────────────────────
function resetAll() {
  // Clear search input
  const input = document.getElementById('sb-search');
  if (input) input.value = '';
  const dropdown = document.getElementById('sb-autocomplete');
  if (dropdown) dropdown.style.display = 'none';

  // Clear neighborhood / focus / panel
  setFocus(null);
  closePanel();
  clearNeighborhood();

  // Reset node type checkboxes
  document.querySelectorAll('[data-category]').forEach(cb => {
    cb.checked = true;
    enabledNodeCategories.add(cb.dataset.category);
  });

  // Reset edge type checkboxes
  enabledEdgeFilters = new Set(EDGE_FILTER_GROUPS);
  document.querySelectorAll('[data-edge-filter]').forEach(cb => { cb.checked = true; });

  // Reset connectivity
  minConnectivity = 0;
  const slider = document.getElementById('sb-conn-slider');
  const display = document.getElementById('sb-conn-display');
  if (slider) slider.value = 0;
  if (display) display.textContent = '≥ 0';

  // Reset depth buttons to 1
  neighborhoodDepth = 1;
  document.querySelectorAll('.sb-depth-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.depth === '1');
  });

  applyFilters();
}

// ── Apply combined filters ────────────────────────────────────────────────────
function applyFilters() {
  if (!cy) return;

  cy.batch(() => {
    // Clear previous filter state
    cy.elements().removeClass('hidden dimmed');

    // 1. Neighborhood dimming (opacity, not hidden)
    if (selectedNodeId) {
      const nbNodes = getNeighborhoodNodes(selectedNodeId, neighborhoodDepth);
      cy.nodes().not(nbNodes).addClass('dimmed');
      cy.edges().forEach(edge => {
        const src = cy.getElementById(edge.data('source'));
        const tgt = cy.getElementById(edge.data('target'));
        if (src.hasClass('dimmed') || tgt.hasClass('dimmed')) {
          edge.addClass('dimmed');
        }
      });
    }

    // 2. Node type filter → hide
    cy.nodes().forEach(node => {
      if (!enabledNodeCategories.has(node.data('category'))) {
        node.addClass('hidden');
      }
    });

    // 3. Edge type filter → hide edges that fail the filter
    cy.edges().forEach(edge => {
      if (!edgePassesFilter(edge)) edge.addClass('hidden');
    });

    // 4. Orphan pruning from edge type filter:
    //    visible nodes whose ALL connected edges failed the type filter → hide
    const edgeFilterActive = enabledEdgeFilters.size < EDGE_FILTER_GROUPS.length;
    if (edgeFilterActive) {
      cy.nodes().not('.hidden').forEach(node => {
        const total = node.connectedEdges().length;
        if (total > 0) {
          // Check if any edge passes the type filter for this node (ignoring node visibility)
          const anyPassingEdge = node.connectedEdges().some(e => edgePassesFilter(e));
          if (!anyPassingEdge) node.addClass('hidden');
        }
      });
    }

    // 5. Hide edges where either endpoint is hidden
    cy.edges().not('.hidden').forEach(edge => {
      const src = cy.getElementById(edge.data('source'));
      const tgt = cy.getElementById(edge.data('target'));
      if (src.hasClass('hidden') || tgt.hasClass('hidden')) {
        edge.addClass('hidden');
      }
    });

    // 6. Connectivity filter: hide nodes with fewer than N visible edges
    if (minConnectivity > 0) {
      cy.nodes().not('.hidden').forEach(node => {
        const visEdges = node.connectedEdges().not('.hidden').length;
        if (visEdges < minConnectivity) node.addClass('hidden');
      });
      // Re-hide edges from newly hidden nodes
      cy.edges().not('.hidden').forEach(edge => {
        const src = cy.getElementById(edge.data('source'));
        const tgt = cy.getElementById(edge.data('target'));
        if (src.hasClass('hidden') || tgt.hasClass('hidden')) {
          edge.addClass('hidden');
        }
      });
    }
  });

  // Re-evaluate semantic zoom (suppressed when any filter/neighborhood is active)
  applySemanticZoomVisibility();

  // Update stats and counts
  const visNodes = cy.nodes().not('.hidden').length;
  const visEdges = cy.edges().not('.hidden').length;
  updateStats(visNodes, visEdges, allNodes.length, allEdges.length);
  updateNodeTypeCounts();
}

function edgePassesFilter(edge) {
  const type       = edge.data('type');
  const confidence = edge.data('confidence');

  // Speculative filter — orthogonal to type
  if (!enabledEdgeFilters.has('speculative') && confidence === 'speculative') return false;

  // Main type filters
  if (EDGE_FILTER_MAIN.has(type)) return enabledEdgeFilters.has(type);

  // Everything else = "other"
  return enabledEdgeFilters.has('other');
}

// ── Node Type Count Updates ───────────────────────────────────────────────────
function updateNodeTypeCounts() {
  if (!cy) return;
  const totals  = {};
  const visible = {};
  cy.nodes().forEach(n => {
    const cat = n.data('category');
    totals[cat]  = (totals[cat]  || 0) + 1;
    if (!n.hasClass('hidden')) visible[cat] = (visible[cat] || 0) + 1;
  });
  Object.keys(totals).forEach(cat => {
    const el = document.getElementById(`sb-cat-count-${cat}`);
    if (el) el.textContent = `${visible[cat] || 0}/${totals[cat]}`;
  });
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function updateStats(nodes, edges, totalNodes, totalEdges) {
  const el = document.getElementById('stats');
  let main;
  if (totalNodes !== undefined && (nodes !== totalNodes || edges !== totalEdges)) {
    main = `${nodes}/${totalNodes} nodes · ${edges}/${totalEdges} edges`;
  } else {
    main = `${nodes} nodes · ${edges} edges`;
  }

  // Semantic zoom hint line (only when active and not fully revealed)
  let szLine = '';
  if (cy && semanticZoomTiers && !isSemanticZoomSuppressed()) {
    const zoom = cy.zoom();
    const level = zoom < 0.6 ? 1 : zoom < 1.0 ? 2 : 3;
    if (level < 3) {
      const dimCount = cy.nodes().filter(n => n.hasClass('sz-dim')).length;
      const shown = cy.nodes().length - dimCount;
      szLine = `<div class="sz-status">Showing ${shown} of ${cy.nodes().length} nodes — zoom in to reveal more</div>`;
    }
  }

  el.innerHTML = `<div>${main}</div>${szLine}`;
}

// ── Semantic Zoom ─────────────────────────────────────────────────────────────

// Compute tier membership from actual degree distribution (percentile-based).
// Tier 1 (top ~20% by degree) → always visible.
// Tier 2 (next ~30%) → visible at mid zoom.
// Tier 3 (bottom ~50%) → visible only when zoomed in.
function computeSemanticZoomTiers() {
  if (!cy) return;
  const nodes = cy.nodes();
  const n = nodes.length;
  if (n === 0) return;

  // Build sorted degree array (ascending) for percentile thresholds
  const degrees = nodes.map(node => node.connectedEdges().length).sort((a, b) => a - b);

  // p80 = 80th-percentile degree → nodes with degree ≥ p80 are top 20%
  // p50 = 50th-percentile degree → nodes with degree ≥ p50 are top 50%
  const p80 = degrees[Math.floor(n * 0.80)] ?? 0;
  const p50 = degrees[Math.floor(n * 0.50)] ?? 0;

  const tier1 = new Set();
  const tier2 = new Set();
  const tier3 = new Set();

  nodes.forEach(node => {
    const deg = node.connectedEdges().length;
    const id = node.id();
    if (deg >= p80)       tier1.add(id);
    else if (deg >= p50)  tier2.add(id);
    else                  tier3.add(id);
  });

  semanticZoomTiers = { tier1, tier2, tier3 };
}

// Semantic zoom is disabled when any filter or neighborhood narrows the view.
function isSemanticZoomSuppressed() {
  if (selectedNodeId !== null) return true;
  if (enabledNodeCategories.size < allCategories.size) return true;
  if (enabledEdgeFilters.size < EDGE_FILTER_GROUPS.length) return true;
  if (minConnectivity > 0) return true;
  return false;
}

// Apply or remove .sz-dim based on current zoom tier.
// This is called on zoom tier changes and after every filter change.
function applySemanticZoomVisibility() {
  if (!cy || !semanticZoomTiers) return;

  const suppressed = isSemanticZoomSuppressed();

  cy.batch(() => {
    if (suppressed) {
      // Filters/neighborhood are in control — remove any semantic dimming
      cy.elements().removeClass('sz-dim');
      lastSemanticZoomLevel = 0;
      return;
    }

    const zoom = cy.zoom();
    const level = zoom < 0.6 ? 1 : zoom < 1.0 ? 2 : 3;
    lastSemanticZoomLevel = level;

    if (level === 3) {
      // Fully zoomed in — everything visible
      cy.elements().removeClass('sz-dim');
      return;
    }

    // Dim nodes outside the current visible tier set
    cy.nodes().forEach(node => {
      const id = node.id();
      const visible =
        semanticZoomTiers.tier1.has(id) ||
        (level >= 2 && semanticZoomTiers.tier2.has(id));

      if (visible) node.removeClass('sz-dim');
      else         node.addClass('sz-dim');
    });

    // Dim edges only when BOTH endpoints are sz-dim
    cy.edges().forEach(edge => {
      const src = cy.getElementById(edge.data('source'));
      const tgt = cy.getElementById(edge.data('target'));
      if (src.hasClass('sz-dim') && tgt.hasClass('sz-dim')) {
        edge.addClass('sz-dim');
      } else {
        edge.removeClass('sz-dim');
      }
    });
  });
}

// ── Util ──────────────────────────────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
