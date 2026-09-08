import React, { useState, useEffect } from 'react';
import { Search, Facebook, Instagram, Twitter, Youtube, Send, ChevronUp } from 'lucide-react';
import { api } from '../../api/client';

export const Footer = ({
  setActivePage,
  categories: propCategories,
  onSelectCategory,
  onOpenSearch,
}) => {
  const [categories, setCategories] = useState(
    Array.isArray(propCategories) && propCategories.length > 1
      ? propCategories.filter((c) => c !== 'All')
      : []
  );

  useEffect(() => {
    if (Array.isArray(propCategories) && propCategories.length > 1) {
      setCategories(propCategories.filter((c) => c !== 'All'));
    } else {
      api.getCategories()
        .then((res) => {
          if (Array.isArray(res)) {
            const names = res.map((c) => (typeof c === 'string' ? c : c.name)).filter(Boolean);
            setCategories(names);
          }
        })
        .catch((err) => {
          console.error('Failed to load categories in Footer:', err);
        });
    }
  }, [propCategories]);

  const formatCategoryName = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleCategoryClick = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else if (setActivePage) {
      setActivePage('search');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#111111] text-white border-t-4 border-primary mt-auto font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {/* Top Header Row: Logo, Summary Description, Divider, Social & Search Icons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6">
          {/* Brand Logo */}
          <div
            onClick={() => {
              if (onSelectCategory) onSelectCategory('All');
              if (setActivePage) setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer select-none shrink-0"
          >
            <div className="border-l-4 border-primary pl-3">
              <h2 className="text-2xl sm:text-3xl font-headline font-black italic tracking-tighter uppercase leading-none">
                <span className="text-primary">BREAKING</span> <span className="text-white">HOURS</span>
              </h2>
              <p className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase mt-1">
                24/7 LIVE NETWORK
              </p>
            </div>
          </div>

          {/* Description Text */}
          <div className="flex-1 max-w-2xl">
            <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
              Breakinghours.com, an independent news portal delivering real-time broadcast and investigative journalism. Standing for non-biased, verified reports across India and global markets.
            </p>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block h-10 w-px bg-neutral-700"></div>

          {/* Social & Search Icons */}
          <div className="flex items-center gap-4 text-white">
            <button
              onClick={() => {
                if (onOpenSearch) onOpenSearch();
                else if (setActivePage) setActivePage('search');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-1.5 hover:text-primary transition-colors"
              title="Search"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 hover:text-primary transition-colors"
              title="Facebook"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 hover:text-primary transition-colors"
              title="Instagram"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 hover:text-primary transition-colors"
              title="Twitter"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 hover:text-primary transition-colors"
              title="YouTube"
              aria-label="YouTube"
            >
              <Youtube size={18} />
            </a>
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 hover:text-primary transition-colors"
              title="Telegram"
              aria-label="Telegram"
            >
              <Send size={18} />
            </a>
          </div>
        </div>

        {/* Thin Horizontal Divider */}
        <hr className="border-neutral-800 my-4" />

        {/* Categories Grid (Only Categories from DB arranged into clean 5-column layout) */}
        <div className="py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-3.5 text-sm font-sans font-medium text-neutral-300">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="text-left text-neutral-300 hover:text-white transition-colors capitalize font-medium truncate"
              >
                {formatCategoryName(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright and Scroll To Top */}
        <div className="mt-8 pt-6 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} BREAKING HOURS NETWORK. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-colors shadow-lg flex items-center justify-center cursor-pointer"
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};
