/**
 * 书签状态管理
 * 使用 Pinia 进行状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Bookmark } from '@utils/bookmarkImporter'
import { BOOKMARK_DATA, getFlatCategories } from '@data/bookmarks'
import { storage } from '@utils/storage'
import { SearchHelper } from '@utils/helpers'

const STORAGE_KEY = 'ahlong_bookmarks_v6'

/**
 * 书签管理状态
 */
export const useAssetsStore = defineStore('assets', () => {
  // 状态
  const bookmarks = ref<Bookmark[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const currentFilter = ref('all')

  // 初始化
  const init = () => {
    loading.value = true
    error.value = null

    try {
      // 从存储加载数据
      const stored = storage.getItem(STORAGE_KEY)

      if (stored) {
        const localBookmarks = JSON.parse(stored) as Bookmark[]
        const localBookmarkMap = new Map(localBookmarks.map(b => [b.id, b]))

        // 合并本地存储和预定义的书签数据
        const mergedBookmarks: Bookmark[] = []

        // 添加预定义的书签
        BOOKMARK_DATA.bookmarks.forEach(predefinedBookmark => {
          const localBookmark = localBookmarkMap.get(predefinedBookmark.id)
          mergedBookmarks.push({
            ...predefinedBookmark,
            ...(localBookmark || {})
          })
        })

        // 添加本地独有的书签
        localBookmarks.forEach(localBookmark => {
          const predefinedExists = BOOKMARK_DATA.bookmarks.some(pb => pb.id === localBookmark.id)
          if (!predefinedExists) {
            mergedBookmarks.push(localBookmark)
          }
        })

        bookmarks.value = mergedBookmarks
      } else {
        // 使用预定义数据
        bookmarks.value = BOOKMARK_DATA.bookmarks
        saveToStorage()
      }
    } catch (err) {
      console.error('Failed to load bookmarks:', err)
      error.value = '加载书签失败'
      bookmarks.value = BOOKMARK_DATA.bookmarks
    } finally {
      loading.value = false
    }
  }

  // 保存到本地存储
  const saveToStorage = () => {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(bookmarks.value))
    } catch (err) {
      console.error('Failed to save bookmarks:', err)
    }
  }

  // 计算属性
  const categories = computed(() => BOOKMARK_DATA.categories)

  const bookmarksCount = computed(() => bookmarks.value.length)

  const bookmarksByCategory = computed(() => {
    const grouped: Record<string, Bookmark[]> = {}
    bookmarks.value.forEach(bookmark => {
      const category = bookmark.category || 'uncategorized'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(bookmark)
    })
    return grouped
  })

  // 搜索和过滤
  const displayBookmarks = computed(() => {
    let result = bookmarks.value
    const query = searchQuery.value.toLowerCase().trim()

    // 搜索过滤
    if (query) {
      result = SearchHelper.search(result, query, ['title', 'url', 'tags'])
    } else if (currentFilter.value !== 'all') {
      // 分类过滤
      result = result.filter(bookmark => bookmark.category === currentFilter.value)
    }

    // 按标题排序
    return result.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
  })

  const displayBookmarksGrouped = computed(() => {
    if (currentFilter.value !== 'all' || searchQuery.value) {
      return {}
    }

    const grouped: Record<string, Bookmark[]> = {}
    categories.value.forEach(category => {
      const categoryBookmarks = bookmarks.value.filter(b => b.category === category.id)
      if (categoryBookmarks.length > 0) {
        grouped[category.name] = categoryBookmarks.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
      }
    })

    return grouped
  })

  // 获取分类图标和颜色
  const getCategoryIcon = (categoryId: string) => {
    const category = categories.value.find(c => c.id === categoryId)
    return category?.icon || 'fa-folder'
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.value.find(c => c.id === categoryId)
    return category?.color || '#6b7280'
  }

  // 获取分类名称
  const getCategoryName = (categoryId: string) => {
    const category = categories.value.find(c => c.id === categoryId)
    return category?.name || '未分类'
  }

  // 获取分类书签数量
  const getBookmarkCountByCategory = (categoryId: string) => {
    return bookmarks.value.filter(b => b.category === categoryId).length
  }

  // 获取 favicon
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    } catch {
      return 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23cbd5e1\'%3E%3Cpath d=\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z\'/%3E%3C/svg%3E'
    }
  }

  // 获取域名
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  // 操作方法
  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark: Bookmark = {
      id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      ...bookmark
    }

    bookmarks.value.push(newBookmark)
    saveToStorage()
    return newBookmark
  }

  const updateBookmark = (id: string, updates: Partial<Bookmark>) => {
    const index = bookmarks.value.findIndex(b => b.id === id)
    if (index !== -1) {
      bookmarks.value[index] = { ...bookmarks.value[index], ...updates }
      saveToStorage()
    }
  }

  const deleteBookmark = (id: string) => {
    bookmarks.value = bookmarks.value.filter(b => b.id !== id)
    saveToStorage()
  }

  const visitBookmark = (bookmark: Bookmark) => {
    // 更新访问时间（可选）
    updateBookmark(bookmark.id, { lastVisited: new Date() })
    // 打开链接
    window.open(bookmark.url, '_blank')
  }

  const setCurrentFilter = (filter: string) => {
    currentFilter.value = filter
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const importBookmarks = (importedBookmarks: Bookmark[]) => {
    // 去重并合并
    const existingUrls = new Set(bookmarks.value.map(b => b.url))
    const newBookmarks = importedBookmarks.filter(b => !existingUrls.has(b.url))

    bookmarks.value = [...bookmarks.value, ...newBookmarks]
    saveToStorage()

    return {
      total: importedBookmarks.length,
      added: newBookmarks.length,
      duplicates: importedBookmarks.length - newBookmarks.length
    }
  }

  const exportBookmarks = () => {
    return JSON.stringify(bookmarks.value, null, 2)
  }

  const resetToDefault = () => {
    bookmarks.value = BOOKMARK_DATA.bookmarks
    saveToStorage()
  }

  // 获取统计信息
  const getStats = () => {
    const categoryStats = categories.value.map(category => ({
      id: category.id,
      name: category.name,
      count: getBookmarkCountByCategory(category.id),
      color: category.color,
      icon: category.icon
    }))

    const tagStats: Record<string, number> = {}
    bookmarks.value.forEach(bookmark => {
      bookmark.tags.forEach(tag => {
        tagStats[tag] = (tagStats[tag] || 0) + 1
      })
    })

    return {
      totalBookmarks: bookmarks.value.length,
      totalCategories: categories.value.length,
      categoryStats,
      tagStats: Object.entries(tagStats).sort(([, a], [, b]) => b - a)
    }
  }

  return {
    // 状态
    bookmarks,
    loading,
    error,
    searchQuery,
    currentFilter,

    // 计算属性
    categories,
    bookmarksCount,
    bookmarksByCategory,
    displayBookmarks,
    displayBookmarksGrouped,

    // 方法
    init,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    visitBookmark,
    setCurrentFilter,
    setSearchQuery,
    importBookmarks,
    exportBookmarks,
    resetToDefault,
    getStats,

    // 辅助方法
    getCategoryIcon,
    getCategoryColor,
    getCategoryName,
    getBookmarkCountByCategory,
    getFavicon,
    getDomain
  }
})