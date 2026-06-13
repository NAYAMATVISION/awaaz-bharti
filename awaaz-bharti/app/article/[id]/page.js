import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import TextToSpeech from "../../components/TextToSpeech";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getImageUrl } from "../../../lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://awaazbharti.com';
const SITE_NAME = 'Awaz Bharti';

// Fetch article data
async function getArticle(id) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${baseUrl}/api/articles/${id}`, {
      cache: 'no-store',
    });
    const result = await res.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

const stripHtml = (html) =>
  (html || '').replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();

export async function generateMetadata({ params }) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return { title: `Article Not Found | ${SITE_NAME}` };
  }

  const title = `${article.title} | ${SITE_NAME}`;
  const description = article.subheading
    ? article.subheading
    : stripHtml(article.content).substring(0, 160);
  const image = getImageUrl(article.image);
  const url = `${SITE_URL}/article/${id}`;

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
      authors: [article.author?.name || 'Awaz Bharti'],
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

export default async function ArticlePage({ params }) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-[800px] mx-auto px-4 py-6 sm:py-10">
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-10">
          {/* Category Badge */}
          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase mb-4">
            {article.category}
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4 sm:mb-6">
            {article.title}
          </h1>

          {/* Author and Date */}
          <div className="flex items-center gap-4 border-y border-gray-100 py-4 mb-6">
            <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-white font-bold">
              {article.author?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{article.author?.name || "Awaaz Bharti Correspondent"}</p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </div>

          {/* Text to Speech Component */}
          <TextToSpeech text={article.content} />

          {/* Featured Image */}
          {article.image && (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-8">
              <Image 
                src={getImageUrl(article.image)} 
                alt={article.title} 
                width={1200}
                height={675}
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
