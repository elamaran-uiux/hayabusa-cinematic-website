import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'framer-motion'
import { HERO_SRCS, DETAIL, keyOf, FILM_COLOURS, CAMERA, FACING, CLUSTER, loadSequence } from './images.js'
gsap.registerPlugin(ScrollTrigger)

export const CH = [
 {eyebrow:'Suzuki Motorcycle India',t:'THE LEGEND, REFINED.',p:'An icon of aerodynamic design, inline-four performance, and advanced rider-focused technology.',pos:'left-5 md:left-10 bottom-16 md:bottom-16'},
 {n:'01',eyebrow:'The silhouette',t:'SCULPTED TO MOVE.',p:'A long, low stance with an upswept tail and mufflers, shaped through wind-tunnel testing and CAE analysis. Suzuki’s design concept: “The Refined Beast”.',pos:'left-5 md:left-10 top-24 md:top-28',meta:['Overall length 2,180 mm','Wheelbase 1,480 mm','Seat height 800 mm']},
 {n:'02',eyebrow:'Front fairing',t:'A SIGNATURE IN EVERY DETAIL.',p:'Vertically stacked LED low beam with a projector-type LED high beam give the Hayabusa its distinctive lighting signature.',pos:'left-5 md:left-10 top-24 md:top-28',meta:['LED low & high beam','LED taillight and rear turn signals','Wind-tunnel developed bodywork']},
 {n:'03',eyebrow:'Engine',t:'ENGINEERED WITH INTENT.',p:'A 1,340 cm³ liquid-cooled inline-four with Twin Swirl Combustion Chamber design, ride-by-wire throttle and a 6-speed constant mesh gearbox.',pos:'right-5 md:right-10 top-24 md:top-28 text-right',meta:['Bore × stroke 81.0 × 65.0 mm','Compression ratio 12.5:1','190 PS @ 9,700 rpm* · 150 Nm @ 7,000 rpm*'],plate:true},
 {n:'04',eyebrow:'Brakes & wheels',t:'STOPPING POWER, SHAPED.',p:'Brembo Stylema 4-piston calipers on twin 320 mm full-floating discs with ABS, and Bridgestone BATTLAX HYPERSPORT S22 tyres on 7-spoke wheels.',pos:'right-5 md:right-10 bottom-24 md:bottom-28 text-right',meta:['Front 120/70ZR17 · Rear 190/50ZR17','KYB inverted forks, 120 mm travel','Nissin rear disc with ABS']},
 {n:'05',eyebrow:'Colours',t:'CHOOSE YOUR FINISH.',pos:'left-5 right-5 bottom-24 text-center mx-auto',colours:true}]
const U = CH.length

function KeyDefs() { // luminance keys: remove light studio backgrounds so the bike sits on the dark page
  return <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}><defs>
    <filter id="key-light" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -0.9 -0.9 -0.9 0 2.45" /></filter>
    <filter id="key-soft" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -2 -2 -2 0 5.85" /></filter></defs></svg>
}
function Img({ src, alt, className = '', ...p }) {
  const list = [].concat(src), [i, setI] = useState(0)
  if (i >= list.length) return null
  const cur = list[i]
  return <img src={cur} alt={alt} className={`${className} key-${keyOf(cur)}`} decoding="async" referrerPolicy="no-referrer"
    onLoad={e => { if (import.meta.env.DEV) { const w = e.currentTarget.naturalWidth; console[w < 1600 ? 'warn' : 'info'](`[image] ${cur} ${w}×${e.currentTarget.naturalHeight}${w < 1600 ? ' — LOW RESOLUTION for a full-screen hero' : ''}`) } }}
    onError={() => setI(n => n + 1)} {...p} />
}
const cam = (i, mobile) => { const c = (mobile && CAMERA[i].m) || CAMERA[i], d = FACING === 'left' ? -1 : 1, k = mobile && !CAMERA[i].m ? .8 : 1
  return { scale: 1 + (c.s - 1) * k, xPercent: c.x * d * k, yPercent: c.y * k } }

