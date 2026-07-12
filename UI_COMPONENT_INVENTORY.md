# UI Component Inventory

**Phase:** 0 — Audit and baseline  
**Date:** 2026-07-12  
**Scope:** Current CRA React app (`flyabroad` / Study Traveler UI). No implementation changes in this phase.

---

## 1. Application pages (routes)

Source of truth: `src/App.js`.

### Public marketing / content pages

| Route | Page file | Notes |
|---|---|---|
| `/` | `src/pages/Home.js` | Hero, study/work sections, composes layout sections |
| `/about` | `src/pages/About.js` | About content |
| `/contact` | `src/pages/Contact.js` | Contact form, intl-tel-input, toastify |
| `/faq` | `src/pages/Faq.js` | Bootstrap tabs + FAQ content |
| `/blog` | `src/pages/Blog.js` | Blog list + pagination |
| `/blog-details/:slug` | `src/pages/BlogDetails.js` | Blog detail |
| `/study` | `src/pages/Study.js` | Study landing |
| `/study-details/:courseId` | `src/pages/StudyDetails.js` | Course/university detail + table |
| `/study-filter` | `src/pages/StudyFilter.js` | Filters (accordion/offcanvas), pagination |
| `/why-choose-study` | `src/pages/WhyChooseStudy.js` | Marketing |
| `/work` | `src/pages/Work.js` | Work landing |
| `/job-details/:id` | `src/pages/WorkDetails.js` | Job detail |
| `/work-filter` | `src/pages/WorkFilter.js` | Filters (accordion/offcanvas), pagination |
| `/why-choose-work` | `src/pages/WhyChooseWork.js` | Marketing |
| `/terms-conditions` | `src/pages/TermsCondition.js` | CMS terms |
| `/privacy-policy` | `src/pages/PrivacyPolicy.js` | CMS privacy |
| `/travel` | `src/pages/TravelForm.js` | Travel inquiry: react-select, datepicker, intl-tel |

### Auth pages

| Route | Page file | Notes |
|---|---|---|
| `/login` | `src/auth/Login.js` | Native inputs, Google/Facebook OAuth, toastify |
| `/signup` | `src/auth/Signup.js` + `SignupForm.js` | Multi-field signup, intl-tel, toastify |
| `/verify` | `src/auth/VerifyEmail.js` | Email verification |
| `/forgot-password` | `src/auth/ForgotPassword.js` | Password recovery request |
| `/reset-password` | `src/auth/ResetPassword.js` | Password reset |

Supporting auth: `src/auth/Google.js`, `src/auth/Facebook.js`.

### Protected user-panel pages

| Route | Page file | Notes |
|---|---|---|
| `/application-form` | `src/userpanelpages/ApplicationForm.js` | Multi-step; react-select; file uploads; native selects |
| `/my-account` | `src/userpanelpages/MyAccount.js` | Profile; intl-tel; image upload |
| `/study-applications` | `src/userpanelpages/StudyApplications.js` | Table list |
| `/study-application-details/:id` | `src/userpanelpages/StudyApplicationsDetails.js` | Detail table |
| `/edit-study-application/:id` | `src/userpanelpages/EditStudyApplication.js` | Edit form + selects |
| `/work-applications` | `src/userpanelpages/WorkApplications.js` | Table list |
| `/work-application-details/:id` | `src/userpanelpages/WorkApplicationsDetails.js` | Detail table |
| `/edit-work-application/:id` | `src/userpanelpages/EditWorkApplication.js` | Edit form + file uploads |
| `/applied-jobs` | `src/userpanelpages/AppliedJobs.js` | Table list |
| `/job-apply-form/:jobId` | `src/userpanelpages/JobApplyForm.js` | File uploads |
| `/upload-documents` | `src/userpanelpages/UploadDocuments.js` | File upload + table |

Shared panel chrome: `src/userpanelpages/Sidebar.js`.

### Catch-all

| Route | Behavior |
|---|---|
| `*` | Renders `Home` |

**Page count:** 17 public + 5 auth route entries + 11 protected = **33 routed screens** (+ shared layout/auth helpers).

---

## 2. Shared components

