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

export default function CreateArticlePage() {
  const { user, loading } = useAuthContext();
  const [formData, setFormData] = useState({
    title: '',
    subheading: '',
    category: 'politics',
    image: '',
    content: ''
  });
  const [uploading, setUploading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'employee' && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const uploadImage = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    setUploading(true);
    setError('');
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
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setFormData(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.subheading || !formData.content || !formData.image || !formData.category) {
      setError('All fields are required');
      return;
    }
    if (formData.title.length < 5) { setError('Title must be at least 5 characters'); return; }

    setSubmitLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit article');
      alert('Article submitted for review');
      router.push('/employee/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading || (user && user.role !== 'employee' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-red-700 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold">Loading Editor...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[900px] w-full mx-auto px-4 py-6 sm:py-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-xl border border-slate-100">
          <div className="mb-6 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Create New Article</h1>
            <p className="text-slate-500 mt-2">Submit your story for editorial review.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 border border-red-100 text-sm font-bold">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Article Title</label>
              <input
                type="text"
                placeholder="Enter a compelling title"
                className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 font-bold text-gray-900 text-lg"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Subheading / Summary</label>
              <input
                type="text"
                placeholder="Brief summary of the article"
                className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
                value={formData.subheading}
                onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Category</label>
                <select
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white font-bold"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="politics">Politics</option>
                  <option value="business">Business</option>
                  <option value="technology">Technology</option>
                  <option value="sports">Sports</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="health">Health</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                  onChange={uploadFileHandler}
                />
                {uploading && <p className="text-[10px] text-red-700 font-bold mt-2 animate-pulse uppercase tracking-widest">Uploading...</p>}
                {formData.image && (
                  <div className="mt-4 relative w-full h-48 rounded-2xl overflow-hidden border border-slate-100">
                    <Image src={getImageUrl(formData.image)} alt="Preview" fill style={{ objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Article Content</label>
              <RichTextEditor
                value={formData.content}
                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                placeholder="Start writing your story..."
                onImageUpload={uploadImage}
              />
            </div>

            <div className="pt-4 sm:pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-8 py-3 sm:py-4 rounded-xl border-2 border-slate-100 font-black uppercase text-xs tracking-widest text-slate-500 hover:border-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading || uploading}
                className="flex-1 bg-red-700 text-white font-black py-3 sm:py-4 rounded-xl hover:bg-red-800 transition-all shadow-xl shadow-red-700/20 uppercase text-xs tracking-widest disabled:opacity-50"
              >
                {submitLoading ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
