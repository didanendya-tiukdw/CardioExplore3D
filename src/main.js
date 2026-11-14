import { createHeartScene } from './heart-scene.js';
import { circulationSteps, scenes, structures } from './content.js';

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

const savedTheme = localStorage.getItem('cardio-theme');
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

function levelCards() {
  return scenes.map((scene, index) => `
    <a class="level-card" href="${levelUrl(index + 1)}">
      <span class="level-card-top"><span class="level-icon">${scene.icon}</span><span class="level-number">LEVEL ${String(index + 1).padStart(2, '0')}</span></span>
      <strong>${scene.title}</strong><span>${scene.description}</span>
      <span class="level-open">Buka level <span aria-hidden="true">↗</span></span>
    </a>`).join('');
}

function sceneNavigation() {
  return scenes.map((scene, index) => `
    <a class="chapter-link ${index + 1 === level ? 'active' : ''}" href="${levelUrl(index + 1)}" ${index + 1 === level ? 'aria-current="page"' : ''}>
      <span class="chapter-number">${String(index + 1).padStart(2, '0')}</span><span>${scene.title}</span>
    </a>`).join('');
}

function shell() {
  root.innerHTML = `
    <header class="topbar">
      <a class="brand" href="${homeUrl}" aria-label="CardioExplore 3D, beranda"><span class="brand-mark">C<span>+</span></span><span>CardioExplore <b>3D</b><small>Explore · Learn · Understand</small></span></a>
      <nav class="top-nav" aria-label="Navigasi utama"><a href="${homeUrl}" class="${isHome ? 'selected' : ''}">Beranda</a><a href="${catalogUrl}" class="${isCatalog ? 'selected' : ''}">Eksplorasi</a><a href="${levelUrl(11)}">Research</a></nav>
      <div class="top-actions"><span class="status-pill"><i></i> SIMULASI EDUKASIONAL</span><button class="icon-button" id="theme-toggle" type="button" aria-label="Ganti tema">◐ <span id="theme-label"></span></button></div>
    </header>
    ${isHome ? homeMarkup() : isCatalog ? catalogMarkup() : levelMarkup()}
    <footer class="footer"><a class="brand footer-brand" href="${homeUrl}"><span class="brand-mark">C<span>+</span></span><span>CardioExplore <b>3D</b></span></a><span>Visualisasi edukasional · Bukan perangkat medis</span><a href="${levelUrl(12)}">Tentang proyek ↗</a></footer>`;
  bindTheme();
}

function homeMarkup() {
  return `
    <main class="home-main">
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow"><span class="eyebrow-line"></span> INTERACTIVE CARDIAC LEARNING</div>
          <h1>Jantung manusia,<br /><span>jelajahi dari dalam.</span></h1>
          <p>Kenali struktur dan alur sirkulasi jantung lewat pengalaman 3D yang interaktif. Putar, amati, dan pelajari dengan cara yang lebih dekat.</p>
          <div class="hero-actions"><a class="button button-primary" href="${levelUrl(3)}">Mulai jelajahi <span>→</span></a><a class="button button-quiet" href="${catalogUrl}">Lihat semua level</a></div>
          <div class="hero-footnote"><span class="pulse-dot"></span> 12 scene pembelajaran <span class="foot-divider">·</span> Tanpa instalasi</div>
        </div>
        <div class="hero-visual">
          <div class="visual-orbit orbit-one"></div><div class="visual-orbit orbit-two"></div>
          <span class="visual-coordinate coordinate-top">ANATOMY / 01</span><span class="visual-coordinate coordinate-bottom">3D EDUCATIONAL MODEL</span>
          <div class="model-canvas" id="heart-canvas" aria-label="Visualisasi 3D jantung"></div>
          <div class="floating-label label-top"><i class="label-dot red"></i><span>Ventrikel kiri<small>Aliran sistemik</small></span></div>
          <div class="floating-label label-bottom"><i class="label-dot blue"></i><span>Ventrikel kanan<small>Aliran pulmonal</small></span></div>
          <div class="model-caption"><span class="caption-badge">3D</span><span>MODEL JANTUNG<small>Putar untuk melihat</small></span></div>
        </div>
      </section>
      <section class="metrics" aria-label="Ringkasan simulasi">
        <div><span class="metric-icon">◇</span><strong>12</strong><span>scene interaktif</span></div><div><span class="metric-icon">↗</span><strong>08</strong><span>tahap sirkulasi</span></div><div><span class="metric-icon">⌖</span><strong>09</strong><span>struktur utama</span></div><div class="metric-note"><span class="online-dot"></span><span>Berjalan langsung di browser<small>WebGL · HTML5 · Three.js</small></span></div>
      </section>
      <section class="disclaimer-strip"><span class="disclaimer-icon">i</span><p><strong>Untuk pembelajaran.</strong> Visualisasi ini disederhanakan dan bukan alat diagnosis atau panduan pengobatan.</p><a href="${levelUrl(2)}">Selengkapnya →</a></section>
    </main>`;
}

