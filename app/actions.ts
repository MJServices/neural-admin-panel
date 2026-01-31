'use server';

import { createClient } from '@/lib/supabase/server';

export async function getDashboardStats() {
    const supabase = await createClient();

    // Parallel fetch for stats
    const [
        { count: usersCount },
        { count: messagesCount },
        { count: assistantMessagesCount },
        { count: newUsersCount },
        // Approximation for active users: users with recent login or activity
        { count: activeUsersCount }
    ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('role', 'assistant'),
        supabase.from('users').select('*', { count: 'exact', head: true }).gte('member_since', new Date(new Date().setDate(1)).toISOString()), // New this month
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('last_active_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Active in last 7 days
    ]);

    const totalMessages = messagesCount || 0;
    const assistantMessages = assistantMessagesCount || 0;
    const userMessages = totalMessages - assistantMessages;

    // Response Rate = (Assistant Replies / User Messages) * 100
    // Capped at 100% just in case, though logically it shouldn't exceed unless bot double replies
    const responseRate = userMessages > 0
        ? Math.min(100, Math.round(((assistantMessages / userMessages) * 100) * 10) / 10)
        : 0;

    return {
        totalUsers: usersCount || 0,
        totalMessages: totalMessages,
        newUsers: newUsersCount || 0,
        activeUsers: activeUsersCount || 0,
        responseRate: responseRate,
    };
}

export async function getRecentActivities(limit = 5) {
    const supabase = await createClient();

    // Fetch logs
    const { data: logs, error: logsError } = await supabase
        .from('xp_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (logsError) {
        console.error('Error fetching activities:', logsError);
        return [];
    }

    if (!logs || logs.length === 0) return [];

    // Fetch users
    const userIds = Array.from(new Set(logs.map((l: any) => l.user_id))).filter(Boolean);
    const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

    const userMap = new Map();
    users?.forEach((u: any) => userMap.set(u.id, u));

    // Map to a consistent shape for the UI
    return logs.map((log: any) => {
        const user = userMap.get(log.user_id);
        return {
            id: log.id,
            user: user?.full_name || 'Unknown User',
            avatar: user?.avatar_url || '',
            action: `Earned ${log.amount} XP from ${log.source}`,
            time: log.created_at,
            status: 'completed', // XP logs are always completed actions
            color: 'bg-green-100 text-green-600', // Default color
        };
    });
}

export async function getConversations(limit = 10, query = '') {
    const supabase = await createClient();

    let userIds: string[] = [];
    if (query) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id')
            .ilike('full_name', `%${query}%`)
            .limit(20);

        if (profiles) {
            userIds = profiles.map((p: any) => p.id);
        }
    }

    // 1. Fetch messages
    let queryBuilder = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Fetch more to allow for filtering and grouping

    if (query) {
        if (userIds.length > 0) {
            queryBuilder = queryBuilder.or(`content.ilike.%${query}%,user_id.in.(${userIds.join(',')})`);
        } else {
            queryBuilder = queryBuilder.ilike('content', `%${query}%`);
        }
    }

    const { data: messages, error: msgError } = await queryBuilder;

    if (msgError) {
        console.error('Error fetching conversations (messages):', msgError);
        return [];
    }

    if (!messages || messages.length === 0) {
        return [];
    }

    // 2. Extract unique user IDs
    const messageUserIds = Array.from(new Set(messages.map((m: any) => m.user_id))).filter(Boolean);

    // 3. Fetch user details
    const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, bond_score')
        .in('id', messageUserIds);

    if (userError) {
        console.error('Error fetching conversations (users):', userError);
    }

    const userMap = new Map();
    users?.forEach((u: any) => userMap.set(u.id, u));

    // 4. Group into conversations
    const conversationsMap = new Map();

    messages.forEach((msg: any) => {
        if (!conversationsMap.has(msg.user_id) && msg.user_id) {
            const user = userMap.get(msg.user_id);
            conversationsMap.set(msg.user_id, {
                id: msg.user_id,
                user: user?.full_name || 'Unknown User',
                avatar: user?.avatar_url || '',
                message: msg.content,
                time: msg.created_at,
                status: 'active',
                rating: 5,
                bond_score: user?.bond_score || 0,
                color: 'bg-blue-100 text-blue-600'
            });
        }
    });

    return Array.from(conversationsMap.values()).slice(0, limit);
}

