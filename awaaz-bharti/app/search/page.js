import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";

export const metadata = {
  title: 'Search | Awaz Bharti',
  description: 'Search for the latest news on Awaz Bharti',
};

// Helper for fetching data
async function searchArticles(query) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${baseUrl}/api/articles/search?q=${encodeURIComponent(query)}`, {
      cache: 'no-store',
    });
    const result = await res.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error(`Error fetching search results:`, error);
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
  author: article.author?.name || "Awaz Bharti",
  time: new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }),
});

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const rawQuery = params?.q || "";
  const query = rawQuery.trim(); // Sanitize input
  
  let articles = [];
  let error = null;

  if (query) {
    const data = await searchArticles(query);
    if (data) {
      articles = data.map(mapArticle);
    } else {
      error = "Failed to load search results. Please try again later.";
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="max-w-[1280px] w-full mx-auto px-5 py-10 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Search Results</h1>
          {query ? (
            <p className="text-gray-500">
              Showing {articles.length} result{articles.length !== 1 ? 's' : ''} for <span className="font-bold text-gray-900">"{query}"</span>
            </p>
          ) : (
            <p className="text-gray-500">Please enter a keyword in the search bar above.</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-100">
            {error}
          </div>
        )}

        {query && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map(article => (
              <div key={article.id} className="h-full">
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

        {query && !error && articles.length === 0 && (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No results found</h2>
            <p className="text-gray-500">We couldn't find any articles matching "{query}". Try different keywords.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
