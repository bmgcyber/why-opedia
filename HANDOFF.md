# HANDOFF.md — Why-Opedia

> Read this file at the start of every session. It is the source of truth for current state, objectives, and decisions made. Read `prompts/PURPOSE.md` before adding content.

---

## PROJECT OVERVIEW

Why-opedia is a causal graph encyclopedia — a knowledge graph where nodes are historical events, people, movements, mechanisms, and institutions, and edges are typed causal relationships.

**North star:** `prompts/PURPOSE.md` — read it before every session.

---

## DATA STRUCTURE

```
data/
  scopes.json                    — defines all scopes
  global/
    nodes.json                   — portal nodes (one per scope)
    history/nodes.json + edges.json
    economics/nodes.json + edges.json
    politics/nodes.json + edges.json
    psychology/nodes.json + edges.json
    media/nodes.json + edges.json
    health/nodes.json + edges.json
  mechanisms/
    nodes.json                   — cross-scope mechanism/concept nodes
    edges.json                   — ALL cross-scope edges (any scope ↔ mechanism, or scope ↔ scope)
```

**Critical routing rules:**
- Same-scope edges → that scope's `edges.json`
- ANY cross-scope edge (history → mechanism, history → economics, etc.) → `data/mechanisms/edges.json`
- Adding a new scope → must also add portal node to `data/global/nodes.json` AND add scope name to both `subScopes` arrays in `js/scope-manager.js`

### Edge types:
`CAUSED`, `COLONIZED`, `DISCREDITED`, `ENABLED`, `EXPLOITED`, `FORCED_INTO`, `FRAGMENTED_INTO`, `NORMALIZED`, `PRODUCED`, `PROVIDED_COVER_FOR`, `SELF_REINFORCES`, `SHARES_MECHANISM_WITH`

### Node categories:
`person`, `event`, `movement`, `institution`, `era`, `ideology`, `phenomenon`, `mechanism`, `reference`

### Edge ID convention: `{source_id}__{target_id}` (double underscore)

### Rules for people:
- **Never add floating person nodes** — every person must have at least 2 edges to existing nodes
- Person nodes go in the scope where their primary activity occurred (usually `global/history`)

---

## CURRENT DATASET STATE (as of 2026-03-26, Session 3)

| Scope | Nodes | Edges |
|-------|-------|-------|
| History | **411** | **890** |
| Economics | 29 | 74 |
| Politics | 110 | 321 |
| Psychology | 38 | 107 |
| Media | 31 | 82 |
| Health | 31 | 81 |
| Mechanisms | **144** | **1296** (cross-scope) |
| **Person nodes (history)** | **183** | — |
| **Total nodes** | **~794** | **~2851** |

**Data integrity:** 0 truly broken edge references. Cross-scope refs to unloaded scopes are filtered by the renderer.

---

## CRITICAL TECHNICAL DECISIONS (don't undo these)

### 1. Edge filter in renderer (Session 2)
`js/graph-renderer.js` `loadGraphData()` filters edges against the current node set before passing to d3-force. **Never remove this.** Invalid edges cause NaN forces → nodes fly apart.

```javascript
const validIds = new Set(nodes.map(n => n.id));
const links = edges
  .filter(e => validIds.has(e.source) && validIds.has(e.target))
  .map(e => ({ ...e, source: e.source, target: e.target }));
```

### 2. Economics scope wiring (Session 3)
Economics portal was missing from `data/global/nodes.json` and `scope-manager.js`. Both are now fixed. If adding future scopes, replicate this pattern — three places need updating: `scopes.json`, `data/global/nodes.json`, and both `subScopes` arrays in `js/scope-manager.js`.

### 3. Edge type filters (Session 3)
`js/filter-manager.js` now exposes all 8 "other" edge types individually in a collapsible sidebar section. `EDGE_FILTER_MAIN` was removed — `edgePassesFilter()` now checks `enabledEdgeFilters.has(type)` directly for all types.

---

## INTEGRITY CHECK SCRIPT (run after every bulk addition)

