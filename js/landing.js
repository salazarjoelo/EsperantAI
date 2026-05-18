/* EsperantAI — script del landing.
 * Maneja los 2 botones de compra: Pro y Pro+.
 */
'use strict';

// URLs de checkout LemonSqueezy. Joel configura estos URLs después de
// crear los productos en LemonSqueezy Dashboard (uno por variant).
const LEMONSQUEEZY_CHECKOUT_PRO = 'REEMPLAZAR_CON_URL_LEMONSQUEEZY_PRO';
const LEMONSQUEEZY_CHECKOUT_PRO_PLUS = 'REEMPLAZAR_CON_URL_LEMONSQUEEZY_PRO_PLUS';

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
        if (checkoutUrl.startsWith('REEMPLAZAR')) {
            showPlaceholderFeedback(planLabel);
            console.warn(
                `[${planLabel}] LemonSqueezy checkout URL no configurado. ` +
                'Editar js/landing.js líneas 9-10.'
            );
            return;
        }
        window.location.href = checkoutUrl;
    });
}

wireCheckout('cta-buy-pro', LEMONSQUEEZY_CHECKOUT_PRO, 'Pro');
wireCheckout('cta-buy-pro-plus', LEMONSQUEEZY_CHECKOUT_PRO_PLUS, 'Pro+');
