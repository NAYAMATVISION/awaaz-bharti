import Image from "next/image";
import Badge from "./Badge";
import Link from "next/link";
import { getImageUrl } from "../../lib/utils";

/**
 * NewsCard — Reusable news card component
 *
 * @param {Object} props
 * @param {string} props.id - Unique article ID
 * @param {string} props.title - Headline text
 * @param {string} props.image - Image path (from /public)
 * @param {string} props.category - Badge label text
 * @param {string} props.categoryType - Badge color key (breaking, politics, etc.)
 * @param {string} [props.time] - Time stamp
 * @param {string} [props.author] - Author name
 * @param {string} [props.description] - Short description
 * @param {boolean} [props.isSmall=false] - Small horizontal card mode
 * @param {boolean} [props.isFeatured=false] - Large overlay-style featured card
 */
export default function NewsCard({
  id,
  title,
  image,
  category,
  categoryType = "breaking",
  time,
  author,
  description,
  isSmall = false,
  isFeatured = false,
  url,
}) {
  const cardContent = (
    <>
      {/* ===== FEATURED CARD (Large, image with overlay) ===== */}
      {isFeatured ? (
        <div className="relative rounded-xl overflow-hidden group min-h-[340px] shadow-sm hover:shadow-md h-full transition-all duration-300">
          <Image
            src={getImageUrl(image)}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-10 text-white">
            {category && <Badge label={category} type={categoryType} />}
            <h3 className="text-lg font-black leading-snug mt-2.5 tracking-tight">{title}</h3>
            {(author || time) && (
              <p className="text-xs opacity-65 mt-2">
                {author && `By ${author}`}
                {author && time && " · "}
                {time}
              </p>
            )}
          </div>
        </div>
      ) : isSmall ? (
        /* ===== SMALL HORIZONTAL CARD ===== */
        <div className="flex gap-3 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-black/[.04] transition-all duration-300 group h-full">
          <div className="relative w-[90px] sm:w-[110px] h-[70px] sm:h-[80px] shrink-0 overflow-hidden">
            <Image
              src={getImageUrl(image)}
              alt={title}
              fill
              className="object-cover transition-transform duration-400 group-hover:scale-[1.06]"
            />
          </div>
          <div className="py-2.5 pr-3 flex flex-col justify-center">
            <h4 className="text-[13.5px] font-extrabold leading-snug text-gray-900 line-clamp-2">{title}</h4>
            {time && <span className="text-[11px] text-gray-400 mt-1 opacity-85">{time}</span>}
          </div>
        </div>
      ) : (
        /* ===== DEFAULT CARD (Hero sidebar style) ===== */
        <div className="flex gap-3 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-black/[.04] transition-all duration-300 group flex-1 h-full">
          <div className="relative w-[100px] sm:w-[130px] h-[80px] sm:h-[100px] shrink-0 overflow-hidden">
            <Image
              src={getImageUrl(image)}
              alt={title}
              fill
              className="object-cover transition-transform duration-400 group-hover:scale-[1.05]"
            />
          </div>
          <div className="py-2.5 pr-3 flex flex-col justify-center">
            {category && (
              <div className="mb-1.5">
                <Badge label={category} type={categoryType} />
              </div>
            )}
            <h3 className="text-sm font-extrabold leading-snug text-gray-900 line-clamp-3">{title}</h3>
            {time && <span className="text-[11px] text-gray-400 mt-1">{time}</span>}
          </div>
        </div>
      )}
    </>
  );

  return (
    <Link 
      href={url || `/article/${id}`} 
      target="_blank" 
      className="block cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]"
    >
      {cardContent}
    </Link>
  );
}
