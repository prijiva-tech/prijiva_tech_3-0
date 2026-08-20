import {
  signInAdmin,
  signOutAdmin,
  onAuthStateChange,
  getCurrentUserToken,
  checkAdminStatus,
  getPublishedEvents,
  getAllAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getTodayIST,
  isValidEventDate,
  deriveEventLifecycle
} from "./firebaseConfig.js";

const firebase = {
  signInAdmin,
  signOutAdmin,
  onAuthStateChange,
  getCurrentUserToken,
  checkAdminStatus,
  getPublishedEvents,
  getAllAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getTodayIST,
  isValidEventDate,
  deriveEventLifecycle
};

let currentAdmin = null;
let allEvents = [];
let activeFilter = 'all';
let searchQuery = '';
let editingEventId = null;
let editingEventStatus = null;
let currentGalleryUrls = [];

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAdminApp();
  });
} else {
  initAdminApp();
}

function initAdminApp() {
  console.log("PriJiva Firebase layer loaded. Initializing admin app.");

  // DOM Views
  const loginView = document.getElementById('admin-login-view');
  const deniedView = document.getElementById('admin-denied-view');
  const dashboardView = document.getElementById('admin-dashboard-view');
  const loginForm = document.getElementById('admin-login-form');
  const loginAlert = document.getElementById('admin-login-alert');
  const signOutBtns = document.querySelectorAll('.btn-admin-signout');

  // Auth State Listener
  firebase.onAuthStateChange(async (user) => {
    if (!user) {
      currentAdmin = null;
      showView('login');
      return;
    }

    // Verify Admin Authorization via /admins/{uid}
    const statusResult = await firebase.checkAdminStatus(user.uid);
    if (statusResult.isApproved) {
      currentAdmin = {
        uid: user.uid,
        email: user.email,
        ...statusResult.adminData
      };
      updateAdminHeaderUI(currentAdmin);
      showView('dashboard');
      loadAdminEvents();
    } else {
      currentAdmin = null;
      showView('denied');
    }
  });

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value.trim();
      const password = document.getElementById('admin-password').value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      if (loginAlert) {
        loginAlert.classList.remove('show');
        loginAlert.textContent = '';
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Verifying...';

      try {
        await firebase.signInAdmin(email, password);
        // onAuthStateChange handles next steps
      } catch (err) {
        console.error("Login failed:", err);
        if (loginAlert) {
          loginAlert.textContent = getFriendlyAuthError(err.code);
          loginAlert.classList.add('show');
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In to Admin Portal →';
      }
    });
  }

  // Sign Out Handlers
  signOutBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await firebase.signOutAdmin();
        if (window.showToast) window.showToast('Signed out successfully.');
      } catch (err) {
        console.error("Sign out error:", err);
      }
    });
  });

  // Setup Dashboard Interactions
  initDashboardEvents();
  initImageUploadWidget();
  initGalleryUploadWidget();
}

function showView(viewName) {
  const loginView = document.getElementById('admin-login-view');
  const deniedView = document.getElementById('admin-denied-view');
  const dashboardView = document.getElementById('admin-dashboard-view');

  if (loginView) loginView.classList.toggle('active', viewName === 'login');
  if (deniedView) deniedView.classList.toggle('active', viewName === 'denied');
  if (dashboardView) dashboardView.classList.toggle('active', viewName === 'dashboard');
}

function updateAdminHeaderUI(admin) {
  const nameEl = document.getElementById('admin-user-name');
  const deptEl = document.getElementById('admin-user-dept');
  const roleBadge = document.getElementById('admin-role-badge');

  if (nameEl) nameEl.textContent = admin.name || admin.email;
  if (deptEl) deptEl.textContent = admin.department || 'Department Head';
  if (roleBadge) {
    roleBadge.textContent = admin.role === 'owner' ? 'Owner / Governance' : 'Department Head';
  }
}

