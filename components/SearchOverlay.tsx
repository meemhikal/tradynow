'use client';
import { useEffect, useMemo, useRef, useState } from 'react'; import { AnimatePresence, motion } from 'framer-motion';
import TradeSignalCard from './TradeSignalCard'; import { SUPPORTED, TRENDING, fmtPrice } from '@/lib/util'; import { computeSignal } from '@/lib/signal';
import type { AllowedSymbol, CandleResponse, Instrument } from './types';
export default function SearchOverlay(){
  const [q,setQ]=useState(''); const [instruments,setInstruments]=useState<Instrument[]>(SUPPORTED); const [dropdown,setDropdown]=useState<Instrument[]>([]);
  const [picked,setPicked]=useState<AllowedSymbol|null>(null); const [signal,setSignal]=useState<ReturnType<typeof computeSignal>|null>(null);
  const inputRef=useRef<HTMLInputElement>(null); useEffect(()=>{inputRef.current?.focus();},[]);
  useEffect(()=>{ let cancelled=false; (async()=>{ const updated=await Promise.all(SUPPORTED.map(async t=>{ try{ const r=await fetch(`/api/prices?symbol=${encodeURIComponent(t.symbol)}&interval=60`,{cache:'no-store'}); const j=await r.json(); return {...t,price:Number(j.lastPrice||0),change:Number(j.pctChange||0)};}catch{ return t; } })); if(!cancelled) setInstruments(updated); })(); return()=>{cancelled=true}; },[]);
  const trending=useMemo(()=>TRENDING.map(sym=>instruments.find(s=>s.symbol===sym)!).filter(Boolean) as Instrument[],[instruments]);
  function onInput(v:string){ setQ(v); const s=v.trim().toLowerCase().replace(/\W+/g,''); if(!s){ setDropdown([]); return; } const list=instruments.filter(t=>(t.name+t.symbol).toLowerCase().replace(/\W+/g,'').includes(s)); setDropdown(list); }
  async function selectSymbol(sym:AllowedSymbol){ setPicked(sym); setSignal(null); const prices:CandleResponse=await fetch(`/api/prices?symbol=${encodeURIComponent(sym)}&interval=60`,{cache:'no-store'}).then(r=>r.json()); const sig=computeSignal(prices.candles); setSignal(sig); }
  return (<div className="overlay">
    <div className="searchShell"><input ref={inputRef} className="searchInput" placeholder="Type to analyze" value={q} onChange={(e)=>onInput(e.target.value)} /><div className="kbd">⌘ /</div></div>
    <div className="panel"><div className="sectionTitle">Trending 🔥</div>
      {trending.map(t=>{ const up=(t?.change??0)>=0; return (<div key={t.symbol} className="row" onClick={()=>selectSymbol(t.symbol)}>
        <div className="avatar" style={{background:'radial-gradient(circle at 40% 30%, #dbeafe, #a78bfa)',color:'#fff',fontWeight:900}}>◎</div>
        <div><div className="name">{t.name} <span className="tag">{t.kind}</span></div><div className="sym">{t.symbol}</div></div>
        <div style={{textAlign:'right'}}><div className="price">{fmtPrice(t.price||0,t.kind)}</div><div className={`chg ${up?'up':'down'}`}>{up?'▲':'▼'} {Math.abs(t.change||0).toFixed(2)}%</div></div>
      </div>); })}
    </div>
    <AnimatePresence>{dropdown.length>0 && (<motion.div className="dropdown" initial={{opacity:0,y:-6,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-6,scale:.98}}>
      {dropdown.map(t=>{ const up=(t.change??0)>=0; return (<div key={t.symbol} className="row" onClick={()=>selectSymbol(t.symbol)}>
        <div className="avatar" style={{background:'radial-gradient(circle at 40% 30%, #dbeafe, #a78bfa)',color:'#fff',fontWeight:900}}>◎</div>
        <div><div className="name">{t.name} <span className="tag">{t.kind}</span></div><div className="sym">{t.symbol}</div></div>
        <div style={{textAlign:'right'}}><div className="price">{fmtPrice(t.price||0,t.kind)}</div><div className={`chg ${up?'up':'down'}`}>{up?'▲':'▼'} {Math.abs(t.change||0).toFixed(2)}%</div></div>
      </div>); })}
    </motion.div>)}</AnimatePresence>
    <AnimatePresence>{picked&&signal&&(<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{marginTop:16}}>
      <TradeSignalCard symbol={picked} signal={signal} onClose={()=>{ setPicked(null); setSignal(null); setQ(''); setDropdown([]); }} />
    </motion.div>)}</AnimatePresence>
  </div>); }