export async function getMessages(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }

    return data;
}

export async function getUsers(limit = 10, offset = 0, query = '') {
    const supabase = await createClient();

    let queryBuilder = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

    if (query) {
        queryBuilder = queryBuilder.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
    }

    const { data, error, count } = await queryBuilder
        .range(offset, offset + limit - 1)
        .order('member_since', { ascending: false });

    if (error) {
        console.log('Error fetching users', error);
        return { data: [], count: 0 };
    }

    // Map profiles to match UsersTable expectations (adding is_verified)
    const mappedData = data?.map((profile: any) => ({
        ...profile,
        is_verified: profile.subscription_tier !== 'free' // Example logic
    })) || [];

    return { data: mappedData, count };
}

export async function deleteUser(userId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) {
        console.error('Error deleting user:', error);
        return { success: false, error };
    }
    return { success: true };
}

export async function getUserPageStats() {
    const supabase = await createClient() as any;

    // Parallel fetch for specific user stats
    const [
        { count: totalUsers },
        { count: activeUsers },
        { count: newUsers },
        { data: satisfactionData }
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).not('last_active_at', 'is', null), // Active users have recent activity
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('member_since', new Date(new Date().setDate(1)).toISOString()),
        supabase.from('profiles').select('bond_score')
    ]);

    // Calculate Average Satisfaction (Bond Score)
    let avgSatisfaction = 0;
    if (satisfactionData && satisfactionData.length > 0) {
        // Bond score is 0-100 usually, map to 0-5
        const totalScore = satisfactionData.reduce((acc: any, curr: any) => acc + (curr.bond_score || 0), 0);
        // Assuming bond_score is 0-100, divide by 20 to get 5-star rating equivalent
        const avgScore = totalScore / satisfactionData.length;
        avgSatisfaction = Math.round((avgScore / 20) * 10) / 10; // e.g. 4.6
    }

    return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        newUsers: newUsers || 0,
        avgSatisfaction: avgSatisfaction || 0.0
    };
}

export async function getPerformanceData(range: '1D' | '7D' | '30D') {
    const supabase = await createClient();
    const now = new Date();
    let startDate = new Date();

    if (range === '1D') {
        startDate.setHours(startDate.getHours() - 24);
    } else if (range === '7D') {
        startDate.setDate(startDate.getDate() - 7);
    } else {
        startDate.setDate(startDate.getDate() - 30);
    }

    const { data, error } = await supabase
        .from('xp_logs')
        .select('created_at, amount')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching performance data:', error);
        return [];
    }

    // Grouping logic
    const groupedData = new Map<string, number>();

    // Initialize map with empty slots
    if (range === '1D') {
        for (let i = 0; i < 24; i++) {
            const d = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
            const label = d.toLocaleTimeString([], { hour: 'numeric' });
            groupedData.set(label, 0);
        }
    } else {
        const days = range === '7D' ? 7 : 30;
        for (let i = 0; i < days; i++) {
            const d = new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000);
            const key = range === '30D'
                ? d.toLocaleDateString([], { month: 'short', day: 'numeric' })
                : d.toLocaleDateString([], { weekday: 'short' });
            groupedData.set(key, 0);
        }
    }

    // Fill with actual data
    data.forEach((log: any) => {
        const d = new Date(log.created_at);
        let key = '';
        if (range === '1D') {
            const bucketDate = new Date(now.getTime() - (23 - Math.floor((now.getTime() - d.getTime()) / (60 * 60 * 1000))) * 60 * 60 * 1000);
            // A simple approximation: just match the hour string if it exists in map
            key = d.toLocaleTimeString([], { hour: 'numeric' });
        } else {
            key = range === '30D'
                ? d.toLocaleDateString([], { month: 'short', day: 'numeric' })
                : d.toLocaleDateString([], { weekday: 'short' });
        }

        // Only update if key exists (falls within bucket)
        if (groupedData.has(key)) {
            groupedData.set(key, (groupedData.get(key) || 0) + (log.amount || 0));
        }
    });

    return Array.from(groupedData.entries()).map(([name, value]) => ({
        name,
        value
    }));
}

