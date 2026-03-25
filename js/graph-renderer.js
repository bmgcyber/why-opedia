(function () {
'use strict';

// ── graph-renderer.js
// All 3d-force-graph configuration and Three.js rendering logic.
// Depends on: THREE (global from three.min.js CDN), ForceGraph3D (global), d3 (global)

// ── Color maps ─────────────────────────────────────────────────────────────────
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

// ── Module state ──────────────────────────────────────────────────────────────
let graphInstance = null;
let container = null;
let currentGraphData = { nodes: [], links: [] };
let maxNodeDegree = 1;

// Selection / hover tracking
let hoveredNodeId  = null;
let selectedNodeId = null;

// Portal material references for pulsing animation
const portalMaterials = [];
let pulsePhase = 0;

// Semantic zoom (distance-based node tier visibility)
// Tier 1 = top 25% by degree (always visible)
// Tier 2 = next 35%         (visible at dist ≤ 500)
// Tier 3 = rest             (visible at dist ≤ 200)
const nodeTiers = {};
let semanticZoomActive = false;

// Label sprites (id → sprite)
const labelSprites = {};

// ── External callbacks (set by app.js) ───────────────────────────────────────
let onNodeClickCb  = null;
let onNodeDblClickCb = null;
let onNodeHoverCb  = null;
let onLinkClickCb  = null;
let onBgClickCb    = null;

// ── Init ──────────────────────────────────────────────────────────────────────
function initRenderer(containerEl) {
  container = containerEl;

  graphInstance = ForceGraph3D({ controlType: 'orbit', rendererConfig: { antialias: true } })(container)
    .backgroundColor('#0d1117')
    // Node geometry / appearance
    .nodeId('id')
    .nodeLabel(() => '')                 // suppress default tooltip; we use our own
    .nodeThreeObject(buildNodeObject)
    .nodeThreeObjectExtend(false)
    // Edge appearance
    .linkSource('source')
    .linkTarget('target')
    .linkColor(link => edgeColor(link))
    .linkWidth(link => link.confidence === 'speculative' ? 0.5 : 1.2)
    .linkOpacity(0.35)
    .linkDirectionalArrowLength(4)
    .linkDirectionalArrowRelPos(0.88)
    .linkDirectionalArrowColor(link => edgeColor(link))
    .linkDirectionalParticles(1)
    .linkDirectionalParticleColor(link => edgeColor(link))
    .linkDirectionalParticleWidth(1.5)
    .linkDirectionalParticleSpeed(0.005)
    // Events
    .onNodeClick(handleNodeClick)
    .onNodeHover(handleNodeHover)
    .onLinkClick(handleLinkClick)
    .onBackgroundClick(handleBgClick)
    // Force simulation
    .d3AlphaDecay(0.02)
    .d3VelocityDecay(0.3)
    .warmupTicks(100)
    .cooldownTicks(200);

  // Customize forces after creation
  graphInstance
    .d3Force('charge', d3.forceManyBody().strength(-120))
    .d3Force('link',   d3.forceLink().distance(link =>
      link.type === 'SHARES_MECHANISM_WITH' ? 150 : 80
    ))
    .d3Force('collision', d3.forceCollide().radius(n => (n.__size || 8) + 5));

  // Scene extras: fog, lights, star field
  const scene = graphInstance.scene();
  scene.fog = new THREE.FogExp2(0x0d1117, 0.002);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(200, 300, 200);
  scene.add(dirLight);

  addStarField(scene);

  // Portal pulsing animation (doesn't interfere with 3d-force-graph's RAF loop)
  setInterval(() => {
    pulsePhase += 0.05;
    const pulse = 0.3 + 0.7 * Math.abs(Math.sin(pulsePhase));
    for (const mat of portalMaterials) {
      mat.emissiveIntensity = pulse;
    }
  }, 50);

  // Label visibility + semantic zoom update when camera moves
  function onCameraChange() {
    updateLabelVisibility();
    applySemanticZoom();
  }
  graphInstance.controls().addEventListener('change', onCameraChange);
  graphInstance.onEngineStop(onCameraChange);

  return graphInstance;
}

// ── Node object factory ───────────────────────────────────────────────────────
function buildNodeObject(node) {
  const isPortal   = node.category === 'portal';
  const isGhost    = node.ghost === true;
  const isMechanism = ['mechanism', 'ideology', 'phenomenon'].includes(node.category);

  // Compute size
  const degree = node.__degree || 0;
  const size   = 3 + (degree / Math.max(maxNodeDegree, 1)) * 12;
  node.__size  = size;

  const group = new THREE.Group();

  if (isPortal) {
    // Portal: glowing sphere with pulsing emissive
    const geo = new THREE.SphereGeometry(size * 1.4, 20, 20);
    const mat = new THREE.MeshPhongMaterial({
      color:             0xffffff,
      emissive:          0x8888ff,
      emissiveIntensity: 0.6,
      transparent:       true,
      opacity:           0.85,
    });
    portalMaterials.push(mat);
    group.add(new THREE.Mesh(geo, mat));

    // Outer wireframe ring
    const ringGeo = new THREE.TorusGeometry(size * 1.8, 0.8, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xaaaaff, wireframe: false, transparent: true, opacity: 0.3 });
    group.add(new THREE.Mesh(ringGeo, ringMat));
  } else if (isGhost) {
    // Ghost: semi-transparent sphere + wireframe shell
    const color = categoryColor(node.category);
    const geo = new THREE.SphereGeometry(size, 16, 16);
    const mat = new THREE.MeshPhongMaterial({
      color,
      transparent: true,
      opacity:     0.25,
    });
    group.add(new THREE.Mesh(geo, mat));

    const wireMat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.5 });
    group.add(new THREE.Mesh(geo.clone(), wireMat));
  } else if (isMechanism) {
    // Mechanism: diamond-ish (octahedron) with category color, slightly transparent
    const color = categoryColor(node.category);
    const geo = new THREE.OctahedronGeometry(size * 1.1, 0);
    const mat = new THREE.MeshPhongMaterial({
      color,
      transparent: true,
      opacity:     0.75,
      shininess:   80,
    });
    group.add(new THREE.Mesh(geo, mat));
  } else {
    // Regular node: sphere with category color
    const color = categoryColor(node.category);
    const geo = new THREE.SphereGeometry(size, 16, 16);
    const mat = new THREE.MeshPhongMaterial({ color, shininess: 60 });
    group.add(new THREE.Mesh(geo, mat));
  }

  // Add label sprite (hidden by default; shown near camera)
  const sprite = makeLabelSprite(node.label || node.id, isPortal ? '#ccccff' : '#c8cce0', size);
  sprite.visible = false;
  group.add(sprite);
  labelSprites[node.id] = sprite;

  return group;
}

