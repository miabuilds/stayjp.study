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
// {LINK} 由 SITE_ORIGIN secret 自動帶入(= https://stayjp.study)。
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
    text: "一個人在大阪的晚上\n煮了一人份的湯\n配飯吃到一半突然有點鼻酸\n不是難過\n是那種「我真的一個人在這裡生活了」的實感\n\n但隔天還是會起床、還是會去上班\n大人就是這樣吧",
  },
  {
    route: "emo",
    slot: "evening",
    text: "今天加班到很晚\n回家路上一個人也沒有\n只有便利商店的燈還亮著\n買了個布丁犒賞自己\n\n在日本一個人撐著的人\n今天也辛苦了🥹",
  },
  {
    route: "emo",
    slot: "evening",
    text: "來日本之後最常被問:一個人不寂寞嗎\n老實說會\n但我發現寂寞的時候,把時間丟去做點什麼\n讀日文、做我的網站、煮一頓好的\n那個洞就慢慢被填起來了\n\n寂寞不是要消滅它,是要跟它一起生活",
  },
  {
    route: "emo",
    slot: "any",
    text: "32歲,裸辭去爬山旅居的夢還很遠\n但每天把日文推進一點點、把網站做好一點點\n就覺得有在靠近那個版本的自己🏔️\n\n慢慢來\n比較快",
  },

  // ── 生活美食(觸及,不帶連結)── 早晚皆可 ──────────────────────
  {
    route: "life",
    slot: "morning",
    text: "おはよう☀️\n剛去附近的パン屋買早餐\n店員問「温めますか?」\n我終於能很自然地回「大丈夫です」\n\n剛來大阪時連這句都要愣三秒\n原來進步是這樣不知不覺發生的",
  },
  {
    route: "life",
    slot: "evening",
    text: "目前在大阪吃到最台的台灣味\n不是台灣風\n是真的一模一樣\n吃到第一口眼眶有點熱🥹\n\n在外地生活的人都懂\n有時候想念的不是食物\n是那個味道背後的家",
  },
  {
    route: "life",
    slot: "morning",
    text: "週末一個人騎腳踏車亂晃\n大阪的巷弄真的很好拍\n沒有計畫、沒有要趕去哪\n這種一個人的自由\n是來日本之後才慢慢學會享受的",
  },

  // ── 創辦人 + 免費工具(轉換引擎,帶連結)──────────────────────
  {
    route: "founder",
    slot: "any",
    text: "為了考到 N2,我做了一個日文學習網站\n「日本再留計畫」\n完全免費\n我自己最推的功能是跟讀、還有快速背單字\n方便記憶\n\n推薦用 Google 登入,換裝置學習紀錄也都還在📝\n{LINK}",
  },
  {
    route: "founder",
    slot: "any",
    text: "聽說日本工作簽證越來越嚴\n沒有 N2 真的有點沒安全感\n\n所以我把所有備考資源整理成一個免費工具:\n7,710 個單字、433 個文法、模擬考、SRS 間隔複習、聽力讀解\n全部免費,打開就能用\n跟我一樣在拚簽證的,一起:{LINK}",
  },
  {
    route: "founder",
    slot: "any",
    text: "說個有點害羞的\n當初為了考 N2 找不到順手的工具\n乾脆自己刻了一個\n下班後一個人在大阪的小房間裡慢慢做\n沒團隊、沒資金\n\n免費的,因為我也是窮學生過來的\n現在還有人在用,每次看到都很感動:{LINK}",
  },
  {
    route: "founder",
    slot: "morning",
    text: "每天早上通勤的電車上\n與其無腦刷,不如刷個十個單字\n反正都是滑手機\n\n我把每日份量切得很短,就是逼自己別斷\n連續紀錄斷掉真的會很不爽(然後變成動力)\n早安,今天的份在這:{LINK}",
  },

  // ── 互動提問(觸及,不帶連結)──────────────────────────────
  {
    route: "ask",
    slot: "morning",
    text: "認真問大家\n學日文最想放棄的是哪一關?\nA 五十音\nB 助詞 は/が/を\nC 動詞變化\nD 聽力跟不上\n\n留言報數,我看最多人卡哪,下篇就拆那關👀",
  },
  {
    route: "ask",
    slot: "evening",
    text: "想問問也在考 JLPT 的大家\n你都怎麼背單字?\n抄寫派?App 派?還是看到吐再說派😂\n\n我自己是慢慢摸出一套刷法才撐下來的\n留言聊聊,搞不好能互相救",
  },
  {
    route: "ask",
    slot: "any",
    text: "在大阪的大家——\n有沒有那種觀光客不知道、只有在地人會去的口袋名單?\n咖啡廳、定食、散步路線都行\n我最近想多走走,順便練日文聊天☕",
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
