import type { BookmarkCategory } from '@utils/bookmarkImporter'
import { BOOKMARK_DATA } from './bookmarks'

// 导出分类数据
export const categories = BOOKMARK_DATA.categories

// 导出分类结构（兼容旧代码）
export const CATEGORY_STRUCTURE = [
  {
    groupName: "📚 学习与知识",
    icon: "fa-solid fa-graduation-cap",
    items: categories.filter(cat =>
      ['读看', 'AI 笔记', '论文'].includes(cat.name)
    )
  },
  {
    groupName: "💻 开发与工具",
    icon: "fa-solid fa-code",
    items: categories.filter(cat =>
      ['开发', '工具', 'MCP商店'].includes(cat.name)
    )
  },
  {
    groupName: "🤖 AI 与搜索",
    icon: "fa-solid fa-brain",
    items: categories.filter(cat =>
      ['AI 对话', '搜索'].includes(cat.name)
    )
  },
  {
    groupName: "🏢 工作与业务",
    icon: "fa-solid fa-building",
    items: categories.filter(cat =>
      ['公司'].includes(cat.name)
    )
  },
  {
    groupName: "🎨 创意与设计",
    icon: "fa-solid fa-palette",
    items: categories.filter(cat =>
      ['新玩法', '艺术'].includes(cat.name)
    )
  },
  {
    groupName: "🚀 个人作品",
    icon: "fa-solid fa-star",
    items: categories.filter(cat =>
      ['我的作品'].includes(cat.name)
    )
  },
  {
    groupName: "📈 金融与投资",
    icon: "fa-solid fa-chart-line",
    items: categories.filter(cat =>
      ['投资'].includes(cat.name)
    )
  },
  {
    groupName: "🏛️ 政府与机构",
    icon: "fa-solid fa-university",
    items: categories.filter(cat =>
      ['政府网站'].includes(cat.name)
    )
  },
  {
    groupName: "🚗 汽车与交通",
    icon: "fa-solid fa-car",
    items: categories.filter(cat =>
      ['汽车'].includes(cat.name)
    )
  }
].filter(group => group.items.length > 0)

// 获取扁平化分类列表
export function getFlatCategories(): BookmarkCategory[] {
  return categories
}

// 获取分类颜色
export function getCategoryColor(categoryId: string): string {
  const category = categories.find(cat => cat.id === categoryId)
  return category?.color || '#6b7280'
}

// 获取分类图标
export function getCategoryIcon(categoryId: string): string {
  const category = categories.find(cat => cat.id === categoryId)
  return category?.icon || 'fa-folder'
}