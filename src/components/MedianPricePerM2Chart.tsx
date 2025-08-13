// src/components/charts/MedianPricePerM2Chart.tsx
'use client';

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { useMemo } from 'react';

export type MedianPoint = { date: string; median_price_per_m2: number; listings_count: number };

export default function MedianPricePerM2Chart({ data }: { data: MedianPoint[] }) {
  const normalized = useMemo(() => (
    (data || []).map(d => ({
      ...d,
      dateLabel: new Date(d.date).toISOString().slice(0, 10),
    }))
  ), [data]);

  const fmtInt = (n?: number) => typeof n === 'number' ? new Intl.NumberFormat('pl-PL').format(n) : '—';

  return (
    <div className="w-full h-72 bg-[#1e1e1e] rounded-xl p-4 border border-[#333]">
      <h3 className="text-sm text-white font-semibold mb-2">Mediana ceny za m² w czasie</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={normalized} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dateLabel" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: any, name: string, p: any) => {
              if (name === 'median_price_per_m2') return [`${fmtInt(Math.round(Number(value)))} zł/m²`, 'Mediana zł/m²'];
              if (name === 'listings_count') return [fmtInt(Number(value)), 'Liczba ofert'];
              return [value, name];
            }}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Legend />
          <Line type="monotone" dataKey="median_price_per_m2" name="Mediana zł/m²" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[11px] text-gray-400 mt-2">Najedź na punkt, by zobaczyć też liczbę ofert.</p>
    </div>
  );
}
