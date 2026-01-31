import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');

    // Sync local state with URL param
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams]);

    const handleSearch = useCallback((term: string) => {
        setSearchQuery(term);

        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }

        // Only update URL if we are on a searchable page
        // For now, let's enable it for conversations and users
        if (pathname.includes('/conversations') || pathname.includes('/users')) {
            router.push(`${pathname}?${params.toString()}`);
        }
    }, [pathname, router, searchParams]);

    // Simple Debounce for URL update (visual feedback is immediate)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // The handleSearch updates state immediately, but we could debounce the router push here if we wanted separate logic.
            // Actually, standard pattern: 
            // Input onChange -> setSearchQuery -> useEffect([searchQuery]) -> debounce -> router.push
        }, 300);
    }, [searchQuery]);

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
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8 fixed top-0 right-0 left-0 lg:left-64 z-40 transition-all duration-300">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
                >
                    <Menu className="w-6 h-6" />
                </button>

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
            </div>

            <div className="flex items-center gap-3 lg:gap-6 ml-4">
                <button className="relative text-gray-500 hover:text-gray-700">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                        3
                    </span>
                </button>

                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="hidden lg:block text-right">
                        <span className="block text-sm font-medium text-gray-700">Admin User</span>
                    </div>
                    {/* Mobile optimization: just the chevron or avatar if existed */}
                    <span className="lg:hidden text-sm font-medium text-gray-700">Admin</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
            </div>
        </header>
    );
};

export default Header;
