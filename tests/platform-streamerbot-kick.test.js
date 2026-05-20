import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadWindowScript } from './helpers/load-window-script.js';

class FakeWebSocket {
  static instances = [];

  constructor(url) {
    this.url = url;
    this.sent = [];
    this.readyState = 1;
    FakeWebSocket.instances.push(this);
    setTimeout(() => {
      this.onmessage?.({ data: JSON.stringify({ request: 'Hello', info: { source: 'websocketServer' } }) });
    }, 0);
  }

  send(raw) {
    const msg = JSON.parse(raw);
    this.sent.push(msg);
    if (msg.request === 'Subscribe') {
      setTimeout(() => {
        this.onmessage?.({ data: JSON.stringify({ status: 'ok', id: msg.id, events: msg.events }) });
      }, 0);
    }
  }

  emitServerMessage(message) {
    this.onmessage?.({ data: JSON.stringify(message) });
  }

  close() {
    this.readyState = 3;
    this.onclose?.();
  }
}

describe('platforms/platform-streamerbot-kick.js', () => {
  let platform;

  beforeEach(() => {
    FakeWebSocket.instances = [];
    globalThis.WebSocket = FakeWebSocket;
    delete globalThis.PlatformBase;
    delete globalThis.PlatformStreamerBotKick;
    loadWindowScript('platforms/platform-base.js');
    loadWindowScript('platforms/platform-streamerbot-kick.js');
    platform = new globalThis.PlatformStreamerBotKick();
  });

  afterEach(() => {
    delete globalThis.WebSocket;
  });

  it('connects to Streamer.bot WebSocket and subscribes to Kick events', async () => {
    const ok = await platform.connect({ host: '127.0.0.1', port: 8080, endpoint: '/' });
    const ws = FakeWebSocket.instances[0];

    expect(ok).toBe(true);
    expect(platform.isConnected()).toBe(true);
    expect(ws.url).toBe('ws://127.0.0.1:8080/');
    expect(ws.sent[0]).toMatchObject({
      request: 'Subscribe',
      events: {
        Kick: expect.arrayContaining(['Follow', 'Subscription', 'GiftSubscription', 'RewardRedemption'])
      }
    });
  });

  it('normalizes Kick events emitted by Streamer.bot', async () => {
    await platform.connect({ host: '127.0.0.1', port: 8080, endpoint: '/' });
    const ws = FakeWebSocket.instances[0];
    const events = [];
    for (const eventName of platform.supportedEvents()) {
      platform.on(eventName, (payload) => events.push({ eventName, payload }));
    }

    ws.emitServerMessage({
      event: { source: 'Kick', type: 'Follow' },
      data: { user: { displayName: 'Ana' } }
    });
    ws.emitServerMessage({
      event: { source: 'Kick', type: 'Subscription' },
      data: { user: { name: 'Bob' }, tier: '1' }
    });
    ws.emitServerMessage({
      event: { source: 'Kick', type: 'RewardRedemption' },
      data: { user: { username: 'Cleo' }, reward: { title: 'Hydrate' }, input: 'now' }
    });

    expect(events).toEqual([
      { eventName: 'follow', payload: { user: 'Ana', provider: 'kick' } },
      { eventName: 'sub', payload: { user: 'Bob', tier: '1', provider: 'kick' } },
      { eventName: 'channel_points', payload: { user: 'Cleo', reward_title: 'Hydrate', input: 'now', provider: 'kick' } }
    ]);
  });
});
