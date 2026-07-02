const CREATURE_CHOICES = [
  "leafsprout",
  "embertail",
  "bubblecub",
  "sparkbit",
  "moonpuff",
  "rockhorn",
  "windwing",
  "mudmole",
  "frostfin",
  "sunbun",
  "shadowbat",
  "crystalotter",
];

const BOSS_POOL = ["graniteox", "stormowl", "flameleo", "tidalwhale", "thornrex", "starlion"];
const AUDIO_ROOT = "assets/audio/";
const SFX_FILES = {
  attack: "sfx/attack.mp3",
  correct: "sfx/correct.mp3",
  wrong: "sfx/wrong.mp3",
  guard: "sfx/guard.mp3",
  perfect: "sfx/perfect.mp3",
  win: "sfx/win.mp3",
  lose: "sfx/lose.mp3",
};
const SFX_VOLUMES = {
  attack: 0.58,
  correct: 0.5,
  wrong: 0.42,
  guard: 0.52,
  perfect: 0.58,
  win: 0.52,
  lose: 0.48,
};
const CREATURES = {
  leafsprout: { id: 1, name: "葉芽獸", types: ["草葉"], hp: 48, attack: 50, defense: 52, color: "#63c98d" },
  embertail: { id: 2, name: "焰尾獸", types: ["火焰"], hp: 44, attack: 62, defense: 42, color: "#f47c48" },
  bubblecub: { id: 3, name: "泡泡熊", types: ["水流"], hp: 54, attack: 48, defense: 64, color: "#5aa9e6" },
  sparkbit: { id: 4, name: "電芽兔", types: ["閃電"], hp: 42, attack: 66, defense: 38, color: "#f6c344" },
  moonpuff: { id: 5, name: "月絨球", types: ["月光"], hp: 82, attack: 42, defense: 36, color: "#f3a7c8" },
  rockhorn: { id: 6, name: "岩角犀", types: ["岩石"], hp: 70, attack: 58, defense: 78, color: "#8f8177" },
  windwing: { id: 7, name: "風翼鳥", types: ["疾風"], hp: 45, attack: 60, defense: 44, color: "#8bd3ff" },
  mudmole: { id: 8, name: "泥土鼴", types: ["大地"], hp: 62, attack: 54, defense: 68, color: "#b98b62" },
  frostfin: { id: 9, name: "霜鰭鯨", types: ["冰水"], hp: 76, attack: 52, defense: 60, color: "#64b6d9" },
  sunbun: { id: 10, name: "陽光兔", types: ["光芒"], hp: 50, attack: 58, defense: 50, color: "#ffd166" },
  shadowbat: { id: 11, name: "影翼蝠", types: ["暗影"], hp: 40, attack: 72, defense: 34, color: "#6f5aa8" },
  crystalotter: { id: 12, name: "晶河獺", types: ["水晶"], hp: 56, attack: 58, defense: 58, color: "#6fc4e8" },
  graniteox: { id: 101, name: "花崗牛", types: ["岩石"], hp: 92, attack: 70, defense: 94, color: "#7d8388" },
  stormowl: { id: 102, name: "雷雲鴞", types: ["雷風"], hp: 74, attack: 82, defense: 62, color: "#8b7cf6" },
  flameleo: { id: 103, name: "赤焰獅", types: ["火焰"], hp: 82, attack: 92, defense: 64, color: "#df6d38" },
  tidalwhale: { id: 104, name: "潮汐鯨", types: ["海潮"], hp: 116, attack: 78, defense: 84, color: "#3ba7d8" },
  thornrex: { id: 105, name: "棘冠龍", types: ["森林"], hp: 96, attack: 88, defense: 88, color: "#4f9f6b" },
  starlion: { id: 106, name: "星耀獅", types: ["星光"], hp: 108, attack: 96, defense: 82, color: "#b78ee8" },
};

const DIFFICULTIES = {
  low: {
    label: "低",
    name: "低年級",
    baseMax: 18,
    stageStep: 4,
    operations: ["+", "-"],
    bossSpeed: 0.72,
    bossDamage: 0.72,
    defenseReduction: 0.18,
  },
  mid: {
    label: "中",
    name: "中年級",
    baseMax: 28,
    stageStep: 7,
    operations: ["+", "-", "×", "÷"],
    bossSpeed: 0.9,
    bossDamage: 0.92,
    defenseReduction: 0.25,
  },
  high: {
    label: "高",
    name: "高年級",
    baseMax: 42,
    stageStep: 10,
    operations: ["+", "-", "×", "÷"],
    bossSpeed: 1.05,
    bossDamage: 1.08,
    defenseReduction: 0.32,
  },
};

const state = {
  player: null,
  boss: null,
  playerHp: 100,
  playerMaxHp: 100,
  bossHp: 120,
  bossMaxHp: 120,
  stage: 1,
  combo: 0,
  correct: 0,
  attempted: 0,
  difficulty: "mid",
  operationMode: "mixed",
  maxNumber: 60,
  allowCarry: true,
  currentQuestion: null,
  playerAtg: 0,
  bossAtg: 0,
  playerReady: false,
  activeQuestion: false,
  questionMode: "waiting",
  pendingBossDamage: 0,
  bossPendingDefense: false,
  paused: false,
  lastTick: 0,
  loopId: 0,
  locked: false,
  phase: "select",
  submitting: false,
  mistakes: [],
  result: "playing",
  retryQueue: [],
  retryIndex: 0,
  selectedMove: "quick",
  chargeBonus: 0,
  guardBoost: false,
  nextAtgPenalty: 0,
  defenseStartedAt: 0,
  defenseTimerId: 0,
  defenseTimeLimit: 8,
  defenseRemaining: 8,
  audioUnlocked: false,
  soundOn: true,
  bgmOn: false,
  masterVolume: 0.45,
};

