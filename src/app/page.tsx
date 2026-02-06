'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '@/hooks/useTimer';
import { useStore } from '@/hooks/useStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNotifications } from '@/hooks/useNotifications';
import { Timer } from '@/components/Timer';
import { TimePicker } from '@/components/TimePicker';
import { SessionStats } from '@/components/SessionStats';
import { ActionButton } from '@/components/ActionButton';
import { PomodoroIndicator } from '@/components/PomodoroIndicator';
import { TagSelector } from '@/components/TagSelector';
import { KeyboardHints } from '@/components/KeyboardHints';
import { SettingsPanel } from '@/components/SettingsPanel';
import { AnalyticsPanel } from '@/components/Analytics/AnalyticsPanel';
import { StreamPlayer } from '@/components/StreamPlayer';
import { DecryptedText } from '@/components/DecryptedText';
import Particles from '@/components/Particles';
import { GlitchText } from '@/components/GlitchText';
import { TypewriterText } from '@/components/TypewriterText';
import { ProgressArc } from '@/components/ProgressArc';
import { useDocumentTitle, formatTimeForTitle } from '@/hooks/useDocumentTitle';
import { triggerCompletionConfetti, triggerStreakMilestone } from '@/lib/confetti';
import { playCompletionChime, playEnterSound } from '@/lib/sounds';
import { SessionTag } from '@/types';

// Random quotes for landing page
const QUOTES = [
  { text: 'Time is a game played beautifully by children.', author: 'Heraclitus' },
  { text: 'Time is a physician that heals every grief.', author: 'Diphilus' },
  { text: 'Time is a sort of river of passing events, and strong is its current; no sooner is a thing brought to sight than it is swept by and another takes its place, and this too will be swept away.', author: 'Marcus Aurelius' },
  { text: 'Time is the most valuable thing a man can spend.', author: 'Theophrastus' },
  { text: 'Time is the wisest counselor of all.', author: 'Pericles' },
  { text: 'Time is not a thing, thus nothing can be destroyed.', author: 'Anaximander' },
  { text: 'To do two things at once is to do neither.', author: 'Publius Syrus' },
  { text: "Time is a created thing. To say 'I don't have time,' is like saying, 'I don't want to.'", author: 'Lao Tzu' },
  { text: 'Be not afraid of growing slowly, be afraid only of standing still.', author: 'Ancient Chinese proverb' },
  { text: "An inch of time is an inch of gold, but you can't buy that inch of time with an inch of gold.", author: 'Ancient Chinese proverb' },
  { text: 'Time is a file that wears and makes no noise.', author: 'English proverb' },
];

// Tag colors for stream player theming
const TAG_COLORS: Record<SessionTag, string> = {
  work: '#E11D48',
  study: '#3B82F6',
  creative: '#8B5CF6',
  exercise: '#10B981',
  reading: '#F59E0B',
  other: '#6B7280',
};