| Component | Path | Role |
|---|---|---|
| Header | `src/components/common/Header.js` | Bootstrap navbar + collapse |
| Footer | `src/components/common/Footer.js` | Footer links, contact, video modal |
| SEO | `src/components/SEO.js` | Document title / meta / OG |
| AboutSection | `src/components/layout/AboutSection.js` | Home about block |
| FaqSection | `src/components/layout/FaqSection.js` | Bootstrap accordion FAQ |
| JourneySection | `src/components/layout/JourneySection.js` | CTA journey band |
| PartnerSection | `src/components/layout/PartnerSection.js` | Partner logos via **react-slick** |
| Testimonial | `src/components/layout/Testimonial.js` | Testimonials via **react-slick** + video modal |
| AuthContext | `src/context/AuthContext.js` | Auth state provider |
| App shell | `src/App.js` | Router, ToastContainer, scroll-to-top |
| Config | `src/config/config.js` | API `baseURL` only |

No `src/theme/` or `src/components/ui/` wrappers yet (planned for later phases).

---

## 3. UI dependency inventory

### npm UI-related dependencies (`package.json`)

| Package | Version | Current use | MUI replacement target |
|---|---|---|---|
| `react` / `react-dom` | ^19.0.0 | Core | Keep |
| `react-router-dom` | ^7.4.0 | Routing | Keep |
| `react-scripts` | ^5.0.1 | CRA toolchain | Keep (for now) |
| `axios` | ^1.8.1 | HTTP | Keep |
| `react-toastify` | ^11.0.5 | Toasts across many pages | `Snackbar` + `Alert` via `AppSnackbar` |
| `react-select` | ^5.10.1 | Country multi-select | `Autocomplete` / `Select` |
| `react-datepicker` | ^9.0.0 | Travel form date | `@mui/x-date-pickers` + `dayjs` (when date fields migrated) |
| `react-slick` + `slick-carousel` | ^0.30.3 / ^1.8.1 | Partners + testimonials | **Do not replace until those pages are stable** |
| `intl-tel-input` | ^17.0.15 | Phone country dial | No core MUI equivalent; keep temporarily, theme shell |
| `@react-oauth/google` | ^0.12.1 | Google login | Keep (OAuth) |
| `@greatsumini/react-facebook-login` | ^3.4.0 | Facebook login | Keep (OAuth) |
| `jwt-decode` | ^4.0.0 | Token decode | Keep |
| `date-fns-tz` | ^3.2.0 | Timezone helpers | Keep / reassess with dayjs later |
| Testing libraries | various | Present but **no tests** | Keep |

**Not in package.json (CDN):**

| Asset | Loaded from | Use |
|---|---|---|
| Bootstrap 5.3.3 CSS + JS | jsDelivr in `public/index.html` | Grid, navbar collapse, accordion, offcanvas, tabs, tables, spinners, forms |
| Font Awesome 6.7.2 | cdnjs in `public/index.html` | Sidebar + some icons |

