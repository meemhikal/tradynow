# Trdy (Next.js 14, English Only)

Google-like homepage with a polished purple search overlay and instrument-integrated news.
Matches the live preview we tested in chat (trending always visible, dropdown on typing).

## Features
- Wordmark logo `trdy.`
- Trending always visible; dropdown appears only when typing
- Smooth animations (panel pop, row slide-in, subtle shimmer on placeholder)
- Trade Signal Card with EMA20/50, RSI14, MACD, colored Entry/Stop/TP and BUY/SELL badges
- News appears inside the signal card for the selected instrument (no footer widget)
- APIs: /api/news (Finnhub), /api/calendar (FMP), /api/prices (Finnhub + mock for NAS100/XAU/USD/USOIL)

## Env Vars
```
FINNHUB_API_KEY=
FMP_API_KEY=
```
(Optional)
```
TWELVEDATA_API_KEY=
POLYGON_API_KEY=
```

## Run
```
pnpm i
cp .env.example .env.local
# add your keys
pnpm dev
```

## Deploy (Vercel)
- Import repo → add env vars → Deploy
# tradynow
