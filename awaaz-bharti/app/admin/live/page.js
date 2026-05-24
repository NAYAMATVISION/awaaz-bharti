"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const API = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const authH = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });
const jsonH = () => ({ 'Content-Type': 'application/json', ...authH() });

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  live: 'bg-red-100 text-red-700 border border-red-200',
  closed: 'bg-slate-100 text-slate-500 border border-slate-200',
  rejected: 'bg-rose-100 text-rose-700 border border-rose-200',
};

export default function AdminLiveStoriesPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
    else if (user) fetchStories();
  }, [user, loading]);

  const fetchStories = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API()}/api/live-stories/all`, { headers: authH() });
      const data = await res.json();
      if (data.success) setStories(data.data);
    } finally {
      setFetching(false);
    }
  };

  const setStatus = async (id, status) => {
    await fetch(`${API()}/api/live-stories/admin/${id}`, {
      method: 'PUT',
      headers: jsonH(),
      body: JSON.stringify({ status }),
    });
    fetchStories();
  };

  const deleteStory = async (id) => {
    if (!confirm('Permanently delete this story and all its entries?')) return;
    await fetch(`${API()}/api/live-stories/admin/${id}`, { method: 'DELETE', headers: authH() });
    fetchStories();
  };

  const filtered = stories.filter(s => filter === 'all' ? true : s.status === filter);

  if (loading || (user && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-red-700 rounded-full animate-spin mb-4" />
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
              <h1 className="text-4xl font-black text-gray-900">Live Story Approvals</h1>
              <p className="text-slate-500 font-medium">Review and approve employee-submitted live stories.</p>
            </div>
            <button onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:border-slate-900 hover:text-slate-900 transition-all uppercase text-xs tracking-widest">
              Back to Dashboard
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {['pending', 'live', 'closed', 'rejected', 'all'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${filter === f ? 'bg-red-700 text-white border-red-700' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-900'}`}>
                {f} {f !== 'all' && `(${stories.filter(s => s.status === f).length})`}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            {fetching ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                No {filter === 'all' ? '' : filter} stories.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Story</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">By</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Status</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Updates</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((story) => (
                      <tr key={story._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="font-bold text-gray-900">{story.title}</div>
                          {story.description && (
                            <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{story.description}</div>
                          )}
                          <div className="text-[10px] text-slate-400 mt-1">
                            {new Date(story.createdAt).toLocaleString('en-IN')}
                          </div>
                          {story.slug && (story.status === 'live' || story.status === 'closed') && (
                            <a href={`/live/${story.slug}`} target="_blank" rel="noreferrer"
                              className="text-[10px] text-blue-500 hover:underline mt-0.5 block">
                              /live/{story.slug} →
                            </a>
                          )}
                        </td>
                        <td className="py-4 px-2 text-sm text-slate-600 font-bold">
                          {story.createdBy?.name || '—'}
                        </td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${STATUS_STYLES[story.status]}`}>
                            {story.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-sm font-bold text-slate-600">
                          {story.entryCount ?? 0}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex flex-col gap-1.5 items-end">
                            {story.status === 'pending' && (
                              <div className="flex gap-2">
                                <button onClick={() => setStatus(story._id, 'live')}
                                  className="text-[10px] font-black text-white bg-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-all uppercase tracking-widest">
                                  Approve
                                </button>
                                <button onClick={() => setStatus(story._id, 'rejected')}
                                  className="text-[10px] font-black text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition-all uppercase tracking-widest">
                                  Reject
                                </button>
                              </div>
                            )}
                            {story.status === 'rejected' && (
                              <button onClick={() => setStatus(story._id, 'live')}
                                className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 transition-all uppercase tracking-widest">
                                Approve
                              </button>
                            )}
                            {(story.status === 'live' || story.status === 'closed') && (
                              <button onClick={() => setStatus(story._id, story.status === 'live' ? 'closed' : 'live')}
                                className="text-[10px] font-black text-slate-400 hover:text-slate-700 transition-all uppercase tracking-widest">
                                {story.status === 'live' ? 'Close' : 'Reopen'}
                              </button>
                            )}
                            <button onClick={() => deleteStory(story._id)}
                              className="text-[10px] font-black text-red-400 hover:text-red-700 transition-all uppercase tracking-widest">
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
