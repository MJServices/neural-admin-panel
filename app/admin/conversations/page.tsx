'use client';


import { useState } from 'react';
import { Download } from 'lucide-react';
import ConversationList from '@/components/conversations/ConversationList';
import ConversationEmptyState from '@/components/conversations/ConversationEmptyState';
import ConversationDetail from '@/components/conversations/ConversationDetail';

export default function ConversationsPage() {
    const [selectedConversation, setSelectedConversation] = useState<any | null>(null);

    return (
        <div className="h-[calc(100vh-140px)]">
            <div className={`flex justify-between items-center mb-6 ${selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
                <h1 className="text-2xl font-bold text-gray-800">Conversation</h1>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 lg:px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export Report</span>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full">
                {/* List View */}
                <div className={`w-full lg:w-1/3 h-full ${selectedConversation ? 'hidden lg:block' : 'block'}`}>
                    <ConversationList
                        onSelectConversation={(conv) => setSelectedConversation(conv)}
                        selectedId={selectedConversation?.id}
                    />
                </div>

                {/* Detail View */}
                <div className={`w-full lg:w-2/3 h-full ${selectedConversation ? 'block' : 'hidden lg:block'}`}>
                    {selectedConversation ? (
                        <ConversationDetail
                            conversationId={selectedConversation.id}
                            user={{
                                name: selectedConversation.user,
                                avatar: selectedConversation.avatar,
                                status: selectedConversation.status
                            }}
                            onBack={() => setSelectedConversation(null)}
                        />
                    ) : (
                        <ConversationEmptyState />
                    )}
                </div>
            </div>
        </div>
    );
}
