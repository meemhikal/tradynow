'use client'; import { motion } from 'framer-motion'; import type { ComputedSignal } from '@/lib/signal';
export default function TradeSignalCard({ symbol, signal, onClose }:{symbol:string;signal:ComputedSignal;onClose:()=>void}){
  const badge = signal.direction==='BUY'?'badge buy':signal.direction==='SELL'?'badge sell':'badge'; const frac=(v:number)=>v<1?6:v<200?4:2;
  return (<motion.div layout className="card" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}><h3 style={{margin:0}}>{symbol}</h3><button className="badge" onClick={onClose}>×</button></div>
    <div style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}><span className={badge}>{signal.direction==='BUY'?'🟢 BUY':signal.direction==='SELL'?'🔴 SELL':'⚪ NEUTRAL'}</span><span className="badge">Confidence: {signal.confidence}%</span></div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:12,marginTop:12}}>
      <div className="row"><div>Entry</div><div className="entry" style={{textAlign:'right'}}>{signal.entry.toFixed(frac(signal.entry))}</div></div>
      <div className="row"><div>Stop Loss</div><div className="stop" style={{textAlign:'right'}}>{signal.stop.toFixed(frac(signal.stop))}</div></div>
      <div className="row"><div>Take Profit</div><div className="target" style={{textAlign:'right'}}>{signal.takeProfit.toFixed(frac(signal.takeProfit))}</div></div>
      <div className="row"><div>R:R (approx)</div><div style={{textAlign:'right'}}>2.0</div></div>
    </div><p style={{marginTop:12}}>{signal.reason}</p></motion.div>); }