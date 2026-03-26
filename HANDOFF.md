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

## CURRENT DATASET STATE (as of 2026-03-26, Session 4)

| Scope | Nodes | Edges |
|-------|-------|-------|
| History | **492** | **1008** |
| Economics | 39 | 98 |
| Politics | 110 | 321 |
| Psychology | 38 | 107 |
| Media | 31 | 82 |
| Health | 31 | 81 |
| Mechanisms | **144** | **1387** (cross-scope) |
| **Person nodes (history)** | **214** | — |
| **Total nodes** | **~885** | **~3084** |

**Data integrity:** 0 truly broken edge references. Cross-scope refs to unloaded scopes are filtered by the renderer.

### Session 4 additions:
- **Duplicate cleanup:** Merged `world_war_two` → `world_war_ii` (7 edges redirected); deleted `french_revolution_history` (orphaned, 0 edges)
- **Indigenous North American (Priority 1):** haudenosaunee_confederacy, cherokee_nation, sioux_nation, treaty_of_fort_laramie, lakota_ghost_dance, wounded_knee_massacre_1890, american_indian_movement, wounded_knee_1973, standing_rock_protests, indian_boarding_schools + people: sitting_bull, crazy_horse, geronimo, chief_joseph, vine_deloria_jr, leonard_peltier (16 nodes, 42 edges)
- **East African Civilizations (Priority 2):** kingdom_of_axum, swahili_coast_trade, great_zimbabwe, kingdom_of_kongo, benin_kingdom, maji_maji_rebellion + people: haile_selassie, jomo_kenyatta, julius_nyerere (9 nodes, 22 edges)
- **Chinese History (Priority 3):** zhou_dynasty, qing_dynasty, yuan_dynasty, boxer_rebellion, tiananmen_square_massacre, chinese_exclusion_act_1882 + people: empress_dowager_cixi, hong_xiuquan (8 nodes, 20 edges)
- **South Asian Gaps (Priority 4):** vijayanagara_empire, maratha_empire, sikh_empire, partition_of_bengal_1905, amritsar_massacre_1919 + people: shivaji_maharaj, guru_nanak, ranjit_singh, bhimrao_ambedkar (9 nodes, 20 edges)
- **Pre-Columbian Depth (Priority 5):** mississippian_culture, cahokia, encomienda_system, potosi_silver_mines, tlaxcalan_alliance, maya_codex_burning + people: bartolome_de_las_casas, diego_de_landa, tupac_amaru_ii (9 nodes, 23 edges)
- **Ottoman Deep Cuts (Priority 6):** tanzimat_reforms, ottoman_debt_crisis, greek_war_of_independence, young_turks_movement, balkan_wars_1912 + people: talaat_pasha, ataturk (7 nodes, 19 edges)
- **2020s / Contemporary (Priority 7):** ferguson_protests_2014, black_lives_matter, breonna_taylor_killing, january_6_capitol_riot, covid_vaccine_hesitancy, ai_large_language_models, surveillance_state_china, myanmar_coup_2021 + people: xi_jinping, aung_san_suu_kyi, volodymyr_zelensky, angela_davis, fred_hampton, edward_bernays, j_edgar_hoover, henry_kissinger (16 nodes, 35 edges)
- **Medieval Europe (Priority 8):** feudal_system, norman_conquest_1066, crusades, black_death_social_impact, hanseatic_league, peasants_revolt_1381 + people: william_the_conqueror, joan_of_arc, thomas_becket (9 nodes, 24 edges)
- **Economics Scope (Priority 10):** federal_reserve_creation_1913, bretton_woods_agreement_1944, glass_steagall_repeal_1999, nafta_1994, wto_formation_1995, housing_bubble_2008, quantitative_easing, gig_economy, offshore_tax_havens, student_debt_crisis (10 nodes, 30 edges)

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

### Priority 1 — Indigenous North American History ✓ DONE (Session 4)
All nodes added. Remaining gap: `mississippian_culture` → `haudenosaunee_confederacy` link needs deeper wiring to pre-contact period.

### Priority 2 — East African Civilizations ✓ DONE (Session 4)
All nodes added. Still missing: `scramble_for_africa` node (cross-topic), `pan_africanism` node.

### Priority 3 — Additional Chinese History ✓ DONE (Session 4)
Added zhou_dynasty, qing_dynasty, yuan_dynasty, boxer_rebellion, tiananmen_square_massacre, chinese_exclusion_act_1882, hong_xiuquan, empress_dowager_cixi.

### Priority 4 — South Asian Gaps ✓ DONE (Session 4)
Added maratha_empire, sikh_empire, vijayanagara_empire, partition_of_bengal_1905, amritsar_massacre_1919, shivaji_maharaj, guru_nanak, ranjit_singh, bhimrao_ambedkar.

### Priority 5 — Pre-Columbian Depth ✓ DONE (Session 4)
Added potosi_silver_mines, encomienda_system, tlaxcalan_alliance, mississippian_culture, cahokia, maya_codex_burning, bartolome_de_las_casas, diego_de_landa, tupac_amaru_ii.

