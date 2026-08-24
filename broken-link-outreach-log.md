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

---

## 2026-08-16

### 1.5 竞品外链缺口分析（新增步骤，本轮首次执行）

用 `独立站/research-db/dataforseo_query.py` 直连查询三个竞品的外链概览+明细（替代已停用的OpenSEO MCP工具）：

| 竞品 | 外链总数 | 引荐域名数 | 抽样明细 |
|---|---|---|---|
| nationaltoday.com | 684,453 | 57,886 | 200条（one_per_domain模式） |
| daysoftheyear.com | 252,232 | 22,690 | 100条 |
| farmersalmanac.com | 182,688 | 30,966 | 100条 |

**结论：三竞品的百级抽样中未找到符合"可赢类别"标准的目标，如实放弃深挖这条路径本轮的产出。** 抽样内容的构成（按观察到的比例）：
- **自家子域名/自家资产**：nationaltoday的`scholaroo.nationaltoday.com`（教育奖学金子站，同公司资产，非真实外链）
- **规模化站群/镜像垃圾**：大量`*.pages.dev`（Cloudflare Pages部署的镜像克隆站，域名形如"firstnamewlastname.pages.dev"，明显是自动化站群）
- **内容聚合/抓取网络**：`thewebnerds.net`（全部标"[Source link]"的RSS聚合）、`quesecelebrahoy.com`（全部标"🔎 Comprobar fuente"的西语自动翻译抓取站）——这两个不是真实编辑推荐，是程序化抓取
- **行业伙伴目录链接（farmersalmanac独有的大头）**：大量美国中西部粮食合作社（如`kellergrain.com`、`bar-g.com`、`pilotgrovecoop.com`）首页链接到farmersalmanac.com首页，性质是B2B行业合作关系链接，不是可通过断链置换赢得的编辑推荐
- **零散单篇引用**：个人博客/新闻站单独引用竞品某一篇具体文章（如"National Spaghetti Day"、"Full Moon Names"），不是资源合集/roundup页面，没有"死链→替换"的操作空间
- 一条例外线索——cafely.com（咖啡品牌博客）引用USDA `apps.fas.usda.gov/psdonline/circulars/coffee.pdf` 及父路径全部返回500（疑似legacy系统已整体下线，WebSearch确认USDA已把该数据迁移到`www.fas.usda.gov/data/coffee-world-markets-and-trade`新地址），但该引用出现在咖啡产量贸易数据段落，跟DayAlmanac的"National Coffee Day是什么/何时"内容主题不对应，按硬性原则2排除，不硬凑

**方法论局限**：三站引荐域名数量级在2万-6万，百级抽样（占比0.2%-0.4%）结构性地偏向"总外链池"里最常见的链接类型（站群/聚合/伙伴目录），而"资源列表/roundup页"这种本身占比就低的类型很难被随机抽样命中。下次如果继续做1.5，可以考虑改抽样策略（如专门搜索"site:竞品域名 + roundup/resources/best of"之类反向定位法，而非依赖DataForSEO的通用外链列表）。

### 第1-5步：断链检查

延续上轮建议方向（"国家日历史/起源"类资源页），本轮通过WebSearch多角度搜索（national day history资源合集、图书馆LibGuides、生辰石历史引用页、zodiac起源引用页、checkiday.com等同类日历数据库站的"Sources"引用区块），逐一用curl核实候选页面的外链状态。

**检查过的资源页/候选：**

