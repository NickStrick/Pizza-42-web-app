"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MenuItem } from "@/data/menu";

export default function MenuAnalyticsChart({ menu }: { menu: MenuItem[] }) {
  const data = [...menu]
    .sort((a, b) => b.totalOrdered - a.totalOrdered)
    .map((item) => ({ name: item.name, orders: item.totalOrdered }));

  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 24, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" allowDecimals={false} stroke="#9ca3af" fontSize={12} />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            stroke="#9ca3af"
            fontSize={12}
          />
          <Tooltip />
          <Bar dataKey="orders" fill="#dc2626" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
