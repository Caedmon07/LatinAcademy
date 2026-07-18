const LatinLessonCommon = (() => {
  function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function createAudioController(basePath) {
    const audio = new Audio();

    function source(filename) {
      return `${basePath.replace(/\/$/, "")}/${filename}`;
    }

    function play(filename) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = source(filename);
      return audio.play().catch(() => {});
    }

    function playAndWait(filename) {
      return new Promise((resolve) => {
        audio.pause();
        audio.currentTime = 0;
        audio.src = source(filename);

        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          audio.removeEventListener("ended", finish);
          audio.removeEventListener("error", finish);
          resolve();
        };

        audio.addEventListener("ended", finish);
        audio.addEventListener("error", finish);
        audio.play().catch(finish);
      });
    }

    async function playSequence(filenames, delayMs = 120) {
      for (const filename of filenames) {
        await playAndWait(filename);
        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    return { audio, play, playAndWait, playSequence };
  }

  function markChoice(button, correct) {
    button.classList.add(correct ? "correct" : "incorrect");
  }

  function clearChoiceStates(container) {
    container.querySelectorAll("button").forEach((button) => {
      button.classList.remove("correct", "incorrect");
    });
  }

  function renderButtons(container, options, attributes = {}) {
    container.innerHTML = options.map((option) => {
      const value = typeof option === "string" ? option : option.value;
      const label = typeof option === "string" ? option : option.label;
      const attributeText = Object.entries(attributes)
        .map(([name, prefix]) => `${name}="${prefix}${value}"`)
        .join(" ");
      return `<button type="button" ${attributeText}>${label}</button>`;
    }).join("");
  }

  function renderRadioQuiz(form, items) {
    form.innerHTML = items.map((item, index) => `
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

  function scoreRadioQuiz(formData, items) {
    return items.reduce(
      (score, item, index) =>
        score + (formData.get(`q${index}`) === item.answer ? 1 : 0),
      0
    );
  }

  function createScreenController({
    screens,
    previousButton,
    nextButton,
    counter,
    progressBar,
    progressText,
    navigation,
    quizScreen,
    completeScreen,
    canLeaveQuiz,
    onScreenChange
  }) {
    let current = 0;

    function show(index, options = {}) {
      current = Math.max(0, Math.min(index, screens.length - 1));
      screens.forEach((screen, screenIndex) => {
        screen.classList.toggle("active", screenIndex === current);
      });

      const percentage = Math.round((current / (screens.length - 1)) * 100);
      progressBar.style.width = `${percentage}%`;
      progressText.textContent = `${percentage}%`;
      counter.textContent = `${current + 1} / ${screens.length}`;
      previousButton.disabled = current === 0;

      const isQuiz = current === quizScreen;
      const isComplete = current === completeScreen;
      navigation.hidden = isComplete;
      nextButton.hidden = isComplete;
      nextButton.disabled = isQuiz && !canLeaveQuiz();
      nextButton.textContent = isQuiz
        ? (canLeaveQuiz() ? "View completion" : "Pass quiz to continue")
        : "Continue";

      onScreenChange?.(current, percentage, options);
      window.scrollTo({
        top: 0,
        behavior: options.instant ? "auto" : "smooth"
      });
    }

    previousButton.addEventListener("click", () => show(current - 1));
    nextButton.addEventListener("click", () => show(current + 1));

    return {
      show,
      current: () => current,
      refresh: () => show(current, { skipSave: true, instant: true })
    };
  }

  return {
    shuffle,
    createAudioController,
    markChoice,
    clearChoiceStates,
    renderButtons,
    renderRadioQuiz,
    scoreRadioQuiz,
    createScreenController
  };
})();
