/* EsperantAI — script del landing.
 * Extraído de landing.html para TASK-105 CSP hardening Fase 1.
 */
'use strict';

// Reemplazar URL de compra LemonSqueezy. Joel configura este URL después de
// crear el producto en LemonSqueezy Dashboard.
const LEMONSQUEEZY_CHECKOUT_URL = 'REEMPLAZAR_CON_URL_LEMONSQUEEZY_CHECKOUT';

document.getElementById('cta-buy').addEventListener('click', (e) => {
    e.preventDefault();

    // Bug runtime fix 2026-05-15: si el URL aún no está configurado, dar
    // feedback visible al usuario en vez de fallar silenciosamente (antes
    // el click sólo escribía a console.warn que el usuario no ve).
    if (LEMONSQUEEZY_CHECKOUT_URL.startsWith('REEMPLAZAR')) {
        const fb = document.getElementById('cta-feedback');
        if (fb) {
            fb.textContent =
                '🚧 La tienda online estará lista pronto. Para precompra anticipada o reservar tu licencia, ' +
                'escríbenos a soporte@edugame.digital con asunto "RESERVA ESPERANTAI" y te avisamos en cuanto se active el checkout.';
            fb.hidden = false;  // CSP-safe (sin style inline)
            fb.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        console.warn('LemonSqueezy checkout URL no configurado. Editar js/landing.js línea 8.');
        return;
    }
    window.location.href = LEMONSQUEEZY_CHECKOUT_URL;
});
