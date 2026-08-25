// Unit tests for src/lib/countdown.ts.
// Run with: npm test (node --test tools/**/*.test.mjs src/lib/*.test.ts)

import test from 'node:test';
import assert from 'node:assert/strict';
import { nextCountdown, formatCountdownLabel, todayISO } from './countdown.ts';

const OCCURRENCES = [
	{ date: '2025-10-03', weekday: 'Friday' },
	{ date: '2026-10-03', weekday: 'Saturday' },
	{ date: '2027-10-03', weekday: 'Sunday' },
];

test('nextCountdown picks the first occurrence on or after today', () => {
	const result = nextCountdown(OCCURRENCES, '2026-01-01');
	assert.equal(result?.occurrence.date, '2026-10-03');
	assert.equal(result?.daysRemaining, 275);
});

test('nextCountdown treats the occurrence date itself as "today", zero days out', () => {
	const result = nextCountdown(OCCURRENCES, '2026-10-03');
	assert.equal(result?.occurrence.date, '2026-10-03');
	assert.equal(result?.daysRemaining, 0);
});

test('nextCountdown skips past occurrences', () => {
	const result = nextCountdown(OCCURRENCES, '2025-12-31');
	assert.equal(result?.occurrence.date, '2026-10-03');
});

test('nextCountdown falls back to the last occurrence with a negative count once the whole list is stale', () => {
	const result = nextCountdown(OCCURRENCES, '2030-01-01');
	assert.equal(result?.occurrence.date, '2027-10-03');
	assert.ok((result?.daysRemaining ?? 0) < 0);
});

test('nextCountdown returns null for an empty list', () => {
	assert.equal(nextCountdown([], '2026-01-01'), null);
});

test('formatCountdownLabel: today, singular, plural, stale', () => {
	assert.equal(formatCountdownLabel(0), 'Today');
	assert.equal(formatCountdownLabel(1), '1 day');
	assert.equal(formatCountdownLabel(42), '42 days');
	assert.equal(formatCountdownLabel(-3), 'Date data needs an update');
});

test('todayISO formats a given date as local YYYY-MM-DD', () => {
	assert.equal(todayISO(new Date(2026, 0, 5)), '2026-01-05');
	assert.equal(todayISO(new Date(2026, 10, 30)), '2026-11-30');
});
