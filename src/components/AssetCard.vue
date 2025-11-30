<template>
  <div
    class="asset-card"
    :class="{
      'group': true,
      'loading': isLoading,
      'visited': asset.visitCount > 0
    }"
    @click="handleVisit"
    @contextmenu.prevent="showContextMenu"
  >
    <!-- 顶部彩色条 -->
    <div class="color-bar" :style="{ background: categoryColor }"></div>

    <!-- 卡片内容 -->
    <div class="card-content">
      <!-- 图标和基本信息 -->
      <div class="card-header">
        <div class="favicon-container">
          <img
            :src="faviconUrl"
            :alt="asset.name"
            class="favicon"
            @error="handleImageError"
            :key="asset.url"
          />
          <div v-if="isLoading" class="favicon-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
          </div>
        </div>

        <div class="asset-info">
          <h4 class="asset-name" :title="asset.name">{{ asset.name }}</h4>
          <p class="asset-url" :title="asset.url">{{ domain }}</p>
        </div>

        <!-- 操作按钮 -->
        <div class="card-actions">
          <button
            class="action-button favorite-button"
            @click.stop="toggleFavorite"
            :class="{ 'active': isFavorite }"
            :title="isFavorite ? '取消收藏' : '添加收藏'"
          >
            <i class="fa-solid" :class="isFavorite ? 'fa-heart' : 'fa-heart'"></i>
          </button>

          <button
            class="action-button more-button"
            @click.stop="showMoreMenu"
            title="更多操作"
          >
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>
      </div>

      <!-- 标签和状态 -->
      <div class="card-footer">
        <div class="tags-container">
          <span v-if="asset.rank <= 3" class="badge rank-badge">
            <i class="fa-solid fa-star"></i>
            Top
          </span>
          <span v-if="hasDocumentation" class="badge doc-badge">
            <i class="fa-solid fa-file-alt"></i>
            Doc
          </span>
          <span v-if="hasNetwork" class="badge net-badge">
            <i class="fa-solid fa-globe"></i>
            Net
          </span>
          <span v-if="asset.archived" class="badge archived-badge">
            <i class="fa-solid fa-archive"></i>
            已归档
          </span>
        </div>

        <div class="visit-info">
          <span v-if="asset.visitCount > 0" class="visit-count" :title="`访问次数: ${asset.visitCount}`">
            <i class="fa-solid fa-eye"></i>
            {{ formatVisitCount(asset.visitCount) }}
          </span>
          <span v-if="asset.lastVisited" class="last-visited" :title="`最后访问: ${formatDate(asset.lastVisited)}`">
            <i class="fa-solid fa-clock"></i>
            {{ formatRelativeTime(asset.lastVisited) }}
          </span>
        </div>
      </div>

      <!-- 描述信息 -->
      <div v-if="asset.description" class="asset-description" :title="asset.description">
        {{ asset.description }}
      </div>
    </div>

    <!-- 右键菜单 -->
    <div
      v-if="showContextMenuPanel"
      class="context-menu"
      :style="contextMenuPosition"
      @click.stop
    >
      <div class="context-menu-item" @click="editAsset">
        <i class="fa-solid fa-edit"></i>
        编辑资产
      </div>
      <div class="context-menu-item" @click="duplicateAsset">
        <i class="fa-solid fa-copy"></i>
        复制资产
      </div>
      <div class="context-menu-item" @click="shareAsset">
        <i class="fa-solid fa-share"></i>
        分享资产
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" @click="toggleArchive">
        <i class="fa-solid" :class="asset.archived ? 'fa-box-open' : 'fa-archive'"></i>
        {{ asset.archived ? '取消归档' : '归档资产' }}
      </div>
      <div class="context-menu-item danger" @click="deleteAsset">
        <i class="fa-solid fa-trash"></i>
        删除资产
      </div>
    </div>

    <!-- 更多菜单 -->
    <div v-if="showMoreMenuPanel" class="more-menu" @click.stop>
      <div class="more-menu-item" @click="copyUrl">
        <i class="fa-solid fa-link"></i>
        复制链接
      </div>
      <div class="more-menu-item" @click="openInNewTab">
        <i class="fa-solid fa-external-link-alt"></i>
        新标签页打开
      </div>
      <div class="more-menu-item" @click="viewDetails">
        <i class="fa-solid fa-info-circle"></i>
        查看详情
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Asset } from '@types/index'
import { useAssetsStore } from '@stores/assets'
import { useAppStore } from '@stores/app'
import { URLHelper, DateHelper, ImageHelper, DeviceHelper } from '@utils/helpers'
import { getCategoryColor } from '@data/categories'

interface Props {
  asset: Asset
  lazy?: boolean
}

interface Emits {
  (e: 'visit', asset: Asset): void
  (e: 'edit', asset: Asset): void
  (e: 'delete', asset: Asset): void
}

const props = withDefaults(defineProps<Props>(), {
  lazy: true
})

