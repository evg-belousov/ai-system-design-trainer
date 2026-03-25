import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from '@/hooks/useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start with initial time', () => {
    const { result } = renderHook(() => useTimer(300));
    expect(result.current.timeLeft).toBe(300);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isExpired).toBe(false);
  });

  it('should count down when started', () => {
    const { result } = renderHook(() => useTimer(10));

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(7);
  });

  it('should stop when paused', () => {
    const { result } = renderHook(() => useTimer(10));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    act(() => {
      result.current.pause();
    });

    expect(result.current.isRunning).toBe(false);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(7);
  });

  it('should expire at 0', () => {
    const onExpire = vi.fn();
    const { result } = renderHook(() => useTimer(3, onExpire));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isExpired).toBe(true);
    expect(onExpire).toHaveBeenCalledOnce();
  });

  it('should reset to initial time', () => {
    const { result } = renderHook(() => useTimer(10));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.timeLeft).toBe(10);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isExpired).toBe(false);
  });
});
