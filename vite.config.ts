import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vue(), vueJsx(), nodePolyfills(),   
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  server: {
    port: 9200,
    proxy: {
      '/dev-api': {
        target: 'http://127.0.0.1:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-api/, ''),
      },
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router'], // 明确指定要预构建的依赖，减少内存占用
  },
});