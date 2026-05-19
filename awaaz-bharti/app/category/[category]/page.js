import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import NewsCard from "../../components/NewsCard";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${formattedCategory} News | Awaaz Bharti`,
    description: `Latest news and updates on ${formattedCategory} from Awaaz Bharti.`,
  };
}

// Helper for fetching data
async function getCategoryArticles(category) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${baseUrl}/api/articles/category/${encodeURIComponent(category)}`, {
      cache: 'no-store',
    });
    const result = await res.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error(`Error fetching category results:`, error);
    return null; // Handle failure gracefully
  }
}

// Data mapping helper
const mapArticle = (article) => ({
  id: article._id,
  title: article.title,
  description: article.content ? article.content.substring(0, 150) + "..." : "",
  image: article.image || "/hero_parliament.png",
  badge: article.category?.charAt(0).toUpperCase() + article.category?.slice(1),
  badgeType: article.category?.toLowerCase(),
  author: article.author?.name || "Awaaz Bharti",
  time: new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }),
});

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  let articles = [];
  let error = null;

  const data = await getCategoryArticles(category);
  if (data) {
    articles = data.map(mapArticle);
  } else {
    error = `Failed to load ${formattedCategory} news. Please try again later.`;
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="max-w-[1280px] w-full mx-auto px-4 py-6 sm:py-10 flex-1">
        <div className="mb-5 sm:mb-8 border-b-2 border-red-700 pb-3 sm:pb-4 inline-block">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{formattedCategory} News</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-100">
            {error}
          </div>
        )}

        {!error && articles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {articles.map(article => (
              <div key={article.id} className="h-full hover:-translate-y-1 transition-all duration-300">
                <NewsCard
                  id={article.id}
                  title={article.title}
                  image={article.image}
                  category={article.badge}
                  categoryType={article.badgeType}
                  time={article.time}
                  description={article.description}
                  isSmall={false}
                />
              </div>
            ))}
          </div>
        )}

        {!error && articles.length === 0 && (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">📰</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No articles found</h2>
            <p className="text-gray-500">We couldn't find any recent articles in the {formattedCategory} category.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
