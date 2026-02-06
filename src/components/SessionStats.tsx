'use client';

import { motion } from 'framer-motion';

interface SessionStatsProps {
    todayMinutes: number;
    streak: number;
}

export function SessionStats({ todayMinutes, streak }: SessionStatsProps) {
    return (
        <motion.div
            className="bento-card flex gap-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
                delay: 0.3,
            }}
        >
            {/* Today's Focus Time */}
            <div className="flex flex-col gap-1">
                <span
                    className="text-xs uppercase tracking-widest"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    Today
                </span>
                <div className="flex items-baseline gap-1">
                    <span
                        className="font-display text-2xl font-semibold"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        {todayMinutes}
                    </span>
                    <span
                        className="text-sm"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        min
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div
                className="w-px self-stretch"
                style={{ backgroundColor: 'var(--color-border)' }}
            />

            {/* Current Streak */}
            <div className="flex flex-col gap-1">
                <span
                    className="text-xs uppercase tracking-widest"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    Streak
                </span>
                <div className="flex items-baseline gap-1">
                    <span
                        className="font-display text-2xl font-semibold"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        {streak}
                    </span>
                    <span
                        className="text-sm"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        {streak === 1 ? 'session' : 'sessions'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
