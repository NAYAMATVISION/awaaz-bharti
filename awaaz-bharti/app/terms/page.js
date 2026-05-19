import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = { title: "Terms of Use | Awaz Bharti" };

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 py-14">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Terms of Use</h1>
        <div className="w-16 h-1 bg-red-700 rounded mb-8" />
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-5 text-gray-600 leading-relaxed text-sm">
          <p>Last updated: January 2026</p>
          <p>By accessing Awaz Bharti, you agree to these terms. Please read them carefully.</p>
          <h2 className="text-base font-black text-gray-900">Use of Content</h2>
          <p>All content on this platform is the intellectual property of Awaz Bharti. You may not reproduce, distribute, or commercially exploit any content without prior written permission.</p>
          <h2 className="text-base font-black text-gray-900">User Conduct</h2>
          <p>You agree not to use this platform for any unlawful purpose, to spread misinformation, or to harass other users.</p>
          <h2 className="text-base font-black text-gray-900">Disclaimer</h2>
          <p>We strive for accuracy but do not guarantee the completeness of all information. News content reflects the situation at the time of publication.</p>
          <h2 className="text-base font-black text-gray-900">Contact</h2>
          <p>For terms-related queries: legal@AwazBharti.in</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
