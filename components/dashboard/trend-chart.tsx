// components/dashboard/trend-chart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type TrendData = {
    month: string;
    income: number;
    expense: number;
};

export default function TrendChart({ data }: { data: TrendData[] }) {
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                        tick={{ fontSize: 11 }}
                        tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                        formatter={(value: any) => `Rp ${Number(value || 0).toLocaleString()}`}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="income" name="Pemasukan" stroke="#0E8B9E" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="expense" name="Pengeluaran" stroke="#F0956B" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}