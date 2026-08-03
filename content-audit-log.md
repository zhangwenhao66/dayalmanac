# DayAlmanac 内容质量审计日志

由定时任务`trafficsite-content-quality-audit`维护，记录已发布内容的回头复核（区别于发布前的五重检查）。每篇文章一条记录，选取顺序按`last_audited`最早/未审计优先。

```json
{
  "url_slug": "national-boyfriend-day",
  "last_audited": "2026-08-03",
  "published_date": "2026-08-02",
  "findings": [
    {
      "dimension": "EEAT",
      "status": "未发现问题",
      "detail": "全文以具体史料/权威机构原话为证据展开（National Day Calendar自承'remains a bit of a mystery'、National Today'probably dated October 4, 2014'、Dictionary.com 2012年Twitter起源说），并明确点出'46,000条推文'这类常被转载但缺乏原始数据支撑的统计数字，属实证怀疑式写作而非泛泛而谈。"
    },
    {
      "dimension": "事实准确性",
      "status": "未发现问题（逐条WebSearch核实）",
      "detail": "针对本文最核心的论断——'两个互不调和的起源故事相差两年'——逐一WebSearch核实7条信源：National Day Calendar原话'remains a bit of a mystery'准确；Dictionary.com'2012年10月3日、匿名Twitter用户'准确；National Today'probably dated October 4, 2014'+'no sole officially-credited source'准确；Wikipedia'46,000条推文/2016年3月'统计确认在网络上广泛传播但确无原始测量数据支撑（文章对此保持怀疑的态度是恰当的）；National Girlfriend Day为8月1日、两个registry均定义为'female friendship'而非情侣关系，准确；Bustle 2017年10月3日报道网友用虚构角色/名人当'boyfriend'的反串传统，准确；dateRule.occurrences六个年份(2026-2031)的星期字段独立用Python datetime复核，全部吻合。"
    },
    {
      "dimension": "时效性",
      "status": "未发现问题",
      "detail": "本站硬规则：年份相关evergreen URL需年度refresh（1月/10月）。本文occurrences覆盖2026-2031共6年，当前(2026-08-03)最近一次occurrence（2026-10-03）尚未发生，不存在过期年份问题。"
    },
    {
      "dimension": "竞品差异化",
      "status": "未发现问题",
      "detail": "get_serp_results实测关键词'national boyfriend day'：dayalmanac.com未进入前20（站点太新，符合预期），头部竞品为nationaldaycalendar.com、Wikipedia、nationaldayarchives.com、nationaltoday.com。对比这些头部竞品的公开摘要，均未像本文一样正面拆穿'两个起源故事相差两年、从未被调和'这一具体矛盾，也未点出'46,000推文'统计缺乏原始数据支撑。增量价值真实，非同质化内容。"
    },
    {
      "dimension": "SEO技术审计",
      "status": "未发现问题",
      "detail": "curl+浏览器JS双重实测线上HTML：title准确、meta description、canonical自指、单一h1、6个h2无跳级（What National Boyfriend Day is/The date/Nobody can show who started it/How people mark it/Official status/FAQ）、URL结构evergreen不带年份、robots.txt允许抓取。"
    },
    {
      "dimension": "GEO审计",
      "status": "达标，未做结构性改动",
      "detail": "按本站发布任务同一套99分制11维度自评约88/99（权威原文引语15/16、统计数据完整性10/14、可引用性12/13、结构规范性12/12、表达流畅度9/10、语义密度7/8、权威信号6/8、专业术语5/6、鲁棒性5/5、跨域连接4/4、易懂表达3/3），已达标≥80。schema层面确认FAQPage(6问)/Article/BreadcrumbList/Event×6全部有效且与guides.ts数据一致。本次两处修复（配图/FAQ措辞）均不涉及GEO薄弱维度，未重新完整打分。"
    },
    {
      "dimension": "早期内容AI味补漏",
      "status": "未发现问题",
      "detail": "本站发布流程（dayalmanac-content-publishing SKILL.md第1步）从建站第一篇起即含Skill(humanizer)强制步骤，不存在'humanizer引入前的早期内容'这一情形。机械扫描正文：em-dash 0处、花体引号0处、常见AI高频词(delve/tapestry/testament/underscore等)0处；全文9处em-dash均位于sources数组的label引用元数据（如'National Day Calendar — National Boyfriend Day'），非正文内容。"
    },
    {
      "dimension": "外部引用链接腐烂",
      "status": "未发现问题（一处需说明的例外）",
      "detail": "7条sources链接curl实测：nationaltoday.com/dictionary.com/holidayinsights.com/en.wikipedia.org/bustle.com/sproutsocial.com均200。nationaldaycalendar.com对curl自动化请求返回403（Cloudflare bot拦截特征：cf-ray头+301跳转链正常但终点403），但WebSearch证实该页面内容仍可被搜索引擎正常索引并返回原文引语，判定为bot拦截而非真实链接失效，与站内其他文章审计对同类站点的既有判定一致，未采取行动。"
    },
    {
      "dimension": "内链健康度",
      "status": "未发现问题",
      "detail": "全站目前仅6篇文章、全部同属Observances分类，src/pages/[slug].astro使用vendor/site-toolkit的轮转窗口算法，categoryPeers.length(5)≤6时返回全部同类文章，故本文与其余5篇互相100%可达（侧栏'Also on the calendar'实测显示全部5篇兄弟文章）。正文暂无手动锚文本互链，属站点仅6篇内容的正常阶段性状态，非孤儿页问题。"
    },
    {
      "dimension": "Schema数据一致性",
      "status": "未发现问题（本次修复后重新验证一致）",
      "detail": "线上JSON-LD的FAQPage.mainEntity与guides.ts的faq数组逐字一致（含本次修改的最后一条答案）；Article.datePublished/dateModified分别对应新增的published(2026-08-02)/updated(2026-08-03)字段；Article.image、og:image、twitter:image三处修复后均指向同一张新图片，无不一致。"
    },
    {
      "dimension": "合规/敏感度漂移",
      "status": "未发现问题",
      "detail": "文章提及的实体（Twitter/X用户群体、Dictionary.com、National Today、Wikipedia、Bustle、Sprout Social、Mean Girls电影）均为中性引用，无现实世界新增争议。主题本身（社交媒体非官方节日）无敏感度风险。"
    },
    {
      "dimension": "配图可用性与版权",
      "status": "确认问题，已修复",
      "detail": "文章无image字段，og:image/twitter:image/Article schema image全部回退到/favicon.svg（SVG格式）。独立复核agent确认为真实缺陷：Twitter/X的Card Validator与Facebook的Open Graph解析器均不支持SVG格式作为og:image/twitter:image，本文声明的twitter:card=summary_large_image在实际分享时会完全不显示图片（非错误尺寸，是空白/纯文字卡片），且Twitter Card Validator本身不会报错，问题只有在真实分享链接时才会暴露，属隐蔽但真实的技术缺陷。"
    },
    {
      "dimension": "事实准确性（FAQ次要论断，本次审计新增关注点）",
      "status": "确认问题，已修复",
      "detail": "FAQ'Is there a National Girlfriend Day?'结尾一句'Its own origin is undocumented too'，暗示Girlfriend Day与本文主打的Boyfriend Day一样'查无任何具名起源'。独立复核agent用WebSearch核实National Today等信源对Girlfriend Day起源的记载：存在多个互相竞争、但确有具名的起源说法（Sisterhood Publishing创始人Kathleen Laing与Elizabeth Butterfield，2002年图书推广；'Mistress Susan'，2004年；Allie Savarino Kline与Sally Rodgers，2006年经Sisterwoman.com）。这是'有争议但有具名候选人'，与Boyfriend Day'零署名、两个匿名/未具名版本互不调和'的情况本质不同，'undocumented too'构成措辞夸大（overstate）。"
    }
  ],
  "actions_taken": [
    "从Wikimedia Commons下载配图：'Hugging in the winter (Unsplash).jpg'，摄影者freestocks（via Unsplash），CC0协议（Restrictions字段为空，AttributionRequired=false），5472×3648原图用sips缩至1600×1066/292KB，写入image/imageAlt/imageCredit三个字段",
    "FAQ最后一条答案'Its own origin is undocumented too'改为'Its own origin is disputed rather than settled, with different sources crediting different people or groups depending on which account you read'——只做防守性措辞修正，不在文章里新增未经一手信源核实的具体人名/年份（Sisterhood Publishing等细节仅来自WebSearch聚合结果，未能直接访问nationaltoday.com原文核实逐字，故未写入文章正文，符合'不能编造'的审计纪律）",
    "新增published字段回填原始发布日2026-08-02；updated字段改为2026-08-03",
    "npm run build（Node 22.22.2）13页0报错；commit 0dbb5af并push（仅暂存src/data/guides.ts+新图片两个文件，规避同目录另一并发会话的未提交文件）；git自动部署后轮询确认线上og:image已为真实JPEG（200，292592字节与本地一致）且FAQ新文本已生效；IndexNow提交（Bing 200/Yandex 202），记入indexnow-submit-log.json；内容发布日志.md追加审计记录"
  ],
  "seo_score": "审计前后均为技术SEO全项通过（本次未发现需修复的SEO技术项，标题/描述/canonical/heading/schema均未改动）",
  "geo_score": "自评约88/99（已达标≥80），本次两处修复不涉及GEO薄弱维度，未重新完整打分",
  "escalation": null
}
```
