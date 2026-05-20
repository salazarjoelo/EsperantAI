/**
 * Tests para core/trigger-history.js
 *
 * Cobertura:
 *   - API consumida por app.js: getAll(), onChange(), downloadCSV()
 *   - cada entrada conserva time/ts, escena y source para el panel visual
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadWindowScript } from './helpers/load-window-script.js';

describe('core/trigger-history.js', () => {
  let TriggerHistory;
  let history;

  beforeEach(() => {
    delete globalThis.TriggerHistory;
    delete globalThis.triggerHistory;
    loadWindowScript('core/trigger-history.js');
    TriggerHistory = globalThis.TriggerHistory;
    history = new TriggerHistory(3);
  });

  it('notifica onChange() y expone getAll() para el panel de app.js', () => {
    const listener = vi.fn();
    history.onChange(listener);

    history.add({
      trigger: 'thumbs-up',
      label: 'hand: thumbs-up',
      scene: 'Thanks',
      source: 'event',
      success: true,
    });

    const entries = history.getAll();
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      trigger: 'thumbs-up',
      label: 'hand: thumbs-up',
      scene: 'Thanks',
      source: 'event',
      success: true,
    });
    expect(entries[0].time).toBeTypeOf('number');
    expect(entries[0].ts).toBe(entries[0].time);
    expect(listener).toHaveBeenCalledWith(entries);
  });

  it('downloadCSV() crea un CSV descargable sin requerir DevTools', () => {
    if (!URL.createObjectURL) URL.createObjectURL = vi.fn();
    if (!URL.revokeObjectURL) URL.revokeObjectURL = vi.fn();
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');
    const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:history');
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    history.add({ trigger: 'sub', label: 'event: sub', scene: 'Thanks', source: 'event' });
    history.downloadCSV();

    expect(createSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalledWith('blob:history');
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
    revokeSpy.mockRestore();
    createSpy.mockRestore();
  });
});