function ChapterText({ c, i, link, cols }) {
  return <div className={`ch ch-${i} ${c.pos}`}>
    <p className="label mb-3 eb">{c.n ? c.n + ' — ' : ''}{c.eyebrow}</p>
    <h3 className="h-lg">{c.t.split(' ').map((w, k) => <span key={k} className="inline-block overflow-hidden align-bottom mr-[.25em]"><span className="tt inline-block">{w}</span></span>)}</h3>
    {c.p && <p className="pp mt-5 text-silver/85 text-sm md:text-base">{c.p}</p>}
    {c.meta && <div className="mt-4">{c.meta.map(m => <p key={m} className="mt">{m}</p>)}</div>}
    {i===0 && <div className="mt-7 flex flex-wrap gap-3 cta"><button className="btn btn-red" onClick={() => link(1)}>Explore the machine</button><button className="btn" onClick={() => link(5.9)}>Discover the special edition</button></div>}
    {c.colours && !cols.length && <p className="pp mt-4 text-sm text-silver/80">Colour options are listed on the <a className="underline" href="https://www.suzukimotorcycle.co.in/product-details/hayabusa" target="_blank" rel="noreferrer">official Suzuki India page</a>.</p>}
    {c.colours && cols.length > 0 && <div className="relative h-24 mt-4">{cols.map((x, k) => <div key={x.code} className={`absolute inset-0 cl cl-${k}`}>
      <p className="label">{x.tag ? 'Special Edition · ' : 'Standard · '}{x.code}</p><p className="text-xl md:text-2xl font-extrabold mt-1">{x.name}</p></div>)}</div>}
    {c.colours && cols.some(x => x.tag) && <ul className="se absolute left-0 right-0 -top-44 md:-top-40 text-xs text-silver/80 space-y-1 hidden sm:block">
      <li>Special decals and wheel finish · 3D SUZUKI tank emblem</li><li>Anodised muffler-end and heat-guard · single-seat cowl as standard</li></ul>}
  </div>
}

