// przykładowo: src/app/search/page.tsx (fragment)
'use client';
import MedianPricePerM2Chart from '@/components/MedianPricePerM2Chart';
import PricePerM2Histogram from '@/components/PricePerM2Histogram';
import PriceVsAreaScatter from '@/components/PriceVsAreaScatter';
import { useMedianPricePerM2, usePricePerM2Histogram, usePriceVsArea } from '@/hooks/useChartsData';

export default function SearchPage() {
  const { data: median, loading: mL, error: mE } = useMedianPricePerM2({ start_date: '2025-06-01', end_date: '2025-08-11' });
  const { data: hist, loading: hL, error: hE } = usePricePerM2Histogram({ start_date: '2025-06-01', end_date: '2025-08-11' });
  const { data: scat, loading: sL, error: sE } = usePriceVsArea({ start_date: '2025-06-01', end_date: '2025-08-11', sample_modulo: 10, top_n: 500 });

  return (
    <main className="flex flex-col flex-1 overflow-y-auto px-4 pb-4">
      <div className="mt-6 space-y-6">
        {mE ? <div className="text-red-400 text-sm">Błąd mediany: {mE}</div> : <MedianPricePerM2Chart data={median} />}
        {hE ? <div className="text-red-400 text-sm">Błąd histogramu: {hE}</div> : <PricePerM2Histogram data={hist} />}
        {sE ? <div className="text-red-400 text-sm">Błąd scattera: {sE}</div> : <PriceVsAreaScatter data={scat} />}
        {(mL || hL || sL) && <div className="text-gray-400 text-sm">Ładowanie wykresów…</div>}
      </div>
    </main>
  );
}
