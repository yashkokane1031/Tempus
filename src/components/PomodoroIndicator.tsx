'use client';

import { motion } from 'framer-motion';
import { PomodoroPhase } from '@/types';

interface PomodoroIndicatorProps {
    phase: PomodoroPhase;
    sessionsCompleted: number;
    totalSessions: number;
}

const PHASE_LABELS: Record<PomodoroPhase, string> = {
    work: 'Focus Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
};

const PHASE_COLORS: Record<PomodoroPhase, string> = {
    work: '#E11D48',
    shortBreak: '#10B981',
    longBreak: '#06B6D4',
};

const PHASE_DESCRIPTIONS: Record<PomodoroPhase, string> = {
    work: 'Time to focus!',
    shortBreak: 'Take a quick breather',
    longBreak: 'You earned a long rest',
};

export function PomodoroIndicator({
    phase,
    sessionsCompleted,
    totalSessions,
}: PomodoroIndicatorProps) {
    const progress = sessionsCompleted / totalSessions;
    const circumference = 2 * Math.PI * 24; // radius = 24
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <motion.div
            className="flex flex-col items-center gap-4 p-6 rounded-2xl"
            style={{
                backgroundColor: 'var(--color-surface)',
                border: `2px solid ${PHASE_COLORS[phase]}40`,
                boxShadow: `0 0 40px ${PHASE_COLORS[phase]}20`,
            }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
            {/* Phase Label - Large */}
            <motion.div
                className="text-center"
                key={phase}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <span
                    className="text-lg font-display font-semibold uppercase tracking-widest"
                    style={{ color: PHASE_COLORS[phase] }}
                >
                    {PHASE_LABELS[phase]}
                </span>
                <p
                    className="text-sm mt-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    {PHASE_DESCRIPTIONS[phase]}
                </p>
            </motion.div>

            {/* Progress Ring + Session Count */}
            <div className="flex items-center gap-4">
                {/* Progress Ring */}
                <div className="relative w-14 h-14">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                        {/* Background circle */}
                        <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke="var(--color-border)"
                            strokeWidth="4"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke={PHASE_COLORS[phase]}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span
                            className="text-sm font-display font-semibold"
                            style={{ color: PHASE_COLORS[phase] }}
                        >
                            {sessionsCompleted}/{totalSessions}
                        </span>
                    </div>
                </div>

                {/* Session dots */}
                <div className="flex gap-1.5">
                    {Array.from({ length: totalSessions }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-3 h-3 rounded-full"
                            style={{
                                backgroundColor:
                                    i < sessionsCompleted
                                        ? PHASE_COLORS[phase]
                                        : 'var(--color-border)',
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
