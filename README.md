# CardioExplore 3D

Prototipe edukasi anatomi dan sirkulasi jantung berbasis HTML5, JavaScript ES Modules, Vite, dan Three.js. Home screen ada di `index.html`, katalog level ada di `all-levels.html`, dan setiap scene storyboard tersedia sebagai halaman terpisah di `levels/scene-01.html` sampai `levels/scene-12.html`. Model jantung dibuat secara prosedural untuk prototipe; model ini bukan aset anatomi klinis yang divalidasi.

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

Impor folder proyek ke Vercel. Build command adalah `npm run build`, dan output directory adalah `dist`. Konfigurasi multi-page Vite dan `vercel.json` sudah disertakan.

## Fitur prototipe

- Home screen berfokus pada tombol mulai; katalog semua level dibuka terpisah melalui `all-levels.html`.
- Tema otomatis mengikuti preferensi terang/gelap perangkat; tombol tema menyimpan pilihan manual di browser.
- Model jantung 3D interaktif: putar, zoom, pilih struktur, sorot, isolasi, dan pulihkan.
- Visualisasi ilustratif dan langkah sirkulasi, latihan identifikasi/urutan, form review demo, serta ekspor data sesi lokal.
- Layout responsif dan kontrol HTML yang dapat diakses melalui keyboard.

Tidak ada akun, API, atau pengiriman data ke server. Catatan latihan dan review hanya disimpan di `localStorage` browser. Konten medis dan gerakan aliran adalah penyederhanaan edukasional dan memerlukan tinjauan ahli sebelum digunakan dalam penelitian atau pembelajaran formal.
