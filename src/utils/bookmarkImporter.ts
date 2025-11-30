/**
 * 书签导入工具
 * 用于解析浏览器导出的 HTML 书签文件
 */

export interface Bookmark {
  id: string
  title: string
  url: string
  category: string
  subcategory?: string
  favicon?: string
  description?: string
  createdAt: Date
  tags: string[]
}

export interface BookmarkCategory {
  id: string
  name: string
  parentId?: string
  icon?: string
  color?: string
  order: number
}

export interface ParsedBookmarks {
  categories: BookmarkCategory[]
  bookmarks: Bookmark[]
}

/**
 * 解析浏览器书签 HTML 文件
 */
export function parseBookmarksHTML(htmlContent: string): ParsedBookmarks {
  const categories: BookmarkCategory[] = []
  const bookmarks: Bookmark[] = []

  // 创建一个 ID 生成器
  let idCounter = 1
  const generateId = () => `bookmark_${idCounter++}`

  // 解析分类和书签
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')

  // 查找所有的 H3 标题（分类）
  const headers = doc.querySelectorAll('h3')
  const categoryMap = new Map<string, BookmarkCategory>()
  let currentCategory: BookmarkCategory | null = null
  let subcategoryMap = new Map<string, BookmarkCategory>()

  headers.forEach((header, index) => {
    const categoryName = header.textContent?.trim()
    if (!categoryName || categoryName === '书签栏' || categoryName === 'API key') return

    const category: BookmarkCategory = {
      id: generateId(),
      name: categoryName,
      icon: getCategoryIcon(categoryName),
      color: getCategoryColor(categoryName),
      order: index
    }

    categories.push(category)
    categoryMap.set(categoryName, category)
  })

  // 查找所有的链接
  const links = doc.querySelectorAll('a[href]')
  links.forEach(link => {
    const url = link.getAttribute('href')
    const title = link.textContent?.trim()

    if (!url || !title) return

    // 跳过无效链接
    if (url === 'javascript:' || !url.startsWith('http')) return

    // 查找所属分类
    let currentHeader = link.closest('dl')?.previousElementSibling
    while (currentHeader) {
      if (currentHeader.tagName === 'DT' && currentHeader.querySelector('h3')) {
        break
      }
      currentHeader = currentHeader.previousElementSibling
    }

    let categoryName = '未分类'
    let subcategoryName: string | undefined

    if (currentHeader) {
      const h3 = currentHeader.querySelector('h3')
      if (h3) {
        categoryName = h3.textContent?.trim() || '未分类'

        // 查找子分类
        const parentDL = currentHeader.closest('dl')?.parentElement
        const parentHeader = parentDL?.previousElementSibling
        if (parentHeader?.tagName === 'DT' && parentHeader.querySelector('h3')) {
          const parentH3 = parentHeader.querySelector('h3')
          const parentCategoryName = parentH3?.textContent?.trim()
          if (parentCategoryName && parentCategoryName !== categoryName && parentCategoryName !== '书签栏') {
            subcategoryName = categoryName
            categoryName = parentCategoryName
          }
        }
      }
    }

    const category = categoryMap.get(categoryName)
    const bookmark: Bookmark = {
      id: generateId(),
      title: cleanTitle(title),
      url: cleanUrl(url),
      category: category?.id || 'uncategorized',
      subcategory: subcategoryName,
      favicon: extractFavicon(url),
      description: '',
      createdAt: new Date(),
      tags: extractTags(title, url)
    }

    bookmarks.push(bookmark)
  })

  return {
    categories,
    bookmarks
  }
}

/**
 * 清理标题
 */
function cleanTitle(title: string): string {
  return title
    .replace(/^\s+|\s+$/g, '') // 去除首尾空格
    .replace(/\s+/g, ' ') // 合并多个空格
    .substring(0, 100) // 限制长度
}

/**
 * 清理 URL
 */
function cleanUrl(url: string): string {
  try {
    // 移除常见的追踪参数
    const cleanUrl = new URL(url)
    const paramsToRemove = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'share_token', 'tt_from', 'spm', 'from', 'source'
    ]

    paramsToRemove.forEach(param => {
      cleanUrl.searchParams.delete(param)
    })

    return cleanUrl.toString()
  } catch {
    return url
  }
}

