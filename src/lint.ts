export type RuleId =
  | "literal-newline"
  | "unquoted-special"
  | "unbalanced-brackets"
  | "low-contrast";

export interface LintIssue {
  line: number;
  rule: RuleId;
  message: string;
  severity: "error" | "warning";
  fixable: boolean;
}

export interface LintResult {
  issues: LintIssue[];
  fixed: string;
  changed: boolean;
}

// 長いトークンを先に並べることで `[[` が素の `[` に食われないようにする。
// parallelogram `[/.../]` / trapezoid `[/...\]` / asymmetric `>...]` も網羅。
interface ShapeDef {
  open: string;
  closes: string[]; // 最初に出現するものを採用
}
const OPENERS: ShapeDef[] = [
  { open: "[[", closes: ["]]"] },
  { open: "{{", closes: ["}}"] },
  { open: "((", closes: ["))"] },
  { open: "[(", closes: [")]"] },
  { open: "([", closes: ["])"] },
  { open: "[/", closes: ["/]", "\\]"] }, // parallelogram / trapezoid
  { open: "[\\", closes: ["\\]", "/]"] }, // parallelogram-alt / trapezoid-alt
  { open: "[", closes: ["]"] },
  { open: "{", closes: ["}"] },
  { open: "(", closes: [")"] },
  { open: ">", closes: ["]"] },
];

// unquoted label 本文に現れたら quote 必須となる特殊文字。
// `:` の後ろが空白だと `A: foo` 構文と衝突して parser が壊れる。
const NEEDS_QUOTE_RE = /[<>/()"\\]|:\s/;

const IDENT_RE = /[A-Za-z0-9_]/;
const DEFAULT_TEXT_COLOR = "#333333";

export function lintMermaid(
  code: string,
  options: { fix: boolean } = { fix: false }
): LintResult {
  const flowchartLike = isFlowchartLike(code);
  const issues: LintIssue[] = [];
  let current = code;

  if (flowchartLike) {
    const labelPass = processLabels(current, options.fix);
    issues.push(...labelPass.issues);
    current = labelPass.code;

    issues.push(...checkBrackets(current));
  }

  const stylePass = processStyleContrast(current, options.fix);
  issues.push(...stylePass.issues);
  current = stylePass.code;

  issues.sort((a, b) => a.line - b.line);

  return { issues, fixed: current, changed: current !== code };
}

function isFlowchartLike(src: string): boolean {
  for (const raw of src.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("%%")) continue;
    const head = line.split(/\s+/)[0].toLowerCase();
    return head === "flowchart" || head === "graph";
  }
  return false;
}

// --- Rule 1 & 2: label scanner -------------------------------------------------

interface LabelFix {
  start: number;
  end: number;
  replacement: string;
}

function processLabels(
  code: string,
  fix: boolean
): { issues: LintIssue[]; code: string } {
  const issues: LintIssue[] = [];
  const fixes: LabelFix[] = [];
  const lineStarts = computeLineStarts(code);

  let i = 0;
  while (i < code.length) {
    if (!IDENT_RE.test(code[i])) {
      i++;
      continue;
    }
    let idEnd = i;
    while (idEnd < code.length && IDENT_RE.test(code[idEnd])) idEnd++;

    const shape = matchOpener(code, idEnd);
    if (!shape) {
      i = idEnd;
      continue;
    }

    const bodyStart = idEnd + shape.open.length;
    const found = scanBodyEnd(code, bodyStart, shape.closes);
    if (!found) {
      // 閉じないラベルは scanner では修復できない。次の文字から探索再開
      i = idEnd;
      continue;
    }

    const body = code.substring(bodyStart, found.end);
    const line = lineOf(lineStarts, bodyStart);
    const { issues: bodyIssues, fixedBody } = processBody(body, line);
    issues.push(...bodyIssues);
    if (fix && fixedBody !== body) {
      fixes.push({ start: bodyStart, end: found.end, replacement: fixedBody });
    }

    i = found.end + found.close.length;
  }

  const nextCode = fix && fixes.length > 0 ? applyFixes(code, fixes) : code;
  return { issues, code: nextCode };
}

function matchOpener(src: string, pos: number): ShapeDef | null {
  for (const s of OPENERS) {
    if (src.startsWith(s.open, pos)) return s;
  }
  return null;
}

