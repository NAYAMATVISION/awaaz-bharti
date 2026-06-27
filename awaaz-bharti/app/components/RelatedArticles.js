import NewsCard from "./NewsCard";

export default function RelatedArticles({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-slate-100">
      <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-red-700 rounded-full"></span>
        More from Awaz Bharti
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.slice(0, 4).map((article) => (
          <div key={article.id}>
            <NewsCard
              id={article.id}
              title={article.title}
              image={article.image}
              category={article.badge || article.category}
              categoryType={article.badgeType}
              time={article.time}
              url={article.url}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
