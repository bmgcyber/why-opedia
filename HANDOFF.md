# HANDOFF.md — Why-Opedia

> Read this file at the start of every session. It is the source of truth for current state, objectives, and decisions made. Read `prompts/PURPOSE.md` before adding content.

## STANDING DIRECTIVE (added Session 8 — never remove this)

**The graph must maintain balance between negative and positive causal forces.**

Why-opedia explains *why* — including why things improve, not only why they fail. Every session adding negative nodes, mechanisms, or events must also add positive counterparts. Positive content is not optional or secondary; it is structurally required.

**Positive content means:**
- Mechanisms by which good outcomes occur (nonviolent resistance, truth & reconciliation, social trust, moral circle expansion, coalition building, institutional resilience, scientific consensus, mutual aid, whistleblowing, restorative justice)
- Concrete historical victories and achievements (civil rights legislation, peace agreements, disease eradication, international cooperation successes, poverty reduction, rights expansions)
- Institutions and structures that produce accountability and protect rights (separation of powers, free press, civil society, international law, federalism)
- Cultural works that expanded empathy, moral circles, or dignity for excluded groups
- Economic models that reduce inequality (social democracy, cooperatives, development miracles)
- Psychological mechanisms that enable resistance, resilience, and moral action

**Every negative mechanism should have a corresponding positive counter-mechanism already in the graph or on the roadmap. Examples:**
- `dehumanization` ↔ `moral_circle_expansion`, `empathy`
- `manufactured_consent` ↔ `free_press`, `scientific_consensus`
- `democratic_backsliding` ↔ `institutional_resilience`, `civil_society`, `separation_of_powers`
- `structural_violence` ↔ `restorative_justice`, `mutual_aid`, `collective_resilience`
- `mass_incarceration` ↔ `restorative_justice`, `harm_reduction`
- `regulatory_capture` ↔ `whistleblowing`, `free_press`
- `collective_trauma` ↔ `truth_and_reconciliation`, `post_traumatic_growth`

**Ongoing positive content roadmap (add to this as new items are identified):**
- `indian_independence_1947` — Gandhi's nonviolent independence movement
- `end_of_apartheid_1994` — Mandela's election and democratic transition
- `voting_rights_act_1965` — legal enforcement of Black voting rights
- `ada_1990` — Americans with Disabilities Act; disability rights as rights
- `marriage_equality_us_2015` — Obergefell v. Hodges, LGBTQ+ rights landmark
- `paris_agreement_2015` — first universal climate accord
- `nuclear_test_ban_treaty_1963` — first nuclear arms control success
- `camp_david_accords_1978` — Egypt-Israel peace; Arab-Israeli diplomacy
- `emancipation_proclamation_1863` — legal end of slavery in Confederate states
- `labor_rights_eight_hour_day` — IWW and labor movement's foundational victory
- `rural_electrification_1930s` — New Deal infrastructure lifting rural poverty
- `germ_theory_of_disease` — Pasteur/Koch; foundational to modern medicine
- `scientific_method` — adversarial empiricism as positive epistemic mechanism
- `grassroots_organizing` — bottom-up power building mechanism
- `community_land_trusts` — permanently affordable housing mechanism
- `reparations` — economic redress mechanism for historical wrongs
- `selma_2014` / `glory_1989` / `black_panther_2018` — positive representation films
- `disability_rights_art` — art that humanized disabled people
- `mental_health_movement` — deinstitutionalization and rights-based mental health care
- Additional person nodes: `nelson_mandela`, `mahatma_gandhi` (already in politics — need person nodes in history if missing), `eleanor_roosevelt`, `desmond_tutu`, `rosa_parks`, `cesar_chavez`, `dolores_huerta`

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
    art/nodes.json + edges.json   — Art & Culture scope (added Session 6)
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
`person`, `event`, `movement`, `institution`, `era`, `ideology`, `phenomenon`, `mechanism`, `reference`, `artifact` (specific cultural works: films, books, albums, artworks — added Session 6)

