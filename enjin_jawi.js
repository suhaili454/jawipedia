// =====================================================================
//  ENJIN_JAWI : enjin Rumi -> Jawi berasaskan peraturan.
//  Bergantung pada HUKUM_JAWI (hukum_jawi.js). Boleh jalan dalam pelayar & Node.
//
//  Guna:
//    var r = EnjinJawi.eja('masa');          // { jawi:'ماس', sumber:'hukum', terangan:[...] }
//    EnjinJawi.eja('dimakan', { cariAsas: fn }) // cariAsas(rumi) -> jawi|null  (kamus anda)
//    EnjinJawi.ejaAyat('saya makan nasi');
// =====================================================================
(function (root) {
  'use strict';
  var H = (typeof module !== 'undefined' && module.exports && typeof require === 'function')
    ? require('./hukum_jawi.js') : root.HUKUM_JAWI;

  var DIGRAF = ['ng', 'ny', 'sy', 'sh', 'kh', 'gh'];   // sh = ش (Arab/Inggeris: Shah, Aisha), sama dgn sy
  var VOKAL = 'aeiou';
  var KLUSTER = ['bl','br','dr','fl','fr','gl','gr','kl','kr','pl','pr','tr'];

  var hook = null;
  function dec(name, ctx, def) { return hook ? hook(name, ctx, def) : def; }
  function isV(c) { return VOKAL.indexOf(c) >= 0; }

  // ---------- 1. Pecah huruf kepada unit (konsonan / vokal / diftong) ----------
  function unit(w) {
    var u = [], i = 0;
    while (i < w.length) {
      var c = w[i], two = w.substr(i, 2);
      if (isV(c)) {
        var nxt = w[i + 2];
        var dif = (two === 'ai' || two === 'au' || two === 'oi') && (nxt === undefined || !isV(nxt));
        if (dif) { u.push({ t: 'V', s: two }); i += 2; }
        else { u.push({ t: 'V', s: c }); i++; }
      } else if (DIGRAF.indexOf(two) >= 0) { u.push({ t: 'C', s: two }); i += 2; }
      else { u.push({ t: 'C', s: c }); i++; }
    }
    return u;
  }

  // ---------- 2. Pecah suku kata ----------
  function suku(units) {
    var idx = [], i;
    for (i = 0; i < units.length; i++) if (units[i].t === 'V') idx.push(i);
    if (!idx.length) return null;
    var sy = [], prev = -1;
    for (var k = 0; k < idx.length; k++) {
      var cons = units.slice(prev + 1, idx[k]).map(function (x) { return x.s; });
      var on = [], coPrev = [];
      if (k === 0) on = cons;
      else if (cons.length <= 1) on = cons;
      else if (cons.length === 2) {
        if (KLUSTER.indexOf(cons.join('')) >= 0) on = cons; else { coPrev = [cons[0]]; on = [cons[1]]; }
      } else {
        var l2 = cons.slice(-2).join('');
        if (KLUSTER.indexOf(l2) >= 0) { coPrev = cons.slice(0, -2); on = cons.slice(-2); }
        else { coPrev = cons.slice(0, -1); on = cons.slice(-1); }
      }
      if (k > 0) sy[k - 1].co = coPrev;
      sy.push({ on: on, nu: units[idx[k]].s, co: [] });
      prev = idx[k];
    }
    sy[sy.length - 1].co = units.slice(prev + 1).map(function (x) { return x.s; });
    return sy;
  }

  // ---------- 3. Hukum alif akhir (KT / DARLUNG) ----------
  function inSet(a, x) { return a.indexOf(x) >= 0; }
  function alifAkhir(sy, i, tr) {
    var s = sy[i];
    if (sy.length === 1) { tr.push('1 suku kata: alif kekal'); return 'ا'; }
    if (!s.on.length) { tr.push('a selepas vokal: alif kekal'); return 'ا'; }
    var K = s.on[s.on.length - 1], V1 = sy[i - 1].nu, selA = (V1 === 'a' || V1 === 'ai' || V1 === 'au');
    if (inSet(H.darlung, K)) { tr.push('DARLUNG (' + K + '): alif akhir KEKAL'); return 'ا'; }
    if (V1 === 'ai' && (K === 'sy' || K === 'sh')) { tr.push('ai + ' + K + ': alif kekal (waisya وايشا)'); return 'ا'; }
    if (selA) {
      if (inSet(H.kekalSelepasA_tambahan, K)) { tr.push('selepas a + ' + K + ': alif kekal'); return 'ا'; }
      tr.push('KT12 (' + V1 + '+' + K + '): alif akhir GUGUR'); return '';
    }
    if (V1.length === 1 && inSet(H.gugurSelepasEIOU, K)) { tr.push(V1 + '+' + K + ': alif akhir GUGUR'); return ''; }
    tr.push('selepas ' + V1 + ' + ' + K + ': alif akhir KEKAL'); return 'ا';
  }

  // e : tekaan lalai pepet/taling (lihat HUKUM_JAWI.eTalingLalai)
  function eLalai(sy, i, n) {
    var L = H.eTalingLalai, s = sy[i], onset = s.on.length ? s.on[s.on.length - 1] : '';
    if (i === 0 && !s.on.length) return !!L.awalKata && (!s.co.length || inSet(L.awalKataKoda, s.co.join('')));
    if (s.co.length) {
      if (i === n - 1) return s.co.length === 1 && inSet(L.akhirTutupKoda, s.co[0]);
      if (i > 0) return s.co.length === 1 && inSet(L.tengahTutupKoda, s.co[0]);
      return false;
    }
    if (i === 0) return inSet(L.onsetSukuPertama, onset);
    if (i < n - 1) return inSet(L.onsetTengah, onset);
    return false;
  }
  // k koda : qaf (true) atau kaf (false)
  function qafLalai(sy, i, n, ci, w) {
    var s = sy[i], P = H.kodaKPengecualian, akhir = (i === n - 1 && ci === s.co.length - 1);
    if (!akhir) return false;                                   // k sebelum konsonan lain -> kaf
    if (s.nu === 'i' && ci === 0 && s.co.length === 1) {
      if (n >= P.ikAkhirMinSuku) return false;
      var pre = s.on.length ? s.on[s.on.length - 1] : '';
      if (inSet(P.ikAkhirDuaSukuKaf, pre)) return false;
    }
    return true;
  }

  // ---------- 4. Eja satu kata dasar ----------
  function ejaAsas(w, tr) {
    var ex = H.pengecualian[w];
    if (ex) { tr.push('pengecualian kamus hukum'); return ex; }
    var units = unit(w), sy = suku(units);
    if (!sy) { tr.push('tiada vokal: eja huruf demi huruf'); return units.map(function (x) { return H.konsonan[x.s] || x.s; }).join(''); }
    var n = sy.length, taling = H.eTalingKata[w] || [], eNo = 0, out = '';
    var drop3 = H.hukum3Suku.aktif && n === H.hukum3Suku.tepatSuku && sy[0].on.length && sy[0].nu === 'a' && !sy[0].co.length &&
                sy[1].nu === 'a' && !sy[1].co.length && !sy[2].co.length;
    for (var i = 0; i < n; i++) {
      var s = sy[i], first = (i === 0), vv = !s.on.length && !first, tutup = s.co.length > 0, last = (i === n - 1);
      out += s.on.map(function (c) { return H.konsonan[c] || c; }).join('');
      var v = s.nu, awal = (first && !s.on.length), j = '';
      if (v === 'a') {
        if (awal) j = 'ا';
        else if (vv) j = (sy[i - 1].nu === 'a' && !sy[i - 1].co.length) ? 'ء' : 'ا';
        else if (tutup) j = dec('aTutup', { sy: sy, i: i, n: n }, '');
        else if (last) j = alifAkhir(sy, i, tr);
        else if (drop3 && i === 0) { j = dec('aTengah', { sy: sy, i: i, n: n }, ''); tr.push('3 suku kata (a-a-x): alif depan digugurkan'); }
        else j = dec('aTengah', { sy: sy, i: i, n: n }, 'ا');
      } else if (v === 'e') {
        var tal = inSet(taling, eNo) || (!H.eTalingKata[w] && eLalai(sy, i, n));
        tal = dec('eTaling', { sy: sy, i: i, n: n, w: w }, tal); eNo++;
        if (tal) j = awal ? H.vokal.eTaling.awal : H.vokal.eTaling.tengah;
        else if (awal) j = 'ا';
        else if (last && !tutup) j = H.vokal.eAkhir;
        else j = '';
      } else if (awal) j = H.vokal.awal[v];
      else j = H.vokal.tengah[v];
      out += j;
      out += s.co.map(function (c, ci) {
        if (c !== 'k') return H.konsonan[c] || c;
        var qaf = dec('kKoda', { sy: sy, i: i, n: n, ci: ci }, qafLalai(sy, i, n, ci, w));
        return qaf ? H.kodaK : 'ک';
      }).join('');
    }
    return out;
  }

  // ---------- 5. Imbuhan ----------
  function senaraiImbuhan(obj) { return Object.keys(obj).sort(function (a, b) { return b.length - a.length; }); }
  var AWALAN = senaraiImbuhan(H.awalan), AKHIRAN = senaraiImbuhan(H.akhiran);

  function gabung(awalan, asas, akhiran, asasRumi) {
    var a = asas, S = H.sambungan, r0 = asasRumi.charAt(0), rN = asasRumi.slice(-1);
    if (awalan && awalan.luluh) { a = a.slice(1).replace(/^ا/, ''); r0 = ''; }   // menulis: م+ن+ولیس
    else if (awalan) {
      if (inSet(S.awalanHamzah, awalan.rumi) && r0 === 'a' && a.charAt(0) === 'ا') a = 'أ' + a.slice(1);
      else if (inSet(S.awalanNasal, awalan.rumi)) {
        if ('eiou'.indexOf(r0) >= 0) a = a.replace(/^ا/, '');                 // او->و , اي->ي , e pepet -> ''
        else if (r0 === 'a') { var sk = suku(unit(asasRumi)); if (sk && sk[0].co.length) a = a.replace(/^ا/, ''); }
      }
    }
    var ak = akhiran ? akhiran.jawi : '';
    if (akhiran && (akhiran.rumi === 'an' || akhiran.rumi === 'i')) {
      if (rN === 'a') { if (a.charAt(a.length - 1) !== 'ا') a += 'ا'; ak = akhiran.rumi === 'an' ? S.hamzahAn : 'ي'; }
      else if (akhiran.rumi === 'an' && inSet(S.alifAnSelepas, rN)) ak = S.alifAn;
    }
    return (awalan ? awalan.jawi : '') + a + ak;
  }

  // ---------- 6. API ----------
  function eja(rumi, opt) {
    opt = opt || {};
    var w = String(rumi).toLowerCase().trim();
    if (!/^[a-z'\-]+$/.test(w)) return { jawi: null, sumber: 'tidak-disokong', terangan: ['aksara bukan Rumi'] };
    w = w.replace(/'/g, '');
    var tr = [];

    // kata ganda: x-x -> x٢
    if (w.indexOf('-') > 0) {
      var p = w.split('-');
      if (p.length === 2 && p[0] === p[1]) {
        var r1 = eja(p[0], opt);
        return { jawi: r1.jawi === null ? null : r1.jawi + '٢', sumber: r1.sumber, terangan: ['kata ganda: ٢'].concat(r1.terangan) };
      }
      var parts = p.map(function (x) { return eja(x, opt); });
      return { jawi: parts.some(function (x) { return x.jawi === null; }) ? null : parts.map(function (x) { return x.jawi; }).join('-'),
               sumber: 'hukum', terangan: ['kata majmuk bergaris'] };
    }

    // a) cari melalui kamus pengguna (asas + imbuhan)
    if (typeof opt.cariAsas === 'function') {
      var h = opt.cariAsas(w); if (h) return { jawi: h, sumber: 'kamus', terangan: ['dalam kamus'] };
      var cands = peleraiImbuhan(w);
      cands = cands.filter(function (x) { return !(x.awalan && x.awalan.luluh); }).concat(cands.filter(function (x) { return x.awalan && x.awalan.luluh; }));
      for (var c = 0; c < cands.length; c++) {
        var cd = cands[c], hs = opt.cariAsas(cd.asas);
        if (hs) return { jawi: gabung(cd.awalan, hs, cd.akhiran, cd.asas), sumber: 'kamus+imbuhan',
          terangan: ['asas "' + cd.asas + '" dalam kamus' + (cd.awalan ? ' + awalan ' + cd.awalan.rumi : '') + (cd.akhiran ? ' + akhiran ' + cd.akhiran.rumi : '')] };
      }
    }

    // b0) unsur Arab / nama : jangan teka (kecuali diminta, cth. oleh cadang_arab untuk 'ikut sebutan')
    if (!opt.tekaArab && H.penandaArab && H.penandaArab.some(function (m) { return w.indexOf(m) >= 0; }))
      return { jawi: null, sumber: 'penanda-arab', terangan: ['mengandungi unsur Arab/nama - tidak diteka; sila sumbang ejaan'] };

    // b) hukum sepenuhnya
    if (opt.imbuhan) {
      var cs = peleraiImbuhan(w);
      for (var q = 0; q < cs.length; q++) {
        var cx = cs[q]; if (!cx.awalan && !cx.akhiran) continue;
        var sk = suku(unit(cx.asas));
        if (cx.asas.length < 3 || !sk || sk.length < 2) continue;        // akar mesti >= 2 suku kata (elak makan -> mak+an)
        var tt = []; var ja = ejaAsas(cx.asas, tt);
        return { jawi: gabung(cx.awalan, ja, cx.akhiran, cx.asas), sumber: 'hukum+imbuhan',
          terangan: ['awalan/akhiran dikenal pasti'].concat(tt) };
      }
    }
    // konsonan berganda (gamma, summa, hukka): ditulis SATU huruf [DATA kamus: k 94%, d 95%, b 88%, t 100%, m 69%]
    //   dan jika berakhir geminat + a, alif akhir kekal (amma اما, vedda ۏيددا) -> gamma ݢاما
    var t2 = [], gem = /([bdfkmnprstz])\1/.test(w), alifGem = /([bdfkmnprstz])\1a$/.test(w);
    var w2 = gem ? w.replace(/([bdfkmnprstz])\1/g, '$1') : w;
    var jw = ejaAsas(w2, t2);
    if (gem) { t2.push('konsonan berganda -> satu huruf'); if (alifGem && jw && jw.slice(-1) !== 'ا') { jw += 'ا'; t2.push('geminat + a: alif akhir kekal'); } }
    return { jawi: jw, sumber: 'hukum', terangan: t2 };
  }

  function peleraiImbuhan(w) {
    var out = [{ asas: w, awalan: null, akhiran: null }], i, j;
    var pre = [null], suf = [null];
    AWALAN.forEach(function (a) { if (w.indexOf(a) === 0 && w.length - a.length >= 2) pre.push(a); });
    AKHIRAN.forEach(function (a) { if (w.length - a.length >= 3 && w.slice(-a.length) === a) suf.push(a); });
    out = [];
    for (i = 0; i < pre.length; i++) for (j = 0; j < suf.length; j++) {
      var a = pre[i], b = suf[j];
      var asas = w.slice(a ? a.length : 0, b ? w.length - b.length : w.length);
      if (asas.length < 2) continue;
      var S = H.sambungan, c0 = asas.charAt(0);
      if (a && S.nasalSah[a] !== undefined) {
        var sah = S.nasalSah[a];
        if (a.length >= 3 && sah.indexOf(c0) < 0 && !(a === 'meng' || a === 'peng') ) continue;
        if ((a === 'meng' || a === 'peng' || a === 'men' || a === 'pen' || a === 'mem' || a === 'pem') && sah.indexOf(c0) < 0) continue;
        if (a === 'meny' || a === 'peny') {                                       // meny+V : luluh s
          if ('aeiou'.indexOf(c0) < 0) continue;
        }
      }
      var bentuk = { asas: asas, awalan: a ? { rumi: a, jawi: H.awalan[a] } : null, akhiran: b ? { rumi: b, jawi: H.akhiran[b] } : null };
      out.push(bentuk);
      if (a && S.luluh[a] && 'aeiou'.indexOf(c0) >= 0) {                            // calon luluh: asas dipulih
        out.push({ asas: S.luluh[a] + asas, awalan: { rumi: a, jawi: H.awalan[a], luluh: true }, akhiran: bentuk.akhiran });
      }
      // meN-/peN- : n/ng/ny/m + asas yang huruf pertamanya luluh (me+tulis=menulis)
    }
    out.sort(function (x, y) { return (y.asas.length - x.asas.length) || ((y.awalan ? 1 : 0) - (x.awalan ? 1 : 0)); });   // akar paling panjang dahulu
    return out;
  }

  function ejaAyat(teks, opt) {
    return String(teks).replace(/[A-Za-z'\-]+/g, function (m) { var r = eja(m, opt); return r.jawi === null ? m : r.jawi; });
  }

  var API = { eja: eja, ejaAyat: ejaAyat, _suku: function (w) { return suku(unit(w)); }, _asas: function (w) { return ejaAsas(w, []); }, _hook: function (h) { hook = h; } };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EnjinJawi = API;
})(typeof window !== 'undefined' ? window : globalThis);
