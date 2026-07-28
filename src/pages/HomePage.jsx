import React, { useState, useEffect } from 'react';
import { BreakingTicker } from '../components/news/BreakingTicker';
import { MarketTicker } from '../components/news/MarketTicker';
import { ArticleCard } from '../components/news/ArticleCard';
import { ArrowRight, Newspaper } from 'lucide-react';
import { api } from '../api/client';
import { FEATURED_LEAD_ARTICLE, TOP_STORIES, OPINION_PIECES, BREAKING_NEWS_TICKER } from '../data/mockData';

export const HomePage = ({
  onSelectArticle,
  onSelectCategory,
  onSelectVideo,
  onShare,
}) => {
  const [leadArticle, setLeadArticle] = useState(FEATURED_LEAD_ARTICLE);
  const [latestArticles, setLatestArticles] = useState(TOP_STORIES);
  const [mustRead, setMustRead] = useState(OPINION_PIECES);
  const [breakingHeadlines, setBreakingHeadlines] = useState(BREAKING_NEWS_TICKER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLiveContent = async () => {
      try {
        setLoading(true);
        const res = await api.getNews({ limit: 30 });
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
            readTime: item.readTime || '4 min read',
            imageUrl: item.featuredImage || item.imageUrl || '',
            imageCaption: item.imageCaption || '',
            isLive: Boolean(item.isLive),
            isBreaking: Boolean(item.isBreaking),
            commentsCount: 0,
            likesCount: item.views || 0,
            tags: item.tags || [],
            content: Array.isArray(item.content) ? item.content : [item.content],
            featured: Boolean(item.featured),
          }));

          const featured = formatted.find((a) => a.featured) || formatted[0];
          setLeadArticle(featured || FEATURED_LEAD_ARTICLE);

          const rest = formatted.filter((a) => a.id !== (featured ? featured.id : ''));
          setLatestArticles(rest.length > 0 ? rest : TOP_STORIES);
          setMustRead(rest.length > 2 ? rest.slice(2, 5) : OPINION_PIECES);

          const breaking = formatted.filter((a) => a.isBreaking).map((a) => a.title);
          if (breaking.length > 0) {
            setBreakingHeadlines(breaking);
          }
        }
      } catch (err) {
        console.log('Error fetching live news content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveContent();
  }, []);

  return (
    <div className="w-full flex-1 font-sans">
      {/* Breaking Ticker & Market Summary */}
      {breakingHeadlines.length > 0 && (
        <BreakingTicker breakingItems={breakingHeadlines} onSelectArticle={() => leadArticle && onSelectArticle(leadArticle)} />
      )}
      <MarketTicker />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-container-margin py-8">
        {!leadArticle && !loading ? (
          <div className="border border-outline-variant p-12 text-center my-8">
            <Newspaper size={36} className="mx-auto text-secondary mb-3" />
            <h2 className="text-xl font-bold font-headline uppercase text-on-surface">No news articles found.</h2>
            <p className="text-sm text-secondary mt-1">
              Add news articles using the Admin Panel to display them on the homepage.
            </p>
          </div>
        ) : (
          <>
            {/* Section 1: Hero & Latest Sidebar */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-section-gap">
              {/* Main Featured Story (8 Cols) */}
              <div className="lg:col-span-8">
                {leadArticle && (
                  <ArticleCard
                    article={leadArticle}
                    variant="hero"
                    onSelect={onSelectArticle}
                    onShare={onShare}
                  />
                )}
              </div>

              {/* Latest Sidebar (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="flex items-center gap-2 border-l-4 border-primary pl-4 mb-2">
                  <h2 className="text-headline-lg font-headline-lg italic uppercase">LATEST</h2>
                  <div className="h-[1px] flex-grow bg-outline-variant"></div>
                </div>

                <div className="space-y-6">
                  {latestArticles.slice(0, 4).map((story) => (
                    <ArticleCard
                      key={story.id}
                      article={story}
                      variant="list"
                      onSelect={onSelectArticle}
                      onShare={onShare}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Section 2: Must Read Category Grid */}
            {mustRead.length > 0 && (
              <section className="border-t border-on-surface pt-12">
                <div className="flex justify-between items-end mb-8">
                  <h2 className="text-headline-xl font-headline-xl uppercase">MUST READ</h2>
                  <button
                    onClick={() => onSelectCategory && onSelectCategory('All')}
                    className="text-primary font-bold text-label-caps font-label-caps hover:underline uppercase flex items-center gap-1"
                  >
                    <span>BROWSE ALL CATEGORIES</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mustRead.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="opinion"
                      onSelect={onSelectArticle}
                      onShare={onShare}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};
