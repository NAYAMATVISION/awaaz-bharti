export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/fallback.jpg';

  // Already a full URL (Cloudinary, external, or legacy localhost)
  if (imagePath.startsWith('http')) return imagePath;

  // Relative path — prefix with backend URL (legacy local uploads fallback)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};

const SITE_NAME = 'Awaz Bharti';

export function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getArticleTitleSlug(article) {
  if (article?.seoUrlTitle) {
    const slug = slugify(article.seoUrlTitle);
    if (slug) return slug;
  }
  const slug = slugify(article?.title || '');
  if (slug) return slug;
  return article?._id ? String(article._id) : '';
}

export function getArticleUrl(article) {
  if (!article?._id) return '#';
  if (!article.category) return `/article/${article._id}`;

  const titleSlug = getArticleTitleSlug(article);
  if (!titleSlug) return `/article/${article._id}`;

  const parts = [article.category.toLowerCase()];
  if (article.subCategory) {
    const subSlug = slugify(article.subCategory);
    if (subSlug) parts.push(subSlug);
  }
  parts.push(titleSlug);
  return `/${parts.join('/')}`;
}

export function normalizeArticlePath(path) {
  if (!path) return '/';
  return path.toLowerCase().replace(/\/+$/, '') || '/';
}

const stripHtml = (html) =>
  (html || '').replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();

export function getArticleMetadata(article) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://awaazbharti.com';

  if (!article) {
    return { title: `Article Not Found | ${SITE_NAME}` };
  }

  const title = `${article.title} | ${SITE_NAME}`;
  const description = article.subheading
    ? article.subheading
    : stripHtml(article.content).substring(0, 160);
  const image = getImageUrl(article.image);
  const url = `${siteUrl}${getArticleUrl(article)}`;

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      title: article.title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.createdAt,
      authors: [article.author?.name || SITE_NAME],
      section: article.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [image],
    },
  };
}
