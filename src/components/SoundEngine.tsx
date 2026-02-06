'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { SoundType } from '@/types';
import { getSoundManager } from '@/lib/sounds';

interface SoundEngineProps {
    currentSound: SoundType;
    volume: number;
    onSoundChange: (type: SoundType) => void;
    onVolumeChange: (volume: number) => void;
    isTimerRunning: boolean;
}

const SOUNDS: { type: SoundType; label: string }[] = [
    { type: 'none', label: 'Off' },
    { type: 'rain', label: 'Rain' },
    { type: 'lofi', label: 'Lofi' },
    { type: 'cafe', label: 'Cafe' },
    { type: 'whiteNoise', label: 'Noise' },
];

export function SoundEngine({
    currentSound,
    volume,
    onSoundChange,
    onVolumeChange,
    isTimerRunning,
}: SoundEngineProps) {
    const [visualizerLevels, setVisualizerLevels] = useState([0.3, 0.5, 0.7, 0.4, 0.6]);
    const animationRef = useRef<number | undefined>(undefined);

    // Animate visualizer when playing
    useEffect(() => {
        if (currentSound !== 'none' && isTimerRunning) {
            const animate = () => {
                setVisualizerLevels(
                    Array(5)
                        .fill(0)
                        .map(() => 0.2 + Math.random() * 0.8)
                );
                animationRef.current = requestAnimationFrame(animate);
            };

            const interval = setInterval(() => {
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
                animate();
            }, 150);

            return () => {
                clearInterval(interval);
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
            };
        } else {
            setVisualizerLevels([0.3, 0.5, 0.7, 0.4, 0.6]);
        }
    }, [currentSound, isTimerRunning]);

    // Control sound playback
    useEffect(() => {
        const manager = getSoundManager();
        manager.setVolume(volume);

        if (isTimerRunning && currentSound !== 'none') {
            manager.play(currentSound);
        } else {
            manager.stop();
        }
    }, [currentSound, volume, isTimerRunning]);

    const handleSoundSelect = (type: SoundType) => {
        onSoundChange(type);
    };

    return (
        <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            {/* Sound Type Selector */}
            <div className="flex items-center gap-2">
                {SOUNDS.map((sound) => (
                    <motion.button
                        key={sound.type}
                        onClick={() => handleSoundSelect(sound.type)}
                        className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors"
                        style={{
                            backgroundColor:
                                currentSound === sound.type
                                    ? 'var(--color-surface)'
                                    : 'transparent',
                            border:
                                currentSound === sound.type
                                    ? '1px solid var(--color-accent)'
                                    : '1px solid transparent',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span
                            className="text-[10px] font-medium uppercase tracking-wider"
                            style={{
                                color:
                                    currentSound === sound.type
                                        ? 'var(--color-text-primary)'
                                        : 'var(--color-text-muted)',
                            }}
                        >
                            {sound.label}
                        </span>
                    </motion.button>
                ))}
            </div>

            {/* Volume Slider with Visualizer */}
            {currentSound !== 'none' && (
                <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    {/* Mini Visualizer */}
                    <div className="flex items-end gap-0.5 h-6 w-8">
                        {visualizerLevels.map((level, i) => (
                            <motion.div
                                key={i}
                                className="w-1 rounded-full"
                                style={{ backgroundColor: 'var(--color-accent)' }}
                                animate={{ height: `${level * 100}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        ))}
                    </div>

                    {/* Volume Slider */}
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                        className="flex-1 h-1 appearance-none rounded-full cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, var(--color-accent) ${volume * 100}%, var(--color-border) ${volume * 100}%)`,
                        }}
                    />

                    {/* Volume Percentage */}
                    <span
                        className="text-xs font-display tabular-nums w-8"
                        style={{ color: 'var(--color-text-secondary)' }}
                    >
                        {Math.round(volume * 100)}%
                    </span>
                </motion.div>
            )}
        </motion.div>
    );
}
