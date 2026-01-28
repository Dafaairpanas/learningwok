import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'nihongoin-cache';
const DB_VERSION = 1;
const STORE_NAME = 'materi';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof indexedDB !== 'undefined';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!isBrowser) return null;
  
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Cache data to IndexedDB
 */
export async function cacheData<T>(key: string, data: T): Promise<void> {
  try {
    const db = await getDB();
    if (!db) return; // Not in browser
    
    await db.put(STORE_NAME, {
      data,
      timestamp: Date.now(),
    }, key);
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
}

/**
 * Get cached data from IndexedDB
 * @param maxAge Maximum age in milliseconds (default 7 days)
 */
export async function getCachedData<T>(key: string, maxAge = 7 * 24 * 60 * 60 * 1000): Promise<T | null> {
  try {
    const db = await getDB();
    if (!db) return null; // Not in browser
    
    const cached = await db.get(STORE_NAME, key);
    
    if (!cached) return null;
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > maxAge) {
      await db.delete(STORE_NAME, key);
      return null;
    }
    
    return cached.data as T;
  } catch (error) {
    console.warn('Failed to get cached data:', error);
    return null;
  }
}

/**
 * Clear all cached data
 */
export async function clearCache(): Promise<void> {
  try {
    const db = await getDB();
    if (!db) return; // Not in browser
    
    await db.clear(STORE_NAME);
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}

/**
 * Check if we're online
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}
