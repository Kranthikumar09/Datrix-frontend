# MUI Migration Plan

**Phase:** 0 complete (audit only — no UI implementation changes)  
**Date:** 2026-07-12  
**Branch intent:** documentation baseline for Material UI migration while preserving current color/feel.

Companion docs:

- [`UI_COMPONENT_INVENTORY.md`](./UI_COMPONENT_INVENTORY.md)
- [`BRAND_AUDIT.md`](./BRAND_AUDIT.md)
- Existing planning note: [`PHASE_PLAN.md`](./PHASE_PLAN.md) (superseded in detail by this plan for MUI work)

---

## Phase 0 report

### Baseline install

```bash
npm ci
```

- Result: **success** (exit 0)
- Added/audited **1400** packages from existing `package-lock.json`
- npm reported **61** preexisting dependency vulnerabilities (13 low, 18 moderate, 28 high, 2 critical) — recorded only; not fixed in Phase 0
- Deprecated transitive CRA toolchain packages warned as expected

### Baseline test result

```bash
npm test -- --watchAll=false
```

| Item | Result |
|---|---|
| Exit code | **1** |
| Cause | **No tests found** (0 files matching CRA test patterns under `src/`) |
| Files checked | 50 |
| Pre-existing? | **Yes** — not introduced by Phase 0 |

Note: CRA suggests `--passWithNoTests` to exit 0; the mandated command exits 1 with no suites.

### Baseline build result

```bash
npm run build
```

| Item | Result |
|---|---|
| Exit code | **0** |
| Compile | **Compiled with warnings** |
| Output | `build/` (gitignored); main JS ~273.69 kB gzip, CSS ~35.44 kB gzip |
| Warning class | ESLint: `no-unused-vars`, `react-hooks/exhaustive-deps`, one `jsx-a11y/no-redundant-roles` |
| Files with warnings | App, Login, SignupForm, SEO, Footer, Testimonial, Blog(s), Contact, Home, Study, StudyFilter, TravelForm, Work, WorkFilter, ApplicationForm, AppliedJobs, EditStudy/Work, JobApplyForm, MyAccount, Study/Work applications + details, UploadDocuments |

These lint warnings are **pre-existing** and do not fail the production build.

### Complete page inventory

See [`UI_COMPONENT_INVENTORY.md`](./UI_COMPONENT_INVENTORY.md) §1–2.

Summary: **33 routed screens** (public + auth + protected), plus Header/Footer/SEO/layout sections and `Sidebar`.

### Complete UI dependency inventory

See [`UI_COMPONENT_INVENTORY.md`](./UI_COMPONENT_INVENTORY.md) §3–4.

Summary of replaceable shells:

| Current | Planned MUI approach |
|---|---|
| Bootstrap CDN (nav, accordion, offcanvas, tabs, tables, spinners, forms) | Core MUI layout + components; remove CDN gradually |
| Font Awesome CDN | `@mui/icons-material` |
| Native inputs/selects | `TextField` / `Select` / wrappers |
| `react-select` | `Autocomplete` |
| `react-datepicker` | `@mui/x-date-pickers` + `dayjs` (install only when migrating dates) |
| `react-toastify` | `Snackbar` + `Alert` |
| Custom/Bootstrap modals | `Dialog` |
| Bootstrap navbar collapse / offcanvas | `Drawer` / `Menu` / `AppBar` |
| Loading text/spinners | `CircularProgress` / `Skeleton` |
| Native tables | `Table` |
| `react-slick` | **Keep until Partner/Testimonial pages are stable** |
| `intl-tel-input` | Keep temporarily; theme the shell |

### Branding-search results

See [`BRAND_AUDIT.md`](./BRAND_AUDIT.md).

Highlights:

- Visible brand is still **Study Traveler**
- Package name is **flyabroad**
- APIs/assets on **express.studytraveler.com**
- CRA placeholders remain in `public/index.html` / `manifest.json`
- **No Datrix palette** in repo — preserve current red/navy color direction in the first MUI pass

