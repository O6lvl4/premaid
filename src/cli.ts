#!/usr/bin/env node
import { Command } from "commander";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { extname, join, resolve } from "node:path";
import pc from "picocolors";
import {
  lintMarkdown,
  lintMermaid,
  type LintIssue,
  type LintResult,
} from "./lint.js";
import { renderMermaid } from "./render.js";
import type { ThemeName } from "./theme.js";

const VALID_THEMES: ThemeName[] = [
  "pretty",
  "dark",
  "default",
  "forest",
  "neutral",
];

interface CliOptions {
  output?: string;
  theme: string;
  background: string;
  scale: string | number;
  svgOnly?: boolean;
  pngOnly?: boolean;
  noFont?: boolean;
}

const program = new Command();

program
  .name("premaid")
  .description("Render beautiful Mermaid diagrams from the command line")
  .version("0.1.0")
  .argument(
    "[file]",
    "Mermaid source file. If omitted, reads from stdin (or prompts when attached to a TTY)."
  )
  .option(
    "-o, --output <path>",
    "Output path. Extension is optional; both .svg and .png are written."
  )
  .option(
    "-t, --theme <theme>",
    `Theme: ${VALID_THEMES.join(" | ")}`,
    "pretty"
  )
  .option(
    "-b, --background <value>",
    "Background: white | transparent | dark | gradient | any CSS color",
    "white"
  )
  .option(
    "-s, --scale <n>",
    "PNG device scale factor (higher = sharper, larger)",
    "2"
  )
  .option("--svg-only", "Output SVG only")
  .option("--png-only", "Output PNG only")
  .option("--no-font", "Do not load the bundled web font (Inter)")
  .action(async (file: string | undefined, rawOpts: CliOptions) => {
    const theme = rawOpts.theme as ThemeName;
    if (!VALID_THEMES.includes(theme)) {
      fail(
        `Unknown theme "${rawOpts.theme}". Valid themes: ${VALID_THEMES.join(", ")}`
      );
    }

    const scale = Number(rawOpts.scale);
    if (!Number.isFinite(scale) || scale <= 0) {
      fail(`Invalid --scale value: ${rawOpts.scale}`);
    }

    if (rawOpts.svgOnly && rawOpts.pngOnly) {
      fail("--svg-only and --png-only are mutually exclusive");
    }

    const code = await readInput(file);
    if (!code.trim()) {
      fail("No Mermaid input provided.");
    }

    const outBase = computeOutBase(rawOpts.output);
    const formats: Array<"svg" | "png"> = rawOpts.svgOnly
      ? ["svg"]
      : rawOpts.pngOnly
        ? ["png"]
        : ["svg", "png"];

    process.stderr.write(
      pc.dim(
        `  theme=${theme}  background=${rawOpts.background}  scale=${scale}\n`
      )
    );
    const started = Date.now();

    try {
      await renderMermaid({
        code,
        outBase,
        theme,
        background: rawOpts.background,
        scale,
        formats,
        embedFont: rawOpts.noFont !== true,
      });
    } catch (e) {
      fail((e as Error).message);
    }

    const elapsed = ((Date.now() - started) / 1000).toFixed(2);
    for (const f of formats) {
      process.stderr.write(
        pc.green("  ✓ ") + pc.bold(`${outBase}.${f}`) + "\n"
      );
    }
    process.stderr.write(pc.dim(`  done in ${elapsed}s\n`));
  });

async function readInput(file: string | undefined): Promise<string> {
  if (file) {
    if (!existsSync(file)) {
      fail(`File not found: ${file}`);
    }
    return readFileSync(file, "utf8");
  }

  if (!process.stdin.isTTY) {
    return await readAll(process.stdin);
  }

  process.stderr.write(
    pc.dim("  Paste Mermaid code, then press Ctrl-D to render:\n")
  );
  return await readAll(process.stdin);
}

function readAll(stream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolvePromise, rejectPromise) => {
    let data = "";
    stream.setEncoding("utf8");
    stream.on("data", (chunk: string) => {
      data += chunk;
    });
    stream.on("end", () => resolvePromise(data));
    stream.on("error", rejectPromise);
  });
}

function computeOutBase(output?: string): string {
  if (!output) {
    const ts = new Date()
      .toISOString()
      .replace(/\.\d{3}Z$/, "Z")
      .replace(/[:]/g, "-");
    return resolve(process.cwd(), `diagram-${ts}`);
  }
  const ext = extname(output).toLowerCase();
  if (ext === ".svg" || ext === ".png") {
    return resolve(output.slice(0, -ext.length));
  }
  return resolve(output);
}

function fail(message: string): never {
  process.stderr.write(pc.red("  ✗ ") + message + "\n");
  process.exit(1);
}

