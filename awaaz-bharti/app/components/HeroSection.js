import Image from "next/image";
import Badge from "./Badge";
import Link from "next/link";
import { getImageUrl, getArticleUrl } from "../../lib/utils";

export default function HeroSection({ featured }) {
  return (
    <section className="py-3 pb-2">
      <Link
        href={featured.url || `/article/${featured.id}`}
        target="_blank"
        className="relative rounded-xl overflow-hidden cursor-pointer group min-h-[200px] sm:min-h-[300px] md:min-h-[420px] block"
      >
        <Image
          src={getImageUrl(featured.image)}
          alt={featured.title}
          width={1200}
          height={675}
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6 md:p-7 text-white">
          <Badge label={`⚡ ${featured.badge}`} type={featured.badgeType} />
          <h2 className="text-base sm:text-xl md:text-2xl font-black leading-snug mt-2 tracking-tight">{featured.title}</h2>
          {featured.description && (
            <p className="hidden sm:block text-xs sm:text-sm opacity-75 leading-relaxed mt-1.5">{featured.description}</p>
          )}
        </div>
      </Link>
    </section>
  );
}
