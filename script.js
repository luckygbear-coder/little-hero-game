/* ============================================================
   小勇者之旅大冒險 · 終極整合版 script.js
   作者：小庫為吉吉熊量身打造 ❤️
============================================================ */

/* ===============================
   1. DOM 元件
================================ */
const screenHome = document.getElementById("screen-choose");
const screenMap = document.getElementById("screen-map");
const screenMonster = document.getElementById("screen-monster");
const screenBoss = document.getElementById("screen-boss");

const monsterImg = document.getElementById("monster-img");
const monsterDialogue = document.getElementById("monsterDialogue");
const monsterResult = document.getElementById("monsterResult");

const bossImg = document.getElementById("boss-img");
const bossDialogue = document.getElementById("bossDialogue");
const bossResult = document.getElementById("bossResult");

/* ===============================
   2. 魔物資料庫（10 種情緒）
================================ */
const monsters = {
  怒炎小獸: {
    stages: ["怒炎-1.png", "怒炎-2.png", "怒炎-3.png", "怒炎-4.png"],
    emotionStory: [
      "我才沒有生氣！只是…只是心裡熱熱的…！🔥",
      "你為什麼要對我這麼溫柔啦…我不習慣！",
      "好啦…我冷靜一些了…謝謝你願意陪我。",
      "嗯…我現在覺得好舒服…你真的很溫暖。"
    ]
  },
  憂鬱影狐: {
    stages: ["影狐-1.png", "影狐-2.png", "影狐-3.png", "影狐-4.png"],
    emotionStory: [
      "…我沒事，只是覺得世界有點灰。",
      "你願意聽我說嗎…？或許我沒那麼孤單…",
      "奇怪…為什麼心裡變得亮亮的？",
      "謝謝你，我覺得自己又能走下去了。"
    ]
  },
  焦慮跳兔: {
    stages: ["跳兔-1.png", "跳兔-2.png", "跳兔-3.png", "跳兔-4.png"],
    emotionStory: [
      "等一下！你要靠近嗎？我還沒準備好！",
      "你…你真的會保護我嗎？",
      "呼…好像真的比較放心了…",
      "謝謝你，我不再害怕了。"
    ]
  },
  嫉妒綠芽靈: {
    stages: ["芽靈-1.png", "芽靈-2.png", "芽靈-3.png", "芽靈-4.png"],
    emotionStory: [
      "為什麼大家都不看我…？",
      "咦…你願意陪我？",
      "嘿嘿…我開始覺得自己也很可愛。",
      "你讓我感受到被喜歡的感覺。"
    ]
  },
  孤單雲茸獸: {
    stages: ["雲獸-1.png", "雲獸-2.png", "雲獸-3.png", "雲獸-4.png"],
    emotionStory: [
      "沒有人會想跟我玩吧？",
      "你…願意靠近我嗎？",
      "啊…原來被陪伴是這種感覺…",
      "你讓我不再孤單了。"
    ]
  },
  挫折泥偶: {
    stages: ["泥偶-1.png", "泥偶-2.png", "泥偶-3.png", "泥偶-4.png"],
    emotionStory: [
      "我什麼都做不好…",
      "你覺得我真的還能變好嗎？",
      "喔！我做到了一點點！",
      "我會繼續努力的，謝謝你相信我。"
    ]
  },
  害羞莓果精: {
    stages: ["莓精-1.png", "莓精-2.png", "莓精-3.png", "莓精-4.png"],
    emotionStory: [
      "嗚…不要一直看我啦…",
      "咦？你不是想笑我嗎？",
      "你的鼓勵…好像甜甜的。",
      "嘿嘿…我現在覺得自己很棒！"
    ]
  },
  厭煩角蜥: {
    stages: ["角蜥-1.png", "角蜥-2.png", "角蜥-3.png", "角蜥-4.png"],
    emotionStory: [
      "唉…好麻煩，不想動。",
      "你…真的要陪我嗎？好啦。",
      "好像…沒那麼煩了。",
      "你讓我覺得輕鬆多了。"
    ]
  },
  胡思亂想狸: {
    stages: ["狸-1.png", "狸-2.png", "狸-3.png", "狸-4.png"],
    emotionStory: [
      "糟了糟了糟了…一定會出事！",
      "咦？你說我想太多？",
      "嗯…好像真的沒那麼可怕。",
      "我覺得世界變得安靜了。"
    ]
  },
  過度開心泡泡獸: {
    stages: ["泡泡-1.png", "泡泡-2.png", "泡泡-3.png", "泡泡-4.png"],
    emotionStory: [
      "好好好好好開心！！停不下來！！",
      "咦？我是不是太大聲了…？",
      "嘿嘿…我調整好了～",
      "現在剛剛好！我喜歡這樣。"
    ]
  }
};

