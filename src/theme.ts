export type ThemeName = "pretty" | "dark" | "default" | "forest" | "neutral";

const FONT_STACK =
  '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const prettyTheme = {
  startOnLoad: false,
  theme: "base" as const,
  fontFamily: FONT_STACK,
  themeVariables: {
    fontFamily: FONT_STACK,
    fontSize: "14px",
    primaryColor: "#EEF2FF",
    primaryTextColor: "#1E293B",
    primaryBorderColor: "#C7D2FE",
    lineColor: "#94A3B8",
    secondaryColor: "#F1F5F9",
    tertiaryColor: "#F8FAFC",
    background: "#FFFFFF",
    mainBkg: "#FFFFFF",
    secondBkg: "#F8FAFC",
    nodeBorder: "#CBD5E1",
    clusterBkg: "#F8FAFC",
    clusterBorder: "#E2E8F0",
    titleColor: "#0F172A",
    edgeLabelBackground: "#FFFFFF",
    actorBkg: "#FFFFFF",
    actorBorder: "#CBD5E1",
    actorTextColor: "#1E293B",
    actorLineColor: "#94A3B8",
    signalColor: "#475569",
    signalTextColor: "#1E293B",
    labelBoxBkgColor: "#EEF2FF",
    labelBoxBorderColor: "#C7D2FE",
    labelTextColor: "#1E293B",
    loopTextColor: "#1E293B",
    noteBkgColor: "#FEF9C3",
    noteBorderColor: "#FCD34D",
    noteTextColor: "#713F12",
    activationBkgColor: "#E0E7FF",
    activationBorderColor: "#A5B4FC",
    gridColor: "#E2E8F0",
    doneTaskBkgColor: "#DCFCE7",
    doneTaskBorderColor: "#86EFAC",
    pie1: "#818CF8",
    pie2: "#A78BFA",
    pie3: "#F472B6",
    pie4: "#FBBF24",
    pie5: "#34D399",
    pie6: "#22D3EE",
    pie7: "#60A5FA",
    pie8: "#FB7185",
    pie9: "#A3E635",
    pie10: "#FB923C",
    pie11: "#2DD4BF",
    pie12: "#C084FC",
    pieOpacity: "0.9",
    pieStrokeColor: "#FFFFFF",
    pieStrokeWidth: "2px",
    pieOuterStrokeWidth: "0px",
    pieOuterStrokeColor: "transparent",
    pieTitleTextSize: "18px",
    pieTitleTextColor: "#0F172A",
    pieSectionTextSize: "13px",
    pieSectionTextColor: "#FFFFFF",
    pieLegendTextSize: "13px",
    pieLegendTextColor: "#334155",
    // mindmap / timeline / journey などで使われる cScale 系
    // 彩度を揃えた 400 系で統一し、ビビッドすぎないようにする
    cScale0: "#818CF8",
    cScale1: "#A78BFA",
    cScale2: "#F472B6",
    cScale3: "#FBBF24",
    cScale4: "#34D399",
    cScale5: "#22D3EE",
    cScale6: "#60A5FA",
    cScale7: "#A3E635",
    cScale8: "#FB923C",
    cScale9: "#2DD4BF",
    cScale10: "#C084FC",
    cScale11: "#FB7185",
    cScaleLabel0: "#FFFFFF",
    cScaleLabel1: "#FFFFFF",
    cScaleLabel2: "#FFFFFF",
    cScaleLabel3: "#FFFFFF",
    cScaleLabel4: "#FFFFFF",
    cScaleLabel5: "#FFFFFF",
    cScaleLabel6: "#FFFFFF",
    cScaleLabel7: "#FFFFFF",
    cScaleLabel8: "#FFFFFF",
    cScaleLabel9: "#FFFFFF",
    cScaleLabel10: "#FFFFFF",
    cScaleLabel11: "#FFFFFF",
    cScalePeer0: "#EEF2FF",
    cScalePeer1: "#F5F3FF",
    cScalePeer2: "#FDF2F8",
    cScalePeer3: "#FFFBEB",
    cScalePeer4: "#ECFDF5",
    cScalePeer5: "#ECFEFF",
    cScalePeer6: "#EFF6FF",
    cScalePeer7: "#F7FEE7",
    cScalePeer8: "#FFF7ED",
    cScalePeer9: "#F0FDFA",
    cScalePeer10: "#FAF5FF",
    cScalePeer11: "#FEF2F2",
  },
  flowchart: { curve: "basis", padding: 16, htmlLabels: true, useMaxWidth: false },
  sequence: { actorMargin: 60, boxMargin: 12, noteMargin: 12, useMaxWidth: false },
  gantt: { barHeight: 22, barGap: 6 },
  mindmap: { padding: 14, maxNodeWidth: 200 },
  timeline: { padding: 14, disableMulticolor: false },
  journey: { useMaxWidth: false },
};

