/* INDIA_DEMO_TRACKING_V1: client-only visitor and CTA telemetry for India demos. */
(() => {
  const config = window.INDIA_DEMO_TRACKING || {};
  const endpoint = String(config.endpoint || '').trim();
  if (config.enabled !== true || !/^https:\/\//i.test(endpoint)) return;

  const body = document.body || {};
  const leadKey = String(body.getAttribute && body.getAttribute('data-lead-key') || '').trim();
  if (!/^(phone|place|lead)-[a-z0-9_-]{3,180}$/i.test(leadKey)) return;
  const parts = window.location.pathname.split('/').filter(Boolean);
  const demoSlug = parts.length > 1 ? String(parts[parts.length - 2] || '').slice(0, 180) : '';
  const file = String(parts[parts.length - 1] || 'index.html').toLowerCase();
  const page = file.replace(/\.html$/, '') || 'index';
  const store = (() => { try { return window.sessionStorage; } catch (_) { return null; } })();
  const sessionKey = 'india-demo-tracking-session';
  let sessionId = store && store.getItem(sessionKey);
  if (!sessionId) {
    sessionId = 's-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
    if (store) try { store.setItem(sessionKey, sessionId); } catch (_) {}
  }
  const clean = (value, max = 90) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
  const params = new URLSearchParams(window.location.search);
  const referrerHost = (() => { try { return document.referrer ? new URL(document.referrer).hostname.slice(0, 120) : ''; } catch (_) { return ''; } })();
  const device = window.innerWidth < 768 ? 'mobile' : (window.innerWidth < 1100 ? 'tablet' : 'desktop');
  const send = (eventType, label = '') => {
    try {
      const url = new URL(endpoint);
      const eventId = [leadKey, page, eventType, Date.now().toString(36), Math.random().toString(36).slice(2, 8)].join('-');
      const values = {
        mode: 'tracking', v: '1', source: 'india_demo', eventId, eventType, leadKey,
        demoSlug, page, sessionId, visitorId: sessionId, device, referrerHost,
        utmSource: params.get('utm_source') || '', utmMedium: params.get('utm_medium') || '',
        utmCampaign: params.get('utm_campaign') || '', label: clean(label)
      };
      Object.keys(values).forEach((key) => url.searchParams.set(key, values[key]));
      const pixel = new Image();
      pixel.referrerPolicy = 'no-referrer-when-downgrade';
      pixel.src = url.toString();
    } catch (_) {}
  };
  const viewKey = 'india-demo-view:' + leadKey + ':' + page;
  if (!store || !store.getItem(viewKey)) {
    send('page_view');
    if (store) try { store.setItem(viewKey, '1'); } catch (_) {}
  }
  window.setTimeout(() => send('engaged_30s'), 30000);
  document.addEventListener('click', (event) => {
    const link = event.target && event.target.closest ? event.target.closest('a') : null;
    if (!link) return;
    const href = String(link.getAttribute('href') || '').toLowerCase();
    const label = clean(link.textContent || link.getAttribute('aria-label') || link.className || 'link');
    if (href.startsWith('tel:')) return send('call_click', label);
    if (href.includes('wa.me/') || href.includes('whatsapp.com/')) return send('whatsapp_click', label);
    if (href.startsWith('mailto:')) return send('email_click', label);
    if (href.includes('contact.html') || href.includes('#contact') || /quote|contact|enquir/i.test(label)) return send('quote_click', label);
    if (href.startsWith('http')) return send('external_click', label);
    if (href && href !== '#') return send('nav_click', label);
  }, { capture: true });
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (form && form.tagName === 'FORM') send('form_submit', clean(form.getAttribute('name') || form.id || 'contact_form'));
  }, { capture: true });
})();
