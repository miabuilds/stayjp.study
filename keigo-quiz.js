// ========== 敬語練習 KeigoQuiz ==========
// 尊敬語/謙譲語 選擇題,接 #quizBox / #quizBg。兩種題型:普通形→敬語、敬語→普通形。
// i18n:日文詞用「原樣元素」不經 cvt(避免 OpenCC 把日文漢字誤轉,如 見→见);
//       中文/英文框架一律走 enOr()(en→英文、否則 cvt 繁→簡);渲染後對整框跑 cvtStaticUI(帶假名跳過)保險。
// 讀音全部人工校對。特殊形為主(學習者需背)。
const KeigoQuiz = (() => {
  // 每形式 = [表記, 讀音]
  const KEIGO = [
    { p: "言う", pr: "いう", z: "說", e: "say", sonkei: [["おっしゃる", "おっしゃる"]], kenjo: [["申す", "もうす"], ["申し上げる", "もうしあげる"]] },
    { p: "行く", pr: "いく", z: "去", e: "go", sonkei: [["いらっしゃる", "いらっしゃる"]], kenjo: [["参る", "まいる"], ["伺う", "うかがう"]] },
    { p: "来る", pr: "くる", z: "來", e: "come", sonkei: [["いらっしゃる", "いらっしゃる"], ["お見えになる", "おみえになる"]], kenjo: [["参る", "まいる"]] },
    { p: "食べる", pr: "たべる", z: "吃", e: "eat", sonkei: [["召し上がる", "めしあがる"]], kenjo: [["いただく", "いただく"]] },
    { p: "飲む", pr: "のむ", z: "喝", e: "drink", sonkei: [["召し上がる", "めしあがる"]], kenjo: [["いただく", "いただく"]] },
    { p: "見る", pr: "みる", z: "看", e: "see", sonkei: [["ご覧になる", "ごらんになる"]], kenjo: [["拝見する", "はいけんする"]] },
    { p: "する", pr: "する", z: "做", e: "do", sonkei: [["なさる", "なさる"]], kenjo: [["いたす", "いたす"]] },
    { p: "いる", pr: "いる", z: "在", e: "be (exist)", sonkei: [["いらっしゃる", "いらっしゃる"]], kenjo: [["おる", "おる"]] },
    { p: "会う", pr: "あう", z: "見面", e: "meet", sonkei: [["お会いになる", "おあいになる"]], kenjo: [["お目にかかる", "おめにかかる"]] },
    { p: "知る", pr: "しる", z: "知道", e: "know", sonkei: [["ご存じだ", "ごぞんじだ"]], kenjo: [["存じ上げる", "ぞんじあげる"]] },
    { p: "もらう", pr: "もらう", z: "得到", e: "receive", sonkei: [], kenjo: [["いただく", "いただく"], ["頂戴する", "ちょうだいする"]] },
    { p: "あげる", pr: "あげる", z: "給予", e: "give", sonkei: [], kenjo: [["差し上げる", "さしあげる"]] },
    { p: "くれる", pr: "くれる", z: "給我", e: "give (to me)", sonkei: [["くださる", "くださる"]], kenjo: [] },
    { p: "聞く", pr: "きく", z: "問/聽", e: "ask / hear", sonkei: [], kenjo: [["伺う", "うかがう"], ["拝聴する", "はいちょうする"]] },
    { p: "思う", pr: "おもう", z: "認為", e: "think", sonkei: [], kenjo: [["存じる", "ぞんじる"]] },
  ];

  let questions = [], current = 0, score = 0, results = [];
  let mode = "plain2keigo", kind = "both";
  const shuffle = a => [...a].sort(() => Math.random() - 0.5);
  const eo = (zh, en) => (typeof enOr === "function" ? enOr(zh, en) : zh);
  const typeZhEn = ty => ty === "sonkei" ? ["尊敬語", "Respectful"] : ["謙譲語", "Humble"];

  function start() {
    const box = document.getElementById("quizBox");
    box.innerHTML = `
      <h3 style="margin-bottom:8px">${eo("敬語練習", "Keigo Practice")}</h3>
      <div class="qf"><label>${eo("題型", "Type")}</label><div class="qo" id="kMode">
        <button class="on" data-v="plain2keigo">${eo("普通形→敬語", "Plain → Keigo")}</button>
        <button data-v="keigo2plain">${eo("敬語→普通形", "Keigo → Plain")}</button>
      </div></div>
      <div class="qf"><label>${eo("種類", "Kind")}</label><div class="qo" id="kKind">
        <button class="on" data-v="both">${eo("都測", "Both")}</button>
        <button data-v="sonkei">${eo("尊敬語", "Respectful")}</button>
        <button data-v="kenjo">${eo("謙譲語", "Humble")}</button>
      </div></div>
      <div class="qf"><label>${eo("題數", "Count")}</label><div class="qo" id="kCount">
        <button class="on" data-v="10">10</button><button data-v="20">20</button></div></div>
      <button class="qstart" onclick="KeigoQuiz.begin()">${eo("開始", "Start")}</button>
      <button class="qclose" onclick="KeigoQuiz.close()">${eo("取消", "Cancel")}</button>`;
    box.querySelectorAll(".qo").forEach(g => g.querySelectorAll("button").forEach(b => b.onclick = () => {
      g.querySelectorAll("button").forEach(x => x.classList.remove("on")); b.classList.add("on");
    }));
    if (typeof cvtStaticUI === "function") cvtStaticUI(box);
    document.getElementById("quizBg").classList.add("show");
  }

  function begin() {
    mode = document.querySelector("#kMode .on").dataset.v;
    kind = document.querySelector("#kKind .on").dataset.v;
    const count = parseInt(document.querySelector("#kCount .on").dataset.v);
    let pool = [];
    KEIGO.forEach(en => {
      (kind === "both" ? ["sonkei", "kenjo"] : [kind]).forEach(ty => { if (en[ty] && en[ty].length) pool.push({ en, ty }); });
    });
    pool = shuffle(pool).slice(0, Math.min(count, pool.length));
    questions = pool.map(x => buildQ(x.en, x.ty));
    score = 0; current = 0; results = [];
    renderQ();
  }

  // 一題:{ jp(大字,原樣不轉), meanZh, meanEn, tyZh, tyEn, options([表記,讀音]), correctIdx, answer }
  function buildQ(en, ty) {
    const [tyZh, tyEn] = typeZhEn(ty);
    if (mode === "plain2keigo") {
      const correct = en[ty][0];
      const others = [];
      KEIGO.forEach(o => { if (o !== en && o[ty]) o[ty].forEach(f => others.push(f)); });
      const distractors = shuffle(others).filter(f => f[0] !== correct[0]).slice(0, 3);
      const options = shuffle([correct, ...distractors]);
      return { jp: en.p, meanZh: en.z, meanEn: en.e, tyZh, tyEn, dir: "toKeigo", options, correctIdx: options.indexOf(correct), answer: correct };
    } else {
      const kf = en[ty][0];
      const correct = [en.p, en.pr];
      const others = KEIGO.filter(o => o !== en).map(o => [o.p, o.pr]);
      const options = shuffle([correct, ...shuffle(others).slice(0, 3)]);
      return { jp: kf[0], meanZh: en.z, meanEn: en.e, tyZh, tyEn, dir: "toPlain", options, correctIdx: options.indexOf(correct), answer: correct };
    }
  }

  const disp = o => o[0] + (o[0] !== o[1] ? "（" + o[1] + "）" : "");

  function renderQ() {
    const q = questions[current];
    const instr = q.dir === "toKeigo"
      ? eo("的【" + q.tyZh + "】是?", "→ " + q.tyEn + " form?")
      : eo("（" + q.tyZh + "）的普通形是?", "（" + q.tyEn + "）→ plain form?");
    const sub = eo(q.meanZh, q.meanEn) + "　" + instr;
    const box = document.getElementById("quizBox");
    box.innerHTML = `
      <div class="qhd"><span>${current + 1} / ${questions.length}</span><span>${eo("得分", "Score")} ${score}</span><button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="KeigoQuiz.close()">✕</button></div>
      <div class="qprompt"><div class="qmain">${q.jp}</div><div class="qsub">${sub}</div></div>
      <div class="qopts">${q.options.map((o, i) => '<button class="qopt" onclick="KeigoQuiz.answer(' + i + ')">' + disp(o) + "</button>").join("")}</div>`;
    // 只轉 .qsub / 標頭那些中文框架(帶假名跳過,日文選項與大字不受影響)
    if (typeof cvtStaticUI === "function") cvtStaticUI(box);
  }

  function answer(idx) {
    const q = questions[current];
    const correct = idx === q.correctIdx;
    if (correct) score++;
    results.push({ q, idx, correct });
    document.querySelectorAll(".qopt").forEach((b, i) => {
      b.disabled = true;
      if (i === q.correctIdx) b.classList.add("qcorrect");
      if (i === idx && !correct) b.classList.add("qwrong");
    });
    setTimeout(() => { current++; current >= questions.length ? showResults() : renderQ(); }, correct ? 500 : 1100);
  }

  function showResults() {
    const pct = Math.round(score / questions.length * 100);
    if (typeof Calendar !== "undefined" && Calendar.logActivity) Calendar.logActivity("quiz");
    const box = document.getElementById("quizBox");
    box.innerHTML = `
      <h3>${eo("結果", "Result")}</h3>
      <div class="qscore ${pct >= 80 ? "good" : pct >= 60 ? "ok" : "bad"}">${score} / ${questions.length}（${pct}%）</div>
      <div class="qresults">${results.map(r => {
        const q = r.q;
        const line = q.jp + " → " + disp(q.answer) + " <span style=\"color:var(--tx3);font-size:12px\">" + eo(q.tyZh, q.tyEn) + "</span>";
        return '<div class="qr ' + (r.correct ? "ok" : "ng") + '"><span class="qrc">' + (r.correct ? "✓" : "✗") + "</span> " + line + "</div>";
      }).join("")}</div>
      <div class="qactions"><button class="qstart" onclick="KeigoQuiz.begin()">${eo("下一輪", "Again")}</button><button class="qclose" onclick="KeigoQuiz.close()">${eo("返回", "Back")}</button></div>`;
    if (typeof cvtStaticUI === "function") cvtStaticUI(box);
  }

  function close() { document.getElementById("quizBg").classList.remove("show"); }

  return { start, begin, answer, close };
})();
