'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const timeZones = [
    'Pacific Time (US & Canada)',
    'Mountain Time (US & Canada)',
    'Central Time (US & Canada)',
    'Eastern Time (US & Canada)',
    'Greenwich Mean Time (London)',
    'Central European Time (Paris)',
];

const languages = [
    'English (US)',
    'English (UK)',
    'Spanish',
    'French',
    'German',
    'Chinese',
];

interface SettingsFormProps {
    settings: any;
    onChange: (key: string, value: string) => void;
}

const SettingsForm = ({ settings, onChange }: SettingsFormProps) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (key: string) => {
        setActiveDropdown(activeDropdown === key ? null : key);
    };

    const selectOption = (type: 'timezone' | 'language', value: string) => {
        if (type === 'timezone') onChange('time_zone', value);
        if (type === 'language') onChange('language', value);
        setActiveDropdown(null);
    };


    return (
        <div className="bg-white rounded-xl border p-4 sm:p-8 flex-1 h-fit">
            {/* Added h-fit to prevent stretching if side is shorter, though flex-1 usually handles it. */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-500 text-sm mt-1">Configure your general settings</p>
            </div>

            <div className="space-y-6 max-w-2xl">
                {/* Organization Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Organization Name</label>
                    <input
                        type="text"
                        value={settings?.organization_name || ''}
                        onChange={(e) => onChange('organization_name', e.target.value)}
                        placeholder="Enter Organization Name"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-300 transition-shadow"
                    />
                </div>

                {/* Admin Email */}
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Admin Email</label>
                    <input
                        type="email"
                        value={settings?.admin_email || ''}
                        onChange={(e) => onChange('admin_email', e.target.value)}
                        placeholder="admin@gmail.com"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 transition-shadow"
                    />
                </div>

                {/* Time Zone */}
                <div className="space-y-1.5 relative">
                    <label className="text-sm font-bold text-gray-700">Time Zone</label>
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('timezone')}
                            className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow ${activeDropdown === 'timezone' ? 'ring-1 ring-blue-500 border-blue-500' : ''}`}
                        >
                            <span className={settings?.time_zone ? "text-gray-900" : "text-gray-300"}>
                                {settings?.time_zone || "Select a Time Zone"}
                            </span>
                            <ChevronDown className={`text-gray-400 w-4 h-4 transition-transform ${activeDropdown === 'timezone' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'timezone' && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg max-h-60 overflow-auto py-1">
                                {timeZones.map((tz) => (
                                    <button
                                        key={tz}
                                        onClick={() => selectOption('timezone', tz)}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex justify-between items-center"
                                    >
                                        {tz}
                                        {settings?.time_zone === tz && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Language */}
                <div className="space-y-1.5 relative">
                    <label className="text-sm font-bold text-gray-700">Language</label>
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('language')}
                            className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow ${activeDropdown === 'language' ? 'ring-1 ring-blue-500 border-blue-500' : ''}`}
                        >
                            <span className={settings?.language ? "text-gray-900" : "text-gray-300"}>
                                {settings?.language || "Select a Language"}
                            </span>
                            <ChevronDown className={`text-gray-400 w-4 h-4 transition-transform ${activeDropdown === 'language' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'language' && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg max-h-60 overflow-auto py-1 top-full">
                                {languages.map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => selectOption('language', lang)}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex justify-between items-center"
                                    >
                                        {lang}
                                        {settings?.language === lang && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsForm;
