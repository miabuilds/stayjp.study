// 小狸短劇(小狸的日本生活)資料:skits.html 列表/播放、app.html 面板橫條共用。
// 影片在 videos/skit/epNN.mp4(720p)+ epNN.jpg(封面=鉤子第一格);原始專案 ~/stayjp-video(Remotion)。
// 新增一集:這裡加一筆 + 放兩個檔。p = 教的句子(日)、r = 讀音、m/men = 意思、t/en = 標題、hook = 一句話懸念。
window.SKITS = [
  { n: 1, t: '拉麵店', en: 'Ramen shop', p: '替え玉ください', r: 'かえだまください', m: '麵再幫我加一球', men: 'Extra noodles, please', hook: '麵吃完湯還一堆？', hookEn: 'Noodles gone, soup left?' },
  { n: 2, t: '便利商店', en: 'Convenience store', p: '大丈夫です', r: 'だいじょうぶです', m: '不用了(婉拒)', men: "No thanks, I'm fine", hook: '店員問「温めますか？」', hookEn: '"Shall I heat it up?"' },
  { n: 3, t: '電車', en: 'Train', p: 'すみません、降ります', r: 'すみません、おります', m: '不好意思，我要下車', men: "Excuse me, I'm getting off", hook: '擠到下不了車', hookEn: 'Stuck on a packed train' },
  { n: 4, t: '居酒屋', en: 'Izakaya', p: 'お会計お願いします', r: 'おかいけいおねがいします', m: '麻煩幫我結帳', men: 'Check, please', hook: '吃完要怎麼結帳？', hookEn: 'How to ask for the bill' },
  { n: 5, t: '找廁所', en: 'Finding a toilet', p: 'トイレはどこですか', r: 'トイレはどこですか', m: '廁所在哪裡？', men: 'Where is the toilet?', hook: '肚子痛找不到廁所', hookEn: 'Urgent: where is it?' },
  { n: 6, t: '美容院', en: 'Hair salon', p: '少しだけ切ってください', r: 'すこしだけきってください', m: '只要修一點點', men: 'Just a little trim, please', hook: '講錯一個字就剪光', hookEn: 'One wrong word…' },
  { n: 7, t: '看醫生', en: 'Seeing a doctor', p: '頭が痛いです', r: 'あたまがいたいです', m: '我頭痛', men: 'I have a headache', hook: '哪裡痛要怎麼講？', hookEn: 'How to say what hurts' },
  { n: 8, t: '宅配', en: 'Parcel delivery', p: '再配達お願いします', r: 'さいはいたつおねがいします', m: '麻煩重新配送', men: 'Please redeliver', hook: '包裹沒收到怎麼辦', hookEn: 'Missed your parcel?' },
  { n: 9, t: '點餐', en: 'Ordering', p: 'おすすめは何ですか', r: 'おすすめはなんですか', m: '推薦什麼？', men: 'What do you recommend?', hook: '菜單全看不懂？', hookEn: "Can't read the menu?" },
  { n: 10, t: '公司', en: 'At the office', p: 'お疲れ様でした', r: 'おつかれさまでした', m: '辛苦了', men: 'Thanks for your hard work', hook: '同事下班別回這句', hookEn: "Don't say this at work" },
  { n: 11, t: '狸貓烏龍麵', en: 'Tanuki udon', p: 'たぬきうどん', r: 'たぬきうどん', m: '加天かす的烏龍麵', men: 'Udon with tempura bits', hook: '新朋友狐狸コン登場', hookEn: 'Meet Kon the fox' },
  { n: 12, t: '居酒屋點餐', en: 'Izakaya order', p: 'とりあえず生で', r: 'とりあえずなまで', m: '先來杯生啤', men: "Draft beer to start", hook: '居酒屋第一句點什麼？', hookEn: 'The first order at an izakaya' },
  { n: 13, t: '逛街', en: 'Shopping', p: '見てるだけです', r: 'みてるだけです', m: '我只是看看', men: "I'm just looking", hook: '店員一直靠過來', hookEn: 'When staff keep approaching' },
  { n: 14, t: '區役所', en: 'City office', p: '番号札を取ってください', r: 'ばんごうふだをとってください', m: '請抽號碼牌', men: 'Please take a number', hook: '等了兩小時的原因', hookEn: 'Why he waited two hours' },
  { n: 15, t: 'やばい', en: 'Yabai', p: 'やばい', r: 'やばい', m: '糟了／超讚(看語氣)', men: 'Uh-oh / awesome (by tone)', hook: '「やばい」是好是壞？', hookEn: 'Good or bad?' },
  { n: 16, t: '要袋子嗎', en: 'Need a bag?', p: 'お願いします', r: 'おねがいします', m: '要，麻煩你', men: 'Yes, please', hook: '千萬別回「いいです」', hookEn: "Don't answer いいです" },
  { n: 17, t: '麵的硬度', en: 'Noodle firmness', p: 'かためで', r: 'かためで', m: '麵硬一點', men: 'Firm noodles, please', hook: '拉麵店問「麵要多硬」', hookEn: '"How firm?" at a ramen shop' },
  { n: 18, t: '公司聚會', en: 'Drinking party', p: 'お酒は弱いんです', r: 'おさけはよわいんです', m: '我酒量不好', men: "I can't drink much", hook: '不想喝要怎麼說？', hookEn: 'How to turn down a drink' },
  { n: 19, t: '趕電車', en: 'Rushing for a train', p: '駆け込み乗車', r: 'かけこみじょうしゃ', m: '衝進快關的車門', men: 'Rushing onto a train', hook: '車站一直廣播這句', hookEn: 'That station announcement' },
  { n: 20, t: '試穿', en: 'Trying on', p: '試着してもいいですか', r: 'しちゃくしてもいいですか', m: '可以試穿嗎？', men: 'May I try this on?', hook: '試穿前要先問這句', hookEn: 'Ask before trying on' },
  { n: 21, t: '道歉', en: 'Apologizing', p: '申し訳ございません', r: 'もうしわけございません', m: '非常抱歉(正式)', men: 'I sincerely apologize', hook: '日文道歉有三種', hookEn: 'Three ways to say sorry' },
  { n: 22, t: '開動了', en: 'Itadakimasu', p: 'いただきます', r: 'いただきます', m: '開動了(吃之前)', men: 'Said before eating', hook: '吃飯前後要說什麼？', hookEn: 'Before & after meals' },
  { n: 23, t: '快速車', en: 'Rapid train', p: '中野に止まりますか', r: 'なかのにとまりますか', m: '有停中野嗎？', men: 'Does it stop at Nakano?', hook: '電車一直不停？', hookEn: 'The train won\'t stop?' },
  { n: 24, t: '半價貼紙', en: 'Half-price sticker', p: '半額', r: 'はんがく', m: '半價', men: 'Half price', hook: '超市晚上的搶購', hookEn: 'Evening supermarket rush' },
  { n: 25, t: '帶傘', en: 'Bring an umbrella', p: '傘を持って行ったほうがいい', r: 'かさをもっていったほうがいい', m: '最好帶傘出門', men: 'Better take an umbrella', hook: '朋友叫你帶傘', hookEn: 'Listen to your friend' },
  { n: 26, t: '被問路', en: 'Asked for directions', p: 'ちょっとわかりません', r: 'ちょっとわかりません', m: '我不太清楚', men: "I'm not really sure", hook: '在日本被問路了', hookEn: 'Asked the way in Japan' }
];
window.skitFile = function (n, ext) { return 'videos/skit/ep' + (n < 10 ? '0' : '') + n + '.' + ext; };
