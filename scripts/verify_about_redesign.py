import urllib.request
import re
import sys

BASE_URL = "http://localhost:8080/about.html"

try:
    with urllib.request.urlopen(BASE_URL, timeout=5) as res:
        html = res.read().decode("utf-8")
except Exception as e:
    print(f"Failed to fetch {BASE_URL}: {e}")
    sys.exit(1)

checks = [
    # 1. Minimal Hero
    ("Hero Headline 'About PriJiva'", '<h1>About PriJiva</h1>' in html),
    ("Mission Statement present", 'Spreading civic-sense awareness to make the world “Civically Abled.”' in html),
    ("Supporting copy present", 'We are a youth-led movement empowering students and changemakers' in html),

    # 2. Our Story & Approved Brand Meaning
    ("Story Section 'How PriJiva Began'", '<h2>How PriJiva Began</h2>' in html),
    ("Brand Callout 'What PriJiva Means'", 'What PriJiva Means' in html),
    ("Pri = Prithvi (Earth) item", 'Pri — Prithvi (Earth)' in html or 'Pri &#8212; Prithvi (Earth)' in html),
    ("Jiva = Life item", 'Jiva — Life' in html or 'Jiva &#8212; Life' in html),
    ("Approved Brand Explanation sentence", 'brings together' in html and 'Prithvi' in html and 'Jiva' in html and 'caring for the places we live in is inseparable from caring for life itself' in html),
    ("No inaccurate 'Pri = Care' phrase", 'Pri (Care' not in html and 'Pri (Care &amp; Empathy)' not in html),

    # 3. Our Civic Model
    ("Civic Model Title", '<h2 class="section-title">Our Civic Model</h2>' in html),
    ("Model Timeline Container", 'class="model-timeline"' in html),
    ("Step 01 Identify Blindspots", 'Identify Blindspots' in html),
    ("Step 02 Mobilize Youth", 'Mobilize Youth' in html),
    ("Step 03 Community Action", 'Community Action' in html),
    ("Step 04 Policy Dialogue", 'Policy Dialogue' in html),

    # 4. Our Values
    ("Values Title", '<h2 class="section-title">Our Core Values</h2>' in html),
    ("Values Quiet List Container", 'class="values-quiet-list"' in html),
    ("Action Over Apathy Value", 'Action Over Apathy' in html),
    ("Joyful Responsibility Value", 'Joyful Responsibility' in html),
    ("Youth-Led Autonomy Value", 'Youth-Led Autonomy' in html),
    ("Radical Inclusivity Value", 'Radical Inclusivity' in html),
    ("Evidence & Transparency Value", 'Evidence &amp; Transparency' in html or 'Evidence & Transparency' in html),

    # 5. Governing Body
    ("Governing Body Section Title", '<h2 class="section-title">Governing Body</h2>' in html),
    ("Board Feature Card", 'class="board-feature-card"' in html),
    ("Board Secretary Poddutur Pavan Sai", 'Poddutur Pavan Sai' in html),
    ("Compact Secretariat Grid", 'class="secretariat-compact-grid"' in html),
    ("General Secretary (Gayathri & Monika)", 'General Secretary' in html and 'Gayathri' in html and 'Monika' in html),
    ("Development Secretary (Reethika & Raveena)", 'Development Secretary' in html and 'Reethika' in html and 'Raveena' in html),
    ("Administrative Secretary (Bhargavi & Sreeman)", 'Administrative Secretary' in html and 'Bhargavi' in html and 'Sreeman' in html),
    ("Communication Outreach (Vaishnavi & Pranith)", 'Communication Outreach' in html and 'Vaishnavi' in html and 'Pranith' in html),
    ("Executive Secretary (Vamshika & Jeevana)", 'Executive Secretary' in html and 'Vamshika' in html and 'Jeevana' in html),
    ("Finance Secretary (Chandana & Manisha)", 'Finance Secretary' in html and 'Chandana' in html and 'Manisha' in html),
    ("Leadership Details Modal Trigger", 'data-open-modal="leadership-modal"' in html),
    ("Leadership Details Modal ID", 'id="leadership-modal"' in html),

    # 6. Organizing Body
    ("Organizing Body Section Title", '<h2 class="section-title">Organizing Body</h2>' in html),
    ("Organizing Body Compact Grid", 'class="secretariat-compact-grid"' in html),
    ("Dept 1: Content Media (Madhav & Harish)", 'Content Media' in html and 'Madhav' in html and 'Harish' in html),
    ("Dept 2: Documentation (Harini & Alexander)", 'Documentation' in html and 'Harini' in html and 'Alexander' in html),
    ("Dept 3: Tech (Prabhakar & Navya)", 'Tech' in html and 'Prabhakar' in html and 'Navya' in html),
    ("Dept 4: Events Planning (Radha & Akshay)", 'Events Planning' in html and 'Radha' in html and 'Akshay' in html),
    ("Dept 5: Outreach (Saraf & Vinay)", 'Outreach' in html and 'Saraf' in html and 'Vinay' in html),
    ("Dept 6: People Management (Puneeth & Vikranth)", 'People Management' in html and 'Puneeth' in html and 'Vikranth' in html),
    ("Organizing Body Cards Present", len(re.findall(r'class="secretariat-compact-item"', html)) >= 24),

    # 7. Closing CTA & Navigation
    ("Closing CTA Banner", 'class="cta-banner"' in html),
    ("Volunteer Modal Trigger in CTA", 'data-open-modal="volunteer-modal"' in html),
    ("Quick Volunteer Modal ID", 'id="volunteer-modal"' in html),
    ("Site Data Script Included", 'src="assets/js/siteData.js"' in html),
    ("Main JS Script Included", 'src="assets/js/main.js"' in html)
]

all_passed = True
print("=== Verifying Redesigned About Us Page & Brand Meaning ===")
for name, passed in checks:
    status = "[PASS]" if passed else "[FAIL]"
    print(f"{status} {name}")
    if not passed:
        all_passed = False

if all_passed:
    print(f"\nAll {len(checks)} checks passed successfully!")
    sys.exit(0)
else:
    print("\nSome checks failed.")
    sys.exit(1)
