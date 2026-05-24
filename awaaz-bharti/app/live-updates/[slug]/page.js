import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getImageUrl } from "../../../lib/utils";

async function getLiveUpdate(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${baseUrl}/api/live/slug/${slug}`, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

async function getRelatedUpdates(currentId) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${baseUrl}/api/live`, { cache: "no-store" });
    const data = await res.json();
    if (!data.success) return [];
    return data.data.filter((u) => u._id !== currentId).slice(0, 4);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const update = await getLiveUpdate(slug);
  return {
    title: update ? `${update.title} | Awaz Bharti Live` : "Live Update | Awaz Bharti",
  };
}

export default async function LiveUpdateDetailPage({ params }) {
  const { slug } = await params;
  const update = await getLiveUpdate(slug);

  if (!update) notFound();

  const related = await getRelatedUpdates(update._id);

  const formattedDate = new Date(update.timestamp).toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const formattedTime = new Date(update.timestamp).toLocaleTimeString("en-IN", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-[800px] mx-auto px-4 py-6 sm:py-10">
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-10">
          {/* Live badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-red-700 rounded-full animate-pulse" />
            <span className="text-xs font-black text-red-700 uppercase tracking-widest">Live Update</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
            {update.title}
          </h1>

          {update.excerpt && (
            <p className="text-lg text-slate-600 leading-relaxed mb-6 border-l-4 border-red-700 pl-4">
              {update.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 border-y border-gray-100 py-4 mb-6">
            <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-white font-bold shrink-0">
              {(update.author || update.createdBy?.name || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {update.author || update.createdBy?.name || "Awaaz Bharti Correspondent"}
              </p>
              <p className="text-xs text-gray-500">{formattedDate} · {formattedTime}</p>
            </div>
          </div>

          {/* Cover Image */}
          {update.coverImage && (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-8">
              <Image
                src={getImageUrl(update.coverImage)}
                alt={update.title}
                width={1200}
                height={675}
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Rich Content */}
          <div
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed
              prose-headings:font-black prose-headings:text-gray-900
              prose-a:text-red-700 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-red-700 prose-blockquote:text-slate-600
              prose-img:rounded-lg prose-img:shadow-md
              prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded
              [&_iframe]:w-full [&_iframe]:rounded-lg [&_.aspect-video]:relative [&_.aspect-video]:w-full"
            dangerouslySetInnerHTML={{ __html: update.content }}
          />
        </article>

        {/* Related Updates */}
        {related.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 pb-2 border-b-[3px] border-red-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-700 rounded-full animate-pulse" />
              <h2 className="text-lg font-black text-gray-900">Related Updates</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((item) => (
                <Link
                  key={item._id}
                  href={`/live-updates/${item.slug || item._id}`}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all group"
                >
                  {item.coverImage && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3">
                      <Image src={getImageUrl(item.coverImage)} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-red-700 uppercase block mb-1">
                    {new Date(item.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                  <h4 className="text-sm font-extrabold text-gray-900 leading-snug group-hover:text-red-700 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  {item.excerpt && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8">
          <Link href="/live-updates" className="text-sm font-bold text-red-700 hover:underline flex items-center gap-1">
            ← Back to All Live Updates
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
