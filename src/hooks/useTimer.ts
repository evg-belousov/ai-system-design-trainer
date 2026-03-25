'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export function useTimer(initialSeconds: number, onExpire?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);

  onExpireRef.current = onExpire;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isExpired) return;
    setIsRunning(true);
  }, [isExpired]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback((newSeconds?: number) => {
    clearTimer();
    setTimeLeft(newSeconds ?? initialSeconds);
    setIsRunning(false);
    setIsExpired(false);
  }, [initialSeconds, clearTimer]);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          setIsExpired(true);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, clearTimer]);

  return { timeLeft, isRunning, isExpired, start, pause, reset };
}
