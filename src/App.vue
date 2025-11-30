<template>
  <div id="app" class="h-screen flex overflow-hidden text-sm">
    <!-- 加载状态 -->
    <div v-if="appStore.isLoading" class="loading-screen">
      <div class="loading-content">
        <div class="loading-logo">
          <i class="fa-solid fa-compass-drafting"></i>
        </div>
        <div class="loading-text">
          <h1>阿龙的数字化作战中心</h1>
          <p>正在初始化...</p>
        </div>
        <div class="loading-spinner">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
        </div>
      </div>
    </div>

    <!-- 主应用界面 -->
    <template v-else>
      <!-- 侧边栏 -->
      <Sidebar />

      <!-- 主内容区 -->
      <main class="flex-1 h-full flex flex-col overflow-hidden relative">
        <!-- 顶部标题栏 -->
        <Header />

        <!-- 内容区域 -->
        <div class="flex-1 overflow-y-auto p-8 custom-scroll">
          <!-- 全局视图：按业务板块分组 -->
          <div v-if="currentFilter === 'all'" class="global-view">
            <div
              v-for="(groupData, groupName) in displaySitesGrouped"
              :key="groupName"
              class="mb-10"
            >
              <div class="group-header">
                <h3 class="group-title">{{ groupName }}</h3>
                <div class="group-divider"></div>
                <span class="group-count">{{ groupData.length }}</span>
              </div>

              <div class="assets-grid">
                <AssetCard
                  v-for="site in groupData"
                  :key="site.id"
                  :asset="site"
                  @visit="handleVisit"
                  @edit="handleEdit"
                  @delete="handleDelete"
                />
              </div>
            </div>
          </div>

          <!-- 分类视图 -->
          <div v-else class="category-view">
            <!-- 空状态 -->
            <div v-if="displaySites.length === 0" class="empty-state">
              <div class="empty-icon">
                <i class="fa-solid fa-inbox"></i>
              </div>
              <p class="empty-text">暂无相关资产</p>
              <p class="empty-subtitle">尝试添加新资产或调整筛选条件</p>
            </div>

            <!-- 资产网格 -->
            <div v-else class="assets-grid">
              <AssetCard
                v-for="site in displaySites"
                :key="site.id"
                :asset="site"
                @visit="handleVisit"
                @edit="handleEdit"
                @delete="handleDelete"
              />
            </div>
          </div>
        </div>
      </main>

      <!-- 通知容器 -->
      <div class="notification-container">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-toast"
          :class="[
            `notification-${notification.type}`,
            { 'notification-enter': !notification.read }
          ]"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon">
            <i :class="getNotificationIcon(notification.type)"></i>
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div v-if="notification.message" class="notification-message">
              {{ notification.message }}
            </div>
          </div>
          <button
            class="notification-close"
            @click="removeNotification(notification.id)"
          >
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '@stores/app'
import { useAssetsStore } from '@stores/assets'
import { CATEGORY_STRUCTURE } from '@data/categories'
import Header from '@components/Header.vue'
import Sidebar from '@components/Sidebar.vue'
import AssetCard from '@components/AssetCard.vue'
import type { Asset } from '@types/index'

const appStore = useAppStore()
const assetsStore = useAssetsStore()

// 计算属性
const currentFilter = computed(() => appStore.currentFilter)
const notifications = computed(() => appStore.notifications.slice(0, 5))

const displaySites = computed(() => {
  let result = assetsStore.assets.filter(asset => !asset.archived)

  // 应用搜索过滤
  if (appStore.searchQuery) {
    result = assetsStore.searchAssets(appStore.searchQuery)
  } else if (currentFilter.value !== 'all') {
    result = assetsStore.getAssetsByCategory(currentFilter.value as any)
  }

  // 排序：按 rank 优先，然后按名称
  return result.sort((a, b) => {
    const rankA = a.rank || 99
    const rankB = b.rank || 99
    if (rankA !== rankB) return rankA - rankB
    return a.name.localeCompare(b.name, 'zh-CN')
  })
})

