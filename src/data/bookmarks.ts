import { parseBookmarksHTML, deduplicateBookmarks, type Bookmark, type BookmarkCategory } from '@utils/bookmarkImporter'

// 从原始 HTML 书签文件提取的数据
const BOOKMARKS_HTML = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3 ADD_DATE="1732334248" LAST_MODIFIED="1764339102" PERSONAL_TOOLBAR_FOLDER="true">书签栏</H3>
    <DL><p>
        <DT><H3 ADD_DATE="1764339102" LAST_MODIFIED="1764339102">API key</H3>
        <DL><p>
        </DL><p>
        <DT><H3 ADD_DATE="1732583595" LAST_MODIFIED="1736585314">读看</H3>
        <DL><p>
            <DT><A HREF="https://www.dedao.cn/" ADD_DATE="1685502242">得到APP</A>
            <DT><A HREF="https://weread.qq.com/web/shelf" ADD_DATE="1718172856">微信读书</A>
            <DT><A HREF="https://b.hundun.cn/course/5557a528e4f4d3c87d4427667734108d?company_id=31411953&sku_mode=b_college" ADD_DATE="1683193816">混沌</A>
            <DT><A HREF="https://xueyuan.xiaoe-tech.com/detail/i_600644e8e4b0ab9a2549be62/1" ADD_DATE="1647765430">小鹅通运营学堂</A>
        </DL><p>
        <DT><H3 ADD_DATE="1736585146" LAST_MODIFIED="1743427628">AI 笔记</H3>
        <DL><p>
            <DT><A HREF="https://notebooklm.google.com/?_gl=1*yqrugi*_ga*NjkxNTAxMzA3LjE3MjgzNDc5MzY.*_ga_W0LDH41ZCB*MTcyODM0NzkzNi4xLjEuMTcyODM0NzkzNi42MC4wLjA.&original_referer=https://notebooklm.google%23&pli=1" ADD_DATE="1728347951">Google笔记</A>
            <DT><A HREF="https://www.notion.so/052686fc1196488a931de5ce348e53c6" ADD_DATE="1736586505">Notion</A>
            <DT><A HREF="https://fxu5r7nfzg.feishu.cn/base/N7sKb36GlanusbsoujrcfluZnIc?table=tbl38F3YUbDxYZ9H&view=vew9mCGWw3" ADD_DATE="1739541896">飞书多维表</A>
            <DT><A HREF="https://fxu5r7nfzg.feishu.cn/drive/home/" ADD_DATE="1743380835">飞书云文档</A>
        </DL><p>
        <DT><H3 ADD_DATE="1733710907" LAST_MODIFIED="1762935515">开发</H3>
        <DL><p>
            <DT><A HREF="https://openrouter.ai/chat" ADD_DATE="1749218343">Chatroom | OpenRouter</A>
            <DT><A HREF="https://myaccount.console.aliyun.com/cert-info" ADD_DATE="1751269087">阿里云服务器</A>
            <DT><A HREF="https://console.cloud.tencent.com/lighthouse/instance/index?rid=1" ADD_DATE="1734358909">服务器 - 轻量云 - 控制台</A>
            <DT><A HREF="https://cloud.tencent.com/document/product/213/2936" ADD_DATE="1734358975">文档中心-腾讯云</A>
            <DT><A HREF="https://console.cloud.tencent.com/beian/manage/process/30173440149913160/review" ADD_DATE="1734402974">ICP备案 - 控制台</A>
            <DT><A HREF="https://beian.mps.gov.cn/web/business/businessHome/draft" ADD_DATE="1734865021">网站公安备案</A>
            <DT><A HREF="https://cretvalu.com/" ADD_DATE="1734948839">cretvalu.com</A>
            <DT><A HREF="https://appgen.groqlabs.com/" ADD_DATE="1735513739">一键生成 app</A>
            <DT><A HREF="https://computer.tldraw.com/?spm=1100ca57.497135c3.0.0.1a8a72428kpwen" ADD_DATE="1735566039">画一切</A>
            <DT><A HREF="https://platform.deepseek.com/usage" ADD_DATE="1736936967">DeepSeek 开放平台</A>
            <DT><A HREF="https://cloud.siliconflow.cn/account/ak" ADD_DATE="1738575396">硅基流动API key</A>
            <DT><A HREF="https://bailian.console.aliyun.com/?switchAgent=12402095&productCode=p_efm&switchUserType=3&tab=home#/home" ADD_DATE="1753258175">阿里云百炼</A>
            <DT><A HREF="https://www.bigmodel.cn/usercenter/proj-mgmt/apikeys" ADD_DATE="1753748959">智谱AI开放平台</A>
            <DT><A HREF="https://console.volcengine.com/auth/login/?redirectURI=https%3A%2F%2Fconsole.volcengine.com%2Fark%2Fregion%3Aark%2Bcn-beijing%2Fendpoint%3Fconfig%3D%257B%257D" ADD_DATE="1739541871">账号登录-火山引擎</A>
            <DT><A HREF="https://mp.weixin.qq.com/cgi-bin/home?t=home/index&token=159208836&lang=zh_CN" ADD_DATE="1747489752">公众号文章</A>
            <DT><A HREF="https://dash.cloudflare.com/fb6dab3f4fb4cce2c9f306757bde4844/pages/view/insurdash/b09752fc-a7c5-4697-bb3c-c4e9e890efc5" ADD_DATE="1751727199">Cloudflare</A>
            <DT><A HREF="https://supabase.com/dashboard/project/mpasloiecjkwqbdqtjte" ADD_DATE="1751968613">Supabase</A>
            <DT><A HREF="https://docs.anthropic.com/zh-CN/docs/claude-code/mcp" ADD_DATE="1751984512">Claude (MCP)</A>
            <DT><A HREF="https://aistudio.google.com/apikey" ADD_DATE="1752457070">Get API key | Google AI Studio</A>
            <DT><A HREF="https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys" ADD_DATE="1754015896">智谱AI开放平台</A>
            <DT><A HREF="https://cloud.memfiredb.com/setting/certification" ADD_DATE="1761384395">实名认证 - MemFireDB</A>
            <DT><A HREF="https://sites.google.com/u/0/new?hl=zh-cn&pli=1&authuser=0" ADD_DATE="1761633761">Google 网站</A>
        </DL><p>
        <DT><H3 ADD_DATE="1736585290" LAST_MODIFIED="1751854966">工具</H3>
        <DL><p>
            <DT><A HREF="https://tool.browser.qq.com/" ADD_DATE="1729138551">腾讯在线工具箱</A>
            <DT><A HREF="https://www.processon.com/" ADD_DATE="1733431005">ProcessOn</A>
            <DT><A HREF="https://www.kdocs.cn/" ADD_DATE="1733431016">金山文档</A>
            <DT><A HREF="https://tableconvert.com/" ADD_DATE="1733431027">TableConvert</A>
            <DT><A HREF="https://app.n8n.cloud/" ADD_DATE="1733431043">n8n 自动化</A>
            <DT><A HREF="https://pdf2000.com/" ADD_DATE="1733431054">在线 PDF 转换</A>
            <DT><A HREF="https://ppt.sankki.com/" ADD_DATE="1733431065">闪击 PPT</A>
            <DT><A HREF="https://pixian.ai/" ADD_DATE="1733431076">免费抠图</A>
            <DT><A HREF="https://www.wenjuan.com/" ADD_DATE="1733431087">问卷网</A>
        </DL><p>
        <DT><H3 ADD_DATE="1736584971" LAST_MODIFIED="1736585263">搜索</H3>
        <DL><p>
            <DT><A HREF="https://www.genspark.ai/agents" ADD_DATE="1736584971">Genspark Agents</A>
            <DT><A HREF="https://metaso.cn/" ADD_DATE="1736584982">秘塔 AI 搜索</A>
            <DT><A HREF="https://www.n.cn/" ADD_DATE="1736584993">纳米 AI 搜索</A>
            <DT><A HREF="https://www.coze.cn/space-preview" ADD_DATE="1736585004">Coze (扣子)</A>
            <DT><A HREF="https://flowith.io/" ADD_DATE="1736585015">Flowith 思维链</A>
            <DT><A HREF="https://zhida.zhihu.com/" ADD_DATE="1736585026">知乎直答</A>
        </DL><p>
        <DT><H3 ADD_DATE="1732583379" LAST_MODIFIED="1749354673">AI 对话</H3>
        <DL><p>
            <DT><A HREF="https://chat.deepseek.com/" ADD_DATE="1732583379">DeepSeek 官网</A>
            <DT><A HREF="https://chatgpt.com/?oai-dm=1" ADD_DATE="1732583390">ChatGPT</A>
            <DT><A HREF="https://claude.ai/" ADD_DATE="1732583401">Claude AI</A>
            <DT><A HREF="https://gemini.google.com/app" ADD_DATE="1732583412">Gemini</A>
            <DT><A HREF="https://grok.com/" ADD_DATE="1732583423">Grok</A>
            <DT><A HREF="https://lmarena.ai/" ADD_DATE="1732583434">LMArena 竞技场</A>
            <DT><A HREF="https://chat.qwen.ai/" ADD_DATE="1732583445">Qwen</A>
            <DT><A HREF="https://jules.google.com/task" ADD_DATE="1732583456">Jules</A>
            <DT><A HREF="https://www.aiswers.com/bot/chatgpt" ADD_DATE="1732583467">Aiswers (多AI)</A>
            <DT><A HREF="https://labs.google/" ADD_DATE="1732583478">Google AI Labs</A>
            <DT><A HREF="https://kimi.moonshot.cn/" ADD_DATE="1732583489">Kimi 智能助手</A>
            <DT><A HREF="https://chatglm.cn/" ADD_DATE="1732583500">智谱清言</A>
            <DT><A HREF="https://yuanbao.tencent.com/" ADD_DATE="1732583511">腾讯元宝</A>
            <DT><A HREF="https://tingwu.aliyun.com/home" ADD_DATE="1732583522">通义听悟</A>
            <DT><A HREF="https://kcnj7yazgs86.feishu.cn/wiki/NTsQw69bYiPtgzkHyy7cZRurn1O" ADD_DATE="1732583533">Gemini 3.0 Pro (飞书)</A>
            <DT><A HREF="https://yiyan.baidu.com/promptCenter" ADD_DATE="1732583544">文心一言</A>
            <DT><A HREF="https://chat.scnet.cn/" ADD_DATE="1732583555">超算-DeepSeek</A>
            <DT><A HREF="https://chat.z.ai/" ADD_DATE="1732583566">智普AI</A>
            <DT><A HREF="https://skywork.ai/" ADD_DATE="1732583577">天工 AI</A>
        </DL><p>
        <DT><H3 ADD_DATE="1693896587" LAST_MODIFIED="1763022612">公司</H3>
        <DL><p>
            <DT><H3 ADD_DATE="1740794689" LAST_MODIFIED="1740794689">WPS PY脚本指引</H3>
            <DL><p>
                <DT><A HREF="https://365.kdocs.cn/l/cuUFLE0Ufojw" ADD_DATE="1740794652">python脚本使用指南</A>
            </DL><p>
            <DT><H3 ADD_DATE="1739540975" LAST_MODIFIED="1739540975">续保监控</H3>
            <DL><p>
                <DT><A HREF="http://bi.sinosafe.com.cn/decision/link/rVYp" ADD_DATE="1740794620">续保监控</A>
            </DL><p>
            <DT><H3 ADD_DATE="1740794706" LAST_MODIFIED="1740794706">报价追踪</H3>
            <DL><p>
                <DT><A HREF="http://bi.sinosafe.com.cn/decision/link/TQlh" ADD_DATE="1740794675">报价追踪表</A>
            </DL><p>
            <DT><H3 ADD_DATE="1740794737" LAST_MODIFIED="1740794737">多维车险成本</H3>
            <DL><p>
                <DT><A HREF="https://bi.sinosafe.com.cn/decision#/analysis/own/subject/ea63ccdc862c49f1913cdc9015c6b439/report/7a387f2817e84788bdd004cd6bafc36d" ADD_DATE="1740794700">多维车险成本</A>
            </DL><p>
            <DT><H3 ADD_DATE="1740794768" LAST_MODIFIED="1740794768">驾驶意险转化率</H3>
            <DL><p>
                <DT><A HREF="http://bi.sinosafe.com.cn/decision/link/jgXN" ADD_DATE="1740794732">驾意险转化率</A>
            </DL><p>
            <DT><H3 ADD_DATE="1740794799" LAST_MODIFIED="1740794799">货车风险评分</H3>
            <DL><p>
                <DT><A HREF="https://risk.deltaentropy.com/#/ds" ADD_DATE="1740794765">货车风险评分</A>
            </DL><p>
            <DT><H3 ADD_DATE="1740794830" LAST_MODIFIED="1740794830">转续保报价</H3>
            <DL><p>
                <DT><A HREF="http://bi.sinosafe.com.cn/decision/link/Xl80" ADD_DATE="1740794795">转续保报价</A>
            </DL><p>
            <DT><H3 ADD_DATE="1740794861" LAST_MODIFIED="1740794861">赔付率分析</H3>
            <DL><p>
                <DT><A HREF="https://bi.sinosafe.com.cn/decision#/analysis/own/subject/16b7474a1e12452d9ea4736d8db40c9f/report/3435b9d091f14b768de286da4030b614" ADD_DATE="1740794830">赔付率分析</A>
            </DL><p>
            <DT><H3 ADD_DATE="1751259035" LAST_MODIFIED="1751259035">承保清单规范</H3>
            <DL><p>
                <DT><A HREF="https://gemini.google.com/share/c88b3a1f1d2c" ADD_DATE="1740794880">承保清单规范</A>
            </DL><p>
            <DT><H3 ADD_DATE="1751259139" LAST_MODIFIED="1751259139">FineChatBI 指引</H3>
            <DL><p>
                <DT><A HREF="https://help.fanruan.com/finebi/doc-view-2580.html" ADD_DATE="1740794905">FineChatBI 指引</A>
            </DL><p>
            <DT><H3 ADD_DATE="1751259243" LAST_MODIFIED="1751259243">应用复用助手</H3>
            <DL><p>
                <DT><A HREF="https://robot.fanruan.com/chat/app" ADD_DATE="1740794930">应用复用助手</A>
            </DL><p>
            <DT><H3 ADD_DATE="1751259347" LAST_MODIFIED="1751259347">经营决策系统</H3>
            <DL><p>
                <DT><A HREF="http://iap.sinosafe.com.cn/#/analysisdor/analysis/countAnalysis" ADD_DATE="1740794955">经营决策系统</A>
            </DL><p>
            <DT><H3 ADD_DATE="1751259451" LAST_MODIFIED="1751259451">FineBI 报表平台</H3>
            <DL><p>
                <DT><A HREF="http://bi.sinosafe.com.cn/" ADD_DATE="1740794980">FineBI 报表平台</A>
            </DL><p>
            <DT><H3 ADD_DATE="1736584849" LAST_MODIFIED="1736584849">企微文档</H3>
            <DL><p>
                <DT><A HREF="https://doc.weixin.qq.com/home/recent" ADD_DATE="1736584801">企微文档</A>
            </DL><p>
            <DT><H3 ADD_DATE="1736584860" LAST_MODIFIED="1736584860">邮件系统</H3>
            <DL><p>
                <DT><A HREF="https://webmail.sinosafe.com.cn/coremail/XT/index.jsp" ADD_DATE="1736584822">邮件系统</A>
            </DL><p>
            <DT><H3 ADD_DATE="1736584871" LAST_MODIFIED="1736584871">OneDrive</H3>
            <DL><p>
                <DT><A HREF="https://onedrive.live.com/" ADD_DATE="1736584833">OneDrive</A>
            </DL><p>
            <DT><H3 ADD_DATE="1736584882" LAST_MODIFIED="1736584882">OA 办公系统</H3>
            <DL><p>
                <DT><A HREF="http://oa.sinosafe.com.cn/login.jsp" ADD_DATE="1736584844">OA 办公系统</A>
            </DL><p>
            <DT><H3 ADD_DATE="1736584893" LAST_MODIFIED="1736584893">车险核心</H3>
            <DL><p>
                <DT><A HREF="http://auto.sinosafe.com.cn/index.jsp" ADD_DATE="1736584855">车险核心</A>
            </DL><p>
            <DT><H3 ADD_DATE="1736584904" LAST_MODIFIED="1736584904">电销 CRM</H3>
            <DL><p>
                <DT><A HREF="https://crm.sinosafe.com.cn/" ADD_DATE="1736584866">电销 CRM</A>
            </DL><p>
            <DT><H3 ADD_DATE="1736584915" LAST_MODIFIED="1736584915">反洗钱工作台</H3>
            <DL><p>
                <DT><A HREF="http://amlnew.sinosafe.com.cn/#/work-support/report-work/report-check" ADD_DATE="1736584877">反洗钱工作台</A>
            </DL><p>
            <DT><H3 ADD_DATE="1736584926" LAST_MODIFIED="1736584926">企大培训平台</H3>
            <DL><p>
                <DT><A HREF="http://nclm.qida.com/#taskInput?id=200073745" ADD_DATE="1736584888">企大培训平台</A>
            </DL><p>
            <DT><H3 ADD_DATE="1736584937" LAST_MODIFIED="1736584937">删邮件入口</H3>
            <DL><p>
                <DT><A HREF="https://webmail.sinosafe.com.cn/coremail/XT/index.jsp?sid=CAdLwXbbpKJeMFSEXHIsOLJvgmytvowb#mail.list|%7B%22fid%22%3A1%7D" ADD_DATE="1736584899">删邮件入口</A>
            </DL><p>
        </DL><p>
        <DT><H3 ADD_DATE="1736585227" LAST_MODIFIED="1763382586">新玩法</H3>
        <DL><p>
            <DT><A HREF="https://www.midjourney.com/" ADD_DATE="1736585160">Midjourney</A>
            <DT><A HREF="https://app.klingai.com/" ADD_DATE="1736585171">可灵 AI (Kling)</A>
            <DT><A HREF="https://hailuoai.video/" ADD_DATE="1736585182">Hailuo AI (海螺)</A>
            <DT><A HREF="https://www.recraft.ai/" ADD_DATE="1736585193">Recraft (SVG)</A>
            <DT><A HREF="https://playground.bfl.ai/" ADD_DATE="1736585204">Flux Playground</A>
            <DT><A HREF="https://www.xingliu.art/" ADD_DATE="1736585215">星流 Art</A>
            <DT><A HREF="https://3d.hunyuan.tencent.com/" ADD_DATE="1736585226">Hunyuan 3D</A>
            <DT><A HREF="https://hunyuan.tencent.com/" ADD_DATE="1736585237">腾讯混元图</A>
            <DT><A HREF="https://labs.google/fx/tools/flow" ADD_DATE="1736585248">Flow (Google)</A>
            <DT><A HREF="https://www.jyshare.com/more/svgeditor/" ADD_DATE="1736585259">SVG 在线编辑</A>
            <DT><A HREF="https://stitch.withgoogle.com/" ADD_DATE="1736585270">Google Sttich</A>
            <DT><A HREF="https://labs.google/fx/tools/whisk" ADD_DATE="1736585281">Whisk (FX)</A>
            <DT><A HREF="https://www.lovart.ai/" ADD_DATE="1736585292">Lovart</A>
            <DT><A HREF="https://docs.google.com/presentation/" ADD_DATE="1736585303">Google PPT</A>
            <DT><A HREF="https://www.yourware.so/" ADD_DATE="1736585314">代码变网页</A>
            <DT><A HREF="https://huggingface.co/spaces/enzostvs/deepsite" ADD_DATE="1736585325">DeepSite (HF)</A>
            <DT><A HREF="https://wenku.baidu.com/board" ADD_DATE="1736585336">自由画布</A>
            <DT><A HREF="https://app.napkin.ai/" ADD_DATE="1736585347">Napkin.ai</A>
            <DT><A HREF="https://www.figma.com/" ADD_DATE="1736585358">Figma</A>
            <DT><A HREF="https://www.aippt.cn/" ADD_DATE="1736585369">AiPPT</A>
            <DT><A HREF="https://g2plot.antv.antgroup.com/manual/plots/heatmap" ADD_DATE="1736585380">G2Plot 图表库</A>
            <DT><A HREF="https://chartcube.alipay.com/guide" ADD_DATE="1736585391">ChartCube</A>
            <DT><A HREF="https://elevenlabs.io/" ADD_DATE="1736585402">ElevenLabs (音)</A>
            <DT><A HREF="https://www.minimax.io/audio" ADD_DATE="1736585413">MiniMax Audio</A>
        </DL><p>
        <DT><H3 ADD_DATE="1748480732" LAST_MODIFIED="1751963113">任务流</H3>
        <DL><p>
            <DT><A HREF="https://skywork.ai/" ADD_DATE="1748480702">办公——天工</A>
            <DT><A HREF="https://cursor.com/" ADD_DATE="1748480713">Cursor</A>
            <DT><A HREF="https://cursor.com/cn/agents" ADD_DATE="1748480724">Cursor Agents</A>
            <DT><A HREF="https://claude.ai/code" ADD_DATE="1748480735">Claude Code</A>
            <DT><A HREF="https://replit.com/" ADD_DATE="1748480746">Replit</A>
            <DT><A HREF="https://v0.dev/" ADD_DATE="1748480757">Vercel v0</A>
            <DT><A HREF="https://bolt.new/" ADD_DATE="1748480768">Bolt.new</A>
            <DT><A HREF="https://idx.google.com/" ADD_DATE="1748480779">Google IDX</A>
            <DT><A HREF="https://lovable.dev/" ADD_DATE="1748480790">Lovable</A>
            <DT><A HREF="https://manus.im/app" ADD_DATE="1748480801">Manus</A>
            <DT><A HREF="https://zoer.ai/" ADD_DATE="1748480812">Zoer DB编程</A>
            <DT><A HREF="https://colab.research.google.com/" ADD_DATE="1748480823">Colaboratory</A>
            <DT><A HREF="https://texteditor.co/" ADD_DATE="1748480834">Text Editor</A>
            <DT><A HREF="https://copycoder.ai/" ADD_DATE="1748480845">CopyCoder</A>
            <DT><A HREF="https://appgen.groqlabs.com/" ADD_DATE="1748480856">App Gen</A>
            <DT><A HREF="https://cursor.directory/learn" ADD_DATE="1748480867">Learn Cursor</A>
            <DT><A HREF="https://docs.codeium.com/windsurf" ADD_DATE="1748480878">Windsurf 文档</A>
        </DL><p>
        <DT><H3 ADD_DATE="1750318400" LAST_MODIFIED="1763275760">我的作品</H3>
        <DL><p>
            <DT><A HREF="https://alongor666.github.io/Table_Forge/" ADD_DATE="1750318348">Markdown 转 Excel</A>
            <DT><A HREF="https://autinsight.web.app/" ADD_DATE="1750318369">车险经营分析周报</A>
            <DT><A HREF="https://alongor666.github.io/moto_cost/" ADD_DATE="1750318390">摩托车成本模型</A>
            <DT><A HREF="https://alongor666.github.io/Fee-re/" ADD_DATE="1750318411">可续期查询</A>
            <DT><A HREF="https://gemini-proxy.alongor0512.workers.dev/" ADD_DATE="1750318432">Gemini Proxy</A>
            <DT><A HREF="https://acl4ssr-sub.github.io/" ADD_DATE="1750318453">ACL4SSR 订阅</A>
            <DT><A HREF="https://sites.google.com/" ADD_DATE="1750318474">Google 网站</A>
        </DL><p>
        <DT><H3 ADD_DATE="1732583648" LAST_MODIFIED="1764335741">编程</H3>
        <DL><p>
            <DT><A HREF="https://github.com/" ADD_DATE="1732583648">GitHub</A>
            <DT><A HREF="https://git-scm.com/downloads/guis" ADD_DATE="1732583659">Git GUI</A>
            <DT><A HREF="https://modelscope.cn/mcp" ADD_DATE="1732583670">魔搭社区 MCP</A>
            <DT><A HREF="https://www.modelscope.cn/mcp/playground" ADD_DATE="1732583681">MCP 实验场</A>
            <DT><A HREF="https://mcp.so/zh" ADD_DATE="1732583692">MCP.so</A>
            <DT><A HREF="https://cursor.directory/mcp" ADD_DATE="1732583703">Cursor MCP Docs</A>
            <DT><A HREF="https://docs.anthropic.com/zh-CN/docs/claude-code/mcp" ADD_DATE="1732583714">Claude MCP Docs</A>
            <DT><A HREF="https://code.visualstudio.com/mcp" ADD_DATE="1732583725">VS Code MCP</A>
            <DT><A HREF="https://glama.ai/mcp/servers" ADD_DATE="1732583736">MCP Servers (Glama)</A>
        </DL><p>
        <DT><H3 ADD_DATE="1738744352" LAST_MODIFIED="1738744387">投资</H3>
        <DL><p>
            <DT><A HREF="https://tushare.pro/webclient/" ADD_DATE="1738744387">Tushare数据工具</A>
        </DL><p>
        <DT><H3 ADD_DATE="1732524619" LAST_MODIFIED="1732524619">备用</H3>
        <DL><p>
            <DT><A HREF="https://www.google.com/" ADD_DATE="1732524619">Google</A>
            <DT><A HREF="https://www.baidu.com/" ADD_DATE="1732524630">百度</A>
            <DT><A HREF="https://www.bing.com/" ADD_DATE="1732524641">必应</A>
            <DT><A HREF="https://duckduckgo.com/" ADD_DATE="1732524652">DuckDuckGo</A>
        </DL><p>
        <DT><H3 ADD_DATE="1736585496" LAST_MODIFIED="1736585507">政府网站</H3>
        <DL><p>
            <DT><A HREF="https://www.nanchong.gov.cn/data/catalog/details.html?id=156619&share_token=60f52e07-4d40-4363-983a-d7b799ef27f7&tt_from=copy_link&utm_source=copy_link&utm_medium=toutiao_android&utm_campaign=client_share" ADD_DATE="1693896570">政府数据</A>
            <DT><A HREF="https://dfjrjgj.sc.gov.cn/scdfjrjgj/jgdt/2024/2/6/377dc9e8905942acbe10da1b5143a10e.shtml" ADD_DATE="1736585437">四川金融监管局</A>
        </DL><p>
        <DT><H3 ADD_DATE="1749613334" LAST_MODIFIED="1753670283">MCP商店</H3>
        <DL><p>
            <DT><A HREF="https://glama.ai/mcp/servers" ADD_DATE="1749613272">MCP Servers (Glama)</A>
            <DT><A HREF="https://modelscope.cn/mcp" ADD_DATE="1749613283">魔搭社区 MCP</A>
            <DT><A HREF="https://www.modelscope.cn/mcp/playground" ADD_DATE="1749613294">MCP 实验场</A>
            <DT><A HREF="https://mcp.so/zh" ADD_DATE="1749613305">MCP.so</A>
            <DT><A HREF="https://cursor.directory/mcp" ADD_DATE="1749613316">Cursor MCP Docs</A>
            <DT><A HREF="https://docs.anthropic.com/zh-CN/docs/claude-code/mcp" ADD_DATE="1749613327">Claude MCP Docs</A>
            <DT><A HREF="https://code.visualstudio.com/mcp" ADD_DATE="1749613338">VS Code MCP</A>
        </DL><p>
        <DT><H3 ADD_DATE="1736836242" LAST_MODIFIED="1738575396">论文</H3>
        <DL><p>
            <DT><A HREF="https://arxiv.org/" ADD_DATE="1736836490">arXiv论文</A>
            <DT><A HREF="https://scholar.google.com/" ADD_DATE="1736836501">Google Scholar</A>
            <DT><A HREF="https://www.science.org/" ADD_DATE="1736836512">Science</A>
            <DT><A HREF="https://www.nature.com/" ADD_DATE="1736836523">Nature</A>
            <DT><A HREF="https://ieeexplore.ieee.org/" ADD_DATE="1736836534">IEEE Xplore</A>
            <DT><A HREF="https://www.sciencedirect.com/" ADD_DATE="1736836545">ScienceDirect</A>
            <DT><A HREF="https://pubmed.ncbi.nlm.nih.gov/" ADD_DATE="1736836556">PubMed</A>
        </DL><p>
        <DT><H3 ADD_DATE="1735041882" LAST_MODIFIED="1736584672">艺术</H3>
        <DL><p>
            <DT><A HREF="https://cidian.gushici.net/" ADD_DATE="1735041842">现代汉语词典</A>
            <DT><A HREF="https://www.fonts.net.cn/" ADD_DATE="1735041853">字体天下</A>
        </DL><p>
        <DT><H3 ADD_DATE="1736585432" LAST_MODIFIED="1736585448">汽车</H3>
        <DL><p>
            <DT><A HREF="https://ev.autohome.com.cn/#pvareaid=3311257" ADD_DATE="1675065713">汽车之家</A>
            <DT><A HREF="https://gz.guazi.com/" ADD_DATE="1736585421">瓜子二手车</A>
            <DT><A HREF="https://product.360che.com/" ADD_DATE="1736585432">卡车之家</A>
            <DT><A HREF="https://www.newmotor.com.cn/" ADD_DATE="1736585443">摩托车之家</A>
        </DL><p>
    </DL><p>
