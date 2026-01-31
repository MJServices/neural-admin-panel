import { Cloud, Plus, Trash2 } from 'lucide-react';


interface BackupDataGridProps {
    onExport: () => void;
    onDelete: () => void;
}

const BackupDataGrid = ({ onExport, onDelete }: BackupDataGridProps) => {
    return (
        <div className="mt-8">
            <h3 className="text-gray-700 font-bold mb-4">Backup & Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Backup & Data Card */}
                <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-8 flex flex-col items-center justify-center text-center hover:shadow-sm transition-shadow">
                    <div className="mb-3 text-blue-500">
                        <Cloud className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Backup & Data</h4>
                    <p className="text-sm text-gray-400 mb-4">Download all your data</p>
                    <button onClick={onExport} className="bg-white border border-gray-200 text-gray-700 text-xs font-medium px-6 py-1.5 rounded shadow-sm hover:bg-gray-50">
                        Export
                    </button>
                </div>

                {/* Add a New Bot Card */}
                <div className="bg-green-50/50 rounded-xl border border-green-100 p-8 flex flex-col items-center justify-center text-center hover:shadow-sm transition-shadow">
                    <div className="mb-3 text-green-500">
                        <Plus className="w-8 h-8 rounded-full border-2 border-green-500 p-1" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Add a New Bot</h4>
                    <p className="text-sm text-gray-400 mb-4">Add a new bot for daily use</p>
                    <button className="bg-white border border-gray-200 text-green-600 text-xs font-medium px-6 py-1.5 rounded shadow-sm hover:bg-gray-50">
                        Add
                    </button>
                </div>

                {/* Delete Account Card */}
                <div className="bg-red-50/50 rounded-xl border border-red-100 p-8 flex flex-col items-center justify-center text-center hover:shadow-sm transition-shadow">
                    <div className="mb-3 text-red-500">
                        <Trash2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Delete Account</h4>
                    <p className="text-sm text-gray-400 mb-4">Permanently delete account</p>
                    <button onClick={onDelete} className="bg-white border border-red-200 text-red-500 text-xs font-medium px-6 py-1.5 rounded shadow-sm hover:bg-red-50">
                        Delete
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BackupDataGrid;
