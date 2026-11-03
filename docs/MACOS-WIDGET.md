# Widget macOS — pengujian lokal

Widget asli dibuat dengan SwiftUI/WidgetKit, untuk macOS 14 atau lebih baru dan Apple Silicon. Source berada di `desktop/macos`. App Group menyimpan hanya nama ruang kerja dan maksimal 20 tugas aktif (judul, tenggat, ID). Kata sandi, sesi, catatan dan database tidak dibagikan. Pengguna harus mengaktifkannya di Pengaturan → Tampilan. Keluar/kunci profil atau menonaktifkan opsi menghapus snapshot; macOS menentukan kapan tampilan widget diperbarui.

## Build

Perlu SDK macOS dengan SwiftUI/WidgetKit serta identitas Apple Development dan Team ID yang sah. Jangan menyimpan sertifikat atau private key dalam repository.

1. Atur `TANDAI_WIDGET_SIGN_IDENTITY` dan `TANDAI_APPLE_TEAM_ID` sebagai environment variable lokal.
2. Jalankan `node scripts/package-macos-widget.mjs`. Script mengompilasi komponen native dan Electron, menyertakan extension/helper, menandatangani paket development, memverifikasi signature, lalu membuat DMG uji lokal di `outputs/native-release/`.
3. Untuk distribusi umum, evaluasi Developer ID/notarisasi dan provisioning App Groups. Paket development lokal bukan pengganti distribusi resmi. Tidak perlu mengunggah sertifikat/private key ke repository.

Pasang di Applications, buka aplikasinya sekali, aktifkan widget pada pengaturan, lalu buka Edit Widgets di desktop. Pilih Tandai Tuntas dalam ukuran kecil/sedang/besar. Klik tugas menggunakan URL `tandaituntas://task?workspace=...&id=...`. Aplikasi memeriksa bahwa ruang kerja tersebut milik profil aktif sebelum membukanya. Jika belum masuk, buka profil terlebih dahulu.

## Background

Aplikasi dapat tetap aktif setelah jendela ditutup. Ikon centang pada menu bar menyediakan Buka, Catatan tugas, Kunci profil, dan Keluar. Pengaturan mulai saat login memakai layanan login macOS; pengguna bisa menonaktifkannya melalui System Settings → General → Login Items. Peluncuran saat login menyembunyikan jendela utama. Tidak mengaktifkan startup otomatis tanpa pilihan pengguna. Widget bawaan dapat menampilkan snapshot terakhir saat aplikasi keluar; perubahan tugas diperbarui oleh aplikasi dan jadwal WidgetKit.

Windows tetap memakai catatan tugas dan tray, tidak memakai WidgetKit.

## Verifikasi galeri

Pastikan versi aplikasi di Applications sama dengan paket uji, dan folder `Contents/PlugIns/TandaiTasks.appex` benar-benar ada. `pluginkit -m` hanya membuktikan pencatatan extension, bukan keberhasilan peluncuran. Periksa galeri Edit Widgets dan log chronod/TandaiTasks untuk memastikan descriptor dapat dimuat tanpa crash.

Build memakai entry point Foundation `_NSExtensionMain` sambil mempertahankan main Swift serta metadata entry Swift. Menggunakan main Swift secara langsung pada paket uji sebelumnya menyebabkan crash ExtensionFoundation sebelum descriptor widget tersedia.
