# Instagram Media Partner Bot (Node.js Playwright)

Bot otomatisasi berbasis Node.js dan Playwright untuk melakukan tugas Follow akun & Like postingan sesuai dengan target Media Partner yang ada di file.

> 🔒 **Aman & Privat:** Script ini berjalan secara lokal menggunakan Chromium/Edge dari Playwright dengan *Persistent Context*. Sesi login hanya tersimpan di komputermu sendiri (di folder `sessions/`). Tidak perlu memberikan password kepada siapapun.

## Persiapan (Setup)

1. Pastikan sudah menginstal **Node.js** (versi LTS terbaru direkomendasikan).
2. Install dependensi bot:
   ```bash
   npm install
   ```
3. Install browser engine bawaan Playwright (jika gagal memakai Edge bawaan):
   ```bash
   npx playwright install chromium
   ```

## Konfigurasi

Semua konfigurasi berada di folder `config/`.

1. Buka `config/daftar_akun.json`, ganti `username` dengan nama akun Instagram-mu.
2. Buka `config/target_medpart.json`, isi daftar target akun yang harus difollow dan dilike (sesuai persyaratan).

## Cara Penggunaan

Ada dua tahap dalam menjalankan bot ini:

### Tahap 1: Generate Sesi Login (Cukup Sekali)

Tahap ini bertujuan untuk login dan menyimpan sesi agar bot tidak perlu login berulang-ulang nantinya.

```bash
npm run session
```
- Browser akan terbuka, dan mengarah ke Instagram.
- **Login secara manual** seperti biasa.
- Setelah berhasil masuk ke beranda (Feed), **tutup browser secara manual**.
- Script akan menyimpan sesi tersebut ke dalam folder `sessions/`.

### Tahap 2: Menjalankan Bot Utama

Setelah punya sesi login, kamu bisa langsung melepas bot ini bekerja otomatis.

```bash
npm start
```

- Bot akan me-loop seluruh target medpart di `target_medpart.json`.
- Mencari profil, mengeklik *Follow*, dan *Like*.
- Mengambil **Screenshot** bukti dan menyimpannya secara rapi di dalam folder `Bukti instagram/[akun-kamu]/[nama-medpart]/`.

## Catatan Penting
- **Anti-Spam:** Bot ini dirancang dengan *random delay* antara 10-30 detik setiap melakukan klik (Follow/Like) agar aktivitasnya terlihat natural dan menghindari deteksi spam dari Instagram.
- Folder `sessions/` dan `Bukti instagram/` akan otomatis terbuat saat bot dijalankan.
