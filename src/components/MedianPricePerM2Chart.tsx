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
    <div className="w-full h-72 rounded-xl p-4 border border-[#222]">
      <h3 className="text-sm text-white font-semibold mb-2">Mediana ceny za m² w czasie</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={normalized} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          {/* Gradient neonowy */}
          <defs>
            <linearGradient id="neonLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff00ff" stopOpacity={1} />
              <stop offset="100%" stopColor="#00ffff" stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#222" strokeDasharray="3 3" />
          <XAxis dataKey="dateLabel" tick={{ fontSize: 12, fill: '#ccc' }} />
          <YAxis tick={{ fontSize: 12, fill: '#ccc' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e1e2f', border: '1px solid #444', color: '#fff' }}
            formatter={(value: any, name: string) => {
              if (name === 'median_price_per_m2') return [`${fmtInt(Math.round(Number(value)))} zł/m²`, 'Mediana zł/m²'];
              if (name === 'listings_count') return [fmtInt(Number(value)), 'Liczba ofert'];
              return [value, name];
            }}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Legend wrapperStyle={{ color: '#fff' }} />
          <Line
            type="monotone"
            dataKey="median_price_per_m2"
            name="Mediana zł/m²"
            stroke="url(#neonLine)"
            strokeWidth={3}
            dot={{ r: 4, fill: '#ff00ff', stroke: '#00ffff', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#00ffff', stroke: '#ff00ff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[11px] text-gray-400 mt-2">Najedź na punkt, by zobaczyć też liczbę ofert.</p>
    </div>
  );
}
