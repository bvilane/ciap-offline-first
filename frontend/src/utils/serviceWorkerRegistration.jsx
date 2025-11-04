// Minimal SW registration for Vite builds.
// index.jsx decides whether to call register() (prod) or unregister() (dev).

const SW_URL = '/service-worker.js'; // served from /public in Vite

export function register() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(SW_URL)
      .then((registration) => {
        // Optional: listen for updates
        registration.onupdatefound = () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.onstatechange = () => {
            // installed -> new content available on next reload (you can toast here)
          };
        };
      })
      .catch((err) => {
        // Keep console noise low in dev
        console.error('Service worker registration failed:', err);
      });
  });
}

export function unregister() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
}
