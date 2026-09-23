# -*- coding: utf-8 -*-
# 貼圖大圖 → 20 張透明背景 PNG(去掉背景與日文字)。
#
# 背景是霧面紅褐漸層、熊是飽和橘,兩者亮度接近 → 不能用亮度或 flood fill 分(會把熊吃掉)。
# 改用「飽和度 + 亮度」分類:飽和亮橘(身體)/ 很暗(線稿)/ 亮而不飽和(白肚、眼白)。
# 再取最大連通區塊,把上方的日文字甩掉。
from PIL import Image
import numpy as np
from collections import deque
import sys, os

SRC = sys.argv[1]
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)
ROWS = [(18, 300), (315, 562), (576, 812), (822, 1016)]
NAMES = [['book', 'ganbaro', 'study', 'good', 'thanks'],
         ['question', 'surprise', 'cry', 'angry', 'sleep'],
         ['bye', 'ramen', 'rain', 'headband', 'reading'],
         ['phone', 'happy', 'difficult', 'travel', 'yatta']]

A = np.asarray(Image.open(SRC).convert('RGB')).astype(int)
cw = A.shape[1] // 5

def cut(sub):
    v = sub.max(axis=2); mn = sub.min(axis=2)
    sat = np.where(v > 0, (v - mn) / np.maximum(v, 1), 0)
    keep = ((v > 195) & (sat > 0.55)) | (v < 95) | ((v > 215) & (sat < 0.40))
    h, w = keep.shape
    lab = np.zeros((h, w), int); cur = 0; best = (0, 0)
    for sy in range(h):
        for sx in range(w):
            if keep[sy, sx] and lab[sy, sx] == 0:
                cur += 1; n = 0; dq = deque([(sy, sx)]); lab[sy, sx] = cur
                while dq:
                    y, x = dq.popleft(); n += 1
                    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < h and 0 <= nx < w and keep[ny, nx] and lab[ny, nx] == 0:
                            lab[ny, nx] = cur; dq.append((ny, nx))
                if n > best[0]: best = (n, cur)
    m = (lab == best[1])
    img = Image.fromarray(np.dstack([sub, np.where(m, 255, 0)]).astype(np.uint8))
    bb = img.getbbox()
    return (img.crop(bb) if bb else img), int(m.sum())

for r, (y0, y1) in enumerate(ROWS):
    for c in range(5):
        img, px = cut(A[y0:y1, c * cw:(c + 1) * cw])
        # 統一高度 320,寬度等比(前端好排版)
        k = 320 / img.size[1]
        img = img.resize((max(1, round(img.size[0] * k)), 320), Image.LANCZOS)
        img.save(f'{OUT}/tanuki-{NAMES[r][c]}.png')
        print(f'  {NAMES[r][c]:<10} {img.size[0]}x{img.size[1]}  ({px} px)')
