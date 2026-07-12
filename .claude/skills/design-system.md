---
name: design-system
description: Design token architecture, component specifications, CSS variable systems, and Tailwind theme configuration. Use when creating or maintaining a design system, doing design-to-code handoff, or generating strategic presentations with consistent tokens.
---

# Design System

Comprehensive resource for token architecture, component specifications, and presentation generation.

## Token Architecture

Three-layer approach — all values must flow through this hierarchy:

```
Primitive (raw values) → Semantic (purpose aliases) → Component (component-specific)
```

- **Primitive tokens**: raw colors, sizes, radii (e.g., `--color-blue-500: #3B82F6`)
- **Semantic tokens**: purpose-based aliases (e.g., `--color-primary: var(--color-blue-500)`)
- **Component tokens**: scoped to a specific component (e.g., `--button-bg: var(--color-primary)`)

Never use hardcoded values in components — always reference CSS variables.

## Use Cases

- Design token creation and CSS variable systems
- Component state definitions with spacing/typography scales
- Design-to-code handoff documentation
- Tailwind theme configuration (`tailwind.config.js`)
- Strategic slide and presentation generation

## Slide Generation System

When generating slides, use the following decision framework:

- **Strategies**: 15 deck structures with emotion arcs
- **Layouts**: 25 layout options with component variants
- **Typography**: content-type-based scale selection
- **Color Logic**: emotion-driven color treatment
- **Copy Formulas**: PAS, AIDA, FAB, and 22 more
- **Charts**: 25 Chart.js configurations

**Critical requirement**: ALL slides must import `assets/design-tokens.css` as the single source of truth and use only CSS variables — never hardcoded values.

## Scripts & Tools

- Token generation and validation scripts
- BM25-based slide search
- Token compliance validator
- Image fetching from Pexels/Unsplash

## Delivery Standards

Before handoff, validate:
- All tokens follow the three-layer hierarchy
- No hardcoded color or size values in component CSS
- CSS variables are documented with intent, not just value
- Both light and dark token sets are defined
