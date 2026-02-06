'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useStore } from '@/hooks/useStore';

export function Heatmap() {
    const sessions = useStore((state) => state.analytics.sessions);

    // Generate last 12 weeks of data
    const heatmapData = useMemo(() => {
        const weeks: { date: string; minutes: number; level: number }[][] = [];
        const now = new Date();

        // Get 12 weeks (84 days)
        for (let week = 0; week < 12; week++) {
            const weekData: { date: string; minutes: number; level: number }[] = [];

            for (let day = 0; day < 7; day++) {
                const date = new Date(now);
                date.setDate(date.getDate() - (11 - week) * 7 - (6 - day));
                const dateStr = date.toISOString().split('T')[0];

                // Count minutes for this date
                const dayMinutes = sessions
                    .filter((s) => s.completedAt.startsWith(dateStr))
                    .reduce((sum, s) => sum + Math.floor(s.duration / 60), 0);

                // Calculate level (0-4)
                let level = 0;
                if (dayMinutes > 0) level = 1;
                if (dayMinutes >= 30) level = 2;
                if (dayMinutes >= 60) level = 3;
                if (dayMinutes >= 120) level = 4;

                weekData.push({ date: dateStr, minutes: dayMinutes, level });
            }

            weeks.push(weekData);
        }

        return weeks;
    }, [sessions]);

    const LEVEL_COLORS = [
        'var(--color-surface)',
        'rgba(225, 29, 72, 0.2)',
        'rgba(225, 29, 72, 0.4)',
        'rgba(225, 29, 72, 0.7)',
        'var(--color-accent)',
    ];

    const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h3
                className="text-xs font-medium uppercase tracking-widest"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                Activity
            </h3>

            <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 mr-1">
                    {DAY_LABELS.map((day, i) => (
                        <span
                            key={day}
                            className="h-3 text-[8px] leading-3 flex items-center"
                            style={{
                                color: 'var(--color-text-muted)',
                                visibility: i % 2 === 1 ? 'visible' : 'hidden',
                            }}
                        >
                            {day}
                        </span>
                    ))}
                </div>

                {/* Heatmap grid */}
                <div className="flex gap-1">
                    {heatmapData.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {week.map((day, dayIndex) => (
                                <motion.div
                                    key={day.date}
                                    className="w-3 h-3 rounded-sm cursor-pointer"
                                    style={{
                                        backgroundColor: LEVEL_COLORS[day.level],
                                        border: '1px solid var(--color-border)',
                                    }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        delay: weekIndex * 0.02 + dayIndex * 0.01,
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                    whileHover={{ scale: 1.3 }}
                                    title={`${day.date}: ${day.minutes} min`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                    Less
                </span>
                {LEVEL_COLORS.map((color, i) => (
                    <div
                        key={i}
                        className="w-3 h-3 rounded-sm"
                        style={{
                            backgroundColor: color,
                            border: '1px solid var(--color-border)',
                        }}
                    />
                ))}
                <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                    More
                </span>
            </div>
        </motion.div>
    );
}
