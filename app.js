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

// Edge filter groups
const EDGE_FILTER_GROUPS = [
  'CAUSED', 'ENABLED', 'SHARES_MECHANISM_WITH', 'SELF_REINFORCES', 'other', 'speculative',
];
const EDGE_FILTER_MAIN = new Set(['CAUSED', 'ENABLED', 'SHARES_MECHANISM_WITH', 'SELF_REINFORCES']);

// ── State ─────────────────────────────────────────────────────────────────────
let cy = null;
let allNodes = [];
let allEdges = [];
let nodeMap = {};

let sidebarCollapsed = false;
let selectedNodeId = null;
let neighborhoodDepth = 1;
let enabledNodeCategories = new Set();
let enabledEdgeFilters = new Set(EDGE_FILTER_GROUPS);
let minConnectivity = 0;
let allCategories = new Set();

// Semantic zoom state
let semanticZoomTiers = null;
let lastSemanticZoomLevel = 0;

// Feature I: degree-based sizing
let maxNodeDegree = 1;

// Feature N: heat map mode
let heatMapMode = false;

// Feature J: timeline layout
let timelineMode = false;
let savedPositions = null;

// Feature K: cluster mode
let clusterMode = false;

// Feature F: region filter
let enabledRegions = new Set();
let allRegions = new Set();

// Feature A: path finder
let pathHighlightedIds = new Set();