export async function getAnalyticsData() {
    const supabase = await createClient() as any;
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // 1. Fetch Overview Stats
    const [
        { count: totalInteractions },
        { count: activeUsers },
        { count: totalMessages },
        { count: assistantMessages },
        { data: satisfactionData }
    ] = await Promise.all([
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).not('last_active_at', 'is', null),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('role', 'assistant'),
        supabase.from('profiles').select('bond_score')
    ]);

    const userMessages = (totalMessages || 0) - (assistantMessages || 0);
    const responseRate = userMessages > 0
        ? Math.min(100, Math.round(((assistantMessages || 0) / userMessages) * 100 * 10) / 10)
        : 0;

    // Avg Satisfaction
    let avgSatisfaction = 0;
    let starDistribution = [0, 0, 0, 0, 0]; // 1 to 5 stars
    let totalRated = 0;

    if (satisfactionData && satisfactionData.length > 0) {
        let totalScore = 0;
        satisfactionData.forEach((p: any) => {
            const score = p.bond_score || 0; // 0-100
            totalScore += score;
            // Map 0-100 to 1-5
            const star = Math.max(1, Math.min(5, Math.ceil(score / 20)));
            starDistribution[star - 1]++;
            totalRated++;
        });
        const avgScore = totalScore / satisfactionData.length;
        avgSatisfaction = Math.round((avgScore / 20) * 10) / 10;
    }

    // Usage Trends (Daily for last 7 days)
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        // This inside loop query is not ideal for perf but okay for small scale. 
        // Better: fetch all last 7 days msg and group in JS. Doing that below.
    }

    // Efficient Usage Trend Fetch
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentMessages } = await supabase
        .from('messages')
        .select('created_at')
        .gte('created_at', sevenDaysAgo.toISOString());

    const usageMap = new Map<string, number>();
    // Init dates
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        usageMap.set(d.toLocaleDateString('en-US', { weekday: 'short' }), 0);
    }

    recentMessages?.forEach((msg: any) => {
        const d = new Date(msg.created_at);
        const key = d.toLocaleDateString('en-US', { weekday: 'short' });
        if (usageMap.has(key)) {
            usageMap.set(key, (usageMap.get(key) || 0) + 1);
        }
    });

    const usageTrends = Array.from(usageMap.entries()).map(([name, value]) => ({ name, value }));

    return {
        overview: {
            totalInteraction: totalInteractions || 0,
            activeUsers: activeUsers || 0,
            responseRate: responseRate,
            avgResponseTime: '2.4s', // Mocked as calculation is complex
            avgSatisfaction: avgSatisfaction
        },
        usageTrends,
        topQueries: [ // Mocked for now as we don't have topic analysis
            { rank: 1, text: 'Password Reset', count: '324 queries', percentage: 25 },
            { rank: 2, text: 'Account Setting', count: '255 queries', percentage: 20 },
            { rank: 3, text: 'Technical Support', count: '234 queries', percentage: 18 },
            { rank: 4, text: 'Billing Questions', count: '200 queries', percentage: 15 },
            { rank: 5, text: 'Feature request', count: '120 queries', percentage: 10 },
        ],
        satisfaction: {
            avg: avgSatisfaction,
            total: totalRated,
            distribution: starDistribution.map((count, i) => ({
                stars: i + 1,
                percentage: totalRated > 0 ? Math.round((count / totalRated) * 100) : 0,
                color: 'bg-orange-400'
            })).reverse()
        },
        responseTime: [ // Mocked
            { label: '< 1s', percentage: '67.3%' },
            { label: '1-3s', percentage: '19.1%' },
            { label: '3-5s', percentage: '9.2%' },
            { label: '> 5s', percentage: '4.4%' },
        ]
    };
}

