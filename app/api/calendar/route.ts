import { NextResponse } from 'next/server';
const FMP_KEY = process.env.FMP_API_KEY!;
export const revalidate = 300; // 5 min ISR
const fmt = (d:Date)=> d.toISOString().split('T')[0];
export async function GET(){
  try{
    const now = new Date(); const to = new Date(Date.now()+7*24*3600*1000);
    const url = `https://financialmodelingprep.com/api/v3/economic_calendar?from=${fmt(now)}&to=${fmt(to)}&apikey=${FMP_KEY}`;
    const r = await fetch(url, { next: { revalidate } });
    const data = await r.json();
    const high = (Array.isArray(data)?data:[]).filter((e:any)=> e.importance==='High')
      .map((e:any)=>({ country:e.country, event:e.event, date:e.date, importance:e.importance, actual:e.actual, previous:e.previous, forecast:e.forecast }));
    return NextResponse.json(high);
  }catch{ return NextResponse.json([]); }
}
