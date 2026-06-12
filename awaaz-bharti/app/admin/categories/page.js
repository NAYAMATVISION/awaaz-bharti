"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const API = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const jsonH = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export default function AdminCategoriesPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({ name: '', slug: '', displayOrder: '', isActive: true });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
    else if (user) fetchCategories();
  }, [user, loading]);

  const fetchCategories = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API()}/api/categories/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } finally {
      setFetching(false);
    }
  };

  // Auto-generate slug from name when creating
  const handleNameChange = (name) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setForm(p => ({ ...p, name, slug: editingId ? p.slug : slug }));
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, slug: cat.slug, displayOrder: cat.displayOrder, isActive: cat.isActive });
    setMsg({ text: '', type: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', slug: '', displayOrder: '', isActive: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setMsg({ text: '', type: '' });
    try {
      const body = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        displayOrder: Number(form.displayOrder) || 0,
        isActive: form.isActive,
      };
      const url = editingId
        ? `${API()}/api/categories/${editingId}`
        : `${API()}/api/categories`;
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: jsonH(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: editingId ? 'Category updated.' : 'Category created.', type: 'success' });
        setEditingId(null);
        setForm({ name: '', slug: '', displayOrder: '', isActive: true });
        fetchCategories();
      } else {
        setMsg({ text: data.message || 'Failed.', type: 'error' });
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (cat) => {
    await fetch(`${API()}/api/categories/${cat._id}`, {
      method: 'PUT',
      headers: jsonH(),
      body: JSON.stringify({ isActive: !cat.isActive }),
    });
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category? Existing articles using this slug will still work.')) return;
    await fetch(`${API()}/api/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    fetchCategories();
  };

  if (loading || (user && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-red-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-5 py-12 flex flex-col gap-8">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Categories</h1>
            <p className="text-slate-500 font-medium">Manage navigation categories. Changes reflect live immediately.</p>
          </div>
          <button onClick={() => router.push('/admin/dashboard')}
            className="px-6 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:border-slate-900 transition-all uppercase text-xs tracking-widest">
            ← Dashboard
          </button>
        </div>

        {/* Create / Edit Form */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-red-700 rounded-full" />
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>

          {msg.text && (
            <div className={`mb-5 p-3 rounded-xl font-bold text-sm ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">Name *</label>
              <input
                required
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. International"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">Slug</label>
              <input
                value={form.slug}
                onChange={e => setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                placeholder="auto-generated"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-gray-700 font-mono text-sm focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">Display Order</label>
              <input
                type="number"
                min="0"
                value={form.displayOrder}
                onChange={e => setForm(p => ({ ...p, displayOrder: e.target.value }))}
                placeholder="0"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer mr-2 self-center mb-0.5">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-red-700"
                />
                <span className="text-sm font-bold text-gray-700 whitespace-nowrap">Active</span>
              </label>
              {editingId && (
                <button type="button" onClick={cancelEdit}
                  className="px-4 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors text-sm whitespace-nowrap">
                  Cancel
                </button>
              )}
              <button type="submit" disabled={saving}
                className="flex-1 bg-red-700 text-white font-black px-5 py-2.5 rounded-xl hover:bg-red-800 transition-all uppercase tracking-widest text-xs disabled:opacity-50 whitespace-nowrap">
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-red-700 rounded-full" />
            All Categories
            <span className="ml-2 text-sm font-bold text-slate-400">({categories.length})</span>
          </h2>

          {fetching ? (
            <div className="py-16 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-bold uppercase tracking-widest">No categories yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-3 px-3 text-xs font-black uppercase text-slate-400">Order</th>
                    <th className="py-3 px-3 text-xs font-black uppercase text-slate-400">Name</th>
                    <th className="py-3 px-3 text-xs font-black uppercase text-slate-400">Slug</th>
                    <th className="py-3 px-3 text-xs font-black uppercase text-slate-400">Status</th>
                    <th className="py-3 px-3 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 text-sm font-bold text-slate-500">{cat.displayOrder}</td>
                      <td className="py-3 px-3 font-extrabold text-gray-900">{cat.name}</td>
                      <td className="py-3 px-3 font-mono text-sm text-slate-500">{cat.slug}</td>
                      <td className="py-3 px-3">
                        <button onClick={() => toggleActive(cat)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${cat.isActive ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'}`}>
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex gap-3 justify-end">
                          <button onClick={() => startEdit(cat)}
                            className="text-[11px] font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-all">
                            Edit
                          </button>
                          <button onClick={() => deleteCategory(cat._id)}
                            className="text-[11px] font-black text-red-400 hover:text-red-700 uppercase tracking-widest transition-all">
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
          <p className="mt-4 text-xs text-slate-400">
            💡 Deleting a category does not affect existing articles — they will still appear at <code>/category/[slug]</code>.
          </p>
        </div>

      </main>
      <Footer />
    </div>
  );
}
