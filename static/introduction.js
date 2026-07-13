const button = document.getElementById("collectExpression");
const completeButton = document.getElementById("completeIntroduction");

function refreshIntroduction() {
  const profile = LatinProfiles.getActiveProfile();
  const collected = profile.progress.collectibles.includes("sine-qua-non");
  const completed = profile.progress.lessons.introduction?.completed;

  if (collected) {
    button.textContent = "✓ Collected";
    button.classList.add("collected");
  } else {
    button.textContent = "Collect expression";
    button.classList.remove("collected");
  }

  if (completed) {
    completeButton.textContent = "✓ Completed — continue to pronunciation";
  } else {
    completeButton.textContent = "Complete lesson and continue";
  }
}

button.addEventListener("click", () => {
  LatinProfiles.addCollectible("sine-qua-non");
  refreshIntroduction();
});

completeButton.addEventListener("click", () => {
  const profile = LatinProfiles.getActiveProfile();
  const alreadyCompleted = profile.progress.lessons.introduction?.completed;

  LatinProfiles.setLessonProgress("introduction", {
    completed: true,
    progress: 100,
    completedAt: profile.progress.lessons.introduction?.completedAt || new Date().toISOString()
  });

  if (!alreadyCompleted) LatinProfiles.addXp(40);

  LatinProfiles.updateActiveProgress((progress) => {
    LatinProfiles.awardAchievements(progress);
  });

  window.location.href = "foundations.html";
});

document.addEventListener("DOMContentLoaded", refreshIntroduction);
window.addEventListener("latinprofilechanged", refreshIntroduction);
