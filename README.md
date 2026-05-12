# Mendix SVG chart widgets

Pluggable Mendix web widgets for **line**, **bar**, and **pie** chart placeholders, backed by a shared [`@svgdotjs/svg.js`](https://svgjs.dev/) drawing layer (`@mendix-svg/svg-engine`). This repo is an npm workspaces monorepo: one shared library plus three independent widget packages.

## Repository layout

| Path | Purpose |
|------|---------|
| `shared/svg-engine` | `SvgChartSurface`, chart kinds, `CHART_LAYOUT_DEFAULTS`, `resolveChartDimensions`, `computeChartPixelBox`, `hasChartListData` |
| `widgets/charts/svg-line-chart` | SVG Line Chart widget |
| `widgets/charts/svg-bar-chart` | SVG Bar Chart widget |
| `widgets/charts/svg-pie-chart` | SVG Pie Chart widget |

Each widget ships as its own `.mpk` after build (see below).

## Features

- Toolbox category **Charts** in Studio Pro (`studioProCategory` in widget XML; must appear before `<icon>` per Mendix schema order).
- **General** tab (first-level property group): optional **list data source** (`chartData`) plus **category** and **value** attributes (wired for future series rendering; when no source or no rows, the SVG placeholder is shown).
- **Dimensions** tab: **Width unit** (Percentage of parent vs Pixels), **Width**, **Height unit** (Percentage of width / Pixels / Percentage of parent), **Height** — mapped to pixel size with `computeChartPixelBox` using the parent container rect and `ResizeObserver` for resize.
- Empty **Title** still falls back to a generated heading on the SVG surface.
- Design mode preview mounts the same `SvgChartSurface` as runtime.

## Requirements

- Node.js **>= 16**
- Mendix Studio Pro and a Mendix app targeting **web** (widgets declare `supportedPlatform="Web"`).

## Usage in a Mendix app

1. From this repo root, install dependencies and build the widgets you need (see [Development](#development)).
2. Copy the built `.mpk` from the widget’s `dist/<version>/` folder into your Mendix project’s `widgets/` directory (for example `mendix.SvgPieChart.mpk` from `widgets/charts/svg-pie-chart/dist/0.1.0/`).
3. In Studio Pro, use **App → Synchronize App Directory** so the new or updated package is picked up.
4. Add **SVG Line Chart**, **SVG Bar Chart**, or **SVG Pie Chart** from the toolbox (under Charts) and adjust properties as needed.

You can build all three chart packages with `npm run build:charts`.

## Development

```bash
npm install
```

If you hit peer dependency issues on npm 7+, try `npm install --legacy-peer-deps`.

### Scripts (root)

| Command | Description |
|---------|-------------|
| `npm run build:engine` | Compile `shared/svg-engine` (TypeScript). |
| `npm run build:charts` | Build line, bar, and pie widgets (each produces an `.mpk` under its `dist/` folder). |
| `npm run build` | Version-aware: only runs `build` in workspaces under `shared/*` and `widgets/charts/*` whose `package.json` **version** changed since the last successful root `build` (state in `.build-widget-versions.json`, gitignored). |
| `npm run build:all` | Build every workspace that defines a `build` script (previous default behavior). |
| `FORCE_BUILD_ALL=1 npm run build` | Same as `build:all` for one invocation. |
| `npm test` | Build the engine, then run unit tests in workspaces that have them. |
| `npm run dev:line` / `dev:bar` / `dev:pie` | Start the pluggable-widgets dev server for that chart widget. |
| `npm run lint` | Lint workspaces that expose a lint script. |
| `npm run test:e2e` | Cypress end-to-end runner (see `cypress/`). |

Per-widget scripts (`build`, `dev`, `lint`, `test`) live in each package under `widgets/charts/*`.

### Widget XML and typings

Property definitions live in `src/<WidgetName>.xml`. Typings under `typings/` are generated from that XML when you use the Mendix tooling; avoid hand-editing generated files if you plan to regenerate them.

## Issues and suggestions

Use [GitHub Issues](https://github.com/hblab-duongdv1/mendix-svg-widgets/issues) for bug reports and feature requests.

## License

Apache-2.0 (see `package.json`).