/* --- Direct Image Upload Widget (Cloudflare Signer + Cloudinary) --- */
function initImageUploadWidget() {
  const fileInput = document.getElementById('event-file-input');
  const chooseBtn = document.getElementById('btn-choose-image');
  const replaceBtn = document.getElementById('btn-replace-image');
  const removeBtn = document.getElementById('btn-remove-image');
  const idleState = document.getElementById('upload-idle-state');
  const progressState = document.getElementById('upload-progress-state');
  const previewState = document.getElementById('upload-preview-state');
  const progressBar = document.getElementById('upload-progress-bar');
  const progressPct = document.getElementById('upload-percentage');
  const errorAlert = document.getElementById('upload-error-alert');
  const imgUrlInput = document.getElementById('event-img-url');
  const previewImg = document.getElementById('event-img-preview');

  if (chooseBtn && fileInput) {
    chooseBtn.addEventListener('click', () => fileInput.click());
  }

  if (replaceBtn && fileInput) {
    replaceBtn.addEventListener('click', () => fileInput.click());
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      if (imgUrlInput) imgUrlInput.value = '';
      if (fileInput) fileInput.value = '';
      if (idleState) idleState.style.display = 'block';
      if (previewState) previewState.style.display = 'none';
      if (progressState) progressState.style.display = 'none';
      if (errorAlert) errorAlert.classList.remove('show');
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 1. Client-side File Validation
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
      const ext = '.' + file.name.split('.').pop().toLowerCase();

      if (!allowedMimes.includes(file.type) && !allowedExts.includes(ext)) {
        showUploadError('Invalid file type. Please choose a JPG, PNG, or WebP image.');
        fileInput.value = '';
        return;
      }

      const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
      if (file.size > MAX_SIZE) {
        showUploadError('Image size exceeds 5 MB limit. Please select a smaller file.');
        fileInput.value = '';
        return;
      }

      // 2. Begin Upload UI Transition
      if (errorAlert) errorAlert.classList.remove('show');
      if (idleState) idleState.style.display = 'none';
      if (previewState) previewState.style.display = 'none';
      if (progressState) progressState.style.display = 'block';
      if (progressBar) progressBar.style.width = '0%';
      if (progressPct) progressPct.textContent = '0%';

      try {
        // 3. Obtain Firebase ID Token from SDK
        const idToken = await getCurrentUserToken();
        if (!idToken) {
          throw new Error('Authentication session expired. Please sign in again.');
        }

        // 4. Request Upload Signature from Cloudflare Worker
        const signerUrl = window.PRIJIVA_WORKER_URL || 'https://prijiva-upload-signer.prijivatech.workers.dev';
        const signRes = await fetch(`${signerUrl}/sign-upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!signRes.ok) {
          const errData = await signRes.json().catch(() => ({}));
          throw new Error(errData.error || `Upload signing failed (${signRes.status})`);
        }

        const { signature, timestamp, apiKey, cloudName, folder } = await signRes.json();

        // 5. Direct Upload to Cloudinary via XMLHttpRequest (for progress tracking)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', uploadUrl);

          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable) {
              const pct = Math.round((evt.loaded / evt.total) * 100);
              if (progressBar) progressBar.style.width = `${pct}%`;
              if (progressPct) progressPct.textContent = `${pct}%`;
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                if (response.secure_url) {
                  resolve(response.secure_url);
                } else {
                  reject(new Error('Cloudinary response missing secure_url'));
                }
              } catch (parseErr) {
                reject(new Error('Invalid response from Cloudinary'));
              }
            } else {
              reject(new Error(`Cloudinary upload failed (HTTP ${xhr.status})`));
            }
          };

          xhr.onerror = () => reject(new Error('Network error connecting to Cloudinary.'));
          xhr.send(formData);
        }).then((secureUrl) => {
          // 6. Upload Success: Update form and preview
          if (imgUrlInput) imgUrlInput.value = secureUrl;
          if (previewImg) previewImg.src = secureUrl;
          if (progressState) progressState.style.display = 'none';
          if (previewState) previewState.style.display = 'block';
          if (idleState) idleState.style.display = 'none';
          if (window.showToast) window.showToast('Event image uploaded to Cloudinary! 📷', 'success');
        });

      } catch (uploadErr) {
        console.error('Image upload failed:', uploadErr);
        showUploadError(uploadErr.message || 'Image upload failed. Please try again.');
        if (progressState) progressState.style.display = 'none';
        if (idleState) idleState.style.display = 'block';
      }
    });
  }

  // Advanced Fallback Input Live Sync
  if (imgUrlInput) {
    imgUrlInput.addEventListener('input', () => {
      const url = imgUrlInput.value.trim();
      if (url.startsWith('https://res.cloudinary.com/')) {
        if (previewImg) previewImg.src = url;
        if (previewState) previewState.style.display = 'block';
        if (idleState) idleState.style.display = 'none';
      } else if (!url) {
        if (idleState) idleState.style.display = 'block';
        if (previewState) previewState.style.display = 'none';
      }
    });
  }

  function showUploadError(msg) {
    if (errorAlert) {
      errorAlert.textContent = msg;
      errorAlert.classList.add('show');
    } else {
      alert(msg);
    }
  }
}

/* --- Event Gallery Upload Widget (Up to 5 Photos) --- */
function initGalleryUploadWidget() {
  const galleryInput = document.getElementById('gallery-file-input');
  const addBtn = document.getElementById('btn-add-gallery-images');
  const progressState = document.getElementById('gallery-progress-state');
  const progressBar = document.getElementById('gallery-progress-bar');
  const progressPct = document.getElementById('gallery-percentage');
  const statusText = document.getElementById('gallery-status-text');
  const errorAlert = document.getElementById('gallery-error-alert');

  if (addBtn && galleryInput) {
    addBtn.addEventListener('click', () => {
      if (currentGalleryUrls.length >= 5) {
        showGalleryError('You can add up to 5 gallery images.');
        return;
      }
      galleryInput.click();
    });
  }

  if (galleryInput) {
    galleryInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      if (errorAlert) {
        errorAlert.style.display = 'none';
        errorAlert.textContent = '';
      }

      if (currentGalleryUrls.length + files.length > 5) {
        showGalleryError('You can add up to 5 gallery images.');
        galleryInput.value = '';
        return;
      }

      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
      const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

      for (const file of files) {
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedMimes.includes(file.type) && !allowedExts.includes(ext)) {
          showGalleryError('Unsupported image format. Please choose JPG, PNG, or WebP.');
          galleryInput.value = '';
          return;
        }
        if (file.size > MAX_SIZE) {
          showGalleryError('Image is too large. Maximum size is 5 MB.');
          galleryInput.value = '';
          return;
        }
      }

      if (progressState) progressState.style.display = 'block';
      if (progressBar) progressBar.style.width = '0%';
      if (progressPct) progressPct.textContent = '0%';

      try {
        const idToken = await getCurrentUserToken();
        if (!idToken) {
          throw new Error('Authentication session expired. Please sign in again.');
        }

        const signerUrl = window.PRIJIVA_WORKER_URL || 'https://prijiva-upload-signer.prijivatech.workers.dev';

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (statusText) {
            statusText.textContent = `Uploading photo ${i + 1} of ${files.length}...`;
          }

          const signRes = await fetch(`${signerUrl}/sign-upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (!signRes.ok) {
            const errData = await signRes.json().catch(() => ({}));
            throw new Error(errData.error || `Upload signing failed (${signRes.status})`);
          }

          const { signature, timestamp, apiKey, cloudName, folder } = await signRes.json();

          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', apiKey);
          formData.append('timestamp', timestamp);
          formData.append('signature', signature);
          formData.append('folder', folder);

          const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

          const secureUrl = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', uploadUrl);

            xhr.upload.onprogress = (evt) => {
              if (evt.lengthComputable && progressBar && progressPct) {
                const totalProgress = Math.round(((i + (evt.loaded / evt.total)) / files.length) * 100);
                progressBar.style.width = `${totalProgress}%`;
                progressPct.textContent = `${totalProgress}%`;
              }
            };

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  const res = JSON.parse(xhr.responseText);
                  if (res.secure_url) resolve(res.secure_url);
                  else reject(new Error('Cloudinary response missing secure_url'));
                } catch {
                  reject(new Error('Invalid response from Cloudinary'));
                }
              } else {
                reject(new Error(`Cloudinary upload failed (HTTP ${xhr.status})`));
              }
            };

            xhr.onerror = () => reject(new Error('Network error connecting to Cloudinary.'));
            xhr.send(formData);
          });

          if (secureUrl && secureUrl.startsWith('https://res.cloudinary.com/')) {
            currentGalleryUrls.push(secureUrl);
            renderGalleryThumbnails();
          }
        }

        if (window.showToast) window.showToast('Gallery photos uploaded successfully!', 'success');
      } catch (err) {
        console.error('Gallery upload error:', err);
        showGalleryError(err.message || 'Gallery upload failed.');
      } finally {
        if (progressState) progressState.style.display = 'none';
        galleryInput.value = '';
      }
    });
  }
}

