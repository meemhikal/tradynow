import type { AllowedSymbol, Instrument } from '@/components/types';
export const SUPPORTED: Instrument[]=[
  {name:'EUR/USD',symbol:'EUR/USD',kind:'Forex',price:0,change:0},{name:'GBP/USD',symbol:'GBP/USD',kind:'Forex',price:0,change:0},
  {name:'USD/JPY',symbol:'USD/JPY',kind:'Forex',price:0,change:0},{name:'USD/CHF',symbol:'USD/CHF',kind:'Forex',price:0,change:0},
  {name:'AUD/USD',symbol:'AUD/USD',kind:'Forex',price:0,change:0},{name:'USD/CAD',symbol:'USD/CAD',kind:'Forex',price:0,change:0},
  {name:'NZD/USD',symbol:'NZD/USD',kind:'Forex',price:0,change:0},{name:'EUR/GBP',symbol:'EUR/GBP',kind:'Forex',price:0,change:0},
  {name:'EUR/JPY',symbol:'EUR/JPY',kind:'Forex',price:0,change:0},{name:'GBP/JPY',symbol:'GBP/JPY',kind:'Forex',price:0,change:0},
  {name:'Bitcoin',symbol:'BTC/USD',kind:'Crypto',price:0,change:0},{name:'Ethereum',symbol:'ETH/USD',kind:'Crypto',price:0,change:0},
  {name:'BNB',symbol:'BNB/USD',kind:'Crypto',price:0,change:0},{name:'Solana',symbol:'SOL/USD',kind:'Crypto',price:0,change:0},
  {name:'XRP',symbol:'XRP/USD',kind:'Crypto',price:0,change:0},{name:'Cardano',symbol:'ADA/USD',kind:'Crypto',price:0,change:0},
  {name:'Dogecoin',symbol:'DOGE/USD',kind:'Crypto',price:0,change:0},{name:'Polygon',symbol:'MATIC/USD',kind:'Crypto',price:0,change:0},
  {name:'Polkadot',symbol:'DOT/USD',kind:'Crypto',price:0,change:0},{name:'Litecoin',symbol:'LTC/USD',kind:'Crypto',price:0,change:0}
];
export const TRENDING: AllowedSymbol[]=['EUR/USD','BTC/USD','ETH/USD'];
export function fmtPrice(x:number,kind:string){const f=kind==='Forex'?(x<1?6:5):(x<1?6:x<200?4:2);const p=kind==='Forex'?'':'$';return p+x.toLocaleString(undefined,{minimumFractionDigits:f,maximumFractionDigits:f});}