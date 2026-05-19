import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
          <div className="bg-white rounded-xl shadow-sm border border-black/[.04] p-5 max-w-3xl">
            <div className="relative pl-5">
              <div className="absolute left-[5px] top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-4">
                {updates.map((item, i) => (
                  <div key={item._id} className="relative">
                    <div className={`absolute -left-5 top-2 w-2.5 h-2.5 rounded-full border-2 border-red-700 z-10 ${i === 0 ? "bg-red-700 shadow-[0_0_0_3px_rgba(215,44,22,.15)]" : "bg-white"}`} />
                    <div className={`rounded-lg p-3 ${i === 0 ? "bg-red-50 border border-red-200" : ""}`}>
                      <span className="text-[10px] font-bold text-red-700 uppercase block mb-0.5">
                        {new Date(item.timestamp).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}
                        {" · "}
                        {new Date(item.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <h4 className="text-[14px] font-extrabold leading-snug text-gray-900 mb-0.5">{item.title}</h4>
                      <p className="text-[13px] text-gray-600 leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
