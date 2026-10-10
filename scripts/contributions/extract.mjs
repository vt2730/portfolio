// Reads GitHub contribution-graph screenshots and prints one intensity digit
// (0–4) per day, January 1 → December 31, for src/data/github.ts.
//
//   node scripts/contributions/extract.mjs scripts/contributions/screenshots/2025.png
//
// Expects GitHub's dark "dimmed" theme at 100% zoom: 10px cells on a 13px
// grid. Totals and the commit / pull request / review split are read from
// the screenshot by hand — only the grid is sampled here.
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'
import { inflateSync } from 'node:zlib'

const STEP = 13
const CELL = 10
const LEVELS = {
  '#2a313c': 0,
  '#1b4721': 1,
  '#2b6a30': 2,
  '#46954a': 3,
  '#6bc46d': 4,
}

function decodePng(file) {
  const buf = readFileSync(file)
  let pos = 8
  let width, height, depth, colorType
  const idat = []
  while (pos < buf.length) {
    const length = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + length)
    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      depth = data[8]
      colorType = data[9]
      if (data[12] !== 0) throw new Error('Interlaced PNGs are not supported')
    } else if (type === 'IDAT') {
      idat.push(data)
    }
    pos += 12 + length
  }
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType]
  if (depth !== 8 || !channels) {
    throw new Error(`Unsupported PNG (depth ${depth}, colour type ${colorType})`)
  }

  const raw = inflateSync(Buffer.concat(idat))
  const stride = width * channels
  const pixels = Buffer.alloc(height * stride)
  let p = 0
  for (let y = 0; y < height; y++) {
    const filter = raw[p++]
    const row = pixels.subarray(y * stride, (y + 1) * stride)
    const prev = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null
    for (let i = 0; i < stride; i++) {
      const x = raw[p++]
      const a = i >= channels ? row[i - channels] : 0
      const b = prev ? prev[i] : 0
      const c = prev && i >= channels ? prev[i - channels] : 0
      let value
      switch (filter) {
        case 0:
          value = x
          break
        case 1:
          value = x + a
          break
        case 2:
          value = x + b
          break
        case 3:
          value = x + ((a + b) >> 1)
          break
        case 4: {
          const estimate = a + b - c
          const pa = Math.abs(estimate - a)
          const pb = Math.abs(estimate - b)
          const pc = Math.abs(estimate - c)
          value = x + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)
          break
        }
        default:
          throw new Error(`Unknown PNG filter ${filter}`)
      }
      row[i] = value & 0xff
    }
  }

  const hexAt = (x, y) => {
    const i = y * stride + x * channels
    const rgb = channels >= 3 ? [pixels[i], pixels[i + 1], pixels[i + 2]] : [pixels[i], pixels[i], pixels[i]]
    return '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('')
  }
  return { width, height, hexAt }
}

/** Locates the grid by finding the top-left-most and bottom-right-most cell pixels. */
function findGrid(image) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      if (!(image.hexAt(x, y) in LEVELS)) continue
      if (y < minY) minY = y
      if (x < minX) minX = x
      if (x > maxX) maxX = x
    }
  }
  if (!Number.isFinite(minX)) throw new Error('No contribution cells found')
  return {
    x0: minX,
    y0: minY,
    columns: Math.round((maxX - minX) / STEP) + 1,
  }
}

function extract(file) {
  const image = decodePng(file)
  const { x0, y0, columns } = findGrid(image)
  const days = []
  for (let column = 0; column < columns; column++) {
    for (let row = 0; row < 7; row++) {
      const hex = image.hexAt(x0 + column * STEP + CELL / 2, y0 + row * STEP + CELL / 2)
      if (hex in LEVELS) days.push({ column, row, level: LEVELS[hex] })
    }
  }
  return days
}

for (const file of process.argv.slice(2)) {
  const days = extract(file)
  const year = Number(basename(file, '.png'))
  const jan1 = new Date(Date.UTC(year, 0, 1)).getUTCDay()
  const expected = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / 864e5
  const [first] = days
  if (
    Number.isInteger(year) &&
    (days.length !== expected || first.row !== jan1)
  ) {
    console.error(
      `${file}: found ${days.length} cells starting on weekday ${first.row}, ` +
        `expected ${expected} starting on weekday ${jan1}`,
    )
    process.exitCode = 1
  }
  console.log(`${basename(file)}: ${days.length} days`)
  console.log(days.map((day) => day.level).join(''))
}
