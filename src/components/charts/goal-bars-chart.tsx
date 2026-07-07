"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Series = {
  dataKey: string;
  label: string;
  color: string;
};

type GoalBarsChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: Series[];
  height?: number;
};

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function ChartTooltip({
  active,
  payload,
  label,
  labels,
}: {
  active?: boolean;
  payload?: { name: string; value: number; dataKey: string }[];
  label?: string;
  labels: Record<string, string>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label ? <strong>{label}</strong> : null}
      {payload.map((entry) => (
        <span key={entry.dataKey}>
          {labels[entry.dataKey] ?? entry.name}: {brl.format(Number(entry.value))}
        </span>
      ))}
    </div>
  );
}

export function GoalBarsChart({ data, xKey, series, height = 240 }: GoalBarsChartProps) {
  const labels = Object.fromEntries(series.map((item) => [item.dataKey, item.label]));

  return (
    <div className="chart-block">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: "#7a7a7a", fontSize: 12 }} />
          <YAxis hide />
          <Tooltip content={<ChartTooltip labels={labels} />} />
          {series.map((item) => (
            <Bar dataKey={item.dataKey} fill={item.color} key={item.dataKey} radius={[6, 6, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        {series.map((item) => (
          <span className="chart-legend-item" key={item.dataKey}>
            <span className="dot" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
