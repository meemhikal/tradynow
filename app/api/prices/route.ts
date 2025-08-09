import { NextRequest, NextResponse } from 'next/server';
const FINN='https://finnhub.io/api/v1'; const KEY=process.env.FINNHUB_API_KEY!;
const FX:Record<string,string>={'EUR/USD':'OANDA:EUR_USD','GBP/USD':'OANDA:GBP_USD','USD/JPY':'OANDA:USD_JPY','USD/CHF':'OANDA:USD_CHF','AUD/USD':'OANDA:AUD_USD','USD/CAD':'OANDA:USD_CAD','NZD/USD':'OANDA:NZD_USD','EUR/GBP':'OANDA:EUR_GBP','EUR/JPY':'OANDA:EUR_JPY','GBP/JPY':'OANDA:GBP_JPY'};
const CRYPTO:Record<string,string>={'BTC/USD':'BINANCE:BTCUSDT','ETH/USD':'BINANCE:ETHUSDT','BNB/USD':'BINANCE:BNBUSDT','SOL/USD':'BINANCE:SOLUSDT','XRP/USD':'BINANCE:XRPUSDT','ADA/USD':'BINANCE:ADAUSDT','DOGE/USD':'BINANCE:DOGEUSDT','MATIC/USD':'BINANCE:MATICUSDT','DOT/USD':'BINANCE:DOTUSDT','LTC/USD':'BINANCE:LTCUSDT'};
const now=()=>Math.floor(Date.now()/1000); const reso=(i:string)=>['1','5','15','60','240','D'].includes(i)?i:'60';
export async function GET(req:NextRequest){ const {searchParams}=new URL(req.url); const symbol=searchParams.get('symbol')||'EUR/USD'; const interval=reso(searchParams.get('interval')||'60');
  try{ let endpoint='',prov=''; if(symbol in FX){endpoint='forex/candle';prov=FX[symbol];} else if(symbol in CRYPTO){endpoint='crypto/candle';prov=CRYPTO[symbol];} else {return NextResponse.json({symbol,interval,candles:[],lastPrice:0,pctChange:0});}
    const to=now(); const step=interval==='D'?86400:parseInt(interval,10)*60; const from=to-200*step;
    const url=`${FINN}/${endpoint}?symbol=${encodeURIComponent(prov)}&resolution=${interval}&from=${from}&to=${to}&token=${KEY}`;
    const r=await fetch(url,{cache:'no-store'}); const j=await r.json(); if(!j||j.s!=='ok') return NextResponse.json({symbol,interval,candles:[],lastPrice:0,pctChange:0});
    const candles=j.t.map((t:number,i:number)=>({t,o:j.o[i],h:j.h[i],l:j.l[i],c:j.c[i]})); const last=candles.at(-1)?.c??0; const prev=candles.at(-2)?.c??last; const pct=prev?((last-prev)/prev)*100:0;
    return NextResponse.json({symbol,interval,candles,lastPrice:last,pctChange:pct});
  }catch{ return NextResponse.json({symbol,interval,candles:[],lastPrice:0,pctChange:0}); }
}