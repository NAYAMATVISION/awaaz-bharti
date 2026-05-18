"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const StatusBadge = ({ status }) => {
  const classes = status === 'approved'
    ? 'bg-emerald-100 text-emerald-700'
    : status === 'rejected'
    ? 'bg-red-100 text-red-700'
    : 'bg-amber-100 text-amber-700';

  return (
    <span className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-wider ${classes}`}>
      {status}
    </span>
  );
};

export default function EmployeeSubmissionsPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'employee' && user.role !== 'admin'))) {
      router.push('/login');
    } else if (user) {
      fetchSubmissions();
    }
  }, [user, loading, router]);

  const fetchSubmissions = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    if (!token) return;
    setError('');
    setLoadingSubmissions(true);
    try {
      const [articleRes, liveRes, videoRes] = await Promise.all([
        fetch(`${apiUrl}/api/articles/me`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/api/live/me`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/api/videos/me`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      const [articleData, liveData, videoData] = await Promise.all([articleRes.json(), liveRes.json(), videoRes.json()]);
      if (articleData.success) setArticles(articleData.data);
      if (liveData.success) setLiveUpdates(liveData.data);
      if (videoData.success) setVideos(videoData.data);
      if (!articleData.success && !liveData.success && !videoData.success) setError('Unable to load submissions.');
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Could not load submissions. Please try again later.');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const endpoints = {
      article: `/api/articles/${id}/me`,
      live: `/api/live/${id}/me`,
      video: `/api/videos/${id}/me`,
    };
    try {
      const res = await fetch(`${apiUrl}${endpoints[type]}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) fetchSubmissions();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  if (loading || (user && user.role !== 'employee' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-red-700 rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-5 py-12">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-black text-gray-900">My Submissions</h1>
              <p className="text-slate-500 mt-2">Track your submitted articles, live updates, and videos in one place.</p>
            </div>
            <button
              onClick={() => router.push('/employee/dashboard')}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:border-slate-900 hover:text-slate-900 transition-all uppercase text-xs tracking-widest"
            >
              Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-bold text-sm mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Articles */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <h2 className="text-lg font-black text-gray-900 mb-4">Articles</h2>
              <div className="space-y-3">
                {loadingSubmissions ? (
                  <div className="text-slate-400 uppercase tracking-widest font-black animate-pulse">Loading...</div>
                ) : articles.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No article submissions yet.</p>
                ) : (
                  articles.map((article) => (
                    <div key={article._id} className="bg-white p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-900 line-clamp-2">{article.title}</p>
                          <p className="text-[11px] text-slate-500 mt-1">{new Date(article.createdAt).toLocaleDateString()}</p>
                        </div>
                        <StatusBadge status={article.status} />
                      </div>
                      {article.status === 'pending' && (
                        <button
                          onClick={() => handleDelete('article', article._id)}
                          className="mt-2 text-[10px] font-black text-red-400 hover:text-red-700 uppercase tracking-widest transition-all"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Live Updates */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <h2 className="text-lg font-black text-gray-900 mb-4">Live Updates</h2>
              <div className="space-y-3">
                {loadingSubmissions ? (
                  <div className="text-slate-400 uppercase tracking-widest font-black animate-pulse">Loading...</div>
                ) : liveUpdates.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No live updates submitted yet.</p>
                ) : (
                  liveUpdates.map((item) => (
                    <div key={item._id} className="bg-white p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-900 line-clamp-2">{item.title}</p>
                          <p className="text-[11px] text-slate-500 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                      {item.status === 'pending' && (
                        <button
                          onClick={() => handleDelete('live', item._id)}
                          className="mt-2 text-[10px] font-black text-red-400 hover:text-red-700 uppercase tracking-widest transition-all"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Videos */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <h2 className="text-lg font-black text-gray-900 mb-4">Videos</h2>
              <div className="space-y-3">
                {loadingSubmissions ? (
                  <div className="text-slate-400 uppercase tracking-widest font-black animate-pulse">Loading...</div>
                ) : videos.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No video submissions yet.</p>
                ) : (
                  videos.map((video) => (
                    <div key={video._id} className="bg-white p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-900 line-clamp-2">{video.title}</p>
                          <p className="text-[11px] text-slate-500 mt-1">{video.category || 'Uncategorized'}</p>
                        </div>
                        <StatusBadge status={video.status} />
                      </div>
                      {video.status === 'pending' && (
                        <button
                          onClick={() => handleDelete('video', video._id)}
                          className="mt-2 text-[10px] font-black text-red-400 hover:text-red-700 uppercase tracking-widest transition-all"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
