// ===============================
// 🎮 主遊戲流程 game.js
// 依賴：sentences.js / monsters.js / boss.js
// ===============================

import { loveSentences, courageSentences } from "./sentences.js";
import { monstersConfig } from "./monsters.js";
import { BOSS_NAME, bossEmotions } from "./boss.js";

// 小工具：隨機取一句
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ✅ 玩家收集到的可用語句（當作「語句背包」）
const collectedLove = [];
const collectedCourage = [];

// 文字輔助
function fistToText(fist) {
  if (fist === "rock") return "石頭 ✊";
  if (fist === "paper") return "布 🖐";
  if (fist === "scissors") return "剪刀 ✌️";
  return "—";
}
function forbiddenText(fist) {
  if (fist === "rock") return "不能出「石頭 ✊」";
  if (fist === "paper") return "不能出「布 🖐」";
  if (fist === "scissors") return "不能出「剪刀 ✌️」";
  return "有點神祕，看不出弱點…";
}

// =========================
// 🔹 模式選擇（單人 / 同機雙人）
// =========================
let currentMode = "single"; // 'single' 或 'local2p'
const modeBtns = document.querySelectorAll(".mode-btn");
const modeBanner = document.getElementById("modeBanner");

function updateModeBanner() {
  if (currentMode === "single") {
    modeBanner.innerHTML =
      "目前模式：<b>單人冒險</b>（一個人練習與魔物互動）";
  } else {
    modeBanner.innerHTML =
      "目前模式：<b>同機雙人</b>（兩位小勇者輪流操作，適合親子或朋友）";
  }
}

modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentMode = btn.dataset.mode;
    modeBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    updateModeBanner();
  });
});
updateModeBanner();

// =========================
// Tabs 分頁切換
// =========================
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

function showPage(id) {
  pages.forEach((p) => {
    p.classList.toggle("active", p.id === id);
  });
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    showPage(target);
  });
});

// =========================
// 小勇者選擇
// =========================
let currentHero = null;
let currentHeroTalent = null;
const heroCards = document.querySelectorAll(".hero-card");
const currentHeroBox = document.getElementById("currentHero");

heroCards.forEach((card) => {
  card.addEventListener("click", () => {
    heroCards.forEach((c) => c.classList.remove("active"));
    card.classList.add("active");

    const name = card.dataset.hero;
    const fist = card.dataset.fist;
    const line = card.dataset.line;

    currentHero = name;
    currentHeroTalent = fist;

    let talentText = "任意拳";
    if (fist === "rock") talentText = "石頭 ✊";
    if (fist === "paper") talentText = "布 🖐";
    if (fist === "scissors") talentText = "剪刀 ✌️";

    currentHeroBox.innerHTML = `
      目前選擇的小勇者：<b>${name}</b><br>
      招牌拳法：${talentText}<br>
      口頭禪：${line}
    `;
  });
});

// =========================
// 九宮格地圖選擇 & 通關紀錄
// =========================
let currentStage = null;
let currentMonster = null;
const mapCells = document.querySelectorAll(".map-cell");
const currentStageBox = document.getElementById("currentStage");

const clearedStages = Array(9).fill(false);
const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // 橫排
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // 直排
  [0, 4, 8],
  [2, 4, 6], // 斜線
];
const lineCompleted = Array(lines.length).fill(false);

let bossUnlocked = false;
let bossDefeated = false;

// ========= 新增：主選單進度文字 =========
function getProgressText() {
  const clearedCount = clearedStages.filter((v) => v).length;
  const bossDone = calmedBossEmotionKeys.length;
  return `目前進度：九宮格已通關 ${clearedCount} / 9 格，魔王壞情緒已安撫 ${bossDone} / 6。`;
}

function goToHome() {
  const btn = document.querySelector('.nav-btn[data-target="page-home"]');
  if (btn) {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }
  showPage("page-home");

  // 更新主選單進度顯示
  const homeTip = document.getElementById("homeTip");
  if (homeTip) {
    homeTip.innerHTML =
      "🌟 小提示：<br>" +
      '把九宮格全部變成「⭐ 已通關」，就會自動解鎖最終魔王關卡！<br><br>' +
      getProgressText();
  }
}
window.goToHome = goToHome; // 給 HTML onclick 用

function goToMap() {
  const btn = document.querySelector('.nav-btn[data-target="page-map"]');
  if (btn) {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }
  showPage("page-map");
}
window.goToMap = goToMap;