### Priority 6 — Ottoman Deep Cuts ✓ DONE (Session 4)
Added tanzimat_reforms, ottoman_debt_crisis, greek_war_of_independence, young_turks_movement, balkan_wars_1912, talaat_pasha, ataturk.

### Priority 7 — 2020s & Contemporary Depth ✓ MOSTLY DONE (Session 4)
Added: ferguson_protests_2014, black_lives_matter, breonna_taylor_killing, january_6_capitol_riot, covid_vaccine_hesitancy, ai_large_language_models, surveillance_state_china, myanmar_coup_2021, xi_jinping, aung_san_suu_kyi, volodymyr_zelensky.
- **Still missing:** `ethiopia_tigray_war`, `haiti_political_collapse`, `defund_police_debate`, `long_covid`, `rohingya_genocide`

### Priority 8 — Medieval Europe Depth ✓ DONE (Session 4)
Added feudal_system, norman_conquest_1066, crusades, black_death_social_impact, hanseatic_league, peasants_revolt_1381, william_the_conqueror, joan_of_arc, thomas_becket.

### Priority 9 — Additional Person Nodes ✓ DONE (Session 4)
All 15 priority person nodes added in Sessions 3 and 4. Person node total: 214.
- **Remaining high-value gaps:** `simon_bolivar`, `toussaint_louverture` (if not already added), `frederick_douglass`, `harriet_tubman`, `paulo_freire`, `frantz_fanon`, `rosa_luxemburg`, `emma_goldman`, `che_guevara`, `patrice_lumumba`

### Priority 10 — Economics Scope Additions ✓ DONE (Session 4)
Added all 10 nodes. Economics scope now: 39 nodes, 98 edges.
- **Remaining gaps:** `union_busting_reagan`, `citizens_united_2010`, `minimum_wage_stagnation`, `universal_basic_income` (concept node), `debt_jubilee` (concept)

---

## NEXT STEPS: TECHNICAL IMPROVEMENTS

### Already implemented (no work needed)
- **Full-text search**: `js/search.js` + Fuse.js — fuzzy search, camera flies to node, node flashes. Keyboard: `/` or `Ctrl+K`.
- **Portal node counts auto-update**: `scope-manager.js` `generatePortalsForScope()` computes `${nodes.length}` dynamically. Hardcoded strings in `data/global/nodes.json` are bypassed.
- **Focus mode / Neighborhood**: Clicking a node opens Neighborhood panel (depth 1/2/3 buttons). `applyFilters()` calls `GR.setNodeVisibility()` to hide nodes beyond N hops. Fully working.
- **Stats HUD**: `#stats` div (bottom-left overlay) shows `visible/total nodes · total edges`. Updated by `updateStats()` in filter-manager.
- **Decade range filter**: `#sb-decade-section` sliders already built into filter-manager. Active on scopes with `decade` field data.
- **Edge type label on hover**: `linkLabel(link => link.type.replace(/_/g,' '))` added in Session 5.

### UI / Visualization

**1. Visible Edge Count in Stats** *(Low priority)*
`updateStats()` shows total edges, not visible edges. Could count edges where both endpoints are in `visibleNodeIds`. File: `js/filter-manager.js:452`.

**2. Performance at Scale** *(Medium priority)*
Global view now renders 885+ nodes. Options if frame rate degrades: (a) reduce charge strength when node count > 500, (b) cap label rendering distance more aggressively, (c) lazy-load mechanism nodes.

**3. Top-N Most-Connected Nodes in Stats** *(Low priority)*
Add a "most connected nodes" list to the stats area — useful for discovering hub nodes. Derive from degree data already in `n.__degree`.

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
| Some `SHARES_MECHANISM_WITH` edges are imprecise | edges.json files | Low |
| Politics-scope nodes thin on mechanism edges | `data/global/politics/` | Medium |
| ~~`world_war_two` duplicate~~ | ~~fixed Session 4~~ | ✓ Done |
| ~~`french_revolution_history` orphan~~ | ~~fixed Session 4~~ | ✓ Done |
| ~~`augusto_caesar` wrong ID~~ | ~~fixed Session 5~~ | ✓ Done |
| ~~Portal counts hardcoded~~ | ~~already dynamic~~ | ✓ N/A |

---

## SESSION HISTORY SUMMARY

| Session | Key Work |
|---------|----------|
| Session 1 | 10 historical topic clusters (Japan, Rome, Spain, China, Ireland, Haiti, etc.); person nodes expanded to 94; HANDOFF.md created |
| Session 2 | Graph renderer fix (edge filter prevents node scatter); MLK duplicate merged; +70 person nodes (183 total); edge type sidebar expanded to individual types |
| Session 3 | Economics scope wired in (portal + scope-manager); +50 history nodes across Pre-Columbian Americas, 2020s, Africa, South Asia, China; +320 edges total |
| Session 4 | Duplicate cleanup (world_war_two merged, french_revolution_history deleted); +83 history nodes across all 8 content priorities; +10 economics nodes; person nodes grew 183→214; total nodes ~794→~885; total edges ~2851→~3084 |
| Session 5 | Technical audit: edge type labels on hover (linkLabel added); augusto_caesar → augustus_caesar rename; HANDOFF technical section corrected (search/focus/stats/portal counts/decade filter all already implemented) |
