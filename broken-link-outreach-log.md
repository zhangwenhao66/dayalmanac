# DayAlmanac 断链置换外链日志

`trafficsite-broken-link-building` 定时任务的执行记录。

---

## 2026-08-04（首次运行）

### 检查过的资源页

| 资源页 | 外链数 | 真实失效 |
|---|---|---|
| https://schoolnursing101.com/national-health-observances/ （School Nursing 101, National Health Observances） | 93 | **2** |
| https://www.sophe.org/focus-areas/national-health-observances/ （SOPHE, National Health Observances） | 67 | **1** |
| https://www.educationworld.com/holidays/ （Education World, Holidays & Special Days） | 4 | 0 |

合计核查 164 条外链。

### 发现的真实失效链接（逐条判定）

1. **https://plp.psu.edu/youthviolence/actionkit** → 真实 404（`Page not found - Prevention Learning Portal`），锚文本 "National Youth Violence Prevention Week"，宾州州立大学的**行动工具包**
2. **https://www.fda.gov/consumers/owh-resources-stakeholders/pink-ribbon-guide-mammography-matters** → 真实 404，锚文本 "Pink Ribbon Sunday Program"，FDA 女性健康办公室的**乳腺X光筛查指南**
3. **https://healthliteracymonth.org/hlm/hlm-home** → 真实 404，锚文本 "Health Literacy Month"，健康素养月的**官方活动主页**

### 处理结果

**本站本次跳过，未发出任何邮件。**

原因：三条失效链接全部是**健康宣传月/周的官方活动材料**（青少年暴力预防行动包、FDA 乳腺筛查指南、健康素养月官网），收录目的是让学校护士和公共卫生教育者拿去**组织活动**。DayAlmanac 目前已发布的 7 篇是 national-boyfriend-day、national-daughters-day、national-sons-day、national-coffee-day、national-grandparents-day、national-bosses-day、national-cat-day，全是 N 层的趣味性"国家日"，**没有任何 awareness 月/健康观察日内容**（词库里有 awareness 月这一层，但按建站计划"N 层优先、前三个月不发 W 层"的纪律尚未开工）。

拿"国家猫咪日"去顶替 FDA 的乳腺筛查指南，既不对应也不得体，属硬性原则 2 明确禁止的硬凑，如实放弃。

⚠️ 另需注意：这三条都属于**健康/医疗宣传**范畴，即使将来写了 awareness 月内容，也要先确认本站定位（节日/观察日参考站）是否适合去接 FDA 这类医疗权威的位置——健康类内容有 YMYL 属性，跟本站现有内容的风险等级不同。

### 排除的误报

`403`（34 条，两页合计，机构 WAF 与 Cloudflare 居多）、`0`、`307` 一律不计为失效，只认干净 404。

### 遗留待办

1. **健康观察日方向断链密度很高**（160 条查出 3 条真实 404），但跟本站当前内容层级错配。等 awareness 月内容真正上线后可以回头复用本轮记录（届时需重新核实）
2. 下次换方向：找**趣味国家日**方向的资源页（教师课堂活动清单、图书馆"每月主题"页），这才是 N 层内容能接住的位置。本轮搜到的 Education World 假日页只有 4 条外链，属于站内导航为主的页面，不是外链合集，参考价值有限

---

## 2026-08-09

### 方向调整

按上次遗留建议，本轮改找教师课堂活动清单、图书馆"每月主题"资源页、真正的趣味国家日外链合集，覆盖本站当前已发布的 15 篇（8 篇 Observances：boyfriend/daughters/sons/coffee/grandparents/bosses/cat/dog day + red-ribbon-week；5 篇 Birthstones；2 篇 Zodiac Dates）。

### 检查过的资源页/候选（按类型）

