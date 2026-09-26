const state = {
  step: 1,
  actor: [],
  goals: [],
  challenges: [],
};

const diagnosticEngine = window.SenalDiagnostic;

const form = document.querySelector("#diagnostic-form");
const resultView = document.querySelector("#result-view");
const submissionSuccess = document.querySelector("#submission-success");
const diagnosticCard = document.querySelector(".diagnostic-card");
const nextButton = document.querySelector("#next-button");
const backButton = document.querySelector("#back-button");
const status = document.querySelector("#form-status");
const stepLabel = document.querySelector("#step-label");
const stepPercent = document.querySelector("#step-percent");
const progressBar = document.querySelector("#progress-bar");

document.querySelectorAll(".option-grid").forEach((group) => {
  const groupName = group.dataset.group;
  const limit = Number(group.dataset.limit);

  group.querySelectorAll(".option").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.value;
      const current = state[groupName];
      status.textContent = "";

      if (limit === 1) {
        state[groupName] = [value];
        group.querySelectorAll(".option").forEach((item) => {
          const selected = item === button;
          item.classList.toggle("selected", selected);
          item.setAttribute("aria-pressed", String(selected));
        });
      } else if (current.includes(value)) {
        state[groupName] = current.filter((item) => item !== value);
        button.classList.remove("selected");
        button.setAttribute("aria-pressed", "false");
      } else if (current.length < limit) {
        state[groupName] = [...current, value];
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
      } else {
        status.textContent = `Podés seleccionar hasta ${limit} opciones`;
      }

      updateControls();
    });
  });
});

function currentGroup() {
  return state.step === 1 ? "actor" : state.step === 2 ? "goals" : "challenges";
}

function updateControls() {
  const count = state[currentGroup()].length;
  nextButton.disabled = count === 0;
  nextButton.innerHTML = state.step === 3
    ? 'Ver mi orientación <span aria-hidden="true">→</span>'
    : 'Continuar <span aria-hidden="true">→</span>';
  backButton.classList.toggle("hidden", state.step === 1);

  const percent = Math.round((state.step / 3) * 100);
  stepLabel.textContent = `Paso ${state.step} de 3`;
  stepPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}

function showStep(nextStep) {
  state.step = nextStep;
  document.querySelectorAll(".diagnostic-step").forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === state.step);
  });
  status.textContent = "";
  updateControls();
  document.querySelector(`.diagnostic-step[data-step="${state.step}"] legend`)?.focus?.();
}

nextButton.addEventListener("click", () => {
  if (state[currentGroup()].length === 0) return;
  if (state.step < 3) showStep(state.step + 1);
  else buildResult();
});

backButton.addEventListener("click", () => showStep(Math.max(1, state.step - 1)));

function buildResult() {
  const diagnosis = diagnosticEngine.diagnose({
    actor: state.actor[0],
    goals: state.goals,
    challenges: state.challenges,
  });

  document.querySelector("#result-title").textContent = diagnosis.title;
  document.querySelector("#result-lead").textContent = diagnosis.lead;
  document.querySelector("#result-context").textContent = diagnosis.context;
  document.querySelector("#result-rationale").textContent = diagnosis.rationale;
  document.querySelector("#result-priority").textContent = diagnosis.primary.title;
  document.querySelector("#result-priority-copy").textContent = diagnosis.primary.copy;
  document.querySelector("#result-secondary").textContent = diagnosis.secondary.title;
  document.querySelector("#result-secondary-copy").textContent = diagnosis.secondary.copy;
  document.querySelector("#result-service").textContent = diagnosis.service;

  const stepList = document.querySelector("#result-steps");
  stepList.replaceChildren(...diagnosis.steps.map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));

  const summary = makeSummary(diagnosis);
  document.querySelector("#contact-summary").value = summary;

  form.hidden = true;
  resultView.hidden = false;
  resultView.dataset.summary = summary;
  document.querySelector("#result-title").focus({ preventScroll: true });
  resultView.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function makeSummary(diagnosis) {
  return [
    "ORIENTACIÓN PRELIMINAR · SEÑAL",
    `Actor: ${diagnosis.labels.actor}`,
    `Objetivos: ${diagnosis.labels.goals.join(" · ")}`,
    `Desafíos: ${diagnosis.labels.challenges.join(" · ")}`,
    `Prioridad estratégica: ${diagnosis.primary.title}`,
    diagnosis.primary.copy,
    `Segundo foco: ${diagnosis.secondary.title}`,
    diagnosis.secondary.copy,
    "Próximos pasos:",
    ...diagnosis.steps.map((item, index) => `${index + 1}. ${item}`),
    `Servicio sugerido: ${diagnosis.service}`,
  ].join("\n");
}

document.querySelector("#copy-result").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(resultView.dataset.summary);
    button.textContent = "Orientación copiada";
    setTimeout(() => { button.textContent = "Copiar orientación"; }, 2200);
  } catch {
    button.textContent = "No se pudo copiar";
  }
});

document.querySelector("#restart-button").addEventListener("click", () => {
  resetDiagnostic();
});

document.querySelector("#restart-from-success").addEventListener("click", () => {
  submissionSuccess.hidden = true;
  diagnosticCard.classList.remove("sent");
  resetDiagnostic();
});

function resetDiagnostic() {
  document.querySelector("#contact-form").reset();
  state.step = 1;
  state.actor = [];
  state.goals = [];
  state.challenges = [];
  document.querySelectorAll(".option").forEach((button) => {
    button.classList.remove("selected");
    button.setAttribute("aria-pressed", "false");
  });
  resultView.hidden = true;
  form.hidden = false;
  showStep(1);
  document.querySelector("#diagnostic-title").scrollIntoView({ behavior: "smooth", block: "start" });
}

function showSubmissionSuccess() {
  form.hidden = true;
  resultView.hidden = true;
  submissionSuccess.hidden = false;
  diagnosticCard.classList.add("sent");
  submissionSuccess.querySelector("h3").focus({ preventScroll: true });
  submissionSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
  history.replaceState({}, "", `${location.pathname}#diagnostico`);
}

document.querySelectorAll(".option").forEach((button) => button.setAttribute("aria-pressed", "false"));
updateControls();

if (new URLSearchParams(location.search).get("enviado") === "1") {
  showSubmissionSuccess();
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
