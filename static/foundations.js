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
    britannia: { title: "Britannia", latin: "Britannia", period: "Province", category: "Region", description: "Rome began the conquest of Britain in AD 43. By Trajan's reign, Roman control covered most of England and Wales, while the northern frontier remained contested." },
    hispania: { title: "Hispania", latin: "Hispānia", period: "Provinces", category: "Region", description: "The Iberian Peninsula was divided into several Roman provinces. It supplied metals, agricultural products, soldiers and prominent imperial families." },
    gaul: { title: "Gaul", latin: "Gallia", period: "Provinces", category: "Region", description: "Gaul covered much of modern France, Belgium and neighbouring areas. Spoken Latin there eventually contributed to the development of French." },
    italia: { title: "Italy", latin: "Italia", period: "Heartland", category: "Region", description: "Italy formed the political and cultural heartland of the empire. Rome remained its symbolic centre and largest city." },
    graecia: { title: "Greece and the Balkans", latin: "Graecia et Balcania", period: "Provinces", category: "Region", description: "Greek language and culture remained highly influential in the eastern empire. The Balkans also formed a critical military corridor." },
    asia: { title: "Asia Minor", latin: "Asia Minor", period: "Provinces", category: "Region", description: "Asia Minor contained wealthy cities, major trade routes and several long-established Greek-speaking communities." },
    africa: { title: "Roman North Africa", latin: "Africa Rōmāna", period: "Provinces", category: "Region", description: "Roman North Africa included fertile agricultural regions and major cities. It became one of the empire's most important grain-producing areas." },
    aegyptus: { title: "Egypt", latin: "Aegyptus", period: "Imperial province", category: "Region", description: "Egypt was governed as an imperial province. The Nile valley supplied grain, while Alexandria was a major centre of commerce and learning." },
    syria: { title: "Syria", latin: "Syria", period: "Province", category: "Region", description: "Syria linked the Mediterranean to inland trade routes. Antioch was one of the largest and most important cities in the Roman world." },
    mesopotamia: { title: "Mesopotamia", latin: "Mesopotamia", period: "Recent conquest", category: "Region", description: "Trajan's eastern campaigns briefly extended Roman power into Mesopotamia. These gains proved difficult to retain after his death." },
    rome: { title: "Rome", latin: "Rōma", period: "Capital", category: "City", description: "Rome was the empire's political and symbolic capital, the seat of the Senate and the centre of Roman civic identity." },
    carthage: { title: "Carthage", latin: "Carthāgō", period: "Provincial capital", category: "City", description: "Re-founded as a Roman colony, Carthage became a prosperous administrative and commercial centre in North Africa." },
    alexandria: { title: "Alexandria", latin: "Alexandria", period: "Major metropolis", category: "City", description: "Alexandria was a major port, intellectual centre and gateway to Egypt's grain supply." },
    antioch: { title: "Antioch", latin: "Antiochia", period: "Major metropolis", category: "City", description: "Antioch served as a major administrative and military base for Rome's eastern provinces." }
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
if (vowelGrid) vowelGrid.innerHTML = "";
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
if (diphthongGrid) diphthongGrid.innerHTML = "";
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

function showMapPlace(placeKey, element) {
  const place = lessonData.places[placeKey];
  if (!place) return;

  document.querySelectorAll(".map-region, .svg-city").forEach((item) => item.classList.remove("active"));
  if (element) element.classList.add("active");

  document.getElementById("placeTitle").textContent = place.title;
  document.getElementById("placeLatin").textContent = place.latin;
  document.getElementById("placeDescription").textContent = place.description;
  document.getElementById("placePeriod").textContent = place.period;
  document.getElementById("placeCategory").textContent = place.category;
}

document.querySelectorAll(".map-region, .svg-city").forEach((element) => {
  element.setAttribute("tabindex", "0");
  element.setAttribute("role", "button");

  element.addEventListener("click", () => showMapPlace(element.dataset.place, element));
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showMapPlace(element.dataset.place, element);
    }
  });
});

document.getElementById("resetMap")?.addEventListener("click", () => {
  document.querySelectorAll(".map-region, .svg-city").forEach((item) => item.classList.remove("active"));
  document.getElementById("placeTitle").textContent = "Roman Empire";
  document.getElementById("placeLatin").textContent = "Imperium Rōmānum";
  document.getElementById("placeDescription").textContent =
    "Select a shaded province or named city to explore the Roman world at the death of Trajan in AD 117.";
  document.getElementById("placePeriod").textContent = "AD 117";
  document.getElementById("placeCategory").textContent = "Empire";
});

document.getElementById("toggleLabels")?.addEventListener("click", (event) => {
  const labels = document.querySelector(".map-labels");
  const cities = document.querySelector(".city-layer");
  const hidden = labels.classList.toggle("labels-hidden");
  cities.classList.toggle("labels-hidden", hidden);
  event.currentTarget.textContent = hidden ? "Show labels" : "Hide labels";
  event.currentTarget.setAttribute("aria-pressed", String(!hidden));
});

document.querySelector(".word-button")?.addEventListener("click", () => {
  document.getElementById("stressExplanation").innerHTML =
    "The penultimate syllable <b>se</b> is short, so the stress moves back: a-mā-<b>VIS</b>-se-tis.";
  playClip("../assets/audio/latin/stress-amavissetis.mp3", "amāvissetis");
});

const collectibleButton = document.querySelector(".collect-button");
const collectionKey = "latinAcademy.collectible.sineQuaNon";
if (collectibleButton) {
  if (localStorage.getItem(collectionKey) === "collected") {
    collectibleButton.textContent = "✓ Collected";
    collectibleButton.classList.add("collected");
  }
  collectibleButton.addEventListener("click", () => {
    localStorage.setItem(collectionKey, "collected");
    collectibleButton.textContent = "✓ Collected";
    collectibleButton.classList.add("collected");
    updateProgress();
  });
}

document.getElementById("foundationsQuiz")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const answers = { q1: "length", q2: "ae", q3: "rome", q4: "italian", q5: "first", q6: "hard", q7: "w", q8: "lengthen", q9: "tap" };
  let score = 0;

  Object.entries(answers).forEach(([question, answer]) => {
    if (formData.get(question) === answer) score += 1;
  });

  const result = document.getElementById("quizResult");
  result.hidden = false;
  result.className = `quiz-result ${score >= 7 ? "success" : "try-again"}`;
  result.textContent = score >= 7
    ? `Excellent — ${score}/9. You have completed the first Foundations lesson.`
    : `You scored ${score}/9. Review the highlighted lesson sections and try again.`;

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

document.querySelectorAll(".audio-example").forEach((button) => {
  button.addEventListener("click", () => {
    playClip(button.dataset.audio, button.textContent.trim());
  });
});
