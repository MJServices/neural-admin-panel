'use client';

import { Download } from 'lucide-react';

export default function DashboardHeader() {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <button
                onClick={() => alert('Exporting report...')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
            >
                <Download className="w-4 h-4" />
                Export Report
            </button>
        </div>
    );
}
