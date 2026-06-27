import { NextResponse } from 'next/server';
import { getArticleUrl, normalizeArticlePath } from './lib/utils';

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

const RESERVED_SEGMENTS = new Set([
  'article', 'category', 'admin', 'employee', 'search', 'login', 'signup',
  'live', 'live-updates', 'videos', 'e-paper', 'about', 'contact', 'terms',
  'privacy-policy', 'disclaimer', 'cookies', 'careers', 'advertise', 'api',
]);

async function fetchArticles(endpoint) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${baseUrl}${endpoint}`, { cache: 'no-store' });
    const result = await res.json();
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

function parsePathSegments(segments) {
  const category = segments[0];
  const slug = segments.slice(1);

  if (slug.length === 1) {
    return { category, subCategory: null, title: decodeURIComponent(slug[0]) };
  }

  const title = decodeURIComponent(slug[slug.length - 1]);
  const subCategory = slug.slice(0, -1).map(decodeURIComponent).join('/');
  return { category, subCategory, title };
}

function buildRequestedPath(category, subCategory, title) {
  const parts = [category.toLowerCase()];
  if (subCategory) parts.push(subCategory);
  parts.push(title);
  return normalizeArticlePath(`/${parts.join('/')}`);
}

function findArticleByPath(articles, requestedPath) {
  return articles.find(
    (article) => normalizeArticlePath(getArticleUrl(article)) === requestedPath
  );
}

async function resolveArticleId(category, segments) {
  const { subCategory, title } = parsePathSegments([category, ...segments]);
  if (!title) return null;

  if (OBJECT_ID_PATTERN.test(title)) {
    return title;
  }

  const requestedPath = buildRequestedPath(category, subCategory, title);
  const categoryArticles = await fetchArticles(
    `/api/articles/category/${encodeURIComponent(category.toLowerCase())}`
  );

  let match = findArticleByPath(categoryArticles, requestedPath);
  if (!match) {
    const allArticles = await fetchArticles('/api/articles');
    match = findArticleByPath(allArticles, requestedPath);
  }

  return match?._id ? String(match._id) : null;
}

export async function middleware(request) {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);

  if (segments.length < 2 || RESERVED_SEGMENTS.has(segments[0])) {
    return NextResponse.next();
  }

  const articleId = await resolveArticleId(segments[0], segments.slice(1));
  if (!articleId) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL(`/article/${articleId}`, request.url));
}

export const config = {
  matcher: [
    '/((?!article|category|admin|employee|search|login|signup|live|live-updates|videos|e-paper|about|contact|terms|privacy-policy|disclaimer|cookies|careers|advertise|api|_next|favicon\\.ico).*)',
  ],
};
