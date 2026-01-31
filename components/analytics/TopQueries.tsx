
const TopQueries = ({ data }: { data?: any[] }) => {
    const displayData = data || []; // Needs fallback? Prop shouldn't be null if parent loaded

    return (
        <div className="bg-white p-6 rounded-xl border h-full">
            <h3 className="text-gray-900 font-bold mb-6">Top Users Queries</h3>
            <div className="space-y-5">
                {displayData.map((item) => (
                    <div key={item.rank} className="flex items-center gap-4">
                        <div className="w-6 h-6 flex-shrink-0 bg-blue-50 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                            {item.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1.5">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800">{item.text}</h4>
                                    <p className="text-[10px] text-gray-400">{item.count}</p>
                                </div>
                                <span className="text-xs font-bold text-gray-800">{item.percentage}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopQueries;
