/**
 * ====================================================================
 * PRIJIVA - CONTACT & TEAM DIRECTORY JAVASCRIPT (MINIMAL EDITION)
 * Form Validation, Team Directory Rendering, Direct Shortcuts
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTeamDirectory();
  initContactForm();
  initUrlParamsHandler();
  initCopyActions();
});

/* --- Team Directory Renderer --- */
function initTeamDirectory() {
  const container = document.getElementById('team-directory-container');
  if (!container || !window.SITE_DATA?.teams) return;

  container.innerHTML = window.SITE_DATA.teams.map(team => {
    let badgeClass = 'badge-teal';
    if (team.badgeColor === 'coral') badgeClass = 'badge-pink';
    if (team.badgeColor === 'yellow') badgeClass = 'badge-lemon';
    if (team.badgeColor === 'blue') badgeClass = 'badge-indigo';

    return `
      <div class="team-card" id="team-${team.id}">
        <div>
          <div class="team-card-header">
            <span class="badge-tag ${badgeClass}" style="margin-bottom: 0.5rem;">${team.teamName}</span>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.15rem; color: var(--color-indigo);">${team.leadName}</h3>
            <div style="font-size: 0.85rem; color: var(--color-teal); font-weight: 700;">${team.role}</div>
          </div>
          
          <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 0.85rem;">
            ${team.description}
          </p>

          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.35rem;">
            Responsibilities:
          </div>
          <ul style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.25rem;">
            ${team.responsibilities.map(r => `
              <li style="display: flex; align-items: flex-start; gap: 0.4rem;">
                <span style="color: var(--color-teal); font-weight: 800;">•</span>
                <span>${r}</span>
              </li>
            `).join('')}
          </ul>

          <div style="background: var(--bg-body); border-radius: var(--radius-sm); border: 1px solid var(--border-color); padding: 0.75rem 0.85rem; font-size: 0.82rem; display: flex; flex-direction: column; gap: 0.35rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="color: var(--text-muted);">📧 Email:</span>
              <span style="font-weight: 600; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.8rem;">${team.email}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="color: var(--text-muted);">📞 Phone:</span>
              <span style="font-weight: 600; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.8rem;">${team.phone}</span>
            </div>
          </div>
        </div>

        <div class="team-contact-action-row">
          <button type="button" class="btn btn-teal btn-sm message-team-trigger" style="flex: 1;" data-team-name="${team.teamName}">
            ✉️ Contact Team
          </button>
          <button type="button" class="btn btn-secondary btn-sm copy-btn" data-copy-text="${team.email}" title="Copy Email">
            📋 Copy
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Handle "Contact Team" quick buttons
  container.querySelectorAll('.message-team-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const teamName = btn.getAttribute('data-team-name');
      const inquirySelect = document.getElementById('contact-inquiry');
      const subjectInput = document.getElementById('contact-subject');
      const contactForm = document.getElementById('main-contact-form');

      if (inquirySelect) {
        if (teamName.includes('Outreach') || teamName.includes('Chapters')) {
          inquirySelect.value = 'campus-chapter';
        } else if (teamName.includes('Media')) {
          inquirySelect.value = 'media';
        } else if (teamName.includes('Operations')) {
          inquirySelect.value = 'volunteering';
        } else {
          inquirySelect.value = 'partnership';
        }
      }

      if (subjectInput) {
        subjectInput.value = `Inquiry for ${teamName}`;
      }

      if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
        const nameField = contactForm.querySelector('#contact-name');
        if (nameField) nameField.focus();
        window.showToast(`Selected: ${teamName}. Fill in your details below!`, 'info', 2500);
      }
    });
  });
}

/* --- Contact Form Handling & Validation --- */
function initContactForm() {
  const form = document.getElementById('main-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#contact-name')?.value.trim();
    const email = form.querySelector('#contact-email')?.value.trim();
    const inquiry = form.querySelector('#contact-inquiry')?.value;
    const subject = form.querySelector('#contact-subject')?.value.trim();
    const message = form.querySelector('#contact-message')?.value.trim();

    if (!name || !email || !inquiry || !subject || !message) {
      window.showToast('Please fill out all required fields.', 'error');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      window.showToast('Please enter a valid email address.', 'error');
      return;
    }

    window.showToast(`Thank you, ${name}! Your inquiry regarding "${subject}" has been sent to PriJiva.`, 'success', 5000);
    form.reset();
  });
}

/* --- URL Parameters Handler --- */
function initUrlParamsHandler() {
  const params = new URLSearchParams(window.location.search);
  const inquiry = params.get('inquiry');
  const inquirySelect = document.getElementById('contact-inquiry');

  if (inquiry && inquirySelect) {
    if (inquiry === 'volunteer') {
      inquirySelect.value = 'volunteering';
    } else if (inquiry === 'partner') {
      inquirySelect.value = 'partnership';
    } else if (inquiry === 'campus') {
      inquirySelect.value = 'campus-chapter';
    }
  }
}

/* --- One-Click Copy Actions --- */
function initCopyActions() {
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.copy-btn');
    if (copyBtn) {
      const textToCopy = copyBtn.getAttribute('data-copy-text');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          window.showToast(`Copied: "${textToCopy}"`, 'success', 2000);
        }).catch(() => {
          window.showToast('Failed to copy automatically.', 'error');
        });
      }
    }
  });
}
