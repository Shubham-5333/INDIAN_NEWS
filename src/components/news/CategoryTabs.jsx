import React from 'react';

export const CategoryTabs = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = [
    'All',
    'Politics',
    'Economy',
    'Tech',
    'India',
    'World',
    'Opinion',
    'Multimedia'
  ];

  return (
    <div className="w-full bg-surface border-b border-surface-container-high py-2 px-4 sm:px-8 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 sm:gap-4 min-w-max">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 text-xs font-headline font-bold uppercase tracking-wider transition-all ${
                isSelected
                  ? 'bg-news-dark text-white shadow-sm'
                  : 'bg-surface-container-low text-secondary hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
