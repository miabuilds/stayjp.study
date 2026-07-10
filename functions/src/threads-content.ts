// Threads 宣傳貼文「內容池 + 輪播引擎」
//
// 帳號:@osaka.hitori.log(みや)— 台日創作者、32歲、一個人住大阪、上班族,
// 為了考 N2 自己做了免費日文學習網站「日本再留計畫 / Stay JP」(stayjp.study)。粉絲 ~3.6k。
//
// ── 從本人高讚貼文拆出的「爆款公式」(照這個寫,才不像 AI)──────────────
//  ① 情緒/脆弱 = 觸及引擎:最爆一篇(37.9萬瀏覽/1萬讚)是「32歲一個人邊吃晚餐邊哭」,
//     完全沒連結、沒產品。→ route:"emo",一律不帶連結,衝觸及與漲粉。
//  ② 痛點+創辦人+免費 = 轉換引擎:「簽證變嚴格沒N2沒安全感」「為了考N2我做了這網站」
//     +「完全免費」+ 具體數字(7,710單字/433文法)。→ route:"founder",帶連結。
//  ③ 斷行短句,一行一個念頭(像自言自語,不是寫文章)。
//  ④ emoji 點綴句尾就好(☺️🥹🫶💡🔥),不要鋪滿。
//  ⑤ 連結只放在 founder 篇;情緒/生活篇不放,讓故事呼吸(本人也是這樣操作)。
//
// ── 反「假掰」+ 反 AI 的寫作紀律(改文案前先讀,別把它寫回 AI 腔)──────────
//  ✗ 別金句收尾:每篇都悟出人生道理 = 最大的假掰源,砍掉。
//  ✓ 用具體細節製造真實:真價格(¥298)、真食物、真店、真時間、真數字。
//  ✓ 脆弱靠「具體」不靠「說出口」:「我好寂寞」是假掰;「站在超商門口把布丁吃完才回家」是真。
//  ✓ 有些貼文就讓它斷在那,不收尾、不給教訓。自嘲取代勵志。長短交錯。
//
// {LINK} 由 constants 的 siteOrigin 自動帶入(= https://stayjp.study)。
// slot:"morning"=早 08:00、"evening"=晚 21:00、"any"=兩場皆可
// route:emo=情緒共鳴 / life=生活美食 / founder=創辦人+工具 / ask=互動

export type Slot = "morning" | "evening";
export type Route = "emo" | "life" | "founder" | "ask";

export interface PostTemplate {
  route: Route;
  slot: Slot | "any";
  text: string; // 可含 {LINK};emo/life/ask 一律不放連結
}

