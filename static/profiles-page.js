const profileGrid = document.getElementById("profileGrid");
const dialog = document.getElementById("profileDialog");
const form = document.getElementById("profileForm");
const nameInput = document.getElementById("profileName");
const errorBox = document.getElementById("profileError");

function selectedValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value;
}

function buildChoices() {
  document.getElementById("avatarChoices").innerHTML =
    LatinProfiles.avatarOptions.map((avatar, index) => `
      <label>
        <input type="radio" name="avatar" value="${avatar}" ${index === 0 ? "checked" : ""}>
        <span class="avatar-choice">${avatar}</span>
      </label>
    `).join("");

  document.getElementById("colourChoices").innerHTML =
    LatinProfiles.colourOptions.map((colour, index) => `
      <label>
        <input type="radio" name="colour" value="${colour}" ${index === 0 ? "checked" : ""}>
        <span class="colour-choice" style="background:${colour}"></span>
      </label>
    `).join("");
}

function achievementMarkup(achievement) {
  if (typeof achievement === "string") {
    return `<div class="achievement"><span class="achievement-icon">🏅</span><div><strong>${achievement}</strong></div></div>`;
  }

  return `
    <div class="achievement">
      <span class="achievement-icon">${achievement.icon || "🏅"}</span>
      <div>
        <strong>${achievement.title}</strong>
        <span>${achievement.description}</span>
      </div>
    </div>
  `;
}

function renderDashboard() {
  const profile = LatinProfiles.getActiveProfile();
  const progress = profile.progress;

  document.getElementById("dashboardName").textContent = profile.name;
  document.getElementById("dashboardXp").textContent = progress.xp || 0;
  document.getElementById("dashboardStreak").textContent = progress.streak || 0;
  document.getElementById("dashboardProgress").textContent = `${LatinProfiles.overallProgress(profile)}%`;
  document.getElementById("dashboardAchievements").textContent = progress.achievements.length;

  const intro = progress.lessons.introduction || {};
  const pronunciation = progress.lessons.pronunciation || {};
  const book1Lesson1 = progress.book1?.chapter1?.lessons?.lesson1 || {
    progress: 0,
    completed: false,
    quizScore: null,
    quizTotal: 5
  };

  document.getElementById("lessonProgress").innerHTML = `
    <article class="lesson-progress-card">
      <header><strong>Welcome to Latin</strong><span>${intro.progress || 0}%</span></header>
      <p>${intro.completed ? "Completed" : "Introduction lesson"}</p>
      <div class="profile-progress-track"><span style="width:${intro.progress || 0}%"></span></div>
    </article>
    <article class="lesson-progress-card">
      <header><strong>Pronunciation Foundations</strong><span>${pronunciation.progress || 0}%</span></header>
      <p>Quiz score: ${pronunciation.quizScore === null || pronunciation.quizScore === undefined ? "Not attempted" : `${pronunciation.quizScore}/${pronunciation.quizTotal || 9}`}</p>
      <div class="profile-progress-track"><span style="width:${pronunciation.progress || 0}%"></span></div>
    </article>
    <article class="lesson-progress-card">
      <header><strong>Book I · Lesson 1</strong><span>${book1Lesson1.progress || 0}%</span></header>
      <p>${book1Lesson1.completed
        ? `Completed · Quiz ${book1Lesson1.quizScore}/${book1Lesson1.quizTotal || 5}`
        : book1Lesson1.started
          ? "What is a Verb? · In progress"
          : "What is a Verb? · Not started"}</p>
      <div class="profile-progress-track"><span style="width:${book1Lesson1.progress || 0}%"></span></div>
    </article>
  `;

  const achievementList = document.getElementById("achievementList");
  achievementList.innerHTML = progress.achievements.length
    ? progress.achievements.map(achievementMarkup).join("")
    : `<p class="empty-state">Achievements will appear here as this learner completes lessons and challenges.</p>`;
}

function renderProfiles() {
  const profiles = LatinProfiles.getProfiles();
  const activeId = LatinProfiles.getActiveId();

  profileGrid.innerHTML = profiles.map((profile) => `
    <article class="profile-card ${profile.id === activeId ? "active" : ""}"
             style="--profile-colour:${profile.colour}">
      ${profile.id === activeId ? '<span class="active-marker">ACTIVE</span>' : ""}
      <button class="profile-select" type="button" data-select-profile="${profile.id}">
        <span class="profile-avatar">${profile.avatar}</span>
        <h2>${profile.name}</h2>
        <p>${profile.progress.achievements.length} achievement${profile.progress.achievements.length === 1 ? "" : "s"}</p>
        <span class="profile-mini-stats">
          <span><strong>${profile.progress.xp || 0}</strong>XP</span>
          <span><strong>${LatinProfiles.overallProgress(profile)}%</strong>Progress</span>
        </span>
      </button>
      <div class="profile-actions">
        <button type="button" data-rename-profile="${profile.id}">Rename</button>
        ${profiles.length > 1 ? `<button type="button" data-delete-profile="${profile.id}">Delete</button>` : ""}
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-select-profile]").forEach((button) => {
    button.addEventListener("click", () => {
      LatinProfiles.setActiveProfile(button.dataset.selectProfile);
      renderProfiles();
      renderDashboard();
    });
  });

  document.querySelectorAll("[data-rename-profile]").forEach((button) => {
    button.addEventListener("click", () => {
      const profile = LatinProfiles.getProfiles().find((item) => item.id === button.dataset.renameProfile);
      const name = prompt("Enter the learner's new name:", profile.name);
      if (name === null) return;
      try {
        LatinProfiles.updateProfileDetails(profile.id, { name });
        renderProfiles();
        renderDashboard();
      } catch (error) {
        alert(error.message);
      }
    });
  });

  document.querySelectorAll("[data-delete-profile]").forEach((button) => {
    button.addEventListener("click", () => {
      const profile = LatinProfiles.getProfiles().find((item) => item.id === button.dataset.deleteProfile);
      if (!confirm(`Delete ${profile.name}'s profile and progress from this browser?`)) return;
      try {
        LatinProfiles.removeProfile(profile.id);
        renderProfiles();
        renderDashboard();
      } catch (error) {
        alert(error.message);
      }
    });
  });
}

document.getElementById("openCreateProfile").addEventListener("click", () => {
  form.reset();
  buildChoices();
  errorBox.hidden = true;
  dialog.showModal();
  setTimeout(() => nameInput.focus(), 50);
});

document.getElementById("cancelProfile").addEventListener("click", () => dialog.close());

form.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    LatinProfiles.addProfile({
      name: nameInput.value,
      avatar: selectedValue("avatar"),
      colour: selectedValue("colour")
    });
    dialog.close();
    renderProfiles();
    renderDashboard();
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.hidden = false;
  }
});

document.getElementById("continueLearning").addEventListener("click", () => {
  const profile = LatinProfiles.getActiveProfile();
  const intro = profile.progress.lessons.introduction || {};
  const pronunciation = profile.progress.lessons.pronunciation || {};
  if (!intro.completed) window.location.href = "introduction.html";
  else if (!pronunciation.completed) window.location.href = "foundations.html";
  else window.location.href = "../index.html#journey";
});

buildChoices();
renderProfiles();
renderDashboard();


document.getElementById("repairProgress")?.addEventListener("click", () => {
  LatinProfiles.repairActiveProfile();
  renderProfiles();
  renderDashboard();
  alert("Progress has been recovered and synchronised for the active learner.");
});
