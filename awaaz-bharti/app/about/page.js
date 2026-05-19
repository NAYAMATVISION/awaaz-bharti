import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = { title: "About Us | Awaz Bharti" };

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 py-14">
        <h1 className="text-4xl font-black text-gray-900 mb-4">About Us</h1>
        <div className="w-16 h-1 bg-red-700 rounded mb-8" />
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-5 text-gray-600 leading-relaxed">
          <p>
            <strong className="text-gray-900">Awaz Bharti</strong> is India&apos;s trusted digital news platform committed to delivering accurate, unbiased, and in-depth coverage of politics, business, technology, sports, and entertainment.
          </p>
          <p>
            Founded with the mission to give every Indian a credible voice in the news ecosystem, we combine experienced journalism with modern digital tools to bring you stories that matter — when they matter.
          </p>
          <p>
            Our team of reporters, editors, and field journalists work around the clock to ensure you stay informed with verified, real-time news from across the country and the world.
          </p>
          <p className="font-semibold text-gray-800">Your voice. Our commitment.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
