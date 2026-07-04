"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = clamp;
exports.round = round;
exports.safeNumber = safeNumber;
exports.average = average;
exports.median = median;
exports.lower = lower;
exports.containsAny = containsAny;
exports.formatPercent = formatPercent;
function clamp(value, min, max) {
    if (Number.isNaN(value))
        return min;
    return Math.min(max, Math.max(min, value));
}
function round(value, digits = 0) {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
}
function safeNumber(value, fallback = 0) {
    const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
    return Number.isFinite(parsed) ? parsed : fallback;
}
function average(values) {
    if (!values.length)
        return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}
function median(values) {
    if (!values.length)
        return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[middle - 1] + sorted[middle]) / 2
        : sorted[middle];
}
function lower(value) {
    return String(value ?? '').trim().toLowerCase();
}
function containsAny(source, needles) {
    const haystack = lower(source);
    return needles.some((needle) => haystack.includes(lower(needle)));
}
function formatPercent(value) {
    return `${round(value, 0)}%`;
}
//# sourceMappingURL=yield-rule.utils.js.map