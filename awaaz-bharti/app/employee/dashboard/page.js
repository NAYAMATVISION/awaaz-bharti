"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function EmployeeDashboard() {
  const { user, loading, logout } = useAuthContext();
  const router = useRouter();
  const [liveNews, setLiveNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'employee' && user.role !== 'admin'))) {
      router.push('/login');
    } else if (user) {
      fetchMySubmissions();
    }
  }, [user, loading, router]);

  const fetchMySubmissions = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    
    if (!token) return;

    try {
      const [liveRes, videoRes, articleRes] = await Promise.all([
        fetch(`${apiUrl}/api/live/me`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/api/videos/me`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/api/articles/me`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      const [liveData, videoData, articleData] = await Promise.all([liveRes.json(), videoRes.json(), articleRes.json()]);

      if (liveData.success) setLiveNews(liveData.data.slice(0, 5));
      if (videoData.success) setVideos(videoData.data.slice(0, 5));
      if (articleData.success) setArticles(articleData.data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  if (loading || (user && user.role !== 'employee' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-red-700 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse text-lg uppercase tracking-widest">Loading Tools...</p>
      </div>
    );
  }

  const permissions = user?.permissions || [];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-5 py-12">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-black text-gray-900">Correspondent Hub</h1>
              <p className="text-slate-500 mt-1">Logged in as: <span className="font-bold text-gray-900">{user?.name}</span></p>
            </div>
            <button onClick={logout} className="text-red-700 font-bold hover:underline uppercase text-xs tracking-widest font-black">Sign Out</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Create Article Tool */}
            <div className={`p-8 rounded-3xl border-2 transition-all ${
              permissions.includes('create_article') || user?.role === 'admin'
              ? 'border-red-100 bg-white hover:border-red-700 shadow-lg'
              : 'border-slate-100 bg-slate-50 opacity-60 grayscale'
            }`}>
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Create Article</h3>
              <p className="text-sm text-slate-500 mb-6">Write and submit new news stories for review.</p>
              {permissions.includes('create_article') || user?.role === 'admin' ? (
                <button 
                  onClick={() => router.push('/employee/create-article')}
                  className="bg-red-700 text-white font-black px-6 py-2.5 rounded-xl hover:bg-red-800 transition-all w-full uppercase text-xs tracking-widest shadow-md shadow-red-700/10"
                >
                  Launch Editor
                </button>
              ) : (
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest text-center py-2.5 border border-dashed border-slate-200 rounded-xl">
                  Locked
                </div>
              )}
            </div>

            {/* Add Live News Tool */}
            <div className={`p-8 rounded-3xl border-2 transition-all ${
              permissions.includes('add_live') || user?.role === 'admin'
              ? 'border-blue-100 bg-white hover:border-blue-700 shadow-lg'
              : 'border-slate-100 bg-slate-50 opacity-60 grayscale'
            }`}>
              <div className="text-4xl mb-4">📡</div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Live Updates</h3>
              <p className="text-sm text-slate-500 mb-6">Post instant live news updates and alerts.</p>
              {permissions.includes('add_live') || user?.role === 'admin' ? (
                <button 
                  onClick={() => router.push('/employee/create-live')}
                  className="bg-blue-600 text-white font-black px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all w-full uppercase text-xs tracking-widest shadow-md shadow-blue-600/10"
                >
                  Broadcast Live
                </button>
              ) : (
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest text-center py-2.5 border border-dashed border-slate-200 rounded-xl">
                  Locked
                </div>
              )}
            </div>

            {/* Add Video Tool */}
            <div className={`p-8 rounded-3xl border-2 transition-all ${
              permissions.includes('add_video') || user?.role === 'admin'
              ? 'border-emerald-100 bg-white hover:border-emerald-700 shadow-lg'
              : 'border-slate-100 bg-slate-50 opacity-60 grayscale'
            }`}>
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Upload Video</h3>
              <p className="text-sm text-slate-500 mb-6">Add new video reports and coverage.</p>
              {permissions.includes('add_video') || user?.role === 'admin' ? (
                <button 
                  onClick={() => router.push('/employee/create-video')}
                  className="bg-emerald-600 text-white font-black px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-all w-full uppercase text-xs tracking-widest shadow-md shadow-emerald-600/10"
                >
                  Studio Portal
                </button>
              ) : (
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest text-center py-2.5 border border-dashed border-slate-200 rounded-xl">
                  Locked
                </div>
              )}
            </div>
          </div>

          {(permissions.length === 0 && user?.role !== 'admin') && (
            <div className="mt-12 p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-bold text-amber-900">Restricted Profile</h4>
                <p className="text-sm text-amber-700 mt-1">Your account is active but has no assigned permissions. Please contact your administrator to enable specific news tools.</p>
              </div>
            </div>
          )}

          {/* My Submissions Section */}
          <div className="mt-12 pt-12 border-t border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">My Submissions</h2>
              <button 
                onClick={() => router.push('/employee/my-submissions')}
                className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Recent Articles
                </h3>
                <div className="space-y-3">
                  {articles.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No article submissions yet.</p>
                  ) : (
                    articles.map(article => (
                      <div key={article._id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                        <span className="font-bold text-sm text-gray-900 truncate pr-4">{article.title}</span>
                        <span className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-wider ${
                          article.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          article.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {article.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Recent Live Updates
                </h3>
                <div className="space-y-3">
                  {liveNews.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No live updates submitted yet.</p>
                  ) : (
                    liveNews.map(news => (
                      <div key={news._id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                        <span className="font-bold text-sm text-gray-900 truncate pr-4">{news.title}</span>
                        <span className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-wider ${
                          news.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          news.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {news.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Recent Videos
                </h3>
                <div className="space-y-3">
                  {videos.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No videos submitted yet.</p>
                  ) : (
                    videos.map(video => (
                      <div key={video._id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                        <span className="font-bold text-sm text-gray-900 truncate pr-4">{video.title}</span>
                        <span className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-wider ${
                          video.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          video.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {video.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
