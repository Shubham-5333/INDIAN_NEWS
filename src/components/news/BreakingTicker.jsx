import React from 'react';

export const BreakingTicker = ({ onSelectArticle, breakingItems = [] }) => {
  const tickerItems = breakingItems && breakingItems.length > 0
    ? breakingItems.map((item) => typeof item === 'string' ? item : item.title)
    : [];

  if (tickerItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-on-surface text-background py-1 flex items-center overflow-hidden border-b border-primary relative font-label-caps text-label-caps select-none">
      {/* Red Badge */}
      <div 
        className="bg-primary text-on-primary px-4 py-1.5 z-10 shrink-0 font-label-caps text-label-caps font-black italic tracking-widest cursor-pointer"
        onClick={onSelectArticle}
      >
        BREAKING
      </div>

      {/* Scrolling Ticker Line */}
      <div className="overflow-hidden flex-1 relative">
        <div className="breaking-ticker-animation space-x-12 cursor-pointer" onClick={onSelectArticle}>
          {tickerItems.map((headline, idx) => (
            <span key={idx} className="inline-flex items-center gap-3">
              <span className="text-primary font-bold">•</span>
              <span>{headline}</span>
            </span>
          ))}
          {/* Duplicate for smooth continuous scroll */}
          {tickerItems.map((headline, idx) => (
            <span key={`dup-${idx}`} className="inline-flex items-center gap-3">
              <span className="text-primary font-bold">•</span>
              <span>{headline}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
