// Unit tests for src/lib/dayQuiz.ts.
// Run with: npm test (node --test tools/**/*.test.mjs src/lib/*.test.ts)
//
// Node 22's native TypeScript stripping runs .test.ts files directly, no devDependency
// needed -- same pattern as WarCrumbs/WageLark/DialWick's src/lib/*.test.ts in this matrix.

import test from 'node:test';
import assert from 'node:assert/strict';
import { pickQuizSet, renderInlineMarkdown } from './dayQuiz.ts';
import type { DayQuizItem } from '../data/dayQuiz.ts';

function makeItems(n: number): DayQuizItem[] {
	return Array.from({ length: n }, (_, i) => ({
		claim: `Claim ${i}`,
		verdict: i % 2 === 0,
		explanation: `Explanation ${i}`,
		sourceSlug: `slug-${i}`,
		sourceTitle: `Title ${i}`,
	}));
}

// A tiny deterministic "rng" so pickQuizSet's shuffle can be asserted exactly instead of
// just "looks plausible". Cycles through a fixed sequence of [0, 1) values.
function fakeRng(sequence: number[]): () => number {
	let i = 0;
	return () => sequence[i++ % sequence.length];
}

test('pickQuizSet: count >= items.length returns every item, none dropped', () => {
	const items = makeItems(5);
	const result = pickQuizSet(items, 10);
	assert.equal(result.length, 5);
	assert.deepEqual(
		new Set(result.map((r) => r.sourceSlug)),
		new Set(items.map((r) => r.sourceSlug)),
	);
});

test('pickQuizSet: count < items.length returns exactly count items', () => {
	const items = makeItems(26);
	const result = pickQuizSet(items, 12);
	assert.equal(result.length, 12);
});

test('pickQuizSet: returned items are unique, no duplicates from the shuffle', () => {
	const items = makeItems(26);
	const result = pickQuizSet(items, 20);
	const slugs = result.map((r) => r.sourceSlug);
	assert.equal(new Set(slugs).size, slugs.length);
});

test('pickQuizSet: every returned item actually came from the input pool', () => {
	const items = makeItems(26);
	const pool = new Set(items.map((i) => i.sourceSlug));
	const result = pickQuizSet(items, 15);
	for (const r of result) {
		assert.ok(pool.has(r.sourceSlug), `${r.sourceSlug} was not in the original pool`);
	}
});

test('pickQuizSet: does not mutate the input array', () => {
	const items = makeItems(6);
	const before = items.map((i) => i.sourceSlug);
	pickQuizSet(items, 3, fakeRng([0.9, 0.1, 0.5, 0.5, 0.5]));
	assert.deepEqual(
		items.map((i) => i.sourceSlug),
		before,
	);
});

test('pickQuizSet: count of 0 returns an empty array', () => {
	assert.deepEqual(pickQuizSet(makeItems(5), 0), []);
});

test('pickQuizSet: negative count returns an empty array', () => {
	assert.deepEqual(pickQuizSet(makeItems(5), -3), []);
});

test('pickQuizSet: empty input returns an empty array regardless of count', () => {
	assert.deepEqual(pickQuizSet([], 10), []);
});

test('pickQuizSet: with an injected deterministic rng, the shuffle is reproducible', () => {
	// Fisher-Yates over indices [0,1,2,3,4] (i from 4 down to 1):
	// i=4: j=floor(rng()*5); i=3: j=floor(rng()*4); i=2: j=floor(rng()*3); i=1: j=floor(rng()*2)
	// A constant-zero rng always swaps with index 0, which is equivalent to a fixed
	// rotation -- assert the exact resulting order rather than just "some order".
	const items = makeItems(5);
	const rng = fakeRng([0, 0, 0, 0]);
	const result = pickQuizSet(items, 5, rng);
	assert.deepEqual(
		result.map((r) => r.sourceSlug),
		['slug-1', 'slug-2', 'slug-3', 'slug-4', 'slug-0'],
	);
});

test('pickQuizSet: same rng sequence produces the same output on repeated calls', () => {
	const items = makeItems(26);
	const seq = [0.87, 0.12, 0.55, 0.33, 0.91, 0.02, 0.44, 0.68, 0.19, 0.77];
	const a = pickQuizSet(items, 10, fakeRng(seq));
	const b = pickQuizSet(items, 10, fakeRng(seq));
	assert.deepEqual(
		a.map((r) => r.sourceSlug),
		b.map((r) => r.sourceSlug),
	);
});

test('renderInlineMarkdown: converts a [text](url) link into an anchor tag', () => {
	const out = renderInlineMarkdown('See [National Day Calendar](https://example.com/article) for more.');
	assert.equal(
		out,
		'See <a href="https://example.com/article" target="_blank" rel="noopener noreferrer">National Day Calendar</a> for more.',
	);
});

test('renderInlineMarkdown: converts **bold** into <strong>', () => {
	assert.equal(renderInlineMarkdown('This is **important**.'), 'This is <strong>important</strong>.');
});

test('renderInlineMarkdown: plain text with no markdown syntax is returned unchanged', () => {
	const plain = 'No documented reason exists.';
	assert.equal(renderInlineMarkdown(plain), plain);
});

test('renderInlineMarkdown: handles multiple links in the same string', () => {
	const out = renderInlineMarkdown('[A](https://a.example) and [B](https://b.example)');
	assert.equal(
		out,
		'<a href="https://a.example" target="_blank" rel="noopener noreferrer">A</a> and <a href="https://b.example" target="_blank" rel="noopener noreferrer">B</a>',
	);
});

test('renderInlineMarkdown: URL containing parentheses is captured whole', () => {
	const out = renderInlineMarkdown('[Vrishchika](https://en.wikipedia.org/wiki/V%E1%B9%9B%C5%9Bcika_(sign))');
	assert.equal(
		out,
		'<a href="https://en.wikipedia.org/wiki/V%E1%B9%9B%C5%9Bcika_(sign)" target="_blank" rel="noopener noreferrer">Vrishchika</a>',
	);
});

test('dayQuizItems: every item has a non-empty claim, explanation, sourceSlug, and sourceTitle', async () => {
	const { dayQuizItems } = await import('../data/dayQuiz.ts');
	for (const item of dayQuizItems) {
		assert.ok(item.claim.length > 0, `empty claim for ${item.sourceSlug}`);
		assert.ok(item.explanation.length > 0, `empty explanation for ${item.sourceSlug}`);
		assert.ok(item.sourceSlug.length > 0);
		assert.ok(item.sourceTitle.length > 0);
		assert.equal(typeof item.verdict, 'boolean');
	}
});
