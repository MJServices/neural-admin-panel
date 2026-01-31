
const PopularArticles = ({ articles }: { articles?: any[] }) => {
    // If no articles passed, use a fallback empty state or loading (but usually parent passes it)
    const displayArticles = articles && articles.length > 0 ? articles : [];

    return (
        <div className="mt-8">
            <h3 className="text-gray-800 font-bold mb-4">Most Popular Article</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayArticles.map((article, index) => (
                    <div key={index} className="bg-white rounded-xl border p-6 hover:shadow-sm transition-shadow">
                        <h4 className="font-bold text-gray-800 mb-1 line-clamp-1">{article.title}</h4>
                        <p className="text-xs text-gray-500 mb-6 line-clamp-2">{article.description}</p>
                        <div className="flex justify-between items-center text-xs font-semibold">
                            <span className="text-blue-500">{article.views.toLocaleString()} views</span>
                            <span className="text-green-500">{article.helpful} helpful</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularArticles;
