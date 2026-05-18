"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Image from 'next/image';

const PLACEMENT_LABELS = {
  'homepage-sidebar': 'Homepage Sidebar',
};

export default function AdminAdvertisementsPage() {
  const { user, loading } = useAuthContext();
  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    } else if (user) {
      fetchAds();
    }
  }, [user, loading, router]);

  const fetchAds = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/ads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAds(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAds(false);
    }
  };

  const toggleStatus = async (id) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const res = await fetch(`${apiUrl}/api/ads/${id}/toggle`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchAds();
  };

  const deleteAd = async (id) => {
    if (!confirm('Delete this advertisement?')) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const res = await fetch(`${apiUrl}/api/ads/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchAds();
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
              <h1 className="text-4xl font-black text-gray-900">Advertisements</h1>
              <p className="text-slate-500 font-medium">Manage all ad placements across the website.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/admin/advertisements/create')}
                className="px-6 py-2 bg-red-700 text-white font-bold rounded-xl hover:bg-red-800 transition-all uppercase text-xs tracking-widest shadow-lg shadow-red-700/20"
              >
                + Create Ad
              </button>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-6 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:border-slate-900 hover:text-slate-900 transition-all uppercase text-xs tracking-widest"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-red-700 rounded-full"></span>
              All Advertisements
            </h2>

            {loadingAds ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading ads...</div>
            ) : ads.length === 0 ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No advertisements yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Ad</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Placement</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Redirect URL</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Status</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((ad) => (
                      <tr key={ad._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-14 relative rounded-lg overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                              <Image src={ad.image} alt={ad.title} fill className="object-cover" />
                            </div>
                            <span className="font-bold text-gray-900 text-sm line-clamp-2">{ad.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                            {PLACEMENT_LABELS[ad.placement] || ad.placement}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <a
                            href={ad.redirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12px] text-blue-500 hover:underline truncate max-w-[180px] block"
                          >
                            {ad.redirectUrl}
                          </a>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            ad.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {ad.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex flex-col gap-1.5 items-end">
                            <button
                              onClick={() => router.push(`/admin/advertisements/edit/${ad._id}`)}
                              className="text-[10px] font-black text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all uppercase tracking-widest"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => toggleStatus(ad._id)}
                              className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all uppercase tracking-widest ${
                                ad.status === 'active'
                                  ? 'text-slate-600 border border-slate-200 hover:border-slate-900'
                                  : 'text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                              }`}
                            >
                              {ad.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => deleteAd(ad._id)}
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
