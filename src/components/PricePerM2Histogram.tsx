// src/components/charts/PricePerM2Histogram.tsx
'use client';

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { useMemo } from 'react';

export type HistogramBin = { price_m2: number; offers_count: number };

export default function PricePerM2Histogram({ data }: { data: HistogramBin[] }) {
  const normalized = useMemo(() => (
    (data || []).slice().sort((a, b) => a.price_m2 - b.price_m2)
  ), [data]);

  const fmtInt = (n?: number) => typeof n === 'number' ? new Intl.NumberFormat('pl-PL').format(n) : '—';

  return (
    <div className="w-full h-72 bg-[#1e1e1e] rounded-xl p-4 border border-[#333]">
      <h3 className="text-sm text-white font-semibold mb-2">Rozkład cen za m²</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={normalized} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price_m2" tick={{ fontSize: 12 }} tickFormatter={(v: number) => fmtInt(v)} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: any, name: string) => {
              if (name === 'offers_count') return [fmtInt(Number(value)), 'Liczba ofert'];
              return [value, name];
            }}
            labelFormatter={(v: any) => `Przedział: ${fmtInt(Number(v))}–${fmtInt(Number(v) + 999)} zł/m²`}
          />
          <Legend />
          <Bar dataKey="offers_count" name="Liczba ofert" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[11px] text-gray-400 mt-2">Oś X: początek przedziału (np. 15 000 → 15 000–15 999 zł/m²).</p>
    </div>
  );
}
