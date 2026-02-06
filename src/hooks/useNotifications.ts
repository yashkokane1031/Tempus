'use client';

import { useCallback, useEffect, useState } from 'react';

interface UseNotificationsReturn {
    permission: NotificationPermission | 'unsupported';
    requestPermission: () => Promise<void>;
    sendNotification: (title: string, body: string) => void;
}

export function useNotifications(): UseNotificationsReturn {
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

    useEffect(() => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            setPermission('unsupported');
            return;
        }
        setPermission(Notification.permission);
    }, []);

    const requestPermission = useCallback(async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            return;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    }, []);

    const sendNotification = useCallback(
        (title: string, body: string) => {
            if (permission !== 'granted') return;

            try {
                new Notification(title, {
                    body,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    tag: 'focus-timer',
                    requireInteraction: false,
                });
            } catch (error) {
                console.error('Error sending notification:', error);
            }
        },
        [permission]
    );

    return {
        permission,
        requestPermission,
        sendNotification,
    };
}
