'use client';

import React, { useEffect, useState } from 'react';
import { PushNotificationManager } from '@/components/PushNotificationManager';
import { createClient } from '@/utils/supabase/client';
import { Calendar, MessageSquare, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function NotificationsPage() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchActivity = async () => {
            setLoading(true);
            try {
                // Fetch recent bookings
                const { data: bookings } = await supabase
                    .from('bookings')
                    .select('id, guest_name, created_at, status')
                    .order('created_at', { ascending: false })
                    .limit(5);

                // Fetch recent inquiries
                const { data: inquiries } = await supabase
                    .from('inquiries')
                    .select('id, name, created_at, type')
                    .order('created_at', { ascending: false })
                    .limit(5);

                // Combine and sort
                const combined = [
                    ...(bookings?.map(b => ({ ...b, source: 'booking' })) || []),
                    ...(inquiries?.map(i => ({ ...i, source: 'inquiry' })) || [])
                ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

                setActivities(combined);
            } catch (error) {
                console.error('Error fetching activity:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, []);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-serif text-admin-forest">Notifications</h1>
                <p className="text-gray-500 mt-2">Manage your alerts and view recent activity.</p>
            </header>

            {/* Push Settings */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-admin-forest/5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Push Configuration</h2>
                <PushNotificationManager />
            </section>

            {/* Recent Activity */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-admin-forest/5">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-admin-gold" />
                    </div>
                ) : activities.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recent activity found.</p>
                ) : (
                    <div className="space-y-4">
                        {activities.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-admin-sand/10 transition-colors border border-gray-100">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                                    ${item.source === 'booking' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                    {item.source === 'booking' ? <Calendar size={18} /> : <MessageSquare size={18} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        {item.source === 'booking' ? 'New Booking Request' : 'New Inquiry'}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        From <span className="font-medium text-admin-forest">{item.guest_name || item.name || 'Unknown'}</span>
                                    </p>
                                    <span className="text-xs text-gray-400 mt-2 block">
                                        {format(new Date(item.created_at), 'PPP p')}
                                    </span>
                                </div>
                                <div className="ml-auto">
                                    {item.source === 'booking' && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize
                                            ${item.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                item.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'}`}>
                                            {item.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
