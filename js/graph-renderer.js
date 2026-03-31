(function () {
'use strict';

// ── graph-renderer.js
// All 3d-force-graph configuration and Three.js rendering logic.
// Depends on: THREE (global from three.min.js CDN), ForceGraph3D (global), d3 (global)

/* eslint-disable no-undef */
const THREE = window.THREE;
if (!THREE) throw new Error('Three.js not loaded — check CDN script in index.html');

const isMobile = navigator.maxTouchPoints > 0 || /Mobi/i.test(navigator.userAgent);

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

// ── Edge-type neighbor opacity weights (Feature 1: Smart Highlight) ──────────
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
  REACTIVATED:           0.65,
  SELF_REINFORCES:       0.55,
  SHARES_MECHANISM_WITH: 0.08,
};
const DEFAULT_NEIGHBOR_OPACITY = 0.55;
const DIM_OPACITY = 0.05;

// ── Direct opacity / visibility helpers ──────────────────────────────────────
// graphInstance.nodeOpacity(fn) does not reliably apply to custom nodeThreeObject
// groups. We bypass the library and traverse materials directly via node.__threeObj.
// applyLinkVisibility(fn) similarly may not take immediate effect on
// settled graphs — we also set obj.visible directly on the link THREE object.
function applyNodeOpacity(opacityFn) {
  if (!graphInstance || !currentGraphData) return;
  // Also update the library accessor so it stays consistent on future ticks.
  graphInstance.nodeOpacity(opacityFn);
  // Immediate effect: traverse each node's THREE object materials directly.
  for (const node of currentGraphData.nodes) {
    const obj = node.__threeObj;
    if (!obj) continue;
    const opacity = typeof opacityFn === 'function' ? opacityFn(node) : opacityFn;
    obj.traverse(child => {
      if (child.isMesh && child.material) {
        child.material.opacity = opacity;
        child.material.transparent = opacity < 1;
        child.material.needsUpdate = true;
      }
    });
  }
}

function applyLinkVisibility(visibilityFn) {
  if (!graphInstance || !currentGraphData) return;
  graphInstance.linkVisibility(visibilityFn);
  const fn = typeof visibilityFn === 'function' ? visibilityFn : () => !!visibilityFn;
  for (const link of currentGraphData.links) {
    const visible = fn(link);
    // getLinkObject() is the public API; __lineObj is the internal fallback
    const obj = (typeof graphInstance.getLinkObject === 'function'
      ? graphInstance.getLinkObject(link)
      : null) || link.__lineObj;
    if (obj) obj.visible = !!visible;
  }
}

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

// Cross-scope mechanism material references for slow emissive pulse
const mechMaterials = [];
let mechPulsePhase = 0;

// Semantic zoom (distance-based node tier visibility)
// Tier 1 = top 25% by degree (always visible)
// Tier 2 = next 35%         (visible at dist ≤ 500)
// Tier 3 = rest             (visible at dist ≤ 200)
const nodeTiers = {};
let semanticZoomActive = false;

// Label sprites (id → sprite)
const labelSprites = {};

// Label texture cache — persists across scope changes (texture = f(text, color) only)
const labelTextureCache = {};

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
    .numDimensions(3)
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
    .linkDirectionalArrowLength(isMobile ? 0 : 4)
    .linkDirectionalArrowRelPos(0.88)
    .linkDirectionalArrowColor(link => edgeColor(link))
    .linkDirectionalParticles(isMobile ? 0 : 1)
    .linkDirectionalParticleColor(link => edgeColor(link))
    .linkDirectionalParticleWidth(1.5)
    .linkDirectionalParticleSpeed(0.005)
    .linkLabel(link => link.type ? link.type.replace(/_/g, ' ') : '')
    // Events
    .onNodeClick(handleNodeClick)
    .onNodeHover(handleNodeHover)
    .onLinkClick(handleLinkClick)
    .onBackgroundClick(handleBgClick)
    // Force simulation
    .d3AlphaDecay(0.02)
    .d3VelocityDecay(0.25)
    .warmupTicks(isMobile ? 50 : 150)
    .cooldownTicks(200);

  // Configure the library's EXISTING 3D force instances — do NOT replace them with
  // forces from the CDN d3 package (d3 v7 is 2D-only: forceManyBody/forceLink there
  // only touch vx/vy, never vz, which collapses the graph to a flat plane).
  // graphInstance.d3Force('name') with no second arg returns the existing instance.
  const chargeForce = graphInstance.d3Force('charge');
  if (chargeForce) chargeForce.strength(-300);

  const linkForce = graphInstance.d3Force('link');
  if (linkForce) linkForce.distance(link =>
    link.type === 'SHARES_MECHANISM_WITH' ? 280 : 140
  );

  // Remove the default center force — it pulls everything to z=0 and fights z spread.
  // The random initial positions + charge repulsion provide adequate centering.
  graphInstance.d3Force('center', null);

  // Scene extras: fog, lights, star field
  const scene = graphInstance.scene();
  // Fog removed — it faded the graph out on zoom, making it impossible to see at distance.

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(200, 300, 200);
  scene.add(dirLight);

  addStarField(scene);

  // Combined pulse animation — portals (6.3s period) + mechanism nodes (20.1s period).
  // mechPulsePhase increment scaled from 0.025@80ms → 0.015625@50ms to preserve same period.
  setInterval(() => {
    pulsePhase += 0.05;
    const portalPulse = 0.3 + 0.7 * Math.abs(Math.sin(pulsePhase));
    for (const mat of portalMaterials) mat.emissiveIntensity = portalPulse;

    mechPulsePhase += 0.015625;
    const mechPulse = 0.15 + 0.35 * Math.abs(Math.sin(mechPulsePhase));
    for (const mat of mechMaterials) mat.emissiveIntensity = mechPulse;
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
  const isCrossScopeMech = node.cross_scope && isMechanism;

  // Compute size — cross-scope mechanism nodes get 1.5x base before degree scaling
  const degree     = node.__degree || 0;
  const baseRadius = isCrossScopeMech ? 3 * 1.5 : 3;
  const size       = baseRadius + (degree / Math.max(maxNodeDegree, 1)) * 12;
  node.__size      = size;

  const group = new THREE.Group();

  if (isPortal) {
    // Portal: glowing sphere with pulsing emissive
    const geo = new THREE.SphereGeometry(size * (isMobile ? 2.0 : 1.4), 20, 20);
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
    const seg = isMobile ? 8 : 16;
    const geo = new THREE.SphereGeometry(size, seg, seg);
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
    if (isCrossScopeMech) {
      mat.emissive = new THREE.Color(CATEGORY_COLOR[node.category] || '#a96ce6');
      mat.emissiveIntensity = 0.2;
      mechMaterials.push(mat);
    }
    group.add(new THREE.Mesh(geo, mat));
  } else {
    // Regular node: sphere with category color
    const color = categoryColor(node.category);
    const seg = isMobile ? 8 : 16;
    const geo = new THREE.SphereGeometry(size, seg, seg);
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
  // Texture depends only on text + color — cache across scope changes to avoid
  // recreating 1000+ canvas elements on every scope navigation.
  const cacheKey = text + '|' + (color || '#c8cce0');
  let texture = labelTextureCache[cacheKey];
  if (!texture) {
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

    texture = new THREE.CanvasTexture(canvas);
    labelTextureCache[cacheKey] = texture;
  }

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
// When enabled, camera distance drives tier visibility. When disabled, the caller
// controls visibility via setNodeVisibility / dimToNeighborhood.
function setSemanticZoom(enabled) {
  semanticZoomActive = !!enabled;
  if (semanticZoomActive) applySemanticZoom();
}

// Camera-distance-based LOD. Only active when no filters are applied (semanticZoomActive=true).
// Writes directly to node.__threeObj.visible — does NOT call graphInstance.nodeVisibility()
// (which would trigger a full re-render and fight the filter system).
//
// Distance thresholds (camera dist from scene origin):
//   Tier 1 (top 25% by degree): always visible
//   Tier 2 (next 35%):          visible when dist < 1200
//   Tier 3 (bottom 40%):        visible when dist < 400
// Portals, ghosts, and mechanism nodes (not in nodeTiers) are always visible.
function isTierVisible(tier, dist) {
  return tier === 1 || (tier === 2 && dist < 1200) || (tier === 3 && dist < 400);
}

function applySemanticZoom() {
  if (!semanticZoomActive) return;
  if (!graphInstance || !currentGraphData) return;
  if (currentGraphData.nodes.length <= 200) return;

  const camera = graphInstance.camera();
  if (!camera) return;
  const dist = camera.position.length();

  // Hide/show nodes by tier
  for (const node of currentGraphData.nodes) {
    const obj = node.__threeObj;
    if (!obj) continue;
    const tier = nodeTiers[node.id];
    if (tier === undefined) { obj.visible = true; continue; }  // portals, ghosts, mechanisms
    obj.visible = isTierVisible(tier, dist);
  }

  // Hide links whose endpoints are LOD-hidden so edges don't float in space
  graphInstance.linkVisibility(link => {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    const sTier = nodeTiers[s];
    const tTier = nodeTiers[t];
    const sOk = sTier === undefined || isTierVisible(sTier, dist);
    const tOk = tTier === undefined || isTierVisible(tTier, dist);
    return sOk && tOk;
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

  // Filter out edges referencing nodes not in this load set (orphaned cross-scope refs)
  // before passing to the force simulation — invalid edges cause NaN forces and node scatter.
  const validIds = new Set(nodes.map(n => n.id));
  const links = edges
    .filter(e => validIds.has(e.source) && validIds.has(e.target))
    .map(e => ({
      ...e,
      source: e.source,
      target: e.target,
    }));

  // Randomize initial 3D positions so force sim starts with z-spread
  nodes.forEach(node => {
    if (node.x === undefined) node.x = (Math.random() - 0.5) * 400;
    if (node.y === undefined) node.y = (Math.random() - 0.5) * 400;
    if (node.z === undefined) node.z = (Math.random() - 0.5) * 400;
  });

  currentGraphData = { nodes, links };

  // Clear old label sprites and material references.
  // NOTE: labelTextureCache is intentionally NOT cleared — textures are valid across scopes.
  for (const key of Object.keys(labelSprites)) delete labelSprites[key];
  portalMaterials.length = 0;
  mechMaterials.length = 0;

  // Adaptive simulation parameters — scale aggressiveness to graph size.
  // Large graphs (500+ nodes): fast convergence, no particles/arrows (unreadable at scale).
  // Medium graphs (200-500): moderate. Small: full quality.
  const nodeCount = nodes.length;
  const isLarge  = nodeCount > 500;
  const isMedium = nodeCount > 200 && !isLarge;
  graphInstance
    .d3AlphaDecay(isLarge ? 0.05 : isMedium ? 0.03 : 0.02)
    .d3VelocityDecay(isLarge ? 0.4 : isMedium ? 0.3 : 0.25)
    .warmupTicks(isLarge ? (isMobile ? 20 : 50) : isMedium ? 100 : (isMobile ? 50 : 150))
    .cooldownTicks(isLarge ? 100 : isMedium ? 150 : 200)
    .linkDirectionalParticles(isLarge || isMobile ? 0 : 1)
    .linkDirectionalArrowLength(isLarge || isMobile ? 0 : 4);

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
    applyNodeOpacity(0.92);
    applyLinkVisibility(true);
    graphInstance.linkOpacity(0.35);
    return;
  }

  // Build neighbor opacity map: focusId = 1.0, neighbors weighted by edge type.
  // If a node is reachable via multiple edge types, keep the highest opacity.
  const neighborOpacities = new Map([[focusId, 1.0]]);

  for (const link of currentGraphData.links) {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    if (s !== focusId && t !== focusId) continue;

    const neighborId = s === focusId ? t : s;
    const edgeOp = TYPE_OPACITY[link.type] !== undefined
      ? TYPE_OPACITY[link.type]
      : DEFAULT_NEIGHBOR_OPACITY;
    const current = neighborOpacities.get(neighborId) || 0;
    if (edgeOp > current) neighborOpacities.set(neighborId, edgeOp);
  }

  applyNodeOpacity(node => neighborOpacities.get(node.id) ?? DIM_OPACITY);
  // linkOpacity() only accepts scalars in this library — use linkVisibility to
  // hide all edges not directly touching the selected node.
  applyLinkVisibility(link => {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    return s === focusId || t === focusId;
  });
  graphInstance.linkOpacity(0.7);
}

// ── Path highlight ────────────────────────────────────────────────────────────
function highlightPath(nodeIds, edgePairs) {
  const nodeSet = new Set(nodeIds);
  applyNodeOpacity(n => nodeSet.has(n.id) ? 0.95 : 0.06);
  applyLinkVisibility(link => {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    return edgePairs.some(([a, b]) => a === s && b === t);
  });
  graphInstance.linkOpacity(0.9);
}

function clearPathHighlight() {
  applyNodeOpacity(0.92);
  applyLinkVisibility(true);
  graphInstance.linkOpacity(0.35);
}

// ── Neighborhood dimming ──────────────────────────────────────────────────────
function dimToNeighborhood(rootId, depth, nodeMap, edgeMap) {
  const allNeighbors = getNeighborIds(rootId, depth, nodeMap, edgeMap);

  // Direct (depth-1) neighbors from rootId get type-based opacity; deeper nodes get 0.60.
  const neighborOpacities = new Map([[rootId, 1.0]]);

  for (const link of currentGraphData.links) {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    if (s !== rootId && t !== rootId) continue;
    const neighborId = s === rootId ? t : s;
    if (!allNeighbors.has(neighborId)) continue;
    const edgeOp = TYPE_OPACITY[link.type] !== undefined
      ? TYPE_OPACITY[link.type]
      : DEFAULT_NEIGHBOR_OPACITY;
    const current = neighborOpacities.get(neighborId) || 0;
    if (edgeOp > current) neighborOpacities.set(neighborId, edgeOp);
  }

  // Deeper neighbors not yet assigned get flat opacity
  for (const id of allNeighbors) {
    if (!neighborOpacities.has(id)) neighborOpacities.set(id, 0.60);
  }

  applyNodeOpacity(n => neighborOpacities.get(n.id) ?? DIM_OPACITY);
  applyLinkVisibility(link => {
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    return allNeighbors.has(s) && allNeighbors.has(t);
  });
  graphInstance.linkOpacity(0.7);
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

// Move camera (and orbit target) together along the camera's look/right vectors.
// forwardDelta: + = towards target, - = away. rightDelta: + = right, - = left.
// Called each animation frame by app.js WASD handler.
function moveCamera(forwardDelta, rightDelta, upDelta = 0) {
  if (!graphInstance) return;
  const camera   = graphInstance.camera();
  const controls = graphInstance.controls();

  const forward = new THREE.Vector3()
    .subVectors(controls.target, camera.position).normalize();
  const right = new THREE.Vector3()
    .crossVectors(forward, camera.up).normalize();
  const up = camera.up.clone().normalize();

  const delta = new THREE.Vector3()
    .addScaledVector(forward, forwardDelta)
    .addScaledVector(right, rightDelta)
    .addScaledVector(up, upDelta);

  camera.position.add(delta);
  controls.target.add(delta);
  controls.update();
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
  applyLinkVisibility(predicate);
}

function resetVisibility() {
  graphInstance.nodeVisibility(true);
  applyLinkVisibility(true);
  applyNodeOpacity(0.92);
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

// ── Flash node (brief scale pulse on search select) ───────────────────────
function flashNode(nodeId) {
  const node = currentGraphData.nodes.find(n => n.id === nodeId);
  if (!node || !node.__threeObj) return;
  const obj = node.__threeObj;
  const origScale = obj.scale.clone();
  let phase = 0;
  const interval = setInterval(() => {
    phase += 0.08;
    if (phase >= Math.PI) {
      clearInterval(interval);
      obj.scale.copy(origScale);
      return;
    }
    const s = 1 + 0.8 * Math.sin(phase);
    obj.scale.set(origScale.x * s, origScale.y * s, origScale.z * s);
  }, 16);
}

// ── Debug helpers (accessible from browser console) ──────────────────────────
window.__graphDebug = {
  get instance() { return graphInstance; },
  get data()     { return currentGraphData; },
  zStats() {
    const nodes = (currentGraphData || {}).nodes || [];
    if (!nodes.length) return 'No nodes loaded';
    const zs = nodes.map(n => n.z || 0).sort((a, b) => a - b);
    const mean = zs.reduce((s, v) => s + v, 0) / zs.length;
    const stddev = Math.sqrt(zs.reduce((s, v) => s + (v - mean) ** 2, 0) / zs.length);
    return { count: zs.length, min: +zs[0].toFixed(1), max: +zs[zs.length-1].toFixed(1), mean: +mean.toFixed(1), stddev: +stddev.toFixed(1) };
  },
  forces() {
    if (!graphInstance) return 'No instance';
    return ['charge','link','center','collision'].reduce((o, k) => {
      o[k] = !!graphInstance.d3Force(k);
      return o;
    }, {});
  },
  numDims() { return graphInstance ? graphInstance.numDimensions() : null; },
};

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
  moveCamera,
  flashNode,
  exportPNG,

  getGraphInstance,
  getCurrentData,
};

})();
