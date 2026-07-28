import React from 'react';
import { Play, Eye } from 'lucide-react';

export const VideoCard = ({ video, onSelect, isFeatured = false }) => {
  if (isFeatured) {
    return (
      <div 
        onClick={() => onSelect(video)}
        className="group relative bg-news-dark text-white overflow-hidden cursor-pointer border border-neutral-800 shadow-lg"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          {/* Live / Duration Tag */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {video.isLive ? (
              <span className="bg-primary text-white font-headline font-black text-xs uppercase px-3 py-1 flex items-center gap-1.5 shadow">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>24/7 LIVE TV</span>
              </span>
            ) : (
              <span className="bg-black/80 text-white font-mono text-xs px-2.5 py-1 font-bold">
                {video.duration}
              </span>
            )}
            <span className="bg-neutral-800 text-neutral-300 font-sans text-xs px-2.5 py-1 font-semibold uppercase">
              {video.category}
            </span>
          </div>

          {/* Big Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-none bg-primary/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Play size={28} className="fill-white translate-x-0.5" />
            </div>
          </div>

          {/* Bottom Title Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-headline font-black text-xl sm:text-2xl lg:text-3xl text-white group-hover:text-primary transition-colors leading-tight">
              {video.title}
            </h3>
            <div className="mt-2 flex items-center gap-4 text-xs font-sans text-neutral-400">
              {video.speaker && <span>Desk: {video.speaker}</span>}
              <span className="flex items-center gap-1"><Eye size={14} /> {video.viewsCount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(video)}
      className="group bg-news-dark text-white border border-neutral-800 overflow-hidden cursor-pointer hover:border-neutral-700 transition-all flex flex-col justify-between"
    >
      <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[11px] px-2 py-0.5 font-bold">
          {video.duration}
        </div>

        {/* Small Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-none bg-primary/80 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={18} className="fill-white translate-x-0.5" />
          </div>
        </div>
      </div>

      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-headline uppercase font-bold text-primary tracking-widest block mb-1">
            {video.category}
          </span>
          <h4 className="font-headline font-bold text-sm sm:text-base text-white group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {video.title}
          </h4>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 font-sans border-t border-neutral-800/80 pt-2">
          <span>{video.timestamp}</span>
          <span>{video.viewsCount}</span>
        </div>
      </div>
    </div>
  );
};
