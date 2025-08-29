const tests = {
  ansiedade: {
    title: "Escala de Ansiedade",
    instructions: "<p><strong>Instrução:</strong> Indique com que frequência sentiu isso na última semana:</p><p><em>0 = Nenhuma vez | 1 = Algumas vezes | 2 = Frequentemente | 3 = Quase sempre</em></p>",
    scale: [
      { value: 0, label: "Nenhuma vez ou raramente" },
      { value: 1, label: "Algumas vezes" },
      { value: 2, label: "Frequentemente" },
      { value: 3, label: "Quase sempre ou sempre" }
    ],
    questions: [
      "Senti-me nervoso(a), ansioso(a) ou com os nervos à flor da pele.",
      "Não consegui parar ou controlar a preocupação.",
      "Preocupei-me excessivamente com diversas coisas.",
      "Tive dificuldade para relaxar.",
      "Fiquei tão inquieto(a) que me foi difícil ficar parado(a).",
      "Fiquei facilmente irritado(a) ou impaciente.",
      "Senti medo como se algo terrível pudesse acontecer."
    ],
    interpretation: [
      { min: 0, max: 7, label: "Baixo", description: "Ansiedade dentro da normalidade." },
      { min: 8, max: 14, label: "Moderado", description: "Sintomas de ansiedade que merecem atenção." },
      { min: 15, max: 21, label: "Alto", description: "Ansiedade significativa. Reflita sobre autocuidado e apoio emocional." }
    ],
    reflection: "Como esses sentimentos se conectam com traços de sua personalidade? São recorrentes? Em que contextos aparecem?"
  },

  depressao: {
    title: "Escala de Depressão",
    instructions: "<p><strong>Instrução:</strong> Indique com que frequência sentiu isso na última semana:</p><p><em>0 = Nenhuma vez | 1 = Algumas vezes | 2 = Frequentemente | 3 = Quase sempre</em></p>",
    scale: [
      { value: 0, label: "Nenhuma vez ou raramente" },
      { value: 1, label: "Algumas vezes" },
      { value: 2, label: "Frequentemente" },
      { value: 3, label: "Quase sempre ou sempre" }
    ],
    questions: [
      "Senti pouco interesse ou prazer em fazer as coisas.",
      "Senti-me para baixo, deprimido(a) ou sem esperança.",
      "Tive dificuldade para dormir ou dormi demais.",
      "Senti-me cansado(a) ou com pouca energia.",
      "Tive pouco apetite ou comi em excesso.",
      "Senti-me mal comigo mesmo(a) – ou que sou um(a) fracasso.",
      "Tive dificuldade para me concentrar.",
      "Estava tão agitado(a) ou inquieto(a) que andava de um lado para o outro.",
      "Pensei que seria melhor estar morto(a) ou me machucar."
    ],
    interpretation: [
      { min: 0, max: 9, label: "Baixo", description: "Poucos sintomas de depressão." },
      { min: 10, max: 18, label: "Moderado", description: "Sintomas de depressão presentes. Vale refletir sobre apoio emocional." },
      { min: 19, max: 27, label: "Alto", description: "Sintomas elevados. Considere conversar com um profissional." }
    ],
    reflection: "Que eventos recentes podem estar influenciando esses sentimentos? Como sua personalidade lida com a tristeza?"
  },

  estresse: {
    title: "Escala de Estresse Percebido",
    instructions: "<p><strong>Instrução:</strong> Nas últimas semanas, com que frequência você se sentiu assim?</p><p><em>0 = Nunca | 1 = Quase nunca | 2 = Às vezes | 3 = Frequentemente | 4 = Sempre</em></p>",
    scale: [
      { value: 0, label: "Nunca" },
      { value: 1, label: "Quase nunca" },
      { value: 2, label: "Às vezes" },
      { value: 3, label: "Frequentemente" },
      { value: 4, label: "Sempre" }
    ],
    questions: [
      "Você se sentiu chateado(a) por algo inesperado?",
      "Você sentiu que não conseguia lidar com todas as coisas que tinha que fazer?",
      "Você se sentiu nervoso(a) e estressado(a)?",
      "Você sentiu que estava no controle das coisas importantes em sua vida?",
      "Você sentiu que não podia superar as coisas importantes que estavam acontecendo?",
      "Você sentiu que as dificuldades estavam se acumulando tanto que não podia superá-las?"
    ],
    interpretation: [
      { min: 0, max: 10, label: "Baixo", description: "Estresse dentro da normalidade." },
      { min: 11, max: 16, label: "Moderado", description: "Estresse presente, mas gerenciável." },
      { min: 17, max: 24, label: "Alto", description: "Estresse elevado. Avalie suas estratégias de enfrentamento." }
    ],
    reflection: "Como o estresse se manifesta em sua vida? Ele interage com traços como neuroticismo ou perfeccionismo?"
  }
};

let currentTest = null;

function startTest(testKey) {
  currentTest = testKey;
  const test = tests[testKey];

  document.getElementById('test-title').textContent = test.title;
  document.getElementById('instructions').innerHTML = test.instructions;

  const questionsContainer = document.getElementById('questions-container');
  questionsContainer.innerHTML = '';

  test.questions.forEach((question, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';

    questionDiv.innerHTML = `
      <p><strong>${index + 1}.</strong> ${question}</p>
      <div class="options">
        ${test.scale.map(option => `
          <label class="option-label">
            <input type="radio" name="q${index}" value="${option.value}" required>
            ${option.value} - ${option.label}
          </label>
        `).join('')}
      </div>
    `;

    questionsContainer.appendChild(questionDiv);
  });

  document.getElementById('test-container').style.display = 'block';
  document.getElementById('results-container').style.display = 'none';

  // ✅ Rolar suavemente até o início do teste
  document.getElementById('test-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function calculateResults() {
  const form = document.getElementById('test-form');
  const formData = new FormData(form);
  let totalScore = 0;
  let unanswered = 0;

  const test = tests[currentTest];
  const questions = test.questions;

  for (let i = 0; i < questions.length; i++) {
    const value = formData.get(`q${i}`);
    if (value === null || value === undefined) {
      unanswered++;
    } else {
      totalScore += parseInt(value);
    }
  }

  if (unanswered > 0) {
    alert(`Você deixou ${unanswered} pergunta(s) sem resposta. Por favor, responda todas.`);
    return;
  }

  let interpretation = '';
  for (const range of test.interpretation) {
    if (totalScore >= range.min && totalScore <= range.max) {
      interpretation = `
        <p><strong>Pontuação: ${totalScore}</strong> (${range.label})</p>
        <p>${range.description}</p>
      `;
      break;
    }
  }

  const maxScore = questions.length * test.scale[test.scale.length - 1].value;
  const percentage = (totalScore / maxScore) * 100;

  const resultsContent = document.getElementById('results-content');
  resultsContent.innerHTML = `
    ${interpretation}
    <div class="score-bar">
      <div class="score-fill" style="width: 0%;" data-width="${percentage}%"></div>
    </div>
    <p><strong>Reflexão para pesquisa:</strong> ${test.reflection}</p>
  `;

  // Animação da barra de progresso
  setTimeout(() => {
    document.querySelector('.score-fill').style.width = `${percentage}%`;
  }, 100);

  document.getElementById('results-container').style.display = 'block';
  window.scrollTo(0, document.body.scrollHeight);
}

function resetTest() {
  document.getElementById('test-container').style.display = 'none';
  document.getElementById('test-form').reset();
  currentTest = null;
}