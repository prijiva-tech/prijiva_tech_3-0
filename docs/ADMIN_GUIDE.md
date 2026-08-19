# PriJiva Admin & Department Head Content Management Guide

Welcome to the **PriJiva Admin Portal** documentation! This guide explains how the **PriJiva Owner** provisions Department Head accounts and how **Department Heads** manage civic drives, Cloudinary image links, and Google Form RSVP URLs.

---

## 🔒 Security & Access-Control Architecture

The PriJiva Admin Portal is protected by **Role-Based Access Control (RBAC)** powered by Firebase Authentication and Cloud Firestore:

1. **Email / Password Sign-In Only:** There is no self-registration, public sign-up, Google OAuth, or public password reset on the website.
2. **`admins/{uid}` Verification:** An authenticated user can enter the dashboard **only if** a matching document exists at `/admins/{uid}` with `active == true`.
3. **Automatic Access Denial:** Any user without an active approved record is immediately blocked and presented with an *Access Denied* screen.
4. **Owner-Only Provisioning:** Only the PriJiva Owner has permission to create, edit, or disable records in the `admins` collection.
5. **Strict Public Rules:** Public visitors can **only read** events marked `status == "published"`. All public writes are permanently denied.

---

## 👑 Part 1: Owner-Only Setup Guide (Provisioning Department Heads)

### Step 1: Create the User in Firebase Authentication
1. Open the [Firebase Console](https://console.firebase.google.com/) and select the **`prijiva-v3`** project.
2. In the left sidebar, navigate to **Build** → **Authentication** → **Users** tab.
3. Click the **"Add user"** button.
4. Enter the Department Head's official email (e.g. `events.head@prijiva.org`) and a secure temporary password.
5. Click **"Add user"**.
6. **Copy the User UID** generated for that user (e.g. `abc123XYZ456...`).

---

### Step 2: Create the Approved Record in Firestore `admins` Collection
1. In the Firebase Console, navigate to **Build** → **Firestore Database** → **Data** tab.
2. If the `admins` collection does not exist, click **"Start collection"** and enter collection ID: `admins`.
3. Click **"Add document"**.
4. **IMPORTANT:** In the **Document ID** field, paste the exact **User UID** copied from Authentication.
5. Add the following fields to the document:

| Field Name | Type | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `active` | **boolean** | `true` | Must be `true` for the user to access the dashboard |
| `name` | **string** | `Maya Krishnan` | Leader's full name |
| `email` | **string** | `events.head@prijiva.org` | Official email address |
| `department` | **string** | `Events Planning & Support` | Assigned department |
| `role` | **string** | `department_head` *(or `owner`)* | Authorization role |
| `createdAt` | **timestamp** | Current Date/Time | Record creation timestamp |

6. Click **"Save"**. The Department Head is now authorized to log in at `/admin/`.

---

### Step 3: Disabling or Revoking a Department Head Account
To immediately revoke a user's access:
- **Option A (Instant):** Go to Firestore → `admins/{uid}` and change `active` from `true` to `false`.
- **Option B:** In Firebase Authentication → Users, click the user's `...` menu and select **"Disable account"**.

---

### Step 4: Deploying Firestore Security Rules
1. In the Firebase Console, go to **Firestore Database** → **Rules** tab.
2. Replace all existing text with the contents of [`firestore.rules`](firestore.rules).
3. Click **"Publish"**.

---

## 🛠️ Part 2: Department Head Guide (Managing Civic Drives)

### 1. Logging In
1. Open your browser and navigate to:
   👉 `http://localhost:8080/admin/` *(or `https://your-domain.com/admin/`)*
2. Enter your authorized email and password.
3. Click **"Sign In to Admin Portal →"**.

---

### 2. Creating a New Event
1. Click the **"+ Create New Event"** button on the top right.
2. Fill out the event details:
   - **Event Title:** e.g. *“Project WalkRight: Koramangala Pedestrian Crossing Drive”*
   - **Pillar / Category:** Select *Street Action*, *Campus Workshop*, *Civic Audit*, or *Environment & Waste*.
   - **Publication Status:**
     - `Draft`: Keeps the event private on your dashboard for editing.
     - `Published`: Publishes the event live on the public [Impact & Events](impact-events.html) page immediately.
     - `Archived`: Keeps past records organized.
   - **Event Date & Time:** e.g. `Saturday, Nov 14, 2026` & `8:30 AM - 12:00 PM IST`.
   - **Location:** e.g. `Sony World Signal, Koramangala, Bengaluru`.
   - **Short Description:** 2–3 sentences summarizing the event.
   - **Cloudinary Image URL:** (See instructions below).
   - **Google Form RSVP URL:** (See instructions below).
   - **Target Volunteers / Outcome:** e.g. `50 Volunteers Needed` and `5,000 commuters engaged`.
3. Click **"Save Event"**.

---

### 3. Adding Cloudinary Image URLs
PriJiva uses **Cloudinary** for fast and optimized vector/photo delivery without server uploads:

1. Upload your photo to your [Cloudinary Media Library](https://cloudinary.com/).
2. Copy the public **Delivery URL** (e.g. `https://res.cloudinary.com/your-cloud/image/upload/sample.jpg`).
3. Paste the URL into the **Cloudinary Image URL** field in the event form.
4. The live preview box will instantly display the image thumbnail.
5. If no image URL is provided, PriJiva automatically displays a high-quality civic category illustration.

---

### 4. Adding Google Form RSVP Links
1. Create a registration form in Google Forms.
2. Copy the shareable short link (e.g. `https://forms.gle/xyz123...`).
3. Paste the link into the **Google Form RSVP URL** field.
4. On the public website, when citizens click **"RSVP / Volunteer →"**, it opens your Google Form in a new tab.

---

### 5. Quick Actions on the Dashboard
- **Quick Publish / Unpublish:** Click the **Publish** or **Unpublish** button on any table row to toggle public visibility without opening the full editor.
- **Filter Tabs:** Use the **All**, **Published**, **Drafts**, and **Archived** buttons to organize your drives.
- **Search Bar:** Type any keyword (location, title, or category) for instant real-time filtering.
- **Delete Event:** Click the **Delete** button and confirm to permanently remove an event.
