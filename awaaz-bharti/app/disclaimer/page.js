import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = { title: "Disclaimer | Awaz Bharti" };

export default function DisclaimerPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 py-14">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Disclaimer</h1>
        <div className="w-16 h-1 bg-red-700 rounded mb-8" />
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-5 text-gray-600 leading-relaxed text-sm">
          <p>Last updated: January 2026</p>
          <p>The information provided on Awaz Bharti is for general informational purposes only. While we strive to keep content accurate and up to date, we make no representations or warranties of any kind about the completeness, accuracy, or reliability of the information.</p>
          <p>News articles reflect the situation at the time of publication. Awaz Bharti is not responsible for any errors, omissions, or outcomes resulting from the use of this information.</p>
          <p>Opinions expressed in articles are those of the respective authors and do not necessarily represent the views of Awaz Bharti as an organization.</p>
          <p>For corrections or concerns, please contact: editorial@AwazBharti.in</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
