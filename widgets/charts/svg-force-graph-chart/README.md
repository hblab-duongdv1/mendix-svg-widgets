# SVG Force Graph Chart (Mendix Pluggable Widget)

Interactive force-directed graph using **@svgdotjs/svg.js** v3: custom forces (repulsion, link springs, center gravity), **pointer drag** with `fx`/`fy`, **click** selection with neighbor highlight, and **viewBox**-based layout inside the widget bounds.

## Studio Pro: install

1. Run `npm run build -w svg-force-graph-chart` (or `npm run build:charts` from the monorepo root).
2. Copy the generated `.mpk` from `widgets/charts/svg-force-graph-chart/dist/<version>/` into your Mendix app `widgets/` folder, or publish via the Mendix Marketplace pipeline your team uses.
3. Restart Studio Pro, add **SVG Force Graph Chart** from the **Charts** toolbox to a page.

## Binding data in Mendix

| Source | Behavior |
|--------|----------|
| **Graph JSON (expression)** | Preferred for dynamic data. Use an expression that returns a **string** of JSON: `{ "nodes": [ { "id": "…", "group": 1 } ], "links": [ { "source": "id", "target": "id", "value": 1 } ] }`. Populate the string from a microflow/nanoflow (e.g. `import mapping` or `Community Commons` **StringFromFile** pattern) and expose it to the page context. |
| **Graph data URL** | HTTPS URL returning the same JSON. Loaded with `fetch` when the expression is empty. |
| **Load demo when empty** | When `true` and both JSON and URL are empty, the widget fetches a built-in Les Misérables sample from GitHub raw (`vasturiano/force-graph` mirror of the classic dataset). |

`links[].source` and `links[].target` must be **string node ids**, not indices.

### CORS and Content Security Policy

Calls to **external URLs** (demo dataset or your own API) must be allowed by the browser and by Mendix **CSP** (runtime settings). If `fetch` fails, use same-origin endpoints, proxy through the Mendix runtime, or bind JSON via the expression instead of a cross-origin URL.

## Properties (summary)

- **Force layout**: use group colors, static node color, node count (clamped ≥10 when the dataset has at least 10 nodes), node radius, link distance, repulsion (negative ⇒ repel, same idea as `d3.forceManyBody`).
- **Dimensions**: same width/height modes as the other SVG chart widgets (`computeChartPixelBox` from `@mendix-svg/svg-engine`).

## Manual test checklist

1. **Demo load**: clear expression and URL, enable **Load demo when empty** → graph appears after network fetch.
2. **Inline JSON**: set expression to a string constant with valid JSON → correct node count and links.
3. **Props**: change repulsion, link distance, node size → layout responds after resize or property change (widget rebuilds the SVG).
4. **Drag**: drag a node → it follows the pointer; release → it moves with the simulation again.
5. **Click**: click a node → incident subgraph highlights; click again → clears selection.
6. **Resize**: change container or width/height → graph reflows inside the new box.
7. **Dispose**: navigate away from the page → no runaway `requestAnimationFrame` (listeners removed in cleanup).

## Technical notes

- Core drawing entry point: `src/forceGraph/drawForceGraphShowcase.ts` (`drawForceGraphShowcase`, `destroyForceGraphShowcase`, `FORCE_GRAPH_CLEANUP_KEY` on the SVG DOM node).
- Simulation step: `src/forceGraph/runForceTick.ts` (not d3-force; standalone math).
- Default dataset URL constant: `DEFAULT_MISERABLES_DATA_URL` in `src/forceGraph/constants.ts`.
