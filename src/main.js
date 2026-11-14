import { createHeartScene } from './heart-scene.js';
import { circulationSteps, reviewDomains, reviewFindings, reviewStatuses, scenes, structures } from './content.js';

const root = document.querySelector('#app');
const initialLevel = Number(document.body.dataset.level || 0);
const appUrl = document.body.dataset.level ? '../index.html' : './index.html';
let level = initialLevel;
let isCatalog = document.body.dataset.page === 'catalog';
let isHome = level === 0 && !isCatalog;
let sceneIndex = Math.max(0, Math.min(level - 1, scenes.length - 1));
let currentScene = scenes[sceneIndex];
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const levelUrl = number => `${appUrl}#/level/${number}`;
const homeUrl = `${appUrl}#/home`;
const catalogUrl = `${appUrl}#/catalog`;

function getSavedTheme() {
  try {
    return localStorage.getItem('cardio-theme');
  } catch (error) {
    console.error('Gagal membaca preferensi tema:', error);
    return null;
  }
}

const savedTheme = getSavedTheme();
const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
let activeTheme = savedTheme || systemTheme;
let activeModel = null;
let disposeCurrentScene = () => {};
document.documentElement.dataset.theme = activeTheme;

if (document.body.dataset.level && !window.location.hash) {
  window.location.replace(`${appUrl}#/level/${initialLevel}`);
} else if (document.body.dataset.page === 'catalog' && !window.location.hash) {
  window.location.replace(`${appUrl}#/catalog`);
}

function updateRouteState() {
  const levelMatch = window.location.hash.match(/^#\/level\/(\d+)$/);
  const hasRoute = window.location.hash.length > 0;
  const requestedLevel = levelMatch ? Number(levelMatch[1]) : 0;
  level = requestedLevel >= 1 && requestedLevel <= scenes.length
    ? requestedLevel
    : hasRoute ? 0 : initialLevel;
  isCatalog = window.location.hash === '#/catalog' || (!hasRoute && document.body.dataset.page === 'catalog');
  isHome = level === 0 && !isCatalog;
  sceneIndex = Math.max(0, Math.min(level - 1, scenes.length - 1));
  currentScene = scenes[sceneIndex];
}

function sceneNavigation() {
  const links = (items, offset = 0) => items.map((scene, index) => {
    const number = index + offset + 1;
    return `<a class="chapter-link ${number === level ? 'active' : ''}" href="${levelUrl(number)}" ${number === level ? 'aria-current="page"' : ''}>
      <span class="chapter-number">${String(number).padStart(2, '0')}</span><span>${scene.navTitle}</span>
    </a>`;
  }).join('');

  return `<div class="sidebar-group">
      <h2 class="sidebar-label">MODUL PEMBELAJARAN</h2>
      <div class="chapter-nav" aria-label="Modul pembelajaran">${links(scenes.slice(0, 10))}</div>
    </div>
    <div class="sidebar-group research-group">
      <h2 class="sidebar-label">PERANGKAT PENELITIAN</h2>
      <div class="chapter-nav" aria-label="Perangkat penelitian">${links(scenes.slice(10), 10)}
        <button class="chapter-link upcoming-link" type="button" aria-disabled="true" tabindex="0" title="Fitur dalam pengembangan" aria-label="Log Revisi. Fitur dalam pengembangan">
          <span class="chapter-number">—</span><span>Log Revisi</span><span class="disabled-note">Dalam pengembangan</span>
        </button>
      </div>
    </div>`;
}

function shell() {
  root.innerHTML = `
    <header class="topbar">
      <a class="brand" href="${homeUrl}" aria-label="CardioExplore 3D, beranda"><span class="brand-mark">C<span>+</span></span><span>CardioExplore <b>3D</b><small>Anatomi · Sirkulasi · Validasi</small></span></a>
      <nav class="top-nav" aria-label="Navigasi utama"><a href="${homeUrl}" class="${isHome ? 'selected' : ''}">Beranda</a><a href="${catalogUrl}" class="${isCatalog ? 'selected' : ''}">Eksplorasi</a><a href="${levelUrl(11)}" class="${level === 11 || level === 12 ? 'selected' : ''}">Penelitian</a></nav>
      <div class="top-actions">${level > 0 ? '<button class="icon-button modules-toggle" id="modules-toggle" type="button" aria-controls="module-sidebar" aria-expanded="false">Modul</button>' : ''}<span class="status-pill"><i></i> SIMULASI EDUKASIONAL</span><button class="icon-button" id="theme-toggle" type="button" aria-label="Ganti tema">◐ <span id="theme-label"></span></button></div>
    </header>
    ${isHome ? homeMarkup() : isCatalog ? catalogMarkup() : levelMarkup()}
    <footer class="footer"><a class="brand footer-brand" href="${homeUrl}"><span class="brand-mark">C<span>+</span></span><span>CardioExplore <b>3D</b></span></a><span>Media pembelajaran anatomi · Bukan alat diagnosis</span><a href="${levelUrl(12)}">Ringkasan validasi ↗</a></footer>`;
  bindTheme();
  bindModuleSidebar();
}

function bindModuleSidebar() {
  const toggle = document.querySelector('#modules-toggle');
  const sidebar = document.querySelector('#module-sidebar');
  const backdrop = document.querySelector('#sidebar-backdrop');
  if (!toggle || !sidebar || !backdrop) return;

  const close = () => {
    sidebar.classList.remove('sidebar-open');
    backdrop.classList.remove('backdrop-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = !sidebar.classList.contains('sidebar-open');
    sidebar.classList.toggle('sidebar-open', open);
    backdrop.classList.toggle('backdrop-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  backdrop.addEventListener('click', close);
  sidebar.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('a[href]')) close();
  });
}

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const sidebar = document.querySelector('#module-sidebar');
  if (!sidebar?.classList.contains('sidebar-open')) return;
  sidebar.classList.remove('sidebar-open');
  document.querySelector('#sidebar-backdrop')?.classList.remove('backdrop-open');
  const toggle = document.querySelector('#modules-toggle');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.focus();
});

