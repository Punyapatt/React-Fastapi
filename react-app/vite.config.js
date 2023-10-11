import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.HOST_IP': JSON.stringify(env.HOST_IP),
      'process.env.PORT': JSON.stringify(env.PORT)
    },
    plugins: [react()],
    server: {
      watch: {
        usePolling: true,
      },
      host: true, // needed for the Docker Container port mapping to work
      strictPort: true,
      port: 5000, // you can replace this port with any port
    }
  }
})
