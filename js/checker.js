(() => {
  "use strict";
  const GPS = 1e10;
  const $ = id => document.getElementById(id);
  const pw = $("pw");
  if (!pw) return;
  let breached = new Set(["password","123456","qwerty","letmein","admin"]);
  fetch("data/breach-list.json").then(r => r.json()).then(l => { breached = new Set(l.map(x => x.toLowerCase())); render(); }).catch(() => {});

  const pool = s => (/[a-z]/.test(s) ? 26 : 0) + (/[A-Z]/.test(s) ? 26 : 0) + (/\d/.test(s) ? 10 : 0) + (/[^A-Za-z0-9]/.test(s) ? 33 : 0);
  const sequence = s => {
    const l = s.toLowerCase();
    for (let i = 0; i < l.length - 2; i++) {
      const d = l.charCodeAt(i + 1) - l.charCodeAt(i);
      if (Math.abs(d) === 1 && l.charCodeAt(i + 2) - l.charCodeAt(i + 1) === d) return true;
    }
    return false;
  };
  const leet = s => s.toLowerCase().replace(/[@4]/g,"a").replace(/3/g,"e").replace(/[1!|]/g,"i").replace(/0/g,"o").replace(/[5$]/g,"s");
  function analyze(s) {
    const l = s.toLowerCase(), n = leet(s);
    const hit = breached.has(l) || breached.has(n) || [...breached].some(w => w.length > 4 && (l.includes(w) || n.includes(w)));
    const rep = /(.)\1{2,}/.test(s), seq = sequence(s);
    let bits = s.length * Math.log2(pool(s) || 1);
    if (rep) bits *= 0.8;
    if (seq) bits *= 0.85;
    if (hit) bits = Math.min(bits, 15);
    return { bits, checks: [
      [s.length >= 12, "At least 12 characters"],
      [/[a-z]/.test(s) && /[A-Z]/.test(s), "Mixes upper and lower case"],
      [/\d/.test(s) && /[^A-Za-z0-9]/.test(s), "Includes numbers and symbols"],
      [!hit, "Not found in the local breach list"],
      [!rep && !seq, "No repeated runs or sequences"]
    ] };
  }
  function crackTime(bits) {
    const sec = Math.pow(2, bits - 1) / GPS;
    if (sec < 1) return "instantly";
    const steps = [[60,"seconds"],[60,"minutes"],[24,"hours"],[365,"days"],[100,"years"]];
    let v = sec;
    for (const [d, u] of steps) { if (v < d) return Math.round(v) + " " + u; v /= d; }
    return v > 1e6 ? "millions of centuries" : Math.round(v) + " centuries";
  }
  const rate = b => b < 28 ? ["Very weak", 12, "var(--bad)"] : b < 40 ? ["Weak", 32, "var(--bad)"] : b < 60 ? ["Fair", 55, "var(--warn)"] : b < 80 ? ["Strong", 80, "var(--ok)"] : ["Excellent", 100, "var(--ok)"];
  const set = (id, t) => { const e = $(id); if (e) e.textContent = t; };

  function render() {
    const s = pw.value, ul = $("checks");
    if (ul) ul.innerHTML = "";
    if (!s) { $("fill").style.width = "0"; set("verdict", "Type to start the audit."); set("s-len", "0"); set("s-ent", "0"); set("s-time", "-"); return; }
    const r = analyze(s), [label, pct, color] = rate(r.bits);
    $("fill").style.width = pct + "%"; $("fill").style.background = color;
    $("bar").setAttribute("aria-valuenow", pct);
    set("verdict", label + " (" + r.bits.toFixed(0) + " bits)");
    set("s-len", s.length); set("s-ent", r.bits.toFixed(1)); set("s-time", crackTime(r.bits));
    if (ul) r.checks.forEach(([ok, t]) => { const li = document.createElement("li"); li.className = ok ? "ok" : ""; li.textContent = t; ul.append(li); });
  }
  pw.addEventListener("input", render);
  const show = $("show");
  if (show) show.addEventListener("click", () => { const p = pw.type === "password"; pw.type = p ? "text" : "password"; show.textContent = p ? "Hide" : "Show"; });
})();
