"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AdminDashboard() {
  const { user, loading, logout } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [epaperUrl, setEpaperUrl] = useState('');
  const [epaperTitle, setEpaperTitle] = useState('');
  const [epaperUploading, setEpaperUploading] = useState(false);
  const [epaperMsg, setEpaperMsg] = useState('');
  // Modal state
  const [modal, setModal] = useState(null); // { userId }
  const [designation, setDesignation] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    } else if (user) {
      fetchUsers();
    }
  }, [user, loading, router]);

  const fetchUsers = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) setUsers(data.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateUser = async (userId, updateData) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updateData)
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user and all their content? This cannot be undone.')) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) fetchUsers();
      else alert(data.message);
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const togglePermission = (targetUser, perm) => {
    const current = targetUser.permissions || [];
    const next = current.includes(perm) ? current.filter(p => p !== perm) : [...current, perm];
    updateUser(targetUser._id, { permissions: next });
  };

  const confirmMakeEmployee = () => {
    if (!designation.trim()) return;
    updateUser(modal.userId, { role: 'employee', employeeType: designation.trim() });
    setModal(null);
    setDesignation('');
  };

  const removeEmployee = (userId) => {
    updateUser(userId, { role: 'user', permissions: [], employeeType: '' });
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

      {/* Designation Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-sm mx-4 border border-slate-100">
            <h3 className="text-lg font-black text-gray-900 mb-1">Assign Designation</h3>
            <p className="text-xs text-slate-400 mb-5">Enter the employee&apos;s position or title</p>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Political Reporter, Senior Editor..."
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmMakeEmployee()}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700 transition-all mb-5"
            />
            <div className="flex gap-3">
              <button
                onClick={confirmMakeEmployee}
                disabled={!designation.trim()}
                className="flex-1 px-4 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-red-700 transition-all uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
              <button
                onClick={() => { setModal(null); setDesignation(''); }}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-xs font-black rounded-xl hover:border-slate-900 transition-all uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 py-6 sm:py-10">
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-gray-900">Hi, {user?.name || 'Admin'}</h1>
              <p className="text-slate-500 font-medium text-sm">System Management Portal</p>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              <button onClick={() => router.push('/admin/articles')} className="px-3 sm:px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all uppercase text-[10px] sm:text-xs tracking-widest shadow-lg shadow-black/10">
                Articles
              </button>
              <button onClick={() => router.push('/admin/live')} className="px-3 sm:px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all uppercase text-[10px] sm:text-xs tracking-widest shadow-lg shadow-blue-600/10">
                Live
              </button>
              <button onClick={() => router.push('/admin/videos')} className="px-3 sm:px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all uppercase text-[10px] sm:text-xs tracking-widest shadow-lg shadow-emerald-600/10">
                Videos
              </button>
              <button onClick={() => router.push('/admin/advertisements')} className="px-3 sm:px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all uppercase text-[10px] sm:text-xs tracking-widest shadow-lg shadow-amber-500/20">
                Ads
              </button>
              <button onClick={logout} className="col-span-2 sm:col-span-1 px-3 sm:px-6 py-2 border-2 border-red-100 text-red-700 font-bold rounded-xl hover:border-red-700 transition-all uppercase text-[10px] sm:text-xs tracking-widest">
                Sign Out
              </button>
            </div>
          </div>

          {/* E-Paper Upload */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-100">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-red-700 rounded-full"></span>
              Upload E-Paper
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!epaperUrl.trim()) return;
                setEpaperUploading(true);
                setEpaperMsg('');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const token = localStorage.getItem('token');
                // Convert Google Drive share URL to embed URL
                const fileId = epaperUrl.match(/[-\w]{25,}/)?.[0];
                const embedUrl = fileId
                  ? `https://drive.google.com/file/d/${fileId}/preview`
                  : epaperUrl;
                try {
                  const res = await fetch(`${apiUrl}/api/epaper`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                      title: epaperTitle || `E-Paper ${new Date().toLocaleDateString('en-IN')}`,
                      fileUrl: embedUrl,
                    }),
                  });
                  const data = await res.json();
                  setEpaperMsg(data.success ? 'E-paper updated successfully' : (data.message || 'Failed'));
                  if (data.success) { setEpaperUrl(''); setEpaperTitle(''); }
                } catch {
                  setEpaperMsg('Failed. Please try again.');
                } finally {
                  setEpaperUploading(false);
                }
              }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Title (optional)</label>
                <input
                  type="text"
                  placeholder={`E-Paper ${new Date().toLocaleDateString('en-IN')}`}
                  value={epaperTitle}
                  onChange={e => setEpaperTitle(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Google Drive PDF Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/FILE_ID/view"
                  value={epaperUrl}
                  onChange={e => setEpaperUrl(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700 transition-all"
                />
                <p className="text-[11px] text-slate-400">Upload PDF to Google Drive → Share → Copy link → Paste here</p>
              </div>
              <button
                type="submit"
                disabled={epaperUploading || !epaperUrl.trim()}
                className="px-6 py-2.5 bg-red-700 text-white font-black rounded-xl hover:bg-red-800 transition-all uppercase text-xs tracking-widest shadow-lg shadow-red-700/20 disabled:opacity-50 disabled:cursor-not-allowed w-fit"
              >
                {epaperUploading ? 'Saving...' : 'Update E-Paper'}
              </button>
            </form>
            {epaperMsg && (
              <p className={`mt-4 text-sm font-bold ${epaperMsg.includes('successfully') ? 'text-emerald-600' : 'text-red-600'}`}>
                {epaperMsg}
              </p>
            )}
          </div>

          {/* User Management */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-100">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-red-700 rounded-full"></span>
              Manage Users & Staff
            </h2>

            {loadingUsers ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                Fetching records...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">User Identity</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Role</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Designation</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400">Tool Permissions</th>
                      <th className="py-4 px-2 text-xs font-black uppercase text-slate-400 text-right">Management</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="font-bold text-gray-900">{u.name}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </td>

                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            u.role === 'admin' ? 'bg-red-100 text-red-700 border border-red-200' :
                            u.role === 'employee' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {u.role}
                          </span>
                        </td>

                        <td className="py-4 px-2">
                          {u.role === 'employee' && u.employeeType ? (
                            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                              {u.employeeType}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-300">—</span>
                          )}
                        </td>

                        <td className="py-4 px-2">
                          {u.role !== 'admin' && (
                            <div className="flex flex-wrap gap-4">
                              {[
                                { id: 'create_article', label: 'Articles' },
                                { id: 'add_live', label: 'Live' },
                                { id: 'add_video', label: 'Video' }
                              ].map(perm => (
                                <label key={perm.id} className="flex items-center gap-2 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={u.permissions?.includes(perm.id)}
                                    onChange={() => togglePermission(u, perm.id)}
                                    className="w-4 h-4 accent-red-700 cursor-pointer rounded"
                                    disabled={u.role !== 'employee'}
                                  />
                                  <span className={`text-[11px] font-bold uppercase transition-colors ${
                                    u.permissions?.includes(perm.id) ? 'text-gray-900' : 'text-slate-400 group-hover:text-slate-600'
                                  }`}>
                                    {perm.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-2 text-right">
                          <div className="flex flex-col gap-2 items-end">
                            {u.role === 'user' && (
                              <button
                                onClick={() => setModal({ userId: u._id })}
                                className="text-[10px] font-black text-white bg-slate-900 px-4 py-2 rounded-xl hover:bg-red-700 transition-all uppercase tracking-widest shadow-lg shadow-black/10"
                              >
                                Make Employee
                              </button>
                            )}
                            {u.role === 'employee' && (
                              <button
                                onClick={() => removeEmployee(u._id)}
                                className="text-[10px] font-black text-blue-700 border border-blue-200 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all uppercase tracking-widest"
                              >
                                Remove Employee
                              </button>
                            )}
                            {u.role !== 'admin' && u._id !== user?._id && (
                              <button
                                onClick={() => deleteUser(u._id)}
                                className="text-[10px] font-black text-red-400 hover:text-red-700 transition-all uppercase tracking-widest"
                              >
                                Delete
                              </button>
                            )}
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
