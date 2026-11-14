/*
  SW.JS -- service worker (Langkah 1 HANDOFF)
  Strategi: NETWORK-FIRST untuk file lokal se-origin. Online -> selalu ambil
  versi terbaru (jadi update gak nyangkut), sekaligus disimpan ke cache.
  Offline / jaringan lambat (>4 dtk) -> pakai salinan di cache.
  Request lintas-origin (Supabase, CDN, Google Fonts) SENGAJA gak disentuh.

  Naikkan CACHE_VERSION kalau daftar PRECACHE berubah (file baru/dihapus).
  Daftar PRECACHE harus cocok dengan <link>/<script> di index.html (gaya.css, kerangka.js, aplikasi.js).
*/
const CACHE_PREFIX = "animasi2d-static-";
const CACHE_VERSION = "v113";
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;
const NETWORK_TIMEOUT_MS = 4000;

const PRECACHE = [
  "./",
  "index.html",

  // ===== 3 FILE UTAMA (hasil gabungan; isi & urutannya sama dengan versi 500+ file) =====
  "gaya.css",
  "kerangka.js",
  "aplikasi.js",

  // ===== FILE PENDUKUNG (hanya di sw.js, tidak dimuat lewat index.html) =====
  "manifest.json",
  "icon-192.png",
  "logo.png",
  "apple-touch-icon.png"
];
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(PRECACHE.map((url) =>
      cache.add(new Request(url, { cache: "reload" })).catch(() => {})
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter((n) => n.startsWith(CACHE_PREFIX) && n !== CACHE_NAME)
      .map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

function fetchWithTimeout(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    fetch(request).then(
      (res) => { clearTimeout(timer); resolve(res); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch: true });
  try {
    // NETWORK-FIRST untuk SEMUA file (dulu file non-halaman langsung dijawab dari cache,
    // jadi file JS/CSS yang diganti tidak pernah ikut terbarui walau di-refresh).
    // "no-cache" = selalu tanya server dulu (tidak mau jawaban basi dari cache HTTP browser).
    const req = request.mode === "navigate" ? request : new Request(request, { cache: "no-cache" });
    // Timeout cuma dipakai kalau ADA salinan cache buat jatuh balik.
    const res = cached ? await fetchWithTimeout(req, NETWORK_TIMEOUT_MS) : await fetch(req);
    if (res && res.status === 200 && res.type === "basic") {
      cache.put(request, res.clone()).catch(() => {});
    }
    return res;
  } catch (err) {
    if (cached) return cached;
    if (request.mode === "navigate") {
      const index = (await cache.match("index.html")) || (await cache.match("./"));
      if (index) return index;
    }
    throw err;
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(networkFirst(request));
});
