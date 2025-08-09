import { NextResponse } from 'next/server';
const FINNHUB='https://finnhub.io/api/v1/news?category=general'; const KEY=process.env.FINNHUB_API_KEY!;
const KEYS=['cpi','inflation','fed','fomc','interest rate','rate hike','rate cut','ecb','boe','jobs report','nonfarm','bitcoin','crypto','usd','eur','gbp','jpy'];
export const revalidate=300;
export async function GET(){ try{ const r=await fetch(`${FINNHUB}&token=${KEY}`,{ next:{ revalidate } }); const data=await r.json(); const list=Array.isArray(data)?data:[];
  const filtered=list.filter((n:any)=> KEYS.some(k=> String(n.headline||'').toLowerCase().includes(k))).map((n:any)=>({ id:String(n.id), headline:n.headline, source:n.source, url:n.url, datetime:n.datetime }));
  return NextResponse.json(filtered.slice(0,12)); } catch{ return NextResponse.json([]); } }