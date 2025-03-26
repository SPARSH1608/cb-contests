import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
//@ts-ignore
import tailwindcss from '@tailwindcss/vite'
import dotenv from "dotenv"; // ✅ Import dotenv

dotenv.config({ path: "src/renderer/.env.local" }); // ✅ Load .env.local manually
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
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()],
    
    envPrefix: "VITE_",
       define: {
      "process.env": {}, // ✅ Prevents "process is not defined" error
    },
  }
})
