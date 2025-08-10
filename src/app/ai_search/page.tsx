"use client";
import { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import OtherResultsSlider from '@/components/OtherResultsSlider';

type Message = {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
};

function cleanText(text: string) {
  return text
    .replace(/\*\*/g, "") // usuń pogrubienia
    .replace(/^>\s?/gm, "") // usuń znaki cytatu
    .replace(/^- /gm, "") // usuń myślniki na początku linii
    .replace(/\\n|\\r/g, "\n") // usuń backslashe typu \n
    .replace(/\n{2,}/g, "\n\n") // usuń nadmiar \n
    .trim();
}

function formatAiMessage(text: string | string[]) {
  const raw = Array.isArray(text) ? text.join("\n") : text;
  const cleaned = cleanText(raw);

  const sections = cleaned.split(/\n?\d\.\s+\*\*/g);
  const titles = cleaned.match(/\n?\d\.\s+\*\*(.*?)\*\*/g) ?? [];

  if (sections.length <= 1 || titles.length === 0) {
    return (
      <p className="whitespace-pre-wrap text-white leading-relaxed">
        {cleaned}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-white text-sm leading-relaxed">
      {sections.slice(1).map((section, i) => (
        <div key={i} className="space-y-2">
          <h3 className="font-semibold text-white">
            {titles[i]
              ?.replace(/\n?\d\.\s+\*\*/, "")
              .replace(/\*\*/g, "")
              .trim()}
          </h3>
          <p className="whitespace-pre-wrap text-gray-200">{section.trim()}</p>
        </div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherResults, setOtherResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim().length < 10) {
      setError("Proszę wprowadzić przynajmniej 10 znaków.");
      return;
    }

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setError(null);
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: query, timestamp },
    ]);

    try {
      const res = await fetch("http://127.0.0.2:8001/find_real_estate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("Błąd połączenia z AI service");

      const data = await res.json();
      const responseText =
        data?.data?.selling_strategy || "Brak odpowiedzi od AI.";
      setOtherResults(data?.data?.other_results || []);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: responseText, timestamp },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ Wystąpił błąd podczas przetwarzania zapytania.",
          timestamp,
        },
      ]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex flex-col flex-1 overflow-y-auto px-4 pb-4">
      {/* Wiadomości */}
      <div className="flex flex-col gap-4 flex-grow pt-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-end gap-2 max-w-[80%]">
              {msg.sender === "ai" && <span className="text-2xl">🤖</span>}

              <div
                className={`px-4 py-3 rounded-xl text-sm whitespace-pre-line shadow-sm relative ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white self-end rounded-br-none"
                    : "bg-[#2a2a2a] text-white self-start rounded-bl-none"
                }`}
              >
                {msg.sender === "ai"
                  ? formatAiMessage(msg.text)
                  : msg.text}
                <span className="block text-[10px] text-gray-400 text-right mt-1">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === "user" && <span className="text-2xl">🧑</span>}
            </div>
          </div>
        ))}
        {loading && (
          <p className="text-sm text-gray-500">AI pisze odpowiedź...</p>
        )}
        <div ref={scrollRef} />
      </div>
      {otherResults?.length > 0 && (
        <OtherResultsSlider results={otherResults} />
      )}
      {/* Pole wiadomości */}
      <form
        onSubmit={handleSearch}
        className="sticky bottom-0 mt-4 bg-[#1e1e1e] pt-4"
      >
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Opisz czego szukasz..."
            rows={1}
            className="w-full bg-[#1e1e1e] text-white placeholder-gray-400 text-sm rounded-2xl pr-12 py-3 px-4 resize-none shadow-sm border border-[#333] focus:outline-none"
            style={{ minHeight: "44px", maxHeight: "200px" }}
          />
          <button
            type="submit"
            className="absolute right-3 bottom-2 text-white p-1"
          >
            <CiSearch size={24} />
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </main>
  );
}
