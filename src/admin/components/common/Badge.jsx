import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-red-950/60 text-red-400 border-red-800',
    success: 'bg-emerald-950/60 text-emerald-400 border-emerald-800',
    warning: 'bg-amber-950/60 text-amber-400 border-amber-800',
    info: 'bg-blue-950/60 text-blue-400 border-blue-800',
  };

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
};
