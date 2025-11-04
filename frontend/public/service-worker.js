/* global self, caches, fetch */
const APP_SHELL = [
  '/', '/index.html',
  '/assets/', // Vite bundles path prefix
];
const RUNTIME_CACHE = 'ciap-runtime';
const SHELL_CACHE = 'ciap-shell';
const LIMITS = { notices: 50, jobs: 50, skills: 50, directory: 50 };

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => ![SHELL_CACHE, RUNTIME_CACHE].includes(k)).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function sectionFor(url) {
  try {
    const u = new URL(url);
    if (u.pathname.includes('/api/v1/notices')) return 'notices';
    if (u.pathname.includes('/api/v1/jobs')) return 'jobs';
    if (u.pathname.includes('/api/v1/skills')) return 'skills';
    if (u.pathname.includes('/api/v1/directory')) return 'directory';
  } catch {}
  return null;
}

async function trimSection(cache, section) {
  if (!section) return;
  const keys = await cache.keys();
  const list = keys.filter(r => sectionFor(r.url) === section);
  // Simple LRU-ish: keep latest 50 (keys returned newest-last usually; reverse to be safe)
  if (list.length > LIMITS[section]) {
    const excess = list.length - LIMITS[section];
    for (let i = 0; i < excess; i++) await cache.delete(list[i]);
  }
}

self.addEventListener('fetch', (e) => {
  const { request } = e;

  // Only cache GET requests
  if (request.method !== 'GET') return;

  // Stale-while-revalidate for API and assets
  e.respondWith((async () => {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    const fetchPromise = fetch(request)
      .then(async (networkRes) => {
        try {
          await cache.put(request, networkRes.clone());
          await trimSection(cache, sectionFor(request.url));
        } catch {}
        return networkRes;
      })
      .catch(() => cached); // if network fails, fall back to cache

    return cached || fetchPromise;
  })());
});
