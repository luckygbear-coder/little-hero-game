// ====== 全域狀態 ======
let currentHero = null;
let currentLocation = null;

// ====== 畫面切換 ======
const screens = {
  choose: document.getElementById("screen-choose"),
  map: document.getElementById("screen-map"),
};

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.add("hidden"));
  if (screens[name]) {
    screens[name].classList.remove("hidden");
  }
}

// 預設顯示選職業畫面
showScreen("choose");

// ====== Modal 共用功能 ======
const modalBackdrop = document.getElementById("modal-backdrop");
const fortuneModal = document.getElementById("fortuneModal");
const encounterModal = document.getElementById("encounterModal");

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");
}

function closeModal(modalEl) {
  if (modalEl) modalEl.classList.add("hidden");

  // 如果兩個 modal 都關閉，就一起關掉背景
  if (
    fortuneModal.classList.contains("hidden") &&
    encounterModal.classList.contains("hidden")
  ) {
    modalBackdrop.classList.add("hidden");
  }
}

// 點背景關閉目前開啟的 modal
modalBackdrop.addEventListener("click", () => {
  closeModal(fortuneModal);
  closeModal(encounterModal);
});

// ====== 熊熊占卜內容 ======
const fortuneText = document.getElementById("fortuneText");
const fortuneOkBtn = document.getElementById("fortuneOkBtn");

const fortuneMessages = [
  "今天的你，擁有溫柔治癒力，壞情緒看到你都會慢慢軟化～",
  "今天的你，充滿勇氣加乘值，適合面對讓你有點緊張的事情！",
  "今天的你，創意滿滿，只要願意開口，大家都會被你逗笑～",
  "今天的你，很適合好好照顧自己，休息一下也是一種勇敢喔！",
  "今天的你，是隊友的大太陽，你的笑容會影響整個隊伍的心情！",
];

function showFortune() {
  // 隨機抽一句占卜
  const msg = fortuneMessages[Math.floor(Math.random() * fortuneMessages.length)];
  fortuneText.textContent = msg;
  openModal(fortuneModal);
}

// 點「收到，出發！」 → 關閉占卜 → 進入地圖
fortuneOkBtn.addEventListener("click", () => {
  closeModal(fortuneModal);
  showScreen("map");
});

// ====== 勇者選擇（對應 index.html 的 .hero-card） ======
document.querySelectorAll(".hero-card").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentHero = btn.dataset.hero; // warrior / mage / priest / villager
    showFortune();
  });
});

// ====== 地圖地點描述，用來顯示遭遇視窗文字 ======
const encounterTitle = document.getElementById("encounterTitle");
const encounterText = document.getElementById("encounterText");
const encounterOkBtn = document.getElementById("encounterOkBtn");

const locationInfo = {
  village: {
    title: "你回到了新手村",
    text: "村民們向你揮手打招呼，這裡是最安全的地方，可以好好整理心情再出發～",
  },
  meadow: {
    title: "你來到了草原",
    text: "一隻小小史萊姆被壞情緒纏住，之後可以在這裡進行『安撫猜拳戰』！",
  },
  forest: {
    title: "你走進了森林",
    text: "害羞樹精躲在樹後面偷看你，似乎很想說話又不敢開口。",
  },
  cave: {
    title: "你來到黑暗洞窟",
    text: "怕黑小魔物緊緊抱著自己，也許需要有人陪它一起點亮小燈。",
  },
  lake: {
    title: "你來到湖畔",
    text: "哭哭水靈在湖邊掉眼淚，你的話語，也許可以成為它的安慰。",
  },
  graveyard: {
    title: "你來到寂寞墓地",
    text: "寂寞骷髏坐在石碑上發呆，似乎很需要一個『願意聽他說話的朋友』。",
  },
  witch: {
    title: "你來到女巫小屋",
    text: "女巫正在研究情緒魔法，也許可以從她那裡學到新的安撫方法。",
  },
  mountain: {
    title: "你來到高高的山頂",
    text: "壓力小獸扛著好多重重的石頭，你能不能幫它分擔一點呢？",
  },
  boss: {
    title: "你來到魔王城前",
    text: "巨大魔王的壞情緒在天空盤旋，之後會在這裡開啟『最終魔王戰』！",
  },
};

// 點地圖格子 → 顯示遭遇視窗
document.querySelectorAll(".map-cell").forEach((cell) => {
  cell.addEventListener("click", () => {
    const loc = cell.dataset.location;
    currentLocation = loc;

    const info = locationInfo[loc] || {
      title: "你展開了新的冒險",
      text: "這裡有一種還沒見過的情緒魔物，之後我們會再補上它的故事！",
    };

    encounterTitle.textContent = info.title;
    encounterText.textContent = info.text;
    openModal(encounterModal);
  });
});

// 點「先記下這裡，等等再來安撫～」 → 關閉遭遇視窗
encounterOkBtn.addEventListener("click", () => {
  closeModal(encounterModal);
  // 之後可以在這裡接上：若要直接進入該地點的戰鬥畫面
});