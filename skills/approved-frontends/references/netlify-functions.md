# Netlify hosting and lightweight live features

Use this reference when a frontend is hosted on Netlify and needs deploy configuration or a small live capability. Netlify is Brien's usual host, not a reason to attach functions to every page. A future backend skill can own general Node.js services, relational/document database choices, data modeling, migrations, and substantial backend architecture.

## Keep three responsibilities distinct

| Responsibility | Mechanism |
| --- | --- |
| Produce pages, navigation, shared markup, and content collections | Eleventy/Nunjucks at build time |
| Serve the initial page, styles, scripts, and prebuilt fragments | Netlify static hosting |
| Perform a live lookup, submission, or secret-bearing integration | A bounded Node.js Netlify Function when needed |

Use native HTML and small browser modules locally. HTMX only requests and swaps feature HTML. A generated site must remain readable when an optional function is unavailable. Build-time data retrieval is acceptable when the content requires it, but do not add live API dependencies merely to render the page shell.

## Configuration and local development

For the `src` to `public` convention, a minimal configuration is:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "public"

[functions]
  directory = "netlify/functions"
```

Omit the functions section if there are none. Keep function source outside `public` and copy only browser-safe assets into it. Use a currently supported Node.js version compatible with the site's dependencies and Netlify runtime; verify provider support rather than pinning a version in this skill. Do not add an SPA catch-all rewrite to a multi-page static site.

`npm start` runs Eleventy's static dev server. When testing functions, use Netlify CLI (`netlify dev`, installed and invoked through npm tooling) to exercise static pages and function routes on one local origin. Eleventy's server alone does not emulate Functions or managed Forms. Preserve an existing CLI configuration, and check the installed CLI's options before adding a dev proxy configuration.

See [Netlify file configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/) and [Functions setup](https://docs.netlify.com/build/functions/get-started/) for current platform behavior. Netlify may package functions during deployment; that does not justify adding frontend bundling to the site's CSS or browser modules.

## Prefer the smallest platform feature

For a simple contact form, consider native POST submission and Netlify Forms before writing a custom function. The generated HTML must contain the form and its platform attributes/fields so build-time detection can find it; provide labeled fields and a real success page. Verify Forms enablement and submission behavior in the actual site's configuration. Use a Function when custom processing or an integration requires it. Do not assume HTMX can consume a managed form's default response as a fragment without an explicit response contract.

Official reference: [Netlify Forms setup](https://docs.netlify.com/manage/forms/setup/).

## HTML function contract

Use plain JavaScript `.mjs` files in `netlify/functions/` for new functions. Netlify's current handler interface accepts a web `Request` and returns a `Response`. Existing projects may use the older `handler(event, context)` compatibility interface; preserve it when extending that project rather than mixing response shapes.

The maintained [status handler](../assets/netlify/status.mjs) is a read-only endpoint demonstrating full-page versus fragment responses. Copy and adapt it to `netlify/functions/status.mjs` when useful. Its complete source is local; no external demo is needed. It demonstrates endpoint reachability, not an email integration, database, or production status monitor.

```js
// Core response decision; the complete handler also checks methods,
// implements HEAD, supplies a complete fallback page, and sets headers.
const enhanced = request.headers.get("HX-Request") === "true";
const html = enhanced ? content : fullPage;
return new Response(html, { headers });
```

Its default endpoint is `/.netlify/functions/status`. An ordinary link can use that URL as its full-page fallback while HTMX uses the same URL with a target and swap:

```html
<div id="site-status" aria-live="polite"><p>Live status has not been checked.</p></div>
<a href="/.netlify/functions/status"
   hx-get="/.netlify/functions/status"
   hx-target="#site-status" hx-swap="innerHTML"
   hx-sync="this:replace">Check endpoint</a>
```

The existing `site-status` element stays in place; the function returns only its new contents for HTMX. Load a pinned HTMX browser distribution only on a site that uses it. Integrate pending state and the local error handling described in [interactions.md](interactions.md). The example deliberately avoids a custom path rewrite; add one only when a feature needs it and verify that it does not shadow static pages.

Source: [Netlify Functions API](https://docs.netlify.com/build/functions/api/).

## Feature boundaries

Keep the HTML response contract explicit: stable root ID, the intended swap mode, usable full-page fallback, and local pending/error feedback. If a function renders Nunjucks, install it as a direct runtime dependency, enable escaping, and ensure needed templates are included in deployment. Eleventy's build output and template engine do not automatically become a runtime rendering service.

Keep secrets in Netlify environment variables scoped to the functions that need them; do not expose them in browser code, generated HTML, or build output. Validate request methods and inputs, escape values interpolated into HTML, and use the project's authentication/authorization and CSRF protection for actions that require them. Avoid logging sensitive submission data. Use suitable spam/abuse controls for public submissions. Do not add database or authentication infrastructure to a simple read-only feature by default.

Read [deployment-security.md](deployment-security.md) for CSP/response headers, third-party policy, and idempotency boundaries. Select timeouts and retry behavior for each operation; an aborted client request does not undo a write. See [quality.md](quality.md) for proportional project verification.

Functions are request-scoped; do not treat module memory or their local filesystem as durable application storage. If a feature needs persistence, choose the smallest appropriate service with the user/project context. Larger data architecture belongs in backend work; do not silently turn a small website into a database platform.

Verify ordinary and HTMX requests, unsupported methods, expected input failures, and unavailable upstream behavior. Configure HTMX validation/error handling deliberately. Check through Netlify's local routing and, when deploying is in scope, a preview environment; calling a handler directly does not verify provider routing, packaging, secrets, or managed Forms.
