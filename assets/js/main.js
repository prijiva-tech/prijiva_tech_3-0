/**
 * ====================================================================
 * PRIJIVA - MAIN JAVASCRIPT UTILITIES
 * Shared Navigation, Theme Toggle, Sticky Header, Modals, Toasts,
 * Animated Counters, and Civic Pledge Widget.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initStickyHeader();
  initMobileMenu();
  initToastContainer();
  initModals();
  initAnimatedCounters();
  initCivicPledge();
  initCommonLinks();
  initAccordions();
});

/* --- Theme Management (Dark / Light Mode) --- */
function initTheme() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('prijiva-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('prijiva-theme', newTheme);
      updateThemeIcons(newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info', 2000);
    });
  });
}

function updateThemeIcons(theme) {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    if (theme === 'dark') {
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      btn.setAttribute('title', 'Switch to Light Mode');
      btn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      btn.setAttribute('title', 'Switch to Dark Mode');
      btn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  });
}

/* --- Sticky Header on Scroll --- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --- Mobile Menu Drawer --- */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');

  if (!menuBtn || !drawer || !backdrop) return;

  const openMenu = () => {
    menuBtn.classList.add('open');
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    menuBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    menuBtn.classList.remove('open');
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  menuBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });

  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* --- Toast Notification System --- */
let toastContainer = null;
function initToastContainer() {
  toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }
}

function showToast(message, type = 'info', duration = 3500) {
  if (!toastContainer) initToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#312e81" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div style="flex-grow: 1; font-weight: 600; font-size: 0.92rem;">${message}</div>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

/* --- Global Modal Manager --- */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const closeTriggers = document.querySelectorAll('[data-close-modal]');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      openModal(modalId);
    });
  });

  closeTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal.id);
    });
  });

  modalBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) closeModal(activeModal.id);
    }
  });

  // Volunteer quick form
  const volForm = document.getElementById('quick-volunteer-form');
  if (volForm) {
    volForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = volForm.querySelector('#vol-name')?.value.trim();
      const email = volForm.querySelector('#vol-email')?.value.trim();

      if (!name || !email) {
        showToast('Please fill in your name and email address.', 'error');
        return;
      }

      showToast(`Thank you, ${name}! Your volunteer application has been received.`, 'success', 4000);
      volForm.reset();
      closeModal('volunteer-modal');
    });
  }

  // RSVP Form listener if present on page
  const rsvpForm = document.getElementById('rsvp-event-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = rsvpForm.querySelector('#rsvp-name')?.value.trim();
      const email = rsvpForm.querySelector('#rsvp-email')?.value.trim();
      const eventName = rsvpForm.querySelector('#rsvp-hidden-event')?.value || 'the civic drive';

      if (!name || !email) {
        showToast('Please fill out your name and email.', 'error');
        return;
      }

      showToast(`Confirmed! You are registered for "${eventName}". Details sent to ${email}`, 'success', 5000);
      rsvpForm.reset();
      closeModal('rsvp-modal');
    });
  }

  // RSVP trigger buttons (Featured Drive or direct triggers)
  document.querySelectorAll('.rsvp-trigger-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-event-title') || 'Civic Action Drive';
      const date = btn.getAttribute('data-event-date') || '';
      const loc = btn.getAttribute('data-event-loc') || '';
      openRsvpModal(title, date, loc);
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function openRsvpModal(title, date, location) {
  const modal = document.getElementById('rsvp-modal');
  if (!modal) return;

  const eventTitleField = modal.querySelector('#rsvp-event-title');
  const eventMetaField = modal.querySelector('#rsvp-event-meta');
  const hiddenTitleInput = modal.querySelector('#rsvp-hidden-event');

  if (eventTitleField) eventTitleField.textContent = title;
  if (eventMetaField) eventMetaField.textContent = date ? `${date} • ${location}` : location;
  if (hiddenTitleInput) hiddenTitleInput.value = title;

  openModal('rsvp-modal');
}

/* --- Animated Stat Counters with Intersection Observer --- */
function initAnimatedCounters() {
  const statElements = document.querySelectorAll('[data-target-counter]');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target-counter'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        animateNumber(el, 0, target, 1600, suffix);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  statElements.forEach(el => observer.observe(el));
}

