---
name: ui-styling
description: UI component styling using shadcn/ui, Tailwind CSS, and canvas-based visual design. Use when building React UIs, implementing accessible components, setting up a design system, enabling dark mode, or doing rapid prototyping.
---

# UI Styling

Building beautiful, accessible user interfaces using shadcn/ui components, Tailwind CSS, and canvas-based visual design.

## Core Stack

### shadcn/ui
- Pre-built accessible components via Radix UI primitives
- Copy-paste distribution model — components live in your codebase
- TypeScript-first

### Tailwind CSS
- Utility-first CSS framework
- Build-time processing with automatic dead code elimination
- Design token integration via `tailwind.config.js`

### Canvas Layer
- Museum-quality visual compositions
- Philosophy-driven design
- Minimal text, maximum visual impact

## Quick Setup

```bash
# Initialize shadcn/ui + Tailwind together
npx shadcn@latest init

# Add specific components
npx shadcn@latest add button card input form
```

## Use Cases

- React framework UI building
- Accessible component implementation
- Responsive design creation
- Dark mode implementation
- Design system establishment
- Rapid prototyping

## Best Practices

- **Component composition**: build complex UIs from small, focused primitives
- **Utility-first styling**: prefer Tailwind classes over custom CSS
- **Mobile-first responsiveness**: start at `sm:` and scale up
- **Accessibility-first**: use Radix primitives, never skip ARIA
- **Consistent design tokens**: all values through CSS variables
- **Dark mode**: implement with `dark:` variants, verify contrast independently
- **Performance**: minimize bundle size, lazy-load heavy components
- **TypeScript**: type all props and variants
- **Visual hierarchy**: use size, weight, and space intentionally

## Automation Scripts

- `shadcn_add.py` — batch component installation
- `tailwind_config_gen.py` — generate Tailwind config from design tokens
