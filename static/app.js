function lessonState(profile) {
  const introduction = profile.progress.lessons.introduction || {};
  const pronunciation = profile.progress.lessons.pronunciation || {};

  const introductionComplete =
    Boolean(introduction.completed) ||
    Boolean(pronunciation.completed) ||
    Number(pronunciation.quizScore || 0) >= 7 ||
    Number(pronunciation.progress || 0) >= 100;

  const pronunciationComplete =
    Boolean(pronunciation.completed) ||
    Number(pronunciation.quizScore || 0) >= 7 ||
    Number(pronunciation.progress || 0) >= 100;

  if (!introductionComplete) {
    return {
      href: "pages/introduction.html",
      cta: "Start Foundations",
      label: "Start with: Welcome to Latin",
      completedLessons: 0
    };
  }

  if (!pronunciationComplete) {
    const inProgress = Number(pronunciation.progress || 0) > 0;
    return {
      href: "pages/foundations.html",
      cta: inProgress ? "Continue pronunciation" : "Begin pronunciation",
      label: inProgress
        ? "Continue: Pronunciation Foundations"
        : "Next: Pronunciation Foundations",
      completedLessons: 1
    };
  }

  return {
    href: "pages/profiles.html",
    cta: "Review Foundations",
    label: "Foundations complete — view progress",
    completedLessons: 2
  };
}

function setJourneyStep(element, state, statusText) {
  if (!element) return;
  element.classList.remove("current", "complete", "locked");
  element.classList.add(state);

  const status = element.querySelector(".journey-status");
  if (status) status.textContent = statusText;
}


function renderBookOneAccess(profile) {
  const pronunciation = profile.progress.lessons.pronunciation || {};
  const foundationsComplete =
    Boolean(pronunciation.completed) ||
    Number(pronunciation.quizScore || 0) >= 7 ||
    Number(pronunciation.progress || 0) >= 100;
  const book1 = profile.progress.book1 || {};
  const chapter1 = book1.chapter1 || {};
  const lesson1 = chapter1.lessons?.lesson1 || {};
  const lesson2 = chapter1.lessons?.lesson2 || {};

  const card = document.getElementById("book1CourseCard");
  const status = document.getElementById("book1Status");
  const action = document.getElementById("book1CourseAction");
  if (!card || !status || !action) return;

  action.href = "pages/book1/chapter1.html";

  if (!foundationsComplete) {
    status.textContent = "Complete Foundations first";
    status.className = "status locked";
    action.textContent = "Locked";
    action.classList.add("disabled");
    action.setAttribute("aria-disabled", "true");
    action.style.pointerEvents = "none";
    return;
  }

  action.classList.remove("disabled");
  action.removeAttribute("aria-disabled");
  action.style.pointerEvents = "auto";

  if (lesson2.completed) {
    status.textContent = "Lessons 1–2 complete";
    status.className = "status available";
    action.textContent = "Review Chapter 1 →";
  } else if (lesson2.started) {
    status.textContent = "Lesson 2 in progress";
    status.className = "status available";
    action.textContent = "Continue Lesson 2 →";
  } else if (lesson1.completed) {
    status.textContent = "Lesson 2 unlocked";
    status.className = "status available";
    action.textContent = "Start Lesson 2 →";
  } else if (lesson1.started) {
    status.textContent = "Lesson 1 in progress";
    status.className = "status available";
    action.textContent = "Continue Chapter 1 →";
  } else {
    status.textContent = "Available now";
    status.className = "status available";
    action.textContent = "Start Book I →";
  }
}

function renderHomeProfile() {
  const profile = LatinProfiles.getActiveProfile();
  const introduction = profile.progress.lessons.introduction || {};
  const pronunciation = profile.progress.lessons.pronunciation || {};
  const overall = LatinProfiles.overallProgress(profile);
  const state = lessonState(profile);

  document.getElementById("homeXp").textContent = profile.progress.xp || 0;
  document.getElementById("homeStreak").textContent = profile.progress.streak || 0;
  document.getElementById("homeProgress").textContent = `${overall}%`;

  const learnerStatus = document.getElementById("homeLearnerStatus");
  if (learnerStatus) {
    learnerStatus.textContent =
      pronunciation.quizScore == null
        ? "Ready to learn"
        : `Pronunciation quiz: ${pronunciation.quizScore}/${pronunciation.quizTotal || 9}`;
  }

  const primaryCta = document.getElementById("primaryLearningCta");
  if (primaryCta) {
    primaryCta.href = state.href;
    primaryCta.textContent = state.cta;
  }

  const currentLessonLink = document.getElementById("currentLessonLink");
  if (currentLessonLink) currentLessonLink.href = state.href;

  const currentLessonLabel = document.getElementById("currentLessonLabel");
  if (currentLessonLabel) currentLessonLabel.textContent = state.label;

  const track = document.querySelector(".hero-card .progress-track span");
  if (track) track.style.width = `${overall}%`;

  const lessonCount = document.getElementById("homeLessonCount");
  if (lessonCount) {
    lessonCount.textContent = `${state.completedLessons} of 2 core lessons`;
  }

  const coursePercent = document.getElementById("homeCoursePercent");
  if (coursePercent) coursePercent.textContent = `${overall}%`;

  const introductionStep = document.getElementById("journeyIntroduction");
  const pronunciationStep = document.getElementById("journeyPronunciation");
  const completeStep = document.getElementById("journeyComplete");

  const introductionComplete =
    Boolean(introduction.completed) ||
    Boolean(pronunciation.completed) ||
    Number(pronunciation.quizScore || 0) >= 7 ||
    Number(pronunciation.progress || 0) >= 100;

  const pronunciationComplete =
    Boolean(pronunciation.completed) ||
    Number(pronunciation.quizScore || 0) >= 7 ||
    Number(pronunciation.progress || 0) >= 100;

  if (!introductionComplete) {
    setJourneyStep(
      introductionStep,
      "current",
      introduction.progress > 0 ? "In progress" : "Start here"
    );
    setJourneyStep(pronunciationStep, "locked", "Complete lesson 1 first");
    setJourneyStep(completeStep, "locked", "Locked");
  } else if (!pronunciationComplete) {
    setJourneyStep(introductionStep, "complete", "Completed");
    setJourneyStep(
      pronunciationStep,
      "current",
      pronunciation.progress > 0 ? "In progress" : "Ready"
    );
    setJourneyStep(completeStep, "locked", "Complete lesson 2 first");
  } else {
    setJourneyStep(introductionStep, "complete", "Completed");
    setJourneyStep(pronunciationStep, "complete", "Completed");
    setJourneyStep(completeStep, "complete", "Course complete");
  }

  renderBookOneAccess(profile);

  const pronunciationLink = pronunciationStep?.querySelector("a");
  if (pronunciationLink) {
    pronunciationLink.style.pointerEvents = introductionComplete ? "auto" : "none";
    pronunciationLink.setAttribute(
      "aria-disabled",
      String(!introductionComplete)
    );
  }
}

document.addEventListener("DOMContentLoaded", renderHomeProfile);
window.addEventListener("latinprofilechanged", renderHomeProfile);
window.addEventListener("latinprofileschanged", renderHomeProfile);
