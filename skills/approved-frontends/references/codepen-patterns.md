# Maintained HTML and CSS patterns

These examples capture Brien's section layers, shared foundations, responsive ownership, and selective visual detail. Values and section names are illustrative.

## Shared foundation and connected type

**Avoid:** color literals and unrelated heading sizes scattered across components.

**Prefer:** palette primitives, semantic roles, and a base/ratio relationship. The [starter stylesheet](../assets/starter/styles.css) contains the full implementation.

```css
@layer reset, tokens, base, layout, components, utilities;
@layer tokens {
  :root {
    --palette-paper: #f6f4ef;
    --palette-ink: #292f2b;
    --palette-forest: #315b49;
    --color-page: var(--palette-paper);
    --color-text: var(--palette-ink);
    --color-accent: var(--palette-forest);
    --font-body: system-ui, sans-serif;
    --font-heading: var(--font-body);
    --font-mono: ui-monospace, Consolas, monospace;
    --type-base: 1rem;
    --type-ratio: 1.25;
    --type-0: var(--type-base);
    --type-1: calc(var(--type-0) * var(--type-ratio));
    --type-2: calc(var(--type-1) * var(--type-ratio));
    --shadow-raised: -2px 3px 8px rgb(25 30 25 / 0.10);
  }
}
```

Choose heading levels for meaning independently of displayed size. The local [style guide](../assets/starter/style-guide.html) shows six size steps, palette labels, links, and controls against the shared CSS.

## Navigation that survives focus changes

**Avoid:** an unnamed trigger, focus-only state, and a pseudo-element close glyph.

```html
<!-- Fragile: keyboard focus cannot reach the trigger normally. -->
<button tabindex="-1"></button>
<nav>...</nav>
```

```css
/* Fragile: entering a link moves focus away from the trigger. */
button:focus + nav { display: block; }
nav::after { content: "×"; } /* A glyph is not a close control. */
```

For short lists, keep links visible and wrap/stack them, as in the starter header. A compact disclosure can instead use native HTML:

```html
<nav aria-label="Section navigation">
  <details class="disclosure-nav">
    <summary>Explore</summary>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/blog/">Articles</a></li>
    </ul>
  </details>
</nav>
```

```css
@layer components.navigation {
  .disclosure-nav summary { cursor: pointer; padding: 0.75rem; }
  .disclosure-nav ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0.5rem;
  }
  .disclosure-nav a { display: inline-block; padding: 0.75rem; }
  @media (max-width: 40rem) {
    .disclosure-nav ul { flex-direction: column; }
  }
}
```

The open state belongs to `details`, so tabbing into links does not close it. This is a disclosure, not a modal: no focus trap or custom Escape behavior is promised. Preserve the native summary marker and keyboard behavior. A live example with local destinations is in the style guide.

If a custom overlay is required, use a named button with synchronized `aria-expanded`/`aria-controls` and a real close action. Hide closed content from keyboard navigation, preserve a usable baseline if JavaScript fails, and implement focus handling appropriate to a disclosure or modal. Use ordinary navigation links rather than application-menu roles. Decorative inline SVGs should use `currentColor` and be hidden from assistive technology; icon-only links need an accessible name.

## Full-width region, constrained content

**Avoid:** a global container background or giant greeting introduced on every page.

**Prefer:** independent regions with controlled inner reading widths.

```html
<section class="section-banner" aria-labelledby="contact-title">
  <div class="container stack">
    <h2 id="contact-title">Have a project in mind?</h2>
    <p>A little context is all we need to start a conversation.</p>
    <a href="/contact/">Contact</a>
  </div>
</section>
```

```css
@layer components.contact {
  .section-banner {
    padding-block: clamp(2rem, 5vw, 4rem);
    background: var(--color-tint);
    color: var(--color-text);
  }
  @media (min-width: 50rem) {
    .section-banner .container { max-inline-size: 60rem; }
  }
}
```

The starter supplies `container`, `stack`, and these semantic tokens. The style guide includes a live region specimen. Photographic backgrounds are optional: retain a contrast-safe solid background, own the assets, and keep important text in HTML.

## Footer and understated detail

```html
<footer class="site-footer container">
  <p>A brief, useful closing note.</p>
  <a href="/contact/">Contact</a>
</footer>
```

```css
@layer components.footer {
  .site-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.75rem;
    padding-block: 1.5rem;
    border-block-start: 1px solid var(--color-border);
  }
}
```

Use real destinations. Group social links in a labeled navigation or list when relevant, and let them wrap. The starter demonstrates a footer without background-photo or icon-library dependencies.

An optional artistic detail can change underline weight on hover and keyboard focus while keeping the link recognizable at rest:

```css
@layer components.details {
  .expressive-link {
    text-decoration-line: underline;
    text-decoration-thickness: 0.08em;
    text-underline-offset: 0.2em;
  }
  .expressive-link:hover,
  .expressive-link:focus-visible { text-decoration-thickness: 0.16em; }
}
```

No animation is required. If motion serves the project, enable it inside `prefers-reduced-motion: no-preference` and preserve focus outlines. Gradients, image-clipped text, and large layered text shadows remain deliberate project-specific choices. Ordinary elevation casts down and left from a top-right light source.
