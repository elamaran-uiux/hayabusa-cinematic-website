// Reports the real pixel size of every image in public/images (PNG, JPEG, WebP) and flags the ones that are too small.
import fs from 'node:fs'; import path from 'node:path'
const dir = 'public/images', MIN = { hero: 2400, default: 1600 }
const size = b => {
  if (b.toString('ascii', 1, 4) === 'PNG') return [b.readUInt32BE(16), b.readUInt32BE(20)]
  if (b[0] === 0xff && b[1] === 0xd8) { let i = 2; while (i < b.length) { if (b[i] !== 0xff) { i++; continue } const m = b[i + 1]
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + b.readUInt16BE(i + 2) } }
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') { const t = b.toString('ascii', 12, 16)
    if (t === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)]
    if (t === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]
    if (t === 'VP8L') { const v = b.readUInt32LE(21); return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1] } }
  return null }
const want = ['hero', 'front-detail', 'engine', 'brakes', 'rear-three-quarter'] // side-profile is optional: chapter 01 reuses the hero
const files = fs.existsSync(dir) ? fs.readdirSync(dir) : []
for (const f of files) { const s = size(fs.readFileSync(path.join(dir, f))); const base = f.replace(/\.\w+$/, '')
  const min = MIN[base] ?? MIN.default
  console.log(s ? `${f.padEnd(28)} ${s[0]}×${s[1]}  ${s[0] >= min ? 'OK' : `TOO SMALL (want ≥ ${min}px wide)`}` : `${f.padEnd(28)} unreadable format`) }
for (const w of want) if (!files.some(f => f.replace(/\.\w+$/, '') === w)) console.log(`MISSING  public/images/${w}.(webp|png|jpg)`)
