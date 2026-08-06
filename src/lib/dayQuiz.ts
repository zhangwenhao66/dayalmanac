import type { DayQuizItem } from '../data/dayQuiz';

/**
 * Picks a random, non-repeating subset of quiz items so a visitor doesn't see the same
 * ~26-item deck in the same order every time they load /true-or-false/.
 *
 * Fisher-Yates shuffle-then-slice, not items.sort(() => Math.random() - 0.5) -- the
 * sort-based shuffle is a well-known non-uniform trick (V8's sort isn't a fair coin flip
 * per comparison), Fisher-Yates has no such bias.
 *
 * `rng` defaults to Math.random but is injectable so tests can assert exact, reproducible
 * output instead of only "the result looks statistically plausible".
 */
export function pickQuizSet(
	items: readonly DayQuizItem[],
	count: number,
	rng: () => number = Math.random,
): DayQuizItem[] {
	if (items.length === 0 || count <= 0) return [];

	const pool = items.slice();
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}

	return pool.slice(0, Math.min(count, pool.length));
}

/**
 * Renders the small subset of markdown FAQ answers actually use (**bold** and
 * [text](url) links) as HTML, so explanation text pulled verbatim from guides.ts keeps
 * its citation links clickable instead of showing literal bracket/paren syntax.
 *
 * Same two regexes as the `md()`-style helpers already used elsewhere in this repo --
 * kept here as an exported pure function (rather than copy-pasted inline in the
 * component) specifically so it's unit-testable.
 */
export function renderInlineMarkdown(text: string): string {
	return text
		.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
		.replace(/\[([^\]]+)\]\(((?:[^()]|\([^()]*\))*)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}
