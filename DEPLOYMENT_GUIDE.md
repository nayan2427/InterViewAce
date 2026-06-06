# InterviewAce - Deployment Guide

## Overview

InterviewAce is a **100% frontend** application. No backend server is required. All data is stored in the browser's `localStorage`.

---

## Deployment Options

### Option 1: GitHub Pages (Free)

1. Create a GitHub repository
2. Upload the `InterviewAce` folder contents to the repo root
3. Go to **Settings → Pages**
4. Set source to `main` branch, `/ (root)` folder
5. Save — your site will be live at `https://username.github.io/repo-name/`

**Note:** Chart.js loads from CDN, so internet access is required.

### Option 2: Netlify (Free)

1. Sign up at [netlify.com](https://netlify.com)
2. Drag and drop the `InterviewAce` folder onto the Netlify dashboard
3. Site deploys instantly with a `.netlify.app` URL
4. Optional: connect a custom domain in Site Settings

**CLI deployment:**
```bash
npm install -g netlify-cli
cd InterviewAce
netlify deploy --prod --dir .
```

### Option 3: Vercel (Free)

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repo or use CLI:
   ```bash
   npm install -g vercel
   cd InterviewAce
   vercel --prod
   ```
3. Vercel auto-detects static sites

### Option 4: Local / USB Distribution

Simply copy the `InterviewAce` folder and open `index.html` in a browser.

**Recommended:** Use a local server to avoid CORS issues with Chart.js:
```bash
cd InterviewAce
python -m http.server 8080
```
Then open `http://localhost:8080`

### Option 5: Shared Network (College Lab)

1. Host on one machine using Python server:
   ```bash
   python -m http.server 8080 --bind 0.0.0.0
   ```
2. Other students access via `http://<host-ip>:8080`
3. Each user gets their own localStorage on their machine

---

## Pre-Deployment Checklist

- [ ] All files present in project structure
- [ ] Images load correctly (`images/logo.png`, etc.)
- [ ] Chart.js CDN link works (requires internet)
- [ ] Test signup, login, quiz, and results flow
- [ ] Test on mobile viewport
- [ ] Dark mode persists across pages

---

## File Structure Verification

```
InterviewAce/
├── index.html
├── login.html
├── signup.html
├── dashboard.html
├── mcq.html
├── result.html
├── notes.html
├── leaderboard.html
├── profile.html
├── css/
│   ├── style.css
│   ├── dashboard.css
│   └── auth.css
├── js/
│   ├── auth.js
│   ├── dashboard.js
│   ├── questions.js
│   ├── quiz.js
│   ├── notes.js
│   ├── leaderboard.js
│   └── analytics.js
├── images/
│   ├── logo.png
│   ├── hero-banner.jpg
│   ├── user-avatar.png
│   └── trophy.png
└── assets/
```

---

## Custom Domain Setup (Netlify Example)

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Netlify: **Domain Settings → Add custom domain**
3. Update DNS records as instructed:
   - `A` record → Netlify load balancer IP
   - Or `CNAME` → `your-site.netlify.app`
4. Enable HTTPS (automatic with Netlify)

---

## Performance Tips

1. **Self-host Chart.js** for offline use:
   - Download from [chartjs.org](https://www.chartjs.org/)
   - Place in `assets/chart.umd.min.js`
   - Update script tag in `dashboard.html`

2. **Optimize images** using tools like TinyPNG before deployment

3. **Enable caching** — add `_headers` file for Netlify:
   ```
   /*
     Cache-Control: public, max-age=3600
   /css/*
     Cache-Control: public, max-age=86400
   /js/*
     Cache-Control: public, max-age=86400
   ```

---

## Security Notes

> ⚠️ This is an educational project. For production use:
> - Never store passwords in plain text
> - Implement a real backend with hashed passwords
> - Use HTTPS always
> - Add proper authentication tokens

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Charts not loading | Check internet connection or self-host Chart.js |
| Images broken | Verify `images/` folder path is correct |
| Login not working | Clear localStorage and re-register |
| Styles not applied | Ensure CSS paths are relative, not absolute |
| Mobile sidebar stuck | Click the ☰ toggle button to close |

---

## Support

For issues during deployment, verify:
1. Browser console for JavaScript errors (F12)
2. Network tab for failed resource loads
3. Application tab for localStorage data
