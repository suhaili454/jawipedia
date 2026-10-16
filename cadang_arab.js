// =====================================================================
//  CADANG_ARAB : cadangan DUA PILIHAN untuk nama / istilah Arab (warna PINK).
//    1. Ikut sebutan    : ejaan bunyi Melayu (hukum EnjinJawi)
//    2. Ikut makna asal : ejaan Arab kanonik (Abdul Gani -> عبد الغني)
//  Pengguna yang memutuskan. Enjin tak pernah pilih sendiri.
//
//  Guna:  EnjinJawi.cadang(['abdul','gani'])  ->  { n:2, rumi:'abdul gani', jenis:'nama', pilihan:[{label,jawi,nota},...] } | null
//         EnjinJawi.cadang(['abdulghani'])    ->  sama (satu perkataan bersambung)
//         EnjinJawi.cadang(['achmad'])        ->  Ahmad
//         EnjinJawi.cadangTypo('rumahh', cariAsas) -> cadangan typo (edit 1 huruf) | null
//
//  AMARAN: senarai di bawah ialah PERMULAAN. Ejaan Arab perlu disemak guru/ustaz atau komuniti,
//  dan boleh ditambah terus di bawah (satu baris satu entri).
// =====================================================================
(function (root) {
  'use strict';
  var E = (typeof module !== 'undefined' && module.exports && typeof require === 'function') ? require('./enjin_jawi') : root.EnjinJawi;

  // ---------- Awalan 'Abd' (hamba) ----------
  var ABD = ['abdul', 'abdur', 'abdus', 'abdal', 'abdel', 'abdol', 'abdu', 'abd'];

  // ---------- Nama Allah (selepas Abdul/Abdur ...) : [kanon, arab tanpa 'ال', maksud, varian] ----------
  var ASMA = [
    ['Ghani', 'غني', 'Maha Kaya', ['gani', 'ghoni', 'gany', 'ghany']],
    ['Ghaffar', 'غفار', 'Maha Pengampun', ['gapar', 'gafar', 'ghafar', 'gaffar', 'ghapar']],
    ['Ghafur', 'غفور', 'Maha Pengampun', ['gafur', 'ghafoor', 'gafoor']],
    ['Rahman', 'رحمن', 'Maha Pemurah', ['rahmaan', 'rahmen', 'rakhman', 'rachman', 'rahmon']],
    ['Rahim', 'رحيم', 'Maha Penyayang', ['raheem', 'rahiem', 'rakhim']],
    ['Razzaq', 'رزاق', 'Maha Pemberi Rezeki', ['razak', 'razaq', 'rezak', 'razzak', 'rezzak']],
    ['Karim', 'كريم', 'Maha Mulia', ['kareem', 'kharim']],
    ['Aziz', 'عزيز', 'Maha Perkasa', ['azis', 'azeez', 'aziiz']],
    ['Jabbar', 'جبار', 'Maha Gagah', ['jabar', 'jabaar']],
    ['Malik', 'ملك', 'Maha Raja', ['malek', 'maalik']],
    ['Wahhab', 'وهاب', 'Maha Pemberi', ['wahab', 'wahap', 'wahaab']],
    ['Latif', 'لطيف', 'Maha Halus', ['lateef', 'latip', 'lathif']],
    ['Hakim', 'حكيم', 'Maha Bijaksana', ['hakeem', 'hakiem']],
    ['Halim', 'حليم', 'Maha Penyantun', ['haleem', 'haliem']],
    ['Samad', 'صمد', 'Tempat Bergantung', ['samat', 'somad', 'shamad']],
    ['Qadir', 'قادر', 'Maha Berkuasa', ['kadir', 'qadeer', 'kadier', 'kader', 'khadir']],
    ['Hamid', 'حميد', 'Maha Terpuji', ['hameed', 'hamit']],
    ['Majid', 'مجيد', 'Maha Mulia', ['majeed', 'majit']],
    ['Wahid', 'واحد', 'Maha Esa', ['waheed', 'wahit']],
    ['Hadi', 'هادي', 'Pemberi Petunjuk', ['haadi', 'hady']],
    ['Basit', 'باسط', 'Pelapang', ['basith', 'baasit']],
    ['Fattah', 'فتاح', 'Pembuka', ['fatah', 'fatthah', 'fatar']],
    ['Alim', 'عليم', 'Maha Mengetahui', ['aleem', 'alem']],
    ['Mannan', 'منان', 'Pemberi Nikmat', ['manan', 'mannaan']],
    ['Shakur', 'شكور', 'Maha Mensyukuri', ['syukur', 'shukur', 'shakoor', 'sukur']],
    ['Wadud', 'ودود', 'Maha Pengasih', ['wadood']],
    ['Rauf', 'رؤوف', 'Maha Penyantun', ['raouf', 'rouf', 'rauff', 'raup']],
    ['Qayyum', 'قيوم', 'Maha Berdiri Sendiri', ['kayyum', 'qaiyum', 'kayum', 'qayum']],
    ['Salam', 'سلام', 'Maha Sejahtera', ['salaam', 'selam']],
    ['Muhaimin', 'مهيمن', 'Maha Memelihara', ['muhaymin', 'muheimin']],
    ['Mukmin', 'مؤمن', 'Pemberi Keamanan', ['mumin', 'mu\'min', 'mukmen']],
    ['Nasir', 'ناصر', 'Penolong', ['naser', 'nasser', 'nasyir']],
    ['Syahid', 'شهيد', 'Maha Menyaksikan', ['shahid', 'shaheed', 'sahid']]
  ];

  // ---------- Nama lazim (berdiri sendiri) : [kanon, arab, varian] ----------
  var NAMA = [
    ['Muhammad', 'محمد', ['mohammad', 'mohamad', 'muhamad', 'mohamed', 'muhammed', 'mohd', 'mehmet', 'mehmed', 'mahomet', 'muhamed', 'mamat']],
    ['Ahmad', 'أحمد', ['achmad', 'ahmed', 'akhmad', 'ahmat', 'ahmet', 'akhmat']],
    ['Mahmud', 'محمود', ['mahmood', 'mahmoud', 'mahmut']],
    ['Mustafa', 'مصطفى', ['mustapha', 'mostafa', 'mustafah', 'mustofa']],
    ['Ali', 'علي', ['aly', 'alie']],
    ['Umar', 'عمر', ['omar', 'omer', 'oemar']],
    ['Uthman', 'عثمان', ['osman', 'othman', 'usman', 'utsman', 'ustman']],
    ['Hasan', 'حسن', ['hassan', 'hasen']],
    ['Husain', 'حسين', ['hussein', 'husin', 'hussain', 'husen', 'hosein']],
    ['Ibrahim', 'إبراهيم', ['ebrahim', 'ibrahem', 'ibrahiem', 'brahim']],
    ['Ismail', 'إسماعيل', ['ismael', 'ishmael', 'ismayil', 'smail']],
    ['Yusuf', 'يوسف', ['yusof', 'yusoff', 'yusup', 'yousuf', 'yusop', 'joseph']],
    ['Musa', 'موسى', ['mousa', 'moosa']],
    ['Isa', 'عيسى', ['eesa', 'eisa']],
    ['Yahya', 'يحيى', ['yahia', 'yehya']],
    ['Zakaria', 'زكريا', ['zakariya', 'zakariah', 'zakaria', 'zakarya']],
    ['Sulaiman', 'سليمان', ['suleiman', 'sulaimon', 'sulayman', 'solaiman', 'slaiman']],
    ['Daud', 'داود', ['dawood', 'daoud', 'dawud', 'dawoud']],
    ['Khalid', 'خالد', ['khaled', 'kalid', 'kholid', 'halid']],
    ['Soleh', 'صالح', ['saleh', 'salleh', 'salih', 'solleh']],
    ['Idris', 'إدريس', ['idriss', 'edris', 'idres']],
    ['Ayub', 'أيوب', ['ayyub', 'ayob', 'ayoub', 'ayuub']],
    ['Yaakob', 'يعقوب', ['yaakub', 'yacub', 'yakub', 'yaqub', 'jakub']],
    ['Ishak', 'إسحاق', ['ishaq', 'ishaaq', 'isyak']],
    ['Harun', 'هارون', ['haroun', 'haroon', 'harune']],
    ['Lukman', 'لقمان', ['luqman', 'lokman', 'luqmaan']],
    ['Ridzuan', 'رضوان', ['redzuan', 'ridwan', 'rizwan', 'ridhuan', 'ridzwan', 'redhuan']],
    ['Fatimah', 'فاطمة', ['fatima', 'fatemah', 'fateemah', 'patimah', 'fatema']],
    ['Khadijah', 'خديجة', ['khadija', 'kadijah', 'khodijah', 'hadijah', 'cadijah']],
    ['Aisyah', 'عائشة', ['aishah', 'aisha', 'ayesha', 'aisyah', 'aysha', 'ayshah']],
    ['Maryam', 'مريم', ['mariam', 'meriam', 'maryum', 'mariyam']],
    ['Zainab', 'زينب', ['zaynab', 'zainap', 'zeinab', 'zaenab']],
    ['Halimah', 'حليمة', ['halima', 'haleemah']],
    ['Sarah', 'سارة', ['sara', 'sarrah']],
    ['Nur', 'نور', ['noor', 'nor', 'nour', 'nuur']],
    ['Bilal', 'بلال', ['belal', 'bilaal']],
    ['Hamzah', 'حمزة', ['hamza', 'hamzah']],
    ['Zaid', 'زيد', ['zaed', 'zayd', 'zeid']],
    ['Salman', 'سلمان', ['salmaan', 'selman']],
    ['Faisal', 'فيصل', ['faisol', 'feisal', 'faysal', 'faizal']],
    ['Amir', 'عامر', ['aamir', 'amer']],
    ['Rashid', 'راشد', ['rasyid', 'rashed', 'rasid', 'rashid']],
    ['Hashim', 'هاشم', ['hasyim', 'hashem', 'hasim', 'hasyem']],
    ['Syed', 'سيد', ['sayyid', 'sayed', 'said', 'sayid', 'seyed']]
  ];

  // ---------- Singkatan gelaran / nama (Mohd, Abd, Sh, Tn, Tgku, Teuku ...) ----------
  // kunci : [ [penuh, jawi sebenar], ... ]   lebih satu = singkatan kabur (Sh = Syeikh / Syah)
  // syarat : 'tanda' = mesti HURUF BESAR atau diikuti TITIK (elak bertembung dgn shortform chat: dr=dari, bt=buat)
  //          'titik' = mesti ada titik (b. bt.)       'bebas' = boleh huruf kecil
  // kamus:true = guna ejaan dalam kamus pengguna dahulu (cariAsas) jika ada.   PERLU SEMAKAN pakar bahasa.
  var SING = {
    mohd: { p: [['Muhammad', 'محمد']] }, mhd: { p: [['Muhammad', 'محمد']] }, muhd: { p: [['Muhammad', 'محمد']] }, md: { p: [['Muhammad', 'محمد']] },
    abd:  { p: [['Abdul', 'عبد']] },
    sh:   { p: [['Syarifah', 'شريفة']], k: 'syarifah' }, shfh: { p: [['Syarifah', 'شريفة']], k: 'syarifah' },
    tn:   { p: [['Tuan', 'توان']] },   pn: { p: [['Puan', 'ڤوان']] },   en: { p: [['Encik', 'انچيق']] },
    tgku: { p: [['Tengku', 'تڠکو']] }, tku: { p: [['Tengku', 'تڠکو']] }, tkku: { p: [['Tengku', 'تڠکو']] },
    teuku: { p: [['Teuku', 'تيوکو']], s: 'bebas' },
    hj:   { p: [['Haji', 'حاجي']] },   hjh: { p: [['Hajjah', 'حاجه']] },
    dr:   { p: [['Doktor', 'دوکتور']] }, prof: { p: [['Profesor', 'ڤروفيسور']] },
    dato: { p: [['Dato', 'داتوق']], k: 'datuk' }, dtk:  { p: [['Datuk', 'داتوق']], k: 'datuk' }, dtn: { p: [['Datin', 'داتين']], k: 'datin' },
    sdr:  { p: [['Saudara', 'سودارا']] }, sdri: { p: [['Saudari', 'سودري']] },
    ust:  { p: [['Ustaz', 'اوستاز']] }, ustz: { p: [['Ustaz', 'اوستاز']] },
    b:    { p: [['bin', 'بن']], s: 'titik' }, bt: { p: [['binti', 'بنت']], s: 'titik' }, bte: { p: [['binti', 'بنت']], s: 'titik' }
  };
  function cadangSingkatan(token, opt) {
    var k = String(token).toLowerCase(), e = SING[k]; if (!e || !opt) return null;
    var s = e.s || 'tanda';
    if (s === 'titik' && !opt.titik) return null;
    if (s === 'tanda' && !(opt.besar || opt.titik)) return null;
    var asal = String(token), literal = hukumEja(k, opt) || '';
    var pil = e.p.map(function (x) {
      var jawi = (e.k && opt.cariAsas && opt.cariAsas(e.k)) || x[1];
      return { label: e.p.length > 1 ? x[0] : 'ejaan sebenar', jawi: jawi, nota: asal + (opt.titik ? '.' : '') + ' = ' + x[0] };
    });
    pil.push({ label: 'ejaan literal', jawi: literal, nota: 'huruf seperti ditaip' });
    pil = pil.filter(function (x, i, a) { return x.jawi && a.findIndex(function (y) { return y.jawi === x.jawi; }) === i; });
    return pil.length < 2 ? null : { n: 1, rumi: k, jenis: 'singkatan', kanon: e.p[0][0], titik: !!opt.titik, pilihan: pil };
  }

  // ---------- Singkatan FRASA (mengandungi / atau .) : a/l  a/p  Y.Bhg.  Y.B.  Y.A.B.  Y.M. ----------
  // dieja PENUH dalam Jawi daripada kamus pengguna (cariAsas) ; jika tiada, guna ejaan dalam nilai 'f'.
  var FRASA = {
    'a/l':    { kunci: 'a_l',    kata: ['anak', 'lelaki'],              f: { anak: 'انق', lelaki: 'للاکي' } },
    'a/p':    { kunci: 'a_p',    kata: ['anak', 'perempuan'],           f: { anak: 'انق', perempuan: 'ڤرمڤوان' } },
    'y.bhg':  { kunci: 'y_bhg',  kata: ['yang', 'berbahagia'],          f: { yang: 'يڠ', berbahagia: 'بربهاݢيا' } }
  };
  function kunciFrasa(token) { return String(token).toLowerCase().replace(/\s+/g, '').replace(/\.$/, ''); }
  function cadangFrasa(token, opt) {
    var k = kunciFrasa(token), e = FRASA[k]; if (!e) return null;
    var penuh = e.kata.map(function (w) { return (opt && opt.cariAsas && opt.cariAsas(w)) || e.f[w]; }).join(' ');
    var literal = k.split(/([^a-z]+)/).map(function (x) { return /^[a-z]+$/.test(x) ? hukumEja(x, opt) : x; }).join('');
    return { n: 1, rumi: k, kunci: e.kunci, jenis: 'singkatan', kanon: e.kata.join(' '), pilihan: [
      { label: 'ejaan sebenar', jawi: penuh, nota: String(token) + ' = ' + e.kata.join(' ') },
      { label: 'ejaan literal', jawi: literal, nota: 'huruf seperti ditaip' }
    ] };
  }

  // ---------- Kunci fonetik : sama bunyi = sama kunci ----------
  function kunci(s) {
    s = String(s).toLowerCase().replace(/[^a-z]/g, '');
    s = s.replace(/ck/g, 'k').replace(/gh/g, 'g').replace(/kh|ch/g, 'h').replace(/sh|sy/g, 's')
         .replace(/th/g, 't').replace(/dh|dz|zh/g, 'd').replace(/ph/g, 'p').replace(/q/g, 'k').replace(/x/g, 'ks');
    s = s.replace(/[fv]/g, 'p').replace(/z/g, 's').replace(/d/g, 't').replace(/b/g, 'p');
    s = s.replace(/h$/, '');
    s = s.replace(/[aeiouy]+/g, 'a');
    return s.replace(/(.)\1+/g, '$1');
  }
  function lev1(a, b) {                          // jarak <= 1 ?
    if (a === b) return true; if (Math.abs(a.length - b.length) > 1) return false;
    var i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
    if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1);
    return a.length > b.length ? a.slice(i + 1) === b.slice(i) : b.slice(i + 1) === a.slice(i);
  }

  var IDX_ASMA = [], IDX_NAMA = [];
  function bina(arr, vi, out) { arr.forEach(function (e) { var ks = {}, vs = [e[0].toLowerCase()].concat(e[vi]); vs.forEach(function (v) { ks[kunci(v)] = 1; });
    out.push({ e: e, ks: Object.keys(ks), vs: vs }); }); }
  bina(ASMA, 3, IDX_ASMA); bina(NAMA, 2, IDX_NAMA);
  // padanan fonetik hanya sah jika huruf pertama sama & panjang dalam lingkungan 1 huruf daripada satu varian
  function hampir(it, w) { return it.vs.some(function (v) { return v[0] === w[0] && Math.abs(v.length - w.length) <= 1; }); }

  // padan : (1) varian tepat -> (2) kunci fonetik (mesti unik & >= 5 huruf) -> (3) jarak 1 pada kunci (>= 6 huruf)
  function padan(idx, w, getVar, fuzzy) {
    w = w.toLowerCase(); var i, j, k = kunci(w), hit = [];
    for (i = 0; i < idx.length; i++) { var e = idx[i].e; if (getVar(e).indexOf(w) >= 0 || e[0].toLowerCase() === w) return e; }
    if (w.length < 5 || !fuzzy) return null;
    for (i = 0; i < idx.length; i++) if (idx[i].ks.indexOf(k) >= 0 && hampir(idx[i], w)) hit.push(idx[i].e);
    if (hit.length === 1) return hit[0];
    if (hit.length > 1) return null;                                          // kabur : jangan putuskan
    if (k.length >= 6) for (i = 0; i < idx.length; i++) for (j = 0; j < idx[i].ks.length; j++)
      if (idx[i].ks[j].length >= 6 && lev1(k, idx[i].ks[j]) && hampir(idx[i], w)) hit.push(idx[i].e);
    return hit.length === 1 ? hit[0] : null;
  }
  var vAsma = function (e) { return e[3]; }, vNama = function (e) { return e[2]; };
  var padanAsma = function (w) { return padan(IDX_ASMA, w, vAsma, true); },                      // selepas Abdul/Abdur : konteks kuat -> fonetik dibenarkan
      padanNama = function (w, besar) { return padan(IDX_NAMA, w, vNama, !!besar); };         // berdiri sendiri : fonetik hanya jika huruf pertama BESAR

  // ---------- Pecah perkataan bersambung : abdulghani, abdurrahman, abdullah ----------
  function pecahAbd(w) {
    w = w.toLowerCase();
    if (/^abdullah$/.test(w)) return ['abdul', 'lah'];
    for (var i = 0; i < ABD.length; i++) {
      var p = ABD[i]; if (w.indexOf(p) !== 0 || w.length - p.length < 3) continue;
      var rest = w.slice(p.length); if (rest === 'lah') return [p, 'lah'];
      if (padanAsma(rest)) return [p, rest];
    }
    return null;
  }

  // ejaan Melayu bagi awalan Abd : Abdul = عبدول (wau lam di hujung, seperti Kamarul / Shamsul / Zainol)
  var ABD_MELAYU = { abdul: 'عبدول', abdur: 'عبدور', abdus: 'عبدوس', abdu: 'عبدو', abd: 'عبد', abdal: 'عبدل', abdel: 'عبدل', abdol: 'عبدول' };
  function ejaLit(x, opt) { return ABD_MELAYU[x] || hukumEja(x, opt); }
  function hukumEja(w, opt) { var r = E.eja(w, { cariAsas: opt && opt.cariAsas, imbuhan: true, tekaArab: true }); return r.jawi; }

  function binaNama(abd, comp, kata, opt) {            // abd = 'abdul' ; comp = ASMA entry | 'lah'
    var kanon, arab, nota;
    if (comp === 'lah') { kanon = 'Abdullah'; arab = 'عبد الله'; nota = 'Abdullah = Hamba Allah'; }
    else { kanon = 'Abdul ' + comp[0]; arab = 'عبد ال' + comp[1]; nota = kanon + ' = Hamba (Allah) Yang ' + comp[2]; }
    var bunyi = kata.map(function (w) { return ejaLit(w, opt); }).join(' ');
    return { kanon: kanon, arab: arab, nota: nota, bunyi: bunyi };
  }


  // ---------- Nama / frasa majmuk Arab (idafah) : Shamsul Bahri, Nurul Huda, Darul Ehsan, Baitul Mal, Masjidil Haram ...
  //  perkataan pertama (Arab, tanpa ال) + akhiran sambungan (ul/un/ur/us/ud/ut/uz/ush/il/in/ir/is/id/it)
  //  perkataan kedua sesiapa pun -> diberi ال :  شمس + ال + كمال.   Perkataan pertama MESTI dalam IDAFAH1 (elak salah tangkap: betul, tutur, sampul).
  var IDAFAH1 = {
    // nama (nur, saif, shams ...)
    nur: 'نور', saif: 'سيف', sayf: 'سيف', saiful: 'سيف', shams: 'شمس', syams: 'شمس', badr: 'بدر', zain: 'زين', zayn: 'زين', ain: 'عين',
    khair: 'خير', khayr: 'خير', amir: 'أمير', amin: 'أمين', kamar: 'قمر', qamar: 'قمر', fakhr: 'فخر', fakhar: 'فخر', bahr: 'بحر', baher: 'بحر',
    nasr: 'نصر', izz: 'عز', izzat: 'عزة', fadhl: 'فضل', fadl: 'فضل', fadzl: 'فضل', jamal: 'جمال', kamal: 'كمال', taj: 'تاج', nizam: 'نظام',
    siraj: 'سراج', ziya: 'ضياء', diya: 'ضياء', dhiya: 'ضياء', hidayat: 'هداية', rahmat: 'رحمة', fath: 'فتح', fathi: 'فتح', ihsan: 'احسان',
    anwar: 'أنوار', najm: 'نجم', wazir: 'وزير', mulk: 'ملك', rusyd: 'رشد', rushd: 'رشد', hasan: 'حسن', hadi: 'هادي', rashid: 'رشيد',
    syahr: 'شهر', shahr: 'شهر', zahr: 'زهر', nazm: 'نظم', hilm: 'حلم', ilm: 'علم', imam: 'امام', salam: 'سلام', sabil: 'سبيل', sabeel: 'سبيل',
    jihad: 'جهاد', haq: 'حق', hakk: 'حق', hizb: 'حزب', ahl: 'أهل', rabb: 'رب', ulu: 'أولي', ul: 'أول', jabal: 'جبل', qasr: 'قصر',
    dar: 'دار', bait: 'بيت', baith: 'بيت', bayt: 'بيت', masjid: 'مسجد', madrasat: 'مدرسة', jamiat: 'جامعة', jamiah: 'جامعة',
    ikhwan: 'إخوان', anis: 'أنيس', asyraf: 'أشراف', ashraf: 'أشراف', burhan: 'برهان', latif: 'لطيف', majd: 'مجد', muhyi: 'محيي',
    mujahid: 'مجاهد', munir: 'منير', nashr: 'نشر', ridha: 'رضى', ridho: 'رضى', safwan: 'صفوان', sidq: 'صدق', syukr: 'شكر',
    taufiq: 'توفيق', yaqin: 'يقين', zuhd: 'زهد', wahyu: 'وحي', tarbiyyat: 'تربية', tajdid: 'تجديد', ummat: 'أمة', mahabbat: 'محبة',
    hijr: 'حجر', fitrat: 'فطرة', hikmat: 'حكمة', nikmat: 'نعمة', himmat: 'همة', ulum: 'علوم', ma: 'ماء'
  };
  // bentuk ejaan tak lazim untuk perkataan kedua (jika ada dalam kamus, kamus diutamakan)
  var IDAFAH2 = {
    huda: 'الهدى', bahri: 'البحري', bahar: 'البحر', bahr: 'البحر', anuar: 'الأنوار', anwar: 'الأنوار', din: 'الدين', deen: 'الدين',
    islam: 'الاسلام', iman: 'الايمان', nizam: 'النظام', amin: 'الأمين', asyraf: 'الأشراف', ashraf: 'الأشراف', nisa: 'النساء',
    nisak: 'النساء', ain: 'العين', ainie: 'العيني', hakim: 'الحكيم', ikhwan: 'الاخوان', akmal: 'الأكمل', syakirin: 'الشاكرين',
    afiqah: 'العافية', afiah: 'العافية', syuhada: 'الشهداء', hijrah: 'الهجرة', muttaqin: 'المتقين', muslimin: 'المسلمين',
    mukminin: 'المؤمنين', abidin: 'العابدين', arifin: 'العارفين', salihin: 'الصالحين', soleh: 'الصالح', qamar: 'القمر', kamar: 'القمر',
    shams: 'الشمس', syams: 'الشمس', nur: 'النور', noor: 'النور', fajar: 'الفجر', fajr: 'الفجر', haq: 'الحق', hak: 'الحق',
    ehsan: 'الإحسان', ihsan: 'الإحسان', naim: 'النعيم', aman: 'الأمان', hikmah: 'الحكمة', quran: 'القرآن', mal: 'المال', maal: 'المال',
    makmur: 'المعمور', maqdis: 'المقدس', haram: 'الحرام', aqsa: 'الأقصى', nabawi: 'النبوي', bait: 'البيت', salam: 'السلام',
    ulum: 'العلوم', hadith: 'الحديث', mardhiah: 'المرضية', mardiah: 'المرضية', mardiyyah: 'المرضية', kamal: 'الكمال', jamal: 'الجمال',
    nadi: 'النادي', mubarak: 'المبارك', barakah: 'البركة', rahmah: 'الرحمة', rahmat: 'الرحمة', nahdah: 'النهضة', fikr: 'الفكر', fikir: 'الفكر'
  };
  function pecahIdafah1(w) {
    var m = /^(.+?)(ul|un|ur|us|ud|ut|uz|ush|il|in|ir|is|id|it)$/.exec(w);
    if (m && IDAFAH1[m[1]]) return [m[1], IDAFAH1[m[1]]];
    return null;
  }
  function cadangIdafah(w, opt) {
    if (w.length !== 2) return null;
    var a = pecahIdafah1(w[0]); if (!a) return null;
    var kedua = IDAFAH2[w[1]] || null, nota2 = w[1];
    if (!kedua) { var c = padanAsma(w[1]); if (c) { kedua = 'ال' + c[1]; nota2 = c[0]; } }
    if (!kedua && opt && typeof opt.cariAsas === 'function') { var k = opt.cariAsas(w[1]); if (k) kedua = 'ال' + k; }   // mana-mana perkataan dalam kamus
    if (!kedua) { var h = hukumEja(w[1], opt); if (h) kedua = 'ال' + h; }                                                  // jika tiada : ikut hukum enjin
    if (!kedua) return null;
    return { kanon: a[0] + ' ' + nota2, arab: a[1] + ' ' + kedua, nota: w[0] + ' ' + w[1] + ' = ' + a[1] + ' ' + kedua + ' (ejaan Arab, dengan ال)',
             bunyi: w.map(function (x) { return hukumEja(x, opt); }).join(' ') };
  }


  // ---------- Abd + nama bukan Asmaul Husna (nama jahiliyah / sahabat / lain) : Abd Shams, Abdul Muttalib, Abd Manaf ...
  // [kanon, arab penuh selepas عبد (sudah termasuk ال jika ada), maksud, varian]
  var ABD_LAIN = [
    ['Shams', 'شمس', 'Hamba Matahari (nama jahiliyah)', ['syams', 'shamsi', 'syamsi']],
    ['Manaf', 'مناف', 'Hamba Manaf (nama jahiliyah)', ['manaff']],
    ['Muttalib', 'المطلب', 'Hamba al-Muttalib', ['mutalib', 'muthalib', 'mutolib', 'muttolib', 'mutallib', 'muttalip']],
    ['Uzza', 'العزى', 'Hamba al-Uzza (nama jahiliyah)', ['uzzah', 'ozza', 'uza']],
    ['Dar', 'الدار', 'Hamba al-Dar (nama jahiliyah)', ['daar']],
    ['Qais', 'قيس', 'Hamba Qais', ['qays', 'kais', 'keis']],
    ['Amr', 'عمرو', 'Hamba Amr', ['amru', 'amar']],
    ['Yaghuth', 'يغوث', 'Hamba Yaghuth (nama jahiliyah)', ['yaguth', 'yaghut']],
    ['Hilal', 'هلال', 'Hamba Hilal', ['helal']],
    ['Rabb', 'الرب', 'Hamba (al-)Rabb', ['rab', 'rabbi', 'rabi', 'rabbu']],
    ['Nasir', 'الناصر', 'Hamba (al-)Nasir', []],
    ['Aziz', 'العزيز', 'Hamba (al-)Aziz', []]
  ];
  function padanAbdLain(x) {
    x = String(x).toLowerCase();
    for (var i = 0; i < ABD_LAIN.length; i++) { var e = ABD_LAIN[i]; if (e[0].toLowerCase() === x || e[3].indexOf(x) >= 0) return e; }
    return null;
  }

  function cadang(kata, opt) {
    if (!kata || !kata.length) return null;
    var w = kata.map(function (x) { return String(x).toLowerCase(); });
    if (w.some(function (x) { return !/^[a-z']+$/.test(x); })) return null;
    var rumi = w.join(' '), hasil = null;
    if (w.length === 1 && SING[w[0]] && !(ABD.indexOf(w[0]) >= 0 && opt && opt.sambung)) { var sg = cadangSingkatan(w[0], opt); if (sg) return sg; }

    // (a) Abdul + nama Allah : dua perkataan, atau satu bersambung
    if (w.length === 2 && ABD.indexOf(w[0]) >= 0) {
      if (w[1] === 'lah') hasil = binaNama(w[0], 'lah', w, opt);
      else {
        var c = padanAsma(w[1]);
        if (c) hasil = binaNama(w[0], c, w, opt);
        else {
          var jl = padanAbdLain(w[1]);
          if (jl) hasil = { kanon: 'Abd ' + jl[0], arab: 'عبد ' + ((/^abd(ul|ur|us)$/.test(w[0]) && jl[1].indexOf('ال') !== 0) ? 'ال' : '') + jl[1], nota: 'Abd ' + jl[0] + ' = ' + jl[2], bunyi: w.map(function (x) { return ejaLit(x, opt); }).join(' ') };
          else if (/^[a-z']{3,}$/.test(w[1]) && !/^(bin|binti|dan|yang|dari|dengan|untuk|ini|itu|atau|telah|akan|pada|dalam|bte|bt)$/.test(w[1]) && !(opt && opt.cariAsas && opt.cariAsas(w[0] + ' ' + w[1]))) {       // nama lain selepas Abdul : عبد + ejaan perkataan itu (semak)
            var lain = (opt && opt.cariAsas && opt.cariAsas(w[1])) || hukumEja(w[1], opt);
            if (lain) hasil = { kanon: 'Abd ' + w[1], arab: 'عبد ' + (/^abd(ul|ur|us)$/.test(w[0]) ? 'ال' : '') + lain, nota: 'Abd + ' + w[1] + ' (bukan nama Allah dalam senarai; sila semak ejaan)', bunyi: w.map(function (x) { return ejaLit(x, opt); }).join(' ') };
          }
        }
      }
    } else if (w.length === 1) {
      var p = pecahAbd(w[0]);
      if (p) hasil = binaNama(p[0], p[1] === 'lah' ? 'lah' : padanAsma(p[1]), [w[0]], opt);
    }
    // (a2) nama majmuk Arab (Shamsul Bahri, Nurul Huda ...)
    if (!hasil && w.length === 2) hasil = cadangIdafah(w, opt);
    // (b) nama lazim berdiri sendiri
    if (!hasil && w.length === 1) {
      var n = padanNama(w[0], opt && opt.besar);
      if (n) hasil = { kanon: n[0], arab: n[1], nota: n[0] + ' (ejaan Arab kanonik)', bunyi: hukumEja(w[0], opt) };
    }
    if (!hasil || !hasil.bunyi || hasil.bunyi === hasil.arab) return null;
    return { n: w.length, rumi: rumi, jenis: 'nama', kanon: hasil.kanon, pilihan: [
      { label: 'ejaan sebenar', jawi: hasil.arab, nota: hasil.nota },
      { label: 'ejaan literal', jawi: hasil.bunyi, nota: 'ikut bunyi seperti ditaip' }
    ] };
  }

  // ---------- Typo (edit 1 huruf) : cadangan dua pilihan juga ----------
  function cadangTypo(w, cariAsas, opt) {
    w = String(w).toLowerCase(); if (w.length < 5 || !/^[a-z]+$/.test(w) || typeof cariAsas !== 'function') return null;
    if (cariAsas(w) || /^abd(u|ur|us|ul)?$/.test(w)) return null;   // 'abdul' bukan typo 'abdal'
    var abc = 'abcdefghijklmnopqrstuvwxyz', c = {}, i, j;
    for (i = 0; i < w.length; i++) c[w.slice(0, i) + w.slice(i + 1)] = 1;                                  // buang
    for (i = 0; i < w.length - 1; i++) c[w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2)] = 1;             // tukar tempat
    for (i = 0; i < w.length; i++) for (j = 0; j < 26; j++) { c[w.slice(0, i) + abc[j] + w.slice(i + 1)] = 1; c[w.slice(0, i) + abc[j] + w.slice(i)] = 1; }
    var hit = Object.keys(c).filter(function (x) { return x !== w && x.length >= 4 && cariAsas(x); });
    if (hit.length !== 1) return null;                                       // hanya bila calon tunggal
    var tulis = hukumEja(w, { cariAsas: cariAsas }), betul = cariAsas(hit[0]);
    if (!tulis || tulis === betul) return null;
    return { n: 1, rumi: w, jenis: 'typo', kanon: hit[0], pilihan: [
      { label: 'ejaan sebenar', jawi: betul, nota: 'adakah maksud anda "' + hit[0] + '"?' },
      { label: 'ejaan literal', jawi: tulis, nota: 'ikut tulisan (' + w + ')' }
    ] };
  }


  // ---------- Perkataan Melayu dieja Inggeris (budget/bajet, computer/komputer, corner/kona ...) ----------
  // Jadual : ejaan Inggeris -> [ejaan Melayu, Jawi (pilihan; jika tiada, ambil dari kamus pengguna)].  Tambah di sini.
  var INGGERIS = {
    budget: ['bajet'], computer: ['komputer'], goal: ['gol'], offside: ['ofsaid'], penalty: ['penalti'], foul: ['faul'],
    camera: ['kamera'], corner: ['kona', 'کونا'], referee: ['refri', 'ريفري'], university: ['universiti'], station: ['stesen'],
    service: ['servis'], project: ['projek'], programme: ['program'], technology: ['teknologi'], social: ['sosial'],
    discount: ['diskaun'], image: ['imej'], application: ['aplikasi'], telephone: ['telefon'], organisation: ['organisasi'],
    organization: ['organisasi'], fashion: ['fesyen'], club: ['kelab'], doctor: ['doktor'], cafe: ['kafe'], coffee: ['kopi']
  };
  // Corak ejaan Inggeris -> Melayu (dicuba berganda; hanya diterima jika hasilnya ADA dalam kamus dan calon tunggal)
  var RULES = [
    [/ation$/, 'asi'], [/tion$/, 'syen'], [/sion$/, 'syen'], [/ity$/, 'iti'], [/ty$/, 'ti'], [/ive$/, 'if'], [/ic$/, 'ik'],
    [/ism$/, 'isme'], [/ture/, 'char'], [/ck/g, 'k'], [/ph/g, 'f'], [/ee/g, 'i'], [/oo/g, 'u'], [/qu/g, 'kw'], [/x/g, 'ks'],
    [/c(?=[eiy])/g, 's'], [/c/g, 'k'], [/y$/, 'i'], [/y/g, 'i'], [/e$/, ''], [/(.)\1/g, '$1'], [/ou/g, 'au'], [/th/g, 't'],
    [/ght/g, 't'], [/ch/g, 'c'], [/sh/g, 'sy'], [/j/g, 'j'], [/w/g, 'w']
  ];
  var CIRI_INGGERIS = /ck|tion|sion|ght|ee|oo|ou|ph|qu|wh|tch|dge|ew\b|ough/;
  function kelihatanInggeris(w) { return CIRI_INGGERIS.test(String(w).toLowerCase()); }
  function terbit(w) {
    var out = {}, mula = [w], lapis, i, j, n = 0;
    out[w] = 1;
    for (lapis = 0; lapis < 3; lapis++) {
      var baru = [];
      mula.forEach(function (x) { for (i = 0; i < RULES.length; i++) { var y = x.replace(RULES[i][0], RULES[i][1]); if (y !== x && y.length >= 3 && !out[y]) { out[y] = 1; baru.push(y); if (++n > 400) return; } } });
      mula = baru;
    }
    delete out[w]; return Object.keys(out);
  }
  function cadangInggeris(w, cariAsas, opt) {
    w = String(w).toLowerCase(); if (!/^[a-z]+$/.test(w) || w.length < 4 || typeof cariAsas !== 'function') return null;
    if (cariAsas(w)) return null;
    var m = null, jawi = null, nota;
    if (INGGERIS[w]) { m = INGGERIS[w][0]; jawi = cariAsas(m) || INGGERIS[w][1] || null; }
    else if (kelihatanInggeris(w)) {
      var hit = terbit(w).filter(function (x) { return x.length >= 5 && cariAsas(x); });
      if (hit.length === 1) { m = hit[0]; jawi = cariAsas(m); }
    }
    if (!m || !jawi) return null;
    var lit = hukumEja(w, opt || {}) || ''; if (!lit || lit === jawi) return null;
    return { n: 1, rumi: w, jenis: 'inggeris', kanon: m, pilihan: [
      { label: 'ejaan Melayu', jawi: jawi, nota: w + ' = ' + m + ' (ejaan Melayu)' },
      { label: 'ejaan literal', jawi: lit, nota: 'ikut huruf seperti ditaip' }
    ] };
  }

  E.cadangInggeris = cadangInggeris; E.kelihatanInggeris = kelihatanInggeris; E._INGGERIS = INGGERIS;
  E.cadang = cadang; E.cadangFrasa = cadangFrasa; E.kunciFrasa = kunciFrasa; E.cadangSingkatan = cadangSingkatan; E._SING = SING; E.cadangTypo = cadangTypo; E._kunci = kunci;
  if (typeof module !== 'undefined' && module.exports) module.exports = { cadang: cadang, cadangTypo: cadangTypo, kunci: kunci, ASMA: ASMA, NAMA: NAMA };
})(typeof window !== 'undefined' ? window : globalThis);