export const POOL: PostTemplate[] = [
  // ── 情緒共鳴(觸及引擎,不帶連結)── 晚場為主,夜深最有共鳴 ──────────
  {
    route: "emo",
    slot: "evening",
    text: "加班到十點半\n回家開燈\n房間跟早上出門時一模一樣\n連我沒收的那個杯子都還在原位\n沒有人動過\n\n其實也沒什麼\n就是放包包前愣了三秒",
  },
  {
    route: "emo",
    slot: "evening",
    text: "剛才視訊我媽\n她問我冰箱有沒有菜\n我把鏡頭轉過去\n她說「欸你那把蔥快爛了啦」\n\n掛掉之後我看著那把蔥笑了一下\n然後有點想哭\n沒事\n就是有點🥹",
  },
  {
    route: "emo",
    slot: "evening",
    text: "同事問我週末要幹嘛\n我說可能出去晃晃\n\n其實我知道我會睡到中午、洗個衣服\n然後又開始改我那個網站\n一個人的週末不用跟誰交代\n這件事我到現在還在學著喜歡",
  },
  {
    route: "emo",
    slot: "any",
    text: "32歲\n存款不多、N2還沒考過\n朋友一個個結婚生小孩\n我在大阪租的小房間裡改一個沒什麼人用的網站\n\n說不焦慮是騙人的\n但今天又多一個人來註冊\n我就還能再騙自己一天",
  },

  // ── 生活美食(觸及,不帶連結)── 早晚皆可 ──────────────────────
  {
    route: "life",
    slot: "morning",
    text: "おはよう\n早餐在全家買了紅豆麵包配無糖咖啡 ¥298\n店員今天沒問我要不要加熱\n\n可能是我臉太臭\n也可能是他記得我從來都說不用\n在同一間超商被記住\n是我最近最像「住在這裡」的一刻",
  },
  {
    route: "life",
    slot: "evening",
    text: "下班繞去一間沒進過的定食屋\n鯖魚定食 ¥880 味噌湯免費續\n隔壁大叔一個人喝啤酒配報紙\n我一個人扒飯配手機\n\n兩個都沒講話\n但那個安靜莫名很舒服",
  },
  {
    route: "life",
    slot: "morning",
    text: "週末騎腳踏車亂繞\n迷路到一條全是老房子的巷子\n有隻貓坐在門口完全不鳥我\n拍了大概二十張牠都同一個表情😐\n\n大阪最好的地方\n我覺得都是這種你查不到的",
  },

  // ── 創辦人 + 免費工具(轉換引擎,帶連結)──────────────────────
  {
    route: "founder",
    slot: "any",
    text: "講個有點不好意思的\n當初為了考 N2 找不到用得順的工具\n乾脆自己刻一個\n下班後一個人在房間慢慢寫\n沒團隊、沒錢\n\n7,710 個單字、433 個文法都在裡面\n完全免費\n因為我以前也是那個捨不得買參考書的窮學生\n{LINK}",
  },
  {
    route: "founder",
    slot: "any",
    text: "最近日本工作簽越來越難\n沒 N2 真的會慌\n\n我把自己備考的東西全整理成一個網站\n單字、文法、模擬考、SRS 間隔複習、聽力讀解\n不註冊也能用,想同步紀錄再 Google 登入就好\n\n跟我一樣在拚簽證的\n一起:{LINK}",
  },
  {
    route: "founder",
    slot: "any",
    text: "有人問我做這個網站賺不賺錢\n老實說 不賺\n還倒貼伺服器費\n\n但每天打開後台看到有人在背單字\n有人考過了跑來跟我說謝謝\n那個比賺錢還難戒\n\n免費,打開就能用:{LINK}",
  },
  {
    route: "founder",
    slot: "morning",
    text: "通勤的電車上與其發呆\n我都逼自己刷十個單字\n反正手機都拿出來了\n\n每天的份量我切得很短\n短到你沒藉口不做\n連續紀錄斷掉會有點不爽(然後就變動力了)\n\n今天的份在這,早安:{LINK}",
  },

  // ── 互動提問(觸及,不帶連結)──────────────────────────────
  {
    route: "ask",
    slot: "morning",
    text: "認真問\n學日文最想放棄的是哪一關\n五十音 / 助詞 は が を / 動詞變化 / 聽力跟不上\n\n留言告訴我你卡在哪\n最多人卡的那關,我下篇拆給你看👀",
  },
  {
    route: "ask",
    slot: "evening",
    text: "想問也在考 JLPT 的大家\n你都怎麼背單字\n抄到手痠派 / App 派 / 看到吐再說派😂\n\n我自己是滾了好幾種才找到能撐下去的\n留言聊聊,搞不好能互相救",
  },
  {
    route: "ask",
    slot: "any",
    text: "住大阪的大家\n有沒有那種觀光客不會知道、只有在地人才去的口袋名單\n咖啡廳、定食、散步路線都行\n\n最近很想多走走\n順便逼自己跟店員多聊兩句練日文",
  },
];

/**
 * 從池中挑一篇:
 *  - 先依 slot 過濾(含 "any")
 *  - 排除最近發過的 index;該 slot 全發過就重置
 *  - 盡量挑 route 跟上一篇不同,維持變化
 * 回傳該篇在 POOL 的全域 index、已填好連結的文字、route。
 */
export function pickPost(opts: {
  slot: Slot;
  used: number[];
  lastRoute?: Route;
  siteOrigin: string;
}): { index: number; text: string; route: Route } {
  const { slot, siteOrigin } = opts;
  let used = opts.used || [];

  const matchSlot = (i: number) => POOL[i].slot === slot || POOL[i].slot === "any";
  const allIdx = POOL.map((_, i) => i).filter(matchSlot);

  // 候選 = 符合 slot 且最近沒發過
  let candidates = allIdx.filter((i) => !used.includes(i));
  if (candidates.length === 0) {
    used = used.filter((i) => !matchSlot(i)); // 只重置這個 slot
    candidates = allIdx;
  }

  // 盡量避開上一篇的 route(維持變化)
  const diffRoute = opts.lastRoute
    ? candidates.filter((i) => POOL[i].route !== opts.lastRoute)
    : [];
  const finalPool = diffRoute.length > 0 ? diffRoute : candidates;

  const index = finalPool[Math.floor(Math.random() * finalPool.length)];
  const link = siteOrigin.replace(/\/+$/, "");
  const text = POOL[index].text.replace(/\{LINK\}/g, link);
  return { index, text, route: POOL[index].route };
}
