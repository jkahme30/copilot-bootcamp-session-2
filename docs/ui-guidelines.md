# UI Guidelines for TODO App

This document describes the core UI guidelines for the TODO application. It defines the design system, component usage, color palette, accessibility and responsiveness rules the team should follow.

## Purpose
- Provide a consistent, accessible, and maintainable visual system.
- Make it easy to build predictable UI using reusable components and tokens.
- Ensure the app is responsive, performs well with many tasks, and is accessible to all users.

## Design System
- Adopt Material Design components as the baseline (e.g., MUI or Material Web Components).
- Use a centralized theme provider (ThemeProvider) with design tokens (colors, typography, spacing, elevation, motion) exposed as CSS variables.
- Keep components small, focused, and composition-friendly.
- Prefer design tokens and utility classes over ad-hoc inline styles.

## Theming & Tokens
- Support Light and Dark themes. Theme switching should be instantaneous and persisted per user (or locally when not signed in).
- Use CSS variables for tokens under `:root` and theme-specific overrides for dark mode.
- Spacing scale: 4px base unit; prefer an 8px grid (multiples of 8) for margins and paddings.
- Elevation: use limited elevation steps (none, low, medium, high) implemented via shadow tokens.

## Color Palette (suggested)
- Primary: #1976D2 (blue 600)
- Primary variant / Hover: #1565C0
- Secondary: #9C27B0 (purple 500)
- Background (light): #FFFFFF
- Surface / Card: #FAFAFA
- Text primary: #0F172A (dark)
- Text secondary: #6B7280 (muted)
- Success: #2E7D32 (green 700)
- Warning: #F57C00 (orange 600)
- Error: #D32F2F (red 700)

Notes:
- Ensure all UI color combinations meet WCAG AA contrast ratios for text (4.5:1 for normal text, 3:1 for large text).
- Add semantic token aliases for component states (e.g., `--color-button-primary-bg`, `--color-badge-completed-bg`).

## Typography
- Base font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif.
- Scale example: 12 / 14 / 16 (base) / 20 / 24 / 32 / 40.
- Use tokenized font sizes (e.g., `--font-size-body`, `--font-size-heading-1`).
- Maintain clear line-height ratios for readability (1.4–1.6 depending on size).

## Layout & Responsiveness
- Breakpoints: mobile-first
  - xs: <600px (mobile)
  - sm: 600–960px (tablet)
  - md: 960–1280px (small desktop)
  - lg: 1280–1920px (desktop)
- On mobile: present a single-column list view with collapsible/slide-over task editor.
- On larger screens: two-column layout (task list + detail editor) when space permits.
- Use fluid containers with max-widths and safe gutters.

## Components & Patterns
- App Shell: top AppBar with app title, search, primary actions; optional left navigation for future features.
- Task list item / card:
  - Use a compact list item for high density and an expanded card view for details.
  - Show primary metadata at a glance: title, due date, priority, tags, completion checkbox, and a menu for row actions.
  - Support keyboard focus and row-level actions via `aria` attributes.
- Buttons:
  - Primary (filled): brand color background, white text, medium-high emphasis.
  - Secondary (outlined): transparent background, colored border, colored text.
  - Ghost / Text: minimal, for less prominent actions.
  - Sizes: small, medium (default), large.
  - Always include accessible name/label and visible focus outline.
- Forms / Inputs:
  - Use Material inputs where possible (date picker, select, text field).
  - Provide inline validation messages with clear error color and assistance text.
- Dialogs / Modals:
  - Centered, dismissible, trap focus while open, restore focus on close.
- Drag & Drop / Reorder:
  - If supporting manual ordering, implement keyboard-accessible reorder controls and visible drag handles.
- Icons:
  - Use a single icon set for consistency (Material Icons). Prefer outline style for neutral actions and filled for strong emphasis.

## Interaction & Motion
- Respect prefers-reduced-motion and minimize non-essential motion.
- Use subtle motion for adding/removing tasks and state changes (fade + translate) to provide continuity.
- Keep animation durations short (100–250ms) and easing standard (cubic-bezier or material curves).

## Accessibility (a11y)
- Target WCAG 2.1 AA compliance across the app.
- Keyboard accessibility:
  - All interactive elements must be reachable with keyboard (tab/shift+tab), and actionable via Enter/Space.
  - Provide logical tab order and skip links if necessary.
- Screen reader support:
  - Use semantic HTML where possible (buttons, lists, headings).
  - Add ARIA roles/labels for complex widgets (e.g., `role="list"` / `role="listitem"` / `aria-expanded`).
  - Announce dynamic updates using `aria-live` regions for notifications (task saved, deleted).
- Focus management:
  - Ensure visible focus states that meet contrast requirements.
  - Manage focus when modals open/close and when inline editors appear.
- Color contrast:
  - Maintain minimum contrast ratios (4.5:1 for small text).
- Localization & RTL:
  - Design components to support RTL; use logical CSS properties and avoid hard-coded left/right.

## Performance & Scalability
- For large lists (hundreds/thousands of tasks), use virtualization (e.g., react-window) to keep memory and render costs low.
- Lazy-load heavy assets (date pickers, large icon sets) and split bundles where appropriate.
- Keep component render trees small and memoize where beneficial.

## Testing & Documentation
- Component library should have Storybook with stories for default, edge, and accessibility states.
- Add unit tests for key UI components and integration tests for flows (create/edit/delete tasks).
- Run automated accessibility checks (axe) in CI and manual audits periodically.

## Microcopy & Tone
- Use concise, helpful microcopy for buttons and empty states.
- Error messages should be actionable and friendly.
- Keep labels clear and verbs first (e.g., "Add task", "Mark complete").

## Implementation Notes
- Prefer a single source of truth for styles (theme file) and small presentational components.
- Expose tokens in a `theme` module and as CSS variables for easy usage in stylesheets and component libraries.
- Avoid putting business logic in presentational components. Keep styling isolated.

## Acceptance Criteria
- The app uses Material components and theme tokens consistently.
- Light and dark themes are available and persist across sessions.
- All interactive controls are keyboard-accessible and have visible focus states.
- Color contrast meets WCAG AA for normal text.
- Task list performs acceptably with large data sets (virtualization applied when necessary).

## Next Steps / Suggestions
- Create a small Storybook setup and author a handful of core components: `TaskItem`, `TaskList`, `TaskEditor`, `AppShell`, `PrimaryButton`.
- Implement the theme provider and token file and wire it into the frontend entrypoint.
- Add basic accessibility unit tests (axe) for the main pages.


