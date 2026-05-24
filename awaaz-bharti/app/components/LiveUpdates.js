"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "../../lib/utils";

export default function LiveUpdates({ updates }) {
  return (
    <section className="bg-white rounded-xl p-4 shadow-sm border border-black/[.04]">
      {/* Header */}
      <div className="mb-3 pb-2 border-b-[3px] border-red-700 flex items-center justify-between">
        <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-700 rounded-full animate-pulse" />
          Live Updates
        </h2>
        <Link href="/live-updates" className="text-[10px] font-black text-red-700 uppercase tracking-widest hover:underline">
          View All →
        </Link>
      </div>

      {updates.length === 0 ? (
        <p className="text-[12px] text-slate-400 italic py-3">No live updates right now.</p>
      ) : (
        <div className="relative pl-5">
          <div className="absolute left-[5px] top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-3">
            {updates.map((item, i) => {
              const href = item.slug ? `/live-updates/${item.slug}` : item.id ? `/live-updates/${item.id}` : "/live-updates";
              return (
                <div key={i} className="relative">
                  <div
                    className={`absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-red-700 z-10 ${
                      i === 0 ? "bg-red-700 shadow-[0_0_0_3px_rgba(215,44,22,.15)]" : "bg-white"
                    }`}
                  />
                  <Link href={href} className={`block rounded-lg p-2.5 hover:bg-red-50 transition-colors group ${i === 0 ? "bg-red-50 border border-red-200" : ""}`}>
                    <span className="text-[10px] font-bold text-red-700 uppercase block mb-0.5">{item.time}</span>
                    <div className="flex gap-2.5 items-start">
                      {item.coverImage && (
                        <div className="relative w-16 h-12 rounded-md overflow-hidden shrink-0">
                          <Image src={getImageUrl(item.coverImage)} alt={item.headline} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-extrabold leading-snug text-gray-900 mb-0.5 group-hover:text-red-700 transition-colors line-clamp-2">
                          {item.headline}
                        </h4>
                        {item.excerpt && (
                          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{item.excerpt}</p>
                        )}
                        {!item.excerpt && item.description && (
                          <p className="text-[12px] text-gray-600 leading-relaxed line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="mt-1.5 text-[10px] font-black text-red-700 uppercase tracking-widest block">Read More →</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
