# premaid

Render beautiful Mermaid diagrams from the command line. Paste your Mermaid source and get a refined SVG and PNG with a custom `pretty` theme inspired by mermaid.ai.

**See [`docs/catalog/README.md`](docs/catalog/README.md) for a gallery of all 12 diagram types rendered with the `pretty` theme.**

## Install

This package is not published to npm yet. Install from this repository:

```bash
# Clone + install + link globally
git clone https://github.com/O6lvl4/premaid.git
cd premaid
npm install
npm run build
npm link   # exposes `premaid` on your PATH
```

You can also run without linking:

```bash
node dist/cli.js examples/flowchart.mmd
# or with tsx, no build required
npx tsx src/cli.ts examples/flowchart.mmd
```

To install directly from GitHub (no clone):

```bash
npm install -g github:O6lvl4/premaid
```

## Usage

```bash
# From a file (writes both .svg and .png to cwd)
premaid examples/flowchart.mmd

# From stdin
cat examples/pie.mmd | premaid

# Paste interactively, then Ctrl-D
premaid

# Custom output path (extension optional)
premaid diagram.mmd -o ./out/my-diagram
```

## Lint & auto-fix

`premaid lint` checks Mermaid sources for common mistakes and can repair them in place.

```bash
premaid lint diagram.mmd                      # report
premaid lint --fix diagram.mmd                # fix in place
premaid lint docs/                            # recurse *.mmd / *.md
premaid lint -                                # stdin
cat diagram.mmd | premaid lint --fix -        # read stdin, write fixed to stdout
```

Exit code is `0` when clean (or when every detected issue was auto-fixed), `1` otherwise — drop it into CI.

Rules (applied inside `flowchart` / `graph`; the contrast rule applies everywhere):

| Rule | Detects | Auto-fix |
| --- | --- | --- |
| `literal-newline` | `\n` literal inside labels (Mermaid renders it as text) | replace with `<br/>` |
| `unquoted-special` | Unquoted labels containing `<`, `>`, `/`, `(`, `)`, `:` + space, `\`, `"` | wrap in `"..."`, escape inner `"` as `&quot;` |
| `unbalanced-brackets` | Mismatched `[ ]` / `{ }` on a line | — (warn only) |
| `low-contrast` | `style X fill:#… color:#…` with WCAG contrast < 4.5:1 (`#333` assumed when `color:` is absent) | inject `color:#ffffff` or `#000000` based on luminance |

Markdown files are scanned for ```` ```mermaid ```` fences; fixes are applied inside each block, preserving the rest of the document.

## Claude Code skill

premaid ships a [Claude Code](https://docs.claude.com/en/docs/claude-code) skill at `skills/premaid/SKILL.md` that drives both workflows (draw a diagram from user intent; audit & repair existing docs). Install it with:

```bash
# After a global install
premaid install-skill                  # copy
premaid install-skill --link           # symlink (auto-updates with git pull)

# After a local clone
npm install && npm run install-skill   # copy
npm install && npm run link-skill      # symlink
```

Then invoke with `/premaid` inside Claude Code.

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

- [`examples/`](./examples) — one `.mmd` source file per diagram type
- [`docs/catalog/README.md`](./docs/catalog/README.md) — visual gallery of all 12 rendered outputs

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
