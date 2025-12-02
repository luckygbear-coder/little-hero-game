// ===== 全域狀態 =====
let currentHeroKey = null;
let currentMonsterKey = null;
let heroHp = 3;
let heroHpMax = 3;
let monsterHp = 3;
let monsterHpMax = 3;
let bossPhaseIndex = 0; // 魔王階段索引

document.addEventListener("DOMContentLoaded", () => {
  // ===== 畫面 DOM =====
  const screens = {
    hero: document.getElementById("screen-hero"),
    map: document.getElementById("screen-map"),
    battle: document.getElementById("screen-battle"),
  };

  // Modal & 占卜 / 結果
  const modalBackdrop = document.getElementById("modal-backdrop");
  const fortuneModal = document.getElementById("fortuneModal");
  const fortuneText = document.getElementById("fortuneText");
  const fortuneOkBtn = document.getElementById("fortuneOkBtn");

  const resultModal = document.getElementById("resultModal");
  const resultText = document.getElementById("resultText");
  const resultOkBtn = document.getElementById("resultOkBtn");

  // 戰鬥 UI
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

  // ===== 資料：勇者設定 =====
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

  // ===== 資料：地點名稱 =====
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

  // ===== 資料：魔物（含天賦拳與弱點拳） =====
  // talentHand：牠最常出的拳；weakHand：被打到會特別脆弱的拳
  const monsters = {
    meadow: {
      name: "怒炎小獸",
      emotion: "生氣",
      trait: "容易一秒爆炸，但其實只是覺得不被理解。",
      hpMax: 3,
      talentHand: "rock", // ✊ 爆炸型
      weakHand: "paper",  // 🖐 柔軟讓牠熄火
    },
    forest: {
      name: "懶懶樹精",
      emotion: "沒動力",
      trait: "看起來很頹廢，其實是在偷偷存能量。",
      hpMax: 3,
      talentHand: "paper", // 🖐 用葉子遮住自己
      weakHand: "rock",    // ✊ 穩重力量讓牠安心
    },
    cave: {
      name: "怕黑小影",
      emotion: "害怕",
      trait: "什麼都覺得好可怕，需要有人陪一起面對。",
      hpMax: 3,
      talentHand: "rock",    // ✊ 縮成一團
      weakHand: "scissors",  // ✌️ 輕盈手勢讓牠放鬆
    },
    lake: {
      name: "哭哭水靈",
      emotion: "難過",
      trait: "眼淚很多，但哭完其實會變得更輕鬆。",
      hpMax: 3,
      talentHand: "paper",   // 🖐 水花一片
      weakHand: "scissors",  // ✌️ 溫柔剪開煩惱
    },
    graveyard: {
      name: "寂寞骷髏",
      emotion: "孤單",
      trait: "看起來冷冷的，其實超想交朋友。",
      hpMax: 3,
      talentHand: "rock", // ✊ 敲敲骨頭假裝堅強
      weakHand: "paper",  // 🖐 像擁抱一樣的手勢
    },
    witch: {
      name: "情緒女巫",
      emotion: "混亂",
      trait: "情緒一下高一下低，需要有人幫忙理一理。",
      hpMax: 4,
      talentHand: null, // 三拳平均亂出
      weakHand: null,
    },
    mountain: {
      name: "壓力石獸",
      emotion: "壓力大",
      trait: "背了太多石頭，忘記怎麼放鬆。",
      hpMax: 4,
      talentHand: "rock", // ✊ 撐住全部的重量
      weakHand: "paper",  // 🖐 像放下石頭的動作
    },
    boss: {
      name: "情緒暴走龍",
      isBoss: true,
      phases: [
        {
          emotion: "生氣",
          trait: "「為什麼都不懂我！」牠大吼大叫，其實是想被看見。",
          hp: 1,
        },
        {
          emotion: "害怕",
          trait: "「如果我失敗了怎麼辦？」牠的翅膀微微發抖。",
          hp: 1,
        },
        {
          emotion: "嫉妒",
          trait: "「為什麼別人都比我厲害？」牠的眼神酸酸的。",
          hp: 1,
        },
        {
          emotion: "孤單",
          trait: "「其實我一個朋友都沒有……」牠小聲地說。",
          hp: 1,
        },
        {
          emotion: "羞愧",
          trait: "「我這樣好丟臉……你一定會討厭我。」牠的頭低得很低。",
          hp: 1,
        },
        {
          emotion: "失望",
          trait: "「我好像怎麼做都不會成功。」牠的火焰快要熄滅了。",
          hp: 1,
        },
      ],
    },
  };

  // ===== 資料：塔羅占卜牌組 =====
  const tarotDeck = [
    {
      name: "太陽 The Sun",
      keyword: "自信・喜悅・勇敢表現自己",
      meaning:
        "今天很適合大聲笑、盡情玩、把自己最亮的一面展現出來。就算有一點點緊張，你也可以一邊怕一邊做。",
      reminder:
        "熊熊村長提醒你：如果覺得心裡毛毛的，先對自己笑一下，對自己說：「我可以慢慢來，不需要一次做到完美。」",
    },
    {
      name: "星星 The Star",
      keyword: "希望・療癒・重新出發",
      meaning:
        "就算前幾天有不順利的事情，今天仍然是一個新的開始。你的心像星空一樣，可以慢慢被溫柔的光填滿。",
      reminder:
        "熊熊村長提醒你：當你覺得沮喪時，可以想一個「讓你很期待的小事情」，那就是你的星星任務。",
    },
    {
      name: "力量 Strength",
      keyword: "溫柔的堅定・和情緒做朋友",
      meaning:
        "真正的勇敢不是把情緒打倒，而是願意陪牠、摸摸牠的頭，說：「我知道你在這裡。」",
      reminder:
        "熊熊村長提醒你：當你很生氣或很害怕時，可以先深呼吸三次，對自己的情緒說：「謝謝你來提醒我。」",
    },
    {
      name: "節制 Temperance",
      keyword: "平衡・適量・慢慢來",
      meaning:
        "今天很適合「一點一點」地完成事情，不需要一次做很多。玩樂、休息、努力，都可以有剛剛好的比例。",
      reminder:
        "熊熊村長提醒你：如果覺得好像要爆炸了，可以先停一下、喝口水、伸伸懶腰，再繼續就好。",
    },
    {
      name: "戀人 The Lovers",
      keyword: "連結・選擇・互相支持",
      meaning:
        "你不是一個人。身邊一定有願意聽你說話、陪你一起做選擇的人。一起分享心情，會讓路變得比較不孤單。",
      reminder:
        "熊熊村長提醒你：如果有讓你困惑的事情，不一定要自己悶著想，可以找信任的大人或朋友聊聊。",
    },
    {
      name: "隱者 The Hermit",
      keyword: "獨處・思考・聽見自己",
      meaning:
        "今天很適合留一點安靜的時間給自己，好好問問心裡：「我現在到底在意的是什麼？」",
      reminder:
        "熊熊村長提醒你：一個人安靜一下不是不開心，而是在整理心情。你可以寫寫字、畫畫，幫自己把想法放到紙上。",
    },
    {
      name: "世界 The World",
      keyword: "完成・整合・新的旅程",
      meaning:
        "你已經走了很長一段路，學會了很多事情。就算不完美，你也已經比以前更厲害了。",
      reminder:
        "熊熊村長提醒你：別急著只看自己做不到的部分，也記得拍拍自己的肩膀，說：「我真的已經很努力了。」",
    },
    {
      name: "正義 Justice",
      keyword: "誠實・公平・為自己負責",
      meaning:
        "今天很適合誠實面對自己的感受和行為。承認錯誤不是失敗，而是讓自己變得更穩固的一步。",
      reminder:
        "熊熊村長提醒你：如果做錯事，先對自己說：「我願意學會做得更好。」再去說一聲對不起，就是很大的勇氣。",
    },
  ];

  // 勇氣星星 & 愛的力量語句
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
    if (screens[name]) screens[name].classList.remove("hidden");
  }

  function openModal(modalEl) {
    modalEl.classList.remove("hidden");
    modalBackdrop.classList.remove("hidden");
  }

  function closeModal(modalEl) {
    modalEl.classList.add("hidden");
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

  function resultMessage(win, isBoss) {
    if (win) {
      if (isBoss) {
        return "你一層一層地安撫了魔王心中的生氣、害怕、嫉妒、孤單、羞愧和失望。情緒暴走龍慢慢收起爪子，變成守護星星王國的溫柔巨龍。";
      }
      return "這隻魔物的壞情緒被你安撫了，牠小聲說了聲「謝謝」，眼睛裡出現了一點亮亮的光。";
    } else {
      return "你累了，需要回到地圖休息一下。情緒不一定要一次就安撫成功，下次再來陪牠聊聊也可以。";
    }
  }

  // ===== 塔羅占卜：抽牌＋顯示到彈窗 =====
  function drawTarot() {
    const card = randomPick(tarotDeck);
    fortuneText.innerHTML = `
      🌟 <strong>今天抽到的塔羅是：${card.name}</strong><br><br>
      關鍵字：${card.keyword}<br><br>
      ${card.meaning}<br><br>
      🐻 <em>${card.reminder}</em>
    `;
    openModal(fortuneModal);
  }

  // ===== 啟動戰鬥 =====
  function startBattle(locationKey) {
    const hero = heroes[currentHeroKey];
    const m = monsters[locationKey];
    if (!hero || !m) return;

    currentMonsterKey = locationKey;
    heroHpMax = 3;
    heroHp = heroHpMax;

    // 一般魔物 vs 魔王
    if (m.isBoss && Array.isArray(m.phases) && m.phases.length > 0) {
      bossPhaseIndex = 0;
      const phase = m.phases[bossPhaseIndex];
      monsterHpMax = phase.hp;
      monsterHp = monsterHpMax;

      battleLocationTitle.textContent = "魔王城 · 多重情緒決戰";
      monsterNameLabel.textContent = m.name;
      monsterEmotionLabel.textContent = phase.emotion;
      monsterTraitLabel.textContent = phase.trait;
      battleIntro.innerHTML = `你遇見了 <span>${m.name}</span>，此刻牠的心被「${phase.emotion}」佔據。`;
    } else {
      monsterHpMax = m.hpMax;
      monsterHp = monsterHpMax;
      battleLocationTitle.textContent = `${locationNameMap[locationKey]}遭遇戰`;
      monsterNameLabel.textContent = m.name;
      monsterEmotionLabel.textContent = m.emotion;
      monsterTraitLabel.textContent = m.trait;
      battleIntro.innerHTML = `你遇見了 <span>${m.name}</span>（情緒：<span>${m.emotion}</span>）。`;
    }

    battleLog.textContent = "小勇者，先選一個拳吧～";
    updateBattleUi();
    showScreen("battle");
  }

  // 魔王換下一階段情緒
  function advanceBossPhase(monster) {
    if (!monster.isBoss || !Array.isArray(monster.phases)) return false;
    if (bossPhaseIndex >= monster.phases.length - 1) return false;

    const prev = monster.phases[bossPhaseIndex];
    bossPhaseIndex += 1;
    const next = monster.phases[bossPhaseIndex];
    monsterHpMax = next.hp;
    monsterHp = monsterHpMax;
    monsterEmotionLabel.textContent = next.emotion;
    monsterTraitLabel.textContent = next.trait;
    monsterHpLabel.textContent = setHearts(monsterHp, monsterHpMax, "💔");

    battleLog.textContent = `你成功安撫了「${prev.emotion}」這一層情緒，接下來魔王露出了「${next.emotion}」的心情……`;
    return true;
  }

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

  // 魔物出拳：如果有天賦拳，會比較常出那一拳
  function enemyRandomHand() {
    const base = ["rock", "scissors", "paper"];
    const m = monsters[currentMonsterKey];
    if (m && m.talentHand && base.includes(m.talentHand)) {
      const others = base.filter((h) => h !== m.talentHand);
      const pool = [m.talentHand, m.talentHand, others[0], others[1]]; // 50% 天賦拳
      return randomPick(pool);
    }
    return randomPick(base);
  }

  // ===== 事件：選勇者 → 抽塔羅占卜 =====
  const heroCards = document.querySelectorAll(".hero-card");
  heroCards.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.hero;
      currentHeroKey = key;
      drawTarot();
    });
  });

  fortuneOkBtn.addEventListener("click", () => {
    closeModal(fortuneModal);
    showScreen("map");
  });

  // 避免小孩亂點關掉，占卜只能按按鈕關
  modalBackdrop.addEventListener("click", () => {
    // 不做事
  });

