# MUI Migration Plan — Datrix Consulting Frontend

**Repository:** https://github.com/Kranthikumar09/Datrix-frontend  
**Current phase status:** Phase 0 complete (audit only — no UI implementation changes)  
**Date:** 2026-07-12  

Companion docs:

- [`UI_COMPONENT_INVENTORY.md`](./UI_COMPONENT_INVENTORY.md)
- [`BRAND_AUDIT.md`](./BRAND_AUDIT.md)
- Existing planning note: [`PHASE_PLAN.md`](./PHASE_PLAN.md) (superseded in detail by this plan)

---

## Primary objective

Incrementally migrate the frontend UI from custom HTML, Bootstrap, Font Awesome and other replaceable UI controls to Material UI.

The new application and company name is:

**Datrix Consulting**

Remove all references to the previous application branding from the repository, including visible text, metadata, fallback values, package metadata, images, generated artifacts and configuration.

This must be completed safely in small phases. **Do not perform a single large rewrite.**

---

## Critical operating rule

Complete **only one phase at a time**.

At the end of every phase:

1. Run the required tests and production build.
2. Report every changed file.
3. Explain what was migrated.
4. List remaining legacy UI dependencies.
5. List any risks or blockers.
6. Show the exact manual test cases completed.
7. **Stop and wait** for the instruction: `Continue to Phase X`.
8. **Do not begin the next phase automatically.**

---

## Non-negotiable requirements

- Preserve all existing routes.
- Preserve authentication and protected-route behavior.
- Preserve API request payloads and response handling.
- Preserve validation rules.
- Preserve upload restrictions.
- Preserve navigation behavior.
- Preserve API error handling.
- Preserve responsive behavior.
- Do not change backend contracts.
- Do not change business rules while migrating the UI.
- Do not upgrade React, React Router, React Scripts or unrelated libraries as part of this work.
- Do not rewrite the project in TypeScript.
- Do not migrate to Vite, Next.js or another build system.
- Do not remove Bootstrap globally until all Bootstrap-dependent pages are migrated.
- Do not remove a legacy dependency until repository search confirms there are no remaining imports or usages.
- Do not silently substitute a guessed Datrix API domain.
- Do not change the design into a completely different website. Preserve the existing content hierarchy and functionality while improving consistency, accessibility and responsiveness.
- Do not use arbitrary colors, spacing and font sizes throughout individual files. Centralize visual decisions in the Material UI theme.
- Do not add charts, maps or new product features that are unrelated to the migration.

---

## Preliminary repository observations (verified in Phase 0)

| Observation | Verified? | Evidence |
|---|---|---|
| Create React App | Yes | `react-scripts`, `public/index.html`, CRA scripts |
| React 19 | Yes | `package.json` → `react` / `react-dom` `^19.0.0` |
| React Router | Yes | `react-router-dom` `^7.4.0`, routes in `src/App.js` |
| Axios | Yes | Used across Header/Footer and many pages |
| Bootstrap via `public/index.html` | Yes | Bootstrap 5.3.3 CSS + JS CDN |
| Font Awesome via `public/index.html` | Yes | Font Awesome 6.7.2 CDN |
| Large custom stylesheets | Yes | `src/assets/css/style.css`, `responsive.css` |
| `react-select` | Yes | `ApplicationForm.js`, `TravelForm.js` |
| `react-datepicker` | Yes | `TravelForm.js` |
| `react-toastify` | Yes | App shell + ~23 feature files |
| `react-slick` | Yes | `PartnerSection.js`, `Testimonial.js` |
| `intl-tel-input` | Yes | Contact, TravelForm, SignupForm, MyAccount |
| Shared Header and Footer | Yes | `src/components/common/` |
| Public marketing pages | Yes | Home, About, Contact, FAQ, Blog, Study, Work, etc. |
| Authentication pages | Yes | Login, Signup, Verify, Forgot, Reset |
| Protected user-panel pages | Yes | Applications, Applied Jobs, Upload Documents, My Account |
| Multi-step application forms | Yes | `ApplicationForm.js` |
| File-upload controls | Yes | ApplicationForm, JobApplyForm, UploadDocuments, MyAccount, EditWork |
| Data lists and application-detail pages | Yes | Study/Work applications + details, AppliedJobs |

