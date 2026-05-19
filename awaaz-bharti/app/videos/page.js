import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = { title: "Latest Videos | Awaz Bharti" };

const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
};

async function getVideos() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${baseUrl}/api/videos`, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-5 py-10">
        <div className="mb-6 pb-3 border-b-[3px] border-red-700 flex items-center gap-2">
          <h1 className="text-2xl font-black text-gray-900">📺 Latest Videos</h1>
        </div>

        {videos.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">📺</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No videos available</h2>
            <p className="text-gray-500">Check back soon for the latest video content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {videos.map((video) => {
              const youtubeId = extractYouTubeId(video.youtubeUrl);
              const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : null;
              return (
                <article
                  key={video._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-black/[.04] transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative aspect-video bg-slate-900/5">
                    {embedUrl ? (
                      <iframe
                        title={video.title}
                        src={embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500 text-xs font-bold">
                        Invalid YouTube URL
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h4 className="text-[13px] font-semibold leading-snug text-gray-900 line-clamp-2">{video.title}</h4>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                      {video.category && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-[0.08em] font-black">
                          {video.category}
                        </span>
                      )}
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
