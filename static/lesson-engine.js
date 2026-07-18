const lessonScreens = [...document.querySelectorAll(".lesson-screen")];
const previousButton = document.getElementById("previousScreen");
const nextButton = document.getElementById("nextScreen");
const counter = document.getElementById("screenCounter");
const progressBar = document.getElementById("lessonProgressBar");
const progressText = document.getElementById("lessonProgressText");
const navigation = document.getElementById("lessonNavigation");

let currentScreen = 0;
let builderIndex = 0;
let builderCompleted = 0;
let quizPassed = false;
const completedChecks = new Set();

const forms = [
  { latin: "amō", stem: "am", ending: "ō", english: "I love", audio: "amo.mp3" },
  { latin: "amās", stem: "amā", ending: "s", english: "you love", audio: "amas.mp3" },
  { latin: "amat", stem: "amā", ending: "t", english: "he, she or it loves", audio: "amat.mp3" },
  { latin: "amāmus", stem: "amā", ending: "mus", english: "we love", audio: "amamus.mp3" },
  { latin: "amātis", stem: "amā", ending: "tis", english: "you all love", audio: "amatis.mp3" },
  { latin: "amant", stem: "ama", ending: "nt", english: "they love", audio: "amant.mp3" }
];

const quiz = [
  {
    question: "Which word is the verb in: The soldier fights?",
    options: ["the", "soldier", "fights"],
    answer: "fights"
  },
  {
    question: "Which grammatical person means ‘we’?",
    options: ["1st person plural", "2nd person singular", "3rd person plural"],
    answer: "1st person plural"
  },
  {
    question: "Which form means ‘we love’?",
    options: ["amās", "amāmus", "amant"],
    answer: "amāmus"
  },
  {
    question: "Which ending identifies ‘they’?",
    options: ["-s", "-mus", "-nt"],
    answer: "-nt"
  },
  {
    question: "What does the ending of a Latin verb usually tell us here?",
    options: [
      "who is doing the action",
      "where the action happens",
      "the colour of the subject"
    ],
    answer: "who is doing the action"
  }
];

const audio = new Audio();

function ensureBookOneProgress(progress) {
  progress.book1 = progress.book1 || {
    unlocked:
      Boolean(progress.lessons.pronunciation?.completed) ||
      Number(progress.lessons.pronunciation?.quizScore || 0) >= 7 ||
      Number(progress.lessons.pronunciation?.progress || 0) >= 100,
    chapter1: {
      started: false,
      completed: false,
      progress: 0,
      lessons: {}
    }
  };

  progress.book1.chapter1 = progress.book1.chapter1 || {
    started: false,
    completed: false,
    progress: 0,
    lessons: {}
  };

  progress.book1.chapter1.lessons = progress.book1.chapter1.lessons || {};
  progress.book1.chapter1.lessons.lesson1 =
    progress.book1.chapter1.lessons.lesson1 || {
      started: false,
      completed: false,
      progress: 0,
      screen: 0,
      quizScore: null,
      quizTotal: 5,
      completedAt: null
    };

  return progress.book1.chapter1.lessons.lesson1;
}

function activeLessonProgress() {
  const profile = LatinProfiles.getActiveProfile();
  return ensureBookOneProgress(profile.progress);
}

function saveLessonProgress(updates) {
  LatinProfiles.updateActiveProgress((progress) => {
    const lesson = ensureBookOneProgress(progress);
    Object.assign(lesson, updates);
    progress.book1.unlocked = Boolean(progress.lessons.pronunciation?.completed);
    progress.book1.chapter1.started = true;
    progress.book1.chapter1.progress = lesson.completed
      ? 100
      : Math.max(
          progress.book1.chapter1.progress || 0,
          Math.round(((lesson.screen || 0) / (lessonScreens.length - 1)) * 100)
        );
  });
}