Full inventory: [`UI_COMPONENT_INVENTORY.md`](./UI_COMPONENT_INVENTORY.md).

---

## Material UI approach

Install **only** the dependencies needed for the current phase.

### Initial dependencies (Phase 1)

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

### MUI X (only when date fields are migrated)

```bash
npm install @mui/x-date-pickers dayjs
```

### Preferred MUI components

`ThemeProvider`, `CssBaseline`, `Box`, `Container`, `Stack`, `Grid`, `Paper`, `Card`, `Typography`, `Button`, `IconButton`, `Link`, `AppBar`, `Toolbar`, `Drawer`, `List`, `ListItemButton`, `Menu`, `MenuItem`, `TextField`, `Select`, `Autocomplete`, `FormControl`, `FormLabel`, `RadioGroup`, `Checkbox`, `Switch`, `Tabs`, `Table`, `Chip`, `Avatar`, `Dialog`, `Accordion`, `Snackbar`, `Alert`, `CircularProgress`, `Skeleton`, `Tooltip`, `Breadcrumbs`, `Pagination`.

Use the most appropriate component rather than forcing every HTML element into an MUI component.

Specialized libraries without a suitable core MUI replacement may remain temporarily, but their visible shell should match the MUI theme.

### Replacement examples

| Current | Target |
|---|---|
| `react-select` | MUI `Autocomplete` or `Select` |
| Native text fields | MUI `TextField` |
| Toastify notifications | MUI `Snackbar` + `Alert` |
| Font Awesome icons | `@mui/icons-material` |
| Bootstrap modal behavior | MUI `Dialog` |
| Bootstrap navigation collapse | MUI `Drawer` or `Menu` |
| Native loading messages | `CircularProgress` or `Skeleton` |
| Alerts | MUI `Alert` |
| Native data tables | MUI `Table` |
| Datepicker controls | MUI X Date Pickers **only when date fields are encountered** |
| `react-slick` | **Do not replace until the pages using it are stable** (no direct MUI carousel) |

---

## Styling architecture

Create the following structure:

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
    config.js
```

### Centralized branding

```js
export const BRAND = {
  name: "Datrix Consulting",
  shortName: "Datrix",
  defaultTitle: "Datrix Consulting",
  defaultDescription: "",
  copyright: `Copyright © ${new Date().getFullYear()} Datrix Consulting. All Rights Reserved.`,
};
```

Do not duplicate the application name throughout the codebase when it can be read from the centralized branding configuration.

Preserve the current color direction during the first migration pass unless an approved Datrix brand palette is already present in the repository. **Phase 0 finding:** no approved Datrix palette exists; preserve `#E2403C` / `#000418` direction.

### Theme tokens

Create tokens for:

- Primary and secondary colors
- Background colors
- Text colors
- Typography
- Button styles
- Border radius
- Shadows
- Form-control heights
- Breakpoints
- Container widths
- Focus states
- Error, warning, info and success states

### Styling rules

- Theme component overrides for application-wide styling.
- Reusable styled components for patterns used in multiple places.
- `sx` for isolated layout adjustments.
- Existing CSS only for elements that have not yet been migrated.
- Avoid creating hundreds of one-off `sx` objects with duplicated values.

---

# Phase 0 — Audit and baseline

**Status:** COMPLETE  
**UI changes:** None

## Tasks

- Install dependencies using the existing lockfile.
- Run:
  - `npm test -- --watchAll=false`
  - `npm run build`
- Record any pre-existing errors separately.
- Inventory every page, shared component, UI library and stylesheet.
- Create:
  - `MUI_MIGRATION_PLAN.md`
  - `BRAND_AUDIT.md`
  - `UI_COMPONENT_INVENTORY.md`
