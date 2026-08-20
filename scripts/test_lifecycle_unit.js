const fs = require('fs');

function getTodayIST() {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(new Date());
  let year = '';
  let month = '';
  let day = '';
  for (const part of parts) {
    if (part.type === 'year') year = part.value;
    if (part.type === 'month') month = part.value;
    if (part.type === 'day') day = part.value;
  }
  return `${year}-${month}-${day}`;
}

function isValidEventDate(dateStr) {
  if (typeof dateStr !== 'string') return false;
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function deriveEventLifecycle(eventData) {
  if (!eventData) return 'draft';
  const status = eventData.status || 'draft';
  if (status === 'archived') return 'archived';
  if (status === 'draft') return 'draft';
  if (status === 'published') {
    const eventDate = (eventData.eventDate || '').trim();
    if (!isValidEventDate(eventDate)) {
      return 'upcoming';
    }
    const todayIST = getTodayIST();
    return eventDate < todayIST ? 'completed' : 'upcoming';
  }
  return 'draft';
}

const today = getTodayIST();
console.log('Today in Asia/Kolkata (IST):', today);

function resolveEditorSavedStatus(editingEventStatus, formStatusValue) {
  let finalStatus = formStatusValue || 'published';
  if (editingEventStatus === 'archived') {
    finalStatus = 'archived';
  }
  return finalStatus;
}

function canAdminDeleteEvent(adminRecord) {
  if (!adminRecord || !adminRecord.active) return false;
  return adminRecord.role === 'owner';
}

function shouldInjectFloatingJoinCTA(pathname, hasVolunteerModal, isDismissed) {
  if (pathname.includes('/admin')) return false;
  if (isDismissed) return false;
  if (!hasVolunteerModal) return false;
  return true;
}

const tests = [
  ['Valid ISO date', isValidEventDate('2026-08-20'), true],
  ['Invalid leap year date', isValidEventDate('2026-02-29'), false],
  ['Valid leap year date', isValidEventDate('2024-02-29'), true],
  ['Invalid month', isValidEventDate('2026-13-01'), false],
  ['Invalid day', isValidEventDate('2026-04-31'), false],
  ['Arbitrary string', isValidEventDate('invalid-date'), false],
  ['Empty string', isValidEventDate(''), false],

  ['Future event -> upcoming', deriveEventLifecycle({ status: 'published', eventDate: '2099-12-31' }), 'upcoming'],
  ['Today event -> upcoming', deriveEventLifecycle({ status: 'published', eventDate: today }), 'upcoming'],
  ['Past event -> completed', deriveEventLifecycle({ status: 'published', eventDate: '2020-01-01' }), 'completed'],
  ['Missing eventDate fallback -> upcoming', deriveEventLifecycle({ status: 'published', date: 'Saturday, Nov 14, 2026' }), 'upcoming'],
  ['Invalid eventDate fallback -> upcoming', deriveEventLifecycle({ status: 'published', eventDate: 'bad-date' }), 'upcoming'],
  ['Draft event -> draft', deriveEventLifecycle({ status: 'draft', eventDate: '2020-01-01' }), 'draft'],
  ['Archived event -> archived', deriveEventLifecycle({ status: 'archived', eventDate: '2020-01-01' }), 'archived'],
  ['Restored event (past) -> completed', deriveEventLifecycle({ status: 'published', eventDate: '2020-01-01' }), 'completed'],
  ['Restored event (future) -> upcoming', deriveEventLifecycle({ status: 'published', eventDate: '2099-01-01' }), 'upcoming'],

  ['Editing archived event preserves archived status (even if form defaults to published)', resolveEditorSavedStatus('archived', 'published'), 'archived'],
  ['Editing archived event does not restore it', resolveEditorSavedStatus('archived', 'draft'), 'archived'],
  ['Editing published event saves published status', resolveEditorSavedStatus('published', 'published'), 'published'],
  ['Editing published event allows unpublishing to draft', resolveEditorSavedStatus('published', 'draft'), 'draft'],
  ['Editing draft event allows publishing', resolveEditorSavedStatus('draft', 'published'), 'published'],

  ['Owner deletion authorized', canAdminDeleteEvent({ role: 'owner', active: true }), true],
  ['Inactive owner deletion denied', canAdminDeleteEvent({ role: 'owner', active: false }), false],
  ['Department Head deletion denied', canAdminDeleteEvent({ role: 'department_head', active: true }), false],
  ['Non-logged-in user deletion denied', canAdminDeleteEvent(null), false],

  ['Floating CTA injects on public page', shouldInjectFloatingJoinCTA('/about.html', true, false), true],
  ['Floating CTA never injects on admin portal', shouldInjectFloatingJoinCTA('/admin/index.html', true, false), false],
  ['Floating CTA never injects on admin root', shouldInjectFloatingJoinCTA('/admin', true, false), false],
  ['Floating CTA suppressed when dismissed in session', shouldInjectFloatingJoinCTA('/index.html', true, true), false],
  ['Floating CTA suppressed when volunteer modal absent', shouldInjectFloatingJoinCTA('/custom.html', false, false), false]
];

let allPassed = true;
for (const [name, actual, expected] of tests) {
  const passed = actual === expected;
  console.log(`${passed ? '[PASS]' : '[FAIL]'} ${name}: actual="${actual}", expected="${expected}"`);
  if (!passed) allPassed = false;
}

if (allPassed) {
  console.log(`\nAll ${tests.length} lifecycle unit tests passed successfully!`);
} else {
  process.exit(1);
}
