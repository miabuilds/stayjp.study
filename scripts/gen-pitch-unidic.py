#!/usr/bin/env python3
# 音高資料改用 UniDic(fugashi + unidic-lite;aType=アクセント核位置,開源辭典)取代 LLM(抽查只 ~80%)。
# 只收「單一詞素且讀音對得上」的字;aType 有多個(如 2,0)取第一個(最常用)。輸出 pitch-accent.js(window.PITCH + PITCH_VERIFIED)。
import re, json, sys
import fugashi
tagger = fugashi.Tagger()
def kata(s):
    return ''.join(chr(ord(c) + 0x60) if 'ぁ' <= c <= 'ゖ' else c for c in s)
def norm(k):
    k = k.replace('ヴ', 'ブ')
    return k
def load(lv):
    src = open(f'vocab-{lv}.js', encoding='utf-8').read()
    return re.findall(r'\{w:"([^"]+)",r:"([^"]*)"', src)
out, stats = {}, {}
for lv in ['n5', 'n4', 'n3', 'n2', 'n1']:
    items = load(lv); got = 0
    for w, r in items:
        target = norm(kata(re.sub(r'[（(].*?[）)]|[〜~・ ]', '', r)))
        surf = re.sub(r'[（(].*?[）)]|[〜~・ ]', '', w)
        if not surf: continue
        found = None
        try:
            cands = [ [m for m in tagger(surf)] ]
            try:
                if hasattr(tagger, 'nbestToNodeList'):
                    for path in tagger.nbestToNodeList(surf, 4): cands.append([m for m in path])
            except Exception: pass
        except Exception: continue
        for ms in cands:
            if len(ms) != 1: continue
            f = ms[0].feature
            k = norm(str(getattr(f, 'kana', '') or ''))
            a = getattr(f, 'aType', None)
            if not a or a == '*': continue
            if k == target or (not target and k):
                found = int(str(a).split(',')[0]); break
        if found is None:
            # 假名詞(w==r)或讀音對不上:接受 kana 為空但 pron 對得上
            for ms in cands:
                if len(ms) != 1: continue
                f = ms[0].feature; a = getattr(f, 'aType', None)
                p = norm(str(getattr(f, 'pron', '') or '')).replace('ー', '')
                if a and a != '*' and p and p == re.sub(r'ー', '', target):
                    found = int(str(a).split(',')[0]); break
        if found is not None and 0 <= found <= 12:
            out[f'{w}|{r}'] = found; got += 1
    stats[lv] = (got, len(items))
SPOT = {'私|わたし':0,'雨|あめ':1,'橋|はし':2,'箸|はし':1,'花|はな':2,'鼻|はな':0,'桜|さくら':0,'先生|せんせい':3,'学生|がくせい':0,'食べる|たべる':2,'書く|かく':1,'高い|たかい':2,'新しい|あたらしい':4,'日本|にほん':2,'電車|でんしゃ':0,'会社|かいしゃ':0,'時間|じかん':0,'明日|あした':3,'今日|きょう':1,'猫|ねこ':1,'犬|いぬ':2,'心|こころ':3,'男|おとこ':3,'女|おんな':3,'朝|あさ':1,'夜|よる':1,'海|うみ':1,'山|やま':2,'川|かわ':2,'空|そら':1}
hit = n = 0
for k, v in SPOT.items():
    if k in out:
        n += 1
        if out[k] == v: hit += 1
        else: print('MISS', k, 'got', out[k], 'want', v)
print('coverage', stats, 'total', len(out), 'SPOT', f'{hit}/{n}')
open('pitch-accent.js', 'w', encoding='utf-8').write(
    '// 標準語音高(アクセント核位置;0=平板型)。來源:UniDic(unidic-lite,BSD/GPL/LGPL 三重授權)aType,scripts/gen-pitch-unidic.py 產生;'
    f'只收單一詞素且讀音對得上的字。覆蓋 {len(out)} 字,NHK 抽查 {hit}/{n}。\n'
    'window.PITCH=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\nwindow.PITCH_VERIFIED=true;\n')
