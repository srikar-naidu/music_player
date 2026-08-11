import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase, presenceAvailable, PRESENCE_CHANNEL } from '../services/supabase';

export function usePresence() {
  const [onlineCount, setOnlineCount] = useState(0);
  const [status, setStatus] = useState('disconnected');
  const channelRef = useRef(null);
  const presenceRef = useRef({ state: {}, clients: {} });

  useEffect(() => {
    if (!presenceAvailable || !supabase) {
      setStatus('unavailable');
      return;
    }

    let mounted = true;

    async function setupPresence() {
      try {
        const channel = supabase.channel(PRESENCE_CHANNEL, {
          config: {
            presence: {
              key: `user-${Math.random().toString(36).slice(2, 8)}`,
            },
          },
        });

        channel.on('presence', { event: 'sync' }, () => {
          if (!mounted) return;
          const state = channel.presenceState();
          const count = Object.keys(state).length;
          setOnlineCount(count);
          setStatus('connected');
        });

        channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
          if (!mounted) return;
          const state = channel.presenceState();
          setOnlineCount(Object.keys(state).length);
        });

        channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          if (!mounted) return;
          const state = channel.presenceState();
          setOnlineCount(Object.keys(state).length);
        });

        channel.subscribe(async (status) => {
          if (!mounted) return;
          setStatus(status);

          if (status === 'SUBSCRIBED') {
            await channel.track({
              online_at: new Date().toISOString(),
              user_agent: navigator.userAgent,
            });
          }
        });

        channelRef.current = channel;
      } catch (error) {
        console.error('Presence setup failed:', error);
        if (mounted) {
          setStatus('error');
        }
      }
    }

    setupPresence();

    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  const refresh = useCallback(async () => {
    if (channelRef.current) {
      await channelRef.current.track({
        online_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
      });
    }
  }, []);

  return { onlineCount, status, refresh };
}
