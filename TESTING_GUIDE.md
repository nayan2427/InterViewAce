# InterviewAce - Testing Guide

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, or Safari)
- Local web server recommended (Live Server extension or Python `http.server`)

## Getting Started

1. Open the `InterviewAce` folder
2. Start a local server:
   ```bash
   # Python 3
   python -m http.server 8080

   # Or use VS Code Live Server extension
   ```
3. Navigate to `http://localhost:8080/index.html`

---

## Test Cases

### 1. Landing Page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open `index.html` | Hero, features, stats, about, footer visible |
| 2 | Click navbar links | Smooth scroll to sections |
| 3 | Resize to mobile width | Hamburger menu appears |
| 4 | Toggle dark mode | Theme switches, persists on refresh |
| 5 | Click "Start Learning" | Redirects to signup page |

### 2. Signup

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Submit empty form | Validation errors shown |
| 2 | Enter invalid email | Email error displayed |
| 3 | Enter password < 6 chars | Password error shown |
| 4 | Mismatched passwords | Confirm password error shown |
| 5 | Register with valid data | Success message, redirect to dashboard |
| 6 | Register same email again | "Account already exists" error |

### 3. Login

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login with wrong credentials | "Invalid email or password" error |
| 2 | Login with correct credentials | Redirect to dashboard |
| 3 | Visit login while logged in | Auto-redirect to dashboard |

### 4. Dashboard

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View dashboard after login | Welcome name and stats displayed |
| 2 | New user stats | All zeros, rank shows "-" |
| 3 | After completing test | Stats update correctly |
| 4 | Analytics section | Charts appear after first test |
| 5 | Logout | Redirects to homepage, session cleared |

### 5. MCQ Test Engine

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Start test | Question 1 loads with 4 options |
| 2 | Select an answer | Option highlighted, nav button turns green |
| 3 | Click Next/Previous | Navigation works correctly |
| 4 | Use question navigator | Jump to any question |
| 5 | Timer | Counts down from 30:00 |
| 6 | Refresh mid-test | Progress and timer restored |
| 7 | Submit test | Confirmation dialog, redirect to results |

### 6. Timer Auto-Submit

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Wait for timer to reach 0 (or modify `QUIZ_DURATION` in `quiz.js` to 10 for quick test) | Test auto-submits |
| 2 | View result page | Auto-submit notice displayed |

### 7. Result Page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Complete a test | Score, percentage, correct/wrong shown |
| 2 | Score ≥ 80% | "Excellent" badge |
| 3 | Score 60-79% | "Good" badge |
| 4 | Score < 60% | "Needs Improvement" badge |
| 5 | Direct visit without test | Redirect to dashboard |

### 8. Notes Module

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add Note" | Modal opens |
| 2 | Save note with title & content | Note appears in grid |
| 3 | Edit note | Modal pre-filled, changes saved |
| 4 | Delete note | Confirmation, note removed |
| 5 | Refresh page | Notes persist |

### 9. Leaderboard

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View with no test data | Empty state message |
| 2 | Complete tests as multiple users | Rankings sorted by highest score |
| 3 | Current user row | Highlighted with "(You)" label |
| 4 | Top 3 podium | Medal cards displayed |

### 10. Profile

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View profile | Name, email, stats displayed |
| 2 | Update name | Changes saved and reflected |
| 3 | Change email | Session and data migrated |
| 4 | Set new password | Login works with new password |
| 5 | Duplicate email | Error message shown |

### 11. Analytics (Chart.js)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Complete 2+ tests | Score trend line chart shows data |
| 2 | Category chart | Bar chart per category from latest test |
| 3 | Progress chart | Doughnut chart with correct/wrong/unanswered |
| 4 | Toggle dark mode | Chart colors adapt |

### 12. Dark Mode

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Toggle on any page | Theme switches immediately |
| 2 | Refresh page | Preference remembered |
| 3 | Navigate between pages | Consistent theme |

### 13. Responsive Design

| Breakpoint | Test |
|------------|------|
| Desktop (1200px+) | Full sidebar, 4-column stats |
| Tablet (768-992px) | Collapsible sidebar, 2-column grids |
| Mobile (< 768px) | Single column, hamburger nav |

---

## localStorage Keys Reference

| Key | Purpose |
|-----|---------|
| `interviewAce_users` | Registered user accounts |
| `interviewAce_session` | Current logged-in user email |
| `interviewAce_results` | All test results |
| `interviewAce_darkMode` | Dark mode preference |
| `interviewAce_notes_{email}` | User-specific notes |
| `interviewAce_quiz_progress` | In-progress quiz state |

## Clearing Test Data

Open browser DevTools → Application → Local Storage → Clear all `interviewAce_*` keys.

---

## Known Limitations

- Data is stored locally per browser (not synced across devices)
- Passwords are stored in plain text (educational project only)
- Chart.js requires internet for CDN loading