function homeMarkup() {
  return `
    <main class="home-main">
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow"><span class="eyebrow-line"></span> MEDIA PEMBELAJARAN ANATOMI</div>
          <h1>Anatomi dan<br /><span>sirkulasi jantung.</span></h1>
          <p>Amati struktur dan alur sirkulasi melalui model tiga dimensi. Materi bersifat edukasional dan tidak digunakan untuk keputusan klinis.</p>
          <div class="hero-actions"><a class="button button-primary" href="${levelUrl(3)}">Mulai jelajahi <span>→</span></a><a class="button button-quiet" href="${catalogUrl}">Lihat semua modul</a></div>
          <div class="hero-footnote"><span class="pulse-dot"></span> 10 modul pembelajaran <span class="foot-divider">·</span> 2 perangkat penelitian</div>
        </div>
        <div class="hero-visual">
          <div class="visual-orbit orbit-one"></div><div class="visual-orbit orbit-two"></div>
          <span class="visual-coordinate coordinate-top">MODEL ANATOMI / 01</span><span class="visual-coordinate coordinate-bottom">ILUSTRASI EDUKASIONAL</span>
          <div class="model-canvas" id="heart-canvas" role="img" aria-label="Model tiga dimensi jantung manusia yang dapat diputar, diperbesar, dan digunakan untuk memilih struktur anatomi."></div>
          <div class="floating-label label-top"><i class="label-dot red"></i><span>Ventrikel kiri<small>Aliran sistemik</small></span></div>
          <div class="floating-label label-bottom"><i class="label-dot blue"></i><span>Ventrikel kanan<small>Aliran pulmonal</small></span></div>
          <div class="model-caption"><span class="caption-badge">3D</span><span>MODEL JANTUNG<small>Seret untuk memutar</small></span></div>
        </div>
      </section>
      <section class="metrics" aria-label="Cakupan materi">
        <div><span class="metric-icon">◇</span><strong>10</strong><span>modul pembelajaran</span></div><div><span class="metric-icon">↗</span><strong>08</strong><span>tahap sirkulasi</span></div><div><span class="metric-icon">⌖</span><strong>09</strong><span>struktur terpilih</span></div><div class="metric-note"><span class="online-dot"></span><span>Berjalan di browser<small>Visualisasi edukasional</small></span></div>
      </section>
      <section class="disclaimer-strip"><span class="disclaimer-icon">i</span><p><strong>Ruang lingkup.</strong> CardioExplore 3D merupakan media pembelajaran anatomi dan bukan alat diagnosis atau pengambilan keputusan klinis.</p><a href="${levelUrl(2)}">Baca batasan →</a></section>
    </main>`;
}

function catalogMarkup() {
  return `
    <main class="catalog-main">
      <div class="catalog-top"><a class="back-link" href="${homeUrl}">← <span>Kembali ke beranda</span></a><a class="button button-primary" href="${levelUrl(3)}">Mulai jelajahi <span>→</span></a></div>
      <section class="levels-section">
        <div class="section-heading"><div><div class="eyebrow">RUANG KERJA ANATOMI JANTUNG</div><h1>Modul pembelajaran<span>.</span></h1></div><p>Jelajahi materi secara berurutan atau buka topik tertentu. Perangkat penelitian digunakan untuk pencatatan validasi materi.</p></div>
        <h2 class="catalog-group-title">PEMBELAJARAN · 10 MODUL</h2>
        <div class="level-grid">${scenes.slice(0, 10).map((scene, index) => levelCard(scene, index)).join('')}</div>
        <h2 class="catalog-group-title research-catalog-title">PERANGKAT PENELITIAN · 2 PERANGKAT</h2>
        <div class="level-grid research-level-grid">${scenes.slice(10).map((scene, index) => levelCard(scene, index + 10)).join('')}</div>
      </section>
      <section class="disclaimer-strip"><span class="disclaimer-icon">i</span><p><strong>Ruang lingkup.</strong> Model dan alur merupakan penyederhanaan edukasional, bukan representasi klinis.</p><a href="${levelUrl(2)}">Baca batasan →</a></section>
    </main>`;
}

function levelCard(scene, index) {
  return `<a class="level-card" href="${levelUrl(index + 1)}">
      <span class="level-card-top"><span class="level-icon">${scene.icon}</span><span class="level-number">${index < 10 ? 'MODUL' : 'RISET'} ${String(index + 1).padStart(2, '0')}</span></span>
      <strong>${scene.navTitle}</strong><span>${scene.description}</span>
      <span class="level-open">${index < 10 ? 'Buka modul' : 'Buka perangkat'} <span aria-hidden="true">↗</span></span>
    </a>`;
}

function structureList() {
  return structures.map(item => `<button class="structure-option" type="button" data-structure="${item.id}" aria-pressed="false"><span class="structure-dot" style="--structure-color:#${item.color.toString(16).padStart(6, '0')}"></span>${item.name}<span class="list-arrow">↗</span></button>`).join('');
}

