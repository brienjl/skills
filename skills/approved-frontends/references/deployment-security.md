# Deployment security for lightweight sites

Use a small, tested deployment policy appropriate to the site. This reference covers frontend delivery and scoped Functions; it does not prescribe a general backend architecture.

## Resource and script policy

Prefer owned browser modules and a pinned HTMX release served from the same origin. If a CDN is deliberately used, pin the exact artifact, use integrity metadata where supported, and account for availability and privacy. Copying a dependency into a public directory still needs an update policy. Never expose secrets through generated data, templates, client code, or public source maps.

For new HTMX work using external event modules, the following configuration is a useful starting point. Place it in the document head before the HTMX script:

```html
<meta name="htmx-config" content='{"allowEval":false,"allowScriptTags":false,"includeIndicatorStyles":false,"selfRequestsOnly":true,"timeout":10000}'>
```

This disables eval-dependent expressions and response-script execution, keeps requests same-origin, and sets a sample 10-second timeout. Choose the timeout for the operation. Use external modules for events; do not then rely on `hx-on`, JavaScript-prefixed values, eval-based filters, injected response scripts, or injected default indicator styles. Supply indicator CSS explicitly. Verify these settings against the installed HTMX version and existing features before adopting them. They do not sanitize unsafe HTML or replace server validation.

## Static response headers

For a site using only same-origin scripts/styles/images/fonts and no inline script/style, a Netlify TOML starting point is:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

Adapt resource destinations to actual needs rather than adding wildcards, `unsafe-inline`, or `unsafe-eval` to silence failures. This sample intentionally disallows embedding and inline style attributes; adapt embedding requirements and any data/blob assets deliberately. Use report-only CSP during rollout where appropriate, inspect violations, and test the production policy before enforcement. A report-only policy still needs someone to inspect reports or console violations. Do not claim strict-CSP compliance merely because a header exists.

Netlify static header rules do not automatically apply to function/proxy responses. Set appropriate headers on those responses too, especially full HTML fallbacks, and verify actual deployed responses. Keep HTML and JSON content types accurate, prevent caching of sensitive responses, and retain `Vary: HX-Request` where representation depends on that header. HSTS can be appropriate after HTTPS and any subdomain implications have been assessed; do not add preload/subdomain coverage mechanically.

## Runtime boundaries

Escape interpolated HTML; sanitization and URL validation are required where the feature permits rich/untrusted content or user-controlled destinations. An `HX-Request` header selects a response format and is not proof of authorization. For mutating authenticated actions, use appropriate authentication, authorization, CSRF protection, and validation. Timeouts, spam protection, and rate limits should fit the actual public endpoint. Log useful failure categories/request identifiers without submission secrets or unnecessary personal data.

Use server-side idempotency/deduplication when duplicate writes would matter. Aborting a browser request does not roll back a server action. Scope keys to the operation and user, store them durably for the intended replay window, and return a consistent result for replays. In-memory function variables do not establish this guarantee. Do not introduce persistence solely for a read-only widget.

References: [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), [HTMX configuration](https://htmx.org/docs/#config), [Netlify headers](https://docs.netlify.com/manage/routing/headers/).
