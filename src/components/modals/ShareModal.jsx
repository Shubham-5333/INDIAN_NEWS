import React, { useState } from 'react';
import { X, Copy, Check, Share2, Mail, Twitter, Linkedin } from 'lucide-react';

export const ShareModal = ({ isOpen, onClose, article }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  const currentUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${currentUrl}#article-${article.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-surface-container-lowest border border-surface-container-high p-6 shadow-2xl z-10 font-sans">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-3 mb-4">
          <div className="flex items-center gap-2 font-headline font-bold text-lg uppercase text-on-surface">
            <Share2 size={20} className="text-primary" />
            <span>SHARE THIS ARTICLE</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-secondary hover:text-on-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Article Summary Preview */}
        <div className="p-3 bg-surface border border-surface-container-high mb-4">
          <span className="text-[10px] font-headline uppercase font-bold text-primary">{article.category}</span>
          <h4 className="font-headline font-bold text-sm text-on-surface line-clamp-2 mt-0.5">{article.title}</h4>
        </div>

        {/* Copy Link Input */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-secondary uppercase font-headline mb-1.5">Direct Article URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`${currentUrl}#article-${article.id}`}
              className="bg-surface border border-surface-container-highest px-3 py-2 text-xs font-mono text-secondary flex-1 truncate"
            />
            <button
              onClick={handleCopy}
              className="bg-news-dark hover:bg-black text-white px-3.5 py-2 text-xs font-headline font-bold uppercase flex items-center gap-1.5 shrink-0 transition-colors"
            >
              {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div>
          <label className="block text-xs font-bold text-secondary uppercase font-headline mb-2">Share via Platform</label>
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-headline font-bold">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-neutral-900 text-white hover:bg-black flex flex-col items-center gap-1 transition-colors"
            >
              <Twitter size={18} />
              <span>X</span>
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-emerald-800 text-white hover:bg-emerald-900 flex flex-col items-center gap-1 transition-colors"
            >
              <Share2 size={18} />
              <span>WhatsApp</span>
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-blue-800 text-white hover:bg-blue-900 flex flex-col items-center gap-1 transition-colors"
            >
              <Linkedin size={18} />
              <span>LinkedIn</span>
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(article.summary)}`}
              className="p-3 bg-neutral-800 text-white hover:bg-neutral-700 flex flex-col items-center gap-1 transition-colors"
            >
              <Mail size={18} />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
