// 小狸短劇(小狸的日本生活)資料:skits.html 列表/播放、app.html 面板橫條共用。
// 影片在 videos/skit/epNN.mp4(720p)+ epNN.jpg(封面=鉤子第一格);原始專案 ~/stayjp-video(Remotion)。
// 新增一集:這裡加一筆 + 放兩個檔。au = 重點句的範例音(videos/skit/audio/<au>.mp3,短劇裡的教學朗讀)。p = 教的句子(日)、r = 讀音、m/men = 意思、t/en = 標題、hook = 一句話懸念。
window.SKITS = [
  { n: 1, t: '拉麵店', en: 'Ramen shop', p: '替え玉ください', r: 'かえだまください', m: '麵再幫我加一球', men: 'Extra noodles, please', hook: '麵吃完湯還一堆？', hookEn: 'Noodles gone, soup left?' , au: 'a3' },
  { n: 2, t: '便利商店', en: 'Convenience store', p: '大丈夫です', r: 'だいじょうぶです', m: '不用了(婉拒)', men: "No thanks, I'm fine", hook: '店員問「温めますか？」', hookEn: '"Shall I heat it up?"' , au: 'e2_teach1' },
  { n: 3, t: '電車', en: 'Train', p: 'すみません、降ります', r: 'すみません、おります', m: '不好意思，我要下車', men: "Excuse me, I'm getting off", hook: '擠到下不了車', hookEn: 'Stuck on a packed train' , au: 'e3_teach' },
  { n: 4, t: '居酒屋', en: 'Izakaya', p: 'お会計お願いします', r: 'おかいけいおねがいします', m: '麻煩幫我結帳', men: 'Check, please', hook: '吃完要怎麼結帳？', hookEn: 'How to ask for the bill' , au: 'e4_teach' },
  { n: 5, t: '找廁所', en: 'Finding a toilet', p: 'トイレはどこですか', r: 'トイレはどこですか', m: '廁所在哪裡？', men: 'Where is the toilet?', hook: '肚子痛找不到廁所', hookEn: 'Urgent: where is it?' , au: 'e5_teach' },
  { n: 6, t: '美容院', en: 'Hair salon', p: '少しだけ切ってください', r: 'すこしだけきってください', m: '只要修一點點', men: 'Just a little trim, please', hook: '講錯一個字就剪光', hookEn: 'One wrong word…' , au: 'e6_teach' },
  { n: 7, t: '看醫生', en: 'Seeing a doctor', p: '頭が痛いです', r: 'あたまがいたいです', m: '我頭痛', men: 'I have a headache', hook: '哪裡痛要怎麼講？', hookEn: 'How to say what hurts' , au: 'e7_teach' },
  { n: 8, t: '宅配', en: 'Parcel delivery', p: '再配達お願いします', r: 'さいはいたつおねがいします', m: '麻煩重新配送', men: 'Please redeliver', hook: '包裹沒收到怎麼辦', hookEn: 'Missed your parcel?' , au: 'e8_teach' },
  { n: 9, t: '點餐', en: 'Ordering', p: 'おすすめは何ですか', r: 'おすすめはなんですか', m: '推薦什麼？', men: 'What do you recommend?', hook: '菜單全看不懂？', hookEn: "Can't read the menu?" , au: 'e9_teach' },
  { n: 10, t: '公司', en: 'At the office', p: 'お疲れ様でした', r: 'おつかれさまでした', m: '辛苦了', men: 'Thanks for your hard work', hook: '同事下班別回這句', hookEn: "Don't say this at work" , au: 'e10_teach' },
  { n: 11, t: '狸貓烏龍麵', en: 'Tanuki udon', p: 'たぬきうどん', r: 'たぬきうどん', m: '加天かす的烏龍麵', men: 'Udon with tempura bits', hook: '新朋友狐狸コン登場', hookEn: 'Meet Kon the fox' , au: 'e11_teach1' },
  { n: 12, t: '居酒屋點餐', en: 'Izakaya order', p: 'とりあえず生で', r: 'とりあえずなまで', m: '先來杯生啤', men: "Draft beer to start", hook: '居酒屋第一句點什麼？', hookEn: 'The first order at an izakaya' , au: 'e12_teach' },
  { n: 13, t: '逛街', en: 'Shopping', p: '見てるだけです', r: 'みてるだけです', m: '我只是看看', men: "I'm just looking", hook: '店員一直靠過來', hookEn: 'When staff keep approaching' , au: 'e13_teach' },
  { n: 14, t: '區役所', en: 'City office', p: '番号札を取ってください', r: 'ばんごうふだをとってください', m: '請抽號碼牌', men: 'Please take a number', hook: '等了兩小時的原因', hookEn: 'Why he waited two hours' , au: 'e14_teach' },
  { n: 15, t: 'やばい', en: 'Yabai', p: 'やばい', r: 'やばい', m: '糟了／超讚(看語氣)', men: 'Uh-oh / awesome (by tone)', hook: '「やばい」是好是壞？', hookEn: 'Good or bad?' , au: 'e15_teach' },
  { n: 16, t: '要袋子嗎', en: 'Need a bag?', p: 'お願いします', r: 'おねがいします', m: '要，麻煩你', men: 'Yes, please', hook: '千萬別回「いいです」', hookEn: "Don't answer いいです" , au: 'e16_teach1' },
  { n: 17, t: '麵的硬度', en: 'Noodle firmness', p: 'かためで', r: 'かためで', m: '麵硬一點', men: 'Firm noodles, please', hook: '拉麵店問「麵要多硬」', hookEn: '"How firm?" at a ramen shop' , au: 'e17_teach1' },
  { n: 18, t: '公司聚會', en: 'Drinking party', p: 'お酒は弱いんです', r: 'おさけはよわいんです', m: '我酒量不好', men: "I can't drink much", hook: '不想喝要怎麼說？', hookEn: 'How to turn down a drink' , au: 'e18_teach' },
  { n: 19, t: '趕電車', en: 'Rushing for a train', p: '駆け込み乗車', r: 'かけこみじょうしゃ', m: '衝進快關的車門', men: 'Rushing onto a train', hook: '車站一直廣播這句', hookEn: 'That station announcement' , au: 'e19_teach' },
  { n: 20, t: '試穿', en: 'Trying on', p: '試着してもいいですか', r: 'しちゃくしてもいいですか', m: '可以試穿嗎？', men: 'May I try this on?', hook: '試穿前要先問這句', hookEn: 'Ask before trying on' , au: 'e20_teach' },
  { n: 21, t: '道歉', en: 'Apologizing', p: '申し訳ございません', r: 'もうしわけございません', m: '非常抱歉(正式)', men: 'I sincerely apologize', hook: '日文道歉有三種', hookEn: 'Three ways to say sorry' , au: 'e21_teach1' },
  { n: 22, t: '開動了', en: 'Itadakimasu', p: 'いただきます', r: 'いただきます', m: '開動了(吃之前)', men: 'Said before eating', hook: '吃飯前後要說什麼？', hookEn: 'Before & after meals' , au: 'e22_teach1' },
  { n: 23, t: '快速車', en: 'Rapid train', p: '中野に止まりますか', r: 'なかのにとまりますか', m: '有停中野嗎？', men: 'Does it stop at Nakano?', hook: '電車一直不停？', hookEn: 'The train won\'t stop?' , au: 'e23_teach' },
  { n: 24, t: '半價貼紙', en: 'Half-price sticker', p: '半額', r: 'はんがく', m: '半價', men: 'Half price', hook: '超市晚上的搶購', hookEn: 'Evening supermarket rush' , au: 'e24_teach1' },
  { n: 25, t: '帶傘', en: 'Bring an umbrella', p: '傘を持って行ったほうがいい', r: 'かさをもっていったほうがいい', m: '最好帶傘出門', men: 'Better take an umbrella', hook: '朋友叫你帶傘', hookEn: 'Listen to your friend' , au: 'e25_teach' },
  { n: 26, t: '被問路', en: 'Asked for directions', p: 'ちょっとわかりません', r: 'ちょっとわかりません', m: '我不太清楚', men: "I'm not really sure", hook: '在日本被問路了', hookEn: 'Asked the way in Japan' , au: 'e26_teach' },
  { n: 27, t: '諺語・積沙成塔', en: 'Proverb: Every little bit', p: '塵も積もれば山となる', r: 'ちりもつもればやまとなる', m: '積沙成塔', men: 'Many a little makes a mickle', hook: '「積沙成塔」日文怎麼說？', hookEn: 'Proverb' , au: 'e27_teach' },
  { n: 28, t: '諺語・人有失手', en: 'Proverb: Even monkeys fall', p: '猿も木から落ちる', r: 'さるもきからおちる', m: '人有失手，馬有失蹄', men: 'Even experts make mistakes', hook: '「人有失手」日文怎麼說？', hookEn: 'Proverb' , au: 'e28_teach' },
  { n: 29, t: '諺語・花より団子', en: 'Proverb: Dumplings over flowers', p: '花より団子', r: 'はなよりだんご', m: '好看不如好吃', men: 'Substance over style', hook: '賞花只顧著吃？', hookEn: 'Proverb' , au: 'e29_teach' },
  { n: 30, t: '諺語・百折不撓', en: 'Proverb: Fall 7, rise 8', p: '七転び八起き', r: 'ななころびやおき', m: '百折不撓', men: 'Never give up', hook: '「百折不撓」日文怎麼說？', hookEn: 'Proverb' , au: 'e30_teach' },
  { n: 31, t: '諺語・欲速則不達', en: 'Proverb: Haste makes waste', p: '急がば回れ', r: 'いそがばまわれ', m: '欲速則不達', men: 'More haste, less speed', hook: '「欲速則不達」日文是？', hookEn: 'Proverb' , au: 'e31_teach' },
  { n: 32, t: '俚語・放鴿子', en: 'Slang: Bail last minute', p: 'ドタキャン', r: 'ドタキャン', m: '放鴿子(臨時取消)', men: 'Last-minute cancel', hook: '「放鴿子」日文怎麼說？', hookEn: 'Slang' , au: 'e32_teach' },
  { n: 33, t: '俚語・背黑鍋', en: 'Slang: Take the blame', p: '濡れ衣を着せられる', r: 'ぬれぎぬをきせられる', m: '背黑鍋、被冤枉', men: 'Be falsely accused', hook: '「背黑鍋」日文怎麼說？', hookEn: 'Slang' , au: 'e33_teach' },
  { n: 34, t: '俚語・吹牛', en: 'Slang: Exaggerate', p: '話を盛る', r: 'はなしをもる', m: '吹牛、講得很誇張', men: 'Exaggerate a story', hook: '「吹牛」日文怎麼說？', hookEn: 'Slang' , au: 'e34_teach' },
  { n: 35, t: '俚語・拍馬屁', en: 'Slang: Butter someone up', p: 'ごまをする', r: 'ごまをする', m: '拍馬屁', men: 'Flatter, suck up', hook: '「拍馬屁」日文怎麼說？', hookEn: 'Slang' , au: 'e35_teach' },
  { n: 36, t: '俚語・雞婆', en: 'Slang: Busybody', p: 'おせっかい', r: 'おせっかい', m: '雞婆、多管閒事', men: 'Meddlesome', hook: '「雞婆」日文怎麼說？', hookEn: 'Slang' , au: 'e36_teach' },
  { n: 37, t: '藥妝店', en: 'Drugstore', p: '目薬はありますか', r: 'めぐすりはありますか', m: '有眼藥水嗎？', men: 'Do you have eye drops?', hook: '找不到就問這句', hookEn: "Can't find it? Ask" , au: 'e37_teach' },
  { n: 38, t: '不要芥末', en: 'No wasabi', p: 'わさび抜きでお願いします', r: 'わさびぬきでおねがいします', m: '麻煩不要加芥末', men: 'No wasabi, please', hook: '壽司不要芥末', hookEn: 'Sushi without wasabi' , au: 'e38_teach' },
  { n: 39, t: '計程車', en: 'Taxi', p: 'ここまでお願いします', r: 'ここまでおねがいします', m: '麻煩到這裡', men: 'To here, please', hook: '計程車門別自己開', hookEn: "Don't open the taxi door" , au: 'e39_teach' },
  { n: 40, t: '丟垃圾', en: 'Trash day', p: '燃えるゴミ', r: 'もえるゴミ', m: '可燃垃圾', men: 'Burnable trash', hook: '丟錯天會被貼紙', hookEn: 'Wrong trash day' , au: 'e40_teach1' },
  { n: 41, t: '拍照', en: 'Taking photos', p: '写真を撮ってもいいですか', r: 'しゃしんをとってもいいですか', m: '可以拍照嗎？', men: 'May I take a photo?', hook: '拍照前先問這句', hookEn: 'Ask before you shoot' , au: 'e41_teach' },
  { n: 42, t: '錢湯', en: 'Public bath', p: 'タオルは湯船に入れないでね', r: 'タオルはゆぶねにいれないでね', m: '毛巾不要放進浴池喔', men: "Don't put your towel in the bath", hook: '毛巾不能放這裡', hookEn: 'Not in the bath!' , au: 'e42_teach' },
  { n: 43, t: '神社參拜', en: 'Shrine visit', p: '二礼二拍手一礼', r: 'にれいにはくしゅいちれい', m: '兩鞠躬、兩拍手、一鞠躬', men: 'Bow twice, clap twice, bow once', hook: '搖鈴搖太多次了', hookEn: 'Too much bell ringing' , au: 'e43_teach' },
  { n: 44, t: '迴轉壽司', en: 'Sushi train', p: '粉茶を入れてから', r: 'こなちゃをいれてから', m: '先放茶粉再加熱水', men: 'Put in the tea powder first', hook: '熱茶怎麼沒味道', hookEn: 'Why is my tea just water?' , au: 'e44_teach' },
  { n: 45, t: '投幣洗衣', en: 'Laundromat', p: 'これは洗濯機ですか', r: 'これはせんたくきですか', m: '這是洗衣機嗎？', men: 'Is this a washing machine?', hook: '衣服洗到縮水', hookEn: 'My clothes shrank' , au: 'e45_teach' },
  { n: 46, t: '搭公車', en: 'Taking the bus', p: '次、降ります', r: 'つぎ、おります', m: '下一站我要下車', men: "I'm getting off at the next stop", hook: '下車要怎麼說', hookEn: 'How to get off the bus' , au: 'e46_teach' }
];
window.skitAudio = function (au) { return au ? 'videos/skit/audio/' + au + '.mp3' : ''; };
window.skitFile = function (n, ext) { return 'videos/skit/ep' + (n < 10 ? '0' : '') + n + '.' + ext; };

