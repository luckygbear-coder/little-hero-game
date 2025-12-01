// 小勇者之旅大冒險 - 純 HTML 版核心邏輯

const HERO_MAX_HEARTS = 3; // 小勇者好心情
const MONSTER_MAX_HEARTS = 6; // 魔王 6 個壞情緒
const HERO_MAX_STARS = 2; // 勇氣星星可用次數

let heroHearts;
let monsterHearts;
let heroStars;
let isGameOver = false;

const heroHeartsEl = document.getElementById("hero-hearts");
const monsterHearts