| 资源页 | 类型 | 结果 |
|---|---|---|
| calendar-365.com/holidays/boss's-day.html | 日历参考站 | 无外部引用链接，纯站内导航模板，非候选 |
| holidayscalendar.com/event/bosss-day/ | 日历参考站 | 无外部引用链接，非候选 |
| digitalhygge.com/national-family-and-relationship-days/ | 关系类国家日合集 | 无任何外部outbound链接（纯站内），非候选 |
| daysofobservance.com/relationship/ 及个别文章页 | 同类国家日聚合站 | 全站无外部引用链接（跟DayAlmanac同类型站，但没有可断链置换的引用结构），非候选 |
| awarenessdays.com（dog day/coffee day页） | 意识月/日历站 | 仅托管商footer链接，无内容引用，非候选 |
| grokipedia.com/page/Boss's_Day | AI百科词条 | 有多条真实外部引用（abc7chicago/学术期刊等），抽查全部200，非候选 |
| cafely.com/blogs/info/national-coffee-day | 咖啡品牌博客，国家咖啡日专题 | 见上方1.5小节，唯一死链主题不对应，排除 |
| checkiday.com/.../son-and-daughter-day | 大型holiday数据库，含"Sources"引用区块 | 2条外部引用：holidayinsights.com（200存活）、fresherslive.com（000超时，不计入） |
| checkiday.com/.../national-dog-day | 同上 | Sources含nationaldogday.com——多次curl返回000超时（TLS握手中途卡住），DNS显示指向Wix，但按规则超时不计为失效证据，无法判定，本轮放弃 |
| **checkiday.com/.../national-cat-day** | 同上 | **Sources第一条 nationalcatday.com 确认真实失效，见下** |

**发现的真实失效链接：**

1. **https://www.nationalcatday.com/**（及`/celebrate`子页）→ checkiday.com "National Cat Day" 页面 Sources 区块引用的官方发起人网站。两个路径均返回干净 HTTP 404，且响应体确认是Wix自己的错误模板（`<title>ConnectYourDomain Error | Wix.com</title>`）——即域名DNS正常指向Wix（185.230.63.x），但从未被连接到任何已发布的Wix站点，是Wix官方定义的"域名已连接但站点未配置"状态。这个信号强度介于"普通404"和"域名整体已死"之间：DNS/服务器都是活的（排除临时故障/WAF误报可能），但内容层面确认长期没有任何真实内容在提供服务，判定为真实失效，符合硬性原则1的"真实确认失效"标准。

**主题对应核实**：DayAlmanac自己的`national-cat-day`页面（https://dayalmanac.com/national-cat-day/，HTTP 200存活）覆盖同一Colleen Paige 2005年发起故事（checkiday引用nationalcatday.com大概率就是为了这段起源信息），且额外做了International Cat Day/Black Cat Appreciation Day/National Black Cat Day三个易混淆同名节日的辨析，内容对`src/data/guides.ts`逐条核实无误，主题真实对应，非硬凑。

### 处理结果

**形成一条待发送草稿，已过三步流程（humanizer+avoid-ai-writing+独立复核agent），复核verdict为"can send"。** 因checkiday.com无公开邮箱，改用其官方联系表单（checkiday.com/contact.php）提交，字段已填好（Name: "Owen (DayAlmanac)"，Email: contact@dayalmanac.com，Message见`outreach-drafts.md` 2026-08-16条目），**但提交最后一步遇到Cloudflare Turnstile人机验证复选框，按硬性规则（禁止agent完成CAPTCHA/人机验证）未点击提交，已记入`独立站/待Owen处理事项.md`等Owen手动完成最后一步。**

查重：`gmail_send.py list --query "to:checkiday.com OR from:checkiday.com OR checkiday"` 结果为空，`grep -ril "checkiday" 独立站/`仅命中DayAlmanac自己词库文件里作为竞品名称的提及，无历史外联记录。

### 排除的误报

同上两轮纪律：403/WAF、超时(000)一律不计为失效；本轮新增：500 Server Error（USDA legacy系统）证据强度不足以单独判定失效（虽有旁证是legacy系统整体下线，但未达到"干净404"或"域名整体已死"的既定标准，且即使判定失效也因主题不对应被排除，未深究）。

### 遗留待办

