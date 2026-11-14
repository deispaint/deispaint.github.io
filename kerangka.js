/*
  kerangka.js -- kerangka awal (pemeriksa, pencatat error, util, papan event, tema, mode app)
  Hasil gabungan 10 file asli, urutannya SAMA PERSIS dengan urutan <script> di index.html lama.
  Isi tiap file TIDAK diubah; hanya ditambah penanda "FILE ASAL" di atasnya supaya gampang dicari.
  Cari nama file asal (misal: FILE ASAL: canvas.js) untuk lompat ke bagiannya.
*/

/* ======================================================================
   FILE ASAL: healthcheck.js   (231 baris)   [1/10]
   ====================================================================== */
/*
  healthcheck.js
  TUGAS     : pemeriksa kesehatan app saat dibuka: cari <script> yang gagal dimuat dan objek utama yang tidak ada, tampilkan peringatan kecil
  BAGIAN DARI: mandiri (objek HealthCheck)
  DIPANGGIL OLEH: dimuat sendiri (jalan otomatis saat app dibuka); HealthCheck.report() dari console
  MEMANGGIL : daftar objek utama ↔ nama file (tiap fase yang ganti nama file harus memperbarui daftar ini)
  EVENT     : tidak ada
  KALAU RUSAK: Kotak peringatan "file gagal dimuat" muncul: nama file di index.html / sw.js tidak ada di folder; peringatan palsu: daftar nama di healthcheck.js belum diperbarui
*/
/*
  HEALTHCHECK.JS
  --------------
  Pemeriksa kesehatan app. Tidak mengubah perilaku fitur apa pun.
  Tiap app dibuka, cek:
   1. Apakah ada file <script> di index.html yang gagal dimuat (404 dll)
   2. Apakah objek utama (MediaEngine, SceneRec, dst) benar-benar ada
  Kalau ada masalah, muncul kotak peringatan kecil di bawah layar
  (ketuk untuk tutup). Detail juga ada di console: HealthCheck.report()

  WAJIB dimuat PALING AWAL di index.html (sebelum util.js), supaya
  bisa menangkap error load file yang datang sesudahnya.

  Kalau nambah objek utama baru: tambah satu baris di daftar OBJEK.
*/
const HealthCheck = (function () {
  const failed = [];   // file yang gagal dimuat
  const missing = [];  // objek utama yang tidak ada
  let ran = false;

  function baseName(url) {
    try { return String(url).split("?")[0].split("#")[0].split("/").pop() || String(url); }
    catch (e) { return String(url); }
  }

  function addFailed(url) {
    // Abaikan file luar (CDN, Google Fonts): gagalnya wajar kalau offline
    try { if (new URL(url, location.href).origin !== location.origin) return; } catch (e) {}
    const n = baseName(url);
    if (failed.indexOf(n) === -1) failed.push(n);
  }

  // Tangkap error load <script>/<link> (fase capture, karena error resource tidak bubbling)
  window.addEventListener("error", function (e) {
    const t = e && e.target;
    if (!t || t === window || !t.tagName) return;
    if (t.tagName === "SCRIPT" && t.src) addFailed(t.src);
    else if (t.tagName === "LINK" && t.href && /stylesheet/i.test(t.rel || "")) addFailed(t.href);
  }, true);

  // [nama objek, file asalnya, pengecek typeof]
  const OBJEK = [
    ["AppMode", "appmode.js", function () { return typeof AppMode; }],
    ["BrushCursorEngine", "brushcursor.js", function () { return typeof BrushCursorEngine; }],
    ["BrushLibraryEngine", "brushlibrary.js", function () { return typeof BrushLibraryEngine; }],
    ["BrushSizeEngine", "brushsize.js", function () { return typeof BrushSizeEngine; }],
    ["CanvasEngine", "canvas.js", function () { return typeof CanvasEngine; }],
    ["ColorPanel", "colorpanel.js", function () { return typeof ColorPanel; }],
    ["CustomBrushEngine", "custombrush.js", function () { return typeof CustomBrushEngine; }],
    ["DemoShare", "demoshare.js", function () { return typeof DemoShare; }],
    ["EditorPage", "editor.js", function () { return typeof EditorPage; }],
    ["EventBus", "eventbus.js", function () { return typeof EventBus; }],
    ["ExportEngine", "export.js", function () { return typeof ExportEngine; }],
    ["EyedropperEngine", "eyedropper.js", function () { return typeof EyedropperEngine; }],
    ["FloatingMenu", "floatingmenu.js", function () { return typeof FloatingMenu; }],
    ["Gallery", "galeri.js", function () { return typeof Gallery; }],
    ["Modul", "modul.js", function () { return typeof Modul; }],
    ["Trace", "trace.js", function () { return typeof Trace; }],
    ["GestureAxis", "gestureaxis.js", function () { return typeof GestureAxis; }],
    ["GradientEngine", "gradient.js", function () { return typeof GradientEngine; }],
    ["HistoryEngine", "history.js", function () { return typeof HistoryEngine; }],
    ["HistoryPanel", "history-panel.js", function () { return typeof HistoryPanel; }],
    ["ImagePlaceEngine", "image-place.js", function () { return typeof ImagePlaceEngine; }],
    ["LassoEngine", "lasso.js", function () { return typeof LassoEngine; }],
    ["LayerPanel", "layer.js", function () { return typeof LayerPanel; }],
    ["MarchingAntsEngine", "paintlock-ants.js", function () { return typeof MarchingAntsEngine; }],
    ["MediaEngine", "media.js", function () { return typeof MediaEngine; }],
    ["MeshEngine", "mesh.js", function () { return typeof MeshEngine; }],
    ["MeshPanel", "meshpanel.js", function () { return typeof MeshPanel; }],
    ["MeshTransformEngine", "meshtransform.js", function () { return typeof MeshTransformEngine; }],
    ["MeshTransformPanel", "meshtransformpanel.js", function () { return typeof MeshTransformPanel; }],
    ["MeshPartEngine", "meshpart.js", function () { return typeof MeshPartEngine; }],
    ["PaintLockEngine", "paintlock.js", function () { return typeof PaintLockEngine; }],
    ["PatternEngine", "pattern.js", function () { return typeof PatternEngine; }],
    ["ProjectBackup", "backup.js", function () { return typeof ProjectBackup; }],
    ["ProjectStore", "project.js", function () { return typeof ProjectStore; }],
    ["RulerEngine", "ruler.js", function () { return typeof RulerEngine; }],
    ["SceneCam", "scenecam.js", function () { return typeof SceneCam; }],
    ["SceneDrawer", "scenedrawer.js", function () { return typeof SceneDrawer; }],
    ["SceneEdit", "sceneedit.js", function () { return typeof SceneEdit; }],
    ["SceneExport", "sceneexport.js", function () { return typeof SceneExport; }],
    ["SceneLine", "sceneline.js", function () { return typeof SceneLine; }],
    ["ScenePix", "scenepix.js", function () { return typeof ScenePix; }],
    ["ScenePlay", "sceneplay.js", function () { return typeof ScenePlay; }],
    ["SceneRec", "scenerec.js", function () { return typeof SceneRec; }],
    ["SceneSmooth", "scenesmooth.js", function () { return typeof SceneSmooth; }],
    ["SceneThumb", "scenethumb.js", function () { return typeof SceneThumb; }],
    ["SeqCarry", "seqcarry.js", function () { return typeof SeqCarry; }],
    ["SeqWarp", "seqwarp.js", function () { return typeof SeqWarp; }],
    ["Sequence", "sequence.js", function () { return typeof Sequence; }],
    ["ShapeEngine", "shape.js", function () { return typeof ShapeEngine; }],
    ["SnapEngine", "snap.js", function () { return typeof SnapEngine; }],
    ["Splash", "splash.js", function () { return typeof Splash; }],
    ["StabilizerEngine", "stabilizer.js", function () { return typeof StabilizerEngine; }],
    ["StorageGuard", "storage.js", function () { return typeof StorageGuard; }],
    ["TextEngine", "text.js", function () { return typeof TextEngine; }],
    ["ThemeManager", "thememanager.js", function () { return typeof ThemeManager; }],
    ["Timeline", "timeline.js", function () { return typeof Timeline; }],
    ["Toolbar", "toolbar.js", function () { return typeof Toolbar; }],
    ["ToolbarMode", "toolbarmode.js", function () { return typeof ToolbarMode; }],
    ["TopBar", "topbar.js", function () { return typeof TopBar; }],
    ["UIVisibility", "uivisibility.js", function () { return typeof UIVisibility; }],
    ["Util", "util.js", function () { return typeof Util; }],
    ["WatercolorBrush", "watercolorbrush.js", function () { return typeof WatercolorBrush; }],
    ["ZoomEngine", "zoom.js", function () { return typeof ZoomEngine; }],
    ["ZoomResetButton", "zoom-reset.js", function () { return typeof ZoomResetButton; }]
  ];

  function scanResources() {
    try {
      const list = performance.getEntriesByType("resource");
      for (let i = 0; i < list.length; i++) {
        const r = list[i];
        if (r.responseStatus >= 400 && /\.(js|css)(\?|$)/i.test(r.name)) addFailed(r.name);
      }
    } catch (e) {}
  }

  function run() {
    ran = true;
    missing.length = 0;
    scanResources();
       // Pemasangan bertahap: file yang belum ditulis di index.html tidak dilaporkan
    const dimuat = {};
    Array.prototype.forEach.call(document.scripts, function (s) { if (s.src) dimuat[baseName(s.src)] = true; });
    for (let i = 0; i < OBJEK.length; i++) {
      const o = OBJEK[i];
      if (!dimuat[o[1]]) continue;
      let t = "undefined";
      try { t = o[2](); } catch (e) {}
      // Kalau filenya sudah dilaporkan hilang, objeknya tidak usah dilaporkan lagi
      if (t === "undefined" && failed.indexOf(o[1]) === -1) missing.push(o[0] + " (dari " + o[1] + ")");
    }
    const msgs = [];
    failed.forEach(function (f) { msgs.push("File hilang: " + f); });
    missing.forEach(function (m) { msgs.push("Objek tidak ada: " + m); });
    if (msgs.length) {
      console.warn("[HealthCheck]", msgs);
      show(msgs);
    } else {
      console.log("[HealthCheck] OK -- semua file & objek utama termuat");
    }
    return msgs;
  }

  function show(msgs) {
    try {
      let box = document.getElementById("healthcheck-box");
      if (!box) {
        box = document.createElement("div");
        box.id = "healthcheck-box";
        box.style.cssText =
          "position:fixed;left:8px;right:8px;bottom:8px;z-index:99999;" +
          "background:#7a1f1f;color:#fff;font:12px/1.4 sans-serif;" +
          "padding:8px 10px;border-radius:8px;max-height:30vh;overflow:auto;" +
          "box-shadow:0 2px 8px rgba(0,0,0,.4);";
        box.addEventListener("click", function () { box.remove(); });
        document.body.appendChild(box);
      }
      box.textContent = "";
      const head = document.createElement("div");
      head.style.fontWeight = "bold";
      head.textContent = "Peringatan app (ketuk untuk tutup)";
      box.appendChild(head);
      msgs.forEach(function (m) {
        const d = document.createElement("div");
        d.textContent = m;
        box.appendChild(d);
      });
    } catch (e) {}
  }

    // Cocokkan daftar file index.html vs PRECACHE di sw.js
  function namaLokal(u) {
    u = String(u).split("?")[0].split("#")[0];
    if (/^(https?:)?\/\/|^data:/i.test(u)) return null;
    u = u.split("/").pop();
    return /\.(js|css)$/i.test(u) ? u : null;
  }

  function cekDaftarSw(base) {
    if (!window.fetch) return;
    Promise.all([
      fetch("index.html", { cache: "no-store" }).then(function (r) { return r.text(); }),
      fetch("sw.js", { cache: "no-store" }).then(function (r) { return r.text(); })
    ]).then(function (hasil) {
      const idx = hasil[0], sw = hasil[1];
      const a = [], b = [];
      let m, n;
      const re = /<(?:script|link)\b[^>]*?(?:src|href)\s*=\s*["']([^"']+)["']/gi;
      while ((m = re.exec(idx))) { n = namaLokal(m[1]); if (n && a.indexOf(n) < 0) a.push(n); }
      const i0 = sw.indexOf("PRECACHE");
      const i1 = sw.indexOf("];", i0);
      const re2 = /"([^"]+)"/g;
      const blok = sw.slice(i0, i1);
      while ((m = re2.exec(blok))) { n = namaLokal(m[1]); if (n && b.indexOf(n) < 0) b.push(n); }
      // file yang memang sengaja hanya ada di sw.js
      const abaikan = ["gif.worker.js", "sw.js"];
      const msgs = base.slice();
      a.forEach(function (f) {
        if (b.indexOf(f) < 0) msgs.push("Ada di index.html tapi belum di sw.js: " + f);
      });
      b.forEach(function (f) {
        if (a.indexOf(f) < 0 && abaikan.indexOf(f) < 0) msgs.push("Ada di sw.js tapi tidak di index.html: " + f);
      });
      if (msgs.length > base.length) {
        console.warn("[HealthCheck] daftar file index vs sw tidak cocok", msgs);
        show(msgs);
      }
    }).catch(function () {});
  }

  window.addEventListener("load", function () {
    // tunggu sebentar supaya script yang dimuat belakangan sudah selesai
    setTimeout(function () { cekDaftarSw(run()); }, 500);
  });

  return {
    run: run,
    report: function () { return { failed: failed.slice(), missing: missing.slice(), ran: ran }; }
  };
})();

