'use client';

import SettingsSidebar from '@/components/settings/SettingsSidebar';
import SettingsForm from '@/components/settings/SettingsForm';
import BackupDataGrid from '@/components/settings/BackupDataGrid';

import BotConfigForm from '@/components/settings/BotConfigForm';
import SecuritySettings from '@/components/settings/SecuritySettings';
import IntegrationSettings from '@/components/settings/IntegrationSettings';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings, resetSettings, exportAllData, deleteAdminAccount } from '@/app/actions';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const data = await getSettings();
            setSettings(data || {});
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updateSettings(settings);
            if (result.success) {
                alert('Settings saved successfully');
            } else {
                alert('Failed to save settings: ' + result.error);
            }
        } catch (error) {
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (!confirm('Are you sure you want to reset settings to default?')) return;
        try {
            await resetSettings();
            await loadSettings();
        } catch (error) {
            alert('Failed to reset settings');
        }
    };

    const handleExport = async () => {
        try {
            const jsonString = await exportAllData();
            const blob = new Blob([jsonString], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert('Export failed');
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
        const result = await deleteAdminAccount();
        if (result.success) {
            alert('Account deletion initiated (Mock)');
            // Redirect or logout
        } else {
            alert('Failed to delete account: ' + result.error);
        }
    };

    const [activeTab, setActiveTab] = useState('Dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return (
                    <>
                        <SettingsForm settings={settings} onChange={handleChange} />
                        <BackupDataGrid
                            onExport={handleExport}
                            onDelete={handleDeleteAccount}
                        />
                    </>
                );
            case 'Bot Configuration':
                return <BotConfigForm settings={settings} onChange={handleChange} />;
            case 'Security':
                return <SecuritySettings settings={settings} onChange={handleChange} />;
            case 'Integration':
                return <IntegrationSettings settings={settings} onChange={handleChange} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Setting</h1>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button
                        onClick={handleReset}
                        disabled={loading}
                        className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Reset to Default
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading || saving}
                        className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="flex-1 w-full">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading settings...</div>
                    ) : (
                        renderContent()
                    )}
                </div>
            </div>
        </div>
    );
}
