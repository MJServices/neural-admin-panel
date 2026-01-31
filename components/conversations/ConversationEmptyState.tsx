import { MessageSquarePlus } from 'lucide-react';

const ConversationEmptyState = () => {
    return (
        <div className="bg-white rounded-xl border h-[calc(100vh-140px)] flex flex-col items-center justify-center text-center p-8">
            <div className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4 text-gray-400">
                {/* Icon in screenshot looks like a plus inside a message bubble or similar square */}
                <MessageSquarePlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Conversation</h3>
            <p className="text-gray-400 text-sm">Choose a conversation from the list to view details</p>
        </div>
    );
};

export default ConversationEmptyState;
