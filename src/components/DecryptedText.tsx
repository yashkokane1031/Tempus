'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

interface DecryptedTextProps {
    text: string;
    speed?: number;
    maxIterations?: number;
    sequential?: boolean;
    revealDirection?: 'start' | 'end' | 'center';
    characters?: string;
    className?: string;
    parentClassName?: string;
    encryptedClassName?: string;
    animateOn?: 'hover' | 'view' | 'both';
}

export function DecryptedText({
    text,
    speed = 50,
    sequential = true,
    revealDirection = 'start',
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    className = '',
    parentClassName = '',
    encryptedClassName = '',
    animateOn = 'hover',
}: DecryptedTextProps) {
    const availableChars = useMemo(() => characters.split(''), [characters]);

    const [displayText, setDisplayText] = useState(text);
    const [isHovering, setIsHovering] = useState(false);
    const [isDecrypted, setIsDecrypted] = useState(false);
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
    const [isClient, setIsClient] = useState(false);
    const containerRef = useRef<HTMLSpanElement>(null);

    // Generate scrambled text
    const scramble = (revealed: Set<number>) => {
        return text
            .split('')
            .map((char, i) => {
                if (char === ' ') return ' ';
                if (revealed.has(i)) return char;
                return availableChars[Math.floor(Math.random() * availableChars.length)];
            })
            .join('');
    };

    // Set scrambled on client mount
    useEffect(() => {
        setIsClient(true);
        setDisplayText(scramble(new Set()));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Keep scrambling while idle
    useEffect(() => {
        if (!isClient || isHovering || isDecrypted) return;

        const interval = setInterval(() => {
            setDisplayText(scramble(revealedIndices));
        }, 100);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClient, isHovering, isDecrypted]);

    // Decrypt on hover
    useEffect(() => {
        if (!isHovering || isDecrypted) return;

        const getNextIndex = (revealed: Set<number>) => {
            if (revealDirection === 'end') return text.length - 1 - revealed.size;
            return revealed.size; // 'start' default
        };

        const interval = setInterval(() => {
            setRevealedIndices(prev => {
                if (prev.size >= text.length) {
                    clearInterval(interval);
                    setDisplayText(text);
                    setIsDecrypted(true);
                    return prev;
                }
                const newSet = new Set(prev);
                newSet.add(getNextIndex(prev));
                setDisplayText(scramble(newSet));
                return newSet;
            });
        }, speed);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHovering, isDecrypted, text, speed, revealDirection]);

    // View trigger
    useEffect(() => {
        if (animateOn !== 'view' && animateOn !== 'both') return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !isDecrypted) {
                        setIsHovering(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const el = containerRef.current;
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, [animateOn, isDecrypted]);

    const hoverProps = (animateOn === 'hover' || animateOn === 'both')
        ? { onMouseEnter: () => setIsHovering(true) }
        : {};

    return (
        <motion.span
            className={parentClassName}
            ref={containerRef}
            style={{ display: 'inline-block', whiteSpace: 'pre-wrap', cursor: 'pointer' }}
            {...hoverProps}
        >
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {displayText.split('').map((char, index) => (
                    <span
                        key={index}
                        className={revealedIndices.has(index) || isDecrypted ? className : encryptedClassName}
                    >
                        {char}
                    </span>
                ))}
            </span>
        </motion.span>
    );
}

