/**
 * 应用核心类型定义
 * 遵循 TypeScript 最佳实践和 SOLID 原则
 */

// 基础类型
export type AssetId = string
export type CategoryId = string
export type GroupId = string

/**
 * 数字资产实体
 */
export interface Asset {
  /** 唯一标识符 */
  id: AssetId
  /** 资产名称 */
  name: string
  /** URL 地址 */
  url: string
  /** 所属分类 */
  category: CategoryId
  /** 排序权重 (1-99, 1为最高优先级) */
  rank: number
  /** 标签 */
  tags?: AssetTag[]
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 访问次数 */
  visitCount: number
  /** 最后访问时间 */
  lastVisited?: Date
  /** 备注信息 */
  description?: string
  /** 是否已归档 */
  archived: boolean
}

/** 资产标签枚举 */
export enum AssetTag {
  /** 文档类资源 */
  DOCUMENTATION = 'doc',
  /** VPN/网络工具 */
  NETWORK = 'vpn',
  /** 高频使用 */
  FREQUENT = 'freq',
  /** 收费服务 */
  PREMIUM = 'premium',
  /** 开源项目 */
  OPEN_SOURCE = 'oss'
}

/**
 * 分类实体
 */
export interface Category {
  /** 唯一标识符 */
  id: CategoryId
  /** 分类名称 */
  name: string
  /** 显示颜色 */
  color: string
  /** 图标 */
  icon?: string
  /** 分类描述 */
  description?: string
  /** 排序权重 */
  sort: number
}

/**
 * 分组实体
 */
export interface CategoryGroup {
  /** 唯一标识符 */
  id: GroupId
  /** 分组名称 */
  groupName: string
  /** 分组图标 */
  icon: string
  /** 包含的分类 */
  items: Category[]
  /** 分组描述 */
  description?: string
}

/**
 * 应用状态
 */
export interface AppState {
  /** 当前选择的过滤器 */
  currentFilter: CategoryId | 'all'
  /** 搜索查询 */
  searchQuery: string
  /** 视图模式 */
  viewMode: 'grid' | 'list' | 'group'
  /** 侧边栏状态 */
  sidebarCollapsed: boolean
  /** 主题设置 */
  theme: ThemeConfig
  /** 用户偏好 */
  preferences: UserPreferences
}

/**
 * 主题配置
 */
export interface ThemeConfig {
  /** 主题模式 */
  mode: 'light' | 'dark' | 'auto'
  /** 主色调 */
  primaryColor: string
  /** 侧边栏宽度 */
  sidebarWidth: number
  /** 动画开关 */
  animationsEnabled: boolean
}

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  /** 语言 */
  language: 'zh-CN' | 'en-US'
  /** 时区 */
  timezone: string
  /** 每页显示数量 */
  pageSize: number
  /** 自动保存间隔 (秒) */
  autoSaveInterval: number
  /** 显示模式 */
  defaultViewMode: AppState['viewMode']
}

/**
 * API 响应类型
 */
export interface ApiResponse<T = any> {
  /** 是否成功 */
  success: boolean
  /** 响应数据 */
  data?: T
  /** 错误信息 */
  error?: string
  /** 响应码 */
  code?: number
}

/**
 * 分析结果
 */
export interface AnalysisResult {
  /** 用户画像 */
  userProfile: UserProfile
  /** 缺失分析 */
  gapsAnalysis: GapsAnalysis
  /** 推荐工具 */
  recommendations: Recommendation[]
}

export interface UserProfile {
  /** 主要领域 */
  primaryDomains: string[]
  /** 技能水平 */
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  /** 使用模式 */
  usagePattern: 'casual' | 'regular' | 'power' | 'professional'
  /** 规模评估 */
  assetScale: 'small' | 'medium' | 'large' | 'enterprise'
}

export interface GapsAnalysis {
  /** 缺失的分类 */
  missingCategories: CategoryId[]
  /** 重复的资产 */
  duplicateAssets: Asset[]
  /** 过时的链接 */
  outdatedAssets: Asset[]
  /** 分类建议 */
  categorySuggestions: Array<{
    category: CategoryId
    confidence: number
    reason: string
  }>
}

export interface Recommendation {
  /** 推荐名称 */
  name: string
  /** 推荐URL */
  url: string
  /** 推荐分类 */
  category: CategoryId
  /** 推荐理由 */
  reason: string
  /** 置信度 */
  confidence: number
  /** 来源 */
  source: string
}

/**
 * 智能解析结果
 */
export interface SmartParseResult {
  /** 解析的资产 */
  asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt' | 'visitCount'>
  /** 置信度 */
  confidence: number
  /** 原始文本 */
  originalText: string
}

/**
 * 存储接口
 */
export interface StorageInterface {
  /** 获取所有资产 */
  getAssets(): Promise<Asset[]>
  /** 保存资产 */
  saveAssets(assets: Asset[]): Promise<void>
  /** 获取分类结构 */
  getCategories(): Promise<CategoryGroup[]>
  /** 保存分类结构 */
  saveCategories(categories: CategoryGroup[]): Promise<void>
  /** 清理过期数据 */
  cleanup(): Promise<void>
}

/**
 * 错误类型
 */
export enum ErrorType {
  /** 网络错误 */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** 权限错误 */
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  /** 验证错误 */
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  /** 存储错误 */
  STORAGE_ERROR = 'STORAGE_ERROR',
  /** 解析错误 */
  PARSE_ERROR = 'PARSE_ERROR',
  /** 未知错误 */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * 应用错误
 */
export interface AppError {
  /** 错误类型 */
  type: ErrorType
  /** 错误信息 */
  message: string
  /** 原始错误 */
  originalError?: Error
  /** 时间戳 */
  timestamp: Date
  /** 上下文信息 */
  context?: Record<string, any>
}