// body の終端を返す。`"..."` で始まる場合は quote-aware scan。
// closes に複数指定があるとき (parallelogram vs trapezoid) は最初に現れたものを採用。
function scanBodyEnd(
  src: string,
  start: number,
  closes: string[]
): { end: number; close: string } | null {
  if (src[start] === '"') {
    // mermaid は `\"` エスケープを解釈しないので、最初に出た `"` が本物
    let p = start + 1;
    while (p < src.length) {
      if (src[p] === '"') {
        for (const c of closes) {
          if (src.startsWith(c, p + 1)) return { end: p + 1, close: c };
        }
        // mixed content (quote の後に unquoted が続く) — closeTok まで読む
        break;
      }
      p++;
    }
  }
  let bestIdx = -1;
  let bestClose = "";
  for (const c of closes) {
    const idx = src.indexOf(c, start);
    if (idx !== -1 && (bestIdx === -1 || idx < bestIdx)) {
      bestIdx = idx;
      bestClose = c;
    }
  }
  return bestIdx === -1 ? null : { end: bestIdx, close: bestClose };
}

function processBody(
  body: string,
  line: number
): { issues: LintIssue[]; fixedBody: string } {
  const issues: LintIssue[] = [];

  // 綺麗に quote されている (先頭・末尾が `"` で中間に `"` を含まない) ケース
  const quoteCount = countChar(body, '"');
  const cleanlyQuoted =
    body.length >= 2 &&
    body[0] === '"' &&
    body[body.length - 1] === '"' &&
    quoteCount === 2;

  if (cleanlyQuoted) {
    const inner = body.slice(1, -1);
    if (inner.includes("\\n")) {
      issues.push({
        line,
        rule: "literal-newline",
        message: "Literal \\n in label renders as text; use <br/> instead",
        severity: "error",
        fixable: true,
      });
      return { issues, fixedBody: '"' + inner.replace(/\\n/g, "<br/>") + '"' };
    }
    return { issues, fixedBody: body };
  }

  // unquoted または mixed
  const hasLiteralNewline = body.includes("\\n");
  const needsQuote = NEEDS_QUOTE_RE.test(body);
  if (!hasLiteralNewline && !needsQuote) {
    return { issues, fixedBody: body };
  }

  if (hasLiteralNewline) {
    issues.push({
      line,
      rule: "literal-newline",
      message: "Literal \\n in label renders as text; use <br/> instead",
      severity: "error",
      fixable: true,
    });
  }
  if (needsQuote) {
    issues.push({
      line,
      rule: "unquoted-special",
      message:
        'Unquoted label contains special characters; wrap in "..." (internal " becomes &quot;)',
      severity: "error",
      fixable: true,
    });
  }

  let inner = body.replace(/"/g, "&quot;");
  if (hasLiteralNewline) inner = inner.replace(/\\n/g, "<br/>");
  return { issues, fixedBody: '"' + inner + '"' };
}

// --- Rule 3: bracket balance (flowchart/graph only) ----------------------------

function checkBrackets(code: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const lines = code.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith("%%")) continue;

    // `"..."` 内の括弧は数えない (edge label `|"..."|` / quoted node label 対策)
    const stripped = raw.replace(/"[^"]*"/g, "");
    const sq = countChar(stripped, "[") - countChar(stripped, "]");
    const cu = countChar(stripped, "{") - countChar(stripped, "}");
    if (sq !== 0) {
      issues.push({
        line: i + 1,
        rule: "unbalanced-brackets",
        message: `Unbalanced square brackets (delta ${sq >= 0 ? "+" : ""}${sq})`,
        severity: "warning",
        fixable: false,
      });
    }
    if (cu !== 0) {
      issues.push({
        line: i + 1,
        rule: "unbalanced-brackets",
        message: `Unbalanced curly braces (delta ${cu >= 0 ? "+" : ""}${cu})`,
        severity: "warning",
        fixable: false,
      });
    }
  }
  return issues;
}

// --- Rule 4: low contrast style directive --------------------------------------

const STYLE_RE = /^(\s*)style\s+(\S+)\s+(.+?)\s*$/;

function processStyleContrast(
  code: string,
  fix: boolean
): { issues: LintIssue[]; code: string } {
  const issues: LintIssue[] = [];
  const lines = code.split("\n");
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const m = STYLE_RE.exec(lines[i]);
    if (!m) continue;
    const [, indent, target, body] = m;

    const props = parseStyleProps(body);
    const fillStr = props.get("fill");
    if (!fillStr) continue;
    const fill = hexToRgb(fillStr);
    if (!fill) continue;

    const textStr = props.get("color") ?? DEFAULT_TEXT_COLOR;
    const text = hexToRgb(textStr);
    if (!text) continue;

    const cr = contrastRatio(fill, text);
    if (cr >= 4.5) continue;

    issues.push({
      line: i + 1,
      rule: "low-contrast",
      message: `Contrast ratio ${cr.toFixed(2)} < 4.5 for '${target}' (fill=${fillStr} text=${textStr})`,
      severity: "warning",
      fixable: true,
    });

    if (fix) {
      const chosen = bestTextColor(fill);
      // 既存 color: は上書き。mermaid default 採用ケースでは新規追加。
      const rebuilt = rebuildStyleProps(body, "color", chosen);
      lines[i] = `${indent}style ${target} ${rebuilt}`;
      changed = true;
    }
  }

  return { issues, code: changed ? lines.join("\n") : code };
}