function catalogMarkup() {
  return `
    <main class="catalog-main">
      <div class="catalog-top"><a class="back-link" href="${homeUrl}">← <span>Kembali ke beranda</span></a><a class="button button-primary" href="${levelUrl(3)}">Mulai jelajahi <span>→</span></a></div>
      <section class="levels-section">
        <div class="section-heading"><div><div class="eyebrow">JALUR BELAJAR</div><h1>Pilih perjalananmu<span>.</span></h1></div><p>Tiap scene adalah level mandiri. Lanjutkan berurutan atau langsung buka topik yang ingin kamu pelajari.</p></div>
        <div class="level-grid">${levelCards()}</div>
      </section>
      <section class="disclaimer-strip"><span class="disclaimer-icon">i</span><p><strong>Untuk pembelajaran.</strong> Visualisasi ini disederhanakan dan bukan alat diagnosis atau panduan pengobatan.</p><a href="${levelUrl(2)}">Selengkapnya →</a></section>
    </main>`;
}

function structureList() {
  return structures.map(item => `<button class="structure-option" type="button" data-structure="${item.id}"><span class="structure-dot" style="--structure-color:#${item.color.toString(16).padStart(6, '0')}"></span>${item.name}<span class="list-arrow">↗</span></button>`).join('');
}

function levelMarkup() {
  return `
    <main class="workspace">
      <aside class="sidebar">
        <a class="back-link" href="${homeUrl}">← <span>Kembali ke beranda</span></a>
        <div class="sidebar-label">JALUR PEMBELAJARAN</div>
        <nav class="chapter-nav" aria-label="Daftar level">${sceneNavigation()}</nav>
        <div class="sidebar-note"><span>i</span><p>Simulasi edukasional yang disederhanakan. Bukan perangkat medis.</p></div>
      </aside>
      <section class="lesson">
        <div class="lesson-header"><div><div class="breadcrumb"><a href="${homeUrl}">BERANDA</a><span>/</span>${currentScene.category.toUpperCase()}</div><h1><span>LEVEL ${String(level).padStart(2, '0')}</span> ${currentScene.title}</h1><p>${currentScene.description}</p></div><a class="all-levels" href="${catalogUrl}">Semua level <span>↗</span></a></div>
        <div class="lesson-grid">
          <section class="visual-card">
            <div class="visual-card-head"><span class="live-tag"><i></i> MODEL INTERAKTIF</span><span id="model-hint">Seret untuk memutar · Scroll untuk zoom</span></div>
            <div class="model-canvas lesson-canvas" id="heart-canvas" aria-label="Model jantung 3D"></div>
            <div class="model-controls"><button class="small-control" type="button" data-action="reset" title="Atur ulang kamera">⟳ <span>Atur ulang</span></button><button class="small-control" type="button" data-action="flow">▶ <span id="flow-label">Alur darah</span></button><span class="drag-hint">🖱 Seret model untuk memutar</span></div>
          </section>
          <aside class="info-card" id="info-card">
            <div class="info-top"><span class="info-kicker">PANDUAN LEVEL</span><span class="step-counter">${String(level).padStart(2, '0')} <i>/ 12</i></span></div>
            <div id="level-content">${levelContent()}</div>
          </aside>
        </div>
        <div class="bottom-bar"><span><span class="key-hint">TIP</span> ${levelTip()}</span><div class="level-pager">${level > 1 ? `<a href="${levelUrl(level - 1)}">← Sebelumnya</a>` : '<span></span>'}${level < 12 ? `<a class="next-link" href="${levelUrl(level + 1)}">Berikutnya <span>→</span></a>` : `<a class="next-link" href="${homeUrl}">Selesai <span>✓</span></a>`}</div></div>
      </section>
    </main>`;
}

