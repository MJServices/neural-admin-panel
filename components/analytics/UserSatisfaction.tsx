import { Star } from 'lucide-react';

const UserSatisfaction = ({ data }: { data?: any }) => {
    const ratings = data?.distribution || [];
    const avgScore = data?.avg || 0;
    const totalRated = data?.total || 0;

    return (
        <div className="bg-white p-6 rounded-xl border h-full">
            <h3 className="text-gray-900 font-bold mb-8">User Satisfaction</h3>

            <div className="flex flex-col items-center mb-8">
                <h2 className="text-4xl font-bold text-blue-600 mb-2">{avgScore}/5</h2>
                <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(avgScore) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                        />
                    ))}
                </div>
                <p className="text-xs text-gray-400">Based on {totalRated.toLocaleString()} rating</p>
            </div>

            <div className="space-y-3">
                {ratings.map((rating: any) => (
                    <div key={rating.stars} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-700 w-3">{rating.stars}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${rating.color}`}
                                style={{ width: `${rating.percentage}%` }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 w-8 text-right">{rating.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserSatisfaction;
