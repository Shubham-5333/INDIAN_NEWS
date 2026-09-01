import React from 'react';
import { Menu, Search, Video } from 'lucide-react';

export const Header = ({
  activePage,
  setActivePage,
  onSelectCategory,
  onOpenDrawer,
  onOpenSearch,
}) => {
  return (
    <header className="bg-background border-b border-outline sticky top-0 z-50">
      <div className="flex justify-between items-center px-container-margin h-16 w-full max-w-7xl mx-auto">
        {/* Left Section: Menu & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={onOpenDrawer}
            className="text-primary p-1 hover:opacity-80 transition-opacity"
            aria-label="Open menu drawer"
          >
            <Menu size={24} />
          </button>

          <div
            onClick={() => {
              if (onSelectCategory) onSelectCategory('All');
              setActivePage('home');
            }}
            className="cursor-pointer select-none"
          >
            <h1 className="text-xl sm:text-2xl md:text-headline-xl font-headline-xl italic font-black text-primary tracking-tighter uppercase leading-none whitespace-nowrap">
              INDIAN <span className="text-on-surface">NEWS</span>
            </h1>
          </div>
        </div>

        {/* Center Section: Desktop Navigation Links (Clean & Streamlined) */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => {
              if (onSelectCategory) onSelectCategory('All');
              setActivePage('home');
            }}
            className={`text-label-caps font-label-caps tracking-wider transition-colors ${
              activePage === 'home' ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : 'text-on-surface hover:text-primary'
            }`}
          >
            HOME
          </button>

          <button
            onClick={() => {
              if (onSelectCategory) onSelectCategory('All');
              setActivePage('search');
            }}
            className={`text-label-caps font-label-caps tracking-wider transition-colors ${
              activePage === 'search' ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : 'text-on-surface hover:text-primary'
            }`}
          >
            NEWS
          </button>

          <button
            onClick={() => setActivePage('video')}
            className={`text-label-caps font-label-caps tracking-wider transition-colors ${
              activePage === 'video' ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : 'text-on-surface hover:text-primary'
            }`}
          >
            VIDEO
          </button>
        </nav>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            className="p-1 text-on-surface hover:text-primary transition-colors"
            title="Search"
          >
            <Search size={20} />
          </button>

          <button
            onClick={() => setActivePage('video')}
            className="bg-primary hover:bg-red-700 text-on-primary text-[11px] sm:text-label-caps font-label-caps px-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 uppercase tracking-wider"
          >
            <Video size={15} />
            <span className="hidden sm:inline">LIVE TV</span>
            <span className="sm:hidden">LIVE</span>
          </button>
        </div>
      </div>
    </header>
  );
};
