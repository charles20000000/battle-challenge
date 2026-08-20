const CHALLENGES = {
  fun: [
    ["NE RIGOLE PAS 😂", "Essaie de faire rire ton adversaire sans parler.", "FUN"],
    ["IMITATION 💀", "Imite une célébrité. Ton adversaire doit deviner.", "FUN"],
    ["DANSE IMPROVISÉE", "Danse pendant 10 secondes sans musique.", "FUN"],
    ["VOIX BIZARRE", "Dis ton prénom avec la voix la plus ridicule possible.", "FUN"],
    ["STATUE", "Reste parfaitement immobile pendant 10 secondes.", "FUN"],
    ["RAP EXPRESS", "Fais une phrase qui rime avec « banane ».", "FUN"],
    ["MOT INTERDIT", "Pendant 20 secondes, ne dis pas « oui ».", "FUN"]
  ],

  quiz: [
    ["OCÉAN", "Quel est le plus grand océan de la Terre ?", "QUIZ", "pacifique"],
    ["HEXAGONE", "Combien de côtés possède un hexagone ?", "QUIZ", "6"],
    ["PLANÈTE ROUGE", "Quelle planète est surnommée la planète rouge ?", "QUIZ", "mars"],
    ["SEMAINE", "Combien y a-t-il de jours dans une semaine ?", "QUIZ", "7"],
    ["ROI DE LA JUNGLE", "Quel animal est souvent appelé le roi de la jungle ?", "QUIZ", "lion"],
    ["CAPITALE", "Quelle est la capitale de la France ?", "QUIZ", "paris"],
    ["CONTINENTS", "Combien y a-t-il de continents selon le modèle le plus courant ?", "QUIZ", "7"]
  ],

  speed: [
    ["RÉACTION ⚡", "Attends le signal puis appuie le plus vite possible.", "RAPIDE", "timer"],
    ["5 FRUITS", "Donne 5 fruits en moins de 5 secondes.", "RAPIDE"],
    ["3 PAYS", "Donne 3 pays en moins de 3 secondes.", "RAPIDE"],
    ["COULEUR", "Trouve quelque chose de bleu autour de toi.", "RAPIDE"],
    ["COMPTE À REBOURS", "Compte de 10 à 1 le plus rapidement possible.", "RAPIDE"]
  ],

  chaos: [
    ["DÉFI SURPRISE 💀", "Fais 5 squats puis dis « JE SUIS LE CHAMPION ! »", "CHAOS"],
    ["PILE OU FACE", "Choisis pile ou face. Ton adversaire choisit aussi.", "CHAOS"],
    ["PIERRE-PAPIER-CISEAUX", "Faites une manche. Le gagnant marque le point.", "CHAOS"],
    ["MÉMOIRE", "Ton adversaire dit 4 mots. Répète-les dans l'ordre.", "CHAOS"],
    ["NOMBRE SECRET", "Choisis un nombre entre 1 et 5. Ton adversaire fait pareil.", "CHAOS"],
    ["QUESTION ABSURDE", "Explique pourquoi les pingouins seraient de bons présidents.", "CHAOS"],
    ["MOT IMPOSSIBLE", "Dis un mot très long sans te tromper.", "CHAOS"]
  ]
};

const DAILY = [
  ["Battle éclair", "Trouve 5 pays en moins de 10 secondes."],
  ["Défi mémoire", "Mémorise 5 mots puis répète-les."],
  ["Mode chaos", "Ton adversaire choisit ton défi."],
  ["Question surprise", "Réponds sans réfléchir trop longtemps."],
  ["Défi du jour", "Fais quelque chose qui fera rire ton adversaire."]
];

let state = {
  xp: Number(localStorage.bc_xp) || 0,
  wins: Number(localStorage.bc_wins) || 0,
  battles: Number(localStorage.bc_battles) || 0,
  streak: Number(localStorage.bc_streak) || 0,
  best: Number(localStorage.bc_best) || 0,
  name: localStorage.bc_name || "Challenger",

  currentMode: "fun",
  current: 0,
  list: [],
  player: 0,
  opponent: 0,

  lastResult: null,
  incoming: null,
  creatorScore: null
};

