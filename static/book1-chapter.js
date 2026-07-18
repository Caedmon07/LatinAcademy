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

  const completed = [lesson1.completed, lesson2.completed].filter(Boolean).length;
  document.getElementById("chapterProgressLabel").textContent =
    `${completed} of 2 available lessons completed`;

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
  } else {
    startButton.href = "lesson-2.html";
    startButton.textContent = "Review Lesson 2";
  }
}

document.addEventListener("DOMContentLoaded", renderChapter);
window.addEventListener("latinprofilechanged", renderChapter);
window.addEventListener("latinprofileschanged", renderChapter);
