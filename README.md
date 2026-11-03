# Tandai Tuntas

Versi **0.2.5**  · Dikembangkan oleh **arashy dev**.

Ekstrak ZIP, buka folder `tandai-tuntas` di editor, lalu jalankan perintah di bawah. Source ini lengkap; `node_modules` dan hasil build dipasang/dibuat ulang. Gunakan **Node.js 24**, npm, dan Git. Tidak membutuhkan akun hosting untuk desktop.

Untuk mencoba desktop: `npm ci`, `npm run desktop:build`, lalu `npm run desktop:start`. Untuk membuat installer, lihat bagian Build desktop gratis.

Panduan rilis/tag dan GitHub Actions: [docs/RELEASING.md](docs/RELEASING.md). Riwayat versi: [CHANGELOG.md](CHANGELOG.md).

Aplikasi tugas, proyek, dan produksi video kreatif dengan beberapa profil dan workspace. Web memakai React/Vinext dan D1; desktop memakai Electron dan SQLite asli tanpa server/terminal terpisah.

## Menjalankan web lokal

Node 24 LTS atau lebih baru, npm, dan Git.

```sh
npm ci
npm run build
npm run db:init
npm run dev -- --hostname 127.0.0.1
```

Untuk hasil build: `npm start`. Database lokal berada di `.wrangler/state/v3/d1`. Migrasi di `drizzle/` diterapkan tanpa menghapus data. Jangan menghapus folder database. Web online dan desktop memiliki database terpisah; tidak ada sinkronisasi cloud otomatis.

## Build desktop gratis

```sh
npm ci
npm run desktop:build
# Mac Apple Silicon
npm run desktop:mac
# Mac Intel: setelah desktop:build
npx electron-builder --config electron-builder.yml --mac --x64 --publish never
# Windows x64
npm run desktop:windows
```

Installer berada di `outputs/releases/`. Mac berupa DMG: seret Tandai Tuntas ke Applications. Windows berupa installer NSIS EXE. Paket ini tanpa sertifikat distribusi berbayar dan tanpa notarisasi. Pemeriksaan keamanan sistem operasi tidak dilewati otomatis oleh aplikasi. Windows harus diuji pada perangkat Windows sebelum distribusi luas; build lintas platform saja tidak membuktikan seluruh perilaku Windows.

SQLite desktop disimpan melalui lokasi userData standar Electron, terpisah dari .app/.exe. Uninstall Windows dikonfigurasi mempertahankan data. Pilihan Tetap masuk di perangkat ini menjaga sesi hingga 30 hari, termasuk setelah aplikasi ditutup dan dibuka kembali. Keluar akun atau Kunci profil mencabut sesi. Desktop tidak lagi mengunci otomatis setelah 10 menit atau saat suspend; web lokal tetap memiliki penguncian saat tidak aktif. Kata sandi tidak disimpan sebagai teks. Aplikasi hanya membuka HTTP loopback 127.0.0.1:42137; port tetap menjaga draft dan preferensi browser internal tetap tersedia antar-startup. Tutup aplikasi sebelum mengganti versinya. Tidak ada terminal yang perlu dijalankan pengguna.

Jalur rilis gratis menggunakan pembaruan manual melalui installer baru. Cadangan file database dibuat sebelum migrasi versi baru. Integrasi updater opsional disiapkan di kode untuk kanal HTTPS yang dikonfigurasi lewat TANDAI_UPDATE_URL, tetapi tidak diaktifkan pada paket gratis ini; tidak ada janji pembaruan otomatis tanpa kanal distribusi dan persyaratan platform.

## Profil dan workspace

Setup lokal pertama hanya membuat/konfirmasi kata sandi minimal 12 karakter. Profil Pengguna dan workspace Pribadi dibuat otomatis. Profil tambahan memakai nama dan kata sandi sendiri; setiap profil dapat membuat workspace Pribadi/Pekerjaan dan lainnya. Hosting Sites tetap memakai ChatGPT; workspace baru dibuat terpisah per identitas.

