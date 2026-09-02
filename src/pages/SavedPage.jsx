import React, { useState, useEffect } from 'react';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { ArticleCard } from '../components/news/ArticleCard';
import { api } from '../api/client';
import { FEATURED_LEAD_ARTICLE, TOP_STORIES, OPINION_PIECES } from '../data/mockData';

export const SavedPage = ({
  savedArticleIds = [],
  onSelectArticle,
  onToggleSave,
  onShare,
  onBack,
}) => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const getFallbackSaved = () => {
    const allMock = [FEATURED_LEAD_ARTICLE, ...TOP_STORIES, ...OPINION_PIECES];
    return allMock.filter((item) => savedArticleIds.includes(item.id));
  };

  useEffect(() => {
    const fetchSaved = async () => {
      if (!savedArticleIds || savedArticleIds.length === 0) {
        setSavedArticles([]);
        return;
      }
      try {
        setLoading(true);
        const res = await api.getNews({ limit: 50 });
        if (res && res.news && res.news.length > 0) {
          const formatted = res.news
            .filter((item) => savedArticleIds.includes(item._id || item.id))
            .map((item) => ({
              id: item._id || item.id,
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
              likesCount: item.views || 0,
              tags: item.tags || [],
              content: Array.isArray(item.content) ? item.content : [item.content],
            }));
          setSavedArticles(formatted.length > 0 ? formatted : getFallbackSaved());
        } else {
          setSavedArticles(getFallbackSaved());
        }
      } catch (err) {
        console.log('Error fetching saved articles:', err);
        setSavedArticles(getFallbackSaved());
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [savedArticleIds]);

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans">
      <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-surface-container rounded-none text-secondary hover:text-on-surface transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-primary">
              PERSONAL READING LIST
            </span>
            <h1 className="font-headline font-black text-3xl sm:text-4xl text-on-surface tracking-tight uppercase">
              SAVED ARTICLES ({savedArticles.length})
            </h1>
          </div>
        </div>
      </div>

      {savedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="list"
              onSelect={onSelectArticle}
              isSaved={true}
              onToggleSave={onToggleSave}
              onShare={onShare}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-surface-container-high p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-none bg-surface-container flex items-center justify-center mx-auto text-secondary">
            <Bookmark size={24} />
          </div>
          <h3 className="font-headline font-bold text-xl text-on-surface">YOUR READING LIST IS EMPTY</h3>
          <p className="text-sm font-sans text-secondary max-w-md mx-auto">
            Click the bookmark icon on any news story or article to save it for reading offline later.
          </p>
          <button
            onClick={onBack}
            className="bg-news-dark text-white text-xs font-headline font-bold uppercase px-5 py-2.5"
          >
            EXPLORE LATEST NEWS
          </button>
        </div>
      )}
    </div>
  );
};
