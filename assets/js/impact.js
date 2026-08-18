/**
 * ====================================================================
 * PRIJIVA - IMPACT & EVENTS JAVASCRIPT
 * Event Filtering, Category Pills, Search, Dynamic Grid, Testimonials
 * Real-time Firestore Published Events Synchronization
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initEventsManager();
  initTestimonials();
});

/* --- Events Directory & Filtering Manager --- */
async function initEventsManager() {
  const grid = document.getElementById('events-grid-container');
  const searchInput = document.getElementById('events-search-input');
  const filterPillsContainer = document.getElementById('filter-pills-container');
  const countBadge = document.getElementById('filtered-events-count');

  if (!grid) return;

  // Active events list initialized from static data
  let activeEvents = (window.SITE_DATA?.events || []).map(e => ({ ...e }));
  let currentCategory = 'all';
  let currentSearch = '';
  let currentStatus = 'all';

  // Attempt to load live published events from Firestore
  async function loadFirestorePublishedEvents() {
    // Wait briefly for module load if needed
    for (let i = 0; i < 15; i++) {
      if (window.PriJivaFirebase?.getPublishedEvents) break;
      await new Promise(r => setTimeout(r, 100));
    }

    if (window.PriJivaFirebase?.getPublishedEvents) {
      try {
        const firestoreEvents = await window.PriJivaFirebase.getPublishedEvents();
        if (firestoreEvents && firestoreEvents.length > 0) {
          activeEvents = firestoreEvents.map(doc => ({
            id: doc.id,
            title: doc.title,
            category: doc.category || 'Street Action',
            badge: doc.category || 'Street Action',
            type: doc.type || 'upcoming',
            date: doc.date || 'Upcoming',
            time: doc.time || '',
            location: doc.location || 'Bengaluru',
            description: doc.description || '',
            image: doc.imageUrl || 'assets/images/illustrations/event-pedestrian.svg',
            rsvpUrl: doc.rsvpUrl || '',
            attendees: doc.attendees || 'Volunteers Needed',
            outcome: doc.outcome || 'Active Civic Drive'
          }));
          renderEvents();
        }
      } catch (err) {
        console.warn("Using offline verified event directory:", err);
      }
    }
  }

  // Categories
  const categories = [
    { key: 'all', label: 'All Activities' },
    { key: 'upcoming', label: 'Upcoming Drives' },
    { key: 'past', label: 'Past Impact' },
    { key: 'Street Action', label: 'Street Action' },
    { key: 'Campus Workshop', label: 'Workshops' },
    { key: 'Civic Audit', label: 'Audits' },
    { key: 'Environment & Waste', label: 'Environment' }
  ];

  // Render filter pills
  if (filterPillsContainer) {
    filterPillsContainer.innerHTML = categories.map(cat => `
      <button type="button" class="filter-pill-btn ${cat.key === 'all' ? 'active' : ''}" data-category="${cat.key}">
        ${cat.label}
      </button>
    `).join('');

    filterPillsContainer.querySelectorAll('.filter-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterPillsContainer.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const catKey = btn.getAttribute('data-category');
        if (catKey === 'upcoming' || catKey === 'past') {
          currentStatus = catKey;
          currentCategory = 'all';
        } else {
          currentStatus = 'all';
          currentCategory = catKey;
        }
        renderEvents();
      });
    });
  }

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      renderEvents();
    });
  }

  function getFilteredEvents() {
    return activeEvents.filter(item => {
      if (currentStatus === 'upcoming' && item.type !== 'upcoming') return false;
      if (currentStatus === 'past' && item.type !== 'past') return false;
      if (currentCategory !== 'all' && item.category !== currentCategory) return false;

      if (currentSearch) {
        const titleMatch = (item.title || '').toLowerCase().includes(currentSearch);
        const descMatch = (item.description || '').toLowerCase().includes(currentSearch);
        const locMatch = (item.location || '').toLowerCase().includes(currentSearch);
        const catMatch = (item.category || '').toLowerCase().includes(currentSearch);
        if (!titleMatch && !descMatch && !locMatch && !catMatch) return false;
      }

      return true;
    });
  }

  function renderEvents() {
    const filtered = getFilteredEvents();
    if (countBadge) {
      countBadge.textContent = `${filtered.length} Event${filtered.length !== 1 ? 's' : ''}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem; background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-xl);">
          <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">🔍</div>
          <h3 style="margin-bottom: 0.35rem; font-size: 1.25rem;">No matching civic drives found</h3>
          <p style="color: var(--text-muted); max-width: 420px; margin: 0 auto 1.25rem auto; font-size: 0.95rem;">
            Try clearing your search keyword or selecting a different category filter.
          </p>
          <button type="button" class="btn btn-secondary btn-sm" id="reset-filters-btn">
            Reset Filters
          </button>
        </div>
      `;

      const resetBtn = grid.querySelector('#reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          currentSearch = '';
          currentCategory = 'all';
          currentStatus = 'all';
          if (filterPillsContainer) {
            filterPillsContainer.querySelectorAll('.filter-pill-btn').forEach(b => {
              b.classList.toggle('active', b.getAttribute('data-category') === 'all');
            });
          }
          renderEvents();
        });
      }
      return;
    }

    grid.innerHTML = filtered.map(item => {
      const isUpcoming = item.type === 'upcoming';
      const badgeClass = isUpcoming ? 'badge-pink' : 'badge-teal';
      const imageSrc = item.image || 'assets/images/illustrations/event-pedestrian.svg';

      return `
        <article class="event-card" data-event-id="${item.id}">
          <div class="event-card-media">
            <img src="${imageSrc}" alt="${item.title}" loading="lazy" onerror="this.src='assets/images/illustrations/event-pedestrian.svg'">
            <span class="badge-tag ${badgeClass} event-card-badge">
              ${item.badge || item.category}
            </span>
          </div>
          <div class="event-card-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--color-teal);">
                ${item.category}
              </span>
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">
                ${item.date}
              </span>
            </div>

            <h3 class="event-card-title">${item.title}</h3>
            <p class="event-card-desc">${item.description}</p>

            <div class="event-detail-tags">
              <div class="event-detail-tag-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>${item.location}</span>
              </div>
              <div class="event-detail-tag-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span>${isUpcoming ? `Target: ${item.attendees}` : `Turnout: ${item.attendees}`}</span>
              </div>
              <div class="event-detail-tag-item" style="color: var(--color-teal); font-weight: 600;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>Outcome: ${item.outcome}</span>
              </div>
            </div>

            <div class="event-card-footer">
              ${isUpcoming ? `
                <button type="button" class="btn btn-pink btn-sm rsvp-trigger-btn" data-event-title="${item.title}" data-event-date="${item.date}" data-event-loc="${item.location}" data-rsvp-url="${item.rsvpUrl || ''}">
                  RSVP / Volunteer →
                </button>
              ` : `
                <span class="badge-tag badge-teal">✓ Verified Impact</span>
              `}
              <button type="button" class="btn btn-outline btn-sm share-event-btn" data-event-title="${item.title}">
                🔗 Share
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach RSVP triggers
    grid.querySelectorAll('.rsvp-trigger-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rsvpUrl = btn.getAttribute('data-rsvp-url');
        if (rsvpUrl && (rsvpUrl.startsWith('http://') || rsvpUrl.startsWith('https://'))) {
          window.open(rsvpUrl, '_blank', 'noopener,noreferrer');
          return;
        }

        const title = btn.getAttribute('data-event-title');
        const date = btn.getAttribute('data-event-date');
        const loc = btn.getAttribute('data-event-loc');
        if (typeof window.openRsvpModal === 'function') {
          window.openRsvpModal(title, date, loc);
        }
      });
    });

    // Attach Share triggers
    grid.querySelectorAll('.share-event-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-event-title');
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(`Join PriJiva at: "${title}"!\nEvent link: ${shareUrl}`).then(() => {
          if (typeof window.showToast === 'function') {
            window.showToast('Event details copied to clipboard! 📢', 'success');
          }
        });
      });
    });
  }

  // Initial render with static data & trigger Firestore sync
  renderEvents();
  loadFirestorePublishedEvents();
}

/* --- Testimonials Grid --- */
function initTestimonials() {
  const container = document.getElementById('testimonials-grid-container');
  if (!container || !window.SITE_DATA?.testimonials) return;

  container.innerHTML = window.SITE_DATA.testimonials.map(item => `
    <div class="testimonial-card">
      <p class="testimonial-quote">“${item.quote.replace(/^[“"]+|[”"]+$/g, '')}”</p>
      <div class="testimonial-author-box">
        <div>
          <h4 style="font-size: 0.98rem; margin-bottom: 0.15rem; color: var(--color-indigo);">${item.author}</h4>
          <div style="font-size: 0.82rem; color: var(--color-teal); font-weight: 700;">${item.role}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${item.affiliation}</div>
        </div>
      </div>
    </div>
  `).join('');
}
