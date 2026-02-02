import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path for deployment - shizuha-home serves at root
const basePath = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  plugins: [react()],
  base: basePath,
  server: {
    host: '0.0.0.0',
    port: 5180,
    // Allow requests from nginx and other Docker/K8s containers
    allowedHosts: [
      'localhost',
      'shizuha-home-frontend',
      'nginx',
      'shizuha-nginx',
      'shizuha-nginx-dev',
      // Tailscale
      's1.tail.shizuha.com',
      '.tail.shizuha.com',
      // K8s service names
      'shizuha-shizuha-home-frontend',
      'shizuha-shizuha-home-frontend.shizuha.svc.cluster.local',
      '.svc.cluster.local',
      'shizuha.com',
      'erp.shizuha.com',
      'staging.shizuha.com',
    ],
    // HMR configuration for different environments
    hmr: (process.env.VITE_HMR_DISABLE === 'true' || basePath !== '/') ? false : {
      host: process.env.VITE_HMR_HOST || 'localhost',
      port: parseInt(process.env.VITE_HMR_PORT || '5180'),
    },
    watch: {
      usePolling: true,  // Required for Docker on some systems
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