const emit = defineEmits<Emits>()

const assetsStore = useAssetsStore()
const appStore = useAppStore()

// 响应式数据
const isLoading = ref(true)
const showContextMenuPanel = ref(false)
const showMoreMenuPanel = ref(false)
const contextMenuPosition = ref({ top: '0px', left: '0px' })
const imageLoaded = ref(false)
const isFavorite = ref(false)

// 计算属性
const faviconUrl = computed(() => URLHelper.getFavicon(props.asset.url))
const domain = computed(() => URLHelper.getDomain(props.asset.url))
const categoryColor = computed(() => getCategoryColor(props.asset.category))
const hasDocumentation = computed(() => props.asset.tags?.includes('doc'))
const hasNetwork = computed(() => props.asset.tags?.includes('vpn'))

// 方法
const handleVisit = () => {
  emit('visit', props.asset)
  assetsStore.recordVisit(props.asset.id)
}

const handleImageError = (event: Event) => {
  ImageHelper.handleImageError(event)
  isLoading.value = false
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // 这里可以添加收藏逻辑
  appStore.showInfo(
    isFavorite.value ? '已收藏' : '已取消收藏',
    props.asset.name
  )
}

const showContextMenu = (event: MouseEvent) => {
  event.preventDefault()

  contextMenuPosition.value = {
    top: `${event.clientY}px`,
    left: `${event.clientX}px`
  }
  showContextMenuPanel.value = true

  // 确保菜单不超出视窗
  setTimeout(() => {
    const menu = document.querySelector('.context-menu') as HTMLElement
    if (menu) {
      const rect = menu.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (rect.right > viewportWidth) {
        contextMenuPosition.value.left = `${viewportWidth - rect.width - 10}px`
      }

      if (rect.bottom > viewportHeight) {
        contextMenuPosition.value.top = `${viewportHeight - rect.height - 10}px`
      }
    }
  }, 0)
}

const showMoreMenu = (event: MouseEvent) => {
  event.stopPropagation()
  showMoreMenuPanel.value = !showMoreMenuPanel.value

  if (showMoreMenuPanel.value) {
    // 确保菜单位置正确
    setTimeout(() => {
      const menu = document.querySelector('.more-menu') as HTMLElement
      if (menu) {
        const rect = menu.getBoundingClientRect()
        const viewportWidth = window.innerWidth

        if (rect.right > viewportWidth) {
          menu.style.left = 'auto'
          menu.style.right = '0'
        }
      }
    }, 0)
  }
}

const hideAllMenus = () => {
  showContextMenuPanel.value = false
  showMoreMenuPanel.value = false
}

const editAsset = () => {
  emit('edit', props.asset)
  hideAllMenus()
}

const duplicateAsset = () => {
  const duplicatedAsset = {
    ...props.asset,
    name: `${props.asset.name} (副本)`,
    id: DateHelper.generateId()
  }

  assetsStore.addAsset(duplicatedAsset)
  appStore.showSuccess('复制成功', '资产已复制')
  hideAllMenus()
}

const shareAsset = async () => {
  try {
    if (navigator.share && DeviceHelper.isMobile()) {
      await navigator.share({
        title: props.asset.name,
        text: props.asset.description,
        url: props.asset.url
      })
    } else {
      await navigator.clipboard.writeText(props.asset.url)
      appStore.showSuccess('链接已复制', '资产链接已复制到剪贴板')
    }
  } catch (error) {
    console.error('分享失败:', error)
    appStore.showError('分享失败', '无法分享此资产')
  }
  hideAllMenus()
}

const toggleArchive = () => {
  assetsStore.toggleArchive(props.asset.id)
  appStore.showSuccess(
    props.asset.archived ? '已取消归档' : '已归档',
    props.asset.name
  )
  hideAllMenus()
}

const deleteAsset = () => {
  if (confirm(`确定要删除"${props.asset.name}"吗？此操作不可撤销。`)) {
    assetsStore.deleteAsset(props.asset.id)
    emit('delete', props.asset)
    appStore.showSuccess('删除成功', '资产已删除')
  }
  hideAllMenus()
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(props.asset.url)
    appStore.showSuccess('复制成功', '链接已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    appStore.showError('复制失败', '无法复制链接')
  }
  hideAllMenus()
}

const openInNewTab = () => {
  window.open(props.asset.url, '_blank')
  assetsStore.recordVisit(props.asset.id)
  hideAllMenus()
}

const viewDetails = () => {
  appStore.showInfo(
    '资产详情',
    `名称: ${props.asset.name}\nURL: ${props.asset.url}\n分类: ${props.asset.category}\n创建时间: ${formatDate(props.asset.createdAt)}\n访问次数: ${props.asset.visitCount}`
  )
  hideAllMenus()
}

const formatVisitCount = (count: number): string => {
  if (count < 1000) return count.toString()
  if (count < 10000) return (count / 1000).toFixed(1) + 'k'
  return (count / 10000).toFixed(1) + 'w'
}