// ===== 事件：點地圖格子 =====
const mapCells = document.querySelectorAll(".map-cell");
mapCells.forEach((cell) => {
  cell.addEventListener("click", () => {
    const loc = cell.dataset.location;

    // === 新手村：休息 ===
    if (loc === "village") {
      resultText.textContent =
        "你在新手村做伸展、補充水分、跟熊熊打招呼，休息一下再出發～";
      resultOkBtn.textContent = "出發！";
      openModal(resultModal);
      return;
    }

    // === 女巫小屋：必定抽塔羅，無戰鬥 ===
    if (loc === "witch") {
      drawTarot(); // 直接抽塔羅
      return;
    }

    // === 魔王城：打魔王 ===
    if (loc === "boss") {
      startBattle(loc);
      return;
    }

    // === 一般地點：遇魔物→猜拳戰鬥 ===
    startBattle(loc);
  });
});

  resultOkBtn.addEventListener("click", () => {
    closeModal(resultModal);
    showScreen("map");
  });

  backToMapBtn.addEventListener("click", () => {
    showScreen("map");
  });

  // ===== 猜拳按鈕 =====
  rpsButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!currentMonsterKey || !currentHeroKey) return;

      const hero = heroes[currentHeroKey];
      const m = monsters[currentMonsterKey];
      const playerHand = btn.dataset.hand;
      const enemyHand = enemyRandomHand();
      let result = rpsResult(playerHand, enemyHand);

      if (result === "win") {
        // 先扣 1 點
        monsterHp = Math.max(0, monsterHp - 1);
        let extraText = "";

        // 打中魔物弱點：再額外扣 1
        if (m.weakHand && m.weakHand === playerHand && monsterHp > 0) {
          monsterHp = Math.max(0, monsterHp - 1);
          extraText += "你剛好打中牠的弱點，壞情緒縮小得更快！";
        }

        // 勇者天賦：出對應拳再強化安撫
        if (
          (currentHeroKey === "warrior" && playerHand === "rock") ||
          (currentHeroKey === "mage" && playerHand === "scissors") ||
          (currentHeroKey === "priest" && playerHand === "paper")
        ) {
          if (monsterHp > 0) {
            monsterHp = Math.max(0, monsterHp - 1);
            extraText += " 你的職業天賦發動，安撫效果加倍！";
          }
        }

        // 牧師勝利時，自己回 1
        if (currentHeroKey === "priest" && heroHp < heroHpMax) {
          heroHp += 1;
          extraText += " 你的溫柔也讓自己的心情變得更穩定。";
        }

        battleLog.textContent =
          `你出了 ${handToText(playerHand)}，魔物出了 ${handToText(
            enemyHand
          )}。` +
          "你的好心情成功傳達，牠的壞情緒慢慢變小了。" +
          (extraText ? " " + extraText : "");
      } else if (result === "lose") {
        if (currentHeroKey !== "villager") {
          heroHp = Math.max(0, heroHp - 1);
        }
        battleLog.textContent =
          `你出了 ${handToText(playerHand)}，魔物出了 ${handToText(
            enemyHand
          )}。` +
          "這回合有點小挫折，你的心情也跟著有點累了……但你依然很勇敢。";
      } else {
        battleLog.textContent =
          `你出了 ${handToText(playerHand)}，魔物也出了 ${handToText(
            enemyHand
          )}，` + "彼此還在觀察對方的心情。";
      }

      updateBattleUi();

      // 勝負判定
      if (monsterHp <= 0) {
        if (m.isBoss) {
          // 多階段魔王：若還有下一階段就切換
          const advanced = advanceBossPhase(m);
          if (!advanced) {
            // 最終階段結束
            resultText.textContent = resultMessage(true, true);
            resultOkBtn.textContent = "回到地圖";
            openModal(resultModal);
          }
        } else {
          resultText.textContent = resultMessage(true, false);
          resultOkBtn.textContent = "回到地圖";
          openModal(resultModal);
        }
      } else if (heroHp <= 0) {
        resultText.textContent = resultMessage(false, !!m.isBoss);
        resultOkBtn.textContent = "回到地圖";
        openModal(resultModal);
      }
    });
  });

  // ===== 勇氣星星 & 愛的力量 =====
  useStarBtn.addEventListener("click", () => {
    if (!currentMonsterKey) return;
    const m = monsters[currentMonsterKey];
    const sentence = randomPick(starSentences);
    if (monsterHp > 0) {
      monsterHp = Math.max(0, monsterHp - 1);
    }
    battleLog.textContent =
      `你使用了勇氣星星語句：${sentence} 魔物的壞情緒安靜了一點。`;
    updateBattleUi();

    if (monsterHp <= 0) {
      if (m.isBoss) {
        const advanced = advanceBossPhase(m);
        if (!advanced) {
          resultText.textContent = resultMessage(true, true);
          resultOkBtn.textContent = "回到地圖";
          openModal(resultModal);
        }
      } else {
        resultText.textContent = resultMessage(true, false);
        resultOkBtn.textContent = "回到地圖";
        openModal(resultModal);
      }
    }
  });

  useLoveBtn.addEventListener("click", () => {
    if (!currentMonsterKey) return;
    const sentence = randomPick(loveSentences);
    if (heroHp < heroHpMax) heroHp += 1;
    battleLog.textContent =
      `你使用了愛的力量語句：${sentence} 你和魔物都一起慢慢放鬆了一點。`;
    updateBattleUi();
  });

  // 初始畫面
  showScreen("hero");
});