let currentMonster = null;
let currentStage = 0;

/* ===============================
   3. 點地圖 → 出現魔物
================================ */
function exploreMonster(name) {
  currentMonster = monsters[name];
  currentStage = 0;

  monsterImg.src = currentMonster.stages[currentStage];
  monsterDialogue.innerText = currentMonster.emotionStory[currentStage];

  showScreen(screenMonster);
}

/* ===============================
   4. 勇者安撫魔物（剪刀石頭布）
================================ */
function chooseRPS(choice) {
  const r = Math.random();

  if (r < 0.6) {
    // 勇者成功安撫
    currentStage++;

    if (currentStage >= 4) {
      monsterDialogue.innerText = "✨ 魔物完全恢復好心情！變回可愛的朋友～";
      monsterImg.src = currentMonster.stages[3];
      monsterResult.innerText = "太棒了！你獲得一顆勇氣星星 ⭐";
      return;
    }

    monsterImg.src = currentMonster.stages[currentStage];
    monsterDialogue.innerText = currentMonster.emotionStory[currentStage];
  } else {
    monsterResult.innerText = "魔物還沒準備好…再試一次吧！🤝";
  }
}

/* ===============================
   5. 占卜（熊熊塔羅卡片）
================================ */
function showFortune() {
  const fortunes = [
    "🌟 今天適合伸出援手，你的溫柔會改變誰的一天。",
    "🔥 你的勇氣正在累積，準備迎接新的挑戰！",
    "🌈 放鬆一下吧，你值得擁有美好的休息。",
    "💖 愛會在你意想不到的地方出現。",
    "⭐ 你的直覺說得沒錯，相信自己！"
  ];

  const msg = fortunes[Math.floor(Math.random() * fortunes.length)];

  alert("🐻 熊熊占卜：\n\n" + msg);
}

/* ===============================
   6. 魔王戰（六段壞情緒）
================================ */
let bossStage = 0;
const bossEmotions = [
  "我不想聽你說話！走開！🔥",
  "我不需要任何人…！",
  "哼…你只是想贏我而已。",
  "你…你真的關心我嗎？",
  "為什麼你願意一直陪我…？",
  "謝謝你，我…好像沒這麼難受了。"
];

function startBoss() {
  bossStage = 0;
  bossImg.src = "boss-1.png";
  bossDialogue.innerText = bossEmotions[bossStage];

  showScreen(screenBoss);
}

function chooseRPSBoss() {
  bossStage++;

  if (bossStage >= 6) {
    bossDialogue.innerText = "✨ 你成功安撫魔王！星星王國重獲和平！";
    bossResult.innerText = "恭喜你通過最終挑戰！🎉";
    bossImg.src = "boss-happy.png";
    return;
  }

  bossImg.src = "boss-" + (bossStage + 1) + ".png";
  bossDialogue.innerText = bossEmotions[bossStage];
}

/* ===============================
   7. 螢幕切換
================================ */
function showScreen(target) {
  screenHome.classList.add("hidden");
  screenMap.classList.add("hidden");
  screenMonster.classList.add("hidden");
  screenBoss.classList.add("hidden");

  target.classList.remove("hidden");
}