// --- lint subcommand ---------------------------------------------------------

interface LintCliOptions {
  fix?: boolean;
}

program
  .command("lint")
  .alias("check")
  .description(
    "Check Mermaid sources for common issues (literal \\n, unquoted specials, unbalanced brackets, low-contrast styles)"
  )
  .argument(
    "[paths...]",
    "Files (.mmd/.md) or directories. Use - for stdin. Defaults to - when omitted."
  )
  .option("--fix", "Apply fixes in place (or to stdout when reading stdin)")
  .action(async (paths: string[], opts: LintCliOptions) => {
    const targets = paths.length === 0 ? ["-"] : paths;
    const files = expandLintTargets(targets);

    let totalIssues = 0;
    let unfixableIssues = 0;
    let filesWithIssues = 0;
    let filesFixed = 0;

    for (const file of files) {
      if (file === "-") {
        const src = await readAll(process.stdin);
        const result = lintMermaid(src, { fix: !!opts.fix });
        reportFileIssues("<stdin>", result.issues);
        if (opts.fix) {
          process.stdout.write(result.fixed);
        }
        totalIssues += result.issues.length;
        unfixableIssues += result.issues.filter((i) => !i.fixable).length;
        if (result.issues.length > 0) filesWithIssues++;
        continue;
      }

      if (!existsSync(file)) {
        process.stderr.write(pc.red("  ✗ ") + `File not found: ${file}\n`);
        process.exitCode = 1;
        continue;
      }

      const src = readFileSync(file, "utf8");
      const result = lintOne(file, src, !!opts.fix);

      if (result.issues.length > 0) {
        filesWithIssues++;
        totalIssues += result.issues.length;
        unfixableIssues += result.issues.filter((i) => !i.fixable).length;
        reportFileIssues(file, result.issues);
      }
      if (opts.fix && result.fixed !== src) {
        writeFileSync(file, result.fixed, "utf8");
        filesFixed++;
        process.stderr.write(
          pc.green("  ✓ ") + pc.bold(file) + pc.dim(" (fixed)\n")
        );
      }
    }

    writeLintSummary({
      totalIssues,
      unfixableIssues,
      filesWithIssues,
      filesFixed,
      fixMode: !!opts.fix,
    });

    const remaining = opts.fix ? unfixableIssues : totalIssues;
    if (remaining > 0) process.exit(1);
  });

function lintOne(file: string, src: string, fix: boolean): LintResult {
  const ext = extname(file).toLowerCase();
  if (ext === ".md" || ext === ".markdown") return lintMarkdown(src, { fix });
  return lintMermaid(src, { fix });
}

function expandLintTargets(targets: string[]): string[] {
  const out: string[] = [];
  for (const t of targets) {
    if (t === "-") {
      out.push("-");
      continue;
    }
    if (!existsSync(t)) {
      out.push(t); // エラーは lint ループで通知
      continue;
    }
    const st = statSync(t);
    if (st.isDirectory()) walkLintDir(t, out);
    else out.push(t);
  }
  return out;
}

function walkLintDir(dir: string, out: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walkLintDir(p, out);
    else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (ext === ".mmd" || ext === ".md" || ext === ".markdown") out.push(p);
    }
  }
}

function reportFileIssues(file: string, issues: LintIssue[]): void {
  if (issues.length === 0) return;
  process.stderr.write(pc.bold(file) + "\n");
  for (const iss of issues) {
    const tag =
      iss.severity === "error" ? pc.red("error") : pc.yellow("warn ");
    process.stderr.write(
      `  ${pc.dim(`${iss.line}:`.padEnd(5))} ${tag} ${pc.dim(`[${iss.rule}]`)} ${iss.message}\n`
    );
  }
}

function writeLintSummary(s: {
  totalIssues: number;
  unfixableIssues: number;
  filesWithIssues: number;
  filesFixed: number;
  fixMode: boolean;
}): void {
  if (s.totalIssues === 0) {
    process.stderr.write(pc.green("  ✓ ") + "No issues found\n");
    return;
  }
  if (s.fixMode) {
    const autoFixed = s.totalIssues - s.unfixableIssues;
    const parts = [
      `${autoFixed} fixed`,
      `${s.unfixableIssues} remaining`,
      `${s.filesFixed} file(s) written`,
    ];
    const mark = s.unfixableIssues === 0 ? pc.green("  ✓ ") : pc.yellow("  ! ");
    process.stderr.write(mark + parts.join(", ") + "\n");
    return;
  }
  process.stderr.write(
    pc.yellow("  ! ") +
      `${s.totalIssues} issue(s) in ${s.filesWithIssues} file(s)\n`
  );
}

program.parseAsync().catch((e: Error) => {
  fail(e.message);
});
