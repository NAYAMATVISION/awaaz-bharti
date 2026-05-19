"use client";

import Image from "next/image";
import Badge from "./Badge";
import { useState, useEffect } from "react";
import { getImageUrl } from "../../lib/utils";

export default function ArticleHeader({ article }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynth, setSpeechSynth] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSpeechSynth(window.speechSynthesis);
    }
  }, []);

  const handleTTS = () => {
    if (!speechSynth) return;

    if (isSpeaking) {
      speechSynth.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${article.title}. ${article.content.replace(/<[^>]*>/g, '')}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    speechSynth.speak(utterance);
  };

  return (
    <header className="mb-10">
      {/* Category & Date */}
      <div className="flex items-center gap-3 mb-6">
        <Badge label={article.badge || article.category} type={article.badgeType || "politics"} />
        <span className="text-sm text-slate-500 font-semibold tracking-wide">{article.date}</span>
      </div>

      {/* Title - Moved to a very prominent state */}
      <h1 className="text-4xl md:text-6xl font-black leading-[1.1] text-slate-900 mb-8 tracking-tightest">
        {article.title}
      </h1>

      {/* Author & Actions - More space, cleaner look */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-y border-slate-200 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-700 flex items-center justify-center text-white text-lg font-black shadow-sm">
            {article.author?.[0]}
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-slate-900 leading-none mb-1">By {article.author}</p>
            <p className="text-xs text-slate-500 font-medium">Awaz Bharti Senior Correspondent</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* TTS Button - Clearly visible but balanced */}
          <button
            onClick={handleTTS}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm border ${
              isSpeaking 
                ? "bg-red-700 text-white border-red-700 animate-pulse" 
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span>{isSpeaking ? "⏹ Stop Listening" : "🔊 Listen to Article"}</span>
          </button>

          {/* Share Buttons (UI Only) */}
          <div className="flex items-center gap-2.5">
            {["fb", "tw", "wa"].map((platform) => (
              <button
                key={platform}
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 hover:border-slate-200 transition-all shadow-sm"
                title={`Share on ${platform}`}
              >
                <div className="w-4 h-4 bg-slate-400 rounded-xs"></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Image - Added caption placeholder and better rounding */}
      <figure>
        <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl mb-3">
          <Image
            src={getImageUrl(article.image)}
            alt={article.title}
            width={1200}
            height={675}
            priority
            className="w-full h-full object-cover"
          />
        </div>
        <figcaption className="text-xs text-slate-500 italic text-center">
          Featured Image: {article.title} — Photo by Awaz Bharti
        </figcaption>
      </figure>
    </header>
  );
}
