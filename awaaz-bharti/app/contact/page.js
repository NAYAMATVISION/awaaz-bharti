import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = { title: "Contact Us | Awaz Bharti" };

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 py-14">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Contact Us</h1>
        <div className="w-16 h-1 bg-red-700 rounded mb-8" />
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-6 text-gray-600 leading-relaxed">
          <div>
            <h2 className="text-lg font-black text-gray-900 mb-1">Editorial</h2>
            <p>For news tips, corrections, or editorial queries:</p>
            <p className="font-semibold text-gray-800 mt-1">editorial@AwazBharti.in</p>
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 mb-1">Advertising</h2>
            <p>For advertising and partnership inquiries:</p>
            <p className="font-semibold text-gray-800 mt-1">ads@AwazBharti.in</p>
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 mb-1">General</h2>
            <p>For all other queries:</p>
            <p className="font-semibold text-gray-800 mt-1">hello@AwazBharti.in</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
