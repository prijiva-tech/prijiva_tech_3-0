import urllib.request
import re
import sys

BASE_URL = "http://localhost:8080"

checks = []

def run_checks():
    # 1. Fetch our-work.html
    try:
        with urllib.request.urlopen(f"{BASE_URL}/our-work.html", timeout=5) as res:
            our_work_html = res.read().decode("utf-8")
    except Exception as e:
        print(f"[FAIL] Fetch our-work.html: {e}")
        return False

    # 2. Fetch work.html
    try:
        with urllib.request.urlopen(f"{BASE_URL}/work.html", timeout=5) as res:
            work_html = res.read().decode("utf-8")
    except Exception as e:
        print(f"[FAIL] Fetch work.html: {e}")
        return False

    # 3. Fetch admin/index.html
    try:
        with urllib.request.urlopen(f"{BASE_URL}/admin/index.html", timeout=5) as res:
            admin_html = res.read().decode("utf-8")
    except Exception as e:
        print(f"[FAIL] Fetch admin/index.html: {e}")
        return False

    # 4. Fetch assets/js/admin.js
    try:
        with urllib.request.urlopen(f"{BASE_URL}/assets/js/admin.js", timeout=5) as res:
            admin_js = res.read().decode("utf-8")
    except Exception as e:
        print(f"[FAIL] Fetch admin.js: {e}")
        return False

    # 5. Fetch assets/js/work.js
    try:
        with urllib.request.urlopen(f"{BASE_URL}/assets/js/work.js", timeout=5) as res:
            work_js = res.read().decode("utf-8")
    except Exception as e:
        print(f"[FAIL] Fetch work.js: {e}")
        return False

    # 6. Fetch assets/js/firebaseConfig.js
    try:
        with urllib.request.urlopen(f"{BASE_URL}/assets/js/firebaseConfig.js", timeout=5) as res:
            firebase_js = res.read().decode("utf-8")
    except Exception as e:
        print(f"[FAIL] Fetch firebaseConfig.js: {e}")
        return False

    tests = [
        # our-work.html checks
        ("Our Work: Title and Hero Headline", "Our Work on the Ground" in our_work_html and "Civically Abled" in our_work_html),
        ("Our Work: Grid container present", 'id="our-work-grid-container"' in our_work_html),
        ("Our Work: Search input present", 'id="work-search-input"' in our_work_html),
        ("Our Work: Dynamic filter container present", 'id="work-filter-container"' in our_work_html),
        ("Our Work: Counter badge present", 'id="work-count-badge"' in our_work_html),
        ("Our Work: Work.js script included", 'src="assets/js/work.js"' in our_work_html),
        ("Our Work: PriJiva Logo in header", 'prijiva-logo.png' in our_work_html),
        ("Our Work: Navigation active link on Our Work", '<a href="our-work.html" class="nav-link active">Our Work</a>' in our_work_html),

        # work.html checks
        ("Work Detail: Title and Container present", 'id="project-detail-container"' in work_html),
        ("Work Detail: Work.js script included", 'src="assets/js/work.js"' in work_html),
        ("Work Detail: FirebaseConfig module included", 'type="module" src="assets/js/firebaseConfig.js"' in work_html),
        ("Work Detail: Navigation link to Our Work", '<a href="our-work.html" class="nav-link active">Our Work</a>' in work_html),

        # work.js logic checks
        ("Work JS: Filters derived completed events", "derive(doc) === 'completed'" in work_js or "deriveEventLifecycle" in work_js),
        ("Work JS: Builds dynamic category filters from present data", 'buildCategoryFilters' in work_js and 'new Set()' in work_js),
        ("Work JS: Photo gallery rendering up to 5 photos", 'project-gallery-grid' in work_js),
        ("Work JS: Lightbox modal handlers present", 'initLightbox' in work_js and 'project-lightbox' in work_js),
        ("Work JS: getPublishedEventById single event query", 'getPublishedEventById' in work_js),
        ("Work JS: Protects detail view for completed events", 'derive(doc) === \'completed\'' in work_js or 'lifecycle === \'completed\'' in work_js),

        # Admin Gallery & Form checks
        ("Admin HTML: Gallery input accepts multiple images", 'id="gallery-file-input"' in admin_html and 'multiple' in admin_html),
        ("Admin HTML: Add Event Photos button present", 'id="btn-add-gallery-images"' in admin_html),
        ("Admin HTML: Gallery Progress bar present", 'id="gallery-progress-bar"' in admin_html),
        ("Admin HTML: Gallery Thumbnail grid present", 'id="gallery-thumbnails-grid"' in admin_html),
        ("Admin HTML: Calendar Date ISO input present", 'id="event-date-iso"' in admin_html),
        ("Admin HTML: Show in Our Work checkbox present", 'id="event-show-in-our-work"' in admin_html),

        # Admin JS logic checks
        ("Admin JS: Enforces max 5 gallery images", 'currentGalleryUrls.length' in admin_js and 'You can add up to 5 gallery images.' in admin_js),
        ("Admin JS: Enforces 5 MB limit per gallery image", 'Image is too large. Maximum size is 5 MB.' in admin_js),
        ("Admin JS: Enforces JPG, PNG, WebP for gallery", 'Unsupported image format. Please choose JPG, PNG, or WebP.' in admin_js),
        ("Admin JS: Calls worker /sign-upload for gallery photos", 'signerUrl' in admin_js and '/sign-upload' in admin_js),
        ("Admin JS: Validates res.cloudinary.com for all gallery URLs", 'https://res.cloudinary.com/' in admin_js),
        ("Admin JS: Validates and saves eventDate in payload", 'eventDate:' in admin_js and 'isValidEventDate' in admin_js),
        ("Admin JS: Saves showInOurWork boolean in payload", 'showInOurWork: Boolean(' in admin_js),
        ("Admin JS: Saves gallery array in payload", 'gallery: currentGalleryUrls' in admin_js),
        ("Admin JS: Preserves gallery on edit in openEventModal", 'currentGalleryUrls = Array.isArray(eventData?.gallery)' in admin_js),

        # Firebase JS checks
        ("Firebase JS: Exports getPublishedEventById", 'export async function getPublishedEventById(' in firebase_js),
        ("Firebase JS: Checks status == published in single event query", 'data.status === "published"' in firebase_js),
        ("Firebase JS: Exports deriveEventLifecycle helper", 'export function deriveEventLifecycle(' in firebase_js),
        ("Firebase JS: Preserves canonical Worker URL", 'prijiva-upload-signer.prijivatech.workers.dev' in firebase_js),
        ("Firebase JS: No old incorrect worker domain", 'prijiva.workers.dev' not in firebase_js),
    ]

    all_passed = True
    print("=== Verifying PriJiva 'Our Work' & Event Gallery Implementation ===")
    for title, passed in tests:
        status = "[PASS]" if passed else "[FAIL]"
        print(f"{status} {title}")
        if not passed:
            all_passed = False

    if all_passed:
        print(f"\nAll {len(tests)} Our Work & Gallery checks passed successfully!")
        return True
    else:
        print("\nSome Our Work verification checks failed.")
        return False

if __name__ == "__main__":
    if not run_checks():
        sys.exit(1)
    sys.exit(0)
