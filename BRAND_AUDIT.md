# Brand Audit

**Phase:** 0 — Audit and baseline  
**Date:** 2026-07-12  
**Target brand (future):** Datrix Consulting  
**Current visible brand:** Study Traveler (legacy Flyabroad package name)

---

## 1. Executive summary

The repository is still branded as **Study Traveler** in nearly all user-visible surfaces (title, hero copy, SEO defaults, copyright fallbacks). Package metadata uses **`flyabroad`**. API and upload hosts remain on **`express.studytraveler.com`**.  

**No approved Datrix brand palette, logo, or typography kit is present in the repository.** Datrix is mentioned only in `PHASE_PLAN.md` (planning doc).  

Phase 0 does **not** change branding. Later phases should introduce `src/config/brand.js` and read the product name from there instead of duplicating strings.

Proposed centralized brand config (for a later phase — not created yet):

```js
export const BRAND = {
  name: "Datrix Consulting",
  shortName: "Datrix",
  defaultTitle: "Datrix Consulting",
  defaultDescription: "",
  copyright: `Copyright © ${new Date().getFullYear()} Datrix Consulting. All Rights Reserved.`,
};
```

---

## 2. Mandatory search commands (executed)

```bash
rg -ni \
  "study[[:space:]_-]*traveler|studytraveler|fly[[:space:]_-]*abroad|flyabroad|express\.studytraveler\.com|info@studytraveler\.com" \
  .

rg -ni "React App|Create React App Sample|Web site created using create-react-app" .
```

Primary classified results below exclude `node_modules/` noise. Matches inside `build/`, `build-old/`, and binary/`src.zip` are called out as generated/archived artifacts.

---

## 3. Classification of matches

### Visible branding

| Location | Match | Notes |
|---|---|---|
| `public/index.html` | `<title>Study Traveler</title>` | Document title before SEO hydration |
| `src/pages/Home.js` | “Study Traveler … Gateway…”, “Why choose Study Traveler?” | Hero / section headlines |
| `src/pages/About.js` | “About Study Traveler” | Page H1 |
| `src/pages/Study.js` | “Study Traveler guides you…” | Body copy |
| `src/pages/WhyChooseStudy.js` | “with Study Traveler”, “Study Traveler Study Hub” | Headlines |
| `src/pages/WhyChooseWork.js` | “Study traveler JobSite” | Headline; comment mentions incomplete Fly-Abroad rename |
| `src/components/layout/AboutSection.js` | “Study Traveler \| Your Gateway…” | Section H2 |
| `src/components/layout/JourneySection.js` | “At Studytraveler…” | CTA copy |
| `src/components/layout/Testimonial.js` | “Success Through Study Traveler” | Section H2 |
| `src/components/common/Footer.js` | alt fallback `"Study Traveler"`; copyright fallback “Study Traveler” | Visible when CMS fields missing |
| `src/assets/images/logo.png` (and related) | Logo artwork | Static image branding (Study Traveler visual) |

### SEO metadata

| Location | Match | Notes |
|---|---|---|
| `src/components/SEO.js` | Default title/description “Study Traveler”; OG image/url `https://studytraveler.com/...`; title suffix `\| Study Traveler` | Client-side meta updater |
| `public/index.html` | CRA default description + Study Traveler title | Initial HTML |
| `package.json` `homepage` | `https://studytraveler.com/` | CRA homepage / asset prefix metadata |

### Package metadata

| Location | Match | Notes |
|---|---|---|
| `package.json` `name` | `flyabroad` | npm package name |
| `package.json` `homepage` | `https://studytraveler.com/` | Also SEO/host related |

### API endpoint

| Location | Match | Notes |
|---|---|---|
| `src/config/config.js` | `https://express.studytraveler.com/backend/api` | Primary API base |
| `src/components/SEO.js` | same host (env fallback) | SEO content API |
| `src/pages/Contact.js` | hardcoded BASE_URL same host | Contact submit |
| `src/pages/TravelForm.js` | hardcoded BASE_URL same host | Travel submit |

**Action later:** consolidate to `config.js` / env; treat host as infrastructure, not display brand — but cutover depends on backend readiness.

### Asset endpoint

