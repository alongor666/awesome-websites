import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'

// 创建应用实例
const app = createApp(App)

// 创建 Pinia 状态管理
const pinia = createPinia()

// 注册插件
app.use(pinia)

// 全局错误处理
app.config.errorHandler = (error, instance, info) => {
  console.error('Global error:', error)
  console.error('Component instance:', instance)
  console.error('Error info:', info)
}

// 全局警告处理
app.config.warnHandler = (msg, instance, trace) => {
  console.warn('Global warning:', msg)
  console.warn('Component instance:', instance)
  console.warn('Component trace:', trace)
}

// 挂载应用
app.mount('#app')

// 开发环境下的调试信息
if (import.meta.env.DEV) {
  console.log('🚀 Ah Long\'s Digital Command Center v6.0')
  console.log('📦 Environment:', import.meta.env.MODE)
  console.log('🔧 Vite HMR enabled')
}