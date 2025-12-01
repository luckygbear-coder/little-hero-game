// === 小勇者之旅大冒險：完整魔物系統 JS ===

// 魔物資料庫
const monsters = [
  {
    name: "哭哭史萊姆",
    img: "images/monster_slime_sad.png",
    happyImg: "images/monster_slime_happy.png",
    emotions: ["害怕", "孤單", "自責"],
    hp: 3
  },
  {
    name: "抓狂小惡魔",
    img: "images/monster_devil_angry.png",
    happyImg: "images/monster_devil_happy.png",
    emotions: ["生氣", "嫉妒", "煩躁"],
    hp: 3
  }
];

// 魔王
const boss = {
  name: "壞情緒巨獸・暗影烏魯魯",
  img: "images/boss_dark.png",
  happyImg: "images/boss_light.png",
  hp: 6,
  stage: 1
};

// 遊戲狀態
let currentMonster = null;
let playerHP = 3;
let gameStage = "battle"; // battle, boss, end

// === 隨機挑魔物 ===
function pickMonster() {
  currentMonster = JSON.parse(JSON.stringify(monsters[Math.floor(Math.random()*monsters.length)]));
  updateMonsterUI();
}

// 更新畫面上的魔物資訊
function updateMonsterUI() {
  document.getElementById("monster-name").innerText = currentMonster.name;
  document.getElementById("monster-img").src = currentMonster.img;
  document.getElementById("monster-hp").innerText = `壞情緒值：${currentMonster.hp}`;
}

// === 勇者語音 ===
function playHeroVoice() {
  const voices = [
    "audio/voice_1.mp3",
    "audio/voice_2.mp3",
    "audio/voice_3.mp3"
  ];
  const audio = new Audio(voices[Math.floor(Math.random() * voices.length)]);
  audio.play();
}

// === 魔物動畫 ===
function animateMonster(type) {
  const monster = document.getElementById("monster-img");
  monster.classList.remove("shake", "sad", "happy");

  if (type === "hurt") monster.classList.add("shake");
  if (type === "sad") monster.classList.add("sad");
  if (type === "happy") monster.classList.add("happy");
}

// === 猜拳對戰 ===
function play(playerMove) {
  if (gameStage === "end") return;

  const moves = ["石頭", "剪刀", "布"];
  const monsterMove = moves[Math.floor(Math.random()*3)];

  let result = "";

  if (playerMove === monsterMove) {
    result = "平手！魔物好像也在觀察你…";
    animateMonster("sad");
  }
  else if (
    (playerMove === "石頭" && monsterMove === "剪刀") ||
    (playerMove === "剪刀" && monsterMove === "布") ||
    (playerMove === "布" && monsterMove === "石頭")
  ) {
    result = `你安撫了魔物的情緒（${currentMonster.emotions.pop()}）！`;
    currentMonster.hp -= 1;
    animateMonster("hurt");
    playHeroVoice();

    if (currentMonster.hp <= 0) {
      endMonster();
    }
  } else {
    result = "魔物的壞情緒影響了你 😣（扣 1 點好心情）";
    playerHP -= 1;
  }

  document.getElementById("log").innerText = result;
  updateMonsterUI();

  if (playerHP <= 0 && gameStage !== "boss") {
    enterBoss();
  }
}

// === 魔物被安撫完成 ===
function endMonster() {
  document.getElementById("monster-img").src = currentMonster.happyImg;
  animateMonster("happy");

  setTimeout(() => {
    openFortune();
  }, 800);

  setTimeout(() => {
    pickMonster();
  }, 2000);
}

// === 熊熊占卜彈跳視窗 ===
function openFortune() {
  const box = document.getElementById("fortune-box");
  const text = document.getElementById("fortune-text");

  const fortunes = [
    "今天的你充滿了治癒力！任何壞情緒遇到你都會融化～",
    "保持勇敢，世界會溫柔地回應你！",
    "小小的善意，也能照亮黑暗～"
  ];

  text.innerText = fortunes[Math.floor(Math.random() * fortunes.length)];

  box.style.display = "flex";
}

function closeFortune() {
  document.getElementById("fortune-box").style.display = "none";
}

// === 進入魔王戰 ===
function enterBoss() {
  gameStage = "boss";

  document.getElementById("monster-name").innerText = boss.name;
  document.getElementById("monster-img").src = boss.img;
  document.getElementById("monster-hp").innerText = `魔王情緒值：${boss.hp}`;

  document.getElementById("log").innerText = "魔王降臨… 牠的壞情緒壓得你喘不過氣！";
}

// === 對魔王造成安撫 ===
function playBoss(playerMove) {
  if (gameStage !== "boss") return;

  boss.hp -= 1;
  animateMonster("hurt");

  if (boss.hp <= 0) {
    endBoss();
  }

  document.getElementById("monster-hp").innerText = `魔王情緒值：${boss.hp}`;
}

// === 魔王被淨化 ===
function endBoss() {
  animateMonster("happy");
  document.getElementById("monster-img").src = boss.happyImg;
  document.getElementById("log").innerText = "你成功讓魔王恢復好心情！星星王國得救了💫";
  gameStage = "end";
}

// 初始化
pickMonster();