// ── Label sprite factory ──────────────────────────────────────────────────────
function makeLabelSprite(text, color, nodeSize) {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 56;
  const ctx = canvas.getContext('2d');

  // Background pill
  ctx.fillStyle = 'rgba(13, 17, 23, 0.75)';
  roundRect(ctx, 0, 0, canvas.width, canvas.height, 8);
  ctx.fill();

  // Text
  ctx.font = 'bold 20px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = color || '#c8cce0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const label = text.length > 24 ? text.slice(0, 23) + '…' : text;
  ctx.fillText(label, canvas.width / 2, canvas.height / 2);

  const texture  = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, depthWrite: false, transparent: true });
  const sprite   = new THREE.Sprite(material);
  sprite.scale.set(28, 5, 1);
  sprite.position.y = nodeSize + 7;
  return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── Label visibility (camera-distance-based LOD) ──────────────────────────────
function updateLabelVisibility() {
  if (!graphInstance) return;
  const cam = graphInstance.camera();
  const camPos = cam.position;

  const nodes = currentGraphData.nodes;
  for (const node of nodes) {
    const sprite = labelSprites[node.id];
    if (!sprite) continue;

    const nx = node.x || 0, ny = node.y || 0, nz = node.z || 0;
    const dist = Math.sqrt(
      (camPos.x - nx) ** 2 + (camPos.y - ny) ** 2 + (camPos.z - nz) ** 2
    );

    // Show label when camera is within 180 units, always show portal labels
    const showDist = node.category === 'portal' ? 600 : 180;
    sprite.visible = dist < showDist;
  }
}

// ── Star field ────────────────────────────────────────────────────────────────
function addStarField(scene) {
  const starCount = 800;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 4000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4000;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0x888899, size: 1.5, sizeAttenuation: true });
  scene.add(new THREE.Points(geo, mat));
}