</DL><p>`

// 解析书签数据
const parsedData = parseBookmarksHTML(BOOKMARKS_HTML)
const deduplicatedBookmarks = deduplicateBookmarks(parsedData.bookmarks)

// 添加一个默认的未分类分类
const allCategories: BookmarkCategory[] = [
  ...parsedData.categories,
  {
    id: 'uncategorized',
    name: '未分类',
    icon: 'fa-folder',
    color: '#9ca3af',
    order: 999
  }
]

// 导出书签数据
export const BOOKMARK_DATA = {
  categories: allCategories.sort((a, b) => a.order - b.order),
  bookmarks: deduplicatedBookmarks
}

// 获取分类的辅助函数
export function getCategoryById(categoryId: string): BookmarkCategory | undefined {
  return allCategories.find(cat => cat.id === categoryId)
}

// 获取书签数量统计
export function getBookmarkCountByCategory(categoryId: string): number {
  return deduplicatedBookmarks.filter(bookmark => bookmark.category === categoryId).length
}

// 获取扁平化的分类列表
export function getFlatCategories(): BookmarkCategory[] {
  return allCategories
}

// 获取书签总数
export const TOTAL_BOOKMARKS = deduplicatedBookmarks.length

// 按分类分组书签
export function getBookmarksGroupedByCategory(): Record<string, Bookmark[]> {
  const grouped: Record<string, Bookmark[]> = {}

  deduplicatedBookmarks.forEach(bookmark => {
    const categoryId = bookmark.category || 'uncategorized'
    if (!grouped[categoryId]) {
      grouped[categoryId] = []
    }
    grouped[categoryId].push(bookmark)
  })

  return grouped
}