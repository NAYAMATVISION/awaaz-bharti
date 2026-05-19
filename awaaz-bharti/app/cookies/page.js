import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = { title: "Cookie Policy | Awaz Bharti" };

export default function CookiesPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 py-14">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Cookie Policy</h1>
        <div className="w-16 h-1 bg-red-700 rounded mb-8" />
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-5 text-gray-600 leading-relaxed text-sm">
          <p>Last updated: January 2026</p>
          <p>Awaz Bharti uses cookies to improve your browsing experience, analyze site traffic, and personalize content.</p>
          <h2 className="text-base font-black text-gray-900">What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and understand how you use our platform.</p>
          <h2 className="text-base font-black text-gray-900">Types of Cookies We Use</h2>
          <p><strong>Essential cookies</strong> — required for the website to function properly.</p>
          <p><strong>Analytics cookies</strong> — help us understand visitor behavior to improve our service.</p>
          <h2 className="text-base font-black text-gray-900">Managing Cookies</h2>
          <p>You can control cookies through your browser settings. Disabling cookies may affect some features of the website.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
