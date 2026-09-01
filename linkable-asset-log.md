# DayAlmanac — Linkable Asset Log

由定时任务 `trafficsite-linkable-asset-building` 维护。每次运行做了什么、outreach 结果如何，追加在下面。

---

## 2026-08-25

**第0步（选站）**：这是本站第一次被 `trafficsite-linkable-asset-building` 处理——`dayalmanac`/`dialwick`/`lingogrove`/`wagelark` 四个工具型流量站此前从未产出过 `linkable-asset-log.md`，属于"从未处理"的队尾站点（详见全局 CLAUDE.md「一个定时任务服务多个对象时须定处理顺序」），本次优先处理其中之一。

**第1步（制作与发布）**：制作 `linkable-asset-backlog.md` 第2条——"Days Until [观察日]"可嵌入倒计时小组件。

- `src/lib/countdown.ts`：三个纯函数 `nextCountdown`（找下一个≥今天的日期并算相差天数，全部过期时降级返回最后一条+负数天数而不是空）、`formatCountdownLabel`（今天/1 day/N days/"Date data needs an update"四态）、`todayISO`（本地日历日期转ISO字符串）。`src/lib/countdown.test.ts` 7个用例全过（今天早于/等于/晚于列表、空列表、全部过期降级、单复数措辞边界）。
- `src/components/CountdownWidget.astro`：跟 `DayQuiz.astro` 同一套"纯函数+瘦DOM脚本"分层——occurrences 在构建时序列化进 `data-occurrences` 属性，客户端脚本读取后跑 `nextCountdown`/`formatCountdownLabel` 更新显示，`embed` 参数控制是否显示底部"Countdown by DayAlmanac"回链行。
- `src/pages/embed/[slug].astro`：独立、无站点chrome的嵌入版页面，`getStaticPaths` 只覆盖 `dateRule` 存在且 `kind !== 'table'` 的观察日（全站55篇文章里30篇有dateRule，0篇是table类，因此30篇全部合格，无一被排除）；canonical指回正文页，`<meta name="robots" content="noindex, follow">`；回链行硬编码在组件里、不接受iframe参数关闭，是CalcBadger `src/pages/embed/[slug].astro` 已验证过的同一套机制。
- `astro.config.mjs`：`sitemapConfig({ excludePaths: ['/embed/'] })`，避免embed路由跟正文页重复收录（照抄CalcBadger的现有配置项）。
- `src/pages/[slug].astro`：合格文章的正文页在"When it falls"日期表下方新增一个实时倒计时卡片，Sources区块下新增"Embed this countdown"区块（复制iframe代码按钮，逻辑照抄CalcBadger同款"Copy embed code"脚本）。

**验证**：`npm run build` 成功生成98个页面（含30个新增 `/embed/<slug>/` 路由），抽查 `dist/embed/national-coffee-day/index.html` 确认：occurrences JSON 正确序列化（`2026-09-29`起6年数据）、编译后的脚本逻辑跟源码一致、sitemap不含任何 `/embed/` URL。`npm test` 40个用例全过（33个既有+7个新增）。

⚠️ **浏览器实机验证未能执行**：本次运行是无人值守场景，`preview_start` 对未挂起的服务器主动拒绝（"Dev servers can't be started from unattended sessions"），无法像交互式会话那样真的打开 `/embed/national-coffee-day/` 点开看倒计时数字对不对。改用等效核实：①直接读取构建产物里编译后的JS（确认跟未编译源码逻辑完全一致，无tree-shaking或minify引入的行为改变）；②按今天日期（2026-08-25）手算 National Coffee Day（2026-09-29）应显示"35 days"，跟单元测试覆盖的同类边界用例（今天早于/等于/晚于目标日）交叉验证算法本身正确；③7个单元测试直接覆盖这个组件依赖的全部日期数学，包括这次没有手算到的"全部过期"和"空列表"两种边界。三项加起来能覆盖"JS逻辑写反"这类risk，但确实不是真人在浏览器里点开看一眼——下次如果是交互式会话（有真人在场）处理本站后续资产，应该补一次真实浏览器打开验证，不算这次已经做过。

**上线**：commit + push 后由 Cloudflare Pages git 自动部署接管（本站在 `独立站/cf_deploy_hooks.md` 记录里属于"没有登记deploy hook、靠git自动部署"的流量站矩阵范围，不主动POST hook）。

---

### 第2步（未加链接提及回收）

未执行——本次时间预算全部投入第1步资产制作+验证，且这是首次运行，站内此前没有任何已发布的linkable asset可供第三方"提及但未加链接"，第2步天然无对象可查（跟WarCrumbs/FactCrumbs首次运行时的记录同理）。

### 第3步（新资产主动pitch）

未执行——同上，本次时间预算优先保证第1步的建造期硬性规格（embed机制+验证）做到位，未留出时间做外部pitch调研。

### 第3.5步（发现平台投放）

未执行，原因同上。

### 遗留

`linkable-asset-backlog.md` 剩余4条待制作点子（National Day官方依据核验指数、National Day官方依据速查工具——依赖第1条数据集、纪念日礼物清单权威对照表、生辰石与生辰花大师参考图）留给下次任务运行处理。下次运行到本站时，第2/3/3.5步（未加链接回收+主动pitch+发现平台投放）应该正式执行一次，本次完全跳过。

---

## 2026-08-29（第0步选站：11-30位曝光量重排，见下方说明）

**第0步（选站）**：本次运行执行"🎯 外链产能集中规则"——现算全矩阵10站近28天11-30位曝光量，排除压制中三站（CalcBadger 2、DialWick 495、LingoGrove 100，均在算法压制观察期）。剩余站排序：WageLark(532) > **DayAlmanac(303)** > UmberLore(236) > FactCrumbs(113) > MythCairn(84) > WarCrumbs(39) > Hollowvane(10)。本次选中WageLark/DayAlmanac/UmberLore三站集中投产能，本站属于其中之一。