// ── Semantic zoom ────────────────────────────────────────────────────────────
// Assigns tier 1/2/3 to nodes by degree rank. Portals and ghosts are always
// tier 1 (always visible regardless of camera distance).
function computeTiers(nodes) {
  for (const k of Object.keys(nodeTiers)) delete nodeTiers[k];

  const rankable = [...nodes]
    .filter(n => n.category !== 'portal' && !n.ghost)
    .sort((a, b) => (b.__degree || 0) - (a.__degree || 0));
  const count = rankable.length;

  rankable.forEach((n, i) => {
    nodeTiers[n.id] = i < count * 0.25 ? 1 : i < count * 0.60 ? 2 : 3;
  });
}

// Called from filter-manager to enable/disable distance-based visibility.
// When enabled, camera distance drives visibility. When disabled, the caller
// controls visibility via setNodeVisibility/dimToNeighborhood.
function setSemanticZoom(enabled) {
  semanticZoomActive = enabled;
  if (enabled) applySemanticZoom();
}

function applySemanticZoom() {
  if (!semanticZoomActive || !graphInstance) return;
  const dist = graphInstance.camera().position.length();
  graphInstance.nodeVisibility(n => {
    if (n.category === 'portal' || n.ghost) return true;
    const tier = nodeTiers[n.id] || 1;
    if (dist > 500) return tier === 1;
    if (dist > 200) return tier <= 2;
    return true;
  });
}

// ── Load graph data ───────────────────────────────────────────────────────────
function loadGraphData(nodes, edges) {
  // Compute degrees
  const degMap = {};
  for (const e of edges) {
    degMap[e.source] = (degMap[e.source] || 0) + 1;
    degMap[e.target] = (degMap[e.target] || 0) + 1;
  }
  maxNodeDegree = Math.max(...Object.values(degMap), 1);

  // Enrich nodes with degree
  for (const n of nodes) {
    n.__degree = degMap[n.id] || 0;
  }

  // Assign semantic zoom tiers
  computeTiers(nodes);

  // Convert edges to links (3d-force-graph uses 'source'/'target' but may need to re-resolve)
  const links = edges.map(e => ({
    ...e,
    source: e.source,
    target: e.target,
  }));

  currentGraphData = { nodes, links };

  // Clear old label sprites
  for (const key of Object.keys(labelSprites)) delete labelSprites[key];
  portalMaterials.length = 0;

  graphInstance.graphData(currentGraphData);

  return currentGraphData;
}

// ── Highlight / selection API ─────────────────────────────────────────────────
function highlightNode(nodeId) {
  hoveredNodeId = nodeId;
  refreshOpacity();
}

function selectNode(nodeId) {
  selectedNodeId = nodeId;
  refreshOpacity();
}

function clearSelection() {
  selectedNodeId = null;
  hoveredNodeId  = null;
  refreshOpacity();
}

function refreshOpacity() {
  if (!graphInstance) return;

  const focusId = selectedNodeId || hoveredNodeId;
  if (!focusId) {
    // Reset everything
    graphInstance.nodeOpacity(0.92);
    graphInstance.linkOpacity(0.35);
    return;
  }

  // Build neighbor set
  const neighborIds = new Set([focusId]);
  for (const link of currentGraphData.links) {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    if (s === focusId) neighborIds.add(t);
    if (t === focusId) neighborIds.add(s);
  }

  graphInstance.nodeOpacity(node =>
    neighborIds.has(node.id) ? 0.95 : 0.06
  );
  graphInstance.linkOpacity(link => {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    return (neighborIds.has(s) && neighborIds.has(t)) ? 0.9 : 0.04;
  });
}

// ── Path highlight ────────────────────────────────────────────────────────────
function highlightPath(nodeIds, edgePairs) {
  const nodeSet = new Set(nodeIds);
  graphInstance.nodeOpacity(n => nodeSet.has(n.id) ? 0.95 : 0.06);
  graphInstance.linkOpacity(link => {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    return edgePairs.some(([a, b]) => a === s && b === t) ? 1.0 : 0.04;
  });
}

function clearPathHighlight() {
  graphInstance.nodeOpacity(0.92);
  graphInstance.linkOpacity(0.35);
}