function showScreen(index, options = {}) {
  const bounded = Math.max(0, Math.min(index, lessonScreens.length - 1));
  currentScreen = bounded;

  lessonScreens.forEach((screen, screenIndex) => {
    screen.classList.toggle("active", screenIndex === currentScreen);
  });

  const percent = Math.round((currentScreen / (lessonScreens.length - 1)) * 100);
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}%`;
  counter.textContent = `${currentScreen + 1} / ${lessonScreens.length}`;
  previousButton.disabled = currentScreen === 0;

  const isQuiz = currentScreen === 8;
  const isComplete = currentScreen === 9;
  nextButton.hidden = isComplete;
  navigation.hidden = isComplete;

  if (isQuiz) {
    nextButton.disabled = !quizPassed;
    nextButton.textContent = quizPassed ? "View completion" : "Pass quiz to continue";
  } else {
    nextButton.disabled = false;
    nextButton.textContent = currentScreen === lessonScreens.length - 2
      ? "Finish lesson"
      : "Continue";
  }

  if (!options.skipSave) {
    saveLessonProgress({
      started: true,
      screen: currentScreen,
      progress: percent
    });
  }

  window.scrollTo({ top: 0, behavior: options.instant ? "auto" : "smooth" });
}

function playClip(filename) {
  audio.pause();
  audio.currentTime = 0;
  audio.src = `../../assets/audio/latin/book1/${filename}`;
  audio.play().catch(() => {});
}

document.querySelectorAll("[data-audio]").forEach((button) => {
  button.addEventListener("click", () => {
    const filename = button.dataset.audio.split("/").pop();
    playClip(filename);
  });
});

function configureChoiceQuestion(name, correctAnswer, feedbackId, successText) {
  document.querySelectorAll(`[data-question="${name}"] button`).forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest(".choice-row");
      group.querySelectorAll("button").forEach((item) => {
        item.classList.remove("correct", "incorrect");
      });

      const correct = button.dataset.answer === correctAnswer;
      button.classList.add(correct ? "correct" : "incorrect");

      const feedback = document.getElementById(feedbackId);
      feedback.textContent = correct
        ? successText
        : "Not quite. Look for the word that matches the clue.";

      if (correct) completedChecks.add(name);
    });
  });
}

configureChoiceQuestion(
  "action",
  "moves",
  "actionFeedback",
  "Correct — ‘moves’ expresses the action."
);
configureChoiceQuestion(
  "sentence",
  "fights",
  "sentenceFeedback",
  "Correct — ‘fights’ tells us what the soldier does."
);
configureChoiceQuestion(
  "person",
  "first",
  "personFeedback",
  "Correct — ‘we’ is first person plural."
);
configureChoiceQuestion(
  "number",
  "plural",
  "numberFeedback",
  "Correct — ‘they’ refers to more than one."
);

function renderFormRows(target) {
  target.innerHTML = forms.map((form) => `
    <article class="form-row">
      <span>${form.english}</span>
      <span class="latin-form">${form.latin}</span>
      <span>${form.stem} + ${form.ending}</span>
      <button type="button" data-form-audio="${form.audio}" aria-label="Play ${form.latin}">🔊</button>
    </article>
  `).join("");

  target.querySelectorAll("[data-form-audio]").forEach((button) => {
    button.addEventListener("click", () => playClip(button.dataset.formAudio));
  });
}

function renderBuilder() {
  const form = forms[builderIndex];
  document.getElementById("builderPrompt").textContent =
    `Build the form meaning “${form.english}”.`;
  document.getElementById("builderStem").textContent = form.stem;
  document.getElementById("builderSlot").textContent = "?";
  document.getElementById("builderFeedback").textContent = "";

  const shuffled = [...forms.map((item) => item.ending)]
    .sort(() => Math.random() - 0.5);

  const bank = document.getElementById("endingBank");
  bank.innerHTML = shuffled.map((ending) => `
    <button type="button" data-ending="${ending}">-${ending}</button>
  `).join("");

  bank.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      bank.querySelectorAll("button").forEach((item) => {
        item.classList.remove("correct", "incorrect");
      });

      const correct = button.dataset.ending === form.ending;
      button.classList.add(correct ? "correct" : "incorrect");

      if (!correct) {
        document.getElementById("builderFeedback").textContent =
          "Try another ending. Think about who performs the action.";
        return;
      }

      document.getElementById("builderSlot").textContent = form.ending;
      document.getElementById("builderFeedback").textContent =
        `${form.latin} means “${form.english}”.`;
      playClip(form.audio);

      builderCompleted += 1;
      document.getElementById("builderCompleted").textContent = builderCompleted;

      setTimeout(() => {
        if (builderIndex < forms.length - 1) {
          builderIndex += 1;
          renderBuilder();
        } else {
          completedChecks.add("builder");
          const reveal = document.getElementById("conjugationReveal");
          reveal.hidden = false;
          renderFormRows(reveal);
          document.getElementById("builderFeedback").textContent =
            "Excellent — you built all six forms.";
        }
      }, 650);
    });
  });
}

renderBuilder();
renderFormRows(document.getElementById("summaryConjugation"));

function renderQuiz() {
  const form = document.getElementById("book1LessonQuiz");
  form.innerHTML = quiz.map((item, index) => `
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

