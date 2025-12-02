// ===============================
// 小勇者之旅大冒險：地圖 & 占卜版
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // ===== 畫面區塊 =====
  const screens = {
    choose: document.getElementById("screen-choose"),
    map: document.getElementById("screen-map"),
  };

  let currentHero = null;      // 當前選擇的勇者 key
  let currentLocation = null;  // 當前選擇的地點 key
  let activeModal = null;      // 目前開啟中的 modal

  function showScreen(name) {
    Object.values(screens).forEach((el) => el.classList.add("hidden"));
    if (screens[name]) {
      screens[name].classList.remove("hidden");
    }
  }

  // ===== Modal 共用處理 =====
  const modalBackdrop = document.getElementById("modal-backdrop");
  const fortuneModal = document.getElementById("fortuneModal");
  const fortuneTextEl = document.getElementById("fortuneText");
  const fortuneOkBtn = document.getElementById("fortuneOkBtn");

  const encounterModal = document.getElementById("encounterModal");
  const encounterTitleEl = document.getElementById("encounterTitle");
  const encounterTextEl = document.getElementById("encounterText");
  const monsterWeakEl = document.getElementById("monsterWeak");
  const monsterForbiddenEl = document.getElementById("monsterForbidden");
  const bearTipEl = document.getElementById("bearTip");
  const encounterOkBtn = document.getElementById("encounterOkBtn");

  function openModal(modalEl) {
    activeModal = modalEl;
    modalEl.classList.remove("hidden");
    modalBackdrop.classList.remove("hidden");
  }

  function closeModal(modalEl) {
    const target = modalEl || activeModal;
    if (target) {
      target.classList.add("hidden");
    }
    activeModal = null;

    // 如果所有 modal 都關掉了，就把背景也關掉
    if (
      fortuneModal.classList.contains("hidden") &&
      encounterModal.classList.contains("hidden")
    ) {
      modalBackdrop.classList.add("hidden");
    }
  }

  // 點背景關閉目前的 modal
  modalBackdrop.addEventListener("click", () => {
    closeModal();
  });

  // ===== 勇者資料 & 占卜文字 =====
  const heroDisplayName = {
    warrior: "🛡️ 勇敢的戰士",
    mage: "🔮 創意法師",
    priest: "💖 溫柔牧師",
    villager: "🌾 勇敢的村民",
  };

  const heroFortunes = {
    warrior:
      "今天適合勇敢面對挑戰，只要你願意站出來，壞情緒也會慢慢退後。",
    mage: "今天適合發揮你的創意，任何壞心情都可以被你變成閃亮亮的小點子。",
    priest:
      "今天適合用傾聽和擁抱陪伴別人，你的溫柔會成為大家的安全感。",
    villager:
      "今天適合一步一步慢慢來，就算不是最厲害的，也可以是最不放棄的那個人。",
    default:
      "今天的你，擁有溫柔治癒力，壞情緒看到你都會慢慢軟化～",
  };

  // ===== 魔物設定：每格一隻，含「弱點拳 / 禁出拳 / 熊熊提醒」 =====
  const monsters = {
    meadow: {
      place: "草原",
      name: "擔心史萊姆",
      emotion: "一直擔心別人不喜歡自己、會不會做不好。",
      weak: "✌️ 剪刀（幫牠剪掉多餘的擔心）",
      forbidden: "✊ 石頭（太硬太兇，會嚇到牠）",
      bearTip:
        "熊熊村長：先肯定牠：『你已經很努力了。』再用輕鬆的語氣開個小玩笑，讓牠慢慢放鬆。",
    },
    forest: {
      place: "森林",
      name: "害羞樹精",
      emotion: "很怕在大家面前出錯，被笑或被批評。",
      weak: "🖐 布（像溫暖的披風包住牠）",
      forbidden: "✌️ 剪刀（太銳利，讓牠更緊張）",
      bearTip:
        "熊熊村長：可以說：『慢慢來，先跟我一起小聲試試看就好。』讓牠知道不需要一次做到完美。",
    },
    cave: {
      place: "洞窟",
      name: "怕黑岩怪",
      emotion: "害怕黑暗、未知的聲音和看不清楚的東西。",
      weak: "🖐 布（像小夜燈和安全被子）",
      forbidden: "✌️ 剪刀（閃來閃去的動作會讓牠更害怕）",
      bearTip:
        "熊熊村長：陪牠一起數一數周圍看得到的東西，例如『三顆石頭、兩盞火把』，幫牠回到安全的現在。",
    },
    lake: {
      place: "湖畔",
      name: "哭哭水靈",
      emotion: "心裡很委屈，很多話說不出來，只能一直流眼淚。",
      weak: "✊ 石頭（穩穩的陪伴力量）",
      forbidden: "🖐 布（一直急著擦眼淚會讓牠更想哭）",
      bearTip:
        "熊熊村長：先陪牠一起深呼吸，再問：『你最希望哪一件事情被好好聽見？』讓牠慢慢說出來。",
    },
    graveyard: {
      place: "墓地",
      name: "寂寞骷髏",
      emotion: "覺得自己永遠都是一個人，沒有人真的在乎牠。",
      weak: "🖐 布（像抱抱一樣靠近牠）",
      forbidden: "✊ 石頭（太冷硬，像是在拒絕往來）",
      bearTip:
        "熊熊村長：可以邀請牠玩簡單的小遊戲或問答，讓牠發現：『原來我也有人願意陪。』",
    },
    witch: {
      place: "女巫小屋",
      name: "塔羅占卜桌",
      emotion: "心裡有好多問號想釐清，不知道接下來該怎麼做。",
      weak: "✌️ 剪刀（幫忙剪開糾結的思緒）",
      forbidden: "🖐 布（一下子包太多問題，會更亂）",
      bearTip:
        "熊熊村長：把問題縮小，只想一件此刻最在意的事情，塔羅和熊熊就能給你更清楚的指引。",
    },
    mountain: {
      place: "山頂",
      name: "壓力小獸",
      emotion: "覺得所有事情都要自己扛，一鬆手就會全部掉下來。",
      weak: "✊ 石頭（穩固、但溫柔的力量）",
      forbidden: "✌️ 剪刀（一下子砍掉全部任務，會讓牠更慌）",
      bearTip:
        "熊熊村長：陪牠把任務分成『現在要做』『等等再做』『其實可以不用做』三種，壓力就會慢慢下降。",
    },
    boss: {
      place: "魔王城",
      name: "情緒黑龍",
      emotion: "把所有累積的生氣、害怕、嫉妒、孤單都吞進肚子裡。",
      weak: "三種拳都可以，但要搭配真心的安撫語句。",
      forbidden: "不能用責備或嘲笑的語氣說話。",
      bearTip:
        "熊熊村長：先說出自己的感受，再說你對牠的關心，例如：『我也會怕，但我想跟你一起想辦法。』這樣黑龍才會願意把心打開一點點。",
    },
  };

  // ===== 勇者卡片點擊：設定勇者 + 熊熊占卜 =====
  const heroCards = document.querySelectorAll(".hero-card");

  heroCards.forEach((card) => {
    card.addEventListener("click", () => {
      const heroKey = card.dataset.hero;
      currentHero = heroKey;

      const heroName = heroDisplayName[heroKey] || "小勇者";
      const msg = heroFortunes[heroKey] || heroFortunes.default;

      fortuneTextEl.textContent = `${heroName}，${msg}`;
      openModal(fortuneModal);
    });
  });

  // 占卜視窗按鈕：關閉占卜 → 進入地圖
  fortuneOkBtn.addEventListener("click", () => {
    closeModal(fortuneModal);
    showScreen("map");
  });

  // ===== 地圖點擊事件 =====
  const mapCells = document.querySelectorAll(".map-cell");

  mapCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const loc = cell.dataset.location;
      currentLocation = loc;

      // 1. 新手村：回到選勇者畫面
      if (loc === "village") {
        // 可以視情況要不要清空 currentHero，這裡先保留勇者
        showScreen("choose");
        return;
      }

      // 2. 其他地點：顯示該地點的魔物資訊（弱點拳 / 禁出拳 / 熊熊提醒）
      const monster = monsters[loc];

      if (!monster) {
        // 若尚未設定魔物資料，就顯示簡單訊息
        encounterTitleEl.textContent = "這裡還在建設中";
        encounterTextEl.textContent =
          "熊熊村長正在幫這個地點找適合的魔物與故事，敬請期待～";
        monsterWeakEl.textContent = "尚未設定";
        monsterForbiddenEl.textContent = "尚未設定";
        bearTipEl.textContent = "熊熊：之後這裡也會有溫暖的小提醒喔！";
      } else {
        encounterTitleEl.textContent = `你來到了「${monster.place}」`;
        encounterTextEl.textContent = `你遇見了 ${monster.name}，牠正在因為「${monster.emotion}」而心情卡卡的。`;
        monsterWeakEl.textContent = monster.weak;
        monsterForbiddenEl.textContent = monster.forbidden;
        bearTipEl.textContent = monster.bearTip;
      }

      openModal(encounterModal);
    });
  });

  // 遭遇視窗按鈕：目前先關閉視窗、回到地圖（未進入戰鬥）
  encounterOkBtn.addEventListener("click", () => {
    closeModal(encounterModal);
    showScreen("map");
  });

  // ===== 初始畫面：從選勇者開始 =====
  showScreen("choose");
});