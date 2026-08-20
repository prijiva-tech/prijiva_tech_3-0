import urllib.request
import re
import sys

BASE_URL = "http://localhost:8080"

def fetch_url(endpoint):
    url = f"{BASE_URL}/{endpoint}"
    try:
        with urllib.request.urlopen(url, timeout=5) as res:
            return res.read().decode("utf-8")
    except Exception as e:
        print(f"[ERROR] Failed to fetch {url}: {e}")
        return ""

admin_html = fetch_url("admin/")
firebase_js = fetch_url("assets/js/firebaseConfig.js")
admin_js = fetch_url("assets/js/admin.js")
impact_js = fetch_url("assets/js/impact.js")
rules = fetch_url("firestore.rules")
admin_guide = fetch_url("docs/ADMIN_GUIDE.md")

checks = [
    # 1. Admin /admin/ HTML Security, Views & Relative Asset Paths
    ("Admin /admin/: Login View present", 'id="admin-login-view"' in admin_html),
    ("Admin /admin/: Access Denied View present", 'id="admin-denied-view"' in admin_html),
    ("Admin /admin/: Dashboard View present", 'id="admin-dashboard-view"' in admin_html),
    ("Admin /admin/: Relative CSS paths (../assets/css)", '../assets/css/admin.css' in admin_html),
    ("Admin /admin/: Relative JS paths (../assets/js)", '../assets/js/admin.js' in admin_html),
    ("Admin /admin/: Relative Public link (../index.html)", '../index.html' in admin_html),
    ("Admin /admin/: Email input present", 'id="admin-email"' in admin_html),
    ("Admin /admin/: Password input present", 'id="admin-password"' in admin_html),
    ("Admin /admin/: No public registration", 'Sign Up' not in admin_html and 'create-account' not in admin_html),
    ("Admin /admin/: No Google sign-in button", 'google-signin' not in admin_html and 'Sign in with Google' not in admin_html),
    ("Admin /admin/: No public password reset form", 'forgot-password' not in admin_html and 'reset-password' not in admin_html),
    ("Admin /admin/: Cloudinary image URL input", 'id="event-img-url"' in admin_html),
    ("Admin /admin/: Cloudinary image preview", 'id="event-img-preview"' in admin_html),
    ("Admin /admin/: Google Form RSVP URL input", 'id="event-rsvp-url"' in admin_html),
    ("Admin /admin/: Event Status Selector", 'id="event-status"' in admin_html),

    # 2. Firestore Security Rules
    ("Rules: isActiveAdmin function defined", 'function isActiveAdmin()' in rules),
    ("Rules: Check active == true in admins collection", 'data.active == true' in rules),
    ("Rules: isOwner function defined", 'function isOwner()' in rules),
    ("Rules: Owner check role == owner", "data.role == 'owner'" in rules),
    ("Rules: match /admins/{uid} write restricted to isOwner()", 'match /admins/{uid}' in rules and 'allow write: if isOwner();' in rules),
    ("Rules: match /events/{eventId} public read restricted to status == published", "resource.data.status == 'published'" in rules),
    ("Rules: match /events/{eventId} create/update restricted to isActiveAdmin()", 'allow create, update: if isActiveAdmin();' in rules),
    ("Rules: match /events/{eventId} delete restricted exclusively to isOwner()", 'allow delete: if isOwner();' in rules),
    ("Rules: Default deny on all other paths", 'match /{document=**}' in rules and 'allow read, write: if false;' in rules),

    # 3. Firebase Configuration & Data Layer
    ("Firebase JS: checkAdminStatus helper", 'checkAdminStatus' in firebase_js and '"admins"' in firebase_js),
    ("Firebase JS: check active === true", 'data.active === true' in firebase_js),
    ("Firebase JS: getPublishedEvents queries published status", 'where("status", "==", "published")' in firebase_js),
    ("Firebase JS: deleteEvent helper present", 'export async function deleteEvent(' in firebase_js),
    ("Firebase JS: No private service account keys in code", 'private_key' not in firebase_js and 'service_account' not in firebase_js),
    ("Firebase JS: getTodayIST helper with formatToParts", 'getTodayIST' in firebase_js and 'formatToParts' in firebase_js),
    ("Firebase JS: isValidEventDate YYYY-MM-DD validator", 'isValidEventDate' in firebase_js),
    ("Firebase JS: deriveEventLifecycle timezone helper", 'deriveEventLifecycle' in firebase_js),

    # 4. Admin JS Controller & RBAC Guarding
    ("Admin JS: checks isApproved status", 'statusResult.isApproved' in admin_js),
    ("Admin JS: shows denied view when not approved", "showView('denied')" in admin_js),
    ("Admin JS: shows dashboard view when approved", "showView('dashboard')" in admin_js),
    ("Admin JS: live preview for Cloudinary image URL", 'event-img-preview' in admin_js and 'imgUrlInput.value' in admin_js),
    ("Admin JS: quick status toggle support", 'quickToggleStatus' in admin_js),
    ("Admin JS: contextual archiveEvent action", 'archiveEvent' in admin_js),
    ("Admin JS: contextual restoreEvent action", 'restoreEvent' in admin_js),
    ("Admin JS: Delete Permanently action restricted to owner", "currentAdmin.role === 'owner'" in admin_js and 'Delete Permanently' in admin_js),
    ("Admin JS: confirmDeleteEvent guards against non-owner", "currentAdmin.role !== 'owner'" in admin_js and 'confirmDeleteEvent' in admin_js),
    ("Admin JS: editing an archived event does not restore it", "editingEventStatus === 'archived'" in admin_js and "finalStatus = 'archived'" in admin_js),

    # 5. Public Website Synchronization (impact.js)
    ("Impact JS: queries Firestore getPublishedEvents", 'getPublishedEvents' in impact_js),
    ("Impact JS: filters derived upcoming events", 'derive(doc) === \'upcoming\'' in impact_js or 'deriveEventLifecycle' in impact_js),
    ("Impact JS: routes Google Form RSVP when rsvpUrl exists", 'data-rsvp-url' in impact_js and 'window.open' in impact_js),

    # 6. Admin Guide Documentation
    ("Guide: Owner setup step 1 (Firebase Auth user)", 'Firebase Authentication' in admin_guide and 'Add user' in admin_guide),
    ("Guide: Owner setup step 2 (Copy User UID)", 'User UID' in admin_guide),
    ("Guide: Owner setup step 3 (Create /admins/{uid} document)", 'admins' in admin_guide and 'active' in admin_guide),
    ("Guide: Instructions for Cloudinary image URLs", 'Cloudinary' in admin_guide and 'Delivery URL' in admin_guide),
    ("Guide: Instructions for Google Form RSVP links", 'Google Form' in admin_guide)
]

all_passed = True
print("=== Verifying PriJiva Admin & Security Architecture ===")
for name, passed in checks:
    status = "[PASS]" if passed else "[FAIL]"
    print(f"{status} {name}")
    if not passed:
        all_passed = False

if all_passed:
    print(f"\nAll {len(checks)} security and functional checks passed successfully!")
    sys.exit(0)
else:
    print("\nSome security checks failed.")
    sys.exit(1)