mapCells.forEach((cell) => {
  cell.addEventListener("click", () => {
    mapCells.forEach((c) => c.classList.remove("active"));
    cell.classList.add("active");

    currentStage = parseInt(cell.dataset.stage, 10);
    currentMonster = cell.dataset.monster;

    currentStageBox.innerHTML = `
      目前選擇的地點：<b>第 ${currentStage} 格</b><br>
      對戰魔物：<b>${currentMonster}</b><br>
      點擊「進入戰鬥！」即可開始這一關。<br>
      <span style="font-size:12px;color:#a0622a;">
        現在模式：${
          currentMode === "single"
            ? "單人冒險（由你出拳）"
            : "同機雙人（可以輪流出拳）"
        }
      </span>
    `;
  });
});

// ========= 魔王狀態徽章 =========
const bossStatusBox = document.getElementById("bossStatus");

function refreshBossStatus() {
  if (!bossStatusBox) return;
  if (!bossUnlocked) {
    bossStatusBox.textContent = "魔王狀態：尚未解鎖，先把九宮格通關吧！";
  } else if (bossUnlocked && !bossDefeated) {
    bossStatusBox.textContent =
      "魔王狀態：已解鎖，隨時可以前往挑戰黑霧巨龍！";
  } else if (bossDefeated) {
    bossStatusBox.textContent = "魔王狀態：已被安撫，星星王國恢復和平！";
  }
}
refreshBossStatus();

// ========= 通關後處理 =========
const loveBox = document.getElementById("loveMessage");
const courageBox = document.getElementById("courageMessage");

function onMonsterCalmed(stageNumber) {
  const idx = stageNumber - 1;
  if (!clearedStages[idx]) {
    clearedStages[idx] = true;
    const cell = document.querySelector(`.map-cell[data-stage="${stageNumber}"]`);
    if (cell && !cell.querySelector(".cleared-star")) {
      const star = document.createElement("div");
      star.className = "cleared-star";
      star.textContent = "⭐ 已通關";
      cell.appendChild(star);
    }
  }

  // 愛的力量語句
  const love = pickRandom(loveSentences);
  loveBox.textContent = "💗 愛的力量語句：" + love;
  if (!collectedLove.includes(love)) {
    collectedLove.push(love);
  }

  // 勇氣星星語句（連線才觸發）
  const newly = checkNewLines();
  if (newly > 0) {
    const cor = pickRandom(courageSentences);
    courageBox.textContent = "⭐ 勇氣星星語句：" + cor;
    if (!collectedCourage.includes(cor)) {
      collectedCourage.push(cor);
    }
  }

  // ✅ 全通關 → 解鎖魔王戰
  if (!bossUnlocked && clearedStages.every((v) => v)) {
    bossUnlocked = true;
    refreshBossStatus();
    alert(
      "🌟 恭喜！九宮格全部通關！\n黑霧的源頭正在甦醒，準備挑戰魔王黑霧巨龍！"
    );
    startBossBattle();
  } else {
    refreshBossStatus();
  }
}

function checkNewLines() {
  let newly = 0;
  lines.forEach((line, index) => {
    if (!lineCompleted[index]) {
      const ok = line.every((i) => clearedStages[i]);
      if (ok) {
        lineCompleted[index] = true;
        newly++;
      }
    }
  });
  return newly;
}

// =========================
// 戰鬥畫面 DOM & 狀態
// =========================
const battleHeroName = document.getElementById("battleHeroName");
const battleHeroTalent = document.getElementById("battleHeroTalent");
const battleMonsterName = document.getElementById("battleMonsterName");
const battleMonsterInfo = document.getElementById("battleMonsterInfo");
const battleModeLabel = document.getElementById("battleModeLabel");
const bearTip = document.getElementById("bearTip");
const battleResultBox = document.getElementById("battleResult");
const bossEmotionBar = document.getElementById("bossEmotionBar");
const bossEmotionText = document.getElementById("bossEmotionText");

const btnRock = document.getElementById("btn-rock");
const btnScissors = document.getElementById("btn-scissors");
const btnPaper = document.getElementById("btn-paper");

const bossPhraseArea = document.getElementById("bossPhraseArea");
const bossPhraseSelect = document.getElementById("bossPhraseSelect");
const bossCustomPhrase = document.getElementById("bossCustomPhrase");
const bossInnerStoryBox = document.getElementById("bossInnerStoryBox");

let isBossBattle = false;
let bossBadEmotionLeft = 6; // 魔王 6 個壞情緒
let calmedBossEmotionKeys = [];

