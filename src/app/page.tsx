import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-[#1e1e1e] text-white">
      {/* Main Content */}
      <main className="flex flex-col flex-1 items-center justify-center px-4 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Cloud<span className="text-blue-600">7</span>
          </h1>
          <p className="mt-4 text-lg max-w-xl text-gray-300">
            Twój inteligentny partner w świecie nieruchomości - od analizy rynku po wyszukiwanie idealnych ofert. AI zmienia sposób, w jaki agencje pracują z klientami.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/search"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition"
          >
            Szukaj nieruchomości
          </a>
          <a
            href="/about"
            className="px-6 py-3 rounded-xl border border-gray-500 text-white shadow-sm hover:bg-gray-800 transition"
          >
            Dowiedz się więcej
          </a>
        </div>
      </main>
    </div>
  );
}
