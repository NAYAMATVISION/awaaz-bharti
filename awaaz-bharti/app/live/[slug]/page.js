import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getImageUrl } from "../../../lib/utils";

async function getStory(slug) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${base}/api/live-stories/slug/${slug}`, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getStory(slug);
  return {
    title: data ? `${data.story.title} | Awaz Bharti Live` : "Live Story | Awaz Bharti",
  };
}

export default async function LiveStoryPage({ params }) {
  const { slug } = await params;
  const data = await getStory(slug);
  if (!data) notFound();

  const { story, entries } = data;
  const isLive = story.status === "live";

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-[800px] mx-auto px-4 py-6 sm:py-10">
        {/* Story Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {story.coverImage && (
            <div className="relative aspect-video w-full">
              <Image
                src={getImageUrl(story.coverImage)}
                alt={story.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}
          <div className="p-5 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              {isLive ? (
                <span className="flex items-center gap-1.5 bg-red-700 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Live
                </span>
              ) : (
                <span className="bg-slate-200 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Coverage Ended
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3">
              {story.title}
            </h1>
            {story.description && (
              <p className="text-slate-600 leading-relaxed border-l-4 border-red-700 pl-4">
                {story.description}
              </p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-4 pb-2 border-b-[3px] border-red-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-700 rounded-full animate-pulse" />
          <h2 className="text-lg font-black text-gray-900">Live Updates</h2>
          <span className="ml-auto text-xs text-slate-400 font-bold">{entries.length} updates</span>
        </div>

        {entries.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-gray-100 shadow-sm">
            <p className="text-slate-400 font-bold">No updates yet. Check back soon.</p>
          </div>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-4">
              {entries.map((entry, i) => {
                const time = new Date(entry.timestamp).toLocaleTimeString("en-IN", {
                  hour: "numeric", minute: "2-digit", hour12: true,
                });
                const date = new Date(entry.timestamp).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                });
                return (
                  <div key={entry._id} className="relative">
                    <div
                      className={`absolute -left-6 top-4 w-3 h-3 rounded-full border-2 border-red-700 z-10 ${
                        i === 0 ? "bg-red-700 shadow-[0_0_0_4px_rgba(215,44,22,.15)]" : "bg-white"
                      }`}
                    />
                    <div className={`bg-white rounded-xl border p-4 sm:p-5 shadow-sm ${i === 0 ? "border-red-200" : "border-gray-100"}`}>
                      <span className="text-[11px] font-black text-red-700 uppercase tracking-widest block mb-2">
                        {time} · {date}
                      </span>
                      <h3 className="text-[15px] font-extrabold text-gray-900 leading-snug mb-3">
                        {entry.headline}
                      </h3>
                      <div
                        className="prose prose-sm max-w-none text-gray-700
                          prose-a:text-red-700 prose-img:rounded-lg
                          [&_iframe]:w-full [&_iframe]:rounded-lg"
                        dangerouslySetInnerHTML={{ __html: entry.content }}
                      />
                      {(entry.author || entry.createdBy?.name) && (
                        <p className="mt-3 text-[11px] text-slate-400 font-bold border-t border-slate-50 pt-2">
                          — {entry.author || entry.createdBy?.name}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
