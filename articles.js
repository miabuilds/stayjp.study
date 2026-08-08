// 文章閱讀(沉浸式分級閱讀,完整課文:內文+逐段中譯+重點單字+文法重點)。
// 獨立於 content-data.json,不會被內容重匯出覆蓋。body 純日文→渲染時 furiganaHTMLRich 自動 furigana+即點即查,零 API。
// 多語言:trans/m/note 為繁中(簡中由 OpenCC 轉);_en 欄為英文版。
window.ARTICLES = [
  {
    "id": "a-n5-1",
    "level": "n5",
    "topic": "日常",
    "title": "わたしの一日",
    "title_zh": "我的一天",
    "body": "わたしは まいあさ 六時に おきます。かおを あらって、あさごはんを たべます。\n七時半に いえを でて、でんしゃで かいしゃへ いきます。しごとは 九時からです。\nおひるは かいしゃの ちかくの みせで ラーメンを たべます。とても おいしいです。\nゆうがた 六時に しごとが おわります。うちに かえって、ばんごはんを つくります。\nよる、すこし にほんごを べんきょうして、十一時に ねます。\nしゅうまつは あまり しごとが ありません。ともだちと こうえんを さんぽしたり、えいがを 見たり します。\nいそがしい 毎日ですが、すこしずつ 日本語が 上手に なって、うれしいです。",
    "trans": [
      "我每天早上六點起床。洗臉,吃早餐。",
      "七點半出門,搭電車去公司。工作從九點開始。",
      "中午在公司附近的店吃拉麵。非常好吃。",
      "傍晚六點下班。回到家,做晚餐。",
      "晚上稍微學一下日文,十一點睡覺。",
      "週末幾乎沒有工作。會和朋友去公園散步、看電影之類的。",
      "雖然每天很忙,但日文一點一點變好,很開心。"
    ],
    "vocab": [
      {
        "w": "起きる",
        "r": "おきる",
        "m": "起床",
        "m_en": "to get up"
      },
      {
        "w": "顔",
        "r": "かお",
        "m": "臉",
        "m_en": "face"
      },
      {
        "w": "会社",
        "r": "かいしゃ",
        "m": "公司",
        "m_en": "company"
      },
      {
        "w": "昼",
        "r": "ひる",
        "m": "中午",
        "m_en": "noon"
      },
      {
        "w": "作る",
        "r": "つくる",
        "m": "做、製作",
        "m_en": "to make"
      }
    ],
    "grammar": [
      {
        "t": "に(時間)",
        "note": "時間點加「に」:六時に、十一時に。「毎朝」是相對時間,不加に。",
        "id": "n5-19",
        "t_en": "に (time)",
        "note_en": "Add に to a point in time: 六時に, 十一時に. 「毎朝」 is a relative time, so no に."
      },
      {
        "t": "で(交通/地點)",
        "note": "交通工具用で:電車で;動作地點也用で:店で食べる。",
        "id": "n5-21",
        "t_en": "で (transport / place)",
        "note_en": "で for means of transport: 電車で; also for the place of an action: 店で食べる."
      },
      {
        "t": "て形連接",
        "note": "動作接動作用て形:顔を洗って、朝ごはんを食べます。",
        "id": "n5-53",
        "t_en": "te-form linking",
        "note_en": "Use the te-form to link one action to the next: 顔を洗って、朝ごはんを食べます."
      }
    ],
    "title_en": "My Day",
    "topic_en": "Daily life",
    "trans_en": [
      "I get up at six every morning. I wash my face and eat breakfast.",
      "I leave home at 7:30 and take the train to work. Work starts at nine.",
      "At noon I eat ramen at a shop near the office. It is delicious.",
      "I finish work at six in the evening. I go home and make dinner.",
      "At night I study a little Japanese, and go to bed at eleven.",
      "On weekends I have almost no work. I do things like walk in the park with friends or watch a movie.",
      "Every day is busy, but my Japanese is getting better little by little, which makes me happy."
    ]
  },
  {
    "id": "a-n5-2",
    "level": "n5",
    "topic": "文化",
    "title": "日本の朝ごはん",
    "title_zh": "日本的早餐",
    "body": "日本の 伝統的な 朝ごはんは、ごはんと みそしるです。\nほかに、やいた さかなや たまごも よく たべます。のりも 人気が あります。\nさいきんは パンや コーヒーの 朝ごはんも おおいです。とくに わかい 人が すきです。\nいそがしい 朝は、おにぎりだけの 人も います。あなたの 国の 朝ごはんは 何ですか。\nパンと コーヒーの 朝ごはんも 人気ですが、わたしは やっぱり ごはんと みそしるが 好きです。\nあさ しっかり 食べると、一日 元気に すごせます。",
    "trans": [
      "日本傳統的早餐是白飯和味噌湯。",
      "此外,也常吃烤魚和蛋。海苔也很受歡迎。",
      "最近吃麵包、咖啡當早餐的也很多。尤其年輕人喜歡。",
      "忙碌的早上,也有人只吃飯糰。你的國家早餐吃什麼呢?",
      "麵包配咖啡的早餐也很受歡迎,不過我還是喜歡白飯和味噌湯。",
      "早上好好吃一頓,一整天都能有精神地度過。"
    ],
    "vocab": [
      {
        "w": "伝統的",
        "r": "でんとうてき",
        "m": "傳統的",
        "m_en": "traditional"
      },
      {
        "w": "焼く",
        "r": "やく",
        "m": "烤、燒",
        "m_en": "to grill / bake"
      },
      {
        "w": "人気",
        "r": "にんき",
        "m": "受歡迎",
        "m_en": "popular"
      },
      {
        "w": "若い",
        "r": "わかい",
        "m": "年輕的",
        "m_en": "young"
      },
      {
        "w": "忙しい",
        "r": "いそがしい",
        "m": "忙碌的",
        "m_en": "busy"
      }
    ],
    "grammar": [
      {
        "t": "や(部分列舉)",
        "note": "舉幾個代表、暗示還有其他:魚や卵、パンやコーヒー。",
        "id": "n5-28",
        "t_en": "や (partial listing)",
        "note_en": "Lists a few representative items, implying there are others: 魚や卵, パンやコーヒー."
      },
      {
        "t": "だけ",
        "note": "「只有」:おにぎりだけ=只有飯糰。",
        "id": "n5-38",
        "t_en": "だけ",
        "note_en": "\"only\": おにぎりだけ = only a rice ball."
      },
      {
        "t": "が人気があります",
        "note": "「~很受歡迎」,對象用が。",
        "id": "",
        "t_en": "〜が人気があります",
        "note_en": "\"~ is popular\"; mark the thing with が."
      }
    ],
    "title_en": "Japanese Breakfast",
    "topic_en": "Culture",
    "trans_en": [
      "A traditional Japanese breakfast is rice and miso soup.",
      "Grilled fish and eggs are also common. Nori (seaweed) is popular too.",
      "Recently, many people have bread and coffee for breakfast — young people especially.",
      "On busy mornings, some people just eat a rice ball. What do people eat for breakfast in your country?",
      "Bread and coffee is popular too, but I still prefer rice and miso soup.",
      "Eat well in the morning and you can spend the whole day full of energy."
    ]
  },
  {
    "id": "a-n4-1",
    "level": "n4",
    "topic": "文化",
    "title": "お花見",
    "title_zh": "賞櫻",
    "body": "春に なると、日本の あちこちで さくらが さきます。\n人々は こうえんに あつまって、さくらの 下で おべんとうを たべたり、お酒を のんだりします。これを「お花見」と 言います。\nさくらは とても きれいですが、さく 期間は 一週間ぐらいと みじかいです。だから、みんな この 時期を たのしみに しています。\n夜、ライトアップされた さくらも うつくしいです。ぜひ 一度 見に 行って みて ください。\nお花見の しゅうかんは 古くから あり、むかしの 人も さくらを 見て 春を たのしみました。\nただ、ばしょとりや ゴミの もんだいも あるので、マナーを まもる ことが 大切です。",
    "trans": [
      "一到春天,日本各地櫻花就綻放。",
      "人們聚集在公園,在櫻花下吃便當、喝酒。這叫做「賞櫻」。",
      "櫻花很美,但開花期間只有一週左右,很短。所以大家都很期待這個時節。",
      "夜晚打上燈光的櫻花也很美。請務必去看一次看看。",
      "賞櫻的習慣自古就有,以前的人也看著櫻花享受春天。",
      "不過也有佔位子和垃圾的問題,所以遵守禮儀很重要。"
    ],
    "vocab": [
      {
        "w": "咲く",
        "r": "さく",
        "m": "(花)開",
        "m_en": "to bloom"
      },
      {
        "w": "集まる",
        "r": "あつまる",
        "m": "聚集",
        "m_en": "to gather"
      },
      {
        "w": "期間",
        "r": "きかん",
        "m": "期間",
        "m_en": "period"
      },
      {
        "w": "楽しみ",
        "r": "たのしみ",
        "m": "期待、樂趣",
        "m_en": "looking forward to / a pleasure"
      },
      {
        "w": "美しい",
        "r": "うつくしい",
        "m": "美麗的",
        "m_en": "beautiful"
      }
    ],
    "grammar": [
      {
        "t": "~と(恆常條件)",
        "note": "「一~就~」自然結果:春になると、桜が咲く。",
        "id": "n4-57",
        "t_en": "〜と (natural result)",
        "note_en": "\"as soon as ~\" for a natural result: 春になると、桜が咲く."
      },
      {
        "t": "~たり~たり",
        "note": "列舉代表動作、暗示還有:食べたり飲んだりする。",
        "id": "n5-56",
        "t_en": "〜たり〜たり",
        "note_en": "Lists representative actions, implying others: 食べたり飲んだりする."
      },
      {
        "t": "~てみる",
        "note": "試著做看看:行ってみてください。",
        "id": "n4-23",
        "t_en": "〜てみる",
        "note_en": "Try doing something: 行ってみてください."
      }
    ],
    "title_en": "Cherry Blossom Viewing",
    "topic_en": "Culture",
    "trans_en": [
      "When spring comes, cherry blossoms bloom all over Japan.",
      "People gather in parks and eat bento and drink under the blossoms. This is called \"hanami.\"",
      "The blossoms are beautiful, but they only bloom for about a week, so everyone looks forward to this season.",
      "Cherry blossoms lit up at night are beautiful too. Do go and see them once.",
      "The custom of hanami is very old; people long ago also enjoyed spring watching the blossoms.",
      "But there are problems like saving spots and litter, so keeping good manners matters."
    ]
  },
  {
    "id": "a-n4-2",
    "level": "n4",
    "topic": "生活",
    "title": "電車の中のマナー",
    "title_zh": "電車裡的禮儀",
    "body": "日本の電車の中は、とても静かです。多くの人が本を読んだり、スマホを見たり、目を閉じて休んだりしています。\n電車の中で電話をかけるのは、マナー違反だと考えられています。話したいときは、駅で降りてからかけます。\nまた、優先席の近くでは、携帯電話の電源を切るように言われることもあります。ペースメーカーなどに影響するかもしれないからです。\nこうしたマナーの背景には、「まわりの人にめいわくをかけない」という日本の考え方があります。ルールというより、おたがいへの思いやりなのです。\nこうした マナーは、たくさんの 人が 気もちよく 電車を 使う ための ものです。\n自分だけでなく、まわりの 人の ことも 考えると、みんなが 快適に すごせます。",
    "trans": [
      "日本的電車裡非常安靜。很多人在看書、看手機,或閉著眼睛休息。",
      "在電車裡講電話被認為是違反禮儀的。想講的時候,會在車站下車後再打。",
      "另外,在博愛座附近,有時會被要求關掉手機電源。因為可能會影響心律調節器等。",
      "這些禮儀的背後,有日本「不給周圍的人添麻煩」的想法。與其說是規則,更像是對彼此的體貼。",
      "這些禮儀是為了讓許多人都能舒服地搭電車。",
      "不只想到自己,也顧慮周遭的人,大家就都能舒適地度過。"
    ],
    "vocab": [
      {
        "w": "静か",
        "r": "しずか",
        "m": "安靜",
        "m_en": "quiet"
      },
      {
        "w": "違反",
        "r": "いはん",
        "m": "違反",
        "m_en": "violation"
      },
      {
        "w": "優先席",
        "r": "ゆうせんせき",
        "m": "博愛座",
        "m_en": "priority seat"
      },
      {
        "w": "影響",
        "r": "えいきょう",
        "m": "影響",
        "m_en": "influence / effect"
      },
      {
        "w": "思いやり",
        "r": "おもいやり",
        "m": "體貼、關懷",
        "m_en": "consideration / thoughtfulness"
      }
    ],
    "grammar": [
      {
        "t": "~たり~たり",
        "note": "列舉動作:読んだり、見たり、休んだり。",
        "id": "n5-56",
        "t_en": "〜たり〜たり",
        "note_en": "Lists actions: 読んだり、見たり、休んだり."
      },
      {
        "t": "~ように言われる",
        "note": "被要求(做)~:電源を切るように言われる。",
        "id": "",
        "t_en": "〜ように言われる",
        "note_en": "To be asked/told to do ~: 電源を切るように言われる."
      },
      {
        "t": "~という(名詞化引用)",
        "note": "「~という考え方」引用內容/名稱。",
        "id": "n5-68",
        "t_en": "〜という (quoting / naming)",
        "note_en": "\"the idea/name called ~\" — quotes content or a name."
      }
    ],
    "title_en": "Etiquette on the Train",
    "topic_en": "Everyday life",
    "trans_en": [
      "Japanese trains are very quiet. Many people read, look at their phones, or rest with their eyes closed.",
      "Talking on the phone on the train is considered bad manners. When you need to, you get off at the station first.",
      "Also, near the priority seats you may be asked to turn your phone off, because it could affect things like pacemakers.",
      "Behind these manners is the Japanese idea of \"not causing trouble to those around you.\" More than rules, it is consideration for one another.",
      "These manners exist so that many people can use the train comfortably.",
      "When you think not only of yourself but of those around you, everyone can travel comfortably."
    ]
  },
  {
    "id": "a-n4-3",
    "level": "n4",
    "topic": "旅遊",
    "title": "古都・京都を歩く",
    "title_zh": "漫步古都京都",
    "body": "京都は、千年以上むかしに日本の首都だった町です。今でも、古いお寺や神社がたくさん残っています。\n春は桜、秋は紅葉がとても美しく、季節ごとにちがう顔を見せてくれます。だから、何度おとずれてもあきません。\n京都を旅行するときは、いそがずに歩くのがおすすめです。細い道を曲がると、しずかなお寺や、むかしながらの喫茶店に出会えます。\n有名な観光地だけでなく、地元の人が通う小さな店をのぞいてみると、本当の京都の魅力が見えてくるでしょう。\n京都は きせつごとに ちがう かおを 見せて くれます。春は さくら、秋は もみじが とても きれいです。\n古い たてものを 守りながら、新しい 文化も 取り入れて いる ところが、京都の みりょくです。",
    "trans": [
      "京都是一千多年前曾是日本首都的城市。至今仍保留著許多古老的寺廟和神社。",
      "春天的櫻花、秋天的紅葉都非常美,每個季節都展現不同的面貌。所以不管來幾次都不會膩。",
      "在京都旅行時,推薦不趕時間地慢慢走。轉進小巷,就能遇見安靜的寺廟、古色古香的咖啡店。",
      "不只有名的觀光地,如果去看看當地人常去的小店,就能看見京都真正的魅力吧。",
      "京都每個季節都展現不同的面貌。春天的櫻花、秋天的紅葉都非常美。",
      "一邊守護古老建築、一邊也吸收新文化,正是京都的魅力。"
    ],
    "vocab": [
      {
        "w": "首都",
        "r": "しゅと",
        "m": "首都",
        "m_en": "capital"
      },
      {
        "w": "残る",
        "r": "のこる",
        "m": "留下、殘存",
        "m_en": "to remain"
      },
      {
        "w": "訪れる",
        "r": "おとずれる",
        "m": "造訪",
        "m_en": "to visit"
      },
      {
        "w": "曲がる",
        "r": "まがる",
        "m": "轉彎",
        "m_en": "to turn (a corner)"
      },
      {
        "w": "魅力",
        "r": "みりょく",
        "m": "魅力",
        "m_en": "charm / appeal"
      }
    ],
    "grammar": [
      {
        "t": "~ごとに",
        "note": "「每~」:季節ごとに=每個季節。",
        "id": "",
        "t_en": "〜ごとに",
        "note_en": "\"every ~\": 季節ごとに = every season."
      },
      {
        "t": "~ても(讓步)",
        "note": "「即使~也」:何度訪れてもあきない。",
        "id": "n3-73",
        "t_en": "〜ても (concession)",
        "note_en": "\"even if ~\": 何度訪れてもあきない."
      },
      {
        "t": "~だけでなく",
        "note": "「不只~(還)」:観光地だけでなく、小さな店も。",
        "id": "n2-27",
        "t_en": "〜だけでなく",
        "note_en": "\"not only ~ (but also)\": 観光地だけでなく、小さな店も."
      }
    ],
    "title_en": "Walking Through Kyoto, the Old Capital",
    "topic_en": "Travel",
    "trans_en": [
      "Kyoto was Japan’s capital over a thousand years ago. Many old temples and shrines still remain there today.",
      "Cherry blossoms in spring and red leaves in autumn are beautiful; each season shows a different face, so you never tire of it no matter how often you visit.",
      "When traveling in Kyoto, it’s best to walk slowly without rushing. Turn down a side street and you’ll come across quiet temples and old-fashioned cafes.",
      "Not just the famous sights — if you visit the small shops the locals go to, you’ll surely see the real charm of Kyoto.",
      "Kyoto shows a different face each season. The cherry blossoms in spring and the red leaves in autumn are beautiful.",
      "Protecting old buildings while also taking in new culture — that is exactly Kyoto’s charm."
    ]
  },
  {
    "id": "a-n3-1",
    "level": "n3",
    "topic": "生活",
    "title": "コンビニの便利さ",
    "title_zh": "便利商店的方便",
    "body": "日本の コンビニは、二十四時間 あいて いて、とても べんりです。\n食べ物や 飲み物だけで なく、雑誌や 日用品も 買えます。それに、公共料金の しはらいや、荷物の 発送も できます。\n銀行の ATM も あるので、いつでも お金を おろせます。コピーや チケットの 予約が できる 機械も あります。\nこうした サービスの おかげで、コンビニは 私たちの 生活に かかせない 存在に なりました。\nしかし、便利さの うらには、二十四時間 はたらく 人の 苦労や、食品ロスなどの 問題も かくれている。\n便利さを 当たり前だと 思わず、その しくみを ささえる 人の ことも 考えたい。",
    "trans": [
      "日本的便利商店二十四小時營業,非常方便。",
      "不只食物、飲料,連雜誌、日用品都買得到。而且還能繳公共費用、寄送包裹。",
      "因為也有銀行 ATM,隨時都能領錢。還有能影印、預約票券的機器。",
      "多虧這些服務,便利商店成了我們生活中不可或缺的存在。",
      "然而,便利的背後也隱藏著 24 小時工作的人的辛勞,以及食物浪費等問題。",
      "不要把便利視為理所當然,也想多想想支撐這套機制的人。"
    ],
    "vocab": [
      {
        "w": "便利",
        "r": "べんり",
        "m": "方便",
        "m_en": "convenient"
      },
      {
        "w": "支払い",
        "r": "しはらい",
        "m": "支付、繳費",
        "m_en": "payment"
      },
      {
        "w": "発送",
        "r": "はっそう",
        "m": "寄送",
        "m_en": "shipping / sending"
      },
      {
        "w": "欠かせない",
        "r": "かかせない",
        "m": "不可或缺的",
        "m_en": "indispensable"
      },
      {
        "w": "存在",
        "r": "そんざい",
        "m": "存在",
        "m_en": "existence / presence"
      }
    ],
    "grammar": [
      {
        "t": "~だけでなく",
        "note": "「不只~(還)」。",
        "id": "n2-27",
        "t_en": "〜だけでなく",
        "note_en": "\"not only ~ (but also).\""
      },
      {
        "t": "~ので",
        "note": "「因為~」,較客觀委婉:ATM があるので。",
        "id": "n4-7",
        "t_en": "〜ので",
        "note_en": "\"because ~,\" more objective and soft: ATM があるので."
      },
      {
        "t": "~おかげで",
        "note": "「多虧~」正面原因:サービスのおかげで。",
        "id": "n3-6",
        "t_en": "〜おかげで",
        "note_en": "\"thanks to ~,\" a positive cause: サービスのおかげで."
      }
    ],
    "title_en": "The Convenience of Convenience Stores",
    "topic_en": "Everyday life",
    "trans_en": [
      "Japanese convenience stores are open 24 hours and are very convenient.",
      "You can buy not only food and drinks but also magazines and daily goods. You can even pay utility bills and send parcels.",
      "Because there are bank ATMs, you can withdraw cash anytime. There are also machines for copying and booking tickets.",
      "Thanks to these services, convenience stores have become an indispensable part of our lives.",
      "However, behind that convenience hide the hard work of people working 24 hours and problems like food waste.",
      "Rather than taking convenience for granted, I want to think about the people who support the system too."
    ]
  },
  {
    "id": "a-n3-2",
    "level": "n3",
    "topic": "生活",
    "title": "一人暮らしで学んだこと",
    "title_zh": "獨居生活學到的事",
    "body": "大学に入って、初めて一人暮らしを始めた。最初は、自由になれてうれしかった。\nしかし、実際に暮らしてみると、料理も洗濯もそうじも、すべて自分でやらなければならない。今まで親がしてくれていたことの多さに、あらためて気づかされた。\nお金の使い方も考えるようになった。限られた生活費の中で、何が本当に必要なのかを、自然に判断するようになる。\n一人暮らしは大変なことも多いが、自分のことを自分でやる力がつく。そして何より、家族のありがたさが、前よりずっと分かるようになった。\n一人だと さびしい ことも あるが、その ぶん 自分の 時間を じゆうに 使える。\n家族の ありがたさに 気づいたのも、はなれて くらし はじめてからだった。",
    "trans": [
      "上了大學,第一次開始一個人住。一開始,能變得自由很開心。",
      "但是,實際生活後才發現,做飯、洗衣、打掃全都得自己來。這才重新意識到,至今父母為我做了多少事。",
      "也開始會思考用錢的方式。在有限的生活費中,自然學會判斷什麼才是真正需要的。",
      "獨居雖然辛苦的事很多,但能培養自己打理自己的能力。而最重要的是,比以前更懂得家人的可貴了。",
      "一個人雖然有時會寂寞,但相對地能自由運用自己的時間。",
      "會體會到家人的可貴,也是在開始分開生活之後。"
    ],
    "vocab": [
      {
        "w": "一人暮らし",
        "r": "ひとりぐらし",
        "m": "獨居",
        "m_en": "living alone"
      },
      {
        "w": "洗濯",
        "r": "せんたく",
        "m": "洗衣",
        "m_en": "laundry"
      },
      {
        "w": "改めて",
        "r": "あらためて",
        "m": "重新、再次",
        "m_en": "anew / again"
      },
      {
        "w": "判断",
        "r": "はんだん",
        "m": "判斷",
        "m_en": "judgment"
      },
      {
        "w": "有難い",
        "r": "ありがたい",
        "m": "值得感謝的",
        "m_en": "grateful / to be thankful for"
      }
    ],
    "grammar": [
      {
        "t": "~てみると",
        "note": "「實際做了~之後(發現)」:暮らしてみると。",
        "id": "",
        "t_en": "〜てみると",
        "note_en": "\"once you actually do ~ (you find that)\": 暮らしてみると."
      },
      {
        "t": "~なければならない",
        "note": "「必須~」義務:自分でやらなければならない。",
        "id": "n4-16",
        "t_en": "〜なければならない",
        "note_en": "\"must ~,\" obligation: 自分でやらなければならない."
      },
      {
        "t": "~ようになる",
        "note": "「變得~」自然變化:考えるようになった。",
        "id": "n3-40",
        "t_en": "〜ようになる",
        "note_en": "\"come to ~,\" a natural change: 考えるようになった."
      }
    ],
    "title_en": "What I Learned Living Alone",
    "topic_en": "Everyday life",
    "trans_en": [
      "When I started university, I lived alone for the first time. At first, being free felt great.",
      "But once I actually started living, I realized I had to do everything myself — cooking, laundry, cleaning. It made me newly aware of how much my parents had done for me.",
      "I also began to think about how I spend money. Within a limited budget, you naturally learn to judge what you truly need.",
      "Living alone has many hard parts, but it builds the ability to take care of yourself. And most of all, I came to appreciate my family more than before.",
      "Being alone can be lonely, but in exchange you can use your own time freely.",
      "Realizing how precious family is also came only after I started living apart from them."
    ]
  },
  {
    "id": "a-n3-3",
    "level": "n3",
    "topic": "文化",
    "title": "銭湯という文化",
    "title_zh": "澡堂這種文化",
    "body": "銭湯とは、みんなで入る公共のおふろのことだ。昔は、家におふろがない人が多く、銭湯は生活に欠かせない場所だった。\n家庭におふろが広まると、銭湯の数はどんどん減っていった。しかし最近、その良さが見直されている。\n広いおふろにゆっくりつかると、体だけでなく心もほぐれる。となりに座った知らない人と、自然に会話が生まれることもある。\n便利さを求めるあまり、私たちは人とのつながりを失いつつあるのかもしれない。銭湯は、そんな時代に、人と人との距離を思い出させてくれる場所なのだ。\n銭湯は ただ 体を あらう ばしょでは なく、ちいきの 人が 顔を 合わせる 場でも あった。\n家に おふろが ふえた いま、その 数は へっているが、その あたたかさを 見直す 人も 多い。",
    "trans": [
      "所謂澡堂,是大家一起泡的公共浴池。以前家裡沒有浴室的人很多,澡堂是生活中不可或缺的地方。",
      "隨著家庭浴室的普及,澡堂的數量不斷減少。但最近,它的好處又重新被看見。",
      "在寬敞的浴池裡慢慢泡,不只身體、連心也放鬆下來。有時還會和坐在旁邊、素不相識的人自然聊起來。",
      "或許在過度追求便利的同時,我們正逐漸失去人與人的連結。澡堂,是在這樣的時代裡,讓人想起人與人之間距離的地方。",
      "錢湯不只是洗身體的地方,也曾是社區居民碰面交流的場所。",
      "在家家戶戶都有浴室的現在,錢湯數量在減少,但重新看見那份溫暖的人也不少。"
    ],
    "vocab": [
      {
        "w": "公共",
        "r": "こうきょう",
        "m": "公共",
        "m_en": "public"
      },
      {
        "w": "広まる",
        "r": "ひろまる",
        "m": "普及、擴散",
        "m_en": "to spread"
      },
      {
        "w": "見直す",
        "r": "みなおす",
        "m": "重新看待、重新評價",
        "m_en": "to reappraise / see anew"
      },
      {
        "w": "つながり",
        "r": "つながり",
        "m": "連結、關係",
        "m_en": "connection / bond"
      },
      {
        "w": "距離",
        "r": "きょり",
        "m": "距離",
        "m_en": "distance"
      }
    ],
    "grammar": [
      {
        "t": "~とは",
        "note": "「所謂~(是)」下定義:銭湯とは~のことだ。",
        "id": "",
        "t_en": "〜とは",
        "note_en": "Defines a term: 銭湯とは~のことだ."
      },
      {
        "t": "~ていく",
        "note": "「逐漸~下去」變化趨勢:減っていった。",
        "id": "n3-67",
        "t_en": "〜ていく",
        "note_en": "\"gradually ~,\" a trend of change: 減っていった."
      },
      {
        "t": "~つつある",
        "note": "「正逐漸~」書面:失いつつある。",
        "id": "n2-1",
        "t_en": "〜つつある",
        "note_en": "\"is gradually ~,\" written style: 失いつつある."
      }
    ],
    "title_en": "The Culture of Public Bathhouses",
    "topic_en": "Culture",
    "trans_en": [
      "A sento is a public bath everyone soaks in together. Long ago many homes had no bath, so the sento was an essential part of life.",
      "As home baths spread, the number of sento kept falling. But recently their merits are being appreciated again.",
      "Soaking slowly in a large bath relaxes not just the body but the mind. Sometimes you even strike up a natural conversation with a stranger sitting nearby.",
      "Perhaps as we chase convenience too far, we are gradually losing our connections with people. The sento is a place that, in such times, reminds us of the closeness between people.",
      "A sento is not just a place to wash the body; it was also a place where local people met and mingled.",
      "Now that every home has a bath, their numbers are falling — but plenty of people are rediscovering that warmth."
    ]
  },
  {
    "id": "a-n3-4",
    "level": "n3",
    "topic": "新聞",
    "title": "進む少子化",
    "title_zh": "持續的少子化",
    "body": "日本では今、子どもの数が減り続けている。これを「少子化」と呼ぶ。\n原因はひとつではない。結婚しない人が増えたこと、子育てにかかるお金の負担が大きいこと、仕事と育児の両立がむずかしいことなど、さまざまな理由が重なっている。\n子どもが減ると、将来働く人の数も減る。その結果、経済の力が弱くなったり、お年寄りを支える仕組みが立ちゆかなくなったりするおそれがある。\n政府はさまざまな対策を進めているが、効果はまだ十分ではない。社会全体で、子どもを育てやすい環境をどう作るかが問われている。\n少子化の はいけいには、けっこんや 子育てに かかる ふたんの 大きさが あると 言われる。\nこのまま すすめば、はたらく 人が へり、社会ぜんたいを ささえる ことが むずかしく なる。",
    "trans": [
      "日本現在孩子的數量持續減少。這稱為「少子化」。",
      "原因不只一個。不結婚的人變多、養育孩子花的錢負擔大、工作與育兒難以兼顧等,各種理由交織在一起。",
      "孩子減少,將來工作的人數也會減少。結果可能導致經濟力量變弱,或支撐老年人的制度難以維繫。",
      "政府正推動各種對策,但效果還不夠。整個社會如何打造容易養育孩子的環境,正受到考驗。",
      "據說少子化的背景,在於結婚與育兒所需負擔之大。",
      "若照這樣下去,工作人口減少,要支撐整個社會將變得困難。"
    ],
    "vocab": [
      {
        "w": "減る",
        "r": "へる",
        "m": "減少",
        "m_en": "to decrease"
      },
      {
        "w": "負担",
        "r": "ふたん",
        "m": "負擔",
        "m_en": "burden"
      },
      {
        "w": "両立",
        "r": "りょうりつ",
        "m": "兼顧、並立",
        "m_en": "balancing / having both"
      },
      {
        "w": "支える",
        "r": "ささえる",
        "m": "支撐",
        "m_en": "to support"
      },
      {
        "w": "対策",
        "r": "たいさく",
        "m": "對策",
        "m_en": "countermeasure"
      }
    ],
    "grammar": [
      {
        "t": "~続ける",
        "note": "「持續~」:減り続けている。",
        "id": "n4-27",
        "t_en": "〜続ける",
        "note_en": "\"keep ~ing\": 減り続けている."
      },
      {
        "t": "~たり~たりする",
        "note": "列舉可能情況:弱くなったり、立ちゆかなくなったり。",
        "id": "n5-56",
        "t_en": "〜たり〜たりする",
        "note_en": "Lists possible situations: 弱くなったり、立ちゆかなくなったり."
      },
      {
        "t": "~おそれがある",
        "note": "「有~的危險/可能」負面:立ちゆかなくなるおそれがある。",
        "id": "",
        "t_en": "〜おそれがある",
        "note_en": "\"there is a risk/danger of ~,\" negative: 立ちゆかなくなるおそれがある."
      }
    ],
    "title_en": "The Advancing Birth-Rate Decline",
    "topic_en": "News",
    "trans_en": [
      "The number of children in Japan keeps falling. This is called \"shōshika\" (declining birth rate).",
      "There is more than one cause. More people not marrying, the heavy cost of raising children, the difficulty of balancing work and childcare — various reasons are intertwined.",
      "As children decrease, the future working population shrinks too. As a result, economic strength may weaken and the systems supporting the elderly may become hard to sustain.",
      "The government is pushing various measures, but they are not enough yet. How society as a whole creates an environment where it’s easy to raise children is being tested.",
      "The background of the declining birth rate is said to lie in the heavy burden of marriage and child-rearing.",
      "If this continues, the working population will shrink, and supporting society as a whole will become difficult."
    ]
  },
  {
    "id": "a-n3-5",
    "level": "n3",
    "topic": "職場",
    "title": "飲みニケーション",
    "title_zh": "喝酒交際文化",
    "body": "日本の会社では、仕事のあとに同僚や上司とお酒を飲みに行くことがよくある。これを「飲みニケーション」と言う。\nお酒の席では、ふだんは言いにくい本音を話せたり、上司と気軽に話せたりする。人間関係を深める良い機会だと考える人も多い。\n一方で、若い世代の中には、「仕事のあとの時間は自分のために使いたい」と考える人が増えている。参加を強制されることに、抵抗を感じる人も少なくない。\n働き方や価値観が多様になった今、飲みニケーションのあり方も、少しずつ変わりつつあるのかもしれない。\nしかし さいきんの わかい 人の 中には、しごとと プライベートを きちんと 分けたいと 考える 人も ふえている。\nお酒に たよらなくても、ふだんの 会話で しんらいを きずけるのが 理想だろう。",
    "trans": [
      "在日本的公司,下班後常和同事或上司去喝酒。這叫做「喝酒溝通(飲みニケーション)」。",
      "在酒席上,能說出平常難以啟齒的真心話,也能和上司輕鬆交談。也有很多人認為這是加深人際關係的好機會。",
      "另一方面,年輕世代中,認為「下班後的時間想用在自己身上」的人變多了。對於被強制參加感到排斥的人也不少。",
      "在工作方式與價值觀變得多元的現在,喝酒溝通的形式,或許也正一點一點地改變。",
      "不過最近的年輕人當中,也有越來越多人想把工作和私生活好好分開。",
      "就算不靠酒,能在平常的對話中建立信任,才是理想吧。"
    ],
    "vocab": [
      {
        "w": "同僚",
        "r": "どうりょう",
        "m": "同事",
        "m_en": "colleague"
      },
      {
        "w": "本音",
        "r": "ほんね",
        "m": "真心話",
        "m_en": "true feelings / real intent"
      },
      {
        "w": "気軽",
        "r": "きがる",
        "m": "輕鬆、隨意",
        "m_en": "casual / easygoing"
      },
      {
        "w": "強制",
        "r": "きょうせい",
        "m": "強制",
        "m_en": "compulsion / forcing"
      },
      {
        "w": "多様",
        "r": "たよう",
        "m": "多元、多樣",
        "m_en": "diverse"
      }
    ],
    "grammar": [
      {
        "t": "~にくい",
        "note": "「難以~」:言いにくい。",
        "id": "n4-5",
        "t_en": "〜にくい",
        "note_en": "\"hard to ~\": 言いにくい."
      },
      {
        "t": "一方で",
        "note": "「另一方面」對比:~という人も多い。一方で、~。",
        "id": "n2-14",
        "t_en": "一方で",
        "note_en": "\"on the other hand,\" contrast: ~という人も多い。一方で、~."
      },
      {
        "t": "~つつある",
        "note": "「正逐漸~」:変わりつつある。",
        "id": "n2-1",
        "t_en": "〜つつある",
        "note_en": "\"is gradually ~\": 変わりつつある."
      }
    ],
    "title_en": "Nomunication (Bonding over Drinks)",
    "topic_en": "Workplace",
    "trans_en": [
      "At Japanese companies, people often go drinking with colleagues or bosses after work. This is called \"nomunication\" (drinking + communication).",
      "Over drinks, you can say things hard to say normally, and talk casually with your boss. Many see it as a good chance to deepen relationships.",
      "On the other hand, among younger generations more people feel their after-work time is their own, and quite a few dislike being made to attend.",
      "Now that ways of working and values have grown diverse, the form of \"nomunication\" may also be changing little by little.",
      "But among young people today, more and more want to keep work and private life clearly separate.",
      "The ideal is surely being able to build trust through everyday conversation, without relying on alcohol."
    ]
  },
  {
    "id": "a-n2-1",
    "level": "n2",
    "topic": "社会",
    "title": "働き方の変化",
    "title_zh": "工作方式的改變",
    "body": "近年、インターネットの 発達に ともなって、働き方が 大きく 変わって きました。\n会社に 行かず、家で 仕事を する「テレワーク」を 取り入れる 企業が 増えて います。通勤の 時間が 減る 一方で、仕事と 生活の 区別が つきにくく なるという 問題も あります。\nまた、決まった 時間では なく、自分で 時間を 調整して 働く 人も 多く なりました。\nこうした 変化に あわせて、私たちも 新しい 働き方を 考えて いく 必要が あるでしょう。\nテレワークの ふきゅうに よって、はたらく 場所や 時間の じゆうどが 高まった 一方で、しごとと 生活の 境目が あいまいに なるという 課題も 生まれた。\nこれからは、それぞれの 人に 合った はたらき方を えらべる 社会が もとめられている。",
    "trans": [
      "近年,隨著網路的發達,工作方式有了很大的改變。",
      "不去公司、在家工作的「遠距工作」,採用的企業正在增加。通勤時間減少的另一方面,也有工作與生活難以區分的問題。",
      "此外,不按固定時間、自己調整時間工作的人也變多了。",
      "配合這樣的變化,我們也有必要去思考新的工作方式吧。",
      "隨著遠距工作的普及,工作地點與時間的自由度提高;另一方面,也產生了工作與生活界線變模糊的課題。",
      "今後,社會需要的是能讓每個人選擇適合自己工作方式的環境。"
    ],
    "vocab": [
      {
        "w": "発達",
        "r": "はったつ",
        "m": "發達",
        "m_en": "development"
      },
      {
        "w": "取り入れる",
        "r": "とりいれる",
        "m": "採用、引進",
        "m_en": "to adopt / introduce"
      },
      {
        "w": "区別",
        "r": "くべつ",
        "m": "區別",
        "m_en": "distinction"
      },
      {
        "w": "調整",
        "r": "ちょうせい",
        "m": "調整",
        "m_en": "adjustment"
      },
      {
        "w": "必要",
        "r": "ひつよう",
        "m": "必要",
        "m_en": "necessary"
      }
    ],
    "grammar": [
      {
        "t": "~にともなって",
        "note": "「隨著~」連動變化:発達にともなって。",
        "id": "n2-50",
        "t_en": "〜にともなって",
        "note_en": "\"along with ~,\" linked change: 発達にともなって."
      },
      {
        "t": "一方で",
        "note": "「另一方面」對比正反面。",
        "id": "n2-14",
        "t_en": "一方で",
        "note_en": "\"on the other hand,\" contrasting two sides."
      },
      {
        "t": "~ていく",
        "note": "「~下去」持續:考えていく必要がある。",
        "id": "n3-67",
        "t_en": "〜ていく",
        "note_en": "\"~ going forward,\" continuing: 考えていく必要がある."
      }
    ],
    "title_en": "Changing Ways of Working",
    "topic_en": "Society",
    "trans_en": [
      "In recent years, with the development of the internet, the way we work has changed greatly.",
      "More companies are adopting \"telework,\" working from home rather than going to the office. Commute time drops, but there is also the problem of work and life being hard to separate.",
      "In addition, more people now work adjusting their own hours rather than fixed times.",
      "To match such changes, we too need to rethink new ways of working.",
      "With the spread of telework, freedom over where and when to work has risen; on the other hand, a new issue has emerged — the line between work and life blurring.",
      "From now on, society needs an environment where each person can choose the way of working that suits them."
    ]
  },
  {
    "id": "a-n2-2",
    "level": "n2",
    "topic": "文化",
    "title": "「空気を読む」ということ",
    "title_zh": "所謂的「察言觀色」",
    "body": "日本語には「空気を読む」という表現がある。その場の雰囲気や、相手の気持ちを察して、はっきり言われなくても適切に行動することを指す。\nたとえば、会議で全員が賛成している中、一人だけ反対意見を言うのは勇気がいる。多くの人は「空気を読んで」、あえて発言をひかえてしまう。\nこの感覚は、人と人との衝突を避け、集団の調和を保つうえで役立ってきた。しかしその反面、本当に必要な意見が言えなくなったり、少数の声が消されてしまったりするという問題もある。\n空気を読む力は、たしかに日本社会の特徴の一つだ。だが、時には空気を読まずに声を上げる勇気もまた、大切にされるべきではないだろうか。\n空気を読む ことは、相手を 思いやる やさしさにも なるが、行きすぎると 自分の 意見が 言えなく なる。\n大切なのは、まわりに 合わせる ことと、自分の 考えを 伝える ことの バランスだろう。",
    "trans": [
      "日文裡有「讀空氣(察言觀色)」這個說法。指的是察覺當下的氣氛、對方的心情,即使沒被明說也能適當地行動。",
      "例如,在會議上全員都贊成時,只有一個人說出反對意見是需要勇氣的。多數人會「讀空氣」,刻意不發言。",
      "這種感覺,在避免人與人衝突、維持團體和諧上一直很有用。但另一面,也有真正必要的意見說不出口、少數的聲音被消音的問題。",
      "讀空氣的能力,確實是日本社會的特徵之一。但是,有時不讀空氣、勇於發聲的勇氣,不也應該被重視嗎?",
      "讀空氣可以是體貼對方的溫柔,但過了頭就會變得說不出自己的意見。",
      "重要的是,在配合周遭與表達自己想法之間取得平衡吧。"
    ],
    "vocab": [
      {
        "w": "雰囲気",
        "r": "ふんいき",
        "m": "氣氛",
        "m_en": "atmosphere / mood"
      },
      {
        "w": "察する",
        "r": "さっする",
        "m": "察覺、體會",
        "m_en": "to sense / perceive"
      },
      {
        "w": "衝突",
        "r": "しょうとつ",
        "m": "衝突",
        "m_en": "conflict / collision"
      },
      {
        "w": "調和",
        "r": "ちょうわ",
        "m": "和諧、調和",
        "m_en": "harmony"
      },
      {
        "w": "特徴",
        "r": "とくちょう",
        "m": "特徵",
        "m_en": "characteristic / feature"
      }
    ],
    "grammar": [
      {
        "t": "~うえで",
        "note": "「在~方面」:調和を保つうえで役立つ。",
        "id": "",
        "t_en": "〜うえで",
        "note_en": "\"in terms of ~ / when doing ~\": 調和を保つうえで役立つ."
      },
      {
        "t": "その反面",
        "note": "「另一面、相反地」:役立つ。その反面、問題もある。",
        "id": "n3-79",
        "t_en": "その反面",
        "note_en": "\"on the other hand / conversely\": 役立つ。その反面、問題もある."
      },
      {
        "t": "~べきではないだろうか",
        "note": "「不應該~嗎」委婉主張:大切にされるべきではないか。",
        "id": "n3-61",
        "t_en": "〜べきではないだろうか",
        "note_en": "\"shouldn’t we ~?\" a soft assertion: 大切にされるべきではないか."
      }
    ],
    "title_en": "\"Reading the Air\"",
    "topic_en": "Culture",
    "trans_en": [
      "Japanese has the phrase \"reading the air.\" It means sensing the mood of the moment and the other person’s feelings, and acting appropriately even without being told.",
      "For example, when everyone in a meeting agrees, it takes courage for one person to voice an objection. Most people \"read the air\" and deliberately stay silent.",
      "This sense has long been useful for avoiding conflict and keeping group harmony. But on the flip side, there’s the problem of truly necessary opinions going unsaid and minority voices being silenced.",
      "The ability to read the air is indeed one feature of Japanese society. But shouldn’t the courage to sometimes not read it and speak up be valued too?",
      "Reading the air can be a kindness — consideration for others — but taken too far, you become unable to voice your own opinion.",
      "What matters is surely the balance between fitting in with those around you and expressing your own thoughts."
    ]
  },
  {
    "id": "a-n2-3",
    "level": "n2",
    "topic": "職場",
    "title": "報告・連絡・相談",
    "title_zh": "報告・聯絡・商量",
    "body": "日本の会社に入ると、まず「報連相(ほうれんそう)」の大切さを教えられる。報告・連絡・相談の頭文字をとった言葉だ。\n仕事の進み具合を上司に「報告」し、関係する人に必要な情報を「連絡」し、判断にまようときは早めに「相談」する。これができるかどうかで、仕事のうまくいき方が大きく変わる。\n問題を一人でかかえこんで、報告が遅れると、小さなミスが大きなトラブルに発展しかねない。逆に、こまめに情報を共有していれば、まわりが早く助けることができる。\n報連相は、単なるルールではない。チームで働くうえで、おたがいの信頼を築くための、基本的なコミュニケーションなのである。\n報連相が うまく いかない しょくばでは、小さな ミスが 大きな 問題に 発展 しやすい。\n逆に、こまめな 情報の 共有は、チーム全体の 信頼と こうりつを 高めてくれる。",
    "trans": [
      "進入日本的公司,首先會被教導「報連相」的重要。這是取「報告・聯絡・商量」開頭字的詞。",
      "把工作進度向上司「報告」,把必要資訊「聯絡」給相關的人,猶豫判斷時盡早「商量」。能不能做到這些,大大改變工作順利與否。",
      "把問題一個人扛著、報告遲了,小失誤可能演變成大麻煩。反之,若勤於分享資訊,周圍就能及早幫忙。",
      "報連相不只是規則。在團隊工作中,它是為了建立彼此信賴的、基本的溝通。",
      "在報連相不順的職場,小失誤容易演變成大問題。",
      "反過來說,勤於分享資訊,能提升整個團隊的信任與效率。"
    ],
    "vocab": [
      {
        "w": "具合",
        "r": "ぐあい",
        "m": "狀況、情形",
        "m_en": "condition / state"
      },
      {
        "w": "迷う",
        "r": "まよう",
        "m": "猶豫、迷惘",
        "m_en": "to hesitate / be unsure"
      },
      {
        "w": "抱え込む",
        "r": "かかえこむ",
        "m": "獨自承擔",
        "m_en": "to bottle up / handle alone"
      },
      {
        "w": "信頼",
        "r": "しんらい",
        "m": "信賴",
        "m_en": "trust"
      },
      {
        "w": "築く",
        "r": "きずく",
        "m": "建立、構築",
        "m_en": "to build"
      }
    ],
    "grammar": [
      {
        "t": "~かどうか",
        "note": "「是否~」間接疑問:できるかどうかで変わる。",
        "id": "n4-43",
        "t_en": "〜かどうか",
        "note_en": "\"whether or not ~,\" indirect question: できるかどうかで変わる."
      },
      {
        "t": "~かねない",
        "note": "「有可能~(壞事)」:トラブルに発展しかねない。",
        "id": "n2-38",
        "t_en": "〜かねない",
        "note_en": "\"could end up ~ (something bad)\": トラブルに発展しかねない."
      },
      {
        "t": "~うえで",
        "note": "「在~方面」:チームで働くうえで。",
        "id": "",
        "t_en": "〜うえで",
        "note_en": "\"in / for doing ~\": チームで働くうえで."
      }
    ],
    "title_en": "Report, Contact, Consult (Hō-Ren-Sō)",
    "topic_en": "Workplace",
    "trans_en": [
      "When you join a Japanese company, the first thing you’re taught is the importance of \"hō-ren-sō.\" It’s a word made from the first characters of \"report, contact, consult.\"",
      "Reporting progress to your boss, passing on necessary information to those involved, and consulting early when unsure — whether you can do these greatly changes how smoothly work goes.",
      "If you carry a problem alone and report late, a small mistake can grow into big trouble. Conversely, if you share information diligently, those around you can help early.",
      "Hō-ren-sō is not just a rule. In teamwork, it is the basic communication for building mutual trust.",
      "In a workplace where hō-ren-sō doesn’t work well, small mistakes easily grow into big problems.",
      "Conversely, sharing information diligently raises the whole team’s trust and efficiency."
    ]
  },
  {
    "id": "a-n2-4",
    "level": "n2",
    "topic": "旅遊",
    "title": "観光公害を考える",
    "title_zh": "思考觀光公害",
    "body": "近年、人気の観光地には、国内外から多くの旅行者が押し寄せている。観光は地域に大きな利益をもたらす一方で、「観光公害」と呼ばれる問題も生んでいる。\nたとえば、道が観光客であふれて住民が通れなくなったり、ゴミやマナー違反が増えたりする。静かに暮らしていた人々の生活が、おびやかされてしまうのだ。\nこうした問題に対して、入場する人数を制限したり、観光税を導入したりする地域も出てきた。しかし、規制を強めすぎれば、観光そのものの魅力が失われかねない。\n大切なのは、訪れる側が地元への敬意を忘れないことだろう。その土地の文化やルールを尊重してこそ、観光は旅行者と住民の双方にとって、豊かなものになるのではないだろうか。\n観光は 地域に お金を もたらす 一方で、住民の 生活を おびやかす ことも ある。\n訪れる 人と 住む 人、どちらも 気もちよく いられる しくみづくりが、いま 求められている。",
    "trans": [
      "近年,人氣觀光地湧入大量國內外的旅客。觀光為地方帶來巨大利益的另一方面,也產生了被稱為「觀光公害」的問題。",
      "例如,道路被觀光客擠滿導致居民無法通行,垃圾和違反禮儀的情況增加。原本安靜生活的人們,生活受到了威脅。",
      "針對這些問題,也出現了限制入場人數、導入觀光稅的地區。但若規範太嚴,觀光本身的魅力可能會流失。",
      "重要的是,前來的一方別忘了對當地的敬意吧。正因為尊重那片土地的文化與規則,觀光才會對旅客和居民雙方都成為豐富的東西,不是嗎?",
      "觀光為地區帶來金錢,另一方面也可能威脅居民的生活。",
      "打造一個讓來訪者與居住者都能自在相處的機制,正是現在所需要的。"
    ],
    "vocab": [
      {
        "w": "押し寄せる",
        "r": "おしよせる",
        "m": "湧入、蜂擁而至",
        "m_en": "to surge / flood in"
      },
      {
        "w": "利益",
        "r": "りえき",
        "m": "利益",
        "m_en": "profit"
      },
      {
        "w": "脅かす",
        "r": "おびやかす",
        "m": "威脅",
        "m_en": "to threaten"
      },
      {
        "w": "制限",
        "r": "せいげん",
        "m": "限制",
        "m_en": "restriction / limit"
      },
      {
        "w": "尊重",
        "r": "そんちょう",
        "m": "尊重",
        "m_en": "respect"
      }
    ],
    "grammar": [
      {
        "t": "~に対して",
        "note": "「針對~、對於~」:問題に対して。",
        "id": "n3-2",
        "t_en": "〜に対して",
        "note_en": "\"toward / regarding ~\": 問題に対して."
      },
      {
        "t": "~かねない",
        "note": "「有可能~(壞事)」:失われかねない。",
        "id": "n2-38",
        "t_en": "〜かねない",
        "note_en": "\"could end up ~ (bad)\": 失われかねない."
      },
      {
        "t": "~てこそ",
        "note": "「正因為~才」:尊重してこそ豊かになる。",
        "id": "",
        "t_en": "〜てこそ",
        "note_en": "\"only by ~ (does it)\": 尊重してこそ豊かになる."
      }
    ],
    "title_en": "Thinking About Overtourism",
    "topic_en": "Travel",
    "trans_en": [
      "In recent years, huge numbers of tourists from home and abroad flood popular sightseeing spots. While tourism brings great profit to a region, it has also created a problem called \"overtourism.\"",
      "For example, roads packed with tourists so residents can’t get through, and rising litter and bad manners. People who lived quietly have had their daily lives threatened.",
      "In response, some areas have limited visitor numbers or introduced a tourist tax. But if the rules are too strict, the appeal of tourism itself may be lost.",
      "What matters is that visitors not forget respect for the place. Precisely by respecting that land’s culture and rules, tourism can become enriching for travelers and residents alike, can’t it?",
      "Tourism brings money to a region, but on the other hand it can threaten residents’ lives.",
      "What’s needed now is building a system where both visitors and residents can feel at ease."
    ]
  },
  {
    "id": "a-n1-1",
    "level": "n1",
    "topic": "環境",
    "title": "地球温暖化と私たちの暮らし",
    "title_zh": "地球暖化與我們的生活",
    "body": "地球温暖化は、もはや 遠い 未来の 話では なく、私たちの 暮らしに 直接 影響を 及ぼす 問題と なっている。\n異常気象に よる 農作物への 被害や、海面の 上昇に ともなう 被害は、年々 深刻さを 増す ばかりだ。こうした 状況を 前に、一人ひとりが できる ことは 限られて いると 感じるかも しれない。\nしかし、電気の むだづかいを 減らしたり、公共交通機関を 利用したり といった 小さな 積み重ねこそが、大きな 変化に つながる。\n未来の 世代に 豊かな 地球を 残す ためにも、今、行動を 起こす ことが 求められて いる。\n温暖化は 遠い 国の 話では なく、私たちの 食卓や くらしに 直接 かかわる 問題である。\n一人ひとりの 小さな 行動の つみかさねが、やがて 大きな 変化を 生む ことを 忘れては ならない。",
    "trans": [
      "地球暖化已不再是遙遠未來的事,而是對我們的生活造成直接影響的問題。",
      "異常氣候造成的農作物損害、海平面上升帶來的災害,一年比一年嚴重。面對這樣的狀況,或許會覺得每個人能做的事很有限。",
      "然而,減少浪費用電、多利用大眾運輸這類小小的累積,正是連結到重大改變的關鍵。",
      "為了替未來的世代留下豐饒的地球,現在,我們被要求付諸行動。",
      "暖化不是遙遠國度的事,而是與我們的餐桌和生活直接相關的問題。",
      "不能忘記,每個人小小行動的累積,終將帶來巨大的改變。"
    ],
    "vocab": [
      {
        "w": "及ぼす",
        "r": "およぼす",
        "m": "造成、波及",
        "m_en": "to bring about / exert"
      },
      {
        "w": "被害",
        "r": "ひがい",
        "m": "災害、損害",
        "m_en": "damage / harm"
      },
      {
        "w": "深刻",
        "r": "しんこく",
        "m": "嚴重",
        "m_en": "serious / grave"
      },
      {
        "w": "積み重ね",
        "r": "つみかさね",
        "m": "累積",
        "m_en": "accumulation"
      },
      {
        "w": "世代",
        "r": "せだい",
        "m": "世代",
        "m_en": "generation"
      }
    ],
    "grammar": [
      {
        "t": "~ばかりだ",
        "note": "「一味地、越來越~」單向變化:深刻さを増すばかりだ。",
        "id": "n2-2",
        "t_en": "〜ばかりだ",
        "note_en": "\"only keeps ~ing,\" one-way change: 深刻さを増すばかりだ."
      },
      {
        "t": "~こそ",
        "note": "「正是~才」強調:積み重ねこそが変化につながる。",
        "id": "n3-64",
        "t_en": "〜こそ",
        "note_en": "\"it is precisely ~ that,\" emphasis: 積み重ねこそが変化につながる."
      },
      {
        "t": "~ためにも",
        "note": "「為了~也」:世代に残すためにも行動を。",
        "id": "n4-17",
        "t_en": "〜ためにも",
        "note_en": "\"for the sake of ~ too\": 世代に残すためにも行動を."
      }
    ],
    "title_en": "Global Warming and Our Lives",
    "topic_en": "Environment",
    "trans_en": [
      "Global warming is no longer a matter of the distant future; it is a problem directly affecting our lives.",
      "Crop damage from abnormal weather and disasters from rising sea levels grow worse year by year. Facing such a situation, one may feel there is little each person can do.",
      "Yet small accumulations — cutting wasteful electricity use, using public transport more — are exactly the key that leads to major change.",
      "To leave a rich earth for future generations, we are now called to put it into action.",
      "Warming is not a matter of some far-off country; it is a problem directly tied to our dinner tables and daily lives.",
      "We must not forget that the accumulation of each person’s small actions will, in time, bring about great change."
    ]
  },
  {
    "id": "a-n1-2",
    "level": "n1",
    "topic": "新聞",
    "title": "AI時代に問われる「学ぶ」意味",
    "title_zh": "AI時代下「學習」的意義",
    "body": "生成AIの急速な普及により、知識を得ることのハードルは、かつてないほど低くなった。疑問があれば、問いかけるだけで、AIが瞬時に答えを示してくれる。\nこうした状況の中で、「もはや人間が努力して学ぶ必要はないのではないか」という声も聞かれるようになった。しかし、それは学ぶという行為の本質を見誤っているように思われる。\n学びとは、単に答えを手に入れることではない。情報の正しさを見きわめ、複数の考えを比べ、自分なりの判断を下す——その過程でこそ、思考する力は育まれる。AIが出した答えを、批判的に吟味できるかどうかは、まさにその人の学びの深さにかかっている。\n答えが簡単に手に入る時代だからこそ、「なぜそうなるのか」を問い続ける姿勢が、これまで以上に重要になっている。学ぶ意味は、失われるどころか、むしろ問い直されているのだ。\n答えを すぐに 出してくれる AIが ある 時代だからこそ、「なぜ そう なるのか」を 問いつづける 姿勢が いっそう 重要に なる。\n知識を ためこむ ことより、それを どう つかい、どう 判断するかが、これからの 学びの 中心に なるだろう。",
    "trans": [
      "隨著生成式AI的急速普及,取得知識的門檻降到前所未有的低。有疑問,只要一問,AI瞬間就給出答案。",
      "在這樣的情況下,也開始聽到「人類已經不需要努力學習了吧」的聲音。然而,那似乎是誤解了學習這件事的本質。",
      "所謂學習,不只是取得答案。辨別資訊的正確性、比較多種想法、下自己的判斷——正是在這個過程中,思考的能力才被培養出來。能不能批判性地審視AI給出的答案,正取決於那個人學習的深度。",
      "正因為是答案容易取得的時代,「為什麼會這樣」持續追問的態度,才比以往更重要。學習的意義,非但沒有消失,反而正被重新叩問。",
      "正因為身處 AI 能立刻給出答案的時代,持續追問「為什麼會這樣」的態度才更顯重要。",
      "比起囤積知識,如何運用、如何判斷,將成為今後學習的核心吧。"
    ],
    "vocab": [
      {
        "w": "普及",
        "r": "ふきゅう",
        "m": "普及",
        "m_en": "spread / diffusion"
      },
      {
        "w": "本質",
        "r": "ほんしつ",
        "m": "本質",
        "m_en": "essence"
      },
      {
        "w": "見極める",
        "r": "みきわめる",
        "m": "看清、辨別",
        "m_en": "to discern / see clearly"
      },
      {
        "w": "吟味",
        "r": "ぎんみ",
        "m": "仔細審視",
        "m_en": "careful examination"
      },
      {
        "w": "問い直す",
        "r": "といなおす",
        "m": "重新追問",
        "m_en": "to question anew"
      }
    ],
    "grammar": [
      {
        "t": "~により",
        "note": "「由於~、透過~」:普及により、低くなった。",
        "id": "n3-4",
        "t_en": "〜により",
        "note_en": "\"due to / by means of ~\": 普及により、低くなった."
      },
      {
        "t": "~どころか",
        "note": "「別說~、非但~反而」:失われるどころか、問い直されている。",
        "id": "n2-25",
        "t_en": "〜どころか",
        "note_en": "\"far from ~; on the contrary\": 失われるどころか、問い直されている."
      },
      {
        "t": "~からこそ",
        "note": "「正因為~才」:時代だからこそ、重要になっている。",
        "id": "n2-9",
        "t_en": "〜からこそ",
        "note_en": "\"precisely because ~\": 時代だからこそ、重要になっている."
      }
    ],
    "title_en": "The Meaning of \"Learning\" in the AI Age",
    "topic_en": "News",
    "trans_en": [
      "With the rapid spread of generative AI, the barrier to acquiring knowledge has dropped lower than ever. Ask a question and AI gives an answer in an instant.",
      "In such times, one even hears voices saying \"humans no longer need to make the effort to learn.\" But that seems to misunderstand the essence of learning.",
      "Learning is not just obtaining answers. Discerning whether information is correct, comparing multiple ideas, making your own judgment — it is precisely in this process that the ability to think is cultivated. Whether you can critically examine the answers AI gives depends on the depth of that person’s learning.",
      "Precisely because it’s an age when answers come easily, the attitude of continuing to ask \"why is it so\" matters more than ever. The meaning of learning has not been lost; rather, it is being questioned anew.",
      "Precisely because we live in an age when AI gives instant answers, the attitude of continuing to ask \"why\" becomes all the more important.",
      "Rather than hoarding knowledge, how you use it and how you judge will become the core of learning from now on."
    ]
    },
  {
    "id": "a-n5-3",
    "level": "n5",
    "topic": "家族",
    "topic_en": "Family",
    "title": "家族の写真",
    "title_zh": "家人的照片",
    "title_en": "A Family Photo",
    "body": "これは わたしの かぞくの しゃしんです。ぜんぶで 五人 います。\nまんなかに いるのは ちちと ははです。ちちは 会社員で、ははは 先生です。\n右に いるのは あにです。あには 大学生で、サッカーが とても 上手です。\n左の 小さい 子は いもうとです。いもうとは 九さいで、絵を かくのが 好きです。\nわたしの かぞくは みんな 犬が 大好きです。しゃしんの 前に いるのが うちの 犬の「マロ」です。\n休みの日は、よく みんなで 公園へ 行って、しゃしんを とります。\nはなれて 住んでいますが、月に 一度は 電話で 話します。かぞくは わたしの たからものです。",
    "trans": [
      "這是我家人的照片。全部有五個人。",
      "正中間的是爸爸和媽媽。爸爸是上班族,媽媽是老師。",
      "右邊的是哥哥。哥哥是大學生,足球非常拿手。",
      "左邊那個小小的孩子是妹妹。妹妹九歲,喜歡畫畫。",
      "我家人全都很喜歡狗。照片前面那隻是我家的狗「マロ」。",
      "放假的日子,常常大家一起去公園拍照。",
      "雖然分開住,但每個月會通一次電話。家人是我的寶物。"
    ],
    "trans_en": [
      "This is a photo of my family. There are five of us in total.",
      "The two in the middle are my father and mother. My father is an office worker and my mother is a teacher.",
      "On the right is my older brother. He's a university student and is very good at soccer.",
      "The little child on the left is my younger sister. She is nine years old and loves drawing.",
      "Everyone in my family loves dogs. The one in front in the photo is our dog, “Maro.”",
      "On days off, we often go to the park together and take photos.",
      "We live apart, but we talk on the phone once a month. My family is my treasure."
    ],
    "vocab": [
      {
        "w": "家族",
        "r": "かぞく",
        "m": "家人、家庭",
        "m_en": "family"
      },
      {
        "w": "会社員",
        "r": "かいしゃいん",
        "m": "上班族",
        "m_en": "office worker"
      },
      {
        "w": "大学生",
        "r": "だいがくせい",
        "m": "大學生",
        "m_en": "university student"
      },
      {
        "w": "好き",
        "r": "すき",
        "m": "喜歡",
        "m_en": "to like; fond of"
      },
      {
        "w": "宝物",
        "r": "たからもの",
        "m": "寶物",
        "m_en": "treasure"
      }
    ],
    "grammar": [
      {
        "t": "〜で(並列)",
        "note": "名詞＋で 可連接兩個句子:「ちちは会社員で、ははは先生です」表示並列說明。",
        "t_en": "〜で (linking)",
        "note_en": "Noun + で links two clauses: 会社員で、…先生です (A is X, and B is Y)."
      },
      {
        "t": "〜が(對象)",
        "note": "能力或好惡的對象用が:「サッカーが上手」「犬が好き」。",
        "t_en": "〜が (object of ability/liking)",
        "note_en": "The object of ability or preference takes が: サッカーが上手, 犬が好き."
      },
      {
        "t": "〜のが",
        "note": "動詞＋のが 把動作變成名詞:「絵をかくのが好き」。",
        "t_en": "Verb + のが",
        "note_en": "Verb + のが nominalizes an action: 絵をかくのが好き (likes drawing)."
      }
    ]
  },
  {
    "id": "a-n5-4",
    "level": "n5",
    "topic": "生活",
    "topic_en": "Daily life",
    "title": "コンビニで買い物",
    "title_zh": "在便利商店買東西",
    "title_en": "Shopping at a Convenience Store",
    "body": "わたしは まいにち コンビニへ 行きます。会社の となりに あるので、とても べんりです。\n朝は おにぎりと コーヒーを 買います。ぜんぶで 三百円 ぐらいです。\nコンビニでは 電気代や 水道代も はらう ことが できます。\nたくはいびんを 出したり、お金を おろしたり する ことも できます。\n夜、おなかが すいた ときは、あたたかい おでんを 買います。ふゆは とくに 人気です。\nさいきんは 外国語の あんないも 多くて、外国から 来た 人にも やさしいです。\n小さい 店ですが、いろいろな ことが できて、日本の せいかつに かかせません。",
    "trans": [
      "我每天都會去便利商店。因為就在公司隔壁,非常方便。",
      "早上買飯糰和咖啡。全部大概三百日圓。",
      "在便利商店也可以繳電費和水費。",
      "也可以寄宅配、領錢。",
      "晚上肚子餓的時候,會買熱的關東煮。冬天特別受歡迎。",
      "最近外語的標示也變多,對外國來的人也很友善。",
      "雖然是小小的店,卻能做各種事,是日本生活不可或缺的存在。"
    ],
    "trans_en": [
      "I go to the convenience store every day. It's right next to my office, so it's very convenient.",
      "In the morning I buy a rice ball and coffee. It comes to about 300 yen in total.",
      "At convenience stores you can also pay your electricity and water bills.",
      "You can also send parcels and withdraw cash.",
      "At night when I'm hungry, I buy warm oden. It's especially popular in winter.",
      "Recently there are more foreign-language signs, so it's friendly to people from abroad too.",
      "It's a small shop, but you can do all sorts of things there — it's indispensable to life in Japan."
    ],
    "vocab": [
      {
        "w": "便利",
        "r": "べんり",
        "m": "方便",
        "m_en": "convenient"
      },
      {
        "w": "払う",
        "r": "はらう",
        "m": "支付",
        "m_en": "to pay"
      },
      {
        "w": "出す",
        "r": "だす",
        "m": "寄出、拿出",
        "m_en": "to send; put out"
      },
      {
        "w": "人気",
        "r": "にんき",
        "m": "受歡迎",
        "m_en": "popularity; popular"
      },
      {
        "w": "生活",
        "r": "せいかつ",
        "m": "生活",
        "m_en": "life; living"
      }
    ],
    "grammar": [
      {
        "t": "〜ことができる",
        "note": "動詞辞書形＋ことができる 表示能力/可能:「はらうことができる」。",
        "t_en": "〜ことができる",
        "note_en": "Dictionary form + ことができる = “can do”: はらうことができる."
      },
      {
        "t": "〜たり〜たりする",
        "note": "列舉數個動作:「出したり、おろしたりする」。",
        "t_en": "〜たり〜たりする",
        "note_en": "Lists example actions: 出したり、おろしたりする (send things, withdraw money, etc.)."
      },
      {
        "t": "〜ので",
        "note": "客觀原因用ので:「となりにあるので、べんりです」。",
        "t_en": "〜ので (reason)",
        "note_en": "ので gives an objective reason: となりにあるので (because it's next door)."
      }
    ]
  },
  {
    "id": "a-n5-5",
    "level": "n5",
    "topic": "生活",
    "topic_en": "Daily life",
    "title": "わたしの町",
    "title_zh": "我住的小鎮",
    "title_en": "My Town",
    "body": "わたしは 小さい 町に 住んでいます。海の 近くに あって、空気が きれいです。\n町には 大きな ビルは ありませんが、ゆうびんきょくや びょういん、スーパーが あります。\n駅から 家まで、あるいて 十分ぐらいです。とちゅうに 川が あって、はしを わたります。\n春には 川の そばの さくらが とても きれいで、たくさんの 人が 花見に 来ます。\n近くに 古い おてらが あって、しずかで 気もちが いいです。\n買い物には ちょっと ふべんですが、みんな しんせつで、すみやすい 町です。\nわたしは この 町が 大好きです。ずっと ここに 住みたいです。",
    "trans": [
      "我住在一個小鎮。就在海邊附近,空氣很乾淨。",
      "鎮上雖然沒有大樓,但有郵局、醫院和超市。",
      "從車站走到家,步行大約十分鐘。途中有一條河,要過橋。",
      "春天河邊的櫻花非常漂亮,很多人來賞花。",
      "附近有一座古老的寺廟,很安靜,很舒服。",
      "買東西雖然有點不方便,但大家都很親切,是個好住的小鎮。",
      "我非常喜歡這個小鎮。想一直住在這裡。"
    ],
    "trans_en": [
      "I live in a small town. It's near the sea, and the air is clean.",
      "There are no big buildings in town, but there's a post office, a hospital, and a supermarket.",
      "From the station to my house is about a ten-minute walk. On the way there's a river, and I cross a bridge.",
      "In spring the cherry blossoms by the river are very beautiful, and many people come to see them.",
      "There's an old temple nearby; it's quiet and feels nice.",
      "Shopping is a little inconvenient, but everyone is kind — it's an easy town to live in.",
      "I really love this town. I want to live here forever."
    ],
    "vocab": [
      {
        "w": "住む",
        "r": "すむ",
        "m": "居住",
        "m_en": "to live; reside"
      },
      {
        "w": "近く",
        "r": "ちかく",
        "m": "附近",
        "m_en": "nearby; vicinity"
      },
      {
        "w": "渡る",
        "r": "わたる",
        "m": "渡過、越過",
        "m_en": "to cross"
      },
      {
        "w": "親切",
        "r": "しんせつ",
        "m": "親切",
        "m_en": "kind"
      },
      {
        "w": "静か",
        "r": "しずか",
        "m": "安靜",
        "m_en": "quiet"
      }
    ],
    "grammar": [
      {
        "t": "〜やすい",
        "note": "動詞ます形＋やすい 表示容易:「すみやすい」容易住。",
        "t_en": "〜やすい",
        "note_en": "masu-stem + やすい = “easy to ~”: すみやすい (easy to live in)."
      },
      {
        "t": "〜たい",
        "note": "動詞ます形＋たい 表示願望:「住みたい」想住。",
        "t_en": "〜たい",
        "note_en": "masu-stem + たい = “want to ~”: 住みたい (want to live)."
      },
      {
        "t": "〜が(逆接)",
        "note": "「ふべんですが、しんせつです」前後相反用が。",
        "t_en": "〜が (but)",
        "note_en": "〜が connects contrasting clauses: inconvenient, but kind."
      }
    ]
  },
  {
    "id": "a-n4-4",
    "level": "n4",
    "topic": "旅行",
    "topic_en": "Travel",
    "title": "はじめての一人旅",
    "title_zh": "第一次一個人旅行",
    "title_en": "My First Solo Trip",
    "body": "先月、はじめて一人で旅行に行きました。行き先は、前から気になっていた金沢です。\n出発の前は少し不安でしたが、自分で計画を立てるのは思ったより楽しかったです。\n朝早く新幹線に乗って、昼過ぎに金沢に着きました。駅がとても大きくて、びっくりしました。\nまず有名な庭園を見に行きました。天気がよくて、写真をたくさん撮りました。\n夜は市場で新鮮な海の物を食べました。一人だったので、好きなものを好きなだけ注文できました。\n知らない町を一人で歩くのは、ちょっとさびしいけれど、自由でとても気持ちがよかったです。\nこの旅行で、一人でも何とかなるという自信がつきました。また行きたいと思います。",
    "trans": [
      "上個月,我第一次一個人去旅行。目的地是很久以前就一直很在意的金澤。",
      "出發前有點不安,但自己安排計畫比想像中還要有趣。",
      "一大早搭新幹線,過了中午就到金澤。車站非常大,嚇了我一跳。",
      "首先去看了有名的庭園。天氣很好,拍了很多照片。",
      "晚上在市場吃了新鮮的海產。因為一個人,可以想點什麼就點什麼、想吃多少就點多少。",
      "一個人走在陌生的城鎮,雖然有點寂寞,卻很自由、非常舒暢。",
      "這趟旅行讓我有了「就算一個人也能應付」的自信。我想再去。"
    ],
    "trans_en": [
      "Last month I went on a trip by myself for the first time. My destination was Kanazawa, a place I'd been curious about for a long time.",
      "Before leaving I was a little anxious, but planning everything myself was more fun than I'd expected.",
      "I took the bullet train early in the morning and arrived in Kanazawa in the early afternoon. The station was so big it surprised me.",
      "First I went to see a famous garden. The weather was nice and I took lots of photos.",
      "At night I ate fresh seafood at the market. Since I was alone, I could order whatever I liked, as much as I liked.",
      "Walking alone through an unfamiliar town was a little lonely, but it was free and felt wonderful.",
      "This trip gave me the confidence that I can manage on my own. I want to go again."
    ],
    "vocab": [
      {
        "w": "一人旅",
        "r": "ひとりたび",
        "m": "獨自旅行",
        "m_en": "solo travel"
      },
      {
        "w": "計画を立てる",
        "r": "けいかくをたてる",
        "m": "訂計畫",
        "m_en": "to make a plan"
      },
      {
        "w": "新鮮",
        "r": "しんせん",
        "m": "新鮮",
        "m_en": "fresh"
      },
      {
        "w": "自由",
        "r": "じゆう",
        "m": "自由",
        "m_en": "free; freedom"
      },
      {
        "w": "自信",
        "r": "じしん",
        "m": "自信",
        "m_en": "confidence"
      }
    ],
    "grammar": [
      {
        "t": "〜より",
        "note": "「思ったより楽しい」表示比預期更~。",
        "t_en": "〜より (than)",
        "note_en": "思ったより = “more ~ than expected”: 思ったより楽しい."
      },
      {
        "t": "〜だけ",
        "note": "「好きなだけ注文できる」表示到某個限度:想要多少就多少。",
        "t_en": "〜だけ (as much as)",
        "note_en": "〜だけ = “as much as”: 好きなだけ (as much as you like)."
      },
      {
        "t": "〜という〜",
        "note": "「何とかなるという自信」用という說明內容。",
        "t_en": "〜という〜",
        "note_en": "〜という〜 introduces content: 何とかなるという自信 (the confidence that it'll work out)."
      }
    ]
  },
  {
    "id": "a-n4-5",
    "level": "n4",
    "topic": "仕事",
    "topic_en": "Work",
    "title": "アルバイトの一日",
    "title_zh": "打工的一天",
    "title_en": "A Day at My Part-Time Job",
    "body": "わたしは大学に通いながら、カフェでアルバイトをしています。週に三回、夕方から夜までのシフトです。\n店に着いたら、まず制服に着がえて、手をきれいに洗います。\n仕事の内容は、注文を取ったり、コーヒーを作ったり、テーブルをかたづけたりすることです。\nいそがしい時間はとても大変ですが、お客さんに「ありがとう」と言われると、つかれが飛んでいきます。\nはじめのころは失敗ばかりで、先輩によく注意されました。でも、少しずつできることが増えてきました。\nアルバイトのおかげで、お金だけでなく、人との話し方やチームワークの大切さも学びました。\n勉強との両立は簡単ではありませんが、社会に出る前のいい経験になっていると思います。",
    "trans": [
      "我一邊上大學,一邊在咖啡廳打工。一週三次,傍晚到晚上的班。",
      "到店裡後,先換上制服,把手洗乾淨。",
      "工作內容是點餐、做咖啡、收拾桌子之類的。",
      "忙的時段非常辛苦,但被客人說一聲「謝謝」,疲勞就飛走了。",
      "剛開始老是出錯,常被前輩提醒。但能做的事一點一點變多了。",
      "多虧了打工,不只是錢,我也學到和人說話的方式、還有團隊合作的重要。",
      "要和課業兼顧並不簡單,但我覺得這是出社會前很好的經驗。"
    ],
    "trans_en": [
      "While attending university, I work part-time at a café. My shifts are three times a week, from evening until night.",
      "When I get to the shop, I first change into my uniform and wash my hands thoroughly.",
      "The work involves taking orders, making coffee, clearing tables, and so on.",
      "The busy hours are really tough, but when a customer says “thank you,” my tiredness just flies away.",
      "At first I made nothing but mistakes and was often corrected by senior staff. But little by little I can do more.",
      "Thanks to this job, I've learned not only about money but also how to talk with people and the importance of teamwork.",
      "Balancing it with studying isn't easy, but I think it's good experience before entering the working world."
    ],
    "vocab": [
      {
        "w": "通う",
        "r": "かよう",
        "m": "往返、上(學/班)",
        "m_en": "to commute; attend"
      },
      {
        "w": "着がえる",
        "r": "きがえる",
        "m": "換衣服",
        "m_en": "to change clothes"
      },
      {
        "w": "片づける",
        "r": "かたづける",
        "m": "收拾、整理",
        "m_en": "to tidy up"
      },
      {
        "w": "先輩",
        "r": "せんぱい",
        "m": "前輩",
        "m_en": "senior (colleague)"
      },
      {
        "w": "経験",
        "r": "けいけん",
        "m": "經驗",
        "m_en": "experience"
      }
    ],
    "grammar": [
      {
        "t": "〜ながら",
        "note": "動詞ます形＋ながら 表示同時做兩件事:「通いながら働く」。",
        "t_en": "〜ながら (while)",
        "note_en": "masu-stem + ながら = doing two things at once: 通いながら (while attending)."
      },
      {
        "t": "〜ばかり",
        "note": "「失敗ばかり」表示淨是、老是。",
        "t_en": "〜ばかり (nothing but)",
        "note_en": "〜ばかり = “nothing but”: 失敗ばかり (nothing but mistakes)."
      },
      {
        "t": "〜おかげで",
        "note": "「アルバイトのおかげで」表示好的原因/多虧。",
        "t_en": "〜おかげで (thanks to)",
        "note_en": "〜おかげで = “thanks to” (positive cause): アルバイトのおかげで."
      }
    ]
  },
  {
    "id": "a-n3-6",
    "level": "n3",
    "topic": "文化",
    "topic_en": "Culture",
    "title": "日本の四季と年中行事",
    "title_zh": "日本的四季與節慶",
    "title_en": "Japan's Four Seasons and Annual Events",
    "body": "日本には春夏秋冬という四つの季節があり、それぞれに合わせた行事が今も大切にされている。\n春は桜の季節だ。人々は公園に集まり、花の下で食事をしながら春の訪れを祝う。\n夏になると、各地で祭りや花火大会が開かれ、浴衣を着た人でにぎわう。\n秋は「食欲の秋」「読書の秋」とも言われ、涼しくなった空気の中で紅葉を楽しむ人が多い。\n冬には正月がある。家族が集まっておせち料理を食べ、神社に初詣に出かけるのが一般的だ。\nこうした行事は、季節の変化を感じ、家族や地域の人とのつながりを確かめる機会になっている。\n便利な生活の中でも、自然のリズムを大切にする心は、これからも受けつがれていくだろう。",
    "trans": [
      "日本有春夏秋冬四個季節,配合各季節的節慶至今仍被珍視。",
      "春天是櫻花的季節。人們聚集在公園,在花下一邊用餐一邊慶祝春天的到來。",
      "一到夏天,各地會舉辦祭典和煙火大會,穿著浴衣的人讓場面熱鬧非凡。",
      "秋天被稱為「食慾之秋」「讀書之秋」,許多人在轉涼的空氣中欣賞紅葉。",
      "冬天有新年。家人聚在一起吃御節料理、到神社初詣參拜,是很普遍的做法。",
      "這些節慶成為人們感受季節變化、確認與家人及地方人們連結的機會。",
      "即使在便利的生活中,珍惜自然節奏的心,想必今後也會繼續被傳承下去。"
    ],
    "trans_en": [
      "Japan has four seasons — spring, summer, autumn, and winter — and events suited to each are still cherished today.",
      "Spring is the season of cherry blossoms. People gather in parks and celebrate the arrival of spring while eating under the flowers.",
      "When summer comes, festivals and fireworks displays are held all over, bustling with people in yukata.",
      "Autumn is called “the autumn of appetite” and “the autumn of reading”; many enjoy the fall foliage in the cooler air.",
      "Winter has the New Year. It's common for families to gather to eat osechi dishes and make the year's first shrine visit.",
      "Such events have become occasions to feel the changing seasons and to reaffirm ties with family and the local community.",
      "Even amid convenient modern life, the heart that values nature's rhythm will surely keep being passed on."
    ],
    "vocab": [
      {
        "w": "季節",
        "r": "きせつ",
        "m": "季節",
        "m_en": "season"
      },
      {
        "w": "行事",
        "r": "ぎょうじ",
        "m": "活動、節慶",
        "m_en": "event; observance"
      },
      {
        "w": "祝う",
        "r": "いわう",
        "m": "慶祝",
        "m_en": "to celebrate"
      },
      {
        "w": "一般的",
        "r": "いっぱんてき",
        "m": "普遍的",
        "m_en": "general; common"
      },
      {
        "w": "受けつぐ",
        "r": "うけつぐ",
        "m": "傳承、繼承",
        "m_en": "to inherit; pass on"
      }
    ],
    "grammar": [
      {
        "t": "〜に合わせて",
        "note": "「季節に合わせた行事」表示配合某事物。",
        "t_en": "〜に合わせて",
        "note_en": "〜に合わせて = “to match / in line with”: 季節に合わせた行事."
      },
      {
        "t": "〜と言われる",
        "note": "「食欲の秋と言われる」表示一般這樣說/被稱為。",
        "t_en": "〜と言われる",
        "note_en": "〜と言われる = “is said to be / called”: 食欲の秋と言われる."
      },
      {
        "t": "〜だろう",
        "note": "「受けつがれていくだろう」表示推測。",
        "t_en": "〜だろう (probably)",
        "note_en": "〜だろう expresses conjecture: 受けつがれていくだろう (will surely be passed on)."
      }
    ]
  }
];
