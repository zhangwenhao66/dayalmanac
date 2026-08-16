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
