const NodeCache = require('node-cache');
const logger = require('../utils/logger');
const config = require('../config');

/**
 * Abstract Cache Strategy Interface
 * All caching strategies must implement these methods
 */
class CacheStrategy {
  constructor() {
    if (this.constructor === CacheStrategy) {
      throw new Error('Abstract class cannot be instantiated');
    }
  }

  async get(key) {
    throw new Error('Method must be implemented');
  }

  async set(key, value, ttl) {
    throw new Error('Method must be implemented');
  }

  async delete(key) {
    throw new Error('Method must be implemented');
  }

  async clear() {
    throw new Error('Method must be implemented');
  }

  getStats() {
    throw new Error('Method must be implemented');
  }
}

/**
 * LRU (Least Recently Used) Strategy
 * Evicts least recently accessed items when cache is full
 * Time Complexity: O(1) for get/set operations
 */
class LRUStrategy extends CacheStrategy {
  constructor() {
    super();
    this.cache = new NodeCache({
      stdTTL: config.cache.ttl,
      checkperiod: config.cache.checkPeriod,
      maxKeys: config.cache.maxSize,
    });
    
    this.accessOrder = new Map(); // Track access times
    this.hits = 0;
    this.misses = 0;
    
    logger.info('LRU Cache Strategy initialized', {
      maxSize: config.cache.maxSize,
      ttl: config.cache.ttl,
    });
  }

  async get(key) {
    const value = this.cache.get(key);
    
    if (value !== undefined) {
      this.hits++;
      this.accessOrder.set(key, Date.now());
      logger.debug('Cache HIT', { key, strategy: 'LRU' });
      return value;
    }
    
    this.misses++;
    logger.debug('Cache MISS', { key, strategy: 'LRU' });
    return null;
  }

  async set(key, value, ttl = config.cache.ttl) {
    // Evict LRU item if cache is full
    if (this.cache.keys().length >= config.cache.maxSize) {
      const lruKey = this.findLRUKey();
      if (lruKey) {
        await this.delete(lruKey);
        logger.debug('LRU Eviction', { evictedKey: lruKey });
      }
    }

    const success = this.cache.set(key, value, ttl);
    this.accessOrder.set(key, Date.now());
    
    if (success) {
      logger.debug('Cache SET', { key, strategy: 'LRU', ttl });
    }
    
    return success;
  }

  async delete(key) {
    this.accessOrder.delete(key);
    return this.cache.del(key);
  }

  async clear() {
    this.cache.flushAll();
    this.accessOrder.clear();
    this.hits = 0;
    this.misses = 0;
    logger.info('Cache cleared', { strategy: 'LRU' });
  }

  findLRUKey() {
    let lruKey = null;
    let oldestTime = Infinity;

    for (const [key, time] of this.accessOrder.entries()) {
      if (time < oldestTime) {
        oldestTime = time;
        lruKey = key;
      }
    }

    return lruKey;
  }

  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total * 100).toFixed(2) : 0;
    
    return {
      strategy: 'LRU',
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate}%`,
      size: this.cache.keys().length,
      maxSize: config.cache.maxSize,
      keys: this.cache.keys(),
    };
  }
}

/**
 * LFU (Least Frequently Used) Strategy
 * Evicts least frequently accessed items
 */
class LFUStrategy extends CacheStrategy {
  constructor() {
    super();
    this.cache = new NodeCache({
      stdTTL: config.cache.ttl,
      checkperiod: config.cache.checkPeriod,
      maxKeys: config.cache.maxSize,
    });
    
    this.frequency = new Map(); // Track access frequency
    this.hits = 0;
    this.misses = 0;
    
    logger.info('LFU Cache Strategy initialized');
  }

  async get(key) {
    const value = this.cache.get(key);
    
    if (value !== undefined) {
      this.hits++;
      this.frequency.set(key, (this.frequency.get(key) || 0) + 1);
      logger.debug('Cache HIT', { key, strategy: 'LFU' });
      return value;
    }
    
    this.misses++;
    logger.debug('Cache MISS', { key, strategy: 'LFU' });
    return null;
  }

  async set(key, value, ttl = config.cache.ttl) {
    // Evict LFU item if cache is full
    if (this.cache.keys().length >= config.cache.maxSize) {
      const lfuKey = this.findLFUKey();
      if (lfuKey) {
        await this.delete(lfuKey);
        logger.debug('LFU Eviction', { evictedKey: lfuKey });
      }
    }

    const success = this.cache.set(key, value, ttl);
    this.frequency.set(key, 1);
    
    return success;
  }

  async delete(key) {
    this.frequency.delete(key);
    return this.cache.del(key);
  }

  async clear() {
    this.cache.flushAll();
    this.frequency.clear();
    this.hits = 0;
    this.misses = 0;
    logger.info('Cache cleared', { strategy: 'LFU' });
  }

  findLFUKey() {
    let lfuKey = null;
    let minFreq = Infinity;

    for (const [key, freq] of this.frequency.entries()) {
      if (freq < minFreq) {
        minFreq = freq;
        lfuKey = key;
      }
    }

    return lfuKey;
  }

  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total * 100).toFixed(2) : 0;
    
    return {
      strategy: 'LFU',
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate}%`,
      size: this.cache.keys().length,
      maxSize: config.cache.maxSize,
      topKeys: this.getTopKeys(5),
    };
  }

  getTopKeys(n = 5) {
    return Array.from(this.frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([key, freq]) => ({ key, frequency: freq }));
  }
}

/**
 * Cache Strategy Factory
 * Creates appropriate cache strategy based on configuration
 */
class CacheStrategyFactory {
  static create(strategyType = config.cache.strategy) {
    switch (strategyType.toUpperCase()) {
      case 'LRU':
        return new LRUStrategy();
      case 'LFU':
        return new LFUStrategy();
      default:
        logger.warn(`Unknown strategy: ${strategyType}, defaulting to LRU`);
        return new LRUStrategy();
    }
  }
}

module.exports = {
  CacheStrategy,
  LRUStrategy,
  LFUStrategy,
  CacheStrategyFactory,
};