const elements = {
  selectScreen: document.querySelector("#selectScreen"),
  battleScreen: document.querySelector("#battleScreen"),
  creatureGrid: document.querySelector("#creatureGrid"),
  difficultyCards: document.querySelectorAll(".difficulty-card"),
  operationSelect: document.querySelector("#operationSelect"),
  maxNumberInput: document.querySelector("#maxNumberInput"),
  allowCarryInput: document.querySelector("#allowCarryInput"),
  difficultyText: document.querySelector("#difficultyText"),
  comboCount: document.querySelector("#comboCount"),
  correctCount: document.querySelector("#correctCount"),
  stageCount: document.querySelector("#stageCount"),
  playerName: document.querySelector("#playerName"),
  bossName: document.querySelector("#bossName"),
  playerSprite: document.querySelector("#playerSprite"),
  bossSprite: document.querySelector("#bossSprite"),
  playerHpText: document.querySelector("#playerHpText"),
  bossHpText: document.querySelector("#bossHpText"),
  playerHpBar: document.querySelector("#playerHpBar"),
  bossHpBar: document.querySelector("#bossHpBar"),
  playerAtgText: document.querySelector("#playerAtgText"),
  bossAtgText: document.querySelector("#bossAtgText"),
  playerAtgBar: document.querySelector("#playerAtgBar"),
  bossAtgBar: document.querySelector("#bossAtgBar"),
  battleMessage: document.querySelector("#battleMessage"),
  questionForm: document.querySelector("#questionForm"),
  commandState: document.querySelector("#commandState"),
  questionText: document.querySelector("#questionText"),
  defenseTimer: document.querySelector("#defenseTimer"),
  defenseTimerText: document.querySelector("#defenseTimerText"),
  answerInput: document.querySelector("#answerInput"),
  attackBtn: document.querySelector("#attackBtn"),
  pauseBtn: document.querySelector("#pauseBtn"),
  nextStageBtn: document.querySelector("#nextStageBtn"),
  restartBtn: document.querySelector("#restartBtn"),
  reviewPanel: document.querySelector("#reviewPanel"),
  reviewList: document.querySelector("#reviewList"),
  retryMistakesBtn: document.querySelector("#retryMistakesBtn"),
  movePanel: document.querySelector("#movePanel"),
  moveCards: document.querySelectorAll(".move-card"),
  classModeBtn: document.querySelector("#classModeBtn"),
  soundToggleBtn: document.querySelector("#soundToggleBtn"),
  bgmToggleBtn: document.querySelector("#bgmToggleBtn"),
  volumeSlider: document.querySelector("#volumeSlider"),
  pauseOverlay: document.querySelector("#pauseOverlay"),
  summaryCards: document.querySelector("#summaryCards"),
  effectsLayer: document.querySelector("#effectsLayer"),
  playerPanel: document.querySelector(".player-panel"),
  bossPanel: document.querySelector(".boss-panel"),
};

const creatureCache = new Map();
const sfxPool = {};
let bgmAudio = null;
let bgmFadeId = 0;

async function fetchCreature(nameOrId) {
  if (creatureCache.has(nameOrId)) return creatureCache.get(nameOrId);
  const creature = createCreature(String(nameOrId));
  creatureCache.set(nameOrId, creature);
  return creature;
}

function createCreature(key) {
  const source = CREATURES[key];
  if (!source) throw new Error(`沒有可用的萌獸資料：${key}`);

  const sprite = createCreatureSprite(source);
  return {
    id: source.id,
    name: source.name,
    sprite,
    backSprite: sprite,
    types: source.types,
    color: source.color,
    attack: source.attack,
    defense: source.defense,
    hp: source.hp,
  };
}

function hexToRgba(hex, alpha) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = num >> 16;
  const g = (num >> 8) & 0x00ff;
  const b = num & 0x0000ff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const TYPE_CATEGORY = {
  草葉: "leafy",
  森林: "leafy",
  大地: "earth",
  火焰: "flame",
  水流: "fin",
  冰水: "fin",
  海潮: "fin",
  閃電: "spark",
  雷風: "spark",
  月光: "glow",
  光芒: "glow",
  星光: "glow",
  岩石: "rock",
  疾風: "wind",
  暗影: "shadow",
  水晶: "crystal",
};

const HEAD_ACCESSORIES = {
  leafy: { cells: [[0, 2], [1, 1], [1, 2], [1, 3]], shade: -18 },
  earth: { cells: [[1, 2], [1, 3]], shade: -12 },
  fin: { cells: [[0, 0], [1, 0], [1, 1]], shade: 22 },
  spark: { cells: [[0, 2], [1, 1], [1, 3]], color: "#ffe066" },
  glow: { cells: [[0, 0], [1, 0], [1, 1], [1, 2]], color: "#fff0b8" },
  rock: { cells: [[0, 3], [1, 2], [1, 3]], shade: -30 },
  crystal: { cells: [[0, 1], [1, 0], [1, 1], [1, 2]], color: "#d7f5ff" },
};

const SIDE_WINGS = {
  wind: { cells: [[3, 7], [4, 7], [4, 8], [5, 7]], shade: -14 },
  shadow: { cells: [[3, 7], [4, 7], [4, 8], [5, 7], [5, 8], [6, 7]], color: "#3a2b57" },
};

const BODY_ROWS = [
  [1, 2, 3],
  [0, 1, 2, 3, 4],
  [0, 1, 2, 3, 4, 5],
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 2, 3, 4, 5],
  [0, 1, 2, 3],
  [1, 2],
];

function shadeColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amount = Math.round((255 * percent) / 100);
  const clamp = (value) => Math.max(0, Math.min(255, value));
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0x00ff) + amount);
  const b = clamp((num & 0x0000ff) + amount);
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

function getCreatureCategory(creature) {
  for (const type of creature.types) {
    if (TYPE_CATEGORY[type]) return TYPE_CATEGORY[type];
  }
  return "leafy";
}