function levelMarkup() {
  return `
    <main class="workspace">
      <aside class="sidebar" id="module-sidebar" aria-label="Navigasi modul">
        <a class="back-link" href="${homeUrl}">← <span>Kembali ke beranda</span></a>
        <nav aria-label="Modul pembelajaran dan perangkat penelitian">${sceneNavigation()}</nav>
        <div class="sidebar-note"><span>i</span><p>Simulasi edukasional yang disederhanakan. Bukan perangkat medis.</p></div>
      </aside>
      <button class="sidebar-backdrop" id="sidebar-backdrop" type="button" aria-label="Tutup navigasi modul" tabindex="-1"></button>
      <section class="lesson">
        <div class="lesson-header"><div><div class="breadcrumb"><a href="${homeUrl}">BERANDA</a><span>/</span>${currentScene.category.toUpperCase()}</div><h1><span>${level < 11 ? `MODUL ${String(level).padStart(2, '0')}` : `RISET ${String(level - 10).padStart(2, '0')}`}</span> ${currentScene.title}</h1><p>${currentScene.description}</p></div><a class="all-levels" href="${catalogUrl}">Semua modul <span>↗</span></a></div>
        <div class="lesson-grid">
          <section class="visual-card">
            <div class="visual-card-head"><div><span class="live-tag"><i></i> MODEL ANATOMI INTERAKTIF</span><span class="viewer-caption">Pilih struktur untuk melihat keterangan yang tersedia.</span></div><span id="model-hint">Seret untuk memutar · Cubit atau gulir untuk zoom</span></div>
            <div class="model-canvas lesson-canvas" id="heart-canvas" role="img" aria-label="Model jantung tiga dimensi interaktif. Seret untuk memutar, perbesar dengan cubit atau gulir, dan pilih struktur yang tersedia."></div>
            <div class="model-controls" aria-label="Kontrol model">
              <button class="small-control" type="button" data-action="reset" title="Atur ulang kamera dan tampilan" aria-label="Atur ulang model">⟳ <span>Atur ulang</span></button>
              <button class="small-control" type="button" data-view="anterior" aria-pressed="true">Anterior</button>
              <button class="small-control" type="button" data-view="posterior" aria-pressed="false">Posterior</button>
              <button class="small-control" type="button" data-action="focus" disabled title="Pilih struktur terlebih dahulu">Fokus pilihan</button>
              <button class="small-control" type="button" data-action="isolate" disabled title="Pilih struktur terlebih dahulu">Isolasi</button>
              <button class="small-control" type="button" data-action="restore">Tampilkan semua</button>
              <button class="small-control" type="button" data-action="flow">▶ <span id="flow-label">Alur darah</span></button>
              <span class="selected-model-label">Dipilih: <strong id="model-selection-name">Belum ada</strong></span>
            </div>
          </section>
          <aside class="info-card" id="info-card">
            <div class="info-top"><span class="info-kicker">${level === 11 ? 'FORMULIR VALIDASI' : level === 12 ? 'RINGKASAN PENELITIAN' : 'PANDUAN PEMBELAJARAN'}</span><span class="step-counter">${String(level).padStart(2, '0')} <i>/ 12</i></span></div>
            <div id="level-content">${levelContent()}</div>
          </aside>
        </div>
        <div class="bottom-bar"><span><span class="key-hint">TIP</span> ${levelTip()}</span><div class="level-pager">${level > 1 ? `<a href="${levelUrl(level - 1)}">← Modul sebelumnya</a>` : '<span></span>'}${level < 12 ? `<a class="next-link" href="${levelUrl(level + 1)}">Modul berikutnya <span>→</span></a>` : `<a class="next-link" href="${homeUrl}">Selesai <span>✓</span></a>`}</div></div>
      </section>
    </main>`;
}

function levelTip() {
  const tips = [
    'Model 3D skematis ini dibuat secara prosedural untuk pembelajaran.',
    'Baca batasan simulasi sebelum melanjutkan.',
    'Pilih salah satu mode untuk mulai belajar.',
    'Klik struktur atau gunakan daftar nama di panel.',
    'Pilih struktur untuk melihat nama dan fungsi singkatnya.',
    'Gunakan “Tampilkan semua” untuk memulihkan konteks model.',
    'Gerak partikel dan kecepatannya hanya ilustratif.',
    'Ikuti setiap langkah dengan tombol sebelumnya dan berikutnya.',
    'Pilih jawaban untuk melihat umpan balik.',
    'Pilih tahap aliran sesuai urutan yang dipelajari.',
    'Jangan mencantumkan informasi pribadi dalam catatan.',
    'Ekspor data hanya tersimpan di perangkat ini.'
  ];
  return tips[sceneIndex];
}

function reviewFormMarkup() {
  const structureOptions = structures.map(item => `<option value="${item.id}">${escapeHTML(item.name)}</option>`).join('');
  const domainOptions = reviewDomains.map(item => `<option value="${escapeHTML(item)}">${escapeHTML(item)}</option>`).join('');
  const findingOptions = reviewFindings.map((item, index) => `<label class="finding-option"><input type="checkbox" name="review-finding" value="${escapeHTML(item)}"><span>${escapeHTML(item)}</span></label>`).join('');
  const statusOptions = reviewStatuses.map(item => `<option value="${escapeHTML(item)}">${escapeHTML(item)}</option>`).join('');

  return `<div class="review-heading"><h2>Validasi ahli materi</h2><p>Catat evaluasi pada aspek yang didukung oleh model. Data hanya disimpan di browser ini.</p></div>
    <form id="review-form" aria-label="Formulir validasi ahli materi" novalidate>
      <label class="form-label" for="review-structure">Struktur yang ditinjau
        <select id="review-structure" name="structure" required><option value="">Pilih struktur yang tersedia</option>${structureOptions}</select>
      </label>
      <div class="review-selected">Pilihan dari model: <strong id="review-selected-label">Belum ada</strong></div>
      <div class="review-fields-pair">
        <label class="form-label" for="review-domain">Domain penilaian
          <select id="review-domain" name="domain" required><option value="">Pilih domain</option>${domainOptions}</select>
        </label>
        <label class="form-label" for="review-score">Skor kesesuaian
          <select id="review-score" name="score" required><option value="">Pilih skor 1–4</option>
            <option value="1">1 · Tidak sesuai</option><option value="2">2 · Perlu revisi mayor</option>
            <option value="3">3 · Perlu revisi minor</option><option value="4">4 · Sesuai</option>
          </select>
        </label>
      </div>
      <details class="rubric-details">
        <summary>Lihat rubrik penilaian skala 1–4</summary>
        <ol><li><strong>1 · Tidak sesuai</strong> — Revisi substantif diperlukan.</li>
          <li><strong>2 · Perlu revisi mayor</strong> — Beberapa aspek penting perlu diperbaiki.</li>
          <li><strong>3 · Perlu revisi minor</strong> — Ada koreksi terbatas yang perlu dilakukan.</li>
          <li><strong>4 · Sesuai</strong> — Tidak ditemukan revisi bermakna pada aspek ini.</li>
        </ol>
      </details>
      <fieldset class="findings-fieldset">
        <legend>Temuan (opsional)</legend><div class="finding-grid">${findingOptions}</div>
      </fieldset>
      <label class="form-label" for="review-note">Catatan temuan
        <textarea id="review-note" name="note" rows="2" maxlength="2000" placeholder="Jelaskan observasi yang mendasari penilaian. Jangan masukkan data pribadi atau data pasien."></textarea>
      </label>
      <label class="form-label" for="review-recommendation">Rekomendasi revisi
        <textarea id="review-recommendation" name="recommendation" rows="2" maxlength="2000" placeholder="Tuliskan saran perbaikan yang relevan."></textarea>
      </label>
      <label class="form-label" for="review-status">Status validasi
        <select id="review-status" name="status" required><option value="">Pilih status</option>${statusOptions}</select>
      </label>
      <p class="form-error" id="review-error" role="alert" hidden></p>
      <div class="review-actions">
        <button class="button button-primary" id="save-review" type="submit">Simpan validasi</button>
        <button class="button button-secondary" id="save-review-draft" type="button">Simpan draf</button>
      </div>
      <div class="feedback-box" id="review-feedback" aria-live="polite"></div>
    </form>`;
}