// Feature U: quiz
let quizScore = 0;
let quizTotal = 0;

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
        aliases: n.aliases || [],                               // Feature X
        region: n.region || null,                              // Feature F
        contemporary_relevance: n.contemporary_relevance || null, // Feature R
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
        sources: e.sources || [],                              // Feature V
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

  cy.one('layoutstop', () => {
    computeSemanticZoomTiers();

    // Feature I: compute max degree and apply per-node size bypass
    maxNodeDegree = cy.nodes().reduce((m, n) => Math.max(m, n.connectedEdges().length), 0) || 1;
    applyDegreeSizes(); // explicit per-node style bypass

    const slider = document.getElementById('sb-conn-slider');
    if (slider) slider.max = Math.max(1, Math.min(maxNodeDegree, 60));

    if (cy.zoom() > 0.55) {
      cy.zoom({ level: 0.48, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
    }

    lastSemanticZoomLevel = -1;
    applySemanticZoomVisibility();
    const visNodes = cy.nodes().not('.hidden').length;
    const visEdges = cy.edges().not('.hidden').length;
    updateStats(visNodes, visEdges, allNodes.length, allEdges.length);

    loadURLState(); // Feature O
  });

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

  cy.on('tap', 'node', e => {
    const node = e.target;
    if (node.hasClass('cluster-node')) return;
    setFocus(node);
    cy.animate({ center: { eles: node } }, { duration: 250 });
    showNodePanel(node.data());
    activateNeighborhood(node.id());
    updateURLState();
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
      updateURLState();
    }
  });

  cy.on('mouseover', 'node', e => {
    const node = e.target;
    if (node.hasClass('cluster-node')) return;
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

// ── Feature I: apply degree-based node sizes via style bypass ─────────────────
// Called once after layout and again if cluster nodes are removed.
function applyDegreeSizes() {
  if (!cy) return;
  cy.batch(() => {
    cy.nodes().not('.cluster-node').forEach(node => {
      const deg = node.connectedEdges().length;
      const size = Math.max(16, Math.min(72, 16 + (deg / maxNodeDegree) * 56));
      node.style({ width: size, height: size });
    });
  });
}

// ── Neighborhood dimming ──────────────────────────────────────────────────────
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
      if (src.hasClass('dimmed') || tgt.hasClass('dimmed')) edge.addClass('dimmed');
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

// ── Focus management ──────────────────────────────────────────────────────────
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
// Note: width/height are set via per-node style bypass (applyDegreeSizes).
// Heat map colors are applied via per-node style bypass (applyHeatMapStyles).
// The stylesheet only defines base/default styles.
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
      selector: 'node.cluster-node',
      style: {
        'background-color': 'transparent',
        'background-opacity': 0.04,
        'border-width': 1,
        'border-style': 'solid',
        'border-color': 'rgba(255,255,255,0.06)',
        'shape': 'round-rectangle',
        'label': 'data(label)',
        'text-valign': 'top',
        'text-halign': 'center',
        'font-size': 9,
        'color': 'rgba(122,127,154,0.5)',
        'text-background-opacity': 0,
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
          const dx = tgt.x - src.x; const dy = tgt.y - src.y;
          return Math.max(20, Math.sqrt(dx*dx+dy*dy) - 50) + 'px';
        },
        'text-wrap': 'ellipsis',
        'width': 2.5,
      }
    },
    {
      selector: 'node.focused',
      style: {
        'border-width': 2.5,
        'border-style': 'solid',
        'border-color': '#ffffff',
        'background-opacity': ele => ele.data('node_type') === 'mechanism' ? 0.35 : 1,
      }
    },
    // Feature A: path highlight
    {
      selector: 'node.path-highlight',
      style: {
        'border-width': 3,
        'border-style': 'solid',
        'border-color': '#f6c90e',
        'opacity': 1,
      }
    },
    {
      selector: 'edge.path-highlight',
      style: {
        'line-color': '#f6c90e',
        'target-arrow-color': '#f6c90e',
        'width': 3,
        'opacity': 1,
      }
    },
    { selector: '.dimmed',     style: { 'opacity': 0.08 } },
    { selector: '.sz-dim',     style: { 'opacity': 0.06 } },
    { selector: '.highlighted',style: { 'opacity': 1    } },
    { selector: '.hidden',     style: { 'display': 'none' } },
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
        This is a pattern node — a recurring mechanism. Follow the edges to see where it appears.
       </div>`
    : '';

  // Feature X: aliases
  const aliasesHtml = (data.aliases && data.aliases.length)
    ? `<div class="panel-aliases">Also known as: ${data.aliases.map(a => escHtml(a)).join(', ')}</div>`
    : '';

  // Feature R: contemporary relevance callout
  const contemporaryHtml = data.contemporary_relevance
    ? `<div class="contemporary-relevance">
        <div class="contemporary-relevance-label">Why it matters today</div>
        <div class="contemporary-relevance-text">${escHtml(data.contemporary_relevance)}</div>
       </div>`
    : '';

  // Feature D: "What shares this mechanism?" button for mechanism nodes
  const mechanismFilterBtn = !isRef
    ? `<button class="mechanism-filter-btn" data-action="mechfilter" data-node-id="${escHtml(data.id)}">
        ⬡ Show all nodes sharing this mechanism
       </button>`
    : '';

  const regionRow = data.region
    ? `<div class="panel-meta-row">
        <span class="panel-meta-key">Region</span>
        <span class="panel-meta-val">${escHtml(data.region)}</span>
       </div>`
    : '';

  document.getElementById('panel-inner').innerHTML = `
    <span class="panel-type-badge ${data.node_type}">${data.node_type}</span>
    <div id="panel-title">${escHtml(data.label)}</div>
    ${aliasesHtml}
    <div id="panel-summary">${escHtml(data.summary)}</div>
    ${mechanismNote}
    ${contemporaryHtml}
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
      ${regionRow}
    </div>
    ${tags ? `<div class="panel-tags">${tags}</div>` : ''}
    ${mechanismFilterBtn}
    ${buildConnectionsList(data.id)}
    ${buildSuggestedConnections(data)}
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

  // Feature V: sources
  const sourcesHtml = (data.sources && data.sources.length)
    ? `<div class="panel-section-label" style="margin-top:12px">Sources</div>
       <div class="sources-list">${data.sources.map((s, i) => {
         const isUrl = /^https?:\/\//.test(s);
         return `<div class="source-item">${i+1}. ${isUrl
           ? `<a class="source-link" href="${escHtml(s)}" target="_blank" rel="noopener">${escHtml(s)}</a>`
           : escHtml(s)}</div>`;
       }).join('')}</div>`
    : '';

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
    ${sourcesHtml}
  `;

  openPanel();
}

// ── Connections list ──────────────────────────────────────────────────────────
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

// ── Feature S: Suggested Connections ─────────────────────────────────────────
function buildSuggestedConnections(data) {
  if (!cy || !data.tags || !data.tags.length) return '';

  const nodeEl = cy.getElementById(data.id);
  const connectedIds = new Set(
    nodeEl.connectedEdges().toArray().map(e => {
      const ed = e.data();
      return ed.source === data.id ? ed.target : ed.source;
    })
  );
  connectedIds.add(data.id);

  const suggestions = [];
  cy.nodes().forEach(other => {
    const otherId = other.id();
    if (connectedIds.has(otherId)) return;
    const otherData = other.data();
    if (!otherData.tags || !otherData.tags.length) return;

    const sharedTags = data.tags.filter(t => otherData.tags.includes(t));
    if (!sharedTags.length) return;

    const sameEra = data.decade && otherData.decade &&
      parseDecadeYear(data.decade) !== 2000 &&
      Math.abs(parseDecadeYear(data.decade) - parseDecadeYear(otherData.decade)) <= 20;

    suggestions.push({
      id: otherId,
      label: otherData.label,
      category: otherData.category,
      sharedTags,
      score: sharedTags.length + (sameEra ? 1 : 0),
    });
  });

  if (!suggestions.length) return '';
  suggestions.sort((a, b) => b.score - a.score);
  const top = suggestions.slice(0, 5);

  const items = top.map(s => {
    const color = CATEGORY_COLOR[s.category] || '#8c8fa8';
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

// ── Panel navigation (delegated) ──────────────────────────────────────────────
document.getElementById('panel-inner').addEventListener('click', e => {
  // Feature D: mechanism filter button
  const mfBtn = e.target.closest('[data-action="mechfilter"]');
  if (mfBtn && cy) {
    filterToMechanismShares(mfBtn.dataset.nodeId);
    return;
  }
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

// Feature D: filter to SHARES_MECHANISM_WITH neighbors of a mechanism node
function filterToMechanismShares(mechanismId) {
  if (!cy) return;
  const mechNode = cy.getElementById(mechanismId);
  if (!mechNode.length) return;
  const shareEdges = mechNode.connectedEdges().filter(e => e.data('type') === 'SHARES_MECHANISM_WITH');
  const shareNodes = shareEdges.connectedNodes();
  cy.batch(() => {
    cy.elements().removeClass('hidden dimmed');
    cy.nodes().forEach(node => {
      if (!shareNodes.has(node) && node.id() !== mechanismId) node.addClass('hidden');
    });
    cy.edges().forEach(edge => {
      if (!shareEdges.has(edge)) edge.addClass('hidden');
    });
  });
  const visNodes = cy.nodes().not('.hidden').length;
  const visEdges = cy.edges().not('.hidden').length;
  updateStats(visNodes, visEdges, allNodes.length, allEdges.length);
}

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
    document.getElementById('analytics-modal').hidden = true;
    document.getElementById('quiz-modal').hidden = true;
    closePanel();
    clearNeighborhood();
  }
});

document.getElementById('fit-btn').addEventListener('click', () => {
  if (cy) cy.animate({ fit: { padding: 60 } }, { duration: 300 });
});

document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);

function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);
  const btn = document.getElementById('sidebar-toggle');
  btn.setAttribute('aria-expanded', String(!sidebarCollapsed));
  btn.title = sidebarCollapsed ? 'Open filters panel' : 'Close filters panel';
  if (cy) setTimeout(() => cy.resize(), 270);
}

// ── Build sidebar ─────────────────────────────────────────────────────────────
function buildSidebar(nodes) {
  buildNodeTypeFilters(nodes);
  buildEdgeTypeFilters();
  buildRegionFilter(nodes);       // Feature F
  initConnectivitySlider();
  initSidebarSearch();
  initNeighborhoodControls();
  initPathFinder();               // Feature A
  initLayoutViewButtons();        // Features N, J, K
  initActionButtons();            // Features P, T, U
  initPathFinderCollapse();

  document.getElementById('sb-reset').addEventListener('click', resetAll);
}

// ── Node Type Filters ─────────────────────────────────────────────────────────
function buildNodeTypeFilters(nodes) {
  const categories = [...new Set(nodes.map(n => n.category))].sort();
  enabledNodeCategories = new Set(categories);
  allCategories = new Set(categories);

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
      updateURLState();
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
      updateURLState();
    });
    container.appendChild(row);
  });
}

// ── Feature F: Region Filter ──────────────────────────────────────────────────
function buildRegionFilter(nodes) {
  const regions = [...new Set(nodes.map(n => n.region).filter(Boolean))].sort();
  if (!regions.length) return;

  allRegions = new Set(regions);
  enabledRegions = new Set(regions);

  const section = document.getElementById('sb-region-section');
  section.hidden = false;

  const container = document.getElementById('sb-regions');
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

// ── Connectivity Slider ───────────────────────────────────────────────────────
function initConnectivitySlider() {
  const slider = document.getElementById('sb-conn-slider');
  const display = document.getElementById('sb-conn-display');
  slider.addEventListener('input', () => {
    minConnectivity = parseInt(slider.value, 10);
    display.textContent = `≥ ${minConnectivity}`;
    applyFilters();
    updateURLState();
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

  // Feature Q: Export subgraph JSON
  document.getElementById('sb-export-subgraph').addEventListener('click', exportSubgraphJSON);
}

// ── Sidebar Search (Features H, X) ───────────────────────────────────────────
function initSidebarSearch() {
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
    showDropdown(searchNodes(q, 8));
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
    } else if (e.key === 'Enter' && kbHighlighted >= 0) {
      selectSearchResult(currentResults[kbHighlighted]);
      input.value = '';
      dropdown.style.display = 'none';
    } else if (e.key === 'Escape') {
      dropdown.style.display = 'none';
      input.blur();
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(() => { dropdown.style.display = 'none'; }, 160);
  });

  window.addEventListener('resize', () => {
    if (dropdown.style.display !== 'none') positionDropdown();
  });
}

// Features H + X: search label, aliases, summary, tags
function searchNodes(query, limit) {
  if (!cy) return [];
  const q = query.toLowerCase();
  const scored = [];
  cy.nodes().forEach(node => {
    if (node.hasClass('cluster-node')) return;
    const label   = node.data('label').toLowerCase();
    const summary = (node.data('summary') || '').toLowerCase();
    const tags    = (node.data('tags') || []).join(' ').toLowerCase();
    const aliases = (node.data('aliases') || []).join(' ').toLowerCase();
    let score = 0;
    if (label.startsWith(q))                                   score = 10;
    else if (label.includes(q))                                score = 8;
    else if (label.split(/\s+/).some(w => w.startsWith(q)))    score = 7;
    else if (aliases.includes(q))                              score = 6;  // Feature X
    else if (tags.includes(q))                                 score = 4;  // Feature H
    else if (summary.includes(q))                              score = 2;  // Feature H
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
  updateURLState();
}

// ── Feature A: Path Finder ────────────────────────────────────────────────────
function initPathFinder() {
  document.getElementById('pf-find-btn').addEventListener('click', runPathFinder);
  document.getElementById('pf-clear-btn').addEventListener('click', clearPathFinder);
  document.getElementById('pf-from').addEventListener('keydown', e => {
    if (e.key === 'Enter') runPathFinder();
  });
  document.getElementById('pf-to').addEventListener('keydown', e => {
    if (e.key === 'Enter') runPathFinder();
  });
}

function initPathFinderCollapse() {
  const btn = document.getElementById('pf-collapse');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const body = document.getElementById('pf-body');
    const collapsed = body.style.display === 'none';
    body.style.display = collapsed ? '' : 'none';
    btn.textContent = collapsed ? '▴' : '▾';
  });
}

function runPathFinder() {
  if (!cy) return;
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

  const path = findPath(fromNode.id(), toNode.id());
  clearPathHighlight();

  if (!path) {
    result.innerHTML = `<span class="pf-no-path">No directed path found from <strong>${escHtml(fromNode.data('label'))}</strong> to <strong>${escHtml(toNode.data('label'))}</strong>.</span>`;
    return;
  }

  // Highlight path on graph
  pathHighlightedIds = new Set(path);
  cy.batch(() => {
    path.forEach(id => cy.getElementById(id).addClass('path-highlight'));
    for (let i = 0; i < path.length - 1; i++) {
      const src = path[i], tgt = path[i+1];
      cy.edges().forEach(edge => {
        if (edge.data('source') === src && edge.data('target') === tgt) {
          edge.addClass('path-highlight');
        }
      });
    }
  });

  // Build sidebar chain
  const steps = path.map((id, i) => {
    const nd = cy.getElementById(id).data();
    const color = CATEGORY_COLOR[nd.category] || '#8c8fa8';
    let edgeLabel = '';
    if (i < path.length - 1) {
      cy.edges().forEach(edge => {
        if (edge.data('source') === id && edge.data('target') === path[i+1]) {
          edgeLabel = edge.data('type');
        }
      });
    }
    return `
      <div class="pf-path-step" data-node-id="${escHtml(id)}">
        <span style="color:${color}; font-size:10px;">●</span>
        <span class="pf-path-node">${escHtml(nd.label)}</span>
      </div>
      ${edgeLabel ? `<div style="padding:0 6px 2px 18px"><span class="pf-path-arrow">${escHtml(edgeLabel)}</span></div>` : ''}
    `;
  }).join('');

  result.innerHTML = `<div style="margin-bottom:6px;font-size:11px;color:var(--text-muted)">Path (${path.length} nodes):</div><div class="pf-path-chain">${steps}</div>`;

  result.querySelectorAll('.pf-path-step').forEach(step => {
    step.addEventListener('click', () => {
      const nodeEl = cy.getElementById(step.dataset.nodeId);
      if (nodeEl.length) {
        setFocus(nodeEl);
        cy.animate({ center: { eles: nodeEl }, zoom: Math.max(cy.zoom(), 1.2) }, { duration: 300 });
        showNodePanel(nodeEl.data());
      }
    });
  });
}

function resolveNodeByName(name) {
  if (!cy) return null;
  const q = name.toLowerCase();
  let best = null, bestScore = 0;
  cy.nodes().forEach(node => {
    if (node.hasClass('cluster-node')) return;
    const label = node.data('label').toLowerCase();
    if (label === q && bestScore < 3)          { best = node; bestScore = 3; }
    else if (label.startsWith(q) && bestScore < 2) { best = node; bestScore = 2; }
    else if (label.includes(q) && bestScore < 1)   { best = node; bestScore = 1; }
  });
  return best;
}

function findPath(fromId, toId) {
  if (!cy) return null;
  if (fromId === toId) return [fromId];
  const queue = [[fromId]];
  const visited = new Set([fromId]);
  while (queue.length) {
    const path = queue.shift();
    if (path.length > 18) continue;
    const current = path[path.length - 1];
    const neighbors = cy.getElementById(current).outgoers('node');
    for (let i = 0; i < neighbors.length; i++) {
      const n = neighbors[i];
      if (n.hasClass('cluster-node')) continue;
      const nId = n.id();
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
  document.getElementById('pf-to').value = '';
  document.getElementById('pf-result').innerHTML = '';
  clearPathHighlight();
}

function clearPathHighlight() {
  if (!cy) return;
  cy.elements().removeClass('path-highlight');
  pathHighlightedIds.clear();
}

// ── Feature O: URL state sharing ──────────────────────────────────────────────
function updateURLState() {
  const params = new URLSearchParams();
  if (selectedNodeId) params.set('n', selectedNodeId);
  if (neighborhoodDepth !== 1) params.set('dep', neighborhoodDepth);
  if (minConnectivity > 0) params.set('conn', minConnectivity);
  if (enabledNodeCategories.size < allCategories.size) {
    params.set('cats', [...enabledNodeCategories].join(','));
  }
  if (enabledEdgeFilters.size < EDGE_FILTER_GROUPS.length) {
    params.set('edges', [...enabledEdgeFilters].join(','));
  }
  const hash = params.toString();
  try {
    history.replaceState(null, '', hash ? '#' + hash : location.pathname + location.search);
  } catch(e) { /* file:// or other restriction */ }
}

function loadURLState() {
  if (!location.hash || location.hash.length <= 1) return;
  try {
    const params = new URLSearchParams(location.hash.slice(1));

    const conn = params.get('conn');
    if (conn) {
      minConnectivity = parseInt(conn, 10) || 0;
      const slider = document.getElementById('sb-conn-slider');
      const display = document.getElementById('sb-conn-display');
      if (slider) slider.value = minConnectivity;
      if (display) display.textContent = `≥ ${minConnectivity}`;
    }

    const cats = params.get('cats');
    if (cats) {
      enabledNodeCategories = new Set(cats.split(',').filter(Boolean));
      document.querySelectorAll('[data-category]').forEach(cb => {
        cb.checked = enabledNodeCategories.has(cb.dataset.category);
      });
    }

    const edges = params.get('edges');
    if (edges) {
      enabledEdgeFilters = new Set(edges.split(',').filter(Boolean));
      document.querySelectorAll('[data-edge-filter]').forEach(cb => {
        cb.checked = enabledEdgeFilters.has(cb.dataset.edgeFilter);
      });
    }

    const dep = params.get('dep');
    if (dep) {
      neighborhoodDepth = parseInt(dep, 10) || 1;
      document.querySelectorAll('.sb-depth-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.depth === String(neighborhoodDepth));
      });
    }

    applyFilters();

    const nodeId = params.get('n');
    if (nodeId && cy) {
      const nodeEl = cy.getElementById(nodeId);
      if (nodeEl.length) {
        setFocus(nodeEl);
        cy.animate({ center: { eles: nodeEl }, zoom: Math.max(cy.zoom(), 1.2) }, { duration: 400 });
        showNodePanel(nodeEl.data());
        activateNeighborhood(nodeId);
      }
    }
  } catch (err) {
    console.warn('loadURLState error:', err);
  }
}

// ── Feature N: Heat Map Mode ──────────────────────────────────────────────────
function toggleHeatMap() {
  heatMapMode = !heatMapMode;
  document.getElementById('heatmap-btn').classList.toggle('active', heatMapMode);
  document.getElementById('heatmap-legend-inline').hidden = !heatMapMode;

  // Apply per-node style bypasses (more reliable than function-based stylesheet)
  cy.batch(() => {
    cy.nodes().not('.cluster-node').forEach(node => {
      if (heatMapMode) {
        const color = degreeToHeatColor(node);
        node.style({ 'background-color': color, 'border-color': color });
      } else {
        // Restore: empty string removes bypass, falls back to stylesheet
        const cat = node.data('category');
        const color = CATEGORY_COLOR[cat] || '#8c8fa8';
        node.style({ 'background-color': color, 'border-color': color });
      }
    });
  });
}

function degreeToHeatColor(node) {
  const deg = node.connectedEdges().length;
  const t = maxNodeDegree > 0 ? deg / maxNodeDegree : 0;
  let r, g, b;
  if (t < 0.5) {
    const u = t * 2;
    r = Math.round(u * 255);
    g = Math.round(u * 200);
    b = Math.round(220 * (1 - u));
  } else {
    const u = (t - 0.5) * 2;
    r = 255;
    g = Math.round(200 * (1 - u));
    b = 0;
  }
  return `rgb(${r},${g},${b})`;
}

// ── Feature J: Timeline Layout ────────────────────────────────────────────────
function toggleTimeline() {
  if (clusterMode) toggleCluster();
  timelineMode = !timelineMode;
  document.getElementById('timeline-btn').classList.toggle('active', timelineMode);
  const badge = document.getElementById('layout-mode-badge');

  if (timelineMode) {
    badge.textContent = 'Timeline layout';
    badge.classList.add('visible');
    applyTimelineLayout();
  } else {
    badge.classList.remove('visible');
    restoreForceLayout();
  }
}

function parseDecadeYear(decade) {
  if (!decade) return 2000;
  const m = decade.match(/(\d{4})/);
  if (m) return parseInt(m[1], 10);
  if (/ancient|classical/i.test(decade)) return 400;
  if (/medieval/i.test(decade)) return 1200;
  if (/modern/i.test(decade)) return 1600;
  return 2000;
}

function applyTimelineLayout() {
  if (!cy) return;
  savedPositions = {};
  cy.nodes().not('.cluster-node').forEach(n => {
    savedPositions[n.id()] = { ...n.position() };
  });

  const categories = [...allCategories].sort();
  const catIndex = {};
  categories.forEach((c, i) => { catIndex[c] = i; });

  const decadeGroups = {};
  cy.nodes().not('.cluster-node').forEach(node => {
    const year = parseDecadeYear(node.data('decade'));
    const dec = Math.floor(year / 10) * 10;
    if (!decadeGroups[dec]) decadeGroups[dec] = {};
    const cat = node.data('category');
    if (!decadeGroups[dec][cat]) decadeGroups[dec][cat] = [];
    decadeGroups[dec][cat].push(node.id());
  });

  const xScale = 120;
  const yScale = 100;
  const positions = {};
  cy.nodes().not('.cluster-node').forEach(node => {
    const year = parseDecadeYear(node.data('decade'));
    const dec = Math.floor(year / 10) * 10;
    const cat = node.data('category');
    const catI = catIndex[cat] || 0;
    const groupArr = (decadeGroups[dec] && decadeGroups[dec][cat]) || [];
    const posInGroup = groupArr.indexOf(node.id());
    positions[node.id()] = {
      x: (dec / 10) * xScale + (posInGroup % 3) * 28,
      y: catI * yScale + Math.floor(posInGroup / 3) * 28,
    };
  });

  cy.layout({
    name: 'preset',
    positions: node => positions[node.id()] || node.position(),
    fit: true,
    padding: 60,
    animate: true,
    animationDuration: 700,
  }).run();
}

function restoreForceLayout() {
  if (!cy) return;
  if (savedPositions) {
    cy.layout({
      name: 'preset',
      positions: node => savedPositions[node.id()] || node.position(),
      fit: true,
      padding: 60,
      animate: true,
      animationDuration: 500,
    }).run();
    savedPositions = null;
  } else {
    cy.layout({
      name: 'fcose',
      quality: 'default',
      animate: true,
      animationDuration: 800,
      fit: true,
      padding: 60,
      nodeRepulsion: 14000,
      idealEdgeLength: 280,
    }).run();
  }
}

// ── Feature K: Cluster Mode ───────────────────────────────────────────────────
function toggleCluster() {
  if (timelineMode) toggleTimeline();
  clusterMode = !clusterMode;
  document.getElementById('cluster-btn').classList.toggle('active', clusterMode);
  const badge = document.getElementById('layout-mode-badge');

  if (clusterMode) {
    badge.textContent = 'Cluster mode';
    badge.classList.add('visible');
    applyClusterLayout();
  } else {
    badge.classList.remove('visible');
    removeClusterLayout();
  }
}

function applyClusterLayout() {
  if (!cy) return;
  savedPositions = {};
  cy.nodes().not('.cluster-node').forEach(n => {
    savedPositions[n.id()] = { ...n.position() };
  });

  const categories = [...allCategories];
  cy.batch(() => {
    categories.forEach(cat => {
      if (!cy.getElementById(`__cluster_${cat}`).length) {
        cy.add({
          group: 'nodes',
          data: {
            id: `__cluster_${cat}`,
            label: cat.charAt(0).toUpperCase() + cat.slice(1),
            isCluster: true,
          },
          classes: 'cluster-node',
        });
      }
    });
    cy.nodes().not('.cluster-node').forEach(node => {
      node.move({ parent: `__cluster_${node.data('category')}` });
    });
  });

  cy.layout({
    name: 'fcose',
    quality: 'default',
    animate: true,
    animationDuration: 800,
    fit: true,
    padding: 60,
    nodeRepulsion: 6000,
    idealEdgeLength: 150,
    nestingFactor: 0.5,
  }).run();
}

function removeClusterLayout() {
  if (!cy) return;
  cy.batch(() => {
    cy.nodes().not('.cluster-node').forEach(node => node.move({ parent: null }));
    cy.remove('.cluster-node');
  });
  if (savedPositions) {
    cy.layout({
      name: 'preset',
      positions: node => savedPositions[node.id()] || node.position(),
      fit: true,
      padding: 60,
      animate: true,
      animationDuration: 500,
    }).run();
    savedPositions = null;
  }
  // Re-apply degree sizes after removing cluster nodes
  applyDegreeSizes();
}

// ── Feature P: Export PNG ─────────────────────────────────────────────────────
function exportPNG() {
  if (!cy) return;
  const blob = cy.png({ output: 'blob', bg: '#0f1117', scale: 2 });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'why-opedia-graph.png';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ── Feature Q: Export Subgraph JSON ──────────────────────────────────────────
function exportSubgraphJSON() {
  if (!cy || !selectedNodeId) return;
  const nbNodes = getNeighborhoodNodes(selectedNodeId, neighborhoodDepth);
  const nodeIds = new Set(nbNodes.map(n => n.id()));
  const exportNodes = allNodes.filter(n => nodeIds.has(n.id));
  const exportEdges = allEdges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));
  const json = JSON.stringify({ nodes: exportNodes, edges: exportEdges }, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `why-opedia-neighborhood-${selectedNodeId}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ── Feature T: Analytics Dashboard ───────────────────────────────────────────
function openAnalyticsDashboard() {
  if (!cy) return;
  const allCyNodes = cy.nodes().not('.cluster-node');
  const allCyEdges = cy.edges();

  const byDegree = allCyNodes.toArray()
    .sort((a, b) => b.connectedEdges().length - a.connectedEdges().length)
    .slice(0, 10);

  const edgeTypeCounts = {};
  allCyEdges.forEach(edge => {
    const t = edge.data('type');
    edgeTypeCounts[t] = (edgeTypeCounts[t] || 0) + 1;
  });

  const decadeCounts = {};
  allCyNodes.forEach(node => {
    const year = parseDecadeYear(node.data('decade') || '');
    const dec = Math.floor(year / 10) * 10;
    const key = `${dec}s`;
    decadeCounts[key] = (decadeCounts[key] || 0) + 1;
  });

  const totalNodes = allCyNodes.length;
  const totalEdges = allCyEdges.length;
  const mechCount = allCyNodes.filter(n => n.data('node_type') === 'mechanism').length;
  const refCount = totalNodes - mechCount;
  const maxDeg = byDegree[0] ? byDegree[0].connectedEdges().length : 1;

  function barRow(label, value, max, color) {
    const pct = Math.round((value / max) * 100);
    return `<div class="analytics-bar-row">
      <div class="analytics-bar-label" style="color:${color || 'var(--text)'}" title="${escHtml(label)}">${escHtml(label)}</div>
      <div class="analytics-bar-wrap"><div class="analytics-bar" style="width:${pct}%;background:${color || 'var(--accent)'}"></div></div>
      <div class="analytics-bar-val">${value}</div>
    </div>`;
  }

  const topNodesHtml = byDegree.map(n =>
    barRow(n.data('label'), n.connectedEdges().length, maxDeg, CATEGORY_COLOR[n.data('category')])
  ).join('');

  const maxEdgeCount = Math.max(...Object.values(edgeTypeCounts), 1);
  const edgeTypeHtml = Object.entries(edgeTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => barRow(type, count, maxEdgeCount, EDGE_COLOR[type] || EDGE_DEFAULT_COLOR))
    .join('');

  const maxDecade = Math.max(...Object.values(decadeCounts), 1);
  const decadeHtml = Object.keys(decadeCounts).sort()
    .map(dec => barRow(dec, decadeCounts[dec], maxDecade, null))
    .join('');

  document.getElementById('analytics-body').innerHTML = `
    <div class="analytics-overview">
      <div class="analytics-stat"><div class="analytics-stat-val">${totalNodes}</div><div class="analytics-stat-label">Nodes</div></div>
      <div class="analytics-stat"><div class="analytics-stat-val">${totalEdges}</div><div class="analytics-stat-label">Edges</div></div>
      <div class="analytics-stat"><div class="analytics-stat-val">${refCount}</div><div class="analytics-stat-label">Reference</div></div>
      <div class="analytics-stat"><div class="analytics-stat-val">${mechCount}</div><div class="analytics-stat-label">Mechanisms</div></div>
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

document.getElementById('analytics-close').addEventListener('click', () => {
  document.getElementById('analytics-modal').hidden = true;
});

// ── Feature U: Quiz Mode ──────────────────────────────────────────────────────
function openQuiz() {
  quizScore = 0;
  quizTotal = 0;
  renderQuizQuestion();
  document.getElementById('quiz-modal').hidden = false;
}

function renderQuizQuestion() {
  if (!cy) return;
  const edges = cy.edges().not('.hidden').toArray();
  if (edges.length < 4) {
    document.getElementById('quiz-body').innerHTML = '<p style="color:var(--text-muted)">Not enough visible edges for quiz.</p>';
    return;
  }

  const edge = edges[Math.floor(Math.random() * edges.length)];
  const edgeData = edge.data();
  const srcNode = nodeMap[edgeData.source];
  const tgtNode = nodeMap[edgeData.target];
  if (!srcNode || !tgtNode) { renderQuizQuestion(); return; }

  const correctLabel = tgtNode.label;
  const wrongNodes = allNodes.filter(n => n.id !== edgeData.target && n.id !== edgeData.source);
  const wrongs = wrongNodes.sort(() => Math.random() - 0.5).slice(0, 3).map(n => n.label);
  const options = [correctLabel, ...wrongs].sort(() => Math.random() - 0.5);

  const edgeColor = EDGE_COLOR[edgeData.type] || EDGE_DEFAULT_COLOR;
  document.getElementById('quiz-body').innerHTML = `
    <div class="quiz-score">Score: ${quizScore} / ${quizTotal}</div>
    <span class="quiz-edge-type" style="color:${edgeColor}">${escHtml(edgeData.type)}</span>
    <div class="quiz-question">
      What does <strong>${escHtml(srcNode.label)}</strong> ${edgeData.type.toLowerCase().replace(/_/g,' ')}?
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
  feedback.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'wrong');

  const scoreEl = document.querySelector('.quiz-score');
  if (scoreEl) scoreEl.textContent = `Score: ${quizScore} / ${quizTotal}`;

  const optionsDiv = document.querySelector('.quiz-options');
  if (optionsDiv) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'quiz-next-btn';
    nextBtn.textContent = quizTotal >= 10 ? 'See Results' : 'Next Question →';
    nextBtn.addEventListener('click', () => {
      if (quizTotal >= 10) showQuizResults();
      else renderQuizQuestion();
    });
    optionsDiv.replaceWith(nextBtn);
  }
}

