const lessonData = {
  vowels: [
    { short: "ă", long: "ā", shortHint: "short a", longHint: "long a",
      shortAudio: "../assets/audio/latin/short-a.mp3", longAudio: "../assets/audio/latin/long-a.mp3" },
    { short: "ĕ", long: "ē", shortHint: "short e", longHint: "long e",
      shortAudio: "../assets/audio/latin/short-e.mp3", longAudio: "../assets/audio/latin/long-e.mp3" },
    { short: "ĭ", long: "ī", shortHint: "short i", longHint: "long i",
      shortAudio: "../assets/audio/latin/short-i.mp3", longAudio: "../assets/audio/latin/long-i.mp3" },
    { short: "ŏ", long: "ō", shortHint: "short o", longHint: "long o",
      shortAudio: "../assets/audio/latin/short-o.mp3", longAudio: "../assets/audio/latin/long-o.mp3" },
    { short: "ŭ", long: "ū", shortHint: "short u", longHint: "long u",
      shortAudio: "../assets/audio/latin/short-u.mp3", longAudio: "../assets/audio/latin/long-u.mp3" }
  ],
  diphthongs: [
    { text: "ae", example: "Caesar", hint: "a single gliding sound", audio: "../assets/audio/latin/ae-caesar.mp3" },
    { text: "au", example: "aurum", hint: "a smooth a-to-u glide", audio: "../assets/audio/latin/au-aurum.mp3" },
    { text: "ei", example: "deinde", hint: "a smooth e-to-i glide", audio: "../assets/audio/latin/ei-deinde.mp3" },
    { text: "oe", example: "poena", hint: "a rounded two-vowel glide", audio: "../assets/audio/latin/oe-poena.mp3" },
    { text: "ui", example: "cui", hint: "u and i combined in one syllable", audio: "../assets/audio/latin/ui-cui.mp3" },
    { text: "eu", example: "heu", hint: "e and u in one breath", audio: "../assets/audio/latin/eu-heu.mp3" }
  ],
  places: {
    britannia: {
      title: "Britannia",
      latin: "Britannia",
      description: "Rome began its conquest of Britain in AD 43. Latin became important in administration, the army, trade and the Church."
    },
    gaul: {
      title: "Gaul",
      latin: "Gallia",
      description: "Gaul covered much of modern France and neighbouring regions. Spoken Latin there gradually developed into French."
    },
    rome: {
      title: "Rome",
      latin: "Rōma",
      description: "Rome was the political and symbolic centre of the empire and the city from which Latin took its prestige."
    },
    egypt: {
      title: "Egypt",
      latin: "Aegyptus",
      description: "Egypt was a wealthy province and a major source of grain. Alexandria was one of the ancient Mediterranean's great cities."
    },
    east: {
      title: "Eastern Provinces",
      latin: "Prōvinciae Orientālēs",
      description: "Rome's eastern territories connected the Mediterranean world with Greece, Anatolia, Syria and the Near East."
    }
  }
};

const sharedAudio = new Audio();

function playClip(path, label) {
  sharedAudio.pause();
  sharedAudio.currentTime = 0;
  sharedAudio.src = path;

  const status = document.getElementById("audioStatus");
  if (status) {
    status.querySelector("strong").textContent = `Playing: ${label}`;
    status.querySelector("p").textContent = "Synthetic Latin audio model";
    status.classList.add("playing");
  }

  sharedAudio.play().catch(() => {
    if (status) {
      status.querySelector("strong").textContent = "Audio could not start";
      status.querySelector("p").textContent = "Check that the site is being run through a local web server.";
    }
  });

  sharedAudio.onended = () => {
    if (status) {
      status.querySelector("strong").textContent = "Audio ready";
      status.querySelector("p").textContent = "Select another pronunciation control.";
      status.classList.remove("playing");
    }
  };
}

document.querySelectorAll("[data-audio]").forEach((button) => {
  button.addEventListener("click", () => {
    playClip(button.dataset.audio, button.getAttribute("aria-label") || "Latin audio");
  });
});

