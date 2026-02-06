'use client';

import { motion } from 'framer-motion';

interface ProgressArcProps {
    progress: number; // 0 to 1
    size?: number;
    strokeWidth?: number;
    color?: string;
    bgColor?: string;
    children?: React.ReactNode;
}

export function ProgressArc({
    progress,
    size = 280,
    strokeWidth = 4,
    color = 'var(--color-accent)',
    bgColor = 'var(--color-border)',
    children
}: ProgressArcProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - Math.min(Math.max(progress, 0), 1));

    return (
        <div className="relative" style={{ width: size, height: size }}>
            {/* Background arc */}
            <svg
                className="absolute inset-0 -rotate-90"
                width={size}
                height={size}
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={bgColor}
                    strokeWidth={strokeWidth}
                    opacity={0.3}
                />
            </svg>

            {/* Progress arc */}
            <svg
                className="absolute inset-0 -rotate-90"
                width={size}
                height={size}
            >
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                        filter: `drop-shadow(0 0 8px ${color})`,
                    }}
                />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}
