# -*- coding: utf-8 -*-
# 單字主題標註:把 vocab-n1~n5 全部 7,730 字用 claude -p (haiku) 分到 20 個生活主題。
# 產出 data/vocab-themes.json: { "N5|着る|きる": "服裝與外表", ... }
# 可中斷續跑(checkpoint 同檔);跑法: python3 scripts/theme-tag.py
import json, os, re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, 'data', 'vocab-themes.json')
os.makedirs(os.path.dirname(OUT), exist_ok=True)

THEMES = ['飲食','交通','居住','工作','學校與學習','購物與金錢','時間與日期','人與家庭',
          '身體與健康','自然與天氣','情緒與感受','動作','描述與性質','社會與新聞',
          '科技與媒體','旅遊與休閒','藝文與運動','服裝與外表','疑問與代名詞','抽象與其他']

def load_vocab():
    items = []
    for n in [5,4,3,2,1]:
        src = open(os.path.join(BASE, f'vocab-n{n}.js'), encoding='utf-8').read()
        # 抽 {w:"..",r:"..",m:".."} 物件
        for m in re.finditer(r'\{w:"([^"]+)",r:"([^"]*)",m:"([^"]*)"', src):
            items.append({'lv': f'N{n}', 'w': m.group(1), 'r': m.group(2), 'meaning': m.group(3)})
    return items

def key(it): return f"{it['lv']}|{it['w']}|{it['r']}"

def tag_batch(batch):
    lines = '\n'.join(f"{i}. {it['w']}({it['r']}) = {it['meaning']}" for i, it in enumerate(batch))
    prompt = (
        "你是日文教材編輯。把下列日文單字各分到「最貼切的一個」生活主題。\n"
        "主題只能從這 20 個裡挑(一字不差照抄):\n" + '、'.join(THEMES) + "\n"
        "規則:動詞若明顯屬於某場景(食べる=飲食、乗る=交通)就分場景;泛用動作動詞(取る、置く)分「動作」。"
        "形容詞多半是「描述與性質」或「情緒與感受」。片假名外來語照語意分。分不進去的用「抽象與其他」。\n"
        "輸出格式:每行「編號|主題」,不要多餘文字。\n\n" + lines
    )
    r = subprocess.run(['claude', '-p', '--model', 'claude-haiku-4-5-20251001', prompt],
                       capture_output=True, text=True, timeout=300)
    out = {}
    for line in r.stdout.splitlines():
        m = re.match(r'^\s*(\d+)\s*[|｜]\s*(\S+)', line)
        if not m: continue
        idx, th = int(m.group(1)), m.group(2).strip()
        if 0 <= idx < len(batch) and th in THEMES:
            out[key(batch[idx])] = th
    return out

def main():
    items = load_vocab()
    done = {}
    if os.path.exists(OUT):
        done = json.load(open(OUT, encoding='utf-8'))
    todo = [it for it in items if key(it) not in done]
    print(f'total {len(items)}, done {len(done)}, todo {len(todo)}', flush=True)
    B = 80
    batches = [todo[i:i+B] for i in range(0, len(todo), B)]
    with ThreadPoolExecutor(max_workers=4) as ex:
        for bi, res in enumerate(ex.map(tag_batch, batches)):
            done.update(res)
            json.dump(done, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
            print(f'batch {bi+1}/{len(batches)} +{len(res)} (total {len(done)})', flush=True)
    # 缺漏補「抽象與其他」? 不 — 重跑一輪撿漏,還缺的最後標抽象
    missing = [it for it in items if key(it) not in done]
    print('missing after pass1:', len(missing), flush=True)
    if missing:
        for b in [missing[i:i+B] for i in range(0, len(missing), B)]:
            done.update(tag_batch(b))
        json.dump(done, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    missing = [it for it in items if key(it) not in done]
    for it in missing: done[key(it)] = '抽象與其他'
    json.dump(done, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print('DONE. total tagged:', len(done), flush=True)

if __name__ == '__main__':
    main()