Kode pemulihan ditampilkan sekali saat membuat profil atau mengganti keamanan akun. Server menyimpan hash kode, bukan teks aslinya. Pemulihan menggunakan kode akan mengganti kode dan mencabut sesi lama tanpa menghapus data. Profil lama dapat membuat kode pemulihan melalui Keamanan & data dengan kata sandi saat ini. Tidak ada pemulihan jika pengguna kehilangan kata sandi sekaligus kode. Kata sandi menggunakan scrypt, salt acak, dan rate limiting. Cookie HttpOnly/SameSite Strict, Secure pada HTTPS. File SQLite dan draft perangkat belum dienkripsi; pemisahan profil adalah kontrol akses aplikasi.

Pemilih workspace ada di sidebar. Keamanan & data mendukung ubah nama, arsip/aktifkan kembali, serta memindahkan pekerjaan. Proyek dipindahkan bersama tugas/video terkait; tugas/video yang dipindahkan sendiri dilepas dari proyek asal. Server memeriksa kepemilikan workspace dari sesi pada semua operasi. Data lama dipertahankan dalam workspace awal; pada hosting, klaim data lama memerlukan secret LEGACY_OWNER_EMAIL pemilik asli. Secret tidak disimpan dalam source.

## Penyimpanan dan pemulihan

- Tugas/proyek/video disimpan otomatis setelah perubahan berhenti sekitar satu detik dan kolom wajib valid. Tombol Simpan tetap tersedia.
- Draft yang belum tersimpan disimpan pada perangkat per workspace; buka kembali melalui Keamanan & data. Draft offline tidak disinkronkan ke perangkat lain.
- Cadangan otomatis dibuat sebelum perubahan pertama setiap enam jam; sepuluh snapshot terbaru disimpan per workspace. Cadangan manual juga tersedia. Ini bukan backup ke media eksternal: tetap ekspor JSON untuk melindungi dari kehilangan perangkat.
- Pemulihan snapshot/impor JSON membuat workspace baru, memvalidasi schema/relasi, dan membuat ID baru. Data aktif tidak ditimpa. Batas file JSON 20 MB; database hosting memiliki batas layanan tambahan.
- Penghapusan masuk tempat sampah; tersedia Urungkan/pulihkan. Proyek berisi pekerjaan harus dikosongkan terlebih dahulu. Tidak ada purge permanen melalui UI.
- Ekspor JSON mencakup workspace aktif. Ekspor SQL adalah arsip data; pemulihan dalam aplikasi memakai JSON.

## Produktivitas

Tugas: tenggat, prioritas, status, subtugas, catatan, daftar/Board, filter, pencarian, kalender. Daftar ditampilkan 50 tugas per halaman, Board 50 per kolom dengan muat lagi. Pengulangan harian/mingguan/bulanan membuat satu penerus ketika tugas diselesaikan. Bulanan menjepit tanggal ke akhir bulan; tidak menggandakan penerus saat permintaan diulang.

Pengingat diatur pada detail tugas. Web meminta izin notifikasi melalui tombol Aktifkan pengingat; desktop memakai notifikasi lokal. Pengingat berjalan ketika aplikasi aktif dan profil terbuka, termasuk workspace aktif lain milik profil tersebut. Tidak berjalan ketika aplikasi benar-benar berhenti atau profil terkunci.

Studio video mencakup brief, hook, naskah, B-roll, caption, CTA, overlay, perlengkapan, biaya, QC, dan rencana distribusi. Progres berbobot = jumlah(bobot aktif × progres tahap)/jumlah bobot aktif. Biaya = jumlah × hari × tarif + cadangan. Media biner tidak diunggah; simpan tautan aset dalam catatan. Aplikasi tidak mengedit/render atau menerbitkan video ke media sosial.

## API dan performa

