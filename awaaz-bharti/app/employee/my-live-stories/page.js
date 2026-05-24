"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const API = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  live: 'bg-red-100 text-red-700 border border-red-200',
  closed: 'bg-slate-100 text-slate-500 border border-slate-200',
  rejected: 'bg-rose-100 text-rose-700 border border-rose-200',
};

export default function MyLiveStoriesPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'employee' && user.role !== 'admin'))) {
      router.push('/login');
    } else if (user) {
      fetchStories();
    }
  }, [user, loading]);

  const fetchStories = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API()}/api/live-stories/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (data.success) setStories(data.data);
    } finally {
      setFetching(false);
    }
  };

  const deleteStory = async (id) => {
    if (!confirm('Delete this story and all its updates?')) return;
    await fetch(`${API()}/api/live-stories/me/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    fetchStories();
  };

  if (loading || !user) return null;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-5 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button onClick={() => router.push('/employee/dashboard')} className="text-xs font-black text-slate-400 hover:text-slate-700 uppercase tracking-widest mb-2 block">
              ← Dashboard
            </button>
            <h1 className="text-4xl font-black text-gray-900">My Live Stories</h1>
            <p className="text-slate-500 mt-1">Manage your live coverage events.</p>
          </div>
          <button
            onClick={() => router.push('/employee/create-live')}
            className="bg-red-700 text-white font-black px-6 py-3 rounded-xl hover:bg-red-800 transition-all uppercase text-xs tracking-widest shadow-lg shadow-red-700/20"
          >
            + Create Story
          </button>
        </div>

        {fetching ? (
          <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading...</div>
        ) : stories.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
            <div className="text-5xl mb-4">📡</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No live stories yet</h2>
            <p className="text-gray-500 mb-6">Create your first live coverage story.</p>
            <button onClick={() => router.push('/employee/create-live')}
              className="bg-red-700 text-white font-black px-8 py-3 rounded-xl hover:bg-red-800 transition-all uppercase text-xs tracking-widest">
              Create Live Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stories.map((story) => (
              <div key={story._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-gray-900 leading-snug line-clamp-2 flex-1">{story.title}</h3>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${STATUS_STYLES[story.status] || STATUS_STYLES.pending}`}>
                    {story.status}
                  </span>
                </div>

                {story.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">{story.description}</p>
                )}

                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold">
                  <span>{story.entryCount || 0} updates</span>
                  <span>·</span>
                  <span>{new Date(story.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                {story.status === 'pending' && (
                  <p className="text-[11px] text-amber-600 font-bold bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    ⏳ Awaiting admin approval
                  </p>
                )}
                {story.status === 'rejected' && (
                  <p className="text-[11px] text-rose-600 font-bold bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                    ✗ Rejected by admin
                  </p>
                )}

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50 mt-auto">
                  {story.status === 'live' && (
                    <>
                      <button
                        onClick={() => router.push(`/employee/live-story/${story._id}`)}
                        className="text-[11px] font-black bg-red-700 text-white px-3 py-1.5 rounded-lg hover:bg-red-800 transition-all uppercase tracking-widest"
                      >
                        + Add Update
                      </button>
                      <button
                        onClick={() => router.push(`/employee/live-story/${story._id}`)}
                        className="text-[11px] font-black border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:border-slate-900 transition-all uppercase tracking-widest"
                      >
                        Manage
                      </button>
                    </>
                  )}
                  {(story.status === 'live' || story.status === 'closed') && (
                    <a
                      href={`/live/${story.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-black border border-slate-200 text-blue-600 px-3 py-1.5 rounded-lg hover:border-blue-300 transition-all uppercase tracking-widest"
                    >
                      View →
                    </a>
                  )}
                  {(story.status === 'pending' || story.status === 'rejected') && (
                    <button
                      onClick={() => deleteStory(story._id)}
                      className="text-[11px] font-black text-red-400 hover:text-red-700 transition-all uppercase tracking-widest"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