- Identify: native inputs, native selects, react-select, datepickers, buttons, tables, modals, toasts, accordions, sidebars, navigation menus, cards, loading/empty/error states, file uploads.
- Map every current CSS class to its owning component where practical.
- Identify API and asset URLs separately from visible branding.

## Mandatory branding search

```bash
rg -ni \
  "study[[:space:]_-]*traveler|studytraveler|fly[[:space:]_-]*abroad|flyabroad|express\.studytraveler\.com|info@studytraveler\.com" \
  .

rg -ni "React App|Create React App Sample|Web site created using create-react-app" .
```

Classify each match as: Visible branding, SEO metadata, Package metadata, API endpoint, Asset endpoint, Email/contact fallback, Static image, Generated build artifact, Archived source artifact, Documentation, Backend-provided content.

Do not modify anything yet.

## Phase 0 deliverable / report

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
- Archived/generated: `build-old/`, `src.zip`, `build/` retain old branding

### Proposed migration order

Phase 1 foundation → Phase 2 shell → Phase 3 auth → Phase 4 marketing → Phase 5 study/work browsing → Phase 6 user-panel shell → Phase 7 forms/uploads → Phase 8 lists/details → Phase 9 dependency/CSS cleanup → Phase 10 final audit.

### Risks and blockers (Phase 0)

| Risk / blocker | Impact | Mitigation |
|---|---|---|
| No automated tests | Regressions hard to detect | Add smoke/render tests in later phases |
| Bootstrap CDN tightly coupled | Dual CSS conflicts with MUI CssBaseline | Migrate chrome first; remove CDN only when unused |
| Hardcoded Study Traveler + API hosts | Incomplete cutover if only components change | Follow brand audit; env-based config in Phase 1 |
| No Datrix palette | Cannot finalize Datrix visual identity | Preserve current colors until palette approved |
| `intl-tel-input` has no MUI twin | Inconsistent phone chrome | Theme wrapper; defer full replacement |
| `react-slick` deferred | Partner/Testimonial keep slick CSS | Isolate slick styles; migrate last |
| Backend-driven SEO/copy | API can reintroduce old brand | Coordinate CMS/backend updates |
| Preexisting ESLint warnings | Noise in build logs | Clean opportunistically; do not block Phase 0 |
| `homepage` = studytraveler.com | Wrong asset prefix on new domain | Update with domain cutover |
| Large CSS surface (~219+ classes) | Orphan styles | Map class ownership during each page PR |
| React 19 + MUI peer matrix | Install friction | Pin compatible MUI during Phase 1 and verify build |

### Phase 0 changed files

- `MUI_MIGRATION_PLAN.md` (created)
- `BRAND_AUDIT.md` (created)
- `UI_COMPONENT_INVENTORY.md` (created)

### Phase 0 stop

**Stopped after Phase 0.** No UI implementation changes. Await instruction: `Continue to Phase 1`.

---

# Phase 1 — Material UI foundation and branding

**Status:** NOT STARTED — wait for `Continue to Phase 1`

## Tasks

1. Install Material UI, Emotion and Material Icons.
2. Create the centralized theme.
3. Add `ThemeProvider` and `CssBaseline` at the application root.
4. Create the reusable UI components listed earlier.
5. Update:
   - `package.json`
   - `package-lock.json`
   - `public/index.html`
   - `public/manifest.json`
   - `src/components/SEO.js`
   - branding configuration
6. Change package metadata from the old project identity to an appropriate Datrix frontend package name such as:

```json
"name": "datrix-consulting-frontend"
```

7. Change the browser title and manifest identity to Datrix Consulting.
8. Replace SEO fallback titles and descriptions with Datrix Consulting.
9. Replace old Open Graph and canonical frontend URLs with environment-based frontend configuration.
10. Replace all visible fallback copyright and contact branding.

## API and asset URL rule

