(function (root, factory) {
  const engine = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = engine;
  }

  root.SenalDiagnostic = engine;
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const order = {
    goals: ["posicionamiento", "conversacion", "comunicacion", "riesgos", "innovacion"],
    challenges: ["mensaje", "interaccion", "datos", "reactivo", "canales", "equipo"],
    axes: ["mensaje", "escucha", "inteligencia", "anticipacion", "ecosistema", "capacidad", "innovacion"],
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
    challenges: {
      mensaje: "el mensaje no termina de ser claro",
      interaccion: "hay poca interacción o escucha",
      datos: "faltan datos para decidir",
      reactivo: "la comunicación es muy reactiva",
      canales: "los canales están dispersos",
      equipo: "falta tiempo o capacidad de equipo",
    },
  };

  const actorProfiles = {
    dirigente: {
      context: "Liderazgo, atributos públicos y coherencia entre voz, agenda y territorio",
      lens: "En un liderazgo personal, cada señal digital también construye atributos públicos y capacidad de iniciativa.",
      step: "Contrastar la orientación con agenda, territorio y atributos de liderazgo",
      weights: { mensaje: 2, anticipacion: 1 },
    },
    gobierno: {
      context: "Gestión, claridad de prioridades y capacidad de respuesta frente a la agenda pública",
      lens: "En un equipo de gobierno, la comunicación necesita conectar prioridades de gestión, evidencia y capacidad de respuesta.",
      step: "Alinear la lectura digital con prioridades, hitos y responsables de gestión",
      weights: { anticipacion: 2, inteligencia: 1, capacidad: 1 },
    },
    institucion: {
      context: "Legitimidad, consistencia institucional y relación con públicos diversos",
      lens: "En una institución, la consistencia entre áreas y la legitimidad frente a públicos diversos son parte del resultado.",
      step: "Validar mensajes y decisiones con las áreas y públicos institucionales clave",
      weights: { mensaje: 1, escucha: 1, ecosistema: 1 },
    },
    ong: {
      context: "Visibilidad de la causa, construcción de comunidad e incidencia pública",
      lens: "En una ONG, la estrategia debe convertir visibilidad de la causa en comunidad, participación e incidencia.",
      step: "Vincular cada acción con la causa, la comunidad y el objetivo de incidencia",
      weights: { escucha: 2, mensaje: 1, capacidad: 1 },
    },
    organizacion: {
      context: "Reputación, propuesta de valor y vínculo sostenido con sus audiencias",
      lens: "En una organización, la reputación se construye con una propuesta clara y vínculos sostenidos en cada canal.",
      step: "Contrastar la orientación con expectativas de públicos y riesgos reputacionales",
      weights: { ecosistema: 2, inteligencia: 1, capacidad: 1 },
    },
  };

  const axisProfiles = {
    mensaje: {
      headline: "Una voz clara para sostener el posicionamiento",
      focus: "claridad y arquitectura de mensajes",
      title: "Definir una arquitectura de mensajes",
      copy: "Antes de aumentar la frecuencia, conviene ordenar una idea central, tres ejes y evidencias que sostengan cada intervención.",
      steps: ["Relevar qué atributos y temas aparecen hoy", "Definir un mensaje central, tres ejes y sus evidencias", "Alinear biografías, piezas y vocerías"],
    },
    escucha: {
      headline: "Escuchar mejor para intervenir con sentido",
      focus: "escucha y conversación con los públicos",
      title: "Recuperar escucha y conversación",
      copy: "La prioridad no es publicar más, sino comprender qué activa preguntas, acuerdos, objeciones y participación en cada público.",
      steps: ["Identificar preguntas, temas y cambios de tono", "Separar alcance de interacción significativa", "Diseñar formatos que habiliten respuesta"],
    },
    inteligencia: {
      headline: "Convertir datos dispersos en señales para decidir",
      focus: "lectura de datos y criterios de decisión",
      title: "Instalar un sistema de lectura",
      copy: "Para decidir con menos intuición hace falta convertir métricas aisladas en señales comparables, periódicas y vinculadas a objetivos.",
      steps: ["Elegir indicadores asociados a cada objetivo", "Crear una línea de base por canal", "Definir una instancia breve de lectura semanal"],
    },
    anticipacion: {
      headline: "Ganar iniciativa frente a la agenda",
      focus: "anticipación y construcción de agenda propia",
      title: "Pasar de la reacción a la agenda",
      copy: "Responder al contexto es necesario, pero una estrategia sólida también construye temas propios y anticipa escenarios posibles.",
      steps: ["Distinguir agenda propia, pública y coyuntural", "Crear criterios para decidir cuándo intervenir", "Planificar escenarios y respuestas base"],
    },
    ecosistema: {
      headline: "Un ecosistema digital con dirección compartida",
      focus: "coherencia entre canales, formatos y públicos",
      title: "Ordenar el ecosistema digital",
      copy: "Cada canal necesita un rol concreto. La consistencia surge cuando todos responden a una misma estrategia sin repetir exactamente lo mismo.",
      steps: ["Asignar una función a cada canal activo", "Unificar identidad, biografías y enlaces", "Adaptar formatos sin fragmentar el mensaje"],
    },
    capacidad: {
      headline: "Una operación que el equipo pueda sostener",
      focus: "capacidad operativa y ritmo de trabajo",
      title: "Diseñar una operación sostenible",
      copy: "La estrategia necesita un ritmo que el equipo pueda sostener, con responsabilidades claras, plantillas y automatización selectiva.",
      steps: ["Priorizar tareas de mayor impacto", "Definir responsables y circuitos de aprobación", "Automatizar tareas repetitivas con control humano"],
    },
    innovacion: {
      headline: "Incorporar tecnología con un propósito concreto",
      focus: "innovación aplicada a procesos reales",
      title: "Priorizar una evolución digital con criterio",
      copy: "La IA aporta valor cuando resuelve un proceso definido, mejora la capacidad del equipo y conserva supervisión humana.",
      steps: ["Detectar un proceso repetitivo y de bajo riesgo", "Definir qué decisión seguirá bajo control humano", "Probar una herramienta con una métrica de mejora"],
    },
  };

  const goalWeights = {
    posicionamiento: { mensaje: 4, ecosistema: 2 },
    conversacion: { escucha: 4, inteligencia: 2 },
    comunicacion: { ecosistema: 4, mensaje: 2, capacidad: 1 },
    riesgos: { anticipacion: 4, inteligencia: 3 },
    innovacion: { innovacion: 7, capacidad: 2, inteligencia: 1 },
  };

  const challengeWeights = {
    mensaje: { mensaje: 5 },
    interaccion: { escucha: 5, inteligencia: 1 },
    datos: { inteligencia: 5 },
    reactivo: { anticipacion: 5, mensaje: 1 },
    canales: { ecosistema: 5, capacidad: 1 },
    equipo: { capacidad: 5, innovacion: 1 },
  };

  const serviceLabels = {
    posicionamiento: "diagnóstico y posicionamiento",
    conversacion: "escucha e inteligencia digital",
    comunicacion: "estrategia de comunicación",
    riesgos: "monitoreo y anticipación",
    innovacion: "evolución digital con IA",
  };

  function canonical(values, allowed) {
    const selected = new Set(Array.isArray(values) ? values : []);
    return allowed.filter((value) => selected.has(value));
  }

  function addWeights(scores, weights) {
    Object.entries(weights).forEach(([axis, value]) => {
      scores[axis] += value;
    });
  }

  function joinSpanish(items) {
    if (items.length < 2) return items[0] || "";
    if (items.length === 2) return `${items[0]} y ${items[1]}`;
    return `${items.slice(0, -1).join(", ")} y ${items.at(-1)}`;
  }

  function diagnose(input) {
    const actor = input && input.actor;
    const goals = canonical(input && input.goals, order.goals);
    const challenges = canonical(input && input.challenges, order.challenges);

    if (!actorProfiles[actor] || goals.length < 1 || challenges.length < 1) {
      throw new Error("La orientación necesita un actor, al menos un objetivo y al menos un desafío.");
    }

    const scores = Object.fromEntries(order.axes.map((axis) => [axis, 0]));
    addWeights(scores, actorProfiles[actor].weights);
    goals.forEach((goal) => addWeights(scores, goalWeights[goal]));
    challenges.forEach((challenge) => addWeights(scores, challengeWeights[challenge]));

    const rankedAxes = [...order.axes].sort((a, b) => scores[b] - scores[a] || order.axes.indexOf(a) - order.axes.indexOf(b));
    const primaryAxis = rankedAxes[0];
    const secondaryAxis = rankedAxes[1];
    const primary = axisProfiles[primaryAxis];
    const secondary = axisProfiles[secondaryAxis];
    const goalText = goals.map((goal) => labels.goals[goal]);
    const challengeText = challenges.map((challenge) => labels.challenges[challenge]);
    const actorProfile = actorProfiles[actor];

    const steps = [
      primary.steps[0],
      primary.steps[1],
      secondary.steps[0],
      actorProfile.step,
    ].filter((step, index, all) => all.indexOf(step) === index);

    return {
      actor,
      goals,
      challenges,
      title: primary.headline,
      lead: `${actorProfile.lens} La combinación de objetivos y desafíos indica que el primer foco debería estar en ${primary.focus}, acompañado por ${secondary.focus}.`,
      context: `${labels.actor[actor]} · ${actorProfile.context}`,
      rationale: `Objetivos considerados: ${joinSpanish(goalText)}. Desafíos considerados: ${joinSpanish(challengeText)}.`,
      primary: { axis: primaryAxis, score: scores[primaryAxis], ...primary },
      secondary: { axis: secondaryAxis, score: scores[secondaryAxis], ...secondary },
      steps,
      service: goals.length === 1
        ? `Ruta sugerida: ${serviceLabels[goals[0]]}`
        : `Ruta combinada: ${goals.map((goal) => serviceLabels[goal]).join(" + ")}`,
      labels: {
        actor: labels.actor[actor],
        goals: goalText,
        challenges: challengeText,
      },
      scores,
    };
  }

  return { diagnose, labels, order };
}));
