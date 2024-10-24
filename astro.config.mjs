import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'
import partytown from '@astrojs/partytown'
import compress from 'astro-compress'
import robotsTxt from 'astro-robots-txt'
import react from '@astrojs/react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  site: 'https://skiercon.pl',
  output: 'static',
  trailingSlash: 'never',
  vite: {
    ssr: {
      noExternal: ['wysiwyg.css', 'astro-seo-schema', 'canvas-confetti'],
    },
  },
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    svelte(),
    tailwind(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    compress({
      svg: false,
      img: false,
      js: false,
    }),
    robotsTxt({
      sitemapBaseFileName: 'sitemap.xml',
    }),
    react(),
  ],
  hooks: {
    'astro:build:done': ({ dir }) => {
      console.log('Build finished, starting URL replacement...')
      const outputDir = path.join(dir.pathname)

      function updateImageUrls(filePath) {
        const content = fs.readFileSync(filePath, 'utf8')
        const updatedContent = content.replaceAll(
          'https://api.skiercon.pl/static/',
          '/img/'
        )
        console.log('Updating image URLs in:', filePath)
        fs.writeFileSync(filePath, updatedContent)
      }

      function processHtmlFiles(directory) {
        fs.readdir(directory, (err, files) => {
          if (err) {
            console.error('Error reading directory:', err)
            return
          }

          files.forEach(file => {
            const filePath = path.join(directory, file)

            if (fs.statSync(filePath).isDirectory()) {
              processHtmlFiles(filePath)
            } else if (
              path.extname(file) === '.html' ||
              path.extname(file) === '.js'
            ) {
              updateImageUrls(filePath)
            }
          })
        })
      }

      processHtmlFiles(outputDir)
    },
  },
})
