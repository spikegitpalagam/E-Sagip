/* ============================================================
   heartbeat.js  —  E-Sagip Online/Offline Tracker
   ============================================================
   Include this on admin_page.html, superadmin_page.html,
   and volunteer_page.html.

   It reads currentUser from localStorage, sends a heartbeat
   every 30 seconds, and marks the user offline on logout
   or page close.
   ============================================================ */

(function () {
  const API_BASE_URL = 'https://e-sagip-production.up.railway.app/api';
  const INTERVAL_MS  = 30000; // 30 seconds

  function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem('currentUser')); } catch { return null; }
  }

  function getUserType(user) {
    if (!user) return null;
    return (user.role === 'admin' || user.role === 'superadmin') ? 'admin' : 'volunteer';
  }

  async function sendHeartbeat() {
    const user = getCurrentUser();
    if (!user) return;

    try {
      await fetch(`${API_BASE_URL}/auth/heartbeat`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ userId: user.id, userType: getUserType(user) })
      });
    } catch (err) {
      // Heartbeat failures are silent — don't alert the user
      console.warn('Heartbeat failed:', err.message);
    }
  }

  async function sendOffline() {
    const user = getCurrentUser();
    if (!user) return;

    // Use sendBeacon for reliability on page unload
    const payload = JSON.stringify({ userId: user.id, userType: getUserType(user) });
    const blob    = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon(`${API_BASE_URL}/auth/offline`, blob);
  }

  // Send immediately on page load
  sendHeartbeat();

  // Then every 30 seconds
  const heartbeatInterval = setInterval(sendHeartbeat, INTERVAL_MS);

  // Mark offline when tab/browser closes
  window.addEventListener('beforeunload', () => {
    clearInterval(heartbeatInterval);
    sendOffline();
  });

  // Mark offline when page visibility changes to hidden (tab switch / minimize)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendOffline();
    } else {
      // User came back — send heartbeat immediately
      sendHeartbeat();
    }
  });

})();