/**
 * 提取 favicon URL
 */
function extractFavicon(url: string): string {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return 'https://via.placeholder.com/64?text=WEB'
  }
}

/**
 * 提取标签
 */
function extractTags(title: string, url: string): string[] {
  const tags: string[] = []
  const titleLower = title.toLowerCase()
  const urlLower = url.toLowerCase()

  // 基于标题的关键词提取
  const keywordTags = {
    'ai': ['AI', '人工智能', '智能'],
    '开发': ['开发', 'Dev', 'API', 'SDK', 'GitHub'],
    '设计': ['设计', 'Design', 'UI', 'UX', 'Figma'],
    '文档': ['文档', 'Doc', '文档中心', '文档库'],
    '工具': ['工具', 'Tool', '工具箱', '在线工具'],
    '管理': ['管理', 'Manage', '系统', '平台'],
    '学习': ['学习', '教程', '课程', '培训'],
    '云服务': ['云', 'Cloud', '服务器', 'AWS', '阿里云', '腾讯云'],
    '社交媒体': ['微信', 'QQ', '社交媒体', '公众号'],
    '新闻': ['新闻', '资讯', 'News'],
    '视频': ['视频', 'Video', 'YouTube', 'B站'],
    '购物': ['购物', '商城', 'Shop'],
    '金融': ['金融', '银行', '投资', '股票']
  }

  Object.entries(keywordTags).forEach(([tag, keywords]) => {
    if (keywords.some(keyword =>
      titleLower.includes(keyword.toLowerCase()) ||
      urlLower.includes(keyword.toLowerCase())
    )) {
      tags.push(tag)
    }
  })

  return [...new Set(tags)] // 去重
}

/**
 * 根据分类名称获取图标
 */
function getCategoryIcon(categoryName: string): string {
  const iconMap: Record<string, string> = {
    'AI 笔记': 'fa-brain',
    '开发': 'fa-code',
    '工具': 'fa-tools',
    '搜索': 'fa-search',
    'AI 对话': 'fa-comments',
    '公司': 'fa-building',
    '新玩法': 'fa-magic',
    '我的作品': 'fa-star',
    '编程': 'fa-laptop-code',
    '投资': 'fa-chart-line',
    '备用': 'fa-archive',
    '政府网站': 'fa-university',
    'MCP商店': 'fa-store',
    '论文': 'fa-graduation-cap',
    '艺术': 'fa-palette',
    '汽车': 'fa-car',
    '读看': 'fa-book'
  }

  return iconMap[categoryName] || 'fa-folder'
}

/**
 * 根据分类名称获取颜色
 */
function getCategoryColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    'AI 笔记': '#8b5cf6',
    '开发': '#10b981',
    '工具': '#f59e0b',
    '搜索': '#3b82f6',
    'AI 对话': '#ec4899',
    '公司': '#6b7280',
    '新玩法': '#14b8a6',
    '我的作品': '#f97316',
    '编程': '#0ea5e9',
    '投资': '#22c55e',
    '备用': '#94a3b8',
    '政府网站': '#dc2626',
    'MCP商店': '#a855f7',
    '论文': '#475569',
    '艺术': '#d946ef',
    '汽车': '#0891b2',
    '读看': '#eab308'
  }

  return colorMap[categoryName] || '#6b7280'
}

/**
 * 合并重复的书签
 */
export function deduplicateBookmarks(bookmarks: Bookmark[]): Bookmark[] {
  const seen = new Map<string, Bookmark>()

  bookmarks.forEach(bookmark => {
    const key = `${bookmark.url}_${bookmark.title.toLowerCase()}`
    if (!seen.has(key)) {
      seen.set(key, bookmark)
    }
  })

  return Array.from(seen.values())
}

/**
 * 按分类统计书签数量
 */
export function getBookmarkStats(bookmarks: Bookmark[], categories: BookmarkCategory[]): Record<string, number> {
  const stats: Record<string, number> = {}

  // 初始化所有分类的计数
  categories.forEach(category => {
    stats[category.id] = 0
  })

  // 统计书签
  bookmarks.forEach(bookmark => {
    if (bookmark.category) {
      stats[bookmark.category] = (stats[bookmark.category] || 0) + 1
    }
  })

  return stats
}