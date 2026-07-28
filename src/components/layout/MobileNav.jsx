import React from 'react';
import { Home, Video, Search } from 'lucide-react';

export const MobileNav = ({
  activePage,
  setActivePage,
  onSelectCategory,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black text-white border-t border-neutral-800 z-40 px-2 py-2 flex items-center justify-around font-sans shadow-2xl">
      <button
        onClick={() => {
          if (onSelectCategory) onSelectCategory('All');
          setActivePage('home');
        }}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
          activePage === 'home' ? 'text-primary font-bold' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Home size={20} />
        <span className="text-[10px] uppercase font-headline">Home</span>
      </button>

      <button
        onClick={() => {
          if (onSelectCategory) onSelectCategory('All');
          setActivePage('search');
        }}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
          activePage === 'search' ? 'text-primary font-bold' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Search size={20} />
        <span className="text-[10px] uppercase font-headline">Search</span>
      </button>

      <button
        onClick={() => setActivePage('video')}
        className={`flex flex-col items-center gap-0.5 p-1 relative transition-colors ${
          activePage === 'video' ? 'text-primary font-bold' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <div className="relative">
          <Video size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        </div>
        <span className="text-[10px] uppercase font-headline">Live</span>
      </button>
    </div>
  );
};
