import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = { title: "Careers | Awaz Bharti" };

export default function CareersPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 py-14">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Careers</h1>
        <div className="w-16 h-1 bg-red-700 rounded mb-8" />
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-5 text-gray-600 leading-relaxed">
          <p>
            We are always looking for passionate journalists, editors, video producers, and digital media professionals to join the Awaz Bharti family.
          </p>
          <p>
            If you believe in honest, impactful journalism and want to be part of a growing newsroom, we&apos;d love to hear from you.
          </p>
          <p>
            Send your resume and portfolio to:{" "}
            <span className="font-semibold text-gray-800">careers@AwazBharti.in</span>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
