'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface KeyboardHintsProps {
    isVisible: boolean;
    onClose: () => void;
}

const SHORTCUTS = [
    { key: 'Space', action: 'Start / Pause timer' },
    { key: 'R', action: 'Reset timer' },
    { key: 'M', action: 'Toggle mute sounds' },
    { key: '?', action: 'Show this help' },
    { key: 'Esc', action: 'Close panels' },
];

export function KeyboardHints({ isVisible, onClose }: KeyboardHintsProps) {
    return (
        <AnimatePresence>
            {isVisible && (
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

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-full max-w-sm rounded-2xl p-6"
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                            }}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2
                                    className="text-lg font-display font-semibold"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    Keyboard Shortcuts
                                </h2>
                                <motion.button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full"
                                    style={{ backgroundColor: 'var(--color-border)' }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <span style={{ color: 'var(--color-text-primary)' }}>✕</span>
                                </motion.button>
                            </div>

                            <div className="flex flex-col gap-3">
                                {SHORTCUTS.map((shortcut) => (
                                    <div
                                        key={shortcut.key}
                                        className="flex items-center justify-between"
                                    >
                                        <span
                                            className="text-sm"
                                            style={{ color: 'var(--color-text-secondary)' }}
                                        >
                                            {shortcut.action}
                                        </span>
                                        <kbd
                                            className="px-3 py-1 rounded-lg font-display text-sm"
                                            style={{
                                                backgroundColor: 'var(--color-bg)',
                                                border: '1px solid var(--color-border)',
                                                color: 'var(--color-text-primary)',
                                            }}
                                        >
                                            {shortcut.key}
                                        </kbd>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