export const darkTheme = {
  startOnLoad: false,
  theme: "base" as const,
  fontFamily: FONT_STACK,
  themeVariables: {
    fontFamily: FONT_STACK,
    fontSize: "14px",
    darkMode: true,
    primaryColor: "#1E293B",
    primaryTextColor: "#E2E8F0",
    primaryBorderColor: "#475569",
    lineColor: "#94A3B8",
    secondaryColor: "#0F172A",
    tertiaryColor: "#1E293B",
    background: "#0F172A",
    mainBkg: "#1E293B",
    secondBkg: "#0F172A",
    nodeBorder: "#475569",
    clusterBkg: "#111827",
    clusterBorder: "#334155",
    titleColor: "#F1F5F9",
    edgeLabelBackground: "#0F172A",
    actorBkg: "#1E293B",
    actorBorder: "#475569",
    actorTextColor: "#E2E8F0",
    actorLineColor: "#94A3B8",
    signalColor: "#CBD5E1",
    signalTextColor: "#E2E8F0",
    labelBoxBkgColor: "#312E81",
    labelBoxBorderColor: "#6366F1",
    labelTextColor: "#E0E7FF",
    loopTextColor: "#E2E8F0",
    noteBkgColor: "#422006",
    noteBorderColor: "#F59E0B",
    noteTextColor: "#FDE68A",
    activationBkgColor: "#312E81",
    activationBorderColor: "#6366F1",
    gridColor: "#334155",
    pie1: "#818CF8",
    pie2: "#A78BFA",
    pie3: "#F472B6",
    pie4: "#FBBF24",
    pie5: "#34D399",
    pie6: "#22D3EE",
    pie7: "#60A5FA",
    pie8: "#F87171",
    pie9: "#A3E635",
    pie10: "#FB923C",
    pie11: "#2DD4BF",
    pie12: "#C084FC",
  },
  flowchart: { curve: "basis", padding: 16, htmlLabels: true, useMaxWidth: false },
  sequence: { actorMargin: 60, boxMargin: 12, noteMargin: 12, useMaxWidth: false },
};

