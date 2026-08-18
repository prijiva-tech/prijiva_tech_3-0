/**
 * ====================================================================
 * PRIJIVA - OUR WORK & PROJECT DETAIL CONTROLLER (work.js)
 * Synchronizes published completed work (status == 'published' && showInOurWork == true)
 * from Firestore with graceful offline fallback to SITE_DATA.events.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('our-work-grid-container')) {
    initOurWorkShowcase();
  }
  if (document.getElementById('project-detail-container')) {
    initProjectDetailView();
  }
});

/* --- 1. Our Work Showcase Page (our-work.html) --- */
async function initOurWorkShowcase() {
  const grid = document.getElementById('our-work-grid-container');
  const searchInput = document.getElementById('work-search-input');
  const filterContainer = document.getElementById('work-filter-container');
  const countBadge = document.getElementById('work-count-badge');

  if (!grid) return;

  // Initial data from static SITE_DATA (filtered to showInOurWork === true)
  let allWork = (window.SITE_DATA?.events || [])
    .filter(e => e.showInOurWork === true || (e.showInOurWork !== false && e.type === 'past'))
    .map(e => ({
      id: e.id,
      title: e.title,
      category: e.category || 'Street Action',
      date: e.date || '',
      time: e.time || '',
      location: e.location || '',
      description: e.description || '',
      imageUrl: e.imageUrl || e.image || 'assets/images/illustrations/event-pedestrian.svg',
      gallery: Array.isArray(e.gallery) ? e.gallery : [],
      attendees: e.attendees || '',
      outcome: e.outcome || '',
      showInOurWork: true
    }));

  let selectedCategory = 'all';
  let searchQuery = '';

  // Attempt to sync from live Firestore published events
  async function loadFirestoreWork() {
    for (let i = 0; i < 15; i++) {
      if (window.PriJivaFirebase?.getPublishedEvents) break;
      await new Promise(r => setTimeout(r, 100));
    }

    if (window.PriJivaFirebase?.getPublishedEvents) {
      try {
        const firestoreEvents = await window.PriJivaFirebase.getPublishedEvents();
        if (firestoreEvents) {
          // Strictly filter: status == 'published' AND showInOurWork == true
          const liveWork = firestoreEvents
            .filter(doc => doc.showInOurWork === true)
            .map(doc => ({
              id: doc.id,
              title: doc.title,
              category: doc.category || 'Street Action',
              date: doc.date || '',
              time: doc.time || '',
              location: doc.location || '',
              description: doc.description || '',
              imageUrl: doc.imageUrl || 'assets/images/illustrations/event-pedestrian.svg',
              gallery: Array.isArray(doc.gallery) ? doc.gallery : [],
              attendees: doc.attendees || '',
              outcome: doc.outcome || '',
              showInOurWork: true
            }));

          if (liveWork.length > 0) {
            allWork = liveWork;
          }
          buildCategoryFilters();
          renderWorkGrid();
        }
      } catch (err) {
        console.warn("Firestore Our Work fetch fallback:", err);
      }
    }
  }

  // Dynamically generate category filter buttons from actual data
  function buildCategoryFilters() {
    if (!filterContainer) return;

    // Collect distinct categories actually present in allWork
    const categoriesSet = new Set();
    allWork.forEach(item => {
      if (item.category) categoriesSet.add(item.category);
    });

    const categoryList = ['all', ...Array.from(categoriesSet)];

    filterContainer.innerHTML = categoryList.map(cat => {
      const label = cat === 'all' ? 'All Completed Work' : cat;
      const isActive = selectedCategory === cat ? 'active' : '';
      return `
        <button type="button" class="filter-pill-btn ${isActive}" data-category="${escapeHtml(cat)}">
          ${escapeHtml(label)}
        </button>
      `;
    }).join('');

    filterContainer.querySelectorAll('.filter-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterContainer.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCategory = btn.getAttribute('data-category');
        renderWorkGrid();
      });
    });
  }

  // Search input event handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderWorkGrid();
    });
  }

  function getFilteredWork() {
    return allWork.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery) {
        const titleMatch = (item.title || '').toLowerCase().includes(searchQuery);
        const descMatch = (item.description || '').toLowerCase().includes(searchQuery);
        const locMatch = (item.location || '').toLowerCase().includes(searchQuery);
        const catMatch = (item.category || '').toLowerCase().includes(searchQuery);
        if (!titleMatch && !descMatch && !locMatch && !catMatch) return false;
      }
      return true;
    });
  }

  function renderWorkGrid() {
    const filtered = getFilteredWork();

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Project${filtered.length !== 1 ? 's' : ''}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem; background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-xl);">
          <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">🌱</div>
          <h3 style="margin-bottom: 0.35rem; font-size: 1.25rem;">No completed work found</h3>
          <p style="color: var(--text-muted); max-width: 420px; margin: 0 auto 1.25rem auto; font-size: 0.95rem;">
            Try selecting a different category filter or clearing your search term.
          </p>
          <button type="button" class="btn btn-secondary btn-sm" id="reset-work-filter-btn">
            Reset Filters
          </button>
        </div>
      `;

      const resetBtn = grid.querySelector('#reset-work-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          searchQuery = '';
          selectedCategory = 'all';
          buildCategoryFilters();
          renderWorkGrid();
        });
      }
      return;
    }

    grid.innerHTML = filtered.map(item => {
      const imageSrc = item.imageUrl || 'assets/images/illustrations/event-pedestrian.svg';
      const galleryCount = Array.isArray(item.gallery) ? item.gallery.length : 0;

      return `
        <article class="event-card work-showcase-card" data-work-id="${escapeHtml(item.id)}">
          <div class="event-card-media">
            <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.src='assets/images/illustrations/event-pedestrian.svg'">
            <span class="badge-tag badge-teal event-card-badge">
              ✓ Completed Drive
            </span>
            ${galleryCount > 0 ? `
              <span class="work-gallery-badge">
                📷 ${galleryCount} Photo${galleryCount !== 1 ? 's' : ''}
              </span>
            ` : ''}
          </div>

          <div class="event-card-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--color-teal);">
                ${escapeHtml(item.category)}
              </span>
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">
                ${escapeHtml(item.date)}
              </span>
            </div>

            <h3 class="event-card-title">${escapeHtml(item.title)}</h3>
            <p class="event-card-desc">${escapeHtml(item.description)}</p>

            <div class="event-detail-tags">
              ${item.location ? `
                <div class="event-detail-tag-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>${escapeHtml(item.location)}</span>
                </div>
              ` : ''}
              ${item.attendees ? `
                <div class="event-detail-tag-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  <span>Turnout: ${escapeHtml(item.attendees)}</span>
                </div>
              ` : ''}
              ${item.outcome ? `
                <div class="event-detail-tag-item" style="color: var(--color-teal); font-weight: 600;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>${escapeHtml(item.outcome)}</span>
                </div>
              ` : ''}
            </div>

            <div class="event-card-footer" style="margin-top: 1.25rem;">
              <a href="work.html?id=${encodeURIComponent(item.id)}" class="btn btn-teal btn-sm" style="flex: 1; text-align: center;">
                View Project Details →
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Initial render with default static data, then load Firestore
  buildCategoryFilters();
  renderWorkGrid();
  loadFirestoreWork();
}

