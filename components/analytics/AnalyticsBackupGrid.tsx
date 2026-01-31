'use client';

import { Cloud, Trash2, CheckSquare, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { exportAllData, toggleAutoBackup, deleteAdminAccount } from '@/app/actions';
import { useRouter } from 'next/navigation';

const AnalyticsBackupGrid = () => {
    const [downloading, setDownloading] = useState(false);
    const [autoBackup, setAutoBackup] = useState(true); // Default enabled
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const jsonString = await exportAllData();
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed', error);
            alert('Failed to download data.');
        } finally {
            setDownloading(false);
        }
    };

    const handleAutoBackup = async () => {
        const newState = !autoBackup;
        setAutoBackup(newState);
        try {
            await toggleAutoBackup(newState);
        } catch (error) {
            console.error('Failed to toggle auto backup', error);
            // Revert on failure
            setAutoBackup(!newState);
        }
    };

    const handleDeleteAccount = async () => {
        if (confirm('CRITICAL WARNING: This will permanently delete your account and all associated data. This action CANNOT be undone. Are you absolutely sure?')) {
            setDeleting(true);
            try {
                const result = await deleteAdminAccount();
                if (result.success) {
                    alert('Account deleted. Redirecting...');
                    router.push('/login');
                } else {
                    alert(`Deletion Failed: ${result.error}`);
                }
            } catch (error) {
                console.error('Delete failed', error);
                alert('An unexpected error occurred during deletion.');
            } finally {
                setDeleting(false);
            }
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-gray-800 font-bold mb-4">Backup & Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Backup & Data Card */}
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="bg-blue-50/50 hover:bg-blue-50 transition-colors rounded-xl border border-blue-100 p-8 flex flex-col items-center justify-center text-center cursor-pointer disabled:opacity-50"
                >
                    <div className="mb-3 text-blue-500">
                        {downloading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Cloud className="w-8 h-8" />}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Backup & Data</h4>
                    <p className="text-sm text-gray-400">Download all your data</p>
                </button>

                {/* Auto Backup Card */}
                <button
                    onClick={handleAutoBackup}
                    className={`rounded-xl border p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${autoBackup
                            ? 'bg-green-50/50 border-green-100 hover:bg-green-50'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                >
                    <div className={`mb-3 ${autoBackup ? 'text-green-500' : 'text-gray-400'}`}>
                        <CheckSquare className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Auto Backup</h4>
                    <p className="text-sm text-gray-400">{autoBackup ? 'On: Daily backups active' : 'Off: Enable daily backups'}</p>
                </button>

                {/* Delete Account Card */}
                <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="bg-red-50/50 hover:bg-red-50 transition-colors rounded-xl border border-red-100 p-8 flex flex-col items-center justify-center text-center cursor-pointer disabled:opacity-50"
                >
                    <div className="mb-3 text-red-500">
                        {deleting ? <Loader2 className="w-8 h-8 animate-spin" /> : <Trash2 className="w-8 h-8" />}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Delete Account</h4>
                    <p className="text-sm text-gray-400">Permanently delete account</p>
                </button>

            </div>
        </div>
    );
};

export default AnalyticsBackupGrid;
