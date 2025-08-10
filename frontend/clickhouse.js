(function () {
  const sessionKey = 'lugx_session_id';
  let session_id = localStorage.getItem(sessionKey);
  if (!session_id) {
    session_id = Math.random().toString(36).substring(2);
    localStorage.setItem(sessionKey, session_id);
  }

  // Helper to send analytics event
  function sendEvent(eventType, additionalData = {}) {
    fetch('http://localhost:3002', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        session_id: session_id,
        ...additionalData
      }),
    }).catch((err) => {
      console.warn('Analytics tracking failed', err);
    });
  }

  // 1. Track Page View on load
  sendEvent('page_view');

  // 2. Track Clicks anywhere on the page
  document.addEventListener('click', (e) => {
    sendEvent('click', {
      element_tag: e.target.tagName,
      element_id: e.target.id || null,
      element_classes: e.target.className || null,
      x: e.clientX,
      y: e.clientY,
    });
  });

  // 3. Track Scroll Depth (percentage)
  let lastScrollPercent = 0;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.floor((scrollTop / docHeight) * 100) : 0;

    // Send event only if scroll percent increased by at least 10%
    if (scrollPercent - lastScrollPercent >= 10) {
      lastScrollPercent = scrollPercent;
      sendEvent('scroll_depth', { scroll_percent: scrollPercent });
    }
  });

  // 4. Track Page Time (how long user stayed on page)
  let startTime = Date.now();

  function sendPageTime() {
    const durationMs = Date.now() - startTime;
    sendEvent('page_time', { duration_ms: durationMs });
  }

  // Send page time event when user leaves the page
  window.addEventListener('beforeunload', sendPageTime);
  window.addEventListener('pagehide', sendPageTime);

  // Optional: track session time (total time user active on site)
  // This can be more complex and often handled server-side or with cookies

})();
