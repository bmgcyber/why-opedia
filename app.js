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

// ── State ─────────────────────────────────────────────────────────────────────
let cy = null;
let allNodes = [];
let allEdges = [];
let nodeMap = {};
let activeCategories = new Set();  // multi-select
let searchQuery = '';

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
  buildFilterButtons(nodes);
  initSearch();
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
      nodeRepulsion: 9500,
      idealEdgeLength: 220,
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

  // ── Interaction ─────────────────────────────────────────────────────────────
  cy.on('tap', 'node', e => {
    setFocus(e.target);
    cy.animate({ center: { eles: e.target } }, { duration: 250 });
    showNodePanel(e.target.data());
  });

  cy.on('tap', 'edge', e => {
    setFocus(e.target);
    showEdgePanel(e.target.data());
  });

  cy.on('tap', e => {
    if (e.target === cy) {
      setFocus(null);
      closePanel();
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
    cy.elements().removeClass('dimmed highlighted');
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
    cy.elements().removeClass('dimmed highlighted');
  });
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
        // No label by default — reduces clutter; shown via .focused and .highlighted below
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
  if (e.key === 'Escape') closePanel();
});

// ── Fit / reset view ──────────────────────────────────────────────────────────
document.getElementById('fit-btn').addEventListener('click', () => {
  if (cy) cy.animate({ fit: { padding: 60 } }, { duration: 300 });
});

// ── Category filter buttons ───────────────────────────────────────────────────
function buildFilterButtons(nodes) {
  const categories = [...new Set(nodes.map(n => n.category))].sort();
  const container = document.getElementById('filters');

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = cat;
    btn.dataset.category = cat;
    btn.style.setProperty('--cat-color', CATEGORY_COLOR[cat] || '#8c8fa8');
    btn.addEventListener('click', () => toggleCategoryFilter(cat, btn));
    container.appendChild(btn);
  });
}

function toggleCategoryFilter(cat, btn) {
  if (activeCategories.has(cat)) {
    activeCategories.delete(cat);
    btn.classList.remove('active');
  } else {
    activeCategories.add(cat);
    btn.classList.add('active');
  }
  applyFilters();
}

// ── Search ────────────────────────────────────────────────────────────────────
function initSearch() {
  const input = document.getElementById('search');
  input.addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    applyFilters();
  });
}

// ── Apply combined filters ────────────────────────────────────────────────────
function applyFilters() {
  if (!cy) return;

  cy.batch(() => {
    cy.elements().removeClass('hidden');

    cy.nodes().forEach(node => {
      const d = node.data();
      const matchesCategory = activeCategories.size === 0 || activeCategories.has(d.category);
      const matchesSearch = !searchQuery ||
        d.label.toLowerCase().includes(searchQuery) ||
        (d.tags || []).some(t => t.toLowerCase().includes(searchQuery)) ||
        (d.summary || '').toLowerCase().includes(searchQuery);

      if (!matchesCategory || !matchesSearch) {
        node.addClass('hidden');
      }
    });

    cy.edges().forEach(edge => {
      const src = cy.getElementById(edge.data('source'));
      const tgt = cy.getElementById(edge.data('target'));
      if (src.hasClass('hidden') || tgt.hasClass('hidden')) {
        edge.addClass('hidden');
      }
    });
  });

  const visNodes = cy.nodes().not('.hidden').length;
  const visEdges = cy.edges().not('.hidden').length;
  updateStats(visNodes, visEdges, allNodes.length, allEdges.length);
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function updateStats(nodes, edges, totalNodes, totalEdges) {
  const el = document.getElementById('stats');
  if (totalNodes !== undefined && (nodes !== totalNodes || edges !== totalEdges)) {
    el.textContent = `${nodes}/${totalNodes} nodes · ${edges}/${totalEdges} edges`;
  } else {
    el.textContent = `${nodes} nodes · ${edges} edges`;
  }
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
