
import { ArrowLeft, MoreHorizontal, Send, Paperclip, Smile } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMessages } from '@/app/actions';

interface ConversationDetailProps {
    conversationId: string | null;
    user?: {
        name: string;
        avatar: string;
        status: string;
    };
    onBack: () => void;
}

const ConversationDetail = ({ conversationId, user, onBack }: ConversationDetailProps) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const loadMessages = async () => {
            if (!conversationId) return;
            setLoading(true);
            try {
                const data = await getMessages(conversationId);
                setMessages(data);
            } catch (error) {
                console.error('Failed to load messages', error);
            } finally {
                setLoading(false);
            }
        };
        loadMessages();
    }, [conversationId]);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        // In a real app, call server action to send message here
        // For now, optimistic update or just clear
        setNewMessage('');
        // Refetch or append to local state
    };

    if (!conversationId) return null;

    if (loading) {
        return <div className="flex items-center justify-center h-full text-gray-500">Loading messages...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-blue-100 text-blue-600 overflow-hidden">
                        {user?.avatar && user.avatar.startsWith('http') ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user?.avatar || (user?.name ? user.name.charAt(0) : 'U')
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm">{user?.name || 'Unknown User'}</h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${user?.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {user?.status || 'Offline'}
                        </span>
                    </div>
                </div>

                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm mt-10">No messages yet.</div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}
                        >
                            <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'assistant'
                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                    : 'bg-white border rounded-tl-sm text-gray-700 shadow-sm'
                                    }`}
                            >
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border focus-within:ring-1 focus-within:ring-blue-500 transition-shadow">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent border-none text-sm focus:outline-none text-gray-700"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Smile className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSend}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConversationDetail;
