"use client";

import { useState, useEffect } from "react";

export default function TextToSpeech({ text }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    
    // Clean up text if it contains HTML
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    speech.text = cleanText;

    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => setIsSpeaking(false);
    speech.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(speech);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="flex items-center gap-3 my-4">
      {!isSpeaking ? (
        <button
          onClick={handleSpeak}
          className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-full text-sm font-bold hover:bg-red-800 transition-colors shadow-md"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          Listen to Article
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-black transition-colors shadow-md animate-pulse"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
          Stop Listening
        </button>
      )}
    </div>
  );
}
