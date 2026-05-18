"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SidebarAds from "./SidebarAds";

export default function Sidebar() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/articles/trending`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setTrending(data.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Trending Box */}
      <div className="w-full bg-white rounded-lg shadow-sm border border-black/[.04] overflow-hidden">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white px-[18px] py-3.5 text-[15px] font-extrabold tracking-wide">
          🔥 Trending Now
        </div>
        <div>
          {trending.length === 0 ? (
            <p className="px-[18px] py-4 text-[12px] text-slate-400 italic">No trending articles yet.</p>
          ) : (
            trending.map((item, i) => (
              <Link
                key={item._id}
                href={`/article/${item._id}`}
                target="_blank"
                className="flex items-start gap-3.5 px-[18px] py-3.5 border-b border-gray-100 last:border-0 transition-all duration-200 hover:bg-red-50 hover:translate-x-0.5 group"
              >
                <span className="text-2xl font-black text-red-700 opacity-25 leading-none min-w-[32px] tabular-nums transition-opacity group-hover:opacity-80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-[13px] font-extrabold leading-snug text-gray-900 line-clamp-2">{item.title}</h4>
                  <span className="text-[11px] text-gray-400 mt-0.5 block capitalize">
                    Trending in {item.category}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Dynamic Advertisements */}
      <SidebarAds placements={["homepage-sidebar"]} />
    </div>
  );
}
