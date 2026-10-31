# Layered CSS and design tokens

Use a small, explicit cascade that leaves room for each app's character. The starter is a working example, not a mandatory visual theme.

## Layers and ownership

```css
@layer reset, tokens, base, layout, components, utilities;
```

| Layer | Responsibility |
| --- | --- |
| reset | Small normalization: box sizing, body margin, inherited form fonts |
| tokens | Palette primitives and semantic color, type, space, radius, elevation tokens |
| base | Element defaults, typography, links, focus, reduced motion |
| layout | Page width, stacks, grids, structural regions |
| components | Navigation, buttons, fields, dialogs, app-specific features |
| utilities | A few explicit helpers such as visually hidden content |

Brien's exports organize app regions with `@layer base`, `intro`, `contact`, `nav`/`header`, and `footer`, including breakpoints inside the owning layer. Preserve that recognizable section-based organization. The starter separates shared foundations and nests app sections beneath `components`, for example `components.navigation`, `components.intro`, and `components.workspace`. Top-level section layers are equally acceptable with an explicit order. Start with as few sections as are useful, and preserve an existing app's deliberate ordering rather than replacing it mechanically.

Declare the order before layer contents. For normal declarations, later layers win before selector specificity is compared. Unlayered normal styles outrank layered normal styles, so keep app rules in layers. Important declarations reverse layer priority: avoid `!important` as an architecture mechanism. Keep third-party CSS in an earlier, explicitly ordered vendor layer when integrating it.

When splitting files, retain one order declaration and load files deliberately. CSS `@import url("components.css") layer(components)` can place a plain stylesheet in a layer without build tools; keep imports at the top, after the layer-order statement and before other rules. Avoid wrapping an already fully layered stylesheet in another layer accidentally.

## Token hierarchy

1. Palette primitives describe colors, for example `--palette-stone-100`.
2. Semantic tokens describe their use, for example `--color-surface`.
3. Component tokens exist when a component genuinely needs an independently configurable value.

```css
@layer tokens {
  :root {
    --palette-stone-100: #f4f2ed;
    --palette-stone-900: #282a27;
    --palette-forest-700: #315b49;
    --color-page: var(--palette-stone-100);
    --color-text: var(--palette-stone-900);
    --color-accent: var(--palette-forest-700);
    --shadow-raised: -2px 3px 8px rgb(25 30 25 / 0.10);
  }
}
```

These colors are illustrative. Choose a coherent palette for the app, check foreground/background combinations, and use status colors only where relevant. Theme overrides belong with tokens, scoped to a theme attribute or relevant region. Do not implement dark mode unless it serves the task.

Use `rem` for readable type and scalable spacing. Fluid values such as `clamp()` can adapt gutters and headings without a collection of device-specific sizes. Do not make every measurement a token: extract values whose shared meaning makes coordinated changes useful.

### Typography as a connected system

The supplied style guide derives six heading sizes from `--base-size` and `--scale` with `calc()`. Retain that relationship, with separate body, heading, and monospace font roles. The starter calls these `--type-base`, `--type-ratio`, `--type-0` through `--type-5`, and `--font-body`, `--font-heading`, `--font-mono`. Semantic aliases such as `--text-section` select a suitable step without forcing every `h2` to occupy the second-largest size. Base and ratio values are configurable rather than fixed house requirements.

Include the full heading scale in a local specimen when a reusable design system needs one. Also show labeled palette roles, body text, links, controls, and native disclosure behavior. The starter's `style-guide.html` uses the same CSS as the application so changes remain visible without maintaining a second theme. A small component edit does not require a separate style-guide deliverable.

## Responsive organization

Use Grid/Flexbox, wrapping, intrinsic sizing, and constrained reading widths first. Choose breakpoints from layout failures rather than device names. CSS custom properties do not substitute into media-query conditions; write the breakpoint value directly and document its purpose where needed.

```css
@layer components.navigation {
  .site-nav { display: flex; flex-wrap: wrap; gap: var(--space-2); }

  /* Stack navigation when the brand and links no longer fit comfortably. */
  @media (max-width: 42rem) {
    .site-header { align-items: start; flex-direction: column; }
  }
}
```

Keep rules with their owners instead of a detached global breakpoint dump. Container queries may fit reusable components that depend on their available width; use them when supported by the project's browser targets.

## Refinement criteria

- A palette or spacing change should mostly change tokens, not dozens of selectors.
- Focus remains visible, including within components and dialogs.
- Shadows consistently cast down and left; most surfaces can remain flat.
- Comfortable whitespace may coexist with dense tables where the task calls for them.
- Reflow works without clipped controls, concealed content, or a fixed-height shell that traps scrolling.

Technical reference: [MDN: cascade layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer).
