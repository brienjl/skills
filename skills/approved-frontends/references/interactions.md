# Native interactions and bounded enhancements

## Choose the smallest mechanism

| Need | Starting point |
| --- | --- |
| Navigate | Ordinary anchor and HTML destination |
| Expand supporting content | `details` with `summary` |
| Collect and submit data | Labeled native form and real action |
| Modal interaction | Native `dialog` plus a small module |
| Filter content already present | Small local JavaScript module |
| Fetch an existing static fragment | HTMX request to an Eleventy-generated HTML file |
| Fetch live server content or submit an action | HTMX request to a scoped endpoint, usually a Netlify Function |
| Complex reusable lifecycle or encapsulation | Consider a Web Component |

Use native capabilities when they meet the behavior and supported-browser needs. Do not rebuild keyboard interactions with clickable `div` elements.

## HTMX fragment contract

Add HTMX only when there is a working fragment request. A static HTTP host can serve prebuilt fragments; a live endpoint can generate them on demand. See [eleventy-nunjucks.md](eleventy-nunjucks.md) for static generation and [netlify-functions.md](netlify-functions.md) for live functions. Use a pinned release appropriate to the project and load its browser distribution directly; no frontend bundler is required. npm can manage the dependency if needed. Do not put an unresolved vendor script into an otherwise working starter.

For example, a search form can enhance a real full-page destination:

```html
<section aria-labelledby="search-title">
  <h2 id="search-title">Search records</h2>
  <form action="/records" method="get"
        hx-get="/records" hx-target="#record-results" hx-swap="innerHTML"
        hx-sync="this:replace"
        hx-indicator="#search-pending" hx-disabled-elt="find button">
    <label for="record-query">Search</label>
    <input id="record-query" name="q" type="search">
    <button type="submit">Search</button>
    <span id="search-pending" class="htmx-indicator" role="status">Searching…</span>
  </form>
  <p id="search-error" role="alert"></p>
  <div id="record-results" aria-live="polite" aria-atomic="true">
    <p>Enter a search to find records.</p>
  </div>
</section>
```

This is an integration pattern, not a complete backend. Implement this contract before shipping it:

- An ordinary GET `/records?q=...` returns a complete HTML page.
- An HTMX request to that route returns the contents for `record-results`, not another copy of that wrapper. Keep the existing live-region element in the document and swap its contents with `innerHTML`; provide a useful result count/summary. Exclude the shell, scripts, and duplicated navigation. For large result sets, use a separate persistent, concise status region rather than announcing the entire list.
- If the response varies with `HX-Request`, send `Vary: HX-Request` so caches distinguish full pages and fragments. Account for any enabled history restoration behavior.
- Keep stable labels, avoid duplicate IDs, and escape untrusted values in returned HTML.
- On network failure, timeouts, and unsuccessful responses, clear pending state and show a useful message in the stable error region. Preserve the query. HTMX does not swap most error responses by default: configure expected validation responses explicitly instead of assuming returned error HTML will appear.
- Use a small module to handle relevant HTMX error events for this form, clear its error on a new request, and announce completion where needed. Do not move focus for every live search; move it deliberately when a submitted action changes the user's task or removes the focused control.
- Verify repeat requests, failed requests, and ordinary submission with HTMX unavailable. Restrict replacement to this feature.

For mutating forms, use a real POST destination, server-side validation, and the project's CSRF protection. Return meaningful full-page results for ordinary submissions and bounded fragments for enhanced ones. Keep pending and failure feedback local. A static prototype should show available local content and clearly identify any unimplemented server action rather than pretending it saves.

### Request policy and accessible status

For the read-only search above, `hx-sync="this:replace"` makes a new request on that form supersede its previous request. If adding type-ahead, place the request on the form with an appropriate debounced trigger, or explicitly synchronize child requests on the form. Verify slow responses cannot replace newer results. Do not assume synchronization between unrelated elements happens automatically.

Choose a finite timeout appropriate to the feature. Retry only operations that are safe to repeat, with a bounded policy and useful user feedback; a user-initiated retry is often enough. A cancelled request may already have reached the server. Do not apply read-search cancellation/retry behavior indiscriminately to writes. Disable duplicate submits as a UX measure, and use server-side idempotency/deduplication when repeated writes have consequences.

Keep pending/error/status nodes stable. Set/clear `aria-busy` on the affected region where useful, preserve field values, and restore pending controls after success, failure, or timeout. When requests overlap, an old request's completion must not clear the current request's pending/error state: correlate callbacks with the current request or enforce serialization. Do not show a cancellation caused by a newer search as an actionable failure.

When default HTMX indicator styles are disabled under the [deployment policy](deployment-security.md), include your own shared CSS:

```css
@layer components.feedback {
  .htmx-indicator { visibility: hidden; }
  .htmx-request .htmx-indicator,
  .htmx-request.htmx-indicator { visibility: visible; }
}
```

This keeps indicator geometry stable. The indicator appears when its own element or an ancestor carries `htmx-request`; verify the feature's actual indicator selector. Prefer a persistent dedicated live region for important result announcements, and check those announcements with assistive technology. A visually appearing spinner or marker alone does not prove an announcement occurred.

See [quality.md](quality.md) for acceptance checks and [deployment-security.md](deployment-security.md) for an external-module-friendly HTMX configuration. The local example markup is an integration pattern: it still needs the real route and operation-specific error/pending event module before shipping.

Use event delegation or idempotent initialization for swapped controls. A module executed at initial page load will not automatically initialize later fragments. Avoid embedding a fresh listener script in every response.

Official reference: [HTMX documentation](https://htmx.org/docs/).

## Native dialogs

Use a `dialog` named by its visible heading. Open it with `showModal()`, include a visible close button, preserve Escape behavior, and verify focus returns to the opener. Do not attach click-to-dismiss behavior to the entire dialog without distinguishing content clicks. The starter demonstrates a small module with a normal in-page link as its JavaScript-disabled fallback.

## Web Components

Use a custom element when its explicit interface and lifecycle reduce complexity. Keep ordinary page content outside JavaScript-dependent rendering when possible. Initialize in `connectedCallback`, make reconnection safe, and release listeners, observers, and timers in `disconnectedCallback` as appropriate. Express inputs with attributes/properties and outputs with documented events.

Prefer light DOM for components meant to use the app's shared layered CSS. Shadow DOM isolates internal styling; page selectors will not reach inside it. If isolation is intentional, expose custom properties and parts, and preserve labeling, focus, and form behavior. Do not introduce a component framework or build tooling solely to define a custom element.
