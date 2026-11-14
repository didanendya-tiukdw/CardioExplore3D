# CardioExplore 3D

Media pembelajaran anatomi dan sirkulasi jantung berbasis HTML5, JavaScript ES Modules, Vite, dan Three.js. Aplikasi berjalan sebagai SPA di `index.html`; halaman beranda, katalog, 10 modul pembelajaran, dan dua perangkat penelitian berpindah tanpa memuat ulang halaman. Rute memakai hash, misalnya `index.html#/level/4`. Model jantung dibuat secara prosedural dan belum divalidasi sebagai representasi klinis.

## Struktur aplikasi

- `src/main.js` merender shell, home, katalog, isi level, dan navigasi hash aplikasi.
- `src/content.js` menyimpan data modul, struktur yang dapat dipilih, langkah sirkulasi, dan pilihan untuk formulir validasi.
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

- Beranda, katalog, navigasi 10 modul pembelajaran, dan dua perangkat penelitian berjalan dalam satu aplikasi tanpa muat ulang halaman.
- Tema otomatis mengikuti preferensi terang/gelap perangkat; tombol tema menyimpan pilihan manual di browser.
- Model jantung 3D interaktif: putar, zoom, pilih struktur yang didukung, pindah tampilan anterior/posterior, fokus, isolasi, dan pulihkan.
- Visualisasi ilustratif dan langkah sirkulasi, latihan identifikasi/urutan, formulir validasi ahli dengan draf, rubrik, temuan, rekomendasi, status, serta ekspor sesi lokal.
- Layout workstation responsif, navigasi modul pada layar sentuh, kontrol HTML dengan status dan target sentuh yang memadai, serta dukungan preferensi reduced motion.

Tidak ada akun, API, atau pengiriman data ke server. Catatan latihan, draf, dan validasi hanya disimpan di `localStorage` browser; ekspor JSON dilakukan atas tindakan pengguna. Catatan lama tetap dipertahankan ketika data baru disimpan. Struktur yang belum didukung model—termasuk katup dan struktur koroner yang dapat dipilih—tidak ditawarkan dalam formulir. Konten anatomi dan gerakan aliran adalah penyederhanaan edukasional dan tetap memerlukan tinjauan ahli sebelum digunakan dalam penelitian atau pembelajaran formal.