1. **checkiday.com的national-dog-day页面**：Sources引用的nationaldogday.com多次超时无法判定，DNS同样指向Wix IP段（跟已确认死亡的nationalcatday.com同一注册模式，怀疑同为废弃的Colleen Paige系列品牌站），下次可换网络环境/时段重试curl，如果能拿到干净404可以形成第二条断链置换机会（但checkiday.com本轮已联系，需等14天冷却期后再联系同域名）。
2. **1.5竞品缺口分析的抽样方法论局限**（见上）：下次如果继续做，建议改用定向搜索法（"site:竞品域名 roundup/resources"）代替DataForSEO随机抽样，命中率可能更高。
3. checkiday.com同款"Sources"引用区块模板还有本站其他N层文章对应的页面未逐一排查（boyfriend day/daughters day/coffee day/red-ribbon-week等），下次可以继续在该站内挖，但同样受14天冷却期限制，非紧急。

## 2026-08-21

### 第一部分：核实 2026-08-11 之前发出的旧 pitch

`outreach-drafts.md` 里 2026-08-06 的 "Keep Indiana Learning" 条目虽然日期更早，但那是另一个任务（非本断链置换任务）产出的"日期纠错"pitch，不在 `broken-link-outreach-log.md` 的记录范围内，不作为本次核实对象。本 log 里唯一 2026-08-11 之前、状态"已发送"、且从未验证过的记录是 **2026-08-09 icalendars.net**（Grandparents Day References 区块 grandparents.com 死链置换）。

- curl 复查 `icalendars.net/celebrations/grandparents-day`：HTTP 200，References 区块 ref[1] 仍是原始的 `http://www.grandparents.com/grandkids/grandparents-day/when-is-grandparents-day`，全页无任何 dayalmanac.com 提及。**判定 `not_replaced`。**
- 额外跑 `dataforseo_query.py backlinks dayalmanac.com`：返回 0 条外链（当前快照 dayalmanac.com 全站还没有任何外链数据），与上述判定一致。
- 该邮件发出时间 2026-08-09，距今 12 天，落在 SKILL 规则里"10-14天窗口（2026-08-07至2026-08-11之间发出）"内，且目标页权威度此前已确认合格。`gmail_send.py list --query "from:icalendars.net"` / `"from:contact@icalendars.net"` 均为空，确认对方从未回复。**发出一次简短跟进邮件**（1-2句 + 附原邮件全文），过 Skill(humanizer) + Skill(avoid-ai-writing) 检查（均无发现）。已发送，Message ID `1a024c637227e46a`，标记 **`followed_up_once`**。

### 第二部分：寻找新的断链置换机会

**1.5 竞品外链缺口分析**：本轮只复查了 nationaltoday.com（`backlinks --limit 60 --mode one_per_domain`），结果结构与 2026-08-16 完全一致——绝大多数是自家 `scholaroo.nationaltoday.com` 子域名、`*.pages.dev` 镜像站群、零散单篇文章引用（如 rodserling.com 链接 Twilight Zone Day 自己的官方站），没有资源合集/roundup页面可作为断链置换目标。未重复扫 daysoftheyear.com / farmersalmanac.com（08-16 已确认同样的方法论局限，短期内不会有结构性变化，本轮时间优先投入到候选资源页扫描）。

**候选资源页收集**：改用 08-16 遗留建议的定向搜索（图书馆 LibGuides、教师/图书馆"特殊日子"资源清单、社媒运营的月度观察日 roundup、生辰石/星座起源参考站），收集到 28 个候选 URL。

**批量扫描**：用 `broken_link_scan.py` 扫描（分两批各 13/9 条，共 22 个可访问页面成功抓取，6 个页面本身抓取失败——`uri.libguides.com` 两条页面均 404、`sunybroome.libguides.com` 404、governmentsocialmedia.com 8月刊 SSL错误、`gemsociety.org` 两条页面 SSL错误、`billigjewelers.com` SSL错误、`shunspirit.com` 403，均排除）。