const vowelGrid = document.getElementById("vowelGrid");
lessonData.vowels.forEach((vowel) => {
  const card = document.createElement("article");
  card.className = "vowel-card";
  card.innerHTML = `
    <span class="vowel-pair"><b>${vowel.short}</b><b>${vowel.long}</b></span>
    <small>${vowel.shortHint} · ${vowel.longHint}</small>
    <span class="dual-audio">
      <button type="button" data-vowel-audio="${vowel.shortAudio}" aria-label="Play ${vowel.shortHint}">🔊 ${vowel.short}</button>
      <button type="button" data-vowel-audio="${vowel.longAudio}" aria-label="Play ${vowel.longHint}">🔊 ${vowel.long}</button>
    </span>
  `;
  card.querySelectorAll("[data-vowel-audio]").forEach((button) => {
    button.addEventListener("click", () => {
      playClip(button.dataset.vowelAudio, button.getAttribute("aria-label"));
    });
  });
  vowelGrid.appendChild(card);
});

const diphthongGrid = document.getElementById("diphthongGrid");
lessonData.diphthongs.forEach((sound) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "sound-card";
  button.innerHTML = `
    <strong>${sound.text}</strong>
    <small>${sound.example} — ${sound.hint}</small>
    <span class="play-label">🔊 Play example</span>
  `;
  button.addEventListener("click", () => playClip(sound.audio, `${sound.text} in ${sound.example}`));
  diphthongGrid.appendChild(button);
});

document.querySelectorAll(".map-point").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".map-point").forEach((point) => point.classList.remove("active"));
    button.classList.add("active");
    const place = lessonData.places[button.dataset.place];
    document.getElementById("placeTitle").textContent = place.title;
    document.getElementById("placeLatin").textContent = place.latin;
    document.getElementById("placeDescription").textContent = place.description;
  });
});

document.querySelector(".word-button").addEventListener("click", () => {
  document.getElementById("stressExplanation").innerHTML =
    "The penultimate syllable <b>se</b> is short, so the stress moves back: a-mā-<b>VIS</b>-se-tis.";
  playClip("../assets/audio/latin/stress-amavissetis.mp3", "amāvissetis");
});

const collectibleButton = document.querySelector(".collect-button");
const collectionKey = "latinAcademy.collectible.sineQuaNon";
if (localStorage.getItem(collectionKey) === "collected") {
  collectibleButton.textContent = "✓ Collected";
  collectibleButton.classList.add("collected");
}
collectibleButton.addEventListener("click", () => {
  localStorage.setItem(collectionKey, "collected");
  collectibleButton.textContent = "✓ Collected";
  collectibleButton.classList.add("collected");
});

document.getElementById("foundationsQuiz").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const answers = { q1: "length", q2: "ae", q3: "rome", q4: "italian", q5: "first" };
  let score = 0;

  Object.entries(answers).forEach(([question, answer]) => {
    if (formData.get(question) === answer) score += 1;
  });

  const result = document.getElementById("quizResult");
  result.hidden = false;
  result.className = `quiz-result ${score >= 4 ? "success" : "try-again"}`;
  result.textContent = score >= 4
    ? `Excellent — ${score}/5. You have completed the first Foundations lesson.`
    : `You scored ${score}/5. Review the highlighted lesson sections and try again.`;

  localStorage.setItem("latinAcademy.foundations.quizScore", String(score));
  updateProgress();
});

function updateProgress() {
  const sections = document.querySelectorAll("[data-section]");
  let visited = Number(localStorage.getItem("latinAcademy.foundations.visited") || 0);
  const quizScore = Number(localStorage.getItem("latinAcademy.foundations.quizScore") || 0);
  const collected = localStorage.getItem(collectionKey) === "collected";

  let percentage = Math.min(70, visited * 12);
  if (collected) percentage += 10;
  if (quizScore >= 4) percentage = 100;

  document.getElementById("progressPercent").textContent = `${percentage}%`;
  document.getElementById("progressBar").style.width = `${percentage}%`;
}

const observed = new Set();
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      observed.add(entry.target.id);
      localStorage.setItem("latinAcademy.foundations.visited", String(observed.size));
      updateProgress();
    }
  });
}, { threshold: 0.35 });

document.querySelectorAll("[data-section]").forEach((section) => observer.observe(section));
updateProgress();
