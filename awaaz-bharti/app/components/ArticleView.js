import Navbar from "./Navbar";
import Footer from "./Footer";
import TextToSpeech from "./TextToSpeech";
import Image from "next/image";
import { getImageUrl } from "../../lib/utils";

export default function ArticleView({ article }) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-[800px] mx-auto px-4 py-6 sm:py-10">
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-10">
          {/* Category Badge */}
          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase mb-4">
            {article.category}
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4 sm:mb-6">
            {article.title}
          </h1>

          {/* Author and Date */}
          <div className="flex items-center gap-4 border-y border-gray-100 py-4 mb-6">
            <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-white font-bold">
              {article.author?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{article.author?.name || "Awaaz Bharti Correspondent"}</p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </div>

          {/* Text to Speech Component */}
          <TextToSpeech text={article.content} />

          {/* Featured Image */}
          {article.image && (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-8">
              <Image 
                src={getImageUrl(article.image)} 
                alt={article.title} 
                width={1200}
                height={675}
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
