# PriJiva Content & Customization Guide for Organizers & Admins

Welcome to the **PriJiva** website management guide! This document explains how non-technical organizers, team leads, and administrators can easily customize content, update impact figures, add upcoming civic drives, replace founder/volunteer photos, and modify contact details.

---

## 🎨 Design System & Color Palette

The PriJiva website uses a refined, minimal, and energetic color palette:

- **Deep Indigo (`#312E81`):** Primary brand headings, active navigation links, and primary card backgrounds.
- **Bright Teal (`#14B8A6`):** Primary action buttons (`.btn-teal`), active highlights, and verified impact badges.
- **Watermelon Pink (`#F43F5E`):** Secondary emphasis buttons (`.btn-pink`) and upcoming drive badges.
- **Soft Lemon (`#FDE68A`):** Subtle accent backgrounds and interactive pledge highlights.
- **Mist White (`#F8FAFC`):** Main body background.
- **Charcoal (`#1F2937`):** High-contrast body text.

---

## 📁 Project Architecture & File Organization

```text
app-prototype3-0/
├── index.html                  # Home page
├── about.html                  # About Us & Leadership Structure
├── our-work.html               # Our Work showcase
├── work.html                   # Single Project detail view
├── impact-events.html          # Events directory
├── contact.html                # Contact channels, form & team directory
├── admin/                      # Protected Admin Portal (/admin/)
├── README.md                   # Quickstart and setup guide
├── docs/
│   ├── CONTENT_GUIDE.md        # Content editing manual (this file)
│   ├── ADMIN_GUIDE.md          # Admin portal and owner provisioning guide
│   └── CLOUDFLARE_WORKER_SETUP.md # Cloudflare Worker deployment guide
└── assets/
    ├── css/
    │   ├── variables.css       # Colors, typography, spacing, shared tokens
    │   ├── base.css            # Reset, global styles, typography, accessibility
    │   ├── components.css      # Header, footer, buttons, cards, modals, toasts
    │   └── pages.css           # Page-specific layouts only
    ├── js/
    │   ├── siteData.js         # Single editable data store for all PriJiva content
    │   ├── main.js             # Shared navigation, theme, modals, toasts, pledge
    │   ├── impact.js           # Impact filters, search, and testimonials
    │   └── contact.js          # Contact form validation & directory shortcuts
    └── images/
        ├── illustrations/      # Hero art and civic drive vector illustrations
        ├── placeholders/       # Founder and leadership placeholders
        ├── avatars/            # Team and secretariat avatar icons
        └── icons/              # Additional icons and symbols
```

---

## 📁 Centralized Content File Location

All website data is centralized in:
👉 `assets/js/siteData.js`

When you edit this file, your changes automatically update across all four pages: **Home**, **About Us**, **Impact & Events**, and **Contact Us**.

---

## 1. Updating Organization Info, Emails & Social Links

Open `assets/js/siteData.js` and locate the `organization` object:

```javascript
organization: {
  name: "PriJiva",
  tagline: "Making the World Civically Abled",
  shortDescription: "A dynamic, youth-led civic movement...",
  brandMeaning: {
    headline: "What PriJiva Means",
    pri: "Prithvi (Earth)",
    jiva: "Life",
    explanation: "PriJiva brings together Prithvi—Earth—and Jiva—Life. It reflects our belief that caring for the places we live in is inseparable from caring for life itself."
  },
  foundedYear: "2024",
  hqLocation: "Bengaluru, Karnataka, India", // Replace with real city
  contactEmail: "hello@prijiva.org",         // Replace with active mailbox
  contactPhone: "+91 98765 43210",          // Replace with real phone number
  socials: {
    instagram: "https://instagram.com/your_actual_handle",
    linkedin: "https://linkedin.com/company/your_actual_page",
    twitter: "https://twitter.com/your_actual_handle",
    youtube: "https://youtube.com/@your_actual_channel",
    whatsappCommunity: "https://chat.whatsapp.com/your_actual_invite"
  }
}
```

### 🌍 Brand Meaning:
- **Pri** = **Prithvi (Earth)**
- **Jiva** = **Life**
- **PriJiva** represents the connection between Earth, life, and responsible civic action.

---

## 2. Updating Impact Numbers & Statistics

Locate the `impactStats` array in `assets/js/siteData.js`. Change `targetNumber` to your new verified figures:

