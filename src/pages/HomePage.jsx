import React, { useState, useEffect, useCallback } from 'react';
import { BreakingTicker } from '../components/news/BreakingTicker';
import { MarketTicker } from '../components/news/MarketTicker';
import { ArticleCard } from '../components/news/ArticleCard';
import { ArrowRight } from 'lucide-react';
import { api, formatImageUrl } from '../api/client';
import { BREAKING_NEWS_TICKER } from '../data/mockData';
import {
  HeroArticleSkeleton,
  ListArticleSkeleton,
  OpinionCardSkeleton,
  ErrorState,
  EmptyState,
} from '../components/ui/LoadingSkeletons';

export const HomePage = ({
  onSelectArticle,
  onSelectCategory,
  onSelectVideo,
  onShare,
}) => {
  const [leadArticle, setLeadArticle] = useState(null);
  const [latestArticles, setLatestArticles] = useState([]);
  const [mustRead, setMustRead] = useState([]);
  const [breakingHeadlines, setBreakingHeadlines] = useState(BREAKING_NEWS_TICKER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLiveContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getNews({ limit: 30 });
      if (res && res.news && Array.isArray(res.news)) {
        const formatted = res.news.map((item) => ({
          id: item._id || item.id,
          title: item.title,
          summary: item.summary,
          category: item.category || 'General',
          author: item.author || { name: 'Editorial Desk', role: 'Staff Reporter' },
          timestamp: item.timestamp || new Date(item.createdAt || Date.now()).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
          }),
          readTime: item.readTime || '4 min read',
          imageUrl: formatImageUrl(item.featuredImage || item.imageUrl || ''),
          imageCaption: item.imageCaption || '',
          isLive: Boolean(item.isLive),
          isBreaking: Boolean(item.isBreaking),
          commentsCount: item.commentsCount || 0,
          likesCount: item.views || 0,
          tags: item.tags || [],
          content: Array.isArray(item.content) ? item.content : [item.content],
          featured: Boolean(item.featured),
        }));

        if (formatted.length > 0) {
          const featured = formatted.find((a) => a.featured) || formatted[0];
          setLeadArticle(featured);

          const rest = formatted.filter((a) => a.id !== (featured ? featured.id : ''));
          setLatestArticles(rest);
          setMustRead(rest.length > 2 ? rest.slice(2, 5) : rest);

          const breaking = formatted.filter((a) => a.isBreaking).map((a) => a.title);
          if (breaking.length > 0) {
            setBreakingHeadlines(breaking);
          } else if (formatted.length > 0) {
            setBreakingHeadlines(formatted.slice(0, 6).map((a) => a.title));
          } else {
            setBreakingHeadlines(BREAKING_NEWS_TICKER);
          }
        } else {
          setLeadArticle(null);
          setLatestArticles([]);
          setMustRead([]);
          setBreakingHeadlines(BREAKING_NEWS_TICKER);
        }
      } else {
        setLeadArticle(null);
        setLatestArticles([]);
        setMustRead([]);
        setBreakingHeadlines(BREAKING_NEWS_TICKER);
      }
    } catch (err) {
      console.error('Error fetching live news content:', err);
      setError(err.message || 'Unable to connect to the news service.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveContent();
  }, [fetchLiveContent]);

  return (
    <div className="w-full flex-1 font-sans">
      {/* Breaking Ticker & Market Summary (Hidden during initial skeleton loading) */}
      {!loading && (
        <>
          {breakingHeadlines.length > 0 && (
            <BreakingTicker breakingItems={breakingHeadlines} onSelectArticle={() => leadArticle && onSelectArticle(leadArticle)} />
          )}
          <MarketTicker />
        </>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-container-margin py-8">
        {loading ? (
          /* Pending Loading Skeletons */
          <div className="space-y-12">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <HeroArticleSkeleton />
              </div>
              <div className="lg:col-span-4 space-y-6">
                <div className="w-24 h-6 bg-surface-container-high mb-4"></div>
                <ListArticleSkeleton />
                <ListArticleSkeleton />
                <ListArticleSkeleton />
              </div>
            </section>
            <section className="pt-8 border-t border-outline-variant">
              <div className="w-36 h-7 bg-surface-container-high mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <OpinionCardSkeleton />
                <OpinionCardSkeleton />
                <OpinionCardSkeleton />
              </div>
            </section>
          </div>
        ) : error ? (
          /* Error State with Retry Button */
          <ErrorState message={error} onRetry={fetchLiveContent} />
        ) : !leadArticle && latestArticles.length === 0 ? (
          /* Empty State */
          <EmptyState
            title="NO NEWS ARTICLES PUBLISHED"
            message="There are currently no news articles available on the homepage. Use the Admin Dashboard to publish your first story."
            onAction={fetchLiveContent}
            actionLabel="REFRESH FEED"
          />
        ) : (
          <>
            {/* Section 1: Hero & Latest Sidebar */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6 sm:mb-8">
              {/* Main Featured Story (8 Cols) */}
              <div className="lg:col-span-8 min-w-0 overflow-hidden">
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
              <div className="lg:col-span-4 min-w-0 flex flex-col gap-6 overflow-hidden">
                <div className="flex items-center gap-2 border-l-4 border-primary pl-4 mb-2">
                  <h2 className="text-headline-lg font-headline-lg italic uppercase">LATEST</h2>
                  <div className="h-[1px] flex-grow bg-outline-variant"></div>
                </div>

                <div className="space-y-6 min-w-0">
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
              <section className="border-t border-on-surface pt-6 sm:pt-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl lg:text-headline-xl font-headline-xl uppercase">MUST READ</h2>
                  <button
                    onClick={() => onSelectCategory && onSelectCategory('All')}
                    className="text-primary font-bold text-label-caps font-label-caps hover:underline uppercase flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>BROWSE ALL CATEGORIES</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mustRead.map((article) => (
                    <div key={article.id} className="min-w-0">
                      <ArticleCard
                        article={article}
                        variant="opinion"
                        onSelect={onSelectArticle}
                        onShare={onShare}
                      />
                    </div>
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
