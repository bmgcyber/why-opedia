'use strict';

// ── animation.js
// Scope transition and camera movement animations.
// Depends on: GraphRenderer

(function () {
  // ── Scope transition ───────────────────────────────────────────────────────
  // Fades the current graph out, loads new data, fades back in.
  // total ~1000ms.
  async function transitionToScope(graphData, cb) {
    const GR = GraphRenderer;
    if (!GR || !GR.getGraphInstance()) {
      if (cb) cb();
      return;
    }

    const graph = GR.getGraphInstance();

    // Phase 1: fade out (400ms via opacity tweening)
    await tweenOpacity(graph, 0, 400);

    // Phase 2: swap data
    GR.loadGraphData(graphData.nodes, graphData.edges);

    // Phase 3: fade in (400ms)
    await tweenOpacity(graph, 1, 400);

    // Phase 4: fly camera to default position
    cameraToDefault(200);

    if (cb) cb();
  }

  // Simple opacity tween via requestAnimationFrame
  // In 2D mode the graph instance has no nodeOpacity() — resolve immediately.
  function tweenOpacity(graph, targetOpacity, durationMs) {
    if (!graph || typeof graph.nodeOpacity !== 'function') return Promise.resolve();
    return new Promise(resolve => {
      const start   = performance.now();
      const startOp = graph.nodeOpacity() || (targetOpacity === 0 ? 0.92 : 0);

      function step(now) {
        const t = Math.min((now - start) / durationMs, 1);
        const cur = startOp + (targetOpacity - startOp) * easeInOut(t);
        graph.nodeOpacity(cur);
        graph.linkOpacity(cur * 0.38);
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // ── Camera animations ──────────────────────────────────────────────────────
  function cameraToDefault(durationMs) {
    const GR = GraphRenderer;
    if (!GR || !GR.getGraphInstance()) return;
    const inst = GR.getGraphInstance();
    // cameraPosition is a 3d-force-graph method; not available on Cytoscape instances
    if (typeof inst.cameraPosition !== 'function') return;
    inst.cameraPosition(
      { x: 0, y: 0, z: 500 },
      { x: 0, y: 0, z: 0 },
      durationMs || 600
    );
  }

  function cameraFit() {
    GraphRenderer.fitCamera();
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.Animation = {
    transitionToScope,
    cameraToDefault,
    cameraFit,
  };
})();