function showQuizResults() {
  const pct = Math.round((quizScore / quizTotal) * 100);
  const grade = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good work!' : pct >= 40 ? 'Keep learning!' : 'Keep exploring!';
  document.getElementById('quiz-body').innerHTML = `
    <div class="quiz-end">
      <div class="quiz-end-score">${quizScore}/${quizTotal}</div>
      <div class="quiz-end-label">${pct}% — ${grade}</div>
      <button class="quiz-next-btn" id="quiz-restart">Play Again</button>
    </div>
  `;
  document.getElementById('quiz-restart').addEventListener('click', openQuiz);
}

document.getElementById('quiz-close').addEventListener('click', () => {
  document.getElementById('quiz-modal').hidden = true;
});

// ── Layout & View buttons (Features N, J, K) ──────────────────────────────────
function initLayoutViewButtons() {
  document.getElementById('heatmap-btn').addEventListener('click', toggleHeatMap);
  document.getElementById('timeline-btn').addEventListener('click', toggleTimeline);
  document.getElementById('cluster-btn').addEventListener('click', toggleCluster);
}

// ── Action buttons (Features P, T, U) ────────────────────────────────────────
function initActionButtons() {
  document.getElementById('export-png-btn').addEventListener('click', exportPNG);
  document.getElementById('analytics-btn').addEventListener('click', openAnalyticsDashboard);
  document.getElementById('quiz-btn').addEventListener('click', openQuiz);
}

