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
 *  - National Grandparents Day: 36 U.S.C. §125 requests a proclamation designating "the
 *    first Sunday in September after Labor Day". Enacted by Pub. L. 96-62 (Sept 6, 1979);
 *    the 1978 item often cited instead is Proclamation 4580, which named a single date and
 *    created no annual rule. Derived dates follow from the Labor Day dates above.
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
	// 36 U.S.C. §125. Derived from the OPM Labor Day dates above:
	// 2026 Labor Day Mon 09-07 -> Sun 09-13; 2027 Mon 09-06 -> Sun 09-12;
	// 2028 Mon 09-04 -> Sun 09-10; 2029 Mon 09-03 -> Sun 09-09; 2030 Mon 09-02 -> Sun 09-08.
	const expected = ['2026-09-13', '2027-09-12', '2028-09-10', '2029-09-09', '2030-09-08'];
	const got = expand(RULES.usGrandparentsDay, 2026, 5);
	assert.deepEqual(got.map((o) => o.date), expected);
	assert.ok(got.every((o) => o.weekday === 'Sunday'));
});

test('Grandparents Day is NOT the first Sunday in September', () => {
	// The common paraphrase. The two rules agree ONLY when September 1 is a Monday (then
	// Labor Day is the 1st and the first Sunday is the 7th either way — 2025 and 2031 are
	// such years). In every other year the paraphrase runs a week early. 2030 is the
	// starkest case: first Sunday 09-01, statutory date 09-08.
	assert.equal(nthWeekdayOf(2030, 9, 'Sunday', 1).date, '2030-09-01');
	assert.equal(occurrenceFor(RULES.usGrandparentsDay, 2030).date, '2030-09-08');
});

test('National Adoption Day is the Saturday before Thanksgiving', () => {
	// Not a statute -- an organizer convention. Pinned against independent court press
	// releases rather than the generator itself: Mecklenburg County NC and Maryland courts
	// both held it 2024-11-23; Maryland and Facebook/Dave Thomas Foundation both confirm
	// 2025-11-22. 2023-11-18 is corroborated the same way. 2026-11-21 follows from the same
	// "Saturday before Thanksgiving" rule applied to Thanksgiving 2026 (2026-11-26) -- several
	// calendar sites instead publish 2026-11-22, which this test proves is a Sunday, not the
	// Saturday the rule calls for.
	const expected = ['2026-11-21', '2027-11-20', '2028-11-18', '2029-11-17', '2030-11-23'];
	const got = expand(RULES.usNationalAdoptionDay, 2026, 5);
	assert.deepEqual(got.map((o) => o.date), expected);
	assert.ok(got.every((o) => o.weekday === 'Saturday'));
	assert.equal(occurrenceFor(RULES.usNationalAdoptionDay, 2023).date, '2023-11-18');
	assert.equal(occurrenceFor(RULES.usNationalAdoptionDay, 2024).date, '2024-11-23');
	assert.equal(occurrenceFor(RULES.usNationalAdoptionDay, 2025).date, '2025-11-22');
});

test('the paraphrase and the statute coincide when September 1 is a Monday', () => {
	// 2025 and 2031 both start September on a Monday, so Labor Day is the 1st and the first
	// Sunday is the 7th under either reading. Worth pinning: someone spot-checking the page
	// against 2025 would otherwise conclude the rule is wrong.
	for (const year of [2025, 2031]) {
		assert.equal(nthWeekdayOf(year, 9, 'Monday', 1).date, `${year}-09-01`);
		assert.equal(nthWeekdayOf(year, 9, 'Sunday', 1).date, occurrenceFor(RULES.usGrandparentsDay, year).date);
	}
});

test('the Canadian second-Sunday rule is never EARLIER than the US statutory date', () => {
	// The article once said Canada's second Sunday in September runs "one week earlier than
	// the American date in most years". It is backwards, and the backwardness is the mirror
	// image of the paraphrase this site exists to correct: the SECOND Sunday is the one that
	// usually coincides, the FIRST Sunday is the one that runs early. Pinned so it cannot be
	// written the wrong way round again.
	let same = 0, caLater = 0, caEarlier = 0;
	for (let y = 2020; y <= 2060; y++) {
		const us = occurrenceFor(RULES.usGrandparentsDay, y).date;
		const ca = nthWeekdayOf(y, 9, 'Sunday', 2).date;
		if (us === ca) same++;
		else if (ca > us) caLater++;
		else caEarlier++;
	}
	assert.equal(caEarlier, 0, 'Canada is never earlier than the US date');
	assert.equal(same, 35);
	assert.equal(caLater, 6);
	// The 6 divergent years are exactly the years September 1 falls on a Monday.
	assert.equal(nthWeekdayOf(2025, 9, 'Sunday', 2).date, '2025-09-14');
	assert.equal(occurrenceFor(RULES.usGrandparentsDay, 2025).date, '2025-09-07');
});

test('a year never begins on a Monday AND starts September on a Monday', () => {
	// The article briefly offered readers a self-check phrased as "a year beginning on a
	// Monday" when it meant "a year whose September begins on a Monday". The two are
	// mutually exclusive, so the shortcut returned the wrong answer in every year -- and
	// most damagingly for 2025, the year a reader is likeliest to look up. Pinned so the
	// two conditions can never be conflated again.
	let both = 0;
	for (let y = 1900; y <= 2100; y++) {
		if (weekdayName(y, 1, 1) === 'Monday' && weekdayName(y, 9, 1) === 'Monday') both++;
	}
	assert.equal(both, 0);
	assert.equal(weekdayName(2025, 1, 1), 'Wednesday');
	assert.equal(weekdayName(2025, 9, 1), 'Monday');
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
