// components/dashboard/bar-chart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type BarData = {
    month: string;
    total: number;
};

export default function MonthlyBarChart({ data, color }: { data: BarData[]; color: string }) {
    return (
        <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip
                        formatter={(value: any) => `Rp ${Number(value || 0).toLocaleString()}`}
                    />
                    <Bar dataKey="total" fill={color} radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}