<template>
  <aside class="sidebar" :class="{ 'collapsed': sidebarCollapsed }">
    <!-- 窗口控制按钮 -->
    <div class="window-controls">
      <div class="window-control close" title="关闭" @click="handleClose"></div>
      <div class="window-control minimize" title="最小化" @click="handleMinimize"></div>
      <div class="window-control maximize" title="最大化" @click="handleMaximize"></div>
    </div>

    <!-- 应用信息 -->
    <div class="app-info">
      <div class="app-icon">
        <i class="fa-solid fa-compass-drafting"></i>
      </div>
      <transition name="fade">
        <div v-if="!sidebarCollapsed" class="app-details">
          <h1 class="app-title">作战中心</h1>
          <p class="app-version">v6.0 Professional</p>
        </div>
      </transition>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons" :class="{ 'collapsed': sidebarCollapsed }">
      <button
        class="action-button add-button"
        @click="openAddModal"
        :title="sidebarCollapsed ? '录入资产' : ''"
      >
        <i class="fa-solid fa-plus"></i>
        <span v-if="!sidebarCollapsed">录入</span>
      </button>
      <button
        class="action-button analyze-button"
        @click="openAnalysisModal"
        :title="sidebarCollapsed ? '资产分析' : ''"
      >
        <i class="fa-solid fa-chart-pie"></i>
        <span v-if="!sidebarCollapsed">盘点</span>
      </button>
    </div>

    <!-- 导航菜单 -->
    <nav class="navigation">
      <!-- 全局视图 -->
      <div
        class="nav-item"
        :class="{ 'active': currentFilter === 'all' }"
        @click="setFilter('all')"
        title="全局全量"
      >
        <i class="fa-solid fa-border-all nav-icon"></i>
        <span v-if="!sidebarCollapsed" class="nav-text">全局全量</span>
        <span v-if="!sidebarCollapsed" class="nav-count">{{ assetsCount }}</span>
      </div>

      <!-- 分组导航 -->
      <template v-for="group in groupedCategories" :key="group.id">
        <div class="nav-group">
          <div
            class="nav-group-header"
            :title="sidebarCollapsed ? group.groupName : ''"
          >
            <i :class="group.icon"></i>
            <span v-if="!sidebarCollapsed" class="group-text">{{ group.groupName }}</span>
          </div>

          <transition name="slide-down">
            <div v-if="!sidebarCollapsed" class="nav-group-items">
              <div
                v-for="category in group.items"
                :key="category.id"
                class="nav-item category-item"
                :class="{ 'active': currentFilter === category.id }"
                @click="setFilter(category.id)"
                :title="category.name"
              >
                <div class="category-indicator" :style="{ background: category.color }"></div>
                <span class="nav-text">{{ category.name }}</span>
                <span class="nav-count">{{ getCategoryCount(category.id) }}</span>
              </div>
            </div>
          </transition>
        </div>
      </template>
    </nav>

    <!-- 底部状态栏 -->
    <div class="sidebar-footer">
      <div class="status-info" :class="{ 'collapsed': sidebarCollapsed }">
        <div class="data-info">
          <i class="fa-solid fa-database"></i>
          <span v-if="!sidebarCollapsed" class="data-text">Data v6.0</span>
        </div>
        <button
          class="settings-button"
          @click="openSettings"
          title="设置"
        >
          <i class="fa-solid fa-gear"></i>
        </button>
      </div>
    </div>

    <!-- 折叠按钮 -->
    <button
      class="collapse-toggle"
      @click="toggleSidebar"
      :title="sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'"
    >
      <i class="fa-solid" :class="sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@stores/app'
import { useAssetsStore } from '@stores/assets'
import { CATEGORY_STRUCTURE, getFlatCategories } from '@data/categories'

const appStore = useAppStore()
const assetsStore = useAssetsStore()

// 计算属性
const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)
const currentFilter = computed(() => appStore.currentFilter)
const assetsCount = computed(() => assetsStore.assetsCount)
const groupedCategories = computed(() => CATEGORY_STRUCTURE)
const flatCategories = computed(() => getFlatCategories())

// 方法
const setFilter = (filter: string) => {
  appStore.setFilter(filter)
}

const getCategoryCount = (categoryId: string) => {
  return assetsStore.getAssetsByCategory(categoryId as any).length
}

const toggleSidebar = () => {
  appStore.toggleSidebar()
}

const openAddModal = () => {
  appStore.showInfo('添加资产', '添加功能开发中...')
}

const openAnalysisModal = () => {
  appStore.showInfo('资产分析', '分析功能开发中...')
}