| Location | Match | Notes |
|---|---|---|
| `Header.js` / `Footer.js` | `.../uploads/general-content` | Logos / CMS images |
| `Blog.js` / `BlogDetails.js` | `.../uploads/blogs` | Blog images |
| `StudyDetails.js` / `StudyFilter.js` | `.../uploads/universities/...` | University images |
| `PartnerSection.js` | `.../uploads/our-partners/...` | Partner logos |
| `Testimonial.js` | `.../uploads/testimonials/...` | Images/videos |
| `MyAccount.js` | `.../uploads/users/` | Profile images |
| `UploadDocuments.js` | `.../uploads/user-documents/` | User docs |
| `SEO.js` | `https://studytraveler.com/og-image.jpg` | OG image URL |
| Root `og-image.jpg` | Present in repo root | Static OG candidate |

### Email / contact fallback

| Location | Match | Notes |
|---|---|---|
| `src/components/common/Footer.js` | `info@studytraveler.com` | Fallback when CMS email missing |

### Static image

| Location | Notes |
|---|---|
| `src/assets/images/logo.png`, favicons, marketing imagery | Visual identity still Study Traveler; no Datrix logo assets found |
| `public/favicon.png`, `public/favicon.ico` | Favicons |
| `og-image.jpg` (repo root) | Social preview image |

### Generated build artifact

| Location | Match | Notes |
|---|---|---|
| `build/index.html` | Study Traveler title + CRA description | Produced by baseline `npm run build` (gitignored) |
| `build/manifest.json` | “React App” / “Create React App Sample” | Generated from `public/manifest.json` |
| `build-old/index.html` | Study Traveler + CRA description | Archived prior build |
| `build-old/manifest.json` | CRA sample names | Archived |

### Archived source artifact

| Location | Match | Notes |
|---|---|---|
| `src.zip` | Likely contains same Study Traveler / flyabroad strings | ~20MB archive; treat as archived source — do not edit for branding in Phase 0 |

### Documentation

| Location | Match | Notes |
|---|---|---|
| `PHASE_PLAN.md` | Datrix Consulting redesign plan | Future brand intent only |
| `README.md` | Create React App boilerplate | CRA documentation, not product brand |

### Create React App placeholder branding

| Location | Match | Classification |
|---|---|---|
| `public/index.html` | `Web site created using create-react-app` | SEO metadata (placeholder) |
| `public/manifest.json` | `React App` / `Create React App Sample` | Package/PWA metadata |
| `README.md` | CRA getting-started text | Documentation |
| `build*/` mirrors | Same strings | Generated / archived artifacts |

### Backend-provided content

| Source | Notes |
|---|---|
| `/site-content/general-content/get` | Footer/header logo, site title, email, copyright may come from API |
| `/site-content/page-seo-content/get` | Per-page SEO title/description/keywords |
| CMS pages (terms, privacy, blogs, FAQs, partners, testimonials) | Copy may still say Study Traveler even after frontend BRAND update |

Frontend fallbacks currently hardcode Study Traveler when API data is missing.

### Incomplete rename note

`src/pages/WhyChooseWork.js` contains comment: `Fixed branding from Study Traveler to Fly-Abroad` but visible text still says “Study traveler JobSite”. Indicates a prior incomplete rebrand attempt.

---

## 4. Datrix readiness

| Item | Status |
|---|---|
| Datrix name in UI | Not present |
| Datrix palette tokens | Not present |
| Datrix logo assets | Not present |
| Central `brand.js` | Not present (planned) |
| Preserve current colors in first MUI pass? | **Yes** — use existing `#E2403C` / `#000418` direction until Datrix palette is approved |

---

## 5. Recommended branding work order (post–Phase 0)

1. Add `src/config/brand.js` with Datrix constants; keep display strings pointing at Study Traveler only until cutover is approved, **or** switch visible strings when product owner confirms.
2. Replace duplicated visible names (Home, About, SEO defaults, Footer fallbacks, WhyChoose*).
3. Update `public/index.html` title/description and `manifest.json`.
4. Rename package `name` from `flyabroad` when safe for tooling.
5. Separate **display brand** from **API/asset hosts** — change hosts only when backend/CDN cutover is ready.
6. Replace logo/favicon/OG assets with Datrix art.
7. Audit CMS/backend content for leftover Study Traveler copy.

---

## 6. Risks

- Backend SEO and general-content APIs can reintroduce Study Traveler titles after frontend defaults change.
- Hardcoded `express.studytraveler.com` appears in many files; easy to miss during cutover.
- `src.zip` / `build-old` can confuse future searches if not excluded.
- CRA homepage field still points at studytraveler.com; may affect asset paths if published under a new domain without updating it.
