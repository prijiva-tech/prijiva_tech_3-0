# PriJiva Web Application — "Making the World Civically Abled"

Welcome to the official web application and administration portal for **PriJiva**, a youth-led non-governmental organization (NGO) dedicated to spreading civic-sense awareness, road safety, pedestrian rights, and proactive community accountability.

---

## 1. What PriJiva Is

- **Brand Meaning:**
  - **Pri** = **Prithvi (Earth)**
  - **Jiva** = **Life**
  - **PriJiva** represents the profound connection between Earth, life, and responsible civic action: caring for shared public spaces is inseparable from caring for life itself.
- **Mission:** Empowering Gen Z and student leaders to move from online complaints to joyful, on-ground civic action to make the world **"Civically Abled."**
- **Architecture Philosophy:** Clean, lightweight HTML5, Vanilla CSS3 tokens, and ES6 modules without framework overhead or build step complexities.

---

## 2. Project Directory Structure

```text
app-prototype3-0/
│
├── index.html                        # Public Home: Hero, metrics, pillars, featured drive, civic pledge
├── about.html                        # Public About: Origin story, brand meaning, 4-step model, governance & organizing bodies
├── our-work.html                     # Public Showcase: Completed drives, dynamic category pills, search, outcome badges
├── work.html                         # Public Project Detail: Single drive impact narrative, photo gallery, lightbox
├── impact-events.html                # Public Drives Directory: Filter pills, search, RSVP routing, testimonials
├── contact.html                      # Public Contact: Direct channels, validated inquiry form, departmental directory
├── favicon.ico                       # Root favicon for automatic browser discovery
├── firestore.rules                   # Production Cloud Firestore security rules
├── README.md                         # Project documentation and architectural overview
│
├── admin/
│   └── index.html                    # Protected Admin Portal (/admin/) for Department Heads & Governance
│
├── docs/
│   ├── ADMIN_GUIDE.md                # Owner provisioning and Department Head portal guide
│   ├── CONTENT_GUIDE.md              # Content customization and siteData editing manual
│   └── CLOUDFLARE_WORKER_SETUP.md    # Cloudflare Worker deployment and secrets guide
│
├── assets/
│   ├── css/
│   │   ├── variables.css             # Design tokens: Indigo, Teal, Pink, Lemon, typography, shadows, dark mode
│   │   ├── base.css                  # CSS reset, typography, accessibility skip-link, touch target rules
│   │   ├── components.css            # Header, navbar, mobile drawer, buttons, badges, modals, toasts, pledge
│   │   ├── pages.css                 # Page layouts: hero, about model, event cards, team directory, showcase, gallery, lightbox
│   │   └── admin.css                 # Admin portal: login view, dashboard table, metrics, modal uploader, gallery grid
│   │
│   ├── js/
│   │   ├── siteData.js               # Central static store: org info, stats, default events, team, testimonials, FAQ
│   │   ├── main.js                   # Shared navigation, theme toggle, modal/toast manager, civic pledge widget
│   │   ├── impact.js                 # Impact events manager: category filters, search, Firestore sync, RSVP routing
│   │   ├── contact.js                # Contact form validation, team directory, one-click copy helpers
│   │   ├── work.js                   # Our Work & detail view controller: dynamic category filter, Firestore sync, lightbox
│   │   ├── firebaseConfig.js         # Firebase Web SDK v10.12.2: Auth, Firestore client, queries, token retrieval
│   │   └── admin.js                  # Admin dashboard controller: auth listener, Cloudflare signer + Cloudinary uploader, CRUD
│   │
│   └── images/
│       ├── icons/                    # Official circular PriJiva logo, multi-resolution favicons
│       ├── illustrations/            # SVG vectors (hero-art, pedestrian, workshop, noise, cleanup, transit)
│       ├── avatars/                  # SVG avatars for department heads and organizers
│       └── placeholders/             # Founder and leadership silhouette placeholders
│
├── workers/
│   └── prijiva-upload-signer/        # Self-contained Cloudflare Worker for Cloudinary upload signing
│       ├── src/
│       │   └── index.js              # Worker entry point: RS256 JWT verification, Firestore RBAC check, SHA-1 signer
│       ├── wrangler.jsonc            # Cloudflare Wrangler configuration
│       ├── package.json              # Worker dependencies (jose, wrangler)
│       ├── package-lock.json         # Locked dependency tree
│       └── README.md                 # Worker documentation
│
└── scripts/
    ├── run_all_tests.py              # Master test runner executing all verification suites
    ├── validate_paths.py             # Path & relative link integrity validator
    ├── verify_admin_security.py      # Test suite: Admin portal, RBAC, rules, security requirements
    ├── verify_worker_security.py     # Test suite: Cloudflare Worker cryptography, RBAC, HMAC SHA-1, zero secrets
    ├── verify_assets.py              # Test suite: HTTP 200 checks for all site assets
    ├── verify_about_redesign.py      # Test suite: About page structure, ethos, 4-step model, brand semantics
    └── verify_our_work.py            # Test suite: Our Work showcase, gallery uploader, detail view, lightbox
```

