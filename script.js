// ======= 全域狀態 =======
let currentHero = null;
let currentMonster = null;
let bossCalmCount = 0; // 魔王已被安撫的情緒數（0~6）

// 方便切換畫面
const screens = {
  choose: document.getElementById("screen-choose"),
  map: document.getElementById("screen-map"),
  monster: document.getElementById("screen-monster"),
  boss: document.getElementById("screen-boss"),
};

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

// ======= 勇者資料 =======
const heroNames = {
  warrior: "🛡️ 戰士",
  mage: "🔮 法師",
  priest: "💖 牧師",
  villager: "🌾 勇敢的村民",
};

// ======= 魔物設定（10 種情緒可以慢慢補，先放幾個示範） =======
const monsters = {
  anger: {
    id: "anger",
    name: "🔥 怒炎小獸",
    emoji: "🔥",
    intro: "牠全身都是小火花，最近一直因為小事大爆炸。",
    winLines: [
      "「好啦…其實我只是希望有人理解我在意的事情。」",
      "「被你這樣聽我說，我的火好像沒那麼燒了。」",
    ],
    loseLines: [
      "「哼！你根本不懂我！」",
      "「走開啦，我現在什麼都不想聽！」",
    ],
  },
  sad: {
    id: "sad",
    name: "💧 泣波水靈",
    emoji: "💧",
    intro: "眼淚像小水球一樣浮在身邊，走到哪裡都滴滴答答。",
    winLines: [
      "「聽你這麼說…我好像沒那麼難過了。」",
      "「原來難過也可以慢慢變成力量，謝謝你。」",
    ],
    loseLines: [
      "「不要理我，我只想一個人哭…」",
    ],
  },
  fear: {
    id: "fear",
    name: "😱 驚羽小鳥",
    emoji: "😱",
    intro: "任何聲音都會嚇到牠，翅膀一直抖個不停。",
    winLines: [
      "「原來可以一點一點練習勇敢…我想試試看。」",
    ],
    loseLines: [
      "「不要靠近我！好可怕！」",
    ],
  },
  jealous: {
    id: "jealous",
    name: "💚 忌影貓妖",
    emoji: "🐱",
    intro: "總覺得別人都比自己好，尾巴一直不爽地甩來甩去。",
    winLines: [
      "「也許我也有自己的閃亮點…謝謝你提醒我。」",
    ],
    loseLines: [
      "「哼，你一定也在笑我吧！」",
    ],
  },
  lonely: {
    id: "lonely",
    name: "🌙 孤單雲茸獸",
    emoji: "☁️",
    intro: "飄在半空中，很想靠近大家又有點害羞。",
    winLines: [
      "「原來我可以主動說：我們一起玩好嗎？」",
    ],
    loseLines: [
      "「算了…沒人需要我。」",
    ],
  },
  tired: {
    id: "tired",
    name: "😴 累累木靈",
    emoji: "🌳",
    intro: "長著樹葉枕頭，一直想睡覺，什麼都好懶。",
    winLines: [
      "「原來休息一下再出發，也是很棒的選擇。」",
    ],
    loseLines: [
      "「不要吵我…我什麼都不想動。」",
    ],
  },
  anxious: {
    id: "anxious",
    name: "🔥 焦躁火鼠",
    emoji: "🐭",
    intro: "總覺得時間不夠用，尾巴火花啪啪作響。",
    winLines: [
      "「慢慢來、先做一件事情就好…好像也可以耶！」",
    ],
    loseLines: [
      "「快點快點！我好緊張啊！」",
    ],
  },
  inferior: {
    id: "inferior",
    name: "🫥 虛心史萊姆",
    emoji: "🫧",
    intro: "覺得自己軟趴趴、什麼都不行，一直往地板黏。",
    winLines: [
      "「原來我也有值得被喜歡的地方。」",
    ],
    loseLines: [
      "「我就爛…一定又會弄錯。」",
    ],
  },
  // 之後還可以再加兩隻：愧疚 shame、厭煩 bored…等
};

// ======= 占卜卡片 =======
const fortuneMessages = [
  "今天的你，具有超強『傾聽魔法』。先聽聽魔物在乎的是什麼，再出拳吧！",
  "當你願意說出自己的感受時，魔物也會比較敢說真心話。",
  "輸了沒關係，每一次出拳，都是在練習勇敢面對情緒。",
  "記得深呼吸三次，再按下出拳的按鈕，心就會比較穩定喔。",
  "你不是一個人，星星王國裡有很多夥伴跟你一起面對壞情緒。",
];

// ======= 工具：隨機出拳、勝負判定 =======
const rps = ["rock", "scissors", "paper"];

function randomRPS() {
  return rps[Math.floor(Math.random() * rps.length)];
}

function judgeRPS(player, enemy) {
  if (player === enemy) return "draw";
  if (
    (player === "rock" && enemy === "scissors") ||
    (player === "scissors" && enemy === "paper") ||
    (player === "paper" && enemy === "rock")
  ) {
    return "win";
  }
  return "lose";
}

