const screens = [...document.querySelectorAll(".lesson-screen")];
const gate = document.getElementById("lesson2Gate");
const lesson = document.getElementById("interactiveLesson");
const previousButton = document.getElementById("previousScreen");
const nextButton = document.getElementById("nextScreen");
const counter = document.getElementById("screenCounter");
const progressBar = document.getElementById("lessonProgressBar");
const progressText = document.getElementById("lessonProgressText");
const navigation = document.getElementById("lessonNavigation");
const lessonAudio = LatinLessonCommon.createAudioController("../../assets/audio/latin/book1");
const audio = lessonAudio.audio;

let currentScreen = 0;
let quizPassed = false;
let endingMatchIndex = 0;
let workshopIndex = 0;
let translationIndex = 0;

const endings = [
  { ending: "ō", meaning: "I", person: "1st singular" },
  { ending: "s", meaning: "you", person: "2nd singular" },
  { ending: "t", meaning: "he, she or it", person: "3rd singular" },
  { ending: "mus", meaning: "we", person: "1st plural" },
  { ending: "tis", meaning: "you all", person: "2nd plural" },
  { ending: "nt", meaning: "they", person: "3rd plural" }
];

const verbs = {
  amo: {
    principal: "amō", meaning: "love", stem: "amā", firstStem: "am",
    forms: ["amō", "amās", "amat", "amāmus", "amātis", "amant"],
    audio: ["amo.mp3", "amas.mp3", "amat.mp3", "amamus.mp3", "amatis.mp3", "amant.mp3"]
  },
  canto: {
    principal: "cantō", meaning: "sing", stem: "cantā", firstStem: "cant",
    forms: ["cantō", "cantās", "cantat", "cantāmus", "cantātis", "cantant"],
    audio: ["canto-1.mp3", "canto-2.mp3", "canto-3.mp3", "canto-4.mp3", "canto-5.mp3", "canto-6.mp3"]
  },
  aedifico: {
    principal: "aedificō", meaning: "build", stem: "aedificā", firstStem: "aedific",
    forms: ["aedificō", "aedificās", "aedificat", "aedificāmus", "aedificātis", "aedificant"],
    audio: ["aedifico-1.mp3", "aedifico-2.mp3", "aedifico-3.mp3", "aedifico-4.mp3", "aedifico-5.mp3", "aedifico-6.mp3"]
  },
  voco: {
    principal: "vocō", meaning: "call", stem: "vocā", firstStem: "voc",
    forms: ["vocō", "vocās", "vocat", "vocāmus", "vocātis", "vocant"],
    audio: ["voco-1.mp3", "voco-2.mp3", "voco-3.mp3", "voco-4.mp3", "voco-5.mp3", "voco-6.mp3"]
  },
  navigo: {
    principal: "nāvigō", meaning: "sail", stem: "nāvigā", firstStem: "nāvig",
    forms: ["nāvigō", "nāvigās", "nāvigat", "nāvigāmus", "nāvigātis", "nāvigant"],
    audio: ["navigo-1.mp3", "navigo-2.mp3", "navigo-3.mp3", "navigo-4.mp3", "navigo-5.mp3", "navigo-6.mp3"]
  },
  festino: {
    principal: "festīnō", meaning: "hurry", stem: "festīnā", firstStem: "festīn",
    forms: ["festīnō", "festīnās", "festīnat", "festīnāmus", "festīnātis", "festīnant"],
    audio: ["festino-1.mp3", "festino-2.mp3", "festino-3.mp3", "festino-4.mp3", "festino-5.mp3", "festino-6.mp3"]
  },
  laboro: {
    principal: "labōrō", meaning: "work", stem: "labōrā", firstStem: "labōr",
    forms: ["labōrō", "labōrās", "labōrat", "labōrāmus", "labōrātis", "labōrant"],
    audio: ["laboro-1.mp3", "laboro-2.mp3", "laboro-3.mp3", "laboro-4.mp3", "laboro-5.mp3", "laboro-6.mp3"]
  }
};

const workshopTasks = [
  { verb: "canto", form: 3, english: "we sing" },
  { verb: "voco", form: 5, english: "they call" },
  { verb: "aedifico", form: 1, english: "you build" },
  { verb: "navigo", form: 2, english: "he, she or it sails" },
  { verb: "festino", form: 4, english: "you all hurry" },
  { verb: "laboro", form: 0, english: "I work" },
  { verb: "amo", form: 4, english: "you all love" },
  { verb: "canto", form: 5, english: "they sing" }
];

