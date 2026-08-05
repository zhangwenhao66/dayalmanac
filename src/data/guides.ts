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
	/**
	 * How well-established the rule is. Mirrors `Founding.status`, and for the same reason:
	 * plenty of observances are kept on a date that no authority ever set.
	 *
	 * 'documented'   — an authority states the recurring rule, and `source` points at it.
	 * 'conventional' — the date is consistently observed but nothing establishes it as a
	 *                  recurring rule. `source` then points at the best evidence of the
	 *                  convention, and the page must say so rather than dressing a
	 *                  single-year mention up as a founding document.
	 *
	 * Defaults to 'documented' when omitted, so existing entries keep their meaning.
	 */
	status?: 'documented' | 'conventional';
	/** Where the rule (or, when status is 'conventional', the convention) is evidenced. */
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

export const guides: Guide[] = [
  {
    "slug": "national-boyfriend-day",
    "category": "Observances",
    "title": "National Boyfriend Day: October 3, and Its Unverified Origin",
    "description": "National Boyfriend Day falls on October 3 every year. The date is consistent across sources, but no founder, registration, or proclamation can be verified.",
    "published": "2026-08-02",
    "updated": "2026-08-04",
    "coreSummary": "National Boyfriend Day is an unofficial observance held on October 3 every year, most visible as a social media hashtag. No founder, registering organization, or government proclamation has ever been documented for it.",
    "dateRule": {
      "kind": "fixed",
      "text": "October 3 every year. The date does not shift for weekends or weekdays.",
      "source": {
        "label": "National Day Calendar — National Boyfriend Day, October 3",
        "url": "https://www.nationaldaycalendar.com/national-day/national-boyfriend-day-october-3"
      },
      "occurrences": [
        {
          "date": "2026-10-03",
          "weekday": "Saturday"
        },
        {
          "date": "2027-10-03",
          "weekday": "Sunday"
        },
        {
          "date": "2028-10-03",
          "weekday": "Tuesday"
        },
        {
          "date": "2029-10-03",
          "weekday": "Wednesday"
        },
        {
          "date": "2030-10-03",
          "weekday": "Thursday"
        },
        {
          "date": "2031-10-03",
          "weekday": "Friday"
        }
      ],
      "caveat": "The spelling variants National Boyfriend Day, National Boyfriend's Day and National Boyfriends Day all refer to the same October 3 observance. Holiday Insights reports finding a small number of references that place it on October 4 instead; no other source does."
    },
    "founding": {
      "status": "unverified",
      "text": "Nobody can show who started National Boyfriend Day. No founder has been named. No company or organization registered it, and it appears in neither the congressional record nor any presidential proclamation. National Day Calendar, the closest thing the United States has to a registrar for observances like this, does not credit anyone and says the origin \"remains a bit of a mystery.\" Two incompatible origin stories circulate. Dictionary.com dates it to October 3, 2012 and attributes it to a group of Twitter users, naming no individual. National Today says the earliest reference it could find was to \"Boyfriend Day,\" probably dated October 4, 2014, and states outright that no single source is credited with starting it. Those two accounts are two years apart and have never been reconciled. Wikipedia carries the 2014 version, hedged as \"thought to have originated,\" citing lifestyle articles rather than anything contemporaneous. Until a dated original post, a registration, or a proclamation surfaces, the honest answer is that the origin is untraceable.",
      "source": {
        "label": "National Day Calendar — National Boyfriend Day (history section)",
        "url": "https://www.nationaldaycalendar.com/national-day/national-boyfriend-day-october-3"
      }
    },
    "sections": [
      {
        "heading": "What National Boyfriend Day is",
        "body": [
          "National Boyfriend Day is an unofficial observance on October 3 set aside for acknowledging a romantic partner. Nothing organizes it and nothing is scheduled; the customs, such as they are, formed by imitation. In practice it works as a prompt for a social media post and as a slot on brand marketing calendars.",
          "The word \"National\" in the name is honorific and carries no legal weight. Holiday Insights, which tracks this category of observance, reports finding no congressional record and no presidential proclamation behind it. That places National Boyfriend Day alongside the several thousand other \"national days\" circulating online: named by someone at some point, kept alive by repetition, recognized by no official body.",
          "It is often described as the counterpart to National Girlfriend Day on August 1, but that pairing is contested. National Today and National Day Calendar both define the August date as a celebration of female friendship rather than of romantic partners, and Bustle states directly that there is no equivalent day for women in relationships. Only Holiday Insights treats the two as a romantic pair."
        ]
      },
      {
        "heading": "The date: October 3, every year",
        "body": [
          "October 3 is fixed. It does not move to the nearest weekend and does not shift by weekday. National Day Calendar, National Today, Sprout Social and Wikipedia all give October 3. Holiday Insights gives October 3 as well but notes that it found a small number of references putting the day on October 4, which is the only dissent anyone has recorded. For an observance with this little documentation behind it, the date itself is unusually stable.",
          "The name appears in three spellings: National Boyfriend Day, National Boyfriend’s Day, and National Boyfriends Day. Holiday Insights uses the plural form, most other sources use the singular. They all describe the same October 3 observance. No source was found that assigns a different date to any spelling variant.",
          "October 3 is a crowded date. It is also Mean Girls Day, another unofficial internet observance, which comes from a line in the 2004 film in which Cady Heron is asked what day it is and answers that it is October 3. Mean Girls Day has been marked online since around 2011, which makes it older than either proposed origin date for National Boyfriend Day. October 3 is additionally German Unity Day, an actual public holiday in Germany marking the 1990 reunification.",
          "Dictionary.com argues that the Mean Girls overlap is why boyfriend appreciation posts landed on October 3 rather than some other day: the date was already a fixture in the same corner of social media. That is a plausible reading of the timing, but it is an interpretation offered after the fact, not a documented decision by anyone."
        ]
      },
      {
        "heading": "Nobody can show who started it",
        "body": [
          "This is the part most calendar sites smooth over, so it is worth being specific about what does and does not exist.",
          "National Day Calendar does not credit a founder. Its entry says the exact origin \"remains a bit of a mystery\" and that the site is \"still digging for the full story.\" That matters because when a day has been registered with them by a company, a trade group, or an individual, National Day Calendar normally names that party in the history section. Here there is nobody to name.",
          "Two origin claims circulate, and they do not agree. Dictionary.com’s pop culture entry says the day began on October 3, 2012, started by a group of Twitter users writing appreciation posts about their boyfriends, and embeds a tweet from that date as an illustration. It identifies no originator. National Today gives a different account: the earliest reference it found was to \"Boyfriend Day,\" probably dated October 4, 2014, and the page states plainly that no sole source is credited with initiating it. The word \"probably\" is National Today’s own.",
          "The 2014 version is the one that spread. Wikipedia repeats it as something the day is thought to have originated from, and its citations are mostly lifestyle roundups published years later rather than contemporaneous coverage. Repetition across dozens of calendar pages has hardened a hedged guess into a stated fact. Sprout Social, writing about the same observance, says flatly that it is unclear why the internet chose October at all.",
          "One frequently repeated statistic deserves a flag. Many pages, Wikipedia included, state that the day gained traction in March 2016 with more than 46,000 tweets. The same figure appears on National Today with no underlying data and no statement of what was counted or how; Wikipedia sources it to a 2023 news article rather than to any original measurement. March is also seven months away from the date the day is observed, which makes the number hard to interpret even if it is accurate. It gets copied anyway.",
          "What would actually settle the question is a dated original post, a registration with a calendar registrar, or a proclamation. None of those has surfaced. An observance emerging from a hashtag without a founder is ordinary and not suspicious in itself. The difference here is that the sources presenting a confident origin date are presenting someone else’s guess."
        ]
      },
      {
        "heading": "This mix-up isn't unique to Boyfriend Day",
        "body": [
          "Marketers who build content calendars around \"National\" days run into this same problem regularly, and not always with a day this obscure. Deb Szabo, a marketing strategist, described planning a campaign around Cabernet Day and stopping to check the date first because two different observances were being listed online under similar names. The research showed they weren't the same thing at all: National Cabernet Sauvignon Day fell on August 27, while International Cabernet Sauvignon Day was September 3 in 2026, and several calendar sites had blurred the two names and dates together.",
          "<div style=\"margin:12px 0;padding:18px 20px;background:#f8fafc;border-left:4px solid #4a5568;border-radius:8px;\"><p style=\"margin:0;font-size:1.05rem;font-style:italic;color:#1e293b;line-height:1.6;\">&ldquo;That is why I now verify the source before building a campaign around a &lsquo;National Day&rsquo;. A date can be a useful content prompt, but the campaign still needs a genuine business message behind it.&rdquo;</p><p style=\"margin:8px 0 0;font-size:0.8125rem;color:#64748b;\">Deb Szabo, marketing strategist, on the Cabernet Day mix-up</p></div>",
          "The pattern is the same one this page documents for National Boyfriend Day: a name that sounds official, a date that gets repeated without anyone checking the source, and multiple similarly-named observances that get flattened into one by sites copying each other. It's a reason to verify a specific date and origin before publishing, not just for boyfriend-related content but for any \"National [Something] Day\" a content calendar is built around."
        ]
      },
      {
        "heading": "How people mark it",
        "body": [
          "Almost entirely by posting. The standard form is a photo of a partner with a short caption and the hashtag #NationalBoyfriendDay. There is no gift convention, no card industry, and no expected spend attached to the day, which separates it from Valentine’s Day and its commercial infrastructure.",
          "A counter-tradition runs alongside the sincere posts and has proven durable. Covering the day on October 3, 2017, Bustle documented people responding by naming fictional characters, celebrities, pets and food as their boyfriends instead of real partners. That joke now accounts for a substantial share of what actually circulates on October 3, and it has been a recurring feature of the day for years rather than a one-off.",
          "Brands treat the date as a scheduled opportunity. Sprout Social lists National Boyfriend Day in its social media holiday calendar and suggests that businesses post customer photos, run discounts, and build hashtag campaigns around it. This is worth knowing if you are wondering why the day appears in your feed from accounts that have no obvious connection to it."
        ]
      },
      {
        "heading": "Official status",
        "body": [
          "National Boyfriend Day is not a public holiday in the United States or anywhere else. It closes nothing and confers no time off, and it has no standing in law. Federal holidays in the US are created by statute, and this is not one of them.",
          "Many awareness observances that lack federal holiday status still have a presidential proclamation or a state resolution behind them, which gives them a traceable paper trail. National Boyfriend Day has neither. Holiday Insights specifically notes finding no documentation confirming it as a \"national\" day at all."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is National Boyfriend Day?",
        "answer": "National Boyfriend Day is October 3 every year. The date is fixed and does not move to a weekend or shift by weekday."
      },
      {
        "question": "Who created National Boyfriend Day?",
        "answer": "No one knows, and no source can document it. Nobody is named as its founder, no organization registered it, and no proclamation exists. National Day Calendar says the origin remains a mystery and that it is still researching. Dictionary.com attributes the day to unnamed Twitter users in October 2012, while National Today says the earliest reference it found was probably dated October 4, 2014. Those accounts are two years apart and neither identifies a person."
      },
      {
        "question": "Is National Boyfriend Day an official holiday?",
        "answer": "No. It is not a federal or public holiday in the United States or elsewhere. Nothing closes, no one receives time off, and there is no congressional record or presidential proclamation establishing it. The word \"National\" in the name is honorific and was not conferred by any government body."
      },
      {
        "question": "Is National Boyfriend’s Day the same as National Boyfriend Day?",
        "answer": "Yes. National Boyfriend Day, National Boyfriend’s Day and National Boyfriends Day all refer to the same October 3 observance. Different calendar sites use different spellings, but no source places any variant on a different date."
      },
      {
        "question": "Why is National Boyfriend Day on October 3?",
        "answer": "No documented reason exists. Dictionary.com suggests October 3 was adopted because it was already Mean Girls Day, an internet observance marked since around 2011 that comes from a line in the 2004 film. That is an after-the-fact interpretation rather than a recorded decision. Sprout Social says it is simply unclear why October was chosen."
      },
      {
        "question": "Is there a National Girlfriend Day?",
        "answer": "Yes, National Girlfriend Day is observed on August 1. It is often cited as the reason the boyfriend version exists, but the two registries that define it, National Today and National Day Calendar, both describe August 1 as a day for female friendship rather than for romantic partners. Its own origin is disputed rather than settled, with different sources crediting different people or groups depending on which account you read."
      }
    ],
    "sources": [
      {
        "label": "National Day Calendar — National Boyfriend Day, October 3",
        "url": "https://www.nationaldaycalendar.com/national-day/national-boyfriend-day-october-3"
      },
      {
        "label": "National Today — National Boyfriend Day",
        "url": "https://nationaltoday.com/national-boyfriend-day/"
      },
      {
        "label": "Dictionary.com Pop Culture Dictionary — National Boyfriend Day",
        "url": "https://www.dictionary.com/culture/pop-culture/national-boyfriend-day"
      },
      {
        "label": "Holiday Insights — National Boyfriends Day, October 3",
        "url": "https://www.holidayinsights.com/moreholidays/october/national-boyfriends-day.htm"
      },
      {
        "label": "Wikipedia — National Boyfriend Day",
        "url": "https://en.wikipedia.org/wiki/National_Boyfriend_Day"
      },
      {
        "label": "Bustle (October 3, 2017) — people celebrating imaginary significant others",
        "url": "https://www.bustle.com/p/its-national-boyfriend-day-people-on-twitter-are-celebrating-by-honoring-their-imaginary-significant-others-2776400"
      },
      {
        "label": "Sprout Social — National Boyfriend Day social media holiday listing",
        "url": "https://sproutsocial.com/social-media-holidays/national-boyfriend-day/"
      }
    ],
    "image": "/images/national-boyfriend-day-hug.jpg",
    "imageAlt": "A couple hugging outdoors in winter clothing",
    "imageCredit": "Photo by [freestocks](https://unsplash.com/@freestocks) via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Hugging_in_the_winter_(Unsplash).jpg), CC0"
  },
  {
    "slug": "national-daughters-day",
    "category": "Observances",
    "title": "National Daughters Day: Date, Origin, and Why Sources Disagree",
    "description": "National Daughters Day falls on September 25 in the US, but other calendars use the fourth Sunday in September. Here is which is which, and who says what.",
    "published": "2026-08-02",
    "updated": "2026-08-04",
    "coreSummary": "In the United States, National Daughters Day is observed on September 25 each year. A separate observance, International Daughters Day, falls on the fourth Sunday in September and is the date used in India. The two are separate observances and are frequently conflated. Neither is an official US holiday, and no verifiable founder has ever been identified for the September 25 date.",
    "dateRule": {
      "kind": "fixed",
      "text": "September 25 every year",
      "source": {
        "label": "National Day Calendar — National Daughter's Day, September 25",
        "url": "https://nationaldaycalendar.com/celebrations/national-daughters-day-september-25"
      },
      "occurrences": [
        {
          "date": "2026-09-25",
          "weekday": "Friday"
        },
        {
          "date": "2027-09-25",
          "weekday": "Saturday"
        },
        {
          "date": "2028-09-25",
          "weekday": "Monday"
        },
        {
          "date": "2029-09-25",
          "weekday": "Tuesday"
        },
        {
          "date": "2030-09-25",
          "weekday": "Wednesday"
        },
        {
          "date": "2031-09-25",
          "weekday": "Thursday"
        }
      ],
      "caveat": "September 25 is the dominant US date, used by National Day Calendar, National Today, and Days of the Year. It is not universal. National Day Calendar separately lists International Daughters Day on the fourth Sunday in September, which is the date observed in India, where the modern observance originated. That rule produced September 22 in 2024, September 28 in 2025, and September 27 in 2026. The same National Day Calendar entry also notes that in some places the day is marked on October 1, without naming which places. A fourth date exists only on paper: a 1950 bill in Congress proposed the second Sunday in April, and it never passed."
    },
    "founding": {
      "status": "unverified",
      "text": "No one has produced a founder, a registration, or a proclamation for the September 25 observance. National Day Calendar, the largest US registrar of these days, says on its own entry that it \"continues researching the origins of this family holiday.\" Snopes, which searched newspaper archives in 2021, concluded that the exact origins of a late-September National Daughters Day are unclear. The claim repeated across most listicle sites, that the Indian greeting card company Archies Limited created the day in 2007, is a real claim with a real interview behind it, but it describes the Indian observance on the fourth Sunday in September rather than the American September 25 date, and in that 2007 interview the company's managing director took only partial credit for the idea. The oldest American records point somewhere else again: a 1932 newspaper mention of a Daughters of Union Veterans event, and a 1950 congressional bill for a date in April.",
      "source": {
        "label": "Snopes — fact check on the origins of National Daughters Day (2021)",
        "url": "https://www.snopes.com/fact-check/national-daughters-day-privacy/"
      }
    },
    "sections": [
      {
        "heading": "What National Daughters Day is",
        "body": [
          "National Daughters Day is an informal observance in which parents, grandparents, and other relatives mark the daughters in their lives, most visibly by posting about them on social media. In the United States it is kept on September 25.",
          "It carries no official status. There is no presidential proclamation and no act of Congress behind it, which puts it in a different category from Mother's Day, designated by Congress in 1914. Snopes, reviewing the day in 2021, described it plainly as not an officially designated special day in the United States. That is not a knock on it. Most of the days on any given calendar are unofficial, kept because enough people decided to keep them. But it does mean there is no authority to appeal to when sources disagree about the date, which is exactly what has happened here.",
          "No single body organizes the day, and nothing has been registered or incorporated around it. What it has is a hashtag and a widely shared date."
        ]
      },
      {
        "heading": "Which date to use, and who uses which",
        "body": [
          "Three different dates circulate, and they are not simply competing answers to the same question. Two of them belong to observances that are genuinely distinct.",
          "September 25 is the American answer. National Day Calendar lists National Daughter's Day on September 25, and the large calendar aggregators that most search results surface, including National Today and Days of the Year, agree. Snopes found that US social media activity around the day settled on the last week of September, typically September 25 or 26, starting around 2015.",
          "The fourth Sunday in September is a different observance with a different name. National Day Calendar maintains a separate entry for International Daughters Day on that rule, and describes it as originating in India. This is the working date across India: in 2024, when September contained five Sundays and the fourth and last Sundays fell apart from each other, Indian coverage marked the day on Sunday, September 22, the fourth Sunday, not September 29. That settles a small ambiguity in the wording. Snopes, cited elsewhere on this page, is among the sources that call it the final Sunday; National Day Calendar's own published table for the international entry runs 22 September 2024, 28 September 2025 and 27 September 2026, which is the fourth Sunday in each case, not the last. The rule is the fourth.",
          "October 1 appears once, in National Day Calendar's own note that the day is observed on that date in some places. The entry does not say where, and no other source consulted here supports it. Treat it as a loose end rather than a real fourth option.",
          "The practical guidance: if you are in the US and want the date most people around you are using, September 25 is it. If you are marking the day with family in India, or you are working from an international calendar, the fourth Sunday in September is the one that will line up with everyone else. In many years the two land within days of each other, which is part of why they blur together."
        ]
      },
      {
        "heading": "Where the origin story comes from, and what it actually supports",
        "body": [
          "Nearly every page about this day tells the same origin story: the Indian greeting card company Archies Limited created Daughters Day in 2007 to counter the stigma attached to having a daughter rather than a son. Unusually for a widely copied claim, there is something real underneath it. In a 2007 interview quoted by Snopes, Archies managing director Anil Moolchandani discussed the company's push behind the occasion, framing it as an effort to counter gender discrimination and to make the case that a daughter is no lesser than a son. He described the idea growing out of a conversation with census officials about the situation of the girl child, followed by the company canvassing parents and members of the public.",
          "Two things get lost when that story is compressed into a one-line origin. The first is that Moolchandani claimed partial responsibility, not authorship. The second, and more consequential, is that the observance he was describing is the Indian one on the fourth Sunday in September. Using it to explain the American September 25 date quietly merges two observances that the same sources otherwise keep apart. A greeting card company promoting a card-buying occasion also has an obvious commercial interest in being remembered as its originator, which is worth holding in mind without treating it as disqualifying.",
          "The older American thread runs somewhere else entirely. Snopes found the earliest reference to a National Daughters Day in a December 1932 news article about a celebration run by a Vermont chapter of the Daughters of Union Veterans, with scattered mentions following in 1939, 1940, and 1949. Then, in the spring of 1950, the idea reached Congress. The Congressional Record for March 31, 1950 shows Representative Tom Steed of Oklahoma introducing, by request, \"H. R. 7938. A bill designating the second Sunday in April as National Daughter's Day,\" referred to the Committee on the Judiciary. It died there. The phrase \"by request\" is a standing congressional convention indicating that a member is introducing a measure on someone else's behalf rather than championing it, so even this record does not name the person behind the idea.",
          "After the 1950s the day drops out of American archives almost entirely, and does not reappear until scattered social media mentions in the 2010s. Snopes traced its modern spread to posts by prominent celebrities from 2015 onward rather than to any organization or campaign. So the honest position is that the September 25 observance has no traceable founder. What can be documented is a failed 1950 bill for a different date, and an Indian observance on a different date whose promoter took partial credit."
        ]
      },
      {
        "heading": "How the day is actually marked",
        "body": [
          "In the US the day lives almost entirely on social media. The typical observance is a parent posting photographs of a daughter with the hashtag #NationalDaughtersDay. There is no ceremony attached, no traditional gift, and no widely followed convention about who the day is for. Adult daughters, young children, stepdaughters, and daughters-in-law all get included depending on the family.",
          "In India the day retains more of its original framing. National Day Calendar describes the observance there as directed at the status of the girl child and at the stigma some families still attach to daughters. Gifts and cards are common, unsurprisingly given the day's commercial promotion, but so is public messaging about girls' education and equal treatment.",
          "One practical note about the social media custom. In 2021, a widely forwarded warning claimed the day was manufactured by foreign actors to harvest family photographs for facial recognition. Snopes rated that claim False, finding no evidence for it and pointing out that the reasoning does not hold up, since photographs of children are already posted online in enormous volume without any need to engineer a trend. Ordinary privacy judgment about posting pictures of children applies here as it does any other day, but there is no specific plot to worry about."
        ]
      },
      {
        "heading": "Days it gets confused with",
        "body": [
          "International Daughters Day, the fourth Sunday in September, is the closest neighbor and the source of most of the date confusion. It is a separate listing with a separate history, not an alternative name for the September 25 day.",
          "National Son's and Daughter's Day falls on August 11 and covers children of both sexes. Its own origins are similarly murky. National Day Calendar traces an August 11 observance back to a 1988 Canadian newspaper mention and describes earlier, unrelated efforts, including a 1936 push by J. Henry Dusenberry in Missouri and a 1970s congressional request that proposed the last Sunday in January. Like National Daughters Day, it never became official.",
          "The International Day of the Girl Child, October 11, is the one observance in this cluster with unambiguous provenance. The United Nations General Assembly adopted resolution 66/170 on December 19, 2011 to establish it. If you want a date in this territory that is documented rather than inferred, that is the one.",
          "Take Our Daughters to Work Day, which began in 1992 and later expanded to include sons, is sometimes cited as a precursor. Snopes notes it as a separate development that ran during the decades when National Daughters Day itself had vanished from American records."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is National Daughters Day?",
        "answer": "In the United States, National Daughters Day is observed on September 25 every year. The date does not move, so it falls on a different weekday each year. Some international calendars instead use the fourth Sunday in September for a related observance called International Daughters Day."
      },
      {
        "question": "Is National Daughters Day the same as International Daughters Day?",
        "answer": "No. They are listed as separate observances with separate dates. National Daughters Day is fixed on September 25 and is the version used in the US. International Daughters Day falls on the fourth Sunday in September and originated in India. They often land within a few days of each other, which is why they are frequently treated as one day."
      },
      {
        "question": "Who created National Daughters Day?",
        "answer": "No one has been able to document it. National Day Calendar states on its own entry that it is still researching the origins, and Snopes concluded in 2021 that the origins of the late-September observance are unclear. The commonly repeated claim that the Indian greeting card company Archies Limited created it in 2007 refers to the Indian observance on the fourth Sunday in September, and in the 2007 interview behind that claim the company took only partial credit for the idea."
      },
      {
        "question": "Is National Daughters Day an official US holiday?",
        "answer": "No. It has no presidential proclamation and no act of Congress behind it, and it is not a federal holiday. Nothing closes and no one gets the day off. The closest it ever came to official status was in March 1950, when Representative Tom Steed of Oklahoma introduced H.R. 7938 to designate the second Sunday in April as National Daughter's Day. The bill was referred to the House Judiciary Committee and never passed."
      },
      {
        "question": "Why do some websites say the fourth Sunday in September?",
        "answer": "Because they are describing the Indian and international observance rather than the American one. In India, Daughters Day falls on the fourth Sunday in September, which produced September 22 in 2024, September 28 in 2025, and September 27 in 2026. A few sources, Snopes among them, loosely describe it as the last Sunday. 2024 settles it: September had five Sundays and the day was kept on the 22nd, the fourth, not the 29th."
      },
      {
        "question": "How is National Daughters Day different from National Son's and Daughter's Day?",
        "answer": "They are different dates covering different groups. National Son's and Daughter's Day is on August 11 and includes children of both sexes. National Daughters Day is on September 25 in the US and is specific to daughters. Neither has official status, and the origins of both are poorly documented."
      }
    ],
    "sources": [
      {
        "label": "National Day Calendar — National Daughter's Day, September 25",
        "url": "https://nationaldaycalendar.com/celebrations/national-daughters-day-september-25"
      },
      {
        "label": "National Day Calendar — International Daughters Day, fourth Sunday in September",
        "url": "https://nationaldaycalendar.com/celebrations/international-daughters-day-fourth-sunday-in-september"
      },
      {
        "label": "Snopes — Is \"National Daughters Day\" Just a Sinister Plot To Extract Private Data? (Dan MacGuill, October 1, 2021)",
        "url": "https://www.snopes.com/fact-check/national-daughters-day-privacy/"
      },
      {
        "label": "Congressional Record, March 31, 1950, p. 4444 — H.R. 7938 introduced by Rep. Steed (by request)",
        "url": "https://www.govinfo.gov/content/pkg/GPO-CRECB-1950-pt4/pdf/GPO-CRECB-1950-pt4-3-1.pdf"
      },
      {
        "label": "Business Today — Daughters Day coverage dated September 22, 2024 (India, fourth Sunday)",
        "url": "https://www.businesstoday.in/india/story/happy-daughters-day-2024-60-heartfelt-wishes-messages-and-whatsapp-texts-for-parents-to-share-with-their-daughters-446931-2024-09-22"
      },
      {
        "label": "National Day Calendar — National Son's and Daughter's Day, August 11",
        "url": "https://nationaldaycalendar.com/celebrations/national-sons-and-daughters-day-august-11"
      },
      {
        "label": "United Nations — International Day of the Girl Child, October 11 (resolution 66/170, adopted December 19, 2011)",
        "url": "https://www.un.org/en/observances/girl-child-day"
      },
      {
        "label": "National Today — National Daughters Day (September 25; describes origins as obscure)",
        "url": "https://nationaltoday.com/national-daughters-day/"
      }
    ],
    "image": "/images/national-daughters-day.jpg",
    "imageAlt": "A father laughing with his young daughter, her head resting on his shoulder, in a sunlit field",
    "imageCredit": "Photo by [Caroline Hernandez](https://unsplash.com/@carolinehdz) via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Father_and_Daughter_(Unsplash).jpg), CC0"
  },
  {
    "slug": "national-sons-day",
    "category": "Observances",
    "title": "National Sons Day: March 4, and Why September 28 Keeps Showing Up",
    "description": "National Sons Day is listed on March 4 by the registries that track it. September 28 circulates widely online but has no traceable origin. Here is the evidence.",
    "published": "2026-08-02",
    "updated": "2026-08-06",
    "image": "/images/national-sons-day.jpg",
    "imageAlt": "A father and son together outdoors",
    "imageCredit": "Photo by [Clem Onojeghuo](https://unsplash.com/@clemono2) via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:A_father_and_son_on_a_ride_(Unsplash).jpg), CC0",
    "coreSummary": "National Sons Day is observed on March 4, the date created by Jill Nico in 2018 and listed by National Day Calendar and Checkiday. A second date, September 28, is repeated by many calendar sites and by most social media posts about the day, but no source has produced a founder, a registration, or a first observance for it.",
    "dateRule": {
      "kind": "fixed",
      "text": "March 4 every year. The date is fixed and does not move for weekends.",
      "source": {
        "label": "National Day Calendar - National Sons Day (March 4)",
        "url": "https://www.nationaldaycalendar.com/national-day/national-sons-day-march-4"
      },
      "occurrences": [
        {
          "date": "2026-03-04",
          "weekday": "Wednesday"
        },
        {
          "date": "2027-03-04",
          "weekday": "Thursday"
        },
        {
          "date": "2028-03-04",
          "weekday": "Saturday"
        },
        {
          "date": "2029-03-04",
          "weekday": "Sunday"
        },
        {
          "date": "2030-03-04",
          "weekday": "Monday"
        },
        {
          "date": "2031-03-04",
          "weekday": "Tuesday"
        }
      ],
      "caveat": "September 28 is widely published as National Sons Day and is the date most social media activity follows. It is carried by aggregator calendars such as WinCalendar, and by Calendarr, which lists both dates. No registry that documents provenance supports it: National Day Calendar lists the observance only on March 4, and Checkiday states outright that the September 28 date is incorrect and does not include it in its September 28 listing. Treat March 4 as the documented date and September 28 as a widely repeated date with no established origin."
    },
    "founding": {
      "status": "documented",
      "text": "The March 4 observance has a named founder. Jill Nico created National Sons Day in 2018, and National Day Calendar credits her by name in its history section for the day. Checkiday also credits her and dates annual observance from 2019. The September 28 date has no comparable provenance: nobody has produced a founder, an organizing body, a registration, or a documented first observance for it, and the researcher who looked hardest at it concluded there is nothing there to find.",
      "source": {
        "label": "National Day Calendar - National Sons Day history",
        "url": "https://www.nationaldaycalendar.com/national-day/national-sons-day-march-4"
      }
    },
    "sections": [
      {
        "heading": "The two dates, and who keeps each",
        "body": [
          "Search for National Sons Day and you will get two answers. March 4 is the date held by the sources that document where observances come from. National Day Calendar lists it on March 4 and names its founder. Checkiday lists it on March 4. Days of the Year lists it on March 4. All three trace the day to the same person and the same year.",
          "September 28 is held by a different kind of source. Aggregator calendars such as WinCalendar place it at the end of September. Calendarr lists both dates and describes the situation as unsettled. Most of the volume, though, is not calendar sites at all: it is social posts, seasonal roundups, and quote lists that appear every year in late September, plus press coverage that follows the posts rather than leading them. WinCalendar's own entry says only that the day is typically celebrated around the end of September. It gives no founder and no year.",
          "Neither date is a federal holiday. Coverage that has looked into it, including a USA Today piece syndicated widely, describes National Sons Day as a quasi-holiday: real in the sense that people observe it, unofficial in the sense that no government body established it."
        ]
      },
      {
        "heading": "Where March 4 comes from",
        "body": [
          "Jill Nico created National Sons Day in 2018. Her stated reason was straightforward: a day for daughters already existed and there was no equivalent for sons. National Day Calendar's National Daughter's Day sits on September 25, and Nico positioned her day as its counterpart.",
          "The explanations for why she picked March 4 specifically do not fully agree across sources, which is worth being honest about. National Day Calendar says there is no single reason, and reports the founder's account that spring seemed right, that the date carries momentum when it is spoken aloud, and that many sons play spring sports. Days of the Year gives a different pair of reasons: that March sits opposite National Daughter's Day on the calendar, and that the number four is personally significant to the founder. A third explanation circulating on smaller sites reads the date as the pun march forth. Only the first two trace back to the founder in any direct way, and they were written up by different editors, so the date-choice story should be treated as loose rather than settled.",
          "What is not loose is the attribution itself. A named person created the day in a known year, submitted it, and maintains a public page for it. That is more documentation than most informal observances of this size can offer."
        ]
      },
      {
        "heading": "Where September 28 comes from, as far as anyone can show",
        "body": [
          "The most thorough attempt to trace the September date was published in September 2022 by Seth Westphal, who runs Checkiday, and it worked from newspaper archives rather than from other calendar sites. His conclusion was that the date has no source.",
          "What he did find explains the name, not the date. In 1996, students at Columbia Middle School in Berkeley Heights, New Jersey formed an organization called National Sons Day. It was an organization, not a holiday. Its purpose was to create a counterpart to Take Our Daughters to Work Day, and it ran Take Our Sons to Work Day on the first Thursday in May from 1996 through at least 2001, the last year the group's website was updated. Calendar sites date the launch to 1998 instead; the 1996 start is from the one researcher who worked through newspaper archives rather than from other calendar sites, so it is the version followed here. In 2003 the daughters and sons programs merged into the combined workplace day that still runs today.",
          "So an entity named National Sons Day genuinely existed in the 1990s, which is enough for a phrase to enter circulation and later be mistaken for a holiday with a date. But its events were in May. A separate sons' day floated in 1996 was penciled in for October 20 and then abandoned when its organizers could not agree on a name and theme. Neither is September 28."
        ]
      },
      {
        "heading": "One observance or two?",
        "body": [
          "Some sites present the two dates as two separate observances with different lineages: September 28 as the older date inherited from the 1990s workplace effort, and March 4 as a modern revival by Nico. The reading is tidy, and it is the one most likely to be repeated back at you.",
          "The problem is that the 1990s effort never observed September 28. Its events were in May. Handing September the older lineage gives it a provenance the archives do not support. The better-supported reading is that there is one documented observance, March 4, plus a second date that spread on its own and now has real usage behind it but no origin behind it.",
          "That distinction matters less to families than to anyone publishing a calendar. If you are a parent posting a photo in late September, you are participating in something genuine regardless of where the date came from. If you are printing a school newsletter or scheduling a program, the difference between a date with a founder and a date without one is the whole question."
        ]
      },
      {
        "heading": "How the day is actually observed",
        "body": [
          "Nothing about National Sons Day is transactional: no gift convention formed around it, and greeting-card publishers have left it alone. In practice it is a social media day. Parents post photographs with the hashtag, write a few lines about a son, and that is the extent of it for most people.",
          "National Day Calendar's suggestions for the day lean practical rather than sentimental: teach a son a specific skill he will need, such as changing a tire or handling a bank account; find or become a mentor for boys without a male role model in their lives; pass along something your own father taught you; take a photograph with all the sons together. Organizations that mentor boys tend to see the day as a low-cost hook for recruitment posts rather than a fundraising moment.",
          "Because the day is unofficial, schools and workplaces rarely mark it. The one adjacent observance that does have institutional traction is the April workplace program once called Take Our Daughters and Sons to Work Day: Junior Achievement took it over in 2024 and now runs it each spring as Take a Child to Work Day and Beyond, a scheduled program with participating employers rather than a hashtag."
        ]
      },
      {
        "heading": "Which date should you use",
        "body": [
          "If you need one date and you need to defend it, use March 4. It is the date with a named founder, a registry listing, and a documented year of creation. Anything published on a school calendar, a newsletter, or a client-facing schedule should use it.",
          "If your audience lives on social media, expect the traffic in late September anyway, and there is nothing dishonest about acknowledging that. Marking the day in September because that is when the people around you mark it is fine. Stating that September 28 is the official date is not, because there is no evidence for it and there is direct evidence against it from the people who research these dates for a living.",
          "The safest phrasing, if you have to write one line about it: National Sons Day is observed on March 4, and also widely marked on September 28."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is National Sons Day?",
        "answer": "National Sons Day is on March 4 each year, according to National Day Calendar, Checkiday, and Days of the Year, all of which trace the observance to founder Jill Nico in 2018. A second date, September 28, is widely published and is when most social media activity happens, but it has no documented origin."
      },
      {
        "question": "Why do some websites say National Sons Day is September 28?",
        "answer": "Nobody has been able to show where September 28 came from. Research published by Seth Westphal of Checkiday in 2022 found no founder, registration, or first observance for the date, and concluded it spread by repetition. The likely seed of the confusion is that an organization called National Sons Day did exist in the 1990s, but it was an organization rather than a holiday, and its Take Our Sons to Work Day events were held on the first Thursday in May."
      },
      {
        "question": "Who created National Sons Day?",
        "answer": "Jill Nico created National Sons Day in 2018 and submitted it for the March 4 date. National Day Calendar credits her by name; Checkiday credits her independently. No founder has ever been identified for the September 28 version."
      },
      {
        "question": "Is National Sons Day an official or federal holiday?",
        "answer": "No. Neither March 4 nor September 28 is a federal holiday, and nothing closes for it. National Sons Day is an unofficial observance, sometimes described in press coverage as a quasi-holiday, meaning people genuinely observe it but no government body established it."
      },
      {
        "question": "Is National Sons Day the same as Take Our Sons to Work Day?",
        "answer": "No, though the two are historically tangled. A group of New Jersey students founded an organization called National Sons Day in 1996 and ran Take Our Sons to Work Day on the first Thursday in May from 1996. Some calendar sites date that launch to 1998 instead. That program merged with the daughters' program in 2003 into the combined Take Our Daughters and Sons to Work Day, and Junior Achievement took the program over in 2024, running it each April as Take a Child to Work Day and Beyond. The modern National Sons Day on March 4 is a separate observance created in 2018."
      },
      {
        "question": "Is there a National Daughters Day as well?",
        "answer": "Yes. National Day Calendar lists National Daughter's Day on September 25. Its existence is part of the stated reason National Sons Day was created, since the founder set out to give sons an equivalent day."
      }
    ],
    "sources": [
      {
        "label": "National Day Calendar - National Sons Day (March 4)",
        "url": "https://www.nationaldaycalendar.com/national-day/national-sons-day-march-4"
      },
      {
        "label": "National Day Calendar - National Daughter's Day (September 25)",
        "url": "https://www.nationaldaycalendar.com/national-day/national-daughters-day-september-25"
      },
      {
        "label": "Checkiday - National Sons Day",
        "url": "https://www.checkiday.com/e2dc737da19aea2325e895d766c8aeb2/national-sons-day"
      },
      {
        "label": "Checkiday - holidays listed for September 28",
        "url": "https://www.checkiday.com/9/28/2026"
      },
      {
        "label": "Seth Westphal, No, September 28th is Not National Sons Day (Medium, September 29, 2022)",
        "url": "https://westy92.medium.com/no-september-28th-is-not-national-sons-day-bcc3b9cc5c15"
      },
      {
        "label": "Days of the Year - National Sons Day",
        "url": "https://www.daysoftheyear.com/days/national-sons-day/"
      },
      {
        "label": "WinCalendar - National Son's Day",
        "url": "https://www.wincalendar.com/Sons-Day"
      },
      {
        "label": "Calendarr - National Sons Day (lists both dates)",
        "url": "https://www.calendarr.com/united-states/national-sons-day/"
      },
      {
        "label": "USA TODAY via AOL - When is National Son's Day?",
        "url": "https://www.aol.com/national-sons-day-know-holiday-163910451.html"
      },
      {
        "label": "Wikipedia - Take Our Daughters and Sons to Work Day",
        "url": "https://en.wikipedia.org/wiki/Take_Our_Daughters_and_Sons_to_Work_Day"
      },
      {
        "label": "Junior Achievement USA via PR Newswire - Take Our Daughters and Sons to Work Day Becomes Take a Child to Work Day and Beyond (January 21, 2025)",
        "url": "https://www.prnewswire.com/news-releases/take-our-daughters-and-sons-to-work-day-becomes-take-a-child-to-work-day-and-beyond-as-junior-achievement-inspires-participation-by-all-kids-and-families-302354953.html"
      }
    ]
  },
  {
    "slug": "national-coffee-day",
    "category": "Observances",
    "title": "National Coffee Day: September 29 in the United States",
    "description": "National Coffee Day falls on September 29 in the US every year. Its origin is undocumented. International Coffee Day is a separate day, October 1.",
    "published": "2026-08-02",
    "updated": "2026-08-03",
    "image": "/images/national-coffee-day.jpg",
    "imageAlt": "A black cup of coffee on a saucer",
    "imageCredit": "Photo by [Ross Parmly](https://unsplash.com/@rparmly) via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Black_coffee_cup_(Unsplash).jpg), CC0",
    "coreSummary": "National Coffee Day is observed in the United States on September 29 every year, on a fixed date that does not shift. It has no documented founder and no federal designation, and it is separate from International Coffee Day, which falls on October 1 and was designated by the UN General Assembly in March 2026.",
    "dateRule": {
      "kind": "fixed",
      "text": "September 29 in the United States, the same calendar date every year. No statute, proclamation or founding body establishes it as a recurring date; September 29 is simply the date the observance is kept on, year after year.",
      "source": {
        "label": "National Coffee Association — National Coffee Day on Capitol Hill",
        "url": "https://www.ncausa.org/Newsroom/National-Coffee-Day-gives-Grounds-for-Celebration-on-Capitol-Hill"
      },
      "occurrences": [
        {
          "date": "2026-09-29",
          "weekday": "Tuesday"
        },
        {
          "date": "2027-09-29",
          "weekday": "Wednesday"
        },
        {
          "date": "2028-09-29",
          "weekday": "Friday"
        },
        {
          "date": "2029-09-29",
          "weekday": "Saturday"
        },
        {
          "date": "2030-09-29",
          "weekday": "Sunday"
        },
        {
          "date": "2031-09-29",
          "weekday": "Monday"
        }
      ],
      "caveat": "International Coffee Day is a different observance held on October 1. It was organized by the International Coffee Organization, first held on October 1, 2015, and designated by the UN General Assembly on March 10, 2026 in resolution A/RES/80/249. Several countries hold their national coffee day on October 1 rather than September 29, and others use unrelated dates entirely.",
      "status": "conventional"
    },
    "founding": {
      "status": "unverified",
      "text": "No primary record establishes who created the September 29 observance or when. There is no US federal law behind it, and a search of presidential documents in the Federal Register returns no results for \"National Coffee Day\". The National Coffee Association, the industry trade body that promotes the day most visibly, does not claim to have created it. The closest thing to official recognition is H.Res. 784 in the 119th Congress, introduced on September 30, 2025 and referred to the Committee on Energy and Commerce; its text supports the designation but treats the date as already established, stating that National Coffee Day \"will be recognized this year on September 29, 2025\". Secondary sources repeat that the term appeared publicly around 2005, but none of them point to a registration, proclamation, or founding announcement. By contrast, International Coffee Day on October 1 has a fully documented institutional origin.",
      "source": {
        "label": "H.Res. 784, 119th Congress (GovInfo)",
        "url": "https://www.govinfo.gov/content/pkg/BILLS-119hres784ih/pdf/BILLS-119hres784ih.pdf"
      }
    },
    "sections": [
      {
        "heading": "What National Coffee Day is",
        "body": [
          "National Coffee Day is an informal US observance held on September 29. It is not a public holiday, it carries no time off, and no federal or state authority is required to declare it each year. Nothing about the date rotates or shifts: it is September 29 whether that lands on a Tuesday or a Sunday.",
          "Three groups do most of the observing. Coffee chains and convenience stores run one-day promotions. The National Coffee Association, the US coffee industry trade body founded in 1911, times its consumer research and its Washington advocacy around the date. And members of Congress in the bipartisan Congressional Coffee Caucus use it as a hook for briefings on coffee trade and coffee economics.",
          "In 2025 the National Coffee Association held a Capitol Hill briefing tied to the day, co-hosted with the caucus and opened by its co-chairs, Representatives Jill Tokuda of Hawaii and William Timmons of South Carolina. The briefing covered coffee's economic contribution, health research, and supply chain resilience rather than anything to do with the observance itself."
        ]
      },
      {
        "heading": "Why the September 29 origin cannot be traced",
        "body": [
          "Most widely observed days can be traced to something: an act of Congress, a presidential proclamation, a UN resolution, a founding organization, or at minimum a dated announcement by whoever started it. National Coffee Day has none of these. A search of the Federal Register for presidential documents mentioning National Coffee Day returns zero results. No statute creates it. No trade body claims authorship.",
          "The congressional record is the clearest evidence of the gap. On September 30, 2025, the day after that year's observance, Representative Tokuda and seven co-sponsors introduced H.Res. 784, titled \"Recognizing the value of coffee to the United States and expressing support for September 29, 2025, to be designated as 'National Coffee Day'\". The resolution was referred to the Committee on Energy and Commerce. Read closely, it is not a founding document. Its final whereas clause simply observes that \"National Coffee Day will be recognized this year on September 29, 2025\", and the resolving text says the House \"supports the designation\" without saying who made it. A simple House resolution of this kind expresses the sense of the chamber; it does not create law, and it was written for one specific year.",
          "The origin stories circulating online do not hold up either. One version says the National Coffee Association launched the day in 2005. What Sprudge actually found is narrower: the day is not mentioned publicly in the United States until a 2005 reference by the NCA. That is a first sighting, not a founding announcement, and the NCA does not claim to have created it. Sprudge, a coffee trade publication that went looking for the answer, concluded the origins are murky.",
          "The honest position is that September 29 is observed because it is observed. The date became self-reinforcing once retailers, listing sites, and newsrooms began treating it as fixed, and no one has produced the document that started it."
        ]
      },
      {
        "heading": "International Coffee Day, October 1, is a separate and documented observance",
        "body": [
          "The observance with a paper trail is International Coffee Day, and it is on October 1, not September 29. In March 2014, member states of the International Coffee Organization agreed to organize International Coffee Day on 1 October, in the ICO's words to create a single day of celebration for coffee lovers around the world. It did not displace the national days already in use: dozens of countries still keep their own, and a large share of those fall on September 29. The ICO then announced that the first official International Coffee Day would take place on October 1, 2015. Each year since, the ICO has run the day as a campaign with a stated theme; the 2025 theme, announced in a press release on September 19, 2025, was \"Embracing Collaboration More Than Ever\".",
          "October 1 is also the first day of the coffee year, the twelve-month accounting period the ICO runs its production and trade statistics on. That gave the date a practical logic the September 29 observance never had.",
          "International Coffee Day was elevated further on March 10, 2026, when the UN General Assembly adopted resolution A/RES/80/249 proclaiming October 1 as International Coffee Day. The resolution was introduced by Brazil with a core group of 18 countries and drew 97 co-sponsors. The Food and Agriculture Organization, which welcomed the adoption the same day, was invited to facilitate the annual observance in collaboration with relevant organizations, in particular the ICO.",
          "The two days therefore have different scopes as well as different dates. September 29 is a US consumer observance with no institutional owner. October 1 is an intergovernmental observance about the coffee sector, its producers, and its supply chain, with the ICO, the FAO, and now the UN General Assembly behind it."
        ]
      },
      {
        "heading": "In practice it functions as a retail promotion day",
        "body": [
          "Whatever its origins, National Coffee Day in the United States now works mainly as a promotional event for coffee retailers. Chains, doughnut shops, and convenience stores announce one-day free or discounted coffee offers in the days beforehand, and news outlets aggregate them. CNN Business, covering the 2025 observance, framed the day around which chains were giving drinks away.",
          "The mechanics matter more than the individual offers. Most promotions in recent years have been gated behind a loyalty program or a mobile app order rather than being open to anyone who walks in, which makes the day a customer acquisition event as much as a giveaway. Offers change completely from year to year, are usually confirmed only a week or two ahead, and are typically valid for that single day at participating locations.",
          "This page does not list current offers, because they expire. If you are looking for them, check individual chains' apps and newsrooms in the last week of September."
        ]
      },
      {
        "heading": "The numbers usually quoted around the day",
        "body": [
          "The National Coffee Association releases its National Coffee Data Trends survey ahead of September 29, so most of the US statistics that circulate on the day come from it. The Fall 2025 edition, fielded by Dig Insights, reported that 66% of American adults had drunk coffee in the past day, more than any beverage other than bottled water, and that past-day drinkers averaged close to three cups. It also put past-day specialty coffee consumption at a record 48% of American adults, up from 37% in 2021.",
          "For the industry side, H.Res. 784 cites more than 150 million Americans drinking over 400 million cups a day, a coffee industry supporting more than 2.2 million US jobs, and a contribution of over $343 billion a year to the national economy, including $38 billion in federal, state, and local tax revenue. It also notes that more than 99% of coffee consumed in the United States is imported.",
          "Global figures normally come from the FAO or the ICO rather than the NCA. In its March 2026 statement on the UN resolution, the FAO said global coffee production passed 11 million tonnes in 2024, that world trade in coffee beans reached roughly $34 billion, and that coffee accounted for 27.9% of total merchandise exports in Ethiopia, 20.1% in Uganda, and 19.5% in Burundi that year. When a figure appears on September 29 without a named source, it is usually one of these, second-hand."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is National Coffee Day?",
        "answer": "National Coffee Day is September 29 in the United States, every year. It is a fixed calendar date rather than a floating one, so it does not move to the nearest weekday and falls on a different day of the week each year."
      },
      {
        "question": "Is National Coffee Day the same as International Coffee Day?",
        "answer": "No. They are two different observances on two different dates. National Coffee Day in the United States is September 29 and has no documented founder. International Coffee Day is October 1; it was agreed by member states of the International Coffee Organization in March 2014, first held on October 1, 2015, and designated by the UN General Assembly on March 10, 2026 in resolution A/RES/80/249. Some countries observe their own coffee day on October 1 instead of September 29, and others use unrelated dates."
      },
      {
        "question": "Who started National Coffee Day?",
        "answer": "Nobody has been able to show who started it. No US law or presidential proclamation created it, and no organization has ever announced founding it. The National Coffee Association promotes the day but does not claim to have created it. The earliest public mention anyone has traced is a 2005 reference by the National Coffee Association, reported by the trade publication Sprudge — a first sighting, not a founding."
      },
      {
        "question": "Is National Coffee Day a federal holiday?",
        "answer": "No. It is not a federal holiday and carries no legal status. Government offices, banks, schools, and businesses operate normally on September 29. The closest official action is H.Res. 784 in the 119th Congress, a non-binding resolution introduced on September 30, 2025 that expressed support for the designation and was referred to committee."
      },
      {
        "question": "Why do coffee chains give away free coffee on September 29?",
        "answer": "Because the day functions as a retail promotion in the United States. Coffee chains and convenience stores use the date to run one-day free or discounted drink offers, most of them requiring a loyalty account or a mobile app order. The offers change every year, are announced shortly beforehand, and generally apply only on September 29 at participating locations."
      },
      {
        "question": "Does National Coffee Day ever fall on a different date?",
        "answer": "Not in the United States. It is September 29 regardless of the day of the week. What varies is which country you are in: a number of countries mark their coffee day on October 1 alongside International Coffee Day, and some use entirely different dates."
      }
    ],
    "sources": [
      {
        "label": "H.Res. 784, 119th Congress: Recognizing the value of coffee to the United States (GovInfo, introduced 30 September 2025)",
        "url": "https://www.govinfo.gov/content/pkg/BILLS-119hres784ih/pdf/BILLS-119hres784ih.pdf"
      },
      {
        "label": "H.Res. 784 bill record, Congress.gov",
        "url": "https://www.congress.gov/bill/119th-congress/house-resolution/784"
      },
      {
        "label": "Federal Register search: presidential documents mentioning \"National Coffee Day\" (no results)",
        "url": "https://www.federalregister.gov/documents/search?conditions%5Bterm%5D=%22National+Coffee+Day%22&conditions%5Btype%5D%5B%5D=PRESDOCU"
      },
      {
        "label": "International Coffee Organization: International Coffee Day (ICD)",
        "url": "https://ico.org/international-coffee-day/"
      },
      {
        "label": "ICO news: First official International Coffee Day to take place on 1 October 2015 (archived, original ico.org page retired)",
        "url": "https://web.archive.org/web/20240528020419/https://www.ico.org/show_news.asp?id=490"
      },
      {
        "label": "ICO Press Release 362/25, 19 September 2025: International Coffee Day 2025 campaign",
        "url": "https://ico.org/documents/cy2024-25/pr-362e-international-coffee-day-2025.pdf"
      },
      {
        "label": "FAO, 10 March 2026: FAO welcomes UN resolution instituting International Coffee Day",
        "url": "https://www.fao.org/newsroom/detail/fao-welcomes-un-resolution-instituting-international-coffee-day/en"
      },
      {
        "label": "UN General Assembly meetings coverage, 10 March 2026 (GA/12753)",
        "url": "https://press.un.org/en/2026/ga12753.doc.htm"
      },
      {
        "label": "United Nations observances: International Coffee Day, 1 October",
        "url": "https://www.un.org/en/observances/international-coffee-day"
      },
      {
        "label": "National Coffee Association: National Coffee Day gives \"Grounds for Celebration\" on Capitol Hill (30 September 2025)",
        "url": "https://www.ncausa.org/Newsroom/National-Coffee-Day-gives-Grounds-for-Celebration-on-Capitol-Hill"
      },
      {
        "label": "National Coffee Association, Fall 2025 National Coffee Data Trends (release, 9 September 2025)",
        "url": "https://www.prnewswire.com/news-releases/grounds-for-celebration-americans-remain-committed-to-coffee-302550720.html"
      },
      {
        "label": "Sprudge: What Is National Coffee Day?",
        "url": "https://sprudge.com/what-is-national-coffee-day-181677.html"
      },
      {
        "label": "CNN Business, 29 September 2025: National Coffee Day 2025 coverage",
        "url": "https://www.cnn.com/2025/09/29/business/national-coffee-day-2025-free-drinks-at-dunkin-smoothie-king-and-more"
      },
      {
        "label": "Wikipedia: International Coffee Day (country-by-country dates)",
        "url": "https://en.wikipedia.org/wiki/International_Coffee_Day"
      }
    ]
  },
  {
    "slug": "national-grandparents-day",
    "category": "Observances",
    "title": "National Grandparents Day: The Date Rule in US Federal Law",
    "description": "National Grandparents Day falls on the first Sunday in September after Labor Day, not the first Sunday in September. The statutory rule, explained.",
    "updated": "2026-08-02",
    "coreSummary": "In the United States, National Grandparents Day is observed on the first Sunday in September after Labor Day, the wording used in 36 U.S.C. § 125. Because Labor Day is the first Monday in September, the observance always lands between September 7 and September 13.",
    "dateRule": {
      "kind": "offset",
      "text": "The first Sunday in September after Labor Day. Labor Day is the first Monday in September (5 U.S.C. § 6103(a)), so National Grandparents Day is the Sunday six days after that Monday, always falling between September 7 and September 13.",
      "source": {
        "label": "36 U.S.C. § 125 — National Grandparents Day (Office of the Law Revision Counsel)",
        "url": "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title36-section125&num=0&edition=prelim"
      },
      "occurrences": [
        {
          "date": "2026-09-13",
          "weekday": "Sunday"
        },
        {
          "date": "2027-09-12",
          "weekday": "Sunday"
        },
        {
          "date": "2028-09-10",
          "weekday": "Sunday"
        },
        {
          "date": "2029-09-09",
          "weekday": "Sunday"
        },
        {
          "date": "2030-09-08",
          "weekday": "Sunday"
        },
        {
          "date": "2031-09-07",
          "weekday": "Sunday"
        }
      ],
      "caveat": "The rule is widely paraphrased as \"the first Sunday in September.\" That paraphrase is wrong in most years: the first Sunday in September falls between September 1 and September 7, while the statutory date falls between September 7 and September 13. The two coincide only when September 1 is a Monday. Note also that this is the United States rule only. Italy observes its Festa nazionale dei nonni on October 2 by statute, Canada marks Grandparents Day on the second Sunday in September, and New South Wales in Australia runs a government-backed Grandparents Day in late October."
    },
    "founding": {
      "status": "documented",
      "text": "The campaign behind the observance was led by Marian McQuade (1917–2008) of Oak Hill, West Virginia, elected vice-chairman of the West Virginia Committee on Aging in 1971, who lobbied state and federal officials through the 1970s for a day honoring grandparents. West Virginia recognized a Grandparents Day of its own before the federal designation: Governor Arch Moore proclaimed the state's first observance in 1973, the same year Senator Jennings Randolph introduced a Senate resolution for a national one. Two further particulars circulate with it — that the state observance was held on May 27, and that West Virginia was the first state in the country to hold such a day. Both appear only in the West Virginia University finding aid, whose biographical note is adapted from Wikipedia, and e-WV says only that the 1973 observance was West Virginia's own first. Those two are not treated as established here. Federal recognition arrived in two stages: President Jimmy Carter issued Proclamation 4580 on August 3, 1978 designating September 10, 1978 alone, and Congress then made the designation annual through H.J. Res. 244, enacted as Pub. L. 96-62 on September 6, 1979. McQuade's campaign papers are held as a 25-linear-foot collection at West Virginia University.",
      "source": {
        "label": "e-WV: The West Virginia Encyclopedia — Grandparents Day",
        "url": "https://www.wvencyclopedia.org/entries/2081"
      }
    },
    "sections": [
      {
        "heading": "What the statute actually says",
        "body": [
          "National Grandparents Day is defined in Title 36 of the United States Code, the title covering patriotic and national observances. Section 125 reads in full: \"The President is requested to issue each year a proclamation— (1) designating the first Sunday in September after Labor Day as National Grandparents Day; and (2) calling on the people of the United States and interested groups and organizations to observe National Grandparents Day with appropriate ceremonies and activities.\"",
          "That single phrase, \"the first Sunday in September after Labor Day,\" is the whole rule. It is a relative date, anchored to another observance rather than to a fixed calendar day. To resolve it you need Labor Day first, and Labor Day has its own statutory definition: 5 U.S.C. § 6103(a) lists the legal public holidays and gives Labor Day as \"the first Monday in September.\"",
          "Chain the two together and the date is fully determined. Find the first Monday in September, then take the following Sunday. Because the first Monday in September can be as early as the 1st and as late as the 7th, the Sunday after it can be as early as September 7 and as late as September 13. The observance never leaves that seven-day window, which is why the statute can say \"in September after Labor Day\" without ever contradicting itself."
        ]
      },
      {
        "heading": "Why \"the first Sunday in September\" is the wrong rule",
        "body": [
          "The most common error about this date is a paraphrase that drops Labor Day entirely and calls it the first Sunday in September. It appears in calendar listings, school newsletters, and greeting-card marketing. It is not a minor rewording. It produces a different date in most years, and the gap is always exactly one week.",
          "The arithmetic is easy to check. The first Sunday in September falls somewhere between September 1 and September 7. The statutory date falls between September 7 and September 13. The two ranges overlap at a single point, September 7, and they only meet there when September 1 happens to be a Monday. In that case Labor Day is September 1, the Sunday after it is September 7, and the first Sunday of the month is also September 7. September 1 fell on a Monday in 2025, and will next in 2031.",
          "In every other year the paraphrase is off by seven days. Take 2026: Labor Day is Monday, September 7, so National Grandparents Day is Sunday, September 13. The first Sunday in September 2026 is the 6th, a full week earlier and the day before Labor Day itself. The same seven-day gap holds for 2027, 2028, 2029 and 2030. If you have seen an early-September date for this observance and September 1 that year was not a Monday, you were looking at the wrong rule."
        ]
      },
      {
        "heading": "How the day became federal law",
        "body": [
          "Federal recognition happened in two separate steps a year apart, and the two are often collapsed into one in popular accounts.",
          "The first step was a one-year proclamation. On August 3, 1978, President Jimmy Carter signed Proclamation 4580, which designated \"Sunday, September 10, 1978, as 'National Grandparents Day.'\" That proclamation set no ongoing rule and cited no act of Congress. It covered a single date in a single year.",
          "The second step created the recurring observance. H.J. Res. 244 passed the House on July 27, 1979 and the Senate on August 3, 1979, and was approved on September 6, 1979 as Public Law 96-62 (93 Stat. 410). Its operative text reads that \"the President is authorized and requested to issue a proclamation designating the first Sunday of September after Labor Day as 'National Grandparents Day', and calling upon the people of the United States and interested groups and organizations to observe such day with appropriate ceremonies and activities.\" The wording shifted as it moved: the resolution's caption says annually and following Labor Day of each year, the operative sentence says neither, and the codified version at 36 U.S.C. § 125 says each year. All three refer to the same observance. Carter issued the matching proclamation, number 4679, the same day, naming \"Sunday, September 9, 1979 and the first Sunday following Labor Day in each succeeding year\" as the observance.",
          "That 1979 resolution was codified as 36 U.S.C. § 142b. When Congress reorganized Title 36 in 1998 under Pub. L. 105-225, the provision was restated without substantive change at its current address, 36 U.S.C. § 125. The Historical and Revision Notes printed with § 125 still trace it back to the September 6, 1979 statute.",
          "A caution on sources: many otherwise careful accounts, including some archival and encyclopedia entries, say that Carter signed the grandparents legislation in 1978. The Statutes at Large do not support that. The 1978 item is a proclamation covering one day, and the annual statute is dated 1979. Public Law 95-276, occasionally cited for this observance, is unrelated; it is a May 10, 1978 joint resolution appointing a citizen regent to the Smithsonian Board of Regents."
        ]
      },
      {
        "heading": "What the designation does and does not do",
        "body": [
          "National Grandparents Day is an observance, not a federal holiday. The list of legal public holidays in 5 U.S.C. § 6103(a) runs from New Year's Day to Christmas Day and does not include it. No federal offices close, no employees receive paid leave, and no pay or leave rules attach to the date.",
          "The statute is also unusually indirect in its drafting. It does not declare the day itself. It requests that the President issue a proclamation each year doing so, which is standard construction for observances in Title 36 and is why a fresh presidential proclamation typically appears each September. The underlying date rule does not depend on whether a given proclamation is issued.",
          "One practical consequence of the rule is that the observance always falls on a Sunday, and always on the Sunday of the weekend following the Labor Day long weekend. Schools and community organizations that schedule events around it are working with a date that shifts by up to six days between years, which is the usual reason listings drift out of sync."
        ]
      },
      {
        "heading": "Grandparents Day in other countries",
        "body": [
          "The American date rule is specific to the United States, and other countries that keep a grandparents observance set it independently. There is no shared international date.",
          "Italy fixes its observance to a calendar day rather than a weekday. Law 159 of 31 July 2005, \"Istituzione della Festa nazionale dei nonni,\" establishes the Festa nazionale dei nonni and states at Article 1(3) that it falls on October 2 of each year. The same provision specifies that the day carries none of the civil effects of Italy's public holiday law, so it is an observance rather than a day off.",
          "Canada uses the second Sunday in September, which lands on the same day as the American date in most years. The two separate only when September 1 is a Monday, and then the Canadian date is a week later, not earlier: 2025 and 2031 are the near-term cases. The date entered federal debate through a private member's bill, C-274, given first reading in the House of Commons on September 27, 1994, whose sponsor described designating \"the second Sunday in September every year as national grandparents' day, as we do in many provinces and cities in the country.\"",
          "In Australia, the observance is run at state level rather than nationally. New South Wales holds an official Grandparents Day organised by its Department of Communities and Justice, scheduled in late October; the 2025 edition was held on Sunday, October 26."
        ]
      }
    ],
    "faq": [
      {
        "question": "Is Grandparents Day the first Sunday in September?",
        "answer": "No. Under 36 U.S.C. § 125 the rule is the first Sunday in September after Labor Day, which is a different day in most years. Labor Day is the first Monday in September, so National Grandparents Day always falls between September 7 and September 13, while the first Sunday of the month falls between September 1 and September 7. The two dates coincide only in years when September 1 is a Monday, such as 2025 and 2031. In 2026 through 2030 the popular paraphrase is off by exactly one week."
      },
      {
        "question": "How do I work out the date for any given year?",
        "answer": "Find the first Monday in September, which is Labor Day under 5 U.S.C. § 6103(a), then take the next Sunday, six days later. For example, if Labor Day is Monday, September 7, National Grandparents Day is Sunday, September 13. The result is always a Sunday between September 7 and September 13 inclusive."
      },
      {
        "question": "Is National Grandparents Day a federal holiday in the United States?",
        "answer": "No. It is a designated observance, not a legal public holiday. The federal holidays are listed in 5 U.S.C. § 6103(a) and National Grandparents Day is not among them. The day always falls on a Sunday, so no federal office schedule is affected either way, no paid leave attaches to it, and the statute only requests that the President issue an annual proclamation marking it."
      },
      {
        "question": "Who started National Grandparents Day?",
        "answer": "Marian McQuade of Oak Hill, West Virginia, who was elected vice-chairman of the West Virginia Committee on Aging in 1971, campaigned through the 1970s for an official day honoring grandparents. West Virginia recognized one before the federal designation, when Governor Arch Moore proclaimed the state's first observance in 1973. The exact date often attached to that proclamation, and the claim that West Virginia was the first state in the country, come from an archive finding aid adapted from Wikipedia and are not stated as fact here. Her campaign papers are held at the West Virginia & Regional History Center at West Virginia University."
      },
      {
        "question": "When did National Grandparents Day become official at the federal level?",
        "answer": "In two stages. President Jimmy Carter signed Proclamation 4580 on August 3, 1978, designating September 10, 1978 as National Grandparents Day for that year only. Congress then made it annual through H.J. Res. 244, approved September 6, 1979 as Public Law 96-62, which set the first Sunday in September after Labor Day as the recurring date. That provision is now codified at 36 U.S.C. § 125. Accounts that describe Carter signing the annual legislation in 1978 conflate the two steps."
      },
      {
        "question": "Do other countries observe Grandparents Day on the same date?",
        "answer": "No. There is no international standard, though the Canadian and American dates happen to coincide most years. Italy observes the Festa nazionale dei nonni on October 2 every year under Law 159 of 31 July 2005. Canada marks Grandparents Day on the second Sunday in September, which coincides with the American date in most years and falls a week later in the rest. In Australia, New South Wales runs a state-organised Grandparents Day in late October, held on October 26 in 2025."
      }
    ],
    "sources": [
      {
        "label": "36 U.S.C. § 125 — National Grandparents Day, Office of the Law Revision Counsel",
        "url": "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title36-section125&num=0&edition=prelim"
      },
      {
        "label": "36 U.S.C. § 125 with Historical and Revision Notes, US Code (GPO/govinfo PDF)",
        "url": "https://www.govinfo.gov/content/pkg/USCODE-2023-title36/pdf/USCODE-2023-title36-subtitleI-partA-chap1-sec125.pdf"
      },
      {
        "label": "Public Law 96-62 (H.J. Res. 244), approved September 6, 1979, 93 Stat. 410",
        "url": "https://uscode.house.gov/statutes/pl/96/62.pdf"
      },
      {
        "label": "Proclamation 4580 — National Grandparents Day, 1978 (August 3, 1978)",
        "url": "https://www.presidency.ucsb.edu/documents/proclamation-4580-national-grandparents-day-1978"
      },
      {
        "label": "Proclamation 4679 — National Grandparents Day (September 6, 1979)",
        "url": "https://www.presidency.ucsb.edu/documents/proclamation-4679-national-grandparents-day"
      },
      {
        "label": "5 U.S.C. § 6103 — Holidays (Labor Day, the first Monday in September)",
        "url": "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title5-section6103&num=0&edition=prelim"
      },
      {
        "label": "Public Law 95-276, approved May 10, 1978, 92 Stat. 235 (Smithsonian regent appointment; unrelated to this observance)",
        "url": "https://uscode.house.gov/statutes/pl/95/276.pdf"
      },
      {
        "label": "Marian McQuade Papers, West Virginia & Regional History Center, West Virginia University",
        "url": "https://archives.lib.wvu.edu/repositories/2/resources/1523"
      },
      {
        "label": "e-WV: The West Virginia Encyclopedia — Grandparents Day (Peggy Ross)",
        "url": "https://www.wvencyclopedia.org/entries/2081"
      },
      {
        "label": "e-WV: The West Virginia Encyclopedia — Holidays and Celebrations (Ken Sullivan)",
        "url": "https://www.wvencyclopedia.org/entries/419"
      },
      {
        "label": "Legge 31 luglio 2005, n. 159 — Istituzione della Festa nazionale dei nonni (Parlamento italiano)",
        "url": "https://www.parlamento.it/parlam/leggi/05159l.htm"
      },
      {
        "label": "House of Commons of Canada, Debates (Hansard) No. 98, September 27, 1994 — Bill C-274 first reading",
        "url": "https://www.ourcommons.ca/DocumentViewer/en/35-1/house/sitting-98/hansard"
      },
      {
        "label": "About NSW Grandparents Day, NSW Government",
        "url": "https://www.nsw.gov.au/family-and-relationships/grandparents-day/about"
      }
    ]
  },
  {
    "slug": "national-bosses-day",
    "category": "Observances",
    "title": "National Boss's Day: October 16, and the Rule Nobody Signed Off On",
    "description": "National Boss's Day falls on October 16 every year, registered by Patricia Bays Haroski in 1958. The weekend-shift rule widely repeated for it has no traceable source.",
    "updated": "2026-08-02",
    "coreSummary": "National Boss's Day is observed on October 16 in the United States, a date Patricia Bays Haroski registered with the U.S. Chamber of Commerce in 1958 and Illinois Governor Otto Kerner proclaimed in 1962. Calendar sites, Hallmark, and Wikipedia's infobox all state that the observance moves to the nearest working day when October 16 falls on a weekend, but no primary record of the 1958 registration or the 1962 proclamation is available to confirm that the weekend shift was ever part of the original rule rather than a later convenience.",
    "dateRule": {
      "kind": "fixed",
      "text": "October 16 every year in the United States, the date Patricia Bays Haroski chose in 1958 because it was her father's birthday. The calendar date itself does not move.",
      "source": {
        "label": "Hallmark Corporate — National Boss Day",
        "url": "https://corporate.hallmark.com/holidays-occasions/national-boss-day/"
      },
      "occurrences": [
        { "date": "2026-10-16", "weekday": "Friday" },
        { "date": "2027-10-16", "weekday": "Saturday" },
        { "date": "2028-10-16", "weekday": "Monday" },
        { "date": "2029-10-16", "weekday": "Tuesday" },
        { "date": "2030-10-16", "weekday": "Wednesday" },
        { "date": "2031-10-16", "weekday": "Thursday" }
      ],
      "caveat": "Hallmark's corporate site, Wikipedia's infobox, and the calendar site Digital Hygge all state that when October 16 falls on a Saturday or Sunday, workplace observance moves to the nearest working day: Friday for a Saturday, Monday for a Sunday. That convention is repeated consistently, but it is not attached to any primary document: neither Haroski's 1958 Chamber of Commerce registration nor Governor Kerner's 1962 proclamation is available online to confirm a weekend-shift clause was part of the original rule, and Wikipedia's own account of the underlying origin story carries an unresolved citation-needed tag. This page lists October 16 itself for every year; readers whose office follows the nearest-working-day convention should apply it themselves for 2027 (shifts to Friday the 15th) and 2032 (a Saturday, shifting to Friday the 15th)."
    },
    "founding": {
      "status": "documented",
      "text": "Patricia Bays Haroski, a secretary at State Farm Insurance Company in Deerfield, Illinois, registered \"National Boss' Day\" with the U.S. Chamber of Commerce in 1958. She picked October 16 because it was her father's birthday (he was also her boss at the time), and said her goal was to encourage better understanding between employees and supervisors. Illinois Governor Otto Kerner backed the registration with a state proclamation four years later, in 1962. The story is repeated consistently across Hallmark's corporate site, Wikipedia, and the calendar site Digital Hygge, with the same name, employer, city, and reason for the date each time, which is more than most \"national day\" origins on this calendar can show. It falls short of fully documented, though: Wikipedia flags the founding sentence itself with a citation-needed tag, and no scan turns up a reproduction of the actual 1958 registration filing or the 1962 gubernatorial proclamation. Every account, including this one, is repeating a secondhand telling rather than pointing at the primary document.",
      "source": {
        "label": "Hallmark Corporate — National Boss Day",
        "url": "https://corporate.hallmark.com/holidays-occasions/national-boss-day/"
      }
    },
    "sections": [
      {
        "heading": "What National Boss's Day is",
        "body": [
          "National Boss's Day is an informal US observance held on October 16, aimed at employees thanking supervisors for fair and supportive management over the year. It is not a public holiday: no federal or state law requires it, government offices and banks operate on a normal schedule, and there is no day off attached to it. In 2026 it falls on a Friday.",
          "The day works mainly through workplace gestures (cards, small gifts, a team lunch) rather than through any organized civic or religious observance. Hallmark's own history of the day, and its slow initial rollout of Boss's Day cards, is the clearest evidence of how commercial the day's growth has been rather than how official its founding was."
        ]
      },
      {
        "heading": "Where the October 16 date comes from",
        "body": [
          "The origin traces to one named person: Patricia Bays Haroski, a secretary at State Farm Insurance Company in Deerfield, Illinois, who registered \"National Boss' Day\" with the U.S. Chamber of Commerce in 1958. She chose October 16 because it was her father's birthday, and her father was, at the time, also her boss. Four years later, in 1962, Illinois Governor Otto Kerner lent the observance a measure of state recognition with a proclamation backing Haroski's registration.",
          "That is a more specific origin than most entries on this calendar have: a named founder, a named employer and city, a stated reason for the date, and a named public official who later endorsed it. It is repeated with the same details by Hallmark's corporate site, Wikipedia, and Digital Hygge, which is a level of agreement this site does not usually see for \"national day\" observances. It is still a state governor's proclamation rather than federal law, a rung below [National Grandparents Day](/national-grandparents-day/), which Congress wrote directly into the U.S. Code.",
          "It still is not a fully closed case. Wikipedia flags the founding sentence with a citation-needed tag, and no search here turned up a scan or transcript of the actual 1958 U.S. Chamber of Commerce registration or the 1962 Kerner proclamation. Every telling of the story, including this one, is repeating an account rather than quoting the primary document."
        ],
        "image": {
          "src": "/images/national-bosses-day-timeline.svg",
          "alt": "Timeline of National Boss's Day: 1958 registration by Patricia Bays Haroski, 1962 proclamation by Illinois Governor Otto Kerner, 1979 first Hallmark card, 2007 Hallmark expands its card line by 28 percent"
        }
      },
      {
        "heading": "Does the date actually move on a weekend?",
        "body": [
          "This is the question this page exists to answer honestly, because most calendar sites answer it without showing their work. Hallmark's corporate site states plainly that \"if the holiday falls on a weekend, it is celebrated on the closest work day,\" and Wikipedia's infobox lists the date as \"October 16 (or nearest working day),\" a formulation Digital Hygge repeats as well.",
          "The trouble is tracing that clause back to anything. Haroski's 1958 registration and Kerner's 1962 proclamation are the only two events anyone points to as the founding record, and neither is available online to check whether a weekend adjustment was part of the original design or added later by convenience. It is entirely plausible that the shift is just an obvious practical accommodation (thanking a boss on a Saturday when nobody is in the office makes little sense) that calendar sites adopted independently of one another and that has since hardened into an assumed rule.",
          "Because that clause cannot be attributed to a primary source, this page's date table lists October 16 itself in every year, including the years it lands on a weekend (2027 and 2032). Readers whose workplace follows the nearest-working-day convention can apply it themselves: in 2027, October 16 is a Saturday, so the office observance under that convention would move to Friday, October 15."
        ]
      },
      {
        "heading": "How a private registration became a retail season",
        "body": [
          "Hallmark did not move quickly on National Boss's Day. Its own corporate history states that the company did not put a Boss's Day card on shelves until 1979, 21 years after Haroski's original registration. From there the line grew steadily: reporting from 2008 noted Hallmark had expanded its National Boss' Day card offering by 28 percent the year before, a sign the day had become commercially significant enough to warrant it.",
          "The commercial growth has drawn its own pushback. Writing in U.S. News & World Report, Alison Green argued that traditional office etiquette runs from boss to employee, not the other way around, and that expecting subordinates to buy gifts for people who hold power over their employment sits awkwardly next to that norm. SHRM has covered the same tension without settling it: Cord Himelstein, an HR-recognition executive quoted in its piece, argued that companies should take the pressure off front-line employees by recognizing the day officially themselves, while psychologist Paul White pushed back that appreciation \"needs to be personal rather than organizational\" and loses meaning as a top-down program.",
          "Boss's Day is not the only observance on this calendar that spread through private registration rather than legislation. [National Sons Day](/national-sons-day/) has an even messier paper trail: a documented March 4 date from a named 2018 founder, and a second, undocumented September 28 date that circulates just as widely on social media: a reminder that \"National ___ Day\" branding is no guarantee that only one date, or one founder, is in circulation."
        ]
      },
      {
        "heading": "Observed outside the United States, on the same date",
        "body": [
          "Boss's Day did not stay confined to the United States. Sources tracking the day describe it as also observed, generally on the same October 16 date, in Canada, India, Ireland, Australia, and the United Kingdom, without singling out which workplaces within those countries actually mark it.",
          "This is a different pattern from some of the other entries on this calendar. [National Coffee Day](/national-coffee-day/), for instance, genuinely splits by country: the US date (September 29) and International Coffee Day (October 1) are two different observances with two different institutional histories, not one date drifting in translation. Boss's Day, by contrast, appears to be the same date exported alongside the same corporate culture, rather than a date that different countries independently settled on."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is National Boss's Day in 2026?",
        "answer": "Friday, October 16, 2026. The date is fixed at October 16 every year and does not depend on the day of the week; in 2026 it happens to land on a Friday."
      },
      {
        "question": "Does National Boss's Day move to a different day when October 16 falls on a weekend?",
        "answer": "Hallmark's corporate site and Wikipedia's infobox both describe a convention where the workplace observance shifts to the nearest working day: Friday if October 16 is a Saturday, Monday if it is a Sunday. That convention is widely repeated, but no primary document from the 1958 registration or the 1962 proclamation is available to confirm it was part of the original rule rather than added later. This page lists October 16 itself for every year on that basis."
      },
      {
        "question": "Who started National Boss's Day?",
        "answer": "Patricia Bays Haroski, a secretary at State Farm Insurance Company in Deerfield, Illinois, registered \"National Boss' Day\" with the U.S. Chamber of Commerce in 1958, choosing October 16 because it was her father's birthday and he was also her boss. Illinois Governor Otto Kerner backed the registration with a state proclamation in 1962. The story is consistent across multiple sources, though Wikipedia flags the underlying claim with a citation-needed tag and no primary document has surfaced online."
      },
      {
        "question": "Is National Boss's Day a federal holiday?",
        "answer": "No. It has no federal or state legal status. Government offices, banks, and most businesses operate on their normal schedule on October 16, and no time off is attached to the day."
      },
      {
        "question": "Why do some people criticize Boss's Day?",
        "answer": "The main objection is about the direction gifts flow. Writing in U.S. News & World Report, Alison Green argued that workplace gift-giving etiquette normally runs from a manager to an employee, not the reverse, and that a day built around employees buying gifts for the person who controls their job sits uncomfortably against that norm. SHRM has covered a related disagreement without resolving it: one HR executive it quoted argued companies should take the pressure off employees by recognizing the day officially themselves, while a psychologist quoted in the same piece argued that kind of recognition works better as a personal gesture than an organizational program."
      },
      {
        "question": "Is Boss's Day observed outside the United States?",
        "answer": "Yes, generally on the same October 16 date. It is also described as observed in Canada, India, Ireland, Australia, and the United Kingdom, though the sources tracking this do not break down which workplaces within those countries actually mark it."
      }
    ],
    "sources": [
      {
        "label": "Hallmark Corporate — National Boss Day",
        "url": "https://corporate.hallmark.com/holidays-occasions/national-boss-day/"
      },
      {
        "label": "Wikipedia — Boss's Day",
        "url": "https://en.wikipedia.org/wiki/Boss%27s_Day"
      },
      {
        "label": "U.S. News & World Report — 5 Reasons Boss's Day Is Total BS (Alison Green)",
        "url": "https://money.usnews.com/money/blogs/outside-voices-careers/2015/10/12/4-reasons-bosss-day-is-total-bs"
      },
      {
        "label": "SHRM — The Challenges of Showing Appreciation on Boss's Day",
        "url": "https://www.shrm.org/resourcesandtools/hr-topics/employee-relations/pages/the-challenges-of-showing-appreciation-on-boss-day.aspx"
      },
      {
        "label": "Digital Hygge — Boss's Day",
        "url": "https://digitalhygge.com/boss-day/"
      }
    ]
  },
  {
    "slug": "national-cat-day",
    "category": "Observances",
    "title": "National Cat Day: October 29, and Which Cat Holiday You Mean",
    "description": "National Cat Day falls on October 29 in the US, founded in 2005 by Colleen Paige. At least three other cat observances use similar names but different dates.",
    "updated": "2026-08-03",
    "coreSummary": "National Cat Day is a US observance held every October 29, founded in 2005 by pet lifestyle expert Colleen Paige to draw attention to shelter cats needing adoption. It is one of at least four differently dated, differently named cat observances in circulation, and is frequently confused with the others.",
    "dateRule": {
      "kind": "fixed",
      "text": "October 29 every year in the United States. No source describes a weekend-shift convention for this date.",
      "source": {
        "label": "National Day Calendar — National Cat Day, October 29",
        "url": "https://nationaldaycalendar.com/celebrations/national-cat-day-october-29"
      },
      "occurrences": [
        { "date": "2026-10-29", "weekday": "Thursday" },
        { "date": "2027-10-29", "weekday": "Friday" },
        { "date": "2028-10-29", "weekday": "Sunday" },
        { "date": "2029-10-29", "weekday": "Monday" },
        { "date": "2030-10-29", "weekday": "Tuesday" },
        { "date": "2031-10-29", "weekday": "Wednesday" }
      ],
      "caveat": "October 29 is the date for National Cat Day specifically, a US observance. It is not the only cat-themed observance on the calendar and gets confused with at least three others that use different dates and have different founders: International Cat Day (August 8, founded 2002 by the International Fund for Animal Welfare), Black Cat Appreciation Day (August 17, founded 2011 by Wayne H. Morris in the US), and National Black Cat Day (October 27, founded 2011 by the UK charity Cats Protection). Social posts and calendar aggregators routinely apply the wrong date or the wrong founding story to whichever one they happen to be writing about."
    },
    "founding": {
      "status": "documented",
      "text": "Colleen Paige, a pet and family lifestyle expert, founded National Cat Day in 2005. In her own stated mission, the goal was \"to help galvanize the public to recognize the number of cats that need to be rescued each year and also to encourage cat lovers to celebrate the cat(s) in their lives for the unconditional love and companionship they bestow upon us.\" Paige is a prolific founder of pet-themed US observances: she also created National Dog Day in 2004, plus National Puppy Day, National Mutt Day, National Wildlife Day, and National Beach Day, among others. Her account of founding Cat Day is repeated consistently, with the same name and year, by National Today, National Day Calendar, and Wikipedia; unlike this calendar's entry for National Boss's Day, Wikipedia's National Cat Day article carries no citation-needed tag on the founding claim. No source explains why she picked October 29 specifically, in contrast to National Dog Day, where she has stated the August 26 date marks the day her family adopted a shelter dog when she was a child. As with most observances on this calendar founded by a single private individual rather than a government body, there is no registration filing or trademark record available online to inspect independently; every account, including this one, is repeating Paige's own telling.",
      "source": {
        "label": "National Today — National Cat Day",
        "url": "https://nationaltoday.com/national-cat-day/"
      }
    },
    "sections": [
      {
        "heading": "What National Cat Day is",
        "body": [
          "National Cat Day is a US observance held on October 29, encouraging people to adopt shelter cats, support rescue organizations, and spend extra time with the cats they already have. It carries no legal status: no federal or state law recognizes it, government offices and banks run a normal schedule, and no day off is attached to it. In 2026 it falls on a Thursday.",
          "Like most observances on this calendar, it spreads mainly through social media and pet-brand marketing rather than through any civic or religious institution. Retailers and shelters use the date as a hook for adoption events and product promotions, which is a large part of how it has stayed visible since 2005."
        ]
      },
      {
        "heading": "Who started it, and why October 29",
        "body": [
          "The origin traces to one named person: Colleen Paige, a pet and family lifestyle expert, who founded National Cat Day in 2005. Her stated goal was to draw public attention to the number of cats that need rescuing each year, and to give cat owners a reason to celebrate the animals already in their homes.",
          "Paige did not stop at cats. She is also credited as the founder of National Dog Day (2004), National Puppy Day, National Mutt Day, National Wildlife Day, and National Beach Day, among other pet- and animal-themed US observances. That is a different pattern from [National Boss's Day](/national-bosses-day/), where Patricia Bays Haroski registered one specific day in 1958 and the record stops there. Paige's founding claims are, by the same standard applied throughout this calendar, still just one person's account: there is no registration filing, trademark record, or proclamation available online to check independently, even though National Today, National Day Calendar, and Wikipedia all repeat the same name and year without contradiction.",
          "One detail is notably absent: a stated reason for the October 29 date itself. For National Dog Day, Paige has said August 26 marks the day her family adopted a shelter dog when she was ten years old. No source carries an equivalent explanation for why Cat Day landed on October 29 rather than any other date."
        ]
      },
      {
        "heading": "Four cat days, four dates, four founders",
        "body": [
          "\"Cat day\" is not one observance; it is a name loosely shared by at least four of them, and calendar sites frequently mix up which date and origin story belongs to which.",
          "National Cat Day itself is the one covered on this page: October 29, US-only, founded by Colleen Paige in 2005. International Cat Day falls on August 8 and has an entirely separate, older institutional history: the International Fund for Animal Welfare (IFAW) created it in 2002, and in 2020 stewardship passed to International Cat Care, a UK-based nonprofit that has worked on feline welfare since 1958. Black Cat Appreciation Day, observed August 17 in the US, was founded in 2011 by Wayne H. Morris in memory of his sister and her black cat, Sinbad, who both died that year; Morris built it around dispelling superstitions that made black cats harder to place for adoption. National Black Cat Day, October 27 in the UK, was launched the same year, 2011, by the British charity Cats Protection, for a closely related reason: at launch, the charity's own data showed black and black-and-white cats took seven days longer on average to find a home than cats of other colors, a gap Cats Protection reported had narrowed to two days by 2019.",
          "Two of those four (the American Black Cat Appreciation Day and the British National Black Cat Day) share almost the same name, launched in the same year, for a similar adoption-equity reason, on dates two days apart. That is enough overlap that a reader searching for one can easily land on coverage of the other. The safest way to keep them straight is by founder and country: Paige for the US's general National Cat Day, IFAW/International Cat Care for the global August observance, Morris for the US black-cat day, and Cats Protection for the UK black-cat day."
        ]
      },
      {
        "heading": "The shelter numbers behind the adoption push",
        "body": [
          "Coverage of National Cat Day commonly cites shelter statistics to make the case for adoption, and the numbers in circulation do not agree with each other. Some blog posts state 6.3 million animals surrendered annually with 920,000 euthanized; others, covering the same day, cite 7.6 million surrendered and 2.7 million cats euthanized. Neither figure is attributed to a specific report in the articles that use it.",
          "The ASPCA's own current shelter statistics, current as of 2025, put the real numbers well below either of those recycled figures: 5.8 million dogs and cats entered US shelters and rescues that year, 3 million of them cats, and approximately 597,000 animals were euthanized in shelters, 277,000 of them cats. Those figures reflect a shelter system that has improved substantially since the older, larger numbers still being repeated on some observance pages were first published. Readers who want a current, sourced number for how many cats need adoption should use the ASPCA's own statistics page rather than a figure repeated from an uncredited older post, a caution that applies just as well to [National Coffee Day](/national-coffee-day/) and any other observance page that leans on a statistic to make its case."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is National Cat Day in 2026?",
        "answer": "Thursday, October 29, 2026. The date is fixed at October 29 every year in the United States and does not shift for weekends."
      },
      {
        "question": "Who founded National Cat Day?",
        "answer": "Colleen Paige, a pet and family lifestyle expert, founded it in 2005 to draw attention to shelter cats needing adoption. She has also founded several other pet-themed observances, including National Dog Day. No source documents why she chose October 29 specifically."
      },
      {
        "question": "Is National Cat Day the same as International Cat Day?",
        "answer": "No. International Cat Day falls on August 8 and was founded in 2002 by the International Fund for Animal Welfare, with stewardship passing to International Cat Care in 2020. National Cat Day falls on October 29 and was founded separately, in 2005, by Colleen Paige in the United States."
      },
      {
        "question": "Is National Cat Day the same as Black Cat Appreciation Day or National Black Cat Day?",
        "answer": "No, and those two are also not each other. Black Cat Appreciation Day (US) falls on August 17 and was founded in 2011 by Wayne H. Morris in memory of his sister and her cat, Sinbad. National Black Cat Day (UK) falls on October 27 and was launched the same year, 2011, by the charity Cats Protection to improve adoption rates for black cats. National Cat Day, the subject of this page, is a separate US observance on October 29."
      },
      {
        "question": "How many cats are in US shelters?",
        "answer": "According to the ASPCA's current shelter statistics, 3 million cats entered US shelters and rescues in 2025 out of 5.8 million companion animals total, and approximately 277,000 cats were euthanized that year. Older, unsourced figures still circulating on some observance pages (such as 2.7 million cats euthanized) are well above the ASPCA's current numbers."
      },
      {
        "question": "Is National Cat Day a federal holiday?",
        "answer": "No. It has no legal status. Government offices, banks, and most businesses operate on their normal schedule on October 29, and no time off is attached to the day."
      }
    ],
    "sources": [
      {
        "label": "National Today — National Cat Day",
        "url": "https://nationaltoday.com/national-cat-day/"
      },
      {
        "label": "National Day Calendar — National Cat Day, October 29",
        "url": "https://nationaldaycalendar.com/celebrations/national-cat-day-october-29"
      },
      {
        "label": "Wikipedia — National Cat Day",
        "url": "https://en.wikipedia.org/wiki/National_Cat_Day"
      },
      {
        "label": "Wikipedia — International Cat Day",
        "url": "https://en.wikipedia.org/wiki/International_Cat_Day"
      },
      {
        "label": "Catster — National Black Cat Appreciation Day",
        "url": "https://www.catster.com/lifestyle/national-black-cat-appreciation-day/"
      },
      {
        "label": "Cats Protection — The history of National Black Cat Day",
        "url": "https://www.cats.org.uk/cats-blog/history-of-national-black-cat-day"
      },
      {
        "label": "ASPCA — U.S. Animal Shelter Statistics",
        "url": "https://www.aspca.org/helping-shelters-people-pets/us-animal-shelter-statistics"
      },
      {
        "label": "AlphaPaw — National Dog Day, Founder Colleen Paige",
        "url": "https://learn.alphapaw.com/blog/august-26-is-national-dog-day-celebrate-with-founder-colleen-paige/"
      }
    ],
    "image": "/images/national-cat-day.jpg",
    "imageAlt": "Close-up of a grey and white cat with green eyes lying down and looking at the camera",
    "imageCredit": "Photo by [Mikhail Vasilyev](https://unsplash.com/photos/Z1YtN-kmHCI) on Unsplash, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cat_unsplash.jpg), CC0"
  },
  {
    "slug": "national-dog-day",
    "category": "Observances",
    "title": "National Dog Day: August 26, and Two Origin Stories That Don't Agree",
    "description": "National Dog Day falls on August 26, founded in 2004 by Colleen Paige. Her own organization's website gives two different, unreconciled reasons for why the day exists.",
    "updated": "2026-08-04",
    "coreSummary": "National Dog Day is a US observance held every August 26, founded in 2004 by pet lifestyle expert Colleen Paige. The founder's own organization gives two different reasons for it: her personal account says the date marks a childhood shelter adoption, while a 2013 New York State Senate resolution reproduced on the same website says the day was created over the uncredited service of search-and-rescue dogs at Ground Zero. Neither telling mentions the other.",
    "dateRule": {
      "kind": "fixed",
      "text": "August 26 every year in the United States. The date does not shift for weekends or weekdays.",
      "source": {
        "label": "National Dog Day (official site) — About",
        "url": "https://www.nationaldogday.com/about1"
      },
      "occurrences": [
        { "date": "2026-08-26", "weekday": "Wednesday" },
        { "date": "2027-08-26", "weekday": "Thursday" },
        { "date": "2028-08-26", "weekday": "Saturday" },
        { "date": "2029-08-26", "weekday": "Sunday" },
        { "date": "2030-08-26", "weekday": "Monday" },
        { "date": "2031-08-26", "weekday": "Tuesday" }
      ],
      "caveat": "Every source found agrees on August 26, including the founder's own site, a 2013 New York State Senate resolution, and every third-party calendar page checked. The one outlier is Wikipedia's own International Dog Day article, which lists August 26 in its infobox but states in its history section that \"the date, August 14, was chosen to mark the day her family adopted their first dog\" — an internal contradiction inside a single article, not evidence that August 14 is used anywhere else. Readers should treat August 26 as settled. Separately, \"National Dog Day\" is not the only dog-themed observance on the calendar: National Rescue Dog Day falls on May 20, and World Dog Day, founded in 2016 by the Vanderpump Dog Foundation, is held on a date in May that moves from year to year rather than staying fixed."
    },
    "founding": {
      "status": "documented",
      "text": "Colleen Paige, a pet and family lifestyle expert, founded National Dog Day in 2004. Her own site states the date is personal: August 26 is the day her family adopted her first dog, a Sheltie, from a local shelter when she was ten years old. That is the version repeated by nearly every third-party source checked, including AlphaPaw and UPI. But the same organization's website also reproduces a second, different account: New York State Senate Resolution J2656, sponsored by Senator Terry Gipson and adopted June 20, 2013, states that National Dog Day \"was created in response to a lack of acknowledgement about the selfless service of search and rescue dogs at Ground Zero.\" The resolution commemorates August 26, 2013 as that year's National Dog Day; it credits Paige as founder and repeats the 2004 date, but gives no reason at all for why August 26 specifically was chosen, and never mentions the childhood-adoption story. Neither document acknowledges the other's version. Paige also filed a federal trademark application for \"NATIONAL DOG DAY\" (U.S. Serial No. 78631456) on May 17, 2005, covering charitable fundraising services for dog adoption; records show the application drew a final refusal from the examining attorney in November 2006 and was formally abandoned in June 2007 for failure to respond. The ™ symbol displayed on the organization's website today reflects a common-law claim to the name, not a granted federal registration.",
      "source": {
        "label": "National Dog Day (official site) — About",
        "url": "https://www.nationaldogday.com/about1"
      }
    },
    "sections": [
      {
        "heading": "What National Dog Day is",
        "body": [
          "National Dog Day is a US observance held on August 26, built around adopting shelter dogs, supporting rescue organizations, and appreciating the dogs people already have. It carries no legal status: no federal law recognizes it, government offices and banks run their normal schedule, and no time off is attached to it. In 2026 it falls on a Wednesday.",
          "It spreads mainly through social media posts, pet-brand marketing, and shelter adoption drives rather than through any civic institution. A New York State Senate resolution gave it a brief moment of formal government attention in 2013, but that recognition stopped at the state legislative level and was never picked up federally."
        ]
      },
      {
        "heading": "The date: August 26, with one source confusing itself",
        "body": [
          "August 26 is fixed and does not move for weekends. The founder's own site gives that date, a 2013 New York State Senate resolution names that date, and every general calendar and pet-brand page checked for this article agrees.",
          "The one inconsistency found sits inside a single Wikipedia article. Wikipedia's \"International Dog Day\" page uses that date, August 26, in its infobox, but its history section states that \"the date, August 14, was chosen to mark the day her family adopted their first dog.\" No other source anywhere repeats August 14; it reads as a copy-editing slip inside one article rather than a second date genuinely in circulation. It is included here only because catching exactly this kind of quiet inconsistency, rather than repeating whichever number a source happens to print first, is the point of this calendar."
        ]
      },
      {
        "heading": "Who started it, and two accounts of why",
        "body": [
          "The founder is not in dispute: Colleen Paige, a pet and family lifestyle expert, created National Dog Day in 2004. What is unusual is that her own organization's website presents two different, non-overlapping explanations for it, on two different pages, with neither one mentioning the other.",
          "The version that spreads furthest is personal. National Dog Day's About page states that Paige chose August 26 because it is the day her family adopted her first dog, a Sheltie, from a local animal shelter, when she was ten years old. AlphaPaw, UPI, and most general calendar sites repeat this account, sometimes word for word.",
          "The second version comes from New York State Senate Resolution J2656, sponsored by Senator Terry Gipson and adopted June 20, 2013, commemorating August 26, 2013 as National Dog Day statewide. Its text, which is reproduced in full on National Dog Day's own legislation page, states that the observance \"was created in response to a lack of acknowledgement about the selfless service of search and rescue dogs at Ground Zero.\" That is a civic, tribute-driven motivation with no connection to a childhood pet. The resolution credits Paige and the 2004 founding date, so it is describing the same observance, but it gives no explanation at all for why August 26 was the date chosen, and it never references the Sheltie story that appears one click away on the same organization's site.",
          "Both accounts could be true at once; a founder can have more than one reason for starting something. What is notable is that the organization itself has never reconciled them into one story, and that almost every outside source that covers National Dog Day repeats only the personal account, leaving the resolution's Ground Zero framing to sit unread on a legislation page most visitors never open."
        ]
      },
      {
        "heading": "A trademark that was applied for, then abandoned",
        "body": [
          "The National Dog Day website displays the phrase \"National Dog Day™\" with a trademark symbol and a copyright notice reading \"©2004-2026 National Dog Day. All Rights Reserved.\" That presentation reads as an active, registered trademark.",
          "The U.S. Patent and Trademark Office's own record tells a different story. Colleen M. Paige filed a federal trademark application for NATIONAL DOG DAY, serial number 78631456, on May 17, 2005, for \"charitable fundraising services for promoting adoption, compassion education and public awareness of homeless dogs.\" The application drew office actions in December 2005 and May 2006, received a final refusal in November 2006, and was recorded as abandoned for failure to respond on June 7, 2007. There is no record of a later, successful application replacing it.",
          "That means the ™ symbol on the site today represents what trademark law calls a common-law claim, an assertion of use rather than a government-granted registration. It is a real and legally meaningful distinction, and it is the kind of detail that a page built from the organization's own promotional copy would never surface on its own."
        ]
      },
      {
        "heading": "National, international, or something else entirely",
        "body": [
          "\"National Dog Day\" and \"International Dog Day\" are not two different holidays the way National Cat Day and International Cat Day are. They are the same August 26 event, founded by the same person in the same year, referred to by two different names. Wikipedia's own article opens by defining them as interchangeable: \"International Dog Day or National Dog Day is an annual observance held on August 26.\" Unlike [International Cat Day](/national-cat-day/), which has its own separate founding by the International Fund for Animal Welfare in 2002, there is no distinct international body behind an \"International\" version of Dog Day. The word appears to be a rebrand applied by some sites, not a second observance.",
          "Real distinct dog-themed observances do exist elsewhere on the calendar. World Dog Day, founded in 2016 by the Vanderpump Dog Foundation in West Hollywood, California, is held in May on a date that moves year to year (Saturday, May 17 in 2025) rather than staying fixed, and it centers specifically on discouraging purchases from breeders in favor of shelter adoption. National Rescue Dog Day falls on May 20. International Homeless Animals Day, run by a different set of animal welfare organizations, falls on the third Saturday in August, close enough to National Dog Day on the calendar that the two get confused despite having separate founders and separate purposes."
        ]
      },
      {
        "heading": "The shelter numbers behind the adoption push",
        "body": [
          "New York's 2013 resolution states that \"approximately one million dogs have been saved through adoptions nationwide\" since National Dog Day's 2004 founding. No source is cited for that figure inside the resolution, and no independent count of adoptions attributable specifically to this observance appears to exist anywhere; it reads as a promotional estimate rather than a measured statistic.",
          "For a current, sourced number, the ASPCA's own shelter statistics, current as of 2025, report that 2.8 million dogs entered US shelters and rescues that year, about 2 million were adopted, and approximately 320,000 were euthanized. Those figures come from an organization that publishes and updates its methodology, which is more than can be said for the resolution's decade-plus-old round number. The same caution about unattributed statistics applies to the shelter figures cited on [National Cat Day](/national-cat-day/): a specific, sourced number from an organization that shows its work is worth more than a bigger number nobody can trace."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is National Dog Day in 2026?",
        "answer": "Wednesday, August 26, 2026. The date is fixed at August 26 every year and does not shift for weekends."
      },
      {
        "question": "Who founded National Dog Day?",
        "answer": "Colleen Paige, a pet and family lifestyle expert, founded it in 2004. Her organization's own website gives two different, unreconciled reasons for it: a personal account that August 26 marks the day her family adopted a shelter dog when she was ten, and a 2013 New York State Senate resolution stating the day was created to recognize search-and-rescue dogs at Ground Zero. Neither document mentions the other."
      },
      {
        "question": "Is National Dog Day trademarked?",
        "answer": "The organization's website displays a ™ symbol, but U.S. Patent and Trademark Office records show the federal application (Serial No. 78631456), filed in 2005, received a final refusal in 2006 and was abandoned in 2007 for failure to respond. No later successful application has been found, so the ™ reflects a common-law claim rather than a granted federal registration."
      },
      {
        "question": "Is National Dog Day the same as International Dog Day?",
        "answer": "Effectively yes. Both names refer to the same August 26 observance founded by Colleen Paige in 2004; Wikipedia's own article defines them as interchangeable. This differs from International Cat Day, which has a genuinely separate founding history through the International Fund for Animal Welfare."
      },
      {
        "question": "What's the difference between National Dog Day, World Dog Day, and National Rescue Dog Day?",
        "answer": "All three promote dog adoption but are separate observances. National Dog Day is August 26, founded 2004 by Colleen Paige. World Dog Day falls in May on a date that moves year to year, founded in 2016 by the Vanderpump Dog Foundation. National Rescue Dog Day falls on May 20. A fourth, International Homeless Animals Day, falls on the third Saturday in August under different organizers."
      },
      {
        "question": "How many dogs are in US shelters right now?",
        "answer": "According to the ASPCA's current shelter statistics, 2.8 million dogs entered US shelters and rescues in 2025, about 2 million were adopted, and approximately 320,000 were euthanized. A 2013 New York State resolution's claim of \"approximately one million dogs saved through adoptions\" since 2004 is not tied to any cited source."
      }
    ],
    "sources": [
      {
        "label": "National Dog Day (official site) — About",
        "url": "https://www.nationaldogday.com/about1"
      },
      {
        "label": "National Dog Day (official site) — Legislation",
        "url": "https://www.nationaldogday.com/legislation"
      },
      {
        "label": "New York State Senate — Resolution J2656 (2013), National Dog Day",
        "url": "https://www.nysenate.gov/legislation/resolutions/2013/2013-j2656"
      },
      {
        "label": "Justia Trademarks — NATIONAL DOG DAY, Serial No. 78631456",
        "url": "https://trademarks.justia.com/786/31/national-dog-day-78631456.html"
      },
      {
        "label": "Wikipedia — International Dog Day",
        "url": "https://en.wikipedia.org/wiki/International_Dog_Day"
      },
      {
        "label": "ASPCA — U.S. Animal Shelter Statistics",
        "url": "https://www.aspca.org/helping-shelters-people-pets/us-animal-shelter-statistics"
      },
      {
        "label": "City of West Hollywood — World Dog Day 2025",
        "url": "https://www.weho.org/Home/Components/News/News/11660/1400"
      },
      {
        "label": "AlphaPaw — National Dog Day, Founder Colleen Paige",
        "url": "https://learn.alphapaw.com/blog/august-26-is-national-dog-day-celebrate-with-founder-colleen-paige/"
      }
    ],
    "image": "/images/national-dog-day.jpg",
    "imageAlt": "Close-up portrait of a golden retriever puppy lying in grass, looking to the side",
    "imageCredit": "Photo by Camilo Arango, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Golden_Retriever_puppy.jpg), CC BY-SA 3.0"
  },
  {
    "slug": "december-birthstone",
    "category": "Birthstones",
    "title": "December Birthstone: Turquoise, Zircon, and Tanzanite",
    "description": "December's three official birthstones are turquoise, blue zircon, and tanzanite — not blue topaz, despite how often retailers market it as one.",
    "published": "2026-08-04",
    "updated": "2026-08-04",
    "coreSummary": "December's three official birthstones — turquoise, blue zircon, and tanzanite — were assembled by trade organizations across three separate revisions: turquoise carried over from ancient tradition when the modern US list was first adopted in 1912, zircon was added in 1952, and tanzanite was added in 2002. Blue topaz is heavily marketed by jewelry retailers as a fourth December birthstone, but Jewelers of America's own current list has never included it.",
    "sections": [
      {
        "heading": "December's three official birthstones",
        "body": [
          "Jewelers of America, the trade association that has maintained the US birthstone list since 1912, currently names exactly three official birthstones for December: turquoise, tanzanite, and blue zircon. That is the complete list on the organization's own gift guide page — no fourth stone appears on it.",
          "Search for \"december birthstone\" anywhere online, though, and blue topaz shows up constantly, often presented as if it carries the same official standing as the other three. It doesn't. Blue topaz's cool, wintry tone happens to match the palette of December's real birthstones, and large retailers — Blue Nile, Kay, JCPenney, and Gabriel & Co. among them — have built entire product lines marketing it as \"the December birthstone.\" None of that marketing changes what is actually on Jewelers of America's list. A page repeating that blue topaz is official is repeating retail copy, not the trade group's own record."
        ]
      },
      {
        "heading": "Turquoise: the one stone here with an actual ancient pedigree",
        "body": [
          "Turquoise is the only December birthstone that predates the whole idea of an official US list. Egyptian tombs dating to roughly 3000 BCE contain turquoise jewelry, and King Tutankhamun's burial mask is set with it; the oldest known turquoise mines sit in Egypt's Sinai Peninsula, near a temple dedicated to the goddess Hathor. Egyptians called the stone mefkat, meaning \"joy\" and \"delight.\"",
          "Ancient Persia treated the stone just as seriously. Persians called it pirouzeh, meaning \"victory,\" set it into palace decoration for its sky-blue color, and believed a turquoise would change color to warn its wearer of approaching danger. The English name arrived later and secondhand: \"turquoise\" comes from the French pierre tourques, \"Turkish stone,\" because Turkish merchants were the ones who carried it into Europe along 13th-century Silk Road trade routes — the stone itself was never mined in Turkey.",
          "A separate, unrelated turquoise tradition developed in the American Southwest, where Indigenous peoples mined the stone long before European contact and used it in ceremonial and protective objects. The now-familiar silver-and-turquoise jewelry style associated with Navajo artisans is more recent than the mining tradition itself: it dates to the 1880s, when a trader is credited with encouraging Navajo silversmiths to begin working turquoise into silver settings.",
          "Because turquoise was already established as a birthstone through centuries of separate folk traditions, it didn't need a 20th-century trade group to add it to any list — it was simply carried over when one got written down."
        ]
      },
      {
        "heading": "Zircon: added in 1952, and its blue color mostly comes from one province in Cambodia",
        "body": [
          "Zircon the mineral is genuinely ancient — geologists have dated microscopic zircon crystals from the Jack Hills region of Western Australia to as old as roughly 4.4 billion years, the oldest material yet identified as originating on Earth. That finding is about zircon's use in dating rock formations, though, not about the gem-grade crystals cut into December birthstone jewelry; those come from unrelated, far younger deposits, chiefly in Cambodia and historically Sri Lanka. Colorless zircon from Sri Lanka was once traded under the name \"Matara zircon,\" after the Sri Lankan town near where it was mined.",
          "Most of the blue zircon sold today owes its color to a single Cambodian province, Ratanakiri, near the borders with Laos and Vietnam. The rough stone comes out of the ground brown; heating it — the International Colored Gemstone Association describes the exact temperatures as a closely held trade secret — turns it blue. The ICA calls Ratanakiri \"the world's only deposit of material used to create such rich blue zircon,\" which makes December's blue zircon considerably more geographically concentrated than either of the month's other two stones.",
          "Zircon's high refractive index gives it real brilliance and fire, historically close enough to diamond's that it was used as a cheaper substitute — a reputation that later got tangled up with cubic zirconia, a lab-made material with a similar name but no mineral relationship to zircon at all. Zircon joined the official December list in 1952, in the same trade-group revision that added alexandrite to June, citrine to November, and pink tourmaline to October. Sources disagree on exactly which body carried out that 1952 revision: some accounts attribute it directly to Jewelers of America's own predecessor association, while others name a separate group, the Jewelry Industry Council of America. This piece did not find a primary document that settles which is correct."
        ],
        "image": {
          "src": "/images/december-birthstone-zircon.jpg",
          "alt": "Bi-pyramidal zircon crystal specimen from Mont Saint-Hilaire, Quebec",
          "credit": "Photo by Modris Baum, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Zircon-192914.jpg), public domain"
        }
      },
      {
        "heading": "Tanzanite: the newest addition, and still found in exactly one place on Earth",
        "body": [
          "Tanzanite is by far the youngest of December's three birthstones, in every sense. According to the Gemological Institute of America, a Maasai herder came across a cluster of transparent violet-to-blue crystals in the Merelani Hills, at the foot of Mount Kilimanjaro in northern Tanzania, in 1967, and alerted a prospector, Manuel d'Souza, who registered mining claims on the site. The stone turned out to be a blue-violet variety of the mineral zoisite; rough crystals pulled from the ground are typically a dull brown and only reveal their blue-violet color after heat treatment.",
          "Tiffany & Co. became the gem's principal distributor and gave it its name: vice president Henry B. Platt named it tanzanite, after the country where it was found, and the company launched a publicity campaign built around the new stone in 1968. A 122.7-carat tanzanite from that deposit is now held by the Smithsonian's National Museum of Natural History.",
          "Nearly six decades later, the Merelani Hills remain the only known commercial source of tanzanite anywhere in the world — no other deposit has been found. The American Gem Trade Association added tanzanite to the official December birthstone list in 2002, fifty years after the previous revision, making it an additional option alongside turquoise and zircon rather than a replacement for either."
        ],
        "image": {
          "src": "/images/december-birthstone-tanzanite.jpg",
          "alt": "Trichroic tanzanite gemstone showing blue, violet, and purple faces",
          "credit": "Photo by Chromalys (DanBalance), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Trichroic_Tanzanite_Gem_-_blue,_violet_%26_purple.jpg), CC BY-SA 4.0"
        }
      },
      {
        "heading": "Where the official list actually came from",
        "body": [
          "The US birthstone list traces back to a single meeting: in 1912, the American National Retail Jewelers Association — the organization now known as Jewelers of America — met in Kansas City and adopted a standardized list, aiming to settle the many competing folk birthstone traditions that had accumulated across centuries into one list retailers could use consistently. Turquoise entered December's slot at that point, carried over from its older traditions rather than newly assigned.",
          "The list has been revised only a handful of times since. In 1952, a trade-industry update added zircon to December along with new stones for three other months. In 2002, the American Gem Trade Association added tanzanite to December, the list's first change to any month in fifty years. Most recently, in 2016, the American Gem Trade Association and Jewelers of America jointly added spinel to August, showing that the same small set of trade groups is still actively willing to revise the list rather than treating it as fixed.",
          "Blue topaz has never gone through that process. It shows up in retailer catalogs because it happens to look the part, not because any trade group ever voted it onto the list — which is a different kind of gap from the disputed founding stories behind observance days on this calendar. [National Dog Day](/national-dog-day/)'s origin comes down to one person's word against her own organization's paperwork; December's birthstone list, by contrast, has a dated, attributable paper trail for almost every change made to it. The one piece that's murky is who exactly carried out the 1952 revision — everything else about who added what, and when, is on the record."
        ]
      },
      {
        "heading": "Choosing among three real options",
        "body": [
          "For anyone shopping by birth month rather than by observance — the same instinct that drives gift-giving around a manufactured single day like [National Boyfriend Day](/national-boyfriend-day/) — December actually offers three legitimately different official stones, not one default choice. Turquoise is the most widely available and least expensive of the three, and the only one with a documented history stretching back thousands of years. Zircon offers a diamond-rivaling brilliance at a fraction of the cost, though nearly all of the blue supply traces back to that single Cambodian province. Tanzanite is the rarest and priciest of the three, and the only one where the entire world's known supply comes from one hillside in Tanzania. Checking which of the three a piece of jewelry actually is — rather than assuming \"blue stone in December\" automatically means birthstone-correct — is worth doing before a birthday purchase, the same way it's worth checking whether an occasion like [National Grandparents Day](/national-grandparents-day/) has a real founding story behind it or just a marketing one."
        ]
      }
    ],
    "faq": [
      {
        "question": "What are December's official birthstones?",
        "answer": "Turquoise, blue zircon, and tanzanite, per Jewelers of America's current birthstone list. All three appear on the trade association's own gift guide with no fourth stone listed."
      },
      {
        "question": "Is blue topaz a December birthstone?",
        "answer": "Not officially. Retailers market it heavily as a December birthstone because its cool blue tone matches the month's other stones, but it has never been added to Jewelers of America's official list, which names only turquoise, zircon, and tanzanite."
      },
      {
        "question": "When was tanzanite added as a December birthstone?",
        "answer": "In 2002, when the American Gem Trade Association added it to the official list as an additional December stone alongside turquoise and zircon — the list's first change to any month in fifty years."
      },
      {
        "question": "Why does December have three birthstones instead of one?",
        "answer": "Because two later revisions (1952 and 2002) added stones on top of the original 1912 list rather than replacing what was already there. Several other months picked up extra stones through the same kind of revisions — most recently August, which gained spinel alongside peridot in 2016."
      },
      {
        "question": "Where does tanzanite come from?",
        "answer": "Exclusively the Merelani Hills at the foot of Mount Kilimanjaro in Tanzania, discovered in 1967. It remains the only known commercial source of tanzanite anywhere in the world."
      },
      {
        "question": "Why is December's zircon usually a specific shade of blue?",
        "answer": "Most of it starts out brown and is heat-treated to turn blue. Nearly all of that treated rough comes from Ratanakiri province in Cambodia, which the International Colored Gemstone Association describes as the world's only deposit of material capable of producing that rich blue color."
      }
    ],
    "sources": [
      {
        "label": "Jewelers of America — Birthstone Jewelry Guide",
        "url": "https://www.jewelers.org/gift-guides/birthstone-jewelry-guide"
      },
      {
        "label": "National Jeweler — Rocks On: The Evolution of the Birthstone List",
        "url": "https://nationaljeweler.com/articles/5278-rocks-on-the-evolution-of-the-birthstone-list"
      },
      {
        "label": "GIA — December Birthstones",
        "url": "https://www.gia.edu/birthstones/december-birthstones"
      },
      {
        "label": "GIA — Tanzanite History and Lore",
        "url": "https://www.gia.edu/tanzanite-history-lore"
      },
      {
        "label": "GIA — Zircon",
        "url": "https://www.gia.edu/zircon"
      },
      {
        "label": "American Gem Society — History of Turquoise",
        "url": "https://www.americangemsociety.org/birthstones/december-birthstones/history-of-turquoise/"
      },
      {
        "label": "International Colored Gemstone Association — Blue Zircon (Cambolite)",
        "url": "https://www.gemstone.org/blue-zircon-cambolite"
      },
      {
        "label": "Live Science — Confirmed: Oldest Fragment of Early Earth Is 4.4 Billion Years Old",
        "url": "https://www.livescience.com/43584-earth-oldest-rock-jack-hills-zircon.html"
      },
      {
        "label": "IAJA — Four Gemstones Introduced by Tiffany & Co.",
        "url": "https://iaja.com/2024/10/16/four-gemstones-introduced-by-tiffany-co/"
      }
    ],
    "image": "/images/december-birthstone-turquoise.jpg",
    "imageAlt": "Sky-blue turquoise microcrystals covering a rock matrix",
    "imageCredit": "Photo by Rob Lavinsky, iRocks.com, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Turquoise-216415.jpg), CC BY-SA 3.0"
  },
  {
    "slug": "virgo-dates",
    "category": "Zodiac Dates",
    "title": "Virgo Dates: August 23–September 22, in Three Systems",
    "description": "Virgo runs August 23–September 22 in Western tropical astrology. Sidereal astrology and the actual constellation boundaries each draw a different line.",
    "published": "2026-08-05",
    "updated": "2026-08-05",
    "coreSummary": "Western tropical astrology, the system behind virtually every horoscope column and app, places Virgo from August 23 to September 22, though the exact boundary can land a day earlier or later depending on the year. Vedic sidereal astrology, built on a different reference point, puts Virgo roughly a month later, around September 17 to October 16. The actual astronomical constellation the sign borrows its name from holds the Sun longer still, from about September 16 to October 30. All three ranges are correctly stated by their own rules; there is no single authority whose ruling overrides the other two.",
    "sections": [
      {
        "heading": "The range almost every horoscope site quotes",
        "body": [
          "Ask any astrology publisher for Virgo's dates and the answer comes back the same: August 23 to September 22. Britannica states it that way, \"considered as governing the period from about August 23 to about September 22,\" and so do AstroStyle, Farmers' Almanac, Horoscope.com, and Astrology.com, none of which cites the others or a common source. The consistency looks like consensus because, in a narrow sense, it is one: everyone using the tropical zodiac runs the same underlying calculation and lands on the same days.",
          "What's missing is anything resembling the paper trail behind, say, [December's birthstone list](/december-birthstone/), which traces to a named trade group's 1912 meeting and two dated revisions after that. Nobody voted on Virgo's dates. No proclamation set them. They fall out of a mathematical definition: the tropical zodiac splits the solar year into twelve equal 30-degree arcs, starting from 0 degrees at the spring equinox, and Virgo is simply the sixth arc, running from 150 to 180 degrees of tropical longitude. The calendar dates are a byproduct of where the Sun happens to be on the days the Earth crosses those angles, not something anyone declared."
        ]
      },
      {
        "heading": "Why the boundary doesn't land on the same day every year",
        "body": [
          "Astrology sites that mention it at all describe the Virgo start date as \"usually\" August 23, occasionally August 22. That's not sloppiness; it's a real feature of the calendar math. The tropical zodiac's zero point, the spring equinox, doesn't fall at the same clock time each year. That's a consequence of the mismatch between Earth's actual orbital period (about 365.2422 days) and the 365-day calendar year: the equinox arrives roughly six hours later each year, then jumps back by about eighteen hours whenever a leap day resets the count. That same six-hour wobble propagates forward through the year to every other 30-degree boundary the tropical zodiac defines, Virgo's included, which is why the exact moment the Sun crosses into Virgo can fall late on August 22 in one year's local time zone and early on August 23 the next.",
          "The shift is small and it doesn't accumulate: the leap-year correction resets it on a roughly four-year cycle rather than letting it drift indefinitely. But it means a page that states \"Virgo is August 23 to September 22, no exceptions\" is rounding off a boundary that, strictly, moves by up to a day depending on the year and the time zone doing the counting."
        ]
      },
      {
        "heading": "Born right on the edge",
        "body": [
          "That day-to-day wobble is exactly why cusp dates exist as a real question and not just an astrology-column cliché. Someone born on August 22, 23, or 24 (or September 21, 22, or 23 at the other end) can't settle which sign they fall under from a generic date range alone. The answer depends on the exact hour the Sun crossed 150 or 180 degrees in the specific year they were born, measured against their specific time zone. A person born at 11 p.m. on August 22, 2003 in one part of the world could be Leo; someone born four hours later at 3 a.m. the same night, in a time zone three hours east, could already be Virgo.",
          "The only way to resolve it is to check an ephemeris, a table of the Sun's exact position for that date, time, and location, rather than trust a calendar page, this one included. General-purpose date ranges like the one at the top of this page are accurate for the overwhelming majority of readers and unreliable for the small slice born within roughly a day of either boundary."
        ]
      },
      {
        "heading": "A different Virgo entirely: sidereal astrology",
        "body": [
          "Everything above describes the tropical zodiac, the system behind Western horoscope astrology. Vedic astrology, practiced across South Asia, uses a sidereal zodiac instead, and it assigns Virgo, called Kanya rashi, to a noticeably later stretch of the calendar, commonly cited as around September 17 to October 16. Sources on the sidereal side don't fully agree with each other either: some Vedic astrology references give September 16 as the start, others September 18, a day-or-two spread that mirrors the tropical system's own cusp uncertainty rather than resolving it.",
          "The gap between the two systems traces back to a single astronomical phenomenon: precession, the slow 25,800-year wobble of Earth's rotational axis, first described mathematically by the Greek astronomer Hipparchus around 127 BCE. Tropical astrology anchors itself to the seasons and ignores precession by design, resetting to 0 degrees Aries at the equinox every year regardless of which stars sit behind the Sun. Sidereal astrology does the opposite, tracking the actual background stars, and India's most widely used reference point for that calculation, the Lahiri ayanamsha, currently puts the two systems about 24 degrees apart, a gap that grows by roughly one degree every 72 years. That 24-degree offset is almost exactly the width of a zodiac sign, which is why sidereal Virgo lands nearly a full month after tropical Virgo instead of a few days off."
        ]
      },
      {
        "heading": "What astronomers actually see in the sky",
        "body": [
          "There's a third answer, and it comes from ignoring astrology's rules altogether. In 1930 the International Astronomical Union drew fixed, irregular boundaries around all 88 constellations, including the pattern of stars actually named Virgo, using boundaries based on the stars' real positions rather than equal 30-degree divisions. According to EarthSky, for the period from roughly 1990 to 2062, the Sun passes through the actual constellation Virgo from about September 16 to October 30, a 44-day stretch. Sky & Telescope notes that this makes Virgo the constellation the Sun spends the most time crossing of any on the zodiac: more than 40 days, compared with roughly a week for Scorpius, because the IAU's boundaries were never drawn to give each constellation an equal share of the ecliptic.",
          "None of this makes the astronomical dates the \"real\" ones and the astrological dates fake. They're answering different questions. The tropical zodiac asks where the Sun sits in the solar year, which is why it resets cleanly at the equinoxes and solstices; the IAU boundaries ask which named group of stars a point in the sky falls inside, a question that has nothing to do with seasons and produces wildly uneven answers: Scorpius holding the Sun for a week, Virgo for more than six. A reader who's heard NASA \"added a 13th sign\" (Ophiuchus, wedged between Scorpius and Sagittarius) is really hearing about this same 1930 boundary-drawing exercise, decades old and unrelated to any new discovery."
        ]
      },
      {
        "heading": "Where the twelve-way division came from",
        "body": [
          "The habit of splitting the sky into twelve equal 30-degree signs originated with Babylonian astronomers in Mesopotamia, working out of temple observatories, who had settled on the scheme by around the 5th century BCE. Greek astronomers adopted it within decades of it reaching them, and the tropical version, tying the twelve signs to the equinoxes and solstices rather than to fixed stars, became the standard framing of the discipline through Ptolemy's Tetrabiblos in the 2nd century CE, the text most responsible for cementing the version of the zodiac still used in Western astrology today.",
          "That history means there's no equivalent to a founding date the way most entries on this calendar have one, or conspicuously lack one. [National Dog Day](/national-dog-day/), for instance, traces to a single named founder and a specific year, even where her account can't be independently verified. Virgo's date range has no such moment: it's the accumulated output of a mathematical convention refined across several centuries by multiple cultures, with no trade group, government body, or individual ever signing off on August 23 specifically. Like the four differently named, differently founded observances covered on [this calendar's Cat Day page](/national-cat-day/), \"Virgo's dates\" turns out to mean at least three different things depending on which system is doing the asking."
        ]
      },
      {
        "heading": "What the tropical system also assigns to Virgo",
        "body": [
          "Within the tropical framework, Virgo carries a small set of standard classifications that go back to the same ancient system as the dates: it's represented by the Virgin or Maiden, traditionally shown carrying a sheaf of wheat, ruled by the planet Mercury, and categorized as a Mutable Earth sign. Earth is its element, Mutable its modality, the same pairing used for the sign changes that fall in the final month of a season. Those are classifications the tropical system assigns as part of its own internal structure, not independent claims about anyone born in the date range.",
          "One thing the tropical system does not supply is an official birthstone. Unlike the monthly birthstone list, which traces to Jewelers of America's 1912 meeting and two documented revisions since, there's no comparable trade authority assigning stones to zodiac signs. Retailers list sapphire, peridot, or carnelian as \"the\" Virgo stone depending on which site is asked, with none of them citing a governing body behind the claim."
        ]
      }
    ],
    "faq": [
      {
        "question": "What are the official dates for Virgo?",
        "answer": "In Western tropical astrology, the system behind most horoscope columns and apps, Virgo runs from August 23 to September 22. That's the range Britannica and every major astrology publisher cite, though the exact start can shift to August 22 in some years depending on the calendar's leap-year cycle."
      },
      {
        "question": "Why do some sources say Virgo starts on August 22 instead of August 23?",
        "answer": "Because the tropical zodiac's boundaries are pinned to the equinoxes, and the exact moment an equinox falls drifts by roughly six hours later each year before a leap day resets it. That same drift shifts every other 30-degree sign boundary by up to a day, Virgo's start included, so which calendar date is correct depends on the specific year and time zone."
      },
      {
        "question": "What if I was born right on the boundary (August 22–24 or September 21–23)?",
        "answer": "A generic date range can't settle it. The Sun crosses into or out of Virgo at a specific hour each year, and whether a birth falls before or after that moment depends on the exact birth time and time zone, not just the date. Resolving a genuine cusp birth requires checking an ephemeris for that year, not reading a calendar page."
      },
      {
        "question": "Are Virgo's dates the same in every astrology system?",
        "answer": "No. Vedic sidereal astrology assigns Kanya (Virgo) to roughly September 17–October 16, about a month later than the Western tropical range, because it tracks the actual background stars rather than the equinox. The two systems are currently about 24 degrees apart, a gap caused by the precession of Earth's axis and growing by about one degree every 72 years."
      },
      {
        "question": "Does the actual constellation Virgo match the astrology sign's dates?",
        "answer": "Not closely. Per EarthSky, for the period from roughly 1990 to 2062, the Sun passes through the astronomical constellation Virgo from roughly September 16 to October 30, a 44-day span, the longest of any zodiacal constellation, because the International Astronomical Union's 1930 constellation boundaries were drawn around the stars' actual positions rather than in equal 30-degree slices."
      },
      {
        "question": "Who decided Virgo's dates? Is there an official governing body?",
        "answer": "No single body. The twelve equal-sign system originated with Babylonian astronomers by around the 5th century BCE, was adopted by Greek astronomers soon after, and was cemented in its tropical form by Ptolemy's Tetrabiblos in the 2nd century CE. It's the product of a centuries-long mathematical convention, not a ruling anyone made on a specific date."
      }
    ],
    "sources": [
      {
        "label": "Britannica — Zodiac",
        "url": "https://www.britannica.com/topic/zodiac"
      },
      {
        "label": "Britannica — Virgo",
        "url": "https://www.britannica.com/place/Virgo"
      },
      {
        "label": "Wikipedia — Virgo (astrology)",
        "url": "https://en.wikipedia.org/wiki/Virgo_(astrology)"
      },
      {
        "label": "EarthSky — Sun enters Virgo on September 16",
        "url": "https://earthsky.org/astronomy-essentials/sun-passes-out-of-leo-and-into-virgo/"
      },
      {
        "label": "Sky & Telescope — A Sign of the Times",
        "url": "https://skyandtelescope.org/astronomy-news/observing-news/a-sign-of-the-times/"
      },
      {
        "label": "Space.com — What's your zodiac sign? (It may not be what you think it is)",
        "url": "https://www.space.com/zodiac-sign-astrology-astronomy"
      },
      {
        "label": "TIME — Where Do Zodiac Signs Come From?",
        "url": "https://time.com/5315377/are-zodiac-signs-real-astrology-history/"
      },
      {
        "label": "AstroStyle — Virgo Dates",
        "url": "https://astrostyle.com/astrology/virgo-dates/"
      },
      {
        "label": "Farmers' Almanac — Virgo Zodiac Sign",
        "url": "https://www.farmersalmanac.com/virgo-zodiac-sign"
      }
    ],
    "image": "/images/virgo-dates-uranias-mirror.jpg",
    "imageAlt": "Hand-colored 1825 star chart of the Virgo constellation from Urania's Mirror, showing the Maiden holding a sheaf of wheat",
    "imageCredit": "Sidney Hall, plate from [Urania's Mirror](https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Virgo.jpg) (1825), Library of Congress via Wikimedia Commons, public domain"
  },
  {
    "slug": "march-birthstone",
    "category": "Birthstones",
    "title": "March Birthstone: Aquamarine and Bloodstone",
    "description": "March's birthstone is aquamarine on Jewelers of America's current chart. GIA and the American Gem Society both also list bloodstone as a second option.",
    "published": "2026-08-05",
    "updated": "2026-08-05",
    "coreSummary": "March is commonly described as having two birthstones, aquamarine and bloodstone, and GIA and the American Gem Society both present it that way, but Jewelers of America's own current chart names only aquamarine. The two stones swapped which one was listed as primary in a 1952 revision to the list Jewelers of America's predecessor created in 1912.",
    "sections": [
      {
        "heading": "How many birthstones does March actually have?",
        "body": [
          "Ask which birthstones belong to March and most sources give the same two-word answer: aquamarine and bloodstone. The Gemological Institute of America's page on the subject opens by describing \"Aquamarine and bloodstone, March's two birthstones.\" The American Gem Society covers both stones in comparable depth on its own site, under the heading \"March Birthstones: Aquamarine and Bloodstone.\"",
          "Jewelers of America tells a narrower story. The organization is the direct descendant of the 1912 meeting that created the official U.S. birthstone list, and its own current chart of monthly birthstones names exactly one stone for March: aquamarine. Bloodstone doesn't appear on that chart at all, not as a second choice and not as a footnote.",
          "That's not a case of the chart listing one stone per month across the board, so a reader shouldn't assume March is simply being treated like every other month. The same page lists three stones for June (pearl, moonstone, and alexandrite), two for August (peridot and spinel), and three for December (turquoise, tanzanite, and blue zircon). March's single-stone entry stands out against that pattern rather than fitting it.",
          "The International Gem Society splits the difference by calling aquamarine the \"modern\" birthstone and bloodstone the \"traditional\" one, treating both as legitimate but rooted in different eras of the list. That framing tracks with how the list actually took shape, which is a longer story than any single chart shows."
        ]
      },
      {
        "heading": "Bloodstone came first, for centuries before there was an official list",
        "body": [
          "Long before 1912, bloodstone was already the birthstone people associated with March, alongside a related dark stone called jasper, according to a historical table maintained on Wikipedia's birthstone entry that tracks lists from the 15th through 20th centuries. That folk tradition predates any trade organization's involvement by hundreds of years.",
          "Where that older, pre-1912 tradition itself came from is its own unresolved question. Sources don't agree on where it originated: some trace the custom to 18th-century Poland, while the Gemological Institute of America places its start in Germany in the 1560s. Neither claim was verifiable against a primary document for this piece, so both are presented as reported positions rather than settled fact.",
          "What is documented is that this older tradition was eventually judged too inconsistent for retail use. Practices varied by region and by list, and jewelers had no single reference to point a customer to. That gap is what the 1912 meeting in Kansas City was convened to close."
        ]
      },
      {
        "heading": "How bloodstone lost its lead in 1952",
        "body": [
          "In August 1912, the American National Retail Jewelers Association, the organization now known as Jewelers of America, met in Kansas City and adopted the first standardized U.S. birthstone list. For March, that original list named bloodstone as the primary stone and aquamarine as the listed alternate, per the same Wikipedia table.",
          "The list didn't stay fixed after that. A 1952 revision, credited by Wikipedia to a group called the Jewelry Industry Council of America, added alexandrite to June, citrine to November, and pink tourmaline to October, and replaced December's lapis lazuli with zircon. That same revision is described as having also flipped March's internal order, moving aquamarine into the primary spot it has held ever since.",
          "As with the other stones touched by that 1952 update, sources don't agree on exactly which organization carried it out. Some accounts credit Jewelers of America's own predecessor association directly; Wikipedia's account names the separate Jewelry Industry Council of America. This piece did not find a primary document from 1952 itself that settles which is correct, so the attribution is reported here rather than confirmed. The list has been revised only a handful of times since: the American Gem Trade Association added tanzanite to December in 2002, and the American Gem Trade Association and Jewelers of America jointly added spinel to August in 2016, showing the same small set of trade groups is still willing to revise the list rather than treat it as closed."
        ]
      },
      {
        "heading": "Aquamarine: named for the sea, and tied to some of the largest gems ever cut",
        "body": [
          "Aquamarine's name comes directly from Latin: aqua for water, marina for of the sea. The American Gem Society traces the association back to Roman sailors, who called the stone \"water of the sea\" and carried it as a talisman for calm waves, safe voyages, and luck at fishing. The stone's link to sea travel later attached to the apostle Thomas, who is said to have traveled frequently by boat.",
          "The gem's history stretches back much further than Rome. Egyptian tombs from roughly the era of the pharaohs have turned up aquamarine beads buried with mummies, and Sumerian, Hebrew, and Greek writers all recorded admiration for the stone. Roughly two thousand years ago, Greek carvers engraved aquamarine into intaglios, and one account holds that the High Priest of the Second Temple wore aquamarine stones engraved with the names of the tribes of Israel.",
          "It's a variety of the mineral beryl, rating 7.5 to 8 on the Mohs hardness scale, harder than opal or turquoise and durable enough for daily wear, though softer than sapphire, ruby, or diamond. Most of the aquamarine sold today still traces back to Brazil's Minas Gerais state, which has been a major source for roughly two centuries.",
          "Two aquamarines stand out in the historical record. In 1936, the Brazilian government presented First Lady Eleanor Roosevelt with a 1,298-carat rectangular step-cut aquamarine, cut from a piece of rough that weighed nearly three pounds; it's now held at the Franklin D. Roosevelt Presidential Library in Hyde Park, New York. The Smithsonian's Dom Pedro Aquamarine, carved into a roughly 14-inch obelisk by German lapidary Bernd Munsteiner using his signature fantasy-cut technique, weighs 10,363 carats and is generally considered the largest faceted aquamarine in the world. More recently, both Princess Diana and Queen Elizabeth II owned notable aquamarine jewelry sets. Aquamarine is also the traditional gift for a 19th wedding anniversary."
        ],
        "image": {
          "src": "/images/march-birthstone-aquamarine.jpg",
          "alt": "Pale blue-green aquamarine beryl crystal specimen",
          "credit": "Photo by Thomas Quine, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Aquamarine_Beryl_(40626821831).jpg), CC BY 2.0"
        }
      },
      {
        "heading": "Bloodstone: a quartz variety named after a Christian legend",
        "body": [
          "Bloodstone is a form of chalcedony, a cryptocrystalline variety of quartz, appearing as dark green stone flecked with red spots of iron oxide, usually hematite. Its alternate name, heliotrope, comes from ancient Greek for \"to turn the sun,\" tied to an old belief that submerging the stone in water while facing the sun would tint the reflection red.",
          "The name bloodstone itself traces to a separate, later legend, unconnected to the heliotrope name, holding that the red spots represent the blood of Christ. During the Roman Empire the stone was carved into engraved gems, cameos, and seals; examples of that work are now held in museum collections, including the J. Paul Getty Museum. Over the centuries the stone also picked up a collection of folk beliefs about increasing strength, granting invisibility, and preserving health and youth. None of that is independently verifiable, but the strength association has stuck around in a diluted, secular form: some athletes today still carry bloodstone as a good-luck charm, and in parts of India the stone is reportedly still crushed into powder and used as a folk aphrodisiac.",
          "Most bloodstone sold today comes from India, with additional supply from Brazil, Australia, China, and the United States. The rock forms by filling fractures or cavities in other rock, or turns up as loose pebbles in riverbeds. At 6.5 to 7 on the Mohs scale it's a bit softer than aquamarine and opaque rather than transparent, which is why it's typically shaped into cabochons or carved rather than faceted."
        ],
        "image": {
          "src": "/images/march-birthstone-bloodstone.jpg",
          "alt": "Polished bloodstone specimen showing dark green chalcedony with red iron-oxide spots",
          "credit": "Photo by James St. John, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bloodstone_1_(49035782298).jpg), CC BY 2.0"
        }
      },
      {
        "heading": "Which one to buy, and why the disagreement isn't unique to March",
        "body": [
          "Since the lists disagree, the practical approach is to know what's actually being offered before buying. Aquamarine is the pricier, more widely available option in fine jewelry, easy to find faceted into rings, pendants, and earrings. Bloodstone is inexpensive, historically distinct, and shows up more often in cabochons, carved seals, or vintage-style signet rings than in mainstream engagement jewelry. Neither is a wrong choice; they're simply answering to different lists.",
          "March isn't the only month where the record is this tangled. [December's three official birthstones](/december-birthstone/) came from three separate revisions spread across ninety years, and even that settled list gets padded out in stores by blue topaz, a stone no trade group has ever actually adopted. The same pattern of \"looks fixed, isn't\" shows up outside birthstones, too: [Virgo's date range](/virgo-dates/) shifts by a day in some years for reasons just as tied to which authority and which calculation a reader is looking at.",
          "None of this makes aquamarine the \"real\" March birthstone and bloodstone a pretender, or the other way around. It means the birthstone list was never handed down complete and permanent. It's been edited in pieces by a handful of trade groups over more than a century, the same way plenty of claims repeated as settled fact online, like [National Dog Day's founding story](/national-dog-day/), turn out to have more than one version once the primary source gets checked instead of the retelling."
        ]
      }
    ],
    "faq": [
      {
        "question": "What are March's birthstones?",
        "answer": "Aquamarine and bloodstone are the two stones most commonly cited for March, by GIA, the American Gem Society, and the International Gem Society. Jewelers of America's own current chart, however, lists only aquamarine."
      },
      {
        "question": "Why does Jewelers of America list only one birthstone for March?",
        "answer": "The organization's chart doesn't explain the omission. It lists two or three stones for several other months, including June, August, and December, so March's single-stone entry isn't the result of a chart-wide policy of one stone per month."
      },
      {
        "question": "Which birthstone came first for March, aquamarine or bloodstone?",
        "answer": "Bloodstone. It was March's folk birthstone for generations before any official list existed, and the first standardized U.S. list, adopted in 1912, still named bloodstone as the primary stone with aquamarine as the alternate. A 1952 revision swapped that order."
      },
      {
        "question": "Is bloodstone still considered an official March birthstone?",
        "answer": "According to GIA and the American Gem Society, yes. The International Gem Society lists it as March's \"traditional\" birthstone, alongside aquamarine as the \"modern\" one."
      },
      {
        "question": "How hard is aquamarine, and is it durable enough for daily wear?",
        "answer": "Aquamarine rates 7.5 to 8 on the Mohs hardness scale, harder than opal or turquoise, which makes it durable enough for rings and other jewelry worn daily. It's softer than sapphire, ruby, or diamond."
      },
      {
        "question": "Where does the name \"bloodstone\" come from?",
        "answer": "From a legend that its red iron-oxide spots represent the blood of Christ. Its alternate name, heliotrope, is a separate and older reference, from ancient Greek for \"to turn the sun.\""
      }
    ],
    "sources": [
      {
        "label": "Jewelers of America — Birthstones",
        "url": "https://www.jewelers.org/buying-jewelry/jewelry-buying-guides/birthstones"
      },
      {
        "label": "GIA — March Birthstones",
        "url": "https://www.gia.edu/birthstones/march-birthstones"
      },
      {
        "label": "American Gem Society — March Birthstones",
        "url": "https://www.americangemsociety.org/birthstones/march-birthstones/"
      },
      {
        "label": "International Gem Society — Birthstone Chart: Modern and Traditional",
        "url": "https://www.gemsociety.org/article/birthstone-chart/"
      },
      {
        "label": "Wikipedia — Birthstone",
        "url": "https://en.wikipedia.org/wiki/Birthstone"
      },
      {
        "label": "Wikipedia — Aquamarine (gem)",
        "url": "https://en.wikipedia.org/wiki/Aquamarine_(gem)"
      },
      {
        "label": "National Jeweler — Rocks On: The Evolution of the Birthstone List",
        "url": "https://nationaljeweler.com/articles/5278-rocks-on-the-evolution-of-the-birthstone-list"
      }
    ],
    "image": "/images/march-birthstone-aquamarine.jpg",
    "imageAlt": "Pale blue-green aquamarine beryl crystal specimen",
    "imageCredit": "Photo by Thomas Quine, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Aquamarine_Beryl_(40626821831).jpg), CC BY 2.0"
  },
  {
    "slug": "september-birthstone",
    "category": "Birthstones",
    "title": "September Birthstone: Sapphire, Unchanged Since 1912",
    "description": "Sapphire is September's only official birthstone, one of the few never revised since 1912 — though the UK trade list still adds a second stone, lapis lazuli.",
    "published": "2026-08-05",
    "updated": "2026-08-05",
    "coreSummary": "September has exactly one official birthstone, sapphire, and it is one of the few entries on the Jewelers of America list that has never been revised since the list was first adopted in 1912 — the three trade-group updates since then (1952, 2002, 2016) each touched a different month. The stone itself is broader than its reputation: any color of corundum except red counts as sapphire, and the UK's own 2013 trade list still differs from the US one by naming a second official stone, lapis lazuli.",
    "sections": [
      {
        "heading": "September's one official birthstone",
        "body": [
          "Jewelers of America's current birthstone chart lists exactly one stone for September: sapphire. There's no equivalent here to the argument this calendar had to untangle for [December](/december-birthstone/) (three stones, plus a widely marketed fourth that isn't official) or [March](/march-birthstone/) (two stones with a disputed primary/alternate order). September is one of the rare months where the trade association's own list and popular usage actually agree on how many stones belong.",
          "Where September does have a gap is color, not count. Sapphire is best known as a deep blue stone, but the term covers any color of the mineral corundum except red; red corundum is classified as ruby, its own separate birthstone for July. According to the American Gem Society, sapphires occur in white, pink, orange, yellow, green, violet, purple, brown, and black, and a pinkish-orange variety called padparadscha, named for a Sinhala word for lotus flower, can sell for more than a blue stone of similar size and clarity. A page or a retailer that treats \"the September birthstone\" as meaning specifically blue sapphire is narrower than the actual definition."
        ]
      },
      {
        "heading": "Revised three times since 1912 — never for September",
        "body": [
          "The US birthstone list traces to a single 1912 meeting in Kansas City, where the American National Retail Jewelers Association, the organization now known as Jewelers of America, adopted a standardized list to replace the patchwork of regional folk traditions retailers had been drawing on. September's slot went to sapphire at that meeting.",
          "The list has been revised three times since, and each revision landed on a different month. In 1952, a trade-industry update added alexandrite to June, citrine to November, pink tourmaline to October, and zircon to December (sources disagree on whether that specific revision was carried out by Jewelers of America's own predecessor or a separate body, the Jewelry Industry Council of America, the same unresolved attribution this calendar noted on [December's birthstone page](/december-birthstone/)). In 2002, the American Gem Trade Association added tanzanite to December. In 2016, the American Gem Trade Association and Jewelers of America jointly added spinel to August. None of the three touched September. The organization's live chart today still shows the single stone it named in 1912."
        ]
      },
      {
        "heading": "What came before 1912 is less settled than most pages let on",
        "body": [
          "Sites that describe a \"traditional\" birthstone list alongside the modern one don't always agree with each other about what that traditional list actually said for September. Wikipedia's birthstone chart, citing gemologist George Frederick Kunz's 1913 compilation of older European folk traditions, lists September's pre-1912 stone as chrysolite, an archaic name that, by multiple accounts, was applied inconsistently to what would now be called either peridot or topaz, since older mineral names tracked color rather than composition. The International Gem Society's own \"traditional birthstone list,\" published on its site, instead names sapphire for September on both the traditional and modern columns, treating them as the same stone all along.",
          "Both pages are citing real sources; they just aren't citing the same one. That's a smaller-scale version of the same problem this calendar keeps running into with observance origins: a single word like \"traditional\" gets applied to more than one actual document, and a reader has no way to tell which document a given page means unless it says so."
        ]
      },
      {
        "heading": "The UK's own list still isn't the same as the US one",
        "body": [
          "Jewelers of America's list isn't the only current, active trade-group standard. Britain's own jewelry trade association, a successor to the British National Association of Goldsmiths that published its own list in 1937, revised its birthstone chart in 2013, and that revision gave September a second official stone: lapis lazuli, alongside sapphire. The US list does not currently include lapis lazuli for September; in the American tradition that stone belongs to December instead. A shopper checking the UK trade list and a shopper checking the US one currently get different, both-correct answers to \"how many official September birthstones are there.\""
        ]
      },
      {
        "heading": "Sapphire the mineral: hard, old, and mostly mined out of one famous source",
        "body": [
          "Sapphire is a variety of corundum, ranking 9 on the Mohs hardness scale, second only to diamond among natural minerals, with excellent toughness and no cleavage, meaning it resists chipping under normal wear. That combination is why it holds up in rings and other jewelry worn daily, per the Gemological Institute of America, though buyers are advised to ask whether a given stone has been heat-treated (common and well accepted in the trade) or treated by less common methods like lattice diffusion or fracture filling, which call for gentler cleaning.",
          "The most famous source is one that stopped producing decades ago. In 1881, a landslide in the Zanskar range of Kashmir exposed a pocket of velvety cornflower-blue crystals; miners worked the site, later known as the Old Mine, from 1882 to 1887, before the original deposit was worked out. Production from the region has been sporadic ever since, but \"Kashmir blue\" remains the benchmark other sapphires are compared against at auction. Myanmar's Mogok region and Sri Lanka, which has supplied sapphire for more than two millennia, are the other two historically dominant sources; Sri Lanka's milky white \"geuda\" stones can be heat-treated to a rich blue. Thailand's Chanthaburi province isn't a major source itself but is a major cutting and treatment hub for stones mined elsewhere.",
          "Two sapphires illustrate how far the stone's reputation has traveled: the 62.02-carat Rockefeller Sapphire, mined in Myanmar and acquired in 1934 by John D. Rockefeller Jr. from an Indian maharaja, later recut and reset by Tiffany & Co.; and the 12-carat blue sapphire in the engagement ring first worn by Princess Diana and later given by her son to Kate Middleton. Sapphire is also the gem associated with the 5th and 45th wedding anniversaries."
        ],
        "image": {
          "src": "/images/september-birthstone-sapphire.jpg",
          "alt": "Three natural sapphire crystals from Sri Lanka and Myanmar, displayed at the San Diego Natural History Museum",
          "credit": "Photo by Stickpen, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:3sapphirecrystals.jpg), public domain"
        }
      },
      {
        "heading": "A separate mismatch: the zodiac stone for Virgo isn't sapphire either",
        "body": [
          "September birthdays mostly fall under Virgo, and it's common to see gemstone sites claim sapphire as \"the\" Virgo zodiac stone, on top of it being the September birthstone. [This calendar's own Virgo dates page](/virgo-dates/) already flagged that retailers can't agree among sapphire, peridot, or carnelian for Virgo's stone, without a governing body behind any of the claims. Kunz's 1913 zodiacal table, the same one behind the \"chrysolite\" note above, actually assigns sapphire to a different sign entirely, Taurus, and gives Virgo carnelian instead. Whatever a modern astrology blog says, the older documented Western tradition and the modern monthly birthstone list simply agree on sapphire by coincidence, not because one system was built from the other."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is the official September birthstone?",
        "answer": "Sapphire — the only stone on Jewelers of America's current birthstone list for September, unchanged since the list was first adopted in 1912."
      },
      {
        "question": "Does the September birthstone have to be blue?",
        "answer": "No. Sapphire covers any color of corundum except red, which is classified as ruby instead. The American Gem Society lists white, pink, orange, yellow, green, violet, purple, and black sapphires as equally valid, along with the rare pinkish-orange padparadscha variety."
      },
      {
        "question": "Has September's birthstone ever changed?",
        "answer": "Not on the US list. The three revisions since 1912 (1952, 2002, and 2016) added stones to June, November, October, December, and August at various points, but none of them touched September."
      },
      {
        "question": "Is there a different September birthstone in the UK?",
        "answer": "Yes. Britain's jewelry trade list, revised in 2013, names both sapphire and lapis lazuli for September. The US Jewelers of America list has never included lapis lazuli for September; that stone belongs to December in the American tradition."
      },
      {
        "question": "What is padparadscha sapphire?",
        "answer": "A rare pinkish-orange variety of sapphire, named after a Sinhala word for lotus flower. Because of its rarity, a padparadscha can sell for more than a blue sapphire of comparable size and clarity."
      },
      {
        "question": "Is sapphire durable enough for an everyday ring?",
        "answer": "Yes. It ranks 9 on the Mohs hardness scale, second only to diamond among natural minerals, and has no cleavage, meaning it resists chipping under normal wear."
      }
    ],
    "sources": [
      {
        "label": "Jewelers of America — Birthstone Jewelry Guide",
        "url": "https://www.jewelers.org/gift-guides/birthstone-jewelry-guide"
      },
      {
        "label": "GIA — September Birthstones",
        "url": "https://www.gia.edu/birthstones/september-birthstones"
      },
      {
        "label": "American Gem Society — September Birthstone",
        "url": "https://www.americangemsociety.org/birthstones/september-birthstone/"
      },
      {
        "label": "International Gem Society — History of Birthstones",
        "url": "https://www.gemsociety.org/article/history-of-birthstones/"
      },
      {
        "label": "Wikipedia — Birthstone",
        "url": "https://en.wikipedia.org/wiki/Birthstone"
      },
      {
        "label": "National Jeweler — Rocks On: The Evolution of the Birthstone List",
        "url": "https://nationaljeweler.com/articles/5278-rocks-on-the-evolution-of-the-birthstone-list"
      }
    ],
    "image": "/images/september-birthstone-sapphire.jpg",
    "imageAlt": "Three natural sapphire crystals from Sri Lanka and Myanmar, displayed at the San Diego Natural History Museum",
    "imageCredit": "Photo by Stickpen, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:3sapphirecrystals.jpg), public domain"
  },
  {
    "slug": "scorpio-dates",
    "category": "Zodiac Dates",
    "title": "Scorpio Dates: October 23–November 21, in Three Systems",
    "description": "Scorpio runs October 23–November 21 in tropical astrology, though Britannica dates it a day later. Sidereal astrology draws yet another line.",
    "published": "2026-08-06",
    "updated": "2026-08-06",
    "coreSummary": "Western tropical astrology, the system behind virtually every horoscope column and app, places Scorpio from October 23 to November 21, the range given by AstroStyle, Farmers' Almanac, Almanac.com, and Wikipedia. Britannica's own reference entry is the outlier, dating the start to October 24. Vedic sidereal astrology, anchored to a different reference point, runs Scorpio roughly a month later, from about November 16 to December 15. The actual astronomical constellation the sign is named for holds the Sun for barely a week, the shortest stretch of any zodiac constellation, before the Sun crosses into Ophiuchus, a thirteenth constellation the tropical system has never counted as a sign. None of the four dates is wrong; each is answering a different question.",
    "sections": [
      {
        "heading": "The range almost every horoscope site quotes, except one",
        "body": [
          "Ask an astrology publisher for Scorpio's dates and the answer is nearly unanimous: October 23 to November 21. AstroStyle gives that range, so does Farmers' Almanac, and so does Almanac.com and the English Wikipedia entry for Scorpio (astrology). None of these sources cites another as its authority; they're independently running the same tropical-zodiac calculation and landing on the same two calendar days.",
          "Britannica breaks the pattern. Its own Scorpius entry describes the sign as \"considered as governing the period from about October 24 to about November 21,\" a full day later at the start than every other major reference checked for this page. That's not a typo repeated across mirror sites; it's Britannica's stated position, sitting a day apart from the consensus for reasons the entry itself doesn't explain. [Virgo's date range](/virgo-dates/) has the same kind of single-day fuzziness at its boundary, but there every source agrees on which day is the fuzzy one (August 22 or 23, depending on the year). Here, two different calendar dates are being presented flatly as the answer by different authorities, with no year-dependent hedge offered by either."
        ]
      },
      {
        "heading": "Why the boundary moves at all",
        "body": [
          "The tropical zodiac splits the solar year into twelve equal 30-degree arcs starting from the spring equinox, and Scorpio is the eighth of them, running from 210 to 240 degrees of tropical longitude. The calendar date attached to \"210 degrees\" isn't fixed once and for all, because the equinox that anchors the whole system doesn't land at the same clock time every year. Earth's orbit takes about 365.2422 days, not a clean 365, so the equinox arrives roughly six hours later each year until a leap day resets the count. That six-hour drift propagates to every 30-degree boundary downstream of it, Scorpio's October crossing included, which is enough to nudge the exact moment onto a different calendar date in some years than in others.",
          "That explains a one-day wobble year to year within a single reference's own methodology. It does not explain why Britannica's stated range and the AstroStyle/Farmers' Almanac/Wikipedia range disagree by a full day as a matter of general description, not year-specific drift. That gap looks like a difference in rounding convention or source vintage between references, not the astronomical wobble itself. Neither side documents which it is."
        ]
      },
      {
        "heading": "Born right on the edge",
        "body": [
          "Whichever start date a given source prefers, anyone born within a day or two of it (October 22 through 24, or November 20 through 22 at the other end) can't settle their sign from a generic date range alone. The Sun crosses the 210-degree or 240-degree line at a specific hour in a specific year, and whether a birth falls on the Libra or Sagittarius side of that line depends on the exact birth time and time zone, not the date by itself. A birth at 10 p.m. on October 22 in one location could already be Scorpio; a birth three time zones west at what's locally still October 22 could still be Libra.",
          "Settling an actual cusp birth requires an ephemeris check for the Sun's exact position on that date, time, and location, and no general reference can substitute for it. A published range like the one at the top of this page holds up for the large majority of readers and only breaks down for the narrow band born within roughly a day of either edge, this page's own range included."
        ]
      },
      {
        "heading": "A different Scorpio entirely: sidereal astrology",
        "body": [
          "Everything above describes the tropical zodiac used in Western horoscope astrology. Vedic astrology, practiced across South Asia, uses a sidereal zodiac instead, and assigns Scorpio (Vrishchika Rashi, from the Sanskrit word for scorpion) to a later stretch of the calendar: roughly November 16 to December 15. Wikipedia's own entry on the Vṛścika solar month places it across the same later-November-to-mid-December stretch, and Vedic astrology sources converge on the same range, with the kind of one-day spread at the edges (November 15 or 16, December 15 or 16) that the tropical sources show at their own boundaries.",
          "The roughly 24-day gap between the tropical and sidereal ranges is precession: the slow 25,800-year wobble of Earth's rotational axis, first described mathematically by Hipparchus around 127 BCE. Tropical astrology resets to 0 degrees Aries at the equinox every year regardless of the background stars; sidereal astrology tracks those stars directly. India's most common reference point for the calculation, the Lahiri ayanamsha, currently puts the two zodiacs about 24 degrees apart, a gap widening by roughly one degree every 72 years, which is why sidereal Scorpio lands almost a month after tropical Scorpio rather than a few days off."
        ]
      },
      {
        "heading": "What astronomers actually see in the sky",
        "body": [
          "There's a third answer, arrived at by ignoring astrology's equal-arc convention altogether. In 1930 the International Astronomical Union drew fixed, irregular boundaries around the 88 constellations, including the pattern of stars actually named Scorpius, based on the stars' real positions rather than 30-degree divisions. Per EarthSky, the Sun passes through the true constellation Scorpius for only about a week, roughly November 23 to November 29, before crossing into Ophiuchus, where it stays until about December 18. Sky & Telescope's rundown of the same boundaries notes Scorpius as the shortest solar crossing of any zodiac constellation: a week, against more than forty days for Virgo, the longest.",
          "Ophiuchus is the reason a \"secret 13th sign\" story periodically resurfaces in the press. It's a real IAU constellation the ecliptic genuinely passes through, wedged between Scorpius and Sagittarius, but it was never one of the twelve signs the Babylonian system counted, and nothing changed about the sky in 1930 beyond formalizing constellation borders that had been informal for centuries. The Sun spending three weeks in Ophiuchus and barely a week in the constellation Scorpius has no bearing on the tropical sign Scorpio, which is defined by degrees of solar longitude and doesn't reference star patterns at all."
        ]
      },
      {
        "heading": "Where the twelve-way division came from",
        "body": [
          "The equal 30-degree scheme underlying all of this (the one that gives Scorpio a clean October 23 start regardless of what the actual constellation is doing) originated with Babylonian astronomers by around the 5th century BCE and was adopted by Greek astronomers within decades. Ptolemy's Tetrabiblos, in the 2nd century CE, is the text most responsible for fixing the tropical version, tied to the equinoxes rather than the stars, as the standard that Western horoscope astrology still runs on.",
          "That history means Scorpio's dates have no founding moment, not even the contested kind an observance like [National Boyfriend Day](/national-boyfriend-day/) has: two competing origin stories, neither one settled. Scorpio's date range isn't unsettled in that sense; it's simply not the kind of thing that has a founder at all. No trade group, government body, or astrologer signed off on October 23 specifically. It's the output of a mathematical convention refined across centuries by multiple cultures, which is also why a small, unexplained one-day gap between Britannica and everyone else can persist indefinitely: there's no registrar anyone could call to settle it."
        ]
      },
      {
        "heading": "What the tropical system also assigns to Scorpio",
        "body": [
          "Within the tropical framework, Scorpio carries the standard set of classifications that go back to the same ancient system as the dates: represented by the Scorpion, a Water sign, and Fixed in modality, the stubborn middle month of its season and the same modality pairing that Taurus, Leo, and Aquarius carry for their own seasons. Its roster of ruling planets has grown exactly once in recorded history. Mars ruled Scorpio alone for as long as the sign has existed, and modern astrology added Pluto as a co-ruler after the planet's 1930 discovery, with most contemporary astrologers treating the two as joint rulers.",
          "Scorpio has no official birthstone the way a calendar month does. Jewelry retailers commonly list topaz or citrine as \"the\" Scorpio stone, but that's simply borrowed from November's monthly birthstone list, the same list documented back to [Jewelers of America's 1912 meeting](/december-birthstone/) for December's own entries, and repurposed here for a sign that happens to span late October into November. No trade body has ever issued a separate zodiac-sign birthstone list the way it issued the calendar-month one; retailers assign the stone by association, not by any documented ruling."
        ]
      }
    ],
    "faq": [
      {
        "question": "What are the official dates for Scorpio?",
        "answer": "In Western tropical astrology, the system behind most horoscope columns and apps, Scorpio runs from October 23 to November 21. That's the range given by AstroStyle, Farmers' Almanac, Almanac.com, and Wikipedia."
      },
      {
        "question": "Why does Britannica say Scorpio starts on October 24 instead of October 23?",
        "answer": "Britannica's own reference entry states the period as \"about October 24 to about November 21,\" a full day later at the start than AstroStyle, Farmers' Almanac, Almanac.com, and Wikipedia all give. Neither side's entry explains the discrepancy, and it doesn't match the kind of year-to-year equinox drift that causes other one-day boundary wobbles in the tropical zodiac. It reads instead as a difference in convention or source vintage between references, not an astronomical fact either side is disputing."
      },
      {
        "question": "What if I was born right on the boundary (October 22–24 or November 20–22)?",
        "answer": "A generic date range can't settle it. The Sun crosses into or out of Scorpio at a specific hour each year, and whether a birth falls before or after that moment depends on the exact birth time and time zone, not just the date. Resolving a genuine cusp birth requires checking an ephemeris for that year, not reading a calendar page."
      },
      {
        "question": "Are Scorpio's dates the same in every astrology system?",
        "answer": "No. Vedic sidereal astrology assigns Vrishchika (Scorpio) to roughly November 16–December 15, about a month later than the Western tropical range, because it tracks the actual background stars rather than the equinox. The two systems are currently about 24 degrees apart, a gap caused by the precession of Earth's axis and growing by about one degree every 72 years."
      },
      {
        "question": "Does the actual constellation Scorpius match the astrology sign's dates?",
        "answer": "Not closely, and by a wide margin. Per EarthSky, the Sun passes through the astronomical constellation Scorpius for only about a week, roughly November 23 to November 29, before crossing into Ophiuchus, a genuine zodiac constellation that was never counted as one of the traditional twelve signs. Sky & Telescope notes Scorpius as the shortest solar crossing of any zodiac constellation, the opposite extreme from Virgo's more than forty days."
      },
      {
        "question": "Who decided Scorpio's dates? Is there an official governing body?",
        "answer": "No single body. The twelve equal-sign system originated with Babylonian astronomers by around the 5th century BCE, was adopted by Greek astronomers soon after, and was fixed in its tropical form by Ptolemy's Tetrabiblos in the 2nd century CE. It's a centuries-old mathematical convention, not a ruling any individual or organization made on a specific date."
      }
    ],
    "sources": [
      {
        "label": "Britannica — Scorpius",
        "url": "https://www.britannica.com/place/Scorpius"
      },
      {
        "label": "Wikipedia — Scorpio (astrology)",
        "url": "https://en.wikipedia.org/wiki/Scorpio_(astrology)"
      },
      {
        "label": "Wikipedia — Vṛścika",
        "url": "https://en.wikipedia.org/wiki/V%E1%B9%9B%C5%9Bcika"
      },
      {
        "label": "AstroStyle — Scorpio Dates",
        "url": "https://astrostyle.com/astrology/scorpio-dates/"
      },
      {
        "label": "Farmers' Almanac — Scorpio Zodiac Sign",
        "url": "https://www.farmersalmanac.com/zodiac-zone-meet-scorpio"
      },
      {
        "label": "Almanac.com — Scorpio Zodiac Sign",
        "url": "https://www.almanac.com/content/scorpio-zodiac-sign"
      },
      {
        "label": "EarthSky — Sun enters Ophiuchus on November 30",
        "url": "https://earthsky.org/astronomy-essentials/sun-in-ophiuchus-november-30-to-december-18/"
      },
      {
        "label": "Sky & Telescope — A Sign of the Times",
        "url": "https://skyandtelescope.org/astronomy-news/observing-news/a-sign-of-the-times/"
      },
      {
        "label": "TIME — Where Do Zodiac Signs Come From?",
        "url": "https://time.com/5315377/are-zodiac-signs-real-astrology-history/"
      }
    ],
    "image": "/images/scorpio-dates-uranias-mirror.jpg",
    "imageAlt": "Hand-colored 19th-century star chart of the Scorpio constellation from Urania's Mirror, showing the scorpion against the night sky",
    "imageCredit": "Sidney Hall, plate from [Urania's Mirror](https://commons.wikimedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Scorpio.jpg) (1824), via Wikimedia Commons, public domain"
  },
  {
    "slug": "january-birthstone",
    "category": "Birthstones",
    "title": "January Birthstone: Garnet, Unchanged Since Before 1912",
    "description": "Garnet has held January's spot on every birthstone list checked, from a centuries-old tradition through 2019 — the only month in this series where no source disagrees.",
    "published": "2026-08-06",
    "updated": "2026-08-06",
    "coreSummary": "Garnet is January's birthstone on every list checked: a centuries-old tradition, the 1912 US standard, a 2013 UK revision, and a 2019 update all name it, with no rival stone and no revision, an outcome none of DayAlmanac's other birthstone months can claim. Garnet is also not one gem but a mineral group of at least six species spanning nearly every color, including a blue, color-changing variety confirmed only in 1998.",
    "sections": [
      {
        "heading": "The birthstone every list agrees on",
        "body": [
          "GIA and Jewelers of America both name exactly one official birthstone for January: garnet. No companion stone, no \"traditional versus modern\" split, no retailer-driven extra the way blue topaz gets marketed alongside [December's three real birthstones](/december-birthstone/). January's entry is just garnet, full stop.",
          "Wikipedia's own comparison of birthstone lists makes the point more sharply than a single source can. It tracks four separate lists side by side, spanning centuries and two countries: a 15th-to-20th-century tradition, the US list adopted in 1912, a UK revision from 2013, and a US update from 2019. Every other row in that table shows some disagreement somewhere. February's oldest column throws in hyacinth and pearl alongside amethyst. March swaps which stone counts as primary. August picks up spinel in 2016. September's own \"traditional\" column names chrysolite while every modern column says sapphire, the exact split this site already dug into for [September's birthstone](/september-birthstone/). January's row reads, word for word: Garnet, Garnet, Garnet, Garnet. Four systems, four different eras, zero variation.",
          "The International Gem Society runs an independent \"modern versus traditional\" chart with the same structure, and it lands on the identical answer without citing Wikipedia's table as its source: garnet on both sides, no asterisk."
        ]
      },
      {
        "heading": "Garnet isn't one gem — it's a family of at least six",
        "body": [
          "Most people picture a single deep-red stone when they hear \"garnet.\" GIA's own gemstone encyclopedia corrects that: garnets are a group of more than twenty related mineral species sharing one crystal structure but differing in chemical composition. Only five are common enough to matter commercially — pyrope, almandine, spessartine, grossular, and andradite — plus a sixth, uvarovite, a green garnet whose crystals are usually too small to cut and instead get set as tiny clusters.",
          "Those species cover most of the color wheel. Pyrope and almandine run purple to orangy red, the shade most people mean by \"garnet.\" Spessartine is orange. Grossular spans colorless through tsavorite's saturated green, and andradite includes demantoid, a rare green variety discovered in Russia's Ural Mountains in 1868 and initially mistaken for emerald. Carl Fabergé later worked demantoid into pieces made for the Russian imperial family, and Tiffany & Co. sent its own gem expert, George Frederick Kunz, the same Kunz whose 1913 zodiac research turns up later on this page, to Russia to buy up demantoid rough. Rhodolite, a pyrope-almandine blend, reads as a distinct pinkish red.",
          "Tsavorite has its own small piece of trivia that loops back to this site's own December page. A geologist named Campbell Bridges found the green grossular variety in northeastern Tanzania in 1967, in the Merelani Hills, the same slice of ground where a Maasai herder would turn up tanzanite crystals in that same decade. Export from Tanzania stalled, so Bridges traced the same geology across the border into Kenya and found more of it near Tsavo National Park in 1970. Tiffany & Co.'s Henry B. Platt, who had named [December's tanzanite](/december-birthstone/) five years earlier, in 1968, named this stone too, calling it tsavorite after the park in 1973."
        ],
        "image": {
          "src": "/images/january-birthstone-tsavorite.jpg",
          "alt": "Vivid green tsavorite garnet crystal on matrix from the Merelani Hills, Tanzania",
          "credit": "Photo by Lech Darski, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Granat._grossular,tsaworyt_(Tsavorite)_-_Merelani_Hills,_Arusha_Region,_Tanzania.jpg), CC BY-SA 4.0"
        }
      },
      {
        "heading": "The blue garnet that wasn't supposed to exist",
        "body": [
          "For decades, gemologists treated blue as the one color garnet's chemistry couldn't produce. The mineral's structure was thought to preclude the exact kind of light absorption needed to read as blue to the eye, no matter which species or trace element was involved.",
          "That held until 1998, when a genuinely blue, color-changing garnet turned up at Bekily, in southern Madagascar, and GIA's own research journal, Gems & Gemology, documented it in a Winter 1999 paper by Karl Schmetzer and coauthors. The stone is mostly a pyrope-spessartine mix carrying roughly 1% vanadium oxide, and that vanadium is what drives the effect: greenish-blue in daylight, shifting to purple under incandescent light, the same alexandrite-style color change that makes June's birthstone famous. Two decades on, Bekily remains close to the only commercial source for it, which puts January in the same position as December: a birthstone family whose newest, rarest member still traces back to one deposit."
        ]
      },
      {
        "heading": "Where the name — and the whole custom — actually come from",
        "body": [
          "\"Garnet\" traces to Medieval Latin granatum, \"pomegranate,\" by way of Old French grenate, \"seed-like\" — a nod to how the stone's small, glassy crystals resemble pomegranate seeds. The name has been in continuous use since the 14th century, roughly five hundred years before any trade group standardized a birthstone list.",
          "The idea of tying twelve stones to twelve months goes back further still, and it's shakier than most calendar pages let on. The first-century historian Josephus connected the twelve stones on the biblical high priest's breastplate to the twelve months and the twelve zodiac signs, but Josephus himself recorded two different lists for those twelve stones in his own writing, and centuries of translators have disagreed about what he meant ever since. Gemologist George Frederick Kunz later argued Josephus was actually describing a later, Second Temple breastplate rather than the original one from Exodus, a detail modern retellings routinely skip.",
          "Even the modern habit of wearing one birthstone per month is younger, and more contested, than it looks. Kunz places its start in 18th-century Poland; GIA instead traces it to Germany in the 1560s. Wikipedia's own summary of the history doesn't pick a side between them. What is settled is the 1912 meeting: the American National Retail Jewelers Association gathered in Kansas City that August and adopted the first standardized US list, garnet included, the same meeting already covered on [December's birthstone page](/december-birthstone/). At least one historian was unimpressed by the whole exercise, dismissing the 1912 list outright as \"nothing but a piece of unfounded salesmanship.\" Garnet's slot in it, unlike several other months, has simply never needed to be revised since."
        ]
      },
      {
        "heading": "Three thousand years of red stones, before any list existed",
        "body": [
          "Garnet didn't need a 1912 committee to matter. GIA's own history of the stone notes that red garnet necklaces were buried with Egyptian pharaohs as possessions for the afterlife, and that ancient Romans carved garnet into signet rings used to stamp wax seals on official documents. Under the loose ancient name \"carbuncle,\" applied to almost any glowing red stone, garnet was, per the Roman scholar Pliny writing around 23–79 AD, already one of the more widely traded gems of his era.",
          "A second wave of garnet's history runs through Central Europe. Deposits discovered around 1500 in what's now the Czech Republic gave rise to a regional cutting industry, using the deep-red pyrope now traded under the name \"Bohemian garnet,\" that reached its peak in the late 1800s, squarely inside the Victorian era, when garnet jewelry covered in small rose-cut stones was in heavy fashion. The Smithsonian's National Museum of Natural History holds an antique pyrope hairpin from that same tradition."
        ]
      },
      {
        "heading": "Aquarius or Capricorn? The zodiac table disagrees with most retail sites",
        "body": [
          "Plenty of modern jewelry and astrology sites state flatly that Capricorn's zodiac birthstone is garnet. Checking that claim against the actual historical source, the same 1913 Kunz zodiac table, reproduced on Wikipedia, that this site already checked for [September's zodiac-stone claim](/september-birthstone/), tells a different story. That table assigns garnet to Aquarius (January 20 to February 18), not Capricorn. Capricorn (December 22 to January 19), in the same table, gets ruby instead.",
          "It's the same pattern this site has already run into: September's popularly claimed Virgo sapphire turned out to be carnelian in Kunz's actual table, and Britannica's Scorpio start date turns out to sit a day off from every other reference on an unrelated question of tropical-zodiac dates. Retail sites tend to repeat each other rather than check the primary table, and garnet's zodiac sign is a third case of the repeated version drifting from the documented one."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is January's birthstone?",
        "answer": "Garnet — the only birthstone GIA and Jewelers of America list for the month, with no companion or alternate stone the way several other months carry."
      },
      {
        "question": "Has January's birthstone ever been changed or revised?",
        "answer": "No. Wikipedia's comparison of four separate birthstone lists — a centuries-old tradition, the 1912 US standard, a 2013 UK list, and a 2019 US update — names garnet in every single column with no variation, an outcome no other month in that comparison matches."
      },
      {
        "question": "Is garnet always red?",
        "answer": "No. It's a mineral group of at least six commercially relevant species covering nearly every color, from spessartine's orange to tsavorite's saturated green. A genuinely blue, color-changing garnet wasn't documented until a 1998 find in Bekily, Madagascar."
      },
      {
        "question": "How durable is garnet for everyday jewelry?",
        "answer": "Garnet ranges from 6.5 to 7.5 on the Mohs hardness scale depending on the species, according to GIA — durable enough for daily wear, though it can still be scratched by harder stones like diamond or sapphire."
      },
      {
        "question": "Where does the word \"garnet\" come from?",
        "answer": "From Medieval Latin granatum, \"pomegranate,\" by way of Old French grenate, \"seed-like,\" a reference to the stone's resemblance to pomegranate seeds. The name has been in use since the 14th century."
      },
      {
        "question": "Is garnet Capricorn's zodiac birthstone?",
        "answer": "Depends on the source. Many modern sites say so, but the historical zodiac table traced to gemologist George Kunz's 1913 work, reproduced on Wikipedia, assigns garnet to Aquarius instead. In that same table, Capricorn's stone is ruby."
      }
    ],
    "sources": [
      {
        "label": "GIA — January Birthstone",
        "url": "https://www.gia.edu/birthstones/january-birthstones"
      },
      {
        "label": "GIA — Garnet Description",
        "url": "https://www.gia.edu/garnet-description"
      },
      {
        "label": "GIA — Garnet History and Lore",
        "url": "https://www.gia.edu/garnet-history-lore"
      },
      {
        "label": "GIA Gems & Gemology — Garnets from Madagascar with a Color Change of Blue-Green to Purple",
        "url": "https://www.gia.edu/gems-gemology/winter-1999-color-change-garnets-madagascar-schmetzer"
      },
      {
        "label": "International Colored Gemstone Association — Tsavorite",
        "url": "https://www.gemstone.org/tsavorite"
      },
      {
        "label": "National Jeweler — Rocks On: The Evolution of the Birthstone List",
        "url": "https://nationaljeweler.com/articles/5278-rocks-on-the-evolution-of-the-birthstone-list"
      },
      {
        "label": "Wikipedia — Birthstone",
        "url": "https://en.wikipedia.org/wiki/Birthstone"
      },
      {
        "label": "International Gem Society — Birthstone Chart",
        "url": "https://www.gemsociety.org/article/birthstone-chart/"
      },
      {
        "label": "Etymonline — Garnet",
        "url": "https://www.etymonline.com/word/garnet"
      }
    ],
    "image": "/images/january-birthstone-garnet.jpg",
    "imageAlt": "Raw dodecahedral almandine garnet crystal embedded in light-colored matrix rock",
    "imageCredit": "Photo by Eurico Zimbres and Tom Epaminondas, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Almandine.jpeg), CC BY-SA 2.0"
  }
];
