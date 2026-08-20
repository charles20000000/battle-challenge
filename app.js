/* =========================================================
   BATTLE CHALLENGE V2
   Viral Challenge System
   ========================================================= */

/* =========================
   CHALLENGES
========================= */

const challenges = {
  fun: [
    {
      title: "NE RIGOLE PAS 😂",
      text: "Regarde ton adversaire et essaie de le faire rire sans parler.",
      category: "FUN"
    },
    {
      title: "IMITATION 💀",
      text: "Imite une célébrité. Ton adversaire doit deviner qui tu imites.",
      category: "FUN"
    },
    {
      title: "VOIX BIZARRE",
      text: "Dis ton prénom avec la voix la plus ridicule possible.",
      category: "FUN"
    },
    {
      title: "DANSE IMPROVISÉE",
      text: "Danse pendant 10 secondes sans musique.",
      category: "FUN"
    },
    {
      title: "MOT INTERDIT",
      text: "Pendant 30 secondes, tu ne peux pas dire le mot « oui ».",
      category: "FUN"
    }
  ],

  quiz: [
    {
      title: "QUESTION RAPIDE",
      text: "Quel est le plus grand océan de la Terre ?",
      category: "QUIZ",
      answer: "pacifique"
    },
    {
      title: "QUESTION RAPIDE",
      text: "Combien de côtés possède un hexagone ?",
      category: "QUIZ",
      answer: "6"
    },
    {
      title: "QUESTION RAPIDE",
      text: "Quelle planète est surnommée la planète rouge ?",
      category: "QUIZ",
      answer: "mars"
    },
    {
      title: "QUESTION RAPIDE",
      text: "Combien y a-t-il de jours dans une semaine ?",
      category: "QUIZ",
      answer: "7"
    },
    {
      title: "QUESTION RAPIDE",
      text: "Quel animal est connu comme le roi de la jungle ?",
      category: "QUIZ",
      answer: "lion"
    }
  ],

  speed: [
    {
      title: "TOUCHE VITE ⚡",
      text: "Quand le bouton devient vert, appuie dessus le plus vite possible.",
      category: "RAPIDITÉ",
      timer: true
    },
    {
      title: "RÉACTION",
      text: "Compte de 10 à 1 le plus rapidement possible.",
      category: "RAPIDITÉ"
    },
    {
      title: "3 MOTS",
      text: "Trouve 3 fruits en moins de 5 secondes.",
      category: "RAPIDITÉ"
    },
    {
      title: "COULEUR",
      text: "Trouve quelque chose de bleu autour de toi.",
      category: "RAPIDITÉ"
    },
    {
      title: "NOMBRE",
      text: "Donne un nombre entre 1 et 100 en moins de 2 secondes.",
      category: "RAPIDITÉ"
    }
  ],

  chaos: [
    {
      title: "DÉFI SURPRISE 💀",
      text: "Fais 5 squats puis crie « JE SUIS LE CHAMPION ! »",
      category: "CHAOS"
    },
    {
      title: "PIERRE-PAPIER-CISEAUX",
      text: "Faites une partie. Le gagnant marque le point.",
      category: "CHAOS"
    },
    {
      title: "PILE OU FACE",
      text: "Choisis pile ou face avant de lancer une pièce.",
      category: "CHAOS"
    },
    {
      title: "MÉMOIRE",
      text: "Ton adversaire dit 4 mots. Répète-les dans le bon ordre.",
      category: "CHAOS"
    },
    {
      title: "CHANCE",
      text: "Choisis un nombre entre 1 et 5. Ton adversaire fait pareil.",
      category: "CHAOS"
    }
  ]
};


/* =========================
   DAILY CHALLENGES
========================= */

const dailyChallenges = [
  {
    title: "Le défi impossible",
    text: "Ne pas rire pendant 30 secondes."
  },
  {
    title: "Mémoire express",
    text: "Mémorise 7 mots en 10 secondes."
  },
  {
    title: "Battle éclair",
    text: "Trouve 5 objets rouges autour de toi."
  },
  {
    title: "Le plus rapide",
    text: "Donne 5 pays en moins de 5 secondes."
  },
  {
    title: "Mode chaos",
    text: "Ton adversaire choisit ton défi."
  }
];


/* =========================
   PLAYER
========================= */

let state = {
  xp: Number(localStorage.getItem("bc_xp") || 0),
  wins: Number(localStorage.getItem("bc_wins") || 0),
  battles: Number(localStorage.getItem("bc_battles") || 0),
  streak: Number(localStorage.getItem("bc_streak") || 0),
  best: Number(localStorage.getItem("bc_best") || 0),

  playerName:
    localStorage.getItem("bc_name") ||
    "Challenger",

  playerScore: 0,
  opponentScore: 0,

  currentChallenge: 0,
  currentMode: "fun",
  currentChallenges: [],

  lastBattle: null,

  challengeMode: false,
  challengeId: null,
  challengeCreator: null,
  challengeCreatorScore: null
};

let timerInterval = null;


