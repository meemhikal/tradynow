import type { OHLC } from '@/components/types'; import { ema, rsi, macd } from './ta';
export type ComputedSignal={direction:'BUY'|'SELL'|'NEUTRAL';entry:number;stop:number;takeProfit:number;confidence:number;reason:string};
export function computeSignal(c:OHLC[]):ComputedSignal{ if(!c?.length) return {direction:'NEUTRAL',entry:0,stop:0,takeProfit:0,confidence:0,reason:'No data.'};
const closes=c.map(x=>x.c);const last=c[c.length-1];const e20=ema(closes,20),e50=ema(closes,50),R=rsi(closes,14),M=macd(closes);
const up=e20.at(-1)!>e50.at(-1)!, down=e20.at(-1)!<e50.at(-1)!, ob=R.at(-1)!>70, os=R.at(-1)!<30, mup=M.macdLine.at(-1)!>M.signalLine.at(-1)!, mdown=!mup;
let score=50; if(up)score+=10; if(down)score-=10; if(mup)score+=10; if(mdown)score-=10; if(os)score+=10; if(ob)score-=10;
let dir:'BUY'|'SELL'|'NEUTRAL'='NEUTRAL'; if(score>=60&&mup&&up&&!ob)dir='BUY'; else if(score<=40&&mdown&&down&&!os)dir='SELL';
const atr=(last.h-last.l)||(last.c*0.002); const entry=last.c; const stop=dir==='BUY'? last.l-atr*0.5: dir==='SELL'? last.h+atr*0.5: last.c;
const risk=Math.abs(entry-stop)||(last.c*0.0015); const tp=dir==='BUY'? entry+2*risk: dir==='SELL'? entry-2*risk: last.c;
return {direction:dir,entry,stop,takeProfit:tp,confidence:Math.max(0,Math.min(100,Math.round(score))),reason: dir==='NEUTRAL'?'Mixed signals.':dir==='BUY'?'EMA20>EMA50 & MACD bullish; RSI not overbought.':'EMA20<EMA50 & MACD bearish; RSI not oversold.'}; }