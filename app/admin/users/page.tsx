'use client';

import { useState, useEffect } from 'react';
import { Download, MessageSquare, Users, MoveRight, Clock } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import UsersTable from '@/components/users/UsersTable';
import QuickActions from '@/components/dashboard/QuickActions';
import { getUserPageStats } from '@/app/actions';

export default function UsersPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        avgSatisfaction: 0,
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await getUserPageStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to load user stats', error);
            }
        };
        loadStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            {/* Stats Grid - Data specific to screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    change="" // Screenshot doesn't show change text for this grid, only icons/colors are specific
                    trend="up"
                    icon={MessageSquare} // Icon is actually blue chat bubble in screenshot
                    iconColor="bg-blue-50 text-blue-500" // Screenshot shows refined colors
                />
                <StatCard
                    label="Active Users"
                    value={stats.activeUsers.toLocaleString()}
                    change=""
                    trend="up"
                    icon={Users}
                    iconColor="bg-green-50 text-green-500"
                />
                <StatCard
                    label="New This Month"
                    value={stats.newUsers.toLocaleString()}
                    change=""
                    trend="up"
                    icon={MoveRight} // Using MoveRight or similar double arrow
                    iconColor="bg-purple-50 text-purple-500"
                />
                <StatCard
                    label="Avg Satisfaction"
                    value={stats.avgSatisfaction.toString()}
                    change=""
                    trend="up"
                    icon={Clock} // Screenshot shows yellow clock/history icon
                    iconColor="bg-orange-50 text-orange-400"
                />
            </div>

            <UsersTable />

            <QuickActions />
        </div>
    );
}
