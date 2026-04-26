export interface TemplateOptions {
  mermaidScript: string;
  code: string;
  themeConfig: unknown;
  injectedCss: string;
  background: string;
  embedFont: boolean;
}

export function renderHtml(opts: TemplateOptions): string {
  const fontLink = opts.embedFont
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
       <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`
    : "";

  const safeMermaid = opts.mermaidScript.replace(/<\/script/gi, "<\\/script");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
${fontLink}
<style>
  html, body {
    margin: 0;
    padding: 0;
    background: ${opts.background};
  }
  body {
    font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .mp-root {
    padding: 40px;
    display: inline-block;
    box-sizing: border-box;
  }
  ${opts.injectedCss}
</style>
</head>
<body>
<div class="mp-root"><div id="container"></div></div>
<script>${safeMermaid}</script>
<script>
  (async () => {
    try {
      const config = ${JSON.stringify(opts.themeConfig)};
      const code = ${JSON.stringify(opts.code)};
      if (!window.mermaid) {
        throw new Error("Mermaid library failed to load");
      }
      // レンダリング前にフォント読み込みを待ち、ノードサイズ計算のズレを防ぐ
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.load('600 14px "Inter"');
          await document.fonts.load('400 14px "Inter"');
        } catch (_) {
          // フォント取得に失敗してもフォールバックで続行
        }
        await document.fonts.ready;
      }
      window.mermaid.initialize(config);
      const { svg } = await window.mermaid.render("graph-pretty", code);
      document.getElementById("container").innerHTML = svg;
      // mermaid が生成した SVG 内 <style> より後に配置して source-order で勝つ
      const svgEl = document.querySelector("#container svg");
      if (svgEl) {
        const overrideStyle = document.createElementNS("http://www.w3.org/2000/svg", "style");
        overrideStyle.textContent = ${JSON.stringify(opts.injectedCss)};
        svgEl.appendChild(overrideStyle);
        // ===== ピル型ラベルの可視幅を一律に拡張する汎用ポストプロセッサ =====
        // SVG <rect> は CSS padding が効かないため、rect の x/y/width/height を
        // 直接膨らませてテキストに対する余白を確保する。
        // text-anchor:middle で中心配置されている前提で対称に拡張する。
        const expandRect = (rect, padX, padY) => {
          const x = parseFloat(rect.getAttribute("x") || "0");
          const y = parseFloat(rect.getAttribute("y") || "0");
          const w = parseFloat(rect.getAttribute("width") || "0");
          const h = parseFloat(rect.getAttribute("height") || "0");
          if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0) return;
          rect.setAttribute("x", String(x - padX));
          rect.setAttribute("y", String(y - padY));
          rect.setAttribute("width", String(w + padX * 2));
          rect.setAttribute("height", String(h + padY * 2));
        };
        // (selector, padX, padY)
        const padRules = [
          ["rect.branchLabelBkg", 12, 5],
          ["rect.commit-label-bkg", 8, 3],
          ["rect.tag-label-bkg", 10, 4],
          ["rect.labelBox", 12, 5],
        ];
        padRules.forEach(([sel, px, py]) => {
          svgEl.querySelectorAll(sel).forEach((r) => expandRect(r, px, py));
        });
        // ラベル無しのエッジに対して Mermaid が生成する空 edgeLabel を非表示にする
        // (空 .labelBkg にも padding/背景が適用されて空ピルとして見えてしまうため)
        svgEl.querySelectorAll("g.edgeLabel").forEach((g) => {
          if (!g.textContent || !g.textContent.trim()) {
            g.style.display = "none";
          }
        });
        // width="100%" 指定（timeline など）だと inline-block 親で潰れるため
        // viewBox の実寸を SVG に焼き付けて正しい物理サイズで描画する
        const widthAttr = svgEl.getAttribute("width");
        const viewBox = svgEl.getAttribute("viewBox");
        if ((widthAttr === "100%" || !widthAttr) && viewBox) {
          const parts = viewBox.split(/\\s+/).map(Number);
          if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            svgEl.setAttribute("width", String(parts[2]));
            svgEl.setAttribute("height", String(parts[3]));
            svgEl.style.maxWidth = "none";
          }
        }
      }
      // 再描画後にもう一度フォントを確定させる
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      window.__renderReady = true;
    } catch (e) {
      window.__renderError = (e && e.message) ? e.message : String(e);
    }
  })();
</script>
</body>
</html>`;
}
