"use client";

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function EPaperPage() {
  const [epaper, setEpaper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/epaper`)
      .then(res => res.json())
      .then(data => { if (data.success) setEpaper(data.data); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Convert any Google Drive URL format to embed/preview URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/[-\w]{25,}/);
    if (match) return `https://drive.google.com/file/d/${match[0]}/preview`;
    return url; // return as-is if not a Drive URL
  };

  const embedUrl = epaper ? getEmbedUrl(epaper.fileUrl) : null;

  // Direct open URL (view instead of preview)
  const openUrl = epaper?.fileUrl?.replace('/preview', '/view') || epaper?.fileUrl;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-5 py-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1.5 h-8 bg-red-700 rounded-full" />
          <h1 className="text-3xl font-black text-gray-900">E-Paper</h1>
          {epaper && (
            <span className="ml-auto text-xs text-slate-400 font-medium">
              {new Date(epaper.updatedAt).toLocaleDateString('en-IN', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-red-700 rounded-full animate-spin" />
          </div>
        ) : !epaper ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <svg className="w-16 h-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <p className="text-xl font-bold text-slate-400">Today&apos;s newspaper not available</p>
            <p className="text-sm text-slate-300">Please check back later</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-gray-900">{epaper.title}</span>
              <a
                href={openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-red-700 text-white text-xs font-black rounded-full hover:bg-red-800 transition-all uppercase tracking-widest"
              >
                Open in New Tab
              </a>
            </div>
            <iframe
              src={embedUrl}
              width="100%"
              style={{ height: 'min(90vh, 700px)', border: 'none' }}
              title={epaper.title}
              allow="autoplay"
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
