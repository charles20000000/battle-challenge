/* ================================
   BATTLE CHALLENGE V2
   No backend required
================================ */

const CHALLENGES = {
  fun: [
    ["NE RIGOLE PAS 😂", "Essaie de faire rire ton adversaire sans parler.", "FUN"],
    ["IMITATION 💀", "Imite une célébrité. Ton adversaire doit deviner.", "FUN"],
    ["DANSE IMPROVISÉE", "Danse pendant 10 secondes sans musique.", "FUN"],
    ["VOIX BIZARRE", "Dis ton prénom avec la voix la plus ridicule possible.", "FUN"],
    ["MOT INTERDIT", "Pendant 20 secondes, ne dis pas « oui ».", "FUN"],
    ["STATUE", "Reste parfaitement immobile pendant 10 secondes.", "FUN"],
    ["RAP EXPRESS", "Fais une phrase qui rime avec « banane ».", "FUN"]
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
    ["RÉACTION ⚡", "Attends le signal puis appuie sur le bouton le plus vite possible.", "RAPIDE", "timer"],
    ["5 FRUITS", "Donne 5 fruits en moins de 5 secondes.", "RAPIDE"],
    ["3 PAYS", "Donne 3 pays en moins de 3 secondes.", "RAPIDE"],
    ["COULEUR", "Trouve quelque chose de bleu autour de toi.", "RAPIDE"],
    ["COMPTE À REBOURS", "Compte de 10 à 1 le plus rapidement possible.", "RAPIDE"]
  ],

  chaos: [
    ["DÉFI SURPRISE 💀", "Fais 5 squats puis dis « JE SUIS LE CHAMPION ! ».", "CHAOS"],
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
  xp: Number(localStorage.getItem("bc2_xp")) || 0,
  wins: Number(localStorage.getItem("bc2_wins")) || 0,
  battles: Number(localStorage.getItem("bc2_battles")) || 0,
  streak: Number(localStorage.getItem("bc2_streak")) || 0,
  best: Number(localStorage.getItem("bc2_best")) || 0,
  name: localStorage.getItem("bc2_name") || "Challenger",

  lastDay: localStorage.getItem("bc2_day") || "",

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

function $(id) {
  return document.getElementById(id);
}

function save() {
  localStorage.setItem("bc2_xp", state.xp);
  localStorage.setItem("bc2_wins", state.wins);
  localStorage.setItem("bc2_battles", state.battles);
  localStorage.setItem("bc2_streak", state.streak);
  localStorage.setItem("bc2_best", state.best);
  localStorage.setItem("bc2_name", state.name);
  localStorage.setItem("bc2_day", state.lastDay);
}

function level() {
  return Math.floor(state.xp / 250) + 1;
}

function levelXP() {
  return state.xp % 250;
}

function track(name, params = {}) {
  if (typeof gtag === "function") {
    gtag("event", name, params);
  }
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const screen = $(id);

  if (screen) {
    screen.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.remove("active");
  });
}

function goHome() {
  showScreen("home");
  updateUI();
}

function showToast(text) {
  const toast = $("toast");

  if (!toast) return;

  toast.textContent = text;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function updateDaily() {
  const index =
    Math.floor(Date.now() / 86400000) % DAILY.length;

  $("dailyTitle").textContent = DAILY[index][0];
  $("dailyDescription").textContent = DAILY[index][1];
}

function updateUI() {
  const currentLevel = level();

  const progress =
    (levelXP() / 250) * 100;

  $("levelBadge").textContent = currentLevel;

  $("homeXP").textContent = state.xp;
  $("homeWins").textContent = state.wins;
  $("homeStreak").textContent = state.streak;

  $("profileName").textContent = state.name;
  $("profileLevel").textContent = currentLevel;
  $("profileXP").textContent = `${state.xp} XP`;

  $("profileWins").textContent = state.wins;
  $("profileStreak").textContent = state.streak;
  $("profileBattles").textContent = state.battles;
  $("profileBest").textContent = state.best;

  $("profileXPBar").style.width =
    progress + "%";

  $("levelText").textContent =
    `${250 - levelXP()} XP avant le niveau ${currentLevel + 1}.`;

  updateDaily();
  renderBadges();
}

function getBadges() {
  const badges = [];

  if (state.wins >= 1) {
    badges.push("🏆 Première victoire");
  }

  if (state.wins >= 5) {
    badges.push("⚔️ Challenger");
  }

  if (state.wins >= 10) {
    badges.push("🔥 10 victoires");
  }

  if (state.streak >= 7) {
    badges.push("🔥 Streak 7");
  }

  if (state.streak >= 30) {
    badges.push("👑 Légende");
  }

  if (state.xp >= 1000) {
    badges.push("⭐ 1000 XP");
  }

  if (state.battles >= 50) {
    badges.push("💀 50 battles");
  }

  return badges;
}

function renderBadges() {
  const badges = getBadges();

  if (!badges.length) {
    $("badgesList").innerHTML =
      '<span class="muted">Joue pour débloquer ton premier badge.</span>';

    return;
  }

  $("badgesList").innerHTML =
    badges
      .map(badge => `<span class="badge">${badge}</span>`)
      .join("");
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

  if (!name || !name.trim()) {
    return;
  }

  state.name =
    name.trim().slice(0, 18);

  save();
  updateUI();

  showToast("👤 Pseudo mis à jour !");
}

function shuffle(array) {
  return [...array].sort(
    () => Math.random() - 0.5
  );
}

function startBattle(mode) {
  state.incoming = null;
  state.creatorScore = null;

  state.currentMode =
    mode ||
    ["fun", "quiz", "speed", "chaos"][
      Math.floor(Math.random() * 4)
    ];

  state.list =
    shuffle(
      CHALLENGES[state.currentMode]
    ).slice(0, 5);

  state.current = 0;
  state.player = 0;
  state.opponent = 0;

  $("opponentName").textContent =
    "ADVERSAIRE";

  $("incomingBanner")
    .classList.add("hidden");

  track("game_start", {
    mode: state.currentMode
  });

  showScreen("battle");

  loadChallenge();
}

function startDaily() {
  const index =
    Math.floor(Date.now() / 86400000) %
    DAILY.length;

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

  $("opponentName").textContent =
    "BATTLE DU JOUR";

  track("daily_start");

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

  $("battleMode").textContent =
    state.currentMode.toUpperCase();

  $("challengeNumber").textContent =
    `Défi ${state.current + 1}/${state.list.length}`;

  $("challengeCategory").textContent =
    challenge[2];

  $("challengeTitle").textContent =
    challenge[0];

  $("challengeText").textContent =
    challenge[1];

  $("playerScore").textContent =
    state.player;

  $("opponentScore").textContent =
    state.incoming
      ? state.creatorScore
      : state.opponent;

  $("progressBar").style.width =
    (state.current / state.list.length * 100) + "%";

  $("timer")
    .classList.add("hidden");

  $("challengeButton").disabled = false;

  $("challengeButton").textContent =
    challenge[3] === "timer"
      ? "⚡ COMMENCER"
      : "RELEVER LE DÉFI";

  $("challengeButton").onclick =
    doChallenge;
}

function doChallenge() {
  const challenge =
    state.list[state.current];

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
      answer &&
      answer.trim().toLowerCase() ===
        challenge[3];

    showToast(
      won
        ? "🧠 Bonne réponse !"
        : "❌ Mauvaise réponse !"
    );
  } else {
    won =
      Math.random() > 0.4;

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

  setTimeout(
    nextChallenge,
    450
  );
}

function speedChallenge() {
  const button =
    $("challengeButton");

  const timer =
    $("timer");

  button.disabled = true;
  button.textContent = "ATTENDS...";

  timer.classList.remove("hidden");

  let number = 3;

  timer.textContent = number;

  timerInterval =
    setInterval(() => {
      number--;

      timer.textContent =
        number;

      if (number <= 0) {
        clearInterval(timerInterval);

        timer.textContent = "⚡";

        button.disabled = false;

        button.textContent =
          "TOUCHE !";

        button.onclick = () => {
          if (Math.random() > 0.35) {
            state.player++;

            showToast(
              "⚡ Réaction parfaite !"
            );
          } else {
            state.opponent++;

            showToast(
              "😭 Trop lent !"
            );
          }

          nextChallenge();
        };
      }
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
  }, 450);
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

  if (
    state.player === opponentScore
  ) {
    won =
      Math.random() > 0.5;
  }

  let earned =
    won ? 100 : 35;

  if (state.incoming) {
    earned += 25;
  }

  if (
    won &&
    state.streak >= 7
  ) {
    earned += 25;
  }

  const oldLevel =
    level();

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

  const newLevel =
    level();

  state.lastResult = {
    won,
    earned,
    player: state.player,
    opponent: opponentScore,
    mode: state.currentMode,
    challenge: state.incoming
  };

  save();

  $("finalPlayerScore").textContent =
    state.player;

  $("finalOpponentScore").textContent =
    opponentScore;

  $("earnedXP").textContent =
    "+" + earned + " XP";

  $("resultLevel").textContent =
    newLevel;

  $("resultStreak").textContent =
    state.streak;

  $("resultEmoji").textContent =
    won ? "🏆" : "💀";

  $("resultTitle").textContent =
    won ? "VICTOIRE !" : "DÉFAITE !";

  $("resultSubtitle").textContent =
    state.incoming
      ? `Tu as affronté ${state.incoming.name}.`
      : newLevel > oldLevel
        ? `🎉 Niveau ${newLevel} débloqué !`
        : "Bien joué. Remets ça.";

  const before =
    getBadges().length;

  updateUI();

  const badges =
    getBadges();

  $("badgeResult")
    .classList.toggle(
      "hidden",
      badges.length <= before
    );

  if (badges.length > before) {
    $("badgeResult").textContent =
      "🏅 Nouveau badge : " +
      badges[badges.length - 1];
  }

  track(
    "game_complete",
    {
      mode: state.currentMode,
      won
    }
  );

  showScreen("result");
}

function rematch() {
  state.incoming = null;
  state.creatorScore = null;

  startBattle(
    state.currentMode
  );
}

function encode(data) {
  return btoa(
    unescape(
      encodeURIComponent(
        JSON.stringify(data)
      )
    )
  );
}

function decode(code) {
  try {
    return JSON.parse(
      decodeURIComponent(
        escape(
          atob(code)
        )
      )
    );
  } catch (error) {
    return null;
  }
}

function makeChallengeUrl() {
  const result =
    state.lastResult;

  const data = {
    id: Date.now().toString(36),
    name: state.name,
    score: result.player,
    mode: result.mode,
    created: Date.now()
  };

  return (
    `${location.origin}${location.pathname}` +
    `?challenge=${encodeURIComponent(
      encode(data)
    )}`
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

  $("shareLink").value =
    url;

  $("shareText").textContent =
    `${state.name} a fait ${state.lastResult.player} point(s) en mode ${state.lastResult.mode.toUpperCase()}. Penses-tu pouvoir faire mieux ?`;

  $("shareModal")
    .classList.remove("hidden");

  track(
    "challenge_created",
    {
      mode: state.lastResult.mode
    }
  );
}

function openChallengeCreator() {
  showScreen(
    "challengeCreator"
  );
}

function createChallengeAndPlay(mode) {
  startBattle(mode);

  showToast(
    "⚔️ Joue ta battle. Ton résultat servira à créer le défi."
  );
}

async function copyChallengeLink() {
  const input =
    $("shareLink");

  try {
    await navigator.clipboard.writeText(
      input.value
    );
  } catch (error) {
    input.select();
    document.execCommand("copy");
  }

  track(
    "challenge_shared",
    {
      method: "copy"
    }
  );

  showToast(
    "🔗 Lien copié !"
  );
}

async function nativeShare() {
  const url =
    $("shareLink").value;

  const text =
    $("shareText").textContent;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "⚔️ Battle Challenge",
        text,
        url
      });

      track(
        "challenge_shared",
        {
          method: "native"
        }
      );
    } catch (error) {}
  } else {
    copyChallengeLink();
  }
}