function highlightHeroTalentButton() {
  [btnRock, btnScissors, btnPaper].forEach((btn) =>
    btn.classList.remove("hero-talent")
  );
  if (currentHeroTalent === "rock") btnRock.classList.add("hero-talent");
  if (currentHeroTalent === "scissors") btnScissors.classList.add("hero-talent");
  if (currentHeroTalent === "paper") btnPaper.classList.add("hero-talent");
  // any：不特別標
}

function renderBossEmotionState() {
  const done = bossEmotions.filter((e) =>
    calmedBossEmotionKeys.includes(e.key)
  );
  const remaining = bossEmotions.filter(
    (e) => !calmedBossEmotionKeys.includes(e.key)
  );
  const doneNames = done.map((e) => e.name).join("、") || "尚未安撫";
  const leftNames =
    remaining.map((e) => e.name).join("、") || "已全部安撫完成";

  bossEmotionText.textContent = `已安撫 ${done.length} / ${
    bossEmotions.length
  }：${doneNames}｜尚未：${leftNames}`;
}

function refreshBossPhraseOptions() {
  bossPhraseSelect.innerHTML =
    '<option value="">（從已收集的語句中選一個）</option>';

  const pool = [...collectedLove, ...collectedCourage];
  const seen = new Set();
  pool.forEach((text) => {
    if (!seen.has(text)) {
      seen.add(text);
      const opt = document.createElement("option");
      opt.value = text;
      opt.textContent = text;
      bossPhraseSelect.appendChild(opt);
    }
  });

  if (pool.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent =
      "目前背包裡還沒有語句，也可以直接在下方自己打一句喔。";
    bossPhraseSelect.appendChild(opt);
  }
}

function getSelectedBossPhrase() {
  const custom = bossCustomPhrase.value.trim();
  if (custom) return custom;
  const v = bossPhraseSelect.value.trim();
  return v;
}

function setupBattle() {
  if (!currentHero) {
    battleResultBox.textContent = "請先在「選擇小勇者」頁面選一個角色。";
    return;
  }

  let monsterName = currentMonster;
  let config = null;

  if (isBossBattle) {
    monsterName = BOSS_NAME;
    config = null;
  } else {
    config = monstersConfig[monsterName] || { talent: "rock", forbidden: null };
  }

  battleHeroName.textContent = currentHero;
  if (currentHeroTalent === "any") {
    battleHeroTalent.textContent = "招牌拳：任意拳（魔王戰才發動特殊效果）";
  } else {
    battleHeroTalent.textContent = "招牌拳：" + fistToText(currentHeroTalent);
  }

  battleMonsterName.textContent = monsterName;

  if (isBossBattle) {
    bossBadEmotionLeft = bossEmotions.length;
    calmedBossEmotionKeys = [];
    bossEmotionBar.style.display = "block";
    bossPhraseArea.style.display = "block";
    bossInnerStoryBox.style.display = "none";
    renderBossEmotionState();
    refreshBossPhraseOptions();

    battleMonsterInfo.textContent =
      "魔王會出任何拳 ／ 弱點：需要被好好聽見的 6 種壞心情";

    const modeText =
      currentMode === "local2p"
        ? "最終魔王戰（同機雙人，可輪流出拳與說語句）"
        : "最終魔王戰";
    battleModeLabel.textContent = "模式：" + modeText;

    bearTip.textContent =
      "🧸 村長熊熊提示：黑霧巨龍有 6 個很大的壞情緒，需要你「先選一句話或自己想一句 + 出拳獲勝」，才能安撫一塊壞情緒。" +
      (currentMode === "local2p"
        ? " 可以輪流：一位出拳，一位說語句，也可以互換喔。"
        : "");

    battleResultBox.textContent =
      "這是最終關卡！\n1️⃣ 先在「對魔王說的話」區域選一句或輸入一句。\n2️⃣ 再出拳，如果獲勝 → 會安撫一種壞情緒並看到魔王的內心小劇場。";
  } else {
    bossEmotionBar.style.display = "none";
    bossPhraseArea.style.display = "none";
    bossInnerStoryBox.style.display = "none";

    const modeText =
      currentMode === "local2p"
        ? "一般關卡（同機雙人，可輪流出拳）"
        : "一般關卡";
    battleModeLabel.textContent = "模式：" + modeText;

    battleMonsterInfo.textContent =
      "天賦：" +
      fistToText(config.talent) +
      " ／ 弱點：" +
      (config.forbidden ? forbiddenText(config.forbidden) : "未知");

    bearTip.textContent =
      "🧸 村長熊熊提示：這隻魔物 " +
      (config.forbidden
        ? forbiddenText(config.forbidden)
        : "有點神祕，觀察牠的出拳吧！") +
      (currentMode === "local2p"
        ? " 可以讓玩家一、玩家二輪流出拳和說感受。"
        : "");

    battleResultBox.textContent = "請選擇要出的拳，看看能不能安撫牠的心情。";
  }

  highlightHeroTalentButton();
}

