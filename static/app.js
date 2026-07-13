document.querySelectorAll('.activity-grid button').forEach((button) => {
  button.addEventListener('click', () => {
    alert('This activity will be connected in a later build.');
  });
});

function renderHomeProfile() {
  const profile = LatinProfiles.getActiveProfile();
  const overall = LatinProfiles.overallProgress(profile);
  const pronunciation = profile.progress.lessons.pronunciation || {};

  document.getElementById("homeXp").textContent = profile.progress.xp || 0;
  document.getElementById("homeStreak").textContent = profile.progress.streak || 0;
  document.getElementById("homeProgress").textContent = `${overall}%`;
  document.getElementById("homeLearnerStatus").textContent =
    pronunciation.quizScore === null || pronunciation.quizScore === undefined
      ? "Ready to learn"
      : `Pronunciation quiz: ${pronunciation.quizScore}/${pronunciation.quizTotal || 9}`;

  const track = document.querySelector(".hero-card .progress-track span");
  const labels = document.querySelectorAll(".hero-card .progress-label span");
  if (track) track.style.width = `${overall}%`;
  if (labels[0]) labels[0].textContent = overall === 100 ? "Foundations completed" : "Foundations in progress";
  if (labels[1]) labels[1].textContent = `${overall}%`;
}

document.addEventListener("DOMContentLoaded", renderHomeProfile);
window.addEventListener("latinprofilechanged", renderHomeProfile);
window.addEventListener("latinprofileschanged", renderHomeProfile);
