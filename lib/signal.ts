import type { OHLC, NewsItem } from './util';
import { ema, rsi, macd } from './ta';

export type ComputedSignal = { direction: 'BUY'|'SELL'|'NEUTRAL'; entry: number; stop: number; takeProfit: number; confidence: number; reason: string };

export function computeSignal(candles: OHLC[], news: NewsItem[] = []): ComputedSignal {
  const closes = candles.map(c=>c.c); const last = candles[candles.length-1];
  const ema20=ema(closes,20), ema50=ema(closes,50); const r=rsi(closes,14); const m=macd(closes);
  const trendUp=ema20.at(-1)!>ema50.at(-1)!; const trendDown=ema20.at(-1)!<ema50.at(-1)!;
  const rsiOB=r.at(-1)!>70, rsiOS=r.at(-1)!<30; const macdUp=m.macdLine.at(-1)!>m.signalLine.at(-1)!; const macdDown=!macdUp;
  let score=50; if(trendUp) score+=10; if(trendDown) score-=10; if(macdUp) score+=10; if(macdDown) score-=10; if(rsiOS) score+=10; if(rsiOB) score-=10;
  const twelveAgo=Math.floor(Date.now()/1000)-12*3600; const recent = news.filter(n=>n.datetime>=twelveAgo);
  if(recent.length) score += trendUp?10: trendDown? -10: 0;
  let direction:ComputedSignal['direction']='NEUTRAL';
  if(score>=60 && macdUp && trendUp && !rsiOB) direction='BUY';
  else if(score<=40 && macdDown && trendDown && !rsiOS) direction='SELL';
  const atrish=(last.h-last.l)||(last.c*0.002); const entry=last.c; const stop= direction==='BUY'? last.l-atrish*0.5: direction==='SELL'? last.h+atrish*0.5: last.c;
  const risk=Math.abs(entry-stop)||(last.c*0.0015); const takeProfit= direction==='BUY'? entry+2*risk: direction==='SELL'? entry-2*risk: last.c;
  const confidence=Math.max(0,Math.min(100,Math.round(score)));
  const reason = direction==='NEUTRAL'? 'Mixed signals: EMA(20/50), MACD and RSI are not aligned. Waiting for clearer structure.'
    : direction==='BUY'? `EMA20>EMA50 with bullish MACD; RSI not overbought. ${recent.length? 'Recent high-impact headlines may support trend.':'No recent high-impact events.'}`
    : `EMA20<EMA50 with bearish MACD; RSI not oversold. ${recent.length? 'Recent high-impact headlines may pressure price.':'No recent high-impact events.'}`;
  return { direction, entry, stop, takeProfit, confidence, reason };
}
