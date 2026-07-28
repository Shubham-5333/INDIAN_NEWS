import React from 'react';
import { Bold, Italic, Heading, Quote, List, Code, AlignLeft } from 'lucide-react';

export const RichTextEditor = ({ value, onChange, label = 'Content Body', required = false }) => {
  const insertFormatting = (prefix, suffix = '') => {
    const formatted = `${value ? value + '\n' : ''}${prefix}${suffix}`;
    onChange(formatted);
  };

  return (
    <div className="space-y-1.5 font-sans">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <span className="text-[10px] text-slate-400">Separate paragraphs with double linebreaks</span>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
        {/* Formatting Toolbar */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950/80 p-2 border-b border-slate-700 text-slate-400">
          <button
            type="button"
            onClick={() => insertFormatting('### Section Heading')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded text-xs flex items-center gap-1"
            title="Heading"
          >
            <Heading size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('**Bold Text**')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded text-xs"
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*Italic Text*')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded text-xs"
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('> "Quote snippet..."')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded text-xs"
            title="Quote"
          >
            <Quote size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('- Bullet item 1\n- Bullet item 2')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded text-xs"
            title="Bullet List"
          >
            <List size={14} />
          </button>
        </div>

        <textarea
          rows={10}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write full article body text here..."
          className="w-full bg-slate-900 text-white p-3.5 text-sm focus:outline-none font-sans leading-relaxed border-none"
        />
      </div>
    </div>
  );
};
