import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin} from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer')
      }
    },
    plugins: [react({
      babel: {
        plugins: [
          ["@babel/plugin-proposal-decorators", {  "version": "2023-11" }],
          // ["@babel/plugin-proposal-class-properties", { loose: true }],
        ],
      },
    })]
  }
})
