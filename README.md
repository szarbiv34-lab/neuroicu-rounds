# Neuro ICU Rounding App

Neuro ICU rounding cockpit built with React + Vite. Use it locally for bedside workflows or deploy it to GitHub Pages for a quick shareable link.

## Prerequisites

- Node.js 18+ (the CI deploy job uses Node 20)
- npm 9+

## Local Development

```sh
npm install
npm run dev
```

The Vite dev server opens automatically (defaults to http://localhost:3000). If ports 3000/3001 are busy it will fall back to the next available port.

## Production Build

```sh
npm run build
```

Artifacts land in `dist/`. Serve that folder with any static host.

## GitHub Pages Deployment

This repo now ships with `.github/workflows/deploy.yml`. Every push to `main` (or a manual "Run workflow") will:

1. Install dependencies via `npm ci`
2. Build the site with `VITE_BASE_PATH=/neuroicu-rounds/` so asset URLs work under `https://<user>.github.io/neuroicu-rounds/`
3. Publish the `dist/` artifact to GitHub Pages using the official `deploy-pages` action

### Initial setup

1. Push the repo to GitHub if you have not already (`git remote add origin ... && git push -u origin main`).
2. In the GitHub UI, go to **Settings → Pages** and set the source to **GitHub Actions** (only needed once).
3. Trigger the "Deploy to GitHub Pages" workflow (push to `main` or click **Actions → Deploy to GitHub Pages → Run workflow**).

GitHub will surface the live link (for example `https://szarbiv34-lab.github.io/neuroicu-rounds/`) in the workflow summary and under **Settings → Pages**. Share that URL with your team.

> `vite.config.ts` reads from the `VITE_BASE_PATH` env var. Leave it unset for local dev (defaults to "/"), but set it to `/neuroicu-rounds/`—or whatever repo path you host under—before building for Pages.