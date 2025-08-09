'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TradeSignalCard from './TradeSignalCard';
import { SUPPORTED, TRENDING, fmtPrice, type NewsItem } from '@/lib/util';
import { computeSignal } from '@/lib/signal';
import type { AllowedSymbol, CandleResponse, Instrument } from './types';

export default function SearchOverlay(){
  const [q, setQ] = useState('');
  const [dropdown, setDropdown] = useState<Instrument[]>([]);
  const [picked, setPicked] = useState<AllowedSymbol | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [signal, setSignal] = useState<ReturnType<typeof computeSignal> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{ inputRef.current?.focus(); }, []);

  const trending = useMemo(()=> TRENDING.map(sym => SUPPORTED.find(s=>s.symbol===sym)!).filter(Boolean) as Instrument[], []);

  function onInput(v: string){
    setQ(v);
    if(!v.trim()) { setDropdown([]); return; }
    const list = SUPPORTED.filter(t => (t.name+t.symbol).toLowerCase().includes(v.toLowerCase()));
    setDropdown(list);
  }

  async function selectSymbol(sym: AllowedSymbol){
    setPicked(sym); setSignal(null); setNews([]);
    const prices: CandleResponse = await fetch(`/api/prices?symbol=${encodeURIComponent(sym)}&interval=60`, { cache: 'no-store' }).then(r=>r.json());
    const allNews: NewsItem[] = await fetch('/api/news').then(r=>r.json()).catch(()=>[]);
    const related = allNews.filter(n => `${sym}`.toLowerCase().split(/[^a-z]+/i).some(tok => tok && n.headline?.toLowerCase().includes(tok)));
    const sig = computeSignal(prices.candles, related);
    setSignal(sig); setNews(related);
  }

  return (
    <div className="overlay">
      <div className="searchShell">
        <input ref={inputRef} className="searchInput" placeholder="Type to analyze" value={q} onChange={(e)=>onInput(e.target.value)} />
        <div className="kbd">⌘ /</div>
      </div>

      {/* Trending — always visible */}
      <div className="panel fadeIn" style={{ marginTop: 12 }}>
        <div className="sectionTitle">Trending 🔥</div>
        <div id="trending">
          {trending.map(t=>{
            const up = t.change >= 0;
            return (
              <div key={t.symbol} className="row slideIn" onClick={()=> selectSymbol(t.symbol)}>
                <div className="avatar" style={{ background:'radial-gradient(circle at 40% 30%, #dbeafe, #a78bfa)', color:'#fff', fontWeight:900 }}>◎</div>
                <div>
                  <div className="name">{t.name} <span className="tag">{t.kind}</span></div>
                  <div className="sym">{t.symbol}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div className="price">{fmtPrice(t.price, t.kind)}</div>
                  <div className={`chg ${up? 'up':'down'}`}>{up ? '▲' : '▼'} {Math.abs(t.change).toFixed(2)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dropdown — shown only when typing */}
      <AnimatePresence>
        {dropdown.length>0 && (
          <motion.div className="dropdown" initial={{ opacity: 0, y: -6, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: .98 }}>
            {dropdown.map((t) => {
              const up = t.change >= 0;
              return (
                <div key={t.symbol} className="row slideIn" onClick={()=> selectSymbol(t.symbol)}>
                  <div className="avatar" style={{ background:'radial-gradient(circle at 40% 30%, #dbeafe, #a78bfa)', color:'#fff', fontWeight:900 }}>◎</div>
                  <div>
                    <div className="name">{t.name} <span className="tag">{t.kind}</span></div>
                    <div className="sym">{t.symbol}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div className="price">{fmtPrice(t.price, t.kind)}</div>
                    <div className={`chg ${up? 'up':'down'}`}>{up ? '▲' : '▼'} {Math.abs(t.change).toFixed(2)}%</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded signal card */}
      <AnimatePresence>
        {picked && signal && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ marginTop: 16 }}>
            <TradeSignalCard symbol={picked} signal={signal} news={news} onClose={()=>{ setPicked(null); setSignal(null); setNews([]); setQ(''); setDropdown([]); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
