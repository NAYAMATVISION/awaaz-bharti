"use client";

import { useRef } from "react";

const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
};

export default function VideoSection({ videos }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b-[3px] border-red-700">
        <h2 className="text-base font-black text-gray-900 tracking-tight">📺 Latest Videos</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-red-700 hover:text-red-700 transition-all"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-red-700 hover:text-red-700 transition-all"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <a href="/videos" className="text-[12px] text-red-700 font-semibold hover:opacity-70 transition-opacity">
            View All →
          </a>
        </div>
      </div>

      {/* Carousel */}
      {videos.length === 0 ? (
        <p className="text-[12px] text-slate-400 italic py-3">No videos available right now.</p>
      ) : (
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pl-1 py-2 pb-3 scrollbar-hide"
      >
        {videos.map((video, i) => {
          const youtubeId = extractYouTubeId(video.youtubeUrl);
          const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : null;

          return (
            <article
              key={i}
              className="snap-start min-w-[240px] max-w-[240px] sm:min-w-[260px] sm:max-w-[260px] flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-sm border border-black/[.04] transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col"
            >
              <div className="relative aspect-video bg-slate-900/5">
                {embedUrl ? (
                  <iframe
                    title={video.title}
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 text-xs font-bold">
                    Invalid YouTube URL
                  </div>
                )}
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <h4 className="text-[13px] font-semibold leading-snug text-gray-900 line-clamp-2">{video.title}</h4>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                  {video.category && (
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-[0.08em] font-black">
                      {video.category}
                    </span>
                  )}
                  <span>{video.time}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      )}
    </section>
  );
}
