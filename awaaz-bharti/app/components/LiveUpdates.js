"use client";

export default function LiveUpdates({ updates }) {
  return (
    <section className="bg-white rounded-xl p-4 shadow-sm border border-black/[.04]">
      {/* Header */}
      <div className="mb-3 pb-2 border-b-[3px] border-red-700">
        <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-700 rounded-full animate-pulse" />
          Live Updates
        </h2>
      </div>

      {/* Timeline */}
      {updates.length === 0 ? (
        <p className="text-[12px] text-slate-400 italic py-3">No live updates right now.</p>
      ) : (
        <div className="relative pl-5">
          <div className="absolute left-[5px] top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-3">
            {updates.map((item, i) => (
              <div key={i} className="relative">
                <div
                  className={`absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-red-700 z-10 ${
                    i === 0 ? "bg-red-700 shadow-[0_0_0_3px_rgba(215,44,22,.15)]" : "bg-white"
                  }`}
                />
                <div className={`rounded-lg p-2.5 ${i === 0 ? "bg-red-50 border border-red-200" : ""}`}>
                  <span className="text-[10px] font-bold text-red-700 uppercase block mb-0.5">{item.time}</span>
                  <h4 className="text-[13px] font-extrabold leading-snug text-gray-900 mb-0.5">{item.headline}</h4>
                  <p className="text-[12px] text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
