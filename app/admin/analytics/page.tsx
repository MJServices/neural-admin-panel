'use client';

import { useState, useEffect } from 'react';
import { Download, MessageSquare, Users, MoveRight, Clock } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import UsageTrends from '@/components/analytics/UsageTrends';
import TopQueries from '@/components/analytics/TopQueries';
import ResponseTimeBreakdown from '@/components/analytics/ResponseTimeBreakdown';
import UserSatisfaction from '@/components/analytics/UserSatisfaction';
import AnalyticsBackupGrid from '@/components/analytics/AnalyticsBackupGrid';
import { getAnalyticsData } from '@/app/actions';

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const analyticsData = await getAnalyticsData();
                setData(analyticsData);
            } catch (error) {
                console.error('Failed to load analytics', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading || !data) {
        return <div className="p-10 text-center">Loading analytics...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            {/* Stats Grid - Data specific to screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Interaction"
                    value={data.overview.totalInteraction.toLocaleString()}
                    change="+12% from last month"
                    trend="up" // green
                    icon={MessageSquare}
                    iconColor="bg-blue-50 text-blue-500"
                />
                <StatCard
                    label="Active Users"
                    value={data.overview.activeUsers.toLocaleString()}
                    change="+5% from last month"
                    trend="up" // green
                    icon={Users}
                    iconColor="bg-green-50 text-green-500"
                />
                <StatCard
                    label="Response Rate"
                    value={`${data.overview.responseRate}%`}
                    change="+2.1% from last month"
                    trend="up" // green
                    icon={MoveRight} // Using icon from Users page logic but screenshot shows purple >> arrows
                    iconColor="bg-purple-50 text-purple-500"
                />
                <StatCard
                    label="Avg Response Time"
                    value={data.overview.avgResponseTime}
                    change="-0.3s from last month"
                    trend="up" // green (Wait, -0.3s is good for response time, usually green. Screenshot shows green text +3% etc, but for time negative is good)
                    // Screenshot shows "+12%...", "+5%...", "+2.1%...", and "+0.3s from last month" IN GREEN.
                    // Wait, the screenshot actually says "-0.3s from last month" in GREEN.
                    icon={Clock}
                    iconColor="bg-orange-50 text-orange-400"
                />
            </div>

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Row 1: Usage Trends & Top Queries */}
                <UsageTrends data={data.usageTrends} />
                <TopQueries data={data.topQueries} />

                {/* Row 2: Response Time & User Satisfaction */}
                <ResponseTimeBreakdown data={data.responseTime} />
                <UserSatisfaction data={data.satisfaction} />
            </div>

            <AnalyticsBackupGrid />
        </div>
    );
}
