import React, { useState, useEffect } from 'react';
import {
  Search,
  PlayCircle,
  Newspaper,
  Smartphone,
  Landmark,
  X,
  Filter,
  Grid,
  List,
  Calendar,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Globe,
  Leaf,
  SlidersHorizontal,
  TrendingUp,
  Award
} from 'lucide-react';
import { ArticleCard } from '../components/news/ArticleCard';
import { api, formatImageUrl } from '../api/client';
import { FEATURED_LEAD_ARTICLE, TOP_STORIES, OPINION_PIECES } from '../data/mockData';

export const SearchPage = ({
  initialCategory = 'All',
  onSelectArticle,
  onShare,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
  const [timeframe, setTimeframe] = useState('all'); // all, 24h, week, month
  const [contentType, setContentType] = useState('all'); // all, breaking, live, opinion, featured
  const [sortBy, setSortBy] = useState('latest'); // latest, oldest, popular, title
  const [viewMode, setViewMode] = useState('list'); // list, grid
  const [showFilters, setShowFilters] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  
  const [articles, setArticles] = useState([
    FEATURED_LEAD_ARTICLE,
    ...TOP_STORIES,
    ...OPINION_PIECES
  ]);
  const [loading, setLoading] = useState(false);

  const trendingTags = ['QUANTUM', 'SCANDINAVIA', 'MARKETS', 'SPORTS', 'AI ETHICS', 'DESIGN', 'POLITICS', 'CLIMATE'];

  // Categories definition
  const bentoCategories = [
    { name: 'All', label: 'ALL NEWS', icon: Newspaper, color: 'hover:border-primary' },
    { name: 'Politics', label: 'POLITICS', icon: Landmark, color: 'hover:border-red-600' },
    { name: 'Economy', label: 'ECONOMY', icon: TrendingUp, color: 'hover:border-emerald-600' },
    { name: 'Tech', label: 'TECH', icon: Smartphone, color: 'hover:border-blue-600' },
    { name: 'Environment', label: 'ENVIRONMENT', icon: Leaf, color: 'hover:border-green-600' },
    { name: 'Global Technology', label: 'GLOBAL TECH', icon: Globe, color: 'hover:border-purple-600' },
    { name: 'Opinion', label: 'OPINION', icon: Award, color: 'hover:border-amber-600' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch news
        const res = await api.getNews({ limit: 100 });
        if (res && res.news && res.news.length > 0) {
          const formatted = res.news.map((item) => ({
            id: item._id || item.id,
            slug: item.slug,
            title: item.title,
            summary: item.summary,
            category: item.category,
            author: item.author || { name: 'Editorial Desk', role: 'Staff Reporter' },
            timestamp: item.timestamp || new Date(item.createdAt || Date.now()).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
            }),
            rawDate: new Date(item.createdAt || Date.now()),
            readTime: item.readTime || '4 min read',
            imageUrl: formatImageUrl(item.featuredImage || item.imageUrl || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200'),
            imageCaption: item.imageCaption || '',
            isLive: Boolean(item.isLive),
            isBreaking: Boolean(item.isBreaking),
            commentsCount: item.commentsCount || 12,
            likesCount: item.views || item.likesCount || 50,
            tags: item.tags || [],
            content: Array.isArray(item.content) ? item.content : [item.content],
          }));
          setArticles(formatted);
        }

        // Fetch categories dynamically
        try {
          const catRes = await api.getCategories();
          if (Array.isArray(catRes)) {
            setDynamicCategories(catRes.map(c => typeof c === 'string' ? c : c.name));
          }
        } catch {
          // Fallback if categories API fails
        }
      } catch (err) {
        console.log('Search fetching fallback articles...');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredArticles = articles.filter((art) => {
    // 1. Category Filter
    const matchesCategory =
      selectedCategory === 'All' ||
      art.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (art.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    // 2. Query Search
    const searchLower = query.trim().toLowerCase();
    const matchesQuery =
      !searchLower ||
      art.title.toLowerCase().includes(searchLower) ||
      art.summary.toLowerCase().includes(searchLower) ||
      (art.category && art.category.toLowerCase().includes(searchLower)) ||
      (art.author?.name && art.author.name.toLowerCase().includes(searchLower)) ||
      (art.tags && art.tags.some((t) => t.toLowerCase().includes(searchLower)));

    // 3. Timeframe Filter
    let matchesTimeframe = true;
    if (timeframe !== 'all' && art.rawDate) {
      const now = new Date();
      const diffHours = (now.getTime() - new Date(art.rawDate).getTime()) / (1000 * 3600);
      if (timeframe === '24h') matchesTimeframe = diffHours <= 24;
      else if (timeframe === 'week') matchesTimeframe = diffHours <= 24 * 7;
      else if (timeframe === 'month') matchesTimeframe = diffHours <= 24 * 30;
    }

    // 4. Content Type Filter
    let matchesContentType = true;
    if (contentType === 'breaking') matchesContentType = art.isBreaking;
    else if (contentType === 'live') matchesContentType = art.isLive;
    else if (contentType === 'opinion') matchesContentType = art.category.toLowerCase().includes('opinion');
    else if (contentType === 'featured') matchesContentType = Boolean(art.id === 'lead-1' || art.isLive);

    return matchesCategory && matchesQuery && matchesTimeframe && matchesContentType;
  });

  // Sort Logic
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'latest') {
      const dateA = a.rawDate ? new Date(a.rawDate).getTime() : 0;
      const dateB = b.rawDate ? new Date(b.rawDate).getTime() : 0;
      return dateB - dateA;
    }
    if (sortBy === 'oldest') {
      const dateA = a.rawDate ? new Date(a.rawDate).getTime() : 0;
      const dateB = b.rawDate ? new Date(b.rawDate).getTime() : 0;
      return dateA - dateB;
    }
    if (sortBy === 'popular') {
      return (b.likesCount || 0) - (a.likesCount || 0);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Unique Categories computed from current articles
  const availableCategorySet = new Set([
    'All',
    ...bentoCategories.map(c => c.name),
    ...articles.map(a => a.category).filter(Boolean),
    ...dynamicCategories
  ]);
  const allCategories = Array.from(availableCategorySet);

  const hasActiveFilters =
    query.trim() !== '' ||
    selectedCategory !== 'All' ||
    timeframe !== 'all' ||
    contentType !== 'all' ||
    sortBy !== 'latest';

  const resetAllFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setTimeframe('all');
    setContentType('all');
    setSortBy('latest');
  };

  return (
    <main className="flex-grow w-full max-w-5xl mx-auto px-container-margin py-stack-lg font-sans">
      {/* Search Input Section */}
      <section className="mb-8">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH NEWS, TOPICS, AUTHORS..."
            className="w-full bg-transparent border-b-2 border-on-surface focus:border-primary focus:outline-none text-headline-lg font-headline-lg-mobile py-4 pl-0 pr-12 placeholder:text-surface-dim uppercase transition-all text-on-surface"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1"
              title="Clear search input"
            >
              <X size={24} />
            </button>
          ) : null}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-primary p-1 pointer-events-none">
            <Search size={30} />
          </div>
        </div>

        {/* Trending Hashtag Chips */}
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-label-caps font-label-caps text-on-surface-variant mr-1 flex items-center gap-1">
            <Sparkles size={14} className="text-primary" /> TRENDING:
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className={`text-xs font-label-caps px-3 py-1 border transition-all uppercase ${
                query.toLowerCase() === tag.toLowerCase()
                  ? 'bg-primary text-on-primary border-primary'
                  : 'border-outline hover:bg-on-surface hover:text-background'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>

      {/* Category Bento Explorer Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1.5 bg-primary"></div>
            <h2 className="text-headline-lg font-headline-lg uppercase tracking-tight text-on-surface">BROWSE CATEGORIES</h2>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 border border-on-surface hover:bg-on-surface hover:text-background transition-all"
          >
            <SlidersHorizontal size={14} />
            <span>{showFilters ? 'Hide Filter Panel' : 'Show Filter Panel'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {bentoCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <div
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`border p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${cat.color} ${
                  isSelected
                    ? 'bg-on-surface text-background border-on-surface shadow-md'
                    : 'border-outline text-on-surface bg-surface-container-lowest hover:bg-surface-container'
                }`}
              >
                <Icon size={24} className={`mb-2 ${isSelected ? 'text-primary' : 'text-on-surface'}`} />
                <span className="text-[11px] font-label-caps tracking-wider text-center">{cat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filter Toolbar Controls Panel */}
      {showFilters && (
        <section className="mb-8 bg-surface-container-low border border-on-surface p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant">
            <div className="flex items-center gap-2 font-headline font-bold text-sm uppercase tracking-wider text-on-surface">
              <Filter size={16} className="text-primary" />
              <span>SEARCH & FILTER CONTROLS</span>
              {hasActiveFilters && (
                <span className="ml-2 bg-primary text-on-primary text-[10px] font-mono px-2 py-0.5 font-bold uppercase">
                  ACTIVE
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="flex items-center gap-1 text-xs text-primary font-bold hover:underline"
              >
                <RotateCcw size={14} />
                <span>Reset All</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Category Filter Dropdown */}
            <div>
              <label className="block text-[11px] font-bold font-label-caps uppercase text-on-surface-variant mb-1.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-background border border-outline px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary focus:outline-none uppercase"
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Timeframe Filter */}
            <div>
              <label className="block text-[11px] font-bold font-label-caps uppercase text-on-surface-variant mb-1.5 flex items-center gap-1">
                <Calendar size={12} />
                <span>Timeframe</span>
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-background border border-outline px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary focus:outline-none uppercase"
              >
                <option value="all">ANY TIME</option>
                <option value="24h">PAST 24 HOURS</option>
                <option value="week">PAST 7 DAYS</option>
                <option value="month">PAST 30 DAYS</option>
              </select>
            </div>

            {/* 3. Content Type Filter */}
            <div>
              <label className="block text-[11px] font-bold font-label-caps uppercase text-on-surface-variant mb-1.5">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full bg-background border border-outline px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary focus:outline-none uppercase"
              >
                <option value="all">ALL CONTENT</option>
                <option value="breaking">BREAKING NEWS</option>
                <option value="live">LIVE COVERAGE</option>
                <option value="opinion">OPINION PIECES</option>
                <option value="featured">FEATURED STORIES</option>
              </select>
            </div>

            {/* 4. Sort By */}
            <div>
              <label className="block text-[11px] font-bold font-label-caps uppercase text-on-surface-variant mb-1.5 flex items-center gap-1">
                <ArrowUpDown size={12} />
                <span>Sort By</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-background border border-outline px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary focus:outline-none uppercase"
              >
                <option value="latest">LATEST FIRST</option>
                <option value="oldest">OLDEST FIRST</option>
                <option value="popular">MOST POPULAR</option>
                <option value="title">TITLE (A - Z)</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* Applied Filter Chips */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap gap-2 items-center bg-surface-container-lowest p-3 border border-outline-variant">
          <span className="text-[11px] font-bold font-label-caps text-on-surface-variant uppercase mr-1">
            APPLIED FILTERS:
          </span>

          {query && (
            <span className="inline-flex items-center gap-1.5 bg-on-surface text-background px-2.5 py-1 text-xs font-semibold uppercase">
              Query: "{query}"
              <button onClick={() => setQuery('')} className="hover:text-primary">
                <X size={12} />
              </button>
            </span>
          )}

          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1.5 bg-on-surface text-background px-2.5 py-1 text-xs font-semibold uppercase">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('All')} className="hover:text-primary">
                <X size={12} />
              </button>
            </span>
          )}

          {timeframe !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-on-surface text-background px-2.5 py-1 text-xs font-semibold uppercase">
              Time: {timeframe}
              <button onClick={() => setTimeframe('all')} className="hover:text-primary">
                <X size={12} />
              </button>
            </span>
          )}

          {contentType !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-on-surface text-background px-2.5 py-1 text-xs font-semibold uppercase">
              Type: {contentType}
              <button onClick={() => setContentType('all')} className="hover:text-primary">
                <X size={12} />
              </button>
            </span>
          )}

          {sortBy !== 'latest' && (
            <span className="inline-flex items-center gap-1.5 bg-on-surface text-background px-2.5 py-1 text-xs font-semibold uppercase">
              Sort: {sortBy}
              <button onClick={() => setSortBy('latest')} className="hover:text-primary">
                <X size={12} />
              </button>
            </span>
          )}

          <button
            onClick={resetAllFilters}
            className="text-xs text-primary font-bold hover:underline ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Results Header with View Mode Switcher */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant pb-2">
          <div className="text-label-caps font-label-caps text-on-surface-variant font-bold">
            FOUND {sortedArticles.length} ARTICLES {selectedCategory !== 'All' ? `IN "${selectedCategory.toUpperCase()}"` : ''}
          </div>

          <div className="flex items-center gap-1 border border-outline p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-on-surface text-background' : 'text-on-surface hover:bg-surface-container'}`}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-on-surface text-background' : 'text-on-surface hover:bg-surface-container'}`}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="py-16 text-center text-on-surface-variant font-mono">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-bold uppercase tracking-widest">SEARCHING NEWS ARCHIVES...</p>
          </div>
        ) : sortedArticles.length > 0 ? (
          /* Articles Container */
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'space-y-4'}>
            {sortedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant={viewMode === 'grid' ? 'opinion' : 'list'}
                onSelect={onSelectArticle}
                onShare={onShare}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-16 px-4 text-center border border-dashed border-outline my-6 bg-surface-container-lowest">
            <Search size={48} className="mx-auto text-surface-dim mb-4" />
            <h3 className="text-headline-lg font-headline-lg uppercase mb-2">NO MATCHING ARTICLES FOUND</h3>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-md mx-auto mb-6">
              We couldn't find any articles matching your search criteria. Try modifying your search keywords or clearing your active filters.
            </p>
            <button
              onClick={resetAllFilters}
              className="bg-primary text-on-primary font-bold px-6 py-2 text-xs uppercase tracking-wider border border-primary hover:bg-on-surface hover:text-background transition-all inline-flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>RESET ALL SEARCH FILTERS</span>
            </button>
          </div>
        )}
      </section>
    </main>
  );
};
