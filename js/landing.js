/* EsperantAI — script del landing.
 * Maneja los 2 botones de compra: Pro y Pro+.
 */
'use strict';

// URLs de checkout LemonSqueezy. Joel configura estos URLs después de
// crear los productos en LemonSqueezy Dashboard (uno por variant).
const LEMONSQUEEZY_CHECKOUT_PRO = '';
const LEMONSQUEEZY_CHECKOUT_PRO_PLUS = '';

async function loadCheckoutConfig() {
    try {
        const res = await fetch('/checkout-config.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return {
            pro: data.pro || LEMONSQUEEZY_CHECKOUT_PRO,
            proPlus: data.pro_plus || data.proPlus || LEMONSQUEEZY_CHECKOUT_PRO_PLUS,
        };
    } catch {
        return {
            pro: LEMONSQUEEZY_CHECKOUT_PRO,
            proPlus: LEMONSQUEEZY_CHECKOUT_PRO_PLUS,
        };
    }
}

function isConfiguredCheckout(checkoutUrl) {
    return typeof checkoutUrl === 'string' && checkoutUrl && !checkoutUrl.startsWith('REEMPLAZAR');
}

function showPlaceholderFeedback(planLabel) {
    const fb = document.getElementById('cta-feedback');
    if (!fb) return;
    fb.textContent =
        `🚧 La tienda online estará lista pronto. Para precompra anticipada de ${planLabel} ` +
        'o reservar tu licencia, escríbenos a soporte@edugame.digital con asunto ' +
        `"RESERVA ${planLabel.toUpperCase()}" y te avisamos en cuanto se active el checkout.`;
    fb.hidden = false;
    fb.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function wireCheckout(buttonId, checkoutUrl, planLabel) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isConfiguredCheckout(checkoutUrl)) {
            showPlaceholderFeedback(planLabel);
            console.warn(
                `[${planLabel}] LemonSqueezy checkout URL no configurado. ` +
                'Crear checkout-config.json a partir de checkout-config.example.json.'
            );
            return;
        }
        window.location.href = checkoutUrl;
    });
}

function preferLightMediaOnMobile() {
    const shouldUseLightMedia =
        window.matchMedia?.('(max-width: 760px)').matches ||
        navigator.connection?.saveData;

    if (!shouldUseLightMedia) return;

    document.querySelectorAll('video[autoplay]').forEach((video) => {
        video.pause();
        video.removeAttribute('autoplay');
        video.preload = 'none';
    });
}

preferLightMediaOnMobile();
loadCheckoutConfig().then((checkout) => {
    wireCheckout('cta-buy-pro', checkout.pro, 'Pro');
    wireCheckout('cta-buy-pro-plus', checkout.proPlus, 'Pro+');
});
