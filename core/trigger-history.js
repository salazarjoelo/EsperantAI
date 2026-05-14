/* ============================================================================
 * EsperantAI — Trigger History
 * Ring buffer de los últimos N triggers para debugging y analytics.
 * ========================================================================== */

'use strict';

class TriggerHistory {
    constructor(maxSize = 100) {
        this.maxSize = maxSize;
        this.entries = [];
    }

    /**
     * Registra un trigger disparado.
     * @param {Object} entry { trigger, label, action, success, source }
     */
    add(entry) {
        this.entries.unshift({
            time: Date.now(),
            trigger: entry.trigger || 'unknown',
            label: entry.label || '',
            action: entry.action || '',
            success: entry.success !== false,
            source: entry.source || 'gesture' // 'gesture' | 'platform' | 'combo'
        });
        if (this.entries.length > this.maxSize) {
            this.entries.length = this.maxSize;
        }
    }

    /**
     * Devuelve los últimos N entries.
     */
    getRecent(count = 50) {
        return this.entries.slice(0, count);
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
        const header = 'time,trigger,label,action,success,source\n';
        const rows = this.entries.map(e =>
            `${new Date(e.time).toISOString()},"${e.trigger}","${e.label}","${e.action}",${e.success},${e.source}`
        ).join('\n');
        return header + rows;
    }

    /**
     * Limpiar historial.
     */
    clear() {
        this.entries = [];
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
}

window.TriggerHistory = TriggerHistory;
window.triggerHistory = new TriggerHistory(100);
