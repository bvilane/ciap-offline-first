// frontend/src/utils/cacheManager.js
// Simple localStorage-based cache manager for offline content access

const CACHE_VERSION = 'v1';
const CACHE_PREFIX = 'ciap_cache_';
const CACHE_TIMESTAMP_SUFFIX = '_timestamp';
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

class CacheManager {
  constructor() {
    this.isAvailable = this.checkLocalStorageAvailable();
  }

  /**
   * Check if localStorage is available
   */
  checkLocalStorageAvailable() {
    try {
      const test = '__ciap_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage not available, offline caching disabled');
      return false;
    }
  }

  /**
   * Generate cache key
   */
  getCacheKey(key) {
    return `${CACHE_PREFIX}${CACHE_VERSION}_${key}`;
  }

  /**
   * Get timestamp key
   */
  getTimestampKey(key) {
    return `${this.getCacheKey(key)}${CACHE_TIMESTAMP_SUFFIX}`;
  }

  /**
   * Save data to cache
   */
  set(key, data, ttl = DEFAULT_TTL) {
    if (!this.isAvailable) return false;

    try {
      const cacheKey = this.getCacheKey(key);
      const timestampKey = this.getTimestampKey(key);
      const now = Date.now();

      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(timestampKey, now.toString());

      return true;
    } catch (e) {
      console.error('Cache set failed:', e);
      // If quota exceeded, clear old caches
      if (e.name === 'QuotaExceededError') {
        this.clearOldCaches();
        // Try again
        try {
          localStorage.setItem(this.getCacheKey(key), JSON.stringify(data));
          localStorage.setItem(this.getTimestampKey(key), Date.now().toString());
          return true;
        } catch (e2) {
          console.error('Cache set failed after cleanup:', e2);
        }
      }
      return false;
    }
  }

  /**
   * Get data from cache
   */
  get(key, ttl = DEFAULT_TTL) {
    if (!this.isAvailable) return null;

    try {
      const cacheKey = this.getCacheKey(key);
      const timestampKey = this.getTimestampKey(key);
      
      const data = localStorage.getItem(cacheKey);
      const timestamp = localStorage.getItem(timestampKey);

      if (!data || !timestamp) return null;

      const age = Date.now() - parseInt(timestamp, 10);
      
      // If TTL is null, cache never expires
      if (ttl !== null && age > ttl) {
        this.remove(key);
        return null;
      }

      return JSON.parse(data);
    } catch (e) {
      console.error('Cache get failed:', e);
      return null;
    }
  }

  /**
   * Check if cache exists and is valid
   */
  has(key, ttl = DEFAULT_TTL) {
    return this.get(key, ttl) !== null;
  }

  /**
   * Remove specific cache entry
   */
  remove(key) {
    if (!this.isAvailable) return false;

    try {
      localStorage.removeItem(this.getCacheKey(key));
      localStorage.removeItem(this.getTimestampKey(key));
      return true;
    } catch (e) {
      console.error('Cache remove failed:', e);
      return false;
    }
  }

  /**
   * Get cache timestamp
   */
  getTimestamp(key) {
    if (!this.isAvailable) return null;

    try {
      const timestamp = localStorage.getItem(this.getTimestampKey(key));
      return timestamp ? parseInt(timestamp, 10) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Get cache age in milliseconds
   */
  getAge(key) {
    const timestamp = this.getTimestamp(key);
    return timestamp ? Date.now() - timestamp : null;
  }

  /**
   * Format cache timestamp for display
   */
  formatTimestamp(key) {
    const timestamp = this.getTimestamp(key);
    if (!timestamp) return 'Never cached';

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }

  /**
   * Clear old caches (for quota management)
   */
  clearOldCaches() {
    if (!this.isAvailable) return;

    try {
      const keys = Object.keys(localStorage);
      const ciapKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
      
      // Sort by timestamp (oldest first)
      const keysWithTimestamp = ciapKeys
        .filter(k => !k.endsWith(CACHE_TIMESTAMP_SUFFIX))
        .map(k => {
          const key = k.replace(CACHE_PREFIX + CACHE_VERSION + '_', '');
          const timestamp = this.getTimestamp(key);
          return { key, timestamp: timestamp || 0 };
        })
        .sort((a, b) => a.timestamp - b.timestamp);

      // Remove oldest 25% of caches
      const toRemove = Math.ceil(keysWithTimestamp.length * 0.25);
      for (let i = 0; i < toRemove; i++) {
        this.remove(keysWithTimestamp[i].key);
      }

      console.log(`Cleared ${toRemove} old cache entries`);
    } catch (e) {
      console.error('Failed to clear old caches:', e);
    }
  }

  /**
   * Clear all CIAP caches
   */
  clearAll() {
    if (!this.isAvailable) return false;

    try {
      const keys = Object.keys(localStorage);
      const ciapKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
      
      ciapKeys.forEach(k => localStorage.removeItem(k));
      
      console.log(`Cleared ${ciapKeys.length} cache entries`);
      return true;
    } catch (e) {
      console.error('Failed to clear all caches:', e);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    if (!this.isAvailable) {
      return {
        available: false,
        totalEntries: 0,
        totalSize: 0,
        entries: []
      };
    }

    try {
      const keys = Object.keys(localStorage);
      const ciapKeys = keys
        .filter(k => k.startsWith(CACHE_PREFIX) && !k.endsWith(CACHE_TIMESTAMP_SUFFIX));

      const entries = ciapKeys.map(k => {
        const key = k.replace(CACHE_PREFIX + CACHE_VERSION + '_', '');
        const size = localStorage.getItem(k)?.length || 0;
        const timestamp = this.getTimestamp(key);
        const age = this.getAge(key);

        return {
          key,
          size,
          timestamp,
          age,
          formattedTime: this.formatTimestamp(key)
        };
      });

      const totalSize = entries.reduce((sum, e) => sum + e.size, 0);

      return {
        available: true,
        totalEntries: entries.length,
        totalSize,
        formattedSize: this.formatSize(totalSize),
        entries: entries.sort((a, b) => b.timestamp - a.timestamp)
      };
    } catch (e) {
      console.error('Failed to get cache stats:', e);
      return {
        available: false,
        totalEntries: 0,
        totalSize: 0,
        entries: []
      };
    }
  }

  /**
   * Format size in bytes to human-readable format
   */
  formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

// Export singleton instance
export default new CacheManager();