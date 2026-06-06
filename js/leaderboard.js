/**
 * InterviewAce - Leaderboard Module
 * Ranks users by highest score
 */

function initLeaderboard() {
  if (!requireAuth()) return;

  const users = getUsers();
  const currentUser = getCurrentUser();

  const rankings = users.map(user => {
    const stats = getUserStats(user.email);
    const results = getUserResults(user.email);
    const latestScore = results.length ? results[results.length - 1].percentage : 0;

    return {
      name: user.fullName,
      email: user.email,
      score: stats.highestScore,
      averageScore: stats.averageScore,
      testsAttempted: stats.testsAttempted,
      latestScore
    };
  })
    .filter(r => r.testsAttempted > 0)
    .sort((a, b) => b.score - a.score || b.averageScore - a.averageScore);

  renderLeaderboard(rankings, currentUser.email);
  renderTopThree(rankings);
}

function renderTopThree(rankings) {
  const container = document.getElementById('topThree');

  if (rankings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No rankings yet. Be the first to complete a test!</p>
      </div>
    `;
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  const top = rankings.slice(0, 3);

  container.innerHTML = top.map((user, idx) => `
    <div class="podium-card rank-${idx + 1}">
      <div class="podium-medal">${medals[idx]}</div>
      <img src="images/user-avatar.png" alt="${user.name}" class="podium-avatar">
      <h3 class="podium-name">${escapeHtml(user.name)}</h3>
      <p class="podium-score">${user.score}%</p>
      <span class="podium-rank">Rank #${idx + 1}</span>
    </div>
  `).join('');
}

function renderLeaderboard(rankings, currentEmail) {
  const tbody = document.getElementById('leaderboardBody');

  if (rankings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-row">No data available. Complete a test to appear on the leaderboard.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = rankings.map((user, idx) => {
    const isCurrent = user.email === currentEmail;
    return `
      <tr class="${isCurrent ? 'current-user-row' : ''}">
        <td>
          <span class="rank-badge ${idx < 3 ? 'top-rank' : ''}">${idx + 1}</span>
        </td>
        <td>
          <div class="leader-name">
            <img src="images/user-avatar.png" alt="" class="leader-avatar">
            <span>${escapeHtml(user.name)}${isCurrent ? ' <em>(You)</em>' : ''}</span>
          </div>
        </td>
        <td><strong>${user.score}%</strong></td>
        <td>${user.testsAttempted}</td>
      </tr>
    `;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'leaderboard') {
    initLeaderboard();
  }
});
