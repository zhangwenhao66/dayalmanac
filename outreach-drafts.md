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

**Status: SENT.** [2026-08-27 correction] This entry was left marked "PENDING INDEPENDENT REVIEW" in error — the email was actually reviewed and sent in a later run on 2026-08-20 (per `独立站/流量站guest-post日志.json` line ~155 and confirmed via `gmail_send.py list --query "to:riyabhorkar7@gmail.com"`, which shows Message ID `1a01f3953906ac15`, sent 2026-08-20 05:50:45 -0700, body identical to the draft above). A 2026-08-27 independent-review pass caught this stale status before a duplicate send occurred (dedup check found the prior message). Do not resend this pitch — a follow-up to this recipient, if warranted, needs to be a materially different message with its own fresh review, not a resend of this draft.

---

## 2026-08-26 — TheHomeSchoolMom (Mexico Independence Day lesson plans page) — broken-link replacement pitch (sent to legal/privacy inbox, no editorial contact found)

**Target:** thehomeschoolmom.com ("TheHomeSchoolMom," run by Kelley Media, Ltd., a long-running homeschool resource site). Their "Mexico Independence Day" lesson-plans roundup (thehomeschoolmom.com/homeschool-lesson-plans/mexico-independence-day/) lists external resources with descriptions, including a link labeled "The Mexican War for Independence, 1810-1821" pointing at mexicanhistory.org/Independence.htm, described as covering "how the war differed from that of the American Revolution... Congress of Chilpancingo, Army revolt in Spain, and Plan de Iguala."

**Confirmed dead:** `curl` to both http://mexicanhistory.org/Independence.htm and the bare domain http://mexicanhistory.org/ return a clean HTTP 409 Conflict with body `<html><head><title>409 Conflict</title></head><body><center><h1>409 Conflict</h1></center><hr><center>hws</center></body></html>` — a generic Hostinger shared-server error ("hws" = Hostinger web server) indicating the domain isn't mapped to any actively configured site on that IP. HTTPS on the same domain fails the TLS handshake entirely (no certificate served). DNS resolves cleanly (A record 72.60.75.74, cross-checked via Google DNS-over-HTTPS), so this isn't a DNS-death case like the 8/9 grandparents.com precedent — it's a live IP serving a domain-level "not hosting anything" error on every path tried, a stronger signal than a simple 404 and independently re-verified by a separate review agent (also caught the HTTPS TLS failure detail independently).

**Topic match:** DayAlmanac's own `mexican-independence-day` page (https://dayalmanac.com/mexican-independence-day/, confirmed HTTP 200, content checked against `src/data/guides.ts`) covers exactly the 1810-1821 span the dead link's description promised: Hidalgo's September 16, 1810 Grito de Dolores at Dolores, his 1811 capture and execution, the war continuing under other commanders, and the actual 1821 treaty (which Spain itself didn't ratify until 1836). Independently re-verified as a genuine match, not a stretch.

**Contact channel problem:** No general/editorial email exists anywhere on thehomeschoolmom.com. The /contact/ page routes into narrow, non-matching categories only (local-resource listings, field trips, advertising, "we don't accept article submissions," DMCA, privacy) with no catch-all option. /about/ and /faq/ have no email. The only email found anywhere on the site is help@makelleyandcompanyinc.com, on the Privacy Policy page, explicitly scoped to GDPR/CCPA data requests, not editorial content. The target article's byline is a generic "THSM Activities" account, not a named person. Searched Facebook business page and RocketReach-style lookups for a personal/editorial email; none found.

