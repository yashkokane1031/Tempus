'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSpotify } from '@/hooks/useSpotify';
import { AudioVisualizer } from './AudioVisualizer';
import Image from 'next/image';

export function SpotifyPlayer() {
    const {
        isConnected,
        isLoading,
        playbackState,
        connect,
        disconnect,
        togglePlayback,
        next,
        previous,
    } = useSpotify();

    if (isLoading) {
        return null;
    }

    // Not connected state
    if (!isConnected) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <motion.button
                    onClick={connect}
                    className="flex items-center gap-3 px-5 py-3 rounded-full"
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Spotify icon */}
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ color: '#1DB954' }}
                    >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    <span
                        className="text-sm font-medium"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        Connect Spotify
                    </span>
                </motion.button>
            </motion.div>
        );
    }

    const track = playbackState?.item;
    const isPlaying = playbackState?.is_playing ?? false;
    const progress = playbackState?.progress_ms ?? 0;
    const duration = track?.duration_ms ?? 1;
    const progressPercent = (progress / duration) * 100;

    return (
        <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                }}
            >
                {/* Visualizer */}
                <div className="px-4 pt-4">
                    <AudioVisualizer isPlaying={isPlaying} barCount={32} height={40} />
                </div>

                {/* Track Info */}
                <AnimatePresence mode="wait">
                    {track ? (
                        <motion.div
                            key={track.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3 p-4"
                        >
                            {/* Album Art */}
                            {track.album.images[0] && (
                                <div
                                    className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                                    style={{ border: '1px solid var(--color-border)' }}
                                >
                                    <Image
                                        src={track.album.images[0].url}
                                        alt={track.album.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Track Details */}
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-medium truncate"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    {track.name}
                                </p>
                                <p
                                    className="text-xs truncate"
                                    style={{ color: 'var(--color-text-secondary)' }}
                                >
                                    {track.artists.map((a) => a.name).join(', ')}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4"
                        >
                            <p
                                className="text-sm text-center"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                No track playing
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Bar */}
                {track && (
                    <div
                        className="h-1 mx-4 mb-3 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--color-border)' }}
                    >
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: 'var(--color-accent)' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, ease: 'linear' }}
                        />
                    </div>
                )}

                {/* Controls */}
                <div
                    className="flex items-center justify-center gap-4 px-4 pb-4"
                    style={{ borderTop: track ? 'none' : '1px solid var(--color-border)' }}
                >
                    {/* Previous */}
                    <motion.button
                        onClick={previous}
                        className="w-10 h-10 flex items-center justify-center rounded-full"
                        style={{ color: 'var(--color-text-secondary)' }}
                        whileHover={{ scale: 1.1, color: 'var(--color-text-primary)' }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                        </svg>
                    </motion.button>

                    {/* Play/Pause */}
                    <motion.button
                        onClick={togglePlayback}
                        className="w-12 h-12 flex items-center justify-center rounded-full"
                        style={{
                            backgroundColor: 'var(--color-text-primary)',
                            color: 'var(--color-bg)',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isPlaying ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </motion.button>

                    {/* Next */}
                    <motion.button
                        onClick={next}
                        className="w-10 h-10 flex items-center justify-center rounded-full"
                        style={{ color: 'var(--color-text-secondary)' }}
                        whileHover={{ scale: 1.1, color: 'var(--color-text-primary)' }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                        </svg>
                    </motion.button>
                </div>

                {/* Disconnect option */}
                <div className="px-4 pb-3">
                    <button
                        onClick={disconnect}
                        className="w-full text-center text-xs py-1"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Disconnect
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