The old domain is currently used for operational API and image requests.

- **Do not invent replacement URLs.**
- Refactor hard-coded service URLs into environment variables:
  - `REACT_APP_API_BASE_URL`
  - `REACT_APP_ASSET_BASE_URL`
  - `REACT_APP_PUBLIC_SITE_URL`
- Update `src/config/config.js` so all components consume centralized configuration.
- Create `.env.example` using non-production placeholders:

```env
REACT_APP_API_BASE_URL=https://api.example.com/backend/api
REACT_APP_ASSET_BASE_URL=https://assets.example.com
REACT_APP_PUBLIC_SITE_URL=https://www.example.com
```

- Do not commit credentials.
- When a required variable is missing:
  - Show a clear development warning.
  - Avoid silently calling an incorrect domain.
- Document the required deployment variables.

## Generated artifacts

Inspect:

- `build-old/`
- `src.zip`

These appear to be archived or generated copies that may retain old branding.

If they are not required source files:

- Remove them from version control.
- Add appropriate entries to `.gitignore`.
- Document why they were removed.

Do not retain old branding inside archived copies when the requirement is zero old-brand references.

## Acceptance criteria

- Application builds.
- `ThemeProvider` is active.
- Existing pages still render.
- Datrix Consulting appears in browser and metadata.
- No visible old branding remains in the migrated foundation.
- API configuration is centralized.
- No guessed production endpoint is introduced.

**Stop after Phase 1.**

---

# Phase 2 — Shared Header, Footer and application shell

**Status:** NOT STARTED — wait for `Continue to Phase 2`

## Target files

Start with:

- `src/components/common/Header.js`
- `src/components/common/Footer.js`
- `src/App.js`
- Scroll-to-top button
- Common page wrappers

## Header migration

Replace Bootstrap navigation with:

- `AppBar`, `Toolbar`, `Container`, `Button`, `IconButton`, `Menu`, `Drawer`, `List`, Material icons

Requirements:

- Preserve every current route.
- Preserve authenticated and unauthenticated actions.
- Preserve logout behavior.
- Preserve active-route highlighting.
- Preserve mobile navigation.
- Ensure keyboard navigation.
- Ensure the mobile drawer closes after navigation.
- Do not manipulate Bootstrap toggler elements through `document.querySelector`.

## Footer migration

Use:

- `Box`, `Container`, `Grid`, `Stack`, `Typography`, MUI `Link`, `Dialog` for video content, Material icons where appropriate

- Remove Study Traveler fallback email, copyright and text.
- Do not overwrite legitimate content returned by the backend, but document that backend-managed content may also need rebranding in the backend/CMS.

## Application shell

- Replace the native scroll-to-top button with MUI `Fab` or `IconButton`.
- Create reusable:
  - Page container
  - Section container
  - Page heading
  - Loading state
  - Error state
  - Empty state

## Acceptance criteria

- Desktop header works.
- Mobile header works.
- All links work.
- Authentication actions work.
- Footer links work.
- Footer dialog works.
- No Bootstrap JS is required by the migrated shell.
- No Font Awesome icons remain in migrated components.
- No old branding remains in shared layout.

**Stop after Phase 2.**

---

# Phase 3 — Authentication pages

**Status:** NOT STARTED — wait for `Continue to Phase 3`

## Target files

Migrate:

- `Login.js`
- `Signup.js`
- `SignupForm.js`
- `ForgotPassword.js`
- `ResetPassword.js`
- `VerifyEmail.js`
- Google login presentation
- Facebook login presentation

## Components

Use: `Container`, `Paper`, `Stack`, `Typography`, `TextField`, `InputAdornment`, `IconButton`, `Button`, `Checkbox`, `FormControlLabel`, `Divider`, `Alert`, `CircularProgress`, `Link`

## Requirements