### Edge ID convention: `{source_id}__{target_id}` (double underscore)

### Rules for people:
- **Never add floating person nodes** — every person must have at least 2 edges to existing nodes
- Person nodes go in the scope where their primary activity occurred (usually `global/history`)

---

## CURRENT OBJECTIVE (Session 20 — 2026-04-13)

**Completed this session:**
1. **Technology→History cross-scope links (32 edges)** — Wired tech scope nodes directly to history events they caused/enabled:
   - `tech_nuclear_weapons` → `atomic_bombing_hiroshima`, `cold_war_nuclear_fear`, `cuban_missile_crisis`, `nuclear_test_ban_treaty_1963`, `space_race`, `cold_war_origins`
   - `tech_social_media`/`tech_internet`/`tech_mobile_phone` → `arab_spring`, `black_lives_matter`, `russia_election_interference`, `ukraine_euromaidan`, `social_media_revolution`, `ferguson_protests_2014`
   - `tech_printing_press` → `protestant_reformation`, `scientific_revolution`
   - `tech_nuclear_power` → `chernobyl_disaster`
   - `tech_surveillance_tech`/`tech_artificial_intelligence` → `surveillance_state_china`
   - `tech_drone_warfare`/`tech_gps_satellite` → `afghanistan_war_2001`, `iraq_war_2003`
   - `tech_vaccines` → `smallpox_eradication_1980`, `polio_vaccine_1955`
   - `tech_renewable_energy` → `paris_agreement_2015`
   - `tech_transistor` → `apollo_moon_landing`
2. **Religion scope launched (10th scope)** — 27 nodes, 33 within-scope edges, 34 cross-scope edges:
   - **Religions:** Christianity, Roman Catholic Church, Islam, Judaism, Hinduism, Buddhism, Protestantism, Eastern Orthodoxy, Sunni/Shia Islam, Sufism
   - **Events:** Council of Nicaea (325), Great Schism (1054), Islamic Golden Age, Council of Trent, Second Vatican Council
   - **People:** Rumi (martin_luther, john_calvin, thomas_aquinas already in history)
   - **Phenomena:** Liberation Theology, Wahhabism, Religious Zionism, Evangelical Movement, Secularization, Religious Nationalism, Religious Fundamentalism, Religious Antisemitism, Caste System, Protestant Work Ethic
   - **Key cross-scope links:** religion→history (Crusades, Protestant Reformation, Spanish Inquisition, Holocaust, Al-Qaeda, ISIS, Iranian Revolution, Partition of India, Rohingya genocide, etc.), religion→mechanisms (christian_nationalism, sectarianism, authoritarian_control, scapegoating, dehumanization, structural_violence, etc.)

**Dataset state after Session 20:**
| Scope | Nodes | Edges |
|-------|-------|-------|
| History | 934 | 1,776 |
| Technology | 30 | 32 |
| Religion | **27** | **33** |
| Economics | 71 | 163 |
| Politics | 126 | 331 |
| Psychology | 69 | 142 |
| Media | 55 | 125 |
| Health | 62 | 126 |
| Art & Culture | 61 | 70 |
| Mechanisms | 223 | **4,115** (cross-scope) |
| **Total** | **1,658** | **~6,913** |

**Next content priorities:**
- Positive roadmap items still to add: `ada_1990`, `marriage_equality_us_2015`, `camp_david_accords_1978`, `emancipation_proclamation_1863`
- Missing person nodes: `eleanor_roosevelt`, `desmond_tutu`, `rosa_parks`, `cesar_chavez`, `dolores_huerta`, `harriet_tubman`, `frederick_douglass`
- Global gaps: South American dictatorships depth (Argentina junta, Brazil military), Southeast Asian decolonization
- More religion cross-scope: religion nodes to economics (Protestant work ethic → capitalism growth), religion to politics (theocracy, separation of church/state)
- Duplicate audit pass

---

## PREVIOUS OBJECTIVE (Session 19 — 2026-04-12)