function randomMonsterMove(monsterName) {
  const all = ["rock", "paper", "scissors"];
  // 魔王：什麼拳都可能出
  if (monsterName === BOSS_NAME) {
    return all[Math.floor(Math.random() * all.length)];
  }
  const config = monstersConfig[monsterName] || { talent: "rock", forbidden: null };
  const allowed = config.forbidden
    ? all.filter((f) => f !== config.forbidden)
    : all;
  const pool = [...allowed, config.talent];
  return pool[Math.floor(Math.random() * pool.length)];
}

function decideResult(player, monster) {
  if (player === monster) return "draw";
  if (
    (player === "rock" && monster === "scissors") ||
    (player === "scissors" && monster === "paper") ||
    (player === "paper" && monster === "rock")
  )
    return "win";
  return "lose";
}

// 給按鈕用的出拳函式
function playerChoose(playerMove) {
  if (!currentHero) {
    battleResultBox.textContent = "請先選擇小勇者再進行戰鬥。";
    return;
  }

  let monsterName = isBossBattle ? BOSS_NAME : currentMonster;
  if (!monsterName) {
    battleResultBox.textContent =
      "請先從地圖選擇一隻魔物或等系統進入魔王戰。";
    return;
  }

  let currentPhrase = null;
  if (isBossBattle) {
    currentPhrase = getSelectedBossPhrase();
    if (!currentPhrase) {
      battleResultBox.textContent =
        "在魔王戰中，需要先在「對魔王說的話」區域選一句或自己輸入一句，再出拳，才算是完整的一回合喔！";
      return;
    }
  }

  const monsterMove = randomMonsterMove(monsterName);
  const result = decideResult(playerMove, monsterMove);

  let txt = `你出了 ${fistToText(playerMove)}，魔物出了 ${fistToText(
    monsterMove
  )}。\n`;

  if (result === "win") {
    let talentBonus = "";
    if (!isBossBattle && currentHeroTalent !== "any" && playerMove === currentHeroTalent) {
      talentBonus = "\n✨ 觸發小勇者招牌拳！這次的好心情效果加倍！";
    }
    if (isBossBattle && currentHero === "勇敢的村民") {
      talentBonus +=
        "\n🌾 勇敢的村民在魔王戰發動真本事：就算曾經害怕，也願意站出來面對！";
    }

    if (isBossBattle) {
      // 魔王戰：出拳獲勝 + 已選語句 → 安撫 1 段壞情緒（需要 6 次）
      bossBadEmotionLeft = Math.max(0, bossBadEmotionLeft - 1);

      // 取得下一個要被安撫的壞情緒
      let calmedEmotion = bossEmotions.find(
        (e) => !calmedBossEmotionKeys.includes(e.key)
      );
      if (calmedEmotion) {
        calmedBossEmotionKeys.push(calmedEmotion.key);
      }
      renderBossEmotionState();

      // 顯示內心小劇場
      if (calmedEmotion) {
        bossInnerStoryBox.style.display = "block";
        bossInnerStoryBox.innerHTML =
          `<b>【${calmedEmotion.name}】的內心小劇場：</b><br>` +
          calmedEmotion.story;
      }

      if (bossBadEmotionLeft <= 0) {
        bossDefeated = true;
        refreshBossStatus();
        battleResultBox.textContent =
          txt +
          `💬 你對黑霧巨龍說：「${currentPhrase}」\n` +
          "🌈 這是最後一次關鍵的對話，巨龍終於放下心中的委屈與憤怒，\n" +
          "黑霧慢慢散去，星星王國重新亮起溫暖的光芒！\n\n" +
          "👑 恭喜你完成最終魔王關卡！\n" +
          "（可以和孩子聊聊：「黑霧巨龍心裡，其實在難過什麼呢？」）" +
          talentBonus;
      } else {
        const usedText =
          "\n💬 你對魔王說：「" +
          currentPhrase +
          "」，黑霧好像真的變淡了一點……";

        battleResultBox.textContent =
          txt +
          "✅ 你成功在這回合安撫了魔王的一小塊壞情緒！\n" +
          `（還剩下 ${bossBadEmotionLeft} 個壞心情，需要慢慢照顧。）` +
          usedText +
          talentBonus;
      }
    } else {
      battleResultBox.textContent =
        txt +
        "✅ 你成功安撫了魔物的心情，牠露出了微笑，從黑霾中走出來了！" +
        talentBonus;
      onMonsterCalmed(currentStage);
    }
  } else if (result === "draw") {
    if (isBossBattle && currentPhrase) {
      battleResultBox.textContent =
        txt +
        `🤝 平手！雖然出拳結果沒有分出勝負，但你說的那句話「${currentPhrase}」已經悄悄留在巨龍心裡了。` +
        (currentMode === "local2p"
          ? "\n可以換另一位小勇者試試看，或一起想想下一句想說的話。"
          : "");
    } else {
      battleResultBox.textContent =
        txt + "🤝 平手！魔物還在猶豫中，再試一次看看吧。";
    }
  } else {
    let extra = "\n加油，你已經很勇敢了，可以再觀察一下牠的出拳和表情喔。";
    if (isBossBattle && currentHero === "勇敢的村民") {
      extra +=
        "\n🌾 勇敢的村民祕技：即使被打敗幾次，也不會被壞情緒打倒。";
    }
    if (currentMode === "local2p") {
      extra += "\n👥 可以換另一位小勇者出拳，或請對方替你說一句鼓勵自己的話。";
    }
    if (isBossBattle && currentPhrase) {
      extra =
        `\n即使這回合輸了，你剛剛說的那句話「${currentPhrase}」仍然在黑霧裡留下了一道縫。` +
        extra;
    }
    battleResultBox.textContent =
      txt + "💦 這回合你有點吃虧，魔物的壞情緒還沒被安撫。" + extra;
  }
}