- Preserve OAuth logic.
- Preserve validation.
- Preserve redirect behavior.
- Preserve password visibility behavior.
- Preserve error messages.
- Preserve disabled/loading states.
- Do not expose authentication tokens.
- Improve labels and autocomplete attributes.
- Ensure errors are associated with their input controls.
- Replace Toastify notifications used by these pages with the shared MUI Snackbar implementation.

## Acceptance criteria / manual tests

Test:

- Successful login
- Invalid login
- Empty fields
- Password visibility
- Forgot password
- Reset password
- Verification state
- Signup validation
- OAuth buttons
- Redirects for authenticated users

**Stop after Phase 3.**

---

# Phase 4 — Public marketing pages

**Status:** NOT STARTED — wait for `Continue to Phase 4`

Migrate in this **exact order**:

1. Home
2. About
3. Contact
4. FAQ
5. Blog
6. Blog Details
7. Privacy Policy
8. Terms and Conditions
9. Travel Form
10. Shared landing-page sections

## Home

- Use MUI layout primitives, cards, buttons and typography.
- Replace visible old-name content including:
  - Hero headings
  - “Why choose” text
  - Calls to action
  - Image alt text containing old branding
- Preserve the existing information architecture.

## About

- Replace “About Study Traveler” and all old-name content with Datrix Consulting.
- Use Cards, Paper, Grid and Typography for mission, vision and values.

## Contact

- Migrate the form to MUI.
- Preserve:
  - Honeypot behavior
  - Phone validation
  - Country-code logic
  - Existing API request
  - Subject options
  - Social links
- `intl-tel-input` may remain temporarily if replacing it would alter phone-number behavior. Style its container to match MUI and document it as a remaining specialized dependency.

## FAQ

- Use MUI `Accordion`.

## Blog pages

- Use MUI Cards, Chips, Typography, Skeletons and Pagination as appropriate.

## Legal pages

- Use MUI loading, error and content states.
- Do not inject untrusted HTML without reviewing how the backend content is sanitized.

## Acceptance criteria

- Every migrated public page works at mobile, tablet and desktop widths.
- No old visible branding remains.
- No Bootstrap layout classes remain in migrated pages.
- API-backed content continues loading.
- Contact submissions still work.
- Loading, empty and error states are consistent.

**Stop after Phase 4.**

---

# Phase 5 — Study and work browsing

**Status:** NOT STARTED — wait for `Continue to Phase 5`

## Target pages

- Study
- StudyFilter
- StudyDetails
- WhyChooseStudy
- Work
- WorkFilter
- WorkDetails
- WhyChooseWork

## Components

Use: `Card`, `CardContent`, `CardActions`, `Autocomplete`, `Select`, `Chip`, `Accordion`, `Breadcrumbs`, `Pagination`, `Skeleton`, `Drawer` for mobile filters, `Alert`, `Button`, `Typography`

## Requirements

- Preserve query parameters.
- Preserve current filtering logic.
- Preserve pagination.
- Preserve API requests.
- Preserve empty-result handling.
- Preserve detail routes.
- Replace `react-select` where used.
- Make filters keyboard accessible.
- Use a mobile filter `Drawer` rather than squeezing desktop filters into the viewport.

**Stop after Phase 5.**

---

# Phase 6 — Protected user-panel shell

**Status:** NOT STARTED — wait for `Continue to Phase 6`

## Target files

Begin with:

- `Sidebar.js`
- Common protected-page wrapper
- User profile heading
- Navigation structure

## Migration

Replace the sidebar with:

- Permanent MUI `Drawer` on larger screens
- Temporary MUI `Drawer` on smaller screens
- `List`, `ListItemButton`, `ListItemIcon`, `ListItemText`, `Divider`, MUI icons

Preserve all current user-panel routes and active-route logic.

Create a reusable protected-page layout so individual pages do not duplicate sidebar and container markup.

## Acceptance criteria

- Profile navigation works.
- Study application navigation works.
- Work application navigation works.
- Applied jobs navigation works.
- Document navigation works.
- Mobile drawer works.
- Focus is managed correctly.
- Current route is visually and programmatically identifiable.

