// Unit tests for src/lib/affiliate.ts.
// Run with: npm test (node --test tools/**/*.test.mjs src/lib/*.test.ts)

import test from 'node:test';
import assert from 'node:assert/strict';
import { affiliatePicks, amazonSearchUrl, AMAZON_TAG } from './affiliate.ts';

test('amazonSearchUrl goes straight to amazon.com with the tag', () => {
	const url = amazonSearchUrl('diamond stud earrings');
	assert.equal(url, `https://www.amazon.com/s?k=diamond%20stud%20earrings&tag=${AMAZON_TAG}`);
});

test('single-stone birthstone page gets three picks off the first stone', () => {
	const picks = affiliatePicks({
		category: 'Birthstones',
		slug: 'april-birthstone',
		title: 'April Birthstone: Diamond, Unchanged Since the 1912 List',
	});
	assert.deepEqual(
		picks.map((p) => p.query),
		['Diamond birthstone jewelry', 'Diamond stud earrings', 'Diamond pendant necklace'],
	);
});

test('multi-stone birthstone page uses the second stone for the third pick', () => {
	const picks = affiliatePicks({
		category: 'Birthstones',
		slug: 'december-birthstone',
		title: 'December Birthstone: Turquoise, Zircon, and Tanzanite',
	});
	assert.deepEqual(
		picks.map((p) => p.query),
		['Turquoise birthstone jewelry', 'Turquoise stud earrings', 'Zircon birthstone jewelry'],
	);
});

test('birth flower page with two flowers', () => {
	const picks = affiliatePicks({
		category: 'Birth Flowers',
		slug: 'april-birth-flower',
		title: 'April Birth Flower: Daisy and Sweet Pea, a Mislabeled Poison',
	});
	assert.deepEqual(
		picks.map((p) => p.query),
		['Daisy flower seeds', 'Daisy birth flower necklace', 'Sweet Pea flower seeds'],
	);
});

test('editorial tails with capitalised words do not leak into the item list', () => {
	const picks = affiliatePicks({
		category: 'Birthstones',
		slug: 'november-birthstone',
		title: 'November Birthstone: Topaz and Citrine, Forty Years Apart',
	});
	assert.deepEqual(picks.map((p) => p.query)[2], 'Citrine birthstone jewelry');
	const picks2 = affiliatePicks({
		category: 'Birthstones',
		slug: 'september-birthstone',
		title: 'September Birthstones: Sapphire, or Two Stones?',
	});
	assert.deepEqual(
		picks2.map((p) => p.query),
		['Sapphire birthstone jewelry', 'Sapphire stud earrings', 'Sapphire pendant necklace'],
	);
});

test('anniversary page reads the ordinal and the material', () => {
	const picks = affiliatePicks({
		category: 'Anniversaries',
		slug: '11th-anniversary-gift',
		title: '11th Anniversary Gift: Steel in the US, Nothing in the UK',
	});
	assert.equal(picks[0].query, '11th anniversary Steel gift');
	assert.equal(picks.length, 3);
});

test('chinese zodiac page reads the animal', () => {
	const picks = affiliatePicks({
		category: 'Chinese Zodiac',
		slug: '1988-chinese-zodiac',
		title: '1988 Chinese Zodiac: Earth Dragon, But Only After February 17',
	});
	assert.equal(picks[0].query, 'year of the Dragon figurine');
});

test('page families without gift intent get no picks', () => {
	assert.deepEqual(
		affiliatePicks({ category: 'Observances', slug: 'national-coffee-day', title: 'National Coffee Day 2026' }),
		[],
	);
	assert.deepEqual(
		affiliatePicks({ category: 'Zodiac Dates', slug: 'june-22-zodiac', title: 'June 22 Zodiac: Cancer, Despite the Cusp Claims' }),
		[],
	);
});
