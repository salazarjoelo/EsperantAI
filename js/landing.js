/* EsperantAI — script del landing.
 * Extraído de landing.html para TASK-105 CSP hardening Fase 1.
 * Sin cambios funcionales. */
'use strict';

// Reemplazar URL de compra LemonSqueezy. Joel configura este URL después de
        // crear el producto en LemonSqueezy Dashboard.
        const LEMONSQUEEZY_CHECKOUT_URL = 'REEMPLAZAR_CON_URL_LEMONSQUEEZY_CHECKOUT';
        document.getElementById('cta-buy').addEventListener('click', (e) => {
            e.preventDefault();
            if (LEMONSQUEEZY_CHECKOUT_URL.startsWith('REEMPLAZAR')) {
                console.warn('LemonSqueezy checkout URL no configurado. Edita landing.html línea 364.');
                return;
            }
            window.location.href = LEMONSQUEEZY_CHECKOUT_URL;
        });
