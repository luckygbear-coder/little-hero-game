// ====== 全域狀態 ======
let currentHeroKey = null;
let currentMonsterKey = null;
let currentMonsterHp = 0;
let bossHp = 6;

// ====== 畫面切換 ======
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

// ====== 資料設定 ======
const heroNames = {
  warrior: "🛡 勇敢的戰士",
  mage: "🔮 創意法師",
  priest: "💖 溫柔牧師",
  villager: "🌾 勇敢的村民",
};

const monsters = {
  anger: {
    id: "anger",
    name: "怒炎小獸",
    emoji: "🔥",
    area: "草原",
    maxHp: 3,
    description: "牠一緊張就會大吼大叫，其實只是害怕被忽略。",
    calmLines: [
      "我看到你很生氣，但你其實很在意大家吧？",
      "謝謝你把真實的感受說出來，我有聽見。",
      "你可以慢慢來，不用一次就完全冷靜下來。",
    ],
  },
  sadness: {
    id: "sadness",
    name: "淚滴史萊姆",
    emoji: "💧",
    area: "湖畔",
    maxHp: 3,
    description: "總是覺得自己做不好，眼淚一顆一顆掉進湖裡。",
    calmLines: [
      "難過的時候，能哭出來也是一種很大的勇氣。",
      "就算你現在很沮喪，我還是很喜歡你在這裡。",
      "你不需要一直很乖，放鬆一下也沒關係。",
    ],
  },
  fear: {
    id: "fear",
    name: "驚驚蝙蝠",
    emoji: "🦇",
    area: "森林",
    maxHp: 3,
    description: "對未知的事情超害怕，總覺得會發生不好的事。",
    calmLines: [
      "害怕的時候，我們可以一起慢慢來。",
      "你不用一個人面對，我在你旁邊陪你。",
      "一步一步就好，不用一下子就完成全部。",
    ],
  },
};

const bossData = {
  name: "壞情緒魔王",
  emoji: "🐉",
  maxHp: 6,
  calmLines: [
    "就算你生氣、害怕或難過，也不代表你是壞的。",
    "謝謝你願意讓我看到你真正的模樣。",
    "我願意聽你說，不會笑你或責怪你。",
    "你的感受很重要，我都有認真放在心上。",
    "不管發生什麼事，你都值得被溫柔對待。",
    "如果很累，也可以先休息，之後再一起努力。",
  ],
};

const fortunes = [
  "今天的你，擁有溫柔治癒力，壞情緒看到你都會慢慢軟化～",
  "今天的你，充滿創意魔法，任何困難都能變成有趣的挑戰！",
  "今天的你，超級可靠穩重，是大家心中的小隊長！",
  "今天的你，散發溫暖笑容，只要出現，氣氛就會變得亮亮的。",
  "今天的你，很適合安靜地陪伴別人，一起呼吸、一起放鬆。",
];

// ====== DOM 元素 ======
const currentHeroLabel = document.getElementById("current-hero-label");

// 魔物畫面
const monsterAreaEl = document.getElementById("monster-area");
const monsterNameEl = document.getElementById("monster-name");
const monsterDescEl = document.getElementById("monster-desc");
const monsterHpTextEl = document.getElementById("monster-hp-text");
const monsterRoundResultEl = document.getElementById("monster-round-result");
const monsterLogEl = document.getElementById("monster-log");

// 魔王畫面
const bossHpTextEl = document.getElementById("boss-hp-text");
const bossRoundResultEl = document.getElementById("boss-round-result");
const bossLogEl = document.getElementById("boss-log");

// 占卜
const fortuneModal = document.getElementById("fortune-modal");
const fortuneTextEl = document.getElementById("fortune-text");

// ====== 工具函式 ======
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomHand() {
  const hands = ["rock", "scissors", "paper"];
  return getRandomItem(hands);
}