function levelContent() {
  const card = (title, text, buttons = '') => `<div class="content-intro"><span class="content-mark">${currentScene.icon}</span><h2>${title}</h2><p>${text}</p></div>${buttons}`;
  if (level === 1) return `${card('Model siap dijelajahi', 'Pemeriksaan browser selesai. Visualisasi 3D dibuat langsung di perangkat ini.') }<div class="load-status"><span class="online-dot"></span><span>WebGL tersedia<small>Model prosedural · Tidak perlu unduhan aset</small></span></div><a class="button button-primary full-button" href="${levelUrl(2)}">Lanjutkan <span>→</span></a>`;
  if (level === 2) return `${card('Sebelum memulai', 'Baca tujuan dan batasan pembelajaran ini.') }<div class="notice-box"><strong>ⓘ Visualisasi edukasional</strong><p>Model anatomi dan gerak aliran disederhanakan. Tidak untuk diagnosis, pengobatan, atau keputusan klinis.</p></div><label class="check-row"><input id="disclaimer-check" type="checkbox" /><span>Saya memahami simulasi ini hanya untuk pembelajaran.</span></label><a class="button button-primary full-button is-disabled" id="disclaimer-next" href="${levelUrl(3)}" aria-disabled="true">Saya mengerti <span>→</span></a><p class="privacy-note">Tidak ada nama, email, atau data pasien yang diminta.</p>`;
  if (level === 3) return `${card('Bagaimana kamu ingin belajar?', 'Kamu bisa berpindah mode kapan saja tanpa kehilangan model.') }<div class="mode-list"><a class="mode-option" href="${levelUrl(4)}"><span>◎</span><div><strong>Eksplorasi bebas</strong><small>Putar dan amati anatomi</small></div><b>→</b></a><a class="mode-option" href="${levelUrl(8)}"><span>↻</span><div><strong>Sirkulasi terpandu</strong><small>Ikuti aliran tahap demi tahap</small></div><b>→</b></a><a class="mode-option" href="${levelUrl(9)}"><span>✓</span><div><strong>Latihan</strong><small>Coba identifikasi struktur</small></div><b>→</b></a></div>`;
  if (level === 4 || level === 5 || level === 6) return `${card('Pilih struktur jantung', 'Pilih nama atau klik bentuk pada model. Gunakan kontrol kamera untuk melihat dari sudut berbeda.') }<div class="structure-list">${structureList()}</div><div class="selected-structure" id="selected-structure"><span class="selected-dot"></span><div><strong id="selected-name">Belum ada pilihan</strong><small id="selected-description">Pilih struktur pada model atau daftar.</small></div></div><div class="visibility-actions"><button class="button button-secondary" type="button" data-action="isolate" disabled>Pisahkan pilihan</button><button class="button button-quiet" type="button" data-action="restore">Tampilkan semua</button></div>`;
  if (level === 7) return `${card('Satu siklus, delapan tahap', 'Alur pulmonal dan sistemik divisualisasikan sebagai ilustrasi, bukan simulasi aliran fisiologis.') }<div class="flow-legend"><span><i class="legend-dot blue"></i> Alur terdeoksigenasi*</span><span><i class="legend-dot red"></i> Alur teroksigenasi*</span></div><div class="flow-progress"><span id="overview-step">Siap diputar</span><div class="progress-track"><span id="overview-progress"></span></div></div><div class="control-row"><button class="button button-primary" type="button" data-action="play">▶ Mulai</button><button class="button button-secondary" type="button" data-action="pause">Ⅱ Jeda</button><button class="button button-quiet" type="button" data-action="restart">↺ Ulangi</button></div><p class="micro-copy">*Warna adalah konvensi edukasional, bukan warna literal darah.</p>`;
  if (level === 8) return `${card('Ikuti jalur sirkulasi', 'Gunakan tombol berikutnya untuk berpindah di antara delapan tahap aliran.') }<div class="guided-step"><span class="guided-count" id="guided-count">01 / 08</span><h3 id="guided-title">${circulationSteps[0].title}</h3><p id="guided-description">${circulationSteps[0].text}</p></div><div class="progress-track guided-progress"><span id="guided-progress"></span></div><div class="control-row"><button class="button button-secondary" id="step-previous" type="button">← Kembali</button><button class="button button-primary" id="step-next" type="button">Berikutnya →</button></div><button class="text-action" type="button" data-action="replay-step">↻ Ulangi sorotan</button>`;
  if (level === 9) return `${card('Ruang mana menerima aliran balik vena sistemik?', 'Pilih satu jawaban. Kamu akan langsung melihat umpan balik untuk latihan ini.') }<div class="quiz-options">${['Atrium kiri', 'Atrium kanan', 'Ventrikel kiri', 'Ventrikel kanan'].map((answer, index) => `<button class="quiz-option" type="button" data-answer="${index}"><span>${String.fromCharCode(65 + index)}</span>${answer}</button>`).join('')}</div><div class="feedback-box" id="quiz-feedback" aria-live="polite">Pilih jawaban untuk melihat penjelasan.</div><button class="text-action" type="button" data-action="quiz-reset">↺ Coba lagi</button>`;
  if (level === 10) return `${card('Susun alur darah melalui jantung', 'Pilih tahap berikutnya secara berurutan. Ini latihan, bukan penilaian kompetensi.') }<div class="sequence-current"><span class="content-kicker">PILIH TAHAP KE-<b id="sequence-position">1</b></span><h3 id="sequence-prompt">Darah kembali dari tubuh melalui?</h3></div><div class="quiz-options sequence-options">${['Venae cavae', 'Atrium kanan', 'Ventrikel kanan', 'Arteri pulmonalis', 'Vena pulmonalis', 'Atrium kiri', 'Ventrikel kiri', 'Aorta'].map((answer, index) => `<button class="quiz-option" type="button" data-sequence="${index}"><span>${String.fromCharCode(65 + index)}</span>${answer}</button>`).join('')}</div><div class="feedback-box" id="sequence-feedback" aria-live="polite">Pilih tahap yang memulai aliran.</div><button class="text-action" type="button" data-action="sequence-reset">↺ Mulai ulang urutan</button>`;
  if (level === 11) return reviewFormMarkup();
  return `${card('Ringkasan sesi lokal', 'Ringkasan hanya disimpan di browser ini. Ekspor data atau hapus catatan dan draf dari perangkat.') }<div class="summary-stats"><div><strong id="event-count">0</strong><span>interaksi tercatat</span></div><div><strong id="review-count">0</strong><span>validasi tersimpan</span></div></div><div class="review-status"><span class="online-dot"></span><span>Penyimpanan lokal<small>Tidak ada pengiriman ke server.</small></span></div><div class="control-row stacked-controls"><button class="button button-primary" id="export-data" type="button">Ekspor JSON <span>↓</span></button><button class="button button-secondary" id="clear-data" type="button">Hapus data lokal</button></div><div class="feedback-box" id="export-feedback" aria-live="polite"></div>`;
}

