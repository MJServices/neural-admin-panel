
import { MessageSquare, Users, MoveRight, Clock } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import PerformanceOverview from '@/components/dashboard/PerformanceOverview';
import QuickActions from '@/components/dashboard/QuickActions';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { getDashboardStats, getRecentActivities } from '../actions';

export default async function AdminDashboard() {
    const stats = await getDashboardStats();
    const activities = await getRecentActivities();

    return (
        <div className="space-y-6">
            <DashboardHeader />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Messages"
                    value={stats.totalMessages.toLocaleString()}
                    change="+12%" // To be calculated or removed if not available
                    trend="up"
                    icon={MessageSquare}
                    iconColor="bg-blue-100 text-blue-600"
                />
                <StatCard
                    label="Active Users"
                    value={stats.activeUsers.toLocaleString()}
                    change="+8%"
                    trend="up"
                    icon={Users}
                    iconColor="bg-green-100 text-green-600"
                />
                <StatCard
                    label="Response Rate"
                    value={`${stats.responseRate}%`}
                    change=""
                    trend="up"
                    icon={MoveRight}
                    iconColor="bg-purple-100 text-purple-600"
                />
                <StatCard
                    label="New Users"
                    value={stats.newUsers.toLocaleString()}
                    change=""
                    trend="up"
                    icon={Clock}
                    iconColor="bg-orange-100 text-orange-600"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
                {/* Recent Activity - Takes 1/3 width */}
                <div className="lg:col-span-1 h-full">
                    <ActivityFeed activities={activities} />
                </div>

                {/* Performance Overview - Takes 2/3 width */}
                <div className="lg:col-span-2 h-full">
                    <PerformanceOverview />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="pb-6">
                <QuickActions />
            </div>
        </div>
    );
}
