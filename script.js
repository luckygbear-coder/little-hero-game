/* ===========================
   小勇者之旅大冒險 - 完整版系統
   魔物 + 魔王 + 占卜 + 語音 + 動畫
=========================== */

/* ----------------------------------
   魔物資料庫
---------------------------------- */
const monsters = [
  {
    name: "哭哭史萊姆 💧",
    img: "images/monster_slime_sad.png",
    happyImg: "images/monster_slime_happy.png",
    hp: 3,
    emotions: ["害怕", "孤單", "沮喪"],
    negativeLines: [
      "嗚嗚…沒有人理我…",
      "我好孤單…",
      "是不是都是我的錯…"
    ],
    positiveLines: [
      "欸？你願意陪我嗎…？",
      "我覺得好像沒那麼孤單了…",
      "謝謝你…我心裡暖暖的。"
    ]
  },

  {
    name: "抓狂小惡魔 🔥",
    img: "images/monster_devil_angry.png",
    happyImg: "images/monster_devil_happy.png",
    hp: 3,
    emotions: ["生氣", "嫉妒", "煩躁"],
    negativeLines: [
      "走開啦！不要煩我！",
      "為什麼別人都有？！",
      "我現在超級煩！！"
    ],
    positiveLines: [
      "欸…你竟然不怕我。",
      "好啦我冷靜一點…",
      "謝謝你，我好像不那麼生氣了。"
    ]
  }
];

/* ----------------------------------
   魔王資料
---------------------------------- */
const boss = {
  name: "壞情緒巨獸・暗影烏魯魯",
  img: "images/boss_dark.png",
  happyImg: "images/boss_light.png",
  hp: 6,
  stageLines: [
    "你阻止不了我…",
    "不要靠近…我會傷害你…",
    "其實我…好累…",
    "謝謝你……願意走近我。"
  ]
};


/* ----------------------------------
   遊戲狀態
---------------------------------- */
let currentMonsterIndex = 0;
let currentMonster = null;
let playerHP = 3;
let gameStage = "monster"; // monster / boss / end


/* ----------------------------------
   工具函式
---------------------------------- */
function rand(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function playHeroVoice() {
  const voices = [
    "audio/voice_1.mp3",
    "audio/voice_2.mp3",
    "audio/voice_3.mp3"
  ];
  const audio = new Audio(rand(voices));
  audio.play();
}

function animateMonster(type) {
  const m = document.getElementById("monster-img");
  m.classList.remove("shake", "sad", "happy");

  if (type === "hurt") m.classList.add("shake");
  if (type === "sad") m.classList.add("sad");
  if (type === "happy") m.classList.add("happy");
}


/* ----------------------------------
   初始化魔物
---------------------------------- */
function loadMonster() {
  currentMonster = JSON.parse(JSON.stringify(monsters[currentMonsterIndex]));

  document.getElementById("monster-name").innerText = currentMonster.name;
  document.getElementById("monster-img").src = currentMonster.img;
  document.getElementById("monster-hp").innerText = `壞情緒值：${currentMonster.hp}`;
  document.getElementById("log").innerText = "請選擇你的拳～";
}


/* ----------------------------------
   出拳
---------------------------------- */
function play(move) {
  if (gameStage === "end") return;
  if (gameStage === "boss") {
    return playBoss(move);
  }

  const moves = ["石頭", "剪刀", "布"];
  const monsterMove = rand(moves);

  let result = "";

  // 平手
  if (move === monsterMove) {
    result = `平手！你出 ${move}，魔物也出 ${monsterMove}`;
    animateMonster("sad");
  }

  // 勝利
  else if (
    (move === "石頭" && monsterMove === "剪刀") ||
    (move === "剪刀" && monsterMove === "布") ||
    (move === "布" && monsterMove === "石頭")
  ) {
    const emotion = currentMonster.emotions.pop();
    currentMonster.hp--;

    result = `🎉 你安撫了魔物的「${emotion}」！`;

    playHeroVoice();
    animateMonster("hurt");

    if (currentMonster.hp <= 0) return finishMonster();
  }

  // 失敗
  else {
    result = `魔物的壞情緒影響你 😣（扣 1 好心情）`;
    playerHP--;

    animateMonster("sad");

    if (playerHP <= 0) return startBossBattle();
  }

  document.getElementById("log").innerText = result;
  document.getElementById("monster-hp").innerText = `壞情緒值：${currentMonster.hp}`;
}


/* ----------------------------------
   魔物安撫完成
---------------------------------- */
function finishMonster() {
  animateMonster("happy");
  document.getElementById("monster-img").src = currentMonster.happyImg;
  document.getElementById("monster-hp").innerText = "壞情緒消失了！";

  document.getElementById("log").innerText = `${currentMonster.name} 開心了！`;

  // 開啟占卜
  setTimeout(() => openFortune(), 900);

  // 換下一隻魔物
  setTimeout(() => {
    currentMonsterIndex++;
    if (currentMonsterIndex >= monsters.length) startBossBattle();
    else loadMonster();
  }, 2000);
}


/* ----------------------------------
   熊熊占卜彈跳視窗
---------------------------------- */
function openFortune() {
  const box = document.getElementById("fortune-box");
  const text = document.getElementById("fortune-text");

  const fortunes = [
    "今天的你充滿治癒力 ✨",
    "你的善良會讓世界變得更溫柔 💖",
    "壞情緒只是雲，會散去的 ☁️",
    "你正在成為更勇敢的自己 🌟"
  ];

  text.innerText = rand(fortunes);
  box.style.display = "flex";
}

function closeFortune() {
  document.getElementById("fortune-box").style.display = "none";
}


/* ----------------------------------
   魔王戰
---------------------------------- */
function startBossBattle() {
  gameStage = "boss";

  document.body.classList.add("boss-mode");

  document.getElementById("monster-name").innerText = boss.name;
  document.getElementById("monster-img").src = boss.img;
  document.getElementById("monster-hp").innerText = `魔王情緒值：${boss.hp}`;
  document.getElementById("log").innerText = "魔王降臨……牠的壞情緒壓得你喘不過氣！";
}

function playBoss(move) {
  boss.hp--;
  animateMonster("hurt");

  const stageLine = boss.stageLines[Math.floor((6 - boss.hp) / 2)] || "";

  document.getElementById("log").innerText =
    `你成功安撫魔王的一點情緒！\n${stageLine}`;

  document.getElementById("monster-hp").innerText = `魔王情緒值：${boss.hp}`;

  if (boss.hp <= 0) endBoss();
}


/* ----------------------------------
   魔王安撫完成（結局）
---------------------------------- */
function endBoss() {
  gameStage = "end";

  animateMonster("happy");
  document.getElementById("monster-img").src = boss.happyImg;

  document.getElementById("log").innerText =
    "✨ 你成功治癒了魔王！星星王國恢復和平！ ✨";

  document.getElementById("monster-hp").innerText = "情緒完全被淨化";
}


/* ----------------------------------
   初始化
---------------------------------- */
loadMonster();
