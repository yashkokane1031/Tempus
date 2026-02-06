'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/hooks/useStore';

export function WeeklyChart() {
    const getWeeklyStats = useStore((state) => state.getWeeklyStats);
    const weeklyData = getWeeklyStats();

    const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 60);

    return (
        <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <h3
                className="text-xs font-medium uppercase tracking-widest"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                This Week
            </h3>

            <div className="flex items-end justify-between gap-2 h-32">
                {weeklyData.map((day, index) => {
                    const height = maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;
                    const isToday = index === 6;

                    return (
                        <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                            {/* Bar */}
                            <div className="relative w-full h-24 flex items-end justify-center">
                                <motion.div
                                    className="w-full max-w-8 rounded-t-md"
                                    style={{
                                        backgroundColor: isToday
                                            ? 'var(--color-accent)'
                                            : 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        borderBottom: 'none',
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(height, 4)}%` }}
                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                />

                                {/* Minutes label on hover */}
                                {day.minutes > 0 && (
                                    <motion.span
                                        className="absolute -top-5 text-[10px] font-display tabular-nums"
                                        style={{ color: 'var(--color-text-muted)' }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 + 0.3 }}
                                    >
                                        {day.minutes}m
                                    </motion.span>
                                )}
                            </div>

                            {/* Day label */}
                            <span
                                className="text-[10px] font-medium"
                                style={{
                                    color: isToday
                                        ? 'var(--color-accent)'
                                        : 'var(--color-text-muted)',
                                }}
                            >
                                {day.day}
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
