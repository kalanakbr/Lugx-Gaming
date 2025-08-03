(function () {
  const sessionKey = 'lugx_session_id';
  let session_id = localStorage.getItem(sessionKey);
  if (!session_id) {
    session_id = Math.random().toString(36).substring(2);
    localStorage.setItem(sessionKey, session_id);
  }

  fetch('http://analytics-service.default.svc.cluster.local/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      session_id: session_id
    })
  }).catch(err => {
    console.warn('Analytics tracking failed', err);
  });
})();
