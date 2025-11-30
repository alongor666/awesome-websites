/**
 * 应用全局状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppState, ThemeConfig, UserPreferences } from '@types/index'
import { storage } from '@utils/storage'
import { DeviceHelper, DataHelper } from '@utils/helpers'

/**
 * 应用状态管理
 */
export const useAppStore = defineStore('app', () => {
  // 默认主题配置
  const defaultTheme: ThemeConfig = {
    mode: 'light',
    primaryColor: '#007aff',
    sidebarWidth: 256,
    animationsEnabled: true
  }

  // 默认用户偏好
  const defaultPreferences: UserPreferences = {
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    pageSize: 20,
    autoSaveInterval: 30,
    defaultViewMode: 'grid'
  }

  // 默认应用状态
  const defaultState: AppState = {
    currentFilter: 'all',
    searchQuery: '',
    viewMode: 'grid',
    sidebarCollapsed: false,
    theme: defaultTheme,
    preferences: defaultPreferences
  }

  // 状态
  const currentFilter = ref<AppState['currentFilter']>('all')
  const searchQuery = ref<AppState['searchQuery']>('')
  const viewMode = ref<AppState['viewMode']>('grid')
  const sidebarCollapsed = ref<AppState['sidebarCollapsed']>(false)
  const theme = ref<ThemeConfig>(defaultTheme)
  const preferences = ref<UserPreferences>(defaultPreferences)
  const currentTime = ref(new Date())
  const isLoading = ref(false)
  const notifications = ref<Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: Date
    read: boolean
  }>>([])

  // 计算属性
  const isDarkMode = computed(() => {
    if (theme.value.mode === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme.value.mode === 'dark'
  })

  const deviceType = computed(() => DeviceHelper.getDeviceType())
  const isMobile = computed(() => deviceType.value === 'mobile')
  const isTablet = computed(() => deviceType.value === 'tablet')
  const isDesktop = computed(() => deviceType.value === 'desktop')

  const unreadNotifications = computed(() =>
    notifications.value.filter(n => !n.read)
  )

  const formattedTime = computed(() => {
    return currentTime.value.toLocaleTimeString(preferences.value.language, {
      hour: '2-digit',
      minute: '2-digit'
    })
  })

  /**
   * 设置过滤器
   */
  const setFilter = (filter: string) => {
    currentFilter.value = filter
    saveState()
  }

  /**
   * 设置搜索查询
   */
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  /**
   * 清除搜索
   */
  const clearSearch = () => {
    searchQuery.value = ''
  }

  /**
   * 设置视图模式
   */
  const setViewMode = (mode: AppState['viewMode']) => {
    viewMode.value = mode
    preferences.value.defaultViewMode = mode
    saveState()
  }

  /**
   * 切换侧边栏
   */
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    saveState()
  }

  /**
   * 设置侧边栏状态
   */
  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
    saveState()
  }

  /**
   * 更新主题
   */
  const updateTheme = (updates: Partial<ThemeConfig>) => {
    theme.value = { ...theme.value, ...updates }
    applyTheme()
    saveState()
  }

  /**
   * 切换主题模式
   */
  const toggleTheme = () => {
    const newMode = theme.value.mode === 'light' ? 'dark' : 'light'
    updateTheme({ mode: newMode })
  }

  /**
   * 应用主题到 DOM
   */
  const applyTheme = () => {
    const root = document.documentElement

    if (isDarkMode.value) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }

    // 设置 CSS 变量
    root.style.setProperty('--primary-color', theme.value.primaryColor)
    root.style.setProperty('--sidebar-width', `${theme.value.sidebarWidth}px`)
    root.style.setProperty('--animations-enabled', theme.value.animationsEnabled ? '1' : '0')
  }

  /**
   * 更新用户偏好
   */
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    preferences.value = { ...preferences.value, ...updates }
    saveState()
  }

  /**
   * 添加通知
   */
  const addNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    duration = 5000
  ) => {
    const notification = {
      id: DateHelper.generateId(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false
    }

    notifications.value.unshift(notification)

    // 自动移除通知
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, duration)
    }

    // 限制通知数量
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50)
    }
  }

  /**
   * 移除通知
   */
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  /**
   * 标记通知为已读
   */
  const markNotificationRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  /**
   * 标记所有通知为已读
   */
  const markAllNotificationsRead = () => {
    notifications.value.forEach(n => {
      n.read = true
    })
  }

  /**
   * 清除所有通知
   */
  const clearNotifications = () => {
    notifications.value = []
  }

  /**
   * 更新当前时间
   */
  const updateCurrentTime = () => {
    currentTime.value = new Date()
  }

  /**
   * 设置加载状态
   */
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  /**
   * 显示成功消息
   */
  const showSuccess = (title: string, message?: string) => {
    addNotification('success', title, message || '')
  }

  /**
   * 显示错误消息
   */
  const showError = (title: string, message?: string) => {
    addNotification('error', title, message || '')
  }

  /**
   * 显示警告消息
   */
  const showWarning = (title: string, message?: string) => {
    addNotification('warning', title, message || '')
  }

  /**
   * 显示信息消息
   */
  const showInfo = (title: string, message?: string) => {
    addNotification('info', title, message || '')
  }

  /**
   * 保存状态到本地存储
   */
  const saveState = async () => {
    try {
      const state = {
        currentFilter: currentFilter.value,
        viewMode: viewMode.value,
        sidebarCollapsed: sidebarCollapsed.value,
        theme: theme.value,
        preferences: preferences.value
      }

      await storage.saveCategories(state)
    } catch (error) {
      console.error('保存状态失败:', error)
    }
  }

  /**
   * 从本地存储加载状态
   */
  const loadState = async () => {
    try {
      const stored = await storage.getCategories()

      if (stored) {
        currentFilter.value = stored.currentFilter || 'all'
        viewMode.value = stored.viewMode || 'grid'
        sidebarCollapsed.value = stored.sidebarCollapsed || false
        theme.value = { ...defaultTheme, ...stored.theme }
        preferences.value = { ...defaultPreferences, ...stored.preferences }

        // 移动端自动收起侧边栏
        if (DeviceHelper.isMobile()) {
          sidebarCollapsed.value = true
        }
      }

      applyTheme()
    } catch (error) {
      console.error('加载状态失败:', error)
      // 使用默认状态
      applyTheme()
    }
  }

  /**
   * 重置所有设置
   */
  const resetSettings = async () => {
    currentFilter.value = defaultState.currentFilter
    searchQuery.value = defaultState.searchQuery
    viewMode.value = defaultState.viewMode
    sidebarCollapsed.value = defaultState.sidebarCollapsed
    theme.value = { ...defaultTheme }
    preferences.value = { ...defaultPreferences }

    applyTheme()
    await saveState()
  }

  /**
   * 获取当前页面的标题
   */
  const getCurrentPageTitle = computed(() => {
    if (currentFilter.value === 'all') {
      return '全局资产全景'
    }
    return '分类视图'
  })

  /**
   * 初始化应用
   */
  const initializeApp = async () => {
    try {
      setLoading(true)

      // 加载状态
      await loadState()

      // 设置时钟
      updateCurrentTime()
      setInterval(updateCurrentTime, 1000)

      // 监听系统主题变化
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (theme.value.mode === 'auto') {
          applyTheme()
        }
      })

      // 监听窗口大小变化
      window.addEventListener('resize', DataHelper.debounce(() => {
        // 移动端适配
        if (DeviceHelper.isMobile()) {
          sidebarCollapsed.value = true
        }
      }, 250))

      // 恢复未读通知
      showInfo('欢迎使用', '应用初始化完成')

    } catch (error) {
      console.error('应用初始化失败:', error)
      showError('初始化失败', '应用初始化过程中发生错误')
    } finally {
      setLoading(false)
    }
  }

  return {
    // 状态
    currentFilter,
    searchQuery,
    viewMode,
    sidebarCollapsed,
    theme,
    preferences,
    currentTime,
    isLoading,
    notifications,

    // 计算属性
    isDarkMode,
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    unreadNotifications,
    formattedTime,
    getCurrentPageTitle,

    // 方法
    setFilter,
    setSearchQuery,
    clearSearch,
    setViewMode,
    toggleSidebar,
    setSidebarCollapsed,
    updateTheme,
    toggleTheme,
    applyTheme,
    updatePreferences,
    addNotification,
    removeNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    updateCurrentTime,
    setLoading,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    saveState,
    loadState,
    resetSettings,
    initializeApp
  }
})

/**
 * 日期工具函数（辅助函数）
 */
const DateHelper = {
  generateId: () => Date.now().toString(36) + Math.random().toString(36).substr(2)
}