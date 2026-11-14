/*
  SW.JS -- service worker (Langkah 1 HANDOFF)
  Strategi: NETWORK-FIRST untuk file lokal se-origin. Online -> selalu ambil
  versi terbaru (jadi update gak nyangkut), sekaligus disimpan ke cache.
  Cache HANYA dipakai kalau fetch gagal (offline) atau server error 5xx.
  Jaringan lambat TIDAK lagi menyebabkan file lama dipakai.
  Request lintas-origin (Supabase, CDN, Google Fonts) SENGAJA gak disentuh.

  Naikkan CACHE_VERSION kalau daftar PRECACHE berubah (file baru/dihapus).
  Daftar PRECACHE harus cocok dengan <link>/<script> di index.html (gaya.css, kerangka.js, aplikasi.js).
*/
const CACHE_PREFIX = "animasi2d-static-";
const CACHE_VERSION = "v115";
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;

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

// NETWORK-FIRST murni: selama jaringan MASIH menjawab, jawaban server yang dipakai
// (tidak ada timeout -> HP dengan sinyal lambat tidak lagi diberi file lama,
// jadi semua HP dapat versi yang SAMA). Cache cuma dipakai kalau fetch GAGAL
// (offline / error jaringan) atau server membalas error 5xx.
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    // "no-cache" = selalu validasi ke server, jangan percaya cache HTTP browser
    // (GitHub Pages memberi max-age=600). Berlaku juga untuk index.html (navigasi),
    // supaya HTML dan JS/CSS-nya selalu sepasang dan terbaru.
    const req = new Request(request, { cache: "no-cache" });
    const res = await fetch(req);
    if (res && res.status >= 500) throw new Error("server " + res.status);
    if (res && res.status === 200 && res.type === "basic") {
      cache.put(request, res.clone()).catch(() => {});
    }
    return res;
  } catch (err) {
    // Fallback offline: cocokkan persis dulu, baru abaikan query (?v=...)
    const cached = (await cache.match(request)) ||
                   (await cache.match(request, { ignoreSearch: true }));
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
