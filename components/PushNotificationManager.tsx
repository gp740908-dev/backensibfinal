
'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export const PushNotificationManager: React.FC = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(reg => {
                setRegistration(reg);
                reg.pushManager.getSubscription().then(sub => {
                    setIsSubscribed(!!sub);
                    setLoading(false);
                });
            });
        }
    }, []);

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    const subscribe = async () => {
        if (!registration || !VAPID_PUBLIC_KEY) {
            alert('Push notification configuration missing (VAPID Key)');
            return;
        }

        setLoading(true);
        try {
            const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            // Send to server
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub)
            });

            setIsSubscribed(true);
        } catch (error) {
            console.error('Subscription failed:', error);
            alert('Failed to subscribe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const unsubscribe = async () => {
        if (!registration) return;
        setLoading(true);
        try {
            const sub = await registration.pushManager.getSubscription();
            if (sub) {
                await sub.unsubscribe();
                // Ideally tell server to delete as well, but 410 handling covers it eventually
                setIsSubscribed(false);
            }
        } catch (error) {
            console.error('Unsubscribe failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!VAPID_PUBLIC_KEY) {
        return <div className="text-sm text-red-500">Push Notifications disabled (Missing Public Key)</div>;
    }

    return (
        <div className="p-4 bg-white/50 border border-gray-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSubscribed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {isSubscribed ? <Bell size={20} /> : <BellOff size={20} />}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">Push Notifications</h4>
                    <p className="text-sm text-gray-500">
                        {isSubscribed ? 'You will receive admin alerts on this device.' : 'Enable to get notified about bookings.'}
                    </p>
                </div>
            </div>

            <button
                onClick={isSubscribed ? unsubscribe : subscribe}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isSubscribed
                        ? 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                        : 'bg-admin-forest text-white hover:bg-admin-forest/90'
                    }`}
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : (
                    isSubscribed ? 'Disable' : 'Enable'
                )}
            </button>
        </div>
    );
};
