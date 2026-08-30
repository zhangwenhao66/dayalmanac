# DayAlmanac — SERP-ranked outreach log

This file is specific to the `serp-ranked-outreach` task (SERP-verified target selection: search the target keyword, see who Google actually ranks, filter by real content-quality gates). Kept separate from `broken-link-outreach-log.md` and `outreach-drafts.md` (guest-post-outreach) by design, so the three targeting logics' conversion rates can be compared independently.

Fields per entry: date, target keyword, target type, target URL, contact method, AI review result, send status, 10-day verification result.

---

## 2026-08-29 — TeamBonding (teambonding.com)

| 字段 | 内容 |
|---|---|
| 日期 | 2026-08-29 |
| 目标关键词 | `national boss's day 2026`（DayAlmanac 自身 GSC 位置 9.3-10.3，`national-bosses-day` 页） |
| 目标类型 | 内容文章 |
| 目标 URL | https://www.teambonding.com/boss-day/ |
| 目标性质 | TeamBonding，波士顿真实企业团建活动公司，作者署名创始人 David Goldstein |
| SERP 分类结果 | 前 9 条 organic：大品牌 2 家（timeanddate/hallmark）→跳过；同类竞品日历站 1 家（nationaldaycalendar）→跳过；Wikipedia→非外链目标；HR 软件博客 1 家（hrcloud，内容偏弱）→未选；小型独立日历站 1 家（icalendars.net，具体 URL 404）→未追查；Pinterest→社交跳过；**仅 teambonding.com 同时满足新鲜度门槛(2026-05-29更新)与真实可验证的内容缺口** |
| 具体缺口 | 目标文章将"周末顺延到最近工作日"规则当作既定事实陈述，且未点名 1962 年伊利诺伊州长 Otto Kerner；DayAlmanac 自身页面（`national-bosses-day`）记录该规则在网上找不到 1958 年注册文件或 1962 年州长公告的原始记录可查证，Wikipedia 对应表述也带 citation-needed 标记 |
| 事实核实 | 独立复核 agent 重新 curl 目标页原文，确认标题/正文确实无来源地陈述该周末顺延规则、且确实未点名州长姓名；同时逐条核对本站 guides.ts 的 national-bosses-day 词条，确认邮件里的每条具体事实（Haroski/1958/US Chamber of Commerce、Kerner/1962、Wikipedia citation-needed 标记、Hallmark 官网未加注）均有据可查、无编造 |
| 联系方式 | 邮件 hello@teambonding.com（/contact-us/、/about-us/ 均公开列出的通用联系邮箱） |
| AI 复核 | ✅ 可以发送（六项检查——查重、事实准确性、目标页现场再验证、新鲜度门槛、语气去AI味、诉求是否得体——全部通过） |
| 发送状态 | ✅ 已发送 2026-08-29（Gmail msg `1a04db663b7e7ac1`；已回读投递 From 头确认为 `DayAlmanac <contact@dayalmanac.com>`） |
| 10天后验证 | ⏳ 待 2026-09-08 之后回查（目标页面是否加上真 `<a href>` 链接 + `dataforseo_query.py backlinks dayalmanac.com` 确认 dofollow） |

### 本次运行累计记账（外链记账纪律，2026-08-25起硬性）

| 指标 | 数值 |
|---|---|
| 累计已发送 | 1 |
| 累计已验证到手（dofollow） | 0（本轮首次发送，未到10天验证窗口） |
| 转化率 | 待验证（首次运行，n=1，10天后才有第一个数据点） |
