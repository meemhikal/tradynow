export type OHLC = { t: number; o: number; h: number; l: number; c: number };
export type CandleResponse = { symbol: string; interval: string; candles: OHLC[] };
export type AllowedSymbol = 'EUR/USD'|'GBP/USD'|'NAS100'|'XAU/USD'|'USOIL'|'BTC/USD'|'ETH/USD'|'SOL/USD';
export type Instrument = { name: string; symbol: AllowedSymbol; kind: 'Forex'|'Index'|'Gold'|'Oil'|'Crypto'; price: number; change: number; icon?: string };