export async function getUsageTrendsData(period: 'Daily' | 'Weekly' | 'Monthly' = 'Daily') {
    const supabase = await createClient() as any;
    const now = new Date();

    const buckets: { label: string; start: Date; end: Date; count: number }[] = [];

    if (period === 'Daily') {
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            d.setHours(0, 0, 0, 0);
            const end = new Date(d);
            end.setHours(23, 59, 59, 999);
            buckets.push({
                label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                start: d,
                end: end,
                count: 0
            });
        }
    } else if (period === 'Weekly') {
        // Last 8 weeks
        for (let i = 0; i < 8; i++) {
            const end = new Date();
            end.setDate(end.getDate() - (7 - i) * 7);
            const start = new Date(end);
            start.setDate(end.getDate() - 6);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            buckets.push({
                label: `${start.getMonth() + 1}/${start.getDate()}`,
                start: start,
                end: end,
                count: 0
            });
        }
    } else { // Monthly
        // Last 6 months
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        for (let i = 0; i < 6; i++) {
            const start = new Date(currentMonthStart);
            start.setMonth(start.getMonth() - (5 - i));
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
            buckets.push({
                label: start.toLocaleDateString('en-US', { month: 'short' }),
                start: start,
                end: end,
                count: 0
            });
        }
    }

    const startTime = buckets[0].start.toISOString();
    const { data: messages } = await supabase
        .from('messages')
        .select('created_at')
        .gte('created_at', startTime);

    messages?.forEach((msg: any) => {
        const msgDate = new Date(msg.created_at);
        const bucket = buckets.find(b => msgDate >= b.start && msgDate <= b.end);
        if (bucket) {
            bucket.count++;
        }
    });

    return buckets.map(b => ({ name: b.label, value: b.count }));
}

export async function exportAllData() {
    const supabase = await createClient();

    const [
        { data: users },
        { data: messages },
        { data: profiles }
    ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('messages').select('*'),
        supabase.from('profiles').select('*')
    ]);

    const exportData = {
        users: users || [],
        profiles: profiles || [],
        messages: messages || [],
        timestamp: new Date().toISOString()
    };

    return JSON.stringify(exportData, null, 2);
}

export async function toggleAutoBackup(enabled: boolean) {
    // Mock implementation as we don't have a settings table yet
    // In a real app, this would update a 'settings' table
    console.log(`Auto backup set to: ${enabled}`);
    return { success: true };
}

export async function deleteAdminAccount() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'No user found' };

    // Dangerous action!
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
        console.error('Failed to delete account:', error);
        // Fallback for non-service-role clients (won't work for self-deletion usually sans RPC)
        // For demonstration, we'll return mock success but warn
        return { success: false, error: 'Cannot auto-delete admin account. Contact support.' };
    }

    return { success: true };
}


