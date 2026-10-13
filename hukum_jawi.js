// =====================================================================
//  HUKUM_JAWI : semua peraturan ejaan Rumi -> Jawi dalam SATU fail config.
//  Ubah di sini sahaja; enjin_jawi.js tak perlu disentuh.
//  Sumber: corak yang disahkan terhadap kamus_2.js (goodmami/rumi-jawi) +
//  contoh Hukum KT / DARLUNG / 3 suku kata. Tandaan [DATA] = diukur dari kamus.
// =====================================================================
var HUKUM_JAWI = {

  // ---------- Huruf asas ----------
  konsonan: {
    b:'ب', c:'چ', d:'د', f:'ف', g:'ݢ', h:'ه', j:'ج', k:'ک', l:'ل', m:'م',
    n:'ن', p:'ڤ', x:'کس', q:'ق', r:'ر', s:'س', t:'ت', v:'ۏ', w:'و', y:'ي', z:'ز',
    ng:'ڠ', ny:'ڽ', sy:'ش', sh:'ش', kh:'خ', gh:'غ'
  },
  // k di penghujung suku kata (koda) -> qaf : kakak کاکق, kotak کوتق, emak امق
  kodaK: 'ق',
  // [DATA] pengecualian k koda -> kekal kaf ک :
  //   (1) k sebelum konsonan lain (aktif, bakti, struktur)           84% kaf
  //   (2) -ik akhir pada kata >= 3 suku kata (akademik, dinamik)     ~85% kaf ; 2 suku kata -> qaf (adik, balik)
  kodaKPengecualian: { sebelumKonsonan: 'kaf', ikAkhirMinSuku: 3, ikAkhirDuaSukuKaf: ['n'] },

  // ---------- Hukum alif akhir (a di hujung kata dasar) ----------
  // DARLUNG = Dal, Ra, Lam, Wau, Nga : alif akhir KEKAL (cara, lawa, pesara, bunga)
  darlung: ['d','r','l','w','ng'],
  // [DATA] huruf tambahan yang juga kekal alif selepas vokal 'a' (aha, jaha, paha)
  kekalSelepasA_tambahan: ['h'],
  // Selepas vokal a/ai/au : alif akhir GUGUR kecuali konsonan di atas  (masa ماس, kaca کاچ, nama نام)
  //   -> inilah "KT12": b c g j k m n p s t y (+ z/f bila kata pinjaman)
  // Selepas vokal e/i/o/u : alif akhir KEKAL kecuali konsonan di bawah (suka سوک, tiga تيݢ; kuda کودا, desa ديسا)
  gugurSelepasEIOU: ['k','g'],
  // Selepas vokal lain (dua-vokal: dua دوا, dunia دنيا) : alif sentiasa kekal.

  // ---------- Hukum 3 suku kata ke atas ----------
  // Alif pada suku kata pertama (Ca-...) digugurkan jika kata dasar >= 3 suku kata,
  // dan suku kata kedua juga a (harimau هريماو, cahaya چهاي, mahasiswa مهاسيسوا).
  // Kata majmuk (matahari) dikecualikan -> letak dalam pengecualian.
  // [DATA] diukur pada kata dasar kamus: corak a-a-x (3 suku kata, suku kata ke-2 terbuka 'a'): 68% gugur.
  hukum3Suku: { aktif: true, tepatSuku: 3 },

  // ---------- Vokal ----------
  vokal: {
    awal:  { a:'ا', e:'ا', i:'اي', o:'او', u:'او', ai:'اي', au:'او', oi:'اوي' },
    tengah:{ a:'ا', e:'',  i:'ي',  o:'و',  u:'و',  ai:'اي', au:'او', oi:'وي' },
    // e taling (ي) : guna senarai di bawah ; selain itu e = pepet (gugur di tengah)
    eTaling: { awal:'اي', tengah:'ي', akhir:'ي' },
    // e di hujung kata ditulis ي (metode ميتودى mengikut kamus: ى)
    eAkhir: 'ى'
  },

  // ---------- Imbuhan (untuk kata terbitan) ----------
  awalan: {
    'memper':'ممڤر','diper':'دڤر','meny':'مڽ','meng':'مڠ','mem':'مم','men':'من','me':'م',
    'peny':'ڤڽ','peng':'ڤڠ','pem':'ڤم','pen':'ڤن','pe':'ڤ','per':'ڤر',
    'ber':'بر','ter':'تر','di':'د','ke':'ک','se':'س'
  },
  akhiran: { 'kan':'کن','an':'ن','i':'ي','lah':'له','kah':'که','nya':'ڽ','ku':'کو','mu':'مو' },
  // [DATA] cara menyambung imbuhan pada akar (diukur pada kamus):
  sambungan: {
    // awalan nasal + akar bermula vokal e/i/o/u : alif awal akar gugur (mengudara مڠودارا, mengungguli مڠوڠݢولي)
    awalanNasal: ['meng','meny','mem','men','peng','peny','pem','pen'],
    // di/ke/se + akar bermula 'a' : alif -> alif-hamzah (diabadikan دأباديکن)
    awalanHamzah: ['di','ke','se'],
    // akar berakhir a + akhiran vokal : alif akar kekal ; -an -> ءن (kesamaan کساماءن), -i -> ي (merasai مراساي)
    // akar berakhir i/u/o + -an : ان (pemaduan ڤمادوان)
    hamzahAn: 'ءن', alifAn: 'ان',
    alifAnSelepas: ['u','o'],          // madu+an مادوان ; tetapi tali+an تالين (selepas i : tiada alif)
    // huruf pertama akar yang SAH selepas awalan nasal (tapis salah pecah: mengurut != men+gurut)
    nasalSah: {
      meng:'aeioukghq', peng:'aeioukghq', men:'dtcjszy', pen:'dtcjszy', mem:'bpfv', pem:'bpfv',
      meny:'', peny:''
    },
    // luluh : meN-/peN- + vokal -> huruf pertama akar yang luluh (menulis <- tulis)
    luluh: { meny:'s', peny:'s', meng:'k', peng:'k', mem:'p', pem:'p', men:'t', pen:'t' }
  },

  // ---------- e pepet / taling : tekaan lalai (e tak boleh dikenal daripada Rumi) ----------
  // [DATA] kebarangkalian taling pada kata dasar kamus: e awal kata 86% ; h+e 93% ; n+e 76% ; r+e (tengah) 68% ;
  //        selain itu pepet (be-, ke-, me-, se-, pe-, -er, -en : 84-100% pepet)
  // e awal kata: suku kata terbuka 90% taling ; koda n 71% ; k/ks/s/t 100% ; koda m/ng/r -> pepet (embah, enggan, erbium)
  eTalingLalai: { awalKata: true, awalKataKoda: ['n','k','ks','s','t'], onsetSukuPertama: ['h','n'], onsetTengah: ['r'],
                  // suku kata akhir tertutup: taling bila koda t/k/ng/h/s/l (89-99%); pepet bila r (75%), n/m bercampur
                  akhirTutupKoda: ['t','k','ng','h','s','l'],
                  // suku kata tengah tertutup: -ekt- / -ekn- (detektif, apendektomi) 100% taling
                  tengahTutupKoda: ['k'] },

  // ---------- e taling (senarai kecil; tambah di sini) ----------
  // format: kata -> senarai indeks 'e' (mula 0) yang taling. Selain senarai ini, e = pepet.
  eTalingKata: { beca:[0], meja:[0], pena:[0], desa:[0], teh:[0], sate:[0,1], kereta:[1], ekor:[0], enak:[0], esok:[0] },

  // ---------- Pengecualian (Rumi -> Jawi tepat, menang atas semua hukum) ----------
  pengecualian: {
    'matahari':'ماتاهاري',          // kata majmuk, tak kena hukum 3 suku kata
    'dunia':'دنيا',
    'cahaya':'چهاي',
    // pengecualian sebenar (tak ikut mana-mana hukum di atas) :
    'kita':'کيت',      // i+t sepatutnya kekal alif, tetapi kamus: کيت
    'harimau':'هريماو', // a-i-au : alif depan gugur (nota video) - bukan corak a-a-x
    'shah':'شاه',       // Parsi/Arab : alif kekal (syah شاه dalam kamus)
    'emak':'امق'       // e awal kata terbuka lazimnya taling, emak = pepet
  },

  // ---------- Penanda Arab / nama : perkataan mengandungi salah satu -> enjin TIDAK meneka ----------
  // (kekal merah supaya pengguna menyumbang; nama & frasa Arab dikendalikan oleh cadang_arab.js / kamus_tambahan)
  penandaArab: ['allah','abdul','abdur','abdus','rasul','darul','nurul','ibnu','assalam','alhamd','subhan','bismi',
                'masya','insya','waalaik','muhammad','mohamad','mohd','syed','sayyid','fisabil','wallah','billah','rahmat'],

  // ---------- Belum pasti (kekal dalam config supaya mudah disemak) ----------
  belumPasti: [
    'cahaya = چهاي (kamus) vs چاهاي (nota video) -> ikut kamus'
  ]
};
if (typeof module !== 'undefined') module.exports = HUKUM_JAWI;
