import Image from "next/image";
import Badge from "./Badge";
import Link from "next/link";
import { getImageUrl } from "../../lib/utils";

export default function HeroSection({ featured }) {
  return (
    <section className="py-4 pb-2">
      <Link
        href={`/article/${featured.id}`}
        target="_blank"
        className="relative rounded-xl overflow-hidden cursor-pointer group min-h-[420px] block"
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-7 pt-12 text-white">
          <Badge label={`⚡ ${featured.badge}`} type={featured.badgeType} />
          <h2 className="text-2xl font-black leading-snug mt-3 tracking-tight">{featured.title}</h2>
          {featured.description && (
            <p className="text-sm opacity-75 leading-relaxed mt-2.5">{featured.description}</p>
          )}
        </div>
      </Link>
    </section>
  );
}
