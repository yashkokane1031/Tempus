'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { WeeklyChart } from './WeeklyChart';
import { Heatmap } from './Heatmap';

interface AnalyticsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AnalyticsPanel({ isOpen, onClose }: AnalyticsPanelProps) {
    const analytics = useStore((state) => state.analytics);
    const [activeTab, setActiveTab] = useState<'weekly' | 'heatmap'>('weekly');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40"
                        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        className="fixed left-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto"
                        style={{
                            backgroundColor: 'var(--color-bg)',
                            borderRight: '1px solid var(--color-border)',
                        }}
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                    >
                        <div className="p-6 flex flex-col gap-8">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h2
                                    className="text-xl font-display font-semibold"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    Analytics
                                </h2>
                                <motion.button
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center rounded-full"
                                    style={{ backgroundColor: 'var(--color-surface)' }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <span style={{ color: 'var(--color-text-primary)' }}>✕</span>
                                </motion.button>
                            </div>

                            {/* Stats Summary */}
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    className="p-4 rounded-lg"
                                    style={{
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <span
                                        className="text-xs uppercase tracking-widest"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    >
                                        Total Focus
                                    </span>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span
                                            className="text-2xl font-display font-semibold"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            {Math.floor(analytics.totalMinutes / 60)}
                                        </span>
                                        <span
                                            className="text-sm"
                                            style={{ color: 'var(--color-text-muted)' }}
                                        >
                                            hours
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className="p-4 rounded-lg"
                                    style={{
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <span
                                        className="text-xs uppercase tracking-widest"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    >
                                        Best Streak
                                    </span>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span
                                            className="text-2xl font-display font-semibold"
                                            style={{ color: 'var(--color-accent)' }}
                                        >
                                            {analytics.longestStreak}
                                        </span>
                                        <span
                                            className="text-sm"
                                            style={{ color: 'var(--color-text-muted)' }}
                                        >
                                            days
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2">
                                {(['weekly', 'heatmap'] as const).map((tab) => (
                                    <motion.button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className="flex-1 py-2 rounded-lg text-sm font-medium capitalize"
                                        style={{
                                            backgroundColor:
                                                activeTab === tab
                                                    ? 'var(--color-surface)'
                                                    : 'transparent',
                                            border:
                                                activeTab === tab
                                                    ? '1px solid var(--color-accent)'
                                                    : '1px solid var(--color-border)',
                                            color:
                                                activeTab === tab
                                                    ? 'var(--color-text-primary)'
                                                    : 'var(--color-text-secondary)',
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {tab === 'weekly' ? 'Weekly' : 'Heatmap'}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Chart Content */}
                            <AnimatePresence mode="wait">
                                {activeTab === 'weekly' ? (
                                    <motion.div
                                        key="weekly"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <WeeklyChart />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="heatmap"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <Heatmap />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Sessions Count */}
                            <div
                                className="text-center py-4"
                                style={{ borderTop: '1px solid var(--color-border)' }}
                            >
                                <span
                                    className="text-sm"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {analytics.sessions.length} total sessions completed
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