async function shareResult() {
  if (!state.lastResult) {
    return;
  }

  const url =
    makeChallengeUrl();

  const text =
    `🏆 ${state.name} vient de faire ` +
    `${state.lastResult.player} points ` +
    `sur Battle Challenge. ` +
    `Tu penses pouvoir faire mieux ?`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "⚔️ Battle Challenge",
        text,
        url
      });

      track(
        "result_shared",
        {
          method: "native"
        }
      );
    } catch (error) {}
  } else {
    $("shareLink").value =
      url;

    $("shareText").textContent =
      text;

    $("shareModal")
      .classList.remove("hidden");
  }
}

function checkIncomingChallenge() {
  const params =
    new URLSearchParams(
      location.search
    );

  const code =
    params.get("challenge");

  if (!code) {
    return;
  }

  const data =
    decode(code);

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

  state.incoming =
    data;

  state.creatorScore =
    Number(data.score) || 0;

  state.currentMode =
    data.mode;

  state.list =
    shuffle(
      CHALLENGES[
        state.currentMode
      ] || CHALLENGES.fun
    ).slice(0, 5);

  state.current = 0;
  state.player = 0;
  state.opponent = 0;

  $("opponentName").textContent =
    data.name.toUpperCase();

  $("incomingBanner").textContent =
    `⚔️ ${data.name} t'a défié avec ${data.score} point${data.score > 1 ? "s" : ""} !`;

  $("incomingBanner")
    .classList.remove("hidden");

  track(
    "challenge_opened",
    {
      mode: data.mode
    }
  );

  showScreen("battle");

  loadChallenge();

  history.replaceState(
    {},
    document.title,
    location.pathname
  );
}

function showLeaderboard() {
  const names = [
    ["🥇", "Alex", 12450],
    ["🥈", "Max", 11320],
    ["🥉", "Sam", 10480],
    ["4", "Léo", 9320],
    ["5", "Thomas", 8750]
  ];

  $("leaderboardList").innerHTML =
    names
      .map(
        player => `
          <div class="leader-row">
            <span class="rank">${player[0]}</span>
            <span class="leader-name">${player[1]}</span>
            <span class="leader-xp">
              ${player[2].toLocaleString("fr-FR")} XP
            </span>
          </div>
        `
      )
      .join("") +
    `
      <div class="leader-row">
        <span class="rank">#?</span>
        <span class="leader-name">
          ${state.name} <small>(TOI)</small>
        </span>
        <span class="leader-xp">
          ${state.xp.toLocaleString("fr-FR")} XP
        </span>
      </div>
    `;

  $("leaderboardModal")
    .classList.remove("hidden");

  track(
    "leaderboard_opened"
  );
}

function closeLeaderboard() {
  $("leaderboardModal")
    .classList.add("hidden");
}

function closeShare() {
  $("shareModal")
    .classList.add("hidden");
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    updateUI();
    checkIncomingChallenge();
  }
);