/* =========================
   HELPERS
========================= */

const $ = id => document.getElementById(id);


/* =========================
   ANALYTICS
========================= */

function trackEvent(name, params = {}) {
  if (typeof gtag === "function") {
    gtag("event", name, params);
  }
}


/* =========================
   SAVE
========================= */

function save() {
  localStorage.setItem("bc_xp", state.xp);
  localStorage.setItem("bc_wins", state.wins);
  localStorage.setItem("bc_battles", state.battles);
  localStorage.setItem("bc_streak", state.streak);
  localStorage.setItem("bc_best", state.best);
  localStorage.setItem("bc_name", state.playerName);
}


/* =========================
   LEVEL SYSTEM
========================= */

function getLevel() {
  return Math.floor(state.xp / 250) + 1;
}

function getLevelProgress() {
  return state.xp % 250;
}


/* =========================
   BADGES
========================= */

function getBadges() {
  const badges = [];

  if (state.wins >= 1) badges.push("🏆 Première victoire");
  if (state.wins >= 5) badges.push("⚔️ Challenger");
  if (state.wins >= 10) badges.push("🔥 Sérieux joueur");
  if (state.streak >= 7) badges.push("🔥 Streak 7 jours");
  if (state.streak >= 30) badges.push("👑 Légende");
  if (state.xp >= 1000) badges.push("⭐ 1000 XP");
  if (state.battles >= 50) badges.push("💀 Machine à battles");

  return badges;
}


/* =========================
   NAVIGATION
========================= */

function goHome() {
  showScreen("home");
  updateUI();
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
}


/* =========================
   UI
========================= */

function updateUI() {
  const level = getLevel();
  const currentLevelXP = getLevelProgress();
  const percentage = (currentLevelXP / 250) * 100;

  $("levelBadge").textContent = level;

  $("homeXP").textContent = state.xp;
  $("homeWins").textContent = state.wins;
  $("homeStreak").textContent = state.streak;

  $("profileLevel").textContent = level;
  $("profileXP").textContent = `${state.xp} XP`;
  $("profileWins").textContent = state.wins;
  $("profileStreak").textContent = state.streak;
  $("profileBattles").textContent = state.battles;
  $("profileBest").textContent = state.best;

  $("profileXPBar").style.width = percentage + "%";

  $("levelText").textContent =
    `${250 - currentLevelXP} XP avant le niveau ${level + 1}.`;

  updateDaily();
}


/* =========================
   DAILY
========================= */

function getDailyChallenge() {
  const day = Math.floor(Date.now() / 86400000);

  return dailyChallenges[
    day % dailyChallenges.length
  ];
}

function updateDaily() {
  const daily = getDailyChallenge();

  $("dailyTitle").textContent = daily.title;
  $("dailyDescription").textContent = daily.text;
}

function startDaily() {
  state.challengeMode = false;

  state.currentMode = "chaos";

  trackEvent("daily_challenge_started");

  const daily = getDailyChallenge();

  state.currentChallenges = [{
    title: daily.title,
    text: daily.text,
    category: "BATTLE DU JOUR"
  }];

  state.currentChallenge = 0;
  state.playerScore = 0;
  state.opponentScore = 0;

  showScreen("battle");
  loadChallenge();
}


/* =========================
   START BATTLE
========================= */

function startBattle(mode) {

  if (!mode) {
    const modes = ["fun", "quiz", "speed", "chaos"];

    mode =
      modes[Math.floor(Math.random() * modes.length)];
  }

  state.challengeMode = false;
  state.challengeId = null;

  state.currentMode = mode;

  trackEvent("battle_started", {
    mode
  });

  state.currentChallenges =
    [...challenges[mode]]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

  state.currentChallenge = 0;
  state.playerScore = 0;
  state.opponentScore = 0;

  if ($("opponentName")) {
    $("opponentName").textContent = "ADVERSAIRE";
  }

  showScreen("battle");

  loadChallenge();
}


/* =========================
   LOAD CHALLENGE
========================= */

function loadChallenge() {

  clearInterval(timerInterval);

  const challenge =
    state.currentChallenges[state.currentChallenge];

  if (!challenge) {
    finishBattle();
    return;
  }

  $("battleMode").textContent =
    state.currentMode.toUpperCase();

  $("challengeNumber").textContent =
    `Défi ${state.currentChallenge + 1}/${state.currentChallenges.length}`;

  $("challengeCategory").textContent =
    challenge.category;

  $("challengeTitle").textContent =
    challenge.title;

  $("challengeText").textContent =
    challenge.text;

  $("challengeButton").disabled = false;

  $("challengeButton").textContent =
    challenge.timer
      ? "⚡ COMMENCER"
      : "J'AI RELEVÉ LE DÉFI";

  $("challengeButton").onclick =
    doChallenge;

  $("timer").classList.add("hidden");

  const progress =
    (state.currentChallenge /
      state.currentChallenges.length) * 100;

  $("progressBar").style.width =
    progress + "%";

  $("playerScore").textContent =
    state.playerScore;

  $("opponentScore").textContent =
    state.opponentScore;
}


