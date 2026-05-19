"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const FALLBACKS = [
  {
    title: "Advertise with Awaz Bharti",
    tagline: "Reach thousands of readers daily",
    bg: "from-red-700 to-red-900",
    redirectUrl: "/advertise",
  },
  {
    title: "India's Trusted News Platform",
    tagline: "Unbiased. In-depth. Real-time.",
    bg: "from-slate-800 to-slate-900",
    redirectUrl: "/about",
  },
];

function FallbackAd({ ad }) {
  return (
    <a
      href={ad.redirectUrl}
      className="block w-full h-[200px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      <div className={`w-full h-full bg-gradient-to-br ${ad.bg} flex flex-col items-center justify-center p-5 text-center`}>
        <div className="text-white/20 text-5xl font-black mb-2">AB</div>
        <p className="text-white font-black text-base leading-snug">{ad.title}</p>
        <p className="text-white/70 text-xs mt-1.5">{ad.tagline}</p>
        <span className="mt-4 px-4 py-1.5 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
          Learn More
        </span>
      </div>
    </a>
  );
}

function AdBanner({ ad }) {
  return (
    <a
      href={ad.redirectUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="relative w-full h-[200px]">
        <Image
          src={ad.image}
          alt={ad.title}
          fill
          className="object-cover"
          sizes="320px"
        />
      </div>
    </a>
  );
}

export default function SidebarAds({ placements = ["homepage-sidebar"] }) {
  const [ads, setAds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    Promise.all(
      placements.map((p) =>
        fetch(`${apiUrl}/api/ads/placement/${p}`)
          .then((r) => r.json())
          .then((d) => (d.success ? d.data : []))
          .catch(() => [])
      )
    )
      .then((results) => {
        setAds(results.flat());
        setLoaded(true);
      });
  }, []);

  if (!loaded) {
    return (
      <div className="flex flex-col gap-4">
        {FALLBACKS.map((fb, i) => (
          <FallbackAd key={i} ad={fb} />
        ))}
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {FALLBACKS.map((fb, i) => (
          <FallbackAd key={i} ad={fb} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {ads.map((ad) => (
        <AdBanner key={ad._id} ad={ad} />
      ))}
    </div>
  );
}
