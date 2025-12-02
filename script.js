// ===== 全域狀態 =====
let currentHero = null;

// ===== 方塊：畫面切換 =====
const screens = {
  choose: document.getElementById("screen-choose"),
  map: document.getElementById("screen-map"),
};

function showScreen(name) {
  Object.values(screens).forEach((el) => {
    el.classList.add("hidden");
  });
  screens[name].classList.remove("hidden");
}

// ===== 勇者占卜設定 =====
const heroFortunes = {
  warrior: "今天的你，擁有勇敢與守護力，讓壞情緒知道：你不是一個人面對。",
  mage: "今天的你，充滿創意靈感，能把擔心和害怕變成新的點子和解方。",
  priest:
    "今天的你，有溫柔治癒力，願意聽、願意陪，就能讓很多情緒慢慢放鬆。",
  villager:
    "今天的你，看起來平凡，但只要願意邁出一步，就已經是超級勇者了！",
};

// ===== 地圖地點設定（之後這裡會接「遇到的魔物」與戰鬥） =====
const locations = {
  village: {
    title: "你回到了新手村",
    text: "這裡是出發點，也是休息的地方。之後可以在這裡補充勇氣與好心情。",
  },
  meadow: {
    title: "草原上的微風",
    text: "你遇見了有點暴躁的怒炎小獸，它其實只是太想被看見。",
  },
  forest: {
    title: "靜靜的森林",
    text: "一隻害羞樹精躲在樹後面，好像怕被誤會，心裡有點緊張。",
  },
  cave: {
    title: "黑暗洞窟裡的回聲",
    text: "怕黑的小魔物縮在角落，它需要有人陪它一起面對黑暗。",
  },
  lake: {
    title: "湖畔的漣漪",
    text: "哭哭水靈在湖邊掉眼淚，也許只是今天發生了一些太難的事。",
  },
  graveyard: {
    title: "寂寞的墓地",
    text: "骷髏士兵其實很孤單，只是用酷酷的樣子藏起來。",
  },
  witch: {
    title: "女巫小屋的門縫",
    text: "女巫正在研究『情緒藥水』，之後也許會給你特別的占卜提示。",
  },
  mountain: {
    title: "風大的山頂",
    text: "壓力小獸背著很重的包包，它需要有人告訴它：可以慢一點沒關係。",
  },
  boss: {
    title: "魔王城的大門前",
    text: "這裡住著被好多壞情緒纏住的魔王。等我們先安撫完幾隻魔物，再一起來挑戰最終戰吧！",
  },
};

// ===== DOM 抓取 =====
const heroButtons = document.querySelectorAll(".hero-card");

const modalBackdrop = document.getElementById("modal-backdrop");

// 占卜 modal
const fortuneModal = document.getElementById("fortuneModal");
const fortuneText = document.getElementById("fortuneText");
const fortuneOkBtn = document.getElementById("fortuneOkBtn");

// 遭遇 modal
const encounterModal = document.getElementById("encounterModal");
const encounterTitle = document.getElementById("encounterTitle");
const encounterText = document.getElementById("encounterText");
const encounterOkBtn = document.getElementById("encounterOkBtn");

// 地圖格子
const mapCells = document.querySelectorAll(".map-cell");

// ===== 共用 modal 開關 =====
function openModal(modalEl) {
  modalBackdrop.classList.remove("hidden");
  modalEl.classList.remove("hidden");
}

function closeModal(modalEl) {
  modalBackdrop.classList.add("hidden");
  modalEl.classList.add("hidden");
}

// 點選勇者：設定 hero + 顯示占卜
heroButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const heroKey = btn.dataset.hero;
    currentHero = heroKey;

    const text =
      heroFortunes[heroKey] ||
      "今天的你，有著特別的勇氣，可以好好面對自己的感受。";
    fortuneText.textContent = text;

    openModal(fortuneModal);
  });
});

// 占卜按鈕：關閉占卜 → 進入地圖畫面
fortuneOkBtn.addEventListener("click", () => {
  closeModal(fortuneModal);
  showScreen("map");
});

// 地圖點擊：顯示遇到的地點／情緒魔物（先簡單文字版）
mapCells.forEach((cell) => {
  cell.addEventListener("click", () => {
    const key = cell.dataset.location;
    const info = locations[key];

    if (!info) return;

    // 標記已造訪
    cell.classList.add("visited");

    encounterTitle.textContent = info.title;
    encounterText.textContent = info.text;

    openModal(encounterModal);
  });
});

// 遭遇視窗按鈕：先關閉，之後這裡會接「進入戰鬥畫面」
encounterOkBtn.addEventListener("click", () => {
  closeModal(encounterModal);
  // 目前什麼都不做，停留在地圖畫面。
});

// 點擊背景關閉目前的 modal（選擇性，可保留）
modalBackdrop.addEventListener("click", () => {
  if (!fortuneModal.classList.contains("hidden")) {
    closeModal(fortuneModal);
  } else if (!encounterModal.classList.contains("hidden")) {
    closeModal(encounterModal);
  }
});

// 起始畫面
showScreen("choose");