export default function Film() {
  const reduced = useReducedMotion()
  const [seq, setSeq] = useState(undefined), [have, setHave] = useState(undefined), [cols, setCols] = useState(undefined)
  const root = useRef(), stRef = useRef()
  useEffect(() => { let on = true; loadSequence().then(s => on && setSeq(s)); return () => { on = false } }, [])
  useEffect(() => { let on = true // find which close-up photos actually exist in public/images (first loadable candidate wins)
    const probe = list => list.reduce((p, src) => p.then(f => f || new Promise(r => { const im = new Image(); im.onload = () => { if (import.meta.env.DEV) console.info(`[image] ${src} ${im.naturalWidth}×${im.naturalHeight}`); r(src) }; im.onerror = () => r(null); im.src = src })), Promise.resolve(null))
    Promise.all(Object.entries(DETAIL).map(([k, l]) => probe(l).then(src => [k, src]))).then(r => on && setHave(Object.fromEntries(r.filter(x => x[1]))))
    Promise.all(FILM_COLOURS.map(c => new Promise(r => { const im = new Image(); im.referrerPolicy = 'no-referrer'; im.onload = () => r(c); im.onerror = () => r(null); im.src = c.img }))).then(r => on && setCols(r.filter(Boolean)))
    return () => { on = false } }, [])
  const link = u => { const st = stRef.current; if (st) window.scrollTo({ top: st.start + (st.end - st.start) * (u / U), behavior: 'smooth' }) }

  useEffect(() => {
    if (reduced || seq === undefined || have === undefined || cols === undefined) return
    let dead = false
    const mm = gsap.matchMedia()
    mm.add({ mobile: '(max-width:899px)', desktop: '(min-width:900px)' }, ctx => {
      const mobile = ctx.conditions.mobile, el = root.current, q = gsap.utils.selector(el)
      const html = document.documentElement; html.style.overflow = 'hidden'
      const canvas = q('canvas')[0], proxy = { f: 0 }
      const draw = () => { if (!canvas || !seq) return; const im = seq.frames[Math.round(proxy.f)]; if (!im?.complete || !im.naturalWidth) return
        if (canvas.width !== im.naturalWidth) { canvas.width = im.naturalWidth; canvas.height = im.naturalHeight }
        canvas.getContext('2d').drawImage(im, 0, 0) }
      draw()
      gsap.set(q('.dolly'), { scale: 1.1, autoAlpha: 0 }); gsap.set(q('.ghost-w'), { autoAlpha: 0 })
      gsap.set(q('.ch-0 .tt'), { yPercent: 115 }); gsap.set(q('.ch-0 .eb,.ch-0 .pp,.ch-0 .cta'), { autoAlpha: 0, y: 24 })
      gsap.set(q('.cam'), cam(0, mobile)); gsap.set(q('.cam'), { scale: CAMERA[0].s * 1.0 })

      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        trigger: el, start: 'top top', end: () => '+=' + Math.round(innerHeight * (mobile ? 4.4 : 7.2)), pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: s => { const i = Math.min(U - 1, Math.floor(s.progress * U)); const c = q('.count')[0]; if (c) c.textContent = (CH[i].n || '00') + ' / 05' },
        onRefresh: s => { stRef.current = s } } })
      CAMERA.forEach((_, i) => { if (i) tl.to(q('.cam'), { ...cam(i, mobile), duration: .55, ease: 'power2.inOut' }, i - .35) })
      if (seq) tl.to(proxy, { f: seq.count - 1, duration: 5, onUpdate: draw }, 0)
      tl.fromTo(q('.ghost'), { xPercent: 6 }, { xPercent: -48, duration: U }, 0).to(q('.ghost'), { autoAlpha: 0, duration: .4 }, 4.9)
       .fromTo(q('.light'), { xPercent: 0 }, { xPercent: -18, duration: 4 }, 0)
       .to(q('.light-red'), { autoAlpha: 1, duration: .4 }, 3.4).to(q('.light-red'), { autoAlpha: 0, duration: .4 }, 4.7)
       .fromTo(q('.bar-t,.bar-b'), { scaleY: 0 }, { scaleY: 1, duration: .3 }, 1.7).to(q('.bar-t,.bar-b'), { scaleY: 0, duration: .3 }, 4.75)
       .fromTo(q('.rail i'), { scaleY: 0 }, { scaleY: 1, duration: U }, 0)
      CH.forEach((c, i) => {
        const w = q('.ch-' + i)
        if (i) { tl.fromTo(w, { autoAlpha: 0 }, { autoAlpha: 1, duration: .2 }, i - .1)
          .fromTo(q(`.ch-${i} .tt`), { yPercent: 110 }, { yPercent: 0, duration: .3, ease: 'power3.out' }, i - .1)
          
          if (q(`.ch-${i} .pp`).length) tl.fromTo(q(`.ch-${i} .pp`), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .25 }, i + .02)
          if (q(`.ch-${i} .mt`).length) tl.fromTo(q(`.ch-${i} .mt`), { x: -24, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: .05, duration: .18 }, i + .08) }
        if (i < U - 1) tl.to(w, { autoAlpha: 0, y: -50, duration: .2 }, i + .72)
      })
      Object.keys(have).forEach(k => { const i = +k  // chapter-specific photo overrides the camera crop when supplied
        tl.fromTo(q('.dt-' + i), { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: .35, ease: 'power1.out' }, i - .2).to(q('.dt-' + i), { scale: 1.045, duration: .6 }, i + .15).to(q('.dt-' + i), { autoAlpha: 0, duration: .2 }, i + .75) })
      tl.fromTo(q('.plate'), { xPercent: 120, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: .3, ease: 'power2.out' }, 2.95).to(q('.plate'), { xPercent: 120, autoAlpha: 0, duration: .22 }, 3.74)
      // colours: wipe between official colour images, labels in sync, Special Edition last
      if (cols.length) tl.to(q('.base'), { autoAlpha: 0, duration: .2 }, 4.95).fromTo(q('.col-0'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .2 }, 4.9)
      cols.forEach((_, k) => { const t = 5 + k * .22
        if (k) tl.fromTo(q('.col-' + k), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .18 }, t)
        tl.fromTo(q('.cl-' + k), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .1 }, t + (k ? .02 : .1))
        if (k < cols.length - 1) tl.to(q('.cl-' + k), { autoAlpha: 0, y: -14, duration: .08 }, t + .2) })
      if (cols.some(x => x.tag)) tl.fromTo(q('.se'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .1 }, 5.72)
      tl.set({}, {}, U)

      // opening film: curtain → reveal → dolly out
      const ready = new Promise(res => { const im = q('.base img')[0] || canvas
        if (!im || im.complete || canvas) res(); else { im.addEventListener('load', res); im.addEventListener('error', res) }; setTimeout(res, 3500) })
      Promise.all([ready, new Promise(r => setTimeout(r, 300))]).then(() => { if (dead) return
        gsap.timeline({ onComplete: () => { html.style.overflow = ''; gsap.set('.curtain', { display: 'none' }); ScrollTrigger.refresh() } })
          .to(q('.curtain'), { autoAlpha: 0, duration: 1.0, ease: 'power1.inOut' })
          .to(q('.dolly'), { autoAlpha: 1, duration: 1.4, ease: 'power1.out' }, .1)
          .to(q('.dolly'), { scale: 1, duration: 2.6, ease: 'power2.out' }, .1)
          .to(q('.ghost-w'), { autoAlpha: 1, duration: 1.6 }, .6)
          .to(q('.ch-0 .tt'), { yPercent: 0, duration: 1, stagger: .09, ease: 'power3.out' }, .9)
          .to(q('.ch-0 .eb,.ch-0 .pp,.ch-0 .cta'), { autoAlpha: 1, y: 0, duration: .9, stagger: .12 }, 1.2) })
      return () => { dead = true; html.style.overflow = '' }
    })
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh); addEventListener('load', refresh)
    return () => { dead = true; mm.revert(); removeEventListener('load', refresh); stRef.current = null }
  }, [reduced, seq, have, cols])

  const ReducedArt = ({ i }) => { const c = CAMERA[i], d = FACING === 'left' ? -1 : 1
    return <div className="relative aspect-[16/9] overflow-hidden bg-ink border border-white/10"><div className="absolute inset-0 grid place-items-center" style={{ transform: `translate(${c.x * d}%,${c.y}%) scale(${c.s})` }}>
      <div className="art"><Img src={HERO_SRCS} alt="Suzuki Hayabusa" /></div></div></div> }

  if (reduced) return <section id="film" className="px-5 md:px-10 py-24 space-y-24"><KeyDefs/>{CH.map((c, i) => <div key={i} className="grid md:grid-cols-2 gap-8 items-center">
    <div className="space-y-3"><p className="label">{c.n ? c.n + ' — ' : ''}{c.eyebrow}</p><h3 className={i===0?'h-xl':'h-lg'}>{c.t}</h3>{c.p && <p className="text-silver/80 max-w-md">{c.p}</p>}{c.meta?.map(m => <p key={m} className="mt">{m}</p>)}
      {c.colours && <ul className="text-sm text-silver/80">{FILM_COLOURS.map(x => <li key={x.code}>{x.code} — {x.name}{x.tag ? ' (Special Edition)' : ''}</li>)}</ul>}</div><ReducedArt i={i} /></div>)}</section>

  return <section id="film" ref={root} className="film" aria-label="Hayabusa scroll film"><KeyDefs/>
    <div className="layer light"/><div className="layer light-red"/>
    <div className="layer ghost-w"><div className="ghost" aria-hidden="true">HAYABUSA</div></div>
    <div className="layer dolly"><div className="cam"><div className="art"><div className="floor"/>
      <div className="base absolute inset-0">{seq ? <canvas aria-label="Hayabusa" /> : <Img src={HERO_SRCS} alt="Suzuki Hayabusa Special Edition in Pearl Vigor Blue" fetchpriority="high" />}</div>
      {(cols || []).map((x, k) => <div key={x.code} className={`absolute inset-0 col-${k}`} style={{ opacity: k === 0 ? 0 : 1, zIndex: k + 1 }}><Img src={x.img} alt={`Hayabusa ${x.name}`} /></div>)}
    </div></div></div>
    {Object.entries(have || {}).map(([k, src]) => <div key={k} className={`layer detail dt-${k}`}><img src={src} alt="" className={`key-${keyOf(src)}`} /></div>)}
    <div className="layer vig"/><div className="layer shade-l"/>
    <div className="bar bar-t"/><div className="bar bar-b"/>
    {CH.map((c, i) => <ChapterText key={i} c={c} i={i} link={link} cols={cols || []} />)}
    <img className="plate absolute z-[6] right-5 md:right-10 bottom-24 w-[34vw] md:w-[26vw] border border-white/20 opacity-0" src={CLUSTER} alt="Hayabusa instrument cluster with central TFT display (non-India units shown)" />
    <div className="rail" aria-hidden="true"><i/></div>
    <p className="count label absolute z-[7] left-5 md:left-10 bottom-8">00 / 05</p>
    <p className="label absolute z-[7] right-5 md:right-10 bottom-8">Scroll</p>
    <div className="curtain"/>
  </section>
}
