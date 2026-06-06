/**
 * InterviewAce - Analytics Module
 * Chart.js integration for performance visualization
 */

let scoreTrendChart = null;
let categoryChart = null;
let progressChart = null;

function initAnalytics() {
  if (!requireAuth()) return;

  const user = getCurrentUser();
  const results = getUserResults(user.email);

  if (!results.length) {
    document.getElementById('analyticsEmpty').style.display = 'flex';
    document.getElementById('chartsContainer').style.display = 'none';
    return;
  }

  document.getElementById('analyticsEmpty').style.display = 'none';
  document.getElementById('chartsContainer').style.display = 'grid';

  renderScoreTrendChart(results);
  renderCategoryChart(results);
  renderProgressChart(results);
}

function getChartColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: isDark ? '#e2e8f0' : '#334155',
    grid: isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.3)',
    primary: '#4f46e5',
    secondary: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  };
}

function renderScoreTrendChart(results) {
  const ctx = document.getElementById('scoreTrendChart');
  if (!ctx) return;

  const colors = getChartColors();
  const labels = results.map((r, i) => `Test ${i + 1}`);
  const data = results.map(r => r.percentage);

  if (scoreTrendChart) scoreTrendChart.destroy();

  scoreTrendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Score (%)',
        data,
        borderColor: colors.primary,
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.primary,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: getLineChartOptions(colors, 'Score Trend Over Tests')
  });
}

function renderCategoryChart(results) {
  const ctx = document.getElementById('categoryChart');
  if (!ctx) return;

  const colors = getChartColors();
  const latestResult = results[results.length - 1];
  const categoryStats = latestResult.categoryStats || {};

  const labels = CATEGORIES;
  const data = labels.map(cat => {
    const stat = categoryStats[cat];
    if (!stat || stat.total === 0) return 0;
    return Math.round((stat.correct / stat.total) * 100);
  });

  const barColors = [
    '#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
  ];

  if (categoryChart) categoryChart.destroy();

  categoryChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Accuracy (%)',
        data,
        backgroundColor: barColors,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Category Performance (Latest Test)',
          color: colors.text,
          font: { size: 16, weight: '600' }
        },
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: colors.text },
          grid: { color: colors.grid }
        },
        x: {
          ticks: { color: colors.text, maxRotation: 45 },
          grid: { display: false }
        }
      }
    }
  });
}

function renderProgressChart(results) {
  const ctx = document.getElementById('progressChart');
  if (!ctx) return;

  const colors = getChartColors();

  const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
  const totalWrong = results.reduce((sum, r) => sum + r.wrong, 0);
  const totalUnanswered = results.reduce((sum, r) => sum + (r.unanswered || 0), 0);

  if (progressChart) progressChart.destroy();

  progressChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Correct', 'Wrong', 'Unanswered'],
      datasets: [{
        data: [totalCorrect, totalWrong, totalUnanswered],
        backgroundColor: [colors.success, colors.danger, colors.warning],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Overall Answer Distribution',
          color: colors.text,
          font: { size: 16, weight: '600' }
        },
        legend: {
          position: 'bottom',
          labels: { color: colors.text, padding: 20 }
        }
      },
      cutout: '65%'
    }
  });
}

function getLineChartOptions(colors, title) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        color: colors.text,
        font: { size: 16, weight: '600' }
      },
      legend: {
        labels: { color: colors.text }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: colors.text },
        grid: { color: colors.grid }
      },
      x: {
        ticks: { color: colors.text },
        grid: { color: colors.grid }
      }
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'dashboard') {
    setTimeout(initAnalytics, 100);
  }
});
