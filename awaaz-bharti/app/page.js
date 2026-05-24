import BreakingTicker from "./components/BreakingTicker";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import LiveUpdates from "./components/LiveUpdates";
import VideoSection from "./components/VideoSection";
import CategorySection from "./components/CategorySection";
import Sidebar from "./components/Sidebar";
import NewsCard from "./components/NewsCard";
import Footer from "./components/Footer";
import { getImageUrl } from "../lib/utils";

export const dynamic = 'force-dynamic';

async function getData(endpoint) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${baseUrl}${endpoint}`, { cache: 'no-store' });
    const result = await res.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();

const mapArticle = (article) => ({
  id: article._id,
  title: article.title,
  description: article.subheading || (stripHtml(article.content).substring(0, 150) + "..."),
  content: article.content,
  image: getImageUrl(article.image),
  badge: article.category?.charAt(0).toUpperCase() + article.category?.slice(1),
  badgeType: article.category?.toLowerCase(),
  author: article.author?.name || "Awaz Bharti",
  date: new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }),
});

export default async function HomePage() {
  const [articles, breakingArticles, liveUpdates, videos] = await Promise.all([
    getData('/api/articles'),
    getData('/api/articles/breaking'),
    getData('/api/live'),
    getData('/api/videos'),
  ]);

  const mappedArticles = (articles || []).map(mapArticle);

  const heroArticle = mappedArticles[0] || null;
  const heroSideArticles = mappedArticles.slice(1, 5);

  const categories = ["politics", "business", "technology", "sports", "entertainment", "health"];
  const categorySections = categories.map(cat => {
    const catArticles = mappedArticles.filter(a => a.badgeType === cat);
    return {
      id: cat,
      title: cat.charAt(0).toUpperCase() + cat.slice(1),
      emoji: cat === "politics" ? "🏛️" : cat === "business" ? "📈" : cat === "technology" ? "💻" : cat === "sports" ? "🏏" : cat === "entertainment" ? "🎬" : "🏥",
      featured: catArticles[0] || null,
      articles: catArticles.slice(1, 5),
    };
  }).filter(s => s.featured);

  const mappedLive = (liveUpdates || []).map(update => ({
    id: update._id,
    slug: update.slug,
    time: new Date(update.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    headline: update.title,
    excerpt: update.excerpt,
    description: update.content?.replace(/<[^>]*>/g, '').substring(0, 120),
    coverImage: update.coverImage,
  }));

  const mappedVideos = (videos || []).map(v => ({
    title: v.title,
    youtubeUrl: v.youtubeUrl,
    category: v.category,
    time: new Date(v.createdAt).toLocaleDateString(),
  }));

  return (
    <>
      <BreakingTicker />
      <Navbar />

      <div className="max-w-[1280px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 py-4 pb-10">

          {/* LEFT COLUMN — main content */}
          <main className="flex flex-col gap-6 min-w-0 order-1">
            {heroArticle ? (
              <HeroSection featured={heroArticle} />
            ) : (
              <div className="min-h-[420px] bg-white rounded-xl flex flex-col items-center justify-center gap-3 border border-slate-100 shadow-sm">
                <div className="text-5xl">📰</div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No articles available</p>
              </div>
            )}

            <LiveUpdates updates={mappedLive} />

            <VideoSection videos={mappedVideos} />

            {categorySections.map((section) => (
              <CategorySection
                key={section.id}
                id={section.id}
                title={section.title}
                emoji={section.emoji}
                featured={section.featured}
                articles={section.articles}
              />
            ))}
          </main>

          {/* RIGHT COLUMN — sidebar */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-[70px] lg:self-start order-2">
            {/* Hero side cards — aligned with hero image */}
            {heroSideArticles.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-4">
                {heroSideArticles.map((article, i) => (
                  <NewsCard
                    key={i}
                    id={article.id}
                    title={article.title}
                    image={article.image}
                    category={article.badge}
                    categoryType={article.badgeType}
                    time={article.time}
                  />
                ))}
              </div>
            )}

            {/* Sidebar widgets */}
            <Sidebar />
          </aside>

        </div>
      </div>

      <Footer />
    </>
  );
}
