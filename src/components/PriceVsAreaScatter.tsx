// src/components/charts/PriceVsAreaScatter.tsx
'use client';

import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { useMemo } from 'react';

export type ScatterPoint = {
  price: number;
  area: number;
  rooms?: string | number;
  pricePerM2?: number;
  createdAt?: string | Date;
};

export default function PriceVsAreaScatter({ data }: { data: ScatterPoint[] }) {
  const normalized = useMemo(() => (
    (data || [])
      .filter(p => Number(p.price) > 0 && Number(p.area) > 0)
      .map(p => ({
        price: Number(p.price),
        area: Number(p.area),
        rooms: typeof p.rooms === 'string' && /^\d+$/.test(p.rooms) ? Number(p.rooms) : p.rooms,
        pricePerM2: p.pricePerM2 !== undefined ? Number(p.pricePerM2) : (Number(p.price) / Number(p.area)),
        createdAt: p.createdAt ? new Date(p.createdAt as any).toISOString() : undefined,
      }))
  ), [data]);

  const fmtInt = (n?: number) => typeof n === 'number' ? new Intl.NumberFormat('pl-PL').format(n) : '—';
  const fmtMoney = (n?: number) => typeof n === 'number' ? `${fmtInt(Math.round(n))} zł` : '—';
  const fmtPpm2 = (n?: number) => typeof n === 'number' ? `${fmtInt(Math.round(n))} zł/m²` : '—';

  return (
    <div className="w-full h-80 bg-[#1e1e1e] rounded-xl p-4 border border-[#333]">
      <h3 className="text-sm text-white font-semibold mb-2">Zależność ceny od metrażu</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="area" name="Powierzchnia" unit=" m²" tick={{ fontSize: 12 }} />
          <YAxis type="number" dataKey="price" name="Cena" unit=" zł" tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: any, name: string) => {
              if (name === 'price') return [fmtMoney(Number(value)), 'Cena'];
              if (name === 'area') return [`${value} m²`, 'Powierzchnia'];
              if (name === 'pricePerM2') return [fmtPpm2(Number(value)), 'Cena za m²'];
              if (name === 'rooms') return [String(value ?? '—'), 'Pokoje'];
              return [value, name];
            }}
            labelFormatter={(_v, payload: any) => {
              const pt = (payload && payload[0] && payload[0].payload) || {};
              const d = pt.createdAt ? new Date(pt.createdAt).toLocaleString('pl-PL') : '—';
              return `Data: ${d}`;
            }}
          />
          <Legend />
          <Scatter data={normalized} name="Oferty" />
        </ScatterChart>
      </ResponsiveContainer>
      <p className="text-[11px] text-gray-400 mt-2">Każdy punkt = oferta. Tooltip: pokoje, zł/m², data.</p>
    </div>
  );
}
