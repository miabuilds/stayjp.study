// ========== 文法術語詞典 ==========
// 使用者回饋:文法接續寫「普通形＋し」,但「普通形」是什麼?可能學過忘了、也不確定 N 幾。
// → 把接續/說明裡的活用術語變成可點,點了就地跳出簡短解釋 + 例子,不用離開頁面去找。
(function () {
  if (window.linkGrammarTerms) return;

  // 每個術語:d=解釋(繁中)、e=例子。用最常出現在「接續」欄位的活用術語。
  var G = {
    '普通形': { d:'不加 です／ます 的常體(朋友、家人之間用)。動詞有四態:辞書形／ない形／た形／なかった形;な形容詞與名詞用 だ／じゃない…。', e:'食べる・食べない・食べた・食べなかった' },
    '普通体': { d:'同「普通形」——不加 です／ます 的常體。', e:'行く・行かない・行った' },
    '丁寧形': { d:'加 です・ます 的禮貌形,對長輩、陌生人、正式場合用。', e:'食べます・食べません' },
    '丁寧体': { d:'同「丁寧形」——です・ます 的禮貌體。', e:'行きます・寒いです' },
    '辞書形': { d:'動詞的原形(字典查得到的形),又叫原形/字典形。', e:'食べる・行く・する・来る' },
    'ます形': { d:'動詞接 ます 前面的形(連用形);去掉 ます 就是語幹。', e:'食べます →「食べ」/ 行きます →「行き」' },
    'て形': { d:'動詞的 て 形,用來連接動作、表狀態或請求。', e:'食べて・行って・見て・して' },
    'で形': { d:'部分動詞的 て 形濁音化成 で(如 ぬ/ぶ/む 結尾)。', e:'飲んで・遊んで・読んで' },
    'ない形': { d:'動詞的否定常體。', e:'食べない・行かない・しない' },
    'た形': { d:'動詞的過去常體。', e:'食べた・行った・した' },
    'なかった形': { d:'動詞的過去否定常體。', e:'食べなかった・行かなかった' },
    '意向形': { d:'表「…吧/打算…」的意志形。', e:'食べよう・行こう・しよう' },
    '意志形': { d:'同「意向形」,表意志或邀約「…吧」。', e:'行こう・帰ろう' },
    '可能形': { d:'表「能夠…、會…」。', e:'食べられる・行ける・話せる' },
    '命令形': { d:'命令語氣(較強硬,多用於告示、緊急)。', e:'食べろ・行け・しろ' },
    '禁止形': { d:'表「不准…」,辞書形＋な。', e:'食べるな・行くな' },
    '条件形': { d:'ば 條件形,表「如果…就…」。', e:'食べれば・行けば・安ければ' },
    'ば形': { d:'同「条件形」,表假定條件「如果…」。', e:'行けば・見れば' },
    '使役形': { d:'表「讓/使某人做…」。', e:'食べさせる・行かせる' },
    '受身形': { d:'被動形,表「被…」。', e:'食べられる・言われる・見られる' },
    '受動形': { d:'同「受身形」,被動「被…」。', e:'叱られる・作られる' },
    '使役受身形': { d:'表「被迫做…(不情願)」。', e:'食べさせられる・待たせられる' },
    'い形容詞': { d:'以 い 結尾的形容詞,可直接接名詞。', e:'高い・面白い・寒い(高い山)' },
    'な形容詞': { d:'接名詞時要加 な 的形容詞(又叫形容動詞)。', e:'静か(な)・親切(な)・きれい(な)' },
    '語幹': { d:'字詞去掉語尾變化後的核心;な形容詞去掉 だ/な、動詞去掉 ます 的部分。', e:'静か・きれい・食べ' },
    '連用形': { d:'接續、中止用的形;動詞即 ます形 的語幹。', e:'食べ(て/ます)・行き(ます)' },
    '連体形': { d:'修飾名詞時用的形;常體動詞可直接接名詞。', e:'食べる+人・行った+店' }
  };

  var TERMS = Object.keys(G).sort(function (a, b) { return b.length - a.length; }); // 長的優先,避免「な形容詞」被「な形」搶
  function esc(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  var RE = new RegExp('(' + TERMS.map(esc).join('|') + ')', 'g');

  // 把純文字裡的術語 wrap 成可點 span(只吃純文字;含 HTML 標籤的字串請勿傳入)
  window.linkGrammarTerms = function (text) {
    if (text == null) return text;
    return String(text).replace(RE, function (m) {
      return '<span class="gloss" data-term="' + m + '" role="button" tabindex="0">' + m + '</span>';
    });
  };
  window.GRAMMAR_GLOSSARY = G;

  // 樣式(自帶,不依賴頁面)
  var st = document.createElement('style');
  st.textContent =
    '.gloss{color:var(--ac,#C6553B);border-bottom:1px dashed var(--ac,#C6553B);cursor:pointer;font-weight:600;white-space:nowrap}' +
    '#glossPop{position:fixed;z-index:2147483600;max-width:290px;background:var(--bg2,#fff);color:var(--tx,#222);' +
      'border:1px solid var(--bd,#e0e0e0);border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,.22);padding:12px 14px;display:none;font-weight:400}' +
    '#glossPop .gp-t{font-weight:800;font-size:15px;margin-bottom:4px;color:var(--ac,#C6553B)}' +
    '#glossPop .gp-d{font-size:13.5px;line-height:1.6;color:var(--tx,#222)}' +
    '#glossPop .gp-e{font-size:13px;line-height:1.6;margin-top:7px;padding-top:7px;border-top:1px solid var(--bd,#eee);color:var(--tx2,#666)}' +
    '#glossPop .gp-e b{color:var(--tx,#222)}';
  (document.head || document.documentElement).appendChild(st);

  function showGloss(term, el) {
    var g = G[term]; if (!g) return;
    var pop = document.getElementById('glossPop');
    if (!pop) { pop = document.createElement('div'); pop.id = 'glossPop'; document.body.appendChild(pop); }
    pop.innerHTML = '<div class="gp-t">' + term + '</div><div class="gp-d">' + g.d + '</div>' +
      (g.e ? '<div class="gp-e"><b>例:</b>' + g.e + '</div>' : '');
    pop.style.display = 'block';
    pop.style.visibility = 'hidden';
    // 先顯示量尺寸,再夾到視窗內
    var r = el.getBoundingClientRect();
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var left = Math.min(Math.max(8, r.left), window.innerWidth - pw - 8);
    var top = r.bottom + 8;
    if (top + ph > window.innerHeight - 8) top = Math.max(8, r.top - ph - 8); // 下方放不下就放上方
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    pop.style.visibility = 'visible';
  }
  function hideGloss() { var p = document.getElementById('glossPop'); if (p) p.style.display = 'none'; }

  document.addEventListener('click', function (e) {
    var g = e.target.closest && e.target.closest('.gloss');
    if (g) { e.stopPropagation(); showGloss(g.getAttribute('data-term'), g); return; }
    if (!(e.target.closest && e.target.closest('#glossPop'))) hideGloss();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideGloss(); });
  window.addEventListener('resize', hideGloss);
})();
