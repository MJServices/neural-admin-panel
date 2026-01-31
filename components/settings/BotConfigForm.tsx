
import React from 'react';
import { Bot, Zap, Brain, MessageSquare } from 'lucide-react';

interface BotConfigFormProps {
    settings: any;
    onChange: (key: string, value: any) => void;
}

const BotConfigForm = ({ settings, onChange }: BotConfigFormProps) => {
    return (
        <div className="bg-white rounded-xl border p-6 space-y-8">
            <div className="border-b pb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Bot Configuration</h2>
                        <p className="text-sm text-gray-500">Customize your AI bot's personality and behavior</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Bot Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={settings.bot_name || ''}
                            onChange={(e) => onChange('bot_name', e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="e.g. Noural Bot"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Brain className="w-4 h-4 text-gray-400" />
                            AI Model
                        </label>
                        <select
                            value={settings.bot_model || 'GPT-4'}
                            onChange={(e) => onChange('bot_model', e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        >
                            <option value="GPT-4">GPT-4 (Recommended)</option>
                            <option value="GPT-3.5-Turbo">GPT-3.5 Turbo</option>
                            <option value="Claude-3-Opus">Claude 3 Opus</option>
                            <option value="Claude-3-Sonnet">Claude 3 Sonnet</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-gray-400" />
                            Creativity (Temperature): {settings.bot_temperature || 0.7}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.bot_temperature || 0.7}
                            onChange={(e) => onChange('bot_temperature', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Precise</span>
                            <span>Balanced</span>
                            <span>Creative</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        System Prompt
                    </label>
                    <textarea
                        value={settings.system_prompt || ''}
                        onChange={(e) => onChange('system_prompt', e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                        placeholder="Define how the bot should behave..."
                    />
                    <p className="text-xs text-gray-500">
                        This instruction guides the AI's behavior and personality in every conversation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BotConfigForm;
