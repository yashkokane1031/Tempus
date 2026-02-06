'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    isSpotifyConnected,
    initiateSpotifyLogin,
    logoutSpotify,
    getCurrentPlayback,
    pausePlayback,
    resumePlayback,
    skipToNext,
    skipToPrevious,
    SpotifyPlaybackState,
} from '@/lib/spotify';

interface UseSpotifyReturn {
    isConnected: boolean;
    isLoading: boolean;
    playbackState: SpotifyPlaybackState | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    togglePlayback: () => Promise<void>;
    next: () => Promise<void>;
    previous: () => Promise<void>;
}

export function useSpotify(): UseSpotifyReturn {
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [playbackState, setPlaybackState] = useState<SpotifyPlaybackState | null>(null);
    const pollInterval = useRef<NodeJS.Timeout | null>(null);

    // Check connection status on mount
    useEffect(() => {
        setIsConnected(isSpotifyConnected());
        setIsLoading(false);
    }, []);

    // Poll for playback state when connected
    useEffect(() => {
        if (!isConnected) {
            setPlaybackState(null);
            return;
        }

        const fetchPlayback = async () => {
            const state = await getCurrentPlayback();
            setPlaybackState(state);
        };

        // Initial fetch
        fetchPlayback();

        // Poll every 2 seconds
        pollInterval.current = setInterval(fetchPlayback, 2000);

        return () => {
            if (pollInterval.current) {
                clearInterval(pollInterval.current);
            }
        };
    }, [isConnected]);

    const connect = useCallback(async () => {
        await initiateSpotifyLogin();
    }, []);

    const disconnect = useCallback(() => {
        logoutSpotify();
        setIsConnected(false);
        setPlaybackState(null);
    }, []);

    const togglePlayback = useCallback(async () => {
        if (!playbackState) return;

        if (playbackState.is_playing) {
            await pausePlayback();
        } else {
            await resumePlayback();
        }

        // Optimistic update
        setPlaybackState((prev) =>
            prev ? { ...prev, is_playing: !prev.is_playing } : null
        );
    }, [playbackState]);

    const next = useCallback(async () => {
        await skipToNext();
        // Fetch new state after a short delay
        setTimeout(async () => {
            const state = await getCurrentPlayback();
            setPlaybackState(state);
        }, 300);
    }, []);

    const previous = useCallback(async () => {
        await skipToPrevious();
        setTimeout(async () => {
            const state = await getCurrentPlayback();
            setPlaybackState(state);
        }, 300);
    }, []);

    return {
        isConnected,
        isLoading,
        playbackState,
        connect,
        disconnect,
        togglePlayback,
        next,
        previous,
    };
}
