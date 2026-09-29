/* 080888.com — UI, forms, tools, ads, video, conversions */
(function () {
  "use strict";
  const S = window.SITE || {};
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } },
    sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { } }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function toast(msg) { let t = $(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); } t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600); }
  /* Inbox is assembled only in memory, at the moment it is needed. */
  function inbox() { return (S._r || []).map(c => String.fromCharCode((c ^ 7) - 13)).reverse().join(""); }

  /* ---------- Theme ---------- */
  const savedTheme = store.get("theme"); if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  $$("[data-theme-toggle]").forEach(b => b.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = next; store.set("theme", next);
  }));

  /* ---------- Mobile nav ---------- */
  const burger = $(".burger"), mm = $(".mobile-menu");
  if (burger && mm) burger.addEventListener("click", () => { const o = mm.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  const here = location.pathname.split("/").pop() || "index.html";
  $$(".menu a, .mobile-menu a").forEach(a => { if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page"); });

  /* ---------- Year, interest links, contact-by-email links ---------- */
  $$("[data-year]").forEach(e => e.textContent = new Date().getFullYear());
  $$("[data-interest]").forEach(a => { a.href = S.interestUrl || "https://web.works/contact"; a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-mail]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    const subj = encodeURIComponent(a.dataset.mail || "Inquiry from 080888.com");
    window.location.href = "mai" + "lto:" + inbox() + "?subject=" + subj;
  }));

  /* ---------- Forms (all submissions route to the single hidden inbox) ---------- */
  async function send(form) {
    const fd = new FormData(form); const data = {};
    fd.forEach((v, k) => { if (k === "_honey") return; data[k] = data[k] ? data[k] + ", " + v : v; });
    if (fd.get("_honey")) return true; // bot
    data._subject = `[080888.com] ${form.dataset.form || "form"} — ${data.name || data.email || "new submission"}`;
    data._template = "table"; data._captcha = "false";
    data.form = form.dataset.form || "form"; data.page = location.href; data.submitted = new Date().toISOString();
    const res = await fetch((S.formEndpoint || "https://formsubmit.co/ajax/") + inbox(), {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const j = await res.json().catch(() => ({})); if (j.success === "false" || j.success === false) throw new Error(j.message || "failed");
    return true;
  }
  function msg(form, ok, text) {
    let m = $(".form-msg", form); if (!m) { m = document.createElement("div"); m.className = "form-msg"; m.setAttribute("role", "alert"); form.appendChild(m); }
    m.className = "form-msg " + (ok ? "ok" : "err"); m.innerHTML = text;
  }
  $$("form[data-form]").forEach(form => {
    if (!$("input[name=_honey]", form)) { const hp = document.createElement("input"); hp.type = "text"; hp.name = "_honey"; hp.className = "hp"; hp.tabIndex = -1; hp.autocomplete = "off"; hp.setAttribute("aria-hidden", "true"); form.appendChild(hp); }
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const btn = $("[type=submit]", form); const label = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
      try {
        await send(form);
        msg(form, true, form.dataset.success || "Thank you — received. We reply within 1–2 business days.");
        form.reset(); if (window.gtag) gtag("event", "generate_lead", { form: form.dataset.form });
        $$(".step", form).forEach((s, i) => s.classList.toggle("on", i === 0)); updateSteps(form, 0);
      } catch (err) {
        msg(form, false, 'We couldn\'t send that automatically. <a href="#" data-mail-fallback>Send it with your email app instead</a>.');
        const fb = $("[data-mail-fallback]", form);
        if (fb) fb.addEventListener("click", ev => {
          ev.preventDefault(); const lines = []; new FormData(form).forEach((v, k) => { if (k !== "_honey") lines.push(`${k}: ${v}`); });
          window.location.href = "mai" + "lto:" + inbox() + "?subject=" + encodeURIComponent("[080888.com] " + (form.dataset.form || "form")) + "&body=" + encodeURIComponent(lines.join("\n"));
        });
      } finally { if (btn) { btn.disabled = false; btn.innerHTML = label; } }
    });
  });

  /* ---------- Multi-step forms ---------- */
  function updateSteps(form, i) { $$(".steps span", form).forEach((s, k) => s.classList.toggle("on", k <= i)); }
  $$("form[data-steps]").forEach(form => {
    const steps = $$(".step", form); let i = 0; updateSteps(form, 0);
    form.addEventListener("click", e => {
      const nx = e.target.closest("[data-next]"), pv = e.target.closest("[data-prev]");
      if (nx) {
        const bad = $$("input,select,textarea", steps[i]).find(x => !x.checkValidity());
        if (bad) { bad.reportValidity(); return; }
        steps[i].classList.remove("on"); i = Math.min(steps.length - 1, i + 1); steps[i].classList.add("on"); updateSteps(form, i);
      }
      if (pv) { steps[i].classList.remove("on"); i = Math.max(0, i - 1); steps[i].classList.add("on"); updateSteps(form, i); }
    });
  });

  /* ---------- Tabs ---------- */
  $$("[data-tabs]").forEach(w => {
    const btns = $$("[role=tab]", w);
    btns.forEach(b => b.addEventListener("click", () => {
      btns.forEach(x => x.setAttribute("aria-selected", x === b));
      $$(".tabpanel", w).forEach(p => p.classList.toggle("on", p.id === b.getAttribute("aria-controls")));
      const sel = $("[name=intent]", w); if (sel) sel.value = b.dataset.intent || sel.value;
    }));
  });

  /* ---------- YouTube (lightweight facade) ---------- */
  function ytCard(v) {
    return `<article class="video-card"><div class="yt" data-id="${esc(v.id)}" role="button" tabindex="0" aria-label="Play: ${esc(v.title)}">
      <img loading="lazy" src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="${esc(v.title)}"><div class="play"><span>▶</span></div></div>
      <h3>${esc(v.title)}</h3><p>${esc(v.by || "")}</p></article>`;
  }
  $$("[data-videos]").forEach(el => {
    const tag = el.dataset.videos, lim = +el.dataset.limit || 99;
    const list = (S.videos || []).filter(v => tag === "all" || v.tag === tag).slice(0, lim);
    el.innerHTML = list.map(ytCard).join("");
  });
  function playYT(el) { if (el.querySelector("iframe")) return; el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(el.dataset.id)}?autoplay=1&rel=0" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`; }
  document.addEventListener("click", e => { const y = e.target.closest(".yt[data-id]"); if (y) playYT(y); });
  document.addEventListener("keydown", e => { const y = e.target.closest && e.target.closest(".yt[data-id]"); if (y && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); playYT(y); } });
  $$("[data-yt-channel]").forEach(a => { if (S.youtubeChannel) a.href = S.youtubeChannel; else a.closest("[data-yt-wrap]") && (a.closest("[data-yt-wrap]").hidden = true); });

  /* ---------- Consent + AdSense + GA4 ---------- */
  const realAds = S.adsenseClient && !/X{6,}/.test(S.adsenseClient);
  function loadAds(npa) {
    if (!realAds || window._adsLoaded) return; window._adsLoaded = true;
    const s = document.createElement("script"); s.async = true; s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(S.adsenseClient);
    document.head.appendChild(s); window.adsbygoogle = window.adsbygoogle || [];
    if (npa) window.adsbygoogle.requestNonPersonalizedAds = 1;
    $$(".ad[data-slot]").forEach(() => { try { window.adsbygoogle.push({}); } catch (e) { } });
  }
  $$(".ad[data-slot]").forEach(ad => {
    const slot = (S.adSlots || {})[ad.dataset.slot] || "";
    if (realAds) ad.innerHTML = `<div class="ad-label">Advertisement</div><ins class="adsbygoogle" style="display:block" data-ad-client="${esc(S.adsenseClient)}" data-ad-slot="${esc(slot)}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
    else ad.innerHTML = `<div class="ad-label">Advertisement</div><div class="ad-ph"><span>Your brand here — reach a prosperity-minded audience. <a href="advertise.html">Advertise with 080888 →</a></span></div>`;
  });
  function loadGA() {
    if (!S.ga4 || window._gaLoaded) return; window._gaLoaded = true;
    const s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(S.ga4); document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag("js", new Date()); gtag("config", S.ga4);
  }
  const consent = store.get("consent"); const ck = $(".cookie");
  if (consent === "all") { loadAds(false); loadGA(); } else if (consent === "essential") { loadAds(true); }
  else if (ck) ck.classList.add("show");
  $$("[data-consent]").forEach(b => b.addEventListener("click", () => {
    const v = b.dataset.consent; store.set("consent", v); ck && ck.classList.remove("show");
    if (v === "all") { loadAds(false); loadGA(); } else loadAds(true);
  }));

  /* ---------- Donations ---------- */
  $$("[data-donate]").forEach(a => {
    const url = (S.donate || {})[a.dataset.donate];
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    else { a.href = "#pledge"; a.addEventListener("click", () => { const f = $("#pledge [name=method]"); if (f) f.value = a.dataset.donate; toast("Online checkout opens soon — leave a pledge below and we'll send a secure link."); }); }
  });
  $$("[data-amount]").forEach(b => b.addEventListener("click", () => { const f = $("#pledge [name=amount]"); if (f) f.value = b.dataset.amount; $$("[data-amount]").forEach(x => x.classList.toggle("btn-primary", x === b)); }));
  const fr = S.fundraising; $$("[data-fund]").forEach(el => {
    if (!fr) return; const pct = Math.min(100, Math.round((fr.raised / fr.goal) * 100));
    el.innerHTML = `<div class="flex" style="justify-content:space-between"><b>${fr.currency} ${fr.raised.toLocaleString()} raised</b><span class="muted">Goal ${fr.currency} ${fr.goal.toLocaleString()}</span></div><div class="progress" aria-label="${pct}% funded"><span style="width:${Math.max(pct, 2)}%"></span></div>`;
  });

  /* ---------- Share ---------- */
  function share(text) {
    const url = location.href.split("#")[0];
    if (navigator.share) navigator.share({ title: document.title, text, url }).catch(() => { });
    else if (navigator.clipboard) navigator.clipboard.writeText(text + " " + url).then(() => toast("Copied — paste it anywhere"));
  }
  $$("[data-share]").forEach(b => b.addEventListener("click", () => share(b.dataset.share || document.title)));
  $$("[data-share-net]").forEach(a => {
    const u = encodeURIComponent(location.href.split("#")[0]), t = encodeURIComponent(document.title);
    const m = { x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`, whatsapp: `https://wa.me/?text=${t}%20${u}`, linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, pinterest: `https://pinterest.com/pin/create/button/?url=${u}&description=${t}`, weibo: `https://service.weibo.com/share/share.php?url=${u}&title=${t}` };
    a.href = m[a.dataset.shareNet] || "#"; a.target = "_blank"; a.rel = "noopener";
  });

  /* ---------- Sticky mobile CTA + exit-intent lead modal ---------- */
  const sc = $(".sticky-cta"); if (sc) addEventListener("scroll", () => sc.classList.toggle("show", scrollY > 700), { passive: true });
  const modal = $("#lead-modal");
  function openModal() { if (!modal || store.sget("leadShown") || store.get("leadDone")) return; store.sset("leadShown", 1); modal.classList.add("open"); const i = $("input[type=email]", modal); i && setTimeout(() => i.focus(), 50); }
  if (modal) {
    $$("[data-close]", modal).forEach(b => b.addEventListener("click", () => modal.classList.remove("open")));
    modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("open"); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") modal.classList.remove("open"); });
    document.addEventListener("mouseout", e => { if (!e.relatedTarget && e.clientY < 8) openModal(); });
    setTimeout(() => { if (scrollY > 900) openModal(); }, 50000);
    $("form", modal) && $("form", modal).addEventListener("submit", () => store.set("leadDone", 1));
  }
  $$("[data-open-lead]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); if (modal) { modal.classList.add("open"); } }));

  /* ---------- Countdown to Lunar New Year ---------- */
  $$("[data-cny]").forEach(el => {
    if (!window.N8) return; const t = N8.nextNewYear(); if (!t) return;
    const lbl = $("[data-cny-date]"); if (lbl) lbl.textContent = t.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const z = N8.zodiacFor(new Date(t.getFullYear(), t.getMonth(), t.getDate(), 12)); const za = $("[data-cny-animal]"); if (za) za.textContent = `${z.emoji} Year of the ${z.element} ${z.animal} (${z.zh})`;
    const tick = () => { const ms = t - new Date(); const d = Math.max(0, Math.floor(ms / 864e5)), h = Math.max(0, Math.floor(ms / 36e5) % 24), m = Math.max(0, Math.floor(ms / 6e4) % 60), s = Math.max(0, Math.floor(ms / 1e3) % 60);
      el.innerHTML = [["Days", d], ["Hours", h], ["Min", m], ["Sec", s]].map(([k, v]) => `<div><b>${v}</b><small>${k}</small></div>`).join(""); };
    tick(); setInterval(tick, 1000);
  });

  /* =====================  TOOLS  ===================== */
  if (!window.N8) return;

  /* ---- Lucky Number Analyzer ---- */
  function renderAnalysis(r, out) {
    const chips = r.digits.map(d => `<span class="chip ${d.w > 0 ? "pos" : d.w < 0 ? "neg" : ""}" title="${esc(d.mean)}"><b>${d.d}</b>${esc(d.hz)} ${esc(d.py)}</span>`).join("");
    const combos = r.combos.length ? r.combos.map(c => `<span class="tag ${c.w < 0 ? "bad" : "gold"}">${esc(c.pat)} · ${esc(c.hz)} — ${esc(c.mean)}</span>`).join(" ") : '<span class="muted">No named combinations detected.</span>';
    const tips = r.notes.map(n => `<li>${esc(n)}</li>`).join("");
    const imp = N8.improve(r.number).map(([v, s]) => `<span class="chip pos"><b>${esc(v)}</b> scores ${s}</span>`).join("");
    out.innerHTML = `<div class="score-grid">
      <div><div class="score-ring" style="--p:${r.score};--c:${r.color}"><div><div><b>${r.score}</b><div class="muted" style="font-size:.8rem">/ 100</div></div></div></div>
      <p class="center mt2 mb0"><b style="color:${r.color}">${r.grade}</b> <span class="hanzi" style="font-size:1.1rem">${r.gradeZh}</span></p></div>
      <div><h3 class="mt0">Digit-by-digit reading</h3><div class="chips">${chips}</div>
      <h3>Combinations found</h3><div>${combos}</div>
      <h3>What this means</h3><ul>${tips}</ul></div></div>
      ${imp ? `<h3>Luckier variants (same length)</h3><div class="chips">${imp}</div><p class="muted" style="font-size:.9rem">Want one of these as a real phone number, plate or domain? <a href="lucky-number-marketplace.html">Request it in the marketplace →</a></p>` : ""}
      <div class="share"><button class="btn btn-ghost btn-sm" type="button" data-share-result>Share my score</button><a class="btn btn-ghost btn-sm" href="consultation.html">Book a number audit</a></div>
      <div class="gate"><h3 class="mt0">🔓 Get the full Prosperity Report for ${esc(r.number)}</h3><p class="mb0">A detailed PDF: pronunciation map, buyer-perception score, resale value band, and 10 hand-picked alternatives. Free for early members.</p>
      <form data-form="analyzer-report" data-success="Your report request is in. Look out for it within 48 hours." class="mt2"><input type="hidden" name="number" value="${esc(r.number)}"><input type="hidden" name="score" value="${r.score}">
      <div class="row2"><div class="field"><label for="rp-n">Name</label><input id="rp-n" name="name" required autocomplete="name"></div><div class="field"><label for="rp-e">Email</label><input id="rp-e" type="email" name="email" required autocomplete="email"></div></div>
      <div class="field"><label for="rp-u">This number is for…</label><select id="rp-u" name="use"><option>My phone number</option><option>My business line</option><option>Car licence plate</option><option>Home / office address</option><option>Domain or brand name</option><option>Price / product code</option><option>Wedding or event date</option></select></div>
      <label class="check"><input type="checkbox" name="consent" value="yes" required> I agree to receive my report and occasional lucky-number tips. Unsubscribe anytime.</label>
      <button class="btn btn-primary btn-block mt2" type="submit">Send my free report</button></form></div>`;
    out.classList.add("show");
    const f = $("form[data-form]", out); if (f) bindDynamicForm(f);
    const sb = $("[data-share-result]", out); sb && sb.addEventListener("click", () => share(`My number ${r.number} scored ${r.score}/100 (${r.grade}) on the 080888 Lucky Number Analyzer.`));
  }
  function bindDynamicForm(form) {
    form.addEventListener("submit", async e => {
      e.preventDefault(); if (!form.checkValidity()) { form.reportValidity(); return; }
      const btn = $("[type=submit]", form); btn.disabled = true; const l = btn.innerHTML; btn.innerHTML = "Sending…";
      try { await send(form); msg(form, true, form.dataset.success); form.reset(); } catch (err) { msg(form, false, 'Could not send automatically. <a href="contact.html">Use the contact page</a>.'); }
      finally { btn.disabled = false; btn.innerHTML = l; }
    });
  }
  $$("[data-analyzer]").forEach(form => {
    const out = form.dataset.analyzer ? $(form.dataset.analyzer) : null;
    form.addEventListener("submit", e => {
      e.preventDefault(); const v = $("input", form).value; const r = N8.analyze(v);
      if (!r) { toast("Enter a number with at least one digit"); return; }
      if (out) { renderAnalysis(r, out); out.scrollIntoView({ behavior: "smooth", block: "start" }); }
      else location.href = "lucky-number-analyzer.html?n=" + encodeURIComponent(r.number);
    });
    const qs = new URLSearchParams(location.search).get("n");
    if (qs && out) { $("input", form).value = qs; renderAnalysis(N8.analyze(qs), out); }
  });
  $$("[data-example]").forEach(b => b.addEventListener("click", () => { const f = $("[data-analyzer]"); if (!f) return; $("input", f).value = b.dataset.example; f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event("submit")); }));

  /* ---- Compare two numbers ---- */
  $$("[data-compare]").forEach(form => form.addEventListener("submit", e => {
    e.preventDefault(); const [a, b] = $$("input", form).map(i => N8.analyze(i.value)); const out = $(form.dataset.compare);
    if (!a || !b) { toast("Enter two numbers"); return; }
    const win = a.score === b.score ? "It's a tie." : `<b>${esc(a.score > b.score ? a.number : b.number)}</b> is the luckier choice.`;
    out.innerHTML = `<div class="grid g2">${[a, b].map(r => `<div class="card center"><div class="hanzi" style="font-size:1.6rem">${esc(r.number)}</div><div class="kpi" style="color:${r.color}">${r.score}</div><div>${r.grade} · ${r.gradeZh}</div></div>`).join("")}</div><p class="center mt2">${win}</p>`;
    out.classList.add("show");
  }));

  /* ---- Zodiac finder ---- */
  $$("[data-zodiac]").forEach(form => form.addEventListener("submit", e => {
    e.preventDefault(); const v = $("input", form).value; if (!v) return;
    const [y, m, d] = v.split("-").map(Number); const z = N8.zodiacFor(new Date(y, m - 1, d, 12));
    const out = $(form.dataset.zodiac);
    out.innerHTML = `<div class="grid g2"><div class="card center"><div style="font-size:4rem;line-height:1">${z.emoji}</div><h2 class="mt0">${z.element} ${z.animal} <span class="hanzi">${z.zh}</span></h2><p class="muted mb0">Lunar year ${z.lunarYear} · ${z.yin ? "Yin" : "Yang"}</p></div>
      <div class="card"><h3 class="mt0">Your profile</h3><p><b>Traits:</b> ${z.traits}.</p><p><b>Your lucky numbers:</b> ${z.luckyNumbers.map(n => `<span class="tag gold">${n}</span>`).join(" ")}</p><p class="mb0"><b>Universal lucky numbers:</b> <span class="tag gold">8</span><span class="tag gold">6</span><span class="tag gold">9</span> — pair these with your personal numbers for phone numbers, plates and dates.</p></div></div>
      ${z.exact ? "" : '<p class="note mt2">Your browser lacks a Chinese calendar, so we approximated the year boundary (4 Feb). If you were born in January or February, confirm with a consultation.</p>'}
      <div class="flex mt2"><a class="btn btn-primary" href="consultation.html?service=personal-numbers">Get my personal number blueprint</a><button class="btn btn-ghost" type="button" data-share-z>Share</button></div>`;
    out.classList.add("show");
    $("[data-share-z]", out).addEventListener("click", () => share(`I'm a ${z.element} ${z.animal} ${z.emoji} — my lucky numbers are ${z.luckyNumbers.join(", ")}.`));
  }));

  /* ---- Compatibility ---- */
  $$("select[data-animals]").forEach(s => { s.innerHTML = N8.ANIMALS.map((a, i) => `<option value="${i}">${N8.ANIMAL_EMOJI[i]} ${a} (${N8.ANIMAL_ZH[i]})</option>`).join(""); });
  $$("[data-compat]").forEach(form => form.addEventListener("submit", e => {
    e.preventDefault(); const [a, b] = $$("select", form).map(s => +s.value); const c = N8.compat(a, b); const out = $(form.dataset.compat);
    out.innerHTML = `<div class="score-grid"><div class="score-ring" style="--p:${c.s}"><div><b>${c.s}%</b></div></div><div><h3 class="mt0">${N8.ANIMAL_EMOJI[a]} ${N8.ANIMALS[a]} + ${N8.ANIMAL_EMOJI[b]} ${N8.ANIMALS[b]}</h3><p>${c.t}</p><a href="auspicious-dates.html" class="btn btn-ghost btn-sm">Find a lucky date together →</a></div></div>`;
    out.classList.add("show");
  }));

  /* ---- Auspicious dates ---- */
  const fmt = d => d.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" });
  $$("[data-datecheck]").forEach(form => form.addEventListener("submit", e => {
    e.preventDefault(); const v = $("input[type=date]", form).value; const ev = $("select", form).value; if (!v) return;
    const [y, m, d] = v.split("-").map(Number); const r = N8.scoreDate(new Date(y, m - 1, d, 12), ev); const out = $(form.dataset.datecheck);
    const col = r.score >= 76 ? "#c8102e" : r.score >= 60 ? "#0f7b5f" : r.score >= 45 ? "#6f6560" : "#5a0010";
    out.innerHTML = `<div class="score-grid"><div class="score-ring" style="--p:${r.score};--c:${col}"><div><b>${r.score}</b></div></div><div><h3 class="mt0">${fmt(r.date)}</h3>${r.lunar ? `<p class="muted">Lunar calendar: month ${r.lunar.month}${r.lunar.leap ? " (leap)" : ""}, day ${r.lunar.day}</p>` : ""}<ul>${r.why.map(w => `<li>${esc(w)}</li>`).join("") || "<li>No strong signals either way.</li>"}</ul></div></div>`;
    out.classList.add("show");
  }));
  $$("[data-datefind]").forEach(form => form.addEventListener("submit", e => {
    e.preventDefault(); const ev = $("[name=event]", form).value; const months = +$("[name=months]", form).value || 6; const out = $(form.dataset.datefind);
    const start = new Date(); start.setHours(12, 0, 0, 0); const list = [];
    for (let i = 1; i <= months * 30.5; i++) { const d = new Date(start.getTime() + i * 864e5); list.push(N8.scoreDate(d, ev)); }
    const top = list.sort((a, b) => b.score - a.score).slice(0, 12).sort((a, b) => a.date - b.date);
    out.innerHTML = `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Score</th><th>Why</th></tr></thead><tbody>${top.map(r => `<tr><td><b>${fmt(r.date)}</b></td><td><span class="tag gold">${r.score}</span></td><td>${esc(r.why.slice(0, 3).join(" · "))}</td></tr>`).join("")}</tbody></table></div>
      <p class="note mt2">These dates use a numerology + lunar-day model. For a wedding, grand opening or contract signing, a personalised date selection also considers both parties' birth data. <a href="consultation.html?service=date-selection">Request a hand-picked date →</a></p>`;
    out.classList.add("show");
  }));

  /* ---- Prefill consultation service from URL ---- */
  const svc = new URLSearchParams(location.search).get("service");
  if (svc) { const r = $(`input[name=service][value="${CSS.escape(svc)}"]`); if (r) r.checked = true; }
})();