/* ======================================================================
   FILE ASAL: errlog.js   (151 baris)   [2/10]
   ====================================================================== */
/*
  errlog.js
  TUGAS     : pencatat error global: tangkap error tak tertangani, simpan 50 catatan terakhir di localStorage, tampilkan toast dan panel catatan (termasuk Trace dan Modul)
  BAGIAN DARI: mandiri (objek ErrLog)
  DIPANGGIL OLEH: semua file (ErrLog.note menggantikan catch kosong), modul.js (note)
  MEMANGGIL : Trace.text, Modul.konflik (kalau sudah dimuat), localStorage
  EVENT     : window error, unhandledrejection
  KALAU RUSAK: Error tidak tercatat / toast error tidak muncul: errlog.js harus dimuat kedua (setelah healthcheck.js, sebelum modul.js)
*/
/*
  ERRLOG.JS
  ---------
  Pencatat error global. Tidak mengubah perilaku fitur apa pun.
   - Error tak tertangani (window error + promise ditolak) -> dicatat
     + muncul toast kecil di atas layar. Ketuk toast -> lihat catatan.
   - ErrLog.note("nama-tempat", err) -> dicatat DIAM-DIAM (tanpa toast).
     Dipakai untuk mengganti `catch (err) {}` kosong, supaya error
     yang dulu hilang sekarang punya jejak.
  Catatan disimpan di localStorage (maks 50 terakhir), tahan app ditutup.

  Panel catatan juga menampilkan Trace.text() (keputusan terakhir) dan
  Modul.konflik() (fungsi ganda) kalau trace.js / modul.js sudah dimuat.

  WAJIB dimuat awal di index.html (setelah healthcheck.js, sebelum util.js).
*/
const ErrLog = (function () {
  const KEY = "errlog-v1";
  const MAX = 50;
  let mem = [];
  let lastToast = 0;

  function load() {
    try {
      const a = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(a)) mem = a;
    } catch (e) {}
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) {}
  }
  function msgOf(err) {
    try {
      if (err == null) return "(kosong)";
      if (typeof err === "string") return err;
      const m = err.message || String(err);
      return err.name && err.name !== "Error" ? err.name + ": " + m : m;
    } catch (e) { return "(tak terbaca)"; }
  }
  function add(where, err) {
    try {
      const msg = msgOf(err);
      const last = mem[mem.length - 1];
      if (last && last.w === where && last.m === msg) { last.n = (last.n || 1) + 1; last.t = Date.now(); }
      else mem.push({ t: Date.now(), w: String(where), m: msg.slice(0, 300), n: 1 });
      if (mem.length > MAX) mem.splice(0, mem.length - MAX);
      save();
      return msg;
    } catch (e) { return ""; }
  }

  function note(where, err) { add(where, err); }

  function toast(text) {
    try {
      const now = Date.now();
      if (now - lastToast < 3000) return;
      lastToast = now;
      if (!document.body) return;
      let el = document.getElementById("errlog-toast");
      if (el) el.remove();
      el = document.createElement("div");
      el.id = "errlog-toast";
      el.style.cssText =
        "position:fixed;left:8px;right:8px;top:8px;z-index:99998;" +
        "background:#5a3b00;color:#fff;font:12px/1.4 sans-serif;" +
        "padding:8px 10px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.4);";
      el.textContent = "Ada error: " + text.slice(0, 80) + " (ketuk untuk detail)";
      el.addEventListener("click", function () { el.remove(); show(); });
      document.body.appendChild(el);
      setTimeout(function () { if (el.parentNode) el.remove(); }, 5000);
    } catch (e) {}
  }

  function text() {
    return mem.map(function (r) {
      const d = new Date(r.t);
      const hh = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
      return hh + " [" + r.w + "] " + r.m + (r.n > 1 ? " (x" + r.n + ")" : "");
    }).reverse().join("\n") || "(catatan kosong)";
  }

  function show() {
    try {
      const old = document.getElementById("errlog-box");
      if (old) old.remove();
      const box = document.createElement("div");
      box.id = "errlog-box";
      box.style.cssText =
        "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.85);color:#fff;" +
        "font:12px/1.5 monospace;padding:12px;overflow:auto;white-space:pre-wrap;word-break:break-word;";
      const head = document.createElement("div");
      head.style.cssText = "font:bold 13px sans-serif;margin-bottom:8px;";
      head.textContent = "Catatan error (terbaru di atas). Ketuk untuk tutup.";
      const body = document.createElement("div");
      body.textContent = text();
      box.appendChild(head);
      box.appendChild(body);
      // Keputusan terakhir dari Trace (sentuhan/aksi yang diterima atau ditolak + alasannya)
      if (typeof Trace !== "undefined") {
        const h2 = document.createElement("div");
        h2.style.cssText = "font:bold 13px sans-serif;margin:14px 0 8px;";
        h2.textContent = "Keputusan terakhir (Trace, terbaru di atas):";
        const b2 = document.createElement("div");
        b2.textContent = Trace.text();
        box.appendChild(h2);
        box.appendChild(b2);
      }
      if (typeof Modul !== "undefined" && Modul.konflik().length) {
        const h3 = document.createElement("div");
        h3.style.cssText = "font:bold 13px sans-serif;margin:14px 0 8px;";
        h3.textContent = "Fungsi ganda / tertimpa (Modul):";
        const b3 = document.createElement("div");
        b3.textContent = Modul.konflik().join("\n");
        box.appendChild(h3);
        box.appendChild(b3);
      }
      box.addEventListener("click", function () { box.remove(); });
      document.body.appendChild(box);
    } catch (e) {}
  }

  function clear() { mem = []; save(); }

  load();

  window.addEventListener("error", function (e) {
    try {
      if (e && e.target && e.target !== window) return; // error load file: urusan HealthCheck
      const m = e && e.message ? e.message : "";
      if (/ResizeObserver loop/i.test(m)) return;
      const where = e && e.filename ? e.filename.split("/").pop().split("?")[0] + ":" + (e.lineno || 0) : "window";
      toast(add(where, (e && e.error) || m));
    } catch (x) {}
  });

  window.addEventListener("unhandledrejection", function (e) {
    try { toast(add("promise", e && e.reason)); } catch (x) {}
  });

  return { note: note, show: show, text: text, clear: clear, list: function () { return mem.slice(); } };
})();

