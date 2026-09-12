// Amazon Associates links for the gift-intent page families.
//
// Why this is derived from the title instead of stored per guide: the three families
// that carry gift intent (birthstones, birth flowers, anniversary gifts) all follow the
// same title grammar ("April Birthstone: Diamond, ..."), so the product query can be
// read off the page without a writer having to pick products by hand, and a new page
// in one of these families gets its links the moment it is published.
//
// Program rules this file is written against (Associates Program Operating Agreement,
// checked 2026-09-12):
//   - links go straight to amazon.com with the tag in the URL, no redirect or shortener
//     that would hide where the click came from;
//   - every page that shows a link also shows the identification statement
//     ("As an Amazon Associate ... earns from qualifying purchases"), and the site
//     footer repeats it;
//   - links are rel="sponsored nofollow" so search engines treat them as paid.
// Keep links out of the article body itself: the body is reference material and the
// picks panel is the only place an Amazon link may appear.

export const AMAZON_TAG = 'dayalmanac-20';

export const AMAZON_DISCLOSURE =
	'As an Amazon Associate, DayAlmanac earns from qualifying purchases.';

export interface AffiliatePick {
	/** Link text shown to the reader. */
	label: string;
	/** Amazon search query the link opens. */
	query: string;
}

/** A tagged Amazon.com search URL. */
export function amazonSearchUrl(query: string, tag: string = AMAZON_TAG): string {
	return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${encodeURIComponent(tag)}`;
}

/**
 * Splits the "subject" part of a title into its named items.
 * "Diamond, Unchanged Since the 1912 List" -> ["Diamond"]
 * "Turquoise, Zircon, and Tanzanite"       -> ["Turquoise", "Zircon", "Tanzanite"]
 * "Daisy and Sweet Pea, a Mislabeled Poison" -> ["Daisy", "Sweet Pea"]
 */
function namedItems(afterColon: string): string[] {
	// The editorial tail ("..., Unchanged Since ...", "..., a Mislabeled Poison") is
	// separated from the list of items by a comma followed by a lowercase word, a
	// number, or a word that is clearly commentary. The items themselves are
	// capitalised nouns joined by commas and "and".
	const head = afterColon.split(/,\s+(?=[a-z0-9]|Not\b|Unchanged\b|Forty\b|Reclassified\b|Egypt\b|Borrowed\b|Plus\b|Despite\b|or\b|and a\b)/)[0];
	return head
		.replace(/\bor\b.*$/i, '')
		.split(/,\s*|\s+and\s+/)
		.map((s) => s.trim())
		.filter((s) => s && /^[A-Z]/.test(s) && !/^(Two|The|Not|A)\b/.test(s));
}

function subject(title: string): string {
	const i = title.indexOf(':');
	return i >= 0 ? title.slice(i + 1).trim() : '';
}

const ZODIAC_ANIMALS =
	/\b(Rat|Ox|Tiger|Rabbit|Dragon|Snake|Horse|Goat|Sheep|Monkey|Rooster|Dog|Pig)\b/;

/**
 * Up to three product searches for a page, or an empty list when the page family
 * has no gift intent (observances, zodiac dates, awareness months and so on).
 */
export function affiliatePicks(guide: { category: string; title: string; slug: string }): AffiliatePick[] {
	const { category, title, slug } = guide;
	const subj = subject(title);

	if (category === 'Birthstones') {
		if (slug === 'birthstones-by-month') {
			return [
				{ label: 'Birthstone jewelry by month', query: 'birthstone jewelry by month' },
				{ label: 'Birthstone necklaces', query: 'birthstone necklace' },
				{ label: 'Birthstone rings', query: 'birthstone ring' },
			];
		}
		const stones = namedItems(subj);
		if (stones.length === 0) return [];
		const [first, second] = stones;
		const picks: AffiliatePick[] = [
			{ label: `${first} jewelry`, query: `${first} birthstone jewelry` },
			{ label: `${first} stud earrings`, query: `${first} stud earrings` },
		];
		picks.push(
			second
				? { label: `${second} jewelry`, query: `${second} birthstone jewelry` }
				: { label: `${first} pendant necklace`, query: `${first} pendant necklace` },
		);
		return picks;
	}

	if (category === 'Birth Flowers') {
		if (slug === 'birth-flowers-by-month') {
			return [
				{ label: 'Birth flower necklaces', query: 'birth flower necklace' },
				{ label: 'Birth flower seed gift sets', query: 'birth flower seeds gift set' },
				{ label: 'Birth flower art prints', query: 'birth flower art print' },
			];
		}
		const flowers = namedItems(subj);
		if (flowers.length === 0) return [];
		const [first, second] = flowers;
		const picks: AffiliatePick[] = [
			{ label: `${first} seeds`, query: `${first} flower seeds` },
			{ label: `${first} birth flower necklace`, query: `${first} birth flower necklace` },
		];
		picks.push(
			second
				? { label: `${second} seeds`, query: `${second} flower seeds` }
				: { label: `${first} art print`, query: `${first} botanical art print` },
		);
		return picks;
	}

	if (category === 'Anniversaries') {
		if (slug === 'anniversary-gifts-by-year') {
			return [
				{ label: 'Traditional anniversary gifts', query: 'traditional anniversary gift' },
				{ label: 'Anniversary gifts for wife', query: 'anniversary gift for wife' },
				{ label: 'Anniversary gifts for husband', query: 'anniversary gift for husband' },
			];
		}
		const ordinal = title.match(/^(\d+(?:st|nd|rd|th))\s+Anniversary/i)?.[1];
		if (!ordinal) return [];
		const material = subj.match(/^([A-Z][a-z]+)/)?.[1];
		return [
			{
				label: material ? `${ordinal} anniversary ${material.toLowerCase()} gifts` : `${ordinal} anniversary gifts`,
				query: material ? `${ordinal} anniversary ${material} gift` : `${ordinal} anniversary gift`,
			},
			{ label: `${ordinal} anniversary gifts for wife`, query: `${ordinal} anniversary gift for wife` },
			{ label: `${ordinal} anniversary gifts for husband`, query: `${ordinal} anniversary gift for husband` },
		];
	}

	if (category === 'Chinese Zodiac') {
		const animal = title.match(ZODIAC_ANIMALS)?.[1];
		if (!animal) return [];
		return [
			{ label: `Year of the ${animal} figurines`, query: `year of the ${animal} figurine` },
			{ label: `${animal} zodiac pendants`, query: `chinese zodiac ${animal} pendant` },
			{ label: `${animal} zodiac gifts`, query: `chinese zodiac ${animal} gift` },
		];
	}

	return [];
}
