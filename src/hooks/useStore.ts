'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    AppSettings,
    AnalyticsData,
    Session,
    SessionTag,
    TimerMode,
    AccentColor,
    Theme,
    SoundType,
    DEFAULT_SETTINGS,
    PomodoroPhase,
} from '@/types';

interface AppState {
    // Settings
    settings: AppSettings;

    // Analytics
    analytics: AnalyticsData;

    // Current session state
    currentTag: SessionTag;
    pomodoroPhase: PomodoroPhase;
    pomodoroCount: number; // sessions completed in current cycle

    // Actions - Settings
    setTheme: (theme: Theme) => void;
    setAccentColor: (color: AccentColor) => void;
    setTimerMode: (mode: TimerMode) => void;
    setSoundType: (type: SoundType) => void;
    setSoundVolume: (volume: number) => void;
    toggleNotifications: () => void;

    // Actions - Session
    setCurrentTag: (tag: SessionTag) => void;
    completeSession: (duration: number) => void;
    advancePomodoroPhase: () => void;
    resetPomodoroPhase: () => void;

    // Actions - Analytics
    getSessionsForDate: (date: string) => Session[];
    getWeeklyStats: () => { day: string; minutes: number }[];
}

const DEFAULT_ANALYTICS: AnalyticsData = {
    sessions: [],
    totalMinutes: 0,
    currentStreak: 1,
    longestStreak: 1,
    lastSessionDate: null,
};

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial state
            settings: DEFAULT_SETTINGS,
            analytics: DEFAULT_ANALYTICS,
            currentTag: 'work',
            pomodoroPhase: 'work',
            pomodoroCount: 0,

            // Settings actions
            setTheme: (theme) =>
                set((state) => ({
                    settings: { ...state.settings, theme },
                })),

            setAccentColor: (accentColor) =>
                set((state) => ({
                    settings: { ...state.settings, accentColor },
                })),

            setTimerMode: (mode) =>
                set((state) => ({
                    settings: {
                        ...state.settings,
                        timer: { ...state.settings.timer, mode },
                    },
                })),

            setSoundType: (type) =>
                set((state) => ({
                    settings: {
                        ...state.settings,
                        sound: { ...state.settings.sound, type },
                    },
                })),

            setSoundVolume: (volume) =>
                set((state) => ({
                    settings: {
                        ...state.settings,
                        sound: { ...state.settings.sound, volume },
                    },
                })),

            toggleNotifications: () =>
                set((state) => ({
                    settings: {
                        ...state.settings,
                        notifications: {
                            ...state.settings.notifications,
                            enabled: !state.settings.notifications.enabled,
                        },
                    },
                })),

            // Session actions
            setCurrentTag: (tag) => set({ currentTag: tag }),

            completeSession: (duration) => {
                const state = get();
                const now = new Date();
                const today = now.toISOString().split('T')[0];

                const newSession: Session = {
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    duration,
                    tag: state.currentTag,
                    completedAt: now.toISOString(),
                    mode: state.settings.timer.mode,
                };

                // Calculate streak
                let newStreak = state.analytics.currentStreak;
                const lastDate = state.analytics.lastSessionDate;

                if (lastDate) {
                    const lastDateObj = new Date(lastDate);
                    const daysDiff = Math.floor(
                        (now.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    if (daysDiff === 0) {
                        // Same day, streak continues
                    } else if (daysDiff === 1) {
                        // Next day, increment streak
                        newStreak += 1;
                    } else {
                        // Gap in days, reset streak
                        newStreak = 1;
                    }
                }

                set((state) => ({
                    analytics: {
                        ...state.analytics,
                        sessions: [...state.analytics.sessions, newSession],
                        totalMinutes: state.analytics.totalMinutes + Math.floor(duration / 60),
                        currentStreak: newStreak,
                        longestStreak: Math.max(state.analytics.longestStreak, newStreak),
                        lastSessionDate: today,
                    },
                }));
            },

            advancePomodoroPhase: () => {
                const state = get();
                const { pomodoroPhase, pomodoroCount } = state;
                const { sessionsBeforeLongBreak } = state.settings.timer.pomodoro;

                if (pomodoroPhase === 'work') {
                    const newCount = pomodoroCount + 1;
                    if (newCount >= sessionsBeforeLongBreak) {
                        set({ pomodoroPhase: 'longBreak', pomodoroCount: 0 });
                    } else {
                        set({ pomodoroPhase: 'shortBreak', pomodoroCount: newCount });
                    }
                } else {
                    set({ pomodoroPhase: 'work' });
                }
            },

            resetPomodoroPhase: () => set({ pomodoroPhase: 'work', pomodoroCount: 0 }),

            // Analytics helpers
            getSessionsForDate: (date) => {
                const sessions = get().analytics.sessions;
                return sessions.filter((s) => s.completedAt.startsWith(date));
            },

            getWeeklyStats: () => {
                const sessions = get().analytics.sessions;
                const days = [];
                const now = new Date();

                for (let i = 6; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                    const dayMinutes = sessions
                        .filter((s) => s.completedAt.startsWith(dateStr))
                        .reduce((sum, s) => sum + Math.floor(s.duration / 60), 0);

                    days.push({ day: dayName, minutes: dayMinutes });
                }

                return days;
            },
        }),
        {
            name: 'focus-timer-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                settings: state.settings,
                analytics: state.analytics,
            }),
        }
    )
);
