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

  const fmtInt = (n?: number) =>
    typeof n === 'number' ? new Intl.NumberFormat('pl-PL').format(n) : '—';

  return (
    <div className="w-full h-72 rounded-xl p-4 border border-[#222]">
      <h3 className="text-sm text-white font-semibold mb-2">Rozkład cen za m²</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={normalized} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <defs>
            <linearGradient id="neonBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff00ff" stopOpacity={1} />
              <stop offset="100%" stopColor="#00ffff" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#222" strokeDasharray="3 3" />
          <XAxis
            dataKey="price_m2"
            tick={{ fontSize: 12, fill: '#ccc' }}
            tickFormatter={(v: number) => fmtInt(v)}
          />
          <YAxis tick={{ fontSize: 12, fill: '#ccc' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e1e2f',
              border: '1px solid #444',
              color: '#fff'
            }}
            formatter={(value: any, name: string) => {
              if (name === 'offers_count')
                return [fmtInt(Number(value)), 'Liczba ofert'];
              return [value, name];
            }}
            labelFormatter={(v: any) =>
              `Przedział: ${fmtInt(Number(v))}–${fmtInt(Number(v) + 999)} zł/m²`
            }
          />
          <Legend wrapperStyle={{ color: '#fff' }} />
          <Bar dataKey="offers_count" name="Liczba ofert" fill="url(#neonBar)" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[11px] text-gray-400 mt-2">
        Oś X: początek przedziału (np. 15 000 → 15 000–15 999 zł/m²).
      </p>
    </div>
  );
}
