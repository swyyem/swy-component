import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    // 使用 happy-dom 模拟浏览器环境
    environment: 'happy-dom',
    // 测试文件匹配（所有子包中的 .test.ts / .spec.ts）
    include: ['packages/**/*.{test,spec}.{ts,tsx}'],
    // 全局 API（不需要每个文件都 import describe/it/expect）
    globals: true,
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.{ts,vue}'],
      exclude: ['**/*.stories.ts', '**/*.test.ts'],
    },
  },
})
