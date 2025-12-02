// ================== 全域狀態 ==================
let currentHero = null;

// ================== 畫面元素 ==================
const screens = {
  choose: document.getElementById("screen-choose"),
  map: document.getElementById("screen-map") || null,
  monster: document.getElementById("screen-monster") || null,
  boss: document.getElementById("screen-boss") || null,
};

function showScreen(name) {
  // 安全檢查：有拿到元素才操作，避免 null 報錯
  Object.values(screens).forEach((el) => {
    if (!el) return;
    el.classList.add("hidden");
  });
  const target = screens[name];
  if (target) target.classList.remove("hidden");
}

// ================== 勇者 & 占卜設定 ==================
const heroNames = {
  warrior: "🛡️ 勇敢的戰士",
  mage: "🔮 創意法師",
  priest: "💖 溫柔牧師",
  villager: "🌾 勇敢的村民",
};

// 每個職業各自的熊熊占卜內容（之後你想再多加都可以）
const heroFortunes = {
  warrior: [
    "今天的你，擁有正面迎戰的勇氣，壞情緒會被你一個個打敗！",
    "你的肩膀很穩，夥伴們靠在你身邊會覺得很安心～",
    "遇到困難時，記得先深呼吸，再一步一步往前走。",
  ],
  mage: [
    "今天你的點子特別多，試著用創意把壞情緒變成好玩的故事吧！",
    "你的想像力是超能力，畫出來、寫出來，心裡會變輕鬆。",
    "別害怕做夢，你的靈感正在幫你找到新的路。",
  ],
  priest: [
    "你的溫柔是很大的力量，連壞情緒被你擁抱後都會慢慢軟化。",
    "今天適合好好照顧自己，喝一杯喜歡的飲料，對自己說聲辛苦了。",
    "你的傾聽很重要，也別忘了聽聽自己心裡的聲音。",
  ],
  villager: [
    "雖然覺得自己很普通，但你的堅持讓你一點都不平凡。",
    "一步一步慢慢走也沒關係，你一直都有在前進。",
    "今天的你，很適合做一件小小的好事，讓世界亮一點點。",
  ],
};

// ================== 占卜視窗元素 ==================
const fortuneModal = document.getElementById("fortune-modal");
const fortuneText = document.getElementById("fortune-text");
const fortuneOkBtn = document.getElementById("fortune-ok-btn");

// 顯示熊熊占卜
function openFortune(heroKey) {
  const list = heroFortunes[heroKey] || [
    "今天的你，充滿勇氣與溫柔，壞情緒看到你都會慢慢軟化～",
  ];
  const msg = list[Math.floor(Math.random() * list.length)];
  fortuneText.textContent = msg;
  fortuneModal.classList.remove("hidden");
}

// 關閉熊熊占卜
function closeFortune() {
  fortuneModal.classList.add("hidden");
  // 之後要前往地圖畫面，可以在這裡改：showScreen("map");
}

// ================== 初始化綁定事件 ==================
document.addEventListener("DOMContentLoaded", () => {
  // 先顯示職業選擇畫面
  showScreen("choose");

  // 綁定四個職業按鈕
  const heroButtons = document.querySelectorAll(".hero-card, .hero-btn");
  heroButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const heroKey = btn.dataset.hero;
      if (!heroKey) return;
      currentHero = heroKey;
      openFortune(heroKey);
    });
  });

  // 占卜視窗按鈕
  if (fortuneOkBtn) {
    fortuneOkBtn.addEventListener("click", closeFortune);
  }
});