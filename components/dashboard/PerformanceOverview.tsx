
'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getPerformanceData } from '@/app/actions';

const PerformanceOverview = () => {
    const [range, setRange] = useState<'1D' | '7D' | '30D'>('7D');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const result = await getPerformanceData(range);
                setData(result);
            } catch (error) {
                console.error('Failed to load chart data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [range]);

    return (
        <div className="bg-white p-6 rounded-xl border h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-700 font-medium">Performance Overview</h3>
                <div className="flex gap-2">
                    {['1D', '7D', '30D'].map((time) => (
                        <button
                            key={time}
                            onClick={() => setRange(time as any)}
                            className={`px-3 py-1 text-xs border rounded transition-colors ${range === time
                                ? 'bg-blue-50 text-blue-600 border-blue-200 font-medium'
                                : 'hover:bg-gray-50 text-gray-600 border-gray-200'
                                }`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-[250px] w-full">
                {loading ? (
                    <div className="h-full flex items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-100">
                        <p className="text-sm text-gray-400">Loading chart data...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-full flex items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-100">
                        <p className="text-sm text-gray-400">No data available for this period</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#e5e7eb' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default PerformanceOverview;
