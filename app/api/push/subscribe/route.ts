
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Adjust based on your supabase client path

export async function POST(request: NextRequest) {
    try {
        const subscription = await request.json();

        if (!subscription || !subscription.endpoint) {
            return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
        }

        // Save to Supabase
        const { error } = await supabase.from('admin_push_subscriptions').upsert({
            endpoint: subscription.endpoint,
            keys: subscription.keys,
            user_agent: request.headers.get('user-agent') || 'unknown',
            updated_at: new Date().toISOString()
        }, { onConflict: 'endpoint' });

        if (error) {
            console.error('Supabase error:', error);
            // Don't fail the request if just db error, but good to know
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Push subscribe error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
