/* =============================================================================
 * Admin Overlay — Popup Controller
 * Handles all popup-side wiring for the Admin Overlay feature.
 * Loaded at the end of popup.html after popup.js.
 * =========================================================================== */

(function () {
  const $  = (sel) => document.querySelector(sel);
  const setAdminStatus = (el, msg, type) => {
    if (!el) return;
    el.textContent = msg;
    el.className = 'status ' + (type || '');
    if (msg) setTimeout(() => { if (el.textContent === msg) { el.textContent = ''; el.className = 'status'; } }, 4000);
  };

  /* ── helpers ── */
  async function getActiveTabId() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error('No active tab found.');
    return tab.id;
  }

  async function sendToContent(msg) {
    const tabId = await getActiveTabId();
    return chrome.tabs.sendMessage(tabId, msg);
  }

  function getOverlayConfig(positionSel, themeSel, modules) {
    return {
      position:  ($(positionSel) || {}).value || 'bottom',
      theme:     ($(themeSel)    || {}).value || 'dark',
      opacity:   ($('#adminOpacity')          || { value: 95 }).value,
      modules: {
        session: modules.session,
        balance: modules.balance,
        headers: modules.headers,
        flags:   modules.flags,
        network: modules.network,
        dom:     modules.dom,
      },
    };
  }

  /* ── Toggle the full Admin Overlay panel (header 👑 button) ── */
  const overlayPanelEl  = $('#adminOverlayPanel');
  const overlayBtnEl    = $('#adminOverlayBtn');
  const overlayCloseBtnEl = $('#adminOverlayClose');
  const quickBtn        = $('#adminOverlayQuickBtn');

  function toggleAdminPanel() {
    if (!overlayPanelEl) return;
    overlayPanelEl.classList.toggle('hidden');
  }

  if (overlayBtnEl)    overlayBtnEl.addEventListener('click', toggleAdminPanel);
  if (overlayCloseBtnEl) overlayCloseBtnEl.addEventListener('click', toggleAdminPanel);
  if (quickBtn)        quickBtn.addEventListener('click', toggleAdminPanel);

  /* ── Quick flag buttons inside full panel ── */
  document.querySelectorAll('.admin-flag-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const field = btn.dataset.field;
      const value = btn.dataset.value;
      const statusEl = $('#adminPanelStatus');
      try {
        await sendToContent({ type: 'ADMIN_INJECT_FLAG', field, value });
        setAdminStatus(statusEl, `✔ ${field} → ${value} injected into window state`, 'ok');
      } catch (err) {
        setAdminStatus(statusEl, `Flag inject failed: ${err.message}`, 'error');
      }
    });
  });

  /* ── V-Core: save tokens found during inject ── */
  async function harvestAndSaveTokensToVCore(tabId, url) {
    try {
      const domain = new URL(url).hostname;
      // Harvest session state from page
      const state = await chrome.tabs.sendMessage(tabId, { type: 'EXTRACT_HIDDEN_STATE' });
      const cookies = await chrome.runtime.sendMessage({ type: 'GET_COOKIES', url });
      const cookieStore = {};
      (cookies?.cookies || []).forEach(c => { cookieStore[c.name] = c.value; });

      // Simple JWT / token scan (no dependency on popup.js scanForTokens)
      const TOKEN_RE = /^[A-Za-z0-9\-_]{20,}$/;
      const JWT_RE   = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;
      const sources  = [
        ['cookie',          cookieStore],
        ['localStorage',    state?.data?.localStorage    || {}],
        ['sessionStorage',  state?.data?.sessionStorage  || {}],
      ];
      const found = [];
      for (const [src, store] of sources) {
        for (const [k, v] of Object.entries(store || {})) {
          if (typeof v !== 'string') continue;
          if (JWT_RE.test(v.trim())) {
            found.push({ source: src, key: k, type: 'JWT', snippet: v.slice(0, 60) });
          } else if (TOKEN_RE.test(v.trim()) && v.length >= 20) {
            found.push({ source: src, key: k, type: 'token', snippet: v.slice(0, 60) });
          }
        }
      }

      if (found.length === 0) return 0;

      // Save each token to chrome.storage.local under the vcore key
      const vcoreKey = 'vcore_' + domain;
      const prev = (await chrome.storage.local.get(vcoreKey))[vcoreKey] || [];
      const now   = Date.now();
      for (const tok of found) {
        prev.push({
          ts:      now,
          domain,
          tool:    'admin_overlay_popup',
          source:  tok.source,
          key:     tok.key,
          type:    tok.type,
          snippet: tok.snippet,
        });
      }
      // Keep last 200 entries
      if (prev.length > 200) prev.splice(0, prev.length - 200);
      await chrome.storage.local.set({ [vcoreKey]: prev });
      return found.length;
    } catch (_) { return 0; }
  }

  /* ── Full panel inject button ── */
  const adminInjectBtn = $('#adminInjectBtn');
  if (adminInjectBtn) {
    adminInjectBtn.addEventListener('click', async () => {
      const statusEl = $('#adminPanelStatus');
      try {
        const cfg = getOverlayConfig('#adminPosition', '#adminTheme', {
          session: ($('#modSession') || {}).checked !== false,
          balance: ($('#modBalance') || {}).checked !== false,
          headers: ($('#modHeaders') || {}).checked !== false,
          flags:   ($('#modFlags')   || {}).checked !== false,
          network: ($('#modNetwork') || {}).checked !== false,
          dom:     ($('#modDom')     || {}).checked || false,
        });
        setAdminStatus(statusEl, 'Injecting…');
        const tabId = await getActiveTabId();
        const [tab]  = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.sendMessage(tabId, { type: 'ADMIN_OVERLAY_INJECT', config: cfg });
        // Harvest tokens → V-Core automatically
        const saved = await harvestAndSaveTokensToVCore(tabId, tab.url || '');
        const msg = saved > 0
          ? `👑 Admin Overlay injected! ${saved} token(s) saved to V-Core Memory.`
          : '👑 Admin Overlay injected! Look at the page.';
        setAdminStatus(statusEl, msg, 'ok');
      } catch (err) {
        setAdminStatus(statusEl, 'Inject failed: ' + err.message + ' — make sure you are on a real website.', 'error');
      }
    });
  }

  /* ── Full panel remove button ── */
  const adminRemoveBtn = $('#adminRemoveBtn');
  if (adminRemoveBtn) {
    adminRemoveBtn.addEventListener('click', async () => {
      const statusEl = $('#adminPanelStatus');
      try {
        await sendToContent({ type: 'ADMIN_OVERLAY_REMOVE' });
        setAdminStatus(statusEl, '✔ Admin Overlay removed.', 'ok');
      } catch (err) {
        setAdminStatus(statusEl, 'Remove failed: ' + err.message, 'error');
      }
    });
  }

  /* ── Quick inject (Manual Toolbox card) ── */
  const quickInjectBtn  = $('#quickAdminInject');
  const quickRemoveBtn  = $('#quickAdminRemove');
  const quickStatusEl   = $('#quickAdminStatus');

  if (quickInjectBtn) {
    quickInjectBtn.addEventListener('click', async () => {
      try {
        const cfg = getOverlayConfig('#quickAdminPosition', '#quickAdminTheme', {
          session: ($('#qmodSession') || {}).checked !== false,
          balance: ($('#qmodBalance') || {}).checked !== false,
          headers: true,
          flags:   ($('#qmodFlags')   || {}).checked !== false,
          network: ($('#qmodNetwork') || {}).checked || false,
          dom:     ($('#qmodDom')     || {}).checked || false,
        });
        setAdminStatus(quickStatusEl, 'Injecting…');
        await sendToContent({ type: 'ADMIN_OVERLAY_INJECT', config: cfg });
        setAdminStatus(quickStatusEl, '👑 Admin Overlay is now live on the page!', 'ok');
      } catch (err) {
        setAdminStatus(quickStatusEl, 'Inject failed: ' + err.message + ' — navigate to a real website first.', 'error');
      }
    });
  }

  if (quickRemoveBtn) {
    quickRemoveBtn.addEventListener('click', async () => {
      try {
        await sendToContent({ type: 'ADMIN_OVERLAY_REMOVE' });
        setAdminStatus(quickStatusEl, '✔ Overlay removed from page.', 'ok');
      } catch (err) {
        setAdminStatus(quickStatusEl, 'Remove failed: ' + err.message, 'error');
      }
    });
  }
})();
