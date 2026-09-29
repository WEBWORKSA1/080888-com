/* 080888 Number Engine — Chinese homophone-based number scoring.
   Cultural/entertainment model. Pure functions, no DOM. */
(function (g) {
  const DIGITS = {
    0: { py: "líng", hz: "零", w: 2, mean: "Wholeness and a fresh start; linked to 灵 (spirit, cleverness) and 良 (good)." },
    1: { py: "yī / yāo", hz: "一", w: 1, mean: "Unity and being first. In phone numbers read yāo, often heard as 要 (will / want)." },
    2: { py: "èr", hz: "二", w: 3, mean: "Good things come in pairs (好事成双). Harmony and balance." },
    3: { py: "sān", hz: "三", w: 3, mean: "Sounds like 生 (shēng, life / birth). Growth and vitality." },
    4: { py: "sì", hz: "四", w: -10, mean: "Sounds like 死 (sǐ, death). The most avoided digit in China, Hong Kong, Taiwan and Singapore." },
    5: { py: "wǔ", hz: "五", w: 0, mean: "The Five Elements (五行). Also sounds like 无 (wú, none) and 我 (wǒ, I). Neutral." },
    6: { py: "liù", hz: "六", w: 6, mean: "Sounds like 流 (liú, flow). Everything goes smoothly (六六大顺)." },
    7: { py: "qī", hz: "七", w: 0, mean: "Togetherness and rising (起). Mixed: the 7th lunar month is Ghost Month." },
    8: { py: "bā", hz: "八", w: 10, mean: "Sounds like 发 (fā, to prosper / get rich). The luckiest digit in Chinese culture." },
    9: { py: "jiǔ", hz: "九", w: 6, mean: "Sounds like 久 (jiǔ, long-lasting). Longevity and the imperial number." }
  };
  const COMBOS = [
    ["0808", 5, "08·08", "The 08-08 prosperity cascade (Beijing 2008 opening date)"],
    ["8888", 18, "发发发发", "Quadruple prosperity — premium-tier pattern"],
    ["888", 14, "发发发", "Triple prosperity — wealth upon wealth"],
    ["88", 8, "囍 / 发发", "Double prosperity; resembles double happiness 囍"],
    ["1688", 6, "一路发发", "Prosperity all the way, doubled"],
    ["168", 10, "一路发", "Prosperity all the way (yī lù fā)"],
    ["518", 9, "我要发", "I am going to prosper (wǒ yào fā)"],
    ["666", 10, "六六六", "Everything goes smoothly; also slang for 'awesome'"],
    ["66", 4, "六六", "Smooth flow, doubled"],
    ["999", 8, "久久久", "Everlasting, eternal"],
    ["99", 4, "久久", "Long-lasting (长长久久)"],
    ["520", 5, "我爱你", "I love you (wǒ ài nǐ) — romance favourite"],
    ["1314", 5, "一生一世", "For a lifetime — paired with 520 for weddings"],
    ["68", 5, "路发", "Smooth road to prosperity"],
    ["58", 4, "我发", "I prosper"],
    ["28", 4, "易发", "Easy prosperity"],
    ["18", 3, "要发", "Will prosper"],
    ["36", 2, "生流", "Life flowing smoothly"],
    ["748", -8, "去死吧", "Heard as 'go die' — strongly avoided"],
    ["514", -6, "我要死", "Heard as 'I want to die'"],
    ["250", -6, "二百五", "Slang for a fool"],
    ["44", -6, "死死", "Double 4 — doubly avoided"],
    ["14", -8, "要死", "Heard as 'will die'"],
    ["74", -5, "气死", "Heard as 'angered to death'"],
    ["54", -4, "我死", "Heard as 'I die'"],
    ["94", -4, "就死", "Heard as 'then die'"],
    ["38", -2, "三八", "Colloquial insult in some regions"]
  ];

  function clean(s) { return String(s || "").replace(/\D/g, ""); }

  function analyze(input) {
    const n = clean(input);
    if (!n) return null;
    const len = n.length;
    const tail = Math.min(4, len);
    let digitSum = 0, weightTotal = 0;
    const counts = {};
    for (let i = 0; i < len; i++) {
      const d = +n[i];
      counts[d] = (counts[d] || 0) + 1;
      const pw = i >= len - tail ? 1.5 : 1; // ending digits weigh more
      digitSum += DIGITS[d].w * pw; weightTotal += pw;
    }
    const avg = digitSum / weightTotal; // -10..10
    // combos (non-overlapping greedy: longest first)
    const found = []; let masked = n;
    COMBOS.forEach(([pat, w, hz, mean]) => {
      let idx; while ((idx = masked.indexOf(pat)) !== -1) {
        found.push({ pat, w, hz, mean });
        masked = masked.slice(0, idx) + "x".repeat(pat.length) + masked.slice(idx + pat.length);
      }
    });
    let comboScore = found.reduce((a, c) => a + c.w, 0);
    comboScore = Math.max(-30, Math.min(30, comboScore));
    let bonus = 0; const notes = [];
    const last = +n[len - 1];
    if (last === 8) { bonus += 5; notes.push("Ends in 8 — the strongest ending for business and wealth."); }
    if (last === 6 || last === 9) { bonus += 3; notes.push(`Ends in ${last} — a favourable, stable ending.`); }
    if (last === 4) { bonus -= 7; notes.push("Ends in 4 — the weakest possible ending. Strongly consider changing it."); }
    if (/^(\d)\1+$/.test(n) && [6, 8, 9].includes(+n[0])) { bonus += 6; notes.push("Solid repeating lucky digit — collectors pay large premiums for these."); }
    if (/(\d)\1\1/.test(n)) { bonus += 2; notes.push("Contains a triple (e.g. AAA) — memorable, adds resale value."); }
    if (/(\d\d)\1/.test(n)) { bonus += 2; notes.push("Contains a repeating pair (ABAB) — easy to remember."); }
    const fours = counts[4] || 0;
    if (fours >= 2) notes.push(`Contains ${fours} fours — buyers in Chinese markets will discount this number.`);
    if (!fours) notes.push("No 4s — passes the first test every Chinese buyer applies.");
    let score = Math.round(50 + avg * 3.2 + comboScore * 0.9 + bonus);
    score = Math.max(1, Math.min(99, score));
    const grade = score >= 90 ? ["Imperial", "帝王级", "#b8860b"]
      : score >= 76 ? ["Excellent", "大吉", "#c8102e"]
      : score >= 62 ? ["Good", "吉", "#0f7b5f"]
      : score >= 46 ? ["Neutral", "平", "#6f6560"]
      : score >= 30 ? ["Weak", "小凶", "#a0522d"]
      : ["Avoid", "凶", "#5a0010"];
    return { number: n, score, grade: grade[0], gradeZh: grade[1], color: grade[2], counts, combos: found, notes, digits: n.split("").map(d => ({ d: +d, ...DIGITS[d] })) };
  }

  /* Suggest luckier variants by swapping weak digits for strong ones (keeps length). */
  function improve(input, max = 5) {
    const n = clean(input); if (!n) return [];
    const swaps = { 4: ["8", "6"], 7: ["8"], 5: ["8", "6"], 1: ["8"], 0: ["8"], 3: ["8"], 2: ["8"] };
    const out = new Map();
    for (let i = Math.max(0, n.length - 4); i < n.length; i++) {
      (swaps[n[i]] || []).forEach(r => { const v = n.slice(0, i) + r + n.slice(i + 1); out.set(v, analyze(v).score); });
    }
    const t = n.slice(0, -2) + "88"; out.set(t, analyze(t).score);
    const t2 = n.slice(0, -3) + "168"; if (n.length > 3) out.set(t2, analyze(t2).score);
    return [...out.entries()].filter(([v]) => v !== n).sort((a, b) => b[1] - a[1]).slice(0, max);
  }

  /* ----- Chinese calendar helpers (uses the browser's built-in Chinese calendar) ----- */
  const ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  const ANIMAL_ZH = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
  const ANIMAL_EMOJI = ["🐀", "🐂", "🐅", "🐇", "🐉", "🐍", "🐎", "🐐", "🐒", "🐓", "🐕", "🐖"];
  const ELEMENTS = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];
  const ELEMENT_NUMS = { Water: [1, 6], Fire: [2, 7], Wood: [3, 8], Metal: [4, 9], Earth: [5, 0] };
  const ANIMAL_LUCKY = [[2, 3], [1, 4], [1, 3, 4], [3, 4, 6], [1, 6, 7], [2, 8, 9], [2, 3, 7], [3, 4, 9], [1, 7, 8], [5, 7, 8], [3, 4, 9], [2, 5, 8]];
  const ANIMAL_TRAITS = [
    "Quick-witted, resourceful, thrifty", "Diligent, dependable, patient", "Brave, confident, competitive",
    "Gentle, elegant, diplomatic", "Ambitious, charismatic, lucky", "Wise, intuitive, discreet",
    "Energetic, independent, free-spirited", "Calm, creative, kind", "Clever, curious, inventive",
    "Observant, hard-working, precise", "Loyal, honest, protective", "Generous, sincere, easy-going"];

  function lunarParts(date) {
    try {
      const f = new Intl.DateTimeFormat("en-u-ca-chinese", { year: "numeric", month: "numeric", day: "numeric", timeZone: "Asia/Shanghai" });
      const p = f.formatToParts(date); const o = {};
      p.forEach(x => { o[x.type] = x.value; });
      const ry = +(o.relatedYear || (o.year && /^\d{4}$/.test(o.year) ? o.year : NaN));
      const month = parseInt(String(o.month).replace(/\D/g, ""), 10);
      const leap = /bis|leap|闰/i.test(String(o.month));
      return { year: ry, month, day: +o.day, leap };
    } catch (e) { return null; }
  }
  /* Authoritative Lunar New Year dates (override for the browser calendar near the boundary) */
  const CNY = { 2020: "2020-01-25", 2021: "2021-02-12", 2022: "2022-02-01", 2023: "2023-01-22", 2024: "2024-02-10", 2025: "2025-01-29", 2026: "2026-02-17", 2027: "2027-02-06", 2028: "2028-01-26", 2029: "2029-02-13", 2030: "2030-02-03", 2031: "2031-01-23" };
  function ymd(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
  function zodiacFor(date) {
    const lp = lunarParts(date);
    let y = lp && lp.year ? lp.year : date.getFullYear() - (date.getMonth() < 1 || (date.getMonth() === 1 && date.getDate() < 4) ? 1 : 0);
    const gy = date.getFullYear();
    if (CNY[gy]) y = ymd(date) >= CNY[gy] ? gy : gy - 1;
    const idx = ((y - 4) % 12 + 12) % 12;
    const stem = ((y - 4) % 10 + 10) % 10;
    const element = ELEMENTS[stem];
    return {
      lunarYear: y, idx, animal: ANIMALS[idx], zh: ANIMAL_ZH[idx], emoji: ANIMAL_EMOJI[idx],
      element, yin: stem % 2 === 1, traits: ANIMAL_TRAITS[idx],
      luckyNumbers: [...new Set([...ANIMAL_LUCKY[idx], ...ELEMENT_NUMS[element]])].sort(),
      exact: !!(lp && lp.year)
    };
  }
  function compat(a, b) {
    const d = Math.abs(a - b);
    const trine = a % 4 === b % 4;
    const harmony = (a + b) % 12 === 1;
    if (a === b) return { s: 70, t: "Same sign — deep understanding, but watch for mirrored stubbornness." };
    if (harmony) return { s: 95, t: "Six Harmonies (六合) — the classic best match." };
    if (trine) return { s: 88, t: "Same Trine (三合) — natural allies who share goals and pace." };
    if (d === 6) return { s: 30, t: "Six Clash (六冲) — opposite signs. Attraction is strong, friction is real." };
    if ((a + b) % 12 === 7 || d === 3 || d === 9) return { s: 55, t: "Neutral-to-mixed — works with effort and clear communication." };
    return { s: 65, t: "Friendly — no classical conflict, steady compatibility." };
  }
  function nextNewYear(from = new Date()) {
    const today = ymd(from);
    for (const y of Object.keys(CNY)) if (CNY[y] > today) { const [a, b, c] = CNY[y].split("-").map(Number); return new Date(a, b - 1, c); }
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    for (let i = 1; i < 420; i++) {
      const t = new Date(d.getTime() + i * 864e5);
      const lp = lunarParts(t);
      if (lp && lp.month === 1 && lp.day === 1 && !lp.leap) return t;
    }
    return null;
  }
  /* Date auspiciousness (cultural digit model + lunar-day tradition) */
  function scoreDate(date, event) {
    const y = date.getFullYear(), m = date.getMonth() + 1, dd = date.getDate();
    const s = `${y}${String(m).padStart(2, "0")}${String(dd).padStart(2, "0")}`;
    const md = `${m}${dd}`;
    let score = analyze(s).score * 0.45 + analyze(md).score * 0.55;
    const why = [];
    const lp = lunarParts(date);
    if (lp) {
      if ([8, 18, 28].includes(lp.day)) { score += 8; why.push(`Lunar day ${lp.day} carries an 8`); }
      if ([6, 16, 26, 9, 19, 29].includes(lp.day)) { score += 4; why.push(`Lunar day ${lp.day} is favourable`); }
      if ([4, 14, 24].includes(lp.day)) { score -= 8; why.push(`Lunar day ${lp.day} contains a 4`); }
      if (lp.month === 7) { score -= 14; why.push("7th lunar month (Ghost Month) — traditionally avoided for weddings, moves and openings"); }
      if (lp.month === 1 && lp.day <= 15) { score += 3; why.push("Spring Festival period"); }
    }
    if ([4, 14, 24].includes(dd)) { score -= 6; why.push("Calendar day contains a 4"); }
    if ([8, 18, 28].includes(dd)) { score += 4; why.push("Calendar day contains an 8"); }
    if (m === 8) { score += 3; why.push("August — the 8th month"); }
    const dow = date.getDay();
    if (event === "wedding" && (dow === 0 || dow === 6)) { score += 3; why.push("Weekend — easier for guests"); }
    if (event === "business" && dow >= 1 && dow <= 5) { score += 2; why.push("Weekday — suited to openings & signings"); }
    if (md === "520" || md === "1314") { score += 6; why.push("Romantic numeric date (520 / 1314)"); }
    score = Math.max(1, Math.min(99, Math.round(score)));
    return { date, score, why, lunar: lp };
  }

  g.N8 = { CNY, ymd, DIGITS, COMBOS, analyze, improve, lunarParts, zodiacFor, compat, nextNewYear, scoreDate, ANIMALS, ANIMAL_ZH, ANIMAL_EMOJI, ANIMAL_TRAITS };
})(typeof window !== "undefined" ? window : globalThis);
