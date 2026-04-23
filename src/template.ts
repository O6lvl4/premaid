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
    padding: 48px;
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
