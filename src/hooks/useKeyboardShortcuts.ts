'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
    onStartPause: () => void;
    onReset: () => void;
    onToggleMute: () => void;
    onShowHelp: () => void;
}

export function useKeyboardShortcuts({
    onStartPause,
    onReset,
    onToggleMute,
    onShowHelp,
}: KeyboardShortcuts): void {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Ignore if user is typing in an input
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            switch (event.key.toLowerCase()) {
                case ' ':
                    event.preventDefault();
                    onStartPause();
                    break;
                case 'r':
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        onReset();
                    }
                    break;
                case 'm':
                    event.preventDefault();
                    onToggleMute();
                    break;
                case '?':
                    event.preventDefault();
                    onShowHelp();
                    break;
            }
        },
        [onStartPause, onReset, onToggleMute, onShowHelp]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
