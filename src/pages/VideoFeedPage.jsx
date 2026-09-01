import React, { useState, useEffect, useCallback } from 'react';
import { Play, Eye, Radio, Video } from 'lucide-react';
import { api, formatImageUrl } from '../api/client';
import {
  VideoFeedSkeleton,
  ErrorState,
  EmptyState,
} from '../components/ui/LoadingSkeletons';

export const VideoFeedPage = ({ selectedVideo }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getNews({ limit: 20 });
      if (res && res.news && Array.isArray(res.news)) {
        const formatted = res.news.map((item) => ({
          id: item._id || item.id,
          title: item.title,
          category: item.category || 'BROADCAST',
          duration: '03:45',
          thumbnail: formatImageUrl(item.featuredImage || item.imageUrl || ''),
          views: `${item.views || 120}K views`,
          timestamp: new Date(item.createdAt || Date.now()).toLocaleDateString('en-IN'),
          isLive: Boolean(item.isLive),
          description: item.summary || item.title,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        }));
        setVideos(formatted);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error('Error fetching video feed:', err);
      setError(err.message || 'Unable to connect to the video broadcast server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const activeVid = selectedVideo || videos[0];

  return (
    <div className="bg-inverse-surface min-h-screen text-on-primary flex-1 font-sans">
      <main className="max-w-7xl mx-auto px-container-margin py-stack-md">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-stack-lg border-l-4 border-primary pl-4 py-1">
          <div>
            <h2 className="text-on-primary font-headline-xl text-2xl sm:text-3xl lg:text-headline-xl uppercase tracking-tighter">
              VIDEO FEED
            </h2>
            <p className="text-on-secondary-container font-meta-sm text-meta-sm max-w-xl mt-1">
              Curated visual journalism and video broadcasts from Indian News.
            </p>
          </div>
        </div>

        {loading ? (
          /* Video Layout Skeletons */
          <VideoFeedSkeleton />
        ) : error ? (
          /* Retryable Error State */
          <ErrorState message={error} onRetry={fetchVideos} />
        ) : videos.length === 0 ? (
          /* Empty Video State */
          <EmptyState
            title="NO VIDEO BROADCASTS AVAILABLE"
            message="No video broadcasts have been published yet. Check back soon or use the Admin Dashboard to publish broadcasts."
            onAction={fetchVideos}
            actionLabel="REFRESH BROADCASTS"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Main Feed Column */}
            <div className="lg:col-span-8 space-y-stack-md">
              {activeVid && (
                <article className="relative group cursor-pointer bg-surface-dim overflow-hidden transition-all duration-300">
                  <div className="aspect-video relative">
                    <img
                      src={activeVid.thumbnail || activeVid.thumbnailUrl}
                      alt={activeVid.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary text-on-primary px-2.5 sm:px-3 py-1 font-label-caps text-[10px] sm:text-label-caps flex items-center gap-1.5 uppercase font-bold">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      <span>BROADCAST</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6">
                      <h3 className="text-on-primary font-headline-lg text-lg sm:text-2xl lg:text-headline-lg leading-tight mb-1 sm:mb-2 group-hover:underline uppercase line-clamp-2">
                        {activeVid.title}
                      </h3>
                      <div className="flex items-center gap-4 text-on-primary/70 font-meta-sm text-[10px] sm:text-meta-sm uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Eye size={14} /> {activeVid.views || activeVid.viewsCount}</span>
                        <span>{activeVid.category}</span>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Feed Grid Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                {videos.slice(1).map((vid) => (
                  <article key={vid.id} className="flex flex-col bg-inverse-surface border border-on-secondary-fixed-variant group transition-all cursor-pointer">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={vid.thumbnail || vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 text-on-primary font-label-caps text-[10px]">
                        {vid.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/40 group-hover:bg-primary p-3 transition-colors">
                          <Play size={20} className="fill-white translate-x-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-stack-sm flex flex-col gap-2">
                      <span className="text-primary font-label-caps text-label-caps uppercase">
                        {vid.category}
                      </span>
                      <h4 className="text-on-primary font-headline-lg-mobile text-headline-lg-mobile group-hover:text-primary transition-colors leading-snug">
                        {vid.title}
                      </h4>
                      <div className="flex justify-between items-center text-on-secondary-container font-meta-sm text-meta-sm pt-1">
                        <span>{vid.timestamp}</span>
                        <span className="flex items-center gap-1"><Eye size={12} /> {vid.views || vid.viewsCount}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar Clips */}
            <aside className="lg:col-span-4 space-y-stack-lg">
              <div className="bg-surface-container-low p-stack-md text-on-surface">
                <h5 className="text-on-surface font-label-caps text-label-caps border-b-2 border-primary pb-2 mb-stack-md uppercase font-bold flex items-center gap-2">
                  <Radio size={16} className="text-primary animate-pulse" />
                  RECENT CLIPS
                </h5>

                <div className="space-y-stack-md">
                  {videos.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex gap-3 sm:gap-4 group cursor-pointer border-b border-outline-variant pb-3">
                      <div className="w-16 sm:w-20 h-16 sm:h-20 shrink-0 bg-black relative overflow-hidden">
                        <img src={item.thumbnail || item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play size={16} className="fill-white" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-primary font-label-caps text-[10px] font-bold uppercase">{item.category}</span>
                        <h4 className="font-headline-lg-mobile text-xs leading-tight text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};
