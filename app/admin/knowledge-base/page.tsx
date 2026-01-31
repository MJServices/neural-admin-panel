'use client';

import { useState, useEffect } from 'react';
import { Download, MessageSquare, Users, MoveRight, Clock } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import CategoriesSidebar from '@/components/knowledge-base/CategoriesSidebar';
import ArticlesTable from '@/components/knowledge-base/ArticlesTable';
import PopularArticles from '@/components/knowledge-base/PopularArticles';
import { getKnowledgeBaseStats, getArticles, getCategories } from '@/app/actions';

export default function KnowledgeBasePage() {
    const [stats, setStats] = useState<any>(null);
    const [articles, setArticles] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All Articles');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const loadData = async () => {
        setLoading(true);
        console.log("Loading Knowledge Base Data...");
        try {
            // Pass new params to getArticles
            const [statsData, articlesResponse, catsData] = await Promise.all([
                getKnowledgeBaseStats(),
                getArticles(searchQuery, selectedCategory, filterStatus, sortBy, currentPage, ITEMS_PER_PAGE),
                getCategories()
            ]);
            console.log("Articles Response:", articlesResponse);
            setStats(statsData);

            // Handle new response structure
            if (articlesResponse && typeof articlesResponse === 'object' && 'data' in articlesResponse) {
                setArticles(articlesResponse.data);
                setTotalPages(Math.ceil((articlesResponse.total || 0) / ITEMS_PER_PAGE));
            } else {
                setArticles(articlesResponse as any || []);
                setTotalPages(1); // fallback
            }

            setCategories(catsData);
        } catch (error) {
            console.error("Failed to load knowledge base", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [searchQuery, selectedCategory, filterStatus, sortBy, currentPage]); // Re-run on any change Including page


    // Derived popular articles (just top 3 by views from the fetched list for now)
    const popularArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 3);

    const handleExportReport = async () => {
        try {
            // Fetch ALL articles matching current filters for export (using a large limit)
            const result = await getArticles(searchQuery, selectedCategory, filterStatus, sortBy, 1, 10000);

            const exportData = result && 'data' in result ? result.data : [];

            if (exportData.length === 0) {
                alert('No data to export');
                return;
            }

            // Convert to CSV
            const headers = ['ID', 'Title', 'Category', 'Status', 'Views', 'Helpful', 'Last Update', 'Description'];
            const csvContent = [
                headers.join(','),
                ...exportData.map((article: any) => [
                    article.id,
                    `"${article.title.replace(/"/g, '""')}"`, // Escape quotes
                    article.category,
                    article.status,
                    article.views,
                    article.helpfulRaw, // Use raw number
                    article.lastUpdate,
                    `"${(article.description || '').replace(/"/g, '""')}"`
                ].join(','))
            ].join('\n');

            // Trigger download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `knowledge_base_report_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export report');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-800">Knowledge Base</h1>
                <button
                    onClick={handleExportReport}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Interaction"
                    value={stats?.totalInteraction?.toLocaleString() || '...'}
                    change={stats ? `${stats.totalInteractionChange}% from last month` : 'Loading...'}
                    trend={stats?.totalInteractionChange >= 0 ? "up" : "down"}
                    icon={MessageSquare}
                    iconColor="bg-blue-50 text-blue-500"
                />
                <StatCard
                    label="Active Users"
                    value={stats?.activeUsers?.toLocaleString() || '...'}
                    change={stats ? `${stats.activeUsersChange}% from last month` : 'Loading...'}
                    trend={stats?.activeUsersChange >= 0 ? "up" : "down"}
                    icon={Users}
                    iconColor="bg-green-50 text-green-500"
                />
                <StatCard
                    label="Response Rate"
                    value={stats ? `${stats.responseRate}%` : '...'}
                    change={stats ? `${stats.responseRateChange}% from last month` : 'Loading...'}
                    trend={stats?.responseRateChange >= 0 ? "up" : "down"}
                    icon={MoveRight}
                    iconColor="bg-purple-50 text-purple-500"
                />
                <StatCard
                    label="Avg Response Time"
                    value={stats?.avgResponseTime || '...'}
                    change={stats ? `${stats.avgResponseTimeChange}s from last month` : 'Loading...'}
                    trend="up" // usually lower is better for time, but 'up' arrow color logic depends on context. Let's keep green/up if it's improved (lower time). But here logic is simplistic.
                    icon={Clock}
                    iconColor="bg-orange-50 text-orange-400"
                />
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <CategoriesSidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
                <ArticlesTable
                    articles={articles}
                    searchQuery={searchQuery}
                    onSearch={setSearchQuery}
                    currentFilter={filterStatus}
                    onFilterChange={setFilterStatus}
                    currentSort={sortBy}
                    onSortChange={setSortBy}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onRefresh={loadData}
                />
            </div>

            <PopularArticles articles={popularArticles} />
        </div>
    );
}
