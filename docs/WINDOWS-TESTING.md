# Pemeriksaan Windows 0.2.5

Paket EXE x64 berhasil dibangun dari source terbaru. Runtime Windows pada `win-unpacked/Tandai Tuntas.exe` diperiksa sebagai PE32+ x86-64; installer NSIS memakai bootstrap 32-bit dan membawa `app-64.7z`, yang merupakan perilaku normal. Source memakai AppUserModelID yang sama dengan appId installer untuk notifikasi, ikon tray berwarna, serta jalur mulai saat login Windows. Widget macOS disembunyikan pada pengaturan Windows; catatan tugas tetap tersedia.

Belum dilakukan: menjalankan installer atau aplikasi pada Windows asli/VM, memverifikasi pemberian izin notifikasi, tampilnya toast/tray, protocol handler, dan autostart setelah reboot. Build lintas platform bukan pengganti uji tersebut. Tidak ada Windows/VM yang tersedia pada Mac pengembang saat audit ini.

## Uji pada Windows 10/11 x64

1. Pasang EXE ke folder pilihan dan buka aplikasi. Setup profil uji dengan kata sandi; pastikan data profil lain tetap terpisah.
2. Buat tugas bertenggat hari ini, ubah status ke Dikerjakan. Aktifkan kedua opsi Pengingat tugas di Pengaturan → Tampilan, lalu simpan. Izinkan notifikasi di pengaturan Windows jika diminta. Tunggu maksimal satu menit. Klik notifikasi untuk membuka detail tugas. Tutup/buka jendela dan pastikan pengingat hari yang sama tidak berulang.
3. Uji tugas Belum mulai, Selesai, dan tenggat besok: tidak boleh masuk pengingat Dikerjakan hari ini. Matikan pengingat: tidak boleh ada pengingat baru. Pengingat jadwal khusus tetap diuji terpisah.
4. Tutup jendela dengan background aktif: ikon tray harus tetap dapat membuka aplikasi. Keluar melalui tray harus menghentikan proses. Mulai saat login harus bisa diaktifkan/dimatikan; uji setelah restart.
5. Tutup/buka aplikasi dengan Tetap masuk: sesi harus bertahan. Keluar/kunci profil: data tidak boleh terbuka sampai autentikasi kembali.
6. Uji tema sistem, form tambah tugas/subtugas (Enter kosong tidak menyimpan form), menu urutan dengan keyboard, video, kalender, impor/ekspor, dan tampilan pada 100%/125%/150% scaling.
7. Pasang pembaruan dan uninstall: data pengguna tetap dipertahankan sesuai konfigurasi. Buat cadangan sebelum pengujian.

Catat versi Windows, scaling, hasil setiap langkah, dan tangkapan layar jika ada kegagalan.
