export type OHLC={t:number;o:number;h:number;l:number;c:number};
export type AllowedSymbol='EUR/USD'|'GBP/USD'|'USD/JPY'|'USD/CHF'|'AUD/USD'|'USD/CAD'|'NZD/USD'|'EUR/GBP'|'EUR/JPY'|'GBP/JPY'|'BTC/USD'|'ETH/USD'|'BNB/USD'|'SOL/USD'|'XRP/USD'|'ADA/USD'|'DOGE/USD'|'MATIC/USD'|'DOT/USD'|'LTC/USD';
export type Instrument={name:string;symbol:AllowedSymbol;kind:'Forex'|'Crypto';price:number;change:number;icon?:string};
export type CandleResponse={symbol:string;interval:string;candles:OHLC[]};