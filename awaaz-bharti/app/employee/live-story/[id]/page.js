"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthContext } from '../../../context/AuthContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { getImageUrl } from '../../../../lib/utils';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('../../../components/RichTextEditor'), { ssr: false });

const API = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const authH = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });
const jsonH = () => ({ 'Content-Type': 'application/json', ...authH() });

export default function ManageLiveStoryPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const { id } = useParams();

  const [story, setStory] = useState(null);
  const [entries, setEntries] = useState([]);
  const [fetching, setFetching] = useState(true);

  // Edit story state
  const [editStory, setEditStory] = useState(false);
  const [storyForm, setStoryForm] = useState({ title: '', description: '', coverImage: '' });
  const [savingStory, setSavingStory] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // New entry state
  const [entryForm, setEntryForm] = useState({ headline: '', content: '', author: '' });
  const [savingEntry, setSavingEntry] = useState(false);

  // Edit entry state
  const [editingEntry, setEditingEntry] = useState(null); // entry object
  const [editEntryForm, setEditEntryForm] = useState({ headline: '', content: '', author: '' });
  const [savingEditEntry, setSavingEditEntry] = useState(false);

  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'employee' && user.role !== 'admin'))) {
      router.push('/login');
    } else if (user && id) {
      fetchStory();
    }
  }, [user, loading, id]);

  const fetchStory = useCallback(async () => {
    setFetching(true);
    try {
      // Fetch by ID via slug endpoint won't work — use the me endpoint to get story details
      // We'll fetch all my stories and find by id
      const res = await fetch(`${API()}/api/live-stories/me`, { headers: authH() });
      const data = await res.json();
      if (data.success) {
        const found = data.data.find(s => s._id === id);
        if (!found) { router.push('/employee/my-live-stories'); return; }
        setStory(found);
        setStoryForm({ title: found.title, description: found.description || '', coverImage: found.coverImage || '' });
        // Fetch entries via slug
        const slugRes = await fetch(`${API()}/api/live-stories/slug/${found.slug}`);
        const slugData = await slugRes.json();
        if (slugData.success) setEntries(slugData.data.entries);
      }
    } finally {
      setFetching(false);
    }
  }, [id]);

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API()}/api/upload`, { method: 'POST', headers: authH(), body: fd });
    const data = await res.json();
    return data.image || null;
  };

  const saveStory = async (e) => {
    e.preventDefault();
    setSavingStory(true);
    try {
      const res = await fetch(`${API()}/api/live-stories/me/${id}`, {
        method: 'PUT',
        headers: jsonH(),
        body: JSON.stringify(storyForm),
      });
      const data = await res.json();
      if (data.success) {
        setStory(data.data);
        setEditStory(false);
        setMsg({ text: 'Story updated.', type: 'success' });
      } else {
        setMsg({ text: data.message, type: 'error' });
      }
    } finally {
      setSavingStory(false);
    }
  };

  const closeStory = async () => {
    if (!confirm('Close this story? You can reopen it later.')) return;
    const res = await fetch(`${API()}/api/live-stories/me/${id}`, {
      method: 'PUT',
      headers: jsonH(),
      body: JSON.stringify({ status: 'closed' }),
    });
    const data = await res.json();
    if (data.success) { setStory(data.data); setMsg({ text: 'Story closed.', type: 'success' }); }
  };

  const reopenStory = async () => {
    const res = await fetch(`${API()}/api/live-stories/me/${id}`, {
      method: 'PUT',
      headers: jsonH(),
      body: JSON.stringify({ status: 'live' }),
    });
    const data = await res.json();
    if (data.success) { setStory(data.data); setMsg({ text: 'Story reopened.', type: 'success' }); }
  };

  const addEntry = async (e) => {
    e.preventDefault();
    if (!entryForm.headline || !entryForm.content) {
      setMsg({ text: 'Headline and content are required.', type: 'error' });
      return;
    }
    setSavingEntry(true);
    try {
      const res = await fetch(`${API()}/api/live-stories/${id}/entries`, {
        method: 'POST',
        headers: jsonH(),
        body: JSON.stringify(entryForm),
      });
      const data = await res.json();
      if (data.success) {
        setEntries(prev => [data.data, ...prev]);
        setEntryForm({ headline: '', content: '', author: '' });
        setMsg({ text: 'Update posted!', type: 'success' });
      } else {
        setMsg({ text: data.message, type: 'error' });
      }
    } finally {
      setSavingEntry(false);
    }
  };

  const startEditEntry = (entry) => {
    setEditingEntry(entry);
    setEditEntryForm({ headline: entry.headline, content: entry.content, author: entry.author || '' });
  };

  const saveEditEntry = async (e) => {
    e.preventDefault();
    setSavingEditEntry(true);
    try {
      const res = await fetch(`${API()}/api/live-stories/${id}/entries/${editingEntry._id}`, {
        method: 'PUT',
        headers: jsonH(),
        body: JSON.stringify(editEntryForm),
      });
      const data = await res.json();
      if (data.success) {
        setEntries(prev => prev.map(en => en._id === editingEntry._id ? data.data : en));
        setEditingEntry(null);
        setMsg({ text: 'Update saved.', type: 'success' });
      }
    } finally {
      setSavingEditEntry(false);
    }
  };

  const deleteEntry = async (entryId) => {
    if (!confirm('Delete this update?')) return;
    const res = await fetch(`${API()}/api/live-stories/${id}/entries/${entryId}`, {
      method: 'DELETE',
      headers: authH(),
    });
    const data = await res.json();
    if (data.success) setEntries(prev => prev.filter(e => e._id !== entryId));
  };

  if (loading || !user) return null;

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-red-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!story) return null;

  const isLive = story.status === 'live';

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[900px] w-full mx-auto px-5 py-10 flex flex-col gap-6">

        {/* Back + header */}
        <div>
          <button onClick={() => router.push('/employee/my-live-stories')} className="text-xs font-black text-slate-400 hover:text-slate-700 uppercase tracking-widest mb-3 block">
            ← My Live Stories
          </button>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-gray-900 line-clamp-1">{story.title}</h1>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${isLive ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                {story.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditStory(p => !p)}
                className="text-xs font-black border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:border-slate-900 transition-all uppercase tracking-widest">
                {editStory ? 'Cancel Edit' : 'Edit Story'}
              </button>
              {isLive ? (
                <button onClick={closeStory}
                  className="text-xs font-black border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:border-red-500 hover:text-red-600 transition-all uppercase tracking-widest">
                  Close Story
                </button>
              ) : (
                <button onClick={reopenStory}
                  className="text-xs font-black bg-red-700 text-white px-4 py-2 rounded-xl hover:bg-red-800 transition-all uppercase tracking-widest">
                  Reopen
                </button>
              )}
              {story.slug && (
                <a href={`/live/${story.slug}`} target="_blank" rel="noreferrer"
                  className="text-xs font-black border border-blue-200 text-blue-600 px-4 py-2 rounded-xl hover:border-blue-400 transition-all uppercase tracking-widest">
                  View Live →
                </a>
              )}
            </div>
          </div>
        </div>

        {msg.text && (
          <div className={`p-3 rounded-xl font-bold text-sm ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {msg.text}
          </div>
        )}

        {/* Edit Story Form */}
        {editStory && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-black text-gray-900 mb-5">Edit Story Details</h2>
            <form onSubmit={saveStory} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1">Title *</label>
                <input required value={storyForm.title} onChange={e => setStoryForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1">Description</label>
                <textarea rows={2} value={storyForm.description} onChange={e => setStoryForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1">Cover Image</label>
                <input type="file" accept="image/*"
                  onChange={async (e) => {
                    setUploadingCover(true);
                    const url = await uploadImage(e.target.files[0]);
                    if (url) setStoryForm(p => ({ ...p, coverImage: url }));
                    setUploadingCover(false);
                  }}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-red-50 file:text-red-700 cursor-pointer" />
                {uploadingCover && <p className="text-[10px] text-red-700 font-bold mt-1 animate-pulse">Uploading...</p>}
                {storyForm.coverImage && (
                  <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden border border-slate-100">
                    <Image src={getImageUrl(storyForm.coverImage)} alt="cover" fill className="object-cover" />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditStory(false)} className="px-5 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={savingStory || uploadingCover}
                  className="bg-red-700 text-white font-black px-6 py-2.5 rounded-xl hover:bg-red-800 transition-all uppercase tracking-widest disabled:opacity-50">
                  {savingStory ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add New Entry */}
        {isLive && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
            <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-700 rounded-full animate-pulse" /> Post New Update
            </h2>
            <form onSubmit={addEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1">Headline *</label>
                <input required value={entryForm.headline} onChange={e => setEntryForm(p => ({ ...p, headline: e.target.value }))}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-gray-900 text-base focus:outline-none focus:border-red-500"
                  placeholder="e.g., US-Iran deal nears ceasefire" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1">Author</label>
                <input value={entryForm.author} onChange={e => setEntryForm(p => ({ ...p, author: e.target.value }))}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
                  placeholder="Reporter name (optional)" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1">Content *</label>
                <RichTextEditor
                  value={entryForm.content}
                  onChange={html => setEntryForm(p => ({ ...p, content: html }))}
                  placeholder="Write the update details, embed images or videos..."
                  onImageUpload={uploadImage}
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={savingEntry}
                  className="bg-red-700 text-white font-black px-8 py-3 rounded-xl hover:bg-red-800 transition-all uppercase tracking-widest shadow-lg shadow-red-700/20 disabled:opacity-50">
                  {savingEntry ? 'Posting...' : 'Post Update'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Timeline */}
        <div>
          <div className="mb-4 pb-2 border-b-[3px] border-red-700 flex items-center gap-2">
            <h2 className="text-lg font-black text-gray-900">Timeline</h2>
            <span className="ml-auto text-xs text-slate-400 font-bold">{entries.length} updates</span>
          </div>

          {entries.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center border border-gray-100 shadow-sm">
              <p className="text-slate-400 font-bold">No updates yet. Post the first update above.</p>
            </div>
          ) : (
            <div className="relative pl-6">
              <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-4">
                {entries.map((entry, i) => (
                  <div key={entry._id} className="relative">
                    <div className={`absolute -left-6 top-4 w-3 h-3 rounded-full border-2 border-red-700 z-10 ${i === 0 ? 'bg-red-700' : 'bg-white'}`} />

                    {editingEntry?._id === entry._id ? (
                      <div className="bg-white rounded-xl border border-red-200 p-4 shadow-sm">
                        <form onSubmit={saveEditEntry} className="space-y-3">
                          <input required value={editEntryForm.headline} onChange={e => setEditEntryForm(p => ({ ...p, headline: e.target.value }))}
                            className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:outline-none focus:border-red-500" />
                          <input value={editEntryForm.author} onChange={e => setEditEntryForm(p => ({ ...p, author: e.target.value }))}
                            className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500"
                            placeholder="Author" />
                          <RichTextEditor
                            value={editEntryForm.content}
                            onChange={html => setEditEntryForm(p => ({ ...p, content: html }))}
                            onImageUpload={uploadImage}
                          />
                          <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setEditingEntry(null)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-xl text-sm">Cancel</button>
                            <button type="submit" disabled={savingEditEntry}
                              className="bg-red-700 text-white font-black px-5 py-2 rounded-xl hover:bg-red-800 text-xs uppercase tracking-widest disabled:opacity-50">
                              {savingEditEntry ? 'Saving...' : 'Save'}
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className={`bg-white rounded-xl border p-4 shadow-sm ${i === 0 ? 'border-red-200' : 'border-gray-100'}`}>
                        <span className="text-[11px] font-black text-red-700 uppercase tracking-widest block mb-1.5">
                          {new Date(entry.timestamp).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                          {' · '}
                          {new Date(entry.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        <h3 className="text-[15px] font-extrabold text-gray-900 leading-snug mb-2">{entry.headline}</h3>
                        <div
                          className="prose prose-sm max-w-none text-gray-700 prose-a:text-red-700 prose-img:rounded-lg [&_iframe]:w-full [&_iframe]:rounded-lg"
                          dangerouslySetInnerHTML={{ __html: entry.content }}
                        />
                        {entry.author && <p className="mt-2 text-[11px] text-slate-400 font-bold">— {entry.author}</p>}
                        <div className="flex gap-3 mt-3 pt-2 border-t border-slate-50">
                          <button onClick={() => startEditEntry(entry)}
                            className="text-[10px] font-black text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-all">
                            Edit
                          </button>
                          <button onClick={() => deleteEntry(entry._id)}
                            className="text-[10px] font-black text-red-300 hover:text-red-600 uppercase tracking-widest transition-all">
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
