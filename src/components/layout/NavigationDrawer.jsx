import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Radio, Globe, ShieldCheck } from 'lucide-react';
import { api } from '../../api/client';

export const NavigationDrawer = ({
  isOpen,
  onClose,
  setActivePage,
  onSelectCategory,
  categories: propCategories,
}) => {
  const [categories, setCategories] = useState(propCategories || ['All']);

  useEffect(() => {
    if (propCategories && propCategories.length > 1) {
      setCategories(propCategories);
    } else {
      api.getCategories()
        .then((res) => {
          if (Array.isArray(res)) {
            const names = res.map((c) => (typeof c === 'string' ? c : c.name)).filter(Boolean);
            setCategories(['All', ...names]);
          }
        })
        .catch((err) => {
          console.error('Error fetching categories for drawer:', err);
        });
    }
  }, [propCategories]);

  if (!isOpen) return null;

  const handleCategoryClick = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    setActivePage('search');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop - Solid Dark Overlay */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer Panel - Solid Black Background */}
      <div className="relative w-[85vw] max-w-sm bg-black text-white h-full flex flex-col z-10 shadow-2xl overflow-y-auto border-r border-neutral-800">
        {/* Header */}
        <div className="p-5 bg-black border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="font-headline font-black text-2xl tracking-tight uppercase text-white">
              BREAKING <span className="text-primary">HOURS</span>
            </h2>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">
              SECTIONS & SERVICES
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none bg-neutral-900 hover:bg-neutral-800 text-white transition-colors border border-neutral-700"
          >
            <X size={22} />
          </button>
        </div>

        {/* Action Highlights */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex flex-col gap-2 text-xs font-headline uppercase font-bold">
          <button
            onClick={() => { setActivePage('video'); onClose(); }}
            className="flex items-center justify-center gap-2 bg-primary text-white py-2.5 px-3 hover:bg-red-700 transition-colors w-full"
          >
            <Radio size={15} className="animate-pulse" />
            <span>24/7 LIVE TV</span>
          </button>
        </div>

        {/* Categories Section */}
        <div className="p-5 bg-black flex-1 space-y-6 font-sans">
          <div>
            <h3 className="font-headline font-bold text-xs text-neutral-400 uppercase tracking-widest mb-3 border-b border-neutral-800 pb-1">
              NEWS DESKS
            </h3>
            <ul className="space-y-1 text-sm font-headline uppercase font-semibold">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className="w-full text-left py-2.5 px-3 bg-black hover:bg-neutral-900 border-b border-neutral-900 text-neutral-200 hover:text-white flex items-center justify-between transition-colors group"
                  >
                    <span>{cat}</span>
                    <ChevronRight size={16} className="text-neutral-500 group-hover:text-primary transition-colors" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Regional Editions */}
          <div>
            <h3 className="font-headline font-bold text-xs text-neutral-400 uppercase tracking-widest mb-3 border-b border-neutral-800 pb-1">
              EDITIONS
            </h3>
            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-center justify-between p-2.5 bg-neutral-950 border border-primary font-semibold">
                <span className="flex items-center gap-2">
                  <Globe size={14} className="text-primary" />
                  <span>INDIA (ENGLISH)</span>
                </span>
                <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 uppercase font-bold">ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Institutional Note */}
          <div className="bg-neutral-950 border border-neutral-800 p-4 text-xs space-y-2 text-neutral-400 font-body">
            <div className="flex items-center gap-2 text-neutral-200 font-headline uppercase font-bold text-xs">
              <ShieldCheck size={16} className="text-primary" />
              <span>EDITORIAL STANDARDS</span>
            </div>
            <p className="leading-relaxed">
              BREAKING HOURS operates under strict independent oversight and non-partisan journalistic integrity.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black border-t border-neutral-800 text-center text-[10px] text-neutral-500 font-sans">
          © 2026 BREAKING HOURS NETWORK
        </div>
      </div>
    </div>
  );
};