function levelTip() {
  const tips = [
    'Model 3D skematis ini dibuat secara prosedural untuk demonstrasi.',
    'Baca batasan simulasi sebelum melanjutkan.',
    'Pilih salah satu mode untuk mulai belajar.',
    'Klik struktur atau gunakan daftar nama di panel.',
    'Pilih struktur untuk melihat nama dan fungsi singkatnya.',
    'Gunakan “Tampilkan semua” untuk memulihkan model.',
    'Gerak partikel dan kecepatannya hanya ilustratif.',
    'Ikuti setiap langkah dengan tombol sebelumnya dan berikutnya.',
    'Pilih jawaban untuk melihat umpan balik.',
    'Pilih tahap aliran sesuai urutan yang dipelajari.',
    'Jangan mencantumkan informasi pribadi dalam catatan.',
    'Ekspor data hanya tersimpan di perangkat ini.'
  ];
  return tips[sceneIndex];
}

function levelContent() {
  const card = (title, text, buttons = '') => `<div class="content-intro"><span class="content-mark">${currentScene.icon}</span><h2>${title}</h2><p>${text}</p></div>${buttons}`;
  if (level === 1) return `${card('Model siap dijelajahi', 'Pemeriksaan browser selesai. Visualisasi 3D dibuat langsung di perangkat ini.') }<div class="load-status"><span class="online-dot"></span><span>WebGL tersedia<small>Model prosedural · Tidak perlu unduhan aset</small></span></div><a class="button button-primary full-button" href="${levelUrl(2)}">Lanjutkan <span>→</span></a>`;
  if (level === 2) return `${card('Sebelum memulai', 'Baca tujuan dan batasan pembelajaran ini.') }<div class="notice-box"><strong>ⓘ Visualisasi edukasional</strong><p>Model anatomi dan gerak aliran disederhanakan. Tidak untuk diagnosis, pengobatan, atau keputusan klinis.</p></div><label class="check-row"><input id="disclaimer-check" type="checkbox" /><span>Saya memahami simulasi ini hanya untuk pembelajaran.</span></label><a class="button button-primary full-button is-disabled" id="disclaimer-next" href="${levelUrl(3)}" aria-disabled="true">Saya mengerti <span>→</span></a><p class="privacy-note">Tidak ada nama, email, atau data pasien yang diminta.</p>`;
  if (level === 3) return `${card('Bagaimana kamu ingin belajar?', 'Kamu bisa berpindah mode kapan saja tanpa kehilangan model.') }<div class="mode-list"><a class="mode-option" href="${levelUrl(4)}"><span>◎</span><div><strong>Eksplorasi bebas</strong><small>Putar dan amati anatomi</small></div><b>→</b></a><a class="mode-option" href="${levelUrl(8)}"><span>↻</span><div><strong>Sirkulasi terpandu</strong><small>Ikuti aliran tahap demi tahap</small></div><b>→</b></a><a class="mode-option" href="${levelUrl(9)}"><span>✓</span><div><strong>Latihan</strong><small>Coba identifikasi struktur</small></div><b>→</b></a></div>`;
  if (level === 4 || level === 5 || level === 6) return `${card('Pilih struktur jantung', 'Pilih nama atau klik bentuk pada model. Gunakan kontrol kamera untuk melihat dari sudut berbeda.') }<div class="structure-list">${structureList()}</div><div class="selected-structure" id="selected-structure"><span class="selected-dot"></span><div><strong id="selected-name">Belum ada pilihan</strong><small id="selected-description">Pilih struktur pada model atau daftar.</small></div></div><div class="visibility-actions"><button class="button button-secondary" type="button" data-action="isolate">Isolasi pilihan</button><button class="button button-quiet" type="button" data-action="restore">Tampilkan semua</button></div>`;
  if (level === 7) return `${card('Satu siklus, delapan tahap', 'Alur pulmonal dan sistemik divisualisasikan sebagai ilustrasi, bukan simulasi aliran fisiologis.') }<div class="flow-legend"><span><i class="legend-dot blue"></i> Alur terdeoksigenasi*</span><span><i class="legend-dot red"></i> Alur teroksigenasi*</span></div><div class="flow-progress"><span id="overview-step">Siap diputar</span><div class="progress-track"><span id="overview-progress"></span></div></div><div class="control-row"><button class="button button-primary" type="button" data-action="play">▶ Mulai</button><button class="button button-secondary" type="button" data-action="pause">Ⅱ Jeda</button><button class="button button-quiet" type="button" data-action="restart">↺ Ulangi</button></div><p class="micro-copy">*Warna adalah konvensi edukasional, bukan warna literal darah.</p>`;
  if (level === 8) return `${card('Ikuti jalur sirkulasi', 'Gunakan tombol berikutnya untuk berpindah di antara delapan tahap aliran.') }<div class="guided-step"><span class="guided-count" id="guided-count">01 / 08</span><h3 id="guided-title">${circulationSteps[0].title}</h3><p id="guided-description">${circulationSteps[0].text}</p></div><div class="progress-track guided-progress"><span id="guided-progress"></span></div><div class="control-row"><button class="button button-secondary" id="step-previous" type="button">← Kembali</button><button class="button button-primary" id="step-next" type="button">Berikutnya →</button></div><button class="text-action" type="button" data-action="replay-step">↻ Ulangi sorotan</button>`;
  if (level === 9) return `${card('Ruang mana menerima aliran balik vena sistemik?', 'Pilih satu jawaban. Kamu akan langsung melihat umpan balik untuk latihan ini.') }<div class="quiz-options">${['Atrium kiri', 'Atrium kanan', 'Ventrikel kiri', 'Ventrikel kanan'].map((answer, index) => `<button class="quiz-option" type="button" data-answer="${index}"><span>${String.fromCharCode(65 + index)}</span>${answer}</button>`).join('')}</div><div class="feedback-box" id="quiz-feedback" aria-live="polite">Pilih jawaban untuk melihat penjelasan.</div><button class="text-action" type="button" data-action="quiz-reset">↺ Coba lagi</button>`;
  if (level === 10) return `${card('Susun alur darah melalui jantung', 'Pilih tahap berikutnya secara berurutan. Ini latihan, bukan penilaian kompetensi.') }<div class="sequence-current"><span class="content-kicker">PILIH TAHAP KE-<b id="sequence-position">1</b></span><h3 id="sequence-prompt">Darah kembali dari tubuh melalui?</h3></div><div class="quiz-options sequence-options">${['Venae cavae', 'Atrium kanan', 'Ventrikel kanan', 'Arteri pulmonalis', 'Vena pulmonalis', 'Atrium kiri', 'Ventrikel kiri', 'Aorta'].map((answer, index) => `<button class="quiz-option" type="button" data-sequence="${index}"><span>${String.fromCharCode(65 + index)}</span>${answer}</button>`).join('')}</div><div class="feedback-box" id="sequence-feedback" aria-live="polite">Pilih tahap yang memulai aliran.</div><button class="text-action" type="button" data-action="sequence-reset">↺ Mulai ulang urutan</button>`;
  if (level === 11) return `${card('Formulir catatan review', 'Gunakan form ini untuk demo pencatatan. Penilaian medis final memerlukan reviewer yang sesuai.') }<label class="form-label">Area review<select id="review-area"><option>Terminologi anatomi</option><option>Urutan sirkulasi</option><option>Kejelasan visual</option><option>Potensi miskonsepsi</option></select></label><label class="form-label">Penilaian skala 1–4<select id="review-score"><option value="1">1 · Perlu revisi kritis</option><option value="2">2 · Perlu revisi mayor</option><option value="3">3 · Revisi minor</option><option value="4">4 · Sesuai</option></select></label><label class="form-label">Catatan<textarea id="review-note" rows="3" placeholder="Jangan masukkan informasi pribadi."></textarea></label><button class="button button-primary full-button" id="save-review" type="button">Simpan catatan lokal <span>↗</span></button><div class="feedback-box" id="review-feedback" aria-live="polite"></div>`;
  return `${card('Ringkasan sesi lokal', 'Ringkasan hanya disimpan di browser ini. Ekspor file untuk dokumentasi atau hapus data dari perangkat.') }<div class="summary-stats"><div><strong id="event-count">0</strong><span>interaksi tercatat</span></div><div><strong id="review-count">0</strong><span>catatan review</span></div></div><div class="review-status"><span class="online-dot"></span><span>Semua data tersimpan di browser<small>Tidak ada pengiriman ke server.</small></span></div><div class="control-row stacked-controls"><button class="button button-primary" id="export-data" type="button">Ekspor JSON <span>↓</span></button><button class="button button-secondary" id="clear-data" type="button">Hapus data lokal</button></div><div class="feedback-box" id="export-feedback" aria-live="polite"></div>`;
}

