'use client';

import { useState, Suspense } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <div className="flex-1 flex flex-col w-full lg:ml-64 transition-all duration-300">
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 mt-16 p-4 lg:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
