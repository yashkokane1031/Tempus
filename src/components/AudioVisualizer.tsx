'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface AudioVisualizerProps {
    isPlaying: boolean;
    barCount?: number;
    height?: number;
    color?: string;
    frequencyData?: Uint8Array | null;
}

export function AudioVisualizer({
    isPlaying,
    barCount = 32,
    height = 40,
    color,
    frequencyData,
}: AudioVisualizerProps) {
    const [bars, setBars] = useState<number[]>(() =>
        Array(barCount).fill(0).map(() => 0.1)
    );
    const animationRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!isPlaying) {
            setBars(Array(barCount).fill(0).map(() => 0.05 + Math.random() * 0.05));
            return;
        }

        const animate = () => {
            if (frequencyData && frequencyData.length > 0) {
                // Use real audio data
                const step = Math.floor(frequencyData.length / barCount);
                const newBars: number[] = [];

                for (let i = 0; i < barCount; i++) {
                    // Sample frequency data and normalize to 0-1
                    const index = Math.min(i * step, frequencyData.length - 1);
                    const value = frequencyData[index] / 255;
                    // Apply some smoothing with minimum height
                    newBars.push(Math.max(0.05, value * 0.9 + 0.1));
                }

                setBars(prev =>
                    prev.map((bar, i) => {
                        // Smooth transition
                        const target = newBars[i] || 0.1;
                        return bar + (target - bar) * 0.3;
                    })
                );
            } else {
                // Fallback to random animation when no audio data
                setBars(prev =>
                    prev.map((bar, i) => {
                        const position = i / barCount;
                        const bassInfluence = 1 - position * 0.5;
                        const trebleInfluence = 0.5 + position * 0.5;
                        const baseHeight = 0.15 + Math.random() * 0.6;
                        const weighted = baseHeight * (position < 0.3 ? bassInfluence : trebleInfluence);
                        return bar + (weighted - bar) * 0.3;
                    })
                );
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, barCount, frequencyData]);

    const barWidth = 100 / barCount;
    const gap = barWidth * 0.2;
    const actualBarWidth = barWidth - gap;
    const barColor = color || 'var(--color-accent)';

    return (
        <div
            className="flex items-end justify-center overflow-hidden"
            style={{ height, width: '100%' }}
        >
            {bars.map((barHeight, i) => (
                <motion.div
                    key={i}
                    className="rounded-t-sm"
                    style={{
                        width: `${actualBarWidth}%`,
                        marginRight: i < barCount - 1 ? `${gap}%` : 0,
                        backgroundColor: isPlaying ? barColor : 'var(--color-border)',
                        opacity: isPlaying ? 0.7 + (barHeight * 0.3) : 0.3,
                    }}
                    animate={{
                        height: `${Math.min(barHeight * 100, 100)}%`,
                    }}
                    transition={{
                        duration: 0.05,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
}

