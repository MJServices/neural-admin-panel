const menuItems = [
    'Dashboard',
    'Bot Configuration',
    'Security',
    'Integration',
];


interface SettingsSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const SettingsSidebar = ({ activeTab, onTabChange }: SettingsSidebarProps) => {
    return (
        <div className="w-full lg:w-64 bg-white rounded-xl border p-4 h-fit">
            <nav className="space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => onTabChange(item)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 rounded-l-none'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default SettingsSidebar;
