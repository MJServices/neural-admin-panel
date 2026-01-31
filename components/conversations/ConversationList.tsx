
import { Search, Star, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getConversations } from '@/app/actions';

interface ConversationListProps {
    onSelectConversation: (conversation: any) => void;
    selectedId: string | null;
}

const ConversationList = ({ onSelectConversation, selectedId }: ConversationListProps) => {
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const searchParams = useSearchParams();
    const urlSearchParam = searchParams.get('search') || '';

    // Effect to sync URL param to local state (when Header changes URL)
    useEffect(() => {
        if (urlSearchParam !== searchQuery) {
            setSearchQuery(urlSearchParam);
        }
    }, [urlSearchParam]);

    // Effect to handle search execution (debounced)
    useEffect(() => {
        let isActive = true;

        const loadConversations = async (query: string) => {
            if (isActive) setLoading(true);
            try {
                const data = await getConversations(10, query);
                if (isActive) setConversations(data);
            } catch (error) {
                console.error('Failed to load conversations', error);
            } finally {
                if (isActive) setLoading(false);
            }
        };

        if (!searchQuery) {
            loadConversations('');
            return () => { isActive = false; };
        }

        const timeoutId = setTimeout(() => {
            loadConversations(searchQuery);
        }, 300);

        return () => {
            isActive = false;
            clearTimeout(timeoutId);
        };
    }, [searchQuery]);

    // Non-blocking loading
    const filteredConversations = conversations;

    return (
        <div className="bg-white p-6 rounded-xl border h-full overflow-y-auto flex flex-col">
            <div className="relative mb-8 shrink-0">
                {loading ? (
                    <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4 animate-spin" />
                ) : (
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                )}
                <input
                    type="text"
                    placeholder="Search Conversation"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-300 transition-shadow"
                />
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm mt-10">
                        {searchQuery ? 'No matching conversations' : 'No conversations found'}
                    </div>
                ) : (
                    filteredConversations.map((conv, index) => (
                        <div
                            key={conv.id || index}
                            onClick={() => onSelectConversation(conv)}
                            className={`flex gap-4 p-3 rounded-xl cursor-pointer transition-all border border-transparent ${selectedId === conv.id
                                ? 'bg-blue-50 border-blue-100 shadow-sm'
                                : 'hover:bg-gray-50 hover:border-gray-100'
                                }`}
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${conv.color || 'bg-blue-100 text-blue-600'}`}
                            >
                                {conv.avatar && conv.avatar.startsWith('http') ? (
                                    <img src={conv.avatar} alt={conv.user} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    conv.avatar || (conv.user ? conv.user.charAt(0) : '?')
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                {/* Top Row: Name+Badge and Satisfaction Label */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-800 truncate">{conv.user}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${conv.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {conv.status || 'Active'}
                                        </span>
                                    </div>
                                    <span className="hidden sm:block text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">Satisfaction</span>
                                </div>

                                {/* Middle Row: Message and Stars */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mt-1 gap-1">
                                    <p className="text-xs text-gray-500 truncate font-medium w-full pr-4">{conv.message}</p>
                                    <div className="flex gap-0.5 shrink-0">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < (conv.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Row: Time */}
                                <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
                                    {conv.time ? new Date(conv.time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ConversationList;
