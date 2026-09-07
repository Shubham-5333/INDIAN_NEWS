import React from 'react';
import { Share2 } from 'lucide-react';
import { formatImageUrl } from '../../api/client';

export const ArticleCard = ({
  article,
  variant = 'list',
  onSelect,
  onShare,
}) => {
  const imgSrc = formatImageUrl(article.imageUrl || article.featuredImage);

  // Hero Lead Article Variant
  if (variant === 'hero') {
    return (
      <article className="group cursor-pointer w-full min-w-0 overflow-hidden" onClick={() => onSelect(article)}>
        {imgSrc && (
          <div className="relative overflow-hidden border border-on-surface mb-stack-md">
            <img
              src={imgSrc}
              alt={article.title}
              className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-0 left-0 bg-primary text-on-primary px-3 py-1 text-label-caps font-label-caps uppercase">
              BREAKING NEWS
            </div>
          </div>
        )}

        <div className="min-w-0 overflow-hidden">
          <span className="text-primary font-bold text-label-caps font-label-caps uppercase block truncate">
            {article.category} • {article.timestamp}
          </span>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-headline-xl mt-2 mb-4 group-hover:text-primary transition-colors leading-tight break-words [overflow-wrap:anywhere]">
            {article.title}
          </h1>

          <p className="text-body-lg font-body-lg text-secondary mb-4 line-clamp-3 break-words [overflow-wrap:anywhere]">
            {article.summary}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-outline-variant">
            <button className="border border-on-surface text-on-surface hover:bg-on-surface hover:text-background transition-all px-4 sm:px-6 py-1.5 sm:py-2 text-[11px] sm:text-label-caps font-label-caps uppercase">
              READ FULL STORY
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onShare && onShare(article); }}
              className="p-1.5 hover:bg-surface-container text-on-surface transition-colors"
              title="Share"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Opinion Column Variant
  if (variant === 'opinion') {
    return (
      <article
        onClick={() => onSelect(article)}
        className="flex flex-col group cursor-pointer border border-on-surface p-4 bg-surface-container-lowest w-full min-w-0 overflow-hidden"
      >
        {imgSrc && (
          <div className="border border-on-surface mb-3 overflow-hidden aspect-video">
            <img
              src={imgSrc}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <span className="text-primary font-bold text-label-caps font-label-caps uppercase block truncate">
          {article.category} • {article.author?.name || 'Staff Reporter'}
        </span>
        <h3 className="text-lg sm:text-xl font-headline-lg mt-2 mb-3 group-hover:underline leading-snug break-words [overflow-wrap:anywhere]">
          "{article.title}"
        </h3>
        <p className="text-body-md font-body-md text-on-surface-variant line-clamp-3 break-words [overflow-wrap:anywhere]">
          {article.summary}
        </p>
      </article>
    );
  }

  // Compact Variant
  if (variant === 'compact') {
    return (
      <article
        onClick={() => onSelect(article)}
        className="py-3 border-b border-outline-variant hover:bg-surface-container-low px-2 transition-colors cursor-pointer group w-full min-w-0 overflow-hidden"
      >
        <span className="text-primary font-bold text-meta-sm font-meta-sm uppercase block mb-1 truncate">
          {article.category} • {article.timestamp}
        </span>
        <h4 className="text-sm sm:text-base font-headline-lg-mobile leading-tight group-hover:text-primary transition-colors break-words [overflow-wrap:anywhere]">
          {article.title}
        </h4>
      </article>
    );
  }

  // Standard List Variant
  return (
    <article
      onClick={() => onSelect(article)}
      className="flex gap-3 sm:gap-4 group cursor-pointer border-b border-outline-variant pb-4 w-full min-w-0 overflow-hidden items-start"
    >
      <div className="flex-grow min-w-0 flex-1 overflow-hidden">
        <span className="text-primary font-bold text-meta-sm font-meta-sm uppercase block truncate">
          {article.category} • {article.timestamp}
        </span>
        <h3 className="text-base sm:text-lg font-headline-lg-mobile leading-snug mt-1 group-hover:text-primary transition-colors break-words [overflow-wrap:anywhere]">
          {article.title}
        </h3>
        <p className="text-body-md font-body-md text-secondary mt-1 line-clamp-2 hidden sm:block break-words [overflow-wrap:anywhere]">
          {article.summary}
        </p>
      </div>

      {imgSrc && (
        <div className="w-20 sm:w-24 h-20 sm:h-24 shrink-0 border border-on-surface overflow-hidden self-start bg-surface-container-high">
          <img
            src={imgSrc}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
        </div>
      )}
    </article>
  );
};
