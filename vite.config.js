import {defineConfig,loadEnv} from "vite"
import vue from "@vitejs/plugin-vue"
import { createSvg } from './src/icons';
import { resolve } from 'path'

export default ({mode}) => {
  let env = loadEnv(mode, process.cwd());
  return defineConfig({
    base:"./",
    plugins: [
      vue(),
      createSvg('./src/icons/svg/')
    ],
    server:{
      host:env.VITE_CLIENT_HOST,
      port:env.VITE_CLIENT_PORT,
    },
    preview:{
      port:8080
    },
    resolve:{
      alias:{
        '@': resolve(__dirname, ".", "src")
      }
    },
    build:{
      sourcemap:true
    }
  })
}