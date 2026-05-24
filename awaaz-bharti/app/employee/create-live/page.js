"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { getImageUrl } from '../../../lib/utils';

const API = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CreateLiveStoryPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [form, setForm] = useState({ title: '', description: '', coverImage: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'employee' && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [user, loading]);

  const uploadImage = async (file) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${API()}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: fd,
      });
      const data = await res.json();
      return data.image || null;
    } catch {
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setMsg({ text: 'Title is required.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API()}/api/live-stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: 'Live story submitted for admin approval!', type: 'success' });
        setTimeout(() => router.push('/employee/my-live-stories'), 1500);
      } else {
        setMsg({ text: data.message || 'Failed to submit.', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Network error.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-5 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <div className="mb-8">
            <button onClick={() => router.push('/employee/my-live-stories')} className="text-xs font-black text-slate-400 hover:text-slate-700 uppercase tracking-widest mb-4 block">
              ← My Live Stories
            </button>
            <h1 className="text-3xl font-black text-gray-900 mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-700 rounded-full animate-pulse" /> Create Live Story
            </h1>
            <p className="text-slate-500 text-sm">Submit for admin approval. Once approved, you can add live updates freely.</p>
          </div>

          {msg.text && (
            <div className={`p-4 rounded-xl mb-6 font-bold text-sm ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Story Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-gray-900 text-lg focus:outline-none focus:border-red-500 transition-colors"
                placeholder="e.g., Parliament Session Live"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-red-500 transition-colors"
                placeholder="Brief description of what this live story covers..."
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const url = await uploadImage(e.target.files[0]);
                  if (url) setForm(p => ({ ...p, coverImage: url }));
                }}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
              />
              {uploading && <p className="text-[10px] text-red-700 font-bold mt-1 animate-pulse uppercase tracking-widest">Uploading...</p>}
              {form.coverImage && (
                <div className="mt-3 relative w-full h-40 rounded-xl overflow-hidden border border-slate-100">
                  <Image src={getImageUrl(form.coverImage)} alt="Cover preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => router.push('/employee/my-live-stories')}
                className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={saving || uploading}
                className="bg-red-700 text-white font-black px-8 py-3 rounded-xl hover:bg-red-800 transition-all uppercase tracking-widest shadow-lg shadow-red-700/20 disabled:opacity-50">
                {saving ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
