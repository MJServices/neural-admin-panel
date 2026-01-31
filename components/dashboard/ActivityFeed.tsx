import Link from 'next/link';

const activities = [
    {
        user: 'Sarah Johnson',
        action: 'Started new conversation',
        time: '2 minutes ago',
        status: 'active',
        avatar: 'SJ',
        color: 'bg-blue-100 text-blue-600',
    },
    {
        user: 'Mike Chen',
        action: 'Reported conversation issue',
        time: '15 minutes ago',
        status: 'pending',
        avatar: 'MC',
        color: 'bg-yellow-100 text-yellow-600',
    },
    {
        user: 'Emma Davis',
        action: 'Completed feedback survey',
        time: '1 hour ago',
        status: 'completed',
        avatar: 'ED',
        color: 'bg-purple-100 text-purple-600',
    },
    {
        user: 'Alex Thompson',
        action: 'Updated profile settings',
        time: '2 hours ago',
        status: 'completed',
        avatar: 'AT',
        color: 'bg-blue-100 text-blue-600',
    },
    {
        user: 'Lisa Rodriguez',
        action: 'Started new conversation',
        time: '5 hours ago',
        status: 'active',
        avatar: 'LR',
        color: 'bg-pink-100 text-pink-600',
    },
];



interface ActivityFeedProps {
    activities?: any[];
    title?: string;
    hideViewAll?: boolean;
}

const ActivityFeed = ({ activities = [], title = "Recent Activity", hideViewAll = false }: ActivityFeedProps) => {
    return (
        <div className="bg-white p-6 rounded-xl border h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-700 font-medium">{title}</h3>
                {!hideViewAll && (
                    <Link href="/admin/activities" className="text-xs text-gray-400 hover:text-gray-600">View All</Link>
                )}
            </div>
            <div className="space-y-6">
                {activities.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No recent activity</p>
                ) : (
                    activities.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${activity.color || 'bg-gray-100 text-gray-600'}`}
                                >
                                    {activity.avatar ? (
                                        activity.avatar.startsWith('http') ?
                                            <img src={activity.avatar} alt={activity.user} className="w-8 h-8 rounded-full object-cover" />
                                            : activity.avatar
                                    ) : (
                                        // Fallback initial
                                        activity.user.charAt(0)
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-700 truncate">{activity.user}</p>
                                    <p className="text-xs text-gray-400 truncate">{activity.action}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 mb-1">
                                    {new Date(activity.time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${activity.status === 'active'
                                        ? 'bg-green-100 text-green-600'
                                        : activity.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-600'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    {activity.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