export const prettyCss = `
  .mp-root svg { overflow: visible; }

  /* ノード: 柔らかい影 + 繊細な枠線 */
  .node rect,
  .node polygon,
  .node circle,
  .node ellipse,
  .node path {
    filter:
      drop-shadow(0 1px 2px rgba(15, 23, 42, 0.05))
      drop-shadow(0 6px 14px rgba(15, 23, 42, 0.06));
    stroke-width: 1.2px !important;
  }

  /* 四角ノードは角丸 */
  .node rect { rx: 10; ry: 10; }

  /* エッジ: 細めで上品に */
  .edgePath path.path,
  .flowchart-link {
    stroke-width: 1.5px !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
  }

  /* 矢印ヘッド */
  .arrowheadPath,
  marker path {
    stroke-width: 0 !important;
  }

  /* エッジラベル: 白ピル風 */
  .edgeLabel,
  .edgeLabel div,
  .edgeLabel span {
    background-color: rgba(255, 255, 255, 0.96) !important;
    color: #334155 !important;
    font-size: 12px !important;
  }
  .edgeLabel {
    padding: 2px 8px !important;
    border-radius: 999px !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
  }

  /* クラスタ（サブグラフ） */
  .cluster rect {
    rx: 14 !important;
    ry: 14 !important;
    filter: drop-shadow(0 1px 2px rgba(15, 23, 42, 0.04));
    stroke-dasharray: 0 !important;
    stroke-width: 1px !important;
  }
  .cluster-label .nodeLabel,
  .cluster text {
    font-weight: 600 !important;
    fill: #0F172A !important;
    color: #0F172A !important;
  }

  /* ラベル類のフォント統一 */
  .nodeLabel,
  .edgeLabel,
  .cluster text,
  .actor,
  text.actor > tspan,
  .messageText,
  .loopText,
  .noteText,
  .labelText,
  .sectionTitle,
  .titleText,
  .taskText,
  .grid text {
    font-family: "Inter", system-ui, sans-serif !important;
  }

  /* シーケンス図: アクター */
  .actor {
    filter: drop-shadow(0 2px 6px rgba(15, 23, 42, 0.08));
    stroke-width: 1.2px !important;
  }
  .actor-line { stroke-width: 1px !important; stroke-dasharray: 2 4 !important; }

  /* ノートに軽い陰影 */
  .note, g.note rect {
    filter: drop-shadow(0 2px 6px rgba(234, 179, 8, 0.12));
    rx: 8 !important;
    ry: 8 !important;
  }

  /* ===== pie (洗練された Chart.js 風) ===== */
  g[id^="pie"] .pieCircle,
  .pieCircle {
    stroke: #FFFFFF !important;
    stroke-width: 4px !important;
    stroke-linejoin: round !important;
    filter:
      drop-shadow(0 1px 2px rgba(15, 23, 42, 0.04))
      drop-shadow(0 14px 32px rgba(15, 23, 42, 0.10));
  }
  .pieOuterCircle {
    stroke: transparent !important;
    fill: transparent !important;
  }
  .pieTitleText {
    font-weight: 700 !important;
    font-size: 20px !important;
    fill: #0F172A !important;
    letter-spacing: -0.2px !important;
  }
  text.slice {
    font-weight: 700 !important;
    font-size: 14px !important;
    fill: #FFFFFF !important;
    paint-order: stroke;
    stroke: rgba(15, 23, 42, 0.35);
    stroke-width: 0.5px;
    letter-spacing: -0.2px !important;
  }
  /* 凡例を丸いドット風に */
  .legend rect {
    rx: 10 !important;
    ry: 10 !important;
    stroke: transparent !important;
    width: 10 !important;
    height: 10 !important;
    filter: drop-shadow(0 1px 1px rgba(15, 23, 42, 0.12));
  }
  .legend text, text.legend {
    font-size: 13px !important;
    fill: #1E293B !important;
    font-weight: 500 !important;
    letter-spacing: 0.1px !important;
  }

  /* ===== mindmap ===== */
  .mindmap-node > rect,
  .mindmap-node > circle,
  .mindmap-node > ellipse,
  .mindmap-node > polygon,
  .mindmap-node > path {
    stroke-width: 0 !important;
    filter:
      drop-shadow(0 1px 2px rgba(15, 23, 42, 0.06))
      drop-shadow(0 8px 20px rgba(15, 23, 42, 0.08));
  }
  .mindmap-node [class^="node-line"] {
    stroke-width: 2px !important;
    stroke-linecap: round !important;
    opacity: 0.35 !important;
  }
  /* エッジ（ブランチの線）を色とトーンで統一 */
  g.edge path,
  .edge path,
  .section-edge-0, .section-edge-1, .section-edge-2, .section-edge-3,
  .section-edge-4, .section-edge-5, .section-edge-6, .section-edge-7 {
    stroke-width: 1.4px !important;
    stroke-linecap: round !important;
    opacity: 0.7 !important;
  }
  /* ルートノードを際立たせる */
  g.mindmap-node.section-root circle,
  g.mindmap-node.section-root rect,
  g.mindmap-node.section-root ellipse,
  g.mindmap-node.section--1 circle,
  g.mindmap-node.section--1 rect {
    fill: #6366F1 !important;
    filter: drop-shadow(0 6px 18px rgba(99, 102, 241, 0.35));
  }
  g.mindmap-node text,
  g.mindmap-node .nodeLabel,
  g.mindmap-node .nodeLabel span {
    font-weight: 500 !important;
    color: #FFFFFF !important;
    fill: #FFFFFF !important;
  }

  /* ===== timeline ===== */
  .timeline-node rect,
  g.timeline-node > rect,
  g.timeline-node foreignObject {
    filter: drop-shadow(0 3px 10px rgba(15, 23, 42, 0.10));
  }
  .timeline-node .node-bkg,
  g.timeline-node rect {
    rx: 12 !important;
    ry: 12 !important;
    stroke-width: 0 !important;
  }
  .timeline-node text,
  .timeline-node .nodeLabel,
  .timeline-node .nodeLabel span,
  g.timeline-node text,
  g.timeline-node .nodeLabel,
  g.timeline-node .nodeLabel span,
  g.timeline-node foreignObject div,
  g.timeline-node foreignObject span {
    font-weight: 600 !important;
    color: #FFFFFF !important;
    fill: #FFFFFF !important;
    font-size: 14px !important;
    letter-spacing: 0.2px !important;
  }
  /* タイムラインの縦接続線: 視認できる濃さにする */
  .lineWrapper line,
  [class^="node-line"] {
    stroke: #64748B !important;
    stroke-width: 1.3px !important;
    stroke-dasharray: 3 3 !important;
    stroke-linecap: round !important;
    opacity: 0.85 !important;
  }
  .sectionTitle {
    font-weight: 700 !important;
    font-size: 15px !important;
    fill: #0F172A !important;
  }
  .titleText {
    font-weight: 700 !important;
    font-size: 20px !important;
    fill: #0F172A !important;
  }
  /* タイムライン軸線 */
  line.timeline-path,
  #arrowhead path {
    stroke: #94A3B8 !important;
    fill: #94A3B8 !important;
    stroke-width: 1.5px !important;
  }

  /* ===== journey (モダンなフラット + 立体感) ===== */
  .task-line,
  .actor-line {
    opacity: 0.85 !important;
    stroke: #64748B !important;
    stroke-dasharray: 3 3 !important;
    stroke-width: 1.2px !important;
    stroke-linecap: round !important;
  }
  .task rect,
  g.task > rect {
    rx: 14 !important;
    ry: 14 !important;
    filter:
      drop-shadow(0 1px 2px rgba(15, 23, 42, 0.04))
      drop-shadow(0 10px 24px rgba(15, 23, 42, 0.08));
    stroke-width: 0 !important;
  }
  .task-type-0 text,
  .task text {
    font-weight: 600 !important;
    font-size: 14px !important;
    fill: #0F172A !important;
    letter-spacing: -0.1px !important;
  }
  /* 顔バッジ: ビビッドな amber-400 ソリッド + 深めの影で立体感 */
  circle.face,
  .face {
    fill: #FBBF24 !important;
    stroke: none !important;
    r: 18 !important;
    filter:
      drop-shadow(0 2px 4px rgba(217, 119, 6, 0.25))
      drop-shadow(0 8px 16px rgba(217, 119, 6, 0.20));
  }
  .mouth {
    stroke: #78350F !important;
    stroke-width: 2.2px !important;
    stroke-linecap: round !important;
    fill: transparent !important;
  }
  .eyes {
    fill: #78350F !important;
    stroke: none !important;
  }
  /* アクター（凡例）ドット: 統一パレットで上品に */
  circle.actor-0 { fill: #818CF8 !important; }
  circle.actor-1 { fill: #34D399 !important; }
  circle.actor-2 { fill: #F472B6 !important; }
  circle.actor-3 { fill: #FBBF24 !important; }
  circle.actor-4 { fill: #60A5FA !important; }
  circle.actor-5 { fill: #A78BFA !important; }
  circle.actor-0, circle.actor-1, circle.actor-2,
  circle.actor-3, circle.actor-4, circle.actor-5 {
    stroke: #FFFFFF !important;
    stroke-width: 2px !important;
    filter: drop-shadow(0 2px 4px rgba(15, 23, 42, 0.14));
  }
  .legend text {
    font-weight: 500 !important;
    font-size: 13px !important;
    fill: #1E293B !important;
    letter-spacing: 0.1px !important;
  }
  /* セクションバーはやや濃く、タスクは淡く。立体感を出す */
  .section-type-0 { fill: #C7D2FE !important; }
  .section-type-1 { fill: #DDD6FE !important; }
  .section-type-2 { fill: #FBCFE8 !important; }
  .section-type-3 { fill: #FDE68A !important; }
  .section-type-4 { fill: #A7F3D0 !important; }
  .section-type-5 { fill: #A5F3FC !important; }
  .task-type-0 { fill: #EEF2FF !important; }
  .task-type-1 { fill: #F5F3FF !important; }
  .task-type-2 { fill: #FDF2F8 !important; }
  .task-type-3 { fill: #FFFBEB !important; }
  .task-type-4 { fill: #ECFDF5 !important; }
  .task-type-5 { fill: #ECFEFF !important; }
  g[class*="section-type"] > rect,
  .section-type-0, .section-type-1, .section-type-2,
  .section-type-3, .section-type-4, .section-type-5 {
    stroke-width: 0 !important;
  }
  .journey-section text {
    font-weight: 700 !important;
    font-size: 15px !important;
    fill: #0F172A !important;
    letter-spacing: -0.1px !important;
  }

  /* ===== gantt (小ぶり + 読みやすさ) ===== */
  .grid .tick line {
    stroke: #E2E8F0 !important;
    stroke-dasharray: 2 3 !important;
  }
  .task0, .task1, .task2, .task3 { stroke-width: 0 !important; }
  .taskText, .taskTextOutsideRight, .taskTextOutsideLeft {
    font-size: 12px !important;
    font-weight: 500 !important;
    fill: #0F172A !important;
  }
  .section0, .section1, .section2, .section3 {
    font-weight: 600 !important;
    fill: #0F172A !important;
  }

  /* ===== gitgraph ===== */
  .branch-label rect, .commit-label rect {
    rx: 6 !important;
    ry: 6 !important;
  }
`;

