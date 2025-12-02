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

  // ===== 勇者設定 =====
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

  // ===== 地點名稱 =====
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

  // ===== 魔物（含天賦拳與弱點拳） =====
  // talentHand：牠最常出的拳；weakHand：被打到會特別脆弱的拳
  const monsters = {
    meadow: {
      name: "怒炎小獸",
      emotion: "生氣",
      trait: "容易一秒爆炸，但其實只是覺得不被理解。",
      hpMax: 3,
      talentHand: "rock", // ✊ 爆炸型
      weakHand: "paper", // 🖐 柔軟讓牠熄火
    },
    forest: {
      name: "懶懶樹精",
      emotion: "沒動力",
      trait: "看起來很頹廢，其實是在偷偷存能量。",
      hpMax: 3,
      talentHand: "paper", // 🖐 用葉子遮住自己
      weakHand: "rock", // ✊ 穩重力量讓牠安心
    },
    cave: {
      name: "怕黑小影",
      emotion: "害怕",
      trait: "什麼都覺得好可怕，需要有人陪一起面對。",
      hpMax: 3,
      talentHand: "rock", // ✊ 縮成一團
      weakHand: "scissors", // ✌️ 輕盈手勢讓牠放鬆
    },
    lake: {
      name: "哭哭水靈",
      emotion: "難過",
      trait: "眼淚很多，但哭完其實會變得更輕鬆。",
      hpMax: 3,
      talentHand: "paper", // 🖐 水花一片
      weakHand: "scissors", // ✌️ 溫柔剪開煩惱
    },
    graveyard: {
      name: "寂寞骷髏",
      emotion: "孤單",
      trait: "看起來冷冷的，其實超想交朋友。",
      hpMax: 3,
      talentHand: "rock", // ✊ 敲敲骨頭假裝堅強
      weakHand: "paper", // 🖐 像擁抱一樣的手勢
    },
    witch: {
      // 不進戰鬥，用於敘述用
      name: "女巫小屋",
      emotion: "占卜",
      trait: "神祕的塔羅桌，等著幫你看今天的心情任務。",
      hpMax: 0,
      talentHand: null,
      weakHand: null,
    },
    mountain: {
      name: "壓力石獸",
      emotion: "壓力大",
      trait: "背了太多石頭，忘記怎麼放鬆。",
      hpMax: 4,
      talentHand: "rock", // ✊ 撐住全部的重量
      weakHand: "paper", // 🖐 像放下石頭的動作
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

  // ===== 塔羅牌 22 張（大秘儀簡化兒童版） =====
  const tarotDeck = [
    {
      name: "愚者 The Fool",
      keyword: "冒險・新開始",
      meaning:
        "今天很適合嘗試一件從來沒做過的小事，即使有點笨拙也沒關係。",
      reminder:
        "熊熊村長提醒你：你可以一邊怕一邊做，不用等到「完全不害怕」才出發。",
      mission: "試著做一件平常會猶豫的事，比如主動跟同學打招呼。",
    },
    {
      name: "魔術師 The Magician",
      keyword: "專注・行動力",
      meaning:
        "你手上的工具已經足夠，可以先動手試試看，而不是一直擔心不完美。",
      reminder:
        "熊熊村長提醒你：先做一點點，比一直想像完美還更有魔法。",
      mission: "從今天的待辦裡選一件小事，真的去完成它。",
    },
    {
      name: "女祭司 The High Priestess",
      keyword: "直覺・內心聲音",
      meaning: "你心裡其實已經有答案，只是還沒勇敢說出來。",
      reminder:
        "熊熊村長提醒你：可以先在心裡對自己說一次你真正想要的，再慢慢找機會表達。",
      mission: "找一個安靜的時間，把現在最重要的心情寫在紙上。",
    },
    {
      name: "皇后 The Empress",
      keyword: "照顧・享受・溫柔",
      meaning: "你值得被好好照顧，也值得好好款待自己一下。",
      reminder:
        "熊熊村長提醒你：照顧自己不是任性，而是讓你有力氣繼續照顧別人的根本。",
      mission: "今天幫自己安排一個小小享受，比如聽喜歡的歌或吃點好吃的。",
    },
    {
      name: "皇帝 The Emperor",
      keyword: "界線・保護・穩定",
      meaning:
        "你有權利說「我不要」或「我需要休息」，這也是一種勇敢。",
      reminder:
        "熊熊村長提醒你：溫柔不代表沒有底線，你可以好好說出自己的界線。",
      mission: "練習對一件讓你不舒服的小事，說出自己的感受。",
    },
    {
      name: "教宗 The Hierophant",
      keyword: "學習・傳承・請教",
      meaning: "遇到不懂的事情，可以請教懂的人，而不是自己悶在心裡。",
      reminder:
        "熊熊村長提醒你：問問題不是丟臉，而是變厲害最快的捷徑。",
      mission: "今天主動問一個問題，向你信任的人請教。",
    },
    {
      name: "戀人 The Lovers",
      keyword: "連結・選擇・互相支持",
      meaning:
        "只要你願意開口，身邊是有人願意站在你這邊的，不用獨自承受。",
      reminder:
        "熊熊村長提醒你：你不需要每個人都喜歡你，只要好好珍惜願意理解你的人就夠了。",
      mission: "對一個你在乎的人說一句真心的感謝或喜歡。",
    },
    {
      name: "戰車 The Chariot",
      keyword: "前進・決心・突破",
      meaning:
        "你已經準備好往前走一步，即使路上有小石頭，也擋不住你的輪子。",
      reminder:
        "熊熊村長提醒你：不要因為擔心摔倒就不前進，小步前進也是前進。",
      mission: "為一個目標做一件「很小但具體」的行動。",
    },
    {
      name: "力量 Strength",
      keyword: "溫柔的堅定・情緒陪伴",
      meaning: "你不用把情緒打倒，只要願意抱著它一起慢慢走就好。",
      reminder:
        "熊熊村長提醒你：當你對自己溫柔一點，你就會發現自己比想像中更有力量。",
      mission: "當你今天有情緒時，不罵自己，只說一句「我懂，我在。」",
    },
    {
      name: "隱者 The Hermit",
      keyword: "獨處・思考・整理",
      meaning: "暫時退後一步，讓自己安靜一下，是很重要的充電方式。",
      reminder:
        "熊熊村長提醒你：你可以有自己的小角落，那裡是只屬於你和你心情的秘密基地。",
      mission: "留 5～10 分鐘給自己一個安靜時間，可以寫字或發呆。",
    },
    {
      name: "命運之輪 Wheel of Fortune",
      keyword: "變化・轉機・流動",
      meaning: "事情不會一直都不好，也不會一直都完美，一切都在慢慢轉動。",
      reminder:
        "熊熊村長提醒你：現在的不順利，有可能是在為下一個轉機鋪路。",
      mission: "回想一件以前覺得很糟、後來卻變成幫助你的事情。",
    },
    {
      name: "正義 Justice",
      keyword: "誠實・公平・為自己負責",
      meaning: "承認錯誤、面對結果，其實是一種很帥氣的行為。",
      reminder:
        "熊熊村長提醒你：你可以不完美，但願意負責就是很大的勇敢。",
      mission: "如果今天有做不好的地方，試著說一句「下次我會怎麼做得更好」。",
    },
    {
      name: "吊人 The Hanged Man",
      keyword: "等待・換角度・暫停",
      meaning: "暫時卡住不代表失敗，有時候只是換一個角度觀察的時候。",
      reminder:
        "熊熊村長提醒你：當你覺得好像走不下去，可以先停一下，不急著做決定。",
      mission: "遇到卡關的事情時，不急著解決，先深呼吸看著它 30 秒。",
    },
    {
      name: "死神 Death",
      keyword: "結束・放下・重生",
      meaning: "有些東西結束了，是為了讓新的東西有空間進來。",
      reminder:
        "熊熊村長提醒你：你可以跟一個不適合你的習慣說再見，為新的自己空出位置。",
      mission: "選一個你不想再保留的小壞習慣，寫下來，撕掉或丟掉。",
    },
    {
      name: "節制 Temperance",
      keyword: "平衡・調和・剛剛好",
      meaning: "現在很適合「一點一點來」，不用一下子做到 100 分。",
      reminder:
        "熊熊村長提醒你：你可以自己調配努力與休息的比例，找到自己的節奏。",
      mission: "今天不要把自己逼太緊，中間安排一個小休息。",
    },
    {
      name: "惡魔 The Devil",
      keyword: "綁住・誘惑・執著",
      meaning:
        "有些一直重複的行為，其實讓你越來越累，只是你還捨不得放手。",
      reminder:
        "熊熊村長提醒你：你可以慢慢鬆開一點，不用一次全部丟掉。",
      mission: "觀察自己今天哪一個小習慣「其實讓你變更累」，先意識到就好。",
    },
    {
      name: "高塔 The Tower",
      keyword: "突發事件・震盪・重建",
      meaning: "突然出現的變化會讓人害怕，但也會逼我們換一種方式生活。",
      reminder:
        "熊熊村長提醒你：當事情被打亂時，你可以問自己：「那我真正重視的是什麼？」",
      mission: "寫下一件最近讓你很不安的變化，旁邊寫上一個可能的好處。",
    },
    {
      name: "星星 The Star",
      keyword: "希望・療癒・願望",
      meaning: "你心裡有一顆小小的願望，它正在慢慢發光。",
      reminder:
        "熊熊村長提醒你：再小的願望都值得被好好對待，不用急著長大。",
      mission: "寫下一個你現在最想完成的小願望，貼在你看得到的地方。",
    },
    {
      name: "月亮 The Moon",
      keyword: "不安・想像・敏感",
      meaning: "有時候你想像中的可怕，比實際發生的還大一些。",
      reminder:
        "熊熊村長提醒你：你可以把怕的事情說出來，讓別人幫忙照亮。",
      mission: "跟一個信任的人分享一件你最近有點害怕或擔心的事情。",
    },
    {
      name: "太陽 The Sun",
      keyword: "喜悅・自信・單純快樂",
      meaning: "你有權利單純地開心，不需要每一分快樂都拿來交換。",
      reminder:
        "熊熊村長提醒你：就算別人沒有叫好，你也可以為自己的努力鼓掌。",
      mission: "做一件單純讓你開心的事，不用有目的，只為了快樂。",
    },
    {
      name: "審判 Judgement",
      keyword: "覺醒・回顧・寬恕",
      meaning: "你有機會重新看待自己，把以前的自己也溫柔地抱進來。",
      reminder:
        "熊熊村長提醒你：你可以對過去的自己說：「謝謝你一路走到這裡。」",
      mission: "回想一件你以前很在意的錯誤，對那時候的自己說一句鼓勵。",
    },
    {
      name: "世界 The World",
      keyword: "完成・整合・新的旅程",
      meaning: "你已經走了很長一段路，學會很多東西，可以慢慢享受結果。",
      reminder:
        "熊熊村長提醒你：你不需要成為完美的人，已經成為現在的你，本身就是禮物。",
      mission: "列出今天你完成的三件小事，哪怕很小也算在裡面。",
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
      🐻 <em>${card.reminder}</em><br><br>
      📌 <strong>今日任務：</strong>${card.mission}
    `;
    fortuneOkBtn.textContent = "收下指引，出發冒險！";
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

    if (m.isBoss && Array.isArray(m.phases) && m.phases.length > 0) {
      // 多階段魔王
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
      // 一般魔物
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

  // ===== 猜拳判定 =====
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

  // ===== 事件：選勇者 → 出發前占卜 =====
  const heroCards = document.querySelectorAll(".hero-card");
  heroCards.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.hero;
      currentHeroKey = key;
      drawTarot(); // 選職業後先抽一張今日塔羅
    });
  });

  fortuneOkBtn.addEventListener("click", () => {
    closeModal(fortuneModal);
    showScreen("map");
  });

  // 背景不關掉，占卜只能按按鈕關
  modalBackdrop.addEventListener("click", () => {
    // 不做事
  });

  // ===== 事件：點地圖格子 =====
  const mapCells = document.querySelectorAll(".map-cell");
  mapCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const loc = cell.dataset.location;

      // 新手村：休息
      if (loc === "village") {
        resultText.textContent =
          "你在新手村做伸展、補充水分、跟熊熊打招呼，休息一下再出發～";
        resultOkBtn.textContent = "出發！";
        openModal(resultModal);
        return;
      }

      // 女巫小屋：必定抽塔羅，無戰鬥
      if (loc === "witch") {
        drawTarot();
        return;
      }

      // 其他地點：進戰鬥（包含魔王城）
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

  // ===== 猜拳按鈕事件 =====
  rpsButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!currentMonsterKey || !currentHeroKey) return;

      const hero = heroes[currentHeroKey];
      const m = monsters[currentMonsterKey];
      const playerHand = btn.dataset.hand;
      const enemyHand = enemyRandomHand();
      const result = rpsResult(playerHand, enemyHand);

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
          const advanced = advanceBossPhase(m);
          if (!advanced) {
            // 所有階段結束
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

  // ===== 勇氣星星 & 愛的力量按鈕 =====
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