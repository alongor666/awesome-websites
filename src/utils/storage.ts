/**
 * 安全存储工具
 * 提供加密存储和数据持久化功能
 */

import CryptoJS from 'crypto-js'
import type { StorageInterface, Asset } from '@types/index'

/**
 * 加密存储实现
 */
export class SecureStorage implements StorageInterface {
  private readonly secretKey: string
  private readonly keyPrefix = 'ahlong_secure_'
  private readonly version = '6.0.0'

  constructor() {
    this.secretKey = this.getOrCreateSecretKey()
  }

  /**
   * 获取或创建密钥
   */
  private getOrCreateSecretKey(): string {
    const key = localStorage.getItem(`${this.keyPrefix}key`)
    if (key) return key

    const newKey = CryptoJS.lib.WordArray.random(256/8).toString()
    localStorage.setItem(`${this.keyPrefix}key`, newKey)
    return newKey
  }

  /**
   * 加密数据
   */
  private encrypt(data: string): string | null {
    try {
      return CryptoJS.AES.encrypt(data, this.secretKey).toString()
    } catch (error) {
      console.error('加密失败:', error)
      return null
    }
  }

  /**
   * 解密数据
   */
  private decrypt(encryptedData: string): string | null {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.secretKey)
      return decrypted.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error('解密失败:', error)
      return null
    }
  }

  /**
   * 安全存储数据
   */
  private setSecureItem(key: string, value: any): void {
    try {
      const encrypted = this.encrypt(JSON.stringify({
        data: value,
        version: this.version,
        timestamp: Date.now()
      }))
      if (encrypted) {
        localStorage.setItem(`${this.keyPrefix}${key}`, encrypted)
      }
    } catch (error) {
      console.error('存储失败:', error)
      throw new Error('数据存储失败')
    }
  }

  /**
   * 安全读取数据
   */
  private getSecureItem<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(`${this.keyPrefix}${key}`)
      if (!encrypted) return null

      const decrypted = this.decrypt(encrypted)
      if (!decrypted) return null

      const parsed = JSON.parse(decrypted)

      // 版本兼容性检查
      if (parsed.version !== this.version) {
        console.warn(`存储数据版本不匹配: ${parsed.version} vs ${this.version}`)
        // 可以在这里添加版本迁移逻辑
      }

      return parsed.data as T
    } catch (error) {
      console.error('读取失败:', error)
      return null
    }
  }

  /**
   * 删除数据
   */
  private removeSecureItem(key: string): void {
    localStorage.removeItem(`${this.keyPrefix}${key}`)
  }

  /**
   * 获取所有资产
   */
  async getAssets(): Promise<Asset[]> {
    const stored = this.getSecureItem<Asset[]>('assets')
    return stored || []
  }

  /**
   * 保存资产
   */
  async saveAssets(assets: Asset[]): Promise<void> {
    // 添加数据验证
    if (!Array.isArray(assets)) {
      throw new Error('资产数据必须是数组')
    }

    // 验证每个资产的基本字段
    for (const asset of assets) {
      if (!asset.name || !asset.url || !asset.category) {
        throw new Error('资产缺少必要字段')
      }
    }

    this.setSecureItem('assets', assets)
  }

  /**
   * 获取分类结构
   */
  async getCategories(): Promise<any> {
    return this.getSecureItem('categories')
  }

  /**
   * 保存分类结构
   */
  async saveCategories(categories: any): Promise<void> {
    this.setSecureItem('categories', categories)
  }

  /**
   * 清理过期数据
   */
  async cleanup(): Promise<void> {
    const keys = Object.keys(localStorage)
    const now = Date.now()
    const maxAge = 30 * 24 * 60 * 60 * 1000 // 30天

    keys.forEach(key => {
      if (key.startsWith(this.keyPrefix) && key !== `${this.keyPrefix}key`) {
        try {
          const encrypted = localStorage.getItem(key)
          if (encrypted) {
            const decrypted = this.decrypt(encrypted)
            if (decrypted) {
              const parsed = JSON.parse(decrypted)
              if (now - parsed.timestamp > maxAge) {
                localStorage.removeItem(key)
              }
            }
          }
        } catch (error) {
          // 清理损坏的数据
          localStorage.removeItem(key)
        }
      }
    })
  }

  /**
   * 获取存储使用情况
   */
  getStorageInfo(): { used: number; available: number; itemCount: number } {
    const keys = Object.keys(localStorage).filter(key =>
      key.startsWith(this.keyPrefix) && key !== `${this.keyPrefix}key`
    )

    let used = 0
    keys.forEach(key => {
      const value = localStorage.getItem(key)
      if (value) {
        used += key.length + value.length
      }
    })

    // 大多数浏览器的localStorage限制是5-10MB
    const available = 5 * 1024 * 1024 // 5MB

    return {
      used,
      available,
      itemCount: keys.length
    }
  }

  /**
   * 导出数据
   */
  exportData(): string {
    const exportData = {
      assets: this.getSecureItem('assets'),
      categories: this.getSecureItem('categories'),
      preferences: this.getSecureItem('preferences'),
      version: this.version,
      exportTime: new Date().toISOString()
    }

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * 导入数据
   */
  async importData(jsonData: string): Promise<void> {
    try {
      const importData = JSON.parse(jsonData)

      if (!importData.version) {
        throw new Error('无效的数据格式')
      }

      // 验证数据
      if (importData.assets) {
        if (!Array.isArray(importData.assets)) {
          throw new Error('资产数据格式错误')
        }
        await this.saveAssets(importData.assets)
      }

      if (importData.categories) {
        await this.saveCategories(importData.categories)
      }

      if (importData.preferences) {
        this.setSecureItem('preferences', importData.preferences)
      }

      console.log('数据导入成功')
    } catch (error) {
      console.error('数据导入失败:', error)
      throw new Error('数据导入失败: ' + (error as Error).message)
    }
  }
}

/**
 * 默认存储实例
 */
export const storage = new SecureStorage()

/**
 * 简单的内存存储（用于开发测试）
 */
export class MemoryStorage implements StorageInterface {
  private data: Map<string, any> = new Map()

  async getAssets(): Promise<Asset[]> {
    return this.data.get('assets') || []
  }

  async saveAssets(assets: Asset[]): Promise<void> {
    this.data.set('assets', assets)
  }

  async getCategories(): Promise<any> {
    return this.data.get('categories')
  }

  async saveCategories(categories: any): Promise<void> {
    this.data.set('categories', categories)
  }

  async cleanup(): Promise<void> {
    // 内存存储不需要清理
  }
}