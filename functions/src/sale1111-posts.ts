// 雙11 Threads 貼文(正本 ~/stayjp-marketing/sale-1111-kit.md,Mia 2026-11-05 看過)。at = UTC epoch 秒。
// 韓文版 k1/k2 依 Mia 11/5 決定:dev_anywhere(personal) 跟 staytw.kr(tw_ko) 都發。
const TW = (m: number, d: number, h: number, mi = 0) => Math.floor(Date.UTC(2026, m - 1, d, h - 8, mi, 0) / 1000);
const U = (c: string) => `https://stayjp.study/pricing.html?utm_source=threads&utm_medium=social&utm_campaign=sale1111&utm_content=${c}`;
const G = (c: string) => `https://stayjp.study/group.html?utm_source=threads&utm_medium=social&utm_campaign=sale1111&utm_content=${c}`;
const CARD = "https://stayjp.study/images/social/sale1111/sale-card.jpg";
const CARD_1DAY = "https://stayjp.study/images/social/sale1111/sale-card-1day.jpg";
const CARD_LAST = "https://stayjp.study/images/social/sale1111/sale-card-last.jpg";
const PANEL = "https://stayjp.study/images/social/m-panel.png";
const GROUP = "https://stayjp.study/images/social/group-promo-a.jpg";
// 11/9 Mia:dev_anywhere 也要早晚各一篇附圖 → 加 p0/p1m/p1e/p2e,p2 補圖。
// 11/9 Mia:brand 早晚都要發、每篇附圖 → 加 b2e/b3m/b4m,b3/b4 補圖。

const K1 = "11월 9일~11일, StayJP 앱 연간권·평생권 할인\n\n연간권: 지금 구독하면 매년 갱신도 같은 가격\n평생권: 한 번 결제, 이후 결제 없음\n월간권: 변동 없음\n\n한국어 UI 지원\nN5~N1 단어·문법·JLPT 문제·AI 따라 읽기 전부 포함\n11월 11일 23:59 (대만 시간) 까지";
const K2 = "StayJP 할인 오늘 23:59 (대만 시간) 마감\n\n연간권 지금 구독하면 매년 같은 가격\n평생권 한 번 결제로 끝\n\n앱에서 바로 보여요";
const K_REPLY = "iOS https://apps.apple.com/app/id6778227353\nAndroid https://play.google.com/store/apps/details?id=com.stayjp.app\n앱 안 가격은 스토어 환율로 자동 표시돼요";

