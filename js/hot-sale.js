/**
 * EsperantAI Hot Sale Banner — runtime, no redeploy needed
 *
 * Lee /hot-sale.json en el server. Si active=true y fecha vigente:
 *  - Pinta banner sticky arriba del topbar
 *  - Tacha precios originales en pricing-section + muestra precio early bird
 *  - Activa countdown opcional
 *
 * Joel activa subiendo el JSON al server. Apaga borrando o active:false.
 */
(function () {
  'use strict';

  // --- Strings i18n del banner (solo banner; pricing usa el HTML existente) ---
  const STRINGS = {
    'es-es': { label: 'HOT SALE MX', sub: 'Solo del 25 may al 2 jun', cta: 'Aprovecha', code: 'Cupón', ends_in: 'Termina en', d: 'd', h: 'h', m: 'min', s: 's' },
    'es-mx': { label: 'HOT SALE MX', sub: 'Solo del 25 may al 2 jun', cta: 'Aprovecha', code: 'Cupón', ends_in: 'Termina en', d: 'd', h: 'h', m: 'min', s: 's' },
    'en-us': { label: 'FLASH SALE MX', sub: 'Only May 25 - Jun 2', cta: 'Get it', code: 'Code', ends_in: 'Ends in', d: 'd', h: 'h', m: 'min', s: 's' },
    'pt-br': { label: 'HOT SALE MX', sub: 'Apenas de 25 mai a 2 jun', cta: 'Aproveite', code: 'Cupom', ends_in: 'Termina em', d: 'd', h: 'h', m: 'min', s: 's' },
    'fr-fr': { label: 'HOT SALE MX', sub: 'Du 25 mai au 2 juin uniquement', cta: 'Profitez-en', code: 'Code', ends_in: 'Se termine dans', d: 'j', h: 'h', m: 'min', s: 's' },
    'de-de': { label: 'HOT SALE MX', sub: 'Nur vom 25. Mai bis 2. Juni', cta: 'Jetzt nutzen', code: 'Code', ends_in: 'Endet in', d: 'T', h: 'Std', m: 'Min', s: 's' },
    'ja-jp': { label: 'HOT SALE MX', sub: '5月25日から6月2日まで', cta: '今すぐ', code: 'クーポン', ends_in: '終了まで', d: '日', h: '時間', m: '分', s: '秒' },
    'ru-ru': { label: 'HOT SALE MX', sub: 'Только 25 мая - 2 июня', cta: 'Получить', code: 'Промокод', ends_in: 'Заканчивается через', d: 'д', h: 'ч', m: 'мин', s: 'с' },
    'zh-cn': { label: 'HOT SALE MX', sub: '仅限 5月25日 - 6月2日', cta: '立即获取', code: '优惠码', ends_in: '剩余时间', d: '天', h: '时', m: '分', s: '秒' },
    'it-it': { label: 'HOT SALE MX', sub: 'Solo dal 25 mag al 2 giu', cta: 'Approfitta', code: 'Codice', ends_in: 'Finisce tra', d: 'g', h: 'h', m: 'min', s: 's' },
    'pl-pl': { label: 'HOT SALE MX', sub: 'Tylko od 25 maja do 2 czerwca', cta: 'Skorzystaj', code: 'Kod', ends_in: 'Kończy się za', d: 'd', h: 'h', m: 'min', s: 's' },
    'ar-sa': { label: 'HOT SALE MX', sub: 'فقط من 25 مايو إلى 2 يونيو', cta: 'احصل عليه', code: 'كود', ends_in: 'ينتهي خلال', d: 'ي', h: 'س', m: 'د', s: 'ث' },
    'ko-kr': { label: 'HOT SALE MX', sub: '5월 25일 - 6월 2일 한정', cta: '지금 받기', code: '쿠폰', ends_in: '종료까지', d: '일', h: '시', m: '분', s: '초' },
    'hi-in': { label: 'HOT SALE MX', sub: 'केवल 25 मई - 2 जून', cta: 'अभी पाएं', code: 'कूपन', ends_in: 'समाप्त होने में', d: 'दि', h: 'घं', m: 'मि', s: 'से' },
    'id-id': { label: 'HOT SALE MX', sub: 'Hanya 25 Mei - 2 Jun', cta: 'Ambil', code: 'Kode', ends_in: 'Berakhir dalam', d: 'h', h: 'j', m: 'mnt', s: 'dtk' }
  };

  // Short ISO codes (es, en, pt, etc.) map to a default full locale
  const SHORT_MAP = {
    es: 'es-es', en: 'en-us', pt: 'pt-br', ja: 'ja-jp', de: 'de-de',
    fr: 'fr-fr', ru: 'ru-ru', zh: 'zh-cn', it: 'it-it', pl: 'pl-pl',
    ar: 'ar-sa', ko: 'ko-kr', hi: 'hi-in', id: 'id-id'
  };
  function getLocale() {
    let lang = (document.documentElement.lang || 'es-ES').toLowerCase();
    if (SHORT_MAP[lang]) lang = SHORT_MAP[lang];
    return STRINGS[lang] ? lang : 'en-us';
  }

  function renderBanner(cfg, strings) {
    const slot = document.getElementById('hot-sale-banner');
    if (!slot) return;

    const dl = cfg.discount_label || '';
    const cp = cfg.coupon ? `<span class="hs-code">${strings.code}: <strong>${cfg.coupon}</strong></span>` : '';
    const cd = cfg.show_countdown ? `<span class="hs-countdown" data-end="${cfg.end_at}" aria-live="polite">${strings.ends_in} <span class="hs-cd-val">--</span></span>` : '';

    slot.innerHTML = `
      <div class="hs-inner">
        <span class="hs-flame" aria-hidden="true">🔥</span>
        <span class="hs-label">${strings.label}</span>
        <span class="hs-discount">${dl}</span>
        <span class="hs-sub">${strings.sub}</span>
        ${cp}
        ${cd}
        <a class="hs-cta" href="#comprar">${strings.cta} →</a>
      </div>
    `;
    slot.hidden = false;
    document.body.classList.add('has-hot-sale');
  }

  function overridePrices(eb) {
    if (!eb) return;
    const pairs = [
      { selector: '.plan-pro .plan-price', from: eb.pro_from, to: eb.pro_to },
      { selector: '.plan-pro-plus .plan-price', from: eb.pro_plus_from, to: eb.pro_plus_to }
    ];
    pairs.forEach(p => {
      const el = document.querySelector(p.selector);
      if (!el || el.dataset.hsApplied === '1') return;
      const intSpan = el.querySelector('.price-int');
      if (!intSpan) return;
      const oldHtml = el.innerHTML;
      el.innerHTML = `
        <span class="price-strike">$${p.from}</span>
        <span class="price-currency-mark">$</span>
        <span class="price-int">${p.to}</span>
        <span class="price-unit">USD</span>
      `;
      el.dataset.hsApplied = '1';
      el.dataset.hsOriginal = oldHtml;
    });
  }

  function startCountdown(strings) {
    const node = document.querySelector('.hs-countdown');
    if (!node) return;
    const endAt = new Date(node.dataset.end).getTime();
    const valNode = node.querySelector('.hs-cd-val');
    function tick() {
      const ms = endAt - Date.now();
      if (ms <= 0) {
        node.remove();
        return;
      }
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      valNode.textContent = `${d}${strings.d} ${h}${strings.h} ${m}${strings.m} ${s}${strings.s}`;
    }
    tick();
    setInterval(tick, 1000);
  }

  async function init() {
    let cfg;
    try {
      const r = await fetch('/hot-sale.json', { cache: 'no-store' });
      if (!r.ok) return; // no banner
      cfg = await r.json();
    } catch (e) {
      return; // silent fail
    }
    if (!cfg.active) return;

    const now = Date.now();
    const start = cfg.start_at ? new Date(cfg.start_at).getTime() : 0;
    const end = cfg.end_at ? new Date(cfg.end_at).getTime() : Infinity;
    if (now < start || now >= end) return;

    // Optional locale gate
    if (Array.isArray(cfg.locales) && cfg.locales.length) {
      const here = (document.documentElement.lang || 'es-ES').toLowerCase();
      if (!cfg.locales.map(l => l.toLowerCase()).includes(here)) return;
    }

    const strings = STRINGS[getLocale()];
    renderBanner(cfg, strings);
    overridePrices(cfg.early_bird);
    if (cfg.show_countdown) startCountdown(strings);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
