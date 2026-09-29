# Base44 Dev Environment

## Overview
This is a partial Base44 app export: custom React components (`src/Layout.jsx`, `src/components/BackgroundBubbles.jsx`), trivia data (`src/triviaQuestions.js`), and entity JSON schemas (`entities/*.json`). The repo had **no build system or entry point** — the Vite + React + Tailwind scaffolding was added to make it runnable.

## Running the app
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Vite dev server on port 3000 with HMR (live reload active)
- `npm install` runs automatically on container startup
- Source is bind-mounted; edits appear via hot reload

## Architecture
- **Frontend**: React 18 + Vite 5 + Tailwind CSS 3
- `@` path alias → `src/` (configured in `vite.config.js`)
- `src/App.jsx` — trivia game page using Layout + triviaQuestions
- `src/Layout.jsx` — theming wrapper (light/dark/colorful themes, custom colors, fonts, background image)
- `src/components/BackgroundBubbles.jsx` — animated CSS bubble background
- `entities/*.json` — Base44 entity schemas (not yet wired to a backend)

## Key files added for dev environment
- `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`
- `index.html`, `src/main.jsx`, `src/index.css`, `src/App.jsx`
- `docker-compose.base44.yml`, `.base44/environment.json`

## No external secrets required
The app runs entirely client-side. No external service credentials needed.
