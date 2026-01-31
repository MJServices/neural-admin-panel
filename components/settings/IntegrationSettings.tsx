
import React from 'react';
import { Network, Key, Globe, Webhook } from 'lucide-react';

interface IntegrationSettingsProps {
    settings: any;
    onChange: (key: string, value: any) => void;
}

const IntegrationSettings = ({ settings, onChange }: IntegrationSettingsProps) => {
    return (
        <div className="bg-white rounded-xl border p-6 space-y-8">
            <div className="border-b pb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Network className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Integrations</h2>
                        <p className="text-sm text-gray-500">Connect with third-party services and APIs</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* OpenAI API Key */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Key className="w-4 h-4 text-gray-400" />
                        OpenAI API Key
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            value={settings.openai_api_key || ''}
                            onChange={(e) => onChange('openai_api_key', e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono"
                            placeholder="sk-..."
                        />
                    </div>
                    <p className="text-xs text-gray-500">
                        Your key is encrypted and stored securely. Used for generating AI responses.
                    </p>
                </div>

                {/* Webhook URL */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Webhook className="w-4 h-4 text-gray-400" />
                        Webhook URL
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={settings.webhook_url || ''}
                            onChange={(e) => onChange('webhook_url', e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono"
                            placeholder="https://your-api.com/webhook"
                        />
                    </div>
                    <p className="text-xs text-gray-500">
                        Receive real-time events for bot activities and user interactions.
                    </p>
                </div>

                {/* Connected Services List (Placeholder) */}
                <div className="pt-4 mt-6 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Connected Services</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                <Globe className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Supabase Database</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Connected</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <Network className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Vercel Deployment</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Connected</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntegrationSettings;
