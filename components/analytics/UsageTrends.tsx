import { BarChart3, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';
import { getUsageTrendsData } from '@/app/actions';

const UsageTrends = ({ data }: { data?: any[] }) => {
    const [chartData, setChartData] = useState(data || []);
    const [period, setPeriod] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setChartData(data);
        }
    }, [data]);

    const handlePeriodChange = async (newPeriod: 'Daily' | 'Weekly' | 'Monthly') => {
        if (newPeriod === period) return;
        setPeriod(newPeriod);
        setLoading(true);
        try {
            const newData = await getUsageTrendsData(newPeriod);
            setChartData(newData);
        } catch (error) {
            console.error('Failed to update trends:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border h-full">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-gray-900 font-bold">Usage Trends</h3>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    {(['Daily', 'Weekly', 'Monthly'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => handlePeriodChange(p)}
                            disabled={loading}
                            className={`px-4 py-1 text-xs font-medium rounded-md transition-all ${period === p
                                ? 'bg-white shadow-sm text-gray-800'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[200px] w-full relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
                            dy={10}
                        />
                        <AxisY
                            hide
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar
                            dataKey="value"
                            fill="#3B82F6"
                            radius={[4, 4, 4, 4]}
                            barSize={period === 'Daily' ? 30 : 20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Simple Y Axis stub if needed or rely on default
const AxisY = (props: any) => <YAxis {...props} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />

export default UsageTrends;
