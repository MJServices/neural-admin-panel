'use client';

import { Search, Filter, ArrowUpDown, Eye, Pencil, Trash } from 'lucide-react';
import { deleteArticle, updateArticle } from '@/app/actions';
import ArticleModal from './ArticleModal';


import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ArticlesTableProps {
    articles: any[];
    searchQuery: string;
    onSearch: (query: string) => void;
    currentFilter: string;
    onFilterChange: (filter: string) => void;
    currentSort: string;
    onSortChange: (sort: string) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onRefresh?: () => void;
}

const ArticlesTable = ({
    articles,
    searchQuery,
    onSearch,
    currentFilter,
    onFilterChange,
    currentSort,
    onSortChange,
    currentPage,
    totalPages,
    onPageChange,
    onRefresh
}: ArticlesTableProps) => {
    const router = useRouter();
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);

    // Modal State
    const [selectedArticle, setSelectedArticle] = useState<any>(null);
    const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleFilter = () => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); };
    const toggleSort = () => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); };

    const handleAction = (article: any, mode: 'view' | 'edit') => {
        setSelectedArticle(article);
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const handleSave = async (id: any, data: any) => {
        try {
            console.log("Saving article...", id, data);
            const result = await updateArticle(id, data);
            console.log("Save result:", result);
            if (result.success) {
                setIsModalOpen(false); // Close modal first
                router.refresh(); // Refresh server components (if any)
                if (onRefresh) {
                    console.log("Calling onRefresh...");
                    onRefresh(); // Refresh client data
                } else {
                    console.warn("onRefresh prop is missing!");
                }
                return true;
            } else {
                alert('Failed to update: ' + result.error);
                return false;
            }
        } catch (error) {
            console.error("Handle save error:", error);
            alert('An unexpected error occurred.');
            return false;
        }
    };

    return (
        <div className="bg-white rounded-xl border flex-1 overflow-visible flex flex-col min-h-[500px]">
            {/* Header Controls */}
            <div className="p-4 border-b flex flex-wrap gap-4 items-center">
                <div className="bg-gray-50 flex-1 relative rounded-lg border min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-transparent text-sm focus:outline-none"
                    />
                </div>
                <div className="flex gap-2 relative">
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={toggleFilter}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 whitespace-nowrap transition-colors ${currentFilter !== 'All' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-600'}`}
                        >
                            <Filter className="w-4 h-4" />
                            {currentFilter === 'All' ? 'Filters' : currentFilter}
                        </button>
                        {showFilterMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                                {['All', 'Published', 'Draft'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => { onFilterChange(status); setShowFilterMenu(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currentFilter === status ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={toggleSort}
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 whitespace-nowrap"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            Sort
                        </button>
                        {showSortMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                                {[
                                    { label: 'Newest', value: 'newest' },
                                    { label: 'Oldest', value: 'oldest' },
                                    { label: 'Most Viewed', value: 'views' },
                                    { label: 'Most Helpful', value: 'helpful' },
                                ].map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => { onSortChange(option.value); setShowSortMenu(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currentSort === option.value ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Container - Responsive Scroll */}
            <div className="overflow-x-auto w-full flex-1">
                <table className="w-full text-left min-w-[800px] lg:min-w-0">
                    <thead>
                        <tr className="border-b bg-white">
                            <th className="py-4 pl-6 text-xs font-semibold text-gray-800 uppercase tracking-wider whitespace-nowrap w-[40%]">Article</th>
                            <th className="py-4 text-xs font-semibold text-gray-800 uppercase tracking-wider text-center whitespace-nowrap hidden md:table-cell">Category</th>
                            <th className="py-4 text-xs font-semibold text-gray-800 uppercase tracking-wider text-center whitespace-nowrap">Status</th>
                            <th className="py-4 text-xs font-semibold text-gray-800 uppercase tracking-wider text-center whitespace-nowrap hidden lg:table-cell">Views</th>
                            <th className="py-4 text-xs font-semibold text-gray-800 uppercase tracking-wider text-center whitespace-nowrap hidden lg:table-cell">Helpful</th>
                            <th className="py-4 text-xs font-semibold text-gray-800 uppercase tracking-wider text-center whitespace-nowrap hidden xl:table-cell">Last Update</th>
                            <th className="py-4 text-xs font-semibold text-gray-800 uppercase tracking-wider text-center whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {articles.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-gray-500">
                                    No articles match your filters.
                                </td>
                            </tr>
                        ) : (
                            articles.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 pl-6">
                                        <span className="text-sm font-medium text-gray-800 block truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
                                    </td>
                                    <td className="py-4 text-center hidden md:table-cell">
                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-md whitespace-nowrap">
                                            {article.category}
                                        </span>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className={`inline-block px-3 py-1 text-[10px] font-semibold rounded-full ${article.status === 'Published' || article.status === 'published' || article.status === 'resolved'
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {// Capitalize first letter strictly
                                                (article.status.charAt(0).toUpperCase() + article.status.slice(1)).replace('Resolved', 'Published')
                                            }
                                        </span>
                                    </td>
                                    <td className="py-4 text-center text-xs text-gray-600 font-medium hidden lg:table-cell">
                                        {article.views.toLocaleString()}
                                    </td>
                                    <td className="py-4 text-center text-xs text-gray-600 font-bold hidden lg:table-cell">
                                        {article.helpful}
                                    </td>
                                    <td className="py-4 text-center text-xs text-gray-600 font-medium hidden xl:table-cell">
                                        {article.lastUpdate}
                                    </td>
                                    <td className="py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                title="View Details"
                                                onClick={() => handleAction(article, 'view')}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Edit Article"
                                                onClick={() => handleAction(article, 'edit')}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete Article"
                                                onClick={async () => {
                                                    if (confirm('Are you sure you want to delete this article?')) {
                                                        const result = await deleteArticle(article.id);
                                                        if (result.success) {
                                                            router.refresh();
                                                            if (onRefresh) onRefresh();
                                                        } else {
                                                            alert('Failed to delete article: ' + result.error);
                                                        }
                                                    }
                                                }}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t flex justify-between items-center text-xs text-gray-500">
                <span>Page {currentPage} of {totalPages === 0 ? 1 : totalPages}</span>
                <div className="flex gap-1">
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Simple pagination logic: show first 5 or centered around current (simplified for now)
                        // Let's just show pages 1 to min(5, total) for basic robustness
                        let p = i + 1;
                        if (totalPages > 5 && currentPage > 3) {
                            p = currentPage - 3 + i;
                            if (p > totalPages) p = i + 1 + (totalPages - 5);  // shift back
                        }
                        return p;
                    })
                        .filter(p => p > 0 && p <= totalPages)
                        .map(p => (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                className={`px-3 py-1 rounded ${currentPage === p ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'}`}
                            >
                                {p}
                            </button>
                        ))}

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage >= totalPages}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
            {/* Modal */}
            <ArticleModal
                isOpen={isModalOpen}
                mode={modalMode}
                article={selectedArticle}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
};

export default ArticlesTable;
