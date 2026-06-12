/* ===== LOGIN PAGE ===== */

/**
 * Switch between Volunteer and Admin tabs on the login page.
 */
function switchTab(tab) {
  const formVolunteer = document.getElementById('form-volunteer');
  const formAdmin     = document.getElementById('form-admin');
  const tabVolunteer  = document.getElementById('tab-volunteer');
  const tabAdmin      = document.getElementById('tab-admin');

  if (!formVolunteer) return; // not on login page

  if (tab === 'volunteer') {
    formVolunteer.classList.remove('hidden');
    formAdmin.classList.add('hidden');
    tabVolunteer.classList.add('active');
    tabAdmin.classList.remove('active');
  } else {
    formAdmin.classList.remove('hidden');
    formVolunteer.classList.add('hidden');
    tabAdmin.classList.add('active');
    tabVolunteer.classList.remove('active');
  }
}

/**
 * Toggle password visibility.
 * @param {string} inputId  - ID of the password input
 * @param {HTMLElement} btn - The toggle button element
 */
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>`;
  } else {
    input.type = 'password';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`;
  }
}

/**
 * Handle volunteer login form submission.
 */
function handleVolunteerLogin() {
  const email    = document.getElementById('v-email')?.value.trim();
  const password = document.getElementById('v-password')?.value;

  if (!email || !password) {
    alert('Please enter your email and password.');
    return;
  }

  // Demo: accept any non-empty credentials for volunteers
  alert('Volunteer sign-in successful! (Demo)');
}

/**
 * Handle admin login form submission.
 * Redirects to admin.html on success.
 */
function handleAdminLogin() {
  const email    = document.getElementById('a-email')?.value.trim();
  const password = document.getElementById('a-password')?.value;

  if (!email || !password) {
    alert('Please enter your admin credentials.');
    return;
  }

  // Demo: any credentials redirect to admin dashboard
  window.location.href = 'admin_page.html';
}


/* ===== ADMIN DASHBOARD ===== */

/**
 * Switch between sub-nav tabs on the admin dashboard.
 * @param {HTMLElement} btn  - Clicked button
 * @param {string}      tab  - Tab identifier
 */
function switchSubNav(btn, tab) {
  // Update button states
  document.querySelectorAll('.subnav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Show/hide panels
  const panels = ['dashboard', 'newop', 'volunteers', 'feed'];
  panels.forEach(id => {
    const el = document.getElementById('tab-' + id);
    if (el) {
      el.classList.toggle('hidden', id !== tab);
    }
  });
}

/**
 * Toggle the expanded details section of an operation card.
 * @param {HTMLElement} chevronEl - The chevron span that was clicked
 */
function toggleOp(chevronEl) {
  const card    = chevronEl.closest('.op-card');
  const details = card.querySelector('.op-details');
  const svg     = chevronEl.querySelector('svg');

  if (!details) return;

  const isOpen = details.classList.toggle('open');
  if (svg) {
    svg.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  }
}

/**
 * Logout – redirect back to the login page.
 */
function handleLogout() {
  if (confirm('Sign out of the admin portal?')) {
    window.location.href = 'index.html';
  }
}