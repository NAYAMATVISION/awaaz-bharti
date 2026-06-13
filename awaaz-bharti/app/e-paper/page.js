"use client";

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/[-\w]{25,}/);
  if (match) return `https://drive.google.com/file/d/${match[0]}/preview`;
  return url;
};

const getOpenUrl = (url) => {
  if (!url) return '#';
  const match = url.match(/[-\w]{25,}/);
  if (match) return `https://drive.google.com/file/d/${match[0]}/view`;
  return url;
};

const getDownloadUrl = (url) => {
  if (!url) return '#';
  const match = url.match(/[-\w]{25,}/);
  if (match) return `https://drive.google.com/uc?export=download&id=${match[0]}`;
  return url;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function EPaperPage() {
  const [latest, setLatest] = useState(null);
  const [editions, setEditions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingArchive, setLoadingArchive] = useState(true);
  const [viewing, setViewing] = useState(null); // edition being previewed in modal

  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [page, setPage] = useState(1);

  // Build available years from current year back to 2023
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2022 }, (_, i) => currentYear - i);

  // Fetch latest (unchanged — same API call as before)
  useEffect(() => {
    fetch(`${API}/api/epaper`)
      .then(r => r.json())
      .then(d => { if (d.success) setLatest(d.data); })
      .catch(() => {})
      .finally(() => setLoadingLatest(false));
  }, []);

  const fetchArchive = useCallback(() => {
    setLoadingArchive(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (filterYear) params.set('year', filterYear);
    if (filterMonth) params.set('month', filterMonth);
    fetch(`${API}/api/epaper/archive?${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setEditions(d.data);
          setPagination(d.pagination);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingArchive(false));
  }, [page, filterYear, filterMonth]);

  useEffect(() => { fetchArchive(); }, [fetchArchive]);

  const applyFilter = () => { setPage(1); fetchArchive(); };

  const clearFilter = () => {
    setFilterYear('');
    setFilterMonth('');
    setPage(1);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-5 py-10 flex flex-col gap-10">

        {/* ── Latest Edition ──────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-1.5 h-8 bg-red-700 rounded-full" />
            <h1 className="text-3xl font-black text-gray-900">E-Paper</h1>
            {latest && (
              <span className="ml-auto text-xs text-slate-400 font-medium">
                Latest: {formatDate(latest.publicationDate || latest.updatedAt)}
              </span>
            )}
          </div>

          {loadingLatest ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-red-700 rounded-full animate-spin" />
            </div>
          ) : !latest ? (
            <div className="flex flex-col items-center justify-center h-[40vh] gap-3 bg-white rounded-2xl border border-slate-100">
              <span className="text-5xl">📰</span>
              <p className="text-xl font-bold text-slate-400">No e-paper available yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div>
                  <p className="font-extrabold text-gray-900">{latest.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(latest.publicationDate || latest.updatedAt)}</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <a href={getDownloadUrl(latest.fileUrl)} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-1.5 border border-slate-200 text-slate-600 text-xs font-black rounded-full hover:border-slate-900 transition-all uppercase tracking-widest">
                    Download
                  </a>
                  <a href={getOpenUrl(latest.fileUrl)} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-1.5 bg-red-700 text-white text-xs font-black rounded-full hover:bg-red-800 transition-all uppercase tracking-widest">
                    Open
                  </a>
                </div>
              </div>
              <iframe
                src={getEmbedUrl(latest.fileUrl)}
                width="100%"
                style={{ height: 'min(90vh, 700px)', border: 'none' }}
                title={latest.title}
                allow="autoplay"
              />
            </div>
          )}
        </section>

        {/* ── Archive ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-1.5 h-8 bg-slate-400 rounded-full" />
            <h2 className="text-2xl font-black text-gray-900">Archive</h2>
            <span className="text-sm text-slate-400 font-bold">({pagination.total} editions)</span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6 items-end">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Year</label>
              <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 bg-white focus:outline-none focus:border-red-500">
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Month</label>
              <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 bg-white focus:outline-none focus:border-red-500">
                <option value="">All Months</option>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <button onClick={applyFilter}
              className="px-5 py-2 bg-red-700 text-white text-xs font-black rounded-xl hover:bg-red-800 transition-all uppercase tracking-widest">
              Filter
            </button>
            {(filterYear || filterMonth) && (
              <button onClick={clearFilter}
                className="px-5 py-2 border border-slate-200 text-slate-500 text-xs font-black rounded-xl hover:border-slate-900 transition-all uppercase tracking-widest">
                Clear
              </button>
            )}
          </div>

          {loadingArchive ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100 h-48 animate-pulse" />
              ))}
            </div>
          ) : editions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <p className="text-slate-400 font-bold">No editions found for the selected filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {editions.map((edition) => (
                <div key={edition._id}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex flex-col overflow-hidden group">
                  {/* Thumbnail / placeholder */}
                  <button onClick={() => setViewing(edition)}
                    className="relative w-full aspect-[3/4] bg-gradient-to-br from-red-50 to-slate-100 flex flex-col items-center justify-center gap-1 overflow-hidden">
                    {edition.coverImage ? (
                      <img src={edition.coverImage} alt={edition.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">PDF</span>
                      </>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-red-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        Preview
                      </span>
                    </div>
                  </button>

                  <div className="p-3 flex flex-col gap-2 flex-1">
                    <p className="text-[11px] font-extrabold text-gray-900 leading-snug line-clamp-2">{edition.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {formatDate(edition.publicationDate || edition.createdAt)}
                    </p>
                    <div className="flex gap-1 mt-auto">
                      <a href={getOpenUrl(edition.fileUrl)} target="_blank" rel="noopener noreferrer"
                        className="flex-1 text-center py-1.5 bg-red-700 text-white text-[10px] font-black rounded-lg hover:bg-red-800 transition-all uppercase tracking-widest">
                        Read
                      </a>
                      <a href={getDownloadUrl(edition.fileUrl)} target="_blank" rel="noopener noreferrer"
                        className="flex-1 text-center py-1.5 border border-slate-200 text-slate-600 text-[10px] font-black rounded-lg hover:border-slate-900 transition-all uppercase tracking-widest">
                        ↓
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-black rounded-xl hover:border-slate-900 transition-all disabled:opacity-40 uppercase tracking-widest">
                ← Prev
              </button>
              <div className="flex gap-1">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pagination.pages || Math.abs(p - page) <= 2)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '…' ? (
                      <span key={`ellipsis-${i}`} className="px-2 py-2 text-slate-400 text-xs font-bold">…</span>
                    ) : (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${p === page ? 'bg-red-700 text-white' : 'border border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-700'}`}>
                        {p}
                      </button>
                    )
                  )}
              </div>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-black rounded-xl hover:border-slate-900 transition-all disabled:opacity-40 uppercase tracking-widest">
                Next →
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Preview Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-gray-900 truncate">{viewing.title}</p>
                <p className="text-xs text-slate-400">{formatDate(viewing.publicationDate || viewing.createdAt)}</p>
              </div>
              <a href={getDownloadUrl(viewing.fileUrl)} target="_blank" rel="noopener noreferrer"
                className="px-4 py-1.5 border border-slate-200 text-slate-600 text-xs font-black rounded-full hover:border-slate-900 transition-all uppercase tracking-widest shrink-0">
                Download
              </a>
              <a href={getOpenUrl(viewing.fileUrl)} target="_blank" rel="noopener noreferrer"
                className="px-4 py-1.5 bg-red-700 text-white text-xs font-black rounded-full hover:bg-red-800 transition-all uppercase tracking-widest shrink-0">
                Open
              </a>
              <button onClick={() => setViewing(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-red-500 hover:text-red-600 transition-all shrink-0">
                ✕
              </button>
            </div>
            <iframe
              src={getEmbedUrl(viewing.fileUrl)}
              className="flex-1 w-full"
              style={{ minHeight: '60vh', border: 'none' }}
              title={viewing.title}
              allow="autoplay"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
