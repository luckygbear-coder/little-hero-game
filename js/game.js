// ============================
// 小勇者之旅大冒險 － 主程式
// ============================

// ---- 全域狀態 ----
let currentMode = "single";      // "single" 或 "double"
let currentHero = null;          // { id, name, fist, desc ... }
let selectedStage = null;        // { id, name, monster ... }

// ---- DOM 元件 ----
const modeSingleBtn = document.getElementById("mode-single");
const modeDoubleBtn = document.getElementById("mode-double");
const modeDisplay   = document.getElementById("modeDisplay");

const tabs  = document.querySelectorAll(".tab");
const pages = document.querySelectorAll(".page");

const heroListEl     = document.getElementById("heroList");
const confirmHeroBtn = document.getElementById("confirmHero");

const mapContainerEl = document.getElementById("mapContainer");
const battleAreaEl   = document.getElementById("battleArea");
const monsterListEl  = document.getElementById("monsterList");

// ============================
// 1. 模式切換
// ============================
function updateModeDisplay() {
  if (currentMode === "single") {
    modeDisplay.textContent = "目前模式：單人冒險（1 個人練習與魔物互動）";
  } else {
    modeDisplay.textContent = "目前模式：同機雙人（2 個人輪流出拳與對話）";
  }
}

modeSingleBtn.addEventListener("click", () => {
  currentMode = "single";
  modeSingleBtn.classList.add("active");
  modeDoubleBtn.classList.remove("active");
  updateModeDisplay();
});

modeDoubleBtn.addEventListener("click", () => {
  currentMode = "double";
  modeDoubleBtn.classList.add("active");
  modeSingleBtn.classList.remove("active");
  updateModeDisplay();
});

updateModeDisplay();

// ============================
// 2. 分頁切換
// ============================
function showPage(pageId) {
  pages.forEach(p => {
    p.classList.toggle("active", p.id === pageId);
  });
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.page;
    // 切換 tab 樣式
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    // 顯示頁面
    showPage(target);
  });
});

// ============================
// 3. 勇者資料 & 渲染
// ============================
const HEROES = [
  {
    id: "warrior",
    name: "戰士",
    icon: "🛡️",
    typeLabel: "Rock ✊",
    fist: "rock",
    personality: "勇敢、有責任感",
    quote: "「我一定會守護大家！」",
    ability: "出石頭並勝利 → 傳達 2 倍好心情。"
  },
  {
    id: "mage",
    name: "法師",
    icon: "🔮",
    typeLabel: "Scissors ✌️",
    fist: "scissors",
    personality: "聰明、有創意",
    quote: "「嘿嘿～我有新點子！」",
    ability: "出剪刀並勝利 → 傳達 2 倍好心情。"
  },
  {
    id: "priest",
    name: "牧師",
    icon: "💖",
    typeLabel: "Paper 🖐",
    fist: "paper",
    personality: "溫柔、善解人意",
    quote: "「別擔心，我來幫你～」",
    ability: "出布並勝利 → 傳達 2 倍好心情。"
  },
  {
    id: "villager",
    name: "勇敢的村民",
    icon: "🌾",
    typeLabel: "自由拳 ✨",
    fist: "any",
    personality: "樸實、堅毅",
    quote: "「我雖然平凡，但不放棄！」",
    ability: "魔王戰使用任意拳 → 即使輸也不受壞情緒影響。"
  }
];

function renderHeroes() {
  heroListEl.innerHTML = "";
  HEROES.forEach(hero => {
    const card = document.createElement("div");
    card.className = "hero-card";
    card.dataset.id = hero.id;
    card.innerHTML = `
      <div class="hero-type">${hero.typeLabel}</div>
      <h3>${hero.icon} ${hero.name}</h3>
      <p>個性：${hero.personality}</p>
      <p>口頭禪：${hero.quote}</p>
      <p>能力：${hero.ability}</p>
    `;

    card.addEventListener("click", () => {
      // 取消其他選取
      document
        .querySelectorAll(".hero-card")
        .forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      currentHero = hero;
      confirmHeroBtn.classList.remove("disabled");
    });

    heroListEl.appendChild(card);
  });
}

