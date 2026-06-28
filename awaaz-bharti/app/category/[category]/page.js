import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import NewsCard from "../../components/NewsCard";
import CategorySection from "../../components/CategorySection";
import LiveUpdates from "../../components/LiveUpdates";
import Link from "next/link";
import { getImageUrl, getArticleUrl } from "../../../lib/utils";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${formattedCategory} News | Awaaz Bharti`,
    description: `Latest news and updates on ${formattedCategory} from Awaaz Bharti.`,
  };
}

// Helper for fetching data with error handling
async function fetchData(endpoint) {
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

// Data mapping helper
const mapArticle = (article) => ({
  id: article._id,
  title: article.title,
  description: article.subheading || (article.content ? article.content.substring(0, 150) + "..." : ""),
  image: getImageUrl(article.image),
  badge: article.category?.charAt(0).toUpperCase() + article.category?.slice(1),
  badgeType: article.category?.toLowerCase(),
  author: article.author?.name || "Awaaz Bharti",
  seoSlug: article.seoSlug || '',
  seoTitle: article.seoTitle || '',
  time: new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }),
  url: getArticleUrl(article),
});

// Map live stories
const mapLiveStory = (story) => ({
  id: story._id,
  slug: story.slug,
  title: story.title,
  description: story.description,
  coverImage: story.coverImage,
  isLive: story.status === 'live',
  entryCount: story.entryCount || 0,
});

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  // Fetch all required data in parallel
  const [categoryArticles, allArticles, liveStories, categories] = await Promise.all([
    fetchData(`/api/articles/category/${encodeURIComponent(category)}`),
    fetchData('/api/articles'),
    fetchData('/api/live-stories'),
    fetchData('/api/categories'),
  ]);

  const mappedCategoryArticles = categoryArticles.map(mapArticle);
  const mappedAllArticles = allArticles.map(mapArticle);
  const mappedLiveStories = liveStories.map(mapLiveStory);

  // Get trending articles (latest 6 articles excluding current category)
  const trendingArticles = mappedAllArticles
    .filter(article => article.badgeType !== category)
    .slice(0, 6);

  // Get active live stories
  const activeLiveStories = mappedLiveStories.filter(story => story.isLive);

  // Category emojis
  const EMOJI = {
    politics: '🏛️',
    business: '📈', 
    technology: '💻',
    sports: '🏏',
    entertainment: '🎬',
    health: '🏥',
    crime: '🚔'
  };

  // Get dynamic categories from database, excluding current category
  const otherCategories = (categories || [])
    .filter(cat => cat.slug !== category)
    .map(cat => ({
      id: cat.slug,
      name: cat.name,
      emoji: EMOJI[cat.slug] || '📰'
    }));

  // If no DB categories, use fallback categories
  const fallbackCategories = ['politics', 'business', 'technology', 'sports', 'entertainment', 'health', 'crime']
    .filter(cat => cat !== category)
    .map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      emoji: EMOJI[cat] || '📰'
    }));

  const categoryList = otherCategories.length > 0 ? otherCategories : fallbackCategories;

  // Create category sections with articles
  const categorySections = categoryList.map(cat => {
    const catArticles = mappedAllArticles.filter(article => article.badgeType === cat.id);
    return {
      ...cat,
      featured: catArticles[0] || null,
      articles: catArticles.slice(1, 4), // Show 3 smaller articles
    };
  }).filter(section => section.featured); // Only show categories that have articles

  // All categories for "Explore More" section
  const allCategoryList = (categories || [])
    .map(cat => ({ id: cat.slug, name: cat.name }))
    .length > 0 ? 
    categories.map(cat => ({ id: cat.slug, name: cat.name })) :
    ['politics', 'business', 'technology', 'sports', 'entertainment', 'health', 'crime']
      .map(cat => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1) }));

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="max-w-[1280px] w-full mx-auto px-4 py-6 sm:py-10 flex-1">
        {/* Current Category Section - Keep Existing */}
        <div className="mb-8">
          <div className="mb-5 sm:mb-8 border-b-2 border-red-700 pb-3 sm:pb-4 inline-block">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{formattedCategory} News</h1>
          </div>

          {mappedCategoryArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mappedCategoryArticles.map(article => (
                <div key={article.id} className="h-full hover:-translate-y-1 transition-all duration-300">
                  <NewsCard
                    id={article.id}
                    title={article.title}
                    image={article.image}
                    category={article.badge}
                    categoryType={article.badgeType}
                    time={article.time}
                    description={article.description}
                    seoSlug={article.seoSlug}
                    seoTitle={article.seoTitle}
                    url={article.url}
                    isSmall={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
              <div className="text-5xl mb-4">📰</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">No articles found</h2>
              <p className="text-gray-500">We couldn't find any recent articles in the {formattedCategory} category.</p>
            </div>
          )}
        </div>

        {/* Additional Sections for User Engagement */}
        <div className="space-y-8">
          
          {/* 1. Trending News Section */}
          {trendingArticles.length > 0 && (
            <section className="bg-white rounded-xl p-6 shadow-sm border border-black/[.04]">
              <div className="flex items-center justify-between mb-6 pb-3 border-b-[3px] border-red-700">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  🔥 Trending News
                </h2>
                <Link 
                  href="/" 
                  className="text-[12px] text-red-700 font-semibold hover:opacity-70 transition-opacity"
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingArticles.map(article => (
                  <NewsCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    image={article.image}
                    category={article.badge}
                    categoryType={article.badgeType}
                    time={article.time}
                    seoSlug={article.seoSlug}
                    seoTitle={article.seoTitle}
                    url={article.url}
                    isSmall
                  />
                ))}
              </div>
            </section>
          )}

          {/* 2. Live Updates Section */}
          {activeLiveStories.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-black/[.04] overflow-hidden">
              <div className="px-6 py-4 border-b-[3px] border-red-700 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-700 rounded-full animate-pulse" />
                  📡 Live Updates
                </h2>
                <Link 
                  href="/live" 
                  className="text-[12px] text-red-700 font-semibold hover:opacity-70 transition-opacity"
                >
                  View All →
                </Link>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeLiveStories.slice(0, 4).map((story) => (
                    <Link
                      key={story.id}
                      href={`/live/${story.slug}`}
                      className="flex gap-4 items-start rounded-lg p-4 hover:bg-red-50 transition-colors group border border-gray-100 hover:border-red-200"
                    >
                      {story.coverImage && (
                        <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
                          <img 
                            src={getImageUrl(story.coverImage)} 
                            alt={story.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex items-center gap-1 bg-red-700 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                            <span className="w-1 h-1 bg-white rounded-full animate-pulse" /> Live
                          </span>
                          <span className="text-[10px] font-bold text-red-700 uppercase">{story.entryCount} updates</span>
                        </div>
                        <h4 className="text-[14px] font-extrabold leading-snug text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2">
                          {story.title}
                        </h4>
                        {story.description && (
                          <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-1 mt-1">{story.description}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Other Category Sections */}
          {categorySections.map((section) => (
            <CategorySection
              key={section.id}
              id={section.id}
              title={section.name}
              emoji={section.emoji}
              featured={section.featured}
              articles={section.articles}
            />
          ))}

          {/* 4. Explore More Categories */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-black/[.04]">
            <h2 className="text-xl font-black text-gray-900 mb-6 text-center">
              Explore More Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {allCategoryList.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className={`text-center p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                    cat.id === category 
                      ? 'border-red-700 bg-red-50 text-red-700' 
                      : 'border-gray-200 hover:border-red-300 text-gray-700 hover:text-red-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{EMOJI[cat.id] || '📰'}</div>
                  <div className="text-[11px] font-black uppercase tracking-wider">{cat.name}</div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