/* ======================================================================
   FILE ASAL: modul.js   (113 baris)   [3/10]
   ====================================================================== */
/*
  modul.js
  TUGAS     : menempelkan method ke objek induk sambil mencatat kalau ada method yang tertimpa
  BAGIAN DARI: mandiri (kerangka proyek, Fase 0)
  DIPANGGIL OLEH: semua file hasil pecahan (canvas-input.js, stroke-begin.js, zoom-pan.js, dst)
  MEMANGGIL : ErrLog (untuk mencatat), console
  EVENT     : tidak ada
  KALAU RUSAK: pesan "sudah ada di ..., ditimpa oleh ..." di panel catatan error;
               atau method hilang/undefined karena file pecahannya belum dimuat di index.html

  CARA PAKAI (di file hasil pecahan):
    Modul.extend(CanvasEngine, "canvas-tap.js", {
      detectTap(e) { ... },
      sendTap(pos) { ... }
    });

  ATURAN: satu method = satu tempat. Kalau dua file menempelkan method dengan nama
  yang sama ke induk yang sama, yang kedua MENIMPA yang pertama (sama seperti JavaScript
  biasa) tapi kejadiannya langsung tercatat, jadi bug "fungsi ganda" tidak lagi diam-diam.

  PERINGATAN: ini hanya mencatat. Method yang SUDAH ada di dalam objek induk sejak awal
  (ditulis langsung di cangkang) dianggap milik "cangkang".
*/
const Modul = (function () {
  // induk -> { namaMethod: namaFile }
  const pemilik = new WeakMap();
  // induk -> nama tampilan (untuk pesan)
  const namaInduk = new WeakMap();
  const konflik = [];
  const daftarFile = [];

  function labelInduk(induk, label) {
    if (label) { try { namaInduk.set(induk, label); } catch (e) {} return label; }
    return namaInduk.get(induk) || (induk && induk.name) || "induk";
  }

  function catat(pesan) {
    konflik.push(pesan);
    try { console.error("[Modul] " + pesan); } catch (e) {}
    try { if (typeof ErrLog !== "undefined") ErrLog.note("Modul", pesan); } catch (e) {}
  }

  /*
    extend(induk, namaFile, methods [, labelInduk])
    - induk    : objek (atau class) yang mau ditempeli
    - namaFile : nama file pemanggil, mis. "canvas-tap.js" (dipakai di pesan)
    - methods  : objek berisi method/property yang ditempel
    - labelInduk (opsional): nama untuk pesan, mis. "CanvasEngine"
    Mengembalikan induk, supaya bisa dirantai.
  */
  function extend(induk, namaFile, methods, label) {
    if (!induk || (typeof induk !== "object" && typeof induk !== "function")) {
      catat("extend(" + namaFile + "): induk tidak valid (belum dimuat? urutan di index.html salah?)");
      return induk;
    }
    if (typeof namaFile !== "string" || !namaFile) {
      catat("extend: nama file wajib diisi (string), mis. \"canvas-tap.js\"");
      return induk;
    }
    if (!methods || typeof methods !== "object") {
      catat("extend(" + namaFile + "): isi method harus berupa objek");
      return induk;
    }

    const lab = labelInduk(induk, label);
    let peta = pemilik.get(induk);
    if (!peta) { peta = Object.create(null); pemilik.set(induk, peta); }
    if (daftarFile.indexOf(namaFile) < 0) daftarFile.push(namaFile);

    // salin lewat descriptor supaya getter/setter ikut utuh
    const desc = Object.getOwnPropertyDescriptors(methods);
    const nama = Object.keys(desc);
    for (let i = 0; i < nama.length; i++) {
      const k = nama[i];
      const sudahAda = Object.prototype.hasOwnProperty.call(induk, k);
      if (sudahAda) {
        const dulu = peta[k] || "cangkang " + lab;
        catat(k + " sudah ada di " + dulu + ", ditimpa oleh " + namaFile);
      }
      const d = desc[k];
      d.enumerable = true;
      d.configurable = true;
      Object.defineProperty(induk, k, d);
      peta[k] = namaFile;
    }
    return induk;
  }

  // Siapa pemilik method ini? (untuk mencari bug)
  function milik(induk, namaMethod) {
    const peta = pemilik.get(induk);
    return (peta && peta[namaMethod]) || null;
  }

  // Semua method yang ditempel ke satu induk: { method: file }
  function peta(induk) {
    const p = pemilik.get(induk) || {};
    const out = {};
    Object.keys(p).forEach(function (k) { out[k] = p[k]; });
    return out;
  }

  return {
    extend: extend,
    milik: milik,
    peta: peta,
    konflik: function () { return konflik.slice(); },
    files: function () { return daftarFile.slice(); },
    laporan: function () {
      return { file: daftarFile.slice(), konflik: konflik.slice() };
    }
  };
})();