GET /api/state?paged=1&offset=N mengambil paling banyak 250 item per jenis. UI memuat halaman sampai lengkap; indeks owner_id/updated_at membantu query workspace. POST dengan X-Tandai-Delta:1 mengembalikan hanya record/perubahan terkait; kontrak snapshot penuh tetap tersedia untuk kompatibilitas. Ini mengurangi pengiriman ulang seluruh workspace pada setiap edit. Startup masih menghidrasi seluruh workspace; belum streaming detail video sesuai kebutuhan.

GET/POST /api/workspaces mengelola workspace. /api/maintenance menangani snapshot, pemulihan, sampah, dan pemindahan. /api/reminders dibatasi profil terautentikasi. Semua query menggunakan prepared statements dan validasi Zod.

## Pemeriksaan

```sh
npm run check
npm test
npm run test:integration
npm run test:desktop
```

Tes integrasi memakai database sementara. Tes desktop mencakup SQLite asli, recovery, pencabutan sesi, recurring, delta, snapshot/restore, sampah, move/archive, dan 5.000 tugas. Benchmark adalah pengukuran lokal, bukan jaminan performa setiap perangkat. Uji Windows UI perlu perangkat Windows.

## Versi 0.2.1 — penyederhanaan tampilan

Checkbox memakai ukuran khusus agar tidak mengikuti tinggi kolom teks. Fokus keyboard tetap terlihat; bayangan kontrol dikurangi. Tanda penyimpanan memakai centang tanpa ikon awan, dan ikut mencerminkan perubahan tugas/proyek yang belum tersimpan. Panduan memiliki lima topik dengan langkah ringkas, bisa ditutup melalui Escape, dan mengembalikan fokus ke tombol pembuka.

Pengaturan memuat Tentang aplikasi: versi 0.2.1, Dikembangkan oleh arashy dev. Nomor versi desktop mengikuti package.json dan versi tampilan berasal dari lib/version.ts. Istilah tampilan memakai ruang kerja, papan, draf, dan unduh cadangan; ekspor SQL tetap tersedia melalui Pilihan lanjutan. Tombol Tambah tugas tidak ditampilkan pada halaman pengaturan.

## Perubahan lokal berikutnya

Tema Ikuti sistem merespons perubahan terang/gelap tanpa membuka ulang aplikasi. Profil baru memakai tema sistem secara bawaan; pilihan tema ruang kerja lama tetap dipertahankan.

Desktop: buka Pengaturan → Tampilan → Buka widget tugas, atau menu Tugas di desktop. Widget berupa jendela catatan yang bisa dipindahkan, diubah ukurannya, dan dipasang selalu di depan. Pilih ruang kerja dan klik tugas untuk membuka detail di aplikasi utama. Widget hanya tersedia selama aplikasi berjalan, bukan widget bawaan macOS WidgetKit. Tutup widget dengan ×; gunakan Quit untuk keluar dari aplikasi.

Widget asli macOS, proses background, dan build khusus Mac: [docs/MACOS-WIDGET.md](docs/MACOS-WIDGET.md).

Pengingat harian: tugas berstatus Dikerjakan dengan tenggat hari ini mendapat satu pengingat per tugas/hari ketika aplikasi aktif dan profil terbuka. Beberapa tugas dirangkum dalam satu notifikasi; status selesai dan tenggat hari lain tidak ikut. Pengaturan tersedia di Tampilan. Notifikasi tunduk pada izin sistem operasi. Status pemeriksaan Windows: [docs/WINDOWS-TESTING.md](docs/WINDOWS-TESTING.md).

## Konfigurasi hosting lokal

Folder `.openai/` opsional dan tidak disertakan dalam Git atau ZIP source. Build baru memakai `hosting.config.json` untuk binding DB. Metadata deployment lokal dapat diletakkan pada `.openai/hosting.json` sebagai override. Simpan token/kredensial pada secret environment, bukan pada file konfigurasi yang di-commit. Folder `dist/.openai/` adalah hasil build, bukan source atau kredensial.