**Not installed yet (planned):** `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `@mui/x-date-pickers`, `dayjs`.

---

## 4. Control-type inventory (migration targets)

### Native text / password / email / number / textarea inputs

Present in: Login, SignupForm, ForgotPassword, ResetPassword, Contact, TravelForm, Work, Study, StudyFilter, WorkFilter, ApplicationForm, MyAccount, EditStudyApplication, EditWorkApplication, JobApplyForm, UploadDocuments.

→ Target: `TextField` / `AppTextField`.

### Native `<select>` / `.form-select`

| File | Usage |
|---|---|
| `Contact.js` | Subject select |
| `ApplicationForm.js` | Multiple education/work selects |
| `EditStudyApplication.js` | Multiple selects |
| `EditWorkApplication.js` | Multiple selects |

→ Target: `Select` / `AppSelect` / `FormControl`.

### react-select

| File | Usage |
|---|---|
| `ApplicationForm.js` | Preferred countries (max 3) |
| `TravelForm.js` | Country select |

→ Target: MUI `Autocomplete`.

### Datepickers

| File | Library |
|---|---|
| `TravelForm.js` | `react-datepicker` |

CSS: `.react-datepicker-wrapper` in `style.css`.

→ Target: MUI X Date Pickers (install only when migrating this field).

### Buttons

Widespread `.color-btn`, `.border-btn`, `.btn`, Bootstrap `btn-primary`, filter buttons, scroll-to-top in `App.js`.

→ Target: `Button` / `IconButton` / `AppButton`.

### Tables

| File | Pattern |
|---|---|
| `StudyApplications.js` | Bootstrap striped bordered |
| `WorkApplications.js` | Bootstrap striped bordered |
| `AppliedJobs.js` | Bootstrap striped bordered |
| `UploadDocuments.js` | Bootstrap striped bordered |
| `StudyApplicationsDetails.js` | Bootstrap bordered sm |
| `WorkApplicationsDetails.js` | Bootstrap bordered sm |
| `StudyDetails.js` | Bootstrap borderless |

→ Target: MUI `Table` (+ wrappers as needed).

### Modals / dialogs

| File | Pattern |
|---|---|
| `Footer.js` | Bootstrap-style `.modal` (React state) |
| `Testimonial.js` | Custom `.modal` overlay |

→ Target: MUI `Dialog`.

### Toasts

`react-toastify` in App shell + ~23 feature files (auth, panel, contact, blog, travel, legal, etc.).

→ Target: centralized `AppSnackbar` (`Snackbar` + `Alert`).

### Accordions

| File | Pattern |
|---|---|
| `FaqSection.js` | Bootstrap accordion |
| `StudyFilter.js` | `.filter-accordion` + collapse |
| `WorkFilter.js` | `.filter-accordion` + collapse |

→ Target: MUI `Accordion`.

### Sidebars / navigation

| File | Pattern |
|---|---|
| `Header.js` | Bootstrap navbar + collapse |
| Auth pages | Duplicate navbar toggler / collapse |
| `Sidebar.js` | Custom `.dashboard-sidebar` + Font Awesome |
| Filter pages | Bootstrap offcanvas for mobile filters |

→ Target: `AppBar`/`Toolbar`/`Drawer`/`List`/`ListItemButton`/`Menu`.

### Cards

`.card-box` used on StudyFilter, WorkFilter, Work; many “card-like” CSS blocks without a shared React card component.

→ Target: MUI `Card`/`Paper` only where interaction/container semantics warrant it (per design rules).

### Loading states

Bootstrap `.spinner-border` and/or text `loading-message` / “Loading…” across auth, panel lists, filters, CMS pages, layout sections.

→ Target: `CircularProgress` / `Skeleton` via `LoadingState`.

### Empty states

Inline copy such as “No study applications found”, “No work applications found”, “No applied jobs found”, “No testimonials found”, “No partners found”, “No blogs found”, react-select `noOptionsMessage`.

→ Target: shared `EmptyState`.

### Error states

Inline error headings + toast errors; some “Try Again” buttons on list pages.

→ Target: shared `ErrorState` + `Alert`.

### File uploads

| File | Fields |
|---|---|
| `ApplicationForm.js` | resume, cover letter |
| `JobApplyForm.js` | resume, cover letter |
| `EditWorkApplication.js` | resume, cover letter |
| `UploadDocuments.js` | document upload |
| `MyAccount.js` | profile image |

→ Target: MUI-styled file controls / buttons (no dedicated MUI upload; wrap with theme).

### Phone inputs

`intl-tel-input` in Contact, TravelForm, SignupForm, MyAccount.

→ Keep library temporarily; restyle shell to MUI theme.

### Carousels (deferred)

`react-slick` in `PartnerSection.js`, `Testimonial.js`.

→ **Do not replace in early phases.**

### Pagination

Custom Bootstrap pagination UI in `StudyFilter.js`, `WorkFilter.js`, `Blog.js`.

→ Target: MUI `Pagination`.

### Breadcrumbs

Manual `.breadcrumb` markup in StudyDetails, StudyFilter, WorkDetails, WorkFilter.

→ Target: MUI `Breadcrumbs`.

### Tabs

Bootstrap tabs in `Faq.js`; panel `.setting-tab` sections in user panel.

→ Target: MUI `Tabs`.

### Checkboxes / radios / switches

Native checkboxes in filter accordions; radio `btn-check` purpose toggles in ApplicationForm; various form checks.

→ Target: MUI `Checkbox`, `RadioGroup`, `Switch` as appropriate.

---

## 5. Stylesheets

| File | Role | Approx. top-level classes |
|---|---|---|
| `src/assets/css/style.css` | Primary design system / page styles | ~219 unique top-level class selectors |
| `src/assets/css/responsive.css` | Breakpoint overrides + intl-tel tweaks | ~43 unique top-level class selectors |
| `src/assets/css/slick.css` | Local slick helpers | Slider-related |
| Bootstrap CDN | Utility/grid/components | Global |
| Font Awesome CDN | Icons | Global |
| `intl-tel-input` CSS | Phone widget | Imported in consuming pages |
| `react-toastify` CSS | Toasts | Imported per page / package |
| `slick-carousel` theme CSS | Carousel | Imported in `App.js` |

Fonts loaded in `style.css`: Montserrat, Plus Jakarta Sans, Inter (Google Fonts). CSS var `--main-font: "Frank Ruhl Libre"` is declared but Frank Ruhl Libre is not imported.

### Current color direction (preserve in first migration pass)

No approved Datrix palette exists in-repo (only mentioned in `PHASE_PLAN.md`). Preserve existing Study Traveler direction:

| Token (informal) | Value | Usage |
|---|---|---|
| Accent / primary CTA | `#E2403C` | `.color-btn`, accents, footer bar |
| Dark / secondary | `#000418` | Dark buttons, headings, journey band |
| Body text | `#000000` / `#666666` / `#415D65` | Body / muted |
| Surfaces | `#ffffff`, `#F9FAFB`, `#FEF5F5`, soft reds | Backgrounds |
| Borders | `#ECEFF3`, `#E7E7E8` | Cards / dividers |

