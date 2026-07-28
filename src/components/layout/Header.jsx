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
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenDrawer}
            className="text-primary p-1 hover:opacity-80 transition-opacity"
            aria-label="Open menu drawer"
          >
            <Menu size={26} />
          </button>

          <div
            onClick={() => {
              if (onSelectCategory) onSelectCategory('All');
              setActivePage('home');
            }}
            className="cursor-pointer select-none"
          >
            <h1 className="text-headline-xl font-headline-xl italic font-black text-primary tracking-tighter uppercase leading-none">
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
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="p-1 text-on-surface hover:text-primary transition-colors"
            title="Search"
          >
            <Search size={22} />
          </button>

          <button
            onClick={() => setActivePage('video')}
            className="bg-primary hover:bg-red-700 text-on-primary text-label-caps font-label-caps px-4 py-2 flex items-center gap-2 transition-all active:scale-95 uppercase tracking-wider"
          >
            <Video size={16} />
            <span>LIVE TV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