**Completed this session:**
1. **Ghost node floating bug fixed** — Removed `!n.ghost` from `computeTiers` filter in `js/graph-renderer.js:420`. Ghost nodes now rank by degree in the semantic zoom tier system instead of always-visible with hidden edges.
2. **Stats HUD upgraded** — Visible edge count (shows filtered/total when filters active) + clickable top-5 most-connected nodes. `js/filter-manager.js:433-484`, `style.css`.
3. **5 duplicate history node groups merged** — `first_gulf_war`→`gulf_war_1990`, `suez_crisis`→`suez_crisis_1956`, `persian_empire`→`persian_achaemenid_empire`, `sassanid_empire`+`sassanid_empire_culture`→`sassanid_persian_empire`, `greco_persian_wars`→`persian_wars`. 6 nodes removed.
4. **Middle East modern history batch** — 9 new history nodes, 5 new mechanism nodes, 18 history edges, 23 mechanism edges.
   - **History:** `iran_iraq_war`, `lebanon_civil_war`, `first_intifada`, `second_intifada`, `hamas`, `hezbollah`, `plo`, `yasser_arafat`, `abraham_accords_2020` (positive)
   - **Mechanisms:** `nationalism`, `sectarianism`, `asymmetric_warfare`, `occupation`, `resistance_movement`
5. **Edge vocabulary** — already clean from Session 16; `UNDERMINED` already in filter sidebar.
6. **3 more duplicate merges** — `holocaust→the_holocaust`, `abolition_movement→abolitionist_movement`, `atlantic_slave_trade→transatlantic_slave_trade`. Fixed stale `holocaust` ref in psychology/edges.json.
7. **Belgian Congo / 1989 revolutions / aviation / CRISPR / prison reform / IHL batch** — 9 history nodes + 2 mechanism nodes + 43 edges.
   - **History:** `belgian_congo`, `leopold_ii`, `east_german_revolution_1989`, `romanian_revolution_1989`, `german_reunification_1990`, `ostpolitik`, `aviation_revolution`, `crispr_gene_editing`, `prison_reform_movement`, `international_humanitarian_law`
   - **Mechanisms:** `antibiotic_resistance`, `colonial_extraction`
8. **Node spacing** — cumulative 44% increase from original: charge `-720`, link distance `288`/`547`, spread `±288`.
9. **Highlight fix** — removed `graphInstance.nodeOpacity()` call (triggerUpdate rebuilds objects); direct material traversal now works correctly.

**Next content priorities:**
- More labor history: `cio_formation`, `homestead_strike_1892`, `national_labor_relations_act`, `sit_down_strikes`
- Missing person nodes: `paul_robeson` ✓ (added), `langston_hughes`, `audre_lorde`, `bell_hooks`
- Missing events: `somalia_civil_war`, `haiti_political_collapse`, `iran_nuclear_deal`, `operation_phoenix`
- More positive nodes: `community_organizing_movements`, `international_court_of_justice`, `reparations_movements`
- Global: South American dictatorships depth (Argentina junta, Brazil military), Southeast Asian history

---

## PREVIOUS OBJECTIVE (Session 16 — 2026-04-05)

**Edge type vocabulary cleanup** — COMPLETE.

Edge distribution audit: `ENABLED` was 39.8% of edges (used as catch-all); 70+ one-off types. All cleaned to canonical 12-14 types. `UNDERMINED` added to filter sidebar.

---

## PREVIOUS OBJECTIVE (Session 15 — 2026-04-04)

**Continue building the full human history graph from beginning to present.** The current session completed batches 6–19 covering: WWI-WWII, Cold War, Civil Rights, decolonization, 1968-1991, post-Cold War, 2010s-present, ancient world, early modern, 19th century, non-Western civilizations, economics/psychology/media/health/art scope depth, politics enrichment, and new mechanism nodes. 