**发现的真实失效链接（DEAD，共19条，逐条核对本站现有46篇文章主题）**：
- governmentsocialmedia.com 4月/3月观察日roundup：`afd.defense.gov/History/Army-Day`、`blog.ssa.gov`（National Social Security Month）、`ala.org/events/dear-drop-everything-and-read-day`、`iaa-usa.org/wad2024`、`nimhd.nih.gov`（National Minority Health Month）、`usar.army.mil/ArmyReserveBirthday`、`yfoundations.org.au`（Youth Homelessness Matters Day，澳洲）、`nationalcherryblossomfestival.org`
- stevelaube.com 营销博客页：2条（`http://Website`纯垃圾锚文本、`armchairwit.com`域名整体失效，均非observance相关）
- softlinkint.com 学校图书馆特殊日子清单：`globetrottinkids.com`教学资源页、`multiculturalcommission.vic.gov.au` Cultural Diversity Week（澳洲）
- ncslma.wildapricot.org 图书馆庆祝日历：`bsky.app`社交主页、`chooseprivacyeveryday.org` Choose Privacy Week、`litworld.org/worldreadaloudday` World Read Aloud Day

**处理结果：本轮全部放弃，未发出任何新邮件。** 19条DEAD逐一比对本站当前46篇文章（8篇Observances节日+若干Awareness月+Birthstones+Birth Flowers+Zodiac Dates+Anniversaries）后，**没有一条主题真实对应**——失效链接覆盖的是Army Day/Social Security Month/D.E.A.R. Day/World Autism Day/National Minority Health Month/Cherry Blossom Festival/Choose Privacy Week/World Read Aloud Day等，本站均未收录，硬凑会违反规则5，如实放弃。

### 排除的误报

同历史纪律：403(WAF)、超时、5xx、SSL握手失败一律不计为DEAD；本轮新增：资源页自身抓取失败（404/SSL错误）的6个页面直接跳过，不纳入死链统计。

### 遗留待办

1. 本轮候选池（图书馆LibGuides、社媒观察日roundup、生辰石/星座起源站）死链密度不低（19/22页有DEAD），但主题匹配率为0——DayAlmanac当前46篇覆盖的节日集合较窄，跟这类"全量观察日/特殊日子"合集页的重合度低，跟历次教训一致（本站定位偏"重点节日深度求证"而非"大而全罗列"）。下次或可换角度：直接搜索本站已发布的具体节日名（如"National Bosses Day resources""National Coffee Day sources"）而非泛主题合集，命中率可能更高。
2. 三个失败页面（uri.libguides.com holidays/refbooks 两条子页、sunybroome.libguides.com）返回404但域名本身应该还在，可能是LibGuides平台重新组织了URL结构，下次可先搜索该库的最新holidays指南入口再排查。

---

## 2026-08-24（第五次运行）

第一部分（核实10天前旧pitch）本轮已由上层会话统一处理完毕：DayAlmanac唯一的历史pitch icalendars.net已在8/21验证+跟进过，本轮无新的10天以上未验证记录，本次运行只做第二部分。

### 1.5 竞品外链缺口分析

`dataforseo_query.py backlinks nationaltoday.com --mode one_per_domain --limit 80` 复查（第三次）。结果结构与8/16、8/21两轮完全一致：自家`scholaroo.nationaltoday.com`子域名、大量`*.pages.dev`镜像站群、`?google_redirect&`垃圾参数链接、零散单篇文章引用（如`rodserling.com`链接自己的Twilight Zone官方站、`petplace.com`引用International Doodle Dog Day）——没有资源合集/roundup页面可作为断链置换目标。三轮抽样结论一致，本条方法论局限已确认稳定，不再是本站的机会来源。

### 第1-5步：候选资源页扫描

延续08-21遗留建议的"直接搜索本站已发布具体节日名"方向，本轮换了8个新角度深挖，逐一记录：