**Stop after Phase 6.**

---

# Phase 7 — User profile, forms and document upload

**Status:** NOT STARTED — wait for `Continue to Phase 7`

Migrate **one page at a time**:

1. MyAccount
2. ApplicationForm
3. JobApplyForm
4. EditStudyApplication
5. EditWorkApplication
6. UploadDocuments

## Multi-step form requirements

Use: MUI `Stepper`, `Step`, `StepLabel`, `TextField`, `Autocomplete`, `Select`, `RadioGroup`, `FormControl`, `FormHelperText`, `Button`, `LinearProgress`, `Alert`, `Paper`

Preserve:

- Every field name
- Every request property
- Required-field behavior
- Existing conditional study/work sections
- File-size restrictions
- File-type restrictions
- Resume and cover-letter handling
- Existing backend payload formats
- Previous/Continue behavior
- Existing API-loaded dropdown values

The existing `ApplicationForm` is large. **Do not rewrite it in one change.**

Break it into focused components such as:

```text
application-form/
  ApplicationForm.js
  PurposeStep.js
  CountryStep.js
  ProfileSummaryStep.js
  StudyDetailsStep.js
  WorkDetailsStep.js
  FileUploadField.js
  formValidation.js
  applicationFormMapper.js
```

Extract components without changing data behavior.

Add tests around payload mapping and conditional validation before restructuring complex form logic.

## File uploads

Use a visually accessible MUI upload area, but retain a native file input internally.

Ensure:

- Keyboard activation
- File name display
- Remove/replace action
- Type and size errors
- Disabled state
- Upload progress when available

**Stop after Phase 7.**

---

# Phase 8 — Application lists and details

**Status:** NOT STARTED — wait for `Continue to Phase 8`

## Migrate

- StudyApplications
- StudyApplicationsDetails
- WorkApplications
- WorkApplicationsDetails
- AppliedJobs

## Components

Use:

- MUI `Table` for desktop
- Card-based rendering for narrow mobile screens when a table becomes unusable
- `Chip` for status
- `Dialog` for confirmations
- `Skeleton` for loading
- `Alert` for API failures
- `EmptyState` for no records
- Pagination where needed

## Preserve

- View actions
- Edit actions
- Status values
- Date formatting
- IDs
- Existing API calls
- Existing route parameters

**Stop after Phase 8.**

---

# Phase 9 — Legacy dependency and CSS cleanup

**Status:** NOT STARTED — wait for `Continue to Phase 9`

Only begin this after all pages have been migrated.

## Dependency audit

Search for imports and runtime usage of:

- Bootstrap
- Font Awesome
- `react-select`
- `react-datepicker`
- `react-toastify`
- `intl-tel-input`
- `react-slick`
- `slick-carousel`

Remove a dependency only when zero valid usage remains.

## Bootstrap removal

After confirming no component relies on Bootstrap:

- Remove Bootstrap CSS CDN.
- Remove Bootstrap JavaScript CDN.
- Remove Bootstrap-specific markup and data attributes.
- Remove Bootstrap utility classes from JSX.
- Replace remaining layout utilities with MUI.

## Font Awesome removal

After replacing all icons:

- Remove Font Awesome CDN.
- Remove `<i className="fa-...">` elements.

## CSS cleanup

Do not delete both legacy stylesheets at once.

For every CSS selector:

- Confirm its owning component has migrated.
- Remove unused selectors.
- Preserve non-MUI styles still needed for specialized content.
- Move global resets into `CssBaseline`.
- Move global theme styling into component overrides.
- Move page-specific layout into the page component or reusable styled component.

Use a dead-CSS analysis tool only as supporting evidence; manually verify dynamically generated class names.

## Acceptance criteria

- No Bootstrap runtime.
- No Font Awesome runtime.
- No unused UI dependencies.
- No obsolete CSS selectors.
- No old branding in archived/generated content.
- Production build succeeds.

