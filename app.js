const CHALLENGES={
fun:[
["NE RIGOLE PAS 😂","Essaie de faire rire ton adversaire sans parler.","FUN"],
["IMITATION 💀","Imite une célébrité. Ton adversaire doit deviner.","FUN"],
["DANSE IMPROVISÉE","Danse pendant 10 secondes sans musique.","FUN"],
["VOIX BIZARRE","Dis ton prénom avec la voix la plus ridicule possible.","FUN"],
["STATUE","Reste parfaitement immobile pendant 10 secondes.","FUN"],
["RAP EXPRESS","Fais une phrase qui rime avec « banane ».","FUN"],
["MOT INTERDIT","Pendant 20 secondes, ne dis pas « oui ».","FUN"]
],
quiz:[
["OCÉAN","Quel est le plus grand océan de la Terre ?","QUIZ","pacifique"],
["HEXAGONE","Combien de côtés possède un hexagone ?","QUIZ","6"],
["PLANÈTE ROUGE","Quelle planète est surnommée la planète rouge ?","QUIZ","mars"],
["SEMAINE","Combien y a-t-il de jours dans une semaine ?","QUIZ","7"],
["ROI DE LA JUNGLE","Quel animal est souvent appelé le roi de la jungle ?","QUIZ","lion"],
["CAPITALE","Quelle est la capitale de la France ?","QUIZ","paris"],
["CONTINENTS","Combien y a-t-il de continents selon le modèle le plus courant ?","QUIZ","7"]
],
speed:[
["RÉACTION ⚡","Attends le signal puis appuie le plus vite possible.","RAPIDE","timer"],
["5 FRUITS","Donne 5 fruits en moins de 5 secondes.","RAPIDE"],
["3 PAYS","Donne 3 pays en moins de 3 secondes.","RAPIDE"],
["COULEUR","Trouve quelque chose de bleu autour de toi.","RAPIDE"],
["COMPTE À REBOURS","Compte de 10 à 1 le plus rapidement possible.","RAPIDE"]
],
chaos:[
["DÉFI SURPRISE 💀","Fais 5 squats puis dis « JE SUIS LE CHAMPION ! ».","CHAOS"],
["PILE OU FACE","Choisis pile ou face. Ton adversaire choisit aussi.","CHAOS"],
["PIERRE-PAPIER-CISEAUX","Faites une manche. Le gagnant marque le point.","CHAOS"],
["MÉMOIRE","Ton adversaire dit 4 mots. Répète-les dans l'ordre.","CHAOS"],
["NOMBRE SECRET","Choisis un nombre entre 1 et 5. Ton adversaire fait pareil.","CHAOS"],
["QUESTION ABSURDE","Explique pourquoi les pingouins seraient de bons présidents.","CHAOS"],
["MOT IMPOSSIBLE","Dis un mot très long sans te tromper.","CHAOS"]
]};
const DAILY=[
["Battle éclair","Trouve 5 pays en moins de 10 secondes."],
["Défi mémoire","Mémorise 5 mots puis répète-les."],
["Mode chaos","Ton adversaire choisit ton défi."],
["Question surprise","Réponds sans réfléchir trop longtemps."],
["Défi du jour","Fais quelque chose qui fera rire ton adversaire."]
];
let state={xp:+localStorage.bc_xp||0,wins:+localStorage.bc_wins||0,battles:+localStorage.bc_battles||0,streak:+localStorage.bc_streak||0,best:+localStorage.bc_best||0,name:localStorage.bc_name||"Challenger",currentMode:"fun",current:0,list:[],player:0,opponent:0,lastResult:null,incoming:null,creatorScore:null};
let timerInterval=null;
const $=id=>document.getElementById(id);
function save(){["xp","wins","battles","streak","best","name"].forEach(k=>localStorage["bc_"+k]=state[k])}
function level(){return Math.floor(state.xp/250)+1}
function levelXP(){return state.xp%250}
function track(n,p={}){if(typeof gtag==="function"&&gtag.toString().includes("dataLayer"))gtag("event",n,p)}
function showScreen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$(id)?.classList.add("active");window.scrollTo(0,0)}
function goHome(){showScreen("home");updateUI()}
function showToast(t){const e=$("toast");e.textContent=t;e.classList.add("show");clearTimeout(showToast.t);showToast.t=setTimeout(()=>e.classList.remove("show"),2400)}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function updateDaily(){let i=Math.floor(Date.now()/86400000)%DAILY.length;$("dailyTitle").textContent=DAILY[i][0];$("dailyDescription").textContent=DAILY[i][1]}
function getBadges(){let b=[];if(state.wins>=1)b.push("🏆 Première victoire");if(state.wins>=5)b.push("⚔️ Challenger");if(state.wins>=10)b.push("🔥 10 victoires");if(state.streak>=7)b.push("🔥 Streak 7");if(state.streak>=30)b.push("👑 Légende");if(state.xp>=1000)b.push("⭐ 1000 XP");if(state.battles>=50)b.push("💀 50 battles");return b}
function updateUI(){
  const l=level(),p=levelXP()/250*100;
  $("levelBadge").textContent=l;$("homeXP").textContent=state.xp;$("homeWins").textContent=state.wins;$("homeStreak").textContent=state.streak;
  $("profileName").textContent=state.name;$("profileLevel").textContent=l;$("profileXP").textContent=state.xp+" XP";$("profileWins").textContent=state.wins;$("profileStreak").textContent=state.streak;$("profileBattles").textContent=state.battles;$("profileBest").textContent=state.best;$("profileXPBar").style.width=p+"%";$("levelText").textContent=(250-levelXP())+" XP avant le niveau "+(l+1)+".";
  updateDaily();let b=getBadges();$("badgesList").innerHTML=b.length?b.map(x=>`<span class="badge">${x}</span>`).join(""):'<span class="muted">Joue pour débloquer ton premier badge.</span>';
}
function showProfile(){showScreen("profile");updateUI()}
function changeName(){let n=prompt("Ton pseudo :",state.name);if(n?.trim()){state.name=n.trim().slice(0,18);save();updateUI();showToast("👤 Pseudo mis à jour !")}}
function startBattle(mode){
  state.incoming=null;state.creatorScore=null;state.currentMode=mode||["fun","quiz","speed","chaos"][Math.floor(Math.random()*4)];state.list=shuffle(CHALLENGES[state.currentMode]).slice(0,5);state.current=0;state.player=0;state.opponent=0;$("opponentName").textContent="ADVERSAIRE";$("incomingBanner").classList.add("hidden");track("game_start",{mode:state.currentMode});showScreen("battle");loadChallenge()
}
function startDaily(){let i=Math.floor(Date.now()/86400000)%DAILY.length;state.incoming=null;state.creatorScore=null;state.currentMode="chaos";state.list=[[DAILY[i][0],DAILY[i][1],"BATTLE DU JOUR"]];state.current=0;state.player=0;state.opponent=0;track("daily_start");showScreen("battle");loadChallenge()}
function loadChallenge(){
  clearInterval(timerInterval);let c=state.list[state.current];if(!c)return finishBattle();
  $("battleMode").textContent=state.currentMode.toUpperCase();$("challengeNumber").textContent=`Défi ${state.current+1}/${state.list.length}`;$("challengeCategory").textContent=c[2];$("challengeTitle").textContent=c[0];$("challengeText").textContent=c[1];$("playerScore").textContent=state.player;$("opponentScore").textContent=state.incoming?state.creatorScore:state.opponent;$("progressBar").style.width=(state.current/state.list.length*100)+"%";$("timer").classList.add("hidden");$("answerArea").innerHTML="";$("challengeButton").disabled=false;$("challengeButton").textContent=c[3]==="timer"?"⚡ COMMENCER":"RELEVER LE DÉFI";$("challengeButton").onclick=doChallenge
}
function doChallenge(){
  let c=state.list[state.current];
  if(c[3]==="timer")return speedChallenge();
  let won;
  if(c[2]==="QUIZ"&&c[3]){let a=prompt(c[1]);won=!!a&&a.trim().toLowerCase()===c[3];showToast(won?"🧠 Bonne réponse !":"❌ Mauvaise réponse !")}
  else{won=Math.random()>.4;showToast(won?"🔥 Tu marques le point !":"💀 Ton adversaire marque !")}
  won?state.player++:state.opponent++;setTimeout(nextChallenge,450)
}
function speedChallenge(){
  let b=$("challengeButton"),t=$("timer");b.disabled=true;b.textContent="ATTENDS...";t.classList.remove("hidden");let n=3;t.textContent=n;
  timerInterval=setInterval(()=>{n--;t.textContent=n;if(n<=0){clearInterval(timerInterval);t.textContent="⚡";b.disabled=false;b.textContent="TOUCHE !";b.onclick=()=>{if(Math.random()>.35){state.player++;showToast("⚡ Réaction parfaite !")}else{state.opponent++;showToast("😭 Trop lent !")}nextChallenge()}}},1000)
}
function nextChallenge(){setTimeout(()=>{state.current++;state.current<state.list.length?loadChallenge():finishBattle()},450)}
function finishBattle(){
  clearInterval(timerInterval);state.battles++;let opp=state.incoming?state.creatorScore:state.opponent;let won=state.player>opp;if(state.player===opp)won=Math.random()>.5;let old=level(),earned=won?100:35;if(state.incoming)earned+=25;if(won&&state.streak>=7)earned+=25;
  if(won){state.wins++;state.streak++}else state.streak=0;state.xp+=earned;state.best=Math.max(state.best,state.player);let nl=level();
  state.lastResult={won,earned,player:state.player,opponent:opp,mode:state.currentMode};save();
  $("finalPlayerScore").textContent=state.player;$("finalOpponentScore").textContent=opp;$("earnedXP").textContent="+"+earned+" XP";$("resultLevel").textContent=nl;$("resultStreak").textContent=state.streak;$("resultEmoji").textContent=won?"🏆":"💀";$("resultTitle").textContent=won?"VICTOIRE !":"DÉFAITE !";$("resultSubtitle").textContent=state.incoming?`Tu as affronté ${state.incoming.name}.`:nl>old?`🎉 Niveau ${nl} débloqué !`:"Bien joué. Remets ça.";
  $("badgeResult").classList.add("hidden");updateUI();track("game_complete",{mode:state.currentMode,won});showScreen("result")
}
function rematch(){startBattle(state.currentMode)}
function enc(o){return btoa(unescape(encodeURIComponent(JSON.stringify(o))))}
function dec(s){try{return JSON.parse(decodeURIComponent(escape(atob(s))))}catch(e){return null}}
function makeChallengeUrl(){let r=state.lastResult,d={id:Date.now().toString(36),name:state.name,score:r.player,mode:r.mode,created:Date.now()};return `${location.origin}${location.pathname}?challenge=${encodeURIComponent(enc(d))}`}
function createFriendChallenge(){if(!state.lastResult)return showToast("Joue d'abord une battle !");$("shareLink").value=makeChallengeUrl();$("shareText").textContent=`${state.name} a fait ${state.lastResult.player} point(s) en mode ${state.lastResult.mode.toUpperCase()}. Penses-tu pouvoir faire mieux ?`;$("shareModal").classList.remove("hidden");track("challenge_created",{mode:state.lastResult.mode})}
function openChallengeCreator(){showScreen("challengeCreator")}
function createChallengeAndPlay(mode){startBattle(mode);showToast("⚔️ Joue ta battle : ton score servira à défier ton ami.")}
async function copyChallengeLink(){try{await navigator.clipboard.writeText($("shareLink").value)}catch(e){$("shareLink").select();document.execCommand("copy")}track("challenge_shared",{method:"copy"});showToast("🔗 Lien copié !")}
async function nativeShare(){let url=$("shareLink").value,text=$("shareText").textContent;if(navigator.share){try{await navigator.share({title:"⚔️ Battle Challenge",text,url});track("challenge_shared",{method:"native"})}catch(e){}}else copyChallengeLink()}
async function shareResult(){if(!state.lastResult)return;let url=makeChallengeUrl(),text=`🏆 ${state.name} vient de faire ${state.lastResult.player} points sur Battle Challenge. Tu penses pouvoir faire mieux ?`;if(navigator.share){try{await navigator.share({title:"⚔️ Battle Challenge",text,url});track("result_shared",{method:"native"})}catch(e){}}else{$("shareLink").value=url;$("shareText").textContent=text;$("shareModal").classList.remove("hidden")}}
function checkIncomingChallenge(){
  let code=new URLSearchParams(location.search).get("challenge");if(!code)return;let d=dec(code);if(!d||!d.name||!d.mode)return showToast("❌ Défi invalide.");
  state.incoming=d;state.creatorScore=+d.score||0;state.currentMode=d.mode;state.list=shuffle(CHALLENGES[d.mode]||CHALLENGES.fun).slice(0,5);state.current=0;state.player=0;state.opponent=0;$("opponentName").textContent=d.name.toUpperCase();$("incomingBanner").textContent=`⚔️ ${d.name} t'a défié avec ${d.score} point${d.score>1?"s":""} !`;$("incomingBanner").classList.remove("hidden");track("challenge_opened",{mode:d.mode});showScreen("battle");loadChallenge();history.replaceState({},document.title,location.pathname)
}
function acceptIncoming(){if(state.incoming){showScreen("battle");loadChallenge()}}
function showLeaderboard(){
  const rows=[["🥇","Alex",12450],["🥈","Max",11320],["🥉","Sam",10480],["4","Léo",9320],["5","Thomas",8750]];
  $("leaderboardList").innerHTML=rows.map(r=>`<div class="leader-row"><span class="rank">${r[0]}</span><span class="leader-name">${r[1]}</span><span class="leader-xp">${r[2].toLocaleString("fr-FR")} XP</span></div>`).join("")+`<div class="leader-row"><span class="rank">#?</span><span class="leader-name">${state.name} <small>(TOI)</small></span><span class="leader-xp">${state.xp.toLocaleString("fr-FR")} XP</span></div>`;$("leaderboardModal").classList.remove("hidden")
}
function closeLeaderboard(){$("leaderboardModal").classList.add("hidden")}
function closeShare(){$("shareModal").classList.add("hidden")}
document.addEventListener("DOMContentLoaded",()=>{updateUI();checkIncomingChallenge()});