/* ======================================================================
   FILE ASAL: trace.js   (87 baris)   [4/10]
   ====================================================================== */
/*
  trace.js
  TUGAS     : mencatat 50 keputusan terakhir (diterima atau ditolak) beserta alasannya
  BAGIAN DARI: mandiri (kerangka proyek, Fase 0)
  DIPANGGIL OLEH: canvas-input-guard.js, canvas-input.js, zoom-pinch.js, dst (mulai Fase 1)
  MEMANGGIL : tidak ada
  EVENT     : tidak ada
  KALAU RUSAK: catatan keputusan kosong atau tidak muncul di panel catatan error (ErrLog.show)

  CARA PAKAI:
    Trace.deny("canvas-input-guard", "pinch 2 jari aktif");   // sentuhan DITOLAK
    Trace.pass("canvas-input", "diteruskan ke stroke-begin"); // sentuhan DITERIMA
    Trace.text()      -> teks semua keputusan (terbaru di atas)
    Trace.lastDeny()  -> penolakan terakhir { w, m } atau null
    Trace.clear()

  RINGAN: ring buffer 50 slot tetap, tidak membuat string saat mencatat
  (teks baru dirangkai ketika text() dipanggil). Tidak menyimpan ke localStorage.
  Aman dipanggil dari pointermove.
*/
const Trace = (function () {
  const MAX = 50;
  const buf = new Array(MAX);
  let tulis = 0;   // slot berikutnya yang ditulis
  let jumlah = 0;  // total terisi (maks MAX)
  let aktif = true;

  function catat(jenis, siapa, alasan) {
    if (!aktif) return;
    let e = buf[tulis];
    if (!e) { e = buf[tulis] = { t: 0, k: 0, w: "", m: "" }; }
    e.t = Date.now();
    e.k = jenis;
    e.w = siapa;
    e.m = alasan;
    tulis = (tulis + 1) % MAX;
    if (jumlah < MAX) jumlah++;
  }

  function deny(siapa, alasan) { catat(1, String(siapa), alasan == null ? "" : String(alasan)); }
  function pass(siapa, apa) { catat(0, String(siapa), apa == null ? "" : String(apa)); }

  // urutan terlama -> terbaru
  function urut() {
    const out = [];
    const mulai = jumlah < MAX ? 0 : tulis;
    for (let i = 0; i < jumlah; i++) out.push(buf[(mulai + i) % MAX]);
    return out;
  }

  function jam(t) {
    const d = new Date(t);
    const p = function (n, l) { return ("00" + n).slice(-l); };
    return p(d.getHours(), 2) + ":" + p(d.getMinutes(), 2) + ":" + p(d.getSeconds(), 2) + "." + p(d.getMilliseconds(), 3);
  }

  function text() {
    if (!jumlah) return "(belum ada keputusan tercatat)";
    return urut().map(function (e) {
      return jam(e.t) + (e.k ? " DITOLAK oleh " : " diterima oleh ") + e.w + (e.m ? ": " + e.m : "");
    }).reverse().join("\n");
  }

  function lastDeny() {
    const a = urut();
    for (let i = a.length - 1; i >= 0; i--) if (a[i].k) return { w: a[i].w, m: a[i].m, t: a[i].t };
    return null;
  }

  function last() {
    const a = urut();
    if (!a.length) return null;
    const e = a[a.length - 1];
    return { denied: !!e.k, w: e.w, m: e.m, t: e.t };
  }

  return {
    deny: deny,
    pass: pass,
    text: text,
    last: last,
    lastDeny: lastDeny,
    clear: function () { tulis = 0; jumlah = 0; },
    enable: function (v) { aktif = v !== false; },
    count: function () { return jumlah; }
  };
})();