function bindTheme() {
  const button = document.querySelector('#theme-toggle');
  const label = document.querySelector('#theme-label');
  label.textContent = activeTheme === 'dark' ? 'Gelap' : 'Terang';
  button.addEventListener('click', () => {
    activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('cardio-theme', activeTheme);
    } catch (error) {
      console.error('Gagal menyimpan preferensi tema:', error);
    }
    document.documentElement.dataset.theme = activeTheme;
    label.textContent = activeTheme === 'dark' ? 'Gelap' : 'Terang';
    window.dispatchEvent(new CustomEvent('cardio-theme-change', { detail: activeTheme }));
  });
}

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', event => {
  if (getSavedTheme()) return;
  activeTheme = event.matches ? 'light' : 'dark';
  document.documentElement.dataset.theme = activeTheme;
  const label = document.querySelector('#theme-label');
  if (label) label.textContent = activeTheme === 'dark' ? 'Gelap' : 'Terang';
  window.dispatchEvent(new CustomEvent('cardio-theme-change', { detail: activeTheme }));
});

window.addEventListener('cardio-theme-change', event => activeModel?.setTheme(event.detail));

function getLog() {
  try {
    const stored = localStorage.getItem('cardio-session');
    if (stored === null) return { events: [], reviews: [] };
    const value = JSON.parse(stored);
    if (!value || !Array.isArray(value.events) || !Array.isArray(value.reviews)) {
      throw new Error('Format log lokal tidak valid.');
    }
    return value;
  } catch (error) {
    console.error('Gagal membaca catatan sesi lokal:', error);
    return null;
  }
}

function saveLog(log) {
  try {
    localStorage.setItem('cardio-session', JSON.stringify(log));
    return true;
  } catch (error) {
    console.error('Gagal menyimpan catatan sesi lokal:', error);
    return false;
  }
}

function recordEvent(action, details = {}) {
  const log = getLog();
  if (!log) return false;
  log.events.push({ timestamp: new Date().toISOString(), level, action, ...details });
  return saveLog(log);
}

