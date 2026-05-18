"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AdminVideosPage() {
  const { user, loading } = useAuthContext();
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    } else if (user) {
      fetchVideos();
    }
  }, [user, loading, router]);

  const fetchVideos = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/videos/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVideos(data.data);
      } else {
        setError(data.message || 'Failed to fetch videos');
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Connection error. Please check your backend.');
    } finally {
      setLoadingVideos(false);
    }
  };

  const updateStatus = async (id, action) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/videos/${id}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchVideos();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Permanently delete this video?')) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchVideos();
    } catch (err) {
      console.error('Error deleting video:', err);
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

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-5 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black text-gray-900">Video Management</h1>
              <p className="text-slate-500 font-medium">Review, approve, and control video submissions.</p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:border-slate-900 hover:text-slate-900 transition-all uppercase text-xs tracking-widest"
            >
              Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-bold text-sm">
              {error}
            </div>
          )}

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-red-700 rounded-full"></span>
              Video Queue
            </h2>

            {loadingVideos ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                Loading videos...
              </div>
            ) : videos.length === 0 ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                No videos found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Video Detail</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Status</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video) => (
                      <tr key={video._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="font-bold text-gray-900">{video.title}</div>
                          <a
                            href={video.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline mt-1 block truncate max-w-md"
                          >
                            {video.youtubeUrl}
                          </a>
                          <div className="text-[10px] flex items-center gap-2 mt-2">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-black uppercase">{video.category}</span>
                            <span className="text-slate-400">By {video.createdBy?.name || 'Unknown'}</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-400">{new Date(video.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>

                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            video.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            video.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                            'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}>
                            {video.status}
                          </span>
                        </td>

                        <td className="py-4 px-2 text-right">
                          <div className="flex flex-col gap-1.5 items-end">
                            {video.status === 'pending' ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateStatus(video._id, 'approve')}
                                  className="text-[10px] font-black text-white bg-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-all uppercase tracking-widest"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateStatus(video._id, 'reject')}
                                  className="text-[10px] font-black text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition-all uppercase tracking-widest"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => updateStatus(video._id, 'reset')}
                                className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest"
                              >
                                Reset
                              </button>
                            )}
                            <button
                              onClick={() => deleteItem(video._id)}
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
