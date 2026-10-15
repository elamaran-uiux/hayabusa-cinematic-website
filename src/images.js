import { colours } from './data.js'
const by = c => colours.find(x => x.code === c)

// ── ASSETS ─────────────────────────────────────────────────────────────
// Official Suzuki India colour images (hotlinked from suzukimotorcycle.co.in; NOT visually verified by the developer,
// reuse rights unconfirmed). Replace with licensed downloads by editing these URLs to local /images/... files.
// Local files win over the remote image. Drop a file named exactly like this into public/images/ — no code change needed.
//   .png / .webp  = transparent cut-out (shown as-is)      .jpg = studio photo (light background is keyed out in CSS)
const cands = n => ['webp','png','jpg'].map(e => `/images/${n}.${e}`)
export const HERO_SRCS = [...cands('hero'), by('YKY').img]
export const DETAIL = { 1: cands('side-profile'), 2: cands('front-detail'), 3: cands('engine'), 4: cands('brakes') }
export const REAR_SRCS = cands('rear-three-quarter')
// How a given image is made to sit on the dark page: 'light' keys out a white/grey studio background, 'soft' is gentler
// (for white bodywork), 'none' leaves transparent PNG/WebP untouched.
export const keyOf = src => /\/images\/.*\.(png|webp)$/i.test(src) ? 'none' : /JWN/.test(src) ? 'soft' : 'light'
export const FILM_COLOURS = ['AV4','C81','JWN','YKY'].map(by)   // chapter 05 sequence, Special Edition last
// User-supplied photos (source/licence unknown). rear-view.png has a white studio background.
export const REAR = '/images/rear-view.png'
export const CLUSTER = '/images/instrument-cluster.png'

// ── CAMERA ─────────────────────────────────────────────────────────────
// One camera move per chapter: [intro, silhouette, front, engine, brakes, colours].
// s = zoom, x/y = pan in % of the stage (positive x pans the picture right). Defaults assume the bike faces RIGHT in the
// colour images. If the front of the bike is on the left, set FACING = 'left'. Tune values after looking at the images.
export const FACING = 'right'
export const CAMERA = [
  { s: 1.0,  x: 5,   y: -14, m: { s: 1.0, x: 0, y: -19 } },   // intro: whole bike up, headline below (mobile: bike above text)
  { s: .95,  x: 8,   y: 9   },                                // silhouette: bike low-right, copy top-left
  { s: 2.4,  x: -26, y: 6   },   // front fairing / headlamp
  { s: 2.1,  x: -4,  y: -2  },   // engine bay
  { s: 3.0,  x: -30, y: -16 },   // front wheel + Brembo Stylema
  { s: .95,  x: 0,   y: -9  },
]

// ── OPTIONAL REAL FRAME SEQUENCE ───────────────────────────────────────
// Put frames in public/frames/ and a public/frames/manifest.json like:
//   {"count":120,"pattern":"/frames/f_{n}.webp","pad":4,"start":1}   → /frames/f_0001.webp … f_0120.webp
// When present, it replaces the still image for chapters 00–04 and plays on a <canvas> driven by scroll.
export async function loadSequence() {
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 1500)
    const r = await fetch('/frames/manifest.json', { cache: 'no-store', signal: ctl.signal }); clearTimeout(t)
    if (!r.ok || !(r.headers.get('content-type') || '').includes('json')) return null
    const m = await r.json(); if (!m.count || !m.pattern) return null
    const frames = Array.from({ length: m.count }, (_, i) => {
      const im = new Image(); im.decoding = 'async'
      im.src = m.pattern.replace('{n}', String(i + (m.start ?? 1)).padStart(m.pad ?? 4, '0')); return im })
    await new Promise(res => { frames[0].onload = frames[0].onerror = res })
    return frames[0].naturalWidth ? { count: m.count, frames } : null
  } catch { return null }
}
