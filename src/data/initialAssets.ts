/**
 * 初始资产数据
 * 从原始文件迁移和结构化
 */

import type { Asset } from '@types/index'
import { AssetTag } from '@types/index'

/**
 * 默认资产数据
 * 保持原有数据结构和内容，优化格式
 */
export const INITIAL_ASSETS: Omit<Asset, 'id' | 'createdAt' | 'updatedAt' | 'visitCount'>[] = [
  // --- 经营决策组 ---
  {
    name: "企微文档",
    url: "https://doc.weixin.qq.com/home/recent",
    category: "biz_ops",
    rank: 1,
    tags: [AssetTag.DOCUMENTATION],
    description: "企业微信文档协作平台",
    archived: false
  },
  {
    name: "邮件系统",
    url: "https://webmail.sinosafe.com.cn/coremail/XT/index.jsp",
    category: "biz_ops",
    rank: 2,
    description: "企业内部邮件系统",
    archived: false
  },
  {
    name: "OneDrive",
    url: "https://onedrive.live.com/",
    category: "biz_ops",
    rank: 3,
    tags: [AssetTag.DOCUMENTATION],
    description: "微软云存储和文档协作",
    archived: false
  },
  {
    name: "经营决策系统",
    url: "http://iap.sinosafe.com.cn/#/analysisdor/analysis/countAnalysis",
    category: "biz_data",
    rank: 1,
    description: "企业经营数据分析平台",
    archived: false
  },
  {
    name: "FineBI 报表平台",
    url: "http://bi.sinosafe.com.cn/",
    category: "biz_data",
    rank: 2,
    description: "商业智能报表和分析工具",
    archived: false
  },
  {
    name: "四川金融监管局",
    url: "https://dfjrjgj.sc.gov.cn/scdfjrjgj/jgdt/2024/2/6/377dc9e8905942acbe10da1b5143a10e.shtml",
    category: "biz_ext",
    rank: 1,
    description: "四川省金融监管机构官网",
    archived: false
  },

  // --- AI 智能体组 ---
  {
    name: "DeepSeek 官网",
    url: "https://chat.deepseek.com/",
    category: "ai_chat",
    rank: 1,
    description: "深度求索AI对话系统",
    archived: false
  },
  {
    name: "ChatGPT",
    url: "https://chatgpt.com/?oai-dm=1",
    category: "ai_chat",
    rank: 2,
    description: "OpenAI GPT对话模型",
    archived: false
  },
  {
    name: "Claude AI",
    url: "https://claude.ai/",
    category: "ai_chat",
    rank: 3,
    description: "Anthropic Claude AI助手",
    archived: false
  },
  {
    name: "Kimi 智能助手",
    url: "https://kimi.moonshot.cn/",
    category: "ai_cn",
    rank: 1,
    description: "月之暗面Kimi AI助手",
    archived: false
  },
  {
    name: "智谱清言",
    url: "https://chatglm.cn/",
    category: "ai_cn",
    rank: 2,
    description: "智谱AI GLM模型",
    archived: false
  },
  {
    name: "Genspark Agents",
    url: "https://www.genspark.ai/agents",
    category: "ai_search",
    rank: 1,
    description: "Genspark AI代理平台",
    archived: false
  },
  {
    name: "秘塔 AI 搜索",
    url: "https://metaso.cn/",
    category: "ai_search",
    rank: 2,
    description: "秘塔AI搜索引擎",
    archived: false
  },

  // --- 开发者工具组 ---
  {
    name: "Cursor Agents",
    url: "https://cursor.com/cn/agents",
    category: "dev_ide",
    rank: 1,
    description: "Cursor代码编辑器AI代理",
    archived: false
  },
  {
    name: "Claude Code",
    url: "https://claude.ai/code",
    category: "dev_ide",
    rank: 2,
    description: "Anthropic代码编辑器",
    archived: false
  },
  {
    name: "Replit",
    url: "https://replit.com/",
    category: "dev_ide",
    rank: 3,
    description: "在线编程环境",
    archived: false
  },
  {
    name: "DeepSeek API",
    url: "https://platform.deepseek.com/usage",
    category: "dev_api",
    rank: 1,
    description: "深度求索API管理平台",
    archived: false
  },
  {
    name: "OpenRouter",
    url: "https://openrouter.ai/chat",
    category: "dev_api",
    rank: 2,
    description: "多模型API路由服务",
    archived: false
  },
  {
    name: "GitHub",
    url: "https://github.com/",
    category: "dev_infra",
    rank: 1,
    description: "代码托管和协作平台",
    archived: false
  },
  {
    name: "Cloudflare",
    url: "https://dash.cloudflare.com/",
    category: "dev_infra",
    rank: 2,
    description: "云服务和CDN加速",
    archived: false
  },
  {
    name: "MCP Servers (Glama)",
    url: "https://glama.ai/mcp/servers",
    category: "dev_mcp",
    rank: 1,
    description: "MCP服务器集合",
    archived: false
  },
  {
    name: "魔搭社区 MCP",
    url: "https://modelscope.cn/mcp",
    category: "dev_mcp",
    rank: 2,
    description: "ModelScope MCP生态",
    archived: false
  },

  // --- 创意工具组 ---
  {
    name: "Midjourney",
    url: "https://discord.com/",
    category: "create_vision",
    rank: 1,
    description: "Discord上的Midjourney AI绘图",
    archived: false
  },
  {
    name: "可灵 AI (Kling)",
    url: "https://app.klingai.com/",
    category: "create_vision",
    rank: 2,
    description: "快手可灵视频生成AI",
    archived: false
  },
  {
    name: "Hailuo AI (海螺)",
    url: "https://hailuoai.video/",
    category: "create_vision",
    rank: 3,
    description: "海螺AI视频生成平台",
    archived: false
  },
  {
    name: "Napkin.ai",
    url: "https://app.napkin.ai/",
    category: "create_design",
    rank: 1,
    description: "AI信息图生成工具",
    archived: false
  },
  {
    name: "Figma",
    url: "https://www.figma.com/",
    category: "create_design",
    rank: 2,
    description: "协作式界面设计工具",
    archived: false
  },
  {
    name: "AiPPT",
    url: "https://www.aippt.cn/",
    category: "create_design",
    rank: 3,
    description: "AI智能PPT生成工具",
    archived: false
  },

  // --- 知识体系组 ---
  {
    name: "Google Scholar",
    url: "https://scholar.google.com/",
    category: "know_research",
    rank: 1,
    description: "谷歌学术搜索引擎",
    archived: false
  },
  {
    name: "Arxiv Papers",
    url: "https://arxiv.org/",
    category: "know_research",
    rank: 2,
    description: "学术论文预印本库",
    archived: false
  },
  {
    name: "Notion",
    url: "https://www.notion.so/",
    category: "know_mgmt",
    rank: 1,
    description: "全能知识管理工具",
    archived: false
  },
  {
    name: "NotebookLM",
    url: "https://notebooklm.google.com/",
    category: "know_mgmt",
    rank: 2,
    description: "谷歌AI笔记本研究助手",
    archived: false
  },
  {
    name: "得到 APP",
    url: "https://www.dedao.cn/",
    category: "know_learn",
    rank: 1,
    description: "得到知识学习平台",
    archived: false
  },
  {
    name: "微信读书",
    url: "https://weread.qq.com/",
    category: "know_learn",
    rank: 2,
    description: "微信阅读平台",
    archived: false
  },
  {
    name: "现代汉语词典",
    url: "https://cidian.gushici.net/",
    category: "know_ref",
    rank: 1,
    description: "在线汉语词典工具",
    archived: false
  },

  // --- 效能基建组 ---
  {
    name: "Gmail",
    url: "https://mail.google.com/",
    category: "tool_collab",
    rank: 1,
    description: "谷歌邮箱服务",
    archived: false
  },
  {
    name: "Slack",
    url: "https://app.slack.com/",
    category: "tool_collab",
    rank: 2,
    description: "团队协作通讯平台",
    archived: false
  },
  {
    name: "ProcessOn",
    url: "https://www.processon.com/",
    category: "tool_office",
    rank: 1,
    description: "在线流程图和图表绘制",
    archived: false
  },
  {
    name: "金山文档",
    url: "https://www.kdocs.cn/",
    category: "tool_office",
    rank: 2,
    description: "在线文档协作平台",
    archived: false
  },
  {
    name: "Google One",
    url: "https://one.google.com/",
    category: "tool_net",
    rank: 1,
    description: "谷歌云存储服务",
    archived: false
  },
  {
    name: "JustMySocks",
    url: "https://justmysocks.net/",
    category: "tool_net",
    rank: 2,
    tags: [AssetTag.NETWORK],
    description: "科学上网代理服务",
    archived: false
  },
  {
    name: "Markdown 转 Excel",
    url: "https://alongor666.github.io/Table_Forge/",
    category: "my_works",
    rank: 1,
    description: "个人项目：Markdown表格转换工具",
    archived: false
  },
  {
    name: "车险经营分析周报",
    url: "https://autinsight.web.app/",
    category: "my_works",
    rank: 2,
    description: "个人项目：车险数据分析看板",
    archived: false
  }
]