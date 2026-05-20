import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadWindowScript } from './helpers/load-window-script.js';

class FakeWebSocket {
  static instances = [];

  constructor(url) {
    this.url = url;
    this.sent = [];
    this.readyState = 1;
    FakeWebSocket.instances.push(this);
    setTimeout(() => {
      this.onopen?.();
      this.onmessage?.({ data: JSON.stringify({ type: 'welcome', data: { client_id: 'client' } }) });
    }, 0);
  }

  send(raw) {
    const msg = JSON.parse(raw);
    this.sent.push(msg);
    if (msg.type === 'subscribe') {
      setTimeout(() => {
        this.onmessage?.({
          data: JSON.stringify({
            type: 'response',
            nonce: msg.nonce,
            data: { topic: 'channel.activities', room: msg.data.room || 'room-1' },
          }),
        });
      }, 0);
    }
  }

  emitActivity(activity) {
    this.onmessage?.({
      data: JSON.stringify({
        type: 'message',
        topic: 'channel.activities',
        room: 'room-1',
        data: activity,
      }),
    });
  }

  close() {
    this.readyState = 3;
    this.onclose?.();
  }
}

describe('platforms/platform-streamelements.js', () => {
  let platform;

  beforeEach(() => {
    FakeWebSocket.instances = [];
    globalThis.WebSocket = FakeWebSocket;
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ _id: 'channel-123' }),
    }));
    delete globalThis.PlatformBase;
    delete globalThis.PlatformStreamElements;
    loadWindowScript('platforms/platform-base.js');
    loadWindowScript('platforms/platform-streamelements.js');
    platform = new globalThis.PlatformStreamElements();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete globalThis.WebSocket;
  });

  it('connects to StreamElements Astro and subscribes to channel.activities', async () => {
    const ok = await platform.connect({ jwt: 'se-jwt' });
    const ws = FakeWebSocket.instances[0];

    expect(ok).toBe(true);
    expect(ws.url).toBe('wss://astro.streamelements.com/');
    expect(ws.sent[0]).toMatchObject({
      type: 'subscribe',
      data: {
        topic: 'channel.activities',
        room: 'channel-123',
        token: 'se-jwt',
        token_type: 'jwt',
      },
    });
    expect(ws.sent).toHaveLength(1);
  });

  it('normalizes StreamElements Astro activities', async () => {
    await platform.connect({ jwt: 'se-jwt' });
    const ws = FakeWebSocket.instances[0];
    const events = [];
    for (const eventName of platform.supportedEvents()) {
      platform.on(eventName, (payload) => events.push({ eventName, payload }));
    }

    ws.emitActivity({
      type: 'follow',
      provider: 'twitch',
      data: { username: 'Ana', displayName: 'AnaLive' },
    });
    ws.emitActivity({
      type: 'tip',
      provider: 'youtube',
      data: { username: 'Bob', amount: 10, currency: 'USD', message: 'thanks' },
    });

    expect(events).toEqual([
      { eventName: 'follow', payload: { user: 'Ana', provider: 'twitch' } },
      { eventName: 'donation', payload: { user: 'Bob', amount: 10, currency: 'USD', message: 'thanks', provider: 'youtube' } },
    ]);
  });
});
