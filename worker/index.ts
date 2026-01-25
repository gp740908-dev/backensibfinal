
'use client';

// Helper to listen for push events
// Note: This file is compiled by next-pwa and appended to sw.js

declare let self: ServiceWorkerGlobalScope;

self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const data = event.data?.json() ?? {};
    const title = data.title || 'Admin Notification';
    const message = data.body || 'New activity in dashboard';
    const icon = '/android-chrome-192x192.png';
    const badge = '/favicon-32x32.png';

    const options = {
        body: message,
        icon: icon,
        badge: badge,
        data: {
            url: data.url || '/dashboard'
        },
        vibrate: [100, 50, 100],
        actions: [
            { action: 'open', title: 'View' }
        ]
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const urlToOpen = event.notification.data.url;

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (self.clients.openWindow) {
                return self.clients.openWindow(urlToOpen);
            }
        })
    );
});