/* =========================
   DO CHALLENGE
========================= */

function doChallenge() {

  const challenge =
    state.currentChallenges[state.currentChallenge];

  if (challenge.timer) {
    startSpeedChallenge();
    return;
  }

  const playerWins =
    Math.random() > 0.4;

  if (playerWins) {

    state.playerScore++;

    showToast("🔥 Tu marques le point !");

  } else {

    state.opponentScore++;

    showToast("💀 Ton adversaire marque !");
  }

  nextChallenge();
}


/* =========================
   SPEED CHALLENGE
========================= */

function startSpeedChallenge() {

  const button =
    $("challengeButton");

  const timer =
    $("timer");

  button.disabled = true;

  button.textContent =
    "ATTENDS...";

  timer.classList.remove("hidden");

  let seconds = 3;

  timer.textContent =
    seconds;

  timerInterval =
    setInterval(() => {

      seconds--;

      timer.textContent =
        seconds;

      if (seconds <= 0) {

        clearInterval(timerInterval);

        timer.textContent =
          "⚡";

        button.disabled = false;

        button.textContent =
          "TOUCHE !";

        button.onclick = () => {

          if (Math.random() > 0.35) {

            state.playerScore++;

            showToast(
              "⚡ RÉACTION PARFAITE !"
            );

          } else {

            state.opponentScore++;

            showToast(
              "😭 Trop lent !"
            );
          }

          nextChallenge();
        };
      }

    }, 1000);
}


/* =========================
   NEXT
========================= */

function nextChallenge() {

  setTimeout(() => {

    state.currentChallenge++;

    if (
      state.currentChallenge >=
      state.currentChallenges.length
    ) {

      finishBattle();

    } else {

      loadChallenge();
    }

  }, 500);
}


/* =========================
   FINISH BATTLE
========================= */

function finishBattle() {

  clearInterval(timerInterval);

  state.battles++;

  trackEvent(
    "battle_completed",
    {
      mode: state.currentMode
    }
  );

  let won =
    state.playerScore >
    state.opponentScore;

  if (
    state.playerScore ===
    state.opponentScore
  ) {

    won =
      Math.random() > 0.5;
  }

  let earned =
    won ? 100 : 35;

  if (
    state.currentChallenges.length === 1
  ) {

    earned =
      won ? 50 : 20;
  }

  /* Bonus streak */

  if (won && state.streak >= 7) {
    earned += 25;
  }

  state.xp += earned;

  if (won) {

    state.wins++;

    state.streak++;

  } else {

    state.streak = 0;
  }

  state.best =
    Math.max(
      state.best,
      state.playerScore
    );

  const opponentScore =
    state.challengeMode &&
    state.challengeCreatorScore !== null
      ? state.challengeCreatorScore
      : state.opponentScore;

  state.lastBattle = {

    won,

    earned,

    playerScore:
      state.playerScore,

    opponentScore,

    mode:
      state.currentMode,

    challengeId:
      state.challengeId,

    creator:
      state.challengeCreator
  };

  trackEvent(
    won
      ? "battle_won"
      : "battle_lost",
    {
      mode: state.currentMode
    }
  );

  save();

  $("finalPlayerScore").textContent =
    state.playerScore;

  $("finalOpponentScore").textContent =
    opponentScore;

  $("earnedXP").textContent =
    `+${earned} XP`;

  if (won) {

    $("resultEmoji").textContent =
      "🏆";

    $("resultTitle").textContent =
      "VICTOIRE !";

  } else {

    $("resultEmoji").textContent =
      "💀";

    $("resultTitle").textContent =
      "DÉFAITE !";
  }

  showScreen("result");
}


/* =========================
   REMATCH
========================= */

function rematch() {

  startBattle(
    state.currentMode
  );
}


/* =========================================================
   VIRAL CHALLENGE SYSTEM
========================================================= */


/* =========================
   ENCODE
========================= */

function encodeChallenge(data) {

  const json =
    JSON.stringify(data);

  return btoa(
    encodeURIComponent(json)
  );
}


/* =========================
   DECODE
========================= */

function decodeChallenge(code) {

  try {

    const json =
      decodeURIComponent(
        atob(code)
      );

    return JSON.parse(json);

  } catch (error) {

    return null;
  }
}


/* =========================
   CREATE CHALLENGE
========================= */

function createFriendChallenge() {

  if (!state.lastBattle) {

    showToast(
      "Joue d'abord une battle !"
    );

    return;
  }

  const result =
    state.lastBattle;

  const challenge = {

    id:
      crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(),

    name:
      state.playerName,

    score:
      result.playerScore,

    mode:
      result.mode,

    xp:
      result.earned,

    streak:
      state.streak,

    created:
      Date.now()
  };

  const code =
    encodeChallenge(challenge);

  const url =
    `${window.location.origin}${window.location.pathname}?challenge=${encodeURIComponent(code)}`;

  trackEvent(
    "challenge_created",
   