| 候选方向 | 结果 |
|---|---|
| icalendars.net 其他已发布节日页（coffee/cat/dog/taco/sons/daughters/boyfriend/pirate/smile/mens/kindness/hispanic-heritage/no-shave/movember/teachers/mental-health/guacamole/mexican-independence 共18个slug试探） | 全部404——`icalendars.net/celebrations/`目录内容有限（sitemap.xml里根本不含celebrations路径，说明该栏目非独立sitemap收录，只能从站内互链发现），已发现的节日集合与本站不重合，方向耗尽 |
| Grokipedia（AI百科）对应词条（International_Men's_Day/World_Kindness_Day/Movember 三个存在的页面，另10个不存在） | International Men's Day词条外链数十条（多为学术论文/政府数据/NGO站点），未逐条探测——AI自动生成百科没有可联系的人类编辑/勘误渠道，即使查到死链也无法执行"联系维护者"这一步，判定不可行，未继续深挖 |
| holidayinsights.com 对应节日页（grandparents/cat/dog/taco/pirate/smile/kindness 共7页，通过301跳转找到真实URL） | 用`broken_link_scan.py`扫描：仅1条初判DEAD（`nationaldogday.com`，DNS解析失败），但用curl交叉核实后确认是**扫描工具在本次沙箱环境下的假阳性**——`dig`/Python`socket.gethostbyname`在本环境对任意域名都连接超时（含已知存活域名），而curl（走环境配置的HTTP CONNECT代理）能正常解析；curl实测`nationaldogday.com`返回完整Wix站点内容（标题"National Dog Day \| Celebrating Dogs"），确认存活，非死链。该页面其余出站链接全部是无关的园艺/万圣节南瓜网站互相导流（chinaunique.com/gardenersnet.com/pumpkinnook.com），即使有死链也不会是本站可用的替换素材 |
| Framingham State University Whittemore Library "Awareness Months" LibGuides（adhd-awareness、domstic-violence-awareness-month，对应本站已发布的ADHD/Domestic Violence两篇） | 出站链接均指向CHADD/ADD.org/NIH/NCADV/TheHotline等大型常青机构网站，`broken_link_scan.py`扫描0条DEAD，仅SSL超时/403两类SOFT，符合"机构维护良好、死链密度低"的预期，非候选 |
| Kean University Cancer Awareness LibGuides（BreastCancer、Lung，对应本站已发布的Breast/Lung Cancer Awareness Month） | 出站链接以校内代理登录链接、EBSCO/ProQuest付费数据库为主，`broken_link_scan.py`扫描0条DEAD；仅有的两条政府PDF/govinfo链接即使失效也是临床治疗资源，跟本站"这个月份是怎么来的"选题不对应，非候选 |
| programminglibrarian.org "Hispanic Heritage Month Resource Round-Up"（对应本站已发布National Hispanic Heritage Month） | 见下方"发现的失效链接"——本轮唯一命中真实404，但主题不匹配 |
| RVCC/Penn Libraries 的Cancer Awareness/Breast Cancer专题LibGuides | RVCC页面出站链接全部是WorldCat书目检索（非外部引用），Penn页面正文内容为空（可能走AJAX局部加载，curl抓不到），均非候选 |
| dayspedia.com（另一同类holiday数据库，checkiday同类站） | 猜测的URL slug结构（`/us/calendar/holiday/<slug>/`）全部404，该站用数字ID而非可读slug，无法直接定位到已发布节日对应页，本轮未继续深挖 |
| 生辰石/生辰花/星座图表类"引用列表"页搜索（birthstone chart references、birth flower chart sources、zodiac dates chart citations） | 搜到的全部是珠宝/花卉电商自有内容页，没有一个是"列出外部引用来源"的资源合集结构，跟icalendars.net/checkiday.com那类"Sources"区块模板完全不同，此方向本身不成立，放弃 |

### 发现的真实失效链接（1条，主题不匹配，未采用）