function bootScene() {
  const canvas = document.querySelector('#heart-canvas');
  if (!canvas) return;
  let model;
  try {
    model = createHeartScene(canvas, entry => {
      const selectedName = document.querySelector('#selected-name');
      const selectedDescription = document.querySelector('#selected-description');
      const modelSelection = document.querySelector('#model-selection-name');
      const reviewSelection = document.querySelector('#review-selected-label');
      const reviewStructure = document.querySelector('#review-structure');
      const structureId = entry?.id || '';

      if (selectedName) selectedName.textContent = entry?.name || 'Belum ada pilihan';
      if (selectedDescription) selectedDescription.textContent = entry?.description || 'Pilih struktur pada model atau daftar.';
      if (modelSelection) modelSelection.textContent = entry?.name || 'Belum ada';
      if (reviewSelection) reviewSelection.textContent = entry?.name || 'Belum ada';
      if (reviewStructure && entry) reviewStructure.value = structureId;
      document.querySelectorAll('[data-action="focus"], [data-action="isolate"]').forEach(button => {
        button.disabled = !entry;
      });
      document.querySelectorAll('[data-structure]').forEach(button => {
        const selected = button.dataset.structure === structureId;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
    });
    model.setTheme(activeTheme);
  } catch (error) {
    canvas.innerHTML = `<div class="render-error"><strong>Model 3D tidak dapat dimuat</strong><span>${escapeHTML(error.message)}</span><button class="button button-secondary" data-retry type="button">Coba lagi</button></div>`;
    canvas.querySelector('[data-retry]').addEventListener('click', () => window.location.reload());
    console.error('Gagal menginisialisasi visualisasi 3D:', error);
    return;
  }

  activeModel = model;
  let overviewTimer = null;
  disposeCurrentScene = () => {
    if (overviewTimer) window.clearInterval(overviewTimer);
    model.dispose();
    if (activeModel === model) activeModel = null;
  };
  const disclaimerCheck = document.querySelector('#disclaimer-check');
  if (disclaimerCheck) {
    disclaimerCheck.addEventListener('change', () => {
      const next = document.querySelector('#disclaimer-next');
      next.classList.toggle('is-disabled', !disclaimerCheck.checked);
      next.setAttribute('aria-disabled', String(!disclaimerCheck.checked));
      next.tabIndex = disclaimerCheck.checked ? 0 : -1;
    });
    document.querySelector('#disclaimer-next').addEventListener('click', event => {
      if (!disclaimerCheck.checked) event.preventDefault();
    });
  }
  let overviewStep = 0;
  const advanceOverview = () => {
    const active = circulationSteps[overviewStep % circulationSteps.length];
    model.setStep(overviewStep % circulationSteps.length);
    document.querySelector('#overview-step').textContent = `${overviewStep % circulationSteps.length + 1} / 8 · ${active.title}`;
    document.querySelector('#overview-progress').style.width = `${((overviewStep % circulationSteps.length + 1) / 8) * 100}%`;
    overviewStep += 1;
  };
  document.querySelectorAll('[data-structure]').forEach(button => button.addEventListener('click', () => {
    model.select(button.dataset.structure, level === 5);
    recordEvent('structure_selected', { structureId: button.dataset.structure });
  }));
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    model.setView(button.dataset.view);
    document.querySelectorAll('[data-view]').forEach(viewButton => {
      viewButton.setAttribute('aria-pressed', String(viewButton === button));
    });
  }));
  document.querySelector('#review-structure')?.addEventListener('change', event => {
    if (event.target.value) model.select(event.target.value);
  });
  document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'reset') {
      if (overviewTimer) {
        window.clearInterval(overviewTimer);
        overviewTimer = null;
        overviewStep = 0;
        document.querySelectorAll('[data-action="play"], [data-action="flow"]').forEach(item => { item.disabled = false; });
      }
      model.restore();
      document.querySelectorAll('[data-view]').forEach(viewButton => {
        const anterior = viewButton.dataset.view === 'anterior';
        viewButton.setAttribute('aria-pressed', String(anterior));
      });
      const selectedName = document.querySelector('#selected-name');
      if (selectedName) {
        selectedName.textContent = 'Belum ada pilihan';
        document.querySelector('#selected-description').textContent = 'Pilih struktur pada model atau daftar.';
      }
    }
    if (action === 'restore') {
      if (overviewTimer) {
        window.clearInterval(overviewTimer);
        overviewTimer = null;
        overviewStep = 0;
        document.querySelectorAll('[data-action="play"], [data-action="flow"]').forEach(item => { item.disabled = false; });
      }
      model.restore();
      document.querySelectorAll('[data-view]').forEach(viewButton => {
        const anterior = viewButton.dataset.view === 'anterior';
        viewButton.setAttribute('aria-pressed', String(anterior));
      });
    }
    if (action === 'isolate') {
      if (!model.selectedId) {
        return;
      }
      model.isolate(model.selectedId);
      recordEvent('structure_isolated', { structureId: model.selectedId });
    }
    if (action === 'focus' && model.selectedId) model.focus(model.selectedId);
    if (action === 'flow' || action === 'play') {
      model.setFlow(true);
      if (level !== 7) button.dataset.action = 'pause';
      const label = document.querySelector('#flow-label');
      if (label) label.textContent = 'Jeda alur';
      if (level === 7 && !overviewTimer) {
        button.disabled = true;
        advanceOverview();
        overviewTimer = window.setInterval(advanceOverview, 1900);
      }
    }
    if (action === 'pause') {
      model.setFlow(false);
      if (level === 7) {
        window.clearInterval(overviewTimer);
        overviewTimer = null;
        document.querySelectorAll('[data-action="play"], [data-action="flow"]').forEach(item => { item.disabled = false; });
      } else {
        button.dataset.action = button.classList.contains('small-control') ? 'flow' : 'play';
        button.innerHTML = button.classList.contains('small-control') ? '▶ <span id="flow-label">Alur darah</span>' : '▶ Mulai';
      }
      const label = document.querySelector('#flow-label');
      if (label) label.textContent = 'Alur darah';
    }
    if (action === 'restart') {
      window.clearInterval(overviewTimer);
      overviewTimer = null;
      overviewStep = 0;
      document.querySelectorAll('[data-action="play"], [data-action="flow"]').forEach(item => { item.disabled = false; });
      model.restore();
      document.querySelectorAll('[data-view]').forEach(viewButton => {
        const anterior = viewButton.dataset.view === 'anterior';
        viewButton.setAttribute('aria-pressed', String(anterior));
      });
      document.querySelector('#overview-step').textContent = 'Alur diatur ulang';
      document.querySelector('#overview-progress').style.width = '0%';
    }
    if (action === 'replay-step') model.setStep(currentStep);
    if (action === 'quiz-reset') {
      answeredQuiz = false;
      document.querySelector('#quiz-feedback').textContent = 'Pilih jawaban untuk melihat penjelasan.';
      document.querySelectorAll('.quiz-option').forEach(item => item.classList.remove('correct', 'incorrect'));
    }
    if (action === 'sequence-reset') resetSequence();
  }));

  let currentStep = 0;
  if (level === 8) {
    const showStep = () => {
      const item = circulationSteps[currentStep];
      model.setStep(currentStep);
      document.querySelector('#guided-count').textContent = `${String(currentStep + 1).padStart(2, '0')} / 08`;
      document.querySelector('#guided-title').textContent = item.title;
      document.querySelector('#guided-description').textContent = item.text;
      document.querySelector('#guided-progress').style.width = `${((currentStep + 1) / 8) * 100}%`;
      document.querySelector('#step-previous').disabled = currentStep === 0;
      document.querySelector('#step-next').innerHTML = currentStep === 7 ? 'Mulai lagi ↻' : 'Berikutnya →';
      recordEvent('guided_step_viewed', { step: currentStep + 1 });
    };
    document.querySelector('#step-previous').addEventListener('click', () => {
      currentStep = Math.max(0, currentStep - 1);
      showStep();
    });
    document.querySelector('#step-next').addEventListener('click', () => {
      currentStep = currentStep === 7 ? 0 : currentStep + 1;
      showStep();
    });
    showStep();
  }

  let answeredQuiz = false;
  if (level === 9) {
    document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
      if (answeredQuiz) return;
      answeredQuiz = true;
      const correct = button.dataset.answer === '1';
      button.classList.add(correct ? 'correct' : 'incorrect');
      if (!correct) document.querySelector('[data-answer="1"]').classList.add('correct');
      document.querySelector('#quiz-feedback').textContent = correct
        ? 'Benar. Atrium kanan menerima aliran balik vena sistemik.'
        : 'Belum tepat. Atrium kanan menerima aliran balik vena sistemik.';
      model.select('right_atrium', true);
      recordEvent('practice_answer', { taskId: 'structure-identification-01', correct });
    }));
  }

  let sequencePosition = 0;
  function resetSequence() {
    sequencePosition = 0;
    document.querySelector('#sequence-position').textContent = '1';
    document.querySelector('#sequence-prompt').textContent = 'Darah kembali dari tubuh melalui?';
    document.querySelector('#sequence-feedback').textContent = 'Pilih tahap yang memulai aliran.';
    document.querySelectorAll('[data-sequence]').forEach(button => {
      button.disabled = false;
      button.classList.remove('correct', 'incorrect');
    });
  }
  if (level === 10) {
    const prompts = [
      'Darah kembali dari tubuh melalui?', 'Setelah vena besar, darah masuk ke?', 'Dari atrium kanan darah menuju?', 'Ventrikel kanan memompa darah ke?',
      'Dari paru-paru darah kembali melalui?', 'Vena pulmonalis menuju ke?', 'Atrium kiri mengalirkan darah ke?', 'Ventrikel kiri memompa darah ke?'
    ];
    document.querySelectorAll('[data-sequence]').forEach(button => button.addEventListener('click', () => {
      const correct = Number(button.dataset.sequence) === sequencePosition;
      button.classList.add(correct ? 'correct' : 'incorrect');
      document.querySelector('#sequence-feedback').textContent = correct
        ? 'Tepat. Lanjutkan ke tahap berikutnya.'
        : `Belum tepat. Coba pilih “${circulationSteps[sequencePosition].title}”.`;
      recordEvent('sequence_answer', { step: sequencePosition + 1, correct });
      if (correct) {
        button.disabled = true;
        sequencePosition += 1;
        if (sequencePosition < 8) {
          document.querySelector('#sequence-position').textContent = String(sequencePosition + 1);
          document.querySelector('#sequence-prompt').textContent = prompts[sequencePosition];
        } else {
          document.querySelector('#sequence-prompt').textContent = 'Siklus selesai';
          document.querySelector('#sequence-feedback').textContent = 'Selesai. Kamu dapat meninjau kembali alur atau mengulang latihan.';
        }
      } else {
        window.setTimeout(() => button.classList.remove('incorrect'), 900);
      }
    }));
  }

  if (level === 11) {
    const form = document.querySelector('#review-form');
    const errorMessage = document.querySelector('#review-error');
    const feedback = document.querySelector('#review-feedback');
    const submitButton = document.querySelector('#save-review');
    const draftButton = document.querySelector('#save-review-draft');
    const storedLog = getLog();
    const displayError = message => {
      errorMessage.textContent = message;
      errorMessage.hidden = false;
      feedback.textContent = '';
    };
    const readReview = () => ({
      structureId: document.querySelector('#review-structure').value,
      domain: document.querySelector('#review-domain').value,
      score: document.querySelector('#review-score').value ? Number(document.querySelector('#review-score').value) : null,
      findings: [...form.querySelectorAll('input[name="review-finding"]:checked')].map(input => input.value),
      note: form.elements.note.value.trim(),
      recommendation: form.elements.recommendation.value.trim(),
      status: document.querySelector('#review-status').value
    });
    const setFormFromDraft = draft => {
      if (!draft || typeof draft !== 'object') return;
      const structure = structures.find(item => item.id === draft.structureId);
      if (structure) {
        document.querySelector('#review-structure').value = structure.id;
        model.select(structure.id);
      }
      if (reviewDomains.includes(draft.domain)) document.querySelector('#review-domain').value = draft.domain;
      if (Number.isInteger(draft.score) && draft.score >= 1 && draft.score <= 4) document.querySelector('#review-score').value = String(draft.score);
      if (reviewStatuses.includes(draft.status)) document.querySelector('#review-status').value = draft.status;
      if (typeof draft.note === 'string') document.querySelector('#review-note').value = draft.note.slice(0, 2000);
      if (typeof draft.recommendation === 'string') document.querySelector('#review-recommendation').value = draft.recommendation.slice(0, 2000);
      if (Array.isArray(draft.findings)) {
        form.querySelectorAll('input[name="review-finding"]').forEach(input => {
          input.checked = draft.findings.includes(input.value);
        });
      }
    };

    if (!storedLog) {
      displayError('Data sesi tidak dapat dibaca. Draf dan validasi dinonaktifkan agar data lama tidak tertimpa.');
      submitButton.disabled = true;
      draftButton.disabled = true;
    } else {
      setFormFromDraft(storedLog.reviewDraft);
      form.addEventListener('submit', event => {
        event.preventDefault();
        const review = readReview();
        const missing = [];
        const requiredFields = [
          { element: document.querySelector('#review-structure'), valid: structures.some(item => item.id === review.structureId), label: 'struktur' },
          { element: document.querySelector('#review-domain'), valid: reviewDomains.includes(review.domain), label: 'domain' },
          { element: document.querySelector('#review-score'), valid: Number.isInteger(review.score) && review.score >= 1 && review.score <= 4, label: 'skor 1–4' },
          { element: document.querySelector('#review-status'), valid: reviewStatuses.includes(review.status), label: 'status' }
        ];
        requiredFields.forEach(field => {
          field.element.setAttribute('aria-invalid', String(!field.valid));
          if (!field.valid) missing.push(field.label);
        });
        if (missing.length) {
          displayError(`Lengkapi pilihan yang valid: ${missing.join(', ')}.`);
          return;
        }

        const log = getLog();
        if (!log) {
          displayError('Data sesi tidak dapat dibaca. Validasi tidak disimpan.');
          return;
        }
        const structure = structures.find(item => item.id === review.structureId);
        const entry = {
          id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          schemaVersion: 1,
          timestamp: new Date().toISOString(),
          area: review.domain,
          structureId: review.structureId,
          structureName: structure.name,
          domain: review.domain,
          score: review.score,
          findings: review.findings,
          note: review.note,
          recommendation: review.recommendation,
          status: review.status
        };
        const normalizedFindings = findings => JSON.stringify(Array.isArray(findings) ? [...findings].sort() : []);
        const duplicate = log.reviews.some(item =>
          item.structureId === entry.structureId &&
          item.domain === entry.domain &&
          item.score === entry.score &&
          item.status === entry.status &&
          (item.note || '') === entry.note &&
          (item.recommendation || '') === entry.recommendation &&
          normalizedFindings(item.findings) === normalizedFindings(entry.findings)
        );
        if (duplicate) {
          errorMessage.hidden = true;
          feedback.textContent = 'Validasi yang sama sudah tersimpan; tidak dibuat duplikat.';
          return;
        }
        log.reviews.push(entry);
        log.reviewDraft = null;
        if (!saveLog(log)) {
          displayError('Validasi gagal disimpan. Periksa ruang penyimpanan browser dan coba lagi.');
          return;
        }
        errorMessage.hidden = true;
        feedback.textContent = 'Validasi tersimpan secara lokal di browser ini.';
        recordEvent('expert_review_saved', { structureId: entry.structureId, domain: entry.domain, status: entry.status });
      });
      draftButton.addEventListener('click', () => {
        const log = getLog();
        if (!log) {
          displayError('Data sesi tidak dapat dibaca. Draf tidak disimpan.');
          return;
        }
        log.reviewDraft = { ...readReview(), savedAt: new Date().toISOString() };
        if (!saveLog(log)) {
          displayError('Draf gagal disimpan. Periksa ruang penyimpanan browser dan coba lagi.');
          return;
        }
        errorMessage.hidden = true;
        feedback.textContent = 'Draf tersimpan secara lokal dan dapat dilanjutkan nanti.';
      });
      form.querySelectorAll('select[required]').forEach(field => field.addEventListener('change', () => {
        field.setAttribute('aria-invalid', 'false');
      }));
    }
  }

  if (level === 12) {
    const log = getLog();
    document.querySelector('#event-count').textContent = log ? String(log.events.length) : '—';
    document.querySelector('#review-count').textContent = log ? String(log.reviews.length) : '—';
    document.querySelector('#export-data').addEventListener('click', () => {
      const currentLog = getLog();
      if (!currentLog) {
        document.querySelector('#export-feedback').textContent = 'Data lokal tidak dapat dibaca; ekspor dibatalkan agar hasil tidak menyesatkan.';
        return;
      }
      const content = JSON.stringify({ product: 'CardioExplore 3D', exportedAt: new Date().toISOString(), ...currentLog }, null, 2);
      const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'cardioexplore-session.json';
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      document.querySelector('#export-feedback').textContent = 'File JSON berhasil diunduh.';
    });
    document.querySelector('#clear-data').addEventListener('click', () => {
      if (!window.confirm('Hapus seluruh interaksi, validasi, dan draf lokal dari browser ini?')) return;
      try {
        localStorage.removeItem('cardio-session');
        document.querySelector('#event-count').textContent = '0';
        document.querySelector('#review-count').textContent = '0';
        document.querySelector('#export-feedback').textContent = 'Data lokal telah dihapus.';
      } catch (error) {
        console.error('Gagal menghapus catatan sesi lokal:', error);
        document.querySelector('#export-feedback').textContent = 'Data lokal gagal dihapus. Periksa izin penyimpanan browser.';
      }
    });
  }

}

function renderApp() {
  const cleanup = disposeCurrentScene;
  disposeCurrentScene = () => {};
  cleanup();
  updateRouteState();
  shell();
  bootScene();
}

root.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const anchor = event.target.closest('a[href]');
  if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const destination = new URL(anchor.href, window.location.href);
  if (destination.origin !== window.location.origin || !destination.pathname.endsWith('/index.html')) return;
  if (!/^#\/(?:home|catalog|level\/(?:[1-9]|1[0-2]))$/.test(destination.hash)) return;

  event.preventDefault();
  if (destination.hash === window.location.hash && destination.pathname === window.location.pathname) return;
  window.history.pushState(null, '', destination.href);
  renderApp();
  window.scrollTo(0, 0);
});

window.addEventListener('popstate', renderApp);
renderApp();