function createCreatureSprite(creature) {
  const cell = 12;
  const cx = 8;
  const cols = cx * 2 + 1;
  const bodyRowOffset = 2;
  const width = cols * cell;
  const height = (BODY_ROWS.length + bodyRowOffset) * cell;

  const category = getCreatureCategory(creature);
  const bodyColor = creature.color;
  const shadeDark = shadeColor(bodyColor, -20);

  let rects = "";
  const pixel = (row, c, color) => {
    const y = row * cell;
    if (c === 0) {
      rects += `<rect x="${cx * cell}" y="${y}" width="${cell}" height="${cell}" fill="${color}"/>`;
    } else {
      rects += `<rect x="${(cx + c) * cell}" y="${y}" width="${cell}" height="${cell}" fill="${color}"/>`;
      rects += `<rect x="${(cx - c) * cell}" y="${y}" width="${cell}" height="${cell}" fill="${color}"/>`;
    }
  };

  const wing = SIDE_WINGS[category];
  if (wing) {
    const wingColor = wing.color ?? shadeColor(bodyColor, wing.shade);
    wing.cells.forEach(([row, c]) => pixel(row + bodyRowOffset, c, wingColor));
  }

  BODY_ROWS.forEach((cs, row) => {
    const color = row >= 6 ? shadeDark : bodyColor;
    cs.forEach((c) => pixel(row + bodyRowOffset, c, color));
  });

  if (category === "flame") {
    pixel(0, 0, "#ffce54");
    pixel(1, 0, "#ff8a3d");
    pixel(1, 1, "#ff8a3d");
  } else {
    const accessory = HEAD_ACCESSORIES[category];
    if (accessory) {
      const color = accessory.color ?? shadeColor(bodyColor, accessory.shade);
      accessory.cells.forEach(([row, c]) => pixel(row, c, color));
    }
  }

  pixel(3 + bodyRowOffset, 2, "#18212f");
  pixel(5 + bodyRowOffset, 0, shadeDark);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">
      <rect width="${width}" height="${height}" rx="16" fill="#f8fafc"/>
      ${rects}
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function loadChoices() {
  elements.creatureGrid.innerHTML = '<div class="loading">正在召喚原創萌獸...</div>';

  try {
    const creatures = await Promise.all(CREATURE_CHOICES.map(fetchCreature));
    elements.creatureGrid.innerHTML = "";
    creatures.forEach((creature) => {
      const card = document.createElement("button");
      card.className = "creature-card";
      card.type = "button";
      card.style.setProperty("--creature-color", creature.color);
      card.style.setProperty("--creature-tint", hexToRgba(creature.color, 0.14));
      card.innerHTML = `
        <div class="creature-avatar">
          <img src="${creature.sprite}" alt="${creature.name}" loading="lazy">
        </div>
        <strong>${creature.name}</strong>
        <span>#${creature.id.toString().padStart(3, "0")} 攻擊 ${creature.attack}</span>
        <div class="type-list">${creature.types
          .map((type) => `<span class="type-pill" style="background:${hexToRgba(creature.color, 0.16)};color:${shadeColor(creature.color, -35)}">${type}</span>`)
          .join("")}</div>
      `;
      card.addEventListener("click", () => startBattle(creature));
      elements.creatureGrid.append(card);
    });
  } catch (error) {
    elements.creatureGrid.innerHTML = `
      <div class="error">
        ${error.message}，請確認網路後再試一次。
        <button id="retryLoadBtn" class="ghost-btn" type="button">重新載入</button>
      </div>
    `;
    document.querySelector("#retryLoadBtn")?.addEventListener("click", loadChoices);
  }
}

function setDifficulty(level) {
  if (state.phase !== "select") return;
  state.difficulty = level;
  elements.difficultyCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.difficulty === level);
  });
  updateHud();
}

function syncQuestionSettings() {
  state.operationMode = elements.operationSelect.value;
  state.maxNumber = clamp(Number(elements.maxNumberInput.value) || 60, 10, 200);
  state.allowCarry = elements.allowCarryInput.checked;
  elements.maxNumberInput.value = state.maxNumber;
}

async function startBattle(player) {
  if (state.phase !== "select") return;
  unlockAudio();
  syncQuestionSettings();
  state.phase = "loading";
  setSelectionEnabled(false);
  state.player = player;
  state.stage = 1;
  state.combo = 0;
  state.correct = 0;
  state.attempted = 0;
  state.mistakes = [];
  state.paused = false;
  state.locked = true;
  state.submitting = false;
  state.result = "playing";
  state.selectedMove = "quick";
  state.chargeBonus = 0;
  state.guardBoost = false;
  state.nextAtgPenalty = 0;
  state.playerMaxHp = 92 + Math.floor(player.hp * 0.72);
  state.playerHp = state.playerMaxHp;
  resetAtg();

  elements.selectScreen.classList.remove("active");
  elements.battleScreen.classList.add("active");
  elements.questionForm.classList.add("hidden");
  elements.reviewPanel.classList.add("hidden");
  elements.summaryCards.innerHTML = "";
  elements.pauseBtn.classList.remove("hidden");
  elements.pauseBtn.textContent = "暫停";
  elements.playerName.textContent = player.name;
  elements.playerSprite.src = player.backSprite;
  elements.playerSprite.alt = player.name;

  try {
    await prepareBoss();
    state.phase = "battle";
    state.locked = false;
    updateHud();
    elements.questionForm.classList.remove("hidden");
    setQuestionWaiting();
    startBattleLoop();
  } catch (error) {
    elements.battleMessage.textContent = `${error.message}，請重新選擇萌獸再試一次。`;
    restart();
  }
}

async function prepareBoss() {
  stopBattleLoop();
  state.locked = true;
  state.paused = false;
  state.submitting = false;
  resetAtg();
  elements.nextStageBtn.classList.add("hidden");
  elements.restartBtn.classList.add("hidden");
  elements.reviewPanel.classList.add("hidden");
  elements.questionForm.classList.add("hidden");
  elements.questionForm.classList.remove("defense-mode");
  elements.questionText.textContent = "準備題目中...";
  elements.battleMessage.textContent = `目前難度：${getDifficulty().name}。新關主登場，ATG 滿後就能行動！`;

  const bossName = BOSS_POOL[(state.stage - 1) % BOSS_POOL.length];
  const boss = await fetchCreature(bossName);
  state.boss = boss;
  state.bossMaxHp = 108 + state.stage * 34 + Math.floor(boss.defense * 0.42);
  state.bossHp = state.bossMaxHp;
  elements.bossName.textContent = boss.name;
  elements.bossSprite.src = boss.sprite;
  elements.bossSprite.alt = boss.name;
  state.locked = false;
}

