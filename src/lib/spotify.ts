'use client';

// Spotify Web API with PKCE Authorization
// Docs: https://developer.spotify.com/documentation/web-api

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/callback';
const SCOPES = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
].join(' ');

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'spotify_access_token',
    REFRESH_TOKEN: 'spotify_refresh_token',
    TOKEN_EXPIRY: 'spotify_token_expiry',
    CODE_VERIFIER: 'spotify_code_verifier',
};

// PKCE helpers
function generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let str = '';
    bytes.forEach((b) => (str += String.fromCharCode(b)));
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Generate code verifier and challenge
async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
    const verifier = generateRandomString(64);
    const hashed = await sha256(verifier);
    const challenge = base64urlencode(hashed);
    return { verifier, challenge };
}

// Initiate Spotify login
export async function initiateSpotifyLogin(): Promise<void> {
    const { verifier, challenge } = await generatePKCE();
    localStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, verifier);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: SCOPES,
        code_challenge_method: 'S256',
        code_challenge: challenge,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string): Promise<boolean> {
    const verifier = localStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);
    if (!verifier) return false;

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
                code_verifier: verifier,
            }),
        });

        if (!response.ok) return false;

        const data = await response.json();
        saveTokens(data.access_token, data.refresh_token, data.expires_in);
        localStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
        return true;
    } catch {
        return false;
    }
}

// Save tokens to localStorage
function saveTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    const expiry = Date.now() + expiresIn * 1000;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiry.toString());
}

// Get valid access token (refresh if needed)
export async function getAccessToken(): Promise<string | null> {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!accessToken) return null;

    // Check if token is expired (with 60s buffer)
    if (expiry && Date.now() > parseInt(expiry) - 60000) {
        if (refreshToken) {
            const refreshed = await refreshAccessToken(refreshToken);
            if (refreshed) return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        }
        return null;
    }

    return accessToken;
}

// Refresh access token
async function refreshAccessToken(refreshToken: string): Promise<boolean> {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        });

        if (!response.ok) return false;

        const data = await response.json();
        saveTokens(data.access_token, data.refresh_token || refreshToken, data.expires_in);
        return true;
    } catch {
        return false;
    }
}

// Logout
export function logoutSpotify(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
}

// Check if connected
export function isSpotifyConnected(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

// API Types
export interface SpotifyTrack {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string; width: number; height: number }[];
    };
    duration_ms: number;
}

export interface SpotifyPlaybackState {
    is_playing: boolean;
    progress_ms: number;
    item: SpotifyTrack | null;
    device: {
        id: string;
        name: string;
        volume_percent: number;
    } | null;
}

// API Calls
async function spotifyFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
    const token = await getAccessToken();
    if (!token) return null;

    try {
        const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${token}`,
                ...options.headers,
            },
        });

        if (response.status === 204) return null;
        if (!response.ok) return null;

        return response.json();
    } catch {
        return null;
    }
}

export async function getCurrentPlayback(): Promise<SpotifyPlaybackState | null> {
    return spotifyFetch<SpotifyPlaybackState>('/me/player');
}

export async function pausePlayback(): Promise<boolean> {
    const result = await spotifyFetch('/me/player/pause', { method: 'PUT' });
    return result !== null || true; // 204 returns null but is success
}

export async function resumePlayback(): Promise<boolean> {
    const result = await spotifyFetch('/me/player/play', { method: 'PUT' });
    return result !== null || true;
}

export async function skipToNext(): Promise<boolean> {
    const result = await spotifyFetch('/me/player/next', { method: 'POST' });
    return result !== null || true;
}

export async function skipToPrevious(): Promise<boolean> {
    const result = await spotifyFetch('/me/player/previous', { method: 'POST' });
    return result !== null || true;
}