**Stop after Phase 9.**

---

# Phase 10 — Final branding, accessibility and regression audit

**Status:** NOT STARTED — wait for `Continue to Phase 10`

## Zero-old-brand audit

Run:

```bash
rg -ni \
  "study[[:space:]_-]*traveler|studytraveler|fly[[:space:]_-]*abroad|flyabroad|express\.studytraveler\.com|info@studytraveler\.com" \
  .
```

The expected result is **zero matches**, excluding only Git history, which is outside the working tree.

Also inspect:

- Image filenames
- Image contents
- Favicons
- Logo files
- Alt text
- Browser title
- Manifest
- Metadata
- Open Graph tags
- Twitter metadata
- API configuration
- Asset configuration
- README
- Package metadata
- Lockfile
- Comments
- Tests
- Fixtures
- Generated build output
- Archived files

## Backend-content warning

Header, Footer, SEO and legal content may be returned by APIs or a CMS.

Frontend search cannot guarantee that the backend database no longer returns Study Traveler content.

Document all backend-managed fields that must be changed by the backend or CMS team.

## Accessibility checks

Verify:

- Keyboard-only navigation
- Visible focus
- Form labels
- Error associations
- Dialog focus trapping
- Drawer focus handling
- Heading order
- Landmark elements
- Image alt text
- Color contrast
- Touch target size
- Screen-reader names
- Reduced-motion behavior

## Responsive checks

Test at minimum:

- 320px
- 375px
- 768px
- 1024px
- 1440px

## Functional regression checklist

Test:

- Home navigation
- Study browsing
- Work browsing
- Filters
- Detail pages
- Contact submission
- Signup
- Login
- Logout
- Forgot password
- Reset password
- Protected routes
- User profile
- Application creation
- Application editing
- File upload
- Applied jobs
- Study application list and details
- Work application list and details
- Legal pages
- Blog pages
- Mobile navigation

## Required commands

```bash
npm test -- --watchAll=false
npm run build
```

Run any additional lint or test commands that are already supported by the project.

Do not suppress warnings simply to obtain a green build. Fix warnings caused by the migration.

## Final deliverables

Produce:

- Final changed-file summary
- Dependency changes
- Removed legacy dependencies
- Remaining specialized dependencies and justification
- Branding audit result
- Accessibility audit result
- Responsive-test result
- Functional regression result
- Environment-variable documentation
- Backend/CMS changes still required
- Known issues
- Recommended follow-up work

## Definition of done

The task is complete only when:

- All intended UI areas use Material UI.
- Existing business behavior is preserved.
- All routes continue functioning.
- The production build succeeds.
- Tests succeed.
- Bootstrap and Font Awesome are removed when no longer needed.
- Old branding has zero matches in the working repository.
- The application consistently displays Datrix Consulting.

---

## End-of-phase reporting template

Use this template at the end of every phase (Phases 1–10):

```markdown
### Phase X completion report

**Changed files:**
- ...

**What was migrated:**
- ...

**Remaining legacy UI dependencies:**
- ...

**Risks / blockers:**
- ...

**Commands run:**
- npm test -- --watchAll=false → ...
- npm run build → ...

**Manual test cases completed:**
- [ ] ...

**Stopped.** Waiting for: Continue to Phase Y
```

---

## Current status summary

| Phase | Title | Status |
|---|---|---|
| 0 | Audit and baseline | **COMPLETE** |
| 1 | MUI foundation and branding | Not started |
| 2 | Header, Footer, shell | Not started |
| 3 | Authentication pages | Not started |
| 4 | Public marketing pages | Not started |
| 5 | Study and work browsing | Not started |
| 6 | Protected user-panel shell | Not started |
| 7 | Profile, forms, uploads | Not started |
| 8 | Application lists and details | Not started |
| 9 | Legacy dependency and CSS cleanup | Not started |
| 10 | Final branding, a11y, regression audit | Not started |

**Next instruction expected:** `Continue to Phase 1`