/* ======================================================================
   FILE ASAL: util.js   (60 baris)   [5/10]
   ====================================================================== */
/*
  util.js
  TUGAS     : helper keamanan dasar: escape teks untuk innerHTML (escapeHtml, escapeAttr) dan seragamkan sumber gambar Blob/data URL (srcForSnapshot)
  BAGIAN DARI: mandiri (objek Util)
  DIPANGGIL OLEH: layer-list.js, meshpanel-list.js, colorpanel-palette-ui.js, floatingmenu-html.js, cel-gallery.js, timeline-tracks.js, audiolane-render.js, media-trim.js, media-speed-editor.js (escapeHtml/escapeAttr); mesh-create.js, mesh-warp.js, meshpanel-delete.js, meshpanel-toggle.js, sceneplay-apply-mesh.js (srcForSnapshot)
  MEMANGGIL : tidak ada
  EVENT     : tidak ada
  KALAU RUSAK: Nama layer/palet/audio tampil sebagai kode HTML mentah atau malah dijalankan; gambar mesh tidak muncul: cek Util.escapeHtml / Util.srcForSnapshot. "Util is not defined": util.js harus dimuat paling awal
*/
/*
  UTIL.JS
  -------
  Helper keamanan dasar, dipakai di SELURUH app. File ini WAJIB dimuat
  paling awal di index.html (sebelum project.js dan modul lain), supaya
  Util.escapeHtml/escapeAttr sudah tersedia begitu modul lain jalan.

  Kenapa ini perlu (Langkah 3 HANDOFF, "Keamanan"):
  Banyak tempat di app menaruh data (nama layer, nama palette, nama audio,
  nama mesh, dll) langsung ke dalam `innerHTML`. Kalau nama itu berisi kode
  HTML (mis. dari project yang diimpor, atau dari Demo di Supabase yang
  dibuka orang lain), kode itu ikut DIJALANKAN oleh browser -- ini yang
  disebut XSS (Cross-Site Scripting). Dua fungsi di bawah ini mengubah
  karakter berbahaya (< > & " ') jadi teks biasa yang aman ditampilkan.

  Aturan pakai:
  - Teks BEBAS di antara tag HTML, mis. `<span>${x}</span>`  -> escapeHtml(x)
  - Teks di DALAM atribut HTML, mis. `title="${x}"`          -> escapeAttr(x)
  escapeAttr = escapeHtml + escape tanda kutip tambahan, jadi aman dipakai
  di dalam `"..."` maupun `'...'`.
*/

const Util = {
  escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  escapeAttr(str) {
    return this.escapeHtml(str);
  },

  // KEAMANAN/PERFORMA (Langkah 4 HANDOFF): `sourceSnapshot` Mesh Area bisa
  // berupa Blob (project baru) ATAU data URL string (project lama /
  // hasil impor sebelum Langkah 4). img.src cuma nerima string, jadi
  // helper ini nyeragamin dua-duanya. Kalau hasilnya Blob URL
  // (`isBlobUrl: true`), WAJIB panggil `URL.revokeObjectURL(url)` begitu
  // gambar itu SUDAH GAK DIPAKAI LAGI (mis. di onload/onerror kalau
  // gambarnya sekali pakai) -- kalau lupa, cuma bocor memori kecil
  // (bukan bug fatal), tapi tetap sebaiknya dibersihkan.
  srcForSnapshot(value) {
    if (typeof Blob !== "undefined" && value instanceof Blob) {
      return { url: URL.createObjectURL(value), isBlobUrl: true };
    }
    return { url: value, isBlobUrl: false };
  }
};

/* ======================================================================
   FILE ASAL: eventbus.js   (62 baris)   [6/10]
   ====================================================================== */
/*
  eventbus.js
  TUGAS     : papan pengumuman antar modul: daftar pendengar (on), umumkan kejadian (emit), kosongkan semua pendengar saat keluar Editor (clear)
  BAGIAN DARI: mandiri (objek EventBus)
  DIPANGGIL OLEH: hampir semua modul (±40 file: canvas-*, layer-*, timeline-*, project-*, history-*, scene*, toolbar-*, galeri-*, dst); EventBus.clear dipanggil saat keluar dari Editor
  MEMANGGIL : tidak ada
  EVENT     : semua nama event ada di daftar resmi di bagian bawah file ini dan dipakai lewat on/emit
  KALAU RUSAK: "EventBus is not defined" / panel tidak ikut berubah saat project berubah: eventbus.js belum dimuat atau urutannya setelah file yang memakainya (harus paling awal, setelah trace.js); error "null.addEventListener" setelah balik ke Galeri: EventBus.clear tidak terpanggil
*/
/*
  EVENTS.JS
  ----------
  Ini adalah "papan pengumuman" resmi aplikasi.
  Semua modul (canvas.js, layer.js, mesh.js, dst) berbicara satu sama lain
  LEWAT SINI, bukan dengan memanggil fungsi modul lain secara langsung.

  Kenapa ini penting:
  Supaya tidak ada modul yang "rebutan kontrol" atas modul lain
  (contoh kasus brush terkunci gara-gara layer.js kemarin).

  Cara pakai:
  - Modul yang MENGUBAH data  -> panggil: EventBus.emit('nama:event', data)
  - Modul yang PERLU TAHU     -> daftar dengar: EventBus.on('nama:event', callback)
*/

