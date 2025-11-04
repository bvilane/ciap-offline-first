// frontend/src/lib/api.jsx
// Central API helpers using Vite envs (no process.env)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

/** Read ?community= from URL, else fall back to VITE_COMMUNITY, else Acornhoek */
export function getCommunityFromUrl() {
  const url = new URL(window.location.href);
  return (
    url.searchParams.get('community') ||
    import.meta.env.VITE_COMMUNITY ||
    'Acornhoek'
  );
}

/** Write ?community= to URL without reloading */
export function setCommunityInUrl(slug) {
  const url = new URL(window.location.href);
  if (slug) {
    url.searchParams.set('community', slug);
  } else {
    url.searchParams.delete('community');
  }
  window.history.replaceState({}, '', url.toString());
}

/**
 * Fetch and indicate if response likely came from cache (when SW is active).
 * We look up in a runtime cache; if there was a match and the browser is offline,
 * we mark `offline:true` to let the UI badge cached items.
 */
async function fetchWithOfflineHint(input, init) {
  let servedFromCache = false;

  try {
    if ('caches' in window) {
      const cache = await caches.open('ciap-runtime');
      const match = await cache.match(input);
      servedFromCache = Boolean(match);
    }
  } catch {
    // non-fatal
  }

  const res = await fetch(input, init);
  // Throw on non-2xx so callers can handle gracefully
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json().catch(() => ({}));

  return { data, offline: servedFromCache && !navigator.onLine };
}

/** List items by type (notices|jobs|skills) with simple filters */
export async function list(
  type,
  { page = 1, q = '', community = getCommunityFromUrl(), status = 'approved' } = {}
) {
  const params = new URLSearchParams({ page, q, community, status });
  return fetchWithOfflineHint(`${API_URL}/${type}?${params.toString()}`);
}

/** Get all communities */
export async function listCommunities() {
  const res = await fetch(`${API_URL}/communities`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Public submission (jobs/notices/skills) */
export async function submit(type, payload) {
  const res = await fetch(`${API_URL}/submit/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Admin approval endpoint */
export async function adminApprove(type, id) {
  const res = await fetch(`${API_URL}/admin/approve/${type}/${id}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export { API_URL };
