// =====================================================================
//  CARA_BACA : pecahkan perkataan Jawi mengikut suku kata Rumi, setiap suku diberi WARNA.
//  Tujuan : bantu orang belajar membaca Jawi (cth. ارنب -> AR (biru) + NAB (hijau)).
//
//  Cara kerja : (1) Rumi dipecah suku kata oleh EnjinJawi (_suku)
//               (2) huruf Rumi dipadankan dengan huruf Jawi (penjajaran DP, terima ejaan Arab: س ص ث ش ...)
//               (3) huruf Jawi dikumpulkan ikut suku kata -> warna
//
//  Guna :  CaraBaca.pecah('arnab', 'ارنب')  ->  [ {rumi:'ar',  jawi:'ار', warna:0},
//                                                  {rumi:'nab', jawi:'نب', warna:1} ]   atau null jika gagal padan
//          CaraBaca.html('arnab','ارنب')    ->  '<span class="cb c0">ار</span><span class="cb c1">نب</span>'
//          CaraBaca.WARNA                   ->  senarai warna (hex) untuk suku kata 0,1,2,...
//  Jawi tidak terputus sambungan kerana hanya <span> sebaris (bukan kotak) digunakan.
// =====================================================================
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory(require('./enjin_jawi.js'));
  else root.CaraBaca = factory(root.EnjinJawi);
})(typeof self !== 'undefined' ? self : this, function (E) {
  'use strict';

  var WARNA = ['#2563eb', '#16a34a', '#ea580c', '#9333ea', '#e11d48', '#0891b2'];   // biru, hijau, oren, ungu, merah jambu, biru kehijauan

  // ---- calon huruf Jawi bagi setiap unit Rumi : { jawi : kos } (kos kecil = lazim) ----
  var C = {
    b: { 'ب': 0 }, c: { 'چ': 0, 'ج': 1 }, d: { 'د': 0, 'ض': 0.4, 'ذ': 0.4, 'ظ': 0.8 }, f: { 'ف': 0, 'ڤ': 0.8 },
    g: { 'ݢ': 0, 'غ': 0.3, 'ڬ': 0.2, 'ك': 1, 'ک': 1 }, h: { 'ه': 0, 'ح': 0.2, 'خ': 0.8, 'ة': 0.5, 'ھ': 0.1 }, j: { 'ج': 0 },
    k: { 'ک': 0, 'ك': 0, 'ق': 0.2, 'خ': 0.8, 'ء': 0.6 }, l: { 'ل': 0 }, m: { 'م': 0 }, n: { 'ن': 0 }, p: { 'ڤ': 0, 'ف': 0.6 },
    q: { 'ق': 0, 'ک': 0.3 }, r: { 'ر': 0 }, s: { 'س': 0, 'ص': 0.2, 'ث': 0.2, 'ش': 0.6 }, t: { 'ت': 0, 'ط': 0.2, 'ة': 0.4 },
    v: { 'ۏ': 0, 'ڤ': 0.5, 'ف': 0.5 }, w: { 'و': 0, 'ۏ': 0.5 }, x: { 'کس': 0, 'ک': 1 }, y: { 'ي': 0, 'ى': 0.1 }, z: { 'ز': 0, 'ظ': 0.3, 'ذ': 0.3, 'ض': 0.5 },
    ng: { 'ڠ': 0, 'ڠݢ': 0.2 }, ny: { 'ڽ': 0 }, sy: { 'ش': 0, 'س': 0.5 }, sh: { 'ش': 0, 'س': 0.5 }, kh: { 'خ': 0, 'ک': 0.6, 'ح': 0.8 }, gh: { 'غ': 0, 'ݢ': 0.4 },
    "'": { 'ع': 0, 'ء': 0, '': 0.2 },
    // vokal (sering gugur / alif / ain / hamzah / taling)
    a: { 'ا': 0, '': 0.35, 'ع': 0.3, 'أ': 0.2, 'آ': 0.4, 'ء': 0.5, 'اا': 0.5, 'ه': 0.8 },
    e: { '': 0.15, 'ا': 0.5, 'ي': 0.4, 'ء': 0.5, 'أ': 0.5, 'ع': 0.6 },
    i: { 'ي': 0, '': 0.5, 'ا': 0.5, 'إ': 0.2, 'ء': 0.5, 'ى': 0.2, 'ئ': 0.3, 'اي': 0.4 },
    o: { 'و': 0, 'ا': 0.5, '': 0.5, 'أ': 0.5, 'او': 0.3 },
    u: { 'و': 0, '': 0.5, 'ا': 0.6, 'أ': 0.2, 'ؤ': 0.3, 'او': 0.3, 'اوو': 0.4 },
    ai: { 'اي': 0, 'ي': 0.3, 'اءي': 0.3, 'ءي': 0.4, 'اي‌': 0.3, 'اىء': 0.8, 'ا': 0.8, 'اءِ': 0.8, 'أي': 0.3, 'اىي': 0.5, 'ئي': 0.6 },
    au: { 'او': 0, 'و': 0.3, 'اءو': 0.3, 'ءو': 0.4, 'أو': 0.3 },
    oi: { 'وي': 0, 'اوي': 0.3 }
  };
  var VOK = { a: 1, e: 1, i: 1, o: 1, u: 1, ai: 1, au: 1, oi: 1 };

  // ---- Jawi -> kelompok (huruf asas + tanda; ZWNJ/ZWJ dilekatkan pada huruf sebelum) ----
  function kelompok(j) {
    var out = [], re = /[ً-ٰٟ‌‍ٕٔ]/;
    for (var i = 0; i < j.length; i++) {
      var ch = j.charAt(i);
      if (re.test(ch) && out.length) out[out.length - 1] += ch; else out.push(ch);
    }
    return out;
  }
  function asas(s) { return s.replace(/[ً-ٰٟ‌‍]/g, ''); }

  function kos(unit, sub, prevUnit, k) {
    var b = asas(sub), tbl = C[unit];
    if (tbl && Object.prototype.hasOwnProperty.call(tbl, b)) return tbl[b];
    if (k === 0) {
      if (VOK[unit]) return 0.35;
      if (prevUnit === unit) return 0.2;                // konsonan berganda -> satu huruf
      return 3.5;
    }
    return 3 + 0.5 * (k - 1);                           // padanan tidak dikenali
  }

  function jajar(units, jk) {
    var n = units.length, m = jk.length, INF = 1e9, i, j, k;
    var dp = [], bp = [];
    for (i = 0; i <= n; i++) { dp.push(new Array(m + 1).fill(INF)); bp.push(new Array(m + 1).fill(0)); }
    dp[0][0] = 0;
    for (i = 1; i <= n; i++) {
      for (j = 0; j <= m; j++) {
        for (k = 0; k <= 3 && k <= j; k++) {
          if (dp[i - 1][j - k] >= INF) continue;
          var sub = jk.slice(j - k, j).join('');
          var c = dp[i - 1][j - k] + kos(units[i - 1], sub, units[i - 2], k);
          if (c < dp[i][j]) { dp[i][j] = c; bp[i][j] = k; }
        }
      }
    }
    if (dp[n][m] >= INF) return null;
    var res = new Array(n), jj = m;
    for (i = n; i >= 1; i--) { k = bp[i][jj]; res[i - 1] = jk.slice(jj - k, jj).join(''); jj -= k; }
    return { cost: dp[n][m], jawi: res };
  }

  function satuKata(rumi, jawi) {
    var sy = E._suku(rumi);
    if (!sy) return null;
    var units = [], tanda = [];                          // tanda = indeks suku bagi setiap unit
    sy.forEach(function (s, si) {
      s.on.concat([s.nu], s.co).forEach(function (u) { units.push(u); tanda.push(si); });
    });
    var jk = kelompok(jawi);
    var a = jajar(units, jk);
    if (!a || a.cost > 4.5) return null;
    var seg = sy.map(function (s) { return { rumi: s.on.concat([s.nu], s.co).join(''), jawi: '', warna: 0 }; });
    a.jawi.forEach(function (j, u) { seg[tanda[u]].jawi += j; });
    // suku kata tanpa huruf Jawi (cth. e pepet gugur) digabung ke suku jiran supaya tiada kotak kosong
    var out = [];
    for (var i = 0; i < seg.length; i++) {
      if (!seg[i].jawi) {
        if (out.length) out[out.length - 1].rumi += seg[i].rumi; else if (seg[i + 1]) seg[i + 1].rumi = seg[i].rumi + seg[i + 1].rumi;
        continue;
      }
      out.push(seg[i]);
    }
    out.forEach(function (s, i) { s.warna = i % WARNA.length; });
    return out.length ? out : null;
  }

  // Perkataan majmuk bergaris / kata ganda ٢ : pecah ikut bahagian
  function pecah(rumi, jawi) {
    rumi = String(rumi || '').toLowerCase().replace(/[’‘`´]/g, "'");
    jawi = String(jawi || '').replace(/[‌‍]/g, '');
    if (!rumi || !jawi || /[^a-z'\-]/.test(rumi)) return null;
    var ganda = /٢$/.test(jawi), rp = rumi.split('-').filter(Boolean), jp, res = [];
    if (ganda) { jawi = jawi.replace(/٢$/, ''); jp = [jawi, jawi]; if (rp.length !== 2) return null; }
    else jp = jawi.split('-').filter(Boolean);
    if (rp.length !== jp.length) { if (rp.length === 1 && jp.length === 1) { /* sama */ } else return null; }
    for (var i = 0; i < rp.length; i++) {
      if (ganda && i === 1) { res.push({ rumi: '', jawi: '٢', warna: -1 }); continue; }
      var s = satuKata(rp[i].replace(/'/g, ''), jp[i]);
      if (!s) return null;
      if (i > 0 && !ganda) res.push({ rumi: '-', jawi: '-', warna: -1 });
      res = res.concat(s);
    }
    return res;
  }

  function html(rumi, jawi) {
    var s = pecah(rumi, jawi); if (!s) return null;
    return s.map(function (x) {
      return x.warna < 0 ? x.jawi : '<span class="cb c' + x.warna + '" title="' + x.rumi + '">' + x.jawi + '</span>';
    }).join('');
  }

  return { pecah: pecah, html: html, WARNA: WARNA, versi: '1.0' };
});
