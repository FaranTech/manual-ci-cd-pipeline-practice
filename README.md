# CI/CD Demo — React + Vite

A tiny weather-lookup app, built purely to practice:

- Vite + React basics
- ESLint
- Env vars (`.env` vs `.env.example`, and what "hiding" a key actually means)
- A manual GitHub Actions CI/CD pipeline (lint → build → deploy to GitHub Pages)

## 1. Run it locally

```bash
npm install
npm run dev
```

Open the printed localhost URL. You'll see "API key loaded: no" — that's expected, you haven't added one yet.

## 2. Get a free API key

This app uses [OpenWeatherMap](https://openweathermap.org/api) — free tier, no card required.
1. Sign up
2. Go to "API keys" in your account
3. Copy the key (it can take a few minutes to activate after signup)

## 3. Add it locally

Open `.env` (already created, already gitignored) and fill in:

```
VITE_WEATHER_API_KEY=paste_your_real_key_here
```

Restart `npm run dev`. Search a city — it should now return real weather.

**Why `.env` and not `.env.example`?** `.env` holds real secrets and is gitignored — it never gets committed. `.env.example` holds the same variable *names* with placeholder values, and IS committed, so anyone cloning the repo knows what env vars they need to supply.

## 4. Lint it

```bash
npm run lint
```

This runs ESLint — catches bugs and bad patterns before you ever build or deploy. Try breaking something (e.g. remove a `key` prop or leave an unused variable) and re-run to see it fail.

## 5. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cicd-demo.git
git push -u origin main
```

Run `git status` first and confirm `.env` is NOT listed as a tracked/staged file. If it shows up, something's wrong with `.gitignore` — stop and fix it before pushing.

## 6. Add your secret to GitHub (not your repo)

Repo → **Settings → Secrets and variables → Actions → New repository secret**

Add:
- `VITE_WEATHER_API_KEY` → your real key
- `VITE_WEATHER_API_URL` → optional, only if you're not using the default

These are encrypted, never shown in logs, and only injected during the workflow run — never written into the repo.

## 7. Turn on GitHub Pages

Repo → **Settings → Pages → Source: GitHub Actions**

## 8. Push again (or push any change)

The workflow at `.github/workflows/deploy.yml` runs automatically:

1. **Lint** — stops here if it fails, nothing gets deployed
2. **Build** — `npm run build`, with your secret injected as an env var only for this step
3. **Deploy** — only on a push to `main` (not on pull requests) — this is the "CD" part

Watch it run under the repo's **Actions** tab. When it finishes, your app is live at `https://YOUR_USERNAME.github.io/cicd-demo/`.

## 9. Things to actually try, to make this stick

- Push a change with a lint error (e.g. an unused variable) — confirm the workflow stops at the lint step and never deploys.
- Open your deployed site, view page source / dev tools → Sources, and find your API key in the shipped JS bundle. This is the core lesson: **anything in a Vite/React env var is public once built**, no matter how it got there. Only put keys here that are safe to expose (rate-limited, domain-restricted, read-only). A truly secret key belongs on a backend server, never in this app.
- Open a pull request instead of pushing directly to `main` — confirm lint + build run, but deploy does NOT (check the `if` condition in the workflow).
- Rename `VITE_WEATHER_API_KEY` to something else everywhere (code, `.env`, `.env.example`, GitHub secret) and confirm you understand every place a var name has to match.

## Files worth understanding

| File | Purpose | Committed? |
|---|---|---|
| `.env` | Real values for local dev | ❌ No — gitignored |
| `.env.example` | Variable names only, placeholder values | ✅ Yes |
| `.gitignore` | Tells git to ignore `.env` | ✅ Yes |
| `.github/workflows/deploy.yml` | The CI/CD pipeline definition | ✅ Yes |
| GitHub repo Secrets | Real values for CI/CD | Not a file — stored encrypted on GitHub |
