'use strict';

// ── search.js
// Cross-scope fuzzy search using Fuse.js.
// Depends on: Fuse (global from CDN), ScopeManager, GraphRenderer

(function () {
  let fuseIndex = null;
  let allSearchNodes = [];
  let onResultSelectCb = null;

  // ── Build Fuse index ───────────────────────────────────────────────────────
  function buildIndex(nodes) {
    allSearchNodes = nodes.filter(n => n.category !== 'portal');
    fuseIndex = new Fuse(allSearchNodes, {
      keys: [
        { name: 'label',       weight: 0.5  },
        { name: 'aliases',     weight: 0.3  },
        { name: 'tags',        weight: 0.15 },
        { name: 'description', weight: 0.1  },
        { name: 'summary',     weight: 0.05 },
      ],
      threshold:          0.35,
      includeScore:       true,
      includeMatches:     false,
      minMatchCharLength: 2,
    });
  }

  // ── Append nodes to index (cross-scope expansion) ──────────────────────────
  function addNodesToIndex(nodes) {
    const existingIds = new Set(allSearchNodes.map(n => n.id));
    const newNodes = nodes.filter(n => n.category !== 'portal' && !existingIds.has(n.id));
    if (!newNodes.length) return;
    allSearchNodes = [...allSearchNodes, ...newNodes];
    buildIndex(allSearchNodes);
  }

  // ── Search ─────────────────────────────────────────────────────────────────
  function search(query, limit = 8) {
    if (!fuseIndex || !query.trim()) return [];
    const results = fuseIndex.search(query.trim(), { limit });
    return results.map(r => r.item);
  }

  // ── Sidebar search widget ──────────────────────────────────────────────────
  function initSidebarSearch() {
    const dropdown = document.createElement('div');
    dropdown.id = 'sb-autocomplete';
    document.body.appendChild(dropdown);

    const input = document.getElementById('sb-search');
    if (!input) return;

    let currentResults = [];
    let kbHighlighted  = -1;

    function positionDropdown() {
      const rect = input.getBoundingClientRect();
      dropdown.style.top   = (rect.bottom + 4) + 'px';
      dropdown.style.left  = rect.left + 'px';
      dropdown.style.width = rect.width + 'px';
    }

    function showDropdown(results) {
      currentResults = results;
      kbHighlighted  = -1;
      if (!results.length) { dropdown.style.display = 'none'; return; }

      const GR = GraphRenderer;
      dropdown.innerHTML = '';
      results.forEach((node, i) => {
        const cat   = node.category;
        const color = (GR && GR.CATEGORY_COLOR[cat]) || '#8c8fa8';
        const scopeLabel = node.scope && node.scope !== 'global'
          ? ` <span class="sb-ac-scope">(${node.scope.split('/').pop()})</span>` : '';
        const item = document.createElement('div');
        item.className   = 'sb-ac-item';
        item.dataset.index = i;
        item.innerHTML = `
          <span class="sb-ac-dot" style="background:${color}"></span>
          <span class="sb-ac-label">${escHtml(node.label)}${scopeLabel}</span>
          <span class="sb-ac-cat">${escHtml(cat)}</span>
        `;
        item.addEventListener('mousedown', ev => {
          ev.preventDefault();
          selectResult(node);
          input.value = '';
          dropdown.style.display = 'none';
        });
        dropdown.appendChild(item);
      });

      positionDropdown();
      dropdown.style.display = 'block';
    }

    function updateKb() {
      dropdown.querySelectorAll('.sb-ac-item').forEach((el, i) => {
        el.classList.toggle('kb-active', i === kbHighlighted);
      });
    }

    input.addEventListener('input', () => {
      const q = input.value.trim();
      if (!q) { dropdown.style.display = 'none'; return; }
      showDropdown(search(q, 8));
    });

    input.addEventListener('keydown', e => {
      if (!currentResults.length) {
        if (e.key === 'Escape') { dropdown.style.display = 'none'; input.blur(); }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        kbHighlighted = Math.min(kbHighlighted + 1, currentResults.length - 1);
        updateKb();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        kbHighlighted = Math.max(kbHighlighted - 1, -1);
        updateKb();
      } else if (e.key === 'Enter' && kbHighlighted >= 0) {
        selectResult(currentResults[kbHighlighted]);
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

    // Keyboard shortcut: / or Ctrl+K focuses search
    document.addEventListener('keydown', e => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) &&
          document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        input.focus();
      }
    });
  }

  // ── Select a search result ─────────────────────────────────────────────────
  async function selectResult(node) {
    // If node is in a different scope, navigate there first
    const currentScope = ScopeManager.getCurrentScopePath();
    if (node.scope && node.scope !== currentScope && node.scope !== 'global/mechanisms') {
      await ScopeManager.enterScope(node.scope);
      // Wait a tick for graph data to refresh
      await new Promise(r => setTimeout(r, 50));
    }

    if (onResultSelectCb) onResultSelectCb(node);
  }

  function onResultSelect(fn) { onResultSelectCb = fn; }

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.Search = {
    buildIndex,
    addNodesToIndex,
    search,
    initSidebarSearch,
    onResultSelect,
  };
})();