/* --- 2. Single Project Detail Page (work.html?id=...) --- */
async function initProjectDetailView() {
  const container = document.getElementById('project-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    renderNotFound(container, 'No project ID specified.');
    return;
  }

  // First check static SITE_DATA.events
  let project = (window.SITE_DATA?.events || []).find(e => e.id === projectId);

  // Attempt to fetch from Firestore
  for (let i = 0; i < 15; i++) {
    if (window.PriJivaFirebase?.getPublishedEventById) break;
    await new Promise(r => setTimeout(r, 100));
  }

  if (window.PriJivaFirebase?.getPublishedEventById) {
    try {
      const doc = await window.PriJivaFirebase.getPublishedEventById(projectId);
      if (doc && doc.status === 'published') {
        project = {
          id: doc.id,
          title: doc.title,
          category: doc.category || 'Street Action',
          date: doc.date || '',
          time: doc.time || '',
          location: doc.location || '',
          description: doc.description || '',
          imageUrl: doc.imageUrl || 'assets/images/illustrations/event-pedestrian.svg',
          gallery: Array.isArray(doc.gallery) ? doc.gallery : [],
          attendees: doc.attendees || '',
          outcome: doc.outcome || '',
          rsvpUrl: doc.rsvpUrl || '',
          showInOurWork: doc.showInOurWork
        };
      }
    } catch (err) {
      console.warn("Firestore project fetch error:", err);
    }
  }

  if (!project) {
    renderNotFound(container, 'The requested project could not be found or has not been published yet.');
    return;
  }

  // Render project detail
  renderProjectDetail(container, project);
}

function renderNotFound(container, message) {
  container.innerHTML = `
    <div style="text-align: center; padding: 4rem 1.5rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); max-width: 600px; margin: 3rem auto;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
      <h2 style="margin-bottom: 0.5rem; font-size: 1.5rem;">Project Not Found</h2>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${escapeHtml(message)}</p>
      <a href="our-work.html" class="btn btn-teal">
        ← Back to Our Work
      </a>
    </div>
  `;
}

