/* ============================================================================
 * EsperantAI — Trigger History
 * Ring buffer de los últimos N triggers para debugging y analytics.
 * ========================================================================== */

'use strict';

class TriggerHistory {
    constructor(maxSize = 100) {
        this.maxSize = maxSize;
        this.entries = [];
        this.listeners = [];
    }

    /**
     * Registra un trigger disparado.
     * @param {Object} entry { trigger, label, action, success, source }
     */
    add(entry) {
        const time = Date.now();
        this.entries.unshift({
            time,
            ts: time,
            trigger: entry.trigger || 'unknown',
            label: entry.label || '',
            action: entry.action || '',
            scene: entry.scene || '',
            actionsCount: Number.isFinite(entry.actionsCount) ? entry.actionsCount : 0,
            success: entry.success !== false,
            source: entry.source || 'gesture' // 'gesture' | 'event' | 'platform' | 'combo' | 'manual'
        });
        if (this.entries.length > this.maxSize) {
            this.entries.length = this.maxSize;
        }
        this._notify();
    }

    /**
     * Devuelve los últimos N entries.
     */
    getRecent(count = 50) {
        return this.entries.slice(0, count);
    }

    /**
     * Devuelve todo el historial visible para app.js.
     */
    getAll() {
        return this.entries.slice();
    }

    /**
     * Devuelve entries filtrados por categoría de trigger.
     */
    getByCategory(category) {
        // category: 'head', 'hand', 'emotion', 'blink', 'gaze', 'distance', 'platform'
        const catMap = {
            head: ['left', 'right', 'up', 'down', 'tilt-left', 'tilt-right', 'center'],
            hand: ['thumbs-up', 'peace', 'rock', 'ok', 'fist', 'open-palm', 'point'],
            emotion: ['happy', 'surprise', 'angry', 'neutral'],
            blink: ['blink'],
            gaze: ['gaze-left', 'gaze-right', 'gaze-up', 'gaze-down'],
            distance: ['near', 'far'],
            platform: ['sub', 'donation', 'raid', 'cheer_bits', 'super_chat', 'gift_sub', 'follow', 'channel_points', 'gift', 'member_milestone']
        };
        const triggers = catMap[category] || [];
        return this.entries.filter(e => triggers.includes(e.trigger));
    }

    /**
     * Exportar como CSV.
     */
    exportCsv() {
        const header = 'time,trigger,label,action,scene,actionsCount,success,source\n';
        const rows = this.entries.map(e =>
            [
                new Date(e.time).toISOString(),
                e.trigger,
                e.label,
                e.action,
                e.scene,
                e.actionsCount,
                e.success,
                e.source
            ].map(v => this._csv(v)).join(',')
        ).join('\n');
        return header + rows;
    }

    /**
     * Descarga el historial como CSV desde la UI.
     */
    downloadCSV(filename = null) {
        const csv = this.exportCsv();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `esperantai-trigger-history-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Limpiar historial.
     */
    clear() {
        this.entries = [];
        this._notify();
    }

    /**
     * Estadísticas rápidas.
     */
    stats() {
        const total = this.entries.length;
        const byTrigger = {};
        const bySource = {};
        let successCount = 0;
        for (const e of this.entries) {
            byTrigger[e.trigger] = (byTrigger[e.trigger] || 0) + 1;
            bySource[e.source] = (bySource[e.source] || 0) + 1;
            if (e.success) successCount++;
        }
        return { total, byTrigger, bySource, successRate: total ? (successCount / total * 100).toFixed(1) : 0 };
    }

    onChange(fn) {
        if (typeof fn !== 'function') return () => {};
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== fn);
        };
    }

    _notify() {
        const snapshot = this.getAll();
        for (const listener of this.listeners) {
            try {
                listener(snapshot);
            } catch (e) {
                console.error('[TriggerHistory] listener failed:', e);
            }
        }
    }

    _csv(value) {
        const text = String(value ?? '');
        return `"${text.replace(/"/g, '""')}"`;
    }
}

window.TriggerHistory = TriggerHistory;
window.triggerHistory = new TriggerHistory(100);