**Next session should continue with:**
- Person nodes for key historical figures missing from history scope (Rosa Parks, Harriet Tubman, Frederick Douglass, Sojourner Truth, Cesar Chavez, Dolores Huerta, Eleanor Roosevelt, Desmond Tutu)
- More events in Latin American history (1970s-90s dictatorships, Zapatistas, Pink Tide)
- More events in Asian history (Korean democracy movement, Tiananmen follow-up, India post-partition)
- Science & technology history nodes (moon landing, green revolution, internet invention, genome project)
- Missing positive events from the roadmap below

**Positive content roadmap (items still to add):**
- `ada_1990` — Americans with Disabilities Act
- `marriage_equality_us_2015` — Obergefell v. Hodges
- `nuclear_test_ban_treaty_1963` — first nuclear arms control
- `camp_david_accords_1978` — Egypt-Israel peace
- `emancipation_proclamation_1863` — legal abolition in Confederate states
- `labor_rights_eight_hour_day` — labor movement victory
- `rural_electrification_1930s` — New Deal infrastructure
- `scientific_method` — adversarial empiricism as positive epistemic mechanism
- `grassroots_organizing` — bottom-up power building mechanism
- Person nodes: `eleanor_roosevelt`, `desmond_tutu`, `rosa_parks`, `cesar_chavez`, `dolores_huerta`, `harriet_tubman`, `frederick_douglass`

---

## CURRENT DATASET STATE (as of 2026-04-13, Session 19)

| Scope | Nodes | Edges |
|-------|-------|-------|
| History | **934** | **1,776** |
| Technology | **30** | 32 |
| Economics | **71** | 163 |
| Politics | **126** | 331 |
| Psychology | **69** | 142 |
| Media | **55** | 125 |
| Health | **62** | 126 |
| Art & Culture | **61** | 70 |
| Mechanisms | **223** | **4,049** (cross-scope) |
| **Total** | **1,631** | **~6,814** |

**Data integrity:** 0 broken edge references. Verified after every batch.

**Session 19 key accomplishments:**
- **Positive counterbalance batch (17 nodes):** langston_hughes, audre_lorde, bell_hooks, zora_neale_hurston, shirley_chisholm, disability_rights_act_ada, truth_commission_argentina, eight_hour_workday_movement, community_land_trust_movement, national_labor_relations_act, cio_formation, sit_down_strikes, homestead_strike_1892, haiti_political_collapse, iran_nuclear_deal, operation_phoenix, somalia_civil_war
- **Technology scope launched (new 9th scope):** 30 nodes (ancient → AI), 32 within-scope edges, 96 mechanism edges; registered in scopes.json, global/nodes.json, scope-manager.js

**Next content priorities:**
- Cross-scope connections: technology nodes → history events (tech_social_media → arab_spring, tech_nuclear_weapons → cold_war, etc.)
- Religion scope — same pattern as Technology, major missing scope
- Global gaps: South American dictatorships depth, Southeast Asian decolonization
- Duplicate audit pass

### Session 15 additions (batches 6-19):
- **History:** +200+ nodes spanning agricultural revolution → 2020s present
- **Mechanisms:** +50+ new nodes including: proxy_war, red_scare, civil_disobedience, neoliberalism, democratic_backsliding, state_collapse, surveillance_state, war_on_terror, financial_contagion, platform_capitalism, right_wing_populism, climate_denial, polarization, manufactured_doubt, resource_curse, class_struggle, settler_colonialism, chattel_slavery, knowledge_suppression, social_movement, pseudo_science, economic_sanctions, media_framing, election_interference, rent_seeking, political_violence (all with full descriptions)
- **All scopes deepened:** economics (bretton_woods through gig economy), psychology (Milgram, Zimbardo, Asch, etc.), media (radio through social media era), health (germ theory through COVID vaccine), art (propaganda art through climate art), politics (+11 nodes, +50 mechanism connections)

