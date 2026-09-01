const SUPABASE_URL = 'https://vwlbidzccpxccowkhchy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jOnyXV1B8YkNTcg1X9GBnQ_0TdXoACG';

(function installAramHtmlSanitizer() {
  if (window.__aramHtmlSanitizerInstalled) return;
  window.__aramHtmlSanitizerInstalled = true;

  const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  if (!descriptor || !descriptor.get || !descriptor.set) return;

  const blockedTags = new Set([
    'SCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'BASE',
    'FRAME', 'FRAMESET', 'APPLET', 'STYLE', 'SVG', 'MATH'
  ]);
  const urlAttrs = new Set(['href', 'src', 'xlink:href', 'action', 'formaction', 'poster']);

  function unsafeUrl(value, attrName) {
    const valueTrimmed = String(value || '').trim();
    const lower = valueTrimmed.toLowerCase().replace(/\s+/g, '');
    if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) return true;
    if (lower.startsWith('data:')) {
      return !(attrName === 'src' && /^data:image\/(png|gif|jpeg|jpg|webp|avif);/i.test(valueTrimmed));
    }
    return false;
  }

  function sanitizeHtml(value) {
    const template = document.createElement('template');
    descriptor.set.call(template, String(value ?? ''));

    template.content.querySelectorAll('*').forEach((el) => {
      if (blockedTags.has(el.tagName)) {
        el.remove();
        return;
      }

      [...el.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        const val = attr.value;
        if (name.startsWith('on') || name === 'srcdoc') {
          el.removeAttribute(attr.name);
          return;
        }
        if (urlAttrs.has(name) && unsafeUrl(val, name)) {
          el.removeAttribute(attr.name);
          return;
        }
        if (name === 'style' && /expression\s*\(|url\s*\(\s*['\"]?javascript:/i.test(val)) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return descriptor.get.call(template);
  }

  Object.defineProperty(Element.prototype, 'innerHTML', {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    get: descriptor.get,
    set(value) {
      descriptor.set.call(this, sanitizeHtml(value));
    }
  });

  window.aramEscapeHtml = function aramEscapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
})();

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
