import React, { useState } from 'react';
import { Share2, Calendar, Clock, Eye, ArrowLeft } from 'lucide-react';
import { CommentSection } from '../components/news/CommentSection';

export const ArticlePage = ({
  article,
  onBack,
  onSelectArticle,
  onShare,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="w-full flex-1 bg-background font-sans text-on-surface">
      <main className="max-w-7xl mx-auto px-container-margin py-stack-lg grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Article Content (8 Cols) */}
        <article className="md:col-span-8 lg:col-span-8">
          <header className="mb-stack-lg">
            <div className="inline-block bg-primary text-white text-label-caps font-label-caps px-3 py-1 mb-stack-sm uppercase">
              {article.category || 'News'}
            </div>

            <h1 className="font-headline-xl text-headline-xl mb-stack-sm leading-tight text-on-surface">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-outline-variant text-meta-sm font-meta-sm text-secondary">
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

              <div className="flex items-center gap-1 ml-auto">
                <Eye size={14} />
                <span>{article.likesCount || 0} VIEWS</span>
              </div>
            </div>
          </header>

          {/* Lead Image */}
          {article.imageUrl && (
            <div className="mb-stack-lg relative">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full aspect-[16/9] object-cover border border-outline-variant"
              />
              {article.imageCaption && (
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

        {/* Right Column: Sidebar (4 Cols) */}
        <aside className="md:col-span-4 lg:col-span-4 space-y-stack-lg font-sans">
          {/* Newsletter Box */}
          <div className="border border-on-surface p-6 bg-surface-container-lowest">
            <h3 className="font-headline-lg text-headline-lg mb-stack-sm uppercase">THE DAILY PULSE</h3>
            <p className="font-meta-sm text-meta-sm text-secondary mb-4">Get the most authoritative news delivered to your inbox every morning at 6 AM.</p>
            {subscribed ? (
              <p className="text-xs font-bold text-primary">Subscribed!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER EMAIL ADDRESS"
                  className="border-b border-on-surface bg-transparent p-2 text-label-caps font-label-caps outline-none focus:border-primary transition-colors text-on-surface"
                />
                <button
                  type="submit"
                  className="bg-primary text-white py-3 font-bold text-label-caps font-label-caps hover:bg-red-700 transition-colors uppercase"
                >
                  SUBSCRIBE NOW
                </button>
              </form>
            )}
          </div>
        </aside>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 right-8 flex flex-col gap-3 z-40">
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
