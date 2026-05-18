"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../../context/AuthContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const PLACEMENTS = [
  { value: 'homepage-sidebar', label: 'Homepage Sidebar' },
];

export default function CreateAdvertisementPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [form, setForm] = useState({ title: '', redirectUrl: '', placement: 'homepage-sidebar' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return setError('Please upload an image.');
    setError('');
    setUploading(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    try {
      // Upload image first
      const imgData = new FormData();
      imgData.append('image', imageFile);
      const imgRes = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: imgData,
      });
      const imgJson = await imgRes.json();
      if (!imgRes.ok) throw new Error(imgJson.message || 'Image upload failed');

      const imageUrl = imgJson.image;

      // Create ad
      const adRes = await fetch(`${apiUrl}/api/ads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form, image: imageUrl }),
      });
      const adJson = await adRes.json();
      if (!adRes.ok) throw new Error(adJson.message || 'Failed to create ad');

      router.push('/admin/advertisements');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading || (user && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-red-700 rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl w-full mx-auto px-5 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Create Advertisement</h1>
            <p className="text-slate-500 font-medium">Add a new ad placement to the website.</p>
          </div>
          <button
            onClick={() => router.push('/admin/advertisements')}
            className="px-6 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:border-slate-900 hover:text-slate-900 transition-all uppercase text-xs tracking-widest"
          >
            Back
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-bold text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Ad Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Summer Sale Banner"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Redirect URL</label>
              <input
                type="url"
                required
                placeholder="https://example.com"
                value={form.redirectUrl}
                onChange={e => setForm({ ...form, redirectUrl: e.target.value })}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Placement</label>
              <div className="border border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-semibold">
                Homepage Sidebar
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Ad Image</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleImageChange}
                className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-700 transition-all file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
              {imagePreview && (
                <div className="mt-2 relative w-full h-[160px] rounded-xl overflow-hidden border border-slate-100">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="mt-2 px-6 py-3 bg-red-700 text-white font-black rounded-xl hover:bg-red-800 transition-all uppercase text-xs tracking-widest shadow-lg shadow-red-700/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Creating...' : 'Create Advertisement'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
