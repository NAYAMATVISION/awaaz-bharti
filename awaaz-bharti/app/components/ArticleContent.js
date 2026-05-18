export default function ArticleContent({ content }) {
  return (
    <article 
      className="prose prose-lg max-w-none 
                 text-slate-700 leading-[1.8] 
                 [&>p]:mb-8 [&>p]:last:mb-0
                 [&>h3]:text-2xl [&>h3]:font-black [&>h3]:mt-12 [&>h3]:mb-6 [&>h3]:text-slate-900
                 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8
                 [&>ul>li]:mb-3
                 [&>strong]:font-bold [&>strong]:text-slate-900"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
