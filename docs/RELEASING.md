# Rilis GitHub

Repository menggunakan source utuh, bukan hanya hasil build. Jangan commit database pengguna, `.env`, token, `node_modules`, atau installer. Installer disimpan di GitHub Releases.

1. Ubah versi bersama-sama di `package.json`, `package-lock.json` (versi root), dan `lib/version.ts`. Perbarui `CHANGELOG.md`.
2. Jalankan pemeriksaan yang tercantum di README, lalu commit dan push ke main.
3. Buat tag anotasi, misalnya `git tag -a v0.2.2 -m "Tandai Tuntas v0.2.2"`, lalu `git push origin v0.2.2`.
4. Di GitHub Actions, pilih **Build installers → Run workflow**, isi tag tersebut. Alur ini sengaja manual agar setiap push tidak menghabiskan kuota build. Workflow membangun DMG arm64/x64 dan EXE x64, membuat ZIP source serta SHA256SUMS, kemudian membuat atau memperbarui rilis tag itu.
5. Uji installer di masing-masing sistem operasi sebelum menyatakan siap digunakan secara luas. Rilis privat hanya dapat diunduh oleh akun yang mendapat akses repository.

Rilis awal v0.2.1 memuat installer yang dibangun lokal dan source aplikasi yang sama. Workflow dapat dijalankan untuk membangun ulang paket dari tag. Tidak ada sertifikat Apple/Windows, notarization, ataupun pembaruan otomatis aktif. Mac: buka DMG lalu seret aplikasi ke Applications. Windows: jalankan EXE. Sistem operasi dapat menampilkan peringatan karena paket belum ditandatangani.

Untuk membuat repo publik nanti, tinjau hak distribusi dan kebijakan data lebih dahulu. Source ini belum diberi lisensi open source; kredit pengembang: arashy dev.
