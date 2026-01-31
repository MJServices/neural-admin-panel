import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: LucideIcon;
    iconColor: string;
}

const StatCard = ({ label, value, change, trend, icon: Icon, iconColor }: StatCardProps) => {
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{label}</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg ${iconColor} bg-opacity-10`}>
                    {/* Note: bg-opacity-10 might not work with text color classes if not using bg-color-50 etc. 
              Better to use explicit bg classes like bg-blue-50. 
              Refining prop to separate bg and text colors or map them.
          */}
                    <Icon className={`w-5 h-5 ${iconColor.replace('bg-', 'text-')}`} />
                </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
                <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {change}
                </span>
                <span className="text-gray-400">from last month</span>
            </div>
        </div>
    );
};

export default StatCard;
