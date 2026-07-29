import React from 'react';
import { AlertCircle, RotateCcw, Inbox } from 'lucide-react';

// Hero Article Skeleton (Matches 8-col lead article in HomePage)
export const HeroArticleSkeleton = () => {
  return (
    <div className="animate-pulse w-full">
      {/* Image Skeleton */}
      <div className="w-full aspect-[16/9] bg-surface-container-high border border-outline-variant mb-stack-md relative">
        <div className="absolute top-0 left-0 bg-outline-variant w-24 h-6"></div>
      </div>
      {/* Category & Date */}
      <div className="w-48 h-4 bg-surface-container-high mb-3"></div>
      {/* Title Lines */}
      <div className="w-full h-8 bg-surface-container-high mb-2"></div>
      <div className="w-3/4 h-8 bg-surface-container-high mb-4"></div>
      {/* Summary Paragraph */}
      <div className="w-full h-4 bg-surface-container-high mb-2"></div>
      <div className="w-full h-4 bg-surface-container-high mb-2"></div>
      <div className="w-2/3 h-4 bg-surface-container-high mb-6"></div>
      {/* Footer Bar */}
      <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
        <div className="w-36 h-9 bg-surface-container-high"></div>
        <div className="w-8 h-8 bg-surface-container-high"></div>
      </div>
    </div>
  );
};

// Single List Article Item Skeleton
export const ListArticleSkeleton = () => {
  return (
    <div className="animate-pulse flex gap-4 border-b border-outline-variant pb-4 w-full">
      <div className="flex-grow space-y-2">
        <div className="w-28 h-3.5 bg-surface-container-high"></div>
        <div className="w-full h-5 bg-surface-container-high"></div>
        <div className="w-4/5 h-5 bg-surface-container-high"></div>
        <div className="w-full h-3.5 bg-surface-container-high hidden sm:block"></div>
      </div>
      <div className="w-24 h-24 flex-shrink-0 bg-surface-container-high border border-outline-variant"></div>
    </div>
  );
};

// Opinion / Must-Read Card Skeleton
export const OpinionCardSkeleton = () => {
  return (
    <div className="animate-pulse border border-outline-variant p-4 bg-surface-container-lowest flex flex-col w-full">
      <div className="aspect-video w-full bg-surface-container-high border border-outline-variant mb-3"></div>
      <div className="w-32 h-3.5 bg-surface-container-high mb-2"></div>
      <div className="w-full h-6 bg-surface-container-high mb-2"></div>
      <div className="w-3/4 h-6 bg-surface-container-high mb-3"></div>
      <div className="w-full h-3.5 bg-surface-container-high mb-1.5"></div>
      <div className="w-4/5 h-3.5 bg-surface-container-high"></div>
    </div>
  );
};

// Video Feed Skeleton (Player + Grid + Sidebar)
export const VideoFeedSkeleton = () => {
  return (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-gutter w-full">
      {/* Main Video Area */}
      <div className="lg:col-span-8 space-y-stack-md">
        <div className="aspect-video w-full bg-surface-container-high relative overflow-hidden border border-outline-variant">
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="w-3/4 h-7 bg-outline-variant"></div>
            <div className="w-40 h-4 bg-outline-variant"></div>
          </div>
        </div>
        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col bg-surface-container-low border border-outline-variant p-3 space-y-2">
              <div className="aspect-video w-full bg-surface-container-high"></div>
              <div className="w-24 h-3 bg-surface-container-high"></div>
              <div className="w-full h-5 bg-surface-container-high"></div>
              <div className="w-2/3 h-5 bg-surface-container-high"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Clips */}
      <div className="lg:col-span-4 bg-surface-container-low p-stack-md space-y-4 border border-outline-variant">
        <div className="w-36 h-5 bg-surface-container-high mb-4"></div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 border-b border-outline-variant pb-3">
            <div className="w-20 h-20 bg-surface-container-high shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="w-16 h-3 bg-surface-container-high"></div>
              <div className="w-full h-4 bg-surface-container-high"></div>
              <div className="w-4/5 h-4 bg-surface-container-high"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Article Detail Page Skeleton
export const ArticleDetailSkeleton = () => {
  return (
    <div className="animate-pulse w-full max-w-4xl mx-auto py-8">
      <div className="w-24 h-6 bg-surface-container-high mb-4"></div>
      <div className="w-full h-10 bg-surface-container-high mb-3"></div>
      <div className="w-4/5 h-10 bg-surface-container-high mb-6"></div>
      <div className="w-full h-5 bg-surface-container-high mb-8 py-3 border-y border-outline-variant"></div>
      <div className="w-full aspect-[16/9] bg-surface-container-high mb-8 border border-outline-variant"></div>
      <div className="space-y-4">
        <div className="w-full h-4 bg-surface-container-high"></div>
        <div className="w-full h-4 bg-surface-container-high"></div>
        <div className="w-11/12 h-4 bg-surface-container-high"></div>
        <div className="w-4/5 h-4 bg-surface-container-high"></div>
        <div className="w-full h-4 bg-surface-container-high pt-4"></div>
        <div className="w-full h-4 bg-surface-container-high"></div>
        <div className="w-3/4 h-4 bg-surface-container-high"></div>
      </div>
    </div>
  );
};

// Reusable Error State Component with Retry Action
export const ErrorState = ({
  message = "Failed to load content from the server.",
  onRetry,
}) => {
  return (
    <div className="w-full py-16 px-6 text-center border border-red-200 bg-red-50/50 my-6 font-sans">
      <AlertCircle size={44} className="mx-auto text-primary mb-3" />
      <h3 className="text-headline-lg font-headline-lg uppercase text-on-surface mb-2">
        UNABLE TO LOAD CONTENT
      </h3>
      <p className="text-body-md font-body-md text-secondary max-w-md mx-auto mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-on-primary font-bold text-xs uppercase px-6 py-2.5 tracking-wider hover:bg-on-surface hover:text-background transition-all inline-flex items-center gap-2"
        >
          <RotateCcw size={16} />
          <span>TRY AGAIN</span>
        </button>
      )}
    </div>
  );
};

// Reusable Empty State Component
export const EmptyState = ({
  title = "NO ARTICLES FOUND",
  message = "There is currently no news content available in this section.",
  onAction,
  actionLabel = "RESET FILTERS",
}) => {
  return (
    <div className="w-full py-16 px-6 text-center border border-dashed border-outline my-6 bg-surface-container-lowest font-sans">
      <Inbox size={48} className="mx-auto text-surface-dim mb-4" />
      <h3 className="text-headline-lg font-headline-lg uppercase text-on-surface mb-2">
        {title}
      </h3>
      <p className="text-body-md font-body-md text-secondary max-w-md mx-auto mb-6 leading-relaxed">
        {message}
      </p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="bg-primary text-on-primary font-bold text-xs uppercase px-6 py-2.5 tracking-wider border border-primary hover:bg-on-surface hover:text-background transition-all inline-flex items-center gap-2"
        >
          <RotateCcw size={16} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
