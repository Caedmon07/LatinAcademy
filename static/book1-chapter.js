function ensureBookOneProgress(profile) {
  profile.progress.book1 = profile.progress.book1 || {
    unlocked: Boolean(profile.progress.lessons.pronunciation?.completed),
    chapter1: { started: false, completed: false, progress: 0, lessons: {} }
  };

  profile.progress.book1.chapter1 = profile.progress.book1.chapter1 || {
    started: false, completed: false, progress: 0, lessons: {}
  };
  profile.progress.book1.chapter1.lessons =
    profile.progress.book1.chapter1.lessons || {};

  profile.progress.book1.chapter1.lessons.lesson1 =
    profile.progress.book1.chapter1.lessons.lesson1 || {
      started: false, completed: false, progress: 0, screen: 0,
      quizScore: null, quizTotal: 5, completedAt: null
    };

  profile.progress.book1.chapter1.lessons.lesson2 =
    profile.progress.book1.chapter1.lessons.lesson2 || {
      started: false, completed: false, progress: 0, screen: 0,
      quizScore: null, quizTotal: 6, completedAt: null
    };
  profile.progress.book1.chapter1.lessons.lesson3 =
    profile.progress.book1.chapter1.lessons.lesson3 || {
      started: false, completed: false, progress: 0, screen: 0,
      quizScore: null, quizTotal: 7, completedAt: null
    };
  profile.progress.book1.chapter1.lessons.lesson4 =
    profile.progress.book1.chapter1.lessons.lesson4 || {
      started: false, completed: false, progress: 0, screen: 0,
      quizScore: null, quizTotal: 7, completedAt: null
    };
  profile.progress.book1.chapter1.lessons.lesson5 =
    profile.progress.book1.chapter1.lessons.lesson5 || {
      started: false, completed: false, progress: 0, screen: 0,
      quizScore: null, quizTotal: 7, completedAt: null
    };

  return profile.progress.book1;
}

function renderLessonCard(card, lesson, available, labels) {
  const status = card.querySelector(".lesson-status");
  const action = card.querySelector("a");

  card.classList.remove("complete", "locked", "available");
  action.style.pointerEvents = "auto";
  action.removeAttribute("aria-disabled");

  if (lesson.completed) {
    card.classList.add("complete");
    status.textContent = "Completed";
    action.textContent = "Review lesson";
    return;
  }

  if (!available) {
    card.classList.add("locked");
    status.textContent = labels.locked;
    action.textContent = "Locked";
    action.style.pointerEvents = "none";
    action.setAttribute("aria-disabled", "true");
    return;
  }

  card.classList.add("available");
  status.textContent = lesson.started ? "In progress" : labels.available;
  action.textContent = lesson.started ? "Continue lesson" : "Open lesson";
}

function renderChapter() {
  const profile = LatinProfiles.getActiveProfile();
  const book1 = ensureBookOneProgress(profile);
  const lesson1 = book1.chapter1.lessons.lesson1;
  const lesson2 = book1.chapter1.lessons.lesson2;
  const lesson3 = book1.chapter1.lessons.lesson3;
  const lesson4 = book1.chapter1.lessons.lesson4;
  const lesson5 = book1.chapter1.lessons.lesson5;

  renderLessonCard(
    document.getElementById("chapterLesson1"),
    lesson1,
    true,
    { available: "Available", locked: "" }
  );

  renderLessonCard(
    document.getElementById("chapterLesson2"),
    lesson2,
    Boolean(lesson1.completed),
    {
      available: "Unlocked",
      locked: "Complete Lesson 1 first"
    }
  );

  renderLessonCard(
    document.getElementById("chapterLesson3"),
    lesson3,
    Boolean(lesson2.completed),
    { available: "Unlocked", locked: "Complete Lesson 2 first" }
  );

  renderLessonCard(document.getElementById("chapterLesson4"),lesson4,Boolean(lesson3.completed),{available:"Unlocked",locked:"Complete Lesson 3 first"});
  renderLessonCard(document.getElementById("chapterLesson5"),lesson5,Boolean(lesson4.completed),{available:"Unlocked",locked:"Complete Lesson 4 first"});
  const completed = [lesson1.completed, lesson2.completed, lesson3.completed, lesson4.completed, lesson5.completed].filter(Boolean).length;
  document.getElementById("chapterProgressLabel").textContent =
    `${completed} of 5 available lessons completed`;

  const startButton = document.getElementById("chapterStartButton");
  if (!lesson1.completed) {
    startButton.href = "lesson-1.html";
    startButton.textContent = lesson1.started
      ? "Continue Lesson 1"
      : "Start Lesson 1";
  } else if (!lesson2.completed) {
    startButton.href = "lesson-2.html";
    startButton.textContent = lesson2.started
      ? "Continue Lesson 2"
      : "Start Lesson 2";
  } else if (!lesson3.completed) {
    startButton.href = "lesson-3.html";
    startButton.textContent = lesson3.started ? "Continue Lesson 3" : "Start Lesson 3";
  } else if (!lesson4.completed) {
    startButton.href = "lesson-4.html";
    startButton.textContent = lesson4.started ? "Continue Lesson 4" : "Start Lesson 4";
  } else if (!lesson5.completed) {
    startButton.href = "lesson-5.html";
    startButton.textContent = lesson5.started ? "Continue Lesson 5" : "Start Lesson 5";
  } else {
    startButton.href = "lesson-5.html";
    startButton.textContent = "Review Lesson 5";
  }
}

document.addEventListener("DOMContentLoaded", renderChapter);
window.addEventListener("latinprofilechanged", renderChapter);
window.addEventListener("latinprofileschanged", renderChapter);