// ── Reset All ─────────────────────────────────────────────────────────────────
function resetAll() {
  const input = document.getElementById('sb-search');
  if (input) input.value = '';
  const dropdown = document.getElementById('sb-autocomplete');
  if (dropdown) dropdown.style.display = 'none';

  setFocus(null);
  closePanel();
  clearNeighborhood();

  document.querySelectorAll('[data-category]').forEach(cb => {
    cb.checked = true;
    enabledNodeCategories.add(cb.dataset.category);
  });

  enabledEdgeFilters = new Set(EDGE_FILTER_GROUPS);
  document.querySelectorAll('[data-edge-filter]').forEach(cb => { cb.checked = true; });

  enabledRegions = new Set(allRegions);
  document.querySelectorAll('[data-region]').forEach(cb => { cb.checked = true; });

  minConnectivity = 0;
  const slider = document.getElementById('sb-conn-slider');
  const display = document.getElementById('sb-conn-display');
  if (slider) slider.value = 0;
  if (display) display.textContent = '≥ 0';

  neighborhoodDepth = 1;
  document.querySelectorAll('.sb-depth-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.depth === '1');
  });

  clearPathFinder();

  if (heatMapMode) toggleHeatMap();
  if (timelineMode) toggleTimeline();
  if (clusterMode) toggleCluster();

  applyFilters();
  updateURLState();
}

