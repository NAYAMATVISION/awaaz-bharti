"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TextToSpeech from "./TextToSpeech";
import NewsCard from "./NewsCard";
import CategorySection from "./CategorySection";
import LiveUpdates from "./LiveUpdates";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl, getArticleUrl } from "../../lib/utils";

// Helper for fetching data
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

// Map article data
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

function EngagementSections({ article }) {
  const [categoryArticles, setCategoryArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [liveStories, setLiveStories] = useState([]);
  const [categorySections, setCategorySections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEngagementData = async () => {
      try {
        const [categoryRes, allArticlesRes, liveRes, categoriesRes] = await Promise.all([
          fetchData(`/api/articles/category/${encodeURIComponent(article.category)}`),
          fetchData('/api/articles'),
          fetchData('/api/live-stories'),
          fetchData('/api/categories'),
        ]);

        // More from this category (exclude current article)
        const sameCategoryArticles = categoryRes
          .filter(a => a._id !== article._id)
          .map(mapArticle)
          .slice(0, 6);
        setCategoryArticles(sameCategoryArticles);

        // Trending articles (exclude current and same category articles)
        const allMapped = allArticlesRes.map(mapArticle);
        const excludedIds = [article._id, ...sameCategoryArticles.map(a => a.id)];
        const trending = allMapped
          .filter(a => !excludedIds.includes(a.id))
          .slice(0, 8);
        setTrendingArticles(trending);

        // Live stories
        const activeLive = liveRes
          .map(mapLiveStory)
          .filter(story => story.isLive);
        setLiveStories(activeLive);

        // Categories
        setCategories(categoriesRes);

        // Other category sections
        const EMOJI = {
          politics: '🏛️',
          business: '📈', 
          technology: '💻',
          sports: '🏏',
          entertainment: '🎬',
          health: '🏥',
          crime: '🚔'
        };

        const otherCategories = (categoriesRes || [])
          .filter(cat => cat.slug !== article.category.toLowerCase())
          .map(cat => ({
            id: cat.slug,
            name: cat.name,
            emoji: EMOJI[cat.slug] || '📰'
          }));

        // Fallback if no DB categories
        const fallbackCategories = ['politics', 'business', 'technology', 'sports', 'entertainment', 'health', 'crime']
          .filter(cat => cat !== article.category.toLowerCase())
          .map(cat => ({
            id: cat,
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            emoji: EMOJI[cat] || '📰'
          }));

        const categoryList = otherCategories.length > 0 ? otherCategories : fallbackCategories;

        // Create category sections with articles
        const sections = categoryList.map(cat => {
          const catArticles = allMapped
            .filter(a => a.badgeType === cat.id && !excludedIds.includes(a.id))
            .slice(0, 4);
          return {
            ...cat,
            featured: catArticles[0] || null,
            articles: catArticles.slice(1, 3),
          };
        }).filter(section => section.featured);

        setCategorySections(sections);
      } catch (error) {
        console.error('Error loading engagement data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEngagementData();
  }, [article._id, article.category]);

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="text-center text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto mb-2"></div>
          <p className="text-sm">Loading more stories...</p>
        </div>
      </div>
    );
  }

  // All categories for "Explore More" section
  const allCategoryList = (categories || []).length > 0 ? 
    categories.map(cat => ({ id: cat.slug, name: cat.name })) :
    ['politics', 'business', 'technology', 'sports', 'entertainment', 'health', 'crime']
      .map(cat => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1) }));

  const EMOJI = {
    politics: '🏛️',
    business: '📈', 
    technology: '💻',
    sports: '🏏',
    entertainment: '🎬',
    health: '🏥',
    crime: '🚔'
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <div className="space-y-8">
        
        {/* 1. More from This Category */}
        {categoryArticles.length > 0 && (
          <section className="bg-white rounded-xl p-6 shadow-sm border border-black/[.04]">
            <div className="flex items-center justify-between mb-6 pb-3 border-b-[3px] border-red-700">
              <h2 className="text-xl font-black text-gray-900">
                More from {article.category?.charAt(0).toUpperCase() + article.category?.slice(1)}
              </h2>
              <Link 
                href={`/category/${article.category.toLowerCase()}`} 
                className="text-[12px] text-red-700 font-semibold hover:opacity-70 transition-opacity"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryArticles.map(articleItem => (
                <NewsCard
                  key={articleItem.id}
                  id={articleItem.id}
                  title={articleItem.title}
                  image={articleItem.image}
                  category={articleItem.badge}
                  categoryType={articleItem.badgeType}
                  time={articleItem.time}
                  seoSlug={articleItem.seoSlug}
                  seoTitle={articleItem.seoTitle}
                  url={articleItem.url}
                  isSmall
                />
              ))}
            </div>
          </section>
        )}

        {/* 2. Trending News */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingArticles.map(articleItem => (
                <NewsCard
                  key={articleItem.id}
                  id={articleItem.id}
                  title={articleItem.title}
                  image={articleItem.image}
                  category={articleItem.badge}
                  categoryType={articleItem.badgeType}
                  time={articleItem.time}
                  seoSlug={articleItem.seoSlug}
                  seoTitle={articleItem.seoTitle}
                  url={articleItem.url}
                  isSmall
                />
              ))}
            </div>
          </section>
        )}

        {/* 3. Live Updates */}
        {liveStories.length > 0 && (
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
                {liveStories.slice(0, 4).map((story) => (
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

        {/* 4. Other Category Sections */}
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

        {/* 5. Explore More Categories */}
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
                  cat.id === article.category.toLowerCase() 
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
    </div>
  );
}

export default function ArticleView({ article }) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Main Article Content - Keep Exactly As Is */}
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

      {/* New Engagement Sections */}
      <EngagementSections article={article} />

      <Footer />
    </div>
  );
}
