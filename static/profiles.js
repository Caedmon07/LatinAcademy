const LatinProfiles = (() => {
  const STORAGE_KEY = "latinAcademy.profiles";
  const ACTIVE_KEY = "latinAcademy.activeProfileId";
  const VERSION_KEY = "latinAcademy.profileDataVersion";
  const VERSION = "5";

  const avatarOptions = ["🦁", "🦅", "🐺", "🐬", "🦉", "🐴", "🏛️", "⚔️"];
  const colourOptions = ["#9e2d2b", "#315d43", "#3c5f8a", "#83558f", "#a7672d", "#2d7072"];

  function uid() {
    return `learner-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function createDefaultProgress() {
    return {
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      lessons: {
        introduction: {
          completed: false,
          progress: 0,
          completedAt: null
        },
        pronunciation: {
          completed: false,
          progress: 0,
          quizScore: null,
          quizTotal: 9,
          completedAt: null,
          sectionsVisited: []
        }
      },
      book1: {
        unlocked: false,
        chapter1: {
          started: false,
          completed: false,
          progress: 0,
          lessons: {
            lesson1: {
              started: false,
              completed: false,
              progress: 0,
              screen: 0,
              quizScore: null,
              quizTotal: 5,
              completedAt: null
            },
            lesson2: {
              started: false,
              completed: false,
              progress: 0,
              screen: 0,
              quizScore: null,
              quizTotal: 6,
              completedAt: null
            }
          }
        }
      },
      collectibles: [],
      achievements: []
    };
  }

  function defaultProfile() {
    return {
      id: uid(),
      name: "Daniel",
      avatar: "🦁",
      colour: "#9e2d2b",
      createdAt: new Date().toISOString(),
      progress: createDefaultProgress()
    };
  }

  function loadProfiles() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveProfiles(profiles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    window.dispatchEvent(new CustomEvent("latinprofileschanged"));
  }

  function migrateLegacyData(profile) {
    if (localStorage.getItem(VERSION_KEY) === VERSION) return profile;

    const legacyQuiz = Number(localStorage.getItem("latinAcademy.foundations.quizScore"));
    const legacyVisited = Number(localStorage.getItem("latinAcademy.foundations.visited"));
    const legacyCollected =
      localStorage.getItem("latinAcademy.collectible.sineQuaNon") === "collected";

    if (Number.isFinite(legacyQuiz) && legacyQuiz > 0) {
      profile.progress.lessons.pronunciation.quizScore = legacyQuiz;
      if (legacyQuiz >= 7) {
        profile.progress.lessons.pronunciation.completed = true;
        profile.progress.lessons.pronunciation.progress = 100;
        profile.progress.lessons.pronunciation.completedAt = new Date().toISOString();
      }
    }

    if (Number.isFinite(legacyVisited) && legacyVisited > 0) {
      profile.progress.lessons.pronunciation.progress =
        Math.max(profile.progress.lessons.pronunciation.progress, Math.min(80, legacyVisited * 10));
    }

    if (legacyCollected && !profile.progress.collectibles.includes("sine-qua-non")) {
      profile.progress.collectibles.push("sine-qua-non");
    }

    localStorage.setItem(VERSION_KEY, VERSION);
    return profile;
  }


  function normaliseProfile(profile) {
    profile.progress = profile.progress || createDefaultProgress();
    profile.progress.lessons = profile.progress.lessons || {};
    profile.progress.lessons.introduction = {
      completed: false,
      progress: 0,
      completedAt: null,
      ...(profile.progress.lessons.introduction || {})
    };
    profile.progress.lessons.pronunciation = {
      completed: false,
      progress: 0,
      quizScore: null,
      quizTotal: 9,
      completedAt: null,
      sectionsVisited: [],
      ...(profile.progress.lessons.pronunciation || {})
    };

    const pronunciationPassed =
      Boolean(profile.progress.lessons.pronunciation.completed) ||
      Number(profile.progress.lessons.pronunciation.quizScore || 0) >= 7 ||
      Number(profile.progress.lessons.pronunciation.progress || 0) >= 100;

    if (pronunciationPassed) {
      profile.progress.lessons.pronunciation.completed = true;
      profile.progress.lessons.pronunciation.progress = 100;

      // A learner cannot legitimately have completed pronunciation without
      // completing the Introduction prerequisite. Older builds could produce
      // this inconsistent state, so repair it during profile normalisation.
      profile.progress.lessons.introduction.completed = true;
      profile.progress.lessons.introduction.progress = 100;
      profile.progress.lessons.introduction.completedAt =
        profile.progress.lessons.introduction.completedAt ||
        profile.progress.lessons.pronunciation.completedAt ||
        new Date().toISOString();
    }

    profile.progress.book1 = profile.progress.book1 || {};
    profile.progress.book1.unlocked =
      pronunciationPassed ||
      Boolean(profile.progress.book1.unlocked);

    profile.progress.book1.chapter1 = {
      started: false,
      completed: false,
      progress: 0,
      lessons: {},
      ...(profile.progress.book1.chapter1 || {})
    };

    profile.progress.book1.chapter1.lessons =
      profile.progress.book1.chapter1.lessons || {};

    profile.progress.book1.chapter1.lessons.lesson1 = {
      started: false,
      completed: false,
      progress: 0,
      screen: 0,
      quizScore: null,
      quizTotal: 5,
      completedAt: null,
      ...(profile.progress.book1.chapter1.lessons.lesson1 || {})
    };

    profile.progress.book1.chapter1.lessons.lesson2 = {
      started: false,
      completed: false,
      progress: 0,
      screen: 0,
      quizScore: null,
      quizTotal: 6,
      completedAt: null,
      ...(profile.progress.book1.chapter1.lessons.lesson2 || {})
    };

    profile.progress.collectibles = Array.isArray(profile.progress.collectibles)
      ? profile.progress.collectibles
      : [];
    profile.progress.achievements = Array.isArray(profile.progress.achievements)
      ? profile.progress.achievements
      : [];

    return profile;
  }


  function achievementId(item) {
    return typeof item === "string" ? item : item?.id;
  }

  function mergeLessonProgress(target, source) {
    if (!source) return target;

    const merged = { ...target };
    merged.completed = Boolean(target?.completed || source.completed);
    merged.progress = Math.max(
      Number(target?.progress || 0),
      Number(source.progress || 0)
    );

    if (source.quizScore !== null && source.quizScore !== undefined) {
      merged.quizScore = Math.max(
        Number(target?.quizScore || 0),
        Number(source.quizScore || 0)
      );
    }

    merged.quizTotal = Math.max(
      Number(target?.quizTotal || 0),
      Number(source.quizTotal || 0)
    ) || target?.quizTotal || source.quizTotal;

    merged.completedAt =
      target?.completedAt || source.completedAt || null;

    const visited = new Set([
      ...(Array.isArray(target?.sectionsVisited) ? target.sectionsVisited : []),
      ...(Array.isArray(source.sectionsVisited) ? source.sectionsVisited : [])
    ]);
    if (visited.size) merged.sectionsVisited = [...visited];

    return merged;
  }

  function mergeProgress(target, source) {
    if (!source) return target;

    target.xp = Math.max(Number(target.xp || 0), Number(source.xp || 0));
    target.streak = Math.max(
      Number(target.streak || 0),
      Number(source.streak || 0)
    );
    target.lastActiveDate =
      target.lastActiveDate || source.lastActiveDate || null;

    target.lessons.introduction = mergeLessonProgress(
      target.lessons.introduction,
      source.lessons?.introduction
    );
    target.lessons.pronunciation = mergeLessonProgress(
      target.lessons.pronunciation,
      source.lessons?.pronunciation
    );

    const targetBookLesson =
      target.book1.chapter1.lessons.lesson1;
    const sourceBookLesson =
      source.book1?.chapter1?.lessons?.lesson1;

    target.book1.chapter1.lessons.lesson1 =
      mergeLessonProgress(targetBookLesson, sourceBookLesson);

    const targetBookLesson2 =
      target.book1.chapter1.lessons.lesson2;
    const sourceBookLesson2 =
      source.book1?.chapter1?.lessons?.lesson2;

    target.book1.chapter1.lessons.lesson2 =
      mergeLessonProgress(targetBookLesson2, sourceBookLesson2);
    target.book1.chapter1.lessons.lesson2.started = Boolean(
      targetBookLesson2.started || sourceBookLesson2?.started
    );
    target.book1.chapter1.lessons.lesson2.screen = Math.max(
      Number(targetBookLesson2.screen || 0),
      Number(sourceBookLesson2?.screen || 0)
    );

    target.book1.chapter1.lessons.lesson1.started = Boolean(
      targetBookLesson.started || sourceBookLesson?.started
    );
    target.book1.chapter1.lessons.lesson1.screen = Math.max(
      Number(targetBookLesson.screen || 0),
      Number(sourceBookLesson?.screen || 0)
    );

    target.book1.unlocked = Boolean(
      target.book1.unlocked || source.book1?.unlocked
    );
    target.book1.chapter1.started = Boolean(
      target.book1.chapter1.started || source.book1?.chapter1?.started
    );
    target.book1.chapter1.completed = Boolean(
      target.book1.chapter1.completed || source.book1?.chapter1?.completed
    );
    target.book1.chapter1.progress = Math.max(
      Number(target.book1.chapter1.progress || 0),
      Number(source.book1?.chapter1?.progress || 0)
    );

    target.collectibles = [...new Set([
      ...(target.collectibles || []),
      ...(source.collectibles || [])
    ])];

    const achievements = new Map();
    [...(target.achievements || []), ...(source.achievements || [])]
      .forEach((item) => {
        const id = achievementId(item);
        if (id && !achievements.has(id)) achievements.set(id, item);
      });
    target.achievements = [...achievements.values()];

    return target;
  }

  function applyLegacyProgress(profile) {
    const legacyQuiz = Number(
      localStorage.getItem("latinAcademy.foundations.quizScore")
    );
    const legacyVisited = Number(
      localStorage.getItem("latinAcademy.foundations.visited")
    );
    const legacyCollected =
      localStorage.getItem("latinAcademy.collectible.sineQuaNon") ===
      "collected";

    if (Number.isFinite(legacyQuiz) && legacyQuiz > 0) {
      profile.progress.lessons.pronunciation.quizScore = Math.max(
        Number(profile.progress.lessons.pronunciation.quizScore || 0),
        legacyQuiz
      );
    }

    if (Number.isFinite(legacyVisited) && legacyVisited > 0) {
      profile.progress.lessons.pronunciation.progress = Math.max(
        Number(profile.progress.lessons.pronunciation.progress || 0),
        Math.min(90, legacyVisited * 10)
      );
    }

    if (
      legacyCollected &&
      !profile.progress.collectibles.includes("sine-qua-non")
    ) {
      profile.progress.collectibles.push("sine-qua-non");
    }

    return normaliseProfile(profile);
  }

  function reconcileActiveProfile(profiles, activeId) {
    const active = profiles.find((profile) => profile.id === activeId);
    if (!active) return profiles;

    // Older releases occasionally created a second profile with the same
    // learner name. Merge only same-name records, preserving separation
    // between different children.
    profiles
      .filter((profile) =>
        profile.id !== active.id &&
        String(profile.name).trim().toLowerCase() ===
          String(active.name).trim().toLowerCase()
      )
      .forEach((profile) => mergeProgress(active.progress, profile.progress));

    applyLegacyProgress(active);
    normaliseProfile(active);
    return profiles;
  }

  function repairActiveProfile() {
    const profiles = initialise();
    const activeId = getActiveId();
    reconcileActiveProfile(profiles, activeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    window.dispatchEvent(new CustomEvent("latinprofileschanged"));
    return getActiveProfile();
  }

  function initialise() {
    let profiles = loadProfiles().map(normaliseProfile);

    if (profiles.length === 0) {
      profiles = [normaliseProfile(migrateLegacyData(defaultProfile()))];
    }

    let activeId = localStorage.getItem(ACTIVE_KEY);
    if (!profiles.some((profile) => profile.id === activeId)) {
      activeId = profiles[0].id;
      localStorage.setItem(ACTIVE_KEY, activeId);
    }

    reconcileActiveProfile(profiles, activeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    localStorage.setItem(VERSION_KEY, VERSION);

    return profiles;
  }

  function getProfiles() {
    return initialise();
  }

  function getActiveId() {
    initialise();
    return localStorage.getItem(ACTIVE_KEY);
  }

  function getActiveProfile() {
    const profiles = initialise();
    return profiles.find((profile) => profile.id === getActiveId()) || profiles[0];
  }

  function setActiveProfile(id) {
    const profiles = initialise();
    if (!profiles.some((profile) => profile.id === id)) {
      throw new Error("Learner profile not found.");
    }
    localStorage.setItem(ACTIVE_KEY, id);
    window.dispatchEvent(new CustomEvent("latinprofilechanged", { detail: { id } }));
    return getActiveProfile();
  }

  function addProfile({ name, avatar, colour }) {
    const trimmedName = String(name || "").trim();
    if (!trimmedName) throw new Error("Enter a learner name.");

    const profiles = initialise();
    if (profiles.some((profile) => profile.name.toLowerCase() === trimmedName.toLowerCase())) {
      throw new Error("A learner with that name already exists.");
    }

    const profile = {
      id: uid(),
      name: trimmedName.slice(0, 30),
      avatar: avatarOptions.includes(avatar) ? avatar : avatarOptions[0],
      colour: colourOptions.includes(colour) ? colour : colourOptions[0],
      createdAt: new Date().toISOString(),
      progress: createDefaultProgress()
    };

    profiles.push(profile);
    saveProfiles(profiles);
    setActiveProfile(profile.id);
    return profile;
  }

  function updateProfileDetails(id, updates) {
    const profiles = initialise();
    const profile = profiles.find((item) => item.id === id);
    if (!profile) throw new Error("Learner profile not found.");

    if (updates.name !== undefined) {
      const nextName = String(updates.name).trim();
      if (!nextName) throw new Error("Enter a learner name.");
      if (profiles.some((item) => item.id !== id && item.name.toLowerCase() === nextName.toLowerCase())) {
        throw new Error("A learner with that name already exists.");
      }
      profile.name = nextName.slice(0, 30);
    }

    if (avatarOptions.includes(updates.avatar)) profile.avatar = updates.avatar;
    if (colourOptions.includes(updates.colour)) profile.colour = updates.colour;

    saveProfiles(profiles);
    return profile;
  }

  function removeProfile(id) {
    let profiles = initialise();
    if (profiles.length <= 1) throw new Error("At least one learner profile must remain.");

    profiles = profiles.filter((profile) => profile.id !== id);
    saveProfiles(profiles);

    if (getActiveId() === id) {
      setActiveProfile(profiles[0].id);
    }

    return profiles;
  }

  function updateActiveProgress(mutator) {
    const profiles = initialise();
    const profile = profiles.find((item) => item.id === getActiveId());
    if (!profile) return null;

    mutator(profile.progress, profile);
    profile.progress.lastUpdatedAt = new Date().toISOString();
    saveProfiles(profiles);
    return profile;
  }

  function setLessonProgress(lessonId, updates) {
    return updateActiveProgress((progress) => {
      progress.lessons[lessonId] = {
        ...(progress.lessons[lessonId] || {}),
        ...updates
      };
    });
  }

  function addCollectible(id) {
    return updateActiveProgress((progress) => {
      if (!progress.collectibles.includes(id)) {
        progress.collectibles.push(id);
        progress.xp += 10;
      }
      awardAchievements(progress);
    });
  }

  function addXp(amount) {
    return updateActiveProgress((progress) => {
      progress.xp = Math.max(0, Number(progress.xp || 0) + Number(amount || 0));
      awardAchievements(progress);
    });
  }

  function awardAchievements(progress) {
    const achievementIds = new Set(progress.achievements.map((item) =>
      typeof item === "string" ? item : item.id
    ));

    function award(id, title, description, icon) {
      if (!achievementIds.has(id)) {
        progress.achievements.push({
          id, title, description, icon,
          earnedAt: new Date().toISOString()
        });
        achievementIds.add(id);
      }
    }

    if (progress.collectibles.includes("sine-qua-non")) {
      award("first-expression", "Expression Collector", "Collected a first Latin expression.", "📜");
    }

    if (progress.lessons.introduction?.completed) {
      award("roman-citizen-1", "Roman Citizen I", "Completed Welcome to Latin.", "🏛️");
    }

    if ((progress.lessons.pronunciation?.quizScore || 0) >= 7) {
      award("sound-scholar", "Sound Scholar", "Passed the pronunciation quiz.", "🔊");
    }

    if ((progress.lessons.pronunciation?.quizScore || 0) === 9) {
      award("perfect-pronunciation", "Perfect Pronunciation", "Scored 9 out of 9.", "🏆");
    }

    if ((progress.xp || 0) >= 100) {
      award("centurion-100", "Centurion", "Earned 100 XP.", "⚔️");
    }
  }

  function recordActivity() {
    return updateActiveProgress((progress) => {
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

      if (progress.lastActiveDate === today) return;
      progress.streak = progress.lastActiveDate === yesterday ? (progress.streak || 0) + 1 : 1;
      progress.lastActiveDate = today;
    });
  }

  function overallProgress(profile = getActiveProfile()) {
    const intro = Number(profile.progress.lessons.introduction?.progress || 0);
    const pronunciation = Number(profile.progress.lessons.pronunciation?.progress || 0);
    return Math.round((intro + pronunciation) / 2);
  }

  function initials(name) {
    return String(name || "?")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }

  function renderActiveProfileButtons() {
    const profile = getActiveProfile();
    document.querySelectorAll("[data-active-profile-name]").forEach((element) => {
      element.textContent = profile.name;
    });
    document.querySelectorAll("[data-active-profile-avatar]").forEach((element) => {
      element.textContent = profile.avatar || initials(profile.name);
      element.style.background = profile.colour;
    });
  }

  function attachProfileMenu() {
    renderActiveProfileButtons();

    document.querySelectorAll("[data-profile-menu-button]").forEach((button) => {
      button.addEventListener("click", () => {
        window.location.href = button.dataset.profileHref || "pages/profiles.html";
      });
    });
  }

  return {
    avatarOptions,
    colourOptions,
    getProfiles,
    getActiveProfile,
    getActiveId,
    setActiveProfile,
    addProfile,
    updateProfileDetails,
    removeProfile,
    updateActiveProgress,
    setLessonProgress,
    addCollectible,
    addXp,
    awardAchievements,
    recordActivity,
    overallProgress,
    repairActiveProfile,
    initials,
    renderActiveProfileButtons,
    attachProfileMenu
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  LatinProfiles.attachProfileMenu();
  LatinProfiles.recordActivity();
});