const translations = [
  { verb: "voco", form: 4, answer: "you all call", options: ["you all call", "we call", "they call"] },
  { verb: "navigo", form: 2, answer: "he, she or it sails", options: ["I sail", "he, she or it sails", "you sail"] },
  { verb: "festino", form: 5, answer: "they hurry", options: ["they hurry", "we hurry", "you all hurry"] },
  { verb: "aedifico", form: 0, answer: "I build", options: ["I build", "he builds", "they build"] },
  { verb: "laboro", form: 3, answer: "we work", options: ["you work", "we work", "they work"] },
  { verb: "canto", form: 1, answer: "you sing", options: ["you sing", "I sing", "you all sing"] }
];

const quizItems = [
  {
    question: "Which ending means ‘we’?",
    options: ["-mus", "-tis", "-nt"],
    answer: "-mus"
  },
  {
    question: "What is the present stem of vocō?",
    options: ["vocā-", "vocō-", "vo-"],
    answer: "vocā-"
  },
  {
    question: "What does cantant mean?",
    options: ["they sing", "we sing", "you sing"],
    answer: "they sing"
  },
  {
    question: "Which form means ‘you all build’?",
    options: ["aedificāmus", "aedificātis", "aedificant"],
    answer: "aedificātis"
  },
  {
    question: "Which form is 3rd person singular?",
    options: ["nāvigat", "nāvigās", "nāvigant"],
    answer: "nāvigat"
  },
  {
    question: "Which ending sequence is correct?",
    options: [
      "-ō, -s, -t, -mus, -tis, -nt",
      "-ō, -t, -s, -tis, -mus, -nt",
      "-s, -ō, -t, -nt, -mus, -tis"
    ],
    answer: "-ō, -s, -t, -mus, -tis, -nt"
  }
];

function ensureLesson2(progress) {
  progress.book1 = progress.book1 || { unlocked: true, chapter1: { lessons: {} } };
  progress.book1.chapter1 = progress.book1.chapter1 || {
    started: false, completed: false, progress: 0, lessons: {}
  };
  progress.book1.chapter1.lessons = progress.book1.chapter1.lessons || {};
  progress.book1.chapter1.lessons.lesson2 =
    progress.book1.chapter1.lessons.lesson2 || {
      started: false,
      completed: false,
      progress: 0,
      screen: 0,
      quizScore: null,
      quizTotal: 6,
      completedAt: null
    };
  return progress.book1.chapter1.lessons.lesson2;
}

function getLesson2() {
  return ensureLesson2(LatinProfiles.getActiveProfile().progress);
}

function saveLesson2(updates) {
  LatinProfiles.updateActiveProgress((progress) => {
    const lesson2 = ensureLesson2(progress);
    Object.assign(lesson2, updates);
    progress.book1.chapter1.started = true;

    const lesson1 = progress.book1.chapter1.lessons.lesson1 || {};
    const completed = [lesson1.completed, lesson2.completed].filter(Boolean).length;
    progress.book1.chapter1.progress = Math.round((completed / 2) * 100);
  });
}

function playClip(filename) {
  return lessonAudio.play(filename);
}