const EventBus = {
  listeners: {},

  on(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  },

  emit(eventName, payload) {
    if (!this.listeners[eventName]) return;
    this.listeners[eventName].forEach(cb => cb(payload));
  },

  // Dipanggil pas keluar dari Editor (balik ke Gallery). Tanpa ini,
  // listener lama dari sesi Editor sebelumnya (LayerPanel, Timeline,
  // MeshPanel, dst) numpuk terus dan tetap kepanggil walau elemen
  // HTML-nya udah gak ada di layar -> error "null.addEventListener"
  // yang bikin proses berikutnya (misal bikin project baru) berhenti
  // di tengah jalan.
  clear() {
    this.listeners = {};
  }
};

/*
  DAFTAR RESMI EVENT (akan bertambah seiring fitur baru ditambahkan)
  Setiap kali menambah fitur baru yang perlu mengumumkan perubahan,
  daftarkan nama eventnya di sini dulu supaya semua modul tahu event apa saja yang ada.

  - "project:loaded"     -> project selesai dimuat dari IndexedDB
  - "project:changed"    -> ada perubahan apa pun pada project (payload: { type, layerId })
  - "layer:added"        -> layer baru ditambahkan (payload: layerId)
  - "layer:removed"      -> layer dihapus (payload: layerId)
  - "layer:updated"      -> properti layer berubah (payload: { layerId, changes })
*/

/* ======================================================================
   FILE ASAL: thememanager.js   (96 baris)   [7/10]
   ====================================================================== */
/*
  thememanager.js
  TUGAS     : mengganti warna aksen app (12 tema) dan jenis kertas canvas (polos/cat air), simpan pilihan di localStorage
  BAGIAN DARI: mandiri (objek ThemeManager)
  DIPANGGIL OLEH: galeri-dialog-settings.js (THEMES, apply, key, getPaper, applyPaper)
  MEMANGGIL : localStorage, variabel CSS di <html> (--accent dst, data-theme, data-paper)
  EVENT     : DOMContentLoaded (ThemeManager.init jalan sendiri saat halaman siap)
  KALAU RUSAK: Warna aksen tidak berubah / kembali ke biru tiap app dibuka: cek ThemeManager.apply dan localStorage; kertas cat air tidak muncul: cek data-paper dan thememanager.css
*/
/*
  THEMEMANAGER.JS -- FILE BARU, BERDIRI SENDIRI
  ----------------------------------------------
  Ganti warna aksen aplikasi. Sekarang ada 12 tema warna (semuanya warna
  soft). "blue" = tema bawaan di tokens.css; tema lain dipasang lewat
  variabel CSS (--accent dst) langsung di <html>, jadi tidak perlu
  mengubah file CSS lain.

  Preferensi tema disimpan di localStorage, dibaca lagi tiap app dibuka.
*/

const ThemeManager = {
  key: "animasi2d:theme",

  // id, nama, aksen, aksen saat disentuh (hover), aksen tegas (strong)
  THEMES: [
    { id: "blue",   name: "Biru",    accent: "#4aa3e0", hover: "#6bb8ea", strong: "#2f86c9" },
    { id: "pink",   name: "Pink",    accent: "#ff4f8b", hover: "#ff77a5", strong: "#e0356f" },
    { id: "coklat", name: "Coklat",  accent: "#a47c68", hover: "#bb9684", strong: "#8a6552" },
    { id: "krem",   name: "Krem",    accent: "#c8a97e", hover: "#d8bd96", strong: "#ad8e63" },
    { id: "merah",  name: "Merah",   accent: "#d9737a", hover: "#e69097", strong: "#bf5960" },
    { id: "ungu",   name: "Ungu",    accent: "#9b7fd1", hover: "#b19bdf", strong: "#8062b8" },
    { id: "mint",   name: "Mint",    accent: "#5fbf9f", hover: "#82d0b6", strong: "#44a384" },
    { id: "sage",   name: "Hijau",   accent: "#8fae7e", hover: "#a7c098", strong: "#738f64" },
    { id: "peach",  name: "Peach",   accent: "#f0a06a", hover: "#f5b88c", strong: "#d98650" },
    { id: "kuning", name: "Kuning",  accent: "#e0b84f", hover: "#ebcb78", strong: "#c49c35" },
    { id: "teal",   name: "Teal",    accent: "#4fb3b8", hover: "#75c7cb", strong: "#3a979c" },
    { id: "slate",  name: "Abu Biru", accent: "#7d8fa6", hover: "#9aa9bc", strong: "#647690" }
  ],

  _find(id) {
    return this.THEMES.find(t => t.id === id) || this.THEMES[0];
  },

  _rgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + ", " + ((n >> 8) & 255) + ", " + (n & 255) + ", " + a + ")";
  },

  init() {
    let saved = "blue";
    try { saved = localStorage.getItem(this.key) || "blue"; } catch (err) {}
    this.apply(saved);
    this.applyPaper(this.getPaper());
  },

  // Kertas canvas: "plain" (putih polos) atau "watercolor" (tekstur cat air).
  // Cuma tampilan di editor -- gak ikut ke hasil export.
  paperKey: "animasi2d:paper",

  getPaper() {
    try {
      return localStorage.getItem(this.paperKey) === "watercolor" ? "watercolor" : "plain";
    } catch (err) {
      return "plain";
    }
  },

  applyPaper(paper) {
    const value = paper === "watercolor" ? "watercolor" : "plain";
    document.documentElement.setAttribute("data-paper", value);
    try { localStorage.setItem(this.paperKey, value); } catch (err) {}
  },

  apply(theme) {
    const t = this._find(theme);
    const root = document.documentElement;
    root.setAttribute("data-theme", t.id);
    if (t.id === "blue") {
      // bawaan: pakai nilai dari tokens.css
      ["--accent", "--accent-hover", "--accent-strong", "--accent-active-bg"].forEach(p => root.style.removeProperty(p));
    } else {
      root.style.setProperty("--accent", t.accent);
      root.style.setProperty("--accent-hover", t.hover);
      root.style.setProperty("--accent-strong", t.strong);
      root.style.setProperty("--accent-active-bg", this._rgba(t.accent, 0.16));
    }
    try { localStorage.setItem(this.key, t.id); } catch (err) {}
  },

  toggle() {
    const current = document.documentElement.getAttribute("data-theme") || "blue";
    this.apply(current === "blue" ? "pink" : "blue");
  }
};

document.addEventListener("DOMContentLoaded", () => ThemeManager.init());

/* ======================================================================
   FILE ASAL: toolbarmode.js   (20 baris)   [8/10]
   ====================================================================== */
