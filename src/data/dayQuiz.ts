export interface DayQuizItem {
	claim: string;
	verdict: boolean;
	explanation: string;
	sourceSlug: string;
	sourceTitle: string;
}

// Curated from src/data/guides.ts FAQ entries -- see 日期真假判断题-实施方案_20260806.md.
// Each claim/explanation is the FAQ question/answer verbatim, not rewritten. verdict was
// hand-judged by reading each answer's full context (not keyword-matched); FAQs whose
// answers were genuinely mixed/hedged (e.g. "depends on the source", "widely repeated but
// unconfirmed") were excluded rather than forced into a binary verdict.
export const dayQuizItems: DayQuizItem[] = [
	{
		claim: 'Is National Boyfriend Day an official holiday?',
		verdict: false,
		explanation:
			'No. It is not a federal or public holiday in the United States or elsewhere. Nothing closes, no one receives time off, and there is no congressional record or presidential proclamation establishing it. The word "National" in the name is honorific and was not conferred by any government body.',
		sourceSlug: 'national-boyfriend-day',
		sourceTitle: 'National Boyfriend Day: October 3, and Its Unverified Origin',
	},
	{
		claim: 'Is there a National Girlfriend Day?',
		verdict: true,
		explanation:
			'Yes, National Girlfriend Day is observed on August 1. It is often cited as the reason the boyfriend version exists, but the two registries that define it, National Today and National Day Calendar, both describe August 1 as a day for female friendship rather than for romantic partners. Its own origin is disputed rather than settled, with different sources crediting different people or groups depending on which account you read.',
		sourceSlug: 'national-boyfriend-day',
		sourceTitle: 'National Boyfriend Day: October 3, and Its Unverified Origin',
	},
	{
		claim: 'Is National Daughters Day the same as International Daughters Day?',
		verdict: false,
		explanation:
			'No. They are listed as separate observances with separate dates. National Daughters Day is fixed on September 25 and is the version used in the US. International Daughters Day falls on the fourth Sunday in September and originated in India. They often land within a few days of each other, which is why they are frequently treated as one day.',
		sourceSlug: 'national-daughters-day',
		sourceTitle: 'National Daughters Day: Date, Origin, and Why Sources Disagree',
	},
	{
		claim: 'Is National Daughters Day an official US holiday?',
		verdict: false,
		explanation:
			'No. It has no presidential proclamation and no act of Congress behind it, and it is not a federal holiday. Nothing closes and no one gets the day off. The closest it ever came to official status was in March 1950, when Representative Tom Steed of Oklahoma introduced H.R. 7938 to designate the second Sunday in April as National Daughter\'s Day. The bill was referred to the House Judiciary Committee and never passed.',
		sourceSlug: 'national-daughters-day',
		sourceTitle: 'National Daughters Day: Date, Origin, and Why Sources Disagree',
	},
	{
		claim: 'Is National Sons Day an official or federal holiday?',
		verdict: false,
		explanation:
			'No. Neither March 4 nor September 28 is a federal holiday, and nothing closes for it. National Sons Day is an unofficial observance, sometimes described in press coverage as a quasi-holiday, meaning people genuinely observe it but no government body established it.',
		sourceSlug: 'national-sons-day',
		sourceTitle: 'National Sons Day: March 4, and Why September 28 Keeps Showing Up',
	},
	{
		claim: 'Is National Sons Day the same as Take Our Sons to Work Day?',
		verdict: false,
		explanation:
			'No, though the two are historically tangled. A group of New Jersey students founded an organization called National Sons Day in 1996 and ran Take Our Sons to Work Day on the first Thursday in May from 1996. Some calendar sites date that launch to 1998 instead. That program merged with the daughters\' program in 2003 into the combined Take Our Daughters and Sons to Work Day, and Junior Achievement took the program over in 2024, running it each April as Take a Child to Work Day and Beyond. The modern National Sons Day on March 4 is a separate observance created in 2018.',
		sourceSlug: 'national-sons-day',
		sourceTitle: 'National Sons Day: March 4, and Why September 28 Keeps Showing Up',
	},
	{
		claim: 'Is National Coffee Day the same as International Coffee Day?',
		verdict: false,
		explanation:
			'No. They are two different observances on two different dates. National Coffee Day in the United States is September 29 and has no documented founder. International Coffee Day is October 1; it was agreed by member states of the International Coffee Organization in March 2014, first held on October 1, 2015, and designated by the UN General Assembly on March 10, 2026 in resolution A/RES/80/249. Some countries observe their own coffee day on October 1 instead of September 29, and others use unrelated dates.',
		sourceSlug: 'national-coffee-day',
		sourceTitle: 'National Coffee Day: September 29 in the United States',
	},
	{
		claim: 'Is National Coffee Day a federal holiday?',
		verdict: false,
		explanation:
			'No. It is not a federal holiday and carries no legal status. Government offices, banks, schools, and businesses operate normally on September 29. The closest official action is H.Res. 784 in the 119th Congress, a non-binding resolution introduced on September 30, 2025 that expressed support for the designation and was referred to committee.',
		sourceSlug: 'national-coffee-day',
		sourceTitle: 'National Coffee Day: September 29 in the United States',
	},
	{
		claim: 'Is Grandparents Day the first Sunday in September?',
		verdict: false,
		explanation:
			'No. Under 36 U.S.C. § 125 the rule is the first Sunday in September after Labor Day, which is a different day in most years. Labor Day is the first Monday in September, so National Grandparents Day always falls between September 7 and September 13, while the first Sunday of the month falls between September 1 and September 7. The two dates coincide only in years when September 1 is a Monday, such as 2025 and 2031. In 2026 through 2030 the popular paraphrase is off by exactly one week.',
		sourceSlug: 'national-grandparents-day',
		sourceTitle: 'National Grandparents Day: The Date Rule in US Federal Law',
	},
	{
		claim: 'Do other countries observe Grandparents Day on the same date as the US?',
		verdict: false,
		explanation:
			'No. There is no international standard, though the Canadian and American dates happen to coincide most years. Italy observes the Festa nazionale dei nonni on October 2 every year under Law 159 of 31 July 2005. Canada marks Grandparents Day on the second Sunday in September, which coincides with the American date in most years and falls a week later in the rest. In Australia, New South Wales runs a state-organised Grandparents Day in late October, held on October 26 in 2025.',
		sourceSlug: 'national-grandparents-day',
		sourceTitle: 'National Grandparents Day: The Date Rule in US Federal Law',
	},
	{
		claim: 'Is National Boss\'s Day a federal holiday?',
		verdict: false,
		explanation:
			'No. It has no federal or state legal status. Government offices, banks, and most businesses operate on their normal schedule on October 16, and no time off is attached to the day.',
		sourceSlug: 'national-bosses-day',
		sourceTitle: 'National Boss\'s Day: October 16, and the Rule Nobody Signed Off On',
	},
	{
		claim: 'Is Boss\'s Day observed outside the United States?',
		verdict: true,
		explanation:
			'Yes, generally on the same October 16 date. It is also described as observed in Canada, India, Ireland, Australia, and the United Kingdom, though the sources tracking this do not break down which workplaces within those countries actually mark it.',
		sourceSlug: 'national-bosses-day',
		sourceTitle: 'National Boss\'s Day: October 16, and the Rule Nobody Signed Off On',
	},
	{
		claim: 'Is National Cat Day the same as International Cat Day?',
		verdict: false,
		explanation:
			'No. International Cat Day falls on August 8 and was founded in 2002 by the International Fund for Animal Welfare, with stewardship passing to International Cat Care in 2020. National Cat Day falls on October 29 and was founded separately, in 2005, by Colleen Paige in the United States.',
		sourceSlug: 'national-cat-day',
		sourceTitle: 'National Cat Day: October 29, and Which Cat Holiday You Mean',
	},
	{
		claim: 'Is National Cat Day the same as Black Cat Appreciation Day or National Black Cat Day?',
		verdict: false,
		explanation:
			'No, and those two are also not each other. Black Cat Appreciation Day (US) falls on August 17 and was founded in 2011 by Wayne H. Morris in memory of his sister and her cat, Sinbad. National Black Cat Day (UK) falls on October 27 and was launched the same year, 2011, by the charity Cats Protection to improve adoption rates for black cats. National Cat Day, the subject of this page, is a separate US observance on October 29.',
		sourceSlug: 'national-cat-day',
		sourceTitle: 'National Cat Day: October 29, and Which Cat Holiday You Mean',
	},
	{
		claim: 'Is National Dog Day the same as International Dog Day?',
		verdict: true,
		explanation:
			'Effectively yes. Both names refer to the same August 26 observance founded by Colleen Paige in 2004; Wikipedia\'s own article defines them as interchangeable. This differs from International Cat Day, which has a genuinely separate founding history through the International Fund for Animal Welfare.',
		sourceSlug: 'national-dog-day',
		sourceTitle: 'National Dog Day: August 26, and Two Origin Stories That Don\'t Agree',
	},
	{
		claim: 'Is blue topaz a December birthstone?',
		verdict: false,
		explanation:
			'Not officially. Retailers market it heavily as a December birthstone because its cool blue tone matches the month\'s other stones, but it has never been added to Jewelers of America\'s official list, which names only turquoise, zircon, and tanzanite.',
		sourceSlug: 'december-birthstone',
		sourceTitle: 'December Birthstone: Turquoise, Zircon, and Tanzanite',
	},
	{
		claim: 'Does the actual constellation Virgo match the astrology sign\'s dates?',
		verdict: false,
		explanation:
			'Not closely. Per EarthSky, for the period from roughly 1990 to 2062, the Sun passes through the astronomical constellation Virgo from roughly September 16 to October 30, a 44-day span, the longest of any zodiacal constellation, because the International Astronomical Union\'s 1930 constellation boundaries were drawn around the stars\' actual positions rather than in equal 30-degree slices.',
		sourceSlug: 'virgo-dates',
		sourceTitle: 'Virgo Dates: August 23–September 22, in Three Systems',
	},
	{
		claim: 'Are Virgo\'s dates the same in every astrology system?',
		verdict: false,
		explanation:
			'No. Vedic sidereal astrology assigns Kanya (Virgo) to roughly September 17–October 16, about a month later than the Western tropical range, because it tracks the actual background stars rather than the equinox. The two systems are currently about 24 degrees apart, a gap caused by the precession of Earth\'s axis and growing by about one degree every 72 years.',
		sourceSlug: 'virgo-dates',
		sourceTitle: 'Virgo Dates: August 23–September 22, in Three Systems',
	},
	{
		claim: 'Is bloodstone still considered an official March birthstone?',
		verdict: true,
		explanation:
			'According to GIA and the American Gem Society, yes. The International Gem Society lists it as March\'s "traditional" birthstone, alongside aquamarine as the "modern" one.',
		sourceSlug: 'march-birthstone',
		sourceTitle: 'March Birthstone: Aquamarine and Bloodstone',
	},
	{
		claim: 'Does the September birthstone have to be blue?',
		verdict: false,
		explanation:
			'No. Sapphire covers any color of corundum except red, which is classified as ruby instead. The American Gem Society lists white, pink, orange, yellow, green, violet, purple, and black sapphires as equally valid, along with the rare pinkish-orange padparadscha variety.',
		sourceSlug: 'september-birthstone',
		sourceTitle: 'September Birthstone: Sapphire, Unchanged Since 1912',
	},
	{
		claim: 'Is there a different September birthstone in the UK?',
		verdict: true,
		explanation:
			'Yes. Britain\'s jewelry trade list, revised in 2013, names both sapphire and lapis lazuli for September. The US Jewelers of America list has never included lapis lazuli for September; that stone belongs to December in the American tradition.',
		sourceSlug: 'september-birthstone',
		sourceTitle: 'September Birthstone: Sapphire, Unchanged Since 1912',
	},
	{
		claim: 'Are Scorpio\'s dates the same in every astrology system?',
		verdict: false,
		explanation:
			'No. Vedic sidereal astrology assigns Vrishchika (Scorpio) to roughly November 16–December 15, about a month later than the Western tropical range, because it tracks the actual background stars rather than the equinox. The two systems are currently about 24 degrees apart, a gap caused by the precession of Earth\'s axis and growing by about one degree every 72 years.',
		sourceSlug: 'scorpio-dates',
		sourceTitle: 'Scorpio Dates: October 23–November 21, in Three Systems',
	},
	{
		claim: 'Does the actual constellation Scorpius match the astrology sign\'s dates?',
		verdict: false,
		explanation:
			'Not closely, and by a wide margin. Per EarthSky, the Sun passes through the astronomical constellation Scorpius for only about a week, roughly November 23 to November 29, before crossing into Ophiuchus, a genuine zodiac constellation that was never counted as one of the traditional twelve signs. Sky & Telescope notes Scorpius as the shortest solar crossing of any zodiac constellation, the opposite extreme from Virgo\'s more than forty days.',
		sourceSlug: 'scorpio-dates',
		sourceTitle: 'Scorpio Dates: October 23–November 21, in Three Systems',
	},
	{
		claim: 'Is garnet always red?',
		verdict: false,
		explanation:
			'No. It\'s a mineral group of at least six commercially relevant species covering nearly every color, from spessartine\'s orange to tsavorite\'s saturated green. A genuinely blue, color-changing garnet wasn\'t documented until a 1998 find in Bekily, Madagascar.',
		sourceSlug: 'january-birthstone',
		sourceTitle: 'January Birthstone: Garnet, Unchanged Since Before 1912',
	},
	{
		claim: 'Has January\'s birthstone ever been changed or revised?',
		verdict: false,
		explanation:
			'No. Wikipedia\'s comparison of four separate birthstone lists — a centuries-old tradition, the 1912 US standard, a 2013 UK list, and a 2019 US update — names garnet in every single column with no variation, an outcome no other month in that comparison matches.',
		sourceSlug: 'january-birthstone',
		sourceTitle: 'January Birthstone: Garnet, Unchanged Since Before 1912',
	},
	{
		claim: 'Does the DEA organize Red Ribbon Week?',
		verdict: false,
		explanation:
			'No. The DEA supports and promotes it: publishing a planning toolkit, hosting an annual video PSA contest, and running a one-time Boy Scout and Girl Scout patch program in 2018. The National Family Partnership, a private nonprofit headquartered in Miami, has been the official national organizer and sponsor since 1988.',
		sourceSlug: 'red-ribbon-week',
		sourceTitle: 'Red Ribbon Week: October 23–31 Every Year, and Who Actually Runs It',
	},
	{
		claim: 'Is Red Ribbon Week a federal holiday?',
		verdict: false,
		explanation:
			'No. It is an awareness observance with no legal holiday status. No federal offices close and no paid leave attaches to it; participation by schools, workplaces, and communities is voluntary, through activities like ribbon-wearing, pledges, and classroom programs.',
		sourceSlug: 'red-ribbon-week',
		sourceTitle: 'Red Ribbon Week: October 23–31 Every Year, and Who Actually Runs It',
	},
];
