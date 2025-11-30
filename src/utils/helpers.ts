/**
 * 通用工具函数
 * 提供常用的辅助功能
 */

import type { Asset, SmartParseResult } from '@types/index'

/**
 * URL 相关工具
 */
export class URLHelper {
  /**
   * 获取域名
   */
  static getDomain(url: string): string {
    try {
      return new URL(url).hostname.replace(/^www\./, '')
    } catch {
      return url
    }
  }

  /**
   * 获取 Favicon URL
   */
  static getFavicon(url: string, size = 64): string {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
    } catch {
      return 'https://via.placeholder.com/64?text=WEB'
    }
  }

  /**
   * 验证 URL 格式
   */
  static isValidURL(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * 规范化 URL
   */
  static normalizeURL(url: string): string {
    try {
      const urlObj = new URL(url)
      // 移除多余的路径和查询参数
      return urlObj.origin + urlObj.pathname
    } catch {
      return url
    }
  }
}

/**
 * 时间工具
 */
export class DateHelper {
  /**
   * 格式化时间
   */
  static formatTime(date: Date, locale = 'zh-CN'): string {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * 格式化日期
   */
  static formatDate(date: Date, locale = 'zh-CN'): string {
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  /**
   * 格式化相对时间
   */
  static formatRelativeTime(date: Date, locale = 'zh-CN'): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return '刚刚'
    if (diffMinutes < 60) return `${diffMinutes}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`

    return this.formatDate(date, locale)
  }

  /**
   * 生成时间戳ID
   */
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}

/**
 * 搜索工具
 */
export class SearchHelper {
  /**
   * 模糊搜索匹配
   */
  static fuzzyMatch(text: string, query: string): number {
    if (!query) return 1

    const textLower = text.toLowerCase()
    const queryLower = query.toLowerCase()

    // 完全匹配
    if (textLower === queryLower) return 1

    // 前缀匹配
    if (textLower.startsWith(queryLower)) return 0.8

    // 包含匹配
    if (textLower.includes(queryLower)) return 0.6

    // 模糊匹配
    let score = 0
    let queryIndex = 0

    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        score++
        queryIndex++
      }
    }

    return queryIndex === queryLower.length ? score / queryLower.length : 0
  }

  /**
   * 搜索资产
   */
  static searchAssets(assets: Asset[], query: string): Asset[] {
    if (!query.trim()) return assets

    const queryLower = query.toLowerCase()

    return assets
      .map(asset => ({
        asset,
        score: Math.max(
          this.fuzzyMatch(asset.name, query),
          this.fuzzyMatch(asset.description || '', query),
          this.fuzzyMatch(URLHelper.getDomain(asset.url), query)
        )
      }))
      .filter(item => item.score > 0.3) // 只返回相关性大于0.3的结果
      .sort((a, b) => b.score - a.score)
      .map(item => item.asset)
  }

  /**
   * 高亮搜索关键词
   */
  static highlightText(text: string, query: string): string {
    if (!query) return text

    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  private static escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
}

/**
 * 数据处理工具
 */
export class DataHelper {
  /**
   * 深拷贝对象
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
    if (obj instanceof Array) return obj.map(item => DataHelper.deepClone(item)) as unknown as T
    if (typeof obj === 'object') {
      const cloned = {} as T
      Object.keys(obj).forEach(key => {
        (cloned as any)[key] = DataHelper.deepClone((obj as any)[key])
      })
      return cloned
    }
    return obj
  }

  /**
   * 防抖函数
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  /**
   * 节流函数
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean
    return function executedFunction(...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  /**
   * 生成唯一ID
   */
  static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 数组去重
   */
  static unique<T>(array: T[], keyFn?: (item: T) => any): T[] {
    if (!keyFn) return [...new Set(array)]

    const seen = new Set()
    return array.filter(item => {
      const key = keyFn(item)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  /**
   * 分组数组
   */
  static groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const key = keyFn(item)
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
      return groups
    }, {} as Record<string, T[]>)
  }

  /**
   * 排序数组
   */
  static sortBy<T>(
    array: T[],
    keyFn: (item: T) => any,
    order: 'asc' | 'desc' = 'asc'
  ): T[] {
    return [...array].sort((a, b) => {
      const valA = keyFn(a)
      const valB = keyFn(b)

      if (valA < valB) return order === 'asc' ? -1 : 1
      if (valA > valB) return order === 'asc' ? 1 : -1
      return 0
    })
  }
}

/**
 * 错误处理工具
 */
export class ErrorHandler {
  /**
   * 创建错误对象
   */
  static createError(
    type: string,
    message: string,
    originalError?: Error,
    context?: Record<string, any>
  ): Error {
    const error = new Error(message)
    ;(error as any).type = type
    ;(error as any).originalError = originalError
    ;(error as any).context = context
    ;(error as any).timestamp = new Date()
    return error
  }

  /**
   * 安全执行函数
   */
  static safeExecute<T>(
    fn: () => T,
    fallback: T,
    onError?: (error: Error) => void
  ): T {
    try {
      return fn()
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      onError?.(errorObj)
      return fallback
    }
  }

  /**
   * 异步安全执行
   */
  static async safeExecuteAsync<T>(
    fn: () => Promise<T>,
    fallback: T,
    onError?: (error: Error) => void
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      onError?.(errorObj)
      return fallback
    }
  }
}

/**
 * 图像处理工具
 */
export class ImageHelper {
  /**
   * 处理图片加载错误
   */
  static handleImageError(
    event: Event,
    fallbackUrl?: string
  ): void {
    const img = event.target as HTMLImageElement
    const defaultFallback = this.generateDefaultIcon()
    img.src = fallbackUrl || defaultFallback
    img.onerror = null // 防止无限循环
  }

  /**
   * 生成默认图标
   */
  static generateDefaultIcon(size = 64): string {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e1" width="${size}" height="${size}">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    `
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  /**
   * 懒加载图片
   */
  static lazyLoadImage(
    img: HTMLImageElement,
    src: string,
    placeholder?: string
  ): void {
    img.src = placeholder || this.generateDefaultIcon(32)

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLImageElement
          target.src = src
          observer.unobserve(target)
        }
      })
    })

    observer.observe(img)
  }
}

/**
 * 设备检测工具
 */
export class DeviceHelper {
  /**
   * 检测移动设备
   */
  static isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  /**
   * 检测触摸设备
   */
  static isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  /**
   * 获取设备类型
   */
  static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }
}

/**
 * 智能解析工具
 */
export class SmartParser {
  /**
   * 从文本中解析URL
   */
  static extractUrls(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.match(urlRegex) || []
  }

  /**
   * 从URL中提取网站名称
   */
  static extractSiteName(url: string): string {
    try {
      const domain = new URL(url).hostname
      const parts = domain.split('.')
      const mainDomain = parts[parts.length - 2]
      return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1)
    } catch {
      return 'Unknown'
    }
  }

  /**
   * 智能解析文本内容
   */
  static parseText(text: string): SmartParseResult {
    const urls = this.extractUrls(text)
    const url = urls[0] || ''

    let name = ''

    // 尝试从文本中提取名称
    if (urls.length === 1) {
      // 如果只有一个URL，移除URL后剩余文本作为名称
      name = text.replace(urls[0], '').trim()
    }

    if (!name) {
      // 使用域名作为名称
      name = this.extractSiteName(url) || 'Untitled'
    }

    return {
      asset: {
        name: name.substring(0, 50), // 限制长度
        url,
        category: 'tool_office', // 默认分类
        rank: 99,
        archived: false
      },
      confidence: url ? 0.8 : 0.3,
      originalText: text
    }
  }
}