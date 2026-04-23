---
name: premaid
description: Create, render, lint, and auto-repair Mermaid diagrams using the premaid CLI. Use when the user asks to draw/visualize something as a diagram, render a .mmd file, or clean up mermaid blocks in documentation.
---

# premaid

Drives the `premaid` CLI for two workflows:

1. **Generate & render** — user intent → Mermaid source → SVG + PNG with the `pretty` theme.
2. **Lint & fix** — audit `.mmd` / `.md` files, auto-repair common mistakes.

## Preflight

Check the CLI is available before anything else:

```bash
command -v premaid
```

If missing, ask the user to install it:

```bash
npm install -g github:O6lvl4/premaid
```

## Workflow 1 — draw a diagram

1. **Pick a diagram type** from the user's intent:

   | Intent | Type |
   | --- | --- |
   | process / arrows / decision tree | `flowchart` |
   | messages between actors over time | `sequenceDiagram` |
   | data model / schema / relations | `erDiagram` |
   | class hierarchy / OO design | `classDiagram` |
   | state machine | `stateDiagram-v2` |
   | project schedule / roadmap | `gantt` |
   | historical events on a line | `timeline` |
   | share of a whole | `pie` |
   | hierarchy / brainstorm | `mindmap` |
   | strategy placement (2×2) | `quadrantChart` |
   | branch/merge history | `gitGraph` |
   | user journey / satisfaction | `journey` |

2. **Draft** the Mermaid source. Rules that keep it renderable:
   - Multi-line labels use `<br/>`, **not** `\n`.
   - Labels with `<`, `>`, `/`, `(`, `)`, `\`, `"`, or `:` + space must be quoted: `A["GET /users"]`.
   - Inside a quoted label, escape `"` as `&quot;` (Mermaid does **not** accept `\"`).

3. **Write** to `<dir>/<name>.mmd` (ask the user for the path if it's not obvious from context).

4. **Render**:

   ```bash
   premaid path/to/file.mmd -o path/to/file
   ```

   Writes `file.svg` + `file.png` with the `pretty` theme (default).

5. **Verify** before reporting success:

   ```bash
   premaid lint path/to/file.mmd
   ```

   If issues appear, run with `--fix` and re-render.

Theme / background tweaks:

- `-t dark` — dark slate/indigo theme
- `-b gradient` — theme-aware soft gradient
- `-b "#F8FAFC"` — any CSS color
- `-s 3` — higher-DPI PNG

## Workflow 2 — audit / repair existing docs

1. **Scan**:

   ```bash
   premaid lint <paths-or-dirs>
   ```

   Recurses into directories. For `.md` files it extracts ```` ```mermaid ```` fences and lints only those blocks.

2. **Interpret** the output. Exit code `1` means issues present. Group by rule when summarizing to the user:

   | Rule | What triggers it | Auto-fix |
   | --- | --- | --- |
   | `literal-newline` | `\n` inside a label (renders as text) | `\n` → `<br/>` |
   | `unquoted-special` | Unquoted label with `<>/():\\"` or `:` + space | wrap in `"..."`, `"` → `&quot;` |
   | `unbalanced-brackets` | Line-level `[ ]` / `{ }` mismatch | **not auto-fixed — manual** |
   | `low-contrast` | `style X fill:#…` (+ optional `color:#…`) with WCAG ratio < 4.5 | inject `color:#fff` or `#000` by luminance |

3. **Repair** with user consent:

   ```bash
   premaid lint --fix <paths>
   ```

4. **Review the diff** (`git diff`) before committing. The auto-fixer is conservative but not semantically aware:
   - `low-contrast` overrides any existing `color:` in the matched `style` directive. If the user deliberately styled text for a non-default background, preserve it manually.
   - `unquoted-special` auto-fix only understands the shape openers `[`, `[[`, `{`, `{{`, `(`, `((`, `[(`, `([`, `[/`, `[\`, `>`. Other exotic shapes may be misparsed — eyeball the diff.

## Gotchas

- **`\"` does not work inside quoted labels.** Use `&quot;`. This is the #1 cause of `parse error` in Mermaid labels.
- **`premaid lint` applies rules 1–3 only inside `flowchart` / `graph`.** ClassDiagram / sequenceDiagram etc. use different syntax; the linter skips them to avoid false positives. Rule 4 (contrast) applies everywhere.
- **Multiple diagrams in one Markdown file** are linted independently; line numbers in reports are the line in the source `.md` (not within the block).
- **Do not trust `\n` rendering even in quoted labels** — Mermaid prints it literally. Always use `<br/>`.

## Catalog reference

For inspiration and the expected visual output of each diagram type with the `pretty` theme, see `docs/catalog/README.md` in the premaid repo.