// rock > scissors, scissors > paper, paper > rock
function judgeRound(player, enemy) {
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

function handToIcon(hand) {
  if (hand === "rock") return "✊";
  if (hand === "scissors") return "✌️";
  return "🖐";
}

// ====== 熊熊占卜 ======
function openFortuneModal() {
  const text = getRandomItem(fortunes);
  fortuneTextEl.textContent = text;
  fortuneModal.style.display = "flex";
}

// 給 HTML onclick 用（一定會存在）
function closeFortuneModal() {
  fortuneModal.style.display = "none";
  showScreen("map");
}

// 再保險一次，也加上 JS 綁定（就算哪天忘記 onclick 也能動）
document.getElementById("fortune-ok-btn").addEventListener("click", () => {
  closeFortuneModal();
});

// ====== 勇者選擇邏輯 ======
function setupHeroButtons() {
  const heroButtons = document.querySelectorAll(".hero-btn");
  heroButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const heroKey = btn.dataset.hero;
      currentHeroKey = heroKey;
      currentHeroLabel.textContent = heroNames[heroKey] || "小勇者";
      // 選完勇者 → 顯示占卜視窗
      openFortuneModal();
    });
  });
}

// ====== 地圖按鈕 ======
function setupMapTiles() {
  const tiles = document.querySelectorAll(".map-tile");
  tiles.forEach((tile) => {
    const monsterKey = tile.dataset.monster;
    if (!monsterKey) return;
    tile.addEventListener("click", () => {
      startMonsterBattle(monsterKey);
    });
  });

  const bossTile = document.getElementById("tile-boss");
  bossTile.addEventListener("click", () => {
    startBossBattle();
  });

  document
    .getElementById("btn-rechoose-hero")
    .addEventListener("click", () => {
      currentHeroKey = null;
      currentHeroLabel.textContent = "";
      showScreen("choose");
    });
}

// ====== 魔物戰 ======
function startMonsterBattle(monsterKey) {
  const monster = monsters[monsterKey];
  if (!monster) return;

  currentMonsterKey = monsterKey;
  currentMonsterHp = monster.maxHp;

  monsterAreaEl.textContent = monster.area;
  monsterNameEl.textContent = `${monster.emoji} ${monster.name}`;
  monsterDescEl.textContent = monster.description;
  monsterHpTextEl.textContent = `壞情緒強度：${currentMonsterHp} / ${monster.maxHp}`;
  monsterRoundResultEl.textContent = "";
  monsterLogEl.innerHTML = "";

  addLog(
    monsterLogEl,
    `你遇見了 ${monster.emoji} ${monster.name}，牠看起來有點不安……`
  );

  showScreen("monster");
}

function addLog(container, text) {
  const line = document.createElement("div");
  line.className = "log-line";
  line.textContent = text;
  container.appendChild(line);
  container.scrollTop = container.scrollHeight;
}

function playMonsterRound(playerHand) {
  if (!currentMonsterKey) return;

  const monster = monsters[currentMonsterKey];
  const enemyHand = getRandomHand();
  const result = judgeRound(playerHand, enemyHand);

  const playerIcon = handToIcon(playerHand);
  const enemyIcon = handToIcon(enemyHand);

  if (result === "win") {
    currentMonsterHp = Math.max(0, currentMonsterHp - 1);
    const calmLine = getRandomItem(monster.calmLines);
    monsterRoundResultEl.textContent = `你贏了！${playerIcon} 戰勝 ${enemyIcon}`;
    addLog(monsterLogEl, `你對魔物說：「${calmLine}」`);
    if (currentMonsterHp === 0) {
      addLog(
        monsterLogEl,
        `${monster.emoji} ${monster.name} 眼神變得柔和，慢慢露出笑容：「謝謝你願意理解我！」`
      );
      monsterHpTextEl.textContent = `壞情緒強度：0 / ${monster.maxHp}（已被安撫）`;
    } else {
      monsterHpTextEl.textContent = `壞情緒強度：${currentMonsterHp} / ${monster.maxHp}`;
    }
  } else if (result === "lose") {
    monsterRoundResultEl.textContent = `這回合魔物佔上風…… ${playerIcon} 輸給 ${enemyIcon}`;
    addLog(
      monsterLogEl,
      `${monster.emoji} 情緒有點激動，你深呼吸一下，提醒自己也要照顧好心情。`
    );
  } else {
    monsterRoundResultEl.textContent = `平手！${playerIcon} 對 ${enemyIcon}`;
    addLog(monsterLogEl, "你們同時出了一樣的拳，再試一次吧～");
  }
}

