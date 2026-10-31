---
name: approved-frontends
description: Create or refine Brien's web frontends with native HTML, layered CSS, small JavaScript modules, and Eleventy/Nunjucks static sites. Use for pages, portfolios, blogs, app interfaces, and components, including bounded HTMX fragments and lightweight Netlify Functions that support the frontend.
---

# Approved Frontends

Build useful, expressive interfaces that are easy to serve, understand, and change. The defaults below express Brien's preferences; explicit task requirements and existing project conventions take precedence. Do not migrate an existing stack merely to apply this skill.

## Preferred stack and visual direction

- Use native HTML first, shared layered CSS, and small JavaScript ES modules. Use ordinary links and page navigation. Prefer native controls, forms, validation, disclosure, and dialogs before custom implementations.
- For templated static sites, use Eleventy and Nunjucks. A standalone page can remain plain HTML. Use Node.js and npm only for runtime/tooling and package management. Do not introduce Vite, Bun, a client framework, Tailwind, or browser bundling by default.
- Prefer minimal, purposeful tooling: static generation, image optimization, validation, linting, testing, and optional JavaScript type checking are welcome when they materially help. Browser code can remain plain JavaScript without transpilation.
- Use HTMX for component-scoped HTML requests and swaps, supplied by static fragments or live endpoints. Local interactions belong in native HTML or small modules. No site-wide `hx-boost` or API-dependent page shell by default.
- Netlify is the preferred host when hosting is in scope. Use its native features or small Node.js Functions for lightweight live capabilities. General service architecture and database design belong in separate backend work, not an automatic expansion of this skill.
- Favor intentional typography, comfortable whitespace, clear hierarchy, and a palette suited to the product. Avoid generic shiny hero templates, glass effects, gratuitous gradients, and cards around everything. Selective artistic choices are welcome.
- Define body, heading, and monospace font roles and a connected relative type scale. Density depends on content; do not impose tiny text or one fixed heading scale.
- Keep optional elevation subtle, with a top-right light source casting shadows down and left. Use color and motion purposefully; do not make meaning depend on color alone.

These preferences do not prohibit a deliberate project-specific font, artwork, or effect. Judge those choices by the product's purpose, accessibility, and performance.

## Engineering requirements

- Deliver meaningful initial HTML. Shared Nunjucks markup renders at build time; optional functions must not be required to construct the static page shell. Keep available content and usable fallback paths when enhancements fail.
- Keep document ownership in a base layout, templates escaped, function source/secrets outside published assets, and server input validated. Do not insert unsanitized HTML or treat a disabled button as protection against repeated writes.
- Declare cascade order, use semantic tokens, and organize app regions into named layers or sublayers. Keep responsive rules with their owner. The conventional starting order is `reset, tokens, base, layout, components, utilities`; names and granularity can change with the app.
- Target WCAG 2.2 AA. Preserve keyboard operation, focus visibility, labels, contrast, reflow, and reduced-motion behavior. Keep announcement regions persistent across swaps and verify important dynamic interactions with assistive technology; automated scans alone do not establish conformance.
- Choose a browser support policy before relying on newer platform features. Use compatibility evidence and progressive enhancement; a recent Chromium test alone is insufficient for a cross-browser claim.
- For production work, use proportional, repeatable checks and explicit performance expectations. Report unperformed checks and deployment limitations honestly. Do not infer performance or accessibility conformance from a successful build.

## Read only the relevant references

| Task | Local guidance |
| --- | --- |
| Create or restructure CSS | [CSS architecture](references/css-architecture.md) |
| Adapt navigation, sections, footer, or artistic details | [Maintained HTML/CSS examples](references/codepen-patterns.md) |
| Build a templated site or content collection | [Eleventy and Nunjucks](references/eleventy-nunjucks.md) |
| Implement HTMX, dialogs, or component lifecycle | [Interactions](references/interactions.md) |
| Add Netlify configuration, Forms, or Functions | [Netlify integration](references/netlify-functions.md) |
| Set accessibility, performance, and browser criteria | [Quality and verification](references/quality.md) |
| Prepare deployment headers and third-party resources | [Deployment security](references/deployment-security.md) |

## Optional techniques and maintained examples

Web Components are appropriate when reusable behavior or lifecycle management reduces complexity. Prefer light DOM for shared CSS; use Shadow DOM deliberately with an explicit styling and accessibility contract. Do not wrap ordinary markup merely to create components.

JSDoc/checkJs, image processing, and automated checks can strengthen a project without changing the delivered runtime. Introduce only tools whose benefit fits the task; this skill does not prescribe a test suite.

The [plain HTML starter](assets/starter/index.html) and [style specimen](assets/starter/style-guide.html) share CSS and work without CodePen or remote assets. The palette is illustrative. The [Netlify response example](assets/netlify/status.mjs) demonstrates a read-only handler. Copy and adapt only what the project needs.

Historical URLs supply attribution only; all approved patterns needed to apply this skill are maintained locally. Do not make external example availability a prerequisite for work.
