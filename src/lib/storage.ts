// localStorage utilities with type safety

const STORAGE_KEYS = {
    SETTINGS: 'focus-timer-settings',
    ANALYTICS: 'focus-timer-analytics',
} as const;

export function getFromStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;

    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
}

export function setToStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
    }
}

export function removeFromStorage(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
}

export { STORAGE_KEYS };