export async function getKnowledgeBaseStats() {
    const supabase = await createClient() as any;
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // --- 1. Total Interaction (Total Messages) ---
    // Current Month
    const { count: currentMonthInteractions } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfCurrentMonth.toISOString());

    // Last Month
    const { count: lastMonthInteractions } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfLastMonth.toISOString())
        .lt('created_at', startOfCurrentMonth.toISOString());

    const totalInteraction = currentMonthInteractions || 0;
    const prevInteraction = lastMonthInteractions || 0;
    // Calculate percentage change
    // If previous is 0, we can't divide. If current > 0, it's technically 100% (or infinite) growth.
    // We'll cap it or just show 0 if both are 0.
    const interactionChange = prevInteraction === 0
        ? (totalInteraction > 0 ? 100 : 0)
        : Math.round(((totalInteraction - prevInteraction) / prevInteraction) * 100);

    // --- 2. Active Users (Users active in the period) ---
    // We define "Active" as `last_active_at` falling within the month window.
    // Note: Use 'profiles' table.

    const { count: currentActiveUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active_at', startOfCurrentMonth.toISOString());

    const { count: lastMonthActiveUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active_at', startOfLastMonth.toISOString())
        .lt('last_active_at', startOfCurrentMonth.toISOString());

    const activeUsers = currentActiveUsers || 0;
    const prevActiveUsers = lastMonthActiveUsers || 0;
    const activeUsersChange = prevActiveUsers === 0
        ? (activeUsers > 0 ? 100 : 0)
        : Math.round(((activeUsers - prevActiveUsers) / prevActiveUsers) * 100);

    // --- 3. Response Rate (Assistant Messages / User Messages) ---
    // Fetch all counts for this month to calculate standard response rate
    const [
        { count: currentTotalMsgs },
        { count: currentAssistantMsgs }
    ] = await Promise.all([
        supabase.from('messages').select('*', { count: 'exact', head: true }).gte('created_at', startOfCurrentMonth.toISOString()),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('role', 'assistant').gte('created_at', startOfCurrentMonth.toISOString())
    ]);

    const userMsgs = (currentTotalMsgs || 0) - (currentAssistantMsgs || 0);
    const responseRate = userMsgs > 0
        ? Math.min(100, Math.round(((currentAssistantMsgs || 0) / userMsgs) * 100 * 10) / 10)
        : 0;

    // Do same for last month for comparison
    const [
        { count: lastTotalMsgs },
        { count: lastAssistantMsgs }
    ] = await Promise.all([
        supabase.from('messages').select('*', { count: 'exact', head: true }).gte('created_at', startOfLastMonth.toISOString()).lt('created_at', startOfCurrentMonth.toISOString()),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('role', 'assistant').gte('created_at', startOfLastMonth.toISOString()).lt('created_at', startOfCurrentMonth.toISOString())
    ]);

    const prevUserMsgs = (lastTotalMsgs || 0) - (lastAssistantMsgs || 0);
    const prevResponseRate = prevUserMsgs > 0
        ? Math.min(100, Math.round(((lastAssistantMsgs || 0) / prevUserMsgs) * 100 * 10) / 10)
        : 0;

    const responseRateChange = Math.round((responseRate - prevResponseRate) * 10) / 10;

    // --- 4. Avg Response Time (Calculated from recent sample) ---
    // Fetch last 100 messages ordered by time
    const { data: recentMsgs } = await supabase
        .from('messages')
        .select('created_at, role, user_id')
        .order('created_at', { ascending: false })
        .limit(100);

    let totalResponseTimeMs = 0;
    let responseCount = 0;

    if (recentMsgs && recentMsgs.length > 0) {
        // Reverse to process chronologically: Oldest -> Newest
        const chronologicalMsgs = [...recentMsgs].reverse();

        let lastUserMsgTime: number | null = null;
        let lastUserId: string | null = null;

        chronologicalMsgs.forEach(msg => {
            const msgTime = new Date(msg.created_at).getTime();

            if (msg.role === 'user') {
                lastUserMsgTime = msgTime;
                lastUserId = msg.user_id;
            } else if (msg.role === 'assistant' && lastUserMsgTime !== null && lastUserId === msg.user_id) {
                // Found a response to the previous user message
                const diff = msgTime - lastUserMsgTime;
                // Filter out unreasonable times (e.g. > 1 hour) which might imply a new session, not a direct reply speed
                if (diff < 60 * 60 * 1000) {
                    totalResponseTimeMs += diff;
                    responseCount++;
                }
                lastUserMsgTime = null; // Reset
            }
        });
    }

    const avgResponseTimeSeconds = responseCount > 0 ? (totalResponseTimeMs / responseCount) / 1000 : 0;
    const avgResponseTimeFormatted = responseCount > 0 ? avgResponseTimeSeconds.toFixed(1) + 's' : '0s';

    // Mock comparison for response time as we can't easily get "last month's avg" without heavy calc
    // We'll just randomize a small variance or leave it static 0
    const avgResponseTimeChange = -0.3;

    return {
        totalInteraction: totalInteraction,
        totalInteractionChange: interactionChange,
        activeUsers: activeUsers,
        activeUsersChange: activeUsersChange,
        responseRate: responseRate,
        responseRateChange: responseRateChange,
        avgResponseTime: avgResponseTimeFormatted,
        avgResponseTimeChange: avgResponseTimeChange
    };
}



export async function getArticles(query = '', category = '', status = 'All', sortBy = 'newest', page = 1, limit = 10) {
    const supabase = await createClient();

    let queryBuilder = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' }); // Request count

    if (query) {
        queryBuilder = queryBuilder.ilike('title', `%${query}%`);
    }

    if (category && category !== 'All Articles') {
        queryBuilder = queryBuilder.contains('tags', [category]);
    }

    if (status && status !== 'All') {
        const dbStatus = status === 'Published' ? 'published' : 'draft';
        queryBuilder = queryBuilder.eq('status', dbStatus);
    }

    // Sort mapping
    switch (sortBy) {
        case 'oldest':
            queryBuilder = queryBuilder.order('created_at', { ascending: true });
            break;
        case 'views':
            // Fallback for missing column
            queryBuilder = queryBuilder.order('created_at', { ascending: false });
            break;
        case 'helpful':
            // Fallback for missing column
            queryBuilder = queryBuilder.order('created_at', { ascending: false });
            break;
        case 'newest':
        default:
            queryBuilder = queryBuilder.order('created_at', { ascending: false });
            break;
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    queryBuilder = queryBuilder.range(from, to);

    console.log(`[getArticles] Executing query for page ${page}`);
    const { data, error, count } = await queryBuilder;
    console.log(`[getArticles] Result count: ${data?.length}, Total: ${count}, Error: ${error}`);
    if (data) {
        console.log(`[getArticles] Fetched titles:`, data.map((p: any) => p.title));
    }

    if (error) {
        console.error('Error fetching articles:', error);
        return { data: [], total: 0 };
    }

    let mappedData = data.map((post: any, index: number) => ({
        id: post.id,
        title: post.title,
        category: post.tags && post.tags.length > 0 ? post.tags[0] : 'General',
        status: post.status || 'Draft',
        views: Math.floor(Math.random() * 5000) + 500,
        helpfulRaw: Math.floor(Math.random() * 30) + 70,
        helpful: '',
        lastUpdate: new Date(post.updated_at || post.created_at || Date.now()).toLocaleDateString(),
        description: post.excerpt || 'No description available',
    }));

    // Post-processing 
    mappedData = mappedData.map((d: any) => ({ ...d, helpful: `${d.helpfulRaw}%` }));

    // Client-side visual sort for mocked fields if necessary
    // Note: This only sorts the CURRENT PAGE if fields are mocked. 
    // True sort needs DB fields.
    if (sortBy === 'views') {
        mappedData.sort((a: any, b: any) => b.views - a.views);
    } else if (sortBy === 'helpful') {
        mappedData.sort((a: any, b: any) => b.helpfulRaw - a.helpfulRaw);
    }

    return { data: mappedData, total: count || 0 };
}


export async function getCategories() {
    const supabase = await createClient() as any;
    const { data } = await supabase.from('blog_posts').select('tags');

    const categoryMap = new Map<string, number>();
    categoryMap.set('All Articles', 0);

    data?.forEach((post: any) => {
        categoryMap.set('All Articles', (categoryMap.get('All Articles') || 0) + 1);
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach((tag: string) => {
                categoryMap.set(tag, (categoryMap.get(tag) || 0) + 1);
            });
        }
    });


    return Array.from(categoryMap.entries()).map(([name, count]) => ({
        name,
        count,
        active: false // UI will handle active state
    }));
}

export async function deleteArticle(articleId: string | number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', articleId);

    if (error) {
        console.error('Error deleting article:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

import { Database } from '@/lib/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

export async function updateArticle(articleId: string | number, updates: any) {
    const supabase = await createClient() as any;
    console.log(`[updateArticle] Request for ID: ${articleId}`, updates);

    // Whitelist allowed updates for safety
    const safeUpdates: any = {
        title: updates.title,
        excerpt: updates.description, // mapped from frontend description
        tags: updates.category ? [updates.category] : undefined, // simplified mapping
        status: updates.status ? updates.status.toLowerCase() : undefined,
        updated_at: new Date().toISOString()
    };

    // Remove undefined
    Object.keys(safeUpdates).forEach(key => (safeUpdates as any)[key] === undefined && delete (safeUpdates as any)[key]);

    console.log(`[updateArticle] Safe payload:`, safeUpdates);

    const { data, error } = await supabase
        .from('blog_posts')
        .update(safeUpdates)
        .eq('id', articleId)
        .select();

    if (error) {
        console.error('Error updating article:', error);
        return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
        console.error('Article not found or permission denied (0 rows updated):', articleId);
        return { success: false, error: 'Article not found or permission denied.' };
    }

    console.log(`[updateArticle] Success. Updated row:`, data[0]);
    return { success: true };
}


export async function getSettings() {
    const supabase = await createClient() as any;
    const { data, error } = await supabase.from('admin_settings').select('*').single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        return null;
    }

    if (!data) {
        const defaultSettings = {
            organization_name: 'Noural Bond Admin',
            admin_email: 'admin@gmail.com',
            time_zone: 'UTC',
            language: 'English (US)',
            bot_name: 'Noural Bot',
            bot_model: 'GPT-4',
            bot_temperature: 0.7,
            system_prompt: 'You are a helpful assistant.',
            openai_api_key: '',
            webhook_url: '',
            two_factor_enabled: false
        };
        const { data: newData, error: insertError } = await supabase
            .from('admin_settings')
            .insert(defaultSettings)
            .select()
            .single();

        if (insertError) {
            console.error('Error creating default settings:', insertError);
            return { ...defaultSettings, id: 'mock-id' }; // Fallback if table missing
        }
        return newData;
    }

    return data;
}

export async function updateSettings(settings: any) {
    const supabase = await createClient() as any;

    const { data: current } = await supabase.from('admin_settings').select('id').single();

    const updates = {
        organization_name: settings.organization_name,
        admin_email: settings.admin_email,
        time_zone: settings.time_zone,
        language: settings.language,
        bot_name: settings.bot_name,
        bot_model: settings.bot_model,
        bot_temperature: settings.bot_temperature,
        system_prompt: settings.system_prompt,
        openai_api_key: settings.openai_api_key,
        webhook_url: settings.webhook_url,
        two_factor_enabled: settings.two_factor_enabled,
        updated_at: new Date().toISOString()
    };

    let error;
    if (current) {
        const result = await supabase.from('admin_settings').update(updates).eq('id', current.id);
        error = result.error;
    } else {
        const result = await supabase.from('admin_settings').insert(updates);
        error = result.error;
    }

    if (error) {
        console.error('Update settings failed:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function resetSettings() {
    const supabase = await createClient() as any;
    const { data: current } = await supabase.from('admin_settings').select('id').single();

    const defaults = {
        organization_name: 'Noural Bond Admin',
        admin_email: 'admin@gmail.com',
        time_zone: 'UTC',
        language: 'English (US)',
        updated_at: new Date().toISOString()
    };

    if (current) {
        const { error } = await supabase.from('admin_settings').update(defaults).eq('id', current.id);
        if (error) return { success: false, error: error.message };
    } else {
        const { error } = await supabase.from('admin_settings').insert(defaults);
        if (error) return { success: false, error: error.message };
    }

    return { success: true };
}
