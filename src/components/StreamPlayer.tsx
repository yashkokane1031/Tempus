'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AudioVisualizer } from './AudioVisualizer';

interface StreamPlayerProps {
    tagColor?: string;
}

interface Stream {
    id: string;
    name: string;
    embedUrl: string;
}

const STREAMS: Stream[] = [
    {
        id: 'lofi-girl',
        name: 'Lofi Girl',
        embedUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0',
    },
    {
        id: 'chillhop',
        name: 'Chillhop',
        embedUrl: 'https://www.youtube.com/embed/5yx6BWlEVcY?autoplay=1&mute=0',
    },
    {
        id: 'jazz',
        name: 'Coffee Jazz',
        embedUrl: 'https://www.youtube.com/embed/fEvM-OUbaKs?autoplay=1&mute=0',
    },
    {
        id: 'synthwave',
        name: 'Synthwave',
        embedUrl: 'https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=1&mute=0',
    },
];

export function StreamPlayer({ tagColor }: StreamPlayerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeStream, setActiveStream] = useState<Stream | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleStreamSelect = (stream: Stream) => {
        if (activeStream?.id === stream.id) {
            setActiveStream(null);
            setIsPlaying(false);
        } else {
            setActiveStream(stream);
            setIsPlaying(true);
        }
    };

    const handleStop = () => {
        setActiveStream(null);
        setIsPlaying(false);
    };

    const activeColor = tagColor || 'var(--color-accent)';

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
                {/* Visualizer - animated based on isPlaying */}
                <div className="px-4 pt-4">
                    <AudioVisualizer
                        isPlaying={isPlaying}
                        barCount={32}
                        height={40}
                        color={activeColor}
                    />
                </div>

                {/* Stream selector */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span
                            className="text-xs font-medium uppercase tracking-widest"
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            Focus Streams
                        </span>
                        {activeStream && (
                            <motion.button
                                onClick={handleStop}
                                className="text-xs px-2 py-1 rounded"
                                style={{ color: 'var(--color-text-muted)' }}
                                whileHover={{ color: 'var(--color-text-primary)' }}
                            >
                                Stop
                            </motion.button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {STREAMS.map((stream) => (
                            <motion.button
                                key={stream.id}
                                onClick={() => handleStreamSelect(stream)}
                                className="py-2 px-3 rounded-lg text-sm font-medium text-left"
                                style={{
                                    backgroundColor:
                                        activeStream?.id === stream.id
                                            ? activeColor
                                            : 'transparent',
                                    border:
                                        activeStream?.id === stream.id
                                            ? `1px solid ${activeColor}`
                                            : '1px solid var(--color-border)',
                                    color:
                                        activeStream?.id === stream.id
                                            ? 'white'
                                            : 'var(--color-text-secondary)',
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {stream.name}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* YouTube Embed */}
                <AnimatePresence>
                    {activeStream && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: isExpanded ? 200 : 0, opacity: isExpanded ? 1 : 0 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <iframe
                                src={activeStream.embedUrl}
                                width="100%"
                                height="200"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                className="border-0"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Show/Hide video toggle */}
                {activeStream && (
                    <motion.button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full py-2 text-xs"
                        style={{
                            color: 'var(--color-text-muted)',
                            borderTop: '1px solid var(--color-border)',
                        }}
                    >
                        {isExpanded ? 'Hide Video' : 'Show Video'}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
