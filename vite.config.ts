import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Expose environment variables to the client-side code
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.GOOGLE_CALENDAR_ID': JSON.stringify(env.GOOGLE_CALENDAR_ID),
      'process.env.TELEGRAM_LINK': JSON.stringify(env.TELEGRAM_LINK),
      'process.env.FORMSPREE_ENDPOINT': JSON.stringify(env.FORMSPREE_ENDPOINT),
    }
  }
})