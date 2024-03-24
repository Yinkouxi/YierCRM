import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

// 引入 Element plus
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@utils': resolve('src/renderer/src/utils'),
        '@api': resolve('src/renderer/src/api'),
        '@store': resolve('src/renderer/src/store'),
        '@assets': resolve('src/renderer/src/assets'),
        '@views': resolve('src/renderer/src/views'),
        '@interface': resolve('src/renderer/src/interface'),
        '@hooks': resolve('src/renderer/src/hooks'),
        '@router': resolve('src/renderer/src/router'),

      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://uat.crm.xuexiluxian.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ]
  }
})
