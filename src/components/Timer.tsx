'use client';

import { motion } from 'framer-motion';
import { TimerStatus } from '@/hooks/useTimer';

interface TimerProps {
    formattedTime: string;
    status: TimerStatus;
    progress: number;
}

export function Timer({ formattedTime, status, progress }: TimerProps) {
    const isActive = status === 'running';

    return (
        <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
                delay: 0.1
            }}
        >
            {/* Subtle background glow when active */}
            {isActive && (
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [0.9, 1.1, 0.9],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            )}

            {/* Timer Display */}
            <motion.span
                className={`timer-display relative z-10 select-none ${isActive ? 'glow-active' : ''}`}
                style={{
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
                }}
                animate={{
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
                }}
                transition={{ duration: 0.3 }}
            >
                {formattedTime}
            </motion.span>

            {/* Progress indicator removed - using ProgressArc instead */}
        </motion.div>
    );
}