---

## 3. How to Run Locally

The site runs on standard web servers without compilation:

```bash
# Option 1: Python (Recommended)
python -m http.server 8080

# Option 2: Node.js (npx serve)
npx -y serve ./ -l 8080
```
Navigate to:
- Public Website: `http://localhost:8080/`
- Admin Portal: `http://localhost:8080/admin/`

---

## 4. Public Website Pages

1. **Home (`/index.html`):** Mission banner, impact metrics, core pillars, featured active drive, interactive civic pledge habit builder, and newsletter CTA.
2. **About Us (`/about.html`):** Origin story, brand meaning callout ("Pri = Prithvi, Jiva = Life"), 4-step civic model, organizational values, governing body (Secretariat), and organizing body (6 departments).
3. **Our Work (`/our-work.html`):** Showcase of completed civic drives (`status == 'published'` and derived `completed` lifecycle at 00:00 IST following scheduled date), dynamic category pills, search bar, and direct detail links.
4. **Project Details (`/work.html?id=<eventId>`):** Breadcrumb navigation, impact summary, turnout and milestone metrics, cover image, full narrative, responsive photo gallery (up to 5 photos), and full-screen modal lightbox.
5. **Impact & Events (`/impact-events.html`):** Complete upcoming drives directory (`status == 'published'` and derived `upcoming` lifecycle), category filters, search, Google Form RSVP routing, and volunteer testimonials.
6. **Contact Us (`/contact.html`):** Direct contact channels, department directory with one-click inquiry routing, and interactive contact form.

---

## 5. Admin Portal (`/admin/`)

- **Role-Based Access Control:** Restricted to verified users whose UID has an active document in `/admins/{uid}` with `active === true`.
- **Views:**
  - **Login View:** Clean email and password sign-in.
  - **Access Denied View:** Displayed if a valid Firebase user lacks approved admin rights.
  - **Dashboard View:** Live event metrics (Total, Published, Draft, Archived), search, status filtering, table management, and modal editor.
- **Event Lifecycle Actions:** Create new events, edit details, toggle publish status with one click, contextual **Archive** for completed published events, and **Restore** for archived records. **Delete Permanently** is restricted exclusively to the Organization Owner (`role == 'owner'`) with explicit confirmation.

---

## 6. Firebase Authentication

- **Provider:** Firebase Email/Password Authentication.
- **Session:** State maintained via `onAuthStateChanged` in [`assets/js/firebaseConfig.js`](assets/js/firebaseConfig.js).
- **ID Tokens:** Short-lived JWT ID tokens retrieved on demand via `getCurrentUserToken()` for authenticating backend requests.

---

## 7. Cloud Firestore Data Layer

- **Collection `/admins/{uid}`:**
  - Fields: `name` (string), `email` (string), `role` (`"owner"` | `"department_head"`), `department` (string), `active` (boolean), `createdAt` (timestamp).
- **Collection `/events/{eventId}`:**
  - Fields: `title` (string), `category` (string), `eventDate` (string, ISO `YYYY-MM-DD` in Asia/Kolkata), `date` (string, human-readable display date), `time` (string), `location` (string), `description` (string), `imageUrl` (string, Cloudinary URL), `gallery` (array of up to 5 Cloudinary URLs), `showInOurWork` (boolean, retained for document compatibility), `rsvpUrl` (string), `attendees` (string), `outcome` (string), `status` (`"published"` | `"draft"` | `"archived"`), `createdAt` (timestamp), `updatedAt` (timestamp), `createdBy` (object: `uid`, `email`, `name`).

---

## 8. Role-Based Access Control (RBAC) & Security Rules

Enforced strictly in [`firestore.rules`](firestore.rules):
- **Admins Collection (`/admins/{uid}`):**
  - Read: Authenticated user reading own document (`request.auth.uid == uid`).
  - Write: Restricted to Owner (`request.auth.token.email == "podduturpavansai@gmail.com"` or `role == "owner"`).
- **Events Collection (`/events/{eventId}`):**
  - Public Read: Restricted to documents where `status == "published"`.
  - Create / Update: Restricted to active admins (`isActiveAdmin()`).
  - Deletion: Restricted exclusively to active Organization Owner (`allow delete: if isOwner();`). Public visitors and department heads cannot delete.