confirmHeroBtn.addEventListener("click", () => {
  if (!currentHero) return;
  alert(`你選擇了小勇者：「${currentHero.name}」！\n可以前往「地圖冒險」開始旅程。`);

  // 自動切到地圖頁
  const mapTab = document.querySelector('.tab[data-page="page-map"]');
  if (mapTab) {
    tabs.forEach(t => t.classList.remove("active"));
    mapTab.classList.add("active");
  }
  showPage("page-map");
});

renderHeroes();

// ============================
// 4. 地圖資料 & 渲染
// ============================
const STAGES = [
  {
    id: 1,
    name: "新手草原",
    monster: "哭哭史萊姆",
    desc: "住著愛哭又迷惘的「哭哭史萊姆」。",
    talent: "rock",
    forbidden: "paper"
  },
  {
    id: 2,
    name: "熾熱丘陵",
    monster: "暴躁火球",
    desc: "一不小心就會爆炸的「暴躁火球」。",
    talent: "rock",
    forbidden: "paper"
  },
  {
    id: 3,
    name: "南瓜農場",
    monster: "壞心情南瓜",
    desc: "嘴巴很兇其實很寂寞的「壞心情南瓜」。",
    talent: "rock",
    forbidden: "paper"
  },
  {
    id: 4,
    name: "蘑菇森林",
    monster: "哭哭菇菇",
    desc: "常覺得自己不夠好的「哭哭菇菇」。",
    talent: "paper",
    forbidden: "scissors"
  },
  {
    id: 5,
    name: "墓園小丘",
    monster: "悲傷骷髏",
    desc: "以為自己沒人愛的「悲傷骷髏」。",
    talent: "rock",
    forbidden: "paper"
  },
  {
    id: 6,
    name: "黏黏沼澤",
    monster: "黏黏史萊姆",
    desc: "總是黏住不想放手的「黏黏史萊姆」。",
    talent: "rock",
    forbidden: "paper"
  },
  {
    id: 7,
    name: "魔狼森林",
    monster: "兇暴狼人",
    desc: "看起來超兇其實怕孤單的「兇暴狼人」。",
    talent: "rock",
    forbidden: "paper"
  },
  {
    id: 8,
    name: "惡作劇山丘",
    monster: "小惡魔",
    desc: "愛捉弄人的「小惡魔」。",
    talent: "rock",
    forbidden: "scissors"
  },
  {
    id: 9,
    name: "黑霧邊界",
    monster: "憂鬱幽靈",
    desc: "徘徊在黑霧邊緣的「憂鬱幽靈」。",
    talent: "paper",
    forbidden: "rock"
  }
];

function fistToText(fist) {
  if (fist === "rock") return "石頭 ✊";
  if (fist === "paper") return "布 🖐";
  if (fist === "scissors") return "剪刀 ✌️";
  return "任意拳";
}

function renderMap() {
  mapContainerEl.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "map-grid";

  STAGES.forEach(stage => {
    const cell = document.createElement("div");
    cell.className = "map-cell";
    cell.dataset.id = stage.id;
    cell.innerHTML = `
      <h4>${stage.name}</h4>
      <p>${stage.desc}</p>
      <p class="monster-name">魔物：${stage.monster}</p>
      <p class="monster-info">天賦：${fistToText(stage.talent)}／禁出：${fistToText(stage.forbidden)}</p>
    `;

    cell.addEventListener("click", () => {
      // 標記選取
      document
        .querySelectorAll(".map-cell")
        .forEach(c => c.classList.remove("active"));
      cell.classList.add("active");
      selectedStage = stage;

      // 自動切換到戰鬥頁面
      startBattle();
    });

    grid.appendChild(cell);
  });

  mapContainerEl.appendChild(grid);
}

renderMap();

// ============================
// 5. 戰鬥邏輯（一般關卡）
// ============================
const FISTS = ["rock", "paper", "scissors"];

