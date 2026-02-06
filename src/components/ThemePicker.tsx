'use client';

import { motion } from 'framer-motion';
import { AccentColor, Theme } from '@/types';

interface ThemePickerProps {
    theme: Theme;
    accentColor: AccentColor;
    onThemeChange: (theme: Theme) => void;
    onAccentChange: (color: AccentColor) => void;
}

const ACCENT_COLORS: { color: AccentColor; hex: string; glow: string; label: string }[] = [
    { color: 'rose', hex: '#E11D48', glow: 'rgba(225, 29, 72, 0.4)', label: 'Rose' },
    { color: 'violet', hex: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.4)', label: 'Violet' },
    { color: 'cyan', hex: '#06B6D4', glow: 'rgba(6, 182, 212, 0.4)', label: 'Cyan' },
    { color: 'emerald', hex: '#10B981', glow: 'rgba(16, 185, 129, 0.4)', label: 'Emerald' },
    { color: 'amber', hex: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', label: 'Amber' },
    { color: 'blue', hex: '#3B82F6', glow: 'rgba(59, 130, 246, 0.4)', label: 'Blue' },
];

const THEMES: { theme: Theme; label: string }[] = [
    { theme: 'dark', label: 'Dark' },
    { theme: 'light', label: 'Light' },
];

export function ThemePicker({
    theme,
    accentColor,
    onThemeChange,
    onAccentChange,
}: ThemePickerProps) {
    return (
        <div className="flex flex-col gap-6">
            {/* Theme Mode */}
            <div className="flex flex-col gap-3">
                <span
                    className="text-xs font-medium uppercase tracking-widest"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    Theme
                </span>
                <div className="flex gap-2">
                    {THEMES.map((t) => (
                        <motion.button
                            key={t.theme}
                            onClick={() => onThemeChange(t.theme)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                            style={{
                                backgroundColor:
                                    theme === t.theme ? 'var(--color-surface)' : 'transparent',
                                border:
                                    theme === t.theme
                                        ? '1px solid var(--color-accent)'
                                        : '1px solid var(--color-border)',
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span
                                className="text-sm"
                                style={{
                                    color:
                                        theme === t.theme
                                            ? 'var(--color-text-primary)'
                                            : 'var(--color-text-secondary)',
                                }}
                            >
                                {t.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Accent Color */}
            <div className="flex flex-col gap-3">
                <span
                    className="text-xs font-medium uppercase tracking-widest"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    Accent Color
                </span>
                <div className="flex gap-3">
                    {ACCENT_COLORS.map((c) => (
                        <motion.button
                            key={c.color}
                            onClick={() => {
                                onAccentChange(c.color);
                                // Apply to CSS variables immediately
                                document.documentElement.style.setProperty('--color-accent', c.hex);
                                document.documentElement.style.setProperty('--color-accent-glow', c.glow);
                            }}
                            className="relative w-8 h-8 rounded-full transition-transform"
                            style={{ backgroundColor: c.hex }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title={c.label}
                        >
                            {accentColor === c.color && (
                                <motion.div
                                    className="absolute inset-0 rounded-full border-2"
                                    style={{ borderColor: 'var(--color-text-primary)' }}
                                    layoutId="accent-ring"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
