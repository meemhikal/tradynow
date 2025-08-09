'use client';
import { motion } from 'framer-motion';
import type { ComputedSignal } from '@/lib/signal';
import type { NewsItem } from '@/lib/util';

export default function TradeSignalCard({ symbol, signal, news, onClose }: { symbol: string; signal: ComputedSignal; news: NewsItem[]; onClose: () => void }) {
  const badgeClass = signal.direction === 'BUY' ? 'badge buy' : signal.direction === 'SELL' ? 'badge sell' : 'badge';
  const frac = (v:number)=> v < 1 ? 6 : v < 200 ? 4 : 2;
  return (
    <motion.div layout className="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',gap:8 }}>
        <h3 style={{ margin: 0 }}>{symbol}</h3>
        <button className="badge" onClick={onClose}>×</button>
      </div>
      <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:8 }}>
        <span className={badgeClass}>{signal.direction === 'BUY' ? '🟢 BUY' : signal.direction === 'SELL' ? '🔴 SELL' : '⚪ NEUTRAL'}</span>
        <span className="badge">Confidence: {signal.confidence}%</span>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:12,marginTop:12 }}>
        <div className="row"><div>Entry</div><div className="entry" style={{textAlign:'right'}}>{signal.entry.toFixed(frac(signal.entry))}</div></div>
        <div className="row"><div>Stop Loss</div><div className="stop" style={{textAlign:'right'}}>{signal.stop.toFixed(frac(signal.stop))}</div></div>
        <div className="row"><div>Take Profit</div><div className="target" style={{textAlign:'right'}}>{signal.takeProfit.toFixed(frac(signal.takeProfit))}</div></div>
        <div className="row"><div>R:R (approx)</div><div style={{textAlign:'right'}}>2.0</div></div>
      </div>
      <p style={{ marginTop: 12 }}>{signal.reason}</p>
      {!!news.length && (
        <>
          <div className="sectionTitle" style={{ marginTop: 18 }}>Related high‑impact headlines</div>
          {news.map((n) => (
            <div key={n.id+String(n.datetime)} className="row">
              <div className="avatar" style={{ background: 'radial-gradient(circle at 40% 30%, #8b5cf6, #a78bfa)', color:'#fff', fontWeight:900 }}>{n.source[0]}</div>
              <div>
                <div className="name">{n.headline}</div>
                <div className="sym">{n.source}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div className="price">{new Date(n.datetime*1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                <div className="badge" style={{ padding:'2px 8px' }}>High impact</div>
              </div>
            </div>
          ))}
        </>
      )}
    </motion.div>
  );
}
