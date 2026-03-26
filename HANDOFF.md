# HANDOFF.md — Why-Opedia

> Read this file at the start of every session. It is the source of truth for current state, objectives, and decisions made.

---

## PROJECT OVERVIEW

Why-opedia is a causal graph encyclopedia — a knowledge graph where nodes are historical events, people, movements, mechanisms, and institutions, and edges are typed causal relationships (CAUSED, ENABLED, PRODUCED, SHARES_MECHANISM_WITH, DISCREDITED, NORMALIZED, COLONIZED, EXPLOITED, FORCED_INTO, FRAGMENTED_INTO, PROVIDED_COVER_FOR, SELF_REINFORCES).

The north star is in `prompts/PURPOSE.md`. Read it.

---

## DATA STRUCTURE

```
data/
  scopes.json                    — defines all scopes (global, global/history, etc.)
  global/
    history/
      nodes.json                 — history nodes (events, persons, movements, institutions, eras)
      edges.json                 — history-to-history edges only
    economics/
      nodes.json                 — economics scope nodes
      edges.json
    [other scopes...]
  mechanisms/
    nodes.json                   — cross-scope mechanism/reference nodes
    edges.json                   — ALL cross-scope edges go here (mechanism↔history, mechanism↔mechanism)
```

**Critical rule:** Cross-scope edges (e.g., a history node → a mechanism node) go in `data/mechanisms/edges.json`. Same-scope history edges go in `data/global/history/edges.json`.

### Edge types available:
`CAUSED`, `COLONIZED`, `DISCREDITED`, `ENABLED`, `EXPLOITED`, `FORCED_INTO`, `FRAGMENTED_INTO`, `NORMALIZED`, `PRODUCED`, `PROVIDED_COVER_FOR`, `SELF_REINFORCES`, `SHARES_MECHANISM_WITH`

### Node categories:
- `person` — historical individuals
- `event` — specific historical events
- `movement` — social/political/religious movements
- `institution` — lasting organizations/structures
- `era` — broad time periods
- `ideology` — belief systems
- `phenomenon` — observed patterns
- `mechanism` — analytical concepts (mostly in mechanisms scope)
- `reference` — cross-scope reference nodes

---

## CURRENT DATASET STATE (as of 2026-03-26, Session 2)

| File | Count |
|------|-------|
| History nodes | **361** |
| History edges | **792** |
| Mechanism edges | **1128** |
| Mechanism nodes | **144** |
| **Person nodes (history scope)** | **163** |

---

## WHAT WAS DONE THIS SESSION

### Fix 1: Graph Renderer — Edge Validation (CRITICAL)
Added a 2-line filter in `js/graph-renderer.js` `loadGraphData()` to remove edges referencing nodes not in the current loaded node set before passing to the d3-force simulation. Invalid edges were causing NaN position values → charge repulsion operated unopposed → nodes flew everywhere. This fix is permanent and handles all future cross-scope edge mismatches.

```javascript
// Added to loadGraphData() before links array is built:
const validIds = new Set(nodes.map(n => n.id));
const links = edges
  .filter(e => validIds.has(e.source) && validIds.has(e.target))
  .map(e => ({ ...e, source: e.source, target: e.target }));
```

### Fix 2: MLK Duplicate Node Merge
- Removed duplicate `martin_luther_king` node (kept `martin_luther_king_jr`)
- Updated 4 edges: `civil_rights_movement__martin_luther_king`, `martin_luther_king__vietnam_war`, `martin_luther_king__nonviolent_resistance`, `martin_luther_king__lgbtq_rights_movement` → all now reference `martin_luther_king_jr`

### Phase 1: Comprehensive Person Node Additions (+70 people)
Added 55 person nodes in the first batch and 15 in the second, covering major gaps across all historical topics. **People are always linked to relevant nodes — no floating nodes.**