renderQuiz();

document.getElementById("book1LessonQuiz").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  let score = 0;

  quiz.forEach((item, index) => {
    if (data.get(`q${index}`) === item.answer) score += 1;
  });

  const passed = score >= 4;
  const result = document.getElementById("book1QuizResult");
  result.hidden = false;
  result.className = `quiz-result ${passed ? "success" : "try-again"}`;
  result.textContent = passed
    ? `Excellent — ${score}/5. Lesson complete.`
    : `You scored ${score}/5. Review the lesson and try again.`;

  const current = activeLessonProgress();
  const previousBest = Number(current.quizScore || 0);
  const wasComplete = Boolean(current.completed);
  const bestScore = Math.max(previousBest, score);

  saveLessonProgress({
    quizScore: bestScore,
    quizTotal: 5,
    completed: passed || wasComplete,
    progress: passed || wasComplete ? 100 : Math.max(current.progress || 0, 90),
    completedAt: passed
      ? (current.completedAt || new Date().toISOString())
      : current.completedAt
  });

  if (passed && !wasComplete) {
    LatinProfiles.addXp(25);
    LatinProfiles.updateActiveProgress((progress) => {
      progress.book1.chapter1.lessons.lesson1.completed = true;
      progress.book1.chapter1.lessons.lesson1.progress = 100;

      const achievementIds = new Set(
        progress.achievements.map((item) =>
          typeof item === "string" ? item : item.id
        )
      );

      if (!achievementIds.has("first-steps-latin")) {
        progress.achievements.push({
          id: "first-steps-latin",
          title: "First Steps into Latin",
          description: "Completed the first Book I lesson.",
          icon: "⭐",
          earnedAt: new Date().toISOString()
        });
      }
    });

    quizPassed = true;
    document.getElementById("finalQuizScore").textContent = `${score}/5`;
    document.getElementById("lessonCompletionMessage").textContent =
      `${LatinProfiles.getActiveProfile().name} has learned the six present forms of amō.`;
    nextButton.disabled = false;
    nextButton.textContent = "View completion";
  } else if (passed) {
    quizPassed = true;
    document.getElementById("finalQuizScore").textContent = `${bestScore}/5`;
    nextButton.disabled = false;
    nextButton.textContent = "View completion";
  }
});

previousButton.addEventListener("click", () => showScreen(currentScreen - 1));
nextButton.addEventListener("click", () => showScreen(currentScreen + 1));
document.querySelectorAll(".next-screen").forEach((button) => {
  button.addEventListener("click", () => showScreen(currentScreen + 1));
});

function restoreProgress() {
  const profile = LatinProfiles.getActiveProfile();
  const pronunciation = profile.progress.lessons.pronunciation || {};
  const foundationsComplete =
    Boolean(pronunciation.completed) ||
    Number(pronunciation.quizScore || 0) >= 7 ||
    Number(pronunciation.progress || 0) >= 100;

  if (!foundationsComplete) {
    window.location.href = "../../index.html#journey";
    return;
  }

  const lesson = activeLessonProgress();
  quizPassed = Boolean(lesson.completed);
  const restoredScreen = lesson.completed
    ? Math.min(Number(lesson.screen || 0), 8)
    : Math.min(Number(lesson.screen || 0), 8);

  showScreen(restoredScreen, { skipSave: false, instant: true });

  if (lesson.quizScore != null) {
    const result = document.getElementById("book1QuizResult");
    result.hidden = false;
    result.className = `quiz-result ${lesson.quizScore >= 4 ? "success" : "try-again"}`;
    result.textContent = lesson.quizScore >= 4
      ? `Best score: ${lesson.quizScore}/5. Lesson complete.`
      : `Best score: ${lesson.quizScore}/5. Score 4 or more to complete the lesson.`;
    document.getElementById("finalQuizScore").textContent =
      `${lesson.quizScore}/5`;
  }
}

document.addEventListener("DOMContentLoaded", restoreProgress);
window.addEventListener("latinprofilechanged", restoreProgress);