let timerInterval = null;

const $ = id => document.getElementById(id);

function save() {
  localStorage.bc_xp = state.xp;
  localStorage.bc_wins = state.wins;
  localStorage.bc_battles = state.battles;
  localStorage.bc_streak = state.streak;
  localStorage.bc_best = state.best;
  localStorage.bc_name = state.name;
}

function level() {
  return Math.floor(state.xp / 250) + 1;
}

function levelXP() {
  return state.xp % 250;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = $(id);

  if (target) {
    target.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  updateNav(id);
}

function updateNav(id) {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  if (id === "home") {
    document.querySelectorAll(".nav-btn")[0]?.classList.add("active");
  }

  if (id === "battle") {
    document.querySelectorAll(".nav-btn")[1]?.classList.add("active");
  }

  if (id === "profile") {
    document.querySelectorAll(".nav-btn")[3]?.classList.add("active");
  }
}

function goHome() {
  clearInterval(timerInterval);
  showScreen("home");
  updateUI();
}

function showToast(message) {
  const toast = $("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timeout);

  showToast.timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function updateDaily() {
  const index =
    Math.floor(Date.now() / 86400000) % DAILY.length;

  if ($("dailyTitle")) {
    $("dailyTitle").textContent = DAILY[index][0];
  }

  if ($("dailyDescription")) {
    $("dailyDescription").textContent = DAILY[index][1];
  }
}

function getBadges() {
  const badges = [];

  if (state.wins >= 1)
    badges.push("🏆 Première victoire");

  if (state.wins >= 5)
    badges.push("⚔️ Challenger");

  if (state.wins >= 10)
    badges.push("🔥 10 victoires");

  if (state.streak >= 7)
    badges.push("🔥 Streak 7");

  if (state.streak >= 30)
    badges.push("👑 Légende");

  if (state.xp >= 1000)
    badges.push("⭐ 1000 XP");

  if (state.battles >= 50)
    badges.push("💀 50 battles");

  return badges;
}

function updateUI() {
  const currentLevel = level();
  const progress = (levelXP() / 250) * 100;

  if ($("levelBadge"))
    $("levelBadge").textContent = currentLevel;

  if ($("homeXP"))
    $("homeXP").textContent = state.xp;

  if ($("homeWins"))
    $("homeWins").textContent = state.wins;

  if ($("homeStreak"))
    $("homeStreak").textContent = state.streak;

  if ($("profileName"))
    $("profileName").textContent = state.name;

  if ($("profileLevel"))
    $("profileLevel").textContent = currentLevel;

  if ($("profileXP"))
    $("profileXP").textContent = state.xp + " XP";

  if ($("profileWins"))
    $("profileWins").textContent = state.wins;

  if ($("profileStreak"))
    $("profileStreak").textContent = state.streak;

  if ($("profileBattles"))
    $("profileBattles").textContent = state.battles;

  if ($("profileBest"))
    $("profileBest").textContent = state.best;

  if ($("profileXPBar"))
    $("profileXPBar").style.width = progress + "%";

  if ($("levelText")) {
    const remaining = 250 - levelXP();

    $("levelText").textContent =
      remaining +
      " XP avant le niveau " +
      (currentLevel + 1) +
      ".";
  }

  updateDaily();

  const badges = getBadges();

  if ($("badgesList")) {
    $("badgesList").innerHTML =
      badges.length > 0
        ? badges
            .map(b => `<span class="badge">${b}</span>`)
            .join("")
        : '<span class="muted">Joue pour débloquer ton premier badge.</span>';
  }
}

function showProfile() {
  showScreen("profile");
  updateUI();
}

function changeName() {
  const name = prompt(
    "Ton pseudo :",
    state.name
  );

  if (!name || !name.trim()) return;

  state.name =
    name.trim().slice(0, 18);

  save();
  updateUI();

  showToast("👤 Pseudo mis à jour !");
}

function startBattle(mode) {
  clearInterval(timerInterval);

  state.incoming = null;
  state.creatorScore = null;

  state.currentMode =
    mode ||
    ["fun", "quiz", "speed", "chaos"][
      Math.floor(Math.random() * 4)
    ];

  state.list =
    shuffle(CHALLENGES[state.currentMode])
      .slice(0, 5);

  state.current = 0;
  state.player = 0;
  state.opponent = 0;

  if ($("opponentName"))
    $("opponentName").textContent =
      "ADVERSAIRE";

  if ($("incomingBanner"))
    $("incomingBanner")
      .classList.add("hidden");

  showScreen("battle");

  loadChallenge();
}

function startDaily() {
  const index =
    Math.floor(Date.now() / 86400000) % DAILY.length;

  clearInterval(timerInterval);

  state.incoming = null;
  state.creatorScore = null;

  state.currentMode = "chaos";

  state.list = [
    [
      DAILY[index][0],
      DAILY[index][1],
      "BATTLE DU JOUR"
    ]
  ];

  state.current = 0;
  state.player = 0;
  state.opponent = 0;

  showScreen("battle");

  loadChallenge();
}

function loadChallenge() {
  clearInterval(timerInterval);

  const challenge =
    state.list[state.current];

  if (!challenge) {
    finishBattle();
    return;
  }

  if ($("battleMode"))
    $("battleMode").textContent =
      state.currentMode.toUpperCase();

  if ($("challengeNumber"))
    $("challengeNumber").textContent =
      `Défi ${state.current + 1}/${state.list.length}`;

  if ($("challengeCategory"))
    $("challengeCategory").textContent =
      challenge[2];

  if ($("challengeTitle"))
    $("challengeTitle").textContent =
      challenge[0];

  if ($("challengeText"))
    $("challengeText").textContent =
      challenge[1];

  if ($("playerScore"))
    $("playerScore").textContent =
      state.player;

  if ($("opponentScore"))
    $("opponentScore").textContent =
      state.incoming
        ? state.creatorScore
        : state.opponent;

  if ($("progressBar")) {
    $("progressBar").style.width =
      (state.current / state.list.length) * 100 +
      "%";
  }

  if ($("timer")) {
    $("timer").classList.add("hidden");
    $("timer").textContent = "3";
  }

  const button = $("challengeButton");

  if (!button) return;

  button.disabled = false;
  button.textContent =
    challenge[3] === "timer"
      ? "⚡ COMMENCER"
      : "RELEVER LE DÉFI";

  button.onclick = doChallenge;
}

function doChallenge() {
  const challenge =
    state.list[state.current];

  if (!challenge) return;

  if (challenge[3] === "timer") {
    speedChallenge();
    return;
  }

  let won;

  if (
    challenge[2] === "QUIZ" &&
    challenge[3]
  ) {
    const answer =
      prompt(challenge[1]);

    won =
      !!answer &&
      answer
        .trim()
        .toLowerCase() ===
        challenge[3];

    showToast(
      won
        ? "🧠 Bonne réponse !"
        : "❌ Mauvaise réponse !"
    );
  } else {
    won = Math.random() > 0.4;

    showToast(
      won
        ? "🔥 Tu marques le point !"
        : "💀 Ton adversaire marque !"
    );
  }

  if (won) {
    state.player++;
  } else {
    state.opponent++;
  }

  nextChallenge();
}

function speedChallenge() {
  const button = $("challengeButton");
  const timer = $("timer");

  if (!button || !timer) return;

  button.disabled = true;
  button.textContent = "ATTENDS...";

  timer.classList.remove("hidden");

  let count = 3;

  timer.textContent = count;

  timerInterval =
    setInterval(() => {
      count--;

      if (count > 0) {
        timer.textContent = count;
        return;
      }

      clearInterval(timerInterval);

      timer.textContent = "⚡";
      button.disabled = false;
      button.textContent = "TOUCHE !";

      button.onclick = () => {
        const won =
          Math.random() > 0.35;

        if (won) {
          state.player++;
          showToast("⚡ Réaction parfaite !");
        } else {
          state.opponent++;
          showToast("😭 Trop lent !");
        }

        nextChallenge();
      };
    }, 1000);
}

function nextChallenge() {
  setTimeout(() => {
    state.current++;

    if (
      state.current <
      state.list.length
    ) {
      loadChallenge();
    } else {
      finishBattle();
    }
  }, 500);
}

function finishBattle() {
  clearInterval(timerInterval);

  state.battles++;

  const opponentScore =
    state.incoming
      ? state.creatorScore
      : state.opponent;

  let won =
    state.player > opponentScore;

  if (state.player === opponentScore) {
    won = Math.random() > 0.5;
  }

  const oldLevel = level();

  let earned =
    won ? 100 : 35;

  if (state.incoming)
    earned += 25;

  if (won && state.streak >= 7)
    earned += 25;

  if (won) {
    state.wins++;
    state.streak++;
  } else {
    state.streak = 0;
  }

  state.xp += earned;

  state.best =
    Math.max(
      state.best,
      state.player
    );

  const newLevel = level();

  state.lastResult = {
    won,
    earned,
    player: state.player,
    opponent: opponentScore,
    mode: state.currentMode
  };

  save();

  if ($("finalPlayerScore"))
    $("finalPlayerScore").textContent =
      state.player;

  if ($("finalOpponentScore"))
    $("finalOpponentScore").textContent =
      opponentScore;

  if ($("earnedXP"))
    $("earnedXP").textContent =
      "+" + earned + " XP";

  if ($("resultLevel"))
    $("resultLevel").textContent =
      newLevel;

  if ($("resultStreak"))
    $("resultStreak").textContent =
      state.streak;

  if ($("resultEmoji"))
    $("resultEmoji").textContent =
      won ? "🏆" : "💀";

  if ($("resultTitle"))
    $("resultTitle").textContent =
      won ? "VICTOIRE !" : "DÉFAITE !";

  if ($("resultSubtitle")) {
    if (state.incoming) {
      $("resultSubtitle").textContent =
        `Tu as affronté ${state.incoming.name}.`;
    } else if (newLevel > oldLevel) {
      $("resultSubtitle").textContent =
        `🎉 Niveau ${newLevel} débloqué !`;
    } else {
      $("resultSubtitle").textContent =
        "Bien joué. Remets ça.";
    }
  }

  if ($("badgeResult"))
    $("badgeResult").classList.add("hidden");

  updateUI();

  showScreen("result");
}

function rematch() {
  startBattle(state.currentMode);
}

function encodeData(data) {
  return btoa(
    unescape(
      encodeURIComponent(
        JSON.stringify(data)
      )
    )
  );
}

function decodeData(data) {
  try {
    return JSON.parse(
      decodeURIComponent(
        escape(atob(data))
      )
    );
  } catch {
    return null;
  }
}

function makeChallengeUrl() {
  if (!state.lastResult)
    return location.href;

  const data = {
    id: Date.now().toString(36),
    name: state.name,
    score: state.lastResult.player,
    mode: state.lastResult.mode,
    created: Date.now()
  };

  return (
    location.origin +
    location.pathname +
    "?challenge=" +
    encodeURIComponent(
      encodeData(data)
    )
  );
}

function createFriendChallenge() {
  if (!state.lastResult) {
    showToast(
      "Joue d'abord une battle !"
    );
    return;
  }

  const url =
    makeChallengeUrl();

  if ($("shareLink"))
    $("shareLink").value = url;

  if ($("shareText")) {
    $("shareText").textContent =
      `${state.name} a fait ${state.lastResult.player} point(s) en mode ${state.lastResult.mode.toUpperCase()}. Penses-tu pouvoir faire mieux ?`;
  }

  if ($("shareModal"))
    $("shareModal").classList.remove("hidden");
}

function openChallengeCreator() {
  showScreen("challengeCreator");
}

function createChallengeAndPlay(mode) {
  startBattle(mode);

  showToast(
    "⚔️ Joue ta battle : ton score servira à défier ton ami."
  );
}

async function copyChallengeLink() {
  const input = $("shareLink");

  if (!input) return;

  try {
    await navigator.clipboard.writeText(
      input.value
    );
  } catch {
    input.select();
    document.execCommand("copy");
  }

  showToast("🔗 Lien copié !");
}

async function nativeShare() {
  const url =
    $("shareLink")?.value || "";

  const text =
    $("shareText")?.textContent || "";

  if (navigator.share) {
    try {
      await navigator.share({
        title: "⚔️ Battle Challenge",
        text,
        url
      });
    } catch {}
  } else {
    copyChallengeLink();
  }
}

async function shareResult() {
  if (!state.lastResult) return;

  const url =
    makeChallengeUrl();

  const text =
    `🏆 ${state.name} vient de faire ${state.lastResult.player} points sur Battle Challenge. Tu penses pouvoir faire mieux ?`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "⚔️ Battle Challenge",
        text,
        url
      });
      return;
    } catch {}
  }

  if ($("shareLink"))
    $("shareLink").value = url;

  if ($("shareText"))
    $("shareText").textContent = text;

  $("shareModal")?.classList.remove("hidden");
}

