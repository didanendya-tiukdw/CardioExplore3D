export const structures = [
  { id: 'superior_vena_cava', name: 'Vena kava superior', group: 'Vena besar', color: 0x3974a3, position: [-0.58, 1.15, 0.02], scale: [0.24, 0.78, 0.24], description: 'Membawa darah dari bagian atas tubuh menuju atrium kanan.' },
  { id: 'inferior_vena_cava', name: 'Vena kava inferior', group: 'Vena besar', color: 0x3974a3, position: [-0.43, -1.02, 0.02], scale: [0.24, 0.65, 0.24], description: 'Membawa darah dari bagian bawah tubuh menuju atrium kanan.' },
  { id: 'right_atrium', name: 'Atrium kanan', group: 'Ruang jantung', color: 0xa92d3a, position: [-0.56, 0.48, 0.3], scale: [0.49, 0.48, 0.32], description: 'Ruang jantung yang menerima aliran balik vena sistemik.' },
  { id: 'right_ventricle', name: 'Ventrikel kanan', group: 'Ruang jantung', color: 0xa92d3a, position: [-0.4, -0.3, 0.34], scale: [0.56, 0.72, 0.32], description: 'Ruang jantung yang memompa darah menuju sirkulasi pulmonal.' },
  { id: 'pulmonary_artery', name: 'Arteri pulmonalis', group: 'Pembuluh besar', color: 0xc54550, position: [-0.16, 0.94, -0.02], scale: [0.2, 0.67, 0.2], description: 'Membawa darah dari ventrikel kanan menuju paru-paru.' },
  { id: 'pulmonary_veins', name: 'Vena pulmonalis', group: 'Pembuluh besar', color: 0x3974a3, position: [0.55, 0.84, -0.02], scale: [0.18, 0.56, 0.18], description: 'Membawa darah dari paru-paru menuju atrium kiri.' },
  { id: 'left_atrium', name: 'Atrium kiri', group: 'Ruang jantung', color: 0xa92d3a, position: [0.48, 0.5, 0.3], scale: [0.47, 0.45, 0.3], description: 'Ruang jantung yang menerima aliran dari vena pulmonalis.' },
  { id: 'left_ventricle', name: 'Ventrikel kiri', group: 'Ruang jantung', color: 0xa92d3a, position: [0.43, -0.36, 0.38], scale: [0.58, 0.83, 0.34], description: 'Ruang jantung yang memompa darah ke sirkulasi sistemik melalui aorta.' },
  { id: 'aorta', name: 'Aorta', group: 'Pembuluh besar', color: 0xc54550, position: [0.74, 0.98, 0], scale: [0.24, 0.77, 0.24], description: 'Arteri utama yang membawa darah dari ventrikel kiri menuju sirkulasi sistemik.' }
];

export const reviewDomains = [
  'Ketepatan anatomi',
  'Ketepatan terminologi',
  'Representasi visual',
  'Kejelasan alur sirkulasi',
  'Interaksi model 3D',
  'Relevansi untuk pembelajaran'
];

export const reviewFindings = [
  'Bentuk',
  'Posisi',
  'Proporsi',
  'Warna',
  'Terminologi',
  'Interaksi',
  'Informasi edukasional',
  'Alur sirkulasi',
  'Aksesibilitas'
];

export const reviewStatuses = [
  'Revisi diperlukan',
  'Diterima dengan revisi minor',
  'Diterima'
];

export const circulationSteps = [
  { title: 'Vena kava', text: 'Aliran balik sistemik masuk melalui vena kava superior dan inferior.', id: 'superior_vena_cava', color: 'blue' },
  { title: 'Atrium kanan', text: 'Darah dari vena besar diterima di atrium kanan.', id: 'right_atrium', color: 'blue' },
  { title: 'Ventrikel kanan', text: 'Darah bergerak dari atrium kanan ke ventrikel kanan.', id: 'right_ventricle', color: 'blue' },
  { title: 'Jalur pulmonal', text: 'Ventrikel kanan mengalirkan darah menuju paru-paru melalui arteri pulmonalis.', id: 'pulmonary_artery', color: 'blue' },
  { title: 'Vena pulmonalis', text: 'Darah kembali dari paru-paru melalui vena pulmonalis.', id: 'pulmonary_veins', color: 'red' },
  { title: 'Atrium kiri', text: 'Vena pulmonalis bermuara ke atrium kiri.', id: 'left_atrium', color: 'red' },
  { title: 'Ventrikel kiri', text: 'Darah bergerak dari atrium kiri ke ventrikel kiri.', id: 'left_ventricle', color: 'red' },
  { title: 'Aorta', text: 'Ventrikel kiri memompa darah ke sirkulasi sistemik melalui aorta.', id: 'aorta', color: 'red' }
];

