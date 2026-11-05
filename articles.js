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
  },
  {
    "id": "a-n4-6",
    "level": "n4",
    "topic": "文化",
    "topic_en": "Culture",
    "title": "夏祭り",
    "title_zh": "夏日祭典",
    "title_en": "Summer Festivals",
    "body": "日本の夏には、あちこちで夏祭りが開かれます。夜になると、たくさんの人が浴衣を着て、神社やお寺に集まります。\n祭りの会場には、屋台がたくさん並んでいます。たこ焼きやかき氷を食べたり、金魚すくいをしたりして、みんな楽しそうです。\n夜の終わりには、大きな花火が上がります。ドンという大きな音がして、夜空に光が広がると、みんな「わあ」と声を上げます。\n夏祭りは、日本の夏の大切な思い出になる行事です。機会があれば、ぜひ浴衣を着て行ってみてください。",
    "trans": [
      "日本的夏天,各地都會舉辦夏日祭典。一到晚上,許多人就穿著浴衣,聚集到神社或寺廟。",
      "祭典的會場擺著許多攤販。大家吃著章魚燒、刨冰,玩撈金魚,看起來都很開心。",
      "夜晚接近尾聲時,會放大型煙火。伴隨著「咚」的一聲巨響,光芒在夜空中綻放,大家就發出「哇」的驚呼。",
      "夏日祭典是能成為日本夏天重要回憶的活動。有機會的話,請務必穿上浴衣去體驗看看。"
    ],
    "trans_en": [
      "In Japan's summer, festivals are held here and there. When night falls, many people put on yukata and gather at shrines and temples.",
      "The festival grounds are lined with many stalls. People eat takoyaki and shaved ice, scoop goldfish, and everyone looks happy.",
      "As the night ends, big fireworks go up. When light spreads across the night sky with a booming sound, everyone cries out 'wow'.",
      "Summer festivals are events that become precious memories of the Japanese summer. If you get the chance, do try putting on a yukata and going."
    ],
    "vocab": [
      {
        "w": "夏祭り",
        "r": "なつまつり",
        "m": "夏日祭典",
        "m_en": "summer festival"
      },
      {
        "w": "開く",
        "r": "ひらく",
        "m": "舉辦、開",
        "m_en": "to hold / open"
      },
      {
        "w": "浴衣",
        "r": "ゆかた",
        "m": "浴衣(夏季和服)",
        "m_en": "yukata"
      },
      {
        "w": "神社",
        "r": "じんじゃ",
        "m": "神社",
        "m_en": "shrine"
      },
      {
        "w": "屋台",
        "r": "やたい",
        "m": "路邊攤、攤販",
        "m_en": "food stall"
      },
      {
        "w": "並ぶ",
        "r": "ならぶ",
        "m": "排列",
        "m_en": "to line up"
      },
      {
        "w": "金魚すくい",
        "r": "きんぎょすくい",
        "m": "撈金魚",
        "m_en": "goldfish scooping"
      },
      {
        "w": "花火",
        "r": "はなび",
        "m": "煙火",
        "m_en": "fireworks"
      },
      {
        "w": "夜空",
        "r": "よぞら",
        "m": "夜空",
        "m_en": "night sky"
      },
      {
        "w": "行事",
        "r": "ぎょうじ",
        "m": "活動、慣例儀式",
        "m_en": "event"
      },
      {
        "w": "機会",
        "r": "きかい",
        "m": "機會",
        "m_en": "opportunity"
      }
    ],
    "grammar": [
      {
        "t": "〜たり〜たりする",
        "note": "列舉幾個動作:食べたり、すくいをしたり。",
        "t_en": "〜たり〜たり",
        "note_en": "listing actions: 食べたり、すくいをしたり."
      },
      {
        "t": "〜と(自然結果)",
        "note": "「光が広がると」一〜就〜,表示自然的結果。",
        "id": "n4-57",
        "t_en": "〜と (natural result)",
        "note_en": "as soon as ~, a natural result: 光が広がると."
      },
      {
        "t": "〜てみてください",
        "note": "「行ってみてください」試著做做看。",
        "id": "n4-23",
        "t_en": "〜てみてください",
        "note_en": "try doing ~: 行ってみてください."
      }
    ]
  },
  {
    "id": "a-n3-7",
    "level": "n3",
    "topic": "生活",
    "topic_en": "Daily Life",
    "title": "熱中症に気をつけて",
    "title_zh": "小心中暑",
    "title_en": "Watch Out for Heatstroke",
    "body": "近年、日本の夏はますます暑くなっている。特に七月から八月にかけて、気温が三十五度を超える日も珍しくない。\nこの暑さの中で気をつけなければならないのが、熱中症だ。体の水分が足りなくなると、めまいや頭痛が起こり、ひどい場合は命に関わることもある。\n熱中症を防ぐためには、のどがかわく前に、こまめに水を飲むことが大切だ。暑い時間帯の外出をさけたり、エアコンを上手に使ったりするのもよい。\n「自分はまだ大丈夫」と思っているうちに、体調が悪くなることも少なくない。周りの人と声をかけ合いながら、暑い夏を元気に乗り越えたい。",
    "trans": [
      "近年來,日本的夏天越來越熱。尤其是七月到八月這段期間,氣溫超過三十五度的日子也不稀奇。",
      "在這樣的酷熱中必須注意的,就是中暑。當身體的水分不足時,會頭暈、頭痛,嚴重時甚至可能危及性命。",
      "要預防中暑,重點是在口渴之前就勤加補充水分。避開炎熱時段外出、善用冷氣也是好方法。",
      "在自以為「我還沒事」的時候,身體變差的情況並不少見。和周遭的人互相提醒,一起有精神地度過炎熱的夏天吧。"
    ],
    "trans_en": [
      "In recent years, summers in Japan have grown hotter and hotter. Especially from July through August, days over 35 degrees are not unusual.",
      "What you must watch out for in this heat is heatstroke. When the body runs low on water, dizziness and headaches set in, and in severe cases it can even become life-threatening.",
      "To prevent heatstroke, the key is to drink water frequently, before you feel thirsty. It also helps to avoid going out during the hottest hours and to use air conditioning wisely.",
      "It is not rare for your condition to worsen while you still think 'I'm fine.' Let's look out for one another and get through the hot summer in good health."
    ],
    "vocab": [
      {
        "w": "近年",
        "r": "きんねん",
        "m": "近年",
        "m_en": "recent years"
      },
      {
        "w": "熱中症",
        "r": "ねっちゅうしょう",
        "m": "中暑",
        "m_en": "heatstroke"
      },
      {
        "w": "気温",
        "r": "きおん",
        "m": "氣溫",
        "m_en": "temperature"
      },
      {
        "w": "超える",
        "r": "こえる",
        "m": "超過",
        "m_en": "to exceed"
      },
      {
        "w": "水分",
        "r": "すいぶん",
        "m": "水分",
        "m_en": "moisture / hydration"
      },
      {
        "w": "頭痛",
        "r": "ずつう",
        "m": "頭痛",
        "m_en": "headache"
      },
      {
        "w": "命",
        "r": "いのち",
        "m": "生命",
        "m_en": "life"
      },
      {
        "w": "関わる",
        "r": "かかわる",
        "m": "關係到、攸關",
        "m_en": "to be at stake"
      },
      {
        "w": "防ぐ",
        "r": "ふせぐ",
        "m": "預防",
        "m_en": "to prevent"
      },
      {
        "w": "時間帯",
        "r": "じかんたい",
        "m": "時段",
        "m_en": "time period"
      },
      {
        "w": "外出",
        "r": "がいしゅつ",
        "m": "外出",
        "m_en": "going out"
      },
      {
        "w": "体調",
        "r": "たいちょう",
        "m": "身體狀況",
        "m_en": "physical condition"
      },
      {
        "w": "乗り越える",
        "r": "のりこえる",
        "m": "克服、度過",
        "m_en": "to overcome"
      }
    ],
    "grammar": [
      {
        "t": "〜から〜にかけて",
        "note": "「七月から八月にかけて」表示大致的期間範圍。",
        "t_en": "〜から〜にかけて",
        "note_en": "over the period from ~ to ~: 七月から八月にかけて."
      },
      {
        "t": "〜うちに",
        "note": "「思っているうちに」在〜的狀態持續期間(不知不覺就〜)。",
        "id": "n3-13",
        "t_en": "〜うちに",
        "note_en": "while ~ still holds: 思っているうちに."
      },
      {
        "t": "〜なければならない",
        "note": "「気をつけなければならない」表示義務、非做不可。",
        "t_en": "〜なければならない",
        "note_en": "must ~: 気をつけなければならない."
      }
    ]
  },
  {
    "id": "a-n2-5",
    "level": "n2",
    "topic": "社会",
    "topic_en": "Society",
    "title": "広がるキャッシュレス決済",
    "title_zh": "普及中的無現金支付",
    "title_en": "The Spread of Cashless Payment",
    "body": "ここ数年、日本でもキャッシュレス決済が急速に広がってきた。以前は現金しか使えない店が多かったが、今ではスマートフォンやカードで支払える店が増えている。\nキャッシュレス決済には、支払いが早く、お金の管理がしやすいという利点がある。レジで小銭を探す必要がなく、いつ、いくら使ったかが記録として残るからだ。\n一方で、課題も残されている。停電や通信障害が起きると、支払いができなくなる恐れがある。使いすぎてしまう人や、機械の操作が苦手な高齢者への配慮も欠かせない。\n便利さと安心のバランスをどう取るか。現金とキャッシュレスがうまく共存できる社会が求められている。",
    "trans": [
      "近幾年,無現金支付在日本也迅速普及。以前只能用現金的店家很多,如今能用智慧型手機或信用卡付款的店家越來越多。",
      "無現金支付有付款快、金錢管理容易的優點。因為不必在收銀台找零錢,而且何時、花了多少都會留下記錄。",
      "另一方面,問題也還存在。一旦停電或通訊故障,就有可能無法付款。對於容易花過頭的人、以及不擅長操作機器的高齡者,也不能缺少體貼的考量。",
      "便利與安心之間該如何取得平衡呢?我們需要的,是一個現金與無現金能好好共存的社會。"
    ],
    "trans_en": [
      "Over the past few years, cashless payment has spread rapidly in Japan too. There used to be many shops that took only cash, but now more and more shops let you pay by smartphone or card.",
      "Cashless payment has the advantages of quick payment and easy money management. You do not need to search for coins at the register, and a record remains of when and how much you spent.",
      "On the other hand, problems remain. If there is a power outage or a communication failure, there is a risk that you cannot pay. Consideration for people who overspend and for elderly people who struggle with the machines is also essential.",
      "How to balance convenience and peace of mind? A society where cash and cashless can coexist well is what is being called for."
    ],
    "vocab": [
      {
        "w": "決済",
        "r": "けっさい",
        "m": "結算、支付",
        "m_en": "payment / settlement"
      },
      {
        "w": "急速に",
        "r": "きゅうそくに",
        "m": "迅速地",
        "m_en": "rapidly"
      },
      {
        "w": "現金",
        "r": "げんきん",
        "m": "現金",
        "m_en": "cash"
      },
      {
        "w": "支払う",
        "r": "しはらう",
        "m": "支付",
        "m_en": "to pay"
      },
      {
        "w": "利点",
        "r": "りてん",
        "m": "優點",
        "m_en": "advantage"
      },
      {
        "w": "小銭",
        "r": "こぜに",
        "m": "零錢",
        "m_en": "small change"
      },
      {
        "w": "記録",
        "r": "きろく",
        "m": "記錄",
        "m_en": "record"
      },
      {
        "w": "課題",
        "r": "かだい",
        "m": "課題、待解問題",
        "m_en": "issue / challenge"
      },
      {
        "w": "停電",
        "r": "ていでん",
        "m": "停電",
        "m_en": "power outage"
      },
      {
        "w": "通信障害",
        "r": "つうしんしょうがい",
        "m": "通訊故障",
        "m_en": "communication failure"
      },
      {
        "w": "恐れ",
        "r": "おそれ",
        "m": "疑慮、風險",
        "m_en": "risk / fear"
      },
      {
        "w": "配慮",
        "r": "はいりょ",
        "m": "體貼、顧慮",
        "m_en": "consideration"
      },
      {
        "w": "共存",
        "r": "きょうぞん",
        "m": "共存",
        "m_en": "coexistence"
      },
      {
        "w": "求める",
        "r": "もとめる",
        "m": "尋求、要求",
        "m_en": "to seek / demand"
      }
    ],
    "grammar": [
      {
        "t": "〜てくる(變化)",
        "note": "「広がってきた」表示到現在為止的變化、趨勢。",
        "t_en": "〜てくる (gradual change)",
        "note_en": "a change up to now: 広がってきた."
      },
      {
        "t": "〜恐れがある",
        "note": "「できなくなる恐れがある」表示有(不好的)可能性。",
        "t_en": "〜恐れがある",
        "note_en": "there is a risk that ~: できなくなる恐れがある."
      },
      {
        "t": "一方(で)",
        "note": "「一方で、課題も残されている」用來提出相對的另一面。",
        "t_en": "一方(で) (on the other hand)",
        "note_en": "presenting the other side: 一方で、課題も残されている."
      }
    ]
  },
  {
    "id": "a-n1-3",
    "level": "n1",
    "topic": "社会",
    "topic_en": "Society",
    "title": "少子高齢化という難題",
    "title_zh": "少子高齡化這道難題",
    "title_en": "The Challenge of an Aging, Shrinking Society",
    "body": "日本は 世界でも 類を見ない 速さで 少子高齢化が 進んでいる。総人口に 占める 高齢者の 割合は 年々 上昇し、その 一方で 生まれる 子どもの 数は 減り続けている。\nこの 傾向が もたらす 影響は、社会保障制度の 根幹を 揺るがしかねない。年金や 医療、介護に かかる 費用は 増える 一方で、それを 支える 現役世代は 減っていくからだ。\n対策として、育児と 仕事の 両立を 支援する 制度の 充実や、外国人労働者の 受け入れ 拡大などが 議論されている。しかし、いずれも 一朝一夕に 解決できる 問題では ない。\n出生率が 下がる 背景には、経済的な 不安や 価値観の 多様化といった、複雑な 要因が 絡み合っている。単に 補助金を 配れば 済むという 話では ないのだ。\n少子高齢化は、もはや 避けて 通れない 現実で ある。社会全体で どう 向き合い、次の 世代に どのような 国を 残すのか。今こそ 真剣な 議論が 求められている。",
    "trans": [
      "日本正以世界上前所未見的速度邁向少子高齡化。高齡者在總人口中所占的比例逐年上升,另一方面,出生的孩子數量卻持續減少。",
      "這股趨勢帶來的影響,恐怕會動搖社會保障制度的根基。因為年金、醫療、照護所需的費用不斷增加,而支撐這些的青壯世代卻愈來愈少。",
      "作為對策,支援育兒與工作兼顧的制度該如何充實、是否擴大接納外籍勞工等等,都正在被討論。然而,這些都不是一朝一夕就能解決的問題。",
      "出生率下降的背後,經濟上的不安、價值觀的多元化等等複雜的因素相互交織。並不是單靠發放補助金就能了事的。",
      "少子高齡化已是無可迴避的現實。整個社會該如何面對、要留給下一代什麼樣的國家?此刻正需要一場認真的討論。"
    ],
    "trans_en": [
      "Japan is aging and shrinking at a speed the world has never seen. The share of the elderly in the total population rises year by year, while the number of children being born keeps falling.",
      "The impact of this trend could shake the very foundation of the social security system, because the costs of pensions, healthcare and nursing care keep rising while the working generation that supports them keeps shrinking.",
      "Proposed measures — enriching systems that help people balance childcare and work, or widening the acceptance of foreign workers — are all being debated. Yet none can be solved overnight.",
      "Behind the falling birth rate lie tangled, complex factors: economic anxiety, the diversification of values, and more. It is not something handouts alone can fix.",
      "An aging, shrinking society is now an unavoidable reality. How should society as a whole face it, and what kind of country should we leave the next generation? A serious debate is needed now more than ever."
    ],
    "vocab": [
      {
        "w": "割合",
        "r": "わりあい",
        "m": "比例、比率",
        "m_en": "proportion / ratio"
      },
      {
        "w": "傾向",
        "r": "けいこう",
        "m": "傾向、趨勢",
        "m_en": "tendency / trend"
      },
      {
        "w": "根幹",
        "r": "こんかん",
        "m": "根基、核心",
        "m_en": "foundation / core"
      },
      {
        "w": "介護",
        "r": "かいご",
        "m": "照護、看護",
        "m_en": "nursing care"
      },
      {
        "w": "両立",
        "r": "りょうりつ",
        "m": "兼顧、並存",
        "m_en": "balancing two things"
      },
      {
        "w": "一朝一夕",
        "r": "いっちょういっせき",
        "m": "一朝一夕、短時間",
        "m_en": "in a short time / overnight"
      },
      {
        "w": "出生率",
        "r": "しゅっしょうりつ",
        "m": "出生率",
        "m_en": "birth rate"
      },
      {
        "w": "要因",
        "r": "よういん",
        "m": "因素、要因",
        "m_en": "factor"
      }
    ],
    "grammar": [
      {
        "t": "~かねない",
        "note": "「有可能~(壞結果)」:根幹を揺るがしかねない=可能動搖根基。",
        "t_en": "〜かねない",
        "note_en": "\"could well (do something bad)\": 根幹を揺るがしかねない."
      },
      {
        "t": "~一方で",
        "note": "對比兩面:費用は増える一方で、現役世代は減る。",
        "t_en": "〜一方で",
        "note_en": "contrasting two sides: costs rise on one hand, the working generation shrinks on the other."
      },
      {
        "t": "~ではないのだ",
        "note": "強調否定、下結論:済むという話ではないのだ。",
        "t_en": "〜ではないのだ",
        "note_en": "emphatic negation / conclusion: it is not something that will simply do."
      }
    ]
  },
  {
    "id": "a-n1-4",
    "level": "n1",
    "topic": "メディア",
    "topic_en": "Media",
    "title": "情報の海を泳ぐために",
    "title_zh": "為了在資訊之海中泅泳",
    "title_en": "Swimming Through a Sea of Information",
    "body": "スマートフォンの 普及に よって、私たちは いつでも どこでも 膨大な 情報に 触れられる ように なった。だが、その 便利さの 裏には 見過ごせない 落とし穴が 潜んでいる。\nインターネット上には、真偽の 定かでない 情報が あふれている。中には、悪意を もって 拡散される デマも 少なくない。事実と 意見を 見分ける 力が、かつてないほど 求められている。\nさらに 厄介なのは、自分の 好みに 合う 情報ばかりが 表示される 仕組みだ。知らず知らずの うちに 視野が 狭まり、偏った 考えに 陥りやすくなる。\n大切なのは、一つの 情報を 鵜呑みに せず、複数の 情報源に あたって 確かめる 姿勢である。発信する 際にも、その 内容に 責任を 持たなければ ならない。\n情報を 正しく 読み解く 力は、もはや 一部の 専門家だけの ものでは ない。誰もが 身につけるべき、現代を 生き抜く ための 必須の 教養なのだ。",
    "trans": [
      "隨著智慧型手機的普及,我們變得隨時隨地都能接觸到龐大的資訊。但在那份便利的背後,潛藏著不可忽視的陷阱。",
      "網路上充斥著真偽難辨的資訊。其中,懷著惡意被散播的假消息也不在少數。分辨事實與意見的能力,前所未有地被需要著。",
      "更棘手的是,只顯示符合自己喜好資訊的機制。在不知不覺間視野變窄,容易陷入偏頗的想法。",
      "重要的是,不囫圇吞棗地接受單一資訊,而是查閱多個資訊來源加以確認的態度。在發布時,也必須對其內容負起責任。",
      "正確解讀資訊的能力,已不再是少數專家的專利。而是每個人都該具備、在現代生存下去所必需的素養。"
    ],
    "trans_en": [
      "With the spread of smartphones, we can now reach vast amounts of information anytime, anywhere. But behind that convenience lurks a pitfall we cannot overlook.",
      "The internet overflows with information of uncertain truth. Not a few are rumors spread with malice. The ability to tell fact from opinion is demanded as never before.",
      "More troublesome still is the mechanism that shows only information matching your own tastes. Before you know it, your view narrows and you easily fall into biased thinking.",
      "What matters is the attitude of not swallowing a single piece of information whole, but checking it against multiple sources. When you post, too, you must take responsibility for the content.",
      "The power to read information correctly is no longer the preserve of a few experts. It is essential literacy that everyone should acquire to survive the modern age."
    ],
    "vocab": [
      {
        "w": "普及",
        "r": "ふきゅう",
        "m": "普及",
        "m_en": "spread / diffusion"
      },
      {
        "w": "膨大",
        "r": "ぼうだい",
        "m": "龐大",
        "m_en": "enormous"
      },
      {
        "w": "真偽",
        "r": "しんぎ",
        "m": "真偽",
        "m_en": "truth or falsehood"
      },
      {
        "w": "拡散",
        "r": "かくさん",
        "m": "擴散、散播",
        "m_en": "to spread / diffuse"
      },
      {
        "w": "厄介",
        "r": "やっかい",
        "m": "棘手、麻煩",
        "m_en": "troublesome"
      },
      {
        "w": "視野",
        "r": "しや",
        "m": "視野",
        "m_en": "field of view / perspective"
      },
      {
        "w": "鵜呑み",
        "r": "うのみ",
        "m": "囫圇吞棗、盲信",
        "m_en": "swallowing whole / taking uncritically"
      },
      {
        "w": "教養",
        "r": "きょうよう",
        "m": "素養、涵養",
        "m_en": "cultivation / literacy"
      }
    ],
    "grammar": [
      {
        "t": "~ずにはいられない/~ないうちに",
        "note": "「知らず知らずのうちに」=在不知不覺間。",
        "t_en": "〜ないうちに",
        "note_en": "\"before you know it\": 知らず知らずのうちに."
      },
      {
        "t": "~ばかり",
        "note": "限定、偏重:好みに合う情報ばかりが表示される。",
        "t_en": "〜ばかり",
        "note_en": "only / nothing but: only information matching your tastes is shown."
      },
      {
        "t": "もはや~ない",
        "note": "「已不再~」:もはや専門家だけのものではない。",
        "t_en": "もはや〜ない",
        "note_en": "\"no longer\": no longer the preserve of experts alone."
      }
    ]
  },
  {
    "id": "a-n1-5",
    "level": "n1",
    "topic": "社会",
    "topic_en": "Society",
    "title": "捨てられる食べ物",
    "title_zh": "被丟棄的食物",
    "title_en": "The Food We Throw Away",
    "body": "まだ 食べられるのに 捨てられて しまう 食品、いわゆる 食品ロスが 世界的な 問題と なっている。日本でも 年間 数百万トンもの 食料が、無駄に 廃棄されている という。\nその 一方で、世界には 十分な 食事を とれない 人々が 大勢いる。豊かさの 象徴の ように 見える 飽食の 裏で、深刻な 不均衡が 生じているのだ。\n食品ロスは、家庭や 飲食店で 出る 食べ残しだけが 原因では ない。まだ 売れる はずの 商品が、賞味期限を 理由に 大量に 処分される 現状も 見逃せない。\nこの 問題の 解決には、企業の 取り組みは もちろん、一人ひとりの 意識の 変化が 欠かせない。買いすぎない、作りすぎない といった 心がけが、大きな 一歩と なる。\n限りある 資源を 大切に する ことは、次の 世代への 責任でも ある。食べ物を 無駄にしない 暮らしが、今 改めて 問われている。",
    "trans": [
      "明明還能吃卻被丟掉的食品,也就是所謂的食物浪費,已成為全球性的問題。據說在日本,每年也有數百萬噸的食物被白白廢棄。",
      "另一方面,世界上有許多人無法獲得足夠的三餐。在看似富足象徵的飽食背後,正產生著嚴重的不均衡。",
      "食物浪費的原因,並不只是家庭或餐廳產生的剩菜。原本應該還賣得出去的商品,卻以賞味期限為由被大量處理掉的現況,也不容忽視。",
      "要解決這個問題,企業的努力自不待言,每一個人意識的轉變更是不可或缺。不買過量、不做過量這樣的用心,就會成為重要的一步。",
      "珍惜有限的資源,也是對下一代的責任。不浪費食物的生活方式,如今再次被重新檢視。"
    ],
    "trans_en": [
      "Food thrown away though still edible — so-called food loss — has become a worldwide problem. In Japan too, millions of tons of food are said to be wastefully discarded each year.",
      "On the other hand, many people in the world cannot get enough to eat. Behind an abundance that looks like a symbol of wealth, a serious imbalance is arising.",
      "Food loss is not caused only by leftovers from homes and restaurants. We cannot overlook the reality that products that should still sell are discarded in bulk on the grounds of best-before dates.",
      "Solving this problem requires not only corporate efforts but also a change in each person's awareness. Small resolves — not overbuying, not overcooking — become a big step.",
      "Cherishing limited resources is also a responsibility to the next generation. A way of life that does not waste food is now being questioned anew."
    ],
    "vocab": [
      {
        "w": "廃棄",
        "r": "はいき",
        "m": "廢棄、丟棄",
        "m_en": "disposal / scrapping"
      },
      {
        "w": "大勢",
        "r": "おおぜい",
        "m": "許多人",
        "m_en": "a large number of people"
      },
      {
        "w": "飽食",
        "r": "ほうしょく",
        "m": "飽食、豐衣足食",
        "m_en": "gluttony / satiety"
      },
      {
        "w": "不均衡",
        "r": "ふきんこう",
        "m": "不均衡",
        "m_en": "imbalance"
      },
      {
        "w": "賞味期限",
        "r": "しょうみきげん",
        "m": "賞味期限",
        "m_en": "best-before date"
      },
      {
        "w": "処分",
        "r": "しょぶん",
        "m": "處理、處分",
        "m_en": "disposal"
      },
      {
        "w": "欠かせない",
        "r": "かかせない",
        "m": "不可或缺",
        "m_en": "indispensable"
      },
      {
        "w": "資源",
        "r": "しげん",
        "m": "資源",
        "m_en": "resources"
      }
    ],
    "grammar": [
      {
        "t": "~のに",
        "note": "逆接:まだ食べられるのに捨てられる。",
        "t_en": "〜のに",
        "note_en": "although: thrown away although still edible."
      },
      {
        "t": "~はもちろん",
        "note": "「~自不待言、更別提」:企業の取り組みはもちろん。",
        "t_en": "〜はもちろん",
        "note_en": "\"not only ... but also\": corporate efforts, of course, but also ..."
      },
      {
        "t": "~ずにはいられない/見逃せない",
        "note": "「不容忽視」:現状も見逃せない。",
        "t_en": "〜見逃せない",
        "note_en": "\"cannot overlook\": we cannot overlook this reality."
      }
    ]
  },
  {
    "id": "a-n1-6",
    "level": "n1",
    "topic": "文化",
    "topic_en": "Culture",
    "title": "受け継がれるもの",
    "title_zh": "被傳承下來的東西",
    "title_en": "What Gets Passed Down",
    "body": "各地に 伝わる 伝統文化や 職人の 技は、長い 年月を かけて 磨かれ、受け継がれて きた かけがえのない 財産で ある。しかし 今、その 多くが 存続の 危機に 瀕している。\n最大の 要因は、後継者の 不足だ。担い手の 高齢化が 進む 一方で、若者は 都市へと 流出し、技を 学ぼうとする 者は 年々 減っている。\n伝統を 守ると 言っても、ただ 昔の ままを 保てば よい という わけでは ない。時代の 変化に 応じて 新しい 価値を 生み出してこそ、文化は 生き続けられる。\n近年では、伝統工芸に 現代的な デザインを 取り入れたり、海外へ 発信したり する 試みも 広がりつつある。古いものと 新しいものの 融合が、活路を 開く 鍵と なる。\n先人が 築いてきた ものを 次の 世代へ どう つなぐか。それは、私たち 一人ひとりに 課された、重い 宿題なのかもしれない。",
    "trans": [
      "各地流傳的傳統文化與工匠的技藝,是歷經漫長歲月琢磨、傳承下來的無可取代的資產。然而如今,其中許多正瀕臨存續的危機。",
      "最大的原因是後繼者的不足。在承擔者高齡化不斷加劇的同時,年輕人往都市外流,想學習技藝的人也逐年減少。",
      "雖說要守護傳統,但並不是只要一味保持昔日原貌就好。唯有順應時代的變化、創造出新的價值,文化才能繼續存活。",
      "近年來,將現代設計融入傳統工藝、或向海外發信這樣的嘗試也正逐漸擴展。舊事物與新事物的融合,成為開拓生路的關鍵。",
      "如何將先人所建立的東西連接給下一個世代?那或許是加諸在我們每一個人身上的、沉重的功課。"
    ],
    "trans_en": [
      "Traditional cultures and craftsmen's skills handed down across the land are irreplaceable treasures, honed and passed on over long years. Yet now, many of them face a crisis of survival.",
      "The biggest factor is a shortage of successors. As those who carry the skills grow old, young people flow out to the cities, and those who would learn the crafts dwindle year by year.",
      "Even if we speak of protecting tradition, it does not mean simply keeping things as they were. Only by creating new value in response to the changing times can a culture keep living.",
      "In recent years, attempts to bring modern design into traditional crafts, or to send them out overseas, are spreading. A fusion of old and new becomes the key that opens a way forward.",
      "How do we connect what our forebears built to the next generation? That may be a heavy piece of homework imposed on each and every one of us."
    ],
    "vocab": [
      {
        "w": "職人",
        "r": "しょくにん",
        "m": "工匠、職人",
        "m_en": "craftsman"
      },
      {
        "w": "存続",
        "r": "そんぞく",
        "m": "存續",
        "m_en": "survival / continuation"
      },
      {
        "w": "瀕して",
        "r": "ひんして",
        "m": "瀕臨",
        "m_en": "to be on the verge of"
      },
      {
        "w": "後継者",
        "r": "こうけいしゃ",
        "m": "後繼者、接班人",
        "m_en": "successor"
      },
      {
        "w": "担い手",
        "r": "にないて",
        "m": "承擔者、中堅",
        "m_en": "bearer / one who carries on"
      },
      {
        "w": "融合",
        "r": "ゆうごう",
        "m": "融合",
        "m_en": "fusion"
      },
      {
        "w": "活路",
        "r": "かつろ",
        "m": "生路、出路",
        "m_en": "way out / lifeline"
      },
      {
        "w": "先人",
        "r": "せんじん",
        "m": "先人、前人",
        "m_en": "predecessors / forebears"
      }
    ],
    "grammar": [
      {
        "t": "~てこそ",
        "note": "「唯有~才」:新しい価値を生み出してこそ生き続けられる。",
        "t_en": "〜てこそ",
        "note_en": "\"only by doing\": only by creating new value can it survive."
      },
      {
        "t": "~わけではない",
        "note": "部分否定:昔のままを保てばよいというわけではない。",
        "t_en": "〜わけではない",
        "note_en": "\"it doesn't mean that\": it doesn't mean just keeping the old ways is fine."
      },
      {
        "t": "~つつある",
        "note": "「正逐漸~」:試みも広がりつつある。",
        "t_en": "〜つつある",
        "note_en": "\"is gradually ...\": such attempts are gradually spreading."
      }
    ]
  },
  {
    "id": "a-n2-6",
    "level": "n2",
    "topic": "健康",
    "topic_en": "Health",
    "title": "眠りを大切に",
    "title_zh": "重視睡眠",
    "title_en": "Take Sleep Seriously",
    "body": "忙しい 毎日の 中で、つい 削って しまいがちなのが 睡眠の 時間です。しかし、質の よい 睡眠は、健康な 生活を 送る うえで 欠かせない ものです。\n睡眠が 足りないと、集中力が 落ちたり、体調を 崩したり します。日中の 眠気で 仕事や 勉強が うまく いかない 人も 多いでしょう。\nよく 眠る ためには、まず 生活の リズムを 整える ことが 大切です。毎日 同じ 時間に 寝て、同じ 時間に 起きる 習慣を つけましょう。\nまた、寝る 前に スマートフォンを 見るのは できるだけ 避けた ほうが よいです。画面の 明るい 光は、脳を 目覚めさせて しまうからです。\nたった 数時間の 違いでも、毎日の 積み重ねは 大きな 差に なります。まずは 早めに 布団に 入る ことから 始めて みませんか。",
    "trans": [
      "在忙碌的每一天中,總是不知不覺就會被犧牲掉的,就是睡眠時間。然而,優質的睡眠,是過健康生活所不可或缺的。",
      "睡眠不足的話,會導致注意力下降、身體狀況變差。想必也有很多人因為白天的睡意,使得工作或讀書都不順利。",
      "為了睡得好,首先調整生活的節奏很重要。養成每天在同一時間睡、同一時間起床的習慣吧。",
      "另外,睡前最好盡量避免看智慧型手機。因為螢幕明亮的光線,會使大腦清醒過來。",
      "即使只是短短幾小時的差別,每天的累積也會變成很大的差距。要不要先從早點鑽進被窩開始試試看呢?"
    ],
    "trans_en": [
      "In our busy days, the thing we tend to cut without thinking is sleep. Yet good-quality sleep is indispensable for living a healthy life.",
      "When you don't get enough sleep, your concentration drops and your health suffers. Many people find work or study going badly because of daytime drowsiness.",
      "To sleep well, the first important thing is to get your daily rhythm in order. Make a habit of going to bed and getting up at the same time every day.",
      "Also, it is best to avoid looking at your smartphone before bed as much as possible, because the bright light of the screen wakes the brain up.",
      "Even a difference of just a few hours adds up daily into a big gap. Why not start by getting into bed a little earlier?"
    ],
    "vocab": [
      {
        "w": "削って",
        "r": "けずって",
        "m": "削減、犧牲",
        "m_en": "to cut down / shave off"
      },
      {
        "w": "睡眠",
        "r": "すいみん",
        "m": "睡眠",
        "m_en": "sleep"
      },
      {
        "w": "欠かせない",
        "r": "かかせない",
        "m": "不可或缺",
        "m_en": "indispensable"
      },
      {
        "w": "集中力",
        "r": "しゅうちゅうりょく",
        "m": "注意力、專注力",
        "m_en": "concentration"
      },
      {
        "w": "眠気",
        "r": "ねむけ",
        "m": "睡意",
        "m_en": "drowsiness"
      },
      {
        "w": "整える",
        "r": "ととのえる",
        "m": "調整、整頓",
        "m_en": "to arrange / put in order"
      },
      {
        "w": "避けた",
        "r": "さけた",
        "m": "避開",
        "m_en": "avoided"
      },
      {
        "w": "積み重ね",
        "r": "つみかさね",
        "m": "累積",
        "m_en": "accumulation"
      }
    ],
    "grammar": [
      {
        "t": "~がち",
        "note": "「容易、往往~」:つい削ってしまいがち。",
        "t_en": "〜がち",
        "note_en": "\"tend to\": we tend to cut sleep."
      },
      {
        "t": "~うえで",
        "note": "「在~方面」:健康な生活を送るうえで欠かせない。",
        "t_en": "〜うえで",
        "note_en": "\"in doing / for\": indispensable for living healthily."
      },
      {
        "t": "~たほうがよい",
        "note": "建議:スマホを見るのは避けたほうがよい。",
        "t_en": "〜たほうがよい",
        "note_en": "\"had better\": you had better avoid your phone."
      }
    ]
  },
  {
    "id": "a-n2-7",
    "level": "n2",
    "topic": "生活",
    "topic_en": "Daily life",
    "title": "そなえあれば",
    "title_zh": "有備無患",
    "title_en": "Better Safe Than Sorry",
    "body": "日本は 地震や 台風などの 自然災害が 多い 国です。いつ 起こるか 分からない 災害に、日ごろから 備えて おく ことが とても 大切です。\nまず、家庭で できる ことから 始めましょう。水や 食料、懐中電灯などを 用意して、すぐに 持ち出せる 場所に 置いて おくと 安心です。\n家族と 話し合って おく ことも 忘れては いけません。もし はぐれて しまった とき、どこで 集まるかを 決めて おけば、あわてずに 行動できます。\nまた、住んでいる 地域の 危険な 場所を 知って おく ことも 役に 立ちます。市役所などが 配る 地図を 見て、避難所までの 道を 確認して おきましょう。\n災害は 防げなくても、被害を 減らす ことは できます。ふだんの ちょっとした 心がけが、いざという ときに 自分や 家族を 守るのです。",
    "trans": [
      "日本是地震、颱風等自然災害多的國家。對於不知何時會發生的災害,平時就先做好準備非常重要。",
      "首先,從家庭做得到的事情開始吧。準備好水、食物、手電筒等,放在能立刻帶出去的地方就令人安心。",
      "和家人事先討論好也不能忘記。萬一走散的時候,只要事先決定好在哪裡集合,就能不慌張地行動。",
      "另外,先了解自己居住地區的危險場所也很有幫助。看看市公所等發放的地圖,先確認到避難所的路吧。",
      "就算災害無法防止,也能減少損害。平時一點點的用心,在緊要關頭就能守護自己和家人。"
    ],
    "trans_en": [
      "Japan is a country with many natural disasters such as earthquakes and typhoons. It is very important to prepare in ordinary times for disasters that may strike at any moment.",
      "First, let's start with what you can do at home. It is reassuring to prepare water, food, a flashlight and so on, and keep them where you can grab them at once.",
      "Don't forget to talk things over with your family in advance. If you get separated, deciding where to gather beforehand lets you act without panicking.",
      "It also helps to know the dangerous spots in the area where you live. Look at the map handed out by the city office and check the route to the evacuation site.",
      "Even if disasters can't be prevented, damage can be reduced. A little everyday care is what protects you and your family when the moment comes."
    ],
    "vocab": [
      {
        "w": "災害",
        "r": "さいがい",
        "m": "災害",
        "m_en": "disaster"
      },
      {
        "w": "備えて",
        "r": "そなえて",
        "m": "防備、準備",
        "m_en": "to prepare / guard against"
      },
      {
        "w": "懐中電灯",
        "r": "かいちゅうでんとう",
        "m": "手電筒",
        "m_en": "flashlight"
      },
      {
        "w": "持ち出せる",
        "r": "もちだせる",
        "m": "能帶出、能取出",
        "m_en": "can carry out"
      },
      {
        "w": "避難所",
        "r": "ひなんじょ",
        "m": "避難所",
        "m_en": "evacuation shelter"
      },
      {
        "w": "被害",
        "r": "ひがい",
        "m": "損害、災情",
        "m_en": "damage"
      },
      {
        "w": "心がけ",
        "r": "こころがけ",
        "m": "用心、留意",
        "m_en": "mindfulness / care"
      },
      {
        "w": "守る",
        "r": "まもる",
        "m": "守護、保護",
        "m_en": "to protect"
      }
    ],
    "grammar": [
      {
        "t": "~ておく",
        "note": "事先做好:備えておく、決めておく。",
        "t_en": "〜ておく",
        "note_en": "do in advance: prepare / decide beforehand."
      },
      {
        "t": "~てはいけない",
        "note": "禁止/不可:話し合っておくことも忘れてはいけない。",
        "t_en": "〜てはいけない",
        "note_en": "must not: you must not forget to talk it over."
      },
      {
        "t": "いざというとき",
        "note": "「緊要關頭、萬一時」慣用:いざというときに守る。",
        "t_en": "いざというとき",
        "note_en": "\"when it really matters / in an emergency.\""
      }
    ]
  },
  {
    "id": "a-n5-6",
    "level": "n5",
    "topic": "趣味",
    "topic_en": "Hobby",
    "title": "わたしの しゅみ",
    "title_zh": "我的興趣",
    "title_en": "My Hobby",
    "body": "わたしの しゅみは しゃしんを とる ことです。\nやすみの 日は カメラを もって、まちを あるきます。\nはなや とりの しゃしんを とります。\nきれいな しゃしんが とれた とき、とても うれしいです。\nときどき ともだちに しゃしんを おくります。\nともだちは 「じょうずですね」と いいます。\nあたらしい カメラが ほしいですが、たかいですから、いまは おかねを ためて います。",
    "trans": [
      "我的興趣是拍照。",
      "假日會帶著相機,在街上走走。",
      "拍花和鳥的照片。",
      "拍到漂亮的照片時,非常開心。",
      "有時候會把照片傳給朋友。",
      "朋友會說:「拍得真好呢。」",
      "雖然想要新相機,但因為很貴,現在正在存錢。"
    ],
    "trans_en": [
      "My hobby is taking photos.",
      "On my days off, I take my camera and walk around town.",
      "I take pictures of flowers and birds.",
      "When I get a beautiful shot, I feel really happy.",
      "Sometimes I send photos to my friends.",
      "My friends say, \"You're really good!\"",
      "I want a new camera, but it's expensive, so for now I'm saving money."
    ],
    "vocab": [
      {
        "w": "趣味",
        "r": "しゅみ",
        "m": "興趣、嗜好",
        "m_en": "hobby"
      },
      {
        "w": "写真",
        "r": "しゃしん",
        "m": "照片",
        "m_en": "photo"
      },
      {
        "w": "撮る",
        "r": "とる",
        "m": "拍(照)",
        "m_en": "to take (a photo)"
      },
      {
        "w": "歩く",
        "r": "あるく",
        "m": "走路、步行",
        "m_en": "to walk"
      },
      {
        "w": "送る",
        "r": "おくる",
        "m": "寄送、傳送",
        "m_en": "to send"
      },
      {
        "w": "貯める",
        "r": "ためる",
        "m": "存(錢)",
        "m_en": "to save (money)"
      }
    ],
    "grammar": [
      {
        "t": "しゅみは~ことです",
        "note": "「我的興趣是做~」:名詞化的こと收尾。しゅみは しゃしんを とる ことです。",
        "t_en": "しゅみは〜ことです",
        "note_en": "\"My hobby is (doing) ~\": nominalize the verb with こと."
      },
      {
        "t": "~とき",
        "note": "「~的時候」:とれた とき(拍到的時候)。",
        "id": "n5-59",
        "t_en": "〜とき",
        "note_en": "\"when ~\": とれた とき = when I managed to take (a good photo)."
      },
      {
        "t": "~が ほしい",
        "note": "「想要~(東西)」:カメラが ほしいです。想要的對象用が。",
        "t_en": "〜が ほしい",
        "note_en": "\"I want ~ (a thing)\": the desired object takes が."
      }
    ]
  },
  {
    "id": "a-n4-7",
    "level": "n4",
    "topic": "生活",
    "topic_en": "Life",
    "title": "ごみの出し方",
    "title_zh": "垃圾的丟法",
    "title_en": "How to Take Out the Trash",
    "body": "日本に住み始めて、一番驚いたのはごみの出し方です。\nごみは「燃えるごみ」「燃えないごみ」「資源ごみ」などに分けなければなりません。\n出す曜日も決まっていて、私の町では燃えるごみは月曜日と木曜日です。\n朝八時までに、決められた場所に出します。\n間違えると、ごみを持って行ってもらえないこともあります。\n最初は面倒だと思いましたが、慣れると難しくありません。\n分別のおかげで、町はいつもきれいです。",
    "trans": [
      "開始住在日本之後,最讓我驚訝的就是垃圾的丟法。",
      "垃圾必須分成「可燃垃圾」「不可燃垃圾」「資源垃圾」等等。",
      "丟垃圾的星期幾也是固定的,在我住的城鎮,可燃垃圾是星期一和星期四。",
      "要在早上八點之前,拿到指定的地點丟。",
      "如果分錯了,垃圾有時候會不被收走。",
      "一開始覺得很麻煩,但習慣之後就不難了。",
      "多虧了垃圾分類,城鎮總是很乾淨。"
    ],
    "trans_en": [
      "After I started living in Japan, what surprised me most was how to take out the trash.",
      "Trash must be separated into \"burnable,\" \"non-burnable,\" \"recyclable,\" and so on.",
      "The collection days are fixed, too — in my town, burnable trash goes out on Mondays and Thursdays.",
      "You take it to the designated spot by eight in the morning.",
      "If you sort it wrong, sometimes they won't take it away.",
      "At first I thought it was a hassle, but once you get used to it, it isn't hard.",
      "Thanks to the sorting system, the town is always clean."
    ],
    "vocab": [
      {
        "w": "驚く",
        "r": "おどろく",
        "m": "驚訝、吃驚",
        "m_en": "to be surprised"
      },
      {
        "w": "分ける",
        "r": "わける",
        "m": "分開、分類",
        "m_en": "to separate, to sort"
      },
      {
        "w": "決まる",
        "r": "きまる",
        "m": "被決定、固定",
        "m_en": "to be decided, to be fixed"
      },
      {
        "w": "間違える",
        "r": "まちがえる",
        "m": "弄錯",
        "m_en": "to make a mistake"
      },
      {
        "w": "面倒",
        "r": "めんどう",
        "m": "麻煩",
        "m_en": "troublesome, a hassle"
      },
      {
        "w": "慣れる",
        "r": "なれる",
        "m": "習慣",
        "m_en": "to get used to"
      },
      {
        "w": "分別",
        "r": "ぶんべつ",
        "m": "(垃圾)分類",
        "m_en": "sorting (trash)"
      }
    ],
    "grammar": [
      {
        "t": "~なければなりません",
        "note": "「必須~」:分けなければなりません(必須分類)。",
        "id": "n4-16",
        "t_en": "〜なければなりません",
        "note_en": "\"must ~\": 分けなければなりません = must sort."
      },
      {
        "t": "~までに",
        "note": "「在~之前(期限)」:朝八時までに出します。までに是期限,まで是持續。",
        "t_en": "〜までに",
        "note_en": "\"by ~ (deadline)\": までに marks a deadline; まで marks duration."
      },
      {
        "t": "~てもらえない",
        "note": "「無法讓對方為自己做~」:持って行ってもらえない(不被收走)。てもらう的可能否定形。",
        "id": "n3-69",
        "t_en": "〜てもらえない",
        "note_en": "\"can't get someone to do ~ for you\": potential-negative of てもらう."
      },
      {
        "t": "~おかげで",
        "note": "「多虧~、託~的福」:分別のおかげで、町はきれいです。",
        "id": "n3-6",
        "t_en": "〜おかげで",
        "note_en": "\"thanks to ~\": used for positive results."
      }
    ]
  },
  {
    "id": "a-n3-8",
    "level": "n3",
    "topic": "生活",
    "topic_en": "Life",
    "title": "日本で病院に行く",
    "title_zh": "在日本看醫生",
    "title_en": "Going to the Doctor in Japan",
    "body": "日本で初めて熱を出したとき、どうすればいいか分からなくて、とても不安だった。\n友達に相談すると、「まず近くの内科に行ったほうがいいよ」と教えてくれた。\n病院では、最初に保険証を出して、問診票に症状を書く。\n「いつから痛いですか」「アレルギーはありますか」など、聞かれることは大体決まっている。\n診察が終わると、処方箋をもらって、薬局で薬を受け取る。\n料金は思ったより安かった。保険に入っていれば、自分で払うのは三割だけだからだ。\n言葉が心配な人は、症状を紙に書いて見せるといい。伝える方法はいくらでもある。",
    "trans": [
      "在日本第一次發燒的時候,我不知道該怎麼辦,非常不安。",
      "找朋友商量,朋友告訴我:「先去附近的內科比較好喔。」",
      "在醫院,首先出示健保卡,然後在問診表上寫下症狀。",
      "「從什麼時候開始痛?」「有過敏嗎?」等等,會被問的問題大致上是固定的。",
      "看診結束後,拿到處方箋,再到藥局領藥。",
      "費用比想像中便宜。因為只要有加入健保,自己付的就只有三成。",
      "擔心語言不通的人,可以把症狀寫在紙上給醫生看。要把意思傳達出去,方法要多少有多少。"
    ],
    "trans_en": [
      "The first time I ran a fever in Japan, I had no idea what to do and felt really anxious.",
      "When I asked a friend, they told me, \"You should go to a nearby internal medicine clinic first.\"",
      "At the clinic, you first show your health insurance card, then write your symptoms on a questionnaire.",
      "\"Since when has it hurt?\" \"Do you have any allergies?\" — the questions they ask are mostly the same.",
      "After the examination, you get a prescription and pick up your medicine at a pharmacy.",
      "It cost less than I expected — if you're enrolled in health insurance, you only pay thirty percent yourself.",
      "If you're worried about the language, write your symptoms on paper and show them. There are plenty of ways to get your meaning across."
    ],
    "vocab": [
      {
        "w": "不安",
        "r": "ふあん",
        "m": "不安",
        "m_en": "anxious, uneasy"
      },
      {
        "w": "相談",
        "r": "そうだん",
        "m": "商量、諮詢",
        "m_en": "consultation"
      },
      {
        "w": "保険証",
        "r": "ほけんしょう",
        "m": "健保卡",
        "m_en": "health insurance card"
      },
      {
        "w": "症状",
        "r": "しょうじょう",
        "m": "症狀",
        "m_en": "symptom"
      },
      {
        "w": "診察",
        "r": "しんさつ",
        "m": "看診、診察",
        "m_en": "medical examination"
      },
      {
        "w": "処方箋",
        "r": "しょほうせん",
        "m": "處方箋",
        "m_en": "prescription"
      },
      {
        "w": "薬局",
        "r": "やっきょく",
        "m": "藥局",
        "m_en": "pharmacy"
      },
      {
        "w": "受け取る",
        "r": "うけとる",
        "m": "領取、收下",
        "m_en": "to receive, to pick up"
      }
    ],
    "grammar": [
      {
        "t": "~たほうがいい",
        "note": "「~比較好(建議)」:行ったほうがいい。",
        "id": "n4-11",
        "t_en": "〜たほうがいい",
        "note_en": "\"you should ~ / it's better to ~\": advice."
      },
      {
        "t": "~と(條件)",
        "note": "「一~就…」:相談すると、教えてくれた/診察が終わると。前句成立,後句自然接著發生。",
        "t_en": "〜と (conditional)",
        "note_en": "\"when/once ~\": the second clause follows naturally from the first."
      },
      {
        "t": "~より",
        "note": "「比~」:思ったより安かった(比想像中便宜)。",
        "t_en": "〜より",
        "note_en": "\"than ~\": 思ったより = than I expected."
      },
      {
        "t": "~といい",
        "note": "「~就好、建議~」:書いて見せるといい。",
        "t_en": "〜といい",
        "note_en": "\"it's a good idea to ~\": gentle suggestion."
      }
    ]
  },
  {
    "id": "a-n2-8",
    "level": "n2",
    "topic": "社会",
    "topic_en": "Society",
    "title": "地方移住という選択",
    "title_zh": "移居鄉間這個選項",
    "title_en": "Moving to the Countryside",
    "body": "最近、都会を離れて地方に移住する人が増えているという。\nリモートワークの普及によって、どこに住んでいても仕事ができるようになったことが大きい。\n家賃は都会の半分以下、通勤ラッシュとも無縁で、自然に囲まれた暮らしは魅力的に見える。\nしかし、移住は決して簡単なものではない。\n車がなければ生活できない地域も多く、医療や教育の面で不便を感じることもある。\n地域の人間関係に溶け込めるかどうかも、大きな課題だと言われている。\n大切なのは、理想だけで決めるのではなく、実際に何度か足を運んで、その土地の暮らしを確かめることだろう。",
    "trans": [
      "據說最近離開都市、移居鄉間的人越來越多。",
      "很大的原因是,隨著遠距工作的普及,不管住在哪裡都能工作了。",
      "房租不到都市的一半,又與通勤尖峰無緣,被大自然環繞的生活看起來很有魅力。",
      "但是,移居絕對不是件簡單的事。",
      "沒有車就無法生活的地區很多,在醫療和教育方面有時也會感到不便。",
      "能不能融入當地的人際關係,據說也是一大課題。",
      "重要的應該是:不要只憑理想做決定,而是實際多跑幾趟,親自確認那塊土地上的生活。"
    ],
    "trans_en": [
      "These days, more and more people are said to be leaving the city and moving to the countryside.",
      "A big reason is that with the spread of remote work, you can now work wherever you live.",
      "Rent is less than half of what it is in the city, there's no commuter rush, and a life surrounded by nature looks appealing.",
      "However, relocating is by no means easy.",
      "In many areas you can't get by without a car, and you may find healthcare and education inconvenient.",
      "Whether you can blend into the local community is also said to be a major challenge.",
      "What matters is not deciding on ideals alone, but actually visiting several times and seeing for yourself what life there is like."
    ],
    "vocab": [
      {
        "w": "移住",
        "r": "いじゅう",
        "m": "移居",
        "m_en": "migration, relocation"
      },
      {
        "w": "普及",
        "r": "ふきゅう",
        "m": "普及",
        "m_en": "spread, diffusion"
      },
      {
        "w": "家賃",
        "r": "やちん",
        "m": "房租",
        "m_en": "rent"
      },
      {
        "w": "無縁",
        "r": "むえん",
        "m": "無緣、不相干",
        "m_en": "unrelated, free from"
      },
      {
        "w": "溶け込む",
        "r": "とけこむ",
        "m": "融入",
        "m_en": "to blend in, to fit in"
      },
      {
        "w": "課題",
        "r": "かだい",
        "m": "課題、待解決的問題",
        "m_en": "challenge, issue"
      },
      {
        "w": "足を運ぶ",
        "r": "あしをはこぶ",
        "m": "親自前往、跑一趟",
        "m_en": "to go in person, to visit"
      },
      {
        "w": "確かめる",
        "r": "たしかめる",
        "m": "確認",
        "m_en": "to confirm, to make sure"
      }
    ],
    "grammar": [
      {
        "t": "~という(傳聞)",
        "note": "「據說~」:増えているという。句尾的という表示傳聞、引述。",
        "id": "n5-68",
        "t_en": "〜という (hearsay)",
        "note_en": "sentence-final という reports hearsay: \"it is said that ~.\""
      },
      {
        "t": "~によって",
        "note": "「由於~、隨著~」:普及によって~ようになった。表原因/手段。",
        "id": "n3-4",
        "t_en": "〜によって",
        "note_en": "\"due to / by means of ~\": cause or means."
      },
      {
        "t": "決して~ない",
        "note": "「絕對不~」:決して簡単なものではない。與否定呼應的副詞。",
        "t_en": "決して〜ない",
        "note_en": "\"by no means ~\": adverb that pairs with a negative."
      },
      {
        "t": "~かどうか",
        "note": "「是否~」:溶け込めるかどうか。",
        "id": "n4-43",
        "t_en": "〜かどうか",
        "note_en": "\"whether or not ~.\""
      },
      {
        "t": "~のではなく",
        "note": "「不是~而是…」:理想だけで決めるのではなく、実際に確かめる。",
        "t_en": "〜のではなく",
        "note_en": "\"not ~ but rather ...\""
      }
    ]
  },
  {
    "id": "a-n1-7",
    "level": "n1",
    "topic": "言語",
    "topic_en": "Language",
    "title": "変わりゆく日本語",
    "title_zh": "持續改變的日語",
    "title_en": "The Ever-Changing Japanese Language",
    "body": "「ら抜き言葉」という言葉を聞いたことがあるだろうか。\n「食べられる」を「食べれる」と言うような言い方で、正しくない日本語だと批判されることが多い。\nだが、言語学の立場から見れば、これは単なる「乱れ」ではなく、合理的な変化だという見方もある。\n「見られる」には受身・尊敬・可能という複数の意味があるが、「見れる」なら可能の意味だと一目で分かるからだ。\nそもそも、言葉は常に変化し続けてきた。\n今、私たちが「正しい」と信じている日本語も、百年前の人々から見れば乱れた言葉にほかならない。\n変化を嘆くより、なぜそう変わるのかを考えるほうが、言葉の本質に近づけるのではないだろうか。",
    "trans": [
      "你聽過「ら抜き言葉(去ら詞)」這個詞嗎?",
      "就是把「食べられる」說成「食べれる」這類說法,常被批評是不正確的日語。",
      "但從語言學的立場來看,也有一種觀點認為:這不是單純的「語言混亂」,而是一種合理的變化。",
      "因為「見られる」同時有被動、尊敬、可能等多種意思,而「見れる」的話,一眼就能看出是「能看」的意思。",
      "說到底,語言本來就一直在變化。",
      "如今我們深信「正確」的日語,在一百年前的人看來,也不外乎就是一種走樣的語言。",
      "與其感嘆變化,不如去思考「為什麼會這樣變」——這樣或許才更能接近語言的本質,不是嗎?"
    ],
    "trans_en": [
      "Have you ever heard of \"ra-nuki kotoba\" (ra-dropped words)?",
      "It refers to saying 食べれる instead of 食べられる — a usage often criticized as incorrect Japanese.",
      "From a linguistics standpoint, however, some see it not as mere \"corruption\" but as a rational change.",
      "見られる carries multiple meanings — passive, honorific, and potential — while 見れる can only mean \"can see,\" clear at a glance.",
      "Language, after all, has never stopped changing.",
      "Even the Japanese we now believe to be \"correct\" would be nothing other than corrupted speech in the eyes of people a hundred years ago.",
      "Rather than lamenting change, perhaps asking why it happens brings us closer to the true nature of language."
    ],
    "vocab": [
      {
        "w": "批判",
        "r": "ひはん",
        "m": "批評、批判",
        "m_en": "criticism"
      },
      {
        "w": "乱れ",
        "r": "みだれ",
        "m": "混亂、走樣",
        "m_en": "disorder, corruption (of language)"
      },
      {
        "w": "合理的",
        "r": "ごうりてき",
        "m": "合理的",
        "m_en": "rational"
      },
      {
        "w": "受身",
        "r": "うけみ",
        "m": "被動(語態)",
        "m_en": "passive (voice)"
      },
      {
        "w": "尊敬",
        "r": "そんけい",
        "m": "尊敬",
        "m_en": "respect, honorific"
      },
      {
        "w": "嘆く",
        "r": "なげく",
        "m": "感嘆、悲嘆",
        "m_en": "to lament"
      },
      {
        "w": "本質",
        "r": "ほんしつ",
        "m": "本質",
        "m_en": "essence, true nature"
      },
      {
        "w": "近づく",
        "r": "ちかづく",
        "m": "接近",
        "m_en": "to approach, to get closer"
      }
    ],
    "grammar": [
      {
        "t": "~にほかならない",
        "note": "「不外乎是~、正是~」:乱れた言葉にほかならない。斷定的書面語。",
        "id": "n2-56",
        "t_en": "〜にほかならない",
        "note_en": "\"is nothing other than ~\": emphatic, written style."
      },
      {
        "t": "~ゆく",
        "note": "「逐漸~(書面語)」:変わりゆく日本語。ていく的文語形,表持續變化。",
        "t_en": "〜ゆく",
        "note_en": "literary form of ていく: gradual, ongoing change."
      },
      {
        "t": "単なる~ではなく",
        "note": "「不是單純的~」:単なる「乱れ」ではなく、合理的な変化。",
        "t_en": "単なる〜ではなく",
        "note_en": "\"not merely ~ (but ...).\""
      },
      {
        "t": "~のではないだろうか",
        "note": "「不是~嗎(委婉主張)」:近づけるのではないだろうか。以反問委婉表達意見。",
        "t_en": "〜のではないだろうか",
        "note_en": "\"isn't it that ~?\": soft assertion via rhetorical question."
      }
    ]
  },
  {
    "id": "a-n5-7",
    "level": "n5",
    "topic": "生活",
    "title": "ゆうびんきょくで にもつを おくる",
    "title_zh": "在郵局寄包裹",
    "body": "きょうは ゆうびんきょくへ にもつを おくりに いきます。\nまど口で 「これを 台湾へ おねがいします」と いいます。\n係の人が 「船便ですか、航空便ですか」と ききました。\n船便は やすいですが、一か月ぐらい かかります。航空便は 早いですが、たかいです。\nわたしは 航空便を えらびました。用紙に 名前と じゅうしょを 書いてから、お金を はらいます。\n「いつ とどきますか」と きくと、「一週間ぐらいです」と おしえて くれました。\nかえりに コンビニで きってを 買って、はがきも 出しました。",
    "trans": [
      "今天我要去郵局寄包裹。",
      "在櫃台說「這個要寄到台灣,麻煩你」。",
      "櫃台人員問我「要船運還是空運?」。",
      "船運便宜,但要花一個月左右。空運快,但比較貴。",
      "我選了空運。在表格上寫完名字和地址後,再付錢。",
      "我問「什麼時候會到?」,對方告訴我「大概一個星期」。",
      "回程在便利商店買了郵票,也寄了明信片。"
    ],
    "vocab": [
      {
        "w": "郵便局",
        "r": "ゆうびんきょく",
        "m": "郵局",
        "m_en": "post office"
      },
      {
        "w": "荷物",
        "r": "にもつ",
        "m": "行李、包裹",
        "m_en": "package, luggage"
      },
      {
        "w": "窓口",
        "r": "まどぐち",
        "m": "櫃台",
        "m_en": "service counter"
      },
      {
        "w": "船便",
        "r": "ふなびん",
        "m": "船運",
        "m_en": "sea mail"
      },
      {
        "w": "航空便",
        "r": "こうくうびん",
        "m": "空運",
        "m_en": "air mail"
      },
      {
        "w": "用紙",
        "r": "ようし",
        "m": "表格、紙張",
        "m_en": "form"
      },
      {
        "w": "住所",
        "r": "じゅうしょ",
        "m": "地址",
        "m_en": "address"
      },
      {
        "w": "切手",
        "r": "きって",
        "m": "郵票",
        "m_en": "stamp"
      },
      {
        "w": "届く",
        "r": "とどく",
        "m": "送達",
        "m_en": "to arrive, be delivered"
      }
    ],
    "grammar": [
      {
        "t": "～てから",
        "note": "先做完前項再做後項。「書いてから はらいます」=寫完才付錢,順序很清楚。",
        "id": "n5-54",
        "t_en": "～てから",
        "note_en": "Do the second action after finishing the first: 書いてから はらいます = pay after filling it in."
      },
      {
        "t": "～と いいます／ききます",
        "note": "引用說過或問過的話,把整句放在「と」前面:「これを おねがいします」と いいます。",
        "id": "n5-38",
        "t_en": "～と いいます / ききます",
        "note_en": "Quote what was said or asked by putting the whole sentence before と."
      },
      {
        "t": "～に いきます(目的)",
        "note": "動詞ます形去ます+に いきます=去做某事。「おくりに いきます」=去寄(東西)。",
        "id": "n5-31",
        "t_en": "～に いきます (purpose)",
        "note_en": "Verb stem + に いきます = go somewhere to do something: おくりに いきます = go to send it."
      }
    ],
    "title_en": "Sending a Package at the Post Office",
    "topic_en": "Daily life",
    "trans_en": [
      "Today I'm going to the post office to send a package.",
      "At the counter I say, “This one to Taiwan, please.”",
      "The clerk asked, “Sea mail or air mail?”",
      "Sea mail is cheap but takes about a month. Air mail is fast but expensive.",
      "I chose air mail. After writing my name and address on the form, I pay.",
      "When I asked “When will it arrive?”, they told me “About a week.”",
      "On the way home I bought stamps at the convenience store and mailed a postcard too."
    ]
  },
  {
    "id": "a-n4-8",
    "level": "n4",
    "topic": "生活",
    "title": "区役所での手続き",
    "title_zh": "在區公所辦手續",
    "body": "引っ越しをしたら、十四日以内に 区役所へ 行かなければなりません。\n窓口で「転入届を出したいんですが」と言うと、番号札をもらいました。\n名前を呼ばれるまで、椅子に座って待ちます。待っている間に、書類に住所と生年月日を書いておきました。\n係の人は在留カードを見てから、裏に新しい住所を書いてくれました。\n同じ日に国民健康保険の手続きもできます。窓口が違うので、一階から二階へ移動しました。\n全部終わるまで一時間ぐらいかかりましたが、日本語だけで手続きができて、少し自信がつきました。\n分からないことがあれば、遠慮しないで聞いたほうがいいです。係の人はゆっくり話してくれます。",
    "trans": [
      "搬家之後,十四天內必須去區公所。",
      "在櫃台說「我想辦遷入登記」,就拿到了號碼牌。",
      "在被叫到名字之前,坐在椅子上等。等待的期間,我先在文件上寫好住址和出生年月日。",
      "承辦人員看過在留卡後,幫我在背面寫上新住址。",
      "同一天也可以辦國民健康保險的手續。因為窗口不同,我從一樓移動到二樓。",
      "全部辦完花了大約一小時,不過能只用日文辦好手續,讓我稍微有了自信。",
      "如果有不懂的地方,不要客氣直接問比較好。承辦人員會放慢速度說話。"
    ],
    "vocab": [
      {
        "w": "区役所",
        "r": "くやくしょ",
        "m": "區公所",
        "m_en": "ward office"
      },
      {
        "w": "手続き",
        "r": "てつづき",
        "m": "手續",
        "m_en": "procedure, paperwork"
      },
      {
        "w": "転入届",
        "r": "てんにゅうとどけ",
        "m": "遷入登記",
        "m_en": "move-in notification"
      },
      {
        "w": "番号札",
        "r": "ばんごうふだ",
        "m": "號碼牌",
        "m_en": "number ticket"
      },
      {
        "w": "書類",
        "r": "しょるい",
        "m": "文件",
        "m_en": "documents"
      },
      {
        "w": "生年月日",
        "r": "せいねんがっぴ",
        "m": "出生年月日",
        "m_en": "date of birth"
      },
      {
        "w": "在留カード",
        "r": "ざいりゅうカード",
        "m": "在留卡",
        "m_en": "residence card"
      },
      {
        "w": "国民健康保険",
        "r": "こくみんけんこうほけん",
        "m": "國民健康保險",
        "m_en": "national health insurance"
      },
      {
        "w": "遠慮する",
        "r": "えんりょする",
        "m": "客氣、顧慮",
        "m_en": "to hold back, be reserved"
      }
    ],
    "grammar": [
      {
        "t": "～なければなりません",
        "note": "表示義務、非做不可。「十四日以内に行かなければなりません」=十四天內非去不可,是規定。",
        "id": "n4-16",
        "t_en": "～なければなりません",
        "note_en": "Expresses obligation: you must do it. Used here for a legal deadline."
      },
      {
        "t": "～ておく",
        "note": "事先做好準備。「書いておきました」=趁等待時先寫好,等一下就不用慌。",
        "id": "n4-30",
        "t_en": "～ておく",
        "note_en": "Do something in advance in preparation: 書いておきました = filled it in beforehand."
      },
      {
        "t": "～てくれる",
        "note": "別人為我做某事,帶有感謝的語感。「書いてくれました」=(對方)幫我寫。",
        "id": "n5-51",
        "t_en": "～てくれる",
        "note_en": "Someone does something for me — carries a sense of gratitude."
      }
    ],
    "title_en": "Paperwork at the Ward Office",
    "topic_en": "Daily life",
    "trans_en": [
      "After moving, you must go to the ward office within fourteen days.",
      "When I said at the counter, “I'd like to submit a move-in notification,” I was given a number ticket.",
      "I sit and wait until my name is called. While waiting, I filled in my address and date of birth on the form in advance.",
      "After checking my residence card, the clerk wrote my new address on the back for me.",
      "You can also enroll in national health insurance the same day. The counter is different, so I moved from the first floor to the second.",
      "It took about an hour in total, but being able to do it all in Japanese gave me a bit of confidence.",
      "If there's anything you don't understand, it's better to just ask. The staff will speak slowly for you."
    ]
  },
  {
    "id": "a-n3-9",
    "level": "n3",
    "topic": "生活",
    "title": "日本で部屋を探す",
    "title_zh": "在日本找房子",
    "body": "日本で部屋を借りるのは、思っていたより手間がかかる。\nまず不動産屋に行き、家賃の予算と希望の場所を伝える。駅から徒歩十分以内、という条件をつけると、家賃は一気に上がる。\n気に入った部屋が見つかっても、すぐには決められない。敷金・礼金・仲介手数料など、最初にまとまったお金が必要になるからだ。\n外国人の場合、保証人を求められることが多い。最近は保証会社を使うほうが一般的で、家賃の半分ほどを払って契約する。\n審査に通るように、勤務先や収入がわかる書類をそろえておいたほうがいい。\n内見のときは、日当たりや騒音だけでなく、洗濯機を置く場所やコンセントの数も確認するといい。写真ではわからない部分こそ、実際に見る意味がある。\n面倒に思えるが、この手順を知っているだけで、次の引っ越しはずっと楽になるはずだ。",
    "trans": [
      "在日本租房子,比想像中還要費工夫。",
      "首先去房仲,告訴對方房租預算和希望的地點。一加上「離車站步行十分鐘以內」這種條件,房租就會一口氣往上跳。",
      "就算找到喜歡的房間,也沒辦法馬上決定。因為押金、禮金、仲介手續費等等,一開始就需要一筆錢。",
      "外國人的話,常常會被要求提供保證人。最近使用保證公司比較普遍,付大約半個月房租來簽約。",
      "為了順利通過審查,最好事先備齊能證明工作單位和收入的文件。",
      "看房的時候,不只採光和噪音,連洗衣機的擺放位置和插座數量也一起確認會比較好。正因為有照片看不出來的部分,才有實際去看的意義。",
      "雖然覺得麻煩,但光是知道這套流程,下次搬家就會輕鬆很多。"
    ],
    "vocab": [
      {
        "w": "不動産屋",
        "r": "ふどうさんや",
        "m": "房仲",
        "m_en": "real estate agency"
      },
      {
        "w": "家賃",
        "r": "やちん",
        "m": "房租",
        "m_en": "rent"
      },
      {
        "w": "敷金",
        "r": "しききん",
        "m": "押金",
        "m_en": "security deposit"
      },
      {
        "w": "礼金",
        "r": "れいきん",
        "m": "禮金(不退還)",
        "m_en": "key money (non-refundable)"
      },
      {
        "w": "仲介手数料",
        "r": "ちゅうかいてすうりょう",
        "m": "仲介手續費",
        "m_en": "agency fee"
      },
      {
        "w": "保証人",
        "r": "ほしょうにん",
        "m": "保證人",
        "m_en": "guarantor"
      },
      {
        "w": "審査",
        "r": "しんさ",
        "m": "審查",
        "m_en": "screening, review"
      },
      {
        "w": "内見",
        "r": "ないけん",
        "m": "看房",
        "m_en": "viewing a property"
      },
      {
        "w": "日当たり",
        "r": "ひあたり",
        "m": "採光",
        "m_en": "sunlight exposure"
      },
      {
        "w": "手間がかかる",
        "r": "てまがかかる",
        "m": "費工夫",
        "m_en": "to take effort"
      }
    ],
    "grammar": [
      {
        "t": "～ように(目的)",
        "note": "表示希望達成的狀態,前面多接可能形或無意志動詞。「審査に通るように」=為了(能)通過審查。",
        "id": "n3-39",
        "t_en": "～ように (purpose)",
        "note_en": "States a desired outcome; often follows a potential or non-volitional verb: 通るように = so that it passes."
      },
      {
        "t": "～ほうがいい",
        "note": "建議。「そろえておいたほうがいい」=最好事先備齊,語氣比命令柔和但很明確。",
        "id": "n4-17",
        "t_en": "～ほうがいい",
        "note_en": "Advice: 〜たほうがいい suggests the better course of action."
      },
      {
        "t": "～こそ",
        "note": "強調正是這個。「わからない部分こそ」=正因為是看不出來的部分(才重要)。",
        "id": "n3-41",
        "t_en": "～こそ",
        "note_en": "Emphasis: “it is precisely this” — わからない部分こそ = precisely the parts you can't tell."
      }
    ],
    "title_en": "Finding an Apartment in Japan",
    "topic_en": "Daily life",
    "trans_en": [
      "Renting a place in Japan takes more effort than I expected.",
      "First you go to a real estate agency and tell them your rent budget and preferred area. Add the condition “within a ten-minute walk of a station” and the rent jumps immediately.",
      "Even when you find a place you like, you can't decide right away — because deposits, key money and agency fees mean you need a lump sum up front.",
      "Foreign residents are often asked for a guarantor. These days it's more common to use a guarantor company, paying about half a month's rent to sign.",
      "So that you pass the screening, it's best to prepare documents showing your employer and income in advance.",
      "At a viewing, check not only sunlight and noise but also where the washing machine goes and how many outlets there are. It's exactly the parts photos can't show that make visiting worthwhile.",
      "It sounds like a hassle, but just knowing this process makes your next move far easier."
    ]
  },
  {
    "id": "a-n2-9",
    "level": "n2",
    "topic": "社会",
    "title": "在留資格の更新という関門",
    "title_zh": "在留資格更新這道關卡",
    "body": "日本で暮らす外国人にとって、在留資格の更新は避けて通れない関門である。\n期限の三か月前から申請できるが、書類の準備に時間がかかるため、早めに動くに越したことはない。\n必要なのは、申請書のほかに、住民税の課税証明書と納税証明書、在職証明書など。転職したばかりの人は、雇用契約書も求められることがある。\n審査では、収入が安定しているか、税金や年金をきちんと納めているかが見られる。\nつまり、日々の手続きを後回しにしてきたつけが、この時期にまとめて回ってくるというわけだ。\n入管の窓口は混み合うので、オンライン申請を利用する人も増えている。それに伴い、手続きの流れも少しずつ変わりつつある。\n結果が出るまでの数週間は落ち着かないが、必要な書類をそろえ、正直に申告していれば、過度に恐れることはない。",
    "trans": [
      "對在日本生活的外國人來說,在留資格的更新是一道避不開的關卡。",
      "雖然期限前三個月就能申請,但因為準備文件很花時間,早點行動絕對沒有壞處。",
      "需要的除了申請書之外,還有住民稅的課稅證明、納稅證明、在職證明等等。剛換工作的人,有時還會被要求提供僱用契約書。",
      "審查時會看收入是否穩定、稅金和年金是否確實繳納。",
      "也就是說,平時把手續一直往後拖的代價,會在這個時期一次算總帳。",
      "入管的窗口很擁擠,因此使用線上申請的人也在增加。隨之而來,手續的流程也正一點一點地改變。",
      "在結果出來前的幾個星期會靜不下心,但只要備齊必要文件、誠實申報,就不需要過度害怕。"
    ],
    "vocab": [
      {
        "w": "在留資格",
        "r": "ざいりゅうしかく",
        "m": "在留資格(簽證)",
        "m_en": "residence status"
      },
      {
        "w": "更新",
        "r": "こうしん",
        "m": "更新",
        "m_en": "renewal"
      },
      {
        "w": "関門",
        "r": "かんもん",
        "m": "關卡、難關",
        "m_en": "hurdle, barrier"
      },
      {
        "w": "課税証明書",
        "r": "かぜいしょうめいしょ",
        "m": "課稅證明",
        "m_en": "tax assessment certificate"
      },
      {
        "w": "納税証明書",
        "r": "のうぜいしょうめいしょ",
        "m": "納稅證明",
        "m_en": "tax payment certificate"
      },
      {
        "w": "在職証明書",
        "r": "ざいしょくしょうめいしょ",
        "m": "在職證明",
        "m_en": "certificate of employment"
      },
      {
        "w": "入管",
        "r": "にゅうかん",
        "m": "入國管理局",
        "m_en": "immigration bureau"
      },
      {
        "w": "申告",
        "r": "しんこく",
        "m": "申報",
        "m_en": "declaration, filing"
      },
      {
        "w": "つけが回る",
        "r": "つけがまわる",
        "m": "付出代價、算總帳",
        "m_en": "to pay the price later"
      }
    ],
    "grammar": [
      {
        "t": "～に越したことはない",
        "note": "「沒有比…更好的了」,表示某做法最保險。「早めに動くに越したことはない」=越早行動越好。",
        "id": "n2-18",
        "t_en": "～に越したことはない",
        "note_en": "“Nothing beats doing X” — the safest course of action."
      },
      {
        "t": "～というわけだ",
        "note": "從前面推導出結論。「回ってくるというわけだ」=也就是說,結果會這樣。",
        "id": "n3-41",
        "t_en": "～というわけだ",
        "note_en": "Draws a conclusion from what precedes: “that is to say…”"
      },
      {
        "t": "～に伴って／それに伴い",
        "note": "隨著某變化,另一件事也跟著變。「それに伴い、流れも変わりつつある」=隨之流程也在改變。",
        "id": "n2-50",
        "t_en": "～に伴って / それに伴い",
        "note_en": "As one thing changes, another follows along with it."
      },
      {
        "t": "～つつある",
        "note": "正在持續變化中,比「ている」更書面。「変わりつつある」=正逐漸改變。",
        "id": "n2-33",
        "t_en": "～つつある",
        "note_en": "Indicates a gradual, ongoing change; more formal than ～ている."
      }
    ],
    "title_en": "Renewing Your Residence Status",
    "topic_en": "Society",
    "trans_en": [
      "For foreigners living in Japan, renewing your residence status is a hurdle you cannot avoid.",
      "You can apply from three months before it expires, and since gathering documents takes time, moving early is always better.",
      "Besides the application form you need a tax assessment certificate, a tax payment certificate, a certificate of employment and so on. Those who just changed jobs may also be asked for their employment contract.",
      "The screening looks at whether your income is stable and whether you have properly paid your taxes and pension.",
      "In other words, the price of putting off everyday paperwork comes due all at once at this moment.",
      "Immigration counters are crowded, so more people are using online applications — and with that, the procedure itself is gradually changing.",
      "The few weeks until the result arrives are unsettling, but if you have the documents and declare honestly, there is no need to be overly afraid."
    ]
  },
  {
    "id": "a-n1-8",
    "level": "n1",
    "topic": "社会",
    "title": "外国人材と日本社会のこれから",
    "title_zh": "外國人才與日本社會的未來",
    "body": "人手不足が構造的な問題となった今、外国人材の受け入れは、もはや一時しのぎの策とは言えない段階に入っている。\n特定技能や高度人材といった制度が整えられ、在留者数は過去最多を更新し続けている。しかし数の増加が、そのまま定着を意味するわけではない。\n言葉の壁、住まいの確保、子どもの教育——生活の基盤が整わなければ、どれほど待遇を改善したところで、人は根を下ろさない。\n企業ともなると、採用した後の日本語教育や、地域社会とのつながりづくりまで担う必要が出てくる。\n受け入れる側の意識もまた問われている。「労働力」としてではなく、同じ地域に暮らす隣人として向き合えるかどうか。\n制度のいかんによらず、最後に定着を左右するのは、日々の関係の積み重ねなのだろう。\n外国人材の議論は、実のところ、日本社会がどのような共同体でありたいかという問いと表裏一体なのである。",
    "trans": [
      "在人手不足已成為結構性問題的現在,接納外國人才,已經進入不能再說是權宜之計的階段。",
      "特定技能、高度人才等制度陸續建立,在留人數也持續刷新歷史新高。然而數量的增加,並不直接等於留得下來。",
      "語言的隔閡、住處的確保、孩子的教育——生活的根基若沒打好,無論待遇改善到什麼程度,人都不會扎根。",
      "若是企業,錄用之後還必須承擔日語教育、以及與地方社群建立連結等責任。",
      "接納一方的意識同樣受到檢視。能不能不把對方當成「勞動力」,而是當作住在同一個地區的鄰居來面對。",
      "無論制度如何,最後左右能否留下的,恐怕還是日常關係的一點一滴累積。",
      "關於外國人才的討論,其實與「日本社會想成為什麼樣的共同體」這個提問,是一體兩面的。"
    ],
    "vocab": [
      {
        "w": "人手不足",
        "r": "ひとでぶそく",
        "m": "人手不足",
        "m_en": "labor shortage"
      },
      {
        "w": "受け入れ",
        "r": "うけいれ",
        "m": "接納",
        "m_en": "acceptance, taking in"
      },
      {
        "w": "一時しのぎ",
        "r": "いちじしのぎ",
        "m": "權宜之計",
        "m_en": "stopgap measure"
      },
      {
        "w": "特定技能",
        "r": "とくていぎのう",
        "m": "特定技能(簽證類別)",
        "m_en": "Specified Skilled Worker visa"
      },
      {
        "w": "定着",
        "r": "ていちゃく",
        "m": "扎根、留下",
        "m_en": "settling, taking root"
      },
      {
        "w": "待遇",
        "r": "たいぐう",
        "m": "待遇",
        "m_en": "treatment, working conditions"
      },
      {
        "w": "根を下ろす",
        "r": "ねをおろす",
        "m": "扎根",
        "m_en": "to put down roots"
      },
      {
        "w": "表裏一体",
        "r": "ひょうりいったい",
        "m": "一體兩面",
        "m_en": "two sides of the same coin"
      },
      {
        "w": "問われる",
        "r": "とわれる",
        "m": "被檢視、被追問",
        "m_en": "to be called into question"
      }
    ],
    "grammar": [
      {
        "t": "～ともなると",
        "note": "到了某個層級就會不一樣。「企業ともなると」=若是到了企業這個層級,責任就更多。",
        "id": "n1-47",
        "t_en": "～ともなると",
        "note_en": "Once you reach a certain level or status, things change accordingly."
      },
      {
        "t": "～いかんによらず",
        "note": "不管前項如何都不影響結果。「制度のいかんによらず」=無論制度怎樣。",
        "id": "n1-66",
        "t_en": "～いかんによらず",
        "note_en": "Regardless of how X turns out; the result is unaffected."
      },
      {
        "t": "～たところで",
        "note": "就算做了也沒用,後接否定結果。「改善したところで、根を下ろさない」=就算改善也不會扎根。",
        "id": "n1-30",
        "t_en": "～たところで",
        "note_en": "Even if you do X, the result won't change (followed by a negative outcome)."
      },
      {
        "t": "～わけではない",
        "note": "部分否定。「定着を意味するわけではない」=並不等於就會留下來。",
        "id": "n3-41",
        "t_en": "～わけではない",
        "note_en": "Partial negation: it doesn't necessarily mean that…"
      }
    ],
    "title_en": "Foreign Workers and the Future of Japanese Society",
    "topic_en": "Society",
    "trans_en": [
      "Now that the labor shortage has become a structural problem, accepting foreign workers has entered a stage where it can no longer be called a stopgap.",
      "Systems such as the Specified Skilled Worker and Highly Skilled Professional visas have been put in place, and the resident population keeps hitting record highs. Yet an increase in numbers does not in itself mean people stay.",
      "The language barrier, securing housing, schooling for children — if the foundations of daily life are not in place, people will not put down roots no matter how much conditions improve.",
      "For companies, responsibility extends beyond hiring to Japanese-language education and building ties with the local community.",
      "The mindset of the receiving side is being questioned too: can we face these people not as “labor” but as neighbors living in the same community?",
      "Regardless of the system, what ultimately determines whether people stay is probably the accumulation of everyday relationships.",
      "The debate over foreign workers is, in truth, two sides of the same coin as the question of what kind of community Japanese society wants to be."
    ]
  },
  {
    "id": "a-n5-8",
    "level": "n5",
    "topic": "生活",
    "title": "ぎんこうで こうざを つくる",
    "title_zh": "在銀行開戶",
    "body": "きょうは ぎんこうへ こうざを つくりに いきます。\nまど口の 人が「ざいりゅうカードと いんかんを おねがいします」と いいました。\nわたしは かばんから カードと いんかんを 出しました。\n用紙に なまえと じゅうしょと でんわばんごうを 書きます。かんじが むずかしいので、ゆっくり 書きました。\n「キャッシュカードは 二週間ぐらいで うちに とどきます」と おしえて くれました。\nつうちょうは その日に もらえました。はじめての 日本の つうちょうです。\nすこし きんちょうしましたが、日本語だけで できて うれしかったです。",
    "trans": [
      "今天我要去銀行開戶。",
      "櫃台的人說「請給我在留卡和印章」。",
      "我從包包裡拿出卡片和印章。",
      "在表格上寫名字、地址和電話號碼。因為漢字很難,我慢慢地寫。",
      "對方告訴我「提款卡大概兩個星期會寄到家裡」。",
      "存摺當天就拿到了。這是我第一本日本的存摺。",
      "雖然有點緊張,但能只用日文辦好,很開心。"
    ],
    "vocab": [
      {
        "w": "銀行",
        "r": "ぎんこう",
        "m": "銀行",
        "m_en": "bank"
      },
      {
        "w": "口座",
        "r": "こうざ",
        "m": "帳戶",
        "m_en": "bank account"
      },
      {
        "w": "印鑑",
        "r": "いんかん",
        "m": "印章",
        "m_en": "personal seal"
      },
      {
        "w": "用紙",
        "r": "ようし",
        "m": "表格",
        "m_en": "form"
      },
      {
        "w": "電話番号",
        "r": "でんわばんごう",
        "m": "電話號碼",
        "m_en": "phone number"
      },
      {
        "w": "通帳",
        "r": "つうちょう",
        "m": "存摺",
        "m_en": "bankbook"
      },
      {
        "w": "届く",
        "r": "とどく",
        "m": "送達",
        "m_en": "to arrive"
      },
      {
        "w": "緊張する",
        "r": "きんちょうする",
        "m": "緊張",
        "m_en": "to be nervous"
      }
    ],
    "grammar": [
      {
        "t": "～に いきます(目的)",
        "note": "動詞ます形去ます+に いきます=去做某事。「こうざを つくりに いきます」=去開戶。",
        "id": "n5-31",
        "t_en": "～に いきます (purpose)",
        "note_en": "Verb stem + に いきます = go somewhere to do something."
      },
      {
        "t": "～と いいました",
        "note": "引用別人說的話,整句放在「と」前面。",
        "id": "n5-38",
        "t_en": "～と いいました",
        "note_en": "Quotes what someone said; the quoted sentence goes before と."
      },
      {
        "t": "～てくれる",
        "note": "別人為我做某事,含感謝語感。「おしえて くれました」=(對方)告訴了我。",
        "id": "n5-51",
        "t_en": "～てくれる",
        "note_en": "Someone does something for me — implies gratitude."
      }
    ],
    "title_en": "Opening a Bank Account",
    "topic_en": "Daily life",
    "trans_en": [
      "Today I'm going to the bank to open an account.",
      "The person at the counter said, “Your residence card and seal, please.”",
      "I took the card and seal out of my bag.",
      "I write my name, address and phone number on the form. The kanji are hard, so I wrote slowly.",
      "They told me, “Your cash card will arrive at your home in about two weeks.”",
      "I received the bankbook the same day — my first Japanese bankbook.",
      "I was a little nervous, but managing it all in Japanese felt great."
    ]
  },
  {
    "id": "a-n4-9",
    "level": "n4",
    "topic": "生活",
    "title": "歯医者へ行く",
    "title_zh": "去看牙醫",
    "body": "三日前から歯が痛くなったので、近くの歯医者に予約をしました。\n受付で保険証を出すと、問診票を書くように言われました。いつから痛いか、冷たい物がしみるかなどを書きます。\n先生は「虫歯が一本ありますね」と言って、レントゲンを見せてくれました。\n今日は削って薬を入れるだけで、来週もう一度来てくださいと言われました。\n治療のあと、歯みがきの仕方も教えてもらいました。強く磨きすぎると、歯ぐきを傷めてしまうそうです。\n日本の歯医者は何回も通わなければなりませんが、そのぶん丁寧に治してくれます。\n痛くなる前に、半年に一度は検診に行ったほうがいいと思いました。",
    "trans": [
      "因為三天前開始牙痛,我跟附近的牙醫預約了。",
      "在櫃台出示健保卡後,被要求填問診表。要寫從什麼時候開始痛、碰到冷的會不會敏感等等。",
      "醫生說「有一顆蛀牙呢」,還讓我看了 X 光片。",
      "今天只有磨掉並填藥,他說下週請再來一次。",
      "治療之後,他也教了我刷牙的方法。聽說刷得太用力,會傷到牙齦。",
      "日本的牙醫必須跑好幾趟,但相對地會很仔細地幫你治好。",
      "我覺得在痛起來之前,最好半年去檢查一次。"
    ],
    "vocab": [
      {
        "w": "歯医者",
        "r": "はいしゃ",
        "m": "牙醫",
        "m_en": "dentist"
      },
      {
        "w": "予約",
        "r": "よやく",
        "m": "預約",
        "m_en": "appointment"
      },
      {
        "w": "保険証",
        "r": "ほけんしょう",
        "m": "健保卡",
        "m_en": "insurance card"
      },
      {
        "w": "問診票",
        "r": "もんしんひょう",
        "m": "問診表",
        "m_en": "medical questionnaire"
      },
      {
        "w": "しみる",
        "r": "しみる",
        "m": "(冷熱)刺痛、敏感",
        "m_en": "to sting, feel sensitive"
      },
      {
        "w": "虫歯",
        "r": "むしば",
        "m": "蛀牙",
        "m_en": "cavity"
      },
      {
        "w": "治療",
        "r": "ちりょう",
        "m": "治療",
        "m_en": "treatment"
      },
      {
        "w": "歯ぐき",
        "r": "はぐき",
        "m": "牙齦",
        "m_en": "gums"
      },
      {
        "w": "検診",
        "r": "けんしん",
        "m": "健康檢查",
        "m_en": "check-up"
      }
    ],
    "grammar": [
      {
        "t": "～ように言われる",
        "note": "被要求做某事(間接指示)。「書くように言われました」=被要求填寫。",
        "id": "n4-30",
        "t_en": "～ように言われる",
        "note_en": "To be told/asked to do something (indirect instruction)."
      },
      {
        "t": "～そうです(傳聞)",
        "note": "聽說。「傷めてしまうそうです」=聽說會傷到,消息來自別人。",
        "id": "n4-3",
        "t_en": "～そうです (hearsay)",
        "note_en": "“I hear that…” — reports information from another source."
      },
      {
        "t": "～なければなりません",
        "note": "必須。「通わなければなりません」=非跑好幾趟不可。",
        "id": "n4-16",
        "t_en": "～なければなりません",
        "note_en": "Expresses obligation: must do it."
      }
    ],
    "title_en": "A Trip to the Dentist",
    "topic_en": "Daily life",
    "trans_en": [
      "My tooth started hurting three days ago, so I booked an appointment at a nearby dental clinic.",
      "When I handed over my insurance card at reception, they asked me to fill in a questionnaire: when the pain started, whether cold things sting, and so on.",
      "The dentist said, “You have one cavity,” and showed me the X-ray.",
      "Today they only drilled it and put in medicine, and asked me to come again next week.",
      "After the treatment they also taught me how to brush properly — apparently brushing too hard damages your gums.",
      "Dentists in Japan require several visits, but in exchange they treat you thoroughly.",
      "I decided it is better to go for a check-up every six months, before anything starts to hurt."
    ]
  },
  {
    "id": "a-n3-10",
    "level": "n3",
    "topic": "生活",
    "title": "ゴミ出しのルール",
    "title_zh": "丟垃圾的規矩",
    "body": "日本で暮らし始めて、最初に戸惑ったのがゴミの分け方だった。\n燃えるゴミ、燃えないゴミ、資源ゴミ——区によって分類も回収日も違う。引っ越したら、まず市役所でもらえる一覧表を確認したほうがいい。\nペットボトルは、ラベルとキャップを外し、中を軽くすすいでから出す。面倒に思えるが、そのひと手間で再利用できるかどうかが決まるらしい。\n出す時間にも決まりがあり、多くの地域では当日の朝八時までとされている。前の晩に出すと、カラスに荒らされることがあるからだ。\n粗大ゴミは事前に電話やネットで申し込み、コンビニでシールを買って貼っておく。これを知らずに置いてしまい、注意された人も少なくない。\n最初は細かすぎると感じたが、住んでいるうちに慣れてきた。\nゴミの出し方は、その地域で暮らすための最初の「共通ルール」なのかもしれない。",
    "trans": [
      "開始在日本生活後,最先讓我困惑的就是垃圾的分法。",
      "可燃垃圾、不可燃垃圾、資源回收——分類方式和回收日各區都不同。搬家後,最好先確認市役所發的分類表。",
      "寶特瓶要拆掉標籤和瓶蓋,裡面稍微沖一下再丟。雖然覺得麻煩,但據說就是這道小工序決定了能不能再利用。",
      "丟的時間也有規定,多數地區是當天早上八點以前。因為前一天晚上丟出去,可能會被烏鴉翻。",
      "大型垃圾要事先用電話或網路申請,再到便利商店買貼紙貼上。不知道這件事就直接放出去而被提醒的人也不少。",
      "一開始覺得太瑣碎,但住著住著就習慣了。",
      "丟垃圾的方式,或許就是在那個地區生活的第一條「共同規則」。"
    ],
    "vocab": [
      {
        "w": "戸惑う",
        "r": "とまどう",
        "m": "困惑、不知所措",
        "m_en": "to be at a loss"
      },
      {
        "w": "分類",
        "r": "ぶんるい",
        "m": "分類",
        "m_en": "sorting, classification"
      },
      {
        "w": "資源ゴミ",
        "r": "しげんゴミ",
        "m": "資源回收",
        "m_en": "recyclables"
      },
      {
        "w": "一覧表",
        "r": "いちらんひょう",
        "m": "一覽表",
        "m_en": "reference chart"
      },
      {
        "w": "すすぐ",
        "r": "すすぐ",
        "m": "沖洗",
        "m_en": "to rinse"
      },
      {
        "w": "ひと手間",
        "r": "ひとてま",
        "m": "一道工序",
        "m_en": "a bit of extra effort"
      },
      {
        "w": "荒らす",
        "r": "あらす",
        "m": "翻亂、破壞",
        "m_en": "to ransack, tear apart"
      },
      {
        "w": "粗大ゴミ",
        "r": "そだいゴミ",
        "m": "大型垃圾",
        "m_en": "oversized trash"
      },
      {
        "w": "申し込む",
        "r": "もうしこむ",
        "m": "申請",
        "m_en": "to apply, request"
      }
    ],
    "grammar": [
      {
        "t": "～によって(依…而異)",
        "note": "依前項不同而有差別。「区によって分類も違う」=依區別不同,分類也不同。",
        "id": "n3-53",
        "t_en": "～によって (varies by)",
        "note_en": "Indicates something differs depending on the preceding noun."
      },
      {
        "t": "～らしい(傳聞)",
        "note": "根據聽來的資訊推斷。「決まるらしい」=據說是這樣決定的。",
        "id": "n3-41",
        "t_en": "～らしい (hearsay)",
        "note_en": "Expresses information heard from elsewhere."
      },
      {
        "t": "～ているうちに",
        "note": "在持續的過程中不知不覺產生變化。「住んでいるうちに慣れてきた」=住著住著就習慣了。",
        "id": "n3-11",
        "t_en": "～ているうちに",
        "note_en": "While doing something, a change gradually happens."
      }
    ],
    "title_en": "The Rules of Taking Out the Trash",
    "topic_en": "Daily life",
    "trans_en": [
      "The first thing that confused me after moving to Japan was how to sort the garbage.",
      "Burnable, non-burnable, recyclable — both the categories and the collection days differ by ward. After moving, it is best to check the chart the city office hands out.",
      "Plastic bottles need the label and cap removed and a quick rinse inside. It feels like a hassle, but apparently that small step decides whether they can be recycled.",
      "There are rules about timing too: in most areas, before 8 a.m. on collection day. Put it out the night before and crows may tear it open.",
      "Oversized trash must be booked by phone or online, with a sticker bought at a convenience store. Plenty of people have been reprimanded for not knowing this.",
      "At first it felt excessively fussy, but living here I got used to it.",
      "How you take out the trash may be the first “shared rule” of living in a neighbourhood."
    ]
  },
  {
    "id": "a-n2-10",
    "level": "n2",
    "topic": "職場",
    "title": "報告・連絡・相談の実践",
    "title_zh": "報連相的實戰",
    "body": "日本の職場でよく言われる「報・連・相」は、覚えるのは簡単だが、実践となると難しい。\nとりわけ外国人社員がつまずきやすいのは、「まだ結論が出ていない段階で報告してよいのか」という判断である。\n結論から言えば、出ていなくてよい。むしろ、進捗が思わしくないときこそ早めに共有することが求められる。\n上司が知りたいのは完璧な報告ではなく、リスクが手遅れになる前の一言だからだ。\n「〇〇の件、今のところ半分ほど進んでいますが、資料待ちで少し遅れそうです」——この程度で十分機能する。\n相談も同様で、答えを持たずに行っても構わない。「どこで迷っているか」を言語化できていれば、それ自体が相談として成立する。\n報・連・相は上下関係の作法というより、チームで事故を防ぐための仕組みだと考えれば、負担はずいぶん軽くなるはずだ。",
    "trans": [
      "日本職場常說的「報・連・相」,記起來簡單,真要實踐卻很難。",
      "其中外國員工最容易卡住的,是「結論還沒出來的階段可以報告嗎」這個判斷。",
      "結論先講:沒出來也沒關係。反而是進度不順的時候,更被期待要早點分享。",
      "因為上司想知道的不是完美的報告,而是在風險來不及之前的那一句話。",
      "「關於某某案,目前進行到一半左右,但在等資料,可能會稍微延遲」——這種程度就完全夠用了。",
      "商量也一樣,沒有答案就去也無妨。只要能把「卡在哪裡」講清楚,那本身就成立為一次商量。",
      "與其把報連相想成上下關係的禮節,不如當成團隊防止事故的機制,負擔就會輕很多。"
    ],
    "vocab": [
      {
        "w": "実践",
        "r": "じっせん",
        "m": "實踐",
        "m_en": "practice, putting into action"
      },
      {
        "w": "とりわけ",
        "r": "とりわけ",
        "m": "尤其",
        "m_en": "especially"
      },
      {
        "w": "つまずく",
        "r": "つまずく",
        "m": "絆倒、受挫",
        "m_en": "to stumble"
      },
      {
        "w": "進捗",
        "r": "しんちょく",
        "m": "進度",
        "m_en": "progress"
      },
      {
        "w": "思わしくない",
        "r": "おもわしくない",
        "m": "不理想",
        "m_en": "not going well"
      },
      {
        "w": "手遅れ",
        "r": "ておくれ",
        "m": "為時已晚",
        "m_en": "too late"
      },
      {
        "w": "言語化",
        "r": "げんごか",
        "m": "用語言表達",
        "m_en": "putting into words"
      },
      {
        "w": "作法",
        "r": "さほう",
        "m": "禮節、規矩",
        "m_en": "etiquette"
      },
      {
        "w": "仕組み",
        "r": "しくみ",
        "m": "機制",
        "m_en": "system, mechanism"
      }
    ],
    "grammar": [
      {
        "t": "～となると",
        "note": "一旦到了某情況就不同。「実践となると難しい」=真要實踐就難了。",
        "id": "n2-18",
        "t_en": "～となると",
        "note_en": "“When it comes to…” — the situation changes once you reach that point."
      },
      {
        "t": "～こそ",
        "note": "強調正是這時候。「思わしくないときこそ」=正是不順的時候(才更該)。",
        "id": "n3-41",
        "t_en": "～こそ",
        "note_en": "Emphasis: “it is precisely then/that.”"
      },
      {
        "t": "～ても構わない",
        "note": "即使…也沒關係。「行っても構わない」=去了也無妨。",
        "id": "n4-16",
        "t_en": "～ても構わない",
        "note_en": "“It is fine even if…” — grants permission."
      },
      {
        "t": "～というより",
        "note": "與其說是A不如說是B。「作法というより仕組み」=與其說是禮節,不如說是機制。",
        "id": "n2-33",
        "t_en": "～というより",
        "note_en": "“Rather than A, it is B.”"
      }
    ],
    "title_en": "Putting “Report, Contact, Consult” into Practice",
    "topic_en": "Work",
    "trans_en": [
      "“Hō-Ren-Sō” — report, contact, consult — is easy to memorise but hard to practise.",
      "What trips up foreign employees most is judging whether it is acceptable to report before a conclusion has been reached.",
      "The short answer: it is. In fact, sharing early matters most when progress is not going well.",
      "What a manager wants is not a perfect report but a heads-up before a risk becomes irreversible.",
      "“On that project, we're about halfway, but we're waiting on materials so it may slip slightly” — that level is entirely sufficient.",
      "The same goes for consulting: you may go without an answer in hand. If you can articulate where you are stuck, that alone counts as consulting.",
      "Think of it less as hierarchical etiquette and more as a system for preventing accidents as a team, and the burden gets much lighter."
    ]
  },
  {
    "id": "a-n1-9",
    "level": "n1",
    "topic": "文化",
    "title": "住まいに宿る距離感",
    "title_zh": "居住空間裡的距離感",
    "body": "日本の住まいには、言葉にされない距離の取り方が随所に埋め込まれている。\n玄関で靴を脱ぐという習慣ひとつをとっても、そこには「外」と「内」を隔てる明確な線が引かれている。上がり框をまたぐ動作は、単なる移動ではなく、いわば切り替えの儀式なのである。\n襖や障子といった仕切りは、閉ざしきらないという点で示唆に富む。音も気配も通す薄い一枚が、それでも空間を分けたことにする——この曖昧さこそが、狭い住居で他者と暮らす知恵だったのだろう。\n集合住宅が主流となった現在も、その感覚は形を変えて残っている。生活音への神経質なまでの配慮は、壁の薄さゆえというより、互いの領域を侵さないという作法の延長線上にある。\nもっとも、こうした距離感は外から来た者には読み取りにくい。挨拶をすべきか否か、どこまで踏み込んでよいのか——明文化されていないだけに、迷うことも多い。\nだが裏を返せば、それは各自が加減を委ねられているということでもある。\n住まいとは、他者との距離をどう測るかという問いが、日々静かに繰り返される場所なのかもしれない。",
    "trans": [
      "日本的居住空間裡,到處都埋著沒有被說出口的距離拿捏。",
      "光是在玄關脫鞋這個習慣,就在那裡劃下了區隔「外」與「內」的明確界線。跨過門檻的動作,不只是移動,可說是一種切換的儀式。",
      "紙門與障子這類隔間,在「不完全關死」這點上很耐人尋味。聲音和氣息都能穿透的薄薄一片,卻仍然算是把空間分開了——正是這份曖昧,才是在狹小住居裡與他人共處的智慧吧。",
      "即使在集合住宅成為主流的現在,那種感覺仍以不同形式留存。對生活噪音近乎神經質的顧慮,與其說是因為牆薄,不如說是「不侵犯彼此領域」這套禮節的延長線。",
      "不過,這樣的距離感對外來者而言並不好讀。該不該打招呼、可以踏進到什麼程度——正因為沒有明文規定,迷惘的時候也多。",
      "但反過來說,那也意味著分寸被交給了每個人自己拿捏。",
      "所謂居住空間,或許就是「該如何測量與他人的距離」這個提問,每天靜靜重複的場所。"
    ],
    "vocab": [
      {
        "w": "随所",
        "r": "ずいしょ",
        "m": "到處",
        "m_en": "everywhere, in many places"
      },
      {
        "w": "隔てる",
        "r": "へだてる",
        "m": "隔開",
        "m_en": "to separate, divide"
      },
      {
        "w": "上がり框",
        "r": "あがりかまち",
        "m": "玄關的高低界(門檻)",
        "m_en": "step-up ledge at the entrance"
      },
      {
        "w": "儀式",
        "r": "ぎしき",
        "m": "儀式",
        "m_en": "ritual"
      },
      {
        "w": "仕切り",
        "r": "しきり",
        "m": "隔間",
        "m_en": "partition"
      },
      {
        "w": "示唆に富む",
        "r": "しさにとむ",
        "m": "耐人尋味、富啟發",
        "m_en": "suggestive, thought-provoking"
      },
      {
        "w": "気配",
        "r": "けはい",
        "m": "氣息、動靜",
        "m_en": "presence, sign"
      },
      {
        "w": "配慮",
        "r": "はいりょ",
        "m": "顧慮、體貼",
        "m_en": "consideration"
      },
      {
        "w": "侵す",
        "r": "おかす",
        "m": "侵犯",
        "m_en": "to intrude upon"
      },
      {
        "w": "委ねる",
        "r": "ゆだねる",
        "m": "交託、交由",
        "m_en": "to entrust, leave to"
      }
    ],
    "grammar": [
      {
        "t": "～をとっても",
        "note": "舉一例來看。「習慣ひとつをとっても」=光舉一個習慣來看。",
        "id": "n1-47",
        "t_en": "～をとっても",
        "note_en": "“Take even just one example of…”"
      },
      {
        "t": "～ゆえに／～ゆえ",
        "note": "書面的原因表現。「壁の薄さゆえ」=因為牆薄。",
        "id": "n1-30",
        "t_en": "～ゆえ(に)",
        "note_en": "A formal, written way to state a cause."
      },
      {
        "t": "～というより",
        "note": "與其說A不如說B。用來修正說法、把重點導向後項。",
        "id": "n2-33",
        "t_en": "～というより",
        "note_en": "“Rather than A, it is B.”"
      },
      {
        "t": "裏を返せば",
        "note": "反過來說。用於把同一件事翻到另一面解讀。",
        "id": "n1-66",
        "t_en": "裏を返せば",
        "note_en": "“Looked at the other way round…”"
      }
    ],
    "title_en": "The Sense of Distance Built into a Japanese Home",
    "topic_en": "Culture",
    "trans_en": [
      "Japanese homes have unspoken ways of managing distance embedded throughout them.",
      "Take the single habit of removing your shoes at the entrance: it draws a clear line between “outside” and “inside.” Stepping over the raised ledge is not mere movement but something closer to a ritual of switching modes.",
      "Partitions such as fusuma and shoji are telling precisely because they never fully close. A thin sheet that lets both sound and presence through still counts as dividing the space — and that ambiguity was surely the wisdom of living with others in a small home.",
      "Even now that apartment blocks are the norm, that sensibility survives in altered form. The almost nervous consideration given to household noise is less about thin walls than an extension of the etiquette of not intruding on one another's territory.",
      "This sense of distance is, however, hard for newcomers to read. Whether to greet someone, how far one may step in — precisely because none of it is written down, there is plenty of hesitation.",
      "Yet seen from the other side, it also means the calibration is entrusted to each person.",
      "A home may be the place where the question of how to measure the distance to others is quietly repeated, day after day."
    ]
  },
  {
    "id": "a-n5-9",
    "level": "n5",
    "topic": "生活",
    "topic_en": "Everyday life",
    "title": "こうえんで あそぶ 一日",
    "title_zh": "在公園玩耍的一天",
    "title_en": "A Day Playing at the Park",
    "body": "どようびは いい てんきでした。わたしは ともだちと こうえんへ 行く やくそくを しました。あさ 九時に えきで あいました。\nまえの ばんに おべんとうを つくりました。たまごやきと おにぎりと やさいを いれました。ともだちの ぶんも すこし つくりました。\nこうえんまで じてんしゃで 行きました。みちには さくらの きが たくさん ありました。かぜが きもち よかったです。\nこうえんの ベンチで おべんとうを たべました。とても おいしかったです。ともだちも おいしいと いいました。\nたべた あと、ともだちと バドミントンを したり、しゃしんを とったり しました。みんな たのしそうでした。\nゆうがた いえに かえりました。すこし つかれましたが、とても たのしい 一日でした。らいしゅうも また こうえんへ 行きたいです。",
    "trans": [
      "星期六天氣很好。我和朋友約好要去公園。早上九點在車站見面。",
      "前一天晚上做了便當。放了煎蛋、飯糰和蔬菜。也幫朋友做了一點。",
      "騎腳踏車去公園。路上有很多櫻花樹。風吹起來很舒服。",
      "在公園的長椅上吃便當。非常好吃。朋友也說很好吃。",
      "吃完之後,和朋友一起打羽毛球、拍照。大家看起來都很開心。",
      "傍晚回到家。雖然有點累,但是非常開心的一天。下星期也想再去公園。"
    ],
    "trans_en": [
      "It was nice weather on Saturday. I promised my friend to go to the park. We met at the station at nine in the morning.",
      "I made a bento the night before. I put in rolled egg, rice balls, and vegetables. I also made a little for my friend.",
      "We went to the park by bicycle. There were many cherry trees along the way. The wind felt nice.",
      "We ate the bento on a bench in the park. It was very delicious. My friend also said it was delicious.",
      "After eating, we did things like play badminton and take photos with my friend. Everyone looked happy.",
      "I went home in the evening. I was a little tired, but it was a very fun day. I want to go to the park again next week."
    ],
    "vocab": [
      {
        "w": "土曜日",
        "r": "どようび",
        "m": "星期六",
        "m_en": "Saturday"
      },
      {
        "w": "天気",
        "r": "てんき",
        "m": "天氣",
        "m_en": "weather"
      },
      {
        "w": "友だち",
        "r": "ともだち",
        "m": "朋友",
        "m_en": "friend"
      },
      {
        "w": "公園",
        "r": "こうえん",
        "m": "公園",
        "m_en": "park"
      },
      {
        "w": "約束",
        "r": "やくそく",
        "m": "約定",
        "m_en": "promise"
      },
      {
        "w": "弁当",
        "r": "べんとう",
        "m": "便當",
        "m_en": "boxed lunch"
      },
      {
        "w": "卵焼き",
        "r": "たまごやき",
        "m": "煎蛋捲",
        "m_en": "rolled omelette"
      },
      {
        "w": "おにぎり",
        "r": "おにぎり",
        "m": "飯糰",
        "m_en": "rice ball"
      },
      {
        "w": "自転車",
        "r": "じてんしゃ",
        "m": "腳踏車",
        "m_en": "bicycle"
      },
      {
        "w": "写真",
        "r": "しゃしん",
        "m": "照片",
        "m_en": "photo"
      }
    ],
    "grammar": [
      {
        "t": "へ(方向)",
        "note": "表示移動的方向,常接「行く」等動詞:「こうえんへ 行く」。",
        "id": "n5-22",
        "t_en": "へ (direction)",
        "note_en": "Marks the direction of movement, often used with verbs like 行く: 「こうえんへ 行く」."
      },
      {
        "t": "た形+あと",
        "note": "動詞た形加「あと」表示「~之後」:「たべた あと、あそびました」。",
        "id": "n5-23",
        "t_en": "た-form + あと",
        "note_en": "Adding あと to the plain past (た-form) means \"after doing ~\": 「たべた あと、あそびました」."
      },
      {
        "t": "~たり~たりする",
        "note": "列舉幾個動作或狀態:「バドミントンを したり、しゃしんを とったり しました」。",
        "id": "n5-24",
        "t_en": "~たり~たりする",
        "note_en": "Used to list a few representative actions or states: 「バドミントンを したり、しゃしんを とったり しました」."
      },
      {
        "t": "も(也)",
        "note": "表示「也一樣」,接在名詞後面:「ともだちも おいしいと いいました」。",
        "id": "n5-25",
        "t_en": "も (also)",
        "note_en": "Attached after a noun to mean \"also/too\": 「ともだちも おいしいと いいました」."
      }
    ]
  },
  {
    "id": "a-n4-10",
    "level": "n4",
    "topic": "生活",
    "topic_en": "Everyday life",
    "title": "セルフレジ",
    "title_zh": "自助結帳機",
    "title_en": "Self-Checkout Machine",
    "body": "先週、近くのスーパーで初めてセルフレジを使いました。店員さんがいなくても、自分で商品を精算できます。\nまず、かごから商品を一つずつ取り出して、バーコードを機械にかざします。音が鳴ったら、精算が正しくできたしるしです。\n次に、画面を見ながら、現金かカードか、支払い方を選びます。現金の場合は、お金を入れるところに入れます。\n私は初めてだったので、どこを押せばいいかわからず、少し迷いました。でも、困ったときは近くの店員さんがすぐに手伝ってくれました。\nセルフレジはレジに並ばなくてもいいので、時間のないときにとても便利です。ただ、慣れない人には少し難しいかもしれません。\n使い方に慣れれば、誰でも簡単に使えるようになります。これから利用する人は、まずゆっくり画面を見ながら試してみてください。",
    "trans": [
      "上週,我第一次在附近的超市使用了自助結帳機。即使沒有店員,也可以自己完成商品的結帳。",
      "首先,把籃子裡的商品一件一件拿出來,對著機器讀取條碼。如果發出聲音,就是表示結帳成功的訊號。",
      "接著,一邊看畫面,一邊選擇要用現金還是刷卡付款。如果是付現金,就把錢放進投錢口。",
      "因為是第一次,不知道該按哪裡,有點不知所措。不過,遇到困難時,附近的店員馬上就來幫忙了。",
      "自助結帳機不用排隊等收銀台,所以在沒有時間的時候非常方便。不過,對不習慣的人來說可能有點難。",
      "只要習慣了使用方法,任何人都能簡單地使用。今後要使用的人,請先一邊慢慢看畫面一邊試試看。"
    ],
    "trans_en": [
      "Last week, I used a self-checkout machine at a nearby supermarket for the first time. Even without a store clerk, you can check out your items yourself.",
      "First, take the items out of the basket one by one and scan the barcode with the machine. If a sound is made, it's a sign that the scan was successful.",
      "Next, while looking at the screen, choose whether to pay by cash or card. If paying with cash, put the money into the cash slot.",
      "Since it was my first time, I didn't know what to press and felt a bit confused. But when I had trouble, a nearby clerk quickly helped me.",
      "Self-checkout is very convenient when you're short on time since you don't have to line up at the register. However, it might be a bit difficult for those who aren't used to it.",
      "Once you get used to how to use it, anyone can use it easily. For those who will use it from now on, please try it while slowly looking at the screen first."
    ],
    "vocab": [
      {
        "w": "店員",
        "r": "てんいん",
        "m": "店員",
        "m_en": "store clerk"
      },
      {
        "w": "商品",
        "r": "しょうひん",
        "m": "商品",
        "m_en": "product"
      },
      {
        "w": "機械",
        "r": "きかい",
        "m": "機器",
        "m_en": "machine"
      },
      {
        "w": "画面",
        "r": "がめん",
        "m": "畫面、螢幕",
        "m_en": "screen"
      },
      {
        "w": "現金",
        "r": "げんきん",
        "m": "現金",
        "m_en": "cash"
      },
      {
        "w": "支払う",
        "r": "しはらう",
        "m": "支付",
        "m_en": "to pay"
      },
      {
        "w": "選ぶ",
        "r": "えらぶ",
        "m": "選擇",
        "m_en": "to choose"
      },
      {
        "w": "迷う",
        "r": "まよう",
        "m": "猶豫、迷惑",
        "m_en": "to hesitate"
      },
      {
        "w": "手伝う",
        "r": "てつだう",
        "m": "幫忙",
        "m_en": "to help"
      },
      {
        "w": "慣れる",
        "r": "なれる",
        "m": "習慣",
        "m_en": "to get used to"
      }
    ],
    "grammar": [
      {
        "t": "~てくれる",
        "note": "別人為自己做某事:「店員さんが 手伝って くれました」(店員幫了我)。",
        "id": "n4-58",
        "t_en": "〜てくれる",
        "note_en": "Someone does something for you: 「店員さんが 手伝って くれました」(The clerk helped me)."
      },
      {
        "t": "~なくてもいい",
        "note": "表示不必做某事:「レジに ならばなくても いいです」(不用排隊也可以)。",
        "id": "n4-59",
        "t_en": "〜なくてもいい",
        "note_en": "Expresses that something is not necessary: 「レジに ならばなくても いいです」(You don't have to line up)."
      },
      {
        "t": "~ずつ",
        "note": "表示「每~」平均分配的量:「一つずつ とりだす」(一件一件拿出來)。",
        "id": "n4-60",
        "t_en": "〜ずつ",
        "note_en": "Indicates an equal amount \"each\": 「一つずつ とりだす」(take out one at a time)."
      },
      {
        "t": "~か~か",
        "note": "表示在兩者中選擇:「げんきんか カードか」(現金還是刷卡)。",
        "id": "n4-61",
        "t_en": "〜か〜か",
        "note_en": "Indicates a choice between two options: 「げんきんか カードか」(cash or card)."
      }
    ]
  },
  {
    "id": "a-n3-11",
    "level": "n3",
    "topic": "職場",
    "topic_en": "Work",
    "title": "報連相の大切さ",
    "title_zh": "報連相的重要性",
    "title_en": "The Importance of Hourensou",
    "body": "日本の会社では、「報連相」がとても大切だと言われています。これは報告、連絡、相談の三つをまとめた言葉です。\n仕事の進み具合を上司に伝えることを報告と言います。何か問題が起きたら、すぐに報告することが求められます。\n連絡は、必要な情報を関係する人に伝えることです。予定が変わったときなど、早めの連絡が大切にされます。\n相談は、一人で決められないことを上司や同僚に聞くことです。小さなことでも相談すれば、大きな失敗を防げます。\n外国人の社員にとって、この報連相の習慣は最初は難しく感じられるかもしれません。自分の国では、自分で判断して進めることが評価される場合もあるからです。\nしかし、報連相をきちんと行えば、チームの中で信頼を得やすくなります。日本の会社で働くなら、この考え方を理解しておくことが役に立つでしょう。",
    "trans": [
      "在日本的公司裡,常說『報連相』非常重要。這是把報告、聯絡、商量這三個詞彙合起來的說法。",
      "向上司傳達工作進度稱為報告。發生問題時,被要求要立刻報告。",
      "聯絡是指把必要的資訊傳達給相關人員。像是行程有變動時,及早聯絡被視為很重要。",
      "商量是指詢問上司或同事那些自己一個人無法決定的事。就算是小事,只要商量,就能避免大的失敗。",
      "對外國員工來說,這種報連相的習慣一開始或許會覺得困難。因為在自己的國家,有時候自行判斷、推進工作反而會受到肯定。",
      "不過,若能確實做好報連相,就更容易在團隊中獲得信賴。若要在日本公司工作,理解這種想法應該會很有幫助。"
    ],
    "trans_en": [
      "In Japanese companies, it is said that 'hourensou' is very important. This is a word combining the three: reporting, contacting, and consulting.",
      "Reporting means telling your supervisor about the progress of your work. If a problem occurs, you are expected to report it immediately.",
      "Contacting means conveying necessary information to the people involved. For example, when a schedule changes, contacting early is considered important.",
      "Consulting means asking your boss or colleagues about things you cannot decide alone. Even for small matters, consulting can prevent big failures.",
      "For foreign employees, this habit of hourensou may feel difficult at first. This is because, in their own countries, deciding and proceeding on one's own is sometimes valued.",
      "However, if you properly practice hourensou, you can more easily gain trust within the team. If you work at a Japanese company, understanding this way of thinking will likely be helpful."
    ],
    "vocab": [
      {
        "w": "報連相",
        "r": "ほうれんそう",
        "m": "報告、聯絡、商量的合稱",
        "m_en": "abbreviation for report-contact-consult"
      },
      {
        "w": "報告",
        "r": "ほうこく",
        "m": "報告",
        "m_en": "report"
      },
      {
        "w": "連絡",
        "r": "れんらく",
        "m": "聯絡",
        "m_en": "contact"
      },
      {
        "w": "相談",
        "r": "そうだん",
        "m": "商量",
        "m_en": "consultation"
      },
      {
        "w": "進み具合",
        "r": "すすみぐあい",
        "m": "進度",
        "m_en": "progress"
      },
      {
        "w": "上司",
        "r": "じょうし",
        "m": "上司",
        "m_en": "boss / supervisor"
      },
      {
        "w": "同僚",
        "r": "どうりょう",
        "m": "同事",
        "m_en": "colleague"
      },
      {
        "w": "信頼",
        "r": "しんらい",
        "m": "信賴",
        "m_en": "trust"
      },
      {
        "w": "判断",
        "r": "はんだん",
        "m": "判斷",
        "m_en": "judgment"
      },
      {
        "w": "評価",
        "r": "ひょうか",
        "m": "評價",
        "m_en": "evaluation"
      }
    ],
    "grammar": [
      {
        "t": "~と言われています",
        "note": "表示「大家都說~、據說~」,例:「報連相が大切だと言われています」(大家都說報連相很重要)。",
        "id": "n3-01",
        "t_en": "〜と言われています",
        "note_en": "Expresses \"it is said that 〜,\" e.g. 「報連相が大切だと言われています」(\"It is said that hourensou is important.\")"
      },
      {
        "t": "~ことです",
        "note": "把動詞句名詞化,表示「就是~這件事」,例:「情報を伝えることです」(就是傳達資訊這件事)。",
        "id": "n3-02",
        "t_en": "〜ことです",
        "note_en": "Turns a verb phrase into a noun phrase meaning \"it is the act of 〜,\" e.g. 「情報を伝えることです」(\"It is conveying information.\")"
      },
      {
        "t": "~ば",
        "note": "表示條件「如果~的話」,例:「相談すれば、失敗を防げます」(如果商量的話,就能防止失敗)。",
        "id": "n4-15",
        "t_en": "〜ば",
        "note_en": "Conditional meaning \"if 〜,\" e.g. 「相談すれば、失敗を防げます」(\"If you consult, you can prevent failure.\")"
      },
      {
        "t": "~かもしれません",
        "note": "表示「或許~、也許~」的推測,例:「難しく感じられるかもしれません」(或許會覺得困難)。",
        "id": "n4-20",
        "t_en": "〜かもしれません",
        "note_en": "Expresses the guess \"maybe 〜,\" e.g. 「難しく感じられるかもしれません」(\"It might feel difficult.\")"
      }
    ]
  },
{"id":"a-n5-10","level":"n5","topic":"生活","topic_en":"Everyday life","title":"レストランで ちゅうもんします","title_zh":"在餐廳點餐","title_en":"Ordering at a restaurant","body":"きょう は ともだち と レストラン へ 行きました。\nメニュー を みて、りょうり を えらびました。\nてんいん さん を よびました。ていしょく と おちゃ を ちゅうもんしました。\nりょうり は はやく きました。とても おいしかったです。\nたべた あと、レジ で おかね を はらいました。カード も つかえて、べんり でした。","trans":["今天晚上,我和朋友去了餐廳。","我看了菜單,選擇了餐點。","我叫了店員。點了定食和茶。","餐點很快就來了。非常好吃。","吃完之後,在收銀台付了錢。也能刷卡,很方便。"],"trans_en":["Today, I went to a restaurant with my friend.","I looked at the menu and chose my meal.","I called the staff. I ordered a set meal and tea.","The food came quickly. It was very delicious.","After eating, I paid at the cash register. I could also use a card, which was convenient."],"vocab":[{"w":"レストラン","r":"レストラン","m":"餐廳","m_en":"restaurant"},{"w":"メニュー","r":"メニュー","m":"菜單","m_en":"menu"},{"w":"てんいんさん","r":"てんいんさん","m":"店員","m_en":"staff/waiter"},{"w":"よびます","r":"よびます","m":"呼叫","m_en":"to call"},{"w":"ていしょく","r":"ていしょく","m":"定食","m_en":"set meal"},{"w":"ちゅうもんします","r":"ちゅうもんします","m":"點餐","m_en":"to order"},{"w":"りょうり","r":"りょうり","m":"料理","m_en":"dish/food"},{"w":"レジ","r":"レジ","m":"收銀台","m_en":"cash register"},{"w":"はらいます","r":"はらいます","m":"付錢","m_en":"to pay"},{"w":"べんり","r":"べんり","m":"方便","m_en":"convenient"}],"grammar":[{"t":"〜て、〜(て形接續)","note":"動詞て形連接兩個動作,例:「メニュー を みて、りょうり を えらびました。」","t_en":"~te, ~ (te-form connecting actions)","note_en":"Connects two actions using the te-form, e.g. 「メニューをみて、りょうりをえらびました。」"},{"t":"〜ました(過去式)","note":"表示過去發生的動作,例:「てんいん さん を よびました。」","t_en":"~mashita (past tense)","note_en":"Indicates a past action, e.g. 「てんいんさんをよびました。」"},{"t":"〜あと、〜","note":"表示某動作之後,例:「たべた あと、レジ で おかね を はらいました。」","t_en":"~ato (after doing)","note_en":"Used after doing something, e.g. 「たべたあと、レジでおかねをはらいました。」"},{"t":"〜も","note":"表示「也」,例:「カード も つかえて、べんり でした。」","t_en":"~mo (also/too)","note_en":"Means 'also/too', e.g. 「カードもつかえて、べんりでした。」"}]},
{"id":"a-n4-11","level":"n4","topic":"生活","topic_en":"Everyday life","title":"電車に傘を忘れた日","title_zh":"忘記把傘放在電車上的那天","title_en":"The Day I Left My Umbrella on the Train","body":"今日、電車の中に傘を忘れてしまいました。気がついたら、もう電車は次の駅に着いていました。とても困ったので、駅の忘れ物センターへ行くことにしました。\n係の人に、傘をなくしたことを説明しました。「特徴を教えてください」と言われたので、色と形を伝えました。「黒くて、柄が少し曲がっている傘です」と話しました。係の人は「少し待ってください、探してみます」と言ってくれました。\nしばらく待っていると、同じような傘が見つかりそうだと言われました。奥から傘を持ってきてもらったら、それは確かに私の傘でした。すぐに受け取れて、本当にほっとしました。これからは、電車を降りるとき忘れ物がないか確認しようと思います。","trans":["今天我把雨傘忘在電車上了。等我發現時,電車已經到了下一站。因為很困擾,所以決定去車站的遺失物中心。","我向工作人員說明了雨傘不見的事。他說「請告訴我特徵」,於是我描述了顏色和形狀。我說「是黑色、傘柄有點彎曲的傘」。工作人員說「請稍等,我去找找看」,便幫我去找了。","等了一會兒,對方說好像找到了類似的雨傘。從裡面拿出雨傘讓我看時,那確實是我的傘。我馬上就能領回,真的鬆了一口氣。從現在開始,下電車時我會確認有沒有忘記東西。"],"trans_en":["Today I accidentally left my umbrella on the train. By the time I noticed, the train had already arrived at the next station. Since I was very troubled, I decided to go to the station's lost-and-found center.","I explained to the staff member that I had lost my umbrella. He said, 'Please tell me the characteristics,' so I described its color and shape. I said, 'It's a black umbrella with a slightly bent handle.' The staff member said, 'Please wait a moment, I'll go look for it,' and went to search for me.","After waiting a while, I was told that a similar umbrella seemed to have been found. When he brought it out from the back for me, it was indeed my umbrella. I was able to get it back right away, and I felt truly relieved. From now on, I plan to check for forgotten items whenever I get off the train."],"vocab":[{"w":"忘れ物","r":"わすれもの","m":"遺失物","m_en":"lost item"},{"w":"気がつく","r":"きがつく","m":"注意到、發現","m_en":"to notice"},{"w":"困る","r":"こまる","m":"困擾、為難","m_en":"to be troubled"},{"w":"特徴","r":"とくちょう","m":"特徵","m_en":"characteristic"},{"w":"曲がる","r":"まがる","m":"彎曲","m_en":"to bend, to curve"},{"w":"見つかる","r":"みつかる","m":"被找到","m_en":"to be found"},{"w":"受け取る","r":"うけとる","m":"領取、收下","m_en":"to receive"},{"w":"ほっとする","r":"ほっとする","m":"鬆一口氣、安心","m_en":"to feel relieved"},{"w":"確認する","r":"かくにんする","m":"確認","m_en":"to confirm"}],"grammar":[{"t":"〜たら","note":"表示前項動作發生後,接著出現後項的結果或發現,常帶意外語氣。例句:「気がついたら、もう電車は次の駅に着いていました。」","t_en":"~tara (when/after...)","note_en":"Expresses that once the first action happens, the following result or realization occurs, often with a sense of surprise. Example: 「気がついたら、もう電車は次の駅に着いていました。」"},{"t":"可能形","note":"表示能夠做到某事的能力或狀態。例句:「すぐに受け取れて、本当にほっとしました。」","t_en":"Potential form","note_en":"Expresses the ability or possibility of doing something. Example: 「すぐに受け取れて、本当にほっとしました。」","id":"n4-52"},{"t":"授受表現(〜てくれる/〜てもらう)","note":"表示他人為自己做某動作,或請對方為自己做某事後獲得幫助。例句:「係の人は…と言ってくれました。」、「奥から傘を持ってきてもらったら」","t_en":"Giving/receiving expressions (~te kureru / ~te morau)","note_en":"Expresses that someone does an action for the speaker's benefit, or the speaker receives help from someone. Example: 「係の人は…と言ってくれました。」/「奥から傘を持ってきてもらったら」"},{"t":"〜そうだ(様態)","note":"表示根據外觀或情況判斷即將發生的事。例句:「同じような傘が見つかりそうだと言われました。」","t_en":"~sou da (appearance/likelihood)","note_en":"Expresses a guess about something that seems likely to happen based on appearance. Example: 「同じような傘が見つかりそうだと言われました。」"}]},
{"id":"a-n3-12","level":"n3","topic":"職場","topic_en":"Workplace","title":"ビジネスメールの基本","title_zh":"商務電子郵件的基本","title_en":"The Basics of Business Email","body":"日本の会社で働くとき、メールの書き方にはいくつかの基本的なルールがあります。メールは電話と違って、相手の都合のよい時間に読んでもらえるという利点があります。書き方を間違えると失礼な印象を与えてしまうこともあるので、新入社員は先輩からよく学びます。\nまず、件名は一目で内容がわかるように、簡潔に書くことが大切です。「会議の件」だけではなく、「来週の会議の日程について」のように具体的に書くとよいでしょう。件名が分かりにくいと、相手が忙しいときにメールを見落としてしまうかもしれません。ただし、件名を長くしすぎればよいというわけではなく、短くまとめる工夫も必要です。\nメールの書き出しには、「お世話になっております」という言葉がよく使われます。これは、相手との関係に感謝を示す挨拶で、社外の人にも社内の人にも使われる表現です。初めて連絡する相手には、「はじめてご連絡いたします」のような表現を使うこともあります。本文では、用件を分かりやすく伝えるように、短い文で丁寧に書くことが求められます。\nメールの最後には、「よろしくお願いいたします」という言葉で締めることにしている人が多いです。この言葉があることで、文章全体が丁寧な印象になり、相手も気持ちよく読むことができます。また、メールを受け取ったら、できるだけ早く返信することも大切なマナーの一つです。すぐに答えが出せない場合でも、「確認して後日ご連絡します」と一言送っておくと安心されます。","trans":["在日本公司工作時,寫電子郵件有一些基本的規則。電子郵件與電話不同,具有可以讓對方在方便的時間閱讀的優點。如果寫法出錯,可能會給人留下不禮貌的印象,因此新進員工常常會向前輩學習。","首先,主旨要讓人一看就懂內容,寫得簡潔是很重要的。不要只寫「關於會議」,而是像「關於下週會議的日程」這樣具體地寫會比較好。如果主旨不清楚,對方忙碌時可能會漏看這封郵件。不過,並不是主旨越長越好,也需要花心思把它整理得簡短。","郵件的開頭常常會用到「一直以來受您照顧」這句話。這是向對方的關係表示感謝的問候語,不論是公司外的人還是公司內的人都會使用。對第一次聯絡的對象,有時也會使用「初次與您聯絡」這樣的說法。正文中,為了讓對方能清楚理解事項,需要用簡短的句子有禮貌地書寫。","許多人會在郵件的最後用「請多多指教」這句話來作結。有了這句話,整篇文章會給人有禮貌的印象,對方也能愉快地閱讀。另外,收到郵件後盡快回覆也是很重要的禮儀之一。即使當下無法立刻給出答案,先發一句「確認後將於日後與您聯絡」也能讓對方安心。"],"trans_en":["When working at a Japanese company, there are some basic rules for writing emails. Unlike phone calls, emails have the advantage of allowing the recipient to read them at a convenient time. If written incorrectly, it may give an impolite impression, so new employees often learn this from their seniors.","First, it is important to write the subject line concisely so that the content can be understood at a glance. Instead of just writing \"About the meeting,\" it is better to write something specific like \"About next week's meeting schedule.\" If the subject line is unclear, the recipient may overlook the email when busy. However, that doesn't mean a longer subject line is better; effort is also needed to keep it short.","The opening of an email often uses the phrase \"Thank you for your continued support.\" This is a greeting that expresses gratitude for the relationship, used with both people outside and inside the company. When contacting someone for the first time, expressions like \"This is my first contact with you\" may also be used. In the body, in order to convey the matter clearly, it is required to write politely in short sentences.","Many people end their emails with the phrase \"I look forward to your continued support.\" Having this phrase gives the whole text a polite impression, and the recipient can read it comfortably. Also, replying as soon as possible after receiving an email is one of the important manners. Even if you cannot give an answer right away, sending a line like \"I will check and get back to you later\" can reassure the recipient."],"vocab":[{"w":"件名","r":"けんめい","m":"郵件主旨","m_en":"email subject line"},{"w":"簡潔","r":"かんけつ","m":"簡潔","m_en":"concise"},{"w":"具体的","r":"ぐたいてき","m":"具體的","m_en":"specific/concrete"},{"w":"見落とす","r":"みおとす","m":"漏看","m_en":"to overlook"},{"w":"丁寧","r":"ていねい","m":"禮貌、細心","m_en":"polite/courteous"},{"w":"返信","r":"へんしん","m":"回信","m_en":"reply"},{"w":"マナー","r":"マナー","m":"禮儀、規矩","m_en":"manners/etiquette"},{"w":"安心","r":"あんしん","m":"安心、放心","m_en":"relief/peace of mind"},{"w":"新入社員","r":"しんにゅうしゃいん","m":"新進員工","m_en":"new employee"},{"w":"利点","r":"りてん","m":"優點","m_en":"advantage"}],"grammar":[{"t":"〜ように","note":"表示為了達成某種目的或狀態而做某事,文中「件名は一目で内容がわかるように、簡潔に書くことが大切です」。","t_en":"~yō ni (so that / in order to)","note_en":"Expresses purpose or a desired result. Example: 「件名は一目で内容がわかるように、簡潔に書くことが大切です」","id":"n3-54"},{"t":"〜わけではない","note":"表示並非完全如此,委婉地部分否定,文中「件名を長くしすぎればよいというわけではなく」。","t_en":"~wake dewa nai (it doesn't necessarily mean that...)","note_en":"Used to softly negate a statement, not entirely. Example: 「件名を長くしすぎればよいというわけではなく」","id":"n3-43"},{"t":"〜ことにする","note":"表示自己決定的做法或養成的習慣,文中「よろしくお願いいたします、という言葉で締めることにしている人が多いです」。","t_en":"~koto ni suru (to decide to / make it a rule to)","note_en":"Expresses a personal decision or habitual practice. Example: 「よろしくお願いいたします、という言葉で締めることにしている人が多いです」"},{"t":"〜ておく","note":"表示為了之後方便而事先做好某件事,文中「確認して後日ご連絡します、と一言送っておくと安心されます」。","t_en":"~te oku (to do something in advance/for later use)","note_en":"Indicates doing something beforehand for future convenience. Example: 「確認して後日ご連絡します、と一言送っておくと安心されます」"}]},
{"id":"a-n5-11","level":"n5","topic":"生活","topic_en":"Daily life","title":"はじめての ICカード","title_zh":"第一次用 IC 卡","title_en":"My First IC Card","body":"日本 に きて、はじめて えき で ICカード を 買いました。きかい に 千円 を 入れました。\nでんしゃ に のる とき、かいさつ で カード を タッチ します。「ピッ」と みじかい おと が します。\nきっぷ を 買う じかん が いりません。とても べんり です。\nでんしゃ だけ では ありません。バス や コンビニ でも つかう こと が できます。\nきのう、かいさつ で「ピンポーン」と 大きい おと が しました。カード の おかね が たりません でした。\nえきいん さん が「あちら の きかい で チャージ して ください」と おしえて くれました。\nいま は、えき に 入る まえ に、カード の おかね を 見ます。","trans":["來日本之後,第一次在車站買了 IC 卡。我在機器裡投了一千日圓。","搭電車的時候,在剪票口把卡片感應一下,會發出「嗶」一聲短短的聲音。","不用花時間買車票,超方便的。","而且不只電車喔,公車跟便利商店也都可以用。","昨天在剪票口突然「叮咚」響了好大一聲。原來是卡片裡的錢不夠了。","站務員跟我說:「請到那邊的機器加值。」","現在我進車站之前,都會先看一下卡片裡還剩多少錢。"],"trans_en":["After coming to Japan, I bought an IC card at the station for the first time. I put 1,000 yen into the machine.","When I take the train, I tap the card at the ticket gate. It makes a short “beep.”","I don't need to spend time buying tickets. It's really convenient.","And it's not just for trains — I can use it on buses and at convenience stores too.","Yesterday the ticket gate made a loud “ding-dong.” There wasn't enough money on my card.","A station attendant told me, “Please top up at that machine over there.”","Now I check the balance on my card before I go into the station."],"vocab":[{"w":"駅","r":"えき","m":"車站","m_en":"station"},{"w":"機械","r":"きかい","m":"機器","m_en":"machine"},{"w":"改札","r":"かいさつ","m":"剪票口","m_en":"ticket gate"},{"w":"切符","r":"きっぷ","m":"車票","m_en":"ticket"},{"w":"便利","r":"べんり","m":"方便","m_en":"convenient"},{"w":"足りる","r":"たりる","m":"足夠","m_en":"to be enough"},{"w":"駅員","r":"えきいん","m":"站務員","m_en":"station staff"},{"w":"教える","r":"おしえる","m":"告訴、教","m_en":"to tell, to teach"},{"w":"チャージする","r":"チャージする","m":"加值、儲值","m_en":"to top up"}],"grammar":[{"t":"～とき","note":"「做某事的時候」。動詞辭書形+とき:「でんしゃ に のる とき」=要搭電車的時候。","id":"n5-59","t_en":"～とき","note_en":"“When ~.” Dictionary-form verb + とき: でんしゃ に のる とき = when (I'm about to) take the train."},{"t":"～ことができる","note":"表示能力或可能性。動詞辭書形+ことができる:「つかう こと が できます」=可以使用。","id":"n3-75","t_en":"～ことができる","note_en":"Expresses ability or possibility: つかう こと が できます = (you) can use it."},{"t":"～まえに","note":"「在做某事之前」。動詞一律用辭書形:「えき に 入る まえ に」=進車站之前。","id":"n5-54","t_en":"～まえに","note_en":"“Before ~.” The verb is always in dictionary form: えき に 入る まえ に = before entering the station."}],"publish_at":"2026-10-12T08:00:00+08:00"},
{"id":"a-n4-12","level":"n4","topic":"健康","topic_en":"Health","title":"インフルエンザの予防接種","title_zh":"打流感疫苗","title_en":"Getting a Flu Shot","body":"十月になると、近くのクリニックに「インフルエンザ予防接種、始めました」という紙がはってありました。\n去年の冬、わたしはインフルエンザにかかって、一週間も会社を休まなければなりませんでした。\nそれで、今年は早めに予防接種を受けることにしました。\n電話で予約してから行くと、受付で問診票を渡されました。熱をはかって、体の調子について書きます。\n注射は思ったより痛くありませんでした。終わったあと、しばらく待合室で休んでくださいと言われました。\n予防接種には健康保険が使えないので、少し高いと感じました。値段は病院によって違うそうですが、わたしは三千五百円でした。\n効果が出るまで二週間ぐらいかかるそうです。流行する前に受けておくと、安心して冬を過ごせます。","trans":["一到十月,附近的診所就貼出了「流感疫苗開打了」的告示。","去年冬天我得了流感,整整一個禮拜都只能跟公司請假。","所以今年我決定早一點去打疫苗。","先打電話預約再過去,到了櫃台拿到一張問診單。要先量體溫,再寫下自己的身體狀況。","打針比想像中不痛。打完之後,對方交代我先在候診室休息一下。","打疫苗不能用健保,所以覺得有點貴。聽說每家醫院價格不一樣,我是花了三千五百日圓。","聽說要大概兩個禮拜才會開始有效。趁流行之前先打好,冬天就能安心過了。"],"trans_en":["When October came, the clinic near me put up a sign saying, “Flu shots now available.”","Last winter I caught the flu and had to take a whole week off work.","So this year I decided to get vaccinated early.","I called to book first, and when I arrived, reception handed me a medical questionnaire. You take your temperature and write about how you're feeling.","The shot hurt less than I expected. Afterwards, I was told to rest in the waiting room for a while.","Health insurance doesn't cover vaccinations, so it felt a little pricey. I hear the price varies by clinic — mine was 3,500 yen.","Apparently it takes about two weeks to start working. If you get it before the flu starts spreading, you can get through winter with peace of mind."],"vocab":[{"w":"予防接種","r":"よぼうせっしゅ","m":"預防接種、打疫苗","m_en":"vaccination"},{"w":"受付","r":"うけつけ","m":"櫃台、掛號處","m_en":"reception"},{"w":"早め","r":"はやめ","m":"提早、早一點","m_en":"early, ahead of time"},{"w":"渡す","r":"わたす","m":"交給","m_en":"to hand over"},{"w":"調子","r":"ちょうし","m":"狀況、狀態","m_en":"condition"},{"w":"注射","r":"ちゅうしゃ","m":"打針","m_en":"injection"},{"w":"待合室","r":"まちあいしつ","m":"候診室","m_en":"waiting room"},{"w":"健康保険","r":"けんこうほけん","m":"健康保險(健保)","m_en":"health insurance"},{"w":"効果","r":"こうか","m":"效果","m_en":"effect"},{"w":"流行する","r":"りゅうこうする","m":"流行","m_en":"to spread, to be going around"}],"grammar":[{"t":"～なければなりません","note":"必須、不得不。「休まなければなりませんでした」=(當時)不得不請假。","id":"n4-16","t_en":"～なければなりません","note_en":"Obligation: 休まなければなりませんでした = I had to take time off."},{"t":"～ことにする","note":"自己做出決定。「受けることにしました」=決定去打(疫苗)。","id":"n3-50","t_en":"～ことにする","note_en":"Making one's own decision: 受けることにしました = I decided to get it."},{"t":"～そうです(傳聞)","note":"聽說。「違うそうですが」「かかるそうです」=聽別人說的,不是自己確認的。","id":"n4-3","t_en":"～そうです (hearsay)","note_en":"“I hear that…” — information from someone else, not confirmed by the speaker."},{"t":"～ておく","note":"事先做好準備。「受けておく」=(在流行前)先打好。","id":"n3-68","t_en":"～ておく","note_en":"Doing something in advance: 受けておく = get it done beforehand."}],"publish_at":"2026-10-19T08:00:00+08:00"},
{"id":"a-n3-13","level":"n3","topic":"生活","topic_en":"Daily life","title":"不在票が入っていたら","title_zh":"收到不在通知單的時候","title_en":"When You Find a Missed-Delivery Slip","body":"仕事から帰ると、郵便受けに一枚の紙が入っていた。宅配便の「不在連絡票」だ。\n留守の間に荷物が届いたので、もう一度届けてくれるように頼まなければならない。これを「再配達」という。\n以前は紙に書かれた番号に電話をするのが普通だったが、今はスマホで簡単に申し込める。紙にあるQRコードを読み取って、希望の日と時間帯を選ぶだけで済む。\nただし、不在票には保管期限も書いてある。早めに手続きしないと、荷物が送り主に返されてしまうこともあるので注意したい。\n一方で、再配達にはトラックの燃料も人手もかかる。ドライバー不足が社会問題になっている今、なるべく一度で受け取ることが求められている。\nそこで便利なのが「置き配」や宅配ボックスだ。玄関の前やボックスに荷物を置いてもらえば、家にいなくても受け取れる。\n私も最近は、通販で注文するときに受け取り方法まで考えるようにしている。小さな工夫だが、自分にもドライバーにもうれしい習慣だ。","trans":["下班回到家,信箱裡多了一張紙。是宅配的「不在通知單」。","因為我不在家的時候包裹送來了,所以得請對方再送一次。這就叫做「再配達(重新配送)」。","以前一般都是打紙上寫的電話,現在用手機就能輕鬆申請。只要掃一下紙上的 QR code,選好想要的日期跟時段就搞定了。","不過,通知單上也寫著保管期限。如果不早點處理,包裹有可能會被退回給寄件人,要特別留意。","另一方面,重新配送既要耗費卡車的油錢,也要人力。在司機短缺已經變成社會問題的現在,大家都被期待盡量一次就把包裹收到。","這時候就很好用的,是「放門口配送(置き配)」和宅配箱。請對方把包裹放在玄關前或箱子裡,就算不在家也收得到。","我最近網購下單的時候,也會連收件方式一起想好。雖然只是小小的用心,但對自己和司機來說都是好習慣。"],"trans_en":["When I got home from work, there was a slip of paper in my mailbox — a delivery company's missed-delivery notice.","A package had arrived while I was out, so I have to ask them to bring it again. This is called saihaitatsu, or redelivery.","It used to be normal to call the number printed on the slip, but now you can easily request it on your phone. Just scan the QR code on the slip and choose the day and time window you want.","Note, though, that the slip also shows how long they'll hold the package. If you don't arrange it soon, it may be sent back to the sender, so be careful.","On the other hand, redelivery costs truck fuel and manpower. Now that the driver shortage has become a social issue, people are asked to receive packages on the first try whenever possible.","That's where okihai (leave-at-the-door delivery) and delivery lockers come in handy. If they leave the package at your door or in a locker, you can get it even when you're not home.","Lately, when I order something online, I also think ahead about how I'll receive it. It's a small effort, but a habit that's good for both me and the driver."],"vocab":[{"w":"郵便受け","r":"ゆうびんうけ","m":"信箱","m_en":"mailbox"},{"w":"宅配便","r":"たくはいびん","m":"宅配","m_en":"home delivery service"},{"w":"不在連絡票","r":"ふざいれんらくひょう","m":"不在通知單","m_en":"missed-delivery notice"},{"w":"留守","r":"るす","m":"不在家","m_en":"being away from home"},{"w":"再配達","r":"さいはいたつ","m":"重新配送","m_en":"redelivery"},{"w":"時間帯","r":"じかんたい","m":"時段","m_en":"time slot"},{"w":"保管期限","r":"ほかんきげん","m":"保管期限","m_en":"holding period"},{"w":"送り主","r":"おくりぬし","m":"寄件人","m_en":"sender"},{"w":"人手","r":"ひとで","m":"人力、人手","m_en":"manpower"},{"w":"置き配","r":"おきはい","m":"放門口配送","m_en":"leave-at-door delivery"},{"w":"通販","r":"つうはん","m":"網購、郵購","m_en":"online / mail-order shopping"}],"grammar":[{"t":"～ように頼む","note":"請求別人做某事(間接引述請求內容)。「届けてくれるように頼まなければならない」=得拜託對方再送來。","id":"n3-54","t_en":"～ように頼む","note_en":"Asking someone to do something (indirect request): 届けてくれるように頼む = ask them to deliver it."},{"t":"～だけで済む","note":"只要做~就解決了,不需要更多。「選ぶだけで済む」=只要選一下就搞定。","t_en":"～だけで済む","note_en":"“All it takes is ~.” 選ぶだけで済む = you only need to choose."},{"t":"～ないと","note":"「如果不~(就會…)」,後面多接不好的結果。「早めに手続きしないと、…返されてしまう」。","t_en":"～ないと","note_en":"“If you don't ~ (something bad happens).” 手続きしないと、返されてしまう."},{"t":"～ようにしている","note":"刻意養成的習慣。「考えるようにしている」=我都會盡量去想好。","id":"n3-39","t_en":"～ようにしている","note_en":"A habit one makes a point of keeping: 考えるようにしている = I make a point of thinking about it."}],"publish_at":"2026-10-26T08:00:00+08:00"},
{"id":"a-n2-11","level":"n2","topic":"文化","topic_en":"Culture","title":"居酒屋の「お通し」","title_zh":"居酒屋的「お通し」","title_en":"Otoshi: The Izakaya Dish You Didn't Order","body":"日本の居酒屋で席に着くと、注文していないのに小鉢が運ばれてくることがある。これが「お通し」だ。\n関西では「突き出し」と呼ばれることも多く、枝豆や煮物、和え物など、中身は店によってさまざまである。\n初めて日本を訪れた人の中には、会計の際にお通し代が加算されているのを見て、不当な請求ではないかと戸惑う人も少なくない。\n相場はだいたい三百円から五百円程度と言われ、店にとっては席料に近い意味合いを持っている。\nまた、料理が出てくるまでの間、客を手持ち無沙汰にさせないための心遣いだという見方もある。\nとはいえ、断れるかどうかは店の方針次第であり、最近はお通しを出さない店も増えつつある。気になるなら、店に入るときに一言確かめておけば済む話だ。\n背景を知っていれば、見慣れない小鉢も、日本の飲み文化の一部として楽しめるのではないだろうか。","trans":["在日本的居酒屋一坐下來,有時明明沒點,店家卻端上一小碟菜。這就是「お通し」。","在關西也常被叫做「突き出し」,毛豆、燉菜、涼拌菜等等,內容每家店都不一樣。","第一次來日本的人當中,有不少人結帳時看到帳單多了一筆お通し費,會困惑是不是被亂收錢。","一般行情據說大約是三百到五百日圓,對店家來說,意義比較接近座位費。","另外,也有人認為這是店家的一份貼心,讓客人在等菜上桌的這段時間不會閒得發慌。","話雖如此,能不能拒絕要看店家的方針,最近不提供お通し的店也越來越多。如果會在意,進門時先問一句就好了。","只要了解背後的來由,就算是沒見過的小菜,也能當作日本喝酒文化的一部分好好享受吧。"],"trans_en":["When you sit down at a Japanese izakaya, a small dish sometimes arrives even though you didn't order it. This is otoshi.","In the Kansai region it's often called tsukidashi, and what you get varies by restaurant — edamame, simmered dishes, dressed vegetables and so on.","Quite a few first-time visitors to Japan are puzzled when they see an otoshi charge added to the bill, and wonder whether they've been overcharged.","The going rate is said to be roughly 300 to 500 yen, and for the restaurant it works much like a table charge.","Some also see it as a courtesy, so that guests aren't left with nothing to do while they wait for their food.","That said, whether you can decline it depends on the restaurant's policy, and more and more places no longer serve otoshi at all. If it bothers you, just ask when you walk in.","Once you know the background, even an unfamiliar little dish can be enjoyed as part of Japan's drinking culture."],"vocab":[{"w":"居酒屋","r":"いざかや","m":"居酒屋","m_en":"izakaya, Japanese pub"},{"w":"小鉢","r":"こばち","m":"小碟、小碗","m_en":"small bowl / side dish"},{"w":"お通し","r":"おとおし","m":"(居酒屋的)開胃小菜","m_en":"otoshi, a small appetizer served on arrival"},{"w":"会計","r":"かいけい","m":"結帳","m_en":"bill, paying the check"},{"w":"加算","r":"かさん","m":"加算、加上","m_en":"addition (to a total)"},{"w":"戸惑う","r":"とまどう","m":"困惑、不知所措","m_en":"to be puzzled"},{"w":"相場","r":"そうば","m":"行情","m_en":"going rate"},{"w":"意味合い","r":"いみあい","m":"含意、意味","m_en":"connotation, implication"},{"w":"手持ち無沙汰","r":"てもちぶさた","m":"閒著沒事、閒得發慌","m_en":"having nothing to do"},{"w":"心遣い","r":"こころづかい","m":"貼心、關懷","m_en":"consideration, thoughtfulness"},{"w":"方針","r":"ほうしん","m":"方針","m_en":"policy"}],"grammar":[{"t":"～際(に)","note":"「~的時候」,比「とき」正式。「会計の際に」=結帳的時候。","id":"n2-51","t_en":"～際(に)","note_en":"A formal “when ~ / on the occasion of ~”: 会計の際に = when paying the bill."},{"t":"～次第","note":"「取決於~、要看~」。「店の方針次第であり」=要看店家的方針。","id":"n2-6","t_en":"～次第","note_en":"“Depends on ~”: 店の方針次第 = depends on the restaurant's policy."},{"t":"～つつある","note":"某種變化正在持續進行中。「増えつつある」=正在逐漸增加。","id":"n2-1","t_en":"～つつある","note_en":"A change in progress: 増えつつある = is steadily increasing."},{"t":"とはいえ","note":"「話雖如此」,承認前面的說法,再提出保留或相反的觀點。","id":"n2-12","t_en":"とはいえ","note_en":"“That said / even so” — accepts the previous point, then adds a reservation."}],"publish_at":"2026-11-02T08:00:00+08:00"},
{"id":"a-n3-14","level":"n3","topic":"文化","topic_en":"Culture","title":"紅葉狩りに出かけよう","title_zh":"一起去賞楓吧","title_en":"Let's Go See the Autumn Leaves","body":"十月の終わりに、同僚の田中さんから「今週末、紅葉を見に行きませんか」と誘われた。日本では秋に山や公園で色づいた葉を楽しむことを「紅葉狩り」と呼び、昔から親しまれてきた。私は紅葉が好きだが、有名な場所は人が多いと聞いていたので、少し心配になった。\n田中さんは「人込みを避けるために、朝早く出発するのはどうでしょうか」と提案してくれた。昼になると駐車場も道路も混むので、午前のうちに着くようにすれば、ゆっくり歩けるそうだ。平日のほうが空いていることが多いが、いつも静かなわけではないので、期待しすぎないほうがいい。\n次に、観光協会や天気のサイトで公開されている「紅葉情報」を調べることにした。そこには「色づき始め」「見ごろ」などの言葉で、木の様子が分かりやすく書かれている。見ごろは場所によって変わるので、出かける前に確認するように田中さんが教えてくれた。相談の結果、山に近い小さな公園を選び、朝一番の電車で行くことにした。\n当日は少し眠かったが、早起きしたかいがあって、道にはほとんど人がいなかった。赤や黄色の葉が朝の光に照らされて、まるで空気まで色づいているように見えた。忙しい毎日の中では、季節が変わるのをゆっくり感じる機会は多くない。帰りに「誘ってくださって、ありがとうございました」とお礼を言った。田中さんが「来年も行きましょう」と笑ったので、私は次の秋が今から楽しみになった。","trans":["十月底,同事田中先生/小姐邀我:「這個週末要不要去看楓葉?」在日本,秋天到山上或公園欣賞變色的葉子稱為「紅葉狩り」,自古以來深受人們喜愛。我很喜歡楓葉,但聽說有名的地方人很多,所以有點擔心。","田中提議:「為了避開人潮,早上早點出發如何?」中午以後停車場和道路都會塞車,所以如果在上午就抵達,據說可以悠閒地散步。平日雖然多半比較空,但並不是總是很安靜,所以最好不要期待過高。","接著,我們決定查詢觀光協會或天氣網站上公開的「紅葉情報」。那裡用「開始變色」「最佳觀賞期」等詞彙,清楚地寫出樹木的狀況。田中提醒我,最佳觀賞期會因地點而異,所以出發前要再確認一下。討論的結果,我們選了靠近山的小公園,決定搭一早的電車前往。","當天雖然有點睏,但早起很值得,路上幾乎沒有人。紅色和黃色的葉子被晨光照亮,看起來彷彿連空氣都染上了顏色。在忙碌的每一天裡,能慢慢感受季節變化的機會並不多。回程時我向田中道謝:「謝謝您邀請我。」田中笑著說「明年也一起來吧」,所以我從現在就開始期待下一個秋天了。"],"trans_en":["At the end of October, my coworker Tanaka invited me, saying, \"Would you like to go see the autumn leaves this weekend?\" In Japan, enjoying the colored leaves in mountains and parks in autumn is called \"momijigari,\" and people have loved it for a long time. I like autumn leaves, but I had heard that famous places are crowded, so I felt a little worried.","Tanaka suggested, \"To avoid the crowds, how about leaving early in the morning?\" Parking lots and roads get crowded by noon, so if we arrive in the morning, we can reportedly walk around at our leisure. Weekdays are often emptier, but they are not always quiet, so it is better not to expect too much.","Next, we decided to check the \"autumn leaf reports\" published on tourist association and weather websites. They describe the condition of the trees in clear terms such as \"starting to change color\" and \"at its best.\" Tanaka told me that the best time varies by place, so I should check again before leaving. After talking it over, we chose a small park near the mountains and decided to take the first train in the morning.","I was a little sleepy that day, but getting up early paid off, and there were hardly any people on the path. The red and yellow leaves lit by the morning light made it look as if even the air had taken on color. In our busy daily lives, we don't have many chances to feel the seasons change slowly. On the way home, I thanked Tanaka politely for inviting me. Tanaka smiled and said, \"Let's go again next year,\" so I started looking forward to next autumn already."],"vocab":[{"w":"紅葉狩り","r":"もみじがり","m":"賞楓、賞紅葉","m_en":"going to see autumn leaves"},{"w":"同僚","r":"どうりょう","m":"同事","m_en":"coworker"},{"w":"人込み","r":"ひとごみ","m":"人潮、擁擠的人群","m_en":"crowd"},{"w":"避ける","r":"さける","m":"避開","m_en":"to avoid"},{"w":"提案","r":"ていあん","m":"提議、建議","m_en":"suggestion"},{"w":"紅葉情報","r":"こうようじょうほう","m":"楓葉(變色)情報","m_en":"autumn leaf report"},{"w":"見ごろ","r":"みごろ","m":"最佳觀賞期","m_en":"best time to view"},{"w":"色づく","r":"いろづく","m":"變色、染上顏色","m_en":"to change color"},{"w":"照らす","r":"てらす","m":"照亮","m_en":"to light up, to shine on"},{"w":"機会","r":"きかい","m":"機會","m_en":"chance, opportunity"}],"grammar":[{"t":"〜ように(請求・目的)","note":"表示為了達成某狀態而做某事,或請對方做某事。例:「確認するように田中さんが教えてくれた」「午前のうちに着くようにすれば」。","t_en":"~you ni (purpose / request)","note_en":"Expresses doing something so that a state is achieved, or advising someone to do something. e.g. 「確認するように田中さんが教えてくれた」.","id":"n3-54"},{"t":"〜わけではない","note":"表示「並不是……」,部分否定。例:「いつも静かなわけではないので」。","t_en":"~wake dewa nai","note_en":"Means \"it does not mean that...\"; a partial negation. e.g. 「いつも静かなわけではないので」.","id":"n3-43"},{"t":"〜ことにする","note":"表示說話者自己決定做某事。例:「紅葉情報を調べることにした」「朝一番の電車で行くことにした」。","t_en":"~koto ni suru","note_en":"Expresses the speaker's own decision to do something. e.g. 「紅葉情報を調べることにした」."},{"t":"敬語(くださる)","note":"「〜てくださる」是「〜てくれる」的尊敬說法,用於感謝對方的好意。例:「誘ってくださって、ありがとうございました」。","t_en":"Honorific ~te kudasaru","note_en":"The respectful form of ~te kureru, used to thank someone for their kindness. e.g. 「誘ってくださって、ありがとうございました」."}],"publish_at":"2026-10-19T08:00:00+08:00"},
{"id":"a-n5-12","level":"n5","topic":"生活","topic_en":"Daily life","title":"コンビニの おでん","title_zh":"便利商店的關東煮","title_en":"Oden at the Convenience Store","body":"ふゆ の よる、コンビニ に 入りました。レジ の よこ に おでん が ありました。いい におい が して、おなか が すきました。\n「だいこん と たまご を ください」と 言いました。てんいん さん が「つゆ と からし は いりますか」と 聞きました。わたし は「つゆ だけ ください」と 言いました。\nうち に かえって、すぐ 食べました。あつい おでん で、からだ が あたたかく なりました。","trans":["冬天的晚上,我走進了便利商店。收銀台旁邊有關東煮。聞到很香的味道,肚子餓了。","我說:「請給我白蘿蔔和蛋。」店員問:「要湯和黃芥末嗎?」我說:「只要湯就好。」","回到家,馬上就吃了。熱熱的關東煮讓身體暖和起來了。"],"trans_en":["On a winter night, I went into a convenience store. There was oden next to the register. It smelled good, and I got hungry.","I said, \"Daikon and an egg, please.\" The clerk asked, \"Would you like broth and mustard?\" I said, \"Just the broth, please.\"","I went home and ate it right away. The hot oden warmed my body."],"vocab":[{"w":"おでん","r":"おでん","m":"關東煮","m_en":"oden (Japanese hot-pot stew)"},{"w":"だいこん","r":"だいこん","m":"白蘿蔔","m_en":"daikon radish"},{"w":"たまご","r":"たまご","m":"蛋","m_en":"egg"},{"w":"レジ","r":"レジ","m":"收銀台","m_en":"cash register"},{"w":"つゆ","r":"つゆ","m":"湯汁","m_en":"broth"},{"w":"からし","r":"からし","m":"黃芥末(辣味的調味料)","m_en":"Japanese mustard (spicy condiment)"},{"w":"てんいん","r":"てんいん","m":"店員","m_en":"store clerk"},{"w":"におい","r":"におい","m":"味道、氣味","m_en":"smell"},{"w":"あたたかい","r":"あたたかい","m":"溫暖的","m_en":"warm"},{"w":"入る","r":"はいる","m":"進入","m_en":"to enter"}],"grammar":[{"t":"〜を ください","note":"用來向對方要東西、點餐。例:「だいこん と たまご を ください」。只要某樣東西時可用「だけ」,例:「つゆ だけ ください」。","t_en":"〜を ください","note_en":"Used to ask for something or order. Example: \"だいこん と たまご を ください.\" Add だけ for \"only\": \"つゆ だけ ください.\""},{"t":"〜と 言いました/聞きました","note":"「と」引用說話或提問的內容。例:「てんいん さん が『つゆ と からし は いりますか』と 聞きました」。","t_en":"〜と 言いました / 聞きました","note_en":"と quotes what someone said or asked. Example: \"てんいん さん が『つゆ と からし は いりますか』と 聞きました.\""},{"t":"動詞て形、〜","note":"用「て」連接前後動作或原因。例:「いい におい が して、おなか が すきました」「うち に かえって、すぐ 食べました」。","t_en":"Verb te-form, 〜","note_en":"The te-form links actions or gives a reason. Examples: \"いい におい が して、おなか が すきました\" and \"うち に かえって、すぐ 食べました.\""},{"t":"い形容詞く なります","note":"表示狀態的變化。例:「からだ が あたたかく なりました」(身體變暖和了)。","t_en":"i-adjective (〜く) + なります","note_en":"Shows a change of state. Example: \"からだ が あたたかく なりました\" (My body became warm).”"}],"publish_at":"2026-10-26T08:00:00+08:00"},
{"id":"a-n4-13","level":"n4","topic":"文化","topic_en":"Culture","title":"七五三の日","title_zh":"七五三之日","title_en":"The Day of Shichi-Go-San","body":"十一月のある土曜日、わたしは友だちと近くの神社へ散歩に行きました。境内には、きれいな着物を着た子どもたちと家族がたくさんいました。小さい女の子は赤い着物を着て、うれしそうに写真をとっていました。\n日本人の友だちの田中さんが、これは七五三だと教えてくれました。七五三は、三歳、五歳、七歳になった子どもの成長を祝う行事です。家族は神社でお祈りをしてもらって、元気に育つようにお願いします。\n田中さんは、子どもたちが持っている長い紙のふくろを指さしました。中には千歳あめという細長いあめが入っています。長生きしてほしいという家族の願いがこめられているそうです。千歳あめは和菓子屋さんなどでも買えると、田中さんは言いました。もし将来子どもができたら、わたしも千歳あめを用意してお祝いしたいです。","trans":["十一月的某個星期六,我和朋友去附近的神社散步。神社境內有許多穿著漂亮和服的孩子和家人。一個小女孩穿著紅色和服,開心地拍著照片。","日本朋友田中先生告訴我,這是七五三。七五三是為長到三歲、五歲、七歲的孩子慶祝成長的習俗。家人會請神社為孩子祈福,並祈願孩子健康長大。","田中先生指著孩子們手上拿的長長紙袋。裡面裝著一種叫「千歳飴」的細長糖果。據說這裡面寄託了家人希望孩子長壽的心願。田中先生說,和菓子店等地方也買得到千歳飴。如果將來我有了孩子,也想準備千歳飴來慶祝。"],"trans_en":["On a Saturday in November, I went for a walk to a nearby shrine with a friend. There were many children in beautiful kimono and their families on the shrine grounds. A little girl in a red kimono was having her picture taken, looking happy.","My Japanese friend Tanaka-san told me that this was Shichi-Go-San. Shichi-Go-San is a custom that celebrates the growth of children who have reached the ages of three, five and seven. Families have a prayer said for them at the shrine and wish for the children to grow up healthy.","Tanaka-san pointed at the long paper bags the children were holding. Inside is a long, thin candy called Chitose-ame. I heard that it carries the family's wish for the child to live a long life. Tanaka-san said you can also buy Chitose-ame at Japanese sweet shops and similar places. If I have children someday, I'd like to prepare Chitose-ame and celebrate too."],"vocab":[{"w":"神社","r":"じんじゃ","m":"神社","m_en":"shrine"},{"w":"境内","r":"けいだい","m":"神社的境內","m_en":"shrine grounds"},{"w":"着物","r":"きもの","m":"和服","m_en":"kimono"},{"w":"成長","r":"せいちょう","m":"成長","m_en":"growth"},{"w":"祝う","r":"いわう","m":"慶祝、祝賀","m_en":"to celebrate"},{"w":"行事","r":"ぎょうじ","m":"活動、儀式、習俗","m_en":"event, ceremony"},{"w":"育つ","r":"そだつ","m":"長大、成長","m_en":"to grow up"},{"w":"千歳あめ","r":"ちとせあめ","m":"千歳飴(祈求長壽的細長糖果)","m_en":"Chitose-ame (long candy symbolizing long life)"},{"w":"長生き","r":"ながいき","m":"長壽","m_en":"long life"},{"w":"願い","r":"ねがい","m":"願望、心願","m_en":"wish"}],"grammar":[{"t":"〜てくれる/〜てもらう","note":"表示別人為自己做某事。「田中さんが…教えてくれました」是對方主動幫忙;「お祈りをしてもらって」是請對方做某事、受到好處。","t_en":"~te kureru / ~te morau","note_en":"Express that someone does something for you. 'Tanaka-san ga ... oshiete kuremashita' means he told me as a favor; 'oinori o shite moratte' means having the prayer done for them."},{"t":"〜そうだ(樣態・傳聞)","note":"接在い形容詞或動詞語幹後,表示「看起來…」:「うれしそうに写真をとっていました」。接普通形後則表示傳聞「聽說…」:「願いがこめられているそうです」。","t_en":"~sou da (appearance / hearsay)","note_en":"After a stem it means 'looks like': 'ureshisou ni shashin o totte imashita'. After the plain form it means 'I heard that': 'negai ga komerarete iru sou desu'."},{"t":"〜たら","note":"表示假設或條件,「如果…的話」:「もし将来子どもができたら、わたしも…お祝いしたいです」。","t_en":"~tara","note_en":"Expresses a condition, 'if/when': 'moshi shourai kodomo ga dekitara, watashi mo ... oiwai shitai desu'."},{"t":"可能形","note":"表示「能夠…」。「買える」是「買う」的可能形:「和菓子屋さんなどでも買える」。","t_en":"Potential form","note_en":"Expresses ability or possibility. 'Kaeru' is the potential form of 'kau': 'wagashiya-san nado demo kaeru'.","id":"n4-52"}],"publish_at":"2026-11-02T08:00:00+08:00"},
{"id":"a-n5-13","level":"n5","topic":"生活","topic_en":"Daily life","title":"ふゆ の かいもの","title_zh":"冬天的購物","title_en":"Winter Shopping","body":"さいきん とても さむく なりました。 土曜日、友だち と 店 へ 行きました。\nわたし は 黒い コート が ほしかった です。 友だち が「赤い の も いい よ」と 言いました。 店 の 人 に「きても いい ですか」と 聞きました。\n赤い コート は とても きれい でした。 コート と てぶくろ と マフラー を 買いました。 ぜんぶ わたし の すきな 色 です。","trans":["最近變得很冷了。星期六,我和朋友一起去了店裡。","我本來想要黑色的外套。朋友說:「紅色的也不錯喔。」我問店員:「可以穿穿看嗎?」","紅色的外套非常漂亮。我買了外套、手套和圍巾。全部都是我喜歡的顏色。"],"trans_en":["It has become very cold lately. On Saturday, I went to a shop with my friend.","I wanted a black coat. My friend said, \"A red one is nice too.\" I asked the shop staff, \"May I try it on?\"","The red coat was very pretty. I bought a coat, gloves and a scarf. They are all colors I like."],"vocab":[{"w":"土曜日","r":"どようび","m":"星期六","m_en":"Saturday"},{"w":"友だち","r":"ともだち","m":"朋友","m_en":"friend"},{"w":"店","r":"みせ","m":"店、商店","m_en":"shop, store"},{"w":"コート","r":"コート","m":"外套","m_en":"coat"},{"w":"てぶくろ","r":"てぶくろ","m":"手套","m_en":"gloves"},{"w":"マフラー","r":"マフラー","m":"圍巾","m_en":"scarf, muffler"},{"w":"黒い","r":"くろい","m":"黑色的","m_en":"black"},{"w":"赤い","r":"あかい","m":"紅色的","m_en":"red"},{"w":"色","r":"いろ","m":"顏色","m_en":"color"},{"w":"聞きました","r":"ききました","m":"問了(聞く的過去式)","m_en":"asked (past of 聞く)"}],"grammar":[{"t":"〜く なりました","note":"形容詞去掉「い」加「く」再接「なりました」,表示狀態的變化。例:「さいきん とても さむく なりました。」","t_en":"〜ku narimashita","note_en":"Drop い from an i-adjective, add く and なりました to show a change of state. Example: 「さいきん とても さむく なりました。」"},{"t":"〜が ほしい です","note":"表示想要某樣東西。過去的「想要」用「ほしかった です」。例:「わたし は 黒い コート が ほしかった です。」","t_en":"〜ga hoshii desu","note_en":"Expresses wanting something. Use ほしかった です for the past. Example: 「わたし は 黒い コート が ほしかった です。」"},{"t":"〜ても いい ですか","note":"詢問「可以…嗎?」,用來請求許可,例如試穿時問店員。例:「きても いい ですか」。","t_en":"〜te mo ii desu ka","note_en":"Used to ask permission, such as asking staff if you may try something on. Example: 「きても いい ですか」."},{"t":"A と B と C を 買いました","note":"用「と」連接名詞,表示「A 和 B 和 C」。例:「コート と てぶくろ と マフラー を 買いました。」","t_en":"A to B to C","note_en":"と joins nouns to mean \"A and B and C\". Example: 「コート と てぶくろ と マフラー を 買いました。」"}],"publish_at":"2026-11-09T08:00:00+08:00"},
{"id":"a-n3-15","level":"n3","topic":"職場","topic_en":"Work","title":"初めての年末調整","title_zh":"第一次的年末調整","title_en":"My First Year-End Tax Adjustment","body":"年末が近づいたころ、人事部から「年末調整のご案内」というメールと書類が届いた。書類には家族の扶養状況や保険料を書く欄があり、何から書けばいいのかわからなかった。日本で働くのは初めてで、「年末調整」という言葉自体、聞いたことがなかったのである。\n隣の席の田中さんに聞くと、「毎年の手続きですから、心配はいりませんよ」と言ってくれた。毎月の給料から引かれる税金は仮の計算で、年末に一年分を計算し直すのだそうだ。家族の状況や払った保険料によって税金が変わるため、正しく書くことが大切だという。ただし、書き方は会社で少し違うので、わからない点は人事に直接聞くように言われた。\n翌日、人事の佐藤さんに質問に行くと、記入例を見せながら一つずつ丁寧に説明してくれた。自分で払った保険がある場合は、保険会社から届く証明書が必要になることもあるそうだ。質問するのが嫌なわけではなかったが、忙しそうな人事に声をかけにくいと思っていた。しかし佐藤さんは「初めてなら聞いて当然ですよ」と笑って答えてくれた。\n帰宅してから、家にある保険の書類を探し、書く内容をゆっくり確認することにした。詳しい手続きや提出の方法は会社によって違うので、必ず会社の説明を確認してほしい。年末調整は面倒に見えるが、一年分の税金を正しく合わせる大切な手続きなのだと分かった。","trans":["年底快到的時候,人事部寄來了「年末調整說明」的郵件和文件。文件上有填寫家人扶養狀況和保險費的欄位,我不知道該從哪裡開始寫。我第一次在日本工作,連「年末調整」這個詞本身都沒聽過。","我問了隔壁座位的田中先生,他說:「這是每年都要做的手續,不用擔心喔。」據說每個月從薪水扣掉的稅金只是暫時的計算,到了年底會把一整年的稅金重新算過。因為稅金會隨著家人的狀況和所付的保險費而改變,所以正確填寫很重要。不過,填法會因公司而稍有不同,所以他叫我不懂的地方直接去問人事。","隔天,我去問人事的佐藤小姐,她一邊給我看填寫範例,一邊一項一項仔細說明。據說如果有自己繳費的保險,有時還需要保險公司寄來的證明書。我並不是討厭發問,只是覺得人事看起來很忙,不太好意思開口。不過佐藤小姐笑著回答:「第一次的話,當然要問啊。」","回到家後,我決定找出家裡的保險文件,慢慢確認要寫的內容。詳細的手續和繳交方式會因公司而異,請務必確認公司的說明。年末調整看起來很麻煩,但我了解到它是把一整年的稅金正確調整好的重要手續。"],"trans_en":["As the end of the year approached, the HR department sent an email titled \"Year-End Adjustment Guide\" along with some documents. The forms had fields for family dependents and insurance premiums, and I had no idea where to start. It was my first time working in Japan, and I had never even heard the term \"year-end adjustment.\"","I asked Tanaka, who sits next to me, and he said, \"It's a procedure we do every year, so don't worry.\" Apparently the tax taken from your monthly pay is a provisional calculation, and at the end of the year the full year is recalculated. Because the tax changes depending on your family situation and the insurance premiums you paid, it is important to fill in the forms correctly. However, the way to fill them in differs a little by company, so I was told to ask HR directly about anything I didn't understand.","The next day I went to ask Sato in HR, and she explained everything patiently one item at a time while showing me a sample. Apparently, if you pay for some insurance yourself, you may also need a certificate sent by the insurance company. It wasn't that I disliked asking questions, but HR looked busy and I found it hard to approach them. Still, Sato smiled and said, \"If it's your first time, of course you should ask.\"","After getting home, I decided to look for my insurance papers and calmly check what I needed to write. The detailed procedures and submission methods differ by company, so please be sure to check the explanations from your company or ward office. Year-end adjustment looks troublesome, but I came to understand that it is an important procedure for properly settling a full year's taxes."],"vocab":[{"w":"年末調整","r":"ねんまつちょうせい","m":"年末調整(年底重新結算所得稅)","m_en":"year-end tax adjustment"},{"w":"人事部","r":"じんじぶ","m":"人事部門","m_en":"HR department"},{"w":"扶養","r":"ふよう","m":"扶養","m_en":"dependent support"},{"w":"保険料","r":"ほけんりょう","m":"保險費","m_en":"insurance premium"},{"w":"手続き","r":"てつづき","m":"手續","m_en":"procedure"},{"w":"記入例","r":"きにゅうれい","m":"填寫範例","m_en":"sample of how to fill in"},{"w":"証明書","r":"しょうめいしょ","m":"證明書","m_en":"certificate"},{"w":"確認","r":"かくにん","m":"確認","m_en":"to check, confirmation"},{"w":"丁寧","r":"ていねい","m":"仔細、有禮貌","m_en":"careful, polite"},{"w":"給料","r":"きゅうりょう","m":"薪水","m_en":"salary"}],"grammar":[{"t":"〜ように言われた","note":"表示被人叮囑、要求去做某事(間接引用)。例:「わからない点は人事に直接聞くように言われた」","t_en":"~ように言われた","note_en":"Indicates being told to do something (indirect instruction). Example: 「わからない点は人事に直接聞くように言われた」"},{"t":"〜わけではない","note":"表示「並不是……」,部分否定,否定可能的誤解。例:「質問するのが嫌なわけではなかったが」","t_en":"~わけではない","note_en":"Means \"it is not that...\"; a partial negation that rules out a possible misunderstanding. Example: 「質問するのが嫌なわけではなかったが」","id":"n3-43"},{"t":"〜ことにする","note":"表示說話者自己決定做某事。例:「ゆっくり確認することにした」","t_en":"~ことにする","note_en":"Expresses the speaker's own decision to do something. Example: 「ゆっくり確認することにした」"},{"t":"〜そうだ(傳聞)","note":"接在普通形後,表示聽來的消息。例:「年末に一年分を計算し直すのだそうだ」","t_en":"~そうだ (hearsay)","note_en":"Attached to the plain form to report something heard from others. Example: 「年末に一年分を計算し直すのだそうだ」"}],"publish_at":"2026-11-09T08:00:00+08:00"},
{"id":"a-n4-14","level":"n4","topic":"生活","topic_en":"Daily life","title":"冬の電気代","title_zh":"冬天的電費","title_en":"Winter Electricity Bills","body":"日本の冬は、家の中でも思ったよりずっと寒いです。古い部屋は窓から冷気が入って、暖房をつけてもあたたまりにくいです。先月、請求書を見たら、電気代がいつもより高くてびっくりしました。友だちに話すと、節約のコツをいろいろ教えてもらいました。\nまず、電気毛布を使って、寝る前にふとんをあたためておきます。加湿器をつけると、部屋の温度が同じでも、あたたかく感じられるそうです。厚いカーテンに換えたら、窓の近くの冷たさがかなり減りました。暖房の設定温度を少し低めにして、上着を着て過ごしています。\n田中さんは、使わない部屋の暖房を消すといいと教えてくれました。料金プランについては、詳しいことを電力会社に聞いてみるといいです。少しの工夫を続ければ、寒い冬も電気代を気にしすぎずに過ごせそうです。","trans":["日本的冬天,即使在家裡也比想像中冷得多。老房子的冷空氣會從窗戶進來,就算開了暖氣也不容易暖起來。上個月我一看帳單,發現電費比平常高,嚇了一跳。我跟朋友聊起這件事,朋友教了我很多省電的訣竅。","首先,我用電毯,在睡前先把被窩暖好。聽說開了加濕器之後,就算室溫一樣,也會覺得比較暖和。換成厚窗簾之後,窗邊的冷意減少了很多。我把暖氣的設定溫度調得稍微低一點,再穿上外套過日子。","田中先生告訴我,不用的房間把暖氣關掉比較好。關於電費方案,最好向電力公司詢問詳細內容。只要持續做一些小小的用心,今年冬天看起來也能不用太擔心電費地度過。"],"trans_en":["In Japan, winters are much colder than I expected, even inside the house. In an old room, cold air comes in through the windows, so it is hard to warm up even with the heater on. When I looked at the bill last month, the electricity cost was higher than usual and I was surprised. When I talked to a friend, I was given many saving tips.","First, I use an electric blanket and warm up the futon before going to bed. I heard that if you turn on a humidifier, the room feels warmer even at the same temperature. After I changed to thick curtains, the chill near the window decreased a lot. I set the heater's temperature a little lower and wear a jacket at home.","Mr. Tanaka told me it is good to turn off the heater in rooms you do not use. For details about rate plans, it is best to ask the electric company. If I keep making small efforts, it looks like I can get through the cold winter without worrying too much about the bill."],"vocab":[{"w":"暖房","r":"だんぼう","m":"暖氣","m_en":"heating"},{"w":"冷気","r":"れいき","m":"冷空氣","m_en":"cold air"},{"w":"請求書","r":"せいきゅうしょ","m":"帳單、請款單","m_en":"bill, invoice"},{"w":"電気代","r":"でんきだい","m":"電費","m_en":"electricity bill"},{"w":"節約","r":"せつやく","m":"節約、省","m_en":"saving, economizing"},{"w":"電気毛布","r":"でんきもうふ","m":"電毯","m_en":"electric blanket"},{"w":"加湿器","r":"かしつき","m":"加濕器","m_en":"humidifier"},{"w":"厚い","r":"あつい","m":"厚的","m_en":"thick"},{"w":"設定温度","r":"せっていおんど","m":"設定溫度","m_en":"set temperature"},{"w":"工夫","r":"くふう","m":"用心想辦法、巧思","m_en":"ingenuity, a clever idea"}],"grammar":[{"t":"〜たら","note":"表示「做了之後(發現)……」或假設條件。例:「請求書を見たら、電気代がいつもより高くて」「厚いカーテンに換えたら、窓の近くの冷たさがかなり減りました」。","t_en":"〜tara","note_en":"Means 'when/if I did ~' and often leads to a discovery or result. Example: 「請求書を見たら、電気代がいつもより高くて」."},{"w":"","t":"可能形","note":"表示「能夠……」。例:「あたたかく感じられる」「過ごせそうです」。一段動詞用「られる」,五段動詞改成「え段+る」。","t_en":"Potential form","note_en":"Expresses 'can do'. Examples: 「感じられる」「過ごせそうです」. Ichidan verbs take 〜られる; godan verbs change the final vowel to the e-row + る.","id":"n4-52"},{"t":"〜そうだ","note":"兩種用法:接普通形表示「聽說」,接動詞ます形去掉ます表示「看起來」。例:「あたたかく感じられるそうです」(傳聞)、「過ごせそうです」(樣態)。","t_en":"〜sou da","note_en":"Two uses: after plain form it means hearsay ('I heard that'); after the verb stem it means 'looks like'. Examples: 「感じられるそうです」(hearsay), 「過ごせそうです」(appearance)."},{"t":"〜てもらう/〜てくれる","note":"表示接受別人為自己做某事(授受表現)。例:「いろいろ教えてもらいました」「教えてくれました」。〜てもらう以自己為主語,〜てくれる以對方為主語。","t_en":"〜te morau / 〜te kureru","note_en":"Giving and receiving expressions for favors. Examples: 「教えてもらいました」「教えてくれました」. 〜te morau has the receiver as subject; 〜te kureru has the giver as subject."}],"publish_at":"2026-11-16T08:00:00+08:00"},
{"id":"a-n2-12","level":"n2","topic":"社会","topic_en":"Society","title":"勤労感謝の日を考える","title_zh":"思考勤勞感謝日","title_en":"Thinking About Labor Thanksgiving Day","body":"十一月二十三日は「勤労感謝の日」で、毎年この日は多くの会社や学校が休みになる国民の祝日である。名前だけを見ると働く人のための日だと思いがちだが、もともとの由来は少し違っている。古くから日本では、秋にその年に取れた新しい穀物を神に供えて感謝する「新嘗祭」という儀式が行われてきた。新嘗祭は、収穫を祝い自然の恵みに感謝するという、農業を大切にしてきた社会の考えを表す行事だった。\n戦後、国の制度が大きく見直される中で、祝日のあり方も整理されることになった。一九四八年に「国民の祝日に関する法律」が定められ、この日は「勤労感謝の日」として国民の祝日になった。法律には、勤労をたっとび、生産を祝い、国民がたがいに感謝し合う日という趣旨が示されている。神への感謝が、働くことや作ることそのものへの感謝へと広がった、と考えると分かりやすい。\n現代では、働き方が多様になるに伴って、「勤労」という言葉から思い浮かべる姿も変わってきた。工場や田畑で働く人はもちろん、店、物流、医療、介護など、生活を支える仕事は数えきれない。しかも、そうした仕事の中には、祝日であっても休むどころか、いつも以上に働かざるを得ないものもある。私たちが当たり前のように使っている便利さは、そうした人たちの努力の上に成り立っているのだ。\nでは、感謝を形にするには、どのような行動が考えられるのだろうか。荷物を届けてくれた人や店員さんに、「ありがとうございます」と声をかけるだけでも、気持ちは十分に伝わる。職場でも、同僚の仕事ぶりを認めて礼を言うことは、この日をきっかけにすぐ始められる小さな習慣である。なお、祝日の勤務や休みの扱いは会社ごとに異なるので、詳しくは会社の説明を確認してほしい。感謝の気持ちは、祝日の一日だけでなく、毎日の暮らしの中で言葉にしてこそ意味を持つのではないだろうか。","trans":["11月23日是「勤勞感謝日」,每年這一天許多公司和學校都會放假,是國民的節日。光看名稱,容易以為這是專為上班族設的日子,但它原本的由來有些不同。日本自古以來,每到秋天就會舉行「新嘗祭」儀式,將當年收成的新穀物供奉給神明並表達感謝。新嘗祭是一項慶祝收穫、感謝大自然恩惠的活動,表現出一個重視農業的社會的想法。","戰後,在國家制度被大幅重新檢討的過程中,節日的樣貌也隨之整理。1948年制定了《國民節日相關法律》,這一天便以「勤勞感謝日」之名成為國民的節日。法律中揭示的宗旨是:崇尚勤勞、慶祝生產,並讓國民彼此互相感謝。可以理解為:對神明的感謝,擴大成了對工作與創造本身的感謝。","在現代,隨著工作方式日益多元,我們從「勤勞」一詞聯想到的身影也改變了。除了在工廠和田地工作的人之外,商店、物流、醫療、照護等支撐生活的工作多得數不清。而且這些工作之中,有些即使在假日也別說能休息,甚至不得不比平常更辛苦地工作。我們習以為常享用的便利,正是建立在這些人的努力之上。","那麼,要把感謝化為行動,可以怎麼做呢?對送來包裹的人或店員說一聲「謝謝」,心意就已經足夠傳達了。在職場上,認可同事的工作表現並道謝,也是能以這一天為契機立刻開始的小習慣。此外,假日的出勤與休假處理方式因公司而異,詳情請確認公司的說明。感謝的心意不只在假日這一天,而是在日常生活中說出口,才有意義,不是嗎?"],"trans_en":["November 23 is Labor Thanksgiving Day, a national holiday when many companies and schools are closed every year. From the name alone, people tend to think it is a day just for workers, but its original origin is a little different. Since ancient times in Japan, a ceremony called Niinamesai has been held in autumn, offering the newly harvested grain of the year to the gods in thanks. Niinamesai was an event that celebrated the harvest and gave thanks for nature's blessings, reflecting the outlook of a society that valued farming.","After the war, as the country's systems were thoroughly reviewed, the way holidays were organized was also arranged anew. In 1948 the Act on National Holidays was enacted, and this day became a national holiday under the name Labor Thanksgiving Day. The law states the purpose of the day as honoring labor, celebrating production, and letting citizens thank one another. It is easy to understand if you think of it as gratitude toward the gods widening into gratitude for working and making things themselves.","Today, as ways of working have become more diverse, the images that come to mind from the word 'labor' have changed too. Besides people working in factories and fields, there are countless jobs that support daily life, such as shops, logistics, medical care, and nursing care. Moreover, some of these jobs, far from getting a break on a holiday, cannot help but work even harder than usual. The convenience we take for granted rests on the efforts of such people.","So what can we do to turn gratitude into action? Even just saying 'thank you' to a delivery person or a store clerk is enough to get the feeling across. At work, too, acknowledging a colleague's efforts and thanking them is a small habit you can start right away, using this day as a chance. Please note that how working on holidays or taking days off is handled differs by company, so check your company's explanation for details. Gratitude gains meaning when we put it into words in everyday life, not just on one holiday, don't you think?"],"vocab":[{"w":"由来","r":"ゆらい","m":"由來、起源","m_en":"origin"},{"w":"新嘗祭","r":"にいなめさい","m":"新嘗祭(感謝新穀收成的祭典)","m_en":"Niinamesai (harvest thanksgiving ritual)"},{"w":"収穫","r":"しゅうかく","m":"收穫、收成","m_en":"harvest"},{"w":"制度","r":"せいど","m":"制度","m_en":"system, institution"},{"w":"趣旨","r":"しゅし","m":"宗旨、主旨","m_en":"purpose, intent"},{"w":"多様","r":"たよう","m":"多樣、多元","m_en":"diverse"},{"w":"物流","r":"ぶつりゅう","m":"物流","m_en":"logistics"},{"w":"支える","r":"ささえる","m":"支撐、支持","m_en":"to support"},{"w":"成り立つ","r":"なりたつ","m":"成立、建立在……之上","m_en":"to be based on, to hold together"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某變化,另一件事也跟著變化。例:「働き方が多様になるに伴って、『勤労』という言葉から思い浮かべる姿も変わってきた」","t_en":"〜に伴って","note_en":"As one thing changes, another changes along with it. Example: '働き方が多様になるに伴って、…姿も変わってきた' (As ways of working diversified, the images also changed)."},{"t":"〜どころか","note":"表示「不但不……反而……」,否定前項、強調後項。例:「祝日であっても休むどころか、いつも以上に働かざるを得ない」","t_en":"〜どころか","note_en":"Far from X, rather Y; denies the first part and stresses the second. Example: '休むどころか、いつも以上に働かざるを得ない' (far from resting, they must work more than usual).","id":"n2-25"},{"t":"〜ざるを得ない","note":"表示「不得不……」,在情況所迫下沒有其他選擇。例:「いつも以上に働かざるを得ないものもある」","t_en":"〜ざるを得ない","note_en":"Cannot help but; have no choice but to do. Example: '働かざるを得ないものもある' (some jobs leave no choice but to work).","id":"n2-35"},{"t":"〜をきっかけに","note":"表示以某事為契機而開始做某事。例:「この日をきっかけにすぐ始められる小さな習慣である」","t_en":"〜をきっかけに","note_en":"Using something as a trigger or opportunity to begin something. Example: 'この日をきっかけにすぐ始められる小さな習慣' (a small habit you can start right away, using this day as a chance).","id":"n2-59"}],"publish_at":"2026-11-16T08:00:00+08:00"},
{"id":"a-n5-14","level":"n5","topic":"生活","topic_en":"Daily life","title":"ともだち と なべ","title_zh":"和朋友一起吃火鍋","title_en":"Hot Pot with Friends","body":"冬 の 日、ともだち と うち で なべ を しました。まず、みんな で スーパー へ いきました。はくさい と とうふ と 肉 を 買いました。\nうち で やさい を 切って、なべ に 入れました。やさい を 先 に、肉 は あと で 入れました。へや が あたたかく なりました。\nみんな で いっしょ に たべる と、おいしい です。さむい よる でした が、たのしかった です。","trans":["冬天的某一天,我和朋友在家吃火鍋。首先大家一起去了超市。我們買了白菜、豆腐和肉。","在家把蔬菜切一切,放進鍋子裡。蔬菜先放,肉後放。房間變得暖和了。","大家一起吃,很好吃。雖然是寒冷的夜晚,但是很開心。"],"trans_en":["One winter day, I had hot pot with my friends at home. First, we all went to the supermarket. We bought napa cabbage, tofu, and meat.","At home, we cut the vegetables and put them in the pot. We put the vegetables in first and the meat later. The room became warm.","When we eat together, it is delicious. It was a cold night, but it was fun."],"vocab":[{"w":"冬","r":"ふゆ","m":"冬天","m_en":"winter"},{"w":"なべ","r":"なべ","m":"鍋;火鍋","m_en":"pot; hot pot"},{"w":"スーパー","r":"スーパー","m":"超市","m_en":"supermarket"},{"w":"はくさい","r":"はくさい","m":"白菜","m_en":"napa cabbage"},{"w":"とうふ","r":"とうふ","m":"豆腐","m_en":"tofu"},{"w":"肉","r":"にく","m":"肉","m_en":"meat"},{"w":"入れる","r":"いれる","m":"放入","m_en":"to put in"},{"w":"先に","r":"さきに","m":"先","m_en":"first; before"},{"w":"あたたかい","r":"あたたかい","m":"溫暖的","m_en":"warm"},{"w":"みんな","r":"みんな","m":"大家","m_en":"everyone"}],"grammar":[{"t":"〜て、〜(動詞て形)","note":"用て形把兩個動作連起來,表示先做前面再做後面。例:「やさい を 切って、なべ に 入れました。」","t_en":"Verb て-form, ~","note_en":"The て-form links actions in order. Example: 「やさい を 切って、なべ に 入れました。」(We cut the vegetables and put them in the pot.)"},{"t":"〜と、〜","note":"表示「一做…就會…」的一般結果或感覺。例:「いっしょ に たべる と、おいしい です。」","t_en":"~ to, ~ (when/if)","note_en":"Shows a natural result when something is done. Example: 「いっしょ に たべる と、おいしい です。」(When we eat together, it is delicious.)"},{"t":"〜く なります","note":"い形容詞變成「〜く」加「なります」,表示狀態變化。例:「へや が あたたかく なりました。」","t_en":"i-adjective + く なります","note_en":"Shows a change of state. Example: 「へや が あたたかく なりました。」(The room became warm.)"},{"t":"〜が、〜","note":"接在句尾後面,表示「雖然…但是…」的轉折。例:「さむい よる でした が、たのしかった です。」","t_en":"~ ga, ~ (but)","note_en":"Connects two contrasting clauses. Example: 「さむい よる でした が、たのしかった です。」(It was a cold night, but it was fun.)"}],"publish_at":"2026-11-23T08:00:00+08:00"},
{"id":"a-n3-16","level":"n3","topic":"文化","topic_en":"Culture","title":"喪中はがきが届いたら","title_zh":"收到喪中明信片時","title_en":"When a Mourning Postcard Arrives","body":"十一月の初めに、会社の同僚の田中さんから一枚のはがきが届いた。開けてみると、「喪中につき、年始のご挨拶をご遠慮申し上げます」と書いてあった。今年の夏に田中さんのお父さんが亡くなったことを、私はそのとき初めて知った。\nこれは「喪中はがき」といって、家族に不幸があった人が年賀状を出さないことを知らせるものだ。喪に服している間はお祝いごとを控えるという考え方から、この習慣が生まれた。はがきは年賀状の準備が始まる前に届くことが多く、相手に早めに知らせるためのものだ。喪中はがきは「私は年賀状を出せません」という知らせであって、返事を求めているわけではない。\n私は少し迷ったが、同僚に聞いて、田中さんには年賀状を出さないことにした。代わりに、年が明けてしばらくしてから「寒中見舞い」を送ると、気持ちが伝わると教えてもらった。寒中見舞いは、寒い季節に相手の体を気づかう挨拶状で、お祝いの言葉は書かない。文面には、はがきを受け取ったお礼と、田中さんの家族を思う言葉を入れるように心がけた。\n会社の年賀状の扱いは職場によって違うので、詳しくは会社の説明を確認しておこう。年賀状の習慣は少しずつ減っているが、季節の挨拶で気持ちを伝える文化は今も大切にされている。今回の経験から、相手の状況を思いやって挨拶の形を変えることも、職場の大切なマナーだと学んだ。","trans":["十一月初,公司同事田中先生寄來一張明信片。打開一看,上面寫著「因服喪,謹不寄送新年問候,敬請見諒」。我這時才第一次知道,田中先生的父親在今年夏天過世了。","這叫做「喪中明信片」,是家中有喪事的人用來通知對方自己不寄年賀狀的東西。因為有「服喪期間要避免慶祝之事」的想法,才形成了這個習慣。明信片多半在年賀狀開始準備之前寄到,是為了提早告知對方。喪中明信片是在告知「我無法寄年賀狀」,並不是要求對方回覆。","我有點猶豫,但問過同事後,決定不寄年賀狀給田中先生。同事還告訴我,可以改在過完年、過一陣子之後寄「寒中見舞い」,就能傳達心意。寒中見舞い是在寒冷季節關心對方身體的問候信,不寫祝賀的話。我在內容裡特別留意,寫上收到明信片的謝意,以及對田中先生家人的關懷。","公司對年賀狀的處理方式因職場而異,詳情請以公司的說明為準。年賀狀的習慣雖然逐漸減少,但用季節問候傳達心意的文化,至今仍受到重視。這次的經驗讓我學到,體諒對方的處境、改變問候的形式,也是職場上重要的禮儀。"],"trans_en":["In early November, a postcard arrived from my coworker Mr. Tanaka. When I opened it, it said, \"Due to mourning, we respectfully refrain from sending New Year greetings.\" Only then did I learn that Mr. Tanaka's father had passed away this summer.","This is called a \"mochu hagaki,\" a card that tells people that someone who has lost a family member will not send New Year cards. The custom comes from the idea that one should refrain from celebrations during the mourning period. These cards often arrive before people start preparing New Year cards, so they let others know early. A mourning postcard simply says \"I cannot send a New Year card\"; it does not ask for a reply.","I hesitated a little, but after asking a coworker, I decided not to send a New Year card to Mr. Tanaka. I was also told that sending a \"kanchu mimai\" a little after the New Year begins would convey my feelings. A kanchu mimai is a greeting card that shows concern for the other person's health in the cold season, and it contains no celebratory words. I tried to include thanks for the postcard and words of care for Mr. Tanaka's family.","How New Year cards are handled at work differs by workplace, so please check your company's explanation for details. The custom of New Year cards is slowly declining, but the culture of conveying feelings through seasonal greetings is still valued today. From this experience, I learned that considering the other person's situation and changing the form of a greeting is also an important workplace manner."],"vocab":[{"w":"喪中","r":"もちゅう","m":"服喪期間","m_en":"mourning period"},{"w":"年賀状","r":"ねんがじょう","m":"新年賀卡","m_en":"New Year card"},{"w":"亡くなった","r":"なくなった","m":"過世了","m_en":"passed away"},{"w":"挨拶","r":"あいさつ","m":"問候、致意","m_en":"greeting"},{"w":"遠慮","r":"えんりょ","m":"客氣、避免(做某事)","m_en":"refraining, restraint"},{"w":"控える","r":"ひかえる","m":"節制、避免","m_en":"to refrain from"},{"w":"寒中見舞い","r":"かんちゅうみまい","m":"寒中問候(寒冷季節的問候信)","m_en":"midwinter greeting card"},{"w":"気づかう","r":"きづかう","m":"關心、掛念","m_en":"to show concern for"},{"w":"習慣","r":"しゅうかん","m":"習慣、慣例","m_en":"custom, habit"},{"w":"心がけた","r":"こころがけた","m":"留意、努力做到","m_en":"kept in mind, made an effort"}],"grammar":[{"t":"〜ことにする","note":"表示自己決定做某事。例:「田中さんには年賀状を出さないことにした。」","t_en":"~koto ni suru","note_en":"Expresses a personal decision. Example: 「田中さんには年賀状を出さないことにした。」(I decided not to send a New Year card to Mr. Tanaka.)"},{"t":"〜わけではない","note":"表示「並不是……」,部分否定或否定誤解。例:「返事を求めているわけではない。」","t_en":"~wake dewa nai","note_en":"Means \"it does not mean that...\"; it denies a possible assumption. Example: 「返事を求めているわけではない。」(It does not mean a reply is being requested.)","id":"n3-43"},{"t":"〜ように心がける","note":"表示為了達成某個目標而努力留意。例:「お礼と、田中さんの家族を思う言葉を入れるように心がけた。」","t_en":"~you ni kokorogakeru","note_en":"Means to make an effort so that something happens. Example: 「言葉を入れるように心がけた。」(I tried to include words of care.)"},{"t":"〜によって違う","note":"表示「依……而不同」。例:「会社の年賀状の扱いは職場によって違う。」","t_en":"~ni yotte chigau","note_en":"Means \"differs depending on...\". Example: 「職場によって違う」(It differs depending on the workplace.)"}],"publish_at":"2026-11-23T08:00:00+08:00"},
{"id":"a-n4-15","level":"n4","topic":"生活","topic_en":"Daily life","title":"年末の大そうじ、早めに始めよう","title_zh":"年末大掃除,提早開始吧","title_en":"Start the Year-End Cleaning Early","body":"毎年十二月になると、大そうじが大変で、いつも疲れてしまいます。今年は十二月の前に、そうじする場所をリストに書いてみました。台所、おふろ、まど、げんかんなど、いくつもありました。\n次に、ドラッグストアで洗剤やスポンジを買いました。店の人が、おふろ用の洗剤はカビも落とせると教えてくれました。一度に全部やると疲れるので、毎週一か所だけそうじすることにしました。今週は台所、来週はおふろ、というように決めました。\nルームメイトのリンさんにも話したら、いっしょにやると言ってくれました。わたしは台所とおふろ、リンさんはまどとげんかんを担当します。大きいごみは、出し方を区役所の案内で調べる必要があります。友だちの話では、早く始めると気持ちも楽になるそうです。この方法なら、年末もゆっくり休めそうだと思います。","trans":["每年一到十二月,大掃除就很辛苦,我總是累壞了。今年我在十二月之前,先把要打掃的地方寫成清單。廚房、浴室、窗戶、玄關等等,有好多處。","接著,我在藥妝店買了清潔劑和海綿。店員告訴我,浴室用的清潔劑也能去除黴菌。一次全部做會很累,所以我決定每週只打掃一個地方。我決定了這週廚房、下週浴室,就這樣排下去。","我跟室友小林提起這件事,她說願意一起做。我負責廚房和浴室,小林負責窗戶和玄關。大型垃圾的丟法,需要看區公所的說明來確認。聽朋友說,早點開始,心情也會比較輕鬆。我想這樣的話,年底應該也能好好休息了。"],"trans_en":["Every December, the big cleaning is hard and I always get tired. This year, before December, I tried writing a list of places to clean. There were many: the kitchen, bathroom, windows, entryway, and more.","Next, I bought cleaning products and sponges at a drugstore. A store clerk told me that the bathroom cleaner can also remove mold. Doing everything at once is tiring, so I decided to clean just one place each week. I decided like this: the kitchen this week, the bathroom next week.","When I talked to my roommate, Lin, she said she would do it together with me. I will take the kitchen and bathroom, and Lin will take the windows and entryway. For large trash, I need to check how to dispose of it in the ward office's guide. I heard from a friend that starting early makes you feel more relaxed. With this method, it seems I will be able to rest calmly at year-end too."],"vocab":[{"w":"大そうじ","r":"おおそうじ","m":"大掃除","m_en":"big cleaning"},{"w":"年末","r":"ねんまつ","m":"年底","m_en":"year-end"},{"w":"台所","r":"だいどころ","m":"廚房","m_en":"kitchen"},{"w":"洗剤","r":"せんざい","m":"清潔劑、洗劑","m_en":"detergent, cleaner"},{"w":"毎週","r":"まいしゅう","m":"每週","m_en":"every week"},{"w":"一度に","r":"いちどに","m":"一次地、同時","m_en":"at one time"},{"w":"担当","r":"たんとう","m":"負責","m_en":"being in charge of"},{"w":"区役所","r":"くやくしょ","m":"區公所","m_en":"ward office"},{"w":"気持ち","r":"きもち","m":"心情","m_en":"feeling, mood"}],"grammar":[{"t":"〜たら","note":"表示「做了某事之後/如果」,常接後面的發展。文中例句:「ルームメイトのリンさんにも話したら、いっしょにやると言ってくれました。」","t_en":"〜たら (when/if)","note_en":"Shows what happened after doing something, or a condition. Example: 「ルームメイトのリンさんにも話したら、いっしょにやると言ってくれました。」"},{"w":"","t":"可能形","note":"表示「能夠做到」。文中例句:「おふろ用の洗剤はカビも落とせると教えてくれました。」(落とす→落とせる)、「ゆっくり休めそうだ」(休む→休める)","t_en":"Potential form","note_en":"Expresses ability or possibility. Example: 「カビも落とせる」(落とす→落とせる), 「ゆっくり休めそうだ」(休む→休める).","id":"n4-52"},{"t":"〜てくれる(授受)","note":"表示別人為我做某事,帶有感謝的語氣。文中例句:「店の人が、…教えてくれました。」「いっしょにやると言ってくれました。」","t_en":"〜てくれる (giving/receiving)","note_en":"Someone does something for me, with a feeling of gratitude. Example: 「店の人が、…教えてくれました。」"},{"t":"〜そうだ","note":"有兩種用法:①接在動詞ます形去ます後,表示「看起來快要/似乎會」,如「休めそうだ」;②接在普通形後,表示聽來的傳聞,如「気持ちも楽になるそうです」。","t_en":"〜そうだ","note_en":"Two uses: (1) stem + そうだ = 'looks like', as in 「休めそうだ」; (2) plain form + そうだ = hearsay, as in 「気持ちも楽になるそうです」."}],"publish_at":"2026-11-30T08:00:00+08:00"},
{"id":"a-n2-13","level":"n2","topic":"職場","topic_en":"Work","title":"変わる忘年会、変わらない心配り","title_zh":"改變中的忘年會,不變的體貼","title_en":"Changing Year-End Parties, Unchanging Consideration","body":"年末が近づくと、日本の職場ではこれまで「忘年会」の話題が自然と出てきたものだ。一年の苦労を忘れて親睦を深めるという意味があり、かつては参加するのが当然だと考えられていた。ところが近年、仕事のあとの時間を自分のために使いたいと考え、参加を望まない人が増えている。それに伴って、夜の宴会をやめて昼のランチ会にしたり、参加を自由にしたりする会社も目立つようになった。\n背景には、価値観の多様化や、家庭や介護との両立を優先したいという事情がある。上司との席は気楽に楽しめるどころか、気を使って疲れるだけだと感じる若手も少なくない。一方で、普段は話せない同僚と交流できる貴重な機会だと考え、開催を歓迎する人がいるのも事実だ。会社としては、強制すれば不満が高まりかねないため、それぞれの事情に配慮した形を探さざるを得ない。\n誘われたときに断る場合は、まず誘ってくれたことへの感謝を伝えるのが基本である。たとえば「お誘いありがとうございます。あいにく先約がありまして」と断れば、角が立たない。理由を細かく説明しすぎると言い訳に聞こえることもあるので、簡潔に伝えて「またの機会にぜひ」と添えるとよい。逆に参加する場合も、飲めないときはウーロン茶で乾杯してよいし、早めに帰る旨を最初に伝えておくと気が楽だ。\n参加しない人を冷たいと見たり、参加する人を付き合いがいいだけだと決めつけたりするのは避けたい。幹事の側も、案内を出す際に「参加は自由です」と一言添えれば、断る側の心理的な負担はずっと軽くなる。大切なのは、形式そのものよりも、お互いの事情や気持ちを尊重しようとする姿勢ではないだろうか。忘年会がランチ会に変わっても、人と人との信頼を育てる場であることに変わりはない。","trans":["每到年底,日本的職場過去自然都會聊起「忘年會」。它有忘掉一年辛勞、增進感情的意義,以前大家認為參加是理所當然的。然而近年來,越來越多人希望把下班後的時間留給自己,不想參加。隨之而來的是,不少公司不再辦晚上的聚餐,改成午餐會,或讓員工自由參加。","背景包括價值觀多元化,以及想優先兼顧家庭與照護的各種情況。有些年輕員工覺得和上司同席別說輕鬆愉快,反而因為要顧慮很多而只覺得累,這樣的人並不少。另一方面,也有人認為這是能和平常難得交談的同事交流的寶貴機會,因而歡迎舉辦,這也是事實。對公司來說,若強制參加可能會引起不滿,因此不得不尋找能顧及各人情況的形式。","被邀請而要拒絕時,基本做法是先為對方的邀請表達感謝。例如說「謝謝您的邀請,很不巧我已有約在先」,就不會傷到和氣。理由若解釋得太細,有時聽起來像藉口,所以簡潔說明,再補上一句「下次有機會一定參加」會比較好。反過來,若決定參加,不能喝酒時可以用烏龍茶乾杯,並事先說明會早點離開,心情也會比較輕鬆。","我們應避免把不參加的人視為冷淡,或斷定參加的人只是為了人情世故。負責籌辦的人在發通知時,若加上一句「參加與否自由」,拒絕的一方心理負擔就會輕得多。重要的不是形式本身,而是想尊重彼此處境與心情的態度,不是嗎?即使忘年會變成午餐會,它作為培養人與人之間信賴的場合,這一點並沒有改變。"],"trans_en":["When the end of the year approaches, talk of the “bōnenkai” (year-end party) used to come up naturally in Japanese workplaces. It was meant to let people forget a year of hardship and build closer ties, and attending was once considered a matter of course. In recent years, however, more people want to spend their after-work hours on themselves and prefer not to take part. Along with this, more companies have dropped evening banquets in favor of lunch gatherings or made attendance voluntary.","Behind this are diversifying values and the wish to put family life and caregiving first. Some younger employees find that sitting with their boss is anything but relaxing and simply tiring because of all the attention they must pay. On the other hand, it is also true that some see it as a valuable chance to talk with colleagues they rarely speak to and welcome the event. Companies, for their part, have no choice but to look for formats that take individual circumstances into account, since forcing people could easily raise dissatisfaction.","When declining an invitation, the basic approach is first to thank the person for inviting you. For example, saying “Thank you for the invitation; unfortunately I have a prior commitment” will not cause offense. Explaining your reason in too much detail can sound like an excuse, so it is better to keep it brief and add “I hope to join next time.” Likewise, if you do attend, you can toast with oolong tea if you do not drink, and telling people at the start that you will leave early puts you at ease.","We should avoid seeing those who do not attend as cold, or assuming that those who do attend are merely being sociable. Organizers can also greatly lighten the burden on those who decline by adding a line such as “Participation is voluntary” to the invitation. What matters is not the format itself but an attitude of respecting each other’s circumstances and feelings. Even if the year-end party becomes a lunch gathering, it remains a place that builds trust between people."],"vocab":[{"w":"忘年会","r":"ぼうねんかい","m":"忘年會、年終聚餐","m_en":"year-end party"},{"w":"親睦","r":"しんぼく","m":"親睦、增進感情","m_en":"friendship, goodwill"},{"w":"価値観","r":"かちかん","m":"價值觀","m_en":"values, sense of values"},{"w":"両立","r":"りょうりつ","m":"兼顧、並存","m_en":"balancing, compatibility"},{"w":"強制","r":"きょうせい","m":"強制","m_en":"compulsion, forcing"},{"w":"配慮","r":"はいりょ","m":"顧慮、體貼","m_en":"consideration"},{"w":"先約","r":"せんやく","m":"先約、已有的約定","m_en":"prior engagement"},{"w":"幹事","r":"かんじ","m":"幹事、活動籌辦人","m_en":"organizer of an event"},{"w":"尊重","r":"そんちょう","m":"尊重","m_en":"respect"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某件事的變化,另一件事也跟著變化。例:「それに伴って、夜の宴会をやめて昼のランチ会にしたり…する会社も目立つようになった」。","t_en":"〜に伴って","note_en":"“Along with / as…”: a change in one thing accompanies a change in another. Example: 「それに伴って、夜の宴会をやめて昼のランチ会にしたり…」."},{"t":"〜どころか","note":"表示「別說是…,反而…」,否定前項並說出相反或更極端的事實。例:「気楽に楽しめるどころか、気を使って疲れるだけだと感じる」。","t_en":"〜どころか","note_en":"“Far from… / not only not…, but…”: denies the expectation and states the opposite. Example: 「気楽に楽しめるどころか、気を使って疲れるだけだ」.","id":"n2-25"},{"t":"〜かねない","note":"接動詞ます形去掉ます,表示「有可能發生(不好的事)」。例:「強制すれば不満が高まりかねない」。","t_en":"〜かねない","note_en":"“May well… / could possibly…”: a risk of something undesirable happening. Example: 「強制すれば不満が高まりかねない」.","id":"n2-38"},{"t":"〜ざるを得ない","note":"表示「不得不…」,在沒有其他選擇下只能做。例:「それぞれの事情に配慮した形を探さざるを得ない」。","t_en":"〜ざるを得ない","note_en":"“Have no choice but to…”: something must be done because there is no alternative. Example: 「事情に配慮した形を探さざるを得ない」.","id":"n2-35"}],"publish_at":"2026-11-30T08:00:00+08:00"},
{"topic":"繪本","topic_en":"Picture book","ehon":true,"id":"eh-n5-1","level":"n5","title":"はじめての コンビニ","title_zh":"第一次去便利商店","title_en":"My First Convenience Store","body":"たぬたろうは きのう 日本に 来ました。きょうは はじめて コンビニへ 行きます。\nみせの 中は とても あかるいです。おにぎりや パンや のみものが たくさん あります。\nたぬたろうは おべんとうを 一つと おちゃを 一つ えらびました。レジに もって いきます。\nてんいんさんが 「あたためますか」と ききました。たぬたろうは いみが わかりません。\n「あたためますか」は 「あつく しますか」と いう いみです。たぬたろうは 「はい、おねがいします」と いいました。\nつぎに てんいんさんが 「ふくろは いりますか」と ききました。こんどは わかります。「だいじょうぶです」と こたえました。\nあたたかい おべんとうは とても おいしかったです。たぬたろうは また コンビニに 行きたいです。","trans":["狸太郎昨天來到日本。今天第一次要去便利商店。","店裡非常明亮。飯糰、麵包、飲料有好多好多。","狸太郎選了一個便當和一瓶茶。拿到收銀台。","店員問:「あたためますか?」狸太郎聽不懂是什麼意思。","「あたためますか」就是「要幫你加熱嗎?」的意思。狸太郎說:「好,麻煩你了。」","接著店員問:「需要袋子嗎?」這次他聽懂了。他回答:「不用了,沒關係。」","熱熱的便當非常好吃。狸太郎還想再去便利商店。"],"trans_en":["Tanutaro came to Japan yesterday. Today he is going to a convenience store for the first time.","The store is very bright inside. There are lots of rice balls, bread and drinks.","Tanutaro picked one bento and one bottle of tea. He takes them to the register.","The clerk asked, \"Atatamemasu ka?\" Tanutaro does not understand what it means.","\"Atatamemasu ka\" means \"Shall I heat it up?\" Tanutaro said, \"Yes, please.\"","Next the clerk asked, \"Do you need a bag?\" This time he understands. He answered, \"I'm fine, thanks.\"","The warm bento was very tasty. Tanutaro wants to go to the convenience store again."],"vocab":[{"w":"コンビニ","r":"コンビニ","m":"便利商店","m_en":"convenience store"},{"w":"初めて","r":"はじめて","m":"第一次","m_en":"for the first time"},{"w":"お弁当","r":"おべんとう","m":"便當","m_en":"boxed meal, bento"},{"w":"選ぶ","r":"えらぶ","m":"選擇","m_en":"to choose"},{"w":"レジ","r":"レジ","m":"收銀台","m_en":"register, checkout"},{"w":"店員","r":"てんいん","m":"店員","m_en":"store clerk"},{"w":"温める","r":"あたためる","m":"加熱、弄熱","m_en":"to heat up, to warm"},{"w":"意味","r":"いみ","m":"意思","m_en":"meaning"},{"w":"袋","r":"ふくろ","m":"袋子","m_en":"bag"},{"w":"答える","r":"こたえる","m":"回答","m_en":"to answer"}],"grammar":[{"id":"n5-68","t":"〜という","note":"「A という いみです」= A 就是…的意思,用來解釋一個詞。例:「あたためますか」は「あつく しますか」と いう いみです。","t_en":"〜という","note_en":"\"A to iu imi desu\" = \"A means …\". Used to explain a word. Example: 「あたためますか」は「あつく しますか」と いう いみです。"},{"id":"n5-57","t":"〜たいです","note":"動詞ます形去掉ます+たいです,表示「想要做…」。例:また コンビニに 行きたいです。","t_en":"〜たいです","note_en":"Verb stem + たいです = \"want to do …\". Example: また コンビニに 行きたいです。"},{"id":"n5-27","t":"〜と(並列)","note":"名詞と名詞,把東西全部列出來。例:おべんとうを 一つと おちゃを 一つ。","t_en":"〜と (and)","note_en":"Noun と noun lists every item. Example: おべんとうを 一つと おちゃを 一つ。"}]},
{"topic":"繪本","topic_en":"Picture book","ehon":true,"id":"eh-n5-2","level":"n5","title":"えきで まいご","title_zh":"在車站迷路了","title_en":"Lost at the Station","body":"きょうは いい てんきです。たぬたろうは でんしゃで うみへ 行きます。\nえきは とても 大きいです。人も たくさん います。うみへ 行く でんしゃは 何ばんせんですか。たぬたろうは わかりません。\nちずを 見ましたが、もっと わからなく なりました。たぬたろうは こまりました。\nそこへ キツネの コンちゃんが 来ました。「どう しましたか」と ききました。\nたぬたろうは 「すみません、うみへ 行く でんしゃは どこですか」と ききました。\nコンちゃんは 「3ばんせんですよ、あそこの かいだんを のぼって ください」と おしえました。\nたぬたろうは 「ありがとうございます」と いって、はしりました。でんしゃに まにあいました！","trans":["今天天氣很好。狸太郎要搭電車去海邊。","車站好大。人也好多。去海邊的電車在幾號月台呢?狸太郎不知道。","他看了地圖,反而更搞不懂了。狸太郎好苦惱。","這時狐狸コン走了過來。問他:「怎麼了嗎?」","狸太郎問:「不好意思,去海邊的電車在哪裡?」","コン告訴他:「在 3 號月台喔,從那邊的樓梯上去。」","狸太郎說了聲「謝謝」,就跑了起來。趕上電車了!"],"trans_en":["The weather is nice today. Tanutaro is taking the train to the sea.","The station is very big. There are lots of people too. Which platform is the train to the sea? Tanutaro does not know.","He looked at the map, but got even more confused. Tanutaro was stuck.","Just then Kon the fox came by. \"What's wrong?\" Kon asked.","Tanutaro asked, \"Excuse me, where is the train to the sea?\"","Kon told him, \"It's platform 3. Please go up those stairs over there.\"","Tanutaro said \"Thank you very much\" and ran. He made the train!"],"vocab":[{"w":"駅","r":"えき","m":"車站","m_en":"station"},{"w":"迷子","r":"まいご","m":"迷路(的人)","m_en":"lost person, being lost"},{"w":"電車","r":"でんしゃ","m":"電車","m_en":"train"},{"w":"番線","r":"ばんせん","m":"…號月台","m_en":"platform number"},{"w":"地図","r":"ちず","m":"地圖","m_en":"map"},{"w":"困る","r":"こまる","m":"困擾、傷腦筋","m_en":"to be in trouble, to be stuck"},{"w":"階段","r":"かいだん","m":"樓梯","m_en":"stairs"},{"w":"上る","r":"のぼる","m":"往上走、爬","m_en":"to go up, to climb"},{"w":"教える","r":"おしえる","m":"告訴、教","m_en":"to tell, to teach"},{"w":"間に合う","r":"まにあう","m":"趕上、來得及","m_en":"to make it in time"}],"grammar":[{"id":"n5-55","t":"〜てください","note":"動詞て形+ください,客氣地請對方做某事。例:あそこの かいだんを のぼって ください。","t_en":"〜てください","note_en":"Verb te-form + ください politely asks someone to do something. Example: あそこの かいだんを のぼって ください。"},{"id":"n5-63","t":"疑問詞(どこ・何)","note":"問地點用「どこ」,問號碼用「何ばんせん」。例:うみへ 行く でんしゃは どこですか。","t_en":"Question words (doko / nan)","note_en":"Use どこ for \"where\" and 何ばんせん for \"which platform\". Example: うみへ 行く でんしゃは どこですか。"},{"id":"n5-10","t":"〜くなります","note":"い形容詞去掉い+くなります,表示「變得…」。ない也一樣:わからない→わからなく なりました(變得更不懂)。","t_en":"〜くなります","note_en":"i-adjective minus い + くなります = \"become …\". Same with ない: わからない → わからなく なりました (\"got more confused\")."}]},
{"topic":"繪本","topic_en":"Picture book","ehon":true,"id":"eh-n4-1","level":"n4","title":"かぜをひいた日","title_zh":"感冒的那一天","title_en":"The Day I Caught a Cold","body":"朝起きると、頭が痛くて、のどもとても痛かったです。熱もあるようです。\nたぬたろうは会社に電話して、「すみません、かぜをひいたので、今日は休ませてください」と言いました。\nそれから、近くのクリニックへ行きました。受付で保険証を出して、問診票を書きました。\nお医者さんに「いつからですか」と聞かれました。「きのうの夜からで、せきも出ます」と答えました。\n「ただのかぜですね、薬を飲んで、ゆっくり休んだほうがいいですよ」とお医者さんが言いました。\nその夜、コンちゃんがおかゆを持ってきてくれました。温かくて、とてもおいしかったです。\n三日後、たぬたろうはすっかり元気になりました。日本で病院に行くのは少しこわかったけど、もう大丈夫です。","trans":["早上一起床,頭好痛,喉嚨也非常痛。好像也發燒了。","狸太郎打電話到公司說:「不好意思,我感冒了,今天請讓我請假。」","接著他去了附近的診所。在櫃檯拿出健保卡,填了問診單。","醫生問他:「從什麼時候開始的?」他回答:「從昨天晚上開始,也會咳嗽。」","醫生說:「只是普通感冒喔,吃了藥,好好休息比較好。」","那天晚上,コン帶了稀飯過來。熱熱的,非常好吃。","三天後,狸太郎完全恢復精神了。在日本去看病雖然有點害怕,不過現在已經沒問題了。"],"trans_en":["When he woke up, his head hurt and his throat was very sore. He seems to have a fever too.","Tanutaro called his company and said, \"I'm sorry, I caught a cold, so please let me take the day off.\"","Then he went to a nearby clinic. At reception he handed over his health insurance card and filled in a medical questionnaire.","The doctor asked him, \"Since when?\" He answered, \"Since last night, and I have a cough too.\"","The doctor said, \"It's just a cold. You should take the medicine and get plenty of rest.\"","That night, Kon brought him some rice porridge. It was warm and very tasty.","Three days later, Tanutaro was completely well again. Going to a doctor in Japan was a little scary, but now he is fine."],"vocab":[{"w":"熱","r":"ねつ","m":"發燒、熱度","m_en":"fever"},{"w":"休む","r":"やすむ","m":"請假、休息","m_en":"to take time off, to rest"},{"w":"受付","r":"うけつけ","m":"櫃檯、掛號處","m_en":"reception"},{"w":"保険証","r":"ほけんしょう","m":"健保卡","m_en":"health insurance card"},{"w":"問診票","r":"もんしんひょう","m":"問診單","m_en":"medical questionnaire"},{"w":"お医者さん","r":"おいしゃさん","m":"醫生","m_en":"doctor"},{"w":"薬","r":"くすり","m":"藥","m_en":"medicine"},{"w":"おかゆ","r":"おかゆ","m":"稀飯、粥","m_en":"rice porridge"},{"w":"すっかり","r":"すっかり","m":"完全、徹底","m_en":"completely"},{"w":"元気","r":"げんき","m":"有精神、健康","m_en":"well, healthy"}],"grammar":[{"id":"n4-7","t":"〜ので","note":"說明原因、理由,比「から」客氣,請假或道歉時很常用。例:かぜをひいたので、今日は休ませてください。","t_en":"〜ので","note_en":"Gives a reason; softer than から, so it is common when asking for leave or apologizing. Example: かぜをひいたので、今日は休ませてください。"},{"id":"n4-11","t":"〜ほうがいいです","note":"動詞た形+ほうがいいです,給對方建議「…比較好」。例:ゆっくり休んだほうがいいですよ。","t_en":"〜ほうがいいです","note_en":"Verb ta-form + ほうがいいです gives advice: \"you had better …\". Example: ゆっくり休んだほうがいいですよ。"},{"id":"n4-59","t":"受身形","note":"「(人)に〜られる」表示被別人做了某個動作。例:お医者さんに「いつからですか」と聞かれました。","t_en":"Passive form","note_en":"\"(person) に 〜られる\" means something was done to you by someone. Example: お医者さんに「いつからですか」と聞かれました。"},{"id":"n4-30","t":"〜てくれます","note":"別人為我做了某件事(帶感謝的語氣)。例:コンちゃんがおかゆを持ってきてくれました。","t_en":"〜てくれます","note_en":"Someone does something for me (with a sense of gratitude). Example: コンちゃんがおかゆを持ってきてくれました。"}]},
{"topic":"繪本","topic_en":"Picture book","ehon":true,"id":"eh-n4-2","level":"n4","title":"ラーメン屋で","title_zh":"在拉麵店","title_en":"At the Ramen Shop","body":"駅の近くに人気のラーメン屋があります。今日、たぬたろうは初めてそこに入りました。\n入口に券売機がありました。この店では、先に食券を買うそうです。\nでも、ボタンがたくさんあって、どれを押せばいいかわかりません。\nすると、後ろにいたコンちゃんが「いちばん左が普通のラーメンだよ」と教えてくれました。\n席に座って食券を渡すと、店員さんに「麺のかたさはどうしますか」と聞かれました。\nたぬたろうは「かためでお願いします」と答えました。かためは、少しかたい麺のことです。\n熱いスープとかための麺は最高でした。たぬたろうはスープを全部飲んでしまいました。","trans":["車站附近有一家很受歡迎的拉麵店。今天狸太郎第一次走進去。","入口有一台售票機。聽說這家店要先買餐券。","可是按鈕好多,不知道該按哪一個才好。","這時排在後面的コン告訴他:「最左邊是普通的拉麵喔。」","坐到位子上把餐券交出去後,店員問他:「麵的軟硬要怎麼做?」","狸太郎回答:「麻煩偏硬一點。」「かため」就是稍微硬一點的麵。","熱湯配上偏硬的麵,真是太棒了。狸太郎把湯全部喝光了。"],"trans_en":["There is a popular ramen shop near the station. Today Tanutaro went in for the first time.","There was a ticket machine at the entrance. Apparently at this shop you buy a meal ticket first.","But there were so many buttons that he did not know which one to press.","Then Kon, who was behind him, told him, \"The one on the far left is regular ramen.\"","When he sat down and handed over the ticket, the clerk asked him, \"How firm would you like your noodles?\"","Tanutaro answered, \"Firm, please.\" Katame means slightly firm noodles.","The hot soup and firm noodles were the best. Tanutaro ended up drinking all of the soup."],"vocab":[{"w":"人気","r":"にんき","m":"受歡迎","m_en":"popular, popularity"},{"w":"入口","r":"いりぐち","m":"入口","m_en":"entrance"},{"w":"券売機","r":"けんばいき","m":"售票機","m_en":"ticket machine"},{"w":"食券","r":"しょっけん","m":"餐券","m_en":"meal ticket"},{"w":"押す","r":"おす","m":"按、推","m_en":"to press, to push"},{"w":"普通","r":"ふつう","m":"普通、一般","m_en":"regular, normal"},{"w":"席","r":"せき","m":"座位","m_en":"seat"},{"w":"渡す","r":"わたす","m":"交給、遞給","m_en":"to hand over"},{"w":"麺","r":"めん","m":"麵","m_en":"noodles"},{"w":"全部","r":"ぜんぶ","m":"全部","m_en":"all, everything"}],"grammar":[{"id":"n4-32","t":"〜そうです(伝聞)","note":"普通形+そうです,表示「聽說…」。例:この店では、先に食券を買うそうです。","t_en":"〜そうです (hearsay)","note_en":"Plain form + そうです = \"I hear that …\". Example: この店では、先に食券を買うそうです。"},{"id":"n4-54","t":"〜ばいい","note":"「どれを〜ばいいか」= 該…才好。例:どれを押せばいいかわかりません。","t_en":"〜ばいい","note_en":"\"dore o 〜ba ii ka\" = \"which one I should …\". Example: どれを押せばいいかわかりません。"},{"id":"n4-24","t":"〜てしまいます","note":"表示動作完全做完,也常帶「不小心就…」的語氣。例:スープを全部飲んでしまいました。","t_en":"〜てしまいます","note_en":"Shows an action was done completely, often with a nuance of \"ended up …\". Example: スープを全部飲んでしまいました。"},{"id":"n4-57","t":"〜と(條件)","note":"「A と、B」= 一做 A 就發生 B。例:食券を渡すと、店員さんに聞かれました。","t_en":"〜と (when)","note_en":"\"A と, B\" = \"when A happens, B follows\". Example: 食券を渡すと、店員さんに聞かれました。"}]},
{"topic":"繪本","topic_en":"Picture book","ehon":true,"id":"eh-n4-3","level":"n4","title":"雨の日のプレゼント","title_zh":"雨天的禮物","title_en":"A Present on a Rainy Day","body":"来週の土曜日はコンちゃんの誕生日です。コンちゃんがいつもしている青いマフラーは、もうだいぶ古くなっています。\nたぬたろうは新しいマフラーをプレゼントしようと思いました。でも、その日は朝から雨でした。\nたぬたろうは傘をさして、町の雑貨屋さんへ行きました。そこで、きれいな青いマフラーを見つけました。\n少し高かったけど、たぬたろうはそれを買うことにしました。店員さんがきれいに包んでくれました。\n帰り道、雨はもっと強くなりました。プレゼントがぬれないように、たぬたろうはかばんをしっかり抱えて走りました。\n「お誕生日おめでとう」と言ってプレゼントを渡すと、コンちゃんはとても驚きました。\n新しいマフラーをしたコンちゃんは、「ありがとう、ずっと大切にするね」と笑いました。","trans":["下週六是コン的生日。コン一直戴著的那條藍色圍巾,已經很舊了。","狸太郎決定送一條新的圍巾當禮物。可是那天從早上就在下雨。","狸太郎撐著傘,去了鎮上的雜貨店。在那裡找到了一條漂亮的藍色圍巾。","雖然有點貴,狸太郎還是決定買下來。店員幫他包裝得很漂亮。","回家的路上,雨下得更大了。為了不讓禮物淋濕,狸太郎緊緊抱著包包跑了起來。","他說了聲「生日快樂」並把禮物交給コン,コン嚇了一大跳。","圍上新圍巾的コン笑著說:「謝謝你,我會一直好好珍惜的。」"],"trans_en":["Next Saturday is Kon's birthday. The blue scarf Kon always wears has become quite old.","Tanutaro decided to give Kon a new scarf as a present. But that day it had been raining since morning.","Tanutaro put up his umbrella and went to a general store in town. There he found a pretty blue scarf.","It was a little expensive, but Tanutaro decided to buy it. The clerk wrapped it nicely for him.","On the way home, the rain got even heavier. So the present would not get wet, Tanutaro held his bag tight and ran.","When he said \"Happy birthday\" and handed over the present, Kon was very surprised.","Wearing the new scarf, Kon smiled and said, \"Thank you, I'll treasure it forever.\""],"vocab":[{"w":"誕生日","r":"たんじょうび","m":"生日","m_en":"birthday"},{"w":"マフラー","r":"マフラー","m":"圍巾","m_en":"scarf"},{"w":"傘","r":"かさ","m":"傘","m_en":"umbrella"},{"w":"雑貨屋","r":"ざっかや","m":"雜貨店","m_en":"general goods store"},{"w":"見つける","r":"みつける","m":"找到","m_en":"to find"},{"w":"包む","r":"つつむ","m":"包、包裝","m_en":"to wrap"},{"w":"濡れる","r":"ぬれる","m":"淋濕、弄濕","m_en":"to get wet"},{"w":"抱える","r":"かかえる","m":"抱著、夾在懷裡","m_en":"to hold in one's arms"},{"w":"驚く","r":"おどろく","m":"吃驚、嚇一跳","m_en":"to be surprised"},{"w":"大切","r":"たいせつ","m":"珍惜、重要","m_en":"precious, important"}],"grammar":[{"id":"n4-42","t":"〜うと思います","note":"動詞意向形+と思います,表示自己打算做某事。例:新しいマフラーをプレゼントしようと思いました。","t_en":"〜うと思います","note_en":"Volitional form + と思います = \"I think I'll …\", stating an intention. Example: 新しいマフラーをプレゼントしようと思いました。"},{"id":"n4-47","t":"〜ことにします","note":"動詞辭書形+ことにします,表示自己下了決定。例:それを買うことにしました。","t_en":"〜ことにします","note_en":"Dictionary form + ことにします = \"decide to …\". Example: それを買うことにしました。"},{"id":"n4-19","t":"〜ように(目的)","note":"「A ように、B」= 為了讓 A 的狀態成立而做 B,前面常接ない形或可能形。例:プレゼントがぬれないように、かばんをしっかり抱えて走りました。","t_en":"〜ように (so that)","note_en":"\"A ように, B\" = do B so that A happens; often follows a nai-form or potential form. Example: プレゼントがぬれないように、かばんをしっかり抱えて走りました。"},{"id":"n4-30","t":"〜てくれます","note":"別人為我做了某件事。例:店員さんがきれいに包んでくれました。","t_en":"〜てくれます","note_en":"Someone does something for me. Example: 店員さんがきれいに包んでくれました。"}]},
{"id":"a-n2-5-n3","variant_of":"a-n2-5","level":"n3","topic":"社会","topic_en":"Society","title":"広がるキャッシュレス決済","title_zh":"普及中的無現金支付","title_en":"The Spread of Cashless Payment","body":"ここ数年、日本でもキャッシュレス決済を使う人が急に増えてきた。以前は現金だけの店が多かったが、今はスマートフォンやカードで払える店が増えている。\nキャッシュレス決済には、支払いが早く、お金の管理がしやすいという良い点がある。レジで小銭を探す必要がないため、買い物の時間が短くなる。また、いつ、いくら使ったかが記録として残るので、後で確認しやすい。\n一方で、まだ解決しなければならない問題もある。停電や通信の障害が起きると、支払いができなくなるおそれがある。使いすぎてしまう人もいるし、機械の操作が苦手な高齢者もいる。そのため、こうした人たちへの配慮も忘れてはいけない。\n便利さと安心のバランスを、どのように取ればいいのだろうか。現金とキャッシュレスの両方がうまく使われる社会が求められている。","trans":["近幾年,在日本使用無現金支付的人也突然大幅增加。以前很多店只收現金,現在能用智慧型手機或信用卡付款的店越來越多。","無現金支付有付款快、金錢管理容易的優點。因為不需要在收銀台找零錢,購物的時間也會縮短。而且何時、花了多少錢都會留下記錄,所以事後也很容易確認。","另一方面,還有必須解決的問題。一旦發生停電或通訊故障,就有可能無法付款。有些人會不知不覺花過頭,也有不擅長操作機器的高齡者。因此,對這些人的體貼考量也不能忘記。","便利與安心之間,該如何取得平衡才好呢?我們需要的是一個現金與無現金兩者都能好好運用的社會。"],"trans_en":["In the last few years, the number of people using cashless payment has suddenly grown in Japan too. Many shops used to accept only cash, but now more and more shops let you pay with a smartphone or a card.","Cashless payment has the advantages of being quick to pay and making money easier to manage. Because you don't need to look for coins at the register, shopping takes less time. Also, a record remains of when and how much you spent, so it is easy to check later.","On the other hand, there are still problems that must be solved. If a power outage or a communication failure happens, you may not be able to pay. Some people end up spending too much, and some elderly people are not good at using machines. For this reason, we must not forget to consider these people.","How should we balance convenience and peace of mind? What society needs is a world where both cash and cashless payment are used well."],"vocab":[{"w":"決済","r":"けっさい","m":"結帳、支付","m_en":"payment, settlement"},{"w":"急に","r":"きゅうに","m":"突然、急速地","m_en":"suddenly, rapidly"},{"w":"管理","r":"かんり","m":"管理","m_en":"management"},{"w":"小銭","r":"こぜに","m":"零錢","m_en":"small change, coins"},{"w":"記録","r":"きろく","m":"記錄","m_en":"record"},{"w":"停電","r":"ていでん","m":"停電","m_en":"power outage"},{"w":"障害","r":"しょうがい","m":"故障、障礙","m_en":"failure, trouble"},{"w":"操作","r":"そうさ","m":"操作","m_en":"operation, handling"},{"w":"高齢者","r":"こうれいしゃ","m":"高齡者","m_en":"elderly person"},{"w":"配慮","r":"はいりょ","m":"體貼、顧慮","m_en":"consideration"}],"grammar":[{"t":"〜やすい","note":"接在動詞ます形後面,表示「容易做某事」。例:「お金の管理がしやすい」「後で確認しやすい」。","t_en":"~yasui","note_en":"Attached to the verb stem, it means easy to do something. Example: 「後で確認しやすい」."},{"t":"〜ため(原因)","note":"表示原因、理由,語氣比「から」更書面。例:「小銭を探す必要がないため、買い物の時間が短くなる」。","t_en":"~tame (reason)","note_en":"Expresses a reason or cause, more formal than から. Example: 「小銭を探す必要がないため、買い物の時間が短くなる」."},{"t":"〜おそれがある","note":"表示有發生不好事情的可能性。例:「支払いができなくなるおそれがある」。","t_en":"~osore ga aru","note_en":"Means there is a risk that something bad may happen. Example: 「支払いができなくなるおそれがある」."},{"t":"〜なければならない","note":"表示必須做某事。例:「まだ解決しなければならない問題もある」。","t_en":"~nakereba naranai","note_en":"Means must do something. Example: 「まだ解決しなければならない問題もある」."}]},
{"id":"a-n2-5-n4","variant_of":"a-n2-5","level":"n4","topic":"社会","topic_en":"Society","title":"広がるキャッシュレス","title_zh":"普及中的無現金支付","title_en":"The Spread of Cashless Payment","body":"最近、日本でもキャッシュレスで払う人が急に増えました。前は現金だけの店が多かったです。今はスマートフォンやカードで払える店が増えています。\nキャッシュレスは、払うのが早くて、お金の管理も簡単です。レジで小銭を探さなくてもいいからです。いつ、いくら使ったか、記録も残ります。\nでも、まだ問題になることもあります。停電や通信のトラブルがあると、払えなくなるかもしれません。使いすぎる人や、機械が苦手なお年寄りのことも考えなければなりません。現金とキャッシュレスを両方使える社会が大切です。","trans":["最近,在日本用無現金方式付款的人也快速增加。以前只能用現金的店很多。現在能用智慧型手機或信用卡付款的店越來越多。","無現金支付付款快,金錢管理也很簡單。因為不用在收銀台找零錢。何時、花了多少錢,也都會留下記錄。","不過,還是有一些問題。如果停電或通訊出問題,可能就無法付款。花太多錢的人,以及不擅長操作機器的老年人,我們也必須考慮到。能同時使用現金和無現金的社會很重要。"],"trans_en":["Recently, the number of people paying cashless has grown quickly in Japan too. In the past, many shops took only cash. Now more and more shops let you pay with a smartphone or a card.","Cashless payment is fast, and it is also easy to manage your money. This is because you don't have to look for coins at the register. A record also remains of when and how much you spent.","However, there are still some problems. If there is a power outage or a network problem, you may not be able to pay. We must also think about people who spend too much and elderly people who are not good with machines. A society where we can use both cash and cashless is important."],"vocab":[{"w":"現金","r":"げんきん","m":"現金","m_en":"cash"},{"w":"払う","r":"はらう","m":"付款、支付","m_en":"to pay"},{"w":"増える","r":"ふえる","m":"增加","m_en":"to increase"},{"w":"小銭","r":"こぜに","m":"零錢","m_en":"small change, coins"},{"w":"管理","r":"かんり","m":"管理","m_en":"management"},{"w":"記録","r":"きろく","m":"記錄","m_en":"record"},{"w":"停電","r":"ていでん","m":"停電","m_en":"power outage"},{"w":"機械","r":"きかい","m":"機器","m_en":"machine"},{"w":"お年寄り","r":"おとしより","m":"老年人","m_en":"elderly person"},{"w":"社会","r":"しゃかい","m":"社會","m_en":"society"}],"grammar":[{"t":"〜なくてもいい","note":"表示「不需要做~也可以」。例:「レジで小銭を探さなくてもいいからです」","t_en":"〜nakutemo ii","note_en":"Means you don't have to do something. Example: 「レジで小銭を探さなくてもいいからです」"},{"t":"〜かもしれません","note":"表示「也許~、可能~」。例:「払えなくなるかもしれません」","t_en":"〜kamoshiremasen","note_en":"Means something may happen. Example: 「払えなくなるかもしれません」","id":"n4-3"},{"t":"〜なければなりません","note":"表示「必須做~」。例:「お年寄りのことも考えなければなりません」","t_en":"〜nakereba narimasen","note_en":"Means you must do something. Example: 「お年寄りのことも考えなければなりません」"},{"t":"動詞ます形+すぎる","note":"表示「做得過頭、太~」。例:「使いすぎる人」","t_en":"verb stem + sugiru","note_en":"Means doing something too much. Example: 「使いすぎる人」"}]},
{"id":"a-n2-7-n3","variant_of":"a-n2-7","level":"n3","topic":"生活","topic_en":"Daily life","title":"そなえあれば","title_zh":"有備無患","title_en":"Be Prepared","body":"日本は地震や台風などの自然災害が多い国として知られています。いつ起こるか分からない災害だからこそ、日ごろから備えておくことが大切です。\nまず、家庭でできることから始めてみましょう。水や食料、懐中電灯などを用意しておくと、いざというときに安心です。それらはすぐに持ち出せる場所に置いておくようにしましょう。\n家族と話し合っておくことも忘れてはいけません。災害のときに家族がはぐれてしまうこともあるからです。どこで集まるかを決めておけば、あわてずに行動することができます。また、住んでいる地域の危険な場所を知っておくことも役に立ちます。市役所などが配る地図を見て、避難所までの道を確認しておきましょう。\n災害そのものを防ぐことはできなくても、被害を減らすことはできます。ふだんのちょっとした心がけによって、いざというときに自分や家族を守ることができるのです。","trans":["日本是以地震、颱風等自然災害頻繁而聞名的國家。正因為是不知何時會發生的災害,平時就先做好準備才特別重要。","首先,從家庭做得到的事情開始吧。如果事先準備好水、食物、手電筒等,到了緊要關頭就能安心。這些東西請盡量放在能立刻帶出去的地方。","和家人事先討論也不能忘記,因為發生災害時,家人也可能會走散。只要事先決定好在哪裡集合,就能不慌張地採取行動。另外,先了解自己居住地區的危險場所也很有幫助。看看市公所等發放的地圖,先確認前往避難所的路吧。","就算無法防止災害本身,也能減少損害。靠著平時一點點的用心,在緊要關頭就能守護自己和家人。"],"trans_en":["Japan is known as a country with many natural disasters such as earthquakes and typhoons. Precisely because we can never tell when a disaster will strike, it is important to prepare in daily life.","First, let's start with what we can do at home. If you prepare water, food, a flashlight and so on, you will feel at ease when the time comes. Try to keep these things in a place where you can take them out right away.","Don't forget to talk with your family beforehand, because family members may get separated during a disaster. If you decide where to meet, you can act without panicking. It is also useful to know the dangerous places in the area where you live. Look at the map handed out by the city hall and so on, and check the route to the evacuation center.","Even if we cannot prevent disasters themselves, we can reduce the damage. Small everyday efforts can protect you and your family when the moment comes."],"vocab":[{"w":"自然災害","r":"しぜんさいがい","m":"自然災害","m_en":"natural disaster"},{"w":"日ごろ","r":"ひごろ","m":"平時、平常","m_en":"daily life, usually"},{"w":"備える","r":"そなえる","m":"準備、防備","m_en":"to prepare, to be ready"},{"w":"用意","r":"ようい","m":"準備、預備","m_en":"preparation, to get ready"},{"w":"懐中電灯","r":"かいちゅうでんとう","m":"手電筒","m_en":"flashlight"},{"w":"持ち出す","r":"もちだす","m":"帶出去","m_en":"to take out"},{"w":"はぐれる","r":"はぐれる","m":"走散、失散","m_en":"to get separated"},{"w":"避難所","r":"ひなんじょ","m":"避難所","m_en":"evacuation center"},{"w":"被害","r":"ひがい","m":"損害、災情","m_en":"damage"},{"w":"心がけ","r":"こころがけ","m":"留心、用心","m_en":"mindfulness, attitude"}],"grammar":[{"t":"〜だからこそ","note":"表示「正因為是這樣,才更……」,用來強調理由。例:「いつ起こるか分からない災害だからこそ、日ごろから備えておくことが大切です」。","t_en":"〜だからこそ","note_en":"Means 'precisely because...'. It stresses the reason. Example: 「いつ起こるか分からない災害だからこそ、日ごろから備えておくことが大切です」."},{"t":"〜ておく","note":"表示事先做好某事,為之後做準備。例:「水や食料、懐中電灯などを用意しておくと、いざというときに安心です」。","t_en":"〜ておく","note_en":"Means doing something in advance for later. Example: 「水や食料、懐中電灯などを用意しておくと、いざというときに安心です」."},{"t":"〜ようにする","note":"表示努力養成某種習慣或盡量去做。例:「すぐに持ち出せる場所に置いておくようにしましょう」。","t_en":"〜ようにする","note_en":"Means to make an effort to do something or make it a habit. Example: 「すぐに持ち出せる場所に置いておくようにしましょう」.","id":"n3-39"},{"t":"〜によって","note":"表示手段或原因,「靠著、藉由」。例:「ふだんのちょっとした心がけによって、いざというときに自分や家族を守ることができるのです」。","t_en":"〜によって","note_en":"Indicates means or cause: 'by, through'. Example: 「ふだんのちょっとした心がけによって、いざというときに自分や家族を守ることができるのです」."}]},
{"id":"a-n2-7-n4","variant_of":"a-n2-7","level":"n4","topic":"生活","topic_en":"Daily life","title":"災害にそなえよう","title_zh":"為災害做好準備","title_en":"Let's Prepare for Disasters","body":"日本は地震や台風などの自然災害が多い国です。いつ来るか分からないので、ふだんから準備しておくことが大切です。\nまず、家でできることから始めましょう。水や食べ物、懐中電灯を用意しておくと安心です。すぐ持って出られる所に置いておきましょう。家族と話し合って、はぐれたときに集まる場所を決めておきましょう。\n住んでいる町の危険な場所を知っておくことも大切です。市役所の地図を見て、避難所までの道を確認しておきましょう。災害は防げなくても、被害を少なくすることはできます。ふだんの小さな心がけが、自分や家族を守ってくれます。","trans":["日本是地震、颱風等自然災害很多的國家。因為不知道什麼時候會來,所以平時就先做好準備很重要。","首先,從在家就能做到的事開始吧。先準備好水、食物和手電筒,會比較安心。請放在可以馬上帶出門的地方。也和家人討論好,決定走散時要集合的地點。","先了解自己住的城鎮有哪些危險的地方也很重要。看看市公所的地圖,事先確認到避難所的路吧。災害就算無法防止,也能減少損害。平時一點小小的用心,會守護自己和家人。"],"trans_en":["Japan is a country with many natural disasters such as earthquakes and typhoons. Since we never know when they will come, it is important to prepare in advance.","First, let's start with what we can do at home. It is reassuring to have water, food, and a flashlight ready. Keep them in a place where you can grab them and go right away. Also talk with your family and decide where to meet if you get separated.","It is also important to know the dangerous places in the town where you live. Look at the city hall map and check the way to the evacuation center. Even if disasters cannot be prevented, damage can be reduced. Small everyday efforts will protect you and your family."],"vocab":[{"w":"地震","r":"じしん","m":"地震","m_en":"earthquake"},{"w":"台風","r":"たいふう","m":"颱風","m_en":"typhoon"},{"w":"準備","r":"じゅんび","m":"準備","m_en":"preparation"},{"w":"大切","r":"たいせつ","m":"重要、珍貴","m_en":"important"},{"w":"安心","r":"あんしん","m":"安心","m_en":"relief, peace of mind"},{"w":"用意","r":"ようい","m":"準備、預備","m_en":"to get ready, prepare"},{"w":"話し合う","r":"はなしあう","m":"討論、商量","m_en":"to talk over, discuss"},{"w":"決める","r":"きめる","m":"決定","m_en":"to decide"},{"w":"危険","r":"きけん","m":"危險","m_en":"dangerous, danger"},{"w":"避難所","r":"ひなんじょ","m":"避難所","m_en":"evacuation center"}],"grammar":[{"t":"〜ておく","note":"表示事先做好某事。例:「ふだんから準備しておくことが大切です」「決めておきましょう」。","t_en":"~te oku","note_en":"Do something in advance. Example: 「ふだんから準備しておくことが大切です」."},{"t":"〜ので","note":"表示原因、理由,語氣比「から」柔和。例:「いつ来るか分からないので、ふだんから準備しておくことが大切です」。","t_en":"~node","note_en":"Because; a soft way to give a reason. Example: 「いつ来るか分からないので」."},{"t":"〜ましょう","note":"邀請對方一起做,或提出建議。例:「まず、家でできることから始めましょう」。","t_en":"~mashou","note_en":"Let's do ~; a suggestion or invitation. Example: 「家でできることから始めましょう」.","id":"n5-12"},{"t":"〜ても/〜ことができる","note":"「〜ても」表示即使…也…;「ことができる」表示能夠做到。例:「災害は防げなくても、被害を少なくすることはできます」。","t_en":"~temo / ~koto ga dekiru","note_en":"Even if ~; can do ~. Example: 「災害は防げなくても、被害を少なくすることはできます」."}]},
{"id":"a-n3-1-n2","variant_of":"a-n3-1","level":"n2","topic":"生活","topic_en":"Everyday life","title":"暮らしを支えるコンビニの便利さ","title_zh":"支撐生活的便利商店之便利","title_en":"The Convenience of Convenience Stores","body":"日本のコンビニは二十四時間営業しており、いつでも利用できる手軽さが大きな魅力である。食べ物や飲み物はもちろん、雑誌や日用品まで買えるため、生活に必要なものがほぼ一か所でそろう。単なる食料品店というより、暮らしを支える身近な施設と言えるだろう。\nさらに、公共料金の支払いや荷物の発送など、生活に欠かせない手続きまで済ませることができる。銀行のATMが設置されているので、必要なときにはいつでもお金をおろすことが可能だ。コピーやチケットの予約ができる機械も置かれており、店の役割は買い物だけにとどまらない。\nこうしたサービスが充実したおかげで、コンビニは私たちの生活に欠かせない存在になった。忙しくて時間がない人にとって、短時間で用事を済ませられる場所があることは大きな助けである。今では、コンビニのない暮らしを想像することさえ難しいと感じる人も少なくないだろう。\nしかし、その便利さの裏には、二十四時間働く人々の苦労や食品ロスといった問題が隠れている。いつでも店が開いているということは、夜間も誰かが働き続けなければならないということでもある。私たちは便利さを当たり前のものと考えがちだが、それは多くの人の努力があって初めて成り立っている。便利さを受け取るだけでなく、その仕組みを支える人々のことにも目を向けていきたい。","trans":["日本的便利商店二十四小時營業,隨時都能利用的方便是它的一大魅力。不用說食物和飲料,連雜誌和日用品也買得到,所以生活所需的東西幾乎在一個地方就能買齊。與其說只是單純的食品店,不如說它是支撐生活的貼身設施。","此外,連繳公共費用、寄送包裹這類生活上不可或缺的手續都能辦好。因為設有銀行的 ATM,需要時隨時都能領錢。店裡還放有能影印、預約票券的機器,店的功能不只限於購物。","多虧這些服務日益完善,便利商店成了我們生活中不可或缺的存在。對忙碌、沒有時間的人來說,有個能在短時間內辦完事情的地方,是很大的幫助。如今,恐怕不少人連想像沒有便利商店的生活都覺得困難。","然而,在這份便利的背後,隱藏著 24 小時工作的人們的辛勞,以及食物浪費等問題。店家隨時營業,也就意味著夜間同樣必須有人持續工作。我們容易把便利視為理所當然,但它是在許多人的努力之下才得以成立的。我們不該只是享受便利,也想把目光投向支撐這套機制的人們。"],"trans_en":["Convenience stores in Japan are open 24 hours a day, and being able to use them at any time is a major appeal. Besides food and drinks, you can buy magazines and daily necessities, so almost everything you need is available in one place. They are better described as familiar facilities that support daily life than as mere grocery stores.","In addition, you can take care of essential procedures such as paying utility bills and sending packages. Because bank ATMs are installed, you can withdraw money whenever you need to. There are also machines for copying and reserving tickets, so the stores' role is not limited to shopping.","Thanks to these increasingly rich services, convenience stores have become an indispensable part of our lives. For busy people with little time, having a place where errands can be finished quickly is a great help. Today, many people probably find it hard even to imagine life without convenience stores.","However, behind this convenience lie problems such as the hardships of people who work 24 hours a day and food waste. A store that is always open also means that someone must keep working through the night. We tend to take convenience for granted, but it exists only because of the efforts of many people. Rather than simply receiving the benefits, we should also pay attention to the people who support the system."],"vocab":[{"w":"手軽さ","r":"てがるさ","m":"簡便、輕鬆容易","m_en":"ease, simplicity"},{"w":"公共料金","r":"こうきょうりょうきん","m":"公共費用(水電瓦斯等)","m_en":"utility bills"},{"w":"発送","r":"はっそう","m":"寄送、發送","m_en":"shipping, dispatch"},{"w":"手続き","r":"てつづき","m":"手續","m_en":"procedure"},{"w":"設置","r":"せっち","m":"設置、安裝","m_en":"installation"},{"w":"充実","r":"じゅうじつ","m":"充實、完善","m_en":"enrichment, being well-developed"},{"w":"欠かせない","r":"かかせない","m":"不可或缺的","m_en":"indispensable"},{"w":"食品ロス","r":"しょくひんロス","m":"食物浪費","m_en":"food waste"},{"w":"当たり前","r":"あたりまえ","m":"理所當然","m_en":"natural, taken for granted"},{"w":"支える","r":"ささえる","m":"支撐、支持","m_en":"to support"}],"grammar":[{"t":"〜にとどまらない","note":"表示「不只限於～」,範圍比想像的更廣。例:「店の役割は買い物だけにとどまらない」。","t_en":"〜にとどまらない","note_en":"Means 'not limited to ~'; the scope is wider than expected. Example: 「店の役割は買い物だけにとどまらない」."},{"t":"〜といった","note":"列舉代表性的例子,意思是「像～這樣的」。例:「食品ロスといった問題が隠れている」。","t_en":"〜といった","note_en":"Introduces examples, meaning 'such as ~'. Example: 「食品ロスといった問題が隠れている」."},{"t":"〜がちだ","note":"接在動詞ます形去ます後,表示容易出現不好的傾向,「往往會～」。例:「便利さを当たり前のものと考えがちだ」。","t_en":"〜がちだ","note_en":"Attached to the verb stem, it means 'tend to ~', usually something undesirable. Example: 「便利さを当たり前のものと考えがちだ」."},{"t":"〜て初めて","note":"表示「做了～之後才第一次(得以)～」,強調前項是必要條件。例:「多くの人の努力があって初めて成り立っている」。","t_en":"〜て初めて","note_en":"Means 'only after ~ does ...'; the first part is a necessary condition. Example: 「多くの人の努力があって初めて成り立っている」."}]},
{"id":"a-n3-1-n4","variant_of":"a-n3-1","level":"n4","topic":"生活","topic_en":"Everyday life","title":"コンビニのべんりさ","title_zh":"便利商店的方便","title_en":"The Convenience of Convenience Stores","body":"日本のコンビニは二十四時間あいていて、とてもべんりです。\n食べ物や飲み物だけでなく、雑誌や日用品も買えます。それに、公共料金をはらったり、荷物を送ったりもできます。\n銀行のATMもあるので、いつでもお金をおろせます。コピーやチケットの予約ができる機械もあります。このサービスのおかげで、コンビニは生活に大切な存在になりました。\nでも、べんりさのうらには、問題もあります。二十四時間はたらく人は、とてもたいへんです。食べ物がむだになってしまう食品ロスの問題もあります。べんりさを当たり前だと思わないで、はたらく人のことも考えたいです。","trans":["日本的便利商店二十四小時營業,非常方便。","不只食物和飲料,連雜誌、日用品都買得到。而且還能繳公共費用、寄送包裹。","因為也有銀行的 ATM,隨時都能領錢。也有可以影印、預約票券的機器。多虧這些服務,便利商店成了我們生活中重要的存在。","但是,便利的背後也有問題。二十四小時工作的人非常辛苦。也有食物被浪費的食品浪費問題。不要把便利當成理所當然,也想想在那裡工作的人。"],"trans_en":["Convenience stores in Japan are open 24 hours a day, and they are very convenient.","You can buy not only food and drinks but also magazines and daily necessities. You can also pay utility bills and send packages.","Since there are bank ATMs too, you can withdraw money at any time. There are also machines for making copies and booking tickets. Thanks to these services, convenience stores have become an important part of our lives.","However, there are also problems behind the convenience. People who work 24 hours a day have a very hard time. There is also the problem of food loss, where food goes to waste. I want us not to take convenience for granted and to think about the people who work there."],"vocab":[{"w":"便利","r":"べんり","m":"方便","m_en":"convenient"},{"w":"雑誌","r":"ざっし","m":"雜誌","m_en":"magazine"},{"w":"日用品","r":"にちようひん","m":"日用品","m_en":"daily necessities"},{"w":"公共料金","r":"こうきょうりょうきん","m":"公共費用(水電瓦斯等)","m_en":"utility bills"},{"w":"荷物","r":"にもつ","m":"行李、貨物、包裹","m_en":"luggage, package"},{"w":"予約","r":"よやく","m":"預約","m_en":"reservation"},{"w":"機械","r":"きかい","m":"機器","m_en":"machine"},{"w":"大切","r":"たいせつ","m":"重要的、珍貴的","m_en":"important"},{"w":"問題","r":"もんだい","m":"問題","m_en":"problem"},{"w":"食品ロス","r":"しょくひんロス","m":"食物浪費","m_en":"food loss, food waste"}],"grammar":[{"t":"〜ので","note":"表示原因、理由,語氣比「から」柔和。例:「銀行のATMもあるので、いつでもお金をおろせます」","t_en":"〜ので","note_en":"Gives a reason or cause, in a softer tone than から. Example: 「銀行のATMもあるので、いつでもお金をおろせます」"},{"t":"〜たり、〜たりする","note":"列舉幾個動作或事情。例:「公共料金をはらったり、荷物を送ったりもできます」","t_en":"〜たり、〜たりする","note_en":"Lists several actions or examples. Example: 「公共料金をはらったり、荷物を送ったりもできます」"},{"t":"可能形(〜られる/〜える)","note":"表示「能夠做~」。例:「雑誌や日用品も買えます」「お金をおろせます」","t_en":"Potential form","note_en":"Expresses ability or possibility. Example: 「雑誌や日用品も買えます」 and 「お金をおろせます」","id":"n4-52"},{"t":"〜ないで","note":"表示「不做~而做…」。例:「べんりさを当たり前だと思わないで、はたらく人のことも考えたいです」","t_en":"〜ないで","note_en":"Means 'without doing ~' or 'instead of doing ~'. Example: 「べんりさを当たり前だと思わないで、はたらく人のことも考えたいです」"}]},
{"id":"a-n3-8-n2","variant_of":"a-n3-8","level":"n2","topic":"生活","topic_en":"Life","title":"日本で病院に行くときの流れ","title_zh":"在日本看醫生的流程","title_en":"How to See a Doctor in Japan","body":"日本に来て初めて熱を出したとき、どう対処すればいいのか分からず、私は強い不安を感じた。慣れない土地で体調を崩すと、病気そのもの以上に心細さが大きくなりがちだ。友達に相談したところ、「まず近くの内科に行ったほうがいいよ」とアドバイスをもらった。\n病院では、まず受付で保険証を出し、問診票に症状を書くのが一般的な流れだ。診察では「いつから痛いですか」「アレルギーはありますか」といった質問をされる。聞かれる内容は大体決まっているので、事前に答えを考えておけば慌てずに済む。\n診察が終わると処方箋をもらい、それを持って薬局へ行き、薬を受け取る。最初は手順が多く感じられるかもしれないが、一度経験すれば難しくはない。一番気になっていた料金も、予想していたよりずっと安く済んだ。保険に加入していれば、病院で自分が支払う自己負担は三割で済むからである。\n言葉に自信がない人は、症状を紙に書いて医師に見せるとよい。意思を伝える手段は、話すことだけとは限らない。流暢に話せなくても、伝える方法はいくらでもあるので、過度に心配する必要はない。","trans":["在日本第一次發燒時,我不知道該怎麼處理,感到非常不安。在陌生的地方身體不舒服,比起生病本身,更容易讓人覺得無助。我找朋友商量,朋友建議我:「先去附近的內科比較好喔。」","在醫院,一般的流程是先在櫃台出示健保卡,再在問診表上填寫症狀。看診時,會被問到「從什麼時候開始痛?」「有過敏嗎?」之類的問題。被問的內容大致上是固定的,所以事先想好答案,就不至於慌張。","看診結束後會拿到處方箋,拿著它到藥局領藥。一開始可能會覺得步驟很多,但只要經歷過一次就不難了。我最在意的費用,也比預期便宜得多。因為只要有加入健保,在醫院自己負擔的部分只要三成。","對語言沒有自信的人,可以把症狀寫在紙上給醫生看。傳達意思的方式,不一定只有說話。即使無法流利地說,傳達的方法也多得是,所以不必過度擔心。"],"trans_en":["The first time I ran a fever in Japan, I didn't know how to handle it and felt very anxious. When you feel unwell in an unfamiliar place, the helplessness can be bigger than the illness itself. When I asked a friend, they advised me, \"You should go to a nearby internal medicine clinic first.\"","At the hospital, the usual flow is to show your insurance card at the reception desk and then write your symptoms on a questionnaire. During the examination, you are asked things like \"Since when has it hurt?\" and \"Do you have any allergies?\" The questions are mostly predictable, so if you think of your answers beforehand, you won't panic.","After the examination, you receive a prescription and take it to a pharmacy to get your medicine. The steps may seem numerous at first, but it isn't difficult once you've done it. The cost, which I had worried about most, was also much cheaper than I expected. That's because if you have health insurance, your own share at the hospital is only thirty percent.","If you're not confident with the language, it's a good idea to write your symptoms on paper and show them to the doctor. Speaking is not necessarily the only way to communicate. Even if you can't speak fluently, there are plenty of ways to get your point across, so there's no need to worry too much."],"vocab":[{"w":"対処","r":"たいしょ","m":"應對、處理","m_en":"to deal with, to handle"},{"w":"心細い","r":"こころぼそい","m":"無助的、不安的","m_en":"helpless, uneasy"},{"w":"体調を崩す","r":"たいちょうをくずす","m":"身體不適、搞壞身體","m_en":"to fall ill, to feel unwell"},{"w":"問診票","r":"もんしんひょう","m":"問診表","m_en":"medical questionnaire"},{"w":"症状","r":"しょうじょう","m":"症狀","m_en":"symptoms"},{"w":"慌てる","r":"あわてる","m":"慌張","m_en":"to panic, to be flustered"},{"w":"処方箋","r":"しょほうせん","m":"處方箋","m_en":"prescription"},{"w":"加入","r":"かにゅう","m":"加入、投保","m_en":"enrollment, to join"},{"w":"自己負担","r":"じこふたん","m":"自付額","m_en":"out-of-pocket share"},{"w":"手段","r":"しゅだん","m":"手段、方法","m_en":"means, method"}],"grammar":[{"t":"〜たところ","note":"表示做了某事之後,得到某個結果或發現。例:「友達に相談したところ、『まず近くの内科に行ったほうがいいよ』とアドバイスをもらった」。","t_en":"~たところ","note_en":"Indicates that after doing something, a result or discovery followed. Example: 「友達に相談したところ、…とアドバイスをもらった」.","id":"n3-19"},{"t":"〜といった","note":"列舉例子,「像是~這樣的」。例:「『いつから痛いですか』『アレルギーはありますか』といった質問をされる」。","t_en":"~といった","note_en":"Used to give examples: \"such as~\". Example: 「…『アレルギーはありますか』といった質問をされる」."},{"t":"〜ずに済む","note":"表示不必做某事就能解決、避免了不好的結果。例:「事前に答えを考えておけば慌てずに済む」。","t_en":"~ずに済む","note_en":"Means you can get by without doing something or avoid a bad outcome. Example: 「事前に答えを考えておけば慌てずに済む」."},{"t":"〜とは限らない","note":"表示「不一定是~」,部分否定。例:「意思を伝える手段は、話すことだけとは限らない」。","t_en":"~とは限らない","note_en":"Means \"not necessarily~\", a partial negation. Example: 「意思を伝える手段は、話すことだけとは限らない」.","id":"n2-58"}]},
{"id":"a-n3-8-n4","variant_of":"a-n3-8","level":"n4","topic":"生活","topic_en":"Life","title":"日本で病院に行く","title_zh":"在日本看醫生","title_en":"Going to the Hospital in Japan","body":"日本で初めて熱が出たとき、どうしたらいいか分からなくて不安でした。友達に聞くと、「近くの内科に行ったほうがいいよ」と言われました。\n病院では、まず保険証を出して、紙に症状を書きます。「いつから痛いですか」や「アレルギーはありますか」と聞かれます。診察が終わったら、処方箋という紙をもらいます。その紙を持って薬局へ行き、薬を受け取ります。\n病院の料金は思ったより安かったです。保険に入っていれば、自分で払うのは三割だけだからです。言葉が心配な人は、症状を紙に書いて見せるといいです。伝える方法はたくさんあるので、心配しなくても大丈夫です。","trans":["第一次在日本發燒的時候,我不知道該怎麼辦,覺得很不安。問了朋友,朋友說:「去附近的內科比較好喔。」","在醫院,首先要出示健保卡,並在紙上寫下症狀。醫生會問你「從什麼時候開始痛」或「有沒有過敏」。看診結束後,會拿到一張叫處方箋的紙。拿著那張紙去藥局領藥。","醫院的費用比我想像中便宜。因為只要有加入健保,自己付的只有三成。擔心語言不通的人,把症狀寫在紙上給醫生看就可以了。傳達的方法有很多,所以不用擔心。"],"trans_en":["The first time I got a fever in Japan, I didn't know what to do and felt anxious. When I asked a friend, they told me, \"You should go to a nearby internal medicine clinic.\"","At the hospital, you first show your insurance card and write your symptoms on a form. They ask things like \"Since when does it hurt?\" and \"Do you have any allergies?\" After the exam, you get a paper called a prescription. You take that paper to a pharmacy and pick up your medicine.","The hospital fee was cheaper than I expected. If you have insurance, you only pay 30 percent yourself. If you are worried about the language, it is good to write your symptoms on paper and show them. There are many ways to communicate, so there is no need to worry."],"vocab":[{"w":"熱","r":"ねつ","m":"發燒、體溫","m_en":"fever"},{"w":"不安","r":"ふあん","m":"不安","m_en":"anxious, uneasy"},{"w":"内科","r":"ないか","m":"內科","m_en":"internal medicine"},{"w":"保険証","r":"ほけんしょう","m":"健保卡","m_en":"health insurance card"},{"w":"症状","r":"しょうじょう","m":"症狀","m_en":"symptoms"},{"w":"診察","r":"しんさつ","m":"看診、診察","m_en":"medical examination"},{"w":"薬局","r":"やっきょく","m":"藥局","m_en":"pharmacy"},{"w":"受け取る","r":"うけとる","m":"領取、收下","m_en":"to receive, to pick up"},{"w":"料金","r":"りょうきん","m":"費用","m_en":"fee, charge"},{"w":"伝える","r":"つたえる","m":"傳達","m_en":"to convey, to communicate"}],"grammar":[{"t":"〜たほうがいい","note":"用來給建議,表示「最好做~」。例:「近くの內科に行ったほうがいいよ」(原文為「近くの内科に行ったほうがいいよ」)。接動詞た形。","t_en":"~ta hō ga ii","note_en":"Used to give advice: \"you had better ~\". Example: 「近くの内科に行ったほうがいいよ」. Attach to the past (ta) form of a verb."},{"t":"〜たら","note":"表示「做完~之後」或「如果~的話」。例:「診察が終わったら、処方箋という紙をもらいます」。","t_en":"~tara","note_en":"Means \"after ~\" or \"if ~\". Example: 「診察が終わったら、処方箋という紙をもらいます」."},{"t":"〜ば(〜ていれば)","note":"表示條件「如果~的話」。例:「保険に入っていれば、自分で払うのは三割だけだからです」。","t_en":"~ba (~te ireba)","note_en":"Conditional \"if ~\". Example: 「保険に入っていれば、自分で払うのは三割だけだからです」."},{"t":"〜ので","note":"表示原因、理由,語氣比較柔和。例:「伝える方法はたくさんあるので、心配しなくても大丈夫です」。","t_en":"~node","note_en":"Gives a reason, in a soft tone: \"because ~\". Example: 「伝える方法はたくさんあるので、心配しなくても大丈夫です」."}]},
{"id":"a-n3-9-n2","variant_of":"a-n3-9","level":"n2","topic":"生活","topic_en":"Daily life","title":"日本で部屋を探すときの流れと注意点","title_zh":"在日本找房子的流程與注意事項","title_en":"Finding an Apartment in Japan: The Process and What to Watch For","body":"日本で部屋を借りるのは、多くの外国人が思っているよりずっと手間がかかる作業である。まず不動産屋を訪ねて、家賃の予算と希望する地域を担当者に伝えるところから手続きが始まる。「駅から徒歩十分以内」という条件を加えると、それに伴って家賃は一気に高くなってしまう。\n気に入った部屋が見つかったとしても、その場ですぐに契約を決めるわけにはいかない。敷金・礼金・仲介手数料など、入居の時点でまとまったお金を用意しなければならないからだ。外国人の場合、契約にあたって保証人を求められることが少なくない。最近は保証人の代わりに保証会社を利用するのが一般的になっており、家賃の半分ほどを払って契約する。\n審査に通るためには、勤務先や収入が確認できる書類をあらかじめそろえておいたほうがよい。内見のときは、日当たりや騒音だけでなく、洗濯機を置く場所やコンセントの数まで確認しておきたい。写真ではわからない部分こそ、実際に足を運んで見る意味があるといえる。\nこうした手順は、初めて経験する人にとっては面倒に感じられるかもしれない。しかし、あらかじめ流れを知っているだけで、準備の負担は大きく変わってくる。そのため、次に引っ越すときには、今回よりもずっと楽に部屋探しを進められるはずだ。","trans":["在日本租房子,是一件比許多外國人想像中更費工夫的事。一開始要先拜訪房仲,向承辦人員說明房租預算和希望的地區,手續就是從這裡開始的。只要加上「離車站步行十分鐘以內」這個條件,房租就會隨之一口氣變高。","就算找到了喜歡的房間,也不能當場馬上決定簽約。因為押金、禮金、仲介手續費等等,入住的時候必須準備好一筆數目不小的錢。外國人的話,簽約時被要求提供保證人的情況並不少見。最近比起保證人,利用保證公司已經變得很普遍,簽約時要付大約一半的房租。","為了順利通過審查,最好事先備齊能確認工作單位與收入的文件。看房的時候,不只是採光和噪音,連洗衣機的擺放位置和插座數量也最好一併確認。正因為有照片看不出來的部分,才更有親自走一趟去看的意義。","這些步驟對第一次經歷的人來說,或許會覺得很麻煩。不過,光是事先知道整個流程,準備時的負擔就會差很多。因此,下次搬家的時候,應該能比這次輕鬆許多地進行找房子。"],"trans_en":["Renting a room in Japan takes much more effort than many foreigners expect. The process begins by visiting a real estate agent and telling the staff your rent budget and preferred area. Adding a condition such as \"within a ten-minute walk from the station\" makes the rent jump up all at once.","Even if you find a room you like, you cannot decide on the spot and sign the contract. This is because you have to prepare a considerable sum of money at move-in, including a security deposit, key money, and an agent's fee. Foreigners are often asked to provide a guarantor when signing a contract. These days, using a guarantor company instead of a guarantor has become the norm, and you pay about half of the rent to sign the contract.","To pass the screening, it is better to gather documents that show your workplace and income in advance. During the viewing, you should check not only sunlight and noise, but also where the washing machine will go and how many outlets there are. It is precisely the things you cannot tell from photos that make going to see the place worthwhile.","These steps may feel troublesome to someone experiencing them for the first time. However, just knowing the flow beforehand makes the burden of preparation very different. So the next time you move, you should be able to search for a room much more easily than this time."],"vocab":[{"w":"不動産屋","r":"ふどうさんや","m":"房屋仲介、房地產公司","m_en":"real estate agent"},{"w":"家賃","r":"やちん","m":"房租","m_en":"rent"},{"w":"敷金","r":"しききん","m":"押金","m_en":"security deposit"},{"w":"礼金","r":"れいきん","m":"禮金(給房東的謝禮金)","m_en":"key money"},{"w":"仲介手数料","r":"ちゅうかいてすうりょう","m":"仲介手續費","m_en":"agent's fee"},{"w":"保証人","r":"ほしょうにん","m":"保證人","m_en":"guarantor"},{"w":"審査","r":"しんさ","m":"審查","m_en":"screening, examination"},{"w":"内見","r":"ないけん","m":"看房","m_en":"viewing a property"},{"w":"日当たり","r":"ひあたり","m":"採光、日照","m_en":"sunlight exposure"},{"w":"騒音","r":"そうおん","m":"噪音","m_en":"noise"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某件事的變化,另一件事也跟著變化。例:「条件を加えると、それに伴って家賃は一気に高くなってしまう」","t_en":"〜に伴って","note_en":"Means 'along with / as' one thing changes, another changes too. Example: 「条件を加えると、それに伴って家賃は一気に高くなってしまう」"},{"t":"〜わけにはいかない","note":"表示基於情理或情況,不能那麼做。例:「その場ですぐに契約を決めるわけにはいかない」","t_en":"〜わけにはいかない","note_en":"Means one cannot do something because of circumstances or common sense. Example: 「その場ですぐに契約を決めるわけにはいかない」","id":"n3-44"},{"t":"〜にあたって","note":"表示在做某件事的時候、之際,多用於正式場合。例:「契約にあたって保証人を求められることが少なくない」","t_en":"〜にあたって","note_en":"Means 'on the occasion of / when doing' something, used in fairly formal contexts. Example: 「契約にあたって保証人を求められることが少なくない」"},{"t":"〜こそ","note":"強調前面的事物,表示『正是這個』。例:「写真ではわからない部分こそ、実際に足を運んで見る意味があるといえる」","t_en":"〜こそ","note_en":"Emphasizes the preceding word: 'precisely this'. Example: 「写真ではわからない部分こそ、実際に足を運んで見る意味があるといえる」","id":"n3-64"}]},
{"id":"a-n3-9-n4","variant_of":"a-n3-9","level":"n4","topic":"生活","topic_en":"Daily life","title":"日本で部屋を探す","title_zh":"在日本找房子","title_en":"Looking for a Room in Japan","body":"日本で部屋を借りるのは、思ったより手間がかかる。まず不動産屋に行って、家賃の予算と希望の場所を話す。駅から歩いて十分以内にすると、家賃はずいぶん高くなる。\nいい部屋が見つかっても、すぐには決められない。敷金や礼金、仲介手数料など、最初にたくさんお金がいるからだ。外国人は保証人が必要だと言われることが多い。今は保証会社を使う人が多く、家賃の半分ぐらいを払って契約する。審査に通るように、仕事と収入がわかる書類を準備しておくといい。\n写真ではわからないので、日当たりや音を実際に見て確認するといい。洗濯機を置く場所やコンセントの数も、見ておいたほうがいい。大変そうだが、この流れを知っていれば、次の引っ越しは楽になる。","trans":["在日本租房子,比想像中還要費工夫。首先去房仲,告訴對方房租預算和希望的地點。如果把條件設為離車站步行十分鐘以內,房租會變得貴很多。","就算找到不錯的房間,也沒辦法馬上決定。因為押金、禮金、仲介手續費等等,一開始就需要很多錢。外國人常常被告知需要保證人。現在很多人使用保證公司,付大約一半的房租來簽約。為了能通過審查,最好事先準備好能證明工作和收入的文件。","因為照片看不出來,最好實際去看,確認採光和噪音。洗衣機要放的位置和插座的數量,也最好先看一下。雖然看起來很麻煩,但只要知道這套流程,下次搬家就會輕鬆。"],"trans_en":["Renting a room in Japan takes more effort than you might expect. First, you go to a real estate agent and tell them your rent budget and the area you want. If you choose a place within a ten-minute walk of the station, the rent goes up quite a lot.","Even if you find a good room, you cannot decide right away. This is because you need a lot of money at the start, such as key money, a gift payment to the landlord, and the agent's fee. Foreigners are often told they need a guarantor. These days many people use a guarantee company and pay about half of a month's rent to sign the contract. To pass the screening, it is good to prepare documents that show your job and income.","Photos do not show everything, so it is good to check the sunlight and noise in person. You should also look at where the washing machine will go and how many outlets there are. It seems like a lot of work, but if you know this process, your next move will be easier."],"vocab":[{"w":"部屋","r":"へや","m":"房間","m_en":"room"},{"w":"手間","r":"てま","m":"功夫、麻煩","m_en":"time and effort, trouble"},{"w":"不動産屋","r":"ふどうさんや","m":"房仲、不動產公司","m_en":"real estate agent"},{"w":"家賃","r":"やちん","m":"房租","m_en":"rent"},{"w":"予算","r":"よさん","m":"預算","m_en":"budget"},{"w":"保証人","r":"ほしょうにん","m":"保證人","m_en":"guarantor"},{"w":"契約","r":"けいやく","m":"契約、簽約","m_en":"contract"},{"w":"書類","r":"しょるい","m":"文件","m_en":"documents"},{"w":"準備","r":"じゅんび","m":"準備","m_en":"preparation"},{"w":"確認","r":"かくにん","m":"確認","m_en":"confirmation, to check"}],"grammar":[{"t":"〜ても","note":"表示「即使~也~」。例:「いい部屋が見つかっても、すぐには決められない」","t_en":"even if ~","note_en":"Means 'even if'. Example: 「いい部屋が見つかっても、すぐには決められない」","id":"n3-73"},{"t":"〜ように","note":"表示為了達成某個目的或結果。例:「審査に通るように、仕事と収入がわかる書類を準備しておくといい」","t_en":"so that ~ / in order to ~","note_en":"Shows a purpose or desired result. Example: 「審査に通るように、仕事と収入がわかる書類を準備しておくといい」","id":"n3-54"},{"t":"〜ておく","note":"表示事先做好準備。例:「書類を準備しておくといい」「見ておいたほうがいい」","t_en":"do ~ in advance","note_en":"Means to do something ahead of time. Examples: 「書類を準備しておくといい」「見ておいたほうがいい」"},{"t":"〜たほうがいい","note":"表示「最好做~」,用來給建議。例:「コンセントの数も、見ておいたほうがいい」","t_en":"had better ~","note_en":"Used to give advice. Example: 「コンセントの数も、見ておいたほうがいい」"}]},
{"id":"a-n3-12-n2","variant_of":"a-n3-12","level":"n2","topic":"職場","topic_en":"Workplace","title":"ビジネスメールの基本マナー","title_zh":"商務電子郵件的基本禮儀","title_en":"Basic Manners for Business Emails","body":"日本の会社で働くうえで、メールの書き方の基本的なルールを知っておくことは欠かせません。メールは電話と違って、相手の都合のよい時間に読んでもらえる反面、書き方次第では失礼な印象を与えかねません。そのため、新入社員は先輩の書き方をよく見て、少しずつ身につけていくのが一般的です。\nまず件名は、一目で内容がわかるように簡潔に書くことが大切です。「会議の件」だけでは不十分で、「来週の会議の日程について」のように、具体的に書いたほうが伝わりやすくなります。件名が分かりにくいと、相手が忙しいときにメールを見落とされてしまうおそれがあります。とはいえ、件名は長ければ長いほどよいとは限らず、短くまとめる工夫も必要です。\n書き出しには、「お世話になっております」という挨拶がよく使われます。これは相手との関係に対する感謝を表す表現で、社外の人にも社内の人にも使うことができます。初めて連絡する相手には、「はじめてご連絡いたします」のような表現を使う場合もあります。本文では、用件が正確に伝わるように、短い文で丁寧に書くことが求められます。\n最後は「よろしくお願いいたします」という言葉で締めくくる人が多いです。この一言があるだけで、文章全体が丁寧な印象になり、相手も気持ちよく読み進められます。また、メールを受け取ったら、できるだけ早く返信することも重要なマナーの一つです。すぐに答えが出せない場合でも、「確認して後日ご連絡します」と一言送っておけば、相手は安心できるでしょう。","trans":["在日本公司工作時,了解電子郵件寫法的基本規則是不可或缺的。電子郵件和電話不同,雖然可以讓對方在方便的時間閱讀,但另一方面,依寫法不同,也可能給人失禮的印象。因此,新進員工一般會仔細觀察前輩的寫法,一點一滴地學起來。","首先,主旨要簡潔,讓人一眼就能看懂內容,這點很重要。只寫「會議的事」並不夠,像「關於下週會議的日程」這樣具體地寫,會更容易傳達。如果主旨不清楚,在對方忙碌時,郵件就有可能被漏看。不過,主旨也不一定越長越好,還需要花心思把它整理得簡短。","開頭常會使用「一直以來承蒙您關照」這句問候語。這是表達對彼此關係的感謝的說法,對公司外的人和公司內的人都可以使用。對於第一次聯絡的對象,有時也會用「初次與您聯絡」這類的說法。正文則要求使用簡短的句子、有禮貌地書寫,好讓事項能被正確地傳達。","最後,很多人會以「請多多指教」這句話作結。光是有這一句話,整篇文章就會給人有禮貌的印象,對方也能心情愉快地讀下去。另外,收到郵件後盡快回覆,也是重要的禮儀之一。即使無法立刻給出答案,只要先發一句「確認後再於日後與您聯絡」,對方就能放心了。"],"trans_en":["When working at a Japanese company, knowing the basic rules of email writing is essential. Unlike a phone call, an email can be read at a time convenient for the recipient, but on the other hand, depending on how it is written, it may leave a rude impression. For this reason, new employees generally watch how their seniors write and gradually pick it up.","First, it is important to keep the subject line concise so that the content is clear at a glance. \"About the meeting\" alone is not enough; writing specifically, as in \"About the schedule of next week's meeting,\" communicates better. If the subject line is unclear, there is a risk that the recipient will overlook the email when busy. That said, a longer subject line is not necessarily better, and some effort is needed to keep it short.","The greeting \"Osewa ni natte orimasu\" is often used at the start of an email. It expresses gratitude for the relationship with the other person and can be used with people both outside and inside the company. For someone you are contacting for the first time, an expression such as \"Hajimete go-renraku itashimasu\" may be used. In the body, you are expected to write politely in short sentences so that your business is conveyed accurately.","Many people close their emails with the phrase \"Yoroshiku onegai itashimasu.\" This single phrase gives the whole message a polite impression and lets the reader read it comfortably. Also, replying as quickly as possible after receiving an email is another important manner. Even if you cannot give an answer right away, sending a quick note such as \"I will check and contact you later\" will reassure the other person."],"vocab":[{"w":"欠かせない","r":"かかせない","m":"不可或缺的","m_en":"indispensable"},{"w":"都合","r":"つごう","m":"方便與否、情況","m_en":"convenience, circumstances"},{"w":"印象","r":"いんしょう","m":"印象","m_en":"impression"},{"w":"簡潔","r":"かんけつ","m":"簡潔","m_en":"concise"},{"w":"見落とす","r":"みおとす","m":"漏看、忽略","m_en":"to overlook"},{"w":"工夫","r":"くふう","m":"花心思、下功夫","m_en":"ingenuity, effort"},{"w":"用件","r":"ようけん","m":"要辦的事、事項","m_en":"business, matter at hand"},{"w":"求められる","r":"もとめられる","m":"被要求、被期待","m_en":"to be required"},{"w":"締めくくる","r":"しめくくる","m":"作結、收尾","m_en":"to conclude, to wrap up"},{"w":"返信","r":"へんしん","m":"回信、回覆","m_en":"reply"}],"grammar":[{"t":"〜うえで","note":"表示「在做某事的過程/方面」,後面常接重要或必要的事。例:「日本の会社で働くうえで、メールの書き方の基本的なルールを知っておくことは欠かせません」","t_en":"〜うえで","note_en":"'In doing ~ / when it comes to ~', usually followed by something important or necessary. Example: 「日本の会社で働くうえで、メールの書き方の基本的なルールを知っておくことは欠かせません」"},{"t":"〜反面","note":"表示同一件事同時有相反的兩面,「雖然…但另一方面…」。例:「相手の都合のよい時間に読んでもらえる反面、書き方次第では失礼な印象を与えかねません」","t_en":"〜反面","note_en":"'While ~, on the other hand ~', showing two opposite sides of one thing. Example: 「相手の都合のよい時間に読んでもらえる反面、書き方次第では失礼な印象を与えかねません」","id":"n3-79"},{"t":"〜かねない","note":"接動詞ます形去掉ます,表示「有可能發生不好的結果」。例:「書き方次第では失礼な印象を与えかねません」","t_en":"〜かねない","note_en":"Attached to the verb stem; 'might end up ~', for undesirable outcomes. Example: 「書き方次第では失礼な印象を与えかねません」","id":"n2-38"},{"t":"〜とは限らない","note":"表示「不一定…」,否定過於絕對的想法。例:「件名は長ければ長いほどよいとは限らず、短くまとめる工夫も必要です」","t_en":"〜とは限らない","note_en":"'Not necessarily ~', denying an overly absolute assumption. Example: 「件名は長ければ長いほどよいとは限らず、短くまとめる工夫も必要です」","id":"n2-58"}]},
{"id":"a-n3-12-n4","variant_of":"a-n3-12","level":"n4","topic":"職場","topic_en":"Workplace","title":"ビジネスメールの基本","title_zh":"商務電子郵件的基本","title_en":"The Basics of Business Email","body":"日本の会社で働くとき、メールの書き方にはいくつかの基本ルールがあります。メールは、相手が都合のいい時間に読めるので便利です。書き方を間違えると失礼に思われるので、新入社員は先輩から学びます。\nまず、件名は一目で内容がわかるように、短く書くことが大切です。「会議の件」ではなく、「来週の会議の日程について」と書くといいです。件名がわかりにくいと、忙しい相手はメールを読まないかもしれません。\nメールの初めには、「お世話になっております」という言葉をよく使います。これは感謝の気持ちを伝える言葉で、社外の人にも社内の人にも使えます。メールの最後は、「よろしくお願いいたします」で終わる人が多いです。メールをもらったら、できるだけ早く返事をするのも大切なマナーです。すぐに答えられないときも、「確認してあとで連絡します」と送ると安心です。","trans":["在日本公司工作時,寫電子郵件有一些基本規則。電子郵件可以讓對方在方便的時間閱讀,所以很方便。如果寫法出錯,會讓人覺得失禮,因此新進員工會向前輩學習。","首先,主旨要讓人一看就懂內容,簡短地寫很重要。不要只寫「會議的事」,寫成「關於下週會議的日程」會比較好。如果主旨不清楚,忙碌的對方可能不會讀這封信。","郵件開頭常常會用「一直承蒙您照顧」這句話。這是表達感謝心意的話,公司外的人和公司內的人都可以用。很多人會在郵件最後用「請多多指教」作結。收到郵件後,盡快回覆也是很重要的禮儀。即使無法馬上回答,先寄一句「確認後再與您聯絡」也能讓對方安心。"],"trans_en":["When you work at a Japanese company, there are some basic rules for writing email. Email is convenient because the other person can read it at a time that suits them. If you write it wrong, people may think you are rude, so new employees learn from their senior colleagues.","First, it is important to write the subject line briefly so that people can understand the content at a glance. Instead of just \"About the meeting,\" it is good to write \"About the schedule of next week's meeting.\" If the subject line is unclear, a busy person may not read the email.","At the start of an email, people often use the phrase \"Osewa ni natte orimasu.\" This expresses thanks, and it can be used for people outside and inside the company. Many people end their emails with \"Yoroshiku onegai itashimasu.\" When you receive an email, replying as soon as possible is also an important manner. Even if you cannot answer right away, it is reassuring to send a note saying \"I will check and contact you later.\""],"vocab":[{"w":"件名","r":"けんめい","m":"(郵件的)主旨、標題","m_en":"subject line"},{"w":"日程","r":"にってい","m":"日程、行程","m_en":"schedule"},{"w":"大切","r":"たいせつ","m":"重要的","m_en":"important"},{"w":"失礼","r":"しつれい","m":"失禮、不禮貌","m_en":"rude, impolite"},{"w":"新入社員","r":"しんにゅうしゃいん","m":"新進員工","m_en":"new employee"},{"w":"都合","r":"つごう","m":"(時間上的)方便、情況","m_en":"convenience, circumstances"},{"w":"感謝","r":"かんしゃ","m":"感謝","m_en":"thanks, gratitude"},{"w":"社外","r":"しゃがい","m":"公司外部","m_en":"outside the company"},{"w":"返事","r":"へんじ","m":"回覆、回答","m_en":"reply"},{"w":"安心","r":"あんしん","m":"安心、放心","m_en":"relief, peace of mind"}],"grammar":[{"t":"〜ので","note":"表示原因、理由,語氣比較柔和。例:「相手が都合のいい時間に読めるので便利です」","t_en":"〜node","note_en":"Gives a reason in a soft way. Example: 「相手が都合のいい時間に読めるので便利です」"},{"w":"","t":"〜ように","note":"表示「為了……」的目的或狀態。例:「一目で内容がわかるように、短く書くことが大切です」","t_en":"〜you ni","note_en":"Expresses a purpose or desired state, 'so that...'. Example: 「一目で内容がわかるように、短く書くことが大切です」","id":"n3-54"},{"t":"〜と(條件)","note":"表示「一……就……」,常接結果或建議。例:「件名がわかりにくいと、忙しい相手はメールを読まないかもしれません」","t_en":"〜to (condition)","note_en":"Means 'if/when...', followed by a result or advice. Example: 「件名がわかりにくいと、忙しい相手はメールを読まないかもしれません」"},{"t":"〜たら","note":"表示「如果、一旦……的話」,說明做完某事之後的行動。例:「メールをもらったら、できるだけ早く返事をするのも大切なマナーです」","t_en":"〜tara","note_en":"Means 'if/once...' and describes what to do after something happens. Example: 「メールをもらったら、できるだけ早く返事をするのも大切なマナーです」"}]},
{"id":"a-n4-2-n2","variant_of":"a-n4-2","level":"n2","topic":"生活","topic_en":"Everyday life","title":"電車の中のマナーと日本人の考え方","title_zh":"電車裡的禮儀與日本人的想法","title_en":"Train Manners and the Japanese Way of Thinking","body":"日本の電車の中は、会話の声がほとんど聞こえないほど静かな空間になっています。乗客の多くは、本を読んだりスマホを見たり、目を閉じて休んだりして、思い思いに過ごしています。周囲に気を配りながら、それぞれが自分の時間を静かに楽しんでいるわけです。\n特に、電車の中で電話をかける行為は、マナー違反だと見なされるのが一般的です。どうしても話したいときは、いったん電車を降りてからかけざるを得ません。また、優先席の近くでは、携帯電話の電源を切るよう求められる場合もあります。ペースメーカーなどの医療機器に影響を与えるおそれがあるからです。\nこうしたマナーの背景には、「周りの人に迷惑をかけない」という日本人の考え方があります。明文化されたルールというより、お互いへの思いやりに基づいた習慣だと言えます。自分の行動が周囲にどう影響するかを想像することが、この考え方の出発点です。\nこうしたマナーは、多くの人が気持ちよく電車を利用するために欠かせないものです。自分の都合だけを優先するのではなく、周りの人のことも考えて行動することが大切です。そうすれば、みんなが快適に過ごせる空間が保たれるのです。","trans":["日本的電車裡安靜到幾乎聽不見交談聲。大多數乘客或看書、或看手機、或閉眼休息,各自隨心所欲地度過時間。大家一邊顧慮周遭,一邊靜靜地享受屬於自己的時間。","尤其是在電車裡講電話的行為,一般被視為違反禮儀。真的想講話時,只能先下車再打。另外,在博愛座附近,有時也會被要求關掉手機電源,因為可能會對心律調節器等醫療器材造成影響。","這些禮儀的背後,有著日本人「不給周圍的人添麻煩」的想法。與其說是明文規定,不如說是基於對彼此體貼而形成的習慣。想像自己的行為會對周遭造成什麼影響,就是這種想法的出發點。","這些禮儀對於讓許多人舒服地搭乘電車而言不可或缺。不只優先考慮自己的方便,也顧慮周遭的人再行動,這一點很重要。這樣一來,就能維持大家都能舒適度過的空間。"],"trans_en":["Inside Japanese trains it is so quiet that you can hardly hear anyone talking. Most passengers read books, look at their phones, or rest with their eyes closed, each spending the time as they like. They are mindful of those around them while quietly enjoying their own time.","In particular, making phone calls on a train is generally regarded as bad manners. When people really need to talk, they have no choice but to get off the train first and then call. Near the priority seats, people may also be asked to turn their mobile phones off, because they might affect medical devices such as pacemakers.","Behind these manners lies the Japanese way of thinking: do not cause trouble for the people around you. It is less a written rule than a custom based on consideration for one another. Imagining how your own behavior affects others is the starting point of this way of thinking.","These manners are essential for letting many people use the train comfortably. It is important not to put only your own convenience first, but to act with others in mind. That way, a space where everyone can ride comfortably is maintained."],"vocab":[{"w":"思い思い","r":"おもいおもい","m":"各自隨自己的想法、隨心所欲","m_en":"each in one's own way"},{"w":"周囲","r":"しゅうい","m":"周圍、周遭的人","m_en":"surroundings; people around"},{"w":"違反","r":"いはん","m":"違反","m_en":"violation"},{"w":"見なされる","r":"みなされる","m":"被視為、被認為","m_en":"to be regarded as"},{"w":"電源","r":"でんげん","m":"電源","m_en":"power (switch)"},{"w":"おそれ","r":"おそれ","m":"恐怕會…的可能性、疑慮","m_en":"risk; possibility of something bad"},{"w":"背景","r":"はいけい","m":"背景","m_en":"background"},{"w":"迷惑","r":"めいわく","m":"麻煩、困擾","m_en":"trouble; nuisance"},{"w":"明文化","r":"めいぶんか","m":"明文化、寫成明文","m_en":"putting into written form"},{"w":"欠かせない","r":"かかせない","m":"不可或缺的","m_en":"indispensable"}],"grammar":[{"t":"〜ざるを得ない","note":"表示不得不做、沒有其他選擇。例:「どうしても話したいときは、いったん電車を降りてからかけざるを得ません」","t_en":"~zaru o enai","note_en":"Means 'have no choice but to'. Example: 「どうしても話したいときは、いったん電車を降りてからかけざるを得ません」","id":"n2-35"},{"t":"〜というより","note":"表示「與其說是…不如說是…」,用來修正說法。例:「明文化されたルールというより、お互いへの思いやりに基づいた習慣だと言えます」","t_en":"~to iu yori","note_en":"Means 'rather than ~; more like ~'. Example: 「明文化されたルールというより、お互いへの思いやりに基づいた習慣だと言えます」"},{"t":"〜おそれがある","note":"表示有發生不好事情的可能性,多用於書面語。例:「ペースメーカーなどの医療機器に影響を与えるおそれがあるからです」","t_en":"~osore ga aru","note_en":"Means 'there is a risk that ~' (something undesirable). Example: 「ペースメーカーなどの医療機器に影響を与えるおそれがあるからです」"},{"t":"〜に基づく","note":"表示以…為基礎、根據。例:「お互いへの思いやりに基づいた習慣だと言えます」","t_en":"~ni motozuku","note_en":"Means 'based on ~'. Example: 「お互いへの思いやりに基づいた習慣だと言えます」"}]},
{"id":"a-n4-2-n3","variant_of":"a-n4-2","level":"n3","topic":"生活","topic_en":"Everyday life","title":"電車の中のマナー","title_zh":"電車裡的禮儀","title_en":"Manners on the Train","body":"日本の電車の中は、他の国と比べると、とても静かだと言われています。多くの人は、本を読んだり、スマートフォンを見たり、目を閉じて休んだりして過ごしています。\n電車の中で電話をかけることは、マナー違反だと考えられています。どうしても話したいときは、駅で電車を降りてからかけるのが普通です。また、優先席の近くでは、携帯電話の電源を切るようにお願いされる場合もあります。ペースメーカーなどの医療機器に影響を与えるかもしれないからです。\nこうしたマナーの背景には、「周りの人に迷惑をかけない」という日本の考え方があります。ルールだからというより、お互いへの思いやりから守られているのです。このように、静かな車内は、周りへの気づかいによって作られているのです。\nこうしたマナーは、たくさんの人が気持ちよく電車を利用するためのものです。自分のことだけでなく、周りの人のことも考えて行動すれば、みんなが快適に過ごせるでしょう。","trans":["據說和其他國家相比,日本的電車裡非常安靜。很多人在看書、看手機,或閉著眼睛休息度過搭車時間。","在電車裡講電話被認為是違反禮儀的行為。真的想講話的時候,一般是下了電車、到車站後再打。另外,在博愛座附近,有時也會被請求關掉手機電源。因為可能會對心律調節器等醫療器材造成影響。","這些禮儀的背後,有日本「不給周圍的人添麻煩」的想法。與其說是因為規則,不如說是出於對彼此的體貼才被遵守的。就這樣,安靜的車廂是靠對周遭的顧慮營造出來的。","這些禮儀是為了讓許多人都能舒服地搭乘電車。不只顧慮自己,也為周圍的人著想而行動,大家就能舒適地度過了吧。"],"trans_en":["It is said that, compared with other countries, Japanese trains are very quiet. Many people spend their ride reading books, looking at their smartphones, or resting with their eyes closed.","Making phone calls on the train is considered bad manners. When people really want to talk, it is usual to get off the train at a station and then call. Near the priority seats, people are sometimes also asked to turn off their mobile phones. This is because they might affect medical devices such as pacemakers.","Behind these manners is the Japanese way of thinking: do not cause trouble for the people around you. They are followed out of consideration for one another rather than simply because they are rules. In this way, the quiet train car is created by consideration for those around us.","These manners exist so that many people can use the train comfortably. If you think not only of yourself but also of the people around you and act accordingly, everyone can have a pleasant ride."],"vocab":[{"w":"違反","r":"いはん","m":"違反、違背","m_en":"violation"},{"w":"優先席","r":"ゆうせんせき","m":"博愛座","m_en":"priority seat"},{"w":"電源","r":"でんげん","m":"電源","m_en":"power (switch)"},{"w":"医療機器","r":"いりょうきき","m":"醫療器材","m_en":"medical device"},{"w":"影響","r":"えいきょう","m":"影響","m_en":"influence, effect"},{"w":"背景","r":"はいけい","m":"背景","m_en":"background"},{"w":"迷惑","r":"めいわく","m":"麻煩、困擾","m_en":"trouble, nuisance"},{"w":"思いやり","r":"おもいやり","m":"體貼、同理心","m_en":"consideration, compassion"},{"w":"気づかい","r":"きづかい","m":"顧慮、關照","m_en":"thoughtfulness, concern"},{"w":"快適","r":"かいてき","m":"舒適","m_en":"comfortable"}],"grammar":[{"t":"〜ように(お願い・要求)","note":"表示請求或要求的內容。例:「携帯電話の電源を切るようにお願いされる場合もあります」","t_en":"~ように (request/instruction)","note_en":"Expresses the content of a request or instruction. Example: 「携帯電話の電源を切るようにお願いされる場合もあります」"},{"t":"〜というより","note":"表示「與其說是……不如說是……」。例:「ルールだからというより、お互いへの思いやりから守られているのです」","t_en":"~というより","note_en":"Means 'rather than ~, it is more like ~'. Example: 「ルールだからというより、お互いへの思いやりから守られているのです」"},{"t":"〜によって","note":"表示原因、手段或根據。例:「周りへの気づかいによって作られているのです」","t_en":"~によって","note_en":"Indicates cause or means ('by/through'). Example: 「周りへの気づかいによって作られているのです」"},{"t":"〜ための+名詞","note":"表示目的,修飾後面的名詞。例:「たくさんの人が気持ちよく電車を利用するためのものです」","t_en":"~ための + noun","note_en":"Expresses purpose and modifies a noun ('for the sake of'). Example: 「たくさんの人が気持ちよく電車を利用するためのものです」"}]},
{"id":"a-n4-8-n2","variant_of":"a-n4-8","level":"n2","topic":"生活","topic_en":"Daily life","title":"区役所での手続きの流れ","title_zh":"在區公所辦手續的流程","title_en":"How Paperwork at the Ward Office Works","body":"日本では引っ越しに伴って、十四日以内に区役所へ行き、住所に関する届け出をしなければなりません。私は窓口で「転入届を出したいのですが」と伝え、番号札を受け取りました。番号札を渡されるのは、順番に対応するための仕組みで、利用者が多い時間帯でも混乱しにくいようになっています。\n名前を呼ばれるまでは椅子に座って待たざるを得ませんが、その間に書類へ住所と生年月日を記入しておきました。順番が来て窓口へ行くと、係の人は在留カードを確認し、その裏面に新しい住所を書き込んでくれました。在留カードは身分を証明する大切なものなので、新しい住所が正しく記載されていることが重要です。\n同じ日に国民健康保険の手続きも済ませることができますが、担当の窓口が異なるため、一階から二階へ移動しました。手続きの種類によって窓口が分かれているのは、慣れないうちは少し面倒に感じられるかもしれません。全部終わるまでに一時間ほどかかりましたが、思っていたより順調に進んだ印象です。それに、日本語だけで手続きを終えられたことで、今後も生活していけるという自信が少しついてきました。\n分からないことがあれば、遠慮せずに質問したほうがいいと思います。外国人の利用者に対しても、係の人はゆっくり丁寧に話してくれるので、聞き返すことをためらう必要はありません。日本語に自信がないからといって、窓口での手続きが難しいとは限りません。一つずつ確認しながら進めれば、必要な手続きは落ち着いて終えられるはずです。","trans":["在日本,隨著搬家,必須在十四天內前往區公所辦理與住址相關的申報。我在櫃台說「我想辦遷入登記」,並領了號碼牌。發號碼牌是為了依序處理的機制,即使在使用者多的時段也不容易混亂。","在被叫到名字之前,不得不坐在椅子上等待,但我趁這段時間在文件上先填好了住址和出生年月日。輪到我走到櫃台後,承辦人員確認了在留卡,並在背面寫上新的住址。在留卡是證明身分的重要證件,所以新住址是否被正確記載相當重要。","同一天也可以辦完國民健康保險的手續,但因為負責的窗口不同,我從一樓移動到二樓。依手續種類而分成不同窗口,在還不習慣的時候或許會覺得有點麻煩。全部辦完花了大約一小時,不過整體比我想的還要順利。而且能只用日文辦完手續,讓我對今後也能在這裡生活稍微有了自信。","如果有不懂的地方,我認為不要客氣,直接發問比較好。對外國使用者,承辦人員也會放慢速度、很有禮貌地說話,所以不必猶豫是否要再問一次。就算對日文沒有自信,在窗口辦手續也不一定很困難。只要一項一項確認著進行,應該就能冷靜地辦完必要的手續。"],"trans_en":["In Japan, when you move, you must go to the ward office within fourteen days and file a notification about your address. At the counter I said, \"I'd like to submit my move-in notification,\" and received a number ticket. The ticket system lets staff handle people in order, so things don't get chaotic even at busy times.","Until my name was called I had no choice but to sit and wait, but I used that time to fill in my address and date of birth on the form. When my turn came, the staff member checked my residence card and wrote my new address on the back. Since the residence card is an important proof of identity, it matters that the new address is recorded correctly.","You can also finish the National Health Insurance procedure on the same day, but it is handled at a different counter, so I moved from the first floor to the second. Having separate counters for each type of procedure may feel a little troublesome until you get used to it. It took about an hour to finish everything, but it went more smoothly than I had expected. Being able to complete it in Japanese alone also gave me a little confidence that I can keep living here.","If there is something you don't understand, I think it is better to ask without hesitation. The staff speak slowly and politely even to foreign residents, so there is no need to hesitate to ask again. Just because you lack confidence in Japanese does not mean the procedures at the counter will be difficult. If you check things one at a time, you should be able to finish the necessary procedures calmly."],"vocab":[{"w":"届け出","r":"とどけで","m":"申報、登記","m_en":"notification, report (to authorities)"},{"w":"窓口","r":"まどぐち","m":"窗口、櫃台","m_en":"service counter"},{"w":"番号札","r":"ばんごうふだ","m":"號碼牌","m_en":"number ticket"},{"w":"仕組み","r":"しくみ","m":"機制、結構","m_en":"mechanism, system"},{"w":"記入","r":"きにゅう","m":"填寫","m_en":"filling in (a form)"},{"w":"裏面","r":"りめん","m":"背面","m_en":"reverse side"},{"w":"証明","r":"しょうめい","m":"證明","m_en":"proof, certification"},{"w":"担当","r":"たんとう","m":"負責、承辦","m_en":"being in charge"},{"w":"異なる","r":"ことなる","m":"不同","m_en":"to differ"},{"w":"ためらう","r":"ためらう","m":"猶豫","m_en":"to hesitate"}],"grammar":[{"t":"〜に伴って","note":"表示「隨著~」,前項的變化帶動後項。例:「引っ越しに伴って、十四日以内に区役所へ行き」","t_en":"〜に伴って","note_en":"Means 'along with / accompanying ~'. Example: 「引っ越しに伴って、十四日以内に区役所へ行き」"},{"w":"","t":"〜ざるを得ない","note":"表示「不得不~」,沒有其他選擇。例:「椅子に座って待たざるを得ませんが」","t_en":"〜ざるを得ない","note_en":"Means 'have no choice but to ~'. Example: 「椅子に座って待たざるを得ませんが」","id":"n2-35"},{"t":"〜に対して","note":"表示「對於~」,指動作或態度的對象。例:「外国人の利用者に対しても、係の人はゆっくり丁寧に話してくれる」","t_en":"〜に対して","note_en":"Means 'toward / to ~', marking the target of an action or attitude. Example: 「外国人の利用者に対しても〜」","id":"n3-2"},{"t":"〜とは限らない","note":"表示「不一定~」,否定「一定是~」的想法。例:「窓口での手続きが難しいとは限りません」","t_en":"〜とは限らない","note_en":"Means 'not necessarily ~'. Example: 「窓口での手続きが難しいとは限りません」","id":"n2-58"}]},
{"id":"a-n4-8-n3","variant_of":"a-n4-8","level":"n3","topic":"生活","topic_en":"Daily life","title":"区役所での手続き","title_zh":"在區公所辦手續","title_en":"Paperwork at the Ward Office","body":"引っ越しをしたら、十四日以内に区役所へ行って、住所を変える手続きをしなければなりません。私が窓口で「転入届を出したいのですが」と言うと、番号札を渡されました。名前を呼ばれるまで椅子に座って待ち、その間に書類に住所と生年月日を書いておきました。\n順番が来ると、係の人は私の在留カードを確認してから、裏に新しい住所を書いてくれました。同じ日に国民健康保険の手続きもできるので、続けて行うことにしました。ただ、窓口が違うため、一階から二階へ移動しなければなりませんでした。\n全部終わるまでに、一時間ぐらいかかりました。それでも日本語だけで手続きができたため、少し自信がつきました。\n分からないことがあれば、遠慮しないで係の人に聞いたほうがいいと思います。係の人は、こちらが分かるようにゆっくり話してくれるからです。","trans":["搬家之後,必須在十四天內去區公所辦理變更住址的手續。我在櫃台說「我想辦遷入登記」,就被發給了一張號碼牌。在被叫到名字之前,我坐在椅子上等,並趁這段時間在文件上寫好住址和出生年月日。","輪到我之後,承辦人員確認了我的在留卡,然後幫我在背面寫上新住址。因為同一天也可以辦國民健康保險的手續,所以我決定接著一起辦。不過,因為窗口不同,我必須從一樓移動到二樓。","全部辦完大約花了一小時。即使如此,因為能只用日文把手續辦好,讓我稍微有了自信。","我覺得如果有不懂的地方,不要客氣直接問承辦人員比較好。因為承辦人員會放慢速度,讓我們聽得懂。"],"trans_en":["After you move, you must go to the ward office within fourteen days and complete the procedure for changing your address. When I said at the counter, \"I would like to submit a move-in notification,\" I was given a number ticket. I sat in a chair and waited until my name was called, and during that time I filled in my address and date of birth on the form.","When my turn came, the staff member checked my residence card and then wrote my new address on the back for me. Since the national health insurance procedure can be done on the same day, I decided to do it right after. However, because the counter was different, I had to move from the first floor to the second floor.","It took about an hour until everything was finished. Even so, I gained a little confidence because I was able to complete the procedures in Japanese alone.","I think it is better to ask the staff without hesitation if there is something you don't understand. This is because they speak slowly so that we can understand."],"vocab":[{"w":"手続き","r":"てつづき","m":"手續","m_en":"procedure, paperwork"},{"w":"窓口","r":"まどぐち","m":"櫃台、窗口","m_en":"service counter"},{"w":"転入届","r":"てんにゅうとどけ","m":"遷入登記(申報)","m_en":"move-in notification"},{"w":"番号札","r":"ばんごうふだ","m":"號碼牌","m_en":"number ticket"},{"w":"書類","r":"しょるい","m":"文件、表格","m_en":"documents, forms"},{"w":"在留カード","r":"ざいりゅうカード","m":"在留卡","m_en":"residence card"},{"w":"確認","r":"かくにん","m":"確認","m_en":"to check, confirm"},{"w":"移動","r":"いどう","m":"移動","m_en":"to move, relocate"},{"w":"自信","r":"じしん","m":"自信","m_en":"confidence"},{"w":"遠慮","r":"えんりょ","m":"客氣、顧慮","m_en":"hesitation, holding back"}],"grammar":[{"t":"〜ことにする","note":"表示自己決定做某事。例:「続けて行うことにしました」(我決定接著一起辦)。","t_en":"~koto ni suru","note_en":"Expresses a decision made by oneself. Example: 「続けて行うことにしました」 (I decided to do it right after)."},{"t":"〜ため(原因・理由)","note":"用比較書面的方式表示原因或理由。例:「窓口が違うため、一階から二階へ移動しなければなりませんでした」。","t_en":"~tame (reason)","note_en":"A somewhat formal way to give a cause or reason. Example: 「窓口が違うため、一階から二階へ移動しなければなりませんでした」."},{"t":"〜ように","note":"表示目的,為了讓某種狀態成立。例:「こちらが分かるようにゆっくり話してくれる」(為了讓我們聽得懂而慢慢說)。","t_en":"~you ni (purpose)","note_en":"Expresses a purpose, so that a certain state comes about. Example: 「こちらが分かるようにゆっくり話してくれる」 (speaks slowly so that we can understand).","id":"n3-54"},{"t":"被動形(〜れる・〜られる)","note":"表示被別人做某事。例:「番号札を渡されました」「名前を呼ばれるまで」。","t_en":"Passive form (~reru/~rareru)","note_en":"Expresses that something is done to the subject by someone else. Examples: 「番号札を渡されました」, 「名前を呼ばれるまで」."}]},
{"id":"a-n4-9-n2","variant_of":"a-n4-9","level":"n2","topic":"生活","topic_en":"Daily life","title":"歯医者に通って気づいたこと","title_zh":"去看牙醫後我發現的事","title_en":"What I Noticed from Going to the Dentist","body":"三日前から歯が痛み始めたものの、放っておくわけにもいかず、近所の歯医者に予約を入れました。受付で保険証を提示すると、まず問診票に記入するよう求められました。痛みがいつ始まったのか、冷たい物がしみるかどうかといった項目に、順番に答えていきます。\n診察の結果、先生は「虫歯が一本ありますね」と告げ、レントゲン写真を見せながら状態を説明してくれました。今日のところは患部を削って薬を入れるだけにとどめ、来週もう一度来院するよう指示されました。原因がわかってほっとしたものの、一度では治療が終わらないと聞いて、少し残念な気持ちになりました。\n治療が終わると、歯みがきの仕方についても指導を受けました。力を入れて強く磨きすぎると、かえって歯ぐきを傷めてしまうおそれがあるそうです。毎日何気なく行っている習慣が、実は逆効果になりかねないと知り、驚きました。\n日本の歯医者では何度も通院せざるを得ませんが、その分、一回ごとの治療が丁寧に行われます。通う手間は確かに大きいとはいえ、丁寧な治療には代えがたい価値があると感じました。今回の経験から、痛くなってから慌てて駆け込むのではなく、症状が出る前に行動すべきだと痛感しました。少なくとも半年に一度は検診を受けるようにするのが、痛い思いをしないための最善策だと思います。","trans":["三天前開始牙痛,雖然如此,也不能放著不管,於是我向附近的牙醫預約了。在櫃台出示健保卡後,首先被要求填寫問診表。我依序回答了像是「痛是從什麼時候開始的」、「碰到冷的東西會不會敏感」這類的項目。","診察後,醫生說「有一顆蛀牙呢」,並一邊讓我看 X 光片一邊說明狀況。今天只先磨掉患部、填入藥物,並指示我下週再來一次。雖然知道了原因而鬆了一口氣,但聽到一次無法治好,又覺得有點失望。","治療結束後,我也接受了刷牙方法的指導。聽說如果用力過度地刷,反而可能會傷到牙齦。得知每天不經意進行的習慣,其實可能適得其反,讓我很驚訝。","在日本看牙醫不得不跑好幾趟,但相對地,每一次的治療都做得很仔細。雖然來回奔波確實很麻煩,但我覺得仔細的治療有無可取代的價值。經過這次的經驗,我深切體會到,不該等到痛了才慌張跑去看,而應該在出現症狀之前就採取行動。我認為至少每半年接受一次檢查,是避免受苦的最佳辦法。"],"trans_en":["My tooth had been hurting since three days ago, and since I couldn't just leave it alone, I made an appointment at a nearby dentist. When I showed my insurance card at the reception desk, I was first asked to fill out a medical questionnaire. I answered items one by one, such as when the pain began and whether cold things made my tooth sensitive.","After the examination, the dentist said \"You have one cavity\" and explained the condition while showing me an X-ray. For today, he only drilled out the affected area and put in medicine, and told me to come back once more next week. I was relieved to know the cause, but felt a little disappointed to hear that it wouldn't be finished in one visit.","After the treatment, I also received guidance on how to brush my teeth. I was told that brushing too hard with too much force could actually damage the gums. I was surprised to learn that a habit I perform casually every day could actually backfire.","In Japan you have to go to the dentist many times, but in return each treatment is done carefully. The effort of going is certainly significant, but I felt that careful treatment has a value that cannot be replaced. From this experience I keenly realized that I shouldn't rush in only after it starts hurting, but act before symptoms appear. I think getting a checkup at least once every six months is the best way to avoid painful experiences."],"vocab":[{"w":"放っておく","r":"ほうっておく","m":"放著不管","m_en":"to leave alone, to neglect"},{"w":"保険証","r":"ほけんしょう","m":"健保卡、保險證","m_en":"health insurance card"},{"w":"提示","r":"ていじ","m":"出示、提出","m_en":"presentation, showing (a document)"},{"w":"問診票","r":"もんしんひょう","m":"問診表","m_en":"medical questionnaire"},{"w":"患部","r":"かんぶ","m":"患部、病灶處","m_en":"affected area"},{"w":"指導","r":"しどう","m":"指導","m_en":"guidance, instruction"},{"w":"傷める","r":"いためる","m":"弄傷、損傷","m_en":"to damage, to injure"},{"w":"逆効果","r":"ぎゃくこうか","m":"反效果、適得其反","m_en":"counterproductive effect"},{"w":"通院","r":"つういん","m":"到醫院就診、回診","m_en":"going to a hospital or clinic regularly"},{"w":"痛感","r":"つうかん","m":"深切體會、痛切感受","m_en":"to keenly feel, to realize deeply"}],"grammar":[{"t":"〜ものの","note":"表示「雖然……但是……」,前後內容形成對比。例:「三日前から歯が痛み始めたものの、放っておくわけにもいかず」。","t_en":"〜ものの","note_en":"Means 'although ... but ...', contrasting the two clauses. Example: 「三日前から歯が痛み始めたものの、放っておくわけにもいかず」.","id":"n2-11"},{"t":"〜かねない","note":"接動詞ます形去ます,表示「有可能發生(不好的事)」。例:「実は逆効果になりかねないと知り」。","t_en":"〜かねない","note_en":"Attached to the verb stem; means 'might well (happen)', usually something bad. Example: 「実は逆効果になりかねないと知り」.","id":"n2-38"},{"t":"〜ざるを得ない","note":"表示「不得不……」,語氣上是出於無奈。例:「何度も通院せざるを得ませんが」。","t_en":"〜ざるを得ない","note_en":"Means 'have no choice but to ...'. Example: 「何度も通院せざるを得ませんが」.","id":"n2-35"},{"t":"〜とはいえ","note":"表示「雖說……、話雖如此……」,先承認前項,再說出後項看法。例:「通う手間は確かに大きいとはいえ」。","t_en":"〜とはいえ","note_en":"Means 'even though ...' or 'that said ...'; admits the first point, then gives a contrasting view. Example: 「通う手間は確かに大きいとはいえ」.","id":"n2-12"}]},
{"id":"a-n4-9-n3","variant_of":"a-n4-9","level":"n3","topic":"生活","topic_en":"Daily life","title":"歯医者へ行った日","title_zh":"去看牙醫的那天","title_en":"A Day at the Dentist","body":"三日前から歯が痛み始めたので、家の近くの歯医者に予約を入れました。受付で保険証を出すと、問診票に記入するように言われました。いつから痛いのか、冷たい物がしみるのかといったことを書きました。\n先生は「虫歯が一本ありますね」と言って、レントゲン写真を見せてくれました。今日は虫歯を削って薬を入れるだけで、来週もう一度来るように言われました。\n治療が終わったあと、歯みがきの仕方についても教えてもらいました。力を入れて強く磨きすぎると、歯ぐきを傷めてしまうことがあるそうです。毎日している歯みがきにも、正しい方法があることを知りました。\n日本の歯医者は何回も通わなければなりません。しかし、そのぶん一回ずつ丁寧に治療してくれるので、安心できます。痛くなってから慌てるより、半年に一度は検診に行くようにしたほうがいいと思いました。これからは早めに歯医者へ行くことにします。","trans":["因為三天前開始牙痛,我跟家附近的牙醫預約了。在櫃台出示健保卡後,被要求填寫問診表。我寫了從什麼時候開始痛、碰到冷的東西會不會敏感等等。","醫生說「有一顆蛀牙呢」,還讓我看了 X 光片。今天只是磨掉蛀牙並填入藥物,他說下週要再來一次。","治療結束後,他也教了我刷牙的方法。聽說用力刷得太用力,有時會傷到牙齦。我才知道,每天在做的刷牙也有正確的方法。","日本的牙醫必須跑好幾趟。不過相對地,每一次都會很仔細地治療,所以讓人安心。與其等痛了才慌張,我覺得最好半年去檢查一次。今後我決定要早點去看牙醫。"],"trans_en":["Because my tooth had started hurting three days earlier, I made an appointment at a dentist near my home. When I showed my insurance card at the reception desk, I was told to fill out a medical questionnaire. I wrote things like when the pain began and whether cold things made my teeth sensitive.","The dentist said, \"You have one cavity,\" and showed me an X-ray. Today he would only drill out the cavity and put in medicine, and I was told to come back once more next week.","After the treatment, I was also taught how to brush my teeth. I heard that brushing too hard with too much force can sometimes damage the gums. I learned that even the brushing I do every day has a correct method.","In Japan, you have to go to the dentist many times. However, in exchange, they treat you carefully each time, so you can feel reassured. Rather than panicking after it starts to hurt, I thought it would be better to get a checkup once every six months. From now on, I have decided to go to the dentist early."],"vocab":[{"w":"予約","r":"よやく","m":"預約","m_en":"appointment, reservation"},{"w":"受付","r":"うけつけ","m":"櫃台、受理處","m_en":"reception desk"},{"w":"記入","r":"きにゅう","m":"填寫","m_en":"to fill in, to write in"},{"w":"問診票","r":"もんしんひょう","m":"問診表","m_en":"medical questionnaire"},{"w":"虫歯","r":"むしば","m":"蛀牙","m_en":"cavity, tooth decay"},{"w":"削る","r":"けずる","m":"削、磨掉","m_en":"to shave off, to drill"},{"w":"傷める","r":"いためる","m":"弄傷、損傷","m_en":"to damage, to hurt"},{"w":"丁寧","r":"ていねい","m":"仔細、有禮貌","m_en":"careful, polite"},{"w":"慌てる","r":"あわてる","m":"慌張","m_en":"to panic, to be flustered"},{"w":"検診","r":"けんしん","m":"檢查、健檢","m_en":"medical checkup"}],"grammar":[{"t":"〜ように言われる","note":"表示被要求或指示做某事,間接引用指示的內容。例:「問診票に記入するように言われました」","t_en":"〜ように言われる","note_en":"Indicates being told or instructed to do something, as indirect speech. Example: 「問診票に記入するように言われました」"},{"w":"","t":"〜について","note":"「關於〜」,用來提出話題。例:「歯みがきの仕方についても教えてもらいました」","t_en":"〜について","note_en":"Means 'about' or 'concerning' and introduces a topic. Example: 「歯みがきの仕方についても教えてもらいました」","id":"n3-3"},{"t":"〜ぶん","note":"「相對地、那部分」,表示因為前面的情況而有相應的好處或結果。例:「そのぶん一回ずつ丁寧に治療してくれる」","t_en":"〜ぶん","note_en":"Means 'to that extent' or 'in compensation', linking a downside to a matching benefit. Example: 「そのぶん一回ずつ丁寧に治療してくれる」"},{"t":"〜ことにする","note":"表示自己下定決心做某事。例:「これからは早めに歯医者へ行くことにします」","t_en":"〜ことにする","note_en":"Expresses a personal decision to do something. Example: 「これからは早めに歯医者へ行くことにします」"}]},
{"id":"a-n4-11-n2","variant_of":"a-n4-11","level":"n2","topic":"生活","topic_en":"Everyday life","title":"電車に傘を置き忘れた日","title_zh":"把傘忘在電車上的那天","title_en":"The Day I Left My Umbrella on the Train","body":"今日、うっかり電車の中に傘を置き忘れてしまうという失敗をしてしまいました。気がついたときには、電車はすでに次の駅に到着しており、傘はもう手元にありませんでした。途方に暮れましたが、とにかく駅の忘れ物センターへ行って相談してみることにしました。\n窓口の係の人に、傘をなくした経緯を順を追って説明しました。「特徴を教えてください」と言われたので、まず色と形を伝えることにしました。「黒くて、柄が少し曲がっている傘です」と具体的に伝えました。すると係の人は「少し待ってください、探してみます」と言って、すぐに探しに行ってくれました。\nしばらく待っていると、似たような傘が見つかりそうだという知らせがありました。奥から傘を持ってきてもらって確認したところ、それはまぎれもなく私の傘でした。その場ですぐに傘を受け取ることができ、心の底からほっとしました。一時はあきらめかけていただけに、安心感はひとしおでした。\n今回の経験を通じて、忘れ物は気をつけていても起こり得ることだと痛感しました。これからは、電車を降りる際に忘れ物がないかどうかを必ず確認するよう心がけるつもりです。小さな習慣ではありますが、それを怠らないことが、同じ失敗を防ぐ一番の方法だと思います。","trans":["今天我不小心把雨傘忘在電車上,犯了這樣的失誤。等我發現時,電車已經到了下一站,雨傘早已不在手邊。我一時不知所措,但還是決定先去車站的遺失物中心商量看看。","我向窗口的工作人員按照順序說明了雨傘遺失的經過。對方說「請告訴我特徵」,於是我先描述了顏色和形狀。我具體地說「是黑色、傘柄有點彎曲的傘」。接著工作人員說「請稍等,我去找找看」,馬上就去幫我找了。","等了一會兒,對方告知好像找到了類似的雨傘。請他從裡面把傘拿出來確認後,那確實就是我的傘。我當場就能領回雨傘,打從心底鬆了一口氣。正因為一度快要放棄,那份安心感格外強烈。","透過這次的經驗,我深切體會到,即使小心注意,忘東西還是可能發生。今後我打算在下電車時,一定要確認有沒有忘記東西。雖然只是小小的習慣,但我認為不偷懶地做到這件事,就是避免重蹈覆轍的最好方法。"],"trans_en":["Today I carelessly left my umbrella on the train. By the time I noticed, the train had already arrived at the next station, and the umbrella was no longer with me. I was at a loss, but decided to go to the station's lost-and-found center and ask for help.","I explained to the staff member at the counter, step by step, how I had lost my umbrella. When I was asked to describe its features, I decided to start with the color and shape. I told them specifically, \"It's a black umbrella with a slightly curved handle.\" The staff member said, \"Please wait a moment, I'll look for it,\" and went off to search right away.","After waiting for a while, I was told that a similar umbrella seemed to have been found. When it was brought out from the back and I checked it, it was without a doubt my umbrella. I was able to take it back on the spot and felt truly relieved. Since I had nearly given up at one point, my sense of relief was all the greater.","Through this experience, I keenly realized that forgetting things can happen even when you are careful. From now on, I intend to make a point of always checking that I haven't left anything behind when I get off the train. It is a small habit, but I think never neglecting it is the best way to avoid repeating the same mistake."],"vocab":[{"w":"到着","r":"とうちゃく","m":"抵達、到達","m_en":"arrival; to arrive"},{"w":"手元","r":"てもと","m":"手邊、身邊","m_en":"at hand; in one's possession"},{"w":"途方に暮れる","r":"とほうにくれる","m":"不知所措、束手無策","m_en":"to be at a loss"},{"w":"経緯","r":"けいい","m":"經過、來龍去脈","m_en":"details; how things came about"},{"w":"順を追って","r":"じゅんをおって","m":"按照順序、依序","m_en":"step by step; in order"},{"w":"まぎれもなく","r":"まぎれもなく","m":"毫無疑問地、確實","m_en":"unmistakably; without a doubt"},{"w":"ひとしお","r":"ひとしお","m":"格外、更加","m_en":"all the more; especially"},{"w":"痛感","r":"つうかん","m":"深切體會、痛切感受","m_en":"to keenly feel; to realize deeply"},{"w":"心がける","r":"こころがける","m":"留意、努力做到","m_en":"to keep in mind; to make an effort to"},{"w":"怠る","r":"おこたる","m":"怠忽、疏忽","m_en":"to neglect"}],"grammar":[{"t":"〜たところ","note":"表示做了某動作之後,發現了某個結果,後面接的多是確認到的事實。例:「奥から傘を持ってきてもらって確認したところ、それはまぎれもなく私の傘でした」。","t_en":"〜たところ","note_en":"After doing something, one discovers a result. Example: 「奥から傘を持ってきてもらって確認したところ、それはまぎれもなく私の傘でした」.","id":"n3-19"},{"t":"〜だけに","note":"表示正因為前面的情況,所以後面的感受或結果格外強烈。例:「一時はあきらめかけていただけに、安心感はひとしおでした」。","t_en":"〜だけに","note_en":"Precisely because of the preceding situation, the result or feeling is all the stronger. Example: 「一時はあきらめかけていただけに、安心感はひとしおでした」."},{"t":"〜を通じて","note":"表示透過某個經驗或手段而得到某種結果。例:「今回の經験を通じて、忘れ物は気をつけていても起こり得ることだと痛感しました」。","t_en":"〜を通じて","note_en":"Through (an experience or means). Example: 「今回の経験を通じて、忘れ物は気をつけていても起こり得ることだと痛感しました」."},{"t":"〜かける","note":"接在動詞ます形後,表示動作做到一半或快要做某事。例:「一時はあきらめかけていただけに」。","t_en":"〜かける","note_en":"Attached to the verb stem, means being in the middle of or on the verge of doing something. Example: 「一時はあきらめかけていただけに」."}]},
{"id":"a-n4-11-n3","variant_of":"a-n4-11","level":"n3","topic":"生活","topic_en":"Everyday life","title":"電車に傘を忘れた日","title_zh":"忘記把傘放在電車上的那天","title_en":"The Day I Left My Umbrella on the Train","body":"今日、電車の中に傘を置き忘れてしまい、とても慌ててしまいました。電車が次の駅に着いたとき、ようやく傘がないことに気がつきました。どうしようかと迷いましたが、駅の忘れ物センターへ行って相談することにしました。\n係の人に、電車の中で傘をなくしてしまったことを説明しました。すると「傘の特徴を教えていただけますか」と聞かれたので、色と形を伝えました。「黒くて、柄が少し曲がっている傘です」と、できるだけ詳しく話しました。係の人は「少しお待ちください、探してみます」と言って、奥へ探しに行ってくれました。\nしばらく待っていると、似ている傘が見つかったようだと教えてもらいました。奥から持ってきてもらった傘を見ると、それは確かに私の傘でした。すぐに受け取ることができて、本当にほっとしました。これからは、電車を降りるとき忘れ物がないか確認するようにしようと思います。","trans":["今天我把雨傘忘在電車裡,慌張得不得了。電車到了下一站時,我才終於發現傘不見了。我猶豫了一下該怎麼辦,最後決定去車站的遺失物中心詢問。","我向工作人員說明自己把雨傘弄丟在電車裡的事。對方問我「可以告訴我傘的特徵嗎」,所以我說了顏色和形狀。我盡可能詳細地說「是黑色、傘柄有點彎曲的傘」。工作人員說「請稍等,我去找找看」,就到裡面幫我找了。","等了一會兒,對方告訴我好像找到了一把相似的傘。我看了從裡面拿出來的傘,那確實是我的傘。我馬上就能領回,真的鬆了一口氣。從現在開始,我打算下電車時確實確認有沒有忘記東西。"],"trans_en":["Today I left my umbrella on the train and I was in a real panic. It was only when the train reached the next station that I finally noticed it was gone. I wasn't sure what to do, but I decided to go to the station's lost and found center and ask for help.","I explained to the staff member that I had lost my umbrella on the train. When they asked, \"Could you tell me what it looks like?\", I described its color and shape. I told them in as much detail as I could, saying, \"It's black, and the handle is slightly curved.\" The staff member said, \"Please wait a moment, I'll look for it,\" and went to the back to search for me.","After waiting for a while, I was told that a similar umbrella seemed to have been found. When I looked at the umbrella they brought from the back, it was definitely mine. I was able to get it back right away, and I was truly relieved. From now on, I think I'll make a point of checking that I haven't left anything behind when I get off the train."],"vocab":[{"w":"置き忘れる","r":"おきわすれる","m":"把東西放在某處而忘了拿","m_en":"to leave something behind by mistake"},{"w":"慌てる","r":"あわてる","m":"慌張、驚慌","m_en":"to panic, to be flustered"},{"w":"気がつく","r":"きがつく","m":"發現、察覺","m_en":"to notice, to realize"},{"w":"相談","r":"そうだん","m":"商量、諮詢","m_en":"consultation, to ask for advice"},{"w":"係","r":"かかり","m":"負責的工作人員","m_en":"person in charge, staff"},{"w":"特徴","r":"とくちょう","m":"特徵","m_en":"feature, characteristic"},{"w":"柄","r":"え","m":"(傘等的)柄","m_en":"handle"},{"w":"曲がる","r":"まがる","m":"彎曲","m_en":"to be bent, curved"},{"w":"受け取る","r":"うけとる","m":"領取、收下","m_en":"to receive, to pick up"},{"w":"確認","r":"かくにん","m":"確認、檢查","m_en":"confirmation, to check"}],"grammar":[{"t":"〜ことにする","note":"表示自己決定做某事。例:「忘れ物センターへ行って相談することにしました」(決定去遺失物中心詢問)。","t_en":"〜ことにする","note_en":"Expresses a decision the speaker makes. Example: 「忘れ物センターへ行って相談することにしました」 (I decided to go to the lost and found and ask for help)."},{"w":"","t":"〜ようだ","note":"根據情況做出的推測或傳聞,「好像~」。例:「似ている傘が見つかったようだと教えてもらいました」(被告知好像找到了相似的傘)。","t_en":"〜ようだ","note_en":"Expresses a judgment based on the situation: \"it seems that...\". Example: 「似ている傘が見つかったようだと教えてもらいました」 (I was told a similar umbrella seemed to have been found)."},{"t":"〜てもらう","note":"表示請別人為自己做某事、受到別人的幫助。例:「奥から持ってきてもらった傘を見ると」(看了請對方從裡面拿來的傘)。","t_en":"〜てもらう","note_en":"Expresses receiving a favor from someone, having someone do something for you. Example: 「奥から持ってきてもらった傘を見ると」 (When I looked at the umbrella they brought from the back)."},{"t":"〜ようにする","note":"表示努力養成某種習慣或盡量做到某事。例:「忘れ物がないか確認するようにしようと思います」(打算盡量確認有沒有忘東西)。","t_en":"〜ようにする","note_en":"Expresses making an effort to do something or to form a habit. Example: 「忘れ物がないか確認するようにしようと思います」 (I think I'll make a point of checking for forgotten items).","id":"n3-39"}]},
{"id":"a-n1-1-n3","variant_of":"a-n1-1","level":"n3","topic":"環境","topic_en":"Environment","title":"地球温暖化と私たちの生活","title_zh":"地球暖化與我們的生活","title_en":"Global Warming and Our Daily Lives","body":"地球温暖化は、もう遠い未来の話ではなく、私たちの生活に直接関係する問題です。異常気象によって農作物が被害を受けたり、海面が上がって被害が出たりしています。そうした被害は、年を追うごとにますます深刻になる一方です。\nこうした状況を見ると、一人ひとりにできることは少ないと感じるかもしれません。しかし、電気のむだづかいを減らすことは、私たちにもすぐにできることです。また、電車やバスなどの公共交通機関を利用することも、よい方法の一つです。こうした小さな積み重ねこそが、大きな変化につながるのです。\n未来の世代に豊かな地球を残すためにも、今、行動を起こすことが求められています。温暖化は遠い国の話ではなく、私たちの食卓や生活にも直接かかわっています。一人ひとりの小さな行動が、やがて大きな変化を生むことを忘れてはいけません。","trans":["地球暖化已經不再是遙遠未來的事,而是與我們的生活直接相關的問題。異常氣候造成農作物受損,海平面上升也帶來災害。這些損害一年比一年更加嚴重。","看到這樣的狀況,或許會覺得每個人能做的事很少。不過,減少浪費用電是我們也能馬上做到的事。此外,搭乘電車、公車等大眾運輸工具也是很好的方法之一。正是這樣小小的累積,才會帶來巨大的改變。","為了替未來的世代留下豐饒的地球,現在被要求付諸行動。暖化不是遙遠國度的事,而是與我們的餐桌和生活也直接相關。不能忘記,每個人小小的行動,終將帶來巨大的改變。"],"trans_en":["Global warming is no longer a story about the distant future; it is a problem that directly affects our daily lives. Extreme weather damages crops, and rising sea levels also cause harm. This damage is only getting more serious with each passing year.","Looking at this situation, you may feel that there is little each person can do. However, reducing wasted electricity is something we can all start doing right away. Using public transportation such as trains and buses is also a good method. It is precisely these small accumulated efforts that lead to big change.","To leave a rich Earth to future generations, we are now being called on to take action. Warming is not a story about faraway countries; it is directly connected to our dinner tables and our lives. We must not forget that each person's small actions will eventually create big change."],"vocab":[{"w":"異常気象","r":"いじょうきしょう","m":"異常氣候","m_en":"extreme weather"},{"w":"農作物","r":"のうさくぶつ","m":"農作物","m_en":"crops"},{"w":"被害","r":"ひがい","m":"損害、災害","m_en":"damage"},{"w":"海面","r":"かいめん","m":"海平面","m_en":"sea level"},{"w":"深刻","r":"しんこく","m":"嚴重","m_en":"serious"},{"w":"公共交通機関","r":"こうきょうこうつうきかん","m":"大眾運輸工具","m_en":"public transportation"},{"w":"積み重ね","r":"つみかさね","m":"累積","m_en":"accumulation"},{"w":"世代","r":"せだい","m":"世代","m_en":"generation"},{"w":"食卓","r":"しょくたく","m":"餐桌","m_en":"dining table"},{"w":"求められる","r":"もとめられる","m":"被要求、被期待","m_en":"to be demanded"}],"grammar":[{"t":"〜によって","note":"表示原因或手段,「因為…」。例:「異常気象によって農作物が被害を受けたり」。","t_en":"~ni yotte (cause)","note_en":"Indicates cause or means, 'due to ~'. Example: 「異常気象によって農作物が被害を受けたり」."},{"t":"〜一方だ","note":"表示某個傾向一直朝同一方向發展,「越來越…」。例:「ますます深刻になる一方です」。","t_en":"~ippou da","note_en":"Shows a trend that keeps moving in one direction, 'only getting more ~'. Example: 「ますます深刻になる一方です」.","id":"n3-38"},{"t":"〜ためにも","note":"表示「為了…(目的),也…」,強調目的的重要。例:「未来の世代に豊かな地球を残すためにも」。","t_en":"~tame ni mo","note_en":"Expresses purpose with emphasis, 'also for the sake of ~'. Example: 「未来の世代に豊かな地球を残すためにも」."},{"t":"〜こそ","note":"強調前面的詞,「正是…」。例:「こうした小さな積み重ねこそが」。","t_en":"~koso","note_en":"Emphasizes the preceding word, 'precisely ~'. Example: 「こうした小さな積み重ねこそが」.","id":"n3-64"}]},
{"id":"a-n1-1-n4","variant_of":"a-n1-1","level":"n4","topic":"環境","topic_en":"Environment","title":"地球温暖化と私たちの生活","title_zh":"地球暖化與我們的生活","title_en":"Global Warming and Our Daily Lives","body":"地球温暖化は、もう遠い未来の話ではない。私たちの生活にも、直接影響が出ている。いつもと違う天気で、野菜や米が被害を受けている。\n海の水の高さが上がって、困る人も増えている。こうした被害は、毎年だんだんひどくなっている。一人でできることは少ないと、思うかもしれない。\nでも、電気をむだに使わないようにしたり、バスや電車に乗ったりする。そんな小さなことを続けると、大きな変化につながる。未来の人たちにきれいな地球を残すために、今から動こう。温暖化は、私たちの食事や生活にも関係がある問題だ。小さな行動が大きな変化を作ることを、忘れないでほしい。","trans":["地球暖化已經不是遙遠未來的事了。對我們的生活也已經直接產生影響。因為異常的天氣,蔬菜和稻米都受到損害。","海平面上升,困擾的人也越來越多。這些損害一年比一年嚴重。或許你會覺得,一個人能做的事很少。","但是,盡量不要浪費電,或是搭公車、電車。這樣的小事持續下去,就會帶來大的改變。為了替未來的人留下乾淨的地球,從現在開始行動吧。暖化是與我們的飲食和生活也有關係的問題。希望大家不要忘記,小小的行動會創造出大的改變。"],"trans_en":["Global warming is no longer a story about the distant future. It is already directly affecting our lives. Because of unusual weather, vegetables and rice are being damaged.","The level of the sea is rising, and more people are in trouble. This damage is slowly getting worse every year. You may think that there is little one person can do.","But we can try not to waste electricity, or take buses and trains. If we keep doing such small things, they lead to big changes. Let's act from now on to leave a clean earth for the people of the future. Warming is a problem that is also connected to our meals and our lives. Please do not forget that small actions create big changes."],"vocab":[{"w":"地球","r":"ちきゅう","m":"地球","m_en":"the earth"},{"w":"未来","r":"みらい","m":"未來","m_en":"future"},{"w":"生活","r":"せいかつ","m":"生活","m_en":"daily life"},{"w":"影響","r":"えいきょう","m":"影響","m_en":"influence, effect"},{"w":"天気","r":"てんき","m":"天氣","m_en":"weather"},{"w":"被害","r":"ひがい","m":"損害、災害","m_en":"damage"},{"w":"電気","r":"でんき","m":"電、電力","m_en":"electricity"},{"w":"続ける","r":"つづける","m":"持續、繼續","m_en":"to continue"},{"w":"残す","r":"のこす","m":"留下","m_en":"to leave behind"},{"w":"忘れる","r":"わすれる","m":"忘記","m_en":"to forget"}],"grammar":[{"t":"〜ている","note":"表示狀態或持續中的變化。例:「野菜や米が被害を受けている」「困る人も増えている」","t_en":"~te iru","note_en":"Shows a continuing state or change. Example: 「野菜や米が被害を受けている」"},{"t":"〜かもしれない","note":"表示「也許、可能」。例:「思うかもしれない」","t_en":"~ka mo shirenai","note_en":"Means maybe or might. Example: 「思うかもしれない」"},{"t":"〜ようにする","note":"表示努力做到某個習慣或盡量去做。例:「電気をむだに使わないようにしたり」","t_en":"~you ni suru","note_en":"Means to try to make it a habit. Example: 「電気をむだに使わないようにしたり」","id":"n3-39"},{"t":"〜と(條件)","note":"表示「一……就……」,前面做了就會自然有結果。例:「小さなことを続けると、大きな変化につながる」","t_en":"~to (conditional)","note_en":"Means if or when, with a natural result. Example: 「小さなことを続けると、大きな変化につながる」"}]},
{"id":"a-n1-2-n3","variant_of":"a-n1-2","level":"n3","topic":"新聞","topic_en":"News","title":"AIの時代に「学ぶ」意味を考える","title_zh":"在AI時代思考「學習」的意義","title_en":"Thinking About the Meaning of Learning in the AI Era","body":"生成AIが広がったため、知識を手に入れることはとても簡単になった。わからないことがあれば、AIに聞くだけで、すぐに答えを教えてもらえる。\nそのため、「人間はもう努力して勉強しなくてもいいのではないか」と言う人も出てきた。しかし、そう考えることは学ぶことの本当の意味を忘れていると思う。\n学ぶことは、ただ答えを手に入れるだけのことではない。情報が正しいかどうかを確かめ、いろいろな考えを比べて、自分で判断する。その過程があるからこそ、考える力は少しずつ育っていくのである。AIが出した答えをよく考えて確かめられるかどうかは、その人の学びの深さによって決まる。\n答えが簡単に手に入る時代だからこそ、「なぜそうなるのか」と問い続ける姿勢が大切だ。学ぶ意味はなくなるわけではなく、むしろもう一度考え直されている。知識をためることより、それをどう使い、どう判断するかが、これからの学びの中心になるだろう。","trans":["因為生成式AI普及了,取得知識變得非常容易。有不懂的事情,只要問AI,就能立刻得到答案。","因此,也開始有人說「人類已經不需要努力讀書了吧」。但是,我認為這樣想是忘記了學習真正的意義。","學習不只是取得答案而已。要確認資訊是否正確、比較各種想法,再由自己做出判斷。正因為有這個過程,思考的能力才會一點一點地被培養出來。能不能仔細思考並確認AI給出的答案,取決於那個人學習的深度。","正因為是答案容易取得的時代,持續追問「為什麼會這樣」的態度才重要。學習的意義並不是消失了,反而是被重新思考。比起囤積知識,如何運用、如何判斷,將成為今後學習的核心吧。"],"trans_en":["Because generative AI has spread, getting knowledge has become very easy. If you don't understand something, you can just ask AI and get an answer right away.","As a result, some people have begun to say, \"Humans no longer need to work hard to study.\" However, I think that way of thinking forgets the true meaning of learning.","Learning is not just about getting answers. You check whether information is correct, compare various ideas, and make your own judgment. Precisely because of this process, the ability to think grows little by little. Whether you can think carefully about an answer from AI and verify it depends on how deep your learning is.","Precisely because we live in an age when answers are easy to get, an attitude of continuing to ask \"why is that so\" is important. The meaning of learning is not disappearing; rather, it is being reconsidered. More than storing up knowledge, how we use it and how we judge will become the center of learning from now on."],"vocab":[{"w":"広がる","r":"ひろがる","m":"擴大、普及","m_en":"to spread"},{"w":"手に入れる","r":"てにいれる","m":"取得、得到","m_en":"to obtain"},{"w":"努力","r":"どりょく","m":"努力","m_en":"effort"},{"w":"本当","r":"ほんとう","m":"真正的、真實的","m_en":"true, real"},{"w":"情報","r":"じょうほう","m":"資訊","m_en":"information"},{"w":"確かめる","r":"たしかめる","m":"確認、查證","m_en":"to check, to verify"},{"w":"比べる","r":"くらべる","m":"比較","m_en":"to compare"},{"w":"判断","r":"はんだん","m":"判斷","m_en":"judgment"},{"w":"過程","r":"かてい","m":"過程","m_en":"process"},{"w":"姿勢","r":"しせい","m":"態度、姿態","m_en":"attitude, stance"}],"grammar":[{"t":"〜ため(原因)","note":"表示原因、理由,語氣比「から」稍正式,常用於文章。例:「生成AIが広がったため、知識を手に入れることはとても簡単になった」","t_en":"〜ため (cause)","note_en":"Expresses a cause or reason, slightly more formal than から. Example: 「生成AIが広がったため、知識を手に入れることはとても簡単になった」"},{"t":"〜わけではない","note":"表示「並不是……」,部分否定,避免把話說得太絕對。例:「学ぶ意味はなくなるわけではなく、むしろもう一度考え直されている」","t_en":"〜わけではない","note_en":"Means \"it is not the case that…\"; a partial negation that avoids overstating. Example: 「学ぶ意味はなくなるわけではなく、むしろもう一度考え直されている」","id":"n3-43"},{"t":"〜によって","note":"表示「依……而定、取決於……」,也可表示手段或原因。例:「その人の学びの深さによって決まる」","t_en":"〜によって","note_en":"Means \"depending on…\" or \"by means of…\". Example: 「その人の学びの深さによって決まる」"},{"t":"〜かどうか","note":"表示「是否……」,把疑問句嵌入句子中。例:「情報が正しいかどうかを確かめ」","t_en":"〜かどうか","note_en":"Means \"whether or not…\"; embeds a yes/no question in a sentence. Example: 「情報が正しいかどうかを確かめ」"}]},
{"id":"a-n1-2-n4","variant_of":"a-n1-2","level":"n4","topic":"新聞","topic_en":"News","title":"AIの時代に「学ぶ」意味を考える","title_zh":"在AI時代思考「學習」的意義","title_en":"Thinking About the Meaning of Learning in the AI Era","body":"AIが広がって、知りたいことをすぐに調べられるようになった。わからないことがあれば、AIに聞くだけで答えを教えてくれる。それで「もう人が勉強しなくてもいい」と言う人も出てきた。\nでも、勉強は答えをもらうだけのことではないと思う。情報が正しいかどうかを考えて、いろいろな意見を比べる。自分で考えて決めることで、考える力が育っていく。AIの答えが正しいか考えられるかは、その人がどれだけ勉強したかで決まる。\n答えが簡単に手に入る時代だから、「なぜ」と考えることがもっと大切だ。知識をたくさん覚えるより、どう使うかを考えることが大事になるだろう。勉強する意味は、なくなったのではなく、もう一度考えられているのだ。","trans":["AI普及之後,想知道的事情變得可以馬上查到。有不懂的事,只要問AI,它就會告訴你答案。因此也開始出現「人類已經不用再學習了」這樣說的人。","但是,我認為學習不只是拿到答案而已。要思考資訊正不正確,並比較各種意見。靠自己思考、做決定,思考的能力才會被培養起來。能不能判斷AI的答案正不正確,取決於那個人學了多少。","正因為是答案很容易取得的時代,思考「為什麼」才更加重要。比起記很多知識,思考如何運用知識,今後會變得更重要吧。學習的意義並沒有消失,反而是正被重新思考。"],"trans_en":["As AI has spread, we can now look up the things we want to know right away. If there is something we don't understand, we only have to ask AI and it tells us the answer. So some people have started to say, \"People don't need to study anymore.\"","But I think studying is not just about getting answers. We think about whether information is correct and compare many different opinions. By thinking and deciding for ourselves, our ability to think grows. Whether you can judge if an AI answer is correct depends on how much you have studied.","Because this is an age when answers are easy to get, asking \"why\" is even more important. Rather than memorizing lots of knowledge, thinking about how to use it will become important. The meaning of learning has not disappeared; instead, it is being thought about again."],"vocab":[{"w":"広がる","r":"ひろがる","m":"擴散、普及","m_en":"to spread"},{"w":"調べる","r":"しらべる","m":"查、調查","m_en":"to look up, to check"},{"w":"答え","r":"こたえ","m":"答案","m_en":"answer"},{"w":"比べる","r":"くらべる","m":"比較","m_en":"to compare"},{"w":"考える","r":"かんがえる","m":"思考、想","m_en":"to think"},{"w":"育つ","r":"そだつ","m":"成長、被培養","m_en":"to grow, to develop"},{"w":"簡単","r":"かんたん","m":"簡單、容易","m_en":"easy, simple"},{"w":"時代","r":"じだい","m":"時代","m_en":"age, era"},{"w":"大切","r":"たいせつ","m":"重要、珍貴","m_en":"important"},{"w":"意味","r":"いみ","m":"意義、意思","m_en":"meaning"}],"grammar":[{"t":"〜ようになる","note":"表示變化,變得可以做某事。例:「知りたいことをすぐに調べられるようになった」","t_en":"~you ni naru","note_en":"Shows a change into a new state or ability. Example: 「知りたいことをすぐに調べられるようになった」","id":"n3-40"},{"t":"〜なくてもいい","note":"表示不做也可以、不需要。例:「もう人が勉強しなくてもいい」","t_en":"~nakute mo ii","note_en":"Means you don't have to do something. Example: 「もう人が勉強しなくてもいい」"},{"t":"〜かどうか","note":"表示「是不是…」,把疑問放進句子裡。例:「情報が正しいかどうかを考えて」","t_en":"~ka dou ka","note_en":"Means whether or not; puts a yes/no question inside a sentence. Example: 「情報が正しいかどうかを考えて」"},{"t":"AよりB","note":"表示比起A,B更…。例:「知識をたくさん覚えるより、どう使うかを考えることが大事になるだろう」","t_en":"A yori B","note_en":"Means B rather than A. Example: 「知識をたくさん覚えるより、どう使うかを考えることが大事になるだろう」"}]},
{"id":"a-n1-3-n3","variant_of":"a-n1-3","level":"n3","topic":"社会","topic_en":"Society","title":"少子高齢化という問題","title_zh":"少子高齡化這個問題","title_en":"The Problem of a Declining Birthrate and Aging Society","body":"日本では、世界でもめずらしいほど速く少子高齢化が進んでいる。総人口の中でお年寄りが占める割合は、毎年少しずつ高くなっている。一方で、生まれる子どもの数は減り続けている。\nこのままでは、年金や医療、介護などの社会保障の制度が続けられなくなるかもしれない。これらにかかる費用は増えているのに、それを支える働く世代は少なくなっていくからだ。\n対策として、子育てと仕事を両立しやすくする制度を、もっと充実させることが考えられている。外国人の労働者を受け入れる数を増やすことも、話し合われている。しかし、どれもすぐに解決できるような問題ではない。\n子どもが減っている背景には、お金の不安や考え方の変化など、さまざまな理由がある。だから、補助金を配るだけで問題が解決するわけではない。少子高齢化は、避けられない現実になっている。社会全体でどう向き合い、次の世代にどんな国を残すのか、真剣に考えなければならない。","trans":["日本正以世界上也很罕見的速度邁向少子高齡化。高齡者在總人口中所占的比例每年一點一點地升高。另一方面,出生的孩子數量卻持續減少。","照這樣下去,年金、醫療、照護等社會保障制度可能會無法維持。因為這些所需的費用正在增加,而支撐它們的青壯世代卻會愈來愈少。","作為對策,有人考慮進一步充實讓育兒與工作更容易兼顧的制度。增加接納外籍勞工的人數也正在討論中。然而,這些都不是能夠馬上解決的問題。","孩子變少的背後,有金錢上的不安、想法的改變等各式各樣的原因。所以,並不是只要發放補助金,問題就能解決。少子高齡化已成了無法避免的現實。整個社會該如何面對、要留給下一代什麼樣的國家,我們必須認真思考。"],"trans_en":["Japan's population is aging and its birthrate falling at a speed rare even by world standards. The share of elderly people in the total population rises a little every year. Meanwhile, the number of children born keeps decreasing.","If things continue like this, social security systems such as pensions, medical care, and nursing care may no longer be sustainable. This is because the costs keep rising while the working generation that supports them keeps shrinking.","As countermeasures, people are considering expanding systems that make it easier to balance child-rearing and work. Increasing the number of foreign workers accepted is also being discussed. However, none of these are problems that can be solved quickly.","Behind the falling number of children are various reasons, such as financial anxiety and changing values. So handing out subsidies alone will not solve the problem. A declining birthrate and aging society has become an unavoidable reality. We must think seriously about how society as a whole will face it and what kind of country we will leave to the next generation."],"vocab":[{"w":"少子高齢化","r":"しょうしこうれいか","m":"少子高齡化","m_en":"declining birthrate and aging population"},{"w":"割合","r":"わりあい","m":"比例","m_en":"ratio, proportion"},{"w":"年金","r":"ねんきん","m":"年金","m_en":"pension"},{"w":"介護","r":"かいご","m":"照護","m_en":"nursing care"},{"w":"支える","r":"ささえる","m":"支撐、支持","m_en":"to support"},{"w":"両立","r":"りょうりつ","m":"兩者兼顧","m_en":"balancing both, compatibility"},{"w":"受け入れる","r":"うけいれる","m":"接納、接受","m_en":"to accept, to take in"},{"w":"背景","r":"はいけい","m":"背景","m_en":"background"},{"w":"補助金","r":"ほじょきん","m":"補助金","m_en":"subsidy"},{"w":"現実","r":"げんじつ","m":"現實","m_en":"reality"}],"grammar":[{"t":"〜かもしれない","note":"表示「也許、可能」,說話者不確定的推測。例:「社会保障の制度が続けられなくなるかもしれない」","t_en":"~かもしれない","note_en":"Expresses a possibility the speaker is unsure about. Example: 「社会保障の制度が続けられなくなるかもしれない」"},{"t":"〜やすい","note":"接在動詞ます形後面,表示「容易做某事」。例:「子育てと仕事を両立しやすくする制度」","t_en":"~やすい","note_en":"Attaches to the verb stem to mean easy to do. Example: 「子育てと仕事を両立しやすくする制度」"},{"t":"〜わけではない","note":"表示「並不是……」,部分否定,否定一般容易產生的想法。例:「補助金を配るだけで問題が解決するわけではない」","t_en":"~わけではない","note_en":"Means it does not necessarily mean that; a partial negation. Example: 「補助金を配るだけで問題が解決するわけではない」","id":"n3-43"},{"t":"〜なければならない","note":"表示「必須、非……不可」,講述義務或必要。例:「真剣に考えなければならない」","t_en":"~なければならない","note_en":"Means must or have to; expresses obligation or necessity. Example: 「真剣に考えなければならない」"}]},
{"id":"a-n1-3-n4","variant_of":"a-n1-3","level":"n4","topic":"社会","topic_en":"Society","title":"少子高齢化という問題","title_zh":"少子高齡化這個問題","title_en":"The Problem of a Declining Birthrate and Aging Society","body":"日本は世界の中でも、とても早く少子高齢化が進んでいます。お年寄りの割合は、毎年だんだん増えています。でも、生まれる子どもの数は、ずっと減り続けています。\nこのままだと、社会の大切な仕組みが大変になるかもしれません。年金や医療、介護に使うお金は、これからも増えそうです。でも、それを支える働く世代は、だんだん少なくなります。\n対策として、子育てをしながら働きやすくする制度が話し合われています。外国人の働く人を増やす話もありますが、すぐには解決できません。生まれる子どもが減る理由は、お金の不安など、いろいろあります。少子高齢化は、なくせない問題なので、みんなで真剣に話し合いましょう。","trans":["日本在世界上也是少子高齡化進展得非常快的國家。高齡者所占的比例每年慢慢增加。但是,出生的孩子數量卻一直持續減少。","照這樣下去,社會重要的運作機制可能會變得很吃力。年金、醫療、照護所用的錢,今後似乎還會增加。但是,支撐這些的工作世代卻會慢慢變少。","作為對策,大家正在討論讓人能一邊育兒一邊工作的制度。也有增加外籍勞工的說法,但無法馬上解決。孩子出生變少的原因有很多,例如對金錢的不安等等。少子高齡化是無法消除的問題,所以讓我們大家認真地討論吧。"],"trans_en":["Japan is aging and having fewer children faster than almost anywhere else in the world. The share of elderly people is slowly growing every year. But the number of babies being born keeps falling.","If this continues, important parts of our social system may run into trouble. Money spent on pensions, medical care, and nursing care looks likely to keep rising. But the working generation that supports it is slowly shrinking.","As countermeasures, people are discussing systems that make it easier to work while raising children. There is also talk of bringing in more foreign workers, but this cannot be solved right away. There are many reasons why fewer children are born, such as worries about money. This problem cannot be made to go away, so let's all discuss it seriously."],"vocab":[{"w":"少子高齢化","r":"しょうしこうれいか","m":"少子高齡化","m_en":"declining birthrate and aging population"},{"w":"お年寄り","r":"おとしより","m":"老年人","m_en":"elderly person"},{"w":"割合","r":"わりあい","m":"比例","m_en":"ratio, proportion"},{"w":"増える","r":"ふえる","m":"增加","m_en":"to increase"},{"w":"減る","r":"へる","m":"減少","m_en":"to decrease"},{"w":"年金","r":"ねんきん","m":"年金","m_en":"pension"},{"w":"支える","r":"ささえる","m":"支撐、支持","m_en":"to support"},{"w":"制度","r":"せいど","m":"制度","m_en":"system, institution"},{"w":"解決","r":"かいけつ","m":"解決","m_en":"solution, to solve"},{"w":"真剣","r":"しんけん","m":"認真","m_en":"serious, earnest"}],"grammar":[{"t":"〜かもしれません","note":"表示「也許、可能」,說話者不確定的推測。例:「社会の大切な仕組みが大変になるかもしれません」","t_en":"〜かもしれません","note_en":"Expresses a possibility the speaker is unsure about. Example: 「社会の大切な仕組みが大変になるかもしれません」","id":"n4-3"},{"t":"動詞ます形(去ます)+そうです","note":"表示根據現況「看起來似乎會…」的樣態推測。例:「これからも増えそうです」","t_en":"Verb stem + そうです","note_en":"Expresses that something looks likely to happen based on what one sees. Example: 「これからも増えそうです」"},{"t":"〜ながら","note":"表示同一個人同時做兩件事,「一邊…一邊…」。例:「子育てをしながら働きやすくする制度」","t_en":"〜ながら","note_en":"Means doing two actions at the same time, 'while doing…'. Example: 「子育てをしながら働きやすくする制度」","id":"n5-58"},{"t":"〜ので","note":"表示原因、理由,語氣比「から」柔和。例:「なくせない問題なので、みんなで真剣に話し合いましょう」","t_en":"〜ので","note_en":"Gives a reason or cause, in a softer tone than から. Example: 「なくせない問題なので、みんなで真剣に話し合いましょう」"}]},
{"id":"a-n1-4-n3","variant_of":"a-n1-4","level":"n3","topic":"メディア","topic_en":"Media","title":"情報の海を泳ぐために","title_zh":"為了在資訊之海中泅泳","title_en":"Learning to Swim in the Sea of Information","body":"スマートフォンが広まったことによって、私たちはいつでもどこでもたくさんの情報を見られるようになった。しかし、その便利さの裏には、気づきにくい危険がかくれている。\nインターネットには、本当かどうかわからない情報がたくさんある。中には、わざと人をだますために広められるうそのニュースも少なくない。事実と意見を見分ける力が、今までにないほど必要になっている。\nもっと困るのは、自分の好みに合う情報ばかりが表示されるしくみだ。知らないうちに見る範囲がせまくなり、かたよった考え方になりやすい。\n大切なのは、一つの情報をそのまま信じないで、いくつかの情報源を調べて確かめることだ。自分で情報を発信するときも、その内容に責任を持たなければならない。\n情報を正しく読み取る力は、もう一部の専門家だけのものではない。だれもが身につけるべき、現代を生きていくために欠かせない知識なのだ。","trans":["因為智慧型手機普及,我們變得隨時隨地都能看到大量的資訊。但是,在這份便利的背後,潛藏著不容易察覺的危險。","網路上有許多不知道是不是真的資訊。其中,為了欺騙別人而故意散播的假新聞也不少。分辨事實與意見的能力,比以往任何時候都更加必要。","更令人困擾的是,只會顯示符合自己喜好資訊的機制。在不知不覺中,看到的範圍變窄,容易形成偏頗的想法。","重要的是,不要直接相信單一資訊,而是查閱幾個資訊來源來確認。自己發布資訊的時候,也必須對內容負責。","正確讀懂資訊的能力,已經不只是少數專家才需要的東西。這是每個人都該具備、在現代生活下去不可或缺的知識。"],"trans_en":["Because smartphones have become widespread, we can now see a huge amount of information anytime and anywhere. However, behind that convenience hides a danger that is hard to notice.","The internet is full of information that may or may not be true. Among it, fake news spread on purpose to deceive people is also not rare. The ability to tell facts from opinions is needed more than ever before.","What is even more troubling is the system that shows only information matching your own tastes. Without realizing it, your range of view becomes narrow, and it is easy to end up with a biased way of thinking.","What matters is not to believe a single piece of information as it is, but to check several sources to confirm it. When you share information yourself, you must also take responsibility for its content.","The ability to read information correctly is no longer only for a small number of experts. It is knowledge that everyone should acquire and that is essential for living in the modern age."],"vocab":[{"w":"広まる","r":"ひろまる","m":"普及、擴散","m_en":"to spread, to become widespread"},{"w":"危険","r":"きけん","m":"危險","m_en":"danger"},{"w":"かくれる","r":"かくれる","m":"隱藏、潛藏","m_en":"to hide, to lurk"},{"w":"見分ける","r":"みわける","m":"分辨","m_en":"to distinguish"},{"w":"しくみ","r":"しくみ","m":"機制、構造","m_en":"mechanism, system"},{"w":"範囲","r":"はんい","m":"範圍","m_en":"range, scope"},{"w":"かたよる","r":"かたよる","m":"偏頗、偏向","m_en":"to be biased"},{"w":"情報源","r":"じょうほうげん","m":"資訊來源","m_en":"source of information"},{"w":"責任","r":"せきにん","m":"責任","m_en":"responsibility"},{"w":"身につける","r":"みにつける","m":"學會、具備","m_en":"to acquire (a skill)"}],"grammar":[{"t":"〜によって","note":"表示原因或手段,「因為～」。例:「スマートフォンが広まったことによって、私たちはいつでもどこでもたくさんの情報を見られるようになった」","t_en":"〜によって","note_en":"Indicates cause or means, 'because of / by'. Example: 「スマートフォンが広まったことによって、私たちはいつでもどこでもたくさんの情報を見られるようになった」"},{"t":"〜ようになる","note":"表示狀態或能力的變化,「變得能～」。例:「たくさんの情報を見られるようになった」","t_en":"〜ようになる","note_en":"Indicates a change in state or ability, 'come to be able to'. Example: 「たくさんの情報を見られるようになった」","id":"n3-40"},{"t":"〜ために","note":"表示目的,「為了～」。例:「わざと人をだますために広められるうそのニュース」","t_en":"〜ために","note_en":"Indicates purpose, 'in order to'. Example: 「わざと人をだますために広められるうそのニュース」","id":"n3-53"},{"t":"〜なければならない","note":"表示必須、義務,「必須～」。例:「その内容に責任を持たなければならない」","t_en":"〜なければならない","note_en":"Indicates obligation, 'must / have to'. Example: 「その内容に責任を持たなければならない」"}]},
{"id":"a-n1-4-n4","variant_of":"a-n1-4","level":"n4","topic":"メディア","topic_en":"Media","title":"情報をじょうずに使うために","title_zh":"為了聰明運用資訊","title_en":"How to Use Information Wisely","body":"スマホのおかげで、いつでもたくさんの情報が見られるようになった。でも、便利なだけではなく、気をつけたい問題もある。\nインターネットには、本当かどうかわからない情報がたくさんある。悪い気持ちでうそのニュースを広める人もいる。だから、事実と意見を分けて考える力がとても大切になっている。\nもっと困るのは、自分が好きな情報ばかり出てくることだ。知らないうちに、見る世界がせまくなってしまう。大切なのは、一つの情報をすぐ信じないで、ほかの情報も見て確かめることだ。自分が発信するときも、内容に責任を持たなければならない。情報を正しく読む力は、もう専門家だけのものではない。今の時代を生きるために、みんなが身につけたい大切な力だ。","trans":["多虧了智慧型手機,我們隨時都能看到很多資訊。但是,它不只是方便,也有需要注意的問題。","網路上有很多真假難辨的資訊。也有人懷著壞心眼散播假新聞。所以,分辨事實與意見並加以思考的能力變得非常重要。","更麻煩的是,出現的都是自己喜歡的資訊。在不知不覺中,自己看到的世界會變得狹窄。重要的是,不要馬上相信單一資訊,還要看其他資訊來確認。自己發布資訊的時候,也必須對內容負責。正確閱讀資訊的能力,已經不只是專家才需要的了。為了在現代生活下去,這是每個人都該具備的重要能力。"],"trans_en":["Thanks to smartphones, we can now see lots of information anytime. But it is not only convenient; there are also problems we should be careful about.","The internet has a lot of information that may or may not be true. Some people even spread fake news with bad intentions. So the ability to separate facts from opinions and think about them has become very important.","What is even more troubling is that only information you like keeps showing up. Without noticing, the world you see becomes narrow. What matters is not to believe a single piece of information right away, but to check it against other information. When you share information yourself, you must also take responsibility for its content. The ability to read information correctly is no longer just for experts. It is an important skill everyone should have to live in today's world."],"vocab":[{"w":"情報","r":"じょうほう","m":"資訊、情報","m_en":"information"},{"w":"便利","r":"べんり","m":"方便","m_en":"convenient"},{"w":"問題","r":"もんだい","m":"問題","m_en":"problem"},{"w":"本当","r":"ほんとう","m":"真的、事實","m_en":"true, real"},{"w":"広める","r":"ひろめる","m":"散播、推廣","m_en":"to spread"},{"w":"事実","r":"じじつ","m":"事實","m_en":"fact"},{"w":"意見","r":"いけん","m":"意見","m_en":"opinion"},{"w":"確かめる","r":"たしかめる","m":"確認","m_en":"to check, to confirm"},{"w":"責任","r":"せきにん","m":"責任","m_en":"responsibility"},{"w":"身につける","r":"みにつける","m":"學會、具備(能力)","m_en":"to acquire (a skill)"}],"grammar":[{"t":"〜ようになる","note":"表示變化,原本不能的事變得可以。例:「いつでもたくさんの情報が見られるようになった」","t_en":"~ yō ni naru","note_en":"Shows a change to a new state, such as becoming able to do something. Example: 「いつでもたくさんの情報が見られるようになった」","id":"n3-40"},{"w":"","t":"〜ないで","note":"表示「不做某事,而做另一件事」。例:「一つの情報をすぐ信じないで、ほかの情報も見て確かめることだ」","t_en":"~ naide","note_en":"Means doing something without doing something else. Example: 「一つの情報をすぐ信じないで、ほかの情報も見て確かめることだ」"},{"t":"〜なければならない","note":"表示必須做某事。例:「内容に責任を持たなければならない」","t_en":"~ nakereba naranai","note_en":"Means must or have to do something. Example: 「内容に責任を持たなければならない」"},{"t":"〜ばかり","note":"表示幾乎全是同一種東西。例:「自分が好きな情報ばかり出てくる」","t_en":"~ bakari","note_en":"Means only or nothing but. Example: 「自分が好きな情報ばかり出てくる」"}]},
{"id":"a-n1-5-n3","variant_of":"a-n1-5","level":"n3","topic":"社会","topic_en":"Society","title":"捨てられる食べ物","title_zh":"被丟棄的食物","title_en":"Food That Gets Thrown Away","body":"まだ食べられるのに捨てられてしまう食べ物が、世界中で大きな問題になっています。このような食べ物のことを、食品ロスと呼びます。日本でも、一年に数百万トンもの食べ物が無駄に捨てられていると言われています。\n一方で、世界には十分な食事ができない人がたくさんいます。食べ物があふれているように見える生活の裏で、大きな差が生まれているのです。\n食品ロスの原因は、家庭や飲食店で出る食べ残しだけではありません。まだ売れるはずの商品が、賞味期限を理由にたくさん処分されることもあります。このような現状を、見逃していいわけではありません。\nこの問題を解決するためには、企業の取り組みはもちろん、一人ひとりの意識も大切です。買いすぎない、作りすぎないという小さな心がけが、大きな一歩になります。限りある資源を大切にすることは、次の世代への責任でもあります。食べ物を無駄にしない暮らしが、今あらためて求められているのです。","trans":["明明還能吃卻被丟掉的食物,在全世界都成了很大的問題。這樣的食物被稱為「食品ロス」(食物浪費)。據說在日本,一年也有數百萬噸的食物被白白丟棄。","另一方面,世界上有許多人無法好好吃上足夠的飯。在食物看似多到滿出來的生活背後,正產生著巨大的落差。","食物浪費的原因,並不只是家庭或餐廳產生的剩菜剩飯。原本應該還賣得出去的商品,以賞味期限為由被大量處理掉,也是原因之一。這樣的現況,是不能視而不見的。","要解決這個問題,企業的努力自不待言,每個人的意識也很重要。不買過量、不做過量這種小小的用心,就會成為很大的一步。珍惜有限的資源,也是對下一代的責任。不浪費食物的生活方式,如今再次受到重視。"],"trans_en":["Food that could still be eaten but gets thrown away has become a big problem all over the world. This kind of food is called food loss. Even in Japan, it is said that millions of tons of food are wasted every year.","On the other hand, there are many people in the world who cannot get enough to eat. Behind a life that looks overflowing with food, a big gap is being created.","The cause of food loss is not only the leftovers from homes and restaurants. Products that could still be sold are also disposed of in large amounts because of their best-before dates. We cannot just overlook this situation.","To solve this problem, the efforts of companies are of course important, and so is the awareness of each person. Small habits such as not buying too much and not cooking too much can be a big step. Valuing limited resources is also our responsibility to the next generation. A way of living that does not waste food is being asked for again today."],"vocab":[{"w":"食品ロス","r":"しょくひんロス","m":"食物浪費","m_en":"food loss; food waste"},{"w":"捨てる","r":"すてる","m":"丟棄","m_en":"to throw away"},{"w":"無駄","r":"むだ","m":"浪費、白費","m_en":"waste; useless"},{"w":"十分","r":"じゅうぶん","m":"足夠、充分","m_en":"enough; sufficient"},{"w":"賞味期限","r":"しょうみきげん","m":"賞味期限","m_en":"best-before date"},{"w":"処分","r":"しょぶん","m":"處理、處置","m_en":"disposal"},{"w":"見逃す","r":"みのがす","m":"視而不見、忽略","m_en":"to overlook"},{"w":"取り組み","r":"とりくみ","m":"努力、措施","m_en":"effort; initiative"},{"w":"意識","r":"いしき","m":"意識","m_en":"awareness"},{"w":"心がけ","r":"こころがけ","m":"留心、用心","m_en":"mindset; habit of keeping something in mind"}],"grammar":[{"t":"〜ように見える","note":"表示「看起來像是…」的樣子。例:「食べ物があふれているように見える生活の裏で、大きな差が生まれているのです」","t_en":"~ように見える","note_en":"Means 'looks as if ~'. Example: 「食べ物があふれているように見える生活の裏で、大きな差が生まれているのです」"},{"t":"〜わけではない","note":"表示「並不是…」,部分否定,委婉否定某種想法。例:「このような現状を、見逃していいわけではありません」","t_en":"~わけではない","note_en":"Means 'it is not that ~'; a partial or soft negation. Example: 「このような現状を、見逃していいわけではありません」","id":"n3-43"},{"t":"〜ためには","note":"表示「為了…就必須」,後面接必要的條件或做法。例:「この問題を解決するためには、企業の取り組みはもちろん、一人ひとりの意識も大切です」","t_en":"~ためには","note_en":"Means 'in order to ~'; followed by what is necessary. Example: 「この問題を解決するためには、企業の取り組みはもちろん、一人ひとりの意識も大切です」"},{"t":"〜はもちろん","note":"表示「…自不待言,連…也」,先舉出理所當然的例子。例:「企業の取り組みはもちろん、一人ひとりの意識も大切です」","t_en":"~はもちろん","note_en":"Means '~ goes without saying, and also ...'. Example: 「企業の取り組みはもちろん、一人ひとりの意識も大切です」","id":"n2-28"}]},
{"id":"a-n1-5-n4","variant_of":"a-n1-5","level":"n4","topic":"社会","topic_en":"Society","title":"捨てられる食べ物","title_zh":"被丟棄的食物","title_en":"Food That Gets Thrown Away","body":"まだ食べられるのに捨てられてしまう食べ物が、世界で問題になっている。このような食べ物のむだを、食品ロスと言う。日本でも、毎年とても多くの食べ物がむだに捨てられているそうだ。\n一方で、世界にはご飯を十分に食べられない人がたくさんいる。食べ物が多い国の陰で、とても大きな差が生まれている。食品ロスの原因は、家や店で残したご飯だけではない。\nまだ売れる商品が、賞味期限のせいでたくさん捨てられることもある。この問題を解決するには、会社の努力も、一人ひとりの気持ちも大切だ。買いすぎない、作りすぎないようにするのが、大きな一歩になる。少ない資源を大切にするのは、次の世代への責任でもある。食べ物をむだにしない生活を、今もう一度考えてみよう。","trans":["明明還能吃卻被丟掉的食物,已經成為全世界的問題。像這樣浪費食物,稱為食物浪費。據說在日本,每年也有非常多的食物被白白丟掉。","另一方面,世界上有很多人無法吃到足夠的飯。在食物很多的國家背後,產生了很大的落差。食物浪費的原因,不只是在家裡或餐廳剩下的飯菜。","還賣得出去的商品,也會因為賞味期限而被大量丟掉。要解決這個問題,公司的努力和每個人的想法都很重要。盡量不買太多、不做太多,就會是很大的一步。珍惜有限的資源,也是對下一代的責任。讓我們現在再想一想不浪費食物的生活吧。"],"trans_en":["Food that could still be eaten is being thrown away, and this has become a problem around the world. This kind of food waste is called food loss. They say that in Japan, too, a great deal of food is wasted every year.","On the other hand, many people in the world cannot get enough to eat. Behind countries with plenty of food, a very big gap has appeared. The cause of food loss is not only the leftovers from homes and restaurants.","Products that can still be sold are also often thrown away in large amounts because of their best-before dates. To solve this problem, the efforts of companies and the thinking of each person are both important. Trying not to buy too much or cook too much will be a big first step. Taking care of limited resources is also our responsibility to the next generation. Let's think again, now, about a life that does not waste food."],"vocab":[{"w":"捨てられる","r":"すてられる","m":"被丟掉","m_en":"to be thrown away"},{"w":"食品ロス","r":"しょくひんロス","m":"食物浪費","m_en":"food loss, food waste"},{"w":"問題","r":"もんだい","m":"問題","m_en":"problem"},{"w":"毎年","r":"まいとし","m":"每年","m_en":"every year"},{"w":"むだ","r":"むだ","m":"浪費、白費","m_en":"waste"},{"w":"十分","r":"じゅうぶん","m":"足夠","m_en":"enough, sufficient"},{"w":"原因","r":"げんいん","m":"原因","m_en":"cause"},{"w":"解決","r":"かいけつ","m":"解決","m_en":"solution, to solve"},{"w":"大切","r":"たいせつ","m":"重要、珍惜","m_en":"important, to value"},{"w":"責任","r":"せきにん","m":"責任","m_en":"responsibility"}],"grammar":[{"t":"〜のに","note":"表示「明明……卻……」,帶有不滿或可惜的語氣。例:「まだ食べられるのに捨てられてしまう食べ物が、世界で問題になっている」","t_en":"~noni","note_en":"Means 'even though ~' and expresses regret or dissatisfaction. Example: 「まだ食べられるのに捨てられてしまう食べ物が、世界で問題になっている」"},{"t":"〜そうだ(傳聞)","note":"接在普通形後面,表示「聽說……」。例:「日本でも、毎年とても多くの食べ物がむだに捨てられているそうだ」","t_en":"~sou da (hearsay)","note_en":"Attached to the plain form to mean 'I heard that ~'. Example: 「日本でも、毎年とても多くの食べ物がむだに捨てられているそうだ」"},{"t":"可能形(食べられる)","note":"動詞改成可能形,表示「能夠……」,否定則是「無法……」。例:「世界にはご飯を十分に食べられない人がたくさんいる」","t_en":"Potential form","note_en":"The potential form of a verb means 'can do ~'; the negative means 'cannot'. Example: 「世界にはご飯を十分に食べられない人がたくさんいる」","id":"n4-52"},{"t":"〜ようにする","note":"表示努力養成某種習慣或盡量去做(否定為「〜ないようにする」)。例:「買いすぎない、作りすぎないようにするのが、大きな一歩になる」","t_en":"~you ni suru","note_en":"Means 'to try to ~' or 'to make a habit of ~'; the negative is ~nai you ni suru. Example: 「買いすぎない、作りすぎないようにするのが、大きな一歩になる」","id":"n3-39"}]},
{"id":"a-n1-6-n3","variant_of":"a-n1-6","level":"n3","topic":"文化","topic_en":"Culture","title":"受け継がれるもの","title_zh":"被傳承下來的東西","title_en":"What Is Passed Down","body":"日本各地に伝わる伝統文化や職人の技は、長い時間をかけて受け継がれてきた大切な財産だ。しかし今、その多くがなくなってしまうかもしれない危機に直面している。\nいちばん大きな原因は、技を受け継ぐ後継者が足りないことだ。高齢化が進むだけでなく、若者が都市に出ていくため、学ぼうとする人は毎年減っている。\n伝統を守るといっても、昔のままを保てばいいというわけではない。時代の変化に合わせて新しい価値を生み出すことによって、文化は生き続けることができる。\n最近では、伝統工芸に現代的なデザインを取り入れる例が増えている。海外に向けて魅力を発信しようとする試みも、少しずつ広がってきた。古いものと新しいものを組み合わせることが、道を開くカギになるだろう。昔の人が築いてきたものを、どうやって次の世代につなげていくか。それは、私たち一人ひとりに残された大きな宿題なのかもしれない。","trans":["日本各地流傳的傳統文化與工匠的技藝,是花了很長時間傳承下來的重要資產。然而如今,其中許多正面臨可能消失的危機。","最大的原因是繼承技藝的後繼者不足。不只是高齡化持續加劇,年輕人也因為前往都市,想學習技藝的人逐年減少。","雖說要守護傳統,但並不是只要保持昔日的原貌就好。唯有配合時代的變化、創造出新的價值,文化才能繼續存活。","最近,將現代設計融入傳統工藝的例子正在增加。向海外傳達其魅力的嘗試,也一點一點地擴展開來。將舊事物與新事物結合,應該會成為開拓出路的關鍵。如何把先人所建立的東西傳承給下一個世代?那或許是留給我們每一個人的一份沉重功課。"],"trans_en":["The traditional culture and craftsmen's skills handed down across Japan are valuable assets that have been passed on over a long time. Yet today, many of them face the danger of disappearing.","The biggest cause is a lack of successors to carry on the skills. Not only is the population of craftspeople aging, but young people are also leaving for the cities, so the number of people trying to learn these skills falls every year.","Even if we say we protect tradition, it doesn't mean we can just keep things exactly as they were. Culture can keep living only by creating new value in step with the changing times.","Recently, examples of adding modern design to traditional crafts have been increasing. Attempts to share their appeal with the world have also been spreading little by little. Combining the old and the new will probably become the key to opening a path forward. How can we pass on what our predecessors built to the next generation? That may be a heavy assignment left to each one of us."],"vocab":[{"w":"伝わる","r":"つたわる","m":"流傳、傳承","m_en":"to be handed down, to spread"},{"w":"職人","r":"しょくにん","m":"工匠、職人","m_en":"craftsman, artisan"},{"w":"受け継ぐ","r":"うけつぐ","m":"繼承、傳承","m_en":"to inherit, to carry on"},{"w":"財産","r":"ざいさん","m":"資產、財富","m_en":"asset, property"},{"w":"危機","r":"きき","m":"危機","m_en":"crisis, danger"},{"w":"直面する","r":"ちょくめんする","m":"面臨","m_en":"to face, to confront"},{"w":"後継者","r":"こうけいしゃ","m":"後繼者","m_en":"successor"},{"w":"高齢化","r":"こうれいか","m":"高齡化","m_en":"aging (of a population)"},{"w":"保つ","r":"たもつ","m":"保持、維持","m_en":"to keep, to maintain"},{"w":"生み出す","r":"うみだす","m":"創造出、產生","m_en":"to create, to produce"}],"grammar":[{"t":"〜というわけではない","note":"表示「並不是說……」,部分否定。例:「昔のままを保てばいいというわけではない」","t_en":"~toiu wake dewa nai","note_en":"Means 'it doesn't mean that...', a partial negation. Example: 「昔のままを保てばいいというわけではない」"},{"t":"〜といっても","note":"雖說……但……,用來補充或修正前面的印象。例:「伝統を守るといっても、昔のままを保てばいいというわけではない」","t_en":"~to itte mo","note_en":"Means 'even if we say...' or 'although...', used to qualify a statement. Example: 「伝統を守るといっても、昔のままを保てばいいというわけではない」"},{"t":"〜によって","note":"表示手段或方法,「藉由……」。例:「新しい価値を生み出すことによって、文化は生き続けることができる」","t_en":"~ni yotte","note_en":"Indicates means or method, 'by...' or 'through...'. Example: 「新しい価値を生み出すことによって、文化は生き続けることができる」"},{"t":"〜ため(に)","note":"表示原因或理由,「因為……」。例:「若者が都市に出ていくため、学ぼうとする人は毎年減っている」","t_en":"~tame (ni)","note_en":"Indicates a cause or reason, 'because...'. Example: 「若者が都市に出ていくため、学ぼうとする人は毎年減っている」"}]},
{"id":"a-n1-6-n4","variant_of":"a-n1-6","level":"n4","topic":"文化","topic_en":"Culture","title":"受け継がれるもの","title_zh":"被傳承下來的東西","title_en":"Things Handed Down","body":"日本には、昔から伝わる文化や職人の技がたくさんあります。それは長い時間をかけて、大切に守られてきたものです。でも今、その多くがなくなりそうで、とても心配されています。\nいちばんの理由は、技を続ける人が足りないことです。技を持つ人たちは、だんだん年をとってきています。若い人は都市へ出ていって、技を学ぶ人も毎年少なくなっています。\n伝統を守るには、昔のままにするだけではいけません。時代に合わせて、新しい良さを作ることも大切です。最近は、古い工芸に新しいデザインを入れる人もいます。海外に向けて、その良さを伝える人も増えてきました。昔のものを次の世代に残すために、私たちも何ができるか考えたいです。","trans":["日本有許多從以前流傳下來的文化和工匠的技藝。那是花了很長的時間、被細心守護下來的東西。但現在,其中許多都快要消失了,令人非常擔心。","最大的理由是繼續傳承技藝的人不夠。擁有技藝的人們,年紀漸漸變大了。年輕人離開前往都市,學習技藝的人也每年越來越少。","要守護傳統,不能只是維持昔日的樣子。配合時代,創造新的優點也很重要。最近,也有人把新的設計加入古老的工藝。向海外傳達其優點的人也增加了。為了把以前的東西留給下一個世代,我們也想想自己能做些什麼。"],"trans_en":["Japan has many cultures and craftspeople's skills that have been passed down since long ago. They have been carefully protected over a long time. But now, many of them are about to disappear, and people are very worried.","The main reason is that there are not enough people to carry on the skills. The people who have the skills are getting older little by little. Young people leave for the cities, and the number of people learning the skills decreases every year.","To protect tradition, it is not enough to keep things just as they were. It is also important to create new strengths to fit the times. Recently, some people add new designs to old crafts. More people are also sharing their appeal overseas. To leave old things to the next generation, I want us to think about what we can do too."],"vocab":[{"w":"伝統","r":"でんとう","m":"傳統","m_en":"tradition"},{"w":"職人","r":"しょくにん","m":"工匠、職人","m_en":"craftsperson"},{"w":"技","r":"わざ","m":"技藝、技術","m_en":"skill, technique"},{"w":"心配","r":"しんぱい","m":"擔心","m_en":"worry"},{"w":"理由","r":"りゆう","m":"理由","m_en":"reason"},{"w":"都市","r":"とし","m":"都市","m_en":"city"},{"w":"学ぶ","r":"まなぶ","m":"學習","m_en":"to learn"},{"w":"工芸","r":"こうげい","m":"工藝","m_en":"craft"},{"w":"世代","r":"せだい","m":"世代","m_en":"generation"}],"grammar":[{"t":"〜そうだ(樣態)","note":"表示看起來快要發生某事。例:「その多くがなくなりそうで」表示許多快要消失了。","t_en":"~sou da (appearance)","note_en":"Shows that something looks about to happen. Example: 「その多くがなくなりそうで」 means many are about to disappear."},{"t":"〜てきた","note":"表示變化一路持續到現在。例:「人も増えてきました」表示人漸漸變多了。","t_en":"~te kita","note_en":"Shows a change that has continued up to now. Example: 「人も増えてきました」 means the number has been growing."},{"t":"〜ために","note":"表示目的,為了做某事。例:「次の世代に残すために」表示為了留給下一代。","t_en":"~tame ni","note_en":"Shows purpose, in order to do something. Example: 「次の世代に残すために」 means in order to leave it to the next generation.","id":"n3-53"},{"t":"〜たいです","note":"表示說話者的願望。例:「考えたいです」表示想要思考。","t_en":"~tai desu","note_en":"Shows the speaker's wish. Example: 「考えたいです」 means I want to think about it."}]},
{"id":"a-n1-7-n3","variant_of":"a-n1-7","level":"n3","topic":"言語","topic_en":"Language","title":"変わりゆく日本語","title_zh":"持續改變的日語","title_en":"The Ever-Changing Japanese Language","body":"「ら抜き言葉」という言葉を聞いたことがありますか。「食べられる」を「食べれる」と言うことで、正しくない日本語だと言われることが多いです。「食べられる」から「ら」を抜いた形なので、気になる人もいるようです。\nしかし、言語学の立場で見ると、これは単なる乱れではなく、合理的な変化だという考え方もあります。「見られる」には受身や尊敬、可能など、いくつもの意味があります。「見れる」なら、可能の意味だとすぐに分かるのです。分かりやすくなるため、このように変わったと考えられます。\nそもそも、言葉は昔からずっと変わり続けてきました。今、私たちが「正しい」と信じている日本語も、百年前の人から見れば、乱れた言葉にすぎないでしょう。百年前の人が今の日本語を聞いたら、おかしいと感じるかもしれません。\n変化を悲しむより、なぜ変わるのかを考えるほうが、言葉の本質に近づけるのではないでしょうか。言葉が変わるときには、何か理由があるはずです。","trans":["你聽過「ら抜き言葉(去ら詞)」這個詞嗎?把「食べられる」說成「食べれる」,常被批評是不正確的日語。因為是把「食べられる」中的「ら」拿掉,所以也有人會覺得不順耳。","但從語言學的立場來看,也有一種觀點認為:這不是單純的「語言混亂」,而是一種合理的變化。「見られる」有被動、尊敬、可能等好幾種意思。而「見れる」的話,馬上就能看出是「可能」的意思。正因為變得更容易理解,才會變成這樣吧。","說到底,語言從以前就一直在變化。如今我們深信「正確」的日語,在一百年前的人看來,也不外乎只是一種走樣的語言。要是一百年前的人聽到現在的日語,說不定也會覺得很奇怪。","與其感嘆變化,不如去思考「為什麼會變」,這樣或許更能接近語言的本質,不是嗎?語言改變的時候,一定有它的理由。"],"trans_en":["Have you ever heard the term \"ra-nuki kotoba\" (ra-dropping speech)? Saying \"tabereru\" instead of \"taberareru\" is often criticized as incorrect Japanese. Because it is the form with the \"ra\" removed, some people find it bothersome.","However, from the viewpoint of linguistics, some people see this not as mere corruption but as a rational change. \"Mirareru\" has several meanings, such as passive, honorific, and potential. With \"mireru,\" you can tell right away that it means potential. It is thought that the word changed this way because it became easier to understand.","In the first place, language has kept changing since long ago. The Japanese we believe to be \"correct\" today would be nothing more than corrupted language to people a hundred years ago. If people from a hundred years ago heard today's Japanese, they might think it sounds strange.","Rather than lamenting change, wouldn't thinking about why language changes bring us closer to its true nature? When language changes, there must be some reason behind it."],"vocab":[{"w":"言語学","r":"げんごがく","m":"語言學","m_en":"linguistics"},{"w":"立場","r":"たちば","m":"立場、觀點","m_en":"standpoint, position"},{"w":"単なる","r":"たんなる","m":"單純的、僅僅的","m_en":"mere, simple"},{"w":"合理的","r":"ごうりてき","m":"合理的","m_en":"rational, reasonable"},{"w":"変化","r":"へんか","m":"變化","m_en":"change"},{"w":"受身","r":"うけみ","m":"被動(語態)","m_en":"passive voice"},{"w":"尊敬","r":"そんけい","m":"尊敬(語)","m_en":"honorific, respect"},{"w":"可能","r":"かのう","m":"可能(能夠做)","m_en":"potential, possible"},{"w":"信じている","r":"しんじている","m":"相信著、深信","m_en":"believe, trust"},{"w":"本質","r":"ほんしつ","m":"本質","m_en":"essence, true nature"}],"grammar":[{"t":"〜ため(原因・理由)","note":"表示原因或理由,比「から」更書面。例:「分かりやすくなるため」這樣變了,說明變化的理由。","t_en":"〜ため (cause or reason)","note_en":"Shows a cause or reason, more formal than から. Example: 「分かりやすくなるため」 explains why the change happened."},{"t":"〜にすぎない","note":"表示「只不過是、不外乎」,帶有「沒什麼了不起」的語氣。例:「乱れた言葉にすぎないでしょう」。","t_en":"〜にすぎない","note_en":"Means \"nothing more than, merely.\" Example: 「乱れた言葉にすぎないでしょう」.","id":"n2-29"},{"t":"〜より〜ほうが","note":"比較兩件事,表示「與其A,不如B」。例:「変化を悲しむより、なぜ変わるのかを考えるほうが」。","t_en":"〜より〜ほうが","note_en":"Compares two things: \"B is better than A.\" Example: 「変化を悲しむより、なぜ変わるのかを考えるほうが」."},{"t":"〜はずだ","note":"表示根據道理或常識所做的推測,意為「應該」。例:「何か理由があるはずです」。","t_en":"〜はずだ","note_en":"Expresses a reasoned expectation: \"should be, must be.\" Example: 「何か理由があるはずです」.","id":"n3-45"}]},
{"id":"a-n1-7-n4","variant_of":"a-n1-7","level":"n4","topic":"言語","topic_en":"Language","title":"変わっていく日本語","title_zh":"持續改變的日語","title_en":"The Japanese Language Keeps Changing","body":"「ら抜き言葉」という言葉を聞いたことがありますか。「食べられる」を「食べれる」と言う人が、今は多くなっています。でも、この言い方は正しくない日本語だと言われることがあります。\n言葉を研究する人には、悪い変化ではないと考える人もいます。「見られる」にはいくつか意味があるので、分かりにくいことがあります。でも「見れる」なら、「できる」という意味だとすぐ分かります。\nそして、言葉は昔からずっと変わってきました。今正しいと思われている日本語も、百年前の人には変な言葉でしょう。変わることを悲しむより、なぜ変わるのか考えてみませんか。","trans":["你聽過「ら抜き言葉」這個詞嗎?很多人現在會把「食べられる」說成「食べれる」。但這種說法常被認為是不正確的日語。","有些研究語言的人認為,這不是不好的變化。「見られる」有好幾個意思,所以有時不容易分辨。但如果是「見れる」,馬上就知道是「能看」的意思。","而且,語言從以前就一直在改變。現在被認為正確的日語,在一百年前的人看來,也會是奇怪的說法吧。與其為改變感到難過,不如想想為什麼會改變,好嗎?"],"trans_en":["Have you ever heard the term \"ra-nuki kotoba\"? Many people now say \"tabereru\" instead of \"taberareru.\" But this way of speaking is often said to be incorrect Japanese.","Some people who study language think it is not a bad change. \"Mirareru\" has several meanings, so it can be hard to tell which one is meant. But with \"mireru,\" you can tell right away that it means \"can see.\"","Language has been changing since long ago. The Japanese we think of as correct today would probably seem strange to people a hundred years ago. Instead of feeling sad about change, why not think about why it changes?"],"vocab":[{"w":"言葉","r":"ことば","m":"語言、詞語","m_en":"language, word"},{"w":"聞いた","r":"きいた","m":"聽了(聞く的過去形)","m_en":"heard (past of 聞く)"},{"w":"正しい","r":"ただしい","m":"正確的","m_en":"correct"},{"w":"研究","r":"けんきゅう","m":"研究","m_en":"research, study"},{"w":"変化","r":"へんか","m":"變化","m_en":"change"},{"w":"意味","r":"いみ","m":"意思","m_en":"meaning"},{"w":"分かります","r":"わかります","m":"懂、知道","m_en":"understand"},{"w":"昔","r":"むかし","m":"以前、很久以前","m_en":"long ago"},{"w":"悲しむ","r":"かなしむ","m":"感到悲傷","m_en":"to feel sad"},{"w":"考えて","r":"かんがえて","m":"思考(考える的て形)","m_en":"think (te-form of 考える)"}],"grammar":[{"t":"〜たことがある","note":"表示有過某種經驗。例:「聞いたことがありますか」是在問對方有沒有聽過。","t_en":"~ta koto ga aru","note_en":"Expresses past experience. Example: 「聞いたことがありますか」 asks whether you have ever heard it."},{"t":"〜ので","note":"表示原因、理由,語氣比「から」柔和。例:「いくつか意味があるので、分かりにくいことがあります」","t_en":"~node","note_en":"Gives a reason, softer than から. Example: 「いくつか意味があるので、分かりにくいことがあります」"},{"t":"〜にくい","note":"接在動詞ます形後,表示不容易做某事。例:「分かりにくいことがあります」","t_en":"~nikui","note_en":"Attached to the verb stem; means hard to do. Example: 「分かりにくいことがあります」"},{"t":"〜てくる","note":"表示變化從過去一直持續到現在。例:「言葉は昔からずっと変わってきました」","t_en":"~te kuru","note_en":"Shows a change that continued from the past up to now. Example: 「言葉は昔からずっと変わってきました」"}]},
{"id":"a-n1-8-n3","variant_of":"a-n1-8","level":"n3","topic":"社会","topic_en":"Society","title":"外国人材と日本社会のこれから","title_zh":"外國人才與日本社會的未來","title_en":"Foreign Workers and the Future of Japanese Society","body":"人手が足りない問題は、これからも続くと考えられている。そのため、外国人を受け入れることは、一時的な方法とは言えなくなってきた。\n特定技能などの制度ができて、日本に住む外国人の数は、過去で一番多くなり続けている。しかし、人が増えたからといって、その人たちが日本に長く住むわけではない。\n言葉が通じないこと、住む家を探すこと、子どもの教育など、生活の土台ができていなければ、給料や条件をよくしても、人は日本に落ち着かない。\n企業は、人を雇ったあとも、日本語を教えたり、地域の人とのつながりを作ったりする必要が出てくる。\n受け入れる私たちの考え方も大切だ。相手を「働く人」としてだけ見るのではなく、同じ地域に住む隣人として付き合えるかどうかが問われている。\n制度によって変わる部分もあるが、最後に長く住むかどうかを決めるのは、毎日の小さな付き合いの積み重ねだろう。\n外国人の問題を考えることは、日本がどんな社会になりたいのかを考えることでもあるのだ。","trans":["人手不足的問題,被認為今後仍會持續。因此,接納外國人已經不能再說只是暫時的方法了。","特定技能等制度建立之後,住在日本的外國人人數持續創下歷史新高。然而,並不是人數增加,他們就會長期住在日本。","如果語言不通、找住處、孩子的教育等生活根基沒有打好,即使提高薪水和條件,人也不會在日本安定下來。","企業在僱用人之後,也必須教日語、建立與當地居民的連結。","接納他們的我們的想法也很重要。能不能不只把對方看作「勞動者」,而是以住在同一地區的鄰居身分來往,正受到檢視。","雖然有些部分會因制度而改變,但最後決定是否長住的,恐怕是每天小小往來的累積。","思考外國人的問題,也就是在思考日本想成為什麼樣的社會。"],"trans_en":["The labor shortage is expected to continue. For that reason, accepting foreign workers can no longer be called a temporary measure.","Systems such as Specified Skilled Worker have been created, and the number of foreigners living in Japan keeps reaching record highs. However, more people does not mean they will stay in Japan for the long term.","If the foundations of daily life, such as language, housing, and children's education, are not in place, people will not settle in Japan even if pay and conditions improve.","Even after hiring people, companies need to teach Japanese and build connections with local residents.","How we, the receiving side, think is also important. What is being asked is whether we can treat them not only as workers but as neighbors living in the same community.","Some things change depending on the system, but what finally decides whether people stay long term is probably the accumulation of small daily interactions.","Thinking about foreign residents is also thinking about what kind of society Japan wants to be."],"vocab":[{"w":"人手","r":"ひとで","m":"人力、人手","m_en":"labor, manpower"},{"w":"受け入れる","r":"うけいれる","m":"接納、接受","m_en":"to accept, to take in"},{"w":"一時的","r":"いちじてき","m":"暫時的","m_en":"temporary"},{"w":"制度","r":"せいど","m":"制度","m_en":"system, institution"},{"w":"土台","r":"どだい","m":"根基、基礎","m_en":"foundation"},{"w":"落ち着く","r":"おちつく","m":"安定下來、定居","m_en":"to settle down"},{"w":"企業","r":"きぎょう","m":"企業","m_en":"company, business"},{"w":"地域","r":"ちいき","m":"地區、社區","m_en":"local area, community"},{"w":"隣人","r":"りんじん","m":"鄰居","m_en":"neighbor"}],"grammar":[{"t":"〜ようになる/〜ようにする(ここでは〜と考えられている)","note":"本文用「考えられている」表示一般的看法(被動形)。「人手が足りない問題は、これからも続くと考えられている」","t_en":"passive + ている (general view)","note_en":"The passive 'kangaerarete iru' expresses a general opinion: 「人手が足りない問題は、これからも続くと考えられている」"},{"t":"〜からといって〜わけではない","note":"表示「即使有某個理由,也不一定……」。「人が増えたからといって、その人たちが日本に長く住むわけではない」","t_en":"〜からといって〜わけではない","note_en":"Means 'just because ~, it doesn't necessarily mean ~': 「人が増えたからといって、その人たちが日本に長く住むわけではない」"},{"t":"〜によって","note":"表示依據、原因或手段,這裡是「依制度而不同」。「制度によって変わる部分もあるが」","t_en":"〜によって","note_en":"Means 'depending on / by means of': 「制度によって変わる部分もあるが」"},{"t":"〜かどうか","note":"表示「是否……」,把疑問放進句子中。「同じ地域に住む隣人として付き合えるかどうかが問われている」","t_en":"〜かどうか","note_en":"Means 'whether or not ~': 「同じ地域に住む隣人として付き合えるかどうかが問われている」"}]},
{"id":"a-n1-8-n4","variant_of":"a-n1-8","level":"n4","topic":"社会","topic_en":"Society","title":"外国から来た人と日本のこれから","title_zh":"外國來的人與日本的未來","title_en":"Foreign Workers and the Future of Japan","body":"今の日本では、働く人が足りない問題がずっと続いている。そのため、外国から来た人に働いてもらうことは、少しの間だけの方法ではなくなった。\n新しい制度ができて、日本に住む外国人の数は今までで一番多くなっている。でも、人が増えても、ずっと日本に住むとは限らない。言葉が難しかったり、家を探すのが大変だったり、子どもの勉強が心配だったりすると、生活が安定しない。給料がよくなっても、生活が安定しなければ、その人は日本に長くいられない。\n会社も、働き始めた後に日本語を教えたり、地域の人と会える機会を作ったりする必要がある。日本人も、外国の人を「働く人」としてだけ見ないで、同じ町に住む隣の人として考えてほしい。外国人のことを考えることは、日本がどんな社会になりたいかを考えることでもある。","trans":["現在的日本,人手不足的問題一直持續。因此,請外國來的人工作,已經不再只是暫時的辦法。","新的制度建立後,住在日本的外國人人數達到歷來最多。但是,人變多了,也不一定會一直住在日本。如果語言很難、找房子很辛苦、或擔心孩子的學習,生活就不會穩定。就算薪水變好,只要生活不穩定,那個人就無法在日本待很久。","公司也需要在對方開始工作後,教日語,並創造讓他們和地方上的人見面的機會。日本人也希望不要只把外國人看成「勞動力」,而是當作住在同一個城鎮的鄰居來思考。思考外國人的事,也就是在思考日本想成為什麼樣的社會。"],"trans_en":["In Japan today, the shortage of workers keeps going. So having people from other countries work here is no longer just a short-term solution.","New systems have been made, and the number of foreigners living in Japan is the highest ever. But even if the number grows, they do not always stay in Japan for good. If the language is hard, finding a house is difficult, or they worry about their children's studies, life is not stable. Even if pay gets better, without a stable life they cannot stay in Japan for long.","Companies also need to teach Japanese after people start work and to create chances to meet local people. Japanese people, too, should not see foreigners only as workers, but think of them as neighbors in the same town. Thinking about foreigners is also thinking about what kind of society Japan wants to be."],"vocab":[{"w":"足りない","r":"たりない","m":"不足、不夠","m_en":"not enough"},{"w":"制度","r":"せいど","m":"制度","m_en":"system, institution"},{"w":"増える","r":"ふえる","m":"增加","m_en":"to increase"},{"w":"生活","r":"せいかつ","m":"生活","m_en":"daily life"},{"w":"安定","r":"あんてい","m":"穩定","m_en":"stable"},{"w":"給料","r":"きゅうりょう","m":"薪水","m_en":"salary, pay"},{"w":"地域","r":"ちいき","m":"地區、地方","m_en":"area, community"},{"w":"機会","r":"きかい","m":"機會","m_en":"chance, opportunity"},{"w":"隣","r":"となり","m":"隔壁、鄰居","m_en":"next door, neighbor"},{"w":"社会","r":"しゃかい","m":"社會","m_en":"society"}],"grammar":[{"t":"〜ても","note":"表示「即使…也…」。例:「給料がよくなっても、生活が安定しなければ、その人は日本に長くいられない」","t_en":"~te mo (even if)","note_en":"Means 'even if...'. Example: 「給料がよくなっても、生活が安定しなければ、その人は日本に長くいられない」","id":"n3-73"},{"w":"","t":"〜ば(條件形)","note":"表示條件「如果…就…」。例:「生活が安定しなければ、その人は日本に長くいられない」","t_en":"~ba (conditional)","note_en":"Means 'if...'. Example: 「生活が安定しなければ、その人は日本に長くいられない」"},{"t":"〜とは限らない","note":"表示「不一定…」。例:「ずっと日本に住むとは限らない」","t_en":"~to wa kagiranai (not necessarily)","note_en":"Means 'not necessarily'. Example: 「ずっと日本に住むとは限らない」","id":"n2-58"},{"t":"〜てほしい","note":"表示希望對方做某事。例:「同じ町に住む隣の人として考えてほしい」","t_en":"~te hoshii (want someone to)","note_en":"Expresses a wish that someone do something. Example: 「同じ町に住む隣の人として考えてほしい」"}]},
{"id":"a-n1-9-n3","variant_of":"a-n1-9","level":"n3","topic":"文化","topic_en":"Culture","title":"住まいに残る人との距離","title_zh":"居住空間裡留存的人際距離","title_en":"Distance Between People in Japanese Homes","body":"日本の住まいには、はっきり言葉にされない人との距離の取り方が、いろいろなところに隠れている。例えば、玄関で靴を脱ぐという習慣には、「外」と「内」をはっきり分ける線が引かれている。上がり框をまたぐ動作は、ただの移動ではなく、気持ちを切り替えるための儀式のようなものだ。\n襖や障子のような仕切りは、完全には閉ざしきらないところが面白い。音も人の気配も通す薄い一枚なのに、それでも空間を分けたことにするのである。この曖昧さは、狭い家で他の人と暮らすための知恵だったのではないだろうか。\n集合住宅が主流になった今も、その感覚は形を変えて残っている。生活の音に気をつかうのは、壁が薄いからというわけではない。互いの領域を侵さないという昔からの作法が、今も続いているためだと考えられる。\nただ、こうした距離感は、外から来た人にはなかなか読み取れない。挨拶をするべきか、どこまで近づいてよいのか、決まりが書かれていないので迷うことも多い。しかし、それは一人一人が加減を任されているということでもある。住まいは、人との距離をどう測るかという問いが、毎日静かに繰り返される場所かもしれない。","trans":["日本的住家裡,在各個角落都藏著沒有明確說出口的、與人相處的距離拿捏。例如在玄關脫鞋這個習慣,就劃下了清楚區分「外」與「內」的界線。跨過門檻的動作不只是移動,而是像一種切換心情的儀式。","紙門和障子這類隔間,有趣的地方在於並不完全關死。明明是連聲音和人的氣息都能穿透的薄薄一片,卻仍然當作已經把空間分開了。這份曖昧,或許就是在狹小的家裡與他人共同生活的智慧吧。","即使在集合住宅成為主流的現在,這種感覺仍以不同的形式留存下來。對生活噪音那麼小心,並不是因為牆壁很薄。這應該是因為「不侵犯彼此領域」這種自古以來的禮節,至今仍在延續。","不過,這樣的距離感,對從外面來的人來說很難讀懂。該不該打招呼、可以靠近到什麼程度,因為沒有寫明規定,所以常常感到迷惘。但是,這也代表分寸是交給每個人自己拿捏的。居住空間或許就是「該如何衡量與他人的距離」這個問題,每天靜靜重複的地方。"],"trans_en":["In Japanese homes, unspoken ways of keeping distance between people are hidden in many places. Take the custom of removing your shoes at the entrance: it draws a clear line between \"outside\" and \"inside.\" Stepping over the raised step is not just movement but something like a ritual for switching your mindset.","Dividers such as fusuma and shoji are interesting because they never fully close off a space. Even though they are thin sheets that let sound and presence pass through, people still treat the space as divided. This ambiguity may have been wisdom for living with others in small homes.","Even now that apartment buildings are the mainstream, that sense remains in a different form. Being careful about everyday noise is not simply because the walls are thin. It is probably because the old manners of not intruding on each other's space are still continuing.","However, this sense of distance is hard for people from outside to read. They often hesitate about whether to greet neighbors and how close they may get, because no rules are written down. But this also means that each person is trusted to judge the right degree. A home may be a place where the question of how to measure distance from others is quietly repeated every day."],"vocab":[{"w":"玄関","r":"げんかん","m":"玄關","m_en":"entrance hall"},{"w":"習慣","r":"しゅうかん","m":"習慣","m_en":"custom, habit"},{"w":"儀式","r":"ぎしき","m":"儀式","m_en":"ritual, ceremony"},{"w":"仕切り","r":"しきり","m":"隔間、隔板","m_en":"divider, partition"},{"w":"気配","r":"けはい","m":"氣息、跡象","m_en":"presence, sign"},{"w":"曖昧","r":"あいまい","m":"曖昧、模糊","m_en":"ambiguous, vague"},{"w":"知恵","r":"ちえ","m":"智慧","m_en":"wisdom"},{"w":"集合住宅","r":"しゅうごうじゅうたく","m":"集合住宅、公寓大樓","m_en":"apartment building"},{"w":"領域","r":"りょういき","m":"領域、範圍","m_en":"territory, domain"},{"w":"作法","r":"さほう","m":"禮節、規矩","m_en":"manners, etiquette"}],"grammar":[{"t":"〜のようなもの","note":"表示「像是…的東西」,用來比喻。例:「気持ちを切り替えるための儀式のようなものだ」把跨過門檻的動作比喻成儀式。","t_en":"〜のようなもの","note_en":"Means \"something like ...\" and is used for comparison. Example: 「気持ちを切り替えるための儀式のようなものだ」 compares stepping over the threshold to a ritual."},{"w":"","t":"〜ことにする","note":"表示把某件事「當作…」,或自己決定做某事。本文是「當作已經分開」的用法。例:「それでも空間を分けたことにする」","t_en":"〜ことにする","note_en":"Here it means treating something as if it were so (it can also mean deciding to do something). Example: 「それでも空間を分けたことにする」 means treating the space as divided."},{"t":"〜わけではない","note":"表示「並不是…」,部分否定,用來否定一個常見的想法或理由。例:「壁が薄いからというわけではない」","t_en":"〜わけではない","note_en":"Means \"it is not that ...\" and partially denies a common assumption or reason. Example: 「壁が薄いからというわけではない」","id":"n3-43"},{"t":"〜ため(原因)","note":"表示原因或理由,比「から」更書面。例:「今も続いているためだと考えられる」","t_en":"〜ため (cause)","note_en":"Expresses a cause or reason in a more formal tone than から. Example: 「今も続いているためだと考えられる」"}]},
{"id":"a-n1-9-n4","variant_of":"a-n1-9","level":"n4","topic":"文化","topic_en":"Culture","title":"住まいの中の距離感","title_zh":"居住空間裡的距離感","title_en":"Distance Felt in the Home","body":"日本の家には、言葉にしない人との距離の取り方がたくさんある。玄関で靴を脱ぐ習慣にも、外と中を分ける線がある。玄関を上がる動作は、気持ちを変える小さな儀式のようなものだ。\nふすまや障子は、音も人の様子も通すのに、部屋を分けてくれる。このあいまいさは、狭い家で人と暮らす知恵だったのだろう。今はマンションが多いが、その感覚は形を変えて残っている。生活の音に気をつけるのは、おたがいの場所に入らないというマナーでもある。\nでも、外国から来た人には、この距離感は分かりにくい。あいさつをするかどうか、どこまで近づくか、決まりがなくて迷う。でも、それは一人一人が自分で決めていいということでもある。住まいは、人との距離を毎日静かに考える場所なのかもしれない。","trans":["日本的家裡,有很多不說出口的與人拿捏距離的方式。光是在玄關脫鞋這個習慣,就有區分外與內的界線。跨上玄關的動作,像是一個轉換心情的小儀式。","紙門和障子雖然能讓聲音和人的動靜穿過,卻仍然把房間分開。這份曖昧,大概就是在狹小的家裡與人共同生活的智慧吧。現在雖然公寓變多了,那種感覺還是換了形式留存下來。注意生活噪音,也是「不進入彼此的領域」這種禮節的表現。","不過,對從外國來的人來說,這種距離感很難理解。要不要打招呼、可以靠近到什麼程度,因為沒有規定而感到迷惘。但這也表示,每個人可以自己決定。住處或許就是每天安靜地思考與人距離的地方。"],"trans_en":["Japanese homes contain many unspoken ways of keeping distance from others. Even the habit of taking off your shoes at the entrance draws a line between outside and inside. Stepping up from the entrance is like a small ritual for changing your state of mind.","Fusuma and shoji let sound and the presence of people pass through, yet they still divide the rooms. This vagueness was probably a piece of wisdom for living with others in small houses. Today there are many apartments, but that feeling remains in a different form. Being careful about everyday noise is also a kind of manners: not entering each other's space.","However, this sense of distance is hard to understand for people from abroad. They are unsure whether to greet neighbors or how close to get, because there are no clear rules. But that also means each person is free to decide for themselves. A home may be a place where we quietly think about distance from others every day."],"vocab":[{"w":"玄関","r":"げんかん","m":"玄關","m_en":"entrance hall"},{"w":"習慣","r":"しゅうかん","m":"習慣","m_en":"habit, custom"},{"w":"靴を脱ぐ","r":"くつをぬぐ","m":"脫鞋","m_en":"to take off shoes"},{"w":"障子","r":"しょうじ","m":"障子(日式紙拉門)","m_en":"shoji, paper sliding door"},{"w":"知恵","r":"ちえ","m":"智慧","m_en":"wisdom"},{"w":"感覚","r":"かんかく","m":"感覺","m_en":"sense, feeling"},{"w":"生活","r":"せいかつ","m":"生活","m_en":"daily life"},{"w":"距離","r":"きょり","m":"距離","m_en":"distance"},{"w":"迷う","r":"まよう","m":"迷惘、猶豫","m_en":"to be unsure, to hesitate"},{"w":"決める","r":"きめる","m":"決定","m_en":"to decide"}],"grammar":[{"t":"〜ようなものだ","note":"表示「像是…一樣」,用比喻說明。例:「気持ちを変える小さな儀式のようなものだ」","t_en":"~ようなものだ","note_en":"Means 'is like ~', used for comparison. Example: 「気持ちを変える小さな儀式のようなものだ」"},{"t":"〜のに","note":"表示「明明…卻…」,前後內容有落差。例:「音も人の様子も通すのに、部屋を分けてくれる」","t_en":"~のに","note_en":"Means 'even though ~', showing contrast. Example: 「音も人の様子も通すのに、部屋を分けてくれる」"},{"t":"〜にくい","note":"接在動詞ます形後,表示「不容易…、難以…」。例:「この距離感は分かりにくい」","t_en":"~にくい","note_en":"Attached to the verb stem, means 'hard to ~'. Example: 「この距離感は分かりにくい」"},{"t":"〜かもしれない","note":"表示「也許…、或許…」,說話者不太確定的推測。例:「場所なのかもしれない」","t_en":"~かもしれない","note_en":"Means 'may be ~', expressing an uncertain guess. Example: 「場所なのかもしれない」"}]},
{"id":"a-n2-1-n3","variant_of":"a-n2-1","level":"n3","topic":"社会","topic_en":"Society","title":"働き方の変化","title_zh":"工作方式的改變","title_en":"Changes in How We Work","body":"近年、インターネットが発達したことによって、人々の働き方は大きく変わってきました。以前は会社に行って働くのが普通でしたが、今はそうではない人も増えています。会社に行かず、家で仕事をする「テレワーク」を取り入れる企業が増えています。\nテレワークなら、通勤にかかる時間が減るというよいところがあります。しかし、仕事と生活の区別がつきにくくなるという問題もあります。また、決まった時間に働くのではなく、自分で時間を調整して働く人も多くなりました。\nこのように、テレワークが広がったことによって、働く場所や時間の自由度は高くなりました。その一方で、仕事と生活の境目があいまいになるという課題も生まれています。こうした変化に合わせて、私たちも新しい働き方を考えていく必要があるでしょう。\nこれからは、それぞれの人に合った働き方を選べる社会が求められています。そのためには、会社も働く人も、お互いの考えを知ろうとすることが大切だと思います。","trans":["近年來,隨著網路的發達,人們的工作方式有了很大的改變。以前去公司上班是理所當然的,但現在不這樣的人也變多了。不去公司、在家工作的「遠距工作」,採用的企業正在增加。","遠距工作有個好處,就是通勤所花的時間會減少。不過,也有工作與生活難以區分的問題。此外,不按固定時間、而是自己調整時間來工作的人也變多了。","像這樣,隨著遠距工作的普及,工作地點與時間的自由度變高了。另一方面,也產生了工作與生活界線變模糊的課題。配合這樣的變化,我們也有必要去思考新的工作方式吧。","今後,社會需要的是能讓每個人選擇適合自己的工作方式的環境。為此,我認為公司和工作的人都試著去了解彼此的想法,是很重要的。"],"trans_en":["In recent years, as the internet has developed, the way people work has changed greatly. It used to be normal to go to a company to work, but now more people do not. More companies are adopting telework, in which people work from home instead of going to the office.","Telework has the advantage of reducing the time spent commuting. However, there is also the problem that it becomes harder to separate work from private life. In addition, more people now work by adjusting their own hours rather than keeping fixed ones.","In this way, the spread of telework has given people more freedom in where and when they work. On the other hand, a new issue has appeared: the boundary between work and life is becoming blurry. In step with these changes, we will probably need to think about new ways of working too.","From now on, society is expected to let each person choose a way of working that suits them. For that, I think it is important for both companies and workers to try to understand each other's views."],"vocab":[{"w":"発達","r":"はったつ","m":"發達、發展","m_en":"development"},{"w":"取り入れる","r":"とりいれる","m":"採用、引進","m_en":"to adopt, to take in"},{"w":"企業","r":"きぎょう","m":"企業、公司","m_en":"company, business"},{"w":"通勤","r":"つうきん","m":"通勤、上下班","m_en":"commuting"},{"w":"区別","r":"くべつ","m":"區別、區分","m_en":"distinction"},{"w":"調整","r":"ちょうせい","m":"調整","m_en":"adjustment"},{"w":"境目","r":"さかいめ","m":"界線、分界","m_en":"boundary, dividing line"},{"w":"課題","r":"かだい","m":"課題、待解決的問題","m_en":"issue, challenge"},{"w":"求められる","r":"もとめられる","m":"被要求、被需要","m_en":"to be demanded, to be called for"}],"grammar":[{"t":"〜ことによって","note":"表示「藉由、因為某事」,說明原因或手段。例:「テレワークが広がったことによって、働く場所や時間の自由度は高くなりました」","t_en":"〜koto ni yotte","note_en":"Means 'because of / through (some change)'. Example: 「テレワークが広がったことによって、働く場所や時間の自由度は高くなりました」"},{"t":"〜一方で","note":"表示「一方面……,另一方面……」,常接相反或不同的面向。例:「その一方で、仕事と生活の境目があいまいになるという課題も生まれています」","t_en":"〜ippou de","note_en":"Means 'on the other hand', introducing a contrasting side. Example: 「その一方で、仕事と生活の境目があいまいになるという課題も生まれています」"},{"t":"〜に合わせて","note":"表示「配合、按照……」。例:「こうした変化に合わせて、私たちも新しい働き方を考えていく必要があるでしょう」","t_en":"〜ni awasete","note_en":"Means 'in line with / to match'. Example: 「こうした変化に合わせて、私たちも新しい働き方を考えていく必要があるでしょう」"},{"t":"〜のではなく","note":"表示「不是……而是……」,否定前者、強調後者。例:「決まった時間に働くのではなく、自分で時間を調整して働く人も多くなりました」","t_en":"〜no de wa naku","note_en":"Means 'not ... but ...', denying the first and stressing the second. Example: 「決まった時間に働くのではなく、自分で時間を調整して働く人も多くなりました」"}]},
{"id":"a-n2-1-n4","variant_of":"a-n2-1","level":"n4","topic":"社会","topic_en":"Society","title":"はたらき方の変化","title_zh":"工作方式的改變","title_en":"Changes in How We Work","body":"インターネットが便利になって、はたらき方が大きく変わりました。\n会社に行かないで、家で仕事をする会社が増えています。電車に乗る時間が少なくなって、とても楽になりました。でも、仕事と生活の区別がむずかしくなる問題もあります。\nまた、自分で時間を決めてはたらく人も多くなりました。\n自由にはたらける反面、休む時間を忘れてしまう人もいるようです。\nこれからは、自分に合ったはたらき方をえらべる社会が大切です。\n私たちも新しいはたらき方を考えていかなければなりません。","trans":["因為網路變方便了,工作方式有了很大的改變。","不去公司、在家工作的公司正在增加。搭電車的時間變少了,變得很輕鬆。但是,也有工作與生活難以區分的問題。","此外,自己決定時間工作的人也變多了。","雖然可以自由工作,但似乎也有人會忘記休息的時間。","今後,能選擇適合自己工作方式的社會很重要。","我們也必須思考新的工作方式。"],"trans_en":["As the internet became more convenient, the way we work has changed a lot.","More companies now let people work from home instead of going to the office. Because people spend less time on trains, life has become much easier. But there is also a problem: it gets hard to separate work from private life.","Also, more people now decide their own working hours.","They can work freely, but it seems some people forget to take time to rest.","From now on, a society where each person can choose a way of working that suits them is important.","We also have to keep thinking about new ways of working."],"vocab":[{"w":"便利","r":"べんり","m":"方便","m_en":"convenient"},{"w":"変わる","r":"かわる","m":"改變","m_en":"to change"},{"w":"増える","r":"ふえる","m":"增加","m_en":"to increase"},{"w":"区別","r":"くべつ","m":"區別、區分","m_en":"distinction"},{"w":"問題","r":"もんだい","m":"問題","m_en":"problem"},{"w":"決める","r":"きめる","m":"決定","m_en":"to decide"},{"w":"自由","r":"じゆう","m":"自由","m_en":"freedom"},{"w":"忘れる","r":"わすれる","m":"忘記","m_en":"to forget"},{"w":"社会","r":"しゃかい","m":"社會","m_en":"society"},{"w":"大切","r":"たいせつ","m":"重要","m_en":"important"}],"grammar":[{"t":"〜て(で)、〜(て形的原因・順序)","note":"用て形連接前後句,表示原因或接續。例:「インターネットが 便利に なって、はたらき方が 大きく 変わりました」","t_en":"~te form (cause/sequence)","note_en":"The te-form links clauses to show cause or sequence. Example: 「インターネットが 便利に なって、はたらき方が 大きく 変わりました」"},{"t":"〜ないで","note":"表示「不做…而做…」。例:「会社に 行かないで、家で 仕事を する」","t_en":"~naide","note_en":"Means 'without doing ~'. Example: 「会社に 行かないで、家で 仕事を する」"},{"t":"可能形(はたらける・えらべる)","note":"表示能夠做某事。例:「自由に はたらける」「自分に 合った はたらき方を えらべる」","t_en":"Potential form","note_en":"Expresses ability or possibility. Example: 「自由に はたらける」「自分に 合った はたらき方を えらべる」","id":"n4-52"},{"t":"〜ようだ","note":"根據情況推測「似乎…」。例:「忘れて しまう 人も いるようです」","t_en":"~you da","note_en":"Expresses an inference from what one observes, 'it seems that ~'. Example: 「忘れて しまう 人も いるようです」"}]},
{"id":"a-n2-10-n3","variant_of":"a-n2-10","level":"n3","topic":"職場","topic_en":"Work","title":"報告・連絡・相談を実際にやってみる","title_zh":"實際做做看報連相","title_en":"Putting Report, Contact and Consult into Practice","body":"「報連相」は日本の職場でよく言われますが、覚えるのは簡単でも実際にやるのは難しいです。特に外国人の社員は、結論が出る前に報告してもいいのか迷うことが多いです。答えを先に言うと、結論が出ていなくても報告して大丈夫です。\n仕事が思うように進んでいないときほど、早めに伝えることが大切です。上司が知りたいのは完璧な報告ではなく、問題が大きくなる前の一言だからです。「今半分ほど進んでいますが、資料待ちで少し遅れそうです」と言うだけで十分です。\n相談するときも、答えを持っていなくてかまいません。相談は、必ず答えをもらうために行くわけではないのです。自分がどこで迷っているのかを説明できれば、それだけで立派な相談になります。\n報連相は上下関係のマナーというより、チームで事故を防ぐための仕組みです。そう考えるようにすれば、気持ちがずいぶん楽になるでしょう。","trans":["「報連相」在日本職場常被提起,記起來很簡單,但真的要做卻很難。特別是外國員工,常會猶豫在結論出來之前可不可以先報告。先說答案:就算結論還沒出來,也可以報告。","工作進展不如預期的時候,越要早點告知,這一點很重要。因為上司想知道的不是完美的報告,而是問題變大之前的一句話。只要說「現在大概進行到一半,但在等資料,可能會稍微延遲」就夠了。","商量的時候,沒有答案也沒關係。商量並不一定是為了得到答案才去的。只要能說明自己卡在哪裡,光是這樣就是一次很好的商量。","與其說報連相是上下關係的禮儀,不如說它是團隊為了防止事故的機制。如果這樣想,心情會輕鬆許多。"],"trans_en":["\"Hou-ren-sou\" is often talked about in Japanese workplaces. It is easy to memorize, but hard to actually practice. Foreign employees in particular often wonder whether it is okay to report before a conclusion has been reached. To give the answer first: yes, you can report even if you have no conclusion yet.","The more your work is not going as planned, the more important it is to tell people early. This is because what your boss wants to know is not a perfect report, but a word before the problem gets bigger. Simply saying \"I'm about halfway done, but I'm waiting for materials, so it may be a little late\" is enough.","When you consult someone, it is fine not to have an answer. Consulting does not necessarily mean going to get an answer. If you can explain where you are stuck, that alone makes a good consultation.","Hou-ren-sou is less a matter of manners between superiors and subordinates than a system for preventing accidents as a team. If you think of it that way, it will feel much lighter."],"vocab":[{"w":"職場","r":"しょくば","m":"職場、工作場所","m_en":"workplace"},{"w":"実際に","r":"じっさいに","m":"實際上","m_en":"actually, in practice"},{"w":"結論","r":"けつろん","m":"結論","m_en":"conclusion"},{"w":"報告","r":"ほうこく","m":"報告","m_en":"report"},{"w":"早め","r":"はやめ","m":"提早、早一點","m_en":"earlier than usual, early"},{"w":"上司","r":"じょうし","m":"上司","m_en":"boss, superior"},{"w":"完璧","r":"かんぺき","m":"完美","m_en":"perfect"},{"w":"資料","r":"しりょう","m":"資料","m_en":"materials, documents"},{"w":"事故","r":"じこ","m":"事故","m_en":"accident"},{"w":"仕組み","r":"しくみ","m":"機制、結構","m_en":"system, mechanism"}],"grammar":[{"t":"〜ように(様態・目標)","note":"表示「依照～的樣子」。例:「仕事が思うように進んでいないときほど」「そう考えるようにすれば」。","t_en":"〜ように","note_en":"Means 'as one wants' or 'so that'. e.g. 「仕事が思うように進んでいないときほど」 and 「そう考えるようにすれば」.","id":"n3-54"},{"t":"〜わけではない","note":"表示「並不是～」,部分否定。例:「相談は、必ず答えをもらうために行くわけではないのです」。","t_en":"〜わけではない","note_en":"Means 'it does not necessarily mean that…'. e.g. 「相談は、必ず答えをもらうために行くわけではないのです」.","id":"n3-43"},{"t":"〜というより","note":"表示「與其說是～不如說是…」。例:「上下関係のマナーというより、チームで事故を防ぐための仕組みです」。","t_en":"〜というより","note_en":"Means 'rather than saying…, it is…'. e.g. 「上下関係のマナーというより、チームで事故を防ぐための仕組みです」."},{"t":"〜ほど","note":"表示「越是～越…」,程度隨條件變化。例:「進んでいないときほど、早めに伝えることが大切です」。","t_en":"〜ほど","note_en":"Means 'the more…, the more…'. e.g. 「仕事が思うように進んでいないときほど、早めに伝えることが大切です」.","id":"n3-31"}]},
{"id":"a-n2-10-n4","variant_of":"a-n2-10","level":"n4","topic":"職場","topic_en":"Work","title":"報告・連絡・相談をやってみよう","title_zh":"試著做好報連相","title_en":"Let's Try Hou-Ren-Sou","body":"日本の会社では「報・連・相」という言葉をよく使います。覚えるのは簡単ですが、実際にやるのは難しいです。外国人の社員は「まだ答えが出ていないときも、話していいのか」と迷いやすいです。\nでも、答えが出ていなくても大丈夫です。仕事が思ったように進んでいないときは、早く伝えたほうがいいです。上司が知りたいのは、完璧な報告ではありません。問題が大きくなる前の一言です。\nたとえば「この仕事は、今半分ぐらいできています。でも資料を待っているので、少し遅れそうです」と言えば十分です。相談のときも、答えがなくても行っていいです。どこで困っているかを話せれば、それが相談になります。報・連・相は、チームで失敗を防ぐための方法だと考えると、気持ちが楽になります。","trans":["在日本的公司,大家常說「報・連・相」這個詞。要記住很簡單,但實際做起來很難。外國員工常會猶豫:「還沒有答案的時候,也可以說嗎?」","不過,沒有答案也沒關係。工作進行得不如預期時,早一點告訴對方比較好。上司想知道的不是完美的報告,而是問題變大之前的一句話。","例如只要說「這份工作現在做到一半左右。但是在等資料,可能會稍微延遲」就夠了。商量的時候,沒有答案也可以去。只要能說出自己卡在哪裡,那就是一次商量。如果把報連相想成是團隊用來防止失敗的方法,心情就會輕鬆一些。"],"trans_en":["In Japanese companies, people often use the word \"Hou-Ren-Sou.\" It is easy to remember, but hard to actually do. Foreign employees often wonder, \"Is it okay to speak up even when I don't have an answer yet?\"","But it is fine even without an answer. When work is not going as expected, it is better to tell someone early. What your boss wants to know is not a perfect report. It is a short word before the problem gets big.","For example, it is enough to say, \"I have finished about half of this work. But I am waiting for materials, so it may be a little late.\" When you ask for advice, it is also okay to go without an answer. If you can say where you are having trouble, that becomes a consultation. If you think of Hou-Ren-Sou as a way for the team to prevent mistakes, you will feel more relaxed."],"vocab":[{"w":"会社","r":"かいしゃ","m":"公司","m_en":"company"},{"w":"社員","r":"しゃいん","m":"員工","m_en":"employee"},{"w":"迷う","r":"まよう","m":"猶豫、迷惑","m_en":"to hesitate, to be lost"},{"w":"答え","r":"こたえ","m":"答案","m_en":"answer"},{"w":"伝える","r":"つたえる","m":"傳達、告訴","m_en":"to tell, to convey"},{"w":"上司","r":"じょうし","m":"上司","m_en":"boss, superior"},{"w":"問題","r":"もんだい","m":"問題","m_en":"problem"},{"w":"資料","r":"しりょう","m":"資料","m_en":"materials, documents"},{"w":"遅れる","r":"おくれる","m":"延遲、遲到","m_en":"to be late, to be delayed"},{"w":"困る","r":"こまる","m":"困擾、為難","m_en":"to be in trouble"}],"grammar":[{"t":"〜ても大丈夫です","note":"表示「即使~也沒關係」。例:「答えが出ていなくても大丈夫です」","t_en":"~te mo daijoubu desu","note_en":"Means \"it is fine even if ~\". Example: 「答えが出ていなくても大丈夫です」"},{"t":"〜たほうがいい","note":"表示「最好~」,用來給建議。例:「早く伝えたほうがいいです」","t_en":"~ta hou ga ii","note_en":"Means \"it is better to ~\", used for advice. Example: 「早く伝えたほうがいいです」"},{"t":"〜そうだ(樣態)","note":"表示根據現況推測「看起來會~」。例:「少し遅れそうです」","t_en":"~sou da (appearance)","note_en":"Means \"it looks like ~\", a guess from the situation. Example: 「少し遅れそうです」"},{"t":"〜と考えると","note":"表示「如果想成~的話」,後面接結果。例:「防ぐための方法だと考えると、気持ちが楽になります」","t_en":"~to kangaeru to","note_en":"Means \"if you think of it as ~\", followed by a result. Example: 「防ぐための方法だと考えると、気持ちが楽になります」"}]},
{"id":"a-n2-2-n3","variant_of":"a-n2-2","level":"n3","topic":"文化","topic_en":"Culture","title":"「空気を読む」ということ","title_zh":"所謂的「察言觀色」","title_en":"What It Means to Read the Air","body":"日本語には「空気を読む」という言い方があり、よく使われている。これは、その場の雰囲気や相手の気持ちを考えて、言われなくてもちょうどよく行動することだ。たとえば、会議でみんなが賛成しているとき、一人だけ反対するのは勇気がいる。そのため、多くの人は空気を読んで、あえて何も言わないことにする。\nこの考え方は、人がぶつからないように、みんなの調和を守るために役に立ってきた。しかし、その一方で、本当に必要な意見が言えなくなることもある。また、少数の人の声が消えてしまうという問題もある。\n空気を読む力は、たしかに日本社会の特徴の一つだと言えるだろう。ただ、ときには空気を読まずに、自分の意見を言う勇気も大切にされるべきではないだろうか。\n空気を読むことは、相手を思いやるやさしさになる場合もある。けれども、行きすぎると、自分の意見が言えなくなってしまう。大切なのは、まわりに合わせることと自分の考えを伝えることのバランスだろう。","trans":["日文裡有「讀空氣」這個說法,常被使用。這指的是考慮當下的氣氛與對方的心情,即使沒被明說,也能恰到好處地行動。例如在會議上大家都贊成時,只有一個人表示反對是需要勇氣的。因此,多數人會讀空氣,刻意選擇什麼都不說。","這種想法一直以來,對於避免人與人起衝突、維護大家的和諧很有幫助。但另一方面,也有真正需要的意見說不出口的情況。此外,還有少數人的聲音被消除的問題。","讀空氣的能力,的確可以說是日本社會的特徵之一。不過,有時不讀空氣、說出自己意見的勇氣,不也應該被重視嗎?","讀空氣有時也是體貼對方的溫柔。但是,如果過了頭,就會變得說不出自己的意見。重要的是,在配合周遭與表達自己想法之間取得平衡吧。"],"trans_en":["Japanese has an expression, \"reading the air,\" that is used often. It means thinking about the mood of the situation and the other person's feelings, and acting appropriately even when nothing is said. For example, when everyone in a meeting agrees, it takes courage for just one person to object. For that reason, many people read the air and choose not to say anything.","This way of thinking has helped people avoid clashing and keep the group in harmony. On the other hand, there are times when truly necessary opinions cannot be voiced. There is also the problem that the voices of a few people disappear.","The ability to read the air is certainly one of the features of Japanese society. However, shouldn't the courage to speak up without reading the air also be valued at times?","Reading the air can sometimes be a kindness that shows consideration for others. But if it goes too far, you end up unable to say your own opinions. What matters is the balance between fitting in with those around you and communicating your own thoughts."],"vocab":[{"w":"雰囲気","r":"ふんいき","m":"氣氛","m_en":"atmosphere, mood"},{"w":"賛成","r":"さんせい","m":"贊成","m_en":"agreement, approval"},{"w":"反対","r":"はんたい","m":"反對","m_en":"opposition"},{"w":"勇気","r":"ゆうき","m":"勇氣","m_en":"courage"},{"w":"あえて","r":"あえて","m":"刻意、特地","m_en":"deliberately, daring to"},{"w":"調和","r":"ちょうわ","m":"和諧","m_en":"harmony"},{"w":"役に立つ","r":"やくにたつ","m":"有幫助、有用","m_en":"to be useful"},{"w":"少数","r":"しょうすう","m":"少數","m_en":"minority, a small number"},{"w":"特徴","r":"とくちょう","m":"特徵","m_en":"characteristic, feature"},{"w":"思いやる","r":"おもいやる","m":"體貼、替人著想","m_en":"to show consideration for"}],"grammar":[{"t":"〜ことにする","note":"表示自己決定做某事。文中例句:「あえて何も言わないことにする」,表示刻意選擇不說話。","t_en":"~koto ni suru","note_en":"Expresses a decision to do something. Example: 「あえて何も言わないことにする」 means choosing not to say anything."},{"t":"〜ないように","note":"表示為了不發生某種狀況。文中例句:「人がぶつからないように」,意思是避免人與人起衝突。","t_en":"~nai you ni","note_en":"Means so that something does not happen. Example: 「人がぶつからないように」 means so that people do not clash."},{"t":"〜ために","note":"表示目的,意思是「為了~」。文中例句:「みんなの調和を守るために役に立ってきた」。","t_en":"~tame ni","note_en":"Expresses purpose, meaning in order to. Example: 「みんなの調和を守るために役に立ってきた」 means it has been useful for keeping harmony.","id":"n3-53"},{"t":"〜てしまう","note":"表示不希望發生的結果或事情完成。文中例句:「自分の意見が言えなくなってしまう」,帶有遺憾的語氣。","t_en":"~te shimau","note_en":"Expresses an unwanted result or a completed action. Example: 「自分の意見が言えなくなってしまう」 carries a tone of regret."}]},
{"id":"a-n2-2-n4","variant_of":"a-n2-2","level":"n4","topic":"文化","topic_en":"Culture","title":"「空気を読む」ってなに?","title_zh":"「察言觀色」是什麼?","title_en":"What Does \"Reading the Air\" Mean?","body":"日本語には「空気を読む」という言い方があります。その場の様子や相手の気持ちを考えて、行動することです。はっきり言われなくても、何をしたらいいか分かるということです。\nたとえば、会議でみんなが賛成しているとします。そのとき、一人だけ反対だと言うのは、勇気がいります。だから、多くの人は「空気を読んで」何も言いません。この気持ちは、人とけんかしないために役に立ってきました。\nでも、本当に必要な意見が言えなくなることもあります。少ない人の声が聞こえなくなることもあります。時には、空気を読まないで話す勇気も大切だと思います。大切なのは、まわりに合わせることと、自分の考えを話すことのバランスです。","trans":["日文裡有「讀空氣」這個說法。意思是考慮當下的情況和對方的心情,然後採取行動。即使對方沒有明說,也知道該怎麼做。","例如,假設在會議上大家都贊成。這時候,只有一個人說反對,是需要勇氣的。所以,很多人會「讀空氣」,什麼都不說。這種心情,一直以來對於避免與人起衝突很有幫助。","但是,也會有真正必要的意見說不出口的情況。也會有少數人的聲音聽不見的情況。我覺得有時候,不讀空氣、勇敢說話的勇氣也很重要。重要的是,在配合周遭與說出自己的想法之間取得平衡。"],"trans_en":["In Japanese, there is an expression \"reading the air.\" It means thinking about the situation and the other person's feelings, and then acting accordingly. Even if no one tells you clearly, you understand what you should do.","For example, suppose everyone in a meeting agrees. In that moment, it takes courage for just one person to say they are against it. So many people \"read the air\" and say nothing. This feeling has been useful for avoiding fights between people.","But sometimes opinions that are really needed cannot be said. Sometimes the voices of a few people cannot be heard. I think that sometimes the courage to speak without reading the air is also important. What matters is the balance between going along with others and saying your own thoughts."],"vocab":[{"w":"空気","r":"くうき","m":"空氣;氣氛","m_en":"air; atmosphere"},{"w":"気持ち","r":"きもち","m":"心情、感受","m_en":"feeling"},{"w":"会議","r":"かいぎ","m":"會議","m_en":"meeting"},{"w":"賛成","r":"さんせい","m":"贊成","m_en":"agreement; approval"},{"w":"反対","r":"はんたい","m":"反對","m_en":"opposition"},{"w":"勇気","r":"ゆうき","m":"勇氣","m_en":"courage"},{"w":"意見","r":"いけん","m":"意見","m_en":"opinion"},{"w":"大切","r":"たいせつ","m":"重要、珍貴","m_en":"important"},{"w":"合わせる","r":"あわせる","m":"配合、使一致","m_en":"to match; to go along with"}],"grammar":[{"t":"〜なくても","note":"表示「即使不……也」。例:「はっきり言われなくても、何をしたらいいか分かる」就是即使沒被清楚說出來也懂。","t_en":"~nakute mo","note_en":"Means \"even if not ~.\" Example: 「言われなくても」 means even if it is not said."},{"w":"〜たらいい","t":"〜たらいいか","note":"用「動詞た形+ら」問「該怎麼做才好」。例:「何をしたらいいか分かる」。","t_en":"~tara ii ka","note_en":"Used to say what one should do. Example: 「何をしたらいいか」 means what one should do."},{"t":"〜ために","note":"表示目的,「為了……」。例:「人とけんかしないために役に立ってきました」。","t_en":"~tame ni","note_en":"Shows purpose, \"in order to ~.\" Example: 「けんかしないために」 means in order not to fight.","id":"n3-53"},{"t":"可能形(言えなくなる)","note":"動詞可能形+なくなる,表示變得不能做。例:「必要な意見が言えなくなる」。","t_en":"Potential form + naku naru","note_en":"Means becoming unable to do something. Example: 「言えなくなる」 means become unable to say.","id":"n4-52"}]},
{"id":"a-n2-3-n3","variant_of":"a-n2-3","level":"n3","topic":"職場","topic_en":"Workplace","title":"報告・連絡・相談","title_zh":"報告・聯絡・商量","title_en":"Report, Inform, Consult","body":"日本の会社に入ると、最初に「報連相」の大切さを教えられることが多い。これは「報告」「連絡」「相談」の最初の文字をとった言葉である。日本の仕事の仕方を知るうえで、とても大事な考え方だと言われている。\n仕事がどのくらい進んでいるかを上司に「報告」することが、まず大切である。関係のある人には必要な情報を「連絡」し、どうするか迷ったときは早めに「相談」する。これができるかどうかによって、仕事の結果は大きく変わってくる。\n問題を一人で抱えて報告が遅れると、小さなミスが大きなトラブルになることもある。反対に、こまめに情報を共有していれば、まわりの人が早く助けることができる。報連相がうまくいかない職場では、小さなミスが大きな問題になりやすいのである。\n報連相は、ただのルールというわけではない。チームで働くときに、おたがいを信頼するために必要な基本のコミュニケーションなのだ。こまめな情報の共有は、チーム全体の信頼と効率を高めてくれるだろう。","trans":["進入日本的公司後,最初常會被教導「報連相」的重要性。這是取「報告」「聯絡」「商量」三個詞開頭的字所組成的詞。據說在了解日本工作方式時,這是非常重要的觀念。","首先,把工作進行到什麼程度向上司「報告」很重要。對相關的人要把必要的資訊「聯絡」給他們,不知道該怎麼辦時則要早點「商量」。能不能做到這些,會讓工作的結果有很大的不同。","如果一個人扛著問題、報告又拖延,小失誤也可能變成大麻煩。相反地,如果勤於分享資訊,周圍的人就能及早幫忙。在報連相做不好的職場,小失誤很容易變成大問題。","報連相並不只是規則而已。在團隊工作時,它是為了彼此信賴所需要的基本溝通。勤於分享資訊,應該能提升整個團隊的信任與效率。"],"trans_en":["When you join a Japanese company, you are often taught the importance of \"horenso\" first. It is a word made from the first characters of report, contact, and consult. It is said to be a very important idea for understanding how work is done in Japan.","First, it is important to report to your boss how far your work has progressed. You inform the people involved of the necessary information, and when you are unsure what to do, you consult early. Depending on whether you can do these things, the results of your work change greatly.","If you hold a problem by yourself and your report is delayed, a small mistake can become a big trouble. On the other hand, if you share information often, the people around you can help quickly. In workplaces where horenso does not go well, small mistakes easily turn into big problems.","Horenso is not just a rule. When working in a team, it is the basic communication needed to trust one another. Sharing information often will probably raise the trust and efficiency of the whole team."],"vocab":[{"w":"上司","r":"じょうし","m":"上司、主管","m_en":"boss, superior"},{"w":"報告","r":"ほうこく","m":"報告","m_en":"report"},{"w":"連絡","r":"れんらく","m":"聯絡、通知","m_en":"contact, notify"},{"w":"相談","r":"そうだん","m":"商量","m_en":"consultation, to consult"},{"w":"迷う","r":"まよう","m":"猶豫、迷惑","m_en":"to be unsure, to hesitate"},{"w":"抱える","r":"かかえる","m":"扛著、獨自承擔","m_en":"to hold, to carry (a problem)"},{"w":"共有","r":"きょうゆう","m":"共享、分享","m_en":"sharing"},{"w":"職場","r":"しょくば","m":"職場","m_en":"workplace"},{"w":"信頼","r":"しんらい","m":"信賴","m_en":"trust"},{"w":"効率","r":"こうりつ","m":"效率","m_en":"efficiency"}],"grammar":[{"t":"〜によって","note":"表示「依據、取決於」。例:「これができるかどうかによって」,意思是結果會依能否做到而不同。","t_en":"〜によって","note_en":"Means \"depending on\". Example: 「これができるかどうかによって」 means the result differs depending on whether you can do this."},{"t":"〜わけではない","note":"表示「並不是……」,部分否定或否定誤解。例:「ただのルールというわけではない」。","t_en":"〜わけではない","note_en":"Means \"it is not that...\". It denies a assumption. Example: 「ただのルールというわけではない」.","id":"n3-43"},{"t":"〜ことがある/〜こともある","note":"表示「有時會……、也可能……」。例:「大きなトラブルになることもある」。","t_en":"〜ことがある / 〜こともある","note_en":"Means \"sometimes...\" or \"it can happen that...\". Example: 「大きなトラブルになることもある」."},{"t":"〜てくれる","note":"表示對方的行為帶給自己或相關人好處。例:「信頼と効率を高めてくれるだろう」。","t_en":"〜てくれる","note_en":"Shows that someone or something does an action that benefits us. Example: 「信頼と効率を高めてくれるだろう」."}]},
{"id":"a-n2-3-n4","variant_of":"a-n2-3","level":"n4","topic":"職場","topic_en":"Workplace","title":"報告・連絡・相談","title_zh":"報告・聯絡・商量","title_en":"Report, Inform, Consult","body":"日本の会社に入ると、最初に「報連相」の大切さを教えてもらいます。これは「報告」「連絡」「相談」の最初の字をとった言葉です。\n仕事の様子を上司に話すのが「報告」です。必要なことを関係がある人に知らせるのが「連絡」です。どうしたらいいかわからない時、早く聞くのが「相談」です。これができるかどうかで、仕事の結果が大きく変わります。\n一人で悩んで報告が遅れると、小さなミスが大きな問題になりやすいです。反対に、よく情報を共有すれば、まわりの人が早く助けられます。報連相は、ただのルールではありません。チームで働く時、おたがいを信じるための大切なコミュニケーションです。","trans":["進入日本的公司,最先會有人教你「報連相」有多重要。這是取「報告」「聯絡」「商量」三個詞開頭的字所組成的詞。","把工作的狀況告訴上司,就是「報告」。把必要的事通知相關的人,就是「聯絡」。不知道該怎麼辦的時候,及早去問人,就是「商量」。能不能做到這些,工作的結果會差很多。","如果一個人煩惱、報告又遲了,小失誤就容易變成大問題。相反地,如果常常分享資訊,周圍的人就能及早幫忙。報連相不只是規則。在團隊工作時,它是為了彼此信任而很重要的溝通。"],"trans_en":["When you join a Japanese company, you are first taught how important \"hou-ren-sou\" is. It is a word made from the first characters of \"report,\" \"inform,\" and \"consult.\"","Telling your boss how your work is going is \"reporting.\" Letting the people involved know what they need is \"informing.\" Asking early when you don't know what to do is \"consulting.\" Whether you can do these things changes your work results a lot.","If you worry alone and your report is late, a small mistake can easily become a big problem. On the other hand, if you share information often, the people around you can help quickly. Hou-ren-sou is not just a rule. When working in a team, it is important communication for trusting each other."],"vocab":[{"w":"大切","r":"たいせつ","m":"重要、珍貴","m_en":"important"},{"w":"報告","r":"ほうこく","m":"報告","m_en":"report"},{"w":"連絡","r":"れんらく","m":"聯絡、通知","m_en":"contact, inform"},{"w":"相談","r":"そうだん","m":"商量","m_en":"consultation"},{"w":"上司","r":"じょうし","m":"上司","m_en":"boss, superior"},{"w":"関係","r":"かんけい","m":"關係、相關","m_en":"relation, connection"},{"w":"遅れる","r":"おくれる","m":"遲到、延遲","m_en":"to be late"},{"w":"情報","r":"じょうほう","m":"資訊","m_en":"information"},{"w":"共有","r":"きょうゆう","m":"共享、分享","m_en":"to share"},{"w":"信じる","r":"しんじる","m":"相信、信任","m_en":"to trust, believe"}],"grammar":[{"t":"〜と(條件)","note":"表示「一……就會……」,說明自然的結果或習慣。例:「日本の会社に入ると、最初に「報連相」の大切さを教えてもらいます」、「報告が遅れると、小さなミスが大きな問題になりやすいです」。","t_en":"〜と (conditional)","note_en":"Means 'when/if ... then ...', showing a natural result. Example: 「報告が遅れると、小さなミスが大きな問題になりやすいです」."},{"t":"〜かどうか","note":"表示「是否……」,把問句放進句子裡。例:「これができるかどうかで、仕事の結果が大きく変わります」。","t_en":"〜かどうか","note_en":"Means 'whether or not ...', embedding a yes/no question. Example: 「これができるかどうかで、仕事の結果が大きく変わります」."},{"t":"〜やすい","note":"接在動詞ます形後,表示「容易……」。例:「小さなミスが大きな問題になりやすいです」。","t_en":"〜やすい","note_en":"Attached to the verb stem, means 'easy to ...' or 'tends to ...'. Example: 「大きな問題になりやすいです」."},{"t":"〜ば(條件)/〜ための","note":"「〜ば」表示「如果……就……」,「〜ための」表示「為了……的」。例:「よく情報を共有すれば、まわりの人が早く助けられます」、「おたがいを信じるための大切なコミュニケーションです」。","t_en":"〜ば / 〜ための","note_en":"〜ば means 'if ...'; 〜ための means 'for the purpose of ...'. Examples: 「よく情報を共有すれば」, 「おたがいを信じるための大切なコミュニケーション」."}]},
{"id":"a-n2-4-n3","variant_of":"a-n2-4","level":"n3","topic":"旅遊","topic_en":"Travel","title":"観光公害を考える","title_zh":"思考觀光公害","title_en":"Thinking About Overtourism","body":"近年、人気のある観光地には、国内だけでなく外国からも多くの旅行者が集まっている。観光は地域に大きな利益をもたらすが、「観光公害」と呼ばれる問題も生まれている。\nたとえば、道が観光客でいっぱいになり、住民が通れなくなることがある。また、ゴミが増えたり、マナーを守らない人が増えたりする問題も起きている。そのため、静かに暮らしていた人々が、落ち着いて生活できなくなってしまった。\nこうした問題に対して、入場できる人数を決めたり、観光税を取り入れたりする地域も出てきた。しかし、ルールを厳しくしすぎると、観光そのものの魅力がなくなってしまうおそれもある。問題を解決することと観光を楽しめる場所であり続けることを、両方考えなければならない。\n大切なのは、訪れる人が地元の人々への敬意を忘れないことではないだろうか。その土地の文化やルールを大切にすれば、観光は旅行者にも住民にも豊かなものになるはずだ。訪れる人と住む人の両方が気持ちよく過ごせるしくみづくりが、今求められている。","trans":["近年來,人氣觀光地不只有國內旅客,也聚集了許多來自國外的旅客。觀光為地方帶來巨大的利益,但也產生了被稱為「觀光公害」的問題。","例如,道路擠滿觀光客,居民有時會無法通行。另外,垃圾增加、不遵守禮儀的人變多等問題也陸續發生。因此,原本安靜生活的人們,變得無法安穩地過日子了。","針對這些問題,也出現了規定可入場人數、導入觀光稅的地區。不過,如果把規則訂得太嚴,觀光本身的魅力也有可能消失。我們必須同時思考解決問題,以及讓這裡持續成為能享受觀光的地方。","重要的是,前來的人別忘了對當地居民的敬意,不是嗎?只要重視那片土地的文化與規則,觀光應該就會對旅客和居民雙方都成為豐富的事物。打造一個讓來訪者與居住者雙方都能自在度過的機制,正是現在所需要的。"],"trans_en":["In recent years, popular tourist spots have drawn many travelers, not only from within the country but also from abroad. Tourism brings great benefits to a region, but it has also given rise to a problem called \"overtourism.\"","For example, roads can get so crowded with tourists that residents cannot get through. Problems such as increasing trash and more people ignoring good manners are also occurring. As a result, people who used to live quietly can no longer live in peace.","In response to these problems, some regions have begun setting limits on the number of visitors or introducing tourism taxes. However, if the rules become too strict, there is a risk that the appeal of tourism itself will be lost. We need to think about both solving the problems and keeping these places enjoyable to visit.","What matters is that visitors do not forget their respect for the local people. If they value the culture and rules of the place, tourism should become something rich for both travelers and residents. What is needed now is a system that lets both visitors and residents feel comfortable."],"vocab":[{"w":"観光公害","r":"かんこうこうがい","m":"觀光公害(過度觀光)","m_en":"overtourism"},{"w":"利益","r":"りえき","m":"利益","m_en":"profit, benefit"},{"w":"地域","r":"ちいき","m":"地區、地方","m_en":"region, area"},{"w":"住民","r":"じゅうみん","m":"居民","m_en":"resident"},{"w":"入場","r":"にゅうじょう","m":"入場","m_en":"admission, entering"},{"w":"魅力","r":"みりょく","m":"魅力","m_en":"charm, appeal"},{"w":"厳しい","r":"きびしい","m":"嚴格的","m_en":"strict"},{"w":"解決","r":"かいけつ","m":"解決","m_en":"solution, to solve"},{"w":"敬意","r":"けいい","m":"敬意","m_en":"respect"},{"w":"訪れる","r":"おとずれる","m":"造訪、前往","m_en":"to visit"}],"grammar":[{"t":"〜だけでなく〜も","note":"表示「不只…,連…也」。例:「国内だけでなく外国からも多くの旅行者が集まっている」。","t_en":"not only ~ but also ~","note_en":"Means 'not only A but also B.' Example: 「国内だけでなく外国からも多くの旅行者が集まっている」."},{"t":"〜たり〜たりする","note":"列舉幾個動作或狀況,表示其中的例子。例:「ゴミが増えたり、マナーを守らない人が増えたりする」。","t_en":"~tari ~tari suru","note_en":"Lists examples of actions or situations. Example: 「ゴミが増えたり、マナーを守らない人が増えたりする」."},{"t":"〜おそれがある","note":"表示有發生不好結果的可能性。例:「魅力がなくなってしまうおそれもある」。","t_en":"there is a risk that ~","note_en":"Expresses the possibility of something bad happening. Example: 「魅力がなくなってしまうおそれもある」."},{"t":"〜はずだ","note":"表示說話者根據道理而做出的推測,「應該會…」。例:「豊かなものになるはずだ」。","t_en":"should ~, is expected to ~","note_en":"Expresses a reasoned expectation. Example: 「豊かなものになるはずだ」.","id":"n3-45"}]},
{"id":"a-n2-4-n4","variant_of":"a-n2-4","level":"n4","topic":"旅遊","topic_en":"Travel","title":"観光公害を考える","title_zh":"思考觀光公害","title_en":"Thinking About Tourism Pollution","body":"人気のある観光地には、国内外から多くの旅行者が来ています。地域にお金が入りますが、「観光公害」という問題も出ています。\nたとえば、道が観光客でいっぱいになって、住民が通れなくなります。ゴミが増えたり、マナーを守らない人が増えたりします。静かに住んでいた人たちの生活が、悪くなってしまいます。\nそこで、入る人の数を決めたり、観光税を作ったりする地域もあります。でも、ルールを厳しくしすぎると、観光の魅力がなくなるかもしれません。大切なのは、旅行者が地元の人への気持ちを忘れないことです。その土地の文化やルールを大切にすれば、みんなが気持ちよく過ごせます。","trans":["受歡迎的觀光地有許多國內外的旅客前來。地方雖然能賺到錢,卻也出現了叫做「觀光公害」的問題。","例如,道路被觀光客擠滿,居民無法通行。垃圾增加,不守禮儀的人也變多。原本安靜生活的人們,生活因此變差了。","因此,也有地區限制入場人數、設立觀光稅。但是,規定如果訂得太嚴,觀光的魅力可能會消失。重要的是,旅客不要忘記對當地人的心意。只要重視那片土地的文化與規則,大家就能自在地度過。"],"trans_en":["Popular tourist spots receive many visitors from Japan and abroad. The area earns money, but a problem called \"tourism pollution\" also appears.","For example, the roads get full of tourists, and residents can no longer pass through. Garbage increases, and so do people who do not follow manners. The lives of people who used to live quietly get worse.","So some areas limit the number of people who can enter or create a tourism tax. But if the rules become too strict, the appeal of sightseeing may disappear. What matters is that travelers do not forget their respect for local people. If everyone values the local culture and rules, everyone can spend time comfortably."],"vocab":[{"w":"観光地","r":"かんこうち","m":"觀光地","m_en":"tourist spot"},{"w":"旅行者","r":"りょこうしゃ","m":"旅客","m_en":"traveler"},{"w":"地域","r":"ちいき","m":"地區、地方","m_en":"area, region"},{"w":"問題","r":"もんだい","m":"問題","m_en":"problem"},{"w":"住民","r":"じゅうみん","m":"居民","m_en":"resident"},{"w":"守る","r":"まもる","m":"遵守、保護","m_en":"to follow, to protect"},{"w":"生活","r":"せいかつ","m":"生活","m_en":"daily life"},{"w":"厳しい","r":"きびしい","m":"嚴格的","m_en":"strict"},{"w":"大切","r":"たいせつ","m":"重要、珍惜","m_en":"important, to value"},{"w":"忘れる","r":"わすれる","m":"忘記","m_en":"to forget"}],"grammar":[{"t":"〜たり〜たりする","note":"列舉幾個動作或狀況。例:「ゴミが増えたり、マナーを守らない人が増えたりします」","t_en":"~tari ~tari suru","note_en":"Lists several example actions or situations. Example: 「ゴミが増えたり、マナーを守らない人が増えたりします」"},{"t":"〜なくなる(可能形+ない+なる)","note":"可能形的否定加「なる」,表示變得不能做某事。例:「住民が通れなくなります」","t_en":"potential form + naku naru","note_en":"Negative potential plus naru means it becomes impossible to do something. Example: 「住民が通れなくなります」"},{"t":"〜すぎる","note":"動詞ます形去ます+すぎる,表示做得過頭。例:「ルールを厳しくしすぎると」","t_en":"~sugiru","note_en":"Verb stem plus sugiru means doing something too much. Example: 「ルールを厳しくしすぎると」"},{"t":"〜かもしれない","note":"表示有可能,但不確定。例:「観光の魅力がなくなるかもしれません」","t_en":"~kamo shirenai","note_en":"Expresses possibility, not certainty. Example: 「観光の魅力がなくなるかもしれません」"}]},
{"id":"a-n2-6-n3","variant_of":"a-n2-6","level":"n3","topic":"健康","topic_en":"Health","title":"眠りを大切に","title_zh":"重視睡眠","title_en":"Take Your Sleep Seriously","body":"忙しい毎日を送っていると、ついいちばん先に睡眠の時間を削ってしまいがちです。しかし、質のよい睡眠は、健康な生活を送るためになくてはならないものです。\n睡眠が足りないと、集中力が落ちたり、体の調子が悪くなったりすることがあります。昼間の眠気のせいで、仕事や勉強がうまくいかない人も少なくないでしょう。\nぐっすり眠るためには、まず生活のリズムを整えることが大切です。毎日同じ時間に寝て、同じ時間に起きるように心がけましょう。また、寝る前にスマートフォンを見るのは、できるだけやめたほうがいいです。画面の明るい光によって、脳が目を覚ましてしまうからです。\nたった数時間の違いでも、毎日続ければ大きな差になります。まずは少し早めに布団に入ることから始めてみませんか。","trans":["過著忙碌的每一天時,總是不知不覺就最先把睡眠時間犧牲掉。然而,優質的睡眠是過健康生活不可或缺的東西。","睡眠不足的話,可能會導致注意力下降、身體狀況變差。因為白天的睡意而讓工作或讀書不順利的人,想必也不少吧。","為了睡得熟,首先調整生活的節奏很重要。請留意每天在同一時間睡覺、同一時間起床。另外,睡前最好盡量不要看智慧型手機。因為螢幕明亮的光線會讓大腦清醒過來。","即使只是短短幾小時的差別,每天持續下去就會變成很大的差距。要不要先從稍微早一點上床開始試試看呢?"],"trans_en":["When you live busy days, you tend to cut back on sleep first without even realizing it. However, good-quality sleep is something essential for living a healthy life.","If you don't get enough sleep, your concentration may drop and you may feel unwell. There are probably quite a few people whose work or studies don't go well because of daytime sleepiness.","To sleep soundly, it is important first to set a regular daily rhythm. Try to go to bed at the same time and wake up at the same time every day. Also, it is better to avoid looking at your smartphone before bed as much as possible. This is because the bright light from the screen wakes up your brain.","Even a difference of just a few hours adds up to a big gap if it continues every day. Why not start by getting into bed a little earlier?"],"vocab":[{"w":"睡眠","r":"すいみん","m":"睡眠","m_en":"sleep"},{"w":"削る","r":"けずる","m":"削減、減少(時間等)","m_en":"to cut back, to reduce"},{"w":"質","r":"しつ","m":"品質、質量","m_en":"quality"},{"w":"集中力","r":"しゅうちゅうりょく","m":"專注力、注意力","m_en":"concentration"},{"w":"調子","r":"ちょうし","m":"狀態、狀況","m_en":"condition, state"},{"w":"眠気","r":"ねむけ","m":"睡意","m_en":"sleepiness"},{"w":"整える","r":"ととのえる","m":"調整好、整頓","m_en":"to arrange, to put in order"},{"w":"心がける","r":"こころがける","m":"留意、努力做到","m_en":"to keep in mind, to make an effort"},{"w":"脳","r":"のう","m":"大腦","m_en":"brain"},{"w":"布団","r":"ふとん","m":"被褥、被子","m_en":"futon, bedding"}],"grammar":[{"t":"〜がちだ","note":"表示容易出現某種(多半是不好的)傾向。例:「ついいちばん先に睡眠の時間を削ってしまいがちです」","t_en":"~gachi da","note_en":"Indicates a tendency to do something, usually undesirable. Example: 「ついいちばん先に睡眠の時間を削ってしまいがちです」"},{"t":"〜のせいで","note":"表示因為某個原因而導致不好的結果。例:「昼間の眠気のせいで、仕事や勉強がうまくいかない人も少なくないでしょう」","t_en":"~no sei de","note_en":"Because of ~ (a cause that leads to a negative result). Example: 「昼間の眠気のせいで、仕事や勉強がうまくいかない人も少なくないでしょう」"},{"t":"〜ように心がける","note":"表示努力留意、盡量做到某件事。例:「毎日同じ時間に寝て、同じ時間に起きるように心がけましょう」","t_en":"~you ni kokorogakeru","note_en":"To make an effort to do something regularly. Example: 「毎日同じ時間に寝て、同じ時間に起きるように心がけましょう」"},{"t":"〜によって","note":"表示原因或手段,說明某事物造成的影響。例:「画面の明るい光によって、脳が目を覚ましてしまうからです」","t_en":"~ni yotte","note_en":"By, due to (cause or means). Example: 「画面の明るい光によって、脳が目を覚ましてしまうからです」"}]},
{"id":"a-n2-6-n4","variant_of":"a-n2-6","level":"n4","topic":"健康","topic_en":"Health","title":"ねる時間を大切に","title_zh":"重視睡眠時間","title_en":"Take Care of Your Sleep","body":"忙しいと、つい寝る時間を減らしてしまいます。でもよく寝ることは、元気に生活するために大切です。\n寝る時間が足りないと、集中できなくなります。体の調子も悪くなってしまうことがあります。昼に眠くて、仕事や勉強ができない人も多いでしょう。\nよく寝るには、まず毎日の生活のリズムを作ることが大切です。毎日同じ時間に寝て、同じ時間に起きるようにしましょう。寝る前にスマートフォンを見るのは、やめたほうがいいです。画面の明るい光で、頭が起きてしまうからです。少しの違いでも、毎日続けると大きな差になります。まずは早めに布団に入ることから始めてみましょう。","trans":["忙碌的時候,總是不知不覺就減少了睡覺的時間。但是好好睡覺,對於健康地過生活來說很重要。","睡覺時間不夠的話,就會無法專心。身體狀況也可能會變差。白天因為想睡而無法工作或讀書的人,想必也很多吧。","為了睡得好,首先建立每天的生活節奏很重要。請試著每天在同一個時間睡覺、同一個時間起床。睡前最好不要看智慧型手機。因為螢幕明亮的光線,會讓大腦清醒過來。就算只是小小的差別,每天持續下去也會變成很大的差距。首先,就從早一點進被窩開始試試看吧。"],"trans_en":["When we are busy, we often cut down our sleeping time without thinking. But sleeping well is important for living a healthy life.","If you do not get enough sleep, you cannot concentrate. Your health may also get worse. Many people probably cannot work or study well because they feel sleepy during the day.","To sleep well, it is important to first build a daily routine. Let's try to go to bed at the same time and wake up at the same time every day. It is better not to look at your smartphone before bed. This is because the bright light from the screen wakes up your brain. Even a small difference becomes a big gap if you keep it up every day. First, why not start by getting into bed a little earlier?"],"vocab":[{"w":"忙しい","r":"いそがしい","m":"忙碌的","m_en":"busy"},{"w":"減らす","r":"へらす","m":"減少","m_en":"to reduce"},{"w":"元気","r":"げんき","m":"健康、有精神","m_en":"healthy, energetic"},{"w":"大切","r":"たいせつ","m":"重要的","m_en":"important"},{"w":"集中","r":"しゅうちゅう","m":"專心、集中","m_en":"concentration"},{"w":"調子","r":"ちょうし","m":"狀況、狀態","m_en":"condition"},{"w":"眠い","r":"ねむい","m":"想睡的","m_en":"sleepy"},{"w":"生活","r":"せいかつ","m":"生活","m_en":"life, daily living"},{"w":"違い","r":"ちがい","m":"差別","m_en":"difference"},{"w":"布団","r":"ふとん","m":"被子、被褥","m_en":"futon, bedding"}],"grammar":[{"t":"〜てしまう","note":"表示不小心做了某事,或事情變成不希望的結果。例:「つい寝る時間を減らしてしまいます」「頭が起きてしまうからです」","t_en":"~te shimau","note_en":"Shows something happens unintentionally or with an unwanted result. Example: 「つい寝る時間を減らしてしまいます」"},{"w":"","t":"〜ないと","note":"「如果不……的話,就會……」,表示條件與結果。例:「寝る時間が足りないと、集中できなくなります」","t_en":"~nai to","note_en":"Means 'if you do not ~, then ...'. Example: 「寝る時間が足りないと、集中できなくなります」"},{"t":"〜ようにする","note":"表示努力養成某種習慣或盡量去做。例:「同じ時間に起きるようにしましょう」","t_en":"~you ni suru","note_en":"Means to try to make something a habit. Example: 「同じ時間に起きるようにしましょう」","id":"n3-39"},{"t":"〜たほうがいい","note":"「最好……」,用來給建議。例:「見るのは、やめたほうがいいです」","t_en":"~ta hou ga ii","note_en":"Means 'had better ~', used for advice. Example: 「やめたほうがいいです」"}]},
{"id":"a-n2-8-n3","variant_of":"a-n2-8","level":"n3","topic":"社会","topic_en":"Society","title":"地方移住という選択","title_zh":"移居鄉間這個選項","title_en":"The Choice to Move to the Countryside","body":"最近、都会を離れて地方に移住する人が増えているという。その大きな理由は、リモートワークが広まったことだ。今では、どこに住んでいても仕事ができるようになった人が多いのである。\n地方の家賃は都会の半分以下で、通勤ラッシュとも縁がない。自然に囲まれた暮らしは、とても魅力的に見えるだろう。そのため、移住を真剣に考え始める人もいるようだ。\nしかし、移住というのは決して簡単なことではない。車がなければ生活できない地域も多く、医療や教育の面で不便を感じることもある。また、地域の人間関係にうまく溶け込めるかどうかも、大きな課題だと言われている。都会とは違う習慣や付き合い方に、戸惑う人もいるかもしれない。\n大切なのは、理想だけで決めてしまわないことだ。実際に何度かその土地へ足を運んで、暮らしの様子を自分の目で確かめたほうがいい。そうすることで、移住してからの失敗を減らせるのではないだろうか。","trans":["據說最近離開都市、移居鄉間的人越來越多。其中一大原因,是遠距工作普及了。現在很多人不管住在哪裡都能工作了。","鄉間的房租不到都市的一半,也與通勤尖峰無緣。被大自然環繞的生活,看起來非常有魅力。因此,似乎也有人開始認真考慮移居。","但是,移居絕對不是件簡單的事。沒有車就無法生活的地區很多,在醫療和教育方面有時也會感到不便。另外,能不能順利融入當地的人際關係,據說也是一大課題。也許有人會對和都市不同的習慣與相處方式感到困惑。","重要的是,不要只憑理想就做決定。最好實際多跑幾趟那塊土地,親眼確認生活的樣子。這樣做,不是就能減少移居後的失敗嗎?"],"trans_en":["It is said that more and more people are leaving the city and moving to the countryside. A major reason is that remote work has become widespread. Many people can now work no matter where they live.","Rent in the countryside is less than half of that in the city, and there is no commuter rush either. A life surrounded by nature looks very appealing. For that reason, some people seem to start seriously thinking about moving.","However, moving to the countryside is by no means easy. There are many areas where you cannot live without a car, and you may feel inconvenienced when it comes to medical care and education. Whether you can blend into the local relationships is also said to be a big challenge. Some people may be confused by customs and ways of socializing that differ from the city.","What matters is not to decide based on ideals alone. It is better to visit the place several times and see for yourself what life there is like. Doing so might reduce the chances of failure after you move, don't you think?"],"vocab":[{"w":"移住","r":"いじゅう","m":"移居","m_en":"migration, relocating to live elsewhere"},{"w":"広まる","r":"ひろまる","m":"普及、擴散","m_en":"to spread, to become widespread"},{"w":"家賃","r":"やちん","m":"房租","m_en":"rent"},{"w":"魅力的","r":"みりょくてき","m":"有魅力的","m_en":"attractive, appealing"},{"w":"地域","r":"ちいき","m":"地區","m_en":"area, region"},{"w":"不便","r":"ふべん","m":"不便","m_en":"inconvenient"},{"w":"溶け込む","r":"とけこむ","m":"融入","m_en":"to blend in, to fit in"},{"w":"課題","r":"かだい","m":"課題、待解決的問題","m_en":"challenge, issue to be solved"},{"w":"足を運ぶ","r":"あしをはこぶ","m":"特地前往、親自去","m_en":"to go in person, to visit"},{"w":"確かめる","r":"たしかめる","m":"確認","m_en":"to make sure, to confirm"}],"grammar":[{"t":"〜ようになる","note":"表示能力或狀態的變化,「以前不能,現在變得可以」。例:「どこに住んでいても仕事ができるようになった人が多いのである」","t_en":"~you ni naru","note_en":"Expresses a change in ability or state, becoming able to do something. Example: 「どこに住んでいても仕事ができるようになった人が多いのである」","id":"n3-40"},{"t":"〜かどうか","note":"表示「是否~」,把疑問句嵌進句子裡。例:「地域の人間関係にうまく溶け込めるかどうかも、大きな課題だと言われている」","t_en":"~ka dou ka","note_en":"Means whether or not, embedding a yes/no question in a sentence. Example: 「地域の人間関係にうまく溶け込めるかどうかも、大きな課題だと言われている」"},{"t":"〜と言われている","note":"表示「據說~、一般認為~」,用來客觀轉述社會上的說法。例:「大きな課題だと言われている」","t_en":"~to iwarete iru","note_en":"Means it is said that, used to objectively report a common view. Example: 「大きな課題だと言われている」"},{"t":"〜のではないだろうか","note":"委婉表達自己的看法,「不是~嗎」「也許~吧」。例:「移住してからの失敗を減らせるのではないだろうか」","t_en":"~no dewa nai darou ka","note_en":"A soft way to state your opinion, meaning isn't it that or perhaps. Example: 「移住してからの失敗を減らせるのではないだろうか」"}]},
{"id":"a-n2-8-n4","variant_of":"a-n2-8","level":"n4","topic":"社会","topic_en":"Society","title":"いなかで暮らすという選択","title_zh":"移居鄉間這個選項","title_en":"Choosing to Live in the Countryside","body":"最近、大きい町を出て、いなかに引っ越す人が増えているそうだ。インターネットで仕事ができるようになったので、どこに住んでも働けるからだ。\nいなかは家賃が安いし、朝の電車も込んでいない。山や海が近くにあって、きれいな自然の中で暮らせるのも人気の理由だ。\nでも、引っ越しは簡単ではない。車がないと生活できない所が多いし、病院や学校が遠くて困ることもある。\nまた、近所の人と仲よくできるかどうかも、大切な問題だそうだ。だから、理想だけで決めないほうがいい。何回かその町に行って、どんな生活ができるか自分の目で見たほうがいいと思う。","trans":["據說最近離開大城市、搬到鄉下的人越來越多。因為現在可以用網路工作,所以不管住在哪裡都能工作。","鄉下房租便宜,早上的電車也不擁擠。離山和海很近,能在漂亮的大自然中生活,也是受歡迎的原因。","但是,搬家並不簡單。沒有車就無法生活的地方很多,醫院和學校很遠,有時也會很困擾。","另外,能不能和鄰居好好相處,據說也是重要的問題。所以,最好不要只憑理想做決定。我覺得最好去那個地方幾次,親眼看看能過什麼樣的生活。"],"trans_en":["It is said that more and more people are leaving big cities and moving to the countryside. Because people can now work over the internet, they can work wherever they live.","Rent is cheap in the countryside, and the morning trains are not crowded. Being close to mountains and the sea and living in beautiful nature is also a reason it is popular.","However, moving is not easy. There are many places where you cannot live without a car, and sometimes hospitals and schools are far away and cause trouble.","Also, whether you can get along well with your neighbors is said to be an important issue. So it is better not to decide based only on your ideals. I think it is better to visit the town several times and see with your own eyes what kind of life you can have."],"vocab":[{"w":"引っ越す","r":"ひっこす","m":"搬家","m_en":"to move (house)"},{"w":"増える","r":"ふえる","m":"增加","m_en":"to increase"},{"w":"働く","r":"はたらく","m":"工作","m_en":"to work"},{"w":"家賃","r":"やちん","m":"房租","m_en":"rent"},{"w":"込む","r":"こむ","m":"擁擠","m_en":"to be crowded"},{"w":"自然","r":"しぜん","m":"大自然","m_en":"nature"},{"w":"理由","r":"りゆう","m":"理由","m_en":"reason"},{"w":"病院","r":"びょういん","m":"醫院","m_en":"hospital"},{"w":"近所","r":"きんじょ","m":"鄰居、附近","m_en":"neighborhood, neighbor"},{"w":"理想","r":"りそう","m":"理想","m_en":"ideal"}],"grammar":[{"t":"〜そうだ(傳聞)","note":"表示聽來的消息。例:「いなかに引っ越す人が増えているそうだ」","t_en":"〜そうだ (hearsay)","note_en":"Reports something you heard. Example: 「いなかに引っ越す人が増えているそうだ」"},{"t":"〜ので","note":"表示原因、理由。例:「インターネットで仕事ができるようになったので、どこに住んでも働ける」","t_en":"〜ので","note_en":"Gives a reason or cause. Example: 「インターネットで仕事ができるようになったので」"},{"t":"可能形","note":"表示可以做某事。例:「きれいな自然の中で暮らせる」","t_en":"Potential form","note_en":"Expresses ability or possibility. Example: 「きれいな自然の中で暮らせる」","id":"n4-52"},{"t":"〜ないと〜ない/〜ほうがいい","note":"「車がないと生活できない」表示沒有就不行;「決めないほうがいい」表示建議最好不要做","t_en":"〜ないと〜ない / 〜ほうがいい","note_en":"「車がないと生活できない」means you cannot without it; 「決めないほうがいい」gives advice that it is better not to do something."}]},
{"id":"a-n2-9-n3","variant_of":"a-n2-9","level":"n3","topic":"社会","topic_en":"Society","title":"在留資格の更新という関門","title_zh":"在留資格更新這道關卡","title_en":"The Hurdle of Renewing Your Residence Status","body":"日本で生活する外国人にとって、在留資格の更新は必ず通らなければならない大切な関門です。更新の申請は、在留期限の三か月前からすることができます。ただ、書類の準備には時間がかかるため、できるだけ早く動いたほうがいいです。\n必要な書類は、申請書のほかに、住民税の課税証明書や納税証明書、在職証明書などです。転職したばかりの人は、雇用契約書を出すように言われることもあります。審査では、収入が安定しているかや、税金と年金をきちんと払っているかが見られます。\nつまり、日ごろの手続きを後回しにしてきた人は、その問題がこの時期に一度に出てくるわけです。入管の窓口はとても混むため、オンラインで申請する人も増えています。それによって、手続きの流れも少しずつ変わってきています。\n結果が出るまでの数週間は、落ち着かない気持ちになるかもしれません。しかし、必要な書類をそろえて正直に申告すれば、心配しすぎることはありません。","trans":["對在日本生活的外國人來說,在留資格的更新是一道一定要通過的重要關卡。更新申請可以從在留期限的三個月前開始辦理。不過,因為準備文件很花時間,還是盡量早點行動比較好。","需要的文件除了申請書之外,還有住民稅的課稅證明、納稅證明、在職證明等等。剛換工作的人,有時會被要求提出僱用契約書。審查時會看收入是否穩定,以及稅金和年金有沒有確實繳納。","也就是說,平時把手續一直往後拖的人,那些問題會在這個時期一次冒出來。入管的窗口非常擁擠,因此使用線上申請的人也在增加。隨著這個變化,手續的流程也正一點一點地改變。","在結果出來之前的幾個星期,心情可能會靜不下來。不過,只要備齊必要的文件並誠實申報,就不需要過度擔心。"],"trans_en":["For foreigners living in Japan, renewing your residence status is an important hurdle you must get through. You can apply for renewal starting three months before your period of stay ends. However, preparing the documents takes time, so it is better to start as early as possible.","Besides the application form, the required documents include a resident tax certificate, a tax payment certificate, and a certificate of employment. People who have just changed jobs may also be asked to submit their employment contract. The review checks whether your income is stable and whether you are properly paying taxes and pension.","In other words, for people who have been putting off their everyday procedures, those problems all come up at once at this time. The immigration office counters get very crowded, so more people are applying online. Because of this, the procedures are also gradually changing.","The weeks until you get the result may feel unsettling. However, if you gather the necessary documents and report honestly, there is no need to worry too much."],"vocab":[{"w":"在留資格","r":"ざいりゅうしかく","m":"在留資格(在日本居留的資格)","m_en":"residence status"},{"w":"更新","r":"こうしん","m":"更新、續期","m_en":"renewal"},{"w":"関門","r":"かんもん","m":"關卡","m_en":"hurdle, barrier"},{"w":"申請","r":"しんせい","m":"申請","m_en":"application"},{"w":"書類","r":"しょるい","m":"文件、資料","m_en":"documents"},{"w":"審査","r":"しんさ","m":"審查","m_en":"review, screening"},{"w":"収入","r":"しゅうにゅう","m":"收入","m_en":"income"},{"w":"後回し","r":"あとまわし","m":"往後拖、延後處理","m_en":"putting off, postponing"},{"w":"窓口","r":"まどぐち","m":"窗口","m_en":"service counter"},{"w":"申告","r":"しんこく","m":"申報","m_en":"report, declaration"}],"grammar":[{"t":"〜ため","note":"表示原因、理由,語氣比「から」更書面。例:「書類の準備には時間がかかるため、できるだけ早く動いたほうがいいです」","t_en":"〜ため (reason)","note_en":"Shows a cause or reason, more formal than から. Example: 「書類の準備には時間がかかるため、できるだけ早く動いたほうがいいです」"},{"t":"〜たばかり","note":"表示剛剛做完某事不久。例:「転職したばかりの人は、雇用契約書を出すように言われることもあります」","t_en":"〜たばかり","note_en":"Means something has just happened. Example: 「転職したばかりの人は、雇用契約書を出すように言われることもあります」","id":"n3-11"},{"t":"〜ように言われる","note":"表示被要求或被告知去做某事。例:「雇用契約書を出すように言われることもあります」","t_en":"〜ように言われる","note_en":"Means being told or asked to do something. Example: 「雇用契約書を出すように言われることもあります」"},{"t":"〜わけだ","note":"表示順理成章的結論,「也就是說……」。例:「その問題がこの時期に一度に出てくるわけです」","t_en":"〜わけだ","note_en":"Expresses a natural conclusion, 'that is to say...'. Example: 「その問題がこの時期に一度に出てくるわけです」","id":"n3-41"}]},
{"id":"a-n2-9-n4","variant_of":"a-n2-9","level":"n4","topic":"社会","topic_en":"Society","title":"在留資格の更新","title_zh":"在留資格更新","title_en":"Renewing Your Residence Status","body":"日本に住む外国人は、在留資格を更新しなければなりません。期限の三か月前から申請ができます。書類を用意するのに時間がかかるので、早めに始めたほうがいいです。\n必要な書類は、申請書、住民税の証明書、税金を払った証明書、会社の証明書などです。仕事を変えたばかりの人は、働く契約の書類もいるかもしれません。\n審査では、収入が安定しているかどうかを見ます。税金や年金をちゃんと払っているかどうかも見ます。いつも手続きをしないでおくと、更新のときに困りそうです。入管の窓口は人が多いので、インターネットで申請する人も増えています。結果が出るまでは心配ですが、書類をそろえて本当のことを書けば、あまり心配しなくてもいいです。","trans":["住在日本的外國人必須更新在留資格。從期限三個月前就可以申請。因為準備文件需要時間,所以早點開始比較好。","需要的文件有申請書、住民稅證明、繳稅證明、公司開的證明等等。剛換工作的人,也可能需要工作契約的文件。","審查時會看收入是否穩定,也會看稅金和年金有沒有好好繳。如果平常總是不去辦手續,更新的時候好像會很困擾。入管的窗口人很多,所以用網路申請的人也在增加。在結果出來之前雖然會擔心,但只要備齊文件、寫下真實的內容,就不用太擔心。"],"trans_en":["Foreigners living in Japan must renew their residence status. You can apply from three months before the deadline. Preparing documents takes time, so it is better to start early.","The documents you need include the application form, a resident tax certificate, a tax payment certificate, and a certificate from your company. People who have just changed jobs may also need their work contract.","In the examination, they check whether your income is stable. They also check whether you pay your taxes and pension properly. If you always leave procedures for later, you may have trouble at renewal time. The immigration office is crowded, so more people apply online. Waiting for the result is worrying, but if you prepare your documents and write only the truth, you do not need to worry too much."],"vocab":[{"w":"在留資格","r":"ざいりゅうしかく","m":"在留資格(居留身分)","m_en":"residence status"},{"w":"更新","r":"こうしん","m":"更新、續期","m_en":"renewal"},{"w":"期限","r":"きげん","m":"期限","m_en":"deadline"},{"w":"申請","r":"しんせい","m":"申請","m_en":"application"},{"w":"書類","r":"しょるい","m":"文件","m_en":"documents"},{"w":"証明書","r":"しょうめいしょ","m":"證明書","m_en":"certificate"},{"w":"収入","r":"しゅうにゅう","m":"收入","m_en":"income"},{"w":"安定","r":"あんてい","m":"穩定","m_en":"stable"},{"w":"窓口","r":"まどぐち","m":"窗口","m_en":"service counter"},{"w":"そろえる","r":"そろえる","m":"備齊","m_en":"to gather, to get ready"}],"grammar":[{"t":"〜なければなりません","note":"表示「必須」。例:「在留資格を更新しなければなりません」","t_en":"~nakereba narimasen","note_en":"Means must. Example: 「在留資格を更新しなければなりません」"},{"t":"〜たほうがいい","note":"表示「最好做~」,用來給建議。例:「早めに始めたほうがいいです」","t_en":"~ta hō ga ii","note_en":"Means had better. Used for advice. Example: 「早めに始めたほうがいいです」"},{"t":"〜そうだ","note":"表示根據情況推測「好像會~」。例:「更新のときに困りそうです」","t_en":"~sō da","note_en":"Means looks like, seems about to. Example: 「更新のときに困りそうです」"},{"t":"〜ば(條件形)","note":"表示「如果~的話」。例:「書類をそろえて本当のことを書けば、あまり心配しなくてもいいです」","t_en":"~ba (conditional)","note_en":"Means if. Example: 「書類をそろえて本当のことを書けば、あまり心配しなくてもいいです」"}]},
{"id":"a-n3-10-n2","variant_of":"a-n3-10","level":"n2","topic":"生活","topic_en":"Daily life","title":"ゴミ出しのルールが教えてくれること","title_zh":"丟垃圾的規矩教會我的事","title_en":"What Garbage Rules Teach Us","body":"日本で暮らし始めて最初に戸惑ったのは、ゴミの分け方が想像以上に細かく決められていることだった。燃えるゴミ、燃えないゴミ、資源ゴミといった分類は、区によって基準も回収日も異なるのが実情である。そのため、引っ越しをしたらまず市役所でもらえる一覧表に目を通しておくに越したことはない。\nペットボトルを出すときは、ラベルとキャップを外し、中を軽くすすいでから出すのが基本である。正直なところ面倒に感じる作業ではあるが、そのひと手間によって再利用できるかどうかが決まるらしい。出す時間にも決まりがあり、多くの地域では当日の朝八時までとされている。前の晩に出してしまうと、カラスに荒らされる恐れがあるため、早めに出せば安心とは限らない。\n粗大ゴミの場合は、通常のゴミ以上に手続きが必要で、事前に電話やネットで申し込まざるを得ない。申し込んだあとは、コンビニでシールを買って貼っておくという流れになる。この仕組みを知らずにそのまま置いてしまい、注意された人も少なくないそうだ。外国から来た人にとっては、言葉の壁に加えて、こうした暗黙の了解が負担になることもある。\n最初は細かすぎると感じたが、住んでいるうちに自然と習慣になっていった。日々のゴミ出しは単なる作業にとどまらず、地域の人々への配慮を示す行為でもある。ゴミの出し方は、その地域で暮らすための最初の「共通ルール」なのかもしれない。","trans":["開始在日本生活後,最先讓我困惑的是垃圾的分法被規定得比想像中更細。可燃垃圾、不可燃垃圾、資源回收這些分類,其標準與回收日在各區的實際情況都不一樣。因此搬家之後,最好先看過市役所發的分類一覽表。","丟寶特瓶時,基本原則是拆掉標籤和瓶蓋,把裡面稍微沖一下再丟。老實說這是件令人覺得麻煩的工作,但據說就是這道小工序決定了能不能再利用。丟的時間也有規定,多數地區是當天早上八點以前。如果前一天晚上就丟出去,有可能被烏鴉翻亂,所以提早丟不一定就安心。","大型垃圾比一般垃圾更需要手續,不得不事先用電話或網路申請。申請之後,流程是到便利商店買貼紙貼上。聽說不知道這個制度就直接放出去而被提醒的人也不少。對從外國來的人而言,除了語言的隔閡之外,這類不成文的默契也可能成為負擔。","一開始覺得太瑣碎,但住著住著就自然變成了習慣。每天丟垃圾不只是單純的作業,也是對地區居民表達體貼的行為。丟垃圾的方式,或許就是在那個地區生活的第一條「共同規則」。"],"trans_en":["When I first started living in Japan, what confused me most was that the way of sorting garbage was set out in far more detail than I had imagined. Categories such as burnable, non-burnable and recyclable waste, along with their standards and collection days, differ from ward to ward in practice. So after moving, it is best to first look over the list you can get at the city hall.","When putting out a PET bottle, the basic rule is to remove the label and cap and rinse the inside lightly before putting it out. Honestly it feels like a chore, but apparently that small extra step decides whether the bottle can be reused. There are also rules about timing: in many areas garbage must be out by 8 a.m. on the collection day. If you put it out the night before, crows may tear it apart, so putting it out early is not necessarily safe.","Bulky waste requires more procedures than ordinary garbage, and you have no choice but to apply in advance by phone or online. After applying, the process is to buy a sticker at a convenience store and attach it. Reportedly, quite a few people have been warned after leaving items out without knowing this system. For people from abroad, in addition to the language barrier, such unspoken understandings can also be a burden.","At first it felt too finicky, but as I lived here it gradually became a habit. Taking out the garbage every day is not merely a chore but also an act that shows consideration for the people around you. The way you put out garbage may be the first \"shared rule\" for living in that community."],"vocab":[{"w":"戸惑う","r":"とまどう","m":"困惑、不知所措","m_en":"to be bewildered"},{"w":"基準","r":"きじゅん","m":"標準、基準","m_en":"standard, criterion"},{"w":"実情","r":"じつじょう","m":"實際情況","m_en":"actual situation"},{"w":"目を通す","r":"めをとおす","m":"過目、大致看過","m_en":"to look over"},{"w":"すすぐ","r":"すすぐ","m":"沖洗、漱","m_en":"to rinse"},{"w":"再利用","r":"さいりよう","m":"再利用","m_en":"reuse"},{"w":"荒らす","r":"あらす","m":"翻亂、破壞","m_en":"to ravage, to mess up"},{"w":"粗大ゴミ","r":"そだいごみ","m":"大型垃圾","m_en":"bulky waste"},{"w":"暗黙の了解","r":"あんもくのりょうかい","m":"不成文的默契","m_en":"unspoken understanding"},{"w":"配慮","r":"はいりょ","m":"體貼、顧慮","m_en":"consideration"}],"grammar":[{"t":"〜に越したことはない","note":"表示「做某事是最好的」,帶有建議語氣。例:「市役所でもらえる一覧表に目を通しておくに越したことはない」","t_en":"~ni koshita koto wa nai","note_en":"Means 'it is best to ~'; used for advice. Example: 「市役所でもらえる一覧表に目を通しておくに越したことはない」","id":"n2-62"},{"t":"〜ざるを得ない","note":"表示「不得不~」,沒有其他選擇。例:「事前に電話やネットで申し込まざるを得ない」","t_en":"~zaru o enai","note_en":"Means 'have no choice but to ~'. Example: 「事前に電話やネットで申し込まざるを得ない」","id":"n2-35"},{"t":"〜とは限らない","note":"表示「不一定~」,否定絕對的說法。例:「早めに出せば安心とは限らない」","t_en":"~to wa kagiranai","note_en":"Means 'not necessarily ~'. Example: 「早めに出せば安心とは限らない」","id":"n2-58"},{"t":"〜にとどまらず","note":"表示「不僅限於~,還有更多」。例:「単なる作業にとどまらず、地域の人々への配慮を示す行為でもある」","t_en":"~ni todomarazu","note_en":"Means 'not limited to ~, but also more'. Example: 「単なる作業にとどまらず、地域の人々への配慮を示す行為でもある」","id":"n1-80"}]},
{"id":"a-n3-10-n4","variant_of":"a-n3-10","level":"n4","topic":"生活","topic_en":"Daily life","title":"ゴミの出し方のルール","title_zh":"丟垃圾的規矩","title_en":"Rules for Taking Out the Garbage","body":"日本で生活し始めて、最初に困ったのはゴミの分け方でした。\n燃えるゴミ、燃えないゴミ、資源ゴミがあります。分け方も回収の日も、住んでいる区によって違います。引っ越したら、市役所でもらえる表を見たほうがいいです。\nペットボトルは、ラベルとキャップをとって、中を少し洗ってから出します。面倒そうですが、このひと手間で、もう一度使えるかどうかが決まるそうです。\nゴミを出す時間も決まっていて、多くの地域では、その日の朝八時までです。前の晩に出すと、カラスがゴミを散らかすことがあるからです。\n大きいゴミは、先に電話かインターネットで申し込みます。そして、コンビニでシールを買って、ゴミに貼ります。\nこのルールを知らないで出して、注意された人も少なくありません。\n最初は細かすぎると思いましたが、だんだん慣れました。\nゴミの出し方は、その町で生活するための、最初の共通ルールかもしれません。","trans":["開始在日本生活後,最先困擾我的是垃圾的分類方式。","有可燃垃圾、不可燃垃圾、資源回收。分類方式和回收日,每個居住的區都不一樣。搬家之後,最好看一下市役所發的分類表。","寶特瓶要先拆掉標籤和瓶蓋,把裡面稍微洗一下再丟。看起來很麻煩,但據說這道小工序決定了能不能再次使用。","丟垃圾的時間也有規定,多數地區是當天早上八點以前。因為如果前一天晚上丟出去,烏鴉可能會把垃圾弄得到處都是。","大型垃圾要先用電話或網路申請。然後到便利商店買貼紙,貼在垃圾上。","不知道這個規定就丟出去而被提醒的人也不少。","一開始覺得太瑣碎,但慢慢就習慣了。","丟垃圾的方式,或許就是在那個城鎮生活的第一條共同規則。"],"trans_en":["When I started living in Japan, the first thing that troubled me was how to sort garbage.","There are burnable garbage, non-burnable garbage, and recyclables. The sorting method and collection days differ depending on the ward you live in. After moving, you should look at the chart you can get at city hall.","For PET bottles, you remove the label and cap, rinse the inside a little, and then put them out. It seems troublesome, but this small effort apparently decides whether they can be used again.","The time to put out garbage is also fixed, and in many areas it is by 8 a.m. on the collection day. If you put it out the night before, crows may scatter the garbage.","For large garbage, you first apply by phone or on the internet. Then you buy a sticker at a convenience store and put it on the item.","Quite a few people have put garbage out without knowing this rule and were warned.","At first I thought it was too detailed, but I gradually got used to it.","How to take out garbage may be the first shared rule for living in that town."],"vocab":[{"w":"困る","r":"こまる","m":"困擾、為難","m_en":"to be troubled"},{"w":"分け方","r":"わけかた","m":"分類的方法","m_en":"way of sorting"},{"w":"回収","r":"かいしゅう","m":"回收、收取","m_en":"collection"},{"w":"引っ越す","r":"ひっこす","m":"搬家","m_en":"to move (house)"},{"w":"洗う","r":"あらう","m":"洗","m_en":"to wash"},{"w":"面倒","r":"めんどう","m":"麻煩","m_en":"troublesome"},{"w":"決まる","r":"きまる","m":"決定、規定好","m_en":"to be decided"},{"w":"申し込む","r":"もうしこむ","m":"申請、報名","m_en":"to apply"},{"w":"注意する","r":"ちゅういする","m":"提醒、警告","m_en":"to warn"},{"w":"慣れる","r":"なれる","m":"習慣、適應","m_en":"to get used to"}],"grammar":[{"t":"〜たら","note":"表示「如果做了…之後」。例:「引っ越したら、市役所でもらえる表を見たほうがいいです」","t_en":"~tara (if/when)","note_en":"Means 'if/after doing'. Example: 「引っ越したら、市役所でもらえる表を見たほうがいいです」"},{"w":"","t":"〜たほうがいい","note":"表示「最好…」,用來給建議。例:「市役所でもらえる表を見たほうがいいです」","t_en":"~ta hou ga ii (had better)","note_en":"Gives advice. Example: 「市役所でもらえる表を見たほうがいいです」"},{"t":"〜そうだ(樣態/傳聞)","note":"「面倒そうです」是看起來的樣子;「決まるそうです」是聽說。例:「このひと手間で、もう一度使えるかどうかが決まるそうです」","t_en":"~sou da (looks like / I heard)","note_en":"'面倒そうです' means it looks troublesome; '決まるそうです' means I heard. Example: 「このひと手間で、もう一度使えるかどうかが決まるそうです」"},{"t":"〜ので/〜からです(理由)","note":"說明原因。例:「前の晩に出すと、カラスがゴミを散らかすことがあるからです」","t_en":"~kara desu (reason)","note_en":"Explains a reason. Example: 「前の晩に出すと、カラスがゴミを散らかすことがあるからです」"}]},
{"id":"a-n3-11-n2","variant_of":"a-n3-11","level":"n2","topic":"職場","topic_en":"Work","title":"報連相の大切さ","title_zh":"報連相的重要性","title_en":"The Importance of Hou-Ren-Sou","body":"日本の会社で働くうえで、「報連相」という考え方は非常に重要だと広く言われています。これは「報告」「連絡」「相談」という三つの言葉の頭を取ってまとめた、略語のようなものです。一見単純な習慣ですが、仕事を円滑に進めるための土台として位置づけられているのが特徴です。\nまず報告とは、仕事の進み具合を上司に伝えることを指します。特に問題が起きた場合には、後回しにせず直ちに報告することが求められます。次に連絡は、業務に必要な情報を関係する人に伝える行為です。たとえば予定が変わったときには、できるだけ早めに連絡することが重んじられます。最後の相談は、自分一人では決められないことについて、上司や同僚の意見を聞くことです。些細なことでも早めに相談しておけば、大きな失敗を未然に防ぐことができるわけです。\n外国人の社員にとっては、この報連相の習慣は、最初のうちは負担に感じられるかもしれません。自分の国では、自ら判断して進める姿勢が評価される場合もあるため、戸惑う人がいても不思議ではありません。周囲に相談せず進めることが、日本では必ずしも良い結果につながるとは限らないのです。\nしかし、報連相をきちんと行えば、チームの中で信頼を得やすくなるという利点があります。日本の会社で働くのであれば、この考え方を理解しておくことが大いに役立つでしょう。習慣の違いに戸惑いながらも、少しずつ慣れていかざるを得ない場面もあるはずです。","trans":["在日本的公司工作時,「報連相」這個觀念被廣泛認為非常重要。這是取「報告」「聯絡」「商量」三個詞各自的第一個字合起來的簡稱。乍看是很單純的習慣,但它被視為讓工作順利進行的基礎,這正是它的特色。","首先,報告是指向上司傳達工作的進度。特別是發生問題時,被要求不要拖延,要立刻報告。其次,聯絡是把業務所需的資訊傳達給相關人員的行為。例如行程有變動時,重視盡可能及早聯絡。最後的商量,是針對自己一個人無法決定的事,詢問上司或同事的意見。即使是瑣碎的小事,只要及早商量,就能防止大的失敗於未然。","對外國員工來說,這種報連相的習慣在剛開始時,或許會覺得是種負擔。在自己的國家,有時自行判斷、推進工作的態度會受到肯定,所以感到困惑也不足為奇。不先與周圍的人商量就自行推進,在日本未必會帶來好的結果。","不過,只要確實做好報連相,就有在團隊中容易獲得信賴的好處。如果要在日本的公司工作,理解這種想法會非常有幫助。面對習慣的差異,雖然會感到困惑,但也有些場合不得不一點一點慢慢適應。"],"trans_en":["In Japanese companies, the idea of \"hou-ren-sou\" is widely said to be extremely important. It is an abbreviation made from the first characters of the three words report, contact and consultation. It looks like a simple habit, but it is regarded as the foundation for getting work done smoothly.","First, reporting means telling your boss how your work is progressing. Especially when a problem arises, you are expected to report it right away instead of putting it off. Next, contact means passing necessary information on to the people concerned. For example, when plans change, contacting people as early as possible is valued. Finally, consultation means asking your boss or colleagues for their opinion on things you cannot decide alone. Even for minor matters, consulting early lets you prevent big failures before they happen.","For foreign employees, the habit of hou-ren-sou may feel like a burden at first. In some home countries, an attitude of making your own decisions and moving ahead is valued, so it is no wonder some people are confused. Pushing ahead without consulting those around you does not necessarily lead to good results in Japan.","However, if you practice hou-ren-sou properly, you gain the advantage of earning trust more easily within your team. If you work at a Japanese company, understanding this way of thinking will be very useful. Even while feeling puzzled by differences in habits, there will probably be times when you have no choice but to adapt little by little."],"vocab":[{"w":"円滑","r":"えんかつ","m":"順利、圓滑","m_en":"smooth, without friction"},{"w":"土台","r":"どだい","m":"基礎、根基","m_en":"foundation, basis"},{"w":"直ちに","r":"ただちに","m":"立刻、馬上","m_en":"immediately, at once"},{"w":"重んじる","r":"おもんじる","m":"重視、看重","m_en":"to value, to respect"},{"w":"些細","r":"ささい","m":"瑣碎的、微小的","m_en":"trivial, minor"},{"w":"未然に","r":"みぜんに","m":"防患於未然、事先","m_en":"before it happens, in advance"},{"w":"戸惑う","r":"とまどう","m":"困惑、不知所措","m_en":"to be confused, to be bewildered"},{"w":"評価","r":"ひょうか","m":"評價、肯定","m_en":"evaluation, appreciation"},{"w":"信頼","r":"しんらい","m":"信賴","m_en":"trust, confidence"}],"grammar":[{"t":"〜うえで","note":"表示「在做某事的過程、方面」。例:「日本の会社で働くうえで、「報連相」という考え方は非常に重要だと広く言われています」","t_en":"〜うえで","note_en":"Means \"in the process of / when it comes to doing something.\" Example: 日本の会社で働くうえで、「報連相」という考え方は非常に重要だと広く言われています"},{"t":"〜にとって","note":"表示「站在某人的立場來看」。例:「外国人の社員にとっては、この報連相の習慣は、最初のうちは負担に感じられるかもしれません」","t_en":"〜にとって","note_en":"Means \"for / from the standpoint of.\" Example: 外国人の社員にとっては、この報連相の習慣は、最初のうちは負担に感じられるかもしれません","id":"n3-8"},{"t":"〜とは限らない","note":"表示「未必都是…」,否定絕對的說法。例:「周囲に相談せず進めることが、日本では必ずしも良い結果につながるとは限らないのです」","t_en":"〜とは限らない","note_en":"Means \"not necessarily; not always.\" Example: 周囲に相談せず進めることが、日本では必ずしも良い結果につながるとは限らないのです","id":"n2-58"},{"t":"〜ざるを得ない","note":"表示「不得不…」,帶有無可奈何的語氣。例:「習慣の違いに戸惑いながらも、少しずつ慣れていかざるを得ない場面もあるはずです」","t_en":"〜ざるを得ない","note_en":"Means \"have no choice but to.\" Example: 習慣の違いに戸惑いながらも、少しずつ慣れていかざるを得ない場面もあるはずです","id":"n2-35"}]},
{"id":"a-n3-11-n4","variant_of":"a-n3-11","level":"n4","topic":"職場","topic_en":"Work","title":"報連相って大切です","title_zh":"報連相的重要性","title_en":"Why Ho-Ren-So Is Important","body":"日本の会社では、「報連相」がとても大切だと言われています。これは「報告」「連絡」「相談」の三つを合わせた言葉です。\n仕事がどこまで進んだか、上の人に話すことを報告と言います。問題が起きたら、すぐに報告しなければなりません。連絡は、必要なことを関係がある人に伝えることです。予定が変わったときは、早く連絡することが大切です。\n相談は、自分一人で決められないことを、上の人や同じ会社の人に聞くことです。小さなことでも相談すれば、大きな失敗をしないで済みます。外国人には、最初は難しいと思うかもしれません。自分の国では、一人で考えて進めると、よく見られることもあるからです。でも、報連相をちゃんとすれば、チームの人に信じてもらいやすくなります。日本の会社で働くなら、この考え方を知っておくと役に立ちます。","trans":["在日本的公司裡,常說「報連相」非常重要。這是把「報告」「聯絡」「商量」三個詞合在一起的說法。","向上面的人說明工作進行到哪裡,稱為報告。發生問題時,必須馬上報告。聯絡是指把必要的事情告訴相關的人。行程改變時,盡早聯絡很重要。","商量是指自己一個人無法決定的事,去問上司或公司同事。就算是小事,只要商量,就能避免大的失敗。對外國人來說,一開始也許會覺得很難。因為在自己的國家,有時一個人思考、推進工作反而會得到好評。不過,只要確實做好報連相,就更容易得到團隊成員的信任。若要在日本公司工作,先了解這種想法會很有幫助。"],"trans_en":["In Japanese companies, people say that \"ho-ren-so\" is very important. It is a word that combines three things: report, contact, and consultation.","Telling your boss how far your work has progressed is called reporting. If a problem happens, you must report it right away. Contact means telling the necessary things to the people involved. When plans change, it is important to contact them early.","Consultation means asking your boss or coworkers about things you cannot decide alone. Even for small things, if you consult someone, you can avoid big mistakes. For foreigners, it may feel difficult at first. In your own country, thinking and working on your own may be valued. But if you do ho-ren-so properly, your team will find it easier to trust you. If you work at a Japanese company, it helps to know this way of thinking."],"vocab":[{"w":"報告","r":"ほうこく","m":"報告","m_en":"report"},{"w":"連絡","r":"れんらく","m":"聯絡","m_en":"contact, getting in touch"},{"w":"相談","r":"そうだん","m":"商量","m_en":"consultation, talking over"},{"w":"問題","r":"もんだい","m":"問題","m_en":"problem"},{"w":"予定","r":"よてい","m":"預定、行程","m_en":"plan, schedule"},{"w":"大切","r":"たいせつ","m":"重要、珍貴","m_en":"important"},{"w":"失敗","r":"しっぱい","m":"失敗","m_en":"failure, mistake"},{"w":"外国人","r":"がいこくじん","m":"外國人","m_en":"foreigner"},{"w":"信じる","r":"しんじる","m":"相信","m_en":"to trust, to believe"},{"w":"役に立つ","r":"やくにたつ","m":"有幫助、有用","m_en":"to be useful"}],"grammar":[{"t":"〜たら","note":"表示「如果～的話、一旦～」。例:「問題が起きたら、すぐに報告しなければなりません」","t_en":"~tara (if/when)","note_en":"Means 'if' or 'when' something happens. Example: 「問題が起きたら、すぐに報告しなければなりません」"},{"t":"〜なければなりません","note":"表示「必須～」。例:「すぐに報告しなければなりません」","t_en":"~nakereba narimasen (must)","note_en":"Means 'must do'. Example: 「すぐに報告しなければなりません」"},{"t":"〜ば","note":"表示條件「只要～就」。例:「小さなことでも相談すれば、大きな失敗をしないで済みます」","t_en":"~ba (conditional)","note_en":"Expresses a condition, 'if/as long as'. Example: 「小さなことでも相談すれば、大きな失敗をしないで済みます」"},{"t":"〜かもしれません","note":"表示「也許～」,說明可能性。例:「最初は難しいと思うかもしれません」","t_en":"~kamoshiremasen (might)","note_en":"Expresses possibility, 'might'. Example: 「最初は難しいと思うかもしれません」","id":"n4-3"}]},
{"id":"a-n3-2-n2","variant_of":"a-n3-2","level":"n2","topic":"生活","topic_en":"Everyday life","title":"一人暮らしが教えてくれたこと","title_zh":"獨居生活教會我的事","title_en":"What Living Alone Taught Me","body":"大学への進学をきっかけに、私は生まれて初めて一人暮らしを始めることになった。最初のうちは、親の目を気にせず何でも自由に決められることが、ただうれしくてたまらなかった。今思えば、その自由には当然ながら責任が伴うということを、まだ理解していなかったのだと思う。\nところが、実際に生活を始めてみると、料理も洗濯も掃除も、すべて自分でやらざるを得なかった。そうした家事に追われるうちに、今まで親が当たり前のようにこなしてくれていたことの多さに気づかされた。生活の変化に伴って、お金の使い方についても真剣に考えるようになった。限られた生活費でやりくりを続けるうちに、何が本当に必要なのかを自然に見極められるようになったのである。\n一人暮らしには大変なことが多いが、自分のことは自分でやる力が身につくという利点もある。また、一人でいると寂しく感じる場面もあるが、その分、自分の時間を自由に使えるのも事実だ。好きなことに集中できる時間は、家族と同居していた頃にはなかなか得られないものだった。誰にも頼れない環境に身を置いてこそ、人は初めて自立の意味を考えるのかもしれない。\nそして何より、家族のありがたさが、以前よりはるかによく分かるようになった。振り返ってみると、そのありがたさに気づけたのは、家族と離れて暮らし始めてからのことだった。一人暮らしは、単なる生活の変化にとどまらず、物の見方を変えてくれる貴重な経験だと言える。","trans":["因為上大學的契機,我生平第一次開始一個人住。一開始,不用在意父母的眼光、什麼事都能自己決定,這件事讓我開心得不得了。現在回想起來,我當時還不明白,那份自由理所當然地伴隨著責任。","然而,實際開始生活後,做飯、洗衣、打掃,全都不得不自己來。在被家事追著跑的過程中,我才意識到,至今父母理所當然地為我做了多少事。隨著生活的改變,我也開始認真思考金錢的使用方式。在有限的生活費中持續精打細算,漸漸自然地能分辨出什麼才是真正需要的。","獨居雖然辛苦的事很多,但也有能培養出自己的事自己做的能力這個好處。另外,一個人時雖然有時會覺得寂寞,但相對地,能自由運用自己的時間也是事實。能專心做喜歡的事的時間,是以前和家人同住時很難得到的。或許正因為身處無法依賴任何人的環境,人才會第一次思考自立的意義。","而最重要的是,我比以前更懂得家人的可貴了。回頭想想,能體會到這份可貴,是在離開家人開始獨自生活之後的事。獨居不只是生活上的改變,可以說是一段會改變看事情角度的寶貴經驗。"],"trans_en":["Starting university gave me the chance to live alone for the first time in my life. At first, I was simply thrilled to be able to decide everything freely without worrying about my parents watching. Looking back, I think I didn't yet understand that such freedom naturally comes with responsibility.","But once I actually started living on my own, I had no choice but to do all the cooking, laundry and cleaning myself. Busy with those chores, I was made to realize how much my parents had been doing for me as if it were nothing. As my life changed, I also began to think seriously about how I spent money. As I kept managing on a limited budget, I naturally became able to tell what I truly needed.","Living alone has many hardships, but it also has the advantage of building the ability to take care of yourself. Also, although you sometimes feel lonely when you are alone, it is true that you can use your time freely in exchange. Time to concentrate on what I like was something I could hardly get when I lived with my family. Perhaps it is only when you put yourself in an environment where you can rely on no one that you first think about what independence means.","Above all, I came to understand the value of my family much better than before. Looking back, I was able to notice how much I should be grateful only after I started living apart from them. Living alone is not merely a change in lifestyle; it is a precious experience that changes the way you see things."],"vocab":[{"w":"進学","r":"しんがく","m":"升學","m_en":"advancing to higher education"},{"w":"伴う","r":"ともなう","m":"伴隨、隨之而來","m_en":"to accompany, come with"},{"w":"当たり前","r":"あたりまえ","m":"理所當然","m_en":"natural, taken for granted"},{"w":"気づかされる","r":"きづかされる","m":"被點醒、不由得意識到","m_en":"to be made aware of"},{"w":"限られる","r":"かぎられる","m":"受限的、有限的","m_en":"to be limited"},{"w":"見極める","r":"みきわめる","m":"看清、辨別","m_en":"to discern, determine"},{"w":"身につく","r":"みにつく","m":"學會、養成","m_en":"to be acquired (a skill)"},{"w":"自立","r":"じりつ","m":"自立","m_en":"independence"},{"w":"貴重","r":"きちょう","m":"寶貴的","m_en":"precious, valuable"}],"grammar":[{"t":"〜に伴って","note":"表示「隨著…的變化,另一件事也跟著變化」。例:「生活の変化に伴って、お金の使い方についても真剣に考えるようになった」。","t_en":"〜に伴って","note_en":"'Along with / as X changes, Y changes too.' Example: 「生活の変化に伴って、お金の使い方についても真剣に考えるようになった」."},{"t":"〜ざるを得ない","note":"表示「不得不…」,帶有無可奈何的語氣(ない形去掉ない+ざるを得ない)。例:「すべて自分でやらざるを得なかった」。","t_en":"〜ざるを得ない","note_en":"'Have no choice but to do X.' Example: 「すべて自分でやらざるを得なかった」.","id":"n2-35"},{"t":"〜てこそ","note":"強調「正因為…才能…」,後面接正面的結果或評價。例:「誰にも頼れない環境に身を置いてこそ、人は初めて自立の意味を考えるのかもしれない」。","t_en":"〜てこそ","note_en":"'Only by doing X can one truly Y.' Example: 「誰にも頼れない環境に身を置いてこそ、人は初めて自立の意味を考えるのかもしれない」."},{"t":"〜にとどまらず","note":"表示「不僅限於…,還…」,用來擴大範圍。例:「単なる生活の変化にとどまらず、物の見方を変えてくれる貴重な経験だ」。","t_en":"〜にとどまらず","note_en":"'Not limited to X; goes beyond.' Example: 「単なる生活の変化にとどまらず、物の見方を変えてくれる貴重な経験だ」.","id":"n1-80"}]},
{"id":"a-n3-2-n4","variant_of":"a-n3-2","level":"n4","topic":"生活","topic_en":"Everyday life","title":"一人暮らしで学んだこと","title_zh":"獨居生活學到的事","title_en":"What I Learned from Living Alone","body":"大学に入って、初めて一人で住むようになった。最初は、自由に生活できてうれしかった。でも、料理も洗濯もそうじも、自分でしなければならない。親がしてくれたことが多かったと、そのとき分かった。\nお金の使い方も、考えるようになった。使えるお金が少ないので、本当に必要な物を考えて買う。一人で住むのは大変だが、自分のことが自分でできるようになる。\n一人だとさびしい時もあるが、自分の時間を自由に使える。そして、家族がどれだけ大切か、前より分かるようになった。家族のありがたさに気づいたのは、離れて住んでからだった。","trans":["上了大學,第一次開始一個人住。一開始,能自由生活讓我很開心。但是,做飯、洗衣、打掃都得自己來。那時我才明白,父母以前為我做了很多事。","我也開始會思考用錢的方式。因為能用的錢不多,所以會想清楚再買真正需要的東西。一個人住雖然辛苦,但會變得能自己處理自己的事。","一個人有時會寂寞,但可以自由運用自己的時間。而且,我比以前更懂得家人有多重要。體會到家人的可貴,是在離家生活之後。"],"trans_en":["After starting university, I lived alone for the first time. At first, I was happy to be able to live freely. But I had to do the cooking, laundry, and cleaning all by myself. That was when I realized how much my parents had done for me.","I also started thinking about how I use money. Because I don't have much to spend, I think carefully and buy only what I really need. Living alone is hard, but you become able to take care of yourself.","When you're alone, you sometimes feel lonely, but you can use your time freely. Also, I came to understand better than before how important my family is. I noticed how grateful I should be only after I moved away from them."],"vocab":[{"w":"初めて","r":"はじめて","m":"第一次","m_en":"for the first time"},{"w":"住む","r":"すむ","m":"居住","m_en":"to live, to reside"},{"w":"自由","r":"じゆう","m":"自由","m_en":"free, freedom"},{"w":"料理","r":"りょうり","m":"料理、做菜","m_en":"cooking, dish"},{"w":"洗濯","r":"せんたく","m":"洗衣服","m_en":"laundry"},{"w":"必要","r":"ひつよう","m":"需要、必要","m_en":"necessary, needed"},{"w":"大変","r":"たいへん","m":"辛苦、不容易","m_en":"hard, tough"},{"w":"大切","r":"たいせつ","m":"重要、珍貴","m_en":"important, precious"},{"w":"気づいた","r":"きづいた","m":"注意到、發現","m_en":"noticed, realized"},{"w":"離れて","r":"はなれて","m":"分開、離開","m_en":"to be away from, to separate"}],"grammar":[{"t":"〜なければならない","note":"表示「必須做〜」。文中:「自分でしなければならない」,說明做飯洗衣打掃都得自己來。","t_en":"must do ~","note_en":"Expresses obligation. Example: 「自分でしなければならない」 means one has to do the chores by oneself."},{"t":"〜ようになる","note":"表示變化,從不會到會,或習慣改變。文中:「考えるようになった」「分かるようになった」。","t_en":"come to ~, start to ~","note_en":"Shows a change in ability or habit. Examples: 「考えるようになった」 and 「分かるようになった」.","id":"n3-40"},{"t":"〜ので","note":"表示原因、理由,語氣柔和。文中:「使えるお金が少ないので」,後面接結果。","t_en":"because ~, so ~","note_en":"Gives a reason in a soft way. Example: 「使えるお金が少ないので」 is followed by the result."},{"t":"〜てから","note":"表示「做完〜之後才」。文中:「離れて住んでからだった」,說明是分開住之後才發現。","t_en":"after doing ~","note_en":"Means after doing one thing. Example: 「離れて住んでからだった」 shows he or she noticed only after moving away."}]},
{"id":"a-n3-3-n2","variant_of":"a-n3-3","level":"n2","topic":"文化","topic_en":"Culture","title":"銭湯という文化","title_zh":"澡堂這種文化","title_en":"The Culture of the Sento","body":"銭湯とは、大勢の人が一緒に入る公共のおふろのことで、かつては日常生活に欠かせない存在だった。昔は家におふろがない家庭が多く、人々は銭湯を利用せざるを得なかったのである。銭湯は単に体を洗う場所にとどまらず、地域の人々が顔を合わせる交流の場としての役割も果たしていた。\nところが、各家庭におふろが広まるに伴って、銭湯を利用する人は次第に減っていった。その結果、銭湯の数もどんどん減り、時代遅れの存在だと見なされるようになった。しかし最近になって、銭湯ならではの良さが改めて見直されるようになってきている。\n広いおふろにゆっくりつかっていると、体の疲れだけでなく、心の緊張までもほぐれていく。自宅の小さな浴槽ではなかなか味わえない、この開放感こそが銭湯の魅力だと言えるだろう。また、隣に座った見知らぬ人と、きっかけもなく自然に会話が生まれることも珍しくない。日常ではつい避けてしまいがちな人との触れ合いが、ここでは無理なく成り立つのである。\n便利さを追い求めるあまり、私たちは人とのつながりを失いつつあるのかもしれない。何でも一人で済ませられる時代だからこそ、他人と同じ空間で過ごす時間の価値が際立ってくる。銭湯は、そうした現代において、人と人との距離感を思い出させてくれる貴重な場所なのだ。","trans":["所謂澡堂,是指許多人一起泡的公共浴池,過去是日常生活中不可或缺的存在。以前許多家庭沒有浴室,人們不得不利用澡堂。澡堂不只是洗身體的地方,也扮演著地區居民碰面交流的場所角色。","然而,隨著各個家庭開始普及浴室,使用澡堂的人逐漸減少。結果澡堂的數量也不斷減少,甚至被視為過時的存在。不過最近,澡堂獨有的好處又重新受到重視。","在寬敞的浴池裡慢慢泡,不只是身體的疲勞,連心裡的緊繃也會跟著放鬆。這種在自家小浴缸難以體會到的開闊感,可以說正是澡堂的魅力所在。此外,和坐在旁邊素不相識的人,沒什麼契機也自然地聊起來,並不罕見。平常容易下意識避開的人際接觸,在這裡卻能毫不勉強地發生。","或許正是因為過度追求便利,我們正逐漸失去人與人之間的連結。正因為身處一切都能自己搞定的時代,和他人共處同一個空間的時光,其價值才更顯突出。在這樣的現代,澡堂是一個讓人想起人與人之間距離感的珍貴場所。"],"trans_en":["A sento is a public bath that many people enter together, and it was once an essential part of daily life. In the past, many homes had no bath, so people had no choice but to use the sento. It was not merely a place to wash the body but also a place where local residents met and interacted.","However, as baths spread to individual homes, the number of people using sento gradually declined. As a result, the number of sento kept falling, and they came to be seen as outdated. Recently, though, the unique appeal of the sento is being reappreciated.","Soaking slowly in a large bath relaxes not only the body's fatigue but also the tension in the mind. This sense of openness, hard to find in a small bath at home, is arguably the real charm of the sento. It is also not unusual for conversation to arise naturally with a stranger sitting next to you, without any particular reason. Contact with others that we tend to avoid in everyday life comes about here without strain.","Perhaps, in our eagerness to pursue convenience, we are gradually losing our connections with other people. Precisely because we live in an age when we can do everything alone, the value of time spent in the same space as others stands out. In today's world, the sento is a precious place that reminds us of the proper distance between people."],"vocab":[{"w":"銭湯","r":"せんとう","m":"公共澡堂、錢湯","m_en":"public bathhouse"},{"w":"欠かせない","r":"かかせない","m":"不可或缺的","m_en":"indispensable"},{"w":"存在","r":"そんざい","m":"存在、存在物","m_en":"existence, presence"},{"w":"交流","r":"こうりゅう","m":"交流、往來","m_en":"interaction, exchange"},{"w":"広まる","r":"ひろまる","m":"普及、傳開","m_en":"to spread"},{"w":"見直す","r":"みなおす","m":"重新評價、重新審視","m_en":"to reassess, to see in a new light"},{"w":"開放感","r":"かいほうかん","m":"開闊舒暢的感覺","m_en":"sense of openness, liberation"},{"w":"見知らぬ","r":"みしらぬ","m":"不認識的、陌生的","m_en":"unfamiliar, unknown"},{"w":"失う","r":"うしなう","m":"失去","m_en":"to lose"},{"w":"際立つ","r":"きわだつ","m":"顯眼、突出","m_en":"to stand out, to be conspicuous"}],"grammar":[{"t":"〜ざるを得ない","note":"表示「不得不…」,沒有其他選擇。例:「人々は銭湯を利用せざるを得なかったのである」。動詞ない形去掉ない再接ざるを得ない,する要變成せざるを得ない。","t_en":"〜ざるを得ない","note_en":"Means 'have no choice but to…'. Example: 「人々は銭湯を利用せざるを得なかったのである」. Attach to the verb stem of the ない form; する becomes せざるを得ない.","id":"n2-35"},{"t":"〜に伴って","note":"表示隨著某件事的變化,另一件事也跟著變化。例:「各家庭におふろが広まるに伴って、銭湯を利用する人は次第に減っていった」。","t_en":"〜に伴って","note_en":"Means 'along with / as…', where one change accompanies another. Example: 「各家庭におふろが広まるに伴って、銭湯を利用する人は次第に減っていった」."},{"t":"〜にとどまらず","note":"表示「不僅限於…,還…」。例:「銭湯は単に体を洗う場所にとどまらず、地域の人々が顔を合わせる交流の場としての役割も果たしていた」。","t_en":"〜にとどまらず","note_en":"Means 'not limited to…, but also…'. Example: 「銭湯は単に体を洗う場所にとどまらず、地域の人々が顔を合わせる交流の場としての役割も果たしていた」.","id":"n1-80"},{"t":"〜あまり","note":"表示因為過度…而導致(多半不好的)結果。例:「便利さを追い求めるあまり、私たちは人とのつながりを失いつつあるのかもしれない」。","t_en":"〜あまり","note_en":"Means 'so much so that… / out of excess of…', usually leading to a negative result. Example: 「便利さを追い求めるあまり、私たちは人とのつながりを失いつつあるのかもしれない」."}]},
{"id":"a-n3-3-n4","variant_of":"a-n3-3","level":"n4","topic":"文化","topic_en":"Culture","title":"銭湯という文化","title_zh":"澡堂這種文化","title_en":"The Culture of the Sento","body":"銭湯とは、みんなで入る大きなおふろのことだ。昔は家におふろがない人が多かったので、銭湯は大切な場所だった。地域の人が顔を合わせる場所でもあった。\n家におふろができると、銭湯の数はだんだん減っていった。でも最近、銭湯のいいところをもう一度見る人が増えている。広いおふろにゆっくり入ると、体も心も楽になる。\nとなりにいた知らない人と、自然に話せることもある。便利な生活の中で、人とのつながりは弱くなっているかもしれない。銭湯は、人と人との近さを思い出させてくれる場所だ。","trans":["所謂澡堂,是大家一起泡的大浴池。以前家裡沒有浴室的人很多,所以澡堂是很重要的地方。它也是社區居民碰面交流的場所。","家裡有了浴室之後,澡堂的數量漸漸減少。但最近,越來越多人重新看見澡堂的好處。在寬敞的浴池裡慢慢泡,身體和心都會放鬆。","有時還能和坐在旁邊、不認識的人自然地聊起來。在便利的生活中,人與人的連結或許正在變弱。澡堂是能讓人想起人與人之間距離的地方。"],"trans_en":["A sento is a big bath that many people use together. In the past, many people had no bath at home, so the sento was an important place. It was also a place where people from the neighborhood met face to face.","When homes began to have their own baths, the number of sento slowly went down. But recently, more and more people are taking a fresh look at what is good about them. If you soak slowly in a wide bath, both your body and mind feel relaxed.","Sometimes you can even talk naturally with a stranger sitting next to you. In our convenient lives, our connections with other people may be getting weaker. The sento is a place that reminds us how close people can be to each other."],"vocab":[{"w":"銭湯","r":"せんとう","m":"公共澡堂","m_en":"public bathhouse"},{"w":"昔","r":"むかし","m":"以前、從前","m_en":"long ago, the past"},{"w":"大切","r":"たいせつ","m":"重要、珍貴","m_en":"important, precious"},{"w":"地域","r":"ちいき","m":"地區、社區","m_en":"area, community"},{"w":"減る","r":"へる","m":"減少","m_en":"to decrease"},{"w":"最近","r":"さいきん","m":"最近","m_en":"recently"},{"w":"増える","r":"ふえる","m":"增加","m_en":"to increase"},{"w":"自然","r":"しぜん","m":"自然、自然而然","m_en":"natural, naturally"},{"w":"便利","r":"べんり","m":"方便","m_en":"convenient"},{"w":"思い出す","r":"おもいだす","m":"想起來","m_en":"to remember, to recall"}],"grammar":[{"t":"〜と(條件)","note":"表示「一做A,自然就會B」。例:「家におふろができると、銭湯の数はだんだん減っていった」。","t_en":"~to (conditional)","note_en":"Expresses that when A happens, B naturally follows. Example: 「家におふろができると、銭湯の数はだんだん減っていった」."},{"t":"〜ので","note":"表示原因、理由,語氣比「から」柔和。例:「昔は家におふろがない人が多かったので、銭湯は大切な場所だった」。","t_en":"~node","note_en":"Gives a reason, in a softer tone than kara. Example: 「昔は家におふろがない人が多かったので、銭湯は大切な場所だった」."},{"t":"〜ことがある(可能形+こともある)","note":"表示「有時會…」。這裡搭配可能形「話せる」。例:「知らない人と、自然に話せることもある」。","t_en":"~koto mo aru (with potential form)","note_en":"Means 'sometimes it happens that...'. Here it is used with the potential form 話せる. Example: 「知らない人と、自然に話せることもある」."},{"t":"〜かもしれない","note":"表示「也許…」,說話者不太確定。例:「人とのつながりは弱くなっているかもしれない」。","t_en":"~kamoshirenai","note_en":"Means 'maybe', when the speaker is not sure. Example: 「人とのつながりは弱くなっているかもしれない」."}]},
{"id":"a-n3-4-n2","variant_of":"a-n3-4","level":"n2","topic":"新聞","topic_en":"News","title":"進む少子化","title_zh":"持續的少子化","title_en":"Japan's Advancing Declining Birthrate","body":"日本では少子化に伴って、子どもの数が年々減り続けており、社会のあり方そのものが大きく変わろうとしている。少子化とは、生まれる子どもの数が減り、社会全体に占める子どもの割合が小さくなっていく現象のことである。一見するとゆるやかな変化に見えるが、その影響は私たちの暮らしのさまざまな場面に及ぶと考えられている。\n少子化の原因は、ひとつに絞れるものではなく、いくつもの要因が複雑に絡み合っていると言える。まず、結婚しない人が増えたことで、そもそも子どもを持つ機会が少なくなっているという指摘がある。また、子育てにかかるお金の負担が大きく、子どもを持ちたくても諦めざるを得ない家庭も少なくない。さらに、仕事と育児の両立がむずかしいことも、出産をためらわせる大きな理由になっている。\n子どもが減れば、それに伴って、将来社会で働く人の数も確実に減っていくことになる。働く人が減ると、経済の力が弱まるおそれがあり、企業や地域の活力が失われる可能性も否定できない。加えて、お年寄りを支える仕組みが立ちゆかなくなるのではないかという不安も、広がりつつある。少子化は子育て世代だけの問題ではなく、社会全体の将来に関わる課題だと考えるべきだろう。\n政府もさまざまな対策を進めているが、その効果はまだ十分に現れているとは言えない状況だ。支援の制度を整えたからといって、すぐに子どもを産み育てやすくなるとは限らないからである。社会全体で、子どもを育てやすい環境をどう作っていくかが、今あらためて問われている。","trans":["隨著少子化,日本的孩子數量逐年持續減少,整個社會的樣貌本身也正要出現大幅改變。所謂少子化,指的是出生的孩子數量減少,孩子在整體社會中所占的比例越來越小的現象。乍看之下似乎只是緩慢的變化,但一般認為其影響會波及我們生活的各個層面。","少子化的原因無法歸結為單一因素,可以說是多個要因錯綜複雜地交織在一起。首先,有人指出不結婚的人變多,使得擁有孩子的機會本來就在減少。另外,養育孩子所花的錢負擔沉重,不少家庭即使想生也不得不放棄。再者,工作與育兒難以兼顧,也成為讓人對生育猶豫的一大理由。","孩子減少的話,隨之而來的是將來在社會上工作的人數也必然會減少。工作的人變少,經濟力量可能會減弱,企業與地區的活力也不能排除會流失。此外,支撐老年人的制度是否會難以維繫,這樣的不安也正逐漸擴大。少子化不只是育兒世代的問題,應該視為關係到整個社會未來的課題。","政府也在推動各種對策,但可以說效果還沒有充分顯現。因為即使完善了支援制度,也不一定能立刻讓人更容易生養孩子。整個社會要如何打造容易養育孩子的環境,如今再次受到考驗。"],"trans_en":["With the declining birthrate, the number of children in Japan keeps falling year after year, and the very shape of society is about to change significantly. The declining birthrate refers to a phenomenon in which fewer children are born and children make up a smaller share of society as a whole. It may look like a gradual change at first glance, but its effects are thought to reach many areas of our daily lives.","The causes of the declining birthrate cannot be narrowed down to a single one; it is fair to say that several factors are intricately intertwined. First, it is pointed out that as more people do not marry, opportunities to have children are fewer to begin with. In addition, the financial burden of raising children is heavy, and not a few households have no choice but to give up even though they want children. Furthermore, the difficulty of balancing work and childcare is also a major reason people hesitate to have children.","If the number of children falls, the number of people who will work in society in the future will inevitably fall with it. As the working population shrinks, there is a risk that economic strength will weaken, and we cannot rule out that the vitality of companies and communities will be lost. On top of that, anxiety is spreading about whether the systems that support the elderly will become unsustainable. The declining birthrate should be regarded not as a problem only for families raising children, but as an issue concerning the future of society as a whole.","The government is also pursuing various measures, but it can hardly be said that their effects have yet fully appeared. This is because even if support systems are put in place, it does not necessarily become easier right away to have and raise children. How the whole of society can build an environment in which children are easy to raise is being asked anew today."],"vocab":[{"w":"少子化","r":"しょうしか","m":"少子化(出生率下降、孩子變少)","m_en":"declining birthrate"},{"w":"要因","r":"よういん","m":"主要因素、原因","m_en":"factor, cause"},{"w":"絡み合う","r":"からみあう","m":"交織、糾纏在一起","m_en":"to be intertwined"},{"w":"負担","r":"ふたん","m":"負擔","m_en":"burden"},{"w":"両立","r":"りょうりつ","m":"兩者兼顧","m_en":"balancing two things, compatibility"},{"w":"否定","r":"ひてい","m":"否定、否認","m_en":"denial, negation"},{"w":"立ちゆかない","r":"たちゆかない","m":"難以維持、行不通","m_en":"unsustainable, unable to carry on"},{"w":"対策","r":"たいさく","m":"對策","m_en":"countermeasure"},{"w":"活力","r":"かつりょく","m":"活力","m_en":"vitality"},{"w":"問われる","r":"とわれる","m":"被追問、受到考驗","m_en":"to be questioned, to be called into question"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某個變化,另一件事也同時變化。例:「少子化に伴って、子どもの数が年々減り続けており」。","t_en":"〜に伴って","note_en":"Means that as one thing changes, another changes along with it. Example: 「少子化に伴って、子どもの数が年々減り続けており」."},{"t":"〜ざるを得ない","note":"表示不得不這麼做、沒有其他選擇。例:「子どもを持ちたくても諦めざるを得ない家庭も少なくない」。","t_en":"〜ざるを得ない","note_en":"Means having no choice but to do something. Example: 「子どもを持ちたくても諦めざるを得ない家庭も少なくない」.","id":"n2-35"},{"t":"〜とは限らない","note":"表示並非總是如此、不一定。例:「すぐに子どもを産み育てやすくなるとは限らない」。","t_en":"〜とは限らない","note_en":"Means something is not necessarily always the case. Example: 「すぐに子どもを産み育てやすくなるとは限らない」.","id":"n2-58"},{"t":"〜つつある","note":"表示某個變化正在持續進行中。例:「不安も、広がりつつある」。","t_en":"〜つつある","note_en":"Indicates that a change is in progress. Example: 「不安も、広がりつつある」.","id":"n2-1"}]},
{"id":"a-n3-4-n4","variant_of":"a-n3-4","level":"n4","topic":"新聞","topic_en":"News","title":"へる子どもの数","title_zh":"減少的孩子數量","title_en":"Fewer and Fewer Children","body":"今、日本では子どもの数がずっと減っています。これを「少子化」と言います。原因はひとつではありません。結婚しない人が増えました。子どもを育てるのにお金がかかります。仕事と子育てを両方するのも大変です。\n子どもが減ると、将来働く人も少なくなります。そうすると、国のお金の力が弱くなるかもしれません。お年寄りを助ける仕組みも続けにくくなりそうです。\n国はいろいろなことをしていますが、まだ十分ではありません。みんなで子どもを育てやすい社会を考えることが大切です。このまま進むと、社会を支えるのが難しくなると言われています。","trans":["現在日本的孩子數量一直在減少。這被稱為「少子化」。原因不只一個。不結婚的人變多了。養育孩子需要花錢。同時兼顧工作與育兒也很辛苦。","孩子減少的話,將來工作的人也會變少。這樣一來,國家的經濟力量可能會變弱。幫助老年人的制度似乎也會變得難以維持。","國家雖然在做各種事情,但還不夠。大家一起思考容易養育孩子的社會很重要。據說照這樣下去,要支撐社會會變得困難。"],"trans_en":["In Japan, the number of children keeps falling. This is called \"shoushika\" (declining birthrate). There is more than one cause. More people are not getting married. Raising children costs a lot of money. Doing both work and child-rearing is also hard.","When there are fewer children, there will be fewer working people in the future. Because of that, the country's economic strength may become weaker. It also seems it will become hard to keep the system that helps older people.","The government is doing many things, but it is still not enough. It is important for everyone to think about a society where raising children is easier. It is said that if things continue like this, supporting society will become difficult."],"vocab":[{"w":"減る","r":"へる","m":"減少","m_en":"to decrease"},{"w":"原因","r":"げんいん","m":"原因","m_en":"cause"},{"w":"結婚","r":"けっこん","m":"結婚","m_en":"marriage"},{"w":"増える","r":"ふえる","m":"增加","m_en":"to increase"},{"w":"育てる","r":"そだてる","m":"養育、培養","m_en":"to raise"},{"w":"将来","r":"しょうらい","m":"將來","m_en":"future"},{"w":"お年寄り","r":"おとしより","m":"老年人","m_en":"elderly people"},{"w":"仕組み","r":"しくみ","m":"制度、結構","m_en":"system, mechanism"},{"w":"十分","r":"じゅうぶん","m":"足夠","m_en":"enough"},{"w":"支える","r":"ささえる","m":"支撐、支持","m_en":"to support"}],"grammar":[{"t":"〜と、…(條件)","note":"表示「一旦…就會…」的必然結果。例:「子どもが減ると、将来働く人も少なくなります」","t_en":"~to, … (conditional)","note_en":"Shows a natural result: \"When children decrease, there will be fewer working people in the future.\""},{"t":"〜かもしれません","note":"表示「也許…」的推測。例:「国のお金の力が弱くなるかもしれません」","t_en":"~kamoshiremasen","note_en":"Expresses possibility: \"The country's economic strength may become weaker.\"","id":"n4-3"},{"t":"〜にくい","note":"接在動詞ます形後,表示「難以…」。例:「続けにくくなりそうです」","t_en":"~nikui","note_en":"Attaches to the verb stem to mean \"hard to do\": \"it seems it will become hard to continue.\""},{"t":"〜そうだ(樣態)","note":"表示根據情況看起來「似乎會…」。例:「続けにくくなりそうです」","t_en":"~sou da (appearance)","note_en":"Means \"looks like it will…\": \"it looks like it will become hard to continue.\""}]},
{"id":"a-n3-5-n2","variant_of":"a-n3-5","level":"n2","topic":"職場","topic_en":"Workplace","title":"飲みニケーション","title_zh":"喝酒交際文化","title_en":"Nominication: Drinking Culture at Work","body":"日本の会社では、仕事が終わったあとに同僚や上司と連れ立ってお酒を飲みに行く習慣が、今でも広く見られる。こうした酒席での付き合いは、お酒とコミュニケーションを組み合わせて「飲みニケーション」と呼ばれている。業務の延長として半ば当然のように行われてきたため、新入社員が先輩に誘われて参加する場面も珍しくなかった。\nお酒の席では、職場ではなかなか口にしにくい本音を打ち明けられるという利点がある。上司に対しても、会議室にいるときより気軽に話しかけられるようになる。そのため、飲みニケーションは人間関係を深める貴重な機会だと評価する人が少なくない。お酒の勢いで距離が縮まり、仕事が円滑に進むこともあるからだ。\n一方で、若い世代では「仕事のあとの時間は自分のために使いたい」と考える人が増えてきている。彼らにとって、勤務時間外の過ごし方は本来、個人が自由に決めるべきものなのだ。それにもかかわらず参加を事実上強制されることに対して、強い抵抗を感じる人も決して少なくない。断れば付き合いが悪いと見られかねず、不本意ながら出席せざるを得ない人もいる。\n働き方や価値観が多様化するのに伴って、飲みニケーションのあり方も少しずつ変わりつつあるのかもしれない。最近の若者には、仕事と私生活をきちんと分けたいと考える人が増えているのも、その表れだろう。お酒に頼らなくても、日ごろの会話を通じて信頼関係を築けることが、本来は理想的な姿だと言える。","trans":["在日本的公司,下班後與同事或上司結伴去喝酒的習慣,至今仍很常見。這種酒席上的交際,結合了「酒」與「溝通」,被稱為「飲みニケーション」。因為它長期被視為工作的延伸、近乎理所當然地進行,所以新進員工被前輩邀請參加的場面也不罕見。","在酒席上,有著能說出職場中難以啟齒的真心話的好處。面對上司,也能比在會議室時更輕鬆地搭話。因此,不少人認為喝酒溝通是加深人際關係的寶貴機會。畢竟借著酒意拉近距離,也可能讓工作進行得更順利。","另一方面,在年輕世代中,認為「下班後的時間想用在自己身上」的人正在增加。對他們來說,下班後的時間怎麼過,本來就該由個人自由決定。儘管如此,對於實質上被強制參加,感到強烈排斥的人也絕不在少數。若拒絕,可能被認為不合群,所以也有人心不甘情不願,卻不得不出席。","隨著工作方式與價值觀日趨多元,喝酒溝通的形式或許也正一點一點地改變。最近的年輕人當中,想把工作與私生活好好分開的人變多,或許就是這種變化的表現。就算不依賴酒,也能透過平日的對話建立信賴關係,才稱得上是本來理想的樣貌。"],"trans_en":["In Japanese companies, it is still common for people to go out for drinks with colleagues and bosses after work. This kind of socializing, combining alcohol and communication, is called \"nominication.\" Because it has long been treated as an extension of work and done almost as a matter of course, it was not unusual for new employees to be invited along by senior colleagues.","At drinking parties, people can open up about honest feelings that are hard to voice at the workplace. They can also talk to their bosses more casually than in a meeting room. For this reason, quite a few people regard nominication as a valuable chance to deepen relationships. After all, the loosening effect of alcohol can close the distance between people and sometimes help work go more smoothly.","On the other hand, more and more young people think, \"I want to use my time after work for myself.\" For them, how to spend time outside working hours should be decided freely by the individual. Even so, quite a few people feel strong resistance to being effectively forced to attend. Refusing might make them look unsociable, so some have no choice but to attend against their wishes.","As working styles and values become more diverse, nominication may also be gradually changing. The fact that more young people today want to keep work and private life clearly separate is probably a sign of this. Being able to build trust through everyday conversation, without relying on alcohol, can be said to be the ideal."],"vocab":[{"w":"同僚","r":"どうりょう","m":"同事","m_en":"colleague"},{"w":"習慣","r":"しゅうかん","m":"習慣","m_en":"custom, habit"},{"w":"本音","r":"ほんね","m":"真心話","m_en":"true feelings"},{"w":"打ち明ける","r":"うちあける","m":"坦白說出、吐露","m_en":"to confide, to open up"},{"w":"貴重","r":"きちょう","m":"寶貴的","m_en":"valuable, precious"},{"w":"強制","r":"きょうせい","m":"強制","m_en":"compulsion, forcing"},{"w":"抵抗","r":"ていこう","m":"抗拒、排斥","m_en":"resistance, reluctance"},{"w":"不本意","r":"ふほんい","m":"心不甘情不願","m_en":"against one's wishes"},{"w":"多様化","r":"たようか","m":"多元化","m_en":"diversification"},{"w":"信頼関係","r":"しんらいかんけい","m":"信賴關係","m_en":"relationship of trust"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某件事的變化,另一件事也同時變化。例:「働き方や価値観が多様化するのに伴って、飲みニケーションのあり方も少しずつ変わりつつあるのかもしれない」","t_en":"〜に伴って","note_en":"As one thing changes, another changes along with it. Example: 「働き方や価値観が多様化するのに伴って、飲みニケーションのあり方も少しずつ変わりつつあるのかもしれない」"},{"t":"〜ざるを得ない","note":"表示雖不願意,但情況使然,只能那樣做。例:「断れば付き合いが悪いと見られかねず、不本意ながら出席せざるを得ない人もいる」","t_en":"〜ざるを得ない","note_en":"To have no choice but to do something, even if unwilling. Example: 「断れば付き合いが悪いと見られかねず、不本意ながら出席せざるを得ない人もいる」","id":"n2-35"},{"t":"〜に対して","note":"表示針對某個對象的態度或行為。例:「参加を事実上強制されることに対して、強い抵抗を感じる人も決して少なくない」","t_en":"〜に対して","note_en":"Toward, in response to a target. Example: 「参加を事実上強制されることに対して、強い抵抗を感じる人も決して少なくない」","id":"n3-2"},{"t":"〜かねない","note":"表示有可能發生不好的結果(動詞ます形去ます+かねない)。例:「断れば付き合いが悪いと見られかねず、不本意ながら出席せざるを得ない人もいる」","t_en":"〜かねない","note_en":"There is a risk that something undesirable may happen. Example: 「断れば付き合いが悪いと見られかねず、不本意ながら出席せざるを得ない人もいる」","id":"n2-38"}]},
{"id":"a-n3-5-n4","variant_of":"a-n3-5","level":"n4","topic":"職場","topic_en":"Workplace","title":"飲みニケーション","title_zh":"喝酒交際文化","title_en":"Nomunication: Drinking Culture at Work","body":"日本の会社では、仕事のあとによく同僚とお酒を飲みに行きます。上司といっしょに行くこともあります。これを「飲みニケーション」と言います。\nお酒を飲むと、ふだんは言いにくいことが話せます。上司とも気軽に話せるので、楽しいと思う人もいます。人と人の関係が深くなる良い機会だと考える人も多いです。\n若い人の中には、仕事のあとは自分の時間を大切にしたい人が増えています。無理に行かされるのは、いやだと思う人も少なくありません。働き方や考え方が変わって、飲み会も少しずつ変わりそうです。お酒がなくても、ふだんの会話で信頼を作れるのがいちばんです。","trans":["在日本的公司,下班後常常和同事去喝酒。有時也會和上司一起去。這種文化叫做「喝酒溝通(飲みニケーション)」。","喝了酒之後,能說出平常很難說出口的話。因為能和上司輕鬆交談,所以也有人覺得很開心。很多人認為這是讓人與人之間關係變深的好機會。","年輕人當中,想珍惜下班後自己時間的人變多了。被勉強去參加,覺得討厭的人也不少。隨著工作方式和想法改變,聚餐也好像會一點一點改變。就算沒有酒,能在平常的對話中建立信任,是最好的。"],"trans_en":["In Japanese companies, people often go drinking with coworkers after work. Sometimes they go with their boss too. This is called \"nomunication.\"","When you drink, you can say things that are usually hard to say. You can also talk easily with your boss, so some people enjoy it. Many people think it is a good chance to build deeper relationships.","Among young people, more and more want to value their own time after work. Many also dislike being forced to go. As ways of working and thinking change, drinking parties seem likely to change little by little. Even without alcohol, the best thing is to build trust through everyday conversation."],"vocab":[{"w":"同僚","r":"どうりょう","m":"同事","m_en":"coworker"},{"w":"上司","r":"じょうし","m":"上司、主管","m_en":"boss, superior"},{"w":"気軽に","r":"きがるに","m":"輕鬆地、不拘謹地","m_en":"casually, without hesitation"},{"w":"関係","r":"かんけい","m":"關係","m_en":"relationship"},{"w":"機会","r":"きかい","m":"機會","m_en":"chance, opportunity"},{"w":"大切にする","r":"たいせつにする","m":"珍惜、重視","m_en":"to value, to take care of"},{"w":"増えて","r":"ふえて","m":"增加(増える的て形)","m_en":"to increase (te-form of 増える)"},{"w":"無理に","r":"むりに","m":"勉強地、硬是","m_en":"forcibly, against one's will"},{"w":"変わって","r":"かわって","m":"改變(変わる的て形)","m_en":"to change (te-form of 変わる)"},{"w":"信頼","r":"しんらい","m":"信任","m_en":"trust"}],"grammar":[{"t":"〜と(條件)","note":"表示「一做A,就自然會B」。例:「お酒を飲むと、ふだんは言いにくいことが話せます」。","t_en":"〜to (conditional)","note_en":"Means \"when A happens, B naturally follows.\" Example: 「お酒を飲むと、ふだんは言いにくいことが話せます」."},{"w":"","t":"〜ので","note":"表示原因、理由,語氣比「から」柔和。例:「上司とも気軽に話せるので、楽しいと思う人もいます」。","t_en":"〜node","note_en":"Gives a reason, softer than から. Example: 「上司とも気軽に話せるので、楽しいと思う人もいます」."},{"t":"可能形","note":"表示「能夠做~」。例:「ふだんは言いにくいことが話せます」「信頼を作れるのがいちばんです」。","t_en":"Potential form","note_en":"Expresses ability or possibility. Examples: 「ふだんは言いにくいことが話せます」 and 「信頼を作れるのがいちばんです」.","id":"n4-52"},{"t":"〜そうです(樣態)","note":"動詞ます形去ます+そうです,表示根據現況推測「好像會~」。例:「飲み会も少しずつ変わりそうです」。","t_en":"〜sou desu (appearance)","note_en":"Verb stem + そうです means \"looks like it will…\" based on what you see. Example: 「飲み会も少しずつ変わりそうです」."}]},
{"id":"a-n3-6-n2","variant_of":"a-n3-6","level":"n2","topic":"文化","topic_en":"Culture","title":"日本の四季と年中行事","title_zh":"日本的四季與節慶","title_en":"The Four Seasons and Annual Events in Japan","body":"日本には春夏秋冬という四つの季節があり、それぞれの季節にふさわしい行事が今日でも大切に受けつがれている。四季の移り変わりがはっきりしているため、人々は昔から自然の変化に合わせて暮らしのリズムを整えてきた。行事はそうした暮らしの知恵が形になったものであり、季節ごとの楽しみ方にも違いが見られる。\n春は桜の季節で、人々は公園に集まり、花の下で食事をしながら春の訪れを祝うのが恒例となっている。寒い冬が終わったことへの喜びも重なって、花見は単なる食事会という以上に特別な意味を持つ行事だと言えるだろう。夏になると、各地で祭りや花火大会が開かれ、浴衣を着た人々で街じゅうがにぎわう。夏の行事は、季節ならではの華やかさと活気を街にもたらしていると言っても過言ではない。\n秋は「食欲の秋」「読書の秋」とも言われ、涼しくなった空気の中で紅葉を楽しむ人が多い。暑さが和らぐにつれて、人々は食事や読書など、それぞれの好みに合わせて穏やかな時間を過ごすようになる。冬には正月があり、家族が集まっておせち料理を食べ、神社へ初詣に出かけるのが一般的である。忙しい日常から離れ、新しい一年の始まりを家族とともに迎えることが、正月の大きな意味だと考えられる。\nこうした行事は、季節の変化を肌で感じるだけでなく、家族や地域の人とのつながりを確かめる貴重な機会にもなっている。生活が便利になるに伴って、季節を意識しなくても暮らせるようになったが、行事の価値は失われていない。便利さの中でも自然のリズムを大切にする心は、これからも世代を超えて受けつがれていくだろう。","trans":["日本有春夏秋冬四個季節,配合各個季節的節慶至今仍被珍視並傳承下來。由於四季更迭分明,人們自古以來就配合自然的變化來調整生活的節奏。節慶正是這種生活智慧具體化的產物,各季節的享受方式也各有不同。","春天是櫻花的季節,人們聚集在公園,在花下一邊用餐一邊慶祝春天的到來,已成為慣例。再加上寒冬結束的喜悅,賞花可以說是比單純的聚餐更具特別意義的節慶。一到夏天,各地會舉辦祭典和煙火大會,穿著浴衣的人們讓整座城市熱鬧非凡。說夏季的節慶為街頭帶來了這個季節獨有的華麗與活力,也毫不為過。","秋天也被稱為「食慾之秋」「讀書之秋」,許多人在轉涼的空氣中欣賞紅葉。隨著暑氣漸退,人們會依各自的喜好,透過用餐或閱讀等方式度過悠閒的時光。冬天有新年,家人聚在一起吃御節料理、前往神社初詣參拜,是很普遍的做法。離開忙碌的日常,與家人一同迎接新的一年,可以說是新年的重要意義。","這些節慶不僅讓人親身感受季節的變化,也是確認與家人及地方上人們之間連結的寶貴機會。隨著生活愈來愈便利,即使不留意季節也能過日子,但節慶的價值並沒有因此消失。即使身處便利的生活,珍惜自然節奏的心,想必今後也會跨越世代繼續傳承下去。"],"trans_en":["Japan has four seasons, spring, summer, autumn and winter, and events suited to each season are still cherished and handed down today. Because the changes of the seasons are so distinct, people have long adjusted the rhythm of their lives to the changes in nature. These events are the form that such everyday wisdom has taken, and the way of enjoying each season differs as well.","Spring is the cherry blossom season, and it has become customary for people to gather in parks and celebrate the arrival of spring by eating under the flowers. Combined with the joy of the cold winter ending, flower viewing can be said to be an event with a special meaning that goes beyond a mere meal together. When summer comes, festivals and fireworks displays are held in various places, and towns bustle with people in yukata. It is no exaggeration to say that summer events bring the glamour and liveliness unique to the season to the streets.","Autumn is also called the autumn of appetite and the autumn of reading, and many people enjoy the autumn leaves in the cooler air. As the heat eases, people spend calm time according to their own tastes, such as eating good food or reading. In winter there is New Year, and it is common for families to gather, eat osechi cuisine, and visit a shrine for the first visit of the year. Leaving behind a busy daily routine and welcoming the new year together with family can be considered a major meaning of New Year.","These events are not only a way to feel the change of the seasons but also a valuable opportunity to reaffirm bonds with family and the local community. As life becomes more convenient, it has become possible to live without paying attention to the seasons, but the value of these events has not been lost. Even amid convenience, the heart that values the rhythm of nature will surely continue to be passed down across generations."],"vocab":[{"w":"受けつがれる","r":"うけつがれる","m":"被繼承、被傳承","m_en":"to be inherited, to be handed down"},{"w":"移り変わり","r":"うつりかわり","m":"變遷、更迭","m_en":"change, transition"},{"w":"整える","r":"ととのえる","m":"調整、整頓","m_en":"to arrange, to adjust"},{"w":"訪れ","r":"おとずれ","m":"到來","m_en":"arrival, coming"},{"w":"恒例","r":"こうれい","m":"慣例、固定舉行","m_en":"customary practice, annual tradition"},{"w":"にぎわう","r":"にぎわう","m":"熱鬧、繁盛","m_en":"to bustle, to be lively"},{"w":"過言","r":"かごん","m":"說得過頭、誇大","m_en":"exaggeration"},{"w":"和らぐ","r":"やわらぐ","m":"緩和、變得柔和","m_en":"to ease, to soften"},{"w":"初詣","r":"はつもうで","m":"新年第一次參拜神社","m_en":"first shrine visit of the new year"},{"w":"貴重","r":"きちょう","m":"珍貴、寶貴","m_en":"valuable, precious"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某個變化,另一件事也跟著變化。例:「生活が便利になるに伴って、季節を意識しなくても暮らせるようになったが、行事の價値は失われていない」的前半部,說明生活變便利的同時,生活方式也隨之改變。","t_en":"〜に伴って","note_en":"Means that as one thing changes, something else changes along with it. Example: 「生活が便利になるに伴って、季節を意識しなくても暮らせるようになった」 (As life became more convenient, it became possible to live without minding the seasons)."},{"t":"〜につれて","note":"表示隨著前項的進展,後項也逐漸變化,多用於漸進的變化。例:「暑さが和らぐにつれて、人々は食事や読書など、それぞれの好みに合わせて穏やかな時間を過ごすようになる」。","t_en":"〜につれて","note_en":"Indicates that as the first change progresses, the second changes gradually. Example: 「暑さが和らぐにつれて、人々は…穏やかな時間を過ごすようになる」 (As the heat eases, people come to spend calm time).","id":"n2-54"},{"t":"〜と言っても過言ではない","note":"表示「就算這樣說也不誇張」,用來強調自己的主張。例:「夏の行事は、季節ならではの華やかさと活気を街にもたらしていると言っても過言ではない」。","t_en":"〜と言っても過言ではない","note_en":"Means 'it is no exaggeration to say…', used to emphasize a claim. Example: 「…活気を街にもたらしていると言っても過言ではない」 (It is no exaggeration to say that they bring liveliness to the streets)."},{"t":"〜という以上に","note":"表示「超出……的程度」,指某事物的意義不只如此。例:「花見は単なる食事会という以上に特別な意味を持つ行事だと言えるだろう」。","t_en":"〜という以上に","note_en":"Means 'more than…', showing that something has greater significance than the label suggests. Example: 「花見は単なる食事会という以上に特別な意味を持つ行事だと言えるだろう」 (Flower viewing is an event with more meaning than a mere meal together)."}]},
{"id":"a-n3-6-n4","variant_of":"a-n3-6","level":"n4","topic":"文化","topic_en":"Culture","title":"日本の四季と年中行事","title_zh":"日本的四季與節慶","title_en":"The Four Seasons and Annual Events in Japan","body":"日本には四つの季節があって、それぞれに行事があります。春は桜の季節で、人々は公園に集まります。花の下でご飯を食べながら、春が来たことを祝います。\n夏になると、いろいろな所で祭りや花火大会があります。浴衣を着た人がたくさん来て、とてもにぎやかです。秋は「食欲の秋」や「読書の秋」と言われています。涼しくなったので、紅葉を見て楽しむ人が多いです。\n冬には正月があり、家族が集まっておせち料理を食べます。そして、神社に初詣に行く人も多いです。こうした行事は、季節の変化や家族とのつながりを感じる機会です。便利な生活の中でも、自然を大切にする心はずっと続くでしょう。","trans":["日本有四個季節,每個季節都有各自的節慶。春天是櫻花的季節,人們會聚集到公園。大家在花下一邊吃飯,一邊慶祝春天到來。","一到夏天,各地都有祭典和煙火大會。穿著浴衣的人來了很多,非常熱鬧。秋天被稱為「食慾之秋」和「讀書之秋」。因為天氣變涼了,很多人會去賞紅葉。","冬天有新年,家人聚在一起吃御節料理。然後,也有很多人會去神社初詣參拜。這些節慶是讓人感受季節變化與家人連結的機會。即使在便利的生活中,珍惜自然的心想必也會一直延續下去。"],"trans_en":["Japan has four seasons, and each one has its own events. Spring is the season of cherry blossoms, and people gather in parks. They eat meals under the flowers and celebrate the arrival of spring.","When summer comes, there are festivals and fireworks shows in many places. Many people come in yukata, and it is very lively. Autumn is called the autumn of appetite and the autumn of reading. Because it gets cooler, many people enjoy looking at the autumn leaves.","In winter there is the New Year, and families gather to eat osechi food. Many people also go to a shrine for the first visit of the year. These events are a chance to feel the changing seasons and ties with family. Even in a convenient life, the heart that values nature will probably continue for a long time."],"vocab":[{"w":"季節","r":"きせつ","m":"季節","m_en":"season"},{"w":"行事","r":"ぎょうじ","m":"活動、節慶","m_en":"event, ceremony"},{"w":"集まる","r":"あつまる","m":"聚集","m_en":"to gather"},{"w":"祝う","r":"いわう","m":"慶祝","m_en":"to celebrate"},{"w":"祭り","r":"まつり","m":"祭典","m_en":"festival"},{"w":"浴衣","r":"ゆかた","m":"浴衣(夏季和服)","m_en":"yukata, summer kimono"},{"w":"紅葉","r":"こうよう","m":"紅葉","m_en":"autumn leaves"},{"w":"涼しい","r":"すずしい","m":"涼爽的","m_en":"cool"},{"w":"正月","r":"しょうがつ","m":"新年","m_en":"New Year"},{"w":"機会","r":"きかい","m":"機會","m_en":"chance, opportunity"}],"grammar":[{"t":"〜ながら","note":"表示同時進行兩個動作,動詞ます形去ます加ながら。例:「花の下でご飯を食べながら、春が来たことを祝います」","t_en":"~nagara","note_en":"Shows two actions happening at the same time. Example: 「花の下でご飯を食べながら、春が来たことを祝います」","id":"n5-58"},{"t":"〜と(〜なると)","note":"表示一旦遇到某情況,就會有某結果,多用於自然或固定的事。例:「夏になると、いろいろな所で祭りや花火大会があります」","t_en":"~to (~naru to)","note_en":"Means when or once something happens, a certain result follows. Example: 「夏になると、いろいろな所で祭りや花火大会があります」"},{"t":"〜と言われている","note":"表示「被人們說成是…」,用來介紹一般的說法。例:「秋は「食欲の秋」や「読書の秋」と言われています」","t_en":"~to iwarete iru","note_en":"Means it is said or called that. Used for common sayings. Example: 「秋は「食欲の秋」や「読書の秋」と言われています」"},{"t":"〜でしょう","note":"表示推測,「大概會…吧」。例:「自然を大切にする心はずっと続くでしょう」","t_en":"~deshou","note_en":"Expresses a guess, meaning probably. Example: 「自然を大切にする心はずっと続くでしょう」","id":"n5-60"}]},
{"id":"a-n3-7-n2","variant_of":"a-n3-7","level":"n2","topic":"生活","topic_en":"Daily Life","title":"熱中症への備えを考える","title_zh":"思考如何預防中暑","title_en":"Preparing for Heatstroke","body":"近年、地球温暖化の影響もあって、日本の夏は年々厳しさを増している。特に七月から八月にかけては、気温が三十五度を超える猛暑日も決して珍しくなくなった。\nこうした暑さに伴って、毎年問題になるのが熱中症である。体内の水分や塩分のバランスが崩れると、めまいや頭痛を引き起こし、重症化した場合には命に関わる事態にもなりかねない。\n予防の基本は、のどがかわく前にこまめに水分を補給することだ。それに加えて、気温の高い時間帯の外出はできるだけ控え、エアコンを適切に使って室温を調整することも欠かせない。\n一方で、「自分はまだ大丈夫」という思い込みが、かえって危険を招くことも少なくない。症状は本人が自覚しないうちに進むとは限らないが、気づいたときには手遅れということもあるため、周囲の人と声をかけ合う習慣が重要になる。互いに気を配りながら、この厳しい夏を無理なく乗り越えていきたい。","trans":["近年來,受到全球暖化等影響,日本的夏天一年比一年嚴峻。尤其是七月到八月之間,氣溫超過三十五度的酷暑日已經不再罕見。","隨著這樣的高溫,每年都會成為問題的就是中暑。體內水分與鹽分的平衡一旦失調,就會引發頭暈、頭痛,病情加重時甚至可能演變成危及性命的狀況。","預防的基本原則,是在口渴之前就勤加補充水分。除此之外,盡量避免在氣溫高的時段外出,並適當使用冷氣調節室溫,也是不可或缺的。","另一方面,「我還沒事」這種自以為是的想法,反而經常招來危險。症狀不見得是在本人沒察覺的情況下惡化,但也有等到發現時已經太遲的情形,因此與周遭的人互相提醒的習慣就顯得重要。讓我們彼此關照,不勉強地度過這個嚴酷的夏天。"],"trans_en":["In recent years, partly due to global warming, summers in Japan have grown harsher year by year. Especially from July to August, extremely hot days with temperatures above 35 degrees are no longer rare.","Accompanying this heat, the problem that arises every year is heatstroke. When the balance of water and salt in the body is disrupted, it causes dizziness and headaches, and in severe cases it can even become life-threatening.","The basics of prevention are to replenish fluids frequently before you become thirsty. In addition, refraining from going out during the hottest hours as much as possible and adjusting room temperature by using air conditioning properly are also essential.","On the other hand, the assumption that \"I'm still fine\" often invites danger instead. Symptoms do not necessarily progress without the person noticing, but there are cases where it is too late by the time they realize, so the habit of checking in with those around you is important. Let us look out for one another and get through this harsh summer without overexerting ourselves."],"vocab":[{"w":"年々","r":"ねんねん","m":"逐年、一年比一年","m_en":"year by year"},{"w":"猛暑日","r":"もうしょび","m":"酷暑日(最高氣溫35度以上)","m_en":"extremely hot day"},{"w":"崩れる","r":"くずれる","m":"失去平衡、崩壞","m_en":"to be disrupted, to collapse"},{"w":"引き起こす","r":"ひきおこす","m":"引起、導致","m_en":"to cause, to bring about"},{"w":"重症化","r":"じゅうしょうか","m":"重症化、病情惡化","m_en":"becoming severe"},{"w":"補給","r":"ほきゅう","m":"補充","m_en":"replenishment, supply"},{"w":"控える","r":"ひかえる","m":"節制、避免","m_en":"to refrain from"},{"w":"欠かせない","r":"かかせない","m":"不可或缺的","m_en":"indispensable"},{"w":"思い込み","r":"おもいこみ","m":"自以為、先入為主的想法","m_en":"assumption, preconception"},{"w":"手遅れ","r":"ておくれ","m":"為時已晚","m_en":"too late"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某事物的變化,另一件事也跟著發生。例:「こうした暑さに伴って、毎年問題になるのが熱中症である」","t_en":"〜に伴って","note_en":"Indicates that as one thing changes, another occurs along with it. Example: 「こうした暑さに伴って、毎年問題になるのが熱中症である」"},{"t":"〜かねない","note":"接動詞ます形語幹,表示有可能發生不好的結果。例:「命に関わる事態にもなりかねない」","t_en":"〜かねない","note_en":"Attaches to the verb stem; indicates a possible undesirable outcome. Example: 「命に関わる事態にもなりかねない」","id":"n2-38"},{"t":"〜とは限らない","note":"表示不一定、未必如此,用來否定全面性的判斷。例:「症状は本人が自覚しないうちに進むとは限らない」","t_en":"〜とは限らない","note_en":"Means 'not necessarily'; denies a blanket generalization. Example: 「症状は本人が自覚しないうちに進むとは限らない」","id":"n2-58"},{"t":"〜に加えて","note":"表示在原有事項之外再追加其他事項。例:「それに加えて、気温の高い時間帯の外出はできるだけ控え」","t_en":"〜に加えて","note_en":"Means 'in addition to'; adds another item to what was already stated. Example: 「それに加えて、気温の高い時間帯の外出はできるだけ控え」"}]},
{"id":"a-n3-7-n4","variant_of":"a-n3-7","level":"n4","topic":"生活","topic_en":"Daily Life","title":"熱中症に気をつけて","title_zh":"小心中暑","title_en":"Watch Out for Heatstroke","body":"最近、日本の夏はとても暑くなっている。七月と八月は、気温が三十五度より高い日もある。\nこんな暑い日に気をつけたいのが、熱中症だ。体の水が足りなくなると、頭が痛くなったり、ふらふらしたりする。ひどい時は、命があぶなくなることもある。\n熱中症を防ぐために、のどがかわく前に水を飲むようにする。暑い時間は、できるだけ外に出ないほうがいい。エアコンを上手に使うことも大切だ。「まだ大丈夫」と思っても、体が悪くなることがある。まわりの人と声をかけ合って、元気に夏をすごそう。","trans":["最近,日本的夏天變得非常熱。七月和八月,也有氣溫高於三十五度的日子。","在這樣的大熱天裡,要特別小心的就是中暑。身體的水分不足時,會頭痛、頭暈搖晃。嚴重時,甚至可能有生命危險。","為了預防中暑,要在口渴之前就喝水。炎熱的時段,盡量不要出門比較好。善用冷氣也很重要。即使覺得「我還沒事」,身體也可能變差。和周遭的人互相提醒,有精神地度過夏天吧。"],"trans_en":["Recently, summers in Japan have become very hot. In July and August, there are even days when the temperature is higher than 35 degrees.","On such hot days, the thing to be careful about is heatstroke. When your body does not have enough water, your head hurts and you feel dizzy. In bad cases, your life can even be in danger.","To prevent heatstroke, try to drink water before you get thirsty. It is better not to go outside during the hottest hours if you can. Using the air conditioner well is also important. Even if you think you are still fine, your body can get worse. Let's talk to the people around us and get through the summer in good health."],"vocab":[{"w":"気温","r":"きおん","m":"氣溫","m_en":"air temperature"},{"w":"熱中症","r":"ねっちゅうしょう","m":"中暑","m_en":"heatstroke"},{"w":"足りなくなる","r":"たりなくなる","m":"變得不足","m_en":"to run short"},{"w":"頭","r":"あたま","m":"頭","m_en":"head"},{"w":"命","r":"いのち","m":"生命","m_en":"life"},{"w":"防ぐ","r":"ふせぐ","m":"預防","m_en":"to prevent"},{"w":"外","r":"そと","m":"外面","m_en":"outside"},{"w":"上手","r":"じょうず","m":"擅長、好好地","m_en":"skillful, well"},{"w":"大切","r":"たいせつ","m":"重要","m_en":"important"},{"w":"元気","r":"げんき","m":"有精神","m_en":"healthy, energetic"}],"grammar":[{"t":"〜たり〜たりする","note":"列舉幾個動作或狀態。例:「頭が痛くなったり、ふらふらしたりする」","t_en":"~tari ~tari suru","note_en":"Lists example actions or states. Example: 「頭が痛くなったり、ふらふらしたりする」"},{"t":"〜ようにする","note":"表示努力養成習慣、盡量去做。例:「のどがかわく前に水を飲むようにする」","t_en":"~you ni suru","note_en":"Means to make an effort to do something or make it a habit. Example: 「のどがかわく前に水を飲むようにする」","id":"n3-39"},{"t":"〜ないほうがいい","note":"建議對方不要做某事。例:「できるだけ外に出ないほうがいい」","t_en":"~nai hou ga ii","note_en":"Advises someone not to do something. Example: 「できるだけ外に出ないほうがいい」"},{"t":"〜と(條件)","note":"前面的事發生,就自然出現後面的結果。例:「体の水が足りなくなると、頭が痛くなったり」","t_en":"~to (conditional)","note_en":"When the first thing happens, the second naturally follows. Example: 「体の水が足りなくなると、頭が痛くなったり」"}]},
{"id":"a-n4-1-n2","variant_of":"a-n4-1","level":"n2","topic":"文化","topic_en":"Culture","title":"お花見――日本の春を彩る習慣","title_zh":"賞櫻——點綴日本春天的習慣","title_en":"Hanami: A Custom That Colors Japan's Spring","body":"春になると、日本各地で桜が一斉に咲き始め、街全体が淡い桃色に包まれるようになります。人々は公園などに集まり、桜の下でお弁当を食べたりお酒を飲んだりしながら、春の訪れを祝います。こうした習慣は「お花見」と呼ばれ、日本の春を代表する行事として広く親しまれています。\n桜は非常に美しい花ですが、満開になってから散るまでの期間は一週間ほどと短いのが特徴です。咲いている期間が限られているからこそ、多くの人がこの時期を毎年心待ちにしているのです。夜になると、ライトアップされた桜が昼間とは違った幻想的な雰囲気を見せてくれます。機会があれば、ぜひ一度実際に足を運んで、その美しさを自分の目で確かめてみてください。\nお花見の習慣は古くから続いており、昔の人々もまた桜を眺めながら春の到来を楽しんでいました。時代が変わっても、桜に季節の移ろいを感じる気持ちは、今も昔も変わらないのかもしれません。桜が人々に愛され続けてきた背景には、こうした日本人の自然に対する感性があると言えるでしょう。\nただし、お花見が盛んになるに伴って、場所取りやゴミの問題も目立つようになってきました。楽しい行事であっても、周りの人への配慮を欠けば、トラブルにつながりかねません。誰もが気持ちよく春を楽しむためには、マナーを守ることが何より大切だと言えます。","trans":["一到春天,日本各地的櫻花便一齊開始綻放,整座城市都被淡淡的粉紅色包圍。人們聚集在公園等地,在櫻花樹下一邊吃便當、喝酒,一邊慶祝春天的到來。這樣的習慣被稱為「賞櫻」,是廣受大家喜愛、代表日本春天的活動。","櫻花是非常美麗的花,但從盛開到凋謝的期間只有一週左右,相當短暫,這是它的特色。正因為花期有限,許多人每年都滿心期待這個時節。到了夜晚,打上燈光的櫻花會展現出與白天不同的夢幻氛圍。如果有機會,請務必親自去一趟,用自己的眼睛確認它的美。","賞櫻的習慣自古延續至今,以前的人們同樣也是一邊欣賞櫻花,一邊享受春天的到來。即使時代改變,從櫻花感受季節更迭的心情,或許仍和從前一樣沒有改變。櫻花之所以持續受到人們喜愛,背後可以說正是日本人對自然的這份感性。","不過,隨著賞櫻愈來愈盛行,佔位子和垃圾的問題也變得愈來愈明顯。即使是愉快的活動,若缺乏對周遭人的體貼,也可能演變成糾紛。為了讓每個人都能舒適地享受春天,遵守禮儀可說是比什麼都重要。"],"trans_en":["When spring arrives, cherry blossoms begin to bloom all at once across Japan, and entire towns are wrapped in a pale pink. People gather in parks and other places, eating bento and drinking sake under the trees as they celebrate the coming of spring. This custom is called hanami, and it is widely loved as an event that represents Japan's spring.","Cherry blossoms are extremely beautiful, but the time from full bloom to falling is short, only about a week. Precisely because the blooming period is limited, many people look forward to this season every year. At night, illuminated cherry blossoms show a dreamlike atmosphere different from the daytime. If you have the chance, please go and see their beauty with your own eyes.","The custom of hanami has continued since ancient times, and people of the past also enjoyed the arrival of spring while gazing at the blossoms. Even as times change, the feeling of sensing the changing seasons through cherry blossoms may be the same now as it was then. One could say that this Japanese sensitivity toward nature lies behind why cherry blossoms have continued to be loved.","However, as hanami has become more popular, problems such as reserving spots and littering have become more noticeable. Even an enjoyable event can lead to trouble if consideration for those around you is lacking. For everyone to enjoy spring comfortably, it can be said that observing good manners matters above all."],"vocab":[{"w":"淡い","r":"あわい","m":"淡的、淺的","m_en":"pale, light (color)"},{"w":"訪れ","r":"おとずれ","m":"到來、造訪","m_en":"arrival, coming"},{"w":"満開","r":"まんかい","m":"盛開","m_en":"full bloom"},{"w":"幻想的","r":"げんそうてき","m":"夢幻的、如幻境般的","m_en":"dreamlike, fantastical"},{"w":"足を運ぶ","r":"あしをはこぶ","m":"特地前往、親自去","m_en":"to go in person, to make the trip"},{"w":"移ろい","r":"うつろい","m":"變遷、更迭","m_en":"change, passing (of seasons)"},{"w":"感性","r":"かんせい","m":"感性、感受力","m_en":"sensibility, sensitivity"},{"w":"場所取り","r":"ばしょとり","m":"佔位子","m_en":"reserving a spot"},{"w":"配慮","r":"はいりょ","m":"體貼、顧慮","m_en":"consideration, thoughtfulness"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某事物的變化,另一件事也跟著變化。文中例句:「お花見が盛んになるに伴って、場所取りやゴミの問題も目立つようになってきました」","t_en":"〜に伴って","note_en":"Indicates that as one thing changes, another changes along with it. Example: 「お花見が盛んになるに伴って、場所取りやゴミの問題も目立つようになってきました」"},{"t":"〜かねない","note":"表示可能發生不好的結果,多用於負面事態。文中例句:「周りの人への配慮を欠けば、トラブルにつながりかねません」","t_en":"〜かねない","note_en":"Expresses a risk that something undesirable might happen. Example: 「周りの人への配慮を欠けば、トラブルにつながりかねません」","id":"n2-38"},{"t":"〜からこそ","note":"強調正是因為這個理由,才有後面的結果。文中例句:「咲いている期間が限られているからこそ、多くの人がこの時期を毎年心待ちにしているのです」","t_en":"〜からこそ","note_en":"Emphasizes that precisely because of this reason, the result follows. Example: 「咲いている期間が限られているからこそ、多くの人がこの時期を毎年心待ちにしているのです」","id":"n2-9"},{"t":"〜に対する","note":"表示感情、態度或行為所針對的對象,修飾後面的名詞。文中例句:「日本人の自然に対する感性があると言えるでしょう」","t_en":"〜に対する","note_en":"Marks the target of a feeling, attitude, or action, modifying a following noun. Example: 「日本人の自然に対する感性があると言えるでしょう」"}]},
{"id":"a-n4-1-n3","variant_of":"a-n4-1","level":"n3","topic":"文化","topic_en":"Culture","title":"お花見","title_zh":"賞櫻","title_en":"Hanami: Cherry Blossom Viewing","body":"春になると、日本のあちこちで桜が咲き始め、町全体が明るい雰囲気に包まれます。人々は公園に集まって、桜の下でお弁当を食べたり、お酒を飲んだりして楽しみます。このように桜を見ながら過ごすことを「お花見」と言います。\n桜はとても美しいですが、咲いている期間は一週間ぐらいしかありません。そのため、多くの人がこの時期を心待ちにしているのです。\n夜になると、ライトアップされた桜も昼とは違った美しさを見せてくれます。もし機会があれば、ぜひ一度、昼と夜の両方の桜を見に行ってみてください。\nお花見の習慣は古くから続いており、昔の人も桜を見て春の訪れを楽しんでいました。今も昔も、桜は人々に春を感じさせてくれる特別な存在だと言えるでしょう。ただ、場所取りやゴミの問題もあるため、周りの人への配慮が欠かせません。誰もが気持ちよく楽しめるように、マナーを守ることが大切です。","trans":["一到春天,日本各地的櫻花就開始綻放,整座城市都籠罩在明亮的氛圍中。人們聚集到公園,在櫻花樹下吃便當、喝酒,盡情享受。像這樣一邊賞櫻一邊度過時光,就叫做「お花見」(賞櫻)。","櫻花非常美麗,但開花的期間只有一週左右。正因如此,許多人都很期待這個時節的到來。","到了夜晚,打上燈光的櫻花也展現出和白天不同的美。如果有機會,請務必去看一次,白天和夜晚的櫻花都看看。","賞櫻的習慣從很久以前就延續至今,以前的人也是看著櫻花來享受春天的到來。無論現在還是過去,櫻花都可以說是讓人感受到春天的特別存在。不過,因為也有佔位子和垃圾的問題,所以顧慮周圍的人是不可或缺的。為了讓每個人都能舒服地享受賞櫻,遵守禮儀很重要。"],"trans_en":["When spring comes, cherry blossoms begin to bloom all over Japan, and whole towns are wrapped in a bright atmosphere. People gather in parks and enjoy eating bento and drinking alcohol under the cherry trees. Spending time this way while looking at the blossoms is called \"hanami.\"","Cherry blossoms are very beautiful, but they bloom for only about a week. For that reason, many people look forward to this season.","At night, illuminated cherry blossoms show a different kind of beauty from the daytime. If you have the chance, please go at least once and see them both by day and by night.","The custom of hanami has continued since long ago, and people in the past also enjoyed the arrival of spring by looking at cherry blossoms. Then and now, cherry blossoms can be said to be something special that lets people feel spring. However, because there are also problems such as saving spots and litter, consideration for those around you is essential. So that everyone can enjoy themselves comfortably, it is important to follow good manners."],"vocab":[{"w":"包まれる","r":"つつまれる","m":"被包圍、籠罩","m_en":"to be wrapped in, enveloped"},{"w":"集まる","r":"あつまる","m":"聚集","m_en":"to gather"},{"w":"期間","r":"きかん","m":"期間","m_en":"period, duration"},{"w":"心待ち","r":"こころまち","m":"期待、盼望","m_en":"eager anticipation"},{"w":"美しさ","r":"うつくしさ","m":"美麗、美","m_en":"beauty"},{"w":"習慣","r":"しゅうかん","m":"習慣、習俗","m_en":"custom, habit"},{"w":"訪れ","r":"おとずれ","m":"到來","m_en":"arrival, coming"},{"w":"場所取り","r":"ばしょとり","m":"佔位子","m_en":"saving a spot"},{"w":"配慮","r":"はいりょ","m":"顧慮、體貼","m_en":"consideration"},{"w":"欠かせない","r":"かかせない","m":"不可或缺的","m_en":"indispensable"}],"grammar":[{"t":"〜たり〜たりする","note":"列舉幾個動作,表示做了這些事等。例:「お弁当を食べたり、お酒を飲んだりして楽しみます」","t_en":"~tari ~tari suru","note_en":"Lists several example actions. e.g. 「お弁当を食べたり、お酒を飲んだりして楽しみます」"},{"t":"〜ながら","note":"表示同時進行兩個動作。例:「このように桜を見ながら過ごすことを」","t_en":"~nagara","note_en":"Two actions at the same time. e.g. 「このように桜を見ながら過ごすことを」","id":"n5-58"},{"t":"〜ため","note":"表示原因、理由,語氣比「から」更書面。例:「場所取りやゴミの問題もあるため」","t_en":"~tame","note_en":"Indicates a reason, more formal than kara. e.g. 「場所取りやゴミの問題もあるため」"},{"t":"〜ように","note":"表示目的,為了讓某個狀態能實現。例:「誰もが気持ちよく楽しめるように」","t_en":"~you ni","note_en":"Expresses a purpose, so that something can happen. e.g. 「誰もが気持ちよく楽しめるように」","id":"n3-54"}]},
{"id":"a-n4-10-n2","variant_of":"a-n4-10","level":"n2","topic":"生活","topic_en":"Everyday life","title":"セルフレジという新しい買い物のかたち","title_zh":"自助結帳機這種新的購物方式","title_en":"Self-Checkout: A New Way to Shop","body":"先週、近所のスーパーで初めてセルフレジを使い、その仕組みに感心しました。店員を介さずに、客が自分で商品の精算まで済ませられるのが最大の特徴です。近年は人手不足に伴って、無人で会計できる設備を導入する店が増えつつあります。便利な反面、初めてのときは戸惑わざるを得ない場面もありました。\nまず、かごから商品を一つずつ取り出し、バーコードを機械にかざして読み取らせます。音が鳴れば、その商品が正しく登録されたことを示すしるしになります。続いて、画面の案内に従って、現金とカードのどちらで支払うかを選びます。現金を選んだ場合は、指定された投入口にお金を入れる形になります。\n私は初めてだったので、どこを押せばよいのか分からず、しばらく迷ってしまいました。しかし、困っている様子に気づいた近くの店員がすぐに駆けつけ、丁寧に手伝ってくれました。機械任せの店でも、人のサポートがあるのは心強いものです。\nセルフレジはレジに並ぶ必要がないため、時間に余裕のないときには非常に便利です。ただし、機械の操作に慣れている人に対して、慣れていない人には少し難しく感じられるかもしれません。とはいえ、使い方に慣れれば、誰でも簡単に使いこなせるようになるでしょう。これから利用する方は、まず落ち着いて画面を見ながら試してみてください。","trans":["上週,我第一次在附近的超市使用自助結帳機,對它的運作方式很佩服。它最大的特色,是不經過店員,顧客就能自己完成商品的結帳。近年來隨著人手不足,引進這類無人結帳設備的店家正逐漸增加。雖然方便,但第一次使用時也有不得不感到困惑的時候。","首先,把商品從籃子裡一件一件拿出來,將條碼對著機器讓它讀取。如果發出聲音,就表示那件商品已正確登錄。接著,依照畫面的指示,選擇要用現金還是刷卡付款。如果選擇現金,就把錢放進指定的投幣口。","因為是第一次,我不知道該按哪裡,猶豫了好一陣子。不過,注意到我很困擾的附近店員立刻趕了過來,親切地幫了我。即使是交給機器處理的店,有人可以協助還是讓人覺得安心。","自助結帳機不需要排隊等收銀台,所以在時間不充裕的時候非常方便。不過,相對於習慣操作機器的人,不習慣的人可能會覺得有點難。儘管如此,只要習慣了用法,任何人應該都能輕鬆駕馭。今後要使用的人,請先冷靜地一邊看畫面一邊試試看。"],"trans_en":["Last week I used a self-checkout at a nearby supermarket for the first time and was impressed by how it works. Its main feature is that customers can complete the payment for their items on their own, without going through a clerk. In recent years, along with labor shortages, more stores are introducing these unstaffed checkout systems. Convenient as it is, there were moments when, as a first-timer, I could not help but feel confused.","First, take the items out of the basket one by one and hold each barcode up to the machine so it can read it. When you hear a beep, it means the item has been registered correctly. Next, follow the guidance on the screen and choose whether to pay by cash or by card. If you choose cash, you put the money into the designated slot.","Since it was my first time, I did not know where to press and was lost for a while. However, a nearby clerk noticed I was struggling, rushed over right away, and helped me politely. Even in a store where machines do the work, having human support is reassuring.","Because you do not have to wait in a register line, self-checkout is very convenient when you are short on time. However, compared with people used to operating machines, those who are not may find it a little difficult. Still, once you get used to it, anyone should be able to use it easily. If you are going to use one, first stay calm and try it while looking at the screen."],"vocab":[{"w":"精算","r":"せいさん","m":"結算、算清費用","m_en":"settling a bill, payment"},{"w":"仕組み","r":"しくみ","m":"結構、運作方式","m_en":"mechanism, how something works"},{"w":"感心","r":"かんしん","m":"佩服、讚嘆","m_en":"admiration, being impressed"},{"w":"人手不足","r":"ひとでぶそく","m":"人手不足","m_en":"labor shortage"},{"w":"導入","r":"どうにゅう","m":"引進、導入","m_en":"introduction, adoption"},{"w":"案内","r":"あんない","m":"指引、導覽","m_en":"guidance, instructions"},{"w":"投入口","r":"とうにゅうぐち","m":"投入口、投幣口","m_en":"insertion slot"},{"w":"駆けつける","r":"かけつける","m":"趕來、急忙趕到","m_en":"to rush to the scene"},{"w":"心強い","r":"こころづよい","m":"讓人安心的、有依靠的","m_en":"reassuring, encouraging"},{"w":"余裕","r":"よゆう","m":"餘裕、充裕","m_en":"leeway, spare time"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某個變化,另一個變化也同時發生。例:「近年は人手不足に伴って」無人結帳設備也隨之增加。","t_en":"〜に伴って","note_en":"Indicates that one change occurs together with another. Example: 「近年は人手不足に伴って」 describes unstaffed checkouts increasing along with labor shortages."},{"t":"〜ざるを得ない","note":"表示不得不做、無法避免。接動詞ない形(去ない)。例:「戸惑わざるを得ない場面もありました」","t_en":"〜ざるを得ない","note_en":"Means cannot help but do, have no choice but to. Attaches to the verb negative stem. Example: 「戸惑わざるを得ない場面もありました」","id":"n2-35"},{"t":"〜に従って","note":"表示依照指示、規則或指引行動。例:「画面の案内に従って」選擇付款方式。","t_en":"〜に従って","note_en":"Means following instructions, rules or guidance. Example: 「画面の案内に従って」 choose the payment method."},{"t":"〜に対して","note":"用於對比兩種對象或狀況。例:「操作に慣れている人に対して」不習慣的人覺得較難。","t_en":"〜に対して","note_en":"Used to contrast two subjects or situations. Example: 「操作に慣れている人に対して」 those unused to it find it harder.","id":"n3-2"}]},
{"id":"a-n4-10-n3","variant_of":"a-n4-10","level":"n3","topic":"生活","topic_en":"Everyday life","title":"セルフレジ","title_zh":"自助結帳機","title_en":"Self-Checkout","body":"先週、家の近くのスーパーで、生まれて初めてセルフレジを使ってみました。セルフレジとは、店員さんに頼らなくても、自分で商品の精算ができる機械のことです。使い方を知っておくと、これから役に立つのではないかと思います。\nまず、かごの中の商品を一つずつ取り出し、バーコードを機械にかざします。ピッという音が鳴れば、その商品が正しく読み取られたというしるしになります。次に、画面の案内を見ながら、現金で払うかカードで払うかを選びます。\n現金を選んだ場合は、機械のお金を入れるところに入れて支払います。私は初めてだったため、どこを押せばいいのかわからなくなって、少し迷ってしまいました。しかし、困っていると近くにいた店員さんがすぐに来て、手伝ってくれたので安心しました。\nセルフレジはレジに並ばなくてもいいため、時間がないときにはとても便利だと感じました。ただ、機械に慣れていない人にとっては、少し難しく感じられるかもしれません。使い方に慣れれば、誰でも簡単に使えるようになります。これから使う人は、あせらずにゆっくり画面を見ながら、試してみてください。","trans":["上週,我第一次在家附近的超市使用了自助結帳機。所謂自助結帳機,就是即使不靠店員,也能自己完成商品結帳的機器。我想,先知道使用方法,以後會很有幫助。","首先,把籃子裡的商品一件一件拿出來,將條碼對著機器掃描。如果發出「嗶」的一聲,就表示那件商品已被正確讀取。接著,一邊看畫面上的指示,一邊選擇要用現金還是刷卡付款。","如果選擇現金,就把錢放進機器的投錢口來付款。因為我是第一次用,不知道該按哪裡,有點不知所措。不過,正在煩惱時,附近的店員馬上過來幫忙,讓我鬆了一口氣。","自助結帳機不用排隊等收銀台,所以我覺得在沒有時間的時候非常方便。不過,對不習慣機器的人來說,可能會覺得有點難。只要習慣了使用方法,任何人都能簡單地使用。今後要使用的人,請不要著急,一邊慢慢看畫面一邊試試看。"],"trans_en":["Last week, I used a self-checkout machine for the first time at a supermarket near my home. A self-checkout is a machine that lets you pay for your items by yourself, without relying on a clerk. I think knowing how to use it will be useful from now on.","First, take the items out of your basket one by one and hold the barcode up to the machine. If you hear a beep, it means the item was read correctly. Next, while following the guidance on the screen, choose whether to pay by cash or by card.","If you choose cash, you put the money into the cash slot on the machine to pay. Because it was my first time, I didn't know where to press and ended up hesitating a little. However, while I was struggling, a clerk nearby came right away and helped me, which was a relief.","Since you don't have to wait in line at the register, I felt self-checkout is very convenient when you're short on time. However, it may feel a little difficult for people who aren't used to machines. Once you get used to it, anyone can use it easily. For those who will use it from now on, don't rush, and try it while looking carefully at the screen."],"vocab":[{"w":"セルフレジ","r":"セルフレジ","m":"自助結帳機","m_en":"self-checkout"},{"w":"精算","r":"せいさん","m":"結帳、結算","m_en":"payment, settling the bill"},{"w":"取り出す","r":"とりだす","m":"拿出來","m_en":"to take out"},{"w":"かざす","r":"かざす","m":"(對著)舉到…前、靠近","m_en":"to hold up (to a scanner)"},{"w":"読み取る","r":"よみとる","m":"讀取、掃描","m_en":"to read, to scan"},{"w":"案内","r":"あんない","m":"指示、導引","m_en":"guidance, instructions"},{"w":"迷う","r":"まよう","m":"猶豫、不知所措","m_en":"to hesitate, to be at a loss"},{"w":"手伝う","r":"てつだう","m":"幫忙","m_en":"to help"},{"w":"慣れる","r":"なれる","m":"習慣、熟悉","m_en":"to get used to"},{"w":"試す","r":"ためす","m":"試試看","m_en":"to try, to test"}],"grammar":[{"t":"〜ておく","note":"表示事先做好準備。例:「使い方を知っておくと」表示先知道使用方法,以後會有幫助。","t_en":"〜ておく","note_en":"Expresses doing something in advance as preparation. Example: 「使い方を知っておくと」 means knowing how to use it beforehand will help later."},{"w":"","t":"〜ため(原因・理由)","note":"用較正式的說法表示原因。例:「私は初めてだったため」意思是「因為是第一次」。","t_en":"〜ため (reason)","note_en":"A somewhat formal way to state a reason. Example: 「私は初めてだったため」 means 'because it was my first time'."},{"t":"〜にとって","note":"表示從某人的立場來看。例:「機械に慣れていない人にとっては」意思是「對不習慣機器的人來說」。","t_en":"〜にとって","note_en":"Means 'for / from the standpoint of someone'. Example: 「機械に慣れていない人にとっては」 means 'for people who aren't used to machines'.","id":"n3-8"},{"t":"〜ようになる","note":"表示能力或狀態的變化。例:「誰でも簡単に使えるようになります」意思是「任何人都會變得能簡單使用」。","t_en":"〜ようになる","note_en":"Expresses a change in ability or state. Example: 「誰でも簡単に使えるようになります」 means 'anyone will become able to use it easily'.","id":"n3-40"}]},
{"id":"a-n4-3-n2","variant_of":"a-n4-3","level":"n2","topic":"旅遊","topic_en":"Travel","title":"古都・京都を歩く","title_zh":"漫步古都京都","title_en":"Walking Through the Ancient Capital, Kyoto","body":"京都は千年以上も前に日本の首都として栄えた町であり、長い歴史を今に伝える都市として知られています。時代の移り変わりに伴って町の姿は少しずつ変わってきましたが、古い寺や神社は今でも数多く残っています。そうした建物は単なる観光資源にとどまらず、人々の暮らしや信仰と深く結びついてきた存在だと言えるでしょう。\n京都の魅力の一つは、春の桜や秋の紅葉に代表されるように、季節ごとにまったく違う表情を見せてくれることです。同じ場所であっても、訪れる季節によって受ける印象は大きく異なります。そのため、何度足を運んでも飽きることがなく、むしろ訪れるたびに新しい発見があるという人も少なくありません。\n京都を旅行するなら、予定を詰め込まず、急がずにゆっくり歩いて回ることをおすすめします。細い道を一本曲がっただけで、静かなお寺や昔ながらの喫茶店にふと出会えることがあるからです。計画どおりに進めようとすると、こうした偶然の出会いを見逃さざるを得なくなってしまいます。地図に載っている場所だけが京都のすべてとは限らないのです。\n有名な観光地だけでなく、地元の人が通う小さな店にも立ち寄ると、本当の京都の魅力が見えてくるでしょう。観光地の華やかさに対して、小さな店には京都の日常の空気が感じられます。京都は古い建物を大切に守りながら、新しい文化も積極的に取り入れてきた町でもあります。伝統と変化が無理なく共存している点こそ、京都が長く愛され続ける理由だと言えるでしょう。","trans":["京都是一千多年前作為日本首都而繁榮的城市,以將悠久歷史傳承至今的都市而聞名。隨著時代的變遷,城市的面貌雖然一點一點在改變,但古老的寺廟和神社至今仍大量保留下來。這些建築不只是觀光資源,可以說是與人們的生活和信仰緊密相連的存在。","京都的魅力之一,就是如春天的櫻花、秋天的紅葉所代表的,每個季節都會展現截然不同的面貌。即使是同一個地方,依造訪的季節不同,給人的印象也大不相同。因此,不管去幾次都不會膩,甚至不少人說每次造訪都有新的發現。","如果要去京都旅行,建議不要把行程排得太滿,而是不趕時間地慢慢走。因為只是轉進一條小巷,就可能偶然遇見安靜的寺廟或古色古香的咖啡店。如果一心想照計畫走,就不得不錯過這些偶然的相遇。地圖上標示的地方,未必就是京都的全部。","不只是有名的觀光地,如果也順道去看看當地人常去的小店,就能看見京都真正的魅力吧。相對於觀光地的華麗,在小店裡能感受到京都日常生活的氛圍。京都同時也是一座一邊用心守護古老建築、一邊積極吸收新文化的城市。傳統與變化自然地並存,可以說正是京都能長久受人喜愛的原因。"],"trans_en":["Kyoto is a city that flourished as Japan's capital more than a thousand years ago, and it is known as a place that carries a long history into the present. Although the city's appearance has changed little by little with the passing of the eras, many old temples and shrines still remain today. These buildings are not merely tourist resources; they can be said to have been deeply bound up with people's daily lives and faith.","One of Kyoto's charms is that, as typified by spring cherry blossoms and autumn leaves, it shows a completely different face in each season. Even in the same place, the impression you get differs greatly depending on when you visit. For that reason, you never tire of it no matter how many times you go, and quite a few people say they find something new each time.","If you travel to Kyoto, I recommend not packing your schedule but walking around slowly, without rushing. This is because just by turning down one narrow lane, you may happen upon a quiet temple or a traditional coffee shop. If you insist on sticking to a plan, you will be forced to miss these chance encounters. The places marked on a map are not necessarily all there is to Kyoto.","If you stop by small shops frequented by locals, and not only famous sightseeing spots, the true charm of Kyoto will probably become visible. In contrast to the glamour of the tourist sites, the small shops let you feel the atmosphere of everyday Kyoto. Kyoto is also a city that carefully protects its old buildings while actively taking in new culture. The way tradition and change coexist naturally is, it could be said, exactly why Kyoto continues to be loved for so long."],"vocab":[{"w":"首都","r":"しゅと","m":"首都","m_en":"capital city"},{"w":"栄えた","r":"さかえた","m":"繁榮、興盛(原形:栄える)","m_en":"flourished, prospered (dictionary form: 栄える)"},{"w":"信仰","r":"しんこう","m":"信仰","m_en":"faith, religious belief"},{"w":"代表","r":"だいひょう","m":"代表","m_en":"representation, to represent"},{"w":"表情","r":"ひょうじょう","m":"表情、面貌","m_en":"expression, face (appearance)"},{"w":"飽きる","r":"あきる","m":"膩、厭倦","m_en":"to get tired of"},{"w":"昔ながら","r":"むかしながら","m":"依舊、古色古香","m_en":"traditional, as it has always been"},{"w":"偶然","r":"ぐうぜん","m":"偶然","m_en":"chance, coincidence"},{"w":"共存","r":"きょうぞん","m":"共存","m_en":"coexistence"}],"grammar":[{"t":"〜に伴って","note":"表示「隨著…而…」,前項變化時後項也跟著變化。例:「時代の移り変わりに伴って町の姿は少しずつ変わってきました」","t_en":"〜に伴って","note_en":"Means 'along with / as ~', where something changes together with a change in the first element. Example: 「時代の移り変わりに伴って町の姿は少しずつ変わってきました」"},{"t":"〜ざるを得ない","note":"表示「不得不…、只能…」,接動詞ない形(する變成せざるを得ない)。例:「偶然の出会いを見逃さざるを得なくなってしまいます」","t_en":"〜ざるを得ない","note_en":"Means 'have no choice but to ~', attached to the negative stem of a verb. Example: 「偶然の出会いを見逃さざるを得なくなってしまいます」","id":"n2-35"},{"t":"〜に対して","note":"表示對比,「相對於…」,用來比較兩種事物。例:「観光地の華やかさに対して、小さな店には京都の日常の空気が感じられます」","t_en":"〜に対して","note_en":"Used to contrast two things, 'in contrast to ~'. Example: 「観光地の華やかさに対して、小さな店には京都の日常の空気が感じられます」","id":"n3-2"},{"t":"〜とは限らない","note":"表示「未必…、不一定…」,用來否定「全都是」的看法。例:「地図に載っている場所だけが京都のすべてとは限らないのです」","t_en":"〜とは限らない","note_en":"Means 'not necessarily ~', used to deny that something is always true. Example: 「地図に載っている場所だけが京都のすべてとは限らないのです」","id":"n2-58"}]},
{"id":"a-n4-3-n3","variant_of":"a-n4-3","level":"n3","topic":"旅遊","topic_en":"Travel","title":"古都・京都を歩く","title_zh":"漫步古都京都","title_en":"Walking Through the Old Capital, Kyoto","body":"京都は千年以上も前に日本の首都だった町で、今でも古いお寺や神社が数多く残っています。春は桜、秋は紅葉が非常に美しく、季節によってまったく違う表情を見せてくれます。そのため、何度訪れても飽きることがありません。\n京都を旅行するときは、急がずにゆっくり歩くことをおすすめします。細い道を曲がってみると、静かなお寺や昔ながらの喫茶店に出会えることがあります。そうした思いがけない出会いも、歩く旅ならではの楽しさだと言えるでしょう。\n有名な観光地を見るだけでなく、地元の人が通う小さな店にも足を運んでみてください。観光客向けの場所とは違って、そこには普段の京都の暮らしが感じられます。そうすることによって、本当の京都の魅力が少しずつ見えてくるはずです。\n京都の魅力は、古い建物を大切に守りながら、新しい文化も取り入れているところにあります。昔のものをただ残しているわけではなく、時代に合わせて変わり続けているのです。だからこそ、京都は昔も今も多くの人を引きつける町なのでしょう。","trans":["京都是一千多年前曾是日本首都的城市,至今仍保留著許多古老的寺廟和神社。春天的櫻花、秋天的紅葉都非常美,隨著季節不同,展現出截然不同的面貌。因此不管來幾次都不會膩。","在京都旅行時,推薦不趕時間、慢慢地走。轉進小巷,有時能遇見安靜的寺廟或古色古香的咖啡店。這種意想不到的邂逅,也可以說是步行旅行才有的樂趣吧。","不只是參觀有名的觀光地,也請去當地人常去的小店走走。和觀光客取向的地方不同,在那裡能感受到京都平常的生活。這樣一來,京都真正的魅力應該就會一點一點浮現出來。","京都的魅力在於一邊細心守護古老建築,一邊也吸收新的文化。並不是單純保留舊有的事物,而是配合時代不斷改變。正因如此,京都才會從過去到現在都吸引著許多人吧。"],"trans_en":["Kyoto is a city that was Japan's capital more than a thousand years ago, and many old temples and shrines still remain today. The cherry blossoms in spring and the autumn leaves in fall are very beautiful, showing a completely different face with each season. For that reason, you never get tired of it no matter how many times you visit.","When traveling in Kyoto, I recommend walking slowly without rushing. If you turn down a narrow lane, you may come across a quiet temple or a traditional old-style café. Such unexpected encounters can be called a pleasure unique to traveling on foot.","Don't just see the famous sights; please also stop by the small shops that locals frequent. Unlike places aimed at tourists, you can feel the everyday life of Kyoto there. By doing so, the true charm of Kyoto should gradually become visible to you.","Kyoto's charm lies in carefully protecting old buildings while also embracing new culture. It is not simply preserving things from the past, but continuing to change with the times. That is exactly why Kyoto is a city that has attracted many people both in the past and today."],"vocab":[{"w":"首都","r":"しゅと","m":"首都","m_en":"capital city"},{"w":"数多く","r":"かずおおく","m":"許多、為數眾多","m_en":"in great numbers"},{"w":"表情","r":"ひょうじょう","m":"表情、面貌","m_en":"expression, face (aspect)"},{"w":"訪れる","r":"おとずれる","m":"拜訪、造訪","m_en":"to visit"},{"w":"飽きる","r":"あきる","m":"膩、厭倦","m_en":"to get tired of"},{"w":"昔ながら","r":"むかしながら","m":"一如往昔、傳統不變","m_en":"traditional, as in the old days"},{"w":"足を運ぶ","r":"あしをはこぶ","m":"前往、特地去","m_en":"to go to, to make a trip to"},{"w":"地元","r":"じもと","m":"當地、本地","m_en":"local area, hometown"},{"w":"魅力","r":"みりょく","m":"魅力","m_en":"charm, appeal"},{"w":"取り入れる","r":"とりいれる","m":"引進、吸收","m_en":"to adopt, to incorporate"}],"grammar":[{"t":"〜によって","note":"表示「依……而不同」或「透過……的方式」。文中「季節によってまったく違う表情を見せてくれます」是隨季節而異;「そうすることによって」則是透過這個方法。","t_en":"〜によって","note_en":"Means 'depending on ~' or 'by means of ~'. In 「季節によってまったく違う表情を見せてくれます」 it means 'depending on the season'; in 「そうすることによって」 it means 'by doing so'."},{"t":"〜わけではない","note":"部分否定,表示「並不是說……」。文中「昔のものをただ残しているわけではなく」表示並非只是單純保留舊物。","t_en":"〜わけではない","note_en":"Partial negation meaning 'it is not that ~'. In 「昔のものをただ残しているわけではなく」 it means 'it's not that they simply preserve old things'.","id":"n3-43"},{"t":"〜だけでなく","note":"表示「不只……而且還……」。文中「有名な観光地を見るだけでなく、地元の人が通う小さな店にも足を運んでみてください」是不只看名勝,也去當地小店。","t_en":"〜だけでなく","note_en":"Means 'not only ~ but also ~'. In 「有名な観光地を見るだけでなく、地元の人が通う小さな店にも足を運んでみてください」 it adds visiting local shops to seeing famous sights."},{"t":"〜はずだ","note":"表示說話者根據理由做出的推測,「應該會……」。文中「本当の京都の魅力が少しずつ見えてくるはずです」是推測這樣做就能看見京都的魅力。","t_en":"〜はずだ","note_en":"Expresses a reasoned expectation: 'should ~'. In 「本当の京都の魅力が少しずつ見えてくるはずです」 it says the true charm should gradually become visible.","id":"n3-45"}]},
{"id":"a-n4-4-n2","variant_of":"a-n4-4","level":"n2","topic":"旅行","topic_en":"Travel","title":"はじめての一人旅","title_zh":"第一次一個人旅行","title_en":"My First Solo Trip","body":"先月、私ははじめて一人で旅行に出かけ、前から気になっていた金沢を訪れることにした。出発する前は不安を感じざるを得なかったが、自分で計画を立てる作業は想像以上に楽しかった。誰かに合わせる必要がない分、行きたい場所を自由に選べるという点も、大きな魅力だったと思う。\n当日は朝早く新幹線に乗り、昼過ぎに金沢へ到着したが、駅の大きさには思わず圧倒されてしまった。到着してすぐに、私はまず有名な庭園を見に行くことにした。天気がよかったおかげで、庭園の景色を背景に写真をたくさん撮ることができた。初めて訪れる場所でも、自分のペースで見て回れるのは一人旅ならではの良さだと感じた。\n夜になると市場に足を運び、新鮮な海の幸を心ゆくまで味わうことができた。一人だったので、他人に気を遣うことなく、好きなものを好きなだけ注文できたのである。グループでの旅行では、全員の希望が一致するとは限らないため、こうした自由は貴重に思えた。知らない町を一人で歩いていると、少しさびしさを感じる瞬間もあったが、それ以上に自由な気持ちよさが勝っていた。\n旅が進むに伴って、出発前の不安は少しずつ薄れ、気持ちにも余裕が生まれてきた。この旅行を通して、一人でも何とかなるという自信がついたのは、大きな収穫だった。一人で行動することに対する抵抗感が、今回の経験を通して小さくなったように思う。機会があれば、また別の町へ一人で出かけてみたいと思っている。","trans":["上個月,我第一次一個人出門旅行,決定造訪一直很在意的金澤。出發前不得不感到不安,但自己安排計畫的過程比想像中還要有趣。不需要配合任何人,可以自由選擇想去的地方,我想這也是一大魅力。","當天一大早搭上新幹線,過了中午抵達金澤,車站之大讓我不禁被震懾住了。一到達,我就決定先去看有名的庭園。多虧天氣很好,我能以庭園的景色為背景拍下許多照片。即使是第一次造訪的地方,也能依照自己的步調遊覽,我覺得這正是一個人旅行才有的好處。","到了晚上,我前往市場,盡情品嚐了新鮮的海產。因為是一個人,不必顧慮他人,想點什麼就點什麼、想吃多少就點多少。和團體旅行時,不一定每個人的希望都一致,所以我覺得這樣的自由格外珍貴。獨自走在陌生的城鎮時,雖然也有感到些許寂寞的瞬間,但自由的舒暢感遠遠勝過了它。","隨著旅程的進行,出發前的不安漸漸淡去,心情也變得有餘裕。透過這趟旅行,我獲得了「就算一個人也能應付」的自信,這是很大的收穫。對於一個人行動的抗拒感,經過這次經驗似乎變小了。如果有機會,我還想再一個人去別的城鎮看看。"],"trans_en":["Last month I took my first trip alone, deciding to visit Kanazawa, a place I had been curious about for a long time. Before leaving I could not help feeling anxious, but planning everything myself was more fun than I expected. Not having to match anyone else's wishes, so that I could freely choose where to go, was also a big appeal, I think.","On the day, I took the Shinkansen early in the morning and arrived in Kanazawa after noon, and I was simply overwhelmed by the size of the station. As soon as I arrived, I decided to go see the famous garden first. Thanks to the good weather, I was able to take many photos with the garden scenery as a backdrop. Even in a place I was visiting for the first time, being able to look around at my own pace felt like the real charm of solo travel.","In the evening I went to the market and enjoyed fresh seafood to my heart's content. Since I was alone, I could order whatever I liked, as much as I liked, without worrying about anyone else. On group trips everyone's wishes do not necessarily match, so this kind of freedom felt precious. Walking alone through an unfamiliar town, I had moments of feeling a little lonely, but the pleasant sense of freedom outweighed that.","As the trip went on, my anxiety from before departure gradually faded and I felt more at ease. Through this trip I gained the confidence that I can manage somehow even on my own, which was a great reward. My resistance to acting alone seems to have shrunk through this experience. If I get the chance, I would like to go to another town by myself again."],"vocab":[{"w":"不安","r":"ふあん","m":"不安、擔心","m_en":"anxiety, worry"},{"w":"圧倒","r":"あっとう","m":"壓倒、震懾","m_en":"to overwhelm"},{"w":"海の幸","r":"うみのさち","m":"海產、海鮮","m_en":"seafood, bounty of the sea"},{"w":"味わう","r":"あじわう","m":"品嚐、體會","m_en":"to taste, to savor"},{"w":"気を遣う","r":"きをつかう","m":"顧慮、費心","m_en":"to be considerate, to worry about others"},{"w":"貴重","r":"きちょう","m":"珍貴、寶貴","m_en":"precious, valuable"},{"w":"余裕","r":"よゆう","m":"餘裕、從容","m_en":"leeway, composure"},{"w":"収穫","r":"しゅうかく","m":"收穫","m_en":"gain, harvest"},{"w":"抵抗感","r":"ていこうかん","m":"抗拒感","m_en":"sense of resistance, reluctance"}],"grammar":[{"t":"〜ざるを得ない","note":"表示「不得不~、只能~」,帶有無奈的語氣。例:「出発する前は不安を感じざるを得なかった」。","t_en":"~zaru o enai","note_en":"Means 'cannot help but ~' or 'have no choice but to ~', with a sense of resignation. Example: 「出発する前は不安を感じざるを得なかった」.","id":"n2-35"},{"t":"〜とは限らない","note":"表示「不一定~」,用來否定全面或絕對的說法。例:「全員の希望が一致するとは限らない」。","t_en":"~to wa kagiranai","note_en":"Means 'not necessarily ~', denying an absolute claim. Example: 「全員の希望が一致するとは限らない」.","id":"n2-58"},{"t":"〜に伴って","note":"表示「隨著~」,前項變化時後項也跟著變化。例:「旅が進むに伴って、出発前の不安は少しずつ薄れ」。","t_en":"~ni tomonatte","note_en":"Means 'along with ~' or 'as ~ progresses', where a second change accompanies the first. Example: 「旅が進むに伴って、出発前の不安は少しずつ薄れ」."},{"t":"〜を通して","note":"表示「透過~、經由~」,指藉由某經驗或手段而得到結果。例:「この旅行を通して、一人でも何とかなるという自信がついた」。","t_en":"~o tooshite","note_en":"Means 'through ~' or 'by means of ~', indicating a result gained via an experience. Example: 「この旅行を通して、一人でも何とかなるという自信がついた」."}]},
{"id":"a-n4-4-n3","variant_of":"a-n4-4","level":"n3","topic":"旅行","topic_en":"Travel","title":"はじめての一人旅","title_zh":"第一次一個人旅行","title_en":"My First Solo Trip","body":"先月、生まれてはじめて一人で旅行に出かけました。行き先は、以前からずっと気になっていた金沢という町にしました。出発の前は不安もありましたが、自分で計画を立てるのは思っていたより楽しい作業でした。\n朝早い新幹線に乗ったおかげで、昼過ぎには金沢に着くことができました。駅は想像していたよりずっと大きくて、思わず立ち止まってしまいました。\nまず、この町で有名な庭園を見に行くことにしました。天気に恵まれたため、きれいな景色を背景に写真をたくさん撮ることができました。夜は市場に行って、新鮮な海の幸を味わいました。一人だったので、食べたいものを食べたいだけ注文できるのがうれしかったです。\n知らない町を一人で歩いていると、少しさびしくなることもありました。それでも、誰にも合わせなくていい自由さが、とても心地よく感じられました。この旅行によって、一人でも何とかなるという自信がつきました。機会があれば、また一人でどこかへ出かけてみたいと思っています。","trans":["上個月,我第一次一個人出門旅行。目的地選了從以前就一直很在意的金澤這個城市。出發前雖然也有些不安,但自己安排計畫比想像中還要有趣。","多虧搭了一大早的新幹線,過了中午就能抵達金澤。車站比我想像的還要大得多,我不由自主地停下了腳步。","首先,我決定去看這個城市有名的庭園。因為天公作美,我以美麗的景色為背景拍了很多照片。晚上去了市場,品嚐新鮮的海產。因為是一個人,能想吃什麼就點什麼、想吃多少就點多少,讓我很開心。","一個人走在陌生的城鎮時,有時也會覺得有點寂寞。即便如此,不必遷就任何人的自由,讓我覺得非常舒暢。透過這趟旅行,我有了「就算一個人也能想辦法應付」的自信。如果有機會,我還想再一個人去某個地方走走。"],"trans_en":["Last month, I went on a trip by myself for the first time in my life. I chose Kanazawa, a city I had been curious about for a long time. Before leaving I felt some anxiety, but making my own plans turned out to be more fun than I had expected.","Thanks to taking an early-morning Shinkansen, I was able to arrive in Kanazawa shortly after noon. The station was much bigger than I had imagined, and I stopped in my tracks without meaning to.","First, I decided to visit the city's famous garden. Because the weather was so good, I was able to take lots of photos against a beautiful backdrop. In the evening I went to the market and enjoyed fresh seafood. Since I was alone, I was happy that I could order whatever I wanted, as much as I wanted.","Walking alone through an unfamiliar town, I sometimes felt a little lonely. Even so, the freedom of not having to accommodate anyone felt very pleasant. Through this trip, I gained confidence that I can manage somehow even on my own. If I get the chance, I would like to go somewhere on my own again."],"vocab":[{"w":"計画","r":"けいかく","m":"計畫、規劃","m_en":"plan"},{"w":"不安","r":"ふあん","m":"不安","m_en":"anxiety, uneasiness"},{"w":"想像","r":"そうぞう","m":"想像","m_en":"imagination"},{"w":"庭園","r":"ていえん","m":"庭園","m_en":"garden"},{"w":"恵まれる","r":"めぐまれる","m":"受到眷顧、得天獨厚","m_en":"to be blessed with"},{"w":"新鮮","r":"しんせん","m":"新鮮","m_en":"fresh"},{"w":"味わう","r":"あじわう","m":"品嚐、細細體會","m_en":"to taste, to savor"},{"w":"自由","r":"じゆう","m":"自由","m_en":"freedom"},{"w":"心地よい","r":"ここちよい","m":"舒服的、舒暢的","m_en":"pleasant, comfortable"},{"w":"自信","r":"じしん","m":"自信","m_en":"confidence"}],"grammar":[{"t":"〜おかげで","note":"表示因為某個好的原因而得到好結果,有感謝的語氣。例:「朝早い新幹線に乗ったおかげで、昼過ぎには金沢に着くことができました」","t_en":"~okage de","note_en":"Expresses a good result brought about by a certain cause, with a tone of gratitude. Example: 「朝早い新幹線に乗ったおかげで、昼過ぎには金沢に着くことができました」","id":"n3-6"},{"t":"〜ことにする","note":"表示自己決定要做某事。例:「この町で有名な庭園を見に行くことにしました」","t_en":"~koto ni suru","note_en":"Expresses a decision the speaker makes themselves. Example: 「この町で有名な庭園を見に行くことにしました」"},{"t":"〜ため(原因)","note":"用在書面或較正式的場合,表示原因、理由。例:「天気に恵まれたため、きれいな景色を背景に写真をたくさん撮ることができました」","t_en":"~tame (reason)","note_en":"A somewhat formal or written way to state a cause or reason. Example: 「天気に恵まれたため、きれいな景色を背景に写真をたくさん撮ることができました」"},{"t":"〜によって","note":"表示透過某個手段或經驗而產生結果。例:「この旅行によって、一人でも何とかなるという自信がつきました」","t_en":"~ni yotte","note_en":"Indicates a result brought about through a means or experience. Example: 「この旅行によって、一人でも何とかなるという自信がつきました」"}]},
{"id":"a-n4-5-n2","variant_of":"a-n4-5","level":"n2","topic":"仕事","topic_en":"Work","title":"アルバイトの一日","title_zh":"打工的一天","title_en":"A Day at My Part-Time Job","body":"わたしは大学に通うかたわら、カフェでアルバイトをしており、週に三回、夕方から夜にかけてのシフトに入っている。店に着いたらまず制服に着がえ、手を念入りに洗うことが、仕事を始める前の決まりになっている。飲食店では衛生面への配慮が欠かせないため、この習慣は小さなことのようでも大切な意味を持っていると感じる。\n仕事の内容は、注文を取ること、コーヒーを作ること、そしてテーブルをかたづけることなど、多岐にわたる。忙しい時間帯には息つく暇もなく動き回らざるを得ず、体力的にも精神的にもかなり大変である。それでも、お客さんから「ありがとう」と声をかけられると、その疲れが一瞬で消えてしまうから不思議だ。\n働き始めたころは失敗ばかりで、先輩に注意されることも少なくなかった。当時は自分の未熟さを思い知らされる毎日だった。しかし、経験を重ねるに伴って、少しずつできる仕事が増えていった。\nこのアルバイトを通じて得たものは、収入だけにとどまらない。人との話し方や、チームで協力して働くことの大切さも、現場で実際に学ぶことができた。勉強との両立は決して簡単とは言えないが、苦労した分だけ得るものも大きいと感じている。社会に出る前にこうした経験ができたことは、わたしにとって貴重な財産になっていると思う。","trans":["我一邊上大學,一邊在咖啡廳打工,每週三次,上的是傍晚到晚上的班。到店裡後,首先要換上制服、仔細把手洗乾淨,這是開始工作前的規矩。餐飲店不能不顧慮衛生,所以我覺得這個習慣看似微小,卻有著重要的意義。","工作內容很廣泛,包括點餐、做咖啡,以及收拾桌子等等。忙碌的時段連喘口氣的空檔都沒有,不得不四處奔走,體力和精神上都相當辛苦。即便如此,只要被客人說一聲「謝謝」,疲勞就瞬間消失,說來也很神奇。","剛開始工作時老是出錯,被前輩提醒的情況也不少。那時每天都深刻體會到自己的不成熟。不過,隨著經驗的累積,能做的工作一點一點增加了。","透過這份打工,我得到的不只是收入。和人說話的方式,以及團隊合作的重要性,我也在現場實際學到了。要兼顧課業絕對稱不上簡單,但我覺得吃過的苦愈多,收穫也愈大。能在出社會前有這樣的經驗,我認為對自己是很寶貴的財富。"],"trans_en":["While attending university, I also work part-time at a cafe, on an evening-to-night shift three times a week. When I arrive at the shop, I first change into my uniform and wash my hands carefully, which is the routine before starting work. Hygiene is essential in a restaurant, so I feel this habit, though it seems small, carries real importance.","The work covers a wide range of tasks, such as taking orders, making coffee, and clearing tables. During busy hours I have no time to catch my breath and have to keep moving, which is quite demanding both physically and mentally. Even so, when a customer says 'thank you' to me, my fatigue vanishes in an instant, which is strange when I think about it.","When I first started, I made mistakes all the time, and I was often corrected by my seniors. Every day back then reminded me of how inexperienced I was. However, as I gained experience, the number of things I could do gradually grew.","What I have gained from this job goes beyond income. I also learned firsthand how to talk with people and why working together as a team matters. Balancing work with study is by no means easy, but I feel that the more I struggled, the more I gained. I think having this experience before entering society has become a valuable asset for me."],"vocab":[{"w":"念入りに","r":"ねんいりに","m":"仔細地、周到地","m_en":"carefully, thoroughly"},{"w":"衛生面","r":"えいせいめん","m":"衛生方面","m_en":"hygiene aspect"},{"w":"欠かせない","r":"かかせない","m":"不可或缺的","m_en":"indispensable"},{"w":"多岐にわたる","r":"たきにわたる","m":"涉及多方面、範圍廣泛","m_en":"to cover a wide range"},{"w":"息つく暇もなく","r":"いきつくひまもなく","m":"連喘口氣的時間都沒有","m_en":"without time to catch one's breath"},{"w":"未熟さ","r":"みじゅくさ","m":"不成熟、不熟練","m_en":"inexperience, immaturity"},{"w":"思い知らされる","r":"おもいしらされる","m":"被迫深刻體會到","m_en":"to be made keenly aware"},{"w":"両立","r":"りょうりつ","m":"兼顧、並存","m_en":"balancing both, compatibility"},{"w":"貴重","r":"きちょう","m":"寶貴的","m_en":"valuable, precious"},{"w":"財産","r":"ざいさん","m":"財產、寶貴的資產","m_en":"asset, treasure"}],"grammar":[{"t":"〜かたわら","note":"表示一邊做主要的事(本業或學業),同時也持續做另一件事。例:「大学に通うかたわら、カフェでアルバイトをしており」","t_en":"〜かたわら","note_en":"Doing one main activity while also continuously doing another. Example: 「大学に通うかたわら、カフェでアルバイトをしており」","id":"n1-61"},{"t":"〜ざるを得ない","note":"表示除此之外沒有別的辦法,不得不做。例:「息つく暇もなく動き回らざるを得ず」","t_en":"〜ざるを得ない","note_en":"Having no choice but to do something. Example: 「息つく暇もなく動き回らざるを得ず」","id":"n2-35"},{"t":"〜に伴って","note":"表示隨著某個變化,另一件事也跟著變化。例:「経験を重ねるに伴って、少しずつできる仕事が増えていった」","t_en":"〜に伴って","note_en":"As one thing changes, another changes along with it. Example: 「経験を重ねるに伴って、少しずつできる仕事が増えていった」"},{"t":"〜にとどまらない","note":"表示不僅限於某個範圍,還有更多。例:「得たものは、収入だけにとどまらない」","t_en":"〜にとどまらない","note_en":"Not limited to a certain scope; extends beyond it. Example: 「得たものは、収入だけにとどまらない」"}]},
{"id":"a-n4-5-n3","variant_of":"a-n4-5","level":"n3","topic":"仕事","topic_en":"Work","title":"アルバイトの一日","title_zh":"打工的一天","title_en":"A Day at My Part-Time Job","body":"わたしは大学に通いながら、カフェでアルバイトをしています。週に三回、夕方から夜までのシフトに入っているため、その日は一日がとても短く感じます。店に着いたらまず制服に着がえ、衛生のためにしっかり手を洗うことになっています。\n仕事の内容は、注文を取ること、コーヒーを作ること、テーブルをかたづけることなどです。いそがしい時間は息をつく間もないほど大変です。それでも、お客さんに「ありがとう」と言われると、つかれが飛んでいくように感じます。\nはじめのころは失敗ばかりで、先輩によく注意されました。失敗するたびに落ちこみましたが、少しずつできることが増えてきました。アルバイトによって、お金だけでなく、人との話し方やチームワークの大切さも学ぶことができました。\n勉強との両立は簡単なわけではありませんが、続けてきてよかったと思っています。この経験は、社会に出る前のいい勉強になっていると思います。","trans":["我一邊上大學,一邊在咖啡廳打工。因為一週有三天要上傍晚到晚上的班,那幾天會覺得一整天過得特別短。到店裡後,先換上制服,為了衛生也規定要把手仔細洗乾淨。","工作內容有點餐、做咖啡、收拾桌子等等。忙的時段忙到連喘口氣的空檔都沒有,非常辛苦。即使如此,只要被客人說一聲「謝謝」,就覺得疲勞好像飛走了一樣。","剛開始老是出錯,常被前輩提醒。每次失敗都會很沮喪,但能做的事一點一點變多了。透過打工,我不只學到了賺錢,也學到和人說話的方式,以及團隊合作的重要。","要和課業兼顧並不簡單,但我覺得能持續下來真是太好了。我認為這段經驗,是出社會前很好的學習。"],"trans_en":["I work part-time at a cafe while attending university. Because I work evening-to-night shifts three times a week, those days feel very short. When I arrive at the shop, I first change into my uniform, and I am required to wash my hands carefully for hygiene.","My duties include taking orders, making coffee, and clearing tables. During busy hours it is so hectic that I barely have time to catch my breath. Even so, when a customer says \"thank you,\" I feel as if my tiredness flies away.","When I first started, I made nothing but mistakes and was often corrected by my seniors. I felt down every time I failed, but little by little the number of things I can do has grown. Through this job, I have learned not only about earning money but also how to talk with people and the importance of teamwork.","Balancing work with studies is not easy, but I am glad I kept going. I think this experience is good preparation before I enter society."],"vocab":[{"w":"制服","r":"せいふく","m":"制服","m_en":"uniform"},{"w":"衛生","r":"えいせい","m":"衛生","m_en":"hygiene"},{"w":"注文","r":"ちゅうもん","m":"點餐、訂購","m_en":"order (food, goods)"},{"w":"失敗","r":"しっぱい","m":"失敗、出錯","m_en":"failure, mistake"},{"w":"先輩","r":"せんぱい","m":"前輩、學長姊","m_en":"senior (at work or school)"},{"w":"注意","r":"ちゅうい","m":"提醒、注意","m_en":"warning, caution"},{"w":"両立","r":"りょうりつ","m":"兼顧、並存","m_en":"balancing two things"},{"w":"社会","r":"しゃかい","m":"社會","m_en":"society"},{"w":"経験","r":"けいけん","m":"經驗","m_en":"experience"},{"w":"大切さ","r":"たいせつさ","m":"重要性","m_en":"importance"}],"grammar":[{"t":"〜ため(原因・理由)","note":"表示原因或理由,語氣比「から」更正式。例:「シフトに入っているため、その日は一日がとても短く感じます」","t_en":"~ため (reason, cause)","note_en":"Gives a reason or cause in a more formal tone than から. Example: 「シフトに入っているため、その日は一日がとても短く感じます」"},{"t":"〜ことになっている","note":"表示規定、慣例或既定的做法。例:「衛生のためにしっかり手を洗うことになっています」","t_en":"~ことになっている","note_en":"Expresses a rule, custom, or established arrangement. Example: 「衛生のためにしっかり手を洗うことになっています」"},{"t":"〜によって","note":"表示手段、方法或原因,可譯為「透過」「藉由」。例:「アルバイトによって、お金だけでなく、人との話し方も学ぶことができました」","t_en":"~によって (means, cause)","note_en":"Indicates means or cause, like 'through' or 'by'. Example: 「アルバイトによって、お金だけでなく、人との話し方も学ぶことができました」"},{"t":"〜わけではない","note":"部分否定,表示「並不是……」。例:「勉強との両立は簡単なわけではありませんが」","t_en":"~わけではない","note_en":"Partial negation meaning 'it is not that...'. Example: 「勉強との両立は簡単なわけではありませんが」","id":"n3-43"}]},
{"id":"a-n4-6-n2","variant_of":"a-n4-6","level":"n2","topic":"文化","topic_en":"Culture","title":"夏祭りの魅力","title_zh":"夏日祭典的魅力","title_en":"The Charm of Summer Festivals","body":"日本では夏になると、全国各地で夏祭りが開催されるのが一般的で、季節の風物詩として広く親しまれています。夏祭りはもともと神社やお寺の行事に由来するものが多く、今も地域の人々が集まる大切な機会となっています。夜になるにつれて、浴衣を身にまとった大勢の人々が、神社やお寺の境内へと次々に集まってきます。普段は洋服で過ごす人も、この日ばかりは伝統的な装いを楽しむ傾向があると言えるでしょう。\n祭りの会場には、数多くの屋台が軒を連ねており、歩いているだけでも独特の活気が伝わってきます。たこ焼きやかき氷を味わったり、金魚すくいに挑戦したりと、楽しみ方は人によってさまざまです。食べ物や遊びを通して、子どもから大人までが同じ空間で笑顔になれる点が、夏祭りの魅力だと思います。\n夜が更けて祭りが終わりに近づくと、いよいよ大きな花火が夜空に打ち上げられます。ドンという大きな音が響いたかと思うと、暗い空いっぱいに光が広がっていきます。その瞬間、集まった人々は思わず「わあ」と声を上げずにはいられません。音と光が一体となった迫力は、写真や映像で見るだけでは十分に伝わるとは限らず、現地で体験する価値があります。一年の中でも限られた時期にしか味わえない光景だからこそ、多くの人の記憶に強く残るのでしょう。\nこのように、夏祭りは日本の夏の大切な思い出になる行事であり、季節を肌で感じられる機会でもあります。もし日本を訪れる機会があれば、ぜひ浴衣を着て、地元の人々と同じ雰囲気の中で祭りを楽しんでみてください。慣れない服装に戸惑うかもしれませんが、それもまた旅の忘れがたい経験になるはずです。","trans":["在日本,一到夏天,全國各地通常都會舉辦夏日祭典,作為季節的風物詩廣受大家喜愛。夏日祭典多半源自神社或寺廟的活動,至今仍是地區居民聚在一起的重要機會。隨著夜色漸深,許多穿著浴衣的人們陸續聚集到神社或寺廟的境內。平常穿西式服裝的人,也會在這一天享受傳統的穿著,可以說有這樣的傾向。","祭典會場上,許多攤販一家接著一家排開,光是走在其中,就能感受到獨特的熱鬧氣氛。有人品嚐章魚燒和刨冰,有人挑戰撈金魚,享受的方式因人而異。我認為,透過美食和遊戲,從小孩到大人都能在同一個空間裡露出笑容,正是夏日祭典的魅力所在。","夜深了,祭典接近尾聲時,終於會有大型煙火被施放到夜空中。「咚」的一聲巨響剛傳來,光芒便在漆黑的天空中綻放開來。就在那一瞬間,聚集的人們忍不住發出「哇」的驚呼。聲音與光芒融為一體的震撼感,光看照片或影片不一定能充分傳達,親臨現場體驗才有價值。正因為是一年之中只有特定時期才能欣賞到的景象,才會深深留在許多人的記憶裡吧。","就像這樣,夏日祭典是能成為日本夏天重要回憶的活動,也是能親身感受季節的機會。如果有機會造訪日本,請務必穿上浴衣,在和當地人相同的氛圍中享受祭典。也許你會對不習慣的服裝感到不知所措,但那也會成為旅途中難忘的經驗。"],"trans_en":["In Japan, summer festivals are generally held all over the country once summer arrives, and they are widely loved as a seasonal tradition. Many of them originate from events at shrines and temples, and they remain an important occasion for local communities to gather. As night deepens, large numbers of people dressed in yukata gather one after another at shrine and temple grounds. Even people who usually wear Western clothes tend to enjoy traditional dress on this day.","Numerous food stalls line the festival grounds, and just walking through them conveys a distinctive lively atmosphere. People enjoy it in different ways, such as eating takoyaki and shaved ice or trying goldfish scooping. I think the appeal of a summer festival is that, through food and games, everyone from children to adults can smile in the same space.","As the night wears on and the festival nears its end, big fireworks are finally launched into the night sky. Just as a loud boom echoes, light spreads across the dark sky. At that moment, the gathered crowd cannot help but cry out 'wow.' The impact of sound and light combined does not always come across through photos or videos alone, so experiencing it in person is worthwhile. Precisely because it is a sight you can enjoy only during a limited time of year, it stays strongly in many people's memories.","In this way, a summer festival is an event that becomes an important memory of a Japanese summer, and also a chance to feel the season firsthand. If you ever have the chance to visit Japan, do put on a yukata and enjoy a festival in the same atmosphere as the locals. You may feel flustered by unfamiliar clothing, but that too will likely become an unforgettable part of your trip."],"vocab":[{"w":"開催","r":"かいさい","m":"舉辦、召開","m_en":"holding (an event)"},{"w":"風物詩","r":"ふうぶつし","m":"季節的象徵、風物詩","m_en":"seasonal tradition, hallmark of a season"},{"w":"境内","r":"けいだい","m":"(神社、寺廟的)境內","m_en":"shrine or temple grounds"},{"w":"身にまとう","r":"みにまとう","m":"穿上、披上","m_en":"to wear, to be dressed in"},{"w":"傾向","r":"けいこう","m":"傾向、趨勢","m_en":"tendency, trend"},{"w":"軒を連ねる","r":"のきをつらねる","m":"房屋、店家鱗次櫛比","m_en":"to stand in a row (of shops)"},{"w":"活気","r":"かっき","m":"活力、熱鬧氣氛","m_en":"liveliness, vigor"},{"w":"打ち上げる","r":"うちあげる","m":"施放、發射","m_en":"to launch, to set off"},{"w":"迫力","r":"はくりょく","m":"震撼力、魄力","m_en":"impact, power"},{"w":"戸惑う","r":"とまどう","m":"不知所措、困惑","m_en":"to be bewildered, to feel flustered"}],"grammar":[{"t":"〜につれて","note":"表示隨著前項的變化,後項也跟著逐漸變化。例:「夜になるにつれて、浴衣を身にまとった大勢の人々が、神社やお寺の境内へと次々に集まってきます」","t_en":"〜につれて","note_en":"Indicates that as one thing changes, another changes gradually along with it. Example: 「夜になるにつれて、浴衣を身にまとった大勢の人々が、神社やお寺の境内へと次々に集まってきます」","id":"n2-54"},{"t":"〜かと思うと","note":"表示剛發生前項動作,緊接著就出現後項的變化。例:「ドンという大きな音が響いたかと思うと、暗い空いっぱいに光が広がっていきます」","t_en":"〜かと思うと","note_en":"Indicates that right after one event, another follows immediately. Example: 「ドンという大きな音が響いたかと思うと、暗い空いっぱいに光が広がっていきます」"},{"t":"〜ずにはいられない","note":"表示忍不住、無法克制地做某事,是自然流露的反應。例:「集まった人々は思わず『わあ』と声を上げずにはいられません」","t_en":"〜ずにはいられない","note_en":"Means one cannot help doing something; a spontaneous reaction. Example: 「集まった人々は思わず『わあ』と声を上げずにはいられません」"},{"t":"〜とは限らない","note":"表示並非總是如此、不一定都是這樣,用來指出例外的可能。例:「写真や映像で見るだけでは十分に伝わるとは限らず、現地で体験する価値があります」","t_en":"〜とは限らない","note_en":"Means something is not necessarily always the case; points to possible exceptions. Example: 「写真や映像で見るだけでは十分に伝わるとは限らず、現地で体験する価値があります」","id":"n2-58"}]},
{"id":"a-n4-6-n3","variant_of":"a-n4-6","level":"n3","topic":"文化","topic_en":"Culture","title":"夏祭り","title_zh":"夏日祭典","title_en":"Summer Festivals","body":"日本では夏になると、各地でさまざまな夏祭りが開かれるため、毎年多くの人が楽しみにしています。夜になると、浴衣を着た人たちが神社やお寺の周りに少しずつ集まってきます。浴衣は涼しく見えるので、夏祭りの雰囲気を味わうのにぴったりの服装だと言われています。\n会場にはたくさんの屋台が並んでいて、歩くだけでも楽しい気分になります。たこ焼きやかき氷を食べたり、金魚すくいを楽しんだりして、思い思いに夜を過ごします。食べ物を買うだけでなく、遊びを通して家族や友達と笑い合えるところも、祭りの魅力です。\n祭りの終わりが近づくと、いよいよ大きな花火が夜空に打ち上げられます。ドンという大きな音が響いたあと、夜空いっぱいに光が広がっていきます。その美しい景色を見た人々は、思わず「わあ」と声を上げてしまうようです。\n夏祭りは、季節を感じられる日本の行事として、多くの人の大切な思い出になっています。日本に行く機会があれば、ぜひ夏の時期を選んで、祭りに参加してみてください。浴衣を着て出かければ、きっと特別な夏の体験になるでしょう。","trans":["日本到了夏天,各地都會舉辦各式各樣的夏日祭典,所以每年都有許多人期待著。一到晚上,穿著浴衣的人們就會陸續聚集到神社或寺廟周圍。據說浴衣看起來很涼爽,是最適合用來感受夏日祭典氣氛的服裝。","會場擺著許多攤販,光是走一走就讓人心情愉快。大家吃著章魚燒、刨冰,玩撈金魚,各自照自己的方式度過夜晚。不只是買吃的,透過各種遊戲能和家人朋友一起歡笑,也是祭典的魅力所在。","祭典接近尾聲時,終於會有大型煙火被施放到夜空中。伴隨著「咚」的一聲巨響,光芒綻放佈滿整片夜空。看到那美麗的景色,人們似乎會忍不住發出「哇」的驚呼。","夏日祭典作為能感受季節的日本活動,成為許多人重要的回憶。如果有機會去日本,請務必選在夏天的時期,去參加看看祭典。穿上浴衣出門的話,一定會成為特別的夏日體驗。"],"trans_en":["In summer, various festivals are held all over Japan, so many people look forward to them every year. When night falls, people in yukata gradually gather around shrines and temples. Yukata look cool and refreshing, so they are said to be the perfect outfit for enjoying the festival atmosphere.","The venue is lined with many food and game stalls, and just walking around puts you in a cheerful mood. People eat takoyaki and shaved ice, enjoy goldfish scooping, and spend the evening however they like. Beyond just buying food, being able to laugh with family and friends through the games is also part of the festival's charm.","As the festival nears its end, big fireworks are finally launched into the night sky. After a loud boom echoes, light spreads across the whole sky. Seeing the beautiful scene, people seem to let out an involuntary \"wow.\"","Summer festivals are a Japanese event where you can feel the season, and they become treasured memories for many people. If you have the chance to visit Japan, please choose the summer and try joining a festival. If you go out wearing a yukata, it will surely be a special summer experience."],"vocab":[{"w":"開かれる","r":"ひらかれる","m":"被舉辦、被召開","m_en":"to be held (an event)"},{"w":"浴衣","r":"ゆかた","m":"浴衣(夏季和服)","m_en":"yukata, summer kimono"},{"w":"雰囲気","r":"ふんいき","m":"氣氛","m_en":"atmosphere"},{"w":"屋台","r":"やたい","m":"攤販","m_en":"street stall"},{"w":"思い思い","r":"おもいおもい","m":"各自照自己想法","m_en":"each in one's own way"},{"w":"魅力","r":"みりょく","m":"魅力","m_en":"charm, appeal"},{"w":"近づく","r":"ちかづく","m":"接近","m_en":"to approach"},{"w":"打ち上げられる","r":"うちあげられる","m":"被施放(煙火等)","m_en":"to be launched"},{"w":"響く","r":"ひびく","m":"響起、迴響","m_en":"to resound, echo"},{"w":"行事","r":"ぎょうじ","m":"活動、儀式","m_en":"event, annual function"}],"grammar":[{"t":"〜ため(原因)","note":"表示原因、理由,比「から」更書面。例:「各地でさまざまな夏祭りが開かれるため、毎年多くの人が楽しみにしています」","t_en":"〜ため (reason)","note_en":"Expresses a reason or cause in a more formal tone than から. Example: 各地でさまざまな夏祭りが開かれるため、毎年多くの人が楽しみにしています"},{"t":"〜だけでなく","note":"表示「不只…還…」。例:「食べ物を買うだけでなく、遊びを通して家族や友達と笑い合えるところも、祭りの魅力です」","t_en":"〜だけでなく","note_en":"Means 'not only … but also …'. Example: 食べ物を買うだけでなく、遊びを通して家族や友達と笑い合えるところも、祭りの魅力です"},{"t":"〜ようだ","note":"根據所見所聞做出推測,「似乎…」。例:「思わず「わあ」と声を上げてしまうようです」","t_en":"〜ようだ","note_en":"Expresses an inference based on what one sees or hears: 'it seems that…'. Example: 思わず「わあ」と声を上げてしまうようです"},{"t":"〜ば(條件)","note":"表示假設條件,「如果…的話」。例:「日本に行く機会があれば、ぜひ夏の時期を選んで、祭りに参加してみてください」","t_en":"〜ば (conditional)","note_en":"Expresses a condition: 'if …'. Example: 日本に行く機会があれば、ぜひ夏の時期を選んで、祭りに参加してみてください"}]},
{"id":"a-n4-7-n2","variant_of":"a-n4-7","level":"n2","topic":"生活","topic_en":"Life","title":"ごみの出し方","title_zh":"垃圾的丟法","title_en":"How to Take Out the Garbage","body":"日本で暮らし始めて、私が最も驚かされたのは、ごみの出し方が想像以上に細かく決められていることでした。母国ではあまり意識したことがなかったため、最初は戸惑いを覚えずにはいられませんでした。ごみは「燃えるごみ」「燃えないごみ」「資源ごみ」などに分類したうえで出さなければなりません。\n出せる曜日も種類ごとに決まっており、私の住む町では燃えるごみは月曜日と木曜日に回収されます。時間にも決まりがあって、朝八時までに指定された場所へ持って行く必要があります。曜日と時間を覚えるまでは、何度も確かめざるを得ませんでした。分別を間違えると、ごみを持って行ってもらえない場合もあるので、油断はできません。\n当初は、なぜここまで細かく分けなければならないのかと、面倒に感じていました。しかし、住民が一人一人ルールを守ることに伴って、町全体の暮らしやすさが保たれているのだと気づきました。慣れてしまえば、分別そのものは決して難しい作業ではありません。むしろ、毎日の習慣になれば、ほとんど負担を感じなくなるものです。\n分別が徹底されているおかげで、町はいつも清潔な状態に保たれています。ごみの出し方は一見些細な問題に思えますが、地域の暮らしを支える大切な約束事だと言えるでしょう。外国人にとって負担に感じられる面があるのは確かですが、それに対して得られるものも決して少なくありません。","trans":["開始住在日本之後,最讓我驚訝的是垃圾的丟法被規定得比想像中還要細。因為在自己的國家不太會留意這種事,一開始我不由得感到不知所措。垃圾必須先分類成「可燃垃圾」「不可燃垃圾」「資源垃圾」等等,才能拿出去丟。","可以丟的星期幾也依種類而定,在我住的城鎮,可燃垃圾是星期一和星期四收。時間也有規定,必須在早上八點之前拿到指定的地點。在記住星期幾和時間之前,我不得不一再確認。如果分類錯了,垃圾有時會不被收走,所以不能掉以輕心。","起初,我覺得為什麼非得分得這麼細,很麻煩。但是我後來明白,隨著每位居民各自遵守規則,整個城鎮的宜居程度才得以維持。一旦習慣了,分類本身絕對不是困難的作業。反而一旦成為每天的習慣,就幾乎不會覺得是負擔了。","多虧垃圾分類徹底執行,城鎮總是保持乾淨的狀態。丟垃圾的方式乍看之下是件小事,但可以說是支撐地區生活的重要約定。對外國人來說,確實有覺得負擔的一面,但相對地,所得到的好處也絕不算少。"],"trans_en":["After I started living in Japan, what surprised me most was that the way to dispose of garbage is regulated in far more detail than I had imagined. Since I had hardly ever thought about it in my home country, I couldn't help feeling bewildered at first. Garbage has to be sorted into categories such as \"burnable,\" \"non-burnable,\" and \"recyclable\" before you put it out.","The days on which you can put it out are also set for each type; in the town where I live, burnable garbage is collected on Mondays and Thursdays. There are rules about time as well: you must take it to the designated place by eight in the morning. Until I memorized the days and times, I had no choice but to check again and again. If you sort incorrectly, your garbage may not be collected, so you can't afford to be careless.","At first, I found it troublesome and wondered why it had to be sorted this finely. However, I came to realize that, as each resident follows the rules, the livability of the whole town is maintained. Once you get used to it, the sorting itself is by no means a difficult task. If anything, once it becomes a daily habit, you hardly feel it as a burden.","Thanks to the thorough sorting, the town is always kept clean. How to put out garbage may look like a trivial matter at first glance, but it can be called an important agreement that supports community life. It is true that foreigners may find it burdensome, but what is gained in return is by no means small."],"vocab":[{"w":"戸惑い","r":"とまどい","m":"不知所措、困惑","m_en":"bewilderment, confusion"},{"w":"分類","r":"ぶんるい","m":"分類","m_en":"classification, sorting into categories"},{"w":"回収","r":"かいしゅう","m":"回收、收取","m_en":"collection, pickup"},{"w":"指定","r":"してい","m":"指定","m_en":"designation, specification"},{"w":"油断","r":"ゆだん","m":"疏忽、掉以輕心","m_en":"carelessness, letting one's guard down"},{"w":"当初","r":"とうしょ","m":"當初、起初","m_en":"at first, initially"},{"w":"住民","r":"じゅうみん","m":"居民","m_en":"resident"},{"w":"徹底","r":"てってい","m":"徹底","m_en":"thoroughness"},{"w":"清潔","r":"せいけつ","m":"乾淨、整潔","m_en":"clean, hygienic"},{"w":"些細","r":"ささい","m":"瑣碎、微不足道","m_en":"trivial, minor"}],"grammar":[{"t":"〜ずにはいられない","note":"表示忍不住、不由得做某事,多用於自然湧現的情緒。例:「最初は戸惑いを覚えずにはいられませんでした」","t_en":"~zu ni wa irarenai","note_en":"Means 'can't help but do ~', used for feelings or reactions that arise naturally. Example: 「最初は戸惑いを覚えずにはいられませんでした」"},{"t":"〜ざるを得ない","note":"表示不得不、別無選擇只能做某事。例:「曜日と時間を覚えるまでは、何度も確かめざるを得ませんでした」","t_en":"~zaru o enai","note_en":"Means 'have no choice but to ~'. Example: 「曜日と時間を覚えるまでは、何度も確かめざるを得ませんでした」","id":"n2-35"},{"t":"〜に伴って","note":"表示隨著某一變化,另一件事也跟著變化或成立。例:「住民が一人一人ルールを守ることに伴って、町全体の暮らしやすさが保たれている」","t_en":"~ni tomonatte","note_en":"Means 'along with ~, as ~ occurs'. Example: 「住民が一人一人ルールを守ることに伴って、町全体の暮らしやすさが保たれている」"},{"t":"〜に対して","note":"表示對於某事、相對於某事(對比或回應)。例:「それに対して得られるものも決して少なくありません」","t_en":"~ni taishite","note_en":"Means 'in contrast to ~, in response to ~'. Example: 「それに対して得られるものも決して少なくありません」","id":"n3-2"}]},
{"id":"a-n4-7-n3","variant_of":"a-n4-7","level":"n3","topic":"生活","topic_en":"Life","title":"ごみの出し方","title_zh":"垃圾的丟法","title_en":"How to Put Out the Garbage","body":"日本に住み始めて、私が一番驚いたのはごみの出し方がとても細かいことでした。同じごみでも、種類によって出し方が変わるため、最初は戸惑いました。ごみは「燃えるごみ」「燃えないごみ」「資源ごみ」などに分けなければなりません。\n出す曜日も種類ごとに決まっていて、私の町では燃えるごみは月曜日と木曜日です。ごみは朝八時までに、決められた場所へ持って行くように言われています。もし分け方や時間を間違えると、ごみを持って行ってもらえないこともあります。そのため、ごみを出す前に、もう一度確認することが大切です。\n最初は毎回調べなければならず、面倒だと思いました。しかし、慣れてくると、それほど難しいわけではないことが分かりました。毎日の習慣になれば、考えなくても自然に分けられるようになります。\n分別のおかげで、町はいつもきれいに保たれています。面倒でも、みんなで守るルールだと思うと、続けようという気持ちになります。","trans":["開始住在日本後,最讓我驚訝的是垃圾的丟法非常細。就算同樣是垃圾,也會因種類不同而丟法不同,所以一開始我很不知所措。垃圾必須分成「可燃垃圾」「不可燃垃圾」「資源垃圾」等等。","丟垃圾的星期幾也依種類固定,在我住的城鎮,可燃垃圾是星期一和星期四。我被告知要在早上八點之前,把垃圾拿到指定的地點。如果分類方式或時間弄錯,垃圾有時候會不被收走。因此,丟垃圾之前再確認一次很重要。","一開始每次都得查資料,我覺得很麻煩。不過,習慣之後,我發現並不是那麼困難。變成每天的習慣後,不用想也能自然分好類。","多虧了垃圾分類,城鎮總是保持乾淨。就算麻煩,一想到這是大家一起遵守的規則,就會有想繼續做下去的心情。"],"trans_en":["After I started living in Japan, what surprised me most was how detailed the rules for putting out garbage are. Even for the same garbage, the way to put it out changes depending on the type, so I was confused at first. Garbage must be sorted into burnable, non-burnable, recyclable, and so on.","The days for putting it out are also fixed by type; in my town, burnable garbage is on Mondays and Thursdays. We are told to take the garbage to the designated place by eight in the morning. If you get the sorting or the time wrong, your garbage may not be collected. For that reason, it is important to check once more before putting it out.","At first I had to look things up every time, and I thought it was a hassle. However, once I got used to it, I found it is not that difficult. When it becomes a daily habit, you come to be able to sort naturally without thinking.","Thanks to the sorting, the town is always kept clean. Even when it is troublesome, thinking of it as a rule everyone keeps together makes me feel like continuing."],"vocab":[{"w":"驚く","r":"おどろく","m":"驚訝、吃驚","m_en":"to be surprised"},{"w":"細かい","r":"こまかい","m":"細緻的、詳細的","m_en":"detailed, fine"},{"w":"種類","r":"しゅるい","m":"種類","m_en":"type, kind"},{"w":"戸惑う","r":"とまどう","m":"不知所措、困惑","m_en":"to be confused"},{"w":"決める","r":"きめる","m":"決定、規定","m_en":"to decide, to set"},{"w":"確認","r":"かくにん","m":"確認","m_en":"confirmation, to check"},{"w":"面倒","r":"めんどう","m":"麻煩","m_en":"troublesome, hassle"},{"w":"慣れる","r":"なれる","m":"習慣、熟悉","m_en":"to get used to"},{"w":"習慣","r":"しゅうかん","m":"習慣","m_en":"habit"},{"w":"保つ","r":"たもつ","m":"保持","m_en":"to keep, to maintain"}],"grammar":[{"t":"〜によって","note":"表示「依……而不同」或「根據……」。例:「種類によって出し方が変わるため」","t_en":"〜によって","note_en":"Means 'depending on ~'. Example: 「種類によって出し方が変わるため」"},{"t":"〜わけではない","note":"表示「並不是……」,部分否定。例:「それほど難しいわけではないことが分かりました」","t_en":"〜わけではない","note_en":"Means 'it does not mean ~'; a partial negation. Example: 「それほど難しいわけではないことが分かりました」","id":"n3-43"},{"t":"〜ようになる","note":"表示能力或狀態的變化,「變得能……」。例:「自然に分けられるようになります」","t_en":"〜ようになる","note_en":"Expresses a change in ability or state, 'come to ~'. Example: 「自然に分けられるようになります」","id":"n3-40"},{"t":"〜おかげで","note":"表示因為某原因而得到好結果,「多虧……」。例:「分別のおかげで」","t_en":"〜おかげで","note_en":"Means 'thanks to ~', giving credit for a good result. Example: 「分別のおかげで」","id":"n3-6"}]},
{"id":"a-n5-1-n2","variant_of":"a-n5-1","level":"n2","topic":"日常","topic_en":"Daily life","title":"私の一日","title_zh":"我的一天","title_en":"A Day in My Life","body":"私は毎朝六時に起きて、顔を洗ってから朝ご飯を食べるのが習慣になっています。七時半に家を出て、通勤のために電車に乗り、会社へ向かいます。仕事は九時からですが、遅れないように早めに家を出るようにしています。\n昼ご飯は会社の近くの店でラーメンを食べますが、味がとてもおいしくて満足しています。夕方六時に仕事が終わると、まっすぐ家に帰って晩ご飯を作ります。外食に頼らず自分で作ることで、忙しくても生活のリズムを保てる気がします。\n夜は少し日本語を勉強してから、十一時に寝ることにしています。長い時間は勉強できなくても、毎日続けることに意味があると考えています。週末は仕事があまりないため、時間に余裕が生まれます。それに伴って、友達と公園を散歩したり、映画を見たりして過ごしています。\n毎日は忙しいですが、忙しいからといって楽しみがないとは限りません。少しずつ日本語が上手になっていくのを実感できて、とてもうれしいです。この調子で続けていけば、もっと自然に話せるようになるはずです。","trans":["我每天早上六點起床,洗完臉後吃早餐,已經成了習慣。七點半出門,為了通勤搭電車前往公司。工作從九點開始,不過為了不遲到,我都盡量提早出門。","午餐在公司附近的店吃拉麵,味道非常好,讓我很滿足。傍晚六點下班後,我會直接回家做晚餐。不依賴外食、自己動手做,讓我覺得就算忙碌,也能維持生活的節奏。","晚上我會稍微學一下日文,然後在十一點就寢。即使無法讀很久,我認為每天持續下去才有意義。週末因為幾乎沒有工作,時間變得比較充裕。隨之而來的是,我會和朋友去公園散步、看電影度過週末。","雖然每天都很忙,但並不代表就沒有樂趣。能實際感受到日文一點一點變好,我非常開心。照這個步調持續下去,應該就能說得更自然。"],"trans_en":["I get up at six every morning, and washing my face and then eating breakfast has become a habit. I leave home at seven thirty and take the train to the office for my commute. Work starts at nine, but I make a point of leaving early so I won't be late.","For lunch I eat ramen at a shop near the office, and the taste is so good that I feel satisfied. When work ends at six in the evening, I go straight home and cook dinner. By cooking for myself instead of relying on eating out, I feel I can keep my daily rhythm even when I'm busy.","At night I study a little Japanese and then go to bed at eleven. Even if I can't study for long, I believe there is value in continuing every day. On weekends I have little work, so I have some time to spare. Accordingly, I spend the time walking in the park with friends and watching movies.","My days are busy, but being busy doesn't necessarily mean there is no enjoyment. I'm very happy to feel my Japanese improving little by little. If I keep going at this pace, I should be able to speak more naturally."],"vocab":[{"w":"習慣","r":"しゅうかん","m":"習慣","m_en":"habit"},{"w":"通勤","r":"つうきん","m":"通勤、上下班","m_en":"commute"},{"w":"満足","r":"まんぞく","m":"滿足","m_en":"satisfaction; to be satisfied"},{"w":"外食","r":"がいしょく","m":"在外面吃飯","m_en":"eating out"},{"w":"頼る","r":"たよる","m":"依賴、依靠","m_en":"to rely on"},{"w":"保つ","r":"たもつ","m":"保持、維持","m_en":"to maintain; to keep"},{"w":"余裕","r":"よゆう","m":"餘裕、從容","m_en":"leeway; time to spare"},{"w":"過ごす","r":"すごす","m":"度過","m_en":"to spend (time)"},{"w":"実感","r":"じっかん","m":"實際感受到","m_en":"real sense; to feel firsthand"}],"grammar":[{"t":"〜ことにしている","note":"表示自己決定並持續實行的習慣或原則。例:「十一時に寝ることにしています」。","t_en":"〜ことにしている","note_en":"Expresses a personal rule or habit one has decided on and keeps. Example: 「十一時に寝ることにしています」."},{"t":"〜に伴って","note":"表示隨著某件事的變化,另一件事也跟著發生。文中用「それに伴って」承接上一句的情況。例:「それに伴って、友達と公園を散歩したり、映画を見たりして過ごしています」。","t_en":"〜に伴って","note_en":"Means 'along with' or 'accordingly': one change brings another. Example: 「それに伴って、友達と公園を散歩したり、映画を見たりして過ごしています」."},{"t":"〜からといって〜とは限らない","note":"表示「不能因為有某個理由,就一定如此」,用來修正一般想法。例:「忙しいからといって楽しみがないとは限りません」。","t_en":"〜からといって〜とは限らない","note_en":"'Just because A doesn't necessarily mean B.' Used to correct an assumption. Example: 「忙しいからといって楽しみがないとは限りません」."},{"t":"〜ず(に)","note":"「ない」的書面語型態,表示不做某事而做另一件事,相當於「〜ないで」。例:「外食に頼らず自分で作ることで」。","t_en":"〜ず(に)","note_en":"A literary form of 〜ないで, meaning 'without doing…'. Example: 「外食に頼らず自分で作ることで」."}]},
{"id":"a-n5-1-n3","variant_of":"a-n5-1","level":"n3","topic":"日常","topic_en":"Daily life","title":"私の一日","title_zh":"我的一天","title_en":"A Day in My Life","body":"私は毎朝六時に起きて、顔を洗ってから朝ごはんを食べるようにしています。七時半に家を出て、電車で会社へ通っているため、朝はあまりゆっくりできません。仕事は九時から始まるので、遅れないように早めに出かけることにしています。\n昼は会社の近くにある店へ行って、ラーメンを食べます。そのラーメンは本当においしくて、午後も頑張ろうという気持ちになります。夕方六時に仕事が終わると、まっすぐ家に帰って晩ごはんを作ります。\n夜は少し日本語を勉強してから、十一時に寝ます。週末は仕事があまりないので、時間に余裕があります。友達と公園を散歩したり、映画を見たりして過ごします。\n毎日は忙しいですが、勉強を続けることによって、少しずつ日本語が上手になってきました。忙しい毎日ではありますが、成長を感じられるのでうれしいです。","trans":["我每天早上六點起床,洗完臉再吃早餐,盡量維持這個習慣。七點半出門,因為是搭電車去公司通勤,早上不太能悠閒。工作從九點開始,所以我習慣提早出門,以免遲到。","中午我會去公司附近的店吃拉麵。那家拉麵真的很好吃,讓我下午也有幹勁。傍晚六點下班後,我會直接回家做晚餐。","晚上稍微學一下日文,十一點就寢。週末因為幾乎沒有工作,時間比較充裕。我會和朋友到公園散步、看電影來度過。","雖然每天都很忙,但透過持續學習,日文一點一點變好了。雖然日子忙碌,但能感受到自己的成長,所以很開心。"],"trans_en":["I get up at six every morning, wash my face, and then eat breakfast, and I try to keep to that routine. I leave home at seven thirty and commute to the office by train, so I can't relax much in the morning. Work starts at nine, so I make a point of leaving early so I won't be late.","For lunch I go to a shop near the office and eat ramen. The ramen is really delicious and puts me in the mood to do my best in the afternoon. When work ends at six in the evening, I go straight home and make dinner.","At night I study a little Japanese and then go to bed at eleven. On weekends I don't have much work, so I have some free time. I spend it doing things like walking in the park with friends and watching movies.","My days are busy, but by keeping up my studies, my Japanese has been getting better little by little. Even though my days are busy, I can feel myself improving, so I'm happy."],"vocab":[{"w":"通って","r":"かよって","m":"通勤、通學(動詞「通う」)","m_en":"to commute, to attend regularly"},{"w":"遅れない","r":"おくれない","m":"不遲到、不晚(動詞「遅れる」)","m_en":"to not be late"},{"w":"早めに","r":"はやめに","m":"提早、早一點","m_en":"earlier than usual, ahead of time"},{"w":"気持ち","r":"きもち","m":"心情、感覺","m_en":"feeling, mood"},{"w":"頑張ろう","r":"がんばろう","m":"加油、努力(動詞「頑張る」)","m_en":"to do one's best"},{"w":"余裕","r":"よゆう","m":"餘裕、寬裕","m_en":"leeway, room to spare"},{"w":"過ごします","r":"すごします","m":"度過","m_en":"to spend (time)"},{"w":"続ける","r":"つづける","m":"持續、繼續","m_en":"to continue"},{"w":"成長","r":"せいちょう","m":"成長、進步","m_en":"growth"}],"grammar":[{"t":"〜ようにしている","note":"表示盡量養成某個習慣或努力去做。例:「朝ごはんを食べるようにしています」","t_en":"~you ni shite iru","note_en":"Expresses a habit one tries to keep. Example: 「朝ごはんを食べるようにしています」"},{"t":"〜ことにしている","note":"表示自己決定並持續去做的習慣。例:「早めに出かけることにしています」","t_en":"~koto ni shite iru","note_en":"Expresses a personal decision or rule one keeps. Example: 「早めに出かけることにしています」"},{"t":"〜ため","note":"表示原因、理由,語氣比「から」更書面。例:「電車で会社へ通っているため、朝はあまりゆっくりできません」","t_en":"~tame","note_en":"Gives a reason, in a more formal tone than kara. Example: 「電車で会社へ通っているため、朝はあまりゆっくりできません」"},{"t":"〜によって","note":"表示手段或方法,「藉由、透過」。例:「勉強を続けることによって、少しずつ日本語が上手になってきました」","t_en":"~ni yotte","note_en":"Indicates means or method, 'by' or 'through'. Example: 「勉強を続けることによって、少しずつ日本語が上手になってきました」"}]},
{"id":"a-n5-2-n2","variant_of":"a-n5-2","level":"n2","topic":"文化","topic_en":"Culture","title":"日本の朝ごはん","title_zh":"日本的早餐","title_en":"Breakfast in Japan","body":"日本の伝統的な朝ごはんといえば、ごはんとみそしるを中心にした和食の組み合わせが一般的です。これに焼き魚や卵料理が加わることも多く、栄養のバランスが取れているのが特徴です。のりも昔から人気があり、ごはんのおかずとして食卓に欠かせない存在だと言えるでしょう。手軽でありながら味わい深いため、多くの家庭で長く親しまれてきました。\nところが、近年は生活スタイルの変化に伴って、パンとコーヒーで朝食を済ませる人も増えています。特に若い世代にはこの傾向が強く、洋風の朝ごはんが好まれる場合が少なくありません。もちろん、若い人がみなパンを選ぶとは限らず、好みは人によってさまざまです。それでも、朝ごはんの選択肢が昔より広がったことは間違いありません。\n忙しい朝には、時間をかけて作る余裕がなく、おにぎり一つだけで済ませる人もいます。仕事や学校に間に合わせるためには、朝食を簡単にせざるを得ない場合もあるのでしょう。日本では朝ごはんのスタイルがこのように多様化していますが、あなたの国では何を食べますか。\n私自身は、パンとコーヒーの朝ごはんが人気であるのに対して、やはりごはんとみそしるが好きです。朝にしっかり食べると、体も頭も目覚めて、一日を元気に過ごすことができるからです。朝食は単なる習慣ではなく、一日の調子を整える大切な時間だと私は考えています。","trans":["提到日本傳統的早餐,一般是以白飯和味噌湯為中心的和食組合。通常還會加上烤魚或蛋料理,營養均衡是它的特色。海苔也從以前就很受歡迎,可說是配飯時餐桌上不可或缺的存在。因為簡單方便又耐人尋味,長久以來深受許多家庭喜愛。","然而近年來,隨著生活型態的改變,以麵包和咖啡解決早餐的人也愈來愈多。尤其在年輕世代中這種傾向更強,偏好西式早餐的情況並不少見。當然,並不是所有年輕人都會選擇麵包,喜好因人而異。即便如此,早餐的選擇比以前更多元,這一點是無庸置疑的。","在忙碌的早晨,沒有餘裕花時間準備,也有人只吃一個飯糰就了事。為了趕上工作或上學,有時也不得不把早餐簡化吧。日本的早餐風格就像這樣多樣化,那麼你的國家都吃些什麼呢?","我自己雖然麵包配咖啡的早餐很受歡迎,但還是喜歡白飯和味噌湯。因為早上好好吃一頓,身體和頭腦都會清醒,能夠精神飽滿地度過一天。我認為早餐不只是習慣,更是調整一天狀態的重要時間。"],"trans_en":["Speaking of traditional Japanese breakfasts, the standard is a washoku combination centered on rice and miso soup. Grilled fish or egg dishes are often added, and a well-balanced diet is one of its features. Nori has also long been popular and can be called an indispensable side dish for rice at the table. Because it is simple yet rich in flavor, it has been loved by many households for a long time.","In recent years, however, as lifestyles have changed, more people are having bread and coffee for breakfast. This tendency is especially strong among the younger generation, and Western-style breakfasts are often preferred. Of course, not every young person chooses bread, and tastes vary from person to person. Even so, there is no doubt that the choices for breakfast have broadened compared with the past.","On busy mornings, some people have no time to cook and get by with just a single onigiri. To make it to work or school on time, some may have no choice but to keep breakfast simple. Breakfast styles in Japan have diversified like this, so what do people eat in your country?","As for me, while breakfasts of bread and coffee are popular, I still prefer rice and miso soup. That is because eating well in the morning wakes up both body and mind, so I can spend the day energetically. I think breakfast is not just a habit but an important time for setting up the day's condition."],"vocab":[{"w":"伝統的","r":"でんとうてき","m":"傳統的","m_en":"traditional"},{"w":"欠かせない","r":"かかせない","m":"不可或缺的","m_en":"indispensable"},{"w":"親しまれる","r":"したしまれる","m":"受到喜愛、熟悉","m_en":"to be loved, familiar to people"},{"w":"近年","r":"きんねん","m":"近年來","m_en":"in recent years"},{"w":"傾向","r":"けいこう","m":"傾向、趨勢","m_en":"tendency, trend"},{"w":"選択肢","r":"せんたくし","m":"選項","m_en":"option, choice"},{"w":"余裕","r":"よゆう","m":"餘裕","m_en":"leeway, margin"},{"w":"多様化","r":"たようか","m":"多樣化","m_en":"diversification"},{"w":"整える","r":"ととのえる","m":"調整、整頓","m_en":"to adjust, put in order"},{"w":"済ませる","r":"すませる","m":"解決、了事","m_en":"to get by with, finish"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某變化,另一件事也跟著變化。例:「生活スタイルの変化に伴って、パンとコーヒーで朝食を済ませる人も増えています」","t_en":"〜に伴って","note_en":"Indicates that as one thing changes, another changes along with it. Example: 「生活スタイルの変化に伴って、パンとコーヒーで朝食を済ませる人も増えています」"},{"w":"","t":"〜とは限らない","note":"表示不一定、並非總是如此,用來否定過度的概括。例:「若い人がみなパンを選ぶとは限らず、好みは人によってさまざまです」","t_en":"〜とは限らない","note_en":"Means 'not necessarily', used to deny an overgeneralization. Example: 「若い人がみなパンを選ぶとは限らず、好みは人によってさまざまです」","id":"n2-58"},{"t":"〜ざるを得ない","note":"表示在情況所迫下不得不做某事。例:「朝食を簡単にせざるを得ない場合もあるのでしょう」","t_en":"〜ざるを得ない","note_en":"Means 'have no choice but to do', under pressure of circumstances. Example: 「朝食を簡単にせざるを得ない場合もあるのでしょう」","id":"n2-35"},{"t":"〜に対して","note":"表示對比,說明兩件事形成對照。例:「パンとコーヒーの朝ごはんが人気であるのに対して、やはりごはんとみそしるが好きです」","t_en":"〜に対して","note_en":"Expresses contrast between two things. Example: 「パンとコーヒーの朝ごはんが人気であるのに対して、やはりごはんとみそしるが好きです」","id":"n3-2"}]},
{"id":"a-n5-2-n3","variant_of":"a-n5-2","level":"n3","topic":"文化","topic_en":"Culture","title":"日本の朝ごはん","title_zh":"日本的早餐","title_en":"Breakfast in Japan","body":"日本の伝統的な朝ごはんといえば、ごはんとみそしるが基本です。それに焼き魚や卵、のりなどを組み合わせて食べる人も多く、昔から親しまれてきました。\n最近では、パンとコーヒーで朝ごはんをすませる家庭も増えています。特に若い人の間では、手軽に食べられるため、洋風の朝ごはんが人気があります。\nまた、朝は忙しいので、おにぎりだけで出かける人もいます。時間がないときでも、おにぎりなら歩きながら食べることができるからです。\nパンとコーヒーの朝ごはんも便利でおいしいと思いますが、わたしはやはりごはんとみそしるが好きです。みなさんの国では、どんな朝ごはんが一般的ですか。\n朝にしっかり食べるようにすると、一日を元気に過ごせます。だから、わたしは忙しい日でも朝ごはんを食べることにしています。","trans":["說到日本傳統的早餐，基本就是白飯和味噌湯。很多人還會搭配烤魚、蛋、海苔等一起吃，從以前就深受大家喜愛。","最近，用麵包和咖啡解決早餐的家庭也變多了。尤其在年輕人之間，因為可以輕鬆地吃，西式早餐很受歡迎。","另外，早上很忙，所以也有人只吃飯糰就出門。因為即使沒時間，飯糰也可以邊走邊吃。","麵包配咖啡的早餐我也覺得方便又好吃，不過我還是喜歡白飯和味噌湯。各位的國家，一般都吃什麼樣的早餐呢？","早上如果養成好好吃的習慣，一整天都能有精神地度過。所以我即使在忙碌的日子，也會決定要吃早餐。"],"trans_en":["When it comes to a traditional Japanese breakfast, rice and miso soup are the basics. Many people also combine them with grilled fish, eggs, seaweed and so on, and this has been loved since long ago.","Recently, more households get through breakfast with bread and coffee. Especially among young people, Western-style breakfasts are popular because they are easy to eat.","Also, mornings are busy, so some people head out with just a rice ball. Even when there is no time, a rice ball can be eaten while walking.","I think a breakfast of bread and coffee is convenient and tasty too, but I still like rice and miso soup best. What kind of breakfast is common in your country?","If you make a point of eating well in the morning, you can spend the whole day energetically. That is why I have decided to eat breakfast even on busy days."],"vocab":[{"w":"伝統的","r":"でんとうてき","m":"傳統的","m_en":"traditional"},{"w":"基本","r":"きほん","m":"基本","m_en":"basic"},{"w":"組み合わせる","r":"くみあわせる","m":"組合、搭配","m_en":"to combine"},{"w":"親しむ","r":"したしむ","m":"親近、喜愛","m_en":"to be fond of"},{"w":"家庭","r":"かてい","m":"家庭","m_en":"household"},{"w":"手軽","r":"てがる","m":"輕鬆簡便","m_en":"easy, simple"},{"w":"洋風","r":"ようふう","m":"西式","m_en":"Western-style"},{"w":"一般的","r":"いっぱんてき","m":"一般的、普遍的","m_en":"common, general"},{"w":"すませる","r":"すませる","m":"解決、了事","m_en":"to get by with"},{"w":"過ごす","r":"すごす","m":"度過","m_en":"to spend (time)"}],"grammar":[{"t":"〜といえば","note":"表示「說到〜」，用來提出話題。例：「日本の伝統的な朝ごはんといえば、ごはんとみそしるが基本です」","t_en":"〜to ieba","note_en":"Means 'speaking of ~' and introduces a topic. Example: 「日本の伝統的な朝ごはんといえば、ごはんとみそしるが基本です」"},{"t":"〜ため","note":"表示原因、理由。例：「手軽に食べられるため、洋風の朝ごはんが人気があります」","t_en":"〜tame","note_en":"Expresses a reason or cause. Example: 「手軽に食べられるため、洋風の朝ごはんが人気があります」"},{"t":"〜ようにする","note":"表示努力養成某習慣或盡量去做。例：「朝にしっかり食べるようにすると、一日を元気に過ごせます」","t_en":"〜you ni suru","note_en":"Means to make an effort to do something or form a habit. Example: 「朝にしっかり食べるようにすると、一日を元気に過ごせます」","id":"n3-39"},{"t":"〜ことにしている","note":"表示自己決定並持續做的習慣。例：「忙しい日でも朝ごはんを食べることにしています」","t_en":"〜koto ni shite iru","note_en":"Expresses a personal decision that has become a habit. Example: 「忙しい日でも朝ごはんを食べることにしています」"}]},
{"id":"a-n5-3-n2","variant_of":"a-n5-3","level":"n2","topic":"家族","topic_en":"Family","title":"家族の写真","title_zh":"家人的照片","title_en":"A Family Photo","body":"これは私の家族を写した一枚の写真で、見るたびに温かい気持ちにさせてくれる大切なものです。写っているのは全部で五人と一匹で、にぎやかな雰囲気が写真からも十分に伝わってくるのではないでしょうか。中央に立っているのは両親で、父は会社員として働き、母は教師として子どもたちを教えています。\n右側にいるのは兄で、大学に通う学生であり、サッカーの腕前については家族の中でも際立っています。兄のサッカーは、単に好きだからという域を超えており、その腕前は周囲も認めざるを得ないほどです。左側の小さな子は妹で、九歳になり、絵を描くことが何よりも好きな子です。兄と妹は好きなことこそ違うものの、何かに夢中になれるという点ではよく似ているように感じます。\n我が家の特徴を一つ挙げるとすれば、家族全員が犬を心から愛しているということでしょう。写真の手前にいるのが、うちの犬の「マロ」であり、家族にとっては欠かせない存在です。休みの日には、みんなで公園へ出かけて写真を撮ることが、いつの間にか我が家の習慣になっています。犬と一緒に過ごす時間に伴って、写真の枚数も自然と増えていったのかもしれません。\n現在は家族と離れて暮らしているため、以前のように毎日顔を合わせるわけにはいきません。それでも、月に一度は電話で話すようにしており、声を聞くだけで安心できます。距離が離れているからといって、気持ちまで遠くなるとは限りません。私にとって家族は、これからも何物にも代えがたい、かけがえのない宝物です。","trans":["這是一張拍下我家人的照片,是每次看都會讓人心裡暖暖的重要東西。照片裡一共有五個人和一隻狗,光看照片就能充分感受到熱鬧的氣氛。站在正中間的是我的父母,爸爸是上班族,媽媽則是教導孩子們的老師。","右邊的是哥哥,他是大學生,足球的功力在家人之中也特別突出。哥哥的足球早已超越單純喜歡的程度,那樣的實力連周圍的人也不得不承認。左邊的小孩是妹妹,今年九歲,最喜歡畫畫。哥哥和妹妹喜歡的事物雖然不同,但我覺得他們都能全心投入某件事,這一點很像。","如果要舉出我家的特色,那就是全家人都打從心底愛狗吧。照片前方的是我們家的狗「マロ」,對家人來說是不可或缺的存在。放假的日子,大家一起去公園拍照,不知不覺已成了我家的習慣。隨著和狗一起度過的時間增加,照片的數量或許也自然而然變多了。","現在我和家人分開住,所以無法像以前那樣每天見面。即便如此,我還是每個月至少通一次電話,光是聽到聲音就能感到安心。不能因為距離遠,就說感情也會跟著變遠。對我來說,家人是今後也無可取代、獨一無二的寶物。"],"trans_en":["This is a photo of my family, and it is precious to me because it warms my heart every time I look at it. There are five people and one dog in all, and the lively atmosphere comes across clearly even in the photo. The two standing in the middle are my parents: my father works as a company employee and my mother works as a teacher.","On the right is my older brother, a university student whose soccer skill stands out even within our family. His soccer goes beyond merely liking the sport, and people around him cannot help but acknowledge his ability. The small child on the left is my younger sister, who is nine and loves drawing above all else. My brother and sister like different things, but I feel they are alike in being able to throw themselves into something.","If I had to name one trait of our family, it would be that everyone loves dogs from the bottom of their hearts. The one in front in the photo is our dog Maro, who is an indispensable presence for us. On days off, going to the park together and taking photos has become a habit of ours before we knew it. As the time we spend with our dog has grown, the number of photos has probably grown naturally too.","I now live apart from my family, so I cannot see them every day as I used to. Even so, I make a point of talking with them by phone once a month, and just hearing their voices puts me at ease. Being far apart does not necessarily mean our hearts grow distant as well. To me, my family is an irreplaceable treasure, and will remain so from now on."],"vocab":[{"w":"雰囲気","r":"ふんいき","m":"氣氛、氛圍","m_en":"atmosphere, mood"},{"w":"腕前","r":"うでまえ","m":"本事、技術水準","m_en":"skill, ability"},{"w":"超える","r":"こえる","m":"超越、超過","m_en":"to exceed, to go beyond"},{"w":"周囲","r":"しゅうい","m":"周圍(的人)","m_en":"surroundings, people around"},{"w":"夢中","r":"むちゅう","m":"沉迷、全神貫注","m_en":"absorbed, engrossed"},{"w":"欠かせない","r":"かかせない","m":"不可或缺的","m_en":"indispensable"},{"w":"習慣","r":"しゅうかん","m":"習慣","m_en":"habit, custom"},{"w":"離れる","r":"はなれる","m":"分開、離開","m_en":"to be apart, to leave"},{"w":"かけがえのない","r":"かけがえのない","m":"無可取代的","m_en":"irreplaceable"}],"grammar":[{"t":"〜ざるを得ない","note":"表示「不得不…、只能…」,帶有即使不情願也無法否定的語氣。例:「その腕前は周囲も認めざるを得ないほどです」。","t_en":"~zaru o enai","note_en":"Means 'cannot help but~' or 'have no choice but to~'. Example: 「その腕前は周囲も認めざるを得ないほどです」.","id":"n2-35"},{"t":"〜に伴って","note":"表示「隨著…而…」,前項變化,後項也跟著變化。例:「犬と一緒に過ごす時間に伴って、写真の枚数も自然と増えていったのかもしれません」。","t_en":"~ni tomonatte","note_en":"Means 'along with~' or 'as~ changes'. Example: 「犬と一緒に過ごす時間に伴って、写真の枚数も自然と増えていったのかもしれません」."},{"t":"〜わけにはいかない","note":"表示基於情理或狀況「不能…、沒辦法…」。例:「以前のように毎日顔を合わせるわけにはいきません」。","t_en":"~wake ni wa ikanai","note_en":"Means 'cannot (afford to)~' due to circumstances or reason. Example: 「以前のように毎日顔を合わせるわけにはいきません」.","id":"n3-44"},{"t":"〜とは限らない","note":"表示「不一定…、未必…」,否定絕對的說法。例:「気持ちまで遠くなるとは限りません」。","t_en":"~to wa kagiranai","note_en":"Means 'not necessarily~'. Example: 「気持ちまで遠くなるとは限りません」.","id":"n2-58"}]},
{"id":"a-n5-3-n3","variant_of":"a-n5-3","level":"n3","topic":"家族","topic_en":"Family","title":"家族の写真","title_zh":"家人的照片","title_en":"A Family Photo","body":"これは私の家族の写真で、全部で五人が写っていて、とても気に入っている一枚です。写真の真ん中に立っているのは、会社員として働いている父と、先生をしている母です。\n右側に立っているのは兄で、今は大学に通っている学生です。兄はサッカーがとても得意で、そのことをわたしも誇りに思っています。左側にいる小さな子は妹で、年はまだ九歳です。妹は絵を描くのが好きで、時間があるとよく描いています。\nうちの家族は、みんな犬が大好きだという点でよく似ています。写真の前にいるのが、飼っている犬の「マロ」です。休みの日には、みんなで公園へ出かけて、写真を撮ることにしています。\n今は離れて住んでいるため、毎日会うことはできません。それでも、月に一度は電話で話すようにしています。家族はわたしにとって、何よりも大切な宝物です。","trans":["這是我家人的照片,全部有五個人,是我非常喜歡的一張。站在照片正中間的,是當上班族的爸爸,和當老師的媽媽。","站在右邊的是哥哥,現在是大學生。哥哥非常擅長踢足球,我也暗自為此感到驕傲。左邊那個小小的孩子是妹妹,年紀還只有九歲。妹妹喜歡畫畫,有空的時候常常在畫。","我們家的人在「都很喜歡狗」這一點上很像。照片前面的,是我們養的狗「マロ」。放假的日子,我們決定大家一起去公園,拍照留念。","因為現在分開住,所以沒辦法天天見面。即使如此,我還是盡量每個月通一次電話。家人對我來說,是比什麼都重要的寶物。"],"trans_en":["This is a photo of my family. Five people appear in it, and it is one of my favorites. Standing in the middle are my father, who works as a company employee, and my mother, who is a teacher.","On the right is my older brother, who is now a university student. He is very good at soccer, and I am quietly proud of that. The small child on the left is my little sister, who is still only nine years old. She likes to draw and often does so whenever she has time.","Our family is alike in that we all love dogs. In front in the photo is our dog, Maro. On days off, we have made it a habit to go to the park together and take photos.","Because we now live apart, we cannot see each other every day. Even so, I try to talk with them by phone at least once a month. To me, my family is a treasure more important than anything else."],"vocab":[{"w":"写る","r":"うつる","m":"被拍進(照片)、照出來","m_en":"to appear in a photo"},{"w":"会社員","r":"かいしゃいん","m":"公司職員、上班族","m_en":"company employee"},{"w":"得意","r":"とくい","m":"擅長、拿手","m_en":"good at, one's strong point"},{"w":"誇り","r":"ほこり","m":"驕傲、自豪","m_en":"pride"},{"w":"飼う","r":"かう","m":"飼養(動物)","m_en":"to keep (a pet)"},{"w":"出かける","r":"でかける","m":"出門、外出","m_en":"to go out"},{"w":"離れる","r":"はなれる","m":"分開、離開","m_en":"to be apart, to leave"},{"w":"宝物","r":"たからもの","m":"寶物","m_en":"treasure"},{"w":"気に入る","r":"きにいる","m":"喜歡、中意","m_en":"to be pleased with, to like"}],"grammar":[{"t":"〜として","note":"表示「以…的身分、資格」。例:「会社員として働いている父」是說爸爸以上班族的身分工作。","t_en":"~として (as)","note_en":"Shows a role or capacity. Example: 「会社員として働いている父」 means my father works as a company employee.","id":"n3-5"},{"t":"〜ため(原因)","note":"表示原因、理由,語氣比「から」更書面。例:「今は離れて住んでいるため、毎日会うことはできません」。","t_en":"~ため (cause)","note_en":"Expresses a reason, in a more formal tone than から. Example: 「今は離れて住んでいるため、毎日会うことはできません」."},{"t":"〜ことにしている","note":"表示自己決定並養成習慣,「固定這樣做」。例:「写真を撮ることにしています」。","t_en":"~ことにしている","note_en":"Shows a personal decision that has become a habit. Example: 「写真を撮ることにしています」."},{"t":"〜ようにしている","note":"表示努力讓自己持續去做某件事。例:「月に一度は電話で話すようにしています」。","t_en":"~ようにしている","note_en":"Shows an ongoing effort to do something. Example: 「月に一度は電話で話すようにしています」."}]},
{"id":"a-n5-4-n2","variant_of":"a-n5-4","level":"n2","topic":"生活","topic_en":"Daily life","title":"暮らしを支えるコンビニ","title_zh":"支撐生活的便利商店","title_en":"The Convenience Store That Supports Daily Life","body":"私は毎日のようにコンビニに通っているが、会社の隣にあるため、立ち寄るのに手間がかからず非常に便利だ。朝はおにぎりとコーヒーを買うことが多く、全部で三百円ぐらいに収まるので、家計にも優しい。手軽な値段で朝食が済ませられる点は、忙しい会社員にとって見逃せない魅力だと言えるだろう。\nコンビニの役割は買い物だけにとどまらず、電気代や水道代といった公共料金も支払うことができる。宅配便を出したり、お金をおろしたりすることも可能で、わざわざ別の場所へ出かける時間がない人には助かる。こうしたサービスが一か所にまとまっているおかげで、生活の用事を短時間で片づけることができる。\n夜になっておなかがすいたときには、温かいおでんを買って帰ることがよくある。おでんは特に冬に人気が高く、寒さが厳しくなるに伴って、買い求める客も増えていくようだ。最近は外国語の案内表示も多くなってきており、外国から来た人に対しても親切な環境が整いつつある。日本語が十分に読めない人であっても、必要な物を探しやすくなったのは大きな変化だ。\nコンビニは小さな店であるにもかかわらず、実にさまざまな用事をまとめて済ませることができる。品ぞろえやサービスが充実していればこそ、多くの人が毎日のように足を運ぶのだろう。今や日本の生活を支える存在として、コンビニはなくてはならないものになっていると言わざるを得ない。","trans":["我幾乎每天都會去便利商店,因為就在公司隔壁,順道進去不費事,非常方便。早上多半買飯糰和咖啡,全部大約三百日圓就能搞定,對家計也很友善。能用不貴的價錢輕鬆解決早餐,對忙碌的上班族來說可說是不容忽視的魅力。","便利商店的功能不只是買東西,也可以繳電費和水費這類公共費用。還能寄宅配、領錢,對沒時間特地跑到別處的人來說很有幫助。多虧這些服務集中在同一個地方,生活中的雜事可以在短時間內處理完。","晚上肚子餓的時候,我常會買熱騰騰的關東煮回家。關東煮在冬天特別受歡迎,隨著天氣越來越冷,購買的客人似乎也越來越多。最近外語的指引標示也變多了,對外國來的人也逐漸形成親切的環境。即使是日文讀得不太好的人,也變得更容易找到需要的東西,這是很大的改變。","便利商店雖然是小小的店,卻能一次處理各式各樣的事情。正因為商品和服務都很充實,才會有這麼多人幾乎每天都上門吧。如今它作為支撐日本生活的存在,可以說已經成為不可或缺的東西了。"],"trans_en":["I go to the convenience store almost every day. Because it is right next to my office, stopping by takes little effort and is very convenient. In the morning I often buy an onigiri and a coffee, and the total comes to about three hundred yen, which is easy on the household budget. Being able to take care of breakfast so cheaply and easily is an appeal that busy office workers can hardly overlook.","The role of a convenience store goes beyond shopping: you can also pay public utility bills such as electricity and water. You can send parcels and withdraw cash too, which helps people who have no time to go somewhere else just for that. Thanks to these services being gathered in one place, everyday errands can be finished in a short time.","At night, when I get hungry, I often buy warm oden and take it home. Oden is especially popular in winter, and as the cold gets harsher, it seems more and more customers come to buy it. Recently there are also more signs and guides in foreign languages, and a friendly environment for people from abroad is gradually taking shape. Even people who cannot read Japanese well can now find what they need more easily, which is a big change.","Although a convenience store is a small shop, it lets you take care of a surprising variety of errands all at once. It is precisely because the products and services are so well developed that so many people go there almost every day. Today, as something that supports life in Japan, it is fair to say that the convenience store has become indispensable."],"vocab":[{"w":"通う","r":"かよう","m":"經常往返、固定去","m_en":"to go regularly, commute"},{"w":"立ち寄る","r":"たちよる","m":"順道前往、順便去","m_en":"to drop by"},{"w":"収まる","r":"おさまる","m":"(金額、範圍)落在…之內","m_en":"to fall within, fit into"},{"w":"家計","r":"かけい","m":"家庭收支、家計","m_en":"household budget"},{"w":"公共料金","r":"こうきょうりょうきん","m":"公共事業費用(水電瓦斯等)","m_en":"utility bills"},{"w":"支払う","r":"しはらう","m":"支付、繳納","m_en":"to pay"},{"w":"充実","r":"じゅうじつ","m":"充實、完善","m_en":"substantial, well developed"},{"w":"案内表示","r":"あんないひょうじ","m":"指引標示","m_en":"guide signs"},{"w":"整う","r":"ととのう","m":"齊備、準備好","m_en":"to be in order, take shape"},{"w":"買い求める","r":"かいもとめる","m":"購買、買來(較書面)","m_en":"to buy, purchase"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某個變化,另一件事也跟著變化。例:「寒さが厳しくなるに伴って、買い求める客も増えていくようだ」","t_en":"〜に伴って","note_en":"As one thing changes, another changes along with it. Example: 「寒さが厳しくなるに伴って、買い求める客も増えていくようだ」"},{"t":"〜に対して","note":"表示針對某個對象、對…而言。例:「外国から来た人に対しても親切な環境が整いつつある」","t_en":"〜に対して","note_en":"Toward, directed at a target. Example: 「外国から来た人に対しても親切な環境が整いつつある」","id":"n3-2"},{"t":"〜にもかかわらず","note":"表示與預期相反,「儘管…卻…」。例:「コンビニは小さな店であるにもかかわらず、実にさまざまな用事をまとめて済ませることができる」","t_en":"〜にもかかわらず","note_en":"Despite, even though; the result runs against expectation. Example: 「コンビニは小さな店であるにもかかわらず、実にさまざまな用事をまとめて済ませることができる」","id":"n2-10"},{"t":"〜ざるを得ない","note":"表示在情理上不得不、只能承認…。例:「なくてはならないものになっていると言わざるを得ない」","t_en":"〜ざるを得ない","note_en":"Cannot help but, have no choice but to. Example: 「なくてはならないものになっていると言わざるを得ない」","id":"n2-35"}]},
{"id":"a-n5-4-n3","variant_of":"a-n5-4","level":"n3","topic":"生活","topic_en":"Daily life","title":"コンビニで買い物","title_zh":"在便利商店買東西","title_en":"Shopping at the Convenience Store","body":"私は毎日のように、あのコンビニへ足を運んでいます。会社のとなりにあるため、時間がないときでも気軽に寄れてとても便利です。\n朝はおにぎりとコーヒーを買うことにしています。全部で三百円ぐらいなので、朝ごはんとして特別高いわけではありません。\nコンビニでは、電気代や水道代などの支払いをすることもできます。さらに、宅配便を出したり、お金をおろしたりすることもできるので、生活に役立ちます。銀行や郵便局へ行く時間がない人にとって、これは大きな助けです。\n夜におなかがすいたときは、あたたかいおでんを買います。おでんは冬になると特に人気があり、寒い日には多くの人が買いに来ます。最近は外国語の案内も増えたため、外国から来た人にも使いやすくなりました。小さな店ではあるものの、いろいろなことができるので、日本の生活に欠かせない存在だと思います。","trans":["我幾乎每天都會去那間便利商店。因為就在公司隔壁,即使沒什麼時間也能輕鬆順道過去,非常方便。","早上我固定會買飯糰和咖啡。全部大概三百日圓,作為早餐並不算特別貴。","在便利商店也可以繳電費和水費等費用。而且還能寄宅配、領錢,對生活很有幫助。對沒有時間去銀行或郵局的人來說,這是很大的幫助。","晚上肚子餓的時候,我會買熱騰騰的關東煮。關東煮一到冬天特別受歡迎,天氣冷的日子很多人會來買。最近外語的標示也變多了,對外國來的人也變得更好用。雖然是小小的店,卻能做各式各樣的事,我認為它是日本生活中不可或缺的存在。"],"trans_en":["I go to that convenience store almost every day. Since it is right next to my company, it is very handy even when I am short on time.","In the morning, I make a point of buying an onigiri and a coffee. It costs about 300 yen in total, so it is not especially expensive for breakfast.","At a convenience store you can also pay bills such as electricity and water. On top of that, you can send parcels and withdraw money, which is useful in daily life. For people who have no time to go to a bank or post office, this is a great help.","When I get hungry at night, I buy some warm oden. Oden is especially popular in winter, and on cold days many people come to buy it. Recently there are more foreign-language guides, so it has become easier to use for people from abroad. It is a small shop, but because you can do so many things there, I think it is indispensable to life in Japan."],"vocab":[{"w":"足を運ぶ","r":"あしをはこぶ","m":"前往、特地去","m_en":"to go to, to pay a visit"},{"w":"気軽","r":"きがる","m":"輕鬆、不拘束","m_en":"casual, without hesitation"},{"w":"特別","r":"とくべつ","m":"特別、格外","m_en":"special, particular"},{"w":"支払い","r":"しはらい","m":"支付、繳費","m_en":"payment"},{"w":"宅配便","r":"たくはいびん","m":"宅配、快遞","m_en":"home delivery service"},{"w":"おろす","r":"おろす","m":"(從帳戶)領錢","m_en":"to withdraw (money)"},{"w":"助け","r":"たすけ","m":"幫助","m_en":"help, aid"},{"w":"人気","r":"にんき","m":"受歡迎","m_en":"popularity"},{"w":"案内","r":"あんない","m":"導覽、標示、介紹","m_en":"guidance, information"},{"w":"欠かせない","r":"かかせない","m":"不可或缺的","m_en":"indispensable"}],"grammar":[{"t":"〜ため","note":"表示原因、理由,語氣比「ので」稍正式。例:「会社のとなりにあるため、時間がないときでも気軽に寄れて」","t_en":"~ため (reason)","note_en":"Expresses a reason or cause, a little more formal than ので. Example: 「会社のとなりにあるため、時間がないときでも気軽に寄れて」"},{"w":"","t":"〜ことにしている","note":"表示自己決定並持續實行的習慣。例:「朝はおにぎりとコーヒーを買うことにしています」","t_en":"~ことにしている","note_en":"Expresses a personal decision or habit one keeps. Example: 「朝はおにぎりとコーヒーを買うことにしています」"},{"t":"〜わけではない","note":"表示「並不是……」,部分否定,避免被誤解。例:「朝ごはんとして特別高いわけではありません」","t_en":"~わけではない","note_en":"Means 'it is not the case that ~', a partial negation. Example: 「朝ごはんとして特別高いわけではありません」","id":"n3-43"},{"t":"〜ものの","note":"表示「雖然……但是……」,前後內容形成對比。例:「小さな店ではあるものの、いろいろなことができるので」","t_en":"~ものの","note_en":"Means 'although ~, but ~', contrasting the two parts. Example: 「小さな店ではあるものの、いろいろなことができるので」","id":"n2-11"}]},
{"id":"a-n5-5-n2","variant_of":"a-n5-5","level":"n2","topic":"生活","topic_en":"Daily life","title":"私が暮らす町","title_zh":"我住的小鎮","title_en":"The Town Where I Live","body":"私は海の近くにある小さな町に住んでいますが、海に近いこともあって空気がとてもきれいです。町には大きなビルこそありませんが、郵便局や病院、スーパーなど、暮らしに欠かせない施設は一通りそろっています。華やかな都会に比べれば地味かもしれませんが、必要なものが身近にあることは、日々の安心感につながっていると感じます。\n駅から家までは歩いて十分ほどの距離なので、移動に困ることはほとんどありません。途中には川が流れていて、橋を渡らなければ家に着けません。川沿いには桜の木が並んでおり、春になると見事な花を咲かせます。その季節には、花見を目当てにたくさんの人が訪れ、普段は静かな川沿いも一気ににぎやかになります。\n近くには古いお寺もあり、境内に入ると不思議と気持ちが落ち着きます。静けさの中で過ごす時間は、忙しい日常を忘れさせてくれる貴重なものです。一方で、買い物に関しては少し不便だと言わざるを得ません。欲しいものがすべて近所で手に入るとは限らないからです。\nそれでも、町の人々はみな親切で、暮らしやすい雰囲気が町全体に漂っています。不便さを補って余りあるほど、人の温かさがこの町の魅力だと私は考えています。こうした理由から、私はこの町が大好きで、これからもずっとここで暮らし続けたいと思っています。","trans":["我住在海邊附近的一個小鎮,也因為離海很近,空氣非常乾淨。鎮上雖然沒有什麼大樓,但郵局、醫院、超市等生活不可或缺的設施大致都齊全。和繁華的都市相比,或許顯得樸素,但我覺得必要的東西就在身邊,這份安心感能延續到每一天的生活中。","從車站走到家大約十分鐘的距離,所以出門移動幾乎不會有困擾。途中有一條河流過,不過橋就到不了家。河邊排列著櫻花樹,一到春天就綻放出絢麗的花朵。那個季節,許多人為了賞花而來,平時安靜的河邊一下子變得熱鬧起來。","附近還有一座古老的寺廟,走進境內不可思議地讓心情平靜下來。在寧靜中度過的時光,是能讓人忘卻忙碌日常的珍貴時刻。另一方面,說到買東西,不得不說有點不方便。因為想要的東西不一定都能在附近買到。","即便如此,鎮上的人都很親切,整個小鎮瀰漫著宜居的氛圍。我認為,人們的溫暖足以彌補不便,是這個小鎮的魅力所在。基於這些理由,我非常喜歡這個小鎮,今後也想一直在這裡生活下去。"],"trans_en":["I live in a small town near the sea, and partly because of that, the air is very clean. The town has no big buildings, but it has the essentials of daily life, such as a post office, a hospital, and a supermarket. It may look plain compared with a glamorous city, but I feel that having what I need close by gives me a sense of security every day.","It is about a ten-minute walk from the station to my home, so getting around is hardly a problem. A river runs along the way, and I have to cross a bridge to get home. Cherry trees line the riverbank and bloom magnificently in spring. In that season, many people come to see the blossoms, and the usually quiet riverside suddenly becomes lively.","There is also an old temple nearby, and strangely, stepping into its grounds calms my mind. The time spent in that stillness is precious, helping me forget my busy daily life. On the other hand, I have to admit that shopping is a little inconvenient. That is because you cannot always get everything you want nearby.","Even so, the townspeople are all kind, and a comfortable atmosphere fills the whole town. I believe the warmth of the people more than makes up for the inconvenience and is the town's real charm. For these reasons, I love this town and want to keep living here for a long time."],"vocab":[{"w":"欠かせない","r":"かかせない","m":"不可或缺的","m_en":"indispensable"},{"w":"施設","r":"しせつ","m":"設施","m_en":"facility"},{"w":"一通り","r":"ひととおり","m":"大致、基本上","m_en":"more or less, the basics"},{"w":"距離","r":"きょり","m":"距離","m_en":"distance"},{"w":"川沿い","r":"かわぞい","m":"河邊、沿河一帶","m_en":"riverside"},{"w":"見事","r":"みごと","m":"精彩、絢麗","m_en":"magnificent"},{"w":"目当て","r":"めあて","m":"目的、為了…","m_en":"aim, purpose"},{"w":"境内","r":"けいだい","m":"(寺廟、神社的)境內","m_en":"temple or shrine grounds"},{"w":"貴重","r":"きちょう","m":"珍貴、寶貴","m_en":"precious, valuable"},{"w":"補って","r":"おぎなって","m":"彌補、補足","m_en":"to make up for, to compensate"}],"grammar":[{"t":"〜こそ〜が","note":"強調「雖然確實…但是…」,先承認某一點再轉折。例:「大きなビルこそありませんが、郵便局や病院、スーパーなど、暮らしに欠かせない施設は一通りそろっています」","t_en":"〜こそ〜が","note_en":"Emphasizes a point while conceding it, followed by a contrast. Example: 「大きなビルこそありませんが、郵便局や病院、スーパーなど、暮らしに欠かせない施設は一通りそろっています」"},{"t":"〜に比べれば","note":"與…相比的話,用於比較基準。例:「華やかな都会に比べれば地味かもしれませんが、必要なものが身近にあることは、日々の安心感につながっていると感じます」","t_en":"〜に比べれば","note_en":"If compared with…; sets a standard for comparison. Example: 「華やかな都会に比べれば地味かもしれませんが、必要なものが身近にあることは、日々の安心感につながっていると感じます」"},{"t":"〜ざるを得ない","note":"不得不…、只能…,表示沒有其他選擇。例:「買い物に関しては少し不便だと言わざるを得ません」","t_en":"〜ざるを得ない","note_en":"Cannot help but…, have no choice but to…. Example: 「買い物に関しては少し不便だと言わざるを得ません」","id":"n2-35"},{"t":"〜とは限らない","note":"不一定…、未必…,否定絕對的說法。例:「欲しいものがすべて近所で手に入るとは限らないからです」","t_en":"〜とは限らない","note_en":"Not necessarily…, does not always…. Example: 「欲しいものがすべて近所で手に入るとは限らないからです」","id":"n2-58"}]},
{"id":"a-n5-5-n3","variant_of":"a-n5-5","level":"n3","topic":"生活","topic_en":"Daily life","title":"私の町","title_zh":"我住的小鎮","title_en":"My Town","body":"私は海の近くにある小さな町に住んでいて、空気がきれいなところが気に入っています。海が近いおかげで、毎日気持ちよく過ごせるように感じています。町には大きなビルはありませんが、郵便局や病院、スーパーなど必要なものはそろっています。\n駅から家までの道は短いですが、川や橋の景色を見ながら歩くのが楽しみです。駅から家までは歩いて十分ぐらいで、途中には川があるため、橋を渡って帰ります。春になると、川のそばの桜がとてもきれいになり、花見のために多くの人が訪れます。近くには古いお寺もあって、静かな時間を過ごしていると、自然に気持ちが落ち着きます。\n買い物は少し不便だと感じることもありますが、大きな問題というわけではありません。町の人はみんな親切なので、とても住みやすい町だと思います。\n私はこの町が大好きなので、これからもずっとここで暮らすことにしています。大きな町のような便利さはなくても、人のやさしさと自然があれば十分だと思うからです。","trans":["我住在海邊附近的一個小鎮,很喜歡這裡空氣乾淨。多虧離海很近,我覺得每天都過得很舒服。鎮上雖然沒有大樓,但郵局、醫院、超市等需要的東西都很齊全。","從車站到家的路雖然不長,但邊看河和橋的景色邊走是一種樂趣。從車站走到家大約十分鐘,因為途中有一條河,所以要過橋回家。一到春天,河邊的櫻花變得非常漂亮,很多人為了賞花而來。附近還有一座古老的寺廟,在那裡度過安靜的時光,心情自然就平靜下來。","買東西有時會覺得有點不方便,但並不是什麼大問題。鎮上的人都很親切,所以我覺得這是個非常好住的小鎮。","我非常喜歡這個小鎮,所以決定今後也要一直住在這裡。因為我覺得,就算沒有大城市那種便利,有人情味和大自然就已經足夠了。"],"trans_en":["I live in a small town near the sea, and I like that the air is clean. Thanks to being close to the sea, I feel I can spend each day comfortably. The town has no big buildings, but it has everything needed, such as a post office, a hospital and a supermarket.","The way from the station to my home is short, but I enjoy walking while looking at the river and the bridge. It takes about ten minutes on foot, and because there is a river on the way, I cross a bridge to get home. In spring, the cherry trees by the river become very beautiful, and many people come to see the blossoms. There is also an old temple nearby, and spending quiet time there naturally calms my mind.","Shopping sometimes feels a little inconvenient, but it is not a big problem. Everyone in town is kind, so I think it is a very easy place to live.","I love this town, so I have decided to keep living here from now on. That is because I think that even without the convenience of a big city, kindness from people and nature are enough."],"vocab":[{"w":"空気","r":"くうき","m":"空氣","m_en":"air"},{"w":"郵便局","r":"ゆうびんきょく","m":"郵局","m_en":"post office"},{"w":"必要","r":"ひつよう","m":"需要、必要","m_en":"necessary"},{"w":"途中","r":"とちゅう","m":"途中","m_en":"on the way"},{"w":"橋","r":"はし","m":"橋","m_en":"bridge"},{"w":"訪れる","r":"おとずれる","m":"造訪、前來","m_en":"to visit"},{"w":"落ち着く","r":"おちつく","m":"平靜下來、安定","m_en":"to calm down"},{"w":"不便","r":"ふべん","m":"不方便","m_en":"inconvenient"},{"w":"親切","r":"しんせつ","m":"親切","m_en":"kind"},{"w":"暮らす","r":"くらす","m":"生活、過日子","m_en":"to live, to get by"}],"grammar":[{"t":"〜ため(に)","note":"表示原因或目的。「川があるため」是原因,「花見のために」是目的,比「〜から」更書面、正式。","t_en":"〜ため(に)","note_en":"Expresses a reason or a purpose. 「川があるため」 gives a reason, and 「花見のために」 gives a purpose. It is more formal than 〜から."},{"t":"〜ように","note":"表示「為了達到某種狀態」或「像是…那樣」。例:「毎日気持ちよく過ごせるように感じています」,這裡接在可能形後面,描述感覺到的狀態。","t_en":"〜ように","note_en":"Expresses a state one aims at or how something seems. In 「毎日気持ちよく過ごせるように感じています」 it follows the potential form to describe a perceived state.","id":"n3-54"},{"t":"〜わけではない","note":"表示「並不是說…」,部分否定。例:「大きな問題というわけではありません」。","t_en":"〜わけではない","note_en":"Means \"it is not that...\", a partial negation. Example: 「大きな問題というわけではありません」.","id":"n3-43"},{"t":"〜ことにする","note":"表示說話者自己決定做某事。例:「ここで暮らすことにしています」,用「ている」表示這個決定持續中的心意。","t_en":"〜ことにする","note_en":"Shows the speaker's own decision to do something. In 「ここで暮らすことにしています」 the 〜ている form shows the decision still holds."}]},
{"id":"a-n5-6-n2","variant_of":"a-n5-6","level":"n2","topic":"趣味","topic_en":"Hobby","title":"私の趣味は写真","title_zh":"我的興趣是攝影","title_en":"My Hobby Is Photography","body":"私の趣味は写真を撮ることで、休みの日にはカメラを持って街を歩くのが何よりの楽しみになっている。特に決まった目的地があるわけではなく、気の向くままに歩きながら、目に留まったものにレンズを向けている。撮るのは主に花や鳥で、季節の移り変わりに伴って被写体が変わっていくところにも面白さを感じる。\n思いどおりの一枚が撮れたときの喜びは大きく、それがあるからこそ、この趣味をやめられないのだと思う。もちろん、構図や光の加減によって、同じ場所でも写真の印象はまったく違ったものになってしまう。自分でも満足できる写真が撮れたときは、時間を忘れて何度も画面を見返してしまうほどである。うまく撮れた写真ほど、誰かに見てもらいたくなるのは自然なことだろう。\nそこで、ときどき友達に写真を送って、感想を聞かせてもらうことにしている。友達はいつも「上手ですね」と言ってほめてくれるので、それが次の撮影への励みになっている。他人に見せることで、自分では気づかなかった写真の良さを知ることができる場合もある。逆に言えば、人に見せる機会がなければ、これほど熱心に続けてこられなかったかもしれない。\n最近は、もっと性能のいい新しいカメラが欲しいと思うようになってきた。しかし、カメラは決して安い買い物ではないため、今はすぐに買うのをあきらめざるを得ない。そこで、今はお金を少しずつ貯めながら、買える日が来るのを楽しみに待っているところだ。","trans":["我的興趣是拍照,假日帶著相機在街上走走,已經成了我最大的樂趣。我並沒有特別決定的目的地,只是隨興地邊走邊將鏡頭對準吸引我目光的東西。我主要拍花和鳥,隨著季節的更替,被攝對象也跟著改變,這一點也讓我覺得很有趣。","拍到理想中的一張照片時,喜悅特別大,正因為有這份喜悅,我才覺得自己沒辦法放棄這個興趣。當然,依構圖和光線的拿捏不同,即使是同一個地方,照片給人的印象也會變得完全不一樣。當拍出連自己都滿意的照片時,我甚至會忘了時間,一再回頭看螢幕。拍得越好的照片,就越會想讓別人看看,這大概是很自然的事。","所以我偶爾會把照片傳給朋友,請他們說說感想。朋友總是誇我「拍得真好呢」,這成了我下一次拍攝的動力。透過給別人看,有時也能發現連自己都沒注意到的照片優點。反過來說,如果沒有給別人看的機會,我或許就無法這麼熱衷地持續下去了。","最近我開始覺得想要一台性能更好的新相機。然而相機絕不是便宜的東西,所以現在不得不放棄馬上購買。因此我現在一點一點地存錢,期待著能買下它的那一天到來。"],"trans_en":["My hobby is taking photographs, and walking around town with my camera on days off has become my greatest pleasure. I don't have any particular destination; I just wander as I please and point my lens at whatever catches my eye. I mostly photograph flowers and birds, and I also find it interesting how my subjects change as the seasons shift.","The joy of capturing exactly the shot I had in mind is great, and I think it's precisely because of that joy that I can't give up this hobby. Of course, depending on composition and the way the light falls, the impression a photo gives can be completely different even in the same place. When I take a photo I'm satisfied with, I lose track of time and keep looking back at the screen. And the better a photo turns out, the more you naturally want someone to see it.","So every now and then I send photos to friends and ask for their impressions. My friends always praise me, saying 'You're good at this, aren't you,' and that encourages me to keep shooting. Showing my work to others sometimes lets me discover merits in a photo that I hadn't noticed myself. Conversely, without the chance to show my photos to people, I might not have kept at it this enthusiastically.","Lately I've started to want a newer camera with better performance. However, cameras are by no means cheap, so for now I have no choice but to give up on buying one right away. So I'm saving money little by little and looking forward to the day I can buy it."],"vocab":[{"w":"気の向くまま","r":"きのむくまま","m":"隨心所欲、隨興","m_en":"as one pleases, on a whim"},{"w":"目に留まる","r":"めにとまる","m":"吸引目光、被注意到","m_en":"to catch one's eye"},{"w":"移り変わり","r":"うつりかわり","m":"變遷、更替","m_en":"change, transition"},{"w":"被写体","r":"ひしゃたい","m":"被攝對象","m_en":"photographic subject"},{"w":"構図","r":"こうず","m":"構圖","m_en":"composition"},{"w":"加減","r":"かげん","m":"程度、拿捏、狀態","m_en":"degree, adjustment, condition"},{"w":"満足","r":"まんぞく","m":"滿意","m_en":"satisfaction"},{"w":"励み","r":"はげみ","m":"動力、鼓勵","m_en":"encouragement, motivation"},{"w":"感想","r":"かんそう","m":"感想","m_en":"impressions, feedback"},{"w":"性能","r":"せいのう","m":"性能","m_en":"performance, specifications"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某件事的變化,另一件事也跟著變化。例:「季節の移り変わりに伴って被写体が変わっていく」","t_en":"〜に伴って","note_en":"Indicates that as one thing changes, another changes along with it. Example: 「季節の移り変わりに伴って被写体が変わっていく」"},{"t":"〜ざるを得ない","note":"表示除此之外沒有別的選擇,不得不做。例:「今はすぐに買うのをあきらめざるを得ない」","t_en":"〜ざるを得ない","note_en":"Means one has no choice but to do something. Example: 「今はすぐに買うのをあきらめざるを得ない」","id":"n2-35"},{"t":"〜からこそ","note":"強調正因為這個理由才會有後面的結果。例:「それがあるからこそ、この趣味をやめられない」","t_en":"〜からこそ","note_en":"Emphasizes that it is precisely for this reason that the result follows. Example: 「それがあるからこそ、この趣味をやめられない」","id":"n2-9"},{"t":"〜によって","note":"表示依據不同的條件,結果會有所不同。例:「構図や光の加減によって、同じ場所でも写真の印象はまったく違ったものになってしまう」","t_en":"〜によって","note_en":"Indicates that the result differs depending on the condition. Example: 「構図や光の加減によって、同じ場所でも写真の印象はまったく違ったものになってしまう」"}]},
{"id":"a-n5-6-n3","variant_of":"a-n5-6","level":"n3","topic":"趣味","topic_en":"Hobby","title":"私の趣味は写真","title_zh":"我的興趣是攝影","title_en":"My Hobby Is Photography","body":"私の趣味は写真を撮ることで、休みの日にはカメラを持って出かけるようにしています。街の中をゆっくり歩きながら、気になるものを探すのが楽しみの一つです。特に花や鳥の写真を撮ることが多く、動くものを追いかけるのは意外と大変です。\n思った通りのきれいな写真が撮れたときは、本当にうれしくなります。そのために、何度も撮り直すことも少なくありません。撮った写真は、ときどき友達に送ることにしています。友達が「上手ですね」と言ってくれると、また撮りたい気持ちになります。\n新しいカメラがほしいのですが、値段が高いため、すぐに買えるわけではありません。そこで、今は新しいカメラのためにお金をためているところです。欲しいものを待つ時間も、趣味の楽しみの一つだと考えています。","trans":["我的興趣是拍照,假日我會盡量帶著相機出門。一邊在街上慢慢走,一邊尋找讓自己在意的事物,是我的樂趣之一。我特別常拍花和鳥,而追著會動的東西拍,其實意外地辛苦。","拍到如自己所想的漂亮照片時,真的會非常開心。為了這樣的照片,重拍好幾次也是常有的事。拍好的照片,我有時會傳給朋友。朋友對我說「拍得真好呢」,就會讓我又想再拍。","我想要新的相機,但因為價格很貴,並不是馬上就能買。所以現在正為了新相機而存錢。我認為等待想要的東西的這段時間,也是興趣的樂趣之一。"],"trans_en":["My hobby is taking photos, and on my days off I try to go out with my camera. Walking slowly around town and looking for things that catch my eye is one of my pleasures. I often photograph flowers and birds, and chasing things that move is surprisingly hard.","When I take a beautiful photo just the way I imagined, I'm truly happy. For that reason, it is not unusual for me to retake a shot many times. I make a point of sending my photos to friends from time to time. When a friend tells me 'You're good at this,' I feel like taking more photos.","I want a new camera, but because it is expensive, it's not as if I can buy it right away. So right now I am saving money for a new camera. I think the time spent waiting for something I want is also part of the fun of a hobby."],"vocab":[{"w":"趣味","r":"しゅみ","m":"興趣、嗜好","m_en":"hobby"},{"w":"気になる","r":"きになる","m":"在意、感興趣","m_en":"to catch one's interest, to be on one's mind"},{"w":"探す","r":"さがす","m":"尋找","m_en":"to look for"},{"w":"追いかける","r":"おいかける","m":"追趕、追逐","m_en":"to chase"},{"w":"意外と","r":"いがいと","m":"意外地、出乎意料","m_en":"unexpectedly, surprisingly"},{"w":"撮り直す","r":"とりなおす","m":"重拍","m_en":"to retake (a photo)"},{"w":"少なくない","r":"すくなくない","m":"不少、常有","m_en":"not uncommon, quite a few"},{"w":"値段","r":"ねだん","m":"價格","m_en":"price"},{"w":"ためる","r":"ためる","m":"存(錢)","m_en":"to save up (money)"},{"w":"気持ち","r":"きもち","m":"心情、心意","m_en":"feeling"}],"grammar":[{"t":"〜ようにしている","note":"表示平時努力養成的習慣或盡量去做。例:「休みの日にはカメラを持って出かけるようにしています」","t_en":"~you ni shite iru","note_en":"Expresses a habit one tries to keep. Example: 「休みの日にはカメラを持って出かけるようにしています」"},{"t":"〜ことにしている","note":"表示自己決定並持續遵守的做法或規則。例:「撮った写真は、ときどき友達に送ることにしています」","t_en":"~koto ni shite iru","note_en":"Expresses a personal decision or rule one keeps to. Example: 「撮った写真は、ときどき友達に送ることにしています」"},{"t":"〜ため(原因)","note":"用於說明原因、理由,語氣比「から」更書面。例:「値段が高いため、すぐに買えるわけではありません」","t_en":"~tame (reason)","note_en":"States a reason, more formal than 'kara'. Example: 「値段が高いため、すぐに買えるわけではありません」"},{"t":"〜わけではない","note":"部分否定,表示「並不是……」。例:「値段が高いため、すぐに買えるわけではありません」","t_en":"~wake dewa nai","note_en":"Partial negation meaning 'it's not that...'. Example: 「値段が高いため、すぐに買えるわけではありません」","id":"n3-43"}]},
{"id":"a-n5-7-n2","variant_of":"a-n5-7","level":"n2","topic":"生活","topic_en":"Daily life","title":"郵便局で荷物を送る","title_zh":"在郵局寄包裹","title_en":"Sending a Package at the Post Office","body":"今日は台湾へ荷物を送るために、郵便局まで足を運ぶことにしました。窓口で「これを台湾までお願いします」と伝えると、係の人から送り方について質問されました。荷物の送り方には船便と航空便の二種類があり、どちらかを選ぶ必要があります。\n「船便ですか、航空便ですか」と聞かれ、私は料金と日数を比べて少し迷いました。船便は料金が安い反面、届くまでに一か月ほどかかります。一方、航空便は早く届くのに対して、料金は高めに設定されています。つまり、安さを取れば時間がかかり、早さを取れば費用がかさむというわけです。\n私は時間を優先せざるを得ないと考え、航空便を選びました。次に、用紙に名前と住所を書き、それが終わってからお金を払いました。荷物がいつ届くのかを尋ねると、一週間ほどだと教えてもらえました。ただし、これはあくまで目安であり、必ずその日数で届くとは限りません。\n帰りに寄ったコンビニでは、切手を買ってはがきも出しました。郵便局だけでなくコンビニでも用事が済むのは、忙しい人にとってありがたいことです。外国へ荷物を送ると聞くと難しそうですが、手順さえ分かれば意外と簡単です。","trans":["今天我為了把包裹寄到台灣,決定去一趟郵局。我在櫃台說「這個要寄到台灣,麻煩你」,櫃台人員便針對寄送方式問了我問題。寄包裹的方式大致分為船運和空運兩種,必須選擇其中一種。","對方問我「要船運還是空運?」,我比較了費用和天數,稍微猶豫了一下。船運費用便宜,但相對地要花一個月左右才會到。另一方面,空運很快就會到,費用則訂得比較高。也就是說,想省錢就得花時間,想要快就會花比較多錢。","我心想不得不以時間為優先,所以選了空運。接著在表格上寫下名字和地址,寫完之後付了錢。我問包裹什麼時候會到,對方告訴我大約一個星期。不過這終究只是個參考,不見得一定會在那個天數內送達。","回程我順道去了便利商店,買了郵票,也把明信片寄了出去。不只郵局,連便利商店也能辦事,對忙碌的人來說真是方便。聽到要把包裹寄到國外好像很難,但只要知道步驟,其實意外地簡單。"],"trans_en":["Today I decided to go to the post office to send a package to Taiwan. When I said at the counter, \"Please send this to Taiwan,\" the clerk asked me about how I wanted to send it. There are two ways to send a package, sea mail and air mail, and you have to choose one.","I was asked, \"Sea mail or air mail?\" and hesitated a little as I compared the cost and the number of days. Sea mail is cheap, but on the other hand it takes about a month to arrive. Air mail, in contrast, arrives quickly but is priced higher. In other words, choosing cheap means waiting longer, and choosing fast means spending more.","I felt I had no choice but to prioritize time, so I chose air mail. Next, I wrote my name and address on the form, and after that I paid. When I asked when it would arrive, I was told about a week. However, that is only a rough estimate, and it won't necessarily arrive in exactly that many days.","On the way back, I stopped at a convenience store, bought stamps, and mailed a postcard too. Being able to take care of errands not just at the post office but also at a convenience store is a blessing for busy people. Sending a package abroad sounds difficult, but once you know the steps, it is surprisingly easy."],"vocab":[{"w":"窓口","r":"まどぐち","m":"櫃台、服務窗口","m_en":"service counter, window"},{"w":"船便","r":"ふなびん","m":"船運郵件","m_en":"sea mail"},{"w":"航空便","r":"こうくうびん","m":"空運郵件","m_en":"air mail"},{"w":"料金","r":"りょうきん","m":"費用、價錢","m_en":"fee, charge"},{"w":"届く","r":"とどく","m":"送達、寄到","m_en":"to arrive, to be delivered"},{"w":"優先","r":"ゆうせん","m":"優先","m_en":"priority, to prioritize"},{"w":"用紙","r":"ようし","m":"表格、紙張","m_en":"form, paper sheet"},{"w":"住所","r":"じゅうしょ","m":"地址","m_en":"address"},{"w":"目安","r":"めやす","m":"大致標準、參考","m_en":"rough guideline, estimate"},{"w":"手順","r":"てじゅん","m":"步驟、程序","m_en":"procedure, steps"}],"grammar":[{"t":"〜反面","note":"表示同一件事同時有相反的兩個面向。例:「船便は料金が安い反面、届くまでに一か月ほどかかります」","t_en":"〜反面","note_en":"Shows that one thing has two contrasting sides. Example: 「船便は料金が安い反面、届くまでに一か月ほどかかります」","id":"n3-79"},{"w":"","t":"〜に対して","note":"用來對比兩件事物。例:「航空便は早く届くのに対して、料金は高めに設定されています」","t_en":"〜に対して","note_en":"Used to contrast two things. Example: 「航空便は早く届くのに対して、料金は高めに設定されています」","id":"n3-2"},{"t":"〜ざるを得ない","note":"表示除此之外別無選擇、不得不。例:「私は時間を優先せざるを得ないと考え、航空便を選びました」","t_en":"〜ざるを得ない","note_en":"Means having no choice but to do something. Example: 「私は時間を優先せざるを得ないと考え、航空便を選びました」","id":"n2-35"},{"t":"〜とは限らない","note":"表示並非一定如此、也有例外。例:「必ずその日数で届くとは限りません」","t_en":"〜とは限らない","note_en":"Means not necessarily true; there can be exceptions. Example: 「必ずその日数で届くとは限りません」","id":"n2-58"}]},
{"id":"a-n5-7-n3","variant_of":"a-n5-7","level":"n3","topic":"生活","topic_en":"Daily life","title":"郵便局で荷物を送る","title_zh":"在郵局寄包裹","title_en":"Sending a Package at the Post Office","body":"今日は台湾へ送る荷物を持って、郵便局へ行くことにしました。窓口で「これを台湾までお願いします」と言うと、係の人がていねいに対応してくれました。係の人に「船便ですか、航空便ですか」と聞かれたので、送り方を選ぶことになりました。\n船便は料金が安いため、お金を節約したい人にはいい方法です。ただし、船便が悪いわけではなく、届くまでに一か月ぐらいかかるそうです。一方、航空便は早く届きますが、そのぶん料金が高くなります。安さと早さのどちらを大切にするかによって、選ぶ方法は変わります。\n私は少し高くても早いほうがいいと思って、航空便を選びました。用紙に名前と住所を書いてから、料金を払いました。「いつ届きますか」と聞くと、一週間ぐらいだと教えてくれました。\n帰りにコンビニへ寄って、必要な切手を買うことにしました。そして、買ったばかりの切手を貼って、はがきも出しました。","trans":["今天我決定帶著要寄到台灣的包裹去郵局。在櫃台說「這個要寄到台灣,麻煩你」後,櫃台人員很親切地幫我處理。因為被問到「要船運還是空運?」,所以我得選擇寄送方式。","船運運費便宜,對想省錢的人來說是個好方法。不過,並不是船運不好,而是據說要花一個月左右才會到。另一方面,空運很快就會到,但相對地運費會比較高。要選哪一種,取決於你比較重視便宜還是快速。","我覺得即使貴一點,快一點比較好,所以選了空運。在表格上寫完名字和地址後,就付了運費。我問「什麼時候會到?」,對方告訴我大概一個星期。","回程我決定順道去便利商店,買需要的郵票。然後貼上剛買的郵票,也把明信片寄出去了。"],"trans_en":["Today I decided to take a package bound for Taiwan to the post office. When I said \"Please send this to Taiwan\" at the counter, the clerk helped me politely. Since the clerk asked, \"Surface mail or air mail?\", I had to choose how to send it.","Surface mail is cheap, so it is a good method for people who want to save money. However, it is not that surface mail is bad; it is said to take about a month to arrive. Air mail, on the other hand, arrives quickly, but the fee is correspondingly higher. The method you choose depends on whether you value low cost or speed more.","I thought faster was better even if it cost a little more, so I chose air mail. After writing my name and address on the form, I paid the fee. When I asked, \"When will it arrive?\", they told me it would take about a week.","On the way home, I decided to stop by a convenience store and buy the stamps I needed. Then I put the stamps I had just bought on my postcard and mailed it too."],"vocab":[{"w":"窓口","r":"まどぐち","m":"櫃台、服務窗口","m_en":"service counter, window"},{"w":"係","r":"かかり","m":"負責的人員","m_en":"person in charge, clerk"},{"w":"船便","r":"ふなびん","m":"船運","m_en":"surface mail, shipping by sea"},{"w":"航空便","r":"こうくうびん","m":"空運","m_en":"air mail"},{"w":"料金","r":"りょうきん","m":"費用、運費","m_en":"fee, charge"},{"w":"節約","r":"せつやく","m":"節省","m_en":"saving, economizing"},{"w":"用紙","r":"ようし","m":"表格、紙張","m_en":"form, paper sheet"},{"w":"住所","r":"じゅうしょ","m":"地址","m_en":"address"},{"w":"届く","r":"とどく","m":"送達、寄到","m_en":"to arrive, to be delivered"},{"w":"切手","r":"きって","m":"郵票","m_en":"postage stamp"}],"grammar":[{"t":"〜ことにする","note":"表示自己決定做某事。例:「今日は台湾へ送る荷物を持って、郵便局へ行くことにしました」","t_en":"~koto ni suru","note_en":"Expresses a personal decision. Example: 「今日は台湾へ送る荷物を持って、郵便局へ行くことにしました」"},{"t":"〜ため","note":"表示原因、理由,語氣比「から」正式。例:「船便は料金が安いため、お金を節約したい人にはいい方法です」","t_en":"~tame","note_en":"Gives a reason, more formal than kara. Example: 「船便は料金が安いため、お金を節約したい人にはいい方法です」"},{"t":"〜わけではない","note":"表示「並不是……」,部分否定。例:「船便が悪いわけではなく、届くまでに一か月ぐらいかかるそうです」","t_en":"~wake dewa nai","note_en":"Means 'it is not that...', a partial negation. Example: 「船便が悪いわけではなく、届くまでに一か月ぐらいかかるそうです」","id":"n3-43"},{"t":"〜によって","note":"表示「根據、取決於……」,結果會隨條件而不同。例:「安さと早さのどちらを大切にするかによって、選ぶ方法は変わります」","t_en":"~ni yotte","note_en":"Means 'depending on...'; the result varies with the condition. Example: 「安さと早さのどちらを大切にするかによって、選ぶ方法は変わります」"}]},
{"id":"a-n5-8-n2","variant_of":"a-n5-8","level":"n2","topic":"生活","topic_en":"Daily life","title":"銀行で口座を作る","title_zh":"在銀行開戶","title_en":"Opening a Bank Account","body":"今日は、日本で生活を始めるうえで欠かせない銀行口座を作るために、銀行へ出かけました。窓口の担当者から「在留カードと印鑑をお願いします」と言われたので、私はかばんからそれらを取り出しました。外国人が口座を開く際には、身分を証明する書類がなければ、手続きを進めることはできません。\n次に、用紙に名前と住所、電話番号を記入することになりました。漢字が難しく、書き間違えるわけにはいかないと思ったので、時間をかけて一字ずつ丁寧に書きました。日本語を母語としない人にとって、公的な書類に記入する作業は想像以上に神経を使うものです。慣れない漢字が並んでいても、焦らず落ち着いて書けば、間違いを防ぐことができるでしょう。\n記入が終わると、担当者はキャッシュカードについて詳しく説明してくれました。「キャッシュカードは二週間ぐらいで自宅に届きます」とのことで、すぐには使えないことがわかりました。一方、通帳はその日のうちに受け取ることができました。日本で初めて手にした通帳だったので、小さな冊子にもかかわらず、特別な重みを感じました。\n手続きの間はずっと緊張していましたが、最後まで日本語だけでやり遂げることができました。外国で暮らしていると、言葉の壁のせいで諦めざるを得ない場面も少なくありません。だからこそ、今回の経験は大きな自信につながり、これからの生活に対する不安も少し和らぎました。","trans":["今天我為了開設在日本生活不可或缺的銀行帳戶，前往銀行。櫃台的承辦人員說「請給我在留卡和印章」，於是我從包包裡把它們拿了出來。外國人開戶時，如果沒有能證明身分的文件，手續就無法進行。","接著，我要在表格上填寫姓名、地址和電話號碼。漢字很難，我覺得不能寫錯，所以花了時間一個字一個字仔細地寫。對母語不是日文的人來說，填寫正式文件這件事比想像中更耗神。即使一排排都是不熟悉的漢字，只要不慌張、冷靜地寫，就能避免出錯吧。","填完之後，承辦人員詳細說明了提款卡的事。對方說「提款卡大約兩個星期會寄到家裡」，我才知道不能馬上使用。另一方面，存摺當天就拿到了。因為這是我在日本第一次拿到的存摺，雖然只是一本小冊子，卻讓我感受到特別的分量。","辦理手續的過程中我一直很緊張，但最後還是只靠日文順利完成了。在國外生活，常常會因為語言的隔閡而不得不放棄一些事情。正因如此，這次的經驗帶給我很大的自信，我對今後生活的不安也減輕了一些。"],"trans_en":["Today I went to the bank to open an account, something essential for starting life in Japan. The clerk at the counter said, \"Your residence card and seal, please,\" so I took them out of my bag. When foreigners open an account, the process cannot move forward without a document proving their identity.","Next, I had to fill in my name, address, and phone number on a form. The kanji were hard and I felt I couldn't afford to make a mistake, so I took my time and wrote each character carefully. For people whose native language is not Japanese, filling out official documents takes more mental effort than one might expect. Even with unfamiliar kanji lined up, staying calm and writing steadily should help prevent errors.","When I finished, the clerk explained the cash card in detail. I was told, \"The cash card will arrive at your home in about two weeks,\" so I learned I couldn't use it right away. The passbook, on the other hand, I received the same day. It was the first passbook I had ever held in Japan, and despite being a small booklet, it felt special and weighty.","I was nervous throughout the procedure, but I managed to finish it using only Japanese. When living abroad, there are quite a few situations where you have no choice but to give up because of the language barrier. That is exactly why this experience gave me great confidence and eased my worries about life ahead a little.\n"],"vocab":[{"w":"口座","r":"こうざ","m":"帳戶","m_en":"bank account"},{"w":"欠かせない","r":"かかせない","m":"不可或缺的","m_en":"indispensable"},{"w":"窓口","r":"まどぐち","m":"櫃台、服務窗口","m_en":"service counter"},{"w":"担当者","r":"たんとうしゃ","m":"承辦人員","m_en":"person in charge"},{"w":"記入","r":"きにゅう","m":"填寫","m_en":"to fill in"},{"w":"母語","r":"ぼご","m":"母語","m_en":"native language"},{"w":"神経を使う","r":"しんけいをつかう","m":"耗費精神、費神","m_en":"to take great care"},{"w":"通帳","r":"つうちょう","m":"存摺","m_en":"passbook"},{"w":"緊張","r":"きんちょう","m":"緊張","m_en":"nervousness, tension"}],"grammar":[{"t":"〜わけにはいかない","note":"表示基於立場或情理,不能做某事。例:「書き間違えるわけにはいかないと思ったので」表示不能寫錯。","t_en":"~wake ni wa ikanai","note_en":"Means one cannot do something given the circumstances or obligations. Example: 「書き間違えるわけにはいかないと思ったので」.","id":"n3-44"},{"t":"〜にとって","note":"表示從某人的立場來看。例:「日本語を母語としない人にとって」表示對母語不是日文的人來說。","t_en":"~ni totte","note_en":"Means 'for' or 'from the standpoint of' someone. Example: 「日本語を母語としない人にとって」.","id":"n3-8"},{"t":"〜にもかかわらず","note":"表示儘管前項如此,後項卻是相反的結果。例:「小さな冊子にもかかわらず」表示雖然只是小冊子。","t_en":"~ni mo kakawarazu","note_en":"Means 'despite' or 'in spite of'. Example: 「小さな冊子にもかかわらず」.","id":"n2-10"},{"t":"〜ざるを得ない","note":"表示不得不做某事,沒有其他選擇。例:「諦めざるを得ない場面も少なくありません」表示不得不放棄的場面不少。","t_en":"~zaru o enai","note_en":"Means one has no choice but to do something. Example: 「諦めざるを得ない場面も少なくありません」.","id":"n2-35"}]},
{"id":"a-n5-8-n3","variant_of":"a-n5-8","level":"n3","topic":"生活","topic_en":"Daily life","title":"銀行で口座を作る","title_zh":"在銀行開戶","title_en":"Opening a Bank Account","body":"今日は新しい生活に必要な銀行口座を作るために、近くの銀行へ行きました。窓口の人に「在留カードと印鑑をお願いします」と言われ、すぐに出しました。\n次に、用紙に名前と住所と電話番号を書くように言われました。漢字が難しくて自信がなかったため、間違えないようにゆっくり書きました。外国人にとって、漢字で書く手続きは意外と大変だと感じました。\nキャッシュカードは二週間ぐらいで家に届くことになっていると教えてもらいました。一方、通帳はその日のうちに受け取ることができました。日本に来て初めて持つ通帳なので、とても特別なものに感じました。\n手続きの間は少し緊張しましたが、日本語だけで全部できたことが何よりうれしかったです。この経験によって、日本での生活に少し自信が持てるようになりました。","trans":["今天我為了開立新生活所需的銀行帳戶，去了附近的銀行。櫃台的人要我出示在留卡和印章，我立刻拿了出來。","接著，對方請我在表格上寫下名字、地址和電話號碼。因為漢字很難、我沒什麼把握，所以我為了避免寫錯而慢慢地寫。我覺得對外國人來說，用漢字填寫的手續意外地辛苦。","對方告訴我，提款卡大約兩個星期會寄到家裡。另一方面，存摺當天就能拿到。因為這是我來到日本後第一次擁有的存摺，所以覺得格外特別。","辦手續的時候雖然有點緊張，但能全程只用日文辦完，比什麼都開心。透過這次經驗，我對在日本的生活多了一點自信。"],"trans_en":["Today I went to a nearby bank to open the bank account I need for my new life. The teller asked for my residence card and seal, so I handed them over right away.","Next, I was asked to write my name, address, and phone number on a form. Because kanji are hard and I wasn't confident, I wrote slowly so I wouldn't make mistakes. I felt that, for foreigners, filling things out in kanji is surprisingly difficult.","I was told that the cash card would arrive at my home in about two weeks. On the other hand, I was able to receive the passbook that same day. Since it was the first passbook I had ever held since coming to Japan, it felt very special.","I was a little nervous during the process, but what made me happiest was that I managed everything in Japanese alone. Thanks to this experience, I've come to feel a bit more confident about life in Japan."],"vocab":[{"w":"口座","r":"こうざ","m":"帳戶","m_en":"bank account"},{"w":"窓口","r":"まどぐち","m":"櫃台、服務窗口","m_en":"service counter, teller window"},{"w":"在留カード","r":"ざいりゅうカード","m":"在留卡","m_en":"residence card"},{"w":"印鑑","r":"いんかん","m":"印章","m_en":"personal seal"},{"w":"用紙","r":"ようし","m":"表格、紙張","m_en":"form, sheet of paper"},{"w":"手続き","r":"てつづき","m":"手續","m_en":"procedure, paperwork"},{"w":"通帳","r":"つうちょう","m":"存摺","m_en":"passbook"},{"w":"届く","r":"とどく","m":"送達、寄到","m_en":"to arrive, to be delivered"},{"w":"緊張","r":"きんちょう","m":"緊張","m_en":"nervousness, tension"},{"w":"自信","r":"じしん","m":"自信","m_en":"confidence"}],"grammar":[{"t":"〜ように言われる","note":"表示被要求或被指示做某事。文中例句:「用紙に名前と住所と電話番号を書くように言われました」","t_en":"~ you ni iwareru","note_en":"Means being told or asked to do something. Example: 用紙に名前と住所と電話番号を書くように言われました"},{"w":"","t":"〜ため(に)","note":"表示原因或理由,語氣比「ので」更書面。文中例句:「漢字が難しくて自信がなかったため、間違えないようにゆっくり書きました」","t_en":"~ tame (ni)","note_en":"Expresses a reason or cause, more formal than ので. Example: 漢字が難しくて自信がなかったため、間違えないようにゆっくり書きました"},{"t":"〜ことになっている","note":"表示規定或預定的安排。文中例句:「キャッシュカードは二週間ぐらいで家に届くことになっていると教えてもらいました」","t_en":"~ koto ni natte iru","note_en":"Indicates a rule or a scheduled arrangement. Example: キャッシュカードは二週間ぐらいで家に届くことになっていると教えてもらいました"},{"t":"〜によって","note":"表示原因或手段,「透過、由於」。文中例句:「この経験によって、日本での生活に少し自信が持てるようになりました」","t_en":"~ ni yotte","note_en":"Indicates cause or means: 'through, due to'. Example: この経験によって、日本での生活に少し自信が持てるようになりました"}]},
{"id":"a-n5-9-n2","variant_of":"a-n5-9","level":"n2","topic":"生活","topic_en":"Everyday life","title":"公園で過ごす一日","title_zh":"在公園度過的一天","title_en":"A Day Spent at the Park","body":"土曜日は天気に恵まれ、絶好の外出日和になったので、私は友達と公園へ出かける約束をしていた。待ち合わせの場所は駅で、時間は朝九時と決めてあった。約束どおり朝九時に駅で会い、私たちは一緒に公園へ向かうことにした。\n実は前の晩のうちに、卵焼きとおにぎり、それに野菜を詰めたお弁当を用意しておいた。友達の分も少し多めに作ったのは、一緒に食べたほうが楽しいと思ったからだ。公園までは自転車で行ったが、道には桜の木がたくさん並んでいた。風が心地よく、季節の移り変わりを肌で感じながらペダルをこぐことができた。\n公園に着くと、私たちはベンチに座ってお弁当を食べた。外で食べると味が引き立つとも言われるが、本当にとてもおいしかった。友達も「おいしい」と言ってくれたので、作った甲斐があったと感じた。食べ終わってからは、バドミントンをしたり、写真を撮ったりして過ごした。\n周りを見渡すと、みんな楽しそうな表情をしていたのが印象的だった。夕方に家へ帰ったときには、少し疲れたものの、気持ちは満ち足りていた。とはいえ、振り返ってみると、とても充実した楽しい一日だったと言える。来週もまた公園へ行きたいと思うが、いつも天気に恵まれるとは限らない。","trans":["星期六天氣很好,正是適合外出的絕佳日子,所以我和朋友約好要去公園。碰面的地點是車站,時間定在早上九點。我們依約在早上九點於車站見面,然後一起前往公園。","其實前一天晚上我就先準備好便當,裡面放了煎蛋、飯糰和蔬菜。也幫朋友多做了一點,是因為覺得一起吃會更開心。去公園是騎腳踏車,路上並排種著許多櫻花樹。風吹起來很舒服,我一邊騎車,一邊親身感受季節的更替。","到了公園,我們坐在長椅上吃便當。雖然常說在戶外吃東西會更美味,但這次真的非常好吃。朋友也說「好吃」,讓我覺得做這份便當很值得。吃完之後,我們打了羽毛球,也拍了照片。","環顧四周,大家看起來都很開心,令人印象深刻。傍晚回到家時,雖然有點累,但心裡很滿足。話雖如此,回頭想想,這真是充實又快樂的一天。我下星期也想再去公園,不過天氣不見得每次都這麼好。"],"trans_en":["The Saturday weather was lovely, perfect for going out, so I had made plans with a friend to go to the park. We had decided to meet at the station at nine in the morning. As promised, we met at the station at nine and headed to the park together.","In fact, I had prepared a lunch box the night before, packed with rolled omelet, rice balls and vegetables. I made a little extra for my friend because I thought eating together would be more fun. We went to the park by bicycle, and the road was lined with many cherry trees. The breeze felt pleasant, and I could feel the changing of the seasons on my skin as I pedaled.","When we arrived at the park, we sat on a bench and ate the lunch. They say food tastes better outdoors, and it really was delicious. My friend said it was delicious too, so I felt the effort of making it was worthwhile. After eating, we spent time playing badminton and taking photos.","Looking around, I was struck by how happy everyone looked. By the time I got home in the evening I was a little tired, but I felt fully satisfied. Even so, looking back, it was a truly fulfilling and enjoyable day. I want to go to the park again next week, but the weather won't always be this kind.\n"],"vocab":[{"w":"恵まれる","r":"めぐまれる","m":"得天獨厚、受到眷顧","m_en":"to be blessed with"},{"w":"絶好","r":"ぜっこう","m":"絕佳、最好的","m_en":"perfect, ideal"},{"w":"待ち合わせ","r":"まちあわせ","m":"約定碰面","m_en":"meeting up, rendezvous"},{"w":"用意","r":"ようい","m":"準備","m_en":"preparation"},{"w":"詰める","r":"つめる","m":"塞入、裝填","m_en":"to pack, to stuff in"},{"w":"心地よい","r":"ここちよい","m":"舒服的、愉快的","m_en":"pleasant, comfortable"},{"w":"引き立つ","r":"ひきたつ","m":"更突顯、更出色","m_en":"to be enhanced, to stand out"},{"w":"甲斐","r":"かい","m":"價值、成效","m_en":"worth, result of effort"},{"w":"印象的","r":"いんしょうてき","m":"令人印象深刻的","m_en":"impressive, memorable"},{"w":"充実","r":"じゅうじつ","m":"充實","m_en":"fulfillment, richness"}],"grammar":[{"t":"〜ものの","note":"表示「雖然……但是……」,前後內容形成對比。例:「少し疲れたものの、気持ちは満ち足りていた」","t_en":"〜ものの","note_en":"Means 'although ... but ...', contrasting two statements. Example: 「少し疲れたものの、気持ちは満ち足りていた」","id":"n2-11"},{"w":"","t":"〜甲斐があった","note":"表示付出的努力有了回報、很值得。例:「作った甲斐があったと感じた」","t_en":"〜甲斐があった","note_en":"Means the effort paid off or was worthwhile. Example: 「作った甲斐があったと感じた」"},{"t":"〜とはいえ","note":"表示「話雖如此」,承接前文再提出另一種看法。例:「とはいえ、振り返ってみると、とても充実した楽しい一日だったと言える」","t_en":"〜とはいえ","note_en":"Means 'that said' or 'even so', introducing a view that qualifies the previous statement. Example: 「とはいえ、振り返ってみると、とても充実した楽しい一日だったと言える」","id":"n2-12"},{"t":"〜とは限らない","note":"表示「不一定……」,否定絕對的說法。例:「いつも天気に恵まれるとは限らない」","t_en":"〜とは限らない","note_en":"Means 'not necessarily', denying an absolute claim. Example: 「いつも天気に恵まれるとは限らない」","id":"n2-58"}]},
{"id":"a-n5-9-n3","variant_of":"a-n5-9","level":"n3","topic":"生活","topic_en":"Everyday life","title":"公園で遊ぶ一日","title_zh":"在公園玩耍的一天","title_en":"A Day Playing in the Park","body":"土曜日はとてもいい天気で、友達と公園に行く約束をしていたので、朝から楽しみでした。朝九時に駅で友達と待ち合わせをして、そこから自転車で公園へ向かいました。道には桜の木がたくさんあり、風も気持ちがよくて、自転車に乗るのが楽しくなりました。\n前の晩に、卵焼きとおにぎりと野菜を入れたお弁当を作っておきました。友達にも食べてもらえるように、友達の分も少しだけ作っておきました。公園のベンチに座って食べると、外で食べるせいか、いつもよりずっとおいしく感じました。\n友達も「おいしい」と言ってくれたので、作ったかいがあったと思いました。食べ終わってから、友達とバドミントンをしたり、写真を撮ったりしました。みんなとても楽しそうで、その様子を見ていると、私まで笑顔になりました。\n夕方になったので、私は家に帰ることにしました。少し疲れましたが、友達と過ごせてとても楽しい一日になりました。来週もまた同じように、公園へ遊びに行けたらいいなと思っています。","trans":["星期六天氣非常好,因為和朋友約好要去公園,所以從早上就很期待。早上九點在車站和朋友會合,然後騎腳踏車前往公園。路上有很多櫻花樹,風吹起來也很舒服,讓騎腳踏車變得很愉快。","前一天晚上,我先做好了裝有煎蛋、飯糰和蔬菜的便當。為了讓朋友也能吃到,我也多少做了一點朋友的份。坐在公園的長椅上吃,也許是因為在戶外吃的關係,感覺比平常好吃許多。","朋友也說「好吃」,讓我覺得自己做這些很值得。吃完之後,我和朋友一起打羽毛球、拍照。大家都非常開心,看著那個景象,連我也跟著笑了起來。","傍晚時,我決定回家。雖然有點累,但能和朋友一起度過,成了非常快樂的一天。我希望下星期也能像這樣再去公園玩。"],"trans_en":["Saturday had really nice weather, and since I had promised to go to the park with my friend, I was looking forward to it from the morning. We met at the station at nine and rode our bicycles to the park from there. There were many cherry trees along the road and the breeze felt good, so riding was fun.","The night before, I prepared a lunch box with tamagoyaki, rice balls, and vegetables. So that my friend could eat too, I also made a little extra for them. Sitting on a bench in the park to eat, maybe because we were outside, it tasted much better than usual.","My friend said it was delicious, so I felt that the effort of making it had been worthwhile. After eating, we played badminton and took photos. Everyone looked very happy, and watching them made me smile too.","As evening came, I decided to head home. I was a little tired, but it became a very enjoyable day spent with my friend. I hope I can go to the park again next week in the same way."],"vocab":[{"w":"約束","r":"やくそく","m":"約定、約好","m_en":"promise, appointment"},{"w":"待ち合わせ","r":"まちあわせ","m":"約定會合、碰面","m_en":"meeting up, rendezvous"},{"w":"向かう","r":"むかう","m":"前往、朝向","m_en":"to head toward"},{"w":"前の晩","r":"まえのばん","m":"前一天晚上","m_en":"the night before"},{"w":"卵焼き","r":"たまごやき","m":"日式煎蛋捲","m_en":"Japanese rolled omelet"},{"w":"分","r":"ぶん","m":"份、份量","m_en":"share, portion"},{"w":"気持ち","r":"きもち","m":"感覺、心情","m_en":"feeling"},{"w":"様子","r":"ようす","m":"樣子、情況","m_en":"appearance, state of things"},{"w":"笑顔","r":"えがお","m":"笑容","m_en":"smiling face"},{"w":"夕方","r":"ゆうがた","m":"傍晚","m_en":"evening, dusk"}],"grammar":[{"t":"〜ように","note":"表示目的,「為了能夠……」。例:「友達にも食べてもらえるように、友達の分も少しだけ作っておきました」","t_en":"~ように (purpose)","note_en":"Expresses purpose, 'so that ~'. Example: 友達にも食べてもらえるように、友達の分も少しだけ作っておきました","id":"n3-54"},{"t":"〜ことにする","note":"表示自己決定做某事。例:「夕方になったので、私は家に帰ることにしました」","t_en":"~ことにする","note_en":"Expresses one's own decision to do something. Example: 夕方になったので、私は家に帰ることにしました"},{"t":"〜せいか","note":"表示「也許是因為……」,原因不太確定,多半帶來某種結果。例:「外で食べるせいか、いつもよりずっとおいしく感じました」","t_en":"~せいか","note_en":"'Perhaps because ~', for an uncertain cause. Example: 外で食べるせいか、いつもよりずっとおいしく感じました"},{"t":"〜かいがある","note":"表示努力得到回報、「很值得」。例:「作ったかいがあったと思いました」","t_en":"~かいがある","note_en":"Means the effort was worthwhile. Example: 作ったかいがあったと思いました"}]},
{"id":"eh-n4-2-n2","variant_of":"eh-n4-2","level":"n2","topic":"繪本","topic_en":"Picture book","title":"ラーメン屋での初体験","title_zh":"在拉麵店的第一次體驗","title_en":"A First Time at a Ramen Shop","body":"駅の近くに評判のラーメン屋があり、今日、たぬたろうは思い切って初めてそこの暖簾をくぐってみることにした。入口には券売機が置かれており、この店では先に食券を買う仕組みになっているらしい。ところが、ボタンの数があまりに多く、どれを押せばよいのか見当もつかず、たぬたろうは立ち尽くしてしまった。\nそんなとき、後ろに並んでいたコンちゃんが「いちばん左が普通のラーメンだよ」と親切に教えてくれた。初めての店では戸惑うことが多いだけに、こうした一言は何よりありがたいものである。おかげで無事に食券を買うことができ、たぬたろうはほっとして席に着いた。\n席で食券を渡すと、店員さんから「麺のかたさはどうしますか」と尋ねられた。日本のラーメン店では、好みに合わせて麺のかたさを選べる店も少なくないようだ。たぬたろうは少し迷ったものの、「かためでお願いします」と思い切って答えた。「かため」とは、普通よりも少しかたく茹でた麺のことを指す言葉である。\n運ばれてきた熱いスープとかための麺の組み合わせは、期待を上回る最高のおいしさだった。たぬたろうは夢中になって食べ続け、気がつけばスープまで全部飲み干してしまっていた。券売機の前では途方に暮れたが、親切な助けのおかげで、忘れられない初体験になったと言えるだろう。","trans":["車站附近有一家頗有口碑的拉麵店,今天狸太郎下定決心,第一次走進了這家店。入口放著一台售票機,聽說這家店的規矩是要先買餐券。然而按鈕實在太多,他完全不知道該按哪一個,只能呆站在原地。","就在這時,排在後面的コン親切地告訴他:「最左邊是普通的拉麵喔。」在第一次去的店裡本來就常常不知所措,所以這樣一句話比什麼都讓人感激。多虧如此,他順利買到了餐券,鬆了一口氣後在座位上坐下。","在座位上把餐券交出去後,店員問他:「麵的軟硬要怎麼做?」在日本的拉麵店裡,依個人喜好選擇麵的軟硬度的店似乎並不少見。狸太郎雖然猶豫了一下,還是鼓起勇氣回答:「麻煩偏硬一點。」所謂「かため」,指的是比一般煮得稍微硬一點的麵。","端上來的熱湯配上偏硬的麵,美味程度超乎期待,可說是最棒的。狸太郎吃得入迷,回過神來時連湯都全部喝光了。雖然在售票機前曾不知所措,但多虧有人親切相助,這可以說是一次難忘的初體驗。"],"trans_en":["Near the station there is a well-regarded ramen shop, and today Tanutaro decided to take the plunge and step inside for the first time. A ticket machine stood at the entrance, and it seems that at this shop you buy a meal ticket first. However, there were so many buttons that he had no idea which one to press, and he simply stood there frozen.","Just then, Kon, who was in line behind him, kindly told him, \"The leftmost one is the regular ramen.\" Since one often feels at a loss in a shop one has never been to, a word like this is more welcome than anything. Thanks to that, he managed to buy his ticket and sat down at a seat with a sigh of relief.","When he handed over his ticket at the seat, the staff member asked him, \"How firm would you like your noodles?\" At ramen shops in Japan, it seems that quite a few let you choose the firmness of the noodles to suit your taste. Tanutaro hesitated a little, but boldly answered, \"Firm, please.\" \"Katame\" is a word that refers to noodles boiled slightly firmer than usual.","The combination of the hot soup and the firm noodles that arrived was delicious beyond his expectations, simply the best. Tanutaro ate with total absorption, and before he knew it he had finished all of the soup too. He had been at a loss in front of the ticket machine, but thanks to someone's kind help, it turned out to be an unforgettable first experience."],"vocab":[{"w":"評判","r":"ひょうばん","m":"評價、口碑","m_en":"reputation, popularity"},{"w":"暖簾をくぐる","r":"のれんをくぐる","m":"掀開暖簾走進店裡","m_en":"to walk into a shop (lit. pass under the noren curtain)"},{"w":"仕組み","r":"しくみ","m":"結構、運作方式、規矩","m_en":"mechanism, system"},{"w":"見当","r":"けんとう","m":"推測、頭緒(見当もつかない:毫無頭緒)","m_en":"guess, idea (見当もつかない: have no idea)"},{"w":"立ち尽くす","r":"たちつくす","m":"呆站著、愣在原地","m_en":"to stand rooted to the spot"},{"w":"戸惑う","r":"とまどう","m":"不知所措、困惑","m_en":"to be bewildered, to be at a loss"},{"w":"尋ねる","r":"たずねる","m":"詢問","m_en":"to ask, to inquire"},{"w":"上回る","r":"うわまわる","m":"超過、勝過","m_en":"to exceed, to surpass"},{"w":"途方に暮れる","r":"とほうにくれる","m":"不知如何是好、走投無路","m_en":"to be at a loss, to not know what to do"}],"grammar":[{"t":"〜だけに","note":"表示「正因為……所以更加」,前句的事實導出相應的結果或感受。例:「初めての店では戸惑うことが多いだけに、こうした一言は何よりありがたいものである」","t_en":"〜だけに","note_en":"'Precisely because ...' — the first fact naturally leads to a stronger result or feeling. Example: 「初めての店では戸惑うことが多いだけに、こうした一言は何よりありがたいものである」"},{"t":"〜に合わせて","note":"表示配合、依照某個條件或喜好來調整。例:「好みに合わせて麺のかたさを選べる店も少なくないようだ」","t_en":"〜に合わせて","note_en":"'In accordance with / to suit ...' — adjusting to a condition or preference. Example: 「好みに合わせて麺のかたさを選べる店も少なくないようだ」"},{"t":"〜ものの","note":"表示「雖然……但是……」,後句常接與前句預期相反的行動。例:「たぬたろうは少し迷ったものの、「かためでお願いします」と思い切って答えた」","t_en":"〜ものの","note_en":"'Although ... (still ...)' — the second clause goes against what the first would suggest. Example: 「たぬたろうは少し迷ったものの、「かためでお願いします」と思い切って答えた」","id":"n2-11"},{"t":"〜とは〜のことだ","note":"用來下定義、解釋詞語的意思。例:「「かため」とは、普通よりも少しかたく茹でた麺のことを指す言葉である」","t_en":"〜とは〜のことだ","note_en":"Used to define or explain the meaning of a word. Example: 「「かため」とは、普通よりも少しかたく茹でた麺のことを指す言葉である」"}]},
{"id":"eh-n4-2-n3","variant_of":"eh-n4-2","level":"n3","topic":"繪本","topic_en":"Picture book","title":"ラーメン屋での初体験","title_zh":"在拉麵店的第一次體驗","title_en":"A First Time at a Ramen Shop","body":"駅の近くに、多くの人が訪れる人気のラーメン屋があります。今日、たぬたろうは前から気になっていたその店に、初めて入ってみることにしました。\n入口には券売機が置いてあり、この店では先に食券を買うきまりだそうです。ボタンが多すぎて、どれを押せばいいのかわからず困っていました。後ろにいたコンちゃんが「いちばん左が普通のラーメンだよ」と教えてくれました。\nおかげで無事に食券を買うことができ、たぬたろうは席に座って店員さんに食券を渡しました。すると、店員さんに「麺のかたさはどうしますか」と聞かれました。たぬたろうは「かためでお願いします」と答えました。かためとは、麺を普通よりも少しかたくゆでることによって、歯ごたえを出したものです。\n運ばれてきた熱いスープとかための麺は、思っていた以上においしく、最高でした。たぬたろうは夢中になって食べ、気がつくとスープを全部飲んでしまっていました。この店が人気な理由が、たぬたろうにもよくわかりました。","trans":["車站附近有一家許多人光顧的人氣拉麵店。今天狸太郎決定第一次走進這家他之前就一直很在意的店。","入口擺著一台售票機,聽說這家店的規矩是要先買餐券。按鈕太多了,他不知道該按哪一個,正在發愁。站在後面的コン告訴他:「最左邊是普通的拉麵喔。」","多虧如此,他順利買好了餐券,坐到位子上把餐券交給店員。接著店員問他:「麵的軟硬要怎麼做?」狸太郎回答:「麻煩偏硬一點。」所謂「かため」,就是把麵煮得比平常稍硬,做出有嚼勁的口感。","送上來的熱湯和偏硬的麵,比他想像的還要好吃,真是太棒了。狸太郎吃得入迷,回過神來湯已經全部喝光了。狸太郎也明白了這家店受歡迎的理由。"],"trans_en":["Near the station there is a popular ramen shop that many people visit. Today, Tanutaro decided to try going into the shop he had been curious about for a while, for the first time.","There was a ticket vending machine at the entrance, and apparently the rule at this shop is to buy a meal ticket first. There were so many buttons that he was troubled, not knowing which one to press. Kon-chan, who was behind him, told him, \"The leftmost one is the regular ramen.\"","Thanks to that, he managed to buy his ticket, sat down, and handed it to the staff. Then the staff member asked him, \"How firm would you like your noodles?\" Tanutaro answered, \"Firm, please.\" Katame means noodles boiled a little firmer than usual, giving them a chewy texture.","The hot soup and the firm noodles that arrived were even better than he had expected, simply the best. Tanutaro ate with total absorption, and before he knew it he had drunk all the soup. Tanutaro understood why this shop is so popular."],"vocab":[{"w":"訪れる","r":"おとずれる","m":"造訪、前往","m_en":"to visit"},{"w":"気になる","r":"きになる","m":"在意、掛心","m_en":"to be curious about, to be on one's mind"},{"w":"券売機","r":"けんばいき","m":"售票機、餐券機","m_en":"ticket vending machine"},{"w":"食券","r":"しょっけん","m":"餐券","m_en":"meal ticket"},{"w":"押す","r":"おす","m":"按、推","m_en":"to press, to push"},{"w":"困る","r":"こまる","m":"困擾、為難","m_en":"to be troubled"},{"w":"店員","r":"てんいん","m":"店員","m_en":"shop staff, clerk"},{"w":"歯ごたえ","r":"はごたえ","m":"嚼勁、口感","m_en":"chewy texture"},{"w":"夢中","r":"むちゅう","m":"入迷、專注","m_en":"absorbed, engrossed"},{"w":"理由","r":"りゆう","m":"理由","m_en":"reason"}],"grammar":[{"t":"〜ことにする","note":"表示自己決定做某事。文中例句:「初めて入ってみることにしました」,表示他決定進去看看。","t_en":"〜koto ni suru","note_en":"Expresses one's own decision to do something. Example: 「初めて入ってみることにしました」 means he decided to go in for the first time."},{"w":"","t":"〜によって","note":"表示手段或方法,「藉由、透過」。文中例句:「少しかたくゆでることによって」,說明靠煮得稍硬來做出口感。","t_en":"〜ni yotte","note_en":"Indicates means or method, 'by, through'. Example: 「少しかたくゆでることによって」 means by boiling the noodles a little firmer."},{"t":"〜ず(に)","note":"〜ない的書面語形式,表示「沒有做…就」或「不…」。文中例句:「どれを押せばいいのかわからず困っていました」,意思是因為不知道而困擾。","t_en":"〜zu (ni)","note_en":"A more formal form of 〜nai, meaning 'without doing' or 'not doing'. Example: 「どれを押せばいいのかわからず困っていました」 means he was troubled because he didn't know which to press."},{"t":"〜以上に","note":"表示「比…還要」,超出預期。文中例句:「思っていた以上においしく」,意思是比想像的更好吃。","t_en":"〜ijou ni","note_en":"Means 'more than' or 'beyond' an expectation. Example: 「思っていた以上においしく」 means more delicious than he had expected."}]},
{"id":"eh-n4-3-n2","variant_of":"eh-n4-3","level":"n2","topic":"繪本","topic_en":"Picture book","title":"雨の日のプレゼント","title_zh":"雨天的禮物","title_en":"A Present on a Rainy Day","body":"来週の土曜日は、たぬたろうの友達であるコンちゃんの誕生日に当たる。コンちゃんが普段から身につけている青いマフラーは、長年使われてきたせいか、すっかり古びてしまっている。それを見て、たぬたろうは新しいマフラーを贈ろうと考えた。\nところが、その日は朝から雨が降り続いており、出かけるには不便な天気だった。誕生日に間に合わせるには、雨の中でも傘をさして町の雑貨屋へ出かけざるを得なかった。店で見つけた青いマフラーは上品な色合いで、少し値が張るとはいえ、迷わず買うことにした。店員が丁寧に包装してくれたので、見た目も立派な贈り物になった。\n帰り道に入ると、雨は朝よりも一段と激しくなってきた。雨が強まるのに伴って、プレゼントが濡れてしまわないかという不安も大きくなった。そこで、たぬたろうはかばんをしっかりと抱え込み、自分が濡れるのも構わずに走り続けた。\nたぬたろうが「お誕生日おめでとう」と言ってプレゼントを差し出すと、コンちゃんは予想外のことに目を丸くした。雨の中を苦労して運んできた気持ちは、言葉にしなくても相手に伝わったのかもしれない。新しいマフラーを巻いたコンちゃんは「ありがとう、ずっと大切にするね」と嬉しそうに笑った。高価な物が必ずしも喜ばれるとは限らないが、相手を思って選んだ品は心に残るものだ。","trans":["下週六是たぬたろう的朋友コン的生日。コン平時總是戴著的那條藍色圍巾,也許是用了很多年的緣故,已經變得相當陳舊。看到這樣的情況,狸太郎想著要送他一條新圍巾。","然而那天從早上就一直下著雨,是個不方便出門的天氣。為了趕上生日,即使下雨,他也不得不撐著傘去鎮上的雜貨店。他在店裡找到的藍色圍巾色調高雅,雖然價格有點貴,他還是毫不猶豫地決定買下。店員細心地幫他包裝,所以看起來成了一份很體面的禮物。","踏上歸途後,雨比早上下得更大了。隨著雨勢增強,他也越來越擔心禮物會不會被淋濕。於是狸太郎把包包緊緊抱在懷裡,連自己會被淋濕也顧不得,一路跑了回去。","狸太郎說著「生日快樂」把禮物遞過去,コン出乎意料,驚訝得睜大了眼睛。冒著雨辛苦把禮物送來的心意,或許即使不說出口,對方也感受得到。圍上新圍巾的コン開心地笑著說:「謝謝你,我會一直好好珍惜的。」昂貴的東西不一定就會讓人高興,但為對方著想而挑選的東西,會留在人的心裡。"],"trans_en":["Next Saturday is the birthday of Konchan, Tanutaro's friend. The blue scarf Konchan always wears has become quite worn out, perhaps from years of use. Seeing it, Tanutaro decided to give Konchan a new scarf.","However, it had kept raining since morning, and it was an inconvenient day to go out. To get the gift in time for the birthday, Tanutaro had no choice but to take an umbrella and go to the town's general store despite the rain. The blue scarf found there had an elegant color, and although it was a little pricey, Tanutaro decided to buy it without hesitation. The clerk wrapped it carefully, so it became a handsome gift.","On the way home, the rain grew even heavier than in the morning. As the rain got stronger, Tanutaro worried more and more that the present might get wet. So Tanutaro held the bag tightly and kept running, not caring about getting wet.","When Tanutaro said Happy Birthday and held out the present, Konchan's eyes went wide with unexpected surprise. The effort of carrying it through the rain may have been felt even without words. Wearing the new scarf, Konchan smiled happily and said, Thank you, I'll treasure it forever. An expensive item isn't always appreciated, but something chosen with the recipient in mind stays in the heart."],"vocab":[{"w":"当たる","r":"あたる","m":"相當於、正好是(某日期)","m_en":"to fall on, to correspond to"},{"w":"身につける","r":"みにつける","m":"穿戴、佩戴","m_en":"to wear, to put on"},{"w":"古びる","r":"ふるびる","m":"變舊、陳舊","m_en":"to become old, to wear out"},{"w":"値が張る","r":"ねがはる","m":"價格偏貴","m_en":"to be pricey"},{"w":"包装","r":"ほうそう","m":"包裝","m_en":"wrapping, packaging"},{"w":"激しい","r":"はげしい","m":"激烈的、猛烈的","m_en":"intense, heavy"},{"w":"抱え込む","r":"かかえこむ","m":"緊緊抱住","m_en":"to hold tightly in one's arms"},{"w":"差し出す","r":"さしだす","m":"遞出、伸出","m_en":"to hold out, to offer"},{"w":"目を丸くする","r":"めをまるくする","m":"驚訝得睜大眼睛","m_en":"to open one's eyes wide in surprise"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某事的變化,另一件事也同步變化。例:「雨が強まるのに伴って、プレゼントが濡れてしまわないかという不安も大きくなった」。","t_en":"〜に伴って","note_en":"Expresses that as one thing changes, another changes along with it. Example: the worry grew as the rain got stronger (雨が強まるのに伴って)."},{"t":"〜ざるを得ない","note":"表示除此之外別無選擇,不得不做。例:「雨の中でも傘をさして町の雑貨屋へ出かけざるを得なかった」。","t_en":"〜ざるを得ない","note_en":"Means one has no choice but to do something. Example: Tanutaro had no choice but to go out to the store (出かけざるを得なかった).","id":"n2-35"},{"t":"〜とはいえ","note":"表示雖然承認前述事實,但後面接與預期不同的結果或判斷。例:「少し値が張るとはいえ、迷わず買うことにした」。","t_en":"〜とはいえ","note_en":"Means even though or although; admits a fact but follows with a contrasting result. Example: although a bit pricey, bought it anyway (値が張るとはいえ).","id":"n2-12"},{"t":"〜とは限らない","note":"表示不一定、並非總是如此,用來否定過於絕對的想法。例:「高価な物が必ずしも喜ばれるとは限らない」。","t_en":"〜とは限らない","note_en":"Means not necessarily or not always; softens an overly absolute claim. Example: expensive things are not always appreciated (喜ばれるとは限らない).","id":"n2-58"}]},
{"id":"eh-n4-3-n3","variant_of":"eh-n4-3","level":"n3","topic":"繪本","topic_en":"Picture book","title":"雨の日のプレゼント","title_zh":"雨天的禮物","title_en":"A Gift on a Rainy Day","body":"来週の土曜日は、友達のコンちゃんの誕生日です。コンちゃんがいつも使っている青いマフラーは、長く使ったせいでだいぶ古くなっていました。たぬたろうは、新しいマフラーを贈ることにしました。\nところが、その日は朝から雨が降り続いていました。たぬたろうは傘をさして、町の雑貨屋さんまで歩いて行きました。そこで、きれいな青いマフラーを見つけることができました。\n値段は少し高かったのですが、たぬたろうは買うことにしました。店員さんは、そのマフラーをていねいにきれいに包んでくれました。帰り道では、雨が朝よりもさらに強くなってきました。たぬたろうは、プレゼントがぬれないように、かばんをしっかり抱えて走りました。\n「お誕生日おめでとう」と言ってプレゼントを渡すと、コンちゃんはとても驚いた様子でした。新しいマフラーを首に巻いたコンちゃんは、「ありがとう、ずっと大切にするね」と笑いました。雨の中を走ってきたかいがあったと、たぬたろうは心からうれしく思いました。","trans":["下週六是朋友コン的生日。コン一直在用的那條藍色圍巾,因為用了很久,已經舊得相當厲害了。狸太郎決定送他一條新圍巾。","可是,那天從早上就一直下著雨。狸太郎撐著傘,走到鎮上的雜貨店。他在那裡找到了一條漂亮的藍色圍巾。","價錢雖然有點貴,狸太郎還是決定買下來。店員把那條圍巾仔細又漂亮地包裝好了。回家的路上,雨比早上下得更大了。狸太郎為了不讓禮物淋濕,緊緊抱著包包跑了起來。","他說了聲「生日快樂」並把禮物交給コン,コン看起來非常驚訝。把新圍巾圍在脖子上的コン笑著說:「謝謝你,我會一直好好珍惜的。」狸太郎覺得自己冒雨跑回來真是值得,打從心底感到開心。"],"trans_en":["Next Saturday is the birthday of Kon, a friend. The blue scarf Kon always wears had become quite worn out from long use. Tanutaro decided to give Kon a new scarf.","However, it kept raining from the morning of that day. Tanutaro held up an umbrella and walked to a general goods shop in town. There, he was able to find a beautiful blue scarf.","The price was a little high, but Tanutaro decided to buy it. The shop clerk wrapped the scarf carefully and neatly for him. On the way home, the rain grew even stronger than it had been in the morning. So that the present wouldn't get wet, Tanutaro held his bag tightly and ran.","When he said happy birthday and handed over the present, Kon looked very surprised. Kon, wearing the new scarf around the neck, smiled and said thank you, I will treasure it forever. Tanutaro felt it had been worth running through the rain, and was happy from the bottom of his heart."],"vocab":[{"w":"だいぶ","r":"だいぶ","m":"相當、頗為","m_en":"considerably, quite"},{"w":"贈る","r":"おくる","m":"贈送","m_en":"to give (a gift)"},{"w":"雑貨屋","r":"ざっかや","m":"雜貨店","m_en":"general goods shop"},{"w":"値段","r":"ねだん","m":"價錢","m_en":"price"},{"w":"店員","r":"てんいん","m":"店員","m_en":"shop clerk"},{"w":"ていねい","r":"ていねい","m":"仔細、周到","m_en":"careful, polite"},{"w":"包む","r":"つつむ","m":"包裝、包起來","m_en":"to wrap"},{"w":"抱える","r":"かかえる","m":"抱著、夾在懷裡","m_en":"to hold in one's arms"},{"w":"様子","r":"ようす","m":"樣子、情況","m_en":"appearance, look"},{"w":"大切","r":"たいせつ","m":"重要、珍惜","m_en":"important, precious"}],"grammar":[{"t":"〜ことにする","note":"表示說話者自己下定決心做某事。例:「新しいマフラーを贈ることにしました」「買うことにしました」","t_en":"~koto ni suru","note_en":"Expresses a decision made by oneself. e.g. 「買うことにしました」 (decided to buy it)"},{"t":"〜ように","note":"表示目的,為了讓某個狀態成立或不發生。例:「プレゼントがぬれないように、かばんをしっかり抱えて走りました」","t_en":"~you ni","note_en":"Expresses purpose, so that something will or will not happen. e.g. 「プレゼントがぬれないように、かばんをしっかり抱えて走りました」","id":"n3-54"},{"t":"〜せいで","note":"表示負面的原因或理由,常帶有責怪的語氣。例:「長く使ったせいでだいぶ古くなっていました」","t_en":"~sei de","note_en":"Gives a negative cause or reason. e.g. 「長く使ったせいでだいぶ古くなっていました」 (became quite old because of long use)"},{"t":"〜てくれる","note":"表示別人為自己做某事,帶有感謝的心情。例:「そのマフラーをていねいにきれいに包んでくれました」","t_en":"~te kureru","note_en":"Someone does something for the speaker or their side, with a sense of gratitude. e.g. 「そのマフラーをていねいにきれいに包んでくれました」"}]},
{"id":"a-n2-11-n3","variant_of":"a-n2-11","level":"n3","topic":"文化","topic_en":"Culture","title":"居酒屋の「お通し」","title_zh":"居酒屋的「お通し」","title_en":"Otoshi at Izakaya","body":"日本の居酒屋で席に座ると、注文していないのに小さな料理が出てくることがある。これは「お通し」と呼ばれていて、関西では「突き出し」と言うことも多い。中身は枝豆や煮物、和え物など、店によってさまざまである。\n初めて日本に来た人の中には、会計でお通し代が足されているのを見て驚く人も少なくない。勝手にお金を取られたのではないかと、不安になるからだ。お通し代は三百円から五百円ぐらいで、店にとっては席の料金に近いものだと言われている。\n料理が出るまで客が退屈しないように、店が気を使って出すものだという考え方もある。ただし、断れるかどうかは店によって違うし、最近はお通しを出さない店も増えてきた。気になるときは、店に入るときに一言聞いておけば安心だ。\nこのような背景を知っていれば、見慣れない小鉢も気持ちよく楽しめるだろう。お通しは、日本の飲み文化の一部だと考えることができる。","trans":["在日本的居酒屋一坐下來,有時明明沒有點餐,卻會端上一小碟菜。這叫做「お通し」,在關西也常說成「突き出し」。內容有毛豆、燉菜、涼拌菜等等,每家店都不一樣。","第一次來日本的人當中,有不少人在結帳時看到多了一筆お通し費而感到驚訝。因為會擔心是不是被擅自收了錢。お通し費大約是三百到五百日圓,據說對店家來說比較接近座位費。","也有人認為,這是店家為了讓客人在等菜上桌的時候不會無聊,所以用心準備的。不過,能不能拒絕要看店家,而且最近不提供お通し的店也越來越多了。如果會在意,進店時先問一句就能放心。","只要知道這樣的背景,就算是沒見過的小菜,也能開心地享用吧。可以把お通し當作日本喝酒文化的一部分來看待。"],"trans_en":["At a Japanese izakaya, when you sit down, a small dish sometimes arrives even though you did not order it. This is called \"otoshi,\" and in the Kansai region it is also often called \"tsukidashi.\" What it contains, such as edamame, simmered dishes, or dressed salads, varies from shop to shop.","Quite a few people visiting Japan for the first time are surprised to see an otoshi charge added to the bill. They worry that money was taken from them without permission. The charge is about 300 to 500 yen, and it is said to be close to a seating fee for the shop.","Some also think the shop serves it out of consideration, so that customers do not get bored while waiting for their food. However, whether you can refuse it depends on the shop, and more and more places no longer serve otoshi these days. If you are concerned, it is reassuring to ask when you enter.","If you know this background, you can probably enjoy even an unfamiliar little dish. You can think of otoshi as part of Japan's drinking culture."],"vocab":[{"w":"注文","r":"ちゅうもん","m":"點餐、訂購","m_en":"order"},{"w":"小鉢","r":"こばち","m":"小碟、小缽的菜","m_en":"small bowl dish"},{"w":"会計","r":"かいけい","m":"結帳","m_en":"paying the bill"},{"w":"足す","r":"たす","m":"加上、追加","m_en":"to add"},{"w":"不安","r":"ふあん","m":"不安、擔心","m_en":"anxiety, worry"},{"w":"退屈","r":"たいくつ","m":"無聊","m_en":"bored, boring"},{"w":"気を使う","r":"きをつかう","m":"費心、顧慮","m_en":"to be considerate"},{"w":"断る","r":"ことわる","m":"拒絕","m_en":"to refuse"},{"w":"背景","r":"はいけい","m":"背景、來由","m_en":"background"},{"w":"見慣れない","r":"みなれない","m":"不熟悉的、沒見過的","m_en":"unfamiliar"}],"grammar":[{"t":"〜ように","note":"表示「為了達成某個目的」。前面接否定或可能形,說明做某事的目的。例:「客が退屈しないように、店が気を使って出すものだ」","t_en":"~ように (so that)","note_en":"Expresses a purpose, often with a negative or potential form. Example: 「客が退屈しないように、店が気を使って出すものだ」","id":"n3-54"},{"t":"〜によって","note":"表示「依……而不同」。例:「中身は枝豆や煮物、和え物など、店によってさまざまである」","t_en":"~によって (depending on)","note_en":"Means \"depending on\" and shows variation. Example: 「店によってさまざまである」"},{"t":"〜ば(條件形)","note":"表示「如果……的話就……」,後面常接好的結果或建議。例:「背景を知っていれば、見慣れない小鉢も気持ちよく楽しめるだろう」","t_en":"~ば (conditional)","note_en":"Means \"if ...,\" often followed by a good result or advice. Example: 「背景を知っていれば、見慣れない小鉢も気持ちよく楽しめるだろう」"},{"t":"〜のではないか","note":"表示說話者的推測或擔心,「該不會是……吧」。例:「勝手にお金を取られたのではないかと、不安になる」","t_en":"~のではないか (might be ...)","note_en":"Expresses a speaker's guess or worry, \"isn't it possible that ...\". Example: 「勝手にお金を取られたのではないかと、不安になる」"}]},
{"id":"a-n2-11-n4","variant_of":"a-n2-11","level":"n4","topic":"文化","topic_en":"Culture","title":"居酒屋の「お通し」","title_zh":"居酒屋的「お通し」","title_en":"Otoshi at Izakaya","body":"日本の居酒屋で席に座ると、頼んでいない小さい料理が来ることがある。これは「お通し」といって、枝豆や煮物などが出ることが多い。関西では「突き出し」と呼ぶことも多く、中身は店によって違う。\n初めて日本に来た人は、会計でお通しのお金を見て驚くことがある。「変なお金ではないか」と思って、困る人も多い。お通しは、だいたい三百円から五百円ぐらいだと言われている。店にとっては、席のお金と同じような意味がある。\n料理が来るまで客が退屈しないように、という気持ちもあるそうだ。断れるかどうかは店によるが、最近はお通しを出さない店も増えている。気になる時は、店に入る時に聞いておけば大丈夫だ。理由を知れば、小さい料理も日本の飲み文化として楽しめるだろう。","trans":["在日本的居酒屋一坐下來,有時會送來一小碟沒點的菜。這叫做「お通し」,常常是毛豆或燉菜之類的。在關西也常叫做「突き出し」,內容每家店都不一樣。","第一次來日本的人,有時會在結帳時看到お通し的費用而嚇一跳。也有不少人會想「這是不是亂收錢」而感到困擾。據說お通し大約是三百到五百日圓。對店家來說,意思和座位費差不多。","據說也有一份心意,是不讓客人在等菜的時候覺得無聊。能不能拒絕要看店家,不過最近不提供お通し的店也變多了。如果會在意,進店的時候先問一下就沒問題了。知道了理由,這小小的一碟菜應該也能當作日本喝酒文化的一部分來享受吧。"],"trans_en":["At a Japanese izakaya, when you sit down, a small dish you did not order sometimes arrives. This is called \"otoshi,\" and it is often things like edamame or simmered vegetables. In the Kansai region it is also often called \"tsukidashi,\" and what you get differs from shop to shop.","People who come to Japan for the first time are sometimes surprised to see the otoshi charge on the bill. Many of them worry that it might be an unfair charge. Otoshi is said to cost about 300 to 500 yen. For the shop, it has a meaning similar to a seat charge.","It is also said to come from a wish that customers do not get bored while waiting for their food. Whether you can refuse depends on the shop, but recently more shops do not serve otoshi. If it bothers you, it is fine to ask when you enter the shop. If you know the reason, you can probably enjoy the small dish as part of Japan's drinking culture."],"vocab":[{"w":"居酒屋","r":"いざかや","m":"居酒屋","m_en":"izakaya, Japanese pub"},{"w":"席","r":"せき","m":"座位","m_en":"seat"},{"w":"頼む","r":"たのむ","m":"點(菜)、拜託","m_en":"to order, to ask"},{"w":"煮物","r":"にもの","m":"燉煮的菜","m_en":"simmered dish"},{"w":"会計","r":"かいけい","m":"結帳","m_en":"paying the bill"},{"w":"驚く","r":"おどろく","m":"驚訝、嚇一跳","m_en":"to be surprised"},{"w":"困る","r":"こまる","m":"困擾","m_en":"to be troubled"},{"w":"断る","r":"ことわる","m":"拒絕","m_en":"to refuse"},{"w":"増える","r":"ふえる","m":"增加","m_en":"to increase"},{"w":"気になる","r":"きになる","m":"在意、放不下心","m_en":"to bother one, to be curious about"}],"grammar":[{"t":"〜と(〜ことがある)","note":"表示「一……就……」的自然結果,也可搭配「ことがある」表示有時會發生。例:「席に座ると、頼んでいない小さい料理が来ることがある」","t_en":"~と (when/if ~) with ことがある","note_en":"Expresses a natural result: 'when you do X, Y happens.' With ことがある it means 'sometimes.' Example: 「席に座ると、頼んでいない小さい料理が来ることがある」"},{"t":"〜ように(目的)","note":"表示為了讓某狀態成立。例:「料理が来るまで客が退屈しないように、という気持ちもあるそうだ」","t_en":"~ように (purpose)","note_en":"Expresses a purpose, 'so that ~.' Example: 「料理が来るまで客が退屈しないように、という気持ちもあるそうだ」","id":"n3-54"},{"t":"〜ば(条件形)","note":"表示「如果……就……」的條件。例:「店に入る時に聞いておけば大丈夫だ」「理由を知れば、小さい料理も楽しめるだろう」","t_en":"~ば (conditional)","note_en":"Means 'if ~, then ~.' Examples: 「店に入る時に聞いておけば大丈夫だ」 and 「理由を知れば、小さい料理も楽しめるだろう」"},{"t":"〜そうだ(傳聞)","note":"接在普通形後面,表示聽來的消息「據說……」。例:「という気持ちもあるそうだ」","t_en":"~そうだ (hearsay)","note_en":"Attached to the plain form to mean 'I hear that ~.' Example: 「という気持ちもあるそうだ」"}]},
{"id":"a-n2-12-n3","variant_of":"a-n2-12","level":"n3","topic":"社会","topic_en":"Society","title":"勤労感謝の日を考える","title_zh":"思考勤勞感謝日","title_en":"Thinking About Labor Thanksgiving Day","body":"十一月二十三日は「勤労感謝の日」といって、多くの会社や学校が休みになる祝日だ。名前を見ると働く人のための日だと思いやすいが、もともとの由来は少し違う。昔から日本では、秋に収穫した作物を神に供えて感謝する「新嘗祭」が行われてきた。\n戦後、制度が見直される中で、一九四八年に法律ができ、この日は「勤労感謝の日」になった。法律には、働くことを大切にし、たがいに感謝し合う日だと書かれている。神への感謝が、働くことや物を作ることへの感謝に広がったと考えると分かりやすい。\n今は働き方が多様になり、「勤労」と聞いて思い浮かべる姿も変わってきた。工場や田畑だけでなく、店、物流、医療、介護など、生活を支える仕事は数えきれない。祝日でも、みんなが休めるわけではなく、いつも以上に働く仕事もある。私たちの便利な生活は、そうした人たちの努力によって成り立っているのだ。\n荷物を届けてくれた人に「ありがとうございます」と声をかけるだけでも、気持ちは伝わる。職場でも、同僚の仕事に礼を言うことは、この日をきっかけにすぐ始められる。ただ、祝日の勤務や休みは会社ごとに違うため、詳しくは会社の説明を確認してほしい。感謝の気持ちは、祝日だけでなく毎日の暮らしの中で言葉にしてこそ意味がある。","trans":["11月23日叫做「勤勞感謝日」,是許多公司和學校都會放假的節日。光看名稱,容易以為這是為上班族設的日子,但它原本的由來有些不同。日本自古以來,每到秋天就會舉行「新嘗祭」,把收成的作物供奉給神明並表達感謝。","戰後,在制度被重新檢討的過程中,1948年訂定了法律,這一天就成了「勤勞感謝日」。法律中寫著,這是重視工作、讓人們彼此互相感謝的日子。可以理解為:對神明的感謝,擴大成了對工作與創造事物的感謝。","現在工作方式越來越多元,我們聽到「勤勞」時聯想到的身影也改變了。除了工廠和田地,商店、物流、醫療、照護等支撐生活的工作多得數不清。即使是假日,也不是每個人都能休息,有些工作還得比平常更辛苦。我們方便的生活,正是建立在這些人的努力之上。","對送來包裹的人說一聲「謝謝」,心意就能傳達。在職場上,對同事的工作道謝,也是能以這一天為契機立刻開始的事。不過,假日的出勤與休假因公司而異,詳情請確認公司的說明。感謝的心意不只在假日,在日常生活中說出口才有意義。"],"trans_en":["November 23 is called Labor Thanksgiving Day, a national holiday when many companies and schools are closed. From the name, people tend to think it is a day for workers, but its origin is a little different. Since long ago in Japan, a ritual called Niinamesai has been held in autumn, offering the harvested crops to the gods in thanks.","After the war, as the system was reviewed, a law was made in 1948 and this day became Labor Thanksgiving Day. The law says it is a day to value work and thank one another. It is easy to understand if you think that thanks to the gods grew into thanks for working and making things.","Today, ways of working have become varied, and the image we picture when we hear the word labor has changed too. Beyond factories and fields, there are countless jobs that support our lives, such as shops, logistics, medical care, and nursing care. Even on holidays, not everyone can rest, and some jobs require working harder than usual. Our convenient lives are built on the efforts of such people.","Just saying thank you to the person who delivered your package is enough to convey your feelings. At work too, thanking a coworker for their work is something you can start right away, using this day as a chance. However, work and days off on holidays differ by company, so please check your company's explanation for details. Gratitude only has meaning when put into words in daily life, not just on a holiday."],"vocab":[{"w":"祝日","r":"しゅくじつ","m":"國定假日、節日","m_en":"national holiday"},{"w":"由来","r":"ゆらい","m":"由來、來歷","m_en":"origin"},{"w":"収穫","r":"しゅうかく","m":"收穫、收成","m_en":"harvest"},{"w":"供えて","r":"そなえて","m":"供奉(供える)","m_en":"to offer (to gods)"},{"w":"制度","r":"せいど","m":"制度","m_en":"system, institution"},{"w":"見直される","r":"みなおされる","m":"被重新檢討","m_en":"to be reviewed"},{"w":"物流","r":"ぶつりゅう","m":"物流","m_en":"logistics"},{"w":"支える","r":"ささえる","m":"支撐、支持","m_en":"to support"},{"w":"成り立って","r":"なりたって","m":"成立、建立(成り立つ)","m_en":"to be built on, to consist"},{"w":"同僚","r":"どうりょう","m":"同事","m_en":"coworker"}],"grammar":[{"t":"〜によって","note":"表示原因、手段或依據,意思是「由於…、藉由…」。例:「私たちの便利な生活は、そうした人たちの努力によって成り立っているのだ」","t_en":"〜によって","note_en":"Shows cause or means: 'because of, by means of'. Example: 「私たちの便利な生活は、そうした人たちの努力によって成り立っているのだ」"},{"t":"〜わけではない","note":"部分否定,表示「並非…」,不是全盤否定。例:「祝日でも、みんなが休めるわけではなく、いつも以上に働く仕事もある」","t_en":"〜わけではない","note_en":"Partial negation: 'it is not that…'. Example: 「祝日でも、みんなが休めるわけではなく、いつも以上に働く仕事もある」","id":"n3-43"},{"t":"〜ため","note":"表示原因、理由,語氣比「から」更正式,常用於書面。例:「祝日の勤務や休みは会社ごとに違うため、詳しくは会社の説明を確認してほしい」","t_en":"〜ため","note_en":"Gives a reason, more formal than から and common in writing. Example: 「祝日の勤務や休みは会社ごとに違うため、詳しくは会社の説明を確認してほしい」"},{"t":"〜をきっかけに","note":"表示以某件事為契機,開始新的行動。例:「同僚の仕事に礼を言うことは、この日をきっかけにすぐ始められる」","t_en":"〜をきっかけに","note_en":"Using something as a chance or trigger to start something. Example: 「同僚の仕事に礼を言うことは、この日をきっかけにすぐ始められる」","id":"n2-59"}]},
{"id":"a-n2-12-n4","variant_of":"a-n2-12","level":"n4","topic":"社会","topic_en":"Society","title":"勤労感謝の日","title_zh":"勤勞感謝日","title_en":"Labor Thanksgiving Day","body":"十一月二十三日は「勤労感謝の日」で、会社や学校が休みになる祝日です。名前を見ると、働く人のための日だと思う人が多いです。でも、もとは秋に新しい米を神様にあげて感謝する「新嘗祭」でした。\n戦争のあと、国は祝日についての法律を新しく作りました。一九四八年に、この日は「勤労感謝の日」という祝日になりました。神様への感謝が、働くことや物を作ることへの感謝に広がったのです。\n今は、店や病院など、生活を助ける仕事がたくさんあります。祝日でも休めないで、いつもより忙しく働く人もいます。私たちの便利な生活は、そうした人たちのおかげでできています。荷物を届けてくれた人に「ありがとう」と言えば、気持ちは伝わります。感謝の気持ちは、毎日の生活の中で言葉にするようにしましょう。","trans":["11月23日是「勤勞感謝日」,是公司和學校會放假的節日。看到這個名稱,很多人會以為這是為上班族設的日子。但它原本是在秋天把新米供奉給神明、表達感謝的「新嘗祭」。","戰爭結束後,國家重新制定了關於節日的法律。1948年,這一天成為名為「勤勞感謝日」的節日。對神明的感謝,擴大成了對工作和創造事物的感謝。","現在有很多像商店、醫院這樣支撐生活的工作。有些人即使是假日也不能休息,還得比平常更忙地工作。我們便利的生活,是靠這些人才得以實現。只要對送來包裹的人說一聲「謝謝」,心意就能傳達。請試著在每天的生活中,把感謝的心意說出口。"],"trans_en":["November 23 is \"Labor Thanksgiving Day,\" a national holiday when companies and schools are closed. Seeing the name, many people think it is a day just for workers. But it was originally \"Niinamesai,\" a ceremony in autumn to offer new rice to the gods and give thanks.","After the war, the country made a new law about national holidays. In 1948, this day became a holiday called \"Labor Thanksgiving Day.\" Thanks to the gods grew into thanks for working and making things.","Today there are many jobs that support our lives, such as in shops and hospitals. Some people cannot rest even on holidays and work harder than usual. Our convenient lives exist thanks to those people. If you say \"thank you\" to the person who delivered your package, your feelings will get across. Let's try to put our thanks into words in everyday life."],"vocab":[{"w":"祝日","r":"しゅくじつ","m":"國定假日、節日","m_en":"national holiday"},{"w":"感謝","r":"かんしゃ","m":"感謝","m_en":"gratitude, thanks"},{"w":"戦争","r":"せんそう","m":"戰爭","m_en":"war"},{"w":"法律","r":"ほうりつ","m":"法律","m_en":"law"},{"w":"広がる","r":"ひろがる","m":"擴大、擴展","m_en":"to spread, to expand"},{"w":"便利","r":"べんり","m":"方便","m_en":"convenient"},{"w":"忙しい","r":"いそがしい","m":"忙碌的","m_en":"busy"},{"w":"届ける","r":"とどける","m":"送到、送達","m_en":"to deliver"},{"w":"気持ち","r":"きもち","m":"心情、心意","m_en":"feelings"}],"grammar":[{"t":"〜のおかげで","note":"表示因為對方或某事而得到好結果,帶有感謝語氣。例:「そうした人たちのおかげでできています」","t_en":"〜のおかげで","note_en":"Means 'thanks to ~,' showing a good result with gratitude. Example: 「そうした人たちのおかげでできています」"},{"t":"〜てくれる","note":"表示別人為我們做了某事,帶有感謝。例:「荷物を届けてくれた人に」","t_en":"〜てくれる","note_en":"Shows that someone did something for us, with gratitude. Example: 「荷物を届けてくれた人に」"},{"t":"〜ば(條件形)","note":"表示「如果~就~」的條件。例:「ありがとう」と言えば、気持ちは伝わります","t_en":"〜ば (conditional)","note_en":"Means 'if ~, then ~.' Example: 「ありがとう」と言えば、気持ちは伝わります"},{"t":"〜ようにする","note":"表示努力養成習慣、盡量去做。例:毎日の生活の中で言葉にするようにしましょう","t_en":"〜ようにする","note_en":"Means to try to do something or make it a habit. Example: 毎日の生活の中で言葉にするようにしましょう","id":"n3-39"}]},
{"id":"a-n2-13-n3","variant_of":"a-n2-13","level":"n3","topic":"職場","topic_en":"Work","title":"変わる忘年会、変わらない気づかい","title_zh":"改變中的忘年會,不變的體貼","title_en":"Changing Year-End Parties, Unchanging Consideration","body":"年末が近づくと、日本の職場では「忘年会」の話が自然に出てくるものでした。一年の苦労を忘れて仲を深める会で、以前は参加するのが当然だと思われていました。しかし最近は、仕事のあとの時間を自分のために使いたくて、参加したくない人が増えています。\nそのため、夜の宴会をやめて昼のランチ会にしたり、参加を自由にしたりする会社が増えてきました。背景には、考え方が人それぞれ違ってきたことや、家庭や介護を大切にしたい事情があります。上司との席は楽しいどころか、気を使って疲れるだけだと感じる若い人も少なくありません。\n一方で、普段話せない同僚と交流できる貴重な機会だと考え、歓迎する人もいます。会社は、無理に参加させると不満が高まるため、それぞれの事情を考えた形を探すしかありません。誘われて断るときは、まず誘ってくれたことにお礼を言うのが基本です。\n「ありがとうございます、あいにく先約がありまして」と言えば、角が立ちません。理由は細かく話しすぎず、短く伝えて「またぜひ」と添えるとよいでしょう。参加するときも、飲めなければウーロン茶で乾杯してよく、早く帰ると先に言うと楽です。幹事が案内に「参加は自由です」と一言書けば、断る人の負担もずっと軽くなります。形が変わっても、お互いの事情を大切にする気持ちは変わらないことが大事だと思います。","trans":["每到年底,日本的職場過去自然都會聊起「忘年會」。它是忘掉一年辛勞、增進感情的聚會,以前大家認為參加是理所當然的。不過最近,越來越多人想把下班後的時間留給自己,所以不想參加。","因此,不少公司不再辦晚上的聚餐,改成午餐會,或讓員工自由參加。背景包括大家的想法越來越不同,以及想重視家庭與照護的各種情況。有些年輕人覺得和上司同席別說開心,反而因為要顧慮很多而只覺得累,這樣的人並不少。","另一方面,也有人認為這是能和平常難得交談的同事交流的寶貴機會,因此歡迎舉辦。對公司來說,硬要員工參加會讓不滿升高,所以只能尋找顧及各人情況的形式。被邀請而要拒絕時,基本做法是先為對方的邀請道謝。","說「謝謝您,很不巧我已有約在先」,就不會傷到和氣。理由不要說得太細,簡短說明,再補上一句「下次一定」會比較好。決定參加時,若不能喝酒可以用烏龍茶乾杯,先說明會早點離開,心情也會比較輕鬆。負責籌辦的人只要在通知上加一句「參加與否自由」,拒絕的人負擔就會輕得多。我認為重要的是,即使形式改變,尊重彼此處境的心意也不會變。"],"trans_en":["As the end of the year approaches, Japanese workplaces used to naturally start talking about the bonenkai. It was a gathering to forget the year's hardships and grow closer, and attending was once considered a matter of course. Lately, however, more people want to use their after-work time for themselves and do not want to attend.","As a result, more companies are replacing evening banquets with lunch gatherings or making attendance optional. Behind this are people's increasingly diverse values and the wish to put family and caregiving first. Quite a few young people feel that sitting with their boss is not fun at all and only tiring because they have to be so considerate.","On the other hand, some people welcome the party as a valuable chance to talk with coworkers they rarely speak to. Companies know that forcing people to attend raises dissatisfaction, so they have no choice but to look for a format that takes each person's situation into account. When you are invited and want to decline, the basic rule is to first thank the person for inviting you.","If you say \"Thank you, but unfortunately I already have plans,\" you will not cause offense. Do not explain your reason in too much detail; keep it short and add \"Another time, please.\" When you do attend, it is fine to toast with oolong tea if you cannot drink, and it is easier if you say at the start that you will leave early. If the organizer adds one line saying \"Attendance is optional\" to the invitation, the burden on those who decline becomes much lighter. Even if the format changes, I think what matters is that the desire to respect one another's circumstances does not change."],"vocab":[{"w":"職場","r":"しょくば","m":"職場、工作的地方","m_en":"workplace"},{"w":"介護","r":"かいご","m":"照護(照顧需要幫助的家人)","m_en":"nursing care, caregiving"},{"w":"同僚","r":"どうりょう","m":"同事","m_en":"coworker"},{"w":"貴重","r":"きちょう","m":"寶貴、難得","m_en":"valuable, precious"},{"w":"事情","r":"じじょう","m":"情況、緣由","m_en":"circumstances, reasons"},{"w":"先約","r":"せんやく","m":"先約、已有的約定","m_en":"prior engagement"},{"w":"角が立つ","r":"かどがたつ","m":"傷和氣、得罪人","m_en":"to cause friction, to ruffle feathers"},{"w":"添える","r":"そえる","m":"附上、補上","m_en":"to add, to attach"},{"w":"幹事","r":"かんじ","m":"幹事、活動籌辦人","m_en":"organizer (of an event)"}],"grammar":[{"t":"〜どころか","note":"表示「別說是…,反而…」,後面接與預期相反的內容。例:「上司との席は楽しいどころか、気を使って疲れるだけだと感じる」","t_en":"~dokoroka","note_en":"Means 'far from ~, rather ~'; the following part is the opposite of what you'd expect. Example: 「上司との席は楽しいどころか、気を使って疲れるだけだと感じる」","id":"n2-25"},{"w":"","t":"〜ため(原因)","note":"用來說明原因、理由,語氣比「から」更正式。例:「無理に参加させると不満が高まるため、それぞれの事情を考えた形を探すしかありません」","t_en":"~tame (reason)","note_en":"Gives a reason or cause, more formal than 'kara'. Example: 「無理に参加させると不満が高まるため、それぞれの事情を考えた形を探すしかありません」"},{"t":"〜しかない","note":"表示「只能…、除了…別無選擇」。例:「それぞれの事情を考えた形を探すしかありません」","t_en":"~shika nai","note_en":"Means 'have no choice but to ~'. Example: 「それぞれの事情を考えた形を探すしかありません」"},{"t":"動詞ます形+すぎる","note":"表示程度過度。例:「理由は細かく話しすぎず、短く伝えて」(話しすぎず是話しすぎない的書面形)","t_en":"verb stem + sugiru","note_en":"Means doing something too much. Example: 「理由は細かく話しすぎず、短く伝えて」 (話しすぎず is a written form of 話しすぎない)"}]},
{"id":"a-n2-13-n4","variant_of":"a-n2-13","level":"n4","topic":"職場","topic_en":"Work","title":"かわる忘年会","title_zh":"改變中的忘年會","title_en":"The Changing Year-End Party","body":"年末になると、日本の会社では「忘年会」の話をよくします。昔は一年の疲れを忘れるために、行くのが当たり前でした。今は行きたくない人が増えて、昼のランチ会にする会社もあります。\n仕事のあとは、自分や家族の時間を大切にしたい人が多いです。上司と食べると、気を使って疲れると思う若い人もいます。でも、いつも話せない同僚と話せるので、うれしいと思う人もいます。無理に行かせると困るので、会社は一人一人の事情を考えます。\n断るときは、まず誘ってくれたことに「ありがとうございます」と言います。理由は長く言わないで、「またぜひ」と言うといいです。幹事が「参加は自由です」と書けば、断る人は気が楽になります。大切なのは、おたがいの気持ちを考えることです。","trans":["每到年底,日本的公司常會聊到「忘年會」。以前是為了忘掉一年的辛勞,大家覺得參加是理所當然的。現在不想參加的人變多了,也有公司改成中午的午餐會。","下班後,很多人想把時間留給自己和家人。也有年輕人覺得和上司一起吃飯要顧慮很多,會很累。不過,也有人覺得可以和平常很少說話的同事聊天,所以很開心。如果勉強大家參加會很傷腦筋,所以公司會考慮每個人的情況。","要拒絕的時候,先為對方邀請自己說「謝謝您」。理由不要說得太長,說一句「下次一定」就好。如果負責籌辦的人寫上「參加與否自由」,拒絕的人就會比較輕鬆。重要的是替彼此的心情著想。"],"trans_en":["When the end of the year comes, people in Japanese companies often talk about the bonenkai. In the past, people went to forget the tiredness of the year, and going was taken for granted. Now more people do not want to go, and some companies hold a lunch party instead.","After work, many people want to spend time on themselves and their families. Some young people feel tired because they have to be careful around their boss. But some people are happy because they can talk with coworkers they usually cannot talk to. Forcing people to go causes problems, so companies think about each person's situation.","When you refuse, first say thank you for the invitation. Do not give a long reason, and it is good to say you hope to join next time. If the organizer writes that joining is optional, it is easier for people to say no. What matters is thinking about each other's feelings."],"vocab":[{"w":"忘年会","r":"ぼうねんかい","m":"忘年會(年底聚餐)","m_en":"year-end party"},{"w":"当たり前","r":"あたりまえ","m":"理所當然","m_en":"natural, taken for granted"},{"w":"増える","r":"ふえる","m":"增加","m_en":"to increase"},{"w":"上司","r":"じょうし","m":"上司","m_en":"boss, superior"},{"w":"同僚","r":"どうりょう","m":"同事","m_en":"coworker"},{"w":"事情","r":"じじょう","m":"情況、緣由","m_en":"circumstances"},{"w":"断る","r":"ことわる","m":"拒絕","m_en":"to refuse"},{"w":"誘う","r":"さそう","m":"邀請","m_en":"to invite"},{"w":"幹事","r":"かんじ","m":"活動的籌辦人","m_en":"organizer of an event"},{"w":"気を使う","r":"きをつかう","m":"顧慮、費心","m_en":"to be considerate, to be careful"}],"grammar":[{"t":"〜ために","note":"表示目的,「為了做〜」。例:「一年の疲れを忘れるために、行くのが当たり前でした」","t_en":"~ために (purpose)","note_en":"Shows purpose, 'in order to ~'. Example: 「一年の疲れを忘れるために、行くのが当たり前でした」","id":"n3-53"},{"t":"〜と(條件)","note":"表示一做〜就會〜,常用於自然的結果或建議。例:「年末になると、日本の会社では「忘年会」の話をよくします」","t_en":"~と (condition)","note_en":"Means 'when/if ~, then ~', for natural results or advice. Example: 「年末になると、日本の会社では「忘年会」の話をよくします」"},{"t":"〜ので","note":"表示原因、理由,語氣比「から」柔和。例:「いつも話せない同僚と話せるので、うれしいと思う人もいます」","t_en":"~ので (reason)","note_en":"Gives a reason in a softer way than から. Example: 「いつも話せない同僚と話せるので、うれしいと思う人もいます」"},{"t":"〜てくれる","note":"表示別人為我做某事,帶有感謝的心情。例:「まず誘ってくれたことに「ありがとうございます」と言います」","t_en":"~てくれる","note_en":"Means someone does something for me, with a feeling of thanks. Example: 「まず誘ってくれたことに「ありがとうございます」と言います」"}]},
{"id":"a-n3-13-n2","variant_of":"a-n3-13","level":"n2","topic":"生活","topic_en":"Daily life","title":"不在票が入っていたら","title_zh":"收到不在通知單的時候","title_en":"When You Find a Missed-Delivery Slip","body":"仕事から帰ってくると、郵便受けに宅配便の「不在連絡票」が一枚入っているのに気づいた。留守にしている間に荷物が届いたため、改めて配達してもらうよう依頼せざるを得ない。このような手続きは「再配達」と呼ばれ、宅配サービスを利用する人にとってはごく身近なものである。\nかつては紙に記された番号に電話をするのが一般的だったが、スマートフォンの普及に伴って状況が変わった。現在では、紙に印刷されたQRコードを読み取り、希望する日と時間帯を選ぶだけで申し込める。ただし、不在票には保管期限も記載されているため、のんびりしてはいられない。早めに手続きをしないと、荷物が送り主に返送されかねないので、注意が必要だ。\n一方、再配達にはトラックの燃料も人手も余計にかかるという問題がある。ドライバー不足が社会問題となっている現在、利用者に対しても、できるだけ一度で荷物を受け取ることが求められている。そこで注目されているのが、「置き配」や宅配ボックスといった受け取り方法である。玄関先やボックスに荷物を置いてもらえば、在宅しているかどうかにかかわらず受け取ることができる。\n私自身も、最近では通販で注文する際に、受け取り方法まで考えておくようにしている。一つひとつは小さな工夫にすぎないが、こうした心がけが配達する側の負担を減らすことにつながる。利用者にとっても無駄な手間が省けるのだから、双方にとってうれしい習慣と言えるだろう。","trans":["下班回到家後,我發現信箱裡有一張宅配的「不在通知單」。因為我不在家的時候包裹送到了,所以不得不請對方重新配送一次。這樣的手續稱為「再配達(重新配送)」,對使用宅配服務的人來說相當常見。","以前一般是打紙上寫的電話號碼,但隨著智慧型手機的普及,情況改變了。現在只要掃描紙上印的 QR code,選好希望的日期和時段就能申請。不過,通知單上也記載著保管期限,所以不能悠哉拖延。如果不早點辦理,包裹有可能被退回給寄件人,必須留意。","另一方面,重新配送還有一個問題:卡車的燃料和人力都會額外耗費。在司機短缺已成為社會問題的現在,對使用者也要求盡量一次就把包裹收到。因此受到關注的,就是「放門口配送(置き配)」和宅配箱這類收件方式。只要請對方把包裹放在玄關前或箱子裡,不論在不在家都能收到。","我自己最近網購下單時,也會把收件方式一併想好。每一項都只是小小的用心,但這樣的心態有助於減輕配送方的負擔。對使用者來說也省下了不必要的麻煩,可以說是對雙方都開心的習慣。"],"trans_en":["When I got home from work, I noticed a single missed-delivery slip from a courier in my mailbox. A package had arrived while I was out, so I had no choice but to ask for it to be delivered again. This procedure is called \"redelivery,\" and it is quite familiar to anyone who uses courier services.","In the past it was common to call the number written on the slip, but things changed as smartphones became widespread. Now you can apply just by scanning the QR code printed on the slip and choosing your preferred day and time slot. However, the slip also states a storage deadline, so you can't afford to take your time. If you don't act early, the package could be sent back to the sender, so be careful.","On the other hand, redelivery has a downside: it costs extra truck fuel and extra labor. With driver shortages now a social problem, users too are expected to receive their packages on the first attempt whenever possible. That is why \"drop-off delivery (okihai)\" and parcel lockers are attracting attention. If the package is left at your front door or in a locker, you can receive it whether or not you are at home.","Recently I have also started thinking about how I will receive a package when I place an online order. Each effort is only a small one, but this kind of mindset helps reduce the burden on the people who deliver. It also saves users unnecessary hassle, so it can be called a habit that is good for both sides."],"vocab":[{"w":"不在連絡票","r":"ふざいれんらくひょう","m":"不在通知單","m_en":"missed-delivery notice slip"},{"w":"留守","r":"るす","m":"不在家、外出","m_en":"being away from home"},{"w":"再配達","r":"さいはいたつ","m":"重新配送","m_en":"redelivery"},{"w":"普及","r":"ふきゅう","m":"普及","m_en":"spread, popularization"},{"w":"記載","r":"きさい","m":"記載、寫上","m_en":"to state, to write down"},{"w":"返送","r":"へんそう","m":"退回、寄回","m_en":"to send back, return"},{"w":"燃料","r":"ねんりょう","m":"燃料、油料","m_en":"fuel"},{"w":"置き配","r":"おきはい","m":"放置配送(放在門口)","m_en":"drop-off delivery at the door"},{"w":"負担","r":"ふたん","m":"負擔","m_en":"burden"},{"w":"心がけ","r":"こころがけ","m":"用心、留意的態度","m_en":"mindset, conscious effort"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某件事的變化,另一件事也跟著變化。例:「スマートフォンの普及に伴って状況が変わった」","t_en":"〜に伴って","note_en":"Expresses that as one thing changes, another changes along with it. Example: 「スマートフォンの普及に伴って状況が変わった」"},{"t":"〜ざるを得ない","note":"表示不得不做、別無選擇。例:「改めて配達してもらうよう依頼せざるを得ない」","t_en":"〜ざるを得ない","note_en":"Means having no choice but to do something. Example: 「改めて配達してもらうよう依頼せざるを得ない」","id":"n2-35"},{"t":"〜かねない","note":"表示有可能發生不好的結果。例:「荷物が送り主に返送されかねない」","t_en":"〜かねない","note_en":"Means something undesirable could possibly happen. Example: 「荷物が送り主に返送されかねない」","id":"n2-38"},{"t":"〜にかかわらず","note":"表示不受前項條件影響,都……。例:「在宅しているかどうかにかかわらず受け取ることができる」","t_en":"〜にかかわらず","note_en":"Means regardless of a condition. Example: 「在宅しているかどうかにかかわらず受け取ることができる」"}]},
{"id":"a-n3-13-n4","variant_of":"a-n3-13","level":"n4","topic":"生活","topic_en":"Daily life","title":"不在票が入っていたら","title_zh":"收到不在通知單的時候","title_en":"When You Find a Missed-Delivery Slip","body":"仕事から帰ると、郵便受けに紙が一枚入っていた。これは「不在票」といって、留守の間に荷物が来たという知らせだ。もう一度届けてもらうように頼むことを「再配達」という。\n今はスマホで、簡単に申し込むことができる。紙にあるQRコードを読んで、希望の日と時間を選ぶだけだ。でも、不在票には荷物を置いておく期限も書いてある。早く連絡しないと、荷物が送った人に戻されることもある。\n再配達は、トラックのガソリンも人の力も使うので大変だ。だから、玄関の前に荷物を置いてもらう「置き配」や宅配ボックスが便利だ。私は最近、ネットで買うとき、受け取り方まで考えるようにしている。自分にも配達の人にも、いい習慣だと思う。","trans":["下班回到家,信箱裡多了一張紙。這叫「不在票」,是通知我不在家的時候有包裹送來。請對方再送一次,這就叫做「再配達(重新配送)」。","現在用手機就能輕鬆申請。只要掃紙上的 QR code,選好想要的日期和時間就可以了。不過,通知單上也寫著包裹的保管期限。如果不早點聯絡,包裹也可能被退回給寄件人。","重新配送要用到卡車的油,也要花人力,所以很辛苦。因此,請對方把包裹放在玄關前的「放門口配送(置き配)」或宅配箱很方便。我最近網購的時候,也會連收件方式一起想好。我覺得這對自己和送貨的人都是好習慣。"],"trans_en":["I came home from work and found a slip of paper in my mailbox. It is called a 'fuzaihyo', a notice that a package came while I was out. Asking for the package to be delivered again is called 'saihaitatsu' (redelivery).","Now you can apply easily with your smartphone. You just scan the QR code on the paper and choose the day and time you want. However, the slip also shows a deadline for keeping the package. If you don't contact them soon, the package may be sent back to the sender.","Redelivery is hard work because it uses truck fuel and people's time. So 'okihai' (leaving the package at your door) or a delivery box is useful. Recently, when I shop online, I try to think about how I will receive the package too. I think it is a good habit for me and for the delivery person."],"vocab":[{"w":"郵便受け","r":"ゆうびんうけ","m":"信箱","m_en":"mailbox"},{"w":"留守","r":"るす","m":"不在家","m_en":"being away from home"},{"w":"荷物","r":"にもつ","m":"包裹、行李","m_en":"package, luggage"},{"w":"届ける","r":"とどける","m":"送達","m_en":"to deliver"},{"w":"申し込む","r":"もうしこむ","m":"申請、報名","m_en":"to apply"},{"w":"希望","r":"きぼう","m":"希望、想要","m_en":"wish, request"},{"w":"期限","r":"きげん","m":"期限","m_en":"deadline"},{"w":"玄関","r":"げんかん","m":"玄關、門口","m_en":"entrance, front door"},{"w":"習慣","r":"しゅうかん","m":"習慣","m_en":"habit"}],"grammar":[{"t":"〜てもらう","note":"表示請別人為自己做某事。例:「もう一度届けてもらうように頼むことを」、「荷物を置いてもらう」","t_en":"~te morau","note_en":"Means to have someone do something for you. Example: 「もう一度届けてもらうように頼むことを」"},{"t":"〜ないと、〜","note":"表示如果不做某事,就會有不好的結果。例:「早く連絡しないと、荷物が送った人に戻されることもある」","t_en":"~nai to, ~","note_en":"Means that if you don't do something, a bad result may follow. Example: 「早く連絡しないと、荷物が送った人に戻されることもある」"},{"t":"〜ようにする","note":"表示努力養成某種習慣或注意去做。例:「受け取り方まで考えるようにしている」","t_en":"~you ni suru","note_en":"Means to make an effort to do something regularly. Example: 「受け取り方まで考えるようにしている」","id":"n3-39"},{"t":"〜ので","note":"表示原因、理由,語氣比「から」柔和。例:「トラックのガソリンも人の力も使うので大変だ」","t_en":"~node","note_en":"Gives a reason, in a softer way than 'kara'. Example: 「トラックのガソリンも人の力も使うので大変だ」"}]},
{"id":"a-n3-14-n2","variant_of":"a-n3-14","level":"n2","topic":"文化","topic_en":"Culture","title":"紅葉狩りに出かけよう","title_zh":"一起去賞楓吧","title_en":"Let's Go Leaf Viewing","body":"十月の終わりに、同僚の田中さんから「今週末、紅葉を見に行きませんか」と誘われた。日本では秋になると山や公園で色づいた葉を楽しむ習慣があり、それを「紅葉狩り」と呼んで古くから親しんできた。私は紅葉が好きだが、有名な観光地は混雑すると聞いていたので、正直なところ少し不安だった。\nすると田中さんは「人込みを避けるために、朝早く出発するのはどうでしょうか」と提案してくれた。昼に近づくにつれて駐車場も道路も混み合うため、午前中のうちに着けば、落ち着いて歩けるということだった。平日のほうが空いている傾向にあるが、いつも静かだとは限らないので、期待しすぎないほうがよさそうだ。人気の時期である以上、ある程度の人出は覚悟せざるを得ないだろう。\n次に、観光協会や天気のサイトで公開されている「紅葉情報」を調べることにした。そこでは「色づき始め」や「見ごろ」といった言葉を使って、木の状態が分かりやすく説明されている。見ごろは場所によって異なるため、出かける前に必ず確認するようにと田中さんが教えてくれた。話し合いの結果、山に近い小さな公園を選び、朝一番の電車で向かうことに決めた。\n当日は少し眠かったが、早起きしたかいがあって、道にはほとんど人の姿がなかった。赤や黄色の葉が朝の光に照らされ、まるで空気まで色づいているかのように見えた。忙しい毎日の中では、季節の移り変わりをゆっくり感じる機会は決して多くない。帰りに「誘ってくださって、ありがとうございました」とお礼を言うと、田中さんが「来年も行きましょう」と笑った。その言葉を聞いて、私は次の秋が今から待ち遠しくなった。","trans":["十月底,同事田中邀我:「這個週末要不要去看楓葉?」在日本,秋天有到山上或公園欣賞變色葉子的習慣,稱之為「紅葉狩り」,自古以來深受人們喜愛。我喜歡楓葉,但聽說有名的觀光地人潮擁擠,老實說有點不安。","於是田中提議:「為了避開人潮,早上早點出發如何?」隨著接近中午,停車場和道路都會變得擁擠,所以如果在上午就抵達,據說就能從容地散步。平日雖然傾向於比較空,但並不一定總是安靜,所以最好不要期待過高。既然是熱門時期,多少人潮也只能有所心理準備吧。","接著,我們決定查詢觀光協會或天氣網站上公開的「紅葉情報」。那裡用「開始變色」或「最佳觀賞期」等詞彙,清楚易懂地說明樹木的狀態。田中提醒我,最佳觀賞期會因地點而異,所以出發前一定要確認。討論的結果,我們選了靠近山的小公園,決定搭一早的電車前往。","當天雖然有點睏,但早起很值得,路上幾乎看不到人影。紅色和黃色的葉子被晨光照亮,看起來彷彿連空氣都染上了顏色。在忙碌的每一天裡,能慢慢感受季節更迭的機會絕對不多。回程時我向田中道謝:「謝謝您邀請我。」田中笑著說「明年也一起去吧」。聽到這句話,我從現在就開始期待下一個秋天了。"],"trans_en":["At the end of October, my coworker Tanaka invited me: \"Shall we go see the autumn leaves this weekend?\" In Japan, there is a custom of enjoying colored leaves in the mountains and parks in autumn, called \"momijigari,\" which has been loved since long ago. I like autumn leaves, but I had heard that famous sightseeing spots get crowded, so to be honest I felt a little anxious.","Tanaka then suggested, \"To avoid the crowds, how about leaving early in the morning?\" As noon approaches, parking lots and roads get congested, so if we arrive in the morning, we could apparently walk in peace. Weekdays tend to be emptier, but they are not always quiet, so it seems best not to expect too much. Since it is a popular season, we will probably have to be prepared for some crowds.","Next, we decided to check the \"foliage information\" published on tourism association and weather websites. There, the condition of the trees is explained clearly with terms like \"starting to change color\" and \"peak viewing.\" Tanaka told me that peak viewing differs by location, so I should be sure to check before going. After talking it over, we chose a small park near the mountains and decided to go on the first train of the morning.","On the day, I was a little sleepy, but it was worth getting up early, as there were hardly any people on the road. The red and yellow leaves lit by the morning light looked as if even the air had taken on color. In our busy daily lives, we rarely have the chance to slowly feel the seasons change. On the way home, I thanked Tanaka: \"Thank you for inviting me.\" Tanaka smiled and said, \"Let's go again next year.\" Hearing that, I started looking forward to next autumn already."],"vocab":[{"w":"紅葉狩り","r":"もみじがり","m":"賞楓","m_en":"autumn leaf viewing"},{"w":"色づく","r":"いろづく","m":"變色、染上顏色","m_en":"to change color"},{"w":"人込み","r":"ひとごみ","m":"人潮、擁擠的人群","m_en":"crowd"},{"w":"提案","r":"ていあん","m":"提議","m_en":"suggestion, proposal"},{"w":"混み合う","r":"こみあう","m":"擁擠","m_en":"to be crowded"},{"w":"傾向","r":"けいこう","m":"傾向","m_en":"tendency"},{"w":"覚悟","r":"かくご","m":"心理準備、決心","m_en":"preparedness, resolve"},{"w":"見ごろ","r":"みごろ","m":"最佳觀賞期","m_en":"best time for viewing"},{"w":"異なる","r":"ことなる","m":"不同、相異","m_en":"to differ"},{"w":"待ち遠しい","r":"まちどおしい","m":"迫不及待的","m_en":"eagerly awaited"}],"grammar":[{"t":"〜につれて","note":"表示隨著某事的進展,另一件事也跟著變化。例:「昼に近づくにつれて駐車場も道路も混み合うため」","t_en":"〜につれて","note_en":"As one thing progresses, another changes along with it. Example: 「昼に近づくにつれて駐車場も道路も混み合うため」","id":"n2-54"},{"t":"〜とは限らない","note":"表示並非總是如此,留有例外。例:「いつも静かだとは限らない」","t_en":"〜とは限らない","note_en":"Not necessarily; leaves room for exceptions. Example: 「いつも静かだとは限らない」","id":"n2-58"},{"t":"〜ざるを得ない","note":"表示不得不、只能這樣做。例:「ある程度の人出は覚悟せざるを得ない」","t_en":"〜ざるを得ない","note_en":"Cannot help but; have no choice but to. Example: 「ある程度の人出は覚悟せざるを得ない」","id":"n2-35"},{"t":"〜かいがある","note":"表示付出努力後得到相應的回報,覺得值得。例:「早起きしたかいがあって」","t_en":"〜かいがある","note_en":"Indicates the effort paid off and was worthwhile. Example: 「早起きしたかいがあって」"}]},
{"id":"a-n3-14-n4","variant_of":"a-n3-14","level":"n4","topic":"文化","topic_en":"Culture","title":"紅葉を見に行こう","title_zh":"一起去賞楓吧","title_en":"Let's Go See the Autumn Leaves","body":"十月の終わりに、同じ会社の田中さんが「今週末、紅葉を見に行きませんか」と言いました。日本では、秋に山や公園で赤や黄色の葉を見ることを「紅葉狩り」と言います。私は紅葉が好きですが、有名な場所は人が多いと聞いたので、少し心配でした。\n田中さんは「朝早く出かけるのはどうですか」と言いました。昼になると駐車場も道も人と車でいっぱいになるので、午前中に着けば、ゆっくり歩けるそうです。平日のほうが空いていることが多いですが、いつも静かとは言えません。\n次に、インターネットで「紅葉情報」を調べました。そこには「色づき始め」や「見ごろ」という言葉で、木の様子が書いてあります。見ごろは場所によって違うので、出かける前に見るようにと田中さんが教えてくれました。二人で話して、山の近くの小さい公園を選び、朝一番の電車で行くことにしました。\n当日は少し眠かったですが、早く起きてよかったです。道には人がほとんどいませんでした。赤や黄色の葉が朝の光できれいに見えて、空気まで色がついているようでした。帰りに「誘ってくれて、ありがとうございました」とお礼を言いました。田中さんが「来年も行きましょう」と笑ったので、次の秋が今から楽しみです。","trans":["十月底,同公司的田中先生/小姐說:「這個週末要不要去看楓葉?」在日本,秋天到山上或公園看紅色和黃色的葉子,稱為「紅葉狩り」。我很喜歡楓葉,但聽說有名的地方人很多,所以有點擔心。","田中說:「早上早點出門如何?」到了中午,停車場和道路都會擠滿人和車,所以如果上午就到,據說可以悠閒地走走。平日多半比較空,但也不能說總是很安靜。","接著,我在網路上查了「紅葉情報」。那裡用「開始變色」和「最佳觀賞期」這些詞,寫出樹木的狀況。最佳觀賞期會因地點而不同,所以田中提醒我出發前要先看一下。我們兩人討論後,選了靠近山的小公園,決定搭一早的電車去。","當天雖然有點睏,但早起真好。路上幾乎沒有人。紅色和黃色的葉子在晨光下很漂亮,看起來彷彿連空氣都染上了顏色。回程時我道謝說:「謝謝你邀請我。」田中笑著說「明年也一起去吧」,所以我從現在就開始期待下一個秋天了。"],"trans_en":["At the end of October, Tanaka from my company said, \"Would you like to go see the autumn leaves this weekend?\" In Japan, looking at red and yellow leaves in the mountains or parks in autumn is called \"momijigari.\" I like autumn leaves, but I had heard that famous places are crowded, so I was a little worried.","Tanaka said, \"How about going out early in the morning?\" By noon, the parking lots and roads are full of people and cars, so if we arrive in the morning, we can walk slowly, they said. Weekdays are often emptier, but you can't say it is always quiet.","Next, I checked \"autumn leaf information\" on the internet. It describes the condition of the trees with words like \"starting to change color\" and \"peak time.\" The peak time is different depending on the place, so Tanaka told me to check before going out. The two of us talked, chose a small park near the mountains, and decided to go on the first train in the morning.","On the day, I was a little sleepy, but I was glad I got up early. There were almost no people on the road. The red and yellow leaves looked beautiful in the morning light, and it seemed as if even the air had taken on color. On the way home, I thanked them, saying \"Thank you for inviting me.\" Tanaka smiled and said \"Let's go next year too,\" so I am already looking forward to next autumn."],"vocab":[{"w":"紅葉","r":"こうよう","m":"楓葉、紅葉","m_en":"autumn leaves"},{"w":"同じ","r":"おなじ","m":"相同的","m_en":"same"},{"w":"心配","r":"しんぱい","m":"擔心","m_en":"worry"},{"w":"駐車場","r":"ちゅうしゃじょう","m":"停車場","m_en":"parking lot"},{"w":"平日","r":"へいじつ","m":"平日","m_en":"weekday"},{"w":"空く","r":"すく","m":"變空、人少","m_en":"to become empty"},{"w":"選ぶ","r":"えらぶ","m":"選擇","m_en":"to choose"},{"w":"眠い","r":"ねむい","m":"想睡的","m_en":"sleepy"},{"w":"お礼","r":"おれい","m":"道謝、謝禮","m_en":"thanks"},{"w":"楽しみ","r":"たのしみ","m":"期待、樂趣","m_en":"looking forward to"}],"grammar":[{"t":"〜ので","note":"表示原因、理由,語氣比較柔和。例:「有名な場所は人が多いと聞いたので、少し心配でした」","t_en":"~ node","note_en":"Gives a reason in a soft way. Example: 「有名な場所は人が多いと聞いたので、少し心配でした」"},{"t":"〜そうだ(傳聞)","note":"表示聽來的消息,「據說…」。例:「午前中に着けば、ゆっくり歩けるそうです」","t_en":"~ sou da (hearsay)","note_en":"Reports what you heard: 'I hear that...'. Example: 「午前中に着けば、ゆっくり歩けるそうです」"},{"t":"〜ようにと言う/教える","note":"表示轉述請對方做某事。例:「出かける前に見るようにと田中さんが教えてくれました」","t_en":"~ you ni to iu/oshieru","note_en":"Reports advice or a request to do something. Example: 「出かける前に見るようにと田中さんが教えてくれました」"},{"t":"〜ことにする","note":"表示自己決定做某事。例:「朝一番の電車で行くことにしました」","t_en":"~ koto ni suru","note_en":"Expresses a decision you made. Example: 「朝一番の電車で行くことにしました」"}]},
{"id":"a-n3-15-n2","variant_of":"a-n3-15","level":"n2","topic":"職場","topic_en":"Work","title":"初めての年末調整","title_zh":"第一次的年末調整","title_en":"My First Year-End Tax Adjustment","body":"年末が近づくに伴って、人事部から「年末調整のご案内」というメールと書類が届いた。書類には家族の扶養状況や保険料を記入する欄があったが、何から書けばよいのか見当もつかなかった。日本で働くのは初めてで、「年末調整」という言葉自体、これまで耳にしたことがなかったのである。\n隣の席の田中さんに相談すると、「毎年の手続きですから、心配はいりませんよ」と言って安心させてくれた。毎月の給料から引かれる税金はあくまで仮の計算であり、年末に一年分を計算し直す仕組みなのだそうだ。家族の状況や支払った保険料に応じて税額が変わるため、正確に記入することが重要だという。どの会社でも書き方が同じとは限らないので、不明な点は人事に直接聞くようにと言われた。\n翌日、人事の佐藤さんに質問しに行くと、記入例を見せながら一つずつ丁寧に説明してくれた。自分で支払った保険がある場合には、保険会社から届く証明書が必要になることもあるそうだ。質問すること自体が嫌だったわけではないが、忙しそうな人事の担当者に対して声をかけにくいと感じていた。しかし佐藤さんは「初めてなら聞いて当然ですよ」と笑顔で答えてくれ、気持ちが少し楽になった。\n帰宅してから、家にある保険の書類を探し、書くべき内容をじっくり確認することにした。詳しい手続きや提出方法は会社によって異なるため、必ず自社の説明を確認してほしい。年末調整は一見面倒に思えるが、一年分の税金を正しく精算するための大切な手続きなのだと理解できた。","trans":["隨著年底接近,人事部寄來了「年末調整說明」的郵件和文件。文件上有填寫家人扶養狀況和保險費的欄位,但我完全不知道該從哪裡開始寫。我第一次在日本工作,連「年末調整」這個詞本身以前都沒聽過。","我向隔壁座位的田中先生請教,他說:「這是每年都要做的手續,不用擔心喔。」讓我安心不少。每個月從薪水扣掉的稅金終究只是暫時的計算,年底會把一整年的稅金重新算過,據說就是這樣的機制。稅額會依家人的狀況和所付的保險費而改變,因此正確填寫很重要。而且並非每家公司的填法都一樣,所以他叫我不懂的地方直接去問人事。","隔天,我去向人事的佐藤小姐請教,她一邊給我看填寫範例,一邊一項一項仔細說明。據說如果有自己繳費的保險,有時還需要保險公司寄來的證明書。我並不是討厭發問,只是覺得人事的承辦人看起來很忙,不太好意思開口。不過佐藤小姐笑著回答:「第一次的話,當然要問啊。」讓我的心情輕鬆了一些。","回到家後,我決定找出家裡的保險文件,慢慢確認該寫的內容。詳細的手續和繳交方式會因公司而異,請務必確認公司的說明。年末調整乍看之下很麻煩,但我理解到它是把一整年稅金正確結算的重要手續。"],"trans_en":["As the end of the year approached, HR sent an email and documents titled \"Year-End Tax Adjustment Guide.\" The forms had fields for family dependents and insurance premiums, but I had no idea where to begin. It was my first time working in Japan, and I had never even heard the term \"year-end adjustment\" before.","I asked Tanaka, who sits next to me, and was reassured when they said, \"It's a yearly procedure, so there's nothing to worry about.\" The tax withheld from each month's pay is only a provisional calculation, and at year-end the full year's tax is recalculated. Since the tax amount changes depending on your family situation and the premiums you paid, filling it in accurately is important. Because the way to fill it out isn't necessarily the same at every company, I was told to ask HR directly about anything unclear.","The next day I went to ask Sato in HR, who explained everything patiently one item at a time while showing me a sample entry. If you have insurance you pay for yourself, you may also need a certificate sent by the insurance company. It wasn't that I disliked asking questions, but HR looked busy and I felt hesitant to approach them. Still, Sato smiled and said, \"If it's your first time, of course you should ask,\" which put me a little more at ease.","After getting home, I decided to look for the insurance documents in my house and calmly check what I needed to write. Detailed procedures and submission methods differ by company, so please be sure to check your own company's instructions. Year-end adjustment may look troublesome at first glance, but I came to understand that it is an important procedure for settling a full year's tax correctly."],"vocab":[{"w":"年末調整","r":"ねんまつちょうせい","m":"年末調整(年底重新結算一年稅金的手續)","m_en":"year-end tax adjustment"},{"w":"扶養","r":"ふよう","m":"扶養","m_en":"dependent support"},{"w":"記入","r":"きにゅう","m":"填寫、記入","m_en":"to fill in, to enter"},{"w":"見当","r":"けんとう","m":"頭緒、推測","m_en":"idea, guess"},{"w":"仮","r":"かり","m":"暫時的、假的","m_en":"provisional, temporary"},{"w":"仕組み","r":"しくみ","m":"機制、結構","m_en":"mechanism, system"},{"w":"証明書","r":"しょうめいしょ","m":"證明書","m_en":"certificate"},{"w":"一見","r":"いっけん","m":"乍看之下","m_en":"at first glance"},{"w":"精算","r":"せいさん","m":"結算、精算","m_en":"to settle accounts"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某事的變化,另一件事也跟著變化。例:「年末が近づくに伴って、人事部から「年末調整のご案内」というメールと書類が届いた」","t_en":"〜に伴って","note_en":"As one thing changes, another changes with it. Example: 「年末が近づくに伴って、人事部から「年末調整のご案内」というメールと書類が届いた」"},{"t":"〜に応じて","note":"依照、配合某種狀況而改變。例:「家族の状況や支払った保険料に応じて税額が変わるため」","t_en":"〜に応じて","note_en":"In accordance with, depending on a situation. Example: 「家族の状況や支払った保険料に応じて税額が変わるため」","id":"n2-24"},{"t":"〜とは限らない","note":"表示不一定、並非總是如此(部分否定)。例:「どの会社でも書き方が同じとは限らないので」","t_en":"〜とは限らない","note_en":"Not necessarily; not always the case. Example: 「どの会社でも書き方が同じとは限らないので」","id":"n2-58"},{"t":"〜に対して","note":"表示動作或感情所針對的對象。例:「忙しそうな人事の担当者に対して声をかけにくいと感じていた」","t_en":"〜に対して","note_en":"Toward, with regard to (a target of an action or feeling). Example: 「忙しそうな人事の担当者に対して声をかけにくいと感じていた」","id":"n3-2"}]},
{"id":"a-n3-15-n4","variant_of":"a-n3-15","level":"n4","topic":"職場","topic_en":"Work","title":"はじめての年末調整","title_zh":"第一次的年末調整","title_en":"My First Year-End Tax Adjustment","body":"年末が近くなったころ、会社からメールと書類が届きました。「年末調整」についての案内でした。書類には家族のことや保険のお金を書くところがありましたが、何から書けばいいか分かりませんでした。日本で働くのは初めてなので、「年末調整」という言葉も知りませんでした。\n隣の席の田中さんに聞くと、「毎年することだから、心配しなくていいですよ」と言いました。毎月の給料から引かれる税金は、とりあえずの計算だそうです。年の終わりに、一年分の税金をもう一度計算します。書き方は会社によって少し違うので、分からないところは人事の人に聞くように言われました。\n次の日、人事の佐藤さんに聞きに行きました。佐藤さんは書き方の見本を見せて、一つずつ教えてくれました。自分で払った保険があれば、保険の会社から来る紙が必要になることもあるそうです。忙しそうなので、声をかけにくいと思っていました。でも佐藤さんは「初めてなら、聞いていいですよ」と笑って言いました。\n家に帰ってから、保険の書類を探して、ゆっくり読むことにしました。くわしいやり方は会社によって違うので、会社の説明をよく読んでください。年末調整は大変そうですが、大切な手続きだと分かりました。","trans":["年底快到的時候,公司寄來了郵件和文件,是關於「年末調整」的說明。文件上有填寫家人和保險費用的欄位,但我不知道該從哪裡開始寫。我第一次在日本工作,連「年末調整」這個詞都不知道。","我問了隔壁座位的田中先生,他說:「這是每年都要做的事,不用擔心喔。」據說每個月從薪水扣掉的稅金只是暫時的計算。到了年底,會把一整年的稅金再算一次。填法會因公司而稍有不同,所以他叫我不懂的地方去問人事的人。","隔天,我去問人事的佐藤小姐。佐藤小姐給我看填寫的範例,一項一項地教我。據說如果有自己繳費的保險,有時還需要保險公司寄來的文件。我覺得她看起來很忙,不太好意思開口。不過佐藤小姐笑著說:「第一次的話,可以問喔。」","回到家後,我決定找出保險的文件,慢慢地讀。詳細的做法會因公司而異,請好好閱讀公司的說明。年末調整看起來很麻煩,但我知道了它是很重要的手續。"],"trans_en":["As the end of the year got close, the company sent me an email and some papers. They were about the year-end tax adjustment. The papers had places to write about my family and insurance money, but I did not know where to start. This was my first time working in Japan, so I did not even know the words 'year-end adjustment.'","I asked Mr. Tanaka, who sits next to me, and he said, 'We do this every year, so you don't need to worry.' The tax taken from your monthly pay is only a temporary calculation, he said. At the end of the year, they calculate the tax for the whole year again. The way to fill it in is a little different at each company, so he told me to ask the HR staff about anything I did not understand.","The next day, I went to ask Ms. Sato in HR. She showed me an example of how to fill it in and taught me one thing at a time. If you have insurance that you paid for yourself, you may also need a paper from the insurance company, she said. She looked busy, so I thought it was hard to talk to her. But Ms. Sato smiled and said, 'If it is your first time, it is fine to ask.'","After I got home, I decided to look for my insurance papers and read them slowly. The detailed way to do it is different at each company, so please read your company's explanation carefully. The year-end adjustment looks hard, but I understood that it is an important procedure."],"vocab":[{"w":"年末","r":"ねんまつ","m":"年底","m_en":"end of the year"},{"w":"書類","r":"しょるい","m":"文件、資料","m_en":"documents, papers"},{"w":"保険","r":"ほけん","m":"保險","m_en":"insurance"},{"w":"心配","r":"しんぱい","m":"擔心","m_en":"worry"},{"w":"税金","r":"ぜいきん","m":"稅金","m_en":"tax"},{"w":"計算","r":"けいさん","m":"計算","m_en":"calculation"},{"w":"人事","r":"じんじ","m":"人事(部門)","m_en":"HR, personnel"},{"w":"見本","r":"みほん","m":"範例、樣本","m_en":"example, sample"},{"w":"必要","r":"ひつよう","m":"必要","m_en":"necessary"},{"w":"手続き","r":"てつづき","m":"手續","m_en":"procedure"}],"grammar":[{"t":"〜ので","note":"表示原因、理由,語氣比「から」柔和。例:「日本で働くのは初めてなので、「年末調整」という言葉も知りませんでした」","t_en":"~ので (because)","note_en":"Gives a reason in a soft way. Example: 「日本で働くのは初めてなので、「年末調整」という言葉も知りませんでした」"},{"w":"","t":"〜そうだ(傳聞)","note":"表示聽來的消息,「據說…」。例:「毎月の給料から引かれる税金は、とりあえずの計算だそうです」","t_en":"~そうだ (hearsay)","note_en":"Means 'I heard that...'. Example: 「毎月の給料から引かれる税金は、とりあえずの計算だそうです」"},{"t":"〜ように言われる","note":"表示被人要求、叮嚀去做某事。例:「分からないところは人事の人に聞くように言われました」","t_en":"~ように言われる","note_en":"Means 'was told to do ~'. Example: 「分からないところは人事の人に聞くように言われました」"},{"t":"〜ことにする","note":"表示自己決定要做某事。例:「保険の書類を探して、ゆっくり読むことにしました」","t_en":"~ことにする","note_en":"Means 'decide to do ~'. Example: 「保険の書類を探して、ゆっくり読むことにしました」"}]},
{"id":"a-n3-16-n2","variant_of":"a-n3-16","level":"n2","topic":"文化","topic_en":"Culture","title":"喪中はがきが届いたら","title_zh":"收到喪中明信片時","title_en":"When a Mourning Postcard Arrives","body":"十一月の初め、同僚の田中さんから一枚のはがきが届き、開けてみると喪中を知らせる内容だった。「喪中につき、年始のご挨拶をご遠慮申し上げます」という丁寧な文面が、短い言葉ながら重く目に残った。今年の夏に田中さんのお父さんが亡くなっていたことを、私はそのとき初めて知らされたのである。\nこれは「喪中はがき」と呼ばれ、家族に不幸があった人が年賀状を出さないことを事前に知らせるためのものである。喪に服している間はお祝いごとを慎むべきだという考え方に基づいて、この習慣が根付いたと言われている。年賀状の準備が始まる前に届くことが多いのは、相手に早めに事情を伝えて、無用な気遣いをさせないためだ。つまり喪中はがきは「年賀状を出せません」という連絡にすぎず、相手に返事を求めているわけではない。\n私は対応にしばらく迷ったが、同僚に相談した結果、田中さんには年賀状を出さないことにした。その代わりに、年が明けてしばらくしてから「寒中見舞い」を送れば、気持ちが伝わると教えてもらった。寒中見舞いとは、寒さの厳しい時期に相手の健康を気づかう挨拶状であり、お祝いの言葉は書かない点が特徴だ。文面には、はがきを受け取ったお礼と、田中さんの家族を思う言葉を入れるよう、特に心がけた。\n年賀状の扱いは職場によって異なるため、詳しくは会社の説明を確認しておく必要がある。年賀状の習慣は少しずつ減ってきているが、季節の挨拶を通して気持ちを伝える文化は、今も大切にされている。今回の経験を通じて、相手の状況を思いやり、挨拶の形を変えることも職場の大切なマナーだと学んだ。","trans":["十一月初,同事田中先生寄來一張明信片,打開一看,內容是通知對方自己正在服喪。「因服喪,謹不寄送新年問候,敬請見諒」這段有禮的文字,雖然簡短,卻沉重地留在我的眼裡。我是在這時,才第一次得知田中先生的父親今年夏天已經過世。","這叫做「喪中明信片」,是家中有喪事的人,事先告知對方自己不寄年賀狀所用的東西。據說是基於「服喪期間應避免慶祝之事」的想法,這個習慣才逐漸扎根。它多半在年賀狀開始準備之前寄到,是為了提早讓對方了解情況,免得對方多費不必要的心思。也就是說,喪中明信片只是「我無法寄年賀狀」的通知,並不是要求對方回覆。","我猶豫了一陣該怎麼應對,但和同事商量之後,決定不寄年賀狀給田中先生。同事還告訴我,改在過完年、過一陣子之後寄「寒中見舞い」,就能傳達心意。寒中見舞い是在寒冷嚴峻的時期關心對方健康的問候信,特點是不寫祝賀的話。我在內容裡特別留意,寫上收到明信片的謝意,以及對田中先生家人的關懷。","公司對年賀狀的處理方式因職場而異,所以詳情有必要先向公司確認。年賀狀的習慣雖然逐漸減少,但透過季節問候傳達心意的文化,至今仍受到重視。透過這次的經驗,我學到體諒對方的處境、改變問候的形式,也是職場上重要的禮儀。"],"trans_en":["In early November, a postcard arrived from my coworker Mr. Tanaka, and when I opened it, it turned out to be a notice of mourning. The polite message, which said that New Year's greetings would be refrained from because of mourning, stayed in my mind with a heavy weight despite its brevity. It was only then that I learned that Mr. Tanaka's father had passed away this summer.","This is called a \"mourning postcard,\" and it is something a person who has lost a family member sends in advance to let others know they will not send New Year's cards. It is said that the custom took root based on the idea that celebrations should be avoided while one is in mourning. These postcards often arrive before preparations for New Year's cards begin, so that the recipient is informed early and does not have to worry unnecessarily. In other words, a mourning postcard is merely a notice that \"I cannot send a New Year's card,\" and it does not ask the recipient for a reply.","I hesitated for a while over how to respond, but after consulting a coworker, I decided not to send Mr. Tanaka a New Year's card. I was also told that if I sent a \"kanchu-mimai\" (a midwinter greeting) some time after the new year began, my feelings would come across. A kanchu-mimai is a greeting card that expresses concern for the recipient's health during the harsh cold season, and its distinguishing feature is that it contains no words of celebration. In the text, I made a point of including thanks for the postcard and words of care for Mr. Tanaka's family.","How New Year's cards are handled differs from workplace to workplace, so it is necessary to check the company's guidance for details. The custom of New Year's cards is gradually declining, but the culture of conveying feelings through seasonal greetings is still valued today. Through this experience, I learned that being considerate of the other person's situation and changing the form of one's greeting is also an important piece of workplace etiquette."],"vocab":[{"w":"喪中","r":"もちゅう","m":"服喪期間","m_en":"period of mourning"},{"w":"不幸","r":"ふこう","m":"不幸(此指喪事)","m_en":"misfortune (here, a death in the family)"},{"w":"慎む","r":"つつしむ","m":"節制、避免","m_en":"to refrain from, to be restrained"},{"w":"根付く","r":"ねづく","m":"扎根、固定下來","m_en":"to take root, to become established"},{"w":"事情","r":"じじょう","m":"情況、緣由","m_en":"circumstances, reason"},{"w":"無用","r":"むよう","m":"不必要的","m_en":"unnecessary"},{"w":"気遣い","r":"きづかい","m":"顧慮、操心","m_en":"concern, consideration"},{"w":"挨拶状","r":"あいさつじょう","m":"問候信、致意函","m_en":"greeting card or letter"},{"w":"心がける","r":"こころがける","m":"留意、努力做到","m_en":"to keep in mind, to make an effort to"},{"w":"思いやる","r":"おもいやる","m":"體諒、設身處地","m_en":"to be considerate of, to empathize with"}],"grammar":[{"t":"〜に基づいて","note":"表示以某事物為根據或基礎。例:「お祝いごとを慎むべきだという考え方に基づいて、この習慣が根付いた」。","t_en":"based on ~","note_en":"Shows that something rests on a certain basis or idea. Example: 「お祝いごとを慎むべきだという考え方に基づいて、この習慣が根付いた」."},{"w":"","t":"〜にすぎない","note":"表示「不過是~而已」,強調程度有限。例:「『年賀状を出せません』という連絡にすぎず」。","t_en":"nothing more than ~","note_en":"Means \"only\" or \"merely,\" stressing limited scope. Example: 「『年賀状を出せません』という連絡にすぎず」.","id":"n2-29"},{"t":"〜わけではない","note":"部分否定,表示「並不是說~」,用來否定一種可能的理解。例:「相手に返事を求めているわけではない」。","t_en":"it is not that ~","note_en":"A partial negation meaning \"it doesn't mean that ~,\" used to deny a possible assumption. Example: 「相手に返事を求めているわけではない」.","id":"n3-43"},{"t":"〜を通して/〜を通じて","note":"表示透過某種手段或經驗。例:「季節の挨拶を通して気持ちを伝える文化」「今回の経験を通じて」。","t_en":"through ~","note_en":"Indicates a means or experience through which something happens. Examples: 「季節の挨拶を通して気持ちを伝える文化」 and 「今回の経験を通じて」."}]},
{"id":"a-n3-16-n4","variant_of":"a-n3-16","level":"n4","topic":"文化","topic_en":"Culture","title":"喪中はがきが届いたら","title_zh":"收到喪中明信片時","title_en":"When a Mourning Postcard Arrives","body":"十一月の初めに、同じ会社の田中さんからはがきが届いた。開けてみると、「喪中なので、新年のあいさつをしません」と書いてあった。田中さんのお父さんが夏に亡くなったことを、私はそのとき初めて知った。\nこれは「喪中はがき」といって、年賀状を出さないことを知らせるはがきだ。家族が亡くなった間は、お祝いをしないという考え方がある。はがきは年賀状を準備する前に届くことが多い。\n私は少し迷ったが、同僚に聞いて、年賀状は出さないことにした。年が明けてから「寒中見舞い」を送ると、気持ちが伝わると教えてもらった。寒中見舞いは、寒い時期に相手を心配する手紙で、お祝いは書かない。手紙には、はがきのお礼と、家族を思う言葉を書くようにした。相手の気持ちを考えてあいさつを変えることも、大切なマナーだと学んだ。","trans":["十一月初,同公司的田中先生寄來一張明信片。打開一看,上面寫著「因為服喪,所以不寄新年問候」。我這時才第一次知道,田中先生的父親在夏天過世了。","這叫做「喪中明信片」,是用來通知對方自己不寄年賀狀的明信片。家人過世的期間,有不慶祝的想法。這種明信片多半在準備年賀狀之前寄到。","我有點猶豫,但問了同事後,決定不寄年賀狀。同事告訴我,過完年之後寄「寒中見舞い」,就能傳達心意。寒中見舞い是在寒冷時期關心對方的信,不寫祝賀的話。我在信裡盡量寫上收到明信片的謝意,以及對他家人的關懷。我學到,體諒對方的心情、改變問候的方式,也是重要的禮儀。"],"trans_en":["At the beginning of November, a postcard arrived from Mr. Tanaka, a coworker at my company. When I opened it, it said, \"Because we are in mourning, we will not send New Year greetings.\" That was the first time I learned that Mr. Tanaka's father had passed away in the summer.","This is called a \"mourning postcard,\" and it tells people that you will not send New Year cards. There is an idea that while a family is mourning, they do not celebrate. These postcards often arrive before people start preparing their New Year cards.","I hesitated a little, but after asking a coworker, I decided not to send a New Year card. I was told that if I send a \"midwinter greeting\" after the new year begins, my feelings will come across. A midwinter greeting is a letter that shows concern for someone during the cold season, and it does not include words of celebration. In my letter, I tried to write thanks for the postcard and words thinking of his family. I learned that considering the other person's feelings and changing the form of a greeting is also important manners.\""],"vocab":[{"w":"届く","r":"とどく","m":"送達、寄到","m_en":"to arrive, to be delivered"},{"w":"同僚","r":"どうりょう","m":"同事","m_en":"coworker"},{"w":"亡くなる","r":"なくなる","m":"過世","m_en":"to pass away"},{"w":"知らせる","r":"しらせる","m":"通知、告知","m_en":"to inform"},{"w":"準備","r":"じゅんび","m":"準備","m_en":"preparation"},{"w":"迷う","r":"まよう","m":"猶豫、迷惘","m_en":"to hesitate, to be unsure"},{"w":"伝わる","r":"つたわる","m":"傳達到、被理解","m_en":"to be conveyed"},{"w":"心配する","r":"しんぱいする","m":"擔心、關心","m_en":"to worry about"},{"w":"お礼","r":"おれい","m":"謝意、謝禮","m_en":"thanks"}],"grammar":[{"t":"〜てみると","note":"做了某個動作之後,發現了某件事。例:「開けてみると、『喪中なので、新年のあいさつをしません』と書いてあった」。","t_en":"〜te miru to","note_en":"When one tries doing something, one finds out something. Example: 「開けてみると、『喪中なので、新年のあいさつをしません』と書いてあった」."},{"t":"〜ことにする","note":"表示自己決定要做或不做某事。例:「年賀状は出さないことにした」。","t_en":"〜koto ni suru","note_en":"Expresses a decision one has made. Example: 「年賀状は出さないことにした」."},{"t":"〜てもらう","note":"表示從別人那裡得到某個行為或資訊,帶有感謝的語氣。例:「気持ちが伝わると教えてもらった」。","t_en":"〜te morau","note_en":"Receiving an action or favor from someone. Example: 「気持ちが伝わると教えてもらった」."},{"t":"〜ようにする","note":"表示努力去做某事、盡量養成習慣。例:「家族を思う言葉を書くようにした」。","t_en":"〜you ni suru","note_en":"Making an effort to do something. Example: 「家族を思う言葉を書くようにした」.","id":"n3-39"}]},
{"id":"a-n4-12-n2","variant_of":"a-n4-12","level":"n2","topic":"健康","topic_en":"Health","title":"インフルエンザの予防接種","title_zh":"打流感疫苗","title_en":"Getting a Flu Shot","body":"十月に入ると、近所のクリニックの入り口に「インフルエンザ予防接種、始めました」という貼り紙が出されました。その貼り紙を見て、今年もそういう季節になったのだと改めて気づかされました。実は去年の冬、わたしはインフルエンザにかかり、一週間も会社を休まざるを得ませんでした。体調管理も仕事のうちだと痛感したこともあり、今年は早めに予防接種を受けることにしました。\n電話で予約をしてから出かけると、受付で問診票を渡され、体温を測ったうえで体の調子を記入しました。注射は想像していたほど痛くなく、拍子抜けしてしまうくらいでした。接種のあとは、しばらく待合室で様子を見るようにと言われました。体調が急に変わる可能性もあるので、指示に従って休むのは当然の対応でしょう。\n一方、予防接種には健康保険が使えないため、費用は決して安いとは言えません。値段は病院によって異なるそうで、わたしの場合は三千五百円でした。治療に対して予防は病気になる前の備えである以上、自己負担になるのも仕方ないのかもしれません。とはいえ、一週間も仕事を休む損失を考えれば、高すぎる出費ではないと感じました。\n効果が出るまでには二週間ほどかかるそうなので、早めに受けておく必要があります。流行が始まってから慌てて接種しても、間に合うとは限りません。流行する前に済ませておけば、安心して冬を過ごせるでしょう。","trans":["一進入十月,附近診所的入口就貼出了「流感疫苗開打了」的告示。看到那張告示,我再次意識到今年又到了這個季節。其實去年冬天我得了流感,整整一個禮拜都不得不向公司請假。再加上我深刻體會到健康管理也是工作的一部分,所以今年決定早一點去打疫苗。","先打電話預約再過去,在櫃台拿到問診單,量完體溫後填寫了身體狀況。打針沒有想像中那麼痛,甚至讓我有點撲了個空的感覺。打完之後,對方交代我先在候診室休息觀察一下。身體狀況有可能突然改變,所以聽從指示休息是理所當然的做法。","另一方面,疫苗接種不能使用健保,所以費用絕對稱不上便宜。聽說價格依醫院而異,我是花了三千五百日圓。相對於治療,預防是在生病之前的準備,既然如此,由自己負擔或許也是沒辦法的事。話雖如此,考慮到請一整個禮拜假所造成的損失,我覺得這筆花費並不算太貴。","聽說要大約兩個禮拜才會產生效果,所以有必要早點接種。等流行開始才慌張去打,也不一定來得及。趁流行之前先處理好,就能安心地度過冬天了。"],"trans_en":["As soon as October began, a notice reading \"Flu shots now available\" appeared at the entrance of a nearby clinic. Seeing it, I was reminded once again that the season had come around. Last winter, in fact, I caught the flu and had no choice but to take a whole week off work. Having also realized keenly that managing one's health is part of the job, I decided to get vaccinated early this year.","I booked by phone and then went in, where I was handed a medical questionnaire at reception and, after having my temperature taken, filled in how I was feeling. The injection was less painful than I had imagined, almost anticlimactic. Afterward, I was told to rest in the waiting room for a while. Since one's condition can change suddenly, following that instruction seems only natural.","On the other hand, health insurance does not cover vaccinations, so the cost can hardly be called cheap. The price reportedly differs by hospital, and in my case it was 3,500 yen. Since prevention is preparation before illness, unlike treatment, paying out of pocket may be unavoidable. Still, considering the loss from missing a whole week of work, it did not feel like an excessive expense.","The vaccine reportedly takes about two weeks to take effect, so it is necessary to get it early. Rushing to get it after the flu season has started does not always mean you will be in time. If you get it done before the flu spreads, you can spend the winter with peace of mind."],"vocab":[{"w":"貼り紙","r":"はりがみ","m":"張貼的告示、海報","m_en":"posted notice"},{"w":"痛感する","r":"つうかんする","m":"深切感受到","m_en":"to feel keenly"},{"w":"問診票","r":"もんしんひょう","m":"問診單","m_en":"medical questionnaire"},{"w":"記入する","r":"きにゅうする","m":"填寫","m_en":"to fill in"},{"w":"拍子抜け","r":"ひょうしぬけ","m":"撲了個空、大失所望","m_en":"anticlimax"},{"w":"自己負担","r":"じこふたん","m":"自費、自行負擔","m_en":"out-of-pocket payment"},{"w":"損失","r":"そんしつ","m":"損失","m_en":"loss"},{"w":"出費","r":"しゅっぴ","m":"開銷、花費","m_en":"expense"},{"w":"流行する","r":"りゅうこうする","m":"流行、蔓延","m_en":"to spread, to be prevalent"}],"grammar":[{"t":"〜ざるを得ない","note":"表示「不得不、只能」,帶有無可奈何的語氣。例:「一週間も会社を休まざるを得ませんでした」。","t_en":"~zaru o enai","note_en":"Means 'have no choice but to', with a sense of reluctance. Example: 「一週間も会社を休まざるを得ませんでした」.","id":"n2-35"},{"t":"〜に対して","note":"表示對比,「相對於～」。例:「治療に対して予防は病気になる前の備えである以上」。","t_en":"~ni taishite","note_en":"Expresses contrast: 'as opposed to ~'. Example: 「治療に対して予防は病気になる前の備えである以上」.","id":"n3-2"},{"t":"〜以上","note":"表示「既然～、正因為～」,後面接應有的判斷或結論。例:「備えである以上、自己負担になるのも仕方ない」。","t_en":"~ijou","note_en":"Means 'since ~' or 'now that ~', leading to a natural conclusion. Example: 「備えである以上、自己負担になるのも仕方ない」."},{"t":"〜とは限らない","note":"表示「不一定～」,否定絕對的說法。例:「流行が始まってから慌てて接種しても、間に合うとは限りません」。","t_en":"~to wa kagiranai","note_en":"Means 'not necessarily ~', denying an absolute claim. Example: 「流行が始まってから慌てて接種しても、間に合うとは限りません」.","id":"n2-58"}]},
{"id":"a-n4-12-n3","variant_of":"a-n4-12","level":"n3","topic":"健康","topic_en":"Health","title":"インフルエンザの予防接種","title_zh":"打流感疫苗","title_en":"Getting a Flu Shot","body":"十月に入ると、近所のクリニックに「予防接種を始めました」という紙が貼られていました。去年の冬、インフルエンザにかかってしまい、一週間も会社を休まなければなりませんでした。その経験があるため、今年は早めに予防接種を受けることにしました。\n電話で予約をしてから出かけると、受付で問診票を渡されました。まず熱をはかり、そのあと体の調子について問診票に書くように言われました。注射は思っていたほど痛くなかったので、少しほっとしました。\n終わったあと、しばらく待合室で休むように言われました。予防接種には健康保険が使えないため、少し高いと感じました。値段は病院によって違うそうですが、わたしの場合は三千五百円でした。\n効果が出るまでには、二週間ぐらいかかるそうです。流行が始まる前に受けておけば、安心して冬を過ごすことができます。体の準備には時間がかかるので、早めに受けておくのが大切だと思います。","trans":["一到十月,附近的診所就貼出了「開始打疫苗了」的告示。去年冬天我得了流感,整整一個禮拜都得向公司請假。因為有過這樣的經驗,所以今年我決定早一點接種疫苗。","先打電話預約再過去,在櫃台拿到了問診單。對方要我先量體溫,再把身體狀況寫在問診單上。打針沒有想像中那麼痛,讓我稍微鬆了一口氣。","打完之後,對方要我先在候診室休息一會兒。因為疫苗不能使用健保,所以我覺得有點貴。聽說價格依醫院而異,我這次是三千五百日圓。","聽說要大約兩個禮拜才會見效。在流行開始之前先打好,冬天就能安心度過。身體要做好準備需要時間,所以我覺得早點接種很重要。"],"trans_en":["When October came, a notice saying \"Flu shots now available\" was posted at a nearby clinic. Last winter I caught the flu and had to take a whole week off work. Because of that experience, I decided to get vaccinated early this year.","I made a reservation by phone and then went, and at the reception desk I was handed a medical questionnaire. I was told to take my temperature first and then write about how I was feeling on the form. The injection didn't hurt as much as I'd expected, so I felt a little relieved.","Afterward, I was told to rest in the waiting room for a while. Since health insurance doesn't cover vaccinations, it felt a bit expensive. I hear the price differs depending on the hospital, but in my case it was 3,500 yen.","I hear it takes about two weeks for the vaccine to take effect. If you get it before flu season starts, you can spend the winter with peace of mind. Since the body needs time to prepare, I think it's important to get it early."],"vocab":[{"w":"予防接種","r":"よぼうせっしゅ","m":"預防接種、打疫苗","m_en":"vaccination"},{"w":"問診票","r":"もんしんひょう","m":"問診單","m_en":"medical questionnaire"},{"w":"受付","r":"うけつけ","m":"櫃台、受理處","m_en":"reception desk"},{"w":"待合室","r":"まちあいしつ","m":"候診室、等候室","m_en":"waiting room"},{"w":"健康保険","r":"けんこうほけん","m":"健康保險、健保","m_en":"health insurance"},{"w":"効果","r":"こうか","m":"效果","m_en":"effect"},{"w":"流行","r":"りゅうこう","m":"流行、(疾病)蔓延","m_en":"spread, epidemic"},{"w":"早め","r":"はやめ","m":"提早、稍早","m_en":"a bit early"},{"w":"調子","r":"ちょうし","m":"狀況、狀態","m_en":"condition"},{"w":"値段","r":"ねだん","m":"價格","m_en":"price"}],"grammar":[{"t":"〜ことにする","note":"表示自己決定做某事。文中:「今年は早めに予防接種を受けることにしました」,說明因為去年的經驗而下的決定。","t_en":"〜koto ni suru","note_en":"Expresses a decision the speaker makes. Example: 「今年は早めに予防接種を受けることにしました」 (I decided to get vaccinated early this year)."},{"t":"〜ため(原因)","note":"用較正式的語氣表示原因、理由,比「から」更書面。文中:「予防接種には健康保険が使えないため、少し高いと感じました」。","t_en":"〜tame (reason)","note_en":"Gives a reason in a more formal, written tone than から. Example: 「予防接種には健康保険が使えないため、少し高いと感じました」 (Because insurance can't be used, it felt a bit expensive)."},{"t":"〜ように言われる","note":"表示被人要求、交代去做某事(間接引用的指示)。文中:「問診票に書くように言われました」「待合室で休むように言われました」。","t_en":"〜you ni iwareru","note_en":"Means being told to do something (reported instruction). Example: 「待合室で休むように言われました」 (I was told to rest in the waiting room)."},{"t":"〜によって","note":"表示「依…而不同」,隨對象或情況變化。文中:「値段は病院によって違うそうですが」。","t_en":"〜ni yotte","note_en":"Means 'depending on…', indicating variation by case. Example: 「値段は病院によって違うそうですが」 (The price differs depending on the hospital)."}]},
{"id":"a-n4-13-n2","variant_of":"a-n4-13","level":"n2","topic":"文化","topic_en":"Culture","title":"七五三の日","title_zh":"七五三之日","title_en":"The Day of Shichi-Go-San","body":"十一月のある土曜日、わたしは友人と一緒に、近くの神社まで散歩に出かけた。境内に足を踏み入れると、華やかな着物を身にまとった子どもたちと、その家族の姿が数多く見られた。中でも、赤い着物を着た小さな女の子が、いかにもうれしそうに写真に収まっていたのが印象的だった。\n日本人の友人の田中さんによると、これは七五三という行事だそうだ。七五三とは、三歳、五歳、七歳を迎えた子どもの成長を祝い、これまで無事に育ったことに感謝する行事である。家族は神社でお祈りをしてもらい、子どもがこれからも元気に育つようにと願うのが一般的だという。祝い方は家庭によって同じとは限らないが、子どもの健康を願う気持ちはどこでも共通しているのだろう。\n田中さんは、子どもたちが手に持っている長い紙の袋を指さして、説明を続けてくれた。袋の中には千歳飴という細長いあめが入っており、長生きしてほしいという家族の願いがこめられているそうだ。千歳飴は和菓子屋などでも買えると、田中さんは教えてくれた。\n田中さんにとっては身近な行事であるのに対して、わたしには初めて目にする光景で、とても新鮮に映った。見た目は素朴なあめでも、そこに込められた思いの深さを知ると、行事の意味を考えざるを得なかった。もし将来子どもができたなら、わたしも千歳飴を用意して、成長を祝わずにはいられないだろう。","trans":["十一月的某個星期六,我和朋友一起去附近的神社散步。一走進神社境內,就看到許多穿著華麗和服的孩子和他們的家人。其中,一個穿著紅色和服的小女孩開心地留下照片,讓我印象特別深刻。","據日本朋友田中先生說,這是名為七五三的習俗。七五三是為滿三歲、五歲、七歲的孩子慶祝成長,並感謝他們至今平安長大的習俗。一般來說,家人會請神社為孩子祈福,希望孩子今後也能健康長大。雖然各個家庭的慶祝方式不一定相同,但祈願孩子健康的心情,想必無論在哪裡都是共通的吧。","田中先生指著孩子們手上拿的長長紙袋,繼續為我說明。袋子裡裝著一種叫千歳飴的細長糖果,據說其中寄託了家人希望孩子長壽的心願。田中先生還告訴我,和菓子店等地方也買得到千歳飴。","對田中先生而言這是很熟悉的習俗,但對我來說卻是第一次看到的景象,感覺非常新鮮。雖然只是外表樸素的糖果,但一得知其中寄託的心意有多深,就不得不思考這個習俗的意義。如果將來有了孩子,我想我也一定會忍不住準備千歳飴來慶祝孩子的成長。"],"trans_en":["On a Saturday in November, I went for a walk to a nearby shrine with a friend. As soon as we stepped into the shrine grounds, we saw many children dressed in gorgeous kimono along with their families. Most memorable was a little girl in a red kimono, who was having her photo taken with an unmistakably happy look.","According to my Japanese friend Tanaka, this was a event called Shichi-Go-San. It celebrates the growth of children who have reached the ages of three, five and seven, and gives thanks that they have grown up safely so far. Generally, families have the shrine perform a prayer and wish for the child to keep growing up healthy. The way of celebrating may not be the same in every family, but the wish for a child's health is probably shared everywhere.","Tanaka pointed at the long paper bags the children were holding and went on to explain. Inside the bags is a long, thin candy called chitose-ame, which is said to carry the family's wish for the child to live a long life. Tanaka also told me that chitose-ame can be bought at places such as traditional sweets shops.","For Tanaka it was a familiar event, whereas for me it was a sight I was seeing for the first time, and it felt very fresh. Even though it is a plain-looking candy, once I learned how deep the feelings put into it are, I couldn't help thinking about the meaning of the event. If I have children in the future, I probably won't be able to resist preparing chitose-ame to celebrate their growth too."],"vocab":[{"w":"境内","r":"けいだい","m":"神社、寺院的境內","m_en":"grounds of a shrine or temple"},{"w":"身にまとった","r":"みにまとった","m":"穿上、披上(身にまとう)","m_en":"wore, dressed in (身にまとう)"},{"w":"印象的","r":"いんしょうてき","m":"令人印象深刻的","m_en":"impressive, memorable"},{"w":"行事","r":"ぎょうじ","m":"例行活動、習俗儀式","m_en":"event, traditional ceremony"},{"w":"成長","r":"せいちょう","m":"成長","m_en":"growth"},{"w":"願い","r":"ねがい","m":"心願、願望","m_en":"wish, hope"},{"w":"素朴","r":"そぼく","m":"樸素、純樸","m_en":"simple, plain"},{"w":"光景","r":"こうけい","m":"景象、情景","m_en":"scene, sight"},{"w":"共通","r":"きょうつう","m":"共通、共同","m_en":"common, shared"}],"grammar":[{"t":"〜とは限らない","note":"表示「不一定」,指出並非總是如此。例:「祝い方は家庭によって同じとは限らないが」意思是各家庭的慶祝方式不一定相同。","t_en":"〜とは限らない","note_en":"Means 'not necessarily', pointing out something is not always the case. Example: 「祝い方は家庭によって同じとは限らないが」 means the way of celebrating is not necessarily the same in every family.","id":"n2-58"},{"t":"〜に対して","note":"表示對比,「A 對 B 則是…」。例:「田中さんにとっては身近な行事であるのに対して、わたしには初めて目にする光景で」把田中先生與我的感受做對比。","t_en":"〜に対して","note_en":"Expresses contrast: 'whereas'. Example: 「田中さんにとっては身近な行事であるのに対して、わたしには初めて目にする光景で」 contrasts Tanaka's feeling with the narrator's.","id":"n3-2"},{"t":"〜ざるを得ない","note":"表示「不得不…」,在情況下別無選擇。例:「行事の意味を考えざるを得なかった」意思是不得不去思考這個習俗的意義。","t_en":"〜ざるを得ない","note_en":"Means 'cannot help but do', having no other choice. Example: 「行事の意味を考えざるを得なかった」 means the narrator couldn't help thinking about the meaning of the event.","id":"n2-35"},{"t":"〜ずにはいられない","note":"表示「忍不住…、不由自主地…」,是自然湧出的情感或衝動。例:「成長を祝わずにはいられないだろう」意思是一定會忍不住想慶祝孩子的成長。","t_en":"〜ずにはいられない","note_en":"Means 'cannot help but', expressing an irresistible feeling or urge. Example: 「成長を祝わずにはいられないだろう」 means the narrator probably won't be able to resist celebrating the child's growth."}]},
{"id":"a-n4-13-n3","variant_of":"a-n4-13","level":"n3","topic":"文化","topic_en":"Culture","title":"七五三の日","title_zh":"七五三之日","title_en":"Shichi-Go-San Day","body":"十一月のある土曜日、わたしは友だちと一緒に、家の近くの神社へ散歩に行きました。境内には、きれいな着物を着た子どもたちと、その家族の姿がたくさん見られました。赤い着物を着た小さい女の子は、うれしそうな顔で家族に写真をとってもらっていました。普段の神社よりずっとにぎやかで、なんだか特別な日のような雰囲気でした。\n日本人の友だちの田中さんが、これは七五三という行事だと教えてくれました。七五三は、三歳、五歳、七歳になった子どもの成長を祝うための行事です。家族は神社でお祈りをしてもらい、子どもが元気に育つようにとお願いするそうです。家族にとっては、子どもの成長をあらためて感じる大切な機会になっているのだと思います。\n田中さんは、子どもたちが持っている長い紙のふくろを指さしました。中には千歳あめという細長いあめが入っています。このあめには、長生きしてほしいという家族の願いがこめられているそうです。千歳あめは和菓子屋さんなどでも買えると、田中さんは言いました。もし将来子どもができたら、わたしも千歳あめを用意して、同じようにお祝いしたいです。","trans":["十一月的某個星期六,我和朋友一起去家附近的神社散步。神社境內可以看到許多穿著漂亮和服的孩子和他們的家人。穿著紅色和服的小女孩,帶著開心的表情讓家人幫她拍照。這裡比平常的神社熱鬧許多,感覺像是個特別的日子。","日本朋友田中先生告訴我,這是名為七五三的習俗。七五三是為了慶祝長到三歲、五歲、七歲的孩子的成長而舉行的習俗。聽說家人會請神社為孩子祈福,並祈願孩子能健康長大。我想,對家人來說,這也是一個重新感受孩子成長的重要機會。","田中先生指著孩子們手上拿的長長紙袋。裡面裝著一種叫千歳飴的細長糖果。聽說這種糖果寄託了家人希望孩子長壽的心願。田中先生說,和菓子店等地方也買得到千歳飴。如果將來我有了孩子,也想準備千歳飴,用同樣的方式來慶祝。"],"trans_en":["One Saturday in November, I went for a walk to a shrine near my home with a friend. Inside the grounds, we saw many children in beautiful kimono along with their families. A little girl in a red kimono was happily having her photo taken by her family. It was much livelier than the shrine usually is, and it felt like a special day.","My Japanese friend Tanaka told me that this was an event called Shichi-Go-San. Shichi-Go-San is an event to celebrate the growth of children who have reached the ages of three, five, and seven. I heard that families have a priest pray for them at the shrine and wish for their children to grow up healthy. I think it is an important occasion for families to appreciate their children's growth anew.","Tanaka pointed at the long paper bags the children were holding. Inside is a long, thin candy called Chitose-ame. I heard that this candy carries the family's wish for the child to live a long life. Tanaka said you can also buy Chitose-ame at Japanese confectionery shops and other places. If I have children in the future, I would like to prepare Chitose-ame and celebrate in the same way."],"vocab":[{"w":"境内","r":"けいだい","m":"(神社、寺廟的)境內","m_en":"shrine or temple grounds"},{"w":"行事","r":"ぎょうじ","m":"例行活動、習俗儀式","m_en":"event, ceremony"},{"w":"成長","r":"せいちょう","m":"成長","m_en":"growth"},{"w":"祝う","r":"いわう","m":"慶祝","m_en":"to celebrate"},{"w":"お祈り","r":"おいのり","m":"祈禱、祈福","m_en":"prayer"},{"w":"育つ","r":"そだつ","m":"成長、長大","m_en":"to grow up"},{"w":"願い","r":"ねがい","m":"心願、願望","m_en":"wish"},{"w":"細長い","r":"ほそながい","m":"細長的","m_en":"long and thin"},{"w":"将来","r":"しょうらい","m":"將來","m_en":"future"},{"w":"用意","r":"ようい","m":"準備","m_en":"preparation, to prepare"}],"grammar":[{"t":"〜ように(目的・願望)","note":"表示為了達成某個狀態而做某事或祈願。例:「子どもが元気に育つようにとお願いするそうです」","t_en":"~ように (purpose / wish)","note_en":"Expresses a wish or goal that one hopes will come true. Example: 「子どもが元気に育つようにとお願いするそうです」","id":"n3-54"},{"t":"〜てもらう","note":"表示請別人為自己或自己人做某事,並受到恩惠。例:「家族に写真をとってもらっていました」「お祈りをしてもらい」","t_en":"~てもらう","note_en":"Expresses receiving a favor from someone who does something for you. Example: 「家族に写真をとってもらっていました」"},{"t":"〜てほしい","note":"表示希望對方做某事或成為某種狀態。例:「長生きしてほしいという家族の願い」","t_en":"~てほしい","note_en":"Expresses a wish for someone else to do something or be a certain way. Example: 「長生きしてほしいという家族の願い」"},{"t":"〜そうです(傳聞)","note":"表示從別人那裡聽來的資訊。例:「願いがこめられているそうです」","t_en":"~そうです (hearsay)","note_en":"Reports information heard from someone else. Example: 「願いがこめられているそうです」"}]},
{"id":"a-n4-14-n2","variant_of":"a-n4-14","level":"n2","topic":"生活","topic_en":"Daily life","title":"冬の電気代と上手に付き合う","title_zh":"與冬天的電費好好相處","title_en":"Getting Along with Winter Electricity Bills","body":"日本の冬は、屋外だけでなく家の中でも、想像していた以上に冷え込むものです。古い部屋では窓の隙間から冷気が入り込むため、暖房をつけてもなかなか暖まりません。気温が下がるのに伴って、どうしても暖房に頼らざるを得ない時間が長くなります。先月、届いた請求書を見ると、電気代が普段よりかなり高く、思わず驚いてしまいました。\n友人にその話をしたところ、節約のコツをいくつも教えてもらうことができました。まず、電気毛布を使って、寝る前にふとんを暖めておくという方法です。暖房が室温を上げるのに対して、加湿器は同じ室温でも暖かく感じさせてくれるそうです。\n厚手のカーテンに替えてからは、窓際の冷たさが目に見えて和らぎ、効果の大きさを実感しました。暖房の設定温度も少し低めにして、その分は上着を着て過ごすようにしています。田中さんには、使っていない部屋の暖房は消したほうがいいとも助言してもらいました。\n料金プランについては、自分で判断するより、電力会社に詳しい内容を問い合わせてみるのが確実でしょう。寒さを我慢することだけが節約とは限らず、道具や使い方の工夫でも負担は減らせます。少しの工夫を続けていけば、この冬も電気代を気にしすぎずに過ごせそうです。","trans":["日本的冬天,不只是戶外,連在家裡也會冷得超乎想像。老房子的冷空氣會從窗縫鑽進來,所以就算開了暖氣也很難暖起來。隨著氣溫下降,不得不依賴暖氣的時間也變得越來越長。上個月我看了寄來的帳單,發現電費比平常高出不少,不禁嚇了一跳。","我跟朋友聊起這件事,學到了好幾個省電的訣竅。首先是用電毯,在睡前先把被窩暖好。暖氣是提高室溫,相對地,聽說加濕器能讓人在同樣的室溫下也覺得比較暖和。","換成厚窗簾之後,窗邊的冷意明顯減弱,讓我實際感受到效果之大。我也把暖氣的設定溫度調得稍低一些,並以穿外套來補足。田中先生還建議我,不用的房間最好把暖氣關掉。","至於電費方案,與其自己判斷,直接向電力公司詢問詳細內容會比較可靠。忍耐寒冷並不一定就是省電,靠工具和使用方式上的用心,也能減輕負擔。只要持續做一些小小的用心,今年冬天看起來也能不用太擔心電費地度過。"],"trans_en":["Winter in Japan is colder than you might imagine, not only outdoors but inside the home as well. In old rooms, cold air seeps in through gaps around the windows, so the room hardly warms up even with the heating on. As temperatures drop, the time we have no choice but to rely on heating gets longer. When I looked at the bill that arrived last month, the electricity charge was quite a bit higher than usual, and I was startled.","When I told a friend about it, I was given a number of money-saving tips. First, use an electric blanket to warm up the futon before bed. Whereas heating raises the room temperature, a humidifier reportedly makes the room feel warmer even at the same temperature.","After switching to thick curtains, the chill near the windows eased noticeably, and I really felt how effective they are. I also set the heating temperature a little lower and make up for it by wearing a jacket. Ms. Tanaka also advised me to turn off the heating in rooms I am not using.","As for rate plans, rather than judging on my own, it is surely more reliable to ask the electricity company for the details. Enduring the cold is not necessarily the only way to save, and tools and the way you use them can also lighten the burden. If I keep up small efforts, it looks like I can get through this winter too without worrying too much about the bill."],"vocab":[{"w":"冷え込む","r":"ひえこむ","m":"(氣溫)驟降、變得很冷","m_en":"to get very cold"},{"w":"隙間","r":"すきま","m":"縫隙","m_en":"gap, crack"},{"w":"請求書","r":"せいきゅうしょ","m":"帳單、請款單","m_en":"bill, invoice"},{"w":"節約","r":"せつやく","m":"節約、節省","m_en":"saving, economizing"},{"w":"暖める","r":"あたためる","m":"使溫暖、加熱","m_en":"to warm up"},{"w":"和らぐ","r":"やわらぐ","m":"緩和、減輕","m_en":"to soften, to ease"},{"w":"実感","r":"じっかん","m":"實際感受到","m_en":"real feeling, realization"},{"w":"助言","r":"じょげん","m":"建議、忠告","m_en":"advice"},{"w":"問い合わせる","r":"といあわせる","m":"詢問、洽詢","m_en":"to inquire"},{"w":"我慢","r":"がまん","m":"忍耐、忍受","m_en":"endurance, putting up with"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某個變化,另一件事也跟著變化。文中:「気温が下がるのに伴って、どうしても暖房に頼らざるを得ない時間が長くなります」","t_en":"~ni tomonatte","note_en":"As X changes, Y changes along with it. Example: 「気温が下がるのに伴って、どうしても暖房に頼らざるを得ない時間が長くなります」"},{"t":"〜ざるを得ない","note":"表示不得不、只能這麼做(動詞ない形去掉ない+ざるを得ない)。文中:「暖房に頼らざるを得ない時間」","t_en":"~zaru o enai","note_en":"Cannot help but; have no choice but to do. Example: 「暖房に頼らざるを得ない時間」","id":"n2-35"},{"t":"〜に対して","note":"表示對比,前後兩件事形成對照。文中:「暖房が室温を上げるのに対して、加湿器は同じ室温でも暖かく感じさせてくれるそうです」","t_en":"~ni taishite","note_en":"In contrast to; whereas. Example: 「暖房が室温を上げるのに対して、加湿器は同じ室温でも暖かく感じさせてくれるそうです」","id":"n3-2"},{"t":"〜とは限らない","note":"表示不一定、未必如此,用來否定過於絕對的想法。文中:「寒さを我慢することだけが節約とは限らず」","t_en":"~to wa kagiranai","note_en":"Not necessarily; not always. Example: 「寒さを我慢することだけが節約とは限らず」","id":"n2-58"}]},
{"id":"a-n4-14-n3","variant_of":"a-n4-14","level":"n3","topic":"生活","topic_en":"Daily life","title":"冬の電気代","title_zh":"冬天的電費","title_en":"Winter Electricity Bills","body":"日本の冬は、家の中にいても思っていた以上に寒く感じられます。古い部屋では窓から冷たい空気が入ってくるため、暖房をつけてもなかなかあたたまりません。先月、請求書を見ると、電気代がいつもより高くなっていて、とても驚きました。そこで友だちに相談したところ、節約のコツをいくつか教えてもらいました。\nまず、電気毛布を使って、寝る前にふとんをあたためておくようにしています。加湿器をつけると、部屋の温度が同じでも、あたたかく感じられるそうです。厚いカーテンに換えてからは、窓の近くで感じる冷たさがかなり減りました。暖房の設定温度は少し低めにして、そのかわり上着を着て過ごすことにしました。\n田中さんは、使っていない部屋の暖房は消したほうがいいと教えてくれました。料金プランについては、詳しい内容を電力会社に聞いてみるのがいいでしょう。少しの工夫でも続けていけば、電気代を気にしすぎることなく冬を過ごせそうです。寒さをがまんするわけではなく、上手に工夫することが大切だと感じました。","trans":["日本的冬天,即使待在家裡,也讓人覺得比想像中還要冷。老房子會因為冷空氣從窗戶進來,就算開了暖氣也很難暖起來。上個月我一看帳單,發現電費比平常高,非常驚訝。於是我找朋友商量,朋友教了我幾個省電的訣竅。","首先,我會用電毯,盡量在睡前先把被窩暖好。聽說開了加濕器之後,就算室溫一樣,也會覺得比較暖和。換成厚窗簾之後,窗邊感受到的冷意減少了很多。我把暖氣的設定溫度調得稍微低一點,改成穿上外套過日子。","田中先生告訴我,不用的房間最好把暖氣關掉。關於電費方案,最好向電力公司詢問詳細內容。只要持續做一些小小的用心,就能不用太擔心電費地度過這個冬天。我覺得重點不是忍耐寒冷,而是聰明地想辦法。"],"trans_en":["Even indoors, winter in Japan feels colder than you would expect. In an old room, cold air comes in through the windows, so it is hard to warm the room even with the heater on. When I looked at my bill last month, the electricity cost was higher than usual, and I was very surprised. So I talked to a friend, who taught me several money-saving tips.","First, I use an electric blanket and try to warm up my futon before going to bed. I hear that with a humidifier on, a room feels warmer even if the temperature is the same. Since I switched to thick curtains, the chill near the window has decreased quite a lot. I set the heater to a slightly lower temperature and decided to wear a jacket instead.","Ms. or Mr. Tanaka told me it is better to turn off the heater in rooms I am not using. As for rate plans, it would be a good idea to ask the electricity company for the details. If I keep up even small efforts, it seems I can get through the winter without worrying too much about the bill. I felt that the point is not to put up with the cold, but to be smart about it."],"vocab":[{"w":"暖房","r":"だんぼう","m":"暖氣","m_en":"heating"},{"w":"請求書","r":"せいきゅうしょ","m":"帳單","m_en":"bill, invoice"},{"w":"相談","r":"そうだん","m":"商量","m_en":"consultation, to talk over"},{"w":"節約","r":"せつやく","m":"節約、省","m_en":"saving, economizing"},{"w":"加湿器","r":"かしつき","m":"加濕器","m_en":"humidifier"},{"w":"設定","r":"せってい","m":"設定","m_en":"setting"},{"w":"過ごす","r":"すごす","m":"度過、過日子","m_en":"to spend (time), to live through"},{"w":"工夫","r":"くふう","m":"用心想辦法、巧思","m_en":"ingenuity, a clever idea"},{"w":"料金","r":"りょうきん","m":"費用、費率","m_en":"fee, rate"}],"grammar":[{"t":"〜ため(原因)","note":"表示原因、理由,語氣比「から」更書面。例:「古い部屋では窓から冷たい空気が入ってくるため、暖房をつけてもなかなかあたたまりません」","t_en":"〜ため (reason)","note_en":"Expresses a cause or reason, more formal than から. Example: 「古い部屋では窓から冷たい空気が入ってくるため、暖房をつけてもなかなかあたたまりません」"},{"t":"〜ようにしている","note":"表示努力養成某個習慣、盡量去做。例:「寝る前にふとんをあたためておくようにしています」","t_en":"〜ようにしている","note_en":"Means making an effort to do something as a habit. Example: 「寝る前にふとんをあたためておくようにしています」"},{"t":"〜ことにする","note":"表示自己決定要做某事。例:「そのかわり上着を着て過ごすことにしました」","t_en":"〜ことにする","note_en":"Expresses a decision made by oneself. Example: 「そのかわり上着を着て過ごすことにしました」"},{"t":"〜わけではない","note":"表示部分否定,「並不是說……」。例:「寒さをがまんするわけではなく、上手に工夫することが大切だと感じました」","t_en":"〜わけではない","note_en":"Partial negation: it is not that.... Example: 「寒さをがまんするわけではなく、上手に工夫することが大切だと感じました」","id":"n3-43"}]},
{"id":"a-n4-15-n2","variant_of":"a-n4-15","level":"n2","topic":"生活","topic_en":"Daily life","title":"年末の大そうじ、早めに始めるのがおすすめ","title_zh":"年末大掃除,提早開始比較好","title_en":"Start Your Year-End Cleaning Early","body":"毎年十二月になると、大そうじに追われて疲れ果ててしまうのが、わたしの年末の恒例になっていました。そこで今年は、十二月に入る前に、そうじが必要な場所をリストに書き出してみることにしました。台所、おふろ、まど、げんかんなど、実際に書いてみると、思っていたより場所が多いことに気づきました。\n次に、ドラッグストアへ行って、そうじに使う洗剤やスポンジを買いそろえました。店の人によると、おふろ用の洗剤はカビも落とせるということで、とても参考になりました。ただ、一度に全部やろうとすると疲れてしまうので、毎週一か所だけそうじすることにしました。\n今週は台所、来週はおふろ、というように、週ごとに場所を決めておけば、無理なく進められます。ルームメイトのリンさんにこの計画を話したところ、いっしょにやろうと言ってくれました。わたしは台所とおふろ、リンさんはまどとげんかんを、それぞれ担当することになりました。大きいごみについては、出し方が地域によって違うため、区役所の案内で確認しておく必要があります。\n友だちの話では、早めに始めれば、そうじそのものだけでなく、気持ちの面でも楽になるそうです。確かに、年末に追われながらやるのと、余裕を持って進めるのとでは、疲れ方がまったく違うでしょう。この方法なら、今年の年末はゆっくり休めそうだと、今から楽しみにしています。","trans":["每年一到十二月,我就被大掃除追著跑、累得精疲力盡,幾乎成了我年底的慣例。所以今年我決定在進入十二月之前,先把需要打掃的地方寫成清單。廚房、浴室、窗戶、玄關等等,實際寫下來才發現,要打掃的地方比想像中多。","接著,我去藥妝店把打掃要用的清潔劑和海綿買齊。店員說浴室用的清潔劑也能去除黴菌,這對我很有參考價值。不過,如果想一次全部做完會很累,所以我決定每週只打掃一個地方。","像是這週廚房、下週浴室這樣,每週先決定好地方,就能不勉強地進行下去。我把這個計畫告訴室友小林,她說要一起做。我負責廚房和浴室,小林負責窗戶和玄關。至於大型垃圾,丟法會因地區而異,所以需要看區公所的說明來確認。","聽朋友說,如果早點開始,不只是打掃本身,連心情上也會比較輕鬆。的確,在年底被時間追著跑地做,和從容地慢慢進行,累的程度應該完全不同。這樣的話,我很期待今年年底可以好好休息。"],"trans_en":["Every December, I would get swamped by the big cleaning and end up completely exhausted, and it had become my yearly routine. So this year, before December began, I decided to write out a list of the places that needed cleaning. The kitchen, bathroom, windows, entryway and more: once I actually wrote it down, I realized there were more places than I had expected.","Next, I went to a drugstore and bought all the detergent and sponges I would need. According to the store clerk, the bathroom detergent can even remove mold, which was very helpful. However, trying to do everything at once would be exhausting, so I decided to clean just one place each week.","By deciding on a place for each week, such as the kitchen this week and the bathroom next week, I can keep going without overdoing it. When I told my roommate Lin about this plan, she said she would do it with me. I will take the kitchen and bathroom, and Lin will take the windows and entryway. As for large trash, the disposal rules differ by area, so I need to check the ward office's guide.","According to a friend, if you start early, it gets easier not only in terms of the cleaning itself but also mentally. Indeed, being chased by the clock at year-end and working at a relaxed pace must feel completely different in how tiring it is. With this method, I'm already looking forward to being able to rest properly at the end of this year."],"vocab":[{"w":"恒例","r":"こうれい","m":"慣例、每年固定的事","m_en":"annual custom, routine"},{"w":"疲れ果てる","r":"つかれはてる","m":"累壞、精疲力盡","m_en":"to be utterly exhausted"},{"w":"書き出す","r":"かきだす","m":"寫出來、列出","m_en":"to write out, list"},{"w":"買いそろえる","r":"かいそろえる","m":"買齊","m_en":"to buy everything needed"},{"w":"洗剤","r":"せんざい","m":"清潔劑、洗潔精","m_en":"detergent, cleaning agent"},{"w":"担当","r":"たんとう","m":"負責、擔任","m_en":"being in charge of"},{"w":"区役所","r":"くやくしょ","m":"區公所","m_en":"ward office"},{"w":"確認","r":"かくにん","m":"確認","m_en":"confirmation, checking"},{"w":"余裕","r":"よゆう","m":"餘裕、從容","m_en":"leeway, margin, composure"}],"grammar":[{"t":"〜たところ","note":"表示做了某個動作之後,得到意外或特定的結果。例:「リンさんにこの計画を話したところ、いっしょにやろうと言ってくれました」","t_en":"~たところ","note_en":"Expresses that after doing something, a certain result followed. Example: 「リンさんにこの計画を話したところ、いっしょにやろうと言ってくれました」 (When I told Lin about the plan, she offered to do it together.)","id":"n3-19"},{"t":"〜によると","note":"表示消息或資訊的來源,後面常接「〜そうだ、〜ということだ」。例:「店の人によると、おふろ用の洗剤はカビも落とせるということで」","t_en":"~によると","note_en":"Indicates the source of information, often followed by ~そうだ or ~ということだ. Example: 「店の人によると、おふろ用の洗剤はカビも落とせるということで」 (According to the clerk, the bathroom detergent can remove mold.)"},{"t":"〜によって違う","note":"表示會依對象、地區、情況而不同。例:「出し方が地域によって違うため、区役所の案内で確認しておく必要があります」","t_en":"~によって違う","note_en":"Means something differs depending on the person, place, or situation. Example: 「出し方が地域によって違うため、区役所の案内で確認しておく必要があります」 (The disposal method differs by area, so you need to check the ward office guide.)"},{"t":"〜のと〜のとでは","note":"比較兩種做法或狀態,指出兩者差異很大。例:「年末に追われながらやるのと、余裕を持って進めるのとでは、疲れ方がまったく違うでしょう」","t_en":"~のと~のとでは","note_en":"Compares two actions or states and points out a clear difference. Example: 「年末に追われながらやるのと、余裕を持って進めるのとでは、疲れ方がまったく違うでしょう」 (Working under year-end pressure and working with room to spare must feel completely different.)"}]},
{"id":"a-n4-15-n3","variant_of":"a-n4-15","level":"n3","topic":"生活","topic_en":"Daily life","title":"年末の大そうじ、早めに始めよう","title_zh":"年末大掃除,提早開始吧","title_en":"Start Your Year-End Cleaning Early","body":"毎年十二月になると、大そうじに追われて、いつもぐったり疲れてしまいます。そこで今年は、十二月に入る前に、そうじする場所をリストにして書き出してみました。台所、おふろ、まど、げんかんなど、思ったより多くて驚きました。\n次に、ドラッグストアへ行って、洗剤やスポンジを買いました。店の人によると、おふろ用の洗剤はカビもきれいに落とせるそうです。一度に全部やろうとすると疲れてしまうため、毎週一か所だけそうじすることにしました。今週は台所、来週はおふろ、というように、順番を決めておきました。\nルームメイトのリンさんに話したところ、いっしょにやると言ってくれました。わたしは台所とおふろ、リンさんはまどとげんかんを担当することになりました。大きいごみについては、出し方を区役所の案内で調べておく必要があります。友だちの話では、早めに始めると気持ちにも余裕ができるそうです。この方法なら、無理なく続けられるので、年末もゆっくり休めそうだと思います。","trans":["每年一到十二月,我總是被大掃除追著跑,累得筋疲力盡。所以今年我在進入十二月之前,先試著把要打掃的地方列成清單寫下來。廚房、浴室、窗戶、玄關等等,比我想像的多,讓我嚇了一跳。","接著,我去了藥妝店,買了清潔劑和海綿。據店員說,浴室用的清潔劑也能把黴菌清得很乾淨。因為一次全部做會累壞,所以我決定每週只打掃一個地方。我按順序排好了,這週廚房、下週浴室,就這樣一路排下去。","我跟室友小林提起這件事,她說願意一起做。我負責廚房和浴室,小林則負責窗戶和玄關。大型垃圾的丟法,必須先看區公所的說明來確認。聽朋友說,早點開始,心情也會比較從容。我想這個方法不會太勉強,可以持續下去,所以年底應該也能好好休息了。"],"trans_en":["Every December, I get swamped by the year-end cleaning and always end up exhausted. So this year, before December began, I tried writing out a list of the places to clean. Kitchen, bathroom, windows, entrance and so on—there were more than I expected, which surprised me.","Next, I went to a drugstore and bought detergent and sponges. According to the clerk, the bathroom detergent can remove mold thoroughly too. Because doing everything at once would wear me out, I decided to clean just one place each week. I set the order in advance: the kitchen this week, the bathroom next week, and so on.","When I told my roommate, Lin, she said she would do it with me. I will take care of the kitchen and bathroom, and Lin will take care of the windows and entrance. For large trash, I need to check how to put it out using the ward office's guide. My friend says that starting early also gives you more peace of mind. With this method, I can keep going without strain, so I think I'll be able to rest properly at the end of the year."],"vocab":[{"w":"追われる","r":"おわれる","m":"被…追著跑、忙於應付","m_en":"to be pressed by, to be swamped with"},{"w":"洗剤","r":"せんざい","m":"清潔劑、洗潔精","m_en":"detergent"},{"w":"落とせる","r":"おとせる","m":"能去除(汙漬等)","m_en":"can remove (stains, etc.)"},{"w":"順番","r":"じゅんばん","m":"順序、輪流","m_en":"order, turn"},{"w":"担当","r":"たんとう","m":"負責、擔任","m_en":"being in charge of"},{"w":"区役所","r":"くやくしょ","m":"區公所","m_en":"ward office"},{"w":"調べる","r":"しらべる","m":"調查、查詢","m_en":"to look up, to check"},{"w":"余裕","r":"よゆう","m":"從容、餘裕","m_en":"leeway, composure"},{"w":"驚く","r":"おどろく","m":"驚訝、嚇一跳","m_en":"to be surprised"}],"grammar":[{"t":"〜ことにする","note":"表示自己決定做某事。文中:「毎週一か所だけそうじすることにしました」是說我決定每週只打掃一個地方。","t_en":"〜ことにする","note_en":"Expresses a decision made by oneself. Example: 「毎週一か所だけそうじすることにしました」 means I decided to clean just one place each week."},{"t":"〜によると〜そうだ","note":"引用消息來源並傳達聽來的資訊。文中:「店の人によると、おふろ用の洗剤はカビもきれいに落とせるそうです」。","t_en":"〜によると〜そうだ","note_en":"Cites a source and reports hearsay. Example: 「店の人によると、おふろ用の洗剤はカビもきれいに落とせるそうです」."},{"t":"〜というように","note":"用來舉例,表示「像這樣」。文中:「今週は台所、来週はおふろ、というように、順番を決めておきました」。","t_en":"〜というように","note_en":"Gives an example, meaning 'like this' or 'in such a way'. Example: 「今週は台所、来週はおふろ、というように」."},{"t":"〜ことになる","note":"表示結果或安排變成這樣(非完全出自個人意志)。文中:「リンさんはまどとげんかんを担当することになりました」。","t_en":"〜ことになる","note_en":"Indicates that something has been decided or arranged, often not purely by one's own will. Example: 「リンさんはまどとげんかんを担当することになりました」."},{"t":"〜ため(原因)","note":"表示原因、理由,比「ので」更書面。文中:「一度に全部やろうとすると疲れてしまうため」。","t_en":"〜ため (reason)","note_en":"Indicates a cause or reason, more formal than ので. Example: 「一度に全部やろうとすると疲れてしまうため」."}]},
{"id":"a-n5-10-n2","variant_of":"a-n5-10","level":"n2","topic":"生活","topic_en":"Everyday life","title":"レストランでの注文","title_zh":"在餐廳點餐","title_en":"Ordering at a Restaurant","body":"今日は友人と一緒にレストランへ食事をしに行ってきました。席に着いてからメニューを丁寧に見比べ、どの料理にするかじっくり考えました。外食では、メニューの情報だけで味を想像するのは難しく、選ぶのに迷うことも少なくありません。\n料理が決まったところで、店員さんを呼んで注文をすることにしました。結局、私は定食とお茶を注文することに決め、店員さんにそれを伝えました。注文を伝える場面は、学んだ日本語をそのまま使える貴重な機会でもあります。\n注文してからそれほど待たないうちに、頼んだ料理が運ばれてきて少し驚きました。味もとても良く、期待していた以上においしい食事になりました。料理の提供が早いうえに味も確かなら、客にとって満足度は自然と高くなるものです。\n食べ終えたあとは、席を立ってレジへ向かい、そこでお金を支払いました。カードも使えたので、現金を多く持ち歩かなくても済み、とても便利でした。支払い方法が多様化するに伴って、カードが使える店は旅行者や学習者にとっても心強い存在になっています。現金しか使えない店もあり、どこでもカードが使えるとは限らないので、今回は助かりました。","trans":["今天我和朋友一起去了餐廳。入座後,我仔細比較了菜單,認真思考要點哪道料理。在外用餐時,光憑菜單上的資訊很難想像味道,因此常常會猶豫該選什麼。","決定好料理後,我叫來店員點餐。最後我決定點定食和茶,並告訴了店員。這種向對方說出點餐內容的場面,也是能直接運用所學日語的寶貴機會。","點完餐後沒等多久,點的料理就送來了,讓我有點驚訝。味道也非常好,是一頓超出期待的美味餐點。上菜速度快、味道又有保證,客人的滿意度自然就會變高。","吃完之後,我離席走到收銀台,在那裡付了錢。因為也能刷卡,不必帶太多現金,非常方便。隨著付款方式日益多元,能刷卡的店對旅客和學習者來說也成了令人安心的存在。不過也有只收現金的店,不一定到處都能刷卡,所以這次真是幫了大忙。"],"trans_en":["Today I went to a restaurant with a friend. After sitting down, I compared the items on the menu carefully and thought hard about which dish to choose. When eating out, it is hard to imagine the taste from the menu information alone, so it is not unusual to have trouble deciding.","Once I had decided on a dish, I called a staff member to place my order. In the end, I chose a set meal and tea and told the staff member. A moment like placing an order is also a valuable chance to use the Japanese you have learned as it is.","Before long after ordering, the food I had asked for was brought out, which surprised me a little. The taste was also very good, and it turned out to be a meal even better than I had expected. When food is served quickly and the flavor is reliable too, customer satisfaction naturally goes up.","After finishing the meal, I got up, went to the register, and paid there. Since I could use a card too, I did not need to carry much cash, which was very convenient. As payment methods become more diverse, shops that accept cards have become a reassuring presence for travelers and learners as well. Some shops accept only cash, and cards cannot always be used everywhere, so this time it was a real help."],"vocab":[{"w":"外食","r":"がいしょく","m":"在外用餐","m_en":"eating out"},{"w":"見比べる","r":"みくらべる","m":"比較、對照著看","m_en":"to compare by looking"},{"w":"想像","r":"そうぞう","m":"想像","m_en":"imagination, to imagine"},{"w":"注文","r":"ちゅうもん","m":"點餐、訂購","m_en":"order, to order"},{"w":"貴重","r":"きちょう","m":"寶貴的","m_en":"valuable, precious"},{"w":"満足度","r":"まんぞくど","m":"滿意度","m_en":"level of satisfaction"},{"w":"支払う","r":"しはらう","m":"支付","m_en":"to pay"},{"w":"多様化","r":"たようか","m":"多元化","m_en":"diversification"},{"w":"心強い","r":"こころづよい","m":"令人安心的、有依靠的","m_en":"reassuring, encouraging"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某件事的變化,另一件事也同時變化。例:「支払い方法が多様化するに伴って、カードが使える店は旅行者や学習者にとっても心強い存在になっています」","t_en":"〜に伴って","note_en":"Means 'along with' or 'as' one change occurs, another changes too. Example: 「支払い方法が多様化するに伴って、カードが使える店は旅行者や学習者にとっても心強い存在になっています」"},{"t":"〜とは限らない","note":"表示「不一定都是…」,是對全面肯定的部分否定。例:「どこでもカードが使えるとは限らないので、今回は助かりました」","t_en":"〜とは限らない","note_en":"Means 'not necessarily' or 'not always,' partially negating a general claim. Example: 「どこでもカードが使えるとは限らないので、今回は助かりました」","id":"n2-58"},{"t":"〜うえに","note":"表示在前項之外再追加後項,多用於同方向的事物。例:「料理の提供が早いうえに味も確かなら、客にとって満足度は自然と高くなるものです」","t_en":"〜うえに","note_en":"Means 'not only … but also,' adding another point in the same direction. Example: 「料理の提供が早いうえに味も確かなら、客にとって満足度は自然と高くなるものです」"},{"t":"〜ことも少なくない","note":"用雙重否定表示「這種情況並不少見」,語氣含蓄。例:「選ぶのに迷うことも少なくありません」","t_en":"〜ことも少なくない","note_en":"A double negative meaning 'it is not uncommon that …,' with a restrained tone. Example: 「選ぶのに迷うことも少なくありません」"}]},
{"id":"a-n5-10-n3","variant_of":"a-n5-10","level":"n3","topic":"生活","topic_en":"Everyday life","title":"レストランで注文する","title_zh":"在餐廳點餐","title_en":"Ordering at a Restaurant","body":"今日は友達と一緒に、食事をするためにレストランへ行きました。席に着くと、まずメニューを見ながら、何を食べるか考えました。いろいろな料理があって迷いましたが、最後には食べたいものを選びました。\n注文する料理が決まったので、店員さんを呼んで注文することにしました。私が頼んだのは定食とお茶で、店員さんは注文を聞いて戻っていきました。待つ間は長いだろうと思っていましたが、料理は予想よりずっと早く来ました。\n料理はとてもおいしくて、特別なものを食べたわけではありませんが、大満足でした。食べ終わってから、レジへ行ってお金を払いました。カードでも払えるようになっていたので、とても便利だと感じました。\n店によって支払い方法は違うので、カードが使えるのは助かります。また友達と一緒に、このレストランに来たいと思いました。","trans":["今天我和朋友為了用餐去了餐廳。一入座,我們先一邊看菜單一邊想要吃什麼。料理種類很多讓人猶豫,但最後還是選了自己想吃的東西。","點的餐決定好了,所以我決定叫店員來點餐。我點的是定食和茶,店員聽完點餐就回去了。我原本以為等待的時間會很長,但餐點比預期的快得多就來了。","餐點非常好吃,雖然並不是吃了什麼特別的東西,但我非常滿足。吃完之後,我到收銀台付了錢。因為也可以刷卡,我覺得非常方便。","因為每家店的付款方式不同,所以能刷卡真的很有幫助。我心想,下次還想再和朋友一起來這家餐廳。"],"trans_en":["Today I went to a restaurant with a friend to have a meal. Once we sat down, we first looked at the menu and thought about what to eat. There were many dishes and it was hard to decide, but in the end I chose what I wanted to eat.","Since we had decided what to order, I decided to call a staff member and place the order. What I ordered was a set meal and tea, and the staff member took the order and went back. I had thought the wait would be long, but the food came much faster than I expected.","The food was very good, and although I hadn't eaten anything special, I was completely satisfied. After finishing, I went to the register and paid. Since I could pay by card too, I felt it was very convenient.","Payment methods differ depending on the shop, so being able to use a card is a big help. I thought I would like to come to this restaurant again with my friend."],"vocab":[{"w":"食事","r":"しょくじ","m":"用餐、餐點","m_en":"meal"},{"w":"迷う","r":"まよう","m":"猶豫、不知如何選擇","m_en":"to hesitate, to be unable to decide"},{"w":"選ぶ","r":"えらぶ","m":"選擇","m_en":"to choose"},{"w":"店員","r":"てんいん","m":"店員","m_en":"shop staff"},{"w":"注文","r":"ちゅうもん","m":"點餐、訂購","m_en":"order"},{"w":"定食","r":"ていしょく","m":"套餐、定食","m_en":"set meal"},{"w":"予想","r":"よそう","m":"預料、預期","m_en":"expectation, prediction"},{"w":"満足","r":"まんぞく","m":"滿足","m_en":"satisfaction"},{"w":"払う","r":"はらう","m":"支付","m_en":"to pay"},{"w":"支払い","r":"しはらい","m":"付款","m_en":"payment"}],"grammar":[{"t":"〜ために","note":"表示目的,意思是「為了做～」。例:「食事をするためにレストランへ行きました」。","t_en":"~ために (purpose)","note_en":"Expresses purpose, meaning 'in order to do ~'. Example: 「食事をするためにレストランへ行きました」.","id":"n3-53"},{"t":"〜ことにする","note":"表示自己決定要做某事。例:「店員さんを呼んで注文することにしました」。","t_en":"~ことにする (decide to do)","note_en":"Expresses a decision the speaker makes themselves. Example: 「店員さんを呼んで注文することにしました」."},{"t":"〜わけではない","note":"表示「並不是～」,用來部分否定或避免誤解。例:「特別なものを食べたわけではありませんが」。","t_en":"~わけではない (it's not that ~)","note_en":"Partially denies or heads off a misunderstanding, meaning 'it's not that ~'. Example: 「特別なものを食べたわけではありませんが」.","id":"n3-43"},{"t":"〜によって","note":"表示「依～而不同」,說明隨情況或對象而變化。例:「店によって支払い方法は違うので」。","t_en":"~によって (depending on)","note_en":"Means 'depending on ~', showing that something varies with the situation or person. Example: 「店によって支払い方法は違うので」."}]},
{"id":"a-n5-11-n2","variant_of":"a-n5-11","level":"n2","topic":"生活","topic_en":"Daily life","title":"初めてのICカード体験","title_zh":"第一次用 IC 卡的體驗","title_en":"My First IC Card Experience","body":"日本に来て間もない私は、駅の機械で初めてICカードを購入することにしました。機械に千円を入れて手続きを済ませると、あっけないほど簡単にカードが手に入りました。それまでは切符を買うのが当たり前だと思っていたので、この手軽さには少し驚かされました。\n電車に乗る際は、改札でカードをタッチするだけで、「ピッ」という短い音が鳴ります。切符を買う時間が不要になるに伴って、駅での移動は以前よりずっとスムーズになりました。しかも、このカードが使える場所は、電車だけとは限りません。バスやコンビニでも支払いに使えるため、日常生活の幅広い場面で役に立ちます。\nところが昨日、改札を通ろうとしたとき、「ピンポーン」という大きな音が響きました。原因は、カードに入っているお金が足りなかったことでした。突然の大きな音に対して、どうすればよいか分からず、戸惑わざるを得ませんでした。そのとき、駅員さんが「あちらの機械でチャージしてください」と親切に教えてくれました。\nこの経験から、カードは買えば終わりではなく、残高の管理も大切だと痛感しました。そこで今は、駅に入る前に必ずカードの残高を確認するようにしています。小さな習慣ではありますが、これだけで慌てずに電車に乗れるようになりました。","trans":["來日本沒多久的我,決定在車站的機器上買人生第一張 IC 卡。我把一千日圓投進機器、辦完手續後,卡片簡單得令人意外就拿到手了。我原本一直覺得買車票是理所當然的事,所以對這種方便程度有點驚訝。","搭電車時,只要在剪票口感應卡片,就會發出「嗶」的一聲短音。隨著不再需要花時間買車票,在車站的移動比以前順暢多了。而且,這張卡能用的地方不一定只限於電車。公車和便利商店也能拿來付款,在日常生活的許多場合都派得上用場。","然而昨天,我正要通過剪票口時,響起了「叮咚」的巨大聲響。原因是卡片裡的錢不夠。面對突如其來的大聲響,我不知所措,只能感到慌張。這時,站務員親切地告訴我「請到那邊的機器加值」。","經過這次經驗,我深刻體會到卡片不是買了就結束,餘額的管理也很重要。所以現在我進車站之前,一定會先確認卡片的餘額。雖然只是個小習慣,但光是這樣就讓我能不慌不忙地搭電車了。"],"trans_en":["Having only recently arrived in Japan, I decided to buy an IC card for the first time at a station machine. After putting in 1,000 yen and finishing the procedure, I got the card with surprising ease. I had assumed buying a ticket was the norm, so I was a little amazed at how simple this was.","When riding a train, you just tap the card at the ticket gate and it makes a short \"beep\". As the need to spend time buying tickets disappeared, getting around stations became much smoother than before. What's more, the places where you can use this card are not limited to trains. You can also pay with it on buses and at convenience stores, so it is useful in many everyday situations.","Yesterday, however, as I tried to pass through the gate, a loud \"ding-dong\" sounded. The cause was that there wasn't enough money on the card. Faced with the sudden loud noise, I couldn't help but feel flustered, not knowing what to do. Then a station attendant kindly told me to top up at the machine over there.","From this experience I realized that buying the card isn't the end of it, and managing the balance matters too. So now I always check the card's balance before entering a station. It's a small habit, but it alone lets me ride trains without panicking."],"vocab":[{"w":"購入","r":"こうにゅう","m":"購買","m_en":"purchase"},{"w":"改札","r":"かいさつ","m":"剪票口","m_en":"ticket gate"},{"w":"不要","r":"ふよう","m":"不需要","m_en":"unnecessary"},{"w":"支払い","r":"しはらい","m":"付款","m_en":"payment"},{"w":"響く","r":"ひびく","m":"響起、迴盪","m_en":"to resound"},{"w":"残高","r":"ざんだか","m":"餘額","m_en":"balance (of an account)"},{"w":"戸惑う","r":"とまどう","m":"不知所措、困惑","m_en":"to be bewildered"},{"w":"痛感","r":"つうかん","m":"深切體會","m_en":"to keenly realize"},{"w":"習慣","r":"しゅうかん","m":"習慣","m_en":"habit"},{"w":"駅員","r":"えきいん","m":"站務員","m_en":"station attendant"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某件事的變化,另一件事也跟著變化。例:「切符を買う時間が不要になるに伴って、駅での移動は以前よりずっとスムーズになりました」","t_en":"〜に伴って","note_en":"As one thing changes, another changes along with it. Example: 「切符を買う時間が不要になるに伴って、駅での移動は以前よりずっとスムーズになりました」"},{"w":"","t":"〜とは限らない","note":"表示「不一定」,否定過於絕對的想法。例:「このカードが使える場所は、電車だけとは限りません」","t_en":"〜とは限らない","note_en":"Not necessarily; denies an overly absolute assumption. Example: 「このカードが使える場所は、電車だけとは限りません」","id":"n2-58"},{"t":"〜に対して","note":"表示針對某個對象或情況做出反應。例:「突然の大きな音に対して、どうすればよいか分からず、戸惑わざるを得ませんでした」","t_en":"〜に対して","note_en":"Toward / in response to a target or situation. Example: 「突然の大きな音に対して、どうすればよいか分からず、戸惑わざるを得ませんでした」","id":"n3-2"},{"t":"〜ざるを得ない","note":"表示「不得不、只能」,帶有無可奈何的語氣。例:「戸惑わざるを得ませんでした」","t_en":"〜ざるを得ない","note_en":"Cannot help but; have no choice but to. Example: 「戸惑わざるを得ませんでした」","id":"n2-35"}]},
{"id":"a-n5-11-n3","variant_of":"a-n5-11","level":"n3","topic":"生活","topic_en":"Daily life","title":"はじめてのICカード","title_zh":"第一次用 IC 卡","title_en":"My First IC Card","body":"日本に来てすぐ、駅の機械で初めてICカードを買いました。機械にお金を千円入れると、カードを受け取ることができて、思ったより簡単だったので安心しました。\n電車に乗るときは、改札でカードをタッチするだけで通れます。そのとき「ピッ」という短い音が鳴るので、ちゃんと使えたことがすぐにわかります。\nICカードがあれば、切符を買う時間がかからないため、とても便利です。電車だけでなく、バスやコンビニでも使えるので、毎日の生活で役に立っています。\nところが昨日、改札で「ピンポーン」という大きな音が鳴ってしまいました。カードのお金が足りなかったことが原因でした。\n困っていると、駅員さんが「あちらの機械でチャージしてください」と教えてくれました。そのおかげで、無事に改札を通ることができました。\nこの経験によって、使う前に残りのお金を確認することが大切だと学びました。今は駅に入る前に、必ずカードのお金を見ることにしています。","trans":["來日本沒多久,我就在車站的機器第一次買了 IC 卡。在機器裡投入一千日圓後就能拿到卡片,比想像中簡單,讓我安心了不少。","搭電車的時候,只要在剪票口感應卡片就能通過。這時會發出「嗶」的短促聲響,所以馬上就能知道有成功使用。","有了 IC 卡,就不用花時間買車票,非常方便。不只電車,公車和便利商店也能使用,對每天的生活很有幫助。","然而昨天,在剪票口響起了「叮咚」的大聲響。原因是卡片裡的錢不夠了。","正當我不知所措時,站務員告訴我:「請到那邊的機器加值。」多虧如此,我才順利通過了剪票口。","這次的經驗讓我學到,使用前確認剩餘金額很重要。現在我決定進車站之前,一定要先看一下卡片裡的錢。"],"trans_en":["Soon after coming to Japan, I bought an IC card for the first time at a station machine. After putting 1,000 yen into the machine I could get the card, and it was easier than I expected, so I felt relieved.","When riding the train, you can get through just by tapping the card at the ticket gate. A short \"beep\" sounds then, so you immediately know it worked properly.","With an IC card you don't need time to buy tickets, so it is very convenient. You can use it not only on trains but also on buses and at convenience stores, so it helps in my daily life.","However, yesterday a loud \"ding-dong\" sounded at the ticket gate. The cause was that there wasn't enough money on my card.","While I was at a loss, a station staff member told me, \"Please charge it at that machine over there.\" Thanks to that, I was able to get through the gate safely.","Through this experience, I learned that it is important to check the remaining balance before using the card. Now I have decided to always check the money on my card before entering a station."],"vocab":[{"w":"改札","r":"かいさつ","m":"剪票口","m_en":"ticket gate"},{"w":"機械","r":"きかい","m":"機器","m_en":"machine"},{"w":"安心","r":"あんしん","m":"安心、放心","m_en":"relief, peace of mind"},{"w":"切符","r":"きっぷ","m":"車票","m_en":"ticket"},{"w":"便利","r":"べんり","m":"方便","m_en":"convenient"},{"w":"役に立つ","r":"やくにたつ","m":"有幫助、派上用場","m_en":"to be useful"},{"w":"足りる","r":"たりる","m":"足夠","m_en":"to be enough"},{"w":"原因","r":"げんいん","m":"原因","m_en":"cause"},{"w":"チャージ","r":"チャージ","m":"儲值、加值","m_en":"to top up, charge"},{"w":"確認","r":"かくにん","m":"確認","m_en":"to check, confirm"}],"grammar":[{"t":"〜ため(原因・理由)","note":"表示原因或理由,語氣比「から」更書面。例:「切符を買う時間がかからないため、とても便利です」","t_en":"〜ため (reason)","note_en":"Expresses a cause or reason in a more formal tone than から. Example: 「切符を買う時間がかからないため、とても便利です」"},{"t":"〜によって","note":"表示原因、手段,「藉由、因為」。例:「この経験によって、使う前に残りのお金を確認することが大切だと学びました」","t_en":"〜によって","note_en":"Indicates cause or means: 'through, because of'. Example: 「この経験によって、使う前に残りのお金を確認することが大切だと学びました」"},{"t":"〜ことにする","note":"表示自己決定做某事。例:「必ずカードのお金を見ることにしています」","t_en":"〜ことにする","note_en":"Expresses a decision made by oneself. Example: 「必ずカードのお金を見ることにしています」"},{"t":"〜だけでなく","note":"表示「不只…也…」。例:「電車だけでなく、バスやコンビニでも使えます」","t_en":"〜だけでなく","note_en":"Means 'not only … but also …'. Example: 「電車だけでなく、バスやコンビニでも使えます」"}]},
{"id":"a-n5-12-n2","variant_of":"a-n5-12","level":"n2","topic":"生活","topic_en":"Daily life","title":"コンビニのおでん","title_zh":"便利商店的關東煮","title_en":"Oden at the Convenience Store","body":"冬の夜、外の寒さに誘われるようにして、私はコンビニに入った。レジの横にはおでんが並んでおり、店内に入った途端、おいしそうな匂いが漂ってきた。いい匂いに加えて空腹も感じ、おでんを買わざるを得ない気持ちになった。\n気温が下がるのに伴って、コンビニの店頭にはおでんが並ぶようになる。私は店員に声をかけて、大根と卵を入れてもらうようお願いした。すると店員は、つゆとからしが必要かどうかを丁寧に尋ねてくれた。店員の質問に対して、私はつゆだけお願いしますと答えた。\n会計を済ませると、私はどこにも寄らず、まっすぐ家に帰った。家に着くと、冷めてしまう前にと思い、すぐに食べ始めた。熱いおでんを口に運ぶと、冷えきっていた体が内側からゆっくりと温まっていった。つゆがよくしみた大根は、寒い夜には格別のおいしさに感じられた。\n手軽に温かいものが食べられるという点で、コンビニのおでんは冬の強い味方だと言える。高価な料理だけが満足感を与えるとは限らず、こうした身近な食べ物に救われることもある。寒い季節になると、またあのおでんが食べたくなりそうだ。","trans":["冬天的夜晚,我彷彿被外面的寒意牽引著,走進了便利商店。收銀台旁邊擺著關東煮,一進店裡就飄來了令人垂涎的香味。除了好聞的味道,又覺得肚子餓,不由得非買關東煮不可。","隨著氣溫下降,便利商店的店頭就會開始擺出關東煮。我向店員搭話,請他幫我放進白蘿蔔和蛋。接著店員很有禮貌地問我需不需要湯和黃芥末。針對店員的詢問,我回答只要湯就好。","結完帳後,我哪裡也沒去,直接回家。到家以後,想著不趁熱會涼掉,馬上就開始吃了。把熱呼呼的關東煮送進嘴裡,原本凍僵的身體從內部慢慢暖了起來。吸飽湯汁的白蘿蔔,在寒冷的夜裡吃起來格外美味。","就能輕鬆吃到熱食這一點來說,可以說便利商店的關東煮是冬天的強力夥伴。讓人滿足的不一定只有昂貴的料理,有時也會被這類身邊的食物所療癒。到了寒冷的季節,感覺又會想吃那樣的關東煮了。"],"trans_en":["On a winter night, as if drawn in by the cold outside, I went into a convenience store. Oden was lined up next to the register, and the moment I stepped inside, an appetizing smell drifted over. Between the good smell and my hunger, I felt I had no choice but to buy some oden.","As temperatures drop, oden begins to appear at the front of convenience stores. I called out to the clerk and asked them to put in daikon and an egg. The clerk then politely asked whether I wanted broth and mustard. In response to the question, I answered that I only wanted the broth.","After paying, I went straight home without stopping anywhere. Once I got home, I started eating right away, thinking it would get cold otherwise. When I put the hot oden in my mouth, my chilled body slowly warmed from the inside. The daikon, well soaked with broth, tasted exceptionally good on a cold night.","In that you can easily get something warm to eat, convenience store oden can be called a strong ally in winter. Satisfaction does not necessarily come only from expensive dishes, and sometimes we are saved by familiar foods like this. When the cold season comes, I suspect I will crave that oden again."],"vocab":[{"w":"漂う","r":"ただよう","m":"飄散、瀰漫","m_en":"to drift, to waft"},{"w":"空腹","r":"くうふく","m":"空腹、肚子餓","m_en":"hunger, empty stomach"},{"w":"気温","r":"きおん","m":"氣溫","m_en":"air temperature"},{"w":"店頭","r":"てんとう","m":"店面、店門口","m_en":"storefront, shop front"},{"w":"尋ねる","r":"たずねる","m":"詢問","m_en":"to ask, to inquire"},{"w":"丁寧","r":"ていねい","m":"有禮貌、仔細","m_en":"polite, careful"},{"w":"済ませる","r":"すませる","m":"完成、辦完","m_en":"to finish, to get done"},{"w":"冷める","r":"さめる","m":"變涼、冷掉","m_en":"to cool down"},{"w":"格別","r":"かくべつ","m":"格外、特別","m_en":"exceptional, especially"},{"w":"身近","r":"みぢか","m":"身邊的、貼近生活的","m_en":"familiar, close to one's daily life"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某個變化,另一個變化也同時進行。例:「気温が下がるのに伴って、コンビニの店頭にはおでんが並ぶようになる」","t_en":"〜に伴って","note_en":"Expresses that one change accompanies another. Example: 「気温が下がるのに伴って、コンビニの店頭にはおでんが並ぶようになる」 (As temperatures drop, oden begins to appear at convenience stores.)"},{"t":"〜ざるを得ない","note":"表示「不得不、只能~」,是在情況所迫下的無奈選擇。例:「おでんを買わざるを得ない気持ちになった」","t_en":"〜ざるを得ない","note_en":"Means 'have no choice but to ~', a choice forced by circumstances. Example: 「おでんを買わざるを得ない気持ちになった」 (I felt I had no choice but to buy oden.)","id":"n2-35"},{"t":"〜に対して","note":"表示動作或態度所針對的對象,常譯為「對於、針對」。例:「店員の質問に対して、私はつゆだけお願いしますと答えた」","t_en":"〜に対して","note_en":"Indicates the target of an action or attitude: 'toward, in response to'. Example: 「店員の質問に対して、私はつゆだけお願いしますと答えた」 (In response to the clerk's question, I answered that I only wanted the broth.)","id":"n3-2"},{"t":"〜とは限らない","note":"表示「不一定~」,用來否定過於絕對的說法。例:「高価な料理だけが満足感を与えるとは限らず」","t_en":"〜とは限らない","note_en":"Means 'not necessarily ~', used to deny an overly absolute claim. Example: 「高価な料理だけが満足感を与えるとは限らず」 (Satisfaction does not necessarily come only from expensive dishes.)","id":"n2-58"}]},
{"id":"a-n5-12-n3","variant_of":"a-n5-12","level":"n3","topic":"生活","topic_en":"Daily life","title":"コンビニのおでん","title_zh":"便利商店的關東煮","title_en":"Oden at the Convenience Store","body":"とても寒い冬の夜、わたしは温かいものが食べたくなって、コンビニに入りました。レジのよこにおでんが置いてあるのに気づきました。いいにおいがしてきて、急におなかがすいてしまいました。\nおでんを見ていると、どれもおいしそうで迷いましたが、だいこんとたまごを選ぶことにしました。「だいこんとたまごをください」と店員さんに頼みました。すると店員さんは、つゆとからしが必要かどうかを聞いてくれました。わたしは少し考えてから、「つゆだけお願いします」と答えました。\n家に帰ると、冷めないうちにすぐ食べることにしました。熱いおでんを食べているうちに、冷えていた体がだんだん温かくなってきました。寒い夜には、こんなふうに簡単に買える温かい食べ物がありがたいと感じました。","trans":["在很冷的冬天夜晚,我很想吃點熱的東西,就走進了便利商店。我注意到收銀台旁邊擺著關東煮。聞到很香的味道,肚子一下子就餓了。","看著關東煮,每一樣都很好吃的樣子,讓我很猶豫,不過最後決定選白蘿蔔和蛋。我對店員說:「請給我白蘿蔔和蛋。」接著店員問我需不需要湯和黃芥末。我想了一下,回答:「只要湯就好,麻煩你了。」","回到家後,我決定趁還沒涼掉馬上吃。吃著熱騰騰的關東煮,原本冰冷的身體漸漸暖了起來。我覺得在寒冷的夜晚,能這樣輕鬆買到熱食真是令人感激。"],"trans_en":["On a very cold winter night, I wanted something warm to eat, so I went into a convenience store. I noticed that oden was set out next to the register. A good smell drifted over, and I suddenly felt hungry.","Looking at the oden, everything seemed delicious and I couldn't decide, but in the end I chose daikon and egg. I asked the clerk for daikon and egg. The clerk then asked whether I needed broth and mustard. After thinking for a moment, I answered, \"Just the broth, please.\"","When I got home, I decided to eat it right away while it was still hot. As I ate the hot oden, my chilled body gradually warmed up. On a cold night like that, I felt grateful for warm food that is so easy to buy."],"vocab":[{"w":"気づく","r":"きづく","m":"注意到、發現","m_en":"to notice"},{"w":"急に","r":"きゅうに","m":"突然、一下子","m_en":"suddenly"},{"w":"迷う","r":"まよう","m":"猶豫、迷惘","m_en":"to hesitate, to be undecided"},{"w":"選ぶ","r":"えらぶ","m":"選擇","m_en":"to choose"},{"w":"店員","r":"てんいん","m":"店員","m_en":"shop clerk"},{"w":"必要","r":"ひつよう","m":"需要、必要","m_en":"necessary, needed"},{"w":"冷める","r":"さめる","m":"變涼、冷掉","m_en":"to cool down"},{"w":"冷える","r":"ひえる","m":"變冷、著涼","m_en":"to get cold"},{"w":"だんだん","r":"だんだん","m":"漸漸地","m_en":"gradually"},{"w":"ありがたい","r":"ありがたい","m":"令人感激的、難得的","m_en":"grateful, welcome"}],"grammar":[{"t":"〜ことにする","note":"表示自己決定做某事。文中:「コンビニに入りました」的決定、「だいこんとたまごを選ぶことにしました」「すぐ食べることにしました」。","t_en":"〜ことにする","note_en":"Expresses a decision made by the speaker. Example: 「だいこんとたまごを選ぶことにしました」 (I decided to choose daikon and egg)."},{"t":"〜うちに","note":"表示趁著某狀態還持續時做某事,或在某動作進行當中發生變化。文中:「冷めないうちにすぐ食べる」「食べているうちに、冷えていた体がだんだん温かくなってきました」。","t_en":"〜うちに","note_en":"Means 'while (a state continues)' or 'in the course of doing something'. Example: 「熱いおでんを食べているうちに、冷えていた体がだんだん温かくなってきました」.","id":"n3-13"},{"t":"〜かどうか","note":"表示「是否……」,把是非問句嵌入句中。文中:「つゆとからしが必要かどうかを聞いてくれました」。","t_en":"〜かどうか","note_en":"Means 'whether or not', embedding a yes/no question in a sentence. Example: 「つゆとからしが必要かどうかを聞いてくれました」."},{"t":"〜てくる","note":"表示變化或狀態逐漸出現、朝說話者靠近。文中:「いいにおいがしてきて」「だんだん温かくなってきました」。","t_en":"〜てくる","note_en":"Indicates a change or sensation that begins or develops toward the speaker. Example: 「だんだん温かくなってきました」 (gradually became warm)."}]},
{"id":"a-n5-13-n2","variant_of":"a-n5-13","level":"n2","topic":"生活","topic_en":"Daily life","title":"冬の買い物","title_zh":"冬天的購物","title_en":"Winter Shopping","body":"最近は朝晩の冷え込みが厳しくなり、本格的な冬の訪れを肌で感じるようになってきた。気温が下がるに伴って、そろそろ新しい防寒着が必要だと考えるようになった。そこで土曜日、友人と一緒に買い物をするために、ある店まで出かけることにした。\n私は黒いコートが欲しかったので、最初から黒一色のものを探すつもりでいた。ところが友人は、赤いコートも似合うのではないかと言って、別の選択肢を勧めてくれた。確かに黒だけが正解とは限らないと思い、気になった赤いコートを手に取ってみた。店員に「着てもいいですか」と尋ねたうえで、実際に袖を通してみることにした。\n実際に着てみると、赤いコートは想像していた以上に美しく、思わず見とれてしまった。結局、黒ではなく、その赤いコートを購入することに決めた。加えて、手袋とマフラーも一緒に買い、防寒の準備を一通り整えることができた。選んだ三つの品はどれも私の好きな色で、色合いの統一感も気に入っている。\n買い物の前は「黒でなければならない」と考えていたが、友人の一言のおかげで視野が広がった。自分の好みに固執せず、他人の意見に耳を傾けることで、新しい発見が生まれることもある。寒さの厳しい季節だからこそ、気に入った服を身につけて、前向きな気持ちで冬を過ごしたいと思う。","trans":["最近早晚的寒意越來越強,讓人切身感受到冬天真正來臨了。隨著氣溫下降,我開始覺得差不多需要添購新的禦寒衣物。於是在星期六,我決定和朋友一起去一家店購物。","我本來想要黑色的外套,所以打算一開始就只找全黑的款式。沒想到朋友說紅色外套說不定也很適合我,向我推薦了另一個選擇。我心想黑色確實不一定是唯一正解,便拿起了在意的紅色外套。我先問店員「可以穿穿看嗎」,接著實際穿上試試。","實際穿上後,紅色外套比想像中更漂亮,我不禁看得入迷。最後,我決定不買黑色,而是買下那件紅色外套。此外,我還一起買了手套和圍巾,把禦寒的準備大致備齊了。我選的這三樣東西都是我喜歡的顏色,整體的配色也讓我很滿意。","購物前我一直認為「非黑色不可」,但多虧朋友的一句話,讓我的視野變寬了。不固執於自己的喜好,願意傾聽他人的意見,有時就會產生新的發現。正因為是寒冷的季節,我想穿上自己喜歡的衣服,以積極的心情度過這個冬天。"],"trans_en":["Recently the chilly mornings and evenings have become harsh, and I can feel winter truly arriving. As the temperature drops, I began to think I would soon need new cold-weather clothing. So on Saturday, I decided to go to a store with a friend to shop.","I wanted a black coat, so I had planned to look only for all-black ones from the start. But my friend suggested another option, saying a red coat might suit me too. Thinking black isn't necessarily the only right answer, I picked up the red coat that caught my eye. I asked the clerk, \"May I try it on?\", and then actually put it on.","Once I tried it on, the red coat was more beautiful than I had imagined, and I couldn't help gazing at it. In the end, I decided to buy that red coat instead of a black one. In addition, I bought gloves and a scarf as well, and managed to get my winter preparations more or less in order. All three items I chose are in colors I like, and I'm pleased with how well they go together.","Before shopping, I had thought it had to be black, but my friend's remark broadened my perspective. By not clinging to my own preferences and listening to others' opinions, new discoveries can sometimes arise. Precisely because it is a harsh, cold season, I want to wear clothes I like and spend the winter in a positive frame of mind."],"vocab":[{"w":"冷え込み","r":"ひえこみ","m":"(氣溫)驟降、寒意加劇","m_en":"sharp drop in temperature, chill"},{"w":"防寒着","r":"ぼうかんぎ","m":"禦寒衣物","m_en":"cold-weather clothing"},{"w":"似合う","r":"にあう","m":"適合、相稱","m_en":"to suit, to look good on"},{"w":"勧める","r":"すすめる","m":"推薦、勸(人採用)","m_en":"to recommend, to suggest"},{"w":"袖を通す","r":"そでをとおす","m":"穿上(衣服)","m_en":"to put on (clothes)"},{"w":"見とれる","r":"みとれる","m":"看得入迷","m_en":"to be captivated, to gaze in admiration"},{"w":"一通り","r":"ひととおり","m":"大致、基本上全部","m_en":"more or less, generally, a full set"},{"w":"固執する","r":"こしつする","m":"固執、堅持己見","m_en":"to cling to, to insist on"},{"w":"視野","r":"しや","m":"視野、眼界","m_en":"field of view, perspective"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某個變化,另一個變化也同時發生。例:「気温が下がるに伴って、そろそろ新しい防寒着が必要だと考えるようになった」","t_en":"〜に伴って","note_en":"Means 'along with' or 'as' one change occurs, another changes too. Example: 「気温が下がるに伴って、そろそろ新しい防寒着が必要だと考えるようになった」"},{"t":"〜とは限らない","note":"表示「未必」「不一定總是」,用來否定過於絕對的想法。例:「確かに黒だけが正解とは限らないと思い」","t_en":"〜とは限らない","note_en":"Means 'not necessarily'; it denies an overly absolute assumption. Example: 「確かに黒だけが正解とは限らないと思い」","id":"n2-58"},{"t":"〜ず(に)","note":"「ない」的書面語否定形式,相當於「〜ないで」。する要變成「せず」。例:「自分の好みに固執せず」","t_en":"〜ず(に)","note_en":"A formal negative form equivalent to 〜ないで; する becomes せず. Example: 「自分の好みに固執せず」"},{"t":"〜からこそ","note":"強調「正因為這個理由」,帶有強烈的主張語氣。例:「寒さの厳しい季節だからこそ」","t_en":"〜からこそ","note_en":"Emphasizes 'precisely because of this reason', with a strong assertive tone. Example: 「寒さの厳しい季節だからこそ」","id":"n2-9"}]},
{"id":"a-n5-13-n3","variant_of":"a-n5-13","level":"n3","topic":"生活","topic_en":"Daily life","title":"冬の買い物","title_zh":"冬天的購物","title_en":"Winter Shopping","body":"最近は急に寒くなってきたため、冬の服を新しく買おうと思いました。土曜日、友だちと一緒に店へ買い物に行くことにしました。私は前から黒いコートがほしかったので、それを探すつもりでした。\nところが、友だちが「赤いのもいいよ」と言ったので、少し迷ってしまいました。黒い色にこだわっていたわけではないので、店の人に聞いてみることにしました。「着てみてもいいですか」と聞くと、店の人は快く試着させてくれました。\n着てみると、赤いコートは思っていたよりずっときれいでした。結局、そのコートのほかに、手袋とマフラーも買いました。どれも私の好きな色なので、組み合わせて使うのが楽しみです。寒い冬でも、これなら気持ちよく出かけられそうです。","trans":["最近突然變冷了,所以我想買些新的冬季衣物。星期六,我決定和朋友一起去店裡逛街。我本來就一直想要黑色的外套,打算找找看。","不過,朋友說「紅色的也不錯喔」,讓我有點猶豫。我並不是非黑色不可,所以決定問問店員。我問「可以穿穿看嗎」,店員爽快地讓我試穿了。","穿上去之後,紅色的外套比我想像的還要漂亮。最後,除了那件外套,我還買了手套和圍巾。每一件都是我喜歡的顏色,所以我很期待搭配著使用。這樣一來,即使是寒冷的冬天,我也能舒服地出門了。"],"trans_en":["It has suddenly gotten cold lately, so I thought I would buy some new winter clothes. On Saturday, I decided to go shopping at a store with a friend. I had wanted a black coat for a while, so I planned to look for one.","However, my friend said, \"Red looks good too,\" and I got a little torn. I wasn't set on black, so I decided to ask the shop staff. When I asked, \"May I try it on?\" the staff kindly let me try it on.","When I put it on, the red coat was much prettier than I had expected. In the end, I bought gloves and a scarf in addition to the coat. They are all my favorite colors, so I'm looking forward to wearing them together. With these, it seems I'll be able to go out comfortably even in the cold winter."],"vocab":[{"w":"急に","r":"きゅうに","m":"突然、忽然","m_en":"suddenly"},{"w":"探す","r":"さがす","m":"尋找","m_en":"to look for"},{"w":"迷う","r":"まよう","m":"猶豫、迷惑","m_en":"to hesitate, to be torn"},{"w":"こだわる","r":"こだわる","m":"講究、執著於","m_en":"to be particular about"},{"w":"試着","r":"しちゃく","m":"試穿","m_en":"trying on clothes"},{"w":"快く","r":"こころよく","m":"爽快地、欣然地","m_en":"willingly, kindly"},{"w":"結局","r":"けっきょく","m":"最後、結果","m_en":"in the end"},{"w":"手袋","r":"てぶくろ","m":"手套","m_en":"gloves"},{"w":"組み合わせる","r":"くみあわせる","m":"搭配、組合","m_en":"to combine, to match"},{"w":"楽しみ","r":"たのしみ","m":"期待、樂趣","m_en":"something to look forward to"}],"grammar":[{"t":"〜ため(に)","note":"表示原因、理由,語氣比「から」更書面。例:「最近は急に寒くなってきたため」","t_en":"~ため(に)","note_en":"Expresses a reason or cause, more formal than から. Example: 「最近は急に寒くなってきたため」"},{"t":"〜ことにする","note":"表示說話者自己決定做某事。例:「友だちと一緒に店へ買い物に行くことにしました」","t_en":"~ことにする","note_en":"Expresses the speaker's own decision to do something. Example: 「友だちと一緒に店へ買い物に行くことにしました」"},{"t":"〜わけではない","note":"表示並不是那樣的意思,部分否定。例:「黒い色にこだわっていたわけではないので」","t_en":"~わけではない","note_en":"Means 'it's not that...', a partial negation. Example: 「黒い色にこだわっていたわけではないので」","id":"n3-43"},{"t":"〜そうだ(樣態)","note":"接在動詞ます形或形容詞語幹後,表示根據外觀或情況的推測。例:「これなら気持ちよく出かけられそうです」","t_en":"~そうだ (appearance)","note_en":"Attached to a verb stem or adjective stem to express a judgment based on how things look. Example: 「これなら気持ちよく出かけられそうです」"}]},
{"id":"a-n5-14-n2","variant_of":"a-n5-14","level":"n2","topic":"生活","topic_en":"Daily life","title":"友達と鍋を囲む冬の夜","title_zh":"和朋友圍著火鍋的冬夜","title_en":"A Winter Night Around the Hot Pot with Friends","body":"冬の寒さが厳しくなってきたある日、私は友達と一緒に家で鍋を囲むことにした。鍋料理は準備が比較的簡単なので、集まって食事をしたいときにはちょうどいいと思う。まず、材料をそろえるために、みんなでスーパーへ出かけた。\n店では、あれこれ相談しながら、白菜と豆腐と肉を買うことにした。冬の鍋には白菜が欠かせないという人も多いが、私もその一人だ。買い物をするだけでも、友達と一緒だと、普段より楽しく感じられるものだ。\n家に帰ると、さっそく野菜を切って、鍋に入れる準備に取りかかった。野菜を先に入れて、肉はあとから加えるという順番で作った。肉は火が通りやすいので、先に入れすぎると硬くなってしまうこともある。鍋が煮えるに伴って、部屋の中もだんだん暖かくなっていった。\n外は寒い夜だったにもかかわらず、部屋の中は温かい湯気に包まれていた。みんなで同じ鍋をつつきながら食べると、料理の味は一段とおいしく感じられる。おいしい料理が食卓にあるからといって、必ず楽しい時間になるとは限らない。気の置けない友達と一緒に過ごせたからこそ、寒い夜でも心から楽しかったのだと思う。","trans":["在天氣越來越冷的某一天,我決定和朋友一起在家圍著鍋子吃火鍋。火鍋的準備工作相對簡單,我覺得很適合想聚在一起吃飯的時候。首先,為了備齊食材,大家一起去了超市。","在店裡,我們一邊討論一邊決定買白菜、豆腐和肉。很多人認為冬天的火鍋少不了白菜,我也是其中之一。光是買東西,只要有朋友在身邊,就會比平常更有樂趣。","回到家後,我們立刻開始切菜,準備放進鍋裡。我們依照先放蔬菜、之後再加肉的順序來煮。肉很容易熟,如果太早放,有時反而會變硬。隨著鍋子煮開,房間裡也漸漸暖和起來。","儘管外面是寒冷的夜晚,屋裡卻被溫暖的蒸氣包圍著。大家圍著同一個鍋子邊夾邊吃,料理吃起來格外美味。不過,桌上有好吃的料理,並不一定就會是愉快的時光。正因為是和無須客套的朋友一起度過,即使是寒冷的夜晚,我也打從心底覺得開心。"],"trans_en":["On one day when the winter cold had grown harsh, I decided to have hot pot at home with my friends. Hot pot is relatively easy to prepare, so I think it suits times when you want to get together and share a meal. First, we all went to the supermarket to gather the ingredients.","At the store, we talked it over and decided to buy napa cabbage, tofu, and meat. Many people say winter hot pot is not complete without napa cabbage, and I am one of them. Even just shopping feels more fun than usual when you are with friends.","When we got home, we immediately started cutting the vegetables and getting them ready for the pot. We cooked in this order: vegetables first, and meat added later. Meat cooks easily, so if you put it in too early it can end up tough. As the pot came to a simmer, the room gradually grew warmer too.","Even though it was a cold night outside, the room was wrapped in warm steam. Eating while picking from the same pot together makes the food taste all the better. Still, good food on the table does not always guarantee a happy time. I think it was precisely because I was with close friends that I truly enjoyed myself, even on a cold night."],"vocab":[{"w":"囲む","r":"かこむ","m":"圍著、圍繞","m_en":"to surround; to gather around"},{"w":"比較的","r":"ひかくてき","m":"相對地、比較起來","m_en":"relatively"},{"w":"材料","r":"ざいりょう","m":"材料、食材","m_en":"ingredients; materials"},{"w":"欠かせない","r":"かかせない","m":"不可或缺的","m_en":"indispensable"},{"w":"取りかかる","r":"とりかかる","m":"開始著手","m_en":"to begin; to get started on"},{"w":"加える","r":"くわえる","m":"加入、添加","m_en":"to add"},{"w":"煮える","r":"にえる","m":"煮熟、煮開","m_en":"to be cooked; to simmer"},{"w":"湯気","r":"ゆげ","m":"蒸氣、熱氣","m_en":"steam"},{"w":"気の置けない","r":"きのおけない","m":"無須客套的、親近的","m_en":"close and easy to be with; unreserved"}],"grammar":[{"t":"〜に伴って","note":"表示隨著某個變化,另一個變化也同時進行。文中例句:「鍋が煮えるに伴って、部屋の中もだんだん暖かくなっていった」","t_en":"〜に伴って","note_en":"Means 'as / along with'; one change accompanies another. Example: 「鍋が煮えるに伴って、部屋の中もだんだん暖かくなっていった」"},{"t":"〜にもかかわらず","note":"表示「儘管……卻……」,前後內容出現預期之外的對比。文中例句:「外は寒い夜だったにもかかわらず、部屋の中は温かい湯気に包まれていた」","t_en":"〜にもかかわらず","note_en":"Means 'in spite of / even though'; the result contrasts with expectation. Example: 「外は寒い夜だったにもかかわらず、部屋の中は温かい湯気に包まれていた」","id":"n2-10"},{"t":"〜とは限らない","note":"表示「不一定……」,用來否定過於絕對的想法。文中例句:「おいしい料理が食卓にあるからといって、必ず楽しい時間になるとは限らない」","t_en":"〜とは限らない","note_en":"Means 'not necessarily'; it denies an overly absolute assumption. Example: 「おいしい料理が食卓にあるからといって、必ず楽しい時間になるとは限らない」","id":"n2-58"},{"t":"〜からこそ","note":"強調「正因為……才……」,point 出真正的理由。文中例句:「気の置けない友達と一緒に過ごせたからこそ、寒い夜でも心から楽しかったのだと思う」","t_en":"〜からこそ","note_en":"Emphasizes 'precisely because'; it highlights the true reason. Example: 「気の置けない友達と一緒に過ごせたからこそ、寒い夜でも心から楽しかったのだと思う」","id":"n2-9"}]},
{"id":"a-n5-14-n3","variant_of":"a-n5-14","level":"n3","topic":"生活","topic_en":"Daily life","title":"友達と囲む冬の鍋","title_zh":"和朋友一起圍著吃的冬天火鍋","title_en":"Hot Pot with Friends in Winter","body":"寒さが厳しくなってきた冬のある日、友達と私の家で鍋をすることにしました。準備のために、まずみんなで一緒にスーパーへ買い物に行きました。買ったのは白菜と豆腐と肉で、鍋にはぴったりの材料だと思いました。\n家に着くと、さっそく野菜を切って、順番に鍋に入れていきました。野菜は火が通りにくいため、先に入れて、肉は後から入れるようにしました。鍋が煮えてくるにつれて、部屋の中がだんだん暖かくなりました。湯気のおかげで、外の寒さを忘れてしまうほどでした。\nみんなで一緒に食べると、一人で食べるときよりもずっとおいしく感じます。外は寒い夜でしたが、楽しい時間を過ごすことができました。鍋は料理であるだけでなく、人と人を近づけてくれるものだと思います。","trans":["天氣變得越來越冷的冬天某一天,我決定和朋友在我家吃火鍋。為了準備,首先大家一起去超市買東西。我們買的是白菜、豆腐和肉,我覺得這些很適合拿來煮火鍋。","一到家,我們馬上把蔬菜切好,依序放進鍋裡。因為蔬菜不容易熟,所以先放蔬菜,肉則是後面才放。隨著鍋子煮開,房間裡漸漸變得暖和。多虧了熱氣,暖到讓人忘記了外面的寒冷。","大家一起吃,會覺得比一個人吃的時候好吃得多。雖然外面是寒冷的夜晚,我們還是度過了開心的時光。我覺得火鍋不只是一道料理,也是能讓人與人之間更親近的東西。"],"trans_en":["On a winter day when the cold was getting harsh, I decided to have a hot pot at my home with friends. To prepare, we first all went to the supermarket together. We bought Chinese cabbage, tofu and meat, which I thought were perfect ingredients for a hot pot.","As soon as we got home, we cut up the vegetables and put them into the pot one after another. Because vegetables are slow to cook through, we put them in first and added the meat later. As the pot came to a simmer, the room gradually grew warm. Thanks to the steam, it was almost enough to make us forget the cold outside.","Eating together makes the food taste much better than eating alone. Although it was a cold night, we were able to spend a happy time. I think hot pot is not just a dish, but something that brings people closer together."],"vocab":[{"w":"鍋","r":"なべ","m":"鍋子;火鍋料理","m_en":"pot; hot pot dish"},{"w":"白菜","r":"はくさい","m":"白菜","m_en":"Chinese cabbage"},{"w":"豆腐","r":"とうふ","m":"豆腐","m_en":"tofu"},{"w":"材料","r":"ざいりょう","m":"材料,食材","m_en":"ingredients; materials"},{"w":"順番","r":"じゅんばん","m":"順序,依序","m_en":"order; turn"},{"w":"煮える","r":"にえる","m":"煮熟,煮開","m_en":"to be cooked; to simmer"},{"w":"暖かい","r":"あたたかい","m":"暖和的","m_en":"warm"},{"w":"湯気","r":"ゆげ","m":"熱氣,蒸氣","m_en":"steam"},{"w":"過ごす","r":"すごす","m":"度過","m_en":"to spend (time)"},{"w":"近づける","r":"ちかづける","m":"使靠近,拉近","m_en":"to bring close"}],"grammar":[{"t":"〜ことにする","note":"表示說話者自己決定做某事。例:「友達と私の家で鍋をすることにしました」","t_en":"〜koto ni suru","note_en":"Expresses one's own decision to do something. Example: 「友達と私の家で鍋をすることにしました」"},{"t":"〜ため(に)","note":"表示原因、理由,接在普通形後面。例:「野菜は火が通りにくいため、先に入れて」","t_en":"〜tame (ni)","note_en":"Indicates a reason or cause, after the plain form. Example: 「野菜は火が通りにくいため、先に入れて」"},{"t":"〜ようにする","note":"表示努力讓某個行為成為習慣或做到某事。例:「肉は後から入れるようにしました」","t_en":"〜you ni suru","note_en":"Means to make an effort to do something or to make sure it happens. Example: 「肉は後から入れるようにしました」","id":"n3-39"},{"t":"〜につれて","note":"表示隨著一方的變化,另一方也跟著變化。例:「鍋が煮えてくるにつれて、部屋の中がだんだん暖かくなりました」","t_en":"〜ni tsurete","note_en":"Means as one thing changes, another changes along with it. Example: 「鍋が煮えてくるにつれて、部屋の中がだんだん暖かくなりました」","id":"n2-54"}]},
{"id":"eh-n4-1-n2","variant_of":"eh-n4-1","level":"n2","topic":"繪本","topic_en":"Picture book","title":"かぜをひいた日","title_zh":"感冒的那一天","title_en":"The Day I Caught a Cold","body":"朝起きると頭が割れるように痛く、のども腫れたようで、声を出すのもつらい状態でした。体も重く、熱があるのではないかと感じたたぬたろうは、仕事に行くのは無理だと判断せざるを得ませんでした。そこで会社に電話をかけ、「かぜをひいてしまったので、今日はお休みをいただけないでしょうか」と伝えました。\n電話を終えると、たぬたろうは近所のクリニックへ向かいました。受付で保険証を提示し、症状などを記入する問診票を書いて、順番が来るのを待ちました。診察室に入ると、お医者さんから「いつから具合が悪いのですか」と尋ねられました。たぬたろうは「昨日の夜からで、せきも出ます」と、症状を順番に説明しました。\n診察の結果、お医者さんは「ただのかぜですね」と言い、深刻な病気ではないと説明しました。そして「薬を飲んで、ゆっくり休んだほうがいいですよ」と、無理をしないよう勧めてくれました。薬をもらって帰宅したたぬたろうは、お医者さんの言葉どおり一日中横になって過ごしました。その夜、心配したコンちゃんがおかゆを持ってきてくれました。\n温かいおかゆは体にやさしく、弱った体にしみわたるようなおいしさでした。その後、薬と休養のおかげで、三日後にはたぬたろうはすっかり元気になりました。慣れない日本の病院は少し怖かったものの、行ってみれば心配するほどではなかったと感じています。","trans":["早上一起床,頭痛得像要裂開一樣,喉嚨似乎也腫了,連說話都覺得難受。身體也很沉重,狸太郎覺得自己可能發燒了,不得不判斷今天無法去上班。於是他打電話到公司,表示:「我感冒了,可以請您讓我今天請假嗎?」","講完電話後,狸太郎前往附近的診所。他在櫃檯出示健保卡,填寫了記錄症狀等資料的問診單,然後等待輪到自己。一進診間,醫生就問他:「從什麼時候開始不舒服的?」狸太郎回答:「從昨天晚上開始,也會咳嗽」,依序說明了自己的症狀。","診察的結果,醫生說:「只是普通感冒喔」,並解釋這不是什麼嚴重的疾病。接著又建議他:「吃了藥,好好休息比較好」,要他不要勉強自己。拿了藥回到家的狸太郎,照著醫生的話,一整天都躺著休息。那天晚上,擔心他的コン帶了稀飯過來。","熱騰騰的稀飯對身體很溫和,好吃得彷彿滲進了虛弱的身體裡。之後,多虧吃藥和休養,三天後狸太郎完全恢復了精神。他覺得,在不習慣的日本去醫院雖然有點可怕,但實際去了以後,並沒有擔心的那麼嚴重。"],"trans_en":["When he woke up in the morning, his head ached as if it were splitting, and his throat seemed swollen, making even talking painful. His body felt heavy too, and sensing he might have a fever, Tanutaro had no choice but to decide that going to work was out of the question. So he called his company and said, 'I've caught a cold, so could I please take the day off today?'","After the call, Tanutaro headed to a nearby clinic. At the reception desk he presented his health insurance card, filled out a medical questionnaire describing his symptoms, and waited for his turn. When he entered the examination room, the doctor asked, 'Since when have you been feeling unwell?' Tanutaro explained his symptoms in order, saying, 'Since last night, and I have a cough too.'","After the examination, the doctor said, 'It's just a cold,' and explained that it was not a serious illness. The doctor also advised him not to push himself, saying, 'You should take your medicine and rest well.' Having picked up his medicine and gone home, Tanutaro spent the whole day lying down, just as the doctor had said. That night, Kon, who had been worried about him, brought over some okayu (rice porridge).","The warm okayu was gentle on the stomach and tasted so good that it seemed to soak into his weakened body. Thanks to the medicine and rest, Tanutaro was fully back to his usual self three days later. He felt that although going to a hospital in unfamiliar Japan had been a little scary, it turned out not to be as worrying as he had feared."],"vocab":[{"w":"判断","r":"はんだん","m":"判斷","m_en":"judgment, to decide"},{"w":"提示","r":"ていじ","m":"出示、提出","m_en":"to present, to show"},{"w":"問診票","r":"もんしんひょう","m":"問診單","m_en":"medical questionnaire"},{"w":"症状","r":"しょうじょう","m":"症狀","m_en":"symptoms"},{"w":"具合","r":"ぐあい","m":"(身體)狀況","m_en":"condition, state of health"},{"w":"診察","r":"しんさつ","m":"診察、看診","m_en":"medical examination"},{"w":"深刻","r":"しんこく","m":"嚴重的","m_en":"serious, grave"},{"w":"勧める","r":"すすめる","m":"建議、勸","m_en":"to recommend, to advise"},{"w":"休養","r":"きゅうよう","m":"休養","m_en":"rest, recuperation"}],"grammar":[{"t":"〜ざるを得ない","note":"表示「不得不~」,在沒有其他選擇的情況下只能這樣做。例:「仕事に行くのは無理だと判断せざるを得ませんでした」","t_en":"~zaru o enai","note_en":"Means 'have no choice but to ~'. Example: 「仕事に行くのは無理だと判断せざるを得ませんでした」","id":"n2-35"},{"t":"〜どおり","note":"表示「按照~、和~一樣」,接在名詞後面。例:「お医者さんの言葉どおり一日中横になって過ごしました」","t_en":"~doori","note_en":"Means 'just as ~, in accordance with ~', attached to a noun. Example: 「お医者さんの言葉どおり一日中横になって過ごしました」"},{"t":"〜ものの","note":"表示「雖然~,但是~」,前後內容有落差。例:「少し怖かったものの、行ってみれば心配するほどではなかった」","t_en":"~mono no","note_en":"Means 'although ~, but ~', showing a contrast. Example: 「少し怖かったものの、行ってみれば心配するほどではなかった」","id":"n2-11"},{"t":"〜おかげで","note":"表示「多虧~」,說明好結果的原因。例:「薬と休養のおかげで、三日後にはすっかり元気になりました」","t_en":"~okage de","note_en":"Means 'thanks to ~', giving the reason for a good result. Example: 「薬と休養のおかげで、三日後にはすっかり元気になりました」","id":"n3-6"}]},
{"id":"eh-n4-1-n3","variant_of":"eh-n4-1","level":"n3","topic":"繪本","topic_en":"Picture book","title":"かぜをひいた日","title_zh":"感冒的那一天","title_en":"The Day I Caught a Cold","body":"朝起きると、頭がひどく痛くて、のども痛かったので、熱があるのではないかと思いました。たぬたろうは会社に電話をして、かぜをひいたので今日は休ませてほしいと伝えました。それから近くのクリニックへ行き、受付で保険証を出して問診票を書きました。\nお医者さんに「いつからですか」と聞かれたので、きのうの夜からだと答えました。せきも出ることを話すと、お医者さんは「ただのかぜですね」と言いました。そして、薬を飲んでゆっくり休んだほうがいいと教えてくれました。\nその夜、コンちゃんがおかゆを持ってきてくれました。おかゆは温かくて、体だけでなく心までほっとするようなおいしさでした。一人で寝ていると不安になりますが、そばに来てくれる人がいると心強いものです。\n三日後、たぬたろうはすっかり元気になりました。日本で病院に行くのは少しこわいと思っていましたが、実際に行ってみると問題ありませんでした。今回の経験によって、次に具合が悪くなっても安心して病院へ行けるようになりました。","trans":["早上一起床,頭痛得很厲害,喉嚨也痛,所以他心想自己是不是發燒了。狸太郎打電話到公司,說因為感冒了,希望今天能請假。接著他去了附近的診所,在櫃檯拿出健保卡,並填寫了問診單。","醫生問他「從什麼時候開始的」,所以他回答是從昨天晚上開始。他說自己也會咳嗽後,醫生說「只是普通感冒呢」。接著醫生告訴他,吃藥並好好休息比較好。","那天晚上,コン帶了稀飯過來。稀飯熱熱的,好吃得讓人不只身體,連心都跟著安定下來。一個人躺著會感到不安,但有人來到身邊,就會覺得很安心。","三天後,狸太郎完全恢復精神了。他原本覺得在日本去醫院有點可怕,但實際去了之後,發現完全沒有問題。透過這次的經驗,以後就算再不舒服,他也能安心地去醫院了。"],"trans_en":["When he woke up in the morning, his head hurt badly and his throat hurt too, so Tanutaro wondered if he had a fever. He called his company and said that he had a cold and wanted to take the day off. Then he went to a nearby clinic, handed over his insurance card at reception, and filled out a medical questionnaire.","The doctor asked him \"Since when?\", so he answered that it had been since last night. When he mentioned that he was also coughing, the doctor said \"It's just a cold.\" The doctor also told him that it would be best to take medicine and rest well.","That night, Kon brought him some okayu (rice porridge). It was warm, and delicious in a way that soothed not only his body but also his heart. When you are lying in bed alone you tend to feel uneasy, but it is reassuring to have someone come to your side.","Three days later, Tanutaro had completely recovered. He had thought that going to a hospital in Japan was a little scary, but when he actually went, there was no problem. Thanks to this experience, he became able to go to the hospital with peace of mind the next time he feels unwell."],"vocab":[{"w":"受付","r":"うけつけ","m":"櫃檯、接待處","m_en":"reception desk"},{"w":"保険証","r":"ほけんしょう","m":"健保卡、保險證","m_en":"health insurance card"},{"w":"問診票","r":"もんしんひょう","m":"問診單","m_en":"medical questionnaire"},{"w":"伝える","r":"つたえる","m":"傳達、告知","m_en":"to convey, to tell"},{"w":"おかゆ","r":"おかゆ","m":"稀飯、粥","m_en":"rice porridge"},{"w":"不安","r":"ふあん","m":"不安","m_en":"anxiety, uneasiness"},{"w":"心強い","r":"こころづよい","m":"令人安心的、有依靠的","m_en":"reassuring"},{"w":"すっかり","r":"すっかり","m":"完全、徹底","m_en":"completely"},{"w":"実際に","r":"じっさいに","m":"實際上","m_en":"actually, in reality"},{"w":"具合","r":"ぐあい","m":"(身體)狀況","m_en":"condition, state of health"}],"grammar":[{"t":"〜のではないかと思う","note":"表示「我想會不會是……」,用來委婉地提出推測。例:「熱があるのではないかと思いました」","t_en":"~no dewa nai ka to omou","note_en":"Expresses a tentative guess: \"I wonder if...\". Example: 「熱があるのではないかと思いました」"},{"t":"〜ようなN","note":"用「像……一樣的」來比喻或描述感覺。例:「心までほっとするようなおいしさでした」","t_en":"~you na N","note_en":"Describes something by comparison: \"like...\". Example: 「心までほっとするようなおいしさでした」"},{"t":"〜てみると","note":"表示「實際做了之後,發現……」,後面接發現或結果。例:「実際に行ってみると問題ありませんでした」","t_en":"~te miru to","note_en":"\"When I tried doing it, I found that...\". Example: 「実際に行ってみると問題ありませんでした」"},{"t":"〜によって","note":"表示原因、手段或「透過……」。例:「今回の経験によって、次に具合が悪くなっても安心して病院へ行けるようになりました」","t_en":"~ni yotte","note_en":"Indicates cause or means: \"through, by, due to\". Example: 「今回の経験によって、次に具合が悪くなっても安心して病院へ行けるようになりました」"}]},
{"id":"eh-n5-1-n2","variant_of":"eh-n5-1","level":"n2","topic":"繪本","topic_en":"Picture book","title":"はじめてのコンビニ","title_zh":"第一次去便利商店","title_en":"The First Convenience Store Visit","body":"たぬたろうは昨日来日したばかりで、今日は初めて日本のコンビニに足を運ぶことにした。店内は想像していた以上に明るく、おにぎりやパン、飲み物が所狭しと並んでいる。種類の多さに驚きながらも、たぬたろうは慎重に売り場を見て回った。\n迷った末、たぬたろうは弁当を一つとお茶を一つ選び、レジへ持っていった。店員に「温めますか」と聞かれたが、その質問に対して、たぬたろうは意味が分からず答えられなかった。「温めますか」は「熱くしますか」という意味で、その場で弁当を温めるかどうかを尋ねる言葉である。意味を知ったたぬたろうは、「はい、お願いします」と答えた。\n続いて店員から「袋は要りますか」と尋ねられたが、今度は意味がすぐに理解できた。買い物の経験が増えるに伴って、こうした決まり文句にも少しずつ慣れていくのだろう。たぬたろうは「大丈夫です」と落ち着いて答えることができた。初めての場面では緊張しがちだが、一度意味を知れば、次からは自信を持って対応できる。\n温めてもらった弁当は熱々で、想像以上においしかった。言葉が分からないからといって、買い物が難しいとは限らないと、たぬたろうは感じたようだ。この体験で自信がついたたぬたろうは、また近いうちにコンビニへ行ってみたいと思っている。","trans":["狸太郎昨天才剛來到日本,今天決定第一次走進日本的便利商店。店裡比想像中還要明亮,飯糰、麵包和飲料擺得滿滿的。雖然被種類之多嚇到,狸太郎還是謹慎地在賣場裡逛了一圈。","猶豫了一陣子之後,狸太郎挑了一個便當和一瓶茶,拿到收銀台。店員問他「要加熱嗎」,但面對這個問題,狸太郎不懂意思,答不出來。「あたためますか」的意思是「要幫你弄熱嗎」,也就是詢問是否當場把便當加熱的話。知道意思後,狸太郎回答:「好,麻煩你了。」","接著店員又問「需要袋子嗎」,這次他馬上就聽懂了。隨著購物經驗增加,對這類固定的說法大概也會漸漸習慣。狸太郎冷靜地回答:「不用了,沒關係。」第一次碰到的場面容易緊張,但只要知道一次意思,下次就能有自信地應對。","加熱過的便當熱騰騰的,比想像中還要好吃。狸太郎似乎體會到,就算聽不懂日文,買東西也不一定就很困難。有了這次的經驗而更有自信的狸太郎,想著最近還要再去便利商店。"],"trans_en":["Tanutaro had only just arrived in Japan yesterday, and today he decided to visit a Japanese convenience store for the first time. The inside was brighter than he had imagined, and rice balls, bread and drinks were packed onto the shelves. Though surprised by the sheer variety, he carefully walked around the store.","After some hesitation, Tanutaro chose one boxed lunch and one bottle of tea and took them to the register. The clerk asked him \"Atatamemasu ka,\" but in response to that question he did not understand it and could not answer. The phrase means \"Shall I heat it up?\" and asks whether you want the lunch warmed on the spot. Once he knew the meaning, Tanutaro answered, \"Yes, please.\"","Next the clerk asked, \"Do you need a bag?\" and this time he understood right away. As one's shopping experience grows, one probably gets used to such set phrases little by little. Tanutaro calmly answered, \"No, I'm fine.\" First-time situations tend to be stressful, but once you know the meaning, you can handle it with confidence next time.","The heated lunch was piping hot and tastier than he had expected. Tanutaro seemed to feel that not understanding the language does not necessarily make shopping difficult. Encouraged by this experience, he wants to visit a convenience store again soon."],"vocab":[{"w":"来日","r":"らいにち","m":"來到日本、訪日","m_en":"to come to Japan"},{"w":"足を運ぶ","r":"あしをはこぶ","m":"特地前往、造訪","m_en":"to go out of one's way to visit"},{"w":"所狭しと","r":"ところせましと","m":"擺得滿滿地","m_en":"packed tightly, filling every space"},{"w":"慎重","r":"しんちょう","m":"慎重、謹慎","m_en":"careful, cautious"},{"w":"温める","r":"あたためる","m":"加熱、溫熱","m_en":"to warm up, to heat"},{"w":"尋ねる","r":"たずねる","m":"詢問","m_en":"to ask, to inquire"},{"w":"慣れる","r":"なれる","m":"習慣、熟悉","m_en":"to get used to"},{"w":"対応","r":"たいおう","m":"應對、處理","m_en":"response, handling"},{"w":"熱々","r":"あつあつ","m":"熱騰騰","m_en":"piping hot"},{"w":"自信","r":"じしん","m":"自信","m_en":"confidence"}],"grammar":[{"t":"〜た末(に)","note":"表示經過一番猶豫或努力之後,最後得出結果。例:「迷った末、たぬたろうは弁当を一つとお茶を一つ選び」","t_en":"~ta sue (ni)","note_en":"After a long process of hesitation or effort, finally ending with a result. Example: 「迷った末、たぬたろうは弁当を一つとお茶を一つ選び」"},{"t":"〜に対して","note":"表示對於某個對象或問題做出反應。例:「その質問に対して、たぬたろうは意味が分からず答えられなかった」","t_en":"~ni taishite","note_en":"Toward or in response to a person or matter. Example: 「その質問に対して、たぬたろうは意味が分からず答えられなかった」","id":"n3-2"},{"t":"〜に伴って","note":"表示隨著某事的變化,另一件事也跟著變化。例:「買い物の経験が増えるに伴って、こうした決まり文句にも少しずつ慣れていくのだろう」","t_en":"~ni tomonatte","note_en":"As one thing changes, another changes along with it. Example: 「買い物の経験が増えるに伴って、こうした決まり文句にも少しずつ慣れていくのだろう」"},{"t":"〜とは限らない","note":"表示並不一定如此,否定過於絕對的想法。例:「言葉が分からないからといって、買い物が難しいとは限らない」","t_en":"~to wa kagiranai","note_en":"Not necessarily so; denies an overly absolute assumption. Example: 「言葉が分からないからといって、買い物が難しいとは限らない」","id":"n2-58"}]},
{"id":"eh-n5-1-n3","variant_of":"eh-n5-1","level":"n3","topic":"繪本","topic_en":"Picture book","title":"はじめてのコンビニ","title_zh":"第一次去便利商店","title_en":"The First Convenience Store Visit","body":"たぬたろうは昨日日本に着いたばかりで、今日は初めてコンビニに行ってみることにしました。店の中はとても明るく、おにぎりやパン、飲み物などがたくさん並んでいます。\nたぬたろうはお弁当を一つとお茶を一つ選んで、レジまで持っていきました。すると、店員さんに「温めますか」と聞かれましたが、意味がわかりませんでした。「温めますか」とは「熱くしますか」という意味の質問です。意味がわかったたぬたろうは、「はい、お願いします」と答えました。\n次に店員さんは「袋はいりますか」と聞きました。今度はその質問の意味がわかったので、「大丈夫です」と落ち着いて答えることができました。\n温かいお弁当は、思っていたよりずっとおいしかったです。たぬたろうは、この経験によって自信がつき、またコンビニに行ってみたいと思うようになりました。","trans":["狸太郎昨天才剛到日本，今天決定第一次去去看便利商店。店裡非常明亮，飯糰、麵包、飲料等等擺滿了貨架。","狸太郎選了一個便當和一瓶茶，拿到收銀台。這時店員問他「あたためますか」，但他聽不懂是什麼意思。「あたためますか」是「要幫你加熱嗎?」的意思的問句。弄懂意思之後，狸太郎回答：「好，麻煩你了。」","接著店員問他：「需要袋子嗎?」這次他聽懂了問題的意思，所以能夠冷靜地回答：「不用了，沒關係。」","熱熱的便當比他想像的好吃得多。狸太郎透過這次的經驗建立了自信，變得也想再去便利商店了。"],"trans_en":["Tanutaro had only just arrived in Japan yesterday, and today he decided to try going to a convenience store for the first time. The inside of the shop is very bright, and rice balls, bread, drinks and more are lined up in large numbers.","Tanutaro chose one boxed meal and one tea and took them to the register. Then the clerk asked him if he wanted it warmed up, but he did not understand what it meant. The question means asking whether to make it hot. Once he understood, Tanutaro answered, Yes, please.","Next, the clerk asked whether he needed a bag. This time he understood the question, so he was able to answer calmly, No, that is fine.","The warm boxed meal was much more delicious than he had expected. Through this experience, Tanutaro gained confidence and came to want to visit a convenience store again."],"vocab":[{"w":"着く","r":"つく","m":"到達、抵達","m_en":"to arrive"},{"w":"並ぶ","r":"ならぶ","m":"排列、陳列","m_en":"to be lined up"},{"w":"選ぶ","r":"えらぶ","m":"選擇","m_en":"to choose"},{"w":"店員","r":"てんいん","m":"店員","m_en":"shop clerk"},{"w":"温める","r":"あたためる","m":"加熱、溫熱","m_en":"to warm up"},{"w":"意味","r":"いみ","m":"意思、意義","m_en":"meaning"},{"w":"質問","r":"しつもん","m":"問題、提問","m_en":"question"},{"w":"落ち着く","r":"おちつく","m":"冷靜、沉著","m_en":"to calm down, to stay composed"},{"w":"経験","r":"けいけん","m":"經驗、經歷","m_en":"experience"},{"w":"自信","r":"じしん","m":"自信","m_en":"confidence"}],"grammar":[{"t":"〜たばかり","note":"表示動作剛完成不久。例：「昨日日本に着いたばかりで」表示才剛到日本。","t_en":"〜たばかり","note_en":"Indicates that something has just happened. Example: 「昨日日本に着いたばかりで」 means he had only just arrived in Japan.","id":"n3-11"},{"t":"〜ことにする","note":"表示自己做出的決定。例：「行ってみることにしました」表示決定去去看。","t_en":"〜ことにする","note_en":"Expresses a decision the speaker makes. Example: 「行ってみることにしました」 means he decided to try going."},{"t":"〜ことができる","note":"表示有能力或有辦法做某事。例：「落ち着いて答えることができました」表示能夠冷靜回答。","t_en":"〜ことができる","note_en":"Expresses ability or possibility. Example: 「落ち着いて答えることができました」 means he was able to answer calmly.","id":"n3-75"},{"t":"〜によって／〜ようになる","note":"「によって」表示原因或手段，「ようになる」表示變化。例：「この経験によって自信がつき」「思うようになりました」。","t_en":"〜によって / 〜ようになる","note_en":"によって shows cause or means, and ようになる shows a change over time. Example: 「この経験によって自信がつき」 and 「思うようになりました」."}]},
{"id":"eh-n5-2-n2","variant_of":"eh-n5-2","level":"n2","topic":"繪本","topic_en":"Picture book","title":"駅で迷子","title_zh":"在車站迷路了","title_en":"Lost at the Station","body":"今日は天気がよく、たぬたろうは電車に乗って海へ出かけることにした。ところが、駅に着いてみると、想像していた以上に大きな駅だった。構内には人があふれ、自分がどこへ向かえばいいのかさえ判断しにくい状態だった。海へ行く電車が何番線から出るのか、たぬたろうにはまったく見当がつかなかった。\n手がかりを求めて地図を確認したものの、情報が多すぎてかえって混乱してしまった。時間に余裕があるとは限らないので、たぬたろうの焦りは募る一方だった。困り果てて立ち尽くしていると、キツネのコンちゃんが通りかかり「どうしましたか」と声をかけてくれた。\nたぬたろうは「すみません、海へ行く電車はどこですか」と、思い切って尋ねてみた。コンちゃんは嫌な顔ひとつせず、「3番線ですよ、あそこの階段を上ってください」と丁寧に教えてくれた。知らない人に尋ねるのは勇気がいるが、聞いたおかげで迷いはすぐに解消されたのである。困ったときは一人で悩むよりも、周囲に助けを求めたほうが結果的に早く解決する場合が多い。\nたぬたろうは「ありがとうございます」とお礼を言うと、急いで階段を駆け上がった。発車時刻が迫っていたにもかかわらず、何とか電車に間に合うことができた。親切な人との出会いに助けられ、たぬたろうの海への一日は無事に始まったのである。","trans":["今天天氣很好,狸太郎決定搭電車去海邊。然而一到車站,才發現這裡比想像中還要大。站內擠滿了人,連自己該往哪裡走都很難判斷。去海邊的電車是從幾號月台出發,狸太郎完全沒有頭緒。","他為了找線索而看了地圖,但資訊太多,反而更混亂了。時間不一定寬裕,所以狸太郎越來越焦急。就在他苦惱得呆站原地時,狐狸コン剛好經過,開口問他:「怎麼了嗎?」","狸太郎鼓起勇氣問:「不好意思,去海邊的電車在哪裡?」コン一點也不嫌煩,親切地告訴他:「在 3 號月台喔,從那邊的樓梯上去。」向陌生人開口問路需要勇氣,但多虧開了口,迷惘立刻就解開了。遇到困難時,與其一個人煩惱,向周圍的人求助,結果往往能更快解決。","狸太郎說了聲「謝謝」,就急忙跑上樓梯。雖然發車時間逼近,他還是勉強趕上了電車。多虧遇到親切的人幫忙,狸太郎前往海邊的這一天平安地展開了。"],"trans_en":["The weather was fine, so Tanutaro decided to take the train to the sea. But when he arrived, the station turned out to be bigger than he had imagined. The concourse was packed with people, and it was hard even to tell where he should head. Tanutaro had no idea which platform the train to the sea left from.","He checked the map for clues, but there was so much information that he only got more confused. Since there was no guarantee he had time to spare, his anxiety kept growing. As he stood there at a loss, Kon the fox happened to pass by and asked, \"What's wrong?\"","Tanutaro summoned his courage and asked, \"Excuse me, where is the train to the sea?\" Without the slightest displeasure, Kon kindly told him, \"It's Platform 3, go up the stairs over there.\" Asking a stranger takes courage, but thanks to asking, his confusion was cleared up right away. When you're in trouble, asking those around you for help often resolves things faster than worrying alone.","Tanutaro said \"Thank you\" and hurried up the stairs. Even though the departure time was drawing near, he somehow managed to catch the train. Helped by an encounter with a kind person, Tanutaro's day at the sea got off to a safe start."],"vocab":[{"w":"構内","r":"こうない","m":"(車站等的)場內、站內","m_en":"premises, inside the station"},{"w":"見当がつかない","r":"けんとうがつかない","m":"毫無頭緒、無法推測","m_en":"to have no idea"},{"w":"手がかり","r":"てがかり","m":"線索、頭緒","m_en":"clue, lead"},{"w":"混乱","r":"こんらん","m":"混亂","m_en":"confusion"},{"w":"焦り","r":"あせり","m":"焦急","m_en":"impatience, anxiety"},{"w":"募る","r":"つのる","m":"(情緒)越來越強烈","m_en":"to grow stronger"},{"w":"立ち尽くす","r":"たちつくす","m":"呆站在原地","m_en":"to stand rooted to the spot"},{"w":"解消","r":"かいしょう","m":"消除、解決","m_en":"to resolve, to dispel"},{"w":"駆け上がる","r":"かけあがる","m":"跑上去","m_en":"to run up"},{"w":"間に合う","r":"まにあう","m":"趕上、來得及","m_en":"to be in time"}],"grammar":[{"t":"〜ものの","note":"表示「雖然……但是……」,後面接與預期相反的結果。例:「地図を確認したものの、情報が多すぎてかえって混乱してしまった」","t_en":"~ものの","note_en":"Means 'although ~, but ~', followed by a result contrary to expectation. Example: 「地図を確認したものの、情報が多すぎてかえって混乱してしまった」","id":"n2-11"},{"t":"〜とは限らない","note":"表示「不一定……」,否定全面性的推論。例:「時間に余裕があるとは限らないので」","t_en":"~とは限らない","note_en":"Means 'not necessarily ~', denying a blanket assumption. Example: 「時間に余裕があるとは限らないので」","id":"n2-58"},{"t":"〜一方だ","note":"表示某狀況持續朝同一方向惡化或增強,「越來越……」。例:「たぬたろうの焦りは募る一方だった」","t_en":"~一方だ","note_en":"Means 'keeps getting more ~', a situation steadily moving in one direction. Example: 「たぬたろうの焦りは募る一方だった」","id":"n3-38"},{"t":"〜にもかかわらず","note":"表示「儘管……卻……」,後句為與前句條件不符的結果。例:「発車時刻が迫っていたにもかかわらず、何とか電車に間に合うことができた」","t_en":"~にもかかわらず","note_en":"Means 'in spite of ~'. The latter clause contrasts with the former. Example: 「発車時刻が迫っていたにもかかわらず、何とか電車に間に合うことができた」","id":"n2-10"}]},
{"id":"eh-n5-2-n3","variant_of":"eh-n5-2","level":"n3","topic":"繪本","topic_en":"Picture book","title":"駅で迷子","title_zh":"在車站迷路了","title_en":"Lost at the Station","body":"今日はとてもいい天気だったので、たぬたろうは電車に乗って海へ出かけることにしました。ところが、駅は想像していたよりずっと大きく、たくさんの人が忙しそうに歩いていました。海へ行く電車が何番線から出るのか、たぬたろうにはまったく分かりませんでした。\n地図を見れば分かるだろうと思いましたが、かえって分からなくなってしまいました。時間も少しずつ過ぎていくため、たぬたろうはだんだん不安になってきました。そのとき、キツネのコンちゃんが通りかかり、困っている様子に気づいて声をかけました。\nたぬたろうは「すみません、海へ行く電車はどこから出ますか」と丁寧に聞きました。コンちゃんは「3番線ですよ、あそこの階段を上がってください」と、笑顔で教えてくれました。電車の発車時間が近づいていたので、たぬたろうはお礼を言うとすぐに走り出しました。\n階段を急いで上がったおかげで、たぬたろうはなんとか電車に間に合いました。困ったときに声をかけてもらえたことに、たぬたろうは心から感謝しました。","trans":["今天天氣非常好,所以狸太郎決定搭電車去海邊。沒想到車站比想像中大得多,很多人匆忙地走著。狸太郎完全不知道去海邊的電車是從幾號月台發車的。","他心想看看地圖應該就會知道,結果反而更搞不懂了。時間又一點一點過去,狸太郎漸漸不安了起來。這時,狐狸コン剛好經過,發現他一臉困擾的樣子,就開口搭話。","狸太郎有禮貌地問:「不好意思,去海邊的電車要從哪裡搭呢」。コン笑著告訴他:「在 3 號月台喔,從那邊的樓梯上去」。因為電車的發車時間快到了,狸太郎道完謝就立刻跑了起來。","多虧他急忙跑上樓梯,狸太郎總算趕上了電車。對於在困擾時有人願意出聲幫忙,狸太郎打從心底感謝。"],"trans_en":["The weather was lovely today, so Tanutaro decided to take a train to the sea. However, the station was much bigger than he had imagined, and lots of people were hurrying along. Tanutaro had no idea which platform the train to the sea left from.","He thought he would figure it out by looking at the map, but it only left him more confused. As time slowly ticked by, Tanutaro gradually grew anxious. Just then, Kon the fox happened to pass by, noticed he looked troubled, and spoke to him.","Tanutaro politely asked, \"Excuse me, where does the train to the sea leave from?\" Kon smiled and told him, \"It's Platform 3. Please go up the stairs over there.\" Since the train's departure time was getting close, Tanutaro thanked Kon and immediately started running.","Thanks to hurrying up the stairs, Tanutaro managed to catch the train. He was deeply grateful that someone had spoken to him when he was in trouble."],"vocab":[{"w":"出かける","r":"でかける","m":"出門、外出","m_en":"to go out"},{"w":"想像","r":"そうぞう","m":"想像","m_en":"imagination; to imagine"},{"w":"番線","r":"ばんせん","m":"月台號碼、軌道編號","m_en":"platform number"},{"w":"かえって","r":"かえって","m":"反而","m_en":"on the contrary; rather"},{"w":"不安","r":"ふあん","m":"不安","m_en":"anxious; uneasy"},{"w":"通りかかる","r":"とおりかかる","m":"剛好經過","m_en":"to happen to pass by"},{"w":"様子","r":"ようす","m":"樣子、情況","m_en":"appearance; state"},{"w":"丁寧","r":"ていねい","m":"有禮貌、仔細","m_en":"polite; careful"},{"w":"発車","r":"はっしゃ","m":"發車","m_en":"departure (of a train)"},{"w":"間に合う","r":"まにあう","m":"趕上、來得及","m_en":"to be in time"}],"grammar":[{"t":"〜ことにする","note":"表示說話者自己決定做某事。例:「電車に乗って海へ出かけることにしました」是狸太郎自己決定要去海邊。","t_en":"〜ことにする","note_en":"Expresses a decision made by the speaker or subject. Example: 「電車に乗って海へ出かけることにしました」 means Tanutaro decided to go to the sea by train."},{"w":"〜ため","t":"〜ため(原因)","note":"用來說明原因或理由,語氣比「から」稍正式。例:「時間も少しずつ過ぎていくため、たぬたろうはだんだん不安になってきました」","t_en":"〜ため (cause)","note_en":"States a reason or cause, slightly more formal than から. Example: 「時間も少しずつ過ぎていくため、たぬたろうはだんだん不安になってきました」"},{"t":"〜おかげで","note":"表示因為某個好的原因而得到好結果,帶有感謝的語氣。例:「階段を急いで上がったおかげで、たぬたろうはなんとか電車に間に合いました」","t_en":"〜おかげで","note_en":"Indicates a good result thanks to something, with a tone of gratitude. Example: 「階段を急いで上がったおかげで、たぬたろうはなんとか電車に間に合いました」","id":"n3-6"},{"t":"〜てしまう","note":"表示事情的結果令人遺憾或出乎意料,也可表示完成。例:「かえって分からなくなってしまいました」","t_en":"〜てしまう","note_en":"Shows an unintended or regrettable outcome, or completion. Example: 「かえって分からなくなってしまいました」"}]}
];
