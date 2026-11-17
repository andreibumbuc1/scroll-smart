const questions = [
  {
    question: "Care dintre următoarele obiceiuri ajută la protejarea atenției și concentrării?",
    answers: [
      "Să urmărești videoclipuri scurte timp de mai multe ore.",
      "Să iei pauze de la telefon și să limitezi timpul petrecut pe rețelele sociale.",
      "Să verifici telefonul la fiecare notificare."
    ],
    correct: 1,
    explanation: "Corect! Pauzele și limitele de timp te ajută să-ți protejezi atenția."
  },
  {
    question: "Ce se poate întâmpla când verifici telefonul la fiecare notificare în timp ce înveți?",
    answers: [
      "Îți poți întrerupe concentrarea.",
      "Memorezi automat mai repede.",
      "Termini mereu temele mai repede."
    ],
    correct: 0,
    explanation: "Exact! Notificările te pot întrerupe și îți pot îngreuna revenirea la sarcină."
  },
  {
    question: "Care este o alegere bună înainte să începi temele?",
    answers: [
      "Să lași toate notificările pornite.",
      "Să deschizi mai multe clipuri în paralel.",
      "Să pui telefonul deoparte și să alegi un interval de lucru."
    ],
    correct: 2,
    explanation: "Foarte bine! Un interval de lucru fără întreruperi te ajută să rămâi concentrat."
  },
  {
    question: "Ce înseamnă să folosești echilibrat rețelele sociale?",
    answers: [
      "Să stai online ori de câte ori ai un moment liber.",
      "Să stabilești limite și să păstrezi timp pentru alte activități.",
      "Să renunți complet la somn pentru a vedea clipuri."
    ],
    correct: 1,
    explanation: "Corect! Echilibrul înseamnă să existe loc și pentru școală, odihnă și activități offline."
  },
  {
    question: "Ce poți face dacă observi că ai petrecut prea mult timp derulând clipuri?",
    answers: [
      "Să continui până nu mai găsești clipuri.",
      "Să ignori timpul petrecut online.",
      "Să iei o pauză și să alegi o activitate fără ecran."
    ],
    correct: 2,
    explanation: "Așa este! O pauză și o activitate fără ecran te ajută să recapeți controlul."
  }
];

const QUESTION_TIME = 15;
let currentQuestion = 0;
let score = 0;
let timeLeft = QUESTION_TIME;
let timerId = null;
let answered = false;

const questionCounter = document.getElementById("question-counter");
const scoreElement = document.getElementById("score");
const progressFill = document.getElementById("progress-fill");
const progressTrack = document.querySelector(".progress-track");
const timerElement = document.getElementById("timer");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const feedbackElement = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const questionKicker = document.getElementById("question-kicker");

function renderQuestion() {
  answered = false;
  timeLeft = QUESTION_TIME;
  const item = questions[currentQuestion];

  questionCounter.textContent = `ÎNTREBAREA ${currentQuestion + 1} / ${questions.length}`;
  questionElement.textContent = item.question;
  questionKicker.textContent = "GÂNDEȘTE ÎNAINTE SĂ ALEGI";
  feedbackElement.textContent = "";
  feedbackElement.className = "feedback";
  nextButton.hidden = true;
  nextButton.textContent = currentQuestion === questions.length - 1
    ? "Vezi rezultatul final →"
    : "Următoarea întrebare →";

  answersElement.innerHTML = "";
  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.type = "button";
    button.dataset.answer = index;
    button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.querySelector("span:last-child").textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index));
    answersElement.appendChild(button);
  });

  updateProgress();
  updateTimerDisplay();
  startTimer();
}

function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    timeLeft -= 1;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      stopTimer();
      finishQuestion(null);
    }
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function updateTimerDisplay() {
  timerElement.textContent = `${timeLeft}s`;
  timerElement.classList.toggle("warning", timeLeft <= 5);
}

function chooseAnswer(selectedIndex) {
  if (answered) return;
  finishQuestion(selectedIndex);
}

function finishQuestion(selectedIndex) {
  if (answered) return;
  answered = true;
  stopTimer();

  const item = questions[currentQuestion];
  const buttons = [...answersElement.querySelectorAll(".answer-btn")];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) button.classList.add("correct");
    if (selectedIndex === index && selectedIndex !== item.correct) {
      button.classList.add("wrong");
    }
  });

  if (selectedIndex === item.correct) {
    score += 10;
    scoreElement.textContent = score;
    feedbackElement.textContent = item.explanation;
    feedbackElement.classList.add("good");
  } else if (selectedIndex === null) {
    feedbackElement.textContent = `Timpul a expirat! ${item.explanation}`;
    feedbackElement.classList.add("bad");
  } else {
    feedbackElement.textContent = `Nu chiar. ${item.explanation}`;
    feedbackElement.classList.add("bad");
  }

  questionKicker.textContent = selectedIndex === item.correct
    ? "RĂSPUNS CORECT"
    : "AI ÎNVĂȚAT CEVA NOU";
  nextButton.hidden = false;
  updateProgress();
}

function updateProgress() {
  const completed = answered ? currentQuestion + 1 : currentQuestion;
  const percent = (completed / questions.length) * 100;
  progressFill.style.width = `${percent}%`;
  progressTrack.setAttribute("aria-valuenow", completed);
}

function showFinalResult() {
  stopTimer();
  questionCounter.textContent = "PROVOCARE ÎNCHEIATĂ";
  questionKicker.textContent = "REZULTATUL TĂU";
  questionElement.textContent = `Ai obținut ${score} din ${questions.length * 10} puncte!`;
  answersElement.innerHTML = "";
  timerElement.textContent = "✓";
  timerElement.classList.remove("warning");
  feedbackElement.className = "feedback good";
  feedbackElement.textContent = score >= 40
    ? "Excelent! Ai demonstrat că știi cum să-ți protejezi atenția. Continuă să folosești tehnologia echilibrat!"
    : score >= 20
      ? "Bună încercare! Ai aflat câteva metode utile. Recitește recomandările și încearcă din nou."
      : "Fiecare răspuns este o ocazie de învățare. Aplică recomandările și încearcă din nou!";
  nextButton.hidden = false;
  nextButton.textContent = "Reîncepe quizul ↻";
  progressFill.style.width = "100%";
  progressTrack.setAttribute("aria-valuenow", questions.length);
  nextButton.onclick = restartQuiz;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  scoreElement.textContent = "0";
  nextButton.onclick = goToNextQuestion;
  renderQuestion();
}

function goToNextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
  } else {
    showFinalResult();
  }
}

nextButton.addEventListener("click", goToNextQuestion);
renderQuestion();