export const scenes = [
  { title: 'Kesiapan Model', navTitle: 'Orientasi dan anatomi eksternal', category: 'Orientasi', icon: '◉', description: 'Pemeriksaan awal visualisasi anatomi jantung.', detail: 'Model jantung skematis dibuat secara prosedural untuk pembelajaran.' },
  { title: 'Batasan Pembelajaran', navTitle: 'Tujuan dan batasan simulasi', category: 'Orientasi', icon: 'ⓘ', description: 'Pahami tujuan dan batasan materi.', detail: 'Materi ini merupakan visualisasi edukasional yang disederhanakan, bukan perangkat medis atau simulasi klinis.' },
  { title: 'Pilih Mode Belajar', navTitle: 'Pilih jalur pembelajaran', category: 'Orientasi', icon: '⌘', description: 'Pilih jalur pembelajaran yang sesuai.', detail: 'Pilih eksplorasi anatomi, sirkulasi terpandu, atau evaluasi pemahaman.' },
  { title: 'Eksplorasi Anatomi', navTitle: 'Eksplorasi anatomi jantung', category: 'Anatomi', icon: '◎', description: 'Amati model jantung dari berbagai sudut.', detail: 'Seret model untuk memutar, gulir untuk memperbesar atau memperkecil, dan pilih struktur yang tersedia.' },
  { title: 'Identifikasi Struktur', navTitle: 'Identifikasi struktur', category: 'Anatomi', icon: '⌖', description: 'Pilih struktur yang tersedia pada model.', detail: 'Pilih struktur melalui model atau daftar. Informasi yang tersedia ditampilkan sebagai teks.' },
  { title: 'Isolasi Struktur', navTitle: 'Isolasi dan konteks anatomi', category: 'Anatomi', icon: '◈', description: 'Amati struktur terpilih dan konteksnya.', detail: 'Isolasi menampilkan struktur terpilih. Tampilkan semua untuk memulihkan konteks anatomi.' },
  { title: 'Ikhtisar Sirkulasi', navTitle: 'Sirkulasi sistemik dan pulmonal', category: 'Sirkulasi', icon: '↻', description: 'Tinjau jalur pulmonal dan sistemik.', detail: 'Ikuti penanda bergerak pada alur delapan tahap. Warna merupakan konvensi edukasional.' },
  { title: 'Langkah Aliran Darah', navTitle: 'Langkah aliran darah', category: 'Sirkulasi', icon: '⇢', description: 'Pelajari aliran tahap demi tahap.', detail: 'Gunakan tombol sebelumnya dan berikutnya untuk meninjau tiap tahap aliran.' },
  { title: 'Evaluasi Pemahaman', navTitle: 'Evaluasi pemahaman', category: 'Latihan', icon: '✓', description: 'Identifikasi ruang yang menerima aliran balik vena.', detail: 'Latihan singkat memberi umpan balik edukasional dan bukan ukuran kompetensi klinis.' },
  { title: 'Urutan Aliran Darah', navTitle: 'Urutan aliran darah', category: 'Latihan', icon: '☷', description: 'Susun tahap aliran darah secara berurutan.', detail: 'Latihan ini membantu meninjau delapan tahap sirkulasi.' },
  { title: 'Validasi Ahli Materi Kedokteran', navTitle: 'Validasi Ahli', category: 'Penelitian', icon: '✳', description: 'Evaluasi ketepatan anatomi, terminologi, representasi visual, interaksi, dan relevansi edukasional pada model jantung interaktif.', detail: 'Catat penilaian materi edukasional. Formulir ini bukan alat diagnosis atau pengambilan keputusan klinis.' },
  { title: 'Ringkasan Validasi', navTitle: 'Ringkasan Validasi', category: 'Penelitian', icon: '▤', description: 'Tinjau catatan sesi dan ekspor data yang tersimpan di perangkat.', detail: 'Ringkasan dan ekspor hanya mencakup data lokal pada browser ini.' }
];