// ── Apply combined filters ────────────────────────────────────────────────────
function applyFilters() {
  if (!cy) return;

  cy.batch(() => {
    cy.elements().removeClass('hidden dimmed');

    // 1. Neighborhood dimming
    if (selectedNodeId) {
      const nbNodes = getNeighborhoodNodes(selectedNodeId, neighborhoodDepth);
      cy.nodes().not(nbNodes).addClass('dimmed');
      cy.edges().forEach(edge => {
        const src = cy.getElementById(edge.data('source'));
        const tgt = cy.getElementById(edge.data('target'));
        if (src.hasClass('dimmed') || tgt.hasClass('dimmed')) edge.addClass('dimmed');
      });
    }

    // 2. Node type filter
    cy.nodes().forEach(node => {
      if (node.hasClass('cluster-node')) return;
      if (!enabledNodeCategories.has(node.data('category'))) node.addClass('hidden');
    });

    // 3. Feature F: Region filter
    if (allRegions.size > 0 && enabledRegions.size < allRegions.size) {
      cy.nodes().not('.hidden').forEach(node => {
        if (node.hasClass('cluster-node')) return;
        const region = node.data('region');
        if (region && !enabledRegions.has(region)) node.addClass('hidden');
      });
    }

    // 4. Edge type filter
    cy.edges().forEach(edge => {
      if (!edgePassesFilter(edge)) edge.addClass('hidden');
    });

    // 5. Orphan pruning
    if (enabledEdgeFilters.size < EDGE_FILTER_GROUPS.length) {
      cy.nodes().not('.hidden').forEach(node => {
        if (node.hasClass('cluster-node')) return;
        const total = node.connectedEdges().length;
        if (total > 0 && !node.connectedEdges().some(e => edgePassesFilter(e))) {
          node.addClass('hidden');
        }
      });
    }

    // 6. Hide edges where either endpoint is hidden
    cy.edges().not('.hidden').forEach(edge => {
      const src = cy.getElementById(edge.data('source'));
      const tgt = cy.getElementById(edge.data('target'));
      if (src.hasClass('hidden') || tgt.hasClass('hidden')) edge.addClass('hidden');
    });

    // 7. Connectivity filter
    if (minConnectivity > 0) {
      cy.nodes().not('.hidden').forEach(node => {
        if (node.hasClass('cluster-node')) return;
        if (node.connectedEdges().not('.hidden').length < minConnectivity) node.addClass('hidden');
      });
      cy.edges().not('.hidden').forEach(edge => {
        const src = cy.getElementById(edge.data('source'));
        const tgt = cy.getElementById(edge.data('target'));
        if (src.hasClass('hidden') || tgt.hasClass('hidden')) edge.addClass('hidden');
      });
    }
  });

  applySemanticZoomVisibility();
  const visNodes = cy.nodes().not('.hidden').not('.cluster-node').length;
  const visEdges = cy.edges().not('.hidden').length;
  updateStats(visNodes, visEdges, allNodes.length, allEdges.length);
  updateNodeTypeCounts();
}