function getDifficulty() {
  return DIFFICULTIES[state.difficulty];
}

function resetAtg() {
  state.playerAtg = 0;
  state.bossAtg = 0;
  state.playerReady = false;
  state.activeQuestion = false;
  state.questionMode = "waiting";
  state.pendingBossDamage = 0;
  state.bossPendingDefense = false;
  state.currentQuestion = null;
  stopDefenseTimer();
}

function startBattleLoop() {
  stopBattleLoop();
  state.lastTick = performance.now();
  state.loopId = requestAnimationFrame(tickBattle);
}

function stopBattleLoop() {
  if (state.loopId) {
    cancelAnimationFrame(state.loopId);
    state.loopId = 0;
  }
}

function tickBattle(now) {
  if (state.locked) return;

  if (state.paused || state.questionMode === "defense") {
    state.lastTick = now;
    state.loopId = requestAnimationFrame(tickBattle);
    return;
  }

  const difficulty = getDifficulty();
  const delta = Math.min(0.08, (now - state.lastTick) / 1000);
  state.lastTick = now;
  const playerSpeed = Math.max(16, 18 + Math.min(26, state.player.attack * 0.22) - state.nextAtgPenalty);
  const bossSpeed = (20 + Math.min(28, state.boss.attack * 0.2) + state.stage) * difficulty.bossSpeed;

  if (!state.playerReady) {
    state.playerAtg = Math.min(100, state.playerAtg + playerSpeed * delta);
    if (state.playerAtg >= 100) {
      state.playerReady = true;
      openAttackQuestion();
    }
  }

  state.bossAtg = Math.min(100, state.bossAtg + bossSpeed * delta);
  if (state.bossAtg >= 100 && state.questionMode === "waiting") {
    openDefenseQuestion();
  }

  updateHud();
  state.loopId = requestAnimationFrame(tickBattle);
}

function openAttackQuestion() {
  state.activeQuestion = true;
  state.questionMode = "attack";
  state.nextAtgPenalty = 0;
  elements.questionForm.classList.remove("defense-mode");
  elements.movePanel.classList.remove("hidden");
  elements.commandState.textContent = "ATG 已滿，選招式並輸入答案";
  elements.attackBtn.textContent = "攻擊";
  elements.attackBtn.disabled = false;
  elements.answerInput.disabled = false;
  elements.playerAtgBar.classList.add("ready-pulse");
  setQuestion("attack");
  elements.answerInput.focus();
}

function openDefenseQuestion() {
  state.bossAtg = 100;
  state.bossPendingDefense = true;
  state.activeQuestion = true;
  state.questionMode = "defense";
  state.pendingBossDamage = calculateBossDamage();
  elements.questionForm.classList.remove("hidden");
  elements.questionForm.classList.add("defense-mode");
  elements.commandState.textContent = "防禦題：關主攻擊，答對可閃避";
  elements.attackBtn.textContent = "防禦";
  elements.attackBtn.disabled = false;
  elements.answerInput.disabled = false;
  elements.playerAtgBar.classList.remove("ready-pulse");
  elements.movePanel.classList.add("hidden");
  elements.bossAtgBar.classList.add("ready-pulse");
  elements.battleMessage.textContent = `${state.boss.name} 準備攻擊！答對防禦題可以大幅減傷。`;
  setQuestion("defense");
  startDefenseTimer();
  updateHud();
  elements.answerInput.focus();
}

function setQuestionWaiting() {
  state.activeQuestion = false;
  state.questionMode = "waiting";
  elements.questionForm.classList.remove("defense-mode");
  elements.movePanel.classList.add("hidden");
  elements.commandState.textContent = "等待 ATG 蓄滿";
  elements.questionText.textContent = "行動條滿時會出現攻擊或防禦題目";
  elements.answerInput.value = "";
  elements.answerInput.disabled = true;
  elements.attackBtn.disabled = true;
  elements.attackBtn.textContent = "攻擊";
  elements.playerAtgBar.classList.remove("ready-pulse");
  elements.bossAtgBar.classList.remove("ready-pulse");
  stopDefenseTimer();
}

function setQuestion(mode) {
  const question = createQuestion(mode);
  state.currentQuestion = question;
  elements.questionText.textContent = question.text;
  elements.answerInput.value = "";
}

function createQuestion(mode) {
  const difficulty = getDifficulty();
  const pressure = mode === "defense" ? 1 : 0;
  const level = Math.min(6, state.stage + Math.floor(state.correct / 4) + pressure);
  const availableOps = pickOperations(difficulty, level);
  const operation = availableOps[Math.floor(Math.random() * availableOps.length)];
  const max = Math.min(state.maxNumber, difficulty.baseMax + level * difficulty.stageStep);
  let a = randomInt(3, max);
  let b = randomInt(2, Math.max(6, Math.floor(max / 2)));
  let answer;

  if (operation === "+") {
    if (!state.allowCarry) {
      a = randomInt(1, Math.min(89, max));
      b = randomInt(1, Math.min(9, max));
      const room = 9 - (a % 10);
      b = Math.min(b, Math.max(1, room));
    }
    answer = a + b;
  }
  if (operation === "-") {
    if (b > a) [a, b] = [b, a];
    if (!state.allowCarry) {
      a = randomInt(10, Math.max(10, max));
      const ones = a % 10;
      b = randomInt(1, Math.max(1, Math.min(ones || 9, 9)));
    }
    answer = a - b;
  }
  if (operation === "×") {
    const factorMax = Math.min(state.difficulty === "high" ? 12 : 9, Math.max(3, Math.floor(Math.sqrt(max))));
    a = randomInt(2, factorMax);
    b = randomInt(2, Math.min(factorMax, 6 + level));
    answer = a * b;
  }
  if (operation === "÷") {
    const divisorMax = Math.min(state.difficulty === "low" ? 5 : 9, Math.max(2, Math.floor(Math.sqrt(max))));
    b = randomInt(2, divisorMax);
    answer = randomInt(2, Math.max(2, Math.floor(max / b)));
    a = answer * b;
  }

  return {
    mode,
    text: `${a} ${operation} ${b} = ?`,
    answer,
  };
}

