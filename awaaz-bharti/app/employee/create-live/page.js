"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { getImageUrl } from '../../../lib/utils';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('../../components/RichTextEditor'), { ssr: false });

export default function CreateLiveNewsPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: '',
  });
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'employee' && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const uploadImage = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    setUploading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadFormData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      return data.image;
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setFormData(prev => ({ ...prev, coverImage: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setMessage({ text: 'Title and content are required.', type: 'error' });
      return;
    }
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${apiUrl}/api/live`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: 'Live update submitted! Pending admin approval.', type: 'success' });
        setFormData({ title: '', excerpt: '', content: '', coverImage: '', author: '' });
      } else {
        setMessage({ text: data.message || 'Failed to submit.', type: 'error' });
      }
    } catch {
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
      <main className="flex-1 max-w-[900px] w-full mx-auto px-5 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-blue-600">📡</span> Broadcast Live Update
            </h1>
            <p className="text-slate-500">Post instant live news updates. Pending admin approval.</p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl mb-6 font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Headline / Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors font-bold text-gray-900 text-lg"
                placeholder="e.g., Breaking: Parliament Session Adjourned"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Excerpt / Summary</label>
              <textarea
                rows="2"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Short summary shown on homepage and listing pages..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Author Name</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Reporter / Correspondent name"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {uploading && <p className="text-[10px] text-blue-700 font-bold mt-1 animate-pulse uppercase tracking-widest">Uploading...</p>}
                {formData.coverImage && (
                  <div className="mt-3 relative w-full h-36 rounded-xl overflow-hidden border border-slate-100">
                    <Image src={getImageUrl(formData.coverImage)} alt="Cover preview" fill style={{ objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Update Content *</label>
              <RichTextEditor
                value={formData.content}
                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                placeholder="Write the full live update details..."
                onImageUpload={uploadImage}
              />
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
                disabled={isSubmitting || uploading}
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
