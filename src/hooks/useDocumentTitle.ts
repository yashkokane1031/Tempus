'use client';

import { useEffect, useRef } from 'react';

export function useDocumentTitle(title: string, restoreOnUnmount: boolean = true) {
    const originalTitleRef = useRef<string>('');

    useEffect(() => {
        // Store original title on first mount
        if (!originalTitleRef.current) {
            originalTitleRef.current = document.title;
        }

        // Update title
        document.title = title;

        // Restore on unmount if requested
        return () => {
            if (restoreOnUnmount && originalTitleRef.current) {
                document.title = originalTitleRef.current;
            }
        };
    }, [title, restoreOnUnmount]);
}

// Utility to format time for tab title
export function formatTimeForTitle(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
