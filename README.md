# 🤖 Instagram Media Partner Bot (Node.js)

Bot otomatisasi ini dibuat agar kamu tidak perlu lagi menekan tombol "Follow" dan "Like" satu per satu secara manual untuk syarat Media Partner. Cukup jalankan bot ini, biarkan browser bekerja secara ajaib di layarmu, dan semua bukti *screenshot* akan tersusun rapi di dalam folder!

> 🔒 **100% Aman & Privat:** Bot ini beroperasi langsung di laptop/PC-mu menggunakan browser bawaan. Akunmu hanya menyentuh komputermu sendiri (tanpa dikirim ke server orang lain). Tidak ada yang meminta atau mengetahui *password*-mu!

---

## 🛠️ Langkah 1: Persiapan (Hanya Sekali)

Jika kamu belum pernah menulis kode atau tidak paham programming, tenang saja! Ikuti langkah perlahan ini:

1. **Install Node.js (Wajib):**
   - Buka browser dan pergi ke: [https://nodejs.org/](https://nodejs.org/)
   - Download tombol hijau yang bertuliskan **"LTS"** (contoh: *v20.x.x LTS*).
   - Buka file yang sudah didownload, lalu install seperti biasa (klik *Next, Next, Install* sampai selesai).
2. **Download Proyek Ini:**
   - Download file proyek ini (atau `git clone` jika kamu paham Git).
   - Ekstrak foldernya, dan masuk ke folder tersebut.
3. **Membuka Terminal / CMD:**
   - Di dalam folder proyek, klik di bilah alamat (*address bar*) File Explorer paling atas.
   - Ketik `cmd` lalu tekan **Enter**. Jendela layar hitam (Terminal) akan muncul.
   - Atau klik kanan dan klik *Open in Terminal* ("Buka di Terminal")
4. **Install Modul Bot:**
   - Di Command Prompt atau Terminal tersebut, ketikkan perintah berikut dan tekan **Enter**:
     ```bash
     npm install
     ```
   - Tunggu sampai proses download selesai.

---

## ⚙️ Langkah 2: Atur Akun & Target

Semua pengaturan ada di dalam folder `config/`.

1. **Akun Kamu:** Buka file `config/daftar_akun.json` (bisa pakai Notepad). Ganti tulisan `afiffatin_06` (atau yang ada di situ) dengan **username Instagram kamu sendiri**.
2. **Target Media Partner:** Buka file `config/target_medpart.json`. Di situlah daftar akun-akun yang akan di-follow dan di-like. Formatnya biarkan sama, kamu hanya perlu mengubah bagian `"username"` dan `"like_count"` sesuai kebutuhan medpart-mu.

---

## 🔑 Langkah 3: Mengamankan Login (Cukup Sekali)

Agar kamu tidak perlu login berkali-kali setiap kali bot jalan, kita akan menyuruh bot menyimpan sesi login-mu secara aman di laptopmu.

1. Buka kembali Terminal/CMD (Langkah 1).
2. Ketik perintah ini dan tekan **Enter**:
   ```bash
   npm run session
   ```
3. Sebuah browser baru (Edge/Chrome) akan muncul.
4. **Login ke Instagram** di browser tersebut (masukkan username & password).
5. Setelah berhasil masuk ke Beranda (Feed), **TUTUP (silang X) jendela browser tersebut**.
6. Selesai! Bot sudah berhasil menyimpan sesimu.

---

## 🚀 Langkah 4: Jalankan Botnya!

Setelah sesi aman, kamu tinggal santai dan membiarkan bot bekerja.

1. Di Terminal/CMD, ketik:
   ```bash
   npm start
   ```
2. Tekan **Enter**.
3. Lepas mouse-mu! Browser akan terbuka sendiri, menuju profil-profil target satu per satu, mengklik Follow, mengklik Like, dan otomatis **mengambil Screenshot**.

> **Di mana letak Screenshotnya?**
> Coba lihat di dalam folder proyekmu, akan muncul folder baru bernama **`Bukti instagram`**. Semua fotomu sudah tersusun rapi dengan format nama yang jelas!

---

### 💡 Catatan Penting
* Jeda (*delay*) antara klik saat ini diatur menjadi **3 hingga 7 detik** secara acak agar terlihat seperti manusia asli dan tidak terdeteksi *spam* oleh Instagram.
* Dilarang menjalankan perintah ini saat kamu sedang nge-klik sana-sini di profil yang sama, biarkan bot yang mengendalikan layarnya.