function pickOperations(difficulty, level) {
  const operationMap = {
    add: ["+"],
    subtract: ["-"],
    multiply: ["×"],
    divide: ["÷"],
  };

  if (operationMap[state.operationMode]) return operationMap[state.operationMode];

  if (state.difficulty === "low") {
    return level < 4 ? ["+", "-"] : ["+", "-", "×"];
  }
  if (state.difficulty === "mid") {
    return level < 3 ? ["+", "-", "×"] : difficulty.operations;
  }
  return difficulty.operations;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function handleAnswer(event) {
  event.preventDefault();
  if (state.phase === "retry") {
    handleRetryAnswer();
    return;
  }
  if (state.locked || state.paused || state.submitting || !state.activeQuestion || !state.currentQuestion) return;

  const rawAnswer = elements.answerInput.value.trim();
  if (rawAnswer === "") return;

  const guess = Number(rawAnswer);
  if (!Number.isFinite(guess)) return;
  state.submitting = true;
  elements.attackBtn.disabled = true;
  elements.answerInput.disabled = true;

  if (state.questionMode === "defense") {
    resolveDefense(guess);
  } else if (state.questionMode === "attack" && state.playerReady) {
    resolveAttack(guess);
  }

  updateHud();
  state.submitting = false;
}

function resolveAttack(guess) {
  const question = state.currentQuestion;
  state.playerReady = false;
  state.playerAtg = 0;
  state.activeQuestion = false;
  state.attempted += 1;

  if (guess === question.answer) {
    state.combo += 1;
    state.correct += 1;
    const outcome = applySelectedMove();
    const damage = outcome.damage;
    if (damage > 0) state.bossHp = Math.max(0, state.bossHp - damage);
    playAttack(elements.playerSprite, "attack-forward");
    if (damage > 0) {
      playSound("attack");
      showDamage(elements.bossPanel, damage, "miss");
      flashPanel(elements.bossPanel, "hit-flash");
    }
    playSound("correct");
    elements.battleMessage.textContent = outcome.message;
    if (state.bossHp <= 0) {
      winStage();
      return;
    }
  } else {
    state.combo = 0;
    const penalty = Math.round(6 + state.stage * 2.2);
    state.playerHp = Math.max(0, state.playerHp - penalty);
    recordMistake(question, guess, "攻擊題");
    playSound("wrong");
    showDamage(elements.playerPanel, penalty, "miss");
    flashPanel(elements.playerPanel, "hit-flash");
    elements.battleMessage.textContent = `答案是 ${question.answer}。攻擊失手，受到 ${penalty} 點反震傷害。`;
    if (state.playerHp <= 0) {
      loseGame();
      return;
    }
  }

  setQuestionWaiting();
  if (state.bossAtg >= 100 && !state.locked) openDefenseQuestion();
}

function applySelectedMove() {
  const baseDamage = 16 + state.player.attack * 0.2 + state.combo * 3.2 + state.stage * 2.4 + state.chargeBonus;
  state.chargeBonus = 0;

  if (state.selectedMove === "quick") {
    const damage = Math.round(baseDamage * 0.86);
    return { damage, message: `快速攻擊命中！造成 ${damage} 點傷害，下一輪更快出手。` };
  }

  if (state.selectedMove === "heavy") {
    const damage = Math.round(baseDamage * 1.38);
    state.nextAtgPenalty = 8;
    return { damage, message: `重擊成功！造成 ${damage} 點傷害，但下次蓄力稍慢。` };
  }

  if (state.selectedMove === "heal") {
    const heal = Math.round(18 + state.player.hp * 0.16 + state.stage * 2);
    const damage = Math.round(baseDamage * 0.35);
    state.playerHp = Math.min(state.playerMaxHp, state.playerHp + heal);
    showDamage(elements.playerPanel, heal, "heal");
    flashPanel(elements.playerPanel, "guard-flash");
    return { damage, message: `補血成功！恢復 ${heal} HP，並造成 ${damage} 點牽制傷害。` };
  }

  if (state.selectedMove === "charge") {
    const damage = Math.round(baseDamage * 0.25);
    state.chargeBonus = Math.round(baseDamage * 0.75);
    return { damage, message: `蓄力成功！造成 ${damage} 點傷害，下次攻擊會更強。` };
  }

  if (state.selectedMove === "guard") {
    const damage = Math.round(baseDamage * 0.55);
    state.guardBoost = true;
    return { damage, message: `防禦姿態完成！造成 ${damage} 點傷害，下次受擊會再減傷。` };
  }

  const damage = Math.round(baseDamage);
  return { damage, message: `攻擊成功！造成 ${damage} 點傷害。` };
}

function resolveDefense(guess) {
  const question = state.currentQuestion;
  const difficulty = getDifficulty();
  const fullDamage = state.pendingBossDamage;
  const reduction = state.guardBoost ? difficulty.defenseReduction * 0.55 : difficulty.defenseReduction;
  const guardedDamage = Math.max(1, Math.round(fullDamage * reduction));
  const elapsed = (performance.now() - state.defenseStartedAt) / 1000;
  const perfect = guess === question.answer && elapsed <= 3;
  const damage = perfect ? 0 : guess === question.answer ? guardedDamage : fullDamage;
  state.attempted += 1;
  state.guardBoost = false;
  stopDefenseTimer();

  if (perfect) {
    const counter = Math.round(12 + state.player.attack * 0.16 + state.stage * 2);
    state.correct += 1;
    state.bossHp = Math.max(0, state.bossHp - counter);
    playSound("perfect");
    showDamage(elements.playerPanel, 0, "guard");
    showDamage(elements.bossPanel, counter, "miss");
    flashPanel(elements.playerPanel, "guard-flash");
    flashPanel(elements.bossPanel, "hit-flash");
    elements.battleMessage.textContent = `完美閃避！沒有受到傷害，並反擊 ${counter} 點。`;
  } else if (guess === question.answer) {
    state.correct += 1;
    playSound("guard");
    showDamage(elements.playerPanel, damage, "guard");
    flashPanel(elements.playerPanel, "guard-flash");
    elements.battleMessage.textContent = `防禦成功！只受到 ${damage} 點傷害。`;
  } else {
    state.combo = 0;
    recordMistake(question, guess, "防禦題");
    playSound("wrong");
    showDamage(elements.playerPanel, damage, "miss");
    flashPanel(elements.playerPanel, "hit-flash");
    elements.battleMessage.textContent = `防禦失敗，答案是 ${question.answer}。受到 ${damage} 點傷害。`;
  }

  state.playerHp = Math.max(0, state.playerHp - damage);
  state.bossAtg = 0;
  state.pendingBossDamage = 0;
  state.bossPendingDefense = false;
  playAttack(elements.bossSprite, "attack-back");

  if (state.bossHp <= 0) {
    winStage();
    return;
  }

  if (state.playerHp <= 0) {
    loseGame();
    return;
  }

  setQuestionWaiting();
}

function calculateBossDamage() {
  const difficulty = getDifficulty();
  return Math.round((12 + state.boss.attack * 0.15 + state.stage * 4.4) * difficulty.bossDamage);
}

function startDefenseTimer() {
  stopDefenseTimer();
  state.defenseRemaining = state.defenseTimeLimit;
  state.defenseStartedAt = performance.now();
  elements.defenseTimer.classList.remove("hidden");
  updateDefenseTimer();
  state.defenseTimerId = window.setInterval(updateDefenseTimer, 100);
}

function stopDefenseTimer(hide = true) {
  if (state.defenseTimerId) {
    window.clearInterval(state.defenseTimerId);
    state.defenseTimerId = 0;
  }
  if (hide) elements.defenseTimer?.classList.add("hidden");
}

function updateDefenseTimer() {
  if (state.questionMode !== "defense" || state.locked || state.paused) return;
  const remaining = Math.max(0, state.defenseTimeLimit - (performance.now() - state.defenseStartedAt) / 1000);
  state.defenseRemaining = remaining;
  elements.defenseTimerText.textContent = remaining.toFixed(1);
  if (remaining <= 0) {
    resolveDefense(Number.NaN);
    updateHud();
  }
}

function recordMistake(question, guess, type) {
  state.mistakes.push({
    type,
    question: question.text,
    answer: question.answer,
    guess: Number.isNaN(guess) ? "未作答" : guess,
  });
}

function togglePause() {
  if (state.locked || !elements.battleScreen.classList.contains("active")) return;

  state.paused = !state.paused;
  elements.pauseBtn.textContent = state.paused ? "繼續" : "暫停";
  document.body.classList.toggle("paused", state.paused);
  elements.pauseOverlay.classList.toggle("hidden", !state.paused);

  if (state.paused) {
    if (state.questionMode === "defense") {
      state.defenseRemaining = Math.max(
        0,
        state.defenseTimeLimit - (performance.now() - state.defenseStartedAt) / 1000,
      );
      stopDefenseTimer(false);
    }
    stopBattleLoop();
    elements.battleMessage.textContent = "已暫停，ATG 與攻防題都會先停住。";
    elements.answerInput.disabled = true;
    elements.attackBtn.disabled = true;
  } else {
    state.lastTick = performance.now();
    startBattleLoop();
    if (state.questionMode === "defense") {
      state.defenseStartedAt = performance.now() - (state.defenseTimeLimit - state.defenseRemaining) * 1000;
      elements.defenseTimer.classList.remove("hidden");
      state.defenseTimerId = window.setInterval(updateDefenseTimer, 100);
      updateDefenseTimer();
    }
    elements.battleMessage.textContent = "繼續戰鬥！ATG 重新開始流動。";
    if (state.activeQuestion) {
      elements.answerInput.disabled = false;
      elements.attackBtn.disabled = false;
      elements.answerInput.focus();
    }
  }
}

function playAttack(sprite, className) {
  sprite.classList.remove(className);
  window.requestAnimationFrame(() => {
    sprite.classList.add(className);
    window.setTimeout(() => sprite.classList.remove(className), 190);
  });
}

function showDamage(target, amount, type = "") {
  const rect = target.getBoundingClientRect();
  const pop = document.createElement("div");
  pop.className = `damage-pop ${type}`;
  pop.textContent = type === "guard" ? `-${amount} 守住` : `-${amount}`;
  pop.style.left = `${rect.left + rect.width / 2}px`;
  pop.style.top = `${rect.top + rect.height * 0.35}px`;
  elements.effectsLayer.append(pop);
  window.setTimeout(() => pop.remove(), 820);
}

function flashPanel(panel, className) {
  panel.classList.remove(className);
  window.requestAnimationFrame(() => {
    panel.classList.add(className);
    window.setTimeout(() => panel.classList.remove(className), 380);
  });
}

function winStage() {
  state.locked = true;
  state.phase = "stage-clear";
  state.result = "win";
  stopBattleLoop();
  stopDefenseTimer();
  playSound("win");
  stopBgm();
  elements.pauseBtn.classList.add("hidden");
  elements.questionForm.classList.add("hidden");
  elements.movePanel.classList.add("hidden");
  elements.answerInput.disabled = true;
  elements.attackBtn.disabled = true;
  elements.nextStageBtn.classList.remove("hidden");
  elements.battleMessage.textContent = `第 ${state.stage} 關突破！準備挑戰更強的關主。`;
  renderReview();
}

function loseGame() {
  state.locked = true;
  state.paused = false;
  state.phase = "ended";
  state.result = "lose";
  stopBattleLoop();
  stopDefenseTimer();
  playSound("lose");
  stopBgm();
  document.body.classList.remove("paused");
  elements.pauseOverlay.classList.add("hidden");
  elements.pauseBtn.classList.add("hidden");
  elements.questionForm.classList.add("hidden");
  elements.movePanel.classList.add("hidden");
  elements.answerInput.disabled = true;
  elements.attackBtn.disabled = true;
  elements.restartBtn.classList.remove("hidden");
  elements.battleMessage.textContent = `挑戰結束。你答對了 ${state.correct} 題，最高打到第 ${state.stage} 關。`;
  renderReview();
}

function renderReview() {
  elements.reviewPanel.classList.remove("hidden");
  const accuracy = state.attempted ? Math.round((state.correct / state.attempted) * 100) : 0;
  elements.summaryCards.innerHTML = `
    <article class="summary-card"><span>結果</span><strong>${state.result === "win" ? "過關" : "挑戰結束"}</strong></article>
    <article class="summary-card"><span>萌獸</span><strong>${state.player?.name ?? "-"}</strong></article>
    <article class="summary-card"><span>難度</span><strong>${getDifficulty().name}</strong></article>
    <article class="summary-card"><span>答對率</span><strong>${accuracy}%</strong></article>
    <article class="summary-card"><span>錯題</span><strong>${state.mistakes.length}</strong></article>
  `;

  if (state.mistakes.length === 0) {
    elements.retryMistakesBtn.classList.add("hidden");
    elements.reviewList.innerHTML = '<div class="review-item"><div><span>結果</span><strong>沒有錯題，表現很穩！</strong></div></div>';
    return;
  }

  elements.retryMistakesBtn.classList.remove("hidden");
  elements.reviewList.innerHTML = state.mistakes
    .map(
      (item) => `
        <article class="review-item">
          <div><span>${item.type}</span><strong>${item.question}</strong></div>
          <div><span>你的答案</span><strong>${item.guess}</strong></div>
          <div><span>正確答案</span><strong>${item.answer}</strong></div>
        </article>
      `,
    )
    .join("");
}

function startRetryMistakes() {
  if (!state.mistakes.length) return;
  stopBattleLoop();
  stopDefenseTimer();
  state.phase = "retry";
  state.locked = false;
  state.paused = false;
  state.submitting = false;
  state.retryQueue = state.mistakes.map((item) => ({
    text: item.question,
    answer: item.answer,
    mode: "retry",
  }));
  state.retryIndex = 0;
  elements.reviewPanel.classList.add("hidden");
  elements.pauseBtn.classList.add("hidden");
  elements.nextStageBtn.classList.add("hidden");
  elements.restartBtn.classList.remove("hidden");
  elements.movePanel?.classList.add("hidden");
  elements.defenseTimer.classList.add("hidden");
  elements.questionForm.classList.remove("hidden");
  elements.questionForm.classList.remove("defense-mode");
  showRetryQuestion();
}

function showRetryQuestion() {
  const question = state.retryQueue[state.retryIndex];
  state.currentQuestion = question;
  elements.commandState.textContent = `錯題重練 ${state.retryIndex + 1} / ${state.retryQueue.length}`;
  elements.questionText.textContent = question.text;
  elements.answerInput.value = "";
  elements.answerInput.disabled = false;
  elements.attackBtn.disabled = false;
  elements.attackBtn.textContent = "送出";
  elements.answerInput.focus();
}

function handleRetryAnswer() {
  if (state.submitting || !state.currentQuestion) return;
  const rawAnswer = elements.answerInput.value.trim();
  if (rawAnswer === "") return;

  state.submitting = true;
  const guess = Number(rawAnswer);
  if (guess === state.currentQuestion.answer) {
    elements.battleMessage.textContent = "重練答對，繼續下一題。";
  } else {
    elements.battleMessage.textContent = `這題答案是 ${state.currentQuestion.answer}，再記一次。`;
  }

  state.retryIndex += 1;
  if (state.retryIndex >= state.retryQueue.length) {
    state.phase = state.result === "win" ? "stage-clear" : "ended";
    elements.questionForm.classList.add("hidden");
    elements.battleMessage.textContent = "錯題重練完成，回到結算紀錄。";
    renderReview();
  } else {
    showRetryQuestion();
  }
  state.submitting = false;
}

async function goNextStage() {
  if (state.phase !== "stage-clear") return;
  state.stage += 1;
  state.playerHp = Math.min(state.playerMaxHp, state.playerHp + 36);
  state.phase = "loading";
  state.result = "playing";
  stopDefenseTimer();
  elements.pauseBtn.classList.remove("hidden");
  elements.pauseBtn.textContent = "暫停";
  elements.questionForm.classList.add("hidden");
  try {
    await prepareBoss();
    state.phase = "battle";
    updateHud();
    elements.questionForm.classList.remove("hidden");
    setQuestionWaiting();
    if (state.bgmOn) startBgm();
    startBattleLoop();
  } catch (error) {
    state.phase = "stage-clear";
    state.locked = true;
    elements.nextStageBtn.classList.remove("hidden");
    elements.battleMessage.textContent = `${error.message}，稍後再挑戰下一位關主。`;
  }
}

function restart() {
  stopBattleLoop();
  stopDefenseTimer();
  if (state.bgmOn) stopBgm();
  document.body.classList.remove("paused");
  elements.pauseOverlay.classList.add("hidden");
  elements.battleScreen.classList.remove("active");
  elements.selectScreen.classList.add("active");
  elements.questionForm.classList.remove("hidden");
  elements.movePanel.classList.add("hidden");
  elements.reviewPanel.classList.add("hidden");
  elements.pauseBtn.classList.add("hidden");
  state.locked = false;
  state.paused = false;
  state.phase = "select";
  state.result = "playing";
  state.submitting = false;
  setSelectionEnabled(true);
  resetAtg();
  updateHud();
}

function setSelectionEnabled(enabled) {
  elements.difficultyCards.forEach((card) => {
    card.disabled = !enabled;
  });
  elements.operationSelect.disabled = !enabled;
  elements.maxNumberInput.disabled = !enabled;
  elements.allowCarryInput.disabled = !enabled;
}

function setMove(move) {
  if (state.questionMode !== "attack") return;
  state.selectedMove = move;
  elements.moveCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.move === move);
  });
}

