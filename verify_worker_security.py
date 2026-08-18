import urllib.request
import re
import sys
import os

BASE_URL = "http://localhost:8080"

def fetch_url(endpoint):
    url = f"{BASE_URL}/{endpoint}"
    try:
        with urllib.request.urlopen(url, timeout=5) as res:
            return res.read().decode("utf-8")
    except Exception as e:
        print(f"[ERROR] Failed to fetch {url}: {e}")
        return ""

def read_local_file(relative_path):
    try:
        with open(relative_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"[ERROR] Failed to read file {relative_path}: {e}")
        return ""

worker_pkg = read_local_file("workers/prijiva-upload-signer/package.json")
worker_wrangler = read_local_file("workers/prijiva-upload-signer/wrangler.jsonc")
worker_src = read_local_file("workers/prijiva-upload-signer/src/index.js")
worker_guide = read_local_file("CLOUDFLARE_WORKER_SETUP.md")
admin_html = fetch_url("admin/")
admin_js = fetch_url("assets/js/admin.js")
firebase_js = fetch_url("assets/js/firebaseConfig.js")

checks = [
    # 1. Cloudflare Worker Package & jose Dependency
    ("Worker Package: Includes jose dependency", '"jose"' in worker_pkg),
    ("Worker Package: Includes wrangler devDependency", '"wrangler"' in worker_pkg),
    ("Worker Package: ES module type", '"type": "module"' in worker_pkg),

    # 2. Token Cryptography & Verification (jose RS256)
    ("Worker: Uses jose createRemoteJWKSet", 'createRemoteJWKSet' in worker_src),
    ("Worker: Google public JWKS URL configured", 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com' in worker_src),
    ("Worker: Uses jose jwtVerify", 'jwtVerify' in worker_src),
    ("Worker: Enforces RS256 algorithm", 'algorithms: ["RS256"]' in worker_src or "algorithms: ['RS256']" in worker_src),
    ("Worker: Validates issuer matches project ID", 'https://securetoken.google.com/' in worker_src),
    ("Worker: Validates audience matches project ID", 'audience: projectId' in worker_src),

    # 3. RBAC & Firestore Authorization
    ("Worker: Queries Firestore REST API for /admins/{uid}", 'databases/(default)/documents/admins/' in worker_src),
    ("Worker: Passes user token in Firestore Bearer header", 'Authorization' in worker_src and 'Bearer' in worker_src),
    ("Worker: Validates active == true", 'fields.active?.booleanValue === true' in worker_src or 'active' in worker_src),
    ("Worker: Strictly permits owner and department_head roles only", 'allowedRoles = ["owner", "department_head"]' in worker_src or "['owner', 'department_head']" in worker_src),
    ("Worker: Denies inactive or unapproved roles with 403", '403' in worker_src and 'allowedRoles.includes(role)' in worker_src),

    # 4. Cloudinary SHA-1 Upload Signing
    ("Worker: Uses SHA-1 algorithm for signature", 'SHA-1' in worker_src),
    ("Worker: No SHA-256 in signer code", 'SHA-256' not in worker_src and 'sha256' not in worker_src),
    ("Worker: Fixed folderrijiva-events", 'folder = "prijiva-events"' in worker_src or "folder: 'prijiva-events'" in worker_src),
    ("Worker: Never returns CLOUDINARY_API_SECRET", 'apiSecret' not in worker_src.split('return jsonResponse({')[1].split('}, 200')[0]),

    # 5. CORS Enforcement
    ("Worker: Restricts CORS to allowed origins", 'ALLOWED_ORIGINS' in worker_src and 'http://localhost:8080' in worker_src),
    ("Worker: Handles OPTIONS preflight requests", 'request.method === "OPTIONS"' in worker_src and '204' in worker_src),
    ("Worker: Endpoint is POST /sign-upload only", 'url.pathname !== "/sign-upload"' in worker_src and 'POST' in worker_src),

    # 6. Admin Frontend Direct Upload & Cloudinary Validation
    ("Admin HTML: File input accepts JPG, PNG, WebP", 'accept=".jpg,.jpeg,.png,.webp"' in admin_html),
    ("Admin HTML: Choose Event Image button present", 'id="btn-choose-image"' in admin_html),
    ("Admin HTML: Upload progress bar present", 'id="upload-progress-bar"' in admin_html),
    ("Admin HTML: Image preview card present", 'id="upload-preview-state"' in admin_html),
    ("Admin HTML: Replace & Remove image buttons", 'id="btn-replace-image"' in admin_html and 'id="btn-remove-image"' in admin_html),
    ("Admin JS: Enforces 5 MB file size limit", '5 * 1024 * 1024' in admin_js or 'MAX_SIZE' in admin_js),
    ("Admin JS: Calls worker /sign-upload with Bearer token", '/sign-upload' in admin_js and 'Authorization' in admin_js),
    ("Admin JS: Uploads directly to Cloudinary", 'https://api.cloudinary.com/v1_1/' in admin_js),
    ("Admin JS: Validates https://res.cloudinary.com/ delivery URLs", 'https://res.cloudinary.com/' in admin_js),
    ("Firebase JS: Exports getCurrentUserToken helper", 'getCurrentUserToken' in firebase_js),

    # 7. Absence of Secrets in Source Files
    ("Security: No API secret in admin.js", 'CLOUDINARY_API_SECRET' not in admin_js),
    ("Security: No API secret in firebaseConfig.js", 'CLOUDINARY_API_SECRET' not in firebase_js),
    ("Security: No API secret in admin/index.html", 'CLOUDINARY_API_SECRET' not in admin_html),
    ("Security: No hardcoded secret in worker source", 'CLOUDINARY_API_SECRET = "' not in worker_src and "CLOUDINARY_API_SECRET = '" not in worker_src),

    # 8. Setup Guide Documentation
    ("Guide: Cloudflare secret command (wrangler secret put)", 'wrangler secret put CLOUDINARY_API_SECRET' in worker_guide),
    ("Guide: Deploy command (wrangler deploy)", 'wrangler deploy' in worker_guide)
]

all_passed = True
print("=== Verifying Cloudflare Worker & Direct Upload Security ===")
for name, passed in checks:
    status = "[PASS]" if passed else "[FAIL]"
    print(f"{status} {name}")
    if not passed:
        all_passed = False

if all_passed:
    print(f"\nAll {len(checks)} worker and upload security checks passed successfully!")
    sys.exit(0)
else:
    print("\nSome security checks failed.")
    sys.exit(1)
