# DayAlmanac outreach drafts

Append-only log of pitch emails drafted for guest-post-outreach / backlink outreach. Do not overwrite prior entries.

---

## 2026-08-06 — Keep Indiana Learning ("Month By Month Magic" post) — date-correction pitch

**Target:** Keep Indiana Learning (keepindianalearning.org), a nonprofit educator professional-development team (Central Indiana Educational Service Center). Their July 22, 2026 blog post "Month By Month Magic: Celebrating National Days in Your Classroom All Year Long" by Abigail Carter lists National Grandparents Day as September 8, which is factually wrong for 2026 (actual date: September 13, per 36 U.S.C. § 125 — first Sunday in September after Labor Day; Labor Day 2026 is September 7). September 8, 2026 is not even a Sunday.

**Recipient:** KeepIndianaLearning@ciesc.org
**Subject:** Small date correction for your Sept. National Days post

**Body:**

Hi Keep Indiana Learning team,

I run DayAlmanac, a small reference site that tracks how national observance dates are actually set (statutes, registries, that kind of thing). I came across Abigail Carter's "Month By Month Magic" post and wanted to flag one thing before the school year gets there.

The September entry lists National Grandparents Day as September 8. In 2026 it's actually September 13. The federal rule (36 U.S.C. § 125) sets it as the first Sunday in September after Labor Day, not just the first Sunday in September. Those two only line up when September 1 falls on a Monday, which trips up a lot of calendars. Labor Day 2026 is September 7, so the Sunday after it is the 13th.

We have a page that lays out the rule and a year-by-year table through 2031, in case it's useful for double-checking: https://dayalmanac.com/national-grandparents-day/

Figured this was worth a quick note since the post is clearly meant to carry teachers through the whole school year. Nice project, by the way. The grandparent interview activity is a good one.

Best,
Owen
DayAlmanac
contact@dayalmanac.com

**Status:** Independent review agent verdict "can send" (verified dedup, fact-checked the statute/date math, confirmed the live page exists, checked tone). Sent 2026-08-06 via gmail_send.py --from dayalmanac. Gmail message ID: 19fd726f72174411, thread ID: 19fd726f72174411.

---

## 2026-08-09 — icalendars.net (Grandparents Day reference page) — broken-link replacement pitch

**Target:** icalendars.net, a small multi-domain calendar/observances reference network (also runs icalendar.co.uk, icalendario.it/pt/br, icalendrier.fr, ikalender.dk/org, ikalendrar.se). Their "Dates and Origins of Grandparents Day" page (icalendars.net/celebrations/grandparents-day) cites two references in a formal "References" section. Reference [1] is http://www.grandparents.com/grandkids/grandparents-day/when-is-grandparents-day, which supports the on-page claim "Grandparent's day is celebrated in the United States as well as the United Kingdom the first day after labor day."

**Confirmed dead:** grandparents.com has no DNS delegation at all (SERVFAIL/REFUSED at the authoritative nameservers; `dig www.grandparents.com` and `dig grandparents.com` both return empty; HTTPS handshake fails). WebSearch confirms Grandparents.com, Inc. went out of business on September 26, 2017 — the domain has been fully dead for years, not a transient WAF block (their sibling reference [2], legacyproject.org, returns a clean 200 and was left alone).

**Bonus factual angle:** the claim itself ("the first day after labor day") is imprecise — the icalendars.net page's own date list two lines above shows Sunday, September 13, 2026 and Sunday, September 12, 2027, i.e. always a Sunday, not literally the calendar day after Labor Day. DayAlmanac's page documents the actual rule (36 U.S.C. § 125: first Sunday in September after Labor Day) with the statute chain and a year-by-year table through 2031.

