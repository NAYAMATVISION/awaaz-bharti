import NewsCard from "./NewsCard";

/**
 * CategorySection — Reusable section for any news category
 *
 * @param {Object} props
 * @param {string} props.id - Section anchor ID
 * @param {string} props.title - Section title
 * @param {string} props.emoji - Emoji icon
 * @param {Object} props.featured - Featured article data
 * @param {Array}  props.articles - Array of smaller articles
 */
export default function CategorySection({ id, title, emoji, featured, articles }) {
  return (
    <section id={id}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b-[3px] border-red-700">
        <h2 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
          {emoji} {title}
        </h2>
        <a href={`/category/${id}`} className="text-[12px] text-red-700 font-semibold hover:opacity-70 transition-opacity">
          See More →
        </a>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Featured article */}
        <NewsCard
          id={featured.id}
          title={featured.title}
          image={featured.image}
          category={featured.badge}
          categoryType={featured.badgeType}
          author={featured.author}
          time={featured.time}
          isFeatured
        />

        {/* Smaller articles list */}
        <div className="flex flex-col gap-3.5">
          {articles.map((article, i) => (
            <NewsCard
              key={i}
              id={article.id}
              title={article.title}
              image={article.image}
              time={article.time}
              isSmall
            />
          ))}
        </div>
      </div>
    </section>
  );
}
