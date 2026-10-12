/**
 * Short label for the countdown widget.
 *
 * The widget renders "Days until {label}", and the full page title reads badly
 * after that phrase: "Days until Is Kwanzaa a Religion? Dates and Who Started
 * It". Every title on this site is either a question or a "Name: detail"
 * headline, so trimming at the question mark or the first colon gives a clean
 * label without hand-maintaining a second title field.
 */
export function countdownLabel(title: string): string {
	const question = title.indexOf('?');
	const colon = title.indexOf(':');
	if (question !== -1 && (colon === -1 || question < colon)) {
		return title.slice(0, question + 1).trim();
	}
	if (colon !== -1) {
		return title.slice(0, colon).trim();
	}
	return title.trim();
}
