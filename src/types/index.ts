// Focus Timer v2 — Shared Types

export type TimerStatus = 'idle' | 'running' | 'paused';
export type TimerMode = 'simple' | 'pomodoro';
export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

export type AccentColor = 'rose' | 'violet' | 'cyan' | 'amber' | 'emerald' | 'blue';
export type Theme = 'dark' | 'light';

export type SessionTag = 'work' | 'study' | 'creative' | 'exercise' | 'reading' | 'other';

export type SoundType = 'rain' | 'lofi' | 'cafe' | 'whiteNoise' | 'none';

export interface Session {
    id: string;
    duration: number; // in seconds
    tag: SessionTag;
    completedAt: string; // ISO date string
    mode: TimerMode;
}

export interface PomodoroSettings {
    workDuration: number; // minutes
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsBeforeLongBreak: number;
}

export interface TimerSettings {
    mode: TimerMode;
    pomodoro: PomodoroSettings;
    autoStartBreaks: boolean;
    autoStartWork: boolean;
}

export interface SoundSettings {
    type: SoundType;
    volume: number; // 0-1
    fadeOnComplete: boolean;
}

export interface NotificationSettings {
    enabled: boolean;
    halfwayReminder: boolean;
    sound: boolean;
}

export interface AppSettings {
    theme: Theme;
    accentColor: AccentColor;
    timer: TimerSettings;
    sound: SoundSettings;
    notifications: NotificationSettings;
}

export interface AnalyticsData {
    sessions: Session[];
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
    lastSessionDate: string | null;
}

// Default values
export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
};

export const DEFAULT_SETTINGS: AppSettings = {
    theme: 'dark',
    accentColor: 'rose',
    timer: {
        mode: 'simple',
        pomodoro: DEFAULT_POMODORO_SETTINGS,
        autoStartBreaks: false,
        autoStartWork: false,
    },
    sound: {
        type: 'none',
        volume: 0.5,
        fadeOnComplete: true,
    },
    notifications: {
        enabled: false,
        halfwayReminder: false,
        sound: true,
    },
};
