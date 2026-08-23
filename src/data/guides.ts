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
        "url": "https://nationaldaycalendar.com/celebrations/national-boyfriend-day-october-3"
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
        "url": "https://nationaldaycalendar.com/celebrations/national-boyfriend-day-october-3"
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
        "url": "https://nationaldaycalendar.com/celebrations/national-boyfriend-day-october-3"
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
        {
          "date": "2026-10-16",
          "weekday": "Friday"
        },
        {
          "date": "2027-10-16",
          "weekday": "Saturday"
        },
        {
          "date": "2028-10-16",
          "weekday": "Monday"
        },
        {
          "date": "2029-10-16",
          "weekday": "Tuesday"
        },
        {
          "date": "2030-10-16",
          "weekday": "Wednesday"
        },
        {
          "date": "2031-10-16",
          "weekday": "Thursday"
        }
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
        "question": "When is National Boss's Day in 2027?",
        "answer": "Saturday, October 16, 2027. The date is fixed at October 16 every year and does not depend on the day of the week; in 2027 it happens to land on a Saturday. This page lists October 16 itself, since no primary source confirms the widely repeated weekend-shift convention; readers whose workplace follows that convention would mark the day on Friday, October 15 instead."
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
        {
          "date": "2026-10-29",
          "weekday": "Thursday"
        },
        {
          "date": "2027-10-29",
          "weekday": "Friday"
        },
        {
          "date": "2028-10-29",
          "weekday": "Sunday"
        },
        {
          "date": "2029-10-29",
          "weekday": "Monday"
        },
        {
          "date": "2030-10-29",
          "weekday": "Tuesday"
        },
        {
          "date": "2031-10-29",
          "weekday": "Wednesday"
        }
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
    "updated": "2026-08-17",
    "coreSummary": "National Dog Day is a US observance held every August 26, founded in 2004 by pet lifestyle expert Colleen Paige. The founder's own organization gives two different reasons for it: her personal account says the date marks a childhood shelter adoption, while a 2013 New York State Senate resolution reproduced on the same website says the day was created over the uncredited service of search-and-rescue dogs at Ground Zero. Neither telling mentions the other.",
    "dateRule": {
      "kind": "fixed",
      "text": "August 26 every year in the United States. The date does not shift for weekends or weekdays.",
      "source": {
        "label": "National Dog Day (official site) — About",
        "url": "https://www.nationaldogday.com/about1"
      },
      "occurrences": [
        {
          "date": "2026-08-26",
          "weekday": "Wednesday"
        },
        {
          "date": "2027-08-26",
          "weekday": "Thursday"
        },
        {
          "date": "2028-08-26",
          "weekday": "Saturday"
        },
        {
          "date": "2029-08-26",
          "weekday": "Sunday"
        },
        {
          "date": "2030-08-26",
          "weekday": "Monday"
        },
        {
          "date": "2031-08-26",
          "weekday": "Tuesday"
        }
      ],
      "caveat": "Every source found agrees on August 26, including the founder's own site, a 2013 New York State Senate resolution, and every third-party calendar page checked. One brief outlier existed: Wikipedia's own International Dog Day article listed August 26 in its infobox but, for a period including this page's original publication, stated in its history section that \"the date, August 14, was chosen to mark the day her family adopted their first dog,\" an internal contradiction inside a single article, not evidence that August 14 was used anywhere else. A Wikipedia editor corrected that line to read August 26 on August 8, 2026, so the two sections now agree. Readers should treat August 26 as settled. Separately, \"National Dog Day\" is not the only dog-themed observance on the calendar: National Rescue Dog Day falls on May 20, and World Dog Day, founded in 2016 by the Vanderpump Dog Foundation, is held on a date in May that moves from year to year rather than staying fixed."
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
          "The one inconsistency found sat inside a single Wikipedia article, and it has since been fixed. At the time this page was first published, Wikipedia's \"International Dog Day\" page used that date, August 26, in its infobox, but its history section stated that \"the date, August 14, was chosen to mark the day her family adopted their first dog.\" No other source anywhere repeated August 14; it read as a copy-editing slip inside one article rather than a second date in circulation. A Wikipedia editor corrected the line to read August 26 on August 8, 2026, four days after this page went up, and the infobox and history section have agreed ever since. It is included here only because catching exactly this kind of quiet inconsistency, rather than repeating whichever number a source happens to print first, is the point of this calendar."
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
        "answer": "Effectively yes. Both names refer to the same August 26 observance founded by Colleen Paige in 2004; Wikipedia's own article defines them as interchangeable. This differs from International Cat Day, which has a separate founding history through the International Fund for Animal Welfare."
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
    "description": "December's three official birthstones are turquoise, blue zircon, and tanzanite, not blue topaz, despite how often retailers market it as one.",
    "published": "2026-08-04",
    "updated": "2026-08-04",
    "coreSummary": "December's three official birthstones (turquoise, blue zircon, and tanzanite) were assembled by trade organizations across three separate revisions: turquoise carried over from ancient tradition when the modern US list was first adopted in 1912, zircon was added in 1952, and tanzanite was added in 2002. Blue topaz is heavily marketed by jewelry retailers as a fourth December birthstone, but Jewelers of America's own current list has never included it.",
    "sections": [
      {
        "heading": "December's three official birthstones",
        "body": [
          "Jewelers of America, the trade association that has maintained the US birthstone list since 1912, currently names exactly three official birthstones for December: turquoise, tanzanite, and blue zircon. That is the complete list on the organization's own gift guide page; no fourth stone appears on it.",
          "Search for \"december birthstone\" anywhere online, though, and blue topaz shows up constantly, often presented as if it carries the same official standing as the other three. It doesn't. Blue topaz's cool, wintry tone happens to match the palette of December's real birthstones, and large retailers, including Blue Nile, Kay, JCPenney, and Gabriel & Co., have built entire product lines marketing it as \"the December birthstone.\" None of that marketing changes what is actually on Jewelers of America's list. A page repeating that blue topaz is official is repeating retail copy, not the trade group's own record."
        ]
      },
      {
        "heading": "Turquoise: the one stone here with an actual ancient pedigree",
        "body": [
          "Turquoise is the only December birthstone that predates the whole idea of an official US list. Egyptian tombs dating to roughly 3000 BCE contain turquoise jewelry, and King Tutankhamun's burial mask is set with it; the oldest known turquoise mines sit in Egypt's Sinai Peninsula, near a temple dedicated to the goddess Hathor. Egyptians called the stone mefkat, meaning \"joy\" and \"delight.\"",
          "Ancient Persia treated the stone just as seriously. Persians called it pirouzeh, meaning \"victory,\" set it into palace decoration for its sky-blue color, and believed a turquoise would change color to warn its wearer of approaching danger. The English name arrived later and secondhand: \"turquoise\" comes from the French pierre tourques, \"Turkish stone,\" because Turkish merchants were the ones who carried it into Europe along 13th-century Silk Road trade routes; the stone itself was never mined in Turkey.",
          "A separate, unrelated turquoise tradition developed in the American Southwest, where Indigenous peoples mined the stone long before European contact and used it in ceremonial and protective objects. The now-familiar silver-and-turquoise jewelry style associated with Navajo artisans is more recent than the mining tradition itself: it dates to the 1880s, when a trader is credited with encouraging Navajo silversmiths to begin working turquoise into silver settings.",
          "Because turquoise was already established as a birthstone through centuries of separate folk traditions, it didn't need a 20th-century trade group to add it to any list; it was simply carried over when one got written down."
        ]
      },
      {
        "heading": "Zircon: added in 1952, and its blue color mostly comes from one province in Cambodia",
        "body": [
          "Zircon the mineral is genuinely ancient: geologists have dated microscopic zircon crystals from the Jack Hills region of Western Australia to as old as roughly 4.4 billion years, the oldest material yet identified as originating on Earth. That finding is about zircon's use in dating rock formations, though, not about the gem-grade crystals cut into December birthstone jewelry; those come from unrelated, far younger deposits, chiefly in Cambodia and historically Sri Lanka. Colorless zircon from Sri Lanka was once traded under the name \"Matara zircon,\" after the Sri Lankan town near where it was mined.",
          "Most of the blue zircon sold today owes its color to a single Cambodian province, Ratanakiri, near the borders with Laos and Vietnam. The rough stone comes out of the ground brown; heating it (the International Colored Gemstone Association describes the exact temperatures as a closely held trade secret) turns it blue. The ICA calls Ratanakiri \"the world's only deposit of material used to create such rich blue zircon,\" which makes December's blue zircon considerably more geographically concentrated than either of the month's other two stones.",
          "Zircon's high refractive index gives it real brilliance and fire, historically close enough to diamond's that it was used as a cheaper substitute, a reputation that later got tangled up with cubic zirconia, a lab-made material with a similar name but no mineral relationship to zircon at all. Zircon joined the official December list in 1952, in the same trade-group revision that added alexandrite to June, citrine to November, and pink tourmaline to October. Sources disagree on exactly which body carried out that 1952 revision: some accounts attribute it directly to Jewelers of America's own predecessor association, while others name a separate group, the Jewelry Industry Council of America. This piece did not find a primary document that settles which is correct."
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
          "Nearly six decades later, the Merelani Hills remain the only known commercial source of tanzanite anywhere in the world; no other deposit has been found. The American Gem Trade Association added tanzanite to the official December birthstone list in 2002, fifty years after the previous revision, making it an additional option alongside turquoise and zircon rather than a replacement for either."
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
          "The US birthstone list traces back to a single meeting: in 1912, the American National Retail Jewelers Association (the organization now known as Jewelers of America) met in Kansas City and adopted a standardized list, aiming to settle the many competing folk birthstone traditions that had accumulated across centuries into one list retailers could use consistently. Turquoise entered December's slot at that point, carried over from its older traditions rather than newly assigned.",
          "The list has been revised only a handful of times since. In 1952, a trade-industry update added zircon to December along with new stones for three other months. In 2002, the American Gem Trade Association added tanzanite to December, the list's first change to any month in fifty years. Most recently, in 2016, the American Gem Trade Association and Jewelers of America jointly added spinel to August, showing that the same small set of trade groups is still actively willing to revise the list rather than treating it as fixed.",
          "Blue topaz has never gone through that process. It shows up in retailer catalogs because it happens to look the part, not because any trade group ever voted it onto the list. That's a different kind of gap from the disputed founding stories behind observance days on this calendar: [National Dog Day](/national-dog-day/)'s origin comes down to one person's word against her own organization's paperwork, while December's birthstone list, by contrast, has a dated, attributable paper trail for almost every change made to it. The one piece that's murky is who exactly carried out the 1952 revision; everything else about who added what, and when, is on the record."
        ]
      },
      {
        "heading": "Choosing among three real options",
        "body": [
          "For anyone shopping by birth month rather than by observance (the same instinct that drives gift-giving around a manufactured single day like [National Boyfriend Day](/national-boyfriend-day/)), December actually offers three legitimately different official stones, not one default choice. Turquoise is the most widely available and least expensive of the three, and the only one with a documented history stretching back thousands of years. Zircon offers a diamond-rivaling brilliance at a fraction of the cost, though nearly all of the blue supply traces back to that single Cambodian province. Tanzanite is the rarest and priciest of the three, and the only one where the entire world's known supply comes from one hillside in Tanzania. Checking which of the three a piece of jewelry actually is, rather than assuming \"blue stone in December\" automatically means birthstone-correct, is worth doing before a birthday purchase, the same way it's worth checking whether an occasion like [National Grandparents Day](/national-grandparents-day/) has a real founding story behind it or just a marketing one."
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
        "answer": "In 2002, when the American Gem Trade Association added it to the official list as an additional December stone alongside turquoise and zircon, the list's first change to any month in fifty years."
      },
      {
        "question": "Why does December have three birthstones instead of one?",
        "answer": "Because the 1912 list actually paired turquoise with lapis lazuli for December, not turquoise alone. The 1952 revision replaced lapis lazuli with zircon rather than simply adding a fourth stone, and only the 2002 revision, which added tanzanite, left the existing stones untouched. Several other months picked up extra stones through similar revisions, most recently August, which gained spinel alongside peridot in 2016."
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
          "The gap between the two systems traces back to a single astronomical phenomenon: precession, the slow 25,800-year wobble of Earth's rotational axis, first described mathematically by the Greek astronomer Hipparchus around 127 BCE. Tropical astrology anchors itself to the seasons and ignores precession by design, resetting to 0 degrees Aries at the equinox every year regardless of which stars sit behind the Sun. Sidereal astrology does the opposite, tracking the actual background stars, and India's most widely used reference point for that calculation, the Lahiri ayanamsha, currently puts the two systems about 24 degrees apart, a gap that grows by roughly one degree every 72 years. That 24-degree offset is most of the width of a zodiac sign, which is why sidereal Virgo lands nearly a full month after tropical Virgo instead of a few days off."
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
    "description": "Sapphire is September's only official birthstone, one of the few never revised since 1912, though the UK trade list still adds a second stone, lapis lazuli.",
    "published": "2026-08-05",
    "updated": "2026-08-22",
    "coreSummary": "September has exactly one official birthstone, sapphire, and it is one of the few entries on the Jewelers of America list that has never been revised since the list was first adopted in 1912. The three trade-group updates since then (1952, 2002, 2016) each touched a different month. The stone itself is broader than its reputation: any color of corundum except red counts as sapphire, and the UK's own 2013 trade list still differs from the US one by naming a second official stone, lapis lazuli.",
    "sections": [
      {
        "heading": "September's one official birthstone",
        "body": [
          "Jewelers of America's current birthstone chart lists exactly one stone for September: sapphire. There's no equivalent here to the argument this calendar had to untangle for [December](/december-birthstone/) (three stones, plus a widely marketed fourth that isn't official) or [March](/march-birthstone/) (two stones with a disputed primary/alternate order). September is one of the rare months where the trade association's own list and popular usage actually agree on how many stones belong.",
          "Where September does have a gap is color, not count. Sapphire is best known as a deep blue stone, but the term covers any color of the mineral corundum except red; red corundum is classified as ruby, its own separate birthstone for July. According to the American Gem Society, sapphires occur in white, pink, orange, yellow, green, violet, purple, brown, and black, and a pinkish-orange variety called padparadscha, named for a Sinhala word for lotus flower, can sell for more than a blue stone of similar size and clarity. A page or a retailer that treats \"the September birthstone\" as meaning specifically blue sapphire is narrower than the actual definition."
        ]
      },
      {
        "heading": "Revised three times since 1912, never for September",
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
          "Jewelers of America's list isn't the only current, active trade-group standard. Britain's own jewelry trade group, the National Association of Goldsmiths, published its own birthstone list in 1937 and revised its chart in 2013, giving September a second official stone: lapis lazuli, alongside sapphire. That revision predates the organization's 2015 merger with the British Jewellers' Association into the National Association of Jewellers, so the 2013 change belongs to the original association, not the merged one that exists today. The US list does not currently include lapis lazuli for September; in the American tradition that stone belongs to December instead. A shopper checking the UK trade list and a shopper checking the US one currently get different, both-correct answers to \"how many official September birthstones are there.\""
        ]
      },
      {
        "heading": "Sapphire the mineral: hard, old, and mostly mined out of one famous source",
        "body": [
          "Sapphire is a variety of corundum, ranking 9 on the Mohs hardness scale, second only to diamond among natural minerals, with excellent toughness and no cleavage, meaning it resists chipping under normal wear. That combination is why it holds up in rings and other jewelry worn daily, per the Gemological Institute of America, though buyers are advised to ask whether a given stone has been heat-treated (common and well accepted in the trade) or treated by less common methods like lattice diffusion or fracture filling, which call for gentler cleaning.",
          "The most famous source is one that stopped producing decades ago. In 1881, a landslide in the Zanskar range of Kashmir exposed a pocket of velvety cornflower-blue crystals; miners worked the site, later known as the Old Mine, from 1882 to 1887, before the original deposit was worked out. Production from the region has been sporadic ever since, but \"Kashmir blue\" remains the benchmark other sapphires are compared against at auction. Myanmar's Mogok region and Sri Lanka, which has supplied sapphire for more than two millennia, are the other two historically dominant sources; Sri Lanka's milky white \"geuda\" stones can be heat-treated to a rich blue. Thailand's Chanthaburi province isn't a major source itself but is a major cutting and treatment hub for stones mined elsewhere.",
          "Two sapphires illustrate how far the stone's reputation has traveled: the 62.02-carat Rockefeller Sapphire, mined in Myanmar and acquired in 1934 by John D. Rockefeller Jr. from an Indian maharaja, later recut by Cartier in the 1940s and remounted more than once since; and the 12-carat blue sapphire in the engagement ring first worn by Princess Diana and later given by her son to Kate Middleton. Sapphire is also the gem associated with the 5th and 45th wedding anniversaries."
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
        "answer": "Sapphire, the only stone on Jewelers of America's current birthstone list for September, unchanged since the list was first adopted in 1912."
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
    "coreSummary": "Western tropical astrology, the system behind virtually every horoscope column and app, places Scorpio from October 23 to November 21, the range given by AstroStyle, Farmers' Almanac, and Wikipedia's own general description. Britannica is an outlier at the start, dating it to October 24, and Almanac.com is an outlier at the end, running the sign through November 22. Vedic sidereal astrology, anchored to a different reference point, runs Scorpio roughly a month later, from about November 16 to December 15. The actual astronomical constellation the sign is named for holds the Sun for barely a week, the shortest stretch of any zodiac constellation, before the Sun crosses into Ophiuchus, a thirteenth constellation the tropical system has never counted as a sign. None of the four dates is wrong; each is answering a different question.",
    "sections": [
      {
        "heading": "The range almost every horoscope site quotes, and the two that don't",
        "body": [
          "Ask an astrology publisher for Scorpio's start date and the answer is nearly unanimous: October 23. AstroStyle, Farmers' Almanac, Almanac.com, and the English Wikipedia entry for Scorpio (astrology) all agree on that. The end date is where they split. AstroStyle and Farmers' Almanac both stop at November 21, and so does Wikipedia's own prose description. Almanac.com runs a day longer, to November 22, in both its summary table and its body text. None of these sources cites another as its authority; they're independently running the same tropical-zodiac calculation and still landing a day apart at the finish.",
          "Britannica breaks the pattern. Its own Scorpius entry describes the sign as \"considered as governing the period from about October 24 to about November 21,\" a full day later at the start than every other major reference checked for this page. That's not a typo repeated across mirror sites; it's Britannica's stated position, sitting a day apart from the consensus for reasons the entry itself doesn't explain. [Virgo's date range](/virgo-dates/) has the same kind of single-day fuzziness at its boundary, but there every source agrees on which day is the fuzzy one (August 22 or 23, depending on the year). Here, two different calendar dates are being presented flatly as the answer by different authorities, with no year-dependent hedge offered by either."
        ]
      },
      {
        "heading": "Why the boundary moves at all",
        "body": [
          "The tropical zodiac splits the solar year into twelve equal 30-degree arcs starting from the spring equinox, and Scorpio is the eighth of them, running from 210 to 240 degrees of tropical longitude. The calendar date attached to \"210 degrees\" isn't fixed once and for all, because the equinox that anchors the whole system doesn't land at the same clock time every year. Earth's orbit takes about 365.2422 days, not a clean 365, so the equinox arrives roughly six hours later each year until a leap day resets the count. That six-hour drift propagates to every 30-degree boundary downstream of it, Scorpio's October crossing included, which is enough to nudge the exact moment onto a different calendar date in some years than in others.",
          "That explains a one-day wobble year to year within a single reference's own methodology. It does not explain why Britannica's stated range and the AstroStyle/Farmers' Almanac/Wikipedia range disagree by a full day as a matter of general description, not year-specific drift, and the same is true at the other end of the range, where Almanac.com gives November 22 instead of November 21 in both its summary table and its body text. Both gaps look like differences in rounding convention or source vintage between references, not the astronomical wobble itself. None of the sources documents which it is."
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
        "answer": "In Western tropical astrology, the system behind most horoscope columns and apps, Scorpio runs from October 23 to November 21. That's the range given by AstroStyle, Farmers' Almanac, and Wikipedia's own description. Almanac.com agrees on the October 23 start but runs the sign a day longer, through November 22."
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
        {
          "date": "2026-10-23",
          "weekday": "Friday"
        },
        {
          "date": "2027-10-23",
          "weekday": "Saturday"
        },
        {
          "date": "2028-10-23",
          "weekday": "Monday"
        },
        {
          "date": "2029-10-23",
          "weekday": "Tuesday"
        },
        {
          "date": "2030-10-23",
          "weekday": "Wednesday"
        },
        {
          "date": "2031-10-23",
          "weekday": "Thursday"
        }
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
        {
          "date": "2026-10-01",
          "weekday": "Thursday"
        },
        {
          "date": "2027-10-01",
          "weekday": "Friday"
        },
        {
          "date": "2028-10-01",
          "weekday": "Sunday"
        },
        {
          "date": "2029-10-01",
          "weekday": "Monday"
        },
        {
          "date": "2030-10-01",
          "weekday": "Tuesday"
        },
        {
          "date": "2031-10-01",
          "weekday": "Wednesday"
        }
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
        {
          "date": "2026-09-15",
          "weekday": "Tuesday"
        },
        {
          "date": "2027-09-15",
          "weekday": "Wednesday"
        },
        {
          "date": "2028-09-15",
          "weekday": "Friday"
        },
        {
          "date": "2029-09-15",
          "weekday": "Saturday"
        },
        {
          "date": "2030-09-15",
          "weekday": "Sunday"
        },
        {
          "date": "2031-09-15",
          "weekday": "Monday"
        }
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
        {
          "date": "2026-10-01",
          "weekday": "Thursday"
        },
        {
          "date": "2027-10-01",
          "weekday": "Friday"
        },
        {
          "date": "2028-10-01",
          "weekday": "Sunday"
        },
        {
          "date": "2029-10-01",
          "weekday": "Monday"
        },
        {
          "date": "2030-10-01",
          "weekday": "Tuesday"
        },
        {
          "date": "2031-10-01",
          "weekday": "Wednesday"
        }
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
        {
          "date": "2026-11-19",
          "weekday": "Thursday"
        },
        {
          "date": "2027-11-19",
          "weekday": "Friday"
        },
        {
          "date": "2028-11-19",
          "weekday": "Sunday"
        },
        {
          "date": "2029-11-19",
          "weekday": "Monday"
        },
        {
          "date": "2030-11-19",
          "weekday": "Tuesday"
        },
        {
          "date": "2031-11-19",
          "weekday": "Wednesday"
        }
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
    "slug": "may-birth-flower",
    "category": "Birth Flowers",
    "title": "May Birth Flower: Lily of the Valley, and an Unconfirmed Legend",
    "description": "May's birth flowers are lily of the valley and hawthorn, but the legend behind the French custom and an old hawthorn proverb are both shakier than they look.",
    "published": "2026-08-21",
    "updated": "2026-08-21",
    "coreSummary": "May's birth flowers are lily of the valley and hawthorn, and unlike March, both The Old Farmer's Almanac and Farmers' Almanac agree on the pairing. The agreement stops there. Lily of the valley's scientific name traces to a Latin Vulgate Bible phrase, not to a description of the plant itself, and the plant has moved through four different plant families, starting in the lily family and landing most recently in Asparagaceae. The French custom of giving it away every May 1 is usually credited to King Charles IX in 1561, a story French Wikipedia itself labels a legend and reports only in the conditional tense; documented practice dates to the early 20th century instead. Hawthorn, meanwhile, carries a species count that has swung from 1,000-plus down to roughly 200, a folk name of \"May\" that predates Britain's 1752 calendar reform, and a floral scent built on the same chemical compound released by decaying flesh.",
    "sections": [
      {
        "heading": "For once, the two almanacs agree. That's where the agreement ends.",
        "body": [
          "The Old Farmer's Almanac names lily of the valley and hawthorn as May's pair. So does Farmers' Almanac, the separate company this site's [March birth flower](/march-birth-flower/) page found splitting from the Old Farmer's Almanac's chart that same month, adding jonquil and cherry blossom where the Almanac listed daffodil alone. May doesn't get that treatment. Both publications settle on the same two plants, no third option, no disputed alternate.",
          "What the agreement hides is that neither plant's name, origin story, or classification is anywhere near as settled as a two-flower chart implies. Lily of the valley has been shuffled between four different plant families since the modern naming system began, and the tradition most often cited for why it's associated with a specific date in May turns out to rest on a story French sources themselves frame as unconfirmed. Hawthorn has a folk name that's centuries older than the modern calendar it now gets compared against, and a species count nobody has ever pinned down twice the same way."
        ]
      },
      {
        "heading": "The French gift-giving custom is usually dated to 1561. The documented version starts well over three centuries later.",
        "body": [
          "Search for why lily of the valley gets given away in France on May 1 and the answer nearly every site repeats is the same: in 1561, King Charles IX received a sprig as a good-luck charm, liked it enough to start handing bouquets to the women of his court, and the custom took root from there. Farmers' Almanac's own flower-lore page tells the story the same way, as settled history.",
          "French Wikipedia's own article on May 1 tells it differently. Its \"Traditions et superstitions\" section introduces the Charles IX story with \"selon une légende,\" according to a legend, and describes his actions throughout in the conditional tense, \"aurait initié,\" \"aurait décidé,\" would have initiated, would have decided, the grammatical marker French uses for a claim it isn't prepared to state as fact. The same entry places the custom's actual merger with the modern May 1 holiday at the start of the 20th century, not the 16th, more than three hundred years after the king Charles IX allegedly instructed. English Wikipedia's own article on lily of the valley lands on a similar timeline without mentioning Charles IX at all: it dates the tax-exempt street sale of the flower, the version of the custom still practiced today, to \"the beginning of the 20th century.\" A more specific, independently sourced date backs that window up: French lifestyle outlet The Good Life France dates the custom's modern revival to a single documented event, Paris fashion houses handing lily of the valley to female clients and employees on May 1, 1900, a full 339 years after the king it's usually credited to."
        ],
        "image": {
          "src": "/images/may-birth-flower-lily.jpg",
          "alt": "Convallaria majalis (lily of the valley) in bloom in Frankenfels, Austria, showing the bell-shaped white flowers behind France's May 1 gift-giving custom, a tradition documented from the early 20th century though popularly credited to a 1561 royal legend",
          "credit": "Photo by GT1976, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2018-05-13_(168)_Convallaria_majalis_(lily-of-the-valley)_at_Bichlh%C3%A4usl_in_Frankenfels,_Austria.jpg), CC BY-SA 4.0"
        }
      },
      {
        "heading": "A 1941 law, and a flower chosen partly for what it wasn't",
        "body": [
          "One further layer sits between the legend and the present day. France's own historical record shows the government of Philippe Pétain, the collaborationist Vichy regime installed after the country's 1940 defeat, passed a law on April 24, 1941 making May 1 a paid public holiday under the name \"Fête du Travail et de la Concorde sociale,\" Labor and Social Harmony Day. Multiple French historical accounts, including coverage from public broadcaster France Info and an academic chapter published by Cairn.info, describe the regime as favoring lily of the valley specifically because it carried no association with the political left, unlike the red eglantine, a wild rose that French socialist and labor movements had used as their own May 1 emblem since the late 19th century. The flower most people now think of as a simple spring gift was, for at least one stretch of the 20th century, also a substitution made for a reason that had nothing to do with spring."
        ]
      },
      {
        "heading": "The scientific name comes from a translation, not a description",
        "body": [
          "Lily of the valley's genus name, Convallaria, is a Neo-Latin word coined by Carl Linnaeus himself, not inherited from classical usage. Per Wikipedia's entry on the plant, it derives from lilium convallium, \"lily of the valleys,\" the Latin Vulgate Bible's rendering of a phrase in Song of Songs 2:1. European herbalists only began applying that biblical phrase to this specific plant sometime in the 15th or 16th century, meaning the name describes a translator's word choice from a much older religious text, not a botanist's observation of the plant itself.",
          "The plant's family placement has moved three times since leaving the lily family. Wikipedia's taxonomy section traces it from the historical lily family, Liliaceae, into its own short-lived family, Convallariaceae, then into Ruscaceae, and finally into its current position: a subfamily, Convallarioideae, inside Asparagaceae, the same family as the vegetable. Three regional forms once treated as varieties of one species, from Europe, from China and Japan, and from the southern Appalachian Mountains, have also since been split into three separate species in their own right. And despite the sweetness the flower's name and folklore both promise, the entire plant is toxic: Wikipedia's chemistry section counts roughly 38 different cardiac glycosides in its tissue, compounds that interfere with heart-muscle function and can cause irregular heartbeat if ingested."
        ]
      },
      {
        "heading": "Hawthorn's genus is even harder to pin down than the daffodil's",
        "body": [
          "Hawthorn's taxonomic history runs a version of the same problem this site found earlier in [Narcissus, March's own genus](/march-birth-flower/), though the actual figures involved are different. Wikipedia's entry on the genus, Crataegus, notes that some botanists in the past recognized 1,000 or more species, many of them apomictic microspecies, plants that reproduce asexually and so tend to fragment into countless nearly identical local populations that taxonomists have disagreed for over a century about whether to count separately. Wikipedia calls 200 species \"a reasonable number\" as a middle estimate; Plants of the World Online, the reference this page checked directly, currently accepts 264. No two sources checked for this page landed on the same figure.",
          "This site's June birth flower page found honeysuckle carrying a scientific name and an English name built from two disconnected sources; hawthorn repeats the pattern, but the two descriptions it carries point at different physical parts of the plant. Crataegus, per Wikipedia's etymology note, comes from Greek kratos, \"strength,\" for the wood, plus akis, \"sharp,\" for the thorns, a name built around what the plant is made of. \"Hawthorn\" describes something else entirely: Etymonline traces it to Old English hagaþorn, from haw, an obsolete word for a hedge or enclosing fence, plus thorn, a name built around what the plant was grown to do. A reader who only knows the scientific name has learned nothing about how the shrub was actually used in the landscape it grew up in, and vice versa."
        ],
        "image": {
          "src": "/images/may-birth-flower-hawthorn.jpg",
          "alt": "Crataegus monogyna (common hawthorn) in flower in Karlsruhe, Germany. The genus name comes from Greek words for \"strength\" and \"sharp,\" describing the wood and thorns, while the English name \"hawthorn\" separately comes from an Old English word for hedge",
          "credit": "Photo by H. Zell, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Crataegus_monogyna_003.JPG), CC BY-SA 3.0"
        }
      },
      {
        "heading": "\"Ne'er cast a clout till May be out\" might not mean the month at all",
        "body": [
          "Hawthorn carries an older English folk name that overlaps, confusingly, with the calendar. Wikipedia's own opening line for the genus lists \"May-tree\" and \"Mayflower\" among the common names hawthorn goes by, alongside quickthorn, whitethorn, and hawberry. That overlap sits underneath a proverb still repeated in Britain today, \"ne'er cast a clout till May be out,\" don't shed a layer of winter clothing until May is finished, usually taken to mean the calendar month.",
          "Multiple British folklore sources tracing the saying's history read \"May\" in the proverb as referring to the hawthorn's bloom rather than the month, and tie that reading to a specific calendar event: Britain's 1752 switch from the Julian to the Gregorian calendar, which advanced every date by eleven days. Before that reform, what had been May 1 under the old calendar fell on what is now May 12, closer to when hawthorn actually flowers across much of Britain. Read that way, the proverb isn't instructing anyone to wait for a date on a calendar page; it's instructing them to wait for a shrub to bloom, under a calendar that shifted out from underneath the saying more than 270 years ago."
        ]
      },
      {
        "heading": "The superstition about bringing it indoors has a real chemical behind it",
        "body": [
          "British and Irish folklore has long held that bringing hawthorn blossom into a house invites illness or death on the household, an exception carved out only for May Day itself, when gathering it to decorate doorways was traditionally welcomed rather than feared. That superstition isn't pure invention. Hawthorn's flowers release trimethylamine, a compound also produced during the early stages of animal tissue decomposition and present in the same family of chemicals responsible for the smell of rotting flesh; medieval accounts reportedly likened the blossom's odor to the smell that hung over London during the Great Plague. The flower most florists sell as a simple symbol of hope carries a scent built on the same molecule the human nose has evolved to read as a warning."
        ]
      },
      {
        "heading": "May's other chart is the plain one",
        "body": [
          "This site's own [birthstones by month](/birthstones-by-month/) page checked Jewelers of America's current buying guide directly and found May listed with a single official stone, emerald, no second gem and no disagreement with the Gemological Institute of America or the American Gem Society, unlike March, where those three organizations don't fully agree, or June, which carries three stones instead of one. Measured only by how many entries sit on a chart, May is one of the calendar's plainer months. Measured by what sits underneath either of its charts, gemstone or flower, that's the only thing about the month that's actually plain."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is May's birth flower?",
        "answer": "Lily of the valley and hawthorn, per both The Old Farmer's Almanac and the separate publication Farmers' Almanac. Unlike some months, the two almanacs agree on this pairing without adding alternate flowers."
      },
      {
        "question": "Did a French king really start the tradition of giving lily of the valley on May 1?",
        "answer": "That's the popular story, usually dated to 1561 and King Charles IX, but French Wikipedia's own article on May 1 frames it explicitly as a legend, using the conditional tense throughout. The documented custom, the tax-exempt street sale of lily of the valley, is dated by English Wikipedia to the early 20th century instead, and French lifestyle outlet The Good Life France ties its modern revival to a specific 1900 event, Paris fashion houses giving the flower to clients and staff, 339 years after the king is said to have started it."
      },
      {
        "question": "Is lily of the valley actually a lily?",
        "answer": "Not by current classification. It was historically placed in the lily family, Liliaceae, then moved into its own family, Convallariaceae, then into Ruscaceae, and now sits in Asparagaceae, the same family as the vegetable, in a subfamily called Convallarioideae."
      },
      {
        "question": "Is lily of the valley poisonous?",
        "answer": "Yes. The entire plant contains roughly 38 different cardiac glycosides, compounds that can interfere with heart function and cause irregular heartbeat, vomiting, and abdominal pain if ingested, per Wikipedia's chemistry section on the plant."
      },
      {
        "question": "How many species of hawthorn are there?",
        "answer": "Nobody has agreed on one number. Historical counts ran past 1,000, largely due to how the genus's many nearly identical, asexually reproducing microspecies get classified. Wikipedia calls 200 species a reasonable modern estimate, while Plants of the World Online currently accepts 264."
      },
      {
        "question": "What does \"ne'er cast a clout till May be out\" actually mean?",
        "answer": "Likely a reference to hawthorn's bloom rather than the calendar month; hawthorn's own folk name is \"May.\" Britain's 1752 calendar reform moved every date forward by eleven days, so the old May 1, closer to when hawthorn actually flowers, now falls around May 12."
      }
    ],
    "sources": [
      {
        "label": "The Old Farmer's Almanac — May Birth Flowers: Lily of the Valley and Hawthorn",
        "url": "https://www.almanac.com/content/may-birth-flowers"
      },
      {
        "label": "Farmers' Almanac — The May Birth Flower: Lily of the Valley Lore",
        "url": "https://www.farmersalmanac.com/may-flower-lore"
      },
      {
        "label": "Wikipedia — Lily of the valley",
        "url": "https://en.wikipedia.org/wiki/Lily_of_the_valley"
      },
      {
        "label": "French Wikipedia — 1er mai (Traditions et superstitions)",
        "url": "https://fr.wikipedia.org/wiki/1er_mai"
      },
      {
        "label": "The Good Life France — May Day in France: a floral affair",
        "url": "https://thegoodlifefrance.com/may-day-france-floral-affair/"
      },
      {
        "label": "France Info — Social: le 1er mai, fête du muguet et de la lutte des travailleurs",
        "url": "https://la1ere.franceinfo.fr/reunion/social-le-1er-mai-fete-du-muguet-et-de-la-lutte-des-travailleurs-1484516.html"
      },
      {
        "label": "Cairn.info — Pétain et le 1er mai, 1941",
        "url": "https://shs.cairn.info/tremplin-sciences-po-histoire--9782100883950-page-131?lang=fr&tab=texte-integral"
      },
      {
        "label": "Wikipedia — Crataegus",
        "url": "https://en.wikipedia.org/wiki/Crataegus"
      },
      {
        "label": "Etymonline — Hawthorn",
        "url": "https://www.etymonline.com/word/hawthorn"
      },
      {
        "label": "Phrases.org.uk — Ne'er cast a clout till May be out",
        "url": "https://www.phrases.org.uk/bulletin_board/54/messages/478.html"
      },
      {
        "label": "Sussex Wildlife Trust — The flowering tree that smells like a decomposing corpse",
        "url": "https://sussexwildlifetrust.org.uk/news/the-flowering-tree-that-smells-like-a-decomposing-corpse"
      }
    ],
    "image": "/images/may-birth-flower-lily.jpg",
    "imageAlt": "Convallaria majalis (lily of the valley) in bloom, the primary May birth flower whose French May Day gift-giving custom is popularly credited to a 1561 royal legend that French Wikipedia itself labels unconfirmed",
    "imageCredit": "Photo by GT1976, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2018-05-13_(168)_Convallaria_majalis_(lily-of-the-valley)_at_Bichlh%C3%A4usl_in_Frankenfels,_Austria.jpg), CC BY-SA 4.0"
  },
  {
    "slug": "june-birth-flower",
    "category": "Birth Flowers",
    "title": "June Birth Flower: Rose and Honeysuckle, and Rose's Missing Parent",
    "description": "June's birth flowers are rose and honeysuckle, but the cut rose sold at florists traces to one 1867 hybrid whose own parentage is still disputed.",
    "published": "2026-08-21",
    "updated": "2026-08-21",
    "coreSummary": "June's birth flowers are rose and honeysuckle. The tall, single-stem rose sold at florists isn't the ancient flower most birth-flower pages imply; it traces to 'La France,' a pink hybrid tea rose bred in Lyon, France in 1867 by Jean-Baptiste André Guillot, whose own parentage is still disputed among rosarians. Honeysuckle carries two unrelated names: its scientific name, Lonicera, honors 16th-century German botanist Adam Lonicer, while the English word traces to Old English for 'honey-suck' and originally referred to clover, not the vine, before shifting meaning around 1400. The honeysuckle photographed on many birth-flower pages is often Lonicera japonica, an East Asian species now classified as a noxious weed in 46 US states.",
    "sections": [
      {
        "heading": "Rose and honeysuckle, and a gap already found on this site",
        "body": [
          "The Old Farmer's Almanac names rose and honeysuckle as June's pair, the trade source most modern birth-flower lists draw from. This site's [August birth flower](/august-birth-flower/) page traced why most months carry two flowers rather than one back to a single missing event: unlike birthstones, which trace to a documented 1912 US trade convention, no equivalent meeting ever forced birth flowers onto one agreed list. That absence explains why June has two names on its chart. It doesn't explain what's underneath either name, and for June specifically, both plants turn out to hide more contested and more recent history than the \"ancient symbol of love\" framing most birth-flower pages settle for."
        ]
      },
      {
        "heading": "The rose sold at florists isn't ancient. It's an 1867 hybrid with a disputed family tree.",
        "body": [
          "Wikipedia's entry on the rose counts genus Rosa at over three hundred wild species and tens of thousands of cultivars, most native to Asia, with smaller numbers in Europe, North America, and northwest Africa. Roses of some kind have carried symbolic weight for millennia. What most birth-flower photo galleries actually picture, though, the tall, high-centered rose sold one stem at a time in flower shops, traces to a single and comparatively recent cross.",
          "In 1867, in Lyon, France, nurseryman and rose breeder Jean-Baptiste André Guillot introduced a pink cultivar he named 'La France.' Per Wikipedia's entry on the cultivar, it's \"generally accepted to be the first hybrid tea rose,\" a class not formally recognized until the 1880s, and its introduction \"is therefore also considered the birth of the modern rose,\" the point where roses split away from older garden classes into the repeat-blooming, long-stemmed type that still dominates the cut-flower trade.",
          "Even Guillot's own rose keeps a gap in its record. Wikipedia notes that 'La France' \"was not systematically bred,\" so its hybrid parentage \"can only be speculated.\" The one candidate parent Wikipedia names, citing rosarian Peter Beales, is the tea rose 'Madame Falcot,' and even that comes with a question mark attached in the plant's own record: 'La France' may simply be an open-pollinated seedling of that one rose, not the deliberate cross between two named parents that most modern hybrid teas are. The single rose most responsible for the shape of the modern cut-flower industry doesn't have settled parentage, or even settled agreement on whether it had one parent or two."
        ],
        "image": {
          "src": "/images/june-birth-flower-rose.jpg",
          "alt": "Rosa 'La France', the pink 1867 hybrid tea rose bred by Jean-Baptiste André Guillot in Lyon, France, generally credited as the first hybrid tea rose and the ancestor type behind most cut roses sold today",
          "credit": "Photo by Arashiyama, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Rosa_%27La_France%27.jpg), CC BY-SA 3.0"
        }
      },
      {
        "heading": "Even the word \"rose\" might not have started out Greek",
        "body": [
          "Etymonline traces English \"rose\" back through Latin rosa to Greek rhodon, the standard textbook path. Wiktionary's entry on rhodon adds a layer most flower pages skip: rhodon itself is thought to be a loanword into Greek rather than a native Greek coinage, most likely from Proto-Iranian wardah, \"flower, rose,\" the same root behind Old Persian, Old Armenian vard, and modern Persian gol, the source of Turkish gül, \"rose.\"",
          "That path isn't settled, either. Wiktionary notes that linguist Rüdiger Schmitt considers a borrowing from Iranian into Greek unlikely on phonological and historical grounds, and flags an alternative: rhodon could instead be a Pre-Greek loan from a language such as Thracian, since the rose was native to Thrace. More than two thousand years after the word entered Greek, etymologists still don't agree on which ancient language handed it over."
        ]
      },
      {
        "heading": "Honeysuckle carries two unrelated names, and the vine in many photos is the invasive one",
        "body": [
          "Honeysuckle's scientific name and its English common name come from two entirely separate sources, a split most birth-flower copy glosses over by treating \"Lonicera\" as though it simply meant honeysuckle in Latin. It doesn't. Wikipedia's entry on the genus explains that \"the name Lonicera stems from Adam Lonicer, a Renaissance botanist,\" specifically Adam Lonicer (1528-1586), a German physician whose 1557 herbal, the Kräuterbuch, Wikipedia's biographical entry on him credits as his major work. Carl Linnaeus attached Lonicer's name to the genus more than a century and a half after Lonicer's death.",
          "The English name has nothing to do with Lonicer. Etymonline dates \"honeysuckle\" to around 1300, and the earliest recorded sense isn't even the vine: the word first meant clover, specifically red clover, with the climbing-vine sense not attested until roughly a century later, around 1400. Both senses trace to Old English hunigsuge, literally \"honey-suck,\" a description of the practice of drawing nectar directly from a flower. Two names, from two unrelated sources, that happened to land on the same genus of roughly 158 species (Wikipedia's count) native across North America, Eurasia, and North Africa.",
          "The species question matters more than most galleries let on. Among those 158 species, Wikipedia singles out Lonicera japonica, Japanese honeysuckle, as \"an aggressive generalist species\" and one of the most widely planted ornamental honeysuckles worldwide. Introduced to the US from Japan in the early 1800s, it's now classified as a noxious weed in 46 states; it's prohibited for sale in Connecticut, Illinois, Massachusetts, and Vermont, and banned outright in Indiana and New Hampshire, per Wikipedia's entry on the species. Its older stems are often hollow inside, per the same entry. A native alternative, Lonicera sempervirens, trumpet or coral honeysuckle, native to the eastern US, is among the species Wikipedia's genus entry lists as a particular draw for North American hummingbirds. Most stock photography attached to \"June birth flower\" pages doesn't name which species is pictured, and given how much more common Japanese honeysuckle is along roadsides and in home gardens across the eastern and central US, there's a real chance the vine illustrating a US reader's birth flower is a species their own state prohibits them from planting."
        ],
        "image": {
          "src": "/images/june-birth-flower-honeysuckle.jpg",
          "alt": "Lonicera japonica (Japanese honeysuckle) in bloom, an East Asian species introduced to the US as an ornamental in the early 1800s and now classified as a noxious weed in 46 states",
          "credit": "Photo by Cbaile19, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lonicera_japonica,_2021-06-11,_Banksville,_01.jpg), CC0"
        }
      },
      {
        "heading": "What the Old Farmer's Almanac says the two flowers mean",
        "body": [
          "The Almanac ties rose meaning to color: red for romance (\"I love you\"), pink for happiness and admiration, white for innocence and purity, orange for desire and excitement, and yellow for cheer and happiness, though older folklore reads yellow as jealousy instead. Honeysuckle, in the Almanac's framing, stands for happiness and positive energy, layered with an older association around nostalgia: the vine was traditionally planted near homes both as a sign of affection for a new love and, separately, to evoke nostalgia for old flames and to honor people who had died."
        ]
      },
      {
        "heading": "June's other unusual number: three birthstones, not one",
        "body": [
          "The flower chart isn't the only place June breaks from a typical month. This site's own [birthstones by month](/birthstones-by-month/) page found that Jewelers of America's current chart gives June three official birthstones at once, pearl, moonstone, and alexandrite, a count only December also carries. Alexandrite wasn't part of the original 1912 chart; that page traces its addition to a 1952 revision, the same update that added tourmaline to October, citrine to November, and zircon to December. Whatever kept June's flower pairing from settling into one plant, the month's separate gemstone chart didn't settle into one stone either, for an unrelated reason documented four decades later."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is June's birth flower?",
        "answer": "Rose and honeysuckle, per The Old Farmer's Almanac and the florist trade lists that follow it. Like most months on a modern birth-flower list, June carries a primary and a secondary flower rather than one."
      },
      {
        "question": "Is the rose sold at florists an ancient flower?",
        "answer": "The rose genus goes back much further and includes over 300 wild species, but the tall, single-stem rose sold as a cut flower today traces to a 19th-century hybrid, 'La France,' bred in 1867 by Jean-Baptiste André Guillot in Lyon, France, and generally credited as the first hybrid tea rose."
      },
      {
        "question": "What does the rose mean as a birth flower?",
        "answer": "Meaning varies by color in the Old Farmer's Almanac's framing: red for romance, pink for happiness and admiration, white for innocence and purity, orange for desire, and yellow for cheer, though some older folklore reads yellow as jealousy instead."
      },
      {
        "question": "Is the honeysuckle pictured on birth-flower lists always the same species?",
        "answer": "Not necessarily. Photos often show Lonicera japonica, Japanese honeysuckle, which is classified as a noxious weed in 46 US states and banned for sale in several. A native, non-invasive alternative is Lonicera sempervirens, trumpet or coral honeysuckle."
      },
      {
        "question": "Where does the word \"honeysuckle\" come from?",
        "answer": "From Old English hunigsuge, literally \"honey-suck.\" The earliest recorded English sense of the word, around 1300, actually meant clover rather than the climbing vine; the vine sense isn't attested until roughly a century later. The name has no connection to the plant's scientific name, Lonicera, which instead honors 16th-century German botanist Adam Lonicer."
      },
      {
        "question": "Does June have more than one official birthstone too?",
        "answer": "Yes. Jewelers of America's current chart lists three: pearl, moonstone, and alexandrite, one of only two months, along with December, that carry three stones rather than one or two."
      }
    ],
    "sources": [
      {
        "label": "The Old Farmer's Almanac — June Birth Flowers: Rose and Honeysuckle",
        "url": "https://www.almanac.com/june-birth-flowers"
      },
      {
        "label": "Wikipedia — Rose",
        "url": "https://en.wikipedia.org/wiki/Rose"
      },
      {
        "label": "Wikipedia — Rosa 'La France'",
        "url": "https://en.wikipedia.org/wiki/Rosa_%27La_France%27"
      },
      {
        "label": "Wikipedia — Jean-Baptiste André Guillot",
        "url": "https://en.wikipedia.org/wiki/Jean-Baptiste_Andr%C3%A9_Guillot"
      },
      {
        "label": "Etymonline — Rose",
        "url": "https://www.etymonline.com/word/rose"
      },
      {
        "label": "Wiktionary — ῥόδον (rhódon)",
        "url": "https://en.wiktionary.org/wiki/%E1%BF%A5%CF%8C%CE%B4%CE%BF%CE%BD"
      },
      {
        "label": "Etymonline — Honeysuckle",
        "url": "https://www.etymonline.com/word/honeysuckle"
      },
      {
        "label": "Wikipedia — Lonicera",
        "url": "https://en.wikipedia.org/wiki/Lonicera"
      },
      {
        "label": "Wikipedia — Adam Lonicer",
        "url": "https://en.wikipedia.org/wiki/Adam_Lonicer"
      },
      {
        "label": "Wikipedia — Lonicera japonica",
        "url": "https://en.wikipedia.org/wiki/Lonicera_japonica"
      }
    ],
    "image": "/images/june-birth-flower-rose.jpg",
    "imageAlt": "Rosa 'La France', the pink 1867 hybrid tea rose bred by Jean-Baptiste André Guillot, generally credited as the ancestor type behind most cut roses sold as June's birth flower today",
    "imageCredit": "Photo by Arashiyama, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Rosa_%27La_France%27.jpg), CC BY-SA 3.0"
  },
  {
    "slug": "march-birth-flower",
    "category": "Birth Flowers",
    "title": "March Birth Flower: Daffodil, and a Species Name Most Guides Get Wrong",
    "description": "March's birth flower is the daffodil on The Old Farmer's Almanac chart, but the taxonomists who study the genus have never agreed on how many species it actually contains.",
    "published": "2026-08-21",
    "updated": "2026-08-21",
    "coreSummary": "March's birth flower is the daffodil, and The Old Farmer's Almanac names only that one flower for the month, unlike most months on its chart, which carry a primary and a secondary bloom. A separate, unrelated publication, Farmers' Almanac, adds jonquil and cherry blossom as alternatives, though jonquil is not a synonym for daffodil; it names one specific species, Narcissus jonquilla, distinct in leaf shape, stem structure, flowers per stem, and scent. The genus itself resists a stable count: taxonomists have proposed anywhere from 6 species (Linnaeus, 1753) to 87 (the International Daffodil Register, 2006), with a 2008 genetic study cutting that back to 36 and the Royal Horticultural Society's December 2017 register landing at 83. The bulbs are also genuinely toxic; a 2012 cluster of 11 people in Bristol, UK were sickened after eating daffodils sold next to vegetables at a supermarket.",
    "sections": [
      {
        "heading": "One flower, until a different almanac adds two more",
        "body": [
          "The Old Farmer's Almanac names exactly one flower for March: the daffodil. That breaks from the pattern on this site's [June birth flower](/june-birth-flower/) page, where the Almanac's chart pairs a primary flower with a secondary one for most months, rose and honeysuckle, gladiolus and poppy. March's own page on the Almanac's site carries no \"and\" in its title, just \"The Daffodil.\"",
          "A different publication complicates that. Farmers' Almanac is a separate company from The Old Farmer's Almanac, despite the near-identical name, a distinction Almanac.com's own editors have had to clarify publicly because of how often readers confuse the two. Farmers' Almanac's March page is titled \"Daffodil: The March Birth Flower (Plus Jonquil and Cherry-Blossom Alternatives).\" Depending on which almanac a reader lands on, March's birth flower is one plant or three."
        ]
      },
      {
        "heading": "Jonquil isn't another name for daffodil. It's a separate species.",
        "body": [
          "\"Daffodil,\" \"narcissus,\" and \"jonquil\" get used interchangeably often enough that Farmers' Almanac lists jonquil as though it were simply another word for March's flower. The New York Botanical Garden's own explainer on the three names treats that as a mistake worth correcting: jonquil refers specifically to Narcissus jonquilla and its hybrids, one species within the genus, not a second name for daffodils generally. Gardening Know How's comparison piece calls the loose, interchangeable use of \"jonquil\" for any daffodil \"technically incorrect,\" even though it's become common.",
          "The two aren't hard to tell apart once the traits are named. Daffodils carry one flower per stem on slim, sword-tipped leaves and a light scent. Jonquils, per the same NYBG and Gardening Know How comparisons, produce several flowers per stem, up to five, on slender, round-tipped leaves, from a shorter, hollow stem, with a fragrance strong enough that it's the trait most commonly used to identify one in a garden. Jonquils also run hardier in warm climates, thriving as far south as USDA zone 8, a range that doesn't suit most daffodil cultivars as well."
        ],
        "image": {
          "src": "/images/march-birth-flower-jonquil.jpg",
          "alt": "Narcissus jonquilla (jonquil) in bloom, showing the several small flowers per stem and slender, round-tipped leaves that distinguish it from the single-flowered daffodil it's often mistaken for",
          "credit": "Photo by Cillas, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Narcissus_jonquilla_3.jpg), CC BY-SA 4.0"
        }
      },
      {
        "heading": "How many species of daffodil exist? Nobody has counted the same number twice.",
        "body": [
          "Wikipedia's list of Narcissus species lays out a count that has swung by more than tenfold depending on who did the counting and when. Carl Linnaeus, working from a narrow set of specimens in 1753, recognized six species. Botanist Fernandes accepted 22 in 1951 and had revised that up to 63 by 1968. Blanchard counted 65 in 1990; Erhardt counted 66 in 1993. The International Daffodil Register listed 87 species in 2006, the high point of the modern era. Then a 2008 genetic study by Zonneveld cut the number back down to just 36. The Royal Horticultural Society's own December 2017 register, the current standard reference, accepts 83 species names, while more than 300 additional names that once described separate species are now filed as synonyms.",
          "Wikipedia's summary attributes most of the swing to how narrowly or broadly a \"species\" gets defined, plus how natural hybrids get classified. A botanist working from a wide view of each species, lumping closely related populations together, ends up with a short list; one working from a narrow view, splitting them apart, ends up with a long one. Naturally occurring hybrids compound the problem: an \"ancient hybrid\" found spread across a wide area is often promoted to full species status, while a \"recent hybrid\" found growing only as scattered individuals among its parent plants usually isn't. There's no committee empowered to settle the question the way there is for cultivated varieties; the RHS runs the international registry for garden hybrids and cultivars, sorted into 13 horticultural divisions, but the wild species count underneath that system has never stopped moving."
        ],
        "image": {
          "src": "/images/march-birth-flower-daffodil.jpg",
          "alt": "Narcissus pseudonarcissus (wild daffodil) in bloom, the species most closely tied to the common name, though taxonomists disagree on how many related Narcissus species should be counted separately",
          "credit": "Photo via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Narcissus_pseudonarcissus_flower_300303.jpg), CC BY-SA 3.0"
        }
      },
      {
        "heading": "The word \"daffodil\" hides a letter nobody can explain",
        "body": [
          "Etymonline traces \"daffodil\" back to Middle English \"affodill,\" recorded around 1400, itself from Medieval Latin affodillus, from Latin asphodelus, from Greek asphodelos, a word Etymonline lists as of unknown origin in its own right. English picked up the \"d-\" spelling by the 1540s, and the added letter has never been fully explained. Etymonline's own leading theory points to the article fusing onto the word in Dutch, \"de affodil,\" the Netherlands having long been a source for bulbs. The Oxford English Dictionary's entry catalogs additional proposals nobody has settled on either: a French preposition doing the same job, \"d'asphodel\"; or a playful, childish sound-shift of the kind that turns \"Edward\" into \"Ted\" or \"aunt\" into \"tante.\" Two layers of the word's history are unresolved: the ultimate Greek root is unexplained, and so is the English letter stuck onto the front of it."
        ]
      },
      {
        "heading": "Narcissus: named for the myth, or the myth named for the poison?",
        "body": [
          "The genus's scientific name and the mythological youth it's usually said to honor share a possible root in Greek narke, \"numbness\" or \"torpor,\" a connection some sources tie directly to the plant's own sedative, toxic alkaloids. That link isn't settled etymology, though. Linguist Robert Beekes, whose work is cited on the word's etymology, argues that the ending on Narkissos points to a pre-Greek word rather than a genuine derivation from narke, meaning the name may have entered Greek from an earlier, non-Greek language of the region, with the resemblance to \"numbness\" arriving after the fact rather than explaining the name's actual origin. Whether the flower was named for what it does to the body, or the resemblance is coincidence dressed up as etymology, is a question the sources checked for this page don't resolve."
        ]
      },
      {
        "heading": "The toxicity isn't theoretical",
        "body": [
          "Daffodil bulbs contain lycorine, an alkaloid that causes vomiting and gastrointestinal cramping, and the danger has produced a documented poisoning case, not just a warning label. In February 2012, UK health investigators, in a report now archived by the UK Health Security Agency, identified 11 people in Bristol, ages 5 to 60, who were sickened after eating daffodils bought at a supermarket that had displayed pre-bloom daffodil stalks next to the vegetables, unmarked as inedible. All 11 developed vomiting within 12 hours; none required hospitalization.",
          "The Bristol case wasn't an isolated incident. Trade publication The Grocer reported that Public Health England, writing to major UK retailers in 2015 to warn them off displaying daffodils near produce, disclosed that the agency had logged 63 inquiries over the previous six years from people who had mistaken daffodil bulbs for onions or the stems for a vegetable, including 27 cases in the single year before that letter went out."
        ]
      },
      {
        "heading": "What the flower is supposed to mean, and March's other one-stone chart",
        "body": [
          "The Old Farmer's Almanac ties daffodils to rebirth, new beginnings, and good fortune, fitting for a flower that's often among the first to bloom after winter. Older folklore attaches a specific superstition to how the flowers are given: a bunch of daffodils is said to bring good luck, while a single stem given alone is said to bring the opposite. Wales claims the daffodil as its national flower, worn each March 1 for St David's Day, alongside a separate Welsh legend holding that whoever spots the season's first bloom will have a prosperous year ahead.",
          "The single-stone pattern here has a match elsewhere on the calendar. This site's own [March birthstone](/march-birthstone/) page found that Jewelers of America's current chart names only aquamarine for March, no second stone, even though the Gemological Institute of America and the American Gem Society both present aquamarine and bloodstone as a pair. Two separate charts, run by different organizations for different products, arrived at the same one-name-only treatment for the same month."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is March's birth flower?",
        "answer": "The daffodil, per The Old Farmer's Almanac, which names only that one flower for March, unlike most months on its chart. Farmers' Almanac, an entirely separate publication despite the similar name, adds jonquil and cherry blossom as alternatives on its own March page."
      },
      {
        "question": "Is jonquil just another name for daffodil?",
        "answer": "No. Jonquil refers specifically to Narcissus jonquilla and its hybrids, one species within the daffodil genus, not a synonym for daffodils generally. Jonquils carry several fragrant flowers per stem on slender, round-tipped leaves; daffodils carry one flower per stem on sword-tipped leaves."
      },
      {
        "question": "How many species of daffodil are there?",
        "answer": "Depends who's counting. Estimates have ranged from 6 species (Linnaeus, 1753) to 87 (the International Daffodil Register, 2006), with a 2008 genetic study cutting the number to 36 and the Royal Horticultural Society's December 2017 register currently accepting 83 species names alongside more than 300 synonyms."
      },
      {
        "question": "Where does the word \"daffodil\" come from?",
        "answer": "From Middle English \"affodill,\" ultimately from Greek asphodelos, a word of unknown origin. The initial \"d-\" that turned \"affodill\" into \"daffodil\" by the 1540s has never been fully explained; leading theories point to a fused Dutch or French article, or a playful sound-shift."
      },
      {
        "question": "Are daffodils actually poisonous?",
        "answer": "Yes. The bulbs contain lycorine, an alkaloid that causes vomiting and cramping. In February 2012, 11 people in Bristol, UK were sickened after eating daffodils sold next to vegetables at a supermarket, and Public Health England logged 63 similar inquiries over six years before warning retailers in 2015."
      },
      {
        "question": "Does March have more than one official birthstone too?",
        "answer": "No, at least not on Jewelers of America's current chart, which lists only aquamarine for March. GIA and the American Gem Society both also present bloodstone as a second option, the same one-stone-versus-two disagreement that shows up on March's flower chart."
      }
    ],
    "sources": [
      {
        "label": "The Old Farmer's Almanac — March Birth Flower: The Daffodil",
        "url": "https://www.almanac.com/content/march-birth-flower"
      },
      {
        "label": "Farmers' Almanac — Daffodil: The March Birth Flower (Plus Jonquil and Cherry-Blossom Alternatives)",
        "url": "https://www.farmersalmanac.com/march-flower-lore"
      },
      {
        "label": "NYBG Plant Talk — What's in a Plant Name? Narcissus, Daffodils, and Jonquils",
        "url": "https://www.nybg.org/blogs/plant-talk/2017/04/around-the-garden/whats-in-a-plant-name-narcissus-daffodils-and-jonquils/"
      },
      {
        "label": "Wikipedia — List of Narcissus species",
        "url": "https://en.wikipedia.org/wiki/List_of_Narcissus_species"
      },
      {
        "label": "Wikipedia — List of Narcissus horticultural divisions",
        "url": "https://en.wikipedia.org/wiki/List_of_Narcissus_horticultural_divisions"
      },
      {
        "label": "Etymonline — Daffodil",
        "url": "https://www.etymonline.com/word/daffodil"
      },
      {
        "label": "Oxford English Dictionary — daffodil, n.",
        "url": "https://www.oed.com/dictionary/daffodil_n"
      },
      {
        "label": "Etymonline — Asphodel",
        "url": "https://www.etymonline.com/word/asphodel"
      },
      {
        "label": "Etymonline — Narcissus",
        "url": "https://www.etymonline.com/word/narcissus"
      },
      {
        "label": "UK Health Security Agency — Gastro-intestinal poisoning due to consumption of daffodils mistaken for vegetables, Bristol",
        "url": "https://researchportal.ukhsa.gov.uk/en/publications/gastro-intestinal-poisoning-due-to-consumption-of-daffodils-mista-2/"
      },
      {
        "label": "The Grocer — Daffodils are a danger warns Public Health England",
        "url": "https://www.thegrocer.co.uk/news/daffodils-are-a-danger-warns-public-health-england/513254.article"
      }
    ],
    "image": "/images/march-birth-flower-daffodil.jpg",
    "imageAlt": "Narcissus pseudonarcissus (wild daffodil) in bloom, the species most closely tied to the common name March's birth flower is drawn from",
    "imageCredit": "Photo via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Narcissus_pseudonarcissus_flower_300303.jpg), CC BY-SA 3.0"
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
        {
          "date": "2026-09-19",
          "weekday": "Saturday"
        },
        {
          "date": "2027-09-19",
          "weekday": "Sunday"
        },
        {
          "date": "2028-09-19",
          "weekday": "Tuesday"
        },
        {
          "date": "2029-09-19",
          "weekday": "Wednesday"
        },
        {
          "date": "2030-09-19",
          "weekday": "Thursday"
        },
        {
          "date": "2031-09-19",
          "weekday": "Friday"
        }
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
        {
          "date": "2026-10-01",
          "weekday": "Thursday"
        },
        {
          "date": "2027-10-01",
          "weekday": "Friday"
        },
        {
          "date": "2028-10-01",
          "weekday": "Sunday"
        },
        {
          "date": "2029-10-01",
          "weekday": "Monday"
        },
        {
          "date": "2030-10-01",
          "weekday": "Tuesday"
        },
        {
          "date": "2031-10-01",
          "weekday": "Wednesday"
        }
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
  },
  {
    "slug": "national-first-responders-day",
    "category": "Observances",
    "title": "National First Responders Day: Eleven Bills, No Statute",
    "description": "October 28 is National First Responders Day. Congress introduced eleven bills across a decade — the Senate passed two, the House never passed one at all.",
    "published": "2026-08-16",
    "updated": "2026-08-16",
    "coreSummary": "National First Responders Day falls on October 28 every year in the United States, honoring police officers, firefighters, EMTs, paramedics, and 911 dispatchers. Congress introduced eleven separate bills and resolutions to establish it between 2014 and 2023, and the Senate passed two of them, in 2017 and 2019, but the House never passed a single one, so no federal statute names the day; the White House has filled that gap on its own, with presidential proclamations in 2022, 2023, and 2024.",
    "dateRule": {
      "kind": "fixed",
      "text": "The same calendar date every year, October 28, in the United States.",
      "status": "conventional",
      "source": {
        "label": "National First Responders Day, 2024 — Presidential Proclamation 10845 (Federal Register)",
        "url": "https://www.federalregister.gov/documents/2024/11/01/2024-25590/national-first-responders-day-2024"
      },
      "occurrences": [
        {
          "date": "2026-10-28",
          "weekday": "Wednesday"
        },
        {
          "date": "2027-10-28",
          "weekday": "Thursday"
        },
        {
          "date": "2028-10-28",
          "weekday": "Saturday"
        },
        {
          "date": "2029-10-28",
          "weekday": "Sunday"
        },
        {
          "date": "2030-10-28",
          "weekday": "Monday"
        },
        {
          "date": "2031-10-28",
          "weekday": "Tuesday"
        }
      ],
      "caveat": "No federal statute fixes October 28 as an annual date, because no bill or resolution naming that date ever passed both chambers of Congress; this calendar could not find any source that explains why October 28 specifically was chosen over any other date, and the original 2017 Senate sponsors do not appear to have stated one. What keeps the date consistent is a pattern, not a law: every congressional resolution on the record names October 28 by habit, each one copying the date the previous attempt used, and the White House has issued presidential proclamations naming October 28 in 2022, 2023, and 2024, but this calendar found no proclamation for 2025 as of this page's research. A reader relying on this date should treat it as well-established by repetition, not as legally guaranteed to recur."
    },
    "founding": {
      "status": "documented",
      "text": "The observance traces to a named person with a specific, on-the-record starting point: Andrew Collier, whose brother, Massachusetts Institute of Technology police officer Sean Collier, was shot and killed on April 18, 2013, by the two men responsible for the Boston Marathon bombing. In an October 15, 2013, Police1 article by Barbara A. Schwartz, published that same year, Andrew is described launching a petition and a public campaign for a national day honoring first responders, reasoning that police officers, firefighters, and paramedics who \"put their lives on the line\" at home deserved the kind of recognition Memorial Day gives service members overseas. Schwartz's article, itself explicitly asking readers to sign the petition, is the earliest dated, named account this calendar could find of the campaign that led to National First Responders Day.\n\nThe first legislative attempt followed within months: Representative Michael Capuano of Massachusetts, Sean Collier's home state, introduced H.R.4109 on February 27, 2014, a bill that would have gone further than a symbolic resolution by requiring the President to designate a legal public holiday called National First Responders Day. It was referred to committee and never received a vote. Over the following decade, ten more bills and resolutions followed in five more Congresses, described in full below, and only two of them, both in the Senate, ever passed a floor vote. None passed the House. No federal statute has ever created National First Responders Day; the date exists today because of Andrew Collier's advocacy, continued backing from the nonprofit All Clear Foundation, a pattern of resolutions that consistently named October 28 without ever finishing the job, and, starting in 2022, a run of presidential proclamations issued without any statute behind them.",
      "source": {
        "label": "Brother of slain MIT officer seeks a National First Responders Day — Police1, October 15, 2013, by Barbara A. Schwartz",
        "url": "https://www.police1.com/police-heroes/articles/brother-of-slain-mit-officer-seeks-a-national-first-responders-day-rzq9SHfn8FFxlk6I/"
      }
    },
    "sections": [
      {
        "heading": "What National First Responders Day is",
        "body": [
          "National First Responders Day falls on October 28 every year in the United States, a day set aside to recognize police officers and sheriff's deputies, firefighters, paramedics and EMTs, and 911 dispatchers; President Biden's 2024 proclamation also named 988 crisis-line responders among the group being honored. The day carries no legal status of its own. It is not a federal holiday, government offices and schools run a normal Wednesday-in-late-October schedule, and no statute requires banks or the postal service to close.",
          "What marks the day in practice is mostly local and voluntary: police and fire departments post appreciation messages, some restaurants and retailers offer first-responder discounts around the date, and community groups organize small ceremonies. The First Responders Children's Foundation, a New York-based nonprofit unrelated to the day's origin, has run a public ceremony in Times Square on or near October 28 in recent years, one of the more visible annual events tied to the observance."
        ]
      },
      {
        "heading": "The 2013 tragedy that started it",
        "body": [
          "On April 18, 2013, three days after the Boston Marathon bombing, MIT police officer Sean Collier was ambushed and shot in his patrol car by the two men responsible for the attack; he was 26 and had served with the MIT police department for just over a year. His brother, Andrew Collier, began advocating almost immediately for a national day honoring first responders generally, not his brother specifically, a distinction Andrew has repeated in multiple interviews since. Reporter Barbara A. Schwartz's Police1 column, published that October, quotes Andrew explaining the trigger: the first Memorial Day the Collier family endured without Sean, which made him ask why there was a day honoring troops who serve overseas but nothing comparable for \"first responders,\" the people who serve, in his words, here at home.",
          "Andrew's research into how a national observance actually gets created was not encouraging. Schwartz's article recounts his discovery that Martin Luther King Jr. Day took two separate petition drives, one with 300,000 signatures that failed and a second with six million that succeeded, and fourteen more years after that before every state observed it. With his sister Jennifer, Andrew launched his own petition later in 2013, and the resulting campaign, eventually joined by the nonprofit All Clear Foundation, ran for years before any bill reached a floor vote of either chamber of Congress."
        ]
      },
      {
        "heading": "Eleven bills, two Senate votes, zero in the House",
        "body": [
          "The full legislative record, checked directly against GovTrack's mirror of the primary congressional record, runs to eleven separate bills and resolutions across six Congresses, and this calendar found only two that ever passed a floor vote, both in the Senate, in different years, for different sessions of the same resolution.",
          "H.R.4109 (113th Congress, introduced February 27, 2014) would have required the President to designate a legal public holiday; it died in committee without a vote. H.Con.Res.87 (114th Congress, October 26, 2015) and H.R.5425 (114th Congress, June 9, 2016, a repeat of the 2014 holiday-creation approach) both died the same way. In the 115th Congress, Senate Concurrent Resolution 15 passed the Senate on August 3, 2017, the first floor-vote success in the record, designating October 28, 2017, specifically; its House companion, H.Con.Res.56, was referred to committee and never voted on. In the 116th Congress, the Senate repeated the success: an identical S.Con.Res.15 passed the Senate on June 5, 2019, after being reported out of committee the day before. Its House counterpart, H.Con.Res.37, sponsored by Representative Mark Meadows with Representatives Elijah Cummings and Rosa DeLauro among the original cosponsors, was voted out of the House Transportation and Infrastructure Committee on October 29, 2019, and had gathered 27 cosponsors by the time advocates publicized that vote in a December 12, 2019, press release; the committee's formal written report did not follow until nearly a year later, September 4, 2020. The resolution never received a floor vote and died when that Congress ended in January 2021. A separate bill that Congress, H.R.8724, the \"First Responders Day Act,\" introduced November 2, 2020, also died without a vote. In the 117th Congress, both H.Res.750 and S.Res.433, each introduced October 28, 2021, died the same way. The most recent attempt this calendar could find, H.Res.818 in the 118th Congress, was introduced October 26, 2023, and also died in committee.",
          "Two Senate floor votes, in two different Congresses, out of eleven total tries; the House has not passed a single one."
        ],
        "image": {
          "src": "/images/national-first-responders-day-timeline.svg",
          "alt": "Timeline from 2013 to today showing Sean Collier's death and his brother's advocacy, the first 2014 bill, the Senate's 2017 and 2019 passages with House versions dying both times, more failed bills in 2021 and 2023, and presidential proclamations starting in 2022 with no statute behind any of them"
        }
      },
      {
        "heading": "The claim that overstates what happened in 2019",
        "body": [
          "Several trade-press accounts of the day's history, including at least one syndicated across multiple public-safety news sites, describe 2019 as the year \"National First Responders Day became a reality,\" naming Cummings and DeLauro as having \"sponsored the bill that passed in the U.S. House.\" Checked against the primary record, that description does not hold up on two points. First, H.Con.Res.37's actual lead sponsor was Representative Mark Meadows; Cummings and DeLauro were among its original cosponsors, a real distinction in how congressional resolutions are credited. Second, and more importantly, the resolution never passed the House at all. A December 12, 2019, press release from the advocacy group All Clear Foundation, announcing that H.Con.Res.37 had just been \"advanced\" by passing out of the House Transportation and Infrastructure Committee, quotes the foundation's own president asking lawmakers to \"bring HR37 to a House floor vote following December's recess\" — language that only makes sense if the floor vote had not yet happened. It never did; GovTrack's record for H.Con.Res.37 confirms the resolution was still pending when the 116th Congress ended in January 2021 and, under congressional rules, died with it.",
          "The distinction matters for a reader trying to understand what actually backs the date. Passing a committee markup is a real step, and 2019's House committee vote was further than any earlier House attempt had gotten, but it is not the same thing as the resolution becoming law, or even the same thing as the House going on record with a floor vote. No source this calendar checked shows a House floor vote on National First Responders Day ever taking place, in 2019 or in any other year."
        ]
      },
      {
        "heading": "Presidents filled the gap Congress left",
        "body": [
          "With no statute on the books, federal recognition of the day has come entirely through the executive branch, and even that has been inconsistent. This calendar found presidential proclamations naming October 28 National First Responders Day in three consecutive years: Proclamation 10482 in 2022, Proclamation 10659 in 2023, and Proclamation 10845 in 2024, all issued by President Biden and all published in the Federal Register within a few days of the date itself. Each proclamation calls on Americans to observe the day with programs and ceremonies; none of them cites a statute, because none exists to cite.",
          "Searching the Federal Register and the American Presidency Project's proclamation index for a 2025 proclamation, the first fully under the current administration, turned up nothing matching that title as of this page's research, even though the same sources show the administration issuing other, similarly worded first-responder proclamations that year, including one for Fire Prevention Week in October 2025. That gap does not prove no 2025 proclamation exists; it means this calendar could not locate one, and a reader checking closer to October 28 in any given year should not assume the White House will repeat a practice that has run for only three of the observance's roughly ten most active years and has already shown at least one apparent interruption."
        ]
      },
      {
        "heading": "Where this sits next to its calendar neighbors",
        "body": [
          "This calendar has now checked the federal paper trail behind several observances that popular sites describe as more official than the primary record supports, and National First Responders Day is a genuinely different case from most of them. [National Epilepsy Awareness Month](/epilepsy-awareness-month/) has three failed congressional resolutions and no successful floor vote in either chamber, ever. [ADHD Awareness Month](/adhd-awareness-month/) has five Senate resolutions that all passed, but only for a single September date each year, never for the month itself, and the practice stopped after 2008. [American Diabetes Month](/diabetes-awareness-month/) is the strongest of the group, with an actual 1982 presidential proclamation under a Senate joint resolution, renewed by name in 1985. National First Responders Day lands in between: unlike the epilepsy record, its resolution did pass a full chamber, twice; unlike the ADHD record, those two Senate passages named a single date rather than establishing a recurring practice, and the House never once matched the Senate's success. The result is an observance with a stronger paper trail than most of its neighbors and still, after eleven tries, no law."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is National First Responders Day in 2026?",
        "answer": "Wednesday, October 28, 2026. It falls on the same calendar date every year, though no federal statute fixes that date; it persists through a decade of congressional resolutions that consistently named October 28 and, since 2022, presidential proclamations naming the same date."
      },
      {
        "question": "Is National First Responders Day a federal holiday?",
        "answer": "No. No bill establishing it has ever passed both chambers of Congress, so there is no statute behind it. Government offices, schools, and banks run a normal schedule on October 28."
      },
      {
        "question": "Who started National First Responders Day?",
        "answer": "Andrew Collier, whose brother, MIT police officer Sean Collier, was killed by the Boston Marathon bombers on April 18, 2013. Andrew launched a petition and public campaign later that year, joined in later years by the nonprofit All Clear Foundation."
      },
      {
        "question": "Did Congress ever pass a law creating National First Responders Day?",
        "answer": "No. Eleven separate bills and resolutions were introduced between 2014 and 2023. A Senate resolution naming October 28 passed the full Senate twice, in 2017 and 2019, but a matching House resolution never received a floor vote in either year, and no version of the bill has ever become law."
      },
      {
        "question": "Did the House of Representatives pass a National First Responders Day resolution in 2019?",
        "answer": "No, despite that claim appearing in some trade-press accounts. The House version, H.Con.Res.37, was voted out of committee on October 29, 2019, and advocates publicized that vote in a December 2019 press release, but the resolution never received a full House floor vote, and it died when that Congress ended in January 2021."
      },
      {
        "question": "Has a president ever issued a proclamation for National First Responders Day?",
        "answer": "Yes. President Biden issued proclamations naming October 28 National First Responders Day in 2022, 2023, and 2024. This calendar could not find a matching proclamation for 2025 as of this page's research."
      },
      {
        "question": "Is National First Responders Day the same as National First Responder Month?",
        "answer": "No. National First Responder Month is a separate proposal for the month of May; a 2024 House resolution, H.Res.1185, sought to designate it but was introduced and died in committee without a vote, the same pattern as most of the October 28 attempts."
      }
    ],
    "sources": [
      {
        "label": "Brother of slain MIT officer seeks a National First Responders Day — Police1, October 15, 2013",
        "url": "https://www.police1.com/police-heroes/articles/brother-of-slain-mit-officer-seeks-a-national-first-responders-day-rzq9SHfn8FFxlk6I/"
      },
      {
        "label": "In Memory of Sean A. Collier — MIT Police, official account of the April 18, 2013, shooting",
        "url": "https://police.mit.edu/memory-sean-collier"
      },
      {
        "label": "H.R.4109 — 113th Congress, 2014, to require the President to designate a legal public holiday (GovTrack.us)",
        "url": "https://www.govtrack.us/congress/bills/113/hr4109"
      },
      {
        "label": "S.Con.Res.15 — 115th Congress, 2017, passed the Senate August 3, 2017, never passed the House (GovTrack.us)",
        "url": "https://www.govtrack.us/congress/bills/115/sconres15"
      },
      {
        "label": "S.Con.Res.15 — 116th Congress, 2019, passed the Senate June 5, 2019, never passed the House (GovTrack.us)",
        "url": "https://www.govtrack.us/congress/bills/116/sconres15"
      },
      {
        "label": "H.Con.Res.37 — 116th Congress, 2019, died without a House floor vote (GovTrack.us)",
        "url": "https://www.govtrack.us/congress/bills/116/hconres37"
      },
      {
        "label": "Congressional Resolution Advances to Designate Oct. 28 as National First Responders Day — All Clear Foundation, PRNewswire, December 12, 2019, source of the \"bring HR37 to a House floor vote\" quote above",
        "url": "https://www.prnewswire.com/news-releases/congressional-resolution-advances-to-designate-oct-28-as-national-first-responders-day-300973596.html"
      },
      {
        "label": "H.Res.818 — 118th Congress, 2023, the most recent attempt found, died without a vote (GovTrack.us)",
        "url": "https://www.govtrack.us/congress/bills/118/hres818"
      },
      {
        "label": "H.Res.1185 — 118th Congress, 2024, proposing \"National First Responder Month\" in May, died without a vote (GovTrack.us)",
        "url": "https://www.govtrack.us/congress/bills/118/hres1185"
      },
      {
        "label": "National First Responders Day, 2024 — Presidential Proclamation 10845 (Federal Register)",
        "url": "https://www.federalregister.gov/documents/2024/11/01/2024-25590/national-first-responders-day-2024"
      },
      {
        "label": "Proclamation 10482 — National First Responders Day, 2022 (The American Presidency Project)",
        "url": "https://www.presidency.ucsb.edu/documents/proclamation-10482-national-first-responders-day-2022"
      },
      {
        "label": "Origin story: The history of National First Responders Day — FireRescue1, source of the overstated \"bill that passed in the U.S. House\" claim discussed above",
        "url": "https://www.firerescue1.com/national-first-responders-day/articles/origin-story-national-first-responders-day-hWdwQqSAsvEx7KbP/"
      }
    ],
    "image": "/images/national-first-responders-day-collier-memorial.jpg",
    "imageAlt": "The Sean Collier Memorial at MIT, built to honor the police officer whose 2013 killing by the Boston Marathon bombers led his brother to begin the campaign for National First Responders Day",
    "imageCredit": "Photo by Peacearth, CC BY-SA 4.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Sean_Collier_Memorial_01.jpg)"
  },
  {
    "slug": "suicide-prevention-month",
    "category": "Observances",
    "title": "National Suicide Prevention Month: Never Made Federal Law",
    "description": "September carries the name nationwide, but no Congress has passed it and no President has proclaimed it. Only September 10 gets an annual proclamation.",
    "published": "2026-08-16",
    "updated": "2026-08-16",
    "coreSummary": "National Suicide Prevention Month covers all of September, every year, in the United States, an observance the American Association of Suicidology (AAS) traces to a May awareness week it launched in 1974 and moved to September in 2003. No Congress has ever passed a resolution making the full month permanent and no President has proclaimed it; only September 10, World Suicide Prevention Day, gets its own annual presidential proclamation, and even the routine congressional resolutions supporting the month have stalled again for 2025.",
    "dateRule": {
      "kind": "fixed",
      "text": "All of September, every year, in the United States, not a single date within the month.",
      "status": "conventional",
      "source": {
        "label": "American Association of Suicidology — About & History",
        "url": "https://suicidology.org/about/"
      },
      "occurrences": [
        {
          "date": "2026-09-01",
          "weekday": "Tuesday"
        },
        {
          "date": "2027-09-01",
          "weekday": "Wednesday"
        },
        {
          "date": "2028-09-01",
          "weekday": "Friday"
        },
        {
          "date": "2029-09-01",
          "weekday": "Saturday"
        },
        {
          "date": "2030-09-01",
          "weekday": "Sunday"
        },
        {
          "date": "2031-09-01",
          "weekday": "Monday"
        }
      ],
      "caveat": "The month itself is not in dispute: AAS, federal agencies, health-media sites, and congressional resolutions all agree September is the month. What is unsettled is the founding year of the week that preceded it. AAS's own current site confirms it was founded in 1968 by Edwin S. Shneidman, but does not give a date for the original awareness week on its currently accessible pages. Secondary retrospectives converge on May 1974 as the week's launch, while Wikipedia's article on the week instead states events have been held \"since 1975.\" This page follows 1974, the year repeated across independent secondary sources, but readers should know the one-year gap exists and that no primary AAS document on the live site currently settles it either way."
    },
    "founding": {
      "status": "documented",
      "text": "The American Association of Suicidology (AAS), a nonprofit founded in 1968 by clinical psychologist Edwin S. Shneidman, says on its own site that it convened after Shneidman's work at the National Institute of Mental Health exposed the lack of any coordinated national suicide-prevention structure. Secondary histories, though not AAS's currently live pages, credit the organization with launching a National Suicide Prevention Week every May starting in 1974, moving that week to September in 2003 to align with the newly created World Suicide Prevention Day, and expanding it to cover the full month in 2008. No single person is credited with founding the month itself; it grew out of an advocacy campaign, not a proclamation or a law.",
      "source": {
        "label": "American Association of Suicidology — About & History",
        "url": "https://suicidology.org/about/"
      }
    },
    "sections": [
      {
        "heading": "Two different observances share this month",
        "body": [
          "National Suicide Prevention Month runs across all of September in the United States. Nested inside it is a separate, more specific observance: World Suicide Prevention Day, every September 10, created in 2003 by the International Association for Suicide Prevention (IASP) with the World Health Organization (WHO) as co-sponsor. The two are often used interchangeably in casual writing, but they have different founders, different founding years, and, as the next two sections lay out, very different relationships to actual government action.",
          "The single day has a clean founding: a named pair of organizations, a specific year, and an annual presidential proclamation that both the Obama and Biden administrations issued for September 10 in the years this page checked. The month is where the record gets murkier. Most of what gets repeated about it, that \"Congress recognizes it\" or \"the President has designated it,\" does not hold up against the primary record."
        ]
      },
      {
        "heading": "From a May week to a September month, with no law in between",
        "body": [
          "AAS's own site confirms the organization was founded in 1968, after Shneidman's work at NIMH's Center for Suicide Prevention highlighted the absence of any national coordinating structure for suicide research and prevention. What AAS's currently live pages do not spell out is the chronology of the awareness week that eventually became this month. That account comes from secondary retrospectives, not from a primary document this page could verify on suicidology.org today.",
          "By that secondary account, AAS launched a National Suicide Prevention Week every May starting in 1974. It stayed in May for nearly three decades. In 2003, the same year IASP and WHO created World Suicide Prevention Day for September 10, AAS moved its week to September to align with the new day. In 2008, the week expanded to cover the entire month, the version most people mean today when they say \"National Suicide Prevention Month.\"",
          "None of these three changes, the 1974 launch, the 2003 move, or the 2008 expansion, came from Congress or the White House. Each was a decision made inside an advocacy nonprofit. That distinguishes this observance from something like Domestic Violence Awareness Month, which reached an actual one-time federal statute in 1989, or American Diabetes Month, which has a Reagan-era presidential proclamation on record from 1982."
        ]
      },
      {
        "heading": "What Congress has actually voted on",
        "body": [
          "Searching the primary congressional record turns up a recurring pattern rather than a single founding vote. A resolution recognizing suicide as a national problem, sponsored by then-Senator Harry Reid, passed the Senate in 1997 (S.Res. 84), but its text never mentions September or a monthly designation. It is a general statement of priority, not the origin of this specific observance.",
          "The specific \"designate September as National Suicide Prevention Month\" language starts showing up as its own resolution later. In the House, versions have been introduced in at least four separate Congresses: H.Res. 850 (114th, introduced September 2016), H.Res. 1067 (115th, September 2018), H.Res. 1436 (118th, 2024), and H.Res. 697 (119th, 2025). Every one of them was referred to committee and died without a floor vote, according to GovTrack's tracking of each bill's status.",
          "The Senate side has actually succeeded twice: S.Res. 636 in the 115th Congress and S.Res. 738 in the 116th Congress were both agreed to by unanimous consent, a real vote (even if a non-recorded one) rather than a dead-end committee referral. But a Senate resolution agreed to in one Congress does not carry into the next; each expires with that two-year session and has to be reintroduced from scratch. The 119th Congress's Senate version, S.Res. 385, introduced in 2025 for that year's September, was still sitting at \"introduced\" as of this page's research in August 2026, meaning even the chamber that has passed it before did not get it done that time.",
          "No joint resolution, the kind of measure that would need both chambers and the President's signature to become binding, has ever been introduced for this specifically. No President has proclaimed the full month of September as National Suicide Prevention Month in the sources this page checked. The proclamations that do exist, described next, are for the single day only."
        ]
      },
      {
        "heading": "The one part of this story that is now a real law",
        "body": [
          "Set the month aside and look at September 10 alone: Obama proclaimed World Suicide Prevention Day in at least 2015 and 2016, and Biden did the same in 2021 through 2024, each a named, dated presidential document in the Federal Register. That is a different category of federal recognition than anything the month has received, an annual proclamation, tied to a single day, that multiple administrations have kept up.",
          "The one piece of this whole subject that became an ordinary federal statute is neither the day nor the month. It is the 988 phone number. The National Suicide Hotline Designation Act of 2020 (S. 2661) passed the Senate on May 13, 2020, passed the House on September 21, 2020, and was signed into law as Public Law 116-172 on October 17, 2020. It required the FCC to designate 988 as the nationwide three-digit number for the National Suicide Prevention Lifeline and the Veterans Crisis Line. Telecom carriers had to activate it by July 16, 2022, and it has operated as the 988 Suicide & Crisis Lifeline ever since.",
          "That contrast is the clearest way to see what has and has not happened at the federal level: a concrete piece of infrastructure, a phone number everyone can dial, went through both chambers and got a President's signature. A calendar designation for a month has not, in any version this page found in the record.",
          "If you or someone you know is in crisis, the 988 Suicide & Crisis Lifeline is reachable by call or text, 24 hours a day, anywhere in the United States."
        ]
      },
      {
        "heading": "What the most recent data shows",
        "body": [
          "The CDC's National Center for Health Statistics reported that the age-adjusted suicide rate in the United States was 14.1 per 100,000 people in 2023, essentially unchanged from 14.2 in 2018, a five-year period of roughly flat, still-elevated rates rather than a clear rise or fall. Suicide was the 11th leading cause of death overall that year, accounting for more than 49,300 deaths.",
          "The rate is not evenly distributed: the 2023 rate among men, 22.8 per 100,000, was close to four times the rate among women, 5.9 per 100,000. Both figures come from the same NCHS data brief, not from separate, less comparable sources."
        ]
      },
      {
        "heading": "Where this sits next to the rest of this calendar's awareness months",
        "body": [
          "This site has now checked the federal paper trail behind several awareness months, and the results form a rough spectrum rather than a single pattern. [Domestic Violence Awareness Month](/domestic-violence-awareness-month/) reached an actual one-time law, Public Law 101-112, in 1989. Congress designated that specific October, and nothing has renewed the designation since, but the law itself is real. [ADHD Awareness Month](/adhd-awareness-month/) has a documented five-year run of Senate resolutions, 2004 through 2008, each agreed to without objection, before the practice simply stopped with no sixth attempt found. [Epilepsy Awareness Month](/epilepsy-awareness-month/) has the weakest record of the three: three separate resolutions across three different Congresses, and not one of them ever reached a vote in either chamber.",
          "National Suicide Prevention Month lands closest to the ADHD pattern but less consistent even than that. The Senate has agreed to it twice, not five times running, the House has never passed it at all, and the most recent attempt, for 2025, stalled in both chambers. What the month has that none of the others do is a well-documented single day nested inside it, World Suicide Prevention Day, that keeps getting a real presidential proclamation even while the month around it does not."
        ]
      }
    ],
    "faq": [
      {
        "question": "Is National Suicide Prevention Month the same thing as World Suicide Prevention Day?",
        "answer": "No. World Suicide Prevention Day is a single date, September 10, created in 2003 by the International Association for Suicide Prevention and the World Health Organization. National Suicide Prevention Month is the full 30 days of September, an American observance that grew out of a May awareness week the American Association of Suicidology (AAS) ran starting in 1974 and moved to September in 2003 to align with the new day. The day sits inside the month, but they were founded separately and have different levels of federal recognition: the day gets an annual presidential proclamation, the month does not."
      },
      {
        "question": "Has Congress ever passed a law making September National Suicide Prevention Month?",
        "answer": "Not according to the primary congressional record checked for this page. House versions of the recognizing resolution, in the 114th, 115th, 118th, and 119th Congresses, were each referred to committee and never received a floor vote. Senate versions were agreed to by unanimous consent twice, in the 115th and 116th Congresses, but a Senate resolution expires with that two-year session; it does not carry forward or become binding law. No joint resolution requiring both chambers and a presidential signature has been introduced for this specific designation."
      },
      {
        "question": "Does the President proclaim National Suicide Prevention Month?",
        "answer": "Not the month specifically, in the sources this page found. Presidents have proclaimed World Suicide Prevention Day, September 10, in most recent years: Obama did in 2015 and 2016, and Biden did every year from 2021 through 2024. But those proclamations name the single day, not the full month."
      },
      {
        "question": "Who founded National Suicide Prevention Month?",
        "answer": "No single person is credited with founding the month as such. The American Association of Suicidology, founded in 1968 by psychologist Edwin S. Shneidman, is the organization behind its predecessor: a National Suicide Prevention Week held every May from 1974 on. AAS moved that week to September in 2003 and expanded it to a full month in 2008, by secondary accounts this page could not fully verify on AAS's own currently live site. It was an advocacy-group campaign that grew over time, not a single founding act."
      },
      {
        "question": "What is 988, and how is it different from the month itself?",
        "answer": "988 is the three-digit number for the 988 Suicide & Crisis Lifeline, reachable by call or text anywhere in the United States, 24 hours a day. Unlike the month designation, 988 is backed by an actual federal statute: the National Suicide Hotline Designation Act of 2020 passed both the Senate and House and was signed into law on October 17, 2020, with nationwide carrier activation required by July 16, 2022."
      },
      {
        "question": "What do the most recent suicide statistics show in the United States?",
        "answer": "According to the CDC's National Center for Health Statistics, the age-adjusted suicide rate was 14.1 per 100,000 people in 2023, close to the 14.2 rate in 2018, a roughly flat five-year trend rather than a sharp change in either direction. Suicide caused more than 49,300 deaths in 2023 and was the 11th leading cause of death overall. The rate among men, 22.8 per 100,000, was nearly four times the rate among women, 5.9 per 100,000."
      },
      {
        "question": "How does this compare to other awareness months covered on this site?",
        "answer": "It sits in the middle of a spectrum this site has documented across several awareness months. Domestic Violence Awareness Month has an actual one-time federal law behind it (1989's Public Law 101-112, never renewed). ADHD Awareness Month has five consecutive years of agreed-to Senate resolutions (2004-2008) before the practice stopped. Epilepsy Awareness Month has three resolutions across three Congresses, none of which ever reached a vote. Suicide Prevention Month's Senate resolutions have passed twice, not five times, and its House resolutions have never passed at all, closer to epilepsy's record than ADHD's, despite the month's much higher public visibility."
      }
    ],
    "sources": [
      {
        "label": "American Association of Suicidology — About & History (1968 founding, Edwin S. Shneidman)",
        "url": "https://suicidology.org/about/"
      },
      {
        "label": "World Health Organization — World Suicide Prevention Day campaign page",
        "url": "https://www.who.int/campaigns/world-suicide-prevention-day"
      },
      {
        "label": "Wikipedia — National Suicide Prevention Week (secondary source for the 1974/1975 discrepancy)",
        "url": "https://en.wikipedia.org/wiki/National_Suicide_Prevention_Week"
      },
      {
        "label": "S.Res.84 — 105th Congress, 1997, Sen. Harry Reid, \"recognizing suicide as a national problem\" (GovTrack.us)",
        "url": "https://www.govtrack.us/congress/bills/105/sres84"
      },
      {
        "label": "H.Res.850 — 114th Congress, 2016, died without a floor vote (GovTrack.us)",
        "url": "https://www.govtrack.us/congress/bills/114/hres850"
      },
      {
        "label": "S.Res.636 — 115th Congress, 2018, agreed to by unanimous consent (GovTrack.us)",
        "url": "https://www.govtrack.us/congress/bills/115/sres636"
      },
      {
        "label": "H.Res.1067 — 115th Congress, 2018, died without a floor vote (GovTrack.us)",
        "url": "https://www.govtrack.us/congress/bills/115/hres1067"
      },
      {
        "label": "S.Res.738 — 116th Congress, 2020, agreed to by unanimous consent (GovTrack.us)",
        "url": "https://www.govtrack.us/congress/bills/116/sres738"
      },
      {
        "label": "H.Res.1436 — 118th Congress, 2024, died without a floor vote (GovTrack.us)",
        "url": "https://www.govtrack.us/congress/bills/118/hres1436"
      },
      {
        "label": "H.Res.697 and S.Res.385 — 119th Congress, 2025, both stalled at \"introduced\" (GovTrack.us)",
        "url": "https://www.govtrack.us/congress/bills/119/hres697"
      },
      {
        "label": "S.2661 — National Suicide Hotline Designation Act of 2020, Public Law 116-172 (Congress.gov)",
        "url": "https://www.congress.gov/bill/116th-congress/senate-bill/2661"
      },
      {
        "label": "Federal Communications Commission — U.S. Transition to 988 Suicide & Crisis Lifeline",
        "url": "https://www.fcc.gov/document/us-transition-988-suicide-crisis-lifeline-begins-july-16"
      },
      {
        "label": "CDC/NCHS — Suicide Rates Largely Unchanged in 2023, but Still High (September 2025)",
        "url": "https://blogs.cdc.gov/nchs/2025/09/24/7848/"
      },
      {
        "label": "The White House (Biden archive) — A Proclamation on World Suicide Prevention Day, 2024",
        "url": "https://bidenwhitehouse.archives.gov/briefing-room/presidential-actions/2024/09/09/world-suicide-prevention-day-2024/"
      }
    ],
    "image": "/images/suicide-prevention-month-timeline.svg",
    "imageAlt": "Timeline from 1968 to today showing how National Suicide Prevention Month grew from an advocacy group's May awareness week to a September-long observance, with no permanent law behind the month itself"
  },
  {
    "slug": "november-birth-flower",
    "category": "Birth Flowers",
    "title": "November Birth Flower: Chrysanthemum and Peony, a Gift Mistake",
    "description": "November's birth flowers are chrysanthemum and peony, but in France and much of Catholic Europe, chrysanthemums are graveside flowers, not gifts.",
    "published": "2026-08-17",
    "updated": "2026-08-17",
    "coreSummary": "November's birth flowers are the chrysanthemum, whose Greek name literally means \"golden flower\" even though only a handful of modern cultivars are actually gold, and the peony, named for Paeon, physician to the Greek gods. The chrysanthemum carries two separate identities that rarely appear together: Japan's Imperial Seal and highest civilian honor on one side, a graveside flower tied to All Saints' Day across much of Catholic Europe on the other. The peony spent much of its taxonomic history grouped near the buttercup family before molecular studies in the late 1980s moved it into a family of its own, in an order unrelated to buttercups.",
    "sections": [
      {
        "heading": "Chrysanthemum and peony, filling the same gap as every other month",
        "body": [
          "Farmers' Almanac's current chart names chrysanthemum and peony as November's flowers. The Old Farmer's Almanac's own current page, which matches that pairing for August, July, and September, is narrower here: it lists chrysanthemum alone, with no second flower anywhere on the page. This site's [birth flowers by month](/birth-flowers-by-month/) chart covers that same gap alongside a similar one for March. This site's [August birth flower](/august-birth-flower/) page traced why a page like this one keeps landing on two flowers instead of one: unlike birthstones, which the jewelry trade standardized in a single 1912 convention, birth flowers never had one body settle the question. Rival 19th-century floriography guides couldn't agree with each other, and rather than pick a winner, the trade lists that followed kept both.",
          "That gap explains why November has a pair. It doesn't explain much about either flower on its own, and both have more going on than a florist's caption usually mentions."
        ]
      },
      {
        "heading": "Chrysanthemum: a name for gold, on a flower that mostly isn't",
        "body": [
          "Chrysanthemum comes from the Greek khrysanthemon, built from khrysos (\"gold\") and anthemon (\"a flower\"), by way of Latin, according to the Online Etymology Dictionary. The name arrived in English around the 1550s, originally describing a golden-flowered plant related to what English speakers now call the marigold. The irony, as the same source notes, is that the label stuck to a much wider genus, and only a small share of modern chrysanthemum cultivars actually bloom gold; breeders have pushed the color range out to white, purple, pink, orange, and red.",
          "The flower's other identity has nothing to do with color. During Japan's Kamakura period (1185 to 1333), Emperor Go-Toba adopted a stylized chrysanthemum as his personal seal, and custom gradually turned that choice into the emblem of the entire Imperial House, according to Wikipedia's account of the Imperial Seal of Japan. No law ever made it official; it became the imperial crest the same way a habit becomes a tradition, by repetition rather than decree. Emperor Meiji formalized a related honor in 1876, the Supreme Order of the Chrysanthemum, which remains Japan's highest possible award for a private citizen."
        ],
        "image": {
          "src": "/images/november-birth-flower-chrysanthemum.jpg",
          "alt": "Rows of cultivated chrysanthemums in white, yellow, and pink at a Japanese flower show, none of them gold despite the flower's Greek name meaning \"golden flower\"",
          "credit": "Photo by KENPEI, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Chrysanthemum_morifolium_cvs2.jpg), CC BY-SA 3.0"
        }
      },
      {
        "heading": "The color code, and the one place a chrysanthemum bouquet is a mistake",
        "body": [
          "The Old Farmer's Almanac reads the chrysanthemum broadly as loyalty, friendship, and joy, with color carrying a narrower meaning inside that: red for true love, white for innocence and honesty, yellow for a wounded heart or neglected love.",
          "None of that reading travels to France, Belgium, Poland, or several other parts of Catholic Europe, where the chrysanthemum means something closer to the opposite of a birthday gift. The flower is the customary bloom for Toussaint, All Saints' Day, on November 1: families buy pots of chrysanthemums and set them on family graves, a practice tied to the flower's late-autumn bloom window and its ability to survive weeks of cold weather on an unheated grave. Presenting the same flower to a living host, in a bouquet meant as a gift, counts as a breach of etiquette in those countries, not a quaint local quirk. A US-facing birth-flower page has no reason to flag this on its own, except that November's flower and November's funeral custom happen to be the same plant."
        ]
      },
      {
        "heading": "Peony: named for a god's physician, and reclassified out of its old family",
        "body": [
          "Peony traces to the Greek paionia, tied to Paeon, physician to the gods in Greek mythology. One version of the myth, recorded across several classical sources, has Paeon using a peony root to heal Pluto after a battle wound; a jealous Asclepius, his own teacher, then threatens him, and Zeus saves Paeon by turning him into the flower that now carries his name.",
          "The plant's scientific classification moved almost as dramatically as its mythical namesake. For much of the 19th and 20th centuries, botanists grouped Paeonia at or near the buttercup family, Ranunculaceae, on the strength of shared traits like numerous stamens and a similar flower structure. A family name for peonies on its own, Paeoniaceae, existed on paper as early as 1830, credited to Friedrich K. L. Rudolphi, but it didn't displace the Ranunculaceae placement in general use. Molecular phylogenetic studies changed that: by the late 1980s, the genetic evidence had ruled out any close relationship to Ranunculaceae, and current classification under the Angiosperm Phylogeny Group system places Paeoniaceae in the order Saxifragales, not the order that contains buttercups at all.",
          "One more gap: most temperate peonies bloom for a few weeks in late spring, not in November. Florist trade sources that pair it with November tend to say so directly, framing the peony's presence on this month's list as popularity and symbolism carrying more weight than the plant's actual growing season."
        ],
        "image": {
          "src": "/images/november-birth-flower-peony.jpg",
          "alt": "A pink tree peony (Paeonia suffruticosa) in bloom, a genus reclassified out of the buttercup family Ranunculaceae into its own family, Paeoniaceae, in the order Saxifragales",
          "credit": "Photo by Fanghong, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:PaeoniaSuffruticosa7.jpg), CC BY 2.5"
        }
      },
      {
        "heading": "China's \"king of flowers,\" with no law behind the title",
        "body": [
          "China never legislated a national flower, but the peony comes closest to holding the position by custom. During the Tang dynasty, the flower carried the honorary title of \"king of flowers,\" and emperors planted large peony gardens as a display of wealth and power; some historical accounts describe the flower as reserved for royal grounds during that period. The plant still stands for prosperity, honor, and status in Chinese symbolism today. It briefly had something closer to formal status during the Qing dynasty, then lost that informal standing to the plum blossom during the Republic era. Public sentiment still tends to favor the peony over any rival, without either flower ever receiving a legal designation."
        ]
      },
      {
        "heading": "If your birthday falls in Scorpio or Sagittarius",
        "body": [
          "Chrysanthemum and peony cover all of November, but the zodiac sign attached to a November birthday changes partway through the month. In Western tropical astrology, Scorpio runs through around November 21, and Sagittarius picks up the following day; the exact boundary can shift by a day depending on the year and which of several competing systems is used. Readers born in the back half of November, or close enough to the boundary to wonder which side they land on, can check this site's [Scorpio dates](/scorpio-dates/) page for a closer look at why that line moves.",
          "Readers who came here for December instead of November can find this site's [December birthstone](/december-birthstone/) page, covering turquoise, tanzanite, and zircon."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is November's birth flower?",
        "answer": "Chrysanthemum and peony, per Farmers' Almanac's current chart. The Old Farmer's Almanac's own current page names chrysanthemum alone, with no second flower listed. As with most months on a modern birth-flower list, November carries two flowers on most charts, because no single trade body ever issued one official calendar."
      },
      {
        "question": "What does the chrysanthemum mean as a birth flower?",
        "answer": "Loyalty, friendship, and joy in general, with narrower meanings by color: red for true love, white for innocence and honesty, yellow for a wounded heart or neglected love, per The Old Farmer's Almanac."
      },
      {
        "question": "Why is the chrysanthemum connected to Japan's imperial family?",
        "answer": "Emperor Go-Toba adopted a stylized chrysanthemum as his personal seal during the Kamakura period (1185-1333), and custom turned it into the emblem of the Imperial House. Emperor Meiji formalized the Supreme Order of the Chrysanthemum in 1876, still Japan's highest honor for a private citizen."
      },
      {
        "question": "Is it true chrysanthemums are a bad gift in parts of Europe?",
        "answer": "In France, Belgium, Poland, and several other Catholic European countries, yes. The flower is the customary bloom for graves on All Saints' Day, November 1, and giving one as a bouquet to a living host counts as a breach of etiquette, not a minor quirk."
      },
      {
        "question": "What does the peony mean as a birth flower?",
        "answer": "Honor, wealth, romance, and compassion in most modern florist readings, and prosperity and high status specifically in Chinese symbolism, where the flower held the honorary title \"king of flowers\" during the Tang dynasty. The name itself comes from Paeon, physician to the gods in Greek mythology."
      },
      {
        "question": "Is the peony really related to buttercups?",
        "answer": "No, not closely. Botanists grouped peonies near the buttercup family, Ranunculaceae, for much of the 19th and 20th centuries based on shared physical traits, but molecular studies by the late 1980s showed the relationship didn't hold up. Peonies now sit in their own family, Paeoniaceae, within the order Saxifragales, unrelated to the order that contains buttercups."
      },
      {
        "question": "I was born in late November. Is my zodiac sign Scorpio or Sagittarius?",
        "answer": "Depends on the exact date. Scorpio runs through around November 21 in Western tropical astrology, and Sagittarius starts the following day, though the precise boundary can shift by a day depending on the year. This site's Scorpio dates page walks through why."
      }
    ],
    "sources": [
      {
        "label": "The Old Farmer's Almanac — November Birth Flower: The Chrysanthemum",
        "url": "https://www.almanac.com/november-birth-flower"
      },
      {
        "label": "Farmers' Almanac — Birth Flower Chart: All 12 Birth Flowers by Month",
        "url": "https://www.farmersalmanac.com/birth-month-flowers-how-to-plant-a-family-garden"
      },
      {
        "label": "Online Etymology Dictionary — Chrysanthemum",
        "url": "https://www.etymonline.com/word/chrysanthemum"
      },
      {
        "label": "Wikipedia — Imperial Seal of Japan",
        "url": "https://en.wikipedia.org/wiki/Imperial_Seal_of_Japan"
      },
      {
        "label": "Wikipedia — Order of the Chrysanthemum",
        "url": "https://en.wikipedia.org/wiki/Order_of_the_Chrysanthemum"
      },
      {
        "label": "Blooming Expert — Chrysanthemum Meaning: Funeral Flower in Europe and the Emperor's Seal in Japan",
        "url": "https://www.bloomingexpert.com/flower-meaning/chrysanthemum/"
      },
      {
        "label": "Merriam-Webster — Paeonia",
        "url": "https://www.merriam-webster.com/dictionary/Paeonia"
      },
      {
        "label": "Wikipedia — Peony",
        "url": "https://en.wikipedia.org/wiki/Peony"
      },
      {
        "label": "Britannica — Saxifragales",
        "url": "https://www.britannica.com/plant/Saxifragales"
      },
      {
        "label": "iWeiYi — Peonies and Prosperity: Why Peonies Hold Special Meaning in China",
        "url": "https://www.iweiyi.com/en/peonies-and-prosperity-why-peonies-hold-special-meaning-in-china.htm"
      }
    ],
    "image": "/images/november-birth-flower-chrysanthemum.jpg",
    "imageAlt": "Rows of cultivated chrysanthemums in white, yellow, and pink at a Japanese flower show, none of them gold despite the flower's Greek name meaning \"golden flower\"",
    "imageCredit": "Photo by KENPEI, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Chrysanthemum_morifolium_cvs2.jpg), CC BY-SA 3.0"
  },
  {
    "slug": "october-birth-flower",
    "category": "Birth Flowers",
    "title": "October Birth Flower: Marigold and Cosmos, Borrowed Names",
    "description": "October's birth flowers are marigold and cosmos, but the marigold's English name already belonged to a different, unrelated European flower first.",
    "published": "2026-08-17",
    "updated": "2026-08-17",
    "coreSummary": "October's birth flowers are marigold and cosmos, per The Old Farmer's Almanac. The English word marigold originally named a different, unrelated European plant, Calendula officinalis, tied to medieval offerings at Virgin Mary shrines; Spanish explorers in Mexico later applied the same name to the visually similar Tagetes, which eclipsed Calendula in everyday English use after reaching England in the late 1500s. Two of the marigold's own common names, French marigold and African marigold, are geographic misnomers for a plant native only to Mexico and Central America. Cosmos was named in 1791 by Spanish botanist Antonio José Cavanilles, from the Greek kosmos for order and ornament, describing a flower also native to Mexico.",
    "sections": [
      {
        "heading": "Marigold and cosmos, and why October needed two",
        "body": [
          "October's flowers, per The Old Farmer's Almanac, are marigold and cosmos. July, August, September, and November, the other months already covered on this site, each carry two flowers apiece rather than one, and the reason keeps repeating: unlike birthstones, which the American jewelry trade standardized in a single 1912 list, no single body ever settled birth flowers. Competing 19th-century floriography guides assigned different blooms to the same month, and the trade lists that survived kept more than one entry instead of picking a winner.",
          "Neither flower's own backstory follows from that gap, though, and both marigold and cosmos turn out to carry a specific twist that a florist's caption tends to leave out. Start with the word \"marigold\" itself: it was, technically, already taken."
        ]
      },
      {
        "heading": "The Aztec name, and an English name borrowed from someone else's flower",
        "body": [
          "In Nahuatl, the flower now sold as October's marigold was called cempoalxóchitl, from cempoal(li), \"twenty,\" and xóchitl, \"flower.\" According to research by scholar Doris Heyden cited by the education group Mexicolore, the plant appears more often than almost any other flower in chronicles of ancient Mexico, was cultivated in home gardens and orchards, and was used in ceremonies and medicine tied to Tlaloc, the rain and agriculture deity. A separate, often-repeated legend, not verified history, credits the flower's color to Tonatiuh, the sun god: two lovers, Xochitl and Huitzilin, climb his mountain to bring an offering; Huitzilin dies in battle; a grieving Xochitl asks to be reunited with him, and Tonatiuh turns her into a golden flower that a hummingbird then opens with a landing.",
          "The English word marigold, meanwhile, had already been attached to a different plant for over a century before Spanish explorers ever reached Mexico. Marigold traces to \"marygolde\" in late-14th-century English, a contraction of Mary's gold, according to the Online Etymology Dictionary. The story behind that name, recorded by the University of Dayton's Marian research institute, involves medieval Europeans placing bright golden flowers at Virgin Mary shrines and statues when they couldn't afford real gold offerings. The flower in that story was Calendula officinalis, native to southern Europe, not the Mexican plant now assigned to October.",
          "When Spanish colonists in Mexico encountered Tagetes, its bright orange blooms reminded them of Calendula, and they extended the familiar name to the new plant. Tagetes grew easily and caught on fast once it reached England in the late 16th century, popular enough that it eventually eclipsed Calendula in everyday use of the unqualified word \"marigold.\" The original plant needed a qualifier of its own afterward, and still carries one: pot marigold."
        ],
        "image": {
          "src": "/images/october-birth-flower-marigold.jpg",
          "alt": "A French marigold (Tagetes patula) in full bloom, a Mexican-native plant whose English name was borrowed from the unrelated European flower Calendula",
          "credit": "Photo by Jim Evans, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:French_Marigold_--_October_Birthday_Flower_--_Tagetes_patula.jpg), CC BY-SA 4.0"
        }
      },
      {
        "heading": "Two more borrowed names: French marigold, African marigold",
        "body": [
          "The naming confusion doesn't stop at \"marigold.\" Tagetes patula carries the common name French marigold, and Tagetes erecta carries African marigold, alongside Aztec marigold and Mexican marigold, according to Wikipedia's entries for both species. Neither plant is native to France or Africa; both trace back to Mexico and Central America, the same region as cempoalxóchitl's Nahuatl origin. The African name is generally traced to the plant's path into wider European cultivation by way of North Africa, not to any wild population growing there.",
          "That leaves the flower carrying four common names, marigold, French marigold, African marigold, and Aztec marigold, and only the last one describes where the plant actually grows wild."
        ]
      },
      {
        "heading": "Marigold and Día de los Muertos",
        "body": [
          "The Old Farmer's Almanac reads the marigold as a symbol of stubbornness and determination, with its bright color standing for warmth, passion, and creativity. The flower's best-known modern role goes beyond a florist's color chart: cempasúchil, as it's called in modern Spanish, is a prominent fixture of Día de los Muertos, used to decorate gravesites and build home altars across Mexico and Mexican communities elsewhere. Families commonly describe the flower's strong scent and color as a way of guiding the spirits of the dead back to the offerings left for them, a belief tied to celebration rather than a claim this page can verify.",
          "That modern practice sits on top of the older ceremonial use Heyden's research documents, rather than starting from nothing. The specific belief about guiding spirits is a living cultural tradition, not a documented pre-Hispanic record, and this page treats it as such."
        ]
      },
      {
        "heading": "Cosmos: a Spanish botanist's word for cosmic order",
        "body": [
          "Cosmos as a plant genus dates to 1791, established by Spanish botanist Antonio José Cavanilles from specimens collected in Mexico, with Cosmos bipinnatus as the type species. Some florist and gardening sites give 1797 for this naming, but the original publication citation preserved in taxonomic reference databases such as World Flora Online points to 1791. Cavanilles took the name from the Greek kosmos, meaning order, ornament, or the universe, the same root behind the English word cosmos for the study of the universe as an ordered whole.",
          "The name is usually credited to the flower's shape: most cosmos cultivars display eight ray florets, evenly spaced around a central disc in close to perfect radial symmetry, a pattern several botanical references single out as the plant's most identifiable trait. Cosmos, like marigold, is native to Mexico, so October's two birth flowers share a continent of origin even though they entered European garden literature by very different routes: one folk name attached by visual resemblance to an unrelated plant, the other a formal Latin genus name coined outright by a working botanist. The Old Farmer's Almanac reads cosmos as a symbol of order, balance, peace, and innocence, with a secondary association with luck."
        ],
        "image": {
          "src": "/images/october-birth-flower-cosmos.jpg",
          "alt": "A pink Cosmos bipinnatus flower showing the eight evenly spaced ray florets that likely inspired its Greek name, kosmos, meaning order or ornament",
          "credit": "Photo by Hugo.arg, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:CosmosBipinnatus002.JPG), CC BY-SA 3.0"
        }
      },
      {
        "heading": "If your birthday falls in Libra or Scorpio",
        "body": [
          "October births split across two zodiac signs. In Western tropical astrology, Libra runs from roughly September 23 to October 22, and Scorpio picks up around October 23 and continues to November 21, though as this site's [Scorpio dates](/scorpio-dates/) page documents, that exact boundary shifts by a day depending on the year and which reference is doing the counting. Readers born in the back half of the month can check that page for a closer look at why the line moves.",
          "Readers who came here for a neighboring month can find [September's birth flower](/september-birth-flower/), aster and morning glory, or [November's](/november-birth-flower/), chrysanthemum and peony. Readers after October's birthstone instead of its flower can check this site's [birthstones by month](/birthstones-by-month/) page."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is October's birth flower?",
        "answer": "Marigold and cosmos, per The Old Farmer's Almanac. October is one of several months on this site's calendar with two flowers instead of one, a gap that traces back to competing 19th-century floriography guides that never agreed on a single list."
      },
      {
        "question": "What does the marigold mean as a birth flower?",
        "answer": "Stubbornness and determination in general, with its bright color read as warmth, passion, and creativity, per The Old Farmer's Almanac. It's also central to Día de los Muertos, decorating gravesites and home altars across Mexico."
      },
      {
        "question": "Is \"marigold\" originally the name of a different flower?",
        "answer": "Yes. The English word marigold, a contraction of \"Mary's gold,\" originally named Calendula officinalis, a European flower tied to medieval offerings at Virgin Mary shrines. Spanish explorers later applied the same name to the visually similar Tagetes they found in Mexico, and Tagetes eventually eclipsed Calendula in everyday use of the word after reaching England in the late 1500s."
      },
      {
        "question": "Why are French marigold and African marigold not actually from France or Africa?",
        "answer": "Both Tagetes patula (French marigold) and Tagetes erecta (African marigold) are native to Mexico and Central America, per Wikipedia. The African name is generally traced to the plant's path into European cultivation by way of North Africa, not to any wild population there; the French name reflects a similar accident of how the plant spread through Europe rather than where it grows."
      },
      {
        "question": "What is the connection between marigolds and Día de los Muertos?",
        "answer": "Marigolds, called cempasúchil in Spanish, are a prominent fixture of the holiday, used to decorate gravesites and build home altars. Families commonly describe the flower's scent and color as a way of guiding the spirits of the dead back to the offerings left for them. The flower's ceremonial use in Mexico predates the modern holiday, appearing throughout chronicles of ancient Mexico under its Nahuatl name, cempoalxóchitl."
      },
      {
        "question": "What does the cosmos flower mean, and where does its name come from?",
        "answer": "The Old Farmer's Almanac reads cosmos as order, balance, peace, and innocence, with a secondary association with luck. The name comes from the Greek kosmos, meaning order or ornament, chosen in 1791 by Spanish botanist Antonio José Cavanilles, likely for the flower's evenly spaced, symmetrical ray florets."
      },
      {
        "question": "I was born in early October. Is my zodiac sign Libra or Scorpio?",
        "answer": "Likely Libra, which runs from roughly September 23 to October 22 in Western tropical astrology. Scorpio picks up around October 23. Readers born close to that boundary can check this site's Scorpio dates page, since the exact day shifts depending on the year and reference used."
      }
    ],
    "sources": [
      {
        "label": "The Old Farmer's Almanac — October Birth Flowers: Marigold and Cosmos",
        "url": "https://www.almanac.com/october-birth-flowers"
      },
      {
        "label": "Online Etymology Dictionary — Marigold",
        "url": "https://www.etymonline.com/word/marigold"
      },
      {
        "label": "University of Dayton, Marian Library — Marigolds: Mary's Gold",
        "url": "https://udayton.edu/imri/mary/m/marigolds-marys-gold.php"
      },
      {
        "label": "Mexicolore — Cempoalxóchitl",
        "url": "https://www.mexicolore.co.uk/aztecs/flora-and-fauna/cempoalxochitl"
      },
      {
        "label": "Wikipedia — Tagetes erecta (African marigold)",
        "url": "https://en.wikipedia.org/wiki/Tagetes_erecta"
      },
      {
        "label": "Wikipedia — Tagetes patula (French marigold)",
        "url": "https://en.wikipedia.org/wiki/Tagetes_patula"
      },
      {
        "label": "World Flora Online — Cosmos Cav.",
        "url": "https://www.worldfloraonline.org/taxon/wfo-4000009452"
      },
      {
        "label": "Illinois Wildflowers — Common Cosmos (Cosmos bipinnatus)",
        "url": "https://www.illinoiswildflowers.info/weeds/plants/cosmos.html"
      },
      {
        "label": "Blooming Expert — Cosmos Flower Meaning",
        "url": "https://www.bloomingexpert.com/flower-meaning/cosmos/"
      }
    ],
    "image": "/images/october-birth-flower-marigold.jpg",
    "imageAlt": "A French marigold (Tagetes patula) in full bloom, a Mexican-native plant whose English name was borrowed from the unrelated European flower Calendula",
    "imageCredit": "Photo by Jim Evans, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:French_Marigold_--_October_Birthday_Flower_--_Tagetes_patula.jpg), CC BY-SA 4.0"
  },
  {
    "slug": "world-kindness-day",
    "category": "Observances",
    "title": "World Kindness Day: November 13, and Singapore's Other 1997",
    "description": "World Kindness Day falls every November 13, launched in 1998 by a 1997 Tokyo coalition. Singapore's own kindness group, founded the same year, is unrelated.",
    "published": "2026-08-17",
    "updated": "2026-08-17",
    "coreSummary": "World Kindness Day is observed every November 13, first held in 1998 by the World Kindness Movement, a coalition of national kindness organizations that formed at a conference in Tokyo in 1997 around Japan's Small Kindness Movement. A second organization with a nearly identical name and the same 1997 founding year, the Singapore Kindness Movement, is Singapore's own civic body and unrelated in origin; it went on to serve as the World Kindness Movement's secretariat from 2003 to 2012, even though Wikipedia dates Singapore's own first observance of the day itself to 2009. No United Nations body has designated the day, unlike International Women's Day; the World Kindness Movement's US affiliate says it is still lobbying for that recognition. Australia offers the clearest case of formal government backing found here: a 2012 Declaration of Support from the federal Minister for School Education placed the day on the National School Calendar for more than 9,000 schools.",
    "dateRule": {
      "kind": "fixed",
      "text": "November 13 every year, worldwide. The date is fixed and does not shift for weekends.",
      "status": "conventional",
      "source": {
        "label": "World Kindness Day — Wikipedia",
        "url": "https://en.wikipedia.org/wiki/World_Kindness_Day"
      },
      "occurrences": [
        { "date": "2026-11-13", "weekday": "Friday" },
        { "date": "2027-11-13", "weekday": "Saturday" },
        { "date": "2028-11-13", "weekday": "Monday" },
        { "date": "2029-11-13", "weekday": "Tuesday" },
        { "date": "2030-11-13", "weekday": "Wednesday" },
        { "date": "2031-11-13", "weekday": "Thursday" }
      ]
    },
    "founding": {
      "status": "documented",
      "text": "World Kindness Day has no single named founder; it was launched by the World Kindness Movement, a coalition of national kindness organizations that took shape at a conference in Tokyo in 1997, convened around Japan's Small Kindness Movement and joined by associations from countries including Australia, Thailand, the United Kingdom and the United States. The World Kindness Movement's US affiliate names its own founder among that founding group: Will Glennon, who also founded the Random Acts of Kindness organization. The coalition held the first World Kindness Day on November 13, 1998. A separate organization founded the very same year, the Singapore Kindness Movement, is often folded into this same origin story; it is in fact Singapore's own civic body, registered as a nonprofit society on January 31, 1997, as successor to the Singapore Courtesy Council, which had overseen the National Courtesy Campaign since its 1979 launch, at the urging of then-Prime Minister Goh Chok Tong. The Singapore Kindness Movement went on to serve as the World Kindness Movement's secretariat from 2003 to 2012, coordinating the international coalition for nearly a decade, yet Wikipedia's own account dates Singapore's first observance of World Kindness Day itself to 2009, not to the movement's 1997 or 1998 founding years. In the United Kingdom, the observance is fronted as Kindness Day UK, co-founded by David Jamilly and Louise Burfitt-Dons. How many national organizations currently belong to the World Kindness Movement is not settled: secondary accounts checked for this page put the figure anywhere from 24 to 33 countries, a range wide enough that this page does not repeat any single count as definitive.",
      "source": {
        "label": "About Us — The World Kindness USA (Tokyo 1997 founding, Will Glennon)",
        "url": "https://theworldkindnessusa.org/about-us"
      }
    },
    "sections": [
      {
        "heading": "An NGO coalition sets this date, not a government",
        "body": [
          "World Kindness Day did not arrive through an act of any national legislature or a United Nations resolution. It exists because a group of nongovernmental kindness organizations, meeting in Tokyo in 1997, agreed to hold one, and then did — for the first time on November 13, 1998. That origin sets it apart from observances this calendar has covered that trace to a specific statute, such as [National Grandparents Day](/national-grandparents-day/), which exists because Congress passed Public Law 96-62 in 1979.",
          "That difference matters for what the date can and cannot claim. There is no codified text anywhere that \"designates\" November 13 the way 36 U.S.C. § 125 designates the first Sunday after Labor Day for grandparents. The date holds because the World Kindness Movement and its member organizations have kept observing it every year since 1998, and because schools, charities and, in a few cases, national governments have chosen to adopt it. It is a convention with three decades of consistent use behind it, not a legal designation."
        ]
      },
      {
        "heading": "Two organizations, one shared founding year",
        "body": [
          "The most-repeated detail about World Kindness Day's history is that it traces to a 1997 Tokyo conference. What gets left out of most retellings is that a second, entirely separate organization was founded that same year, under a nearly identical name, and later became deeply entangled with the first.",
          "The Singapore Kindness Movement is a Singaporean nonprofit, registered as a society on January 31, 1997. It did not originate at the Tokyo conference. It succeeded the Singapore Courtesy Council, which had run a National Courtesy Campaign since its 1979 launch, and was relaunched at the start of 1997 after then-Prime Minister Goh Chok Tong called, in his 1996 New Year address, for Singapore to complement its economic development with social and cultural development. Roughly 80,000 secondary school students took part in the relaunch.",
          "The two organizations' paths crossed repeatedly after that, at three separate points that are easy to blur into one. Kind Canada, a member organization, states that the World Kindness Movement was itself \"officially launched\" in Singapore on November 18, 2000, three years after the founding Tokyo conference and two years after the first World Kindness Day. From 2003 to 2012, the Singapore Kindness Movement then served as secretariat for the World Kindness Movement, handling coordination for the international coalition for nearly a decade. Yet Wikipedia's own article on World Kindness Day states plainly that Singapore observed the day itself for the first time only in 2009, six years into that nine-year secretariat term and nine years after the Movement's 2000 launch event there. Hosting the movement's launch event, running its coalition affairs, and marking the day on its own calendar turn out to be three different milestones for Singapore, spread across a decade, and most calendar listings that mention Singapore at all collapse them into one."
        ]
      },
      {
        "heading": "How the day picked up formal government backing",
        "body": [
          "Most of World Kindness Day's spread has happened informally, through schools, charities, and workplace campaigns rather than legislation. Australia is the clearest documented exception found for this page, and it took several separate steps over roughly a decade to get there.",
          "The paper trail starts in 2010, when the New South Wales Federation of Parents and Citizens Associations, acting at the request of an individual named Michael Lloyd-White, wrote to the state's Minister of Education asking that World Kindness Day be placed on the NSW School Calendar. Two years later, in 2012, the Chairman of World Kindness Australia took the request to the federal level. Peter Garrett, then federal Minister for School Education, Early Childhood and Youth, signed a Declaration of Support for World Kindness Australia, which placed the day on the National School Calendar for more than 9,000 schools. That same year, Marie Bashir, then Governor of New South Wales, hosted the first Government House event marking the day, accepting a \"Cool To Be Kind\" award from year 3 and 4 students.",
          "Beyond Australia, adoption has generally stayed civic rather than statutory. In the United Kingdom, David Jamilly and Louise Burfitt-Dons run the day as Kindness Day UK. In Canada, it is marked with a Kindness Concert. In 2017, the Slovenian volunteer organization Humanitarček brought the observance to Slovenia through its own Randomised Kindness project. None of these involve the kind of national legislation this calendar found behind, for instance, [Domestic Violence Awareness Month](/domestic-violence-awareness-month/)'s one-year 1989 congressional designation."
        ],
        "image": {
          "src": "/images/world-kindness-day-timeline.svg",
          "alt": "Timeline showing World Kindness Day's history: a 1997 Tokyo conference forms the World Kindness Movement while Singapore separately registers its own Singapore Kindness Movement the same year; the first World Kindness Day is held in 1998; Singapore serves as the Movement's secretariat from 2003 to 2012 despite Wikipedia dating its own first observance to 2009; Australia adds the day to its National School Calendar in 2012; Slovenia's Humanitarček joins in 2017"
        }
      },
      {
        "heading": "Not a United Nations day, despite the name",
        "body": [
          "\"World\" in the title invites an assumption that a body like the United Nations stands behind it, the way the UN designates International Women's Day or International Day of Peace. No UN resolution or proclamation naming World Kindness Day turned up in researching this page. This calendar's page on [International Men's Day](/international-mens-day/) documents the same gap for a different observance: a global-sounding name with no UN action attached, and, in that case, exactly one country, Romania, that has given the date the force of national law.",
          "The World Kindness Movement's US affiliate states this goal directly on its own site, listing among its objectives advocacy \"for the US government to co-sponsor a motion at the United Nations General Assembly, encouraging all member nations to unanimously sign a Declaration of Support for a Kinder World.\" That an advocacy group is still working toward UN recognition is itself evidence the recognition has not yet arrived."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is World Kindness Day?",
        "answer": "Every November 13, worldwide. It is a fixed calendar date and does not move for weekends or shift year to year."
      },
      {
        "question": "Who started World Kindness Day?",
        "answer": "The World Kindness Movement, a coalition of national kindness organizations that formed at a conference in Tokyo in 1997, organized around Japan's Small Kindness Movement and joined by groups from Australia, Thailand, the United Kingdom, the United States and other countries. There is no single named founder of the day itself; it was a group decision by the coalition, which held the first World Kindness Day on November 13, 1998."
      },
      {
        "question": "Is the Singapore Kindness Movement the same organization as the World Kindness Movement?",
        "answer": "No, despite the near-identical name and shared founding year. The Singapore Kindness Movement is Singapore's own civic body, registered as a nonprofit society on January 31, 1997, as successor to the Singapore Courtesy Council that had run the National Courtesy Campaign since its 1979 launch. It later served as the World Kindness Movement's secretariat from 2003 to 2012, but Wikipedia's own account dates Singapore's first observance of World Kindness Day itself to 2009."
      },
      {
        "question": "Is World Kindness Day recognized by the United Nations?",
        "answer": "No. No UN resolution or proclamation designating World Kindness Day was found in researching this page. The World Kindness Movement's US affiliate states on its own site that it is still advocating for the US government to co-sponsor a UN General Assembly motion in support of the day, which indicates that recognition has not yet been secured."
      },
      {
        "question": "Is World Kindness Day a public holiday?",
        "answer": "No source checked for this page describes it as a paid public holiday anywhere. It is an observance carried mainly through schools, nonprofits and workplace campaigns rather than a day off work. Australia is the clearest exception found here on the government-backing side: a 2012 Ministerial Declaration of Support placed the day on the National School Calendar for over 9,000 schools, though that places it on a school events calendar, not among Australia's public holidays."
      },
      {
        "question": "Which countries officially observe World Kindness Day?",
        "answer": "There is no single authoritative list. The World Kindness Movement's member organizations span a range secondary sources put anywhere from 24 to 33 countries, depending on the source and when the count was taken, so this page does not repeat any one figure as settled. Countries with documented, organized observances include Australia (via a 2012 federal Declaration of Support and the National School Calendar), the United Kingdom (Kindness Day UK), Canada, Singapore, and, since 2017, Slovenia."
      }
    ],
    "sources": [
      {
        "label": "World Kindness Day — Wikipedia",
        "url": "https://en.wikipedia.org/wiki/World_Kindness_Day"
      },
      {
        "label": "Singapore Kindness Movement — Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Singapore_Kindness_Movement"
      },
      {
        "label": "About Us — The World Kindness USA (founding member, objectives, UN advocacy)",
        "url": "https://theworldkindnessusa.org/about-us"
      },
      {
        "label": "World Kindness Day 2025: How do you show kindness? — BBC Newsround",
        "url": "https://www.bbc.co.uk/newsround/articles/c20eyp0e39yo"
      },
      {
        "label": "World Kindness Movement — Kind Canada / International Kindness Day",
        "url": "https://www.internationalkindnessday.org/world-kindness-movement"
      },
      {
        "label": "Gulf News readers celebrate World Kindness Day (2009 coverage)",
        "url": "https://gulfnews.com/news/uae/general/gulf-news-readers-celebrate-world-kindness-day-1.526824"
      },
      {
        "label": "World Kindness Day - 13 November Annually — Carevan Wangaratta (Slovenia 2017 detail)",
        "url": "https://www.carevanwangaratta.org.au/blog/world-kindness-day-13-november-annually"
      }
    ],
    "image": "/images/world-kindness-day-timeline.svg",
    "imageAlt": "Timeline showing World Kindness Day's history: a 1997 Tokyo conference forms the World Kindness Movement while Singapore separately registers its own Singapore Kindness Movement the same year; the first World Kindness Day is held in 1998; Singapore serves as the Movement's secretariat from 2003 to 2012 despite Wikipedia dating its own first observance to 2009; Australia adds the day to its National School Calendar in 2012; Slovenia's Humanitarček joins in 2017"
  },
  {
    "slug": "anniversary-gifts-by-year",
    "category": "Anniversaries",
    "title": "Anniversary Gifts by Year: Two Lists That Never Agreed",
    "description": "Two anniversary gift lists, a materials list and a jointly endorsed gemstone list, disagree on nearly every year from 1 through 24, then start matching at 25.",
    "published": "2026-08-17",
    "updated": "2026-08-17",
    "coreSummary": "Anniversary gifts run on two separate systems that were never built to reconcile: a materials list assembled piecemeal since the 1500s and filled in by a jewelers' trade group in 1937, and a gemstone list several jewelry associations jointly endorse but none of them solely owns. Checked side by side against each list's own current source, the two disagree on nearly every year from 1 through 24, then start matching at 25 because the traditional list had already assigned precious metals and gems to its milestone years.",
    "sections": [
      {
        "heading": "Two lists, not one, and they don't answer the same question",
        "body": [
          "Look up \"anniversary gifts by year\" on ten different sites and most present a single tidy chart, no footnote about where it came from, as if one committee somewhere assigned a lifetime of household objects to a lifetime of marriages. There are actually two separate charts in wide circulation, built for different purposes by different people, and they were never meant to reconcile. One is a list of materials: paper, cotton, leather, wood, tin, climbing eventually to silver, gold, and diamond. The other is a list of gemstones: garnet, sapphire, ruby, emerald, assigned to the same years but chosen for an entirely different reason. Nothing forces the two into agreement, and for most of the first two and a half decades of marriage, they don't agree at all.",
          "A third, shorter list assigns a flower to each year instead. It only covers years up to the fiftieth and gets far less attention than the other two, sourced by florist and lifestyle publications rather than any jewelry trade group. It exists for the same underlying reason the other two do: nobody publishing these lists claims sole authority over them, and nothing stops a new version from appearing tomorrow."
        ]
      },
      {
        "heading": "A German custom that reached English print by the 1850s",
        "body": [
          "The earliest documented version of this custom has nothing to do with jewelers or retailers. In German-speaking regions, couples were marking a 25th anniversary with a silver wreath and a 50th with a gold one as far back as the 1500s, according to Swiss folklore scholarship cited in the standard reference on the custom's history. The idea didn't spread into English-speaking countries with any real frequency until the 19th century, and it arrived as a much shorter list than the one couples use today: paper recommended for the first year, wood for the fifth, tin for the tenth, according to the historian Stephanie Coontz's history of marriage. The earliest print appearance found for this shorter list is an 1858 edition of Robert B. Thomas's The (Old) Farmer's Almanack, which references the fifth-year \"wooden wedding\" by name.",
          "Even then, most years had nothing assigned to them. By the early 1900s a home-reference book was recommending straw for the second year, candy for the third, leather for the fourth, flowers for the seventh, linen for the twelfth, crystal for the fifteenth, and china for the twentieth, a patchwork that filled some gaps while leaving others, including the sixth, ninth, eleventh, and thirteenth through nineteenth years, unaddressed."
        ]
      },
      {
        "heading": "1937: a jewelers' trade group fills in what was left blank",
        "body": [
          "Before 1937, only eight anniversaries carried any generally recognized material: the first, fifth, tenth, fifteenth, twentieth, twenty-fifth, fiftieth, and seventy-fifth. That year, the American National Retail Jewelers Association, the trade group that later merged into what is now Jewelers of America, published an expanded list assigning a material to every year from the first through the twentieth and then to every fifth year after that, according to the compiled history behind Wikipedia's own sourced entry on the custom. Jewelers of America's own current \"About\" page confirms the organization was founded in 1906, though its present materials don't revisit the 1937 expansion by name.",
          "The motive wasn't sentimental. A trade association filling in a gift list, one purchasable item at a time, for an occasion that recurs every single year of a marriage, is by definition a commercial project. That doesn't make the resulting list fake or the customs built on it meaningless. It does mean the list was never handed down by a government body, a religious authority, or a single named founder, the same gap [this calendar's own page on National Boyfriend Day](/national-boyfriend-day/) found behind a different kind of unofficial calendar entry."
        ]
      },
      {
        "heading": "The US list and the UK list don't match either",
        "body": [
          "Even within the \"traditional\" materials list, there isn't one single version. Wikipedia's own comparison table, sourced separately to a Chicago Public Library reference guide for the US column and the 1978-79 edition of Pears Cyclopaedia for the UK column, shows the two national lists naming entirely non-overlapping materials, no shared word at all, for three of the first nine years: the fourth (fruit and flowers in the US, linen or silk in the UK), the sixth (iron in the US, sugar in the UK), and the ninth (pottery in the US, copper in the UK). Four more of those nine years overlap only partway. The first anniversary is paper in the US and \"cotton or paper\" in the UK. The second is cotton in the US and \"paper or cotton\" in the UK. The seventh is wool and copper in the US against wool alone in the UK. The eighth is bronze in the US against \"bronze, salt\" in the UK. Only the third year (leather) and the fifth (wood) are worded identically on both lists.",
          "The US list also names materials for the eleventh, thirteenth, and fourteenth years, steel, lace, and ivory respectively, where the cited edition of the UK list leaves those years blank. The UK list, in turn, names materials for the sixty-fifth, seventieth, and eightieth years, blue sapphire, platinum, and oak, that don't appear on the US side at all. Both charts agree at the third year (leather) and the fifth (wood), then again continuously from the fifteenth (crystal) through the sixtieth (diamond), but that run of agreement covers barely half the years either list actually assigns."
        ]
      },
      {
        "heading": "The gemstone list has several endorsers and no sole author",
        "body": [
          "The second major system, the one assigning gemstones rather than household materials, developed later and separately from the materials list, and no single trade body claims to have authored it alone. Jewelers of America's own current buying guide, checked directly for this page, describes the version it publishes as \"the official jewelry anniversary list, endorsed by Jewelers of America and other jewelry organizations,\" language that names a shared endorsement without naming every endorser or dating when the list first appeared. [This calendar's own chart of official birthstones by month](/birthstones-by-month/) found the same kind of multi-organization tangle on the birthstone side of the same jewelry trade, where a chart revised more than once by different bodies still isn't treated as any single organization's sole property.",
          "Checked directly against Jewelers of America's own live chart, the gemstone list gives the first year gold jewelry, the second garnet, the third pearl, the fourth blue topaz, the fifth sapphire, the sixth amethyst, the seventh onyx, the eighth tourmaline, the ninth lapis lazuli, and the tenth diamond. None of those ten years match the traditional materials list for the same year. Paper isn't gold. Cotton isn't garnet. Wood isn't sapphire. The two systems were built to answer different questions, and it shows."
        ]
      },
      {
        "heading": "Where the two lists suddenly agree",
        "body": [
          "The disagreement doesn't hold at every year. Checked side by side, Jewelers of America's gemstone chart and the traditional materials list actually match at the twenty-fifth (silver), thirtieth (pearl), fortieth (ruby), forty-fifth (sapphire), fiftieth (gold), and sixtieth (diamond) anniversaries. They diverge again at the thirty-fifth, where the traditional list calls for coral and the gemstone list calls for emerald, and at the fifty-fifth, where the traditional list calls for emerald and the gemstone list moves to alexandrite instead. Emerald itself doesn't disappear between the two lists; it simply moves from the fifty-fifth year on the traditional list to the thirty-fifth year on the gemstone list, arriving twenty years earlier.",
          "The pattern isn't a coincidence so much as an artifact of how the two lists were built. The traditional list had already assigned precious metals and gemstones to most of its milestone years, silver at 25, gold at 50, diamond at 60, because those were genuinely the most valuable materials a 19th-century household could imagine giving. When a 20th-century jewelry trade built a gemstone list decades later, it had no reason to replace a milestone year that was already a gemstone. The two systems only visibly compete in the earlier years, where the traditional list was still assigning paper, wood, and tin and the newer list substituted a gem regardless of what came before it."
        ]
      },
      {
        "heading": "The one recognition that's genuinely official, and it isn't a gift",
        "body": [
          "None of the lists above carry any government backing. The recognition that does exist works completely differently, and starts on its own separate schedule. Buckingham Palace's Anniversaries Office, continuing what its own page describes as a tradition dating to 1917, sends a message from the monarch for diamond (60th), 65th, and 70th wedding anniversaries and every year after that, to citizens of the Commonwealth realms. Australia's Governor-General sends a message starting at the 50th anniversary and again at the 60th, 65th, 70th, and every subsequent year, per the Governor-General's own current page. Canada's Governor-General sends one starting at 50 years married, on a five-year cadence through the 65th, then every year starting at the 70th, per the Governor-General's own site. In the United States, the White House's own current greeting request form, checked directly for this page, offers three wedding-anniversary categories, 25th, 50th, and 51+, with the exact number of years married entered separately, and that 25th-anniversary option is earlier than the 50th-anniversary threshold commonly repeated online. That's a genuine government program, closer in kind to the actual congressional resolutions [this calendar's own page on Breast Cancer Awareness Month](/breast-cancer-awareness-month/) traced through several specific years than to anything on the gift lists above.",
          "That timing gap is still real even counting the earliest of these. A couple's first anniversary already has an assigned material (paper), an assigned gemstone (gold jewelry), and, depending which chart is consulted, an assigned flower (the carnation). The earliest formal government recognition found for this page, the White House's own 25th-anniversary greeting category, doesn't arrive for another 24 years. The UK, Australian, and Canadian programs run decades later still. The lists that assign something to year one were built by an almanac, a trade association, and a handful of florist and lifestyle publications. The recognition that eventually arrives comes from a completely different, much slower-moving set of institutions."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is the official gift for a wedding anniversary?",
        "answer": "There isn't a single official answer. Two separate systems are in wide use: a traditional materials list (paper, cotton, leather, and so on) that a jewelers' trade group expanded in 1937, and a modern gemstone list jointly endorsed by several jewelry associations but owned by none of them. Checked side by side, the two disagree on every year from 1 through 24 and largely agree from 25 through 60."
      },
      {
        "question": "Who decided the anniversary gift list?",
        "answer": "No government body or single founder did. The materials list traces to a German wreath custom documented since the 1500s, was picked up piecemeal in 19th-century English-speaking countries, and was filled in for most years by the American National Retail Jewelers Association, now Jewelers of America, in 1937. The gemstone list came later from the jewelry trade and, per Jewelers of America's own current page, is endorsed by Jewelers of America \"and other jewelry organizations\" rather than authored by one."
      },
      {
        "question": "Is the UK anniversary gift list the same as the US list?",
        "answer": "No. Per the sourced comparison published on Wikipedia, the two lists name entirely non-overlapping materials for the 4th, 6th, and 9th years (fruit and flowers vs. linen and silk; iron vs. sugar; pottery vs. copper) and only partly overlapping materials for the 1st, 2nd, 7th, and 8th years. The US list also names materials for the 11th, 13th, and 14th years that the cited UK edition leaves blank, while the UK list names materials for the 65th, 70th, and 80th years that the US list doesn't cover at all."
      },
      {
        "question": "What's the difference between the traditional and modern anniversary gift?",
        "answer": "The traditional list assigns a material, paper, cotton, wood, tin, and so on, and dates to the 19th century and earlier. The modern list assigns a gemstone instead and was popularized decades later by the jewelry trade. Checked directly against Jewelers of America's own current chart, the two systems only agree starting at the 25th anniversary; every year from the 1st through the 24th gets a different answer from each list."
      },
      {
        "question": "When do you get a card from the King or Queen for a wedding anniversary?",
        "answer": "Per Buckingham Palace's own Anniversaries Office page, citizens of the Commonwealth realms become eligible starting at the diamond (60th) wedding anniversary, and again at the 65th, 70th, and every year after that. The office describes the practice as continuing a tradition dating back to 1917."
      },
      {
        "question": "Does the US president send a card for wedding anniversaries?",
        "answer": "Yes. The White House's own current greeting request form, checked directly for this page, offers three wedding-anniversary categories: 25th, 50th, and 51+, with the exact number of years married entered as a separate field. That 25th-anniversary option is earlier than the 50th-anniversary threshold commonly repeated online."
      },
      {
        "question": "Are the milestone colors, like silver and gold, from the traditional list or the gemstone list?",
        "answer": "Both, which is why they don't conflict. The traditional materials list already assigned silver to the 25th and gold to the 50th anniversary in the 19th century, long before the modern gemstone list existed. When jewelry associations built the gemstone list decades later, they kept those two years as the same metals rather than replacing them, which is why the two lists still agree at 25 and 50 even though they disagree almost everywhere else."
      }
    ],
    "sources": [
      {
        "label": "Wikipedia — Wedding anniversary (sourced US/UK traditional lists and government recognition)",
        "url": "https://en.wikipedia.org/wiki/Wedding_anniversary"
      },
      {
        "label": "Jewelers of America — Anniversary jewelry buying guide (current gemstone chart)",
        "url": "https://www.jewelers.org/buying-jewelry/jewelry-buying-guides/anniversary"
      },
      {
        "label": "Jewelers of America — About (1906 founding)",
        "url": "https://www.jewelers.org/about"
      },
      {
        "label": "The Royal Household — Anniversary messages (Buckingham Palace)",
        "url": "https://www.royal.uk/anniversary-messages"
      },
      {
        "label": "Governor-General of the Commonwealth of Australia — Receiving an anniversary message",
        "url": "https://www.gg.gov.au/about-governor-general/receiving-anniversary-message-governor-general"
      },
      {
        "label": "Governor General of Canada — Request Birthday and Anniversary Greetings",
        "url": "https://www.gg.ca/en/contact-us/birthday-anniversary-greetings"
      },
      {
        "label": "The White House — Greetings request form (anniversary categories)",
        "url": "https://www.whitehouse.gov/greetings/"
      }
    ],
    "image": "/images/anniversary-gifts-by-year-grid.svg",
    "imageAlt": "Grid comparing the traditional materials list to Jewelers of America's modern gemstone list at years 1, 5, 10, 15, and 20, where the two disagree, and at years 25, 30, 40, 50, and 60, where both lists give the same answer"
  },
  {
    "slug": "april-birth-flower",
    "category": "Birth Flowers",
    "title": "April Birth Flower: Daisy and Sweet Pea, a Mislabeled Poison",
    "description": "April's birth flowers are daisy and sweet pea, but the sweet pea's toxin causes a narrower disease than the famine-era illness most sites call lathyrism.",
    "published": "2026-08-18",
    "updated": "2026-08-18",
    "coreSummary": "April's birth flowers are the daisy, whose Old English name dæges éage (\"day's eye\") describes how its petals close at night and reopen with the sun, and the sweet pea, first sent from a Sicilian monastery to English and Dutch gardens in 1699 by the monk Francesco Cupani. The petal-pulling \"he loves me, he loves me not\" game most people associate with the word \"daisy\" actually runs on a different species, the oxeye daisy, not the Bellis perennis that birth-flower charts name for April. And the toxin in sweet pea seeds causes a real condition called osteolathyrism, first studied in rats in 1952, a distinct type of lathyrism from neurolathyrism, the historic famine disease caused by a different toxin in the grass pea, a crop people actually ate during famines.",
    "sections": [
      {
        "heading": "Daisy and sweet pea, the same gap as every other month",
        "body": [
          "The Old Farmer's Almanac, the same source behind the pairs this site has already covered for July, August, September, October, and November, lists daisy and sweet pea as April's flowers. This site's [August birth flower](/august-birth-flower/) page traced why these lists keep landing on two flowers instead of one: the jewelry trade settled birthstones with a single 1912 convention, and birth flowers never had an equivalent body step in. Competing 19th-century flower dictionaries disagreed with each other, and the modern lists that followed kept both nominees rather than picking a winner.",
          "That explains the pair. It says nothing about either flower on its own, and both carry more history than a florist's caption usually mentions."
        ]
      },
      {
        "heading": "Daisy: named for an eye that opens with the sun",
        "body": [
          "\"Daisy\" comes from the Old English dæges éage, literally \"day's eye,\" describing the way the flower's petals close over its yellow center in the evening and reopen each morning, according to the Oxford English Dictionary. The word is recorded from the Old English period, predating 1150.",
          "The species most birth-flower lists actually mean is Bellis perennis, sometimes qualified as the common daisy, English daisy, or true daisy, specifically because the plain name \"daisy\" gets attached to plants outside its own genus. Wikipedia's entry on the daisy names two of the more common look-alikes: the oxeye daisy, Leucanthemum vulgare, and the Shasta daisy, a 20th-century hybrid classified as Leucanthemum × superbum. Both share the daisy's flat, yellow-centered, white-rayed flower head and the wider Asteraceae family, and neither one is Bellis perennis."
        ],
        "image": {
          "src": "/images/april-birth-flower-daisy.jpg",
          "alt": "Five common daisies, Bellis perennis, the species most birth-flower charts name for April, distinct from the oxeye daisy and Shasta daisy that also go by the name \"daisy\"",
          "credit": "Photo by Friedrich Haag, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Five_daisies_(Bellis_perennis).jpg), CC BY-SA 4.0"
        }
      },
      {
        "heading": "The petal game everyone learns as a kid uses the wrong species",
        "body": [
          "The habit of pulling petals one by one while alternating \"he loves me, he loves me not\" traces to a French tradition called effeuiller la marguerite, \"plucking the marguerite,\" per Wikipedia's article on the game and the Royal Botanic Gardens, Kew. \"Marguerite\" in that phrase, and in the game as it's usually pictured, points to the oxeye daisy, Leucanthemum vulgare, the same look-alike species that already isn't the birth-flower daisy. A game most people learned as children runs on a different plant than the one their birth-flower chart actually names.",
          "Victorian floriography gave the true birth-flower daisy, Bellis perennis, its own separate meaning: innocence, loyal love, and, by coincidence, a phrase close to the petal game's own subject, \"I'll never tell,\" per multiple floriography glossaries drawing on 19th-century flower-language guides."
        ]
      },
      {
        "heading": "Sweet pea: from a Sicilian monastery to Victorian England's favorite annual",
        "body": [
          "Lathyrus odoratus has a documented discovery date. In 1699, the Sicilian Franciscan monk Francesco Cupani, compiling a flora of Sicily, found the wild plant growing near his monastery and sent seed to botanical contacts in England and Amsterdam, according to horticultural histories tracing the plant's introduction. Every sweet pea cultivar grown today descends from that seed line, usually sold under the name 'Cupani' for the small, intensely fragrant, bicolor purple-and-white flower closest to the wild form.",
          "The plant stayed a minor garden curiosity for the better part of two centuries. That changed with Henry Eckford, a Scottish gardener who began breeding sweet peas in 1879 and, working from the town of Wem in Shropshire from 1888 onward, developed the larger-flowered Grandiflora strains that turned the sweet pea into what garden historians describe as the most popular flower of the late Victorian and Edwardian eras. The Royal Horticultural Society gave Eckford its Victoria Medal of Honour in 1905, and he's still credited as the father of the modern sweet pea."
        ],
        "image": {
          "src": "/images/april-birth-flower-sweet-pea.jpg",
          "alt": "A violet-flowered Lathyrus odoratus sweet pea cultivar, descended from seed the monk Francesco Cupani sent from Sicily to England and Amsterdam in 1699",
          "credit": "Photo by Acabashi, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Sweet_pea_'Lathyrus_odoratus'_violet_flower_at_Boreham,_Essex,_England_3.jpg), CC BY-SA 4.0"
        }
      },
      {
        "heading": "A real toxin, attached to the wrong disease name",
        "body": [
          "Kate Greenaway's Language of Flowers, an 1884 floriography guide still cited as a standard reference, lists sweet pea as blissful pleasure, delicate pleasure, and departure, the source of the flower's common use today as a goodbye or thank-you gift rather than a romantic one.",
          "Sweet pea seed does carry a real toxin, beta-aminopropionitrile (BAPN), which disrupts collagen cross-linking and can produce a bone-and-connective-tissue condition called osteolathyrism, also known as odoratism, first characterized in a 1952 study by Ponseti and Baird that fed the toxin to rats via Lathyrus odoratus seed meal. \"Lathyrism\" itself is an umbrella term for three related but distinct conditions, and the historic human illness, the one recorded since Hippocrates and tied to famines across South Asia and East Africa, is specifically neurolathyrism: motor-neuron damage and leg paralysis caused by a different toxin, ODAP, from overconsumption of Lathyrus sativus, the grass pea grown and eaten as a famine food, per Wikipedia's article on lathyrism. Ornamental sweet peas were never a food crop the way the grass pea was, and ODAP and BAPN are chemically different compounds that damage different tissue; florist and gardening sites that invoke \"lathyrism\" for sweet-pea toxicity without naming which type fold a narrower, well-characterized garden hazard into a famine disease it isn't.",
          "The sweet pea's name also has nothing to do with the vegetable garden pea people eat, Pisum sativum, which sits in a different genus of the same family, Fabaceae."
        ]
      },
      {
        "heading": "April's other reference points",
        "body": [
          "For the gemstone side of an April birthday, this site's [birthstones by month](/birthstones-by-month/) page lists April's current official stone as diamond alone, per Jewelers of America's live buying guide, one of seven months, alongside January, February, March, May, July, and September, that still carry a single official stone with no revision since the 1912 chart was first issued.",
          "And for why birth-flower lists, unlike birthstone lists, tend to run in pairs rather than a single flower, this site's [November birth flower](/november-birth-flower/) page traces that gap back to competing 19th-century flower dictionaries that never got their own version of the single trade meeting that settled the birthstone chart."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is April's birth flower?",
        "answer": "Daisy and sweet pea, per The Old Farmer's Almanac. Like most months on a modern birth-flower list, April carries two flowers because no single trade body ever settled on one official calendar the way the jewelry trade did for birthstones."
      },
      {
        "question": "What does the daisy mean as a birth flower?",
        "answer": "Innocence, loyal love, and, in Victorian floriography, the coded phrase \"I'll never tell.\" The name traces to Old English dæges éage, \"day's eye,\" for the way the flower's petals close at night and reopen with the sun."
      },
      {
        "question": "Is the daisy used in the \"he loves me, he loves me not\" game the same species as the birth flower?",
        "answer": "Usually not. The game traces to a French tradition, effeuiller la marguerite, and \"marguerite\" in that context typically refers to the oxeye daisy, Leucanthemum vulgare, a different genus from Bellis perennis, the species most birth-flower charts actually name for April."
      },
      {
        "question": "What does sweet pea mean as a birth flower?",
        "answer": "Blissful pleasure, delicate pleasure, and departure, per Kate Greenaway's 1884 Language of Flowers, which is why sweet pea is traditionally given as a goodbye or thank-you flower rather than a romantic one."
      },
      {
        "question": "Who first grew sweet peas outside the wild?",
        "answer": "Francesco Cupani, a Sicilian Franciscan monk, found Lathyrus odoratus growing near his monastery in 1699 and sent seed to England and Amsterdam. Henry Eckford, a Scottish gardener working in Shropshire from 1888, bred the larger Grandiflora strains that made the sweet pea a Victorian and Edwardian favorite, earning him the Royal Horticultural Society's Victoria Medal of Honour in 1905."
      },
      {
        "question": "Are sweet peas actually poisonous?",
        "answer": "The seeds contain a toxin, BAPN, that can cause a connective-tissue condition called osteolathyrism, or odoratism, first documented in a 1952 rat study by Ponseti and Baird. That's a distinct type of lathyrism from neurolathyrism, the historic famine disease caused by a different toxin, ODAP, in Lathyrus sativus, the grass pea grown as a famine food. \"Lathyrism\" covers several related conditions, and sources that invoke it for sweet-pea toxicity without that distinction are describing a real but narrower hazard, not the famine disease."
      },
      {
        "question": "Is the sweet pea related to the peas people eat?",
        "answer": "No. Edible garden peas are Pisum sativum, a different genus within the same family, Fabaceae, as the ornamental sweet pea, Lathyrus odoratus."
      }
    ],
    "sources": [
      {
        "label": "The Old Farmer's Almanac — April Birth Flowers: Daisy and Sweet Pea Meanings & Symbolism",
        "url": "https://www.almanac.com/content/april-birth-flowers"
      },
      {
        "label": "Oxford English Dictionary — daisy, n.",
        "url": "https://www.oed.com/dictionary/daisy_n"
      },
      {
        "label": "Wikipedia — Daisy",
        "url": "https://en.wikipedia.org/wiki/Daisy"
      },
      {
        "label": "Wikipedia — He loves me... he loves me not",
        "url": "https://en.wikipedia.org/wiki/He_loves_me..._he_loves_me_not"
      },
      {
        "label": "Royal Botanic Gardens, Kew — Effeuillons la marguerite (let's pluck the daisy)",
        "url": "https://www.kew.org/read-and-watch/lets-pluck-the-daisy"
      },
      {
        "label": "Wikipedia — Sweet pea",
        "url": "https://en.wikipedia.org/wiki/Sweet_pea"
      },
      {
        "label": "Sarah Raven — The Sweet Pea Story",
        "url": "https://www.sarahraven.com/articles/the-sweet-pea-story"
      },
      {
        "label": "Wikipedia — Henry Eckford (horticulturist)",
        "url": "https://en.wikipedia.org/wiki/Henry_Eckford_(horticulturist)"
      },
      {
        "label": "Petal Republic — The Sweet Pea Story: Meaning, Symbolism, and Cultural Impact",
        "url": "https://www.petalrepublic.com/sweet-pea-flower-meaning/"
      },
      {
        "label": "ScienceDirect Topics — Lathyrism",
        "url": "https://www.sciencedirect.com/topics/pharmacology-toxicology-and-pharmaceutical-science/lathyrism"
      },
      {
        "label": "Wikipedia — Lathyrism",
        "url": "https://en.wikipedia.org/wiki/Lathyrism"
      }
    ],
    "image": "/images/april-birth-flower-daisy.jpg",
    "imageAlt": "Five common daisies, Bellis perennis, the species most birth-flower charts name for April, distinct from the oxeye daisy and Shasta daisy that also go by the name \"daisy\"",
    "imageCredit": "Photo by Friedrich Haag, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Five_daisies_(Bellis_perennis).jpg), CC BY-SA 4.0"
  },
  {
    "slug": "december-birth-flower",
    "category": "Birth Flowers",
    "title": "December Birth Flower: Holly and Narcissus, a 1948 King",
    "description": "December's birth flowers are holly and narcissus, but the \"ancient\" Holly King is a 1948 invention, and the paperwhite is also China's New Year flower.",
    "published": "2026-08-18",
    "updated": "2026-08-18",
    "coreSummary": "December's birth flowers are holly, whose plants grow flowers that produce fruit and flowers that produce pollen on separate plants, so that only female holly bushes with a male nearby ever produce the familiar red berries, and narcissus, specifically the paperwhite (Narcissus tazetta). The \"Holly King,\" a figure many lifestyle sites present as ancient Celtic belief, actually traces to a 1948 book by the poet Robert Graves, built from his own comparisons to older myths rather than any surviving Celtic source. And the same paperwhite species forced into bloom on US windowsills each December is, in a different subspecies grown for Lunar New Year, China's \"Chinese Sacred Lily,\" a symbol of prosperity rather than the vanity myth behind its Western name.",
    "sections": [
      {
        "heading": "Holly and narcissus, the same two-flower pattern",
        "body": [
          "The Old Farmer's Almanac, the same trade source behind the pairs this site has already covered for July through November, names holly and narcissus, specifically the paperwhite, as December's flowers. This site's [August birth flower](/august-birth-flower/) page traced why birth-flower lists keep landing on two names instead of one: birthstones got a single 1912 trade convention to settle the chart, and birth flowers never had an equivalent meeting, so competing 19th-century flower dictionaries went uncorrected and the modern lists that followed absorbed more than one nominee per month.",
          "December's pair carries an unusual amount of misinformation for two flowers this common. One has a real ancient Roman gift-giving custom attached to it, plus a much newer addition that regularly gets presented as if it were the same kind of ancient. The other is the same bulb behind two separate midwinter traditions, on opposite sides of the world, that landed on opposite meanings."
        ]
      },
      {
        "heading": "Holly: only the female plants grow berries",
        "body": [
          "Holly is usually dioecious, meaning an individual plant carries either the flowers that produce pollen or the flowers that produce fruit, rarely both, according to Wikipedia's entry on Ilex aquifolium, the European holly most associated with Christmas decoration. Only female plants grow the familiar red drupes, and only when a male plant grows close enough to fertilize them; a solitary holly bush, however healthy, can go its whole life without producing a single berry. The Old Farmer's Almanac states the practical version of the same fact more plainly: hollies are male and female, and gardeners generally need one of each to get the berries most people associate with the plant. Berries and leaves alike are also mildly toxic to dogs, cats, and horses, per the ASPCA, typically causing vomiting and diarrhea rather than anything more severe.",
          "The species name doesn't come from water, despite its visual resemblance to \"aqua.\" Aquifolium is Botanical Latin built from acus, needle, and folia, leaf, a description of the plant's spiny leaf margins rather than anything to do with moisture, per Wikipedia. The English common name has a separate, older root: \"holly\" is a shortened form of the Old English holegn or holen, recorded well before the Latin binomial existed."
        ],
        "image": {
          "src": "/images/december-birth-flower-holly.jpg",
          "alt": "Glossy holly leaves and bright red berries, which only grow on female Ilex aquifolium plants pollinated by a nearby male",
          "credit": "Photo by Balise42, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Holly_berries_and_leaves.jpg), CC BY-SA 4.0"
        }
      },
      {
        "heading": "A real Roman festival, and a king that isn't",
        "body": [
          "Some of what gets attached to holly checks out. Ancient Romans gave holly during Saturnalia, the winter-solstice festival honoring Saturn, and those who received it hung it in their homes for protection against evil spirits, according to the Old Farmer's Almanac. Celtic peoples separately brought evergreen boughs, holly included, into their homes at the same time of year, treating the plant as a symbol of protection and of life persisting through the dark months. Christian tradition later reworked the same plant's imagery rather than replacing it: the spiny leaves came to stand for Christ's crown of thorns, the red berries for drops of his blood.",
          "The \"Holly King,\" a figure many lifestyle and florist articles present as part of that same ancient Celtic belief system, doesn't come from any ancient Celtic source. Per Wikipedia's account of the Holly King and Oak King, the pairing first appears in the poet Robert Graves's 1948 book The White Goddess, where Graves built the figure out of his own comparisons to older paired-hero myths, Lleu Llaw Gyffes and Gronw Pebr among them, and out of ideas James Frazer had laid out decades earlier in The Golden Bough. Wiccan writers Stewart and Janet Farrar folded the Holly King into modern seasonal ritual decades later, in their 1981 book Eight Sabbats for Witches, and it's that 20th-century synthesis, not a surviving ancient text, that most current \"Holly King\" content actually traces back to."
        ]
      },
      {
        "heading": "Narcissus: a myth, and a name that may mean \"numb\"",
        "body": [
          "The narcissus flower's name comes from Ovid's Metamorphoses, where the youth Narcissus rejects the nymph Echo, then falls for his own reflection in a still pool and can't look away, wasting there until a white-and-yellow flower grows in his place, per Wikipedia's account of the myth. That same story is also the source of \"narcissism\" as a term for excessive self-regard, borrowed from the flower's name centuries later.",
          "The flower's own name may run deeper than the myth. Wikipedia's entry on the Narcissus genus notes that the word's exact origin is unknown, but it's often linked to the ancient Greek narkō, to make numb, the same root behind the English word narcotic. That's not just wordplay: every Narcissus species contains the alkaloid lycorine, concentrated most heavily in the bulb, and ingesting it produces numbness followed by more serious neurological symptoms in poisoning cases, the kind of effect the name may describe directly rather than by coincidence.",
          "The Old Farmer's Almanac states plainly that every part of the paperwhite is poisonous, with the bulb the most toxic part, worth flagging for a bulb that gets forced into bloom on a kitchen windowsill every December, often within reach of pets or small children. That guidance doesn't hold evenly across the whole genus, though: research on the related species Narcissus papyraceus found roughly five times more alkaloid concentrated in the stem than in the bulb, according to Wikipedia's entry on the genus, a reminder that \"the bulb is the toxic part\" is closer to a rule of thumb than a fixed rule."
        ],
        "image": {
          "src": "/images/december-birth-flower-narcissus.jpg",
          "alt": "Paperwhite narcissus (Narcissus tazetta cv. Paperwhite) in bloom, the species the Old Farmer's Almanac names as December's narcissus birth flower",
          "credit": "Photo by cultivar413, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:190307_127_SD_Botanic_Gdn_-_Lawn_Garden,_Narcissus_tazetta_cv_Paperwhite_Narcissus_(47290737192).jpg), CC BY 2.0"
        }
      },
      {
        "heading": "The same bulb, opposite meanings, on opposite sides of the world",
        "body": [
          "The Old Farmer's Almanac's own page on the paperwhite adds a detail most florist copy skips: the flower is \"sometimes associated with the Chinese Lunar New Year.\" That's an understatement. The species behind the December paperwhite, Narcissus tazetta, reached China as early as 690 CE according to historical records, per Cornell Botanic Gardens, and the subspecies grown there today, sold and gifted as the \"Chinese Sacred Lily,\" is one of the most favored flowers of Lunar New Year tradition, forced into bloom in a shallow dish of water and pebbles, the same method used to force Western Christmas paperwhites. A narcissus that opens exactly on New Year's Day is considered a sign of good fortune for the year ahead.",
          "The two traditions share a bulb and a forcing method but nothing else. The Western meaning runs through Ovid's myth, a warning about vanity and fatal self-absorption. The Chinese meaning, attached to a close relative of the same species, is prosperity and renewal, with no shared lineage connecting the two interpretations. Two cultures independently decided the same midwinter bulb meant something, and landed on opposite answers."
        ]
      },
      {
        "heading": "December's other reference points",
        "body": [
          "For the gemstone side of a December birthday, this site's [December birthstone](/december-birthstone/) page covers the month's three official stones, turquoise, zircon, and tanzanite, and why blue topaz, despite heavy retail marketing, isn't actually one of them.",
          "And for why birth-flower lists, unlike birthstone lists, tend to run in pairs rather than a single flower, this site's [November birth flower](/november-birth-flower/) page traces that gap back to the same absent 1912-style trade convention this page opened with."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is December's birth flower?",
        "answer": "Holly and narcissus, specifically the paperwhite, per The Old Farmer's Almanac. Like most months on a modern birth-flower list, December carries two flowers because no single trade body ever settled on one official calendar the way the jewelry trade did for birthstones."
      },
      {
        "question": "Why do some holly bushes never grow berries?",
        "answer": "Holly is usually dioecious: an individual plant produces either pollen flowers or fruit flowers, rarely both. Only female plants grow the red berries, and only when a male plant grows nearby to fertilize them, per Wikipedia's entry on Ilex aquifolium."
      },
      {
        "question": "Is the \"Holly King\" an ancient Celtic tradition?",
        "answer": "No. The Holly King and Oak King pairing first appears in poet Robert Graves's 1948 book The White Goddess, built from his own comparisons to older myths, not from a surviving ancient Celtic source. Wiccan writers Stewart and Janet Farrar adopted the figure into modern ritual decades later, in 1981."
      },
      {
        "question": "Where does the name \"narcissus\" come from?",
        "answer": "From Ovid's Metamorphoses, where the youth Narcissus falls in love with his own reflection and wastes away into the flower that bears his name. The word's exact origin is otherwise unknown, but it's often linked to the ancient Greek narkō, \"to make numb,\" the same root behind \"narcotic.\""
      },
      {
        "question": "Are paperwhite narcissus bulbs poisonous?",
        "answer": "Yes. Every part of the paperwhite is poisonous, with the bulb generally the most toxic part, per The Old Farmer's Almanac. Toxin distribution varies across the genus, though: a related species, Narcissus papyraceus, carries roughly five times more alkaloid in its stem than its bulb."
      },
      {
        "question": "Is the December paperwhite connected to Chinese New Year?",
        "answer": "Yes. The paperwhite's species, Narcissus tazetta, reached China as early as 690 CE, and a subspecies grown there, the \"Chinese Sacred Lily,\" is a favored Lunar New Year flower symbolizing prosperity, forced into bloom the same way as Western Christmas paperwhites but carrying an entirely separate meaning."
      }
    ],
    "sources": [
      {
        "label": "The Old Farmer's Almanac — December Birth Flowers: Holly and Narcissus",
        "url": "https://www.almanac.com/content/december-birth-flowers"
      },
      {
        "label": "Wikipedia — Ilex aquifolium",
        "url": "https://en.wikipedia.org/wiki/Ilex_aquifolium"
      },
      {
        "label": "ASPCA — Toxic and Non-Toxic Plants: English Holly",
        "url": "https://www.aspca.org/pet-care/aspca-poison-control/toxic-and-non-toxic-plants/english-holly"
      },
      {
        "label": "Wikipedia — Holly King and Oak King",
        "url": "https://en.wikipedia.org/wiki/Holly_King_and_Oak_King"
      },
      {
        "label": "Wikipedia — Echo and Narcissus",
        "url": "https://en.wikipedia.org/wiki/Echo_and_Narcissus"
      },
      {
        "label": "Wikipedia — Narcissus (plant)",
        "url": "https://en.wikipedia.org/wiki/Narcissus_(plant)"
      },
      {
        "label": "Wikipedia — Narcissus tazetta",
        "url": "https://en.wikipedia.org/wiki/Narcissus_tazetta"
      },
      {
        "label": "Cornell Botanic Gardens — Lucky Plants for the Lunar New Year",
        "url": "https://cornellbotanicgardens.org/lucky-plants-for-the-lunar-new-year"
      }
    ],
    "image": "/images/december-birth-flower-holly.jpg",
    "imageAlt": "Glossy holly leaves and bright red berries, which only grow on female Ilex aquifolium plants pollinated by a nearby male",
    "imageCredit": "Photo by Balise42, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Holly_berries_and_leaves.jpg), CC BY-SA 4.0"
  },
  {
    "slug": "february-birth-flower",
    "category": "Birth Flowers",
    "title": "February Birth Flower: Violet and Primrose, Plus Two Name-Alikes",
    "description": "February's birth flowers are violet and primrose, but the African violet and evening primrose sold under similar names belong to entirely different plant families.",
    "published": "2026-08-18",
    "updated": "2026-08-18",
    "coreSummary": "February's birth flowers are the violet (Viola odorata, family Violaceae) and the primrose (Primula vulgaris, family Primulaceae), per The Old Farmer's Almanac. Two of the most common houseplants sold under near-identical names are not related to either one: the African violet, now classified as Streptocarpus sect. Saintpaulia, belongs to the Gesneriaceae family, and the evening primrose, genus Oenothera, belongs to the Onagraceae family and is native to the Americas rather than Eurasia. Violets carry a documented political history as Napoleon Bonaparte's secret 1814-1815 symbol, and the real UK observance called Primrose Day, honoring Benjamin Disraeli, gets one detail wrong on The Old Farmer's Almanac's own February birth-flower page.",
    "sections": [
      {
        "heading": "Violet and primrose, the same gap as every other month",
        "body": [
          "The Old Farmer's Almanac, the same source behind the pairs this site has already covered for July through December and April, lists violet and primrose as February's flowers. This site's [August birth flower](/august-birth-flower/) page traced why these lists keep landing on two flowers instead of one: the jewelry trade settled birthstones with a single 1912 convention, and birth flowers never had an equivalent body step in. Competing 19th-century flower dictionaries disagreed with each other, and the modern lists that followed kept both nominees rather than picking a winner.",
          "That explains the pair. It says nothing about either flower on its own, and both share their common name with an unrelated houseplant sold in every grocery-store flower aisle."
        ]
      },
      {
        "heading": "Violet: the flower, and the houseplant that only looks like one",
        "body": [
          "The species most birth-flower lists mean is Viola odorata, also called sweet violet, wood violet, or English violet, a low, spreading perennial in the family Violaceae native to Europe and Asia, according to Wikipedia's entry on the species. Its dark purple or white flowers are scented, which is why sweet violet has a long history in perfumery and candied confections, unlike most of the more than 680 species in the wider Viola genus, per Wikipedia's entry on the genus.",
          "The African violet, sold as a houseplant under that name in nearly every garden center, is not a Viola species and is not closely related to true violets, per Wikipedia's entry on the plant. It's now classified as Streptocarpus sect. Saintpaulia, a group of roughly ten species native to Tanzania and adjacent southeastern Kenya, in the family Gesneriaceae, a different family from the violet's Violaceae. The genus was named Saintpaulia for its collector, Baron Walter von Saint Paul-Illaire, a German district commissioner in Tanzania who sent seeds to his father in Germany in 1892; it kept that common name because its five-petaled, purple-toned flowers happen to resemble a wild violet's, even though the resemblance stops there."
        ],
        "image": {
          "src": "/images/february-birth-flower-violet.jpg",
          "alt": "Viola odorata, the sweet violet, February's birth flower, unrelated to the African violet sold under a similar name",
          "credit": "Photo by Uoaei1, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Viola_odorata_20210226.jpg), CC BY-SA 4.0"
        }
      },
      {
        "heading": "A flower that once meant a political party",
        "body": [
          "Violets became a symbol of Napoleon Bonaparte in April 1814, after his first abdication and exile to Elba, according to Napoleonic researcher and historical novelist Shannon Selin, who cites contemporary accounts of the period. Before leaving France, Napoleon supposedly told his friends and supporters he would return with the violets, which bloom in the spring, and his followers began wearing violets or violet-colored ribbons as a way of signaling to each other that they were Bonapartists. Napoleon's forces landed back in France at Golfe-Juan on March 1, 1815, per Wikipedia's account of the Hundred Days, and when he reached Paris on March 20, contemporary accounts quoted by Selin describe soldiers and crowds decorated with bunches of violets. His nickname among supporters became \"Le Père la Violette,\" and a popular 1815 engraving nicknamed \"Corporal Violet\" hid the profiles of Napoleon, his wife, and his son inside an ordinary-looking bunch of violets, an optical illusion meant to evade Bourbon censorship of his image.",
          "None of that history changes what violet means on a modern birth-flower chart. Present-day floriography guides list violet for loyalty, faithfulness, and modesty, the meaning that traces to the flower's old habit of tucking its blooms low beneath its own leaves."
        ]
      },
      {
        "heading": "Primrose: the flower, and the unrelated plant sold as \"evening primrose\"",
        "body": [
          "The primrose most birth-flower lists mean is Primula vulgaris, also called common primrose or English primrose, a perennial native to Eurasia in the family Primulaceae that blooms in late winter and early spring, per Wikipedia's entry on the species. Its genus name, Primula, comes from the Latin primus, \"first,\" for its early appearance.",
          "Evening primrose, the plant behind the supplement evening primrose oil, is not a Primula species and belongs to a different family entirely. Oenothera biennis, the common evening primrose, is native to eastern and central North America and belongs to the family Onagraceae, an ocean and a plant family away from the Eurasian, Primulaceae-family true primrose, according to Wikipedia's entry on the species. The naming mix-up dates to early European colonists in North America, who thought the unfamiliar plant looked something like the primroses they knew from home, except that its flowers opened at evening instead of morning, and called it accordingly."
        ],
        "image": {
          "src": "/images/february-birth-flower-primrose.jpg",
          "alt": "Primula vulgaris, the common primrose, February's other birth flower, unrelated to the evening primrose sold under a similar name",
          "credit": "Photo by AnemoneProjectors, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Primrose_(Primula_vulgaris).jpg), CC BY-SA 2.0"
        }
      },
      {
        "heading": "Primrose Day is a real UK observance, and even the Almanac gets a detail wrong",
        "body": [
          "Primrose Day, April 19, marks the anniversary of the 1881 death of Benjamin Disraeli, the British prime minister whose reported favorite flower was the primrose, per Wikipedia's entry on the observance. Queen Victoria, who had formed a close working relationship with Disraeli, sent primroses from Windsor Castle and Osborne House during his life and a wreath of primroses to his funeral, with a note reading \"His favourite flowers.\" Annual commemorations through the 1920s placed primroses at Disraeli's tomb at St Michael and All Angels Church, on the grounds of his home, Hughenden Manor, and at a separate statue of him in Parliament Square; a political organization called the Primrose League, founded in 1883 to carry on his legacy, grew to more than two million members by 1910 before winding down after the First World War.",
          "The Old Farmer's Almanac's own February birth-flower page, cited elsewhere on this page, describes Primrose Day differently, stating that \"visitors to Westminster Abbey lay the flowers at his statue.\" Disraeli is buried at Hughenden, not Westminster Abbey, and the historic Primrose Day gatherings were at that Hughenden tomb and the separate Parliament Square statue, per Wikipedia's account. Disraeli does have a memorial in Westminster Abbey, erected by the nation, but it isn't the site the annual commemorations used, and it isn't a statue. Even a source this page relies on for the flowers' core meanings gets a location wrong once its subject moves from botany into history it didn't check as closely.",
          "Also worth noting: Wikipedia's account itself flags one detail as uncertain. A later letter from Queen Victoria's private secretary, Sir Henry Ponsonby, reportedly disputed the popular story that the primrose really was Disraeli's favorite flower at all, without Wikipedia's summary spelling out what he claimed instead. The primrose-as-favorite-flower story is widely repeated and traceable to a contemporary funeral note, but it isn't beyond dispute."
        ]
      },
      {
        "heading": "February's other reference points",
        "body": [
          "For the gemstone side of a February birthday, this site's [birthstones by month](/birthstones-by-month/) page covers amethyst, February's official stone since the 1912 trade convention that first standardized the modern birthstone chart.",
          "This site's [November birth flower](/november-birth-flower/) page covers a different kind of mismatch: chrysanthemum, November's flower on US florist charts, is the customary graveside flower across much of Catholic Europe, where handing one to a living host as a birthday gift is a genuine etiquette mistake rather than a quaint regional footnote."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is February's birth flower?",
        "answer": "Violet and primrose, per The Old Farmer's Almanac. Like most months on a modern birth-flower list, February carries two flowers because no single trade body ever settled on one official calendar the way the jewelry trade did for birthstones."
      },
      {
        "question": "Is the African violet the same plant as February's birth flower?",
        "answer": "No. The birth-flower violet is Viola odorata, family Violaceae. The African violet, now classified as Streptocarpus sect. Saintpaulia, belongs to the unrelated family Gesneriaceae and is native to Tanzania, not Europe or Asia. The two only share a common name and a superficial resemblance in flower shape and color."
      },
      {
        "question": "Is evening primrose the same plant as February's birth flower?",
        "answer": "No. The birth-flower primrose is Primula vulgaris, family Primulaceae, native to Eurasia. Evening primrose, genus Oenothera, belongs to the unrelated family Onagraceae and is native to the Americas. Early colonists named it for a passing resemblance to the primroses they knew from home."
      },
      {
        "question": "What does violet mean as a birth flower?",
        "answer": "Loyalty, faithfulness, and modesty, a meaning tied to the flower's habit of tucking its blooms beneath its own leaves. Violets also carry a documented political history as a secret symbol of Napoleon Bonaparte's supporters in 1814 and 1815."
      },
      {
        "question": "What does primrose mean as a birth flower?",
        "answer": "Young love, per The Old Farmer's Almanac, fitting for one of the first flowers to bloom in late winter and early spring. The primrose was also reportedly Benjamin Disraeli's favorite flower, which is why the UK still marks April 19 as Primrose Day."
      },
      {
        "question": "What is Primrose Day?",
        "answer": "A UK observance on April 19 marking the 1881 death of Prime Minister Benjamin Disraeli, whose reported favorite flower was the primrose. Annual commemorations through the 1920s placed primroses at his tomb at Hughenden and at a statue of him in Parliament Square."
      }
    ],
    "sources": [
      {
        "label": "The Old Farmer's Almanac — February Birth Flowers: Primrose and Violet",
        "url": "https://www.almanac.com/content/february-birth-flowers"
      },
      {
        "label": "Wikipedia — Viola odorata",
        "url": "https://en.wikipedia.org/wiki/Viola_odorata"
      },
      {
        "label": "Wikipedia — Viola (plant)",
        "url": "https://en.wikipedia.org/wiki/Viola_(plant)"
      },
      {
        "label": "Wikipedia — Streptocarpus sect. Saintpaulia",
        "url": "https://en.wikipedia.org/wiki/Streptocarpus_sect._Saintpaulia"
      },
      {
        "label": "Shannon Selin — Symbols of Napoleon: The Violet",
        "url": "https://shannonselin.com/2020/01/symbols-napoleon-violet/"
      },
      {
        "label": "Wikipedia — Hundred Days",
        "url": "https://en.wikipedia.org/wiki/Hundred_Days"
      },
      {
        "label": "Wikipedia — Primula vulgaris",
        "url": "https://en.wikipedia.org/wiki/Primula_vulgaris"
      },
      {
        "label": "Wikipedia — Oenothera biennis",
        "url": "https://en.wikipedia.org/wiki/Oenothera_biennis"
      },
      {
        "label": "Wikipedia — Primrose Day",
        "url": "https://en.wikipedia.org/wiki/Primrose_Day"
      },
      {
        "label": "Wikipedia — Benjamin Disraeli",
        "url": "https://en.wikipedia.org/wiki/Benjamin_Disraeli"
      }
    ],
    "image": "/images/february-birth-flower-violet.jpg",
    "imageAlt": "Viola odorata, the sweet violet, February's birth flower, unrelated to the African violet sold under a similar name",
    "imageCredit": "Photo by Uoaei1, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Viola_odorata_20210226.jpg), CC BY-SA 4.0"
  },
  {
    "slug": "january-birth-flower",
    "category": "Birth Flowers",
    "title": "January Birth Flower: Carnation and Snowdrop, a Color Myth",
    "description": "January's birth flowers are carnation and snowdrop, but the pink-carnation Mother's Day story most retailers tell doesn't match the documented 1908 record.",
    "published": "2026-08-19",
    "updated": "2026-08-19",
    "coreSummary": "January's birth flowers are the carnation (Dianthus caryophyllus) and the snowdrop (Galanthus nivalis), per The Old Farmer's Almanac. Etymologists have never settled on a single origin for the word \"carnation,\" and the widely repeated claim that pink carnations were the original 1907 Mother's Day flower doesn't match the documented record: Anna Jarvis chose white, and the pink-for-a-living-mother convention was a later florist invention. Snowdrop's genus name is Greek for \"milk flower,\" and it carries two contradictory identities at once, a Christian legend of hope and a still-reported British folk superstition that a single bloom indoors foretells a death.",
    "sections": [
      {
        "heading": "Carnation and snowdrop, the same two-flower pattern as every other month",
        "body": [
          "The Old Farmer's Almanac lists carnation and snowdrop as January's birth flowers, continuing the same two-per-month pattern this site has documented for July through December and February. As explained on this site's [August birth flower](/august-birth-flower/) page, the jewelry trade settled birthstones with a single 1912 convention, while birth flowers never got an equivalent standard-setting body. Competing 19th-century flower dictionaries picked different favorites, and the modern lists that followed generally kept more than one candidate rather than forcing a choice.",
          "That accounts for why there are two flowers. It doesn't explain either one, and both carry more disputed history than a typical florist blurb has room for."
        ]
      },
      {
        "heading": "Carnation: a name with three rival origin stories",
        "body": [
          "The species behind January's birth flower is Dianthus caryophyllus, commonly called carnation or clove pink, a Mediterranean native that has been in cultivation for roughly 2,000 years, according to Wikipedia's entry on the species. The genus name Dianthus was coined by the Greek botanist Theophrastus from the words for \"divine\" and \"flower.\" The common name \"carnation\" is a separate puzzle Wikipedia's entry describes as unresolved: it may derive from the Latin corona, \"wreath\" or \"crown,\" because the flower was used in Greek and Roman ceremonial garlands; or from the Latin caro, genitive carnis, \"flesh,\" a reference to the bloom's original pinkish color; or from incarnatio, the Christian term for God taking on flesh. None of the three has displaced the others as the accepted answer.",
          "The original wild color was a bright pinkish-purple. Centuries of cultivation have since produced red, yellow, white, and green varieties, along with the frilled, clove-scented hybrids sold by florists today."
        ],
        "image": {
          "src": "/images/january-birth-flower-carnation.jpg",
          "alt": "Dianthus caryophyllus, the carnation, January's birth flower, whose common name has three competing and unresolved origin stories",
          "credit": "Photo by Krzysztof Ziarnek, Kenraiz, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dianthus_caryophyllus_%27Cornelia%27_kz01.jpg), CC BY-SA 4.0"
        }
      },
      {
        "heading": "The Mother's Day flower, and the color story that gets flattened online",
        "body": [
          "Carnations are tied to a second, better-documented history: Mother's Day. In 1907, Anna Jarvis chose the carnation as the holiday's emblem because it had been her own mother's favorite flower, according to Wikipedia's entry on the US observance. At the first formal Mother's Day service, held at Andrews Methodist Episcopal Church in Grafton, West Virginia, on May 10, 1908, Jarvis distributed 500 carnations, and the flower she chose was specifically white, meant to represent the purity of a mother's love.",
          "The federal government's own paper trail backs up which color came first. Five years after Jarvis's Grafton service, Alabama Representative James Heflin introduced House Resolution 103 on May 10, 1913, requesting that President Wilson, his Cabinet, and every member of Congress wear a white carnation, \"or some other white flower,\" the next day to honor mothers as \"the greatest source of our country's strength and inspiration,\" according to the US House of Representatives' own historical archive. Members of the House did exactly that on May 11, 1913, the Capitol's first observance of the holiday, years before the pink-for-living, white-for-deceased color code florists later promoted existed at all.",
          "A shortage of white carnations, combined with florists' interest in selling a wider range of stock for the holiday, led the flower industry to invent a color code: pink or red for a mother who was living, white for one who had died. That convention was heavily promoted until it became the popular custom seen in churches, and it's frequently what retail sites mean today when they call pink the Mother's Day carnation, sometimes stating outright that pink was Jarvis's original choice. The documented history, per Wikipedia's sourced account, says otherwise: white came first, and the pink option came later, from florists rather than from Jarvis.",
          "A separate, older legend also ties pink carnations to motherhood and predates Jarvis by centuries. \"According to Christian legend, the first pink carnation on Earth grew from Mary's tears when she wept for Jesus as he carried his cross,\" The Old Farmer's Almanac writes. That's a piece of medieval religious folklore, not a description of anything that happened in 1907 or 1908. The two stories get told back to back often enough online that they read as one continuous history, when they're really two separate explanations for the same color, arriving roughly 1,875 years apart."
        ]
      },
      {
        "heading": "Snowdrop: the \"milk flower,\" and the different genus sold under a similar name",
        "body": [
          "Galanthus, the snowdrop's genus, combines the Greek words gala (\"milk\") and anthos (\"flower\"), a reference to the bloom's pure white color, per Wikipedia's entry on the genus. It comprises roughly 20 species of small, bulbous perennials, and January's birth flower is usually the most common of them, Galanthus nivalis. Snowdrops are native to the cooler mountainous and wooded regions of southern Europe and Asia Minor and have since naturalized across the United States, per The Old Farmer's Almanac; the same source notes that ancient Greeks used snowdrop extract for its mind-altering effects, and that monks and midwives are thought to have carried the plant into wider use across Europe as a folk remedy.",
          "Wikipedia's entry on Galanthus notes that snowdrops are commonly confused with two related genera in the same plant tribe, Leucojum and Acis, both of which go by the common name \"snowflake.\" All three share the family Amaryllidaceae and a passing resemblance in their white, drooping flowers, but Galanthus, Leucojum, and Acis are distinct genera, not interchangeable names for the same plant."
        ],
        "image": {
          "src": "/images/january-birth-flower-snowdrop.jpg",
          "alt": "Galanthus nivalis, the snowdrop, January's other birth flower, whose genus name means \"milk flower\" in Greek",
          "credit": "Photo by André Karwath aka Aka, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Galanthus_nivalis_close-up_aka.jpg), CC BY-SA 2.5"
        }
      },
      {
        "heading": "A flower that means both hope and, in British folklore, death",
        "body": [
          "The Old Farmer's Almanac gives the snowdrop a Christian origin story of its own, separate from the carnation's: an angel is said to have turned falling snowflakes into snowdrops and given them to Adam and Eve as a sign of hope after their expulsion from Eden. That legend sits alongside a documented, much darker strand of British folklore. A single snowdrop bloom brought indoors was traditionally believed to foretell a death, an association the Almanac ties to the flower's habit of growing in graveyards.",
          "That superstition isn't a vague historical footnote. Plant-Lore, a folklore archive maintained by botanist Roy Vickery, has collected a string of first-person accounts of the belief from across England, Scotland, and Wales, with submitted reports dating from 1983 through 2019. One correspondent recalled being a student nurse in Hereford in 1952, when a landlady scolded her for bringing in a bunch of snowdrops a farmer's wife had given her, warning that they \"would bring death into the house.\" Another correspondent, writing in 2019, traced her own family's version of the belief back further still, reasoning that since her grandmother (born in 1901) had already been taught it, the superstition probably dates back to at least the early 1900s, though that's her own inference rather than a report from that era. Others describe grandmothers and mothers refusing to allow snowdrops indoors at all, even as potted plants, well into the late 20th century. The same flower stands for hope in one telling and an omen of death in another, and the death superstition alone has been recorded in continuous use for at least the past four decades."
        ]
      },
      {
        "heading": "January's other reference points",
        "body": [
          "For the gemstone side of a January birthday, this site's [January birthstone](/january-birthstone/) page covers garnet, the one month in this birthstone series where every source checked, from a centuries-old tradition through a 2019 revision, agrees on the same stone.",
          "Snowdrop isn't the only birth flower on this site carrying a graveside association. This site's [November birth flower](/november-birth-flower/) page covers chrysanthemum, the customary funeral and cemetery flower across much of Catholic Europe, where giving one to a living host is a real etiquette mistake rather than a coincidence of folklore."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is January's birth flower?",
        "answer": "Carnation and snowdrop, per The Old Farmer's Almanac. Like most months on a modern birth-flower list, January carries two flowers because no trade body ever standardized a single official calendar the way the jewelry industry did for birthstones in 1912."
      },
      {
        "question": "Where does the name \"carnation\" come from?",
        "answer": "Nobody has settled it. Wikipedia's entry on the species lists three competing theories: the Latin corona (\"crown,\" for its use in ceremonial garlands), the Latin caro/carnis (\"flesh,\" for its original pinkish color), or incarnatio, the Christian term for God taking on flesh. None has displaced the others as the accepted origin."
      },
      {
        "question": "Did Anna Jarvis choose pink or white carnations for Mother's Day?",
        "answer": "White. Jarvis distributed 500 white carnations at the first formal Mother's Day service in Grafton, West Virginia, on May 10, 1908, to represent the purity of a mother's love. The custom of pink for a living mother and white for a deceased one was a later addition promoted by florists, partly in response to a shortage of white carnations."
      },
      {
        "question": "Is the pink carnation \"Virgin Mary's tears\" legend the same story as the Mother's Day tradition?",
        "answer": "No. The Virgin Mary legend is a piece of older Christian folklore claiming the first pink carnation grew where her tears fell during the crucifixion. Anna Jarvis's choice of carnation as the Mother's Day flower is separate, documented 20th-century history from 1907 and 1908. The two are often retold together online as if they were one continuous story."
      },
      {
        "question": "What does snowdrop mean as a birth flower?",
        "answer": "Hope and purity, tied to a Christian legend in which an angel turned snowflakes into snowdrops as a sign of hope for Adam and Eve after Eden. The same flower also carries a documented British folk superstition that a single bloom brought indoors foretells a death, a belief still reported by name into the 2010s."
      },
      {
        "question": "Is the snowdrop related to the flower called \"snowflake\"?",
        "answer": "It's related but not identical. Snowdrop (Galanthus) is commonly confused with two other genera nicknamed \"snowflake,\" Leucojum and Acis. All three share the family Amaryllidaceae and a similar white, drooping flower shape, but they are distinct genera."
      }
    ],
    "sources": [
      {
        "label": "The Old Farmer's Almanac — January Birth Flowers: Carnation and Snowdrop",
        "url": "https://www.almanac.com/content/january-birth-flowers"
      },
      {
        "label": "Wikipedia — Dianthus caryophyllus",
        "url": "https://en.wikipedia.org/wiki/Dianthus_caryophyllus"
      },
      {
        "label": "Wikipedia — Mother's Day (United States)",
        "url": "https://en.wikipedia.org/wiki/Mother%27s_Day_(United_States)"
      },
      {
        "label": "US House of Representatives, Office of the Historian — The First National Celebration of Mother's Day",
        "url": "https://history.house.gov/HistoricalHighlight/Detail/35444"
      },
      {
        "label": "Wikipedia — Galanthus",
        "url": "https://en.wikipedia.org/wiki/Galanthus"
      },
      {
        "label": "Plant-Lore — Snowdrop",
        "url": "https://www.plant-lore.com/snowdrop/"
      }
    ],
    "image": "/images/january-birth-flower-carnation.jpg",
    "imageAlt": "Dianthus caryophyllus, the carnation, January's birth flower, whose common name has three competing and unresolved origin stories",
    "imageCredit": "Photo by Krzysztof Ziarnek, Kenraiz, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dianthus_caryophyllus_%27Cornelia%27_kz01.jpg), CC BY-SA 4.0"
  },
  {
    "slug": "movember",
    "category": "Observances",
    "title": "Movember: All of November, and a Second Movember from 1999",
    "description": "Movember runs all of November worldwide. A separate, unrelated group coined the same name in Adelaide back in 1999, years before today's charity began.",
    "published": "2026-08-19",
    "updated": "2026-08-19",
    "coreSummary": "Movember is observed across all of November, every year, worldwide, as a moustache-growing fundraiser for men's health. The global movement people mean today traces to Melbourne, Australia, where Travis Garone and Luke Slattery recruited 30 friends in 2003; the Movember Foundation's own current site and Wikipedia's article both instead date the founding to 2004, when Adam Garone and Justin Coghlan formalized the campaign into a registered company. A separate, unconnected group in Adelaide had already coined the word \"Movember\" in 1999 for an RSPCA fundraiser, with no organizational link to the men's-health movement that carries the name today.",
    "dateRule": {
      "kind": "fixed",
      "text": "Movember is observed across all of November, every year, worldwide, from November 1 through November 30, rather than on a single date or a floating week within the month.",
      "status": "conventional",
      "source": {
        "label": "Movember — Our History (us.movember.com)",
        "url": "https://us.movember.com/about/history"
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
      "caveat": "Every source agrees on the month itself: no rival date range circulates for Movember the way it does for some other observances on this calendar. What is missing is any government behind that range. No parliament or Congress has legislated it and no head of state proclaims it in any of the more than twenty countries where it runs; Movember has always been organized by a private charitable foundation, not designated by law. That absence is worth stating plainly, because the foundation's scale, more than a billion dollars raised worldwide, can make the observance read like it has some kind of official standing behind its dates. It does not. The foundation sets its own calendar every year, the same way it always has."
    },
    "founding": {
      "status": "documented",
      "text": "The word \"Movember\" predates the men's-health movement that made it famous. In November 1999, Seven Network's Adelaide newsroom aired a segment on a group of young men in Adelaide, South Australia, who had coined the term themselves and organized roughly 80 participants to grow moustaches for the month. Their cause had nothing to do with men's health: the self-styled \"Movember Committee\" sold T-shirts under the slogan \"Growing whiskers for whiskers\" to raise money for the RSPCA, the animal-welfare charity. That 1999 Adelaide campaign became a local phenomenon in its own right, but it has no organizational connection to the global movement that carries the same name today, and the current Movember Foundation's own history pages make no mention of it.\n\nThe movement most people mean by Movember began in Melbourne. According to the foundation's own retelling of its early years, Travis Garone and Luke Slattery were having a beer at the Gypsy Bar in Fitzroy in 2003 when their conversation turned to the moustache's disappearance from recent fashion. Inspired by a friend's mother who was fundraising for breast cancer, they built a men's-health campaign around growing one instead, settled on prostate cancer as the cause, designed the rules the campaign still uses, and recruited 30 friends by email under the subject line \"Are you man enough to be my man?\" Each participant paid ten dollars to take part.\n\nWhether 2003 or 2004 is the founding year depends on which source is asked, and the two years are not simply describing two different steps of the same story. Wikipedia's article states in its main text that the Melbourne group's 30-moustache recruitment event itself happened in 2004, the same event the foundation's own retelling dates to 2003, not a separate formalization step; Wikipedia never mentions a company or website being registered at all. Wikipedia's own article also contradicts itself on the point: its category tags file the page under \"2003 establishments in Australia,\" an inconsistency inside one source, not just between sources. The foundation's current site sides with 2004 too, marking its age as \"twenty-two years\" as of an August 2026 update, but for a different reason: that count matches 2004 as the year Adam Garone and Justin \"JC\" Coghlan registered a company and a website and ran the first campaign under a formal structure, in which 450 Mo Bros raised AUD 54,000 and the first international participants, in Spain and the United Kingdom, signed on. The foundation's own list of that original 30 includes both Adam Garone and JC by name alongside Travis Garone and Luke Slattery, so the four co-founders were all involved as participants from the informal 2003 start; what changed in 2004 was that Adam and JC took on the work of running it as an organization. Wikipedia's 2004 date and the foundation's 2004 date, in other words, agree on the year without agreeing on what happened in it.\n\nThe campaign's causes also grew well after its founding. The original 2003 and 2004 campaigns raised money for prostate cancer alone. In 2006, the same year the Movember Foundation became a registered Australian charity, the foundation partnered with beyondblue, Australia's national depression initiative, adding mental health as a second cause and reaching New Zealand for the first time. Testicular cancer joined later still, rounding out the three causes, prostate cancer, testicular cancer, and mental health and suicide prevention, that the foundation names today, though no source consulted for this page pins an exact year for testicular cancer's addition specifically. Movember reached North America through informal 2007 campaigns in the United States and Canada, led by Adam Garone from Los Angeles, and Movember USA obtained official U.S. charity status in 2009. By the foundation's own most recently updated figures, Movember has funded more than AUD 1.8 billion in men's-health work since it began.\n\nOne sourcing note on the paragraphs above: the year-by-year narrative, the Gypsy Bar conversation, the ten-dollar buy-in, the 450 Mo Bros and AUD 54,000 figure, and the 2006 to 2009 expansion, is drawn from a Movember-branded retrospective republished by M2 Magazine, not from the foundation's own currently live history page, which states only the campaign's age and its cumulative total raised. Nothing in the two accounts conflicts where they overlap, but a reader checking the live page directly will not find the detailed narrative there.",
      "source": {
        "label": "Movember — Our History (us.movember.com)",
        "url": "https://us.movember.com/about/history"
      }
    },
    "sections": [
      {
        "heading": "All of November, with no government behind it",
        "body": [
          "Movember runs the full 30 days of November, every year, in every country where the foundation operates. There is no rival date range to reconcile here and no nth-weekday arithmetic to compute: November 1 marks the start of the observance in the table above, and it runs through November 30 in every case.",
          "What sets Movember apart from many observances on this calendar is not a competing date but a missing legal one. No parliament, Congress, or head of state has ever legislated or proclaimed the month in any of the more than twenty countries where campaigns run. It remains, everywhere, a campaign a private charitable foundation organizes on its own authority, no different in that respect from No-Shave November, the unrelated American campaign it is most often confused with."
        ]
      },
      {
        "heading": "A second Movember, unconnected and four years earlier",
        "body": [
          "The name \"Movember\" was already in use before the charity that made it famous existed. On November 30, 1999, Seven Network's Adelaide newsroom broadcast a segment on a self-styled \"Movember Committee,\" a group of young men in Adelaide who had coined the term themselves and grown moustaches through the month, drawing roughly 80 participants. Their cause was animal welfare, not men's health: they sold T-shirts under the slogan \"Growing whiskers for whiskers\" to benefit the RSPCA. The broadcast itself, not a retrospective written by anyone connected to today's foundation, is the primary record of that campaign; it has since been archived and remains viewable.",
          "The Movember Foundation's own history pages do not mention the 1999 Adelaide campaign at all, and nothing found for this page suggests the two groups ever had contact. A reader who assumes \"Movember\" was coined by the Melbourne founders in 2003 is repeating a claim the record does not actually support; the word predates them by roughly four years, attached to an entirely different cause."
        ],
        "image": {
          "src": "/images/movember-timeline.svg",
          "alt": "Timeline showing Movember's path from an unrelated 1999 Adelaide fundraiser through the 2003 Melbourne origin, 2004 formalization, and 2006 charity status to today"
        }
      },
      {
        "heading": "One pub conversation, then a formal launch a year later",
        "body": [
          "The movement people mean today by Movember started with a beer at the Gypsy Bar in Fitzroy, Melbourne, in 2003. Travis Garone and Luke Slattery, talking about how the moustache had vanished from recent fashion, decided to bring it back as a fundraiser, inspired by a friend's mother who was raising money for breast cancer. They picked prostate cancer as their cause, designed the rules the campaign still follows, charged ten dollars to take part, and emailed friends under the subject line \"Are you man enough to be my man?\" Thirty of them said yes.",
          "Ask what year Movember was founded, though, and sources split. The foundation's own current site describes its age as \"twenty-two years,\" counting from 2004, and Wikipedia's article text places the Melbourne group's founding event in that same year, even while the article's own category tag files it under 2003. The gap traces to a real organizational change: 2004 was when Adam Garone and Justin \"JC\" Coghlan turned the informal 2003 challenge into a registered company with a website and a first funded campaign, raising AUD 54,000 from 450 participants, including the first Mo Bros outside Australia, in Spain and the UK. Both Garone and Coghlan, however, appear by name on the foundation's own list of that original 30 from 2003, so they were part of the campaign from its first year as participants; 2004 is when they took charge of running it as an organization rather than when they first grew a moustache for it."
        ]
      },
      {
        "heading": "From a $10 buy-in to $1.8 billion, and a second cause",
        "body": [
          "The 2003 and 2004 campaigns raised money for one cause: prostate cancer. In 2005, the Prostate Cancer Foundation of Australia became Movember's first official partner, and roughly 9,300 Mo Bros raised AUD 1.2 million. In 2006, the Movember Foundation registered as an official Australian charity, launched in New Zealand, and partnered with beyondblue, the national depression initiative, adding mental health as a second cause for the first time.",
          "The campaign reached North America in 2007, when Adam Garone moved to Los Angeles to launch informal U.S. and Canadian campaigns, and Movember USA obtained official American charity status in 2009. Testicular cancer joined later still, completing the three causes the foundation names today: prostate cancer, testicular cancer, and mental health and suicide prevention. By the foundation's own most recently updated figures, Movember has funded more than AUD 1.8 billion in men's-health work worldwide since it began, spanning more than 1,250 funded programs across upward of twenty countries."
        ]
      },
      {
        "heading": "Movember is not No-Shave November",
        "body": [
          "The two campaigns are frequently confused, and Movember's own rules are stricter than the confusion suggests. Movember asks participants to start November clean-shaven and grow a moustache only, nothing else, over the course of the month. [No-Shave November](/no-shave-november/), by contrast, has no such requirement: participants simply stop shaving and grooming, whether that produces a beard, a moustache, or something else entirely, and the campaign began independently in 2009 out of one Chicago family's loss, six years after Movember's own 2003 start and unconnected to it.",
          "The two campaigns also fund different things by design. Movember directs its money toward prostate cancer, testicular cancer, and mental health and suicide prevention specifically. No-Shave November's current operator, Fight Colorectal Cancer, directs its funds toward colorectal cancer research and its partner charities. Growing hair for one does not support the other's cause, even though both campaigns run the same 30 days."
        ]
      },
      {
        "heading": "How Movember is actually observed",
        "body": [
          "Movember carries no legal status anywhere it runs: no country's offices close for it, and no workplace is required to recognize it. Participation is built around the moustache itself. Registered participants, called Mo Bros, start November clean-shaven and grow a moustache for the month, using the foundation's fundraising platform to collect pledges from friends, family, and coworkers. Women who fundraise or organize on a Mo Bro's behalf are called Mo Sistas. Teams, including workplace teams, are common, and local fundraising events, from casual meetups to formal galas, run throughout the month in the countries where Movember has an official presence.",
          "Because the foundation runs the calendar itself rather than any government, the specific programs it funds and the causes it emphasizes shift somewhat from year to year, even though the underlying month never moves. What has stayed constant since the campaign's earliest years is the core mechanic: grow a moustache in public for 30 days, and let the visible, temporary change stand in for a conversation about men's health that participants might not otherwise have."
        ]
      }
    ],
    "faq": [
      {
        "question": "What are the exact dates of Movember?",
        "answer": "All of November, every year, worldwide, from November 1 through November 30. It is not tied to a single date or a floating week within the month."
      },
      {
        "question": "Who founded Movember?",
        "answer": "Travis Garone and Luke Slattery recruited 30 friends in Melbourne, Australia, in 2003 to grow moustaches for prostate cancer awareness. Adam Garone and Justin \"JC\" Coghlan, both of whom had already taken part in that original 2003 group, formalized the effort into a registered campaign with a website in 2004."
      },
      {
        "question": "Was Movember founded in 2003 or 2004?",
        "answer": "Sources differ, and not just on the year. The foundation's own account puts the original 30-person moustache event in 2003 and dates 2004 to a separate step, registering a company and a website. Wikipedia's article instead dates the 30-person event itself to 2004, contradicting the foundation on when that specific event happened, and never mentions a company or website at all. Both sources land on 2004 for different reasons, and Wikipedia's own category tags file the same article under \"2003 establishments in Australia,\" disagreeing with its own text."
      },
      {
        "question": "Is the 1999 Adelaide \"Movember\" connected to today's charity?",
        "answer": "No. A separate group of young men in Adelaide, South Australia, coined the term \"Movember\" and grew moustaches to raise money for the RSPCA animal-welfare charity in 1999, four years before the Melbourne group that became today's Movember Foundation. The two campaigns have no documented organizational connection, and the current foundation's own history pages do not mention the 1999 Adelaide campaign."
      },
      {
        "question": "Is Movember the same as No-Shave November?",
        "answer": "No. Movember requires growing a moustache specifically, starting from clean-shaven, and funds prostate cancer, testicular cancer, and mental health and suicide prevention. No-Shave November allows any kind of unshaven hair growth and funds colorectal cancer research through its current operator, Fight Colorectal Cancer. Movember also started six years earlier, in 2003, compared to No-Shave November's 2009 founding."
      },
      {
        "question": "Is Movember a legal holiday or a government-recognized observance?",
        "answer": "No. No country's parliament or Congress has legislated Movember and no head of state has proclaimed it. It is organized entirely by the Movember Foundation, a private charity, in every country where it runs."
      },
      {
        "question": "How much money has Movember raised?",
        "answer": "More than AUD 1.8 billion since the campaign began, according to the Movember Foundation's own most recently updated figures, funding upward of 1,250 men's-health programs across more than twenty countries."
      }
    ],
    "sources": [
      {
        "label": "Movember — Our History (us.movember.com)",
        "url": "https://us.movember.com/about/history"
      },
      {
        "label": "M2 Magazine — \"A Hairy Tale: The History of Movember's Early Years\" (republished Movember foundation account)",
        "url": "https://m2now.com/a-hairy-tale-the-history-of-movembers-early-years/"
      },
      {
        "label": "Wikipedia — Movember",
        "url": "https://en.wikipedia.org/wiki/Movember"
      },
      {
        "label": "Seven Nightly News — \"Movember Mo-Phenomenon,\" Channel 7 Adelaide, 30 November 1999 (archived)",
        "url": "https://web.archive.org/web/20210826100209/https://www.youtube.com/watch?v=NPH0qQFqs0M"
      },
      {
        "label": "No Shave November — Our History (no-shave.org, operated by Fight Colorectal Cancer)",
        "url": "https://no-shave.org/"
      }
    ],
    "image": "/images/movember-mo-bros.jpg",
    "imageAlt": "A group of Mo Bros displaying the moustaches they grew for Movember",
    "imageCredit": "Photo by Kris Walton, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Movember.jpg), CC BY-SA 3.0"
  },
  {
    "slug": "prostate-cancer-awareness-month",
    "category": "Observances",
    "title": "Prostate Cancer Awareness Month: September, Except Once in 2001",
    "description": "Prostate Cancer Awareness Month covers all of September. In 2001 the Senate asked for September, but that year's presidential proclamation named November instead.",
    "published": "2026-08-19",
    "updated": "2026-08-19",
    "coreSummary": "Prostate Cancer Awareness Month is observed across all of September, every year, in the United States, with one documented exception. The observance traces to a 1989 screening campaign that named the third week of September Prostate Cancer Awareness Week, was expanded to the full month as National Prostate Health Month by the American Foundation for Urological Disease in 1999, and got its cancer-specific name from a Senate resolution in 2001 that asked for September, only for that year's presidential proclamation to name November instead. September and the name have gone together every year since President George W. Bush's Proclamation 7700 in 2003. No permanent federal statute renews the month automatically; every President has proclaimed or messaged it since, and Congress has periodically passed its own non-binding resolutions naming specific years.",
    "dateRule": {
      "kind": "fixed",
      "text": "Prostate Cancer Awareness Month is observed across all of September, every year, from September 1 through September 30, rather than on a single date or a floating week within the month. The Senate asked the President to proclaim September 2001 under this name; that year's proclamation instead named November. September has been the proclaimed month every year since President George W. Bush's Proclamation 7700 on September 1, 2003.",
      "source": {
        "label": "George W. Bush — Proclamation 7700, National Prostate Cancer Awareness Month, 2003 (Federal Register)",
        "url": "https://www.federalregister.gov/documents/2003/09/05/03-22811/national-prostate-cancer-awareness-month-2003"
      },
      "occurrences": [
        {
          "date": "2026-09-01",
          "weekday": "Tuesday"
        },
        {
          "date": "2027-09-01",
          "weekday": "Wednesday"
        },
        {
          "date": "2028-09-01",
          "weekday": "Friday"
        },
        {
          "date": "2029-09-01",
          "weekday": "Saturday"
        },
        {
          "date": "2030-09-01",
          "weekday": "Sunday"
        },
        {
          "date": "2031-09-01",
          "weekday": "Monday"
        }
      ],
      "caveat": "There is no competing date range for this observance today: every current source agrees the entire month of September is Prostate Cancer Awareness Month, so the table above lists September 1 as each year's start with the understanding that the observance runs through September 30. That was not always true. On August 3, 2001, the Senate agreed to Resolution 138, asking the President to proclaim September 2001 under this exact name. President George W. Bush's proclamation that year instead named November 2001, not September, as National Prostate Cancer Awareness Month. The cancer-specific name existed for two years, attached to two different months, before September 2003 became the month that has stuck every year since. A separate, older observance, Prostate Cancer Awareness Week, is nested inside the month each year from September 17 to 24. It predates the month-long observance by a decade and is not simply a shorthand for it."
    },
    "founding": {
      "status": "documented",
      "text": "The observance began a decade before it had a name resembling today's. In 1989, a newly formed Prostate Cancer Education Council, made up of urologists, oncologists, behavioral researchers, and patient advocates, commissioned a health survey that March to gauge public knowledge of prostate cancer, held a press conference in New York City that summer, and designated the third week of September, September 17 to 24, 1989, as Prostate Cancer Awareness Week. Its stated purpose was blunt: to find out whether men could be recruited to get screened at all for what organizers called \"the ignored male disease.\" The week grew into what several sources describe as the country's largest single cancer-screening program, tracked in peer-reviewed follow-up studies published in CA: A Cancer Journal for Clinicians through at least 1997.\n\nA full month arrived a decade after the first week. In 1999, the American Foundation for Urological Disease (AFUD), renamed the Urology Care Foundation in 2011, designated all of September as National Prostate Health Month, an observance about prostate health generally rather than cancer specifically. The cancer-specific name came from Congress two years later: on August 3, 2001, the Senate agreed to Resolution 138 by unanimous consent, sponsored by Senator Conrad Burns of Montana and cosponsored by 58 other senators, which asked the President to proclaim September 2001 as \"National Prostate Cancer Awareness Month.\" The resolution requested that one specific month; it did not, on its own, make the name or the September date permanent.\n\nWhat the President actually proclaimed that year did not match the Senate's request. On November 1, 2001, George W. Bush proclaimed National Prostate Cancer Awareness Month, but for November 2001, the first presidential use of the cancer-specific name on record, attached to a different month than Congress had asked for. September and the name came together for good two years later: on September 1, 2003, Bush's Proclamation 7700 named September 2003 National Prostate Cancer Awareness Month, citing an estimated 220,000 new diagnoses and nearly 29,000 deaths that year. September has been the proclaimed month every year since. No standing law compels a proclamation every year; each one rests on the President's own authority. Obama proclaimed the month in at least 2011 and 2015, Biden issued a formal proclamation in 2022, and both Trump administrations have marked it, first as a 2017 statement and again as a September 2, 2025 presidential message citing more than 300,000 annual diagnoses and more than 35,000 deaths. Congress has periodically added its own non-binding resolutions naming specific years since, including versions for 2021 (S.Res.378) and 2022 (S.Res.776), and the House introduced a matching resolution for 2025 (H.Res.675). None of these amounts to a permanent law that renews the observance automatically; each year's recognition is its own separate act.",
      "source": {
        "label": "George W. Bush — Proclamation 7700, National Prostate Cancer Awareness Month, 2003 (Federal Register)",
        "url": "https://www.federalregister.gov/documents/2003/09/05/03-22811/national-prostate-cancer-awareness-month-2003"
      }
    },
    "sections": [
      {
        "heading": "The whole month, every year",
        "body": [
          "Prostate Cancer Awareness Month covers all 30 days of September, not a single date or a floating week inside it. There is no nth-weekday arithmetic to compute and no rival set of dates from a competing organization to sort out; every federal, medical, and advocacy source treats the full month the same way.",
          "What has genuinely changed since the observance began is not the calendar but the name attached to it, and the paperwork behind that name. A 1999 designation covered prostate health broadly; a 2003 proclamation narrowed the focus to cancer specifically. That distinction, not the date range, is the part most calendar sites skip past."
        ]
      },
      {
        "heading": "1989: A screening week, not yet a month",
        "body": [
          "The observance's roots are in a single question: could men be persuaded to get screened for a disease few of them talked about? In 1989, the newly formed Prostate Cancer Education Council, a coalition spanning urology, oncology, behavioral research, and patient and minority advocacy groups, commissioned a health survey that March to measure public knowledge, attitudes, and health practices around prostate cancer. That summer, the Council held a press conference in New York City and designated September 17 to 24, 1989, as the first Prostate Cancer Awareness Week.",
          "The week was not a symbolic gesture. It became, by several accounts, the largest single cancer-screening program run in the United States at the time, offering free or low-cost prostate exams at sites around the country. Academic follow-ups tracked the campaign's growth for years afterward, including a peer-reviewed summary of findings published in CA: A Cancer Journal for Clinicians covering the 1997 iteration, September 22 to 28 that year, eight years into the campaign."
        ]
      },
      {
        "heading": "1999 and 2001: A foundation names the month, then Congress names the disease",
        "body": [
          "A full month did not exist until ten years after the first week. In 1999, the American Foundation for Urological Disease (AFUD), the organization that later became the Urology Care Foundation in 2011, designated all of September as National Prostate Health Month. The name mattered: this was a broader observance about prostate health in general, covering conditions like prostatitis and benign prostatic hyperplasia alongside cancer, not a cancer-specific campaign.",
          "The cancer-specific name came from Congress two years later. On August 3, 2001, the Senate agreed to Resolution 138 by unanimous consent, a measure sponsored by Senator Conrad Burns of Montana and cosponsored by 58 other senators. It asked the President to proclaim September 2001 as \"National Prostate Cancer Awareness Month,\" citing an estimated 198,100 diagnoses and 31,500 deaths that year. A Senate resolution of this kind is a request, not an order; it does not by itself create a proclamation, set a permanent name, or fix a date."
        ]
      },
      {
        "heading": "2001 to 2003: A name attached to two different months",
        "body": [
          "What the President actually proclaimed did not match what the Senate had asked for. On November 1, 2001, George W. Bush signed a proclamation declaring November 2001, not September, \"National Prostate Cancer Awareness Month,\" the first presidential use of the cancer-specific name on record. For that one year, the name existed, but attached to a different month than the one Congress had in mind.",
          "September and the name came together for good two years later. On September 1, 2003, Bush signed Proclamation 7700, which read in part: \"Prostate cancer is the second most common form of cancer among men in the United States. This year alone, it is estimated that more than 220,000 new cases of prostate cancer will be diagnosed and that nearly 29,000 men will die from this disease.\" That proclamation named September 2003 National Prostate Cancer Awareness Month, and September has been the proclaimed month in every year since."
        ],
        "image": {
          "src": "/images/prostate-cancer-awareness-month-timeline.svg",
          "alt": "Timeline showing Prostate Cancer Awareness Month's path from the 1989 screening week through the 1999 Prostate Health Month designation, the 2001 Senate resolution and November proclamation, to Bush's 2003 proclamation that put the name on September for good"
        }
      },
      {
        "heading": "Three weeks inside one month",
        "body": [
          "September carries more than one nested observance related to prostate health, a detail most calendar listings compress into a single line. Prostatitis Awareness Week runs September 10 to 16. Prostate Cancer Awareness Week, the direct descendant of the original 1989 campaign, runs September 17 to 24, the same dates that first press conference chose. Benign Prostatic Hyperplasia (BPH) Awareness Week closes out the month, September 24 to 30.",
          "One observance that is not part of this cluster, despite sharing an audience: Testicular Cancer Awareness Week, which falls in a completely different part of the year, the first week of April. A reader who sees \"prostate\" and \"testicular\" awareness campaigns both described as men's-health observances can reasonably assume they share a season. They do not."
        ]
      },
      {
        "heading": "A proclamation nobody has to renew",
        "body": [
          "Since Bush's 2003 proclamation put the name back on September, every administration has marked the month there, though the format has shifted. Obama proclaimed it formally in at least 2011 and 2015. Biden issued a full proclamation in 2022, published in the Federal Register the following month. Trump's first administration issued a statement in 2017 focused on falling incidence and mortality rates; his second administration issued a September 2, 2025 presidential message, a different document format than a proclamation, stating that \"every year, more than 300,000 men are diagnosed with prostate cancer, and more than 35,000 die from the disease.\" Congress has added its own layer on top of the executive branch's: the Senate passed non-binding resolutions naming specific years in 2021 (S.Res.378) and 2022 (S.Res.776), and the House introduced a matching resolution for 2025 (H.Res.675). None of this constitutes a standing law; each year's recognition, from either branch, is a fresh act.",
          "The American Cancer Society's most recent estimate, for 2026, puts the numbers higher than the 2025 presidential message: about 333,830 new diagnoses and 36,320 deaths, with roughly 1 in 8 men expected to be diagnosed with prostate cancer at some point in their lives. The two figures are not contradictory; they come from different years and different estimating methods, and both describe a disease whose count of new cases has been rising by about 3 percent a year since 2014, according to the ACS. Prostate Cancer Awareness Month carries no legal holiday status. No federal offices close and no paid leave attaches to it; what happens instead is decentralized, through screening events, the light blue awareness ribbon, and campaigns run by hospitals, advocacy groups, and employers throughout the month.",
          "September's observance sits alongside two other awareness months on this calendar built the same way, a professional or advocacy organization starts it, a President later proclaims it, and Congress occasionally adds a resolution without ever making it permanent. [Breast Cancer Awareness Month](/breast-cancer-awareness-month/), observed the following month, followed a close variant of the same path. [Movember](/movember/), which raises money for prostate and testicular cancer research every November, took a different route entirely: it started as a bar bet in Melbourne with no government involvement at all. [International Men's Day](/international-mens-day/), each November 19, covers men's health as one part of a broader observance rather than as its whole focus."
        ]
      }
    ],
    "faq": [
      {
        "question": "What are the exact dates of Prostate Cancer Awareness Month?",
        "answer": "The entire month of September, every year, from September 1 through September 30. It is not tied to a single date or a floating week within the month."
      },
      {
        "question": "Who founded Prostate Cancer Awareness Month?",
        "answer": "The Prostate Cancer Education Council designated the third week of September as Prostate Cancer Awareness Week in 1989. The American Foundation for Urological Disease expanded that into a full month, National Prostate Health Month, in 1999. The cancer-specific name came from the Senate in 2001, in a resolution asking for September, though that year's presidential proclamation named November instead. President George W. Bush's Proclamation 7700 put the name on September for good on September 1, 2003."
      },
      {
        "question": "Is Prostate Cancer Awareness Month the same as Prostate Cancer Awareness Week?",
        "answer": "No. Prostate Cancer Awareness Week runs September 17 to 24 each year and traces to a 1989 screening campaign, a full decade before the month-long observance existed. The week is nested inside the month rather than being another name for it."
      },
      {
        "question": "Why did the name change from \"Prostate Health Month\" to \"Prostate Cancer Awareness Month\"?",
        "answer": "The American Foundation for Urological Disease's original 1999 name covered prostate health broadly, including non-cancerous conditions like prostatitis and benign prostatic hyperplasia. The cancer-specific name arrived via a Senate resolution in 2001 and became a fixed annual fixture of presidential proclamations starting in 2003, without changing the dates the observance covers."
      },
      {
        "question": "Did the observance always fall in September?",
        "answer": "Nearly always, but not in 2001. The Senate asked the President to proclaim September 2001 as National Prostate Cancer Awareness Month, but that year's presidential proclamation named November 2001 instead. September has been the proclaimed month in every year since 2003."
      },
      {
        "question": "Did Congress pass a permanent law making this automatic every year?",
        "answer": "No. Presidents have proclaimed or messaged the month under their own executive authority every year since 2003, without a standing statute requiring it. Congress has periodically passed its own non-binding resolutions naming specific years, including 2021, 2022, and 2025, but none of them renews the observance automatically going forward."
      },
      {
        "question": "Is Prostate Cancer Awareness Month a federal holiday?",
        "answer": "No. No federal offices close and no paid leave attaches to it. It is marked through presidential proclamations or messages, congressional resolutions, and screening and awareness events run by hospitals and advocacy groups."
      },
      {
        "question": "How many men are diagnosed with prostate cancer each year?",
        "answer": "The American Cancer Society's estimate for 2026 is about 333,830 new diagnoses and 36,320 deaths in the United States, with roughly 1 in 8 men expected to be diagnosed at some point in their lives. A September 2025 presidential message cited slightly lower figures, more than 300,000 diagnoses and more than 35,000 deaths; the difference reflects different estimate years rather than a contradiction."
      }
    ],
    "sources": [
      {
        "label": "Wikipedia — National Prostate Health Month",
        "url": "https://en.wikipedia.org/wiki/National_Prostate_Health_Month"
      },
      {
        "label": "George W. Bush — Proclamation 7700, National Prostate Cancer Awareness Month, 2003 (Federal Register)",
        "url": "https://www.federalregister.gov/documents/2003/09/05/03-22811/national-prostate-cancer-awareness-month-2003"
      },
      {
        "label": "George W. Bush White House Archives — National Prostate Cancer Awareness Month, 2003 (press release text)",
        "url": "https://georgewbush-whitehouse.archives.gov/news/releases/2003/09/20030901-1.html"
      },
      {
        "label": "George W. Bush White House Archives — National Prostate Cancer Awareness Month, November 2001 proclamation",
        "url": "https://georgewbush-whitehouse.archives.gov/news/releases/2001/11/20011105-1.html"
      },
      {
        "label": "Congress.gov — S.Res.138, 107th Congress, requesting September 2001 as National Prostate Cancer Awareness Month",
        "url": "https://www.congress.gov/bill/107th-congress/senate-resolution/138"
      },
      {
        "label": "GovTrack.us — S.Res.138, 107th Congress (agreed to August 3, 2001, 58 cosponsors)",
        "url": "https://www.govtrack.us/congress/bills/107/sres138"
      },
      {
        "label": "The American Presidency Project — Message on National Prostate Cancer Awareness Month, September 2, 2025",
        "url": "https://www.presidency.ucsb.edu/documents/message-national-prostate-cancer-awareness-month-1"
      },
      {
        "label": "Biden White House Archives — A Proclamation on National Prostate Cancer Awareness Month, 2022",
        "url": "https://bidenwhitehouse.archives.gov/briefing-room/presidential-actions/2022/08/31/a-proclamation-on-national-prostate-cancer-awareness-month-2022/"
      },
      {
        "label": "Federal Register — National Prostate Cancer Awareness Month, 2022",
        "url": "https://www.federalregister.gov/documents/2022/09/06/2022-19300/national-prostate-cancer-awareness-month-2022"
      },
      {
        "label": "Congress.gov — S.Res.378, 117th Congress, designating September 2021 as National Prostate Cancer Awareness Month",
        "url": "https://www.congress.gov/bill/117th-congress/senate-resolution/378"
      },
      {
        "label": "Congress.gov — S.Res.776, 117th Congress, designating September 2022 as National Prostate Cancer Awareness Month",
        "url": "https://www.congress.gov/bill/117th-congress/senate-resolution/776"
      },
      {
        "label": "Congress.gov — H.Res.675, 119th Congress, supporting the designation of September 2025 as National Prostate Cancer Awareness Month",
        "url": "https://www.congress.gov/bill/119th-congress/house-resolution/675/text"
      },
      {
        "label": "American Cancer Society — Key Statistics for Prostate Cancer",
        "url": "https://www.cancer.org/cancer/types/prostate-cancer/about/key-statistics.html"
      },
      {
        "label": "Crawford, E.D. — \"Prostate Cancer Awareness Week: September 22 to 28, 1997,\" CA: A Cancer Journal for Clinicians (Wiley)",
        "url": "https://acsjournals.onlinelibrary.wiley.com/doi/full/10.3322/canjclin.47.5.288"
      }
    ],
    "image": "/images/prostate-cancer-awareness-month-white-house.jpg",
    "imageAlt": "The North Portico of the White House, where every National Prostate Cancer Awareness Month proclamation since 2003 has originated",
    "imageCredit": "Photo by Don Ramey Logan, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:North_Portico_of_the_White_House_photo_Don_Ramey_Logan.jpg), CC BY-SA 4.0"
  },
  {
    "slug": "world-smile-day",
    "category": "Observances",
    "title": "World Smile Day: October's First Friday, a Foundation Born in 2001",
    "description": "World Smile Day falls on the first Friday of October. Its foundation began in 2001, after Harvey Ball died, not founded by him in 1999 as Wikipedia states.",
    "published": "2026-08-20",
    "updated": "2026-08-20",
    "coreSummary": "World Smile Day is an unofficial observance held on the first Friday of October every year, created in 1999 by Harvey Ball, the commercial artist who drew the original smiley face in 1963. The Harvey Ball World Smile Foundation, which now runs the day, states on its own site that it was established in 2001 to honor Ball's memory after his death, which contradicts Wikipedia's claim that Ball founded the foundation himself in 1999.",
    "dateRule": {
      "kind": "nth-weekday",
      "text": "The first Friday of October every year. It is not a fixed calendar date, so it moves within a seven-day range depending on where October's first Friday falls.",
      "source": {
        "label": "Harvey Ball World Smile Foundation — About World Smile Day",
        "url": "https://www.worldsmile.org/about/about-world-smile-day"
      },
      "occurrences": [
        {
          "date": "2026-10-02",
          "weekday": "Friday"
        },
        {
          "date": "2027-10-01",
          "weekday": "Friday"
        },
        {
          "date": "2028-10-06",
          "weekday": "Friday"
        },
        {
          "date": "2029-10-05",
          "weekday": "Friday"
        },
        {
          "date": "2030-10-04",
          "weekday": "Friday"
        },
        {
          "date": "2031-10-03",
          "weekday": "Friday"
        }
      ],
      "caveat": "Do not confuse this with National Smile Day, a differently named US observance held every May 31, founded in 2018 by Dr. Tim Stirneman and Jim Wojdyla of Compassionate Dentalcare, an Illinois dental practice, to promote dental health. It has no connection to Harvey Ball, the Harvey Ball World Smile Foundation, or the first-Friday-in-October date rule described on this page."
    },
    "founding": {
      "status": "documented",
      "text": "Harvey Ball, a commercial artist from Worcester, Massachusetts, drew the original smiley face in 1963 for State Mutual Life Assurance Company (now Hanover Insurance), which had just merged with Guarantee Mutual Company of Ohio and needed something to lift employee morale. The drawing, a yellow circle with two eyes and a mouth, took about ten minutes and earned Ball a flat $45; he never trademarked the design. State Mutual ordered 100 pins at first, then tens of thousands more as demand grew, and by 1971 more than 50 million smiley-face buttons had been sold, with Ball receiving no royalty from any of it.\n\nThirty-six years later, in 1999, Ball created something he did trademark: World Smile Day itself. By his own account and the foundation's, he had grown concerned that the smiley's original message of simple goodwill had been diluted by decades of unlicensed commercial and cultural use, and he set aside the first Friday of every October as a day devoted to smiles and small acts of kindness, under the trademarked name World Smile Day® and the catchphrase \"Do an act of kindness. Help one person smile.\" The first observance was held that October in Ball's hometown of Worcester.\n\nBall died on April 12, 2001. The organization that carries the day forward today, the Harvey Ball World Smile Foundation, states on its own \"About\" page that it was established in 2001 specifically \"to honor the name and memory of Harvey Ball\" — language that only makes sense as a posthumous tribute, not something its own namesake built. Federal nonprofit filings, indexed by ProPublica's Nonprofit Explorer under EIN 04-6946615, record 2002 as the organization's IRS ruling year, consistent with a foundation whose incorporation process began in 2001 and received formal tax-exempt recognition the following year.\n\nWikipedia's article on Harvey Ball gives a different account, as of this page's research in August 2026. Its lead states plainly that \"Ball later founded the Harvey Ball World Smile Foundation in 1999, a non-profit charitable trust that supports children's causes.\" Checked against the foundation's own primary-source account, that sentence does not hold up: it would date the foundation's founding to two years before its own namesake died, while the foundation itself describes its founding as an act of honoring him, which is not something an organization typically does for someone still alive. The more consistent reading of the record is that Wikipedia's editors conflated two different 1999 and 2001 events: the day, which Ball really did create himself in 1999, and the foundation, which he did not, since it did not exist yet when he died. Wikipedia is user-edited and this specific sentence could change after this page's research date; a reader checking it later should weigh the foundation's own \"About\" page above any single Wikipedia sentence that conflicts with it.",
      "source": {
        "label": "Harvey Ball World Smile Foundation — About World Smile Day",
        "url": "https://www.worldsmile.org/about/about-world-smile-day"
      }
    },
    "sections": [
      {
        "heading": "What World Smile Day is",
        "body": [
          "World Smile Day is an unofficial observance held on the first Friday of every October, built around a single, deliberately small idea: do something kind for someone else and try to make them smile. It carries the trademarked catchphrase \"Do an act of kindness. Help one person smile.\" In 2026 it falls on Friday, October 2.",
          "The day has no legal status anywhere. No government recognizes it, no country grants time off for it, and banks, schools, and offices keep a normal schedule. What sustains it is the Harvey Ball World Smile Foundation, a Worcester, Massachusetts nonprofit that continues to serve as the day's official sponsor, along with social-media participation, novelty retail tie-ins, and local Worcester events held in Ball's hometown each year.",
          "The observance is inseparable from a single symbol: the smiley face, which its creator spent the last two years of his life trying to reclaim from decades of commercial dilution by giving it, once a year, a purpose he could still control."
        ]
      },
      {
        "heading": "The date: the first Friday in October, not a fixed day",
        "body": [
          "Unlike most observances on this calendar, World Smile Day is not pinned to a single calendar date. It falls on whichever day is the first Friday of October, which means the exact date shifts from year to year across a seven-day range: October 2 in 2026, October 1 in 2027, as late as October 6 in 2028. The Harvey Ball World Smile Foundation's own site states the rule directly and has confirmed October 2, 2026 as this year's date.",
          "There is a second, unrelated observance with an almost identical name that causes real confusion: National Smile Day, held every May 31. It was founded in 2018 by Dr. Tim Stirneman and Jim Wojdyla of Compassionate Dentalcare, an Illinois dental practice, and is built around dental health rather than Ball's kindness campaign. The two days share no founder, no foundation, and no date rule; they only share two words of their name."
        ]
      },
      {
        "heading": "From a $45 drawing to a global symbol",
        "body": [
          "The smiley face itself predates World Smile Day by thirty-six years. In 1963, State Mutual Life Assurance Company of Worcester had just absorbed Guarantee Mutual Company of Ohio, and the merger left employee morale low. The company hired Harvey Ball, a local freelance commercial artist, to design something to put on a button. Ball drew a sunny yellow circle, added a smile, decided a smile alone could be flipped upside down into a frown, and added two eyes to fix it. The whole design took about ten minutes, and State Mutual paid him $45. He did not file for a trademark.",
          "State Mutual ordered 100 pins at first. Demand overran that estimate almost immediately, and the company began ordering in lots of 10,000. By 1971, more than 50 million smiley-face buttons had been produced and distributed, according to Wikipedia's account of the design's history, and the image had become one of the most reproduced graphics of the twentieth century, appearing on merchandise Ball had no legal claim to and no financial stake in.",
          "That gap between the symbol's popularity and its creator's control over it is the backdrop for everything that follows."
        ]
      },
      {
        "heading": "Why Ball invented a day about it",
        "body": [
          "By the late 1990s, Harvey Ball had watched his design get absorbed into decades of unlicensed commercial use, cultural parody, and eventually the early internet's emoticon culture, with no way to steer what the symbol was made to represent. In 1999, he created something different from the original drawing: an annual observance he could define on his own terms and, this time, protect by trademark. He set it on the first Friday of every October, named it World Smile Day®, and gave it a single instruction rather than a slogan to sell anything: do an act of kindness, and try to help one person smile.",
          "The first World Smile Day was held that October in Worcester, Ball's hometown, on a modest, local scale. It stayed that way, run directly by Ball, for the less than two years he had left to run it himself. Among the observances on this calendar with a single named inventor, [Talk Like a Pirate Day](/talk-like-a-pirate-day/) is the closer comparison: both founders are still alive and have told a consistent story for decades, a contrast this page returns to below."
        ]
      },
      {
        "heading": "A foundation founded after its founder died",
        "body": [
          "Harvey Ball died on April 12, 2001, less than two years after holding the first World Smile Day. What happened next is where the record on this observance genuinely splits.",
          "The organization that now runs World Smile Day, the Harvey Ball World Smile Foundation, gives its own founding date on its \"About\" page: 2001, described explicitly as being established \"to honor the name and memory of Harvey Ball.\" That phrasing only makes sense if the foundation came after him, built by people who wanted to preserve what he had started, not by Ball while he was alive to run it himself. Independent federal nonprofit records support that timeline rather than contradict it: ProPublica's Nonprofit Explorer lists the organization, EIN 04-6946615, with an IRS ruling year of 2002, which is the kind of one-year lag between incorporating a nonprofit and receiving formal federal tax-exempt recognition that shows up routinely in filings for genuinely new organizations, not for one that had already been operating for two years.",
          "Wikipedia's article on Harvey Ball tells a different story in its opening paragraph, stating that \"Ball later founded the Harvey Ball World Smile Foundation in 1999.\" Weighed against the foundation's own account of itself, that claim has two specific problems: it places the foundation's founding two years before Ball's death, and it credits Ball with founding an organization whose own stated purpose is to honor him, a description that reads as a posthumous tribute rather than a self-founded body. The more likely explanation is a compression error rather than a competing fact: 1999 is a real date in this story, but it is the year Ball founded World Smile Day, not the year anyone founded the foundation that today bears his name."
        ],
        "image": {
          "src": "/images/world-smile-day-timeline.svg",
          "alt": "Timeline showing Harvey Ball drawing the smiley face in 1963, creating World Smile Day himself in 1999, dying in April 2001, the Harvey Ball World Smile Foundation stating it was founded in 2001 to honor his memory, and federal filings recording a 2002 IRS ruling year — against Wikipedia's claim that Ball founded the foundation himself in 1999"
        }
      },
      {
        "heading": "What the foundation does today",
        "body": [
          "The Harvey Ball World Smile Foundation describes its focus as small, grassroots charitable efforts that would otherwise struggle to find funding or attention, a deliberately modest scope compared to large national charities. It remains the official sponsor of World Smile Day each year and, through its licensing arm, Harvey Ball Smile Limited, holds and manages trademark rights not just to the original smiley design but to a wider family of related marks built up since Ball's death.",
          "The result is a slightly unusual structure for an observance on this calendar: the day itself was invented and run, at least initially, by one identifiable person, while the institution that has kept it going for a quarter-century since his death was, by its own telling, built specifically because he could no longer run it himself. [Movember](/movember/) shows a related but distinct pattern, where the founders built their own organization while still directly running it, rather than one assembled afterward by others."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is World Smile Day in 2026?",
        "answer": "Friday, October 2, 2026. World Smile Day falls on the first Friday of October every year rather than a fixed calendar date."
      },
      {
        "question": "When is World Smile Day in 2027?",
        "answer": "Friday, October 1, 2027, since that is the first Friday of the month that year."
      },
      {
        "question": "Who created World Smile Day?",
        "answer": "Harvey Ball, the commercial artist who drew the original smiley face in 1963, created World Smile Day himself in 1999 and trademarked the name."
      },
      {
        "question": "Is World Smile Day the same as National Smile Day?",
        "answer": "No. National Smile Day is a separate US observance held every May 31, founded in 2018 by Dr. Tim Stirneman and Jim Wojdyla of Compassionate Dentalcare to promote dental health. It has no connection to Harvey Ball or the Harvey Ball World Smile Foundation."
      },
      {
        "question": "Did Harvey Ball found the Harvey Ball World Smile Foundation?",
        "answer": "No, despite what Wikipedia's article on Ball currently states. The foundation's own \"About\" page says it was established in 2001 to honor Ball's memory, which was the year he died; federal nonprofit filings record a 2002 IRS ruling year, consistent with a foundation formed after his death rather than two years before it."
      },
      {
        "question": "Who created the smiley face, and when?",
        "answer": "Harvey Ball, in 1963, for State Mutual Life Assurance Company in Worcester, Massachusetts. He was paid $45 for the design and never trademarked it."
      },
      {
        "question": "Is World Smile Day an official holiday?",
        "answer": "No. It has no government recognition anywhere, and banks, schools, and offices keep a normal schedule on the day."
      },
      {
        "question": "What is the theme of World Smile Day?",
        "answer": "\"Do an act of kindness. Help one person smile,\" the trademarked catchphrase Harvey Ball set for the day when he created it in 1999. The theme mirrors the everyday-generosity focus behind [World Kindness Day](/world-kindness-day/) in November, though the two observances have separate founders and separate histories."
      }
    ],
    "sources": [
      {
        "label": "Harvey Ball World Smile Foundation — About World Smile Day",
        "url": "https://www.worldsmile.org/about/about-world-smile-day"
      },
      {
        "label": "Harvey Ball World Smile Foundation — About Harvey Ball",
        "url": "https://www.worldsmile.org/about/about-harvey-ball"
      },
      {
        "label": "Harvey Ball World Smile Foundation — Smiley Quick Facts",
        "url": "https://www.worldsmile.org/about"
      },
      {
        "label": "Wikipedia — Harvey Ball",
        "url": "https://en.wikipedia.org/wiki/Harvey_Ball"
      },
      {
        "label": "ProPublica Nonprofit Explorer — Harvey Ball World Smile Foundation, EIN 04-6946615",
        "url": "https://projects.propublica.org/nonprofits/organizations/46946615"
      },
      {
        "label": "National Day Calendar — National Smile Day, May 31",
        "url": "https://nationaldaycalendar.com/celebrations/national-smile-day-may-31"
      }
    ],
    "image": "/images/world-smile-day-harvey-ball-pin.jpg",
    "imageAlt": "An authentic Harvey Ball smiley-face pin from Worcester, Massachusetts, on display at the Worcester Historical Museum",
    "imageCredit": "Photo by [Garchy](https://en.wikipedia.org/wiki/User:Garchy), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Authentic_Worcester-made_smiley_face,_Harvey_Ball.jpg), CC BY-SA 4.0"
  },
  {
    "slug": "lung-cancer-awareness-month",
    "category": "Observances",
    "title": "Lung Cancer Awareness Month: All of November, and Who Started It",
    "description": "Lung Cancer Awareness Month covers all of November. A patient group founded it in 1998, 22 years before Congress recognized it, and no law makes it permanent.",
    "published": "2026-08-20",
    "updated": "2026-08-20",
    "coreSummary": "Lung Cancer Awareness Month is observed across all of November, every year, in the United States. A patient-advocacy group, ALCASE, held the first single-day version on November 14, 1998, and expanded it into a full month in November 2000. Congress did not formally recognize the observance until a unanimous Senate resolution on December 1, 2020, twenty-two years after the founding day, and no standing federal statute renews it automatically; Congress has instead passed a fresh resolution naming the specific year, and a president has issued a fresh proclamation, every year since.",
    "dateRule": {
      "kind": "fixed",
      "text": "All of November, every year, in the United States, from November 1 through November 30, rather than a single date or a floating week within the month.",
      "source": {
        "label": "GO2 for Lung Cancer — Lung Cancer Awareness",
        "url": "https://go2.org/lung-cancer-awareness"
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
      "caveat": "November is not the only lung-cancer observance on the calendar, and the two are easy to conflate. World Lung Cancer Day falls separately on August 1 each year, organized internationally by respiratory-health bodies including the Forum of International Respiratory Societies, and has circulated since around 2012 with a global-screening-access focus distinct from the U.S.-rooted November month. A reader who finds a lung-cancer date in August has found a different, older, and differently organized observance, not an early or mistaken version of the November one."
    },
    "founding": {
      "status": "documented",
      "text": "Lung Cancer Awareness Month traces to a single U.S. patient-advocacy organization, not to a government body, and the organization's own current materials date its two founding moments precisely. The Alliance for Lung Cancer Advocacy, Support and Education (ALCASE) held the first Lung Cancer Awareness Day on November 14, 1998, deliberately timed to coincide with the American Cancer Society's annual Great American Smokeout so the two campaigns could reinforce each other. Two years later, in November 2000, ALCASE expanded the single day into a full national Lung Cancer Awareness Month. Both dates come directly from GO2 for Lung Cancer's own history pages, and the same account is repeated verbatim on LCAM.org, the awareness-month coalition site GO2 has stewarded since 2021: two pages maintained by the same current organization, a narrower form of corroboration than two fully independent sources. One real conflict does exist. Wikipedia's article on Lung Cancer Alliance states, in a sentence with no citation attached, that the organization \"was founded in 1995\" and that it \"began its first awareness program\" only in 2010, both years at odds with GO2's account. Neither Wikipedia sentence is sourced, and GO2's own history page dates the ALCASE-to-Lung-Cancer-Alliance rename to 2004, which makes an uncited claim that \"Lung Cancer Alliance\" was itself \"founded in 1995\" hard to square on its face. This page follows GO2's specific, twice-repeated, sourced account over Wikipedia's uncited one, and says so plainly rather than quietly picking a number.\n\nALCASE itself did not appear from nowhere. GO2's institutional history traces the lineage to 1979, when a man named Mort Liebling was diagnosed with lung cancer and found no organized support available to him or his family; in the years that followed, patient advocate Peggy McCarthy founded ALCASE in response, running a newsletter, a free helpline, and a phone-buddy program for patients before the organization moved into awareness campaigning and, by 1999, national policy advocacy. GO2's history page does not give a specific founding year for ALCASE itself, only Liebling's 1979 diagnosis as the catalyst and McCarthy's founding as following it, a gap the organization's own materials leave open rather than paper over.\n\nThe organization's name changed twice on the way to today. ALCASE became Lung Cancer Alliance in 2004. In 2019, Lung Cancer Alliance merged with a separate patient organization, the Bonnie J. Addario Lung Cancer Foundation (founded in 2006 by Bonnie Addario after her own stage IIIB lung cancer diagnosis in 2003) to form GO2 Foundation for Lung Cancer, later shortened to GO2 for Lung Cancer, the name under which the awareness month is now promoted.\n\nFederal recognition came much later than the founding, and through a weaker mechanism than [Breast Cancer Awareness Month](/breast-cancer-awareness-month/)'s congressional history on this site: that older observance got two outright public laws and two joint resolutions, which carry the force of law, while this one has so far only ever received simple resolutions, which do not. The first congressional action found on the record is a Senate resolution, S.Res.780 of the 116th Congress, sponsored by Senators Tina Smith and Marco Rubio and passed by unanimous consent on December 1, 2020, twenty-two years after ALCASE's first Awareness Day and twenty years after the first full Awareness Month. That resolution called on the American public to observe National Lung Cancer Awareness Month and to support early detection and treatment, but a Senate resolution is not a law: it does not require a House vote, does not need a president's signature, and does not create a standing designation that renews itself in future years. Congress has repeated the exercise, naming the specific year each time, in subsequent sessions, including S.Res.462 for November 2021 and S.Res.512 for November 2023, with a House companion resolution, H.Res.960, introduced for November 2025.\n\nA presidential proclamation followed even later. The earliest one found on the record is President Biden's proclamation of November 2022, signed October 31, 2022, which the White House's own archived text frames as a call for the public and for institutions to increase awareness of lung cancer prevention, detection, and treatment; no proclamation using this exact name has surfaced from any earlier administration. Biden issued comparable proclamations in 2023 and 2024, and the Trump administration marked the month again in November 2025, according to contemporaneous news coverage, continuing the same year-by-year pattern rather than any of the three branches ever converting the observance into a standing statute.",
      "source": {
        "label": "GO2 for Lung Cancer — Lung Cancer Awareness (history section)",
        "url": "https://go2.org/lung-cancer-awareness"
      }
    },
    "sections": [
      {
        "heading": "The whole month, every year",
        "body": [
          "Lung Cancer Awareness Month runs the full 30 days of November, with no nth-weekday arithmetic or floating window to work out. The table above lists November 1 as each year's start; the observance continues through November 30 in every case, matching how GO2 for Lung Cancer, the American Lung Association, and every federal proclamation on record describe it.",
          "What takes real digging to sort out is not the calendar but the paperwork: which organization actually started this, in what year, and whether any government body has ever made the recognition permanent. Most calendar aggregator sites give the month a one-line mention and move on."
        ]
      },
      {
        "heading": "A patient group's single day, then its month",
        "body": [
          "The observance began as the work of people who had lung cancer, not as a government initiative or a corporate campaign. ALCASE, the Alliance for Lung Cancer Advocacy, Support and Education, held the first Lung Cancer Awareness Day on November 14, 1998, and the organization's own current materials say the date was chosen to land alongside the American Cancer Society's long-running Great American Smokeout, so a single November week could carry both a quit-smoking push and a lung-cancer-awareness push at once.",
          "ALCASE returned to the idea two years later. In November 2000, the organization expanded that single day into a full Lung Cancer Awareness Month, run nationally rather than as a one-off event. GO2 for Lung Cancer, which now carries ALCASE's history forward, states that the month reaches roughly 20 million people every November across the U.S. and beyond, a scale the original 1998 day, aimed at a single week's press cycle, was never built for."
        ]
      },
      {
        "heading": "Congress took twenty-two years, and it still isn't permanent",
        "body": [
          "No branch of the federal government touched the observance for over two decades after ALCASE's founding day. That changed on December 1, 2020, when the Senate passed S.Res.780 by unanimous consent, sponsored by Senators Tina Smith of Minnesota and Marco Rubio of Florida, formally designating November 2020 as National Lung Cancer Awareness Month and urging Americans to support early detection and screening.",
          "A Senate resolution of this kind carries no force of law: it does not go to the House for a vote, does not require a presidential signature, and expires with the Congress that passed it. Every subsequent Congress has had to pass a new one naming the new year: S.Res.462 designated November 2021, S.Res.512 designated November 2023, and a House companion, H.Res.960, was introduced for November 2025. That is the same by-year pattern this site has already documented for [Breast Cancer Awareness Month](/breast-cancer-awareness-month/), though the two observances didn't get there the same way. Breast cancer's early designations were joint resolutions and outright public laws, which do carry the force of law; lung cancer's have so far only ever been simple resolutions, which don't. The gap between founding and first congressional recognition also ran far longer here: twenty-two years for lung cancer's observance, against five years for breast cancer's.",
          "A presidential proclamation is a separate, later layer again. The earliest one on record is President Biden's proclamation of November 2022, signed October 31 of that year; Biden issued comparable proclamations for 2023 and 2024, and news coverage reported the Trump administration marking the month again in November 2025. No search of presidential archives from 2018 through 2021 turns up an earlier proclamation under this name."
        ],
        "image": {
          "src": "/images/lung-cancer-awareness-month-timeline.svg",
          "alt": "Timeline from ALCASE's 1998 founding day through the 2000 expansion to a full month, the organization's 2004 and 2019 reorganizations, the Senate's first 2020 recognition, and the first 2022 presidential proclamation"
        }
      },
      {
        "heading": "The white ribbon is a separate, later story",
        "body": [
          "The white ribbon now associated with the month did not exist when ALCASE founded it, and it did not come from any of the advocacy organizations behind the observance's history. In the fall of 2020, a Colorado woman named Heidi Nafman-Onda, diagnosed with stage IIIA non-small cell lung cancer two years earlier, grew frustrated after hospital marketing departments repeatedly turned down her requests to mark the coming November. She asked her husband, Pierre, to cut a white ribbon out of plywood for their own front porch, reasoning, in her own words, that \"no one can stop me from putting a white ribbon up on my own house.\"",
          "Pierre lettered the plywood ribbon with a sticker reading \"Lung Cancer Awareness,\" and Heidi posted photos of it to a private Facebook group for lung cancer survivors in Colorado. The response turned their garage into a small ribbon workshop: within six months, the couple had personally made and shipped more than a thousand ribbons, each signed by its maker, to recipients across the United States, Canada, the Philippines, the Netherlands, and Germany, and what started as an unbranded porch project grew into a standing organization, The White Ribbon Project."
        ]
      },
      {
        "heading": "What the month does and does not carry with it",
        "body": [
          "Lung Cancer Awareness Month is not a federal holiday: no offices close and no leave attaches to it, the same as every other awareness month this site has covered. What happens instead is decentralized, driven by the same patchwork of advocacy groups, hospitals, and state governors' offices that built the observance in the first place. Individual state proclamations, like North Carolina's, run alongside the federal one most years, and the American Lung Association publishes its own annual \"State of Lung Cancer\" report each November tracking screening and survival rates state by state.",
          "This calendar has now covered several November observances that share a version of this same arc: a single advocacy organization builds the tradition first, and federal recognition, where it exists at all, arrives on its own separate and much later timeline. [Diabetes Awareness Month](/diabetes-awareness-month/) traces informally to a 1975 declaration but only received its first confirmed presidential week in 1981 and its first full-month proclamation in 1982. [National Epilepsy Awareness Month](/epilepsy-awareness-month/) has an even starker federal record: Congress tried three separate times, in 2002, 2003, and 2011, to pass a resolution recognizing it, and none of the three ever passed. [No-Shave November](/no-shave-november/), which shares the same 30 days, has never had any federal recognition at all, at any level, a reminder that Lung Cancer Awareness Month's 2020 Senate resolution and 2022 presidential proclamation put it on firmer government footing than most of the observances crowding the same month, even without a standing statute behind it."
        ]
      }
    ],
    "faq": [
      {
        "question": "What are the exact dates of Lung Cancer Awareness Month?",
        "answer": "The entire month of November, every year, from November 1 through November 30. It is not tied to a single date or a floating week within the month."
      },
      {
        "question": "Who founded Lung Cancer Awareness Month, and when?",
        "answer": "The Alliance for Lung Cancer Advocacy, Support and Education (ALCASE), a patient-advocacy group, held the first single-day version, Lung Cancer Awareness Day, on November 14, 1998, timed to coincide with the Great American Smokeout. ALCASE expanded that into the first full national Lung Cancer Awareness Month in November 2000. ALCASE later renamed itself Lung Cancer Alliance in 2004 and merged into GO2 for Lung Cancer in 2019."
      },
      {
        "question": "Did Congress recognize the observance right away?",
        "answer": "No. The first congressional recognition found on the record is a unanimous Senate resolution, S.Res.780, passed December 1, 2020, twenty-two years after the 1998 founding day. Congress has since passed a fresh resolution naming each new year, including S.Res.462 (2021) and S.Res.512 (2023), rather than a single permanent law."
      },
      {
        "question": "Is Lung Cancer Awareness Month a federal holiday?",
        "answer": "No. No federal offices close and no paid leave attaches to it. It is marked through proclamations, congressional resolutions, state governors' proclamations, and awareness campaigns run by patient-advocacy organizations and hospitals, not a legal holiday."
      },
      {
        "question": "Is Lung Cancer Awareness Month the same as World Lung Cancer Day?",
        "answer": "No. World Lung Cancer Day is a separate international observance held every August 1, organized by respiratory-health bodies including the Forum of International Respiratory Societies and circulating since around 2012, with a focus on global screening access. Lung Cancer Awareness Month is the U.S.-rooted, ALCASE-founded observance covering all of November."
      },
      {
        "question": "Where did the white ribbon associated with the month come from?",
        "answer": "It started in the fall of 2020, when Colorado resident Heidi Nafman-Onda, diagnosed with stage IIIA non-small cell lung cancer two years earlier, and her husband Pierre made a plywood white ribbon for their own front porch after hospital marketing departments turned down her requests to mark the coming November. Photos she shared in a private survivor Facebook group led to a garage-based ribbon-making effort that grew into a standing nonprofit, The White Ribbon Project, within about six months."
      },
      {
        "question": "Has a U.S. president always issued a proclamation for this observance?",
        "answer": "No. The earliest presidential proclamation found on the record is President Biden's, for November 2022, signed October 31 of that year. No proclamation under this name has been found from any earlier administration. Biden issued further proclamations in 2023 and 2024, and the Trump administration marked the month again in November 2025."
      }
    ],
    "sources": [
      {
        "label": "GO2 for Lung Cancer — Lung Cancer Awareness (history section)",
        "url": "https://go2.org/lung-cancer-awareness"
      },
      {
        "label": "Lung Cancer Awareness Month Coalition — History of LCAM",
        "url": "https://lcam.org/about/history-of-lcam/"
      },
      {
        "label": "GO2 for Lung Cancer — Our History",
        "url": "https://go2.org/about-us/our-history"
      },
      {
        "label": "Congress.gov — S.Res.780, 116th Congress (2019-2020)",
        "url": "https://www.congress.gov/bill/116th-congress/senate-resolution/780"
      },
      {
        "label": "Oncology Nursing Society (ONS Voice) — U.S. Senate Designates November as National Lung Cancer Awareness Month",
        "url": "https://voice.ons.org/advocacy/us-senate-designates-november-as-national-lung-cancer-awareness-month"
      },
      {
        "label": "Congress.gov — S.Res.462, 117th Congress (2021-2022)",
        "url": "https://www.congress.gov/bill/117th-congress/senate-resolution/462"
      },
      {
        "label": "Congress.gov — S.Res.512, 118th Congress (2023-2024)",
        "url": "https://www.congress.gov/bill/118th-congress/senate-resolution/512"
      },
      {
        "label": "Congress.gov — H.Res.960, 119th Congress (2025-2026)",
        "url": "https://www.congress.gov/bill/119th-congress/house-resolution/960"
      },
      {
        "label": "The White House (Biden Administration archive) — A Proclamation on National Lung Cancer Awareness Month, 2022",
        "url": "https://bidenwhitehouse.archives.gov/briefing-room/presidential-actions/2022/10/31/a-proclamation-on-national-lung-cancer-awareness-month-2022/"
      },
      {
        "label": "The White Ribbon Project — Origin Story",
        "url": "https://www.thewhiteribbonproject.org/origin-story"
      },
      {
        "label": "The Patient Story — Heidi's Stage 3A Non-Small Cell Lung Cancer Story",
        "url": "https://thepatientstory.com/patient-stories/lung-cancer/non-small-cell/heidi-n/"
      },
      {
        "label": "Global Initiative for Chronic Obstructive Lung Disease (GOLD) — World Lung Cancer Day, August 1",
        "url": "https://goldcopd.org/world-lung-cancer-day-august-1-2026/"
      },
      {
        "label": "Wikipedia — Lung Cancer Alliance (uncited founding-year claim, presented for the conflicting account)",
        "url": "https://en.wikipedia.org/wiki/Lung_Cancer_Alliance"
      }
    ],
    "image": "/images/lung-cancer-awareness-month.jpg",
    "imageAlt": "A chest X-ray showing lung cancer, from the National Cancer Institute's Visuals Online archive",
    "imageCredit": "National Cancer Institute, Visuals Online, edited by Doruk Salancı, Public Domain (U.S. federal government work), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:LungCancer-Xray-01.jpg)"
  },
  {
    "slug": "world-teachers-day",
    "category": "Observances",
    "title": "World Teachers' Day: October 5, and the National Days It Isn't",
    "description": "World Teachers' Day falls every October 5, proclaimed by UNESCO in 1994. India's own Teachers' Day predates it by 32 years and is not the same observance.",
    "published": "2026-08-20",
    "updated": "2026-08-20",
    "coreSummary": "World Teachers' Day is observed every October 5, proclaimed by UNESCO in 1994 to commemorate the 1966 ILO/UNESCO Recommendation concerning the Status of Teachers, signed at a special intergovernmental conference in Paris. At least four other countries run entirely separate national teachers' days, older than UNESCO's proclamation and unconnected to it: India's September 5 (since 1962), China's September 10 (since 1985), and a US observance that traces to a 1944 letter-writing campaign and now falls on a Tuesday in May, plus Australia's own last-Friday-of-October date, moved off October 5 because it usually falls in school holidays there.",
    "dateRule": {
      "kind": "fixed",
      "text": "October 5 every year, worldwide, marking the anniversary of the 1966 ILO/UNESCO Recommendation concerning the Status of Teachers.",
      "source": {
        "label": "UNESCO — World Teachers' Day",
        "url": "https://www.unesco.org/en/days/teachers"
      },
      "occurrences": [
        { "date": "2026-10-05", "weekday": "Monday" },
        { "date": "2027-10-05", "weekday": "Tuesday" },
        { "date": "2028-10-05", "weekday": "Thursday" },
        { "date": "2029-10-05", "weekday": "Friday" },
        { "date": "2030-10-05", "weekday": "Saturday" },
        { "date": "2031-10-05", "weekday": "Sunday" }
      ],
      "caveat": "October 5 is UNESCO's date, and it is not universal. India has observed its own, separate Teachers' Day on September 5 since 1962, thirty-two years before UNESCO's proclamation existed, honoring the birthday of Dr. Sarvepalli Radhakrishnan. China has observed its own September 10 Teachers' Day since 1985, tied to the start of its school year. The United States marks a National Teacher Day on the Tuesday of the first full week of May, part of a National PTA-run Teacher Appreciation Week, with roots in a 1944 campaign that predates UNESCO's day by half a century. Australia keeps the UNESCO name but not the UNESCO date: because October 5 usually falls during Australian school holidays, its states and territories move the observance to the last Friday of October instead — October 30 in 2026."
    },
    "founding": {
      "status": "documented",
      "text": "UNESCO's General Conference proclaimed October 5 World Teachers' Day in 1994, twenty-eight years after UNESCO and the International Labour Organization (ILO) had jointly convened a special intergovernmental conference in Paris that adopted the \"Recommendation concerning the Status of Teachers\" on October 5, 1966. That recommendation, still cited by name on UNESCO's own World Teachers' Day page today, set out international standards covering teacher recruitment, initial training and continuing education, employment conditions, and professional rights; a companion recommendation extending the same framework to higher-education teaching staff followed in 1997. The day is co-convened each year by UNESCO together with the ILO, UNICEF, and Education International, the global federation of teachers' unions, and more than 100 countries are reported to take part, according to Wikipedia's article on the day, though that figure carries no citation there and this page treats it as a reported estimate rather than a verified count.\n\nUNESCO's proclamation is the youngest of the four teacher-honoring traditions covered here, not the oldest, despite being the one most schools and media outlets around the world now call \"World Teachers' Day.\" India's own Teachers' Day goes back to 1962: when Dr. Sarvepalli Radhakrishnan, a philosopher and academic, became President of India that year, his former students and friends wanted to mark his birthday, September 5, with a personal celebration. He asked them to observe the date as Teachers' Day instead, to honor the profession broadly, not himself. China formalized its own Teachers' Day even earlier in the calendar year than most secondary sources note: on January 21, 1985, the Standing Committee of the 6th National People's Congress approved the State Council's proposal designating September 10, timed to the start of the academic year, as the country's Teachers' Day; the first observance followed that September in Beijing. China's government had briefly experimented with a June 6 Teachers' Day under the pre-1949 Republic of China government, and then folded teacher recognition into the general May 1 Labour Day after the People's Republic was founded, before settling on the dedicated September date in 1985.\n\nThe United States traces its own teacher day furthest back of the four, to a private letter-writing campaign, not any single proclamation. Mattie Whyte Woodridge, a teacher in Helena, Arkansas, began writing to governors, politicians, and education leaders across the country in 1944 to press for a national day honoring teachers. One of her letters reached First Lady Eleanor Roosevelt, who took up the cause with Congress. Roosevelt's own nationally syndicated \"My Day\" column, dated January 14, 1953, states plainly that \"the 81st Congress of the United States passed a joint resolution designating the first Tuesday of March of each year as National Teachers Day\" — the 81st Congress served from January 1949 to January 1951, so the resolution itself predates Roosevelt's column by two to four years. The same column notes that \"last year\" (1952) the National Teachers Day Committee had called on the President to actually proclaim the day, which several secondary sources checked for this page appear to compress into a single 1953 date for the whole episode; Roosevelt's contemporary account is the more precise record. A specific annual proclamation did not follow immediately. It took until March 7, 1980 for Congress to declare National Teacher Day for that single year, after the National Education Association and its Kansas and Indiana affiliates lobbied to formalize the observance; the date stayed on the first Tuesday in March through the early 1980s. In 1984 the National PTA created a dedicated Teacher Appreciation Week for the first full week of May, and in 1985 the NEA's Representative Assembly voted to move its own National Teacher Day into that week, landing on the Tuesday, where the US observance has stayed ever since.",
      "source": {
        "label": "UNESCO — World Teachers' Day",
        "url": "https://www.unesco.org/en/days/teachers"
      }
    },
    "sections": [
      {
        "heading": "What World Teachers' Day is",
        "body": [
          "World Teachers' Day is an international observance held every October 5, co-convened by UNESCO, the International Labour Organization, UNICEF, and Education International, the global federation of teachers' unions. It exists to mark the 1966 signing of the \"Recommendation concerning the Status of Teachers,\" a standard-setting document covering how teachers should be recruited, trained, employed, and treated, and to give governments, schools, and the public a yearly occasion to focus on the state of the teaching profession. In 2026 it falls on Monday, October 5.",
          "The day carries no legal force anywhere; UNESCO recommendations are not binding treaties, and no country is required to grant time off or change policy because of it. What UNESCO and its partners actually do each year is run a themed global campaign, typically anchored by an event at UNESCO headquarters in Paris, alongside independent celebrations organized by ministries of education, teachers' unions, and individual schools in the countries that choose to mark it.",
          "2026 carries a specific milestone: it is the sixtieth anniversary of the 1966 Recommendation that the day exists to commemorate, thirty-two years after UNESCO first proclaimed October 5 as its anniversary date."
        ]
      },
      {
        "heading": "The 1966 Recommendation the date comes from",
        "body": [
          "UNESCO's own World Teachers' Day page states the anniversary directly: October 5, 1966 is when a special intergovernmental conference, convened by UNESCO in Paris in cooperation with the ILO, adopted the Recommendation concerning the Status of Teachers. The document set out international benchmarks for how teachers should be recruited and initially trained, how their continuing education should work, and what employment conditions, rights, and responsibilities they should have — the kind of professional-status framework that, in 1966, did not exist at an international level for the teaching workforce.",
          "UNESCO did not proclaim a day to mark that anniversary until 1994, twenty-eight years later. A related, narrower recommendation extending similar standards to higher-education teaching staff followed in 1997, and UNESCO has used World Teachers' Day in some years since to mark that document's own anniversaries as well — the 2017 edition, for instance, marked twenty years since the 1997 Recommendation rather than the 1966 one."
        ],
        "image": {
          "src": "/images/world-teachers-day-timeline.svg",
          "alt": "Timeline showing India's Teachers' Day beginning in 1962, the 1966 UNESCO/ILO Recommendation signed in Paris, China's Teachers' Day and the US National Education Association's move to May both in 1985, UNESCO's 1994 proclamation of October 5 as World Teachers' Day, and the 2026 sixtieth anniversary of the 1966 Recommendation"
        }
      },
      {
        "heading": "Four teachers' days, four separate histories",
        "body": [
          "The single biggest source of confusion around this observance is that \"Teachers' Day\" is not one holiday with one history — it is a name several countries independently attached to their own, older traditions, several decades before UNESCO's October 5 existed to compete with them.",
          "India's version is the oldest of the four checked here. When Dr. Sarvepalli Radhakrishnan, a philosopher who had taught at universities in India and abroad, took office as President of India in 1962, his former students wanted to celebrate his birthday, September 5, in his honor. He asked them to mark the date instead as a tribute to teachers generally, and September 5 has been India's Teachers' Day every year since — thirty-two years before UNESCO's proclamation existed, and for a reason that has nothing to do with the 1966 Recommendation.",
          "China's September 10 dates to a January 21, 1985 decision by the Standing Committee of the 6th National People's Congress, approving a State Council proposal to designate the day, timed to the start of the academic year and not tied to any person's birthday. China had marked a June 6 Teachers' Day under the pre-1949 Republic of China government and later folded teacher recognition into the general May 1 Labour Day, before the 1985 decision created a dedicated date; the first observance followed that September in Beijing.",
          "The United States traces its observance to a 1944 letter-writing campaign by Mattie Whyte Woodridge, an Arkansas teacher, which reached First Lady Eleanor Roosevelt and eventually the 81st Congress (1949–1951), which passed a joint resolution for the first Tuesday of March. It took decades more for an actual annual proclamation to stick: a single-year declaration on March 7, 1980, then a 1984 National PTA-created Teacher Appreciation Week in May, then a 1985 NEA vote moving National Teacher Day into that week, where it remains, on a Tuesday, distinct from UNESCO's fixed October 5.",
          "Australia is the odd case among the four: it keeps UNESCO's name and its underlying rationale, but not the October 5 date itself, because that date usually lands during Australian school holidays. New South Wales's own education department confirms the workaround directly — Australian states and territories instead mark World Teachers' Day on the last Friday of October, which is October 30 in 2026."
        ]
      },
      {
        "heading": "A resolution two to four years older than the column that gets cited for it",
        "body": [
          "Several secondary sources found in researching this page date the US congressional joint resolution establishing National Teachers Day to 1953, attributing it to the 81st Congress. That pairing does not hold up: the 81st Congress served from January 1949 to January 1951, ending two years before 1953 even begins, so it could not have passed anything in that year.",
          "Eleanor Roosevelt's own \"My Day\" column, syndicated nationally and dated January 14, 1953, resolves the mismatch. She writes that \"the 81st Congress of the United States passed a joint resolution designating the first Tuesday of March of each year as National Teachers Day\" — describing the resolution as an already-completed act by the time she was writing — and adds that \"last year\" (1952), the National Teachers Day Committee had called on the President to actually proclaim the day. Read against Roosevelt's own timeline, the resolution itself belongs to the 81st Congress's 1949–1951 term, and 1953 is simply the year she happened to be writing about it and pressing for the follow-through proclamation that still hadn't arrived. The secondary sources appear to have compressed those two separate facts, the resolution's real date and Roosevelt's column date, into one."
        ]
      },
      {
        "heading": "What the pattern says about \"awareness day\" origin stories generally",
        "body": [
          "Every observance covered on this calendar with a documented founding shows some version of the same gap: the date that ends up widely recognized is rarely the date the underlying idea first started, and the institution that eventually formalizes a day is rarely the one that began it. [National Grandparents Day](/national-grandparents-day/) sits at one end of that spectrum, with its date locked into actual US federal statute, 36 U.S.C. § 125, instead of an annual proclamation that could lapse. World Teachers' Day sits closer to the other end: UNESCO's proclamation is a recurring institutional commitment, backed by four international organizations, but it carries no force of law, and it arrived decades after at least three national teachers' days it now nominally sits alongside.",
          "That same gap between founding and formal recognition shows up on [Breast Cancer Awareness Month](/breast-cancer-awareness-month/), where a 1985 industry-and-advocacy campaign waited five years for Congress to name it by joint resolution, and on [World Kindness Day](/world-kindness-day/), a civil-society observance that, unlike World Teachers' Day, has never received recognition from any United Nations body at all. World Teachers' Day is the more institutionally anchored of the pair — UNESCO is itself a UN specialized agency — but its national predecessors are the clearest reminder on this page that \"UNESCO's day\" and \"the world's only teachers' day\" are not the same claim."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is World Teachers' Day in 2026?",
        "answer": "Monday, October 5, 2026. It is a fixed calendar date and does not move from year to year."
      },
      {
        "question": "Who created World Teachers' Day?",
        "answer": "UNESCO proclaimed it in 1994, co-convened with the International Labour Organization, UNICEF, and Education International. The date marks the October 5, 1966 signing of the ILO/UNESCO Recommendation concerning the Status of Teachers in Paris."
      },
      {
        "question": "Is World Teachers' Day the same as India's Teachers' Day?",
        "answer": "No. India has observed its own Teachers' Day on September 5 since 1962, honoring President Sarvepalli Radhakrishnan's birthday, thirty-two years before UNESCO's proclamation existed. The two observances share a theme but have entirely separate origins and dates."
      },
      {
        "question": "Is World Teachers' Day the same as China's Teachers' Day?",
        "answer": "No. China has observed its own Teachers' Day on September 10 since 1985, established by the Standing Committee of the 6th National People's Congress and timed to the start of the school year, unrelated to UNESCO's October 5 date."
      },
      {
        "question": "When is National Teacher Day in the United States?",
        "answer": "The Tuesday of the first full week of May, as part of National Teacher Appreciation Week. It traces to a 1944 letter-writing campaign by Arkansas teacher Mattie Whyte Woodridge and a subsequent congressional joint resolution, and moved to its current May date in 1985 after decades on the first Tuesday of March."
      },
      {
        "question": "When does Australia celebrate World Teachers' Day?",
        "answer": "The last Friday of October, not October 5, because UNESCO's date usually falls during Australian school holidays. In 2026 that is Friday, October 30."
      },
      {
        "question": "How many countries observe World Teachers' Day?",
        "answer": "Wikipedia's article on the day states \"more than 100 countries,\" but that figure is not cited to any source there, and this page treats it as a reported estimate rather than a verified count."
      },
      {
        "question": "Is World Teachers' Day a public holiday?",
        "answer": "No. UNESCO recommendations are not binding, and no country is required to grant time off for it. Schools, banks, and offices keep a normal schedule in the countries that mark the day."
      }
    ],
    "sources": [
      {
        "label": "UNESCO — World Teachers' Day",
        "url": "https://www.unesco.org/en/days/teachers"
      },
      {
        "label": "Wikipedia — World Teachers' Day",
        "url": "https://en.wikipedia.org/wiki/World_Teachers%27_Day"
      },
      {
        "label": "Eleanor Roosevelt — \"My Day\" column, January 14, 1953 (The Eleanor Roosevelt Papers Project, GWU)",
        "url": "https://www2.gwu.edu/~erpapers/myday/displaydoc.cfm?_y=1953&_f=md002431"
      },
      {
        "label": "American Consortium for Equity in Education — Honoring Mattie May Whyte Woodridge",
        "url": "https://ace-ed.org/honoring-mattie-may-whyte-woodridge-the-real-founder-of-teacher-appreciation-week/"
      },
      {
        "label": "Ministry of Education of the People's Republic of China — Teacher's Day FAQ",
        "url": "http://en.moe.gov.cn/Specials/Specials_TeachersDay/teachersday_about/201808/t20180831_346820.html"
      },
      {
        "label": "University of Mysore — Teachers' Day: Dr. S. Radhakrishnan",
        "url": "https://www.uni-mysore.in/teachers-day"
      },
      {
        "label": "NSW Government (Department of Education) — World Teachers' Day",
        "url": "https://nsw.gov.au/education-and-training/nesa/awards-and-events/world-teachers-day"
      }
    ],
    "image": "/images/world-teachers-day-kabul-academy-1968.jpg",
    "imageAlt": "Trainee teachers at the Academy for Teacher Educators in Kabul-Jalalabad, Afghanistan, 1968, a UNESCO- and UNICEF-supported program to train primary-school teacher trainers",
    "imageCredit": "UNESCO / Alexander Shaw, 1968, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Teacher_education,_Kabul_-_UNESCO_-_PHOTO0000004434_0001.tiff), CC BY-SA 3.0 IGO"
  },
  {
    "slug": "birth-flowers-by-month",
    "category": "Birth Flowers",
    "title": "Birth Flowers by Month: The Full Chart, and Where It Runs Short",
    "description": "All twelve birth flowers in one chart, checked against The Old Farmer's Almanac and Farmers' Almanac, plus two months where the Almanac's list runs short.",
    "published": "2026-08-22",
    "updated": "2026-08-22",
    "coreSummary": "The Old Farmer's Almanac's current chart names one or two flowers for every month except two, where its own page is the narrow one: March, where it names the daffodil alone and explains that \"jonquil\" is just another name for the same flower, while Farmers' Almanac's own chart adds jonquil as a second flower and Farmers' Almanac's own dedicated March page adds a third, cherry blossom; and November, where the Almanac names chrysanthemum alone while Farmers' Almanac's chart pairs it with peony. A third source, Wikipedia's own September article, cites a 2013 gem-resource site for a flower neither almanac carries at all: forget-me-not.",
    "sections": [
      {
        "heading": "The current chart, checked directly rather than assembled from a dozen retail blogs",
        "body": [
          "This calendar has now published a separate page for all twelve months' birth flowers, one at a time, over the course of several weeks. Laid out together instead, checked against The Old Farmer's Almanac's current chart the week this page went up, the full run reads: January is carnation and snowdrop. February is violet and primrose. March is daffodil, styled on the Almanac's page as \"Daffodil & Jonquil\" even though the text calls jonquil just another name for the same flower rather than a second bloom. April is daisy and sweet pea. May is lily of the valley and hawthorn. June is rose and honeysuckle. July is larkspur and water lily. August is gladiolus and poppy. September is aster and morning glory. October is marigold and cosmos. November is chrysanthemum alone, with no second flower on the page. December is narcissus, most often the paperwhite, and holly.",
          "Ten of the twelve months carry a clear pair under that current framing, and two carry a single flower: March, where the second name turns out to describe the same plant, and November, where nothing on the page names a second flower at all. [This calendar's page on birthstones by month](/birthstones-by-month/) found a parallel shape in the gem trade's chart, where two different months turned out to be the ones a trade group's current list ran short on."
        ]
      },
      {
        "heading": "No 1912 meeting behind this one",
        "body": [
          "Birthstones trace to a specific date: a 1912 Kansas City meeting where a US retail jewelers' trade group adopted a standard chart, later revised on the record three more times. Birth flowers have no equivalent founding meeting. Wikipedia's own article on the broader tradition, floriography, traces the modern \"language of flowers\" fashion to Ottoman Constantinople's 18th-century tulip culture, reaching Britain through the poet and traveler Mary Wortley Montagu after her stay there in the 1710s. The first published dictionary attaching fixed meanings to individual flowers, per that same article, was Joseph Hammer-Purgstall's Dictionnaire du langage des fleurs in 1809; the first true floriography dictionary followed in 1819, written by Louise Cortambert under the pen name Madame Charlotte de la Tour. The English writer Robert Tyas added his own version in 1836.",
          "None of those three books is a birth-flower chart specifically, and none of them is the document any current almanac cites as its chart's origin. The modern month-by-month birth-flower list appears to be a later distillation of that general Victorian flower-meaning fashion, assembled by almanacs and florists rather than adopted at any single meeting a source names. That absence of a founding date is itself the difference from birthstones worth stating plainly, rather than papering over with a vague \"since Victorian times\" the way many calendar pages do."
        ]
      },
      {
        "heading": "March and November break the pattern",
        "body": [
          "Checking The Old Farmer's Almanac's current page against Farmers' Almanac's current page, flower by flower, turns up two months where the two disagree, and on both of them the Almanac carries fewer flowers than its counterpart.",
          "March is the more tangled case. The Old Farmer's Almanac heads the month \"Daffodil & Jonquil,\" but its body text says the March birth flower \"is the daffodil, referred to as the jonquil (which is simply a type of daffodil)\": one flower under two names, not two flowers. Farmers' Almanac's current chart lists March as \"Daffodil and Jonquil\" without that caveat, treating jonquil as a second, distinct bloom (it is in fact a specific species, Narcissus jonquilla, not a synonym for daffodil in general). Farmers' Almanac's dedicated March lore page goes a step further still, naming one other flower: cherry blossom, which its text says \"is sometimes considered the March birth month flower,\" particularly in Japanese culture. Farmers' Almanac's chart page and its lore page don't agree with each other on whether March has two flowers or three.",
          "November is the cleaner case. The Old Farmer's Almanac's current chart, on both its roundup page and its dedicated November page, names only the chrysanthemum; neither page mentions a second flower anywhere. Farmers' Almanac's current chart pairs the same chrysanthemum with a second flower, peony. A shopper checking one Almanac page for November's birth flower gets one answer; checking the other gets two."
        ]
      },
      {
        "heading": "A third flower, and neither almanac carries it",
        "body": [
          "Wikipedia's September article states plainly that \"the birth flowers are the forget-me-not, morning glory and aster,\" three flowers rather than the two either almanac's current chart names for the month. The claim traces, per Wikipedia's cited source, to a gem-and-jewelry resource site's birth-flower page, archived in 2013. Neither The Old Farmer's Almanac's current September page nor Farmers' Almanac's current September page mentions forget-me-not at all. It isn't possible to say from here whether that third flower reflects an older tradition the two almanacs have since dropped, or a single compiler's addition that Wikipedia picked up and neither almanac ever carried in the first place; what's checkable is that today, on three current pages, one names three flowers and two name two.",
          "December turns up a smaller wrinkle, worth a line rather than a whole finding. Both almanacs agree the month's flowers are narcissus, usually specified as the paperwhite, and holly. But The Old Farmer's Almanac's dedicated December page doesn't agree with its own roundup page on the order: the dedicated page's title reads \"December Birth Flowers: Holly and Narcissus,\" holly first, while the roundup page's body text calls narcissus the \"primary\" flower and holly the \"secondary\" one. Both flowers are on both lists either way; it's only the ranking that wobbles, and only within one organization's site."
        ]
      },
      {
        "heading": "Why one flower can have two names and two histories",
        "body": [
          "A recurring shape across this calendar's twelve individual birth-flower pages is a plant carrying two unconnected names, one botanical and one common, each with its own separate origin. [Rose and honeysuckle, June's pair](/june-birth-flower/), split that way: honeysuckle's genus name Lonicera honors a 16th-century German botanist who had nothing to do with the plant, while the English word \"honeysuckle\" comes from an unrelated Old English phrase that originally described clover. [Larkspur, one of July's two flowers](/july-birth-flower/), does it from the opposite direction: its scientific name Delphinium describes the shape of its nectary, not the lark's spur its English name refers to.",
          "A second recurring shape is a flower whose species count keeps moving. [March's daffodil](/march-birth-flower/) has been counted anywhere from 6 species by Linnaeus in 1753 to 87 by one modern registry, depending on how narrowly \"species\" is drawn. [November's chrysanthemum](/november-birth-flower/) carries a split identity of its own: Japan's Imperial Seal and highest civilian honor on one side, a graveside flower tied to All Saints' Day across much of Catholic Europe on the other, the same bloom read as opposite things by two different cultures rather than by two different trade groups. No single body has ever had the standing to settle any of this the way a court can settle a legal question. Each source, checked on its own current page, is accurately reporting what it currently says. The chart above is what those pages currently say; the two months flagged are where they currently don't agree, and this page will note it if a future revision closes either gap."
        ]
      }
    ],
    "faq": [
      {
        "question": "Which flower corresponds to each birth month?",
        "answer": "Per The Old Farmer's Almanac's current chart: January carnation and snowdrop, February violet and primrose, March daffodil, April daisy and sweet pea, May lily of the valley and hawthorn, June rose and honeysuckle, July larkspur and water lily, August gladiolus and poppy, September aster and morning glory, October marigold and cosmos, November chrysanthemum, December narcissus and holly."
      },
      {
        "question": "Is jonquil a second birth flower for March, or another name for daffodil?",
        "answer": "It depends which page is checked. The Old Farmer's Almanac's text says jonquil \"is simply a type of daffodil,\" not a second flower. Farmers' Almanac's current chart lists daffodil and jonquil as two separate flowers, and jonquil is in fact a specific species, Narcissus jonquilla, distinct from daffodil in general."
      },
      {
        "question": "Does November have one birth flower or two?",
        "answer": "The Old Farmer's Almanac's current chart names only chrysanthemum for November, on both its roundup page and its dedicated November page. Farmers' Almanac's current chart pairs chrysanthemum with a second flower, peony."
      },
      {
        "question": "Is cherry blossom a birth flower for March?",
        "answer": "Only on one page, and even that page hedges. Farmers' Almanac's dedicated March lore page says cherry blossom \"is sometimes considered\" a March birth flower, particularly in Japanese culture. It doesn't appear on Farmers' Almanac's summary chart or on The Old Farmer's Almanac's chart."
      },
      {
        "question": "Is forget-me-not a birth flower for September?",
        "answer": "Wikipedia's September article lists it as a third September birth flower alongside aster and morning glory, citing an archived 2013 gem-resource page. Neither The Old Farmer's Almanac's nor Farmers' Almanac's current September chart includes it."
      },
      {
        "question": "Why don't birth-flower charts trace to one official source the way birthstones do?",
        "answer": "Birthstones trace to a documented 1912 US trade convention. Birth flowers don't have an equivalent founding meeting; they descend from the broader Victorian \"language of flowers\" fashion, whose first published dictionaries date to 1809 and 1819, and the modern month-by-month chart appears to be a later distillation compiled by almanacs and florists rather than a single adopted standard."
      }
    ],
    "sources": [
      {
        "label": "The Old Farmer's Almanac — Birth Month Flowers and Their Meanings",
        "url": "https://www.almanac.com/content/birth-month-flowers-and-their-meanings"
      },
      {
        "label": "The Old Farmer's Almanac — November Birth Flowers",
        "url": "https://www.almanac.com/content/november-birth-flowers"
      },
      {
        "label": "The Old Farmer's Almanac — December Birth Flowers",
        "url": "https://www.almanac.com/content/december-birth-flowers"
      },
      {
        "label": "Farmers' Almanac — Birth Flower Chart: All 12 Birth Flowers by Month",
        "url": "https://www.farmersalmanac.com/birth-month-flowers-how-to-plant-a-family-garden"
      },
      {
        "label": "Farmers' Almanac — March Flower Lore",
        "url": "https://www.farmersalmanac.com/march-flower-lore"
      },
      {
        "label": "Wikipedia — Language of Flowers (floriography)",
        "url": "https://en.wikipedia.org/wiki/Language_of_flowers"
      },
      {
        "label": "Wikipedia — September (Symbols section)",
        "url": "https://en.wikipedia.org/wiki/September"
      }
    ],
    "image": "/images/birth-flowers-by-month-grid.svg",
    "imageAlt": "Grid chart of all twelve months' birth flowers, flagging March and November where The Old Farmer's Almanac's own current chart names fewer flowers than Farmers' Almanac's, and September where Wikipedia's own article adds a third"
  },
  {
    "slug": "mexican-independence-day",
    "category": "Observances",
    "title": "Mexican Independence Day: The Cry Came in 1810, the Treaty in 1821",
    "description": "Mexico's Independence Day falls every September 16, marking Hidalgo's 1810 call to revolt, not the sovereignty the country didn't secure for another 11 years.",
    "published": "2026-08-22",
    "updated": "2026-08-22",
    "coreSummary": "Mexican Independence Day falls every September 16, fixed as a mandatory paid rest day under Article 74 of Mexico's Federal Labor Law. The date marks Miguel Hidalgo's 1810 call to revolt against Spain, the Grito de Dolores, not the moment Mexico actually became sovereign, which took another 11 years and a treaty Spain itself didn't ratify until 1836. The loudest celebrations happen the night before, when Mexico's president reenacts Hidalgo's bell-ringing from the National Palace balcony using the original bell from his parish church.",
    "dateRule": {
      "kind": "fixed",
      "text": "Mexican Independence Day falls on September 16 every year. Article 74 of Mexico's Federal Labor Law (Ley Federal del Trabajo) names the date directly among the country's mandatory paid rest days, alongside dates like May 1 and the third Monday of November. It's a fixed calendar date rather than a weekday-based rule, so unlike several U.S. observances on this calendar, it never shifts.",
      "source": {
        "label": "Ley Federal del Trabajo, Artículo 74 — Procuraduría Federal de la Defensa del Trabajo (gob.mx)",
        "url": "https://www.gob.mx/profedet/articulos/sabes-cuales-son-los-dias-de-descanso-obligatorios-163134"
      },
      "occurrences": [
        { "date": "2026-09-16", "weekday": "Wednesday" },
        { "date": "2027-09-16", "weekday": "Thursday" },
        { "date": "2028-09-16", "weekday": "Saturday" },
        { "date": "2029-09-16", "weekday": "Sunday" },
        { "date": "2030-09-16", "weekday": "Monday" },
        { "date": "2031-09-16", "weekday": "Tuesday" }
      ],
      "caveat": "The date itself isn't in dispute. Article 74 fixes Independence Day on September 16. What varies is the hour historians assign to the event the date actually commemorates. Britannica and the Library of Congress both place Miguel Hidalgo's church-bell summons in the early morning of September 16, 1810, around 2:30 a.m., not the night before. A 1910 chromolithograph held by Mexico's Hemeroteca Nacional carries a caption that agrees: 'a la madrugada del 16 de septiembre de 1810' ('in the early hours of September 16, 1810'). Some modern retellings blur the timing anyway, folding Hidalgo's bell-ringing into the same night as the president's reenactment ceremony, which happens on the evening of September 15 rather than after midnight."
    },
    "founding": {
      "status": "documented",
      "text": "Miguel Hidalgo y Costilla, the Roman Catholic parish priest of Dolores (now Dolores Hidalgo, Guanajuato), rang his church bell in the early hours of September 16, 1810, and delivered an impromptu speech now known as the Grito de Dolores, calling his parishioners to revolt against Spanish colonial rule. He acted that morning because a plot he had helped organize with a group of pro-independence conspirators had just been uncovered by Spanish authorities, forcing him to move before he and his allies could be arrested. No verbatim transcript of the speech survives; the versions historians quote today are later reconstructions. Hidalgo's uprising was crushed within a year. He was captured and executed by firing squad on July 30, 1811, and the war he started ran for another decade under other commanders before Mexico secured its independence.",
      "source": {
        "label": "Grito de Dolores — Britannica",
        "url": "https://www.britannica.com/event/Grito-de-Dolores"
      }
    },
    "sections": [
      {
        "heading": "A bell rung before an uprising, not at a proclamation ceremony",
        "body": [
          "Miguel Hidalgo y Costilla was the parish priest of the small town of Dolores, in what is now Guanajuato state, and for months he had been part of a group quietly plotting an uprising against Spanish colonial rule. Spanish authorities found out. Rather than wait to be arrested, Hidalgo acted that same morning, summoning his parishioners with the church bell and speaking from the pulpit. Britannica and the Library of Congress both place the bell-ringing in the early hours of September 16, 1810, close to 2:30 a.m. No recording or transcript of what Hidalgo actually said survives, and the versions historians quote today, calling for an end to Spanish rule and invoking the Virgin of Guadalupe, are later reconstructions rather than a verbatim record.",
          "The speech became known as the Grito de Dolores, the Cry of Dolores, and it marks the opening of the Mexican War of Independence, not the moment Mexico actually gained it. Hidalgo's own uprising didn't last long. Spanish forces defeated his poorly armed followers within a year, captured him, and executed him by firing squad on July 30, 1811. The war he had started kept going under other commanders for another decade."
        ],
        "image": {
          "src": "/images/mexican-independence-day-hidalgo-proclamation.jpg",
          "alt": "1910 chromolithograph postcard by Adrián Unzueta depicting Miguel Hidalgo proclaiming Mexico's independence at Dolores in the early hours of September 16, 1810",
          "credit": "Adrián Unzueta, 1910, Colección Hemeroteca Nacional de México, public domain, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:El_cura_D._Miguel_Hidalgo_proclama_la_Independencia_Nacional_en_Dolores,_a_la_madrugada_del_16_de_septiembre_de_1810,_no_obstante_que_no_ten%C3%ADa_terminados_a%C3%BAn_los_preparativos_para_la_revoluci%C3%B3n.jpg)"
        }
      },
      {
        "heading": "Eleven years between the cry and the country",
        "body": [
          "The fighting that followed Hidalgo's death dragged on under a rotating cast of insurgent leaders, most notably José María Morelos, until command eventually passed to Agustín de Iturbide, a royalist officer who switched sides in 1821 and issued the Plan de Iguala. Iturbide's forces, the Army of the Three Guarantees, had taken most of the country by the time Spain's newly arrived captain-general, Juan O'Donojú, met him at the town of Córdoba. The two signed the Treaty of Córdoba on August 24, 1821, recognizing Mexican sovereignty and setting terms for the withdrawal of the remaining Spanish troops.",
          "The Army of the Three Guarantees entered Mexico City on September 27, 1821, and Iturbide proclaimed the independence of the Mexican Empire the following day. Even that wasn't quite the end of the story: the Spanish government in Madrid refused to ratify the Treaty of Córdoba and didn't formally recognize Mexico as a sovereign nation until the Santa María-Calatrava Treaty, signed December 28, 1836, a full quarter-century after Hidalgo rang his bell."
        ]
      },
      {
        "heading": "Why the party starts the night before",
        "body": [
          "The loudest part of the holiday happens the evening before the date it marks. Each year on the night of September 15, the president of Mexico steps onto the balcony of the National Palace, rings a bell, calls out the names of the independence movement's most celebrated figures, and closes by shouting \"¡Viva México!\" three times. Towns and cities across the country repeat a smaller version of the same ceremony in their own main squares.",
          "The bell the president rings isn't a replica. It's the actual bell from Hidalgo's parish church in Dolores, moved to the National Palace by President Porfirio Díaz and mounted in a niche above the balcony, where it stays year-round except for that one night. September 16 itself is the quieter of the two days by comparison, marked mainly by a military parade through Mexico City's Zócalo, a tradition dating back to the late 19th century."
        ]
      },
      {
        "heading": "Not Cinco de Mayo",
        "body": [
          "Mexican Independence Day gets confused, mostly by people outside Mexico, with Cinco de Mayo, and the two mark entirely different events 52 years apart. Cinco de Mayo, May 5, commemorates a single battle, the Mexican army's 1862 victory over French forces at Puebla; within Mexico it's a modest regional observance, celebrated with real weight mainly in Puebla state itself. Its outsized profile in the United States came later, pushed by Mexican-American activists in the 1960s who connected the battle to their own civil rights movement, then promoted from the 1980s on by beverage companies marketing it as a drinking holiday.",
          "September 16, by contrast, is Mexico's actual independence anniversary, the one that closes schools, banks, and government offices for the day. A search that turns up a date in May for \"Mexican Independence Day\" has found Cinco de Mayo's marketing footprint, not the holiday itself."
        ]
      },
      {
        "heading": "One date, inside a longer regional window",
        "body": [
          "September 16 doesn't stand alone on the calendar. It falls on day two of [National Hispanic Heritage Month](/national-hispanic-heritage-month/), the federally designated U.S. observance that runs September 15 through October 15 specifically because that window brackets a cluster of Latin American independence days: five Central American countries share September 15 itself, Mexico follows on the 16th, and Chile's own independence day lands on the 18th.",
          "That overlap means September 16 shows up in two different contexts depending on which country's calendar a reader is checking. In Mexico, it's a national legal holiday tied to the country's own founding. In the United States, it's one day inside a [monthlong federal observance](/national-hispanic-heritage-month/) recognizing Hispanic and Latino heritage broadly, not a U.S. public holiday in its own right; U.S. federal offices stay open."
        ]
      }
    ],
    "faq": [
      {
        "question": "When is Mexican Independence Day?",
        "answer": "Every September 16, fixed under Article 74 of Mexico's Federal Labor Law as one of the country's mandatory paid rest days. The date doesn't move with the weekday the way some U.S. holidays on this calendar do."
      },
      {
        "question": "Is Mexican Independence Day the same holiday as Cinco de Mayo?",
        "answer": "No. Cinco de Mayo (May 5) commemorates the Mexican army's 1862 victory at the Battle of Puebla and is a minor regional observance within Mexico. Mexican Independence Day (September 16) marks the start of the war that ended Spanish colonial rule and is Mexico's actual national holiday."
      },
      {
        "question": "Why do the biggest celebrations happen on the night of September 15 instead of September 16?",
        "answer": "The president's Grito ceremony, ringing the original bell from Hidalgo's church and calling out the names of independence heroes, takes place from the National Palace balcony on the evening of September 15, reenacting a summons historians date to the early hours of the 16th. September 16 itself is marked mainly by a military parade."
      },
      {
        "question": "Who is credited with starting Mexican independence?",
        "answer": "Miguel Hidalgo y Costilla, the parish priest of Dolores, who rang his church bell and called for revolt in the early hours of September 16, 1810, after a plot he was part of was discovered by Spanish authorities. He was captured and executed within a year; the war he started continued for another decade under other leaders."
      },
      {
        "question": "Did Hidalgo ring the bell on September 15 or September 16?",
        "answer": "Sources place the historical event itself in the early morning hours of September 16, 1810, around 2:30 a.m., not the night before. The confusion largely traces to the modern ceremony, which the Mexican president performs on the evening of September 15 rather than waiting until after midnight."
      },
      {
        "question": "When did Mexico actually become independent, if the Grito was in 1810?",
        "answer": "There isn't one single answer. Spain's representative and Mexico's rebel forces signed the Treaty of Córdoba recognizing Mexican sovereignty on August 24, 1821; troops entered Mexico City on September 27, 1821, and independence was formally proclaimed the next day. Spain itself didn't recognize Mexico as a sovereign nation until the Santa María-Calatrava Treaty, signed December 28, 1836, 26 years after Hidalgo's cry."
      },
      {
        "question": "Is Mexican Independence Day a public holiday in the United States?",
        "answer": "No. It falls within National Hispanic Heritage Month, the U.S. observance running September 15 through October 15, but U.S. federal offices and most workplaces stay open on September 16. It's a legal holiday in Mexico, not in the United States."
      }
    ],
    "sources": [
      {
        "label": "Ley Federal del Trabajo, Artículo 74 — Procuraduría Federal de la Defensa del Trabajo (gob.mx)",
        "url": "https://www.gob.mx/profedet/articulos/sabes-cuales-son-los-dias-de-descanso-obligatorios-163134"
      },
      {
        "label": "Grito de Dolores — Britannica",
        "url": "https://www.britannica.com/event/Grito-de-Dolores"
      },
      {
        "label": "Today in History — September 16 (Library of Congress)",
        "url": "https://www.loc.gov/item/today-in-history/september-16/"
      },
      {
        "label": "Independence Day (Mexico) — Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Independence_Day_(Mexico)"
      },
      {
        "label": "Treaty of Córdoba — Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Treaty_of_C%C3%B3rdoba"
      },
      {
        "label": "Army of the Three Guarantees — Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Army_of_the_Three_Guarantees"
      },
      {
        "label": "Santa María-Calatrava Treaty — Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Santa_Mar%C3%ADa%E2%80%93Calatrava_Treaty"
      },
      {
        "label": "File: El cura D. Miguel Hidalgo proclama la Independencia Nacional en Dolores (1910 postcard, Adrián Unzueta) — Wikimedia Commons",
        "url": "https://commons.wikimedia.org/wiki/File:El_cura_D._Miguel_Hidalgo_proclama_la_Independencia_Nacional_en_Dolores,_a_la_madrugada_del_16_de_septiembre_de_1810,_no_obstante_que_no_ten%C3%ADa_terminados_a%C3%BAn_los_preparativos_para_la_revoluci%C3%B3n.jpg"
      }
    ],
    "image": "/images/mexican-independence-day.jpg",
    "imageAlt": "The original Bell of Dolores, moved from Hidalgo's parish church to Mexico City's National Palace, where the president rings it each September 15",
    "imageCredit": "Luicheto, CC BY-SA 3.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Campana_de_Dolores_en_el_nicho_de_Palacio_Nacional.JPG)"
  },
  {
    "slug": "1994-chinese-zodiac",
    "category": "Chinese Zodiac",
    "title": "1994 Chinese Zodiac: Wood Dog, But Only After February 10",
    "description": "1994 is the Year of the Wood Dog in the Chinese zodiac, but the lunar year didn't start until February 10. Anyone born earlier in January is a Rooster.",
    "published": "2026-08-23",
    "updated": "2026-08-23",
    "coreSummary": "1994 is the Year of the Wood Dog, running from February 10, 1994 through January 30, 1995 according to the Hong Kong Observatory's own Gregorian-lunar conversion table. Anyone born between January 1 and February 9, 1994, before that boundary, was actually born under the preceding year, Water Rooster, a distinction that at least one widely used celebrity zodiac list gets wrong.",
    "sections": [
      {
        "heading": "The Wood Dog year starts February 10, not January 1",
        "body": [
          "Chinese zodiac years follow the lunar calendar, so the \"1994 zodiac year\" doesn't line up with the 365 days most people picture when they see the number 1994. The Hong Kong Observatory's Gregorian-Lunar Calendar Conversion Table, the government's own reference for converting between the two calendars, labels the relevant lunar year Jia-Xu (甲戌) and marks February 10, 1994 as the first day of the first lunar month, the actual start of the new year. That is a government body's own published table, not a private calendar site's estimate.",
          "The year doesn't end on December 31 either. The Observatory's table for the following year shows the twelfth and final lunar month of Jia-Xu running out on January 30, 1995; the next day, January 31, opens the following lunar year, Yi-Hai (乙亥), Wood Pig. That puts the full Wood Dog window at February 10, 1994 through January 30, 1995, a span of 355 days that leaves out the first forty days of calendar-year 1994 entirely. Anyone born January 1 through February 9, 1994, that excluded stretch, falls before the boundary and belongs to the outgoing year instead, Gui-You (癸酉), Water Rooster, confirmed by the Observatory's own 1993 table."
        ],
        "image": {
          "src": "/images/1994-chinese-zodiac-dog-figure.jpg",
          "alt": "Qing dynasty porcelain figure of a dog from a set of the twelve Chinese zodiac animals, Kangxi period",
          "credit": "The Metropolitan Museum of Art, [Zodiac figure: dog](https://www.metmuseum.org/art/collection/search/44683), Kangxi period (1662–1722), public domain"
        }
      },
      {
        "heading": "A widely used celebrity zodiac list gets one of its own examples wrong",
        "body": [
          "That nine-day gap between January 1 and the February 10 cutoff isn't just a technicality. Three musicians and actors born in early 1994 land on opposite sides of it. Justin Bieber, born March 1, 1994, and Dakota Fanning, born February 23, 1994, were both born well after the boundary and are correctly Wood Dogs. Harry Styles, born February 1, 1994, was born nine days before it, which makes him a Water Rooster by the same Observatory table, not a Dog.",
          "Famous Birthdays' own \"1994 Chinese Zodiac | Wood Dog\" roundup page lists Harry Styles among the year's Dog-sign celebrities regardless. It's an easy mistake to make at scale: most celebrity-zodiac roundups map a birth year straight onto a zodiac animal without checking whether a given birthday falls before or after that specific year's lunar new year, which shifts by roughly a month from one year to the next and can land anywhere from late January to mid-February. A page built that way will misclassify anyone whose birthday falls before that particular year's own lunar new year, whenever in that January-to-mid-February range it happens to land; Styles's entry is one visible instance of it."
        ]
      },
      {
        "heading": "Wood, not Fire, Earth, Metal, or Water: why the element matters",
        "body": [
          "\"Chinese zodiac\" usually gets shortened to just the animal, but the traditional calendar assigns two labels to every year: an animal from a twelve-year cycle and an element from a five-element cycle, with each element covering two consecutive years, once in a yang form and once in yin, always in that order. A ten-position stem cycle carries the five elements this way, a yang year then a yin year for each element before the cycle moves to the next one; a twelve-position branch cycle carries the animals separately, one per year with no such subdivision. The two only realign every 60 years, the sexagenary cycle. 1994's stem is Jia, yang wood; its branch is Xu, the Dog.",
          "That's why \"Dog year\" alone leaves out real information. 1958 was also a Dog year, but its stem was Wu, yang earth, making it an Earth Dog. 2006 was Bing-Xu, Fire Dog. The Western zodiac's [Scorpio](/scorpio-dates/) doesn't carry this kind of second layer; a Scorpio is a Scorpio no matter which year they're born in. The exact pairing Jia-Xu, Wood Dog, last occurred in 1934 and doesn't come around again until 2054; every other Dog year on the calendar between those two dates carries a different element.",
          "The stem-branch pairing has a formal name, ganzhi, the stems-and-branches system, and it predates its use for popularizing twelve animal signs by centuries. Ten Heavenly Stems (jia, yi, bing, ding, wu, ji, geng, xin, ren, gui) cycle against twelve Earthly Branches (zi, chou, yin, mao, chen, si, wu, wei, shen, you, xu, hai), and each branch also carries one of the twelve zodiac animals; xu is the Dog. Ten and twelve share a greatest common factor of two, so only 60 of the 120 mathematically possible stem-branch pairings ever actually occur, which is the reason the full cycle runs 60 years instead of 120, and why a specific pairing like Jia-Xu comes back on a fixed 60-year schedule rather than any shorter interval. Before China's 1912 switch to the Gregorian calendar, that same sixty-year cycle was also how official records dated the year itself, not just a folk label attached to birth years."
        ]
      },
      {
        "heading": "Not every lunar calendar draws the boundary the same way",
        "body": [
          "Vietnam's Tet follows a lunar calendar borrowed from China centuries ago, and it usually falls on exactly the same date as Chinese New Year. The two calendars are calculated using different meridians, though, and Wikipedia's entry on Tet notes a one-hour time difference between Vietnam and China that can put the astronomical new moon on different calendar days in the two systems. Most years that gap doesn't change anything worth noticing. It isn't guaranteed, though: the same Wikipedia entry documents a year where the difference was large, 1985, when Vietnam observed its lunar new year a full month before China did.",
          "That's part of why this page cites the Hong Kong Observatory specifically instead of \"the Chinese calendar\" as a generic phrase. The observatory's published tables are pinned to a defined time zone and a defined astronomical method, the same standard this site applies to the [birthstones by month](/birthstones-by-month/) list elsewhere on the calendar. A reader working from a Vietnamese, Korean, or other regional lunar source should confirm it uses the same reference point before assuming an identical February 10 boundary; most years it will, but 1985 shows that isn't automatic. The zodiac animals themselves aren't identical across the two traditions either. Vietnam's version swaps in the Water Buffalo, Cat, and Goat where the Chinese calendar uses Ox, Rabbit, and Sheep, a difference unrelated to the date question but easy to conflate with it. Readers checking a Vietnamese or Korean lunar-calendar source for this same year should look for that source's own government or observatory citation rather than assume it automatically lines up with the Hong Kong Observatory's dates."
        ]
      }
    ],
    "faq": [
      {
        "question": "What Chinese zodiac sign is 1994?",
        "answer": "The Wood Dog, but only from February 10, 1994 onward. The Hong Kong Observatory's own Gregorian-lunar conversion table marks that date as the first day of the lunar year Jia-Xu, which runs through January 30, 1995."
      },
      {
        "question": "Was Harry Styles really born in the Year of the Dog?",
        "answer": "No, by the Hong Kong Observatory's own calendar boundary. He was born February 1, 1994, nine days before that year's lunar new year on February 10, which places him in the preceding year, Water Rooster, instead. Famous Birthdays' \"1994 Chinese Zodiac | Wood Dog\" page lists him as a Dog anyway."
      },
      {
        "question": "What if I was born in January 1994?",
        "answer": "Anyone born January 1 through February 9, 1994 was born before that year's lunar new year and belongs to the preceding zodiac year, Gui-You, Water Rooster, per the Hong Kong Observatory's 1993 conversion table, not the Wood Dog."
      },
      {
        "question": "Why is 1994 called the \"Wood\" Dog instead of just \"the Dog\"?",
        "answer": "Because the traditional calendar pairs each of the twelve zodiac animals with one of five elements, cycling through wood, fire, earth, metal, and water two years at a time. 1994's element is wood; other Dog years carry different elements, such as 1958's Earth Dog or 2006's Fire Dog."
      },
      {
        "question": "When is the next Wood Dog year?",
        "answer": "2054. The specific pairing of wood with the Dog only recurs every 60 years, the length of the full sexagenary cycle. The previous Wood Dog year was 1934."
      },
      {
        "question": "Is Chinese New Year always in February?",
        "answer": "No. Unlike a Western sign such as [Virgo](/virgo-dates/), whose date range barely shifts year to year, the Chinese new year's date swings by roughly a month depending on the lunar calendar, landing anywhere from January 21 to February 20. The 1994 new year fell on February 10, but 1993's fell on January 23, per the Hong Kong Observatory's own tables for those years."
      },
      {
        "question": "Does Vietnam's Tet always fall on the same date as Chinese New Year?",
        "answer": "Usually, but not always. Wikipedia's entry on Tet attributes the two calendars' occasional split to a one-hour time difference between Vietnam and China that can shift which day the astronomical new moon falls on. In 1985 the gap was large: Vietnam observed its new year a full month before China did. That's part of why this page cites the Hong Kong Observatory specifically rather than \"the Chinese calendar\" in the abstract."
      }
    ],
    "sources": [
      {
        "label": "Hong Kong Observatory — Gregorian-Lunar Calendar Conversion Table of 1994 (Jia-xu, year of the Dog)",
        "url": "https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/1994e.pdf"
      },
      {
        "label": "Hong Kong Observatory — Gregorian-Lunar Calendar Conversion Table of 1995 (Yi-hai, year of the Pig)",
        "url": "https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/1995e.pdf"
      },
      {
        "label": "Hong Kong Observatory — Gregorian-Lunar Calendar Conversion Table of 1993 (Gui-you, year of the Rooster)",
        "url": "https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/1993e.pdf"
      },
      {
        "label": "The Metropolitan Museum of Art — Zodiac figure: dog",
        "url": "https://www.metmuseum.org/art/collection/search/44683"
      },
      {
        "label": "Wikipedia — Harry Styles",
        "url": "https://en.wikipedia.org/wiki/Harry_Styles"
      },
      {
        "label": "Wikipedia — Justin Bieber",
        "url": "https://en.wikipedia.org/wiki/Justin_Bieber"
      },
      {
        "label": "Wikipedia — Dakota Fanning",
        "url": "https://en.wikipedia.org/wiki/Dakota_Fanning"
      },
      {
        "label": "Famous Birthdays — 1994 Chinese Zodiac | Wood Dog",
        "url": "https://www.famousbirthdays.com/zodiac/1994.html"
      },
      {
        "label": "Wikipedia — Tết",
        "url": "https://en.wikipedia.org/wiki/T%E1%BA%BFt"
      },
      {
        "label": "Wikipedia — Heavenly Stems",
        "url": "https://en.wikipedia.org/wiki/Heavenly_Stems"
      },
      {
        "label": "Wikipedia — Earthly Branches",
        "url": "https://en.wikipedia.org/wiki/Earthly_Branches"
      }
    ],
    "image": "/images/1994-chinese-zodiac-dog-figure.jpg",
    "imageAlt": "Qing dynasty porcelain figure of a dog from a set of the twelve Chinese zodiac animals, Kangxi period",
    "imageCredit": "The Metropolitan Museum of Art, [Zodiac figure: dog](https://www.metmuseum.org/art/collection/search/44683), Kangxi period (1662–1722), public domain"
  },
  {
    "slug": "world-mental-health-day",
    "category": "Observances",
    "title": "World Mental Health Day: October 10, and Its 1992 Founder",
    "description": "World Mental Health Day falls on October 10, founded in 1992 by WFMH's Richard Hunter. Two nearby dates are often confused with it, but share no founder.",
    "published": "2026-08-23",
    "updated": "2026-08-23",
    "coreSummary": "World Mental Health Day falls on October 10 every year, a worldwide observance the World Federation for Mental Health (WFMH) first held in 1992 at the initiative of its then Deputy Secretary General, Richard Hunter. It sits within six weeks of two separately founded mental-health observances, Mental Illness Awareness Week (NAMI, 1990, United States only) and World Suicide Prevention Day (IASP and WHO, 2003, September 10), that share no founder or founding year with it despite being routinely confused with it.",
    "dateRule": {
      "kind": "fixed",
      "text": "October 10 every year, worldwide. The date does not shift for weekends or weekdays.",
      "source": {
        "label": "Wikipedia — World Mental Health Day",
        "url": "https://en.wikipedia.org/wiki/World_Mental_Health_Day"
      },
      "occurrences": [
        {
          "date": "2026-10-10",
          "weekday": "Saturday"
        },
        {
          "date": "2027-10-10",
          "weekday": "Sunday"
        },
        {
          "date": "2028-10-10",
          "weekday": "Tuesday"
        },
        {
          "date": "2029-10-10",
          "weekday": "Wednesday"
        },
        {
          "date": "2030-10-10",
          "weekday": "Thursday"
        },
        {
          "date": "2031-10-10",
          "weekday": "Friday"
        }
      ]
    },
    "founding": {
      "status": "documented",
      "text": "World Mental Health Day was first observed on October 10, 1992, started as an annual activity of the World Federation for Mental Health (WFMH) by the organization's then Deputy Secretary General, Richard Hunter. WFMH itself is older, founded in 1948 in the same postwar wave as the United Nations and the World Health Organization; Wikipedia's article on the federation names G. Brock Chisholm, the WHO's first Director-General and a psychiatrist, as one of the leaders who formed it. In the new day's first two years it carried no specific theme, only the general goals of promoting mental health advocacy and public education. Its central activity, a two-hour telecast broadcast globally by satellite from studios in Tallahassee, Florida, ran for three years by secondary accounts, spanning that untitled stretch and the year the first theme arrived; WFMH board members appeared in the studio, with live telephone participation from Australia, Chile, England, and Zambia, plus an unscheduled call-in from a group of WFMH members in Swaziland and the first of many feedback reports arriving from Peru that year. WFMH adopted its first official theme in 1994, at the suggestion of then Secretary General Eugene Brody: \"Improving the Quality of Mental Health Services throughout the World.\"",
      "source": {
        "label": "LinkedIn — \"World Mental Health Day - a history,\" Julie Millard AM, republishing a WFMH history collated by Michael Burge OAM",
        "url": "https://www.linkedin.com/pulse/world-mental-health-day-history-julie-millard"
      }
    },
    "sections": [
      {
        "heading": "What World Mental Health Day is",
        "body": [
          "World Mental Health Day is an annual observance held every October 10, organized around a theme the World Federation for Mental Health (WFMH) sets each year. WFMH is the sponsoring body; the World Health Organization (WHO) supports the day by raising awareness through its relationships with health ministries and civil-society organizations around the world, and by developing technical and communication material, without being the day's founding organization itself.",
          "The day functions as a coordination point rather than a single event: national governments, health charities, employers, and advocacy groups each run their own campaigns, talks, and fundraisers under it, loosely tied together by that year's shared theme."
        ]
      },
      {
        "heading": "The 1992 origin, and the founder most calendar sites leave out",
        "body": [
          "WFMH is older than the day it created. The organization was founded in 1948, in the same postwar wave of international bodies as the United Nations and the WHO. Wikipedia's article on the federation credits G. Brock Chisholm, the WHO's first Director-General and himself a psychiatrist, as one of the leaders who formed it, with a founding document titled \"Mental Health and World Citizenship.\"",
          "World Mental Health Day itself came 44 years later. It was first observed on October 10, 1992, started as an annual WFMH activity by the organization's then Deputy Secretary General, Richard Hunter. That founder's name is missing from most calendar and awareness-day sites, which tend to credit the day to WFMH as an institution without naming who inside it actually started it.",
          "The day had no specific theme for its first two years, only general goals of promoting mental health advocacy and public education. Its signature activity in that stretch was a two-hour telecast, broadcast globally by satellite from studios in Tallahassee, Florida, with WFMH board members in the studio and live telephone participation from Australia, Chile, England, and Zambia. One account of that first broadcast, collated by WFMH historian Michael Burge OAM, notes an unscheduled call-in from a group of WFMH members watching in Swaziland, and the first of what became many annual feedback reports arriving from Peru that same year.",
          "WFMH adopted its first official theme in 1994, at the suggestion of then Secretary General Eugene Brody: \"Improving the Quality of Mental Health Services throughout the World.\" Every theme since has followed that pattern, a single sentence WFMH sets ahead of each October 10."
        ]
      },
      {
        "heading": "Two other dates get confused with this one, and neither shares a founder",
        "body": [
          "World Mental Health Day sits inside a six-week stretch that contains two other, separately founded mental-health observances, and the three are routinely mixed up in casual writing despite having nothing organizationally in common.",
          "Mental Illness Awareness Week runs every year during the first full week of October, established in 1990 to recognize the U.S. National Alliance on Mental Illness's (NAMI) education and advocacy work. Unlike World Mental Health Day, it is a United States-only observance, run by a different organization, founded two years earlier. Wikipedia's own article on the week lists World Mental Health Day among the campaigns it \"coincides with,\" which is a fair description of the overlap: adjacent in the calendar, unrelated in origin.",
          "World Suicide Prevention Day, covered in more detail on this site's page about [National Suicide Prevention Month](/suicide-prevention-month/), falls on September 10, a full month before World Mental Health Day, and was created in 2003 by the International Association for Suicide Prevention with the WHO as co-sponsor, eleven years after WFMH's day and by an entirely different pair of organizations.",
          "Line the three up and the pattern is that no two of them share a founding organization, a founding year, or even a country of origin. World Mental Health Day is both the oldest of the three and the only one that was global from its first observance."
        ]
      },
      {
        "heading": "What the day has actually driven, beyond awareness",
        "body": [
          "Most years produce talks and social-media campaigns rather than policy changes, but Wikipedia's article on the day records one concrete exception: on World Mental Health Day 2018, while the UK government hosted the first-ever global mental health summit, Prime Minister Theresa May appointed Jackie Doyle-Price as the United Kingdom's first suicide prevention minister, a cabinet-adjacent role created and announced to coincide with that year's observance.",
          "WFMH's own claimed global reach is one point where two of Wikipedia's own pages disagree with each other. The article on World Mental Health Day describes WFMH as having \"members and contacts in more than 150 countries,\" while Wikipedia's separate article on the federation itself states \"more than 94 countries on six continents.\" Neither figure links to a dated primary count from WFMH, so this page is not picking one over the other; both numbers exist in the record, undated and unreconciled."
        ]
      },
      {
        "heading": "The 2026 theme, and how the annual theme actually works",
        "body": [
          "WFMH has set a new theme for World Mental Health Day every year since 1994, and two independent mental-health charities, the UK's Mental Health Foundation and United for Global Mental Health, both state the 2026 theme as WFMH's, though they render its wording slightly differently: the Mental Health Foundation writes it as \"Lived experiences heard: Real voices, real change,\" while United for Global Mental Health capitalizes it as \"Lived Experience Heard: Real Voices, Real Change,\" with the noun singular rather than plural. This page tried to confirm the exact wording directly against WFMH's own campaign page, which returned a security-verification screen rather than readable content, so the theme here is sourced to those two independent secondary organizations rather than to WFMH's own site.",
          "United for Global Mental Health's own description of the process notes that WFMH sets the day's official theme, while other bodies, including the WHO and UNICEF, sometimes develop their own complementary messaging alongside it in a given year, which is part of why the exact wording in circulation can vary by source even when everyone is describing the same year's theme."
        ]
      },
      {
        "heading": "Where this sits next to other awareness observances on this site",
        "body": [
          "This site has now checked the founding record behind several health-related observances, and World Mental Health Day's is unusually solid by comparison: a named founder, a named founding organization, and a specific year, all corroborated by two independent sources rather than resting on a single account.",
          "[National Suicide Prevention Month](/suicide-prevention-month/) covers the more specific September observance that sits a month earlier on the calendar and has never become U.S. federal law, unlike this day's international standing. [Movember](/movember/) eventually added mental health and suicide prevention as one of its three funded causes in 2006, fourteen years after WFMH had already established a day dedicated to the subject worldwide. [ADHD Awareness Month](/adhd-awareness-month/) shows the more typical pattern for U.S. awareness observances, a run of Senate resolutions that simply stopped being introduced after five years, a level of institutional follow-through this day's founding record does not need, because it never depended on a legislature to begin with."
        ]
      }
    ],
    "faq": [
      {
        "question": "Who founded World Mental Health Day, and when?",
        "answer": "Richard Hunter, then the World Federation for Mental Health's (WFMH) Deputy Secretary General, started it as an annual WFMH activity on October 10, 1992. WFMH itself was founded earlier, in 1948, in the same postwar wave as the United Nations and the World Health Organization."
      },
      {
        "question": "Is World Mental Health Day the same as Mental Illness Awareness Week?",
        "answer": "No. Mental Illness Awareness Week runs during the first full week of October and was established in 1990 by the U.S. National Alliance on Mental Illness (NAMI) as a United States-only observance. World Mental Health Day is a separate, worldwide observance founded two years later, in 1992, by WFMH. Wikipedia's article on the week lists World Mental Health Day among the campaigns it coincides with, but the two have never shared an organization or a founder."
      },
      {
        "question": "Is World Mental Health Day the same as World Suicide Prevention Day?",
        "answer": "No. World Suicide Prevention Day falls on September 10, a month earlier, and was created in 2003 by the International Association for Suicide Prevention with the World Health Organization as co-sponsor, eleven years after WFMH first held World Mental Health Day. The two address related but distinct scopes: suicide prevention specifically, versus mental health broadly."
      },
      {
        "question": "What is the theme for World Mental Health Day in 2026?",
        "answer": "Two independent mental-health charities, the UK's Mental Health Foundation and United for Global Mental Health, both attribute the 2026 theme to WFMH, though they word it slightly differently: \"Lived experiences heard: Real voices, real change\" versus \"Lived Experience Heard: Real Voices, Real Change.\" WFMH's own campaign page returned a security-verification screen when this page tried to confirm the exact wording directly, so it is sourced to those two secondary organizations rather than to WFMH's site."
      },
      {
        "question": "Does the World Health Organization run World Mental Health Day?",
        "answer": "No. The World Federation for Mental Health founded and runs the day. The WHO supports it by raising awareness through its relationships with health ministries and civil-society groups worldwide and by developing technical and communication material, a supporting role rather than a founding one."
      },
      {
        "question": "What happened on World Mental Health Day 2018 in the UK?",
        "answer": "Prime Minister Theresa May appointed Jackie Doyle-Price as the United Kingdom's first suicide prevention minister, timed to that year's observance, while the UK government simultaneously hosted the first-ever global mental health summit."
      },
      {
        "question": "How many countries does the World Federation for Mental Health actually reach?",
        "answer": "Sources disagree. Wikipedia's article on World Mental Health Day states WFMH has members and contacts in more than 150 countries, while Wikipedia's separate article on WFMH itself states more than 94 countries on six continents. Neither figure links to a dated primary count, so this page reports both rather than choosing one."
      }
    ],
    "sources": [
      {
        "label": "Wikipedia — World Mental Health Day",
        "url": "https://en.wikipedia.org/wiki/World_Mental_Health_Day"
      },
      {
        "label": "Wikipedia — World Federation for Mental Health",
        "url": "https://en.wikipedia.org/wiki/World_Federation_for_Mental_Health"
      },
      {
        "label": "LinkedIn — \"World Mental Health Day - a history,\" Julie Millard AM, republishing a WFMH history collated by Michael Burge OAM",
        "url": "https://www.linkedin.com/pulse/world-mental-health-day-history-julie-millard"
      },
      {
        "label": "Wikipedia — Mental Illness Awareness Week",
        "url": "https://en.wikipedia.org/wiki/Mental_Illness_Awareness_Week"
      },
      {
        "label": "World Health Organization — World Suicide Prevention Day campaign page",
        "url": "https://www.who.int/campaigns/world-suicide-prevention-day"
      },
      {
        "label": "Mental Health Foundation (UK) — World Mental Health Day, 2026 theme",
        "url": "https://www.mentalhealth.org.uk/our-work/campaigns/world-mental-health-day"
      },
      {
        "label": "United for Global Mental Health — World Mental Health Day 2026",
        "url": "https://unitedgmh.org/world-mental-health-day/"
      }
    ],
    "image": "/images/world-mental-health-day-compare.svg",
    "imageAlt": "Timeline comparing three mental-health observances inside six weeks: World Suicide Prevention Day on September 10 (founded 2003 by IASP and WHO), Mental Illness Awareness Week in the first full week of October (founded 1990 by NAMI, U.S. only), and World Mental Health Day on October 10 (founded 1992 by the World Federation for Mental Health, worldwide)"
  }
];


