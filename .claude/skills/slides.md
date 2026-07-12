---
name: slides
description: Strategic HTML presentation builder using Chart.js, design tokens, and responsive layouts. Best for marketing decks, pitch decks, and data-driven presentations. Use the 'create' subcommand with a topic and slide count.
---

# Slides

Creates strategic HTML presentations using Chart.js, design tokens, and responsive layouts. Designed for marketing decks and data-driven content.

## Usage

```
/slides create [topic] [slide-count]
```

Example: `/slides create choir season launch 10`

## What It Generates

- Fully responsive HTML slides
- Chart.js data visualizations
- Design-token-driven styling (imports `assets/design-tokens.css`)
- Strategic copywriting (PAS, AIDA, FAB, and 22 more formulas)
- Consistent layout patterns across all slides

## Design Resources

Four reference files power the generation:
- **Layout patterns** — 25 layout options with component variants
- **HTML templates** — reusable slide structures
- **Copywriting formulas** — 25 strategic approaches with emotion arcs
- **Slide strategies** — 15 deck structures matched to presentation goals

## Best Use Cases

- Marketing presentations and pitch decks
- Data-driven slides with Chart.js
- Investor decks
- Product launches
- Annual reports

## Critical Requirements

- All slides must import `assets/design-tokens.css` as the single source of truth
- Use only CSS variables — never hardcoded colors or sizes
- Chart.js configurations must use accessible color palettes
