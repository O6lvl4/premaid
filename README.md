# mermaid-pretty

Render beautiful Mermaid diagrams from the command line. Paste your Mermaid source and get a refined SVG and PNG with a custom `pretty` theme inspired by mermaid.ai.

## Install

```bash
npm install -g mermaid-pretty
```

Or run locally from a clone:

```bash
npm install
npm run build
node dist/cli.js examples/flowchart.mmd
```

## Usage

```bash
# From a file (writes both .svg and .png to cwd)
mmp examples/flowchart.mmd

# From stdin
cat examples/pie.mmd | mmp

# Paste interactively, then Ctrl-D
mmp

# Custom output path (extension optional)
mmp diagram.mmd -o ./out/my-diagram
```

## Options

| Flag | Description | Default |
| --- | --- | --- |
| `-o, --output <path>` | Output path prefix | `diagram-<timestamp>` in cwd |
| `-t, --theme <name>` | `pretty` / `dark` / `default` / `forest` / `neutral` | `pretty` |
| `-b, --background <value>` | `white` / `transparent` / `dark` / `gradient` / any CSS color | `white` |
| `-s, --scale <n>` | PNG device scale factor (higher = sharper) | `2` |
| `--svg-only` | Write only SVG | — |
| `--png-only` | Write only PNG | — |
| `--no-font` | Do not load the bundled Inter web font | — |

## Themes

- `pretty` (default) — soft pastel palette, rounded corners, drop shadows, Inter typography. Tuned diagram-by-diagram for flowchart, sequence, class, ER, state, gantt, pie, mindmap, timeline, journey, gitgraph, and quadrant.
- `dark` — slate/indigo dark variant.
- `default` / `forest` / `neutral` — stock Mermaid themes with the same Inter font treatment.

## Backgrounds

- `white` / `transparent` / `dark`
- `gradient` — theme-aware soft gradient
- Any CSS color string (e.g. `-b "#F8FAFC"`, `-b "rgb(250,245,255)"`)

## Supported diagram types

All current Mermaid diagram types render through the `pretty` theme:
flowchart · sequence · class · state · ER · gantt · pie · mindmap · timeline · journey · gitGraph · quadrantChart.

See [`examples/`](./examples) for one `.mmd` file per diagram type.

## How it works

1. Bundles Mermaid v11 (UMD) inline into a small HTML template.
2. Renders in headless Chromium via Puppeteer with `themeVariables` + custom CSS injected both into the page `<head>` and appended inside the generated `<svg>` (so it wins source-order specificity against Mermaid's own inline styles).
3. Waits for the `Inter` web font to load before rendering to avoid text overflow from font-metrics shift.
4. Serializes the SVG and takes a high-DPI PNG screenshot of the render root.

## Development

```bash
npm install
npm run dev -- examples/flowchart.mmd   # run from TS sources
npm run build                            # compile to dist/
```

Requires Node.js 20+.

## License

MIT