export const SALE1111_POSTS: { id: string; account: string; at: number; tw: string; text: string; reply: string; images?: string }[] = [
  {
    id: "b1", account: "brand", at: TW(11, 8, 12), tw: "11/8 12:00",
    text: "1111 四個 1\n今年雙11 StayJP 玩揪 4 個人\n\n4 人一團年費 5,990\n一個人 1,498\n11/9～11/11 開的團，四個人每人多送一個月\n\n一個人付款，三個朋友點連結就開通\n團裡有每週排行，看誰讀最多\n\n個人方案也有：年費 1,490、買斷 3,990\n11/9 00:00 開始，三天",
    reply: `揪團頁（官網限定）\n${G("b1")}`,
    images: CARD,
  },
  {
    id: "b2", account: "brand", at: TW(11, 9, 8), tw: "11/9 08:00",
    text: "雙11 開始了，到 11/11 23:59\n\n年費 NT$1,490\n這三天買的，之後每年續訂都是 1,490\n\n買斷 NT$3,990\n一次付清，不用再管續訂\n\n4 人揪團年費 5,990，每人多送一個月\n\n月費不變\nApp 內、官網都是這個價",
    reply: `方案頁\n${U("b2")}\n官網有推薦碼的話年費 1,340、買斷 3,590`,
    images: CARD,
  },
  { id: "k1", account: "tw_ko", at: TW(11, 9, 10), tw: "11/9 10:00", text: K1, reply: K_REPLY },
  { id: "k1p", account: "personal", at: TW(11, 9, 10), tw: "11/9 10:00", text: K1, reply: K_REPLY },
  {
    id: "p0", account: "personal", at: TW(11, 9, 11, 30), tw: "11/9 11:30",
    text: "StayJP 雙11 開始了 🥳\n年費 1,490 買斷 3,990\n到 11/11 晚上\n\n年費這次買的 之後每年都是這個價",
    reply: U("p0"),
    images: CARD,
  },
  {
    id: "p1", account: "personal", at: TW(11, 9, 21), tw: "11/9 21:00",
    text: "雙11 年費 1,490\n除以 365 一天 4 塊\n4 個人揪團 5,990，一人 1,498，還多送一個月\n一天 3.8 塊 🙈\n\n買斷 3,990\n到 11/11 晚上",
    reply: U("p1"),
    images: CARD,
  },
  {
    id: "b2e", account: "brand", at: TW(11, 9, 21), tw: "11/9 21:00",
    text: "先講清楚一件事\n年費 1,490 不是只有第一年\n\n這三天訂的，之後每年續訂都 1,490\n以後漲價也跟你無關\n\n買斷 3,990 一次付清\n11/11 23:59 結束",
    reply: `方案頁\n${U("b2e")}\n官網有推薦碼的話年費 1,340、買斷 3,590`,
    images: CARD,
  },
  {
    id: "b3m", account: "brand", at: TW(11, 10, 9), tw: "11/10 09:00",
    text: "還沒用過的\n先用免費版，每天都有試用次數\n單字、文法直接看到飽\n\n順手再升級\n雙11 年費 1,490、買斷 3,990\n到 11/11 23:59",
    reply: `方案頁（免費版能做什麼也寫在裡面）\n${U("b3m")}`,
    images: PANEL + "," + CARD,
  },
  {
    id: "p1m", account: "personal", at: TW(11, 10, 9, 30), tw: "11/10 09:30",
    text: "雙11 揪團\n4 個人 5,990 一人 1,498\n一個人付款 另外三個點連結就開通\n這三天開的團每人多送一個月 🥳\n\n團裡有每週排行 看誰讀最多",
    reply: `揪團頁（官網限定）\n${G("p1m")}`,
    images: GROUP + "," + CARD,
  },
  {
    id: "p1e", account: "personal", at: TW(11, 10, 21), tw: "11/10 21:00",
    text: "StayJP 雙11 剩最後一天\n年費 1,490 買斷 3,990\n11/11 23:59 結束 🙈",
    reply: U("p1e"),
    images: CARD_1DAY,
  },
  {
    id: "b3", account: "brand", at: TW(11, 10, 21), tw: "11/10 21:00",
    text: "揪團被問最多的三題，一次回\n\nQ 一定要 4 個人嗎\n對，4 人一團，少一個人也可以先開，位子留著\n\nQ 團員要自己付錢嗎\n不用，主揪付 5,990，團員點連結登入就開通\n\nQ 多送的一個月怎麼算\n11/9～11/11 開的團，四個人都是 395 天，不用申請\n\n活動倒數 1 天",
    reply: `揪團頁\n${G("b3")}`,
    images: CARD_1DAY,
  },
  {
    id: "b4m", account: "brand", at: TW(11, 11, 9), tw: "11/11 09:00",
    text: "雙11 最後一天\n今晚 23:59 回原價\n\n年費 1,490（之後每年都這個價）\n買斷 3,990\n4 人揪團每人多送一個月\n\n還在想的今天想完 🙈",
    reply: U("b4m"),
    images: CARD_LAST,
  },
  {
    id: "p2", account: "personal", at: TW(11, 11, 12), tw: "11/11 12:00",
    text: "今天最後一天\nStayJP 年費 1,490、買斷 3,990\n晚上 23:59 回原價\n\n買了的人謝謝 🥳",
    reply: U("p2"),
    images: CARD_LAST,
  },
  { id: "k2", account: "tw_ko", at: TW(11, 11, 19), tw: "11/11 19:00", text: K2, reply: K_REPLY },
  { id: "k2p", account: "personal", at: TW(11, 11, 19), tw: "11/11 19:00", text: K2, reply: K_REPLY },
  {
    id: "p2e", account: "personal", at: TW(11, 11, 21), tw: "11/11 21:00",
    text: "StayJP 雙11 剩 3 小時\n年費 1,490 買斷 3,990\n過了今晚回原價 🙈",
    reply: U("p2e"),
    images: CARD_LAST,
  },
  {
    id: "b4", account: "brand", at: TW(11, 11, 20, 30), tw: "11/11 20:30",
    text: "雙11 今晚 23:59 結束\n\n年費 1,490（之後每年都是這個價）\n買斷 3,990\n4 人揪團每人多送一個月\n\n過了今晚就回 1,990 / 4,990",
    reply: U("b4"),
    images: CARD_LAST,
  },
];
