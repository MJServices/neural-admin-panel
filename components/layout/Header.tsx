import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, Suspense } from 'react';

interface HeaderProps {
    toggleSidebar: () => void;
}

const SearchBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');

    // Sync local state with URL param
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams]);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchQuery(term);

        // Debounce the router push
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            if (term) {
                params.set('search', term);
            } else {
                params.delete('search');
            }
            if (pathname.includes('/conversations') || pathname.includes('/users')) {
                router.push(`${pathname}?${params.toString()}`);
            }
        }, 300);
    };

    return (
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
                type="text"
                placeholder="Search..." // Shortened for mobile fit
                value={searchQuery}
                onChange={onSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>
    );
};

const Header = ({ toggleSidebar }: HeaderProps) => {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8 fixed top-0 right-0 left-0 lg:left-64 z-40 transition-all duration-300">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <Suspense fallback={<div className="h-10 w-full bg-gray-50 rounded-lg animate-pulse" />}>
                    <SearchBar />
                </Suspense>
            </div>

            <div className="flex items-center gap-3 lg:gap-6 ml-4">
                {/* Profile/Notification section removed as per request */}
            </div>
        </header>
    );
};

export default Header;
