import { useState, useEffect, useCallback } from 'react';
import { BadgeItem, PROFILE_DATA } from '../data/portfolioData';

const SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 Hours

export function useCredlySync() {
  const [badges, setBadges] = useState<BadgeItem[]>(PROFILE_DATA.badges);
  const [lastSyncTime, setLastSyncTime] = useState<number>(Date.now());
  const [nextSyncTime, setNextSyncTime] = useState<number>(Date.now() + SYNC_INTERVAL_MS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Fetch badges from server proxy
  const fetchBadges = useCallback(async (force = false) => {
    setIsSyncing(true);
    try {
      const url = force ? '/api/badges?force=true' : '/api/badges';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.badges && Array.isArray(data.badges) && data.badges.length > 0) {
          setBadges(data.badges);
          setLastSyncTime(data.lastSyncTime || Date.now());
          setNextSyncTime(data.nextSyncTime || Date.now() + SYNC_INTERVAL_MS);
          setSyncStatus(data.status === 'success' ? 'success' : 'error');
        }
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
      console.warn('[Credly Client] Could not fetch live badges, using cached/baseline:', err);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Initial fetch on mount + check if 24 hours have elapsed
  useEffect(() => {
    fetchBadges(false);

    // 24-hour interval timer
    const interval = setInterval(() => {
      console.log('[Credly Client] 24-hour sync interval reached. Triggering live check...');
      fetchBadges(true);
    }, SYNC_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchBadges]);

  const syncNow = useCallback(() => {
    return fetchBadges(true);
  }, [fetchBadges]);

  return {
    badges,
    isSyncing,
    syncStatus,
    lastSyncTime,
    nextSyncTime,
    syncNow,
    totalBadges: badges.length,
  };
}
