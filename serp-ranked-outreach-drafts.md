# DayAlmanac — SERP-ranked outreach drafts

This file is specific to the `serp-ranked-outreach` task (SERP-verified target selection). Do not merge with `outreach-drafts.md` (guest-post-outreach) or `broken-link-outreach-log.md` — keeping these separate is the point, per the task's design (horizontal comparison of conversion rates across the three targeting logics).

---

## 2026-08-29 — TeamBonding (teambonding.com) — Boss's Day 2026 piece — unsourced-claim pitch

**Target:** teambonding.com, a real corporate team-building/events company (Boston-based, "TeamBonding," byline David Goldstein identified as founder). Blog post "Boss's Day 2026: Ideas to Celebrate Your Boss" (teambonding.com/boss-day/), `datePublished`/`dateModified` 2026-05-29 — 3 months old, passes freshness gate.

**Target keyword:** `national boss's day 2026` (DayAlmanac's own `national-bosses-day` page ranks pos 9.3-10.3 for boss-day queries per GSC, 28-day window, real GSC self-position data — not top-tier, genuine content-improvement candidate).

**SERP classification (12 organic results):** timeanddate.com/hallmark.com (major brands, skipped), nationaldaycalendar.com (direct competitor calendar site, skipped), en.wikipedia.org (not an outreach target), hrcloud.com (HR software blog, thin "messages" listicle, weaker topical match than teambonding), icalendars.net (checked — 404 on the specific slug pattern I tried, not pursued further this round), pinterest.com (social, skipped). **teambonding.com was the only candidate meeting both the freshness gate and having a genuine, checkable content gap.**

**The gap:** DayAlmanac's own `national-bosses-day` page (src/data/guides.ts) documents that the widely repeated "shifts to the closest workday when Oct 16 falls on a weekend" rule has no traceable primary source — neither Patricia Bays Haroski's 1958 U.S. Chamber of Commerce registration nor Illinois Governor Otto Kerner's 1962 proclamation is available online to confirm the clause was part of the original design, and Wikipedia's own account carries a citation-needed tag on the same sentence. TeamBonding's article states the weekend-shift rule as settled fact ("The date is fixed; when it lands on a weekend, the celebration shifts to the closest workday") with no such caveat, and names "the governor of Illinois" without naming Otto Kerner specifically — a level of detail DayAlmanac's page does carry, with its own sourcing caveats attached. Verified by fetching the live page directly (curl, HTTP 200) and reading the actual body text, not by trusting the SERP snippet.

**Prior-contact check:** `dayalmanac/guest-post-outreach.json` shows a 2026-08-20 sweep that checked teambonding.com (among others) for a *different* angle — whether the 2026 date itself needed a weekend-shift adjustment (it doesn't; Oct 16, 2026 is a Friday) — and correctly found no error on that narrow question, so it was not pursued. That is not the same claim as this pitch, which is about the underlying rule being unsourced regardless of whether 2026 happens to trigger it. `gmail_send.py list --query "to:teambonding.com"` and `"to:hello@teambonding.com"` both returned empty — no prior email sent.

**Recipient:** hello@teambonding.com (site's general contact address, confirmed present on both /contact-us/ and /about-us/)
**Subject:** A sourcing gap on your Boss's Day piece

**Body:**

Hi there,

I run DayAlmanac, a small site that tracks how observance dates actually got set. Your Boss's Day 2026 piece says the celebration "shifts to the closest workday" when October 16 lands on a weekend, stated as a plain fact. I went looking for where that rule comes from and couldn't find it.

The two events everyone points to as the founding record are Patricia Bays Haroski's 1958 registration with the U.S. Chamber of Commerce and Illinois Governor Otto Kerner's 1962 proclamation backing it. Neither is available online to check, so there's no way to confirm the weekend-shift clause was part of the original design rather than something calendar sites added later as a practical convenience. Wikipedia's own account of the founding carries a citation-needed tag on the same sentence.

None of this means the rule is wrong. It just means it's currently unsourced everywhere it gets repeated, including on Hallmark's own corporate site. I put together a page that lays out what is and isn't documented, including the governor's name, in case it helps: https://dayalmanac.com/national-bosses-day/

Not asking for anything specific here, just flagging it since it's an easy thing to miss.

Best,
Owen
DayAlmanac
contact@dayalmanac.com

**Checks done:** Passed through Skill(humanizer) and Skill(avoid-ai-writing) — no em dashes, straight quotes, no flagged AI-vocabulary words, no vague endorsements, varied sentence rhythm. All specific claims (Haroski/1958/Chamber of Commerce, Kerner/1962/Illinois governor, the Wikipedia citation-needed tag, the Hallmark corporate-site wording) sourced directly from `src/data/guides.ts`'s `national-bosses-day` entry and independently re-verified against the live teambonding.com page fetch, none invented. Dedup checked via `gmail_send.py list --query "to:teambonding.com"` / `"to:hello@teambonding.com"` (both empty) and `grep -ril "teambonding" 独立站/` across the whole matrix (only prior mention is the 2026-08-20 non-overlapping sweep described above).

**Status: SENT.** Independent review agent verdict: "可以发送" (all six checklist items — dedup, factual accuracy against guides.ts, live-page re-verification of the target's claim, freshness gate, tone/humanization, and the ask being non-pushy — confirmed clean). Sent 2026-08-29 via `gmail_send.py send --from dayalmanac`, Message ID `1a04db663b7e7ac1`. Delivery confirmed via `gmail_send.py list` — From header arrived as `DayAlmanac <contact@dayalmanac.com>` as expected.
