"use client";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
      const res = await fetch(`http://127.0.0.2:8001/find_real_estate`,{
        method:"POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if(!res.ok){
        throw new Error("Fetching data from AI service failed /find_real_estate");
      }

      const data = await res.json();
      console.log("Odpowiedź AI:", data);

    }
    catch (error){
      console.error("Error:", error)
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <main className="font-mono min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-800 mb-4">
         <CiSearch/> Wyszukiwarka nieruchomości
      </h1>
      <p className="text-gray-600 text-lg mb-6 text-center max-w-xl">
        Opisz, czego szukasz - np.{" "}
        <i>“nowoczesne mieszkanie 3 pokoje w centrum Krakowa z balkonem”</i>.
      </p>

      {/* Formularz wyszukiwania */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col items-center gap-4 w-full"
      >
        <textarea
          placeholder="Opisz wymarzone mieszkanie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={10}
          className="w-2/5 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Szukaj
        </button>
      </form>
    </main>
  );
}
