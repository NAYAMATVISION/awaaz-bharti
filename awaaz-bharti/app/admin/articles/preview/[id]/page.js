"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthContext } from '../../../../context/AuthContext';
import ArticleView from '../../../../components/ArticleView';
import { getArticleUrl } from '../../../../../lib/utils';

const StatusBadge = ({ status }) => {
  const config = {
    pending: {
      label: 'Pending Approval',
      dot: 'bg-amber-400',
      classes: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    approved: {
      label: 'Approved',
      dot: 'bg-emerald-400',
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    rejected: {
      label: 'Rejected',
      dot: 'bg-red-400',
      classes: 'bg-red-50 text-red-800 border-red-200',
    },
  };

  const { label, dot, classes } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${classes}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
      {label}
    </span>
  );
};

const InfoField = ({ label, value, mono = false, className = '' }) => (
  <div className={className}>
    <dt className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">{label}</dt>
    <dd className={`text-sm text-slate-800 font-medium ${mono ? 'font-mono text-xs break-all select-all' : ''}`}>
      {value || '—'}
    </dd>
  </div>
);

export default function AdminArticlePreviewPage() {
  const { user, loading } = useAuthContext();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !id) return;
    const fetchArticle = async () => {
      setError('');
      setLoadingArticle(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');
        const res = await fetch(`${apiUrl}/api/articles/${id}/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load article preview');
        }
        setArticle(data.data);
      } catch (err) {
        console.error('Error loading preview:', err);
        setError(err.message);
      } finally {
        setLoadingArticle(false);
      }
    };
    fetchArticle();
  }, [user, id]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://awaazbharti.com').replace(/\/$/, '');

  const handleApprove = useCallback(async () => {
    setActionLoading('approve');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/articles/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) router.push('/admin/articles');
    } catch (err) {
      console.error('Error approving article:', err);
    } finally {
      setActionLoading(null);
    }
  }, [apiUrl, id, router]);

  const handleReject = useCallback(async () => {
    setActionLoading('reject');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/articles/${id}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) router.push('/admin/articles');
    } catch (err) {
      console.error('Error rejecting article:', err);
    } finally {
      setActionLoading(null);
    }
  }, [apiUrl, id, router]);

  const handleCopyUrl = useCallback(async (fullUrl) => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  }, []);

  if (loading || loadingArticle || (user && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-red-700 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-bold">Loading Preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4 py-10">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
          <h1 className="text-2xl font-black text-gray-900 mb-4">Preview unavailable</h1>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => router.push('/admin/articles')}
            className="px-6 py-3 bg-red-700 text-white font-black rounded-xl uppercase tracking-widest text-xs"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  const articlePath = article ? getArticleUrl(article) : '';
  const fullUrl = `${siteUrl}${articlePath}`;
  const submissionDate = article?.pendingChanges?.submittedAt || article?.updatedAt || article?.createdAt;
  const formattedSubmission = submissionDate
    ? new Date(submissionDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';
  const formattedPublication = article?.createdAt
    ? new Date(article.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';
  const authorInitial = article?.author?.name?.charAt(0)?.toUpperCase() || 'A';
  const isEditPending = article?.status === 'approved' && article?.pendingChanges?.submittedAt;

  const QuickActions = ({ className = '' }) => (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <button
        onClick={handleApprove}
        disabled={!!actionLoading}
        className="px-4 py-2 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
      >
        {actionLoading === 'approve' ? 'Approving...' : 'Approve'}
      </button>
      <button
        onClick={handleReject}
        disabled={!!actionLoading}
        className="px-4 py-2 bg-red-600 text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {actionLoading === 'reject' ? 'Rejecting...' : 'Reject'}
      </button>
      <button
        onClick={() => router.push(`/admin/articles/edit/${id}`)}
        disabled={!!actionLoading}
        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-widest rounded-lg hover:border-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50"
      >
        Edit
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sticky top action bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={() => router.push('/admin/articles')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors w-fit"
          >
            <span aria-hidden="true">←</span>
            Back to Articles
          </button>
          <QuickActions className="hidden sm:flex" />
        </div>
      </div>

      {/* CMS chrome */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 sm:space-y-10">
        {/* Preview banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 sm:px-8 py-5 sm:py-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <h1 className="text-sm sm:text-base font-black uppercase tracking-widest text-amber-900">
                  Admin Preview
                </h1>
              </div>
              <p className="text-amber-800 font-semibold text-sm sm:text-base">
                {isEditPending
                  ? 'Updated content is awaiting approval.'
                  : 'This article is currently awaiting approval.'}
              </p>
              <p className="text-amber-700/80 text-sm mt-1.5 max-w-2xl">
                The content below is exactly how it will appear to readers after approval.
              </p>
            </div>
            <StatusBadge status={article?.status} />
          </div>
        </div>

        {/* Article information card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span aria-hidden="true">📋</span>
              Article Information
            </h2>
          </div>

          <div className="px-5 sm:px-8 py-6 sm:py-8">
            {/* Author row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0">
                  {authorInitial}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{article?.author?.name || 'Unknown Author'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Published {formattedPublication}
                  </p>
                </div>
              </div>
              <div className="sm:ml-auto">
                <StatusBadge status={article?.status} />
              </div>
            </div>

            {/* Metadata grid */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <InfoField label="Category" value={article?.category} />
              <InfoField label="Sub Category" value={article?.subCategory} />
              <InfoField label="SEO Title" value={article?.seoUrlTitle || article?.title} />
              <InfoField label="Submission Date" value={formattedSubmission} />
              <InfoField label="Author" value={article?.author?.name} />
              <InfoField label="Status" value={article?.status} />
            </dl>

            {/* Canonical URL */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <dt className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Canonical URL
              </dt>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="text-base shrink-0 mt-0.5" aria-hidden="true">🔗</span>
                  <span className="font-mono text-xs sm:text-sm text-slate-700 break-all select-all">
                    {fullUrl}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyUrl(fullUrl)}
                  className="shrink-0 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-black uppercase tracking-widest text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors w-full sm:w-auto"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile quick actions */}
        <div className="sm:hidden bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3">Quick Actions</p>
          <QuickActions />
        </div>

        {/* Article preview — unchanged rendering */}
        <div className="mt-2">
          {article && <ArticleView article={article} />}
        </div>

        {/* Bottom quick actions */}
        <div className="bg-white border border-slate-200 rounded-2xl px-5 sm:px-8 py-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Review complete?</p>
              <p className="text-xs text-slate-500 mt-0.5">Approve to publish, reject to send back, or edit directly.</p>
            </div>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}
