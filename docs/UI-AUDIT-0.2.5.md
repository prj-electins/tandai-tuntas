# Audit lokal 0.2.5 — 3 November 2026

## Perubahan

- Field subtugas menjadi satu kontrol: satu batas fokus, input dan tombol Tambah sejajar. Tombol kosong dinonaktifkan; Enter kosong tidak mengirim formulir.
- Form tugas memakai pengantar penuh dan dua kolom sejajar. Tombol bawah tetap berada di area dialog, tanpa terpotong pada formulir panjang.
- Menu pengurutan menggunakan Radix dengan keyboard, Escape, pilihan aktif, jarak tepi, dan warna tema yang konsisten.
- Tinggi kontrol, jarak form, teks panjang, tampilan gelap, dan kartu angka pada layar lebih sempit dirapikan.
- Preview widget memuat beberapa contoh tugas sesuai ukuran, judul satu baris, baris tugas dibatasi, dan tanggal ringkas.
- DMG memakai latar 660×420 dengan ikon aplikasi di x170/y210, panah di sumbu y210, dan Applications di x490/y210. Posisi sudah diperiksa secara visual melalui Finder.
- Notifikasi untuk tugas Dikerjakan dengan tenggat hari ini, dikelompokkan dan disimpan per tugas/hari/profil agar tidak berulang saat reload. Klik notifikasi membuka tugas pada ruang kerja yang tepat.
- Pengaturan menyediakan opsi pengingat dan tombol mencoba notifikasi. Browser bisa meminta izin melalui tombol tersebut; pengiriman tetap mengikuti izin perangkat.

## Pemeriksaan yang selesai

- TypeScript, build web, unit test model/ownership/request/rencana notifikasi.
- Integrasi D1/Worker serta API SQLite desktop.
- Aturan pengingat: tanggal, status, pilihan daily/reminders, dan pemisahan profil.
- Electron dengan profil dan database sementara: satu notifikasi ringkasan, tidak berulang setelah reload, halaman tanpa luapan horizontal pada 1320/1024 piksel dalam tema terang/gelap, menu keyboard, Enter kosong pada subtugas, pengaturan tampilan/cadangan/tentang, dan dialog panduan.
- Build komponen Swift WidgetKit, tanda tangan development Mac dan checksum DMG.
- Build EXE NSIS Windows; runtime utama dipastikan PE32+ x86-64 dan payload installer app-64.7z.

Tangkapan layar uji berada di `outputs/ui-audit-025/` dan menggunakan data buatan. Pengujian tidak mengubah data profil pengguna. Server pengembangan port 5173 tidak dijalankan.

## Batas pemeriksaan

Windows asli/VM tidak tersedia. Instalasi, toast, tray, autostart, font dan scaling 125%/150% pada Windows masih perlu diuji sesuai `WINDOWS-TESTING.md`. Paket Mac menggunakan tanda tangan development lokal; bukan rilis publik yang sudah dinotarisasi. Tampilan widget baru dikompilasi dan dipaketkan, tetapi tidak menggantikan widget versi terpasang sampai pengguna memasang pembaruan. Tampilan pada setiap ukuran/OS tidak dapat dijamin hanya dengan audit ini.

Pada saat audit, source belum didorong ke GitHub. Publikasi v0.2.5 dilakukan setelah audit dan pemeriksaan build tanpa folder .openai.