// ── Neighborhood dimming ──────────────────────────────────────────────────────
function dimToNeighborhood(rootId, depth, nodeMap, edgeMap) {
  const neighbors = getNeighborIds(rootId, depth, nodeMap, edgeMap);
  graphInstance.nodeOpacity(n => neighbors.has(n.id) ? 0.95 : 0.06);
  graphInstance.linkOpacity(link => {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    return (neighbors.has(s) && neighbors.has(t)) ? 0.9 : 0.04;
  });
}

function getNeighborIds(rootId, depth, nodeMap, edgeMap) {
  const result = new Set([rootId]);
  let frontier = new Set([rootId]);
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

// ── Camera controls ───────────────────────────────────────────────────────────
function fitCamera() {
  graphInstance.zoomToFit(400, 80);
}

function focusOnNode(node, zoom) {
  const distance = zoom || 150;
  const nx = node.x || 0, ny = node.y || 0, nz = node.z || 0;
  const mag = Math.hypot(nx, ny, nz) || 1;  // guard against zero (node at origin)
  const distRatio = 1 + distance / mag;
  graphInstance.cameraPosition(
    { x: nx * distRatio, y: ny * distRatio, z: nz * distRatio },
    { x: nx, y: ny, z: nz },
    600
  );
}

// ── Event handlers ────────────────────────────────────────────────────────────
let clickTimer = null;

function handleNodeClick(node, event) {
  // Detect double-click via event.detail (2nd click in rapid succession)
  if (event && event.detail >= 2) {
    if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
    if (onNodeDblClickCb) onNodeDblClickCb(node);
    return;
  }
  // Debounce single click: wait 220ms to see if a second click arrives
  if (clickTimer) clearTimeout(clickTimer);
  clickTimer = setTimeout(() => {
    clickTimer = null;
    if (onNodeClickCb) onNodeClickCb(node);
  }, 220);
}

function handleNodeHover(node) {
  container.style.cursor = node ? 'pointer' : 'default';
  if (!selectedNodeId) {
    hoveredNodeId = node ? node.id : null;
    refreshOpacity();
  }
  if (onNodeHoverCb) onNodeHoverCb(node);
}

function handleLinkClick(link) {
  if (onLinkClickCb) onLinkClickCb(link);
}

function handleBgClick() {
  if (onBgClickCb) onBgClickCb();
}

// ── Callback setters ──────────────────────────────────────────────────────────
function onNodeClick(fn)    { onNodeClickCb    = fn; }
function onNodeDblClick(fn) { onNodeDblClickCb = fn; }
function onNodeHover(fn)    { onNodeHoverCb    = fn; }
function onLinkClick(fn)    { onLinkClickCb    = fn; }
function onBgClick(fn)      { onBgClickCb      = fn; }

// ── Filter visibility ─────────────────────────────────────────────────────────
function setNodeVisibility(predicate) {
  graphInstance.nodeVisibility(predicate);
}

function setLinkVisibility(predicate) {
  graphInstance.linkVisibility(predicate);
}

function resetVisibility() {
  graphInstance.nodeVisibility(true);
  graphInstance.linkVisibility(true);
  graphInstance.nodeOpacity(0.92);
  graphInstance.linkOpacity(0.35);
}

// ── Utility ───────────────────────────────────────────────────────────────────
function categoryColor(cat) {
  const hex = CATEGORY_COLOR[cat] || '#8c8fa8';
  return parseInt(hex.replace('#', ''), 16);
}

function edgeColor(link) {
  return EDGE_COLOR[link.type] || EDGE_DEFAULT_COLOR;
}

function getGraphInstance() { return graphInstance; }
function getCurrentData()   { return currentGraphData; }

// Export PNG
function exportPNG() {
  if (!graphInstance) return;
  const canvas = graphInstance.renderer().domElement;
  const dataURL = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'why-opedia-graph.png';
  a.click();
}

// ── Public API ────────────────────────────────────────────────────────────────
window.GraphRenderer = {
  CATEGORY_COLOR,
  EDGE_COLOR,
  EDGE_DEFAULT_COLOR,

  initRenderer,
  loadGraphData,

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
  exportPNG,

  getGraphInstance,
  getCurrentData,
};

})();
