'use client';

import confetti from 'canvas-confetti';

// Standard completion celebration
export function triggerCompletionConfetti(): void {
    // Burst from center
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#E11D48', '#FAFAFA', '#F97316', '#22C55E', '#3B82F6'],
    });
}

// Streak milestone celebrations
export function triggerStreakMilestone(streak: number): void {
    if (streak === 7) {
        // Week streak - fire from both sides
        const colors = ['#F97316', '#FBBF24', '#EAB308'];
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors,
        });
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors,
        });
    } else if (streak === 30) {
        // Month streak - big celebration
        const duration = 2000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#10B981', '#34D399', '#6EE7B7'],
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#10B981', '#34D399', '#6EE7B7'],
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    } else if (streak === 100) {
        // Epic celebration
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 80,
                origin: { x: 0 },
                colors: ['#E11D48', '#F43F5E', '#FB7185'],
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 80,
                origin: { x: 1 },
                colors: ['#06B6D4', '#22D3EE', '#67E8F9'],
            });
            confetti({
                particleCount: 2,
                angle: 90,
                spread: 100,
                origin: { x: 0.5, y: 0.3 },
                colors: ['#FAFAFA', '#F4F4F5'],
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }
}

// Simple sparkle effect for smaller achievements
export function triggerSparkle(): void {
    confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.7, x: 0.5 },
        colors: ['#FAFAFA'],
        gravity: 0.8,
        scalar: 0.8,
    });
}
