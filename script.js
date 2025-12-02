// 小勇者之旅大冒險：精簡穩定版腳本
// 功能：選職業 → 熊熊占卜 → 九宮格地圖 → 遭遇視窗

document.addEventListener("DOMContentLoaded", function () {
  // ===== 畫面元素 =====
  var screenChoose = document.getElementById("screen-choose");
  var screenMap = document.getElementById("screen-map");

  function showScreen(name) {
    if (screenChoose) screenChoose.classList.add("hidden");
    if (screenMap) screenMap.classList.add("hidden");

    if (name === "choose" && screenChoose) {
      screenChoose.classList.remove("hidden");
    }
    if (name === "map" && screenMap) {
      screenMap.classList.remove("hidden");
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

  // 點背景關閉
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

  // ===== 選擇職業（對應 .hero-card） =====
  var heroCards = document.querySelectorAll(".hero-card");
  for (var i = 0; i < heroCards.length; i++) {
    heroCards[i].addEventListener("click", function () {
      // 這裡可以之後記錄 currentHero，目前先直接占卜
      showFortune();
    });
  }

  // ===== 地圖遭遇 =====
  var encounterTitle = document.getElementById("encounterTitle");
  var encounterText = document.getElementById("encounterText");
  var encounterOkBtn = document.getElementById("encounterOkBtn");

  var locationInfo = {
    village: {
      title: "你回到了新手村",
      text: "村民們向你揮手打招呼，這裡是最安全的地方，可以好好整理心情再出發～"
    },
    meadow: {
      title: "你來到了草原",
      text: "一隻小小史萊姆被壞情緒纏住，之後可以在這裡進行『安撫猜拳戰』！"
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
      text: "寂寞骷髏坐在石碑上發呆，似乎很需要一個『願意聽他說話的朋友』。"
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
      text: "巨大魔王的壞情緒在天空盤旋，之後會在這裡開啟『最終魔王戰』！"
    }
  };

  var mapCells = document.querySelectorAll(".map-cell");
  for (var j = 0; j < mapCells.length; j++) {
    mapCells[j].addEventListener("click", function () {
      var loc = this.getAttribute("data-location");
      var info = locationInfo[loc];

      if (info && encounterTitle && encounterText) {
        encounterTitle.textContent = info.title;
        encounterText.textContent = info.text;
        openModal(encounterModal);
      }
    });
  }

  if (encounterOkBtn) {
    encounterOkBtn.addEventListener("click", function () {
      closeModal(encounterModal);
      // 之後在這裡銜接「進入該地點的戰鬥畫面」
    });
  }
});