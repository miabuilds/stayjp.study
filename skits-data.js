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
  { n: 11, t: '狸貓烏龍麵', en: 'Tanuki udon', p: 'たぬきうどん', r: 'たぬきうどん', m: '加天かす的烏龍麵', men: 'Udon with tempura bits', hook: '新朋友狐狸コン登場', hookEn: 'Meet Kon the fox' }
];
window.skitFile = function (n, ext) { return 'videos/skit/ep' + (n < 10 ? '0' : '') + n + '.' + ext; };
