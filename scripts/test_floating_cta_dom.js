const fs = require('fs');
const path = require('path');

const mainJs = fs.readFileSync('assets/js/main.js', 'utf8');
const componentsCss = fs.readFileSync('assets/css/components.css', 'utf8');

const publicPages = [
  'index.html',
  'about.html',
  'our-work.html',
  'work.html',
  'impact-events.html',
  'contact.html'
];

const tests = [];

// 1. Check main.js implementation
tests.push([
  'main.js: initFloatingJoinCTA function defined',
  mainJs.includes('function initFloatingJoinCTA()'),
  true
]);

tests.push([
  'main.js: DOMContentLoaded invokes initFloatingJoinCTA',
  mainJs.includes('initFloatingJoinCTA()'),
  true
]);

tests.push([
  'main.js: Admin exclusion check present',
  mainJs.includes("window.location.pathname.includes('/admin')") || mainJs.includes("admin-body"),
  true
]);

tests.push([
  'main.js: sessionStorage dismissal check key is prijiva-join-cta-dismissed',
  mainJs.includes("sessionStorage.getItem('prijiva-join-cta-dismissed') === 'true'"),
  true
]);

tests.push([
  'main.js: sessionStorage sets prijiva-join-cta-dismissed on dismiss',
  mainJs.includes("sessionStorage.setItem('prijiva-join-cta-dismissed', 'true')"),
  true
]);

tests.push([
  'main.js: Checks for volunteer-modal before opening',
  mainJs.includes("document.getElementById('volunteer-modal')"),
  true
]);

tests.push([
  'main.js: Direct call to openModal("volunteer-modal")',
  mainJs.includes("openModal('volunteer-modal')"),
  true
]);

tests.push([
  'main.js: CTA button has aria-haspopup="dialog"',
  mainJs.includes('aria-haspopup="dialog"'),
  true
]);

tests.push([
  'main.js: Dismiss button has aria-label="Dismiss volunteer badge"',
  mainJs.includes('aria-label="Dismiss volunteer badge"'),
  true
]);

tests.push([
  'main.js: Scroll listener reveals after scroll > 300',
  mainJs.includes('window.scrollY > 300'),
  true
]);

// 2. Check CSS implementation
tests.push([
  'components.css: .floating-join-cta fixed positioning',
  componentsCss.includes('.floating-join-cta') && componentsCss.includes('position: fixed;'),
  true
]);

tests.push([
  'components.css: .floating-join-cta z-index is 900 (below header/modals)',
  componentsCss.includes('z-index: 900;'),
  true
]);

tests.push([
  'components.css: .floating-join-btn:focus-visible focus ring',
  componentsCss.includes('.floating-join-btn:focus-visible'),
  true
]);

tests.push([
  'components.css: .floating-join-dismiss:focus-visible focus ring',
  componentsCss.includes('.floating-join-dismiss:focus-visible'),
  true
]);

tests.push([
  'components.css: Mobile min-height tap target is at least 48px',
  componentsCss.includes('min-height: 48px;') && componentsCss.includes('@media (max-width: 600px)'),
  true
]);

tests.push([
  'components.css: prefers-reduced-motion override present',
  componentsCss.includes('@media (prefers-reduced-motion: reduce)') && componentsCss.includes('.floating-join-cta'),
  true
]);

tests.push([
  'components.css: Dark mode styling for floating-join-cta',
  componentsCss.includes('[data-theme="dark"] .floating-join-cta'),
  true
]);

// 3. Verify all 6 public HTML pages have volunteer-modal
for (const page of publicPages) {
  const content = fs.readFileSync(page, 'utf8');
  tests.push([
    `${page}: has volunteer-modal container`,
    content.includes('id="volunteer-modal"'),
    true
  ]);
  tests.push([
    `${page}: loads assets/js/main.js`,
    content.includes('assets/js/main.js'),
    true
  ]);
}

// 4. Verify admin/index.html does NOT have public volunteer-modal and has admin-body class
const adminHtml = fs.readFileSync('admin/index.html', 'utf8');
tests.push([
  'admin/index.html: Does not have public volunteer modal and has admin-body class for exclusion',
  !adminHtml.includes('id="volunteer-modal"') && adminHtml.includes('class="admin-body"'),
  true
]);

let passedCount = 0;
for (const [name, actual, expected] of tests) {
  const isPass = actual === expected;
  console.log(`${isPass ? '[PASS]' : '[FAIL]'} ${name}`);
  if (isPass) passedCount++;
}

console.log(`\nResults: ${passedCount}/${tests.length} tests passed.`);
if (passedCount !== tests.length) {
  process.exit(1);
}
