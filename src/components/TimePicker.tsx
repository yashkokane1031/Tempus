'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

interface TimePickerProps {
    hours: number;
    minutes: number;
    seconds: number;
    onHoursChange: (value: number) => void;
    onMinutesChange: (value: number) => void;
    onSecondsChange: (value: number) => void;
    disabled?: boolean;
}

interface ScrollWheelProps {
    value: number;
    max: number;
    label: string;
    onChange: (value: number) => void;
    disabled?: boolean;
}

function ScrollWheel({ value, max, label, onChange, disabled }: ScrollWheelProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleWheel = (e: React.WheelEvent) => {
        if (disabled) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? -1 : 1;
        const newValue = Math.max(0, Math.min(max, value + delta));
        onChange(newValue);
    };

    const increment = () => {
        if (disabled) return;
        const newValue = Math.min(max, value + 1);
        onChange(newValue);
    };

    const decrement = () => {
        if (disabled) return;
        const newValue = Math.max(0, value - 1);
        onChange(newValue);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            {/* Label */}
            <span
                className="text-[10px] font-medium uppercase tracking-[0.2em]"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                {label}
            </span>

            {/* Scroll container */}
            <motion.div
                ref={containerRef}
                className="relative flex flex-col items-center select-none"
                onWheel={handleWheel}
                style={{
                    cursor: disabled ? 'not-allowed' : 'ns-resize',
                    opacity: disabled ? 0.5 : 1,
                }}
            >
                {/* Up arrow */}
                <motion.button
                    onClick={increment}
                    disabled={disabled || value >= max}
                    className="flex items-center justify-center w-12 h-6 transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                    whileHover={{ color: 'var(--color-text-primary)', scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </motion.button>

                {/* Value display */}
                <motion.div
                    className="relative flex items-center justify-center w-16 h-16 rounded-lg"
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                    }}
                    whileHover={!disabled ? {
                        borderColor: 'var(--color-text-secondary)',
                    } : {}}
                    transition={{ duration: 0.2 }}
                >
                    <motion.span
                        key={value}
                        className="font-display text-3xl font-semibold tabular-nums"
                        style={{ color: 'var(--color-text-primary)' }}
                        initial={{ opacity: 0, y: isDragging ? 0 : -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        {value.toString().padStart(2, '0')}
                    </motion.span>
                </motion.div>

                {/* Down arrow */}
                <motion.button
                    onClick={decrement}
                    disabled={disabled || value <= 0}
                    className="flex items-center justify-center w-12 h-6 transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                    whileHover={{ color: 'var(--color-text-primary)', scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </motion.button>
            </motion.div>
        </div>
    );
}

export function TimePicker({
    hours,
    minutes,
    seconds,
    onHoursChange,
    onMinutesChange,
    onSecondsChange,
    disabled = false,
}: TimePickerProps) {
    return (
        <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
                delay: 0.15,
            }}
        >
            <ScrollWheel
                value={hours}
                max={23}
                label="Hours"
                onChange={onHoursChange}
                disabled={disabled}
            />

            {/* Separator */}
            <span
                className="font-display text-2xl font-light mt-6"
                style={{ color: 'var(--color-text-muted)' }}
            >
                :
            </span>

            <ScrollWheel
                value={minutes}
                max={59}
                label="Minutes"
                onChange={onMinutesChange}
                disabled={disabled}
            />

            {/* Separator */}
            <span
                className="font-display text-2xl font-light mt-6"
                style={{ color: 'var(--color-text-muted)' }}
            >
                :
            </span>

            <ScrollWheel
                value={seconds}
                max={59}
                label="Seconds"
                onChange={onSecondsChange}
                disabled={disabled}
            />
        </motion.div>
    );
}
