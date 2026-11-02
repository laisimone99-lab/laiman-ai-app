const C = "mio-agente-v2";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(C).then(c => c.addAll(["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "news.json"]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => e.waitUntil(clients.claim()));

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  const ok = u.origin === location.origin || /(^|\.)(esm\.run|jsdelivr\.net)$/.test(u.hostname);
  if (!ok) return; // i pesi del modello li salva WebLLM da solo
  e.respondWith(
    fetch(e.request)
      .then(r => {
        if (r.ok) { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); }
        return r;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
