'use client';

import { Howl, Howler } from 'howler';
import { SoundType } from '@/types';

// Royalty-free ambient sound URLs (placeholder - using data URIs for white noise)
const SOUND_URLS: Record<Exclude<SoundType, 'none'>, string> = {
    rain: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3',
    lofi: 'https://assets.mixkit.co/active_storage/sfx/123/123-preview.mp3',
    cafe: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
    whiteNoise: 'https://assets.mixkit.co/active_storage/sfx/1/1-preview.mp3',
};

class SoundManager {
    private currentSound: Howl | null = null;
    private currentType: SoundType = 'none';
    private volume: number = 0.5;
    private isPlaying: boolean = false;

    constructor() {
        // Set global volume
        Howler.volume(this.volume);
    }

    play(type: SoundType): void {
        if (type === 'none') {
            this.stop();
            return;
        }

        // If same sound is playing, don't restart
        if (this.currentType === type && this.isPlaying) {
            return;
        }

        // Stop current sound
        this.stop();

        // Create new sound
        this.currentSound = new Howl({
            src: [SOUND_URLS[type]],
            loop: true,
            volume: this.volume,
            html5: true, // Needed for long audio files
            onplay: () => {
                this.isPlaying = true;
            },
            onstop: () => {
                this.isPlaying = false;
            },
            onend: () => {
                // Loop handles this, but just in case
            },
            onloaderror: (id, error) => {
                console.error('Sound load error:', error);
                this.isPlaying = false;
            },
        });

        this.currentType = type;
        this.currentSound.play();
    }

    stop(): void {
        if (this.currentSound) {
            this.currentSound.stop();
            this.currentSound.unload();
            this.currentSound = null;
        }
        this.currentType = 'none';
        this.isPlaying = false;
    }

    fadeOut(duration: number = 2000): Promise<void> {
        return new Promise((resolve) => {
            if (!this.currentSound || !this.isPlaying) {
                resolve();
                return;
            }

            this.currentSound.fade(this.volume, 0, duration);
            setTimeout(() => {
                this.stop();
                resolve();
            }, duration);
        });
    }

    setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.currentSound) {
            this.currentSound.volume(this.volume);
        }
    }

    getVolume(): number {
        return this.volume;
    }

    isCurrentlyPlaying(): boolean {
        return this.isPlaying;
    }

    getCurrentType(): SoundType {
        return this.currentType;
    }

    toggle(type: SoundType): void {
        if (this.currentType === type && this.isPlaying) {
            this.stop();
        } else {
            this.play(type);
        }
    }
}

// Singleton instance
let soundManagerInstance: SoundManager | null = null;

export function getSoundManager(): SoundManager {
    if (!soundManagerInstance) {
        soundManagerInstance = new SoundManager();
    }
    return soundManagerInstance;
}

// Completion chime
export function playCompletionChime(): void {
    const chime = new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'],
        volume: 0.6,
    });
    chime.play();
}

// Enter/transition whoosh sound
export function playEnterSound(): void {
    const whoosh = new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
        volume: 0.4,
    });
    whoosh.play();
}

