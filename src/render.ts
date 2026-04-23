import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { renderHtml } from "./template.js";
import {
  darkCss,
  darkTheme,
  prettyCss,
  prettyTheme,
  type ThemeName,
} from "./theme.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function resolveMermaidPath(): string {
  const candidates = [
    resolve(__dirname, "../node_modules/mermaid/dist/mermaid.min.js"),
    resolve(__dirname, "../../node_modules/mermaid/dist/mermaid.min.js"),
    resolve(__dirname, "../../../node_modules/mermaid/dist/mermaid.min.js"),
  ];
  for (const c of candidates) {
    try {
      readFileSync(c);
      return c;
    } catch {
      // next
    }
  }
  throw new Error(
    "mermaid.min.js not found. Please run `npm install` in the premaid package."
  );
}

export type BackgroundPreset = "white" | "transparent" | "dark" | "gradient";

export interface RenderOptions {
  code: string;
  outBase: string;
  theme: ThemeName;
  background: string;
  scale: number;
  formats: Array<"svg" | "png">;
  embedFont: boolean;
}

function resolveBackground(bg: string, theme: ThemeName): string {
  switch (bg) {
    case "white":
      return "#FFFFFF";
    case "transparent":
      return "transparent";
    case "dark":
      return "#0F172A";
    case "gradient":
      return theme === "dark"
        ? "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)"
        : "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)";
    default:
      return bg;
  }
}

function resolveTheme(theme: ThemeName): {
  config: unknown;
  css: string;
} {
  if (theme === "dark") return { config: darkTheme, css: darkCss };
  if (theme === "pretty") return { config: prettyTheme, css: prettyCss };
  return {
    config: {
      startOnLoad: false,
      theme,
      fontFamily:
        '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    },
    css: prettyCss,
  };
}

export async function renderMermaid(opts: RenderOptions): Promise<void> {
  const mermaidPath = resolveMermaidPath();
  const mermaidScript = readFileSync(mermaidPath, "utf8");
  const { config, css } = resolveTheme(opts.theme);
  const background = resolveBackground(opts.background, opts.theme);

  const html = renderHtml({
    mermaidScript,
    code: opts.code,
    themeConfig: config,
    injectedCss: css,
    background,
    embedFont: opts.embedFont,
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--allow-file-access-from-files",
      "--disable-web-security",
      "--no-sandbox",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 1400,
      height: 900,
      deviceScaleFactor: opts.scale,
    });

    // file:// の import を許可するため data URL ではなく setContent を使う
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    // mermaid が非同期で SVG を描画するまで待つ
    await page.waitForFunction(
      () =>
        (window as unknown as { __renderReady?: boolean; __renderError?: string })
          .__renderReady === true ||
        typeof (window as unknown as { __renderError?: string }).__renderError ===
          "string",
      { timeout: 30_000 }
    );

    const err = await page.evaluate(
      () => (window as unknown as { __renderError?: string }).__renderError
    );
    if (err) {
      throw new Error(`Mermaid render failed: ${err}`);
    }

    if (opts.formats.includes("svg")) {
      const svg = await page.evaluate(() => {
        const el = document.querySelector("#container svg");
        if (!el) return null;
        // 再利用しやすいよう xmlns を確実に付与
        if (!el.getAttribute("xmlns")) {
          el.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        }
        return el.outerHTML;
      });
      if (!svg) {
        throw new Error("SVG element not found after render");
      }
      writeFileSync(`${opts.outBase}.svg`, svg, "utf8");
    }

    if (opts.formats.includes("png")) {
      const handle = await page.$(".mp-root");
      if (!handle) {
        throw new Error("Render root element not found");
      }
      await handle.screenshot({
        path: `${opts.outBase}.png`,
        omitBackground: background === "transparent",
        type: "png",
      });
    }
  } finally {
    await browser.close();
  }
}
