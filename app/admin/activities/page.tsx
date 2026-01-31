
import { getRecentActivities } from '@/app/actions';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ActivitiesPage() {
    // Fetch more activities for this page
    const activities = await getRecentActivities(50);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">All Activities</h1>
            </div>

            <ActivityFeed
                activities={activities}
                title="Activity Log"
                hideViewAll={true}
            />
        </div>
    );
}
