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

        console.log('🔍 Heatmap Debug - Total sessions:', sessions.length);
        if (sessions.length > 0) {
            console.log('📅 Recent sessions:');
            sessions.slice(0, 5).forEach(s => {
                console.log(`  - ${s.completedAt} | ${s.tag} | ${Math.floor(s.duration / 60)}min`);
            });
        }

        // Get 12 weeks (84 days)
        for (let week = 0; week < 12; week++) {
            const weekData: { date: string; minutes: number; level: number }[] = [];

            for (let day = 0; day < 7; day++) {
                const date = new Date(now);
                date.setDate(date.getDate() - (11 - week) * 7 - (6 - day));
                const dateStr = date.toISOString().split('T')[0];

                // Get sessions for this date
                const daySessions = sessions.filter((s) => s.completedAt.startsWith(dateStr));
                const sessionCount = daySessions.length;

                // Count minutes for this date
                const dayMinutes = daySessions.reduce((sum, s) => sum + Math.floor(s.duration / 60), 0);

                // Calculate level (0-4) - show activity even for < 1min sessions
                let level = 0;
                if (sessionCount > 0) level = 1; // Any session = level 1
                if (dayMinutes >= 30) level = 2;
                if (dayMinutes >= 60) level = 3;
                if (dayMinutes >= 120) level = 4;

                weekData.push({ date: dateStr, minutes: dayMinutes, level });
            }

            weeks.push(weekData);
        }

        return weeks;
    }, [sessions]);

    // Get current accent color from CSS variable and create opacity levels
    const getAccentWithOpacity = (opacity: number) => {
        if (typeof window === 'undefined') return 'var(--color-surface)';
        const accentColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-accent')
            .trim();

        // Convert hex to rgba with opacity
        if (accentColor.startsWith('#')) {
            const r = parseInt(accentColor.slice(1, 3), 16);
            const g = parseInt(accentColor.slice(3, 5), 16);
            const b = parseInt(accentColor.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return accentColor;
    };

    const LEVEL_COLORS = [
        'var(--color-surface)',
        getAccentWithOpacity(0.2),
        getAccentWithOpacity(0.4),
        getAccentWithOpacity(0.7),
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
