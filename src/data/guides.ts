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
          "The pattern is the same one this page documents for National Boyfriend Day: a name that sounds official, a date that gets repeated without anyone checking the source, and multiple similarly-named observances that get flattened into one by sites copying each other. It's a reason to verify a specific date and origin before publishing, not just for boyfriend-related content but for any \"National [Something] Day\" a content calendar is built around.",
          "Tabitha Naylor, a fractional marketing leader who builds content calendars for B2B and financial services clients, points to National Boyfriend Day's own companion observance as the clearest example of the pattern. \"National Boyfriend Day isn't the exception, it's the rule. Look at National Girlfriend Day on August 1. No named founder, no documented first observance, no primary source. It exists because enough brands and posts repeated it until it felt official. That's not a holiday. It's a rumor with good SEO,\" she said.",
          "<div style=\"margin:12px 0;padding:18px 20px;background:#f8fafc;border-left:4px solid #4a5568;border-radius:8px;\"><p style=\"margin:0;font-size:1.05rem;font-style:italic;color:#1e293b;line-height:1.6;\">&ldquo;Build a campaign on a &lsquo;fact&rsquo; that falls apart the second someone checks, and you've spent credibility to save five minutes of research. Before a &lsquo;national day&rsquo; goes on the calendar, it has to survive one honest search. If I can't find a real origin, I can still ride the moment, I just frame it as a fun internet thing, not a piece of history.&rdquo;</p><p style=\"margin:8px 0 0;font-size:0.8125rem;color:#64748b;\">Tabitha Naylor, fractional marketing leader</p></div>"
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
        "question": "What day of the week is National Boyfriend Day in 2026 and 2027?",
        "answer": "October 3 falls on a Saturday in 2026 and a Sunday in 2027. The date itself never changes — National Boyfriend Day is always October 3 — only the weekday it lands on shifts from year to year."
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
        "question": "When is National Daughters Day 2026?",
        "answer": "Friday, September 25, 2026. The date is fixed at September 25 every year in the US and does not shift for weekends."
      },
      {
        "question": "When is National Daughters Day 2027?",
        "answer": "Saturday, September 25, 2027. The date is fixed at September 25 every year in the US; only the day of the week changes."
      },
      {
        "question": "Is today National Daughters Day?",
        "answer": "Only if today is September 25, since that's the fixed US date every year. In 2026, that falls on a Friday; in 2027, a Saturday. On any other day, it isn't National Daughters Day in the US, though International Daughters Day, a separate observance on the fourth Sunday in September, can fall nearby in the same month."
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
    "published": "2026-08-02",
    "updated": "2026-08-09",
    "image": "/images/national-grandparents-day.jpg",
    "imageAlt": "Grandparents holding two young grandchildren outdoors",
    "imageCredit": "Photo by sylviebliss via [Pixabay](https://pixabay.com/en/grandparents-grandmother-people-1969824/) and [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Grandparents-1969824.jpg), CC0",
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
    "published": "2026-08-02",
    "updated": "2026-08-12",
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
    ],
    "image": "/images/national-bosses-day.jpg",
    "imageAlt": "A businessman and businesswoman shaking hands in an office",
    "imageCredit": "Photo by perzon seo, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Business_man_and_woman_handshake_in_work_office.jpg), CC BY 2.0"
  },
  {
    "slug": "national-cat-day",
    "category": "Observances",
    "title": "National Cat Day: October 29, and Which Cat Holiday You Mean",
    "description": "National Cat Day falls on October 29 in the US, founded in 2005 by Colleen Paige. At least three other cat observances use similar names but different dates.",
    "published": "2026-08-03",
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
          "Two of those four (the American Black Cat Appreciation Day and the British National Black Cat Day) share almost the same name, launched in the same year, for a similar adoption-equity reason, on dates about two months apart rather than close together. That is enough overlap that a reader searching for one can easily land on coverage of the other. The safest way to keep them straight is by founder and country: Paige for the US's general National Cat Day, IFAW/International Cat Care for the global August observance, Morris for the US black-cat day, and Cats Protection for the UK black-cat day.",
          "Both black-cat campaigns lead with superstition as the reason adoption lags, but a peer-reviewed study published in March 2026 in the journal Animals, by researchers Jill A. Villarreal, Reese Gebauer, and James C. Ha, tested that explanation directly and did not find much support for it. The researchers showed 1,004 US-based participants 40 real cat adoption photos, ten each of black, white, orange tabby, and brown tabby cats sourced from Petfinder, and asked them to judge each cat's emotion and how likely it was to be adopted within two weeks. Black cats were rated significantly less adoptable, and viewers more often read fear or anger into their expressions, but when the researchers specifically tested superstition and skin-color bias as explanations, neither showed a significant effect; the factor that did line up with lower adoptability ratings was simply how hard black cats' faces are to read in a typical shelter photo. That does not rule out superstition playing some role, but it is a reminder that the most repeated explanation is not automatically the same as a tested one."
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
        "question": "Does superstition explain why black cats are adopted less?",
        "answer": "Maybe not primarily. Both black-cat observances lead with superstition as the explanation, but a peer-reviewed study published in March 2026 (Villarreal, Gebauer & Ha, in the journal Animals) tested superstition and skin-color bias directly against real shelter adoption photos and found neither had a significant effect on adoptability ratings. The factor that did correlate was how hard black cats' faces are to read in typical shelter photography."
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
        "label": "Villarreal, Gebauer & Ha — Do Black Cats Look Less Adoptable? (Animals, March 2026, PubMed)",
        "url": "https://pubmed.ncbi.nlm.nih.gov/41897846/"
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
    "published": "2026-08-04",
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
        "question": "What is the date range for Virgo?",
        "answer": "August 23 to September 22, in Western tropical astrology, the system used by most horoscope columns and apps. Vedic sidereal astrology puts the range about a month later, roughly September 17 to October 16, and the actual astronomical constellation holds the Sun longer still, from about September 16 to October 30."
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
  },
  {
    "slug": "red-ribbon-week",
    "category": "Observances",
    "title": "Red Ribbon Week: October 23–31 Every Year, and Who Actually Runs It",
    "description": "Red Ribbon Week runs October 23–31 every year, fixed dates set by the National Family Partnership. The DEA supports and promotes it but did not found or organize it.",
    "published": "2026-08-06",
    "updated": "2026-08-06",
    "coreSummary": "Red Ribbon Week is observed on fixed calendar dates, October 23 through October 31, every year in the United States. It began as a grassroots tribute to DEA Special Agent Enrique \"Kiki\" Camarena after his 1985 murder, but the annual national campaign has been organized every year since 1988 by the nonprofit National Family Partnership, not by the DEA itself.",
    "dateRule": {
      "kind": "fixed",
      "text": "Red Ribbon Week runs from October 23 through October 31 every year, a fixed nine-day span on the calendar not tied to a particular weekday or a \"last week of the month\" rule. The National Family Partnership (NFP), the nonprofit that has organized the National Red Ribbon Campaign annually since 1988, sets these exact dates, and the DEA's own program pages state the same October 23–31 range. The table below lists October 23, the starting date, for each year; the observance runs through October 31 in every case.",
      "source": {
        "label": "DEA — Red Ribbon Week Is Oct. 23-31 (Get Smart About Drugs)",
        "url": "https://www.getsmartaboutdrugs.gov/rrw"
      },
      "occurrences": [
        { "date": "2026-10-23", "weekday": "Friday" },
        { "date": "2027-10-23", "weekday": "Saturday" },
        { "date": "2028-10-23", "weekday": "Monday" },
        { "date": "2029-10-23", "weekday": "Tuesday" },
        { "date": "2030-10-23", "weekday": "Wednesday" },
        { "date": "2031-10-23", "weekday": "Thursday" }
      ],
      "caveat": "DEA's own history page calls Red Ribbon Week \"an 8-day celebration,\" even though the October 23–31 range it cites in the same paragraph spans nine calendar days inclusive, a minor inconsistency in the agency's own material that is flagged here rather than silently corrected. Some secondary sources describe the observance loosely as \"the last week of October,\" which is imprecise: the dates are fixed to October 23 and October 31 specifically, so the span can start and end on any day of the week depending on the year, not on a floating weekly boundary."
    },
    "founding": {
      "status": "documented",
      "text": "Red Ribbon Week traces to the 1985 murder of DEA Special Agent Enrique \"Kiki\" Camarena. On February 7, 1985, at 2:00 p.m., Camarena left the American Consulate in Guadalajara, Mexico to meet his wife for lunch; he had spent four and a half years undercover tracking Mexican drug traffickers and was due to be reassigned in three weeks. Five men forced him into a beige Volkswagen outside the consulate. His body was found on March 5 on a ranch outside Zamora, Mexico, roughly 60 miles from Guadalajara; an autopsy found he had been tortured and beaten. He was returned to the United States for burial three days later.\n\nCongressman Duncan Hunter, a member of the House Select Committee on Narcotics Abuse and Control, and Henry Lozano, Camarena's high school friend and the director of the drug-prevention group Teen Challenge, met after his death to organize \"Camarena Clubs\" in the El Cajon, California area. The first club started April 20, 1985, at Calexico Union High School, Camarena's own alma mater and class of 1968. The following week, club members and Congressman Hunter's wife, Lynne, presented First Lady Nancy Reagan with a \"Camarena Club Proclamation.\" That summer, the Virginia Federation of Parents and the Illinois Drug Education Alliance called on Americans nationally to wear red ribbons in his memory.\n\nThe national campaign became an annual event in 1988, when the National Family Partnership (NFP), a nonprofit founded in 1980 as the National Federation of Parents for Drug-Free Youth, coordinated the first National Red Ribbon Week, described by the DEA as an \"8-day celebration\" proclaimed by Congress with President and Mrs. Reagan serving as honorary chairpersons. NFP, headquartered in Miami and long led by Peggy B. Sapp, has run the campaign every year since, including its annual student theme contest.\n\nA caution on sources: Wikipedia's account of this history places the presentation to Nancy Reagan in 1986 and the Virginia/Illinois ribbon-wearing campaign \"the following year,\" in \"late March and April.\" The DEA's own current history page places both events within 1985 instead: the proclamation the week after the April 20, 1985 club launch, and the ribbon-wearing campaign that same summer. The two accounts describe the same sequence of events roughly a year apart. This page follows the DEA's own institutional history over the secondary account, but the discrepancy is unresolved rather than silently corrected.",
      "source": {
        "label": "DEA — Red Ribbon Week History (Get Smart About Drugs)",
        "url": "https://www.getsmartaboutdrugs.gov/get-involved/red-ribbon-week-history"
      }
    },
    "sections": [
      {
        "heading": "Fixed dates, not a floating week",
        "body": [
          "Red Ribbon Week is anchored to two specific calendar dates, October 23 and October 31, rather than to a weekday-based rule like \"the fourth Thursday in November.\" That makes it simpler to compute than most observances on this calendar, since there is no nth-weekday arithmetic involved, but it also means the nine-day span lands on different days of the week every year and always swallows at least one full weekend. In 2026 it runs Friday the 23rd through Saturday the 31st; in 2028 it runs Monday through Tuesday of the following week.",
          "Both organizations connected to the observance state the same range. The DEA's public program page reads simply \"RED RIBBON WEEK is Celebrated Annually October 23-31,\" and the National Family Partnership, the nonprofit that has run the national campaign since 1988, uses the identical dates in its own materials and annual theme announcements. Neither organization has shifted the range in recent years: 2025 and 2026 both ran October 23–31, which is why this page treats the rule as a settled fixed date rather than a loosely kept convention."
        ]
      },
      {
        "heading": "The murder that started it",
        "body": [
          "Enrique \"Kiki\" Camarena was a Drug Enforcement Administration special agent stationed in Guadalajara, Mexico, where he had spent more than four years working undercover against the country's marijuana and cocaine trafficking networks. His work had traced a lead to a multi-billion-dollar drug operation, and he was three weeks from a reassignment out of Mexico when, on February 7, 1985, he left the American Consulate to meet his wife for lunch. Five men forced him into a car outside the consulate; he was not seen again until his body was recovered on March 5 at a ranch outside Zamora, roughly 60 miles away. An autopsy found he had been tortured before he died.",
          "The killing drew national press attention in the United States, and the response began almost immediately in Camarena's own community. Congressman Duncan Hunter, who sat on the House Select Committee on Narcotics Abuse and Control, and Henry Lozano, a childhood friend of Camarena's who ran the counseling group Teen Challenge, organized student groups called Camarena Clubs. The first opened on April 20, 1985, at Calexico Union High School in California, the school Camarena had graduated from in 1968, and the red ribbon began there as a chosen symbol of commitment to a drug-free community, not as a symbol handed down by any federal agency."
        ]
      },
      {
        "heading": "From one classroom to a national campaign",
        "body": [
          "The Camarena Clubs spread quickly within California through 1985. The week after the first club launched, its members and Congressman Hunter's wife, Lynne, presented a \"Camarena Club Proclamation\" to First Lady Nancy Reagan, who had already made drug prevention a signature issue with her \"Just Say No\" campaign. That same summer, the Virginia Federation of Parents and the Illinois Drug Education Alliance called on Americans well beyond California to start wearing red ribbons, extending a local symbol into a broader, unofficial national gesture.",
          "The step that made it an annual, coordinated program came three years later. In 1988, the National Family Partnership, a Miami-based nonprofit that had already existed since 1980 under the name National Federation of Parents for Drug-Free Youth, organized the first National Red Ribbon Week, proclaimed by the U.S. Congress with President and Mrs. Reagan serving as honorary chairpersons. NFP has run the campaign, including its annual student-submitted theme, every year since, which is why the observance has a single stable set of dates rather than dozens of locally invented ones."
        ]
      },
      {
        "heading": "Who actually runs it: the DEA, or someone else?",
        "body": [
          "It is easy to assume the DEA runs Red Ribbon Week, since the observance began in memory of one of its own agents and the agency promotes it heavily every October. That assumption overstates the DEA's role. The DEA did not organize the first National Red Ribbon Week and has never been its annual sponsor; that has been the National Family Partnership's role continuously since 1988. The DEA's real contributions are narrower and mostly promotional: it publishes a planning toolkit and social-media campaign each year, links to a presidential proclamation, hosts a Campus Video PSA Contest, and ran a Boy Scout and Girl Scout Red Ribbon Week patch program, but that patch program was a one-time promotional effort limited to 2018, not a recurring DEA fixture.",
          "This distinction matters for a simple reason: NFP, not the DEA, is the body that sets the dates, runs the annual theme contest, and would be the organization to contact for details on any given year's observance. Calendar sites that credit the DEA alone with \"running\" Red Ribbon Week are describing its public-facing promotional partner, not its organizer."
        ]
      },
      {
        "heading": "How Red Ribbon Week is observed",
        "body": [
          "Observance is informal and decentralized: there is no legal requirement to participate, and the DEA and NFP both describe it as a voluntary pledge campaign rather than a program with attendance or reporting requirements. Participants wear red ribbons, and schools, workplaces, and community groups build their own activities around the week: essay and poster contests, drug-free pledges, parades, and buildings decorated in red. The DEA and Broward County Public Schools both put annual participation above 80 million people nationwide, though that figure is self-reported by the organizing groups rather than independently measured.",
          "Each year's observance also carries a fresh, student-submitted theme, chosen through NFP's annual contest. The 2026 theme is \"Make a Difference. Be a Hero. Stay Drug Free.™,\" submitted by Ava Tackett, a student at Griswold Middle School in Griswold, Connecticut. Red Ribbon Week is not a federal holiday: it carries no legal holiday status, closes no federal offices, and creates no paid leave, unlike the small number of dates covered by 5 U.S.C. § 6103. Its closest relatives on this calendar are other observances with a documented, named founding organization behind an informal date: [National Boss's Day](/national-bosses-day/) is one, registered by a private citizen rather than any government body; [National Daughters Day](/national-daughters-day/) is another, where competing origin stories are common enough that sorting out which one holds up is most of the point; and [National Grandparents Day](/national-grandparents-day/) is a third, whose recurring date took a presidential proclamation and a separate act of Congress, a year apart, to establish."
        ]
      }
    ],
    "faq": [
      {
        "question": "What are the exact dates of Red Ribbon Week?",
        "answer": "Red Ribbon Week runs October 23 through October 31 every year in the United States. The dates are fixed calendar dates rather than a floating week, set nationally by the National Family Partnership and confirmed on the DEA's own Red Ribbon Week program pages."
      },
      {
        "question": "Who founded Red Ribbon Week?",
        "answer": "There is no single founder. It began as a grassroots response: \"Camarena Clubs\" organized by Congressman Duncan Hunter and Henry Lozano in April 1985, following the murder of DEA Special Agent Enrique \"Kiki\" Camarena. The first annual, national observance was organized in 1988 by the National Family Partnership, the nonprofit that has run it every year since."
      },
      {
        "question": "Does the DEA organize Red Ribbon Week?",
        "answer": "No. The DEA supports and promotes it: publishing a planning toolkit, hosting an annual video PSA contest, and running a one-time Boy Scout and Girl Scout patch program in 2018. The National Family Partnership, a private nonprofit headquartered in Miami, has been the official national organizer and sponsor since 1988."
      },
      {
        "question": "Is Red Ribbon Week a federal holiday?",
        "answer": "No. It is an awareness observance with no legal holiday status. No federal offices close and no paid leave attaches to it; participation by schools, workplaces, and communities is voluntary, through activities like ribbon-wearing, pledges, and classroom programs."
      },
      {
        "question": "Why do some sources describe it as an 8-day event?",
        "answer": "That phrasing comes from the DEA's own history page, which calls the 1988 campaign \"an 8-day celebration\" even though its cited October 23–31 range covers nine calendar days inclusive. The mismatch appears to be a simple miscount rather than a different set of dates: every source that states specific dates, including the DEA's, agrees on October 23 through October 31."
      },
      {
        "question": "What is the Red Ribbon Week theme for 2026?",
        "answer": "\"Make a Difference. Be a Hero. Stay Drug Free.™,\" selected through the National Family Partnership's annual student theme contest. The winning slogan was submitted by Ava Tackett, a student at Griswold Middle School in Griswold, Connecticut."
      }
    ],
    "sources": [
      {
        "label": "DEA — Red Ribbon Week History (Get Smart About Drugs)",
        "url": "https://www.getsmartaboutdrugs.gov/get-involved/red-ribbon-week-history"
      },
      {
        "label": "DEA — Red Ribbon Week Is Oct. 23-31 (Get Smart About Drugs)",
        "url": "https://www.getsmartaboutdrugs.gov/rrw"
      },
      {
        "label": "DEA — Red Ribbon (program landing page)",
        "url": "https://www.dea.gov/redribbon"
      },
      {
        "label": "National Family Partnership — About Us / Red Ribbon Campaign",
        "url": "https://www.redribbon.org/about"
      },
      {
        "label": "DEA Press Release — Connecticut Student Wins National Red Ribbon Theme Contest (April 9, 2026)",
        "url": "https://www.dea.gov/press-releases/2026/04/09/connecticut-student-wins-national-red-ribbon-theme-contest"
      },
      {
        "label": "National Family Partnership Blog — 2026 Red Ribbon Week Theme Announcement",
        "url": "https://www.redribbon.org/blog/national-family-partnership-announces-2026-red-ribbon-week-theme-make-a-difference.-be-a-hero.-stay-drug-free"
      },
      {
        "label": "Wikipedia — Red Ribbon Week",
        "url": "https://en.wikipedia.org/wiki/Red_Ribbon_Week"
      },
      {
        "label": "Broward County Public Schools — Red Ribbon Week",
        "url": "https://www.browardschools.com/bcps-departments/school-culture-student-support/new-violence-prevention/substance-abuse-prevention/red-ribbon-week"
      }
    ],
    "image": "/images/red-ribbon-week-camarena.jpg",
    "imageAlt": "Official portrait of DEA Special Agent Enrique \"Kiki\" Camarena, whose 1985 murder led to the founding of Red Ribbon Week",
    "imageCredit": "U.S. Drug Enforcement Administration, public domain, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Enrique-camarena1.jpg)"
  },
  {
    "slug": "domestic-violence-awareness-month",
    "category": "Observances",
    "title": "Domestic Violence Awareness Month: All of October, Not Renewed",
    "description": "Domestic Violence Awareness Month covers all of October every year. Congress designated it by name for 1989 only; no comparable law has renewed it since.",
    "published": "2026-08-09",
    "updated": "2026-08-09",
    "coreSummary": "Domestic Violence Awareness Month covers the entire month of October, every year, in the United States. It began as a single \"Day of Unity\" declared by the National Coalition Against Domestic Violence in October 1981, grew into a full month by 1987, and received federal recognition when Congress designated the single year of October 1989 in Public Law 101-112. No comparable law has renewed that designation since; every President has simply continued proclaiming the month on their own authority.",
    "dateRule": {
      "kind": "fixed",
      "text": "Domestic Violence Awareness Month is observed across all of October, every year, from October 1 through October 31, rather than on a single date or a floating week within the month. Congress first designated the observance by name for a specific year, October 1989, in Senate Joint Resolution 133, and every President has proclaimed or recognized the full month of October the same way since.",
      "source": {
        "label": "George Bush — Proclamation 6043, National Domestic Violence Awareness Month, 1989 (The American Presidency Project)",
        "url": "https://www.presidency.ucsb.edu/documents/proclamation-6043-national-domestic-violence-awareness-month-1989"
      },
      "occurrences": [
        { "date": "2026-10-01", "weekday": "Thursday" },
        { "date": "2027-10-01", "weekday": "Friday" },
        { "date": "2028-10-01", "weekday": "Sunday" },
        { "date": "2029-10-01", "weekday": "Monday" },
        { "date": "2030-10-01", "weekday": "Tuesday" },
        { "date": "2031-10-01", "weekday": "Wednesday" }
      ],
      "caveat": "There is no competing date range to sort out here: every source, federal and advocacy alike, agrees the entire month of October is Domestic Violence Awareness Month, so the table above lists October 1 as each year's start with the understanding that the observance runs through October 31 in every case. What has actually changed over the decades is the mechanism behind it, not the dates. Congress passed a fresh joint resolution requesting a proclamation for specific years in at least 1989 and 1991; by the 2020s, Presidents were proclaiming the month on their own executive authority with no new joint resolution attached, and the title and format of the annual White House statement have varied by administration, from \"Proclamation\" under Bush and Biden to a \"Presidential Message\" in 2025."
    },
    "founding": {
      "status": "documented",
      "text": "The organization behind this observance predates it by three years. In January 1978, the United States Commission on Civil Rights held a hearing, \"Consultation on Battered Women: Issues of Public Policy,\" and the National Coalition Against Domestic Violence (NCADV) formed out of that meeting, becoming the country's first national organization focused specifically on shelters and support services for battered women and their children.\n\nNCADV's first observance came in October 1981: a single \"Day of Unity\" meant to connect advocates who had been working on the issue in isolation across the country. It took six more years to become a month-long campaign. In October 1987, NCADV held the first full Domestic Violence Awareness Month, and that same year the organization also ran its own toll-free hotline for a period, a separate and short-lived effort from the federally created hotline that would arrive nearly a decade later.\n\nFederal recognition came in 1989, and it arrived as a one-year designation rather than a standing law. Senate Joint Resolution 133, enacted as Public Law 101-112 on October 6, 1989, designated \"October 1989\" by name and authorized and requested the President to issue a proclamation marking it. President George Bush did so five days later, on October 11, 1989, in Proclamation 6043, the first presidential proclamation of this observance on record. Congress went back and did it again at least once: Senate Joint Resolution 73 designated October 1991 the same way, and Bush issued a second proclamation, Number 6340, that September.\n\nSomewhere after that, the pattern changed: by 2021, President Biden's proclamation cited no accompanying joint resolution at all, proclaiming the month solely under his general constitutional authority. Congress has not gone back to renewing the designation by name since 1991, though Representative Al Green has introduced his own version of the resolution in the House every year since at least 2020, without it ever reaching a floor vote.\n\nOne wrinkle in the federal record: Bush's own 1991 proclamation claims the month had been observed \"every autumn since 1985,\" two years earlier than the date any other record, including his own first proclamation, supports. The line reads as an uncorrected slip rather than evidence the observance is actually older than its documented history.",
      "source": {
        "label": "The National Domestic Violence Hotline — Domestic Violence Awareness Month",
        "url": "https://www.thehotline.org/stakeholders/domestic-violence-awareness-month/"
      }
    },
    "sections": [
      {
        "heading": "The whole month, every year",
        "body": [
          "Domestic Violence Awareness Month covers all 31 days of October, not a single date or a floating week inside it. That makes the date question almost trivial by the standards of this calendar: there is no nth-weekday arithmetic to compute, no rival set of dates from a different organization, and no table to double-check each year. October 1 marks the start of each year's observance below; it runs through October 31 in every case.",
          "The simplicity stops at the calendar, though. What has genuinely changed over more than three decades is not the dates but the paperwork behind them: whether a fresh act of Congress stands behind a given year's observance, or whether it now runs on custom alone. That distinction, not the date range, is the part most calendar sites skip past."
        ]
      },
      {
        "heading": "From one day to one month, 1978 to 1987",
        "body": [
          "The National Coalition Against Domestic Violence formed in January 1978, out of a United States Commission on Civil Rights hearing titled \"Consultation on Battered Women: Issues of Public Policy.\" It became the country's first national organization built specifically around shelters and support services for battered women and their children, at a time when there was little of either: fewer than a handful of dedicated shelters existed nationwide before the mid-1970s.",
          "NCADV's first observance, in October 1981, was a single \"Day of Unity,\" intended to connect advocates who had mostly been working in isolation, state by state. The jump from one day to a full month took until October 1987, when NCADV held the first Domestic Violence Awareness Month and, separately, ran its own toll-free hotline for a period. That 1987 hotline is easy to confuse with the hotline most people call today; it was not the same organization, and the two would not come under one roof for another 35 years."
        ]
      },
      {
        "heading": "1989: Congress designates it, for one specific year",
        "body": [
          "Domestic Violence Awareness Month got its federal recognition through Senate Joint Resolution 133, enacted as Public Law 101-112 on October 6, 1989. As President Bush's own proclamation quotes it, Congress \"designated October 1989 as 'National Domestic Violence Awareness Month' and...authorized and requested the President to issue a proclamation.\" Five days later, on October 11, 1989, Bush did exactly that in Proclamation 6043, the first presidential proclamation of this observance on record.",
          "What is easy to miss is that this was, on paper, a one-year designation, not a standing law that automatically renews every October. Congress went back and did it again at least once: Senate Joint Resolution 73 designated October 1991 the same way, and Bush issued a second proclamation, Number 6340, that September. Whether Congress kept passing a fresh resolution every single year after that is not something any one source lays out cleanly, but by the time later administrations proclaimed the month, the practice had visibly changed."
        ]
      },
      {
        "heading": "A federal fixture that nobody has to keep renewing",
        "body": [
          "By 2021, President Biden's proclamation cited no accompanying joint resolution at all: he proclaimed \"National Domestic Violence Awareness and Prevention Month\" under \"the authority vested in me by the Constitution and the laws of the United States,\" full stop. Somewhere between the early 1990s and the 2020s, the month had become something Presidents simply do every October on their own authority, not something Congress hands them fresh each year. Individual members of Congress have kept a version of the earlier custom alive on their own: Representative Al Green has introduced his own \"Original National Domestic Violence Awareness Month Resolution\" in the House annually since at least 2020, though a resolution from one member that never reaches a floor vote carries no legal force of its own.",
          "The White House's own record on this observance is not entirely consistent, either. Bush's 1991 proclamation states that \"every autumn since 1985, we have set aside National Domestic Violence Awareness Month,\" but no proclamation, joint resolution, or advocacy timeline places the first observance before 1987 as a month or 1989 as a federal proclamation. It is a small, uncorrected slip in an otherwise precisely dated official record, the kind of detail most calendar sites smooth over rather than flag.",
          "The observance's own name and format have also shifted by administration. Bush's original proclamations called it \"National Domestic Violence Awareness Month\"; Biden's called it \"National Domestic Violence Awareness and Prevention Month\" and issued it as a formal Proclamation; the White House's 2025 statement returned to the shorter name but issued it as a \"Presidential Message\" instead of a Proclamation. None of that changes the dates. It does mean a reader comparing two years' official statements side by side will notice the title and the format read differently depending on which October it is."
        ]
      },
      {
        "heading": "Two hotlines, one merged organization",
        "body": [
          "NCADV's short-lived 1987 hotline is often blurred together with the hotline most people call today. The National Domestic Violence Hotline, reachable at 1-800-799-7233, is a separate creation: it was authorized when President Clinton signed the Violence Against Women Act on September 13, 1994, funded the following year through a one million dollar grant to the Texas Council on Family Violence, and took its first call on February 21, 1996. For more than two decades, NCADV and the National Domestic Violence Hotline were separate organizations with overlapping missions and, at times, overlapping messaging about this same October observance.",
          "That changed in 2022, when NCADV merged into the Hotline's parent organization and gave up its own independent nonprofit status. Today, ncadv.org redirects visitors straight to TheHotline.org, and the Domestic Violence Awareness Month materials once published under NCADV's own name live there instead. A reader who finds an older page still crediting NCADV alone as the month's sole current organizer is looking at a description that predates the merger."
        ],
        "image": {
          "src": "/images/domestic-violence-awareness-month-timeline.svg",
          "alt": "Timeline showing Domestic Violence Awareness Month's path from NCADV's 1978 founding through the 1989 congressional designation to the 2022 merger with the National Domestic Violence Hotline"
        }
      },
      {
        "heading": "How the month is actually observed",
        "body": [
          "Domestic Violence Awareness Month carries no legal holiday status: no federal offices close, no paid leave attaches to it, and nothing about it is mandatory for any workplace or school. What happens instead is decentralized and annual: state coalitions, shelters, and advocacy groups run their own local events throughout October, loosely tied together by a shared theme chosen each year, such as 2025's \"With Survivors, Always\" from the Hotline and its partner the Domestic Violence Awareness Project. Purple is the color most commonly associated with the campaign, worn at vigils and shared on social media. Within the month, the first Monday is set aside as the Day of Unity, a direct descendant of NCADV's original 1981 observance and the closest thing the month has to its own founding anniversary.",
          "One thing this month is not: Teen Dating Violence Awareness Month, a separate campaign run each February through loveisrespect.org and aimed specifically at abuse in teenage dating relationships. It shares an audience and a cause with the October observance but runs on its own calendar, not as a subset of this one.",
          "Domestic Violence Awareness Month sits alongside a small group of observances on this calendar with a similar shape: founded by an advocacy organization, later picked up by the federal government, and now sustained mostly by custom rather than fresh legislation. [Red Ribbon Week](/red-ribbon-week/), observed the same month, followed almost the same arc, a grassroots campaign that a nonprofit, not a federal agency, has organized every year since 1988. [National Grandparents Day](/national-grandparents-day/) needed both a presidential proclamation and a separate act of Congress, a year apart, before its date was fixed. [National Sons Day](/national-sons-day/), by contrast, has no federal recognition at all, a useful reminder of how little authority actually backs most \"national days.\""
        ]
      }
    ],
    "faq": [
      {
        "question": "What are the exact dates of Domestic Violence Awareness Month?",
        "answer": "The entire month of October, every year, from October 1 through October 31. It is not tied to a single date or a floating week within the month."
      },
      {
        "question": "Who founded Domestic Violence Awareness Month?",
        "answer": "The National Coalition Against Domestic Violence (NCADV), formed in January 1978, held the first \"Day of Unity\" in October 1981 and expanded it into a full month-long observance in October 1987. Congress gave it federal recognition two years later, in 1989."
      },
      {
        "question": "Did Congress pass a permanent law that automatically renews this observance every year?",
        "answer": "Not in one step. Congress designated \"October 1989\" specifically as National Domestic Violence Awareness Month through Public Law 101-112, and passed at least one more year-specific joint resolution for October 1991. Since then, Presidents have proclaimed the month on their own executive authority rather than through a fresh law each year. Representative Al Green has introduced his own \"Original National Domestic Violence Awareness Month Resolution\" in the House annually since at least 2020, but none of those introductions has ever come up for a vote, so none carries the weight of the 1989 and 1991 resolutions Congress actually passed."
      },
      {
        "question": "Is Domestic Violence Awareness Month a federal holiday?",
        "answer": "No. No federal offices close and no paid leave attaches to it. It is an awareness observance, marked through proclamations, local events, and advocacy campaigns, not a legal holiday."
      },
      {
        "question": "Is the National Domestic Violence Hotline the same organization that started this observance?",
        "answer": "Not originally. NCADV started the observance and ran its own short-lived hotline in 1987. The National Domestic Violence Hotline (1-800-799-7233) is a separate organization, authorized under the 1994 Violence Against Women Act and launched in 1996. The two merged in 2022, with NCADV becoming part of the Hotline's parent organization."
      },
      {
        "question": "Why do some sources describe the observance as running \"since 1985\"?",
        "answer": "That phrasing traces to a line in President George Bush's own 1991 proclamation, which states the month had been set aside \"every autumn since 1985.\" No other record, including Bush's own first proclamation of the observance in 1989, supports a date earlier than 1987 for the full-month observance or 1989 for a federal proclamation. The 1991 statement appears to be an unresolved error in the White House's own account."
      },
      {
        "question": "Is this the same as Teen Dating Violence Awareness Month?",
        "answer": "No. Teen Dating Violence Awareness Month is a separate campaign observed every February, focused specifically on abuse within teen dating relationships and run through loveisrespect.org, not this observance."
      }
    ],
    "sources": [
      {
        "label": "George Bush — Proclamation 6043, National Domestic Violence Awareness Month, 1989 (The American Presidency Project)",
        "url": "https://www.presidency.ucsb.edu/documents/proclamation-6043-national-domestic-violence-awareness-month-1989"
      },
      {
        "label": "George Bush — Proclamation 6340, National Domestic Violence Awareness Month, 1991 (The American Presidency Project)",
        "url": "https://www.presidency.ucsb.edu/documents/proclamation-6340-national-domestic-violence-awareness-month-1991"
      },
      {
        "label": "Public Law 101-112, 103 Stat. 685 (Congress.gov)",
        "url": "https://www.congress.gov/101/statute/STATUTE-103/STATUTE-103-Pg685.pdf"
      },
      {
        "label": "The White House — A Proclamation on National Domestic Violence Awareness and Prevention Month, 2021",
        "url": "https://bidenwhitehouse.archives.gov/briefing-room/presidential-actions/2021/09/30/a-proclamation-on-national-domestic-violence-awareness-and-prevention-month-2021/"
      },
      {
        "label": "The White House — Presidential Message on National Domestic Violence Awareness Month, 2025",
        "url": "https://www.whitehouse.gov/briefings-statements/2025/10/presidential-message-on-national-youth-substance-abuse-prevention-month/"
      },
      {
        "label": "Congress.gov — H.Res.846, Original National Domestic Violence Awareness Month Resolution of 2025",
        "url": "https://www.congress.gov/bill/119th-congress/house-resolution/846/text/ih"
      },
      {
        "label": "The National Domestic Violence Hotline — Domestic Violence Awareness Month",
        "url": "https://www.thehotline.org/stakeholders/domestic-violence-awareness-month/"
      },
      {
        "label": "The National Domestic Violence Hotline — Our History",
        "url": "https://www.thehotline.org/about/history-of-the-hotline/"
      },
      {
        "label": "Connections for Abused Women and their Children (CAWC) — Things To Know About the History of the Domestic Violence Movement",
        "url": "https://www.cawc.org/news/things-to-know-about-the-history-of-the-domestic-violence-movement/"
      },
      {
        "label": "NCADV — merger notice (redirects to The National Domestic Violence Hotline)",
        "url": "https://www.ncadv.org/"
      }
    ],
    "image": "/images/domestic-violence-awareness-month.jpg",
    "imageAlt": "United States military poster marking October as Domestic Violence Awareness Month, with a purple awareness ribbon",
    "imageCredit": "USAG-Humphreys, CC BY 2.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:United_States_Military,_Domestic_Violence_Awareness_Month_Poster_September_2011.jpg)"
  },
  {
    "slug": "national-taco-day",
    "category": "Observances",
    "title": "National Taco Day: The First Tuesday of October, Not October 4",
    "description": "National Taco Day was October 4 for years. In September 2024, Taco Bell and the registrar moved it to the first Tuesday of October, making 2026's date October 6.",
    "published": "2026-08-09",
    "updated": "2026-08-09",
    "coreSummary": "National Taco Day no longer falls on a fixed date. From 2009 through 2023 it was October 4 every year; in September 2024, National Day Calendar and Taco Bell jointly moved it to the first Tuesday of October so it always lands on Taco Tuesday. That makes it October 6, 2026, not October 4, which many older listings still show.",
    "dateRule": {
      "kind": "nth-weekday",
      "text": "The first Tuesday of October, every year. National Day Calendar and Taco Bell set this rule in September 2024, replacing the fixed October 4 date used from 2009 through 2023.",
      "source": {
        "label": "Taco Bell Newsroom / PR Newswire — National Day Calendar Officially Moves National Taco Day to Tuesday Thanks to Taco Bell (Sept. 17, 2024)",
        "url": "https://www.prnewswire.com/news-releases/national-day-calendar-officially-moves-national-taco-day-to-tuesday-thanks-to-taco-bell-302249629.html"
      },
      "occurrences": [
        {
          "date": "2026-10-06",
          "weekday": "Tuesday"
        },
        {
          "date": "2027-10-05",
          "weekday": "Tuesday"
        },
        {
          "date": "2028-10-03",
          "weekday": "Tuesday"
        },
        {
          "date": "2029-10-02",
          "weekday": "Tuesday"
        },
        {
          "date": "2030-10-01",
          "weekday": "Tuesday"
        },
        {
          "date": "2031-10-07",
          "weekday": "Tuesday"
        }
      ],
      "caveat": "From 2009 through 2023, National Taco Day was fixed on October 4, and most of the internet still describes it that way. National Today's own page, as indexed for 2026, still lists \"October 4, 2026,\" which is a Sunday; that is out of date. In September 2024, Taco Bell, which had spent the prior year freeing the phrase \"Taco Tuesday\" from trademark restrictions nationwide, worked with National Day Calendar, the self-described registrar of the observance since 2013, to move the date permanently to the first Tuesday of October. National Day Calendar founder Marlo Anderson confirmed the change under his own name. The new rule first applied in 2024, moving that year's observance from Friday, October 4 to Tuesday, October 1. It is not a one-time promotional stunt. In 2025, the actual deals run by both Taco Bell and Del Taco, the chain whose 2009 press release popularized October 4 in the first place, landed on Tuesday, October 7, not October 4. For 2026, the first Tuesday of October is October 6. Sites that have not updated their listings will still show October 4."
    },
    "founding": {
      "status": "documented",
      "text": "There were two unrelated \"National Taco Day\" observances under the same name, a generation apart. The first was a real congressional recognition: San Antonio publicist Roberto L. Gomez built a National Taco Council in the 1960s, and Congressman Henry B. Gonzalez recognized National Taco Week from the floor of the House on April 30, 1968, naming May 3, his own birthday, as National Taco Day, entered into the Congressional Record. That observance has no connection to today's date. It faded after Gomez's National Taco Council stopped appearing in newspaper archives around 1980, and Gomez himself died in 1983. The modern October 4 observance traces to a separate, far less documented chain. Austin chain Chuy's Tex-Mex tried to trademark \"National Taco Day\" for June 12 in 2000; the U.S. Patent and Trademark Office rejected the application for reasons it did not record. Newspapers nonetheless referred to \"Chuy's National Taco Day\" on June 12 through 2004, when unnamed \"books and websites\" began citing October 4 instead. Gustavo Arellano, the food journalist and author who investigated the history for L.A. Taco, could find no record of who made that switch or why. What is documented is what happened next: Del Taco issued a press release in 2009 declaring \"Time to Celebrate National Taco Day,\" San Antonio chain Taco Cabana followed suit on October 4 in 2010, and National Day Calendar, which says it has curated and registered national days since 2013, formally adopted October 4 that year. In September 2024, National Day Calendar founder Marlo Anderson and Taco Bell's chief marketing officer jointly announced, on the record and under their own names, that the date would move to the first Tuesday of October going forward.",
      "source": {
        "label": "L.A. Taco — The True Story of How National Taco Day Was Invented, Then Appropriated (Gustavo Arellano)",
        "url": "https://lataco.com/the-true-story-of-how-national-taco-day-was-invented-then-appropriated"
      }
    },
    "sections": [
      {
        "heading": "What National Taco Day is",
        "body": [
          "National Taco Day is an unofficial food observance that, as of 2026, no longer has a single fixed date. It carries no legal or governmental status: nothing about it is in federal law, and government offices, banks, and the postal service run on their ordinary schedule regardless of which Tuesday it lands on.",
          "In practice, the day functions as a marketing calendar slot for restaurant chains (Taco Bell, Del Taco, Chipotle, Moe's Southwest Grill, Rubio's, and Jack in the Box are among those that have run October promotions tied to it) and as a prompt for home cooks and food media to post about tacos, the same social-media-first pattern that built [National Coffee Day](/national-coffee-day/) into a fixture on brand calendars. What makes this particular \"national day\" worth a page of its own is not the taco itself but the fact that the date moved, on the record, within the last two years, and much of the internet has not caught up."
        ]
      },
      {
        "heading": "The date changed in 2024, but most sites still show the old one",
        "body": [
          "For fifteen years, National Taco Day meant October 4. That changed on September 17, 2024, when Taco Bell and National Day Calendar jointly announced they were moving the observance to the first Tuesday of October, permanently, so it would always coincide with the chain's long-running \"Taco Tuesday\" promotion.",
          "<div style=\"margin:12px 0;padding:18px 20px;background:#f8fafc;border-left:4px solid #4a5568;border-radius:8px;\"><p style=\"margin:0;font-size:1.05rem;font-style:italic;color:#1e293b;line-height:1.6;\">&ldquo;For years, we've celebrated National Taco Day on October 4th, but it's always felt like there was a bigger opportunity to align it with something even more special&mdash;Taco Tuesday. &hellip; Thanks to Taco Bell's efforts, we're excited to officially move National Taco Day to the first Tuesday in October, creating the Taco Tuesday of all Taco Tuesdays.&rdquo;</p><p style=\"margin:8px 0 0;font-size:0.8125rem;color:#64748b;\">Marlo Anderson, founder, National Day Calendar, September 17, 2024</p></div>",
          "The change was not cosmetic. It took effect immediately: 2024's observance moved from Friday, October 4 to Tuesday, October 1, with National Day Calendar's own site updating its listing to match. The following year, both Taco Bell and Del Taco ran their National Taco Day promotions on Tuesday, October 7, 2025, not October 4. For 2026, the first Tuesday of October is October 6.",
          "The gap between the new rule and old habit is easy to check. National Today's page for the day, live and indexed for 2026 at the time this was written, still lists \"October 4, 2026.\" October 4, 2026 is a Sunday. The two biggest players in the observance's own history, the chain that popularized it and the entity that registers it, have both moved on. A large share of the secondary calendar sites that copy from each other have not."
        ]
      },
      {
        "heading": "Why a chain restaurant could just move a national holiday",
        "body": [
          "The 2024 move was possible only because of something Taco Bell had done to itself the year before. \"Taco Tuesday\" had been trademarked in different states by two other companies, most prominently Taco John's, which held the mark in most of the country. Taco Bell filed legal petitions on May 16, 2023 to cancel those registrations, arguing the phrase had become generic. The campaign's final obstacle fell on October 20, 2023, when the last outstanding state registration was abandoned; Taco Bell announced \"Taco Tuesday\" free for use in all 50 states four days later, on October 24.",
          "That mattered because National Day Calendar could not previously have tied a registered observance to a phrase someone else owned without risking a trademark dispute. Once \"Taco Tuesday\" belonged to no one, moving National Taco Day onto it became a straightforward marketing decision rather than a legal one, which is also why the change could be announced and implemented within a single year, unlike most observances, where National Day Calendar itself says alterations are \"a rarity.\""
        ]
      },
      {
        "heading": "Nobody can name who first said October 4",
        "body": [
          "The most commonly repeated version of this story, that Del Taco invented National Taco Day in 2009, is not quite what happened, and Del Taco itself never claimed it did. Its 2009 press release, headlined \"Time to Celebrate National Taco Day!,\" was a promotional item, not an origination claim; a company marketing executive was quoted only as saying the taco \"deserves this attention,\" not that Del Taco had picked the date.",
          "The October 4 date itself predates that release by several years and has no identified author. Before it, an Austin chain called Chuy's Tex-Mex had tried to establish its own \"National Taco Day\" on a different date, June 12, filing a federal trademark application in 2000. The U.S. Patent and Trademark Office rejected the application without recording a reason, but newspapers kept referring to \"Chuy's National Taco Day\" on June 12 through at least 2004. Sometime after that, according to L.A. Taco's Gustavo Arellano, who searched newspaper archives and the Lexis-Nexis database for this specifically, \"books and websites\" began asserting that the real day was October 4 instead. No source, article, or registration from that period names who made the switch or explains the reasoning. Del Taco's 2009 press release is simply the first clearly documented, named party to publicly and forcefully back that date; Taco Cabana followed in 2010, and National Day Calendar folded it into its official register in 2013.",
          "That gap matters for anyone tempted to write a tidy founding story. The most-repeated fact about this observance, that Del Taco started it, compresses a murkier, undocumented handoff into something that sounds more certain than the record supports, the same kind of compression [National Boyfriend Day](/national-boyfriend-day/) suffers when a hedged 2014 guess gets repeated across calendar sites until it reads like settled fact."
        ]
      },
      {
        "heading": "The forgotten first National Taco Day: a congressman's birthday",
        "body": [
          "Almost no calendar site mentions that a National Taco Day existed decades before October 4 did, and that it was, unusually for this category of observance, actually recognized by Congress.",
          "The story starts with Roberto L. Gomez, a San Antonio civic organizer who spent the 1960s sending increasingly large novelty foods to U.S. presidents (a 48-pound tamale to John F. Kennedy in 1961, a 55-pound taco to Lyndon B. Johnson in 1964) as tongue-in-cheek reminders of Mexican-American political influence. Gomez's group, the San Antonio Social Civic Organization, evolved into the National Taco Council, and by 1967 had convinced San Antonio's mayor to proclaim a National Taco Week leading into Cinco de Mayo.",
          "Congressman Henry B. Gonzalez, who represented San Antonio, took the cause to Washington. On April 30, 1968, he recognized National Taco Week, April 28 through May 4, from the floor of the House, with his remarks entered into the Congressional Record. Within that week, he designated May 3, his own birthday, as National Taco Day. Gonzalez returned to the House floor in 1974 to mark the council's expansion into a full National Taco Month, sponsored in Texas by Kraft Foods and two regional breweries.",
          "This observance faded rather than being replaced. L.A. Taco found no record of the National Taco Council appearing in newspaper archives or the Lexis-Nexis database after 1980; Gomez died in 1983. When \"National Taco Day\" resurfaced in the public record more than three decades later, first as Chuy's rejected 2000 trademark bid for June 12 and then as the October 4 date Del Taco popularized in 2009, none of the parties involved connected it back to Gonzalez's 1968 designation of May 3. The two observances share a name and nothing else, a clean break unlike [National Dog Day](/national-dog-day/), where a single founder's account has stayed continuously attached to the same date since 2004."
        ],
        "image": {
          "src": "/images/national-taco-day-timeline.svg",
          "alt": "Timeline showing National Taco Day's history from Congress naming May 3 in 1968 through the 2024 move to the first Tuesday of October",
          "credit": ""
        }
      }
    ],
    "faq": [
      {
        "question": "What day is National Taco Day in 2026?",
        "answer": "October 6, 2026, a Tuesday. That follows the rule National Day Calendar and Taco Bell set in September 2024: the first Tuesday of October, every year. Some calendar sites have not updated and still list October 4, 2026, which falls on a Sunday."
      },
      {
        "question": "Why did National Taco Day move from October 4?",
        "answer": "Taco Bell asked National Day Calendar to move it after Taco Bell legally freed the phrase \"Taco Tuesday\" from trademark restrictions in all 50 states in October 2023. With the phrase no longer owned by anyone, National Day Calendar founder Marlo Anderson agreed in September 2024 to permanently shift National Taco Day to the first Tuesday of October, so the two would always coincide."
      },
      {
        "question": "Who actually started National Taco Day?",
        "answer": "No single named person is credited with choosing October 4 specifically. Del Taco's 2009 press release is the first clearly documented company to publicly promote that date, but it followed an earlier, unattributed shift to October 4 in \"books and websites\" around 2004, after a rejected 2000 trademark attempt by Chuy's Tex-Mex for a different date, June 12."
      },
      {
        "question": "Is National Taco Day a federal holiday?",
        "answer": "No. It has no legal or governmental status. Government offices, banks, and postal service operate on their normal schedule on National Taco Day, regardless of which date is used."
      },
      {
        "question": "Is this the same National Taco Day that Congress recognized in 1968?",
        "answer": "No. Congressman Henry B. Gonzalez designated May 3, 1968 as National Taco Day, tied to a San Antonio civic group called the National Taco Council. That observance faded from public record after 1980 and has no documented connection to the October 4 date that emerged independently in the 2000s."
      }
    ],
    "sources": [
      {
        "label": "L.A. Taco — The True Story of How National Taco Day Was Invented, Then Appropriated (Gustavo Arellano)",
        "url": "https://lataco.com/the-true-story-of-how-national-taco-day-was-invented-then-appropriated"
      },
      {
        "label": "Taco Bell Newsroom / PR Newswire — National Day Calendar Officially Moves National Taco Day to Tuesday Thanks to Taco Bell (Sept. 17, 2024)",
        "url": "https://www.prnewswire.com/news-releases/national-day-calendar-officially-moves-national-taco-day-to-tuesday-thanks-to-taco-bell-302249629.html"
      },
      {
        "label": "National Day Calendar — National Taco Day (current listing, first Tuesday in October)",
        "url": "https://nationaldaycalendar.com/celebrations/national-taco-day-first-tuesday-in-october"
      },
      {
        "label": "National Today — National Taco Day, October 4, 2026 (listing not yet updated to the 2024 rule change)",
        "url": "https://nationaltoday.com/national-taco-day/"
      },
      {
        "label": "AOL / Taco Bell Newsroom — Taco Bell's National Taco Day deals for Tuesday, Oct. 7, 2025",
        "url": "https://www.aol.com/articles/taco-bells-national-taco-day-120320719.html"
      }
    ],
    "image": "/images/national-taco-day.jpg",
    "imageAlt": "Interior of a taco restaurant, The Taco Project in Tarrytown, New York",
    "imageCredit": "Photo by Katlyn Giberson, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:The_Taco_Project,_Tarrytown,_United_States_(Unsplash).jpg), CC0"
  },
  {
    "slug": "national-hispanic-heritage-month",
    "category": "Observances",
    "title": "National Hispanic Heritage Month: Signed 1988, Proclaimed 1989",
    "description": "Hispanic Heritage Month runs September 15 to October 15 every year, set by a 1988 law, though the first month-long proclamation waited until 1989.",
    "published": "2026-08-10",
    "updated": "2026-08-10",
    "coreSummary": "National Hispanic Heritage Month runs from September 15 through October 15 every year, a range now codified at 36 U.S.C. § 126. Congress expanded the observance from a single week to a full month in August 1988, but President Reagan's own proclamation that same September still covered only the old week and cited none of the new law. The first proclamation to actually designate a full Hispanic Heritage Month came a year later, from President George H.W. Bush in September 1989, one of the 19 cosponsors of the original 1968 bill that started the observance as a week.",
    "dateRule": {
      "kind": "fixed",
      "text": "National Hispanic Heritage Month runs from September 15 through October 15 every year, under a standing federal law that requests an annual presidential proclamation. Unlike most awareness months on this calendar, it does not track a single calendar month: it begins in the middle of September and ends in the middle of October, crossing two months every year.",
      "source": {
        "label": "36 U.S.C. § 126 — National Hispanic Heritage Month (Legal Information Institute, Cornell Law School)",
        "url": "https://www.law.cornell.edu/uscode/text/36/126"
      },
      "occurrences": [
        { "date": "2026-09-15", "weekday": "Tuesday" },
        { "date": "2027-09-15", "weekday": "Wednesday" },
        { "date": "2028-09-15", "weekday": "Friday" },
        { "date": "2029-09-15", "weekday": "Saturday" },
        { "date": "2030-09-15", "weekday": "Sunday" },
        { "date": "2031-09-15", "weekday": "Monday" }
      ],
      "caveat": "There's no dispute about the boundaries themselves: federal law, advocacy groups, and calendar sites all agree the observance runs from September 15 through October 15, and the table above lists September 15 as each year's start with the range understood to extend through October 15. What genuinely varies between sources is which year gets credited as the first Hispanic Heritage Month. Congress signed the law expanding the week-long observance to a full month on August 17, 1988, in time for that year's September window, but President Reagan's own proclamation that September, dated September 13, 1988, still designated only \"the week beginning September 11, 1988\" and cited solely the original 1968 statute. The first proclamation to actually invoke a full month came from President George H.W. Bush the following year, on September 14, 1989. Sources that list 1988 as the founding year are describing when the law passed; 1989 is when a President first proclaimed the month the law created."
    },
    "founding": {
      "status": "documented",
      "text": "The observance began as a week, not a month. On June 11, 1968, California Congressman George E. Brown introduced House Joint Resolution 1299, asking the President to proclaim annually the week including September 15 and 16 as \"National Hispanic Heritage Week.\" Nineteen cosponsors signed on, including two of the small number of Hispanic members then in Congress, Edward R. Roybal of California and Henry B. Gonzalez of Texas, along with 16 other representatives from five southwestern states and one from New York. One freshman Republican cosponsor from Texas, George H.W. Bush, would later matter to this story in a different way.\n\nThe bill moved quickly: it passed the House with a single amendment trimming its supporting language, cleared the Senate Judiciary Committee without changes, and President Lyndon Johnson signed it on September 17, 1968, as Public Law 90-498. Johnson issued the first Hispanic Heritage Week proclamation that same day.\n\nNineteen years later, in 1987, Representative Esteban Torres of California introduced H.R. 3182 to stretch the single week into a full month, arguing that a week left too little time to properly organize events. Torres's bill died in a House committee. What actually became law was a separate Senate companion, S. 2200, introduced by Senator Paul Simon of Illinois; it passed both chambers, and Reagan signed it as Public Law 100-402 on August 17, 1988, replacing \"week\" with \"month\" in the 1968 statute and fixing the range at September 15 through October 15.\n\nThe first President to actually proclaim a full Hispanic Heritage Month, rather than the old week, was George H.W. Bush, on September 14, 1989. Twenty-one years earlier, as a young Texas congressman, Bush had been one of the 19 names on Brown's original bill.",
      "source": {
        "label": "National Archives, Pieces of History — Origins of National Hispanic Heritage Month (Kate Mollan, Center for Legislative Archives)",
        "url": "https://prologue.blogs.archives.gov/2017/09/25/origins-of-national-hispanic-heritage-month/"
      }
    },
    "sections": [
      {
        "heading": "September 15 to October 15, not a calendar month",
        "body": [
          "National Hispanic Heritage Month runs from September 15 through October 15 every year. That's a real oddity on this calendar: most federally designated months here, Domestic Violence Awareness Month among them, track a single calendar month start to finish. This one opens in the middle of September and closes in the middle of October, crossing two calendar months every year without exception.",
          "The range wasn't picked as a round number. September 15 is the shared independence anniversary of five Central American countries (Costa Rica, El Salvador, Guatemala, Honduras, and Nicaragua), all of which declared independence from Spain on that date in 1821. Mexico's independence day, September 16, and Chile's independence day, September 18, both fall within the first few days of the window. October 12, long marked across much of Latin America as Día de la Raza, lands near the end of it. The 31-day span was drawn to bracket that whole cluster of national days, not to round out a tidy month."
        ]
      },
      {
        "heading": "Nineteen cosponsors, one future President",
        "body": [
          "On June 11, 1968, California Congressman George E. Brown introduced House Joint Resolution 1299, asking the President to proclaim a week each September in recognition of the country's Hispanic population. Nineteen cosponsors signed on, including two of the small number of Hispanic members then serving in Congress, Edward R. Roybal of California and Henry B. Gonzalez of Texas, alongside representatives from Colorado, New Mexico, Arizona, and one from New York. One cosponsor was a Republican freshman from Texas: George H.W. Bush.",
          "The bill had an easy path. It passed the House with a single amendment that trimmed its supporting language down to a short operative text, then cleared the Senate Judiciary Committee without further changes. President Lyndon Johnson signed it into law on September 17, 1968, as Public Law 90-498, and issued the first National Hispanic Heritage Week proclamation, Proclamation 3869, that same day."
        ]
      },
      {
        "heading": "The bill that died, and the one that didn't",
        "body": [
          "Nineteen years later, in 1987, Representative Esteban Torres of California introduced H.R. 3182 to stretch the single week into a full month, arguing that a week didn't leave enough time to properly coordinate events and activities. Torres's bill died in a House committee and never reached a vote.",
          "What actually became law was a separate bill. Senator Paul Simon of Illinois introduced a companion measure, S. 2200, that used the same core change Torres had proposed: deleting \"week\" from the 1968 statute and inserting \"month.\" Simon's bill passed both chambers, and President Reagan signed it as Public Law 100-402 on August 17, 1988, fixing the new range at September 15 through October 15. It's a detail a lot of retrospectives flatten, crediting Torres alone with creating the month. His bill supplied the idea and the language Simon's bill reused, but it was Simon's Senate version, not Torres's House one, that Reagan actually signed."
        ]
      },
      {
        "heading": "The month nobody proclaimed in 1988",
        "body": [
          "Here's the part most calendar sites skip. Reagan signed the new month-long law on August 17, 1988, weeks before that year's September 15 start date. But when the White House issued its proclamation that September, it wasn't for a month. Proclamation 5859, dated September 13, 1988, designates \"the week beginning September 11, 1988\" as National Hispanic Heritage Week, and cites only \"the Congress, by Joint Resolution approved September 17, 1968 (Public Law 90-498)\" as its authority. There is no mention of the new law Reagan himself had signed a month earlier.",
          "The first proclamation to actually invoke the amended law came from Reagan's successor. On September 14, 1989, President George H.W. Bush proclaimed \"the month beginning September 15, 1989, and ending October 15, 1989\" as National Hispanic Heritage Month, citing Public Law 90-498 \"as amended,\" language that acknowledges the 1988 change. By then, Bush was 21 years removed from being one of the freshman cosponsors of Brown's original week-long bill."
        ],
        "image": {
          "src": "/images/national-hispanic-heritage-month-timeline.svg",
          "alt": "Timeline showing National Hispanic Heritage Month's path from the 1968 bill, through the 1988 law expanding it to a month, to Bush's first month-long proclamation in 1989 and its 1998 recodification"
        }
      },
      {
        "heading": "Fixed in the U.S. Code, observed unevenly since",
        "body": [
          "The observance got a permanent home in federal law in 1998, when Congress recodified Title 36 of the U.S. Code, the \"Patriotic and National Observances\" title, and the statute became 36 U.S.C. § 126. The text is short: the President is \"requested\" to issue a proclamation each year designating September 15 through October 15 and calling on the country, \"especially the educational community,\" to observe it.",
          "That standing law is why the date range itself has never been in real dispute the way some observances on this calendar have been. What varies from year to year is the timing of the proclamation, not the dates it covers. In 2025, the White House proclamation wasn't signed until September 22, according to the Federal Register's own record of the document, a full week after the observance had already begun and later than each of the four proclamations issued during the same President's first term, all of which had gone out at least a day before September 15.",
          "This calendar carries a small cluster of federally designated months with a similar shape: grassroots or congressional origins, formal recognition years after the fact, and a modern practice of presidential proclamation that doesn't always move in lockstep with the underlying law. [Domestic Violence Awareness Month](/domestic-violence-awareness-month/), whose October dates overlap the back half of this window, took a different route to federal status. Congress designated it by name for one specific year, 1989, then renewed that designation once more for 1991, before Presidents began proclaiming the month on their own authority rather than under a standing law like this one. [National Grandparents Day](/national-grandparents-day/), observed just days before this window opens each year, needed a presidential proclamation and a separate act of Congress a year apart before its own date was settled. National Hispanic Heritage Month carries no legal holiday status either: no federal offices close and no paid leave attaches to it anywhere in the country, and it does not appear among the holidays listed at 5 U.S.C. § 6103(a)."
        ]
      }
    ],
    "faq": [
      {
        "question": "What are the exact dates of National Hispanic Heritage Month?",
        "answer": "September 15 through October 15 every year, fixed by federal law at 36 U.S.C. § 126 rather than tied to a weekday or a single calendar month. The range crosses September and October every year without exception."
      },
      {
        "question": "Who founded National Hispanic Heritage Month?",
        "answer": "California Congressman George E. Brown introduced the original bill, House Joint Resolution 1299, in June 1968, with 19 cosponsors including Edward Roybal, Henry Gonzalez, and a young Texas congressman named George H.W. Bush. President Lyndon Johnson signed it into law that September as Public Law 90-498, starting the observance as a single week rather than a month."
      },
      {
        "question": "Was 1988 or 1989 the first National Hispanic Heritage Month?",
        "answer": "The law expanding the week to a month, Public Law 100-402, was signed in August 1988, but the first proclamation to actually designate a full month came from President George H.W. Bush in September 1989. Reagan's own proclamation in September 1988 still covered only a week and cited exclusively the original 1968 law, not the new one he had just signed."
      },
      {
        "question": "Why does National Hispanic Heritage Month start on September 15 specifically?",
        "answer": "September 15 is the shared independence anniversary of five Central American countries (Costa Rica, El Salvador, Guatemala, Honduras, and Nicaragua) that all declared independence from Spain on that date in 1821. Mexico's independence day, September 16, and Chile's independence day, September 18, both fall within the same window."
      },
      {
        "question": "Why isn't Representative Esteban Torres usually credited as the sole founder of the month-long version?",
        "answer": "Torres did introduce the original bill to expand the week into a month, H.R. 3182, in 1987, but it died in a House committee and never came to a vote. The bill that actually became law, Public Law 100-402, was a separate Senate measure introduced by Senator Paul Simon of Illinois, using language similar to what Torres had proposed."
      },
      {
        "question": "Is National Hispanic Heritage Month a federal holiday?",
        "answer": "No. It does not appear among the federal holidays listed at 5 U.S.C. § 6103(a), no federal offices close for it, and no paid leave attaches to it anywhere in the country. It is an awareness observance backed by a standing federal law that requests an annual presidential proclamation, not a legal holiday."
      },
      {
        "question": "Does the President have to issue a proclamation every year?",
        "answer": "The statute requests a proclamation rather than requiring one, and timing has varied by administration. In 2025, the proclamation wasn't signed until September 22, a week after the observance had already begun, according to the Federal Register's record of the document."
      }
    ],
    "sources": [
      {
        "label": "36 U.S.C. § 126 — National Hispanic Heritage Month (Legal Information Institute, Cornell Law School)",
        "url": "https://www.law.cornell.edu/uscode/text/36/126"
      },
      {
        "label": "National Archives, Pieces of History — Origins of National Hispanic Heritage Month (Kate Mollan, Center for Legislative Archives)",
        "url": "https://prologue.blogs.archives.gov/2017/09/25/origins-of-national-hispanic-heritage-month/"
      },
      {
        "label": "H.J.Res.1299, 90th Congress (1968) — full text and status (GovTrack)",
        "url": "https://www.govtrack.us/congress/bills/90/hjres1299"
      },
      {
        "label": "Ronald Reagan — Proclamation 5859, National Hispanic Heritage Week, 1988 (The American Presidency Project)",
        "url": "https://www.presidency.ucsb.edu/documents/proclamation-5859-national-hispanic-heritage-week-1988"
      },
      {
        "label": "George Bush — Proclamation 6021, National Hispanic Heritage Month, 1989 (The American Presidency Project)",
        "url": "https://www.presidency.ucsb.edu/documents/proclamation-6021-national-hispanic-heritage-month-1989"
      },
      {
        "label": "H.R.3182, 100th Congress (1987-1988) — bill to amend Public Law 90-498 (Congress.gov)",
        "url": "https://www.congress.gov/bill/100th-congress/house-bill/3182"
      },
      {
        "label": "The Creation and Evolution of the National Hispanic Heritage Celebration — U.S. House of Representatives: History, Art & Archives",
        "url": "https://history.house.gov/HistoricalHighlight/Detail/15032398402"
      },
      {
        "label": "Federal Register — National Hispanic Heritage Month, 2025 (signing date record)",
        "url": "https://www.federalregister.gov/documents/2025/09/25/2025-18708/national-hispanic-heritage-month-2025"
      },
      {
        "label": "Forbes — Trump Hasn't Proclaimed Hispanic Heritage Month (Yet)—Unlike In First Term (Conor Murray, Sept. 15, 2025)",
        "url": "https://www.forbes.com/sites/conormurray/2025/09/15/trump-hasnt-proclaimed-hispanic-heritage-month-yet-unlike-in-first-term/"
      }
    ],
    "image": "/images/hispanic-heritage-month.jpg",
    "imageAlt": "U.S. Military District of Washington Joint Armed Forces Color Guard presenting the colors at a National Hispanic Heritage Month observance",
    "imageCredit": "USDA photo, public domain, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2016_Hispanic_Heritage_Observance_(20160915-DM-RBN-6802).jpg)"
  },
  {
    "slug": "no-shave-november",
    "category": "Observances",
    "title": "No-Shave November: All of November, Not the Same as Movember",
    "description": "No-Shave November runs the full month of November every year. A Chicago family started it on Facebook in 2009, and it is a separate campaign from Movember.",
    "published": "2026-08-10",
    "updated": "2026-08-10",
    "coreSummary": "No-Shave November is observed across all of November, every year, in the United States. It began in 2009 as a Facebook page started by the Hill family of the Chicago area in memory of their father, Matthew Hill, who died of colon cancer, and it now operates under Fight Colorectal Cancer. No act of Congress or presidential proclamation established it, and it is a separate campaign from Movember, not another name for the same thing.",
    "dateRule": {
      "kind": "fixed",
      "text": "No-Shave November is observed across all of November, every year, from November 1 through November 30, rather than on a single date or a floating week within the month. The nonprofit that runs the campaign sets and repeats this range each year on its own; no law fixes it.",
      "status": "conventional",
      "source": {
        "label": "No Shave November — Our History (no-shave.org, operated by Fight Colorectal Cancer)",
        "url": "https://no-shave.org/"
      },
      "occurrences": [
        { "date": "2026-11-01", "weekday": "Sunday" },
        { "date": "2027-11-01", "weekday": "Monday" },
        { "date": "2028-11-01", "weekday": "Wednesday" },
        { "date": "2029-11-01", "weekday": "Thursday" },
        { "date": "2030-11-01", "weekday": "Friday" },
        { "date": "2031-11-01", "weekday": "Saturday" }
      ],
      "caveat": "There is no rival date range to sort out: every source, from the organizing nonprofit to news coverage to competing calendar sites, agrees the full month of November is No-Shave November. What is missing, compared to most other observances on this calendar, is any government body behind that date. Louisiana's legislature is the only one found to have recognized the campaign by name, and even that was for a single year: House Concurrent Resolution No. 20 of the 2014 Regular Session urged the state to recognize \"November 2014\" as No-Shave November, not a standing annual designation. No President has ever proclaimed it, and Congress has not designated it nationally in any year. The month itself is not in question; the legal authority behind it simply does not exist."
    },
    "founding": {
      "status": "documented",
      "text": "No-Shave November traces to a single family's loss. Matthew Hill, of the Chicago area, died of colon cancer in November 2007. In 2009, his eldest daughter, Rebecca Hill, working with a friend, started a Facebook page called No-Shave November on behalf of the family, asking people to skip shaving and grooming for the month and donate what they would have spent on razors and haircuts to cancer research instead. The idea was to let hair grow as a visible stand-in for what chemotherapy patients lose. The first year raised about $2,000.\n\nThe campaign grew fast from there. It is widely reported to have partnered with the American Cancer Society in 2013, broadening its reach beyond the Hill family's own network. Nonprofit registries list the Matthew Hill Foundation, Inc. (EIN 47-3673254) as the organization formed in 2015 to run the campaign as a registered 501(c)(3). In 2024, the campaign changed hands again: it moved to Fight Colorectal Cancer (Fight CRC), a Springfield, Missouri-based nonprofit focused on colorectal cancer, which now operates No-Shave November directly. Fight CRC's own materials describe the current partner charities as Man Up To Cancer and the Prevent Cancer Foundation alongside Fight CRC itself, and state plainly, in their own words, \"We proudly carry forward the Hill family's inspiring legacy.\"\n\nWhat is documented and what is not documented are worth separating here. That the campaign began in 2009 as a Hill family project and that it moved to Fight CRC in 2024 both appear on the organization's own site, in general terms. The specific details of who led the 2009 launch, Rebecca Hill and a friend, and the roughly $2,000 raised in the first year, come from contemporaneous news coverage rather than the organization's own current site text. The 2013 American Cancer Society partnership and the 2015 foundation date rest on nonprofit trackers and news coverage in the same way, rather than a single primary announcement. That is a lower bar than a founder naming their own year on the record, but a considerably higher one than the vague \"has been celebrated since\" language most calendar sites use for this observance.",
      "source": {
        "label": "No Shave November — Our History (no-shave.org, operated by Fight Colorectal Cancer)",
        "url": "https://no-shave.org/"
      }
    },
    "sections": [
      {
        "heading": "The whole month, run by a nonprofit, not a government",
        "body": [
          "No-Shave November covers all 30 days of November, not a single date or a week inside it. On the calendar question, that makes this one of the simpler entries on this site: there is no nth-weekday arithmetic, no floating date, and no rival organization proposing different days. November 1 marks the start of each year's observance in the table above; it runs through November 30 in every case.",
          "What sets this observance apart from most others on this calendar is not the date but the absence of any government behind it. Domestic Violence Awareness Month needed a joint resolution and a presidential proclamation. National Hispanic Heritage Month needed two separate acts of Congress a generation apart. No-Shave November has never had either. It is, from 2009 to today, a campaign a private nonprofit runs on its own authority, and that distinction matters more here than the dates do."
        ]
      },
      {
        "heading": "A family's tribute, 2007 to 2009",
        "body": [
          "Matthew Hill, of the Chicago area, died of colon cancer in November 2007. Two years later, his eldest daughter, Rebecca Hill, working with a friend, started a Facebook page called No-Shave November, inviting anyone to stop shaving for the month and give the money they would have spent on razors, haircuts, and shaving cream to cancer research instead. The reasoning the family gave for the idea was simple: cancer patients undergoing chemotherapy often lose their hair, so growing hair out for a month was a way to grow it for those who could not.",
          "The first year raised roughly $2,000, a small enough sum that nothing about the campaign's early history reads as inevitable. What followed was closer to how a lot of internet fundraising actually spreads: word of mouth, then local news coverage, then eventually national attention, with the family's youngest members handling logistics like bracelet orders and support emails alongside their older siblings well into the campaign's second decade."
        ],
        "image": {
          "src": "/images/no-shave-november-timeline.svg",
          "alt": "Timeline showing No-Shave November's path from Matthew Hill's death in 2007 through the Hill family's 2009 Facebook launch to the campaign's 2024 move to Fight Colorectal Cancer"
        }
      },
      {
        "heading": "From a Facebook page to a registered nonprofit",
        "body": [
          "The campaign's organizational history since 2009 runs through a few identifiable steps, though not all of them are documented with the same precision as the founding itself. Reporting on the campaign describes a 2013 partnership with the American Cancer Society, which broadened its scope from the Hill family's own network into a more general cancer-research fundraising effort. Nonprofit registries separately list the Matthew Hill Foundation, Inc. as formed in 2015 to formalize the campaign as a tax-exempt organization.",
          "The most recent change is also the best documented, because the organization itself states it plainly: in 2024, No-Shave November moved to Fight Colorectal Cancer, a national nonprofit headquartered in Springfield, Missouri. Fight CRC's own site describes the current arrangement as continuing the Hill family's work rather than replacing it, and lists Man Up To Cancer and the Prevent Cancer Foundation as the campaign's other current partner charities."
        ]
      },
      {
        "heading": "No-Shave November is not Movember",
        "body": [
          "The two campaigns are frequently confused, and the confusion runs in both directions: some assume No-Shave November is simply the American name for Movember, and others assume the reverse. Neither is true. Movember started in 2003 in Melbourne, Australia, when Travis Garone and Luke Slattery encouraged friends to grow mustaches for the month, initially in support of prostate cancer research; it later broadened to cover men's mental health and suicide prevention as well. No-Shave November started six years later and an ocean away, out of one Chicago family's loss.",
          "The rules differ, too. Movember asks participants to start the month clean-shaven and grow a mustache only, nothing else. No-Shave November has no such requirement: the instruction is simply not to shave, full stop, whether that means a beard, a mustache, or, for women who choose to participate, skipping other hair removal. Fight CRC's own rules page puts it this way: some people avoid shaving anything, others focus on one area, and the campaign leaves the specifics up to the participant. Two different nonprofits, two different rule sets, and two founding stories that never intersect."
        ]
      },
      {
        "heading": "What counts as participating",
        "body": [
          "No-Shave November carries no legal status of any kind. No federal or state offices close for it, and no workplace is required to recognize it. Participation is entirely informal: skip shaving and grooming for the month, and either pledge the money saved directly or simply donate to one of the campaign's partner charities. Fight CRC's fundraising pages let individuals or teams set their own targets, and businesses can register as sponsors.",
          "Because the campaign was reinvented by a family rather than legislated into existence, its shape has shifted more than most observances on this calendar without ever changing its dates. What has stayed constant since 2009 is the core idea: let hair grow as a visible reminder of what cancer patients lose, and redirect a month of grooming money toward research instead."
        ]
      },
      {
        "heading": "Where this fits among grassroots observances",
        "body": [
          "No-Shave November belongs to a small group of observances on this calendar that a private individual or family started and that never picked up federal backing at all. [National Sons Day](/national-sons-day/) has a documented founder for its March 4 date, Jill Nico in 2018, but like this campaign, no federal recognition of any kind; a rival September 28 date for that same observance circulates widely with no traceable origin at all. [Red Ribbon Week](/red-ribbon-week/), by contrast, has been organized every year since 1988 by a single nonprofit, not a federal agency, much like this campaign, though its founding traces to a slain DEA agent rather than a private family's loss. [Domestic Violence Awareness Month](/domestic-violence-awareness-month/) shows the other path entirely: an advocacy-founded observance that did eventually get a congressional designation, if only for two specific years."
        ]
      }
    ],
    "faq": [
      {
        "question": "What are the dates of No-Shave November?",
        "answer": "The entire month of November, every year, from November 1 through November 30. It is not tied to a single date or a floating week within the month."
      },
      {
        "question": "Who founded No-Shave November?",
        "answer": "The Hill family of the Chicago area, in 2009. Matthew Hill died of colon cancer in November 2007, and two years later his eldest daughter, Rebecca Hill, working with a friend, started a Facebook page inviting people to skip shaving for the month and donate what they saved to cancer research."
      },
      {
        "question": "Is No-Shave November the same as Movember?",
        "answer": "No. Movember started in 2003 in Melbourne, Australia, and asks participants to start the month clean-shaven and grow a mustache only. No-Shave November started in 2009 in the Chicago area and has no clean-shave requirement, allowing any form of not shaving. They are separately founded, separately run campaigns that happen to overlap on the calendar."
      },
      {
        "question": "Is No-Shave November a federal holiday or an official government observance?",
        "answer": "No. No President has ever proclaimed it and Congress has not designated it nationally. Louisiana's legislature passed a one-year resolution recognizing \"November 2014\" specifically, but no comparable federal or standing state recognition exists."
      },
      {
        "question": "What organization runs No-Shave November today?",
        "answer": "Fight Colorectal Cancer (Fight CRC), a national nonprofit based in Springfield, Missouri, which took over operating the campaign in 2024. Its current partner charities are Man Up To Cancer and the Prevent Cancer Foundation, alongside Fight CRC itself."
      },
      {
        "question": "Can women participate in No-Shave November?",
        "answer": "Yes. The campaign has no gender restriction. Women commonly participate by skipping other forms of hair removal for the month, fundraising, or simply supporting participants and donating directly."
      },
      {
        "question": "Do I have to start the month clean-shaven?",
        "answer": "No, and this is one of the clearest differences from Movember. No-Shave November has no clean-shave starting requirement and no restriction to a mustache; the organizers leave the specifics of what not to shave up to each participant."
      }
    ],
    "sources": [
      {
        "label": "No Shave November — Our History (no-shave.org, operated by Fight Colorectal Cancer)",
        "url": "https://no-shave.org/"
      },
      {
        "label": "Fight Colorectal Cancer — No Shave November Rules",
        "url": "https://fightcolorectalcancer.org/no-shave-november-rules/"
      },
      {
        "label": "TODAY — 'No-Shave November' family pays tribute to dad with cancer fundraiser (Eun Kyung Kim, Nov. 2, 2015)",
        "url": "https://www.today.com/health/no-shave-november-family-pays-tribute-dad-cancer-fundraiser-t53456"
      },
      {
        "label": "Daffy — Matthew Hill Foundation Inc (EIN 47-3673254) nonprofit profile",
        "url": "https://www.daffy.org/charities/473673254-matthew-hill-foundation-inc-emeryville-ca"
      },
      {
        "label": "Louisiana Legislature — House Concurrent Resolution No. 20, 2014 Regular Session",
        "url": "https://legis.la.gov/Legis/ViewDocument.aspx?d=881792"
      },
      {
        "label": "The Manual — No-Shave November vs. Movember: There's a difference between these 2 causes",
        "url": "https://www.themanual.com/grooming/no-shave-november-vs-movember/"
      }
    ],
    "image": "/images/no-shave-november.jpg",
    "imageAlt": "Timeline illustration showing No-Shave November's path from a 2007 family loss to the 2024 move to Fight Colorectal Cancer"
  },
  {
    "slug": "breast-cancer-awareness-month",
    "category": "Observances",
    "title": "Breast Cancer Awareness Month: All of October, and Who Started It",
    "description": "Breast Cancer Awareness Month covers all of October. It began in 1985 as a drug-company campaign, and no permanent federal law renews it automatically.",
    "published": "2026-08-10",
    "updated": "2026-08-10",
    "coreSummary": "Breast Cancer Awareness Month is observed across all of October, every year, in the United States. The American Cancer Society's own materials date its founding to 1985 and describe the ACS as a co-creator, without naming a corporate partner; Wikipedia and other secondary accounts add that the pharmaceutical arm of Imperial Chemical Industries (later Zeneca, then AstraZeneca) was a founding partner, and a peer-reviewed 2003 academic study dates the founding to 1984 and credits the drugmaker alone. Congress designated specific years by name through 1994; no permanent statute renews the observance automatically, and every President has simply kept proclaiming it since.",
    "dateRule": {
      "kind": "fixed",
      "text": "Breast Cancer Awareness Month is observed across all of October, every year, from October 1 through October 31, rather than on a single date or a floating week within the month. Congress first designated the observance by name for a specific year, October 1990, in Senate Joint Resolution 301, and President George Bush issued the first federal proclamation, Number 6202, that October.",
      "source": {
        "label": "George Bush — Proclamation 6202, National Breast Cancer Awareness Month, 1990 (The American Presidency Project)",
        "url": "https://www.presidency.ucsb.edu/documents/proclamation-6202-national-breast-cancer-awareness-month-1990"
      },
      "occurrences": [
        { "date": "2026-10-01", "weekday": "Thursday" },
        { "date": "2027-10-01", "weekday": "Friday" },
        { "date": "2028-10-01", "weekday": "Sunday" },
        { "date": "2029-10-01", "weekday": "Monday" },
        { "date": "2030-10-01", "weekday": "Tuesday" },
        { "date": "2031-10-01", "weekday": "Wednesday" }
      ],
      "caveat": "There is no rival date range to sort out: every source, corporate, federal, and advocacy alike, agrees the entire month of October is Breast Cancer Awareness Month, so the table above lists October 1 as each year's start with the understanding that the observance runs through October 31 in every case. What is genuinely unsettled is the founding year and the legal footing behind it. The American Cancer Society's own 2025 fortieth-anniversary materials date the founding to 1985; a peer-reviewed 2003 study in the Quarterly Journal of Speech instead states \"since 1984, October has been recognized\" as the observance, citing the founding organization's own website. Neither the 1985 nor the 1984 account is a Congressional or Presidential source, since the observance began purely as a corporate and nonprofit initiative five years before any government body acted on it. Once Congress did act, it designated specific years by name rather than passing one standing law: Senate Joint Resolution 301 for October 1990, Public Law 102-120 for October 1991, House Joint Resolution 11 for October 1993, and Public Law 103-367 for October 1994. No such year-specific designation has been found on the record since 1994; President Clinton's own October 1996 proclamation opens \"each year we set aside the month of October\" without citing any accompanying resolution, and every proclamation since has read the same way."
    },
    "founding": {
      "status": "documented",
      "text": "National Breast Cancer Awareness Month (NBCAM) began as a campaign with a pharmaceutical company involved from the start, not as a project of a government agency alone. The American Cancer Society's own materials, including its 2025 fortieth-anniversary press release, state that the ACS \"co-led the effort to start Breast Cancer Awareness Month\" as a week-long campaign in 1985 — but that ACS material does not itself name a corporate partner. The corporate partner most secondary accounts name, including Wikipedia's article on the observance, is the pharmaceutical division of Imperial Chemical Industries (ICI), a British conglomerate whose drug arm was spun off as a separate company, Zeneca, in 1993, and which merged with the Swedish company Astra AB in 1999 to form AstraZeneca.\n\nA third account complicates both of the above. A peer-reviewed 2003 study by Phaedra C. Pezzullo in the Quarterly Journal of Speech opens by stating plainly, \"Since 1984, October has been recognized in the U.S. as National Breast Cancer Awareness Month,\" and credits the founding to \"Zeneca, a subsidiary of Imperial Chemical Industries Limited\" alone, citing the observance's own website as her source, with no mention of the American Cancer Society as a founding partner at all. Between the three tellings, only the drugmaker's involvement is undisputed; the year (1985 versus 1984), whether a health charity co-founded the campaign or the drug company acted alone, and which specific company is named all vary depending on which account is followed. This page follows the ACS's own more recent and more widely repeated 1985 date while presenting the other two accounts' details, rather than silently picking one telling as definitive.\n\nNBCAM's own FAQ page, archived by the observance's organizers in 2011, credits former First Lady Betty Ford and her daughter Susan Ford Bales with an early televised appeal that \"call[ed] attention to the importance of screening\" and helped galvanize wider public interest soon after the campaign began; Ford's own mastectomy, eleven years earlier in 1974, is what first made her a public figure on the subject, but the appeal credited with helping launch the observance itself was a separate, later event.\n\nFederal recognition came five years after the campaign's own founding date, not alongside it. Congress designated \"October 1990\" as National Breast Cancer Awareness Month by Senate Joint Resolution 301, and President George Bush issued the first federal proclamation, Number 6202, that same October. Congress repeated the exercise for specific years at least three more times: Public Law 102-120 for October 1991, House Joint Resolution 11 for October 1993, and Public Law 103-367 for October 1994. No comparable year-specific designation has been found on the record after 1994. By October 1996, President Clinton's proclamation cited no resolution at all, opening simply \"each year we set aside the month of October,\" and every proclamation since has followed that same pattern: an annual custom carried out under general executive authority, not a fresh act of Congress.\n\nA separate strand of the record documents why some public-health researchers and advocacy groups have called the observance's origins into question. Zeneca Inc., the U.S. arm of the ICI drug business, began an in-house breast-cancer screening program for its own employees in 1989. In 1996, the company totaled the direct healthcare and lost-productivity costs of that program and found it had cost $400,000 to run, against an estimated $1.5 million the company would have spent had employees' cancers instead been caught at later, more expensive stages, for a calculated savings of $1.1 million. Pezzullo's peer-reviewed analysis, reading that figure directly off AstraZeneca's own NBCAM website, concludes that \"(Astra)Zeneca's initial justification for NBCAM was one of basic accounting, not a critique of how women's healthcare has been assessed or implemented nor a desire to prevent women from developing breast cancer.\"",
      "source": {
        "label": "American Cancer Society — Turning Awareness Into Action: American Cancer Society Recognizes 40 Years of Breast Cancer Awareness Month (press release)",
        "url": "https://pressroom.cancer.org/40-years-of-breast-cancer-awareness-month"
      }
    },
    "sections": [
      {
        "heading": "The whole month, every year",
        "body": [
          "There is no rival date range to reconcile here: corporate sponsors, federal proclamations, and advocacy groups all treat the full 31 days of October as Breast Cancer Awareness Month, with no nth-weekday arithmetic or floating week involved. October 1 marks the start of each year's observance in the table above; it runs through October 31 in every case.",
          "What is unsettled is not the calendar but the paperwork behind it, on two separate points: exactly which year the campaign began, and whether any law currently requires it to happen again next October. Most calendar sites skip past both questions entirely."
        ]
      },
      {
        "heading": "Founded in 1985, or 1984, by a drug company",
        "body": [
          "The American Cancer Society's own materials, including its 2025 fortieth-anniversary press release, state that the ACS \"co-led the effort to start Breast Cancer Awareness Month\" as a week-long campaign in 1985 — but that ACS material does not itself name which company it partnered with. The corporate partner most secondary accounts name, including Wikipedia's article on the observance, is the pharmaceutical division of Imperial Chemical Industries (ICI). That drug division was spun off as its own company, Zeneca, in 1993, and merged with Sweden's Astra AB in 1999 to form AstraZeneca, the company most sources now credit as the observance's corporate sponsor.",
          "A peer-reviewed 2003 study by communication scholar Phaedra C. Pezzullo, published in the Quarterly Journal of Speech, opens with a flatly different claim: \"Since 1984, October has been recognized in the U.S. as National Breast Cancer Awareness Month,\" founded, in her account, by \"Zeneca, a subsidiary of Imperial Chemical Industries Limited\" alone, without crediting the American Cancer Society as a co-founder at all. Pezzullo's source for that claim was the observance's own website as it read at the time she wrote. Between the three tellings, only the drugmaker's involvement is undisputed; the year, whether a health charity co-founded the campaign, and which specific document actually names the corporate partner all vary depending on which account is followed. Neither the ACS's nor Pezzullo's account has been shown to be simply mistaken, so both are presented here rather than one being silently preferred."
        ]
      },
      {
        "heading": "Federal recognition arrived five years later, and it was never permanent",
        "body": [
          "The campaign's own founding date, whichever year is correct, predates any government involvement by roughly five years. Congress first designated the observance by name in Senate Joint Resolution 301, which named \"October 1990\" specifically, and President George Bush issued the first federal proclamation, Number 6202, that same month. That was a one-year designation, not a standing law that renews itself.",
          "Congress went back and repeated the exercise, by name, at least three more times: Public Law 102-120 designated October 1991, House Joint Resolution 11 designated October 1993, and Public Law 103-367 designated October 1994. No comparable year-specific designation from Congress has turned up on the record since. By October 1996, President Clinton's proclamation opened with \"each year we set aside the month of October\" and cited no accompanying resolution at all, and every proclamation issued in the decades since, across multiple administrations, has followed that same pattern: an annual custom under general executive authority, not a fresh act of Congress behind each year's observance."
        ],
        "image": {
          "src": "/images/breast-cancer-awareness-month-timeline.svg",
          "alt": "Timeline from the observance's 1985 founding by the American Cancer Society and Imperial Chemical Industries through the 1990-1994 congressional designations to the 2003 academic critique of its corporate origins"
        }
      },
      {
        "heading": "The pink ribbon is a separate, later story",
        "body": [
          "It is easy to assume the pink ribbon and the awareness month arrived together. They did not. The observance itself dates to the mid-1980s, but the pink ribbon as its now-familiar symbol traces to the early 1990s: in the fall of 1991, the Susan G. Komen Foundation handed out pink ribbons to participants at its New York City Race for the Cure, and separately, a California woman named Charlotte Haley had already been distributing peach-colored ribbons of her own to protest what she saw as inadequate research funding. In 1993, Evelyn Lauder, senior corporate vice president of the Estée Lauder Companies, founded the Breast Cancer Research Foundation and formally adopted the pink ribbon as that foundation's symbol, well after Haley's peach ribbons and Komen's pink ones had already appeared. A reader who assumes the ribbon was chosen at the observance's 1985 (or 1984) founding is off by roughly a decade."
        ]
      },
      {
        "heading": "Why some public-health researchers call it pinkwashing",
        "body": [
          "The observance's corporate origins are the basis for a specific, documented line of criticism rather than a vague complaint. Zeneca Inc., the U.S. drug-business arm behind the observance's founding, started an in-house breast-cancer screening program for its own employees in 1989. In 1996, the company tallied the direct healthcare and lost-productivity costs of running that program and found it had cost $400,000, against an estimated $1.5 million the company projected it would otherwise have spent on employees whose cancers were instead caught at later, costlier stages, a calculated savings of $1.1 million. Pezzullo's 2003 peer-reviewed analysis, reading that figure directly from AstraZeneca's own NBCAM website, concludes that \"(Astra)Zeneca's initial justification for NBCAM was one of basic accounting, not a critique of how women's healthcare has been assessed or implemented nor a desire to prevent women from developing breast cancer.\"",
          "The advocacy group Breast Cancer Action has used the term pinkwashing specifically to describe companies that manufacture or use chemicals linked to cancer while simultaneously sponsoring campaigns to fight it, and ran an ongoing \"Think Before You Pink\" campaign directed in part at the observance's sponsor list. A separate coalition, the Toxic Links Coalition, formed in the San Francisco Bay Area in 1994 and has organized annual \"Stop Cancer Where It Starts\" walking tours since at least 1997, deliberately reframing October as what it calls Cancer Industry Awareness Month rather than accepting the corporate-sponsored name. The New York Times reported in October 2015 that fine-print disclaimers on some pink-branded products sold by Dick's Sporting Goods showed that, in certain cases, no money at all reached breast-cancer research, and that other companies capped their research donations each October without disclosing to shoppers when that cap had already been reached."
        ]
      },
      {
        "heading": "What the month does and does not carry with it",
        "body": [
          "Breast Cancer Awareness Month carries no federal holiday status: no federal offices close, and no paid leave attaches to it. What happens instead is decentralized: the White House has illuminated itself pink every October in recent years, NFL teams and officials incorporate pink into games throughout the month, and hospitals, employers, and local organizations run their own screening drives and fundraising walks on no fixed national schedule.",
          "One narrower observance sits inside the month and is easy to conflate with it: National Metastatic Breast Cancer Awareness Day, October 13, which the House and Senate designated by simple resolution, S.Res. 295 and H.Res. 787, specifically for 2009. Unlike the joint resolutions and public laws behind the broader month, a simple chamber resolution does not require the President's signature and does not carry the force of law, and no comparable resolution renewing the specific date has surfaced since. Advocacy groups have kept observing October 13 every year regardless, but that continuity comes from custom, not from a renewed act of Congress, the same pattern that now governs the month around it.",
          "This calendar has covered a small cluster of October observances that reached their current shape through different routes. [Domestic Violence Awareness Month](/domestic-violence-awareness-month/) followed a similar arc, a single congressional designation in 1989, repeated once in 1991, then sustained by presidential custom alone, though its founding sat with a single advocacy nonprofit rather than a drug company. [Red Ribbon Week](/red-ribbon-week/) got its own congressional proclamation for its first national year, 1988, but no standing federal statute follows it either, and it is the National Family Partnership, not the DEA, that has actually run it on fixed dates every year since. [No-Shave November](/no-shave-november/), which follows immediately after this month ends, has never had any federal recognition whatsoever, not even a one-year designation, a useful reminder that this month's history of at least four congressional acts, however discontinued, puts it on firmer legal ground than most of the observances that share its shape."
        ]
      }
    ],
    "faq": [
      {
        "question": "What are the exact dates of Breast Cancer Awareness Month?",
        "answer": "The entire month of October, every year, from October 1 through October 31. It is not tied to a single date or a floating week within the month."
      },
      {
        "question": "Who founded Breast Cancer Awareness Month, and in what year?",
        "answer": "The American Cancer Society's own materials, most recently repeated in its 2025 fortieth-anniversary press release, say the ACS \"co-led the effort\" to start the observance in 1985, without naming a corporate partner. Secondary accounts, including Wikipedia, add that the pharmaceutical division of Imperial Chemical Industries (later Zeneca, then AstraZeneca) was that partner. A peer-reviewed 2003 academic study instead states the observance began in 1984 and credits the drugmaker alone, without the American Cancer Society as a co-founder. All three accounts are documented, and none has been shown to be simply mistaken."
      },
      {
        "question": "Did Congress pass a permanent law that automatically renews this observance every year?",
        "answer": "No. Congress designated specific years by name at least four times: Senate Joint Resolution 301 (October 1990), Public Law 102-120 (October 1991), House Joint Resolution 11 (October 1993), and Public Law 103-367 (October 1994). No comparable year-specific designation has been found on the record since 1994. Every presidential proclamation since, across multiple administrations, has cited only general executive authority rather than a new act of Congress."
      },
      {
        "question": "Is Breast Cancer Awareness Month a federal holiday?",
        "answer": "No. No federal offices close and no paid leave attaches to it. It is an awareness observance marked through proclamations, corporate campaigns, and local fundraising events, not a legal holiday."
      },
      {
        "question": "What is \"pinkwashing,\" and why is that term used for this observance?",
        "answer": "Pinkwashing is a term the advocacy group Breast Cancer Action has used to describe companies that manufacture or use chemicals linked to cancer while also publicly sponsoring campaigns to fight it. The criticism traces to the observance's own corporate origins: its founding sponsor's U.S. drug arm ran a 1989 employee screening program, and a 1996 internal cost analysis of that program, showing a $1.1 million calculated savings, was later read by a peer-reviewed 2003 academic study as evidence the campaign's initial justification was corporate cost accounting rather than a critique of women's healthcare."
      },
      {
        "question": "Did the pink ribbon originate at the same time as the awareness month?",
        "answer": "No. The observance itself dates to the mid-1980s, but the pink ribbon traces to the early 1990s: pink ribbons appeared at the Susan G. Komen Foundation's 1991 Race for the Cure in New York, alongside California resident Charlotte Haley's separate peach-ribbon protest campaign, and the pink ribbon was not formally adopted as a foundation symbol until Evelyn Lauder founded the Breast Cancer Research Foundation in 1993."
      },
      {
        "question": "Is National Metastatic Breast Cancer Awareness Day (October 13) a permanent federal designation?",
        "answer": "No. The House and Senate designated October 13 specifically for 2009 through simple resolutions, S.Res. 295 and H.Res. 787, which do not require a presidential signature and do not carry the force of law. No comparable resolution renewing that specific date has surfaced in later years; advocacy groups have simply kept observing it every October 13 by custom."
      }
    ],
    "sources": [
      {
        "label": "George Bush — Proclamation 6202, National Breast Cancer Awareness Month, 1990 (The American Presidency Project)",
        "url": "https://www.presidency.ucsb.edu/documents/proclamation-6202-national-breast-cancer-awareness-month-1990"
      },
      {
        "label": "William J. Clinton — Proclamation, National Breast Cancer Awareness Month, 1996 (Clinton White House Archives)",
        "url": "https://clintonwhitehouse6.archives.gov/1996/10/1996-10-03-proclamation-of-breast-cancer-awareness-month.html"
      },
      {
        "label": "American Cancer Society — Turning Awareness Into Action: 40 Years of Breast Cancer Awareness Month",
        "url": "https://www.cancer.org/cancer/latest-news/our-impact/turning-awareness-into-action-40-years-of-breast-cancer-awareness-month.html"
      },
      {
        "label": "Phaedra C. Pezzullo — \"Resisting 'National Breast Cancer Awareness Month': The Rhetoric of Counterpublics and their Cultural Performances,\" Quarterly Journal of Speech, Vol. 89, No. 4 (November 2003), pp. 345-365",
        "url": "https://doi.org/10.1080/0033563032000160981"
      },
      {
        "label": "National Breast Cancer Awareness Month — official FAQ (archived 2011, AstraZeneca HealthCare Foundation)",
        "url": "https://web.archive.org/web/20110716123431/http://www.nbcam.org/about_faq.cfm"
      },
      {
        "label": "Wikipedia — Breast Cancer Awareness Month",
        "url": "https://en.wikipedia.org/wiki/Breast_Cancer_Awareness_Month"
      },
      {
        "label": "The New York Times — A Growing Disenchantment With October 'Pinkification' (Gina Kolata, Oct. 30, 2015)",
        "url": "https://www.nytimes.com/2015/10/31/health/breast-cancer-awareness-pink.html"
      },
      {
        "label": "GovTrack — S.Res. 295 (111th Congress), National Metastatic Breast Cancer Awareness Day",
        "url": "https://www.govtrack.us/congress/bills/111/sres295/text"
      },
      {
        "label": "Congress.gov — Public Law 102-120, 105 Stat. 609",
        "url": "https://www.congress.gov/102/statute/STATUTE-105/STATUTE-105-Pg609.pdf"
      },
      {
        "label": "Congress.gov — Public Law 103-367, 108 Stat. 3473",
        "url": "https://www.congress.gov/103/statute/STATUTE-108/STATUTE-108-Pg3473.pdf"
      }
    ],
    "image": "/images/breast-cancer-awareness-month.jpg",
    "imageAlt": "The White House illuminated pink at night in honor of National Breast Cancer Awareness Month, October 2017",
    "imageCredit": "Official White House Photo by D. Myles Cullen, Public Domain, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:White_House_illuminated_pink_in_2017.jpg)"
  },
{
  "slug": "diabetes-awareness-month",
  "category": "Observances",
  "title": "American Diabetes Month: A Week in 1981, a Month in 1982",
  "description": "American Diabetes Month covers all of November. The ADA traces it to 1975, but Reagan's first proclamation, in 1981, set aside only a single week.",
  "published": "2026-08-10",
  "updated": "2026-08-10",
  "coreSummary": "American Diabetes Month runs the entire month of November in the United States, traced informally by the American Diabetes Association to a 1975 declaration this calendar could not verify in the ADA's own current materials. The first confirmed federal action, a Reagan proclamation, set aside only a single week in October 1981; the first proclamation actually naming a full “National Diabetes Month” came a year later, for November 1982, a distinction that at least two current health-media sites get wrong.",
  "dateRule": {
    "kind": "fixed",
    "text": "All of November, every year, in the United States, not a single date or a floating week within the month.",
    "status": "documented",
    "source": {
      "label": "Ronald Reagan — Proclamation 4994, National Diabetes Month, 1982 (Ronald Reagan Presidential Library)",
      "url": "https://www.reaganlibrary.gov/research/speeches/110282a"
    },
    "occurrences": [
      {
        "date": "2026-11-01",
        "weekday": "Sunday"
      },
      {
        "date": "2027-11-01",
        "weekday": "Monday"
      },
      {
        "date": "2028-11-01",
        "weekday": "Wednesday"
      },
      {
        "date": "2029-11-01",
        "weekday": "Thursday"
      },
      {
        "date": "2030-11-01",
        "weekday": "Friday"
      },
      {
        "date": "2031-11-01",
        "weekday": "Saturday"
      }
    ],
    "caveat": "Three names circulate for the same November observance: American Diabetes Month, the American Diabetes Association's own branding for its campaigns since 1997 according to secondary sources this calendar could not verify against an ADA primary document; National Diabetes Month, the name every White House proclamation or message has used from 1982 through 2025; and Diabetes Awareness Month, a generic label used by hospitals, pharmacy chains, and calendar aggregators that does not trace to either the ADA or the federal government specifically. All three point at the same 30 days. Separately, Diabetes Self-Management currently states that Reagan proclaimed “November 1981” a National Diabetes Month, and Dictionary.com states, without naming Reagan or anyone else, that November was “officially declared” National Diabetes Month in 1981; neither claim matches the primary proclamation record. Reagan's actual 1981 proclamation, issued September 28 that year, designated only National Diabetes Week, October 4 through 10, a single week in a different month. The first proclamation to name a full “National Diabetes Month” is dated November 2, 1982, for that same November, issued under Senate Joint Resolution 257. Readers should also not confuse this US, month-long observance with World Diabetes Day, a single day, November 14, created separately by international health bodies and now an official United Nations day."
  },
  "founding": {
    "status": "documented",
    "text": "The American Diabetes Association (ADA) says, and multiple secondary sources repeat, that it first declared a “National Diabetes Awareness Month” in November 1975. This calendar could not locate that claim on any current ADA page or in an ADA-published primary document; it appears only in secondary aggregator articles (Diabetes Self-Management, Dictionary.com) that do not cite a specific ADA proclamation, press release, or archival source. The claim may be accurate to the ADA's own internal history, but it is not independently checkable the way the federal record below is.\n\nThe first confirmed federal action came six years later, and it was smaller than a month. On September 28, 1981, President Ronald Reagan issued Proclamation 4861, National Diabetes Week, setting aside October 4 through 10, 1981, a single week, not a month and not in November. The first proclamation to name a full month came a year after that: on November 2, 1982, Reagan issued Proclamation 4994, National Diabetes Month, 1982, “in accordance with Senate Joint Resolution 257,” proclaiming “the month of November, 1982, as National Diabetes Month” (quoted directly from the proclamation's own text, read in full at the Reagan Presidential Library). Despite that clear primary-source distinction, Diabetes Self-Management currently describes Reagan as having proclaimed “November 1981” a National Diabetes Month, and Dictionary.com states, without naming Reagan or any other authority, that November was “officially declared” the month in 1981; the 1981 proclamation on record was for a week in October, and the first Month proclamation was for 1982, not 1981.\n\nCongress did not stop at 1982. Senate Joint Resolution 145, in the 99th Congress, designated November 1985 as National Diabetes Month by name, one of at least several single-year joint resolutions Congress passed through the 1980s, each requiring the President's signature to take effect. That pattern eventually gave way to something looser: by the 117th Congress (2021 to 2022), the vehicle was Senate Resolution 479, a Senate-only resolution “supporting the goals and ideals of American Diabetes Month” that carries a companion House Resolution 810 but neither requires the President's signature nor creates a binding designation the way the 1982 and 1985 joint resolutions did. No joint resolution has ever made November a standing, permanent observance in US law; each year's federal recognition, from 1982 to the present, rests on that year's own proclamation or message.\n\nThe White House has issued something for National Diabetes Month every November since 1982, through Presidents of both parties, though the format is not fixed. Proclamations under Reagan, both Bushes, Obama, and Biden (most recently Proclamation 10849, National Diabetes Month, 2024) used the full “Proclamation” format. In November 2025, the Trump White House instead issued a “Presidential Message on National Diabetes Month,” a shorter document that does not require the procedural steps a formal Proclamation does. The underlying November date has not moved regardless of which format a given administration reaches for.",
    "source": {
      "label": "Ronald Reagan — Proclamation 4994, National Diabetes Month, 1982 (Ronald Reagan Presidential Library)",
      "url": "https://www.reaganlibrary.gov/research/speeches/110282a"
    }
  },
  "sections": [
    {
      "heading": "What American Diabetes Month is",
      "body": [
        "American Diabetes Month is a US observance held every November, encouraging screening, education about prediabetes and Type 2 risk factors, and support for people living with diabetes. The Centers for Disease Control and Prevention's most recent National Diabetes Statistics Report puts the number at 40.1 million Americans with diagnosed or undiagnosed diabetes, about 12 percent of the population, plus more than 115 million adults with prediabetes. It carries no legal status: no federal law creates a day off, and government offices, banks, and schools run a normal November schedule around it.",
        "The observance spreads mainly through the American Diabetes Association's own campaigns, hospital and pharmacy-chain messaging, and an annual White House statement that has appeared every November since 1982. It is not a single-day event with one clear ceremony; the whole 30 days serve as a loosely organized push for screening and awareness rather than a specific action tied to a date."
      ]
    },
    {
      "heading": "Who started it, and the year most sites get wrong",
      "body": [
        "The American Diabetes Association says it first declared a “National Diabetes Awareness Month” in November 1975. This calendar looked for that claim on the ADA's own site and could not find a current page repeating it with a citation; it exists only in secondary round-up articles that do not name a specific ADA document. The claim is plausible and widely repeated, but it is not independently checkable the way everything that follows is.",
        "The federal record is clearer, and it does not start where several current articles say it does. On September 28, 1981, President Reagan issued Proclamation 4861, National Diabetes Week, covering October 4 through 10 of that year, a single week, in October, not November. The first proclamation to actually name a full month came thirteen months later: Proclamation 4994, issued November 2, 1982, under Senate Joint Resolution 257, proclaiming “the month of November, 1982, as National Diabetes Month,” in the document's own words.",
        "Diabetes Self-Management currently states that Reagan proclaimed “November 1981” a National Diabetes Month. Dictionary.com makes a related but not identical error: without naming Reagan or anyone else, it states that November was “officially declared” the month in 1981. Checked against the primary proclamation text, both dates are wrong: the 1981 document on record set aside a week in October, not a month in November; the month-long November designation is a 1982 document, backed by a different congressional resolution. The error is small on the calendar, a year and a scope, but it is exactly the kind of detail that is easy to check and, in practice, rarely is, a pattern this calendar has also documented for [National Hispanic Heritage Month](/national-hispanic-heritage-month/), where a similar signed-versus-proclaimed year gets conflated."
      ]
    },
    {
      "heading": "Three names for one month",
      "body": [
        "“American Diabetes Month,” “National Diabetes Month,” and “Diabetes Awareness Month” all refer to the same 30 days. The ADA began branding its own campaigns “American Diabetes Month” in 1997, according to secondary sources this calendar could not verify against an ADA primary document. Every White House proclamation or message checked, from Reagan's in 1982 through Trump's in 2025, has instead used “National Diabetes Month.” “Diabetes Awareness Month” is a looser, generic label used by hospitals, pharmacy chains, and calendar aggregators that does not trace specifically to either the ADA or the federal government.",
        "The three names create real confusion for search and citation purposes, but not for planning: whichever name a source uses, it describes the same full month of November, not a different date range, unlike [No-Shave November](/no-shave-november/), which shares the month but is a wholly separate, privately run campaign with no federal recognition at all."
      ]
    },
    {
      "heading": "From a week, to a month, to a message",
      "body": [
        "Congress renewed the designation by name at least once more after 1982: Senate Joint Resolution 145, in the 99th Congress, designated November 1985 as National Diabetes Month, following the same pattern as 1982, a single-year resolution requiring the President's signature. That pattern of Congress passing a fresh joint resolution eventually stopped; by the 117th Congress (2021 to 2022), the vehicle was Senate Resolution 479, a Senate-only resolution “supporting the goals and ideals of American Diabetes Month,” paired with a similar House Resolution 810. Neither requires the President's signature, and neither creates a binding designation the way the 1982 and 1985 joint resolutions did. No joint resolution has ever made November a permanent, standing observance in US law, a pattern this calendar has also found for [Domestic Violence Awareness Month](/domestic-violence-awareness-month/); each year's recognition rests on that year's own White House document, not a standing statute.",
        "The White House has issued something every November since 1982, but the format is not fixed. Reagan, both Bushes, Obama, and Biden (most recently in a 2024 proclamation) all used the full “Proclamation” format, with the President's formal seal-bearing language. In November 2025, the Trump White House instead issued a shorter “Presidential Message,” a format that does not require the procedural steps a formal Proclamation does. The date itself has not moved regardless of which format a given administration reaches for."
      ]
    },
    {
      "heading": "Not the same as World Diabetes Day",
      "body": [
        "A single day, November 14, is a separate, distinct observance: World Diabetes Day, created by the International Diabetes Federation and the World Health Organization in 1991 and made an official United Nations International Day in 2006. It falls inside American Diabetes Month every year but is not the same thing; it is international rather than US-specific, and it marks one day rather than thirty.",
        "November 14 is the birthday of Sir Frederick Banting, who co-discovered insulin with Charles Best in Toronto in 1921. Banting's 1923 Nobel Prize in Physiology or Medicine was officially shared with John Macleod, the University of Toronto physiologist who directed the research; Best was not an official co-recipient, though Banting split his own share of the prize money with him afterward. Banting's November 14 birthday is the commonly cited reason for World Diabetes Day's specific date. No source found in researching this page ties that same reasoning to why the ADA picked November for its 1975 claim, or why Reagan's 1981 and 1982 proclamations landed in that month; those choices predate World Diabetes Day by a decade, and nothing in the proclamation text or in ADA materials checked mentions Banting. The Banting explanation appears to belong specifically to the newer, UN-recognized single day, not the older, US-only month, even though search results and calendar sites frequently apply it to both without distinction."
      ],
      "image": {
        "src": "/images/diabetes-awareness-month-timeline.svg",
        "alt": "Timeline from 1975 to 2025 showing the American Diabetes Association's unverified 1975 claim, Reagan's 1981 week and 1982 month proclamations, the 1985 congressional renewal, the 1991/2006 creation of World Diabetes Day, and the 2021-2025 shift to non-binding resolutions and a varying White House format"
      }
    }
  ],
  "faq": [
    {
      "question": "When is American Diabetes Month in 2026?",
      "answer": "All of November 2026, running Sunday, November 1 through Monday, November 30. It is a month-long observance, not a single date, and does not shift for weekends."
    },
    {
      "question": "Who founded American Diabetes Month?",
      "answer": "The American Diabetes Association says it first marked the month in 1975, a claim this calendar could not verify in the ADA's own current materials. The first confirmed federal action was President Reagan's, and it was not a month: a single week in October 1981. The first proclamation naming a full “National Diabetes Month” followed in November 1982, under Senate Joint Resolution 257."
    },
    {
      "question": "Was National Diabetes Month first proclaimed in 1981?",
      "answer": "No, despite what a couple of current health-media articles say. Reagan's 1981 proclamation, Proclamation 4861, designated National Diabetes Week, a single week in October, not a month and not in November. The first proclamation to name a full “National Diabetes Month” is dated November 2, 1982."
    },
    {
      "question": "Is American Diabetes Month the same as World Diabetes Day?",
      "answer": "No. World Diabetes Day falls on a single day, November 14, created by the International Diabetes Federation and World Health Organization in 1991 and made an official United Nations day in 2006. American Diabetes Month is the entire US observance covering all of November, with separate origins that predate World Diabetes Day by roughly a decade."
    },
    {
      "question": "What is the difference between American Diabetes Month and National Diabetes Month?",
      "answer": "Only the name. The American Diabetes Association has branded its own campaigns “American Diabetes Month” since 1997, according to secondary sources; every White House proclamation or message checked, from 1982 through 2025, has instead used “National Diabetes Month.” Both names describe the same 30 days in November."
    }
  ],
  "sources": [
    {
      "label": "Ronald Reagan — Proclamation 4994, National Diabetes Month, 1982 (Ronald Reagan Presidential Library, full text)",
      "url": "https://www.reaganlibrary.gov/research/speeches/110282a"
    },
    {
      "label": "Proclamation 4861 — National Diabetes Week (The American Presidency Project)",
      "url": "https://www.presidency.ucsb.edu/documents/proclamation-4861-national-diabetes-week"
    },
    {
      "label": "S.J.Res.145 — 99th Congress, designating November 1985 as National Diabetes Month (Congress.gov)",
      "url": "https://www.congress.gov/bill/99th-congress/senate-joint-resolution/145"
    },
    {
      "label": "S.Res.479 — 117th Congress, supporting the goals and ideals of American Diabetes Month (Congress.gov)",
      "url": "https://www.congress.gov/bill/117th-congress/senate-resolution/479"
    },
    {
      "label": "H.Res.810 — 117th Congress, supporting the goals and ideals of American Diabetes Month (Congress.gov)",
      "url": "https://www.congress.gov/bill/117th-congress/house-resolution/810/text"
    },
    {
      "label": "Proclamation 10849 — National Diabetes Month, 2024 (The American Presidency Project)",
      "url": "https://www.presidency.ucsb.edu/documents/proclamation-10849-national-diabetes-month-2024"
    },
    {
      "label": "Presidential Message on National Diabetes Month, November 4, 2025 (The White House)",
      "url": "https://www.whitehouse.gov/briefings-statements/2025/11/presidential-message-on-national-diabetes-month/"
    },
    {
      "label": "National Diabetes Statistics Report (Centers for Disease Control and Prevention)",
      "url": "https://www.cdc.gov/diabetes/php/data-research/index.html"
    },
    {
      "label": "What's the Story Behind Diabetes Awareness Month? (Diabetes Self-Management, source of the 1981/1982 conflation identified above)",
      "url": "https://www.diabetesselfmanagement.com/healthy-living/general-health/whats-the-story-behind-diabetes-awareness-month/"
    },
    {
      "label": "National Diabetes Month | History & Origin (Dictionary.com, source of a related but separate year error)",
      "url": "https://www.dictionary.com/e/historical-current-events/national-diabetes-month/"
    }
  ],
  "image": "/images/diabetes-awareness-month-banting-best.jpg",
  "imageAlt": "Frederick Banting (right) and Charles Best, who co-discovered insulin in 1921; Banting's November 14 birthday is the commonly cited reason for World Diabetes Day's date, a separate observance from American Diabetes Month",
  "imageCredit": "Library and Archives Canada / C-001350, copyright expired, Public Domain, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Banting_and_Best.jpg)"
},
  {
    "slug": "birthstones-by-month",
    "category": "Birthstones",
    "title": "Birthstones by Month: The Full Chart, and Where They Disagree",
    "description": "All twelve official birthstones in one chart, checked against Jewelers of America, GIA, and the American Gem Society, plus where their current pages disagree.",
    "published": "2026-08-11",
    "updated": "2026-08-11",
    "coreSummary": "Jewelers of America's current buying guide names one stone for seven months and two or three for the rest, but its own live chart is narrower than GIA's and the American Gem Society's for two months specifically: March (JA lists aquamarine alone; GIA and AGS both still add bloodstone) and August (JA lists peridot and spinel; GIA and AGS both still add sardonyx, the month's original stone). Britain's own trade list, last revised in 2013, adds a further stone to September that the US chart has never carried in that slot.",
    "sections": [
      {
        "heading": "The current chart, checked directly rather than copied from another list",
        "body": [
          "Most pages titled \"birthstones by month\" are working from a chart somebody else compiled, sometimes years ago. This one was checked against Jewelers of America's own live buying guide the week this page was published: January is garnet. February is amethyst. March is aquamarine. April is diamond. May is emerald. June is pearl, moonstone, and alexandrite. July is ruby. August is peridot and spinel. September is sapphire. October is opal and tourmaline. November is citrine and topaz. December is turquoise, tanzanite, and blue zircon.",
          "Split by count, that's seven months with a single official stone on Jewelers of America's current chart (January, February, March, April, May, July, and September) and five months with two or three. June and December each carry three; August, October, and November each carry two. None of that is exotic trivia: it's the direct answer to \"how many official birthstones does my month have,\" read straight off the trade association's own current page rather than assembled from whatever a dozen retail blogs happen to agree on."
        ]
      },
      {
        "heading": "One 1912 meeting, three later revisions",
        "body": [
          "Jewelers of America itself dates to 1906, when it organized under an earlier name to represent retail jewelers as a trade. The birthstone list came six years later: in 1912, that organization, then called the American National Retail Jewelers Association, met in Kansas City and adopted a single standardized chart, replacing the tangle of regional and folk birthstone traditions retailers had been drawing on until then.",
          "The chart has been revised three times since, and each revision landed on different months. A 1952 update added alexandrite to June, citrine to November, tourmaline to October, and zircon to December. Trade histories disagree on whether Jewelers of America's own predecessor carried that revision out or whether a separate body, the Jewelry Industry Council of America, did it instead, and this page did not find a document that settles the question either way. Tanzanite joined December's roster in 2002, added by the American Gem Trade Association. Spinel followed for August in 2016, this time a joint announcement from the American Gem Trade Association and Jewelers of America together. No revision since 1912 has touched January, February, March, April, May, July, or September. Jewelers of America's own chart for March has stood at aquamarine alone the entire time, even though GIA and the American Gem Society both currently pair it with bloodstone."
        ]
      },
      {
        "heading": "Two months where Jewelers of America's own chart is the narrow one",
        "body": [
          "Checking three organizations' own current pages side by side turns up something most \"complete\" birthstone charts don't mention: on two months, Jewelers of America's own live chart is the narrower one.",
          "March is the clearest case. Jewelers of America's current buying guide names aquamarine alone. GIA's own March birthstone page, though, names aquamarine and bloodstone together, and the American Gem Society's own current March page does the same, titling the pair \"March Birthstones: Aquamarine and Bloodstone\" and describing bloodstone as the original stone the month carried before aquamarine was added later. [This calendar's own earlier page on March](/march-birthstone/) goes further into how the two stones swapped which one counted as primary. A trade article once described the American Gem Trade Association as the outlier for including bloodstone, with Jewelers of America and the American Gem Society both leaving it off. That description no longer matches the American Gem Society's own page, which currently includes it.",
          "August works the same way. Jewelers of America's live chart lists peridot and spinel, the pairing set by 2016's revision. GIA's own August page and the American Gem Society's own August page both currently list a third stone alongside those two: sardonyx, which the American Gem Society's own page describes as August's original birthstone, the one peridot was later added beside. Sardonyx never left GIA's or the American Gem Society's own charts; it simply isn't on Jewelers of America's live page. Three organizations, checked directly on their own current sites, give two different answers for how many official birthstones August actually has."
        ]
      },
      {
        "heading": "A stone that moved from December to September: Britain's separate list",
        "body": [
          "The US chart isn't the only current trade standard. Britain's National Association of Goldsmiths published its own birthstone list in 1937 and revised it in 2013, and per Wikipedia's own sourced comparison of the historic and current lists, that 2013 revision still gives September a second stone the American chart doesn't carry there: lapis lazuli, alongside sapphire, a gap [this calendar's own September page](/september-birthstone/) already covers from the sapphire side.",
          "Lapis lazuli isn't new to this calendar's own December, though. The same comparison table shows the original 1912 American list actually paired turquoise with lapis lazuli for December, before the 1952 revision dropped lapis lazuli and put zircon in its place. [This calendar's page on December](/december-birthstone/) covers that month's other well-known mismatch: a fourth stone, blue topaz, that heavy retail marketing treats as official even though no trade group's chart, American or British, has ever listed it. Britain's current list didn't carry lapis lazuli forward on the same month the old American one had it; the stone resurfaced attached to a different one instead, and nothing in the sourced comparison explains why September specifically was where it landed."
        ]
      },
      {
        "heading": "Why the charts don't converge",
        "body": [
          "There's no single body with the authority to force Jewelers of America, GIA, the American Gem Trade Association, the American Gem Society, and Britain's National Association of Goldsmiths onto one chart. Each maintains and revises its own list on its own schedule, the same way this calendar's own [observance pages](/national-cat-day/) keep finding multiple organizations each claiming to have started the same day. A shopper who checks two of these sites for March or August, or checks a US site against a UK one for September, isn't finding a mistake on either page; both are accurately reporting what their own organization currently says.",
          "A birth-month stone and a zodiac-sign stone are also not the same tradition, even when they land on the same gem by coincidence. [This calendar's page on Virgo's date range](/virgo-dates/) already found that astrology sites can't agree among sapphire, peridot, or carnelian for Virgo's own stone, with no trade group behind any of the three claims. That's a separate and considerably less settled question than which stone belongs to whichever birth month a Virgo happens to be born in."
        ]
      }
    ],
    "faq": [
      {
        "question": "What are the official birthstones for every month?",
        "answer": "Per Jewelers of America's current chart: January garnet, February amethyst, March aquamarine, April diamond, May emerald, June pearl/moonstone/alexandrite, July ruby, August peridot/spinel, September sapphire, October opal/tourmaline, November citrine/topaz, December turquoise/tanzanite/blue zircon."
      },
      {
        "question": "Which months have more than one official birthstone?",
        "answer": "On Jewelers of America's current chart, June and December each carry three, and August, October, and November each carry two. The other seven months carry exactly one."
      },
      {
        "question": "Is bloodstone still an official March birthstone?",
        "answer": "It depends which organization's page is checked. GIA's and the American Gem Society's own current March pages both name aquamarine and bloodstone together. Jewelers of America's own current buying guide names aquamarine alone."
      },
      {
        "question": "Does August still have three official birthstones?",
        "answer": "GIA and the American Gem Society both currently list peridot, spinel, and sardonyx for August. Jewelers of America's live chart lists only peridot and spinel. Sardonyx, the month's original stone by the American Gem Society's own account, isn't on it."
      },
      {
        "question": "Is blue topaz an official birthstone for any month?",
        "answer": "No. It doesn't appear on Jewelers of America's, GIA's, or the American Gem Society's current charts for any month, despite heavy retailer marketing of it as December's fourth stone."
      },
      {
        "question": "Does the UK use a different birthstone list than the US?",
        "answer": "For at least one month, yes. Britain's National Association of Goldsmiths revised its list in 2013 and still pairs September with sapphire and lapis lazuli, a stone the US chart hasn't carried in any month since a 1952 revision dropped it from December in favor of zircon."
      }
    ],
    "sources": [
      {
        "label": "Jewelers of America — Birthstones Buying Guide",
        "url": "https://www.jewelers.org/buying-jewelry/jewelry-buying-guides/birthstones"
      },
      {
        "label": "GIA — March Birthstones",
        "url": "https://www.gia.edu/birthstones/march-birthstones"
      },
      {
        "label": "GIA — August Birthstones",
        "url": "https://www.gia.edu/birthstones/august-birthstones"
      },
      {
        "label": "American Gem Society — March Birthstones",
        "url": "https://www.americangemsociety.org/birthstones/march-birthstones/"
      },
      {
        "label": "American Gem Society — August Birthstones",
        "url": "https://www.americangemsociety.org/birthstones/august-birthstones/"
      },
      {
        "label": "American Gem Society — June Birthstones",
        "url": "https://www.americangemsociety.org/birthstones/june-birthstones/"
      },
      {
        "label": "Wikipedia — Birthstone (historic, US 1912, UK 2013, and US 2019 comparison table)",
        "url": "https://en.wikipedia.org/wiki/Birthstone"
      },
      {
        "label": "National Jeweler — Rocks On: The Evolution of the Birthstone List",
        "url": "https://nationaljeweler.com/articles/5278-rocks-on-the-evolution-of-the-birthstone-list"
      }
    ],
    "image": "/images/birthstones-by-month-grid.svg",
    "imageAlt": "Grid chart of all twelve months' official birthstones, flagging March and August where Jewelers of America's own current list is narrower than GIA's and the American Gem Society's, and September where Britain's list adds a second stone"
  },
  {
    "slug": "international-mens-day",
    "category": "Observances",
    "title": "International Men's Day: November 19, and a Match It Lost",
    "description": "International Men's Day falls every November 19, founded in 1999 by Jerome Teelucksingh. The 1989 match behind the date's origin story ended in a loss, not a win.",
    "published": "2026-08-11",
    "updated": "2026-08-11",
    "coreSummary": "International Men's Day is observed every November 19, revived in 1999 by Dr. Jerome Teelucksingh, a history lecturer at the University of the West Indies in Trinidad and Tobago, who chose the date to honor his father's birthday and Trinidad and Tobago's November 19, 1989 World Cup qualifying match against the United States. That match, at a sold-out Hasely Crawford Stadium, ended 1-0 to the US on Paul Caligiuri's \"Shot Heard 'Round the World\" goal; the US advanced to the 1990 World Cup, and Trinidad and Tobago did not. An earlier, separate February 7 observance, organized by Thomas Oaster from 1992, survived only in Malta until Malta's men's-rights association voted in 2009 to switch to November 19. The day has no United Nations recognition, unlike International Women's Day; Romania is the one country found to have given it the force of law, in 2016.",
    "dateRule": {
      "kind": "fixed",
      "text": "November 19 every year, worldwide. The date is fixed and does not shift for weekends.",
      "status": "conventional",
      "source": {
        "label": "International Men's Day (official site) — History & Background",
        "url": "https://internationalmensday.com/about/history-background/"
      },
      "occurrences": [
        { "date": "2026-11-19", "weekday": "Thursday" },
        { "date": "2027-11-19", "weekday": "Friday" },
        { "date": "2028-11-19", "weekday": "Sunday" },
        { "date": "2029-11-19", "weekday": "Monday" },
        { "date": "2030-11-19", "weekday": "Tuesday" },
        { "date": "2031-11-19", "weekday": "Wednesday" }
      ],
      "caveat": "November 19 is now the universal date, but it was not always the only one in circulation. Thomas Oaster, who directed the Missouri Center for Men's Studies at the University of Missouri–Kansas City, organized small February 7 events in the US, Australia, and Malta starting in 1992. The US and Australian versions stopped after a poorly attended 1995 attempt (Australia later re-established its own observance, on November 19, in 2003); Malta's Association for Men's Rights was the only group that kept observing the day every February 7 after that, continuing through 2008. Because no other country still used the February date, Malta's committee voted unanimously on January 17, 2009 to move its own observance to November 19, aligning with the version Jerome Teelucksingh had independently revived in Trinidad and Tobago a decade earlier. Since that 2009 vote, no source found here shows any country still marking the day on a different date."
    },
    "founding": {
      "status": "documented",
      "text": "Dr. Jerome Teelucksingh, a history lecturer at the University of the West Indies in Trinidad and Tobago, revived International Men's Day in 1999, choosing November 19 for two stated reasons: it was his father's birthday, and it was the date, in 1989, that Trinidad and Tobago's men's football team played its World Cup qualifying match at home against the United States, a game the organization's own history page describes as having \"united the country with their endeavours to qualify for the World Cup.\" That description is carefully worded and does not claim the team won or qualified. Independent sources, including Wikipedia's separate article on the match and US Soccer's own retrospective, confirm what actually happened that night: in front of a sold-out crowd of roughly 35,000 at Hasely Crawford Stadium in Port of Spain, the United States won 1-0 on a second-half goal from Paul Caligiuri, a result remembered in US soccer history as \"the Shot Heard 'Round the World\" because it sent the US, not Trinidad and Tobago, to the 1990 World Cup after a 40-year American absence from the tournament. Trinidad and Tobago's campaign ended in that loss. Teelucksingh's account does not misstate this, but calendar sites and social posts that summarize the story as commemorating a qualifying campaign, without noting how it ended, can leave the impression of a win where the record shows a defeat. Teelucksingh was not the first person to attempt an international men's day: Thomas Oaster organized small February 7 events in 1992, and the idea of a men's counterpart to International Women's Day had been raised in print as early as a 1969 New York Times report on informal calls for a February 23 observance. Teelucksingh's 1999 event is the one that took root and grew into the November 19 observance now marked, per the organization's own 2026 count, in more than eighty countries.",
      "source": {
        "label": "International Men's Day (official site) — History & Background",
        "url": "https://internationalmensday.com/about/history-background/"
      }
    },
    "sections": [
      {
        "heading": "What International Men's Day is",
        "body": [
          "International Men's Day is an annual civil-society observance held on November 19, built around six stated objectives: promoting positive male role models, celebrating men's contributions to family and community, focusing on men's health, highlighting discrimination against men and boys, improving gender relations, and working toward a safer world. Those \"six pillars\" come from the organizing team behind the modern, November 19 version of the day, not from any government or UN body.",
          "It carries no legal holiday status in the large majority of countries that mark it: no day off work, no closed banks or government offices. It spreads mainly through school and university events, parliamentary speeches, workplace campaigns, and social media, coordinated locally rather than through a single central authority. Romania, covered below, is the one country found here where the date carries actual statutory weight rather than informal recognition.",
          "Each year also carries an optional secondary theme, set by volunteer coordinators rather than any fixed institution. The 2026 theme, marking the 28th annual observance, is \"The Future Is Everyone,\" a concept first proposed by American writer Lisa Britton in 2020 and adopted as the global theme for 2026."
        ]
      },
      {
        "heading": "The date: one name, two observances, for a decade",
        "body": [
          "Calls for a men's counterpart to International Women's Day go back further than most people assume. A 1969 New York Times report noted that \"many men have been agitating privately to make February 23 International Men's Day, the equivalent of March 8,\" but nothing organized came of it for another two decades.",
          "The first real attempt was Thomas Oaster's, in 1992: small events on February 7, held in the United States, Australia, and Malta at his invitation. The US and Australian versions fizzled after a poorly attended 1995 event (Australia later revived its own observance independently, on November 19, in 2003). Malta was the exception: the Maltese Association for Men's Rights kept holding a February 7 event every year from 1994 through 2008, making it, for a time, the single longest-running local IMD observance anywhere.",
          "Jerome Teelucksingh's 1999 revival, on November 19 in Trinidad and Tobago, grew separately and faster, spreading to dozens of countries through the 2000s. For about a decade, two different dates for the same-named observance existed side by side, kept alive mainly by one country each. That ended on January 17, 2009, when Malta's committee voted unanimously to abandon the February date and align with November 19 \"to coincide with all the others around the world,\" as the vote was described at the time. No source checked for this article shows any country still using a different date since."
        ],
        "image": {
          "src": "/images/international-mens-day-timeline.svg",
          "alt": "Timeline showing International Men's Day's split history: a February 7 observance kept alive only by Malta from 1992 to 2009, running alongside the November 19 observance Jerome Teelucksingh revived in Trinidad and Tobago in 1999, until Malta switched to November 19 in 2009, and Romania made that date law in 2016"
        }
      },
      {
        "heading": "Who started it, and the match behind the date",
        "body": [
          "The founder is documented and not in dispute: Jerome Teelucksingh, then a history lecturer at the University of the West Indies, revived International Men's Day in Trinidad and Tobago in 1999. His organization's own history page gives two reasons for choosing November 19, both personal to him rather than tied to any external body: it was his father's birthday, and it was the date of a Trinidad and Tobago World Cup qualifying match that, in the organization's words, \"united the country with their endeavours to qualify for the World Cup.\"",
          "That match is independently well documented, under a name of its own: \"the Shot Heard 'Round the World.\" On November 19, 1989, in front of a sold-out crowd of about 35,000 at Hasely Crawford Stadium in Port of Spain, Trinidad and Tobago needed only a draw at home against the United States to reach its first-ever World Cup. The US won 1-0 on a second-half goal by Paul Caligiuri, eliminating Trinidad and Tobago and sending the United States to the 1990 World Cup instead, ending a 40-year American absence from the tournament. Trinidad and Tobago's own qualifying campaign, in other words, ended in a home defeat, not a celebrated advance.",
          "This does not make Teelucksingh's stated reason inaccurate: uniting a country around a team's effort to qualify is a real thing that can happen regardless of the final score, and his own wording never claims a win. But general retellings of the founding story, on other calendar sites and in casual social posts, sometimes compress \"united the country with their endeavours to qualify\" into language implying the team succeeded. The record, from Wikipedia's article on the match to US Soccer's own retrospective, is unambiguous that it did not."
        ]
      },
      {
        "heading": "No United Nations recognition, but Romania made it law",
        "body": [
          "International Men's Day has never been adopted by the United Nations. That is a real contrast with International Women's Day, which the UN General Assembly formally recognized in a 1977 resolution inviting member states to proclaim March 8 as a UN observance, according to the UN's own background page on the day. No equivalent resolution exists for November 19. The organizing team's own March 2026 media release states one of its explicit goals for the year is \"formal recognition of International Men's Day on the UN calendar,\" describing it as \"the first official day for men or boys, when there are already 13 days for women and girls,\" language that itself confirms the recognition has not yet happened.",
          "One country is the exception. Romania's Parliament passed Law No. 22/2016, adopted March 4, 2016 and published in Monitorul Oficial no. 169 on March 7, 2016, declaring March 8 \"Ziua femeii\" (Women's Day) and November 19 \"Ziua bărbatului\" (Men's Day) in a single two-article statute; the full text, reproduced by the Romanian legal-news site contabun.ro, matches those dates. Two independent Romanian outlets, Mediafax and AGERPRES, both reported the Chamber of Deputies passing the bill on February 3, 2016 by the same tally: 204 votes in favor, 16 against, and 63 abstentions. The law itself is narrow: it declares the date and permits local public authorities to organize events and state broadcasters to air related programming, but it does not create a paid public holiday or a day off work, unlike, for instance, [National Grandparents Day](/national-grandparents-day/), which US federal law fixes to a specific formula (36 U.S.C. § 125) without making it a non-working holiday either. Romania is nonetheless the only country found here with a standing national statute naming November 19 as Men's Day, rather than relying on informal or year-by-year recognition."
        ]
      },
      {
        "heading": "Eighty-plus countries, coordinated locally",
        "body": [
          "International Men's Day's spread since 1999 owes as much to individual national organizers as to any central campaign. India's celebration is described by the organizing team as the single largest in the world, driven largely by one person: Uma Challa, a men's advocate in Bangalore who began organizing IMD events there in 2007, reportedly without knowing where the November 19 date had originated, and who went on to found the Save the Indian Family Foundation. Elsewhere, the day has taken different local forms: parliamentary speeches in the UK and Australia, university and workplace events, and, in several countries, no organized event at all beyond scattered social media posts.",
          "That patchwork pattern, a fixed global date marked with wildly different levels of formality from one country to the next, is not unusual among the awareness observances on this calendar; [No-Shave November](/no-shave-november/), which runs for the same month, has similarly never had a government body behind it anywhere. What sets November 19 apart is the range at the extremes: from Romania's actual statute at one end to countries where the day passes with no recorded local recognition at all, sourced only to the international coordinating team's own country-by-country notes rather than any local government or press record independent of it."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is International Men's Day in 2026?",
        "answer": "Thursday, November 19, 2026. The date is fixed at November 19 every year and does not shift for weekends."
      },
      {
        "question": "Who founded International Men's Day, and why November 19?",
        "answer": "Jerome Teelucksingh, then a history lecturer at the University of the West Indies, revived it in Trinidad and Tobago in 1999. He chose November 19 for two personal reasons stated on his organization's own site: it was his father's birthday, and it was the date of a 1989 Trinidad and Tobago World Cup qualifying match against the United States that, in the organization's words, united the country around the team's effort."
      },
      {
        "question": "Did Trinidad and Tobago win the 1989 match the day partly commemorates?",
        "answer": "No. Trinidad and Tobago lost 1-0 at home to the United States on November 19, 1989, in a match remembered in US soccer history as \"the Shot Heard 'Round the World.\" The result sent the United States, not Trinidad and Tobago, to the 1990 World Cup. The founder's own account does not claim a win, but some retellings elsewhere blur this detail."
      },
      {
        "question": "Is International Men's Day recognized by the United Nations?",
        "answer": "No. Unlike International Women's Day, which the UN General Assembly formally recognized in a 1977 resolution, International Men's Day has no UN resolution behind it. The organizing team's own 2026 materials list UN calendar recognition as an explicit, not-yet-achieved goal."
      },
      {
        "question": "Is International Men's Day legally official anywhere?",
        "answer": "Romania is the one country found with a standing statute: Law No. 22/2016, passed by Parliament in March 2016, declares November 19 \"Ziua bărbatului\" (Men's Day) alongside March 8 as Women's Day. The law permits local public authorities and state broadcasters to organize related events and programming; it does not create a paid public holiday."
      },
      {
        "question": "Was there an earlier version of International Men's Day before 1999?",
        "answer": "Yes. Thomas Oaster organized small February 7 events in the US, Australia, and Malta starting in 1992. Only Malta kept observing it every year after 1995, continuing through 2008, until Malta's men's-rights association voted in 2009 to switch to November 19 and align with the version Jerome Teelucksingh had revived in Trinidad and Tobago a decade earlier."
      }
    ],
    "sources": [
      {
        "label": "International Men's Day (official site) — History & Background",
        "url": "https://internationalmensday.com/about/history-background/"
      },
      {
        "label": "International Men's Day — Media Release: Theme for 2026, \"The Future Is Everyone\"",
        "url": "https://internationalmensday.com/wp-content/uploads/2026/03/Media-Release-IMD-2026-Theme-Announcement.pdf"
      },
      {
        "label": "Wikipedia — International Men's Day",
        "url": "https://en.wikipedia.org/wiki/International_Men%27s_Day"
      },
      {
        "label": "Wikipedia — Shot heard round the world (soccer)",
        "url": "https://en.wikipedia.org/wiki/Shot_heard_round_the_world_(soccer)"
      },
      {
        "label": "US Soccer — Paul Caligiuri: The Shot Heard Around The World",
        "url": "https://www.ussoccer.com/stories/2023/11/paul-caligiuri-shot-heard-around-the-world"
      },
      {
        "label": "United Nations — International Women's Day: Background",
        "url": "https://www.un.org/en/observances/womens-day/background"
      },
      {
        "label": "contabun.ro — Full text of Legea nr. 22/2016 (Monitorul Oficial no. 169, March 7, 2016)",
        "url": "https://www.contabun.ro/2016/03/09/legea-nr-222016-8-martie-ziua-femeii-si-19-noiembrie-ziua-barbatului/"
      },
      {
        "label": "Romania Insider — Parliament makes Men's Day official in Romania",
        "url": "https://www.romania-insider.com/romania-sets-date-for-mens-day"
      },
      {
        "label": "Mediafax — E oficial! Românii vor avea Ziua Bărbatului în 19 noiembrie (vote count)",
        "url": "https://www.mediafax.ro/politic/e-oficial-romanii-vor-avea-ziua-barbatului-in-19-noiembrie-sarbatorirea-celor-doua-zile-este-un-prilej-de-a-imbunatatii-relatiile-dintre-sexe-15028018"
      },
      {
        "label": "AGERPRES — Camera Deputaților: 19 noiembrie devine legal Ziua bărbatului, iar 8 martie - Ziua femeii",
        "url": "https://www.agerpres.ro/politica/2016/02/03/camera-deputatilor-19-noiembrie-devine-legal-ziua-barbatului-iar-8-martie-ziua-femeii-13-05-41"
      }
    ],
    "image": "/images/international-mens-day-timeline.svg",
    "imageAlt": "Timeline showing International Men's Day's split history: a February 7 observance kept alive only by Malta from 1992 to 2009, running alongside the November 19 observance Jerome Teelucksingh revived in Trinidad and Tobago in 1999, until Malta switched to November 19 in 2009, and Romania made that date law in 2016"
  },
  {
    "slug": "august-birth-flower",
    "category": "Birth Flowers",
    "title": "August Birth Flower: Gladiolus, and a Poppy Species Left Out",
    "description": "August's birth flowers are gladiolus and poppy, but almost no guide names the poppy species: the same field poppy behind World War I's remembrance symbol.",
    "published": "2026-08-11",
    "updated": "2026-08-11",
    "coreSummary": "August's birth flowers are gladiolus, named by the Roman naturalist Pliny for its sword-shaped leaves rather than for gladiators, and poppy, specifically the corn poppy (Papaver rhoeas), the wild field species behind World War I's remembrance poppy rather than the ornamental Oriental poppy most florist photos show. Unlike birthstones, which trace to a documented 1912 US trade convention, no single body ever fixed one official birth-flower list.",
    "sections": [
      {
        "heading": "Two flowers, and only one gets debated",
        "body": [
          "The Old Farmer's Almanac and the florist trade lists that follow it agree on August's pair: gladiolus and poppy. Gladiolus, the Almanac says, symbolizes strength, integrity, and honor, its height and color reading as a last burst of color before summer ends. Poppy stands for remembrance and imagination, and a beauty that, in the Almanac's own phrasing, doesn't cling to permanence.",
          "Two flowers in one month isn't unusual; most months on a modern birth-flower list carry a primary and a secondary. Unlike birthstones (this site's own [birthstones by month](/birthstones-by-month/) page traced that series to a documented 1912 US trade convention), no equivalent meeting ever forced birth flowers into one agreed list, a gap this page comes back to below. What August has, more than the symbolism itself, is a real gap between the two names on that list and what a shopper actually gets handed at a flower counter."
        ]
      },
      {
        "heading": "Gladiolus: named for a leaf shape, centuries before the flower sold today existed",
        "body": [
          "Gladiolus comes from the Latin gladiolus, \"small sword,\" the diminutive of gladius. The Online Etymology Dictionary traces the coinage to the Roman naturalist Pliny the Elder, writing in the first century, who used it for the plant's sword-shaped leaves, not for any connection to Roman fighters. Gladiator shares the same root, gladius, but that's a shared ancestor in Latin, not a shared story.",
          "English didn't borrow the Latin word right away. Etymonline records an Old English name for the same family, gladdon, in use around the year 1000, long before the Latin-derived form appeared. \"Gladiol\" is attested from the mid-15th century, and the modern spelling, gladiolus, likely arrived later still, as a second, separate borrowing from Latin sometime around the 1560s. The plant had an English name of its own for centuries before the Latin form displaced it.",
          "The genus is larger, and further from Rome, than the word's origin suggests. Wikipedia's summary of the genus, sourced to Plants of the World Online, counts roughly 260 species native to southern Africa, about 76 more in tropical Africa, and only around 10 native to Eurasia, the small corner of the genus Pliny would actually have seen growing wild around the Mediterranean.",
          "The tall, ruffled, saturated-color spikes sold at florists today trace to one specific 19th-century cross, not to any wild species directly. Missouri Botanical Garden's plant records describe the cross behind it, Gladiolus × gandavensis, bred in Belgium in 1837 and put on the market in 1841 by the Ghent nurseryman Louis van Houtte, as \"an important foundation plant in the history of gladiolus hybrids\" behind most of what's grown commercially now.",
          "The exact parents of that 1837 cross aren't settled. Missouri Botanical Garden lists them as G. natalensis × G. oppositiflorus, which lines up with Kew's Plants of the World Online once an older taxonomic synonym is accounted for, but several older horticultural references, including the 1911 Encyclopaedia Britannica, instead name G. psittacinus × G. cardinalis as the parent pair. Nothing checked for this page resolves the discrepancy, so both pairings are noted here rather than treating one institution's record as the final word. What both accounts agree on is the plant itself and its date: Pliny's small sword-lily and the florist's gladiolus are the same genus and the same borrowed word, separated by roughly 1,800 years of plant breeding that most retail copy skips over entirely."
        ],
        "image": {
          "src": "/images/august-birth-flower-gladiolus.jpg",
          "alt": "Pink gladiolus 'Priscilla' cultivar in bloom, the type of hybrid grown commercially today rather than the wild Mediterranean species Pliny originally named",
          "credit": "Photo by Pharaoh Hound, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Gladiolus_cultivar_Priscilla_2.jpg), CC BY-SA 3.0"
        }
      },
      {
        "heading": "Poppy is a shorthand. The species behind it is specific.",
        "body": [
          "Almost no florist page naming poppy as August's birth flower says which poppy. The species carrying the actual symbolic weight, remembrance in particular, is Papaver rhoeas: the corn poppy, field poppy, or Flanders poppy, native across North Africa and temperate Eurasia and, per Wikipedia's entry on the plant, \"used in the Commonwealth as a symbol of remembrance for fallen soldiers\" since World War I, because it commonly grew in fields disturbed by the fighting.",
          "That symbolism traces to a specific poem. Canadian physician John McCrae wrote \"In Flanders Fields\" on May 3, 1915, after presiding over a fellow soldier's funeral near Ypres; it was first published that December in the London magazine Punch. Wikipedia's account of the poem describes how its image of red poppies over soldiers' graves made the remembrance poppy one of the most recognized memorial symbols in the world. American professor Moina Michael read the poem and began wearing a poppy in response; the artificial poppies sold for veterans' charities today, in Commonwealth countries especially, descend from the campaign she and French fundraiser Anna Guérin built around it near the end of the war.",
          "The showy perennial most florists actually carry as a cut flower is a different plant. Oriental poppy, Papaver orientale, is native to the Caucasus, northeastern Turkey, and northern Iran, an entirely separate range from the corn poppy's Mediterranean and North African home, with no documented tie to the remembrance tradition. It's the bigger, more photogenic bloom, so it's what shows up in most \"August birth flower\" photo galleries. The flower actually carrying the meaning most of those galleries describe is the smaller red field poppy most of them never picture."
        ]
      },
      {
        "heading": "Why birth flowers never got their own 1912",
        "body": [
          "This site's own [birthstones by month](/birthstones-by-month/) page found a specific event behind that series: the American National Retail Jewelers Association met in Kansas City in August 1912 and adopted the first standardized US birthstone list. Birth flowers have no equivalent meeting on record. Cornell University Library's exhibit on Victorian floriography traces the modern tradition instead to a wave of competing 19th-century French and British dictionaries, whose authors, in the library's own description, \"linked flowers with classical mythology, folklore, heraldry, fortune-telling, and birthdays\" as the fashion for flower symbolism spread through the newly prosperous middle classes of Britain, France, and the US.",
          "No single one of those books became the standard the way the 1912 jewelers' meeting did for gemstones. That's the practical reason August, and most other months, ended up with two flowers rather than one: different 19th-century compilers reached different answers, and later florist trade lists absorbed both rather than picking a winner."
        ]
      },
      {
        "heading": "If August only covers part of your birthday",
        "body": [
          "Gladiolus and poppy apply to the whole month, but the zodiac sign attached to an August birthday splits partway through. Leo runs from late July to August 22; Virgo picks up August 23 and holds it through most of September. Readers born in the back half of the month who want the zodiac side of the picture, not the flower side, can check this site's [Virgo dates](/virgo-dates/) page for how three different systems draw that particular boundary."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is August's birth flower?",
        "answer": "Gladiolus and poppy, per The Old Farmer's Almanac and the florist trade lists that follow it. August is a two-flower month, like most months on a modern birth-flower list."
      },
      {
        "question": "What does the gladiolus mean as a birth flower?",
        "answer": "Strength, integrity, and honor, in the Almanac's framing. The name itself comes from Latin for \"small sword,\" a reference the Roman naturalist Pliny the Elder gave it for its sword-shaped leaves, not for any tie to Roman gladiators."
      },
      {
        "question": "Which poppy is August's actual birth flower?",
        "answer": "The corn poppy, Papaver rhoeas, also called the field poppy or Flanders poppy: the species tied to World War I remembrance through the poem \"In Flanders Fields.\" It's a different plant from Papaver orientale, the Oriental poppy most florists sell as a cut flower."
      },
      {
        "question": "Why does August have two birth flowers instead of one?",
        "answer": "Because no single body ever standardized a birth-flower list the way the American jewelry trade standardized birthstones in 1912. Competing 19th-century floriography dictionaries assigned different flowers to the same months, and modern lists kept both rather than choosing."
      },
      {
        "question": "Is the Oriental poppy sold by florists the same as the remembrance poppy?",
        "answer": "No. Oriental poppy (Papaver orientale) is native to the Caucasus, northeastern Turkey, and northern Iran and has no documented connection to World War I remembrance. The corn poppy (Papaver rhoeas), native to the Mediterranean and North Africa, is the species behind that symbolism."
      },
      {
        "question": "I was born in late August. Is my zodiac sign Leo or Virgo?",
        "answer": "Depends on the exact date. Leo runs through August 22; Virgo starts August 23. This site's Virgo dates page checks that boundary against three separate date systems."
      }
    ],
    "sources": [
      {
        "label": "The Old Farmer's Almanac — August Birth Flowers: Gladiolus and Poppy",
        "url": "https://www.almanac.com/content/august-birth-flowers"
      },
      {
        "label": "Etymonline — Gladiolus",
        "url": "https://www.etymonline.com/word/gladiolus"
      },
      {
        "label": "Wikipedia — Gladiolus",
        "url": "https://en.wikipedia.org/wiki/Gladiolus"
      },
      {
        "label": "Missouri Botanical Garden — Gladiolus × gandavensis",
        "url": "https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?taxonid=254915&isprofile=0"
      },
      {
        "label": "1911 Encyclopædia Britannica — Gladiolus (via Wikisource)",
        "url": "https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Gladiolus"
      },
      {
        "label": "Wikipedia — Papaver rhoeas",
        "url": "https://en.wikipedia.org/wiki/Papaver_rhoeas"
      },
      {
        "label": "Wikipedia — Papaver orientale",
        "url": "https://en.wikipedia.org/wiki/Papaver_orientale"
      },
      {
        "label": "Wikipedia — In Flanders Fields",
        "url": "https://en.wikipedia.org/wiki/In_Flanders_Fields"
      },
      {
        "label": "Wikipedia — Remembrance poppy",
        "url": "https://en.wikipedia.org/wiki/Remembrance_poppy"
      },
      {
        "label": "Cornell University Library — Written in Petals: History",
        "url": "https://exhibits.library.cornell.edu/written-in-petals/about/history"
      }
    ],
    "image": "/images/august-birth-flower-poppy.jpg",
    "imageAlt": "Red corn poppy (Papaver rhoeas) in bloom, the wild field poppy species behind August's birth-flower symbolism",
    "imageCredit": "Photo by Diego Delso, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Amapola_(Papaver_rhoeas),_centro_de_Tallinn,_Estonia,_2012-08-05,_DD_01.JPG), CC BY-SA 3.0"
  },
  {
    "slug": "september-birth-flower",
    "category": "Birth Flowers",
    "title": "September Birth Flower: Aster and Morning Glory, Reclassified",
    "description": "September's birth flowers are aster and morning glory, but most New World asters haven't technically been genus Aster since a 1990s reclassification.",
    "published": "2026-08-12",
    "updated": "2026-08-12",
    "coreSummary": "September's birth flowers are aster, named from the Greek word for star, and morning glory, whose scientific name Ipomoea literally means \"worm-resembling\" and has nothing to do with the bloom. Most asters native to North America, including the New England aster common on US birth-flower lists, were reclassified out of genus Aster into Symphyotrichum by botanist Guy Nesom in the mid-1990s. Morning glory carries a second, separate history: the garden vine sold under that name, Ipomoea purpurea, is a different species from the morning glory relatives Aztec priests used in ritual divination.",
    "sections": [
      {
        "heading": "Aster and morning glory, and one gap already covered",
        "body": [
          "The Old Farmer's Almanac, the trade source behind most modern birth-flower lists, names aster and morning glory as September's pair. This site's [August birth flower](/august-birth-flower/) page found why no single body ever fixed one official birth-flower list, unlike birthstones, which trace to a documented 1912 trade convention: competing 19th-century floriography dictionaries assigned different flowers to the same months, and later trade lists absorbed more than one rather than picking a winner. That gap holds for September's pair too.",
          "What follows here goes past that argument, into the two plants themselves, which carry more specific history than \"aster\" and \"morning glory\" suggest on their own."
        ]
      },
      {
        "heading": "Aster: named for a star, then split away from most of its own genus",
        "body": [
          "Aster comes directly from the Greek word for star, itself descended from a Proto-Indo-European root that also produced the English word star, according to the Online Etymology Dictionary. Greek and Roman gardeners used the name for the plant's flower heads, whose thin ray petals radiate out from a center in roughly the shape the word describes.",
          "One version of the story behind that name involves the goddess Astraea. Astraea herself is a genuine classical figure: Hyginus and the astronomical poet Aratus both describe her living among mortals in an earlier, more virtuous age, then leaving earth as humanity turned cruel and becoming, in most tellings, the constellation Virgo. The detail tying her tears specifically to asters doesn't trace to Aratus, Hyginus, or any other classical source checked for this page. It reads instead like the kind of flower-myth embroidery that flourished during the same 19th-century floriography boom this site's August page traces the wider birth-flower tradition to, not an ancient account in its own right.",
          "The bigger surprise sits in the plant's scientific name, not its myth. Most asters native to North America, including the New England aster (Symphyotrichum novae-angliae) that shows up on the American side of most birth-flower photo galleries, haven't been classified in genus Aster for three decades. American botanist Guy Nesom laid out the molecular and structural evidence behind the split in a 1994 taxonomic overview of the genus, then formally transferred hundreds of New World species into new genera over the following year, the largest share landing in Symphyotrichum, a name first proposed back in 1832 but rarely used until Nesom's work revived it. Kew's Plants of the World Online currently lists more than 100 accepted Symphyotrichum species, New England aster among them, while Old World species like Aster amellus kept the original genus name. \"Aster\" still works as a common name across both groups. The scientific one no longer does, for most of the plants sold as September's birth flower in the US."
        ],
        "image": {
          "src": "/images/september-birth-flower-aster.jpg",
          "alt": "New England aster (Symphyotrichum novae-angliae) in bloom, one of the North American asters reclassified out of genus Aster in the mid-1990s",
          "credit": "Photo by The Cosmonaut, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Symphyotrichum_novae-angliae3.jpg), CC BY-SA 2.5 Canada"
        }
      },
      {
        "heading": "Morning glory: a name about timing, and two different plants behind its ritual history",
        "body": [
          "Morning glory's scientific name doesn't describe the flower at all. Ipomoea comes from two Greek words, ips (\"worm\") and homoios (\"resembling\"); North Carolina State University's Extension plant database traces the reference either to the genus's sprawling underground roots or to its worm-like twining growth habit, without settling on one over the other. The common English name covers the part the Latin skips: morning glory flowers unfurl fully at dawn and begin closing again by early afternoon, spent well before evening.",
          "The vine sold at nurseries and pictured on most birth-flower lists is usually the common morning glory, Ipomoea purpurea, native to Mexico and Central America and now naturalized worldwide, aggressively enough that parts of the southeastern United States classify it as a noxious weed, not a garden plant.",
          "That garden vine isn't the plant behind morning glory's other, older history. Aztec priests used the seeds of different morning glory relatives in religious divination, a practice recorded in Spanish colonial-era accounts of Aztec religious life. Ololiuqui, per Britannica, is the name recorded for what botanists currently classify as Ipomoea corymbosa, a plant long placed in its own genus, Turbina, and folded back into Ipomoea only as recently as 2020 on the strength of newer phylogenetic work. Tlitliltzin is a second plant that ethnobotanist R. Gordon Wasson identified as Ipomoea tricolor, an identification other researchers in the field, including Richard Evans Schultes, have disputed rather than confirmed. Both plants carry ergoline compounds structurally related to LSD, the reason for their ritual role. Both are also genuinely different species from Ipomoea purpurea, the common ornamental vine that carries morning glory's birth-flower symbolism today."
        ],
        "image": {
          "src": "/images/september-birth-flower-morning-glory.jpg",
          "alt": "Common morning glory (Ipomoea purpurea) in bloom, the garden species behind September's birth-flower symbolism and a different plant from the morning glory relatives used in Aztec ritual divination",
          "credit": "Photo by Derek Ramsey (Ram-Man), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ipomoea_purpurea_2400px.jpg), CC BY-SA 2.5"
        }
      },
      {
        "heading": "What the two flowers are said to mean, and one date that's still disputed",
        "body": [
          "The Old Farmer's Almanac gives aster the reading of love, wisdom, patience, beauty, faith, friendship, and purity, and ties specific shades to narrower meanings: purple for royalty and wisdom, white for innocence, red for devotion and passion, pink for love and kindness. For morning glory, the Almanac's own framing centers on love, and specifically unrequited love, tied to a flower that closes again the same afternoon it opens. Other florist sources instead read the same vine as a symbol of affection and a fresh start, without the two readings settling on one interpretation.",
          "Aster also shows up on some wedding-anniversary flower lists as the marker for a 20th anniversary, though not every list agrees; several give that slot to the daylily instead and list aster only as a secondary or alternate choice. As with the birth-flower assignments themselves, there's no single governing list settling which flower belongs to which year."
        ]
      },
      {
        "heading": "If your birthday falls in the back half of September",
        "body": [
          "Aster and morning glory cover the whole month, but the zodiac sign attached to a September birthday changes partway through. In Western tropical astrology, Virgo holds the date through September 22; Libra picks up on September 23. Readers born in the first three weeks of September, or close enough to that boundary to wonder which side they land on, can check this site's [Virgo dates](/virgo-dates/) page, which walks through why the exact boundary can shift by a day and what the same range looks like in two other systems."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is September's birth flower?",
        "answer": "Aster and morning glory, per The Old Farmer's Almanac and the florist trade lists that follow it. Like most months on a modern birth-flower list, September carries two flowers rather than one."
      },
      {
        "question": "What does aster mean as a birth flower?",
        "answer": "Love, wisdom, patience, beauty, faith, friendship, and purity, in the Old Farmer's Almanac's framing, with narrower meanings tied to color: purple for royalty and wisdom, white for innocence, red for devotion and passion, pink for love and kindness. The name itself comes from the Greek word for star, a reference to the shape of its ray petals."
      },
      {
        "question": "Are all asters still classified in the genus Aster?",
        "answer": "No. Most asters native to North America, including the New England aster common on US birth-flower lists, were reclassified into the genus Symphyotrichum by botanist Guy Nesom starting in the mid-1990s. Old World species like Aster amellus kept the original genus name; \"aster\" still works as a common name across both groups, but the scientific name no longer does."
      },
      {
        "question": "What does morning glory mean as a birth flower?",
        "answer": "The Old Farmer's Almanac frames it around love, specifically unrequited love, tied to a flower that opens at dawn and closes again the same afternoon. Other florist sources instead read it as a symbol of affection and a fresh start; the two readings don't fully agree."
      },
      {
        "question": "Is the morning glory sold at nurseries the same plant Aztec priests used in rituals?",
        "answer": "No. The garden vine sold as September's birth flower is usually Ipomoea purpurea, the common morning glory. The plants tied to Aztec ritual divination, ololiuqui and tlitliltzin, are classified as different species: Ipomoea corymbosa and, per one contested identification, Ipomoea tricolor."
      },
      {
        "question": "I was born in late September. Is my zodiac sign Virgo or Libra?",
        "answer": "Depends on the exact date. In Western tropical astrology, Virgo runs through September 22; Libra starts September 23. This site's Virgo dates page checks that boundary against three separate date systems."
      }
    ],
    "sources": [
      {
        "label": "The Old Farmer's Almanac — September Birth Flowers: Aster and Morning Glory",
        "url": "https://www.almanac.com/september-birth-flowers"
      },
      {
        "label": "Etymonline — Aster",
        "url": "https://www.etymonline.com/word/aster"
      },
      {
        "label": "Theoi.com — Astraea",
        "url": "https://www.theoi.com/Titan/Astraia.html"
      },
      {
        "label": "Wikipedia — Astraea",
        "url": "https://en.wikipedia.org/wiki/Astraea"
      },
      {
        "label": "Guy Nesom — Name Changes in Aster",
        "url": "https://www.guynesom.com/NameChangesInAsterWEB.htm"
      },
      {
        "label": "Kew Plants of the World Online — Symphyotrichum novae-angliae",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:981863-1"
      },
      {
        "label": "North Carolina State University Extension — Ipomoea",
        "url": "https://plants.ces.ncsu.edu/plants/ipomoea/"
      },
      {
        "label": "North Carolina State University Extension — Ipomoea purpurea",
        "url": "https://plants.ces.ncsu.edu/plants/ipomoea-purpurea/"
      },
      {
        "label": "Britannica — Ololiuqui",
        "url": "https://www.britannica.com/plant/ololiuqui"
      },
      {
        "label": "Kew Plants of the World Online — Ipomoea corymbosa",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:60458008-2/general-information"
      }
    ],
    "image": "/images/september-birth-flower-aster.jpg",
    "imageAlt": "New England aster (Symphyotrichum novae-angliae) in bloom, one of the North American asters reclassified out of genus Aster in the mid-1990s",
    "imageCredit": "Photo by The Cosmonaut, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Symphyotrichum_novae-angliae3.jpg), CC BY-SA 2.5 Canada"
  },
  {
    "slug": "july-birth-flower",
    "category": "Birth Flowers",
    "title": "July Birth Flower: Larkspur and Water Lily, Egypt's Other Lotus",
    "description": "July's birth flowers are larkspur and water lily, but the plant behind ancient Egypt's 'lotus' myth is a water lily, and only distantly related to a true lotus.",
    "published": "2026-08-12",
    "updated": "2026-08-12",
    "coreSummary": "July's birth flowers are larkspur, whose scientific name Delphinium comes from a Greek word for dolphin describing the shape of its nectary rather than the lark's-claw spur its English name describes, and water lily, the flower behind ancient Egypt's 'lotus' creation myth. The larkspur sold at flower shops, Delphinium elatum, is a Eurasian hybrid; a separate wild North American species, Delphinium bicolor, is the one a documented Kainai (Blackfoot Confederacy) tradition used for blue dye and medicine. The water lily's Egyptian 'lotus' association is also a naming leftover: the true lotus, Nelumbo nucifera, is only distantly related to water lilies, with sycamore trees among its closer living relatives.",
    "sections": [
      {
        "heading": "Larkspur and water lily, and two names apiece",
        "body": [
          "July's pair, per The Old Farmer's Almanac and the florist trade lists built on it, is larkspur and water lily. Larkspur is read as positivity, loving bonds, dedication, and sincerity; water lily as purity, innocence, and rebirth. Neither name is quite as simple as it looks once the actual plants behind it get checked.",
          "Start with larkspur itself: it's not one plant. The Almanac's own entry says the common name covers two closely related genera, annual Consolida and perennial Delphinium, and that Consolida is often treated as a subgroup of Delphinium rather than its own separate line. That's the smaller of the two naming problems this page runs into."
        ]
      },
      {
        "heading": "Larkspur: a dolphin-shaped name, and a different larkspur behind the older uses",
        "body": [
          "Delphinium comes from the Greek delphínion, itself built on delphís, \"dolphin\"; Dictionary.com's etymology entry dates the English borrowing to the mid-17th century and attributes the name to the shape of the flower's nectary, not to any dolphin-colored bloom. \"Larkspur,\" the separate English common name, comes from an unrelated comparison: Wiktionary traces it to lark plus spur, describing the flower's backward-pointing spur as a match for the hind toe of a lark.",
          "The plant sold at florists under either name is usually Delphinium elatum, a tall hybrid, 3 to 5 feet at bloom, native across Europe and northern and central Asia, according to the Missouri Botanical Garden's plant records. It is toxic if ingested, a warning the Almanac repeats alongside the symbolism.",
          "That garden plant isn't the species behind the dye-and-medicine tradition many florist pages attribute to \"Native Americans\" without saying which nation or which plant. The Galileo Educational Network's Kainai Plants and Culture project, built with the Kainai (Blood Tribe) of the Blackfoot Confederacy in Alberta, documents that specific use for Delphinium bicolor, or little larkspur: a wild prairie and foothill species under 16 inches tall, native to a range from British Columbia to South Dakota, a different continent from the Eurasian species sold as cut flowers. Per that record, a weak tea from the flowers was used for children with severe diarrhea and for fainting spells, a stronger tea dyed arrow quills blue, and a third preparation was used on a woman's hair to make it shine and lie straight. The same source is explicit that only someone taught the correct dose by an elder should prepare any of it, since the plant, especially its seed, is poisonous.",
          "Color carries its own meaning on the Almanac's chart: blue, rare among flowers, for dignity and grace; pink for fickleness; white for happiness and joy; purple for first love. The Almanac also traces a separate, older origin story back to Greek mythology, where larkspur is said to have grown from the spilled blood of the warrior Ajax after the Battle of Troy, and records a later English folk belief that scattering the flower in bathwater warded off ghosts. Neither claim is the kind of thing a botanist could verify; both simply show how much unrelated symbolism has attached itself to one plant name over the centuries, alongside the specific, documented Kainai use above."
        ],
        "image": {
          "src": "/images/july-birth-flower-larkspur.jpg",
          "alt": "Delphinium bicolor (little larkspur) blooming in open, rocky prairie habitat, the wild North American species documented in Kainai ethnobotanical tradition rather than the Eurasian hybrid sold at florists",
          "credit": "Photo by Matt Lavin, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Delphinium_bicolor_(3625586495).jpg), CC BY-SA 2.0"
        }
      },
      {
        "heading": "Water lily: the flower behind Egypt's 'lotus'",
        "body": [
          "Nymphaea, the water lily genus, is named for the nymphs of Greek myth, water-dwelling minor goddesses; the family name Nymphaeaceae follows the same root. On the Almanac's Western color chart, white water lilies read as purity, innocence, and chastity, pink as joy and friendship, red as passion and romance, blue as calm and wisdom, and yellow as energy and new beginnings; the Almanac separately notes that in Buddhism and Hinduism, the same flower is read as resurrection and rebirth, tied to how the bloom opens and closes each day.",
          "The flower's older, larger association is Egyptian. In the creation account centered on Heliopolis, the sun god Ra was said to have arisen from a flower that emerged from Nun, the primordial waters, at the start of the world; Wikipedia's entry on the god Nefertem, tied to the same myth, quotes a line from the Book of the Dead calling on the reader to \"rise like Nefertem from the blue water lily, to the nostrils of Ra (the creator and sungod), and come forth upon the horizon each day.\" Nefertem's own listed symbol is the water lily, and the species behind both the myth and the flower's frequent appearance in Egyptian art is Nymphaea caerulea, the Egyptian blue water lily, per that same entry and Wikipedia's separate disambiguation page for \"blue lotus,\" which identifies N. caerulea specifically as \"a water lily in the genus Nymphaea that was known to the Ancient Egyptian civilizations.\""
        ],
        "image": {
          "src": "/images/july-birth-flower-water-lily.jpg",
          "alt": "Nymphaea caerulea, the Egyptian blue water lily, in bloom, the species behind ancient Egypt's Nefertem and sun-god creation mythology",
          "credit": "Photo by Ermell, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Nymphaea_caerulea-20091014-RM-115245.jpg), CC BY-SA 4.0"
        }
      },
      {
        "heading": "Why \"lotus\" and \"water lily\" keep getting confused",
        "body": [
          "\"Lotus\" gets attached to Egypt's water lily constantly, in translations of the myth above and in casual usage generally, and the mix-up isn't only a modern one. Wikipedia's classification section for Nelumbo nucifera, the true lotus, notes that older botanical systems, including the Bentham & Hooker system still referenced in parts of the Indian subcontinent, filed that species under an old synonym, Nymphaea nelumbo, naming it as if it were a water lily outright.",
          "Genetic classification settled the question the other way. Under the current APG IV system, Nelumbo nucifera and its one surviving relative, Nelumbo lutea, sit in their own family, Nelumbonaceae, inside the order Proteales, and Wikipedia's article on the species states plainly that the closest living relatives of Nelumbo, per that classification, are the sycamores, family Platanaceae, not any water lily. Nymphaeaceae, the water lily family, belongs to an entirely separate order, Nymphaeales, with a fossil record Wikipedia's own taxobox traces back roughly 130 million years to the Early Cretaceous, placing it among the earliest-diverging lineages of living flowering plants.",
          "So the plant behind Egypt's own myth, a water lily, and the plant most modern retellings translate that myth's name as, a lotus, turn out to be, by descent, two of the more distantly related branches on the entire flowering-plant tree. The water lily's own daily rhythm, opening its bloom and closing it again later the same day, is what gave it the sun-god symbolism at Heliopolis in the first place and, on the Almanac's own chart, the separate tie to rebirth in Buddhist and Hindu tradition. Both plants grow rooted in water and produce a large, showy, symbolically loaded flower, similar enough on sight that later Western botany itself, not just casual translation, mixed them up more than once: the Bentham & Hooker system filed true lotus under that same water-lily synonym, and the separate, more recent Cronquist system independently grouped Nelumbo with the water lilies again, this time explicitly on anatomical grounds, before DNA evidence in the current APG IV system split the two apart for good."
        ]
      },
      {
        "heading": "July's other reference points",
        "body": [
          "For the gemstone side of a July birthday rather than the flower side, this site's [birthstones by month](/birthstones-by-month/) page lists July's current official stone as ruby alone, per Jewelers of America's live buying guide, with no second stone the way June or December carry three. And for why birth flowers, unlike birthstones, never settled on one standardized list in the first place, this site's [August birth flower](/august-birth-flower/) page traces that gap to a wave of competing 19th-century flower dictionaries that never had their own version of the single 1912 trade meeting that fixed the birthstone chart."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is July's birth flower?",
        "answer": "Larkspur and water lily, per The Old Farmer's Almanac and the florist trade lists that follow it. \"Larkspur\" itself covers two closely related genera, Consolida and Delphinium, often treated as one group."
      },
      {
        "question": "What does larkspur mean as a birth flower?",
        "answer": "Positivity, loving bonds, dedication, and sincerity, in the Almanac's framing, with color adding a narrower meaning: blue for dignity and grace, pink for fickleness, white for happiness and joy, purple for first love. The name Delphinium comes from Greek for \"dolphin,\" describing the shape of the nectary; \"larkspur\" is a separate English name comparing the flower's spur to a lark's hind claw."
      },
      {
        "question": "Is the larkspur used in Native American dye traditions the same plant sold at florists?",
        "answer": "Not usually. Florist larkspur is typically Delphinium elatum, a hybrid bred from species native to Europe and Siberia. A documented Kainai (Blood Tribe, Blackfoot Confederacy) tradition recorded by the Galileo Educational Network describes dye and medicinal tea uses specifically for Delphinium bicolor, a smaller wild species native to western North America, a different plant from a different continent."
      },
      {
        "question": "What does water lily mean as a birth flower?",
        "answer": "Purity, innocence, and rebirth, in the Almanac's framing, with color adding narrower meanings: white for purity and chastity, pink for joy and friendship, red for passion and romance, blue for calm and wisdom, and yellow for energy and new beginnings."
      },
      {
        "question": "Is July's water lily the same plant as the Egyptian lotus?",
        "answer": "The plant behind ancient Egypt's lotus imagery, including the myth of the sun god Ra and the god Nefertem, is specifically Nymphaea caerulea, a true water lily, not the unrelated plant most modern usage calls \"true lotus,\" Nelumbo nucifera. The two have been mixed up for centuries, including in some historical taxonomy, but current genetic classification places Nelumbo closer to sycamore trees than to any water lily."
      },
      {
        "question": "What is July's birthstone?",
        "answer": "Ruby, per Jewelers of America's current buying guide, which lists July as a single-stone month. This site's birthstones by month page has the full chart."
      }
    ],
    "sources": [
      {
        "label": "The Old Farmer's Almanac — July Birth Flowers: Larkspur and Water Lily",
        "url": "https://www.almanac.com/content/july-birth-flowers"
      },
      {
        "label": "Dictionary.com — Delphinium (Etymology)",
        "url": "https://www.dictionary.com/browse/delphinium"
      },
      {
        "label": "Wiktionary — Larkspur",
        "url": "https://en.wiktionary.org/wiki/larkspur"
      },
      {
        "label": "Missouri Botanical Garden — Delphinium elatum",
        "url": "https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?taxonid=299459"
      },
      {
        "label": "Galileo Educational Network — Kainai Plants and Culture: Larkspur",
        "url": "https://galileo.org/kainai/larkspur/"
      },
      {
        "label": "Wikipedia — Delphinium bicolor",
        "url": "https://en.wikipedia.org/wiki/Delphinium_bicolor"
      },
      {
        "label": "Wikipedia — Nefertem",
        "url": "https://en.wikipedia.org/wiki/Nefertem"
      },
      {
        "label": "Wikipedia — Blue lotus (disambiguation)",
        "url": "https://en.wikipedia.org/wiki/Blue_lotus"
      },
      {
        "label": "Wikipedia — Nelumbo nucifera",
        "url": "https://en.wikipedia.org/wiki/Nelumbo_nucifera"
      },
      {
        "label": "Wikipedia — Nymphaeaceae",
        "url": "https://en.wikipedia.org/wiki/Nymphaeaceae"
      }
    ],
    "image": "/images/july-birth-flower-larkspur.jpg",
    "imageAlt": "Delphinium bicolor (little larkspur) blooming in open, rocky prairie habitat, the wild North American species documented in Kainai ethnobotanical tradition rather than the Eurasian hybrid sold at florists",
    "imageCredit": "Photo by Matt Lavin, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Delphinium_bicolor_(3625586495).jpg), CC BY-SA 2.0"
  },
  {
    "slug": "talk-like-a-pirate-day",
    "category": "Observances",
    "title": "Talk Like a Pirate Day: September 19, and Its Undisputed Origin",
    "description": "Talk Like a Pirate Day falls on September 19, invented in 1995 during a racquetball game, with an origin story fully documented by its two named founders.",
    "published": "2026-08-12",
    "updated": "2026-08-12",
    "coreSummary": "Talk Like a Pirate Day is a novelty US observance held every September 19, invented in 1995 by John Baur and Mark Summers of Albany, Oregon, and popularized internationally after humor columnist Dave Barry wrote about it in 2002. Unlike most observances on this calendar, both founders are named, still alive, and have told the same origin story consistently for three decades, including the specific reasoning behind the September 19 date.",
    "dateRule": {
      "kind": "fixed",
      "text": "September 19 every year, worldwide. No source describes a weekend-shift convention or a regional variant date.",
      "source": {
        "label": "Wikipedia — International Talk Like a Pirate Day",
        "url": "https://en.wikipedia.org/wiki/International_Talk_Like_a_Pirate_Day"
      },
      "occurrences": [
        { "date": "2026-09-19", "weekday": "Saturday" },
        { "date": "2027-09-19", "weekday": "Sunday" },
        { "date": "2028-09-19", "weekday": "Tuesday" },
        { "date": "2029-09-19", "weekday": "Wednesday" },
        { "date": "2030-09-19", "weekday": "Thursday" },
        { "date": "2031-09-19", "weekday": "Friday" }
      ]
    },
    "founding": {
      "status": "documented",
      "text": "John Baur (\"Ol' Chumbucket\") and Mark Summers (\"Cap'n Slappy\"), two friends from Albany, Oregon, invented Talk Like a Pirate Day on June 6, 1995, during a game of racquetball. By their own account, one of them strained a muscle reaching for a low shot and yelled out \"Oh, jeez, my hamstring!,\" and for reasons neither has ever fully explained, they kept trading encouragement in pirate slang for the rest of the game. By the end of the match they had agreed the world needed a day devoted to talking like a pirate. They deliberately did not set the observance on June 6 itself, out of respect for that date's significance as the anniversary of the D-Day landings, and instead picked September 19 because it was Summers's ex-wife's birthday: a date he would have no trouble remembering, and one not already claimed by a bigger observance. For seven years the pair marked the day quietly with a small circle of friends. In 2002 they wrote to Miami Herald humor columnist Dave Barry asking him to serve as the holiday's spokesman; Barry agreed and devoted his September 8, 2002 column to the idea, which is what carried it from a private joke between two men to an internationally recognized novelty holiday. Baur and Summers still run the holiday's official website and have repeated the same account, with the same names, date, and reasoning, in press coverage spanning from the early 2000s through recent years.",
      "source": {
        "label": "Wikipedia — International Talk Like a Pirate Day",
        "url": "https://en.wikipedia.org/wiki/International_Talk_Like_a_Pirate_Day"
      }
    },
    "sections": [
      {
        "heading": "What Talk Like a Pirate Day is",
        "body": [
          "Talk Like a Pirate Day is a novelty observance held every September 19, when participants greet each other in mock-pirate slang (\"ahoy,\" \"arrr,\" \"matey\") for the fun of it. It carries no legal status anywhere: no government recognizes it, no country gives workers the day off, and banks and offices run their normal schedule. In 2026 it falls on a Saturday.",
          "The day spreads almost entirely through social media, novelty retail, and restaurant marketing rather than any civic or religious institution. Krispy Kreme has run pirate-talk promotions offering free doughnuts to customers who order in pirate speak, and bars and pubs use the date as a hook for rum-drink specials and costume nights. That commercial pickup, more than any formal recognition, is what has kept the day visible for three decades."
        ]
      },
      {
        "heading": "The racquetball game that started it",
        "body": [
          "The origin traces to one specific afternoon: June 6, 1995, when John Baur and Mark Summers, two friends from Albany, Oregon, were playing racquetball. One of them strained a muscle reaching for a low shot and blurted out \"Oh, jeez, my hamstring!\" Neither has ever fully explained why, but the pair started trading encouragement in exaggerated pirate slang for the rest of the game, and by their own telling, decided on the spot that a whole day should be built around it.",
          "The date itself took more thought than the joke did. June 6 is the anniversary of the D-Day landings, and Baur and Summers did not want their gag holiday sitting on top of that anniversary, so they looked for a different date. They landed on September 19 for a practical reason: it was Summers's ex-wife's birthday, a date he already had memorized and wasn't going to forget, and it wasn't already occupied by a bigger observance. Neither man has offered a grander explanation than that in the three decades since. Most \"why this date\" questions on this calendar don't have an answer this specific."
        ]
      },
      {
        "heading": "How one newspaper column made it real",
        "body": [
          "For the first seven years, Talk Like a Pirate Day stayed exactly what it started as: a private joke between Baur, Summers, and a small circle of friends. That changed in 2002, when the pair wrote to Miami Herald humor columnist Dave Barry and asked him to become the holiday's official spokesman. Barry, apparently charmed by the pitch, devoted his September 8, 2002 column to the idea and ran with it. That single column is what carried the day from a regional in-joke to an internationally recognized novelty observance.",
          "That popularity has never converted into official recognition. In the early 2010s, a petition asking the Obama White House to formally recognize Talk Like a Pirate Day was filed on the administration's \"We the People\" platform, which required petitions to clear a signature threshold before earning an official response. This one did not reach that threshold and was archived without a response, alongside a long list of similarly off-beat petitions from the same era. It remains, thirty years on, exactly what its founders built: a widely celebrated but entirely unofficial day."
        ]
      },
      {
        "heading": "The pirate voice almost nobody in the Golden Age of Piracy actually used",
        "body": [
          "The exaggerated \"arrr, matey\" accent that Talk Like a Pirate Day participants reach for traces to a specific performance, not to any historical record of how pirates actually spoke: English actor Robert Newton playing Long John Silver in Walt Disney's 1950 film adaptation of Treasure Island. Newton, born in Dorset and raised near Land's End in Cornwall, leaned hard into his own native West Country accent for the role, a dialect that rolls its r's and swaps in \"be\" for \"is\" and \"are.\" Audiences loved it, Newton reprised the same voice in Blackbeard the Pirate (1952) and the television series The Adventures of Long John Silver, and the accent stuck as pop culture's default idea of how a pirate sounds, according to both History.com and Smithsonian Magazine's accounts of the film's legacy.",
          "The accent may be less invented than it looks, though. During the Golden Age of Piracy in the late 17th and early 18th centuries, a large share of well-known pirates, including Blackbeard, who was most likely born in Bristol, came from that same stretch of England: Bristol, Devon, and Cornwall. Newton wasn't inventing a voice from nothing so much as exaggerating the regional accent of the part of England that produced many of the era's best-known pirates. That doesn't make the Hollywood version historically precise, since Newton's delivery was still a theatrical amplification built for the screen rather than a linguist's reconstruction, but it means pop culture's \"fake\" pirate voice landed closer to how real pirates from that region actually talked than most people would guess."
        ]
      },
      {
        "heading": "A rare case of a documented founding",
        "body": [
          "Most \"national day\" observances covered on this calendar trace back to a founding story that is vague, undocumented, or contested in some way. [National Boss's Day](/national-bosses-day/) rests on a 1958 registration whose Wikipedia entry still carries an unresolved citation-needed tag. [National Dog Day](/national-dog-day/) has two different, unreconciled explanations for its own existence, coming from the same founder's organization. [National Cat Day](/national-cat-day/) has a named founder, Colleen Paige, but no source has ever recorded why she picked October 29 specifically, as opposed to any other date.",
          "Talk Like a Pirate Day is the exception. Both founders are named, both are still alive, both still run the holiday's official website, and the reasoning behind the date, avoiding D-Day and landing on an easy-to-remember birthday, has been told the same way in interviews spanning more than two decades. That level of consistency is unusual among the observances this calendar covers. The pirate jokes are beside the point; what sets this entry apart is that there's nothing left to fact-check."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is Talk Like a Pirate Day in 2026?",
        "answer": "Saturday, September 19, 2026. The date is fixed at September 19 every year and does not shift for weekends."
      },
      {
        "question": "Who invented Talk Like a Pirate Day?",
        "answer": "John Baur (\"Ol' Chumbucket\") and Mark Summers (\"Cap'n Slappy\"), two friends from Albany, Oregon, who came up with the idea during a racquetball game on June 6, 1995. They still run the holiday's official website."
      },
      {
        "question": "Why is Talk Like a Pirate Day on September 19?",
        "answer": "The founders didn't want the holiday sitting on June 6, the day they invented it, out of respect for that date's significance as the D-Day anniversary. They chose September 19 instead because it was co-founder Mark Summers's ex-wife's birthday, a date he already had memorized and one not claimed by a bigger observance."
      },
      {
        "question": "Is Talk Like a Pirate Day an official holiday?",
        "answer": "No. It has no legal status anywhere. A petition asking the Obama White House to formally recognize it, filed on the \"We the People\" platform in the early 2010s, did not reach the signature threshold required for an official response and was archived."
      },
      {
        "question": "How did Talk Like a Pirate Day become popular?",
        "answer": "For its first seven years it was a private joke among a small circle of friends. In 2002, the founders asked Miami Herald humor columnist Dave Barry to serve as spokesman; Barry devoted his September 8, 2002 column to the idea, and that column is what carried it to national and then international attention."
      },
      {
        "question": "Where does the stereotypical pirate accent come from?",
        "answer": "English actor Robert Newton's performance as Long John Silver in Disney's 1950 film Treasure Island. Newton exaggerated his own native West Country English accent for the role, and it became the pop-culture template for how pirates are supposed to sound, per History.com and Smithsonian Magazine."
      },
      {
        "question": "Is the pirate accent historically accurate?",
        "answer": "Partly, by coincidence rather than design. Robert Newton's 1950 film accent was a theatrical exaggeration, not a researched reconstruction, but the West Country region he drew it from (Bristol, Devon, and Cornwall) really did produce a large share of Golden Age of Piracy's most famous pirates, including Blackbeard, who was most likely born in Bristol."
      }
    ],
    "sources": [
      {
        "label": "Wikipedia — International Talk Like a Pirate Day",
        "url": "https://en.wikipedia.org/wiki/International_Talk_Like_a_Pirate_Day"
      },
      {
        "label": "International Talk Like a Pirate Day (official site) — How It All Started",
        "url": "https://talklikeapiratecom.wpcomstaging.com/sample-page/"
      },
      {
        "label": "National Today — Talk Like a Pirate Day",
        "url": "https://nationaltoday.com/talk-like-a-pirate-day/"
      },
      {
        "label": "Britannica — Ahoy! It's Talk Like a Pirate Day",
        "url": "https://www.britannica.com/story/ahoy-its-talk-like-a-pirate-day"
      },
      {
        "label": "History.com — The Origins of the Pirate Accent",
        "url": "https://www.history.com/articles/pirate-talk-accent-origins-robert-newton"
      },
      {
        "label": "Smithsonian Magazine — This Film Version of 'Treasure Island' Gave Us Our Image of Pirates",
        "url": "https://www.smithsonianmag.com/smart-news/film-version-treasure-island-gave-us-our-image-pirates-180967149/"
      },
      {
        "label": "We the People (Obama White House archive) — Recognize International Talk Like a Pirate Day",
        "url": "https://petitions.obamawhitehouse.archives.gov/petition/recognize-international-talk-pirate-day-september-19/"
      }
    ],
    "image": "/images/talk-like-a-pirate-day.jpg",
    "imageAlt": "Illustrated black flag reconstruction of pirate Bartholomew Roberts's Jolly Roger, showing a pirate figure standing on two skulls",
    "imageCredit": "Illustration by TheLastBrunnenG, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Jolly_Roger_flag_of_pirate_Bartholomew_Roberts.jpg), CC BY-SA 4.0"
  },
  {
    "slug": "epilepsy-awareness-month",
    "category": "Observances",
    "title": "National Epilepsy Awareness Month: The Resolution That Never Passed",
    "description": "November is National Epilepsy Awareness Month. Congress tried three times to make it official, in 2002, 2003, and 2011 — none of the resolutions ever passed.",
    "published": "2026-08-13",
    "updated": "2026-08-13",
    "coreSummary": "National Epilepsy Awareness Month runs every November in the United States, an observance the Epilepsy Foundation says it began organizing in 1969. The widely repeated claim that Congress formally recognized the month in 2003 does not hold up against the primary congressional record: a Senate resolution in 2002, a House resolution in 2003, and a second House resolution in 2011 were each introduced and referred to committee, and none of the three ever came to a vote in either chamber.",
    "dateRule": {
      "kind": "fixed",
      "text": "All of November, every year, in the United States — not a single date within the month.",
      "status": "documented",
      "source": {
        "label": "Epilepsy Foundation of Northeastern New York — The History of National Epilepsy Awareness Month (NEAM)",
        "url": "https://efneny.org/2024/10/25/the-history-of-national-epilepsy-awareness-month-neam/"
      },
      "occurrences": [
        { "date": "2026-11-01", "weekday": "Sunday" },
        { "date": "2027-11-01", "weekday": "Monday" },
        { "date": "2028-11-01", "weekday": "Wednesday" },
        { "date": "2029-11-01", "weekday": "Thursday" },
        { "date": "2030-11-01", "weekday": "Friday" },
        { "date": "2031-11-01", "weekday": "Saturday" }
      ],
      "caveat": "Do not confuse this month-long US observance with Purple Day, a single day, March 26, founded separately in Canada in 2008 and now marked in more than 100 countries. Purple Day falls inside National Epilepsy Awareness Month only when the two are compared loosely; its own date and origin have nothing to do with November or with any of the congressional resolutions described below. Readers should also treat the commonly repeated claim that \"Congress declared November National Epilepsy Awareness Month in 2003\" with caution: no resolution on the primary congressional record ever passed either chamber. Every November recognition to date has come from the Epilepsy Foundation's own campaign, from individual state governors issuing their own proclamations in some years, or from advocacy groups asking a sitting president for federal recognition that, as of this page's research, had not been issued."
    },
    "founding": {
      "status": "documented",
      "text": "The Epilepsy Foundation, a national nonprofit founded in 1968, says it began organizing a November awareness campaign in 1969; this calendar found that claim repeated by an actual Foundation regional affiliate, the Epilepsy Foundation of Northeastern New York, but could not check it against a dated primary Foundation document, so it is treated as an organizational self-report rather than an independently verifiable fact, the same caveat this calendar applies to the American Diabetes Association's parallel 1975 claim for [American Diabetes Month](/diabetes-awareness-month/).\n\nWhat is independently checkable, in the primary congressional record, is that Congress has tried three separate times to put a federal designation behind that campaign, and none of the three attempts succeeded. On September 5, 2002, Senator Blanche Lincoln of Arkansas, joined by four original co-sponsors, introduced Senate Resolution 322 in the 107th Congress, which would have had the Senate designate November 2002 as \"National Epilepsy Awareness Month\" and asked the President to issue a proclamation. The resolution was referred to the Senate Judiciary Committee and never received a vote; it died there when that Congress ended.\n\nThe House tried next. On May 22, 2003, in the 108th Congress, a resolution \"supporting the goals and ideals of 'National Epilepsy Awareness Month' and urging funding for epilepsy research and service programs\" was introduced as House Concurrent Resolution 194, gathering 86 co-sponsors. It, too, was referred to committee and never came to a floor vote. A third attempt followed eight years later: House Resolution 298, introduced June 3, 2011, in the 112th Congress with 107 co-sponsors, expressed the sense of the House that federal agencies should coordinate existing epilepsy-awareness programs. It also died in committee without a vote.\n\nNo other resolution on the primary congressional record has attempted a fourth try since 2011. No sitting president has issued a proclamation naming November \"National Epilepsy Awareness Month\" at the federal level; the closest federal-adjacent action found in researching this page is the Epilepsy Foundation and allied advocacy groups asking a president to do exactly that, a request that, as of this page's research, had gone unanswered. Some state governors, Michigan's among them, have issued their own state-level proclamations in individual years. The month persists on the calendar the way it started: as the Epilepsy Foundation's own campaign, amplified by hospitals, regional Foundation affiliates, and advocacy groups, not by any standing federal statute.",
      "source": {
        "label": "S.Res.322 — 107th Congress, designating November 2002 as \"National Epilepsy Awareness Month\" (Congress.gov)",
        "url": "https://www.congress.gov/bill/107th-congress/senate-resolution/322"
      }
    },
    "sections": [
      {
        "heading": "What National Epilepsy Awareness Month is",
        "body": [
          "National Epilepsy Awareness Month (NEAM) is a US observance held every November, built around education, screening awareness, seizure first aid training, and reducing the stigma still attached to seizure disorders. The Centers for Disease Control and Prevention's most recent national estimate, from 2015 data, puts active epilepsy at 3.4 million Americans, 3 million adults and 470,000 children; a newer CDC survey covering 2021 to 2023 counted more than 3.1 million adults with active epilepsy on its own. The Epilepsy Foundation, the nonprofit that runs the campaign, cites a broader lifetime figure: roughly 1 in 10 people will have at least one seizure in their life, and about 1 in 26 will develop epilepsy at some point.",
          "The month carries no legal status. No federal law creates a day off, and government offices, banks, and schools run a normal November schedule around it. What does mark it is color: purple is the designated awareness shade, worn and displayed under the Epilepsy Foundation's own \"Share Your Purple Power\" campaign banner, along with wristbands, ribbon pins, and building light-ups in individual cities during the month."
        ]
      },
      {
        "heading": "Who started it, and the claim that doesn't hold up",
        "body": [
          "The Epilepsy Foundation, itself founded in 1968, says it began organizing a November campaign the following year, 1969. This calendar found that specific claim on a Foundation regional affiliate's own site, the Epilepsy Foundation of Northeastern New York, rather than on a dated document from the national organization, so it is recorded here as an organizational self-report, plausible and consistently repeated, but not independently checkable the way the congressional record below is.",
          "That same regional-affiliate page, and dozens of other health-media and nonprofit sites, go on to say that \"in 2003, the campaign was officially recognized by Congress.\" Checked against the primary congressional record, that claim does not hold up. No resolution making that designation ever passed either chamber of Congress, in 2003 or in any other year on record. What actually happened in and around that period is a pattern of introduced-but-failed resolutions, detailed below, which is a meaningfully different thing from an \"official\" congressional recognition, and a distinction this calendar has found blurred on sites that otherwise cover epilepsy carefully."
        ]
      },
      {
        "heading": "Three resolutions, and three times they died in committee",
        "body": [
          "The first attempt came from the Senate. On September 5, 2002, Senator Blanche Lincoln of Arkansas introduced Senate Resolution 322 in the 107th Congress, with Senators Susan Collins, Mary Landrieu, Tim Hutchinson, and Peter Fitzgerald as original co-sponsors. The resolution's text, read in full at GovTrack's mirror of the Congress.gov record, would have had the Senate \"designate[] November 2002, as 'National Epilepsy Awareness Month'\" and \"request[] that the President issue a proclamation calling upon the people of the United States to observe the month.\" It was referred to the Senate Committee on the Judiciary the same day it was introduced. It never received a vote and died when the 107th Congress ended in January 2003.",
          "The second attempt moved to the House the following spring. On May 22, 2003, in the 108th Congress, House Concurrent Resolution 194, \"supporting the goals and ideals of 'National Epilepsy Awareness Month' and urging funding for epilepsy research and service programs,\" was introduced with 86 co-sponsors, a substantial bipartisan list by the standard of most single-issue awareness resolutions. It followed the same path as its Senate predecessor: referred to committee, never brought to a floor vote, dead by the end of that Congress.",
          "A third try followed eight years later. House Resolution 298, introduced June 3, 2011, in the 112th Congress, gathered 107 co-sponsors and expressed \"the sense of the House of Representatives that there is need for specified agencies to coordinate and capitalize on existing programs for epilepsy awareness.\" Its fate matched the first two: committee referral, no vote, no passage. Three separate Congresses, three resolutions, three failures to reach a floor vote in either chamber, a pattern this calendar did not find repeated at quite this scale on any other US health observance it has checked so far."
        ],
        "image": {
          "src": "/images/epilepsy-awareness-month-timeline.svg",
          "alt": "Timeline from 1969 to today showing the Epilepsy Foundation's unverified 1969 claim, three failed congressional resolutions in 2002, 2003, and 2011, the 2008 founding of the separate Purple Day observance, and the absence of any federal statute or proclamation to date"
        }
      },
      {
        "heading": "Not the same as Purple Day",
        "body": [
          "A separate, better-documented observance shares the same purple color and the same general cause but not the same date or the same origin. Purple Day falls on a single day, March 26, and traces to one named person with a specific, well-corroborated founding story: Cassidy Megan, a nine-year-old in Nova Scotia living with epilepsy herself, who held the first Purple Day event on March 26, 2008. \"In Grade 3, I didn't want people to feel alone and afraid like I did,\" Megan told CBC News in 2016. \"I wanted them to know there were other people out there and what to do if they see someone having a seizure.\" Purple Day launched internationally the following year, 2009, backed by the Anita Kaufmann Foundation and the Epilepsy Association of the Maritimes, and by 2016 was marked in more than 100 countries.",
          "The contrast is worth naming directly: Purple Day has a documented founder, a specific first event date, and a traceable international expansion, none of which this calendar could establish for National Epilepsy Awareness Month's broader November campaign. The two observances are frequently run together in the same promotional material, since both use purple and both concern epilepsy, but a reader planning around either one should treat them as genuinely separate: one day in March with a clear founding story, one month in November with an organizational claim this calendar could not independently verify and a congressional history of three resolutions that never passed."
        ]
      },
      {
        "heading": "Where the record stands, next to its November neighbors",
        "body": [
          "This calendar has now covered several November observances with different, checkable relationships to federal law, and Epilepsy Awareness Month's is the weakest of the group. [American Diabetes Month](/diabetes-awareness-month/) has an actual proclamation on record, Reagan's Proclamation 4994 in 1982 under Senate Joint Resolution 257, renewed by name again in 1985, before Congress moved to non-binding resolutions after that. [No-Shave November](/no-shave-november/) sits at the other extreme: a private family's fundraising campaign that has never had any federal recognition attempted at all, successful or not. Epilepsy Awareness Month falls between those two but closer to No-Shave November's end: unlike Diabetes Month, it has no proclamation and no passed resolution on record at any point; unlike No-Shave November, three separate Congresses did attempt one, in 2002, 2003, and 2011, and all three tries died in committee. A resolution introduced and left to die is not the same as no resolution ever being introduced, but neither one adds up to the \"Congress declared it in 2003\" language that keeps circulating."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is National Epilepsy Awareness Month in 2026?",
        "answer": "All of November 2026, running Sunday, November 1 through Monday, November 30. It is a month-long observance, not a single date, and does not shift for weekends."
      },
      {
        "question": "Did Congress officially declare November National Epilepsy Awareness Month in 2003?",
        "answer": "No, despite how often that claim is repeated, including by Epilepsy Foundation regional affiliates. A House resolution supporting the month's goals was introduced in 2003 (H.Con.Res.194, 108th Congress) but was referred to committee and never received a vote. No resolution about National Epilepsy Awareness Month has ever passed either chamber of Congress."
      },
      {
        "question": "Who founded National Epilepsy Awareness Month?",
        "answer": "The Epilepsy Foundation says it began organizing a November campaign in 1969, a claim this calendar found on a Foundation regional affiliate's site but could not check against a dated national-organization document. Three later attempts to formalize the month through Congress, in 2002, 2003, and 2011, were all introduced and all died in committee without a vote."
      },
      {
        "question": "Is National Epilepsy Awareness Month the same as Purple Day?",
        "answer": "No. Purple Day is a single day, March 26, founded in 2008 by Cassidy Megan, a nine-year-old in Nova Scotia, with a documented founding story and a traceable 2009 international launch. National Epilepsy Awareness Month is the broader, month-long US campaign covering all of November, with a less independently verifiable founding claim and no successful congressional designation."
      },
      {
        "question": "Why is purple the color for epilepsy awareness?",
        "answer": "Purple is used by both November's National Epilepsy Awareness Month, under the Epilepsy Foundation's \"Share Your Purple Power\" campaign, and by the separate March 26 Purple Day. Purple Day's founder, Cassidy Megan, has said the color reflects lavender's long association with epilepsy awareness and the many different shades that, to her, mirror the many different types of seizures."
      },
      {
        "question": "Has a US president ever issued a federal proclamation for National Epilepsy Awareness Month?",
        "answer": "Not as of this page's research. Advocacy groups, including the Epilepsy Foundation, have asked presidents to issue one; some individual state governors have issued their own state-level proclamations in specific years, but no standing federal proclamation or statute names November for epilepsy the way one does for, for example, American Diabetes Month."
      }
    ],
    "sources": [
      {
        "label": "S.Res.322 — 107th Congress, designating November 2002 as \"National Epilepsy Awareness Month\" (Congress.gov)",
        "url": "https://www.congress.gov/bill/107th-congress/senate-resolution/322"
      },
      {
        "label": "H.Con.Res.194 — 108th Congress, supporting the goals and ideals of \"National Epilepsy Awareness Month\" (Congress.gov)",
        "url": "https://www.congress.gov/bill/108th-congress/house-concurrent-resolution/194"
      },
      {
        "label": "H.Res.298 — 112th Congress, on coordinating existing epilepsy-awareness programs (Congress.gov)",
        "url": "https://www.congress.gov/bill/112th-congress/house-resolution/298"
      },
      {
        "label": "Epilepsy Foundation of Northeastern New York — The History of National Epilepsy Awareness Month (NEAM), source of the \"recognized by Congress\" claim identified above",
        "url": "https://efneny.org/2024/10/25/the-history-of-national-epilepsy-awareness-month-neam/"
      },
      {
        "label": "Epilepsy Foundation — National Epilepsy Awareness Month (NEAM)",
        "url": "https://www.epilepsy.com/volunteer/spreading-awareness/national-epilepsy-awareness-month"
      },
      {
        "label": "National and State Estimates of the Numbers of Adults and Children with Active Epilepsy — United States, 2015 (CDC, MMWR)",
        "url": "https://www.cdc.gov/mmwr/volumes/66/wr/mm6631a1.htm"
      },
      {
        "label": "Purple Day, epilepsy awareness day, turned 8 on March 26 (CBC News, 2016, source of the Cassidy Megan quote above)",
        "url": "https://www.cbc.ca/news/canada/nova-scotia/purple-day-2016-cassidy-megan-epilepsy-1.3508615"
      },
      {
        "label": "Purple Day (Epilepsy Foundation)",
        "url": "https://www.epilepsy.com/volunteer/spreading-awareness/purple-day"
      }
    ],
    "image": "/images/epilepsy-awareness-month-capitol.jpg",
    "imageAlt": "The United States Capitol building, where three separate resolutions to designate National Epilepsy Awareness Month were introduced in 2002, 2003, and 2011 and died in committee without a vote",
    "imageCredit": "U.S. House of Representatives, public domain, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2023_United_States_Capitol_118th_Congress,_sunrise.jpg)"
  },
  {
    "slug": "adhd-awareness-month",
    "category": "Observances",
    "title": "ADHD Awareness Month: Five Senate Resolutions, Then Silence",
    "description": "ADHD Awareness Month runs every October. The Senate approved a single September day five years straight, 2004 to 2008, then stopped, and never approved the month.",
    "published": "2026-08-13",
    "updated": "2026-08-13",
    "coreSummary": "ADHD Awareness Month runs every October in the United States, organized by a coalition of the Attention Deficit Disorder Association (ADDA), CHADD, and the ADHD Coaches Organization. The federal record is more specific than a single resolution: the Senate designated a single September date as \"National Attention Deficit Disorder Awareness Day\" five years running, 2004 through 2008, always sponsored by Senator Maria Cantwell and agreed to without objection each time. Then the practice stopped. No sixth resolution, no recurring annual designation, and no statute or proclamation naming October has been found since.",
    "dateRule": {
      "kind": "fixed",
      "text": "All of October, every year, in the United States — not a single date within the month, and not any of the five single September dates the Senate actually designated between 2004 and 2008.",
      "status": "conventional",
      "source": {
        "label": "ADDA — Where Did ADHD Awareness Month Get Its Start? (add.org)",
        "url": "https://add.org/adhd-awareness-history/"
      },
      "occurrences": [
        { "date": "2026-10-01", "weekday": "Thursday" },
        { "date": "2027-10-01", "weekday": "Friday" },
        { "date": "2028-10-01", "weekday": "Sunday" },
        { "date": "2029-10-01", "weekday": "Monday" },
        { "date": "2030-10-01", "weekday": "Tuesday" },
        { "date": "2031-10-01", "weekday": "Wednesday" }
      ],
      "caveat": "Do not confuse the October month observed today with the five dates Congress actually acted on. The Senate designated a single date each year as \"National Attention Deficit Disorder Awareness Day\" five years running: September 7, 2004 (S.Res.370), September 14, 2005 (S.Res.201), September 20, 2006 (S.Res.544), September 19, 2007 (S.Res.295), and September 18, 2008 (S.Res.649). Every one was a fresh, one-time designation for that year only, none of them a recurring rule, and no sixth resolution has been found after 2008. One secondary account of this history, on the blog ImpactADHD.com, describes the origin as \"the 3rd Wednesday of September.\" That happens to match two of the five actual dates, September 20, 2006 and September 19, 2007, which genuinely were the third Wednesday of their respective Septembers, but it does not match the other three: September 7, 2004 fell on a Tuesday, September 14, 2005 was the second Wednesday, and September 18, 2008 was a Thursday. None of the five resolutions ever stated a recurring weekday rule; each named one specific calendar date, decided fresh by the Senate each year, so the \"3rd Wednesday\" description is a coincidence that held for two years out of five, not a rule anyone actually passed."
    },
    "founding": {
      "status": "documented",
      "text": "The part of this history that is fully checkable against primary legislative documents turns out to be larger than a single resolution. On June 7, 2004, Senator Maria Cantwell of Washington, joined by Senator Richard Durbin of Illinois, introduced Senate Resolution 370 in the 108th Congress. It was referred to the Senate Judiciary Committee the same day, reported out without amendment by Committee Chairman Orrin Hatch on June 18, 2004, and agreed to by the full Senate, by unanimous consent, on July 6, 2004. Its text designates a single date, September 7, 2004, as \"National Attention Deficit Disorder Awareness Day,\" recognizes AD/HD as a major public health concern, and, uniquely among the five resolutions described below, requests that the President issue a proclamation calling on federal, state, and local administrators to observe the day. The Attention Deficit Disorder Association (ADDA) served as the resolution's sponsoring organization, and according to ADDA's own contemporaneous press release, worked directly with Cantwell's office on its drafting. David Giwerc, ADDA's president at the time, called the designation \"a monumental first step,\" adding, \"It is our hope that September 7, 2004 will be the beginning of a nationwide awareness leading to greater understanding and acceptance of AD/HD.\"\n\nWhat this calendar did not expect, and found only by searching Congress's own bill database beyond the 2004 resolution, is that the Senate repeated this exact act four more times. Cantwell and Durbin returned the following year with Senate Resolution 201, designating September 14, 2005, agreed to July 27, 2005. They returned again with Senate Resolution 544, designating September 20, 2006, agreed to July 28, 2006. In 2007, Cantwell submitted Senate Resolution 295 alone, without a co-sponsor, designating September 19, 2007, agreed to the same day it was submitted. In 2008, Cantwell was joined by Senator Gordon Smith of Oregon for Senate Resolution 649, designating September 18, 2008, agreed to September 8, 2008. All five were simple resolutions, all five passed without a recorded vote, and all five named a single calendar date for that year only, never a recurring day and never a month. One consistent change across the five: starting with the 2005 resolution, the text dropped the clause asking the President for a proclamation that the 2004 original had included, replacing it with language that only \"calls on Federal, State and local administrators and the people of the United States to observe the day.\" This calendar could not find a stated reason for that change, or a record of whether a proclamation was ever issued in response to the 2004 request.\n\nThen the pattern stops. This calendar searched Congress's bill database for any resolution matching this same title after 2008, and for any using the shorter \"ADHD Awareness\" phrasing in place of \"Attention Deficit Disorder,\" and found nothing: no sixth Senate resolution, no House companion, and no presidential proclamation naming an annual day or a month at the federal level in any year since 2008. What filled that gap afterward is not a sixth resolution but an advocacy coalition. The same organizations behind the Senate pushes, ADDA together with CHADD (Children and Adults with Attention-Deficit/Hyperactivity Disorder) and the ADHD Coaches Organization (ACO), kept the campaign going on their own, past the single September date, into a longer observance that today runs every October under the shared site ADHDAwarenessMonth.org. ADDA's own history page states that \"ADHD Awareness has grown from one day each year in 2004 to a full month, the month of October,\" without giving a specific year for that particular shift, and this calendar could not independently verify one, so no exact date for the week-to-month transition is claimed here.\n\nThe distinction that matters for a reader planning around this observance is not whether Congress ever acted, it did, five years running, but whether that action ever became permanent. It did not. Compare that to [American Diabetes Month](/diabetes-awareness-month/), where a single 1982 presidential proclamation was later renewed by name and has effectively continued since. ADHD Awareness had the opposite trajectory: five consecutive years of real Senate approval, then an abrupt stop, with the annual repetition, the move to October, and the month-long scope all left to the coalition's own doing from 2008 onward.",
      "source": {
        "label": "S.Res.370 — 108th Congress, designating September 7, 2004, as \"National Attention Deficit Disorder Awareness Day\" (GovInfo.gov, official bill text)",
        "url": "https://www.govinfo.gov/content/pkg/BILLS-108sres370ats/html/BILLS-108sres370ats.htm"
      }
    },
    "sections": [
      {
        "heading": "What ADHD Awareness Month is",
        "body": [
          "ADHD Awareness Month is a US observance held every October, built around public education about Attention-Deficit/Hyperactivity Disorder: how it is diagnosed, how it is treated, and how often it goes undiagnosed, especially in adults. The Centers for Disease Control and Prevention's data page puts current ADHD diagnoses at roughly 7 million US children and adolescents ages 3 to 17, about 11.7 percent, based on a national parent survey CDC ran in 2024; an earlier CDC-cited 2022 survey had put the ever-diagnosed figure at 11.4 percent, about 7.1 million, with 10.5 percent, about 6.5 million, carrying a current diagnosis at that time.",
          "The month carries no legal status. It creates no day off, and government offices, schools, and businesses run a normal October around it. It is organized, every year, by a coalition of three advocacy groups: the Attention Deficit Disorder Association (ADDA), CHADD, and the ADHD Coaches Organization (ACO), which jointly run webinars, public-education toolkits, and community events under the shared campaign site ADHDAwarenessMonth.org."
        ]
      },
      {
        "heading": "Five Septembers, five resolutions, then nothing",
        "body": [
          "Congress did not approve a single ADHD awareness day and stop there. It approved one every year for five years straight. Senator Maria Cantwell of Washington sponsored all five, always in the Senate, always as a simple resolution that passed the same day or within days of being introduced, by unanimous consent or without objection: Senate Resolution 370 in 2004 (with Senator Richard Durbin, designating September 7), Senate Resolution 201 in 2005 (again with Durbin, designating September 14), Senate Resolution 544 in 2006 (again with Durbin, designating September 20), Senate Resolution 295 in 2007 (Cantwell alone, designating September 19), and Senate Resolution 649 in 2008 (with Senator Gordon Smith of Oregon, designating September 18).",
          "Each resolution named a single calendar date for that year only. None of the five ever states a recurring rule, an annual formula, or a month. Read together, they show the Senate doing the same specific thing five years in a row rather than setting up a standing designation once and letting it run on its own; each year required a new bill, a new introduction, and a new vote. After 2008, this calendar could not find a sixth."
        ],
        "image": {
          "src": "/images/adhd-awareness-month-timeline.svg",
          "alt": "Timeline showing five separate Senate resolutions, sponsored by Maria Cantwell, designating a single September date as National Attention Deficit Disorder Awareness Day in 2004, 2005, 2006, 2007, and 2008, followed by no further resolution and today's coalition-run October observance"
        }
      },
      {
        "heading": "Why the Senate stopped, and what came after",
        "body": [
          "This calendar searched Congress's bill database for any later resolution using the same title, and for the shorter \"ADHD Awareness\" phrasing that later replaced \"Attention Deficit Disorder\" in common usage, and found nothing after Senate Resolution 649 in 2008: no sixth Senate resolution, no House companion measure, and no presidential proclamation naming an annual day or the October month at the federal level in any year since. No source consulted for this page states why the annual pattern stopped.",
          "What took its place was not further legislation but an advocacy coalition. ADDA, CHADD, and the ADHD Coaches Organization, the same groups behind the Senate resolutions, continued the campaign on their own authority, past the single September date Congress had last approved in 2008, into what is now a full month observed every October. The Centers for Disease Control and Prevention hosts its own ADHD Awareness partner toolkit each October, with shareable social media content and links to educational material; that is collaborative, informational support for the coalition's campaign, not an independent federal recognition, and it should not be read as a proclamation or statute, neither of which this calendar could find behind the October observance."
        ]
      },
      {
        "heading": "A secondary source that's partly right, for the wrong reason",
        "body": [
          "One account of this history, published on the blog ImpactADHD.com, describes the origin as declaring \"the 3rd Wednesday of September\" to be National ADHD Awareness Day. Checked against the actual dates the Senate designated, that description is a coincidence, not a rule. September 20, 2006 and September 19, 2007 genuinely were the third Wednesday of their respective months, so for those two years the blog's shorthand happens to land on the right date. But September 7, 2004 was a Tuesday, September 14, 2005 was the second Wednesday of that September, and September 18, 2008 was a Thursday. None of the five resolutions themselves state a weekday-based formula; each designates one specific date, decided fresh by the Senate that year.",
          "The gap between the primary text and the paraphrase is a useful reminder for a reader trying to plan around any of these observances: a summary that gets two years right out of five can still be describing something that never existed as a rule. What existed was five separate acts of Congress, not one recurring one."
        ]
      },
      {
        "heading": "Where this sits next to its fall neighbors",
        "body": [
          "This calendar has now checked the federal paper trail behind several October and November health observances, and ADHD Awareness Month's pattern is the most unusual of the group so far. [American Diabetes Month](/diabetes-awareness-month/) has an actual presidential proclamation on record, Reagan's Proclamation 4994 in 1982, renewed by name again in 1985. [National Epilepsy Awareness Month](/epilepsy-awareness-month/) has the opposite record: three separate congressional resolutions, in 2002, 2003, and 2011, were introduced and every one of them died in committee without a vote. [Domestic Violence Awareness Month](/domestic-violence-awareness-month/) sits between those two: Congress designated it by name for one specific year, 1989, in a joint resolution, and every President since has kept proclaiming the month on independent executive authority.",
          "ADHD Awareness Month fits none of those three patterns. Unlike Epilepsy Awareness Month, Congress did not fail, it succeeded, five years running, passing a fresh resolution every year from 2004 through 2008 without a single one dying in committee. Unlike Diabetes Month and Domestic Violence Awareness Month, that repeated success was never converted into a standing designation, a proclamation, or a rule that would keep applying without a new bill each year, and after 2008 no new bill came. Five straight years of real, unopposed Senate approval, followed by an abrupt and unexplained stop, with nothing federal since, is a pattern this calendar has not documented on another page yet."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is ADHD Awareness Month in 2026?",
        "answer": "All of October 2026, running Thursday, October 1 through Saturday, October 31. It is a month-long observance, not a single date, and does not shift for weekends."
      },
      {
        "question": "Did Congress officially designate ADHD Awareness Month?",
        "answer": "Not the month. The Senate designated a single September date as \"National Attention Deficit Disorder Awareness Day\" five years running, from 2004 (S.Res.370) through 2008 (S.Res.649), each one a fresh, one-year-only designation. No sixth resolution and no proclamation naming October or an annual day has been found since 2008; the current October month is run by an advocacy coalition, not by federal designation."
      },
      {
        "question": "Who started ADHD Awareness Month?",
        "answer": "The Attention Deficit Disorder Association (ADDA), working with Senator Maria Cantwell, sponsored the first Senate resolution in 2004 and three more through 2008. The ongoing October observance is organized by a coalition of ADDA, CHADD, and the ADHD Coaches Organization, without further federal action behind it since 2008."
      },
      {
        "question": "Is ADHD Awareness Month the same as ADHD Awareness Week?",
        "answer": "They describe the same underlying coalition campaign at different points in its growth. ADDA's own history page says the observance grew \"from one day each year in 2004 to a full month, the month of October,\" without giving a specific year for that change, and this calendar could not independently verify one, so no exact date for a week-to-month shift is claimed here."
      },
      {
        "question": "How common is ADHD, according to the CDC?",
        "answer": "The CDC's data page puts current ADHD diagnoses at roughly 7 million US children and adolescents ages 3 to 17, about 11.7 percent, from a national parent survey CDC ran in 2024. An earlier, CDC-cited 2022 survey had found 11.4 percent, about 7.1 million, ever diagnosed, with 10.5 percent, about 6.5 million, carrying a current diagnosis at that time."
      },
      {
        "question": "Did the Senate ever designate ADHD Awareness Day more than once?",
        "answer": "Yes, five times. Senator Maria Cantwell sponsored a fresh Senate resolution designating a single September date every year from 2004 through 2008: S.Res.370 (2004), S.Res.201 (2005), S.Res.544 (2006), S.Res.295 (2007), and S.Res.649 (2008). Each passed without opposition. No sixth resolution has been found in any year since."
      }
    ],
    "sources": [
      {
        "label": "S.Res.370 — 108th Congress, designating September 7, 2004, as \"National Attention Deficit Disorder Awareness Day\" (GovInfo.gov, official bill text)",
        "url": "https://www.govinfo.gov/content/pkg/BILLS-108sres370ats/html/BILLS-108sres370ats.htm"
      },
      {
        "label": "S.Res.201 — 109th Congress, designating September 14, 2005 (GovInfo.gov, official bill text)",
        "url": "https://www.govinfo.gov/content/pkg/BILLS-109sres201ats/html/BILLS-109sres201ats.htm"
      },
      {
        "label": "S.Res.544 — 109th Congress, designating September 20, 2006 (GovInfo.gov, official bill text)",
        "url": "https://www.govinfo.gov/content/pkg/BILLS-109sres544ats/html/BILLS-109sres544ats.htm"
      },
      {
        "label": "S.Res.295 — 110th Congress, designating September 19, 2007 (GovInfo.gov, official bill text)",
        "url": "https://www.govinfo.gov/content/pkg/BILLS-110sres295ats/html/BILLS-110sres295ats.htm"
      },
      {
        "label": "S.Res.649 — 110th Congress, designating September 18, 2008, the last resolution of its kind found on record (GovInfo.gov, official bill text)",
        "url": "https://www.govinfo.gov/content/pkg/BILLS-110sres649ats/html/BILLS-110sres649ats.htm"
      },
      {
        "label": "ADDA — Where Did ADHD Awareness Month Get Its Start? (add.org)",
        "url": "https://add.org/adhd-awareness-history/"
      },
      {
        "label": "Senate Resolution Declares September 7th AD/HD Awareness Day — ADDA press release, source of the David Giwerc quote above (ADD Coach Academy)",
        "url": "https://addca.com/adhd-coach-training/ADHD-Blog-Details/senate_resolution_declares_september_7th_ad_hd_awareness_day/"
      },
      {
        "label": "Data and Statistics on ADHD (CDC)",
        "url": "https://www.cdc.gov/adhd/data/index.html"
      },
      {
        "label": "A Brief History of ADHD (& ADHD Awareness Week) — ImpactADHD.com, source of the \"3rd Wednesday\" description discussed above",
        "url": "https://impactadhd.com/a-brief-history-of-adhd-awareness-week/"
      }
    ],
    "image": "/images/adhd-awareness-month-cantwell.jpg",
    "imageAlt": "Official 2007 portrait of Senator Maria Cantwell of Washington, who sponsored all five Senate resolutions designating a National Attention Deficit Disorder Awareness Day between 2004 and 2008",
    "imageCredit": "Office of U.S. Senator Maria Cantwell, public domain, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Maria_Cantwell,_official_portrait,_110th_Congress.jpg)"
  }
];
