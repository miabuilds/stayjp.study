# 中秋抽獎活動主圖(1080×1350):深藍夜空+大月亮+小狸,標題「抽 1 年 Premium」,三步驟,截止/開獎,底部 9 折碼 TSUKIMI
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, random
OUT = '/Users/linyurou/Documents/GitHub/stay-jp-notes/images/social/moon2026'; os.makedirs(OUT, exist_ok=True)
MAS = '/Users/linyurou/Documents/GitHub/stay-jp-notes/images/mascot'
W, H = 1080, 1350
CJK = '/System/Library/Fonts/Hiragino Sans GB.ttc'; NUM = '/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf'
NAVY1, NAVY2, MOON, MOON2, CREAM, INK, ORANGE, WHITE, MUTED = (28, 32, 74), (62, 44, 92), (255, 214, 102), (255, 236, 170), (255, 246, 236), (44, 36, 32), (212, 101, 74), (255, 255, 255), (120, 110, 100)
def F(size, bold=True): return ImageFont.truetype(CJK, size, index=1 if bold else 0)
def N(size): return ImageFont.truetype(NUM, size)
def T(d, xy, s, f, fill=INK, stroke=0, anchor=None): d.text(xy, s, font=f, fill=fill, stroke_width=stroke, stroke_fill=fill, anchor=anchor)
def pill(d, x, y, s, f, fg, bg, padx=18, pady=9):
    w = d.textlength(s, font=f); h = f.size + pady * 2
    d.rounded_rectangle([x, y, x + w + padx * 2, y + h], radius=h // 2, fill=bg); d.text((x + padx, y + pady - 2), s, font=f, fill=fg); return w + padx * 2
def mascot(name, w):
    im = Image.open(os.path.join(MAS, name)).convert('RGBA'); r = w / im.width; return im.resize((w, int(im.height * r)), Image.LANCZOS)

im = Image.new('RGBA', (W, H)); d = ImageDraw.Draw(im)
for y in range(H):
    t = y / H; c = tuple(int(NAVY1[i] * (1 - t) + NAVY2[i] * t) for i in range(3)) + (255,); d.line([(0, y), (W, y)], fill=c)
# 星星
random.seed(7)
for _ in range(90):
    x, y, r = random.randint(0, W), random.randint(0, 700), random.choice([1, 1, 2, 2, 3])
    d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, random.randint(90, 200)))
# 月亮(帶光暈)
glow = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(glow); gd.ellipse([600, 40, 1060, 500], fill=(255, 214, 102, 90)); im.alpha_composite(glow.filter(ImageFilter.GaussianBlur(60)))
d = ImageDraw.Draw(im); d.ellipse([680, 110, 980, 410], fill=MOON); d.ellipse([730, 160, 790, 220], fill=MOON2); d.ellipse([850, 300, 890, 340], fill=MOON2); d.ellipse([800, 190, 830, 220], fill=MOON2)
# 小狸(舉旗那隻,坐月亮旁)
m = mascot('tanuki-p03.png', 320); im.alpha_composite(m, (W - 70 - m.width, 300)); d = ImageDraw.Draw(im)
# 標題
pill(d, 80, 80, '日本再留計劃 StayJP', F(26), NAVY1, WHITE)
T(d, (80, 150), '中秋節・剛漲價,補一個機會給你', F(30), MOON2)
T(d, (80, 200), '轉發抽', F(72), WHITE, 2)
T(d, (80, 290), '1 年 Premium', F(84), MOON, 2)
T(d, (80, 400), '3 名 · 價值 NT$1,990 · 不用買任何東西', F(30), (220, 220, 240))
# 步驹卡
cy0 = 500
d.rounded_rectangle([80, cy0, W - 80, cy0 + 440], radius=30, fill=WHITE)
T(d, (116, cy0 + 28), '怎麼參加(3 步都要)', F(30), MUTED)
steps = [('追蹤 @stayjp.study', '沒追蹤抽到也聯絡不到你'), ('轉發這篇貼文', '直接按轉發就好,不用改字'), ('留言:你想考 N 幾 + 一個想學好日文的原因', '一句就好,講真的最好')]
sy = cy0 + 86
for i, (a, b) in enumerate(steps):
    d.ellipse([116, sy, 176, sy + 60], fill=ORANGE); T(d, (146, sy + 30), str(i + 1), N(34), WHITE, anchor='mm')
    T(d, (200, sy - 2), a, F(34 if len(a) < 16 else 28), INK, 1); T(d, (200, sy + 46), b, F(23, False), MUTED)
    sy += 112
# 截止 / 開獎
d.rounded_rectangle([80, cy0 + 462, W - 80, cy0 + 462 + 90], radius=22, fill=(255, 214, 102))
T(d, (116, cy0 + 462 + 20), '9/25 中秋 21:00 截止', F(32), INK, 1)
T(d, (W - 116, cy0 + 462 + 22), '當晚公開抽、留言公布', F(28), (90, 70, 30), anchor='ra')
# 底部 9 折
by = cy0 + 462 + 112
ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(ov).rounded_rectangle([80, by, W - 80, by + 104], radius=22, fill=(255, 255, 255, 34), outline=(255, 255, 255, 110), width=2); im.alpha_composite(ov); d = ImageDraw.Draw(im)
T(d, (116, by + 18), '沒抽到也不吃虧:中秋前用碼', F(26), (230, 230, 245))
T(d, (116, by + 56), 'TSUKIMI', N(40), MOON)
T(d, (116 + d.textlength('TSUKIMI', font=N(40)) + 18, by + 60), '年費、買斷 9 折,月費 +7 天', F(26), (230, 230, 245))
pill(d, W - 80 - 250, H - 60 - 62, 'stayjp.study', F(30), NAVY1, WHITE, padx=24, pady=10)
im.convert('RGB').save(os.path.join(OUT, 'moon-giveaway.png'), quality=92); print('wrote moon-giveaway.png')