/*
  toolbarmode.js
  TUGAS     : menyimpan dan membaca pilihan mode Toolbar (docked/mengambang) di localStorage
  BAGIAN DARI: mandiri (objek ToolbarMode)
  DIPANGGIL OLEH: topbar-init.js, toolbar-render.js (get), galeri-dialog-settings.js (get, set)
  MEMANGGIL : localStorage
  EVENT     : tidak ada
  KALAU RUSAK: Pilihan mode Toolbar tidak tersimpan / Editor tidak terbuka dengan error "ToolbarMode is not defined": toolbarmode.js belum ada di index.html / sw.js
*/
const ToolbarMode = {
  key: "animasi2d:toolbarMode",

  get() {
    return localStorage.getItem(this.key) || "docked";
  },

  set(mode) {
    localStorage.setItem(this.key, mode);
  }
};

/* ======================================================================
   FILE ASAL: appmode.js   (79 baris)   [9/10]
   ====================================================================== */
/*
  appmode.js
  TUGAS     : menentukan tema kerja app (Keyframe atau Scene): baca/simpan pilihan untuk project baru, baca mode sebuah project, pasang penanda mode di halaman Editor
  BAGIAN DARI: mandiri (objek AppMode)
  DIPANGGIL OLEH: galeri-dialog-new.js (getNewProjectMode), galeri-dialog-settings.js (get/setNewProjectMode), galeri-card.js & project-struct.js & sceneexport-info.js & sceneplay-preview.js (getForProject), editor-panels.js & sequence.js & sequence-init.js & scenedrawer.js & scenedrawer-build.js (applyToEditor)
  MEMANGGIL : ProjectStore (getProject), Sequence.init, SceneDrawer.init (hanya di Mode Scene), localStorage
  EVENT     : tidak ada
  KALAU RUSAK: Project Scene dibuka tapi tampil seperti Keyframe (atau sebaliknya) / tidak ada tulisan MODE SCENE: cek AppMode.getForProject dan apakah appmode.js ada di index.html & sw.js
*/
/*
  APPMODE.JS -- FILE BARU, BERDIRI SENDIRI (Mode Scene, Fase A)
  ---------------------------------------------------------------
  Urus 2 "tema kerja" aplikasi: "keyframe" (cara lama, timeline +
  keyframe) dan "scene" (Mode Scene, dibangun bertahap).

  Aturan:
  - Mode disimpan PER PROJECT di field project.appMode.
  - Project lama yang gak punya field ini OTOMATIS dianggap "keyframe"
    (lewat AppMode.getForProject) -- gak ada yang perlu dikonversi.
  - Pengaturan Galeri cuma menentukan mode untuk PROJECT BARU
    (disimpan di localStorage), bukan mengubah project yang sudah ada.
  - File ini gak menyentuh Timeline / Canvas / fitur lama sama sekali.
*/

const AppMode = {
  key: "animasi2d:newProjectMode",

  // Mode yang dipakai saat bikin project baru (dibaca dari Pengaturan Galeri).
  getNewProjectMode() {
    try {
      return localStorage.getItem(this.key) === "scene" ? "scene" : "keyframe";
    } catch (err) {
      return "keyframe";
    }
  },

  setNewProjectMode(mode) {
    const value = mode === "scene" ? "scene" : "keyframe";
    try { localStorage.setItem(this.key, value); } catch (err) {}
  },

  // SELALU baca mode project lewat sini, jangan baca project.appMode langsung.
  getForProject(project) {
    return project && project.appMode === "scene" ? "scene" : "keyframe";
  },

  label(mode) {
    return mode === "scene" ? "Scene" : "Keyframe";
  },

  // Dipanggil EditorPage.render() SETELAH semua modul editor selesai init.
  // Nandain .editor-page dengan data-app-mode (buat hook CSS fase berikutnya)
  // dan nampilin penanda kecil kalau Mode Scene. Penandanya ada di dalam
  // .editor-page, jadi ikut hilang sendiri pas balik ke Galeri.
  applyToEditor() {
    const page = document.querySelector(".editor-page");
    if (!page) return;
    const project = (typeof ProjectStore !== "undefined") ? ProjectStore.getProject() : null;
    const mode = this.getForProject(project);
    page.setAttribute("data-app-mode", mode);

    const old = page.querySelector(".appmode-chip");
    if (old) old.remove();

    if (mode === "scene") {
      const chip = document.createElement("div");
      chip.className = "appmode-chip";
      chip.textContent = "MODE SCENE";
      chip.setAttribute("aria-hidden", "true");
      page.appendChild(chip);
      try {
        if (typeof Sequence !== "undefined") Sequence.init();
        if (typeof SceneDrawer !== "undefined") SceneDrawer.init();
      } catch (err) {
        console.error("Mode Scene gagal dimuat:", err);
      }
    }
  }
};

/* ======================================================================
   FILE ASAL: uivisibility.js   (192 baris)   [10/10]
   ====================================================================== */
/*
  uivisibility.js
  TUGAS     : mengatur sembunyi/munculnya Top Bar dan Toolbar: otomatis saat menggores, manual lewat tombol, dan daftar elemen yang ikut disembunyikan
  BAGIAN DARI: mandiri (objek UIVisibility)
  DIPANGGIL OLEH: editor-panels.js (init, resetTargets, registerTarget, registerToolTarget), canvas-input.js (autoHidden)
  MEMANGGIL : EventBus (dengar)
  EVENT     : canvas:strokeStart, canvas:strokeEnd (didengar)
  KALAU RUSAK: UI tetap tersembunyi setelah menggores / tombol sembunyi tidak bekerja / "UIVisibility is not defined": uivisibility.js belum ada di index.html / sw.js
*/
/*
  UIVISIBILITY.JS
  ---------------
  Helper TERPUSAT buat sembunyi/muncul elemen UI (Toolbar dulu,
  menyusul Top Bar zona Onion/Import/Export) supaya Canvas jadi
  fokus utama pas menggambar. Dibikin satu tempat biar semua modul
  yang butuh perilaku ini (Toolbar, Top Bar, dst) tinggal daftar
  di sini, tidak nulis logic sembunyi-muncul sendiri-sendiri.

  Ada 2 sumber yang bisa bikin elemen tersembunyi -- keduanya
  independen, elemen kesembunyi kalau SALAH SATU aktif:

  1. AUTO   -- otomatis nyembunyi selagi user narik goresan di
               Canvas (event "canvas:strokeStart"), otomatis
               muncul lagi begitu jari diangkat
               ("canvas:strokeEnd").
  2. MANUAL -- tap kosong di Canvas (bukan drag, dideteksi
               canvas.js lewat event "canvas:tap") buat toggle
               sendiri, nempel sampai di-tap ulang.

  Cara pakai dari modul lain (contoh di editor.js):
    UIVisibility.registerTarget(document.getElementById("editor-toolbar"));

  Elemen yang didaftarkan otomatis kedapetan class "ui-hidden" pas
  waktunya sembunyi -- animasinya diatur di CSS masing-masing file
  (lihat .ui-hidden di toolbar.css).
*/

