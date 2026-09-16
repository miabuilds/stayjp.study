# 推薦價宣傳圖 v2:生動版。橘紅漸層底、大字 9 折、優惠券卡片(虛線撕票口)、吉祥物小狸、重點色塊、QR。
# 三版本 × 2 張:1=優惠券(折扣+碼+連結+QR)、2=三步驟(iPhone 路徑放大,網頁/Android 小列)。1080×1350。
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import qrcode, os, math
OUT = '/Users/linyurou/Documents/GitHub/stay-jp-notes/images/social/ref917'
MAS = '/Users/linyurou/Documents/GitHub/stay-jp-notes/images/mascot'
W, H = 1080, 1350
CJK = '/System/Library/Fonts/Hiragino Sans GB.ttc'
NUM = '/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf'
ORANGE, DEEP, CREAM, INK, MUTED, YEL, GREEN, BLUE, WHITE = (212, 101, 74), (168, 62, 42), (255, 246, 236), (44, 36, 32), (120, 100, 92), (255, 205, 80), (34, 160, 96), (74, 127, 212), (255, 255, 255)
def F(size, bold=True): return ImageFont.truetype(CJK, size, index=1 if bold else 0)
def N(size): return ImageFont.truetype(NUM, size)
def T(d, xy, s, f, fill=INK, stroke=0, anchor=None): d.text(xy, s, font=f, fill=fill, stroke_width=stroke, stroke_fill=fill, anchor=anchor)
def mascot(name, w):
    im = Image.open(os.path.join(MAS, name)).convert('RGBA'); r = w / im.width; return im.resize((w, int(im.height * r)), Image.LANCZOS)
def shadow(im, box, radius, blur=18, alpha=70, dy=10):
    x0, y0, x1, y1 = box; sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle([x0, y0 + dy, x1, y1 + dy], radius=radius, fill=(0, 0, 0, alpha)); im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(blur)))
def gradient_bg():
    im = Image.new('RGBA', (W, H)); d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H; c = tuple(int(ORANGE[i] * (1 - t) + DEEP[i] * t) for i in range(3)) + (255,); d.line([(0, y), (W, y)], fill=c)
    # 大圓形裝飾
    dec = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dd = ImageDraw.Draw(dec)
    dd.ellipse([-220, -260, 420, 380], fill=(255, 255, 255, 26)); dd.ellipse([760, 980, 1320, 1540], fill=(255, 255, 255, 22)); dd.ellipse([880, -120, 1180, 180], fill=(255, 205, 80, 60))
    im.alpha_composite(dec); return im
