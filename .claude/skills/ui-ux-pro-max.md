---
name: ui-ux-pro-max
description: Comprehensive UI/UX design intelligence for building professional interfaces across web and mobile. Invoke when designing pages, creating components, selecting design systems, reviewing UI code, or optimizing perceived quality. Covers accessibility, touch targets, performance, typography, animation, forms, navigation, and data visualization.
---

# UI/UX Pro Max

This skill must be invoked when tasks involve designing pages, creating components, selecting design systems, reviewing UI code, or optimizing perceived quality. It addresses UI structure, visual design decisions, interaction patterns, and user experience quality control.

## Priority Rule Categories

### 1. Accessibility (CRITICAL)
- Minimum contrast ratio 4.5:1 for text (AA standard)
- All meaningful visuals need descriptive labels
- Keyboard navigation must match visual hierarchy
- Focus states must be visible and clear
- Screen reader support required

### 2. Touch & Interaction (CRITICAL)
- Minimum 44×44pt touch targets
- Pressed feedback within 80-150ms
- Proper gesture handling
- No overlapping interactive zones

### 3. Performance (HIGH)
- Optimize and lazy-load images
- Avoid layout shifts (CLS)
- Keep input latency low
- Use efficient rendering paths

### 4. Style Selection (HIGH)
- Maintain consistency across components
- Use SVG icons from a single family
- Adapt to platform conventions
- Dark mode must have independent contrast verification

### 5. Layout & Responsive (HIGH)
- Mobile-first: design for 375px viewport first
- Respect safe areas (notches, gesture zones)
- Use a consistent spacing system (4/8dp rhythm)
- Progressive content width increase for larger screens

### 6. Typography & Color (MEDIUM)
- Clear type scale with semantic tokens
- Verify contrast in both light and dark modes
- Support dynamic text sizes
- Use color purposefully, not decoratively

### 7. Animation (MEDIUM)
- Duration: 150-300ms
- Use meaningful motion only
- Respect `prefers-reduced-motion`
- Prefer physics-based easing curves

### 8. Forms & Feedback (MEDIUM)
- Always show visible labels (not just placeholders)
- Place errors inline, close to the field
- Use progressive disclosure for complex flows
- Confirm destructive actions

### 9. Navigation Patterns (HIGH)
- Bottom nav: max 5 items
- Predictable back behavior
- Support deep linking
- Respect system gesture navigation

### 10. Charts & Data (LOW)
- Match chart type to data shape
- Use accessible color palettes (not color-only encoding)
- Always include legends and tooltips
- Label axes clearly

## Usage Workflow

1. **Analyze Requirements** — Extract product type, audience, style keywords, technology stack
2. **Generate Design System** — Recommend colors, type, spacing, and component tokens with reasoning
3. **Search for Specifics** — Drill into domain-specific patterns (color, typography, UX practices)
4. **Stack Guidelines** — Apply framework-specific implementation patterns

## Pre-Delivery Verification Checklist

- [ ] No emoji used as structural UI icons
- [ ] Consistent icon family with 1.5-2px stroke
- [ ] All touch targets ≥ 44×44pt
- [ ] Pressed-state visual feedback present
- [ ] Accessibility labels complete
- [ ] Safe-area compliance verified
- [ ] 4/8dp spacing rhythm maintained
- [ ] Contrast verified in light AND dark modes
