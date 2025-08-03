import React from "react";
export default function Home() {

  return (
    <div className="font-mono min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="flex flex-col flex-grow items-center justify-center p-6">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-4xl text-gray-800 ">Cloud<span className="text-blue-600">7</span></h1>
          <p className="text-gray-600 mt-2 text-lg max-w-xl ">
            Twój inteligentny partner w świecie nieruchomości - od analizy rynku po wyszukiwanie idealnych ofert, AI zmienia sposób, w jaki agencje pracują z klientami.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <a href="/search" className="px-6 py-3 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition">
            Szukaj nieruchomości
          </a>
          <a href="/about" className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 shadow-sm hover:bg-gray-100 transition">
           Dowiedz się więcej
          </a>
        </div>
      </main>
    </div>
  );
}
