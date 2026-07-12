const lessonData = {
  vowels: [
    { short: "ă", long: "ā", shortHint: "short a, as in cup", longHint: "long a, as in father" },
    { short: "ĕ", long: "ē", shortHint: "short e, as in set", longHint: "long e, held clearly" },
    { short: "ĭ", long: "ī", shortHint: "short i, as in bit", longHint: "long i, as in machine" },
    { short: "ŏ", long: "ō", shortHint: "short o, as in lot", longHint: "long o, held steadily" },
    { short: "ŭ", long: "ū", shortHint: "short u, as in put", longHint: "long u, as in rule" }
  ],
  diphthongs: [
    { text: "ae", hint: "a single gliding sound, similar to eye" },
    { text: "au", hint: "similar to the sound in now" },
    { text: "ei", hint: "a smooth e-to-i glide" },
    { text: "oe", hint: "a rounded two-vowel glide" },
    { text: "ui", hint: "u and i combined in one syllable" },
    { text: "eu", hint: "e and u pronounced in one breath" }
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

const vowelGrid = document.getElementById("vowelGrid");
lessonData.vowels.forEach((vowel) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "vowel-card";
  button.innerHTML = `
    <span class="vowel-pair"><b>${vowel.short}</b><b>${vowel.long}</b></span>
    <small>${vowel.shortHint}<br>${vowel.longHint}</small>
    <span class="play-label">Select to compare</span>
  `;
  button.addEventListener("click", () => {
    alert(`${vowel.short}: ${vowel.shortHint}\n${vowel.long}: ${vowel.longHint}`);
  });
  vowelGrid.appendChild(button);
});

const diphthongGrid = document.getElementById("diphthongGrid");
lessonData.diphthongs.forEach((sound) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "sound-card";
  button.innerHTML = `
    <strong>${sound.text}</strong>
    <small>${sound.hint}</small>
    <span class="play-label">Select for guidance</span>
  `;
  button.addEventListener("click", () => alert(`${sound.text}: ${sound.hint}`));
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
