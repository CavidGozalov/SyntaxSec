/* SyntaxSec — hashing helpers.
   SHA-1 / SHA-256 / HMAC use the Web Crypto API (crypto.subtle) whenever the page runs in a
   secure context (https:// or localhost). A small pure-JavaScript fallback keeps the tools
   working when the site is opened over plain http on a local network. MD5 is always
   JavaScript because Web Crypto does not provide it. */
(function () {
  "use strict";
  var SS = (window.SS = window.SS || {});
  var subtle = window.crypto && window.crypto.subtle ? window.crypto.subtle : null;

  function utf8(text) { return new TextEncoder().encode(String(text)); }
  function hex(bytes) {
    var out = "";
    for (var i = 0; i < bytes.length; i++) out += (bytes[i] < 16 ? "0" : "") + bytes[i].toString(16);
    return out;
  }
  function rotl(x, n) { return (x << n) | (x >>> (32 - n)); }
  function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }

  /* Merkle–Damgård padding shared by MD5 (little-endian length) and SHA (big-endian length). */
  function pad(bytes, littleEndian) {
    var len = bytes.length, total = ((len + 8) >> 6 << 6) + 64;
    var buf = new Uint8Array(total);
    buf.set(bytes); buf[len] = 0x80;
    var view = new DataView(buf.buffer);
    var bitsLo = (len << 3) >>> 0, bitsHi = Math.floor(len / 0x20000000);
    if (littleEndian) { view.setUint32(total - 8, bitsLo, true); view.setUint32(total - 4, bitsHi, true); }
    else { view.setUint32(total - 8, bitsHi, false); view.setUint32(total - 4, bitsLo, false); }
    return view;
  }

  /* ---- MD5 (RFC 1321) ---- */
  var MD5_S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
               4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
  var MD5_K = [];
  for (var k = 0; k < 64; k++) MD5_K[k] = Math.floor(Math.abs(Math.sin(k + 1)) * 4294967296) >>> 0;
  function md5(bytes) {
    var view = pad(bytes, true);
    var a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
    for (var off = 0; off < view.byteLength; off += 64) {
      var M = []; for (var j = 0; j < 16; j++) M[j] = view.getUint32(off + j * 4, true);
      var A = a0, B = b0, C = c0, D = d0;
      for (var i = 0; i < 64; i++) {
        var F, g;
        if (i < 16) { F = (B & C) | (~B & D); g = i; }
        else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
        else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
        else { F = C ^ (B | ~D); g = (7 * i) % 16; }
        F = (F + A + MD5_K[i] + M[g]) | 0;
        A = D; D = C; C = B; B = (B + rotl(F, MD5_S[i])) | 0;
      }
      a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
    }
    var out = new Uint8Array(16), ov = new DataView(out.buffer);
    [a0, b0, c0, d0].forEach(function (w, n) { ov.setUint32(n * 4, w >>> 0, true); });
    return out;
  }

  /* ---- SHA-1 fallback (FIPS 180-4) ---- */
  function sha1js(bytes) {
    var view = pad(bytes, false);
    var h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
    var w = new Array(80);
    for (var off = 0; off < view.byteLength; off += 64) {
      for (var i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4, false);
      for (i = 16; i < 80; i++) w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4];
      for (i = 0; i < 80; i++) {
        var f, kk;
        if (i < 20) { f = (b & c) | (~b & d); kk = 0x5a827999; }
        else if (i < 40) { f = b ^ c ^ d; kk = 0x6ed9eba1; }
        else if (i < 60) { f = (b & c) | (b & d) | (c & d); kk = 0x8f1bbcdc; }
        else { f = b ^ c ^ d; kk = 0xca62c1d6; }
        var t = (rotl(a, 5) + f + e + kk + w[i]) | 0;
        e = d; d = c; c = rotl(b, 30); b = a; a = t;
      }
      h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0; h[4] = (h[4] + e) | 0;
    }
    var out = new Uint8Array(20), ov = new DataView(out.buffer);
    h.forEach(function (x, n) { ov.setUint32(n * 4, x >>> 0, false); });
    return out;
  }

  /* ---- SHA-256 fallback (FIPS 180-4) ---- */
  var K256 = (function () {
    var ks = [], n = 2;
    function frac(x) { return ((x - Math.floor(x)) * 4294967296) >>> 0; }
    while (ks.length < 64) {
      var prime = true;
      for (var d = 2; d * d <= n; d++) if (n % d === 0) { prime = false; break; }
      if (prime) ks.push(frac(Math.cbrt(n)));
      n++;
    }
    return ks;
  })();
  function sha256js(bytes) {
    var view = pad(bytes, false);
    var h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var w = new Array(64);
    for (var off = 0; off < view.byteLength; off += 64) {
      for (var i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4, false);
      for (i = 16; i < 64; i++) {
        var s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        var s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
      for (i = 0; i < 64; i++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ (~e & g);
        var t1 = (hh + S1 + ch + K256[i] + w[i]) | 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
      h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
    }
    var out = new Uint8Array(32), ov = new DataView(out.buffer);
    h.forEach(function (x, n) { ov.setUint32(n * 4, x >>> 0, false); });
    return out;
  }

  async function digest(name, bytes) {
    if (subtle) {
      try { return new Uint8Array(await subtle.digest(name, bytes)); } catch (e) { /* fall through */ }
    }
    return name === "SHA-1" ? sha1js(bytes) : sha256js(bytes);
  }

  async function hmacSha1(keyBytes, msgBytes) {
    if (subtle) {
      try {
        var key = await subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
        return new Uint8Array(await subtle.sign("HMAC", key, msgBytes));
      } catch (e) { /* fall through */ }
    }
    var block = 64, k = keyBytes.length > block ? sha1js(keyBytes) : keyBytes;
    var ipad = new Uint8Array(block + msgBytes.length), opad = new Uint8Array(block + 20);
    for (var i = 0; i < block; i++) { var b = i < k.length ? k[i] : 0; ipad[i] = b ^ 0x36; opad[i] = b ^ 0x5c; }
    ipad.set(msgBytes, block);
    opad.set(sha1js(ipad), block);
    return sha1js(opad);
  }

  SS.hash = {
    webCrypto: !!subtle,
    utf8: utf8, hex: hex,
    md5: function (input) { return hex(md5(typeof input === "string" ? utf8(input) : input)); },
    sha1: async function (input) { return hex(await digest("SHA-1", typeof input === "string" ? utf8(input) : input)); },
    sha256: async function (input) { return hex(await digest("SHA-256", typeof input === "string" ? utf8(input) : input)); },
    hmacSha1: hmacSha1,
    _js: { sha1: function (b) { return hex(sha1js(b)); }, sha256: function (b) { return hex(sha256js(b)); } }
  };
})();
