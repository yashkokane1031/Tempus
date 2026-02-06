'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export type TimerStatus = 'idle' | 'running' | 'paused';

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  timeRemaining: number;
  initialDuration: number;
  status: TimerStatus;
  todayMinutes: number;
  streak: number;
}

interface UseTimerReturn {
  hours: number;
  minutes: number;
  seconds: number;
  timeRemaining: number;
  status: TimerStatus;
  todayMinutes: number;
  streak: number;
  formattedTime: string;
  progress: number;
  setHours: (value: number) => void;
  setMinutes: (value: number) => void;
  setSeconds: (value: number) => void;
  start: () => void;
  reset: () => void;
  pause: () => void;
}

const DEFAULT_MINUTES = 25;

export function useTimer(): UseTimerReturn {
  const [state, setState] = useState<TimerState>({
    hours: 0,
    minutes: DEFAULT_MINUTES,
    seconds: 0,
    timeRemaining: DEFAULT_MINUTES * 60,
    initialDuration: DEFAULT_MINUTES * 60,
    status: 'idle',
    todayMinutes: 0,
    streak: 1,
  });

  // Calculate total seconds from hours, minutes, seconds
  const calculateTotalSeconds = useCallback((h: number, m: number, s: number) => {
    return h * 3600 + m * 60 + s;
  }, []);

  // Format time as HH:MM:SS or MM:SS based on hours
  const formattedTime = useMemo(() => {
    const h = Math.floor(state.timeRemaining / 3600);
    const m = Math.floor((state.timeRemaining % 3600) / 60);
    const s = state.timeRemaining % 60;

    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, [state.timeRemaining]);

  // Calculate progress (0 to 1)
  const progress = useMemo(() => {
    if (state.initialDuration === 0) return 0;
    return 1 - state.timeRemaining / state.initialDuration;
  }, [state.timeRemaining, state.initialDuration]);

  // Timer tick effect
  useEffect(() => {
    if (state.status !== 'running') return;

    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemaining <= 1) {
          // Timer completed
          const completedMinutes = Math.floor(prev.initialDuration / 60);
          return {
            ...prev,
            timeRemaining: 0,
            status: 'idle',
            todayMinutes: prev.todayMinutes + completedMinutes,
            streak: prev.streak + 1,
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.status]);

  // Update time remaining when user changes hours/minutes/seconds in idle state
  useEffect(() => {
    if (state.status === 'idle') {
      const total = calculateTotalSeconds(state.hours, state.minutes, state.seconds);
      setState((prev) => ({
        ...prev,
        timeRemaining: total,
        initialDuration: total,
      }));
    }
  }, [state.hours, state.minutes, state.seconds, state.status, calculateTotalSeconds]);

  const setHours = useCallback((value: number) => {
    setState((prev) => ({ ...prev, hours: Math.max(0, Math.min(23, value)) }));
  }, []);

  const setMinutes = useCallback((value: number) => {
    setState((prev) => ({ ...prev, minutes: Math.max(0, Math.min(59, value)) }));
  }, []);

  const setSeconds = useCallback((value: number) => {
    setState((prev) => ({ ...prev, seconds: Math.max(0, Math.min(59, value)) }));
  }, []);

  const start = useCallback(() => {
    setState((prev) => {
      const total = calculateTotalSeconds(prev.hours, prev.minutes, prev.seconds);
      return {
        ...prev,
        status: 'running',
        timeRemaining: prev.timeRemaining === 0 ? total : prev.timeRemaining,
        initialDuration: prev.timeRemaining === 0 ? total : prev.initialDuration,
      };
    });
  }, [calculateTotalSeconds]);

  const pause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'paused',
    }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => {
      const total = calculateTotalSeconds(prev.hours, prev.minutes, prev.seconds);
      return {
        ...prev,
        timeRemaining: total,
        initialDuration: total,
        status: 'idle',
      };
    });
  }, [calculateTotalSeconds]);

  return {
    hours: state.hours,
    minutes: state.minutes,
    seconds: state.seconds,
    timeRemaining: state.timeRemaining,
    status: state.status,
    todayMinutes: state.todayMinutes,
    streak: state.streak,
    formattedTime,
    progress,
    setHours,
    setMinutes,
    setSeconds,
    start,
    reset,
    pause,
  };
}
