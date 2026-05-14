/* ============================================================================
 * EsperantAI — Trigger History
 *
 * Buffer circular de los últimos N triggers disparados.
 * UI panel visible para debugging sin abrir DevTools (audit feature #9).
 * Export CSV para análisis offline.
 * ========================================================================== */

'use strict';

class TriggerHistory {
    constructor(maxEntries = 50) {
        this.maxEntries = maxEntries;
        this.entries = []; // [{ ts, trigger, label, scene, actionsCount, success, source }]
        this.listeners = [];
    }

    /**
     * @param {Object} entry { trigger, label, scene?, actionsCount?, success, source? }
     */
    add(entry) {
        const record = {
            ts: Date.now(),
            trigger: entry.trigger || '?',
            label: entry.label || '',
            scene: entry.scene || '',
            actionsCount: entry.actionsCount ?? 0,
            success: entry.success ?? null,
            source: entry.source || 'gesture' // 'gesture' | 'event' | 'manual'
        };
        this.entries.unshift(record); // más recientes primero
        if (this.entries.length > this.maxEntries) {
            this.entries.length = this.maxEntries;
        }
        this._notify();
    }

    getAll() {
        return this.entries.slice();
    }

    clear() {
        this.entries = [];
        this._notify();
    }

    /**
     * Devuelve CSV string para download.
     */
    toCSV() {
        const header = 'timestamp,trigger,label,scene,actions_count,success,source\n';
        const rows = this.entries.map(e => {
            const iso = new Date(e.ts).toISOString();
            const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
            return [iso, esc(e.trigger), esc(e.label), esc(e.scene), e.actionsCount, e.success, esc(e.source)].join(',');
        }).join('\n');
        return header + rows;
    }

    /**
     * Disparar download del CSV en el navegador.
     */
    downloadCSV() {
        const csv = this.toCSV();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `esperantai-history-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    onChange(fn) { this.listeners.push(fn); }
    _notify() { this.listeners.forEach(fn => { try { fn(this.entries); } catch {} }); }
}

window.TriggerHistory = TriggerHistory;
window.triggerHistory = new TriggerHistory(50);
