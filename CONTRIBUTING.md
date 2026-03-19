# Contributing to Why-opedia

Why-opedia grows through Pull Requests. There is no backend, no form, no API — just JSON files and a schema validator. If your contribution passes the validator and makes intellectual sense, it will be merged.

---

## Before You Start

Run the validator on the current data to confirm your environment works:

```bash
node scripts/validate.js
```

All checks should pass before you add anything. If they don't, something is wrong with the existing data — open an issue.

---

## Adding a Node

Open `data/nodes.json` and append an object to the array. Follow this schema exactly:

```json
{
  "id": "snake_case_unique_permanent_id",
  "label": "Human Readable Display Name",
  "node_type": "reference",
  "category": "event",
  "wikipedia": "https://en.wikipedia.org/wiki/Article_Title",
  "summary": "1-2 sentences. Plain language. What is this and why does it matter to the graph.",
  "decade": "1970s",
  "tags": ["tag1", "tag2"]
}
```

**Field rules:**

- `id` — snake_case, lowercase, unique across all nodes. **Never change it after merging.** Other nodes reference it by ID.
- `node_type` — must be `reference` or `mechanism`. See Node Types below.
- `wikipedia` — required for `reference` nodes, must start with `https://en.wikipedia.org/wiki/`. Must be omitted entirely for `mechanism` nodes.
- `label` — what displays in the graph. Does not need to match the Wikipedia article title exactly.
- `summary` — 1-2 sentences maximum. This is the tooltip text, not an article.
- `decade` — approximate and human-readable: `"1930s"`, `"Medieval"`, `"1960s–Ongoing"`, `"Ongoing"`.
- `tags` — freeform lowercase strings. Examples: `psychology`, `religion`, `economics`, `identity`, `medical`, `technology`, `history`.

### Node Types

**`reference`** — documented real-world events, movements, ideologies, and phenomena that Wikipedia covers. Requires a `wikipedia` link.

> Examples: `the_holocaust`, `mk_ultra`, `watergate`, `fat_acceptance_movement`

**`mechanism`** — analytical concepts that describe recurring patterns. The original intellectual contribution of Why-opedia. Wikipedia may have no article for them. Must NOT have a `wikipedia` field.

> Examples: `identity_capture`, `broken_epistemology`, `legitimate_grievance_capture`, `scapegoating_mechanism`

Mechanism nodes are the *why* that connects the *what*. They typically sit upstream of reference nodes in the graph.

### Category Taxonomy

Every node gets exactly one category. This drives color in the graph.

| Category | Description |
|---|---|
| `event` | A discrete historical event with a start and end |
| `movement` | An organized social, political, or cultural movement |
| `ideology` | A belief system or worldview |
| `institution` | An organization, agency, or formal body |
| `mechanism` | An abstract recurring pattern or psychological/social dynamic |
| `person` | An individual — use sparingly, prefer the idea over the person |
| `policy` | A law, regulation, or formal policy |
| `phenomenon` | A real-world observable pattern that doesn't fit the above |
| `product` | A specific product or technology |
| `community` | An online or offline community with its own culture |

---

## Adding an Edge

Open `data/edges.json` and append an object to the array:

```json
{
  "id": "source_node_id__target_node_id",
  "source": "source_node_id",
  "target": "target_node_id",
  "type": "ENABLED",
  "label": "short description under 8 words",
  "note": "Optional. One sentence with a concrete example or mechanism.",
  "confidence": "high"
}
```

**Field rules:**

- `id` — convention is `{source}__{target}` (double underscore). If multiple edges exist between the same nodes, append `__2`, `__3`.
- `source` and `target` — must be valid node `id` values that exist in `nodes.json`.
- `type` — must be one of the allowed types below.
- `label` — appears on the edge in the graph. Keep it under 8 words.
- `note` — optional but encouraged. Specific mechanism, concrete example, or citation.
- `confidence` — required. Be honest: `high`, `medium`, or `speculative`.

### Edge Type Taxonomy

| Type | Use when… |
|---|---|
| `CAUSED` | Direct, proximate, documented cause. A led to B. Use sparingly — most historical causation is enabling, not direct. |
| `ENABLED` | Created the conditions for B without directly triggering it. The most common type. |
| `EXPLOITED` | B took advantage of A — A was pre-existing, B weaponized it. |
| `NORMALIZED` | A made B socially or culturally acceptable. |
| `REACTIVATED` | A dormant or historical pattern A was brought back by B. |
| `PROVIDED_COVER_FOR` | A gave B plausible deniability or ideological justification. |
| `PRODUCED` | A directly created or generated B as an output. |
| `DISCREDITED` | A damaged the credibility or influence of B. |
| `SHARES_MECHANISM_WITH` | A and B are not causally linked but operate via the same underlying pattern. Undirected — pick whichever direction is more readable. |
| `SELF_REINFORCES` | A feeds back into itself in a loop. Source and target are the same node. |
| `COLONIZED` | Ideological or identity forces took over A and redirected it from its original purpose. |
| `FRAGMENTED_INTO` | A broke apart or diverged into multiple distinct things. |
| `FORCED_INTO` | External pressure pushed a group into a role they didn't choose, which was later blamed on them. |

**When choosing a type:** `CAUSED` is the strongest claim — only use it when the link is direct and documented. `ENABLED` is the most common. When in doubt between two types, pick the weaker one and explain the stronger interpretation in `note`.

---

## Validation

Run the validator before submitting your PR:

```bash
node scripts/validate.js
```

The validator checks:
- All node and edge IDs are unique
- Every edge `source` and `target` references a valid node ID
- Every edge `type` is in the allowed taxonomy
- Every node `category` is in the allowed taxonomy
- Every node has a valid `node_type` of `reference` or `mechanism`
- Every `reference` node's `wikipedia` URL starts with `https://en.wikipedia.org/wiki/`
- No `mechanism` node has a `wikipedia` field
- Every edge has a valid `confidence` value
- All required fields are present

**PRs that fail validation will not be merged.** The CI workflow runs automatically on every PR that touches `data/`.

---

## Pull Request Guidelines

- One conceptual addition per PR (one cluster of nodes + their edges, or a single new connection)
- Describe in the PR body what you're adding and why it belongs in the graph
- If you're adding a `mechanism` node, explain why it can't be represented as a `reference` node
- If you're adding a `speculative` edge, explain the reasoning in `note`

---

## What Not to Add

- Nodes that duplicate existing nodes under a different label
- Edges with `CAUSED` type where the link is not directly documented
- `mechanism` nodes that already have a clean Wikipedia article covering the same concept
- `person` nodes where the movement or idea could be the node instead
