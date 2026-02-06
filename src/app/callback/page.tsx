'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { exchangeCodeForToken } from '@/lib/spotify';

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('Spotify auth error:', error);
            router.replace('/?spotify_error=true');
            return;
        }

        if (code) {
            exchangeCodeForToken(code).then((success) => {
                if (success) {
                    router.replace('/?spotify_connected=true');
                } else {
                    router.replace('/?spotify_error=true');
                }
            });
        } else {
            router.replace('/');
        }
    }, [router, searchParams]);

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            <div className="flex flex-col items-center gap-4">
                <div
                    className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
                />
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Connecting to Spotify...
                </p>
            </div>
        </div>
    );
}

export default function SpotifyCallback() {
    return (
        <Suspense
            fallback={
                <div
                    className="min-h-screen flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-bg)' }}
                >
                    <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
                </div>
            }
        >
            <CallbackHandler />
        </Suspense>
    );
}