// 出拳按鈕掛到全域（給 HTML onclick 用）
window.playerChoose = playerChoose;

// 🌦 雨過天晴娃娃：叫出已收集的語句，當作「恢復／強化」使用
function openRecovery() {
  if (!collectedLove.length && !collectedCourage.length) {
    battleResultBox.textContent =
      "🌦 雨過天晴娃娃：\n現在背包裡還沒有特別的語句。\n可以先多去安撫一般魔物，收集愛的力量語句與勇氣星星語句喔！";
    return;
  }

  const pool = [...collectedLove, ...collectedCourage];
  const sentence = pickRandom(pool);

  battleResultBox.textContent =
    "🌦 雨過天晴娃娃啟動！\n\n" +
    "你（或兩位小勇者）對自己／魔王說：\n「" +
    sentence +
    "」\n\n" +
    "💖 你的心情恢復了一些，更有力氣繼續面對壞情緒。\n" +
    (isBossBattle
      ? "下次出拳時，可以想像這句話跟著一起發光，幫助你更溫柔地安撫黑霧巨龍。"
      : "接下來再去挑戰下一隻魔物吧，慢慢來就好。");
}
window.openRecovery = openRecovery;

function backToMap() {
  if (bossDefeated) {
    alert("🎉 你已經打完魔王，可以回九宮格看看所有任務，或重新挑戰喜歡的關卡。");
  }
  goToMap();
}
window.backToMap = backToMap;

// 一般關卡：從地圖進入戰鬥
function startGameFromMap() {
  if (!currentHero) {
    alert("請先在「選擇小勇者」頁面選一個角色，再開始冒險！");
    return;
  }
  if (!currentStage || !currentMonster) {
    alert("請先在九宮格地圖中選擇一格要挑戰的關卡！");
    return;
  }
  isBossBattle = false;
  showPage("page-battle");
  const btn = document.querySelector('.nav-btn[data-target="page-battle"]');
  if (btn) {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }
  setupBattle();
}
window.startGameFromMap = startGameFromMap;

// 魔王戰：九宮格全部通關後自動啟動
function startBossBattle() {
  if (!currentHero) {
    alert("請先在「選擇小勇者」頁面選一個角色，再進入魔王戰！");
    return;
  }
  isBossBattle = true;
  currentMonster = BOSS_NAME;
  currentStage = null; // 不再對應九宮格
  bossBadEmotionLeft = bossEmotions.length;
  calmedBossEmotionKeys = [];
  showPage("page-battle");
  const btn = document.querySelector('.nav-btn[data-target="page-battle"]');
  if (btn) {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }
  setupBattle();
}
window.startBossBattle = startBossBattle;