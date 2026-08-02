/**
 * Date-table generator for DayAlmanac.
 *
 * Scope, deliberately narrow: this file computes ONLY Gregorian rules that can be
 * stated in one sentence and checked by eye — a fixed calendar date, the nth weekday
 * of a month, and a fixed day offset from one of those. That covers the great majority
 * of observances and every US federal holiday.
 *
 * It does NOT compute Easter, the Hebrew or Islamic calendars, the Chinese calendar, or
 * moon phases. Those go in `guides.ts` as `kind: 'table'` with dates transcribed from a
 * published authority and cited on the page. A Computus implementation that is subtly
 * wrong in 2031 is far worse than a five-row table with a citation next to it, and the
 * error would be invisible until a reader had already booked something around it.
 *
 * Everything here is pure and dependency-free so the tests can pin real dates.
 * Deliberately avoids the `Date` parser's timezone behaviour: dates are (y, m, d)
 * triples throughout, and the only arithmetic is a day count.
 */

export const WEEKDAYS = [
	'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

export const WEEKDAY_INDEX = Object.fromEntries(WEEKDAYS.map((name, i) => [name, i]));

export function isLeapYear(year) {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year, month) {
	if (month === 2) return isLeapYear(year) ? 29 : 28;
	return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

/**
 * Days since 1970-01-01 for a (y, m, d) triple, via the standard civil-from-days
 * inverse (Howard Hinnant's algorithm). Exact for all years, no Date involved.
 */
export function daysFromCivil(year, month, day) {
	const y = year - (month <= 2 ? 1 : 0);
	const era = Math.floor(y / 400);
	const yoe = y - era * 400; // [0, 399]
	const doy = Math.floor((153 * (month + (month > 2 ? -3 : 9)) + 2) / 5) + day - 1; // [0, 365]
	const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy; // [0, 146096]
	return era * 146097 + doe - 719468;
}

export function civilFromDays(z) {
	z += 719468;
	const era = Math.floor(z / 146097);
	const doe = z - era * 146097;
	const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
	const y = yoe + era * 400;
	const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
	const mp = Math.floor((5 * doy + 2) / 153);
	const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
	const m = mp + (mp < 10 ? 3 : -9);
	return { year: y + (m <= 2 ? 1 : 0), month: m, day: d };
}

/** 1970-01-01 was a Thursday (index 4). */
export function weekdayIndex(year, month, day) {
	return (((daysFromCivil(year, month, day) + 4) % 7) + 7) % 7;
}

export function weekdayName(year, month, day) {
	return WEEKDAYS[weekdayIndex(year, month, day)];
}

export function toISO(year, month, day) {
	return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Builds an Occurrence — the shape `src/data/guides.ts` expects. */
export function occurrence(year, month, day) {
	return { date: toISO(year, month, day), weekday: weekdayName(year, month, day) };
}

/**
 * The nth `weekday` of `month` in `year`. `nth` is 1-based; pass -1 for the last one
 * ("the last Monday in May"). Throws rather than silently wrapping into the next month
 * when a month has only four of the requested weekday and the fifth was asked for.
 */
export function nthWeekdayOf(year, month, weekday, nth) {
	const target = typeof weekday === 'number' ? weekday : WEEKDAY_INDEX[weekday];
	if (target === undefined) throw new Error(`Unknown weekday: ${weekday}`);
	const length = daysInMonth(year, month);

	if (nth === -1) {
		const lastIdx = weekdayIndex(year, month, length);
		const day = length - (((lastIdx - target) % 7) + 7) % 7;
		return occurrence(year, month, day);
	}

	if (!Number.isInteger(nth) || nth < 1) throw new Error(`nth must be a positive integer or -1, got ${nth}`);
	const firstIdx = weekdayIndex(year, month, 1);
	const firstDay = 1 + ((((target - firstIdx) % 7) + 7) % 7);
	const day = firstDay + (nth - 1) * 7;
	if (day > length) {
		throw new Error(`${year}-${month} has no ${nth}th ${WEEKDAYS[target]} (only ${Math.floor((length - firstDay) / 7) + 1})`);
	}
	return occurrence(year, month, day);
}

/** The same calendar date every year. */
export function fixedDateOf(year, month, day) {
	if (day > daysInMonth(year, month)) {
		throw new Error(`${toISO(year, month, day)} does not exist`);
	}
	return occurrence(year, month, day);
}

/** `offsetDays` after a base occurrence — "the Sunday after Labor Day" is offset 6 from the first Monday in September. */
export function offsetFrom(base, offsetDays) {
	const [y, m, d] = base.date.split('-').map(Number);
	const { year, month, day } = civilFromDays(daysFromCivil(y, m, d) + offsetDays);
	return occurrence(year, month, day);
}

/**
 * Expands a rule over `count` consecutive years starting at `startYear`.
 *
 * `rule` is one of:
 *   { kind: 'fixed',        month, day }
 *   { kind: 'nth-weekday',  month, weekday, nth }
 *   { kind: 'offset',       base: <rule>, offsetDays }
 */
export function expand(rule, startYear, count = 5) {
	const out = [];
	for (let y = startYear; y < startYear + count; y++) {
		out.push(occurrenceFor(rule, y));
	}
	return out;
}

export function occurrenceFor(rule, year) {
	switch (rule.kind) {
		case 'fixed':
			return fixedDateOf(year, rule.month, rule.day);
		case 'nth-weekday':
			return nthWeekdayOf(year, rule.month, rule.weekday, rule.nth);
		case 'offset':
			return offsetFrom(occurrenceFor(rule.base, year), rule.offsetDays);
		case 'table':
			throw new Error("kind 'table' is not computed — transcribe the dates from the cited authority");
		default:
			throw new Error(`Unknown rule kind: ${rule.kind}`);
	}
}

/** Named rules reused across pages. Keep the wording matching the founding document. */
export const RULES = {
	// 5 U.S.C. §6103 — "the first Monday in September".
	usLaborDay: { kind: 'nth-weekday', month: 9, weekday: 'Monday', nth: 1 },
	// 5 U.S.C. §6103 — "the fourth Thursday in November".
	usThanksgiving: { kind: 'nth-weekday', month: 11, weekday: 'Thursday', nth: 4 },
	// 5 U.S.C. §6103 — "the last Monday in May".
	usMemorialDay: { kind: 'nth-weekday', month: 5, weekday: 'Monday', nth: -1 },
	// 5 U.S.C. §6103 — "the third Monday in January".
	usMlkDay: { kind: 'nth-weekday', month: 1, weekday: 'Monday', nth: 3 },
	// 36 U.S.C. §125 — "the first Sunday in September after Labor Day".
	// Enacted by Pub. L. 96-62 (Sept 6, 1979), 93 Stat. 410; recodified 1998 by Pub. L. 105-225.
	// NOT Pub. L. 95-276, which is an unrelated 1978 Smithsonian appointment — most secondary
	// sources, including the WVU archive finding aid, misdate this to a 1978 statute. The 1978
	// item is Proclamation 4580, which designated one date only and created no annual rule.
	usGrandparentsDay: {
		kind: 'offset',
		base: { kind: 'nth-weekday', month: 9, weekday: 'Monday', nth: 1 },
		offsetDays: 6,
	},
};

/** CLI: node tools/generate-dates.mjs <ruleName|month/day> [startYear] [count] */
if (import.meta.url === `file://${process.argv[1]}`) {
	const [name, startArg, countArg] = process.argv.slice(2);
	if (!name) {
		console.error('usage: node tools/generate-dates.mjs <ruleName|MM/DD> [startYear] [count]');
		console.error(`known rules: ${Object.keys(RULES).join(', ')}`);
		process.exit(1);
	}
	const rule = RULES[name] ?? (() => {
		const m = name.match(/^(\d{1,2})\/(\d{1,2})$/);
		if (!m) throw new Error(`Unknown rule "${name}" — pass a known rule name or MM/DD`);
		return { kind: 'fixed', month: Number(m[1]), day: Number(m[2]) };
	})();
	const startYear = Number(startArg ?? new Date().getUTCFullYear());
	console.log(JSON.stringify(expand(rule, startYear, Number(countArg ?? 5)), null, 2));
}
