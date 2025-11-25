// frontend/src/hooks/useCachedFetch.js
// Hook that automatically caches API responses and serves them when offline

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import cacheManager from '../utils/cacheManager';
import useNetworkStatus from './useNetworkStatus';

export default function useCachedFetch(url, options = {}) {
  const {
    cacheKey = url,
    cacheTTL = 24 * 60 * 60 * 1000, // 24 hours default
    refetchOnMount = true,
    refetchOnOnline = true,
    ...fetchOptions
  } = options;

  const { isOnline } = useNetworkStatus();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);

  const fetchData = useCallback(async (force = false) => {
    // If offline and not forcing, try cache first
    if (!isOnline && !force) {
      const cached = cacheManager.get(cacheKey, cacheTTL);
      if (cached) {
        console.log(`Using cached data for: ${cacheKey}`);
        setData(cached);
        setFromCache(true);
        setCacheTimestamp(cacheManager.getTimestamp(cacheKey));
        setLoading(false);
        setError(null);
        return;
      } else {
        setError('No cached data available offline');
        setLoading(false);
        return;
      }
    }

    // Online: fetch from API
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(url, fetchOptions);
      const responseData = response.data;

      // Save to cache
      cacheManager.set(cacheKey, responseData, cacheTTL);
      
      setData(responseData);
      setFromCache(false);
      setCacheTimestamp(Date.now());
      setError(null);
      
      console.log(`Fetched and cached: ${cacheKey}`);
    } catch (err) {
      console.error(`Fetch failed for ${cacheKey}:`, err);
      
      // Try to serve from cache on error
      const cached = cacheManager.get(cacheKey, cacheTTL);
      if (cached) {
        console.log(`Serving stale cache after error: ${cacheKey}`);
        setData(cached);
        setFromCache(true);
        setCacheTimestamp(cacheManager.getTimestamp(cacheKey));
        setError('Using cached data (network error)');
      } else {
        setError(err.message || 'Failed to load content');
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [url, cacheKey, cacheTTL, isOnline, fetchOptions]);

  // Initial fetch
  useEffect(() => {
    if (refetchOnMount) {
      fetchData();
    }
  }, [fetchData, refetchOnMount]);

  // Refetch when coming back online
  useEffect(() => {
    if (isOnline && refetchOnOnline && !loading) {
      fetchData(true);
    }
  }, [isOnline, refetchOnOnline, loading, fetchData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fromCache,
    cacheTimestamp,
    cacheAge: cacheTimestamp ? Date.now() - cacheTimestamp : null,
    formattedCacheTime: cacheTimestamp 
      ? cacheManager.formatTimestamp(cacheKey)
      : 'Not cached',
    refresh,
    isOnline
  };
}