**Recipient:** contact@icalendars.net (site's general contact address, found via /contact page; no named author/editor listed)
**Subject:** Dead source link on your Grandparents Day page

**Body:**

Hi,

I was checking references on your National Grandparents Day page (icalendars.net/celebrations/grandparents-day) and noticed reference [1], the grandparents.com link, is dead. The domain has had no working DNS since the company that ran it closed in 2017, so it's not something that will come back.

There's also a small wording issue on the claim that link was backing up. The page says the observance falls "the first day after Labor Day," but the U.S. statute (36 U.S.C. § 125) sets it as the first Sunday in September after Labor Day. That's why your own date list under it shows Sunday, September 13, 2026 and Sunday, September 12, 2027, always a Sunday, not literally the day after.

We put together a page that walks through that statute chain (Labor Day's own definition under 5 U.S.C. § 6103(a), then the Sunday after it) with a year-by-year table through 2031, in case it's useful as a replacement source: https://dayalmanac.com/national-grandparents-day/

No pressure either way, just didn't want a dead link sitting in your references section.

Best,
Owen
DayAlmanac
contact@dayalmanac.com

**Checks done:** Passed through Skill(humanizer) and Skill(avoid-ai-writing) (one em dash removed, one "worth a second look" vague-endorsement phrase replaced with a concrete reason; final pass clean — straight quotes, no em/en dashes). Dedup checked via `gmail_send.py list --query "to:icalendars.net OR from:icalendars.net OR contact@icalendars.net"` (empty) and `grep -ril "icalendars" 独立站/` across the whole matrix (no prior contact found). Replacement URL (https://dayalmanac.com/national-grandparents-day/) confirmed live (HTTP 200) and fact-checked against src/data/guides.ts.

**Status: independent review verdict "can send" (DNS-failure evidence cross-checked three ways — direct-connect control group, SERVFAIL, independent news sources on the 2017 shutdown). Sent 2026-08-09 via `gmail_send.py send --from dayalmanac`, Message ID `19fe532f106a413d`.** （2026-08-09流量站夜间运维审核已用`gmail_send.py list`核实该邮件确实发出——上一行下方原有一条陈旧的"PENDING INDEPENDENT REVIEW — 尚未发送"重复状态行，是发送前草稿状态未清理干净留下的，已删除避免误导下次审核）

**Follow-up (2026-08-21):** Verified via curl that icalendars.net/celebrations/grandparents-day still points to the dead grandparents.com link (not_replaced) 12 days after the original pitch, within the task's 10-14 day follow-up window. `gmail_send.py list --query "from:icalendars.net"` and `"from:contact@icalendars.net"` both returned empty, confirming no reply. Sent a brief 1-2 sentence follow-up quoting the original message below it, passed through Skill(humanizer) and Skill(avoid-ai-writing) (both clean). Sent via `gmail_send.py send --from dayalmanac`, Message ID `1a024c637227e46a`.

---

## 2026-08-16 — Checkiday.com (National Cat Day page) — broken-link replacement pitch (web form, not email)

**Target:** Checkiday.com (founded 2011 by Seth Westphal, "at least 5,500 unique holidays" per their own About page), a large holiday-database site. No listed public email; only a POST contact form at checkiday.com/contact.php (fields: name, email, message).

Their National Cat Day page (checkiday.com/bf573819f18069d441f5ff7b4c36ea66/national-cat-day) has a structured "Sources" section listing three citations. The first, https://www.nationalcatday.com/ (the official founder-brand site, presumably cited for the Colleen Paige founding story), is dead.

**Confirmed dead:** Both `https://www.nationalcatday.com/` and `https://www.nationalcatday.com/celebrate` return a clean HTTP 404 from a live, correctly-configured backend (Cloudflare in front of Wix, proper cache-control/x-wix-request-id headers — not a WAF block). The bare domain (no www) returns the same. Fetching the page body confirms the actual page served is Wix's own "ConnectYourDomain Error" template ("`<title>ConnectYourDomain Error | Wix.com</title>`") — the signature Wix shows when a custom domain's nameservers point at Wix but the domain was never linked to a published site. DNS resolves fine (`nationalcatday.com` → 185.230.63.x, Wix's IP range), so this isn't a DNS-death case like grandparents.com from the 8/9 run; it's a live, correctly-served "not found," which meets the "clean 404" bar on its own. The other two Checkiday sources for this page (punchbowl.com, smithsonianmag.com) were not checked in detail since only the first was the replacement target.

**Topic match:** DayAlmanac's own `national-cat-day` page (https://dayalmanac.com/national-cat-day/, confirmed HTTP 200, content checked against `src/data/guides.ts`) covers the same founding story (Colleen Paige, 2005) that nationalcatday.com would have been cited for, plus disambiguates National Cat Day from three similarly-named cat observances (International Cat Day, Black Cat Appreciation Day, National Black Cat Day) that get confused with it — directly on-topic, not a stretch.

**Message submitted (via contact form, name field "Owen (DayAlmanac)", email field contact@dayalmanac.com):**

Hi Checkiday team,

I was checking references on your National Cat Day page and noticed the first source link, nationalcatday.com, isn't resolving to a live site. Both the homepage and the /celebrate page return a Wix "ConnectYourDomain Error," which is what Wix shows when a custom domain points at their servers but was never actually connected to a published site.

If you want a replacement, we have a page on the same holiday that covers Colleen Paige's 2005 founding story and sorts it out from the three other similarly named cat observances people mix it up with: International Cat Day in August, plus the two separate Black Cat Day observances in the US and UK. https://dayalmanac.com/national-cat-day/

No obligation either way, just didn't want a dead source sitting in your list. Cataloging 5,500+ holidays is no small effort.

Best,
Owen (DayAlmanac)
contact@dayalmanac.com

**Checks done:** Passed through Skill(humanizer) and Skill(avoid-ai-writing) (no em dashes, straight quotes, no AI-vocabulary hits, closing line made specific — "cataloging 5,500+ holidays" — instead of a generic compliment; sourced from Checkiday's own About page, not invented). Dedup checked via `gmail_send.py list --query "to:checkiday.com OR from:checkiday.com OR checkiday"` (empty) and `grep -ril "checkiday" 独立站/` across the whole matrix (only self-referential mentions in DayAlmanac's own keyword file/guides.ts as a competitor name, no prior outreach record). Replacement URL fact-checked against `src/data/guides.ts`.

**Status: independent review verdict "can send" (all 5 checklist items independently re-verified: no prior contact, dead-link evidence, live replacement page + facts matched against guides.ts, tone, humanizer/avoid-ai-writing pass). Submission attempted via checkiday.com/contact.php 2026-08-16 (form fields filled: name "Owen (DayAlmanac)", email contact@dayalmanac.com, message as above) but blocked at the final step by a Cloudflare Turnstile "请验证您是真人" checkbox — per this operation's hard rule against completing CAPTCHAs/bot-detection, the form was left filled but NOT submitted. Logged to `独立站/待Owen处理事项.md` for Owen to manually complete the verification and click Submit.**

---

## 2026-08-20 — Riya's Blogs (riyabhorkar.com) — National Sons Day post — date-correction pitch

**Target:** Riya's Blogs (riyabhorkar.com), a genuinely active personal creative-writing/lifestyle blog run by Riya Bhorkar (about-me and contact pages present, full site with stories/poems/articles/book reviews, WordPress sitemap shows posts as recent as July 2026). Not a content farm or aggregator — a real individual with an established, currently-updated site.

Her post "National Sons Day 2026: Why This Celebration Matters More Than Ever?" (published 2025-08-30, riyabhorkar.com/national-sons-day-2026-why-this-celebration-matters-more-than-ever/) states that September 28 "has become the widely accepted version" of National Sons Day and that March 4 is "an older version of the celebration that circulated online around 2018-2020." This has the provenance backwards. Per DayAlmanac's own researched page (src/data/guides.ts, slug national-sons-day): March 4 is the date with a named founder (Jill Nico, 2018) and is the only date listed by National Day Calendar and Checkiday, both of which credit her by name. September 28 is the one with no traceable origin — Checkiday founder Seth Westphal researched newspaper archives in 2022 specifically looking for its source and found nothing (published on Medium, "No, September 28th is Not National Sons Day"), and Checkiday's own listing for September 28 states the date is incorrect. The likely source of the confusion, per the same research: a 1990s youth organization named "National Sons Day" existed and ran Take Our Sons to Work Day events, but those were held in May, not September, so the name predates the September date without actually supporting it.

**Recipient:** riyabhorkar7@gmail.com (personal contact email, listed on her contact page)
**Subject:** Small correction on your National Sons Day post

**Body:**

Hi Riya,

I run DayAlmanac, a small site that tracks how observance dates actually get set. I read your National Sons Day post and wanted to flag one thing, since it's the kind of detail that's easy to get backwards.

The post says September 28 has "become the widely accepted version" and that March 4 is "an older version... that circulated online around 2018-2020." It's actually the reverse. March 4 is the one with a named founder: Jill Nico created it in 2018, and National Day Calendar and Checkiday both list it and credit her by name. September 28 is the date nobody can source. Checkiday's Seth Westphal dug through newspaper archives in 2022 looking for its origin and came up empty, and Checkiday's own listing for September 28 states outright that the date is wrong.

The likely reason for the mix-up: a group called National Sons Day did exist in the 1990s, running Take Our Sons to Work Day events, but those were held in May, not September. So the name is old, the date isn't tied to it.

I put together a page walking through both dates and what each one is backed by, in case it's useful for a quick fix: https://dayalmanac.com/national-sons-day/

No pressure on the swap. Wanted to flag it while it's still early enough in the year to matter for next September.

Best,
Owen
DayAlmanac
contact@dayalmanac.com

**Checks done:** Passed through Skill(humanizer) and Skill(avoid-ai-writing) — no em dashes, straight quotes, no AI-vocabulary hits, varied sentence rhythm, no filler/hedging, closing line rewritten to avoid repeating the exact "no pressure either way, just didn't want..." phrasing already used in the 2026-08-09 icalendars.net draft. All specific claims (founder name/year, which registries list which date, the Westphal research, the 1990s org's actual May events) sourced directly from src/data/guides.ts's national-sons-day entry, none invented. Site activity verified via WordPress sitemap (post-sitemap2.xml shows lastmod dates into July 2026) and live page fetch (HTTP 200, byline "Written by: Riya Bhorkar," datePublished 2025-08-30). Dedup checked via `gmail_send.py list --query "to:riyabhorkar.com OR from:riyabhorkar.com OR riyabhorkar"` (empty) and `grep -ril "riyabhorkar" 独立站/` across the whole matrix (no prior contact).

**Status: PENDING INDEPENDENT REVIEW — drafted this run, not yet sent.** No independent review agent was spawned this run (see run log for 2026-08-20); this draft needs a fresh review pass (dedup re-check, fact re-verification against guides.ts, tone check) before sending, per this task's standing rule that only a separate step reviews and sends.
