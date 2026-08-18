# PriJiva Cloudflare Worker Setup & Deployment Guide

This guide details the deployment and configuration of the **`prijiva-upload-signer`** Cloudflare Worker, which cryptographically signs Cloudinary direct-upload parameters for authenticated PriJiva Department Heads and Owners.

---

## 🔒 Security Architecture Overview

1. **RS256 JWT Verification:** Uses `jose` with Google's public JWK certificates to verify Firebase ID tokens (`aud`, `iss`, `exp`, `sub`).
2. **Firestore Authorization:** Fetches `/admins/{uid}` to verify `active == true` and `role` is strictly `"owner"` or `"department_head"`.
3. **SHA-1 Upload Signing:** Generates short-lived SHA-1 signatures for Cloudinary parameters (`folder=prijiva-events&timestamp=...`).
4. **Encrypted Secret Storage:** The `CLOUDINARY_API_SECRET` is stored strictly as an encrypted Cloudflare secret and is **never** sent to or stored in client code.
5. **CORS Restrictions:** Enforces strict origin checking against `http://localhost:8080`, `https://prijiva.in`, and `https://www.prijiva.in`.

---

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Install Worker Dependencies
Open your terminal in the worker directory:

```bash
cd workers/prijiva-upload-signer
npm install
```

---

### Step 2: Log In to Cloudflare
Authenticate Wrangler with your Cloudflare account:

```bash
npx wrangler login
```
*Follow the browser prompt to authorize Wrangler.*

---

### Step 3: Add Encrypted Secret (`CLOUDINARY_API_SECRET`)
Never place your Cloudinary API secret in source code or Git. Set it as an encrypted Cloudflare secret:

```bash
npx wrangler secret put CLOUDINARY_API_SECRET
```
*When prompted, paste your Cloudinary API Secret and press Enter.*

---

### Step 4: Configure Non-Secret Variables
Verify or edit the non-secret variables in [`workers/prijiva-upload-signer/wrangler.jsonc`](workers/prijiva-upload-signer/wrangler.jsonc):

```jsonc
{
  "name": "prijiva-upload-signer",
  "main": "src/index.js",
  "compatibility_date": "2026-08-18",
  "vars": {
    "CLOUDINARY_CLOUD_NAME": "your-cloudinary-cloud-name",
    "CLOUDINARY_API_KEY": "your-cloudinary-api-key",
    "FIREBASE_PROJECT_ID": "prijiva-v3",
    "ALLOWED_ORIGINS": "http://localhost:8080,https://prijiva.in,https://www.prijiva.in"
  }
}
```

---

### Step 5: Deploy the Worker
Deploy the worker to Cloudflare's global edge network:

```bash
npx wrangler deploy
```

Upon successful deployment, Wrangler will output your worker URL (e.g. `https://prijiva-upload-signer.<your-subdomain>.workers.dev`).

---

### Step 6: Configure the Worker URL in PriJiva
Open [`assets/js/firebaseConfig.js`](assets/js/firebaseConfig.js) and update `window.PRIJIVA_WORKER_URL` with your deployed URL:

```javascript
window.PRIJIVA_WORKER_URL = "https://prijiva-upload-signer.prijivatech.workers.dev";
```

---

## 🧪 Testing & Verification

### Local Simulation with Wrangler Dev
You can test the Worker locally before deployment:

```bash
cd workers/prijiva-upload-signer
npx wrangler dev
```

### Direct Upload Flow Verification
1. Log in to the PriJiva Admin Portal at `http://localhost:8080/admin/`.
2. Click **"+ Create New Event"**.
3. Under **Event Cover Image**, click **"Choose Event Image"** and select a `.jpg`, `.png`, or `.webp` file (up to 5 MB).
4. Observe the upload progress bar reaching 100%.
5. Verify that the Cloudinary image preview thumbnail appears and the event can be saved with its live `https://res.cloudinary.com/...` URL.
