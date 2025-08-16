'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { MedianPoint } from '@/components/MedianPricePerM2Chart';
import type { HistogramBin } from '@/components/PricePerM2Histogram';
import type { ScatterPoint } from '@/components/PriceVsAreaScatter';

const API_BASE = 'http://127.0.0.1:8000'; 

type State<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

// ——— helpers ———
function buildQuery(params: Record<string, any>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

async function fetchJSON<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ——— 1) Mediana zł/m² w czasie ———
export function useMedianPricePerM2(params?: {
  start_date?: string; // 'YYYY-MM-DD'
  end_date?: string;   // 'YYYY-MM-DD'
}): State<MedianPoint[]> {
  const [data, setData] = useState<MedianPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trigger = useRef(0);

  const url = useMemo(() => {
    const q = buildQuery(params ?? {});
    return `${API_BASE}/median_price_per_m2${q}`;
  }, [params?.start_date, params?.end_date]);

  const refresh = () => { trigger.current++; setError(null); setLoading(true); };

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    fetchJSON<{ status: string; median_price_per_m2: MedianPoint[] }>(url, ac.signal)
      .then(j => setData(j?.median_price_per_m2 ?? []))
      .catch(e => { if (e.name !== 'AbortError') setError(String(e)); })
      .finally(() => setLoading(false));
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, trigger.current]);

  return { data, loading, error, refresh };
}

// ——— 2) Histogram cen za m² ———
export function usePricePerM2Histogram(params?: {
  start_date?: string;
  end_date?: string;
  bin?: number; // jeśli dodasz na backendzie
}): State<HistogramBin[]> {
  const [data, setData] = useState<HistogramBin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trigger = useRef(0);

  const url = useMemo(() => {
    const q = buildQuery(params ?? {});
    return `${API_BASE}/price_distribution_per_m2${q}`;
  }, [params?.start_date, params?.end_date, params?.bin]);

  const refresh = () => { trigger.current++; setError(null); setLoading(true); };

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    fetchJSON<{ status: string; price_distribution_per_m2: HistogramBin[] }>(url, ac.signal)
      .then(j => setData(j?.price_distribution_per_m2 ?? []))
      .catch(e => { if (e.name !== 'AbortError') setError(String(e)); })
      .finally(() => setLoading(false));
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, trigger.current]);

  return { data, loading, error, refresh };
}

// ——— 3) Scatter: cena vs metraż ———
export function usePriceVsArea(params?: {
  start_date?: string;
  end_date?: string;
  sample_modulo?: number; // np. 10
  top_n?: number;         // np. 500
}): State<ScatterPoint[]> {
  const [data, setData] = useState<ScatterPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trigger = useRef(0);

  const url = useMemo(() => {
    const q = buildQuery(params ?? {});
    return `${API_BASE}/area_dependency_on_price_per_m2${q}`;
  }, [params?.start_date, params?.end_date, params?.sample_modulo, params?.top_n]);

  const refresh = () => { trigger.current++; setError(null); setLoading(true); };

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    fetchJSON<{ status: string; area_dependency_on_price_per_m2: any[] }>(url, ac.signal)
      .then(j => {
        const arr = j?.area_dependency_on_price_per_m2 ?? [];
        // normalizacja typów (Decimal/Date → number/string)
        const norm: ScatterPoint[] = arr.map((r: any) => ({
          price: Number(r.price),
          area: Number(r.area),
          rooms: typeof r.rooms === 'string' && /^\d+$/.test(r.rooms) ? Number(r.rooms) : r.rooms,
          pricePerM2: Number(r.pricePerM2),
          createdAt: r.createdAt, // ISO lub epoch – Date w komponencie już to ogarnie
        }));
        setData(norm);
      })
      .catch(e => { if (e.name !== 'AbortError') setError(String(e)); })
      .finally(() => setLoading(false));
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, trigger.current]);

  return { data, loading, error, refresh };
}
