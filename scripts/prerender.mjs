// Injects server-rendered markup, font preloads and structured data into
// dist/index.html, then removes the temporary server bundle.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'

const dist = new URL('../dist/', import.meta.url)
const serverDir = new URL('.server/', dist)
const indexFile = new URL('index.html', dist)
const ROOT = '<div id="root"></div>'

const { render, structuredData } = await import(
  new URL('entry-server.js', serverDir).href
)

let html = await readFile(indexFile, 'utf8')
if (!html.includes(ROOT)) throw new Error(`prerender: ${ROOT} not found`)

// Only the Latin subsets are needed above the fold.
const fonts = (await readdir(new URL('assets/', dist))).filter((file) =>
  /^geist(-mono)?-latin-wght-normal-[\w-]+\.woff2$/.test(file),
)
const headTags = [
  ...fonts.map(
    (file) =>
      `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`,
  ),
  `<script type="application/ld+json">${structuredData()}</script>`,
]

// Inline the single stylesheet so first paint needs no extra round trip.
// The file stays in dist/assets for the fonts' relative URLs and caching.
const stylesheet = html.match(
  /<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/,
)
if (stylesheet) {
  const css = await readFile(new URL(stylesheet[1], dist), 'utf8')
  html = html.replace(stylesheet[0], `<style>${css}</style>`)
}

html = html
  .replace(ROOT, `<div id="root">${render()}</div>`)
  .replace('</head>', `  ${headTags.join('\n    ')}\n  </head>`)

await writeFile(indexFile, html)
await rm(serverDir, { recursive: true, force: true })

console.log(
  `prerender: wrote dist/index.html (${fonts.length} font preloads, css ${stylesheet ? 'inlined' : 'linked'})`,
)
