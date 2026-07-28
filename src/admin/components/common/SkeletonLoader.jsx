import React from 'react';

export const SkeletonLoader = ({ rows = 5, type = 'table' }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 p-6 rounded-xl animate-pulse space-y-4">
            <div className="h-4 bg-slate-700 rounded w-1/3"></div>
            <div className="h-8 bg-slate-700 rounded w-2/3"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden animate-pulse">
      <div className="p-4 border-b border-slate-700 bg-slate-900/60">
        <div className="h-4 bg-slate-700 rounded w-1/4"></div>
      </div>
      <div className="p-4 space-y-3">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-700/50">
            <div className="h-4 bg-slate-700 rounded w-2/5"></div>
            <div className="h-4 bg-slate-700 rounded w-1/5"></div>
            <div className="h-4 bg-slate-700 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