function edgePassesFilter(edge) {
  const type       = edge.data('type');
  const confidence = edge.data('confidence');
  if (!enabledEdgeFilters.has('speculative') && confidence === 'speculative') return false;
  if (EDGE_FILTER_MAIN.has(type)) return enabledEdgeFilters.has(type);
  return enabledEdgeFilters.has('other');
}

// ── Node Type Count Updates ───────────────────────────────────────────────────
function updateNodeTypeCounts() {
  if (!cy) return;
  const totals  = {};
  const visible = {};
  cy.nodes().forEach(n => {
    if (n.hasClass('cluster-node')) return;
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

  let szLine = '';
  if (cy && semanticZoomTiers && !isSemanticZoomSuppressed()) {
    const zoom = cy.zoom();
    const level = zoom < 0.6 ? 1 : zoom < 1.0 ? 2 : 3;
    if (level < 3) {
      const dimCount = cy.nodes().filter(n => n.hasClass('sz-dim')).length;
      const shown = cy.nodes().not('.cluster-node').length - dimCount;
      szLine = `<div class="sz-status">Showing ${shown} of ${cy.nodes().not('.cluster-node').length} nodes — zoom in to reveal more</div>`;
    }
  }

  el.innerHTML = `<div>${main}</div>${szLine}`;
}

// ── Semantic Zoom ─────────────────────────────────────────────────────────────
function computeSemanticZoomTiers() {
  if (!cy) return;
  const nodes = cy.nodes().not('.cluster-node');
  const n = nodes.length;
  if (n === 0) return;

  const degrees = nodes.map(node => node.connectedEdges().length).sort((a, b) => a - b);
  const p80 = degrees[Math.floor(n * 0.80)] ?? 0;
  const p50 = degrees[Math.floor(n * 0.50)] ?? 0;

  const tier1 = new Set(), tier2 = new Set(), tier3 = new Set();
  nodes.forEach(node => {
    const deg = node.connectedEdges().length;
    const id = node.id();
    if (deg >= p80)       tier1.add(id);
    else if (deg >= p50)  tier2.add(id);
    else                  tier3.add(id);
  });
  semanticZoomTiers = { tier1, tier2, tier3 };
}

function isSemanticZoomSuppressed() {
  if (selectedNodeId !== null) return true;
  if (enabledNodeCategories.size < allCategories.size) return true;
  if (enabledEdgeFilters.size < EDGE_FILTER_GROUPS.length) return true;
  if (minConnectivity > 0) return true;
  if (allRegions.size > 0 && enabledRegions.size < allRegions.size) return true;
  return false;
}

function applySemanticZoomVisibility() {
  if (!cy || !semanticZoomTiers) return;
  const suppressed = isSemanticZoomSuppressed();

  cy.batch(() => {
    if (suppressed) {
      cy.elements().removeClass('sz-dim');
      lastSemanticZoomLevel = 0;
      return;
    }
    const zoom = cy.zoom();
    const level = zoom < 0.6 ? 1 : zoom < 1.0 ? 2 : 3;
    lastSemanticZoomLevel = level;

    if (level === 3) { cy.elements().removeClass('sz-dim'); return; }

    cy.nodes().forEach(node => {
      if (node.hasClass('cluster-node')) return;
      const id = node.id();
      const visible = semanticZoomTiers.tier1.has(id) || (level >= 2 && semanticZoomTiers.tier2.has(id));
      if (visible) node.removeClass('sz-dim');
      else         node.addClass('sz-dim');
    });

    cy.edges().forEach(edge => {
      const src = cy.getElementById(edge.data('source'));
      const tgt = cy.getElementById(edge.data('target'));
      if (src.hasClass('sz-dim') && tgt.hasClass('sz-dim')) edge.addClass('sz-dim');
      else edge.removeClass('sz-dim');
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
