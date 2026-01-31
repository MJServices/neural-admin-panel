
const ResponseTimeBreakdown = ({ data }: { data?: any[] }) => {
    const buckets = data || [];
    return (
        <div className="bg-white p-6 rounded-xl border h-full">
            <h3 className="text-gray-900 font-bold mb-6">Response Time</h3>
            <div className="space-y-6">
                {buckets.map((bucket, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <span className="text-xs font-semibold text-gray-600">{bucket.label}</span>
                        <span className="text-xs font-bold text-gray-800">{bucket.percentage}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResponseTimeBreakdown;
