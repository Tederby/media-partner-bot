import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSession() {
  console.log("==================================================");
  console.log("      Generate Session Login Instagram (Node.js)  ");
  console.log("==================================================");

  // Baca daftar akun
  const configPath = path.join(__dirname, 'config', 'daftar_akun.json');
  if (!fs.existsSync(configPath)) {
    console.error(`[ERROR] File konfigurasi tidak ditemukan di ${configPath}`);
    process.exit(1);
  }

  const akunData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  if (akunData.length === 0) {
    console.error("[ERROR] daftar_akun.json kosong!");
    process.exit(1);
  }

  // Gunakan akun pertama dari list untuk session generation ini
  // (Atau bisa dikembangkan dengan input prompt via stdin jika ingin interaktif)
  const username = akunData[0].username;
  const sessionDir = path.join(__dirname, 'sessions');
  const sessionFile = path.join(sessionDir, `${username}.json`);

  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  console.log(`[INFO] Membuat/Memperbarui sesi untuk akun: ${username}`);
  console.log(`[INFO] Lokasi sesi: ${sessionFile}`);
  console.log(`[INFO] Membuka browser Microsoft Edge... Silakan login secara manual.`);

  try {
    // Jalankan browser MS Edge dengan persistent context
    const browserContext = await chromium.launchPersistentContext(sessionDir, {
      channel: 'msedge',
      headless: false,
      viewport: { width: 1280, height: 800 },
    });

    const page = browserContext.pages()[0] || await browserContext.newPage();
    
    await page.goto('https://www.instagram.com/');

    console.log("\n==================================================");
    console.log("[ACTION REQUIRED]");
    console.log("1. Silakan login ke akun Instagram di jendela browser yang terbuka.");
    console.log("2. Selesaikan verifikasi 2FA jika ada.");
    console.log("3. Pastikan kamu sudah berada di halaman Beranda (Feed).");
    console.log("4. Browser BUKAN otomatis tertutup di mode ini. Tutup jendela browser secara manual JIKA SUDAH SELESAI LOGIN, script ini akan mendeteksinya dan menyimpan sesi.");
    console.log("==================================================\n");

    // Tunggu sampai browser ditutup oleh user
    await browserContext.waitForEvent('close', { timeout: 0 }); // 0 means wait indefinitely
    
    console.log(`\n[SUCCESS] Jendela browser ditutup. Sesi login untuk ${username} telah disimpan di ${sessionFile}.`);
    console.log(`[INFO] Sekarang kamu bisa menjalankan bot dengan perintah: npm start`);
    
  } catch (error) {
    console.error(`\n[ERROR] Terjadi kesalahan:`, error.message);
  }
}

generateSession();
