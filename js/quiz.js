/**
 * InterviewAce - MCQ Quiz Engine
 * Handles quiz flow, timer, navigation, and submission
 */

const QUIZ_DURATION = 30 * 60; // 30 minutes in seconds

let currentIndex = 0;
let answers = {};
let timerInterval = null;
let timeRemaining = QUIZ_DURATION;
let quizStartTime = null;

function initQuiz() {
  if (!requireAuth()) return;

  const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
  if (saved) {
    const progress = JSON.parse(saved);
    const user = getCurrentUser();
    if (progress.email === user.email && progress.answers) {
      answers = progress.answers;
      currentIndex = progress.currentIndex || 0;
      timeRemaining = progress.timeRemaining || QUIZ_DURATION;
      quizStartTime = progress.startTime;
    }
  }

  if (!quizStartTime) {
    quizStartTime = Date.now();
    saveQuizProgress();
  }

  renderQuestion();
  renderNavigator();
  updateProgressBar();
  startTimer();
  bindQuizEvents();
}

function saveQuizProgress() {
  const user = getCurrentUser();
  localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify({
    email: user.email,
    answers,
    currentIndex,
    timeRemaining,
    startTime: quizStartTime
  }));
}

function bindQuizEvents() {
  document.getElementById('prevBtn').addEventListener('click', goPrevious);
  document.getElementById('nextBtn').addEventListener('click', goNext);
  document.getElementById('submitBtn').addEventListener('click', confirmSubmit);
}

function handleOptionSelect(e) {
  const optionEl = e.currentTarget;
  const optionIndex = parseInt(optionEl.dataset.index, 10);
  selectAnswer(optionIndex);
}

function selectAnswer(optionIndex) {
  answers[QUESTIONS[currentIndex].id] = optionIndex;
  saveQuizProgress();
  renderQuestion();
  renderNavigator();
  updateProgressBar();
}

function renderQuestion() {
  const question = QUESTIONS[currentIndex];
  const container = document.getElementById('questionContainer');

  document.getElementById('questionNumber').textContent = `Question ${currentIndex + 1} of ${QUESTIONS.length}`;
  document.getElementById('questionCategory').textContent = question.category;
  document.getElementById('questionText').textContent = question.question;

  const optionsHtml = question.options.map((opt, idx) => {
    const isSelected = answers[question.id] === idx;
    return `
      <div class="option-item ${isSelected ? 'selected' : ''}" data-index="${idx}" role="button" tabindex="0">
        <span class="option-marker">${String.fromCharCode(65 + idx)}</span>
        <span class="option-text">${opt}</span>
      </div>
    `;
  }).join('');

  document.getElementById('optionsList').innerHTML = optionsHtml;

  document.querySelectorAll('.option-item').forEach(item => {
    item.addEventListener('click', handleOptionSelect);
    item.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOptionSelect(e);
      }
    });
  });

  document.getElementById('prevBtn').disabled = currentIndex === 0;
  document.getElementById('nextBtn').style.display = currentIndex < QUESTIONS.length - 1 ? 'inline-flex' : 'none';
  document.getElementById('submitBtn').style.display = currentIndex === QUESTIONS.length - 1 ? 'inline-flex' : 'none';
}

function renderNavigator() {
  const nav = document.getElementById('questionNav');
  nav.innerHTML = QUESTIONS.map((q, idx) => {
    let status = 'unanswered';
    if (answers[q.id] !== undefined) status = 'answered';
    if (idx === currentIndex) status += ' current';
    return `<button class="nav-btn ${status}" data-index="${idx}" aria-label="Go to question ${idx + 1}">${idx + 1}</button>`;
  }).join('');

  nav.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentIndex = parseInt(btn.dataset.index, 10);
      saveQuizProgress();
      renderQuestion();
      renderNavigator();
    });
  });
}

function updateProgressBar() {
  const answered = Object.keys(answers).length;
  const percent = (answered / QUESTIONS.length) * 100;
  document.getElementById('progressFill').style.width = `${percent}%`;
  document.getElementById('progressText').textContent = `${answered}/${QUESTIONS.length} answered`;
}

function goPrevious() {
  if (currentIndex > 0) {
    currentIndex--;
    saveQuizProgress();
    renderQuestion();
    renderNavigator();
  }
}

function goNext() {
  if (currentIndex < QUESTIONS.length - 1) {
    currentIndex++;
    saveQuizProgress();
    renderQuestion();
    renderNavigator();
  }
}

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeRemaining--;
    saveQuizProgress();
    updateTimerDisplay();

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      submitQuiz(true);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const timerEl = document.getElementById('timer');

  timerEl.textContent = display;
  timerEl.classList.remove('warning', 'danger');

  if (timeRemaining <= 300) timerEl.classList.add('warning');
  if (timeRemaining <= 60) timerEl.classList.add('danger');
}

function confirmSubmit() {
  const unanswered = QUESTIONS.length - Object.keys(answers).length;
  let message = 'Are you sure you want to submit the test?';

  if (unanswered > 0) {
    message = `You have ${unanswered} unanswered question(s). Submit anyway?`;
  }

  if (confirm(message)) {
    submitQuiz(false);
  }
}

function submitQuiz(autoSubmitted = false) {
  if (timerInterval) clearInterval(timerInterval);

  const user = getCurrentUser();
  let correct = 0;
  let wrong = 0;
  const categoryStats = {};

  CATEGORIES.forEach(cat => {
    categoryStats[cat] = { correct: 0, total: 0 };
  });

  QUESTIONS.forEach(q => {
    categoryStats[q.category].total++;
    const userAnswer = answers[q.id];

    if (userAnswer === q.correct) {
      correct++;
      categoryStats[q.category].correct++;
    } else if (userAnswer !== undefined) {
      wrong++;
    }
  });

  const unanswered = QUESTIONS.length - correct - wrong;
  const percentage = Math.round((correct / QUESTIONS.length) * 100);
  const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);

  const result = {
    id: Date.now().toString(),
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    score: correct,
    total: QUESTIONS.length,
    percentage,
    correct,
    wrong,
    unanswered,
    categoryStats,
    autoSubmitted,
    timeTaken,
    timestamp: new Date().toISOString()
  };

  const results = getResults();
  results.push(result);
  saveResults(results);

  user.testsAttempted = (user.testsAttempted || 0) + 1;
  updateUser(user);

  localStorage.removeItem(STORAGE_KEYS.QUIZ_PROGRESS);

  sessionStorage.setItem('interviewAce_lastResult', JSON.stringify(result));
  window.location.href = 'result.html';
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'mcq') {
    initQuiz();
  }
});
