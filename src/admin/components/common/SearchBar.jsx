import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <Search size={18} className="absolute left-3.5 top-2.5 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 text-white rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
