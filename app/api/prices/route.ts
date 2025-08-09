import { NextRequest, NextResponse } from 'next/server';
const FINN = 'https://finnhub.io/api/v1';
const KEY = process.env.FINNHUB_API_KEY!;
const FX: Record<string,string> = { 'EUR/USD':'OANDA:EUR_USD', 'GBP/USD':'OANDA:GBP_USD' };
const CRYPTO: Record<string,string> = { 'BTC/USD':'BINANCE:BTCUSDT', 'ETH/USD':'BINANCE:ETHUSDT', 'SOL/USD':'BINANCE:SOLUSDT' };
const MOCK = new Set(['NAS100','XAU/USD','USOIL']);
const nowSecs = ()=> Math.floor(Date.now()/1000);
function mockCandles(){ const out:any[]=[]; let p=100+Math.random()*20; const start=nowSecs()-200*60; for(let i=0;i<200;i++){ const vol=(Math.sin(i/12)+1)*0.3+0.2; const d=(Math.random()-0.5)*vol; const o=p; p=Math.max(0.0001,p+d); const c=p; const h=Math.max(o,c)+Math.random()*vol; const l=Math.min(o,c)-Math.random()*vol; out.push({ t:start+i*60,o:+o.toFixed(5),h:+h.toFixed(5),l:+l.toFixed(5),c:+c.toFixed(5)});} return out; }
function reso(i:string){ return ['1','5','15','60','240','D'].includes(i)?i:'60'; }
export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol')||'EUR/USD';
  const interval = reso(searchParams.get('interval')||'60');
  try{
    if(MOCK.has(symbol)) return NextResponse.json({ symbol, interval, candles: mockCandles() });
    let endpoint='', sym='';
    if(symbol in FX){ endpoint='forex/candle'; sym=FX[symbol]; }
    else if(symbol in CRYPTO){ endpoint='crypto/candle'; sym=CRYPTO[symbol]; }
    else return NextResponse.json({ symbol, interval, candles: mockCandles() });
    const to=nowSecs(); const from= to - 200*(interval==='D'?86400:parseInt(interval,10)*60);
    const url = `${FINN}/${endpoint}?symbol=${encodeURIComponent(sym)}&resolution=${interval}&from=${from}&to=${to}&token=${KEY}`;
    const r = await fetch(url, { cache: 'no-store' }); const j = await r.json();
    if(!j || j.s!=='ok') return NextResponse.json({ symbol, interval, candles: mockCandles() });
    const candles = j.t.map((t:number,i:number)=>({ t, o:j.o[i], h:j.h[i], l:j.l[i], c:j.c[i] }));
    return NextResponse.json({ symbol, interval, candles });
  }catch{ return NextResponse.json({ symbol, interval, candles: mockCandles() }); }
}