### Session 12 additions:
- **Thin node wiring complete (history):** All 33 remaining history nodes with <2 mechanism edges wired to ≥2 edges
- **Politics thin/zero nodes wired:** 14 zero-edge + 24 one-edge politics nodes received mechanism connections (united_nations, nato, lyndon_johnson, cold_war_proxy_wars, immigration_crisis, disability_rights, cancel_culture, climate_activism, environmental_justice, gun_violence_policy, white_supremacy_movement, gender_pay_gap, food_sovereignty, thomas_hobbes, niccolo_machiavelli, vladimir_lenin, franklin_d_roosevelt, dwight_eisenhower, jawaharlal_nehru, code_of_hammurabi, egyptian_pharaoh, kingdom_of_kush, meroe, kerma, athenian_democracy, george_w_bush, nuclear_weapons, human_rights_declaration, israel_palestine, school_to_prison_pipeline, dark_money_politics, proportional_representation + others)
- **Health thin nodes wired:** chronic_illness_policy, opioid_corporate_liability, mental_health_care_access, obesity_epidemic, medical_racism
- **Media thin node wired:** internet_history
- **Duplicate fixed:** `franklin_roosevelt` merged into `franklin_d_roosevelt` (same person; old node removed, 4 edges remapped)
- **Mechanism edges:** grew 2167 → 2251

### Session 8 additions (positive nodes):
- **Mechanisms (8 new):** truth_and_reconciliation, moral_circle_expansion, social_trust, mutual_aid, institutional_resilience, coalition_building, whistleblowing, restorative_justice (+ nonviolent_resistance and scientific_consensus already existed)
- **History (11 new):** civil_rights_act_1964, good_friday_agreement_1998, south_africa_trc, smallpox_eradication_1980, montreal_protocol_1987, universal_declaration_human_rights_1948, marshall_plan_1948, suffrage_19th_amendment, polio_vaccine_1955, international_criminal_court, decolonization_independence_wave
- **Politics (6 new):** separation_of_powers, free_press, civil_society, international_law, federalism, proportional_representation
- **Economics (6 new):** microfinance, worker_cooperatives, social_democracy, east_asia_economic_miracle, global_poverty_decline, fair_trade_movement
- **Psychology (5 new):** post_traumatic_growth, moral_courage, bystander_intervention, empathy, collective_resilience
- **Health (4 new):** sanitation_revolution_19c, global_vaccination_campaigns, hiv_treatment_breakthrough, harm_reduction
- **Art (5 new):** roots_1977, to_kill_a_mockingbird_1960, beloved_1987, philadelphia_1993, diary_of_a_young_girl
- **73 new cross-scope edges** connecting all positive nodes to the existing graph

### Session 6–7 additions:
- **Art & Culture scope (Session 6):** Full scope wired (scopes.json + scope-manager.js + portal node). 40 art artifact nodes, 22 within-scope edges, 57 initial cross-scope edges. New `artifact` node category introduced.
- **Artist/author person nodes (Session 6):** harriet_beecher_stowe, thomas_paine, leni_riefenstahl, w_e_b_dubois, rachel_carson, upton_sinclair, billie_holiday, woody_guthrie, pablo_picasso, frantz_fanon, paulo_freire, spike_lee, joseph_goebbels, william_randolph_hearst, betty_friedan (+15 to history scope)
- **9 missing history nodes (Session 7):** ku_klux_klan, russian_revolution_1917, abolitionist_movement, spanish_civil_war_1936, japanese_american_internment_1942, oklahoma_city_bombing_1995, environmentalism_movement, deindustrialization, nazi_germany
- **61 additional cross-scope edges (Session 7):** 22 resolved skipped edges + 39 art→history/mechanism wiring; total mechanism edges grew 1444→1505
- **3 orphan politics edges fixed (Session 7):** french_revolution_history → french_revolution remapped

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
              'data/global/politics','data/global/psychology','data/global/health',
              'data/mechanisms','data/global/art']
all_ids = set()
for d in scope_dirs:
    p = f"{d}/nodes.json"
    if os.path.exists(p):
        with open(p) as f: all_ids |= {n['id'] for n in json.load(f)}

