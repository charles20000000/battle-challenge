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

let state = {
  xp: Number(localStorage.getItem("bc_xp") || 0),
  wins: Number(localStorage.getItem("bc_wins") || 0),
  battles: Number(localStorage.getItem("bc_battles") || 0),
  streak: Number(localStorage.getItem("bc_streak") || 0),
  best: Number(localStorage.getItem("bc_best") || 0),
  playerScore: 0,
  opponentScore: 0,
  currentChallenge: 0,
  currentMode: "fun",
  currentChallenges: [],
  lastBattle: null
};

let timerInterval = null;

const $ = id => document.getElementById(id);
// ================================
// ANALYTICS BATTLE CHALLENGE
// ================================

function trackEvent(name, params = {}) {
  if (typeof gtag === "function") {
    gtag("event", name, params);
  }
}
function save() {
  localStorage.setItem("bc_xp", state.xp);
  localStorage.setItem("bc_wins", state.wins);
  localStorage.setItem("bc_battles", state.battles);
  localStorage.setItem("bc_streak", state.streak);
  localStorage.setItem("bc_best", state.best);
}

function getLevel() {
  return Math.floor(state.xp / 250) + 1;
}

function goHome() {
  showScreen("home");
  updateUI();
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
  });

  $(id).classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function updateUI() {

  const level = getLevel();

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

  const currentLevelXP = state.xp % 250;
  const percentage = (currentLevelXP / 250) * 100;

  $("profileXPBar").style.width = percentage + "%";

  $("levelText").textContent =
    `${250 - currentLevelXP} XP avant le niveau ${level + 1}.`;

  updateDaily();
}

function updateDaily() {

  const day = Math.floor(Date.now() / 86400000);
  const daily = dailyChallenges[day % dailyChallenges.length];

  $("dailyTitle").textContent = daily.title;
  $("dailyDescription").textContent = daily.text;
}

function startDaily() {

  state.currentMode = "chaos";
  state.currentChallenges = [
    {
      title: dailyChallenges[Math.floor(Date.now() / 86400000) % dailyChallenges.length].title,
      text: dailyChallenges[Math.floor(Date.now() / 86400000) % dailyChallenges.length].text,
      category: "BATTLE DU JOUR"
    }
  ];

  state.currentChallenge = 0;
  state.playerScore = 0;
  state.opponentScore = 0;

  showScreen("battle");
  loadChallenge();
}

function startBattle(mode) {

  if (!mode) {
    const modes = ["fun", "quiz", "speed", "chaos"];
    mode = modes[Math.floor(Math.random() * modes.length)];
  }

  state.currentMode = mode;

  state.currentChallenges = [...challenges[mode]]
    .sort(() => Math.random() - .5)
    .slice(0, 5);

  state.currentChallenge = 0;
  state.playerScore = 0;
  state.opponentScore = 0;

  showScreen("battle");
  loadChallenge();
}

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

  $("challengeButton").textContent =
    challenge.timer ? "⚡ COMMENCER" : "J'AI RELEVÉ LE DÉFI";

  $("challengeButton").onclick = doChallenge;

  $("timer").classList.add("hidden");

  const progress =
    ((state.currentChallenge) /
    state.currentChallenges.length) * 100;

  $("progressBar").style.width = progress + "%";

  $("playerScore").textContent = state.playerScore;
  $("opponentScore").textContent = state.opponentScore;
}

function doChallenge() {

  const challenge =
    state.currentChallenges[state.currentChallenge];

  if (challenge.timer) {
    startSpeedChallenge();
    return;
  }

  const playerWins = Math.random() > 0.4;

  if (playerWins) {
    state.playerScore++;
    showToast("🔥 Tu marques le point !");
  } else {
    state.opponentScore++;
    showToast("💀 Ton adversaire marque !");
  }

  nextChallenge();
}