// Staggered animation variants for page load orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Home() {
  const {
    hours,
    minutes,
    seconds,
    formattedTime,
    status,
    progress,
    setHours,
    setMinutes,
    setSeconds,
    start,
    reset,
    pause,
    timeRemaining,
  } = useTimer();

  const {
    settings,
    analytics,
    currentTag,
    pomodoroPhase,
    pomodoroCount,
    setCurrentTag,
    completeSession,
    advancePomodoroPhase,
  } = useStore();

  const { sendNotification } = useNotifications();

  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);
  const [hasCompletedThisSession, setHasCompletedThisSession] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const isIdle = status === 'idle';
  const isRunning = status === 'running';
  const isPomodoroMode = settings.timer.mode === 'pomodoro';

  // Calculate progress for the arc (0 to 1)
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const arcProgress = totalSeconds > 0 ? 1 - (timeRemaining / totalSeconds) : 0;

  // Update browser tab title with timer
  useDocumentTitle(
    isRunning
      ? `${formatTimeForTitle(timeRemaining)} - Tempus`
      : 'Tempus - Focus Timer',
    false
  );

  // Random quote for landing page (set on client only to avoid hydration mismatch)
  const [randomQuote, setRandomQuote] = useState(QUOTES[0]);
  useEffect(() => {
    setRandomQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  // Auto-set timer based on Pomodoro phase
  useEffect(() => {
    if (isPomodoroMode && isIdle) {
      const { pomodoro } = settings.timer;
      switch (pomodoroPhase) {
        case 'work':
          setHours(0);
          setMinutes(pomodoro.workDuration);
          setSeconds(0);
          break;
        case 'shortBreak':
          setHours(0);
          setMinutes(pomodoro.shortBreakDuration);
          setSeconds(0);
          break;
        case 'longBreak':
          setHours(0);
          setMinutes(pomodoro.longBreakDuration);
          setSeconds(0);
          break;
      }
    }
  }, [isPomodoroMode, pomodoroPhase, isIdle, settings.timer, setHours, setMinutes, setSeconds]);

  // Handle timer completion
  useEffect(() => {
    if (timeRemaining === 0 && !hasCompletedThisSession && status === 'idle') {
      const duration = hours * 3600 + minutes * 60 + seconds;
      if (duration > 0) {
        completeSession(duration);
        triggerCompletionConfetti();
        playCompletionChime();

        const newStreak = analytics.currentStreak;
        if ([7, 30, 100].includes(newStreak)) {
          triggerStreakMilestone(newStreak);
        }

        if (settings.notifications.enabled) {
          sendNotification('Focus Complete!', `Great job! You focused for ${Math.floor(duration / 60)} minutes.`);
        }

        if (isPomodoroMode) {
          advancePomodoroPhase();
        }

        setHasCompletedThisSession(true);
      }
    }
  }, [timeRemaining, status, hasCompletedThisSession, hours, minutes, seconds, completeSession, analytics.currentStreak, settings.notifications.enabled, isPomodoroMode, advancePomodoroPhase, sendNotification]);

  useEffect(() => {
    if (isRunning) {
      setHasCompletedThisSession(false);
    }
  }, [isRunning]);

  // Keyboard shortcuts
  const handleStartPause = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, pause, start]);

  const toggleZenMode = useCallback(() => {
    setZenMode((prev) => !prev);
  }, []);

  useKeyboardShortcuts({
    onStartPause: handleStartPause,
    onReset: reset,
    onToggleMute: toggleZenMode,
    onShowHelp: () => setShowKeyboardHints(true),
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-accent', settings.accentColor);

    if (zenMode) {
      document.documentElement.classList.add('zen-mode');
    } else {
      document.documentElement.classList.remove('zen-mode');
    }
  }, [settings.theme, settings.accentColor, zenMode]);

  // Close panels on Escape, exit zen mode
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zenMode) {
          setZenMode(false);
        } else {
          setShowSettings(false);
          setShowAnalytics(false);
          setShowKeyboardHints(false);
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [zenMode]);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg)',
        padding: 'var(--space-4)',
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
                        linear-gradient(var(--color-text-primary) 1px, transparent 1px),
                        linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)
                    `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Landing Page */}
      <AnimatePresence mode="wait">
        {showLanding ? (
          <motion.div
            key="landing"
            className="flex flex-col items-center justify-between min-h-screen py-16 text-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            {/* Particle Background */}
            <div className="fixed inset-0 z-0">
              <Particles
                particleColors={['#ffffff']}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover
                alphaParticles={false}
                disableRotation={false}
                pixelRatio={1}
              />
            </div>
            {/* Top Section - Quote + Author */}
            <motion.div
              className="flex flex-col items-center gap-4 pt-8 px-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className="text-lg md:text-xl max-w-2xl leading-relaxed italic text-center"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                "<DecryptedText
                  text={randomQuote.text}
                  animateOn="hover"
                  sequential={true}
                  speed={30}
                  revealDirection="start"
                  className=""
                  encryptedClassName="opacity-50"
                />"
              </div>
              <span
                className="text-sm uppercase tracking-widest"
                style={{ color: 'var(--color-text-muted)' }}
              >
                — {randomQuote.author}
              </span>
            </motion.div>

            {/* Center - TEMPUS Heading with Glitch Effect */}
            <motion.h1
              className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-[0.3em] uppercase"
              style={{ color: 'var(--color-text-primary)' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
            >
              <GlitchText text="Tempus" />
            </motion.h1>

            {/* Bottom Section - Enter Button + Credit */}
            <motion.div
              className="relative z-10 flex flex-col items-center gap-8 pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={() => {
                  playEnterSound();
                  setShowLanding(false);
                }}
                className="px-10 py-4 rounded-full text-lg font-display font-medium uppercase tracking-widest"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                  boxShadow: '0 0 40px var(--color-accent-glow)',
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 60px var(--color-accent-glow)' }}
                whileTap={{ scale: 0.95 }}
              >
                Enter
              </motion.button>

              <TypewriterText
                text="by Yash Kokane"
                delay={800}
                speed={60}
                className="text-xs tracking-wider"
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="timer"
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >

            {/* Top Bar - Hidden in Zen Mode */}
            <AnimatePresence>
              {!zenMode && (
                <motion.header
                  className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Analytics Button */}
                  <motion.button
                    onClick={() => setShowAnalytics(true)}
                    className="glass px-4 py-2 rounded-full text-sm font-display"
                    style={{ color: 'var(--color-text-primary)' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Analytics
                  </motion.button>

                  {/* Settings Button */}
                  <motion.button
                    onClick={() => setShowSettings(true)}
                    className="glass px-4 py-2 rounded-full text-sm font-display"
                    style={{ color: 'var(--color-text-primary)' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Settings
                  </motion.button>
                </motion.header>
              )}
            </AnimatePresence>

            {/* Main content container with staggered animations */}
            <motion.div
              className="relative z-10 flex flex-col items-center gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Pomodoro Indicator (if in Pomodoro mode) */}
              <AnimatePresence>
                {isPomodoroMode && !zenMode && (
                  <motion.div
                    key="pomodoro-indicator"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <PomodoroIndicator
                      phase={pomodoroPhase}
                      sessionsCompleted={pomodoroCount}
                      totalSessions={settings.timer.pomodoro.sessionsBeforeLongBreak}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tag Selector (only when idle, not in zen mode) */}
              <AnimatePresence>
                {isIdle && !zenMode && (
                  <motion.div
                    key="tag-selector"
                    className="relative z-50"
                    style={{ pointerEvents: 'auto' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <TagSelector
                      selectedTag={currentTag}
                      onTagChange={setCurrentTag}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Time Picker or Timer Display */}
              <motion.div variants={itemVariants}>
                {isIdle ? (
                  <TimePicker
                    hours={hours}
                    minutes={minutes}
                    seconds={seconds}
                    onHoursChange={setHours}
                    onMinutesChange={setMinutes}
                    onSecondsChange={setSeconds}
                    disabled={!isIdle}
                  />
                ) : (
                  <ProgressArc progress={arcProgress} size={280}>
                    <Timer
                      formattedTime={formattedTime}
                      status={status}
                      progress={progress}
                    />
                  </ProgressArc>
                )}
              </motion.div>

              {/* Action Button */}
              <motion.div variants={itemVariants}>
                <ActionButton
                  status={status}
                  onStart={start}
                  onReset={reset}
                  onPause={pause}
                />
              </motion.div>

              {/* Stream Player - Hidden in Zen Mode */}
              <AnimatePresence>
                {!zenMode && (
                  <motion.div
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <StreamPlayer tagColor={TAG_COLORS[currentTag]} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Session Stats - Hidden in Zen Mode */}
              <AnimatePresence>
                {!zenMode && (
                  <motion.div
                    className="mt-4"
                    variants={itemVariants}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SessionStats
                      todayMinutes={analytics.totalMinutes}
                      streak={analytics.currentStreak}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Bottom controls - Hidden in Zen Mode */}
            <AnimatePresence>
              {!zenMode && (
                <motion.footer
                  className="fixed bottom-4 right-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.5 }}
                >
                  {/* Keyboard Hints */}
                  <motion.button
                    onClick={() => setShowKeyboardHints(true)}
                    className="glass text-xs px-3 py-1.5 rounded-full"
                    style={{ color: 'var(--color-text-muted)' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Press ? for shortcuts
                  </motion.button>
                </motion.footer>
              )}
            </AnimatePresence>

            {/* Zen Mode Exit Hint */}
            <AnimatePresence>
              {zenMode && (
                <motion.div
                  className="fixed bottom-4 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 2 }}
                >
                  <span
                    className="text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Press Esc to exit Zen Mode
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Panels and Modals */}
            <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
            <AnalyticsPanel isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} />
            <KeyboardHints isVisible={showKeyboardHints} onClose={() => setShowKeyboardHints(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
