function ensureBookOneProgress(profile) {
  profile.progress.book1 = profile.progress.book1 || {
    unlocked:
      Boolean(profile.progress.lessons.pronunciation?.completed) ||
      Number(profile.progress.lessons.pronunciation?.quizScore || 0) >= 7 ||
      Number(profile.progress.lessons.pronunciation?.progress || 0) >= 100,
    chapter1: {
      started: false,
      completed: false,
      progress: 0,
      lessons: {
        lesson1: {
          started: false,
          completed: false,
          progress: 0,
          quizScore: null,
          quizTotal: 5,
          completedAt: null
        }
      }
    }
  };
  return profile.progress.book1;
}

function renderChapter() {
  const profile = LatinProfiles.getActiveProfile();
  const book1 = ensureBookOneProgress(profile);
  const lesson = book1.chapter1.lessons.lesson1;
  const lessonCard = document.getElementById("chapterLesson1");
  const status = lessonCard.querySelector(".lesson-status");
  const action = lessonCard.querySelector("a");
  const startButton = document.getElementById("chapterStartButton");

  if (lesson.completed) {
    lessonCard.classList.add("complete");
    status.textContent = "Completed";
    action.textContent = "Review lesson";
    startButton.textContent = "Review Lesson 1";
    document.getElementById("chapterProgressLabel").textContent =
      "1 of 1 available lessons completed";
  } else if (lesson.started) {
    status.textContent = "In progress";
    action.textContent = "Continue lesson";
    startButton.textContent = "Continue Lesson 1";
    document.getElementById("chapterProgressLabel").textContent =
      "Lesson 1 in progress";
  }
}

document.addEventListener("DOMContentLoaded", renderChapter);
window.addEventListener("latinprofilechanged", renderChapter);
