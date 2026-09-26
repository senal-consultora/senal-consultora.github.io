const state = {
  step: 1,
  actor: [],
  goals: [],
  challenges: [],
};

const labels = {
  actor: {
    dirigente: "dirigente o candidato",
    gobierno: "equipo de gobierno",
    institucion: "institución",
    ong: "ONG",
    organizacion: "organización",
  },
  goals: {
    posicionamiento: "ordenar el posicionamiento",
    conversacion: "entender la conversación",
    comunicacion: "fortalecer la comunicación",
    riesgos: "anticipar riesgos",
    innovacion: "incorporar IA y herramientas",
  },
};

const actorContext = {
  dirigente: "Liderazgo, atributos públicos y coherencia entre voz, agenda y territorio",
  gobierno: "Gestión, claridad de prioridades y capacidad de respuesta frente a la agenda pública",
  institucion: "Legitimidad, consistencia institucional y relación con públicos diversos",
  ong: "Visibilidad de la causa, construcción de comunidad e incidencia pública",
  organizacion: "Reputación, propuesta de valor y vínculo sostenido con sus audiencias",
};

const priorityMap = {
  mensaje: {
    title: "Definir una arquitectura de mensajes",
    copy: "Antes de aumentar la frecuencia, conviene ordenar una idea central, tres ejes y evidencias que sostengan cada intervención",
    steps: ["Relevar qué atributos aparecen hoy", "Definir un mensaje central y tres ejes", "Alinear biografías, piezas y vocerías"],
  },
  interaccion: {
    title: "Recuperar escucha y conversación",
    copy: "La prioridad no es publicar más, sino comprender qué activa preguntas, acuerdos, objeciones y participación en cada público",
    steps: ["Identificar preguntas y temas recurrentes", "Separar alcance de interacción significativa", "Diseñar formatos que habiliten respuesta"],
  },
  datos: {
    title: "Instalar un sistema de lectura",
    copy: "Para decidir con menos intuición hace falta convertir métricas aisladas en señales comparables, periódicas y vinculadas a objetivos",
    steps: ["Elegir indicadores asociados a cada objetivo", "Crear una línea de base por canal", "Definir una instancia breve de lectura semanal"],
  },
  reactivo: {
    title: "Pasar de la reacción a la agenda",
    copy: "Responder al contexto es necesario, pero una estrategia sólida también construye temas propios y anticipa escenarios posibles",
    steps: ["Distinguir agenda propia, pública y coyuntural", "Crear criterios para decidir cuándo intervenir", "Planificar escenarios y respuestas base"],
  },
  canales: {
    title: "Ordenar el ecosistema digital",
    copy: "Cada canal necesita un rol concreto. La consistencia surge cuando todos responden a una misma estrategia sin repetir exactamente lo mismo",
    steps: ["Asignar una función a cada canal activo", "Unificar identidad, biografías y enlaces", "Adaptar formatos sin fragmentar el mensaje"],
  },
  equipo: {
    title: "Diseñar una operación sostenible",
    copy: "La estrategia necesita un ritmo que el equipo pueda sostener, con responsabilidades claras, plantillas y automatización selectiva",
    steps: ["Priorizar tareas de mayor impacto", "Definir responsables y circuitos de aprobación", "Automatizar tareas repetitivas con control humano"],
  },
};

const goalLens = {
  posicionamiento: "Conviene comenzar por la coherencia entre los atributos que se quieren proyectar y las señales que hoy aparecen públicamente",
  conversacion: "La lectura debe enfocarse en temas, preguntas y cambios de tono, no sólo en volumen o cantidad de menciones",
  comunicacion: "La mejora depende de conectar objetivos, públicos, mensajes y formatos dentro de un mismo criterio editorial",
  riesgos: "Hace falta observar señales tempranas y acordar criterios de respuesta antes de que la coyuntura imponga el ritmo",
  innovacion: "La tecnología aporta cuando resuelve un proceso concreto y conserva criterio estratégico y supervisión humana",
};

const serviceMap = {
  posicionamiento: "Diagnóstico político digital + estrategia de posicionamiento",
  conversacion: "Inteligencia digital y escucha estratégica",
  comunicacion: "Diagnóstico político digital + estrategia de comunicación",
  riesgos: "Inteligencia digital y monitoreo de señales",
  innovacion: "Diagnóstico de procesos + evolución con IA",
};

const form = document.querySelector("#diagnostic-form");
const resultView = document.querySelector("#result-view");
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
  const actor = state.actor[0];
  const goal = state.goals[0];
  const challenge = state.challenges[0];
  const priority = priorityMap[challenge];
  const secondarySteps = state.challenges.slice(1).map((item) => priorityMap[item].steps[0]);
  const steps = [...priority.steps, ...secondarySteps].slice(0, 4);

  document.querySelector("#result-title").textContent = "Primero claridad, después escala";
  document.querySelector("#result-lead").textContent = goalLens[goal];
  document.querySelector("#result-context").textContent = `${labels.actor[actor]} · ${actorContext[actor]}`;
  document.querySelector("#result-priority").textContent = priority.title;
  document.querySelector("#result-priority-copy").textContent = priority.copy;
  document.querySelector("#result-service").textContent = serviceMap[goal];

  const stepList = document.querySelector("#result-steps");
  stepList.replaceChildren(...steps.map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));

  const summary = makeSummary(actor, goal, priority, steps);
  const contactLink = document.querySelector("#contact-link");
  contactLink.href = `mailto:hola@senalconsultora.com?subject=${encodeURIComponent("Diagnóstico preliminar SEÑAL")}&body=${encodeURIComponent(summary + "\n\nQuisiera coordinar un diagnóstico integral.")}`;

  form.hidden = true;
  resultView.hidden = false;
  resultView.dataset.summary = summary;
  document.querySelector("#result-title").focus({ preventScroll: true });
  resultView.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function makeSummary(actor, goal, priority, steps) {
  return [
    "ORIENTACIÓN PRELIMINAR · SEÑAL",
    `Actor: ${labels.actor[actor]}`,
    `Objetivo principal: ${labels.goals[goal]}`,
    `Prioridad estratégica: ${priority.title}`,
    priority.copy,
    "Próximos pasos:",
    ...steps.map((item, index) => `${index + 1}. ${item}`),
    `Servicio sugerido: ${serviceMap[goal]}`,
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
});

document.querySelectorAll(".option").forEach((button) => button.setAttribute("aria-pressed", "false"));
updateControls();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
