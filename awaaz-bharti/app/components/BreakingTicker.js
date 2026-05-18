"use client";

const messages = [
  "Welcome to Awaaz Bharti — Voice of India",
  "Breaking News delivered faster than ever",
  "Stay updated with real-time reports",
  "Trusted journalism, unbiased reporting"
];

const scrollingMessages = [...messages, ...messages];

export default function BreakingTicker() {
  return (
    <div className="ticker-wrapper bg-red-700 h-[38px] overflow-hidden whitespace-nowrap relative z-50 flex items-center">
      <div className="ticker-track inline-flex items-center gap-16 text-white font-medium text-[13px]">
        {scrollingMessages.map((msg, index) => (
          <span key={index} className="ticker-item flex items-center gap-2.5">
            <span className="text-white/50 text-[6px]">●</span>
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
