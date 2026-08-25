// Pure day-math for the "Days Until [observance]" countdown widget.
// Kept dependency-free from the DOM so it is unit-testable and shared between the
// on-page widget instance and the standalone /embed/ page (see CountdownWidget.astro).

export interface CountdownOccurrence {
	date: string; // ISO 'YYYY-MM-DD'
	weekday: string;
}

export interface CountdownResult {
	occurrence: CountdownOccurrence;
	/** Whole calendar days from `todayISO` to the occurrence. Negative once stale. */
	daysRemaining: number;
}

function toUTCms(dateISO: string): number {
	const [y, m, d] = dateISO.split('-').map(Number);
	return Date.UTC(y, m - 1, d);
}

/**
 * Finds the nearest occurrence on or after `todayISO` and how many days away it is.
 *
 * Falls back to the last known occurrence (yielding a negative `daysRemaining`) when the
 * whole list is in the past, rather than returning null -- an embed left on a third-party
 * page for years should degrade to "this needs an update" copy, not disappear silently.
 * Returns null only for an empty list.
 */
export function nextCountdown(occurrences: CountdownOccurrence[], todayISO: string): CountdownResult | null {
	if (occurrences.length === 0) return null;
	const next = occurrences.find((o) => o.date >= todayISO) ?? occurrences[occurrences.length - 1];
	const daysRemaining = Math.round((toUTCms(next.date) - toUTCms(todayISO)) / 86_400_000);
	return { occurrence: next, daysRemaining };
}

/** Renders the big number line: "Today", "1 day", "42 days", or a stale-data notice. */
export function formatCountdownLabel(daysRemaining: number): string {
	if (daysRemaining < 0) return 'Date data needs an update';
	if (daysRemaining === 0) return 'Today';
	if (daysRemaining === 1) return '1 day';
	return `${daysRemaining} days`;
}

/** Today as a local-calendar ISO date, matching the `YYYY-MM-DD` occurrences use. */
export function todayISO(now: Date = new Date()): string {
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, '0');
	const d = String(now.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}