// ko/vi/id/th:短劇標題/句意/懸念的翻譯在 misc-<code>.js(MISC_L10N[code].skits[n] = {t,m,hook}),疊到英文欄位(en/men/hookEn)上,
// 渲染端用 enOr/I18n.pick(zh, en) 時就會拿到目標語(pick 查不到繁中 key 會退 en 欄 → 即目標語)。
// app.html 已先載 misc-<code>.js;skits.html 沒有 → 這裡用 document.write 同步補載(本檔是同步 script,合法)。
window.applySkitsL10n = function () {
  try {
    if (typeof I18n === 'undefined' || !I18n.isPacked || !I18n.isPacked()) return;
    var M = window.MISC_L10N && window.MISC_L10N[I18n.getLang()]; if (!M || !M.skits) return;
    (window.SKITS || []).forEach(function (e) { var o = M.skits[e.n]; if (!o) return; if (o.t) e.en = o.t; if (o.m) e.men = o.m; if (o.hook) e.hookEn = o.hook; });
  } catch (e) {}
};
(function () {
  try {
    if (typeof I18n === 'undefined' || !I18n.isPacked || !I18n.isPacked()) return;
    if (window.MISC_L10N && window.MISC_L10N[I18n.getLang()]) { window.applySkitsL10n(); return; }
    document.write('<script src="misc-' + I18n.getLang() + '.js"><\/script><script>window.applySkitsL10n()<\/script>');
  } catch (e) {}
})();
