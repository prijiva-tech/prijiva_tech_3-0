import os
import re
import sys

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html_files = [
    'index.html',
    'about.html',
    'our-work.html',
    'work.html',
    'impact-events.html',
    'contact.html',
    os.path.join('admin', 'index.html')
]

print("=== HTML & ASSET PATH INTEGRITY VALIDATION ===")
all_valid = True
checked_count = 0

for rel_html in html_files:
    full_path = os.path.join(root_dir, rel_html)
    base_dir = os.path.dirname(full_path)
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    refs = re.findall(r'(?:src|href)=["\']([^"\']+)["\']', content)
    for ref in refs:
        if ref.startswith('#') or ref.startswith('http://') or ref.startswith('https://') or ref.startswith('mailto:') or ref.startswith('tel:') or ref.startswith('javascript:'):
            continue
        clean_ref = ref.split('?')[0].split('#')[0]
        if not clean_ref:
            continue

        target_path = os.path.normpath(os.path.join(base_dir, clean_ref))
        checked_count += 1
        if not os.path.exists(target_path):
            print(f"[FAIL] In {rel_html}: Reference '{ref}' -> Missing file: {target_path}")
            all_valid = False

print(f"Total local references checked: {checked_count}")
if all_valid:
    print("[PASS] 100% of all local relative references resolve to existing files!")
    sys.exit(0)
else:
    print("[FAIL] Broken relative references detected.")
    sys.exit(1)