for scope, ef in [('history','data/global/history/edges.json'),
                  ('mechanisms','data/mechanisms/edges.json'),
                  ('economics','data/global/economics/edges.json'),
                  ('politics','data/global/politics/edges.json'),
                  ('art','data/global/art/edges.json')]:
    with open(ef) as f: edges = json.load(f)
    broken = [(e['id'],e['source'],e['target']) for e in edges
              if e['source'] not in all_ids or e['target'] not in all_ids]
    print(f"{scope}: {len(broken)} broken")
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

### Priority 7 — 2020s & Contemporary Depth ✓ DONE (Session 10)
Added all remaining: rohingya_genocide, long_covid, defund_police_debate.
- **Still missing:** `ethiopia_tigray_war`, `haiti_political_collapse` (lower priority)

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
| ~~Scope section (#sb-scope-section) not showing in global view~~ | ~~fixed Session 13~~ | ✓ Done |
| ~~Analytics button broken~~ | ~~fixed Session 13~~ | ✓ Done |

### Session 13 bug fixes (performance regression)

Perf commit f3e2fd9 activated `applySemanticZoom()` (previously a stub). If it threw before the camera null check was added (or for any other reason), the exception would abort `loadScopeIntoGraph` mid-execution:
- Scope section: `updateScopeSection(nodes)` never ran → section stayed hidden
- Analytics: `allNodes = nodes` was set AFTER `FM.clearNeighborhoodRoot()` — if that call chain threw, `allNodes` remained `[]`

**Fix (commit Session 13):**
- Moved `allNodes = nodes` to the very top of `loadScopeIntoGraph` (before any potentially-failing code)
- Wrapped filter/LOD operations in try-catch so `updateScopeSection` + `updateURLState` always run
- Added try-catch in `openAnalyticsDashboard` so exceptions surface in console instead of silently failing
- Edge data: 351 mechanism edges had `relation` field instead of `type` — fixed in 5e22646
- Camera null check added to `applySemanticZoom` in e44fdcd

---

## SESSION HISTORY SUMMARY

| Session | Key Work |
|---------|----------|
| Session 1 | 10 historical topic clusters (Japan, Rome, Spain, China, Ireland, Haiti, etc.); person nodes expanded to 94; HANDOFF.md created |
| Session 2 | Graph renderer fix (edge filter prevents node scatter); MLK duplicate merged; +70 person nodes (183 total); edge type sidebar expanded to individual types |
| Session 3 | Economics scope wired in (portal + scope-manager); +50 history nodes across Pre-Columbian Americas, 2020s, Africa, South Asia, China; +320 edges total |
| Session 4 | Duplicate cleanup (world_war_two merged, french_revolution_history deleted); +83 history nodes across all 8 content priorities; +10 economics nodes; person nodes grew 183→214; total nodes ~794→~885; total edges ~2851→~3084 |
| Session 5 | Technical audit: edge type labels on hover (linkLabel added); augusto_caesar → augustus_caesar rename; HANDOFF technical section corrected (search/focus/stats/portal counts/decade filter all already implemented) |
| Session 6 | Art & Culture scope: full wiring (scopes.json, scope-manager.js, portal); 40 art artifact nodes; 22 within-scope edges; 57 cross-scope edges; 15 artist person nodes (history) |
| Session 7 | 9 missing history nodes (KKK, Russian Revolution, Abolitionist Movement, Spanish Civil War, Japanese American Internment, Oklahoma City Bombing, Environmentalism, Deindustrialization, Nazi Germany); 61 additional cross-scope edges; 3 orphan politics edges fixed; total 915 nodes, 1505 mechanism edges |
| Session 8 | Positive balance pass: 45 new nodes across all scopes (mechanisms, history, politics, economics, psychology, health, art); 73 new cross-scope edges + 16 within-scope; total 960 nodes, 1578 mechanism edges, 3312 total edges |
| Session 9 | Continued positive additions: 10 history events (indian_independence, end_of_apartheid, voting_rights_act, ada, marriage_equality, emancipation, 13th amendment, camp_david, nuclear_test_ban, paris_agreement); 5 person nodes (gandhi, eleanor_roosevelt, mlk, cesar_chavez, dolores_huerta); 5 mechanisms (grassroots_organizing, land_reform, public_health_infrastructure, reparations, democratic_accountability); 43 cross-scope edges; total 978 nodes, 1621 mechanism edges, 3355 total edges; standing directive added to HANDOFF.md |
| Session 10 | Positive roadmap completions: labor_rights_eight_hour_day, rural_electrification, germ_theory, mental_health_movement, scientific_method, community_land_trusts, universal_basic_income, debt_jubilee; art: glory_1989, selma_2014, black_panther_2018, crip_camp_2020; 3 Priority 7 negatives (rohingya_genocide, long_covid, defund_police_debate); 69 new cross-scope edges including politics scope mechanism wiring and cross-scope gap filling (black_death, mongols, cold_war, great_migration); total 994 nodes, 1690 mechanism edges, 3424 total edges |
| Session 11 | Deep mechanism wiring pass across all priority node groups: 91 cross-scope edges connecting Indigenous/manifest_destiny, East African kingdoms, Chinese history, South Asian empires, Pre-Columbian nodes, Ottoman history, medieval Europe, Priority 9 persons (angela_davis, fred_hampton, aung_san_suu_kyi, volodymyr_zelensky, xi_jinping), and all 10 economics Priority 10 nodes; within-scope economics edges for glass_steagall/housing_bubble/nafta/wto/gig/qe/offshore; added geoffrey_chaucer to history; merged 2 duplicates (hiroshima_nagasaki→atomic_bombing_hiroshima, protestant_reformation_history→protestant_reformation); total 1036 nodes, 2167 mechanism edges, 3700+ total edges |
| Session 12 | Thin node wiring completion: all remaining thin history nodes (33) wired to ≥2 mechanism edges; politics thin/zero nodes wired (38 nodes: united_nations, nato, LBJ, FDR, cold_war_proxy_wars, immigration_crisis, disability_rights, cancel_culture, climate_activism, environmental_justice, gun_violence_policy, white_supremacy_movement, gender_pay_gap, food_sovereignty + 24 one-edge nodes); health/media thin nodes wired; merged franklin_roosevelt→franklin_d_roosevelt duplicate; total ~998 nodes, 2251 mechanism edges |
| Session 13 | Performance optimization: LOD/semantic zoom activated (tier 1/2/3 by degree percentile), global view edge reduction (mechanism-only edges = 2251 vs 3828), adaptive force simulation (warmupTicks 150→50 for large graphs), merged pulse intervals, label texture cache. Fixed 2 post-perf regressions: scope section not showing + analytics broken (root cause: `allNodes = nodes` was set after a potentially-throwing call chain; fixed by restructuring `loadScopeIntoGraph`). Fixed 351 mechanism edges with `relation` field instead of `type`. Economics scope wired (new data, untracked). |
| Session 14–15 | (see Previous Objectives above) Large history content expansion (+200 history nodes, +50 mechanism nodes across all major eras) |
| Session 16 | Edge type vocabulary cleanup: canonical 12-14 types enforced, `UNDERMINED` added to sidebar, tense normalization, non-causal type deletion. Edge distribution audit run. |
| Session 17 | Bug: ghost node floating fixed (removed `!n.ghost` from `computeTiers`). Stats HUD: visible edge count + clickable top-5 hub nodes. Duplicate cleanup: 5 node groups merged (6 removed). Middle East modern history: 9 history + 5 mechanism nodes, 41 edges. Total: 1,526 nodes. |
| Session 18 | Complete mechanism wiring pass (all nodes across all scopes now ≥2 mech edges, +530 edges). Jim Crow/carceral depth +20 nodes. Labor/civil rights/contemporary +19 nodes. 3 duplicate merges. Total: 1,584 nodes, ~6,610 edges. |
| Session 19 | Technology scope launched (30 nodes, 32+96 edges). Positive counterbalance batch: +17 history nodes (cultural figures, labor depth, global gaps). Total: 1,631 nodes, ~6,814 edges. |