```javascript
impactStats: [
  {
    id: "citizens-reached",
    targetNumber: 25000, // <--- Change to real number
    suffix: "+",
    label: "Citizens Reached",
    description: "Directly engaged via street drives and workshops"
  },
  {
    id: "events-conducted",
    targetNumber: 65,    // <--- Change to real number
    suffix: "+",
    label: "Civic Drives Conducted",
    description: "Conducted across universities & transit hubs"
  }
  // ...
]
```

*The numbers automatically animate upwards smoothly when visitors scroll to them!*

---

## 3. Adding or Editing Events & Ground Drives

Locate `events` in `assets/js/siteData.js`. To add a new drive, copy and paste this template:

```javascript
{
  id: "evt-007",                                                // Unique ID
  title: "Your Civic Drive Title Here",
  category: "Street Action",                                     // "Street Action" | "Campus Workshop" | "Civic Audit" | "Environment & Waste"
  type: "upcoming",                                             // "upcoming" or "past"
  date: "Oct 25, 2026",
  time: "9:00 AM - 1:00 PM",
  location: "Your Location / Junction Name",
  city: "Bengaluru",
  badge: "Upcoming Drive",
  image: "assets/images/illustrations/event-pedestrian.svg",    // Path to event photo or SVG
  description: "Brief 2-3 sentence overview of what volunteers will do.",
  attendees: "100 Volunteers Needed",                           // or "120 Participated" for past drives
  outcome: "Expected or verified outcome of the drive."
}
```

---

## 4. Updating Governing Body (Board & Secretariats)

All governance roles are managed in the `governingBody` object within `assets/js/siteData.js`.

### Board / Secretary
Locate `governingBody.boardSecretary`:
```javascript
boardSecretary: {
  name: "Poddutur Pavan Sai",
  designation: "Board Secretary & Founder",
  photo: "assets/images/placeholders/founder-placeholder.svg", // Or real photo path
  roleDescription: "Guides overall institutional vision...",
  bioSummary: "Student changemaker and founder of PriJiva...",
  email: "founder@prijiva.org",
  phone: "+91 98765 43210",
  linkedin: "https://linkedin.com/company/prijiva",
  leadershipMessage: "“Civic sense is not an abstract theory in a textbook...”"
}
```

### Secretariat Roles (Executive, General, Operations, Outreach, Strategy)
Locate `governingBody.secretaries` in `assets/js/siteData.js`:
```javascript
{
  id: "sec-exec",
  title: "Executive Secretary",
  name: "Actual Leader Name",                    // Replace placeholder
  photo: "assets/images/avatars/avatar-1.svg",   // Or real leader photo
  roleDescription: "Supports executive decision-making...",
  bioSummary: "Coordinates cross-functional milestones...",
  email: "exec.secretary@prijiva.org",
  linkedin: "https://linkedin.com/in/actual-profile"
}
```

---

## 5. Updating Organizing Body (Departments, Heads & Sub-Heads)

Locate `organizingBody.departments` in `assets/js/siteData.js`. Each of the six functional departments contains editable Head and Sub-Head objects:

```javascript
{
  id: "dept-events",
  departmentName: "Events Planning & Support",
  description: "Plans, coordinates, and supports PriJiva events...",
  tagColor: "teal", // "teal" | "indigo" | "pink" | "lemon"
  
  // Department Head
  head: {
    name: "Actual Head Name",
    role: "Department Head",
    photo: "assets/images/avatars/avatar-1.svg",
    bio: "Oversees event calendar, drive schedules, and coordination.",
    email: "events.head@prijiva.org",
    phone: "+91 98765 XXXXX",
    linkedin: "https://linkedin.com/in/head-profile"
  },
  
  // Department Sub-Head
  subHead: {
    name: "Actual Sub-Head Name",
    role: "Department Sub-Head",
    photo: "assets/images/avatars/avatar-2.svg",
    bio: "Assists with drive-day coordination and volunteer rosters.",
    email: "events.subhead@prijiva.org",
    phone: "+91 98765 XXXXX",
    linkedin: "https://linkedin.com/in/subhead-profile"
  },
  
  responsibilities: [
    "Annual and monthly civic drive calendars",
    "Volunteer scheduling, safety briefings, and permissions",
    "On-ground logistics, equipment, and crowd coordination"
  ]
}
```

---

## 6. Local Preview & Testing

You can preview the website locally by opening `index.html` in any modern web browser or running:
- **Python:** `python -m http.server 8080`
- **Node/NPM:** `npx -y serve ./`