function unlockAudio() {
  if (state.audioUnlocked) return;
  state.audioUnlocked = true;
  Object.keys(SFX_FILES).forEach((kind) => {
    getSfxAudio(kind);
  });
  if (state.bgmOn) startBgm();
}

function getSfxAudio(kind) {
  if (!sfxPool[kind]) sfxPool[kind] = [];
  const pool = sfxPool[kind];
  const idle = pool.find((audio) => audio.paused || audio.ended);
  if (idle) {
    idle.currentTime = 0;
    return idle;
  }
  if (pool.length < 3) {
    const audio = new Audio(AUDIO_ROOT + SFX_FILES[kind]);
    audio.preload = "auto";
    pool.push(audio);
    return audio;
  }
  pool[0].currentTime = 0;
  return pool[0];
}

function playSound(kind) {
  if (!state.soundOn || !state.audioUnlocked || !SFX_FILES[kind]) return;
  const audio = getSfxAudio(kind);
  audio.volume = clamp((SFX_VOLUMES[kind] || 0.5) * state.masterVolume, 0, 1);
  audio.play().catch(() => undefined);
}

function ensureBgm() {
  if (!bgmAudio) {
    bgmAudio = new Audio(AUDIO_ROOT + "bgm/battle-loop.mp3");
    bgmAudio.loop = true;
    bgmAudio.preload = "auto";
  }
  return bgmAudio;
}

