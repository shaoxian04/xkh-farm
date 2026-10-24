import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Link previews (WhatsApp, Facebook) only fetch an og:image given as a full
// URL; a root-relative path is ignored. Vercel sets the production domain at
// build time, so prefix it there. SITE_URL overrides it, e.g. once a custom
// domain is attached.
function absoluteOgImage() {
  const host = process.env.SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL
  return {
    name: 'absolute-og-image',
    transformIndexHtml(html) {
      if (!host) return html
      const origin = host.startsWith('http') ? host : `https://${host}`
      return html.replace(
        /(<meta property="og:image" content=")\//,
        `$1${origin.replace(/\/$/, '')}/`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    absoluteOgImage(),
  ],
})
