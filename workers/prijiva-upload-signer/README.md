# PriJiva Cloudinary Upload Signer Worker

This Cloudflare Worker provides a secure, cryptographically verified `POST /sign-upload` endpoint that allows authenticated **PriJiva Department Heads** and **Owners** to upload civic drive images directly to Cloudinary from the `/admin/` dashboard.

---

## 🔒 Security Architecture

1. **RS256 JWT Verification (`jose`):** Validates Firebase ID tokens using Google's public JWK certs, asserting `iss`, `aud`, `exp`, and `sub`.
2. **Firestore Authorization:** Fetches `/admins/{uid}` to verify `active == true` and `role` is strictly `owner` or `department_head`.
3. **SHA-1 Cloudinary Signatures:** Generates short-lived SHA-1 signatures restricted to the `prijiva-events` folder.
4. **Zero Secret Leakage:** The Cloudinary API secret is stored only as an encrypted Cloudflare secret (`CLOUDINARY_API_SECRET`) and is never returned to the client.
5. **CORS Restrictions:** Restricted to `http://localhost:8080`, `https://prijiva.in`, and `https://www.prijiva.in`.

---

## 🚀 Local Development

To run the Worker locally:

```bash
cd workers/prijiva-upload-signer
npm install
npx wrangler dev
```

For full deployment instructions, see [**`CLOUDFLARE_WORKER_SETUP.md`**](../../docs/CLOUDFLARE_WORKER_SETUP.md).
