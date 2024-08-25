import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import commonjs from 'vite-plugin-commonjs'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),legacy({
  }),commonjs()],
})