function showGalleryError(msg) {
  const errorAlert = document.getElementById('gallery-error-alert');
  if (errorAlert) {
    errorAlert.textContent = msg;
    errorAlert.style.display = 'block';
  }
}

function renderGalleryThumbnails() {
  const container = document.getElementById('gallery-thumbnails-grid');
  const countBadge = document.getElementById('gallery-count-badge');

  if (countBadge) {
    countBadge.textContent = `${currentGalleryUrls.length} / 5 Photos`;
  }

  if (!container) return;

  if (currentGalleryUrls.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 0.75rem; text-align: center; font-size: 0.8rem; color: var(--text-muted); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
        No gallery photos added yet. Click "+ Add Event Photos" above.
      </div>
    `;
    return;
  }

  container.innerHTML = currentGalleryUrls.map((url, idx) => `
    <div class="gallery-thumb-card">
      <img src="${escapeHtml(url)}" alt="Gallery photo ${idx + 1}" loading="lazy">
      <span class="gallery-thumb-badge">#${idx + 1}</span>
      <button type="button" class="gallery-thumb-remove" onclick="removeGalleryImage(${idx})">
        ✕ Remove
      </button>
    </div>
  `).join('');
}

window.removeGalleryImage = function (index) {
  if (index >= 0 && index < currentGalleryUrls.length) {
    currentGalleryUrls.splice(index, 1);
    renderGalleryThumbnails();
  }
};

/* --- Dashboard Events & Filtering --- */
function initDashboardEvents() {
  const createBtn = document.getElementById('btn-create-event');
  const eventModal = document.getElementById('admin-event-modal');
  const eventForm = document.getElementById('admin-event-form');
  const searchInput = document.getElementById('admin-search-events');
  const filterTabs = document.querySelectorAll('.admin-tab-btn');
  const imgUrlInput = document.getElementById('event-img-url');
  const imgPreview = document.getElementById('event-img-preview');
  const imgPlaceholder = document.getElementById('event-img-placeholder');

  // Open Create Modal
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      openEventModal();
    });
  }

  // Live Cloudinary Image Preview
  if (imgUrlInput && imgPreview && imgPlaceholder) {
    imgUrlInput.addEventListener('input', () => {
      const url = imgUrlInput.value.trim();
      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        imgPreview.src = url;
        imgPreview.style.display = 'block';
        imgPlaceholder.style.display = 'none';
        imgPreview.onerror = () => {
          imgPreview.style.display = 'none';
          imgPlaceholder.style.display = 'block';
          imgPlaceholder.textContent = 'Unable to load preview (check URL)';
        };
      } else {
        imgPreview.style.display = 'none';
        imgPlaceholder.style.display = 'block';
        imgPlaceholder.textContent = 'Paste Cloudinary Image URL to preview';
      }
    });
  }

  // Filter Tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.getAttribute('data-filter') || 'all';
      renderEventsTable();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderEventsTable();
    });
  }

  // Event Form Submit (Create / Edit)
  if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleSaveEvent();
    });
  }
}

async function loadAdminEvents() {
  const tbody = document.getElementById('admin-events-tbody');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
        Loading PriJiva events...
      </td>
    </tr>
  `;

  try {
    allEvents = await firebase.getAllAdminEvents();
    updateStatsCounter();
    renderEventsTable();
  } catch (err) {
    console.error("Error loading events:", err);
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--color-pink);">
          Error loading events from Firestore. Please check your connection.
        </td>
      </tr>
    `;
  }
}

function updateStatsCounter() {
  const totalEl = document.getElementById('stat-total-events');
  const publishedEl = document.getElementById('stat-published-events');
  const draftEl = document.getElementById('stat-draft-events');
  const archivedEl = document.getElementById('stat-archived-events');

  const total = allEvents.length;
  const published = allEvents.filter(e => e.status === 'published').length;
  const draft = allEvents.filter(e => e.status === 'draft').length;
  const archived = allEvents.filter(e => e.status === 'archived').length;

  if (totalEl) totalEl.textContent = total;
  if (publishedEl) publishedEl.textContent = published;
  if (draftEl) draftEl.textContent = draft;
  if (archivedEl) archivedEl.textContent = archived;
}

function getFilteredEvents() {
  return allEvents.filter(item => {
    // Status filter
    if (activeFilter !== 'all' && item.status !== activeFilter) return false;

    // Search query
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

function renderEventsTable() {
  const tbody = document.getElementById('admin-events-tbody');
  if (!tbody) return;

  const filtered = getFilteredEvents();

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
          <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">📋</div>
          <strong>No events found matching your filter.</strong>
          <p style="font-size: 0.85rem; margin-top: 0.25rem;">Click "+ Create New Event" to add a new civic drive.</p>
        </td>
      </tr>
    `;
    return;
  }

  const isOwner = Boolean(currentAdmin && currentAdmin.role === 'owner');

  tbody.innerHTML = filtered.map(item => {
    const isPublished = item.status === 'published';
    const isArchived = item.status === 'archived';
    const isDraft = item.status === 'draft';
    const lifecycle = deriveEventLifecycle(item);

    let badgeClass = 'badge-draft';
    let badgeLabel = 'DRAFT';
    let badgeStyle = '';

    if (isArchived) {
      badgeClass = 'badge-archived';
      badgeLabel = 'ARCHIVED';
    } else if (isDraft) {
      badgeClass = 'badge-draft';
      badgeLabel = 'DRAFT';
    } else if (lifecycle === 'upcoming') {
      badgeClass = 'badge-published';
      badgeLabel = 'UPCOMING';
    } else if (lifecycle === 'completed') {
      badgeClass = 'badge-completed';
      badgeLabel = 'COMPLETED';
      badgeStyle = '';
    }

    const thumbSrc = item.imageUrl || '../assets/images/illustrations/event-pedestrian.svg';

    return `
      <tr data-event-id="${item.id}">
        <td>
          <div class="admin-event-row-flex">
            <img src="${thumbSrc}" alt="" class="admin-event-thumb" onerror="this.src='../assets/images/illustrations/event-pedestrian.svg'">
            <div>
              <div class="admin-event-title">
                ${escapeHtml(item.title || 'Untitled Event')}
                ${item.showInOurWork ? '<span class="badge-tag badge-teal" style="font-size: 0.65rem; padding: 1px 5px; margin-left: 4px; vertical-align: middle;">Our Work</span>' : ''}
                ${item.gallery && item.gallery.length > 0 ? `<span class="badge-tag badge-pink" style="font-size: 0.65rem; padding: 1px 5px; margin-left: 4px; vertical-align: middle;">📷 ${item.gallery.length}</span>` : ''}
              </div>
              <div class="admin-event-meta">${escapeHtml(item.category || 'General Action')} • ${escapeHtml(item.location || 'Location TBD')}</div>
            </div>
          </div>
        </td>
        <td>
          <span style="font-size: 0.88rem; font-weight: 600;">${escapeHtml(item.date || item.eventDate || 'TBD')}</span>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(item.time || '')}</div>
        </td>
        <td>
          <span class="admin-status-badge ${badgeClass}" ${badgeStyle}>${badgeLabel}</span>
        </td>
        <td>
          ${item.rsvpUrl ? `<a href="${escapeHtml(item.rsvpUrl)}" target="_blank" style="font-size: 0.8rem; color: var(--color-teal); text-decoration: underline;">Google Form</a>` : '<span style="color: var(--text-muted); font-size: 0.8rem;">None</span>'}
        </td>
        <td>
          <div class="admin-actions-cell">
            <button type="button" class="admin-btn-action" onclick="openEditEventModal('${item.id}')">
              Edit
            </button>
            ${isDraft ? `
              <button type="button" class="admin-btn-action" onclick="quickToggleStatus('${item.id}', 'published')">
                Publish
              </button>
            ` : ''}
            ${isPublished ? `
              <button type="button" class="admin-btn-action" onclick="quickToggleStatus('${item.id}', 'draft')">
                Unpublish
              </button>
              ${lifecycle === 'completed' ? `
                <button type="button" class="admin-btn-action admin-btn-archive" onclick="archiveEvent('${item.id}', '${escapeHtml(item.title || '')}')">
                  Archive
                </button>
              ` : ''}
            ` : ''}
            ${isArchived ? `
              <button type="button" class="admin-btn-action admin-btn-restore" onclick="restoreEvent('${item.id}', '${escapeHtml(item.title || '')}')">
                Restore
              </button>
            ` : ''}
            ${isOwner ? `
              <button type="button" class="admin-btn-action admin-btn-delete" title="Permanent removal (Owner only)" onclick="confirmDeleteEvent('${item.id}', '${escapeHtml(item.title || '')}')">
                Delete Permanently
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/* --- Event Modal Handling (Create / Edit) --- */
function openEventModal(eventData = null) {
  editingEventId = eventData ? eventData.id : null;
  editingEventStatus = eventData?.status || null;
  const modal = document.getElementById('admin-event-modal');
  const titleEl = document.getElementById('admin-modal-title');
  const form = document.getElementById('admin-event-form');
  const imgPreview = document.getElementById('event-img-preview');
  const idleState = document.getElementById('upload-idle-state');
  const previewState = document.getElementById('upload-preview-state');
  const progressState = document.getElementById('upload-progress-state');
  const errorAlert = document.getElementById('upload-error-alert');
  const fileInput = document.getElementById('event-file-input');
  const isoInput = document.getElementById('event-date-iso');
  const displayDateInput = document.getElementById('event-date');

  if (titleEl) {
    titleEl.textContent = editingEventId ? 'Edit PriJiva Event' : 'Create New PriJiva Event';
  }

  if (fileInput) fileInput.value = '';
  if (errorAlert) errorAlert.classList.remove('show');
  if (progressState) progressState.style.display = 'none';

  if (form) {
    document.getElementById('event-title').value = eventData?.title || '';
    document.getElementById('event-category').value = eventData?.category || 'Street Action';
    
    // Populate ISO date & Display date
    let initialIso = eventData?.eventDate || '';
    if (!initialIso && eventData?.date && isValidEventDate(eventData.date)) {
      initialIso = eventData.date;
    }
    if (isoInput) isoInput.value = initialIso;
    if (displayDateInput) displayDateInput.value = eventData?.date || '';

    // Auto-generate display date if empty when user selects calendar date
    if (isoInput && displayDateInput) {
      isoInput.onchange = () => {
        if (isoInput.value && !displayDateInput.value) {
          const [y, m, d] = isoInput.value.split('-');
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const monthName = months[parseInt(m, 10) - 1] || m;
          displayDateInput.value = `${monthName} ${parseInt(d, 10)}, ${y}`;
        }
      };
    }

    document.getElementById('event-time').value = eventData?.time || '';
    document.getElementById('event-location').value = eventData?.location || '';
    document.getElementById('event-description').value = eventData?.description || '';
    document.getElementById('event-img-url').value = eventData?.imageUrl || '';
    document.getElementById('event-rsvp-url').value = eventData?.rsvpUrl || '';
    document.getElementById('event-attendees').value = eventData?.attendees || '';
    document.getElementById('event-outcome').value = eventData?.outcome || '';
    
    // Status: If editing an archived event, preserve archived state and disable status selection
    const statusSelect = document.getElementById('event-status');
    if (statusSelect) {
      const tempArchivedOpt = statusSelect.querySelector('option[data-temp-archived]');
      if (tempArchivedOpt) tempArchivedOpt.remove();

      if (eventData?.status === 'archived') {
        const opt = document.createElement('option');
        opt.value = 'archived';
        opt.textContent = 'Archived (Use "Restore" on dashboard to republish)';
        opt.setAttribute('data-temp-archived', 'true');
        statusSelect.appendChild(opt);
        statusSelect.value = 'archived';
        statusSelect.disabled = true;
      } else {
        statusSelect.disabled = false;
        statusSelect.value = eventData?.status === 'draft' ? 'draft' : 'published';
      }
    }

    const showInOurWorkEl = document.getElementById('event-show-in-our-work');
    if (showInOurWorkEl) {
      showInOurWorkEl.checked = Boolean(eventData?.showInOurWork);
    }
  }

  // Update gallery state
  currentGalleryUrls = Array.isArray(eventData?.gallery) ? [...eventData.gallery] : [];
  const galleryErrorAlert = document.getElementById('gallery-error-alert');
  if (galleryErrorAlert) {
    galleryErrorAlert.style.display = 'none';
    galleryErrorAlert.textContent = '';
  }
  const galleryProgressState = document.getElementById('gallery-progress-state');
  if (galleryProgressState) galleryProgressState.style.display = 'none';
  renderGalleryThumbnails();

  // Update preview image state
  if (eventData?.imageUrl) {
    if (imgPreview) imgPreview.src = eventData.imageUrl;
    if (previewState) previewState.style.display = 'block';
    if (idleState) idleState.style.display = 'none';
  } else {
    if (previewState) previewState.style.display = 'none';
    if (idleState) idleState.style.display = 'block';
  }

  if (window.openModal) window.openModal('admin-event-modal');
}

window.openEditEventModal = function (eventId) {
  const event = allEvents.find(e => e.id === eventId);
  if (event) {
    openEventModal(event);
  }
};

async function handleSaveEvent() {
  if (!currentAdmin) return;

  const eventDate = document.getElementById('event-date-iso')?.value?.trim() || '';
  let displayDate = document.getElementById('event-date')?.value?.trim() || '';

  if (!eventDate || !isValidEventDate(eventDate)) {
    alert('Please select a valid Calendar Date (YYYY-MM-DD) for this event.');
    return;
  }

  if (!displayDate) {
    const [y, m, d] = eventDate.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parseInt(m, 10) - 1] || m;
    displayDate = `${monthName} ${parseInt(d, 10)}, ${y}`;
  }

  // Determine final status: editing an archived event strictly preserves archived status
  let finalStatus = document.getElementById('event-status')?.value || 'published';
  if (editingEventStatus === 'archived') {
    finalStatus = 'archived';
  }

  const eventPayload = {
    title: document.getElementById('event-title').value.trim(),
    category: document.getElementById('event-category').value,
    eventDate: eventDate,
    date: displayDate,
    time: document.getElementById('event-time').value.trim(),
    location: document.getElementById('event-location').value.trim(),
    description: document.getElementById('event-description').value.trim(),
    imageUrl: document.getElementById('event-img-url').value.trim(),
    gallery: currentGalleryUrls,
    showInOurWork: Boolean(document.getElementById('event-show-in-our-work')?.checked),
    rsvpUrl: document.getElementById('event-rsvp-url').value.trim(),
    attendees: document.getElementById('event-attendees').value.trim(),
    outcome: document.getElementById('event-outcome').value.trim(),
    status: finalStatus
  };

  // Strict Validation: Event Image URL must be from res.cloudinary.com
  if (eventPayload.imageUrl && !eventPayload.imageUrl.startsWith('https://res.cloudinary.com/')) {
    alert('Invalid Image URL: Event image must be a secure HTTPS Cloudinary delivery URL starting with https://res.cloudinary.com/');
    return;
  }

  // Strict Validation: Gallery URLs must all be from res.cloudinary.com
  for (const url of eventPayload.gallery) {
    if (!url.startsWith('https://res.cloudinary.com/')) {
      alert('Invalid Gallery Image: All gallery images must be secure HTTPS Cloudinary delivery URLs starting with https://res.cloudinary.com/');
      return;
    }
  }

  const submitBtn = document.getElementById('btn-save-event-submit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
  }

  try {
    if (editingEventId) {
      await firebase.updateEvent(editingEventId, eventPayload);
      if (window.showToast) window.showToast('Event updated successfully!');
    } else {
      await firebase.createEvent(eventPayload, currentAdmin);
      if (window.showToast) window.showToast('Event created successfully!');
    }

    if (window.closeModal) window.closeModal('admin-event-modal');
    await loadAdminEvents();
  } catch (err) {
    console.error("Error saving event:", err);
    alert('Failed to save event: ' + err.message);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Event';
    }
  }
}

window.quickToggleStatus = async function (eventId, newStatus) {
  try {
    await firebase.updateEvent(eventId, { status: newStatus });
    if (window.showToast) window.showToast(`Status changed to ${newStatus.toUpperCase()}`);
    await loadAdminEvents();
  } catch (err) {
    console.error("Error updating status:", err);
    alert('Failed to update event status: ' + err.message);
  }
};

window.archiveEvent = async function (eventId, title) {
  const confirmed = confirm(`Archive "${title || 'this event'}"? It will be hidden from public pages but retained in Firestore archives.`);
  if (!confirmed) return;

  try {
    await firebase.updateEvent(eventId, { status: 'archived' });
    if (window.showToast) window.showToast('Event archived.');
    await loadAdminEvents();
  } catch (err) {
    console.error("Error archiving event:", err);
    alert('Failed to archive event: ' + err.message);
  }
};

window.restoreEvent = async function (eventId, title) {
  try {
    await firebase.updateEvent(eventId, { status: 'published' });
    if (window.showToast) window.showToast('Event restored to Published.');
    await loadAdminEvents();
  } catch (err) {
    console.error("Error restoring event:", err);
    alert('Failed to restore event: ' + err.message);
  }
};

window.confirmDeleteEvent = async function (eventId, title) {
  if (!currentAdmin || currentAdmin.role !== 'owner') {
    alert('Permission Denied: Only the Organization Owner can permanently delete event records.');
    return;
  }

  const confirmed = confirm(
    `WARNING: Are you sure you want to permanently delete "${title || 'this event'}"?\n\nThis will permanently remove the Firestore document from the database and cannot be undone.`
  );
  if (!confirmed) return;

  try {
    await firebase.deleteEvent(eventId);
    if (window.showToast) window.showToast('Event permanently deleted.');
    await loadAdminEvents();
  } catch (err) {
    console.error("Error deleting event:", err);
    alert('Failed to delete event: ' + err.message);
  }
};

function getFriendlyAuthError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/user-disabled':
      return 'This Department Head account has been disabled by the owner.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment before trying again.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    default:
      return 'Authentication failed. Please verify your credentials.';
  }
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