function startBgm() {
  if (!state.audioUnlocked || !state.bgmOn) return;
  const audio = ensureBgm();
  window.clearInterval(bgmFadeId);
  audio.volume = 0;
  audio.play().then(() => {
    let step = 0;
    const target = 0.28 * state.masterVolume;
    bgmFadeId = window.setInterval(() => {
      step += 1;
      audio.volume = Math.min(target, (step / 18) * target);
      if (step >= 18) window.clearInterval(bgmFadeId);
    }, 80);
  }).catch(() => undefined);
}

function stopBgm() {
  if (!bgmAudio) return;
  window.clearInterval(bgmFadeId);
  const audio = bgmAudio;
  let step = 12;
  const start = audio.volume;
  bgmFadeId = window.setInterval(() => {
    step -= 1;
    audio.volume = Math.max(0, start * (step / 12));
    if (step <= 0) {
      window.clearInterval(bgmFadeId);
      audio.pause();
    }
  }, 60);
}

function updateAudioUi() {
  elements.soundToggleBtn.textContent = state.soundOn ? "音效：開" : "音效：關";
  elements.bgmToggleBtn.textContent = state.bgmOn ? "BGM：開" : "BGM：關";
  elements.volumeSlider.value = Math.round(state.masterVolume * 100);
  if (bgmAudio && state.bgmOn) bgmAudio.volume = 0.28 * state.masterVolume;
}