function rpsToEmoji(hand) {
  if (hand === "rock") return "✊";
  if (hand === "scissors") return "✌️";
  return "✋";
}

// ======= 熊熊占卜 =======
const fortunePopup = document.getElementById("fortunePopup");
const fortuneText = document.getElementById("fortuneText");

function showFortune() {
  const msg =
    fortuneMessages[Math.floor(Math.random() * fortuneMessages.length)];
  if (fortuneText) fortuneText.textContent = msg;
  if (fortunePopup) fortunePopup.classList.remove("hidden");
}

function closeFortune() {
  if (fortunePopup) fortunePopup.classList.add("hidden");
}

// ======= 勇者選擇 =======
function selectHero(heroKey) {
  currentHero = heroKey;
  // 選好勇者後，先給一張占卜卡，再進入地圖
  showFortune();
  // 關掉占卜後再手動按回地圖，比較有儀式感；
  // 如果你想自動進地圖，也可以在 closeFortune 裡面加 showScreen("map")。
  showScreen("map");
}

// ======= 進入魔物戰 =======
const monsterTitle = document.getElementById("monsterTitle");
const monsterImg = document.getElementById("monsterImg");
const monsterDialogue = document.getElementById("monsterDialogue");
const monsterResult = document.getElementById("monsterResult");

function enterMonster(monsterId) {
  const m = monsters[monsterId];
  if (!m) return;

  currentMonster = m;
  monsterTitle.textContent = `${m.name}`;
  monsterImg.textContent = m.emoji;
  monsterDialogue.textContent = m.intro;
  monsterResult.textContent = "選一個拳，試著用好心情與牠互動吧～";

  showScreen("monster");
}

// 玩家在魔物戰出拳
function playMonster(playerHand) {
  if (!currentMonster) return;

  const enemyHand = randomRPS();
  const outcome = judgeRPS(playerHand, enemyHand);

  let text = `你出的是 ${rpsToEmoji(playerHand)}，魔物出的是 ${rpsToEmoji(
    enemyHand
  )}。\n`;

  if (outcome === "draw") {
    text += "平手！也許可以再試一次，用不同的語氣說說看？";
  } else if (outcome === "win") {
    const line =
      currentMonster.winLines[
        Math.floor(Math.random() * currentMonster.winLines.length)
      ];
    text += `你用溫柔的語氣說話，魔物的表情慢慢軟化。\n${line}`;
  } else {
    const line =
      currentMonster.loseLines[
        Math.floor(Math.random() * currentMonster.loseLines.length)
      ];
    text += `這次的語氣好像有點太衝了…魔物有點受傷。\n${line}`;
  }

  monsterResult.textContent = text;
}

// 回到地圖
function backToMap() {
  showScreen("map");
}

// ======= 魔王戰 =======
const bossImg = document.getElementById("bossImg");
const bossDialogue = document.getElementById("bossDialogue");
const bossResult = document.getElementById("bossResult");

// 六種壞情緒，安撫六次就成功
const bossEmotions = [
  "憤怒",
  "悲傷",
  "害怕",
  "嫉妒",
  "孤單",
  "自卑",
];

function startBossBattle() {
  bossCalmCount = 0;
  bossImg.textContent = "🐲";
  bossDialogue.textContent =
    "「我是被六種壞情緒纏住的魔王…你有辦法讓我的心慢慢放鬆嗎？」";
  bossResult.textContent = "連續安撫 6 種情緒，就能讓魔王變回溫柔的守護者！";

  showScreen("boss");
}

function playBoss(playerHand) {
  const enemyHand = randomRPS();
  const outcome = judgeRPS(playerHand, enemyHand);

  let text = `你出的是 ${rpsToEmoji(playerHand)}，魔王出的是 ${rpsToEmoji(
    enemyHand
  )}。\n`;

  if (outcome === "draw") {
    text += "這一拳互相試探，誰也沒真正受傷，再試一次吧。";
  } else if (outcome === "win") {
    const emotion = bossEmotions[bossCalmCount] || "壞情緒";
    bossCalmCount += 1;

    text += `你用星星語句安撫了魔王心中的「${emotion}」。\n`;

    if (bossCalmCount >= 6) {
      text +=
        "六種壞情緒都被好好安頓好了！魔王的眼神變得溫柔，原來牠也只是太需要被理解。恭喜你完成小勇者之旅大冒險！";
      bossImg.textContent = "🌟";
      bossDialogue.textContent =
        "「謝謝你願意看見我的心，而不是只看見我的壞脾氣。」";
    } else {
      bossDialogue.textContent = `「咦…我的心好像輕了一點點，還剩下 ${
        6 - bossCalmCount
      } 種情緒…你願意繼續陪我嗎？」`;
    }
  } else {
    text +=
      "魔王被壞情緒再次影響，大吼了一聲。不過你深呼吸了一下，決定再試一次。";
  }

  bossResult.textContent = text;
}

// ======= 一開始預設畫面 =======
showScreen("choose");
// 若你希望一開場就來一張占卜卡，這行打開即可：
// showFortune();