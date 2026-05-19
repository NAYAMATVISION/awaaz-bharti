import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = { title: "Advertise | Awaz Bharti" };

export default function AdvertisePage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 py-14">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Advertise With Us</h1>
        <div className="w-16 h-1 bg-red-700 rounded mb-8" />
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-5 text-gray-600 leading-relaxed">
          <p>
            Reach millions of engaged readers across India with targeted advertising on Awaz Bharti. We offer display ads, sponsored content, video placements, and custom brand partnerships.
          </p>
          <p>
            Our audience spans politics, business, technology, sports, and entertainment — giving your brand access to a diverse, high-intent readership.
          </p>
          <p>
            To discuss advertising opportunities, contact us at:{" "}
            <span className="font-semibold text-gray-800">ads@AwazBharti.in</span>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
