/* Divine Destiny Schools — shared site behavior
   Loaded on every page. Keeps nav, WhatsApp button, and form helpers
   consistent so nothing has to be duplicated per page. */

const WHATSAPP_NUMBER = '2348100794287';
const WHATSAPP_MESSAGE = 'Hello, I am interested in learning more about Divine Destiny Academy / Divine Destiny Comprehensive Academy. Please provide me with more information about admissions.';

document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initNavMenu();
  injectWhatsAppButton();
  initAccordions();
  initModalCloseOnOverlay();
});

/* ---------- Sticky nav shadow ---------- */
function initStickyNav(){
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  });
}

/* ---------- Nav hamburger: desktop dropdown (Academics, Student Life,
   News & Events, Downloads) + full vertical panel on mobile/tablet.
   Same button, same markup — CSS decides what's visible per breakpoint. ---------- */
function initNavMenu(){
  const toggle = document.getElementById('navMenuToggle');
  const panel = document.getElementById('navDropdownMenu');
  if (!toggle || !panel) return;

  // Guard against duplicate initialization (e.g. if a script is loaded twice)
  if (toggle.dataset.navBound === 'true') return;
  toggle.dataset.navBound = 'true';

  function openMenu(){
    panel.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
  }
  function closeMenu(){
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
  }
  function isOpen(){ return panel.classList.contains('open'); }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen() ? closeMenu() : openMenu();
  });

  // Close when a menu link is clicked, then let navigation proceed
  panel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  // Close when clicking anywhere outside the panel/button
  document.addEventListener('click', (e) => {
    if (!isOpen()) return;
    if (panel.contains(e.target) || toggle.contains(e.target)) return;
    closeMenu();
  });

  // Close on Escape, return focus to the toggle button
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()){
      closeMenu();
      toggle.focus();
    }
  });

  // Keep menu state sane if the viewport crosses the responsive breakpoint
  window.addEventListener('resize', () => {
    if (isOpen()) closeMenu();
  });
}

/* ---------- Floating WhatsApp button (injected once, every page) ---------- */
function injectWhatsAppButton(){
  if (document.querySelector('.wa-float')) return; // don't duplicate
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  const wrap = document.createElement('div');
  wrap.className = 'wa-float';
  wrap.innerHTML = `
    <span class="wa-tooltip">Chat with Us on WhatsApp</span>
    <a class="wa-btn" href="${url}" target="_blank" rel="noopener" aria-label="Chat with Divine Destiny Schools on WhatsApp">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5C10 9 9.4 7.6 9.1 7c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3C6.9 7.3 6.3 8 6.3 9.4c0 1.4 1 2.8 1.1 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.1-1.4-.1-.1-.3-.2-.6-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5C8.3 21.5 10.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.7 0-3.4-.5-4.8-1.3l-.3-.2-3.2 1 1-3.2-.2-.3C3.5 15 3 13.6 3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9z"/></svg>
    </a>`;
  document.body.appendChild(wrap);
}

/* ---------- Accordion (FAQ etc) ---------- */
function initAccordions(){
  document.querySelectorAll('.accordion-head').forEach(head => {
    head.addEventListener('click', () => {
      const item = head.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');
      // close siblings in the same accordion group
      const group = item.parentElement;
      group.querySelectorAll('.accordion-item.open').forEach(o => {
        if (o !== item){ o.classList.remove('open'); o.querySelector('.accordion-body').style.maxHeight = null; }
      });
      item.classList.toggle('open', !isOpen);
      body.style.maxHeight = !isOpen ? body.scrollHeight + 'px' : null;
    });
  });
}

/* ---------- Modal helpers (used by Student Life "Read More") ---------- */
function openModal(id){
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}
function closeModal(id){
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}
function initModalCloseOnOverlay(){
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(o => o.classList.remove('open'));
  });
}

/* ---------- Toast ---------- */
function showToast(message, type = 'success'){
  let toast = document.querySelector('.toast');
  if (!toast){
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = 'toast' + (type === 'error' ? ' error' : '');
  toast.innerHTML = (type === 'error' ? '⚠ ' : '✓ ') + message;
  requestAnimationFrame(() => toast.classList.add('show'));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3800);
}

/* ---------- Field validation helpers ---------- */
function setFieldError(fieldEl, message){
  fieldEl.classList.add('has-error');
  let err = fieldEl.querySelector('.field-error');
  if (!err){
    err = document.createElement('span');
    err.className = 'field-error';
    fieldEl.appendChild(err);
  }
  err.textContent = message;
}
function clearFieldError(fieldEl){
  fieldEl.classList.remove('has-error');
}
function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidPhone(v){ return /^[0-9+\s-]{7,15}$/.test(v); }

/* ---------- Placeholder document download (until real files/backend are wired in) ---------- */
function downloadPlaceholder(title, filename){
  const body =
`Divine Destiny Schools
${title}

This is a placeholder document generated by the website preview.
Replace this file with the official ${title} PDF from the school
administration before the site goes live (see Downloads section
of the admin dashboard once the backend is connected).

Divine Destiny Academy (Nursery & Primary)
Divine Destiny Comprehensive Academy (Secondary)
"Education is Power"
`;
  const blob = new Blob([body], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast(title + ' downloaded');
}

/* ---------- Simulated async submit (until a real backend endpoint exists) ---------- */
function simulateSubmit(button, onDone){
  const original = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<span class="spinner"></span> Submitting...';
  setTimeout(() => {
    button.disabled = false;
    button.innerHTML = original;
    onDone();
  }, 1200);
}
