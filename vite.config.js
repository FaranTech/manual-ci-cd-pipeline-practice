import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves a project repo at username.github.io/repo-name/
  // so assets need this base path. Set it to your repo name before deploying.
  // (Not needed if you deploy to Vercel/Netlify instead.)
  base: '/manual-ci-cd-pipeline-practice/',
})
