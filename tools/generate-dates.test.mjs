/**
 * Tests for the date-table generator.
 *
 * THE ONE RULE FOR THIS FILE: every expected value below is transcribed from a
 * published authority, never produced by running the generator and pasting the output
 * back. A test written that way passes by construction and would have caught nothing.
 *
 * Sources for the expected values:
 *
 *  - US federal holiday dates (Labor Day, Thanksgiving, Memorial Day, Birthday of
 *    Martin Luther King, Jr.): the schedule published by the US Office of Personnel
 *    Management at https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/
 *    which lists the observed date for each year. The governing rule text is
 *    5 U.S.C. §6103.
 *  - National Grandparents Day: Pub. L. 95-276 (1978) designates "the first Sunday
 *    after Labor Day"; the derived dates follow from the Labor Day dates above.
 *  - Weekday anchors: 2026-01-01 is a Thursday and 2026-08-01 is a Saturday.
 *
 * Run with:  node --test tools/
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
	daysFromCivil,
	civilFromDays,
	daysInMonth,
	expand,
	fixedDateOf,
	isLeapYear,
	nthWeekdayOf,
	occurrenceFor,
	offsetFrom,
	RULES,
	weekdayName,
} from './generate-dates.mjs';

// ---------------------------------------------------------------------------
// Weekday anchors
// ---------------------------------------------------------------------------

test('weekday anchors', () => {
	assert.equal(weekdayName(1970, 1, 1), 'Thursday'); // Unix epoch
	assert.equal(weekdayName(2000, 3, 1), 'Wednesday'); // day after the 2000 leap day
	assert.equal(weekdayName(2026, 1, 1), 'Thursday');
	assert.equal(weekdayName(2026, 8, 1), 'Saturday');
});

test('leap years and month lengths', () => {
	assert.equal(isLeapYear(2000), true); // divisible by 400
	assert.equal(isLeapYear(1900), false); // divisible by 100, not 400
	assert.equal(isLeapYear(2028), true);
	assert.equal(isLeapYear(2026), false);
	assert.equal(daysInMonth(2028, 2), 29);
	assert.equal(daysInMonth(2026, 2), 28);
});

test('civil <-> days round-trips across a leap boundary', () => {
	for (const [y, m, d] of [[2028, 2, 28], [2028, 2, 29], [2028, 3, 1], [2030, 12, 31]]) {
		const back = civilFromDays(daysFromCivil(y, m, d));
		assert.deepEqual(back, { year: y, month: m, day: d });
	}
});

// ---------------------------------------------------------------------------
// US federal holidays — expected dates from the OPM schedule
// ---------------------------------------------------------------------------

test('Labor Day is the first Monday in September', () => {
	// OPM: 2026-09-07, 2027-09-06, 2028-09-04, 2029-09-03, 2030-09-02
	const expected = ['2026-09-07', '2027-09-06', '2028-09-04', '2029-09-03', '2030-09-02'];
	assert.deepEqual(expand(RULES.usLaborDay, 2026, 5).map((o) => o.date), expected);
	assert.ok(expand(RULES.usLaborDay, 2026, 5).every((o) => o.weekday === 'Monday'));
});

test('Thanksgiving is the fourth Thursday in November', () => {
	// OPM: 2026-11-26, 2027-11-25, 2028-11-23, 2029-11-22, 2030-11-28
	const expected = ['2026-11-26', '2027-11-25', '2028-11-23', '2029-11-22', '2030-11-28'];
	assert.deepEqual(expand(RULES.usThanksgiving, 2026, 5).map((o) => o.date), expected);
	assert.ok(expand(RULES.usThanksgiving, 2026, 5).every((o) => o.weekday === 'Thursday'));
});

test('Memorial Day is the LAST Monday in May, not the fourth', () => {
	// OPM: 2026-05-25, 2027-05-31, 2028-05-29.
	// 2027 is the case that separates "last" from "fourth": May 2027 has five Mondays,
	// so a fourth-Monday implementation would return 2027-05-24 and be a week early.
	const expected = ['2026-05-25', '2027-05-31', '2028-05-29'];
	assert.deepEqual(expand(RULES.usMemorialDay, 2026, 3).map((o) => o.date), expected);
	assert.notEqual(occurrenceFor(RULES.usMemorialDay, 2027).date, nthWeekdayOf(2027, 5, 'Monday', 4).date);
});

test('Birthday of Martin Luther King, Jr. is the third Monday in January', () => {
	// OPM: 2026-01-19, 2027-01-18, 2028-01-17
	const expected = ['2026-01-19', '2027-01-18', '2028-01-17'];
	assert.deepEqual(expand(RULES.usMlkDay, 2026, 3).map((o) => o.date), expected);
});

// ---------------------------------------------------------------------------
// Offset rules
// ---------------------------------------------------------------------------

test('Grandparents Day is the first Sunday AFTER Labor Day', () => {
	// Pub. L. 95-276. Derived from the OPM Labor Day dates above:
	// 2026 Labor Day Mon 09-07 -> Sun 09-13; 2027 Mon 09-06 -> Sun 09-12;
	// 2028 Mon 09-04 -> Sun 09-10; 2029 Mon 09-03 -> Sun 09-09; 2030 Mon 09-02 -> Sun 09-08.
	const expected = ['2026-09-13', '2027-09-12', '2028-09-10', '2029-09-09', '2030-09-08'];
	const got = expand(RULES.usGrandparentsDay, 2026, 5);
	assert.deepEqual(got.map((o) => o.date), expected);
	assert.ok(got.every((o) => o.weekday === 'Sunday'));
});

test('Grandparents Day is NOT the first Sunday in September', () => {
	// The common paraphrase. It is wrong whenever September starts on a Sunday or the
	// first Sunday falls before Labor Day — 2030 is such a year (first Sunday 09-01,
	// statutory date 09-08), so a page repeating the paraphrase would be a week early.
	assert.equal(nthWeekdayOf(2030, 9, 'Sunday', 1).date, '2030-09-01');
	assert.equal(occurrenceFor(RULES.usGrandparentsDay, 2030).date, '2030-09-08');
});

test('offsetFrom crosses month and year boundaries', () => {
	assert.equal(offsetFrom({ date: '2026-12-30' }, 5).date, '2027-01-04');
	assert.equal(offsetFrom({ date: '2028-02-28' }, 1).date, '2028-02-29'); // leap
	assert.equal(offsetFrom({ date: '2026-02-28' }, 1).date, '2026-03-01'); // non-leap
	assert.equal(offsetFrom({ date: '2026-03-01' }, -1).date, '2026-02-28');
});

// ---------------------------------------------------------------------------
// Fixed dates
// ---------------------------------------------------------------------------

test('fixed dates carry the right weekday and reject impossible days', () => {
	// 2026-10-03 is a Saturday: 2026-08-01 is a Saturday, and 63 days later is 10-03.
	assert.deepEqual(fixedDateOf(2026, 10, 3), { date: '2026-10-03', weekday: 'Saturday' });
	assert.equal(fixedDateOf(2028, 2, 29).date, '2028-02-29');
	assert.throws(() => fixedDateOf(2026, 2, 29), /does not exist/);
	assert.throws(() => fixedDateOf(2026, 4, 31), /does not exist/);
});

// ---------------------------------------------------------------------------
// Guardrails
// ---------------------------------------------------------------------------

test('asking for an nth weekday a month does not have throws instead of wrapping', () => {
	// September 2026 starts on a Tuesday, so it has four Mondays (7, 14, 21, 28).
	assert.equal(nthWeekdayOf(2026, 9, 'Monday', 4).date, '2026-09-28');
	assert.throws(() => nthWeekdayOf(2026, 9, 'Monday', 5), /has no 5th Monday/);
});

test("kind 'table' refuses to be computed", () => {
	// Easter, the Hebrew/Islamic/Chinese calendars and moon phases must be transcribed
	// from a cited authority, never derived here.
	assert.throws(() => occurrenceFor({ kind: 'table' }, 2026), /not computed/);
});

test('unknown weekday names and rule kinds throw', () => {
	assert.throws(() => nthWeekdayOf(2026, 9, 'Moonday', 1), /Unknown weekday/);
	assert.throws(() => occurrenceFor({ kind: 'lunar' }, 2026), /Unknown rule kind/);
});
