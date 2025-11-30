<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <h2 class="page-title">{{ currentPageTitle }}</h2>
        <div class="divider"></div>

        <!-- 搜索框 -->
        <div class="search-container">
          <div class="search-icon">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜索 (⌘K)"
            @keydown.cmd.k.prevent="clearSearch"
            @input="onSearchInput"
          />
          <button
            v-if="searchQuery"
            class="search-clear"
            @click="clearSearch"
            title="清除搜索"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <div class="header-right">
        <!-- 时间显示 -->
        <div class="time-display" :title="currentTime.toLocaleString()">
          {{ formattedTime }}
        </div>

        <!-- 通知图标 -->
        <div class="notification-wrapper">
          <button
            class="notification-button"
            @click="toggleNotifications"
            :class="{ 'has-unread': unreadCount > 0 }"
            title="通知"
          >
            <i class="fa-solid fa-bell"></i>
            <span v-if="unreadCount > 0" class="notification-badge">
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </button>

          <!-- 通知面板 -->
          <div v-if="showNotifications" class="notification-panel">
            <div class="notification-header">
              <h3>通知</h3>
              <button @click="markAllAsRead" class="mark-all-read">
                全部已读
              </button>
            </div>

            <div class="notification-list">
              <div
                v-for="notification in notifications.slice(0, 10)"
                :key="notification.id"
                class="notification-item"
                :class="{ 'unread': !notification.read, [notification.type]: true }"
                @click="markAsRead(notification.id)"
              >
                <div class="notification-icon">
                  <i :class="getNotificationIcon(notification.type)"></i>
                </div>
                <div class="notification-content">
                  <div class="notification-title">{{ notification.title }}</div>
                  <div class="notification-message">{{ notification.message }}</div>
                  <div class="notification-time">
                    {{ formatRelativeTime(notification.timestamp) }}
                  </div>
                </div>
                <button
                  class="notification-close"
                  @click.stop="removeNotification(notification.id)"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <div v-if="notifications.length === 0" class="notification-empty">
              <i class="fa-solid fa-bell-slash"></i>
              <p>暂无通知</p>
            </div>

            <div class="notification-footer">
              <button @click="clearAllNotifications" class="clear-all">
                清除全部
              </button>
            </div>
          </div>
        </div>

        <!-- 设置按钮 -->
        <button class="settings-button" @click="openSettings" title="设置">
          <i class="fa-solid fa-gear"></i>
        </button>

        <!-- 用户菜单 -->
        <div class="user-menu">
          <button class="user-button" @click="toggleUserMenu">
            <div class="user-avatar">
              <i class="fa-solid fa-user"></i>
            </div>
            <i class="fa-solid fa-chevron-down"></i>
          </button>

          <div v-if="showUserMenu" class="user-panel">
            <div class="user-info">
              <div class="user-avatar-large">
                <i class="fa-solid fa-user"></i>
              </div>
              <div class="user-details">
                <div class="user-name">阿龙</div>
                <div class="user-role">专业版用户</div>
              </div>
            </div>

            <div class="user-actions">
              <button @click="exportData" class="user-action">
                <i class="fa-solid fa-download"></i>
                导出数据
              </button>
              <button @click="importData" class="user-action">
                <i class="fa-solid fa-upload"></i>
                导入数据
              </button>
              <button @click="openHelp" class="user-action">
                <i class="fa-solid fa-question-circle"></i>
                帮助文档
              </button>
              <div class="user-divider"></div>
              <button @click="openAbout" class="user-action">
                <i class="fa-solid fa-info-circle"></i>
                关于应用
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@stores/app'
import { useAssetsStore } from '@stores/assets'
import { DateHelper, DeviceHelper } from '@utils/helpers'

const appStore = useAppStore()
const assetsStore = useAssetsStore()

// 响应式数据
const showNotifications = ref(false)
const showUserMenu = ref(false)
const searchInputTimeout = ref<number>()

// 计算属性
const searchQuery = computed({
  get: () => appStore.searchQuery,
  set: (value: string) => appStore.setSearchQuery(value)
})

const currentPageTitle = computed(() => appStore.getCurrentPageTitle)
const currentTime = computed(() => appStore.currentTime)
const formattedTime = computed(() => appStore.formattedTime)
const notifications = computed(() => appStore.notifications)
const unreadCount = computed(() => appStore.unreadNotifications.length)

// 方法
const clearSearch = () => {
  appStore.clearSearch()
  const searchInput = document.querySelector('.search-input') as HTMLInputElement
  searchInput?.focus()
}

