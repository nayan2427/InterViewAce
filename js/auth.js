/**
 * InterviewAce - Authentication & Shared Utilities
 * Handles user registration, login, session, and dark mode
 */

const STORAGE_KEYS = {
  USERS: 'interviewAce_users',
  SESSION: 'interviewAce_session',
  RESULTS: 'interviewAce_results',
  DARK_MODE: 'interviewAce_darkMode',
  NOTES_PREFIX: 'interviewAce_notes_',
  QUIZ_PROGRESS: 'interviewAce_quiz_progress'
};

/* ==================== Storage Helpers ==================== */

function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getResults() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
}

function saveResults(results) {
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
}

function getCurrentUser() {
  const email = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!email) return null;
  return getUsers().find(u => u.email === email) || null;
}

function setSession(email) {
  localStorage.setItem(STORAGE_KEYS.SESSION, email);
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

function updateUser(updatedUser) {
  const users = getUsers();
  const index = users.findIndex(u => u.email === updatedUser.email);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
  }
}

/* ==================== Validation ==================== */

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
  }
}

function hideError(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = '';
    el.style.display = 'none';
  }
}

function showFormMessage(elementId, message, type = 'error') {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.className = `form-message ${type}`;
    el.style.display = 'block';
  }
}

/* ==================== Auth Guard ==================== */

function requireAuth(redirectTo = 'login.html') {
  if (!getCurrentUser()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

function redirectIfLoggedIn(redirectTo = 'dashboard.html') {
  if (getCurrentUser()) {
    window.location.href = redirectTo;
  }
}

/* ==================== Signup ==================== */

function handleSignup(event) {
  event.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  hideError('fullNameError');
  hideError('emailError');
  hideError('passwordError');
  hideError('confirmPasswordError');

  let isValid = true;

  if (!fullName) {
    showError('fullNameError', 'Full name is required');
    isValid = false;
  }

  if (!isValidEmail(email)) {
    showError('emailError', 'Please enter a valid email address');
    isValid = false;
  }

  if (!validatePassword(password)) {
    showError('passwordError', 'Password must be at least 6 characters');
    isValid = false;
  }

  if (password !== confirmPassword) {
    showError('confirmPasswordError', 'Passwords do not match');
    isValid = false;
  }

  if (!isValid) return;

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    showFormMessage('formMessage', 'An account with this email already exists', 'error');
    return;
  }

  const newUser = {
    id: Date.now().toString(),
    fullName,
    email,
    password,
    testsAttempted: 0,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  setSession(email);

  showFormMessage('formMessage', 'Account created successfully! Redirecting...', 'success');
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1500);
}

/* ==================== Login ==================== */

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;

  hideError('emailError');
  hideError('passwordError');

  let isValid = true;

  if (!isValidEmail(email)) {
    showError('emailError', 'Please enter a valid email address');
    isValid = false;
  }

  if (!password) {
    showError('passwordError', 'Password is required');
    isValid = false;
  }

  if (!isValid) return;

  const user = getUsers().find(u => u.email === email && u.password === password);

  if (!user) {
    showFormMessage('formMessage', 'Invalid email or password', 'error');
    return;
  }

  setSession(email);
  window.location.href = 'dashboard.html';
}

/* ==================== Logout ==================== */

function handleLogout() {
  clearSession();
  localStorage.removeItem(STORAGE_KEYS.QUIZ_PROGRESS);
  window.location.href = 'index.html';
}

/* ==================== Dark Mode ==================== */

function initDarkMode() {
  const isDark = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  updateDarkModeToggle(isDark);
}

function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, newTheme === 'dark');
  updateDarkModeToggle(newTheme === 'dark');
}

function updateDarkModeToggle(isDark) {
  document.querySelectorAll('.dark-mode-toggle').forEach(btn => {
    btn.innerHTML = isDark
      ? '<span class="toggle-icon">☀️</span> Light'
      : '<span class="toggle-icon">🌙</span> Dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

function setupDarkModeToggle() {
  document.querySelectorAll('.dark-mode-toggle').forEach(btn => {
    btn.addEventListener('click', toggleDarkMode);
  });
}

/* ==================== User Stats Helpers ==================== */

function getUserResults(email) {
  return getResults().filter(r => r.email === email);
}

function getUserStats(email) {
  const results = getUserResults(email);
  const testsAttempted = results.length;

  if (testsAttempted === 0) {
    return {
      testsAttempted: 0,
      averageScore: 0,
      highestScore: 0,
      totalCorrect: 0,
      totalWrong: 0
    };
  }

  const scores = results.map(r => r.percentage);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const highestScore = Math.max(...scores);

  return {
    testsAttempted,
    averageScore,
    highestScore,
    totalCorrect: results.reduce((sum, r) => sum + r.correct, 0),
    totalWrong: results.reduce((sum, r) => sum + r.wrong, 0)
  };
}

function getUserRank(email) {
  const users = getUsers();
  const rankings = users.map(user => {
    const stats = getUserStats(user.email);
    return {
      email: user.email,
      highestScore: stats.highestScore,
      averageScore: stats.averageScore
    };
  }).sort((a, b) => b.highestScore - a.highestScore || b.averageScore - a.averageScore);

  const rank = rankings.findIndex(r => r.email === email) + 1;
  return rank || '-';
}

function getPerformanceMessage(percentage) {
  if (percentage >= 80) return 'Excellent';
  if (percentage >= 60) return 'Good';
  return 'Needs Improvement';
}

/* ==================== Mobile Nav ==================== */

function setupMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      toggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
      });
    });
  }
}

/* ==================== Init ==================== */

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  setupDarkModeToggle();
  setupMobileNav();

  const signupForm = document.getElementById('signupForm');
  if (signupForm) signupForm.addEventListener('submit', handleSignup);

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  if (document.body.dataset.authPage === 'signup') {
    redirectIfLoggedIn();
  }
  if (document.body.dataset.authPage === 'login') {
    redirectIfLoggedIn();
  }
});
