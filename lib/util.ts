import type { AllowedSymbol, Instrument } from '@/components/types';

export const SUPPORTED: Instrument[] = [
  { name:'EUR/USD', symbol:'EUR/USD', kind:'Forex',  price:1.0875,   change:+0.12 },
  { name:'GBP/USD', symbol:'GBP/USD', kind:'Forex',  price:1.2742,   change:-0.06 },
  { name:'NAS100',  symbol:'NAS100',  kind:'Index',  price:17892.3,  change:+0.45 },
  { name:'XAU/USD', symbol:'XAU/USD', kind:'Gold',   price:2412.7,   change:-0.22 },
  { name:'USOIL',   symbol:'USOIL',   kind:'Oil',    price:79.44,    change:+0.31 },
  { name:'BTC/USD', symbol:'BTC/USD', kind:'Crypto', price:64235.23, change:-2.11 },
  { name:'ETH/USD', symbol:'ETH/USD', kind:'Crypto', price:3421.55,  change:+1.24 },
  { name:'SOL/USD', symbol:'SOL/USD', kind:'Crypto', price:142.11,   change:+5.02 },
];

export function fmtPrice(x: number, kind: string){
  const frac = x < 1 ? 6 : kind === 'Forex' ? 5 : x < 200 ? 4 : 2;
  const prefix = kind === 'Forex' ? '' : '$';
  return prefix + x.toLocaleString(undefined,{ minimumFractionDigits: frac, maximumFractionDigits: frac });
}

export function nowSecs(){ return Math.floor(Date.now()/1000); }
export type NewsItem = { id: string; headline: string; source: string; url: string; datetime: number };

export const TRENDING: AllowedSymbol[] = ['EUR/USD','NAS100','XAU/USD'];
