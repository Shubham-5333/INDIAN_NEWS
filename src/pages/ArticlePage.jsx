import React from 'react';
import { Share2, Calendar, Clock, Eye, ArrowLeft } from 'lucide-react';
import { CommentSection } from '../components/news/CommentSection';
import { formatImageUrl } from '../api/client';

export const ArticlePage = ({
  article,
  loading = false,
  onBack,
  onSelectArticle,
  onShare,
}) => {
  if (loading && !article) {
    return (
      <div className="w-full flex-1 max-w-4xl mx-auto px-4 py-20 text-center font-sans">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-secondary text-sm font-headline uppercase font-bold tracking-wider">Loading Story...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full flex-1 max-w-4xl mx-auto px-4 py-16 text-center font-sans">
        <h2 className="text-2xl font-bold font-headline mb-4 uppercase">Article Not Found</h2>
        <p className="text-secondary text-sm mb-6">Select a news story from the homepage to read full details.</p>
        <button onClick={onBack} className="bg-primary text-white font-bold text-xs uppercase px-6 py-3 flex items-center gap-2 mx-auto">
          <ArrowLeft size={16} />
          <span>Back to News</span>
        </button>
      </div>
    );
  }

  const articleImgSrc = formatImageUrl(article.imageUrl || article.featuredImage);

  const isRawUrlCaption =
    article.imageCaption &&
    (article.imageCaption.startsWith('http://') ||
      article.imageCaption.startsWith('https://') ||
      article.imageCaption.startsWith('/uploads/'));

  return (
    <div className="w-full flex-1 bg-background font-sans text-on-surface">
      <main className="max-w-4xl mx-auto px-container-margin py-stack-lg w-full">
        <article className="w-full min-w-0">
          <header className="mb-stack-lg">
            <div className="inline-block bg-primary text-white text-label-caps font-label-caps px-3 py-1 mb-stack-sm uppercase">
              {article.category || 'News'}
            </div>

            <h1 className="font-headline-xl text-xl sm:text-2xl lg:text-3xl mb-stack-sm leading-tight text-on-surface break-words [overflow-wrap:anywhere]">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 sm:gap-4 py-3 sm:py-4 border-y border-outline-variant text-meta-sm font-meta-sm text-secondary">
              <div className="flex items-center gap-2">
                <span className="font-bold text-on-surface uppercase">By {article.author?.name || 'Editorial Desk'}</span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{article.timestamp || 'Today'}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{article.readTime || '4 min read'}</span>
              </div>

              <div className="flex items-center gap-1 sm:ml-auto">
                <Eye size={14} />
                <span>{article.likesCount || 0} VIEWS</span>
              </div>
            </div>
          </header>

          {/* Lead Image */}
          {articleImgSrc && (
            <div className="mb-stack-lg relative">
              <img
                src={articleImgSrc}
                alt={article.title}
                className="w-full aspect-[16/9] object-cover border border-outline-variant"
              />
              {article.imageCaption && !isRawUrlCaption && (
                <p className="mt-2 text-meta-sm font-meta-sm text-secondary italic">
                  {article.imageCaption}
                </p>
              )}
            </div>
          )}

          {/* Article Summary */}
          {article.summary && (
            <p className="font-bold text-lg text-on-surface leading-relaxed mb-6 italic border-l-4 border-primary pl-4">
              {article.summary}
            </p>
          )}

          {/* Article Body Content */}
          <div className="article-content font-body-lg text-body-lg text-on-surface leading-relaxed space-y-6">
            {article.content && article.content.length > 0 ? (
              article.content.map((paragraph, idx) => (
                <p key={idx} className={idx === 0 ? "drop-cap" : ""}>{paragraph}</p>
              ))
            ) : (
              <p className="drop-cap">{article.summary || article.title}</p>
            )}
          </div>

          {/* Discussion */}
          <CommentSection />
        </article>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 flex flex-col gap-3 z-30">
        <button
          onClick={() => onShare && onShare(article)}
          className="w-12 h-12 bg-on-surface text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
          title="Share Article"
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};
