# Catalog

`mermaid-pretty` の `pretty` テーマで描画した全 12 種類のダイアグラムを、
Mermaid の `default` テーマと並べた before/after カタログ。

- Before = `mmp file.mmd -t default`（素の Mermaid）
- After  = `mmp file.mmd`（`pretty` テーマ、既定）

---

## Flowchart

| Before (default) | After (pretty) |
|---|---|
| ![](images/before/flowchart.png) | ![](images/after/flowchart.png) |

<details><summary>Source — <a href="../../examples/flowchart.mmd"><code>examples/flowchart.mmd</code></a></summary>

```mermaid
flowchart LR
    A[User] -->|Request| B(API Gateway)
    B --> C{Auth?}
    C -->|Yes| D[Service]
    C -->|No| E[401]
    D --> F[(Database)]
    D --> G[Cache]

    subgraph Backend
        D
        F
        G
    end
```

</details>

---

## Sequence

| Before (default) | After (pretty) |
|---|---|
| ![](images/before/sequence.png) | ![](images/after/sequence.png) |

<details><summary>Source — <a href="../../examples/sequence.mmd"><code>examples/sequence.mmd</code></a></summary>

```mermaid
sequenceDiagram
    participant U as User
    participant A as API
    participant DB as Database
    U->>A: POST /login
    A->>DB: SELECT user
    DB-->>A: user record
    A-->>U: JWT token
    Note over U,A: Session established
```

</details>

---

## Class

| Before (default) | After (pretty) |
|---|---|
| ![](images/before/class.png) | ![](images/after/class.png) |

<details><summary>Source — <a href="../../examples/class.mmd"><code>examples/class.mmd</code></a></summary>

```mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound() void
    }
    class Dog {
        +String breed
        +fetch() void
    }
    class Cat {
        +bool indoor
        +purr() void
    }
    Animal <|-- Dog
    Animal <|-- Cat
    Dog ..> Leash : uses
    class Leash {
        +length
    }
```

</details>

---

## State

| Before (default) | After (pretty) |
|---|---|
| ![](images/before/state.png) | ![](images/after/state.png) |

<details><summary>Source — <a href="../../examples/state.mmd"><code>examples/state.mmd</code></a></summary>

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: fetch()
    Loading --> Success: 200 OK
    Loading --> Error: 4xx / 5xx
    Success --> Idle: reset
    Error --> Loading: retry
    Error --> [*]: abort
```

</details>

---

## ER

| Before (default) | After (pretty) |
|---|---|
| ![](images/before/er.png) | ![](images/after/er.png) |

<details><summary>Source — <a href="../../examples/er.mmd"><code>examples/er.mmd</code></a></summary>

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "ordered in"
    CUSTOMER {
        string id PK
        string email
        string name
    }
    ORDER {
        string id PK
        string customer_id FK
        datetime created_at
    }
    LINE_ITEM {
        string order_id FK
        string product_id FK
        int quantity
    }
    PRODUCT {
        string id PK
        string name
        decimal price
    }
```

</details>

---

## Gantt

| Before (default) | After (pretty) |
|---|---|
| ![](images/before/gantt.png) | ![](images/after/gantt.png) |

<details><summary>Source — <a href="../../examples/gantt.mmd"><code>examples/gantt.mmd</code></a></summary>

```mermaid
gantt
    title Product Roadmap Q2
    dateFormat  YYYY-MM-DD
    section Design
    Research           :done,    des1, 2026-04-01, 2026-04-07
    Wireframes         :done,    des2, 2026-04-08, 5d
    Visual design      :active,  des3, 2026-04-15, 7d
    section Build
    API                :         b1,   2026-04-20, 14d
    Frontend           :         b2,   after b1, 14d
    section Launch
    QA                 :         l1,   after b2, 5d
    Release            :crit,    l2,   after l1, 2d
```

</details>

---

## Pie

| Before (default) | After (pretty) |
|---|---|
| ![](images/before/pie.png) | ![](images/after/pie.png) |

<details><summary>Source — <a href="../../examples/pie.mmd"><code>examples/pie.mmd</code></a></summary>

```mermaid
pie showData
    title Traffic sources
    "Organic" : 42.5
    "Direct"  : 23.1
    "Social"  : 18.4
    "Referral" : 9.8
    "Email"   : 6.2
```

</details>

---

## Mindmap

| Before (default) | After (pretty) |
|---|---|
| ![](images/before/mindmap.png) | ![](images/after/mindmap.png) |

<details><summary>Source — <a href="../../examples/mindmap.mmd"><code>examples/mindmap.mmd</code></a></summary>

```mermaid
mindmap
  root((mermaid-pretty))
    Input
      File
      Stdin
      Pipe
    Output
      SVG
      PNG
      Custom -o
    Themes
      Pretty
      Dark
      Default
      Forest
    Styling
      Soft shadows
      Rounded corners
      Inter font
      Pastel colors
```

</details>

---

## Timeline

| Before (default) | After (pretty) |
|---|---|
| ![](images/before/timeline.png) | ![](images/after/timeline.png) |

<details><summary>Source — <a href="../../examples/timeline.mmd"><code>examples/timeline.mmd</code></a></summary>

```mermaid
timeline
    title History of Social Media
    2002 : LinkedIn
    2004 : Facebook
         : Flickr
    2005 : YouTube
    2006 : Twitter
    2010 : Instagram
    2011 : Snapchat
    2016 : TikTok
```

</details>

---

## Journey

| Before (default) | After (pretty) |
|---|---|
| ![](images/before/journey.png) | ![](images/after/journey.png) |

<details><summary>Source — <a href="../../examples/journey.mmd"><code>examples/journey.mmd</code></a></summary>

```mermaid
journey
    title My working day
    section Go to work
      Wake up: 3: Me
      Coffee: 5: Me
      Commute: 2: Me
    section Work
      Standup: 4: Me, Team
      Code review: 3: Me
      Deep work: 5: Me
    section Go home
      Dinner: 5: Me, Family
      Relax: 5: Me
```

</details>

---

## GitGraph

| Before (default) | After (pretty) |
|---|---|
| ![](images/before/gitgraph.png) | ![](images/after/gitgraph.png) |

<details><summary>Source — <a href="../../examples/gitgraph.mmd"><code>examples/gitgraph.mmd</code></a></summary>

```mermaid
gitGraph
    commit id: "init"
    commit id: "readme"
    branch feature
    checkout feature
    commit id: "wip"
    commit id: "polish"
    checkout main
    merge feature tag: "v0.1"
    commit id: "hotfix"
```

</details>

---

## Quadrant

| Before (default) | After (pretty) |
|---|---|
| ![](images/before/quadrant.png) | ![](images/after/quadrant.png) |

<details><summary>Source — <a href="../../examples/quadrant.mmd"><code>examples/quadrant.mmd</code></a></summary>

```mermaid
quadrantChart
    title Reach vs Engagement
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 Expand
    quadrant-2 Double down
    quadrant-3 Re-evaluate
    quadrant-4 Improve reach
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.4, 0.34]
    Campaign F: [0.35, 0.78]
```

</details>

---

## Regenerate

```bash
for f in flowchart sequence class state er gantt pie mindmap timeline journey gitgraph quadrant; do
  mmp "examples/${f}.mmd" -t default -o "docs/catalog/images/before/${f}"
  mmp "examples/${f}.mmd"            -o "docs/catalog/images/after/${f}"
done
```