### Proposed migration order

See § “Proposed migration phases” below.

### Risks and blockers

See § “Risks and blockers” below.

**Phase 0 stop condition:** met. No UI code, dependency adds for MUI, or branding string changes were made.

---

## Goals (subsequent phases)

1. Adopt Material UI components without changing the existing visual color/feel in the first pass.
2. Install only dependencies needed for the active phase.
3. Centralize theme tokens and branding configuration.
4. Prefer Theme overrides + reusable wrappers; use `sx` sparingly for isolated layout; leave unmigrated CSS in place until ownership moves.

---

## Target structure (create in Phase 1+)

```text
src/
  theme/
    theme.js
    componentOverrides.js
  components/
    ui/
      AppButton.js
      AppTextField.js
      AppSelect.js
      AppSnackbar.js
      LoadingState.js
      ErrorState.js
      EmptyState.js
      PageContainer.js
      PageHeader.js
  config/
    brand.js
    config.js          # already exists (API baseURL)
```

Initial install (Phase 1):

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

Date pickers only when a date field is migrated:

```bash
npm install @mui/x-date-pickers dayjs
```

---

## Theme token checklist

Preserve current palette unless/until Datrix tokens are approved:

- Primary / secondary colors (`#E2403C`, `#000418` as starting points)
- Background colors
- Text colors
- Typography (Montserrat / Plus Jakarta Sans currently; avoid inventing a new look)
- Button styles (`.color-btn` / `.border-btn` equivalents)
- Border radius, shadows, form-control heights
- Breakpoints, container widths
- Focus states
- Error / warning / info / success

Wire `ThemeProvider` + `CssBaseline` at the app root once MUI is introduced.

---

## Proposed migration phases

### Phase 1 — Foundation (no page redesign)

1. Install initial MUI packages only.
2. Add `theme/theme.js`, `theme/componentOverrides.js`, `config/brand.js`.
3. Wrap app with `ThemeProvider` + `CssBaseline` without removing Bootstrap yet.
4. Add reusable `components/ui/*` shells.
5. Optionally introduce `AppSnackbar` beside Toastify (dual-run) or replace ToastContainer in a follow-up PR.

**Exit criteria:** App builds; visual look unchanged; MUI theme tokens match current CSS colors.

### Phase 2 — App chrome

1. Migrate `Header` → `AppBar` / `Toolbar` / `Drawer` / `Menu`.
2. Migrate `Footer` video modal → `Dialog`; keep layout feel.
3. Replace Font Awesome in `Sidebar` with MUI icons; evolve sidebar toward `Drawer` + `List`.
4. Replace scroll-to-top native button with `IconButton` if straightforward.

**Exit criteria:** Nav/drawer work on mobile/desktop; Bootstrap navbar collapse no longer required for header.

### Phase 3 — Cross-cutting feedback & forms primitives

1. Replace `react-toastify` with `AppSnackbar` globally.
2. Roll `AppTextField` / `AppSelect` / `AppButton` through auth forms (Login, Signup, Forgot, Reset, Verify).
3. Contact form: TextField/Select/Button; keep `intl-tel-input` but theme adjacent controls.
4. Shared `LoadingState` / `ErrorState` / `EmptyState` adopted on a few pilot pages.

**Exit criteria:** Auth + Contact no longer depend on Toastify; native form controls reduced on those pages.

### Phase 4 — Marketing pages (stable content first)

Order: About → FAQ (`Accordion`/`Tabs`) → Blog list/detail (`Pagination`, `Card` where appropriate) → Terms/Privacy → WhyChoose Study/Work → Study/Work landings → Home composition sections.

Defer `react-slick` (PartnerSection, Testimonial) until those sections are otherwise stable.

**Exit criteria:** Marketing routes use MUI layout primitives; existing colors preserved.

