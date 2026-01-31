
import React from 'react';
import { Shield, Key, Lock } from 'lucide-react';

interface SecuritySettingsProps {
    settings: any;
    onChange: (key: string, value: any) => void;
}

const SecuritySettings = ({ settings, onChange }: SecuritySettingsProps) => {
    return (
        <div className="bg-white rounded-xl border p-6 space-y-8">
            <div className="border-b pb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Security Settings</h2>
                        <p className="text-sm text-gray-500">Manage your account security and authentication preferences</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Change Password */}
                <div className="p-6 border border-gray-200 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Lock className="w-5 h-5 text-gray-400" />
                        <h3 className="font-medium text-gray-900">Change Password</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Current Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div className="pt-2">
                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                            Update Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;