function checkIncomingChallenge() {
  const code =
    new URLSearchParams(
      location.search
    ).get("challenge");

  if (!code) return;

  const data =
    decodeData(code);

  if (
    !data ||
    !data.name ||
    !data.mode
  ) {
    showToast(
      "❌ Défi invalide."
    );
    return;
  }

  state.incoming = data;
  state.creatorScore =
    Number(data.score) || 0;

  state.currentMode =
    CHALLENGES[data.mode]
      ? data.mode
      : "fun";

  state.list =
    shuffle(
      CHALLENGES[state.currentMode]
    ).slice(0, 5);

  state.current = 0;
  state.player = 0;
  state.opponent = 0;

  if ($("opponentName"))
    $("opponentName").textContent =
      data.name.toUpperCase();

  if ($("incomingBanner")) {
    $("incomingBanner").textContent =
      `⚔️ ${data.name} t'a défié avec ${data.score} point${data.score > 1 ? "s" : ""} !`;

    $("incomingBanner")
      .classList.remove("hidden");
  }

  showScreen("battle");

  loadChallenge();

  history.replaceState(
    {},
    document.title,
    location.pathname
  );
}

function showLeaderboard() {
  const rows = [
    ["🥇", "Alex", 12450],
    ["🥈", "Max", 11320],
    ["🥉", "Sam", 10480],
    ["4", "Léo", 9320],
    ["5", "Thomas", 8750]
  ];

  if (!$("leaderboardList")) return;

  $("leaderboardList").innerHTML =
    rows
      .map(
        row =>
          `<div class="leader-row">
            <span class="rank">${row[0]}</span>
            <span class="leader-name">${row[1]}</span>
            <span class="leader-xp">${row[2].toLocaleString("fr-FR")} XP</span>
          </div>`
      )
      .join("") +

    `<div class="leader-row">
      <span class="rank">#?</span>
      <span class="leader-name">${state.name} <small>(TOI)</small></span>
      <span class="leader-xp">${state.xp.toLocaleString("fr-FR")} XP</span>
    </div>`;

  $("leaderboardModal")
    ?.classList.remove("hidden");
}

function closeLeaderboard() {
  $("leaderboardModal")
    ?.classList.add("hidden");
}

function closeShare() {
  $("shareModal")
    ?.classList.add("hidden");
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    updateUI();
    checkIncomingChallenge();
  }
);