const openSettings = () => {
  appStore.showInfo('设置', '设置功能开发中...')
}

// 窗口控制方法（在Web环境中这些可能没有实际效果）
const handleClose = () => {
  if (confirm('确定要关闭应用吗？')) {
    window.close()
  }
}

const handleMinimize = () => {
  appStore.showInfo('提示', '最小化功能在Web环境中不可用')
}

const handleMaximize = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width, 16rem);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 20;
}

.sidebar.collapsed {
  width: 4rem;
}

.window-controls {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  padding-top: 1rem;
}

.window-control {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.window-control:hover {
  opacity: 0.8;
}

.window-control.close {
  background: #ff5f57;
}

.window-control.minimize {
  background: #ffbd2e;
}

.window-control.maximize {
  background: #28ca42;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.app-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.app-details {
  flex: 1;
  min-width: 0;
}

.app-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.125rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-version {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  padding: 0 1.5rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.action-buttons.collapsed {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 0.75rem 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-button i {
  font-size: 0.75rem;
}

.analyze-button {
  background: var(--primary-color, #007aff);
  color: white;
  border-color: var(--primary-color, #007aff);
}

.analyze-button:hover {
  background: #0051d5;
  border-color: #0051d5;
}

.navigation {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1.25rem;
  margin: 0 0.75rem 0.125rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.nav-item.active {
  background: rgba(0, 122, 255, 0.1);
  color: var(--primary-color, #007aff);
  font-weight: 600;
}

.nav-icon {
  font-size: 0.875rem;
  width: 1rem;
  text-align: center;
  opacity: 0.7;
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.nav-count {
  font-size: 0.625rem;
  color: #9ca3af;
  background: rgba(156, 163, 175, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-weight: 500;
  min-width: 1.25rem;
  text-align: center;
}

.nav-item.active .nav-count {
  background: rgba(0, 122, 255, 0.2);
  color: var(--primary-color, #007aff);
}

.nav-group {
  margin-bottom: 1rem;
}

.nav-group-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  margin: 0 0.75rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background 0.2s ease;
}

.nav-group-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.nav-group-header i {
  font-size: 0.625rem;
  width: 0.75rem;
  text-align: center;
  opacity: 0.5;
}

.group-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-group-items {
  padding-left: 0.5rem;
}

.category-item {
  padding: 0.375rem 1rem;
  margin: 0 0.75rem 0.125rem 0.5rem;
  font-size: 0.75rem;
}

.category-indicator {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  opacity: 0.6;
  flex-shrink: 0;
}

.sidebar-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.status-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info.collapsed {
  justify-content: center;
}

.data-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
}

.data-info i {
  font-size: 0.75rem;
}

.data-text {
  font-size: 0.625rem;
  font-weight: 500;
}

.settings-button {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.375rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.settings-button:hover {
  color: #6b7280;
  background: rgba(0, 0, 0, 0.05);
}

.collapse-toggle {
  position: absolute;
  top: 50%;
  right: -0.75rem;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 1.5rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  z-index: 10;
}

.collapse-toggle:hover {
  background: var(--primary-color, #007aff);
  border-color: var(--primary-color, #007aff);
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.collapse-toggle i {
  font-size: 0.5rem;
}

/* 自定义滚动条 */
.navigation::-webkit-scrollbar {
  width: 6px;
}

.navigation::-webkit-scrollbar-track {
  background: transparent;
}

.navigation::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border: none;
}

.navigation::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 20rem;
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 30;
    box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
  }

  .sidebar.collapsed {
    transform: translateX(-100%);
    width: 16rem;
  }

  .collapse-toggle {
    right: 1rem;
    top: auto;
    bottom: 1rem;
    transform: none;
  }

  .sidebar.collapsed .collapse-toggle {
    transform: rotate(180deg);
  }
}

@media (max-width: 480px) {
  .app-info {
    padding: 0.75rem 1rem;
  }

  .action-buttons:not(.collapsed) {
    gap: 0.375rem;
    padding: 0 1rem 0.75rem;
  }

  .nav-item {
    padding: 0.5rem 1rem;
  }
}

/* macOS 风格优化 */
@media (prefers-color-scheme: dark) {
  .sidebar {
    background: rgba(30, 30, 30, 0.8);
    border-right-color: rgba(255, 255, 255, 0.1);
  }

  .app-title {
    color: #f9fafb;
  }

  .nav-item {
    color: #e5e7eb;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .nav-item.active {
    background: rgba(0, 122, 255, 0.2);
  }

  .action-button {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.1);
    color: #e5e7eb;
  }

  .action-button:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}
</style>