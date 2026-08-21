const fs = require('node:fs')
const path = require('node:path')
const { GIFEncoder, applyPalette, quantize } = require('gifenc')
const { PNG } = require('pngjs')

const ROOT = path.resolve(__dirname, '..')
const SHEETS = path.join(ROOT, 'assets/original-pilot/sheets')
const IMAGES = path.join(ROOT, 'assets/original-pilot/img')
const GIFS = path.join(ROOT, 'assets/original-pilot/gif')

const assets = [
  { slug: 'barbell-back-squat', columns: 3, rows: 2 },
  { slug: 'barbell-bench-press', columns: 3, rows: 2 },
  { slug: 'conventional-deadlift', columns: 3, rows: 2 },
  { slug: 'strict-pull-up', columns: 2, rows: 2 },
  { slug: 'alternating-dumbbell-curl', columns: 3, rows: 2 },
]

function crop(source, x, y, width, height) {
  const target = new PNG({ width, height })
  for (let row = 0; row < height; row += 1) {
    const sourceStart = ((y + row) * source.width + x) * 4
    const targetStart = row * width * 4
    source.data.copy(target.data, targetStart, sourceStart, sourceStart + width * 4)
  }
  return target
}

function encodeAnimation(frames, width, height) {
  const encoder = GIFEncoder()
  frames.forEach((frame, index) => {
    const palette = quantize(frame.data, 128, { format: 'rgb565' })
    const pixels = applyPalette(frame.data, palette, 'rgb565')
    encoder.writeFrame(pixels, width, height, {
      palette,
      delay: index === 0 || index === frames.length - 1 ? 500 : 180,
      repeat: 0,
    })
  })
  encoder.finish()
  return Buffer.from(encoder.bytes())
}

fs.mkdirSync(IMAGES, { recursive: true })
fs.mkdirSync(GIFS, { recursive: true })

for (const asset of assets) {
  const sheet = PNG.sync.read(fs.readFileSync(path.join(SHEETS, `${asset.slug}.png`)))
  const width = Math.floor(sheet.width / asset.columns)
  const height = Math.floor(sheet.height / asset.rows)
  const frames = []
  for (let index = 0; index < asset.columns * asset.rows; index += 1) {
    frames.push(crop(sheet, (index % asset.columns) * width, Math.floor(index / asset.columns) * height, width, height))
  }
  fs.writeFileSync(path.join(IMAGES, `${asset.slug}.png`), PNG.sync.write(frames[0]))
  fs.writeFileSync(path.join(GIFS, `${asset.slug}.gif`), encodeAnimation(frames, width, height))
  console.log(`${asset.slug}: ${frames.length} frames, ${width}x${height}`)
}
