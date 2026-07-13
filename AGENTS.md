# AGENTS.md

## Cursor Cloud specific instructions

### Overview
This repo (`datrix-consulting-frontend` / **Datrix Consulting**) is a single **Create React App** (react-scripts 5, React 19) SPA — a study/work-abroad consultancy site. There is no backend in this repo; the client calls a remote Express API configured via environment variables in `src/config/config.js` (`REACT_APP_API_BASE_URL`, `REACT_APP_ASSET_BASE_URL`, `REACT_APP_PUBLIC_SITE_URL`). There is **no hardcoded production API domain** in application code.

### Run / lint / test / build
Standard CRA scripts in `package.json`:
- Run (dev): `npm start` → serves at http://localhost:3000. Set `BROWSER=none` to avoid the auto-open attempt in headless environments.
- Lint: no dedicated lint script; ESLint (`react-app` config) runs automatically during `npm start` / `npm run build` and prints warnings to the console. There are many pre-existing `no-unused-vars` / `react-hooks/exhaustive-deps` warnings — they are non-blocking and compilation still succeeds.
- Test: `CI=true npm test` (Jest via react-scripts). No test files currently exist, so it exits reporting "No tests found".
- Build: `npm run build` (production bundle; not needed for development).

### Non-obvious caveats
- The configured API host (set via `REACT_APP_API_BASE_URL`) may be unreachable from some environments. When it is down, backend-dependent flows (login/signup, study/work listings, dropdowns populated from `/countries/get`, form submissions) will fail or render empty. This is an external dependency, not a repo/setup problem. Client-side pages and client-side form validation still work and are the reliable way to smoke-test the app.
- OAuth client IDs (Google/Facebook) are hardcoded in `src/auth/Login.js` and `src/auth/SignupForm.js`; social login only works on approved origins.
- Copy `.env.example` to `.env.local` and set `REACT_APP_API_BASE_URL`, `REACT_APP_ASSET_BASE_URL`, and `REACT_APP_PUBLIC_SITE_URL` for local development.
