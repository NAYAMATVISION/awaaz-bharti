"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "../../lib/utils";

export default function LiveUpdates({ stories }) {
  return (
    <section className="bg-white rounded-xl p-4 shadow-sm border border-black/[.04]">
      <div className="mb-3 pb-2 border-b-[3px] border-red-700 flex items-center justify-between">
        <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-700 rounded-full animate-pulse" />
          Live Coverage
        </h2>
        <Link href="/live" className="text-[10px] font-black text-red-700 uppercase tracking-widest hover:underline">
          View All →
        </Link>
      </div>

      {!stories || stories.length === 0 ? (
        <p className="text-[12px] text-slate-400 italic py-3">No live coverage right now.</p>
      ) : (
        <div className="space-y-3">
          {stories.map((story, i) => (
            <Link
              key={story.id}
              href={`/live/${story.slug}`}
              className={`flex gap-3 items-start rounded-lg p-2.5 hover:bg-red-50 transition-colors group ${i === 0 ? "bg-red-50 border border-red-200" : ""}`}
            >
              {story.coverImage && (
                <div className="relative w-16 h-12 rounded-md overflow-hidden shrink-0">
                  <Image src={getImageUrl(story.coverImage)} alt={story.title} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {story.isLive && (
                    <span className="flex items-center gap-1 bg-red-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shrink-0">
                      <span className="w-1 h-1 bg-white rounded-full animate-pulse" /> Live
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-red-700 uppercase">{story.entryCount} updates</span>
                </div>
                <h4 className="text-[13px] font-extrabold leading-snug text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2">
                  {story.title}
                </h4>
                {story.description && (
                  <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-1 mt-0.5">{story.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
