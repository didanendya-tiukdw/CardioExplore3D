export const structures = [
  { id: 'superior_vena_cava', name: 'Vena cava superior', group: 'Vena besar', color: 0xc52c3b, position: [-0.58, 1.15, 0.02], scale: [0.24, 0.78, 0.24], description: 'Membawa darah dari bagian atas tubuh menuju atrium kanan.' },
  { id: 'inferior_vena_cava', name: 'Vena cava inferior', group: 'Vena besar', color: 0xb51e30, position: [-0.43, -1.02, 0.02], scale: [0.24, 0.65, 0.24], description: 'Membawa darah dari bagian bawah tubuh menuju atrium kanan.' },
  { id: 'right_atrium', name: 'Atrium kanan', group: 'Ruang jantung', color: 0xb92b39, position: [-0.56, 0.48, 0.3], scale: [0.49, 0.48, 0.32], description: 'Ruang jantung yang menerima aliran balik vena sistemik.' },
  { id: 'right_ventricle', name: 'Ventrikel kanan', group: 'Ruang jantung', color: 0xa9182c, position: [-0.4, -0.3, 0.34], scale: [0.56, 0.72, 0.32], description: 'Ruang jantung yang memompa darah menuju sirkulasi pulmonal.' },
  { id: 'pulmonary_artery', name: 'Arteri pulmonalis', group: 'Pembuluh besar', color: 0xd83b47, position: [-0.16, 0.94, -0.02], scale: [0.2, 0.67, 0.2], description: 'Membawa darah dari ventrikel kanan menuju paru-paru.' },
  { id: 'pulmonary_veins', name: 'Vena pulmonalis', group: 'Pembuluh besar', color: 0xc52a38, position: [0.55, 0.84, -0.02], scale: [0.18, 0.56, 0.18], description: 'Membawa darah dari paru-paru menuju atrium kiri.' },
  { id: 'left_atrium', name: 'Atrium kiri', group: 'Ruang jantung', color: 0xd13b48, position: [0.48, 0.5, 0.3], scale: [0.47, 0.45, 0.3], description: 'Ruang jantung yang menerima aliran dari vena pulmonalis.' },
  { id: 'left_ventricle', name: 'Ventrikel kiri', group: 'Ruang jantung', color: 0xc42637, position: [0.43, -0.36, 0.38], scale: [0.58, 0.83, 0.34], description: 'Ruang jantung yang memompa darah ke sirkulasi sistemik melalui aorta.' },
  { id: 'aorta', name: 'Aorta', group: 'Pembuluh besar', color: 0xe02e3b, position: [0.74, 0.98, 0], scale: [0.24, 0.77, 0.24], description: 'Arteri utama yang membawa darah dari ventrikel kiri menuju sirkulasi sistemik.' }
];

export const circulationSteps = [
  { title: 'Venae cavae', text: 'Aliran balik sistemik masuk melalui vena cava superior dan inferior.', id: 'superior_vena_cava', color: 'blue' },
  { title: 'Atrium kanan', text: 'Darah dari vena besar diterima di atrium kanan.', id: 'right_atrium', color: 'blue' },
  { title: 'Ventrikel kanan', text: 'Darah bergerak dari atrium kanan ke ventrikel kanan.', id: 'right_ventricle', color: 'blue' },
  { title: 'Jalur pulmonal', text: 'Ventrikel kanan mengalirkan darah menuju paru-paru melalui arteri pulmonalis.', id: 'pulmonary_artery', color: 'blue' },
  { title: 'Vena pulmonalis', text: 'Darah kembali dari paru-paru melalui vena pulmonalis.', id: 'pulmonary_veins', color: 'red' },
  { title: 'Atrium kiri', text: 'Vena pulmonalis bermuara ke atrium kiri.', id: 'left_atrium', color: 'red' },
  { title: 'Ventrikel kiri', text: 'Darah bergerak dari atrium kiri ke ventrikel kiri.', id: 'left_ventricle', color: 'red' },
  { title: 'Aorta', text: 'Ventrikel kiri memompa darah ke sirkulasi sistemik melalui aorta.', id: 'aorta', color: 'red' }
];

export const scenes = [
  { title: 'Landing & Loading', category: 'Orientasi', icon: '◉', description: 'Pengenalan simulasi dan kesiapan visualisasi.', detail: 'Model jantung skematis siap dijelajahi. Status WebGL dan dukungan perangkat diperiksa di browser.' },
  { title: 'Disclaimer & Start', category: 'Orientasi', icon: 'ⓘ', description: 'Pahami tujuan dan batasan simulasi.', detail: 'Materi ini merupakan visualisasi edukasional yang disederhanakan, bukan perangkat medis atau simulasi klinis.' },
  { title: 'Pilih Mode', category: 'Orientasi', icon: '⌘', description: 'Pilih jalur belajar yang sesuai.', detail: 'Mulai eksplorasi bebas, ikuti alur sirkulasi terpandu, atau kerjakan latihan singkat.' },
  { title: 'Eksplorasi 3D', category: 'Eksplorasi', icon: '◎', description: 'Kenali orientasi model jantung.', detail: 'Seret model untuk memutar, gulir untuk zoom, atau pilih nama struktur pada daftar.' },
  { title: 'Pilih Struktur', category: 'Eksplorasi', icon: '⌖', description: 'Pilih struktur dan baca keterangannya.', detail: 'Pilih struktur melalui model atau daftar. Nama dan keterangan singkat ditampilkan sebagai teks.' },
  { title: 'Isolasi & Konteks', category: 'Eksplorasi', icon: '◈', description: 'Amati struktur sambil mengelola konteks.', detail: 'Isolasi meredupkan struktur lain. Tampilkan semua untuk memulihkan konteks anatomi.' },
  { title: 'Ikhtisar Sirkulasi', category: 'Sirkulasi', icon: '↻', description: 'Lihat jalur pulmonal dan sistemik.', detail: 'Ikuti penanda bergerak pada alur delapan tahap. Warna merupakan konvensi edukasional.' },
  { title: 'Langkah Sirkulasi', category: 'Sirkulasi', icon: '⇢', description: 'Pelajari aliran tahap demi tahap.', detail: 'Gunakan navigasi sebelumnya dan berikutnya untuk meninjau struktur dan arah aliran.' },
  { title: 'Identifikasi Struktur', category: 'Latihan', icon: '✓', description: 'Coba identifikasi ruang jantung.', detail: 'Latihan singkat memberi umpan balik edukasional. Hasil bukan ukuran kompetensi klinis.' },
  { title: 'Urutan & Rangkuman', category: 'Latihan', icon: '☷', description: 'Susun alur sirkulasi dengan benar.', detail: 'Susun delapan tahap aliran, periksa jawaban, atau mulai ulang latihan.' },
  { title: 'Expert Review', category: 'Research', icon: '✳', description: 'Catat penilaian konten edukasional.', detail: 'Form ini membantu pencatatan review; bukan validasi medis atau pengganti tinjauan ahli independen.' },
  { title: 'Revisi & Bukti', category: 'Research', icon: '▤', description: 'Tinjau progres dan ekspor catatan lokal.', detail: 'Ekspor ringkasan sesi lokal untuk dokumentasi. Jangan masukkan informasi pribadi atau data pasien.' }
];
