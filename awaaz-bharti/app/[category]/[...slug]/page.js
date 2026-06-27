import ArticleView from "../../components/ArticleView";
import { notFound } from "next/navigation";
import { getArticleMetadata, getArticleUrl, normalizeArticlePath } from "../../../lib/utils";

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

async function getArticle(id) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${baseUrl}/api/articles/${id}`, { cache: 'no-store' });
    const result = await res.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

async function fetchArticles(endpoint) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${baseUrl}${endpoint}`, { cache: 'no-store' });
    const result = await res.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

function parseSlugs(category, slug) {
  if (!slug || slug.length === 0) return { category, subCategory: null, title: null };

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

/**
 * Resolve article ID by matching the requested SEO path against
 * pre-computed URLs. Final fetch always uses article _id.
 */
async function resolveArticleId(category, slug) {
  const { subCategory, title } = parseSlugs(category, slug);
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

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const articleId = await resolveArticleId(category, slug);
  if (!articleId) return { title: 'Article Not Found | Awaz Bharti' };
  const article = await getArticle(articleId);
  return getArticleMetadata(article);
}

export default async function DynamicArticlePage({ params }) {
  const { category, slug } = await params;
  const { title } = parseSlugs(category, slug);

  if (!title) notFound();

  const articleId = await resolveArticleId(category, slug);
  if (!articleId) notFound();

  const article = await getArticle(articleId);
  if (!article) notFound();

  return <ArticleView article={article} />;
}
