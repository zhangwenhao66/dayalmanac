export interface DatedObservance {
  slug: string;
  title: string;
  category: string;
  dateRule?: { occurrences: { date: string; weekday: string }[] };
}
export interface NearbyObservance { slug: string; title: string; date: string; weekday: string }

/** Strict ISO calendar-date validation; Date normalization must not accept February 30. */
export function validCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Return up to three records on each side, plus all records on the selected date. */
export function nearestObservances(value: string, guides: readonly DatedObservance[]) {
  if (!validCalendarDate(value)) throw new RangeError('Choose a valid calendar date.');
  const entries: NearbyObservance[] = [];
  const seen = new Set<string>();
  for (const guide of guides) {
    if (!['Observances', 'Public Holidays'].includes(guide.category)) continue;
    for (const occurrence of guide.dateRule?.occurrences ?? []) {
      if (!validCalendarDate(occurrence.date)) continue;
      const key = `${guide.slug}:${occurrence.date}`;
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({ slug: guide.slug, title: guide.title, ...occurrence });
    }
  }
  entries.sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
  return {
    before: entries.filter((entry) => entry.date < value).slice(-3),
    on: entries.filter((entry) => entry.date === value),
    after: entries.filter((entry) => entry.date > value).slice(0, 3),
    firstDate: entries[0]?.date ?? null,
    lastDate: entries.at(-1)?.date ?? null,
  };
}