function parseStyleProps(body: string): Map<string, string> {
  const m = new Map<string, string>();
  for (const part of body.split(",")) {
    const t = part.trim();
    if (!t) continue;
    const idx = t.indexOf(":");
    if (idx === -1) continue;
    m.set(t.slice(0, idx).trim().toLowerCase(), t.slice(idx + 1).trim());
  }
  return m;
}

function rebuildStyleProps(body: string, key: string, value: string): string {
  const parts = body
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const out: string[] = [];
  let replaced = false;
  for (const p of parts) {
    const idx = p.indexOf(":");
    if (idx === -1) {
      out.push(p);
      continue;
    }
    const k = p.slice(0, idx).trim().toLowerCase();
    if (k === key) {
      out.push(`${key}:${value}`);
      replaced = true;
    } else {
      out.push(p);
    }
  }
  if (!replaced) out.push(`${key}:${value}`);
  return out.join(",");
}

// --- WCAG helpers --------------------------------------------------------------

export function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export function relativeLuminance([r, g, b]: [number, number, number]): number {
  const ch = (c: number): number => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

export function contrastRatio(
  a: [number, number, number],
  b: [number, number, number]
): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [lo, hi] = la < lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export function bestTextColor(fill: [number, number, number]): string {
  const white: [number, number, number] = [255, 255, 255];
  const black: [number, number, number] = [0, 0, 0];
  return contrastRatio(fill, white) >= contrastRatio(fill, black)
    ? "#ffffff"
    : "#000000";
}

// --- Markdown fenced-block handling -------------------------------------------

const FENCE_OPEN_RE = /^(\s*)(`{3,})\s*mermaid\s*$/;

export function lintMarkdown(
  md: string,
  options: { fix: boolean } = { fix: false }
): LintResult {
  const lines = md.split("\n");
  const out: string[] = [];
  const issues: LintIssue[] = [];
  let changed = false;

  let i = 0;
  while (i < lines.length) {
    const openMatch = FENCE_OPEN_RE.exec(lines[i]);
    if (!openMatch) {
      out.push(lines[i]);
      i++;
      continue;
    }
    const fence = openMatch[2];
    const closeRe = new RegExp(`^\\s*${fence}\\s*$`);
    let j = i + 1;
    while (j < lines.length && !closeRe.test(lines[j])) j++;

    if (j >= lines.length) {
      // 閉じられていない fence は素通し
      for (; i < lines.length; i++) out.push(lines[i]);
      break;
    }

    const block = lines.slice(i + 1, j).join("\n");
    const blockStartLine = i + 2; // 1-based、中身の最初の行
    const res = lintMermaid(block, options);
    for (const iss of res.issues) {
      issues.push({ ...iss, line: iss.line + blockStartLine - 1 });
    }

    out.push(lines[i]);
    if (options.fix && res.changed) {
      out.push(...res.fixed.split("\n"));
      changed = true;
    } else {
      for (let k = i + 1; k < j; k++) out.push(lines[k]);
    }
    out.push(lines[j]);
    i = j + 1;
  }

  const fixed = changed ? out.join("\n") : md;
  return { issues, fixed, changed };
}

// --- utils ---------------------------------------------------------------------

function computeLineStarts(src: string): number[] {
  const starts = [0];
  for (let i = 0; i < src.length; i++) {
    if (src[i] === "\n") starts.push(i + 1);
  }
  return starts;
}

function lineOf(starts: number[], pos: number): number {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >>> 1;
    if (starts[mid] <= pos) lo = mid;
    else hi = mid - 1;
  }
  return lo + 1;
}

function countChar(s: string, c: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) if (s[i] === c) n++;
  return n;
}

function applyFixes(src: string, fixes: LabelFix[]): string {
  // 左から右に非重複に並んでいる前提 (scanner の走査順)
  let out = "";
  let cursor = 0;
  for (const f of fixes) {
    out += src.substring(cursor, f.start) + f.replacement;
    cursor = f.end;
  }
  out += src.substring(cursor);
  return out;
}
