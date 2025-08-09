export function ema(values: number[], period: number): number[] {
  const k = 2 / (period + 1); const out: number[] = []; let prev = values[0]; out[0] = prev;
  for (let i = 1; i < values.length; i++) { const v = values[i] * k + prev * (1 - k); out[i] = v; prev = v; }
  return out;
}
export function rsi(values: number[], period = 14): number[] {
  if (values.length < period + 1) return Array(values.length).fill(50);
  const changes = values.map((v,i)=> i? v-values[i-1]:0); let gains=0,losses=0;
  for (let i=1;i<=period;i++){ const d=changes[i]; if(d>=0) gains+=d; else losses-=d; }
  let ag=gains/period, al=losses/period; const out: number[] = Array(period).fill(50);
  for (let i=period+1;i<values.length;i++){
    const d=changes[i]; if(d>=0){ ag=(ag*(period-1)+d)/period; al=(al*(period-1))/period; }
    else { ag=(ag*(period-1))/period; al=(al*(period-1)-d)/period; }
    const rs = al===0 ? 100 : ag/al; out[i] = 100 - 100 / (1 + rs);
  }
  return out;
}
export function macd(values: number[], fast=12, slow=26, signal=9){
  const fastE=ema(values,fast), slowE=ema(values,slow);
  const macdLine = values.map((_,i)=> fastE[i]-slowE[i]);
  const signalLine = ema(macdLine,signal);
  const histogram = macdLine.map((v,i)=> v-signalLine[i]);
  return { macdLine, signalLine, histogram };
}
