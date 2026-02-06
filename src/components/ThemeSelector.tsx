'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export interface Theme {
    id: string;
    name: string;
    accent: string;
    accentGlow: string;
}

export const THEMES: Theme[] = [
    { id: 'rose', name: 'Rose', accent: '#E11D48', accentGlow: 'rgba(225, 29, 72, 0.4)' },
    { id: 'violet', name: 'Violet', accent: '#8B5CF6', accentGlow: 'rgba(139, 92, 246, 0.4)' },
    { id: 'cyan', name: 'Cyan', accent: '#06B6D4', accentGlow: 'rgba(6, 182, 212, 0.4)' },
    { id: 'emerald', name: 'Emerald', accent: '#10B981', accentGlow: 'rgba(16, 185, 129, 0.4)' },
    { id: 'amber', name: 'Amber', accent: '#F59E0B', accentGlow: 'rgba(245, 158, 11, 0.4)' },
    { id: 'blue', name: 'Blue', accent: '#3B82F6', accentGlow: 'rgba(59, 130, 246, 0.4)' },
];

interface ThemeSelectorProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
    className?: string;
}

export function ThemeSelector({ currentTheme, onThemeChange, className = '' }: ThemeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: currentTheme.accent }}
                />
                <span>Theme</span>
            </motion.button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Theme options */}
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute top-full mt-2 right-0 z-50 p-2 rounded-xl min-w-[140px]"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        }}
                    >
                        {THEMES.map((theme) => (
                            <motion.button
                                key={theme.id}
                                onClick={() => {
                                    onThemeChange(theme);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left"
                                style={{
                                    backgroundColor: currentTheme.id === theme.id
                                        ? 'var(--color-bg-secondary)'
                                        : 'transparent',
                                    color: 'var(--color-text-primary)',
                                }}
                                whileHover={{ backgroundColor: 'var(--color-bg-secondary)' }}
                            >
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{
                                        backgroundColor: theme.accent,
                                        boxShadow: currentTheme.id === theme.id
                                            ? `0 0 8px ${theme.accent}`
                                            : 'none'
                                    }}
                                />
                                <span>{theme.name}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                </>
            )}
        </div>
    );
}
