#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""闖關課前小劇場產線:劇本 → 配音 audio/pathskit/ + path-skit-<lv>-<n>.js(每 25 集一檔)

劇本正本:scripts/pathskit/<lv>.json(可沒有)+ scripts/pathskit/parts/<lv>-*.json(分批寫的,一行一集)。
用法(先開 VOICEVOX,或無視窗跑 /Applications/VOICEVOX.app/Contents/Resources/vv-engine/run):
  python3 scripts/pathskit/build.py n5 --part scripts/pathskit/parts/n5-010-034.json   # 只驗這一批+產它的配音,不寫 js
  python3 scripts/pathskit/build.py n5                                                # 全級:驗證+補缺的配音+寫 js
會擋下來的錯:used / eg.w 不是那一關的字、姿勢圖或背景不存在、缺中英韓任一語、<em> 沒成對、
            **讀音不對**(每句要寫 "r"=整句平假名讀音,VOICEVOX 實際念的跟它不一樣就擋)。
讀音被擋時:在該句加 "say"(把念錯的詞改寫成假名再送去合成)或 "kana"(AquesTalk 記法直接指定重音斷句)。
確定是比對誤判(純假名斷詞造成)才加 "rok": 1 放行。
每句產音時會印出 kana + 重音,重音/斷句怪的(整句黏成一個重音句、明顯頭高念成平板)一樣用 "kana" 修。
台詞改過會自動重產那一句(看 parts/*.sum.json 的指紋)。
聲音:狸太郎 = ずんだもん(3)、コン = 猫使アル(56),語速 0.92。
"""
import glob, hashlib, json, os, re, subprocess, sys, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.dirname(os.path.abspath(__file__))
B = "http://127.0.0.1:50021"
SPEAKER = {"t": 3, "k": 56}
CHUNK = 25
BAD_POSE = {"tanuki-stand", "tanuki-think", "tanuki-p01", "tanuki-happy", "fox-highfive"}
lv = sys.argv[1]
part = sys.argv[sys.argv.index("--part") + 1] if "--part" in sys.argv else None
force = "--all" in sys.argv
units = {u["i"]: u for u in json.load(open(os.path.join(HERE, "units-" + lv + ".json"), encoding="utf-8"))}
AU = os.path.join(ROOT, "audio", "pathskit")
os.makedirs(AU, exist_ok=True)
errs = []
strip = lambda s: re.sub(r"</?em>", "", s)

def need(cond, msg):
    if not cond: errs.append(msg)

def has_word(w, text):
    """單字有沒有出現:原形,或動詞/形容詞活用後的語幹(食べる→食べ、高い→高、勉強する→勉強)"""
    if w in text: return True
    if w.endswith("する") and len(w) > 2: return w[:-2] in text
    st = w[:-1]
    return len(w) >= 2 and re.match(r"[ぁ-ん]", w[-1]) is not None and st in text and (len(st) >= 2 or re.search(r"[一-龥ァ-ヶ]", st) is not None)

def post(path, data=None):
    req = urllib.request.Request(B + path, data=data, method="POST", headers={"Content-Type": "application/json"} if data else {})
    return urllib.request.urlopen(req).read()

# ── 讀音比對:把 VOICEVOX 的 kana 正規化成「只剩音」 ──
VOW = {}
for row, v in (("アカサタナハマヤラワガザダバパァャヮ", "ア"), ("イキシチニヒミリギジヂビピィ", "イ"), ("ウクスツヌフムユルグズヅブプゥュヴッ", "ウ"),
               ("エケセテネヘメレゲゼデベペェ", "エ"), ("オコソトノホモヨロヲゴゾドボポォョ", "オ")):
    for ch in row: VOW[ch] = v
def norm(kana):
    s = re.sub(r"[^ァ-ヴー]", "", kana.replace("ヲ", "オ"))
    out = []
    for ch in s:
        pv = VOW.get(out[-1]) if out else None
        if ch == "ー" and pv: ch = pv
        elif ch == "ウ" and pv == "オ": ch = "オ"
        elif ch == "イ" and pv == "エ": ch = "エ"
        out.append(ch)
    s = "".join(out)
    return s.replace("ハ", "ワ").replace("ヘ", "エ")   # 助詞 は/へ:純假名送進去時斷詞不穩,統一掉

def kana_of(text, sp):
    return json.loads(post("/audio_query?speaker=%d&text=%s" % (sp, urllib.parse.quote(text))))

srcs = [part] if part else ([os.path.join(HERE, lv + ".json")] if os.path.exists(os.path.join(HERE, lv + ".json")) else []) + sorted(f for f in glob.glob(os.path.join(HERE, "parts", lv + "-*.json")) if not f.endswith(".sum.json"))
out_sk, out_eg, seen = {}, {}, set()
for src in srcs:
    eps = json.load(open(src, encoding="utf-8"))
    sumf = src[:-5] + ".sum.json"
    sums = json.load(open(sumf)) if os.path.exists(sumf) else {}
    legacy = os.path.basename(src) == lv + ".json"
    for e in eps:
        i = e["i"]; tag = "%s:%d" % (lv, i)
        need(i in units, tag + " 沒有這一關"); need(tag not in seen, tag + " 重複"); seen.add(tag)
        if i not in units: continue
        words = [w[0] for w in units[i]["w"]]
        need(os.path.exists(os.path.join(ROOT, "images", "scenes", "bg", e["bg"])) and e["bg"].startswith("skit-"), tag + " 背景不存在 " + e["bg"])
        for pp in [e["start"], e["end"]] + [l["pose"] for l in e["lines"]]:
            need(len(pp) == 2 and pp[0].startswith("tanuki-") and pp[1].startswith("fox-"), tag + " pose 要 [tanuki-*, fox-*]: " + str(pp))
            for p in pp:
                need(os.path.exists(os.path.join(ROOT, "images", "mascot", p + ".png")), tag + " 姿勢圖不存在 " + p)
                need(p not in BAD_POSE, tag + " 禁用姿勢 " + p)
        for k in ("zh", "en", "ko"):
            need(e["title"].get(k), tag + " title 缺 " + k); need(e["intro"].get(k), tag + " intro 缺 " + k)
        need(len(e["used"]) >= 1, tag + " used 至少 1 個這關的字(自然帶到就好,不硬塞)")
        for w in e["used"]:
            need(w in words, tag + " used 不是這關的字: " + w)
            need(any(has_word(w, strip(l["j"])) for l in e["lines"]), tag + " used 沒出現在台詞: " + w)
        need(2 <= len(e["lines"]) <= 6, tag + " 句數要 2~6")
        if not legacy: need(sum(l["j"].count("<em>") for l in e["lines"]) >= 2, tag + " 這關文法至少要用 2 次(<em> 標出)")
        lines = []
        for n, l in enumerate(e["lines"], 1):
            at = "%s 第 %d 句" % (tag, n)
            need(l["who"] in SPEAKER, at + " who 要 t 或 k")
            for k in ("zh", "en", "ko"): need(l.get(k), at + " 缺 " + k)
            need(re.search(r"[가-힣]", l.get("ko", "")), at + " ko 不是韓文")
            need(not re.search(r"[ぁ-ん]", re.sub(r"「[^」]*」", "", l.get("zh", "") + l.get("en", "") + l.get("ko", ""))), at + " 翻譯裡混了平假名")   # 「」裡引用日文(例:教「だ」)可以
            need(l["j"].count("<em>") == l["j"].count("</em>") and not re.search(r"<(?!/?em>)", l["j"]), at + " 標籤只能用成對的 <em>")
            need(len(strip(l["j"])) <= 46, at + " 太長(>46 字),拆句或縮短")
            if not legacy: need(l.get("r") and not re.search(r"[一-龥]", l.get("r", "")), at + " 要有 r(整句平假名讀音,不能有漢字)")
            f = "%s-%d-%d" % (lv, i + 1, n); mp3 = os.path.join(AU, f + ".mp3")
            sp = SPEAKER.get(l["who"], 3)
            fp = hashlib.sha1(json.dumps([l["who"], l["j"], l.get("say"), l.get("kana"), l.get("r")], ensure_ascii=False).encode()).hexdigest()[:12]
            if os.path.exists(mp3) and f not in sums and legacy: sums[f] = fp
            if force or not os.path.exists(mp3) or sums.get(f) != fp:
                q = kana_of(l.get("say") or strip(l["j"]), sp)
                if l.get("kana"):
                    try:
                        q["accent_phrases"] = json.loads(post("/accent_phrases?speaker=%d&is_kana=true&text=%s" % (sp, urllib.parse.quote(l["kana"]))))
                        q["kana"] = l["kana"]
                    except Exception as ex:
                        errs.append(at + " kana 記法錯: " + str(ex)); continue
                ok = True
                if l.get("r") and not l.get("rok"):
                    want = norm(kana_of(l["r"], sp)["kana"]); got = norm(q["kana"])
                    if want != got:
                        ok = False
                        errs.append("%s 讀音不對\n    台詞: %s\n    念成: %s\n    應為: %s  (r=%s)" % (at, strip(l["j"]), q["kana"], want, l["r"]))
                if not ok:
                    if os.path.exists(mp3): os.remove(mp3)
                    sums.pop(f, None); continue
                q["speedScale"] = 0.92; q["prePhonemeLength"] = 0.05; q["postPhonemeLength"] = 0.1
                wav = post("/synthesis?speaker=%d" % sp, json.dumps(q).encode())
                tmp = mp3[:-4] + ".wav"; open(tmp, "wb").write(wav)
                subprocess.run(["/opt/homebrew/bin/ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-ac", "1", "-b:a", "48k", mp3], check=True)
                os.remove(tmp); sums[f] = fp
                print("%-10s %s  ←  %s" % (f, q["kana"], strip(l["j"])))
            d = {"who": l["who"], "j": l["j"], "au": f, "pose": l["pose"], "z": [l["zh"], l["en"], l["ko"]]}
            if l.get("emo"): d["emo"] = l["emo"]
            lines.append(d)
        out_sk[tag] = {"no": i + 1, "bg": e["bg"], "title": [e["title"][k] for k in ("zh", "en", "ko")],
                       "intro": [e["intro"][k] for k in ("zh", "en", "ko")], "start": e["start"], "end": e["end"],
                       "used": e["used"], "lines": lines}
        egs = []
        need(2 <= len(e.get("eg", [])) <= 3, tag + " eg 要 2~3 句")
        for g in e.get("eg", []):
            need(g["w"], tag + " 例句要標用到的這關單字 w")
            for w in g["w"]:
                need(w in words, tag + " 例句 w 不是這關的字: " + w); need(has_word(w, strip(g["j"])), tag + " 例句沒用到: " + w)
            for k in ("zh", "en", "ko"): need(g.get(k), tag + " 例句缺 " + k)
            need(g["j"].count("<em>") == g["j"].count("</em>") and "<em>" in g["j"], tag + " 例句要用 <em> 標出文法")
            egs.append({"j": g["j"], "w": g["w"], "z": [g["zh"], g["en"], g["ko"]]})
        if egs: out_eg[tag] = egs
    json.dump(sums, open(sumf, "w"), ensure_ascii=False, indent=0, sort_keys=True)

if errs:
    print("\n".join("✗ " + x for x in errs)); print("\n共 %d 個問題" % len(errs)); sys.exit(1)
if part:
    print("ok(只驗這一批): %d 集 %d 句" % (len(out_sk), sum(len(v["lines"]) for v in out_sk.values()))); sys.exit(0)
for old in glob.glob(os.path.join(ROOT, "path-skit-%s*.js" % lv)): os.remove(old)
chunks = {}
for tag in out_sk: chunks.setdefault(int(tag.split(":")[1]) // CHUNK, []).append(tag)
tot = 0
for c, tags in sorted(chunks.items()):
    s = {t: out_sk[t] for t in tags}; g = {t: out_eg[t] for t in tags if t in out_eg}
    js = ("// 由 scripts/pathskit/build.py 產生,不要手改。z / title / intro 的順序固定是 [繁中, 英文, 韓文]。\n"
          "(function(){var S=window.PATH_SKITS=window.PATH_SKITS||{},E=window.PATH_EG=window.PATH_EG||{};\n"
          "var s=%s;\nvar e=%s;\nfor(var k in s)S[k]=s[k];for(var k2 in e)E[k2]=e[k2];})();\n") % (
          json.dumps(s, ensure_ascii=False, separators=(",", ":")), json.dumps(g, ensure_ascii=False, separators=(",", ":")))
    open(os.path.join(ROOT, "path-skit-%s-%d.js" % (lv, c)), "w", encoding="utf-8").write(js); tot += len(js.encode())
miss = sorted(set(units) - {int(t.split(":")[1]) for t in out_sk})
print("ok: %s %d/%d 集 %d 句 → %d 檔 共 %d KB%s" % (lv, len(out_sk), len(units), sum(len(v["lines"]) for v in out_sk.values()), len(chunks), tot // 1024,
      ("  還沒寫的關: " + ",".join(str(m + 1) for m in miss[:40]) + ("…" if len(miss) > 40 else "")) if miss else "  全部到齊"))