const onSearchInput = () => {
  // 防抖处理
  clearTimeout(searchInputTimeout.value)
  searchInputTimeout.value = setTimeout(() => {
    // 搜索逻辑已通过 computed 属性处理
  }, 300)
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const markAsRead = (id: string) => {
  appStore.markNotificationRead(id)
}

const markAllAsRead = () => {
  appStore.markAllNotificationsRead()
}

const removeNotification = (id: string) => {
  appStore.removeNotification(id)
}

const clearAllNotifications = () => {
  appStore.clearNotifications()
  showNotifications.value = false
}

const getNotificationIcon = (type: string) => {
  const iconMap = {
    success: 'fa-solid fa-check-circle',
    error: 'fa-solid fa-exclamation-circle',
    warning: 'fa-solid fa-exclamation-triangle',
    info: 'fa-solid fa-info-circle'
  }
  return iconMap[type as keyof typeof iconMap] || 'fa-solid fa-info-circle'
}

const formatRelativeTime = (date: Date) => {
  return DateHelper.formatRelativeTime(date)
}

const openSettings = () => {
  // 打开设置模态框
  appStore.showInfo('设置', '设置功能开发中...')
}

const exportData = () => {
  try {
    const data = assetsStore.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ahlong-assets-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    appStore.showSuccess('导出成功', '数据已导出到本地文件')
  } catch (error) {
    appStore.showError('导出失败', (error as Error).message)
  }

  showUserMenu.value = false
}

const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'

  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      await assetsStore.importData(text)
      appStore.showSuccess('导入成功', '数据已成功导入')
    } catch (error) {
      appStore.showError('导入失败', (error as Error).message)
    }
  }

  input.click()
  showUserMenu.value = false
}

const openHelp = () => {
  appStore.showInfo('帮助', '帮助文档正在编写中...')
  showUserMenu.value = false
}

const openAbout = () => {
  appStore.showInfo('关于', '阿龙的数字化作战中心 v6.0 - 现代化书签管理工具')
  showUserMenu.value = false
}

// 生命周期
onMounted(() => {
  // 点击外部关闭下拉菜单
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element

    if (!target.closest('.notification-wrapper')) {
      showNotifications.value = false
    }

    if (!target.closest('.user-menu')) {
      showUserMenu.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  // 键盘快捷键
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.metaKey && event.key === 'k') {
      event.preventDefault()
      const searchInput = document.querySelector('.search-input') as HTMLInputElement
      searchInput?.focus()
    }
  }

  document.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
.app-header {
  height: 4rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 2rem;
  max-width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.page-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.divider {
  width: 1px;
  height: 1.5rem;
  background: #d1d5db;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 28rem;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.95);
  border-color: var(--primary-color, #007aff);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.search-clear {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s ease;
}

.search-clear:hover {
  color: #6b7280;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.time-display {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.notification-wrapper {
  position: relative;
}

.notification-button {
  position: relative;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.notification-button:hover {
  color: #374151;
  background: rgba(0, 0, 0, 0.05);
}

.notification-button.has-unread {
  color: var(--primary-color, #007aff);
}

.notification-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: #ef4444;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  min-width: 1rem;
  text-align: center;
}

.notification-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 20rem;
  max-height: 32rem;
  z-index: 50;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.notification-header h3 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.mark-all-read {
  background: none;
  border: none;
  color: var(--primary-color, #007aff);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background 0.2s ease;
}

.mark-all-read:hover {
  background: rgba(0, 122, 255, 0.1);
}

.notification-list {
  max-height: 20rem;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.notification-item.unread {
  background: rgba(59, 130, 246, 0.05);
}

.notification-item.success .notification-icon {
  color: #10b981;
}

.notification-item.error .notification-icon {
  color: #ef4444;
}

.notification-item.warning .notification-icon {
  color: #f59e0b;
}

.notification-item.info .notification-icon {
  color: #3b82f6;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.25rem;
}

.notification-message {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.625rem;
  color: #9ca3af;
}

.notification-close {
  background: none;
  border: none;
  color: #d1d5db;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.notification-close:hover {
  color: #9ca3af;
  background: rgba(0, 0, 0, 0.05);
}

.notification-empty {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

.notification-empty i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}

.notification-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
}

.clear-all {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background 0.2s ease;
}

.clear-all:hover {
  background: rgba(239, 68, 68, 0.1);
}

.settings-button {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.settings-button:hover {
  color: #374151;
  background: rgba(0, 0, 0, 0.05);
}

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background 0.2s ease;
}

.user-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
}

.user-button i.fa-chevron-down {
  font-size: 0.625rem;
  color: #9ca3af;
}

.user-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 16rem;
  z-index: 50;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.user-avatar-large {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.user-actions {
  padding: 0.5rem;
}

.user-action {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  background: none;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: background 0.2s ease;
}

.user-action:hover {
  background: rgba(0, 0, 0, 0.05);
}

.user-action i {
  font-size: 0.875rem;
  color: #6b7280;
  width: 1rem;
}

.user-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0.5rem 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }

  .header-left {
    gap: 1rem;
  }

  .search-container {
    max-width: 16rem;
  }

  .page-title {
    font-size: 0.875rem;
  }

  .time-display {
    display: none;
  }

  .notification-panel,
  .user-panel {
    width: 16rem;
    right: -1rem;
  }
}
</style>