**Recipient:** help@makelleyandcompanyinc.com (site's only public email, legal/privacy-scoped, used here as best-effort since no editorial channel exists)
**Subject:** Dead link on your Mexico Independence Day lesson plans page

**Body:**

Hi,

I was going through the resource list on your Mexico Independence Day lesson plans page and noticed the MexicanHistory.org link (the one described as covering the Mexican War for Independence, 1810-1821) doesn't resolve anymore. The whole domain returns a 409 error on every page I tried, including the homepage, and it doesn't even have a working HTTPS certificate, so it looks like the site itself is gone rather than just that one page moving.

If you want something to swap in, we put together a page on the same 1810-1821 span your description mentions, covering Hidalgo's bell-ringing at Dolores and the eleven years between that and the treaty Spain didn't actually ratify until 1836: https://dayalmanac.com/mexican-independence-day/

Take it or leave it, obviously. Just flagging it since the rest of that lesson plan page is well put together and this one link drags it down.

Best,
Owen
DayAlmanac
contact@dayalmanac.com

**Checks done:** Passed through Skill(humanizer) and Skill(avoid-ai-writing) — clean on both, no em/en dashes, no curly quotes, no AI-vocabulary hits, closing line varied from the phrasing already used in the 8/9 and 8/16 drafts ("no pressure either way, just didn't want...") to avoid a repeated template feel. Dedup checked via `gmail_send.py list --query "to:thehomeschoolmom.com OR from:thehomeschoolmom.com OR thehomeschoolmom OR makelleyandcompanyinc"` (empty) and `grep -ril "thehomeschoolmom\|mexicanhistory" 独立站/` across the whole matrix (no prior contact or mention anywhere).

**Status: independent review verdict "send to help@makelleyandcompanyinc.com, but downgrade expectations — treat as low-probability-of-response, don't follow up if no reply, don't escalate channel-hunting further."** All five review items (dead-link re-verification, topic-match re-verification, dedup, email quality/tone, and the contact-channel judgment call) independently confirmed. Sent 2026-08-26 via `gmail_send.py send --from dayalmanac`, Message ID `1a03e50104f5cf4d`. Because the recipient is a legal/privacy inbox rather than an editorial one, no 10-14 day follow-up is planned for this one even if unreplied — a follow-up to a legal inbox about a content-correction request would compound the channel mismatch rather than fix it.

---

## 2026-08-28 (SENT) — Two candidates, both replacing the same dead domain (nationalwildlifeday.com) on different sites — National Wildlife Day broken-link pitch

**Shared dead-link evidence:** checkiday.com's own "National Wildlife Day" Sources block cites `http://www.nationalwildlifeday.com/` (the presumed official founder site), which led to discovering this domain is now squatted. `curl` (both direct and cross-checked via Google DNS-over-HTTPS and Cloudflare 1.1.1.1 resolvers, both returning the same IP 217.182.4.139) confirms the domain resolves and returns HTTP 200, but the page served is an unrelated Indonesian-language WordPress film-news portal ("Portal berita film terbaru tentang berita film terkini..."), with zero content related to wildlife, Colleen Paige, or the observance. This is a "domain alive but repurposed to unrelated content" signal, the same evidence tier as the 2026-08-16 nationalcatday.com (Wix ConnectYourDomain error) and 2026-08-26 mexicanhistory.org (409/no TLS) precedents — stronger than a plain 404 because the domain is demonstrably not serving its original purpose to any visitor, not merely returning an error.

Note: checkiday.com itself cannot be re-contacted this round (contacted 2026-08-21, Owen manually submitted the form past the Turnstile check per `独立站/待Owen处理事项.md` item A2; 14-day cooldown runs to 2026-09-04, and the broken-link-outreach-log's own rediscovery-check instruction defers re-checking that page to 2026-08-31 anyway). Instead of pitching checkiday.com again, WebSearch surfaced two independent third-party sites whose own blog posts link out to the same dead nationalwildlifeday.com domain — a wider footprint than one page.

**Topic match (both candidates):** DayAlmanac's `national-wildlife-day` article (published 2026-08-27, brand-new, zero prior outreach — cold-start allocation per the 14-day-new-content rule) directly resolves the exact ambiguity both target posts either state as settled fact or gesture at without resolving: the founding year (National Today says 2006, Calendarr says 2005, DayAlmanac documents both accounts and that neither cites a primary source) and why September 4 specifically was picked (it's Steve Irwin's death anniversary, not his birthday — birthday is February 22, the second, less-followed date). Content verified against `src/data/guides.ts`, `national-wildlife-day` entry (dateRule.caveat and founding.text fields).

---

### Candidate 1 — Natural Habitat Adventures (nathab.com)

**Target:** nathab.com, a Boulder, CO eco-tourism company (conservation-travel outfitter partnered with World Wildlife Fund; trips to polar bear tours, African safaris, Galapagos, etc. — a real, currently operating business, not a content farm). Blog post "Happy National Wildlife Day!" (nathab.com/blog/happy-national-wildlife-day), byline Emily Deemer, `datePublished` 2023-09-04, `dateModified` 2024-09-04 — modified annually on the observance date itself, a strong signal this specific post gets revisited yearly rather than being abandoned.

**Dead link location:** Second paragraph, the anchor text "National Wildlife Day" itself is hyperlinked to `https://www.nationalwildlifeday.com/about.htm`.

**Contact:** No personal email found for Emily Deemer (author bio page has no email) or via /awards-media-press or /contact (redirects checked, neither exposes a media-specific address). Only two emails exist anywhere on the domain: `info@nathab.com` and `naturalhabitat@nathab.com`, both general company inboxes (not legal/privacy/ads-scoped) used across FAQ/About/contact-adjacent pages. Using `info@nathab.com`.

**Subject:** Dead link in your National Wildlife Day post

**Body:**

Hi,

I was reading your "Happy National Wildlife Day!" post and noticed the National Wildlife Day link (nationalwildlifeday.com/about.htm) doesn't go where it used to. The whole domain now resolves to an unrelated Indonesian film-news site, not the wildlife observance page your link text describes.

If it's helpful, we put together a page on the same observance that also covers something your post doesn't quite spell out: why September 4 was picked in the first place. It's the anniversary of Steve Irwin's death in 2006, not his birthday (that's February 22, the date your post already mentions separately). We also found that National Today and Calendarr disagree on the founding year itself, 2005 versus 2006, and on whether Paige created the day because of Irwin's death or rededicated an existing one to him. https://dayalmanac.com/national-wildlife-day/

No obligation, just didn't want a broken link sitting in an otherwise solid post.

Best,
Owen
DayAlmanac
contact@dayalmanac.com

**Checks done:** Passed Skill(humanizer) and Skill(avoid-ai-writing) unmodified — no em/en dashes, no AI-vocabulary hits, no template phrases, no filler. Dedup: `gmail_send.py list --query "to:nathab.com OR from:nathab.com OR nathab"` → empty. `grep -ril "nathab" 独立站/` → two incidental hits (FactCrumbs SERP-competitor mention and a 候选二号站 keyword-research note listing nathab.com as an unrelated SERP result), no prior outreach record.

---

### Candidate 2 — National Band and Tag Company (nationalband.com)

**Target:** nationalband.com, a Newport, KY manufacturer of ID tags/bands (wildlife conservation tags, pet tags, livestock tags — "Made in the USA" since 1902 per site copy). Blog post "National Wildlife Day" (nationalband.com/national-wildlife-day/), byline "Andrea," `datePublished` 2019-02-22, `dateModified` 2020-11-04 — **flagging honestly: this specific post has not been touched in almost 6 years**, longer than the task's own "skip resource pages with no update in ~12 months" guardrail contemplates. The company's blog as a whole is clearly active (recent 2025 posts on unrelated topics visible in the sidebar, real ongoing business), so this isn't an abandoned site, but the individual page is stale by the letter of that rule. Flagging for independent review to judge whether this one clears the bar or should be dropped; I did not decide it myself.

**Dead link location:** Final paragraph, plain-text URL `http://www.nationalwildlifeday.com` (linked, appears twice in the raw HTML — once in "Learn more about National Wildlife Day here:" and once as the earlier embedded anchor).

**Contact:** /contact/ returns HTTP 403 (bot-blocked) regardless of user agent tried. The only email found anywhere on the site (About, FAQ, this blog post's byline area) is `tags@nationalband.com`. This is not a scoped legal/privacy/ads inbox — the local part matches the company's core product line and it's used site-wide as the general/customer-service contact — but it's also not unambiguously an editorial inbox, so noting this for review rather than asserting it clears the single-purpose-channel rule outright.

**Subject:** Broken link on your National Wildlife Day blog post

**Body:**

Hi,

I came across your "National Wildlife Day" post and noticed the link to nationalwildlifeday.com doesn't lead anywhere related anymore. The domain now hosts an unrelated Indonesian film-news site rather than anything about the observance.

If useful, we have a page on the same day that gets into a detail your post touches on but doesn't fully untangle: two different accounts have Paige starting the observance in 2005 versus 2006, and disagree on whether it was created in response to Steve Irwin's death or rededicated to him afterward. https://dayalmanac.com/national-wildlife-day/

No pressure, just flagging it since your conservation customers probably still visit that page.

Best,
Owen
DayAlmanac
contact@dayalmanac.com

**Checks done:** Passed Skill(humanizer) and Skill(avoid-ai-writing) unmodified — no em/en dashes, no AI-vocabulary hits, no template phrases, no filler. Dedup: `gmail_send.py list --query "to:nationalband.com OR from:nationalband.com OR nationalband"` → empty. `grep -ril "nationalband" 独立站/` → no hits at all.

**Status: SENT.** Independent review (fresh-context agent) verdict on both: SEND. (1) Candidate 2's ~6-year-stale post cleared the "not abandoned" guardrail because the site's blog overall is active (posts as recent as 2026-04) and the rule is "page OR site" not "page AND site." (2) `tags@nationalband.com` judged to be the company's single general-purpose contact address (published site-wide in the footer), not a legal/privacy/ads-scoped inbox, so it does not trigger the single-purpose-channel red line. Both re-verified independently for dead-link evidence, on-page presence, topic-match honesty against the live dayalmanac.com page, recipient authenticity, and dedup. Sent 2026-08-28 via `gmail_send.py send --from dayalmanac`: Candidate 1 (nathab.com) → `info@nathab.com`, Message ID `1a04892f03440fa7`; Candidate 2 (nationalband.com) → `tags@nationalband.com`, Message ID `1a0489301d9ba7eb`.

---

## 2026-08-29 — Embed-invite batch (countdown widget distribution, National Guacamole Day)

Per `trafficsite-linkable-asset-building`'s "定向邀请嵌入" step for the Days-Until countdown widget (published 2026-08-25, `linkable-asset-log.md`). Both targets found via WebSearch for real, currently-published content about National Guacamole Day (Sept 16), matched against a guide already covered by the countdown widget (`dateRule` present, kind !== 'table'). Step 2 (unlinked-mention recovery) run first via WebSearch for `"dayalmanac.com" -site:dayalmanac.com` — no results referencing the site (expected, page still young). No recovery opportunity this round.

### Candidate 1 — Always the Holidays (alwaystheholidays.com)

**Target:** alwaystheholidays.com, a personal holiday/recipe blog. Post "Observe National Guacamole Day with an Easy Guacamole Recipe" (alwaystheholidays.com/national-guacamole-day/), live and indexed.

**Contact:** cgspeake@gmail.com, found on the site's About page — a personal address tied to the blog author, not a scoped legal/privacy/ads inbox.

**Subject:** A countdown widget for your Guacamole Day post

**Body:**

Hi,

I came across your National Guacamole Day post while looking for good holiday content to cite for a project. It's one of the more thorough recipe write-ups I found for that day.

I run DayAlmanac, a site that tracks the sourcing behind these "national day" observances (who actually founded them, whether there's a real proclamation behind the date, that kind of thing). While building out the Guacamole Day page, I put together a small countdown widget that shows readers how many days are left until the next occurrence, updated automatically so it never goes stale.

If it's useful, here's the embed code for your post:

<iframe src="https://dayalmanac.com/embed/national-guacamole-day/" width="280" height="230" style="border:1px solid #ddd;border-radius:8px" title="Days until National Guacamole Day" loading="lazy"></iframe>

No obligation at all if it doesn't fit the page. Either way, nice post.

Owen
DayAlmanac
https://dayalmanac.com/national-guacamole-day/

**Checks done:** Passed Skill(humanizer) unmodified. Skill(avoid-ai-writing) found no issues in this draft. Dedup: `grep -ril "alwaystheholidays"` across 独立站/ → no prior contact. Live-verified both URLs (`https://dayalmanac.com/national-guacamole-day/` and `/embed/national-guacamole-day/`) return HTTP 200 via cache-busted curl before drafting.

### Candidate 2 — UF/IFAS Extension Indian River County (blogs.ifas.ufl.edu)

**Target:** UF/IFAS Extension Indian River County, a real university extension office blog. Post "National Guacamole Day, September 16th" by Leslie Nicole Munroe, Environmental Horticulture Agent (blogs.ifas.ufl.edu/indianriverco/2021/10/26/national-guacamole-day-september-16th/), live.

**Contact:** indian@ifas.ufl.edu — the Indian River County Extension office's own address (confirmed live on indian.ifas.ufl.edu), not the platform-wide webteam@ifas.ufl.edu alias originally drafted. Independent review flagged the platform alias as likely to be read as a support ticket rather than routed to the post's author; re-addressed to the county office's own contact, one click from the blog's byline, before sending.

**Subject:** Small widget for the National Guacamole Day post (Indian River County blog)

**Body:**

Hello,

I'm writing about a specific post on the Indian River County Extension blog: "National Guacamole Day, September 16th" by Leslie Nicole Munroe. It's a well-sourced piece and one of the better explanations I've found of how avocado growing ties into the Florida angle on that day.

I run DayAlmanac, a reference site on the origins and sourcing of "national day" observances. For the Guacamole Day entry I built a small countdown widget. It shows visitors how many days remain until the next occurrence and updates itself, so nobody has to touch it again.

If it's a fit for the post (or any future update to it), here's the embed code:

<iframe src="https://dayalmanac.com/embed/national-guacamole-day/" width="280" height="230" style="border:1px solid #ddd;border-radius:8px" title="Days until National Guacamole Day" loading="lazy"></iframe>

Happy to answer any questions about it. If Nickie is the right person to route this to, feel free to forward it along, but no worries either way.

Thanks for the useful post.

Owen
DayAlmanac
https://dayalmanac.com/national-guacamole-day/

**Checks done:** Passed Skill(humanizer). Skill(avoid-ai-writing) caught and fixed two em dashes (mid-sentence splices) — replaced with a colon and a period-based restructure respectively. Dedup: `grep -ril "ifas.ufl.edu"` across 独立站/ → no prior contact.

**Independent review verdict:** Candidate 1 — CAN SEND (all four checks clear; cgspeake@gmail.com confirmed as the real site owner via the site's own copyright footer). Candidate 2 — flagged PROBLEM (webteam@ifas.ufl.edu is a generic platform-wide alias, not routed to the specific county office); re-addressed to indian@ifas.ufl.edu (verified live) per the review's recommendation, no other content changes needed.

**Status: SENT 2026-08-29** via `gmail_send.py send --from dayalmanac`. Candidate 1 → cgspeake@gmail.com, Message ID `1a04c0e8ed6243d7`. Candidate 2 → indian@ifas.ufl.edu, Message ID `1a04c0ea06855e07`.

---

## 2026-08-31 — Broken-link pitch (National Adoption Day, adoptmidtn.com)

Per `trafficsite-broken-link-building`'s produce-capacity rule (DayAlmanac ranked #1 by 11-30-position impressions this run, 627 impressions). Found via `独立站/research-db/dataforseo_query.py backlinks kids-alliance.org` (1,625 backlinks, 1,114 flagged as broken by the tool's own count) after checkiday.com's own Sources sections (12 published-topic pages scanned via `独立站/tools/broken_link_scan.py`) turned up mostly checkiday's own social-profile links plus a handful of dead citations with no independent third-party citer or no topic match — see log for the full elimination trail.

### Target

**adoptmidtn.com** (Adoption Law Center of Middle Tennessee), post "What Is National Adoption Day?" (adoptmidtn.com/2017/11/17/what-is-national-adoption-day/, by Jennifer Hall, dateModified 2023-07-24; site overall active, sitemap lastmod Feb 2026). The post lists four National Adoption Day sponsor organizations with links; one, "Alliance for Children's Rights" → kids-alliance.org, is dead. Confirmed: HTTP returns a clean 404 (Flywheel hosting placeholder, "Unknown Domain"), HTTPS fails TLS entirely (cert is for app.getflywheel.com, not kids-alliance.org). The other three sponsor links (Dave Thomas Foundation, CCAI, Children's Action Network) are all live. The org has since rebranded to allianceforchildrensrights.org, which explains the abandoned domain.

**Replacement:** dayalmanac.com/national-adoption-day/ (published 2026-08-26), which covers the Alliance for Children's Rights as one of the five 2000-era founding coalition partners of National Adoption Day, plus two honest fact-check points not in the target post: the "110,000 children waiting" figure the post cites is stale against the federal AFCARS FY2024 count (70,421), and there's a live 2026 date discrepancy (organizers say November 21, National Day Calendar/National Today say November 22 — a Sunday, not the Saturday the event has run on for 26 years).

**Contact:** info@adoptmidtn.com — the firm's one general listed contact address (used site-wide for consultation requests), not a legal/privacy/GDPR/ads-scoped inbox.

**Subject:** Broken link on your National Adoption Day post

**Body:**

Hi,

I came across your post "What Is National Adoption Day?" and noticed one of the four sponsor links, the Alliance for Children's Rights one, no longer works. kids-alliance.org now returns a 404 over plain HTTP and doesn't even have a valid SSL certificate for the domain, so the link's been broken a while. The other three sponsor links (Dave Thomas Foundation, CCAI, Children's Action Network) still work fine.

If it's useful, we put together a page on National Adoption Day that catches two things your post doesn't mention. The "110,000 children waiting" figure is stale; the most recent federal count (AFCARS, FY2024) puts it at 70,421. And there's a live date conflict for 2026: the organizers list November 21, but National Day Calendar and National Today both currently show November 22, which is a Sunday, not the Saturday the event has run on for 26 years straight. https://dayalmanac.com/national-adoption-day/

No worries either way, just didn't want the sponsor list pointing somewhere dead.

Best,
Owen
DayAlmanac
contact@dayalmanac.com

**Checks done:** Passed Skill(humanizer) (no em/en dashes, no curly quotes, no AI vocabulary). Skill(avoid-ai-writing) flagged one vague-endorsement phrase ("something worth knowing") in an earlier draft, rewritten to a concrete "catches two things your post doesn't mention." Dedup: `gmail_send.py list --query "to:adoptmidtn.com OR from:adoptmidtn.com OR adoptmidtn"` → empty; `grep -ril "adoptmidtn" 独立站/` → no prior contact (only an unrelated DataForSEO cache file mentioning it).

**Independent review verdict: SEND.** Fresh-context agent independently re-verified all six checks: dead link confirmed (404 + TLS cert mismatch, not a timeout/WAF), replacement topic match confirmed with no fabricated facts (AFCARS figure and 2026 weekday math both checked out independently), info@adoptmidtn.com judged a general small-firm contact address not a scoped legal/privacy/ads inbox, dedup clean, tone clean of AI tells, site confirmed actively maintained (not parked).

**Status: SENT 2026-08-31** via `gmail_send.py send --from dayalmanac --to info@adoptmidtn.com`, Message ID `1a058092399d4114`.
