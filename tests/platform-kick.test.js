import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadWindowScript } from './helpers/load-window-script.js';

describe('platforms/platform-kick.js', () => {
  let platform;

  beforeEach(() => {
    delete globalThis.PlatformBase;
    delete globalThis.PlatformKick;
    loadWindowScript('platforms/platform-base.js');
    loadWindowScript('platforms/platform-kick.js');
    platform = new globalThis.PlatformKick();
  });

  it('does not expose native Kick OAuth/token exchange in the browser', async () => {
    expect(platform.authMethod()).toBe('backend_required');
    await expect(platform.oauthUrl('client', 'https://example.test/callback', 'state'))
      .rejects.toThrow(/client_secret/i);
    await expect(platform.exchangeCodeForToken('code', 'client', 'https://example.test/callback'))
      .rejects.toThrow(/client_secret/i);
  });

  it('blocks native Kick browser connect even if a token is supplied', async () => {
    globalThis.fetch = vi.fn();
    const authErrors = [];
    platform.on('auth_error', (error) => authErrors.push(error.message));

    await expect(platform.connect({ token: 'token', clientId: 'client' })).resolves.toBe(false);

    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(authErrors[0]).toMatch(/disabled/i);
    expect(platform.supportedEvents()).toEqual([]);
  });
});
