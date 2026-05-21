import { describe, expect, it, vi } from 'vitest';
import { loadWindowScript } from './helpers/load-window-script.js';

describe('js/landing.js checkout config', () => {
  it('loads checkout-config.json from site root on localized routes', async () => {
    window.history.replaceState({}, '', '/es-mx/#comprar');
    document.body.innerHTML = `
      <button id="cta-buy-pro"></button>
      <button id="cta-buy-pro-plus"></button>
      <div id="cta-feedback" hidden></div>
    `;

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        pro: 'https://checkout.edugame.digital/checkout/buy/pro',
        pro_plus: 'https://checkout.edugame.digital/checkout/buy/pro-plus',
      }),
    });

    loadWindowScript('js/landing.js');
    await Promise.resolve();
    await Promise.resolve();

    expect(fetchSpy).toHaveBeenCalledWith('/checkout-config.json', { cache: 'no-store' });
    expect(fetchSpy).not.toHaveBeenCalledWith('checkout-config.json', expect.anything());

    fetchSpy.mockRestore();
  });
});
