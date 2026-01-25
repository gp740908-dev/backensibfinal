
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import webpush from '@/utils/webPush';

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();
        const { title, body, url } = payload;

        // Fetch all admin subscriptions
        const { data: subscriptions, error } = await supabase
            .from('admin_push_subscriptions')
            .select('*');

        if (error || !subscriptions) {
            console.error('Failed to fetch subs:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        const notificationPayload = JSON.stringify({
            title: title || 'Admin Alert',
            body: body || 'New activity detected',
            url: url || '/dashboard'
        });

        const promises = subscriptions.map(sub => {
            return webpush.sendNotification({
                endpoint: sub.endpoint,
                keys: sub.keys
            }, notificationPayload)
                .catch((err: any) => {
                    // If 410 Gone, delete subscription
                    if (err.statusCode === 410) {
                        supabase.from('admin_push_subscriptions').delete().eq('endpoint', sub.endpoint);
                    }
                    console.error('Send error:', err);
                });
        });

        await Promise.all(promises);

        return NextResponse.json({ success: true, count: subscriptions.length });

    } catch (error: any) {
        console.error('Push send error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