function bindTheme() {
  const button = document.querySelector('#theme-toggle');
  const label = document.querySelector('#theme-label');
  label.textContent = activeTheme === 'dark' ? 'Gelap' : 'Terang';
  button.addEventListener('click', () => {
    activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('cardio-theme', activeTheme);
    document.documentElement.dataset.theme = activeTheme;
    label.textContent = activeTheme === 'dark' ? 'Gelap' : 'Terang';
    window.dispatchEvent(new CustomEvent('cardio-theme-change', { detail: activeTheme }));
  });
}

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', event => {
  if (localStorage.getItem('cardio-theme')) return;
  activeTheme = event.matches ? 'light' : 'dark';
  document.documentElement.dataset.theme = activeTheme;
  const label = document.querySelector('#theme-label');
  if (label) label.textContent = activeTheme === 'dark' ? 'Gelap' : 'Terang';
  window.dispatchEvent(new CustomEvent('cardio-theme-change', { detail: activeTheme }));
});

window.addEventListener('cardio-theme-change', event => activeModel?.setTheme(event.detail));

function getLog() {
  try {
    const value = JSON.parse(localStorage.getItem('cardio-session') || '{"events":[],"reviews":[]}');
    if (!Array.isArray(value.events) || !Array.isArray(value.reviews)) throw new Error('Format log lokal tidak valid.');
    return value;
  } catch (error) {
    console.error('Gagal membaca catatan sesi lokal:', error);
    return { events: [], reviews: [] };
  }
}