function renderProjectDetail(container, project) {
  document.title = `${project.title} | Our Work | PriJiva`;

  const coverImg = project.imageUrl || project.image || 'assets/images/illustrations/event-pedestrian.svg';
  const gallery = Array.isArray(project.gallery) ? project.gallery : [];

  container.innerHTML = `
    <!-- Breadcrumbs -->
    <nav class="project-breadcrumb" aria-label="Breadcrumb">
      <a href="our-work.html" class="breadcrumb-back-link">
        ← Back to Our Work
      </a>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">${escapeHtml(project.title)}</span>
    </nav>

    <!-- Project Header & Meta -->
    <header class="project-header-box">
      <div class="project-meta-badges">
        <span class="badge-tag badge-teal">${escapeHtml(project.category || 'Civic Action')}</span>
        <span class="badge-tag badge-pink">✓ Completed &amp; Verified Impact</span>
      </div>

      <h1 class="project-main-title">${escapeHtml(project.title)}</h1>

      <div class="project-meta-grid">
        ${project.date ? `
          <div class="project-meta-card">
            <span class="project-meta-label">📅 Date &amp; Time</span>
            <span class="project-meta-val">${escapeHtml(project.date)}${project.time ? ` • ${escapeHtml(project.time)}` : ''}</span>
          </div>
        ` : ''}
        ${project.location ? `
          <div class="project-meta-card">
            <span class="project-meta-label">📍 Location</span>
            <span class="project-meta-val">${escapeHtml(project.location)}</span>
          </div>
        ` : ''}
        ${project.attendees ? `
          <div class="project-meta-card">
            <span class="project-meta-label">👥 Volunteer Turnout</span>
            <span class="project-meta-val">${escapeHtml(project.attendees)}</span>
          </div>
        ` : ''}
        ${project.outcome ? `
          <div class="project-meta-card highlight-meta">
            <span class="project-meta-label">🎯 Civic Outcome</span>
            <span class="project-meta-val">${escapeHtml(project.outcome)}</span>
          </div>
        ` : ''}
      </div>
    </header>

    <!-- Cover Image Banner -->
    <section class="project-cover-section">
      <div class="project-cover-frame">
        <img src="${escapeHtml(coverImg)}" alt="${escapeHtml(project.title)} cover photo" class="project-cover-img" onerror="this.src='assets/images/illustrations/event-pedestrian.svg'">
      </div>
    </section>

    <!-- Project Narrative & Impact Overview -->
    <section class="project-narrative-section">
      <div class="project-narrative-card">
        <h2 class="project-section-heading">Project Overview &amp; Impact Story</h2>
        <p class="project-description-text">${escapeHtml(project.description)}</p>

        ${project.outcome ? `
          <div class="project-impact-banner">
            <div class="impact-banner-icon">🏆</div>
            <div>
              <h4 style="font-size: 1rem; margin-bottom: 0.25rem; color: var(--color-indigo);">Key Civic Milestone Achieved</h4>
              <p style="font-size: 0.92rem; color: var(--text-secondary); margin: 0;">${escapeHtml(project.outcome)}</p>
            </div>
          </div>
        ` : ''}
      </div>
    </section>

    <!-- Photo Gallery (Up to 5 Photos) -->
    ${gallery.length > 0 ? `
      <section class="project-gallery-section">
        <div class="project-gallery-header">
          <h2 class="project-section-heading" style="margin-bottom: 0;">
            Event Photo Gallery
          </h2>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">
            ${gallery.length} Verified Field Photo${gallery.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">
          Click any photo to view full size in high definition.
        </p>

        <div class="project-gallery-grid">
          ${gallery.map((imgUrl, idx) => `
            <div class="project-gallery-item" data-full-img="${escapeHtml(imgUrl)}" data-img-index="${idx + 1}">
              <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(project.title)} photo ${idx + 1}" loading="lazy">
              <div class="gallery-item-overlay">
                <span>🔍 View Photo</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Call to Action & Navigation -->
    <section class="project-footer-cta">
      <div class="cta-inner-box">
        <h3>Inspired by this Civic Drive?</h3>
        <p>Join over 1,200 youth volunteers across Bengaluru making public spaces cleaner, safer, and Civically Abled.</p>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-top: 1.25rem;">
          <button type="button" class="btn btn-teal" data-open-modal="volunteer-modal">
            Join the Movement →
          </button>
          <button type="button" class="btn btn-outline" id="share-project-btn">
            🔗 Share Project
          </button>
          <a href="our-work.html" class="btn btn-secondary">
            Explore All Work
          </a>
        </div>
      </div>
    </section>

    <!-- Lightbox Modal -->
    <div id="project-lightbox" class="project-lightbox-modal" role="dialog" aria-modal="true" style="display: none;">
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content">
        <button type="button" class="lightbox-close-btn" aria-label="Close photo view">✕</button>
        <img id="lightbox-img" src="" alt="Enlarged photo">
        <div id="lightbox-caption" class="lightbox-caption"></div>
      </div>
    </div>
  `;

  // Attach Lightbox event handlers
  initLightbox();

  // Share button
  const shareBtn = container.querySelector('#share-project-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        if (typeof window.showToast === 'function') {
          window.showToast('Project link copied to clipboard! 📢', 'success');
        }
      });
    });
  }
}

/* --- 3. Lightbox Component --- */
function initLightbox() {
  const lightbox = document.getElementById('project-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  if (!lightbox || !lightboxImg) return;

  const closeBtn = lightbox.querySelector('.lightbox-close-btn');
  const backdrop = lightbox.querySelector('.lightbox-backdrop');

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-full-img');
      const idx = item.getAttribute('data-img-index');
      openLightbox(src, `Photo ${idx}`);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
