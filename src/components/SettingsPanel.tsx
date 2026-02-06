'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ThemePicker } from './ThemePicker';
import { useStore } from '@/hooks/useStore';
import { useNotifications } from '@/hooks/useNotifications';
import { TimerMode } from '@/types';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
    const {
        settings,
        setTheme,
        setAccentColor,
        setTimerMode,
        toggleNotifications,
    } = useStore();

    const { permission, requestPermission } = useNotifications();

    const handleNotificationToggle = async () => {
        if (permission === 'default') {
            await requestPermission();
        }
        toggleNotifications();
    };

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
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto"
                        style={{
                            backgroundColor: 'var(--color-bg)',
                            borderLeft: '1px solid var(--color-border)',
                        }}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                    >
                        <div className="p-6 flex flex-col gap-8">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h2
                                    className="text-xl font-display font-semibold"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    Settings
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

                            {/* Timer Mode */}
                            <div className="flex flex-col gap-3">
                                <span
                                    className="text-xs font-medium uppercase tracking-widest"
                                    style={{ color: 'var(--color-text-secondary)' }}
                                >
                                    Timer Mode
                                </span>
                                <div className="flex gap-2">
                                    {(['simple', 'pomodoro'] as TimerMode[]).map((mode) => (
                                        <motion.button
                                            key={mode}
                                            onClick={() => setTimerMode(mode)}
                                            className="flex-1 py-3 rounded-lg text-sm font-medium capitalize"
                                            style={{
                                                backgroundColor:
                                                    settings.timer.mode === mode
                                                        ? 'var(--color-surface)'
                                                        : 'transparent',
                                                border:
                                                    settings.timer.mode === mode
                                                        ? '1px solid var(--color-accent)'
                                                        : '1px solid var(--color-border)',
                                                color:
                                                    settings.timer.mode === mode
                                                        ? 'var(--color-text-primary)'
                                                        : 'var(--color-text-secondary)',
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {mode === 'pomodoro' ? 'Pomodoro' : 'Simple'}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Theme Picker */}
                            <ThemePicker
                                theme={settings.theme}
                                accentColor={settings.accentColor}
                                onThemeChange={setTheme}
                                onAccentChange={setAccentColor}
                            />

                            {/* Notifications */}
                            <div className="flex flex-col gap-3">
                                <span
                                    className="text-xs font-medium uppercase tracking-widest"
                                    style={{ color: 'var(--color-text-secondary)' }}
                                >
                                    Notifications
                                </span>
                                <motion.button
                                    onClick={handleNotificationToggle}
                                    className="flex items-center justify-between py-3 px-4 rounded-lg"
                                    style={{
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <span
                                        className="text-sm"
                                        style={{ color: 'var(--color-text-primary)' }}
                                    >
                                        Browser Notifications
                                    </span>
                                    <div
                                        className="w-12 h-6 rounded-full p-1 transition-colors"
                                        style={{
                                            backgroundColor: settings.notifications.enabled
                                                ? 'var(--color-accent)'
                                                : 'var(--color-border)',
                                        }}
                                    >
                                        <motion.div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: 'var(--color-text-primary)' }}
                                            animate={{
                                                x: settings.notifications.enabled ? 24 : 0,
                                            }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </div>
                                </motion.button>
                                {permission === 'denied' && (
                                    <p className="text-xs" style={{ color: 'var(--color-accent)' }}>
                                        Notifications blocked. Enable in browser settings.
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