function recordEvent(action, details = {}) {
  const log = getLog();
  log.events.push({ timestamp: new Date().toISOString(), level, action, ...details });
  localStorage.setItem('cardio-session', JSON.stringify(log));
}

function bootScene() {
  const canvas = document.querySelector('#heart-canvas');
  if (!canvas) return;
  const selectedDetails = document.querySelector('#selected-structure');
  let model;
  try {
    model = createHeartScene(canvas, entry => {
      if (!selectedDetails || !entry) return;
      document.querySelector('#selected-name').textContent = entry.name;
      document.querySelector('#selected-description').textContent = entry.description;
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
  document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'reset') {
      model.restore();
      const selectedName = document.querySelector('#selected-name');
      if (selectedName) {
        selectedName.textContent = 'Belum ada pilihan';
        document.querySelector('#selected-description').textContent = 'Pilih struktur pada model atau daftar.';
      }
    }
    if (action === 'restore') {
      model.restore();
      document.querySelector('#selected-name').textContent = 'Belum ada pilihan';
      document.querySelector('#selected-description').textContent = 'Pilih struktur pada model atau daftar.';
    }
    if (action === 'isolate') {
      if (!model.selectedId) {
        document.querySelector('#selected-name').textContent = 'Pilih struktur dahulu';
        return;
      }
      structures.forEach(item => {
        const node = model.getNode(item.id);
        if (node) node.visible = item.id === model.selectedId;
      });
      recordEvent('structure_isolated', { structureId: model.selectedId });
    }
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
        document.querySelector('[data-action="play"]').disabled = false;
      } else {
        button.dataset.action = 'play';
        button.textContent = '▶ Mulai';
      }
      const label = document.querySelector('#flow-label');
      if (label) label.textContent = 'Alur darah';
    }
    if (action === 'restart') {
      window.clearInterval(overviewTimer);
      overviewTimer = null;
      overviewStep = 0;
      document.querySelector('[data-action="play"]').disabled = false;
      model.restore();
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

  if (level === 11) document.querySelector('#save-review').addEventListener('click', () => {
    const log = getLog();
    log.reviews.push({
      timestamp: new Date().toISOString(),
      area: document.querySelector('#review-area').value,
      score: Number(document.querySelector('#review-score').value),
      note: document.querySelector('#review-note').value.trim()
    });
    localStorage.setItem('cardio-session', JSON.stringify(log));
    document.querySelector('#review-feedback').textContent = 'Catatan disimpan di browser ini.';
    document.querySelector('#review-note').value = '';
  });

  if (level === 12) {
    const log = getLog();
    document.querySelector('#event-count').textContent = String(log.events.length);
    document.querySelector('#review-count').textContent = String(log.reviews.length);
    document.querySelector('#export-data').addEventListener('click', () => {
      const content = JSON.stringify({ product: 'CardioExplore 3D', exportedAt: new Date().toISOString(), ...getLog() }, null, 2);
      const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'cardioexplore-session.json';
      anchor.click();
      URL.revokeObjectURL(url);
      document.querySelector('#export-feedback').textContent = 'File JSON berhasil diunduh.';
    });
    document.querySelector('#clear-data').addEventListener('click', () => {
      localStorage.removeItem('cardio-session');
      document.querySelector('#event-count').textContent = '0';
      document.querySelector('#review-count').textContent = '0';
      document.querySelector('#export-feedback').textContent = 'Data lokal telah dihapus.';
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
