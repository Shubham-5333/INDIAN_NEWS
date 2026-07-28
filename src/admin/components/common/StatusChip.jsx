import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export const StatusChip = ({ status, onClick, clickable = false }) => {
  const isPublished = status === 'published';

  return (
    <button
      type="button"
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      className={`text-xs px-2.5 py-1 rounded font-semibold uppercase tracking-wider border flex items-center gap-1 transition-colors ${
        isPublished
          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
          : 'bg-amber-950/60 text-amber-400 border-amber-800'
      } ${clickable ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'}`}
    >
      {isPublished ? <CheckCircle size={12} /> : <XCircle size={12} />}
      <span>{status}</span>
    </button>
  );
};