const displaySitesGrouped = computed(() => {
  if (currentFilter.value !== 'all' || appStore.searchQuery) return {}

  const groups: Record<string, Asset[]> = {}

  CATEGORY_STRUCTURE.forEach(group => {
    group.items.forEach(category => {
      const items = assetsStore.getAssetsByCategory(category.id).filter(asset => !asset.archived)
      if (items.length > 0) {
        const sortedItems = items.sort((a, b) => (a.rank || 99) - (b.rank || 99))
        groups[category.name] = sortedItems
      }
    })
  })

  return groups
})

// 方法
const handleVisit = (asset: Asset) => {
  window.open(asset.url, '_blank')
  assetsStore.recordVisit(asset.id)
  appStore.showSuccess('访问成功', `正在打开 ${asset.name}`)
}

const handleEdit = (asset: Asset) => {
  appStore.showInfo('编辑资产', `正在编辑 ${asset.name}`)
  // TODO: 实现编辑功能
}

const handleDelete = (asset: Asset) => {
  if (confirm(`确定要删除"${asset.name}"吗？`)) {
    assetsStore.deleteAsset(asset.id)
    appStore.showSuccess('删除成功', `${asset.name} 已删除`)
  }
}

const markAsRead = (id: string) => {
  appStore.markNotificationRead(id)
}

const removeNotification = (id: string) => {
  appStore.removeNotification(id)
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

// 生命周期
onMounted(async () => {
  try {
    // 初始化应用
    await appStore.initializeApp()

    // 加载资产数据
    await assetsStore.loadAssets()

    console.log('✅ 应用初始化完成')
    console.log(`📊 加载了 ${assetsStore.assetsCount} 个资产`)

  } catch (error) {
    console.error('❌ 应用初始化失败:', error)
    appStore.showError('初始化失败', '应用启动时发生错误，请刷新页面重试')
  }
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-logo {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.loading-text h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: white;
}

.loading-text p {
  font-size: 1rem;
  opacity: 0.8;
  margin: 0;
}

.loading-spinner {
  margin-top: 2rem;
  font-size: 2rem;
  opacity: 0.8;
}

.global-view {
  max-width: 100%;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.group-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #334155;
  margin: 0;
}

.group-divider {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.group-count {
  font-size: 0.625rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  color: #94a3b8;
  background: rgba(148, 163, 184, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.category-view {
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.empty-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
}

.assets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  width: 100%;
}

.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  pointer-events: none;
}

.notification-toast {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 20rem;
  max-width: 25rem;
  pointer-events: auto;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: slideIn 0.3s ease-out;
}

.notification-toast.notification-success {
  border-left: 4px solid #10b981;
}

.notification-toast.notification-error {
  border-left: 4px solid #ef4444;
}

.notification-toast.notification-warning {
  border-left: 4px solid #f59e0b;
}

.notification-toast.notification-info {
  border-left: 4px solid #3b82f6;
}

.notification-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.notification-success .notification-icon {
  color: #10b981;
}

.notification-error .notification-icon {
  color: #ef4444;
}

.notification-warning .notification-icon {
  color: #f59e0b;
}

.notification-info .notification-icon {
  color: #3b82f6;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.notification-message {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  color: #d1d5db;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  color: #9ca3af;
  background: rgba(0, 0, 0, 0.05);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .assets-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 0.875rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .assets-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .notification-container {
    left: 1rem;
    right: 1rem;
  }

  .notification-toast {
    min-width: auto;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .group-title {
    font-size: 0.8125rem;
  }

  .empty-icon {
    font-size: 3rem;
  }

  .empty-text {
    font-size: 1rem;
  }

  .empty-subtitle {
    font-size: 0.8125rem;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .notification-toast {
    background: rgba(30, 30, 30, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .notification-title {
    color: #f9fafb;
  }

  .notification-message {
    color: #9ca3af;
  }

  .notification-close {
    color: #6b7280;
  }

  .notification-close:hover {
    color: #9ca3af;
    background: rgba(255, 255, 255, 0.05);
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .notification-toast {
    border-width: 2px;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .notification-toast {
    animation: none;
  }

  .loading-spinner {
    animation: none;
  }
}
</style>