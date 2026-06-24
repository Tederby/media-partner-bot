import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomDelay, sanitizeFilename } from './utils/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadJson(filepath) {
  if (!fs.existsSync(filepath)) {
    console.error(`[ERROR] File ${filepath} tidak ditemukan!`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (error) {
    console.error(`[ERROR] Gagal membaca ${filepath}:`, error.message);
    return null;
  }
}

async function processBot() {
  console.log("==================================================");
  console.log("     Instagram Media Partner Bot (Node.js)        ");
  console.log("==================================================");

  const akunConfigPath = path.join(__dirname, 'config', 'daftar_akun.json');
  const targetConfigPath = path.join(__dirname, 'config', 'target_medpart.json');

  const daftarAkun = loadJson(akunConfigPath);
  const targets = loadJson(targetConfigPath);

  if (!daftarAkun || !targets) {
    console.error("[ERROR] Konfigurasi JSON tidak valid. Keluar.");
    process.exit(1);
  }

  console.log(`[INFO] Berhasil memuat ${daftarAkun.length} akun dan ${targets.length} target medpart.`);

  for (const akun of daftarAkun) {
    const username = akun.username;
    // Gunakan direktori session yang konsisten dengan nama username
    const sessionDir = path.join(__dirname, 'sessions');
    const userSessionFile = path.join(sessionDir, `${username}.json`);

    console.log(`\n--------------------------------------------------`);
    console.log(`Memproses untuk akun: ${username}`);
    console.log(`--------------------------------------------------`);

    // Validasi apakah user pernah melakukan generate_session.js (terdapat file di sessionDir)
    // Di Node.js Playwright persistent context tidak menyimpan ke satu file JSON, 
    // tapi ke folder. Jadi kita asumsikan jika folder sessions/ ada isinya, berarti sudah siap.
    // Jika tidak ada sessionDir, kita beri peringatan.
    if (!fs.existsSync(sessionDir)) {
       console.log(`[WARNING] Folder sesi belum dibuat untuk ${username}.`);
       console.log(`[TIPS] Jalankan 'npm run session' terlebih dahulu.`);
       continue;
    }

    try {
      console.log(`[INFO] Membuka browser Microsoft Edge asli dengan sesi ${username}...`);
      
      const browserContext = await chromium.launchPersistentContext(sessionDir, {
        channel: 'msedge',
        headless: false,
        viewport: { width: 1280, height: 800 }
      });

      const page = browserContext.pages()[0] || await browserContext.newPage();

      for (let idx = 0; idx < targets.length; idx++) {
        const medpart = targets[idx];
        const namaMedpart = medpart.nama_medpart || `Medpart_${idx + 1}`;
        const instagramTargets = medpart.instagram_targets || [];

        if (instagramTargets.length === 0) {
          console.log(`[${namaMedpart}] Tidak ada target Instagram. Dilewati.`);
          continue;
        }

        const safeUsername = sanitizeFilename(username);
        const safeMedpart = sanitizeFilename(namaMedpart);
        
        // Manajemen Folder Bukti Terstruktur
        const medpartDir = path.join(__dirname, 'Bukti instagram', safeUsername, safeMedpart);
        if (!fs.existsSync(medpartDir)) {
          fs.mkdirSync(medpartDir, { recursive: true });
          console.log(`[${namaMedpart}] Membuat subfolder bukti: ${medpartDir}`);
        }

        console.log(`\n>>> [PROSES] Medpart: ${namaMedpart} (Target IG: ${instagramTargets.length})`);

        for (const targetObj of instagramTargets) {
          if (typeof targetObj !== 'object') {
            console.log(`[${namaMedpart}] Format data target tidak valid. Dilewati.`);
            continue;
          }

          const targetUsername = targetObj.username;
          const likeCount = targetObj.like_count || 0;

          if (!targetUsername) {
             console.log(`[${namaMedpart}] Username target kosong. Dilewati.`);
             continue;
          }

          const targetUrl = `https://www.instagram.com/${targetUsername}/`;
          console.log(`[${namaMedpart}] Mengunjungi profil @${targetUsername} (${targetUrl})...`);

          try {
            await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(4000); // Tunggu halaman stabil
          } catch (e) {
            console.log(`[${namaMedpart}] Gagal memuat profil @${targetUsername}: ${e.message}`);
            continue;
          }

          // --- PROSES FOLLOW ---
          let followBtn = null;
          let alreadyFollowing = false;

          try {
             // Deteksi "Sudah Follow" (Following/Mengikuti/Requested)
             const followingLocators = page.locator("button, div[role='button']").filter({ hasText: /^(Following|Mengikuti|Requested|Diminta)$/i });
             if (await followingLocators.count() > 0 && await followingLocators.first().isVisible()) {
                alreadyFollowing = true;
             } else {
                // Deteksi tombol "Follow"
                const followLocators = page.locator("button, div[role='button']").filter({ hasText: /^(Follow|Ikuti|Follow Back|Ikuti Balik)$/i });
                if (await followLocators.count() > 0 && await followLocators.first().isVisible()) {
                   followBtn = followLocators.first();
                }
             }
          } catch (err) {
             console.log(`[${namaMedpart}] Error saat mencari elemen Follow:`, err.message);
          }

          const safeTargetUsername = sanitizeFilename(targetUsername);
          const screenshotFollowPath = path.join(medpartDir, `${safeUsername}-${safeTargetUsername}-follow.png`);

          if (alreadyFollowing) {
             console.log(`[${namaMedpart}] Akun sudah ter-follow sebelumnya. Mengambil screenshot bukti...`);
             await page.screenshot({ path: screenshotFollowPath });
             console.log(`[${namaMedpart}] Bukti disimpan ke: ${screenshotFollowPath}`);
          } else if (followBtn) {
             console.log(`[${namaMedpart}] Menemukan tombol Follow. Mengklik...`);
             await followBtn.click();
             
             // --- VERIFIKASI FOLLOW ---
             try {
                console.log(`[${namaMedpart}] Menunggu verifikasi Follow (perubahan tombol)...`);
                const verifyFollowing = page.locator("button, div[role='button']").filter({ hasText: /^(Following|Mengikuti|Requested|Diminta)$/i }).first();
                await verifyFollowing.waitFor({ state: 'visible', timeout: 5000 });
                console.log(`[${namaMedpart}] Berhasil diverifikasi: Status akun sekarang Followed/Requested.`);
             } catch (e) {
                console.log(`[${namaMedpart}] [WARNING] Verifikasi Follow timeout. Mengambil screenshot apa adanya.`);
             }

             await randomDelay(3, 7);
             await page.screenshot({ path: screenshotFollowPath });
             console.log(`[${namaMedpart}] Bukti follow disimpan ke: ${screenshotFollowPath}`);
          } else {
             // Fallback
             console.log(`[${namaMedpart}] Tombol Follow tidak terdeteksi (private/error). Mengambil screenshot bukti...`);
             await page.screenshot({ path: screenshotFollowPath });
          }

          // --- PROSES LIKE ---
          if (likeCount > 0) {
            console.log(`[${namaMedpart}] Mulai proses Like untuk ${likeCount} postingan teratas @${targetUsername}...`);
            
            const postElements = await page.locator("a[href*='/p/'], a[href*='/reel/']").all();

            if (postElements.length === 0) {
               console.log(`[${namaMedpart}] Tidak menemukan postingan di profil @${targetUsername} (mungkin private/kosong).`);
            } else {
               let modalOpened = false;
               try {
                 console.log(`[${namaMedpart}] Mengklik postingan pertama untuk membuka modal...`);
                 await postElements[0].click();
                 await page.locator("div[role='dialog']").waitFor({ state: "visible", timeout: 8000 });
                 modalOpened = true;
               } catch (e) {
                 console.log(`[${namaMedpart}] Gagal membuka modal postingan: ${e.message}`);
                 modalOpened = false;
               }

               if (modalOpened) {
                  for (let i = 0; i < likeCount; i++) {
                    const dialog = page.locator("div[role='dialog']");
                    let likeBtn = null;
                    let alreadyLiked = false;

                    try {
                       const actionSection = dialog.locator("section").first();
                       
                       const unlikeSvg = actionSection.locator("svg[aria-label='Unlike'], svg[aria-label='Batal suka']").first();
                       const likeSvg = actionSection.locator("svg[aria-label='Like'], svg[aria-label='Suka']").first();

                       if (await unlikeSvg.isVisible()) {
                         alreadyLiked = true;
                       } else if (await likeSvg.isVisible()) {
                         likeBtn = likeSvg;
                       }
                    } catch (err) {
                       console.log(`[${namaMedpart}] Error mencari tombol like: ${err.message}`);
                    }

                    const screenshotLikePath = path.join(medpartDir, `${safeUsername}-${safeTargetUsername}-like-${i+1}.png`);

                    if (alreadyLiked) {
                      console.log(`[${namaMedpart}] Postingan ke-${i+1} sudah disukai sebelumnya.`);
                      await page.screenshot({ path: screenshotLikePath });
                    } else if (likeBtn) {
                      console.log(`[${namaMedpart}] Menyukai postingan ke-${i+1}...`);
                      await likeBtn.click();

                      // --- VERIFIKASI LIKE ---
                      try {
                        console.log(`[${namaMedpart}] Menunggu animasi Like dan verifikasi (perubahan ikon)...`);
                        const verifyUnlikeSvg = dialog.locator("section").first().locator("svg[aria-label='Unlike'], svg[aria-label='Batal suka']").first();
                        await verifyUnlikeSvg.waitFor({ state: 'visible', timeout: 5000 });
                        console.log(`[${namaMedpart}] Berhasil diverifikasi: Postingan telah di-like.`);
                      } catch (e) {
                        console.log(`[${namaMedpart}] [WARNING] Verifikasi Like timeout. Mengambil screenshot apa adanya.`);
                      }

                      await page.screenshot({ path: screenshotLikePath });
                      await randomDelay(3, 7);
                    } else {
                      console.log(`[${namaMedpart}] Tombol Like tidak ditemukan pada postingan ke-${i+1}.`);
                      await page.screenshot({ path: screenshotLikePath });
                    }

                    // Next post
                    if (i < likeCount - 1) {
                      let nextBtn = null;
                      const nextCandidates = await dialog.locator("svg[aria-label='Next'], svg[aria-label='Selanjutnya'], svg[aria-label='Berikutnya'], button[aria-label='Next'], button[aria-label='Selanjutnya'], button[aria-label='Berikutnya']").all();
                      
                      if (nextCandidates.length > 0) {
                        nextBtn = nextCandidates[0];
                      } else {
                        try {
                           const btn = await dialog.getByRole("button", { name: /^(Next|Selanjutnya|Berikutnya)$/i }).first();
                           if (btn) nextBtn = btn;
                        } catch (e) {}
                      }

                      if (nextBtn) {
                        console.log(`[${namaMedpart}] Mengklik Next untuk postingan ke-${i+2}...`);
                        await nextBtn.click();
                        await page.waitForTimeout(3000); // Wait for next post to load
                      } else {
                        console.log(`[${namaMedpart}] Tombol Next tidak ditemukan. Postingan mungkin sudah habis.`);
                        break;
                      }
                    }
                  }

                  console.log(`[${namaMedpart}] Menutup modal postingan...`);
                  await page.keyboard.press("Escape");
                  await page.waitForTimeout(1000);
               } else {
                 console.log(`[${namaMedpart}] Fallback navigasi langsung tidak diimplementasi secara penuh di versi ini untuk kesederhanaan. Dilewati.`);
               }
            }
          }
        }
      }

      await browserContext.close();
      console.log(`[INFO] Selesai memproses untuk akun: ${username}`);

    } catch (error) {
      console.error(`[ERROR] Terjadi kesalahan saat memproses akun ${username}:`, error.message);
    }
  }

  console.log("\n==================================================");
  console.log("      Otomatisasi Instagram Selesai Dijalankan    ");
  console.log("==================================================");
}

processBot();
