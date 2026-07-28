import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ title = 'No records found', description = 'There is no data to display right now.', icon: Icon = Inbox, actionButton }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center text-slate-400 font-sans">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 border border-slate-700 text-slate-500 mb-4">
        <Icon size={28} />
      </div>
      <h3 className="text-base font-bold text-white uppercase tracking-wider">{title}</h3>
      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">{description}</p>
      {actionButton && <div className="mt-6">{actionButton}</div>}
    </div>
  );
};
