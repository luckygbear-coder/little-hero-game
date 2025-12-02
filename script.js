// ====== 全域狀態 ======
let currentHero = null;       // 目前選擇的勇者 key
let currentLocation = null;   // 目前選擇的地點 key
let activeModal = null;       // 目前開啟中的 modal 參考

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

// ====== Modal 共用處理 ======
const modalBackdrop = document.getElementById("modal-backdrop");
const fortuneModal = document.getElementById("fortuneModal");
const fortuneTextEl = document.getElementById("fortuneText");
const fortuneOkBtn = document.getElementById("fortuneOkBtn");

const encounterModal = document.getElementById("encounterModal");
const encounterTitleEl = document.getElementById("encounterTitle");
const encounterTextEl = document.getElementById("encounterText");
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
  modalBackdrop.classList.add("hidden");
  activeModal = null;
}

// 點背景關閉目前的 modal
modalBackdrop.addEventListener("click", () => {
  closeModal();
});

// ====== 勇者資料 ======