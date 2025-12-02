// ===== 全域狀態 =====
let currentHeroKey = null;
let currentMonsterKey = null;
let heroHp = 3;
let heroHpMax = 3;
let monsterHp = 3;
let monsterHpMax = 3;

// ===== DOM 取得 =====
document.addEventListener("DOMContentLoaded", () => {
  const screens = {
    hero: document.getElementById("screen-hero"),
    map: document.getElementById("screen-map"),
    battle: document.getElementById("screen-battle"),
  };

  const modalBackdrop = document.getElementById("modal-backdrop");
  const fortuneModal = document.getElementById("fortuneModal");
  const fortuneText = document.getElementById("fortuneText");
  const fortuneOkBtn = document.getElementById("fortuneOkBtn");

  const resultModal = document.getElementById("resultModal");
  const resultText = document.getElementById("resultText");
  const resultOkBtn = document.getElementById("resultOkBtn");

  const battleLocationTitle = document.getElementById("battle-location-title");
  const battleIntro = document.getElementById("battle-intro");
  const heroNameLabel = document.getElementById("hero-name-label");
  const heroFistLabel = document.getElementById("hero-fist");
  const heroHpLabel = document.getElementById("hero-hp");
  const monsterNameLabel = document.getElementById("monster-name");
  const monsterEmotionLabel = document.getElementById("monster-emotion");
  const monsterTraitLabel = document.getElementById("monster-trait");
  const monsterHpLabel = document.getElementById("monster-hp");
  const battleLog = document.getElementById("battle-log");

  const backToMapBtn = document.getElementById("backToMapBtn");
  const rpsButtons = document.querySelectorAll(".rps-btn");
  const useStarBtn = document.getElementById("useStarBtn");
  const useLoveBtn = document.getElementById("useLoveBtn");

  // ===== 資料：勇者、魔物、占卜 =====
  const heroes = {
    warrior: {
      name: "勇敢的戰士",
      fist: "✊",
      description: "出石頭獲勝時，安撫效果加倍。",
    },
    mage: {
      name: "創意法師",
      fist: "✌️",
      description: "出剪刀獲勝時，可以多說一句創意安撫語。",
    },
    priest: {
      name: "溫柔牧師",
      fist: "🖐",
      description: "出布獲勝時，自己也會回復一點好心情。",
    },
    villager: {
      name: "勇敢的村民",
      fist: "❔",
      description: "雖然沒有固定拳，但不會被壞情緒打敗。",
    },
  };

  // 每個地點對應一隻魔物；之後可以擴充成 10 隻、12 隻
  const monsters = {
    meadow: {
      name: "怒炎小獸",
      emotion: "生氣",
      trait: "容易一秒爆炸，但其實只是覺得不被理解。",
      hpMax: 3,
    },
    forest: {
      name: "懶懶樹精",
      emotion: "沒動力",
      trait: "看起來很頹廢，其實是在偷偷存能量。",
      hpMax: 3,
    },
    cave: {
      name: "怕黑小影",
      emotion: "害怕",
      trait: "什麼都覺得好可怕，需要有人陪一起面對。",
      hpMax: 3,
    },
    lake: {
      name: "哭哭水靈",
      emotion: "難過",
      trait: "眼淚很多，但哭完其實會變得更輕鬆。",
      hpMax: 3,
    },
    graveyard: {
      name: "寂寞骷髏",
      emotion: "孤單",
      trait: "看起來冷冷的，其實超想交朋友。",
      hpMax: 3,
    },
    witch: {
      name: "情緒女巫",
      emotion: "混亂",
      trait: "情緒一下高一下低，需要有人幫忙理一理。",
      hpMax: 4,
    },
    mountain: {
      name: "壓力石獸",
      emotion: "壓力大",
      trait: "背了太多石頭，忘記怎麼放鬆。",
      hpMax: 4,
    },
    boss: {
      name: "情緒暴走龍",
      emotion: "所有壞情緒",
      trait: "把所有魔物的壞情緒都吞進肚子裡，快要爆炸。",
      hpMax: 6,
      isBoss: true,
    },
  };

  const fortunes = [
    "今天的你，擁有溫柔治癒力，壞情緒看到你都會慢慢軟化～",
    "你的笑容像星星一樣亮，能照亮魔物心裡最黑暗的角落。",
    "只要你願意傾聽，魔物也會慢慢說出它真正的心事。",
    "你今天的勇氣值滿滿，連魔王都會對你刮目相看！",
  ];

  const starSentences = [
    "「謝謝你願意出現，我想聽聽你怎麼了。」",
    "「我看到你在努力撐著，一定很辛苦吧。」",
    "「就算現在心情不好，我也會陪你慢慢好起來。」",
  ];

  const loveSentences = [
    "「不管你現在是什麼情緒，我都還是喜歡你。」",
    "「你可以生氣、難過，但不需要一個人承受。」",
    "「我們一起深呼吸三次，好嗎？」",
  ];

  // ===== 小工具 =====
  function showScreen(name) {
    Object.values(screens).forEach((el) => el.classList.add("hidden"));
    if (screens[name]) {
      screens[name].classList.remove("hidden");
    }
  }

  function openModal(modalEl) {
    modalEl.classList.remove("hidden");
    modalBackdrop.classList.remove("hidden");
  }

  function closeModal(modalEl) {
    modalEl.classList.add("hidden");
    // 若沒有其他 modal 打開，就關掉背景
    const anyVisibleModal = [fortuneModal, resultModal].some(
      (m) => !m.classList.contains("hidden")
    );
    if (!anyVisibleModal) {
      modalBackdrop.classList.add("hidden");
    }
  }

  function setHearts(current, max, icon) {
    let str = "";
    for (let i = 0; i < current; i++) str += icon;
    return str;
  }

  function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function updateBattleUi() {
    const hero = heroes[currentHeroKey];
    if (!hero) return;

    heroNameLabel.textContent = hero.name;
    heroFistLabel.textContent = hero.fist;
    heroHpLabel.textContent = setHearts(heroHp, heroHpMax, "❤️");
    monsterHpLabel.textContent = setHearts(monsterHp, monsterHpMax, "💔");
  }

  function startBattle(locationKey) {
    const hero = heroes[currentHeroKey];
    const m = monsters[locationKey];
    if (!hero || !m) return;

    currentMonsterKey = locationKey;
    heroHpMax = 3;
    heroHp = heroHpMax;
    monsterHpMax = m.hpMax;
    monsterHp = monsterHpMax;

    battleLocationTitle.textContent = m.isBoss
      ? "魔王城 · 最終決戰"
      : `${locationNameMap[locationKey]}遭遇戰`;

    monsterNameLabel.textContent = m.name;
    monsterEmotionLabel.textContent = m.emotion;
    monsterTraitLabel.textContent = m.trait;

    battleIntro.innerHTML = `你遇見了 <span id="monster-name">${m.name}</span>（情緒：<span id="monster-emotion">${m.emotion}</span>）`;
    battleLog.textContent = "小勇者，先選一個拳吧～";

    updateBattleUi();
    showScreen("battle");
  }

  const locationNameMap = {
    village: "新手村",
    meadow: "草原",
    forest: "森林",
    cave: "洞窟",
    lake: "湖畔",
    graveyard: "墓地",
    witch: "女巫小屋",
    mountain: "山頂",
    boss: "魔王城",
  };

  function resultMessage(win, isBoss) {
    if (win) {
      if (isBoss) {
        return "你用好多句真心的話，讓情緒暴走龍終於鬆了一口氣，慢慢變成溫柔的守護龍。";
      }
      return "這隻魔物的壞情緒被你安撫了，牠小聲說了聲「謝謝」就變回可愛的夥伴～";
    } else {
      return "你累了，需要回到地圖休息一下，下次再來陪牠聊聊也可以。";
    }
  }

  // ===== 事件：選勇者 → 熊熊占卜 =====
  const heroCards = document.querySelectorAll(".hero-card");
  heroCards.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.hero;
      currentHeroKey = key;

      // 隨機一句占卜
      fortuneText.textContent = randomPick(fortunes);
      openModal(fortuneModal);
    });
  });

  fortuneOkBtn.addEventListener("click", () => {
    closeModal(fortuneModal);
    showScreen("map");
  });

  // 點擊背景不關掉熊熊占卜，避免小孩亂點
  modalBackdrop.addEventListener("click", () => {
    // 不做事，讓孩子一定要按按鈕
  });

  // ===== 事件：點地圖格子 =====
  const mapCells = document.querySelectorAll(".map-cell");
  mapCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const loc = cell.dataset.location;

      if (loc === "village") {
        // 新手村只是提示，不進戰鬥
        resultText.textContent =
          "你在新手村整理裝備、做做伸展，等等再出發去安撫魔物～";
        resultOkBtn.textContent = "準備好了！";
        openModal(resultModal);
        return;
      }

      // 其他地點：進戰鬥
      startBattle(loc);
    });
  });

  // 結果視窗按鈕：回到地圖
  resultOkBtn.addEventListener("click", () => {
    closeModal(resultModal);
    showScreen("map");
  });

  // ===== 事件：回到地圖 =====
  backToMapBtn.addEventListener("click", () => {
    showScreen("map");
  });

  // ===== 出拳判定 =====
  function rpsResult(player, enemy) {
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

  function enemyRandomHand() {
    const list = ["rock", "scissors", "paper"];
    return list[Math.floor(Math.random() * list.length)];
  }

  function handToText(hand) {
    switch (hand) {
      case "rock":
        return "✊ 石頭";
      case "scissors":
        return "✌️ 剪刀";
      case "paper":
        return "🖐 布";
      default:
        return "";
    }
  }

  rpsButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!currentMonsterKey || !currentHeroKey) return;

      const hero = heroes[currentHeroKey];
      const m = monsters[currentMonsterKey];

      const playerHand = btn.dataset.hand;
      const enemyHand = enemyRandomHand();
      const result = rpsResult(playerHand, enemyHand);

      if (result === "win") {
        // 勝利：扣魔物心情
        monsterHp = Math.max(0, monsterHp - 1);

        let extra = "";
        if (
          (currentHeroKey === "warrior" && playerHand === "rock") ||
          (currentHeroKey === "mage" && playerHand === "scissors") ||
          (currentHeroKey === "priest" && playerHand === "paper")
        ) {
          // 勇者天賦觸發：多扣 1
          if (monsterHp > 0) {
            monsterHp = Math.max(0, monsterHp - 1);
            extra = "（你的職業天賦發動，安撫效果加倍！）";
          }
        }

        // 牧師勝利時自己回 1
        if (currentHeroKey === "priest" && result === "win" && heroHp < heroHpMax) {
          heroHp += 1;
        }

        battleLog.textContent =
          `你出了 ${handToText(playerHand)}，魔物出了 ${handToText(
            enemyHand
          )}，` + `魔物的壞情緒被安撫了一點點！${extra}`;
      } else if (result === "lose") {
        if (currentHeroKey !== "villager") {
          heroHp = Math.max(0, heroHp - 1);
        }
        battleLog.textContent =
          `你出了 ${handToText(playerHand)}，魔物出了 ${handToText(
            enemyHand
          )}，` +
          `這回合魔物的情緒有點失控，你也感到有點累了……`;
      } else {
        battleLog.textContent =
          `你出了 ${handToText(playerHand)}，魔物也出了 ${handToText(
            enemyHand
          )}，` + `彼此還在觀察對方心情中。`;
      }

      updateBattleUi();

      // 判斷勝負
      const mData = monsters[currentMonsterKey];
      if (monsterHp <= 0) {
        resultText.textContent = resultMessage(true, !!mData.isBoss);
        resultOkBtn.textContent = "回到地圖";
        openModal(resultModal);
      } else if (heroHp <= 0) {
        resultText.textContent = resultMessage(false, !!mData.isBoss);
        resultOkBtn.textContent = "回到地圖";
        openModal(resultModal);
      }
    });
  });

  // ===== 勇氣星星 & 愛的力量 =====
  useStarBtn.addEventListener("click", () => {
    if (!currentMonsterKey) return;
    const sentence = randomPick(starSentences);
    if (monsterHp > 0) {
      monsterHp = Math.max(0, monsterHp - 1);
    }
    battleLog.textContent =
      `你使用了勇氣星星語句：${sentence} 魔物的壞情緒安靜了一點。`;
    updateBattleUi();

    const mData = monsters[currentMonsterKey];
    if (monsterHp <= 0) {
      resultText.textContent = resultMessage(true, !!mData.isBoss);
      resultOkBtn.textContent = "回到地圖";
      openModal(resultModal);
    }
  });

  useLoveBtn.addEventListener("click", () => {
    if (!currentMonsterKey) return;
    const sentence = randomPick(loveSentences);
    if (heroHp < heroHpMax) heroHp += 1;
    battleLog.textContent =
      `你使用了愛的力量語句：${sentence} 你和魔物都一起慢慢放鬆。`;
    updateBattleUi();
  });

  // 初始畫面：選勇者
  showScreen("hero");
});