function randomMonsterMove(stage) {
  // 不出 forbidden，偶爾出天賦拳
  const allowed = FISTS.filter(f => f !== stage.forbidden);
  // 加權：多放一次天賦拳
  allowed.push(stage.talent);
  const idx = Math.floor(Math.random() * allowed.length);
  return allowed[idx];
}

function decideResult(player, monster) {
  if (player === monster) return "draw";
  if (
    (player === "rock" && monster === "scissors") ||
    (player === "scissors" && monster === "paper") ||
    (player === "paper" && monster === "rock")
  ) {
    return "win";
  }
  return "lose";
}

function startBattle() {
  if (!currentHero) {
    alert("請先在「選擇小勇者」頁面選一位小勇者！");
    // 自動跳回選角
    const heroTab = document.querySelector('.tab[data-page="page-hero"]');
    if (heroTab) {
      tabs.forEach(t => t.classList.remove("active"));
      heroTab.classList.add("active");
    }
    showPage("page-hero");
    return;
  }
  if (!selectedStage) {
    alert("請先在「地圖冒險」點選一個關卡！");
    return;
  }

  // 切換到戰鬥頁
  const battleTab = document.querySelector('.tab[data-page="page-battle"]');
  if (battleTab) {
    tabs.forEach(t => t.classList.remove("active"));
    battleTab.classList.add("active");
  }
  showPage("page-battle");

  // 建立戰鬥畫面
  battleAreaEl.innerHTML = `
    <div class="battle-card">
      <h3>⚔️ 對戰：${selectedStage.monster}</h3>
      <p>地點：${selectedStage.name}</p>
      <p>小勇者：${currentHero.icon} ${currentHero.name}</p>
      <p>魔物天賦：${fistToText(selectedStage.talent)} ／ 禁出：${fistToText(selectedStage.forbidden)}</p>

      <div class="battle-buttons">
        <button data-fist="rock">✊ 石頭</button>
        <button data-fist="scissors">✌️ 剪刀</button>
        <button data-fist="paper">🖐 布</button>
      </div>

      <div id="battleResult" class="battle-result">
        請選擇要出的拳，看看能不能讓魔物好一點。
      </div>
    </div>
  `;

  const resultEl = document.getElementById("battleResult");
  const buttons = battleAreaEl.querySelectorAll(".battle-buttons button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const playerMove = btn.dataset.fist;
      const monsterMove = randomMonsterMove(selectedStage);
      const result = decideResult(playerMove, monsterMove);

      let text = `你出了 ${fistToText(playerMove)}，魔物出了 ${fistToText(monsterMove)}。\n`;

      if (result === "win") {
        text += "✅ 你傳遞了好心情，魔物的壞情緒被安撫了一點！";
        if (currentHero.fist !== "any" && currentHero.fist === playerMove) {
          text += `\n✨ ${currentHero.name} 的招牌拳發動，好心情效果加倍！`;
        }
      } else if (result === "draw") {
        text += "🤝 平手！魔物還在猶豫中，再試一次看看吧。";
      } else {
        text += "💦 這回合你有點吃虧，魔物的壞情緒還是很激動。\n可以深呼吸一下，再慢慢來。";
      }

      if (currentMode === "double") {
        text += "\n\n👥 提示：同機雙人模式下，可以輪流出拳或說說自己現在的感受。";
      }

      resultEl.textContent = text;
    });
  });
}

// ============================
// 6. 魔物圖鑑 (簡易版)
// ============================
function renderMonsterList() {
  if (!monsterListEl) return;
  monsterListEl.innerHTML = "";
  const list = document.createElement("ul");
  list.className = "monster-list";

  STAGES.forEach(stage => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${stage.monster}</b>（${stage.name}）－
      天賦：${fistToText(stage.talent)} ／ 禁出：${fistToText(stage.forbidden)}
    `;
    list.appendChild(li);
  });

  monsterListEl.appendChild(list);
}

renderMonsterList();