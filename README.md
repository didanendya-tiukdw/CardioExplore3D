# CardioExplore 3D

Prototipe edukasi anatomi dan sirkulasi jantung berbasis HTML5, JavaScript ES Modules, Vite, dan Three.js. Aplikasi berjalan dalam satu halaman di `index.html`; home, katalog, dan 12 level berpindah tanpa memuat ulang halaman. Rute memakai hash, misalnya `index.html#/level/4`. Model jantung dibuat secara prosedural untuk prototipe; model ini bukan aset anatomi klinis yang divalidasi.

## Struktur aplikasi

- `src/main.js` merender shell, home, katalog, isi level, dan navigasi hash aplikasi.
- `src/content.js` menyimpan data 12 level, struktur anatomi, dan langkah sirkulasi.
- `src/heart-scene.js` menangani visualisasi 3D dan kontrol model Three.js.
- `all-levels.html` dan `levels/scene-01.html` sampai `levels/scene-12.html` tetap tersedia sebagai entry point kompatibilitas dan mengarahkan pengguna ke rute yang sesuai di aplikasi utama.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Build statis untuk deployment:

```bash
npm run build
npm run preview
```

Impor folder proyek ke Vercel. Build command adalah `npm run build`, dan output directory adalah `dist`. Konfigurasi Vite dan `vercel.json` sudah disertakan.

## Fitur prototipe

- Home screen, katalog level, dan navigasi antarlevel berjalan dalam satu aplikasi tanpa muat ulang halaman.
- Tema otomatis mengikuti preferensi terang/gelap perangkat; tombol tema menyimpan pilihan manual di browser.
- Model jantung 3D interaktif: putar, zoom, pilih struktur, sorot, isolasi, dan pulihkan.
- Visualisasi ilustratif dan langkah sirkulasi, latihan identifikasi/urutan, form review demo, serta ekspor data sesi lokal.
- Layout responsif dan kontrol HTML yang dapat diakses melalui keyboard.

Tidak ada akun, API, atau pengiriman data ke server. Catatan latihan dan review hanya disimpan di `localStorage` browser. Konten medis dan gerakan aliran adalah penyederhanaan edukasional dan memerlukan tinjauan ahli sebelum digunakan dalam penelitian atau pembelajaran formal.