function animateNumber(element, start, end, duration, suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = 1 - (1 - progress) * (1 - progress);
    const currentVal = Math.floor(easeProgress * (end - start) + start);
    
    element.textContent = currentVal.toLocaleString() + suffix;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end.toLocaleString() + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

/* --- Interactive Civic Pledge Widget --- */
function initCivicPledge() {
  const pledgeContainer = document.getElementById('civic-pledge-container');
  if (!pledgeContainer || !window.SITE_DATA?.civicPledges) return;

  const pledges = window.SITE_DATA.civicPledges;
  let selectedPledges = new Set(['p1', 'p2', 'p3']);

  function renderPledges() {
    pledgeContainer.innerHTML = `
      <div class="pledge-grid">
        ${pledges.map(p => {
          const isSelected = selectedPledges.has(p.id);
          return `
            <button type="button" class="pledge-item-btn ${isSelected ? 'selected' : ''}" data-pledge-id="${p.id}" aria-pressed="${isSelected}">
              <div class="pledge-check">
                <span>${p.category}</span>
                <span>${isSelected ? '✓ Committed' : '+ Add'}</span>
              </div>
              <div style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">
                ${p.title}
              </div>
            </button>
          `;
        }).join('')}
      </div>
      <div class="pledge-card-result">
        <div style="margin-bottom: 0.5rem;">
          <h4 style="color: #ffffff; margin: 0; font-size: 1.2rem;">Committed to ${selectedPledges.size} Civic Habit${selectedPledges.size !== 1 ? 's' : ''}</h4>
        </div>
        <p style="color: #cbd5e1; font-size: 0.92rem; max-width: 480px; margin: 0 auto 1.25rem auto;">
          Every small action makes our shared spaces safer and more respectful.
        </p>
        <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
          <button type="button" id="copy-pledge-btn" class="btn btn-yellow btn-sm">
            📋 Copy My Civic Pledge
          </button>
          <a href="contact.html?inquiry=volunteer" class="btn btn-outline-white btn-sm">
            Join as Volunteer →
          </a>
        </div>
      </div>
    `;

    pledgeContainer.querySelectorAll('.pledge-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-pledge-id');
        if (selectedPledges.has(pId)) {
          if (selectedPledges.size > 1) {
            selectedPledges.delete(pId);
          } else {
            showToast('Please keep at least one pledge habit selected.', 'info');
          }
        } else {
          selectedPledges.add(pId);
          showToast('Habit added to your pledge! ✨', 'success', 2000);
        }
        renderPledges();
      });
    });

    const copyBtn = pledgeContainer.querySelector('#copy-pledge-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const pledgeTitles = pledges.filter(p => selectedPledges.has(p.id)).map(p => `• ${p.title}`).join('\n');
        const text = `I just took the PriJiva Youth Civic Pledge to make our community #CivicallyAbled! ✨\n\nMy commitments:\n${pledgeTitles}\n\nJoin the movement at PriJiva!`;
        
        navigator.clipboard.writeText(text).then(() => {
          showToast('Pledge copied to clipboard! Share it with friends ✨', 'success');
        }).catch(() => {
          showToast('Could not copy automatically. Please select manually.', 'error');
        });
      });
    }
  }

  renderPledges();
}

/* --- Common Links & Active Nav State --- */
function initCommonLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- Accessible Accordion Directory --- */
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion-directory');
  accordions.forEach(acc => {
    const items = acc.querySelectorAll('.accordion-item');
    items.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const body = item.querySelector('.accordion-body');
      if (!header || !body) return;

      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close other accordion items (one open at a time)
        items.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherHeader = other.querySelector('.accordion-header');
            const otherBody = other.querySelector('.accordion-body');
            if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
            if (otherBody) otherBody.style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          header.setAttribute('aria-expanded', 'false');
          body.style.maxHeight = null;
        } else {
          item.classList.add('active');
          header.setAttribute('aria-expanded', 'true');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  });
}

// Global Exports
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.openRsvpModal = openRsvpModal;
