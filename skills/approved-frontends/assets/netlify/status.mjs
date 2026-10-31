// Copy to netlify/functions/status.mjs for a read-only response-format example.
// This checks endpoint reachability, not the health of other services.
export default async function status(request) {
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'Vary': 'HX-Request',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { ...headers, Allow: 'GET, HEAD' }
    });
  }

  // Constant markup; escape or sanitize any future dynamic data as appropriate.
  const content = '<p>The endpoint is available.</p>';
  const enhanced = request.headers.get('HX-Request') === 'true';
  const html = enhanced ? content : `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Site status</title>
</head>
<body>
  <main>
    <h1>Site status</h1>
    <div id="site-status">${content}</div>
    <p><a href="/">Home</a></p>
  </main>
</body>
</html>`;

  return new Response(request.method === 'HEAD' ? null : html, { headers });
}
