"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CreateLiveNewsPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'employee' && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${apiUrl}/api/live`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ text: 'Live update submitted successfully! Pending admin approval.', type: 'success' });
        setTitle('');
        setContent('');
      } else {
        setMessage({ text: data.message || 'Failed to submit live update.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'A network error occurred.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-[800px] w-full mx-auto px-5 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-blue-600">📡</span> Broadcast Live Update
            </h1>
            <p className="text-slate-500">Post instant live news updates and alerts. Your submission will be reviewed by an admin.</p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl mb-6 font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Update Title / Headline</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., Breaking: Parliament Session Adjourned"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Update Content</label>
              <textarea
                required
                rows="4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Details of the live update..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => router.push('/employee/dashboard')}
                className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white font-black px-8 py-3 rounded-xl hover:bg-blue-700 transition-all uppercase tracking-widest shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Update'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