### Phase 5 — Filter / catalog experiences

1. StudyFilter / WorkFilter: `Accordion`, `Checkbox`, `Drawer` (replace offcanvas), `Pagination`, `Breadcrumbs`.
2. StudyDetails / WorkDetails: `Table`, `Breadcrumbs`, `Button`.

**Exit criteria:** Filters usable without Bootstrap collapse/offcanvas.

### Phase 6 — User panel

1. ApplicationForm: replace `react-select` with `Autocomplete`; native selects → MUI; file fields themed.
2. Edit Study/Work applications; MyAccount; JobApplyForm; UploadDocuments.
3. List/detail tables → MUI `Table`; status chips → `Chip`.
4. TravelForm: Autocomplete + **then** install MUI X Date Pickers for the date field; retire `react-datepicker`.

**Exit criteria:** Panel flows consistent with theme; Toastify/react-select removed.

### Phase 7 — Cleanup

1. Remove Bootstrap CDN and Font Awesome CDN when unused.
2. Delete dead CSS rules for migrated classes; keep only unmigrated leftovers.
3. Branding cutover to Datrix via `brand.js` when approved (separate from component migration if needed).
4. Add smoke tests so `npm test` is meaningful.

---

## Dependency install policy

| Phase | Install |
|---|---|
| 0 | Lockfile only (`npm ci`) — **done** |
| 1 | `@mui/material` `@emotion/react` `@emotion/styled` `@mui/icons-material` |
| 6 (date field) | `@mui/x-date-pickers` `dayjs` |
| Never early | Do not add MUI X packages “just in case” |
| Carousel | Do not replace `react-slick` until Partner/Testimonial pages are stable |

---

## Risks and blockers

| Risk / blocker | Impact | Mitigation |
|---|---|---|
| No automated tests | Regressions during migration hard to detect | Add smoke/render tests starting Phase 1–2 |
| Bootstrap CDN tightly coupled | Dual CSS conflicts with MUI CssBaseline | Migrate chrome first; remove CDN only when selectors unused |
| Hardcoded Study Traveler + API hosts | Brand/domain cutover incomplete if only UI components change | Follow `BRAND_AUDIT.md`; separate display brand from API hosts |
| No Datrix palette | Cannot finalize “Datrix look” | Preserve current colors until palette approved |
| `intl-tel-input` has no MUI twin | Inconsistent phone field chrome | Theme wrapper; defer full replacement |
| `react-slick` deferred | Partner/Testimonial keep slick CSS | Isolate slick styles; migrate last |
| Backend-driven SEO/copy | API can reintroduce old brand strings | Coordinate CMS/backend updates |
| Preexisting ESLint warnings | Noise in CI/build logs | Clean opportunistically; do not block Phase 0 |
| `homepage` = studytraveler.com | Wrong asset prefix if hosted elsewhere | Update with domain cutover |
| Large CSS surface (~219+ classes) | Easy to leave orphan styles | Map class ownership during each page PR |
| React 19 + MUI version matrix | Possible peer dependency friction | Pin compatible MUI v6/v7 during Phase 1 install and verify build |

---

## Non-goals for early phases

- Visual redesign / new Datrix look-and-feel before palette approval
- Replacing `react-slick` early
- Installing MUI X before a real date-field migration
- Rewriting backend URLs without an environment cutover plan
- Editing `src.zip` or relying on `build-old` as source of truth

---

## Phase 0 deliverables checklist

- [x] Install from lockfile
- [x] Record baseline test result
- [x] Record baseline build result
- [x] Page inventory
- [x] UI dependency inventory
- [x] Branding search + classification
- [x] Proposed migration order
- [x] Risks and blockers
- [x] `MUI_MIGRATION_PLAN.md` (this file)
- [x] `BRAND_AUDIT.md`
- [x] `UI_COMPONENT_INVENTORY.md`
- [x] **Stop after Phase 0** (no UI implementation changes)
