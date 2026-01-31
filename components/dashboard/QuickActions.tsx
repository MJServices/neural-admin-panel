import Link from 'next/link';
import { Plus, Upload, Settings, Database } from 'lucide-react';

const actions = [
    {
        title: 'Create New Bot',
        description: 'Set up a new AI Chatbot',
        icon: Plus,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-500',
        href: '/admin/settings',
    },
    {
        title: 'Import Data',
        description: 'Upload Conversation',
        icon: Upload,
        color: 'bg-pink-500',
        bgColor: 'bg-pink-50',
        iconColor: 'text-pink-500',
        href: '/admin/knowledge-base',
    },
    {
        title: 'Bot Configuration',
        description: 'Modify bot setting',
        icon: Settings,
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-500',
        href: '/admin/settings',
    },
    {
        title: 'Training Data',
        description: 'Manage Data Base',
        icon: Database,
        color: 'bg-orange-500',
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-500',
        href: '/admin/knowledge-base',
    },
];

const QuickActions = () => {
    return (
        <div>
            <h3 className="text-gray-700 font-medium mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        href={action.href}
                        className="flex items-center gap-4 bg-white p-4 rounded-xl border hover:shadow-md transition-shadow text-left"
                    >
                        <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center shrink-0`}>
                            <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-700 leading-tight">
                                {action.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{action.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
