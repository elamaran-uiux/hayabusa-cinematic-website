import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SRC, MEDIA, PRESS, stats, specs, tech, compare, shared } from './data.js'
import { REAR_SRCS, CLUSTER } from './images.js'
import Film from './Film.jsx'
gsap.registerPlugin(ScrollTrigger)

const links = [['film','Film'],['specs','Specs'],['tech','Technology'],['editions','Editions'],['pricing','Pricing']]
function Reveal({ children, delay=0, className='' }) {
  return <motion.div className={className} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-10%'}} transition={{duration:.9,delay,ease:[.2,.7,.2,1]}}>{children}</motion.div>
}
function Nav() {
  const [open,setOpen]=useState(false)
  return <header className="fixed top-0 inset-x-0 z-50 bg-ink/50 backdrop-blur border-b border-white/10">
    <nav className="flex items-center justify-between px-5 md:px-10 h-14" aria-label="Primary">
      <a href="#film" className="font-extrabold tracking-[.3em] text-sm">HAYABUSA</a>
      <ul className="hidden md:flex gap-8">{links.map(([id,t])=><li key={id}><a className="label hover:text-white" href={'#'+id}>{t}</a></li>)}</ul>
      <button className="md:hidden label p-3" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?'Close':'Menu'}</button>
    </nav>
    <AnimatePresence>{open && <motion.ul initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="md:hidden overflow-hidden bg-ink px-5">
      {links.map(([id,t])=><li key={id}><a className="block py-4 label" href={'#'+id} onClick={()=>setOpen(false)}>{t}</a></li>)}</motion.ul>}</AnimatePresence>
  </header>
}
function Stats() {
  const ref=useRef()
  useEffect(()=>{
    const ctx=gsap.context(()=>{
      if(matchMedia('(prefers-reduced-motion:reduce)').matches) return
      ref.current.querySelectorAll('[data-n]').forEach(el=>{const end=+el.dataset.n,o={v:0}
        gsap.to(o,{v:end,duration:1.8,ease:'power2.out',onUpdate:()=>el.textContent=Math.round(o.v).toLocaleString(),scrollTrigger:{trigger:el,start:'top 90%',once:true}})})},ref)
    return ()=>ctx.revert()},[])
  return <section id="stats" ref={ref} className="grid grid-cols-2 md:grid-cols-6 border-y border-white/10 bg-ink">
    {stats.map(s=><div key={s.l} className="p-6 border-r border-white/10"><p className="label">{s.l}</p>
      <p className="text-3xl md:text-4xl font-extrabold mt-2"><span data-n={s.v}>{s.v.toLocaleString()}</span></p><p className="text-xs text-silver/70">{s.u}</p></div>)}
    <p className="col-span-full px-6 py-3 text-xs text-silver/60">*Power and torque as stated in the FAQ on the official Suzuki India page.</p></section>
}
function SpecTable() {
  return <section id="specs" className="px-5 md:px-10 py-24 bg-ink">
    <p className="label mb-3">Technical specifications</p><h3 className="h-lg mb-10">THE NUMBERS.</h3>
    <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">{Object.entries(specs).map(([g,rows])=>
      <table key={g} className="w-full text-sm"><caption className="label text-left pb-3">{g}</caption><tbody>
        {rows.map(([k,v])=><tr key={k} className="border-t border-white/10 align-top"><th scope="row" className="py-3 pr-4 text-left font-normal text-silver/60 w-2/5">{k}</th><td className="py-3 break-words">{v}</td></tr>)}</tbody></table>)}</div>
    <p className="mt-8 text-xs text-silver/60">Source: <a className="underline" href={SRC} target="_blank" rel="noreferrer">Suzuki Motorcycle India</a>. Items not listed on the official page (fuel system, lubrication, cooling, starting, clutch, final drive) are omitted. *Power/torque from the page FAQ.</p></section>
}
function Tech() {
  return <section id="tech" className="px-5 md:px-10 py-24 bg-char">
    <p className="label mb-3">Suzuki Intelligent Ride System</p><h3 className="h-lg mb-10">RIDER-FOCUSED TECHNOLOGY.</h3>
    <div className="grid lg:grid-cols-3 gap-8 mb-10 items-center"><div className="aspect-[3/2] overflow-hidden bg-ink"><img src={CLUSTER} alt="Hayabusa instrument cluster with central TFT display" className="w-full h-full object-cover" loading="lazy"/></div>
      <p className="lg:col-span-2 text-silver/80 max-w-xl">The central TFT panel shows SDMS-α settings and an Active Data display with lean angle, brake pressure, acceleration and throttle position. The photo uses non-India units (mph, °F).</p></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">{tech.map(([t,d],i)=>
      <motion.article key={t} whileHover={{backgroundColor:'#1d1d20'}} className="bg-char p-6" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i%3)*.08}}>
        <p className="label">{String(i+1).padStart(2,'0')}</p><h4 className="mt-2 font-extrabold">{t}</h4><p className="mt-2 text-sm text-silver/75">{d}</p></motion.article>)}</div>
    <p className="mt-6 text-xs text-silver/60">Descriptions paraphrase the official Suzuki India page. Confirm standard vs optional equipment with a dealer. Emergency stop signal is not available in the Indian specification.</p></section>
}
function Editions() {
  const [tab,setTab]=useState('special'), e=compare[tab]
  return <section id="editions" className="px-5 md:px-10 py-24 bg-ink">
    <p className="label mb-3">Standard vs Special Edition</p><h3 className="h-lg mb-8">TWO WAYS TO FLY.</h3>
    <div role="tablist" className="flex gap-2 mb-6">{[['standard','Standard'],['special','Special Edition']].map(([k,t])=>
      <button key={k} role="tab" aria-selected={tab===k} onClick={()=>setTab(k)} className={`btn !py-3 ${tab===k?'!bg-silver !text-ink':''}`}>{t}</button>)}</div>
    <div className="grid md:grid-cols-2 gap-px bg-white/10">
      <div className="bg-ink p-6"><p className="label">{e.name}</p><p className="text-3xl font-extrabold mt-2">{e.price}</p><p className="text-xs text-silver/60">ex-showroom Delhi</p>
        <p className="label mt-6 mb-2">Colour</p><ul className="text-sm text-silver/80 space-y-1">{e.colours.map(x=><li key={x}>{x}</li>)}</ul>
        <p className="label mt-6 mb-2">{tab==='special'?'Exclusive elements':'Notes'}</p><ul className="text-sm text-silver/80 space-y-1">{e.extras.map(x=><li key={x}>{x}</li>)}</ul></div>
      <div className="bg-ink p-6"><p className="label mb-2">Shared mechanical &amp; electronic content</p><ul className="text-sm text-silver/80 space-y-2">{shared.map(x=><li key={x}>{x}</li>)}</ul>
        <p className="mt-4 text-xs text-silver/60">Suzuki does not state any engine-tune or power difference for the Special Edition.</p></div></div>
    <p className="mt-3 text-xs text-silver/60">Source: <a className="underline" href={PRESS} target="_blank" rel="noreferrer">Suzuki Motorcycle India media kit</a>, press release dated 28 Sep 2026.</p></section>
}
function Pricing() {
  return <section id="pricing" className="px-5 md:px-10 py-24 bg-char">
    <p className="label mb-3">Ex-showroom, Delhi</p><h3 className="h-lg mb-10">PRICING.</h3>
    <div className="grid md:grid-cols-2 gap-6">{[['Hayabusa',compare.standard.price],['Hayabusa Special Edition',compare.special.price]].map(([n,p])=>
      <div key={n} className="border border-white/15 p-8"><p className="label">{n}</p><p className="text-4xl font-extrabold mt-3">{p}</p><p className="mt-2 text-xs text-silver/60">Source: Suzuki press release, 28 Sep 2026 (checked 15 Oct 2026)</p></div>)}</div>
    <p className="mt-6 max-w-2xl text-sm text-silver/70">Prices are indicative reference prices sourced from Suzuki Motorcycle India's published information. Confirm the latest price, availability, and applicable charges with an authorised Suzuki dealer before purchase.</p>
    <a className="btn btn-red mt-8" href="https://www.suzukimotorcycle.co.in/find-dealer" target="_blank" rel="noreferrer">Check with an authorised dealer</a></section>
}
function RearImg() {
  const [i, setI] = useState(0)
  return i >= REAR_SRCS.length ? null : <img className="rear-img max-h-full max-w-full w-auto" src={REAR_SRCS[i]} onError={() => setI(n => n + 1)} alt="Hayabusa rear view: LED tail light, twin mufflers and rear tyre" loading="lazy"/>
}
function Closing() {
  const ref=useRef()
  useEffect(()=>{const mm=gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      gsap.fromTo('.rear-img',{scale:1.25,yPercent:8},{scale:1,yPercent:-4,ease:'none',scrollTrigger:{trigger:ref.current,start:'top bottom',end:'bottom top',scrub:true}})
      gsap.fromTo('.rear-mask',{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',ease:'none',scrollTrigger:{trigger:ref.current,start:'top 80%',end:'top 20%',scrub:true}})})
    return ()=>mm.revert()},[])
  return <section ref={ref} className="relative overflow-hidden bg-ink px-5 md:px-10 py-24 grid md:grid-cols-2 gap-10 items-center">
    <div><p className="label mb-3">Finished with precision</p><Reveal><h3 className="h-xl">THE LEGEND CONTINUES.</h3></Reveal>
      <p className="mt-5 max-w-md text-silver/80">Discover the machine that brings iconic design and advanced engineering together.</p>
      <div className="mt-8 flex flex-wrap gap-3"><a className="btn btn-red" href={SRC} target="_blank" rel="noreferrer">Explore Hayabusa</a><a className="btn" href="https://www.suzukimotorcycle.co.in" target="_blank" rel="noreferrer">Visit Suzuki India</a></div></div>
    <div className="rear-mask overflow-hidden h-[60vh] md:h-[70vh] grid place-items-center"><RearImg/></div></section>
}
function Footer() {
  return <footer className="px-5 md:px-10 py-12 bg-ink border-t border-white/10 text-xs text-silver/70 space-y-3">
    <p className="label">Hayabusa concept project</p>
    <p className="flex flex-wrap gap-4">{links.map(([id,t])=><a key={id} href={'#'+id} className="underline">{t}</a>)}<a className="underline" href={SRC} target="_blank" rel="noreferrer">Product source</a><a className="underline" href={MEDIA} target="_blank" rel="noreferrer">Media kit</a></p>
    <p>Image credits: colour images are linked from Suzuki Motorcycle India's website and remain Suzuki's property; the instrument-cluster and rear photographs are user-supplied with unconfirmed licences (see README). Suzuki and Hayabusa are trademarks of Suzuki Motor Corporation.</p>
    <p>Independent portfolio concept. Not affiliated with or endorsed by Suzuki. Product information is presented for informational and design-demonstration purposes and should be confirmed with Suzuki Motorcycle India.</p></footer>
}
export default function App() {
  return <MotionConfig reducedMotion="user"><Nav/><main><Film/><Stats/><SpecTable/><Tech/><Editions/><Pricing/><Closing/></main><Footer/></MotionConfig>
}