| 资源页 | 类型 | 结果 |
|---|---|---|
| teachersfirst.com/spectopics/redribbonweek.cfm | Red Ribbon Week 教师资源合集，13条外链 | 全部核实：3条200，2条403（CDC/dare.org，WAF），1条超时未判，1条girlshealth.gov有效301重定向（非死链）。且这些链接都是药物预防内容本身（NIDA/CDC等），不是"何时/日期规则"类，即使有死链也跟本站内容不对应，放弃 |
| eds-resources.com/edholiday.htm | 老式教师假日资源大合集，约90条外链 | 唯一匹配本站内容的锚文本"Ten Grand Activities for Grandparents Day"指向 educationworld.com，请求返回403（Cloudflare WAF challenge），按规则不计入；其余内容全是感恩节/圣诞/万圣节/马丁路德金日等大众节日，跟本站"趣味国家日/生辰石/星座"选题不对应 |
| ala.org/conferencesevents/celebrationdays | ALA图书馆日历页 | 页面存在但无匹配本站主题的外链 |
| myteachinglibrary.org/category/holidays/ | 图书馆资源博客 | 全部为站内链接，不是外链合集，放弃 |
| icalendars.net/celebrations/bosss-day | Boss's Day 页面，含References区块 | 2条引用：money.usnews.com（连接超时，无法判定为干净失效，按规则不计入）、nationaldaycalendar.com旧URL（403 WAF，不计入） |
| icalendars.net/celebrations/grandparents-day | Grandparents Day 页面，含References区块 | **ref[1] http://www.grandparents.com/... 确认真实失效**，见下 |
| PTO Today "Fun Holidays and Appreciation Days" | PTA/PTO 资源页 | 403 WAF，无法核实，放弃 |

### 发现的真实失效链接

1. **http://www.grandparents.com/grandkids/grandparents-day/when-is-grandparents-day** → 不是标准404，而是**域名整体已死**：`dig www.grandparents.com`/`dig grandparents.com` 均返回空（无A记录），权威域名服务器返回 SERVFAIL/REFUSED，HTTPS 握手失败。WebSearch 交叉核实：Grandparents.com, Inc. 已于 2017年9月26日停业，域名此后完全失效，不是临时性 WAF/网络问题。判定为比"干净404"证据强度更高的失效信号（服务器层面已不存在），符合硬性原则"只处理真实确认失效的链接"。

### 处理结果

**形成一条待发送草稿**，已追加到 `outreach-drafts.md`（标注 PENDING INDEPENDENT REVIEW，未发送）：

- 收件人：contact@icalendars.net（多域名日历参考站网络，同时运营 icalendar.co.uk/icalendario.it等姊妹站）
- 失效链接：http://www.grandparents.com/...when-is-grandparents-day（icalendars.net/celebrations/grandparents-day 页面 References 区块 ref[1]）
- 替换内容：https://dayalmanac.com/national-grandparents-day/（已确认 HTTP 200 存活，内容逐条核对 src/data/guides.ts，36 U.S.C. § 125 statute chain + 2026-2031 年度对照表）
- 附带价值：该页面正文对 Grandparents Day 日期规则的表述本身不够精确（写成"the first day after labor day"，实际是"the first Sunday...after Labor Day"，跟页面自己下方列出的日期列表——全是周日——矛盾），邮件顺带指出，不是单纯换死链
- 查重：`gmail_send.py list` 全账号查询为空 + 全矩阵 grep "icalendars" 无历史记录
- 已过 Skill(humanizer) + Skill(avoid-ai-writing) 双检查

### 排除的误报

同上次纪律：403（WAF）、超时/0（网络问题）一律不计为失效，只认干净404或（本轮新增判例）域名整体已死（DNS SERVFAIL + 无A记录 + HTTPS握手失败的组合信号，且有独立信息源佐证公司已停业）。

### 遗留待办

Red Ribbon Week 方向的教师资源合集（teachersfirst等）外链密度不低，但内容全部是药物预防教育材料本身，跟本站"日期规则参考"定位不匹配，不建议继续深挖同一批页面；下次可以换角度找"国家日历史/起源"类资源页（而非"某天该做什么活动"类），命中率可能更高（本轮 icalendars.net 系列就是这类命中的）。
