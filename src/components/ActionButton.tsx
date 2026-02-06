'use client';

import { motion } from 'framer-motion';
import { TimerStatus } from '@/hooks/useTimer';

interface ActionButtonProps {
    status: TimerStatus;
    onStart: () => void;
    onReset: () => void;
    onPause: () => void;
}

export function ActionButton({ status, onStart, onReset, onPause }: ActionButtonProps) {
    const isIdle = status === 'idle';
    const isRunning = status === 'running';
    const isPaused = status === 'paused';

    // Determine button label and action
    const getButtonConfig = () => {
        if (isIdle) {
            return { label: 'Initialize', action: onStart, variant: 'primary' as const };
        }
        if (isRunning) {
            return { label: 'Pause', action: onPause, variant: 'secondary' as const };
        }
        // isPaused
        return { label: 'Resume', action: onStart, variant: 'primary' as const };
    };

    const { label, action, variant } = getButtonConfig();

    return (
        <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
                delay: 0.2,
            }}
        >
            {/* Main Action Button */}
            <motion.button
                onClick={action}
                className="relative overflow-hidden rounded-full px-8 py-4 font-display text-sm font-medium uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                    backgroundColor: variant === 'primary' ? 'var(--color-text-primary)' : 'transparent',
                    color: variant === 'primary' ? 'var(--color-bg)' : 'var(--color-text-primary)',
                    border: variant === 'secondary' ? '1px solid var(--color-border)' : 'none',
                }}
                whileHover={{
                    scale: 1.02,
                    boxShadow: variant === 'primary'
                        ? '0 8px 32px rgba(250, 250, 250, 0.15)'
                        : 'none',
                }}
                whileTap={{ scale: 0.98 }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                }}
            >
                {/* Silky hover effect */}
                <motion.span
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                    }}
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
                <span className="relative z-10">{label}</span>
            </motion.button>

            {/* Reset Button (only visible when not idle) */}
            {!isIdle && (
                <motion.button
                    onClick={onReset}
                    className="rounded-full px-6 py-4 font-display text-sm font-medium uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-2"
                    style={{
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)',
                    }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    whileHover={{
                        scale: 1.02,
                        borderColor: 'var(--color-accent)',
                        color: 'var(--color-accent)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                    }}
                >
                    Reset
                </motion.button>
            )}
        </motion.div>
    );
}