---

## 6. CSS class → owning component map (practical)

| CSS class / pattern | Owning component(s) |
|---|---|
| `.header-main` / `.navbar` | `Header.js`, auth Login/Signup/Forgot/Reset shells |
| `.footer-section` | `Footer.js` |
| `.color-btn` / `.border-btn` | Many pages + Header/layout CTAs |
| `.form-control` | Auth forms, Contact, Travel, filters, panel forms |
| `.form-select` | `Contact.js`, `ApplicationForm.js` (+ edit forms use `<select>`) |
| `.contact-form` | Auth + Contact + Travel |
| `.accordion-item` / `.accordion-button` | `FaqSection.js`, StudyFilter, WorkFilter |
| `.filter-accordion` | StudyFilter, WorkFilter |
| `.dashboard-sidebar` | `Sidebar.js` |
| `.profile-section` / `.setting-tab` | User panel pages |
| `.modal` / `.modal-content` | `Footer.js`, `Testimonial.js` |
| `.spinner-border` | Auth, filters, panel lists, legal pages, Contact |
| `.loading-message` | `ApplicationForm.js` |
| `.table` / `.details-table` / `.data-table` | Panel tables + StudyDetails |
| `.pagination` / `.page-link` | Blog, StudyFilter, WorkFilter |
| `.hero-section` | `Home.js` |
| `.scroll-to-top-btn` | `App.js` |
| `.card-box` | StudyFilter, WorkFilter, Work |
| `.testimonial-section` | `Testimonial.js` |
| `.partner-logos` | `PartnerSection.js` |
| `.study-page-main-section` | Study, Work |
| `.login-page` | Auth shells |
| `.breadcrumb` | Study/Work detail + filter pages |
| offcanvas classes | StudyFilter, WorkFilter |
| `.file-inner` | ApplicationForm, JobApplyForm, EditWorkApplication, UploadDocuments |
| `.status-badge` | Application/job list + detail pages |
| `.Toastify*` | `style.css` overrides; used via react-toastify |
| `.react-datepicker-wrapper` | `style.css`; used by TravelForm datepicker |
| `.intl-tel-input` / `.iti*` | `responsive.css`; phone fields |

Full exhaustive mapping of all ~219 `style.css` classes is impractical for one-off utilities; above covers interactive / structural migration targets.

---

## 7. API and asset URL inventory (non-branding UI)

Central config:

- `src/config/config.js` → `https://express.studytraveler.com/backend/api`

Hardcoded API / upload bases also appear in SEO, Contact, TravelForm, Blog(s), StudyDetails, StudyFilter, Header, Footer, PartnerSection, Testimonial, MyAccount, UploadDocuments.

Static assets live under `src/assets/images/` (large set of JPG/PNG/SVG) and `public/` (favicon, manifest, robots).

---

## 8. Generated / archived UI artifacts

| Artifact | Notes |
|---|---|
| `build/` | Fresh baseline production build (gitignored) |
| `build-old/` | Prior production build snapshot (tracked) |
| `src.zip` | ~20MB archived source bundle |

These are inventory items only; Phase 0 does not modify them.
