// src/components/OtherResultsSlider.tsx
'use client';

import React from 'react';

type RawResult = {
  id?: number | string;
  score?: number;
  payload?: { text?: string };
};

type Offer = {
  id: string;
  url?: string;
  price?: number;
  area?: number;
  address?: string;
};

const URL_RE = /Url ogłoszenia:\s*(https?:\/\/\S+)/i;
const PRICE_RE = /(?:^|\s)Cena:\s*([0-9]+(?:[.,][0-9]+)?)/i; // nie łapie "Cena za metr kwadratowy"
const AREA_RE = /Powierzchnia:\s*([0-9]+(?:[.,][0-9]{1,2})?)/i;
const ADDRESS_RE =
  /Adres:\s*([\s\S]*?)(?:\s+(?:Opis:|Liczba pokoi:|Piętro:|Stan budynku:|Dostępne od:|Dodatkowe informacje:|Rodzaj oferty:)|$)/i;


function parseNumber(s?: string) {
  if (!s) return undefined;
  const normalized = s.replace(/\s/g, '').replace(',', '.');
  const v = parseFloat(normalized);
  return Number.isFinite(v) ? v : undefined;
}

function parseOfferText(text: string, id: string): Offer {
  const url = text.match(URL_RE)?.[1]?.trim();
  const price = parseNumber(text.match(PRICE_RE)?.[1]);
  const area = parseNumber(text.match(AREA_RE)?.[1]);
  const address = text.match(ADDRESS_RE)?.[1]?.trim();
  return { id, url, price, area, address };
}

function formatPrice(n?: number) {
  if (typeof n !== 'number') return '—';
  return new Intl.NumberFormat('pl-PL').format(n) + ' zł';
}

function formatArea(n?: number) {
  if (typeof n !== 'number') return '—';
  return new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' m²';
}

export default function OtherResultsSlider({ results }: { results: RawResult[] }) {
  // Parsowanie + deduplikacja po URL (fallback: price-area-address)
  const offers: Offer[] = [];
  const seen = new Set<string>();

  for (const r of results || []) {
    const id = String(r?.id ?? crypto.randomUUID());
    const text = r?.payload?.text ?? '';
    if (!text) continue;

    const offer = parseOfferText(text, id);
    const key = offer.url || `${offer.price ?? ''}-${offer.area ?? ''}-${(offer.address ?? '').toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    offers.push(offer);
  }

  if (offers.length === 0) return null;

  return (
    <section aria-label="Inne oferty" className="mt-6">
      <h3 className="text-sm font-semibold text-white mb-2">Inne dopasowane oferty</h3>

      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {offers.map((o) => (
          <article
            key={o.id}
            className="snap-center min-w-[280px] max-w-[340px] bg-[#1e1e1e] border border-[#333] rounded-xl p-4 shadow"
          >
            <div className="space-y-2 text-sm text-white">
              <div>
                <div className="text-xs text-gray-400">URL ogłoszenia</div>
                {o.url ? (
                  <a
                    href={o.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline break-all"
                    title={o.url}
                  >
                    {o.url}
                  </a>
                ) : (
                  <span>—</span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Cena</span>
                <span className="font-medium">{formatPrice(o.price)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Powierzchnia</span>
                <span className="font-medium">{formatArea(o.area)}</span>
              </div>

              <div>
                <div className="text-xs text-gray-400">Adres</div>
                <p className="text-gray-200 whitespace-pre-line">
                  {o.address?.replace(/\s{2,}/g, ' ') || '—'}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
