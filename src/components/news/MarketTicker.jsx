import React from 'react';
import { TrendingUp } from 'lucide-react';

export const MarketTicker = () => {
  const marketIndices = [
    { symbol: "NIFTY 50", value: "22,514.20", change: "+142.30", percentChange: "+0.64%", isPositive: true },
    { symbol: "SENSEX", value: "74,248.60", change: "+496.25", percentChange: "+0.67%", isPositive: true },
    { symbol: "USD/INR", value: "83.28", change: "-0.04", percentChange: "-0.05%", isPositive: true },
    { symbol: "BRENT CRUDE", value: "$89.40/bbl", change: "-1.15", percentChange: "-1.27%", isPositive: false },
    { symbol: "GOLD 24K", value: "₹71,450", change: "+320.00", percentChange: "+0.45%", isPositive: true },
  ];

  return (
    <div className="w-full bg-surface-container-low border-b border-surface-container-high py-2 px-4 flex items-center overflow-hidden font-sans text-xs select-none relative">
      {/* Pinned Label Badge */}
      <div className="flex items-center gap-1.5 font-headline font-bold text-secondary uppercase tracking-wider text-[11px] pr-3 bg-surface-container-low z-10 shrink-0 border-r border-surface-container-highest">
        <TrendingUp size={14} className="text-primary" />
        <span>MARKETS TODAY</span>
      </div>

      {/* Marquee Tag Model Scroller */}
      <div className="overflow-hidden flex-1 relative pl-3">
        <div className="breaking-ticker-animation space-x-8">
          {marketIndices.map((item, idx) => (
            <div key={`${item.symbol}-${idx}`} className="inline-flex items-center gap-2">
              <span className="font-bold text-on-surface uppercase">{item.symbol}:</span>
              <span className="font-mono text-secondary">{item.value}</span>
              <span
                className={`flex items-center font-mono font-bold text-[11px] ${
                  item.isPositive ? 'text-emerald-700' : 'text-primary'
                }`}
              >
                {item.isPositive ? '+' : ''}
                {item.change} ({item.percentChange})
              </span>
            </div>
          ))}
          {/* Repeat for seamless marquee wrap */}
          {marketIndices.map((item, idx) => (
            <div key={`${item.symbol}-dup-${idx}`} className="inline-flex items-center gap-2">
              <span className="font-bold text-on-surface uppercase">{item.symbol}:</span>
              <span className="font-mono text-secondary">{item.value}</span>
              <span
                className={`flex items-center font-mono font-bold text-[11px] ${
                  item.isPositive ? 'text-emerald-700' : 'text-primary'
                }`}
              >
                {item.isPositive ? '+' : ''}
                {item.change} ({item.percentChange})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
