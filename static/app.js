function lessonState(profile) {
  const introduction = profile.progress.lessons.introduction || {};
  const pronunciation = profile.progress.lessons.pronunciation || {};

  if (!introduction.completed) {
    return {
      href: "pages/introduction.html",
      cta: "Start Foundations",
      label: "Start with: Welcome to Latin",
      completedLessons: 0
    };
  }

  if (!pronunciation.completed) {
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

  if (!introduction.completed) {
    setJourneyStep(
      introductionStep,
      "current",
      introduction.progress > 0 ? "In progress" : "Start here"
    );
    setJourneyStep(pronunciationStep, "locked", "Complete lesson 1 first");
    setJourneyStep(completeStep, "locked", "Locked");
  } else if (!pronunciation.completed) {
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

  const pronunciationLink = pronunciationStep?.querySelector("a");
  if (pronunciationLink) {
    pronunciationLink.style.pointerEvents = introduction.completed ? "auto" : "none";
    pronunciationLink.setAttribute(
      "aria-disabled",
      String(!introduction.completed)
    );
  }
}

document.addEventListener("DOMContentLoaded", renderHomeProfile);
window.addEventListener("latinprofilechanged", renderHomeProfile);
window.addEventListener("latinprofileschanged", renderHomeProfile);
