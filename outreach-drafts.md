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
