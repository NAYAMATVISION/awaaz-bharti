import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "../../lib/utils";

export const metadata = { title: "Live Updates | Awaz Bharti" };

async function getLiveUpdates() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${baseUrl}/api/live`, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export default async function LiveUpdatesPage() {
  const updates = await getLiveUpdates();

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-5 py-10">
        <div className="mb-6 pb-3 border-b-[3px] border-red-700 flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-700 rounded-full animate-pulse" />
          <h1 className="text-2xl font-black text-gray-900">Live Updates</h1>
        </div>

        {updates.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">📡</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No live updates right now</h2>
            <p className="text-gray-500">Check back soon for the latest updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {updates.map((item, i) => {
              const href = `/live-updates/${item.slug || item._id}`;
              return (
                <Link
                  key={item._id}
                  href={href}
                  className="bg-white rounded-xl shadow-sm border border-black/[.04] overflow-hidden hover:shadow-md hover:border-red-200 transition-all group flex flex-col"
                >
                  {item.coverImage ? (
                    <div className="relative w-full h-44 overflow-hidden">
                      <Image
                        src={getImageUrl(item.coverImage)}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {i === 0 && (
                        <span className="absolute top-3 left-3 bg-red-700 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Latest
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-20 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                      <span className="text-3xl">📡</span>
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-red-700 uppercase block mb-1.5">
                      {new Date(item.timestamp).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}
                      {" · "}
                      {new Date(item.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <h4 className="text-[14px] font-extrabold leading-snug text-gray-900 mb-2 group-hover:text-red-700 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    {item.excerpt && (
                      <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 flex-1">{item.excerpt}</p>
                    )}
                    <span className="mt-3 text-[11px] font-black text-red-700 uppercase tracking-widest group-hover:gap-2 flex items-center gap-1 transition-all">
                      Read More →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
