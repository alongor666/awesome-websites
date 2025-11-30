/**
 * 分类体系数据
 * MECE 原则分类 v6.0
 */

import type { CategoryGroup } from '@types/index'

export const CATEGORY_STRUCTURE: CategoryGroup[] = [
  {
    id: 'executive',
    groupName: '🏛️ 经营决策 (Executive)',
    icon: 'fa-solid fa-briefcase',
    description: '企业运营和管理相关的核心系统',
    items: [
      {
        id: 'biz_ops',
        name: '内部协同 & 系统',
        color: '#2563eb',
        description: '企业内部协作工具和业务系统',
        icon: 'fa-solid fa-users',
        sort: 1
      },
      {
        id: 'biz_data',
        name: 'BI 报表 & 监控',
        color: '#dc2626',
        description: '数据分析和商业智能工具',
        icon: 'fa-solid fa-chart-line',
        sort: 2
      },
      {
        id: 'biz_ext',
        name: '监管 & 市场情报',
        color: '#b91c1c',
        description: '外部监管信息和市场数据',
        icon: 'fa-solid fa-shield-halved',
        sort: 3
      }
    ]
  },
  {
    id: 'ai_matrix',
    groupName: '🧠 智能体 (AI Matrix)',
    icon: 'fa-solid fa-brain',
    description: '人工智能工具和服务生态',
    items: [
      {
        id: 'ai_chat',
        name: '前沿 SOTA 模型',
        color: '#8b5cf6',
        description: '国际领先的AI对话模型',
        icon: 'fa-solid fa-comments',
        sort: 1
      },
      {
        id: 'ai_cn',
        name: '国产大模型',
        color: '#7c3aed',
        description: '中国本土AI大模型平台',
        icon: 'fa-solid fa-dragon',
        sort: 2
      },
      {
        id: 'ai_search',
        name: 'Deep Search & Agent',
        color: '#6d28d9',
        description: '智能搜索和AI代理工具',
        icon: 'fa-solid fa-search',
        sort: 3
      }
    ]
  },
  {
    id: 'dev_studio',
    groupName: '⚙️ 开发者 (Dev Studio)',
    icon: 'fa-solid fa-code',
    description: '软件开发和技术基础设施',
    items: [
      {
        id: 'dev_ide',
        name: '云端 IDE & 辅助',
        color: '#10b981',
        description: '在线开发环境和编程助手',
        icon: 'fa-solid fa-laptop-code',
        sort: 1
      },
      {
        id: 'dev_api',
        name: '模型 API 管理',
        color: '#059669',
        description: 'API服务管理和监控',
        icon: 'fa-solid fa-plug',
        sort: 2
      },
      {
        id: 'dev_infra',
        name: '全栈云基建',
        color: '#047857',
        description: '云服务和基础设施',
        icon: 'fa-solid fa-cloud',
        sort: 3
      },
      {
        id: 'dev_mcp',
        name: 'MCP 生态协议',
        color: '#065f46',
        description: 'Model Context Protocol 生态系统',
        icon: 'fa-solid fa-link',
        sort: 4
      }
    ]
  },
  {
    id: 'creative',
    groupName: '🎨 创意流 (Creative)',
    icon: 'fa-solid fa-palette',
    description: '创意设计和多媒体工具',
    items: [
      {
        id: 'create_vision',
        name: '视觉 & 视频流',
        color: '#f59e0b',
        description: '图像生成和视频创作工具',
        icon: 'fa-solid fa-image',
        sort: 1
      },
      {
        id: 'create_design',
        name: '交互 & 可视化',
        color: '#d97706',
        description: '交互设计和数据可视化',
        icon: 'fa-solid fa-pencil-ruler',
        sort: 2
      }
    ]
  },
  {
    id: 'knowledge',
    groupName: '📚 知识体系 (Knowledge)',
    icon: 'fa-solid fa-graduation-cap',
    description: '知识管理和学习资源',
    items: [
      {
        id: 'know_research',
        name: '学术科研 (Research)',
        color: '#0f172a',
        description: '学术研究和论文资源',
        icon: 'fa-solid fa-microscope',
        sort: 1
      },
      {
        id: 'know_mgmt',
        name: '第二大脑 (Notes)',
        color: '#334155',
        description: '知识管理和笔记系统',
        icon: 'fa-solid fa-brain',
        sort: 2
      },
      {
        id: 'know_learn',
        name: '终身学习 (Edu)',
        color: '#475569',
        description: '在线学习和教育资源',
        icon: 'fa-solid fa-book',
        sort: 3
      },
      {
        id: 'know_ref',
        name: '参考资料 (Ref)',
        color: '#64748b',
        description: '工具书和参考资料',
        icon: 'fa-solid fa-bookmark',
        sort: 4
      }
    ]
  },
  {
    id: 'infrastructure',
    groupName: '🛠️ 效能基建 (Infrastructure)',
    icon: 'fa-solid fa-screwdriver-wrench',
    description: '效率工具和基础设施',
    items: [
      {
        id: 'tool_collab',
        name: '协同通讯 (Collab)',
        color: '#2563eb',
        description: '团队协作和通讯工具',
        icon: 'fa-solid fa-people-arrows',
        sort: 1
      },
      {
        id: 'tool_office',
        name: '办公与数据 (Office)',
        color: '#0ea5e9',
        description: '办公软件和数据处理',
        icon: 'fa-solid fa-file-alt',
        sort: 2
      },
      {
        id: 'tool_net',
        name: '网络与账户 (Net)',
        color: '#6366f1',
        description: '网络工具和账户管理',
        icon: 'fa-solid fa-globe',
        sort: 3
      },
      {
        id: 'my_works',
        name: '个人发布 (Deploy)',
        color: '#ec4899',
        description: '个人项目和作品展示',
        icon: 'fa-solid fa-rocket',
        sort: 4
      }
    ]
  }
]

/**
 * 获取所有分类（扁平化）
 */
export function getFlatCategories() {
  return CATEGORY_STRUCTURE.flatMap(group => group.items)
}

/**
 * 根据ID获取分类
 */
export function getCategoryById(categoryId: string) {
  return getFlatCategories().find(cat => cat.id === categoryId)
}

/**
 * 根据分组ID获取分组
 */
export function getGroupById(groupId: string) {
  return CATEGORY_STRUCTURE.find(group => group.id === groupId)
}

/**
 * 获取分类颜色
 */
export function getCategoryColor(categoryId: string): string {
  const category = getCategoryById(categoryId)
  return category?.color || '#94a3b8'
}

/**
 * 搜索分类
 */
export function searchCategories(query: string) {
  const lowercaseQuery = query.toLowerCase()
  return getFlatCategories().filter(cat =>
    cat.name.toLowerCase().includes(lowercaseQuery) ||
    cat.description?.toLowerCase().includes(lowercaseQuery)
  )
}