function toggleSound() {
  unlockAudio();
  state.soundOn = !state.soundOn;
  updateAudioUi();
}

function toggleBgm() {
  unlockAudio();
  state.bgmOn = !state.bgmOn;
  if (state.bgmOn) startBgm();
  else stopBgm();
  updateAudioUi();
}

function changeVolume() {
  state.masterVolume = clamp(Number(elements.volumeSlider.value) / 100, 0, 1);
  updateAudioUi();
}

function toggleClassMode() {
  document.body.classList.toggle("class-mode");
  const enabled = document.body.classList.contains("class-mode");
  elements.classModeBtn.textContent = enabled ? "一般模式" : "課堂模式";
}

function updateHud() {
  const difficulty = getDifficulty();
  elements.comboCount.textContent = state.combo;
  elements.correctCount.textContent = state.correct;
  elements.stageCount.textContent = state.stage;
  elements.difficultyText.textContent = difficulty.label;
  elements.playerHpText.textContent = `${state.playerHp} / ${state.playerMaxHp}`;
  elements.bossHpText.textContent = `${state.bossHp} / ${state.bossMaxHp}`;
  elements.playerHpBar.style.width = `${Math.max(0, (state.playerHp / state.playerMaxHp) * 100)}%`;
  elements.bossHpBar.style.width = `${Math.max(0, (state.bossHp / state.bossMaxHp) * 100)}%`;
  elements.playerAtgBar.style.width = `${state.playerAtg}%`;
  elements.bossAtgBar.style.width = `${state.bossAtg}%`;
  elements.playerAtgText.textContent = state.playerReady ? "可攻擊" : state.paused ? "暫停" : "蓄力中";
  elements.bossAtgText.textContent =
    state.questionMode === "defense" || state.bossPendingDefense
      ? "攻擊中"
      : state.paused
        ? "暫停"
        : state.bossAtg >= 92
          ? "危險"
          : "蓄力中";
}

elements.difficultyCards.forEach((card) => {
  card.addEventListener("click", () => setDifficulty(card.dataset.difficulty));
});
elements.moveCards.forEach((card) => {
  card.addEventListener("click", () => setMove(card.dataset.move));
});
elements.questionForm.addEventListener("submit", handleAnswer);
elements.pauseBtn.addEventListener("click", togglePause);
elements.nextStageBtn.addEventListener("click", goNextStage);
elements.restartBtn.addEventListener("click", restart);
elements.retryMistakesBtn.addEventListener("click", startRetryMistakes);
elements.classModeBtn.addEventListener("click", toggleClassMode);
elements.soundToggleBtn.addEventListener("click", toggleSound);
elements.bgmToggleBtn.addEventListener("click", toggleBgm);
elements.volumeSlider.addEventListener("input", changeVolume);

updateAudioUi();
updateHud();
loadChoices();