**Batch 1 additions (+55):**
| Category | People Added |
|----------|-------------|
| American History | `abraham_lincoln`, `rosa_parks`, `susan_b_anthony`, `elizabeth_cady_stanton`, `emmeline_pankhurst`, `thurgood_marshall`, `john_lewis`, `thomas_paine`, `benjamin_franklin`, `thaddeus_stevens`, `medgar_evers` |
| European History | `augusto_caesar`, `archduke_franz_ferdinand`, `kaiser_wilhelm_ii`, `adolf_eichmann`, `napoleon_iii`, `otto_von_bismarck`, `louis_xvi`, `cardinal_richelieu`, `gustavus_adolphus`, `william_wilberforce`, `ferdinand_isabella`, `matthias_hopkins`, `pope_urban_ii`, `slobodan_milosevic`, `radovan_karadzic` |
| Africa / Middle East | `steve_biko`, `desmond_tutu`, `mustafa_kemal_ataturk`, `enver_pasha`, `saddam_hussein` |
| Asia | `kublai_khan`, `sun_yat_sen`, `chiang_kai_shek`, `deng_xiaoping`, `emperor_meiji`, `ito_hirobumi`, `judah_maccabee` |
| Latin America | `fulgencio_batista`, `pancho_villa`, `emiliano_zapata`, `henri_christophe` |
| Exploration / Colonialism | `christopher_columbus`, `hernan_cortes`, `vasco_da_gama` |
| Science / Economics | `nicolaus_copernicus`, `milton_friedman`, `john_maynard_keynes`, `andrew_carnegie`, `francis_galton` |
| Philosophy | `jean_paul_sartre`, `simone_de_beauvoir`, `michel_foucault`, `noam_chomsky`, `gustavo_gutierrez` |

**Batch 2 additions (+15):**
`taharqa`, `marcus_aurelius`, `henry_v_england`, `duke_of_wellington`, `fw_de_klerk`, `porfirio_diaz`, `kim_il_sung`, `harriet_beecher_stowe`, `ulysses_grant`, `epicurus`, `david_hume`, `simone_weil`, `jose_marti`, `robert_e_lee`, `olaudah_equiano`

**Edges added:** +98 history-to-history, +150 cross-scope (batch 1) + 29 history + 33 cross-scope (batch 2) = **310 edges total this session**

---

## DATA INTEGRITY STATUS

- **Truly broken edges (reference non-existent nodes): 0**
- Cross-scope edges that reference nodes in unloaded scopes: 146 history, 289 mechanism — these are VALID, filtered safely by the renderer fix
- Economics scope: 0 broken edges (clean)

---

## KNOWN REMAINING GAPS (for future sessions)

### Content gaps still to address:
- Economics scope is thin (29 nodes) — needs more historical grounding
- Psychology scope (38 nodes) — some communities lack full person/event context
- 2020s content is almost absent
- African history underrepresented outside colonial/genocide contexts
- Indigenous history beyond Trail of Tears and boarding schools
- South Asian history (partition covered but India pre-colonial is thin)
- Pre-Columbian Americas entirely absent (Aztec, Inca, Maya civilizations)
- Chinese dynasties before Qin are absent (Shang, Zhou, Han, Tang, Song, Ming)
- Mughal Empire absent
- Ottoman era beyond existing nodes (Tanzimat reforms, etc.)

### Lower-priority person nodes not yet added:
- `genghis_khan` expansion — have him but light connections to `silk_road`, `plague`
- `rodrigo_borgia` (Pope Alexander VI) — corruption, church-state entanglement
- `thomas_more` — English Reformation, Utopia (critiqued enclosures)
- `simone_de_beauvoir` — added ✓
- `frantz_fanon` — present in politics scope already

### Technical debt:
- `reconstruction_era` is referenced in edges but is a mechanism node (it exists in mechanisms); verify it resolves correctly
- Some edges use `SHARES_MECHANISM_WITH` loosely — could be tightened in future audit

---

## DEVELOPMENT GUIDELINES

### Adding nodes:
1. Check if the ID already exists before creating
2. Cross-scope edges always go in `data/mechanisms/edges.json`
3. Same-scope edges go in the scope's `edges.json`
4. Always verify referential integrity after bulk additions
5. **People must always be linked to relevant nodes — never add floating person nodes**

### Python pattern for integrity check:
```python
import json, os
scope_dirs = ['data/global/history','data/global/economics','data/global/media',
              'data/global/politics','data/global/psychology','data/global/health','data/mechanisms']
all_ids = set()
for d in scope_dirs:
    p = f"{d}/nodes.json"
    if os.path.exists(p):
        with open(p) as f: nodes = json.load(f)
        all_ids |= {n['id'] for n in nodes}
# Check edges: source and target in all_ids
```

### Edge ID convention:
`{source_id}__{target_id}` (double underscore)

---

## GIT STATUS

Uncommitted changes as of session end (Session 2):
- `js/graph-renderer.js` — renderer fix (edge filter in loadGraphData)
- `data/global/history/nodes.json` — +70 person nodes, MLK duplicate removed
- `data/global/history/edges.json` — +127 edges
- `data/mechanisms/edges.json` — +183 edges
- `HANDOFF.md` — updated