const formatDate = (date: Date): string => {
  return DateHelper.formatDate(date)
}

const formatRelativeTime = (date: Date): string => {
  return DateHelper.formatRelativeTime(date)
}

const loadImage = () => {
  if (!props.lazy) {
    const img = new Image()
    img.onload = () => {
      imageLoaded.value = true
      isLoading.value = false
    }
    img.onerror = () => {
      isLoading.value = false
    }
    img.src = faviconUrl.value
  } else {
    // 懒加载逻辑
    setTimeout(() => {
      const img = new Image()
      img.onload = () => {
        imageLoaded.value = true
        isLoading.value = false
      }
      img.onerror = () => {
        isLoading.value = false
      }
      img.src = faviconUrl.value
    }, 100)
  }
}

// 生命周期
onMounted(() => {
  loadImage()

  // 添加全局点击事件监听器来关闭菜单
  document.addEventListener('click', hideAllMenus)
})

onUnmounted(() => {
  document.removeEventListener('click', hideAllMenus)
})
</script>

<style scoped>
.asset-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  height: 6rem;
  padding: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.asset-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 122, 255, 0.2);
  background: rgba(255, 255, 255, 0.95);
}

.asset-card.visited {
  background: rgba(248, 250, 252, 0.9);
}

.asset-card.loading {
  pointer-events: none;
  opacity: 0.7;
}

.color-bar {
  height: 3px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  flex: 1;
  min-height: 0;
}

.favicon-container {
  position: relative;
  flex-shrink: 0;
}

.favicon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.25rem;
  object-fit: contain;
}

.favicon-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.75rem;
}

.asset-info {
  flex: 1;
  min-width: 0;
}

.asset-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.25;
  margin: 0 0 0.125rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.asset-url {
  font-size: 0.625rem;
  color: #6b7280;
  line-height: 1.2;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.8;
}

.card-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.asset-card:hover .card-actions {
  opacity: 1;
}

.action-button {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  padding: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  background: rgba(255, 255, 255, 1);
  color: #374151;
  transform: scale(1.05);
}

.favorite-button.active {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.more-button {
  font-size: 0.75rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
}

.tags-container {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.badge {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  white-space: nowrap;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  line-height: 1.2;
}

.rank-badge {
  background: rgba(0, 122, 255, 0.1);
  color: #007aff;
  border: 1px solid rgba(0, 122, 255, 0.2);
}

.doc-badge {
  background: rgba(52, 199, 89, 0.1);
  color: #34c759;
  border: 1px solid rgba(52, 199, 89, 0.2);
}

.net-badge {
  background: rgba(175, 82, 222, 0.1);
  color: #af52de;
  border: 1px solid rgba(175, 82, 222, 0.2);
}

.archived-badge {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.2);
}

.visit-info {
  display: flex;
  gap: 0.5rem;
  font-size: 0.625rem;
  color: #9ca3af;
  white-space: nowrap;
}

.visit-count,
.last-visited {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

.asset-description {
  font-size: 0.625rem;
  color: #6b7280;
  line-height: 1.3;
  margin-top: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 右键菜单 */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 12rem;
  z-index: 1000;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: background 0.2s ease;
}

.context-menu-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.context-menu-item.danger {
  color: #ef4444;
}

.context-menu-item.danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.context-menu-item i {
  font-size: 0.75rem;
  width: 1rem;
  text-align: center;
  opacity: 0.7;
}

.context-menu-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0.5rem 0;
}

/* 更多菜单 */
.more-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 10rem;
  z-index: 50;
  margin-top: 0.25rem;
}

.more-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: background 0.2s ease;
  white-space: nowrap;
}

.more-menu-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.more-menu-item i {
  font-size: 0.75rem;
  width: 1rem;
  text-align: center;
  opacity: 0.7;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .asset-card {
    height: 5.5rem;
    padding: 0.75rem;
  }

  .asset-name {
    font-size: 0.8125rem;
  }

  .asset-url {
    font-size: 0.5625rem;
  }

  .badge {
    font-size: 0.5625rem;
    padding: 0.0625rem 0.3125rem;
  }

  .asset-description {
    font-size: 0.5625rem;
  }

  .context-menu {
    min-width: 10rem;
    font-size: 0.8125rem;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .asset-card {
    background: rgba(30, 30, 30, 0.9);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .asset-card:hover {
    background: rgba(30, 30, 30, 0.95);
  }

  .asset-name {
    color: #f9fafb;
  }

  .asset-url {
    color: #9ca3af;
  }

  .asset-description {
    color: #9ca3af;
  }

  .context-menu,
  .more-menu {
    background: rgba(30, 30, 30, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .context-menu-item,
  .more-menu-item {
    color: #e5e7eb;
  }

  .context-menu-item:hover,
  .more-menu-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}

/* 动画优化 */
.asset-card {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>