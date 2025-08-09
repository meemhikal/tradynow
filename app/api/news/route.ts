import { NextResponse } from 'next/server';
const FINNHUB = 'https://finnhub.io/api/v1/news?category=general';
const KEY = process.env.FINNHUB_API_KEY!;
const KEYWORDS = ['CPI','Fed','FOMC','interest rates','inflation','OPEC','jobs report'];
export const revalidate = 300; // 5 min ISR
export async function GET(){
  try{
    const r = await fetch(`${FINNHUB}&token=${KEY}`, { next: { revalidate } });
    const data = await r.json();
    const filtered = (Array.isArray(data)?data:[]).filter((n:any)=> KEYWORDS.some(k => String(n.headline||'').toLowerCase().includes(k.toLowerCase())))
      .map((n:any)=>({ id:String(n.id), headline:n.headline, source:n.source, url:n.url, datetime:n.datetime }));
    return NextResponse.json(filtered);
  }catch{ return NextResponse.json([]); }
}