const UIVisibility = {
  autoHidden: false,
  manuallyHidden: false,
  targets: [],

  // GRUP BARU -- KHUSUS tombol "ganti warna" (theme-switch-btn) & tombol
  // "persegi"/selection (.editor-canvas-floating-actions). Sengaja DIPISAH
  // dari `targets`/`manuallyHidden` di atas (yang isinya topbar & toolbar)
  // supaya tombol toggle baru CUMA mempengaruhi 2 elemen ini -- tidak ikut
  // nyembunyikan topbar, toolbar, panel layer, mesh panel, atau
  // mesh-transform panel.
  toolsHidden: false,
  toolTargets: [],

// FIX (bug baru -- ketauan pas audit ulang, ini KEBALIKAN dari fix
  // "_inited" yang tadinya di sini): satu-satunya tempat yang manggil
  // UIVisibility.init() adalah EditorPage.render() (editor.js), dan
  // satu-satunya jalan masuk ke situ selalu lewat Gallery.init()/
  // openProject()/createProject() (galeri.js) -- yang semuanya SELALU
  // manggil EventBus.clear() DULU sebelum masuk Editor. Jadi init() ini
  // gak pernah kepanggil 2x tanpa EventBus-nya ke-clear duluan -- flag
  // "_inited" yang bikin listener cuma didaftar sekali seumur app itu
  // justru SALAH: begitu EventBus.clear() jalan (tiap balik ke Galeri),
  // 3 listener di bawah ikut kehapus, tapi _inited tetap true -- jadi
  // dari project KE-2 dan seterusnya listener ini gak pernah didaftar
  // ulang, auto-hide toolbar pas narik goresan + tap-kosong-buat-toggle
  // diam-diam BERHENTI KERJA buat sisa sesi. Pola yang benar malah
  // kebalikannya -- persis kayak media.js (bindEvents()): listener ini
  // HARUS didaftar ulang tiap init() jalan.
  init() {
    this.renderToggleButton(); // idempotent, aman dipanggil berkali-kali
    EventBus.on("canvas:strokeStart", () => this.setAutoHidden(true));
    EventBus.on("canvas:strokeEnd", () => this.setAutoHidden(false));
    EventBus.on("canvas:tap", () => {
      // Mesh-: ketuk di kanvas untuk MEMILIH bagian, bukan untuk sembunyi/munculkan toolbar.
      if (typeof CanvasEngine !== "undefined" && CanvasEngine.activeTool === "mesh-part") return;
      this.toggleManual();
    });
  },

  // Dipanggil tiap kali halaman Editor di-render ulang (misal ganti
  // project) -- buang referensi elemen LAMA yang sudah gak ada di DOM
  // lagi, biar targets gak numpuk isi elemen basi.
  resetTargets() {
    this.targets = [];
    this.toolTargets = [];
    this.autoHidden = false;
    this.manuallyHidden = false;
    this.toolsHidden = true;
    this.applyAllTool();
    this.syncToggleButton();
  },

  registerTarget(el) {
    if (!el) return;
    this.targets.push(el);
    this.applyTo(el); // biar elemen yang baru daftar belakangan ikut status terkini
  },

  // Daftar khusus buat grup baru (theme-switch-btn & floating-actions).
  registerToolTarget(el) {
    if (!el) return;
    this.toolTargets.push(el);
    this.applyToolTo(el);
  },

  setAutoHidden(state) {
    this.autoHidden = state;
    this.applyAll();
    this.applyAllTool(); // auto-hide selagi narik goresan tetap berlaku buat grup baru juga
  },

  toggleManual() {
    this.manuallyHidden = !this.manuallyHidden;
    this.applyAll();
  },

  // Dipanggil oleh tombol toggle baru -- HANYA mempengaruhi toolTargets
  // (theme-switch-btn & floating-actions).
  toggleTools() {
    this.toolsHidden = !this.toolsHidden;
    this.applyAllTool();
    this.syncToggleButton();
  },

  applyAll() {
    this.targets.forEach(el => this.applyTo(el));
  },

  applyTo(el) {
    const hidden = this.autoHidden || this.manuallyHidden;
    el.classList.toggle("ui-hidden", hidden);
  },

  applyAllTool() {
    this.toolTargets.forEach(el => this.applyToolTo(el));
    document.body.classList.toggle("tools-hidden", this.autoHidden || this.toolsHidden);
  },

  applyToolTo(el) {
    const hidden = this.autoHidden || this.toolsHidden;
    el.classList.toggle("ui-hidden", hidden);
  },

  // FIX (request baru): dulu satu-satunya cara buka/tutup tombol "ganti
  // warna" (theme-switch-btn) & "selection" (floating actions) cuma lewat
  // tap kosong di Canvas (event "canvas:tap") -- gak ada tombol eksplisit
  // buat itu, padahal Timeline sudah punya handle sendiri buat buka/tutup.
  // Sekarang ditambah 1 tombol handle mengambang (mirip timeline-handle),
  // klik = toggleManual() -- persis logic yang sama dipakai tap kosong,
  // cuma sekarang ada tombolnya juga. Tombol INI SENDIRI SENGAJA TIDAK
  // didaftarkan lewat registerTarget() -- sama seperti zoom-reset-btn --
  // supaya dia sendiri tidak ikut hilang pas manuallyHidden aktif.
  renderToggleButton() {
    if (document.getElementById("ui-visibility-toggle-btn")) return;
    const btn = document.createElement("button");
    btn.id = "ui-visibility-toggle-btn";
    btn.setAttribute("aria-label", "Buka/Tutup Tombol Fitur");
    btn.style.cssText = `
      position: fixed;
      right: 16px;
      bottom: 154px;
      width: 34px;
      height: 34px;
      border-radius: 999px;
      background: transparent;
      border: none;
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      z-index: var(--z-fab-low, 150);
      filter: drop-shadow(var(--shadow-float));
      transition: transform 0.15s ease;
    `;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;">
        <path d="M6 9l6 6 6-6"></path>
      </svg>
    `;
    btn.addEventListener("click", () => this.toggleTools());
    document.body.appendChild(btn);
    this.syncToggleButton();
  },

  // Muter arah panah (v jadi ^) biar kelihatan status buka/tutupnya,
  // sama kayak panah collapse di Mesh Panel.
  syncToggleButton() {
    const btn = document.getElementById("ui-visibility-toggle-btn");
    if (!btn) return;
    btn.style.transform = this.toolsHidden ? "rotate(180deg)" : "rotate(0deg)";
  }
};
