'use client';

import { motion } from 'framer-motion';

interface GlitchTextProps {
    text: string;
    className?: string;
}

export function GlitchText({ text, className = '' }: GlitchTextProps) {
    return (
        <motion.span
            className={`relative inline-block ${className}`}
            style={{ position: 'relative' }}
        >
            {/* Main text */}
            <span className="relative z-10">{text}</span>

            {/* Glitch layers */}
            <motion.span
                className="absolute inset-0 z-0"
                style={{
                    color: 'var(--color-accent)',
                    clipPath: 'inset(0 0 0 0)',
                }}
                animate={{
                    x: [0, -2, 2, -1, 0],
                    opacity: [0, 1, 1, 1, 0],
                    clipPath: [
                        'inset(0% 0% 100% 0%)',
                        'inset(20% 0% 60% 0%)',
                        'inset(40% 0% 40% 0%)',
                        'inset(60% 0% 20% 0%)',
                        'inset(100% 0% 0% 0%)',
                    ],
                }}
                transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: 'linear',
                }}
            >
                {text}
            </motion.span>

            <motion.span
                className="absolute inset-0 z-0"
                style={{
                    color: '#06B6D4',
                    clipPath: 'inset(0 0 0 0)',
                }}
                animate={{
                    x: [0, 2, -2, 1, 0],
                    opacity: [0, 1, 1, 1, 0],
                    clipPath: [
                        'inset(100% 0% 0% 0%)',
                        'inset(60% 0% 20% 0%)',
                        'inset(40% 0% 40% 0%)',
                        'inset(20% 0% 60% 0%)',
                        'inset(0% 0% 100% 0%)',
                    ],
                }}
                transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatDelay: 5,
                    delay: 0.05,
                    ease: 'linear',
                }}
            >
                {text}
            </motion.span>
        </motion.span>
    );
}
