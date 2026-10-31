# Quality and verification

Apply checks in proportion to the feature and delivery stage. A local mockup does not need a production pipeline; a deployed public site needs more evidence than source inspection. Preserve the plain HTML/CSS/JavaScript runtime while using tooling where it improves outcomes.

## Accessibility acceptance

Target WCAG 2.2 AA. For relevant pages and states, check:

- Semantic headings/landmarks, accessible names, labels, useful alt text, and field errors linked to their controls.
- Keyboard access without traps, logical focus order, visible focus that is not obscured by sticky content, and focus return after dialogs.
- Text contrast of at least 4.5:1 for normal text or 3:1 for qualifying large text; necessary control boundaries/states and graphics need appropriate non-text contrast.
- Reflow at 320 CSS pixels and text enlargement to 200%, with no lost content or controls. Data tables and other genuinely two-dimensional content may need local scrolling.
- Pointer targets meeting the 24×24 CSS pixel minimum or its applicable spacing/exceptions; prefer roughly 44×44 for primary standalone touch controls when the layout allows it.
- Reduced motion, forced colors, and high text-spacing settings. Native elements still require testing within the actual CSS.
- Important dynamic behavior with a screen reader/browser combination appropriate to the audience. Keep live regions present before updating their contents; do not assume replacing an entire live-region element announces the new text.

Automated scans can catch some failures, not prove conformance. Record manual checks and any unverified combinations. Avoid claiming compliance from a Lighthouse score or a single browser run. Source: [WCAG 2.2 reference](https://www.w3.org/WAI/WCAG22/quickref/).

## Browser support policy

Use the project's audience and analytics when available. Otherwise state a provisional target of current stable Chromium, Firefox, and Safari, including relevant mobile browsers. Check compatibility of newer features, use `@supports` or native feature detection for enhancements, and preserve a usable baseline. Baseline compatibility is useful evidence, not a substitute for accessibility or device testing. Never describe Edge-only checks as cross-browser verification.

## Images and loading

Use local owned assets or deliberate services. Emit responsive sizes, reserve geometry with width/height, use useful alt text, and avoid lazy-loading the likely above-the-fold LCP image. Lazy-load below-the-fold images. Generate optimized formats/resolutions at build time when useful; Eleventy Image is optional, not a requirement to add an image pipeline to every page.

```html
<!-- Illustrative paths: generate these local files before using this markup. -->
<img src="/assets/project-960.webp"
     srcset="/assets/project-480.webp 480w, /assets/project-960.webp 960w"
     sizes="(max-width: 48rem) calc(100vw - 2rem), 40rem"
     width="960" height="640" loading="lazy" decoding="async"
     alt="A project planning board showing completed and upcoming tasks">
```

Match `sizes` to the actual layout. Keep CSS `max-inline-size: 100%; block-size: auto` for responsive images. Use `picture` when art direction or format fallbacks require it. Self-host intentional fonts where practical, include fallback stacks, and assess layout shifts. Avoid unnecessary preloads and third-party scripts. The local starter needs no remote font/image service.

## Performance expectations

For production sites, target good Core Web Vitals at the 75th percentile, segmented by mobile/desktop: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. Lab measurements help diagnose a new site; field measurements validate real-user results when enough traffic exists. Do not report lab scores as field passing results.

Agree project-specific budgets for transferred JavaScript, CSS, images, and third-party work. A small brochure site and a complex tool need different limits. Measure before adding tooling or optimizations. Static HTML alone does not prevent slow images, blocking fonts, or excessive third-party scripts. Define cache behavior deliberately: long immutable caching only for versioned assets; revalidate or use suitable lifetimes for changeable HTML and fragments. Never publicly cache private responses.

References: [Web Vitals](https://web.dev/articles/vitals), [Eleventy Image](https://www.11ty.dev/docs/plugins/image/).

## Repeatable checks

For a templated site, keep the basic npm workflow small:

```json
{
  "scripts": {
    "start": "eleventy --serve",
    "build": "eleventy"
  }
}
```

Run the build and inspect representative generated pages, copied assets, internal links, and important interactions. Include empty collections, missing optional images, narrow layouts, keyboard use, and enhancement failure paths when relevant. Check routing and headers in the deployment environment when publishing is in scope.

Use `npm ci` with a committed lockfile for clean CI installs, and record the supported Node.js version. Add HTML/link validation, linting, accessibility scans, or focused automated tests when repetition, complexity, or the consequences of failure justify them. Meaningful writes and critical interactions may warrant more coverage than a portfolio page. Do not scaffold a test suite or CI pipeline solely because this skill is active, and do not add placeholder test scripts.

Optional JavaScript checking can use JSDoc with `// @ts-check`, or TypeScript as a development-only checker configured with `allowJs`, `checkJs`, and `noEmit`. This does not require changing source to TypeScript or adding transpilation. Use it when the project's complexity benefits; do not impose it on every three-line module.

Report what was checked and what remains unverified. Local checks do not establish Netlify deployment behavior, screen-reader compatibility, or real-user performance.
