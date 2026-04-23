# Catalog

`mermaid-pretty` の `pretty` テーマで描画した全 12 種類のダイアグラムのギャラリー。
各図は [`examples/`](../../examples) 配下の `.mmd` ソースから `mmp <file>.mmd` で生成したもの。

## Gallery

| | | |
|---|---|---|
| **[Flowchart](#flowchart)**<br>![](images/flowchart.png) | **[Sequence](#sequence)**<br>![](images/sequence.png) | **[Class](#class)**<br>![](images/class.png) |
| **[State](#state)**<br>![](images/state.png) | **[ER](#er)**<br>![](images/er.png) | **[Gantt](#gantt)**<br>![](images/gantt.png) |
| **[Pie](#pie)**<br>![](images/pie.png) | **[Mindmap](#mindmap)**<br>![](images/mindmap.png) | **[Timeline](#timeline)**<br>![](images/timeline.png) |
| **[Journey](#journey)**<br>![](images/journey.png) | **[GitGraph](#gitgraph)**<br>![](images/gitgraph.png) | **[Quadrant](#quadrant)**<br>![](images/quadrant.png) |

## Sources

各図の見出しから元の `.mmd` ソースと SVG に飛べます。

### Flowchart

[`examples/flowchart.mmd`](../../examples/flowchart.mmd) · [SVG](images/flowchart.svg)

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

### Sequence

[`examples/sequence.mmd`](../../examples/sequence.mmd) · [SVG](images/sequence.svg)

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

### Class

[`examples/class.mmd`](../../examples/class.mmd) · [SVG](images/class.svg)

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

### State

[`examples/state.mmd`](../../examples/state.mmd) · [SVG](images/state.svg)

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

### ER

[`examples/er.mmd`](../../examples/er.mmd) · [SVG](images/er.svg)

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

### Gantt

[`examples/gantt.mmd`](../../examples/gantt.mmd) · [SVG](images/gantt.svg)

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

### Pie

[`examples/pie.mmd`](../../examples/pie.mmd) · [SVG](images/pie.svg)

```mermaid
pie showData
    title Traffic sources
    "Organic" : 42.5
    "Direct"  : 23.1
    "Social"  : 18.4
    "Referral" : 9.8
    "Email"   : 6.2
```

### Mindmap

[`examples/mindmap.mmd`](../../examples/mindmap.mmd) · [SVG](images/mindmap.svg)

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

### Timeline

[`examples/timeline.mmd`](../../examples/timeline.mmd) · [SVG](images/timeline.svg)

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

### Journey

[`examples/journey.mmd`](../../examples/journey.mmd) · [SVG](images/journey.svg)

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

### GitGraph

[`examples/gitgraph.mmd`](../../examples/gitgraph.mmd) · [SVG](images/gitgraph.svg)

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

### Quadrant

[`examples/quadrant.mmd`](../../examples/quadrant.mmd) · [SVG](images/quadrant.svg)

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

## Regenerate

```bash
for f in flowchart sequence class state er gantt pie mindmap timeline journey gitgraph quadrant; do
  mmp "examples/${f}.mmd" -o "docs/catalog/images/${f}"
done
```