```python
import json, os
scope_dirs = ['data/global/history','data/global/economics','data/global/media',
              'data/global/politics','data/global/psychology','data/global/health','data/mechanisms']
all_ids = set()
for d in scope_dirs:
    p = f"{d}/nodes.json"
    if os.path.exists(p):
        with open(p) as f: all_ids |= {n['id'] for n in json.load(f)}

for scope, ef in [('history','data/global/history/edges.json'),
                  ('mechanisms','data/mechanisms/edges.json'),
                  ('economics','data/global/economics/edges.json')]:
    with open(ef) as f: edges = json.load(f)
    broken = [(e['id'],e['source'],e['target']) for e in edges
              if e['source'] not in all_ids or e['target'] not in all_ids]
    print(f"{scope}: {len(broken)} truly broken")
    for b in broken: print(f"  {b}")
```

---

## NEXT STEPS: DATASET ADDITIONS (prioritized)

### Priority 1 — Indigenous North American History
Currently only Trail of Tears and boarding schools. Need full pre-colonial context.
- **Nodes to add:** `haudenosaunee_confederacy` (Iroquois — model for U.S. Constitution?), `sioux_nation`, `lakota_ghost_dance`, `wounded_knee_massacre_1890`, `wounded_knee_1973`, `cherokee_nation`, `american_indian_movement`, `treaty_of_fort_laramie`, `standing_rock_protests`
- **People:** `sitting_bull`, `crazy_horse`, `geronimo`, `chief_joseph`, `vine_deloria_jr`, `leonard_peltier`
- **Mechanism links:** `dehumanization`, `structural_violence`, `historical_revisionism`, `manufactured_consent`, `resource_extraction`, `broken_epistemology`

### Priority 2 — East African Civilizations
Only colonial/genocide nodes exist for East Africa.
- **Nodes to add:** `kingdom_of_axum` (Ethiopia, 1st–7th c.), `swahili_coast_trade`, `great_zimbabwe`, `kingdom_of_kongo`, `benin_kingdom` (famous bronzes, 1180–1897), `maji_maji_rebellion` (German East Africa 1905)
- **People:** `haile_selassie`, `jomo_kenyatta` (Kenya independence), `julius_nyerere` (Tanzania)
- **Mechanism links:** `imperialism`, `resource_extraction`, `dehumanization`, `structural_violence`

