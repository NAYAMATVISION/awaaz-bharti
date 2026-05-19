"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getImageUrl } from '../../../lib/utils';
import Image from 'next/image';

export default function AdminArticlesPage() {
  const { user, loading } = useAuthContext();
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    } else if (user) {
      fetchArticles();
    }
  }, [user, loading, router]);

  const fetchArticles = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/articles/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setArticles(data.data);
      } else {
        setError(data.message || 'Failed to fetch articles');
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Connection error. Please check your backend.');
    } finally {
      setLoadingArticles(false);
    }
  };

  const updateArticle = async (articleId, updateData) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updateData)
      });
      if (res.ok) fetchArticles();
    } catch (err) {
      console.error('Error updating article:', err);
    }
  };

  const deleteArticle = async (articleId) => {
    if (!confirm('Permanently delete this article?')) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) fetchArticles();
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  const toggleTrending = async (articleId) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/articles/${articleId}/toggle-trending`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) fetchArticles();
      else alert(data.message);
    } catch (err) {
      console.error('Error toggling trending:', err);
    }
  };

  const setTrendingOrder = async (articleId, order) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/api/articles/${articleId}/set-trending-order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ order: Number(order) }),
      });
      fetchArticles();
    } catch (err) {
      console.error('Error setting trending order:', err);
    }
  };

  if (loading || (user && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-red-700 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse text-lg uppercase tracking-widest">Verifying Admin Access...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 py-6 sm:py-12">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-gray-900">Article Management</h1>
              <p className="text-slate-500 font-medium text-sm">Review, approve, and control content visibility.</p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="w-full sm:w-auto px-6 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:border-slate-900 hover:text-slate-900 transition-all uppercase text-xs tracking-widest"
            >
              Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-bold text-sm">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-slate-100">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-red-700 rounded-full"></span>
              Content Queue
            </h2>

            {loadingArticles ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                Loading articles...
              </div>
            ) : articles.length === 0 ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                No articles found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Article Detail</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Status</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Controls</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Trending</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((art) => (
                      <tr key={art._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="flex gap-4 items-center">
                            <div className="w-16 h-12 relative rounded-lg overflow-hidden shrink-0 border border-slate-100">
                              <Image
                                src={getImageUrl(art.image)}
                                alt={art.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 line-clamp-1">{art.title}</div>
                              <div className="text-[10px] flex items-center gap-2 mt-1">
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-black uppercase">{art.category}</span>
                                <span className="text-slate-400">By {art.author?.name || 'Unknown'}</span>
                                <span className="text-slate-400">·</span>
                                <span className="text-slate-400">{new Date(art.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            art.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            art.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                            'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}>
                            {art.status}
                          </span>
                        </td>

                        <td className="py-4 px-2">
                          {art.status === 'approved' && (
                            <div className="flex gap-4">
                              {[
                                { id: 'isBreaking', label: 'Breaking', color: 'text-red-600' },
                                { id: 'isFeatured', label: 'Featured', color: 'text-blue-600' },
                                { id: 'isActive', label: 'Active', color: 'text-emerald-600' },
                              ].map(toggle => (
                                <label key={toggle.id} className="flex items-center gap-1.5 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={art[toggle.id]}
                                    onChange={(e) => updateArticle(art._id, { [toggle.id]: e.target.checked })}
                                    className="w-3.5 h-3.5 accent-slate-900 cursor-pointer rounded"
                                  />
                                  <span className={`text-[10px] font-black uppercase transition-colors ${
                                    art[toggle.id] ? toggle.color : 'text-slate-300 group-hover:text-slate-400'
                                  }`}>
                                    {toggle.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-2">
                          {art.status === 'approved' && (
                            <div className="flex flex-col gap-1.5">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={art.isTrending || false}
                                  onChange={() => toggleTrending(art._id)}
                                  className="w-3.5 h-3.5 accent-red-700 cursor-pointer"
                                />
                                <span className={`text-[10px] font-black uppercase ${
                                  art.isTrending ? 'text-red-700' : 'text-slate-300'
                                }`}>
                                  Trending
                                </span>
                              </label>
                              {art.isTrending && (
                                <input
                                  type="number"
                                  min="1"
                                  max="8"
                                  defaultValue={art.trendingOrder || 1}
                                  onBlur={(e) => setTrendingOrder(art._id, e.target.value)}
                                  className="w-14 border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-bold text-center focus:outline-none focus:border-red-700"
                                  placeholder="Order"
                                />
                              )}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-2 text-right">
                          <div className="flex flex-col gap-1.5 items-end">
                            {art.status === 'pending' ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateArticle(art._id, { status: 'approved' })}
                                  className="text-[10px] font-black text-white bg-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-all uppercase tracking-widest"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateArticle(art._id, { status: 'rejected' })}
                                  className="text-[10px] font-black text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition-all uppercase tracking-widest"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => updateArticle(art._id, { status: 'pending' })}
                                className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest"
                              >
                                Reset
                              </button>
                            )}
                            <button
                              onClick={() => deleteArticle(art._id)}
                              className="text-[10px] font-black text-red-400 hover:text-red-700 transition-all uppercase tracking-widest"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