def pill(d, x, y, s, f, fg, bg, padx=18, pady=9):
    w = d.textlength(s, font=f); h = f.size + pady * 2
    d.rounded_rectangle([x, y, x + w + padx * 2, y + h], radius=h // 2, fill=bg); d.text((x + padx, y + pady - 2), s, font=f, fill=fg); return w + padx * 2
def perforation(d, y, x0, x1, bg):
    # 撕票口:兩側半圓 + 中間虛線
    d.ellipse([x0 - 22, y - 22, x0 + 22, y + 22], fill=bg); d.ellipse([x1 - 22, y - 22, x1 + 22, y + 22], fill=bg)
    x = x0 + 40
    while x < x1 - 40: d.line([(x, y), (x + 14, y)], fill=(215, 205, 195), width=3); x += 26

def coupon(name, who, code, link, foot):
    im = gradient_bg(); d = ImageDraw.Draw(im)
    # 頂部標籤 + 標題
    pill(d, 80, 76, '日本再留計劃 StayJP', F(26), ORANGE, WHITE)
    T(d, (80, 150), who, F(34), (255, 236, 220))
    T(d, (80, 196), '年費、買斷', F(84), WHITE, 2)
    T(d, (80, 296), '直接', F(84), WHITE, 2)
    # 大 9折(黃)
    T(d, (330, 262), '9', N(160), YEL); T(d, (428, 314), '折', F(96), YEL, 2)
    T(d, (80, 426), '月費多送 7 天', F(38), (255, 236, 220), 1)
    # 小狸(右上,蓋在標題右側)
    m = mascot('tanuki-p06.png', 330); im.alpha_composite(m, (W - 60 - m.width, 120))
    # 優惠券卡
    cx0, cy0, cx1, cy1 = 80, 500, W - 80, 1180
    shadow(im, (cx0, cy0, cx1, cy1), 30, blur=22, alpha=90, dy=14); d = ImageDraw.Draw(im)
    d.rounded_rectangle([cx0, cy0, cx1, cy1], radius=30, fill=WHITE)
    # 上半:三個價格塊
    T(d, (cx0 + 36, cy0 + 30), '推薦價', F(28), MUTED)
    blocks = [('年費', 'NT$1,990', '1,790', '省 200', ORANGE), ('買斷', 'NT$5,990', '5,390', '省 600', DEEP), ('月費', 'NT$390', '+7天', '免費一週', GREEN)]
    bw = (cx1 - cx0 - 72 - 2 * 18) // 3; bx = cx0 + 36; by = cy0 + 74
    for lbl, old, new, tag, col in blocks:
        d.rounded_rectangle([bx, by, bx + bw, by + 250], radius=22, fill=CREAM)
        T(d, (bx + 22, by + 20), lbl, F(30), INK)
        if lbl != '月費':
            ow = d.textlength(old, font=F(24, False)); T(d, (bx + 22, by + 66), old, F(24, False), MUTED); d.line([(bx + 22, by + 82), (bx + 22 + ow, by + 82)], fill=MUTED, width=3)
            T(d, (bx + 22, by + 98), new, N(66), col)
        else:
            T(d, (bx + 22, by + 66), old, F(24, False), MUTED)
            T(d, (bx + 22, by + 98), '+7', N(66), col); T(d, (bx + 22 + d.textlength('+7', font=N(66)) + 6, by + 122), '天', F(40), col, 1)
        pill(d, bx + 22, by + 186, tag, F(24), WHITE, col, padx=14, pady=7)
        bx += bw + 18
    # 撕票口
    py = cy0 + 360; perforation(d, py, cx0, cx1, (0, 0, 0, 0))
    # 用背景色蓋撕票口半圓(讓它看起來被撕掉):重畫漸層色近似
    for cx in (cx0, cx1):
        t = py / H; c = tuple(int(ORANGE[i] * (1 - t) + DEEP[i] * t) for i in range(3)) + (255,); d.ellipse([cx - 22, py - 22, cx + 22, py + 22], fill=c)
    # 下半:碼 / 連結 / QR
    qr = qrcode.QRCode(box_size=10, border=1); qr.add_data(link); qr.make(fit=True)
    qim = qr.make_image(fill_color='#2C2420', back_color='white').convert('RGBA').resize((250, 250), Image.NEAREST)
    im.alpha_composite(qim, (cx1 - 36 - 250, py + 40)); d = ImageDraw.Draw(im)
    T(d, (cx1 - 36 - 250 + 40, py + 300), '掃我直接套用', F(22), MUTED)
    if code:
        T(d, (cx0 + 36, py + 40), '推薦碼', F(28), MUTED)
        d.rounded_rectangle([cx0 + 36, py + 84, cx0 + 36 + 460, py + 84 + 120], radius=20, fill=(255, 236, 220), outline=ORANGE, width=4)
        T(d, (cx0 + 36 + 230, py + 84 + 60), code, (N(78) if len(code) <= 7 else N(56)) if code.isascii() else F(56), ORANGE, anchor='mm')
        T(d, (cx0 + 36, py + 232), '或點連結', F(24), MUTED)
        T(d, (cx0 + 36, py + 266), link.replace('https://', ''), F(28), BLUE, 1)
    else:
        T(d, (cx0 + 36, py + 40), '拿到推薦碼或連結?', F(30), INK, 1)
        T(d, (cx0 + 36, py + 92), '點連結 / 掃 QR', F(26), MUTED)
        T(d, (cx0 + 36, py + 130), link.replace('https://', ''), F(30), BLUE, 1)
        T(d, (cx0 + 36, py + 200), '或到網頁方案頁輸入推薦碼', F(24), MUTED)
        T(d, (cx0 + 36, py + 240), 'iPhone 請一律點連結', F(24), ORANGE, 1)
    # 底部一行 + 網址
    T(d, (80, 1216), foot, F(24), (255, 236, 220))
    pill(d, W - 80 - 250, 1240, 'stayjp.study', F(30), ORANGE, WHITE, padx=24, pady=10)
    im.convert('RGB').save(os.path.join(OUT, name), quality=92); print('wrote', name)

def steps(name, link, pending_note):
    im = Image.new('RGBA', (W, H), CREAM + (255,)); d = ImageDraw.Draw(im)
    # 頂部橘色帶
    d.rectangle([0, 0, W, 300], fill=ORANGE + (255,)); dec = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dd = ImageDraw.Draw(dec); dd.ellipse([780, -160, 1220, 280], fill=(255, 255, 255, 30)); im.alpha_composite(dec); d = ImageDraw.Draw(im)
    pill(d, 80, 60, '日本再留計劃 StayJP', F(26), ORANGE, WHITE)
    T(d, (80, 130), '推薦價怎麼拿?', F(76), WHITE, 2)
    T(d, (80, 226), '照著做 3 步,價格自己變', F(32), (255, 236, 220))
    m = mascot('tanuki-p08.png', 250); im.alpha_composite(m, (W - 70 - m.width, 60)); d = ImageDraw.Draw(im)
    # iPhone 主流程(大)
    y = 340
    d.rounded_rectangle([80, y, W - 80, y + 560], radius=30, fill=WHITE + (255,), outline=ORANGE + (255,), width=4)
    pill(d, 110, y + 26, 'iPhone 用戶看這裡', F(28), WHITE, ORANGE, padx=20, pady=9)
    T(d, (W - 110, y + 40), '只能走連結,App 內沒有輸碼欄', F(22), MUTED, anchor='ra')
    st = [('用 Safari 點推薦連結', link.replace('https://', '')), ('按「在 App 開啟」', '沒裝 App 先安裝,再登入一次'), ('方案頁自動變推薦價', '直接購買就好,不用輸入任何東西')]
    sy = y + 100
    for i, (t1, t2) in enumerate(st):
        cx, cy = 150, sy + 40
        if i < 2: d.line([(cx, cy + 40), (cx, cy + 150 - 40)], fill=(240, 200, 185), width=6)
        d.ellipse([cx - 40, cy - 40, cx + 40, cy + 40], fill=ORANGE); T(d, (cx, cy), str(i + 1), N(46), WHITE, anchor='mm')
        T(d, (220, sy + 6), t1, F(38), INK, 1)
        T(d, (220, sy + 60), t2, F(26, False), MUTED if i != 0 else BLUE)
        sy += 150
    # 網頁 / Android 小列
    y2 = y + 590
    half = (W - 160 - 20) // 2
    for k, (title, col, lines) in enumerate([('網頁', BLUE, ['stayjp.study 方案頁', '輸入推薦碼(或點連結)', '登入 → 結帳']), ('Android', GREEN, ['App → 升級 Premium', '點「有推薦碼?」輸入', '選方案 → 購買'])]):
        x0 = 80 + k * (half + 20)
        d.rounded_rectangle([x0, y2, x0 + half, y2 + 250], radius=24, fill=WHITE + (255,))
        pill(d, x0 + 22, y2 + 22, title, F(26), WHITE, col, padx=16, pady=7)
        ly = y2 + 90
        for j, ln in enumerate(lines):
            d.ellipse([x0 + 22, ly + 6, x0 + 46, ly + 30], fill=col); T(d, (x0 + 34, ly + 18), str(j + 1), N(18), WHITE, anchor='mm')
            T(d, (x0 + 60, ly + 2), ln, F(24, False), INK); ly += 48
    # 底部:好康提醒 + 網址
    T(d, (80, 1220), pending_note, F(24), ORANGE if pending_note.startswith('※') else MUTED)
    pill(d, W - 80 - 250, 1240, 'stayjp.study', F(30), WHITE, INK, padx=24, pady=10)
    im.convert('RGB').save(os.path.join(OUT, name), quality=92); print('wrote', name)

coupon('official-1.png', '拿到推薦碼或連結的人', '', 'https://stayjp.study/pricing.html', '年費往後每年續扣都鎖 1,790 · 買斷一次付清永久使用')
steps('official-2.png', 'https://stayjp.study/?ref=推薦碼', '年費 1,790 · 買斷 5,390 · 月費 +7 天,三種都算推薦')
coupon('captain-1.png', '英文探長J 的專屬推薦', '666666', 'https://stayjp.study/?ref=666666', '年費往後每年續扣都鎖 1,790 · 買斷一次付清永久使用')
steps('captain-2.png', 'https://stayjp.study/?ref=666666', '推薦碼 666666 · 網頁與 Android 可直接輸入')
coupon('kol-template-1.png', 'KOL 的專屬推薦', '你的推薦碼', 'https://stayjp.study/?ref=你的碼', '把「你的推薦碼」換成自己的碼、連結換成 partner 頁那條')
steps('kol-template-2.png', 'https://stayjp.study/?ref=你的碼', '連結在 partner 頁一鍵複製,碼與連結都是你專屬的')