### Priority 3 — Additional Chinese History
Yuan dynasty and deeper connections still missing.
- **Nodes to add:** `yuan_dynasty` (Mongol-ruled China, 1271–1368), `zhou_dynasty` (800-year dynasty, Confucius's era), `boxer_rebellion` (1900), `chinese_exclusion_act_1882` (U.S.)
- **People:** `hong_xiuquan` (Taiping Rebellion leader), `empress_dowager_cixi` (Qing regent)
- **Mechanism links:** `in_group_out_group_dynamics`, `cult_dynamics`, `dehumanization`, `imperialism`

### Priority 4 — South Asian Gaps
Maratha, Sikh, and Vijayanagara empires absent.
- **Nodes to add:** `maratha_empire` (17th–19th c., resisted Mughals and British), `sikh_empire` (Punjab, 1799–1849), `vijayanagara_empire` (South India, 1336–1646), `partition_of_bengal_1905`, `amritsar_massacre_1919`
- **People:** `shivaji_maharaj` (Maratha founder), `guru_nanak` (Sikh founder), `ranjit_singh` (Sikh Empire), `bhimrao_ambedkar` (Dalit rights, drafted Indian constitution)
- **Mechanism links:** `in_group_out_group_dynamics`, `structural_violence`, `dehumanization`, `class_consciousness`

### Priority 5 — Pre-Columbian Depth
Aztec and Inca added; need deeper nodes.
- **Nodes to add:** `potosi_silver_mines` (Bolivia — funded European capitalism, 8M deaths), `encomienda_system` (Spanish colonial labor), `tlaxcalan_alliance` (indigenous partners in conquest), `mississippian_culture` (North America mound-builders), `cahokia` (pre-Columbian city larger than London in 1200), `maya_codex_burning` (Diego de Landa burned Maya books 1562)
- **People:** `bartolome_de_las_casas` (documented Spanish atrocities), `diego_de_landa` (burned Maya books), `tupac_amaru_ii` (Inca revolt leader 1780)
- **Mechanism links:** `resource_extraction`, `dehumanization`, `structural_violence`, `historical_revisionism`

### Priority 6 — Ottoman Deep Cuts
Have empire overview and key sultans; need internal reform/collapse arc.
- **Nodes to add:** `tanzimat_reforms` (Ottoman modernization 1839–1876), `young_turks_movement`, `ottoman_debt_crisis` (1881 — European financial control), `greek_war_of_independence`, `balkan_wars_1912`
- **People:** `talaat_pasha` (third of the Three Pashas, Armenian Genocide architect alongside Enver)
- **Mechanism links:** `democratic_backsliding`, `imperialism`, `dehumanization`, `debt_trap`

### Priority 7 — 2020s & Contemporary Depth
2020s nodes added; need more granularity.
- **Nodes to add:** `ferguson_protests_2014` (BLM origin), `breonna_taylor_killing`, `covid_vaccine_hesitancy`, `ai_large_language_models` (2022–present), `surveillance_state_china` (Xinjiang, social credit), `myanmar_coup_2021`, `ethiopia_tigray_war`, `haiti_political_collapse`
- **People:** `xi_jinping` (China's authoritarian consolidation), `aung_san_suu_kyi` (Myanmar), `volodymyr_zelensky`
- **Mechanism links:** `surveillance_capitalism`, `manufactured_consent`, `democratic_backsliding`, `propaganda`

### Priority 8 — Medieval Europe Depth
Currently thin between fall of Rome and Renaissance.
- **Nodes to add:** `black_death_social_impact` (flagellants, pogroms, labor shortage → power shift), `hanseatic_league` (early merchant capitalism), `peasants_revolt_1381`, `feudal_system`, `norman_conquest_1066`
- **People:** `william_the_conqueror`, `joan_of_arc`, `thomas_becket`
- **Mechanism links:** `structural_violence`, `class_consciousness`, `propaganda`, `church_state_entanglement`

### Priority 9 — Additional Person Nodes (high-value gaps)
People with existing topic nodes but no person node:
- `bartolome_de_las_casas` — documented Spanish atrocities in Americas
- `sitting_bull` — Sioux, Ghost Dance, Wounded Knee
- `bhimrao_ambedkar` — Dalit liberation, Indian Constitution
- `shivaji_maharaj` — Maratha resistance to Mughal/British rule
- `empress_dowager_cixi` — Qing dynasty regent, blocked modernization
- `haile_selassie` — Ethiopia, pan-Africanism, Rastafarianism
- `jomo_kenyatta` — Kenya independence, Mau Mau rebellion
- `julius_nyerere` — Tanzania, African socialism (Ujamaa)
- `xi_jinping` — China's authoritarian consolidation
- `angela_davis` — Black liberation, prison industrial complex
- `fred_hampton` — Black Panthers, COINTELPRO assassination
- `edward_bernays` — Father of PR / modern propaganda
- `j_edgar_hoover` — FBI, COINTELPRO, surveillance state
- `henry_kissinger` — U.S. foreign policy, Chile coup, Vietnam
- `hong_xiuquan` — Taiping Rebellion leader

### Priority 10 — Economics Scope Additions
Economics has good conceptual nodes; thin on historical events.
- **Nodes to add:** `glass_steagall_repeal_1999`, `bretton_woods_agreement_1944` (distinct from collapse), `federal_reserve_creation_1913`, `wto_formation_1995`, `nafta_1994`, `gig_economy`, `offshore_tax_havens`, `quantitative_easing`, `student_debt_crisis`, `housing_bubble_2008`
- **Cross-scope edges:** Wire to existing history/mechanism nodes (Great Depression, Keynes, Friedman, Reagan)

---

## NEXT STEPS: TECHNICAL IMPROVEMENTS

### UI / Visualization

**1. Full-Text Search** *(High priority)*
Add a search input to the sidebar that filters nodes by label or summary text. Currently impossible to find a node without knowing it exists. Implementation: sidebar text input → filter `nodePassesFilter()` to check `node.label.toLowerCase().includes(query)` or `node.summary.toLowerCase().includes(query)`. File: `js/filter-manager.js`.

**2. Timeline / Era Filter** *(Medium priority)*
Add a decade range slider that filters visible nodes by the `decade` field. Allows exploration of "only WWI-era nodes" etc. Implementation: add decade range to filter state in `filter-manager.js`, apply in `nodePassesFilter()`. File: `js/filter-manager.js`.

**3. Portal Node Counts Auto-Update** *(Medium priority)*
Portal nodes show hardcoded counts ("168 nodes on history") that go stale as data grows. Fix: compute counts dynamically in `enterGlobalView()` from actual loaded data. File: `js/scope-manager.js` + remove count strings from `data/global/nodes.json`.

**4. "Focus Mode" on Node Click** *(Medium priority)*
When clicking a node, hide all nodes more than N hops away. Currently clicking shows connections in the sidebar but doesn't simplify the 3D view. Implementation: BFS from selected node in filter-manager, hide distant nodes temporarily. Files: `js/filter-manager.js`, `js/graph-renderer.js`.

**5. Edge Label on Hover** *(Low priority)*
Show the relation type (CAUSED, ENABLED, etc.) as a label when hovering an edge. 3d-force-graph supports `linkLabel()`. File: `js/graph-renderer.js`.

**6. Graph Statistics Panel** *(Low priority)*
Small HUD showing: visible node count, visible edge count, top 5 most-connected nodes. Derive from `graphInstance.graphData()` after each load. File: `js/graph-renderer.js` or new `js/stats-panel.js`.

**7. Performance at Scale** *(Medium priority)*
Global view renders 800+ nodes simultaneously; frame rate degrades on lower-end hardware. Options: (a) reduce charge strength when node count > 500, (b) cluster portal nodes visually until user zooms in, (c) cap label rendering distance more aggressively.

### Data Quality

**8. Duplicate Node Audit** *(Do soon)*
Known duplicates that need merging:
- `world_war_two` and `world_war_ii` — keep `world_war_ii`, redirect edges, delete `world_war_two`
- `french_revolution` and `french_revolution_history` — verify if distinct or duplicate
- `cold_war_culture` and `cold_war_nuclear_fear` — check overlap
Pattern for merge: (1) find all edges referencing old ID, (2) update source/target to new ID, (3) deduplicate edge IDs, (4) remove old node.

**9. Politics Scope Mechanism Wiring** *(Medium priority)*
Politics scope (110 nodes, 321 edges) has very thin cross-scope mechanism connections. A pass through `data/global/politics/nodes.json` to add mechanism edges for each political node would significantly enrich the graph.

**10. SHARES_MECHANISM_WITH Audit** *(Low priority)*
Many `SHARES_MECHANISM_WITH` edges are loosely used where a proper intermediate mechanism node would be more accurate. Future pass: if A → X and B → X already, replace `A SHARES_MECHANISM_WITH B` with `A → X ← B` pattern.

**11. Cross-Scope Missing Links** *(Ongoing)*
High-value missing connections:
- `black_death` → `structural_violence`, `class_consciousness`, `scapegoating`
- `mongol_conquests` → `structural_violence`, `imperialism`
- `cold_war_culture` → `manufactured_consent`, `propaganda`, `in_group_out_group_dynamics`
- `great_migration` → `systemic_racism`, `structural_violence`, `class_consciousness`
- Most politics-scope nodes lack mechanism connections

### Architecture (Future)

**12. New Scope: Technology**
`global/technology` scope for: printing press, industrial revolution, telegraph, radio, TV, internet, smartphones, AI. Many mechanism connections exist but are scattered across history.

**13. New Scope: Religion**
`global/religion` scope for major religions, sects, councils, reformations — currently scattered across history nodes. Would enable dedicated filtering of religious causality chains.

**14. Scope Hierarchy / Sub-scopes**
Data model supports nested scopes (`children: {}`). Future: `global/history/wwii`, `global/history/antiquity`, etc. for navigable depth without loading everything.

---

## KNOWN BUGS / TECH DEBT

| Issue | File | Priority |
|-------|------|----------|
| Portal node counts are hardcoded | `data/global/nodes.json` | Medium |
| `world_war_two` is a duplicate of `world_war_ii` | `data/global/history/nodes.json` | Do soon |
| `french_revolution` vs `french_revolution_history` — check if duplicate | history nodes | Low |
| Some `SHARES_MECHANISM_WITH` edges are imprecise | edges.json files | Low |
| Politics-scope nodes thin on mechanism edges | `data/global/politics/` | Medium |
| `augusto_caesar` ID should probably be `augustus_caesar` | history nodes | Low |

---

## SESSION HISTORY SUMMARY

| Session | Key Work |
|---------|----------|
| Session 1 | 10 historical topic clusters (Japan, Rome, Spain, China, Ireland, Haiti, etc.); person nodes expanded to 94; HANDOFF.md created |
| Session 2 | Graph renderer fix (edge filter prevents node scatter); MLK duplicate merged; +70 person nodes (183 total); edge type sidebar expanded to individual types |
| Session 3 | Economics scope wired in (portal + scope-manager); +50 history nodes across Pre-Columbian Americas, 2020s, Africa, South Asia, China; +320 edges total |