// 猜拳按鈕綁定（魔物）
function setupMonsterRpsButtons() {
  const buttons = document.querySelectorAll("#screen-monster .rps-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const hand = btn.dataset.hand;
      playMonsterRound(hand);
    });
  });

  document
    .getElementById("btn-monster-back")
    .addEventListener("click", () => {
      showScreen("map");
    });
}

// ====== 魔王戰 ======
function startBossBattle() {
  bossHp = bossData.maxHp;
  bossHpTextEl.textContent = `壞情緒強度：${bossHp} / ${bossData.maxHp}`;
  bossRoundResultEl.textContent = "";
  bossLogEl.innerHTML = "";

  addLog(
    bossLogEl,
    `${bossData.emoji} ${bossData.name} 緩緩出現，牠的身上聚集了許多壞情緒……`
  );
  addLog(
    bossLogEl,
    "別擔心，只要一步一步用好心情回應，就能讓牠慢慢放鬆下來。"
  );

  showScreen("boss");
}

function playBossRound(playerHand) {
  const enemyHand = getRandomHand();
  const result = judgeRound(playerHand, enemyHand);

  const playerIcon = handToIcon(playerHand);
  const enemyIcon = handToIcon(enemyHand);

  if (result === "win") {
    bossHp = Math.max(0, bossHp - 1);
    const calmLine = getRandomItem(bossData.calmLines);
    bossRoundResultEl.textContent = `你成功傳遞好心情！${playerIcon} 戰勝 ${enemyIcon}`;
    addLog(bossLogEl, `你對魔王說：「${calmLine}」`);

    if (bossHp === 0) {
      bossHpTextEl.textContent = `壞情緒強度：0 / ${bossData.maxHp}（已被安撫）`;
      addLog(
        bossLogEl,
        `${bossData.emoji} ${bossData.name} 緩緩放下武裝：「原來，我也可以被理解……謝謝你，小勇者。」`
      );
      addLog(
        bossLogEl,
        "恭喜你！你讓壞情緒魔王重新找回好心情，星星王國的天空亮了起來！"
      );
    } else {
      bossHpTextEl.textContent = `壞情緒強度：${bossHp} / ${bossData.maxHp}`;
    }
  } else if (result === "lose") {
    bossRoundResultEl.textContent = `這回合魔王比較激動…… ${playerIcon} 輸給 ${enemyIcon}`;
    addLog(
      bossLogEl,
      "魔王情緒突然飆高，你先退一步深呼吸三次，提醒自己也值得被照顧。"
    );
  } else {
    bossRoundResultEl.textContent = `平手！${playerIcon} 對 ${enemyIcon}`;
    addLog(bossLogEl, "你們同時出了一樣的拳，先笑一笑，再來一回合！");
  }
}

// 猜拳按鈕綁定（魔王）
function setupBossRpsButtons() {
  const buttons = document.querySelectorAll("#screen-boss .boss-rps-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const hand = btn.dataset.hand;
      playBossRound(hand);
    });
  });

  document.getElementById("btn-boss-back").addEventListener("click", () => {
    showScreen("map");
  });
}

// ====== 初始化 ======
function init() {
  showScreen("choose");
  setupHeroButtons();
  setupMapTiles();
  setupMonsterRpsButtons();
  setupBossRpsButtons();
}

init();