export const darkCss = `
  .mp-root svg { overflow: visible; }

  .node rect,
  .node polygon,
  .node circle,
  .node ellipse,
  .node path {
    filter:
      drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))
      drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45));
    stroke-width: 1.2px !important;
  }
  .node rect { rx: 10; ry: 10; }

  .edgePath path.path,
  .flowchart-link {
    stroke-width: 1.5px !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
  }

  .edgeLabel,
  .edgeLabel div,
  .edgeLabel span {
    background-color: rgba(15, 23, 42, 0.96) !important;
    color: #CBD5E1 !important;
    font-size: 12px !important;
  }
  .edgeLabel {
    padding: 2px 8px !important;
    border-radius: 999px !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  }

  .cluster rect {
    rx: 14 !important;
    ry: 14 !important;
    stroke-width: 1px !important;
  }
  .cluster-label .nodeLabel,
  .cluster text {
    font-weight: 600 !important;
    fill: #F1F5F9 !important;
    color: #F1F5F9 !important;
  }

  .nodeLabel,
  .edgeLabel,
  .cluster text,
  .actor,
  text.actor > tspan,
  .messageText,
  .loopText,
  .noteText,
  .labelText,
  .sectionTitle,
  .titleText,
  .taskText,
  .grid text {
    font-family: "Inter", system-ui, sans-serif !important;
  }

  .actor {
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5));
    stroke-width: 1.2px !important;
  }
  .actor-line { stroke-width: 1px !important; stroke-dasharray: 2 4 !important; }
`;