function startSpeedChallenge() {

  const button = $("challengeButton");
  const timer = $("timer");

  button.disabled = true;
  button.textContent = "ATTENDS...";

  timer.classList.remove("hidden");

  let seconds = 3;
  timer.textContent = seconds;

  timerInterval = setInterval(() => {

    seconds--;

    timer.textContent = seconds;

    if (seconds <= 0) {

      clearInterval(timerInterval);

      timer.textContent = "⚡";

      button.disabled = false;
      button.textContent = "TOUCHE !";

      button.onclick = () => {

        if (Math.random() > .35) {
          state.playerScore++;
          showToast("⚡ RÉACTION PARFAITE !");
        } else {
          state.opponentScore++;
          showToast("😭 Trop lent !");
        }

        nextChallenge();
      };
    }

  }, 1000);
}

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

function finishBattle() {

  clearInterval(timerInterval);

  state.battles++;

  let won = state.playerScore > state.opponentScore;

  if (state.playerScore === state.opponentScore) {
    won = Math.random() > .5;
  }

  let earned = won ? 100 : 35;

  if (state.currentChallenges.length === 1) {
    earned = won ? 50 : 20;
  }

  state.xp += earned;

  if (won) {
    state.wins++;
    state.streak++;
  } else {
    state.streak = 0;
  }

  state.best =
    Math.max(state.best, state.playerScore);

  state.lastBattle = {
    won,
    earned,
    playerScore: state.playerScore,
    opponentScore: state.opponentScore
  };

  save();

  $("finalPlayerScore").textContent =
    state.playerScore;

  $("finalOpponentScore").textContent =
    state.opponentScore;

  $("earnedXP").textContent =
    `+${earned} XP`;

  if (won) {

    $("resultEmoji").textContent = "🏆";
    $("resultTitle").textContent = "VICTOIRE !";

  } else {

    $("resultEmoji").textContent = "💀";
    $("resultTitle").textContent = "DÉFAITE !";
  }

  showScreen("result");
}

function rematch() {

  startBattle(state.currentMode);
}

async function shareResult() {

  const result = state.lastBattle;

  const text =
`⚔️ BATTLE CHALLENGE

J'ai ${result.won ? "battu mon adversaire 🏆" : "perdu 😭"} !

Score : ${result.playerScore} - ${result.opponentScore}

🔥 À ton tour de me défier !`;

  if (navigator.share) {

    try {

      await navigator.share({
        title: "Battle Challenge ⚔️",
        text: text,
        url: window.location.href
      });

    } catch (e) {}

  } else {

    try {

      await navigator.clipboard.writeText(
        text + "\n" + window.location.href
      );

      showToast("📋 Résultat copié !");

    } catch (e) {

      showToast("📤 Partage non disponible");
    }
  }
}

function showProfile() {

  updateUI();
  showScreen("profile");
}

function showLeaderboard() {

  const players = [
    {
      name: "Alex",
      xp: 2850,
      avatar: "🔥"
    },
    {
      name: "Max",
      xp: 2410,
      avatar: "😈"
    },
    {
      name: "Thomas",
      xp: 2100,
      avatar: "⚡"
    },
    {
      name: "Sarah",
      xp: 1870,
      avatar: "👑"
    },
    {
      name: "Toi",
      xp: state.xp,
      avatar: "😎"
    }
  ];

  players.sort((a, b) => b.xp - a.xp);

  $("leaderboardList").innerHTML =
    players.map((player, index) => `
      <div class="rank">
        <span class="rank-number">
          ${index === 0 ? "🥇" :
            index === 1 ? "🥈" :
            index === 2 ? "🥉" :
            index + 1}
        </span>

        <span class="rank-avatar">
          ${player.avatar}
        </span>

        <div class="rank-info">
          <strong>${player.name}</strong>
          <small>Niveau ${Math.floor(player.xp / 250) + 1}</small>
        </div>

        <span class="rank-xp">
          ${player.xp} XP
        </span>
      </div>
    `).join("");

  $("leaderboardModal").classList.remove("hidden");
}

function closeLeaderboard() {
  $("leaderboardModal").classList.add("hidden");
}

function showToast(message) {

  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

updateUI();
