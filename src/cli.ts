#!/usr/bin/env node
import { Command } from "commander";
import { existsSync, readFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import pc from "picocolors";
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

program.parseAsync().catch((e: Error) => {
  fail(e.message);
});
