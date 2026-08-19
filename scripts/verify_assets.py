import urllib.request
import sys

BASE_URL = "http://localhost:8080"

ASSETS = [
    # HTML Public & Admin Pages
    "index.html",
    "about.html",
    "our-work.html",
    "work.html",
    "impact-events.html",
    "contact.html",
    "admin/index.html",
    "admin/",
    "README.md",
    "docs/CONTENT_GUIDE.md",
    "docs/ADMIN_GUIDE.md",
    "docs/CLOUDFLARE_WORKER_SETUP.md",
    "firestore.rules",
    "workers/prijiva-upload-signer/package.json",
    "workers/prijiva-upload-signer/wrangler.jsonc",
    "workers/prijiva-upload-signer/src/index.js",
    "workers/prijiva-upload-signer/README.md",

    # CSS Stylesheets
    "assets/css/variables.css",
    "assets/css/base.css",
    "assets/css/components.css",
    "assets/css/pages.css",
    "assets/css/admin.css",

    # JavaScript Store, Modules & Firebase
    "assets/js/siteData.js",
    "assets/js/main.js",
    "assets/js/impact.js",
    "assets/js/contact.js",
    "assets/js/work.js",
    "assets/js/firebaseConfig.js",
    "assets/js/admin.js",

    # Illustrations
    "assets/images/illustrations/hero-art.svg",
    "assets/images/illustrations/event-pedestrian.svg",
    "assets/images/illustrations/event-workshop.svg",
    "assets/images/illustrations/event-noise.svg",
    "assets/images/illustrations/event-cleanup.svg",
    "assets/images/illustrations/event-transit.svg",

    # Brand Logo & Favicon Assets
    "assets/images/icons/prijiva-logo.png",
    "assets/images/prijiva-logo.png",
    "assets/images/icons/favicon.png",
    "assets/images/icons/favicon-32x32.png",
    "favicon.ico",

    # Placeholders & Avatars
    "assets/images/placeholders/founder-placeholder.svg",
    "assets/images/avatars/avatar-1.svg",
    "assets/images/avatars/avatar-2.svg",
    "assets/images/avatars/avatar-3.svg"
]

all_passed = True
for asset in ASSETS:
    url = f"{BASE_URL}/{asset}"
    try:
        req = urllib.request.Request(url, method='GET')
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                length = len(response.read())
                print(f"[PASS] {asset} -> HTTP 200 ({length} bytes)")
            else:
                print(f"[FAIL] {asset} -> HTTP {response.status}")
                all_passed = False
    except Exception as e:
        print(f"[ERROR] {asset} -> {e}")
        all_passed = False

if all_passed:
    print(f"\nTotal: {len(ASSETS)}/{len(ASSETS)} assets verified successfully.")
    sys.exit(0)
else:
    print("\nAsset verification failed.")
    sys.exit(1)
