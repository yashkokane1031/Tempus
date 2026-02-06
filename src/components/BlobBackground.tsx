'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BlobBackgroundProps {
    isPlaying?: boolean;
    intensity?: number; // 0-1 for sound reactivity
}

export function BlobBackground({ isPlaying = false, intensity = 0 }: BlobBackgroundProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="blob-container">
            {/* Primary accent blob */}
            <motion.div
                className={`blob blob-1 blob-reactive ${isPlaying ? 'active' : ''}`}
                animate={{
                    scale: isPlaying ? 1 + intensity * 0.2 : 1,
                    opacity: isPlaying ? 0.7 + intensity * 0.3 : 0.6,
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Secondary blob */}
            <motion.div
                className={`blob blob-2 blob-reactive ${isPlaying ? 'active' : ''}`}
                animate={{
                    scale: isPlaying ? 1 + intensity * 0.15 : 1,
                    opacity: isPlaying ? 0.5 + intensity * 0.2 : 0.5,
                }}
                transition={{ duration: 0.4, delay: 0.1 }}
            />

            {/* Tertiary blob */}
            <motion.div
                className={`blob blob-3 blob-reactive ${isPlaying ? 'active' : ''}`}
                animate={{
                    scale: isPlaying ? 1 + intensity * 0.25 : 1,
                    opacity: isPlaying ? 0.4 + intensity * 0.3 : 0.4,
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
            />
        </div>
    );
}