function showScreen(index, options = {}) {
  currentScreen = Math.max(0, Math.min(index, screens.length - 1));
  screens.forEach((screen, i) => screen.classList.toggle("active", i === currentScreen));

  const percent = Math.round((currentScreen / (screens.length - 1)) * 100);
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}%`;
  counter.textContent = `${currentScreen + 1} / ${screens.length}`;
  previousButton.disabled = currentScreen === 0;

  const isQuiz = currentScreen === 9;
  const isComplete = currentScreen === 10;
  navigation.hidden = isComplete;
  nextButton.hidden = isComplete;
  nextButton.disabled = isQuiz && !quizPassed;
  nextButton.textContent = isQuiz
    ? (quizPassed ? "View completion" : "Pass quiz to continue")
    : "Continue";

  if (!options.skipSave) {
    saveLesson2({ started: true, screen: currentScreen, progress: percent });
  }
  window.scrollTo({ top: 0, behavior: options.instant ? "auto" : "smooth" });
}

function renderEndingPattern() {
  document.getElementById("endingPattern").innerHTML = endings.map((item) => `
    <article>
      <span class="ending-badge">-${item.ending}</span>
      <strong>${item.meaning}</strong>
      <small>${item.person}</small>
    </article>
  `).join("");
}

function renderConjugation(verbKey) {
  const verb = verbs[verbKey];
  document.getElementById("lesson2Conjugation").innerHTML =
    verb.forms.map((form, index) => `
      <article class="conjugation-line">
        <span>${endings[index].person}</span>
        <strong>${form}</strong>
        <span>${endings[index].meaning} ${verb.meaning}</span>
        <button type="button" data-audio="${verb.audio[index]}">🔊</button>
      </article>
    `).join("");

  document.querySelectorAll("#lesson2Conjugation [data-audio]").forEach((button) => {
    button.addEventListener("click", () => playClip(button.dataset.audio));
  });
}

function configureSimpleQuestion(name, answer, feedbackId, success) {
  document.querySelectorAll(`[data-question="${name}"] button`).forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest(".choice-row");
      group.querySelectorAll("button").forEach((item) =>
        item.classList.remove("correct", "incorrect")
      );
      const correct = button.dataset.answer === answer;
      button.classList.add(correct ? "correct" : "incorrect");
      document.getElementById(feedbackId).textContent = correct
        ? success
        : "Not quite. Remove the final -ō and restore the long ā.";
    });
  });
}

function renderEndingMatch() {
  const item = endings[endingMatchIndex];
  document.getElementById("endingMatchPrompt").textContent =
    `Choose the ending meaning “${item.meaning}”.`;
  document.getElementById("endingMatchFeedback").textContent = "";

  const shuffled = LatinLessonCommon.shuffle(endings);
  const bank = document.getElementById("endingMatchBank");
  bank.innerHTML = shuffled.map((ending) => `
    <button type="button" data-ending="${ending.ending}">-${ending.ending}</button>
  `).join("");

  bank.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const correct = button.dataset.ending === item.ending;
      button.classList.add(correct ? "correct" : "incorrect");
      if (!correct) {
        document.getElementById("endingMatchFeedback").textContent =
          "Try again. Recall the chant: -ō, -s, -t, -mus, -tis, -nt.";
        return;
      }

      endingMatchIndex += 1;
      document.getElementById("endingMatchScore").textContent = endingMatchIndex;
      document.getElementById("endingMatchFeedback").textContent =
        `Correct — -${item.ending} means “${item.meaning}”.`;

      if (endingMatchIndex < endings.length) {
        setTimeout(renderEndingMatch, 500);
      } else {
        document.getElementById("endingMatchPrompt").textContent =
          "Excellent — all six endings matched.";
        bank.innerHTML = "";
      }
    });
  });
}

function renderWorkshop() {
  const task = workshopTasks[workshopIndex];
  const verb = verbs[task.verb];
  const ending = endings[task.form];

  document.getElementById("workshopMeaning").textContent = task.english;
  document.getElementById("workshopStem").textContent =
    task.form === 0 ? verb.firstStem : verb.stem;
  document.getElementById("workshopSlot").textContent = "?";
  document.getElementById("workshopFeedback").textContent = "";

  const options = LatinLessonCommon.shuffle(endings);
  const bank = document.getElementById("workshopBank");
  bank.innerHTML = options.map((item) => `
    <button type="button" data-ending="${item.ending}">-${item.ending}</button>
  `).join("");

  bank.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const correct = button.dataset.ending === ending.ending;
      button.classList.add(correct ? "correct" : "incorrect");
      if (!correct) {
        document.getElementById("workshopFeedback").textContent =
          "That ending represents a different person or number.";
        return;
      }

      document.getElementById("workshopSlot").textContent = ending.ending;
      document.getElementById("workshopFeedback").textContent =
        `${verb.forms[task.form]} means “${task.english}”.`;
      playClip(verb.audio[task.form]);

      workshopIndex += 1;
      document.getElementById("workshopScore").textContent = workshopIndex;
      if (workshopIndex < workshopTasks.length) {
        setTimeout(renderWorkshop, 650);
      } else {
        bank.innerHTML = "";
        document.getElementById("workshopPrompt").textContent =
          "Workshop complete — eight forms built.";
      }
    });
  });
}

function renderTranslation() {
  const task = translations[translationIndex];
  const verb = verbs[task.verb];
  const correct = task.answer;

  document.getElementById("translationLatin").textContent = verb.forms[task.form];
  document.getElementById("translationFeedback").textContent = "";
  document.getElementById("translationAudio").onclick =
    () => playClip(verb.audio[task.form]);

  const choices = document.getElementById("translationChoices");
  choices.innerHTML = task.options.map((option) => `
    <button type="button" data-answer="${option}">${option}</button>
  `).join("");

  choices.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const isCorrect = button.dataset.answer === correct;
      button.classList.add(isCorrect ? "correct" : "incorrect");
      if (!isCorrect) {
        document.getElementById("translationFeedback").textContent =
          "Read the ending first, then identify the verb stem.";
        return;
      }

      document.getElementById("translationFeedback").textContent =
        `Correct — ${verb.forms[task.form]} means “${correct}”.`;
      translationIndex += 1;
      document.getElementById("translationScore").textContent = translationIndex;
      if (translationIndex < translations.length) {
        setTimeout(renderTranslation, 600);
      } else {
        choices.innerHTML = "";
        document.getElementById("translationLatin").textContent = "Optimē!";
        document.getElementById("translationFeedback").textContent =
          "All six forms translated.";
      }
    });
  });
}

function renderQuiz() {
  const form = document.getElementById("lesson2Quiz");
  form.innerHTML = quizItems.map((item, index) => `
    <fieldset>
      <legend>${index + 1}. ${item.question}</legend>
      ${item.options.map((option) => `
        <label>
          <input type="radio" name="q${index}" value="${option}">
          ${option}
        </label>
      `).join("")}
    </fieldset>
  `).join("") + '<button class="button primary" type="submit">Mark answers</button>';
}

function playClipAndWait(filename) {
  return lessonAudio.playAndWait(filename);
}

document.getElementById("playAmoPattern").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = "🔊 Playing amō, amās, amat, amāmus, amātis, amant…";
  await lessonAudio.playSequence(verbs.amo.audio, 120);
  button.disabled = false;
  button.innerHTML = "🔊 Hear the pattern with <i>amō</i>";
});

document.querySelectorAll(".verb-selector button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".verb-selector button").forEach((item) =>
      item.classList.remove("active")
    );
    button.classList.add("active");
    renderConjugation(button.dataset.verb);
  });
});

document.getElementById("lesson2Quiz").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  let score = 0;
  quizItems.forEach((item, index) => {
    if (data.get(`q${index}`) === item.answer) score += 1;
  });

  const passed = score >= 5;
  const result = document.getElementById("lesson2QuizResult");
  result.hidden = false;
  result.className = `quiz-result ${passed ? "success" : "try-again"}`;
  result.textContent = passed
    ? `Excellent — ${score}/6. Lesson complete.`
    : `You scored ${score}/6. Review the endings and try again.`;

  const current = getLesson2();
  const wasComplete = Boolean(current.completed);
  const bestScore = Math.max(Number(current.quizScore || 0), score);

  saveLesson2({
    quizScore: bestScore,
    quizTotal: 6,
    completed: passed || wasComplete,
    progress: passed || wasComplete ? 100 : Math.max(current.progress || 0, 90),
    completedAt: passed
      ? (current.completedAt || new Date().toISOString())
      : current.completedAt
  });

  if (passed && !wasComplete) {
    LatinProfiles.addXp(35);
    LatinProfiles.updateActiveProgress((progress) => {
      const lesson2 = ensureLesson2(progress);
      lesson2.completed = true;
      lesson2.progress = 100;

      const ids = new Set(progress.achievements.map((item) =>
        typeof item === "string" ? item : item.id
      ));
      if (!ids.has("first-conjugator")) {
        progress.achievements.push({
          id: "first-conjugator",
          title: "First Conjugator",
          description: "Conjugated several first-conjugation verbs in the present tense.",
          icon: "🏛️",
          earnedAt: new Date().toISOString()
        });
      }
    });
  }

  if (passed) {
    quizPassed = true;
    document.getElementById("lesson2FinalScore").textContent = `${bestScore}/6`;
    document.getElementById("lesson2CompletionMessage").textContent =
      `${LatinProfiles.getActiveProfile().name} can now conjugate regular first-conjugation verbs.`;
    nextButton.disabled = false;
    nextButton.textContent = "View completion";
  }
});

previousButton.addEventListener("click", () => showScreen(currentScreen - 1));
nextButton.addEventListener("click", () => showScreen(currentScreen + 1));
document.querySelectorAll(".next-screen").forEach((button) =>
  button.addEventListener("click", () => showScreen(currentScreen + 1))
);

function initialise() {
  const profile = LatinProfiles.getActiveProfile();
  const lesson1 = profile.progress.book1?.chapter1?.lessons?.lesson1;
  const unlocked = Boolean(lesson1?.completed);

  gate.hidden = unlocked;
  lesson.hidden = !unlocked;
  navigation.hidden = !unlocked;

  if (!unlocked) return;

  renderEndingPattern();
  renderConjugation("canto");
  configureSimpleQuestion(
    "stem", "labora", "stemFeedback",
    "Correct — labōrō has the present stem labōrā-."
  );
  renderEndingMatch();
  renderWorkshop();
  renderTranslation();
  renderQuiz();

  const saved = getLesson2();
  quizPassed = Boolean(saved.completed);
  showScreen(Math.min(Number(saved.screen || 0), 9), {
    skipSave: false,
    instant: true
  });

  if (saved.quizScore != null) {
    const result = document.getElementById("lesson2QuizResult");
    result.hidden = false;
    result.className = `quiz-result ${saved.quizScore >= 5 ? "success" : "try-again"}`;
    result.textContent = saved.quizScore >= 5
      ? `Best score: ${saved.quizScore}/6. Lesson complete.`
      : `Best score: ${saved.quizScore}/6. Score 5 or more to complete the lesson.`;
    document.getElementById("lesson2FinalScore").textContent =
      `${saved.quizScore}/6`;
  }
}

document.addEventListener("DOMContentLoaded", initialise);
window.addEventListener("latinprofilechanged", initialise);
