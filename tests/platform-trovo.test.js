import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadWindowScript } from './helpers/load-window-script.js';

describe('platforms/platform-trovo.js', () => {
  let platform;

  beforeEach(() => {
    delete globalThis.PlatformBase;
    delete globalThis.PlatformTrovo;
    loadWindowScript('platforms/platform-base.js');
    loadWindowScript('platforms/platform-trovo.js');
    platform = new globalThis.PlatformTrovo();
  });

  it('builds Trovo implicit OAuth URL with chat_connect scope and state', () => {
    const url = platform.oauthUrl('client-123', 'https://example.test/oauth-callback.html', 'trovo:nonce');
    const parsed = new URL(url);

    expect(parsed.origin + parsed.pathname).toBe('https://open.trovo.live/page/login.html');
    expect(parsed.searchParams.get('client_id')).toBe('client-123');
    expect(parsed.searchParams.get('response_type')).toBe('token');
    expect(parsed.searchParams.get('state')).toBe('trovo:nonce');
    expect(parsed.searchParams.get('scope')).toContain('chat_connect');
    expect(parsed.searchParams.get('scope')).toContain('user_details_self');
  });

  it('normalizes Trovo subscriptions, follows, gifts, magic chat and raids', () => {
    const events = [];
    for (const eventName of platform.supportedEvents()) {
      platform.on(eventName, (payload) => events.push({ eventName, payload }));
    }

    platform._handleChat({
      chats: [
        { type: 5001, nick_name: 'Ana', sub_tier: '1', content_data: { isReSub: 0 } },
        { type: 5001, nick_name: 'Bob', sub_tier: '2', content_data: { isReSub: 1, months: 4 } },
        { type: 5003, nick_name: 'Cleo' },
        { type: 5005, nick_name: 'Dana', content: '3' },
        { type: 5, nick_name: 'Eli', content: 'gift', content_data: '{"gift":"Rose","num":2,"value_type":"elixir"}' },
        { type: 6, nick_name: 'Fran', content: 'Pinned hello', content_data: { value: 50, value_type: 'mana' } },
        { type: 5008, nick_name: 'Gina', content_data: { raiderNum: 12 } }
      ]
    });

    expect(events.map(e => e.eventName)).toEqual([
      'sub',
      'resub',
      'follow',
      'gift_sub',
      'gift',
      'super_chat',
      'raid'
    ]);
    expect(events[0].payload).toMatchObject({ user: 'Ana', tier: '1' });
    expect(events[1].payload).toMatchObject({ user: 'Bob', months: 4 });
    expect(events[3].payload).toMatchObject({ gifter: 'Dana', total: 3 });
    expect(events[4].payload).toMatchObject({ user: 'Eli', gift_name: 'Rose', amount: 2 });
    expect(events[5].payload).toMatchObject({ user: 'Fran', amount: 50, currency: 'mana' });
    expect(events[6].payload).toMatchObject({ from: 'Gina', viewers: 12 });
  });

  it('requests the official own-channel chat token endpoint', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ token: 'chat-token' })
    }));
    globalThis.fetch = fetchMock;
    platform.token = 'trovo-token';
    platform.clientId = 'trovo-client';

    await platform._apiGet('/chat/token');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://open-api.trovo.live/openplatform/chat/token',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'OAuth trovo-token',
          'Client-ID': 'trovo-client'
        })
      })
    );
  });
});
