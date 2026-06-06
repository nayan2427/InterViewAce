/**
 * InterviewAce - Dashboard Logic
 * Displays user stats and quick actions
 */

function initDashboard() {
  if (!requireAuth()) return;

  const user = getCurrentUser();
  const stats = getUserStats(user.email);
  const rank = getUserRank(user.email);

  document.getElementById('welcomeName').textContent = user.fullName;
  document.getElementById('userAvatar').src = 'images/user-avatar.png';
  document.getElementById('userAvatar').alt = `${user.fullName}'s avatar`;

  document.getElementById('testsAttempted').textContent = stats.testsAttempted;
  document.getElementById('averageScore').textContent = `${stats.averageScore}%`;
  document.getElementById('highestScore').textContent = `${stats.highestScore}%`;
  document.getElementById('currentRank').textContent = rank;

  const results = getUserResults(user.email);
  renderRecentActivity(results);
}

function renderRecentActivity(results) {
  const container = document.getElementById('recentActivity');

  if (!results.length) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No tests attempted yet. Start your first MCQ test!</p>
        <a href="mcq.html" class="btn btn-primary">Start Test</a>
      </div>
    `;
    return;
  }

  const recent = results.slice(-5).reverse();
  container.innerHTML = recent.map(r => {
    const date = new Date(r.timestamp).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    const message = getPerformanceMessage(r.percentage);
    return `
      <div class="activity-item">
        <div class="activity-info">
          <span class="activity-score">${r.percentage}%</span>
          <span class="activity-detail">${r.correct}/${r.total} correct</span>
        </div>
        <div class="activity-meta">
          <span class="badge badge-${message.toLowerCase().replace(' ', '-')}">${message}</span>
          <span class="activity-date">${date}</span>
        </div>
      </div>
    `;
  }).join('');
}

function initResultPage() {
  if (!requireAuth()) return;

  const resultData = sessionStorage.getItem('interviewAce_lastResult');
  if (!resultData) {
    window.location.href = 'dashboard.html';
    return;
  }

  const result = JSON.parse(resultData);
  const message = getPerformanceMessage(result.percentage);

  document.getElementById('resultScore').textContent = result.score;
  document.getElementById('resultTotal').textContent = result.total;
  document.getElementById('resultPercentage').textContent = `${result.percentage}%`;
  document.getElementById('resultCorrect').textContent = result.correct;
  document.getElementById('resultWrong').textContent = result.wrong;
  document.getElementById('resultUnanswered').textContent = result.unanswered || 0;
  document.getElementById('performanceMessage').textContent = message;
  document.getElementById('performanceMessage').className = `performance-badge ${message.toLowerCase().replace(' ', '-')}`;

  const minutes = Math.floor(result.timeTaken / 60);
  const seconds = result.timeTaken % 60;
  document.getElementById('timeTaken').textContent = `${minutes}m ${seconds}s`;

  if (result.autoSubmitted) {
    document.getElementById('autoSubmitNotice').style.display = 'block';
  }
}

function initProfilePage() {
  if (!requireAuth()) return;

  const user = getCurrentUser();
  const stats = getUserStats(user.email);

  const rank = getUserRank(user.email);
  const memberDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : 'Recently';

  document.getElementById('profileName').textContent = user.fullName;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profileTests').textContent = stats.testsAttempted;
  document.getElementById('profileAverage').textContent = `${stats.averageScore}%`;
  document.getElementById('profileHighest').textContent = `${stats.highestScore}%`;
  document.getElementById('profileRank').textContent = rank;
  document.getElementById('profileMemberSince').textContent = `Member since ${memberDate}`;
  document.getElementById('profileAvatar').src = 'images/user-avatar.png';

  document.getElementById('editFullName').value = user.fullName;
  document.getElementById('editEmail').value = user.email;
  document.getElementById('editPassword').value = '';
  document.getElementById('editConfirmPassword').value = '';

  const profileForm = document.getElementById('profileForm');
  profileForm.removeEventListener('submit', handleProfileUpdate);
  profileForm.addEventListener('submit', handleProfileUpdate);
}

function handleProfileUpdate(event) {
  event.preventDefault();

  const user = getCurrentUser();
  const newName = document.getElementById('editFullName').value.trim();
  const newEmail = document.getElementById('editEmail').value.trim().toLowerCase();
  const newPassword = document.getElementById('editPassword').value;
  const confirmPassword = document.getElementById('editConfirmPassword').value;

  hideError('editNameError');
  hideError('editEmailError');
  hideError('editPasswordError');

  if (!newName) {
    showError('editNameError', 'Name is required');
    return;
  }

  if (!isValidEmail(newEmail)) {
    showError('editEmailError', 'Invalid email address');
    return;
  }

  if (newPassword && !validatePassword(newPassword)) {
    showError('editPasswordError', 'Password must be at least 6 characters');
    return;
  }

  if (newPassword && newPassword !== confirmPassword) {
    showError('editPasswordError', 'Passwords do not match');
    return;
  }

  const users = getUsers();
  if (newEmail !== user.email && users.some(u => u.email === newEmail)) {
    showFormMessage('profileMessage', 'Email already in use', 'error');
    return;
  }

  const oldEmail = user.email;
  user.fullName = newName;
  user.email = newEmail;
  if (newPassword) user.password = newPassword;

  updateUser(user);
  setSession(newEmail);

  if (oldEmail !== newEmail) {
    const notes = localStorage.getItem(STORAGE_KEYS.NOTES_PREFIX + oldEmail);
    if (notes) {
      localStorage.setItem(STORAGE_KEYS.NOTES_PREFIX + newEmail, notes);
      localStorage.removeItem(STORAGE_KEYS.NOTES_PREFIX + oldEmail);
    }

    const results = getResults().map(r => {
      if (r.email === oldEmail) {
        return { ...r, email: newEmail, fullName: newName };
      }
      return r;
    });
    saveResults(results);
  }

  showFormMessage('profileMessage', 'Profile updated successfully!', 'success');
  initProfilePage();
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  if (page === 'dashboard') initDashboard();
  if (page === 'result') initResultPage();
  if (page === 'profile') initProfilePage();
});
