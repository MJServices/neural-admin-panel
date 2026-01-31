
import { Eye, Trash, Star, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getUsers, deleteUser } from '@/app/actions';

import { Suspense } from 'react';

const UsersTableContent = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // To trigger re-fetch after delete
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const router = useRouter();

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            try {
                const { data } = await getUsers(10, 0, searchQuery);
                setUsers(data || []);
            } catch (error) {
                console.error('Failed to load users', error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, [searchQuery, refreshTrigger]);

    const handleView = (user: any) => {
        // Redirect to conversations filtered by this user
        if (user.full_name) {
            router.push(`/admin/conversations?search=${encodeURIComponent(user.full_name)}`);
        }
    };

    const handleDelete = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            const result = await deleteUser(userId);
            if (result.success) {
                setRefreshTrigger(prev => prev + 1); // Refresh list
            } else {
                alert('Failed to delete user.');
            }
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Loading users...</div>;
    }

    return (
        <div className="bg-white rounded-xl border overflow-hidden overflow-x-auto relative">
            <table className="w-full text-left min-w-[1000px]">
                <thead>
                    <tr className="border-b bg-white">
                        <th className="py-4 pl-6 w-10">
                            <input type="checkbox" className="rounded border-gray-300" />
                        </th>
                        <th className="py-4 text-xs font-semibold text-gray-800 uppercase tracking-wider w-[25%] whitespace-nowrap">Users</th>
                        <th className="py-4 text-xs font-semibold text-gray-800 uppercase tracking-wider whitespace-nowrap">Status</th>
                        <th className="py-4 text-xs font-semibold text-gray-800 uppercase tracking-wider whitespace-nowrap">Join Date</th>
                        <th className="py-4 text-xs font-semibold text-gray-800 uppercase tracking-wider whitespace-nowrap">Level</th>
                        <th className="py-4 text-xs font-semibold text-gray-800 uppercase tracking-wider text-center whitespace-nowrap">Conversation</th>
                        <th className="py-4 text-xs font-semibold text-gray-800 uppercase tracking-wider text-center whitespace-nowrap">Score</th>
                        <th className="py-4 text-xs font-semibold text-gray-800 uppercase tracking-wider text-center whitespace-nowrap">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="py-8 text-center text-gray-400">No users found</td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-6">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-blue-100 text-blue-600`}>
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                (user.full_name || user.email || 'U').charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{user.full_name || 'Unknown'}</h4>
                                            <p className="text-[10px] text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${user.is_verified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {user.is_verified ? 'Verified' : 'Unverified'}
                                    </span>
                                </td>
                                <td className="py-4 text-xs text-gray-600 font-medium">
                                    {new Date(user.member_since).toLocaleDateString()}
                                </td>
                                <td className="py-4 text-xs text-gray-600 font-medium">
                                    Level {user.level || 1}
                                </td>
                                <td className="py-4 text-xs text-gray-600 font-medium text-center">
                                    {user.conversations_count || 0}
                                </td>
                                <td className="py-4 text-xs text-gray-600 font-medium text-center">
                                    {user.bond_score || 0}
                                </td>
                                <td className="py-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => handleView(user)}
                                            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                                            title="View User Conversations"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500"
                                            title="Delete User"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

const UsersTable = () => {
    return (
        <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading users...</div>}>
            <UsersTableContent />
        </Suspense>
    );
};

export default UsersTable;
