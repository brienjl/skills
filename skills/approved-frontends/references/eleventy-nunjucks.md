# Eleventy and Nunjucks static sites

Use Eleventy with Nunjucks when a site benefits from shared layouts, reusable markup, Markdown content, or content collections. This is the preferred static-site workflow. The generated output is ordinary HTML, CSS, and JavaScript; visitors do not need a running Eleventy process or an API to render a page.

## Project shape

```text
package.json
package-lock.json
eleventy.config.cjs
netlify.toml                 when Netlify configuration is useful
src/
  _includes/
    base.njk
    header.njk
    footer.njk
    article.njk              when publishing articles
  _data/                     shared site data when needed
  index.njk
  style.css                  shared layered CSS
  assets/                    browser-ready modules, images, fonts
  blog/                      Markdown plus blog.json when needed
  fragments/                 optional prebuilt fragment entry templates
netlify/functions/           optional live features, outside src/public
public/                      generated deploy output
```

Do not create unused directories. Existing `.eleventy.js` CommonJS configuration is acceptable. For a new CommonJS config, `.cjs` makes its module format explicit; function `.mjs` files can coexist without changing package-wide module semantics. Choose a supported stable Eleventy release appropriate to the project and preserve its lockfile rather than copying the archived version ranges mechanically.

## Minimal configuration

The following is a configuration recipe, not a second bundled project. Use the plain starter's CSS and modules where useful, placing them at the paths configured below.

```js
// eleventy.config.cjs
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: true });

  return {
    dir: { input: "src", output: "public", includes: "_includes" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
```

Install Eleventy with npm for a new site, then provide npm scripts equivalent to `"start": "eleventy --serve"` and `"build": "eleventy"`. No Vite, Sass compiler, or browser bundle is required. Add `/public/` and `/node_modules/` to the project's ignore rules when generated output is not intentionally committed. Keep `package-lock.json` for reproducible installs.

Image optimization, generated-HTML checks, and optional JavaScript type checking are acceptable build/development tools. See [quality.md](quality.md) for a proportional npm/CI workflow. Browser assets do not need transpilation or bundling to benefit from these checks.

Official references: [configuration and module formats](https://www.11ty.dev/docs/config/), [asset passthrough](https://www.11ty.dev/docs/copy/), and [Nunjucks options](https://www.11ty.dev/docs/languages/nunjucks/).

## Template ownership

`base.njk` owns the document, head metadata, shared header/footer, and the one primary `main` landmark. A page uses front matter such as `layout: base.njk` and `title: Home`, followed by its content only. Do not repeat `body` or `main` inside that page. Place reusable regions in includes; use macros for repeated markup with explicit parameters when that reduces duplication.

### Local base/page recipe

These complete minimal templates can be maintained without the archived projects. Create all referenced includes and copied assets; adapt names to the site.

```njk
{# src/_includes/base.njk #}
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ title }}</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <a href="#main">Skip to content</a>
  {% include "header.njk" %}
  <main id="main" tabindex="-1">{{ content | safe }}</main>
  {% include "footer.njk" %}
</body>
</html>
```

```njk
{# src/_includes/header.njk #}
<header class="container">
  <nav aria-label="Main"><a href="/">Home</a> <a href="/blog/">Articles</a></nav>
</header>
```

```njk
{# src/_includes/footer.njk #}
<footer class="site-footer container"><p>Field Notes</p></footer>
```

```njk
---
layout: base.njk
title: Home
---
<section class="container stack">
  <h1>{{ title }}</h1>
  <p>Useful content is available in the generated HTML.</p>
</section>
```

The last block is `src/index.njk`; its front matter must begin the file. Create the `/blog/` destination when using that header. Add descriptions, canonical URLs, sharing metadata, and feeds/sitemaps when the publishing task needs them, using explicit site data rather than placeholder domains.

Escape scalar template values, including title, descriptions, image alt text, and runtime data. `{{ content | safe }}` can insert trusted author-generated page/Markdown HTML into a layout; do not apply `safe` to user input or unsanitized remote content. Build-time Nunjucks options do not configure a separate runtime Nunjucks environment in a function.

For posts, directory data can set `"layout": "article.njk"` and `"tags": "post"`. Render collections through a shared article-snippet include. Choose whether Markdown is processed with Nunjucks based on the content; disable that preprocessing for content with literal conflicting template delimiters. Build-time content should not require a per-visitor fetch.

```njk
{# src/_includes/article-snippet.njk; included inside a listing's ul #}
<li>
  <article class="stack">
    <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
    {% if post.data.description %}<p>{{ post.data.description }}</p>{% endif %}
  </article>
</li>
```

```njk
---
layout: base.njk
title: Articles
---
<section class="container stack">
  <h1>{{ title }}</h1>
  <ul>
    {% for post in collections.post | default([]) | reverse %}
      {% include "article-snippet.njk" %}
    {% else %}
      <li>No articles yet.</li>
    {% endfor %}
  </ul>
</section>
```

The listing above is `src/blog.njk`. An `article.njk` layout can inherit `base.njk` through front matter and contain `<article><h1>{{ title }}</h1>{{ content | safe }}</article>`. Use directory data in `src/blog/blog.json` to assign that layout and the `post` tag to Markdown posts. Add optional figures only when the post has image data and a deliberate alt-text policy; do not emit empty image URLs.

## HTMX: two ways to supply a fragment

**Prebuilt content:** Eleventy emits a fragment at a known URL. Use an explicit permalink and `layout: false`, especially if an ancestor directory supplies a layout. A fragment can render a Nunjucks include; `_includes` files themselves are not public endpoints.

```njk
---
layout: false
permalink: /fragments/project-list.html
eleventyExcludeFromCollections: true
---
{% include "project-list.njk" %}
```

Create that include as part of the feature. Keep `<div id="project-results" aria-live="polite">` in the containing page, and configure `hx-target="#project-results"` and `hx-swap="innerHTML"` on the requesting control. Return only its contents so the announcement region survives updates. Provide an ordinary link to a complete projects page as the fallback. Do not serve the fragment as the ordinary page destination if it lacks a complete page. Static fragments change on rebuild; query parameters alone do not make them perform a live search.

**Live content:** a [Netlify Function](netlify-functions.md) returns the HTML for a bounded feature. The static page still contains its shell, available content, and useful unavailable/error state. Eleventy builds once; it does not render Nunjucks automatically inside a function at request time. If a function needs Nunjucks, add it as a direct runtime dependency and package the required templates, or use a small escaped HTML response when templating would add unnecessary machinery.

HTMX's [HTML response model](https://htmx.org/docs/) fits both paths; it requires an HTTP endpoint, not a particular frontend framework.

## Content cases

Define an explicit date/timezone policy; avoid build-host-dependent formatting. Test date-only posts near timezone boundaries. Handle absent optional images/alt data and empty collections. Emit balanced article/heading/link markup and use actual destinations rather than empty links or placeholder image services.

## Verification

Run the site's npm build. Inspect `public/index.html`, an article and collection page when present, and copied CSS/JavaScript. Check that templates resolve, document landmarks are not nested, URLs work from nested pages, and fragments have no shell. Serve the generated site and check browser behavior. A successful build does not prove runtime functions work; verify them separately through the Netlify setup when used.
