// frontend/src/hooks/useNetworkStatus.js
// Hook to detect and monitor online/offline status

import { useState, useEffect } from 'react';

export default function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [wasOffline, setWasOffline] = useState(false);
  const [offlineDuration, setOfflineDuration] = useState(0);
  const [offlineStartTime, setOfflineStartTime] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Network: Online');
      setIsOnline(true);
      
      if (offlineStartTime) {
        const duration = Date.now() - offlineStartTime;
        setOfflineDuration(duration);
        setWasOffline(true);
        setOfflineStartTime(null);
        
        // Clear "was offline" flag after 5 seconds
        setTimeout(() => setWasOffline(false), 5000);
      }
    };

    const handleOffline = () => {
      console.log('Network: Offline');
      setIsOnline(false);
      setOfflineStartTime(Date.now());
      setWasOffline(false);
    };

    // Set initial state
    if (!navigator.onLine && !offlineStartTime) {
      setOfflineStartTime(Date.now());
    }

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineStartTime]);

  // Calculate current offline duration
  const getCurrentOfflineDuration = () => {
    if (isOnline || !offlineStartTime) return 0;
    return Date.now() - offlineStartTime;
  };

  // Format duration for display
  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
    offlineDuration: isOnline ? offlineDuration : getCurrentOfflineDuration(),
    formattedDuration: formatDuration(
      isOnline ? offlineDuration : getCurrentOfflineDuration()
    ),
    offlineStartTime
  };
}