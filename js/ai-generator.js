'use strict';

// ── ai-generator.js
// AI-powered node/edge generation and local overlay management.
// Depends on: ScopeManager, Search (window globals)
// Exposes: window.AIGenerator

(function () {

  const SETTINGS_KEY = 'whyopedia.ai.settings.v1';
  const OVERLAY_KEY  = 'whyopedia.overlay.v1';

  const DEFAULT_SETTINGS = {
    baseUrl:     'https://api.minimax.io/anthropic',
    model:       'MiniMax-M2',
    apiKey:      '',
    proxyPrefix: '',
  };

  const ALLOWED_CATEGORIES = new Set([
    'event', 'movement', 'ideology', 'institution', 'mechanism',
    'person', 'policy', 'phenomenon', 'product', 'community',
  ]);
  const ALLOWED_NODE_TYPES = new Set(['reference', 'mechanism']);
  const ALLOWED_EDGE_TYPES = new Set([
    'CAUSED', 'ENABLED', 'EXPLOITED', 'NORMALIZED', 'REACTIVATED',
    'PROVIDED_COVER_FOR', 'PRODUCED', 'DISCREDITED', 'SHARES_MECHANISM_WITH',
    'SELF_REINFORCES', 'COLONIZED', 'FRAGMENTED_INTO', 'FORCED_INTO',
    'ACCELERATED', 'UNDERMINED',
  ]);
  const ALLOWED_CONFIDENCE = new Set(['high', 'medium', 'speculative']);

  // ── Settings ──────────────────────────────────────────────────────────────────
  function getSettings() {
    try {
      return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'));
    } catch (_) { return { ...DEFAULT_SETTINGS }; }
  }

  function saveSettings(s) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }

  function isConfigured() {
    return !!getSettings().apiKey;
  }

  // ── Overlay ───────────────────────────────────────────────────────────────────
  function getOverlay() {
    try {
      const raw = JSON.parse(localStorage.getItem(OVERLAY_KEY) || '{"nodes":[],"edges":[]}');
      return { nodes: raw.nodes || [], edges: raw.edges || [] };
    } catch (_) { return { nodes: [], edges: [] }; }
  }

  function saveOverlay(overlay) {
    localStorage.setItem(OVERLAY_KEY, JSON.stringify(overlay));
  }

  function addToOverlay(newNodes, newEdges) {
    const overlay = getOverlay();
    const existingNodeIds = new Set(overlay.nodes.map(n => n.id));
    const existingEdgeIds = new Set(overlay.edges.map(e => e.id));
    for (const n of newNodes) {
      if (!existingNodeIds.has(n.id)) overlay.nodes.push(n);
    }
    for (const e of newEdges) {
      if (!existingEdgeIds.has(e.id)) overlay.edges.push(e);
    }
    saveOverlay(overlay);
  }

  function removeFromOverlay(nodeId) {
    const overlay = getOverlay();
    overlay.edges = overlay.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    overlay.nodes = overlay.nodes.filter(n => n.id !== nodeId);
    saveOverlay(overlay);
  }

  // Called by app.js loadScopeIntoGraph to inject overlay nodes/edges into the current view
  function mergeOverlay(nodes, edges, scopePath) {
    const overlay = getOverlay();
    if (!overlay.nodes.length && !overlay.edges.length) return { nodes, edges };

    const scopeNodeIds = new Set(nodes.map(n => n.id));
    const edgeIds = new Set(edges.map(e => e.id));

    // Inject overlay nodes that belong to this scope or global
    for (const n of overlay.nodes) {
      if (scopeNodeIds.has(n.id)) continue;
      const nodeScope = n.scope || 'global';
      const visible = scopePath === 'global' || nodeScope === scopePath || nodeScope === 'global';
      if (visible) {
        nodes = [...nodes, { ...n, aiGenerated: true }];
        scopeNodeIds.add(n.id);
      }
    }

    const visibleNodeIds = new Set(nodes.map(n => n.id));

    // Inject overlay edges where both endpoints are now visible
    for (const e of overlay.edges) {
      if (!edgeIds.has(e.id) && visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)) {
        edges = [...edges, { ...e, aiGenerated: true }];
        edgeIds.add(e.id);
      }
    }

    return { nodes, edges };
  }

  function clearOverlay() {
    saveOverlay({ nodes: [], edges: [] });
  }

  function exportOverlay() {
    const overlay = getOverlay();
    const blob = new Blob([JSON.stringify(overlay, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'whyopedia-ai-additions.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  // ── Prompts ───────────────────────────────────────────────────────────────────
  function buildSystemPrompt() {
    return `You are an expert historian and analyst contributing to Why-opedia, a causal-graph encyclopedia that maps how historical events, ideologies, mechanisms, and phenomena connect.

Your task: given a search query and a list of existing graph nodes, generate ONE new node and 2-5 edges connecting it to existing nodes.

Respond with ONLY valid JSON — no prose before or after:
{
  "node": {
    "id": "snake_case_unique_id",
    "label": "Human Readable Label",
    "node_type": "reference",
    "category": "event",
    "wikipedia": "https://en.wikipedia.org/wiki/Article",
    "summary": "1-2 sentences. Plain language.",
    "decade": "1970s",
    "tags": ["tag1", "tag2"],
    "scope": "global/history"
  },
  "edges": [
    {
      "id": "source_id__target_id",
      "source": "source_id",
      "target": "target_id",
      "type": "ENABLED",
      "label": "short label under 8 words",
      "note": "One sentence explaining the connection.",
      "confidence": "medium"
    }
  ],
  "reasoning": "1-2 sentences explaining why these connections belong."
}

RULES:
- node.id: snake_case lowercase, derived from the concept name
- node.node_type: "reference" (has Wikipedia article) or "mechanism" (analytical concept, no wikipedia field)
- node.category: one of: event, movement, ideology, institution, mechanism, person, policy, phenomenon, product, community
- node.wikipedia: required for reference, must start with https://en.wikipedia.org/wiki/ — omit entirely for mechanism
- node.decade: human-readable e.g. "1970s", "Medieval", "Ongoing", "1960s–Ongoing"
- edge.type: one of: CAUSED, ENABLED, EXPLOITED, NORMALIZED, REACTIVATED, PROVIDED_COVER_FOR, PRODUCED, DISCREDITED, SHARES_MECHANISM_WITH, SELF_REINFORCES, COLONIZED, FRAGMENTED_INTO, FORCED_INTO, ACCELERATED, UNDERMINED
- edge.confidence: high, medium, or speculative
- Only connect to node IDs from the provided context list
- Prefer ENABLED over CAUSED unless causation is direct and documented`;
  }

  function buildUserPrompt(query, contextNodes) {
    const ctx = contextNodes.slice(0, 40).map(n =>
      `  - ${n.id} (${n.category}): ${n.label}${n.summary ? ' — ' + n.summary.slice(0, 80) : ''}`
    ).join('\n');

    return `Search query: "${query}"

Existing graph nodes you may connect to:
${ctx}

Generate a new node for "${query}" and connect it to 2-5 of the above nodes with appropriate causal edges.`;
  }

  // ── LLM call ─────────────────────────────────────────────────────────────────
  async function callLLM(query, contextNodes) {
    const s = getSettings();
    if (!s.apiKey) throw new Error('No API key configured. Open AI Settings to add your key.');

    const url = (s.proxyPrefix || '') + s.baseUrl + '/v1/messages';

    let res;
    try {
      res = await fetch(url, {
        method:  'POST',
        headers: {
          'x-api-key':         s.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type':      'application/json',
        },
        body: JSON.stringify({
          model:      s.model,
          max_tokens: 4096,
          system:     buildSystemPrompt(),
          messages:   [{ role: 'user', content: buildUserPrompt(query, contextNodes) }],
        }),
      });
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error('Network error — likely a CORS block. Add a proxy prefix in AI Settings, or run the app from localhost.');
      }
      throw err;
    }

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`API ${res.status}: ${body.slice(0, 200)}`);
    }

    const json = await res.json();
    const text = (json.content && json.content[0] && json.content[0].text) || '';
    if (!text) throw new Error('Empty response from API');

    // Strip ```json ... ``` fences if present
    const clean = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    try {
      return JSON.parse(clean);
    } catch (e) {
      throw new Error('Could not parse JSON from API response: ' + e.message);
    }
  }

  // ── Client-side validation ────────────────────────────────────────────────────
  function validateAIOutput(data, existingNodeIds) {
    const errors   = [];
    const warnings = [];

    if (!data || typeof data !== 'object') {
      errors.push('Response is not a JSON object');
      return { errors, warnings };
    }

    const n = data.node;
    if (!n) {
      errors.push('Missing "node" field');
    } else {
      if (!n.id || !/^[a-z][a-z0-9_]*$/.test(n.id))
        errors.push(`node.id "${n.id}" must be snake_case lowercase`);
      if (!n.label)
        errors.push('node.label is required');
      if (!ALLOWED_NODE_TYPES.has(n.node_type))
        errors.push(`node.node_type "${n.node_type}" must be reference or mechanism`);
      if (!ALLOWED_CATEGORIES.has(n.category))
        errors.push(`node.category "${n.category}" is not in the allowed taxonomy`);
      if (!n.summary)
        warnings.push('node.summary is missing');
      if (!n.decade)
        warnings.push('node.decade is missing');
      if (!n.tags || !Array.isArray(n.tags))
        warnings.push('node.tags should be an array');
      if (n.node_type === 'reference' && (!n.wikipedia || !n.wikipedia.startsWith('https://en.wikipedia.org/wiki/')))
        errors.push('reference nodes require a wikipedia URL starting with https://en.wikipedia.org/wiki/');
      if (n.node_type === 'mechanism' && n.wikipedia)
        errors.push('mechanism nodes must NOT have a wikipedia field');
      if (n.id && existingNodeIds.has(n.id))
        errors.push(`node.id "${n.id}" already exists in the graph`);
    }

    if (!data.edges || !Array.isArray(data.edges) || data.edges.length === 0) {
      errors.push('At least one edge is required');
    } else {
      const newId = n ? n.id : null;
      for (const e of data.edges) {
        if (!e.id) errors.push('An edge is missing an id');
        if (!e.source) errors.push(`edge "${e.id}" missing source`);
        if (!e.target) errors.push(`edge "${e.id}" missing target`);
        if (!ALLOWED_EDGE_TYPES.has(e.type))
          errors.push(`edge "${e.id}" has invalid type "${e.type}"`);
        if (!ALLOWED_CONFIDENCE.has(e.confidence))
          errors.push(`edge "${e.id}" has invalid confidence "${e.confidence}"`);
        if (!e.label)
          warnings.push(`edge "${e.id}" is missing a label`);
        if (e.source !== newId && e.target !== newId && !existingNodeIds.has(e.source) && !existingNodeIds.has(e.target))
          warnings.push(`edge "${e.id}" doesn't reference the new node or any existing node`);
      }
    }

    return { errors, warnings };
  }

  // ── Generation pipeline ───────────────────────────────────────────────────────
  async function generate(query) {
    if (!isConfigured()) { openSettings(); return; }

    showGenerateModal({ state: 'loading', query });

    try {
      const currentNodes  = (window.allNodes || []).filter(n => n.category !== 'portal' && !n.aiGenerated);
      const existingIds   = new Set(currentNodes.map(n => n.id));
      const data          = await callLLM(query, currentNodes);
      const { errors, warnings } = validateAIOutput(data, existingIds);
      showGenerateModal({ state: 'review', query, data, errors, warnings, existingIds });
    } catch (err) {
      showGenerateModal({ state: 'error', query, message: err.message });
    }
  }

  // ── Accept: persist to overlay + refresh graph ────────────────────────────────
  function acceptGeneration(data) {
    const scopePath = window.ScopeManager ? ScopeManager.getCurrentScopePath() : 'global';
    const node = { ...data.node, aiGenerated: true, scope: data.node.scope || scopePath };
    addToOverlay([node], data.edges || []);
    if (window.Search) Search.addNodesToIndex([node]);
    window.dispatchEvent(new CustomEvent('whyopedia:node-added', { detail: { node, edges: data.edges || [] } }));
    refreshSidebar();
  }

  // ── Contribute: open GitHub PR creation page ──────────────────────────────────
  function openContributePR(data) {
    const contrib = {
      schema_version: 1,
      submitted_at:   new Date().toISOString(),
      node:           data.node,
      edges:          data.edges,
    };
    const json     = JSON.stringify(contrib, null, 2);
    const filename = `data/contributions/${data.node.id}.json`;
    const base     = `https://github.com/bmgcyber/why-opedia/new/main`;
    const params   = `?filename=${encodeURIComponent(filename)}&value=${encodeURIComponent(json)}`;

    if ((base + params).length > 7600) {
      const copy = () => {
        try {
          navigator.clipboard.writeText(json);
        } catch (_) {
          const ta = document.createElement('textarea');
          ta.value = json; document.body.appendChild(ta); ta.select();
          document.execCommand('copy'); document.body.removeChild(ta);
        }
      };
      copy();
      alert(
        'The contribution JSON has been copied to your clipboard.\n\n' +
        'Go to https://github.com/bmgcyber/why-opedia/new/main\n' +
        'Create a new file at: ' + filename + '\n' +
        'Paste the JSON from your clipboard.'
      );
    } else {
      window.open(base + params, '_blank', 'noopener,noreferrer');
    }
  }

  // ── Generate modal ────────────────────────────────────────────────────────────
  function showGenerateModal({ state, query, data, errors, warnings, message }) {
    const modal = document.getElementById('ai-generate-modal');
    if (!modal) return;
    const body = modal.querySelector('.ai-modal-body');
    if (!body) return;
    modal.hidden = false;

    if (state === 'loading') {
      body.innerHTML = `
        <div class="ai-center">
          <div class="ai-spinner"></div>
          <p class="ai-loading-text">Generating node for "<strong>${escHtml(query)}</strong>"…</p>
        </div>`;
      return;
    }

    if (state === 'error') {
      body.innerHTML = `
        <div class="ai-error-box">
          <p class="ai-error-title">Generation failed</p>
          <p class="ai-error-msg">${escHtml(message)}</p>
          <div class="ai-modal-actions">
            <button class="ai-btn ai-btn-secondary" id="ai-err-settings">AI Settings</button>
            <button class="ai-btn ai-btn-secondary" id="ai-err-close">Close</button>
          </div>
        </div>`;
      body.querySelector('#ai-err-settings').onclick = () => { closeModal('ai-generate-modal'); openSettings(); };
      body.querySelector('#ai-err-close').onclick    = () => closeModal('ai-generate-modal');
      return;
    }

    if (state === 'review') {
      const n     = data.node || {};
      const edges = data.edges || [];
      const hasErrors   = errors && errors.length > 0;
      const hasWarnings = warnings && warnings.length > 0;

      const edgeRows = edges.map(e => `
        <tr>
          <td class="ai-td ai-td-id">${escHtml(e.source)}</td>
          <td class="ai-td ai-td-arrow">→</td>
          <td class="ai-td ai-td-id">${escHtml(e.target)}</td>
          <td class="ai-td"><span class="ai-edge-type">${escHtml(e.type)}</span></td>
          <td class="ai-td ai-td-label">${escHtml(e.label || '')}</td>
          <td class="ai-td"><span class="ai-conf ai-conf-${escHtml(e.confidence || '')}">${escHtml(e.confidence || '')}</span></td>
        </tr>`).join('');

      const validHtml = hasErrors
        ? `<div class="ai-validation ai-val-error"><strong>Validation errors — cannot accept:</strong><ul>${errors.map(e => `<li>${escHtml(e)}</li>`).join('')}</ul></div>`
        : hasWarnings
        ? `<div class="ai-validation ai-val-warn"><strong>Warnings:</strong><ul>${warnings.map(w => `<li>${escHtml(w)}</li>`).join('')}</ul></div>`
        : `<div class="ai-validation ai-val-ok">Validation passed</div>`;

      const wikiHtml = n.wikipedia
        ? `<div class="ai-node-field"><span class="ai-field-key">Wikipedia</span><a class="ai-wiki-link" href="${escHtml(n.wikipedia)}" target="_blank" rel="noopener">${escHtml(n.wikipedia.replace('https://en.wikipedia.org/wiki/', ''))}</a></div>`
        : '';

      body.innerHTML = `
        <h3 class="ai-review-heading">Generated Node</h3>
        <div class="ai-node-card">
          <div class="ai-node-field"><span class="ai-field-key">ID</span><code>${escHtml(n.id)}</code></div>
          <div class="ai-node-field"><span class="ai-field-key">Label</span>${escHtml(n.label)}</div>
          <div class="ai-node-field"><span class="ai-field-key">Type</span>${escHtml(n.node_type)} / ${escHtml(n.category)}</div>
          <div class="ai-node-field"><span class="ai-field-key">Summary</span>${escHtml(n.summary)}</div>
          <div class="ai-node-field"><span class="ai-field-key">Decade</span>${escHtml(n.decade)}</div>
          ${wikiHtml}
        </div>

        <h3 class="ai-review-heading">Edges (${edges.length})</h3>
        <div class="ai-table-wrap">
          <table class="ai-edges-table">
            <thead><tr><th>Source</th><th></th><th>Target</th><th>Type</th><th>Label</th><th>Conf.</th></tr></thead>
            <tbody>${edgeRows}</tbody>
          </table>
        </div>

        ${data.reasoning ? `<div class="ai-reasoning"><strong>Reasoning:</strong> ${escHtml(data.reasoning)}</div>` : ''}

        ${validHtml}

        <div class="ai-modal-actions">
          <button class="ai-btn ai-btn-secondary" id="ai-review-cancel">Cancel</button>
          <button class="ai-btn ai-btn-secondary" id="ai-review-contribute" ${hasErrors ? 'disabled title="Fix validation errors first"' : ''}>Contribute to repo…</button>
          <button class="ai-btn ai-btn-primary"   id="ai-review-accept"    ${hasErrors ? 'disabled title="Fix validation errors first"' : ''}>Add to my graph</button>
        </div>`;

      body.querySelector('#ai-review-cancel').onclick = () => closeModal('ai-generate-modal');
      if (!hasErrors) {
        body.querySelector('#ai-review-accept').onclick     = () => { acceptGeneration(data); closeModal('ai-generate-modal'); };
        body.querySelector('#ai-review-contribute').onclick = () => openContributePR(data);
      }
    }
  }

  // ── Settings modal ────────────────────────────────────────────────────────────
  function openSettings() {
    const modal = document.getElementById('ai-settings-modal');
    if (!modal) return;
    const s = getSettings();
    modal.querySelector('#ai-settings-baseurl').value = s.baseUrl;
    modal.querySelector('#ai-settings-model').value   = s.model;
    modal.querySelector('#ai-settings-apikey').value  = s.apiKey;
    modal.querySelector('#ai-settings-proxy').value   = s.proxyPrefix;
    modal.hidden = false;
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  }

  // ── Sidebar refresh ───────────────────────────────────────────────────────────
  function refreshSidebar() {
    const overlay  = getOverlay();
    const countEl  = document.getElementById('ai-overlay-count');
    const listEl   = document.getElementById('ai-overlay-list');
    if (countEl) countEl.textContent = overlay.nodes.length || '';

    if (!listEl) return;
    if (!overlay.nodes.length) {
      listEl.innerHTML = '<div class="ai-empty">No AI additions yet.</div>';
      return;
    }

    listEl.innerHTML = overlay.nodes.map(n => `
      <div class="ai-overlay-item">
        <span class="ai-overlay-label" title="${escHtml(n.summary || '')}">${escHtml(n.label)}</span>
        <span class="ai-overlay-cat">${escHtml(n.category)}</span>
        <button class="ai-overlay-del" data-id="${escHtml(n.id)}" title="Remove">✕</button>
      </div>`).join('');

    listEl.querySelectorAll('.ai-overlay-del').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromOverlay(btn.dataset.id);
        refreshSidebar();
        window.dispatchEvent(new CustomEvent('whyopedia:node-added'));
      });
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────────
  function init() {
    // Settings modal
    const settingsModal = document.getElementById('ai-settings-modal');
    if (settingsModal) {
      settingsModal.querySelector('#ai-settings-close').addEventListener('click', () => closeModal('ai-settings-modal'));
      settingsModal.querySelector('#ai-settings-cancel').addEventListener('click', () => closeModal('ai-settings-modal'));
      settingsModal.querySelector('#ai-settings-save').addEventListener('click', () => {
        saveSettings({
          baseUrl:     settingsModal.querySelector('#ai-settings-baseurl').value.trim() || DEFAULT_SETTINGS.baseUrl,
          model:       settingsModal.querySelector('#ai-settings-model').value.trim()   || DEFAULT_SETTINGS.model,
          apiKey:      settingsModal.querySelector('#ai-settings-apikey').value.trim(),
          proxyPrefix: settingsModal.querySelector('#ai-settings-proxy').value.trim(),
        });
        closeModal('ai-settings-modal');
      });
      settingsModal.addEventListener('click', e => { if (e.target === settingsModal) closeModal('ai-settings-modal'); });
    }

    // Generate/review modal
    const generateModal = document.getElementById('ai-generate-modal');
    if (generateModal) {
      generateModal.querySelector('#ai-generate-close').addEventListener('click', () => closeModal('ai-generate-modal'));
      generateModal.addEventListener('click', e => { if (e.target === generateModal) closeModal('ai-generate-modal'); });
    }

    // Sidebar buttons
    const settingsBtn = document.getElementById('ai-settings-btn');
    const exportBtn   = document.getElementById('ai-export-btn');
    const clearBtn    = document.getElementById('ai-clear-btn');
    const collapseBtn = document.getElementById('ai-collapse');
    const aiBody      = document.getElementById('ai-body');

    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);

    if (exportBtn) exportBtn.addEventListener('click', () => {
      const overlay = getOverlay();
      if (!overlay.nodes.length) { alert('No AI additions to export.'); return; }
      exportOverlay();
    });

    if (clearBtn) clearBtn.addEventListener('click', () => {
      const overlay = getOverlay();
      if (!overlay.nodes.length) return;
      if (confirm('Remove all AI-generated additions from your local graph?')) {
        clearOverlay();
        refreshSidebar();
        window.dispatchEvent(new CustomEvent('whyopedia:node-added'));
      }
    });

    if (collapseBtn && aiBody) {
      collapseBtn.addEventListener('click', () => {
        const collapsed = aiBody.style.display === 'none';
        aiBody.style.display = collapsed ? '' : 'none';
        collapseBtn.textContent = collapsed ? '▴' : '▾';
      });
    }

    refreshSidebar();
  }

  // ── Utility ───────────────────────────────────────────────────────────────────
  function escHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── Public API ────────────────────────────────────────────────────────────────
  window.AIGenerator = {
    init,
    isConfigured,
    openSettings,
    getSettings,
    saveSettings,
    generate,
    getOverlay,
    mergeOverlay,
    exportOverlay,
    clearOverlay,
    refreshSidebar,
  };
})();