**http://oral.history.ufl.edu/projects/latinao-diaspora-in-the-americas-project/**（programminglibrarian.org "Hispanic Heritage Month Resource Round-Up"页面引用）→ curl复核确认经过两次301跳转（先到自身https版本，再被站内redirection插件转到`/latinx-diaspora-in-the-americas-project/`），最终落地页返回干净HTTP 404（nginx正常响应头，非WAF拦截）。符合"真实确认失效"标准。**但主题不对应**：该链接指向UF口述历史项目关于"拉美裔离散群体口述史"的研究专题，本站对应文章"National Hispanic Heritage Month: Signed 1988, Proclaimed 1989"讲的是该纪念月的立法/总统公告历史，两者主题错位（研究项目 vs 节日本身的法律沿革），换成本站文章会显得文不对题，按硬性规则2放弃。

### 排除的误报

同历史纪律：403(WAF)、超时、5xx、SSL握手失败一律不计为DEAD。本轮新增一条方法论记录：**`broken_link_scan.py`在本次会话的沙箱网络环境下，DNS预检查（`socket.gethostbyname`）对几乎所有域名都会连接超时**（`dig @8.8.8.8`/`@1.1.1.1`同样对任意域名超时，含已知存活域名），导致脚本把"DNS解析失败"错误地标记为DEAD——本轮工具报告的另一条"DEAD"（`attend.ocls.info/event/11169641`，同样是DNS解析失败判定）经curl交叉验证后确认是301跳转到`attend.ocls.org`的正常存活页面，同一假阳性模式。**这不是这两个域名本身的问题，是本环境DNS查询路径的问题**（curl走的是环境配置的HTTP CONNECT代理能正常连接，dig/socket走的是直连DNS端口会超时）。本轮已对工具报告的每一条DEAD做curl交叉验证后才采信，未受影响；但如果未来某次运行里`socket`/`dig`环境限制被放开（换了沙箱），`broken_link_scan.py`的DNS预检查逻辑本身没有问题，是本次环境的暂时限制，不需要改动脚本。

### 处理结果

**本轮全部放弃，未发出任何新邮件。** 3个方向（icalendars.net其他页、8家图书馆/大学LibGuides、dayspedia.com、生辰石花星座图表类）系统性排查后均未找到"真实DEAD + 主题真实对应"的候选；唯一命中的真实404（UF口述历史项目页）主题不匹配，如实放弃，不硬凑。

### 遗留待办

1. Grokipedia的International Men's Day/World Kindness Day/Movember三个词条本身外链密度可能不低，但由于AI自动生成百科没有可联系的人类维护者，即使找到死链也无法执行"联系页面维护者"这一步——**这类候选源本身不适合本任务的操作模式（邮件外联），以后遇到同类AI百科/自动聚合站点可以直接跳过，不必逐条探测浪费预算**。
2. Checkiday.com的national-dog-day页面（Sources区块nationaldogday.com）14天冷却期将于2026-08-30到期（8/16首次联系），到期后如果想继续挖同域名，注意nationaldogday.com本身已确认是存活的Wix站点（08-21标注"多次超时无法判定"的结论应更新——本轮用curl通过环境代理已能正常连接并确认存活），checkiday对该页的引用不构成断链候选，无需再单独核实这一条。
3. 本轮确认的方法论教训：DayAlmanac定位"深度求证少数重点节日"与市面"大而全节日数据库/roundup"存在结构性覆盖错位——死链密度高的资源页覆盖的节日本站大多没有，本站已发布节日对应的资源页又多由大机构（政府/高校/全国性NGO）维护、死链率天然低。连续两轮（08-21、08-24）用不同角度验证了同一结论，如果下次运行还是从"找资源页"入手大概率继续无功而返，或可考虑改变策略方向（如等第4条"纪念日礼物清单"或第5条"生辰石生辰花大师参考图"等linkable asset做出来后，改用"资产型外链"打法而非纯断链置换）。
