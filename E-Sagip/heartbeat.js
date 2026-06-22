(function () {
  const API_BASE_URL = 'https://e-sagip-production.up.railway.app/api';
  const INTERVAL_MS  = 30000;

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
      await fetch(`${API_BASE_URL}/auth/ping`, {   // ← fixed: space added
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ userId: user.id, userType: getUserType(user) })
      });
    } catch (err) {
      console.warn('Heartbeat failed:', err.message);
    }
  }

  async function sendOffline() {
    const user = getCurrentUser();
    if (!user) return;
    const payload = JSON.stringify({ userId: user.id, userType: getUserType(user) });
    const blob    = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon(`${API_BASE_URL}/auth/status`, blob);  // ← fixed: /status
  }

  sendHeartbeat();
  const heartbeatInterval = setInterval(sendHeartbeat, INTERVAL_MS);

  window.addEventListener('beforeunload', () => {
    clearInterval(heartbeatInterval);
    sendOffline();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendOffline();
    } else {
      sendHeartbeat();
    }
  });
})();
