# Riwayat versi

## v0.2.5 — 3 November 2026

- Merapikan fokus input, field tambah, form dialog dan tombol bawah, serta menu pengurutan dengan keyboard.
- Merapikan jarak, ukuran kontrol, tampilan gelap, dan kartu angka di layar lebih sempit.
- Pengingat tugas Dikerjakan bertenggat hari ini, satu kali per tugas/hari dan dirangkum; klik membuka tugas.
- Layout DMG dengan ikon aplikasi, panah, dan Applications pada sumbu yang sama.
- Folder .openai opsional; clone bersih memakai hosting.config.json.
- Perbaikan AppUserModelID notifikasi serta ikon tray Windows. Installer x64 berhasil dibangun; uji Windows langsung masih diperlukan.

## v0.2.4 — perbaikan widget lokal

- Memperbaiki entry point extension agar melalui NSExtensionMain sebelum menjalankan WidgetKit.
- Menambahkan versi extension point untuk host widget macOS.
- Registrasi pluginkit saja tidak dianggap cukup; galeri perlu diverifikasi langsung.

## v0.2.3 — pengujian lokal, belum dipublikasikan

- Ikon menu bar/tray, kontrol background dan mulai saat login.
- WidgetKit macOS dengan snapshot tugas yang diaktifkan pengguna, tiga ukuran, dan tautan detail tugas.
- Komponen native ditandatangani untuk pengujian lokal; distribusi umum belum diverifikasi.

## v0.2.2 — perubahan lokal, belum dipublikasikan

- Tema sistem berubah langsung bersama pengaturan perangkat, termasuk halaman masuk.
- Pilihan tetap masuk selama 30 hari; menutup aplikasi tidak lagi mencabut sesi. Kunci profil dan keluar tetap tersedia.
- Widget tugas desktop: pilih ruang kerja, buka detail tugas, pindahkan jendela, dan pilihan selalu di depan.
- Pengujian sesi mencakup restart, kunci manual, dan login tanpa penyimpanan sesi.

## v0.2.1 — 1 November 2026

- Tampilan lebih sederhana: jarak dan bayangan kontrol dirapikan, checkbox proporsional, ikon tersimpan sesuai penyimpanan lokal.
- Panduan lima topik dan halaman Tentang aplikasi dengan versi serta kredit arashy dev.
- Profil terpisah dengan kata sandi, ruang kerja, pemulihan akun, dan penguncian otomatis.
- Tugas, proyek, kalender, serta produksi video dengan progres berbobot dan perhitungan biaya.
- Cadangan, pemulihan, draf, tempat sampah, dan database SQLite pada desktop.
- Paket Mac Apple Silicon, Mac Intel, dan Windows x64 tanpa sertifikat distribusi berbayar. Pembaruan dilakukan secara manual.

Paket Windows dan Mac Intel sudah dibangun; pengujian penggunaan pada perangkat Windows dan Mac Intel masih diperlukan. Tidak ada sinkronisasi cloud otomatis atau enkripsi file database.
