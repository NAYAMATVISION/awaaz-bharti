import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = { title: "Privacy Policy | Awaz Bharti" };

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 py-14">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Privacy Policy</h1>
        <div className="w-16 h-1 bg-red-700 rounded mb-8" />
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-5 text-gray-600 leading-relaxed text-sm">
          <p>Last updated: January 2026</p>
          <p>Awaz Bharti (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you visit our website.</p>
          <h2 className="text-base font-black text-gray-900">Information We Collect</h2>
          <p>We may collect your name, email address, and usage data when you register or interact with our platform. We do not sell your personal data to third parties.</p>
          <h2 className="text-base font-black text-gray-900">How We Use Your Information</h2>
          <p>Your information is used to provide and improve our services, send newsletters (with your consent), and ensure platform security.</p>
          <h2 className="text-base font-black text-gray-900">Contact</h2>
          <p>For privacy-related queries, contact us at privacy@AwazBharti.in</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