**执行顺序：分发优先于新产**（2026-08-28 Owen拍板）。本站已有1个已发布资产（第2条"Days Until"倒计时组件，2026-08-25发布），此前从未做过分发（上次运行第2/3/3.5步全部跳过），本次优先执行分发，不制作新资产。

### 第2步（未加链接提及回收）

WebSearch `"dayalmanac.com" -site:dayalmanac.com` → 无相关结果引用本站（页面仍新，符合预期）。本轮无回收机会。

### 第3步补充（交互工具定向邀请嵌入）

倒计时组件覆盖的30+篇观察日文章中，选定National Guacamole Day（Sept 16）作为切入点——已通过WebSearch找到两个真实、当前在线、内容对应的目标：

1. **alwaystheholidays.com**（个人节日/食谱博客）"Observe National Guacamole Day with an Easy Guacamole Recipe"，联系人cgspeake@gmail.com（站内About页公开的个人邮箱，经独立复核确认是站主本人真实邮箱）。
2. **UF/IFAS Extension Indian River County**（佛罗里达大学推广办公室官方博客）"National Guacamole Day, September 16th" by Leslie Nicole Munroe，最初起草用webteam@ifas.ufl.edu（平台级通用别名），独立复核agent指出更合适的渠道是县办公室自己的联系地址indian@ifas.ufl.edu（在indian.ifas.ufl.edu上核实存在），已按建议改用后发送。

两封邮件均先过`Skill(humanizer)`，IFAS那封被`Skill(avoid-ai-writing)`抓出2处正文内破折号并修复。两封均存入`outreach-drafts.md`（追加），跨站查重（`gmail_send.py list --query "to:cgspeake@gmail.com OR to:indian@ifas.ufl.edu OR ..."`）确认此前均无联系记录。独立、全新上下文的复核agent逐一核实：目标页面真实在线且内容匹配、DayAlmanac两个URL（正文页+embed路由）均返回200、收件人是否为合规邮箱、语气是否有AI痕迹——候选1直接判定"CAN SEND"，候选2判定"PROBLEM"（webteam别名不够针对性）并给出更优地址，已按建议改址重发。

两封均于2026-08-29通过`gmail_send.py send --from dayalmanac`实际发出：candidate 1 → cgspeake@gmail.com（Message ID `1a04c0e8ed6243d7`），candidate 2 → indian@ifas.ufl.edu（Message ID `1a04c0ea06855e07`）。

### 第3.5步（发现平台投放）

未执行——本站资产是30+个embed路由的组件而非单一可展示页面，`reddit-投放候选清单.md`已明确将其列入"明确不投的"名单（无单一URL可发帖）。Show HN同理不适用（非技术向可展示产品）。本轮跳过，符合既定候选清单口径。

### 分发计数

本站累计已邀请/投放目标数：2/10（本次新增2个，此前0个）。距离"分发饱和"（≥10个合格目标且全部有结果记录）门槛还差8个，下次运行如果本站仍在选站范围内应继续补齐。

---

## 2026-09-01（第0步选站：11-30位曝光量重排，见下方说明）

**第0步（选站）**：现算全矩阵10站近28天11-30位曝光量：dialwick(766)/**dayalmanac(627)**/wagelark(596)/umberlore(344)/mythcairn(118)/factcrumbs(114)/lingogrove(114)/warcrumbs(41)/hollowvane(10)/calcbadger(2)。排除三个压制中站（CalcBadger 8/18起、DialWick 8/22起、LingoGrove 8/24起，均在观察期内，`流量站矩阵风险应对追踪.md`确认尚未复查解除）。剩余排序：**DayAlmanac(627) > WageLark(596) > UmberLore(344)**，与8/29上次运行一致，本站继续入选。

**执行顺序：分发优先于新产**。本站唯一已发布资产（倒计时组件）分发计数2/10，远未饱和，本次继续执行分发，不制作新资产。

### 第2步（未加链接提及回收）

WebSearch `"dayalmanac.com" -site:dayalmanac.com` — 无结果引用本站。本轮无回收机会。

### 第3步（新目标定向邀请）

本轮尝试为倒计时组件寻找新的embed邀请目标（National Taco Day / National Grandparents Day / National Dog Day 等已收录观察日相关博客），排查了dwsjewellery.com（内容与站点主题弱相关，判定不适合）、biteeatrepeat.com（活跃真实博客但仅有评论区无公开邮箱）、grannymaze.com（仅联系表单无可见邮箱）、teacherideafactory.com（403拒绝抓取）、clickvieweducation.com（页面无邮箱，大型edtech公司不太可能个人化回应）、impactful.ninja（仅联系表单）、senior living类站点storypoint.com/cascadeliving.com（均无可见邮箱或403）。National Day Calendar（nationaldaycalendar.com）虽有明确media inquiries邮箱，但属于同类目直接竞品，不是合适的embed邀请对象。

本轮未找到可核实、可直接联系（真实邮箱而非纯表单）且主题匹配的新目标。诚实记录为"本轮未推进"，不强行用表单提交凑数（表单提交无法保证阅读、也不符合本任务"个性化冷邮件"的定位）。

### 第3.5步（发现平台投放）

未重新评估——8/29的评估结论（无单一可展示页面，Reddit/HN均不适用）未变，本轮无新信息触发重新评估。

### 分发计数

本站累计已邀请/投放目标数：2/10（本轮新增0个）。仍未饱和，下次运行应继续尝试寻找可核实邮箱的新目标。