- **Default Deny:** All other Firestore paths deny read and write.

---

## 9. Cloudflare Worker Architecture

- **Path:** [`workers/prijiva-upload-signer/`](workers/prijiva-upload-signer/)
- **Canonical Endpoint:**
  ```text
  POST https://prijiva-upload-signer.prijivatech.workers.dev/sign-upload
  ```
- **Authentication:** Validates incoming `Authorization: Bearer <idToken>` using `jose` against Google's public JWKS (`RS256`, verifying issuer `https://securetoken.google.com/prijiva-v3` and audience `prijiva-v3`).
- **Authorization:** Queries Firestore REST API (`/admins/{uid}`) to verify `active == true` and `role == "owner" | "department_head"`.
- **CORS:** Strictly restricted to configured origins (`http://localhost:8080`, `https://prijiva.in`, `https://www.prijiva.in`).

---

## 10. Cloudinary Upload Architecture

- **Zero Secret Exposure:** Browser code never possesses `CLOUDINARY_API_SECRET`.
- **Signing Flow:**
  1. Admin selects a file (JPG, PNG, WebP ≤ 5 MB).
  2. Browser sends ID Token to the Cloudflare Worker `/sign-upload`.
  3. Worker generates HMAC SHA-1 signature for parameters (`folder=prijiva-events`, `timestamp`).
  4. Worker returns `signature`, `timestamp`, `apiKey`, `cloudName`, `folder`.
  5. Browser uploads directly to `https://api.cloudinary.com/v1_1/<cloudName>/image/upload` via `XMLHttpRequest` with live progress tracking.
  6. Secure HTTPS delivery URL (`https://res.cloudinary.com/...`) is saved in Firestore.

---

## 11. Event Gallery & Lightbox

- **Multi-Photo Uploads:** Up to 5 event photos attached per event.
- **Client Validation:** Enforces ≤ 5 images total, JPG/PNG/WebP format, and ≤ 5 MB per file.
- **Admin Management:** Sequential progress bar, thumbnail preview grid with index badges, and remove buttons.
- **Public Lightbox:** Responsive grid on [`work.html`](work.html) opening an accessible full-screen modal lightbox with keyboard (Esc) and backdrop dismissal.

---

## 12. "Our Work" Showcase & Automated Lifecycle

- **Criteria:** Automatically displays events where `status == "published"` and the scheduled event date is before today in `Asia/Kolkata` (`eventDate < todayIST`).
- **Midnight IST Rollover:** Events automatically transition from Upcoming to Completed at 00:00 IST the day after their scheduled date.
- **Dynamic Category Filter:** Filter buttons are generated dynamically from categories present in the retrieved completed work data.
- **Card Badges:** Displays category, date, location, turnout, outcome, and photo count badge (`📷 N Photos`).

---

## 13. Security Model Summary

| Layer | Protection Mechanism |
|---|---|
| **Client Secrets** | Zero private keys, service account credentials, or Cloudinary secrets in frontend code. |
| **Firestore Read** | Public reads restricted to `status == 'published'`. Single event fetch requires published status. |
| **Firestore Write** | Requires valid Firebase Auth session matching an active admin record in `/admins/{uid}`. |
| **Upload Signing** | RS256 token verification + Firestore admin check before generating short-lived SHA-1 signatures. |
| **Cloudinary Delivery** | Strict client-side validation that saved URLs begin with `https://res.cloudinary.com/`. |

---

## 14. Verification Scripts & Automated Testing

Run the full verification suite with a single command:
```bash
python scripts/run_all_tests.py
```

Individual verification suites:
```bash
python scripts/verify_admin_security.py       # RBAC, views, Firestore rules, auth flow
python scripts/verify_worker_security.py      # Worker RS256, jose JWKS, HMAC SHA-1, zero secret leakage
python scripts/verify_assets.py               # HTTP 200 checks for all 44 site assets
python scripts/verify_about_redesign.py       # About page layout, 4-step model, brand meaning
python scripts/verify_our_work.py             # Our Work showcase, gallery, detail view, lightbox
python scripts/validate_paths.py              # Relative path integrity validator
```

---

## 15. Deployment Basics

- **Static Frontend:** Deploy to Cloudflare Pages, Firebase Hosting, Netlify, or Vercel by serving the repository root.
- **Cloudflare Worker:**
  ```bash
  cd workers/prijiva-upload-signer
  npx wrangler secret put CLOUDINARY_API_SECRET
  npx wrangler deploy
  ```
- **Firestore Rules:**
  ```bash
  firebase deploy --only firestore:rules
  ```
