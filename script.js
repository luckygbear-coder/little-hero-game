// 小勇者之旅大冒險：選職業 → 占卜 → 地圖 → 魔物猜拳戰

document.addEventListener("DOMContentLoaded", function () {
  // ===== 畫面元素 =====
  var screenChoose = document.getElementById("screen-choose");
  var screenMap = document.getElementById("screen-map");
  var screenBattle = document.getElementById("screen-battle");

  function showScreen(name) {
    if (screenChoose) screenChoose.classList.add("hidden");
    if (screenMap) screenMap.classList.add("hidden");
    if (screenBattle) screenBattle.classList.add("hidden");

    if (name === "choose" && screenChoose) {
      screenChoose.classList.remove("hidden");
    }
    if (name === "map" && screenMap) {
      screenMap.classList.remove("hidden");
    }
    if (name === "battle" && screenBattle) {
      screenBattle.classList.remove("hidden");
    }
  }

  // 預設在選職業畫面
  showScreen("choose");

  // ===== 共用 Modal 元件 =====
  var modalBackdrop = document.getElementById("modal-backdrop");
  var fortuneModal = document.getElementById("fortuneModal");
  var encounterModal = document.getElementById("encounterModal");

  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove("hidden");
    if (modalBackdrop) modalBackdrop.classList.remove("hidden");
  }

  function closeModal(modalEl) {
    if (modalEl) modalEl.classList.add("hidden");

    var allClosed =
      (!fortuneModal || fortuneModal.classList.contains("hidden")) &&
      (!encounterModal || encounterModal.classList.contains("hidden"));

    if (allClosed && modalBackdrop) {
      modalBackdrop.classList.add("hidden");
    }
  }

  // 點背景關閉所有 modal
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", function () {
      closeModal(fortuneModal);
      closeModal(encounterModal);
    });
  }

  // ===== 熊熊占卜 =====
  var fortuneText = document.getElementById("fortuneText");
  var fortuneOkBtn = document.getElementById("fortuneOkBtn");

  var fortuneMessages = [
    "今天的你，擁有溫柔治癒力，壞情緒看到你都會慢慢軟化～",
    "今天的你，充滿勇氣加乘值，適合面對讓你有點緊張的事情！",
    "今天的你，創意滿滿，只要願意開口，大家都會被你逗笑～",
    "今天的你，很適合好好照顧自己，休息一下也是一種勇敢喔！",
    "今天的你，是隊友的大太陽，你的笑容會影響整個隊伍的心情！"
  ];

  function showFortune() {
    if (!fortuneText) return;
    var index = Math.floor(Math.random() * fortuneMessages.length);
    fortuneText.textContent = fortuneMessages[index];
    openModal(fortuneModal);
  }

  if (fortuneOkBtn) {
    fortuneOkBtn.addEventListener("click", function () {
      closeModal(fortuneModal);
      showScreen("map");
    });
  }

  // ===== 選擇職業（.hero-card） =====
  var heroCards = document.querySelectorAll(".hero-card");
  for (var i = 0; i < heroCards.length; i++) {
    heroCards[i].addEventListener("click", function () {
      // 之後可依職業調整技能，目前先直接占卜
      showFortune();
    });
  }

  // ===== 地圖遭遇 & 紀錄目前地點 =====
  var encounterTitle = document.getElementById("encounterTitle");
  var encounterText = document.getElementById("encounterText");
  var encounterOkBtn = document.getElementById("encounterOkBtn");

  var currentLocation = null; // 用來知道等一下要跟哪一隻魔物戰鬥

  var locationInfo = {
    village: {
      title: "你回到了新手村",
      text: "村民們向你揮手打招呼，這裡是最安全的地方，可以好好整理心情再出發～"
    },
    meadow: {
      title: "你來到了草原",
      text: "一隻小小史萊姆被壞情緒纏住，等等可以在這裡進行「安撫猜拳戰」！"
    },
    forest: {
      title: "你走進了森林",
      text: "害羞樹精躲在樹後面偷看你，似乎很想說話又不敢開口。"
    },
    cave: {
      title: "你來到黑暗洞窟",
      text: "怕黑小魔物緊緊抱著自己，也許需要有人陪它一起點亮小燈。"
    },
    lake: {
      title: "你來到湖畔",
      text: "哭哭水靈在湖邊掉眼淚，你的話語，也許可以成為它的安慰。"
    },
    graveyard: {
      title: "你來到寂寞墓地",
      text: "寂寞骷髏坐在石碑上發呆，似乎很需要一個「願意聽他說話的朋友」。"
    },
    witch: {
      title: "你來到女巫小屋",
      text: "女巫正在研究情緒魔法，也許可以從她那裡學到新的安撫方法。"
    },
    mountain: {
      title: "你來到高高的山頂",
      text: "壓力小獸扛著好多重重的石頭，你能不能幫它分擔一點呢？"
    },
    boss: {
      title: "你來到魔王城前",
      text: "巨大魔王的壞情緒在天空盤旋，這將會是最重要的一場安撫戰！"
    }
  };

  var mapCells = document.querySelectorAll(".map-cell");
  for (var j = 0; j < mapCells.length; j++) {
    mapCells[j].addEventListener("click", function () {
      var loc = this.getAttribute("data-location");
      currentLocation = loc;

      var info = locationInfo[loc];
      if (info && encounterTitle && encounterText) {
        encounterTitle.textContent = info.title;
        encounterText.textContent = info.text;
        openModal(encounterModal);
      }
    });
  }

  // ===== 魔物資料（用地點當 key） =====
  var battleMonsters = {
    meadow: {
      name: "緊張史萊姆",
      intro:
        "黏呼呼的小史萊姆好緊張，總是擔心自己做不好。試著用溫柔又穩定的好心情安撫牠吧～",
      maxHp: 3
    },
    forest: {
      name: "害羞樹精",
      intro:
        "害羞樹精怕被拒絕，所以常常躲起來。用幽默和理解，讓牠知道就算慢慢來也沒關係。",
      maxHp: 3
    },
    cave: {
      name: "怕黑小魔物",
      intro:
        "洞窟裡的魔物其實只是怕黑。用你的勇氣星星，幫牠一起把洞窟點亮吧！",
      maxHp: 3
    },
    lake: {
      name: "哭哭水靈",
      intro:
        "水靈的眼淚流成一整片湖。告訴牠：想哭的時候可以哭，哭完我們再一起想辦法。",
      maxHp: 3
    },
    graveyard: {
      name: "寂寞骷髏",
      intro:
        "骷髏看起來冷冰冰，其實只是太久沒有朋友陪。你的陪伴，就是牠最需要的魔法。",
      maxHp: 3
    },
    witch: {
      name: "混亂情緒鍋",
      intro:
        "女巫的情緒大鍋裡混在一起：生氣、害怕、興奮、期待……幫忙慢慢理出頭緒吧！",
      maxHp: 4
    },
    mountain: {
      name: "壓力小獸",
      intro:
        "壓力小獸背著超多責任，快喘不過氣。一起學會「分工」和「求助」，壓力就會變輕。",
      maxHp: 4
    },
    boss: {
      name: "暴走魔王",
      intro:
        "魔王被六種壞情緒纏住：生氣、害怕、嫉妒、孤單、羞愧、失望。慢慢安撫牠的心吧！",
      maxHp: 6
    },
    village: {
      // 新手村當作「教學戰」，也可以直接結束
      name: "心情小練習",
      intro: "在新手村，你可以先跟自己的小情緒做練習，不一定要打到贏才算成功喔。",
      maxHp: 2
    }
  };

  // ===== 戰鬥相關元素與狀態 =====
  var battleTitle = document.getElementById("battleTitle");
  var battleIntro = document.getElementById("battleIntro");
  var monsterNameLabel = document.getElementById("monsterNameLabel");
  var heroHpEl = document.getElementById("heroHp");
  var monsterHpEl = document.getElementById("monsterHp");
  var battleLog = document.getElementById("battleLog");
  var battleBackBtn = document.getElementById("battleBackBtn");
  var rpsButtons = document.querySelectorAll(".rps-btn");

  var heroHpMax = 3;
  var heroHp = heroHpMax;
  var monsterHpMax = 3;
  var monsterHp = 3;
  var currentMonsterKey = null;

  function makeHearts(current, max, fullEmoji) {
    var result = "";
    for (var k = 0; k < max; k++) {
      result += k < current ? fullEmoji : "🤍";
    }
    return result;
  }

  function renderHp() {
    if (heroHpEl) {
      heroHpEl.textContent = makeHearts(heroHp, heroHpMax, "❤️");
    }
    if (monsterHpEl) {
      monsterHpEl.textContent = makeHearts(monsterHp, monsterHpMax, "💜");
    }
  }

  function getMonsterInfo(loc) {
    if (battleMonsters[loc]) return battleMonsters[loc];
    return battleMonsters.meadow;
  }

  function startBattleForLocation(loc) {
    currentMonsterKey = loc;
    var info = getMonsterInfo(loc);

    heroHpMax = 3;
    heroHp = heroHpMax;
    monsterHpMax = info.maxHp || 3;
    monsterHp = monsterHpMax;

    if (battleTitle) {
      battleTitle.textContent = "對戰：" + info.name;
    }
    if (battleIntro) {
      battleIntro.textContent =
        info.intro ||
        "用剪刀、石頭、布傳送好心情，慢慢安撫牠的情緒吧！";
    }
    if (monsterNameLabel) {
      monsterNameLabel.textContent = info.name + " 的心情";
    }
    if (battleLog) {
      battleLog.textContent =
        "選一個拳，向「" + info.name + "」傳達你的好心情～";
    }
    if (battleBackBtn) {
      battleBackBtn.classList.add("hidden");
    }

    renderHp();
    showScreen("battle");
  }

  function handToText(hand) {
    if (hand === "rock") return "✊ 石頭";
    if (hand === "scissors") return "✌️ 剪刀";
    return "🖐 布";
  }

  function getMonsterName() {
    var info = getMonsterInfo(currentMonsterKey);
    return info.name || "小魔物";
  }

  var hands = ["rock", "scissors", "paper"];
  function randomHand() {
    var idx = Math.floor(Math.random() * hands.length);
    return hands[idx];
  }

  function playRound(playerHand) {
    // 若已經結束戰鬥，就不再計算
    if (heroHp <= 0 || monsterHp <= 0) return;

    var monsterHand = randomHand();
    var result;

    if (playerHand === monsterHand) {
      result = "draw";
    } else if (
      (playerHand === "rock" && monsterHand === "scissors") ||
      (playerHand === "scissors" && monsterHand === "paper") ||
      (playerHand === "paper" && monsterHand === "rock")
    ) {
      result = "win";
      monsterHp -= 1;
      if (monsterHp < 0) monsterHp = 0;
    } else {
      result = "lose";
      heroHp -= 1;
      if (heroHp < 0) heroHp = 0;
    }

    renderHp();

    var playerText = handToText(playerHand);
    var monsterText = handToText(monsterHand);

    if (!battleLog) return;

    if (result === "win") {
      battleLog.textContent =
        "你出了 " +
        playerText +
        "，魔物出了 " +
        monsterText +
        "。好心情成功傳達！牠的壞情緒慢慢減少了～";
    } else if (result === "lose") {
      battleLog.textContent =
        "你出了 " +
        playerText +
        "，魔物出了 " +
        monsterText +
        "。這回合有點小挫折，你的心情受到了影響，但沒關係，再試一次！";
    } else {
      battleLog.textContent =
        "你出了 " +
        playerText +
        "，魔物也出了 " +
        monsterText +
        "，勢均力敵，再來一回合！";
    }

    // 檢查勝敗
    if (monsterHp <= 0) {
      battleLog.textContent =
        "太棒了！「" +
        getMonsterName() +
        "」的壞情緒被好好安撫了，牠恢復了笑容～";
      if (battleBackBtn) {
        battleBackBtn.textContent = "回到地圖，繼續冒險！";
        battleBackBtn.classList.remove("hidden");
      }
    } else if (heroHp <= 0) {
      battleLog.textContent =
        "今天的壓力有點大，你的心情先滿出來了……先回新手村休息一下，再出發也沒關係！";
      if (battleBackBtn) {
        battleBackBtn.textContent = "回到地圖，調整心情";
        battleBackBtn.classList.remove("hidden");
      }
    }
  }

  // 綁定猜拳按鈕
  for (var t = 0; t < rpsButtons.length; t++) {
    rpsButtons[t].addEventListener("click", function () {
      var hand = this.getAttribute("data-hand");
      playRound(hand);
    });
  }

  // 戰鬥結束後回到地圖
  if (battleBackBtn) {
    battleBackBtn.addEventListener("click", function () {
      showScreen("map");
    });
  }

  // 遭遇視窗 → 進入戰鬥
  if (encounterOkBtn) {
    encounterOkBtn.addEventListener("click", function () {
      closeModal(encounterModal);
      startBattleForLocation(currentLocation || "meadow");
    });
  }
});