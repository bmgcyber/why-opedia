# Why-opedia

A static, interactive graph encyclopedia where nodes represent historical events, movements, ideologies, phenomena, and analytical mechanisms — connected by **typed causal edges**. Traverse the graph to understand how one thing led to another.

Wikipedia is flat. It has links but no semantic weight. Why-opedia adds two things Wikipedia cannot express: (1) typed causal relationships between documented phenomena, and (2) an analytical mechanism layer — coined concepts like *identity capture* or *legitimate grievance capture* that sit above the documented facts and explain the patterns connecting them.

**Live:** [bmooneyny.github.io/why-opedia](https://bmooneyny.github.io/why-opedia)

## Stack

- **Data** — JSON flat files in `/data/`
- **Frontend** — [Cytoscape.js](https://cytoscape.org/) graph visualization
- **Hosting** — GitHub Pages
- **Cost** — $0

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add nodes and edges via Pull Request.

Run the validator before submitting:

```bash
node scripts/validate.js
```
