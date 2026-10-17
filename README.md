# JawiPedia

**Enjin Jawi crowdsource** – tukar teks Rumi ke Jawi secara automatik, dan baiki ejaan bersama-sama komuniti.
Kamus asas + enjin hukum Jawi + undian komuniti. Sesuai juga untuk aplikasi sirah, pendidikan dan penulisan Jawi.

Dibina untuk komuniti pencinta Jawi oleh **Ahmad Suhaili Hassan**, sebagai sambungan kepada kamus asal yang dikompilasi oleh **Mohd Zamri Murah** (projek [goodmami/rumi-jawi](https://github.com/goodmami/rumi-jawi)).

> Semua ejaan Arab/nama dalam kamus (termasuk senarai sirah) **perlu disemak oleh ustaz / pakar Jawi** sebelum dijadikan rujukan rasmi.

---

## 1. Cara guna (untuk pengguna)

1. Buka laman JawiPedia.
2. Taip atau tampal ayat Rumi dalam kotak. Jawi keluar serta-merta di bawah.
3. Lihat **warna** setiap perkataan (jadual di bawah). Klik mana-mana perkataan untuk menyemak, menambah atau membaiki ejaan.
4. Tekan **Kosongkan** untuk mula semula.

### Maksud warna

| Warna | Maksud | Apa yang boleh dibuat |
|---|---|---|
| ⚫ Hitam | Ada dalam kamus | Klik → cadang ejaan baik pulih jika rasa salah |
| 🟢 Hijau | Disahkan komuniti (cukup undian) | Klik → boleh dibaiki semula (jadi Ungu) |
| 🔵 Biru | Ejaan baru, sedang menunggu undian | Undi jika setuju |
| 🟠 Oren | Pembetulan bagi ejaan kamus asal, sedang diundi | Undi jika setuju |
| 🟣 Ungu | Pembetulan semula bagi ejaan hijau, sedang diundi | Undi jika setuju |
| 🟡 Kuning | Teka enjin (ikut hukum Jawi) | Klik → sahkan atau betulkan |
| 🔴 Merah | Tiada ejaan | Klik → tambah ejaan |
| 🎀 Pink | Enjin beri **dua pilihan** (nama Arab, singkatan, typo) | Pilih satu; pilihan anda terus disahkan |

### Menambah / membetulkan ejaan
- **Merah / Kuning**: klik perkataan, taip ejaan Jawi, tekan hantar. Ia jadi **Biru** (menunggu undi).
- **Hitam / Hijau**: klik → "Baiki ejaan". Ia jadi **Oren** atau **Ungu**.
- **Pink**: klik dan pilih ejaan sebenar atau ejaan literal (ikut tulisan). Pilihan terus masuk Hijau tanpa undian.

### Membetulkan dua atau tiga perkataan sekali gus (Gabung)
Sesetengah ejaan hanya betul bila ditulis sebagai frasa, contohnya **masjidil haram**, **shamsul bahri**, **abdul manaf**.
1. Klik perkataan pertama.
2. Dalam kotak, tekan butang **gabung ke kiri / kanan** untuk menambah perkataan jiran (maksimum 3 patah).
3. Taip ejaan Jawi bagi keseluruhan frasa, kemudian hantar.

### Cadangan Komuniti (undian)
Tekan **Cadangan Komuniti (N)** untuk melihat semua ejaan yang sedang menunggu undian.
- **✅ UNDI** pada ejaan yang anda setuju. Cukup **5 undi** → jadi **Hijau** (disahkan).
- **Satu undi sahaja bagi satu perkataan**, sama ada ejaan lama atau ejaan baru.
- Anda **tidak boleh** mengundi ejaan yang anda cadangkan sendiri. Jika anda cadang ejaan lain, anda dikira sudah menggunakan suara anda bagi perkataan itu.
- **➕ Cadang ejaan lain**: jika tidak setuju dengan ejaan yang sedang diundi, hantar ejaan anda. Ia muncul **di bawah** ejaan lama dan boleh diundi bersama. Ejaan yang sampai 5 undi dahulu menang dan yang lain dibuang. Maksimum 5 cadangan lain bagi satu perkataan.

### 🎨 Cara Baca (belajar membaca Jawi)
Tandakan **Cara Baca** di atas kotak Jawi. Setiap perkataan Jawi dipecah mengikut **suku kata** dan setiap suku diberi **warna** berbeza. Di bawahnya ada **Panduan bacaan** yang memadankan warna dengan suku kata Rumi, contohnya ارنب → **AR** (biru) + **NAB** (hijau). Sentuh atau tuding pada perkataan untuk melihat suku katanya. Klik perkataan masih berfungsi seperti biasa. Pilihan anda diingat oleh pelayar. Perkataan yang tak dapat dipadankan (cth. frasa Arab seperti masjidil haram) kekal tanpa warna.

### Statistik masa nyata
Panel di bawah halaman: penukaran Rumi→Jawi, perkataan ditukar, pengguna, pengguna dalam talian, perkataan ditambah, pembetulan, undian, ejaan disahkan dan yang menunggu undian.

---

## 2. Apa yang enjin boleh buat
- **Kamus utama** (~66,000 perkataan) + **kamus tambahan** (~1,900 entri: sirah, istilah Pendidikan Islam, nama surah & kitab hadis, singkatan, kata -i, dll.).
- **Enjin hukum Jawi**: alif akhir, DARLUNG, suku kata, imbuhan (awalan & akhiran, termasuk `-nya`, `-ku`, `-mu`, `-lah`, `-kah` walau bergaris).
- **Nama Arab & gelaran**: Abdul/Abdur/Abdus + nama, nama idafah (shamsul bahri, nurul huda, baitul mal, ahlul bait), Masjidil/Masjid al-…, singkatan (Mohd, Hj., Dr.).
- **Typo**: salah satu huruf atau kata ganda tanpa garis (`sebaikbaik` → `sebaik-baik`) dicadangkan sebagai pilihan Pink.
- **Kata sandang Arab**: `al-Quran`, `as-Sunah` → ال + perkataan.
- **Pembaikan terkini:** apostrof lengkung (al-A’raf), huruf besar bersempang (Isnin-Khamis), akhiran Arab -iyyah (syamsiyyah → شمسية), dan ة→ت bila disambung -nya (rahmat-Nya → رحمتڽ).
- **Frasa sehingga 3 patah** dicari dalam kamus sekali gus.

### Kamus sirah
Lebih kurang 1,000 entri: nama sahabat dan tokoh, kabilah, tempat (Makkah, Madinah, Badar, Uhud...), peristiwa dan peperangan (Hijrah, Khandaq, Hudaibiyah...) dan istilah. Semuanya dalam `kamus_tambahan.js` (rujuk blok `SIRAH`). Senarai penuh untuk semakan: `senarai_sirah.txt`.

---

## 3. Susunan perkataan dipilih (keutamaan)
Hijau (disahkan) → Biru/Oren/Ungu (sedang diundi, ejaan undi tertinggi) → Kamus Tambahan → Kamus Asal → Enjin (Kuning/Pink) → Merah.

---

## 4. Fail dalam repositori

| Fail | Fungsi |
|---|---|
| `index.html` | Aplikasi utama (UI, undian, Firebase) |
| `kamus_2.js` | Kamus asas (goodmami/rumi-jawi) |
| `kamus_tambahan.js` | Kamus tambahan + singkatan chat (sirah, nama, kata -i) |
| `hukum_jawi.js` | Semua hukum Jawi dalam satu config |
| `enjin_jawi.js` | Enjin Rumi → Jawi |
| `cadang_arab.js` | Cadangan Pink: nama Arab, singkatan, typo, idafah |
| `cara_baca.js` | Cara Baca: pecah Jawi ikut suku kata berwarna |
| `firebase_rules_baru.json` | Peraturan Firebase Realtime Database |

---

## 5. Untuk pembangun / pentadbir

**Teknologi**: HTML + JavaScript statik, Tailwind (CDN), Firebase Realtime Database, hosting Netlify (auto-deploy daripada GitHub `main`). Tiada pelayan sendiri.

### Mengemas kini
1. Ubah fail dan commit ke cabang `main` melalui GitHub.
2. Netlify deploy secara automatik. Tekan hard refresh di pelayar.

### Firebase Rules (wajib sebelum guna ciri statistik & cadangan lain)
Firebase Console → **Realtime Database → Rules** → tampal isi `firebase_rules_baru.json` → **Publish**.

Struktur data:
```
approved/<rumi>           { jawi, timestamp }
pending/<rumi>            { jawi, type, votes, pencadang, voters{uid:true}, alts{id:{jawi,votes,pencadang,voters}} }
stats/<penukaran|perkataan|pengguna|tambahan|pembetulan|undian|diluluskan>   nombor
online/<uid>              true (kehadiran dalam talian)
```
Nota keselamatan: ini projek komuniti. Pengawal undi (satu undi, bukan pencadang) dibuat di sisi aplikasi, bukan sepenuhnya dalam rules. Pengguna yang mahir masih boleh memintasnya. Jika perlu lebih ketat, tambah Firebase Authentication.

### Ujian
```
node ujian_enjin.js     # contoh nota & imbuhan
node ujian_nama.js      # nama Arab, singkatan, typo
```

---

## 6. Kredit
- Kamus asas dikompilasi oleh **Mohd Zamri Murah** dan disahkan oleh Faizah Binte Zakaria, melalui projek [goodmami/rumi-jawi](https://github.com/goodmami/rumi-jawi) (GitHub: **goodmami**).
- Dibina oleh Ahmad Suhaili Hassan, bersama sumbangan komuniti.

## 7. Had yang diketahui
- Ejaan Arab, nama dan istilah sirah belum disemak pakar.
- Enjin hukum anggaran ketepatan sekitar 70% pada kata umum sahaja; perkataan Kuning perlu disahkan.
- Kemas kini pengguna dalam talian bergantung pada sambungan Firebase.
