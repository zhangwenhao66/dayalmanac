export interface SectionImage {
	/** Path under public/, e.g. '/images/grandparents-day-proclamation.jpg'. */
	src: string;
	/** Describes what the image shows. */
	alt: string;
	/** Attribution + license, supports markdown links. Omit only for self-made diagrams. */
	credit?: string;
}

export interface GuideSection {
	heading: string;
	body: string[];
	/** Optional in-body image, rendered after this section's paragraphs. */
	image?: SectionImage;
}

export interface FaqItem {
	question: string;
	answer: string;
}

export interface Source {
	label: string;
	url: string;
}

/**
 * One dated occurrence of an observance.
 *
 * WRITTEN BY `tools/generate-dates.mjs` — never hand-typed. A wrong date here is the
 * most damaging mistake this site can make, because readers plan time off and marketing
 * calendars from these tables. The generator's expected values live in
 * `tools/generate-dates.test.mjs` and are transcribed from primary sources rather than
 * produced by the generator itself, so the test can actually fail.
 */
export interface Occurrence {
	/** ISO date, e.g. '2026-10-03'. */
	date: string;
	/** Weekday name derived from `date` at generation time, e.g. 'Saturday'. */
	weekday: string;
}

export type DateRuleKind =
	/** The same calendar date every year, e.g. October 3. */
	| 'fixed'
	/** The nth weekday of a month, e.g. the fourth Sunday in September. `nth: -1` means the last one. */
	| 'nth-weekday'
	/** A fixed day offset from another rule's occurrence, e.g. the Sunday after Labor Day. */
	| 'offset'
	/**
	 * No rule we are willing to compute. Dates are transcribed from a published
	 * authoritative table. This is what lunisolar and religious calendars use — Easter,
	 * the Hebrew and Islamic calendars, the Chinese calendar. We deliberately do not
	 * implement calendar conversion ourselves; a subtly wrong Computus is worse than a
	 * short table with a citation.
	 */
	| 'table';

export interface DateRule {
	kind: DateRuleKind;
	/** Plain-English statement of the rule, worded the way the founding source words it. */
	text: string;
	/** Where the RULE is documented — not where the dates happened to be computed. */
	source: Source;
	/**
	 * Upcoming occurrences, covering at least the next five years, so that a missed
	 * annual refresh degrades slowly instead of leaving the page outright wrong.
	 */
	occurrences: Occurrence[];
	/** Set when the observance is not universally kept on this date, and say who differs. */
	caveat?: string;
}

/**
 * Who started the observance.
 *
 * A great many "national days" were registered by a brand or by a single enthusiast, and
 * the established calendar sites paper over this with vague passives — "has been
 * celebrated since...". Making the distinction a typed field rather than a good habit
 * means a reviewer can check it. `status: 'unverified'` with text that admits the gap is
 * a perfectly good answer here; inventing a plausible-sounding history is not.
 */
export interface Founding {
	/** 'documented' — a named founder, proclamation or registration is on the record. */
	status: 'documented' | 'unverified';
	/** One or two sentences: who started it and when, or plainly that nobody can show. */
	text: string;
	/** Required when status is 'documented'. */
	source?: Source;
}

export interface Guide {
	slug: string;
	/**
	 * Free-form topic group, e.g. "Observances", "Public Holidays", "Birthstones",
	 * "Zodiac Dates", "Awareness Months". The calendar keeps growing new families of
	 * pages, so this is an open string rather than a union type.
	 */
	category: string;
	title: string;
	description: string;
	/** Original publication date. Falls back to `updated` when unset, so only articles that have since been edited need it. */
	published?: string;
	updated: string;
	/** One or two sentences summarizing the core finding, surfaced above the fold for GEO/AI-search extraction. */
	coreSummary: string;
	/**
	 * When the observance falls. Present on dated pages, absent on explainers that are
	 * not tied to a date.
	 *
	 * URLs stay evergreen — `/national-coffee-day/`, never `/national-coffee-day-2026/` —
	 * so a page accumulates links across years. Year-bearing searches are served by
	 * refreshing this table and the title, not by minting a new URL.
	 */
	dateRule?: DateRule;
	/** Who started it. Required on observance pages. */
	founding?: Founding;
	sections: GuideSection[];
	faq?: FaqItem[];
	sources?: Source[];
	/** Path under public/, e.g. "/images/national-coffee-day.jpg". Falls back to the site favicon when absent. */
	image?: string;
	/** Describes what the photo shows. Falls back to the article title when absent. */
	imageAlt?: string;
	/** Attribution line, supports [text](url) markdown. */
	imageCredit?: string;
}

export function categorySlug(category: string): string {
	return category
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** Almanac inks: the colours a printed calendar actually used — holiday red, ledger blue, moss, ochre. */
const CATEGORY_PALETTE = ['#a8352b', '#2f4858', '#5b6d45', '#8a6a2f', '#6d4470', '#3f6152'];

export function categoryColor(category: string): string {
	let hash = 0;
	for (let i = 0; i < category.length; i++) {
		hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
	}
	return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
}

const MONTHS = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December',
];

/** Formats an occurrence as e.g. "Saturday, October 3, 2026". */
export function formatOccurrence(o: Occurrence): string {
	const [y, m, d] = o.date.split('-').map(Number);
	return `${o.weekday}, ${MONTHS[m - 1]} ${d}, ${y}`;
}

export const guides: Guide[] = [];
